// "use client";

// import { useState } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { 
//   Box, 
//   Button, 
//   Card, 
//   CardContent, 
//   Typography, 
//   TextField, 
//   CircularProgress,
//   Alert
// } from '@mui/material';

// export default function BookingPage({ params }: { params: { roomId: string } }) {
//   const supabase = createClient();
  
//   // State quản lý form
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

//   const handleBooking = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       // 1. Lấy thông tin user đang đăng nhập
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (!user) {
//         throw new Error("Bạn cần đăng nhập để đặt phòng!");
//       }

//       // Giả lập logic tính giá tiền (thực tế bạn nên query giá phòng từ bảng rooms rồi nhân với số ngày)
//       const fakeTotalPrice = 1500000; 

//       // 2. Insert dữ liệu vào bảng room_bookings
//       const { error } = await supabase
//         .from('room_bookings')
//         .insert({
//           user_id: user.id,
//           room_id: params.roomId, // Lấy từ URL params
//           check_in_date: checkIn,
//           check_out_date: checkOut,
//           total_price: fakeTotalPrice,
//           status: 'pending' // Trạng thái mặc định khi mới đặt
//         });

//       if (error) throw error;

//       setMessage({ type: 'success', text: 'Đặt phòng thành công! Đang chờ xác nhận.' });
      
//     } catch (error: any) {
//       setMessage({ type: 'error', text: error.message || 'Có lỗi xảy ra khi đặt phòng.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
//       <Card sx={{ maxWidth: 500, width: '100%' }}>
//         <CardContent>
//           <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
//             Đặt Phòng Của Bạn
//           </Typography>
          
//           <Box component="form" onSubmit={handleBooking} sx={{ mt: 2 }}>
//             <TextField
//               label="Ngày nhận phòng (Check-in)"
//               type="date"
//               fullWidth
//               required
//               margin="normal"
//               InputLabelProps={{ shrink: true }}
//               value={checkIn}
//               onChange={(e) => setCheckIn(e.target.value)}
//             />
            
//             <TextField
//               label="Ngày trả phòng (Check-out)"
//               type="date"
//               fullWidth
//               required
//               margin="normal"
//               InputLabelProps={{ shrink: true }}
//               value={checkOut}
//               onChange={(e) => setCheckOut(e.target.value)}
//             />

//             {message && (
//               <Alert severity={message.type} sx={{ mt: 2 }}>
//                 {message.text}
//               </Alert>
//             )}

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               size="large"
//               disabled={loading}
//               sx={{ mt: 3 }}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : 'Xác nhận Đặt Phòng'}
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }