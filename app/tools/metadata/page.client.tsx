"use client";

import { useState } from "react";
import { AuthorSection } from "./components/author-section.client";
import { KeywordSection } from "./components/keyword-section.client";
import { ReferenceSection } from "./components/reference-section.client";
import type { AuthorOutput, KeywordOutput } from "./types";
import { parseAuthors, parseKeywords } from "./utils";

export default function MetadataPage() {
  const [output, setOutput] = useState("");
  const [authorText, setAuthorText] = useState("");
  const [authorOutput, setAuthorOutput] = useState<AuthorOutput>({
    authors: [],
    affiliations: []
  });
  const [keywordText, setKeywordText] = useState("");
  const [keywordOutput, setKeywordOutput] = useState<KeywordOutput>({
    keywords: []
  });

  const handleAuthorConvert = () => {
    const result = parseAuthors(authorText);
    setAuthorOutput(result);
  };

  const handleKeywordConvert = () => {
    const result = parseKeywords(keywordText);
    setKeywordOutput(result);
  };

  return (
    <div className='grid gap-6'>
      <div className='grid gap-2'>
        <h2 className='text-2xl font-semibold tracking-tight'>Metadata</h2>
        <p className='text-muted-foreground'>
          This tool help you convert metadata from .docx, .pdf to the suitable format for OJS.
        </p>
      </div>

      {/* Author Information Section */}
      <AuthorSection
        authorText={authorText}
        setAuthorText={setAuthorText}
        authorOutput={authorOutput}
        handleAuthorConvert={handleAuthorConvert}
      />

      {/* Keyword Section */}
      <KeywordSection
        keywordText={keywordText}
        setKeywordText={setKeywordText}
        keywordOutput={keywordOutput}
        handleKeywordConvert={handleKeywordConvert}
      />

      {/* Reference Formatting Section */}
      <ReferenceSection output={output} setOutput={setOutput} />
    </div>
  );
}
