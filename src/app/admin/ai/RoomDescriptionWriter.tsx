"use client";

import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Paper, TextField, MenuItem, Chip } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

type Room = { id: string; name: string; type: string; capacity: number; price: number };

export default function RoomDescriptionWriter({ rooms }: { rooms: Room[] }) {
  const [selected, setSelected] = useState<Room | null>(rooms[0] ?? null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!selected) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "room_description",
          payload: {
            roomName: selected.name,
            type: selected.type,
            capacity: selected.capacity,
            price: selected.price.toLocaleString("vi-VN"),
            notes,
          },
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
        <AutoFixHighIcon sx={{ color: "primary.main" }} />
        <Typography variant="h5" sx={{ fontSize: 20 }}>Viết mô tả phòng bằng AI</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          select
          size="small"
          label="Chọn phòng"
          value={selected?.id ?? ""}
          onChange={(e) => setSelected(rooms.find(r => r.id === e.target.value) ?? null)}
          sx={{ minWidth: 220 }}
        >
          {rooms.map(r => (
            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          label="Ghi chú thêm (tuỳ chọn)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="VD: view biển tuyệt đẹp, vừa tân trang..."
          sx={{ flex: 1, minWidth: 220 }}
        />
      </Box>

      {selected && (
        <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip size="small" label={selected.type} />
          <Chip size="small" label={`${selected.capacity} khách`} />
          <Chip size="small" label={`${selected.price.toLocaleString("vi-VN")}₫/đêm`} sx={{ color: "primary.dark" }} />
        </Box>
      )}

      <Button
        variant="contained"
        onClick={generate}
        disabled={loading || !selected}
        startIcon={loading ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : undefined}
      >
        {loading ? "AI đang viết..." : "Tạo mô tả →"}
      </Button>

      {result && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Kết quả — có thể copy để dùng</Typography>
            <Button size="small" variant="outlined" onClick={copy}>
              {copied ? "Đã copy ✓" : "Copy"}
            </Button>
          </Box>
          <Box sx={{ p: 2.5, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography sx={{ fontSize: 14, lineHeight: 1.8, color: "text.primary" }}>{result}</Typography>
          </Box>
          <Button size="small" sx={{ mt: 1 }} onClick={generate}>
            Thử lại với gợi ý khác
          </Button>
        </Box>
      )}
    </Paper>
  );
}
