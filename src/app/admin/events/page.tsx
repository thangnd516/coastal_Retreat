import { Box, Typography } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import EventManager from "./EventManager";

export default async function AdminEvents() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").order("event_date", { ascending: true });

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Quản lý sự kiện
      </Typography>
      <Box sx={{ mt: 3 }}>
        <EventManager events={events ?? []} />
      </Box>
    </Box>
  );
}
