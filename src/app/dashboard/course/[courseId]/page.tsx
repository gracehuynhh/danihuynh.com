"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sparkles, LogOut, ArrowLeft, Play, CheckCircle2,
    Clock, Youtube, Crown, Code2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Video {
    id: string;
    lesson_number: number;
    title_vi: string;
    title_en: string | null;
    video_url: string;
    duration: string | null;
    is_preview: boolean;
}

const courseMetadata: Record<string, { title: string; subtitle: string; icon: typeof Youtube; accent: string }> = {
    "youtube-basic": { title: "YouTube × AI", subtitle: "Khóa cơ bản", icon: Youtube, accent: "#ef4444" },
    "youtube-advanced": { title: "YouTube × AI", subtitle: "1 kèm 1 Nâng cao", icon: Crown, accent: "#8b5cf6" },
    vibecoding: { title: "Vibecoding", subtitle: "Làm web bằng AI", icon: Code2, accent: "#2563eb" },
};

export default function CourseViewerPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;
    const { user, loading, signOut } = useAuth();

    const [videos, setVideos] = useState<Video[]>([]);
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(true);

    const meta = courseMetadata[courseId] || courseMetadata["youtube-basic"];
    const Icon = meta.icon;

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && courseId) {
            checkAccess();
            loadVideos();
        }
    }, [user, courseId]);

    const checkAccess = async () => {
        if (!user) return;
        const { data } = await supabase
            .from("user_courses")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();

        setHasAccess(!!data);
        setCheckingAccess(false);
    };

    const loadVideos = async () => {
        const { data } = await supabase
            .from("course_videos")
            .select("*")
            .eq("course_id", courseId)
            .order("lesson_number", { ascending: true });

        if (data && data.length > 0) {
            setVideos(data);
            setActiveVideo(data[0]);
        }
    };

    if (loading || checkingAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-6">
                <Card className="max-w-md w-full border-border bg-card rounded-2xl">
                    <CardContent className="p-8 text-center">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: `${meta.accent}15`, border: `1px solid ${meta.accent}22` }}
                        >
                            <Icon className="w-7 h-7" style={{ color: meta.accent }} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">Chưa kích hoạt</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Bạn cần nhập mã kích hoạt để truy cập khóa học <strong>{meta.title}</strong>.
                        </p>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            className="btn-primary border-0 text-white font-semibold rounded-xl px-6"
                        >
                            Nhập mã kích hoạt
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </a>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: `${meta.accent}15`, border: `1px solid ${meta.accent}22` }}
                            >
                                <Icon className="w-3.5 h-3.5" style={{ color: meta.accent }} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground leading-tight">{meta.title}</p>
                                <p className="text-[10px]" style={{ color: meta.accent }}>{meta.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                            await signOut();
                            router.push("/");
                        }}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                    {/* Video Player */}
                    <div>
                        {activeVideo ? (
                            <>
                                <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-4">
                                    <iframe
                                        src={activeVideo.video_url}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        title={activeVideo.title_vi}
                                    />
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <Badge
                                            variant="outline"
                                            className="mb-2 text-[10px] font-semibold"
                                            style={{
                                                color: meta.accent,
                                                borderColor: `${meta.accent}25`,
                                                background: `${meta.accent}10`,
                                            }}
                                        >
                                            Bài {activeVideo.lesson_number}
                                        </Badge>
                                        <h2 className="text-xl font-bold text-foreground">
                                            {activeVideo.title_vi}
                                        </h2>
                                    </div>
                                    {activeVideo.duration && (
                                        <div className="flex items-center gap-1 text-muted-foreground text-xs shrink-0 mt-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {activeVideo.duration}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
                                <p className="text-muted-foreground text-sm">Chưa có video nào</p>
                            </div>
                        )}
                    </div>

                    {/* Video List */}
                    <div>
                        <h3 className="text-sm font-bold text-foreground mb-3">
                            Nội dung khóa học ({videos.length} bài)
                        </h3>
                        <div className="space-y-1.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                            {videos.map((video) => (
                                <button
                                    key={video.id}
                                    onClick={() => setActiveVideo(video)}
                                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${activeVideo?.id === video.id
                                        ? "bg-primary/8 border border-primary/20"
                                        : "hover:bg-muted border border-transparent"
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${activeVideo?.id === video.id
                                            ? "bg-primary text-white"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {activeVideo?.id === video.id ? (
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                        ) : (
                                            <span className="text-xs font-bold">{String(video.lesson_number).padStart(2, "0")}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${activeVideo?.id === video.id ? "text-primary" : "text-foreground"
                                            }`}>
                                            {video.title_vi}
                                        </p>
                                        {video.duration && (
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {video.duration}
                                            </p>
                                        )}
                                    </div>
                                    {activeVideo?.id === video.id && (
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
