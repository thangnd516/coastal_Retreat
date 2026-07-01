import Link from "next/link";
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
    <AppBar position="static" sx={{ bgcolor: "transparent", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4.5 }, py: 1.5 }}>
        {/* Sửa Typography thành thẻ bọc Link */}
        <Link href="/" style={{ textDecoration: "none" }}>
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
        </Link>

        <Stack
          direction="row"
          spacing={3.5}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                  "&:hover": { color: "primary.dark" },
                }}
              >
                {l.label}
              </Typography>
            </Link>
          ))}
        </Stack>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          {user ? (
            <>
              {role === "admin" && (
                <Link href="/admin" style={{ textDecoration: "none" }}>
                  <Button size="small" variant="outlined">Admin</Button>
                </Link>
              )}
              {role === "staff" && (
                <Link href="/staff" style={{ textDecoration: "none" }}>
                  <Button size="small" variant="outlined">Staff Panel</Button>
                </Link>
              )}
              <Link href="/account" style={{ textDecoration: "none" }}>
                <Button size="small" variant="outlined">Tài khoản</Button>
              </Link>
            </>
          ) : (
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button size="small" variant="outlined">Đăng nhập</Button>
            </Link>
          )}
          <Link href="/homestay" style={{ textDecoration: "none" }}>
            <Button variant="contained" size="small">Book Now</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}