import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ConverterForm } from "./components/converter-form.client";

export const metadata: Metadata = {
  title: "OJS XML Converter",
  description: "Convert XML files between OJS 2.4.8 and 3.1.2 formats"
};

export default function OJSConverterPage() {
  return (
    <div className='container mx-auto py-10'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>OJS XML Converter</h1>
        <p className='text-muted-foreground mb-8'>
          Convert XML files between OJS versions. Upload your OJS 2.4.8 XML file and get it converted to OJS 3.1.2
          format. Supports multi-language content and metadata.
        </p>
        <ConverterForm />
        <Toaster richColors closeButton position='top-right' />
      </div>
    </div>
  );
}
