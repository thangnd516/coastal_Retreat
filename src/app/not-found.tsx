import Link from "next/link";
import { Box, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 16, px: 3, textAlign: "center" }}>
      <Typography sx={{ fontFamily: "var(--font-cormorant), serif", fontSize: { xs: 80, md: 120 }, lineHeight: 1, color: "#E8E0D3", fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h3" sx={{ mt: 1, fontSize: 26 }}>Không tìm thấy trang</Typography>
      <Typography sx={{ mt: 1.5, maxWidth: 380, color: "text.secondary", fontSize: 15 }}>
        Trang bạn tìm có thể đã được di chuyển hoặc không còn tồn tại.
      </Typography>
      
      <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Link 
          href="/" 
          style={{ display:"inline-block", padding:"10px 24px", backgroundColor:"#B07A5B", color:"#FCFAF6", textDecoration:"none", borderRadius:3, fontSize:14 }}
        >
          Về trang chủ
        </Link>
        <Link 
          href="/homestay" 
          style={{ display:"inline-block", padding:"10px 24px", border:"1px solid #B07A5B", color:"#8A5E44", textDecoration:"none", borderRadius:3, fontSize:14 }}
        >
          Xem phòng nghỉ
        </Link>
      </Box>
    </Box>
  );
}