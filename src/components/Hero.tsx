"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Users, BookOpen, Star, TrendingUp, Youtube, Bot, Sparkles, ShoppingCart, Zap } from "lucide-react";
import { useLang } from "@/context/LangContext";
import FlipWords from "./FlipWords";

// Lazy-load the canvas shader — it only works client-side, nothing to show on SSR
const DotDistortion = lazy(() => import("./DotDistortion"));

const stats = [
    { icon: Users, value: "20+", en: "Students", vi: "Học viên" },
    { icon: BookOpen, value: "3", en: "Courses", vi: "Khóa học" },
    { icon: Star, value: "4.9★", en: "Rating", vi: "Đánh giá" },
    { icon: TrendingUp, value: "95%", en: "Success", vi: "Thành công" },
];

/* Orbiting icon items */
const orbitItems = [
    { icon: Youtube,      color: "#ef4444", label: "YouTube",   angle: 0,   orbitRadius: 130, size: 36, delay: 0 },
    { icon: ShoppingCart,  color: "#f97316", label: "Affiliate", angle: 72,  orbitRadius: 125, size: 32, delay: 0.15 },
    { icon: Bot,           color: "#8b5cf6", label: "AI Tools",  angle: 144, orbitRadius: 128, size: 34, delay: 0.3 },
    { icon: Sparkles,      color: "#0ea5e9", label: "Skills",    angle: 216, orbitRadius: 126, size: 30, delay: 0.45 },
    { icon: Zap,           color: "#eab308", label: "Income",    angle: 288, orbitRadius: 130, size: 32, delay: 0.6 },
];

/* Hero entrance animations — subtle fade only, no layout shift */
const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export default function Hero() {
    const { t } = useLang();

    return (
        <section className="relative min-h-[80vh] flex items-center px-6 pt-16 pb-4 overflow-hidden">
            {/* ── Dot Distortion — lazy loaded, no CLS since it's position:absolute ── */}
            <Suspense fallback={null}>
                <DotDistortion />
            </Suspense>

            {/* Background blobs — contained to prevent CLS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ contain: 'strict' }}>
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] rounded-full bg-primary/5 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[250px] rounded-full bg-violet-500/5 blur-[100px] animate-pulse-slow-delayed" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
                    {/* ===== LEFT: Text ===== */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* Badge */}
                        <motion.div className="mb-5" {...fadeUp(0)}>
                            <Badge
                                variant="outline"
                                className="rounded-full border-primary/25 bg-primary/8 text-primary px-4 py-1 text-[11px] font-semibold uppercase tracking-widest gap-1.5"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {t("Open · 2026", "Mở đăng ký · 2026")}
                            </Badge>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-5"
                            {...fadeUp(0.1)}
                        >
                            <span className="hero-heading">{t("Make Money ", "Kiếm Tiền ")}{t("with ", "với ")}</span>
                            <span className="gradient-text">AI 2026</span>
                        </motion.h1>

                        {/* FlipWords */}
                        <motion.div
                            className="text-muted-foreground text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-7 leading-relaxed min-h-[1.75rem]"
                            {...fadeUp(0.2)}
                        >
                            {t("From day one", "Từ ngày đầu")}
                            {" · "}
                            <FlipWords
                                words={t(
                                    "Real skills,Real income,No fluff,AI-powered",
                                    "Kỹ năng thực,Thu nhập thực,Không lý thuyết,Tích hợp AI"
                                ).split(",")}
                                className="text-foreground font-semibold"
                            />
                        </motion.div>

                        {/* CTAs */}
                        <motion.div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8" {...fadeUp(0.3)}>
                            <Button asChild size="lg" className="btn-primary border-0 text-white rounded-xl px-8 font-semibold">
                                <a href="#courses">{t("Browse Courses", "Xem khóa học")} →</a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-xl px-8 border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                                <a href="#contact">{t("Contact", "Liên hệ")}</a>
                            </Button>
                        </motion.div>

                        {/* Trust markers & Stats */}
                        <motion.div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-5" {...fadeUp(0.4)}>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col text-left">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-[11px] font-bold text-foreground">
                                        {t("20+ happy students", "20+ học viên tham gia")}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden sm:block w-px h-10 bg-border/50 mx-2" />

                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                {stats.map(({ icon: Icon, value, en, vi }) => (
                                    <motion.div
                                        key={en}
                                        whileHover={{ y: -2, transition: { duration: 0.12 } }}
                                        className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 cursor-default hover:border-primary/20 transition-colors"
                                        title={t(en, vi)}
                                    >
                                        <Icon className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-xs font-bold text-foreground">{value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ===== RIGHT: Orbital Animation ===== */}
                    <motion.div
                        className="hidden lg:block relative w-[320px] h-[320px] flex-shrink-0"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    >
                        {/* Outer glow ring */}
                        <div
                            className="absolute inset-4 rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
                            }}
                        />

                        {/* Orbiting ring — CSS rotate for GPU acceleration */}
                        <div className="absolute inset-0 hero-orbit">
                            {orbitItems.map((item, i) => {
                                const rad = (item.angle * Math.PI) / 180;
                                const x = 160 + item.orbitRadius * Math.cos(rad) - item.size / 2;
                                const y = 160 + item.orbitRadius * Math.sin(rad) - item.size / 2;
                                return (
                                    <motion.div
                                        key={item.label}
                                        className="absolute glass rounded-xl shadow-lg flex items-center justify-center"
                                        style={{
                                            width: item.size,
                                            height: item.size,
                                            left: x,
                                            top: y,
                                        }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + item.delay, duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                                    >
                                        {/* Counter-rotate to keep icons upright */}
                                        <div className="hero-orbit-counter flex items-center justify-center">
                                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Inner pulsing core */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="w-20 h-20 rounded-full flex items-center justify-center relative"
                                style={{
                                    background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 60%, transparent 100%)",
                                }}
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* Ping ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-primary/20"
                                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-primary/10"
                                    animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                                />
                                <div className="text-center z-10">
                                    <div className="text-2xl font-black gradient-text">AI</div>
                                    <div className="text-[8px] text-muted-foreground/50 uppercase tracking-[0.2em] -mt-0.5">Powered</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Subtle connecting lines (decorative arcs) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320">
                            <circle cx="160" cy="160" r="128" fill="none" stroke="rgba(37,99,235,0.06)" strokeWidth="1" strokeDasharray="6 8" />
                            <circle cx="160" cy="160" r="90" fill="none" stroke="rgba(139,92,246,0.04)" strokeWidth="0.5" strokeDasharray="4 6" />
                        </svg>
                    </motion.div>
                </div>
            </div>

            <a
                href="#courses"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/30 hover:text-muted-foreground transition-colors"
            >
                <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
        </section>
    );
}
