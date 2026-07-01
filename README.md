# Coastal Retreat — Next.js + MUI + Supabase

Bản full-stack của hệ thống Coastal Retreat: Next.js 16 (App Router) +
Material UI + Supabase (Auth, Database, RLS).

## 1. Setup Supabase

1. Tạo project mới tại https://supabase.com.
2. Vào **SQL Editor**, chạy lần lượt:
   - `supabase/schema.sql` — tạo bảng, trigger tự tạo profile khi đăng ký,
     và Row Level Security cho toàn bộ bảng.
   - `supabase/seed.sql` — dữ liệu mẫu cho rooms, products, events, blogs.
   - `supabase/migration_v2.sql` — thêm cột ảnh cho rooms, bảng `reviews`,
     index hỗ trợ tìm kiếm, và Storage bucket `coastal-retreat` (public,
     chỉ admin được upload/xóa).
3. Vào **Project Settings → API**, lấy `Project URL` và `anon public key`.

## 2. Cấu hình môi trường

```bash
cp .env.local.example .env.local
```

Điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 3. Cài đặt & chạy

```bash
npm install
npm run dev
```

## 4. Tạo tài khoản admin

Mặc định mọi tài khoản đăng ký mới có `role = 'customer'`. Để có quyền
admin, vào Supabase → **Table Editor → profiles**, sửa `role` của user
tương ứng thành `admin`. Sau đó đăng nhập lại, menu **Admin** sẽ hiện trong
header và `/admin` sẽ truy cập được.

## Cấu trúc chức năng

**Website khách (public):**
- `/` Trang chủ
- `/homestay`, `/homestay/[id]` — danh sách & chi tiết phòng, đặt phòng
  thật (ghi vào `room_bookings` + `payments`)
- `/cafe`, `/bakery` — thực đơn từ bảng `products`, giỏ hàng tạo
  `orders` + `order_items` + `payments`
- `/events`, `/events/[id]` — sự kiện từ bảng `events`, đặt vé ghi vào
  `event_bookings`, tự cập nhật `current_attendees`
- `/blog`, `/blog/[slug]` — bài viết từ bảng `blogs` (chỉ hiện bài đã
  `is_published`)
- `/login` — đăng nhập / đăng ký qua Supabase Auth
- `/account` — lịch sử đặt phòng / đơn hàng / vé sự kiện của user hiện tại
- `/about`, `/contact`

**Khu quản trị (`/admin`, yêu cầu role = admin):**
- Dashboard — doanh thu & lượt đặt trong tháng tính từ dữ liệu thật
- Quản lý đặt phòng / đơn hàng / vé sự kiện — đổi trạng thái trực tiếp
- Quản lý phòng (CRUD `rooms`)
- Quản lý thực đơn (CRUD `products`)
- Quản lý khách hàng — tổng hợp từ bảng `payments`
- Quản lý sự kiện (CRUD `events`)
- Quản lý bài viết (CRUD `blogs`)
- Cài đặt hồ sơ admin

## Ghi chú về thanh toán

Phương thức thanh toán (VNPay/MoMo/thẻ/tiền mặt) hiện được lưu như một
nhãn trong bảng `payments` với trạng thái `pending`. Đây là phần khung —
để thanh toán thật cần tích hợp SDK/webhook của VNPay hoặc MoMo và cập
nhật `payments.status` khi nhận callback.

## Tính năng đã bổ sung thêm

- **Upload ảnh thật** qua Supabase Storage (bucket `coastal-retreat`):
  admin có thể tải ảnh khi tạo/sửa phòng, món ăn, sự kiện, bài blog.
  Trang khách tự động hiện ảnh thật thay cho placeholder khi có ảnh.
- **Chặn trùng lịch đặt phòng**: khi tạo booking, hệ thống kiểm tra các
  booking `pending`/`confirmed` khác của cùng phòng có giao ngày hay
  không, từ chối nếu trùng.
- **Đánh giá & xếp hạng phòng** (bảng `reviews` mới): khách đã đăng nhập
  có thể để lại sao + bình luận trên trang chi tiết phòng; điểm trung
  bình hiển thị ngay cạnh tên phòng.
- **Tìm kiếm & lọc**:
  - `/homestay`: lọc theo ngày nhận/trả phòng (loại phòng đã có người
    đặt trùng ngày) và số khách tối thiểu.
  - `/cafe`, `/bakery`: ô tìm kiếm theo tên/mô tả món, lọc tức thời phía
    client.
