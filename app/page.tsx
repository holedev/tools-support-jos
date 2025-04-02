import { Suspense } from "react";
import { HomePage } from "./page.client";
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
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className='rounded-lg border p-6'>
                  <Skeleton className='h-12 w-12 rounded-full' />
                  <div className='mt-4 space-y-2'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-4 w-48' />
                  </div>
                </div>
              ))}
          </div>
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
