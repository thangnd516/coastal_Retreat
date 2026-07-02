"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, writeAdminLog } from "@/lib/auth";
import type { UserRole } from "@/types/database";

export async function assignRole(userId: string, role: UserRole) {
  const { supabase, user } = await requireAdmin();

  const { data: old } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  await writeAdminLog(
    supabase,
    user.id,
    "assign_role",
    "profiles",
    userId,
    { role: old?.role },
    { role }
  );

  revalidatePath("/admin/users");
}
