"use client";

import { Check, Copy } from "lucide-react";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button onClick={handleCopy} variant='ghost' size='sm' className='h-6 w-6 p-0'>
      {copied ? <Check className='h-3 w-3 text-green-500' /> : <Copy className='h-3 w-3' />}
    </Button>
  );
}
