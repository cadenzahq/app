import { cookies } from "next/headers";

export async function getRequestContext() {
  const cookieStore = await cookies();

  const activeOrchestraId =
    cookieStore.get("active_orchestra_id")?.value ?? null;

  return {
    activeOrchestraId,
  };
}