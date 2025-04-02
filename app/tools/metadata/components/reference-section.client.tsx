"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TabType } from "../types";
import { ReferenceToolbar } from "./reference-toolbar.client";
import { ReferenceResult } from "./reference-result.client";
import { cleanHtml } from "../utils";

interface ReferenceSectionProps {
  output: string;
  setOutput: (_output: string) => void;
}

export function ReferenceSection({ output, setOutput }: ReferenceSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("input");

  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      handlePaste: (view, event) => {
        const htmlContent = event.clipboardData?.getData("text/html");
        if (htmlContent && htmlContent.includes('class="Mso')) {
          event.preventDefault();

          // Clean up Word content
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = htmlContent;

          tempDiv.querySelectorAll("meta, link, style, script, o\\:p").forEach((el) => el.remove());

          const cleanedHtml = tempDiv.innerHTML
            .replace(/<\/?xml[^>]*>/g, "")
            .replace(/<\/?w:[^>]*>/g, "")
            .replace(/<\/?m:[^>]*>/g, "")
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/class="?Mso[a-zA-Z]+"?/g, "")
            .replace(/ style=""/g, "")
            .replace(/(<[^>]+) lang=["'][^"']*["']/g, "$1")
            .trim();

          editor?.commands.insertContent(cleanedHtml);
          return true;
        }
        return false;
      },
      attributes: {
        class: "w-full min-h-[200px] p-4 rounded-md border prose prose-sm focus:outline-none"
      }
    }
  });

  const handleReferenceConvert = () => {
    if (editor) {
      const content = editor.getHTML();
      const cleanedHtml = cleanHtml(content);
      setOutput(cleanedHtml);
      setActiveTab("result");
    }
  };

  return (
    <div className='mt-4 space-y-4 rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Reference Formatting</h3>
        <Button onClick={handleReferenceConvert} variant='outline' size='sm'>
          Convert
        </Button>
      </div>

      <div className='space-y-4'>
        <div className='flex border-b'>
          <Button
            variant='ghost'
            onClick={() => setActiveTab("input")}
            className={cn(
              "rounded-none border-b-2 border-transparent",
              activeTab === "input" && "border-primary bg-muted/50"
            )}
          >
            Input
          </Button>
          <Button
            variant='ghost'
            onClick={() => setActiveTab("result")}
            className={cn(
              "rounded-none border-b-2 border-transparent",
              activeTab === "result" && "border-primary bg-muted/50"
            )}
          >
            Result
          </Button>
        </div>

        {activeTab === "input" && (
          <div className='space-y-4'>
            <ReferenceToolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        )}

        <ReferenceResult output={output} activeTab={activeTab} />
      </div>
    </div>
  );
}
