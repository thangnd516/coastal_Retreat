import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <Box sx={{ display: "inline-flex", color: "primary.main" }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(value) ? (
          <StarIcon key={i} sx={{ fontSize: size }} />
        ) : (
          <StarBorderIcon key={i} sx={{ fontSize: size }} />
        )
      )}
    </Box>
  );
}
