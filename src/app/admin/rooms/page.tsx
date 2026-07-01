import { Box, Typography } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import RoomManager from "./RoomManager";

export default async function AdminRooms() {
  const supabase = await createClient();
  const { data: rooms } = await supabase.from("rooms").select("*").order("price_per_night");

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Quản lý phòng
      </Typography>
      <Box sx={{ mt: 3 }}>
        <RoomManager rooms={rooms ?? []} />
      </Box>
    </Box>
  );
}
