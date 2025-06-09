import type { Journal } from "@/constants";

export interface ConvertJournalRequest {
  html: string;
  fromJournal: Journal;
  toJournal: Journal;
}

export interface ConvertJournalResponse {
  html: string;
  replacements: {
    from: string;
    to: string;
    count: number;
  }[];
}