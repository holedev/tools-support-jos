import { ChevronDownIcon, FileTextIcon, MailCheckIcon, CalendarIcon } from "lucide-react";

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
import { ThemeToggle } from "./theme-toggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import Link from "next/link";

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
                    <SidebarMenuItem key={item.title} className=''>
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
