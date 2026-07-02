"use server";

import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "@/types/database";

export type CouponResult =
  | { ok: true; coupon: Coupon; discountAmount: number }
  | { ok: false; error: string };

export async function validateCoupon(code: string, orderAmount: number): Promise<CouponResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Cần đăng nhập để dùng mã." };

  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (!coupon) return { ok: false, error: "Mã không hợp lệ hoặc đã hết hạn." };

  if (coupon.valid_until && new Date(coupon.valid_until) < new Date())
    return { ok: false, error: "Mã đã hết hạn." };
  if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses)
    return { ok: false, error: "Mã đã được sử dụng hết lượt." };
  if (Number(coupon.min_order_amount) > orderAmount)
    return { ok: false, error: `Đơn tối thiểu ${Number(coupon.min_order_amount).toLocaleString("vi-VN")}₫.` };

  const { data: alreadyUsed } = await supabase
    .from("coupon_uses")
    .select("id")
    .eq("coupon_id", coupon.id)
    .eq("user_id", user.id)
    .limit(1);

  if (alreadyUsed && alreadyUsed.length > 0)
    return { ok: false, error: "Bạn đã dùng mã này rồi." };

  const discountAmount =
    coupon.discount_type === "percent"
      ? Math.round((orderAmount * Number(coupon.discount_value)) / 100)
      : Math.min(Number(coupon.discount_value), orderAmount);

  return { ok: true, coupon: coupon as Coupon, discountAmount };
}

export async function applyCoupon(
  couponId: string,
  userId: string,
  paymentId: string,
  discountAmount: number
) {
  const supabase = await createClient();
  await supabase.from("coupon_uses").insert({
    coupon_id: couponId,
    user_id: userId,
    payment_id: paymentId,
    discount_amount: discountAmount,
  });
  await supabase.rpc("increment_coupon_uses", { coupon_id: couponId });
}
