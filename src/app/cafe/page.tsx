import { Box, Typography } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuOrderClient from "@/components/MenuOrderClient";
import { createClient } from "@/lib/supabase/server";

export default async function CafePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", "cafe")
    .order("name");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box className="hatch" sx={{ height: 224, display: "flex", flexDirection: "column", justifyContent: "center", px: { xs: 3, md: 7 } }}>
        <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 11, color: "text.secondary" }}>
          [ café — quầy pha chế ]
        </Typography>
        <Typography variant="h2" sx={{ mt: 1.5, fontSize: 36 }}>
          Thực đơn Café
        </Typography>
        <Typography sx={{ mt: 1, maxWidth: 420, fontSize: 14, color: "#5A5346" }}>
          Cà phê đặc sản, trà &amp; matcha, đồ uống signature ven biển.
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 3, md: 7 }, py: 5 }}>
        <MenuOrderClient products={products ?? []} isLoggedIn={!!user} />
      </Box>

      <Footer />
    </Box>
  );
}
