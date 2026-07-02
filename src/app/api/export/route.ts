import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "bookings";
  const from = searchParams.get("from") ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const to = searchParams.get("to") ?? new Date().toISOString().slice(0, 10);

  let csv = "";
  let filename = "";

  if (type === "bookings") {
    const { data } = await supabase
      .from("room_bookings")
      .select("id, check_in_date, check_out_date, total_price, status, created_at, rooms(name), profiles(full_name, phone)")
      .gte("created_at", from)
      .lte("created_at", to + "T23:59:59")
      .order("created_at", { ascending: false });

    csv = "ID,Khách,SĐT,Phòng,Nhận phòng,Trả phòng,Tổng tiền,Trạng thái,Ngày đặt\n";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any[] ?? []).forEach((b: any) => {
      csv += [
        b.id.slice(0, 8),
        `"${b.profiles?.full_name ?? ""}"`,
        b.profiles?.phone ?? "",
        `"${b.rooms?.name ?? ""}"`,
        b.check_in_date,
        b.check_out_date,
        b.total_price,
        b.status,
        b.created_at.slice(0, 10),
      ].join(",") + "\n";
    });
    filename = `bookings_${from}_${to}.csv`;
  } else if (type === "revenue") {
    const [{ data: rb }, { data: ord }, { data: eb }] = await Promise.all([
      supabase.from("room_bookings").select("total_price, status, created_at").gte("created_at", from).lte("created_at", to + "T23:59:59").neq("status", "cancelled"),
      supabase.from("orders").select("total_amount, status, created_at").gte("created_at", from).lte("created_at", to + "T23:59:59").neq("status", "cancelled"),
      supabase.from("event_bookings").select("total_price, status, created_at").gte("created_at", from).lte("created_at", to + "T23:59:59").neq("status", "cancelled"),
    ]);

    const byDay: Record<string, { room: number; cafe: number; event: number }> = {};
    const add = (items: { created_at: string; [k: string]: unknown }[] | null, key: "room" | "cafe" | "event", amtKey: string) => {
      (items ?? []).forEach((r) => {
        const d = r.created_at.slice(0, 10);
        if (!byDay[d]) byDay[d] = { room: 0, cafe: 0, event: 0 };
        byDay[d][key] += Number(r[amtKey] ?? 0);
      });
    };
    add(rb, "room", "total_price");
    add(ord, "cafe", "total_amount");
    add(eb, "event", "total_price");

    csv = "Ngày,Phòng (₫),Café/Bakery (₫),Sự kiện (₫),Tổng (₫)\n";
    Object.entries(byDay).sort().forEach(([d, v]) => {
      csv += `${d},${v.room},${v.cafe},${v.event},${v.room + v.cafe + v.event}\n`;
    });
    filename = `revenue_${from}_${to}.csv`;
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
