"use client";

import { useState } from "react";
import { Box, Typography, Slider, Button, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { REDEEM_RATE, MAX_REDEEM_PERCENT, calcRedeemValue } from "@/lib/loyaltyConstants";
import { formatVND } from "@/lib/format";

type Props = {
  balance: number;
  orderAmount: number;
  onApply: (points: number, discount: number) => void;
  onRemove: () => void;
};

export default function LoyaltyRedeemBox({ balance, orderAmount, onApply, onRemove }: Props) {
  const maxPoints = Math.min(
    balance,
    Math.ceil((orderAmount * (MAX_REDEEM_PERCENT / 100) / 10_000) * REDEEM_RATE)
  );
  const [points, setPoints] = useState(0);
  const [applied, setApplied] = useState(false);

  const discount = calcRedeemValue(points);

  if (balance <= 0) return null;

  if (applied) {
    return (
      <Box sx={{ p: 1.5, bgcolor: "rgba(176,122,91,.12)", border: "1px solid", borderColor: "primary.main", borderRadius: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
        <StarIcon fontSize="small" sx={{ color: "primary.main" }} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
            Đã dùng {points.toLocaleString()} điểm
          </Typography>
          <Typography sx={{ fontSize: 12, color: "primary.dark" }}>
            Giảm {formatVND(discount)}
          </Typography>
        </Box>
        <Button size="small" onClick={() => { setApplied(false); setPoints(0); onRemove(); }}>
          Bỏ
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <StarIcon fontSize="small" sx={{ color: "primary.main" }} />
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
          Điểm tích lũy của bạn:{" "}
          <Chip label={`${balance.toLocaleString()} điểm`} size="small" sx={{ ml: 0.5, fontSize: 12, bgcolor: "rgba(176,122,91,.12)", color: "primary.dark" }} />
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}>
        Dùng điểm để giảm giá (tối đa {MAX_REDEEM_PERCENT}% đơn hàng · {REDEEM_RATE} điểm = 10.000₫)
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          min={0}
          max={maxPoints}
          step={REDEEM_RATE}
          value={points}
          onChange={(_, v) => setPoints(v as number)}
          marks={[
            { value: 0, label: "0" },
            { value: maxPoints, label: `${maxPoints.toLocaleString()}` },
          ]}
          sx={{ color: "primary.main" }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
        <Typography sx={{ fontSize: 13, color: "primary.dark" }}>
          {points > 0 ? `Giảm ${formatVND(discount)}` : "Chưa chọn điểm"}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          disabled={points === 0}
          onClick={() => { setApplied(true); onApply(points, discount); }}
        >
          Dùng {points > 0 ? `${points.toLocaleString()} điểm` : "điểm"}
        </Button>
      </Box>
    </Box>
  );
}
