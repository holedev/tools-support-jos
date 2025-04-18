import { Card } from "@/components/ui/card";
import { Journal } from "./types";
import { DataTable } from "./components/data-table";

const data: Journal[] = [
  {
    "journal": "ECONOMICS AND BUSINESS ADMINISTRATION",
    "publicationDate": ["01", "02", "04", "06", "07", "08"]
  },
  {
    "journal": "ENGINEERING AND TECHNOLOGY",
    "publicationDate": ["03", "10"]
  },
  {
    "journal": "SOCIAL SCIENCES",
    "publicationDate": ["02", "04", "06", "08", "10", "12"]
  },
  {
    "journal": "ADVANCES IN COMPUTATIONAL STRUCTURES",
    "publicationDate": ["03", "08"]
  },
  {
    "journal": "KINH TẾ VÀ QUẢN TRỊ KINH DOANH",
    "publicationDate": ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  },
  {
    "journal": "KỸ THUẬT VÀ CÔNG NGHỆ",
    "publicationDate": ["04", "09"]
  },
  {
    "journal": "KHOA HỌC XÃ HỘI",
    "publicationDate": ["05", "11"]
  }
];

function calculateStats(journals: Journal[]) {
  const totalIssues = journals.reduce((sum, journal) => sum + journal.publicationDate.length, 0);
  const issuesPerJournal = journals.map(journal => ({
    name: journal.journal,
    issuesPerYear: journal.publicationDate.length
  }));

  return {
    totalIssues,
    issuesPerJournal
  };
}

export default function PublicationFrequencyPage() {
  const stats = calculateStats(data);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Publication Frequency</h1>
          <p className="text-muted-foreground">
            View publication frequency for different journals by month.
          </p>
        </div>
        <DataTable data={data} />
      </div>
    </div>
  );
}