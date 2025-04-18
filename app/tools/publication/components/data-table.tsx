"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Journal } from "../types";
import { columns } from "./columns";
import { StatsSheet } from "./stats-sheet";

interface DataTableProps {
  data: Journal[];
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const languages = [
  { value: "all", label: "All Languages" },
  { value: "vi", label: "Vietnamese" },
  { value: "en", label: "English" },
];

interface MonthRangeFilter {
  from: string;
  to: string;
}

const isVietnamese = (text: string) => /[\u00C0-\u1EF9]/.test(text);

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [monthRange, setMonthRange] = React.useState<MonthRangeFilter>({ from: "", to: "" });
  const [language, setLanguage] = React.useState("all");

  const filteredData = React.useMemo(() => {
    if (language === "all") return data;
    
    return data.filter(journal => {
      const isVi = isVietnamese(journal.journal);
      return language === "vi" ? isVi : !isVi;
    });
  }, [data, language]);

  // Calculate total issues for filtered data in selected range
  const filteredTotalIssues = React.useMemo(() => {
    if (!monthRange.from || !monthRange.to) {
      return filteredData.reduce((sum, journal) => sum + journal.publicationDate.length, 0);
    }

    const fromMonth = parseInt(monthRange.from);
    const toMonth = parseInt(monthRange.to);
    
    return filteredData.reduce((total, journal) => {
      const issuesInRange = journal.publicationDate.filter(month => {
        const monthNum = parseInt(month);
        if (fromMonth <= toMonth) {
          return monthNum >= fromMonth && monthNum <= toMonth;
        } else {
          return monthNum >= fromMonth || monthNum <= toMonth;
        }
      }).length;
      return total + issuesInRange;
    }, 0);
  }, [filteredData, monthRange]);

  // Update column visibility based on month range
  React.useEffect(() => {
    if (!monthRange.from || !monthRange.to) {
      setColumnVisibility({});
      return;
    }

    const fromMonth = parseInt(monthRange.from);
    const toMonth = parseInt(monthRange.to);
    
    const newVisibility: VisibilityState = {};
    newVisibility["journal"] = true;

    for (let i = 1; i <= 12; i++) {
      const monthStr = i.toString().padStart(2, '0');
      if (fromMonth <= toMonth) {
        newVisibility[monthStr] = i >= fromMonth && i <= toMonth;
      } else {
        newVisibility[monthStr] = i >= fromMonth || i <= toMonth;
      }
    }

    setColumnVisibility(newVisibility);
  }, [monthRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 py-4">
        <div className="flex-1 flex items-center gap-4">
          <Input
            placeholder="Filter journals..."
            value={(table.getColumn("journal")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("journal")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={language}
            onValueChange={setLanguage}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {filteredTotalIssues > 0 && (
            <div className="text-sm">
              <span className="font-medium">{filteredTotalIssues}</span>
              <span className="text-muted-foreground ml-1">
                issues {monthRange.from && monthRange.to ? 'in period' : 'total'}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={monthRange.from}
            onValueChange={(value: string) => setMonthRange({ ...monthRange, from: value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="From month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span>to</span>
          <Select
            value={monthRange.to}
            onValueChange={(value: string) => setMonthRange({ ...monthRange, to: value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="To month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {(monthRange.from || monthRange.to) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMonthRange({ from: "", to: "" })}
            >
              Reset
            </Button>
          )}
          <StatsSheet data={data} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={header.column.id === "journal" ? "" : "text-center"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className={
                        cell.column.id === "journal" 
                          ? "" 
                          : "text-center"
                      }
                    >
                      {cell.column.id === "journal" ? (
                        <div className="font-medium">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ) : (
                        <div className={`${
                          flexRender(cell.column.columnDef.cell, cell.getContext()) === "✓" 
                            ? "text-green-600 font-bold" 
                            : "text-muted-foreground"
                        }`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {filteredData.length} journals
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}