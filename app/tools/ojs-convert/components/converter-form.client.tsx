"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, FileUp, Maximize2, Settings } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { DEFAULT_CONFIG } from "../config";
import { type OJSConverterConfig, convertOJSXml } from "../xml-converter";
import { LoadingSpinner } from "./loading-spinner";

function truncateBase64(xml: string): string {
  const base64Pattern = /(<embed[^>]*>)([\s\S]*?)(<\/embed>)/g;
  return xml.replace(base64Pattern, (_match, openTag, content, closeTag) => {
    if (content.length > 100) {
      return `${openTag}[Base64 content truncated...]${closeTag}`;
    }
    return `${openTag}${content}${closeTag}`;
  });
}

function formatXml(input: string): string {
  return input.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

export function ConverterForm() {
  const [outputXml, setOutputXml] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fullXml, setFullXml] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<OJSConverterConfig>({
    ...DEFAULT_CONFIG,
    isOnlyEnglishVersion: true // Set default to true since it's used more often
  });

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".xml")) {
      toast.error("Please select an XML file");
      return;
    }

    setFileName(file.name);
    setOutputXml("");
    setFullXml("");
    setIsConverting(true);

    try {
      const text = await file.text();
      const result = convertOJSXml(text, config);

      const formattedXml = result;
      setFullXml(formattedXml);
      setOutputXml(truncateBase64(formattedXml));

      toast.success("XML converted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while converting";

      toast.error("Conversion failed", {
        description: errorMessage,
        duration: 5000
      });
      setOutputXml("");
      setFullXml("");
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullXml);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([fullXml], { type: "text/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(".xml", "_3.1.2.xml");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File downloaded successfully");
    } catch (err) {
      toast.error("Failed to download file");
    }
  };

  const updateConfig = (key: keyof OJSConverterConfig, value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className='grid gap-4'>
      <Card className='p-4'>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-medium'>XML Converter</h2>
            <Button variant='outline' size='sm' onClick={() => setShowSettings(!showSettings)}>
              <Settings className='h-4 w-4 mr-2' />
              Advanced Settings
            </Button>
          </div>

          <div className='flex items-center justify-between p-2 border rounded-lg'>
            <Label htmlFor='isOnlyEnglishVersion' className='font-medium'>
              English Version Only
            </Label>
            <Switch
              id='isOnlyEnglishVersion'
              checked={config.isOnlyEnglishVersion}
              onCheckedChange={(checked) => updateConfig("isOnlyEnglishVersion", checked)}
            />
          </div>

          {showSettings && (
            <div className='grid gap-4 p-4 border rounded-lg mb-4'>
              <div className='grid gap-2'>
                <Label htmlFor='sectionTitle'>Section Title</Label>
                <Input
                  id='sectionTitle'
                  value={config.sectionTitle}
                  onChange={(e) => updateConfig("sectionTitle", e.target.value)}
                  placeholder='Section Title'
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='sectionAbbr'>Section Abbreviation</Label>
                <Input
                  id='sectionAbbr'
                  value={config.sectionAbbr}
                  onChange={(e) => updateConfig("sectionAbbr", e.target.value)}
                  placeholder='Section Abbreviation'
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='authorUserGroup'>Author User Group</Label>
                <Input
                  id='authorUserGroup'
                  value={config.authorUserGroup}
                  onChange={(e) => updateConfig("authorUserGroup", e.target.value)}
                  placeholder='Author User Group'
                />
              </div>
            </div>
          )}

          <button
            type='button'
            className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              isConverting ? "cursor-not-allowed border-muted" : "cursor-pointer hover:border-primary"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            aria-label='Drop zone for XML file upload'
            disabled={isConverting}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='.xml'
              onChange={handleFileChange}
              className='hidden'
              aria-label='File input'
              disabled={isConverting}
            />
            <div className='text-muted-foreground space-y-2'>
              {isConverting ? (
                <div className='flex flex-col items-center gap-2'>
                  <LoadingSpinner />
                  <p>Converting XML...</p>
                </div>
              ) : fileName ? (
                <div className='flex items-center justify-center gap-2'>
                  <FileUp className='h-6 w-6' />
                  <span>Selected: {fileName}</span>
                </div>
              ) : (
                <>
                  <FileUp className='mx-auto h-8 w-8 text-muted-foreground/60' />
                  <p>Drag and drop your OJS 2.4.8 XML file here, or click to browse</p>
                  <p className='text-sm mt-1'>Only .xml files are supported</p>
                </>
              )}
            </div>
          </button>
        </div>
      </Card>

      {outputXml && (
        <Card className='p-4'>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <Label htmlFor='output-xml'>Output XML (OJS 3.1.2)</Label>
              <div className='space-x-2'>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <Maximize2 className='h-4 w-4 mr-2' />
                      View Full XML
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='bottom' className='h-[80vh]'>
                    <SheetHeader>
                      <SheetTitle>Converted XML</SheetTitle>
                      <SheetDescription>Complete XML content including base64 data</SheetDescription>
                    </SheetHeader>
                    <div className='mt-4 h-full overflow-auto'>
                      <Textarea value={fullXml} readOnly spellCheck={false} className='h-full font-mono text-sm' />
                    </div>
                  </SheetContent>
                </Sheet>
                <Button type='button' variant='outline' onClick={handleCopy} size='sm'>
                  <Copy className='h-4 w-4 mr-2' />
                  Copy
                </Button>
                <Button type='button' variant='default' onClick={handleDownload} size='sm'>
                  <Download className='h-4 w-4 mr-2' />
                  Download
                </Button>
              </div>
            </div>
            <div className='relative'>
              <Textarea
                id='output-xml'
                name='output-xml'
                value={outputXml}
                readOnly
                spellCheck={false}
                className='min-h-[200px] font-mono text-sm'
                aria-label='Output XML content (truncated)'
              />
              <div className='absolute bottom-2 right-2'>
                <p className='text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded'>
                  Base64 content truncated
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
