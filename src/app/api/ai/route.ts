import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

async function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
    "anthropic-version": "2023-06-01",
  };
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { type, payload } = body as {
    type: "revenue_analysis" | "review_sentiment" | "room_description" | "blog_writer" | "chat";
    payload: Record<string, unknown>;
  };

  let systemPrompt = "";
  let userMessage = "";

  switch (type) {
    case "revenue_analysis":
      systemPrompt = `Bạn là chuyên gia phân tích kinh doanh cho một homestay cao cấp tên "Coastal Retreat" tại Mỹ Khê, Đà Nẵng. 
Phân tích dữ liệu doanh thu được cung cấp và đưa ra:
1. Nhận xét tổng quan (2-3 câu)
2. Xu hướng nổi bật (bullet points)
3. Điểm cần cải thiện
4. 3 khuyến nghị cụ thể, có thể thực hiện ngay
Trả lời bằng tiếng Việt, ngắn gọn, thực dụng. Dùng markdown.`;
      userMessage = `Dữ liệu doanh thu:\n${JSON.stringify(payload.data, null, 2)}\n\nTổng quan: ${JSON.stringify(payload.summary)}`;
      break;

    case "review_sentiment":
      systemPrompt = `Bạn là chuyên gia phân tích đánh giá khách hàng cho homestay. 
Phân tích các đánh giá được cung cấp và trả về JSON với format:
{
  "overall_score": <1-10>,
  "sentiment": "positive|neutral|negative",
  "strengths": ["điểm mạnh 1", ...],
  "weaknesses": ["điểm yếu 1", ...],
  "keywords": ["từ khóa phổ biến", ...],
  "recommendation": "khuyến nghị ngắn gọn"
}
Chỉ trả về JSON, không thêm gì khác.`;
      userMessage = `Phân tích ${(payload.reviews as unknown[]).length} đánh giá sau:\n${JSON.stringify(payload.reviews, null, 2)}`;
      break;

    case "room_description":
      systemPrompt = `Bạn là copywriter chuyên nghiệp cho homestay sang trọng. 
Viết mô tả phòng hấp dẫn bằng tiếng Việt (~100 từ), tone ấm áp, tinh tế, gợi cảm giác thư giãn.
Nêu bật: không gian, view, tiện nghi nổi bật, trải nghiệm cảm xúc.
Không dùng các cụm sáo rỗng như "sang trọng tuyệt vời" hay "đẳng cấp 5 sao".`;
      userMessage = `Viết mô tả cho phòng: ${payload.roomName}
Loại phòng: ${payload.type}
Sức chứa: ${payload.capacity} khách
Giá: ${payload.price}₫/đêm
Chi tiết thêm: ${payload.notes ?? "không có"}`;
      break;

    case "blog_writer":
      systemPrompt = `Bạn là travel writer cho blog của homestay Coastal Retreat tại Đà Nẵng.
Viết bài blog bằng tiếng Việt, dài 300-400 từ, giọng điệu nhẹ nhàng, gần gũi, truyền cảm hứng.
Cấu trúc: mở đầu gợi cảm + thân bài có 2-3 đoạn + kết thúc kêu gọi hành động nhẹ nhàng.
Dùng markdown (##, **, *) cho formatting.`;
      userMessage = `Chủ đề: ${payload.topic}
Từ khóa cần đề cập: ${payload.keywords}
Đối tượng độc giả: ${payload.audience ?? "khách du lịch yêu thiên nhiên và sống chậm"}`;
      break;

    case "chat":
      systemPrompt = `Bạn là trợ lý AI thân thiện của Coastal Retreat homestay tại Mỹ Khê, Đà Nẵng.
Thông tin bạn biết:
- Có 4 hạng phòng: Ocean View Studio, Garden Loft, Coastal Suite, Bamboo Bungalow
- Dịch vụ: homestay, café đặc sản, bakery thủ công, events
- Địa chỉ: Mỹ Khê, Đà Nẵng · Email: hello@coastalretreat.vn
- Check-in: 14:00, Check-out: 12:00
- Chính sách huỷ: hoàn tiền 100% nếu huỷ trước 72 giờ
Trả lời ngắn gọn, thân thiện, bằng tiếng Việt. Nếu không biết, đề nghị khách liên hệ trực tiếp.`;
      userMessage = String(payload.message ?? "");
      break;

    default:
      return new NextResponse("Unknown type", { status: 400 });
  }

  const aiRes = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      stream: type === "chat",
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (type === "chat") {
    // Stream response
    return new NextResponse(aiRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  }

  const data = await aiRes.json();
  const text = data.content?.[0]?.text ?? "";
  return NextResponse.json({ result: text });
}
