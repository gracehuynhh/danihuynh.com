"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (mode === "register") {
            const { error } = await signUp(email, password);
            if (error) {
                setError(error);
            } else {
                setSuccess("Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.");
            }
        } else {
            const { error } = await signIn(email, password);
            if (error) {
                setError(error);
            } else {
                router.push("/dashboard");
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-background">
            <div className="w-full max-w-md">
                {/* Back to home */}
                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Trang chủ
                </a>

                <Card className="border-border bg-card rounded-2xl shadow-xl">
                    <CardContent className="p-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-9 h-9 rounded-lg btn-primary flex items-center justify-center">
                                <Sparkles className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="font-bold text-lg gradient-text">DaniHuynh</span>
                        </div>

                        <h1 className="text-2xl font-black text-foreground mb-1">
                            {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
                        </h1>
                        <p className="text-sm text-muted-foreground mb-6">
                            {mode === "login"
                                ? "Đăng nhập để truy cập khóa học của bạn"
                                : "Tạo tài khoản mới để bắt đầu học"}
                        </p>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground mb-1.5">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary border-0 text-white font-semibold rounded-xl py-2.5"
                            >
                                {loading
                                    ? "Đang xử lý..."
                                    : mode === "login"
                                        ? "Đăng nhập"
                                        : "Đăng ký"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setMode(mode === "login" ? "register" : "login");
                                    setError("");
                                    setSuccess("");
                                }}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                {mode === "login"
                                    ? "Chưa có tài khoản? Đăng ký ngay"
                                    : "Đã có tài khoản? Đăng nhập"}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
