"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Journal } from "../types";

const isVietnamese = (text: string) => /[\u00C0-\u1EF9]/.test(text);

const getIssueNumber = (journal: Journal, month: string, year = 2025) => {
  const isVi = isVietnamese(journal.journal);
  const baseVolume = isVi ? 20 : 15;
  const volume = baseVolume + (year - 2025);

  // Find position of this month in the journal's publication dates
  const position = journal.publicationDate.sort((a, b) => Number.parseInt(a) - Number.parseInt(b)).indexOf(month) + 1;

  return position > 0 ? `${volume}(${position})${year}` : "";
};

export const columns: ColumnDef<Journal>[] = [
  {
    accessorKey: "journal",
    header: "Journal Name"
  },
  {
    id: "01",
    header: "Jan",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("01") ? getIssueNumber(row.original, "01") : "-";
    }
  },
  {
    id: "02",
    header: "Feb",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("02") ? getIssueNumber(row.original, "02") : "-";
    }
  },
  {
    id: "03",
    header: "Mar",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("03") ? getIssueNumber(row.original, "03") : "-";
    }
  },
  {
    id: "04",
    header: "Apr",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("04") ? getIssueNumber(row.original, "04") : "-";
    }
  },
  {
    id: "05",
    header: "May",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("05") ? getIssueNumber(row.original, "05") : "-";
    }
  },
  {
    id: "06",
    header: "Jun",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("06") ? getIssueNumber(row.original, "06") : "-";
    }
  },
  {
    id: "07",
    header: "Jul",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("07") ? getIssueNumber(row.original, "07") : "-";
    }
  },
  {
    id: "08",
    header: "Aug",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("08") ? getIssueNumber(row.original, "08") : "-";
    }
  },
  {
    id: "09",
    header: "Sep",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("09") ? getIssueNumber(row.original, "09") : "-";
    }
  },
  {
    id: "10",
    header: "Oct",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("10") ? getIssueNumber(row.original, "10") : "-";
    }
  },
  {
    id: "11",
    header: "Nov",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("11") ? getIssueNumber(row.original, "11") : "-";
    }
  },
  {
    id: "12",
    header: "Dec",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("12") ? getIssueNumber(row.original, "12") : "-";
    }
  }
];
