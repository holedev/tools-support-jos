"use client";

import type React from "react";
import { useState } from "react";

import type { AuthorOutput, TabType } from "../types";
import { AuthorInput } from "./author-input.client";
import { AuthorResult } from "./author-result.client";

interface AuthorSectionProps {
  authorText: string;
  setAuthorText: (_text: string) => void;
  authorOutput: AuthorOutput;
  handleAuthorConvert: () => void;
}

export function AuthorSection({
  authorText,
  setAuthorText,
  authorOutput,
  handleAuthorConvert
}: AuthorSectionProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>("input");

  return (
    <div className='space-y-4 rounded-lg border p-4'>
      <AuthorInput
        authorText={authorText}
        setAuthorText={setAuthorText}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onConvert={handleAuthorConvert}
      />
      <AuthorResult authorOutput={authorOutput} activeTab={activeTab} />
    </div>
  );
}
