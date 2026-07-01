import { Box } from "@mui/material";
import AdminSidebar from "@/components/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, py: 4, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}
