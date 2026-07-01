"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createRoomBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const roomId = String(formData.get("room_id"));
  const checkIn = String(formData.get("check_in"));
  const checkOut = String(formData.get("check_out"));
  const paymentMethod = String(formData.get("payment_method") || "vnpay");

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("price_per_night")
    .eq("id", roomId)
    .single();

  if (roomError || !room) {
    throw new Error("Không tìm thấy phòng.");
  }

  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const totalPrice = nights * Number(room.price_per_night);

  const { data: booking, error: bookingError } = await supabase
    .from("room_bookings")
    .insert({
      user_id: user!.id,
      room_id: roomId,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price: totalPrice,
      status: "pending",
    })
    .select()
    .single();

  if (bookingError || !booking) {
    throw new Error(bookingError?.message ?? "Không thể tạo đặt phòng.");
  }

  await supabase.from("payments").insert({
    user_id: user!.id,
    reference_type: "room_booking",
    reference_id: booking.id,
    amount: totalPrice,
    payment_method: paymentMethod,
    status: "pending",
  });

  redirect(`/checkout/confirmed?type=room&id=${booking.id}`);
}
