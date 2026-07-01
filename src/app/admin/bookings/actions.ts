"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function updateRoomBookingStatus(id: string, status: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("room_bookings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
}

export async function updateEventBookingStatus(id: string, status: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("event_bookings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
}
