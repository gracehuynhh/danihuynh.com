"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLang } from "@/context/LangContext";

const achievements = [
    { value: "10+", en: "Yrs exp.", vi: "Năm KN" },
    { value: "2k+", en: "Students", vi: "Học viên" },
    { value: "3", en: "Courses", vi: "Khóa học" },
];

export default function About() {
    const { t } = useLang();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    /* Subtle fade — starts slightly visible to avoid perceived CLS */
    const anim = (delay: number) => ({
        initial: { opacity: 0.15 },
        animate: inView ? { opacity: 1 } : { opacity: 0.15 },
        transition: { duration: 0.5, delay },
    });

    return (
        <section id="about" className="py-14 px-6" ref={ref}>
            <div className="section-divider mb-12" />

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                {/* Avatar side */}
                <motion.div className="relative flex justify-center" {...anim(0)}>
                    <div className="relative">
                        <div
                            className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-125 animate-pulse-slow"
                        />
                        <Avatar className="w-52 h-52 border-2 border-border ring-4 ring-primary/10 relative z-10">
                            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-4xl font-black text-primary">
                                D
                            </AvatarFallback>
                        </Avatar>

                        <motion.div
                            className="absolute -top-2 -right-6 glass rounded-xl px-3 py-1.5 border border-primary/20"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <p className="text-xs font-semibold text-primary">🏆 Top Creator</p>
                        </motion.div>
                        <motion.div
                            className="absolute -bottom-2 -left-6 glass rounded-xl px-3 py-1.5 border border-border"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        >
                            <p className="text-xs font-semibold text-foreground">💻 Full-Stack Dev</p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Content side */}
                <div>
                    <motion.div {...anim(0.1)}>
                        <Badge
                            variant="outline"
                            className="mb-4 rounded-full border-primary/25 bg-primary/8 text-primary text-[11px] font-semibold uppercase tracking-widest px-3"
                        >
                            {t("About", "Về tôi")}
                        </Badge>
                    </motion.div>

                    <motion.h2 {...anim(0.15)} className="text-4xl md:text-5xl font-black mb-5 leading-tight">
                        <span className="hero-heading">{t("Hey, I'm ", "Xin chào, ")}</span>
                        <span className="gradient-text">Dani</span>
                    </motion.h2>

                    <motion.p {...anim(0.2)} className="text-muted-foreground text-sm leading-relaxed mb-5">
                        {t(
                            "Full-Stack Developer & content creator who built real income streams from web, YouTube, and affiliate. I teach the exact systems — with AI built in from day one.",
                            "Lập trình viên Full-Stack & content creator đã xây dựng thu nhập thực từ web, YouTube và affiliate. Tôi dạy đúng hệ thống — tích hợp AI từ ngày đầu."
                        )}
                    </motion.p>

                    <motion.div
                        {...anim(0.25)}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-primary/6 border border-primary/15 mb-7"
                    >
                        <Bot className="w-4 h-4 text-primary flex-shrink-0" />
                        <p className="text-xs text-primary/80 font-medium">
                            {t(
                                "Every course includes real AI workflows I use daily.",
                                "Mỗi khóa học đều có AI workflow tôi dùng thực tế."
                            )}
                        </p>
                    </motion.div>

                    <Separator className="bg-border mb-6" />

                    <motion.div {...anim(0.3)} className="grid grid-cols-3 gap-3">
                        {achievements.map((a) => (
                            <motion.div
                                key={a.en}
                                whileHover={{ y: -4, scale: 1.04, transition: { duration: 0.15 } }}
                                className="rounded-2xl border border-border bg-card p-4 text-center hover:border-primary/20 transition-colors cursor-default"
                            >
                                <div className="text-xl font-black gradient-text">{a.value}</div>
                                <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">
                                    {t(a.en, a.vi)}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
