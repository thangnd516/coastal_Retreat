"use client";

import { useState, useTransition } from "react";
import { Select, MenuItem, CircularProgress, Box } from "@mui/material";

export default function StatusSelect({
  id,
  status,
  options,
  onUpdate,
}: {
  id: string;
  status: string;
  options: string[];
  onUpdate: (id: string, status: string) => Promise<void>;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Select
        size="small"
        value={value}
        onChange={(e) => {
          const next = e.target.value as string;
          setValue(next);
          startTransition(() => {
            onUpdate(id, next);
          });
        }}
        sx={{ fontSize: 13, minWidth: 130 }}
      >
        {options.map((o) => (
          <MenuItem key={o} value={o} sx={{ fontSize: 13 }}>
            {o}
          </MenuItem>
        ))}
      </Select>
      {pending && <CircularProgress size={14} />}
    </Box>
  );
}
