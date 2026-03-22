import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, Clock, Star, ArrowLeft, Bot, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CourseCta } from "@/components/CourseCta";

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    return (
        <div className="min-h-screen bg-background">
            {/* Back nav */}
            <div className="border-b border-border">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <Link
                        href="/#courses"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {isEn ? "Back to courses" : "Quay lại khóa học"}
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-5 gap-12">

                    {/* Left: Main content */}
                    <div className="md:col-span-3">
                        {/* Badge */}
                        <Badge
                            variant="outline"
                            className="mb-4 rounded-full text-[11px] font-bold uppercase tracking-widest px-3"
                            style={{ color: accent, borderColor: `${accent}30`, background: `${accent}10` }}
                        >
                            {badge}
                        </Badge>

                        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg font-semibold mb-4" style={{ color: accent }}>
                            {subtitle}
                        </p>

                        {/* AI badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 text-primary text-xs font-semibold px-3 py-1 mb-6">
                            <Bot className="w-3.5 h-3.5" />
                            {aiLabel}
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed text-base mb-8">
                            {desc}
                        </p>

                        {/* What you'll learn */}
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5" style={{ color: accent }} />
                                {isEn ? "What you'll learn" : "Bạn sẽ học được gì"}
                            </h2>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Sticky CTA card */}
                    <div className="md:col-span-2">
                        <div
                            className="sticky top-6 rounded-3xl border-2 bg-card p-6 shadow-xl"
                            style={{ borderColor: accent }}
                        >
                            {/* Glow top */}
                            <div
                                className="h-0.5 -mx-6 -mt-6 mb-6 rounded-t-3xl"
                                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                            />

                            {/* Price */}
                            {price ? (
                                <p className="text-3xl font-black mb-1" style={{ color: accent }}>{price}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground mb-1">
                                    {isEn ? "Contact for pricing" : "Liên hệ để biết học phí"}
                                </p>
                            )}

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground/70 mb-6">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{c.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{c.rating}
                                </span>
                                <span>{isEn ? "Lifetime access" : "Học trọn đời"}</span>
                            </div>

                            {/* CTA */}
                            <CourseCta
                                ctaHref={c.cta_href}
                                ctaType={c.cta_type}
                                accent={accent}
                                isEn={isEn}
                            />

                            <p className="text-center text-xs text-muted-foreground/50 mt-3">
                                {isEn ? "30-day money-back guarantee" : "Đảm bảo hoàn tiền 30 ngày"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
