"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Drawer,
  Stack,
  Divider,
  MenuItem,
  TextField,
  Badge,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import SmartImage from "@/components/SmartImage";
import { formatVND } from "@/lib/format";
import { createProductOrder } from "@/lib/actions/orders";
import type { Product } from "@/types/database";

export default function MenuOrderClient({
  products,
  isLoggedIn,
}: {
  products: Product[];
  isLoggedIn: boolean;
}) {
  const router = useRouter(); // 2. Khởi tạo router
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway" | "room_service">("dine_in");
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }, [products, search]);

  const cartLines = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: productMap[id], qty }))
    .filter((l) => l.product);

  const totalQty = cartLines.reduce((s, l) => s + l.qty, 0);
  const totalAmount = cartLines.reduce(
    (s, l) => s + l.qty * Number(l.product.price),
    0
  );

  const addToCart = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const removeFromCart = (id: string) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }));

  const handleCheckout = async () => {
    setError(null);
    if (!isLoggedIn) {
      router.push("/login"); // 3. Sử dụng router.push thay cho window.location
      return;
    }
    
    setSubmitting(true);
    try {
      await createProductOrder(
        cartLines.map((l) => ({
          product_id: l.product.id,
          quantity: l.qty,
          unit_price: Number(l.product.price),
        })),
        orderType,
        paymentMethod
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      // 4. Khối finally đảm bảo nút luôn được mở khóa
      setSubmitting(false);
    }
  };

  return (
    <>
      <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 10 }}>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" }, width: 56, height: 56 }}
        >
          <Badge badgeContent={totalQty} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      <TextField
        size="small"
        placeholder="Tìm món..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 320 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Grid container spacing={2.5}>
        {filteredProducts.map((item) => (
          <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
            <Card variant="outlined" sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
              <SmartImage src={item.image_url} label="món" height={80} sx={{ width: 80, flexShrink: 0, borderRadius: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography variant="h6" sx={{ fontSize: 17 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--font-plexmono), monospace", fontSize: 13, color: "primary.dark" }}>
                    {formatVND(item.price)}
                  </Typography>
                </Box>
                {item.description && (
                  <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                    {item.description}
                  </Typography>
                )}
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  {item.is_available ? (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon fontSize="small" />}
                      onClick={() => addToCart(item.id)}
                    >
                      Thêm
                    </Button>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: "error.main" }}>
                      Hết hàng
                    </Typography>
                  )}
                  {cart[item.id] > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <IconButton size="small" onClick={() => removeFromCart(item.id)}>
                        <RemoveIcon fontSize="inherit" />
                      </IconButton>
                      <Typography sx={{ fontSize: 13, minWidth: 16, textAlign: "center" }}>
                        {cart[item.id]}
                      </Typography>
                      <IconButton size="small" onClick={() => addToCart(item.id)}>
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {/* Nội dung Drawer giữ nguyên */}
        <Box sx={{ width: 360, p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
            {/* ... code cũ của bạn trong Drawer ... */}
            <Typography variant="h5" sx={{ fontSize: 22 }}>Giỏ hàng</Typography>
            <Divider sx={{ my: 2 }} />
            {/* ... */}
            <Button
                variant="contained"
                disabled={cartLines.length === 0 || submitting}
                onClick={handleCheckout}
            >
                {isLoggedIn ? "Đặt hàng & thanh toán" : "Đăng nhập để đặt hàng"}
            </Button>
        </Box>
      </Drawer>
    </>
  );
}