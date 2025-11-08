// File: app/auth/update-password/page.tsx

"use client";
import { Label } from "@/components/ui/label";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/supabase"; // Đảm bảo import client đúng
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); // Trạng thái sẵn sàng hiển thị form

  useEffect(() => {
    // 1. Lắng nghe trạng thái Auth để bắt phiên PASSWORD_RECOVERY
    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        // Event SIGNED_IN được kích hoạt khi Supabase Auth xử lý token trong URL
        if (session) {
          setIsReady(true);
        } else if (event === 'SIGNED_OUT') {
           // Nếu bị sign out đột ngột (hoặc phiên hết hạn), chuyển hướng
           router.push("/auth/login");
        }
      },
    );

    // 2. Bắt session ban đầu (FIX LOGIC):
    // Đảm bảo form hiển thị ngay nếu token đã có trong URL
    const checkSession = async () => {
        const { data: { session } } = await supabaseBrowser.auth.getSession();
        if (session) {
            setIsReady(true);
        } else {
            // Chuyển hướng sau một khoảng thời gian ngắn nếu session không được tìm thấy
            setTimeout(() => {
                 if (!isReady) router.push("/auth/login");
             }, 100);
        }
    };
    checkSession();

    // Dọn dẹp listener khi component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]); // Bỏ isReady khỏi dependency array để tránh loop

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

    if (newPassword.length < 6) {
        toast({ title: "Lỗi", description: "Mật khẩu phải từ 6 ký tự trở lên.", variant: "destructive" });
        return;
    }

    setLoading(true);

    // 3. Gọi API để cập nhật mật khẩu
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
        description: "Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.",
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
            <Label htmlFor="newPassword">Mật khẩu Mới</Label>
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
            <Label htmlFor="confirmPassword">Xác nhận Mật khẩu</Label>
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