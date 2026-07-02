import { Box, Typography, Chip } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

const actionColor: Record<string, "default" | "warning" | "error" | "success"> = {
  update_booking_status: "warning",
  update_order_status: "warning",
  delete_product: "error",
  delete_room: "error",
  delete_event: "error",
  delete_blog: "error",
  update_admin_profile: "default",
};

export default async function AdminLogsPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("admin_logs")
    .select("*, profiles(full_name, role)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Nhật ký hành động
      </Typography>
      <Typography sx={{ mt: 0.5, mb: 3, fontSize: 13, color: "text.secondary" }}>
        100 hành động gần nhất của staff &amp; admin.
      </Typography>

      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {(logs ?? []).map((log) => (
          <Box
            key={log.id}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              gap: 2,
              px: 2.5,
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-of-type": { borderBottom: "none" },
              fontSize: 13,
            }}
          >
            <Box sx={{ minWidth: 130, color: "text.secondary" }}>
              {formatDate(log.created_at)}
            </Box>
            <Box sx={{ minWidth: 140 }}>
              {log.profiles?.full_name ?? "—"}
              <Typography
                component="span"
                sx={{
                  ml: 0.75,
                  fontSize: 10,
                  fontFamily: "var(--font-plexmono), monospace",
                  color: "text.secondary",
                }}
              >
                [{log.profiles?.role}]
              </Typography>
            </Box>
            <Chip
              size="small"
              label={log.action}
              color={actionColor[log.action] ?? "default"}
              sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 10 }}
            />
            <Box sx={{ color: "text.secondary" }}>
              {log.target_table}
              {log.target_id ? (
                <Typography
                  component="span"
                  sx={{ ml: 0.75, fontFamily: "var(--font-plexmono), monospace", fontSize: 11 }}
                >
                  #{log.target_id.slice(0, 6).toUpperCase()}
                </Typography>
              ) : null}
            </Box>
            {log.old_value && log.new_value && (
              <Box sx={{ fontSize: 12, color: "text.secondary" }}>
                {JSON.stringify(log.old_value)} →{" "}
                <Typography
                  component="span"
                  sx={{ color: "success.main", fontSize: 12 }}
                >
                  {JSON.stringify(log.new_value)}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
        {(!logs || logs.length === 0) && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có hoạt động nào được ghi lại.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
