<<<<<<< HEAD
import { ensureDynamicConnection } from "@/lib/admin/http";
import { PARTICIPANT_COOKIE_NAME } from "@/lib/admin/session";
import { NextResponse } from "next/server";

export async function POST() {
  await ensureDynamicConnection();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PARTICIPANT_COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

=======
/**
 * DELETE /api/participant/logout
 *
 * Clears the participant session cookie (PRD 6.3).
 */
import { cookies } from "next/headers";
import { PARTICIPANT_COOKIE_NAME } from "@/lib/admin/session";
import { ensureDynamicConnection } from "@/lib/admin/http";

export async function DELETE() {
  await ensureDynamicConnection();
  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return Response.json({ ok: true });
}
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648
