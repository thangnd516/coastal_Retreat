import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

async function getUserWithRole(): Promise<{ supabase: Awaited<ReturnType<typeof createClient>>; user: NonNullable<Awaited<ReturnType<Awaited<ReturnType<typeof createClient>>["auth"]["getUser"]>>["data"]["user"]>; role: UserRole }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { supabase, user, role: (profile?.role ?? "customer") as UserRole };
}

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function requireAdmin() {
  const { supabase, user, role } = await getUserWithRole();
  if (role !== "admin") redirect("/");
  return { supabase, user };
}

export async function requireStaff() {
  const { supabase, user, role } = await getUserWithRole();
  if (role !== "staff") redirect("/");
  return { supabase, user };
}

export async function requireStaffOrAdmin() {
  const { supabase, user, role } = await getUserWithRole();
  if (role !== "staff" && role !== "admin") redirect("/");
  return { supabase, user, role };
}

/** Ghi audit log hành động của staff/admin */
export async function writeAdminLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actorId: string,
  action: string,
  targetTable: string,
  targetId?: string,
  oldValue?: Record<string, unknown>,
  newValue?: Record<string, unknown>
) {
  await supabase.from("admin_logs").insert({
    actor_id: actorId,
    action,
    target_table: targetTable,
    target_id: targetId ?? null,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
  });
}
