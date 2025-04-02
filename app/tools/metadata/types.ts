export interface Author {
  name: string;
  affiliations: number[];
  isCorresponding: boolean;
  email?: string;
}

export interface Affiliation {
  id: number;
  text: string;
}

export interface AuthorOutput {
  authors: Author[];
  affiliations: Affiliation[];
}

export type TabType = "input" | "result";