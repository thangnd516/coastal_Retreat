-- Coastal Retreat — Seed data mẫu
-- Chạy SAU schema.sql để có dữ liệu demo (rooms, products, events, blogs).
-- Không seed profiles/bookings/orders vì các bảng đó cần user_id thật từ auth.users.

INSERT INTO rooms (name, type, description, price_per_night, capacity, is_available) VALUES
('Ocean View Studio', 'Studio', '2 khách · 1 giường · Hướng biển, ban công riêng nhìn ra biển Mỹ Khê.', 1250000, 2, true),
('Garden Loft', 'Loft', '3 khách · 2 giường · Ban công hướng vườn dừa, không gian mở hai tầng.', 1680000, 3, true),
('Coastal Suite', 'Suite', '4 khách · 2 giường · Sân riêng, phù hợp gia đình hoặc nhóm bạn.', 2400000, 4, true),
('Bamboo Bungalow', 'Bungalow', '2 khách · 1 giường · Sân vườn riêng, kiến trúc tre truyền thống.', 1420000, 2, true);

INSERT INTO products (name, category, description, price, is_available) VALUES
('Cà phê sữa đá', 'cafe', 'Cà phê phin truyền thống, sữa đặc.', 45000, true),
('Cold Brew Citrus', 'cafe', 'Ủ lạnh 12h, vỏ cam.', 60000, true),
('Sea Salt Latte', 'cafe', 'Espresso, kem muối biển.', 65000, true),
('Matcha Coconut', 'cafe', 'Matcha Uji, sữa dừa.', 68000, true),
('Pandan Latte', 'cafe', 'Lá dứa nhà làm, sữa yến mạch.', 62000, true),
('Việt Espresso Tonic', 'cafe', 'Robusta, tonic, chanh.', 58000, true),
('Sea Salt Croissant', 'bakery', 'Bơ Pháp, muối biển rắc mặt.', 38000, true),
('Pandan Kouign', 'bakery', 'Lá dứa, lớp vỏ caramel giòn.', 42000, true),
('Sourdough Loaf', 'bakery', 'Ủ men tự nhiên 24h.', 75000, true),
('Coconut Danish', 'bakery', 'Nhân dừa nạo, lớp vỏ ngàn lớp.', 40000, true),
('Mango Tart', 'bakery', 'Xoài cát Hòa Lộc theo mùa.', 55000, false),
('Cinnamon Roll', 'bakery', 'Quế Việt Nam, phủ kem phô mai.', 45000, true);

INSERT INTO events (title, description, event_date, price_per_ticket, max_attendees, current_attendees) VALUES
('Sunset Acoustic Night', 'Đêm nhạc acoustic ngoài trời trên rooftop, ngắm hoàng hôn Mỹ Khê.', '2026-07-12 18:30:00+07', 150000, 60, 24),
('Coastal Coffee Workshop', 'Workshop pha chế cà phê đặc sản cùng barista của Coastal Retreat.', '2026-07-19 09:00:00+07', 250000, 20, 9),
('Bakery Masterclass', 'Lớp học làm bánh sourdough và pastry cùng bếp trưởng bakery.', '2026-07-27 14:00:00+07', 320000, 15, 6),
('Beach Yoga & Brunch', 'Buổi yoga sáng sớm trên bãi biển kèm brunch nhẹ.', '2026-08-03 06:30:00+07', 180000, 30, 11);

INSERT INTO blogs (title, slug, content, is_published, published_at) VALUES
('48 giờ ở Đà Nẵng cho người yêu biển', '48-gio-da-nang',
 'Một hành trình 48 giờ khám phá Đà Nẵng dành cho những ai yêu biển: từ bình minh ở Mỹ Khê, ẩm thực địa phương, đến những góc hoàng hôn đẹp nhất thành phố.',
 true, '2026-06-24 09:00:00+07'),
('Bản đồ cà phê đặc sản ven biển', 'ban-do-ca-phe',
 'Tổng hợp những quán cà phê đặc sản đáng thử dọc cung đường biển Đà Nẵng, từ cold brew đến espresso tonic.',
 true, '2026-06-18 09:00:00+07'),
('Chọn homestay theo mùa gió', 'chon-homestay',
 'Hướng dẫn chọn loại phòng phù hợp theo mùa gió ở Đà Nẵng để có kỳ nghỉ thoải mái nhất.',
 true, '2026-06-09 09:00:00+07'),
('Chợ sớm và mẻ bánh đầu ngày', 'cho-som',
 'Câu chuyện về phiên chợ sớm gần Coastal Retreat và mẻ bánh đầu tiên ra lò mỗi sáng.',
 true, '2026-06-02 09:00:00+07');
