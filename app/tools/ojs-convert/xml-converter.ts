import type { OJSConverterConfig } from "./config";
import { convertIssue } from "./converters";
import type { ParsedXML } from "./types";
import { createBuilder, createParser, validateParsedData } from "./utils";

export { restoreXml } from "./utils";
export type { OJSConverterConfig } from "./config";

export function convertOJSXml(oldXml: string, config: OJSConverterConfig = {}): string {
  try {
    const parser = createParser();
    const builder = createBuilder();

    const oldDoc = parser.parse(oldXml) as ParsedXML;
    validateParsedData(oldDoc);

    const issue = oldDoc.issue;
    const xmlBody = builder.build({ issue: convertIssue(issue, config) });
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    return xmlHeader + xmlBody;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`XML Processing Error: ${err.message}`);
    }
    throw new Error("An unexpected error occurred while processing the XML");
  }
}
