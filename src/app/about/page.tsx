import { Box, Typography } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box className="hatch" sx={{ height: 288, display: "flex", flexDirection: "column", justifyContent: "center", px: { xs: 3, md: 7 } }}>
        <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 11, color: "text.secondary" }}>
          [ hero — sân vườn Coastal Retreat ]
        </Typography>
        <Typography variant="h2" sx={{ mt: 1.5, fontSize: 36 }}>
          Câu chuyện của chúng tôi
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 5, px: { xs: 3, md: 7 }, py: 6 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="primary.main">
            BẮT ĐẦU TỪ 2019
          </Typography>
          <Typography variant="h3" sx={{ mt: 1, fontSize: 30 }}>
            Một mảnh đất nhỏ ven biển Mỹ Khê
          </Typography>
          <Typography sx={{ mt: 2, maxWidth: 480, fontSize: 14, lineHeight: 1.7, color: "text.secondary" }}>
            Coastal Retreat khởi đầu là một quán café nhỏ trong vườn dừa. Theo
            thời gian, chúng tôi mở thêm vài phòng nghỉ và một bếp bánh thủ
            công, dần trở thành một điểm dừng quen thuộc của người yêu biển và
            yêu sự chậm rãi.
          </Typography>
        </Box>
        <ImagePlaceholder label="đội ngũ Coastal Retreat" height={256} sx={{ flex: 1, width: "100%" }} />
      </Box>

      <Footer />
    </Box>
  );
}
