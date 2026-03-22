"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, Users, BookOpen, Star, TrendingUp } from "lucide-react";
import { useLang } from "@/context/LangContext";

const stats = [
    { icon: Users, value: "2,000+", en: "Students", vi: "Học viên" },
    { icon: BookOpen, value: "3", en: "Courses", vi: "Khóa học" },
    { icon: Star, value: "4.9★", en: "Rating", vi: "Đánh giá" },
    { icon: TrendingUp, value: "95%", en: "Success", vi: "Tỷ lệ thành công" },
];

export default function Hero() {
    const { t } = useLang();

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-12 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[380px] rounded-full bg-primary/5 blur-[120px]"
                    animate={{ opacity: [0.25, 0.55, 0.25] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                    className="absolute inset-0 opacity-[0.018]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
                        backgroundSize: "72px 72px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0 }}
                >
                    <Badge
                        variant="outline"
                        className="mb-6 rounded-full border-primary/25 bg-primary/8 text-primary px-4 py-1 text-[11px] font-semibold uppercase tracking-widest gap-1.5"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {t("Open for enrollment · 2026", "Mở đăng ký · 2026")}
                    </Badge>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="text-6xl md:text-[88px] font-black leading-[0.95] tracking-tight mb-6 text-foreground"
                >
                    {t("Make Money ", "Kiếm Tiền ")}
                    {t("with ", "với ")}
                    <span className="gradient-text">AI 2026</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-2 leading-relaxed"
                >
                    {t(
                        "AI-powered courses on Web Dev, YouTube & Vibecoding.",
                        "Khóa học AI thực chiến: Làm Web, YouTube & Vibecoding."
                    )}
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-muted-foreground/50 text-sm mb-10"
                >
                    {t("Real skills. Real income. No fluff.", "Kỹ năng thực. Thu nhập thực. Không lý thuyết.")}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
                >
                    <Button asChild size="lg" className="btn-primary border-0 text-white rounded-xl px-8 font-semibold">
                        <a href="#courses">{t("Browse Courses", "Xem khóa học")} →</a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-xl px-8 border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                        <a href="#about">{t("Meet Dani", "Về Dani")}</a>
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                >
                    <Separator className="mb-8 bg-border max-w-xs mx-auto" />
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                    {stats.map(({ icon: Icon, value, en, vi }, i) => (
                        <motion.div
                            key={en}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                            whileHover={{ y: -4, scale: 1.04, transition: { duration: 0.15 } }}
                            className="glass rounded-2xl p-3 text-center hover:border-primary/20 transition-colors group cursor-default"
                        >
                            <Icon className="w-4 h-4 text-primary mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                            <div className="text-lg font-black text-foreground">{value}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
                                {t(en, vi)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <a
                href="#about"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
                <ArrowDown className="w-4 h-4 animate-bounce" />
            </a>
        </section>
    );
}
