"use server";

import type { ConvertJournalRequest } from "./types";
import { convertJournal } from "./utils";
import { _JOURNAL_PUBLICATION_DATA } from "@/constants";

export async function convertJournalAction(html: string, fromJournalPath: string, toJournalPath: string) {
  try {
    const fromJournal = _JOURNAL_PUBLICATION_DATA.find(j => j.path === fromJournalPath);
    const toJournal = _JOURNAL_PUBLICATION_DATA.find(j => j.path === toJournalPath);

    if (!fromJournal || !toJournal) {
      throw new Error("Invalid journal paths provided");
    }

    if (!html || typeof html !== "string") {
      throw new Error("HTML content is required");
    }

    const convertRequest: ConvertJournalRequest = {
      html,
      fromJournal,
      toJournal
    };

    return convertJournal(convertRequest);
  } catch (error) {
    console.error("Error converting journal:", error);
    throw error;
  }
}