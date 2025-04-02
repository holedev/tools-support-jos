import React from "react";

import { getApiDocs } from "@/lib/swagger";
import SwaggerUI from "@/components/swagger-ui";

export default async function ApiDoc(): Promise<React.ReactElement> {
  const spec = getApiDocs();
  return (
    <div className='container mx-auto min-h-screen bg-white py-6'>
      <div className='prose max-w-none'>
        <h1 className='mb-8 text-4xl font-bold'>API Documentation</h1>
        <div className='mt-8 rounded-lg bg-white p-4 shadow-lg'>
          <SwaggerUI spec={spec} />
        </div>
      </div>
    </div>
  );
}
