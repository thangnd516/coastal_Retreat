import { Box, Typography, Stack, Chip, Button } from "@mui/material";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { requireUser } from "@/lib/auth";
import { signout } from "@/app/login/actions";
import { formatVND, formatDate } from "@/lib/format";

const statusColor: Record<string, "success" | "warning" | "default" | "error"> = {
  confirmed: "success",
  pending: "warning",
  completed: "default",
  cancelled: "error",
  preparing: "warning",
  ready: "success",
};

export default async function AccountPage() {
  const { supabase, user } = await requireUser();

  const [{ data: roomBookings }, { data: orders }, { data: eventBookings }, { data: profile }] =
    await Promise.all([
      supabase
        .from("room_bookings")
        .select("*, rooms(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("event_bookings")
        .select("*, events(title)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").eq("id", user.id).single(),
    ]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ px: { xs: 3, md: 7 }, py: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="overline" color="primary.main">
              TÀI KHOẢN
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontSize: 30 }}>
              {profile?.full_name || user.email}
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
              {user.email}
            </Typography>
          </Box>
          <Box component="form" action={signout}>
            <Button type="submit" variant="outlined" size="small">
              Đăng xuất
            </Button>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mt: 5, fontSize: 20 }}>
          Đặt phòng
        </Typography>
        <Stack sx={{ mt: 1.5, border: "1px solid", borderColor: "divider" }} divider={<Box sx={{ height: "1px", bgcolor: "divider" }} />}>
          {(roomBookings ?? []).map((b) => (
            <Box key={b.id} sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, px: 2.5, py: 2, fontSize: 14 }}>
              <Box sx={{ flex: 1, minWidth: 160 }}>{b.rooms?.name}</Box>
              <Box sx={{ color: "text.secondary" }}>
                {formatDate(b.check_in_date)} → {formatDate(b.check_out_date)}
              </Box>
              <Box sx={{ fontFamily: "var(--font-cormorant), serif", color: "primary.dark" }}>
                {formatVND(Number(b.total_price))}
              </Box>
              <Chip size="small" label={b.status} color={statusColor[b.status] ?? "default"} />
            </Box>
          ))}
          {(!roomBookings || roomBookings.length === 0) && (
            <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
              Chưa có đặt phòng nào. <Link href="/homestay">Đặt phòng ngay →</Link>
            </Typography>
          )}
        </Stack>

        <Typography variant="h5" sx={{ mt: 5, fontSize: 20 }}>
          Đơn café / bakery
        </Typography>
        <Stack sx={{ mt: 1.5, border: "1px solid", borderColor: "divider" }} divider={<Box sx={{ height: "1px", bgcolor: "divider" }} />}>
          {(orders ?? []).map((o) => (
            <Box key={o.id} sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, px: 2.5, py: 2, fontSize: 14 }}>
              <Box sx={{ flex: 1, minWidth: 160 }}>{o.order_type}</Box>
              <Box sx={{ color: "text.secondary" }}>{formatDate(o.created_at)}</Box>
              <Box sx={{ fontFamily: "var(--font-cormorant), serif", color: "primary.dark" }}>
                {formatVND(Number(o.total_amount))}
              </Box>
              <Chip size="small" label={o.status} color={statusColor[o.status] ?? "default"} />
            </Box>
          ))}
          {(!orders || orders.length === 0) && (
            <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
              Chưa có đơn hàng nào.
            </Typography>
          )}
        </Stack>

        <Typography variant="h5" sx={{ mt: 5, fontSize: 20 }}>
          Vé sự kiện
        </Typography>
        <Stack sx={{ mt: 1.5, mb: 4, border: "1px solid", borderColor: "divider" }} divider={<Box sx={{ height: "1px", bgcolor: "divider" }} />}>
          {(eventBookings ?? []).map((e) => (
            <Box key={e.id} sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, px: 2.5, py: 2, fontSize: 14 }}>
              <Box sx={{ flex: 1, minWidth: 160 }}>{e.events?.title}</Box>
              <Box sx={{ color: "text.secondary" }}>{e.ticket_quantity} vé</Box>
              <Box sx={{ fontFamily: "var(--font-cormorant), serif", color: "primary.dark" }}>
                {formatVND(Number(e.total_price))}
              </Box>
              <Chip size="small" label={e.status} color={statusColor[e.status] ?? "default"} />
            </Box>
          ))}
          {(!eventBookings || eventBookings.length === 0) && (
            <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
              Chưa đặt vé sự kiện nào.
            </Typography>
          )}
        </Stack>
      </Box>

      <Footer />
    </Box>
  );
}
