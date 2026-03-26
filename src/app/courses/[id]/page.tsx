import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
    CheckCircle2, Clock, Star, ArrowLeft, Bot, Zap,
    Youtube, Code2, Crown, Sparkles, Globe, Users,
    Shield, Infinity, GraduationCap, Headphones, BookOpen
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CourseCta } from "@/components/CourseCta";

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ICON_MAP: Record<string, React.ElementType> = {
    Youtube, Code2, Crown, Star, Sparkles, Zap, Globe, Users, Bot,
};

interface Course {
    id: string;
    title_vi: string; title_en: string;
    subtitle_vi: string; subtitle_en: string;
    desc_vi: string; desc_en: string;
    badge_vi: string; badge_en: string;
    accent_color: string;
    icon_name: string;
    price_vi: string | null; price_en: string | null;
    duration: string; rating: string;
    ai_label_vi: string; ai_label_en: string;
    cta_type: string; cta_href: string | null;
    is_featured: boolean; is_visible: boolean;
    features_vi: string[]; features_en: string[];
    sort_order: number;
}

export default async function CourseDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ lang?: string }>;
}) {
    const { id } = await params;
    const { lang } = await searchParams;
    const isEn = lang === "en";

    const { data: course, error } = await supabaseServer
        .from("courses")
        .select("*")
        .eq("id", id)
        .eq("is_visible", true)
        .single();

    if (!course || error) return notFound();

    const c: Course = course;
    const title = isEn ? c.title_en : c.title_vi;
    const subtitle = isEn ? c.subtitle_en : c.subtitle_vi;
    const desc = isEn ? c.desc_en : c.desc_vi;
    const badge = isEn ? c.badge_en : c.badge_vi;
    const price = isEn ? c.price_en : c.price_vi;
    const aiLabel = isEn ? c.ai_label_en : c.ai_label_vi;
    const features = isEn ? (c.features_en || []) : (c.features_vi || []);
    const accent = c.accent_color;
    const CourseIcon = ICON_MAP[c.icon_name] || Star;

    // Highlight chips
    const highlights = [
        { icon: Clock, label: c.duration, sub: isEn ? "Duration" : "Thời lượng" },
        { icon: Star, label: c.rating, sub: isEn ? "Rating" : "Đánh giá" },
        { icon: Infinity, label: isEn ? "Lifetime" : "Trọn đời", sub: isEn ? "Access" : "Truy cập" },
        { icon: Bot, label: "AI", sub: aiLabel },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* ===== HERO BANNER ===== */}
            <div
                className="relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${accent}08 0%, ${accent}04 50%, transparent 100%)`,
                }}
            >
                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, ${accent} 1px, transparent 0)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="relative max-w-5xl mx-auto px-6">
                    {/* Back nav */}
                    <div className="py-5">
                        <Link
                            href="/#courses"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {isEn ? "Back to courses" : "Quay lại khóa học"}
                        </Link>
                    </div>

                    {/* Hero content */}
                    <div className="pb-10 pt-4">
                        <div className="flex flex-col md:flex-row md:items-start gap-8">
                            {/* Left: Title area */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-5">
                                    {/* Large icon */}
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                                        style={{
                                            background: `linear-gradient(135deg, ${accent}22, ${accent}0a)`,
                                            border: `1.5px solid ${accent}20`,
                                        }}
                                    >
                                        <CourseIcon className="w-7 h-7" style={{ color: accent }} />
                                    </div>
                                    <div>
                                        <Badge
                                            className="rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border-0 mb-1 shadow-sm"
                                            style={{ color: accent, background: `${accent}12` }}
                                        >
                                            {badge}
                                        </Badge>
                                        <p className="text-sm font-semibold" style={{ color: accent }}>{subtitle}</p>
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 leading-tight">
                                    {title}
                                </h1>
                                <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
                                    {desc}
                                </p>
                            </div>

                            {/* Right: CTA Card (visible on md+) */}
                            <div className="hidden md:block w-[300px] flex-shrink-0">
                                <div
                                    className="sticky top-6 rounded-3xl bg-card p-6 shadow-xl border"
                                    style={{
                                        borderColor: `${accent}20`,
                                        boxShadow: `0 20px 60px -15px ${accent}18, 0 8px 24px -8px rgba(0,0,0,0.06)`,
                                    }}
                                >
                                    {/* Gradient top bar */}
                                    <div
                                        className="h-1 -mx-6 -mt-6 mb-5 rounded-t-3xl"
                                        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}66)` }}
                                    />

                                    {price ? (
                                        <div className="mb-1">
                                            <span className="text-3xl font-black" style={{ color: accent }}>{price}</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {isEn ? "Contact for pricing" : "Liên hệ để biết học phí"}
                                        </p>
                                    )}

                                    {/* Mini stats */}
                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 mb-5">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />{c.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{c.rating}
                                        </span>
                                        <span>{isEn ? "Lifetime" : "Trọn đời"}</span>
                                    </div>

                                    <CourseCta ctaHref={c.cta_href} ctaType={c.cta_type} accent={accent} isEn={isEn} />

                                    <p className="text-center text-[10px] text-muted-foreground/40 mt-3">
                                        {isEn ? "30-day money-back guarantee" : "Đảm bảo hoàn tiền 30 ngày"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== HIGHLIGHTS BAR ===== */}
            <div className="border-y border-border/50 bg-card/50">
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${accent}10` }}
                                >
                                    <h.icon
                                        className="w-4.5 h-4.5"
                                        style={{
                                            color: accent,
                                            ...(h.icon === Star ? { fill: "#fbbf24", color: "#fbbf24" } : {}),
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-foreground leading-tight">{h.label}</div>
                                    <div className="text-[10px] text-muted-foreground/50">{h.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* What you'll learn — visual cards */}
                <div className="mb-10">
                    <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${accent}12` }}
                        >
                            <Zap className="w-4 h-4" style={{ color: accent }} />
                        </div>
                        {isEn ? "What you'll learn" : "Bạn sẽ học được gì"}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-4 rounded-2xl border border-border/40 bg-card
                                    hover:border-border hover:shadow-sm transition-all duration-200"
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: `${accent}10` }}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accent }} />
                                </div>
                                <span className="text-sm text-muted-foreground leading-relaxed">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why this course — trust signals */}
                <div className="mb-10">
                    <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${accent}12` }}
                        >
                            <Shield className="w-4 h-4" style={{ color: accent }} />
                        </div>
                        {isEn ? "Why this course" : "Tại sao chọn khóa này"}
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            {
                                icon: GraduationCap,
                                title: isEn ? "Practical Skills" : "Kỹ năng thực chiến",
                                desc: isEn ? "Learn by building real projects" : "Học qua dự án thực tế",
                            },
                            {
                                icon: Headphones,
                                title: isEn ? "Dedicated Support" : "Hỗ trợ tận tâm",
                                desc: isEn ? "Get help when you need it" : "Hỗ trợ khi bạn cần",
                            },
                            {
                                icon: BookOpen,
                                title: isEn ? "Updated Content" : "Nội dung cập nhật",
                                desc: isEn ? "Always the latest tools & trends" : "Luôn cập nhật công cụ mới nhất",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="text-center p-5 rounded-2xl border border-border/40 bg-card
                                    hover:border-border hover:shadow-sm transition-all duration-200"
                            >
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                                    style={{ background: `${accent}10` }}
                                >
                                    <item.icon className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                                <p className="text-xs text-muted-foreground/60">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile CTA — sticky bottom */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 z-50">
                    <div className="flex items-center gap-4 max-w-5xl mx-auto">
                        <div className="flex-1">
                            {price ? (
                                <span className="text-xl font-black" style={{ color: accent }}>{price}</span>
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    {isEn ? "Contact for pricing" : "Liên hệ học phí"}
                                </span>
                            )}
                            <div className="text-[10px] text-muted-foreground/50">
                                {isEn ? "Lifetime access" : "Truy cập trọn đời"}
                            </div>
                        </div>
                        <div className="flex-1">
                            <CourseCta ctaHref={c.cta_href} ctaType={c.cta_type} accent={accent} isEn={isEn} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
