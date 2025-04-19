"use client";

import { Code2, FileCode, Library } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    name: "Tools",
    description: "Manage tools and utilities for your projects",
    icon: <FileCode className='h-6 w-6' />,
    href: "/tools"
  },
  {
    name: "API Documentation",
    description: "Browse and explore API documentation",
    icon: <Code2 className='h-6 w-6' />,
    href: "/docs"
  },
  {
    name: "API Library",
    description: "Collection of useful API endpoints",
    icon: <Library className='h-6 w-6' />,
    href: "/api/docs"
  }
];

export function HomePage(): React.ReactElement {
  return (
    <div className='container space-y-8 py-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-4xl font-bold tracking-tight'>Developer Tools</h1>
        <p className='text-muted-foreground text-lg'>A collection of tools to enhance your development workflow</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className='group hover:bg-accent relative rounded-lg border p-6 transition-colors'
          >
            <div className='bg-background group-hover:border-background flex h-12 w-12 items-center justify-center rounded-full border group-hover:shadow'>
              {tool.icon}
            </div>
            <div className='mt-4 space-y-2'>
              <h2 className='group-hover:text-accent-foreground text-xl font-semibold'>{tool.name}</h2>
              <p className='text-muted-foreground group-hover:text-accent-foreground/90'>{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
