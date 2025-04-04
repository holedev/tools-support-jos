"use client";

import { KeywordOutput } from "../types";
import { CopyButton } from "./copy-button.client";

interface KeywordResultProps {
  keywordOutput: KeywordOutput;
  activeTab: "input" | "result";
}

export function KeywordResult({ keywordOutput, activeTab }: KeywordResultProps) {
  if (activeTab !== "result" || keywordOutput.keywords.length === 0) {
    return null;
  }

  const keywordCount = keywordOutput.keywords.length;

  return (
    <div className='space-y-2 text-sm'>
      <div className='flex items-center gap-2'>
        <h4 className='font-medium'>Keywords</h4>
        <span className='text-xs text-muted-foreground'>
          ({keywordCount} keyword{keywordCount !== 1 ? "s" : ""})
        </span>
      </div>
      <div className='space-y-2 pl-4'>
        <div className='grid gap-2'>
          {keywordOutput.keywords.map((keyword, i) => (
            <div key={i} className='flex items-center gap-2'>
              <div>
                <span className='text-muted-foreground'>Keyword {i + 1}:</span> {keyword}
              </div>
              <CopyButton text={keyword} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
