import { NextRequest, NextResponse } from "next/server";
import { readFaculty } from "@/lib/catalog-store";

export async function GET(request: NextRequest) {
  try {
    const includeArchived = request.nextUrl.searchParams.get("includeArchived") === "1";
    const faculty = await readFaculty(includeArchived);
    return NextResponse.json({ data: faculty });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read faculty." },
      { status: 500 }
    );
  }
}
