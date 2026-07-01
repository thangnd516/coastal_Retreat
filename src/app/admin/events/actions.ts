"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("events").insert({
    title: String(formData.get("title")),
    description: String(formData.get("description") || ""),
    event_date: String(formData.get("event_date")),
    price_per_ticket: Number(formData.get("price_per_ticket")),
    max_attendees: Number(formData.get("max_attendees")),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function updateEvent(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id"));

  const { error } = await supabase
    .from("events")
    .update({
      title: String(formData.get("title")),
      description: String(formData.get("description") || ""),
      event_date: String(formData.get("event_date")),
      price_per_ticket: Number(formData.get("price_per_ticket")),
      max_attendees: Number(formData.get("max_attendees")),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
