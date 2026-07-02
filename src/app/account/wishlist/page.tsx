import Link from "next/link";
import { Box, Typography, Grid, Card, CardActionArea, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmartImage from "@/components/SmartImage";
import { requireUser } from "@/lib/auth";
import { formatVND } from "@/lib/format";
import { toggleWishlist } from "../actions";

export default async function WishlistPage() {
  const { supabase, user } = await requireUser();

  const { data: items } = await supabase
    .from("wishlist")
    .select("*, rooms(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Box sx={{ px: { xs: 3, md: 7 }, py: 5 }}>
        <Typography variant="overline" color="primary.main">TÀI KHOẢN</Typography>
        <Typography variant="h2" sx={{ mt: 1, fontSize: 30 }}>
          Phòng yêu thích
        </Typography>

        {items && items.length > 0 ? (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {items.map((item) => {
              const room = item.rooms;
              if (!room) return null;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Card variant="outlined" sx={{ overflow: "hidden", position: "relative" }}>
                    <CardActionArea component={Link} href={`/homestay/${room.id}`}>
                      <SmartImage src={room.image_url} label={room.name} height={160} />
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: 18 }}>{room.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                          {room.capacity} khách · {room.type}
                        </Typography>
                        <Typography sx={{ mt: 1, fontFamily: "var(--font-cormorant), serif", fontSize: 18, color: "primary.dark" }}>
                          {formatVND(room.price_per_night)}
                          <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}> /đêm</Typography>
                        </Typography>
                      </Box>
                    </CardActionArea>
                    <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                      <form action={async () => { "use server"; await toggleWishlist(room.id, true); }}>
                        <Button type="submit" size="small" sx={{ minWidth: 36, p: 0.5, color: "error.main", bgcolor: "rgba(255,255,255,.85)", "&:hover": { bgcolor: "rgba(255,255,255,1)" } }}>
                          <FavoriteIcon fontSize="small" />
                        </Button>
                      </form>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              Chưa có phòng nào trong danh sách yêu thích.
            </Typography>
            <Button href="/homestay" component={Link} variant="contained">
              Khám phá phòng
            </Button>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
}
