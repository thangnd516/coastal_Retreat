-- ============================================================
-- Coastal Retreat — Migration v3
-- Chạy SAU schema.sql + seed.sql + migration_v2.sql.
--
-- Nội dung:
--   1. Chuyển cột `role` từ TEXT tự do → role_type ENUM (customer/staff/admin)
--   2. Thêm role 'staff' (nhân viên café/bakery): thấy orders, không thấy tài chính
--   3. Cập nhật helper functions: is_admin(), is_staff(), is_staff_or_admin()
--   4. Cập nhật RLS policies phù hợp với 3 role
--   5. Thêm bảng admin_logs (audit trail)
--   6. Thêm CHECK constraints bảo vệ dữ liệu
-- ============================================================

-- ============================================================
-- 1. Tạo ENUM type mới cho role
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
  END IF;
END $$;

-- Chuyển đổi cột role hiện tại sang ENUM
-- (Các giá trị không hợp lệ sẽ được đặt về 'customer')
ALTER TABLE profiles
  ALTER COLUMN role DROP DEFAULT;

UPDATE profiles
  SET role = 'customer'
  WHERE role NOT IN ('customer', 'staff', 'admin');

ALTER TABLE profiles
  ALTER COLUMN role TYPE user_role USING role::user_role;

ALTER TABLE profiles
  ALTER COLUMN role SET DEFAULT 'customer';

-- ============================================================
-- 2. Cập nhật trigger tạo profile khi user đăng ký
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    'customer'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. Helper functions kiểm tra quyền (thay thế is_admin() cũ)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'::user_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'staff'::user_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('staff'::user_role, 'admin'::user_role)
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- 4. Cập nhật RLS Policies theo 3 role
--    Staff: xem orders (không xem payments/bookings phòng/tài chính)
--    Admin: xem/sửa tất cả
-- ============================================================

-- --- profiles ---
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
CREATE POLICY "profiles_select_own_or_admin" ON profiles FOR SELECT
  USING (auth.uid() = id OR public.is_staff_or_admin());

-- --- orders: staff cũng được xem/cập nhật trạng thái ---
DROP POLICY IF EXISTS "orders_select_own_or_admin" ON orders;
CREATE POLICY "orders_select_own_or_admin" ON orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "orders_admin_write" ON orders;
CREATE POLICY "orders_update_staff_or_admin" ON orders FOR UPDATE
  USING (public.is_staff_or_admin());

-- --- order_items: staff được xem ---
DROP POLICY IF EXISTS "order_items_select" ON order_items;
CREATE POLICY "order_items_select" ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_id
    AND (o.user_id = auth.uid() OR public.is_staff_or_admin())
  ));

-- --- products: staff cũng được sửa thực đơn ---
DROP POLICY IF EXISTS "products_admin_write" ON products;
CREATE POLICY "products_staff_or_admin_write" ON products FOR ALL
  USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

-- --- payments: chỉ admin mới xem tài chính, staff không được ---
DROP POLICY IF EXISTS "payments_admin_write" ON payments;
CREATE POLICY "payments_admin_write" ON payments FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- 5. Bảng admin_logs — audit trail mọi hành động của staff/admin
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,          -- 'update_booking_status', 'delete_product', v.v.
  target_table TEXT NOT NULL,    -- 'room_bookings', 'products', v.v.
  target_id UUID,                -- ID của bản ghi bị tác động
  old_value JSONB,               -- Giá trị trước khi sửa
  new_value JSONB,               -- Giá trị sau khi sửa
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Chỉ staff/admin mới xem log
CREATE POLICY "admin_logs_select_staff_or_admin" ON admin_logs FOR SELECT
  USING (public.is_staff_or_admin());

-- Chỉ staff/admin mới tạo log (qua server action)
CREATE POLICY "admin_logs_insert_staff_or_admin" ON admin_logs FOR INSERT
  WITH CHECK (public.is_staff_or_admin());

-- Index hỗ trợ xem log theo người và thời gian
CREATE INDEX IF NOT EXISTS idx_admin_logs_actor ON admin_logs (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_table ON admin_logs (target_table, created_at DESC);

-- ============================================================
-- 6. CHECK constraints bảo vệ dữ liệu hợp lệ
-- ============================================================

-- Ngày trả phòng phải sau ngày nhận phòng
ALTER TABLE room_bookings
  DROP CONSTRAINT IF EXISTS chk_checkout_after_checkin,
  ADD CONSTRAINT chk_checkout_after_checkin
    CHECK (check_out_date > check_in_date);

-- Giá không âm
ALTER TABLE room_bookings
  DROP CONSTRAINT IF EXISTS chk_room_booking_price,
  ADD CONSTRAINT chk_room_booking_price CHECK (total_price >= 0);

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS chk_order_amount,
  ADD CONSTRAINT chk_order_amount CHECK (total_amount >= 0);

ALTER TABLE event_bookings
  DROP CONSTRAINT IF EXISTS chk_event_booking_price,
  ADD CONSTRAINT chk_event_booking_price CHECK (total_price >= 0 AND ticket_quantity > 0);

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS chk_product_price,
  ADD CONSTRAINT chk_product_price CHECK (price >= 0);

ALTER TABLE rooms
  DROP CONSTRAINT IF EXISTS chk_room_price,
  ADD CONSTRAINT chk_room_price CHECK (price_per_night >= 0 AND capacity > 0);

ALTER TABLE events
  DROP CONSTRAINT IF EXISTS chk_event_price,
  ADD CONSTRAINT chk_event_price
    CHECK (price_per_ticket >= 0 AND max_attendees > 0 AND current_attendees >= 0);

ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS chk_review_rating,
  ADD CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5);

ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS chk_payment_amount,
  ADD CONSTRAINT chk_payment_amount CHECK (amount > 0);

-- ============================================================
-- 7. Index bổ sung tăng tốc query phổ biến
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_room_bookings_user ON room_bookings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_bookings_user ON event_bookings (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments (reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_reviews_room_created ON reviews (room_id, created_at DESC);

-- ============================================================
-- Xem lại danh sách role trong hệ thống
-- ============================================================
-- customer: khách đặt phòng / order / vé
-- staff:    nhân viên café-bakery — thấy orders/products, không thấy payments/bookings tài chính
-- admin:    quản trị toàn quyền
--
-- Cách gán role:
--   Supabase Table Editor → profiles → sửa cột `role`
--   Hoặc dùng SQL: UPDATE profiles SET role = 'staff' WHERE id = '<user_id>';
