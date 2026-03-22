"use client";

import { Button } from "@/components/ui/button";

interface CourseCtaProps {
    ctaHref: string | null;
    ctaType: string;
    accent: string;
    isEn: boolean;
}

export function CourseCta({ ctaHref, ctaType, accent, isEn }: CourseCtaProps) {
    const handleClick = () => {
        if (ctaHref) {
            window.open(ctaHref, "_blank");
        } else {
            window.location.href = "/#contact";
        }
    };

    return (
        <Button
            onClick={handleClick}
            className="w-full rounded-xl font-bold text-white border-0 h-12 text-base"
            style={{ background: accent, boxShadow: `0 4px 20px ${accent}40` }}
        >
            {ctaType === "contact"
                ? (isEn ? "Contact Now →" : "Liên hệ ngay →")
                : (isEn ? "Enroll Now →" : "Đăng ký ngay →")}
        </Button>
    );
}
