import {
  CalendarDaysIcon,
  CalendarIcon,
  ChevronDownIcon,
  FileBarChartIcon,
  FileTextIcon,
  FileUpIcon,
  MailCheckIcon,
  FileEditIcon
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

// Menu items.
const items = [
  {
    title: "Metadata",
    url: "/tools/metadata",
    icon: FileTextIcon
  },
  {
    title: "SMTP Check",
    url: "/tools/smtp-check",
    icon: MailCheckIcon
  },
  {
    title: "Publication",
    url: "/tools/publication",
    icon: CalendarIcon
  },
  {
    title: "Calendar Export",
    url: "/tools/calendar-export",
    icon: CalendarDaysIcon
  },
  {
    title: "OJS Convert",
    url: "/tools/ojs-convert",
    icon: FileUpIcon
  },
  {
    title: "Journal Convert",
    url: "/tools/journal-convert",
    icon: FileEditIcon
  },
  {
    title: "Redif Analysis",
    url: "/tools/redif-analysis",
    icon: FileBarChartIcon
  }
];

export function AppSidebar() {
  return (
    <Sidebar side='left'>
      <SidebarHeader className='px-4 py-2'>
        <Link href='/' className='flex items-center space-x-2'>
          <span className='text-lg font-semibold'>Tool Support JOS</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className='group/collapsible'>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className='cursor-pointer'>
                Tools
                <ChevronDownIcon className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter className='px-4 py-2 flex justify-center'>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
