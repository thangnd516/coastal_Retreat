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
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { createRoom, updateRoom, deleteRoom } from "./actions";
import { formatVND } from "@/lib/format";
import type { Room } from "@/types/database";

export default function RoomManager({ rooms }: { rooms: Room[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setOpen(true);
  };
  const openEdit = (r: Room) => {
    setEditing(r);
    setError(null);
    setOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      if (editing) {
        formData.set("id", editing.id);
        await updateRoom(formData);
      } else {
        await createRoom(formData);
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
          Thêm phòng
        </Button>
      </Box>

      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {rooms.map((r) => (
          <Box
            key={r.id}
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
            <Box sx={{ minWidth: 160, flex: 1 }}>{r.name}</Box>
            <Box sx={{ color: "text.secondary", minWidth: 90 }}>{r.type}</Box>
            <Box sx={{ color: "text.secondary", minWidth: 70 }}>{r.capacity} khách</Box>
            <Box sx={{ fontFamily: "var(--font-plexmono), monospace", color: "primary.dark", minWidth: 110 }}>
              {formatVND(r.price_per_night)}
            </Box>
            <Typography sx={{ fontSize: 12, color: r.is_available ? "success.main" : "error.main", minWidth: 90 }}>
              {r.is_available ? "Đang mở" : "Tạm khóa"}
            </Typography>
            <IconButton size="small" onClick={() => openEdit(r)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => startTransition(() => deleteRoom(r.id))}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        {rooms.length === 0 && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có phòng nào.
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 22 }}>
          {editing ? "Sửa phòng" : "Thêm phòng mới"}
        </DialogTitle>
        <Box component="form" action={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField name="name" label="Tên phòng" defaultValue={editing?.name} size="small" required />
              <TextField name="type" label="Loại phòng" defaultValue={editing?.type} size="small" required placeholder="Studio, Suite, Bungalow..." />
              <TextField
                name="description"
                label="Mô tả"
                defaultValue={editing?.description ?? ""}
                size="small"
                multiline
                rows={3}
              />
              <TextField
                name="price_per_night"
                label="Giá / đêm (VNĐ)"
                type="number"
                defaultValue={editing?.price_per_night}
                size="small"
                required
              />
              <TextField
                name="capacity"
                label="Sức chứa (khách)"
                type="number"
                defaultValue={editing?.capacity ?? 2}
                size="small"
                required
              />
              <FormControlLabel
                control={<Switch name="is_available" defaultChecked={editing?.is_available ?? true} />}
                label="Đang mở bán"
              />
              {error && <Typography sx={{ fontSize: 13, color: "error.main" }}>{error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">
              {editing ? "Lưu thay đổi" : "Tạo phòng"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
