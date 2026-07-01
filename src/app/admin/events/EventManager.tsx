"use client";

import { useState, useTransition } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { createEvent, updateEvent, deleteEvent } from "./actions";
import { formatVND } from "@/lib/format";
import type { EventRow } from "@/types/database";

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventManager({ events }: { events: EventRow[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setOpen(true);
  };
  const openEdit = (ev: EventRow) => {
    setEditing(ev);
    setError(null);
    setOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      if (editing) {
        formData.set("id", editing.id);
        await updateEvent(formData);
      } else {
        await createEvent(formData);
      }
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>
          Tạo sự kiện
        </Button>
      </Box>

      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {events.map((ev) => (
          <Box
            key={ev.id}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              px: 2.5,
              py: 1.75,
              fontSize: 14,
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-of-type": { borderBottom: "none" },
            }}
          >
            <Box sx={{ minWidth: 110, color: "text.secondary" }}>
              {new Date(ev.event_date).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Box>
            <Box sx={{ flex: 1, minWidth: 160 }}>{ev.title}</Box>
            <Box sx={{ color: "text.secondary", minWidth: 90 }}>
              {ev.current_attendees}/{ev.max_attendees}
            </Box>
            <Box sx={{ fontFamily: "var(--font-plexmono), monospace", color: "primary.dark", minWidth: 90 }}>
              {formatVND(ev.price_per_ticket)}
            </Box>
            <IconButton size="small" onClick={() => openEdit(ev)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => startTransition(() => deleteEvent(ev.id))}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        {events.length === 0 && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có sự kiện nào.
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 22 }}>
          {editing ? "Sửa sự kiện" : "Tạo sự kiện mới"}
        </DialogTitle>
        <Box component="form" action={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField name="title" label="Tên sự kiện" defaultValue={editing?.title} size="small" required />
              <TextField
                name="description"
                label="Mô tả"
                defaultValue={editing?.description ?? ""}
                size="small"
                multiline
                rows={2}
              />
              <TextField
                name="event_date"
                label="Ngày giờ"
                type="datetime-local"
                defaultValue={editing ? toLocalInputValue(editing.event_date) : ""}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />
              <TextField
                name="price_per_ticket"
                label="Giá vé (VNĐ)"
                type="number"
                defaultValue={editing?.price_per_ticket}
                size="small"
                required
              />
              <TextField
                name="max_attendees"
                label="Số chỗ tối đa"
                type="number"
                defaultValue={editing?.max_attendees ?? 30}
                size="small"
                required
              />
              {error && <Typography sx={{ fontSize: 13, color: "error.main" }}>{error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">
              {editing ? "Lưu thay đổi" : "Tạo sự kiện"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
