"use client";

import type React from "react";
import { useState } from "react";

import type { KeywordOutput, TabType } from "../types";
import { KeywordInput } from "./keyword-input.client";
import { KeywordResult } from "./keyword-result.client";

interface KeywordSectionProps {
  keywordText: string;
  setKeywordText: (_text: string) => void;
  keywordOutput: KeywordOutput;
  handleKeywordConvert: () => void;
}

export function KeywordSection({
  keywordText,
  setKeywordText,
  keywordOutput,
  handleKeywordConvert
}: KeywordSectionProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>("input");

  return (
    <div className='space-y-4 rounded-lg border p-4'>
      <KeywordInput
        keywordText={keywordText}
        setKeywordText={setKeywordText}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onConvert={handleKeywordConvert}
      />
      <KeywordResult keywordOutput={keywordOutput} activeTab={activeTab} />
    </div>
  );
}
