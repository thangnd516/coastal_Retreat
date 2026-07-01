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
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { createProduct, updateProduct, deleteProduct, toggleProductAvailability } from "./actions";
import { formatVND } from "@/lib/format";
import type { Product } from "@/types/database";

export default function ProductManager({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setError(null);
    setOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      if (editing) {
        formData.set("id", editing.id);
        await updateProduct(formData);
      } else {
        await createProduct(formData);
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
          Thêm món
        </Button>
      </Box>

      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {products.map((p) => (
          <Box
            key={p.id}
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
            <Box sx={{ minWidth: 160, flex: 1 }}>{p.name}</Box>
            <Chip size="small" label={p.category} sx={{ textTransform: "uppercase", fontSize: 10 }} />
            <Box sx={{ fontFamily: "var(--font-plexmono), monospace", color: "primary.dark", minWidth: 80 }}>
              {formatVND(p.price)}
            </Box>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Switch
                  size="small"
                  checked={p.is_available}
                  disabled={pending}
                  onChange={(e) =>
                    startTransition(() => toggleProductAvailability(p.id, e.target.checked))
                  }
                />
              }
              label={
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {p.is_available ? "Đang bán" : "Hết hàng"}
                </Typography>
              }
            />
            <IconButton size="small" onClick={() => openEdit(p)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => startTransition(() => deleteProduct(p.id))}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        {products.length === 0 && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có món nào.
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 22 }}>
          {editing ? "Sửa món" : "Thêm món mới"}
        </DialogTitle>
        <Box component="form" action={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField name="name" label="Tên món" defaultValue={editing?.name} size="small" required />
              <TextField
                name="category"
                select
                label="Nhóm"
                defaultValue={editing?.category ?? "cafe"}
                size="small"
                required
              >
                <MenuItem value="cafe">Cafe</MenuItem>
                <MenuItem value="bakery">Bakery</MenuItem>
              </TextField>
              <TextField
                name="description"
                label="Mô tả"
                defaultValue={editing?.description ?? ""}
                size="small"
                multiline
                rows={2}
              />
              <TextField
                name="price"
                label="Giá (VNĐ)"
                type="number"
                defaultValue={editing?.price}
                size="small"
                required
              />
              <FormControlLabel
                control={<Switch name="is_available" defaultChecked={editing?.is_available ?? true} />}
                label="Đang bán"
              />
              {error && <Typography sx={{ fontSize: 13, color: "error.main" }}>{error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">
              {editing ? "Lưu thay đổi" : "Tạo món"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
