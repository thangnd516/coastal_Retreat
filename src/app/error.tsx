"use client";

import { Box, Typography, Button } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 12,
        px: 3,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: 64,
          lineHeight: 1,
          color: "#E8E0D3",
          fontWeight: 700,
        }}
      >
        Ối!
      </Typography>
      <Typography variant="h3" sx={{ mt: 1, fontSize: 24 }}>
        Có lỗi xảy ra
      </Typography>
      <Typography sx={{ mt: 1.5, maxWidth: 380, color: "text.secondary", fontSize: 14 }}>
        {error.message || "Một lỗi không xác định đã xảy ra. Vui lòng thử lại."}
      </Typography>
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button onClick={reset} variant="contained">
          Thử lại
        </Button>
        <Button href="/" variant="outlined">
          Về trang chủ
        </Button>
      </Box>
    </Box>
  );
}
