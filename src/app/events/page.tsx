import Link from "next/link";
import { Box, Typography, Stack } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ px: { xs: 3, md: 7 }, py: 5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="overline" color="primary.main">
          EVENTS
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, fontSize: 36 }}>
          Sự kiện sắp diễn ra
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 480, fontSize: 14, color: "text.secondary" }}>
          Đêm nhạc acoustic, workshop cà phê và các hoạt động cộng đồng bên
          biển.
        </Typography>
      </Box>

      <Stack divider={<Box sx={{ height: "1px", bgcolor: "divider" }} />} sx={{ px: { xs: 3, md: 7 } }}>
        {(events ?? []).map((ev) => {
          const d = new Date(ev.event_date);
          const day = d.toLocaleDateString("vi-VN", { day: "2-digit" });
          const mon = `TH${d.getMonth() + 1}`;
          const remaining = ev.max_attendees - ev.current_attendees;
          
          return (
            <Link 
              key={ev.id} 
              href={`/events/${ev.id}`} 
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  py: 3,
                  "&:hover": { bgcolor: "#F2EDE4" },
                }}
              >
                <Box sx={{ width: 64, flexShrink: 0, border: "1px solid", borderColor: "divider", py: 1.25, textAlign: "center" }}>
                  <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24, color: "primary.dark" }}>
                    {day}
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 10, color: "text.secondary" }}>
                    {mon}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontSize: 20 }}>
                    {ev.title}
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                    {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ·{" "}
                    {remaining > 0 ? `Còn ${remaining} chỗ` : "Hết chỗ"}
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 13, color: "primary.dark" }}>
                  {formatVND(ev.price_per_ticket)}
                </Typography>
              </Box>
            </Link>
          );
        })}
        {(!events || events.length === 0) && (
          <Typography sx={{ py: 4, color: "text.secondary" }}>
            Chưa có sự kiện nào sắp diễn ra.
          </Typography>
        )}
      </Stack>

      <Box sx={{ height: 40 }} />
      <Footer />
    </Box>
  );
}