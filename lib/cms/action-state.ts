import type { ActionResult } from "./types";

/**
 * The state a form starts with, before the server action has answered.
 *
 * It lives here and not in the action files because a `"use server"` file may
 * only export async functions. Exporting a plain object from one is an error.
 */
export const emptyActionState: ActionResult = { ok: false, message: "" };
