-- Coastal Retreat — Migration v4
-- Chạy SAU migration_v3.sql.
-- Thêm: coupons, wishlist, loyalty_points, notifications

-- ============================================================
-- 1. Bảng mã giảm giá (coupons)
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percent', -- 'percent' | 'fixed'
  discount_value DECIMAL NOT NULL,               -- 20 = 20% hoặc 50000 = 50.000₫
  min_order_amount DECIMAL DEFAULT 0,
  max_uses INT DEFAULT NULL,                     -- NULL = không giới hạn
  current_uses INT DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,          -- NULL = không hết hạn
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_select_active" ON coupons FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "coupons_admin_write" ON coupons FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Theo dõi mã nào user đã dùng
CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coupon_id UUID REFERENCES coupons(id),
  user_id UUID REFERENCES profiles(id),
  payment_id UUID REFERENCES payments(id),
  discount_amount DECIMAL NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupon_uses_own" ON coupon_uses FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "coupon_uses_insert_own" ON coupon_uses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 2. Wishlist — khách lưu phòng yêu thích
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, room_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist_own" ON wishlist FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 3. Loyalty points
-- ============================================================
CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  points INT NOT NULL,                           -- + earn, - redeem
  reason TEXT NOT NULL,                          -- 'room_booking', 'redeem', v.v.
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loyalty_own" ON loyalty_points FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "loyalty_insert_own" ON loyalty_points FOR INSERT WITH CHECK (auth.uid() = user_id);

-- View: tổng điểm hiện tại của mỗi user
CREATE OR REPLACE VIEW loyalty_balances AS
  SELECT user_id, SUM(points) AS balance
  FROM loyalty_points
  GROUP BY user_id;

-- ============================================================
-- 4. Notifications — in-app
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info',                      -- 'booking', 'order', 'promo', 'info'
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON notifications FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_admin_insert" ON notifications FOR INSERT
  WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications (user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons (code) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist (user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_user ON loyalty_points (user_id, created_at DESC);

-- ============================================================
-- Seed coupon mẫu
-- ============================================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, valid_until)
VALUES
  ('WELCOME10', 'Giảm 10% cho lần đặt đầu tiên', 'percent', 10, 500000, 100, now() + interval '1 year'),
  ('SUMMER50K', 'Giảm 50.000₫ đơn từ 1 triệu', 'fixed', 50000, 1000000, 50, now() + interval '6 months'),
  ('VIP20', 'Giảm 20% cho khách VIP', 'percent', 20, 0, NULL, NULL)
ON CONFLICT (code) DO NOTHING;
