import { NextRequest, NextResponse } from "next/server";
import { createFaculty, deleteFaculty, setFacultyArchived, upsertFaculty } from "@/lib/catalog-store";
import { requireAdmin } from "@/lib/admin-auth";
import type { FacultyMember } from "@/lib/faculty";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const payload = (await request.json()) as Partial<FacultyMember>;

    if (!payload.group || !payload.gender || !payload.link) {
      return NextResponse.json({ error: "Invalid faculty payload." }, { status: 400 });
    }

    const normalizedPayload = {
      name: payload.name ?? null,
      role: payload.role ?? null,
      degree: payload.degree ?? null,
      image: payload.image ?? null,
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      bio: payload.bio ?? null,
      expertise: payload.expertise ?? null,
      experienceYears: payload.experienceYears ?? null,
      languages: payload.languages ?? null,
      teachingMode: payload.teachingMode ?? null,
      availability: payload.availability ?? null,
      contactPreference: payload.contactPreference ?? null,
      group: payload.group,
      gender: payload.gender,
      link: payload.link,
      isArchived: payload.isArchived ?? false,
    };

    if (payload.id?.trim()) {
      await upsertFaculty(
        {
          ...(normalizedPayload as Omit<FacultyMember, "id">),
          id: payload.id.trim(),
        },
        admin.email
      );
      return NextResponse.json({ ok: true, id: payload.id.trim() });
    }

    const created = await createFaculty(normalizedPayload as Omit<FacultyMember, "id">, admin.email);
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
      return NextResponse.json({ error: "Faculty id is required." }, { status: 400 });
    }

    await setFacultyArchived(id, isArchived ?? true, admin.email);
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
      return NextResponse.json({ error: "Faculty id is required." }, { status: 400 });
    }

    await deleteFaculty(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or failed." },
      { status: 401 }
    );
  }
}
