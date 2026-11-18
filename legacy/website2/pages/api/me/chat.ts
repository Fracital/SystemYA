import type { APIRoute } from "astro";
import { guestIdentityResponse } from "../../../server/holt-identity.mjs";

export const prerender = false;

// Holt expects an authenticated Better Auth session on this origin.
// SystemYA does not yet validate those sessions. Guests are read-only.
export const GET: APIRoute = () => guestIdentityResponse();
