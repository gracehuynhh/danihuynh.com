"use client";

import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { useSiteSettings, SECTIONS, SectionId } from "@/context/SiteSettingsContext";

// Lazy load below-fold sections for faster initial paint

const Courses = lazy(() => import("@/components/Courses"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Contact = lazy(() => import("@/components/Contact"));
const YouTubeDashboard = lazy(() => import("@/components/YouTubeDashboard"));

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
    hero: Hero, courses: Courses,
    testimonials: Testimonials, contact: Contact,
};

const SectionSkeleton = () => (
    <div className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
            <div className="h-64 rounded-3xl bg-muted/50 animate-pulse" />
        </div>
    </div>
);

export default function HomePage() {
    const { isSectionVisible, get } = useSiteSettings();

    const orderStr = get("section_order");
    const savedOrder = orderStr ? orderStr.split(",").filter(Boolean) : [];
    const order = savedOrder.length > 0
        ? [...savedOrder, ...[...SECTIONS].filter(s => !savedOrder.includes(s))]
        : [...SECTIONS];

    return (
        <main>
            <Navbar />
            {order.map((sectionId) => {
                if (!isSectionVisible(sectionId as SectionId)) return null;
                const Component = SECTION_COMPONENTS[sectionId];
                if (!Component) return null;

                // Hero loads eagerly, everything else is lazy
                if (sectionId === "hero") return <Component key={sectionId} />;

                return (
                    <Suspense key={sectionId} fallback={<SectionSkeleton />}>
                        <Component />
                    </Suspense>
                );
            })}
            {/* YouTube Dashboard showcase */}
            <Suspense fallback={<SectionSkeleton />}>
                <YouTubeDashboard />
            </Suspense>
            <Footer />
        </main>
    );
}
