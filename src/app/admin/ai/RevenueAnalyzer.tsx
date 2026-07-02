"use client";

import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Paper } from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { formatVND } from "@/lib/format";

type Props = {
  revenueData: {
    summary: {
      totalRevenue: number;
      roomRevenue: number;
      cafeRevenue: number;
      eventRevenue: number;
      totalBookings: number;
      avgRating: string | null;
    };
    data: object;
  };
};

export default function RevenueAnalyzer({ revenueData }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "revenue_analysis", payload: revenueData }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult("Lỗi kết nối AI. Kiểm tra ANTHROPIC_API_KEY trong .env.local");
    } finally {
      setLoading(false);
    }
  };

  const s = revenueData.summary;

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <AutoGraphIcon sx={{ color: "primary.main" }} />
        <Typography variant="h5" sx={{ fontSize: 20 }}>Phân tích doanh thu AI</Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 2, mb: 3 }}>
        {[
          { label: "Tổng doanh thu", val: formatVND(s.totalRevenue) },
          { label: "Phòng nghỉ",     val: formatVND(s.roomRevenue) },
          { label: "Café / Bakery",  val: formatVND(s.cafeRevenue) },
          { label: "Sự kiện",        val: formatVND(s.eventRevenue) },
          { label: "Tổng giao dịch", val: `${s.totalBookings}` },
          { label: "Điểm đánh giá",  val: s.avgRating ? `${s.avgRating}/5` : "—" },
        ].map((k) => (
          <Box key={k.label} sx={{ border: "1px solid", borderColor: "divider", p: 2, borderRadius: 1 }}>
            <Typography sx={{ fontSize: 11, fontFamily: "var(--font-plexmono), monospace", color: "text.secondary" }}>
              {k.label.toUpperCase()}
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20, mt: 0.5 }}>
              {k.val}
            </Typography>
          </Box>
        ))}
      </Box>

      <Button
        variant="contained"
        onClick={analyze}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined}
      >
        {loading ? "Đang phân tích..." : "Phân tích với AI →"}
      </Button>

      {result && (
        <Box sx={{ mt: 3, p: 2.5, bgcolor: "rgba(176,122,91,.06)", border: "1px solid", borderColor: "primary.light", borderRadius: 1 }}>
          <Typography sx={{ fontSize: 13, lineHeight: 1.85, whiteSpace: "pre-wrap", color: "text.primary" }}>
            {result}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
