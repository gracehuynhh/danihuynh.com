"use client";

import { useState } from "react";
import { Mail, MessageCircle, Facebook, Youtube, Pencil, Check, X, Settings, ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/context/LangContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import dynamic from "next/dynamic";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then(mod => mod.Player), {
    ssr: false,
});

const ICONS: Record<string, React.ElementType> = {
    Zalo: MessageCircle,
    Facebook: Facebook,
    YouTube: Youtube,
    Email: Mail,
};

const COLORS: Record<string, string> = {
    Zalo: "#3b82f6",
    Facebook: "#6366f1",
    YouTube: "#ef4444",
    Email: "#d4a853",
};

type ContactMethod = {
    title: string;
    infoKey: string;
    hrefKey: string;
};

const contactMethods: ContactMethod[] = [
    { title: "Facebook", infoKey: "contact_facebook_info", hrefKey: "contact_facebook_href" },
    { title: "Email", infoKey: "contact_email_info", hrefKey: "contact_email_href" },
];

export default function Contact() {
    const { t } = useLang();
    const { isAdmin } = useAdmin();
    const { get, update } = useSiteSettings();

    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ info: string; href: string }>({ info: "", href: "" });
    const [saving, setSaving] = useState(false);

    const startEdit = (method: ContactMethod) => {
        setEditingKey(method.title);
        setEditValues({
            info: get(method.infoKey),
            href: get(method.hrefKey),
        });
    };

    const cancelEdit = () => setEditingKey(null);

    const saveEdit = async (method: ContactMethod) => {
        setSaving(true);
        await update(method.infoKey, editValues.info);
        await update(method.hrefKey, editValues.href);
        setSaving(false);
        setEditingKey(null);
    };

    return (
        <section id="contact" className="py-8 px-6">
            <div className="section-divider mb-6" />
            <div className="max-w-5xl mx-auto text-center">

                <Badge
                    variant="outline"
                    className="mb-4 rounded-full border-primary/25 bg-primary/8 text-primary text-[11px] font-semibold uppercase tracking-widest px-3"
                >
                    {t("Contact", "Liên hệ")}
                    {isAdmin && (
                        <span className="ml-2 inline-flex items-center gap-1 text-amber-500">
                            <Settings className="w-2.5 h-2.5" />
                            Admin
                        </span>
                    )}
                </Badge>

                <h2 className="text-4xl md:text-5xl font-black mb-2">
                    <span className="hero-heading">{t("Let's ", "Bắt đầu ")}</span>
                    <span className="gradient-text">{t("talk", "ngay thôi")}</span>
                </h2>

                {/* Contact cards grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {contactMethods.map((m) => {
                        const Icon = ICONS[m.title];
                        const color = COLORS[m.title];
                        const info = get(m.infoKey);
                        const href = get(m.hrefKey);
                        const isEditing = editingKey === m.title;

                        return (
                            <div key={m.title} className="relative group">
                                <a
                                    href={isEditing ? undefined : href}
                                    target={isEditing ? undefined : "_blank"}
                                    rel="noopener noreferrer"
                                    className={`block ${isEditing ? "pointer-events-none" : ""}`}
                                >
                                    <Card
                                        className={`bg-card border-border rounded-2xl h-full transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isEditing ? "ring-2 ring-primary/40" : ""}`}
                                        style={{ boxShadow: `0 2px 12px ${color}08` }}
                                    >
                                        {/* Gradient accent top bar */}
                                        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}60, ${color}20)` }} />
                                        <CardContent className="p-5 flex flex-col items-center gap-3 text-center">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center mt-1 transition-transform duration-300 group-hover:scale-110"
                                                style={{ background: `${color}12`, border: `1.5px solid ${color}20` }}
                                            >
                                                <Icon className="w-5.5 h-5.5" style={{ color }} />
                                            </div>
                                            <div className="w-full">
                                                <div className="flex items-center justify-center gap-1">
                                                    <p className="text-sm font-bold text-card-foreground">{m.title}</p>
                                                    <ArrowUpRight className="w-3 h-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>

                                                {isEditing ? (
                                                    <div
                                                        className="mt-2 space-y-1.5 text-left"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <input
                                                            autoFocus
                                                            value={editValues.info}
                                                            onChange={(e) => setEditValues({ ...editValues, info: e.target.value })}
                                                            className="w-full text-[10px] px-2 py-1 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                                                            placeholder="Hiển thị"
                                                        />
                                                        <input
                                                            value={editValues.href}
                                                            onChange={(e) => setEditValues({ ...editValues, href: e.target.value })}
                                                            className="w-full text-[10px] px-2 py-1 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                                                            placeholder="Link URL"
                                                        />
                                                        <div className="flex gap-1 pt-0.5">
                                                            <button
                                                                onClick={() => saveEdit(m)}
                                                                disabled={saving}
                                                                className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-primary text-white text-[10px] font-semibold hover:bg-primary/90 transition-colors"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                {saving ? "..." : "Lưu"}
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] hover:bg-muted/80 transition-colors"
                                                            >
                                                                <X className="w-3 h-3" />
                                                                Huỷ
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-[11px] text-muted-foreground mt-1 font-medium">{info}</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>

                                {/* Admin edit button */}
                                {isAdmin && !isEditing && (
                                    <button
                                        onClick={() => startEdit(m)}
                                        className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-100 z-10"
                                        title="Chỉnh sửa"
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CTA banner — rich gradient with decorative elements */}
                <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 40%, #3b82f6 100%)' }}>
                    {/* Confetti Animation */}
                    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen mix-blend-plus-lighter opacity-60">
                        <Player
                            autoplay
                            loop
                            src="https://assets3.lottiefiles.com/packages/lf20_u4yrau.json"
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 rounded-full bg-white/3 blur-3xl" />
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="relative z-10 p-8 md:p-10">
                        <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">
                            {t("Don't wait", "Đừng chần chừ")}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                            {t("Ready to make money with AI?", "Sẵn sàng kiếm tiền với AI?")}
                        </h3>
                        <p className="text-blue-100/80 text-sm mb-6 max-w-lg mx-auto">
                            {t("Start building real skills and generating income today.", "Bắt đầu xây dựng kỹ năng thực tế và tạo ra thu nhập ngay hôm nay.")}
                        </p>
                        <Button asChild className="bg-white text-primary hover:bg-blue-50 border-0 font-bold rounded-xl px-8 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5">
                            <a href="#courses">
                                {t("View All Courses", "Xem tất cả khóa học")} →
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
