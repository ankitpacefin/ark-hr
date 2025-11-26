"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"

interface JobEditorProps {
    content: string
    onChange: (content: string) => void
}

export function JobEditor({ content, onChange }: JobEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write a detailed job description...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'min-h-[300px] w-full rounded-md bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm dark:prose-invert max-w-none',
            },
        },
        immediatelyRender: false,
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col border rounded-xl shadow-sm bg-card overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-all duration-200">
            <div className="flex items-center gap-1 border-b bg-muted/40 p-2 sticky top-0 z-10 backdrop-blur-sm">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
            </div>
            <EditorContent editor={editor} className="p-2" />
        </div>
    )
}
