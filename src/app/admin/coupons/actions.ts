"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function createCoupon(formData: FormData) {
  const { supabase } = await requireAdmin();

  const validUntil = String(formData.get("valid_until") || "");
  const maxUses = String(formData.get("max_uses") || "");

  const { error } = await supabase.from("coupons").insert({
    code: String(formData.get("code")).toUpperCase().trim(),
    description: String(formData.get("description") || ""),
    discount_type: String(formData.get("discount_type")),
    discount_value: Number(formData.get("discount_value")),
    min_order_amount: Number(formData.get("min_order_amount") || 0),
    max_uses: maxUses ? Number(maxUses) : null,
    valid_until: validUntil || null,
    is_active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(id: string, value: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("coupons").update({ is_active: value }).eq("id", id);
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("coupons").delete().eq("id", id);
  revalidatePath("/admin/coupons");
}
