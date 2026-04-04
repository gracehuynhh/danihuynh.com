"use client";

import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { useSiteSettings, SECTIONS, SectionId } from "@/context/SiteSettingsContext";

// Lazy load below-fold sections for faster initial paint
const About = lazy(() => import("@/components/About"));
const Courses = lazy(() => import("@/components/Courses"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Contact = lazy(() => import("@/components/Contact"));
const YouTubeDashboard = lazy(() => import("@/components/YouTubeDashboard"));

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
    hero: Hero, about: About, courses: Courses,
    testimonials: Testimonials, contact: Contact,
};

/* ─── Skeletons that match real layout dimensions to prevent CLS ─── */
const CoursesSkeleton = () => (
    <section className="py-8 px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent mb-6" />
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <div className="inline-block h-6 w-20 bg-muted/40 rounded-full mb-4" />
                <div className="h-12 w-72 bg-muted/30 rounded-xl mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl border border-border/30 bg-card p-6 space-y-4 h-[380px]">
                        <div className="flex justify-between items-start">
                            <div className="w-14 h-14 rounded-2xl bg-muted/40 animate-pulse" />
                            <div className="h-5 w-16 bg-muted/30 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 w-3/4 bg-muted/30 rounded-lg animate-pulse" />
                            <div className="h-4 w-1/2 bg-muted/20 rounded-lg" />
                        </div>
                        <div className="space-y-2 flex-1">
                            {[1, 2, 3].map(j => (
                                <div key={j} className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-muted/20 rounded-full" />
                                    <div className="h-3.5 flex-1 bg-muted/15 rounded-lg" />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <div className="h-5 w-12 bg-muted/20 rounded-lg" />
                            <div className="h-9 w-20 bg-muted/30 rounded-xl animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TestimonialsSkeleton = () => (
    <section className="py-8 px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent mb-6" />
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-block h-6 w-28 bg-muted/40 rounded-full mb-4" />
                <div className="h-12 w-64 bg-muted/30 rounded-xl mx-auto" />
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {[160, 140, 180, 150, 170, 145].map((h, i) => (
                    <div key={i} className="rounded-2xl border border-border/30 bg-card animate-pulse break-inside-avoid" style={{ height: h }} />
                ))}
            </div>
        </div>
    </section>
);

const ContactSkeleton = () => (
    <section className="py-8 px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent mb-6" />
        <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block h-6 w-16 bg-muted/40 rounded-full mb-4" />
            <div className="h-12 w-56 bg-muted/30 rounded-xl mx-auto mb-7" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-2xl border border-border/30 bg-card h-[120px] animate-pulse" />
                ))}
            </div>
        </div>
    </section>
);

const AboutSkeleton = () => (
    <section className="py-14 px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent mb-12" />
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
                <div className="w-52 h-52 rounded-full bg-muted/30 animate-pulse" />
            </div>
            <div className="space-y-4">
                <div className="h-6 w-16 bg-muted/40 rounded-full" />
                <div className="h-12 w-56 bg-muted/30 rounded-xl" />
                <div className="h-16 w-full bg-muted/20 rounded-lg" />
                <div className="h-12 w-full bg-muted/15 rounded-xl" />
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-muted/20 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const DashboardSkeleton = () => (
    <section className="pt-4 pb-8 px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent mb-6" />
        <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border bg-card h-[460px] animate-pulse" />
        </div>
    </section>
);

const SKELETON_MAP: Record<string, React.ComponentType> = {
    about: AboutSkeleton,
    courses: CoursesSkeleton,
    testimonials: TestimonialsSkeleton,
    contact: ContactSkeleton,
};

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

                // Hero loads eagerly, no skeleton
                if (sectionId === "hero") return <Component key={sectionId} />;

                const Skeleton = SKELETON_MAP[sectionId] || CoursesSkeleton;
                return (
                    <Suspense key={sectionId} fallback={<Skeleton />}>
                        <Component />
                    </Suspense>
                );
            })}
            {/* YouTube Dashboard showcase */}
            <Suspense fallback={<DashboardSkeleton />}>
                <YouTubeDashboard />
            </Suspense>
            <Footer />
        </main>
    );
}
