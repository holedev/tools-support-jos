"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback, useState } from "react";
import type { AnalysisResult, ArticleMetadata, AuthorInfo, RedifArticle } from "../types";

export function RedifUploadForm() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const extractJournal = useCallback((id: string): string => {
    // Extract from DOI like 10.46223/HCMCOUJS.tech.en.14.2.2918.2024
    if (id.includes("DOI:") || id.startsWith("10.")) {
      const match = id.match(/HCMCOUJS\.((?:tech|econ|soci|acs))[.-]([a-z]{2})\./i);
      if (match) {
        const [, type, lang] = match;
        return `${type.toLowerCase()}-${lang.toLowerCase()}`;
      }
    }

    // Extract from RePEc handle like RePEc:bjw:techen:v:3:y:2013:i:1:p:3-10
    const match = id.match(/RePEc:bjw:((?:tech|econ|soci))([a-z]{2}):/i);
    if (match) {
      const [, type, lang] = match;
      return `${type.toLowerCase()}-${lang.toLowerCase()}`;
    }

    return "";
  }, []);

  const analyzeAuthors = useCallback((workplace: string): "OU" | "NonOU" | "Foreign" => {
    const normalized = workplace.toLowerCase();
    console.info("[upload-form.client.tsx:34] ", normalized);
    if (!normalized.endsWith("vietnam") && !normalized.endsWith("việt nam")) {
      return "Foreign";
    }
    if (
      normalized.includes("ho chi minh city open university") ||
      normalized.includes("đại học mở") ||
      normalized.includes("trường đại học mở")
    ) {
      return "OU";
    }
    return "NonOU";
  }, []);

  const parseRedifContent = useCallback(
    (content: string): RedifArticle[] => {
      const articles: RedifArticle[] = [];
      let currentArticle: Partial<RedifArticle> = {};
      let currentAuthors: AuthorInfo[] = [];

      const lines = content.split("\n");

      for (const line of lines) {
        const [key, ...valueParts] = line.split(": ");
        const value = valueParts.join(": ").trim();

        if (line.includes("Template-Type:")) {
          if (Object.keys(currentArticle).length > 0) {
            // First author is the first in the list
            const firstAuthor = currentAuthors[0]?.name || "";
            const firstAuthorCategory = currentAuthors[0]?.category || "NonOU";

            articles.push({
              ...(currentArticle as RedifArticle),
              authors: [...currentAuthors],
              firstAuthor,
              firstAuthorCategory,
              journal: extractJournal(currentArticle.id || "")
            });
          }
          currentArticle = {};
          currentAuthors = [];
          continue;
        }

        switch (key.trim()) {
          case "DOI":
            currentArticle.id = value;
            break;
          case "Handle":
            // Only use Handle if DOI is not set
            if (!currentArticle.id) {
              currentArticle.id = value;
            }
            break;
          case "Volume":
            currentArticle.volume = value;
            break;
          case "Issue":
            currentArticle.issue = value;
            break;
          case "Year":
            currentArticle.year = value;
            break;
          case "Author-Name":
            currentAuthors.push({
              name: value,
              workplace: "",
              category: "NonOU" // Will be updated when workplace is found
            });
            break;
          case "Author-Workplace-Name":
            if (currentAuthors.length > 0) {
              const lastAuthor = currentAuthors[currentAuthors.length - 1];
              lastAuthor.workplace = value;
              lastAuthor.category = analyzeAuthors(value);
            }
            break;
        }
      }

      // Add the last article if exists
      if (Object.keys(currentArticle).length > 0) {
        const firstAuthor = currentAuthors[0]?.name || "";
        const firstAuthorCategory = currentAuthors[0]?.category || "NonOU";

        articles.push({
          ...(currentArticle as RedifArticle),
          authors: [...currentAuthors],
          firstAuthor,
          firstAuthorCategory,
          journal: extractJournal(currentArticle.id || "")
        });
      }

      return articles;
    },
    [analyzeAuthors, extractJournal]
  );

  const processArticles = useCallback((articles: RedifArticle[]): AnalysisResult => {
    let totalAuthorsOU = 0;
    let totalAuthorsNonOU = 0;
    let totalAuthorsForeign = 0;

    const processed: ArticleMetadata[] = articles.map((article) => {
      const authorsOU = article.authors.filter((a) => a.category === "OU").length;
      const authorsNonOU = article.authors.filter((a) => a.category === "NonOU").length;
      const authorsForeign = article.authors.filter((a) => a.category === "Foreign").length;

      totalAuthorsOU += authorsOU;
      totalAuthorsNonOU += authorsNonOU;
      totalAuthorsForeign += authorsForeign;

      return {
        id: article.id,
        journal: article.journal,
        issue: `${article.volume}(${article.issue})${article.year}`,
        year: article.year,
        firstAuthor: article.firstAuthor,
        firstAuthorCategory: article.firstAuthorCategory,
        authorsOU,
        authorsNonOU,
        authorsForeign,
        month: "",
        hasAuthorForeign: article.authors.some((a) => a.category === "Foreign") ? 1 : 0
      };
    });

    return {
      articles: processed,
      totalArticles: articles.length,
      totalAuthorsOU,
      totalAuthorsNonOU,
      totalAuthorsForeign
    };
  }, []);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      const allArticles: RedifArticle[] = [];

      for (const file of files) {
        const content = await file.text();
        const articles = parseRedifContent(content);
        allArticles.push(...articles);
      }

      const analysisResult = processArticles(allArticles);
      setResult(analysisResult);
    },
    [parseRedifContent, processArticles]
  );

  const exportToCSV = useCallback(() => {
    if (!result) return;

    const headers = [
      "ID",
      "Journal",
      "Issue",
      "Year",
      "First Author",
      "OU Authors",
      "Non-OU Authors",
      "Foreign Authors",
      "Has Author Foreign",
      "Month"
    ];

    const rows = result.articles.map((article) => [
      article.id,
      article.journal,
      article.issue,
      article.year,
      article.firstAuthorCategory,
      article.authorsOU,
      article.authorsNonOU,
      article.authorsForeign,
      article.hasAuthorForeign,
      article.month
    ]);

    const csvContent = [headers.join(";"), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(";"))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "redif-analysis.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [result]);

  return (
    <div className='space-y-6'>
      <Card className='p-6'>
        <div className='flex items-center gap-4'>
          <Button asChild variant='secondary'>
            <label className='cursor-pointer'>
              Upload Redif Files
              <input type='file' className='hidden' multiple accept='.redif,.txt' onChange={handleFileUpload} />
            </label>
          </Button>
          {result && (
            <Button variant='outline' onClick={exportToCSV}>
              Export to CSV
            </Button>
          )}
        </div>
      </Card>

      {result && (
        <div className='space-y-6'>
          <Card className='p-4'>
            <h3 className='text-lg font-semibold mb-2'>Summary</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <p className='text-sm text-gray-500'>Total Articles</p>
                <p className='text-2xl font-bold'>{result.totalArticles}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>OU Authors</p>
                <p className='text-2xl font-bold'>{result.totalAuthorsOU}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Non-OU Authors</p>
                <p className='text-2xl font-bold'>{result.totalAuthorsNonOU}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Foreign Authors</p>
                <p className='text-2xl font-bold'>{result.totalAuthorsForeign}</p>
              </div>
            </div>
          </Card>

          <Card className='p-4'>
            <h3 className='text-lg font-semibold mb-4'>Articles</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Journal</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>First Author</TableHead>
                  <TableHead>OU Authors</TableHead>
                  <TableHead>Non-OU Authors</TableHead>
                  <TableHead>Foreign Authors</TableHead>
                  <TableHead>Has Author Foreign</TableHead>
                  <TableHead>Month</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className='font-mono'>{article.id}</TableCell>
                    <TableCell>{article.journal}</TableCell>
                    <TableCell>{article.issue}</TableCell>
                    <TableCell>{article.year}</TableCell>
                    <TableCell title={article.firstAuthor}>{article.firstAuthorCategory}</TableCell>
                    <TableCell>{article.authorsOU}</TableCell>
                    <TableCell>{article.authorsNonOU}</TableCell>
                    <TableCell>{article.authorsForeign}</TableCell>
                    <TableCell>{article.hasAuthorForeign}</TableCell>
                    <TableCell>{article.month}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
