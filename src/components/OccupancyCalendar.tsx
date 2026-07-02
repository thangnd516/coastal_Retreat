"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Room, RoomBooking } from "@/types/database";

type Props = {
  rooms: Room[];
  bookings: Pick<RoomBooking, "room_id" | "check_in_date" | "check_out_date" | "status">[];
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "#B07A5B",
  pending: "#E8C9A0",
  completed: "#9A9080",
  cancelled: "transparent",
};

export default function OccupancyCalendar({ rooms, bookings }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthLabel = new Date(year, month, 1).toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  function isOccupied(roomId: string, day: number) {
    const date = new Date(year, month, day);
    return bookings.find((b) => {
      if (b.room_id !== roomId || b.status === "cancelled") return false;
      const cin = new Date(b.check_in_date);
      const cout = new Date(b.check_out_date);
      return date >= cin && date < cout;
    });
  }

  const prev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const cellW = Math.max(24, Math.min(34, Math.floor(540 / daysInMonth)));

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", p: 3, mt: 3, overflowX: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20 }}>
          Lịch tình trạng phòng
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={prev}><ChevronLeftIcon fontSize="small" /></IconButton>
          <Typography sx={{ fontSize: 14, minWidth: 130, textAlign: "center" }}>{monthLabel}</Typography>
          <IconButton size="small" onClick={next}><ChevronRightIcon fontSize="small" /></IconButton>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 2.5, mb: 2, flexWrap: "wrap" }}>
        {[["confirmed", "Đã xác nhận"], ["pending", "Chờ xử lý"], ["completed", "Hoàn tất"]].map(([s, l]) => (
          <Box key={s} sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 12, color: "text.secondary" }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: STATUS_COLORS[s], border: "1px solid", borderColor: "divider" }} />
            {l}
          </Box>
        ))}
      </Box>

      <Box sx={{ minWidth: "max-content" }}>
        {/* Day header */}
        <Box sx={{ display: "flex", mb: 0.5 }}>
          <Box sx={{ width: 160, flexShrink: 0 }} />
          {days.map((d) => (
            <Box
              key={d}
              sx={{
                width: cellW, textAlign: "center", fontSize: 10,
                color: d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                  ? "primary.dark" : "text.secondary",
                fontWeight: d === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? 600 : 400,
              }}
            >
              {d}
            </Box>
          ))}
        </Box>

        {/* Rooms */}
        {rooms.map((room) => (
          <Box key={room.id} sx={{ display: "flex", alignItems: "center", mb: 0.75 }}>
            <Box sx={{ width: 160, flexShrink: 0, pr: 1.5, fontSize: 13, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {room.name}
            </Box>
            {days.map((d) => {
              const booking = isOccupied(room.id, d);
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <Tooltip
                  key={d}
                  title={booking ? `${booking.status} · ${booking.check_in_date} → ${booking.check_out_date}` : "Còn trống"}
                  arrow
                >
                  <Box
                    sx={{
                      width: cellW,
                      height: 24,
                      bgcolor: booking ? STATUS_COLORS[booking.status] ?? "#E8C9A0" : "#F2EDE4",
                      border: "1px solid",
                      borderColor: isToday ? "primary.main" : "divider",
                      borderRadius: 0.5,
                      cursor: booking ? "pointer" : "default",
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
