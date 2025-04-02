"use client";

import React from "react";
import SwaggerUIReact from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface SwaggerUIProps {
  spec: Record<string, unknown>;
}

export default function SwaggerUI({ spec }: SwaggerUIProps): React.ReactElement {
  return (
    <div className='swagger-ui-container'>
      <SwaggerUIReact
        spec={spec}
        docExpansion='list'
        defaultModelsExpandDepth={-1}
        supportedSubmitMethods={["get", "post", "put", "delete"]}
        tryItOutEnabled={true}
        persistAuthorization={true}
        filter={true}
      />
    </div>
  );
}
