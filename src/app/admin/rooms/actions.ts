"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function createRoom(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("rooms").insert({
    name: String(formData.get("name")),
    type: String(formData.get("type")),
    description: String(formData.get("description") || ""),
    price_per_night: Number(formData.get("price_per_night")),
    capacity: Number(formData.get("capacity")),
    is_available: formData.get("is_available") === "on",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/rooms");
  revalidatePath("/homestay");
}

export async function updateRoom(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id"));

  const { error } = await supabase
    .from("rooms")
    .update({
      name: String(formData.get("name")),
      type: String(formData.get("type")),
      description: String(formData.get("description") || ""),
      price_per_night: Number(formData.get("price_per_night")),
      capacity: Number(formData.get("capacity")),
      is_available: formData.get("is_available") === "on",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/rooms");
  revalidatePath("/homestay");
}

export async function deleteRoom(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/rooms");
  revalidatePath("/homestay");
}
