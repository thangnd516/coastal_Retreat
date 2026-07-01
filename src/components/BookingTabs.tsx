"use client";

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

export default function BookingTabs({
  room,
  order,
  event,
}: {
  room: React.ReactNode;
  order: React.ReactNode;
  event: React.ReactNode;
}) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Tab label="Đặt phòng" sx={{ textTransform: "none" }} />
        <Tab label="Café / Bakery" sx={{ textTransform: "none" }} />
        <Tab label="Sự kiện" sx={{ textTransform: "none" }} />
      </Tabs>
      <Box sx={{ mt: 2.5 }}>
        {tab === 0 && room}
        {tab === 1 && order}
        {tab === 2 && event}
      </Box>
    </Box>
  );
}
