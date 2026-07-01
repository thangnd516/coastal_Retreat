"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import { createRoomBooking } from "./actions";
import { formatVND } from "@/lib/format";

export default function BookingForm({
  roomId,
  pricePerNight,
  isLoggedIn,
}: {
  roomId: string;
  pricePerNight: number;
  isLoggedIn: boolean;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
  const total = nights * pricePerNight;

  return (
    <Box
      component="form"
      action={async (formData: FormData) => {
        setError(null);
        if (!checkIn || !checkOut) {
          setError("Vui lòng chọn ngày nhận và trả phòng.");
          return;
        }
        if (nights <= 0) {
          setError("Ngày trả phòng phải sau ngày nhận phòng.");
          return;
        }
        setSubmitting(true);
        try {
          await createRoomBooking(formData);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
          setSubmitting(false);
        }
      }}
    >
      <input type="hidden" name="room_id" value={roomId} />

      <Stack spacing={1.75}>
        <TextField
          label="Nhận phòng"
          type="date"
          name="check_in"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
        <TextField
          label="Trả phòng"
          type="date"
          name="check_out"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
        <TextField
          select
          label="Phương thức thanh toán"
          name="payment_method"
          size="small"
          defaultValue="vnpay"
        >
          <MenuItem value="vnpay">VNPay</MenuItem>
          <MenuItem value="momo">MoMo</MenuItem>
          <MenuItem value="credit_card">Thẻ tín dụng</MenuItem>
          <MenuItem value="cash">Tiền mặt tại quầy</MenuItem>
        </TextField>

        {nights > 0 && (
          <Box sx={{ fontSize: 13, color: "text.secondary" }}>
            {nights} đêm × {formatVND(pricePerNight)} ={" "}
            <Typography component="span" sx={{ color: "primary.dark", fontWeight: 600 }}>
              {formatVND(total)}
            </Typography>
          </Box>
        )}

        {error && (
          <Typography sx={{ fontSize: 13, color: "error.main" }}>{error}</Typography>
        )}

        <Button type="submit" variant="contained" disabled={submitting} sx={{ mt: 1 }}>
          {submitting ? (
            <CircularProgress size={18} sx={{ color: "inherit" }} />
          ) : isLoggedIn ? (
            "Đặt phòng"
          ) : (
            "Đăng nhập để đặt phòng"
          )}
        </Button>
      </Stack>
    </Box>
  );
}
