import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// 1. Client dành cho User thông thường (Có quản lý Cookie & Session)
export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Next.js không cho phép set cookie bên trong Server Component.
            // Lỗi này có thể bỏ qua an toàn nếu bạn đã có Middleware xử lý session.
          }
        },
      },
    },
  );
}

// 2. Client dành cho Admin (Có toàn quyền bypass Row Level Security - RLS)
export async function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Bắt buộc phải có trong .env.local
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}