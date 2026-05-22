export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export function ok(): ActionResult {
  return { success: true };
}

export function fail(error: string): ActionResult {
  return { success: false, error };
}