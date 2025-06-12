import ConvertForm from "./components/convert-form.client";

export const metadata = {
  title: "Journal HTML Converter",
  description: "Convert HTML content between different journals"
};

export default function JournalConvertPage() {
  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-2xl font-bold mb-4'>Journal HTML Converter</h1>
      <div className='mb-6'>
        <p className='text-muted-foreground'>
          Convert and standardize HTML content between different journal formats. Helps you transform content while
          maintaining structure and preserving formatting standards.
        </p>
      </div>
      <ConvertForm />
    </div>
  );
}
