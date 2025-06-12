"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { HtmlFormatterState } from "../types";
import { formatHtml, minifyHtml } from "../utils";

export function ConvertForm() {
  const [state, setState] = useState<HtmlFormatterState>({
    input: "",
    output: "",
    type: "format"
  });

  const handleFormat = () => {
    try {
      setState((prev) => ({
        ...prev,
        output: formatHtml(prev.input)
      }));
    } catch (error) {
      if (error instanceof Error) {
        setState((prev) => ({ ...prev, output: `Error: ${error.message}` }));
      }
    }
  };

  const handleCopyFormatted = async () => {
    try {
      await navigator.clipboard.writeText(state.output);
    } catch (error) {
      console.error("Failed to copy formatted text:", error);
    }
  };

  const handleCopyMinified = async () => {
    try {
      await navigator.clipboard.writeText(minifyHtml(state.output || state.input));
    } catch (error) {
      console.error("Failed to copy minified text:", error);
    }
  };

  return (
    <div className='space-y-4'>
      <Card className='p-4'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='input-html'>Input HTML</Label>
            <Textarea
              id='input-html'
              placeholder='Paste your HTML code here...'
              value={state.input}
              onChange={(e) => setState((prev) => ({ ...prev, input: e.target.value }))}
              className='min-h-[200px] font-mono'
            />
          </div>

          <div className='flex justify-end'>
            <Button onClick={handleFormat}>Format</Button>
          </div>

          <Tabs defaultValue='formatted' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='formatted'>Formatted</TabsTrigger>
              <TabsTrigger value='minified'>Minified</TabsTrigger>
            </TabsList>

            <TabsContent value='formatted' className='space-y-2'>
              <div className='flex justify-between items-center'>
                <Label htmlFor='formatted-output'>Formatted Output</Label>
                <Button variant='outline' size='sm' onClick={handleCopyFormatted}>
                  Copy Formatted
                </Button>
              </div>
              <Textarea
                id='formatted-output'
                value={state.output}
                onChange={(e) => setState((prev) => ({ ...prev, output: e.target.value }))}
                className='min-h-[200px] font-mono'
              />
            </TabsContent>

            <TabsContent value='minified' className='space-y-2'>
              <div className='flex justify-between items-center'>
                <Label htmlFor='minified-output'>Minified Output</Label>
                <Button variant='outline' size='sm' onClick={handleCopyMinified}>
                  Copy Minified
                </Button>
              </div>
              <Textarea
                id='minified-output'
                value={minifyHtml(state.output || state.input)}
                readOnly
                className='min-h-[200px] font-mono'
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
