"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLang } from "@/context/LangContext";

const testimonials = [
    {
        name: "Minh Tuan",
        role: { en: "Web Dev · Startup", vi: "Lập trình viên" },
        avatar: "MT",
        course: { en: "AI Web Dev", vi: "Làm Web + AI" },
        accent: "#6366f1",
        en: "Got my first dev job 3 months in. The AI tools section alone saved me 10h/week.",
        vi: "Xin được việc lập trình sau 3 tháng. Phần AI tools tiết kiệm 10 giờ mỗi tuần.",
    },
    {
        name: "Thanh Hang",
        role: { en: "YouTuber · 120k subs", vi: "YouTuber · 120k subs" },
        avatar: "TH",
        course: { en: "YouTube × AI", vi: "YouTube × AI" },
        accent: "#ef4444",
        en: "500 → 120k subs in 8 months. The AI scripting + thumbnail system is a game-changer.",
        vi: "500 → 120k subs trong 8 tháng. Hệ thống AI script + thumbnail thực sự đổi game.",
    },
    {
        name: "Quoc Bao",
        role: { en: "Content Creator", vi: "Content Creator" },
        avatar: "QB",
        course: { en: "YouTube Basic", vi: "YouTube Cơ bản" },
        accent: "#ef4444",
        en: "$400 in revenue month one. AI content system finds viral topics in minutes, not days.",
        vi: "$400 doanh thu tháng đầu. Hệ thống AI tìm chủ đề viral trong vài phút thay vì cả ngày.",
    },
    {
        name: "Lan Anh",
        role: { en: "Freelance Developer", vi: "Freelance Developer" },
        avatar: "LA",
        course: { en: "AI Web Dev", vi: "Làm Web + AI" },
        accent: "#6366f1",
        en: "Now taking $2,500–$5k freelance projects. This course made me actually competitive.",
        vi: "Nhận dự án freelance $2,500–$5k. Khóa học làm tôi thực sự cạnh tranh được.",
    },
    {
        name: "Hung Viet",
        role: { en: "Content Creator", vi: "Content Creator" },
        avatar: "HV",
        course: { en: "YouTube × AI", vi: "YouTube × AI" },
        accent: "#ef4444",
        en: "Invested $99, earned $3k+ in 6 months. The Discord community is a huge bonus.",
        vi: "Đầu tư $99, thu $3k+ trong 6 tháng. Cộng đồng Discord là điểm cộng rất lớn.",
    },
    {
        name: "Thu Ngan",
        role: { en: "Side Income · 1hr/day", vi: "Thu nhập phụ · 1h/ngày" },
        avatar: "TN",
        course: { en: "YouTube 1-on-1", vi: "YouTube 1 kèm 1" },
        accent: "#8b5cf6",
        en: "$250 extra in month 1, working just 1h/day. The 1-on-1 mentorship is worth every penny.",
        vi: "$250 thêm từ tháng đầu, chỉ làm 1h/ngày. Khóa 1 kèm 1 đáng từng đồng.",
    },
];

export default function Testimonials() {
    const { lang, t } = useLang();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <section id="testimonials" className="py-14 px-6" ref={ref}>
            <div className="section-divider mb-12" />
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge
                        variant="outline"
                        className="mb-4 rounded-full border-primary/25 bg-primary/8 text-primary text-[11px] font-semibold uppercase tracking-widest px-3"
                    >
                        {t("Student Results", "Kết quả học viên")}
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground">
                        {t("Real ", "Kết quả ")}<span className="gradient-text">{t("outcomes", "thực tế")}</span>
                    </h2>
                </motion.div>

                {/* Masonry grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {testimonials.map((t_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                        >
                            <Card className="course-card bg-card border-border rounded-2xl break-inside-avoid">
                                <CardContent className="p-5">
                                    {/* Stars */}
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                        &ldquo;{lang === "en" ? t_.en : t_.vi}&rdquo;
                                    </p>

                                    {/* Reviewer */}
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9">
                                            <AvatarFallback
                                                className="text-xs font-bold text-white"
                                                style={{ background: `${t_.accent}30`, border: `1px solid ${t_.accent}40` }}
                                            >
                                                {t_.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-card-foreground">{t_.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">
                                                {lang === "en" ? t_.role.en : t_.role.vi}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-[9px] font-semibold rounded-full whitespace-nowrap"
                                            style={{
                                                color: t_.accent,
                                                borderColor: `${t_.accent}25`,
                                                background: `${t_.accent}10`,
                                            }}
                                        >
                                            {lang === "en" ? t_.course.en : t_.course.vi}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
