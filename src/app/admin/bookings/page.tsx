import { Box, Typography } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { formatVND, formatDate } from "@/lib/format";
import StatusSelect from "@/components/StatusSelect";
import BookingTabs from "@/components/BookingTabs";
import {
  updateRoomBookingStatus,
  updateOrderStatus,
  updateEventBookingStatus,
} from "./actions";

export default async function AdminBookings() {
  const supabase = await createClient();

  const [{ data: roomBookings }, { data: orders }, { data: eventBookings }] = await Promise.all([
    supabase
      .from("room_bookings")
      .select("*, rooms(name), profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("event_bookings")
      .select("*, events(title), profiles(full_name)")
      .order("created_at", { ascending: false }),
  ]);

  const Table = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ border: "1px solid", borderColor: "divider" }}>{children}</Box>
  );
  const Row = ({ children }: { children: React.ReactNode }) => (
    <Box
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
      {children}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Quản lý đặt phòng
      </Typography>

      <Box sx={{ mt: 3 }}>
        <BookingTabs
          room={
            <Table>
              {(roomBookings ?? []).map((b) => (
                <Row key={b.id}>
                  <Box sx={{ fontFamily: "var(--font-plexmono), monospace", color: "text.secondary", minWidth: 80 }}>
                    #{b.id.slice(0, 6)}
                  </Box>
                  <Box sx={{ minWidth: 140 }}>{b.profiles?.full_name ?? "—"}</Box>
                  <Box sx={{ minWidth: 140, color: "text.secondary" }}>{b.rooms?.name}</Box>
                  <Box sx={{ color: "text.secondary" }}>
                    {formatDate(b.check_in_date)} → {formatDate(b.check_out_date)}
                  </Box>
                  <Box sx={{ fontFamily: "var(--font-cormorant), serif", color: "primary.dark" }}>
                    {formatVND(Number(b.total_price))}
                  </Box>
                  <Box sx={{ ml: "auto" }}>
                    <StatusSelect
                      id={b.id}
                      status={b.status}
                      options={["pending", "confirmed", "completed", "cancelled"]}
                      onUpdate={updateRoomBookingStatus}
                    />
                  </Box>
                </Row>
              ))}
              {(!roomBookings || roomBookings.length === 0) && (
                <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
                  Chưa có đặt phòng nào.
                </Typography>
              )}
            </Table>
          }
          order={
            <Table>
              {(orders ?? []).map((o) => (
                <Row key={o.id}>
                  <Box sx={{ fontFamily: "var(--font-plexmono), monospace", color: "text.secondary", minWidth: 80 }}>
                    #{o.id.slice(0, 6)}
                  </Box>
                  <Box sx={{ minWidth: 140 }}>{o.profiles?.full_name ?? "—"}</Box>
                  <Box sx={{ minWidth: 120, color: "text.secondary" }}>{o.order_type}</Box>
                  <Box sx={{ color: "text.secondary" }}>{formatDate(o.created_at)}</Box>
                  <Box sx={{ fontFamily: "var(--font-cormorant), serif", color: "primary.dark" }}>
                    {formatVND(Number(o.total_amount))}
                  </Box>
                  <Box sx={{ ml: "auto" }}>
                    <StatusSelect
                      id={o.id}
                      status={o.status}
                      options={["pending", "preparing", "ready", "completed", "cancelled"]}
                      onUpdate={updateOrderStatus}
                    />
                  </Box>
                </Row>
              ))}
              {(!orders || orders.length === 0) && (
                <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
                  Chưa có đơn hàng nào.
                </Typography>
              )}
            </Table>
          }
          event={
            <Table>
              {(eventBookings ?? []).map((e) => (
                <Row key={e.id}>
                  <Box sx={{ fontFamily: "var(--font-plexmono), monospace", color: "text.secondary", minWidth: 80 }}>
                    #{e.id.slice(0, 6)}
                  </Box>
                  <Box sx={{ minWidth: 140 }}>{e.profiles?.full_name ?? "—"}</Box>
                  <Box sx={{ minWidth: 160, color: "text.secondary" }}>{e.events?.title}</Box>
                  <Box sx={{ color: "text.secondary" }}>{e.ticket_quantity} vé</Box>
                  <Box sx={{ fontFamily: "var(--font-cormorant), serif", color: "primary.dark" }}>
                    {formatVND(Number(e.total_price))}
                  </Box>
                  <Box sx={{ ml: "auto" }}>
                    <StatusSelect
                      id={e.id}
                      status={e.status}
                      options={["confirmed", "cancelled"]}
                      onUpdate={updateEventBookingStatus}
                    />
                  </Box>
                </Row>
              ))}
              {(!eventBookings || eventBookings.length === 0) && (
                <Typography sx={{ px: 2.5, py: 2, fontSize: 13, color: "text.secondary" }}>
                  Chưa có vé sự kiện nào.
                </Typography>
              )}
            </Table>
          }
        />
      </Box>
    </Box>
  );
}
