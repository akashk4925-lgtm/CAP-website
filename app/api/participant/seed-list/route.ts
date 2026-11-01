import { ensureDynamicConnection, jsonError } from "@/lib/admin/http";
import { listParticipants } from "@/lib/admin/store";

export async function GET() {
  await ensureDynamicConnection();
  try {
    const all = await listParticipants();
    const demo = all.slice(0, 8).map((p) => ({
      id: p.id,
      name: p.name,
      college: p.college,
      rollNumber: p.rollNumber,
      email: p.email,
    }));
    return Response.json({ ok: true, participants: demo });
  } catch (error) {
    return jsonError(error);
  }
}

