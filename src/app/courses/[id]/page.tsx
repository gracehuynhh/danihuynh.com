import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CourseDetailClient from "@/components/CourseDetailClient";

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CourseDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ lang?: string }>;
}) {
    const { id } = await params;
    const { lang } = await searchParams;
    const isEn = lang === "en";

    let course = null;

    if (id === "shopee-affiliate") {
        course = {
            id: "shopee-affiliate",
            title_vi: "Shopee Affiliate",
            title_en: "Shopee Affiliate",
            subtitle_vi: "Cơ bản đến Chuyên Sâu",
            subtitle_en: "Basic to Advanced",
            desc_vi: "Quy trình làm Affiliate bền vững trên Shopee",
            desc_en: "Sustainable Affiliate process on Shopee",
            badge_vi: "MỚI",
            badge_en: "NEW",
            accent_color: "#f97316",
            icon_name: "Globe",
            price_vi: "1999K",
            price_en: "1999K",
            duration: "3 clips",
            rating: "4.9",
            ai_label_vi: "Quy trình chuẩn",
            ai_label_en: "Standard Process",
            cta_type: "enroll",
            cta_href: null,
            is_featured: false,
            is_visible: true,
            features_vi: [
                "Học qua Google Meet 3 buổi",
                "Quy trình chuẩn hóa, có thể mở rộng",
                "Triển khai không lộ mặt"
            ],
            features_en: [
                "3 Google Meet sessions",
                "Standardized, scalable process",
                "Faceless execution"
            ],
            sort_order: 4
        };
    } else {
        const { data, error } = await supabaseServer
            .from("courses")
            .select("*")
            .eq("id", id)
            .eq("is_visible", true)
            .single();
        if (error || !data) return notFound();
        course = data;
    }

    // Apply the same mutations as Courses.tsx
    if (course.id === "youtube-basic" || course.id === "youtube-advanced") {
        course.badge_vi = "HOT";
        course.badge_en = "HOT";
    }

    if (course.id === "youtube-basic") {
        course.price_vi = "1999K";
        course.price_en = "1999K";
    }

    if (course.id === "youtube-advanced") {
        course.price_vi = null;
        course.price_en = null;
        course.features_vi = course.features_vi.map((f: string) =>
            f.replace("doanh thu 30 triệu/tháng", "đầu ra").replace("doanh thu", "đầu ra")
        );
        course.features_vi = course.features_vi.map((f: string) =>
            f.replace("Đảm bảo doanh thu 30 triệu/tháng", "Đảm bảo đầu ra")
        );
    }

    if (course.id === "vibecoding") {
        if (!course.features_vi.some((f: string) => f.includes("mở rộng"))) {
            course.features_vi.push("Quy trình chuẩn hóa, có thể mở rộng");
            course.features_en.push("Standardized, scalable process");
        }
    }

    // Groups
    course.features_vi = course.features_vi.filter((f: string) => !f.toLocaleLowerCase().includes("nhóm"));
    course.features_en = course.features_en.filter((f: string) => !f.toLocaleLowerCase().includes("group"));

    if (course.id === "youtube-basic" || course.id === "youtube-advanced" || course.id === "shopee-affiliate") {
        course.features_vi.push("Vào nhóm riêng hỗ trợ & Cập nhật key");
        course.features_en.push("Private support group & Key updates");
    } else {
        course.features_vi.push("Vào nhóm riêng hỗ trợ");
        course.features_en.push("Private group for support");
    }

    course.cta_type = course.price_vi ? "enroll" : "contact";

    return <CourseDetailClient course={course} isEn={isEn} />;
}
