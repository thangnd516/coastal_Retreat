import { Box, Typography } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import OccupancyCalendar from "@/components/OccupancyCalendar";

export default async function AdminCalendarPage() {
  const supabase = await createClient();

  const [{ data: rooms }, { data: bookings }] = await Promise.all([
    supabase.from("rooms").select("*").order("price_per_night"),
    supabase
      .from("room_bookings")
      .select("room_id, check_in_date, check_out_date, status")
      .not("status", "eq", "cancelled"),
  ]);

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Lịch tình trạng phòng
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
        Xem tổng quan phòng nào còn trống theo ngày.
      </Typography>
      <OccupancyCalendar rooms={rooms ?? []} bookings={bookings ?? []} />
    </Box>
  );
}
