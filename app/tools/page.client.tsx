"use client";

import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, FileCode, MailCheck, FileUp } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    name: "Metadata Generator",
    description:
      "Generate and manage metadata for your projects. Create standardized metadata entries with author information and references.",
    icon: <FileCode className='h-6 w-6' />,
    href: "/tools/metadata"
  },
  {
    name: "SMTP Check",
    description:
      "Test and verify SMTP server configurations. Supports Gmail SMTP with both regular and app password authentication.",
    icon: <MailCheck className='h-6 w-6' />,
    href: "/tools/smtp-check"
  },
  {
    name: "Publication Frequency",
    description:
      "View and analyze publication frequency patterns across different journals. Track monthly publication schedules and trends.",
    icon: <Calendar className='h-6 w-6' />,
    href: "/tools/publication"
  },
  {
    name: "Calendar Export",
    description:
      "Export and preview calendar data in various formats. Convert and format calendar entries for easy integration with different calendar systems.",
    icon: <CalendarDays className='h-6 w-6' />,
    href: "/tools/calendar-export"
  },
  {
    name: "OJS Convert",
    description:
      "Convert OJS 2.4.8 XML files to OJS 3.1.2 format. Configurable options for English-only or bilingual content with customizable section settings.",
    icon: <FileUp className='h-6 w-6' />,
    href: "/tools/ojs-convert"
  }
];

export function ToolsPage() {
  return (
    <div className='container space-y-8 py-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-4xl font-bold tracking-tight'>Development Tools</h1>
        <p className='text-muted-foreground text-lg'>Explore our collection of development tools and utilities</p>
      </div>

      <div className='grid gap-8 md:grid-cols-2'>
        {tools.map((tool) => (
          <div key={tool.name} className='group hover:bg-accent/50 rounded-lg border p-6 transition-colors'>
            <div className='flex items-start gap-4'>
              <div className='bg-background group-hover:border-background flex h-12 w-12 items-center justify-center rounded-full border group-hover:shadow'>
                {tool.icon}
              </div>
              <div className='flex-1 space-y-4'>
                <div>
                  <h2 className='group-hover:text-accent-foreground text-2xl font-semibold'>{tool.name}</h2>
                  <p className='text-muted-foreground group-hover:text-accent-foreground/90 mt-2 text-lg'>
                    {tool.description}
                  </p>
                </div>
                <Button asChild className='mt-4'>
                  <Link href={tool.href}>Open Tool</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
