"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, Tag, Share2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/hooks/useAdmin";
import { use } from "react";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    category: string;
    tags: string[];
    author_name: string;
    author_avatar: string | null;
    is_featured: boolean;
    read_time: number;
    published_at: string;
    updated_at: string;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { isAdmin } = useAdmin();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", slug)
                .eq("status", "published")
                .single();
            setPost(data);
            setLoading(false);
        })();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-3xl mx-auto px-6 pt-32 space-y-4">
                    <div className="h-8 w-2/3 bg-muted animate-pulse rounded-xl" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded-xl" />
                    <div className="h-4 w-5/6 bg-muted animate-pulse rounded-xl" />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-6xl mb-4">📄</p>
                    <h1 className="text-2xl font-black mb-2">Không tìm thấy bài viết</h1>
                    <Link href="/blog" className="text-sm text-primary hover:underline">← Về danh sách blog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-28 pb-20">
                {/* Cover */}
                {post.cover_image && (
                    <div className="max-w-5xl mx-auto px-6 mb-10">
                        <div className="rounded-3xl overflow-hidden h-[400px]">
                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {/* Article */}
                <div className="max-w-3xl mx-auto px-6">
                    <div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                            <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Blog
                            </Link>
                            <span>/</span>
                            <span className="text-foreground truncate">{post.title}</span>
                        </div>

                        {/* Category + Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 font-semibold">
                                {post.category}
                            </Badge>
                            {post.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-4">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6 border-l-2 border-primary/30 pl-4">
                            {post.excerpt}
                        </p>

                        {/* Meta row */}
                        <div className="flex items-center gap-4 pb-6 border-b border-border mb-8">
                            <div className="flex items-center gap-2.5">
                                {post.author_avatar ? (
                                    <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                                        {post.author_name[0]}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{post.author_name}</p>
                                    <p className="text-[11px] text-muted-foreground">{formatDate(post.published_at)}</p>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> {post.read_time} phút đọc
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    className="flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                    <Share2 className="w-3.5 h-3.5" /> Chia sẻ
                                </button>
                                {isAdmin && (
                                    <Link href={`/admin?tab=blog&edit=${post.id}`}
                                        className="flex items-center gap-1 text-amber-600 hover:text-amber-700">
                                        <Pencil className="w-3.5 h-3.5" /> Sửa
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Content — WordPress-style prose */}
                        <div
                            className="prose prose-neutral dark:prose-invert max-w-none
                                prose-headings:font-black prose-headings:text-foreground
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-[15px]
                                prose-strong:text-foreground prose-strong:font-bold
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-ul:text-muted-foreground prose-li:my-1
                                prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
                                prose-pre:bg-muted prose-pre:rounded-xl
                                prose-img:rounded-2xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Back link */}
                        <div className="mt-16 pt-8 border-t border-border">
                            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                                <ArrowLeft className="w-4 h-4" /> Về danh sách bài viết
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
