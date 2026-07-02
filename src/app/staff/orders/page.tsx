import { Box, Typography, Chip } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { formatVND, formatDate } from "@/lib/format";
import StatusSelect from "@/components/StatusSelect";
import RealtimeOrders from "./RealtimeOrders";
import { updateOrderStatusStaff } from "./actions";

const statusColor: Record<string, "warning" | "info" | "success" | "default" | "error"> = {
  pending: "warning",
  preparing: "info",
  ready: "success",
  completed: "default",
  cancelled: "error",
};

const statusLabel: Record<string, string> = {
  pending: "Chờ xử lý",
  preparing: "Đang pha chế",
  ready: "Sẵn sàng",
  completed: "Hoàn tất",
  cancelled: "Đã huỷ",
};

export default async function StaffOrdersPage() {
  const supabase = await createClient();

  // Staff thấy tất cả orders (RLS cho phép is_staff_or_admin)
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(quantity, unit_price, products(name))")
    .not("status", "in", '("completed","cancelled")')
    .order("created_at", { ascending: true });

  const { data: completedToday } = await supabase
    .from("orders")
    .select("id, total_amount")
    .eq("status", "completed")
    .gte(
      "created_at",
      new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
    );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Typography variant="h2" sx={{ fontSize: 28 }}>
          Đơn hàng
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          Hoàn tất hôm nay: {completedToday?.length ?? 0} đơn ·{" "}
          {formatVND(
            (completedToday ?? []).reduce((s, o) => s + Number(o.total_amount), 0)
          )}
        </Typography>
      </Box>

      <RealtimeOrders
        initialOrders={orders ?? []}
        onUpdateStatus={updateOrderStatusStaff}
      />
    </Box>
  );
}
