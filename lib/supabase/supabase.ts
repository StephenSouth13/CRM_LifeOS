// File: src/lib/supabase/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Đảm bảo bạn đã đặt các biến môi trường này trong file .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 1. Client cho Browser/Client Components (Dùng Anon Key public)
// Client này tuân thủ RLS (Dùng cho giao diện người dùng)
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);

// 2. Admin client: tạo CHỈ trên server (tránh bundle key vào client)
// Nếu chạy trong trình duyệt, export null to avoid requiring service key.
export const supabaseAdmin = (typeof window === 'undefined')
  ? (() => {
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!supabaseKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required on the server')
      }
      return createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    })()
  : (null as any)
