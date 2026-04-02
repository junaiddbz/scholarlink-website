"use client";

import { clientAuth } from "@/lib/firebase-client";

export async function getAdminToken() {
  const user = clientAuth.currentUser;
  if (!user) {
    throw new Error("Admin is not signed in.");
  }

  return user.getIdToken();
}

export async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = await getAdminToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}
