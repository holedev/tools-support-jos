import { NextResponse } from "next/server";

import { getApiDocs } from "@/lib/swagger";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(getApiDocs());
}
