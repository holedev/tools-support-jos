import { XMLBuilder, XMLParser } from "fast-xml-parser";
import type { X2jOptions, XmlBuilderOptions } from "fast-xml-parser";
import type { ParsedXML } from "./types";

export function restoreXml(str: string): string {
  return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

export function escapeXml(str: string): string {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function createParser() {
  const options: X2jOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    isArray: (name: string) =>
      [
        "id",
        "title",
        "abbrev",
        "policy",
        "article",
        "author",
        "article_galley",
        "abstract",
        "keywords",
        "disciplines",
        "affiliation",
        "familyname",
        "givenname",
        "citation"
      ].includes(name),
    parseAttributeValue: true,
    parseTagValue: true,
    trimValues: true
  };
  return new XMLParser(options);
}

export function createBuilder() {
  const options: XmlBuilderOptions = {
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    suppressBooleanAttributes: false
  };
  return new XMLBuilder(options);
}

export function validateParsedData(data: ParsedXML): void {
  if (!data?.issue) {
    throw new Error("Invalid XML: Missing issue element");
  }

  if (!data.issue.sections) {
    throw new Error("Invalid XML: No sections found");
  }

  const articles = data.issue.articles;

  if (!articles) {
    throw new Error("Invalid XML: No articles found");
  }
}
