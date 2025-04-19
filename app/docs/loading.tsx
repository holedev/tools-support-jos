import type React from "react";

export default function Loading(): React.ReactElement {
  return (
    <div className='container mx-auto min-h-screen py-6'>
      <div className='animate-pulse'>
        <div className='mb-8 h-8 w-64 rounded bg-gray-200' />
        <div className='space-y-4'>
          {[...Array(6)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: not nescessary
            <div key={i} className='h-4 w-full rounded bg-gray-200' />
          ))}
        </div>
      </div>
    </div>
  );
}
