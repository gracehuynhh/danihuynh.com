"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { DaniLogo } from "@/components/DaniLogo";

interface AuthDialogProps {
    children: React.ReactNode;
}

export default function AuthDialog({ children }: AuthDialogProps) {
    const router = useRouter();
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setEmail("");
        setPassword("");
        setError("");
        setSuccess("");
        setShowPassword(false);
        setMode("login");
    };

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
                setOpen(false);
                reset();
                router.push("/dashboard");
            }
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-9 h-9 rounded-lg btn-primary flex items-center justify-center">
                            <Sparkles className="w-4.5 h-4.5 text-white" />
                        </div>
                        <DaniLogo height={20} className="ml-1" />
                    </div>

                    <DialogTitle className="text-2xl font-black mb-1">
                        {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
                    </DialogTitle>
                    <DialogDescription className="mb-6">
                        {mode === "login"
                            ? "Đăng nhập để truy cập khóa học của bạn"
                            : "Tạo tài khoản mới để bắt đầu học"}
                    </DialogDescription>

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

                    <div className="relative mt-5 mb-5">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-card px-2 text-muted-foreground font-semibold">Hoặc</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                            setLoading(true);
                            await signInWithGoogle();
                            // If it errors, we won't see it immediately because it redirects,
                            // but if it errors before redirect, we can catch it? Usually it handles smoothly.
                            setLoading(false);
                        }}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-background hover:bg-muted/50 border border-border text-foreground rounded-xl py-2.5 font-semibold transition-all h-10"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Đăng nhập bằng Google
                    </Button>

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
                </div>
            </DialogContent>
        </Dialog>
    );
}
