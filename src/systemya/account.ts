// The /account/ page: Fracital Accounts (src/fracital/auth.ts) in SystemYA's own markup.
import {
  ACCOUNT_EVENT,
  addPasskey,
  changeAccountPassword,
  connectDiscordPresence,
  connectLastfm,
  connectListenbrainz,
  connectSocial,
  disconnectListenbrainz,
  disconnectProvider,
  getAuthOptions,
  getMe,
  oauthUsable,
  passkeysUsable,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  setAccountPassword,
  setDiscordPresence,
  signInEmail,
  signInWithPasskey,
  signOut,
  signUpEmail,
  terbiumAuth,
  updateProfile,
  type AuthOptions,
  type Me,
  type SocialProvider,
} from "../fracital/auth";
import {
  CROSS_SITE_EVENT,
  crossSiteStatus,
  linkCrossSite,
  unlinkCrossSite,
} from "../fracital/cross-site";

const PROVIDER_NAMES: Record<SocialProvider, string> = {
  discord: "Discord",
  google: "Google",
  github: "GitHub",
  microsoft: "Microsoft",
};

type Child = Node | string | null | undefined | false;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  const { class: className, ...rest } = props;
  if (className) node.className = className;
  Object.assign(node, rest);
  for (const child of children) if (child) node.append(child);
  return node;
}

const field = (label: string, input: HTMLInputElement) =>
  el(
    "label",
    { class: "systemya-account-field" },
    el("span", {}, label),
    input,
  );
const input = (
  type: string,
  name: string,
  autocomplete: AutoFill,
  required = true,
) => el("input", { type, name, autocomplete, required });

type View = "signin" | "register" | "forgot";

export function mountAccount(root: HTMLElement): void {
  const host = root.querySelector<HTMLElement>("#systemya-account");
  if (!host || host.dataset.bound === "1") return;
  host.dataset.bound = "1";

  const params = new URLSearchParams(location.search);
  let resetToken = params.get("reset") ? params.get("token") : null;
  let view: View = "signin";
  let notice = params.get("verified") ? "Your email is verified." : "";
  let error = params.get("error")
    ? "That link didn't work. It may have expired."
    : "";
  if (params.toString()) history.replaceState(null, "", location.pathname);

  const status = el("p", { class: "systemya-account-status" });
  status.setAttribute("role", "status");
  const body = el("div");
  host.replaceChildren(el("h1", {}, "Account"), status, body);

  const showStatus = () => {
    status.textContent = error || notice;
    status.dataset.kind = error ? "error" : "ok";
  };

  /** Runs a user action: disables its controls, shows its error, redraws after. */
  const run = (
    button: HTMLButtonElement | HTMLFormElement,
    action: () => Promise<void>,
    done?: string,
  ) => {
    const controls =
      button instanceof HTMLFormElement ? [...button.elements] : [button];
    for (const c of controls) (c as HTMLButtonElement).disabled = true;
    error = "";
    notice = "";
    showStatus();
    action()
      .then(() => {
        notice = done || "";
      })
      .catch((err: unknown) => {
        error = err instanceof Error ? err.message : "Something went wrong";
      })
      .finally(() => {
        for (const c of controls) (c as HTMLButtonElement).disabled = false;
        void render();
      });
  };

  const button = (
    label: string,
    onClick: (b: HTMLButtonElement) => void,
    kind = "",
  ) => {
    const b = el(
      "button",
      {
        type: "button",
        class: kind
          ? `systemya-account-button ${kind}`
          : "systemya-account-button",
      },
      label,
    );
    b.addEventListener("click", () => onClick(b));
    return b;
  };

  const form = (
    submit: string,
    fields: HTMLElement[],
    onSubmit: (data: FormData, f: HTMLFormElement) => void,
  ) => {
    const f = el(
      "form",
      { class: "systemya-account-form" },
      ...fields,
      el(
        "button",
        { type: "submit", class: "systemya-account-button primary" },
        submit,
      ),
    );
    f.addEventListener("submit", (event) => {
      event.preventDefault();
      onSubmit(new FormData(f), f);
    });
    return f;
  };

  const text = (data: FormData, name: string) => String(data.get(name) || "");

  function signedOut(options: AuthOptions): Node[] {
    if (resetToken) {
      return [
        el("h2", {}, "Choose a new password"),
        form(
          "Save password",
          [
            field(
              "New password",
              input("password", "password", "new-password"),
            ),
          ],
          (data, f) =>
            run(
              f,
              async () => {
                await resetPassword(
                  resetToken as string,
                  text(data, "password"),
                );
                resetToken = null;
                view = "signin";
              },
              "Your password is changed. Sign in with it.",
            ),
        ),
      ];
    }

    const tabs = el(
      "div",
      { class: "systemya-account-tabs" },
      ...(["signin", "register"] as const).map((v) => {
        const b = button(v === "signin" ? "Sign in" : "Create account", () => {
          view = v;
          void render();
        });
        b.setAttribute("aria-pressed", String(view === v));
        return b;
      }),
    );

    const out: Node[] = [
      el(
        "p",
        {},
        "SystemYA uses Fracital Accounts. One account works on SystemYA, Fracital and the chat.",
      ),
    ];

    if (view === "forgot") {
      out.push(
        el("h2", {}, "Reset your password"),
        form(
          "Email me a link",
          [field("Email", input("email", "email", "email"))],
          (data, f) =>
            run(
              f,
              () => requestPasswordReset(text(data, "email")),
              "If that address has an account, a reset link is on its way.",
            ),
        ),
        button(
          "Back to sign in",
          () => {
            view = "signin";
            void render();
          },
          "link",
        ),
      );
      return out;
    }

    out.push(tabs);
    if (view === "signin") {
      out.push(
        form(
          "Sign in",
          [
            field("Email", input("email", "email", "email")),
            field(
              "Password",
              input("password", "password", "current-password"),
            ),
          ],
          (data, f) =>
            run(f, () =>
              signInEmail(text(data, "email"), text(data, "password")),
            ),
        ),
      );
      if (options.mail)
        out.push(
          button(
            "Forgot your password?",
            () => {
              view = "forgot";
              void render();
            },
            "link",
          ),
        );
    } else {
      out.push(
        form(
          "Create account",
          [
            field("Name", input("text", "name", "name")),
            field("Email", input("email", "email", "email")),
            field(
              "Password (8 or more characters)",
              input("password", "password", "new-password"),
            ),
          ],
          (data, f) =>
            run(f, () =>
              signUpEmail(
                text(data, "name"),
                text(data, "email"),
                text(data, "password"),
              ),
            ),
        ),
      );
    }

    const others = el("div", { class: "systemya-account-providers" });
    if (oauthUsable(options))
      for (const p of options.social)
        others.append(
          button(`Continue with ${PROVIDER_NAMES[p]}`, (b) =>
            run(b, () => connectSocial(p, "signin")),
          ),
        );
    if (options.lastfm)
      others.append(
        button("Continue with Last.fm", (b) =>
          run(b, () => connectLastfm("signin")),
        ),
      );
    if (passkeysUsable(options))
      others.append(
        button("Sign in with a passkey", (b) =>
          run(b, () => signInWithPasskey()),
        ),
      );
    if (others.childElementCount) out.push(el("h2", {}, "Or"), others);

    if (options.terbium)
      out.push(
        el(
          "details",
          { class: "systemya-account-terbium" },
          el("summary", {}, "Sign in with a Terbium Account"),
          form(
            "Sign in with Terbium",
            [
              field("Terbium email", input("email", "email", "email")),
              field(
                "Terbium password",
                input("password", "password", "current-password"),
              ),
            ],
            (data, f) =>
              run(f, () =>
                terbiumAuth(
                  text(data, "email"),
                  text(data, "password"),
                  "signin",
                ),
              ),
          ),
        ),
      );
    return out;
  }

  function signedIn(me: Me, options: AuthOptions): Node[] {
    const providers = new Set(me.providers ?? []);
    const out: Node[] = [];

    const avatar = me.user.image || me.lastfm?.image || "";
    out.push(
      el(
        "section",
        { class: "systemya-account-profile" },
        avatar
          ? el("img", {
              src: avatar,
              alt: "",
              width: 64,
              height: 64,
              referrerPolicy: "no-referrer",
            })
          : null,
        el(
          "div",
          {},
          el("strong", {}, me.user.name),
          me.username ? el("div", {}, `@${me.username}`) : null,
          me.user.email ? el("div", {}, me.user.email) : null,
        ),
      ),
    );

    if (me.user.email && !me.user.emailVerified && options.mail)
      out.push(
        el(
          "p",
          {},
          "Your email isn't verified yet. ",
          button(
            "Send the link again",
            (b) =>
              run(
                b,
                () => sendVerificationEmail(me.user.email as string),
                "Check your inbox for the link.",
              ),
            "link",
          ),
        ),
      );

    out.push(
      el("h2", {}, "Profile"),
      form(
        "Save",
        [
          field(
            "Display name",
            Object.assign(input("text", "name", "name"), {
              value: me.user.name,
            }),
          ),
          field(
            "Username",
            Object.assign(input("text", "username", "username", false), {
              value: me.username || "",
            }),
          ),
        ],
        (data, f) =>
          run(
            f,
            () =>
              updateProfile({
                name: text(data, "name").trim(),
                username: text(data, "username").trim() || null,
              }),
            "Saved.",
          ),
      ),
    );

    const rows = el("ul", { class: "systemya-account-connections" });
    const row = (
      name: string,
      connected: boolean,
      connect: (b: HTMLButtonElement) => void,
      disconnect: (b: HTMLButtonElement) => void,
      detail = "",
    ) =>
      rows.append(
        el(
          "li",
          {},
          el("span", {}, name, detail ? el("small", {}, ` ${detail}`) : null),
          connected
            ? button("Disconnect", disconnect)
            : button("Connect", connect),
        ),
      );
    if (oauthUsable(options))
      for (const p of options.social)
        row(
          PROVIDER_NAMES[p],
          providers.has(p),
          (b) => run(b, () => connectSocial(p, "link")),
          (b) => run(b, () => disconnectProvider(p)),
        );
    if (options.lastfm || me.lastfm)
      row(
        "Last.fm",
        !!me.lastfm,
        (b) => run(b, () => connectLastfm("link")),
        (b) => run(b, () => disconnectProvider("lastfm")),
        me.lastfm
          ? me.lastfm.needsReconnect
            ? "(reconnect needed)"
            : me.lastfm.username
          : "",
      );
    if (options.terbium && providers.has("terbium"))
      row(
        "Terbium",
        true,
        () => {},
        (b) => run(b, () => disconnectProvider("terbium")),
      );
    if (me.listenbrainz)
      row(
        "ListenBrainz",
        true,
        () => {},
        (b) => run(b, () => disconnectListenbrainz()),
        me.listenbrainz.username,
      );
    out.push(el("h2", {}, "Connected sign-ins"), rows);

    if (!me.listenbrainz)
      out.push(
        el(
          "details",
          {},
          el("summary", {}, "Connect ListenBrainz"),
          form(
            "Connect",
            [
              field(
                "User token from listenbrainz.org/settings",
                input("password", "token", "off"),
              ),
            ],
            (data, f) =>
              run(f, () => connectListenbrainz(text(data, "token").trim())),
          ),
        ),
      );
    if (options.terbium && !providers.has("terbium"))
      out.push(
        el(
          "details",
          {},
          el("summary", {}, "Connect a Terbium Account"),
          form(
            "Connect",
            [
              field("Terbium email", input("email", "email", "email")),
              field(
                "Terbium password",
                input("password", "password", "current-password"),
              ),
            ],
            (data, f) =>
              run(f, () =>
                terbiumAuth(
                  text(data, "email"),
                  text(data, "password"),
                  "link",
                ),
              ),
          ),
        ),
      );

    const presence = me.discordPresence;
    if (presence && oauthUsable(options)) {
      out.push(el("h2", {}, "Discord status"));
      if (!presence.connected)
        out.push(
          el(
            "p",
            {},
            "Show what you listen to on your Discord profile. ",
            button(
              "Allow it",
              (b) => run(b, () => connectDiscordPresence()),
              "link",
            ),
          ),
        );
      else
        out.push(
          el(
            "p",
            {},
            presence.enabled ? "On. " : "Off. ",
            presence.error ? `${presence.error} ` : "",
            button(
              presence.enabled ? "Turn off" : "Turn on",
              (b) => run(b, () => setDiscordPresence(!presence.enabled)),
              "link",
            ),
          ),
        );
    }

    out.push(el("h2", {}, "Password"));
    if (me.hasPassword)
      out.push(
        form(
          "Change password",
          [
            field(
              "Current password",
              input("password", "current", "current-password"),
            ),
            field("New password", input("password", "next", "new-password")),
          ],
          (data, f) =>
            run(
              f,
              () =>
                changeAccountPassword(
                  text(data, "current"),
                  text(data, "next"),
                ),
              "Password changed. Other devices were signed out.",
            ),
        ),
      );
    else
      out.push(
        form(
          "Set password",
          [field("New password", input("password", "next", "new-password"))],
          (data, f) =>
            run(
              f,
              () => setAccountPassword(text(data, "next")),
              "Password set.",
            ),
        ),
      );

    if (passkeysUsable(options))
      out.push(
        el("h2", {}, "Passkeys"),
        el(
          "p",
          {},
          `${me.passkeys ?? 0} saved. `,
          button(
            "Add a passkey",
            (b) => run(b, () => addPasskey(), "Passkey added."),
            "link",
          ),
        ),
      );

    if (options.hub) {
      const hubRow = el(
        "p",
        { class: "systemya-account-hub" },
        "Checking whether this browser stays signed in on Fracital's sites...",
      );
      out.push(el("h2", {}, "Fracital's sites"), hubRow);
      void crossSiteStatus().then((state) => {
        if (!state) {
          hubRow.textContent =
            "This browser can't stay signed in across Fracital's sites (the sign-in hub isn't reachable).";
          return;
        }
        hubRow.replaceChildren(
          state.linked
            ? "This browser stays signed in on Fracital's sites. "
            : "This browser signs in on each site separately. ",
          button(
            state.linked ? "Turn off" : "Turn on",
            (b) =>
              run(b, async () => {
                if (state.linked) await unlinkCrossSite(true);
                else if (!(await linkCrossSite("toggle")))
                  throw new Error(
                    "This browser blocks it, or the sign-in hub can't be reached.",
                  );
              }),
            "link",
          ),
        );
      });
    }

    out.push(
      el(
        "p",
        {},
        button("Sign out", (b) => run(b, () => signOut())),
      ),
    );
    return out;
  }

  async function render(): Promise<void> {
    showStatus();
    const [options, me] = await Promise.all([getAuthOptions(), getMe()]);
    if (!host?.isConnected) return;
    body.replaceChildren(...(me ? signedIn(me, options) : signedOut(options)));
  }

  // ClientRouter swaps pages without a reload: stop listening once this page goes away.
  const stop = new AbortController();
  document.addEventListener("astro:before-swap", () => stop.abort(), {
    once: true,
  });
  window.addEventListener(ACCOUNT_EVENT, () => void render(), {
    signal: stop.signal,
  });
  window.addEventListener(CROSS_SITE_EVENT, () => void render(), {
    signal: stop.signal,
  });
  body.textContent = "Loading...";
  void render();
}

let started = false;

/**
 * Once per page load, like Fracital's app: a signed-out browser asks the hub for a sign-in, and a
 * signed-in one that isn't linked yet links itself (unless the user turned that off).
 */
export function startAccountSession(): void {
  if (started) return;
  started = true;
  void (async () => {
    const { crossSiteSignIn } = await import("../fracital/cross-site");
    const { refreshMe } = await import("../fracital/auth");
    if (!(await getMe())) {
      if (await crossSiteSignIn()) await refreshMe();
      return;
    }
    const state = await crossSiteStatus();
    if (state && !state.linked && !state.off) await linkCrossSite("startup");
  })().catch(() => undefined);
}
