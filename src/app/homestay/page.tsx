import Link from "next/link";
import { Box, Typography, Grid, Card, CardActionArea } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";

export default async function HomestayPage() {
  const supabase = await createClient();
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_available", true)
    .order("price_per_night", { ascending: true });

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ px: { xs: 3, md: 7 }, py: 5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="overline" color="primary.main">
          HOMESTAY
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, fontSize: 36 }}>
          Phòng &amp; bungalow
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 480, fontSize: 14, color: "text.secondary" }}>
          {rooms?.length ?? 0} hạng phòng đang sẵn sàng, tất cả đều có ban
          công hoặc sân riêng hướng vườn hoặc hướng biển.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ px: { xs: 3, md: 7 }, py: 6 }}>
        {(rooms ?? []).map((room) => (
          <Grid size={{ xs: 12, md: 6 }} key={room.id}>
            <Card variant="outlined" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, overflow: "hidden" }}>
              {/* Bọc bằng thẻ Link thay vì truyền component vào CardActionArea */}
              <Link href={`/homestay/${room.id}`} style={{ textDecoration: "none", color: "inherit", width: "100%" }}>
                <CardActionArea
                  sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "stretch" }}
                >
                  <ImagePlaceholder
                    label={room.name.toLowerCase()}
                    height={176}
                    sx={{ width: { xs: "100%", sm: 224 }, flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1, p: 2.5, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontSize: 20 }}>
                        {room.name}
                      </Typography>
                      <Typography sx={{ mt: 0.75, fontSize: 13, color: "text.secondary" }}>
                        {room.capacity} khách · {room.type}
                      </Typography>
                      {room.description && (
                        <Typography sx={{ mt: 1, fontSize: 13, color: "text.secondary" }}>
                          {room.description}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, color: "primary.dark" }}>
                        {formatVND(room.price_per_night)}
                        <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
                          {" "}/đêm
                        </Typography>
                      </Typography>
                      <Typography
                        sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 11, color: "primary.dark" }}
                      >
                        XEM CHI TIẾT →
                      </Typography>
                    </Box>
                  </Box>
                </CardActionArea>
              </Link>
            </Card>
          </Grid>
        ))}
        {(!rooms || rooms.length === 0) && (
          <Grid size={12}>
            <Typography color="text.secondary">
              Chưa có dữ liệu phòng. Hãy chạy file `supabase/seed.sql` trong
              Supabase project của bạn.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Footer />
    </Box>
  );
}