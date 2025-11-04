// File: app/auth/update-password/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/supabase"; // Đảm bảo import client đúng
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Giả định bạn có toast hook

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); // Trạng thái sẵn sàng để hiển thị form

  useEffect(() => {
    // 1. Lắng nghe trạng thái Auth để bắt phiên PASSWORD_RECOVERY
    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        // Supabase đặt phiên tạm thời và chuyển Event thành 'SIGNED_IN'
        // Chúng ta chỉ cần đảm bảo có session tồn tại
        if (session) {
          setIsReady(true);
        } else {
          // Nếu không có session, có thể chuyển hướng về trang login sau 1 giây
          setTimeout(() => {
            if (!isReady) router.push("/auth/login");
          }, 1000);
        }
      },
    );

    // Dọn dẹp listener khi component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp!",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    // 2. Gọi API để cập nhật mật khẩu
    const { error } = await supabaseBrowser.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Lỗi Đổi Mật khẩu",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được cập nhật. Bạn có thể đăng nhập ngay.",
      });
      // Chuyển hướng về trang đăng nhập sau khi đổi xong
      router.push("/auth/login");
    }
  };

  // 3. Giao diện hiển thị
  if (!isReady) {
    return <div className="text-center mt-20">Đang tải... Vui lòng chờ xác thực phiên.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-xl bg-card">
        <h2 className="text-2xl font-bold text-center">Đặt Lại Mật Khẩu</h2>
        <p className="text-center text-muted-foreground">Nhập mật khẩu mới cho tài khoản của bạn.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="newPassword">Mật khẩu Mới</label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Xác nhận Mật khẩu</label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang xử lý..." : "Cập nhật Mật khẩu"}
        </Button>
      </form>
    </div>
  );
}