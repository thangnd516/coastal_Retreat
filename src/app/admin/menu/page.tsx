import { Box, Typography } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import ProductManager from "./ProductManager";

export default async function AdminMenu() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*").order("category").order("name");

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 30 }}>
        Quản lý thực đơn
      </Typography>
      <Box sx={{ mt: 3 }}>
        <ProductManager products={products ?? []} />
      </Box>
    </Box>
  );
}
