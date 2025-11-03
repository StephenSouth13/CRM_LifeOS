// File: src/lib/supabase/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Đảm bảo bạn đã đặt các biến môi trường này trong file .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Dùng cho Admin/Serverless

// 1. Client cho Serverless API (Dùng Khóa Service Role Key an toàn)
// Client này có quyền Admin và bỏ qua RLS (chỉ dùng trong Route Handlers/Serverless)
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// 2. Client cho Browser/Client Components (Dùng Anon Key public)
// Client này tuân thủ RLS (Dùng cho giao diện người dùng)
export const supabaseBrowser = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);