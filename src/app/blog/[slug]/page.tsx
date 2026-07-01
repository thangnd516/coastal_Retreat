import { notFound } from "next/navigation";
import { Box, Typography } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return notFound();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box component="article" sx={{ maxWidth: 720, mx: "auto", px: 3, py: 7 }}>
        {post.published_at && (
          <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 11, color: "primary.main" }}>
            {formatDate(post.published_at)}
          </Typography>
        )}
        <Typography variant="h2" sx={{ mt: 1.5, fontSize: 36, lineHeight: 1.2 }}>
          {post.title}
        </Typography>

        <ImagePlaceholder label="ảnh bìa bài viết" height={290} sx={{ mt: 4 }} />

        <Typography sx={{ mt: 4, fontSize: 15, lineHeight: 1.8, color: "text.secondary", whiteSpace: "pre-line" }}>
          {post.content}
        </Typography>
      </Box>

      <Footer />
    </Box>
  );
}
