import { type Journal, _JOURNAL_PUBLICATION_DATA } from "@/constants";
import { DataTable } from "./components/data-table";
import { StatsSheet } from "./components/stats-sheet";

function calculateStats(journals: Journal[]) {
  const totalIssues = journals.reduce((sum, journal) => sum + journal.publicationDate.length, 0);
  const issuesPerJournal = journals.map((journal) => ({
    name: journal.journal,
    issuesPerYear: journal.publicationDate.length
  }));

  return {
    totalIssues,
    issuesPerJournal
  };
}

export default function PublicationFrequencyPage() {
  const _ = calculateStats(_JOURNAL_PUBLICATION_DATA);

  return (
    <div className='mx-auto p-2'>
      <div className='flex flex-col gap-8'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-bold'>Publication Frequency</h1>
            <p className='text-muted-foreground'>View publication frequency for different journals by month.</p>
          </div>
          <StatsSheet data={_JOURNAL_PUBLICATION_DATA} />
        </div>
        <DataTable data={_JOURNAL_PUBLICATION_DATA} />
      </div>
    </div>
  );
}
