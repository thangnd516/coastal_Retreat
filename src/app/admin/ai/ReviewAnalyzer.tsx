"use client";

import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Paper, LinearProgress, Chip, Stack } from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";

type Review = { rating: number; comment: string | null; room?: string | null };
type SentimentResult = {
  overall_score: number;
  sentiment: "positive" | "neutral" | "negative";
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  recommendation: string;
};

const sentimentColor = { positive: "success", neutral: "warning", negative: "error" } as const;
const sentimentLabel = { positive: "Tích cực", neutral: "Trung lập", negative: "Tiêu cực" };

export default function ReviewAnalyzer({ reviews }: { reviews: Review[] }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "review_sentiment", payload: { reviews } }),
      });
      const data = await res.json();
      const cleaned = data.result.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(cleaned));
    } catch (e) {
      setError("Không thể phân tích. Kiểm tra API key.");
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <RateReviewIcon sx={{ color: "primary.main" }} />
        <Typography variant="h5" sx={{ fontSize: 20 }}>Phân tích đánh giá khách hàng</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2.5, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 36, color: "primary.dark", lineHeight: 1 }}>
            {avgRating}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>/ 5 sao · {reviews.length} đánh giá</Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 180 }}>
          {[5,4,3,2,1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                <Typography sx={{ fontSize: 11, color: "text.secondary", width: 12 }}>{star}</Typography>
                <LinearProgress variant="determinate" value={pct} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "divider", "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }} />
                <Typography sx={{ fontSize: 11, color: "text.secondary", width: 20, textAlign: "right" }}>{count}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Button
        variant="contained"
        onClick={analyze}
        disabled={loading || reviews.length === 0}
        startIcon={loading ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined}
      >
        {loading ? "Đang phân tích..." : `Phân tích ${reviews.length} đánh giá →`}
      </Button>

      {error && <Typography sx={{ mt: 2, fontSize: 13, color: "error.main" }}>{error}</Typography>}

      {result && (
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 28, color: "primary.dark" }}>
              {result.overall_score}/10
            </Typography>
            <Chip label={sentimentLabel[result.sentiment]} color={sentimentColor[result.sentiment]} size="small" />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1, color: "success.main" }}>✓ Điểm mạnh</Typography>
              <Stack spacing={0.5}>
                {result.strengths.map((s, i) => (
                  <Typography key={i} sx={{ fontSize: 13, color: "text.secondary" }}>• {s}</Typography>
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1, color: "error.main" }}>✗ Cần cải thiện</Typography>
              <Stack spacing={0.5}>
                {result.weaknesses.map((w, i) => (
                  <Typography key={i} sx={{ fontSize: 13, color: "text.secondary" }}>• {w}</Typography>
                ))}
              </Stack>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1, color: "text.secondary" }}>Từ khóa phổ biến</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {result.keywords.map((k) => (
                <Chip key={k} label={k} size="small" variant="outlined" sx={{ fontSize: 12 }} />
              ))}
            </Box>
          </Box>

          <Box sx={{ p: 2, bgcolor: "rgba(176,122,91,.06)", borderRadius: 1, border: "1px solid", borderColor: "primary.light" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.5 }}>Khuyến nghị từ AI</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{result.recommendation}</Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
