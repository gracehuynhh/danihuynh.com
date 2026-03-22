"use client";

import { useState } from "react";
import { Mail, MessageCircle, Facebook, Youtube, Pencil, Check, X, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLang } from "@/context/LangContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/context/SiteSettingsContext";

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
    { title: "Zalo", infoKey: "contact_zalo_info", hrefKey: "contact_zalo_href" },
    { title: "Facebook", infoKey: "contact_facebook_info", hrefKey: "contact_facebook_href" },
    { title: "YouTube", infoKey: "contact_youtube_info", hrefKey: "contact_youtube_href" },
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
        <section id="contact" className="py-14 px-6">
            <div className="section-divider mb-12" />
            <div className="max-w-3xl mx-auto text-center">

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

                <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2">
                    {t("Let's ", "Bắt đầu ")}
                    <span className="gradient-text">{t("talk", "ngay thôi")}</span>
                </h2>
                <p className="text-muted-foreground text-sm mb-10">
                    {t("Have questions? I personally reply to everyone.", "Có thắc mắc? Tôi đích thân trả lời tất cả.")}
                </p>

                {/* Contact cards grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
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
                                        className={`course-card bg-card border-border rounded-2xl h-full transition-all ${isEditing ? "ring-2 ring-primary/40" : ""}`}
                                    >
                                        <CardContent className="p-5 flex flex-col items-center gap-3 text-center">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center mt-1"
                                                style={{ background: `${color}15`, border: `1px solid ${color}22` }}
                                            >
                                                <Icon className="w-5 h-5" style={{ color }} />
                                            </div>
                                            <div className="w-full">
                                                <p className="text-sm font-semibold text-card-foreground">{m.title}</p>

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
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{info}</p>
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

                {/* CTA banner */}
                <Card className="glow-primary border-primary/20 bg-card rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-primary/3 pointer-events-none" />
                    <CardContent className="relative z-10 p-10">
                        <h3 className="text-2xl font-black text-card-foreground mb-2">
                            {t("Ready to level up with AI?", "Sẵn sàng nâng cấp bản thân với AI?")}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-7">
                            {t("Every day you wait is a day someone else gets ahead.", "Mỗi ngày bỏ lỡ là một ngày người khác vượt qua bạn.")}
                        </p>
                        <Button asChild className="btn-primary border-0 text-white font-semibold rounded-xl px-8">
                            <a href="#courses">
                                {t("View All Courses", "Xem tất cả khóa học")} →
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
