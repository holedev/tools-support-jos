"use client";

import { Button } from "@/components/ui/button";

type PasteFormat = "plain" | "rich";

interface PasteButtonProps {
  onPaste: (content: string) => void;
  format?: PasteFormat;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PasteButton({
  onPaste,
  format = "plain",
  variant = "outline",
  size = "sm",
  className
}: PasteButtonProps) {
  const handlePaste = async () => {
    try {
      // For plain text format, just get text
      if (format === "plain") {
        const text = await navigator.clipboard.readText();
        onPaste(text);
        return;
      }

      // For rich text format, try to get HTML content first
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const htmlType = clipboardItem.types.find((type) => type === "text/html");
        if (htmlType) {
          const blob = await clipboardItem.getType("text/html");
          const htmlContent = await blob.text();
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = htmlContent;

          // Clean up Word content
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

          onPaste(cleanedHtml);
          return;
        }
      }

      // Fallback to plain text
      const text = await navigator.clipboard.readText();
      onPaste(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <Button onClick={handlePaste} variant={variant} size={size} className={className}>
      Paste
    </Button>
  );
}
