import { Box, Typography, Stack } from "@mui/material";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@mui/material/Button";
import { createClient } from "@/lib/supabase/server";
import { formatVND, formatDate } from "@/lib/format";

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; id?: string }>;
}) {
  const { type, id } = await searchParams;
  const supabase = await createClient();

  let title = "Đặt chỗ thành công";
  let rows: { label: string; value: string }[] = [];
  let total = "";

  if (type === "room" && id) {
    const { data } = await supabase
      .from("room_bookings")
      .select("*, rooms(name)")
      .eq("id", id)
      .single();
    if (data) {
      title = "Đặt phòng thành công";
      rows = [
        { label: "Phòng", value: data.rooms?.name ?? "" },
        { label: "Nhận phòng", value: formatDate(data.check_in_date) },
        { label: "Trả phòng", value: formatDate(data.check_out_date) },
        { label: "Trạng thái", value: data.status },
      ];
      total = formatVND(Number(data.total_price));
    }
  } else if (type === "order" && id) {
    const { data } = await supabase.from("orders").select("*").eq("id", id).single();
    if (data) {
      title = "Đặt hàng thành công";
      rows = [
        { label: "Hình thức", value: data.order_type ?? "" },
        { label: "Trạng thái", value: data.status },
      ];
      total = formatVND(Number(data.total_amount));
    }
  } else if (type === "event" && id) {
    const { data } = await supabase
      .from("event_bookings")
      .select("*, events(title, event_date)")
      .eq("id", id)
      .single();
    if (data) {
      title = "Đặt vé thành công";
      rows = [
        { label: "Sự kiện", value: data.events?.title ?? "" },
        { label: "Số vé", value: String(data.ticket_quantity) },
        { label: "Trạng thái", value: data.status },
      ];
      total = formatVND(Number(data.total_price));
    }
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ maxWidth: 420, mx: "auto", px: 3, py: 12, textAlign: "center" }}>
        <Box
          sx={{
            mx: "auto",
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "primary.dark",
          }}
        >
          ✓
        </Box>
        <Typography variant="h2" sx={{ mt: 3, fontSize: 30 }}>
          {title}
        </Typography>
        {id && (
          <Typography sx={{ mt: 1.5, fontSize: 13, color: "text.secondary" }}>
            Mã tham chiếu{" "}
            <Box component="span" sx={{ fontFamily: "var(--font-plexmono), monospace", color: "primary.dark" }}>
              #{id.slice(0, 8).toUpperCase()}
            </Box>
            . Chúng tôi đã ghi nhận yêu cầu thanh toán của bạn.
          </Typography>
        )}

        {rows.length > 0 && (
          <Stack
            spacing={1.5}
            sx={{ mt: 4, textAlign: "left", border: "1px solid", borderColor: "divider", bgcolor: "#F2EDE4", p: 3, fontSize: 14 }}
          >
            {rows.map((r) => (
              <Box key={r.label} sx={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6B6358" }}>{r.label}</span>
                <span>{r.value}</span>
              </Box>
            ))}
            {total && (
              <Box sx={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid", borderColor: "divider", pt: 1.5, fontFamily: "var(--font-cormorant), serif", fontSize: 18, color: "primary.dark" }}>
                <span>Tổng</span>
                <span>{total}</span>
              </Box>
            )}
          </Stack>
        )}

        <Button href="/" component={Link} variant="contained" sx={{ mt: 4 }}>
          Về trang chủ
        </Button>
      </Box>

      <Footer />
    </Box>
  );
}
