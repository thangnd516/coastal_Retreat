"use client";

import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Paper, TextField } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";

const TOPIC_SUGGESTIONS = [
  "Mùa hè ở Đà Nẵng: những điều khiến bạn muốn quay lại",
  "Cà phê đặc sản và nghệ thuật pha chế tại Coastal Retreat",
  "5 lý do bạn nên chọn homestay thay vì khách sạn",
  "Sáng sớm ở Mỹ Khê: chợ cá, bánh mì và cà phê",
];

export default function BlogWriter() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "blog_writer",
          payload: { topic, keywords, audience },
        }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult("Lỗi kết nối AI.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <EditNoteIcon sx={{ color: "primary.main" }} />
        <Typography variant="h5" sx={{ fontSize: 20 }}>Viết bài blog bằng AI</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>Gợi ý chủ đề:</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
          {TOPIC_SUGGESTIONS.map(t => (
            <Box
              key={t}
              onClick={() => setTopic(t)}
              sx={{ fontSize: 12, px: 1.5, py: 0.5, border: "1px solid", borderColor: "divider", borderRadius: 1, cursor: "pointer", "&:hover": { borderColor: "primary.main", color: "primary.dark" } }}
            >
              {t}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <TextField
          size="small"
          label="Chủ đề bài viết *"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="VD: Hướng dẫn 2 ngày 1 đêm ở Đà Nẵng"
          fullWidth
        />
        <TextField
          size="small"
          label="Từ khóa cần đề cập"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="VD: biển Mỹ Khê, cà phê đặc sản, thư giãn"
        />
        <TextField
          size="small"
          label="Đối tượng độc giả"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="VD: cặp đôi đi nghỉ cuối tuần, gia đình có con nhỏ..."
        />
      </Box>

      <Button
        variant="contained"
        onClick={generate}
        disabled={loading || !topic.trim()}
        sx={{ mt: 2 }}
        startIcon={loading ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined}
      >
        {loading ? "AI đang viết bài..." : "Tạo bài blog →"}
      </Button>

      {result && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Bài viết hoàn chỉnh — chỉnh sửa trước khi đăng</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button size="small" variant="outlined" onClick={copy}>{copied ? "Đã copy ✓" : "Copy"}</Button>
              <Button size="small" onClick={generate}>Viết lại</Button>
            </Box>
          </Box>
          <Box sx={{ p: 2.5, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 1, maxHeight: 380, overflowY: "auto" }}>
            <Typography sx={{ fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap", color: "text.primary" }}>
              {result}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
