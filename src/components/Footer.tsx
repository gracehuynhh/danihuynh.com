"use client";

import { Separator } from "@/components/ui/separator";
import { useLang } from "@/context/LangContext";
import { DaniLogo } from "@/components/DaniLogo";

export default function Footer() {
    const { t } = useLang();

    const links = [
        { en: "AI Web Dev", vi: "Làm Web + AI", href: "#courses" },
        { en: "YouTube × AI", vi: "YouTube × AI", href: "#courses" },
        { en: "YouTube 1-on-1", vi: "YouTube 1 kèm 1", href: "#courses" },
        { en: "About", vi: "Về tôi", href: "#about" },
        { en: "Contact", vi: "Liên hệ", href: "#contact" },
        { en: "Privacy", vi: "Bảo mật", href: "#" },
    ];

    return (
        <footer className="border-t border-border py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    {/* Brand */}
                    <a href="#" className="flex items-center gap-2 group">
                        <DaniLogo height={28} className="transition-opacity group-hover:opacity-80" />
                    </a>

                    {/* Links */}
                    <nav className="flex flex-wrap gap-x-5 gap-y-2">
                        {links.map((l) => (
                            <a
                                key={l.en}
                                href={l.href}
                                className="nav-link text-muted-foreground hover:text-foreground text-xs transition-colors"
                            >
                                {t(l.en, l.vi)}
                            </a>
                        ))}
                    </nav>
                </div>

                <Separator className="bg-border mb-6" />

                <p className="text-muted-foreground/40 text-xs text-center">
                    © 2026 DaniHuynh · {t("All rights reserved.", "Bảo lưu mọi quyền.")}
                </p>
            </div>
        </footer>
    );
}
