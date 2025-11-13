// File: src/middleware.ts (Hoàn chỉnh)

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 1. Tạo Response object để có thể ghi lại cookies mới
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 2. Tạo Supabase Client trong môi trường Middleware
  // Hàm này đọc cookies từ req và ghi lại cookies đã refresh vào res
  const supabase = createMiddlewareClient({ req, res });

  // 3. THỰC HIỆN REFRESH TOKEN: Lấy session mới nhất
  // Nếu token Auth hết hạn, Supabase sẽ tự động cập nhật cookies trong `res`
  await supabase.auth.getSession();

  // 4. Trả về Response đã được cập nhật cookies
  return res;
}

export const config = {
  // Match tất cả các đường dẫn trừ các file tĩnh, API, và file hệ thống
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};