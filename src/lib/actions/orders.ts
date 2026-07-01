"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CartLine = { product_id: string; quantity: number; unit_price: number };

export async function createProductOrder(
  items: CartLine[],
  orderType: "dine_in" | "takeaway" | "room_service",
  paymentMethod: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (items.length === 0) throw new Error("Giỏ hàng đang trống.");

  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user!.id,
      total_amount: totalAmount,
      order_type: orderType,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Không thể tạo đơn hàng.");
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: i.unit_price,
    }))
  );

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  await supabase.from("payments").insert({
    user_id: user!.id,
    reference_type: "cafe_order",
    reference_id: order.id,
    amount: totalAmount,
    payment_method: paymentMethod,
    status: "pending",
  });

  redirect(`/checkout/confirmed?type=order&id=${order.id}`);
}
