import ConvertForm from "./components/convert-form.client";

export const metadata = {
  title: "Journal HTML Converter",
  description: "Convert HTML content between different journals"
};

export default function JournalConvertPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Journal HTML Converter</h1>
      <ConvertForm />
    </div>
  );
}
