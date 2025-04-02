import { Suspense } from "react";
import { ToolsPage } from "./page.client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className='container py-6 space-y-8'>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-10 w-64' />
            <Skeleton className='h-6 w-96' />
          </div>
          <div className='space-y-8'>
            {Array(1)
              .fill(0)
              .map((_, i) => (
                <div key={i} className='rounded-lg border p-6'>
                  <div className='flex items-start gap-4'>
                    <Skeleton className='h-12 w-12 rounded-full' />
                    <div className='flex-1 space-y-4'>
                      <div>
                        <Skeleton className='h-8 w-48' />
                        <Skeleton className='mt-2 h-16 w-full' />
                      </div>
                      <div className='space-y-3'>
                        <Skeleton className='h-6 w-32' />
                        <div className='space-y-2'>
                          {Array(4)
                            .fill(0)
                            .map((_, j) => (
                              <Skeleton key={j} className='h-4 w-full' />
                            ))}
                        </div>
                      </div>
                      <Skeleton className='h-10 w-24' />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      }
    >
      <ToolsPage />
    </Suspense>
  );
}
