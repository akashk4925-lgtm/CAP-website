<<<<<<< HEAD
import { assertSameOrigin, ensureDynamicConnection, jsonError, readBody } from "@/lib/admin/http";
import { checkRateLimit, getClientIp } from "@/lib/admin/rate-limit";
import { parseStrict, participantRegisterSchema } from "@/lib/admin/schemas";
import { registerParticipant } from "@/lib/admin/store";
import { createParticipantSessionToken, PARTICIPANT_COOKIE_NAME } from "@/lib/admin/session";
import { ApiError } from "@/lib/admin/auth";
import { NextResponse } from "next/server";
=======
/**
 * POST /api/participant/register
 *
 * Creates a new participant record and issues a signed session cookie (PRD 8.2).
 */
import { cookies } from "next/headers";
import { getRepository } from "@/lib/repositories";
import { parseStrict, registerParticipantSchema } from "@/lib/admin/schemas";
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
=======
    const body = await readBody(request);
    const data = parseStrict(registerParticipantSchema, body);

    const repo = getRepository();

    // Registration mode (PRD 6.3): "open" activates immediately, "approval" queues for review.
    const registrationMode = (process.env.PARTICIPANT_REGISTRATION_MODE ?? "approval").toLowerCase();
    const initialStatus = registrationMode === "open" ? "Active" : "Pending Approval";

    // Check for duplicate email
    const existing = await repo.getParticipantByEmail(data.email);
    if (existing) {
      throw new ApiError(409, "CONFLICT", "An account with this email already exists.");
    }

    const participant = await repo.createParticipant({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      college: data.college,
      branch: data.branch ?? null,
      year: data.year ?? null,
      city: data.city ?? null,
      rollNumber: data.rollNumber,
      socialHandles: data.socialHandles ?? null,
      termsAcceptedAt: new Date().toISOString(),
      status: initialStatus,
    });

    // Issue session cookie
    const token = createParticipantSessionToken({ participantId: participant.id, email: participant.email, name: participant.name });
    const cookieStore = await cookies();
    cookieStore.set(PARTICIPANT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(PARTICIPANT_SESSION_DURATION_MS / 1000),
    });

    return Response.json({ participant }, { status: 201 });
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648
  } catch (error) {
    return jsonError(error);
  }
}
<<<<<<< HEAD

=======
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648
