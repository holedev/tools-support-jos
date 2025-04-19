"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TabType } from "../types";
import { PasteButton } from "./paste-button.client";

interface AuthorInputProps {
  authorText: string;
  setAuthorText: (_text: string) => void;
  activeTab: TabType;
  setActiveTab: (_tab: TabType) => void;
  onConvert: () => void;
}

export function AuthorInput({ authorText, setAuthorText, activeTab, setActiveTab, onConvert }: AuthorInputProps) {
  const handleConvertClick = () => {
    onConvert();
    setActiveTab("result");
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Author Information</h3>
        <div className='space-x-2'>
          <PasteButton onPaste={setAuthorText} format='plain' />
          <Button onClick={handleConvertClick} variant='outline' size='sm'>
            Convert
          </Button>
        </div>
      </div>

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
          <textarea
            value={authorText}
            onChange={(e) => setAuthorText(e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text");
              setAuthorText(text);
            }}
            className='min-h-[150px] w-full resize-y rounded-md border p-2'
            placeholder='Paste author information (names with affiliations and corresponding author)'
          />
        </div>
      )}
    </div>
  );
}
