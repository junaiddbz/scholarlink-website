import { NextRequest, NextResponse } from "next/server";
import { createReview, deleteReview, upsertReview } from "@/lib/catalog-store";
import { requireAdmin } from "@/lib/admin-auth";
import type { ReviewItem } from "@/lib/reviews";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const payload = (await request.json()) as Partial<ReviewItem>;

    if (!payload.authorName || !payload.authorRole || !payload.program || !payload.content || !payload.rating || !payload.source || !payload.mediaType) {
      return NextResponse.json({ error: "Invalid review payload." }, { status: 400 });
    }

    const normalizedPayload = {
      authorName: payload.authorName,
      authorRole: payload.authorRole,
      program: payload.program,
      content: payload.content,
      rating: payload.rating,
      source: payload.source,
      mediaType: payload.mediaType,
      mediaUrl: payload.mediaUrl ?? null,
      isPublished: payload.isPublished ?? true,
      isFeatured: payload.isFeatured ?? false,
    };

    if (payload.id?.trim()) {
      await upsertReview(
        {
          ...(normalizedPayload as Omit<ReviewItem, "id">),
          id: payload.id.trim(),
        },
        admin.email
      );
      return NextResponse.json({ ok: true, id: payload.id.trim() });
    }

    const created = await createReview(normalizedPayload as Omit<ReviewItem, "id">, admin.email);
    return NextResponse.json({ ok: true, id: created.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or failed." },
      { status: 401 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { id } = (await request.json()) as { id?: string };

    if (!id) {
      return NextResponse.json({ error: "Review id is required." }, { status: 400 });
    }

    await deleteReview(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or failed." },
      { status: 401 }
    );
  }
}
