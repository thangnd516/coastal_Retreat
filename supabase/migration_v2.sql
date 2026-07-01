-- Coastal Retreat — Migration v2
-- Chạy SAU schema.sql + seed.sql. Thêm: ảnh thật (Storage), đánh giá phòng,
-- và index hỗ trợ tìm kiếm/lọc.

-- =========================================================
-- 1. Thêm cột ảnh cho rooms (products/events/blogs đã có sẵn)
-- =========================================================
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS image_url TEXT;

-- =========================================================
-- 2. Bảng đánh giá phòng (reviews)
-- =========================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES room_bookings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own_or_admin" ON reviews FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- =========================================================
-- 3. Index hỗ trợ tìm kiếm / lọc / kiểm tra trùng lịch
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_room_bookings_room_dates
  ON room_bookings (room_id, check_in_date, check_out_date)
  WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_reviews_room ON reviews (room_id);

-- =========================================================
-- 4. Storage bucket cho ảnh (rooms / products / events / blogs)
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('coastal-retreat', 'coastal-retreat', true)
ON CONFLICT (id) DO NOTHING;

-- Ai cũng xem được ảnh (bucket public)
CREATE POLICY "coastal_retreat_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'coastal-retreat');

-- Chỉ admin được upload / xóa ảnh
CREATE POLICY "coastal_retreat_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'coastal-retreat' AND public.is_admin());

CREATE POLICY "coastal_retreat_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'coastal-retreat' AND public.is_admin());

CREATE POLICY "coastal_retreat_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'coastal-retreat' AND public.is_admin());
