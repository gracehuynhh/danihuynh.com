"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// Section keys
export const SECTIONS = ["hero", "about", "courses", "testimonials", "contact"] as const;
export type SectionId = typeof SECTIONS[number];

export const SECTION_LABELS: Record<SectionId, string> = {
    hero: "Hero",
    about: "Giới thiệu",
    courses: "Khóa học",
    testimonials: "Học viên nói gì",
    contact: "Liên hệ",
};

// Editable text keys per section
export const EDITABLE_KEYS: Record<SectionId, string[]> = {
    hero: ["hero_badge_vi", "hero_title_vi", "hero_subtitle_vi", "hero_badge_en", "hero_title_en", "hero_subtitle_en"],
    about: ["about_title_vi", "about_title_en", "about_desc_vi", "about_desc_en"],
    courses: [],
    testimonials: [],
    contact: ["contact_zalo_info", "contact_zalo_href", "contact_facebook_info", "contact_facebook_href", "contact_youtube_info", "contact_youtube_href", "contact_email_info", "contact_email_href"],
};

// Defaults for all settings
export const SETTING_DEFAULTS: Record<string, string> = {
    section_hero_visible: "true",
    section_about_visible: "true",
    section_courses_visible: "true",
    section_testimonials_visible: "true",
    section_contact_visible: "true",
    // hero
    hero_badge_vi: "MỞ ĐĂNG KÝ · 2026",
    hero_title_vi: "Kiếm Tiền với AI 2026",
    hero_subtitle_vi: "Khóa học AI thực chiến: Làm Web, YouTube & Vibecoding.",
    hero_badge_en: "NOW ENROLLING · 2026",
    hero_title_en: "Make Money with AI 2026",
    hero_subtitle_en: "Hands-on AI courses: Web Dev, YouTube & Vibecoding.",
    // about
    about_title_vi: "Về Dani",
    about_title_en: "About Dani",
    about_desc_vi: "Lập trình viên web và người tạo nội dung YouTube với hơn 5 năm kinh nghiệm.",
    about_desc_en: "Web developer and YouTube creator with 5+ years of experience.",
    // contact
    contact_zalo_info: "0325525300",
    contact_zalo_href: "https://zalo.me/0325525300",
    contact_facebook_info: "Dani Huynh",
    contact_facebook_href: "https://www.facebook.com/kizgman/",
    contact_youtube_info: "Dani Huynh",
    contact_youtube_href: "#",
    contact_email_info: "hello@danihuynh.com",
    contact_email_href: "mailto:hello@danihuynh.com",
};

interface SiteSettingsCtx {
    settings: Record<string, string>;
    loading: boolean;
    get: (key: string) => string;
    isSectionVisible: (section: SectionId) => boolean;
    update: (key: string, value: string) => Promise<void>;
    reload: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsCtx>({
    settings: SETTING_DEFAULTS,
    loading: true,
    get: (key) => SETTING_DEFAULTS[key] ?? "",
    isSectionVisible: () => true,
    update: async () => { },
    reload: () => { },
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Record<string, string>>(SETTING_DEFAULTS);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const { data, error } = await supabase.from("site_settings").select("key, value");
            if (!error && data && data.length > 0) {
                const map = { ...SETTING_DEFAULTS };
                data.forEach((r) => { map[r.key] = r.value; });
                setSettings(map);
            }
        } catch {
            // Table might not exist yet — use defaults
        }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const get = (key: string) => {
        if (key === "contact_facebook_href") return "https://www.facebook.com/kizgman/";
        return settings[key] ?? SETTING_DEFAULTS[key] ?? "";
    };

    const isSectionVisible = (section: SectionId) =>
        settings[`section_${section}_visible`] !== "false";

    const update = async (key: string, value: string) => {
        await supabase.from("site_settings")
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, get, isSectionVisible, update, reload: load }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}
