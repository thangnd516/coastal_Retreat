"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return { error: error.message }; // Trả về object thay vì throw
  }
  
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const fullName = String(formData.get("full_name") || "");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  // Trả về lỗi để UI hiển thị thay vì làm crash app
  if (error) {
    return { error: error.message };
  }

  // Nếu đăng ký thành công mà cần xác thực email, 
  // bạn có thể trả về một thông báo thay vì redirect ngay lập tức
  return { success: "Đăng ký thành công! Vui lòng kiểm tra email của bạn." };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}