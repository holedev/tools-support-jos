"use client";

import { FileCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const tools = [
  {
    name: "Metadata Generator",
    description:
      "Generate and manage metadata for your projects. Create standardized metadata entries with author information and references.",
    icon: <FileCode className='h-6 w-6' />,
    href: "/tools/metadata"
  }
];

export function ToolsPage() {
  return (
    <div className='container space-y-8 py-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-4xl font-bold tracking-tight'>Development Tools</h1>
        <p className='text-muted-foreground text-lg'>Explore our collection of development tools and utilities</p>
      </div>

      <div className='grid gap-8'>
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
