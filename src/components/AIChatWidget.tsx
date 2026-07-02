"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box, IconButton, Typography, TextField, Paper,
  CircularProgress, Collapse,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME = "Xin chào! Mình là trợ lý của Coastal Retreat 🌊 Mình có thể giúp bạn tìm phòng, hỏi về menu café, sự kiện hay bất kỳ điều gì về khu nghỉ. Bạn muốn hỏi gì?";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "chat", payload: { message: text } }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.delta?.text ?? "";
            if (delta) {
              assistantMsg += delta;
              setMessages(prev => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = { role: "assistant", content: assistantMsg };
                return msgs;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1300 }}>
      <Collapse in={open} unmountOnExit>
        <Paper
          elevation={4}
          sx={{
            mb: 1.5,
            width: 340,
            maxHeight: 480,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Header */}
          <Box sx={{ px: 2.5, py: 2, bgcolor: "primary.main", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "primary.contrastText" }}>
                Trợ lý Coastal Retreat
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4ade80" }} />
                <Typography sx={{ fontSize: 11, color: "rgba(252,250,246,.75)" }}>Online</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "primary.contrastText" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5, bgcolor: "background.default" }}>
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    bgcolor: m.role === "user" ? "primary.main" : "background.paper",
                    color: m.role === "user" ? "primary.contrastText" : "text.primary",
                    fontSize: 13,
                    lineHeight: 1.6,
                    border: m.role === "assistant" ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  {m.content || (loading && i === messages.length - 1 ? (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {[0, 0.15, 0.3].map((d, j) => (
                        <Box key={j} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "text.secondary", animation: "pulse 1s ease-in-out infinite", animationDelay: `${d}s` }} />
                      ))}
                    </Box>
                  ) : "...")}
                </Box>
              </Box>
            ))}
            <div ref={bottomRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", gap: 1, bgcolor: "background.paper" }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Nhắn tin..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              multiline
              maxRows={3}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, fontSize: 13 } }}
            />
            <IconButton
              onClick={send}
              disabled={loading || !input.trim()}
              sx={{ bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" }, "&:disabled": { bgcolor: "action.disabledBackground" }, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : <SendIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Paper>
      </Collapse>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => setOpen(o => !o)}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            width: 52,
            height: 52,
            boxShadow: 3,
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
