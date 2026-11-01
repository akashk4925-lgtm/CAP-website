import { ensureDynamicConnection, jsonError } from "@/lib/admin/http";
import { getParticipantSession } from "@/lib/admin/auth";
import { findParticipant } from "@/lib/admin/store";

export async function GET(request: Request) {
  await ensureDynamicConnection();
  try {
    const session = await getParticipantSession(request);
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
  } catch (error) {
    return jsonError(error);
  }
}

