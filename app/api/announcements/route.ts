import { NextResponse } from "next/server";
import { readAnnouncements } from "@/lib/catalog-store";

export async function GET() {
  try {
    const announcements = await readAnnouncements(false);
    return NextResponse.json({ data: announcements });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read announcements." },
      { status: 500 }
    );
  }
}
