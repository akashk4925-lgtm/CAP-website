import { ensureDynamicConnection, jsonError } from "@/lib/admin/http";
import { ApiError, getParticipantSession } from "@/lib/admin/auth";
import { getParticipantTasks } from "@/lib/admin/store";

export async function GET(request: Request) {
  await ensureDynamicConnection();
  try {
    const session = await getParticipantSession(request);
    if (!session?.participantId) {
      throw new ApiError(401, "UNAUTHORIZED", "Participant authentication required to view missions.");
    }

    const tasks = await getParticipantTasks(session.participantId);
    return Response.json({
      ok: true,
      tasks,
    });
  } catch (error) {
    return jsonError(error);
  }
}
