"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BarChart3 } from "lucide-react";
import * as React from "react";
import type { Journal } from "../types";

interface StatsSheetProps {
  data: Journal[];
}

export function StatsSheet({ data }: StatsSheetProps) {
  const stats = React.useMemo(() => {
    const totalIssues = data.reduce((sum, journal) => sum + journal.publicationDate.length, 0);
    const issuesPerJournal = data.map((journal) => ({
      name: journal.journal,
      issuesPerYear: journal.publicationDate.length
    }));

    // Sort by number of issues in descending order
    issuesPerJournal.sort((a, b) => b.issuesPerYear - a.issuesPerYear);

    return {
      totalIssues,
      issuesPerJournal
    };
  }, [data]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon'>
          <BarChart3 className='h-4 w-4' />
        </Button>
      </SheetTrigger>
      <SheetContent className='p-4'>
        <SheetHeader>
          <SheetTitle>Overall Statistics</SheetTitle>
        </SheetHeader>
        <Card className='p-4'>
          <div className='space-y-4 py-4'>
            <h3 className='text-lg font-semibold mb-2'>Total Issues</h3>
            <p className='text-3xl font-bold text-primary'>
              {stats.totalIssues}
              <span className='text-sm font-normal text-muted-foreground ml-2'>issues/year</span>
            </p>
            <h3 className='text-lg font-semibold mb-4'>Issues per Journal</h3>
            <ScrollArea className='h-[400px] pr-4'>
              <div className='space-y-2'>
                {stats.issuesPerJournal.map((journal) => (
                  <div key={journal.name} className='flex flex-col gap-1 justify-between items-start text-sm'>
                    <div className='truncate' title={journal.name}>
                      {journal.name}
                    </div>
                    <div className='font-semibold'>{journal.issuesPerYear} issues/year</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
