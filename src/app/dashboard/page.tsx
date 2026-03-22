"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sparkles, LogOut, KeyRound, Play, Crown, Code2, Youtube,
    ArrowLeft, CheckCircle2, Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserCourse {
    course_id: string;
    activated_at: string;
}

const courseInfo: Record<string, { title: string; subtitle: string; icon: typeof Youtube; accent: string; badge: string }> = {
    "youtube-basic": {
        title: "YouTube × AI",
        subtitle: "Khóa cơ bản",
        icon: Youtube,
        accent: "#ef4444",
        badge: "999K VNĐ",
    },
    "youtube-advanced": {
        title: "YouTube × AI",
        subtitle: "1 kèm 1 Nâng cao",
        icon: Crown,
        accent: "#8b5cf6",
        badge: "PREMIUM",
    },
    vibecoding: {
        title: "Vibecoding",
        subtitle: "Làm web bằng AI",
        icon: Code2,
        accent: "#2563eb",
        badge: "PHỔ BIẾN NHẤT",
    },
};

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [activatedCourses, setActivatedCourses] = useState<UserCourse[]>([]);
    const [code, setCode] = useState("");
    const [activating, setActivating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            loadUserCourses();
        }
    }, [user]);

    const loadUserCourses = async () => {
        if (!user) return;
        const { data } = await supabase
            .from("user_courses")
            .select("course_id, activated_at")
            .eq("user_id", user.id);
        setActivatedCourses(data || []);
        setLoadingCourses(false);
    };

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !code.trim()) return;

        setActivating(true);
        setError("");
        setSuccess("");

        // 1. Find the activation code
        const { data: codeData, error: codeError } = await supabase
            .from("activation_codes")
            .select("*")
            .eq("code", code.trim().toUpperCase())
            .eq("is_active", true)
            .single();

        if (codeError || !codeData) {
            setError("Mã kích hoạt không hợp lệ hoặc đã hết hạn.");
            setActivating(false);
            return;
        }

        // 2. Check if max uses reached
        if (codeData.used_count >= codeData.max_uses) {
            setError("Mã kích hoạt đã được sử dụng hết.");
            setActivating(false);
            return;
        }

        // 3. Check if already activated this course
        const alreadyActivated = activatedCourses.some(c => c.course_id === codeData.course_id);
        if (alreadyActivated) {
            setError("Bạn đã kích hoạt khóa học này rồi.");
            setActivating(false);
            return;
        }

        // 4. Create user_course entry
        const { error: insertError } = await supabase
            .from("user_courses")
            .insert({
                user_id: user.id,
                course_id: codeData.course_id,
                activation_code_id: codeData.id,
            });

        if (insertError) {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
            setActivating(false);
            return;
        }

        // 5. Increment used_count
        await supabase
            .from("activation_codes")
            .update({ used_count: codeData.used_count + 1 })
            .eq("id", codeData.id);

        setSuccess("Kích hoạt thành công! 🎉");
        setCode("");
        loadUserCourses();
        setActivating(false);
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-[15px] gradient-text">DaniHuynh</span>
                    </a>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground hidden sm:block">
                            {user.email}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                                await signOut();
                                router.push("/");
                            }}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <LogOut className="w-4 h-4 mr-1.5" />
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* Back link */}
                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Trang chủ
                </a>

                <h1 className="text-3xl font-black text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Quản lý khóa học và kích hoạt mã truy cập
                </p>

                {/* Activation Code */}
                <Card className="border-border bg-card rounded-2xl mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <KeyRound className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-foreground">Nhập mã kích hoạt</h2>
                        </div>

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

                        <form onSubmit={handleActivate} className="flex gap-3">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="VD: YOUTUBE-BASIC-2026"
                                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-mono tracking-wider"
                            />
                            <Button
                                type="submit"
                                disabled={activating || !code.trim()}
                                className="btn-primary border-0 text-white font-semibold rounded-xl px-6"
                            >
                                {activating ? "Đang xử lý..." : "Kích hoạt"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* My Courses */}
                <h2 className="text-xl font-bold text-foreground mb-4">Khóa học của tôi</h2>

                {loadingCourses ? (
                    <div className="flex justify-center py-12">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                        {Object.entries(courseInfo).map(([courseId, info]) => {
                            const Icon = info.icon;
                            const activated = activatedCourses.some(c => c.course_id === courseId);

                            return (
                                <Card
                                    key={courseId}
                                    className={`border-border bg-card rounded-2xl transition-all ${activated
                                        ? "hover:shadow-lg cursor-pointer hover:border-primary/20"
                                        : "opacity-60"
                                        }`}
                                    onClick={() => activated && router.push(`/dashboard/course/${courseId}`)}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                style={{ background: `${info.accent}15`, border: `1px solid ${info.accent}22` }}
                                            >
                                                <Icon className="w-5 h-5" style={{ color: info.accent }} />
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-[9px] font-semibold rounded-full"
                                                style={{
                                                    color: info.accent,
                                                    borderColor: `${info.accent}25`,
                                                    background: `${info.accent}10`,
                                                }}
                                            >
                                                {info.badge}
                                            </Badge>
                                        </div>

                                        <h3 className="text-lg font-bold text-foreground">{info.title}</h3>
                                        <p className="text-xs text-muted-foreground mb-4" style={{ color: info.accent }}>
                                            {info.subtitle}
                                        </p>

                                        {activated ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                <span className="text-xs font-semibold text-green-600">Đã kích hoạt</span>
                                                <Play className="w-4 h-4 text-primary ml-auto" />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Lock className="w-4 h-4" />
                                                <span className="text-xs">Chưa kích hoạt</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
