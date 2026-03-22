"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Code2, Youtube, CheckCircle2, Bot, Clock, Star,
    ChevronDown, Crown, Sparkles, Zap, Globe, Users,
    Pencil, Plus, Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLang } from "@/context/LangContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase";

// Icon map (add more as needed)
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
    const [expanded, setExpanded] = useState<string | null>(null);
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
            // Supabase unreachable — use empty list gracefully
        }
        setLoading(false);
    };


    useEffect(() => { load(); }, []);


    if (loading) {
        return (
            <section className="py-14 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-3xl border border-border bg-card animate-pulse h-[480px]" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="courses" className="py-14 px-6">
            <div className="section-divider mb-12" />
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <Badge
                        variant="outline"
                        className="mb-4 rounded-full border-primary/25 bg-primary/8 text-primary text-[11px] font-semibold uppercase tracking-widest px-3"
                    >
                        {t("Courses", "Khóa học")}
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2">
                        {t("Learn. Build. ", "Học. Xây. ")}
                        <span className="gradient-text">{t("Earn", "Kiếm Tiền")}</span>
                    </h2>
                    <p className="text-muted-foreground/60 text-xs flex items-center justify-center gap-1.5 mt-3">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                        {t("All courses include AI tools & workflows", "Tất cả khóa học tích hợp AI tools & workflows")}
                    </p>
                    {isAdmin && (
                        <a
                            href="/admin?tab=courses"
                            className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-amber-600 hover:text-amber-700 font-semibold"
                        >
                            <Pencil className="w-3 h-3" /> Chỉnh sửa khóa học
                        </a>
                    )}
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-5">
                    {courses.map((c, index) => {
                        const Icon = ICON_MAP[c.icon_name] || Star;
                        const title = lang === "en" ? c.title_en : c.title_vi;
                        const subtitle = lang === "en" ? c.subtitle_en : c.subtitle_vi;
                        const desc = lang === "en" ? c.desc_en : c.desc_vi;
                        const badge = lang === "en" ? c.badge_en : c.badge_vi;
                        const price = lang === "en" ? c.price_en : c.price_vi;
                        const aiLabel = lang === "en" ? c.ai_label_en : c.ai_label_vi;
                        const features = lang === "en" ? (c.features_en || []) : (c.features_vi || []);
                        const isExpanded = expanded === c.id;
                        const accent = c.accent_color;

                        return (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "0px" }}
                                transition={{ duration: 0.5, delay: index * 0.12 }}
                                whileHover={{ y: -6, transition: { duration: 0.15 } }}
                                onClick={() => router.push(`/courses/${c.id}?lang=${lang}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <Card
                                    className={`relative flex flex-col bg-card rounded-3xl overflow-hidden h-full transition-shadow duration-300 ${c.is_featured
                                        ? "border-2 shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:shadow-[0_0_45px_rgba(139,92,246,0.4)]"
                                        : "border border-border hover:border-border/80 hover:shadow-lg"
                                        }`}
                                    style={c.is_featured ? { borderColor: accent } : {}}
                                >
                                    {/* Featured glow strip */}
                                    {c.is_featured && (
                                        <div
                                            className="absolute top-0 left-0 right-0 h-0.5"
                                            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                                        />
                                    )}

                                    <CardHeader className="p-6 pb-4">
                                        {/* Top row */}
                                        <div className="flex items-start justify-between mb-4">
                                            <motion.div
                                                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                                                style={{ background: `${accent}18` }}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <Icon className="w-5 h-5" style={{ color: accent }} />
                                            </motion.div>
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] font-bold uppercase tracking-widest rounded-full"
                                                style={{ color: accent, borderColor: `${accent}30`, background: `${accent}10` }}
                                            >
                                                {badge}
                                            </Badge>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-black text-card-foreground">{title}</h3>
                                        <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>{subtitle}</p>

                                        {/* AI badge */}
                                        <Badge
                                            variant="secondary"
                                            className="mt-2 w-fit rounded-full text-[10px] font-semibold gap-1 text-primary bg-primary/8 border border-primary/15 px-2 py-0.5"
                                        >
                                            <Bot className="w-2.5 h-2.5" />
                                            {aiLabel}
                                        </Badge>
                                    </CardHeader>

                                    <CardContent className="px-6 pb-4 flex-1">
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-5">{desc}</p>

                                        {/* Features */}
                                        <ul className="space-y-2.5">
                                            {features.map((f, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.12 + i * 0.06 }}
                                                    className="flex items-start gap-2 text-xs text-muted-foreground"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                                                    {f}
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {/* Expandable if many features */}
                                        {features.length > 4 && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => setExpanded(isExpanded ? null : c.id)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                                                    style={{ color: accent }}
                                                >
                                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                                    {isExpanded ? t("Show less", "Thu gọn") : t(`+${features.length - 4} more`, `+${features.length - 4} nội dung`)}
                                                </button>
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="px-6 pb-6 flex-col gap-0">
                                        {/* Meta */}
                                        <div className="flex items-center gap-3 w-full text-[11px] text-muted-foreground/60 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />{c.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />{c.rating}
                                            </span>
                                            <span className="ml-auto text-[11px] text-muted-foreground/40">
                                                {t("Lifetime access", "Học trọn đời")}
                                            </span>
                                        </div>
                                        <Separator className="bg-border mb-4" />

                                        {/* Price */}
                                        {price && (
                                            <p className="text-center font-black text-lg mb-3" style={{ color: accent }}>
                                                {price}
                                            </p>
                                        )}
                                        {!price && c.cta_type === "contact" && (
                                            <p className="text-center text-xs text-muted-foreground mb-3">
                                                {t("Contact for pricing", "Liên hệ để biết học phí")}
                                            </p>
                                        )}

                                        {/* CTA */}
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation(); // don't trigger card click
                                                if (c.cta_href) window.open(c.cta_href, "_blank");
                                                else document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                                            }}
                                            className="w-full rounded-xl font-semibold text-sm text-white border-0 transition-all duration-200"
                                            style={{
                                                background: accent,
                                                boxShadow: `0 4px 16px ${accent}28`,
                                            }}
                                        >
                                            {c.cta_type === "contact"
                                                ? t("Contact Now", "Liên hệ ngay")
                                                : t("Enroll Now", "Đăng ký ngay")} →
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                <p className="text-center text-muted-foreground/40 text-xs mt-8">
                    {t("Contact to get pricing · Lifetime access", "Liên hệ để hỏi học phí · Học trọn đời")}
                </p>
            </div>
        </section>
    );
}
