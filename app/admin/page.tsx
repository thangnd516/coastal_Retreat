"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Box, Typography, Card, CardContent, CircularProgress, Grid } from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  CheckCircle as CheckCircleIcon, 
  PeopleAlt as PeopleAltIcon 
} from '@mui/icons-material';

// Import Supabase client mà chúng ta đã cấu hình từ trước

export default function RevenueDashboard() {
  // Tạo state để lưu trữ dữ liệu lấy từ Database
  const [revenue, setRevenue] = useState<number>(0);
  const [pendingBookings, setPendingBookings] = useState<number>(0);
  const [customers, setCustomers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khởi tạo Supabase
  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        // 1. Lấy tổng doanh thu (Cộng dồn cột amount trong bảng payments)
        // Nếu sau này bạn có cột status='success', hãy thêm .eq('status', 'success') vào đây
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('amount');
        
        if (!paymentsError && paymentsData) {
          const totalRev = paymentsData.reduce((sum, payment) => sum + Number(payment.amount), 0);
          setRevenue(totalRev);
        }

        // 2. Đếm số lượng Booking Đang Chờ (từ bảng room_bookings)
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('room_bookings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
          
        if (!bookingsError) setPendingBookings(bookingsCount || 0);

        // 3. Đếm số lượng Khách Hàng (từ bảng profiles với role='customer')
        const { count: customersCount, error: customersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer');
          
        if (!customersError) setCustomers(customersCount || 0);

      } catch (error) {
        console.error("Lỗi trong quá trình fetch dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Hàm định dạng tiền tệ Việt Nam
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Revenue Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Thẻ Doanh thu */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 40, mr: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Tổng Doanh Thu (Tháng)
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {isLoading ? <CircularProgress size={30} /> : formatCurrency(revenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thẻ Đặt phòng */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#2196f3', fontSize: 40, mr: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Booking Đang Chờ
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {isLoading ? <CircularProgress size={30} /> : pendingBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thẻ Khách hàng */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleAltIcon sx={{ color: '#ff9800', fontSize: 40, mr: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Khách Hàng Mới
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {isLoading ? <CircularProgress size={30} /> : customers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 6, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1, minHeight: 300 }}>
        <Typography variant="h6" color="text.secondary">
          Khu vực biểu đồ phân tích doanh thu sẽ được tích hợp tại đây...
        </Typography>
      </Box>
    </Box>
  );
}