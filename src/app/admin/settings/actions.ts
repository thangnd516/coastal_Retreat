"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function updateAdminProfile(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") || ""),
      phone: String(formData.get("phone") || ""),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
}
