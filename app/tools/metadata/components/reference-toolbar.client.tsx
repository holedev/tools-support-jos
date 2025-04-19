"use client";

import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReferenceToolbarProps {
  editor: Editor | null;
}

export function ReferenceToolbar({ editor }: ReferenceToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className='flex flex-wrap items-center gap-2 border-b pb-2'>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("hover:bg-muted", editor.isActive("bold") && "bg-muted")}
        variant='ghost'
        size='sm'
      >
        Bold
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("hover:bg-muted", editor.isActive("italic") && "bg-muted")}
        variant='ghost'
        size='sm'
      >
        Italic
      </Button>
      <Button onClick={() => editor.chain().focus().unsetAllMarks().run()} variant='ghost' size='sm'>
        Clear Format
      </Button>
    </div>
  );
}
