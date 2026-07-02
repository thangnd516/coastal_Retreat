import { Box, Typography } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import CouponManager from "./CouponManager";

export default async function AdminCoupons() {
  const supabase = await createClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Mã giảm giá
      </Typography>
      <Typography sx={{ mt: 0.5, mb: 3, fontSize: 13, color: "text.secondary" }}>
        Tạo và quản lý mã khuyến mãi cho khách. Khách nhập mã khi đặt phòng để được giảm giá.
      </Typography>
      <CouponManager coupons={coupons ?? []} />
    </Box>
  );
}
