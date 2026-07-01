import { Box, Typography, Stack } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#2E2A20",
        color: "#CFC7B8",
        px: { xs: 3, md: 4.5 },
        py: 5,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        gap: 4,
      }}
    >
      <Box>
        <Typography
          sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 22, color: "#F2ECDF" }}
        >
          Coastal Retreat
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#9A9080", mt: 1.25 }}>
          Mỹ Khê, Đà Nẵng · hello@coastalretreat.vn
        </Typography>
      </Box>
      <Stack direction="row" spacing={7} sx={{ fontSize: 12, color: "#9A8F7E" }}>
        <Stack spacing={0.5}>
          <span>Homestay</span>
          <span>Café</span>
          <span>Bakery</span>
        </Stack>
        <Stack spacing={0.5}>
          <span>Events</span>
          <span>Blog</span>
          <span>Liên hệ</span>
        </Stack>
      </Stack>
    </Box>
  );
}
