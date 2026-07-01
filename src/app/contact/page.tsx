import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function ContactPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Grid container spacing={5} sx={{ px: { xs: 3, md: 7 }, py: 6 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="overline" color="primary.main">
            LIÊN HỆ
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, fontSize: 36 }}>
            Nói chuyện với chúng tôi
          </Typography>
          <Typography sx={{ mt: 1.5, maxWidth: 420, fontSize: 14, color: "text.secondary" }}>
            Mỹ Khê, Đà Nẵng · hello@coastalretreat.vn · +84 905 123 456
          </Typography>

          <Box component="form" sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1.75, maxWidth: 420 }}>
            <TextField label="Họ và tên" size="small" />
            <TextField label="Email" size="small" />
            <TextField label="Nội dung" size="small" multiline rows={5} />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
              Gửi liên hệ
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ImagePlaceholder label="bản đồ vị trí" height="100%" sx={{ minHeight: 360 }} />
        </Grid>
      </Grid>

      <Footer />
    </Box>
  );
}
