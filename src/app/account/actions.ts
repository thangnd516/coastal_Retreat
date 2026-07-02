"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") || ""),
      phone: String(formData.get("phone") || ""),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/account/profile");
}

export async function toggleWishlist(roomId: string, currentlyWishlisted: boolean) {
  const { supabase, user } = await requireUser();

  if (currentlyWishlisted) {
    await supabase.from("wishlist").delete().eq("user_id", user.id).eq("room_id", roomId);
  } else {
    await supabase.from("wishlist").insert({ user_id: user.id, room_id: roomId });
  }

  revalidatePath("/account/wishlist");
  revalidatePath(`/homestay/${roomId}`);
}

export async function awardLoyaltyPoints(
  userId: string,
  points: number,
  reason: string,
  referenceId?: string
) {
  const supabase = await createClient();
  await supabase.from("loyalty_points").insert({
    user_id: userId,
    points,
    reason,
    reference_id: referenceId ?? null,
  });
}
