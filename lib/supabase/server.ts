// File: src/lib/supabase/server.ts (Khắc phục lỗi đồng bộ cookies)

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Hàm tạo Supabase Client cho Server Component và Route Handler.
 * Luôn được gọi để đọc cookies Auth từ Request.
 */
export const createSupabaseServerClient = () => {
  const cookieStore = cookies();

  // FIX: Truyền đối tượng cookies theo cú pháp chuẩn của Auth Helpers
  return createServerComponentClient({ cookies: () => cookieStore });
};