"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

// Static values for button text and labels
const BUTTON_LABELS = {
  srOnly: "Toggle theme",
  ariaLabel: "Toggle between light and dark theme"
} as const;

// Component for toggling between light and dark themes
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon'>
        <Sun className='h-5 w-5' />
        <span className='sr-only'>{BUTTON_LABELS.srOnly}</span>
      </Button>
    );
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={BUTTON_LABELS.ariaLabel}
    >
      {theme === "dark" ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
      <span className='sr-only'>{BUTTON_LABELS.srOnly}</span>
    </Button>
  );
}
