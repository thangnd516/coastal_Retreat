export type UserRole = "customer" | "staff" | "admin";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
};

export type Room = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  price_per_night: number;
  capacity: number;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
};

export type RoomBookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type RoomBooking = {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: RoomBookingStatus;
  created_at: string;
  rooms?: Room;
  profiles?: Profile;
};

export type ProductCategory = "cafe" | "bakery";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
};

export type OrderType = "dine_in" | "takeaway" | "room_service";
export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  order_type: OrderType | null;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: Product;
};

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  price_per_ticket: number;
  max_attendees: number;
  current_attendees: number;
  thumbnail_url: string | null;
  created_at: string;
};

export type EventBookingStatus = "confirmed" | "cancelled";

export type EventBooking = {
  id: string;
  user_id: string;
  event_id: string;
  ticket_quantity: number;
  total_price: number;
  status: EventBookingStatus;
  created_at: string;
  events?: EventRow;
};

export type Blog = {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  room_id: string;
  user_id: string;
  booking_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: Profile;
};

export type AdminLog = {
  id: string;
  actor_id: string | null;
  action: string;
  target_table: string;
  target_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
  profiles?: Profile;
};

export type PaymentReferenceType = "room_booking" | "cafe_order" | "event_booking";
export type PaymentStatus = "pending" | "success" | "failed";
export type PaymentMethod = "credit_card" | "momo" | "vnpay" | "cash";

export type Payment = {
  id: string;
  user_id: string;
  reference_type: PaymentReferenceType;
  reference_id: string;
  amount: number;
  payment_method: PaymentMethod | null;
  status: PaymentStatus;
  created_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  room_id: string;
  created_at: string;
  rooms?: Room;
};

export type LoyaltyPoint = {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  reference_id: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: "booking" | "order" | "promo" | "info";
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
};
