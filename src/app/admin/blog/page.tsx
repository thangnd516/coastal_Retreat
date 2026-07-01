import { Box, Typography } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import BlogManager from "./BlogManager";

export default async function AdminBlog() {
  const supabase = await createClient();
  const { data: blogs } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Quản lý bài viết
      </Typography>
      <Box sx={{ mt: 3 }}>
        <BlogManager blogs={blogs ?? []} />
      </Box>
    </Box>
  );
}
