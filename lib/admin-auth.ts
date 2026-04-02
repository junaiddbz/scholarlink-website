import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

function getAllowedEmails() {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    throw new Error("Missing authorization token.");
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const email = decoded.email?.toLowerCase();
  const allowlist = getAllowedEmails();

  if (allowlist.length && (!email || !allowlist.includes(email))) {
    throw new Error("User is not allowed to access admin resources.");
  }

  return decoded;
}
