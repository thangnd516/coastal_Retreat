import { notFound } from "next/navigation";
import { Box, Typography, Grid } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import BookingForm from "./BookingForm";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";

const amenities = [
  "Wi-Fi miễn phí",
  "Bếp nhỏ",
  "Điều hòa",
  "Hồ bơi chung",
  "Bãi đỗ xe",
  "Ban công hướng biển",
];

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (!room) return notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ px: { xs: 3, md: 7 }, py: 4 }}>
        <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 11, color: "text.secondary" }}>
          Homestay / {room.name}
        </Typography>

        <Box sx={{ mt: 2.5, display: "grid", gridTemplateColumns: "3fr 1fr", gap: 1.5, height: { xs: "auto", md: 380 } }}>
          <ImagePlaceholder label="ảnh chính phòng" height="100%" sx={{ minHeight: 240 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <ImagePlaceholder label="ảnh 2" height="100%" sx={{ minHeight: 76 }} />
            <ImagePlaceholder label="ảnh 3" height="100%" sx={{ minHeight: 76 }} />
            <ImagePlaceholder label="ảnh 4" height="100%" sx={{ minHeight: 76 }} />
          </Box>
        </Box>

        <Grid container spacing={5} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h2" sx={{ fontSize: 36 }}>
              {room.name}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 14, color: "text.secondary" }}>
              {room.capacity} khách · {room.type}
            </Typography>

            <Box sx={{ mt: 3, height: "1px", bgcolor: "divider" }} />

            <Typography variant="h4" sx={{ mt: 3, fontSize: 24 }}>
              Mô tả
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 560, fontSize: 14, lineHeight: 1.7, color: "text.secondary" }}>
              {room.description ||
                "Không gian ấm cúng, mở ra ban công riêng hướng vườn dừa và biển Mỹ Khê. Nội thất gỗ tối giản, ánh sáng tự nhiên, phù hợp cho kỳ nghỉ dưỡng dài ngày hoặc cuối tuần thư giãn."}
            </Typography>

            <Typography variant="h4" sx={{ mt: 4, fontSize: 24 }}>
              Tiện nghi
            </Typography>
            <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
              {amenities.map((a) => (
                <Grid size={6} key={a}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 14, color: "text.secondary" }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main" }} />
                    {a}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: "sticky", top: 24, border: "1px solid", borderColor: "divider", bgcolor: "#F2EDE4", p: 3 }}>
              <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24, color: "primary.dark" }}>
                {formatVND(room.price_per_night)}
                <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
                  {" "}/đêm
                </Typography>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <BookingForm
                  roomId={room.id}
                  pricePerNight={Number(room.price_per_night)}
                  isLoggedIn={!!user}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}
