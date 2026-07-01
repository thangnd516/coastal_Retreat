import { Box, Typography, Grid, Card } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { formatVND, formatDate } from "@/lib/format";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { data: roomBookingsThisMonth },
    { data: ordersThisMonth },
    { data: eventBookingsThisMonth },
    { data: rooms },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from("room_bookings").select("total_price, status, created_at").gte("created_at", startOfMonth),
    supabase.from("orders").select("total_amount, status, created_at").gte("created_at", startOfMonth),
    supabase.from("event_bookings").select("total_price, status, created_at").gte("created_at", startOfMonth),
    supabase.from("rooms").select("id"),
    supabase
      .from("room_bookings")
      .select("*, rooms(name), profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const roomRevenue = (roomBookingsThisMonth ?? [])
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + Number(b.total_price), 0);
  const orderRevenue = (ordersThisMonth ?? [])
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total_amount), 0);
  const eventRevenue = (eventBookingsThisMonth ?? [])
    .filter((e) => e.status !== "cancelled")
    .reduce((s, e) => s + Number(e.total_price), 0);
  const totalRevenue = roomRevenue + orderRevenue + eventRevenue;

  const totalBookingsThisMonth =
    (roomBookingsThisMonth?.length ?? 0) +
    (ordersThisMonth?.length ?? 0) +
    (eventBookingsThisMonth?.length ?? 0);

  const kpis = [
    { label: "Doanh thu tháng", val: formatVND(totalRevenue) },
    { label: "Lượt đặt/đơn tháng", val: String(totalBookingsThisMonth) },
    { label: "Số phòng", val: String(rooms?.length ?? 0) },
    {
      label: "Doanh thu phòng / café / event",
      val: `${formatVND(roomRevenue)} · ${formatVND(orderRevenue)} · ${formatVND(eventRevenue)}`,
    },
  ];

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Revenue Dashboard
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
        Tổng quan hoạt động tháng {now.getMonth() + 1}/{now.getFullYear()}
      </Typography>

      <Grid container spacing={2.5} sx={{ mt: 1 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={k.label}>
            <Card variant="outlined" sx={{ p: 2.5 }}>
              <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 11, color: "text.secondary" }}>
                {k.label.toUpperCase()}
              </Typography>
              <Typography sx={{ mt: 1, fontFamily: "var(--font-cormorant), serif", fontSize: 20 }}>
                {k.val}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 5, fontSize: 20 }}>
        Đặt phòng gần đây
      </Typography>
      <Box sx={{ mt: 1.5, border: "1px solid", borderColor: "divider" }}>
        {(recentBookings ?? []).map((b) => (
          <Box
            key={b.id}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              px: 2.5,
              py: 1.75,
              fontSize: 14,
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-of-type": { borderBottom: "none" },
            }}
          >
            <Box sx={{ fontFamily: "var(--font-plexmono), monospace", color: "text.secondary", minWidth: 90 }}>
              #{b.id.slice(0, 6)}
            </Box>
            <Box sx={{ minWidth: 140 }}>{b.profiles?.full_name ?? "—"}</Box>
            <Box sx={{ flex: 1, minWidth: 140, color: "text.secondary" }}>{b.rooms?.name}</Box>
            <Box sx={{ color: "text.secondary" }}>{formatDate(b.created_at)}</Box>
            <Box sx={{ fontFamily: "var(--font-cormorant), serif", color: "primary.dark" }}>
              {formatVND(Number(b.total_price))}
            </Box>
          </Box>
        ))}
        {(!recentBookings || recentBookings.length === 0) && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có đặt phòng nào.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
