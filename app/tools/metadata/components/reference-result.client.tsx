"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface ReferenceResultProps {
  output: string;
  activeTab: "input" | "result";
}

export function ReferenceResult({ output, activeTab }: ReferenceResultProps) {
  const [copied, setCopied] = useState(false);

  if (activeTab !== "result") {
    return null;
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Count references by counting non-empty lines
  const getCountText = () => {
    if (!output.trim()) return "No references";

    // Split by newlines and filter out empty lines
    const lines = output.split("\n").filter((line) => line.trim().length > 0);
    const count = lines.length;

    return `${count} ${count === 1 ? "reference" : "references"}`;
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <label htmlFor='output' className='text-sm font-medium'>
            HTML Output
          </label>
          <span className='text-xs text-muted-foreground'>({getCountText()})</span>
        </div>
        <Button
          onClick={copyToClipboard}
          variant='ghost'
          size='sm'
          className={cn("h-8 gap-1 px-2", copied && "text-green-500")}
        >
          {copied ? (
            <>
              <Check className='h-4 w-4' />
              <span className='text-xs'>Copied!</span>
            </>
          ) : (
            <>
              <Copy className='h-4 w-4' />
              <span className='text-xs'>Copy</span>
            </>
          )}
        </Button>
      </div>
      <textarea
        id='output'
        value={output}
        className='bg-muted min-h-[200px] w-full rounded-md border p-2 font-mono text-sm'
        readOnly
      />
    </div>
  );
}
