"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Journal } from "../types";

export const columns: ColumnDef<Journal>[] = [
  {
    accessorKey: "journal",
    header: "Journal Name",
  },
  {
    id: "01",
    header: "Jan",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("01") ? "✓" : "-";
    },
  },
  {
    id: "02",
    header: "Feb",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("02") ? "✓" : "-";
    },
  },
  {
    id: "03",
    header: "Mar",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("03") ? "✓" : "-";
    },
  },
  {
    id: "04",
    header: "Apr",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("04") ? "✓" : "-";
    },
  },
  {
    id: "05",
    header: "May",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("05") ? "✓" : "-";
    },
  },
  {
    id: "06",
    header: "Jun",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("06") ? "✓" : "-";
    },
  },
  {
    id: "07",
    header: "Jul",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("07") ? "✓" : "-";
    },
  },
  {
    id: "08",
    header: "Aug",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("08") ? "✓" : "-";
    },
  },
  {
    id: "09",
    header: "Sep",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("09") ? "✓" : "-";
    },
  },
  {
    id: "10",
    header: "Oct",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("10") ? "✓" : "-";
    },
  },
  {
    id: "11",
    header: "Nov",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("11") ? "✓" : "-";
    },
  },
  {
    id: "12",
    header: "Dec",
    cell: ({ row }) => {
      const dates = row.original.publicationDate;
      return dates.includes("12") ? "✓" : "-";
    },
  },
];