<<<<<<< HEAD
import { assertSameOrigin, ensureDynamicConnection, jsonError, readBody } from "@/lib/admin/http";
import { checkRateLimit, getClientIp } from "@/lib/admin/rate-limit";
import { parseStrict, participantLoginSchema } from "@/lib/admin/schemas";
import { findParticipant } from "@/lib/admin/store";
import { createParticipantSessionToken, PARTICIPANT_COOKIE_NAME } from "@/lib/admin/session";
import { ApiError } from "@/lib/admin/auth";
import { NextResponse } from "next/server";
=======
/**
 * POST /api/participant/login
 *
 * Authenticates a participant by email (+ optional rollNumber) and issues
 * a signed session cookie (cap_participant_session). PRD 8.2 / 6.3.
 */
import { cookies } from "next/headers";
import { getRepository } from "@/lib/repositories";
import { parseStrict, loginParticipantSchema } from "@/lib/admin/schemas";
import {
  createParticipantSessionToken,
  PARTICIPANT_COOKIE_NAME,
  PARTICIPANT_SESSION_DURATION_MS,
} from "@/lib/admin/session";
import { jsonError, ensureDynamicConnection, readBody } from "@/lib/admin/http";
import { ApiError } from "@/lib/admin/auth";
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648

export async function POST(request: Request) {
  await ensureDynamicConnection();
  try {
<<<<<<< HEAD
    assertSameOrigin(request);

    const clientIp = getClientIp(request);
    const rl = checkRateLimit(`part_login:${clientIp}`, 20, 60 * 1000);
    if (!rl.success) {
      throw new ApiError(429, "RATE_LIMITED", "Too many login attempts. Please wait.");
    }

    const rawBody = await readBody(request);
    const data = parseStrict(participantLoginSchema, rawBody);

    const participant = await findParticipant(data.identifier);
    if (!participant) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "No registered ambassador found with this Email, Roll Number or ID."
      );
    }

    const token = createParticipantSessionToken({
      id: participant.id,
=======
    const body = await readBody(request);
    const data = parseStrict(loginParticipantSchema, body);

    const repo = getRepository();
    const participant = await repo.getParticipantByEmail(data.email);

    if (!participant) {
      throw new ApiError(404, "NOT_FOUND", "No account found with this email address.");
    }

    if (participant.deletedAt) {
      throw new ApiError(403, "FORBIDDEN", "This account has been deactivated. Please contact support.");
    }

    // Optional rollNumber check as additional factor
    if (data.rollNumber && participant.rollNumber !== data.rollNumber) {
      throw new ApiError(401, "UNAUTHORIZED", "Roll number does not match our records.");
    }

    const token = createParticipantSessionToken({
      participantId: participant.id,
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648
      email: participant.email,
      name: participant.name,
    });

<<<<<<< HEAD
    const response = NextResponse.json({
      ok: true,
      participant,
      token,
    });

    response.cookies.set(PARTICIPANT_COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
=======
    const cookieStore = await cookies();
    cookieStore.set(PARTICIPANT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(PARTICIPANT_SESSION_DURATION_MS / 1000),
    });

    return Response.json({ participant });
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648
  } catch (error) {
    return jsonError(error);
  }
}
<<<<<<< HEAD

=======
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648
