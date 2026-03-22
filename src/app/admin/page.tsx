"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles, LogOut, Users, KeyRound, Video, LayoutDashboard, BookOpen, FileText,
    Plus, Trash2, Pencil, Check, X, ShieldAlert, ExternalLink,
    ShieldCheck, RotateCcw, Eye, EyeOff, GripVertical, Star
} from "lucide-react";
import { useSiteSettings, SECTIONS, SECTION_LABELS, EDITABLE_KEYS } from "@/context/SiteSettingsContext";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    useSortable, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Profile {
    id: string; email: string | null; is_admin: boolean; banned: boolean; created_at: string;
}
interface ActivationCode {
    id: string; code: string; course_id: string; max_uses: number;
    used_count: number; is_active: boolean; expires_at: string | null; created_at: string;
}
interface CourseVideo {
    id: string; course_id: string; lesson_number: number;
    title_vi: string; video_url: string; duration: string | null;
}

const COURSES = ["youtube-basic", "youtube-advanced", "vibecoding"];
const COURSE_LABELS: Record<string, string> = {
    "youtube-basic": "YouTube Basic", "youtube-advanced": "YouTube Advanced", "vibecoding": "Vibecoding",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function genCode(courseId: string) {
    const prefix = { "youtube-basic": "YTB", "youtube-advanced": "YTA", "vibecoding": "VBC" }[courseId] || "KEY";
    return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${new Date().getFullYear()}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Users Tab
function UsersTab() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_all_profiles");
        if (error) console.error("[UsersTab]", error.message);
        setProfiles(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const toggle = async (id: string, field: "banned" | "is_admin", current: boolean) => {
        const payload = field === "banned"
            ? { target_id: id, new_banned: !current }
            : { target_id: id, new_is_admin: !current };
        await supabase.rpc("admin_update_profile", payload);
        setProfiles(p => p.map(u => u.id === id ? { ...u, [field]: !current } : u));
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">{profiles.length} tài khoản</p>
                <Button variant="ghost" size="sm" onClick={load} className="text-muted-foreground">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Làm mới
                </Button>
            </div>
            {profiles.map(u => (
                <div key={u.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${u.banned ? "border-red-200 bg-red-50/50" : "border-border bg-card"}`}>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-foreground truncate">{u.email || "—"}</p>
                            {u.is_admin && <Badge className="text-[9px] bg-amber-100 text-amber-700 border-amber-200 rounded-full">Admin</Badge>}
                            {u.banned && <Badge className="text-[9px] bg-red-100 text-red-600 border-red-200 rounded-full">Banned</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(u.created_at).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3 shrink-0">
                        <Button
                            variant="ghost" size="sm"
                            onClick={() => toggle(u.id, "is_admin", u.is_admin)}
                            className={`h-7 px-2 text-[10px] rounded-lg ${u.is_admin ? "text-amber-600 hover:bg-amber-50" : "text-muted-foreground hover:text-amber-600"}`}
                            title={u.is_admin ? "Bỏ admin" : "Đặt admin"}
                        >
                            {u.is_admin ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                            variant="ghost" size="sm"
                            onClick={() => toggle(u.id, "banned", u.banned)}
                            className={`h-7 px-2 text-[10px] rounded-lg ${u.banned ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"}`}
                            title={u.banned ? "Bỏ ban" : "Ban user"}
                        >
                            {u.banned ? "Unban" : "Ban"}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Keys Tab
function KeysTab() {
    const [codes, setCodes] = useState<ActivationCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ course_id: "youtube-basic", max_uses: 1, expires_at: "" });

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from("activation_codes").select("*").order("created_at", { ascending: false });
        setCodes(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const create = async () => {
        setCreating(true);
        const code = genCode(form.course_id);
        const payload: Record<string, unknown> = {
            code, course_id: form.course_id, max_uses: form.max_uses, is_active: true
        };
        if (form.expires_at) payload.expires_at = form.expires_at;
        const { data } = await supabase.from("activation_codes").insert(payload).select().single();
        if (data) setCodes(prev => [data, ...prev]);
        setCreating(false);
    };

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from("activation_codes").update({ is_active: !current }).eq("id", id);
        setCodes(p => p.map(c => c.id === id ? { ...c, is_active: !current } : c));
    };

    const remove = async (id: string) => {
        if (!confirm("Xoá mã này?")) return;
        await supabase.from("activation_codes").delete().eq("id", id);
        setCodes(p => p.filter(c => c.id !== id));
    };

    return (
        <div>
            {/* Create form */}
            <Card className="border-border bg-card rounded-2xl mb-5">
                <CardContent className="p-5">
                    <p className="text-sm font-bold text-foreground mb-3">Tạo mã mới</p>
                    <div className="grid sm:grid-cols-3 gap-3 mb-3">
                        <div>
                            <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Khóa học</label>
                            <select
                                value={form.course_id}
                                onChange={e => setForm({ ...form, course_id: e.target.value })}
                                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                            >
                                {COURSES.map(c => <option key={c} value={c}>{COURSE_LABELS[c]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Số lượt dùng</label>
                            <input
                                type="number" min={1}
                                value={form.max_uses}
                                onChange={e => setForm({ ...form, max_uses: parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Hết hạn (tuỳ chọn)</label>
                            <input
                                type="date"
                                value={form.expires_at}
                                onChange={e => setForm({ ...form, expires_at: e.target.value })}
                                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={create} disabled={creating}
                        className="btn-primary border-0 text-white text-sm font-semibold rounded-xl px-5"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        {creating ? "Đang tạo..." : "Tạo mã"}
                    </Button>
                </CardContent>
            </Card>

            {/* List */}
            {loading ? <Spinner /> : (
                <div className="space-y-2">
                    {codes.map(c => (
                        <div key={c.id} className={`flex items-center gap-3 p-3.5 rounded-xl border ${c.is_active ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"}`}>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <code className="text-xs font-mono font-bold text-foreground">{c.code}</code>
                                    <Badge variant="outline" className={`text-[9px] rounded-full ${c.is_active ? "text-green-600 border-green-200 bg-green-50" : "text-red-500 border-red-200 bg-red-50"}`}>
                                        {c.is_active ? "Đang hoạt động" : "Đã tắt"}
                                    </Badge>
                                    <Badge variant="outline" className="text-[9px] rounded-full text-primary border-primary/20 bg-primary/8">
                                        {COURSE_LABELS[c.course_id] || c.course_id}
                                    </Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {c.used_count}/{c.max_uses} lượt
                                    {c.expires_at ? ` · Hết hạn ${new Date(c.expires_at).toLocaleDateString("vi-VN")}` : ""}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => toggleActive(c.id, c.is_active)}
                                    className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground rounded-lg">
                                    {c.is_active ? "Tắt" : "Bật"}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => remove(c.id)}
                                    className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Videos Tab
function VideosTab() {
    const [courseId, setCourseId] = useState("youtube-basic");
    const [videos, setVideos] = useState<CourseVideo[]>([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ title_vi: "", video_url: "", duration: "" });
    const [addingNew, setAddingNew] = useState(false);
    const [newForm, setNewForm] = useState({ title_vi: "", video_url: "", duration: "" });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from("course_videos").select("*")
            .eq("course_id", courseId).order("lesson_number");
        setVideos(data || []);
        setLoading(false);
        setEditId(null);
    }, [courseId]);

    useEffect(() => { load(); }, [load]);

    const startEdit = (v: CourseVideo) => {
        setEditId(v.id);
        setEditForm({ title_vi: v.title_vi, video_url: v.video_url, duration: v.duration || "" });
    };

    const saveEdit = async (v: CourseVideo) => {
        setSaving(true);
        await supabase.from("course_videos").update(editForm).eq("id", v.id);
        setVideos(p => p.map(x => x.id === v.id ? { ...x, ...editForm } : x));
        setSaving(false); setEditId(null);
    };

    const remove = async (id: string) => {
        if (!confirm("Xoá bài này?")) return;
        await supabase.from("course_videos").delete().eq("id", id);
        setVideos(p => p.filter(v => v.id !== id));
    };

    const addNew = async () => {
        setSaving(true);
        const next = videos.length > 0 ? Math.max(...videos.map(v => v.lesson_number)) + 1 : 1;
        const { data } = await supabase.from("course_videos").insert({
            ...newForm, course_id: courseId, lesson_number: next
        }).select().single();
        if (data) setVideos(p => [...p, data]);
        setNewForm({ title_vi: "", video_url: "", duration: "" });
        setAddingNew(false);
        setSaving(false);
    };

    return (
        <div>
            {/* Course picker */}
            <div className="flex gap-2 mb-5">
                {COURSES.map(c => (
                    <button key={c} onClick={() => setCourseId(c)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${courseId === c ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        {COURSE_LABELS[c]}
                    </button>
                ))}
            </div>

            {loading ? <Spinner /> : (
                <div className="space-y-2">
                    {videos.map(v => (
                        <div key={v.id} className="border border-border bg-card rounded-xl p-4">
                            {editId === v.id ? (
                                <div className="space-y-2">
                                    <input value={editForm.title_vi} onChange={e => setEditForm({ ...editForm, title_vi: e.target.value })}
                                        placeholder="Tên bài học" className={inputClass} />
                                    <input value={editForm.video_url} onChange={e => setEditForm({ ...editForm, video_url: e.target.value })}
                                        placeholder="YouTube embed URL" className={inputClass} />
                                    <input value={editForm.duration} onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
                                        placeholder="Thời lượng (vd: 15:30)" className={inputClass} />
                                    <div className="flex gap-2 pt-1">
                                        <Button onClick={() => saveEdit(v)} disabled={saving} size="sm"
                                            className="btn-primary border-0 text-white text-xs rounded-lg h-7 px-3">
                                            <Check className="w-3.5 h-3.5 mr-1" />{saving ? "..." : "Lưu"}
                                        </Button>
                                        <Button onClick={() => setEditId(null)} variant="ghost" size="sm"
                                            className="text-muted-foreground text-xs rounded-lg h-7 px-3">
                                            <X className="w-3.5 h-3.5 mr-1" />Huỷ
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <span className="text-[10px] font-bold text-muted-foreground w-5 mt-0.5 shrink-0">
                                        {String(v.lesson_number).padStart(2, "0")}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{v.title_vi}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{v.video_url}</p>
                                        {v.duration && <p className="text-[10px] text-primary mt-0.5">{v.duration}</p>}
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="sm" onClick={() => startEdit(v)}
                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-lg">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => remove(v.id)}
                                            className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add new */}
                    {addingNew ? (
                        <div className="border border-primary/30 bg-primary/4 rounded-xl p-4 space-y-2">
                            <input value={newForm.title_vi} onChange={e => setNewForm({ ...newForm, title_vi: e.target.value })}
                                placeholder="Tên bài học mới" autoFocus className={inputClass} />
                            <input value={newForm.video_url} onChange={e => setNewForm({ ...newForm, video_url: e.target.value })}
                                placeholder="YouTube embed URL" className={inputClass} />
                            <input value={newForm.duration} onChange={e => setNewForm({ ...newForm, duration: e.target.value })}
                                placeholder="Thời lượng (vd: 15:30)" className={inputClass} />
                            <div className="flex gap-2 pt-1">
                                <Button onClick={addNew} disabled={saving || !newForm.title_vi} size="sm"
                                    className="btn-primary border-0 text-white text-xs rounded-lg h-7 px-3">
                                    <Plus className="w-3.5 h-3.5 mr-1" />{saving ? "..." : "Thêm bài"}
                                </Button>
                                <Button onClick={() => setAddingNew(false)} variant="ghost" size="sm"
                                    className="text-muted-foreground text-xs rounded-lg h-7 px-3">
                                    Huỷ
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setAddingNew(true)}
                            className="w-full py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Thêm bài học
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function Spinner() {
    return <div className="flex justify-center py-10"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
}

const inputClass = "w-full px-3 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

// Keys that use rich text editor (not plain input)
const RICH_TEXT_KEYS = new Set([
    "hero_title_vi", "hero_title_en", "hero_subtitle_vi", "hero_subtitle_en",
    "about_desc_vi", "about_desc_en",
]);

const EDITABLE_LABELS: Record<string, string> = {
    hero_badge_vi: "Badge (VI)", hero_title_vi: "Tiêu đề (VI)", hero_subtitle_vi: "Mô tả (VI)",
    hero_badge_en: "Badge (EN)", hero_title_en: "Title (EN)", hero_subtitle_en: "Subtitle (EN)",
    about_title_vi: "Tiêu đề (VI)", about_title_en: "Title (EN)",
    about_desc_vi: "Mô tả (VI)", about_desc_en: "Description (EN)",
    contact_zalo_info: "Zalo hiển thị", contact_zalo_href: "Zalo link",
    contact_facebook_info: "Facebook hiển thị", contact_facebook_href: "Facebook link",
    contact_youtube_info: "YouTube hiển thị", contact_youtube_href: "YouTube link",
    contact_email_info: "Email hiển thị", contact_email_href: "Email link",
};

// Sortable section card
function SortableSection({
    sectionId, visible, isExpanded, onToggleExpand, onToggleVisible,
    editingKey, editVal, setEditVal, onStartEdit, onSaveEdit, onCancelEdit,
    saving, get, keys,
}: {
    sectionId: string; visible: boolean; isExpanded: boolean;
    onToggleExpand: () => void; onToggleVisible: () => void;
    editingKey: string | null; editVal: string;
    setEditVal: (v: string) => void;
    onStartEdit: (k: string) => void;
    onSaveEdit: () => void; onCancelEdit: () => void;
    saving: string | null; get: (k: string) => string; keys: string[];
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: sectionId });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    return (
        <div
            ref={setNodeRef} style={style}
            className={`border rounded-2xl overflow-hidden transition-all ${visible ? "border-border bg-card" : "border-border/50 bg-muted/20 opacity-60"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    {/* Drag handle */}
                    <button
                        {...attributes} {...listeners}
                        className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing p-0.5 rounded touch-none"
                    >
                        <GripVertical className="w-4 h-4" />
                    </button>
                    <button onClick={onToggleExpand} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                        {SECTION_LABELS[sectionId as keyof typeof SECTION_LABELS]}
                    </button>
                    {!visible && <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">ẨN</span>}
                    {keys.length > 0 && (
                        <button onClick={onToggleExpand} className="text-[10px] text-primary hover:underline">
                            {isExpanded ? "Thu gọn" : `${keys.length} trường`}
                        </button>
                    )}
                </div>
                <button
                    onClick={onToggleVisible}
                    disabled={saving === `section_${sectionId}_visible`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${visible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                >
                    {visible ? <><Eye className="w-3.5 h-3.5" /> Hiện</> : <><EyeOff className="w-3.5 h-3.5" /> Ẩn</>}
                </button>
            </div>

            {/* Editable fields */}
            {isExpanded && keys.length > 0 && (
                <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    {keys.map((key) => (
                        <div key={key}>
                            <label className="text-[10px] font-semibold text-muted-foreground mb-1.5 block">
                                {EDITABLE_LABELS[key] || key}
                            </label>
                            {editingKey === key ? (
                                <div className="space-y-2">
                                    {RICH_TEXT_KEYS.has(key) ? (
                                        <RichTextEditor
                                            value={editVal}
                                            onChange={setEditVal}
                                            placeholder={EDITABLE_LABELS[key]}
                                        />
                                    ) : (
                                        <input
                                            autoFocus
                                            value={editVal}
                                            onChange={e => setEditVal(e.target.value)}
                                            className={inputClass}
                                        />
                                    )}
                                    <div className="flex gap-2">
                                        <Button onClick={onSaveEdit} disabled={saving === key} size="sm"
                                            className="btn-primary border-0 text-white rounded-xl h-8 px-4 text-xs">
                                            <Check className="w-3.5 h-3.5 mr-1" /> Lưu
                                        </Button>
                                        <Button onClick={onCancelEdit} variant="ghost" size="sm"
                                            className="rounded-xl h-8 px-3 text-muted-foreground text-xs">
                                            <X className="w-3.5 h-3.5 mr-1" /> Huỷ
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="flex items-start justify-between gap-2 px-3 py-2 rounded-xl border border-border bg-background hover:border-primary/30 transition-all group cursor-pointer min-h-[38px]"
                                    onClick={() => onStartEdit(key)}
                                >
                                    <span
                                        className="text-sm text-foreground flex-1 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-4"
                                        dangerouslySetInnerHTML={{ __html: get(key) }}
                                    />
                                    <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 mt-1" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SectionsTab() {
    const { get, update, isSectionVisible } = useSiteSettings();
    const [saving, setSaving] = useState<string | null>(null);
    const [editKey, setEditKey] = useState<string | null>(null);
    const [editVal, setEditVal] = useState("");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [order, setOrder] = useState<string[]>(() => {
        return [...SECTIONS] as unknown as string[];
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Load saved order
    useEffect(() => {
        const saved = get("section_order");
        if (saved) {
            const parsed = saved.split(",").filter(Boolean);
            if (parsed.length === SECTIONS.length) setOrder(parsed);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIdx = order.indexOf(active.id as string);
        const newIdx = order.indexOf(over.id as string);
        const newOrder = arrayMove(order, oldIdx, newIdx);
        setOrder(newOrder);
        await update("section_order", newOrder.join(","));
    };

    const toggleSection = async (sectionId: string, visible: boolean) => {
        const key = `section_${sectionId}_visible`;
        setSaving(key);
        await update(key, visible ? "false" : "true");
        setSaving(null);
    };

    return (
        <div>
            <p className="text-[11px] text-muted-foreground mb-3 flex items-center gap-1.5">
                <GripVertical className="w-3.5 h-3.5" /> Kéo để sắp xếp lại thứ tự các section
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={order} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {order.map((sectionId) => (
                            <SortableSection
                                key={sectionId}
                                sectionId={sectionId}
                                visible={isSectionVisible(sectionId as never)}
                                isExpanded={expanded === sectionId}
                                onToggleExpand={() => setExpanded(expanded === sectionId ? null : sectionId)}
                                onToggleVisible={() => toggleSection(sectionId, isSectionVisible(sectionId as never))}
                                editingKey={editKey}
                                editVal={editVal}
                                setEditVal={setEditVal}
                                onStartEdit={(k) => { setEditKey(k); setEditVal(get(k)); }}
                                onSaveEdit={async () => {
                                    if (!editKey) return;
                                    setSaving(editKey);
                                    await update(editKey, editVal);
                                    setSaving(null);
                                    setEditKey(null);
                                }}
                                onCancelEdit={() => setEditKey(null)}
                                saving={saving}
                                get={get}
                                keys={EDITABLE_KEYS[sectionId as keyof typeof EDITABLE_KEYS] || []}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

// ─── Courses Tab ──────────────────────────────────────────────────────────────
interface Course {
    id: string; title_vi: string; title_en: string;
    subtitle_vi: string; subtitle_en: string;
    desc_vi: string; desc_en: string;
    badge_vi: string; badge_en: string;
    accent_color: string; icon_name: string;
    price_vi: string | null; price_en: string | null;
    duration: string; rating: string;
    ai_label_vi: string; ai_label_en: string;
    cta_type: string; cta_href: string | null;
    is_featured: boolean; is_visible: boolean;
    features_vi: string[]; features_en: string[];
    sort_order: number;
}

const ICON_OPTIONS = ["Youtube", "Code2", "Crown", "Star", "Sparkles", "Zap", "Globe", "Users", "Bot"];

// Inline list editor for features
function FeaturesList({ items, onChange, placeholder }: {
    items: string[]; onChange: (items: string[]) => void; placeholder?: string;
}) {
    const [draft, setDraft] = useState("");
    const update = (idx: number, val: string) => onChange(items.map((it, i) => i === idx ? val : it));
    const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
    const add = () => { if (draft.trim()) { onChange([...items, draft.trim()]); setDraft(""); } };
    return (
        <div className="space-y-1.5">
            {items.map((it, idx) => (
                <div key={idx} className="flex gap-1.5 items-center">
                    <span className="text-[10px] text-muted-foreground/50 w-4 text-right">{idx + 1}.</span>
                    <input
                        value={it}
                        onChange={e => update(idx, e.target.value)}
                        className="flex-1 px-2 py-1 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <button type="button" onClick={() => remove(idx)}
                        className="text-red-400 hover:text-red-600 transition-colors p-0.5 rounded">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
            <div className="flex gap-1.5">
                <span className="w-4" />
                <input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                    placeholder={placeholder || "Thêm điểm nổi bật... (Enter để thêm)"}
                    className="flex-1 px-2 py-1 text-xs rounded-lg border border-dashed border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground/40"
                />
                <button type="button" onClick={add}
                    className="text-primary hover:text-primary/80 transition-colors p-0.5 rounded">
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

const BLANK_COURSE: Omit<Course, "id"> = {
    title_vi: "", title_en: "", subtitle_vi: "", subtitle_en: "",
    desc_vi: "", desc_en: "", badge_vi: "", badge_en: "",
    accent_color: "#6366f1", icon_name: "Star",
    price_vi: null, price_en: null, duration: "", rating: "5.0",
    ai_label_vi: "Hỗ trợ AI", ai_label_en: "AI-Assisted",
    cta_type: "contact", cta_href: null,
    is_featured: false, is_visible: true,
    features_vi: [], features_en: [], sort_order: 99,
};

function CoursesTab() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Course>>({});
    const [adding, setAdding] = useState(false);
    const [newForm, setNewForm] = useState<Omit<Course, "id">>({ ...BLANK_COURSE });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from("courses").select("*").order("sort_order");
        setCourses(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async (id: string) => {
        setSaving(true);
        await supabase.from("courses").update(editForm).eq("id", id);
        setCourses(p => p.map(c => c.id === id ? { ...c, ...editForm } as Course : c));
        setSaving(false); setEditId(null); setEditForm({});
    };

    const create = async () => {
        if (!newForm.title_vi) return;
        setSaving(true);
        const id = newForm.title_en.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
        const { data } = await supabase.from("courses").insert({ ...newForm, id }).select().single();
        if (data) setCourses(p => [...p, data]);
        setNewForm({ ...BLANK_COURSE }); setAdding(false); setSaving(false);
    };

    const remove = async (id: string) => {
        if (!confirm("Xóa khóa học này?")) return;
        await supabase.from("courses").delete().eq("id", id);
        setCourses(p => p.filter(c => c.id !== id));
    };

    const toggleField = async (id: string, field: "is_visible" | "is_featured", current: boolean) => {
        await supabase.from("courses").update({ [field]: !current }).eq("id", id);
        setCourses(p => p.map(c => c.id === id ? { ...c, [field]: !current } : c));
    };

    const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div>
            <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">{label}</label>
            {children}
        </div>
    );

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">{courses.length} khóa học</p>
                <Button onClick={load} variant="ghost" size="sm" className="text-muted-foreground h-8">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Làm mới
                </Button>
            </div>

            <div className="space-y-3">
                {courses.map(c => (
                    <div key={c.id} className={`border rounded-2xl overflow-hidden transition-all ${c.is_visible ? "border-border bg-card" : "border-border/50 bg-muted/20 opacity-60"
                        }`}>
                        {editId === c.id ? (
                            <div className="p-5 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <F label="Tên (VI)"><input value={editForm.title_vi ?? ""} onChange={e => setEditForm(f => ({ ...f, title_vi: e.target.value }))} className={inputClass} /></F>
                                    <F label="Tên (EN)"><input value={editForm.title_en ?? ""} onChange={e => setEditForm(f => ({ ...f, title_en: e.target.value }))} className={inputClass} /></F>
                                    <F label="Phụ đề (VI)"><input value={editForm.subtitle_vi ?? ""} onChange={e => setEditForm(f => ({ ...f, subtitle_vi: e.target.value }))} className={inputClass} /></F>
                                    <F label="Phụ đề (EN)"><input value={editForm.subtitle_en ?? ""} onChange={e => setEditForm(f => ({ ...f, subtitle_en: e.target.value }))} className={inputClass} /></F>
                                </div>
                                <F label="Mô tả (VI)"><textarea rows={2} value={editForm.desc_vi ?? ""} onChange={e => setEditForm(f => ({ ...f, desc_vi: e.target.value }))} className={inputClass} /></F>
                                <F label="Mô tả (EN)"><textarea rows={2} value={editForm.desc_en ?? ""} onChange={e => setEditForm(f => ({ ...f, desc_en: e.target.value }))} className={inputClass} /></F>

                                {/* Features editors */}
                                <div className="border border-border rounded-xl p-3 space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tính năng · VI</p>
                                    <FeaturesList
                                        items={editForm.features_vi ?? []}
                                        onChange={v => setEditForm(f => ({ ...f, features_vi: v }))}
                                        placeholder="VD: Hỗ trợ 1 kèm 1 trực tiếp"
                                    />
                                </div>
                                <div className="border border-border rounded-xl p-3 space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Features · EN</p>
                                    <FeaturesList
                                        items={editForm.features_en ?? []}
                                        onChange={v => setEditForm(f => ({ ...f, features_en: v }))}
                                        placeholder="e.g. 1-on-1 direct mentorship"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <F label="Badge (VI)"><input value={editForm.badge_vi ?? ""} onChange={e => setEditForm(f => ({ ...f, badge_vi: e.target.value }))} className={inputClass} /></F>
                                    <F label="Badge (EN)"><input value={editForm.badge_en ?? ""} onChange={e => setEditForm(f => ({ ...f, badge_en: e.target.value }))} className={inputClass} /></F>
                                    <F label="Giá (VI)"><input value={editForm.price_vi ?? ""} onChange={e => setEditForm(f => ({ ...f, price_vi: e.target.value || null }))} placeholder="VD: 999K" className={inputClass} /></F>
                                    <F label="Giá (EN)"><input value={editForm.price_en ?? ""} onChange={e => setEditForm(f => ({ ...f, price_en: e.target.value || null }))} placeholder="e.g. $49" className={inputClass} /></F>
                                    <F label="AI Label (VI)"><input value={editForm.ai_label_vi ?? ""} onChange={e => setEditForm(f => ({ ...f, ai_label_vi: e.target.value }))} placeholder="Hỗ trợ AI" className={inputClass} /></F>
                                    <F label="AI Label (EN)"><input value={editForm.ai_label_en ?? ""} onChange={e => setEditForm(f => ({ ...f, ai_label_en: e.target.value }))} placeholder="AI-Assisted" className={inputClass} /></F>
                                    <F label="Thời lượng"><input value={editForm.duration ?? ""} onChange={e => setEditForm(f => ({ ...f, duration: e.target.value }))} className={inputClass} /></F>
                                    <F label="Đánh giá"><input value={editForm.rating ?? ""} onChange={e => setEditForm(f => ({ ...f, rating: e.target.value }))} className={inputClass} /></F>
                                    <F label="Thứ tự hiển thị">
                                        <input type="number" min={0} value={editForm.sort_order ?? 0}
                                            onChange={e => setEditForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                                            className={inputClass}
                                        />
                                    </F>
                                    <F label="Màu accent">
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={editForm.accent_color ?? "#6366f1"} onChange={e => setEditForm(f => ({ ...f, accent_color: e.target.value }))} className="w-10 h-10 rounded-xl border border-border cursor-pointer" />
                                            <input value={editForm.accent_color ?? ""} onChange={e => setEditForm(f => ({ ...f, accent_color: e.target.value }))} className={inputClass} />
                                        </div>
                                    </F>
                                    <F label="Icon">
                                        <select value={editForm.icon_name ?? "Star"} onChange={e => setEditForm(f => ({ ...f, icon_name: e.target.value }))} className={inputClass}>
                                            {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </F>
                                    <F label="CTA type">
                                        <select value={editForm.cta_type ?? "contact"} onChange={e => setEditForm(f => ({ ...f, cta_type: e.target.value }))} className={inputClass}>
                                            <option value="contact">Liên hệ</option>
                                            <option value="enroll">Đăng ký</option>
                                        </select>
                                    </F>
                                    <F label="Link CTA (tùy chọn)"><input value={editForm.cta_href ?? ""} onChange={e => setEditForm(f => ({ ...f, cta_href: e.target.value || null }))} placeholder="https://..." className={inputClass} /></F>
                                </div>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                        <input type="checkbox" checked={editForm.is_featured ?? false} onChange={e => setEditForm(f => ({ ...f, is_featured: e.target.checked }))} className="rounded" />
                                        <span>Nổi bật (featured)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                        <input type="checkbox" checked={editForm.is_visible ?? true} onChange={e => setEditForm(f => ({ ...f, is_visible: e.target.checked }))} className="rounded" />
                                        <span>Hiện thị</span>
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => save(c.id)} disabled={saving} size="sm" className="btn-primary border-0 text-white rounded-xl h-8 px-4 text-xs">
                                        <Check className="w-3.5 h-3.5 mr-1" /> Lưu
                                    </Button>
                                    <Button onClick={() => { setEditId(null); setEditForm({}); }} variant="ghost" size="sm" className="rounded-xl h-8 px-3 text-xs text-muted-foreground">
                                        <X className="w-3.5 h-3.5 mr-1" /> Huỷ
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${c.accent_color}20` }}>
                                    <Star className="w-4 h-4" style={{ color: c.accent_color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-bold text-foreground truncate">{c.title_vi} — {c.subtitle_vi}</span>
                                        {c.is_featured && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">Featured</span>}
                                        {!c.is_visible && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">Ẩn</span>}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.duration} · {c.rating}★ · {c.cta_type}</p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <Button variant="ghost" size="sm" onClick={() => toggleField(c.id, "is_visible", c.is_visible)}
                                        className={`h-7 w-7 p-0 rounded-lg ${c.is_visible ? "text-green-600" : "text-muted-foreground"}`}>
                                        {c.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => { setEditId(c.id); setEditForm({ ...c }); }}
                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-lg">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => remove(c.id)}
                                        className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Add new */}
                {adding ? (
                    <div className="border border-primary/30 bg-primary/4 rounded-2xl p-5 space-y-3">
                        <p className="text-sm font-bold text-foreground mb-1">Thêm khóa học mới</p>
                        <div className="grid grid-cols-2 gap-3">
                            <F label="Tên (VI)*"><input autoFocus value={newForm.title_vi} onChange={e => setNewForm(f => ({ ...f, title_vi: e.target.value }))} className={inputClass} /></F>
                            <F label="Tên (EN)*"><input value={newForm.title_en} onChange={e => setNewForm(f => ({ ...f, title_en: e.target.value }))} className={inputClass} /></F>
                            <F label="Phụ đề (VI)"><input value={newForm.subtitle_vi} onChange={e => setNewForm(f => ({ ...f, subtitle_vi: e.target.value }))} className={inputClass} /></F>
                            <F label="Phụ đề (EN)"><input value={newForm.subtitle_en} onChange={e => setNewForm(f => ({ ...f, subtitle_en: e.target.value }))} className={inputClass} /></F>
                            <F label="Badge (VI)"><input value={newForm.badge_vi} onChange={e => setNewForm(f => ({ ...f, badge_vi: e.target.value }))} className={inputClass} /></F>
                            <F label="Badge (EN)"><input value={newForm.badge_en} onChange={e => setNewForm(f => ({ ...f, badge_en: e.target.value }))} className={inputClass} /></F>
                            <F label="Màu accent">
                                <div className="flex gap-2">
                                    <input type="color" value={newForm.accent_color} onChange={e => setNewForm(f => ({ ...f, accent_color: e.target.value }))} className="w-10 h-10 rounded-xl border border-border" />
                                    <input value={newForm.accent_color} onChange={e => setNewForm(f => ({ ...f, accent_color: e.target.value }))} className={inputClass} />
                                </div>
                            </F>
                            <F label="Icon">
                                <select value={newForm.icon_name} onChange={e => setNewForm(f => ({ ...f, icon_name: e.target.value }))} className={inputClass}>
                                    {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </F>
                        </div>
                        <F label="Mô tả (VI)"><textarea rows={2} value={newForm.desc_vi} onChange={e => setNewForm(f => ({ ...f, desc_vi: e.target.value }))} className={inputClass} /></F>
                        <F label="Mô tả (EN)"><textarea rows={2} value={newForm.desc_en} onChange={e => setNewForm(f => ({ ...f, desc_en: e.target.value }))} className={inputClass} /></F>
                        <div className="flex gap-2">
                            <Button onClick={create} disabled={saving || !newForm.title_vi} size="sm" className="btn-primary border-0 text-white rounded-xl h-8 px-4 text-xs">
                                <Plus className="w-3.5 h-3.5 mr-1" />{saving ? "..." : "Thêm"}
                            </Button>
                            <Button onClick={() => { setAdding(false); setNewForm({ ...BLANK_COURSE }); }} variant="ghost" size="sm" className="rounded-xl h-8 px-3 text-xs text-muted-foreground">
                                Huỷ
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setAdding(true)}
                        className="w-full py-3 rounded-2xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Thêm khóa học
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Blog Tab ────────────────────────────────────────────────────────────────
interface BlogPost {
    id: string; title: string; slug: string; excerpt: string; content: string;
    cover_image: string | null; category: string; tags: string[];
    author_name: string; author_avatar: string | null;
    is_featured: boolean; read_time: number; status: string;
    published_at: string | null; created_at: string;
}

const BLANK_POST: Omit<BlogPost, "id" | "created_at" | "published_at"> = {
    title: "", slug: "", excerpt: "", content: "",
    cover_image: null, category: "General", tags: [],
    author_name: "Dani Huynh", author_avatar: null,
    is_featured: false, read_time: 5, status: "draft",
};

// ─── Module-level helpers (extracted to avoid re-mount on BlogTab re-render) ──
const slugify = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function BlogTagsField({ tags, onChange, draft, setDraft }: {
    tags: string[]; onChange: (t: string[]) => void; draft: string; setDraft: (v: string) => void;
}) {
    const removeTag = (idx: number) => onChange(tags.filter((_, i) => i !== idx));
    const addTag = (tag: string) => {
        if (tag.trim() && !tags.includes(tag.trim())) onChange([...tags, tag.trim()]);
    };
    return (
        <div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full font-medium">
                        #{tag}
                        <button onClick={() => removeTag(i)} className="hover:text-red-500"><X className="w-2.5 h-2.5" /></button>
                    </span>
                ))}
            </div>
            <div className="flex gap-1.5">
                <input value={draft} onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(draft); setDraft(""); } }}
                    placeholder="Thêm tag... (Enter)" className={inputClass} />
            </div>
        </div>
    );
}

interface BlogFullEditorProps {
    form: Partial<BlogPost>; onChange: (f: Partial<BlogPost>) => void;
    onSave: () => void; onCancel: () => void; isNew?: boolean;
    saving: boolean; tagDraft: string; setTagDraft: (v: string) => void;
}
function BlogFullEditor({ form, onChange, onSave, onCancel, isNew, saving, tagDraft, setTagDraft }: BlogFullEditorProps) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const titleRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onCancel]);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = "auto";
            titleRef.current.style.height = titleRef.current.scrollHeight + "px";
        }
    }, [form.title]);

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-3 sm:px-5 py-3 border-b border-border bg-card/80 backdrop-blur-lg flex-shrink-0">
                <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium flex-shrink-0">
                    <X className="w-4 h-4" /><span className="hidden sm:inline">Đóng</span>
                </button>
                <div className="flex-1 text-sm font-semibold text-foreground truncate px-2 hidden sm:block">
                    {form.title || (isNew ? "Bài viết mới" : "Chỉnh sửa bài viết")}
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                    <button onClick={() => setSettingsOpen(o => !o)}
                        className={`lg:hidden flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${settingsOpen ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        <FileText className="w-3.5 h-3.5" /><span className="hidden sm:inline">Cài đặt</span>
                    </button>
                    <Button onClick={onSave} disabled={saving} className="btn-primary border-0 text-white rounded-xl h-8 px-4 text-xs">
                        <Check className="w-3.5 h-3.5 mr-1" /><span>{saving ? "Lưu..." : isNew ? "Tạo bài" : "Lưu"}</span>
                    </Button>
                </div>
            </div>
            {/* Body */}
            <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
                {/* Writing area */}
                <div className={`overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 w-full lg:max-w-3xl lg:mx-auto ${settingsOpen ? "hidden lg:block" : "flex-1"}`}>
                    {form.cover_image && (
                        <div className="rounded-2xl overflow-hidden h-40 sm:h-52 mb-6">
                            <img src={form.cover_image} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <textarea
                        ref={titleRef}
                        value={form.title ?? ""}
                        onChange={e => {
                            const val = e.target.value.replace(/\n/g, "");
                            onChange({ ...form, title: val, slug: form.slug || (isNew ? slugify(val) : form.slug) });
                        }}
                        placeholder="Tiêu đề bài viết..."
                        rows={1}
                        className="w-full text-2xl sm:text-3xl font-black text-foreground bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 leading-tight mb-4 overflow-hidden"
                    />
                    <textarea
                        value={form.excerpt ?? ""}
                        onChange={e => onChange({ ...form, excerpt: e.target.value })}
                        placeholder="Tóm tắt ngắn (hiển thị trên danh sách blog)..."
                        rows={2}
                        className="w-full text-sm sm:text-base text-muted-foreground bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 mb-6 border-b border-border pb-4"
                    />
                    <RichTextEditor
                        value={form.content ?? ""}
                        onChange={content => onChange({ ...form, content })}
                        placeholder="Bắt đầu viết nội dung bài viết..."
                        minHeight="320px"
                    />
                </div>
                {/* Settings sidebar */}
                <div className={`border-t lg:border-t-0 lg:border-l border-border bg-card/50 overflow-y-auto ${settingsOpen ? "flex-1 block" : "hidden"} lg:block lg:flex-none lg:w-72`}>
                    <div className="p-5 space-y-5">
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Slug (URL)</label>
                            <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1.5">
                                <span className="text-[10px] text-muted-foreground/60">/blog/</span>
                                <input value={form.slug ?? ""}
                                    onChange={e => onChange({ ...form, slug: slugify(e.target.value) })}
                                    className="flex-1 text-xs bg-transparent border-none outline-none text-foreground min-w-0" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Ảnh bìa</label>
                            <input value={form.cover_image ?? ""} onChange={e => onChange({ ...form, cover_image: e.target.value || null })} placeholder="https://images.unsplash.com/..." className={inputClass} />
                            {form.cover_image && (
                                <div className="mt-2 rounded-xl overflow-hidden h-28 relative group">
                                    <img src={form.cover_image} alt="" className="w-full h-full object-cover" />
                                    <button onClick={() => onChange({ ...form, cover_image: null })} className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Danh mục</label>
                            <input value={form.category ?? ""} onChange={e => onChange({ ...form, category: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tags</label>
                            <BlogTagsField tags={form.tags ?? []} onChange={tags => onChange({ ...form, tags })} draft={tagDraft} setDraft={setTagDraft} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tác giả</label>
                            <input value={form.author_name ?? ""} onChange={e => onChange({ ...form, author_name: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Avatar URL</label>
                            <input value={form.author_avatar ?? ""} onChange={e => onChange({ ...form, author_avatar: e.target.value || null })} placeholder="https://..." className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Thời gian đọc (phút)</label>
                            <input type="number" min={1} value={form.read_time ?? 5} onChange={e => onChange({ ...form, read_time: Number(e.target.value) })} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Trạng thái</label>
                            <div className="flex gap-2">
                                <button onClick={() => onChange({ ...form, status: "draft" })} className={`flex-1 py-2 text-xs rounded-lg font-semibold transition-all ${(form.status ?? "draft") === "draft" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Draft</button>
                                <button onClick={() => onChange({ ...form, status: "published" })} className={`flex-1 py-2 text-xs rounded-lg font-semibold transition-all ${form.status === "published" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground hover:text-foreground"}`}>✓ Đã đăng</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-border">
                            <span className="text-xs font-semibold text-foreground">Nổi bật ⭐</span>
                            <button onClick={() => onChange({ ...form, is_featured: !form.is_featured })} style={{ height: "22px", width: "40px" }} className={`rounded-full transition-all relative flex-shrink-0 ${form.is_featured ? "bg-primary" : "bg-muted"}`}>
                                <span className={`absolute top-0.5 rounded-full bg-white shadow-sm transition-all ${form.is_featured ? "left-[18px]" : "left-0.5"}`} style={{ width: "18px", height: "18px" }} />
                            </button>
                        </div>
                        <Button onClick={onSave} disabled={saving} className="w-full btn-primary border-0 text-white rounded-xl text-sm">
                            <Check className="w-4 h-4 mr-1.5" />{saving ? "Đang lưu..." : isNew ? "Tạo bài viết" : "Lưu thay đổi"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BlogTab() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<string | null>(searchParams.get("edit") || null);
    const [editForm, setEditForm] = useState<Partial<BlogPost>>({});
    const [adding, setAdding] = useState(false);
    const [newForm, setNewForm] = useState({ ...BLANK_POST });
    const [saving, setSaving] = useState(false);
    const [tagDraft, setTagDraft] = useState("");
    const [newTagDraft, setNewTagDraft] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.rpc("get_all_blog_posts");
        setPosts(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    // Open post from URL param (?edit=id)
    useEffect(() => {
        const id = searchParams.get("edit");
        if (id && posts.length) {
            const p = posts.find(p => p.id === id);
            if (p) { setEditId(id); setEditForm({ ...p }); }
        }
    }, [searchParams, posts]);

    const save = async (id: string) => {
        setSaving(true);
        const payload = { ...editForm };
        if (payload.status === "published" && !payload.published_at) payload.published_at = new Date().toISOString();
        await supabase.from("blog_posts").update(payload).eq("id", id);
        setPosts(p => p.map(post => post.id === id ? { ...post, ...payload } as BlogPost : post));
        setSaving(false); setEditId(null); setEditForm({});
    };

    const create = async () => {
        if (!newForm.title) return;
        setSaving(true);
        const slug = newForm.slug || slugify(newForm.title);
        const published_at = newForm.status === "published" ? new Date().toISOString() : null;
        const { data } = await supabase.from("blog_posts").insert({ ...newForm, slug, published_at }).select().single();
        if (data) setPosts(p => [data, ...p]);
        setNewForm({ ...BLANK_POST }); setAdding(false); setSaving(false);
    };

    const remove = async (id: string) => {
        if (!confirm("Xóa bài viết này?")) return;
        await supabase.from("blog_posts").delete().eq("id", id);
        setPosts(p => p.filter(post => post.id !== id));
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">{posts.length} bài viết</p>
                <div className="flex gap-2">
                    <Button asChild variant="ghost" size="sm" className="text-muted-foreground h-8 text-xs">
                        <a href="/blog" target="_blank"><ExternalLink className="w-3.5 h-3.5 mr-1.5" />Xem blog</a>
                    </Button>
                    <Button onClick={load} variant="ghost" size="sm" className="text-muted-foreground h-8">
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Làm mới
                    </Button>
                </div>
            </div>

            {/* Full-screen editor overlay */}
            {editId && (
                <BlogFullEditor
                    form={editForm}
                    onChange={setEditForm}
                    onSave={() => save(editId)}
                    onCancel={() => { setEditId(null); setEditForm({}); }}
                    saving={saving}
                    tagDraft={tagDraft}
                    setTagDraft={setTagDraft}
                />
            )}
            {adding && (
                <BlogFullEditor
                    form={newForm}
                    onChange={f => setNewForm(f as typeof newForm)}
                    onSave={create}
                    onCancel={() => { setAdding(false); setNewForm({ ...BLANK_POST }); }}
                    isNew
                    saving={saving}
                    tagDraft={newTagDraft}
                    setTagDraft={setNewTagDraft}
                />
            )}

            <div className="space-y-3">
                {posts.map(post => (
                    <div key={post.id} className={`border rounded-2xl overflow-hidden transition-all ${post.status === "published" ? "border-border bg-card" : "border-border/50 bg-muted/10"
                        }`}>
                        <div className="flex items-start gap-3 p-4">
                            {post.cover_image && (
                                <img src={post.cover_image} alt="" className="w-16 h-12 object-cover rounded-xl flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <span className="text-sm font-bold text-foreground">{post.title}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                        }`}>{post.status === "published" ? "Đã đăng" : "Draft"}</span>
                                    {post.is_featured && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">⭐ Featured</span>}
                                </div>
                                <p className="text-[11px] text-muted-foreground line-clamp-1">{post.excerpt}</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                                    {post.category} · {post.read_time}min · /blog/{post.slug}
                                </p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                                {post.status === "published" && (
                                    <a href={`/blog/${post.slug}`} target="_blank"
                                        className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-primary rounded-lg transition-colors">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => { setEditId(post.id); setEditForm({ ...post }); }}
                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-lg">
                                    <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => remove(post.id)}
                                    className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={() => setAdding(true)}
                    className="w-full py-3 rounded-2xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Viết bài mới
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: "sections", label: "Trang chủ", icon: LayoutDashboard, desc: "Sections & nội dung" },
    { id: "courses", label: "Khóa học", icon: BookOpen, desc: "Thêm / sửa / xóa" },
    { id: "blog", label: "Bài viết", icon: FileText, desc: "Blog posts" },
    { id: "users", label: "Tài khoản", icon: Users, desc: "Quản lý người dùng" },
    { id: "keys", label: "Mã kích hoạt", icon: KeyRound, desc: "License keys" },
    { id: "videos", label: "Video", icon: Video, desc: "Quản lý video" },
];

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Spinner /></div>}>
            <AdminPageInner />
        </Suspense>
    );
}

// ─── Dani handwriting logo ────────────────────────────────────────────────────
const DANI_LOGO_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

.dani-logo-text {
  font-family: 'Dancing Script', cursive;
  font-size: 26px;
  font-weight: 700;
  color: white;
  line-height: 1;
  letter-spacing: -0.5px;
  display: block;
}
.dani-logo-wrap {
  position: relative;
  display: inline-block;
  overflow: hidden;
}
/* The mask slides away left→right, revealing the text underneath */
.dani-logo-mask {
  position: absolute;
  inset: 0;
  background: #1e1e2e;
  transform-origin: left center;
  animation: daniReveal 1.6s cubic-bezier(0.45, 0, 0.15, 1) 0.4s both;
}
/* Small pen-nib dot that rides the right edge of the reveal */
.dani-logo-pen {
  position: absolute;
  top: 50%;
  width: 5px;
  height: 5px;
  margin-top: -2.5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 0 6px 2px rgba(255,255,255,0.4);
  animation: daniPen 1.6s cubic-bezier(0.45, 0, 0.15, 1) 0.4s both;
}
@keyframes daniReveal {
  0%   { transform: scaleX(1); }
  100% { transform: scaleX(0); }
}
@keyframes daniPen {
  0%   { left: 0%; opacity: 1; }
  95%  { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
`;

function DaniLogo() {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: DANI_LOGO_STYLE }} />
            <div className="dani-logo-wrap">
                <span className="dani-logo-text">Dani</span>
                <div className="dani-logo-mask" />
                <div className="dani-logo-pen" />
            </div>
        </>
    );
}

function AdminPageInner() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading, signOut } = useAuth();
    const { isAdmin, loading: adminLoading } = useAdmin();
    const tab = searchParams.get("tab") || "sections";
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const setTab = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", id);
        router.replace(`/admin?${params.toString()}`, { scroll: false });
        setSidebarOpen(false);
    };

    useEffect(() => {
        if (!authLoading && !user) router.push("/login");
        if (!adminLoading && user && !isAdmin) router.push("/dashboard");
    }, [user, authLoading, isAdmin, adminLoading, router]);

    if (authLoading || adminLoading || !user || !isAdmin) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><Spinner /></div>;
    }

    const activeNav = NAV_ITEMS.find(n => n.id === tab) || NAV_ITEMS[0];

    return (
        <div className="h-screen overflow-hidden bg-muted/30 flex">

            {/* ── Sidebar ── */}
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`fixed top-0 left-0 h-full z-50 bg-[#1e1e2e] flex flex-col transition-all duration-200
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0
                ${sidebarCollapsed ? "w-[56px]" : "w-[220px]"}`}>

                {/* Logo */}
                <div className={`flex items-center border-b border-white/8 py-4 ${sidebarCollapsed ? "justify-center px-3" : "px-5 gap-3"}`}>
                    {sidebarCollapsed ? (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                    ) : (
                        <DaniLogo />
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        const active = tab === item.id;
                        return (
                            <button
                                key={item.id}
                                title={sidebarCollapsed ? item.label : undefined}
                                onClick={() => setTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                                    ${sidebarCollapsed ? "justify-center px-0" : "text-left"}
                                    ${active ? "bg-primary text-white" : "text-white/60 hover:bg-white/8 hover:text-white"}`}
                            >
                                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-white/50 group-hover:text-white"}`} />
                                {!sidebarCollapsed && (
                                    <div className="min-w-0 overflow-hidden">
                                        <p className="text-xs font-semibold leading-none">{item.label}</p>
                                        <p className={`text-[10px] mt-0.5 leading-none truncate ${active ? "text-white/70" : "text-white/30"}`}>{item.desc}</p>
                                    </div>
                                )}
                                {!sidebarCollapsed && active && <div className="ml-auto w-1 h-4 rounded-full bg-white/40 flex-shrink-0" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="border-t border-white/8 p-3 space-y-1">
                    {!sidebarCollapsed && (
                        <>
                            <a href="/" target="_blank"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all text-xs font-medium">
                                <ExternalLink className="w-3.5 h-3.5" />
                                Xem trang web
                            </a>
                            <a href="/dashboard"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all text-xs font-medium">
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                Dashboard
                            </a>
                            <button onClick={async () => { await signOut(); router.push("/"); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-medium">
                                <LogOut className="w-3.5 h-3.5" />
                                Đăng xuất
                            </button>
                            <div className="px-3 pt-1">
                                <p className="text-[10px] text-white/25 truncate">{user.email}</p>
                            </div>
                        </>
                    )}
                    {sidebarCollapsed && (
                        <div className="flex flex-col items-center gap-1">
                            <a href="/" target="_blank" title="Xem trang web"
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button onClick={async () => { await signOut(); router.push("/"); }} title="Đăng xuất"
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    {/* Collapse toggle — desktop only */}
                    <button
                        onClick={() => setSidebarCollapsed(c => !c)}
                        title={sidebarCollapsed ? "Mở rộng" : "Thu gọn"}
                        className="hidden lg:flex w-full items-center justify-center py-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all">
                        {sidebarCollapsed
                            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        }
                    </button>
                </div>
            </aside>

            {/* ── Main area ── */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">

                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border flex items-center gap-4 px-6 h-14 flex-shrink-0">
                    {/* Mobile hamburger */}
                    <button onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Admin</span>
                        <span>/</span>
                        <span className="flex items-center gap-1.5 text-foreground font-semibold">
                            <activeNav.icon className="w-3.5 h-3.5" />
                            {activeNav.label}
                        </span>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Admin
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-5xl mx-auto">
                        {/* Page heading */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <activeNav.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-foreground leading-none">{activeNav.label}</h1>
                                <p className="text-xs text-muted-foreground mt-0.5">{activeNav.desc}</p>
                            </div>
                        </div>

                        {/* Tab content */}
                        <Card className="border-border bg-card rounded-2xl shadow-sm">
                            <CardContent className="p-6">
                                {tab === "sections" && <SectionsTab />}
                                {tab === "courses" && <CoursesTab />}
                                {tab === "blog" && <BlogTab />}
                                {tab === "users" && <UsersTab />}
                                {tab === "keys" && <KeysTab />}
                                {tab === "videos" && <VideosTab />}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
