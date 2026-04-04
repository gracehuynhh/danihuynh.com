"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Users, BookOpen, Star, TrendingUp, Youtube, Bot, Sparkles, ShoppingCart } from "lucide-react";
import { useLang } from "@/context/LangContext";
import FlipWords from "./FlipWords";
import dynamic from "next/dynamic";
import Image from "next/image";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then(mod => mod.Player), {
    ssr: false,
});

// Lazy-load the canvas shader — it only works client-side, nothing to show on SSR
const DotDistortion = lazy(() => import("./DotDistortion"));

const stats = [
    { icon: Users, value: "20+", en: "Students", vi: "Học viên" },
    { icon: BookOpen, value: "3", en: "Courses", vi: "Khóa học" },
    { icon: Star, value: "4.9★", en: "Rating", vi: "Đánh giá" },
    { icon: TrendingUp, value: "95%", en: "Success", vi: "Thành công" },
];

const floatingItems = [
    { icon: Youtube, color: "#ef4444", label: "YouTube", left: "8%", top: "8%", delay: 0 },
    { icon: ShoppingCart, color: "#f97316", label: "Affiliate", left: "68%", top: "12%", delay: 0.3 },
    { icon: Bot, color: "#8b5cf6", label: "AI Tools", left: "5%", top: "60%", delay: 0.6 },
];



export default function Hero() {
    const { t } = useLang();

    return (
        <section className="relative min-h-[80vh] flex items-center px-6 pt-16 pb-4 overflow-hidden">
            {/* ── Dot Distortion — lazy loaded, no CLS since it's position:absolute ── */}
            <Suspense fallback={null}>
                <DotDistortion />
            </Suspense>

            {/* Background blobs — contained to prevent CLS from sub-pixel rounding */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ contain: 'strict' }}>
                <div
                    className="absolute top-1/4 left-1/3 w-[500px] h-[350px] rounded-full bg-primary/5 blur-[120px] animate-pulse-slow"
                />
                <div
                    className="absolute bottom-1/3 right-1/4 w-[350px] h-[250px] rounded-full bg-violet-500/5 blur-[100px] animate-pulse-slow-delayed"
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

                    {/* Floating Money Lottie */}
                    <div className="absolute hidden lg:block -right-10 -bottom-16 w-60 h-60 opacity-100 pointer-events-none z-10">
                        <Player autoplay loop src="https://assets5.lottiefiles.com/packages/lf20_puciaact.json" style={{ height: '100%', width: '100%' }} />
                    </div>

                    {/* ===== LEFT: Text — all elements render at final position ===== */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* Badge */}
                        <div className="mb-5">
                            <Badge
                                variant="outline"
                                className="rounded-full border-primary/25 bg-primary/8 text-primary px-4 py-1 text-[11px] font-semibold uppercase tracking-widest gap-1.5"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {t("Open · 2026", "Mở đăng ký · 2026")}
                            </Badge>
                        </div>

                        {/* Heading — renders immediately */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-5">
                            <span className="hero-heading">{t("Make Money ", "Kiếm Tiền ")}{t("with ", "với ")}</span>
                            <span className="gradient-text">AI 2026</span>
                        </h1>

                        {/* FlipWords — fixed min-height to prevent CLS during word swap */}
                        <div className="text-muted-foreground text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-7 leading-relaxed min-h-[1.75rem]">
                            {t("From day one", "Từ ngày đầu")}
                            {" · "}
                            <FlipWords
                                words={t(
                                    "Real skills,Real income,No fluff,AI-powered",
                                    "Kỹ năng thực,Thu nhập thực,Không lý thuyết,Tích hợp AI"
                                ).split(",")}
                                className="text-foreground font-semibold"
                            />
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                            <Button asChild size="lg" className="btn-primary border-0 text-white rounded-xl px-8 font-semibold">
                                <a href="#courses">{t("Browse Courses", "Xem khóa học")} →</a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-xl px-8 border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                                <a href="#contact">{t("Contact", "Liên hệ")}</a>
                            </Button>
                        </div>

                        {/* Trust markers & Stats */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-5">
                            {/* Trust markers & Stats */}
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
                        </div>
                    </div>

                    {/* ===== RIGHT: Animated Orb — position:absolute children, no CLS ===== */}
                    <div className="hidden lg:block relative w-[320px] h-[320px] flex-shrink-0">
                        <motion.div
                            className="absolute inset-12 rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)",
                            }}
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />

                        <motion.div
                            className="absolute inset-8 rounded-full border border-dashed border-primary/12"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute inset-20 rounded-full border border-dashed border-violet-400/8"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        />

                        {floatingItems.map((item, i) => (
                            <motion.div
                                key={item.label}
                                className="absolute flex items-center gap-1.5 glass rounded-lg px-2.5 py-1.5 shadow-md cursor-default"
                                style={{ left: item.left, top: item.top }}
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                    y: { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                                }}
                                whileHover={{ scale: 1.08, transition: { duration: 0.12 } }}
                            >
                                <div
                                    className="w-7 h-7 rounded-md flex items-center justify-center"
                                    style={{ background: `${item.color}15` }}
                                >
                                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                                </div>
                                <span className="text-[11px] font-semibold text-card-foreground">{item.label}</span>
                            </motion.div>
                        ))}

                        <motion.div
                            className="absolute inset-[30px] rounded-full overflow-hidden border-[6px] border-background shadow-2xl z-10"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Image
                                src="/avatar.png"
                                alt="Dani Huynh"
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 768px) 250px, 320px"
                                priority
                            />
                        </motion.div>
                    </div>
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
