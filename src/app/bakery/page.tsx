import { Box, Typography } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuOrderClient from "@/components/MenuOrderClient";
import { createClient } from "@/lib/supabase/server";

export default async function BakeryPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", "bakery")
    .order("name");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ px: { xs: 3, md: 7 }, py: 5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="overline" color="primary.main">
          BAKERY
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, fontSize: 36 }}>
          Bánh mới mỗi sáng
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 480, fontSize: 14, color: "text.secondary" }}>
          Đặt trước để nhận bánh nóng tại quầy hoặc giao trong khu nghỉ.
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 3, md: 7 }, py: 5 }}>
        <MenuOrderClient products={products ?? []} isLoggedIn={!!user} />
      </Box>

      <Footer />
    </Box>
  );
}
