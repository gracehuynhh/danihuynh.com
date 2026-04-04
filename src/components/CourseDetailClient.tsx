"use client";

import { motion } from "framer-motion";
import {
    CheckCircle2, Clock, Star, ArrowLeft, Bot, Zap,
    Youtube, Code2, Crown, Sparkles, Globe, Users,
    Shield, Infinity as InfinityIcon, GraduationCap, Headphones, BookOpen,
    ArrowRight, Play, Lock
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Facebook, MessageCircle, Mail } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

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

/* ─── Animation variants ─── */
/* Above-the-fold: opacity-only fade – no y/scale to prevent CLS */
const heroFade = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
        opacity: 1,
        transition: { duration: 0.45, delay: i * 0.1, ease: [0, 0, 0.58, 1] as const },
    }),
};

/* Below-the-fold: safe to use translateY since elements aren't visible yet */
const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

const scaleInView = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

/* ─── CTA Button ─── */
function AnimatedCta({
    ctaHref, ctaType, accent, isEn, size = "lg", onClick
}: {
    ctaHref: string | null;
    ctaType: string;
    accent: string;
    isEn: boolean;
    size?: "lg" | "sm";
    onClick?: () => void;
}) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (ctaHref) {
            window.open(ctaHref, "_blank");
        } else {
            window.location.href = "/#contact";
        }
    };

    const isLg = size === "lg";

    return (
        <motion.button
            onClick={handleClick}
            className={`
                relative w-full font-bold text-white border-0 cursor-pointer
                overflow-hidden group
                ${isLg ? "rounded-2xl h-14 text-base px-8" : "rounded-xl h-12 text-sm px-6"}
            `}
            style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                boxShadow: `0 8px 32px ${accent}35, 0 2px 8px ${accent}20`,
            }}
            whileHover={{
                scale: 1.02,
                boxShadow: `0 12px 40px ${accent}45, 0 4px 12px ${accent}30`,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
            {/* Shine sweep */}
            <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                    backgroundSize: "250% 100%",
                    animation: "cta-shine 1.5s ease-in-out infinite",
                }}
            />

            <span
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 20px ${accent}30` }}
            />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {ctaType === "contact"
                    ? (isEn ? "Contact Now" : "Liên hệ ngay")
                    : (isEn ? "Enroll Now" : "Đăng ký ngay")}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
        </motion.button>
    );
}

/* ─── Main component ─── */
export default function CourseDetailClient({
    course,
    isEn,
}: {
    course: Course;
    isEn: boolean;
}) {
    const [showContact, setShowContact] = useState(false);
    const { get } = useSiteSettings();

    const c = course;
    const title = isEn ? c.title_en : c.title_vi;
    const subtitle = isEn ? c.subtitle_en : c.subtitle_vi;
    const desc = isEn ? c.desc_en : c.desc_vi;
    const badge = isEn ? c.badge_en : c.badge_vi;
    const price = isEn ? c.price_en : c.price_vi;
    const aiLabel = isEn ? c.ai_label_en : c.ai_label_vi;
    const features = isEn ? (c.features_en || []) : (c.features_vi || []);
    const accent = c.accent_color;
    const CourseIcon = ICON_MAP[c.icon_name] || Star;

    const handleCtaClick = () => {
        if (c.cta_href) {
            window.open(c.cta_href, "_blank");
        } else {
            setShowContact(true);
        }
    };

    const highlights: { icon: React.ElementType; label: string; sub: string }[] = [
        { icon: Clock, label: c.duration, sub: isEn ? "Duration" : "Thời lượng" },
        { icon: Star, label: c.rating, sub: isEn ? "Rating" : "Đánh giá" },
        { icon: InfinityIcon, label: isEn ? "Lifetime" : "Trọn đời", sub: isEn ? "Access" : "Truy cập" },
        { icon: Bot, label: "AI", sub: aiLabel },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* ===== HERO BANNER ===== */}
            <div
                className="relative overflow-hidden"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 60% at 10% 20%, ${accent}14 0%, transparent 60%),
                        radial-gradient(ellipse 60% 80% at 90% 80%, ${accent}10 0%, transparent 50%),
                        radial-gradient(ellipse 50% 50% at 50% 0%, ${accent}08 0%, transparent 70%),
                        linear-gradient(180deg, ${accent}06 0%, transparent 60%, var(--background) 100%)
                    `,
                }}
            >
                {/* Floating gradient orbs — CSS animation only, no layout impact */}
                <div
                    className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl animate-float-slow"
                    style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
                />
                <div
                    className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-3xl animate-float-slow-reverse"
                    style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
                />

                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, ${accent} 1px, transparent 0)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Accent line */}
                <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent}50, ${accent}, ${accent}50, transparent)` }}
                />

                <div className="relative max-w-5xl mx-auto px-6">
                    {/* Back nav — no animation, render immediately */}
                    <div className="py-5">
                        <Link
                            href="/#courses"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            {isEn ? "Back to courses" : "Quay lại khóa học"}
                        </Link>
                    </div>

                    {/* Hero content — opacity-only fade, NO y-shift */}
                    <div className="pb-12 pt-4">
                        <div className="flex flex-col md:flex-row md:items-start gap-8">
                            {/* Left: Title area */}
                            <div className="flex-1">
                                <motion.div
                                    className="flex items-center gap-4 mb-5"
                                    initial="hidden"
                                    animate="visible"
                                    variants={heroFade}
                                    custom={0}
                                >
                                    <motion.div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                                        style={{
                                            background: `linear-gradient(135deg, ${accent}22, ${accent}0a)`,
                                            border: `1.5px solid ${accent}20`,
                                        }}
                                        whileHover={{ rotate: 8, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <CourseIcon className="w-7 h-7" style={{ color: accent }} />
                                    </motion.div>
                                    <div>
                                        <Badge
                                            className="rounded-full text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border-0 mb-1 shadow-sm"
                                            style={{ color: accent, background: `${accent}12` }}
                                        >
                                            {badge}
                                        </Badge>
                                        <p className="text-sm font-semibold" style={{ color: accent }}>{subtitle}</p>
                                    </div>
                                </motion.div>

                                <motion.h1
                                    className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight"
                                    initial="hidden"
                                    animate="visible"
                                    variants={heroFade}
                                    custom={1}
                                >
                                    {title}
                                </motion.h1>

                                <motion.p
                                    className="text-muted-foreground text-base leading-relaxed max-w-lg mb-6"
                                    initial="hidden"
                                    animate="visible"
                                    variants={heroFade}
                                    custom={2}
                                >
                                    {desc}
                                </motion.p>

                                {/* Inline CTA for mobile */}
                                <motion.div
                                    className="md:hidden"
                                    initial="hidden"
                                    animate="visible"
                                    variants={heroFade}
                                    custom={3}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        {price && (
                                            <span className="text-3xl font-black" style={{ color: accent }}>{price}</span>
                                        )}
                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />{c.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{c.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <AnimatedCta ctaHref={c.cta_href} ctaType={c.cta_type} accent={accent} isEn={isEn} onClick={handleCtaClick} />
                                    <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
                                        {isEn ? "30-day money-back guarantee" : "Đảm bảo hoàn tiền 30 ngày"}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Right: CTA Card — opacity fade only, no scale */}
                            <motion.div
                                className="hidden md:block w-[320px] flex-shrink-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                            >
                                <div
                                    className="sticky top-6 rounded-3xl bg-card p-7 border"
                                    style={{
                                        borderColor: `${accent}20`,
                                        boxShadow: `0 25px 80px -20px ${accent}22, 0 12px 30px -10px rgba(0,0,0,0.08)`,
                                    }}
                                >
                                    {/* Gradient top bar */}
                                    <div
                                        className="h-1.5 -mx-7 -mt-7 mb-6 rounded-t-3xl"
                                        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88, ${accent}44)` }}
                                    />

                                    {price ? (
                                        <div className="mb-2">
                                            <span className="text-4xl font-black" style={{ color: accent }}>{price}</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {isEn ? "Contact for pricing" : "Liên hệ để biết học phí"}
                                        </p>
                                    )}

                                    {/* Mini stats */}
                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 mb-6">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />{c.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{c.rating}
                                        </span>
                                        <span>{isEn ? "Lifetime" : "Trọn đời"}</span>
                                    </div>

                                    <AnimatedCta ctaHref={c.cta_href} ctaType={c.cta_type} accent={accent} isEn={isEn} onClick={handleCtaClick} />

                                    {/* Trust signals */}
                                    <div className="mt-5 space-y-2">
                                        {([
                                            { icon: Shield, text: isEn ? "30-day money-back guarantee" : "Đảm bảo hoàn tiền 30 ngày" },
                                            { icon: Lock, text: isEn ? "Secure checkout" : "Thanh toán bảo mật" },
                                            { icon: InfinityIcon, text: isEn ? "Lifetime access" : "Truy cập trọn đời" },
                                        ] as { icon: React.ElementType; text: string }[]).map((t, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground/50">
                                                <t.icon className="w-3 h-3" />
                                                <span>{t.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== HIGHLIGHTS BAR — render immediately, no animation ===== */}
            <div
                className="border-y border-border/50"
                style={{ background: `linear-gradient(90deg, ${accent}04, ${accent}08, ${accent}04)` }}
            >
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <motion.div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${accent}10` }}
                                    whileHover={{ scale: 1.15, rotate: 6 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <h.icon
                                        className="w-4.5 h-4.5"
                                        style={{
                                            color: accent,
                                            ...(h.icon === Star ? { fill: "#fbbf24", color: "#fbbf24" } : {}),
                                        }}
                                    />
                                </motion.div>
                                <div>
                                    <div className="text-sm font-bold text-foreground leading-tight">{h.label}</div>
                                    <div className="text-[10px] text-muted-foreground/50">{h.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== MAIN CONTENT — below-the-fold, safe to animate ===== */}
            <div className="max-w-5xl mx-auto px-6 py-12">

                {/* What you'll learn */}
                <motion.div
                    className="mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={staggerContainer}
                >
                    <motion.h2
                        className="text-2xl font-black text-foreground mb-7 flex items-center gap-2.5"
                        variants={staggerItem}
                    >
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: `${accent}12` }}
                        >
                            <Zap className="w-4.5 h-4.5" style={{ color: accent }} />
                        </div>
                        {isEn ? "What you'll learn" : "Bạn sẽ học được gì"}
                    </motion.h2>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                variants={staggerItem}
                                className="flex items-start gap-3 p-4 rounded-2xl border border-border/40 bg-card
                                    hover:border-border/80 hover:shadow-md transition-all duration-300
                                    group cursor-default"
                                whileHover={{ x: 4 }}
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                                        transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: `${accent}10` }}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accent }} />
                                </div>
                                <span className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                                    {f}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Why this course */}
                <motion.div
                    className="mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={staggerContainer}
                >
                    <motion.h2
                        className="text-2xl font-black text-foreground mb-7 flex items-center gap-2.5"
                        variants={staggerItem}
                    >
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: `${accent}12` }}
                        >
                            <Shield className="w-4.5 h-4.5" style={{ color: accent }} />
                        </div>
                        {isEn ? "Why this course" : "Tại sao chọn khóa này"}
                    </motion.h2>

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
                            <motion.div
                                key={i}
                                variants={staggerItem}
                                className="text-center p-6 rounded-2xl border border-border/40 bg-card
                                    hover:border-border/80 hover:shadow-lg transition-all duration-300
                                    group cursor-default"
                                whileHover={{ y: -4 }}
                            >
                                <motion.div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                                    style={{ background: `${accent}10` }}
                                    whileHover={{ rotate: 12, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <item.icon className="w-5.5 h-5.5" style={{ color: accent }} />
                                </motion.div>
                                <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                                <p className="text-xs text-muted-foreground/60 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Final CTA banner */}
                <motion.div
                    className="rounded-3xl p-8 md:p-10 text-center relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${accent}0a, ${accent}04)`,
                        border: `1px solid ${accent}15`,
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={scaleInView}
                >
                    <div
                        className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.06] blur-2xl"
                        style={{ background: accent }}
                    />
                    <div
                        className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full opacity-[0.04] blur-2xl"
                        style={{ background: accent }}
                    />

                    <div className="relative z-10">
                        <motion.div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                            style={{
                                background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
                                border: `1px solid ${accent}15`,
                            }}
                            whileHover={{ rotate: 12, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Play className="w-6 h-6" style={{ color: accent }} />
                        </motion.div>

                        <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                            {isEn ? "Ready to make money with AI?" : "Sẵn sàng kiếm tiền với AI?"}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                            {isEn
                                ? "Learn real skills, generate real income."
                                : "Học kỹ năng thực tế, tạo thu nhập thực tế."}
                        </p>

                        <div className="max-w-xs mx-auto">
                            <AnimatedCta ctaHref={c.cta_href} ctaType={c.cta_type} accent={accent} isEn={isEn} onClick={handleCtaClick} />
                        </div>

                        {price && (
                            <p className="text-lg font-black mt-4" style={{ color: accent }}>
                                {price}
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ===== Mobile sticky CTA ===== */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <div
                    className="backdrop-blur-xl border-t p-4"
                    style={{
                        background: `linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.95))`,
                        borderColor: `${accent}15`,
                    }}
                >
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
                            <AnimatedCta ctaHref={c.cta_href} ctaType={c.cta_type} accent={accent} isEn={isEn} size="sm" onClick={handleCtaClick} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom spacer for mobile CTA */}
            <div className="h-20 md:hidden" />

            {/* ===== CONTACT DIALOG ===== */}
            <Dialog open={showContact} onOpenChange={setShowContact}>
                <DialogContent className="sm:max-w-md bg-card border-border rounded-3xl p-6 shadow-2xl">
                    <div className="mb-4">
                        <DialogTitle className="text-xl font-black text-center mb-1">
                            {isEn ? "Contact to Enroll" : "Liên hệ để đăng ký"}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                            {isEn ? "Select a channel below to message" : "Vui lòng chọn một nền tảng bên dưới để nhắn tin trực tiếp"}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <a href={get("contact_facebook_href")} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] group-hover:scale-110 transition-transform">
                                <Facebook className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Facebook</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{get("contact_facebook_info") || "Dani Huynh"}</p>
                            </div>
                        </a>

                        <a href={get("contact_zalo_href")} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:border-[#2563eb]/50 hover:bg-[#2563eb]/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb] group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Zalo</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{get("contact_zalo_info") || "0325525300"}</p>
                            </div>
                        </a>

                        <a href={get("contact_email_href")}
                           className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:border-[#d4a853]/50 hover:bg-[#d4a853]/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853] group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Email</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{get("contact_email_info") || "hello@danihuynh.com"}</p>
                            </div>
                        </a>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
