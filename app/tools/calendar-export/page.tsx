import ExportForm from "./components/export-form.client";

export default function CalendarExportPage() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>Calendar Export Tool</h1>
      <p className='text-gray-600 mb-8'>
        Generate CSV files compatible with Google Calendar import. Choose your event schedule and download the CSV file.
      </p>
      <ExportForm />
    </div>
  );
}
