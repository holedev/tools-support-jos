import { RedifUploadForm } from "./components/upload-form.client";

export default function RedifAnalysisPage() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>Redif File Analysis</h1>
      <p className='text-sm text-gray-600 mb-4'>
        Upload one or more .redif files to analyze author statistics and publication details (This tool use for export
        .redif to .csv files).
      </p>
      <RedifUploadForm />
    </div>
  );
}
