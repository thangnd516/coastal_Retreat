import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { requireAdmin } from "@/lib/auth";
import { updateAdminProfile } from "./actions";

export default async function AdminSettings() {
  const { supabase, user } = await requireAdmin();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Cài đặt
      </Typography>

      <Box sx={{ mt: 3.5, maxWidth: 440, border: "1px solid", borderColor: "divider", p: 3 }}>
        <Typography variant="h5" sx={{ fontSize: 20 }}>
          Hồ sơ quản trị viên
        </Typography>
        <Box component="form" action={updateAdminProfile} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <TextField label="Email" value={user.email} size="small" disabled fullWidth />
            <TextField name="full_name" label="Họ và tên" defaultValue={profile?.full_name ?? ""} size="small" fullWidth />
            <TextField name="phone" label="Số điện thoại" defaultValue={profile?.phone ?? ""} size="small" fullWidth />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
              Lưu thay đổi
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ mt: 3.5, maxWidth: 440, border: "1px solid", borderColor: "divider", p: 3 }}>
        <Typography variant="h5" sx={{ fontSize: 20 }}>
          Kết nối Supabase
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: 13, color: "text.secondary", lineHeight: 1.7 }}>
          Database, RLS policy và bảng dữ liệu được quản lý trực tiếp trong
          Supabase project (file <code>supabase/schema.sql</code> trong mã
          nguồn). Phương thức thanh toán (VNPay/MoMo) hiện được lưu là nhãn
          trong bảng <code>payments</code> — kết nối cổng thanh toán thật cần
          tích hợp webhook riêng.
        </Typography>
      </Box>
    </Box>
  );
}
