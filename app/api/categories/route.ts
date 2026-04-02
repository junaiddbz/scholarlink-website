import { NextRequest, NextResponse } from "next/server";
import { readCategories } from "@/lib/catalog-store";

export async function GET(request: NextRequest) {
  try {
    const includeArchived = request.nextUrl.searchParams.get("includeArchived") === "1";
    const categories = await readCategories(includeArchived);
    return NextResponse.json({ data: categories });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read categories." },
      { status: 500 }
    );
  }
}
