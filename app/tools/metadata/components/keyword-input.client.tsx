"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TabType } from "../types";
import { PasteButton } from "./paste-button.client";

interface KeywordInputProps {
  keywordText: string;
  setKeywordText: (_text: string) => void;
  activeTab: TabType;
  setActiveTab: (_tab: TabType) => void;
  onConvert: () => void;
}

export function KeywordInput({ 
  keywordText, 
  setKeywordText, 
  activeTab, 
  setActiveTab, 
  onConvert 
}: KeywordInputProps) {
  const handleConvertClick = () => {
    onConvert();
    setActiveTab("result");
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Keywords</h3>
        <div className="space-x-2">
          <PasteButton onPaste={setKeywordText} format="plain" />
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
            value={keywordText}
            onChange={(e) => setKeywordText(e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text");
              setKeywordText(text);
            }}
            className='min-h-[100px] w-full resize-y rounded-md border p-2'
            placeholder='Paste keywords separated by semicolons (;)'
          />
        </div>
      )}
    </div>
  );
}