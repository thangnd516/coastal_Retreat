"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { useColorMode } from "@/theme/ThemeRegistry";

const options = [
  { value: "light",  label: "Sáng",  icon: <LightModeIcon fontSize="small" /> },
  { value: "dark",   label: "Tối",   icon: <DarkModeIcon fontSize="small" /> },
  { value: "system", label: "Hệ thống", icon: <SettingsBrightnessIcon fontSize="small" /> },
] as const;

export default function ColorModeToggle() {
  const { mode, setMode, resolved } = useColorMode();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const currentIcon =
    mode === "dark"   ? <DarkModeIcon fontSize="small" />
    : mode === "light" ? <LightModeIcon fontSize="small" />
    : <SettingsBrightnessIcon fontSize="small" />;

  return (
    <>
      <Tooltip title="Chủ đề màu">
        <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ color: "text.secondary" }}>
          {currentIcon}
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {options.map((o) => (
          <MenuItem
            key={o.value}
            selected={mode === o.value}
            onClick={() => { setMode(o.value); setAnchor(null); }}
            sx={{ fontSize: 13, minWidth: 140 }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>{o.icon}</ListItemIcon>
            <ListItemText sx={{ "& .MuiListItemText-primary": { fontSize: 13 } }}>{o.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
