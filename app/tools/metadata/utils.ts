import { Author, Affiliation, AuthorOutput, KeywordOutput } from "./types";

export function parseAuthors(text: string): AuthorOutput {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const authors: Author[] = [];
  const affiliations: Affiliation[] = [];
  const affiliationsMap: Map<number, string> = new Map();

  // Parse author lines - can span multiple lines until we hit a numbered affiliation
  const authorLines: string[] = [];
  let currentLine = 0;

  // Collect author lines
  while (currentLine < lines.length && !lines[currentLine].match(/^\d+/)) {
    authorLines.push(lines[currentLine]);
    currentLine++;
  }

  // Parse authors
  const authorText = authorLines.join(" ");
  const authorMatches = authorText.matchAll(/([^,]+?)((?:\d+,)*\d+)(\*)?(?:,\s*|$)/g);

  for (const match of authorMatches) {
    const name = match[1].trim();
    const affNumbers = match[2].split(",").map((n) => parseInt(n.trim()));
    const isCorresponding = !!match[3];

    authors.push({
      name,
      affiliations: affNumbers,
      isCorresponding
    });
  }

  // Parse affiliations - starts with a number
  while (currentLine < lines.length - 1) {
    const match = lines[currentLine].match(/^(\d+)(.+)$/);
    if (match) {
      affiliations.push({
        id: parseInt(match[1]),
        text: match[2].trim()
      });
      affiliationsMap.set(parseInt(match[1]), match[2].trim());
    }
    currentLine++;
  }

  // Parse corresponding author email
  const emailLine = lines[lines.length - 1];
  if (emailLine && emailLine.toLowerCase().includes("corresponding author")) {
    const emailMatch = emailLine.match(/:\s*(.+@.+)$/);
    if (emailMatch) {
      const email = emailMatch[1].trim();
      const correspondingAuthor = authors.find((a) => a.isCorresponding);
      if (correspondingAuthor) {
        correspondingAuthor.email = email;
      }
    }
  }

  return { authors, affiliations };
}

export function cleanHtml(content: string): string {
  // Create a temporary element to handle HTML content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // Get inner HTML and clean it up
  let cleanHtml = tempDiv.innerHTML
    // Remove multiple &nbsp; sequences anywhere in the text
    .replace(/(&nbsp;){2,}/g, "")
    // Remove any remaining single &nbsp; at the end
    .replace(/&nbsp;$/g, "")
    // Remove paragraph tags but maintain line breaks
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n");

  // Remove extra line breaks and trim
  cleanHtml = cleanHtml.replace(/\n{3,}/g, "\n\n").trim();

  return cleanHtml;
}

export function parseKeywords(text: string): KeywordOutput {
  // Split by semicolon and trim each keyword
  const keywords = text
    .split(";")
    .map(keyword => keyword.trim())
    .filter(Boolean);
  
  return { keywords };
}
