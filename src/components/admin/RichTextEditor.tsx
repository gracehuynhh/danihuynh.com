"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
    Bold, Italic, Strikethrough, Underline as UnderlineIcon,
    List, ListOrdered, Link2, Undo, Redo,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Quote, Code2, Minus, Image as ImageIcon,
    Heading1, Heading2, Heading3, RemoveFormatting,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: string;
}

function ToolBtn({ onClick, active, title, children, disabled }: {
    onClick: () => void; active?: boolean; title: string;
    children: React.ReactNode; disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            title={title}
            disabled={disabled}
            className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all disabled:opacity-30 ${active
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-4 bg-border mx-0.5 flex-shrink-0" />;
}

function Toolbar({ editor }: { editor: Editor }) {
    const addImage = () => {
        const url = window.prompt("URL ảnh:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };
    const addLink = () => {
        if (editor.isActive("link")) { editor.chain().focus().unsetLink().run(); return; }
        const url = window.prompt("URL liên kết:");
        if (url) editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">
            {/* History */}
            <ToolBtn title="Hoàn tác" onClick={() => editor.chain().focus().undo().run()}>
                <Undo className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Làm lại" onClick={() => editor.chain().focus().redo().run()}>
                <Redo className="w-3.5 h-3.5" />
            </ToolBtn>

            <Divider />

            {/* Headings */}
            <ToolBtn title="Tiêu đề 1" active={editor.isActive("heading", { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1 className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Tiêu đề 2" active={editor.isActive("heading", { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Tiêu đề 3" active={editor.isActive("heading", { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 className="w-3.5 h-3.5" />
            </ToolBtn>

            <Divider />

            {/* Inline formatting */}
            <ToolBtn title="In đậm (Ctrl+B)" active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="In nghiêng (Ctrl+I)" active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Gạch chân (Ctrl+U)" active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Gạch ngang" active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Code inline" active={editor.isActive("code")}
                onClick={() => editor.chain().focus().toggleCode().run()}>
                <Code2 className="w-3.5 h-3.5" />
            </ToolBtn>

            <Divider />

            {/* Lists */}
            <ToolBtn title="Danh sách chấm" active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Danh sách số" active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Trích dẫn" active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="w-3.5 h-3.5" />
            </ToolBtn>

            <Divider />

            {/* Alignment */}
            <ToolBtn title="Căn trái" active={editor.isActive({ textAlign: "left" })}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                <AlignLeft className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Căn giữa" active={editor.isActive({ textAlign: "center" })}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                <AlignCenter className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Căn phải" active={editor.isActive({ textAlign: "right" })}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                <AlignRight className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Đều hai lề" active={editor.isActive({ textAlign: "justify" })}
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                <AlignJustify className="w-3.5 h-3.5" />
            </ToolBtn>

            <Divider />

            {/* Media & extras */}
            <ToolBtn title="Chèn link" active={editor.isActive("link")} onClick={addLink}>
                <Link2 className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Chèn ảnh từ URL" onClick={addImage}>
                <ImageIcon className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Đường kẻ ngang" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn title="Xóa định dạng" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
                <RemoveFormatting className="w-3.5 h-3.5" />
            </ToolBtn>
        </div>
    );
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = "160px" }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            Underline,
            Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full my-3" } }),
            Placeholder.configure({ placeholder: placeholder || "Bắt đầu viết..." }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all overflow-hidden">
            <Toolbar editor={editor} />
            <EditorContent
                editor={editor}
                className="prose prose-sm dark:prose-invert max-w-none
                    prose-headings:font-black prose-headings:text-foreground
                    prose-p:text-foreground prose-p:leading-relaxed
                    prose-a:text-primary prose-strong:text-foreground
                    prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                    prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-code:text-sm
                    [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:focus:outline-none
                    [&_.ProseMirror]:min-h-[var(--editor-min-h)]
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground/50
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
                style={{ "--editor-min-h": minHeight } as React.CSSProperties}
            />
        </div>
    );
}
