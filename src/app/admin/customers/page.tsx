import { Box, Typography, Chip } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { formatVND, formatDate } from "@/lib/format";

export default async function AdminCustomers() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: payments }] = await Promise.all([
    supabase.from("profiles").select("*").eq("role", "customer").order("created_at", { ascending: false }),
    supabase.from("payments").select("user_id, amount, status, created_at"),
  ]);

  const stats = new Map<string, { count: number; total: number; last: string | null }>();
  for (const p of payments ?? []) {
    if (p.status === "failed") continue;
    const cur = stats.get(p.user_id) ?? { count: 0, total: 0, last: null };
    cur.count += 1;
    cur.total += Number(p.amount);
    if (!cur.last || p.created_at > cur.last) cur.last = p.created_at;
    stats.set(p.user_id, cur);
  }

  const segment = (total: number) => {
    if (total >= 10_000_000) return { label: "VIP", color: "primary" as const };
    if (total > 0) return { label: "Returning", color: "default" as const };
    return { label: "New", color: "default" as const };
  };

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Khách hàng
      </Typography>

      <Box sx={{ mt: 3, border: "1px solid", borderColor: "divider" }}>
        {(profiles ?? []).map((c) => {
          const s = stats.get(c.id) ?? { count: 0, total: 0, last: null };
          const seg = segment(s.total);
          return (
            <Box
              key={c.id}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
                px: 2.5,
                py: 1.75,
                fontSize: 14,
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-of-type": { borderBottom: "none" },
              }}
            >
              <Box sx={{ minWidth: 160 }}>{c.full_name || "—"}</Box>
              <Box sx={{ flex: 1, minWidth: 160, color: "text.secondary" }}>{c.phone || "—"}</Box>
              <Box sx={{ color: "text.secondary", minWidth: 70 }}>{s.count} lần</Box>
              <Box sx={{ fontFamily: "var(--font-cormorant), serif", color: "primary.dark", minWidth: 110 }}>
                {formatVND(s.total)}
              </Box>
              <Box sx={{ color: "text.secondary", minWidth: 90 }}>
                {s.last ? formatDate(s.last) : "—"}
              </Box>
              <Chip
                size="small"
                label={seg.label}
                color={seg.color}
                sx={seg.label === "VIP" ? { color: "primary.contrastText" } : undefined}
              />
            </Box>
          );
        })}
        {(!profiles || profiles.length === 0) && (
          <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
            Chưa có khách hàng nào đăng ký.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
