import { Box, Typography, TextField, Button, Stack, Avatar } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { requireUser } from "@/lib/auth";
import { updateProfile } from "../actions";

export default async function ProfilePage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: loyaltyRows } = await supabase
    .from("loyalty_points")
    .select("points")
    .eq("user_id", user.id);
  const balance = (loyaltyRows ?? []).reduce((s, r) => s + r.points, 0);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Box sx={{ maxWidth: 480, mx: "auto", px: 3, py: 8 }}>
        <Typography variant="overline" color="primary.main">TÀI KHOẢN</Typography>
        <Typography variant="h2" sx={{ mt: 1, fontSize: 30 }}>Hồ sơ cá nhân</Typography>

        <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 2.5 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main", fontSize: 24 }}>
            {profile?.full_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
              {profile?.full_name || "Chưa cập nhật"}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{user.email}</Typography>
            {balance > 0 && (
              <Typography sx={{ fontSize: 12, color: "primary.dark", mt: 0.5 }}>
                🌟 {balance.toLocaleString()} điểm tích lũy
              </Typography>
            )}
          </Box>
        </Box>

        <Box component="form" action={updateProfile} sx={{ mt: 4 }}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={user.email ?? ""}
              size="small"
              disabled
              fullWidth
            />
            <TextField
              name="full_name"
              label="Họ và tên"
              defaultValue={profile?.full_name ?? ""}
              size="small"
              fullWidth
            />
            <TextField
              name="phone"
              label="Số điện thoại"
              defaultValue={profile?.phone ?? ""}
              size="small"
              fullWidth
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
              Lưu thay đổi
            </Button>
          </Stack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
