import { NextRequest, NextResponse } from "next/server";
import { readCourses } from "@/lib/catalog-store";

export async function GET(request: NextRequest) {
  try {
    const includeArchived = request.nextUrl.searchParams.get("includeArchived") === "1";
    const courses = await readCourses(includeArchived);
    return NextResponse.json({ data: courses });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read courses." },
      { status: 500 }
    );
  }
}
