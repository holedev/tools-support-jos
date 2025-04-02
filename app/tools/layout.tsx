import React from "react";

export default function ToolsLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return <div className='flex flex-col gap-6'>{children}</div>;
}
