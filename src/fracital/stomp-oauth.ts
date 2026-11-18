/**
 * OAuth and Last.fm sign-in for SystemYA through STomp, without SystemYA being one of Fracital's
 * trusted origins. Providers only send the browser back to Fracital's auth host
 * (https://fracit.al/api/auth/callback/<provider>), never to systemya.fracit.al. So:
 *
 * 1. The sign-in starts first-party here (POST /api/auth/sign-in/social, or link-social, or
 *    GET /api/auth/lastfm/url): Fracital, behind the edge's /api/ proxy, puts its state cookie on
 *    this host and answers with the provider's URL, whose redirect_uri is fracit.al's callback.
 * 2. The provider's pages run in SystemYA's STomp view, so the provider sees an ordinary browser.
 * 3. A request rule stops the proxied browser at fracit.al's callback before it goes upstream, and
 *    the request event hands over the callback URL with the code and state.
 * 4. The same callback is replayed first-party on this host. Fracital checks the state cookie set in
 *    step 1, exchanges the code with the same fracit.al redirect_uri, and sets the session here.
 *
 * A cancelled view (its Back button) rejects with "... sign-in was cancelled".
 */
import type { RequestEvent, RequestRule } from "@sysce/stomp";
import {
  bootStomp,
  closeService,
  openStomp,
  SERVICE_CLOSED,
} from "../systemya/stomp";
import { authClient } from "./auth";

const AUTH_HOST = "https://fracit.al";
const DONE = "/account/?oauth=ok";
const FAILED = "/account/?error=oauth";
const NAMES: Record<string, string> = {
  discord: "Discord",
  google: "Google",
  github: "GitHub",
  microsoft: "Microsoft",
  lastfm: "Last.fm",
};

/**
 * Shows `start` in the STomp view and resolves with the first proxied request URL under
 * `callback` (which never leaves the browser); rejects when the view is closed first.
 */
async function catchCallback(
  start: string,
  callback: string,
  title: string,
): Promise<URL> {
  const controller = await bootStomp();
  const rules: RequestRule[] = [
    { match: { url: `${callback}*` }, action: { status: 204 } },
  ];
  await controller.setRules(rules);
  try {
    return await new Promise<URL>((resolve, reject) => {
      const done = (fn: () => void) => {
        controller.removeEventListener("request", onRequest);
        window.removeEventListener(SERVICE_CLOSED, onClosed);
        fn();
      };
      const onRequest = (event: Event) => {
        const url = (event as CustomEvent<RequestEvent>).detail?.url;
        if (!url?.startsWith(callback)) return;
        done(() => {
          closeService();
          resolve(new URL(url));
        });
      };
      const onClosed = () =>
        done(() => reject(new Error(`${title} sign-in was cancelled`)));
      controller.addEventListener("request", onRequest);
      window.addEventListener(SERVICE_CLOSED, onClosed);
      void openStomp(start).then(() => {
        const heading = document.querySelector("#systemya-service-title");
        if (heading) heading.textContent = `Sign in with ${title}`;
      });
    });
  } finally {
    await controller.setRules([]).catch(() => undefined);
  }
}

/**
 * Replays a provider's callback here and reads the outcome from where Fracital redirects. Success
 * and most failures redirect to a path on this host; a state it can't read goes to the auth host's
 * error page, which fetch can't follow cross-origin, so a network error here is a failed sign-in.
 */
async function replay(
  path: string,
  search: string,
  failure: string,
): Promise<URL> {
  let res: Response;
  try {
    res = await fetch(`${path}${search}`, {
      credentials: "include",
      redirect: "follow",
    });
  } catch {
    throw new Error(failure);
  }
  const end = new URL(res.url, location.href);
  const error =
    end.searchParams.get("error") ||
    (end.searchParams.get("status") === "error"
      ? end.searchParams.get("message") || "error"
      : "");
  if (error || !res.ok)
    throw new Error(end.searchParams.get("message") || failure);
  return end;
}

/** Signs in with, or links, an OAuth provider by way of STomp. */
export async function oauthThroughStomp(
  provider: string,
  mode: "signin" | "link",
  scopes?: string[],
): Promise<void> {
  const title = NAMES[provider] ?? provider;
  const body = {
    provider,
    callbackURL: DONE,
    errorCallbackURL: FAILED,
    disableRedirect: true,
    ...(mode === "link"
      ? scopes?.length
        ? { scopes }
        : {}
      : { newUserCallbackURL: DONE }),
  };
  const res =
    mode === "link"
      ? await authClient.$fetch<{ url?: string }>("/link-social", {
          method: "POST",
          body,
        })
      : await authClient.$fetch<{ url?: string }>("/sign-in/social", {
          method: "POST",
          body,
        });
  const start = res.data?.url;
  if (res.error || !start)
    throw new Error(res.error?.message || `Couldn't start ${title} sign-in`);
  const callback = `${AUTH_HOST}/api/auth/callback/${provider}`;
  const reached = await catchCallback(start, callback, title);
  await replay(
    `/api/auth/callback/${encodeURIComponent(provider)}`,
    reached.search,
    `${title} sign-in didn't finish. Try again.`,
  );
}

/** Last.fm's web auth by way of STomp: Last.fm calls back to fracit.al with ?token=. */
export async function lastfmThroughStomp(
  mode: "signin" | "link",
): Promise<void> {
  const res = await fetch(`/api/auth/lastfm/url?mode=${mode}`, {
    credentials: "include",
  });
  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    callback?: string;
    message?: string;
    error?: string;
  };
  if (!res.ok || !data.url || !data.callback)
    throw new Error(
      data.message || data.error || "Couldn't start Last.fm sign-in",
    );
  const reached = await catchCallback(data.url, data.callback, "Last.fm");
  const end = await replay(
    new URL(data.callback).pathname,
    reached.search,
    "Last.fm sign-in failed",
  );
  if (
    end.pathname === "/api/me/lastfm/done" &&
    end.searchParams.get("status") !== "ok"
  )
    throw new Error(
      end.searchParams.get("message") || "Last.fm sign-in failed",
    );
}
