"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { _JOURNAL_PUBLICATION_DATA } from "@/constants";
import { convertJournalAction } from "../actions";
import type { ConvertJournalResponse } from "../types";
import { ClipboardCopy, ClipboardPaste } from "lucide-react";

export default function ConvertForm() {
  const [html, setHtml] = useState("");
  const [fromJournal, setFromJournal] = useState("");
  const [toJournal, setToJournal] = useState("");
  const [result, setResult] = useState<ConvertJournalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await convertJournalAction(html, fromJournal, toJournal);
      setResult(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setHtml(text);
    } catch (error) {
      setError("Failed to paste from clipboard");
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto p-4">
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Select
              value={fromJournal}
              onValueChange={setFromJournal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Convert from..." />
              </SelectTrigger>
              <SelectContent>
                {_JOURNAL_PUBLICATION_DATA.map((journal) => (
                  <SelectItem key={journal.path} value={journal.path}>
                    {journal.journal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={toJournal}
              onValueChange={setToJournal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Convert to..." />
              </SelectTrigger>
              <SelectContent>
                {_JOURNAL_PUBLICATION_DATA.map((journal) => (
                  <SelectItem key={journal.path} value={journal.path}>
                    {journal.journal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Input HTML:</div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                <ClipboardPaste className="h-4 w-4 mr-1" />
                Paste
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(html)}
                disabled={!html}
                title="Copy to clipboard"
              >
                <ClipboardCopy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Paste HTML content here..."
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={10}
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!html || !fromJournal || !toJournal || loading}
        >
          {loading ? "Converting..." : "Convert"}
        </Button>

        {error && (
          <div className="text-red-500">{error}</div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="font-medium">Replacements:</div>
            <ul className="list-disc pl-6">
              {result.replacements.map((r) => (
                <li key={`${r.from}-${r.to}`}>
                  Replaced {r.count} occurrence(s) of &quot;{r.from}&quot; with &quot;{r.to}&quot;
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <div className="font-medium">Converted HTML:</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(result.html)}
                title="Copy converted HTML"
              >
                <ClipboardCopy className="h-4 w-4 mr-1" />
                Copy Result
              </Button>
            </div>
            <Textarea
              value={result.html}
              readOnly
              rows={10}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
