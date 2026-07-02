"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null); // 2. Tạo ref cho form
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", px: 3 }}>
      <Box sx={{ width: "100%", maxWidth: 380, border: "1px solid", borderColor: "divider", p: 4 }}>
        <Typography
          component={Link}
          href="/"
          sx={{ textDecoration: "none", color: "text.primary", fontFamily: "var(--font-cormorant), serif", fontSize: 22, fontWeight: 600 }}
        >
          Coastal Retreat
        </Typography>

        <Tabs
          value={mode}
          onChange={(_, v) => {
            setMode(v);
            setError(null);
          }}
          sx={{ mt: 3, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Tab value="login" label="Đăng nhập" sx={{ textTransform: "none", flex: 1 }} />
          <Tab value="signup" label="Đăng ký" sx={{ textTransform: "none", flex: 1 }} />
        </Tabs>

        <Box
          ref={formRef} // 3. Gán ref cho form
          component="form"
          sx={{ mt: 3 }}
          action={async () => {
            setError(null);
            setSubmitting(true);
            const formData = new FormData(formRef.current!);
            try {
              console.log("Dữ liệu trong form:", Object.fromEntries(formData.entries()));

              const result = mode === "login"
                ? await login(formData)
                : await signup(formData);

              if (result?.error) setError(result.error);
            } catch (err) {
              setError("Có lỗi hệ thống.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Stack spacing={1.75}>
            {mode === "signup" && (
              <TextField name="full_name" label="Họ và tên" size="small" required />
            )}
            <TextField name="email" type="email" label="Email" size="small" required />
            <TextField name="password" type="password" label="Mật khẩu" size="small" required />

            {error && <Typography sx={{ fontSize: 13, color: "error.main" }}>{error}</Typography>}

            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? (
                <CircularProgress size={18} sx={{ color: "inherit" }} />
              ) : mode === "login" ? (
                "Đăng nhập"
              ) : (
                "Tạo tài khoản"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}