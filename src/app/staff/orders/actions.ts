"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaffOrAdmin, writeAdminLog } from "@/lib/auth";

export async function updateOrderStatusStaff(id: string, status: string) {
  const { supabase, user } = await requireStaffOrAdmin();

  // Lấy giá trị cũ trước khi cập nhật
  const { data: old } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  await writeAdminLog(supabase, user.id, "update_order_status", "orders", id, { status: old?.status }, { status });

  revalidatePath("/staff/orders");
  revalidatePath("/admin/bookings");
}
