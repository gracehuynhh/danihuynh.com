"use client";

import { useLang } from "@/context/LangContext";
import { DaniLogo } from "@/components/DaniLogo";

const footerColumns = [
    {
        titleEn: "Courses",
        titleVi: "Khóa học",
        links: [
            { en: "AI Web Dev", vi: "Làm Web + AI", href: "/courses/ai-web-dev" },
            { en: "YouTube × AI", vi: "YouTube × AI", href: "/courses/youtube-ai" },
            { en: "YouTube 1-on-1", vi: "YouTube 1 kèm 1", href: "/courses/youtube-1on1" },
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
        titleEn: "Social",
        titleVi: "Mạng xã hội",
        links: [
            { en: "YouTube", vi: "YouTube", href: "https://youtube.com/@danihuynh" },
            { en: "Facebook", vi: "Facebook", href: "https://facebook.com/danihuynh" },
            { en: "Email", vi: "Email", href: "mailto:hello@danihuynh.com" },
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

export default function Footer() {
    const { t } = useLang();

    return (
        <footer className="border-t border-border bg-card/50 pt-16 pb-8 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Top: Logo + Grids */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-1">
                        <a href="#" className="inline-block mb-4">
                            <DaniLogo height={28} />
                        </a>
                        <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px]">
                            {t(
                                "Learn to build real income with AI — from someone who actually does it.",
                                "Học cách tạo thu nhập thực với AI — từ người thực sự làm được."
                            )}
                        </p>
                    </div>

                    {/* 4 Link columns */}
                    {footerColumns.map((col) => (
                        <div key={col.titleEn}>
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                                {t(col.titleEn, col.titleVi)}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.en}>
                                        <a
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
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
                    <p className="text-muted-foreground/40 text-[11px]">
                        {t("Built with Next.js & AI", "Xây dựng bằng Next.js & AI")} ✨
                    </p>
                </div>
            </div>
        </footer>
    );
}
