"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LangContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Tag, ArrowRight, Star, Search, Rss } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string | null;
    category: string;
    tags: string[];
    author_name: string;
    author_avatar: string | null;
    is_featured: boolean;
    read_time: number;
    published_at: string;
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Hôm qua";
    if (days < 30) return `${days} ngày trước`;
    if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
    return `${Math.floor(days / 365)} năm trước`;
}

function PostCard({ post, index, featured }: { post: Post; index: number; featured?: boolean }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <motion.article
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group"
        >
            <Link href={`/blog/${post.slug}`} className="block">
                <div className={`bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 ${featured ? "md:grid md:grid-cols-2 md:min-h-[320px]" : ""}`}>
                    {/* Cover */}
                    <div className={`relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 ${featured ? "md:min-h-[320px]" : "h-48"}`}>
                        {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-6xl opacity-20">✍️</div>
                            </div>
                        )}
                        {post.is_featured && (
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-amber-500 text-white border-0 text-[10px] font-bold gap-1">
                                    <Star className="w-2.5 h-2.5 fill-white" /> Nổi bật
                                </Badge>
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="text-[10px] bg-background/80 backdrop-blur-sm border-0">
                                {post.category}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className={`p-5 flex flex-col justify-between ${featured ? "md:p-8" : ""}`}>
                        <div>
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {post.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h2 className={`font-black text-card-foreground group-hover:text-primary transition-colors leading-tight mb-2 ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
                                {post.title}
                            </h2>

                            {/* Excerpt */}
                            <p className={`text-muted-foreground leading-relaxed ${featured ? "text-sm md:text-base" : "text-sm"} line-clamp-3`}>
                                {post.excerpt}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2">
                                {post.author_avatar ? (
                                    <img src={post.author_avatar} alt={post.author_name}
                                        className="w-7 h-7 rounded-full object-cover" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-[10px] font-bold">
                                        {post.author_name[0]}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-semibold text-foreground">{post.author_name}</p>
                                    <p className="text-[10px] text-muted-foreground">{timeAgo(post.published_at)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{post.read_time} phút
                                </span>
                                <span className="flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                                    Đọc <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from("blog_posts")
                .select("id,title,slug,excerpt,cover_image,category,tags,author_name,author_avatar,is_featured,read_time,published_at")
                .eq("status", "published")
                .order("published_at", { ascending: false });
            setPosts(data || []);
            setLoading(false);
        })();
    }, []);

    const allTags = [...new Set(posts.flatMap(p => p.tags))];

    const filtered = posts.filter(p => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
        const matchTag = !activeTag || p.tags.includes(activeTag);
        return matchSearch && matchTag;
    });

    const featured = filtered.find(p => p.is_featured);
    const rest = filtered.filter(p => !p.is_featured || filtered.indexOf(p) > 0);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">

                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
                    <Badge variant="outline" className="mb-4 rounded-full border-primary/25 bg-primary/8 text-primary text-[11px] font-semibold uppercase tracking-widest px-3">
                        <Rss className="w-3 h-3 mr-1" /> Blog
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3">
                        Kiến thức &{" "}
                        <span className="gradient-text">Kinh nghiệm</span>
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        Chia sẻ thực chiến về AI, YouTube Marketing và Web Development từ người đã làm.
                    </p>
                </motion.div>

                {/* Search + Tags */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm bài viết..."
                            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => setActiveTag(null)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${!activeTag ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                            Tất cả
                        </button>
                        {allTags.slice(0, 5).map(tag => (
                            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeTag === tag ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                                #{tag}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Posts */}
                {loading ? (
                    <div className="grid md:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="rounded-2xl border border-border bg-card animate-pulse h-72" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-sm">Không tìm thấy bài viết nào.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Featured post */}
                        {featured && !search && !activeTag && (
                            <PostCard post={featured} index={0} featured />
                        )}

                        {/* Rest as grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {(featured && !search && !activeTag ? rest : filtered).map((post, i) => (
                                <PostCard key={post.id} post={post} index={i} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
