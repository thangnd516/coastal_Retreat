import { Box, Typography } from "@mui/material";

export default function ImagePlaceholder({
  label,
  src, // Thêm prop src vào đây
  height = 176,
  sx,
}: {
  label: string;
  src?: string | null; // Định nghĩa kiểu dữ liệu cho src
  height?: number | string;
  sx?: object;
}) {
  return (
    <Box
      className="hatch"
      sx={{
        height,
        display: "flex",
        alignItems: "flex-end",
        p: 1.25,
        // Nếu có src, hiển thị làm nền, nếu không thì để mặc định của class "hatch"
        backgroundImage: src ? `url(${src})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...sx,
      }}
    >
      {label && (
        <Typography
          sx={{
            fontFamily: "var(--font-plexmono), monospace",
            fontSize: 10,
            color: "text.secondary",
            // Thêm background mờ để chữ dễ đọc hơn nếu đè lên ảnh
            bgcolor: src ? "rgba(255,255,255,0.7)" : "transparent",
            px: 0.5,
          }}
        >
          [ {label} ]
        </Typography>
      )}
    </Box>
  );
}