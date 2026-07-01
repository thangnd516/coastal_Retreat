"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBlog(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title"));
  const isPublished = formData.get("is_published") === "on";

  const { error } = await supabase.from("blogs").insert({
    author_id: user.id,
    title,
    slug: slugify(title) + "-" + Date.now().toString(36).slice(-4),
    content: String(formData.get("content")),
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updateBlog(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const isPublished = formData.get("is_published") === "on";

  const { data: existing } = await supabase.from("blogs").select("published_at").eq("id", id).single();

  const { error } = await supabase
    .from("blogs")
    .update({
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      is_published: isPublished,
      published_at: isPublished ? existing?.published_at ?? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlog(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
