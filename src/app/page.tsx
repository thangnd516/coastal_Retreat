import Link from "next/link";
import { Box, Typography, Button, Grid, Card } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SmartImage from "@/components/SmartImage";
import { createClient } from "@/lib/supabase/server";

const spaces = [
  { key: "homestay", label: "Homestay", cta: "XEM PHÒNG →", href: "/homestay" },
  { key: "café", label: "Café", cta: "XEM MENU →", href: "/cafe" },
  { key: "bakery", label: "Bakery", cta: "ĐẶT BÁNH →", href: "/bakery" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(4);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />

      <Box className="hatch" sx={{ height: 380, display: "flex", flexDirection: "column", justifyContent: "center", px: { xs: 3, md: 7 } }}>
        <Typography variant="h2" sx={{ maxWidth: 540, fontSize: { xs: 36, md: 48 }, color: "#2E2A20" }}>
          Sống chậm bên biển Đà Nẵng
        </Typography>
        <Typography sx={{ mt: 1.75, maxWidth: 420, color: "#5A5346", fontSize: 15 }}>
          Homestay, café và bakery trong cùng một khu nghỉ ven biển.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", gap: 1.5 }}>
          {/* SỬA: Không truyền component={Link} */}
          <Link href="/homestay" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Đặt phòng</Button>
          </Link>
          <Link href="/cafe" style={{ textDecoration: 'none' }}>
            <Button variant="outlined">Café & Bakery</Button>
          </Link>
        </Box>
      </Box>

      {/* ... Phần giới thiệu giữ nguyên ... */}

      <Box sx={{ px: { xs: 3, md: 7 }, py: 6 }}>
        <Typography variant="h3" sx={{ fontSize: 30 }}>Không gian của chúng tôi</Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {spaces.map((s) => (
            <Grid size={{ xs: 12, md: 4 }} key={s.key}>
              <Card variant="outlined" sx={{ overflow: "hidden" }}>
                {/* SỬA: Bọc thay vì truyền component */}
                <Link href={s.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ImagePlaceholder label={s.key} height={170} />
                  <Box sx={{ p: 2.25 }}>
                    <Typography variant="h5" sx={{ fontSize: 22 }}>{s.label}</Typography>
                    <Box sx={{ mt: 1.5, height: 8, borderRadius: 1, bgcolor: "divider" }} />
                    <Typography sx={{ mt: 2, fontFamily: "monospace", fontSize: 11, color: "primary.dark" }}>
                      {s.cta}
                    </Typography>
                  </Box>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ px: { xs: 3, md: 7 }, pb: 6 }}>
        <Typography variant="h3" sx={{ fontSize: 30, mb: 3 }}>Từ blog du lịch</Typography>
        <Grid container spacing={3}>
          {(posts ?? []).map((p) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.id}>
              <Card variant="outlined" sx={{ overflow: "hidden" }}>
                {/* SỬA: Bọc thay vì truyền component */}
                <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <SmartImage src={p.thumbnail_url} label="" height={130} />
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: 10, color: "primary.main" }}>BLOG</Typography>
                    <Typography sx={{ mt: 1, fontSize: 18 }}>{p.title}</Typography>
                  </Box>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}