export interface ArticleMetadata {
  id: string; // DOI or Handle
  journal: string; // Journal abbreviation (tech-en, tech-vi, etc.)
  issue: string; // format: volume(issue)year
  year: string;
  firstAuthor: string;
  firstAuthorCategory: "OU" | "NonOU" | "Foreign";
  authorsOU: number;
  authorsNonOU: number;
  authorsForeign: number;
  month: string; // blank for now
  hasAuthorForeign: number; // 1 if any author is Foreign, else 0
}

export interface AuthorInfo {
  name: string;
  workplace: string;
  category: "OU" | "NonOU" | "Foreign";
  email?: string;
}

export interface RedifArticle {
  id: string;
  journal: string;
  volume: string;
  issue: string;
  year: string;
  authors: AuthorInfo[];
  firstAuthor: string;
  firstAuthorCategory: "OU" | "NonOU" | "Foreign";
}

export interface FileParseResult {
  filename: string;
  articles: RedifArticle[];
}

export interface AnalysisResult {
  articles: ArticleMetadata[];
  totalArticles: number;
  totalAuthorsOU: number;
  totalAuthorsNonOU: number;
  totalAuthorsForeign: number;
}
