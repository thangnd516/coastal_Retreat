import { Box, Typography, Chip } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import RoleSelect from "./RoleSelect";
import type { UserRole } from "@/types/database";

const roleColor: Record<UserRole, "default" | "warning" | "error"> = {
  customer: "default",
  staff: "warning",
  admin: "error",
};

export default async function AdminUsersPage() {
  const { user: currentUser } = await requireAdmin();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("role")
    .order("created_at", { ascending: false });

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Người dùng &amp; Phân quyền
      </Typography>
      <Typography sx={{ mt: 0.5, mb: 3, fontSize: 13, color: "text.secondary" }}>
        Gán role trực tiếp — thay đổi có hiệu lực ngay lần đăng nhập tiếp theo.
      </Typography>

      <Box
        sx={{
          mb: 3,
          p: 2,
          border: "1px solid",
          borderColor: "warning.light",
          bgcolor: "rgba(255,193,7,0.06)",
          borderRadius: 1,
          fontSize: 13,
          color: "text.secondary",
        }}
      >
        <strong>Phân quyền:</strong>&nbsp;
        <Chip size="small" label="customer" /> xem/đặt dịch vụ của mình &nbsp;·&nbsp;
        <Chip size="small" label="staff" color="warning" /> xem + xử lý orders, bật/tắt món &nbsp;·&nbsp;
        <Chip size="small" label="admin" color="error" /> toàn quyền hệ thống
      </Box>

      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            px: 2.5,
            py: 1.5,
            bgcolor: "#F2EDE4",
            fontSize: 11,
            fontFamily: "var(--font-plexmono), monospace",
            color: "text.secondary",
            borderBottom: "1px solid",
            borderColor: "divider",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 160 }}>TÊN</Box>
          <Box sx={{ flex: 1 }}>ĐIỆN THOẠI</Box>
          <Box sx={{ minWidth: 110 }}>NGÀY TẠO</Box>
          <Box sx={{ minWidth: 160 }}>ROLE</Box>
        </Box>

        {(profiles ?? []).map((p) => (
          <Box
            key={p.id}
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              px: 2.5,
              py: 1.75,
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-of-type": { borderBottom: "none" },
              fontSize: 14,
            }}
          >
            <Box sx={{ minWidth: 160 }}>
              {p.full_name || "—"}
              <Chip
                size="small"
                label={p.role}
                color={roleColor[p.role as UserRole] ?? "default"}
                sx={{ ml: 1, fontSize: 10, height: 18 }}
              />
            </Box>
            <Box sx={{ flex: 1, color: "text.secondary" }}>{p.phone || "—"}</Box>
            <Box sx={{ minWidth: 110, color: "text.secondary" }}>
              {formatDate(p.created_at)}
            </Box>
            <RoleSelect
              userId={p.id}
              currentRole={p.role as UserRole}
              selfId={currentUser.id}
            />
          </Box>
        ))}

        {(!profiles || profiles.length === 0) && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có người dùng nào.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
