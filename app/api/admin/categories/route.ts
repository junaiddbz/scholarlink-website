import { NextRequest, NextResponse } from "next/server";
import { createCategory, deleteCategory, setCategoryArchived, upsertCategory } from "@/lib/catalog-store";
import { requireAdmin } from "@/lib/admin-auth";
import type { CourseCategoryMeta } from "@/lib/courses";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const payload = (await request.json()) as Partial<CourseCategoryMeta>;

    if (!payload.title || !payload.description || !payload.badgeClassName) {
      return NextResponse.json({ error: "Invalid category payload." }, { status: 400 });
    }

    const normalizedPayload = {
      title: payload.title,
      description: payload.description,
      badgeClassName: payload.badgeClassName,
      isArchived: payload.isArchived ?? false,
    };

    if (payload.id?.trim()) {
      await upsertCategory(
        {
          ...(normalizedPayload as Omit<CourseCategoryMeta, "id">),
          id: payload.id.trim(),
        },
        admin.email
      );
      return NextResponse.json({ ok: true, id: payload.id.trim() });
    }

    const created = await createCategory(
      normalizedPayload as Omit<CourseCategoryMeta, "id">,
      admin.email
    );
    return NextResponse.json({ ok: true, id: created.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or failed." },
      { status: 401 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const { id, isArchived } = (await request.json()) as { id?: string; isArchived?: boolean };

    if (!id) {
      return NextResponse.json({ error: "Category id is required." }, { status: 400 });
    }

    await setCategoryArchived(id, isArchived ?? true, admin.email);
    return NextResponse.json({ ok: true });
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
      return NextResponse.json({ error: "Category id is required." }, { status: 400 });
    }

    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or failed." },
      { status: 401 }
    );
  }
}
