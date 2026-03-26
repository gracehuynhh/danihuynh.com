"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Code2, Youtube, Bot, Clock, Star,
    Crown, Sparkles, Zap, Globe, Users,
    Pencil, ArrowRight, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LangContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase";

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

export default function Courses() {
    const { lang, t } = useLang();
    const { isAdmin } = useAdmin();
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .eq("is_visible", true)
                .order("sort_order");
            if (error) console.error("[Courses] fetch error:", error.message);
            setCourses(data || []);
        } catch {
            // Supabase unreachable
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    if (loading) {
        return (
            <section className="py-8 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-3xl bg-card animate-pulse h-[340px]" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="courses" className="py-8 px-6">
            <div className="section-divider mb-6" />
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <Badge
                        variant="outline"
                        className="mb-4 rounded-full border-primary/25 bg-primary/8 text-primary text-[11px] font-semibold uppercase tracking-widest px-3"
                    >
                        {t("Courses", "Khóa học")}
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-black mb-1">
                        <span className="hero-heading">{t("Learn. Build. ", "Học. Xây. ")}</span>
                        <span className="gradient-text">{t("Earn", "Kiếm Tiền")}</span>
                    </h2>
                    {isAdmin && (
                        <a
                            href="/admin?tab=courses"
                            className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-amber-600 hover:text-amber-700 font-semibold"
                        >
                            <Pencil className="w-3 h-3" /> Chỉnh sửa khóa học
                        </a>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((c, index) => {
                        const Icon = ICON_MAP[c.icon_name] || Star;
                        const title = lang === "en" ? c.title_en : c.title_vi;
                        const subtitle = lang === "en" ? c.subtitle_en : c.subtitle_vi;
                        const badge = lang === "en" ? c.badge_en : c.badge_vi;
                        const price = lang === "en" ? c.price_en : c.price_vi;
                        const accent = c.accent_color;
                        const features = lang === "en" ? (c.features_en || []) : (c.features_vi || []);

                        return (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.45, delay: index * 0.1 }}
                                className="group"
                            >
                                <div
                                    onClick={() => router.push(`/courses/${c.id}?lang=${lang}`)}
                                    className={`relative rounded-3xl cursor-pointer h-full flex flex-col overflow-hidden
                                        transition-all duration-500 ease-out
                                        hover:-translate-y-2
                                        ${c.is_featured
                                            ? "ring-2 ring-offset-2 ring-offset-background"
                                            : "border border-border/40"
                                        }`}
                                    style={{
                                        ...(c.is_featured ? { ["--tw-ring-color" as string]: accent } : {}),
                                        boxShadow: c.is_featured
                                            ? `0 20px 60px -15px ${accent}30, 0 8px 20px -8px ${accent}15`
                                            : "0 4px 24px -4px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                                    }}
                                >
                                    {/* ===== Gradient Header Area ===== */}
                                    <div
                                        className="relative px-6 pt-6 pb-5"
                                        style={{
                                            background: `linear-gradient(135deg, ${accent}08 0%, ${accent}03 100%)`,
                                        }}
                                    >
                                        {/* Subtle pattern overlay */}
                                        <div
                                            className="absolute inset-0 opacity-[0.03]"
                                            style={{
                                                backgroundImage: `radial-gradient(circle at 1px 1px, ${accent} 1px, transparent 0)`,
                                                backgroundSize: "20px 20px",
                                            }}
                                        />

                                        <div className="relative flex items-start justify-between mb-4">
                                            {/* Icon with gradient background */}
                                            <motion.div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                                                style={{
                                                    background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
                                                    border: `1px solid ${accent}15`,
                                                }}
                                                whileHover={{ scale: 1.1, rotate: 6 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            >
                                                <Icon className="w-5.5 h-5.5" style={{ color: accent }} />
                                            </motion.div>
                                            <Badge
                                                className="text-[9px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border-0 shadow-sm"
                                                style={{
                                                    color: accent,
                                                    background: `linear-gradient(135deg, ${accent}12, ${accent}06)`,
                                                }}
                                            >
                                                {badge}
                                            </Badge>
                                        </div>

                                        <h3 className="relative text-lg font-extrabold text-card-foreground leading-tight">
                                            {title}
                                        </h3>
                                        <p className="relative text-xs font-semibold mt-0.5" style={{ color: accent }}>
                                            {subtitle}
                                        </p>
                                    </div>

                                    {/* ===== Card Body ===== */}
                                    <div className="flex flex-col flex-1 px-6 pb-6 pt-4 bg-card">

                                        {/* Key highlights — max 3 */}
                                        <ul className="space-y-2 mb-5 flex-1">
                                            {features.slice(0, 3).map((f, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2 text-[12px] text-muted-foreground leading-snug"
                                                >
                                                    <CheckCircle2
                                                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                                                        style={{ color: accent }}
                                                    />
                                                    <span className="line-clamp-1">{f}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Meta row */}
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50 mb-5">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />{c.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{c.rating}
                                            </span>
                                            <span className="flex items-center gap-1 ml-auto">
                                                <Bot className="w-3 h-3 text-primary/60" />AI
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div
                                            className="h-px mb-5"
                                            style={{
                                                background: `linear-gradient(90deg, transparent, ${accent}18, transparent)`,
                                            }}
                                        />

                                        {/* Price + CTA */}
                                        <div className="flex items-center justify-between">
                                            {price ? (
                                                <div>
                                                    <span className="text-xl font-black" style={{ color: accent }}>
                                                        {price}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-muted-foreground/45">
                                                    {t("Contact for pricing", "Liên hệ học phí")}
                                                </span>
                                            )}
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (c.cta_href) window.open(c.cta_href, "_blank");
                                                    else document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                                                }}
                                                size="sm"
                                                className="rounded-xl font-semibold text-[13px] text-white border-0 px-5 py-2.5
                                                    transition-all duration-300 hover:brightness-110 active:scale-[0.97]
                                                    group-hover:shadow-lg"
                                                style={{
                                                    background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                                                    boxShadow: `0 4px 14px ${accent}25`,
                                                }}
                                            >
                                                {c.cta_type === "contact"
                                                    ? t("Contact", "Liên hệ")
                                                    : t("Enroll", "Đăng ký")}
                                                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Hover glow effect for featured card */}
                                    {c.is_featured && (
                                        <div
                                            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                            style={{
                                                boxShadow: `inset 0 0 0 1px ${accent}15, 0 25px 80px -20px ${accent}25`,
                                            }}
                                        />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <p className="text-center text-muted-foreground/30 text-[10px] mt-6 tracking-wide">
                    {t("Contact to get pricing · Lifetime access", "Liên hệ để hỏi học phí · Học trọn đời")}
                </p>
            </div>
        </section>
    );
}
