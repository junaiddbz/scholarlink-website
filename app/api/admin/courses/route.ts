import { NextRequest, NextResponse } from "next/server";
import { createCourse, deleteCourse, setCourseArchived, upsertCourse } from "@/lib/catalog-store";
import { requireAdmin } from "@/lib/admin-auth";
import type { Course } from "@/lib/courses";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const payload = (await request.json()) as Partial<Course>;

    if (!payload.title || !payload.category || !payload.subcategory || !payload.icon || !payload.description || !payload.level || !payload.link) {
      return NextResponse.json({ error: "Invalid course payload." }, { status: 400 });
    }

    const normalizedPayload = {
      title: payload.title,
      description: payload.description,
      level: payload.level,
      category: payload.category,
      subcategory: payload.subcategory,
      icon: payload.icon,
      link: payload.link,
      duration: payload.duration,
      prerequisites: payload.prerequisites,
      isArchived: payload.isArchived ?? false,
    };

    if (payload.id?.trim()) {
      await upsertCourse(
        {
          ...(normalizedPayload as Omit<Course, "id">),
          id: payload.id.trim(),
        },
        admin.email
      );
      return NextResponse.json({ ok: true, id: payload.id.trim() });
    }

    const created = await createCourse(normalizedPayload as Omit<Course, "id">, admin.email);
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
      return NextResponse.json({ error: "Course id is required." }, { status: 400 });
    }

    await setCourseArchived(id, isArchived ?? true, admin.email);
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
      return NextResponse.json({ error: "Course id is required." }, { status: 400 });
    }

    await deleteCourse(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or failed." },
      { status: 401 }
    );
  }
}
