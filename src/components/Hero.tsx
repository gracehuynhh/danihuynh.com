"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Users, BookOpen, Star, TrendingUp, Youtube, Code2, Bot, Sparkles } from "lucide-react";
import { useLang } from "@/context/LangContext";
import DotDistortion from "./DotDistortion";
import FlipWords from "./FlipWords";

const stats = [
    { icon: Users, value: "2,000+", en: "Students", vi: "Học viên" },
    { icon: BookOpen, value: "3", en: "Courses", vi: "Khóa học" },
    { icon: Star, value: "4.9★", en: "Rating", vi: "Đánh giá" },
    { icon: TrendingUp, value: "95%", en: "Success", vi: "Thành công" },
];

const floatingItems = [
    { icon: Youtube, color: "#ef4444", label: "YouTube", left: "8%", top: "8%", delay: 0 },
    { icon: Code2, color: "#3b82f6", label: "Web Dev", left: "58%", top: "5%", delay: 0.3 },
    { icon: Bot, color: "#8b5cf6", label: "AI Tools", left: "5%", top: "60%", delay: 0.6 },
    { icon: Sparkles, color: "#f59e0b", label: "Vibecoding", left: "55%", top: "65%", delay: 0.9 },
];

export default function Hero() {
    const { t } = useLang();

    return (
        <section className="relative min-h-[80vh] flex items-center px-6 pt-16 pb-4 overflow-hidden">
            {/* ── Dot Distortion Shader ── */}
            <DotDistortion />

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/3 w-[500px] h-[350px] rounded-full bg-primary/5 blur-[120px]"
                    animate={{ opacity: [0.2, 0.45, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-[350px] h-[250px] rounded-full bg-violet-500/5 blur-[100px]"
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

                    {/* ===== LEFT: Text ===== */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge
                                variant="outline"
                                className="mb-5 rounded-full border-primary/25 bg-primary/8 text-primary px-4 py-1 text-[11px] font-semibold uppercase tracking-widest gap-1.5"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {t("Open · 2026", "Mở đăng ký · 2026")}
                            </Badge>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-5"
                        >
                            <span className="hero-heading">{t("Make Money ", "Kiếm Tiền ")}{t("with ", "với ")}</span>
                            <span className="gradient-text">AI 2026</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-muted-foreground text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-7 leading-relaxed"
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
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
                        >
                            <Button asChild size="lg" className="btn-primary border-0 text-white rounded-xl px-8 font-semibold">
                                <a href="#courses">{t("Browse Courses", "Xem khóa học")} →</a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-xl px-8 border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                                <a href="#contact">{t("Contact", "Liên hệ")}</a>
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                            {stats.map(({ icon: Icon, value, en, vi }, i) => (
                                <motion.div
                                    key={en}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
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

                    {/* ===== RIGHT: Animated Orb ===== */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="hidden lg:block relative w-[320px] h-[320px] flex-shrink-0"
                    >
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
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                                transition={{
                                    opacity: { duration: 0.4, delay: 0.5 + item.delay },
                                    scale: { duration: 0.4, delay: 0.5 + item.delay },
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
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="text-center">
                                <div className="text-3xl font-black gradient-text">AI</div>
                                <div className="text-[9px] text-muted-foreground/40 uppercase tracking-widest mt-0.5">Powered</div>
                            </div>
                        </motion.div>
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
