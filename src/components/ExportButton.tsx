"use client";

import { useState, useMemo } from "react";
import { Box, Button, TextField, Menu, MenuItem } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function ExportButton() {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  // Sử dụng callback lazy initialization trong useState để tính toán chỉ 1 lần duy nhất
  const [from, setFrom] = useState(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return thirtyDaysAgo.toISOString().slice(0, 10);
  });

  const [to, setTo] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const dl = (type: string) => {
    // Sử dụng window.location.href an toàn bên trong hàm xử lý sự kiện
    window.location.href = `/api/export?type=${type}&from=${from}&to=${to}`;
    setAnchor(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <TextField 
        type="date" 
        size="small" 
        value={from} 
        onChange={(e) => setFrom(e.target.value)} 
        slotProps={{ inputLabel: { shrink: true } }} 
        label="Từ" 
        sx={{ width: 145 }} 
      />
      <TextField 
        type="date" 
        size="small" 
        value={to} 
        onChange={(e) => setTo(e.target.value)} 
        slotProps={{ inputLabel: { shrink: true } }} 
        label="Đến" 
        sx={{ width: 145 }} 
      />
      <Button 
        startIcon={<DownloadIcon fontSize="small" />} 
        variant="outlined" 
        size="small" 
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        Xuất CSV
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => dl("bookings")} sx={{ fontSize: 14 }}>Danh sách đặt phòng</MenuItem>
        <MenuItem onClick={() => dl("revenue")} sx={{ fontSize: 14 }}>Doanh thu theo ngày</MenuItem>
      </Menu>
    </Box>
  );
}