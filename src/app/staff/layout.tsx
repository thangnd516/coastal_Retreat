import { Box } from "@mui/material";
import StaffSidebar from "@/components/StaffSidebar";
import { requireStaffOrAdmin } from "@/lib/auth";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaffOrAdmin();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <StaffSidebar />
      <Box sx={{ flex: 1, px: { xs: 3, md: 5 }, py: 4, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}
