import { Box, Typography } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import RevenueAnalyzer from "./RevenueAnalyzer";
import ReviewAnalyzer from "./ReviewAnalyzer";
import RoomDescriptionWriter from "./RoomDescriptionWriter";
import BlogWriter from "./BlogWriter";

export default async function AdminAIPage() {
  const supabase = await createClient();

  // Lấy dữ liệu thật để AI phân tích
  const thirtyAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [
    { data: bookings30d },
    { data: orders30d },
    { data: events30d },
    { data: reviews },
    { data: rooms },
  ] = await Promise.all([
    supabase.from("room_bookings").select("total_price, status, created_at, room_id").gte("created_at", thirtyAgo).neq("status", "cancelled"),
    supabase.from("orders").select("total_amount, status, created_at").gte("created_at", thirtyAgo).neq("status", "cancelled"),
    supabase.from("event_bookings").select("total_price, status, created_at").gte("created_at", thirtyAgo).neq("status", "cancelled"),
    supabase.from("reviews").select("rating, comment, created_at, rooms(name)").order("created_at", { ascending: false }).limit(50),
    supabase.from("rooms").select("id, name, type, capacity, price_per_night"),
  ]);

  const roomRevenue = (bookings30d ?? []).reduce((s, b) => s + Number(b.total_price), 0);
  const cafeRevenue = (orders30d ?? []).reduce((s, o) => s + Number(o.total_amount), 0);
  const eventRevenue = (events30d ?? []).reduce((s, e) => s + Number(e.total_price), 0);

  const revenueData = {
    summary: {
      totalRevenue: roomRevenue + cafeRevenue + eventRevenue,
      roomRevenue,
      cafeRevenue,
      eventRevenue,
      totalBookings: (bookings30d?.length ?? 0) + (orders30d?.length ?? 0) + (events30d?.length ?? 0),
      avgRating: reviews && reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null,
    },
    data: { bookings30d, orders30d, events30d },
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontSize: 30 }}>AI Hub</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
          Công cụ AI hỗ trợ quản lý, phân tích và sáng tạo nội dung cho Coastal Retreat.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <RevenueAnalyzer revenueData={revenueData} />
        <ReviewAnalyzer reviews={(reviews ?? []).map(r => ({ rating: r.rating, comment: r.comment, room: (r.rooms as unknown as { name: string } | null)?.name }))} />
        <RoomDescriptionWriter rooms={(rooms ?? []).map(r => ({ id: r.id, name: r.name, type: r.type, capacity: r.capacity, price: Number(r.price_per_night) }))} />
        <BlogWriter />
      </Box>
    </Box>
  );
}
