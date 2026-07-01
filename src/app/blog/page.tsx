import Link from "next/link";
import { Box, Typography, Grid, Card, CardActionArea } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blogs")
    .select("*");
    
  console.log("posts", posts);
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ px: { xs: 3, md: 7 }, py: 5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="overline" color="primary.main">
          BLOG
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, fontSize: 36 }}>
          Blog du lịch
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 480, fontSize: 14, color: "text.secondary" }}>
          Hướng dẫn, ẩm thực và chuyện đời thường quanh khu nghỉ.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ px: { xs: 3, md: 7 }, py: 6 }}>
        {(posts ?? []).map((p) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.id}>
            <Card variant="outlined" sx={{ overflow: "hidden" }}>
              {/* SỬA Ở ĐÂY: Bọc bằng Link thay vì dùng component */}
              <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <CardActionArea>
                  <ImagePlaceholder label="" height={144} />
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, lineHeight: 1.3 }}>
                      {p.title}
                    </Typography>
                    {p.published_at && (
                      <Typography sx={{ mt: 1, fontSize: 12, color: "text.secondary" }}>
                        {formatDate(p.published_at)}
                      </Typography>
                    )}
                  </Box>
                </CardActionArea>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Footer />
    </Box>
  );
}
