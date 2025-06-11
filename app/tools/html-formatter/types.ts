export interface HtmlFormatterState {
  input: string;
  output: string;
  type: "format" | "minify";
}

export interface HtmlFormatterResponse {
  output: string;
  error?: string;
}