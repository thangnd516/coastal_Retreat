"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createEventBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const eventId = String(formData.get("event_id"));
  const quantity = Number(formData.get("quantity") || 1);
  const paymentMethod = String(formData.get("payment_method") || "vnpay");

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("price_per_ticket, max_attendees, current_attendees")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    throw new Error("Không tìm thấy sự kiện.");
  }

  const remaining = event.max_attendees - event.current_attendees;
  if (quantity > remaining) {
    throw new Error(`Chỉ còn ${remaining} chỗ trống.`);
  }

  const totalPrice = quantity * Number(event.price_per_ticket);

  const { data: booking, error: bookingError } = await supabase
    .from("event_bookings")
    .insert({
      user_id: user!.id,
      event_id: eventId,
      ticket_quantity: quantity,
      total_price: totalPrice,
      status: "confirmed",
    })
    .select()
    .single();

  if (bookingError || !booking) {
    throw new Error(bookingError?.message ?? "Không thể đặt vé.");
  }

  await supabase
    .from("events")
    .update({ current_attendees: event.current_attendees + quantity })
    .eq("id", eventId);

  await supabase.from("payments").insert({
    user_id: user!.id,
    reference_type: "event_booking",
    reference_id: booking.id,
    amount: totalPrice,
    payment_method: paymentMethod,
    status: "pending",
  });

  redirect(`/checkout/confirmed?type=event&id=${booking.id}`);
}
