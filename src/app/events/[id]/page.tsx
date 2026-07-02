import { notFound } from "next/navigation";
import { Box, Typography, Grid } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import EventBookingForm from "./EventBookingForm";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();
  if (!event) return notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const d = new Date(event.event_date);
  const remaining = event.max_attendees - event.current_attendees;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />

      <Box sx={{ px: { xs: 3, md: 7 }, py: 4 }}>
        <ImagePlaceholder
          src={event.thumbnail_url || 'https://via.placeholder.com/400x320?text=Chua+co+anh'}
          label=""
          height={320}
        />

        <Grid container spacing={5} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 11, color: "primary.main" }}>
              {d.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })} ·{" "}
              {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontSize: 36 }}>
              {event.title}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 14, color: "text.secondary" }}>
              {remaining > 0 ? `Còn ${remaining}/${event.max_attendees} chỗ` : "Đã hết chỗ"}
            </Typography>

            <Box sx={{ mt: 3, height: "1px", bgcolor: "divider" }} />

            <Typography variant="h4" sx={{ mt: 3, fontSize: 24 }}>
              Giới thiệu
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 560, fontSize: 14, lineHeight: 1.7, color: "text.secondary" }}>
              {event.description ||
                "Một buổi tối thư giãn bên biển với âm nhạc acoustic, đồ uống signature và không gian ngoài trời được trang trí ánh đèn ấm."}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: "sticky", top: 24, border: "1px solid", borderColor: "divider", bgcolor: "#F2EDE4", p: 3 }}>
              <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: 24, color: "primary.dark" }}>
                {formatVND(event.price_per_ticket)}
                <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
                  {" "}/người
                </Typography>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <EventBookingForm
                  eventId={event.id}
                  pricePerTicket={Number(event.price_per_ticket)}
                  remaining={remaining}
                  isLoggedIn={!!user}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}
