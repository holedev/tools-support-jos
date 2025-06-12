import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext", "vietnamese", "cyrillic", "cyrillic-ext", "greek"],
  display: "swap"
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "latin-ext", "vietnamese", "cyrillic", "cyrillic-ext", "greek"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Tools Support JOS",
  description: "A website with tool support for work with OJS"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoMono.variable} bg-background min-h-screen antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <div className='relative flex min-h-screen'>
            <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              <main className='flex-1 px-4 py-2'>
                <SidebarTrigger />
                {children}
              </main>
            </SidebarProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
