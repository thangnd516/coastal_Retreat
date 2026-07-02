// loyalty.ts — chỉ chứa server-side logic
// Constants dùng chung xem @/lib/loyaltyConstants.ts
import { createClient } from "@/lib/supabase/server";
import { POINT_RATE, REDEEM_RATE, MAX_REDEEM_PERCENT } from "./loyaltyConstants";

export { POINT_RATE, REDEEM_RATE, MAX_REDEEM_PERCENT };

export function calcEarnedPoints(amount: number): number {
  return Math.floor(amount / POINT_RATE);
}

export function calcRedeemValue(points: number): number {
  return Math.floor((points / REDEEM_RATE) * 10_000);
}

export async function getUserLoyaltyBalance(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("loyalty_points")
    .select("points")
    .eq("user_id", userId);
  return (data ?? []).reduce((s, r) => s + r.points, 0);
}

export async function awardPoints(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string
) {
  const supabase = await createClient();
  const points = calcEarnedPoints(amount);
  if (points <= 0) return;
  await supabase.from("loyalty_points").insert({
    user_id: userId,
    points,
    reason,
    reference_id: referenceId ?? null,
  });
  await supabase.from("notifications").insert({
    user_id: userId,
    title: `Bạn vừa nhận ${points} điểm tích lũy!`,
    body: `Từ ${reason}. Tổng điểm của bạn đã được cập nhật.`,
    type: "info",
    reference_id: referenceId ?? null,
  });
}

export async function redeemPoints(
  userId: string,
  pointsToRedeem: number,
  orderAmount: number
): Promise<{ ok: boolean; discount: number; error?: string }> {
  const balance = await getUserLoyaltyBalance(userId);
  if (balance < pointsToRedeem) {
    return { ok: false, discount: 0, error: "Không đủ điểm." };
  }
  const discountValue = calcRedeemValue(pointsToRedeem);
  const maxAllowed = Math.floor(orderAmount * (MAX_REDEEM_PERCENT / 100));
  const discount = Math.min(discountValue, maxAllowed);

  const supabase = await createClient();
  await supabase.from("loyalty_points").insert({
    user_id: userId,
    points: -pointsToRedeem,
    reason: "redeem",
    reference_id: null,
  });

  return { ok: true, discount };
}
