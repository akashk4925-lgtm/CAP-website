import { assertSameOrigin, ensureDynamicConnection, jsonError, readBody } from "@/lib/admin/http";
import { checkRateLimit, getClientIp } from "@/lib/admin/rate-limit";
import { parseStrict, participantRegisterSchema } from "@/lib/admin/schemas";
import { registerParticipant } from "@/lib/admin/store";
import { createParticipantSessionToken, PARTICIPANT_COOKIE_NAME } from "@/lib/admin/session";
import { ApiError } from "@/lib/admin/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await ensureDynamicConnection();
  try {
    assertSameOrigin(request);

    const clientIp = getClientIp(request);
    const rl = checkRateLimit(`register:${clientIp}`, 10, 5 * 60 * 1000);
    if (!rl.success) {
      throw new ApiError(429, "RATE_LIMITED", "Too many registration attempts. Please wait.");
    }

    const rawBody = await readBody(request);
    const data = parseStrict(participantRegisterSchema, rawBody);

    const participant = await registerParticipant({
      name: data.name,
      email: data.email,
      college: data.college,
      rollNumber: data.rollNumber,
      branch: data.branch ?? undefined,
      year: data.year ?? undefined,
      phone: data.phone ?? undefined,
    });

    const token = createParticipantSessionToken({
      id: participant.id,
      email: participant.email,
      name: participant.name,
    });

    const response = NextResponse.json({
      ok: true,
      participant,
      token,
    }, { status: 201 });

    response.cookies.set(PARTICIPANT_COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return jsonError(error);
  }
}

