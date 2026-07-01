import { Box, Typography } from "@mui/material";

export default function ImagePlaceholder({
  label,
  height = 176,
  sx,
}: {
  label: string;
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
        ...sx,
      }}
    >
      {label && (
        <Typography
          sx={{
            fontFamily: "var(--font-plexmono), monospace",
            fontSize: 10,
            color: "text.secondary",
          }}
        >
          [ {label} ]
        </Typography>
      )}
    </Box>
  );
}
