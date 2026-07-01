-- Coastal Retreat — Supabase schema
-- Chạy file này trong SQL Editor của Supabase project trước khi dùng app.

-- Kích hoạt extension để tạo UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tạo bảng Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer', -- 'admin' hoặc 'customer'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Quản lý danh sách phòng
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- Ví dụ: Single, Double, Dorm
  description TEXT,
  price_per_night DECIMAL NOT NULL,
  capacity INT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Quản lý đơn đặt phòng
CREATE TABLE room_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  room_id UUID REFERENCES rooms(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Quản lý Menu (Cafe & Bakery)
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'cafe' hoặc 'bakery'
  description TEXT,
  price DECIMAL NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Quản lý Đơn hàng (Giỏ hàng thanh toán)
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  total_amount DECIMAL NOT NULL,
  order_type TEXT, -- 'dine_in', 'takeaway', 'room_service'
  status TEXT DEFAULT 'pending', -- pending, preparing, ready, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Chi tiết từng món trong đơn hàng
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL NOT NULL -- Lưu giá tại thời điểm mua tránh việc đổi giá sau này làm sai lịch sử
);

-- Quản lý Sự kiện
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  price_per_ticket DECIMAL NOT NULL,
  max_attendees INT NOT NULL,
  current_attendees INT DEFAULT 0,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Quản lý Đăng ký sự kiện của khách
CREATE TABLE event_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  event_id UUID REFERENCES events(id),
  ticket_quantity INT NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'confirmed', -- confirmed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Quản lý giao dịch chung cho tất cả các loại dịch vụ
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  reference_type TEXT NOT NULL, -- 'room_booking', 'cafe_order', 'event_booking'
  reference_id UUID NOT NULL, -- ID của đơn hàng tương ứng
  amount DECIMAL NOT NULL,
  payment_method TEXT, -- 'credit_card', 'momo', 'vnpay', 'cash'
  status TEXT DEFAULT 'pending', -- pending, success, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- =========================================================
-- Trigger: tự tạo profile khi có user mới đăng ký qua Supabase Auth
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- Row Level Security
-- =========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Helper: kiểm tra role admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: user xem/sửa của chính mình, admin xem tất cả
CREATE POLICY "profiles_select_own_or_admin" ON profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Rooms: ai cũng xem được, chỉ admin sửa
CREATE POLICY "rooms_select_all" ON rooms FOR SELECT USING (true);
CREATE POLICY "rooms_admin_write" ON rooms FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Room bookings: user xem/tạo booking của mình, admin xem/sửa tất cả
CREATE POLICY "room_bookings_select_own_or_admin" ON room_bookings FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "room_bookings_insert_own" ON room_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "room_bookings_admin_write" ON room_bookings FOR UPDATE
  USING (public.is_admin());

-- Products: ai cũng xem được, chỉ admin sửa
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_write" ON products FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Orders: user xem/tạo của mình, admin xem/sửa tất cả
CREATE POLICY "orders_select_own_or_admin" ON orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "orders_insert_own" ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_write" ON orders FOR UPDATE
  USING (public.is_admin());

-- Order items: theo quyền của order cha
CREATE POLICY "order_items_select" ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_id
    AND (o.user_id = auth.uid() OR public.is_admin())
  ));
CREATE POLICY "order_items_insert" ON order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid()
  ));

-- Events: ai cũng xem được, chỉ admin sửa
CREATE POLICY "events_select_all" ON events FOR SELECT USING (true);
CREATE POLICY "events_admin_write" ON events FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Event bookings: user xem/tạo của mình, admin xem/sửa tất cả
CREATE POLICY "event_bookings_select_own_or_admin" ON event_bookings FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "event_bookings_insert_own" ON event_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "event_bookings_admin_write" ON event_bookings FOR UPDATE
  USING (public.is_admin());

-- Blogs: ai cũng xem bài đã publish, admin xem/sửa tất cả
CREATE POLICY "blogs_select_published_or_admin" ON blogs FOR SELECT
  USING (is_published = true OR public.is_admin());
CREATE POLICY "blogs_admin_write" ON blogs FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Payments: user xem của mình, admin xem/sửa tất cả; tạo qua server (service role) hoặc chính chủ
CREATE POLICY "payments_select_own_or_admin" ON payments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "payments_insert_own" ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payments_admin_write" ON payments FOR UPDATE
  USING (public.is_admin());
