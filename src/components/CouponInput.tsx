"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography, Chip, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { validateCoupon } from "@/lib/actions/coupon";
import { formatVND } from "@/lib/format";
import type { Coupon } from "@/types/database";

type Props = {
  orderAmount: number;
  onApply: (coupon: Coupon, discount: number) => void;
  onRemove: () => void;
};

export default function CouponInput({ orderAmount, onApply, onRemove }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<{ coupon: Coupon; discount: number } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setError(null);
    setLoading(true);
    const result = await validateCoupon(code, orderAmount);
    setLoading(false);
    if (result.ok) {
      setApplied({ coupon: result.coupon, discount: result.discountAmount });
      onApply(result.coupon, result.discountAmount);
    } else {
      setError(result.error);
    }
  };

  if (applied) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, bgcolor: "#E6EFE3", border: "1px solid", borderColor: "success.main", borderRadius: 1 }}>
        <CheckCircleIcon color="success" fontSize="small" />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
            {applied.coupon.code}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "success.main" }}>
            Giảm {formatVND(applied.discount)} ·{" "}
            {applied.coupon.discount_type === "percent"
              ? `${applied.coupon.discount_value}% off`
              : `fixed`}
          </Typography>
        </Box>
        <Button size="small" onClick={() => { setApplied(null); setCode(""); onRemove(); }}>
          Xóa
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          placeholder="Mã giảm giá"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          sx={{ flex: 1, "& input": { fontFamily: "var(--font-plexmono), monospace", fontSize: 13, letterSpacing: ".05em" } }}
        />
        <Button variant="outlined" size="small" onClick={handleApply} disabled={loading || !code.trim()}>
          {loading ? <CircularProgress size={16} /> : "Áp dụng"}
        </Button>
      </Box>
      {error && (
        <Typography sx={{ mt: 0.5, fontSize: 12, color: "error.main" }}>{error}</Typography>
      )}
    </Box>
  );
}
