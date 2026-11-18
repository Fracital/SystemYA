/**
 * Fracital Accounts on SystemYA. SystemYA has no backend of its own: the edge proxies /api/ on
 * systemya.fracit.al to the Fracital server, which answers for this host like any of its own
 * (better-auth under /api/auth, the account under /api/me). Sessions are this host's cookies.
 * OAuth providers only call back to Fracital's auth host, so OAuth runs there in a popup and hands
 * the session back (cross-site.ts). Ported from Fracital src/libs/auth.ts.
 */
import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/client";
import { cryptoFetch } from "./api-crypto-fetch";
import { seedFromDocumentCookie } from "./api-crypto-codec";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  basePath: "/api/auth",
  fetchOptions: { credentials: "include" },
  plugins: [passkeyClient()],
});

export type SocialProvider = "google" | "discord" | "github" | "microsoft";

export interface AuthOptions {
  social: SocialProvider[];
  lastfm: boolean;
  terbium: boolean;
  passkeys: boolean;
  mail: boolean;
  /** OAuth providers call back to this host, so OAuth runs right here (never on SystemYA). */
  redirectOk: boolean;
  /** The origin that keeps this browser signed in across Fracital's sites; null when off. */
  hub: string | null;
  /** Fracital's auth host, where OAuth runs in a popup. */
  authHost: string | null;
}

const NO_OPTIONS: AuthOptions = {
  social: [],
  lastfm: false,
  terbium: false,
  passkeys: false,
  mail: false,
  redirectOk: false,
  hub: null,
  authHost: null,
};

export interface Me {
  user: {
    id: string;
    name: string;
    email: string | null;
    image: string | null;
    emailVerified?: boolean;
  };
  hasPassword: boolean;
  providers?: string[];
  passkeys?: number;
  lastfm: {
    username: string;
    image: string;
    playcount: number;
    url: string;
    needsReconnect?: boolean;
  } | null;
  lastfmAvailable: boolean;
  listenbrainz?: {
    username: string;
    listenCount: number;
    url: string;
    needsReconnect?: boolean;
  } | null;
  discordPresence?: {
    discord: boolean;
    connected: boolean;
    enabled: boolean;
    error?: string;
  } | null;
  isAdmin?: boolean;
  username?: string | null;
  premium?: boolean;
}

/** Fired on window whenever the signed-in account may have changed. */
export const ACCOUNT_EVENT = "systemya:account";

let seeded: Promise<unknown> | null = null;

/**
 * The seed cookie (wcs) that sealed responses are keyed on. Fracital's own shell sets it with the
 * HTML; SystemYA's pages are static, so the first API call would mint it, and two first calls at
 * once would each get a different seed and one could not be opened. One plain call first.
 */
function ensureSeed(): Promise<unknown> {
  if (seedFromDocumentCookie()) return Promise.resolve();
  seeded ??= fetch("/api/me/options", { credentials: "include" }).catch(() => {
    seeded = null;
  });
  return seeded;
}

/** fetch() against the Fracital API with this host's session cookie; sealed responses are opened. */
export async function meFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  await ensureSeed();
  const res = await cryptoFetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw Object.assign(
      new Error(
        (data as { error?: string }).error || `Request failed (${res.status})`,
      ),
      { status: res.status, data },
    );
  return data as T;
}

let optionsCache: Promise<AuthOptions> | null = null;

/** Sign-in methods Fracital offers here. */
export function getAuthOptions(): Promise<AuthOptions> {
  optionsCache ??= meFetch<AuthOptions>("/api/me/options").catch(() => {
    optionsCache = null;
    return NO_OPTIONS;
  });
  return optionsCache;
}

export const oauthUsable = (options: AuthOptions) =>
  options.redirectOk || !!options.authHost;
export const passkeysUsable = (options: AuthOptions) =>
  options.passkeys && typeof window.PublicKeyCredential !== "undefined";

let meCache: Promise<Me | null> | null = null;

/** The signed-in account (cached until refreshMe); null when signed out. */
export function getMe(): Promise<Me | null> {
  meCache ??= meFetch<Me>("/api/me").catch(() => null);
  return meCache;
}

export async function refreshMe(): Promise<Me | null> {
  meCache = meFetch<Me>("/api/me").catch(() => null);
  const me = await meCache;
  window.dispatchEvent(new Event(ACCOUNT_EVENT));
  return me;
}

const fail = (
  error: { message?: string } | null | undefined,
  fallback: string,
) => {
  throw new Error(error?.message || fallback);
};

export async function signInEmail(
  email: string,
  password: string,
): Promise<void> {
  const res = await authClient.signIn.email({ email, password });
  if (res.error) fail(res.error, "Sign-in failed");
  await afterSignIn();
}

export async function signUpEmail(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  const res = await authClient.signUp.email({ name, email, password });
  if (res.error) fail(res.error, "Registration failed");
  await afterSignIn();
}

/** A new session here: remember it at the hub so Fracital's other sites sign in too. */
async function afterSignIn(): Promise<void> {
  const me = await refreshMe();
  if (me)
    void import("./cross-site")
      .then((m) => m.linkCrossSite("signin"))
      .catch(() => {});
}

export async function signOut(): Promise<void> {
  // Unlink from the hub first, or the next page load would sign this browser back in.
  await import("./cross-site").then((m) => m.unlinkCrossSite()).catch(() => {});
  await authClient.signOut().catch(() => {});
  await refreshMe();
}

/** Opens the popup inside the click, so pop-up blockers allow it. */
function openPopup(url = "about:blank"): Window {
  const popup = window.open(url, "fracital-auth", "popup,width=520,height=720");
  if (!popup) throw new Error("Allow pop-ups for SystemYA to continue");
  return popup;
}

/** Resolves when the popup's landing page reports success; rejects on failure or when it's closed. */
function waitForPopup(popup: Window, type: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(closedPoll);
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== type) return;
      settled = true;
      cleanup();
      if (e.data.status === "ok") resolve();
      else reject(new Error(e.data.message || "Sign-in didn't finish"));
    };
    const closedPoll = window.setInterval(() => {
      if (!popup.closed || settled) return;
      settled = true;
      window.setTimeout(() => {
        cleanup();
        reject(new Error("Sign-in was cancelled"));
      }, 600);
    }, 500);
    window.addEventListener("message", onMessage);
  });
}

/** Last.fm web auth in a popup. It calls back to this host, so the session lands here. */
export async function connectLastfm(mode: "signin" | "link"): Promise<void> {
  const popup = openPopup(`/api/auth/lastfm/start?mode=${mode}`);
  await waitForPopup(popup, "fracital:lastfm");
  if (mode === "signin") await afterSignIn();
  else await refreshMe();
}

/** Signs in with, or connects, an OAuth provider through Fracital's auth host. */
export async function connectSocial(
  provider: SocialProvider,
  mode: "signin" | "link",
  scopes?: string[],
): Promise<void> {
  const popup = openPopup();
  try {
    const options = await getAuthOptions();
    if (!options.authHost)
      throw new Error("Sign-in with this provider isn't available right now");
    await import("./cross-site").then((m) =>
      m.oauthThroughAuthHost(
        popup,
        options.authHost as string,
        provider,
        mode,
        scopes,
      ),
    );
  } finally {
    if (!popup.closed) popup.close();
  }
  if (mode === "signin") await afterSignIn();
  else await refreshMe();
}

export async function disconnectProvider(providerId: string): Promise<void> {
  if (providerId === "lastfm")
    await meFetch("/api/me/lastfm", { method: "DELETE" });
  else
    await meFetch(`/api/me/accounts/${encodeURIComponent(providerId)}`, {
      method: "DELETE",
    });
  await refreshMe();
}

export async function terbiumAuth(
  email: string,
  password: string,
  mode: "signin" | "link",
): Promise<void> {
  const res = await authClient.$fetch<{ ok: boolean }>("/terbium/sign-in", {
    method: "POST",
    body: { email, password, mode },
  });
  if (res.error) fail(res.error, "Terbium sign-in failed");
  if (mode === "signin") await afterSignIn();
  else await refreshMe();
}

export async function signInWithPasskey(): Promise<void> {
  const res = await authClient.signIn.passkey();
  if (res?.error) fail(res.error, "Passkey sign-in failed");
  await afterSignIn();
}

export async function addPasskey(): Promise<void> {
  const res = await authClient.passkey.addPasskey({});
  if (res?.error) fail(res.error, "Couldn't add the passkey");
  await refreshMe();
}

/** Emails a reset link; it comes back to this page with ?token=. */
export async function requestPasswordReset(email: string): Promise<void> {
  const res = await authClient.requestPasswordReset({
    email,
    redirectTo: `${location.origin}/account/?reset=1`,
  });
  if (res.error) fail(res.error, "Couldn't send the reset email");
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  const res = await authClient.resetPassword({ token, newPassword });
  if (res.error) fail(res.error, "Couldn't reset your password");
}

export async function setAccountPassword(newPassword: string): Promise<void> {
  await meFetch("/api/me/password", {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });
  await refreshMe();
}

export async function changeAccountPassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const res = await authClient.changePassword({
    currentPassword,
    newPassword,
    revokeOtherSessions: true,
  });
  if (res.error) fail(res.error, "Couldn't change your password");
}

export async function sendVerificationEmail(email: string): Promise<void> {
  const res = await authClient.sendVerificationEmail({
    email,
    callbackURL: `${location.origin}/account/?verified=1`,
  });
  if (res.error) fail(res.error, "Couldn't send the email");
}

export async function connectListenbrainz(token: string): Promise<void> {
  await meFetch("/api/me/listenbrainz", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  await refreshMe();
}

export async function disconnectListenbrainz(): Promise<void> {
  await meFetch("/api/me/listenbrainz", { method: "DELETE" });
  await refreshMe();
}

/** Asks Discord for permission to set the status (connecting Discord if needed), then turns it on. */
export async function connectDiscordPresence(): Promise<void> {
  await connectSocial("discord", "link", ["activities.write"]);
  await setDiscordPresence(true);
}

export async function setDiscordPresence(enabled: boolean): Promise<void> {
  await meFetch("/api/me/presence/settings", {
    method: "PUT",
    body: JSON.stringify({ enabled }),
  });
  await refreshMe();
}

export async function updateProfile(change: {
  name?: string;
  username?: string | null;
}): Promise<void> {
  await meFetch("/api/me/profile", {
    method: "PUT",
    body: JSON.stringify(change),
  });
  await refreshMe();
}
