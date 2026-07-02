"use client";

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";

type DataPoint = { date: string; room: number; cafe: number; event: number };

const fmt = (v: number) =>
  v >= 1_000_000
    ? (v / 1_000_000).toFixed(1) + "M"
    : v >= 1_000
    ? (v / 1_000).toFixed(0) + "K"
    : String(v);

export default function RevenueCharts({ data }: { data: DataPoint[] }) {
  const [chart, setChart] = useState<"area" | "bar">("area");

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", p: 3, mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20 }}>
          Doanh thu 30 ngày gần nhất
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={chart}
          onChange={(_, v) => v && setChart(v)}
          size="small"
        >
          <ToggleButton value="area" sx={{ fontSize: 12, px: 1.5 }}>Area</ToggleButton>
          <ToggleButton value="bar"  sx={{ fontSize: 12, px: 1.5 }}>Bar</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={260}>
        {chart === "area" ? (
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gRoom"  x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#B07A5B" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#B07A5B" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gCafe"  x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#5B8EB0" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#5B8EB0" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gEvent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7A5BB0" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#7A5BB0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
            <Tooltip formatter={(v) => [`₫${(Number(v)/1000).toFixed(0)}K`]} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="room"  name="Phòng"    stroke="#B07A5B" fill="url(#gRoom)"  strokeWidth={2}/>
            <Area type="monotone" dataKey="cafe"  name="Café"     stroke="#5B8EB0" fill="url(#gCafe)"  strokeWidth={2}/>
            <Area type="monotone" dataKey="event" name="Sự kiện"  stroke="#7A5BB0" fill="url(#gEvent)" strokeWidth={2}/>
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
            <Tooltip formatter={(v) => [`₫${(Number(v)/1000).toFixed(0)}K`]} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="room"  name="Phòng"   fill="#B07A5B" radius={[3,3,0,0]}/>
            <Bar dataKey="cafe"  name="Café"    fill="#5B8EB0" radius={[3,3,0,0]}/>
            <Bar dataKey="event" name="Sự kiện" fill="#7A5BB0" radius={[3,3,0,0]}/>
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}
