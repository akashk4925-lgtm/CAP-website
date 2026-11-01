<<<<<<< HEAD
import { ensureDynamicConnection, jsonError } from "@/lib/admin/http";
import { getParticipantSession } from "@/lib/admin/auth";
import { findParticipant } from "@/lib/admin/store";
=======
/**
 * GET /api/participant/me
 *
 * Returns the authenticated participant's profile, tier, points and rank (PRD 8.4).
 */
import { getRepository } from "@/lib/repositories";
import { getParticipantSession } from "@/lib/admin/auth";
import { jsonError, ensureDynamicConnection } from "@/lib/admin/http";
import { ApiError } from "@/lib/admin/auth";
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648

export async function GET(request: Request) {
  await ensureDynamicConnection();
  try {
    const session = await getParticipantSession(request);
<<<<<<< HEAD
    if (!session?.participantId) {
      return Response.json({ authenticated: false, participant: null });
    }

    const participant = await findParticipant(session.participantId);
    if (!participant) {
      return Response.json({ authenticated: false, participant: null });
    }

    return Response.json({
      authenticated: true,
      participant,
    });
=======
    if (!session) {
      throw new ApiError(401, "UNAUTHENTICATED", "Sign in is required.");
    }

    const repo = getRepository();
    const participant = await repo.getParticipantById(session.participantId);
    if (!participant) {
      throw new ApiError(404, "NOT_FOUND", "Participant not found.");
    }

    return Response.json({ participant });
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648
  } catch (error) {
    return jsonError(error);
  }
}
<<<<<<< HEAD

=======
>>>>>>> 8d7a01145cd04ba558c7ffb90f81c10609620648
