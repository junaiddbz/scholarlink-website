import { NextRequest, NextResponse } from "next/server";
import {
  createAnnouncement,
  deleteAnnouncement,
  readAnnouncements,
  upsertAnnouncement,
} from "@/lib/catalog-store";
import { requireAdmin } from "@/lib/admin-auth";
import type { AnnouncementItem } from "@/lib/announcements";

function normalizeOptionalText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizePriority(value?: number): AnnouncementItem["priority"] {
  const parsed = Number(value ?? 3);
  if (!Number.isFinite(parsed)) {
    return 3;
  }

  const normalized = Math.round(parsed);
  const clamped = Math.min(5, Math.max(1, normalized));
  return clamped as AnnouncementItem["priority"];
}

function parseIsoDate(value?: string | null) {
  const text = normalizeOptionalText(value);
  if (!text) {
    return { value: null, isValid: true };
  }

  const parsed = Date.parse(text);
  if (Number.isNaN(parsed)) {
    return { value: null, isValid: false };
  }

  return { value: new Date(parsed).toISOString(), isValid: true };
}

function isValidCtaHref(value: string) {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const announcements = await readAnnouncements(true);
    return NextResponse.json({ data: announcements });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or failed." },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const payload = (await request.json()) as Partial<AnnouncementItem>;

    const title = payload.title?.trim();
    const message = payload.message?.trim();
    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
    }

    const ctaLabel = normalizeOptionalText(payload.ctaLabel);
    const ctaHref = normalizeOptionalText(payload.ctaHref);

    if (Boolean(ctaLabel) !== Boolean(ctaHref)) {
      return NextResponse.json(
        { error: "CTA label and CTA URL must be provided together." },
        { status: 400 }
      );
    }

    if (ctaHref && !isValidCtaHref(ctaHref)) {
      return NextResponse.json(
        { error: "CTA URL must be a valid relative path or http/https URL." },
        { status: 400 }
      );
    }

    const publishAt = parseIsoDate(payload.publishAt);
    const expiresAt = parseIsoDate(payload.expiresAt);

    if (!publishAt.isValid || !expiresAt.isValid) {
      return NextResponse.json(
        { error: "Publish and expiry dates must be valid datetime values." },
        { status: 400 }
      );
    }

    if (publishAt.value && expiresAt.value && Date.parse(expiresAt.value) <= Date.parse(publishAt.value)) {
      return NextResponse.json(
        { error: "Expiry datetime must be after publish datetime." },
        { status: 400 }
      );
    }

    const normalizedPayload: Omit<AnnouncementItem, "id"> = {
      title,
      message,
      ctaLabel,
      ctaHref,
      priority: normalizePriority(payload.priority),
      isPublished: payload.isPublished ?? true,
      isPinned: payload.isPinned ?? false,
      publishAt: publishAt.value,
      expiresAt: expiresAt.value,
    };

    if (payload.id?.trim()) {
      await upsertAnnouncement(
        {
          ...normalizedPayload,
          id: payload.id.trim(),
        },
        admin.email
      );
      return NextResponse.json({ ok: true, id: payload.id.trim() });
    }

    const created = await createAnnouncement(normalizedPayload, admin.email);
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
      return NextResponse.json({ error: "Announcement id is required." }, { status: 400 });
    }

    await deleteAnnouncement(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized or failed." },
      { status: 401 }
    );
  }
}
