import NextLink from "next/link";
import { AppBar, Toolbar, Box, Button, Typography, Stack } from "@mui/material";
import { createClient } from "@/lib/supabase/server";

const navLinks = [
  { label: "Homestay", href: "/homestay" },
  { label: "Café", href: "/cafe" },
  { label: "Bakery", href: "/bakery" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
];

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4.5 }, py: 1.5 }}>
        {/* Sửa cách dùng: dùng NextLink bao quanh Typography thay vì component={Link} */}
        <NextLink href="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            Coastal Retreat
          </Typography>
        </NextLink>

        {/* Làm tương tự cho danh sách navLinks */}
        <Stack direction="row" spacing={3.5} sx={{ display: { xs: "none", md: "flex" } }}>
          {navLinks.map((l) => (
            <NextLink key={l.href} href={l.href} style={{ textDecoration: "none" }}>
              <Typography sx={{ fontSize: 13, color: "text.secondary", "&:hover": { color: "primary.dark" } }}>
                {l.label}
              </Typography>
            </NextLink>
          ))}
        </Stack>

        {/* Đối với Button, MUI hỗ trợ thuộc tính 'component="a"' và 'href' trực tiếp */}
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          {user ? (
            <>
              {role === "admin" && (
                <Button href="/admin" size="small" variant="outlined">Admin</Button>
              )}
              <Button href="/account" size="small" variant="outlined">Tài khoản</Button>
            </>
          ) : (
            <Button href="/login" size="small" variant="outlined">Đăng nhập</Button>
          )}
          <Button href="/homestay" variant="contained" size="small">Book Now</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
