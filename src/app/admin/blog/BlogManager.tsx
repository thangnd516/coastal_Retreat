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
  Chip,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { createBlog, updateBlog, deleteBlog } from "./actions";
import type { Blog } from "@/types/database";

export default function BlogManager({ blogs }: { blogs: Blog[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setOpen(true);
  };
  const openEdit = (b: Blog) => {
    setEditing(b);
    setError(null);
    setOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      if (editing) {
        formData.set("id", editing.id);
        await updateBlog(formData);
      } else {
        await createBlog(formData);
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
          Viết bài mới
        </Button>
      </Box>

      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {blogs.map((b) => (
          <Box
            key={b.id}
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
            <Box sx={{ flex: 1, minWidth: 200 }}>{b.title}</Box>
            <Box sx={{ color: "text.secondary", fontSize: 12 }}>/{b.slug}</Box>
            <Chip
              size="small"
              label={b.is_published ? "Đã đăng" : "Bản nháp"}
              color={b.is_published ? "success" : "default"}
            />
            <IconButton size="small" onClick={() => openEdit(b)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => startTransition(() => deleteBlog(b.id))}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        {blogs.length === 0 && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có bài viết nào.
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 22 }}>
          {editing ? "Sửa bài viết" : "Viết bài mới"}
        </DialogTitle>
        <Box component="form" action={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField name="title" label="Tiêu đề" defaultValue={editing?.title} size="small" required />
              <TextField
                name="content"
                label="Nội dung"
                defaultValue={editing?.content ?? ""}
                size="small"
                multiline
                rows={6}
                required
              />
              <FormControlLabel
                control={<Switch name="is_published" defaultChecked={editing?.is_published ?? false} />}
                label="Đăng bài ngay"
              />
              {error && <Typography sx={{ fontSize: 13, color: "error.main" }}>{error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">
              {editing ? "Lưu thay đổi" : "Tạo bài viết"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
