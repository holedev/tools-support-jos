import { ConvertForm } from "./components/convert-form.client";

export const metadata = {
  title: "HTML/JSON Formatter",
  description: "Convert between HTML and one-line JSON format with proper escaping"
};

export default function HtmlFormatterPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">HTML/JSON Formatter</h1>
        <p className="text-muted-foreground">
          Convert between HTML and one-line JSON format. Handles escaping of special characters
          and proper formatting for both directions.
        </p>
      </div>

      <ConvertForm />
    </div>
  );
}