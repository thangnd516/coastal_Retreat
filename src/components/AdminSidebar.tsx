"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";

const items = [
  { label: "Dashboard", href: "/admin" },
  { label: "Đặt phòng", href: "/admin/bookings" },
  { label: "Phòng", href: "/admin/rooms" },
  { label: "Thực đơn", href: "/admin/menu" },
  { label: "Khách hàng", href: "/admin/customers" },
  { label: "Sự kiện", href: "/admin/events" },
  { label: "Bài viết", href: "/admin/blog" },
  { label: "Cài đặt", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 224,
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "#F2EDE4",
        px: 2,
        py: 3,
        minHeight: "100vh",
      }}
    >
      <Typography
        sx={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: 18,
          fontWeight: 600,
          px: 1,
          mb: 3,
        }}
      >
        Coastal Retreat
      </Typography>
      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              sx={{
                borderRadius: 1,
                fontSize: 14,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ListItemText sx={{ "& .MuiListItemText-primary": { fontSize: 14 } }}>
                {item.label}
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
