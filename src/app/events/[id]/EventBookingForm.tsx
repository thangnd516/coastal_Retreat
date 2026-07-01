"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem, Stack, CircularProgress } from "@mui/material";
import { createEventBooking } from "./actions";
import { formatVND } from "@/lib/format";

export default function EventBookingForm({
  eventId,
  pricePerTicket,
  remaining,
  isLoggedIn,
}: {
  eventId: string;
  pricePerTicket: number;
  remaining: number;
  isLoggedIn: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Box
      component="form"
      action={async (formData: FormData) => {
        setError(null);
        setSubmitting(true);
        try {
          await createEventBooking(formData);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
          setSubmitting(false);
        }
      }}
    >
      <input type="hidden" name="event_id" value={eventId} />
      <Stack spacing={1.75}>
        <TextField
          label="Số vé"
          type="number"
          name="quantity"
          size="small"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          slotProps={{ htmlInput: { min: 1, max: remaining } }}
          disabled={remaining === 0}
        />
        <TextField select label="Phương thức thanh toán" name="payment_method" size="small" defaultValue="vnpay">
          <MenuItem value="vnpay">VNPay</MenuItem>
          <MenuItem value="momo">MoMo</MenuItem>
          <MenuItem value="credit_card">Thẻ tín dụng</MenuItem>
          <MenuItem value="cash">Tiền mặt tại quầy</MenuItem>
        </TextField>

        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          {quantity} vé × {formatVND(pricePerTicket)} ={" "}
          <Typography component="span" sx={{ color: "primary.dark", fontWeight: 600 }}>
            {formatVND(quantity * pricePerTicket)}
          </Typography>
        </Typography>

        {error && <Typography sx={{ fontSize: 13, color: "error.main" }}>{error}</Typography>}

        <Button type="submit" variant="contained" disabled={submitting || remaining === 0}>
          {submitting ? (
            <CircularProgress size={18} sx={{ color: "inherit" }} />
          ) : remaining === 0 ? (
            "Đã hết chỗ"
          ) : isLoggedIn ? (
            "Đặt vé"
          ) : (
            "Đăng nhập để đặt vé"
          )}
        </Button>
      </Stack>
    </Box>
  );
}
