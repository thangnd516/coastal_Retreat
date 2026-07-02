import { Box, Typography, Switch, FormControlLabel } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/format";
import { toggleProductAvailability } from "@/app/admin/menu/actions";

export default async function StaffMenuPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("category")
    .order("name");

  const cafeProd = (products ?? []).filter((p) => p.category === "cafe");
  const bakeryProd = (products ?? []).filter((p) => p.category === "bakery");

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: typeof products extends null ? never[] : NonNullable<typeof products>;
  }) => (
    <Box sx={{ mb: 5 }}>
      <Typography
        variant="overline"
        color="primary.main"
        sx={{ display: "block", mb: 1.5 }}
      >
        {title}
      </Typography>
      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {items.map((p) => (
          <Box
            key={p.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-of-type": { borderBottom: "none" },
              opacity: p.is_available ? 1 : 0.5,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 14 }}>{p.name}</Typography>
              {p.description && (
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  {p.description}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-plexmono), monospace",
                  fontSize: 13,
                  color: "text.secondary",
                }}
              >
                {formatVND(p.price)}
              </Typography>
              <FormControlLabel
                sx={{ mr: 0 }}
                control={
                  <Switch
                    size="small"
                    defaultChecked={p.is_available}
                    onChange={async (e) => {
                      "use client";
                      await toggleProductAvailability(p.id, e.target.checked);
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 12, color: "text.secondary", minWidth: 64 }}>
                    {p.is_available ? "Đang bán" : "Hết hàng"}
                  </Typography>
                }
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 28, mb: 3 }}>
        Thực đơn ca làm
      </Typography>
      <Section title="CAFÉ" items={cafeProd} />
      <Section title="BAKERY" items={bakeryProd} />
    </Box>
  );
}
