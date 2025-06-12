import {
  CalendarDaysIcon,
  CalendarIcon,
  ChevronDownIcon,
  FileBarChartIcon,
  FileEditIcon,
  FileTextIcon,
  FileUpIcon,
  MailCheckIcon
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
const toolGroups = [
  {
    title: "Document Processing",
    items: [
      {
        title: "HTML Formatter",
        url: "/tools/html-formatter",
        icon: FileTextIcon
      },
      {
        title: "Journal Convert",
        url: "/tools/journal-convert",
        icon: FileEditIcon
      },
      {
        title: "XML Convert",
        url: "/tools/ojs-convert",
        icon: FileUpIcon
      },
      {
        title: "Metadata",
        url: "/tools/metadata",
        icon: FileTextIcon
      }
    ]
  },
  {
    title: "Publication Management",
    items: [
      {
        title: "Publication",
        url: "/tools/publication",
        icon: CalendarIcon
      },
      {
        title: "Redif Analysis",
        url: "/tools/redif-analysis",
        icon: FileBarChartIcon
      },
      {
        title: "Calendar Export",
        url: "/tools/calendar-export",
        icon: CalendarDaysIcon
      }
    ]
  },
  {
    title: "Server Tools",
    items: [
      {
        title: "SMTP Check",
        url: "/tools/smtp-check",
        icon: MailCheckIcon
      }
    ]
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
        {toolGroups.map((group) => (
          <Collapsible key={group.title} defaultOpen className='group/collapsible'>
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className='cursor-pointer'>
                  {group.title}
                  <ChevronDownIcon className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
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
        ))}
      </SidebarContent>
      <SidebarFooter className='px-4 py-2 flex justify-center'>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
