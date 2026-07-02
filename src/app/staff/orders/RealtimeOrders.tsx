"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { createClient } from "@/lib/supabase/client";
import StatusSelect from "@/components/StatusSelect";
import { formatVND, formatDate } from "@/lib/format";

type OrderItem = {
  quantity: number;
  unit_price: number;
  products?: { name: string } | null;
};

type Order = {
  id: string;
  status: string;
  order_type: string | null;
  total_amount: number;
  created_at: string;
  order_items?: OrderItem[];
};

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

export default function RealtimeOrders({
  initialOrders,
  onUpdateStatus,
}: {
  initialOrders: Order[];
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [newAlert, setNewAlert] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("staff-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev]);
          setNewAlert(true);
          // Âm thanh thông báo đơn mới
          try { new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA").play().catch(() => {}); } catch {}
          setTimeout(() => setNewAlert(false), 3000);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updated = payload.new as Order;
          setOrders((prev) =>
            updated.status === "completed" || updated.status === "cancelled"
              ? prev.filter((o) => o.id !== updated.id)
              : prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      {newAlert && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: "warning.light", borderRadius: 1, fontSize: 13, color: "warning.dark", display: "flex", alignItems: "center", gap: 1 }}>
          🔔 Đơn mới vừa vào!
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {orders.map((o) => (
          <Box
            key={o.id}
            sx={{
              border: "1px solid",
              borderColor: o.status === "pending" ? "warning.light" : o.status === "preparing" ? "info.light" : "divider",
              p: 2.5,
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Chip size="small" label={statusLabel[o.status] ?? o.status} color={statusColor[o.status] ?? "default"} />
                <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 11, color: "text.secondary" }}>
                  #{o.id.slice(0, 6).toUpperCase()} · {o.order_type} · {formatDate(o.created_at)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 18, color: "primary.dark" }}>
                  {formatVND(Number(o.total_amount))}
                </Typography>
                <StatusSelect
                  id={o.id}
                  status={o.status}
                  options={["pending", "preparing", "ready", "completed", "cancelled"]}
                  onUpdate={onUpdateStatus}
                />
              </Box>
            </Box>
            {o.order_items && o.order_items.length > 0 && (
              <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {o.order_items.map((item, i) => (
                  <Chip key={i} size="small" variant="outlined" label={`${item.products?.name ?? "?"} ×${item.quantity}`} sx={{ fontSize: 12 }} />
                ))}
              </Box>
            )}
          </Box>
        ))}

        {orders.length === 0 && (
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            Không có đơn hàng đang chờ xử lý. 🎉
          </Typography>
        )}
      </Box>
    </Box>
  );
}
