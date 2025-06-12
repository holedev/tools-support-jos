import type { ConvertJournalRequest, ConvertJournalResponse } from "./types";

export function convertJournal(request: ConvertJournalRequest): ConvertJournalResponse {
  const { html, fromJournal, toJournal } = request;
  let convertedHtml = html;
  const replacements = [];

  // Helper function to escape regex special characters
  const escapeRegex = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Replace all occurrences of path abbreviation (e.g., "econ-en" -> "tech-en")
  const abbrRegex = new RegExp(escapeRegex(fromJournal.path), "g");
  const abbrMatches = html.match(abbrRegex);
  if (abbrMatches) {
    convertedHtml = convertedHtml.replace(abbrRegex, toJournal.path);
    replacements.push({
      from: fromJournal.path,
      to: toJournal.path,
      count: abbrMatches.length
    });
  }

  // Replace journal fullName
  const fullNameRegex = new RegExp(escapeRegex(fromJournal.fullName), "gi");
  const fullNameMatches = html.match(fullNameRegex);
  if (fullNameMatches) {
    convertedHtml = convertedHtml.replace(fullNameRegex, toJournal.fullName);
    replacements.push({
      from: fromJournal.fullName,
      to: toJournal.fullName,
      count: fullNameMatches.length
    });
  }

  return {
    html: convertedHtml,
    replacements
  };
}
