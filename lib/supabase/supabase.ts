// File: src/lib/supabase/supabase.ts (Định nghĩa Client Admin/Browser)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 1. Client cho Browser/Client Components (Dùng Anon Key public)
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 2. Hàm lấy Supabase Admin Client (Service Role Key).
 * Hàm này chỉ được gọi trong môi trường Server để thực hiện tác vụ BỎ QUA RLS.
 * Được chuyển thành hàm để tránh lỗi đồng bộ.
 */
export const getSupabaseAdmin = () => {
    if (!supabaseServiceKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY not set.');
        // Trả về null hoặc ném lỗi nếu Service Key là bắt buộc
        return null; 
    }
    
    // Tạo client Admin mới mỗi khi được gọi
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
};

// 🛑 EXPORT CŨ (supabaseAdmin) phải được xóa hoặc thay thế bằng hàm getSupabaseAdmin()