"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Eye, Clock, Users, TrendingUp, BarChart3,
    Play, ArrowUpRight, Youtube, DollarSign,
    Wallet, PiggyBank, Trophy, Zap
} from "lucide-react";
import { useLang } from "@/context/LangContext";

/* ─── Analytics Data ─── */
const channelStats = [
    {
        label: "Views", labelVi: "Lượt xem", value: "4.5M", icon: Eye, change: "+154%",
        detail: "vs previous 28 days", detailVi: "so với 28 ngày trước",
        breakdown: [
            { label: "Organic search", labelVi: "Tìm kiếm tự nhiên", value: "2.1M" },
            { label: "Suggested videos", labelVi: "Đề xuất", value: "1.8M" },
            { label: "External", labelVi: "Bên ngoài", value: "600K" },
        ]
    },
    {
        label: "Watch time (hours)", labelVi: "Giờ xem", value: "239.2K", icon: Clock, change: "+136%",
        detail: "136% more than previous 28 days", detailVi: "tăng 136% so với kỳ trước",
        breakdown: [
            { label: "Long-form", labelVi: "Video dài", value: "198K" },
            { label: "Shorts", labelVi: "Shorts", value: "41.2K" },
        ]
    },
    {
        label: "Subscribers", labelVi: "Người đăng ký", value: "47.5K", icon: Users, change: "+28%",
        detail: "+10,400 in last 28 days", detailVi: "+10,400 trong 28 ngày",
        breakdown: [
            { label: "From videos", labelVi: "Từ video", value: "+8.2K" },
            { label: "From channel page", labelVi: "Từ trang kênh", value: "+2.2K" },
        ]
    },
    {
        label: "Unique viewers", labelVi: "Người xem", value: "1.9M", icon: TrendingUp, change: "+98%",
        detail: "98% more than previous 28 days", detailVi: "tăng 98% so với kỳ trước",
        breakdown: [
            { label: "Returning", labelVi: "Quay lại", value: "420K" },
            { label: "New", labelVi: "Mới", value: "1.48M" },
        ]
    },
];

const topContent = [
    { title: "Video #1 — Trending Topic", views: "248,972", hours: "18.2K hrs" },
    { title: "Video #2 — AI Tutorial Series", views: "41,236", hours: "3.1K hrs" },
    { title: "Video #3 — Growth Strategy", views: "33,172", hours: "2.4K hrs" },
];

const chartData = [30, 25, 28, 22, 35, 40, 55, 60, 50, 65, 80, 95, 88, 100];
const chartLabels = ["Feb 25", "Feb 28", "Mar 2", "Mar 5", "Mar 8", "Mar 11", "Mar 14", "Mar 17", "Mar 20", "Mar 24"];

/* ─── Earnings Data ─── */
const earningStats = [
    {
        label: "Estimated revenue", labelVi: "Doanh thu ước tính", value: "$12,480",
        icon: DollarSign, change: "+187%", color: "#10b981",
        detail: "Revenue from ads, memberships & Super Chat", detailVi: "Từ quảng cáo, membership và Super Chat"
    },
    {
        label: "RPM", labelVi: "RPM", value: "$2.77",
        icon: Zap, change: "+22%", color: "#f59e0b",
        detail: "Revenue per 1,000 impressions", detailVi: "Doanh thu mỗi 1,000 lượt hiển thị"
    },
    {
        label: "CPM", labelVi: "CPM", value: "$4.85",
        icon: Trophy, change: "+15%", color: "#8b5cf6",
        detail: "Cost per 1,000 ad impressions", detailVi: "Chi phí mỗi 1,000 lượt quảng cáo"
    },
    {
        label: "Memberships", labelVi: "Thành viên", value: "$1,240",
        icon: PiggyBank, change: "+45%", color: "#3b82f6",
        detail: "Monthly recurring from members", detailVi: "Thu nhập hàng tháng từ thành viên"
    },
];

const revenueChart = [15, 18, 22, 20, 30, 35, 42, 50, 45, 58, 72, 85, 80, 100];

const monthlyEarnings = [
    { month: "Oct 2025", value: "$3,200" },
    { month: "Nov 2025", value: "$4,800" },
    { month: "Dec 2025", value: "$6,900" },
    { month: "Jan 2026", value: "$8,400" },
    { month: "Feb 2026", value: "$10,100" },
    { month: "Mar 2026", value: "$12,480" },
];

/* ─── Tooltip Stat Card ─── */
function StatCard({ stat, index }: {
    stat: typeof channelStats[0] | typeof earningStats[0];
    index: number;
}) {
    const { t } = useLang();
    const [hovered, setHovered] = useState(false);
    const hasBreakdown = "breakdown" in stat;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={`rounded-xl border bg-background p-3.5 transition-all duration-200 cursor-default
                ${hovered ? "border-primary/30 shadow-md shadow-primary/5" : "border-border/50"}`}>
                <div className="flex items-center gap-2 mb-1.5">
                    <stat.icon className="w-3.5 h-3.5 text-muted-foreground/50" />
                    <span className="text-[11px] text-muted-foreground">{t(stat.label, stat.labelVi)}</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-card-foreground">{stat.value}</span>
                    <span className="text-[10px] font-semibold text-emerald-500 mb-1">{stat.change}</span>
                </div>
                {stat.detail && (
                    <p className="text-[9px] text-muted-foreground/40 mt-1">{t(stat.detail, stat.detailVi)}</p>
                )}
            </div>

            <AnimatePresence>
                {hovered && hasBreakdown && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1.5 z-20 rounded-xl border border-border bg-card shadow-xl p-3"
                    >
                        <p className="text-[10px] font-semibold text-card-foreground mb-2">
                            {t("Breakdown", "Chi tiết")}
                        </p>
                        <div className="space-y-1.5">
                            {(stat as typeof channelStats[0]).breakdown.map((b, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground">{t(b.label, b.labelVi)}</span>
                                    <span className="text-[10px] font-bold text-card-foreground">{b.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── Chart Component ─── */
function AreaChart({
    data, color = "99,102,241", gradientId, label, labelVi
}: {
    data: number[]; color?: string; gradientId: string; label: string; labelVi: string;
}) {
    const { t } = useLang();
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    return (
        <div className="rounded-xl border border-border/50 bg-background p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5" style={{ color: `rgb(${color})` }} />
                    <span className="text-xs font-semibold text-card-foreground">{t(label, labelVi)}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/40">Feb 25 – Mar 24, 2026</span>
            </div>

            <div className="h-[120px] w-full relative" onMouseLeave={() => setHoveredPoint(null)}>
                <svg className="w-full h-full" viewBox="0 0 280 100" preserveAspectRatio="none">
                    {[0, 25, 50, 75].map(y => (
                        <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.5" />
                    ))}
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={`rgb(${color})`} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={`rgb(${color})`} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M0,${100 - data[0]} ${data.map((v, i) => `L${(i * 280) / (data.length - 1)},${100 - v}`).join(" ")} L280,100 L0,100 Z`}
                        fill={`url(#${gradientId})`}
                    />
                    <path
                        d={`M0,${100 - data[0]} ${data.map((v, i) => `L${(i * 280) / (data.length - 1)},${100 - v}`).join(" ")}`}
                        fill="none"
                        stroke={`rgb(${color})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {data.map((v, i) => {
                        const cx = (i * 280) / (data.length - 1);
                        const cy = 100 - v;
                        return (
                            <g key={i}>
                                <rect
                                    x={cx - 10} y={0} width={20} height={100}
                                    fill="transparent"
                                    onMouseEnter={() => setHoveredPoint(i)}
                                    style={{ cursor: "crosshair" }}
                                />
                                {hoveredPoint === i && (
                                    <>
                                        <line x1={cx} y1={0} x2={cx} y2={100} stroke={`rgb(${color})`} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3,3" />
                                        <circle cx={cx} cy={cy} r="4" fill={`rgb(${color})`} stroke="white" strokeWidth="2" />
                                    </>
                                )}
                            </g>
                        );
                    })}
                </svg>

                <AnimatePresence>
                    {hoveredPoint !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-0 bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-lg pointer-events-none z-10"
                            style={{
                                left: `${(hoveredPoint / (data.length - 1)) * 100}%`,
                                transform: "translateX(-50%)",
                            }}
                        >
                            <p className="text-[9px] text-muted-foreground">{chartLabels[Math.min(hoveredPoint, chartLabels.length - 1)]}</p>
                            <p className="text-xs font-bold text-card-foreground">{Math.round(data[hoveredPoint] * 45)}K</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-muted-foreground/30 -mr-1">
                    <span>300K</span><span>200K</span><span>100K</span><span>0</span>
                </div>
            </div>

            <div className="flex justify-between mt-2 px-1">
                {chartLabels.filter((_, i) => i % 3 === 0).map(l => (
                    <span key={l} className="text-[9px] text-muted-foreground/30">{l}</span>
                ))}
            </div>
        </div>
    );
}

/* ─── Tab definitions ─── */
const TABS = [
    { key: "overview", label: "Overview", labelVi: "Tổng quan" },
    { key: "revenue", label: "Revenue", labelVi: "Doanh thu" },
] as const;

type TabKey = typeof TABS[number]["key"];

/* ─── Main Component ─── */
export default function YouTubeDashboard() {
    const { t } = useLang();
    const [activeTab, setActiveTab] = useState<TabKey>("overview");

    return (
        <section className="pt-4 pb-8 px-6">
            <div className="section-divider mb-6" />
            <div className="max-w-5xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
                >
                    {/* ── Top bar with tabs ── */}
                    <div className="flex items-center gap-3 px-5 py-2.5 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                <Play className="w-2.5 h-2.5 text-white fill-white" />
                            </div>
                            <span className="text-xs font-bold text-card-foreground">Studio</span>
                        </div>
                        <Separator orientation="vertical" className="h-4 bg-border/50" />
                        <span className="text-[11px] text-muted-foreground">{t("Channel analytics", "Phân tích kênh")}</span>
                        <div className="flex-1" />

                        {/* Tab buttons */}
                        <div className="flex items-center gap-0.5 rounded-lg bg-background/60 p-0.5 border border-border/40">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`relative text-[11px] px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer
                                        ${activeTab === tab.key
                                            ? "font-semibold text-card-foreground shadow-sm bg-card"
                                            : "text-muted-foreground/50 hover:text-muted-foreground"
                                        }`}
                                >
                                    {t(tab.label, tab.labelVi)}
                                </button>
                            ))}
                        </div>

                        <Badge variant="outline" className="text-[9px] rounded-md px-2 py-0.5 text-muted-foreground ml-1">
                            {activeTab === "overview" ? t("Last 28 days", "28 ngày") : t("Last 6 months", "6 tháng")}
                        </Badge>
                    </div>

                    {/* ── Tab content ── */}
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col lg:flex-row"
                            >
                                {/* Main */}
                                <div className="flex-1 p-5 md:p-6 space-y-5">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {channelStats.map((stat, i) => (
                                            <StatCard key={stat.label} stat={stat} index={i} />
                                        ))}
                                    </div>
                                    <AreaChart data={chartData} gradientId="viewsGrad" label="Views Overview" labelVi="Tổng quan lượt xem" />
                                </div>

                                {/* Sidebar */}
                                <div className="lg:w-[240px] border-t lg:border-t-0 lg:border-l border-border p-5">
                                    {/* Realtime */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[11px] font-semibold text-card-foreground">Realtime</span>
                                        </div>
                                        <div className="text-3xl font-black text-card-foreground">475,200</div>
                                        <p className="text-[10px] text-muted-foreground/50">{t("Subscribers", "Người đăng ký")}</p>
                                        <div className="flex items-end gap-px h-8 mt-2.5">
                                            {Array.from({ length: 28 }, (_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="flex-1 rounded-[2px] bg-primary/25"
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${15 + Math.random() * 85}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.3, delay: i * 0.02 }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-[8px] text-muted-foreground/25 mt-1">
                                            <span>-48h</span><span>{t("Now", "Hiện tại")}</span>
                                        </div>
                                    </div>

                                    <Separator className="bg-border/40 mb-4" />

                                    {/* Top content */}
                                    <div>
                                        <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide">
                                            {t("Top content", "Nội dung hàng đầu")}
                                        </span>
                                        <div className="mt-2.5 space-y-2">
                                            {topContent.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 group cursor-default hover:bg-muted/40 rounded-lg p-1 -ml-1 transition-colors"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                                        <Play className="w-2.5 h-2.5 text-muted-foreground/40" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-medium text-card-foreground truncate">{item.title}</p>
                                                        <p className="text-[9px] text-muted-foreground/40">{item.views} {t("views", "lượt xem")}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="revenue"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col lg:flex-row"
                            >
                                {/* Main */}
                                <div className="flex-1 p-5 md:p-6 space-y-5">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {earningStats.map((stat, i) => (
                                            <StatCard key={stat.label} stat={stat} index={i} />
                                        ))}
                                    </div>
                                    <AreaChart
                                        data={revenueChart}
                                        color="16,185,129"
                                        gradientId="revenueGrad"
                                        label="Revenue Trend"
                                        labelVi="Xu hướng doanh thu"
                                    />
                                </div>

                                {/* Sidebar — Monthly earnings */}
                                <div className="lg:w-[240px] border-t lg:border-t-0 lg:border-l border-border p-5">
                                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wide">
                                        {t("Monthly earnings", "Thu nhập hàng tháng")}
                                    </span>
                                    <div className="mt-3 space-y-2">
                                        {monthlyEarnings.map((m, i) => (
                                            <div
                                                key={m.month}
                                                className="flex items-center justify-between group cursor-default hover:bg-muted/40 rounded-lg p-1.5 -ml-1.5 transition-colors"
                                            >
                                                <span className="text-[11px] text-muted-foreground">{m.month}</span>
                                                <span className="text-[11px] font-bold text-card-foreground">{m.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator className="bg-border/40 my-4" />

                                    {/* Growth indicator */}
                                    <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/15 p-3">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-[11px] font-bold text-emerald-600">+290%</span>
                                        </div>
                                        <p className="text-[10px] text-emerald-600/70">
                                            {t("Growth over 6 months", "Tăng trưởng trong 6 tháng")}
                                        </p>
                                    </div>

                                    <Separator className="bg-border/40 my-4" />

                                    {/* CTA */}
                                    <Button
                                        asChild
                                        className="w-full rounded-xl text-xs font-semibold gap-1.5 btn-primary border-0 text-white"
                                    >
                                        <a href="#courses">
                                            {t("Start Your Journey", "Bắt đầu hành trình")}
                                            <ArrowUpRight className="w-3 h-3" />
                                        </a>
                                    </Button>
                                    <p className="text-[9px] text-muted-foreground/30 text-center mt-2">
                                        {t("Learn how to monetize with AI", "Học cách kiếm tiền với AI")}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Subtle note */}
                <p className="text-center text-muted-foreground/25 text-[10px] mt-4">
                    {t("* Based on actual channel performance · Results vary by effort & niche",
                       "* Dựa trên hiệu suất thực tế · Kết quả tùy thuộc nỗ lực và niche")}
                </p>
            </div>
        </section>
    );
}
