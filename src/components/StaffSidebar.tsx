"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";

const items = [
  { label: "Tổng quan", href: "/staff" },
  { label: "Đơn hàng", href: "/staff/orders" },
  { label: "Thực đơn", href: "/staff/menu" },
];

export default function StaffSidebar() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 200,
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
          fontSize: 17,
          fontWeight: 600,
          px: 1,
          mb: 0.5,
        }}
      >
        Coastal Retreat
      </Typography>
      <Typography sx={{ px: 1, mb: 3, fontSize: 11, color: "text.secondary", fontFamily: "var(--font-plexmono), monospace" }}>
        STAFF PANEL
      </Typography>
      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {items.map((item) => {
          const active =
            item.href === "/staff"
              ? pathname === "/staff"
              : pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              sx={{
                borderRadius: 1,
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
