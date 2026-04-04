"use client";

import { useLang } from "@/context/LangContext";
import { DaniLogo } from "@/components/DaniLogo";
import { Youtube, Facebook, Mail, Sparkles } from "lucide-react";

const footerColumns = [
    {
        titleEn: "Courses",
        titleVi: "Khóa học",
        links: [
            { en: "YouTube × AI", vi: "YouTube × AI", href: "/courses/youtube-ai" },
            { en: "YouTube 1-on-1", vi: "YouTube 1 kèm 1", href: "/courses/youtube-1on1" },
            { en: "Shopee Affiliate", vi: "Shopee Affiliate (Google Meet)", href: "/courses/shopee-affiliate" },
        ],
    },
    {
        titleEn: "Resources",
        titleVi: "Tài nguyên",
        links: [
            { en: "Blog", vi: "Blog", href: "/blog" },
            { en: "Free Tools", vi: "Công cụ miễn phí", href: "#" },
            { en: "Community", vi: "Cộng đồng", href: "#" },
        ],
    },
    {
        titleEn: "Legal",
        titleVi: "Pháp lý",
        links: [
            { en: "Privacy", vi: "Bảo mật", href: "#" },
            { en: "Terms", vi: "Điều khoản", href: "#" },
            { en: "Refund Policy", vi: "Chính sách hoàn tiền", href: "#" },
        ],
    },
];

const socialLinks = [
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@danihuynh", color: "#ef4444" },
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/kizgman/", color: "#3b82f6" },
    { name: "Email", icon: Mail, href: "mailto:hello@danihuynh.com", color: "#d4a853" },
];

export default function Footer() {
    const { t } = useLang();

    return (
        <footer className="border-t border-border bg-card/50 pt-16 pb-8 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Top: Logo + Grids */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-2">
                        <a href="#" className="inline-block mb-4">
                            <DaniLogo height={28} />
                        </a>
                        <p className="text-muted-foreground text-xs leading-relaxed max-w-[240px] mb-5">
                            {t(
                                "Learn to build real income with AI — from someone who actually does it.",
                                "Học cách tạo thu nhập thực với AI — từ người thực sự làm được."
                            )}
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-2">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                                    style={{
                                        background: `${s.color}10`,
                                        border: `1px solid ${s.color}18`,
                                    }}
                                    title={s.name}
                                >
                                    <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 3 Link columns */}
                    {footerColumns.map((col) => (
                        <div key={col.titleEn}>
                            <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-widest mb-4">
                                {t(col.titleEn, col.titleVi)}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.en}>
                                        <a
                                            href={link.href}
                                            className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
                                        >
                                            {t(link.en, link.vi)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-muted-foreground/50 text-xs">
                        © 2026 DaniHuynh · {t("All rights reserved.", "Bảo lưu mọi quyền.")}
                    </p>

                </div>
            </div>
        </footer>
    );
}
