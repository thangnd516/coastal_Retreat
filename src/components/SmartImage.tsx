import { Box } from "@mui/material";
import ImagePlaceholder from "./ImagePlaceholder";

export default function SmartImage({
  src,
  label,
  height = 176,
  sx,
}: {
  src?: string | null;
  label: string;
  height?: number | string;
  sx?: object;
}) {
  if (!src) {
    return <ImagePlaceholder label={label} height={height} sx={sx} />;
  }
  return (
    <Box
      sx={{
        height,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...sx,
      }}
    />
  );
}
