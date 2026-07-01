"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("products").insert({
    name: String(formData.get("name")),
    category: String(formData.get("category")),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price")),
    is_available: formData.get("is_available") === "on",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/cafe");
  revalidatePath("/bakery");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id"));

  const { error } = await supabase
    .from("products")
    .update({
      name: String(formData.get("name")),
      category: String(formData.get("category")),
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price")),
      is_available: formData.get("is_available") === "on",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/cafe");
  revalidatePath("/bakery");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/cafe");
  revalidatePath("/bakery");
}

export async function toggleProductAvailability(id: string, value: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_available: value }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
  revalidatePath("/cafe");
  revalidatePath("/bakery");
}
