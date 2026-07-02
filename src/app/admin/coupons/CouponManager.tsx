"use client";

import { useState, useTransition } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Switch, FormControlLabel, Stack, Typography,
  Chip, IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { createCoupon, toggleCouponActive, deleteCoupon } from "./actions";
import type { Coupon } from "@/types/database";
import { formatVND } from "@/lib/format";

export default function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    try {
      await createCoupon(formData);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi khi tạo mã.");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
          Tạo mã giảm giá
        </Button>
      </Box>

      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {/* Header */}
        <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr 100px 100px 120px 80px 80px 48px", gap: 2, px: 2.5, py: 1.5, bgcolor: "#F2EDE4", fontSize: 11, fontFamily: "var(--font-plexmono), monospace", color: "text.secondary", borderBottom: "1px solid", borderColor: "divider" }}>
          <span>MÃ</span><span>MÔ TẢ</span><span>LOẠI</span><span>GIÁ TRỊ</span><span>TỐI THIỂU</span><span>LƯỢT DÙNG</span><span>TRẠNG THÁI</span><span></span>
        </Box>
        {coupons.map((c) => (
          <Box
            key={c.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "140px 1fr 100px 100px 120px 80px 80px 48px",
              gap: 2, px: 2.5, py: 1.75, alignItems: "center", fontSize: 13,
              borderBottom: "1px solid", borderColor: "divider",
              "&:last-of-type": { borderBottom: "none" },
              opacity: c.is_active ? 1 : 0.5,
            }}
          >
            <Box sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 13, fontWeight: 500 }}>
              {c.code}
            </Box>
            <Box sx={{ color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {c.description}
            </Box>
            <Chip size="small" label={c.discount_type === "percent" ? "%" : "₫"} sx={{ fontSize: 11, width: "fit-content" }} />
            <Box sx={{ color: "primary.dark" }}>
              {c.discount_type === "percent"
                ? `${c.discount_value}%`
                : formatVND(Number(c.discount_value))}
            </Box>
            <Box sx={{ color: "text.secondary" }}>
              {Number(c.min_order_amount) > 0 ? formatVND(Number(c.min_order_amount)) : "—"}
            </Box>
            <Box sx={{ color: "text.secondary" }}>
              {c.current_uses}{c.max_uses !== null ? `/${c.max_uses}` : ""}
            </Box>
            <Switch
              size="small"
              checked={c.is_active}
              onChange={(e) => startTransition(() => toggleCouponActive(c.id, e.target.checked))}
            />
            <IconButton size="small" onClick={() => startTransition(() => deleteCoupon(c.id))}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        {coupons.length === 0 && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có mã giảm giá nào.
          </Typography>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 22 }}>
          Tạo mã giảm giá
        </DialogTitle>
        <Box component="form" action={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField name="code" label="Mã (VD: SUMMER20)" size="small" required
                slotProps={{ input: { sx: { fontFamily: "var(--font-plexmono), monospace", textTransform: "uppercase" } } }} />
              <TextField name="description" label="Mô tả" size="small" />
              <TextField select name="discount_type" label="Loại giảm" defaultValue="percent" size="small">
                <MenuItem value="percent">Phần trăm (%)</MenuItem>
                <MenuItem value="fixed">Số tiền cố định (₫)</MenuItem>
              </TextField>
              <TextField name="discount_value" label="Giá trị (% hoặc ₫)" type="number" size="small" required />
              <TextField name="min_order_amount" label="Đơn tối thiểu (₫)" type="number" size="small" defaultValue="0" />
              <TextField name="max_uses" label="Số lượt tối đa (để trống = vô hạn)" type="number" size="small" />
              <TextField name="valid_until" label="Hết hạn" type="datetime-local" size="small" slotProps={{ inputLabel: { shrink: true } }} />
              {error && <Typography sx={{ fontSize: 13, color: "error.main" }}>{error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">Tạo mã</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
