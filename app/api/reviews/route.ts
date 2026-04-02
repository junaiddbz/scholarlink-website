import { NextRequest, NextResponse } from "next/server";
import { readReviews } from "@/lib/catalog-store";

export async function GET(request: NextRequest) {
  try {
    const includeUnpublished = request.nextUrl.searchParams.get("includeUnpublished") === "1";
    const reviews = await readReviews(includeUnpublished);
    return NextResponse.json({ data: reviews });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read reviews." },
      { status: 500 }
    );
  }
}
