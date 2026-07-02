import { Box, Typography, Grid, Card } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";

export default async function StaffDashboard() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [{ data: todayOrders }, { data: pendingOrders }, { data: preparingOrders }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("total_amount, status")
        .gte("created_at", today.toISOString()),
      supabase.from("orders").select("id").eq("status", "pending"),
      supabase.from("orders").select("id").eq("status", "preparing"),
    ]);

  const todayRevenue = (todayOrders ?? []).reduce(
    (s, o) => s + Number(o.total_amount),
    0
  );

  const kpis = [
    { label: "Đơn hôm nay", val: String(todayOrders?.length ?? 0) },
    { label: "Doanh thu hôm nay", val: formatVND(todayRevenue) },
    { label: "Chờ xử lý", val: String(pendingOrders?.length ?? 0) },
    { label: "Đang pha chế", val: String(preparingOrders?.length ?? 0) },
  ];

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 28 }}>
        Xin chào 👋
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
        Nhìn lại hoạt động của ca hôm nay.
      </Typography>

      <Grid container spacing={2.5} sx={{ mt: 1 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 12, sm: 6 }} key={k.label}>
            <Card variant="outlined" sx={{ p: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-plexmono), monospace",
                  fontSize: 11,
                  color: "text.secondary",
                }}
              >
                {k.label.toUpperCase()}
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 26,
                  color: "primary.dark",
                }}
              >
                {k.val}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
