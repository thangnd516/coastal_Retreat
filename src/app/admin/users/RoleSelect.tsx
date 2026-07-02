"use client";

import { useState, useTransition } from "react";
import { Select, MenuItem, CircularProgress, Box } from "@mui/material";
import { assignRole } from "./actions";
import type { UserRole } from "@/types/database";

export default function RoleSelect({
  userId,
  currentRole,
  selfId,
}: {
  userId: string;
  currentRole: UserRole;
  selfId: string;
}) {
  const [value, setValue] = useState<UserRole>(currentRole);
  const [pending, startTransition] = useTransition();
  const isSelf = userId === selfId;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Select
        size="small"
        value={value}
        disabled={isSelf || pending}
        onChange={(e) => {
          const next = e.target.value as UserRole;
          setValue(next);
          startTransition(() => assignRole(userId, next));
        }}
        sx={{ fontSize: 13, minWidth: 110 }}
      >
        <MenuItem value="customer" sx={{ fontSize: 13 }}>customer</MenuItem>
        <MenuItem value="staff" sx={{ fontSize: 13 }}>staff</MenuItem>
        <MenuItem value="admin" sx={{ fontSize: 13 }}>admin</MenuItem>
      </Select>
      {pending && <CircularProgress size={14} />}
      {isSelf && (
        <Box sx={{ fontSize: 11, color: "text.secondary", fontFamily: "var(--font-plexmono), monospace" }}>
          (bạn)
        </Box>
      )}
    </Box>
  );
}
