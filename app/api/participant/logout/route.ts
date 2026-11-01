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
