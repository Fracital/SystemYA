// The /account/ page: Fracital Accounts (src/fracital/auth.ts) in a card laid out like Fracital's about:account.
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
  refreshMe,
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
import { icon, systemyaMark, type IconName } from "./account-icons";

const PROVIDERS: Record<SocialProvider, { label: string; icon: IconName }> = {
  google: { label: "Google", icon: "google" },
  discord: { label: "Discord", icon: "discord" },
  github: { label: "GitHub", icon: "github" },
  microsoft: { label: "Microsoft", icon: "microsoft" },
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

/** A text box whose label sits inside it until there is text, like Fracital's Input. */
const field = (
  label: string,
  type: string,
  name: string,
  autocomplete: AutoFill,
  required = true,
) =>
  el(
    "label",
    { class: "acct-field" },
    el("input", { type, name, autocomplete, required, placeholder: " " }),
    el("span", {}, label),
  );

const count = (n: number) => n.toLocaleString();

type Page = "login" | "register" | "forgot" | "reset";
type Control = HTMLButtonElement | HTMLInputElement;

export function mountAccount(root: HTMLElement): void {
  const host = root.querySelector<HTMLElement>("#systemya-account");
  if (!host || host.dataset.bound === "1") return;
  host.dataset.bound = "1";

  const params = new URLSearchParams(location.search);
  const resetLink = params.has("reset");
  const linkError = !!params.get("error");
  let resetToken = resetLink && !linkError ? params.get("token") : null;
  let page: Page = resetToken ? "reset" : resetLink ? "forgot" : "login";
  let terbium = false;
  let notice =
    params.get("verified") && !linkError ? "Your email is verified." : "";
  let error =
    resetLink && !resetToken
      ? "That reset link is invalid or expired. Ask for a new one below."
      : linkError
        ? "That verification link is invalid or expired. Sign in and send a new one from your account page."
        : "";
  if (params.toString()) history.replaceState(null, "", location.pathname);

  // Signed-in panels that open in place.
  let pwForm = false;
  let lbForm = false;
  let terbiumForm = false;
  let profileSaved = false;

  const banner = el("div", { class: "acct-banner" });
  banner.setAttribute("role", "status");
  const card = el("div", { class: "acct-card" });
  card.dataset.state = "loading";
  host.replaceChildren(card);

  const showStatus = () => {
    banner.textContent = error || notice;
    banner.dataset.kind = error ? "error" : "ok";
    banner.hidden = !(error || notice);
  };

  /**
   * Runs a user action: disables its controls and shows busyText while it runs. Success redraws the
   * card (with `done` as a notice); a failure keeps what was typed and shows the error.
   */
  const run = (
    trigger: HTMLButtonElement | HTMLFormElement,
    action: () => Promise<void>,
    done = "",
    busyText = "",
  ) => {
    const controls = (
      trigger instanceof HTMLFormElement ? [...trigger.elements] : [trigger]
    ) as Control[];
    const was = controls.map((c) => c.disabled);
    const labelled =
      trigger instanceof HTMLFormElement
        ? trigger.querySelector<HTMLButtonElement>("button[type=submit]")
        : trigger;
    const label = labelled?.querySelector<HTMLElement>(".acct-label");
    const before = label?.textContent ?? "";
    if (busyText && label) label.textContent = busyText;
    for (const c of controls) c.disabled = true;
    error = "";
    notice = "";
    showStatus();
    action().then(
      () => {
        notice = done;
        void render();
      },
      (err: unknown) => {
        error =
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong";
        showStatus();
        controls.forEach((c, i) => (c.disabled = was[i]));
        if (label) label.textContent = before;
        if (banner.isConnected) {
          const box = banner.getBoundingClientRect();
          if (box.top < 0 || box.bottom > innerHeight)
            banner.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      },
    );
  };

  const button = (
    label: string,
    onClick: (b: HTMLButtonElement) => void,
    className = "acct-pill",
    iconName?: IconName,
  ) => {
    const b = el(
      "button",
      { type: "button", class: className },
      iconName ? icon(iconName) : null,
      el("span", { class: "acct-label" }, label),
    );
    b.addEventListener("click", () => onClick(b));
    return b;
  };

  const form = (
    className: string,
    children: Child[],
    onSubmit: (data: FormData, f: HTMLFormElement) => void,
  ) => {
    const f = el("form", { class: className }, ...children);
    f.addEventListener("submit", (event) => {
      event.preventDefault();
      onSubmit(new FormData(f), f);
    });
    return f;
  };

  const submit = (label: string, className = "acct-pill") =>
    el(
      "button",
      { type: "submit", class: className },
      el("span", { class: "acct-label" }, label),
    );

  const text = (data: FormData, name: string) => String(data.get(name) || "");

  const go = (next: Page) => {
    error = "";
    notice = "";
    page = next;
    void render();
  };

  function signIn(options: AuthOptions): HTMLElement {
    const credentials = page === "login" || page === "register";
    const title =
      page === "register"
        ? "Create a Fracital Account"
        : page === "forgot"
          ? "Reset your password"
          : page === "reset"
            ? "Choose a new password"
            : terbium
              ? "Sign in with Terbium"
              : "Sign in to SystemYA";
    const subtitle =
      page === "forgot"
        ? "We'll email you a link to choose a new password."
        : page === "reset"
          ? "Use at least 8 characters."
          : terbium
            ? "Use your Terbium Account email and password."
            : "SystemYA uses Fracital Accounts. One account works on SystemYA, Fracital and the chat.";

    const stack = el("div", { class: "acct-stack" }, banner);

    if (credentials && !terbium) {
      if (options.lastfm)
        stack.append(
          button(
            page === "login" ? "Continue with Last.fm" : "Sign up with Last.fm",
            (b) =>
              run(b, () => connectLastfm("signin"), "", "Waiting for Last.fm…"),
            "acct-lastfm",
            "lastfm",
          ),
        );
      if (options.social.length && oauthUsable(options)) {
        const grid = el("div", { class: "acct-social" });
        grid.style.gridTemplateColumns = `repeat(${Math.min(options.social.length, 3)}, minmax(0, 1fr))`;
        for (const p of options.social)
          grid.append(
            button(
              PROVIDERS[p].label,
              (b) => run(b, () => connectSocial(p, "signin"), "", "Waiting…"),
              `acct-provider acct-provider-${p}`,
              PROVIDERS[p].icon,
            ),
          );
        stack.append(grid);
      }
      if (page === "login" && (passkeysUsable(options) || options.terbium)) {
        const alt = el("div", { class: "acct-alt" });
        if (passkeysUsable(options))
          alt.append(
            button(
              "Passkey",
              (b) => run(b, () => signInWithPasskey(), "", "Waiting…"),
              "acct-soft",
              "fingerprint",
            ),
          );
        if (options.terbium)
          alt.append(
            button(
              "Terbium",
              () => {
                terbium = true;
                error = "";
                notice = "";
                void render();
              },
              "acct-soft",
              "cube",
            ),
          );
        stack.append(alt);
      }
      stack.append(
        el(
          "div",
          { class: "acct-divider" },
          el("span"),
          "or with email",
          el("span"),
        ),
      );
    }

    const fields: Child[] = [];
    if (page === "register") fields.push(field("Name", "text", "name", "name"));
    if (page !== "reset")
      fields.push(field("Email", "email", "email", "email"));
    if (page !== "forgot")
      fields.push(
        field(
          page === "reset" ? "New password" : "Password",
          "password",
          "password",
          page === "login" ? "current-password" : "new-password",
        ),
      );
    if (page === "reset")
      fields.push(
        field("Confirm password", "password", "confirm", "new-password"),
      );
    if (page === "login" && !terbium && options.mail)
      fields.push(
        button("Forgot password?", () => go("forgot"), "acct-forgot"),
      );
    fields.push(
      submit(
        page === "login"
          ? "Sign in"
          : page === "register"
            ? "Create account"
            : page === "forgot"
              ? "Send reset link"
              : "Change password",
        "acct-submit",
      ),
    );

    stack.append(
      form("acct-form", fields, (data, f) => {
        const email = text(data, "email");
        const password = text(data, "password");
        if (page === "forgot")
          return run(
            f,
            () => requestPasswordReset(email),
            "If an account uses that email, a reset link is on its way.",
            "Loading…",
          );
        if (page === "reset")
          return run(
            f,
            async () => {
              if (password.length < 8)
                throw new Error("Use at least 8 characters");
              if (password !== text(data, "confirm"))
                throw new Error("The passwords don't match");
              await resetPassword(resetToken as string, password);
              // Resetting signs out every session, this one included.
              resetToken = null;
              page = "login";
              await refreshMe();
            },
            "Your password was changed. Sign in with the new one.",
            "Loading…",
          );
        run(
          f,
          () =>
            terbium
              ? terbiumAuth(email, password, "signin")
              : page === "login"
                ? signInEmail(email, password)
                : signUpEmail(text(data, "name"), email, password),
          "",
          "Loading…",
        );
      }),
    );

    if (terbium)
      stack.append(
        button(
          "Use a Fracital Account instead",
          () => {
            terbium = false;
            error = "";
            void render();
          },
          "acct-back",
        ),
      );

    const footer = el("div", { class: "acct-footer" });
    if (page === "login" && !terbium)
      footer.append(
        el("span", {}, "Don't have an account?"),
        button("Register", () => go("register"), "acct-footer-link"),
      );
    if (page !== "login")
      footer.append(
        el(
          "span",
          {},
          page === "register" ? "Have an account?" : "Remembered it?",
        ),
        button("Sign in", () => go("login"), "acct-footer-link"),
      );

    return el(
      "div",
      { class: "acct-signin" },
      el(
        "div",
        { class: "acct-head" },
        systemyaMark(),
        el("h1", {}, title),
        el("p", {}, subtitle),
      ),
      stack,
      footer.childElementCount ? footer : null,
    );
  }

  const section = (title: string | null, ...children: Child[]) =>
    el(
      "section",
      { class: "acct-section" },
      title ? el("h2", {}, title) : null,
      ...children,
    );

  /** Fracital's row: a round icon, a title with a detail line, and the row's actions. */
  const row = (badge: Node, title: Child, detail: Child, ...actions: Child[]) =>
    el(
      "div",
      { class: "acct-row" },
      badge,
      el(
        "div",
        { class: "acct-row-text" },
        el("span", { class: "acct-row-title" }, title),
        typeof detail === "string"
          ? el("span", { class: "acct-row-detail" }, detail)
          : detail,
      ),
      ...actions,
    );

  const badge = (name: IconName, brand = "") =>
    el(
      "div",
      { class: brand ? `acct-badge acct-badge-${brand}` : "acct-badge" },
      icon(name),
    );

  const state = (ok: boolean) =>
    icon(
      ok ? "check" : "warning",
      ok ? "fa-icon acct-good" : "fa-icon acct-warn",
    );

  const profileLink = (url: string, label: string) =>
    el(
      "a",
      {
        class: "acct-row-detail acct-row-link",
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      label,
    );

  const switchButton = (
    on: boolean,
    label: string,
    onClick: (b: HTMLButtonElement) => void,
  ) => {
    const b = el(
      "button",
      { type: "button", class: "acct-switch" },
      el("span"),
    );
    b.setAttribute("role", "switch");
    b.setAttribute("aria-checked", String(on));
    b.setAttribute("aria-label", label);
    b.addEventListener("click", () => onClick(b));
    return b;
  };

  const alert = (message: string, ...actions: Child[]) =>
    el("div", { class: "acct-alert" }, el("span", {}, message), ...actions);

  function profile(me: Me): HTMLElement {
    const name = el("input", {
      class: "acct-text",
      name: "name",
      autocomplete: "name",
      maxLength: 50,
      required: true,
      value: me.user.name,
    });
    const username = el("input", {
      name: "username",
      autocomplete: "username",
      maxLength: 30,
      placeholder: "yourname",
      spellcheck: false,
      value: me.username ?? "",
    });
    const save = submit(profileSaved ? "Saved ✓" : "Save profile", "acct-save");
    const dirty = () =>
      name.value.trim() !== me.user.name ||
      username.value.trim().toLowerCase() !== (me.username ?? "");
    const sync = () => {
      save.disabled = !dirty();
      if (dirty()) {
        profileSaved = false;
        save.querySelector(".acct-label")!.textContent = "Save profile";
      }
    };
    save.disabled = true;
    name.addEventListener("input", sync);
    username.addEventListener("input", () => {
      username.value = username.value.replace(/[^a-zA-Z0-9_.]/g, "");
      sync();
    });
    return form(
      "acct-section",
      [
        el("h2", {}, "Profile"),
        el(
          "label",
          { class: "acct-labelled" },
          el("span", { class: "acct-caption" }, "Display name"),
          name,
        ),
        el(
          "label",
          { class: "acct-labelled" },
          el("span", { class: "acct-caption" }, "Username"),
          el(
            "div",
            { class: "acct-text acct-at" },
            el("span", {}, "@"),
            username,
          ),
          el(
            "span",
            { class: "acct-hint" },
            "3–30 characters: letters, numbers, _ and .",
          ),
        ),
        save,
      ],
      (data, f) =>
        run(
          f,
          async () => {
            const handle = text(data, "username").trim().toLowerCase();
            await updateProfile({
              name: text(data, "name").trim(),
              username: handle || null,
            });
            profileSaved = true;
          },
          "",
          "Saving…",
        ),
    );
  }

  function services(me: Me, options: AuthOptions, canDisconnect: boolean) {
    const out = section("Connected services");
    const lastfm = me.lastfm;
    if (options.lastfm || lastfm) {
      out.append(
        lastfm
          ? row(
              badge("lastfm", "lastfm"),
              el(
                "span",
                { class: "acct-row-title-inner" },
                "Last.fm ",
                state(!lastfm.needsReconnect),
              ),
              profileLink(
                lastfm.url,
                `@${lastfm.username} · ${count(lastfm.playcount)} scrobbles`,
              ),
              canDisconnect
                ? button("Disconnect", (b) =>
                    run(b, () => disconnectProvider("lastfm")),
                  )
                : el(
                    "span",
                    { class: "acct-note" },
                    "Your only sign-in: add another to disconnect",
                  ),
            )
          : row(
              badge("lastfm", "lastfm"),
              "Last.fm",
              "Build your library, see your play counts, and scrobble what you play.",
              Object.assign(
                button(
                  options.lastfm && me.lastfmAvailable !== false
                    ? "Connect"
                    : "Unavailable",
                  (b) =>
                    run(
                      b,
                      () => connectLastfm("link"),
                      "Last.fm connected.",
                      "Waiting…",
                    ),
                  "acct-pill acct-pill-lastfm",
                ),
                { disabled: !options.lastfm || me.lastfmAvailable === false },
              ),
            ),
      );
      if (lastfm?.needsReconnect)
        out.append(
          alert(
            "Last.fm access was removed. Reconnect to keep scrobbling and liking songs. Plays from meanwhile are saved and sent after you reconnect.",
            button(
              "Reconnect",
              (b) =>
                run(
                  b,
                  () => connectLastfm("link"),
                  "Last.fm reconnected.",
                  "Waiting…",
                ),
              "acct-pill acct-pill-lastfm",
            ),
          ),
        );
    }

    const lb = me.listenbrainz ?? null;
    out.append(
      lb
        ? row(
            badge("music", "listenbrainz"),
            el(
              "span",
              { class: "acct-row-title-inner" },
              "ListenBrainz ",
              state(!lb.needsReconnect),
            ),
            profileLink(
              lb.url,
              `${lb.username} · ${count(lb.listenCount)} listens`,
            ),
            button("Disconnect", (b) => run(b, () => disconnectListenbrainz())),
          )
        : row(
            badge("music", "listenbrainz"),
            "ListenBrainz",
            me.lastfm
              ? "Also send your listens to ListenBrainz, the open alternative to Last.fm."
              : "The open alternative to Last.fm: build your library and save what you play.",
            lbForm
              ? null
              : button(
                  "Connect",
                  () => {
                    lbForm = true;
                    void render();
                  },
                  "acct-pill acct-pill-listenbrainz",
                ),
          ),
    );
    if (lbForm || lb?.needsReconnect) {
      const token = el("input", {
        class: "acct-text",
        name: "token",
        autocomplete: "off",
        maxLength: 100,
        required: true,
        spellcheck: false,
        placeholder: "Paste your user token",
      });
      out.append(
        form(
          "acct-indent",
          [
            el(
              "span",
              { class: "acct-hint" },
              lb?.needsReconnect
                ? "ListenBrainz stopped accepting your token, probably because it was reset. Paste the new one to keep sending listens. Listens from meanwhile are saved and sent after you reconnect. "
                : "Copy the user token from your ListenBrainz settings page and paste it here. ",
              el(
                "a",
                {
                  href: "https://listenbrainz.org/settings/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
                "Open ListenBrainz settings",
              ),
            ),
            el(
              "div",
              { class: "acct-actions" },
              token,
              submit(lb ? "Reconnect" : "Connect"),
              lbForm && !lb
                ? button("Cancel", () => {
                    lbForm = false;
                    void render();
                  })
                : null,
            ),
          ],
          (data, f) =>
            run(
              f,
              async () => {
                await connectListenbrainz(text(data, "token").trim());
                lbForm = false;
              },
              lb ? "ListenBrainz reconnected." : "ListenBrainz connected.",
              "Checking…",
            ),
        ),
      );
    }

    const presence = me.discordPresence;
    if (presence) {
      const canConnect = oauthUsable(options);
      const connect = (b: HTMLButtonElement) =>
        run(
          b,
          () => connectDiscordPresence(),
          "Your Discord status will show what you're listening to.",
          "Waiting…",
        );
      out.append(
        row(
          badge("discord", "discord"),
          el(
            "span",
            { class: "acct-row-title-inner" },
            "Discord status ",
            presence.connected
              ? presence.error
                ? state(false)
                : presence.enabled
                  ? state(true)
                  : null
              : null,
          ),
          presence.connected
            ? "Shows the song you're playing here as your Discord status."
            : !canConnect
              ? "Open your account on Fracital to connect this."
              : presence.discord
                ? "Show what you're listening to on your Discord profile."
                : "Show what you're listening to on your Discord profile. This also adds Discord as a way to sign in.",
          presence.connected
            ? switchButton(
                presence.enabled,
                "Show what you're listening to on Discord",
                (b) => run(b, () => setDiscordPresence(!presence.enabled)),
              )
            : canConnect
              ? button("Connect", connect, "acct-pill acct-pill-discord")
              : null,
        ),
      );
      if (presence.connected && presence.error)
        out.append(
          alert(
            presence.error,
            canConnect
              ? button("Reconnect", connect, "acct-pill acct-pill-discord")
              : null,
          ),
        );
    }
    return out;
  }

  function methods(me: Me, options: AuthOptions, signInMethods: number) {
    const out = section("Sign-in methods");
    const providers = new Set(me.providers ?? []);
    const email = me.user.email;
    // The only way into the account, with no email to set a password through: removing it would lock the account.
    const last = signInMethods <= 1 && !(email && options.mail);
    const disconnect = (label = "Disconnect", action: () => Promise<void>) =>
      Object.assign(
        button(label, (b) => run(b, action)),
        { disabled: last },
      );

    if (email) {
      out.append(
        row(
          badge("key"),
          "Password",
          me.hasPassword ? email : "Not set",
          pwForm
            ? null
            : button(me.hasPassword ? "Change" : "Set password", () => {
                pwForm = true;
                void render();
              }),
        ),
      );
      if (pwForm)
        out.append(
          form(
            "acct-indent",
            [
              me.hasPassword
                ? field(
                    "Current password",
                    "password",
                    "current",
                    "current-password",
                  )
                : null,
              field("New password", "password", "next", "new-password"),
              el(
                "div",
                { class: "acct-actions" },
                submit(me.hasPassword ? "Change password" : "Set password"),
                me.hasPassword && options.mail
                  ? button("Email me a reset link", (b) =>
                      run(
                        b,
                        () => requestPasswordReset(email),
                        `We emailed a link to ${email} to reset your password.`,
                        "Sending…",
                      ),
                    )
                  : null,
                button("Cancel", () => {
                  pwForm = false;
                  void render();
                }),
              ),
              el("span", { class: "acct-hint" }, "At least 8 characters."),
            ],
            (data, f) =>
              run(
                f,
                async () => {
                  const next = text(data, "next");
                  if (next.length < 8)
                    throw new Error("Use at least 8 characters");
                  if (me.hasPassword)
                    await changeAccountPassword(text(data, "current"), next);
                  else await setAccountPassword(next);
                  pwForm = false;
                },
                me.hasPassword
                  ? "Password changed. Other devices were signed out."
                  : "Password set. You can now sign in with your email and password.",
                "Saving…",
              ),
          ),
        );
    }

    const oauthOk = oauthUsable(options);
    for (const p of options.social) {
      const linked = providers.has(p);
      out.append(
        row(
          badge(PROVIDERS[p].icon),
          PROVIDERS[p].label,
          linked ? "Connected" : null,
          linked
            ? disconnect("Disconnect", () => disconnectProvider(p))
            : oauthOk
              ? button("Connect", (b) =>
                  run(
                    b,
                    () => connectSocial(p, "link"),
                    `${PROVIDERS[p].label} connected.`,
                    "Waiting…",
                  ),
                )
              : null,
        ),
      );
    }

    if (options.terbium || providers.has("terbium")) {
      const linked = providers.has("terbium");
      out.append(
        row(
          badge("cube"),
          "Terbium",
          linked ? "Connected" : null,
          linked
            ? disconnect("Disconnect", () => disconnectProvider("terbium"))
            : terbiumForm
              ? null
              : button("Connect", () => {
                  terbiumForm = true;
                  void render();
                }),
        ),
      );
      if (terbiumForm && !linked)
        out.append(
          form(
            "acct-indent",
            [
              field("Terbium email", "email", "email", "email"),
              field(
                "Terbium password",
                "password",
                "password",
                "current-password",
              ),
              el(
                "div",
                { class: "acct-actions" },
                submit("Connect"),
                button("Cancel", () => {
                  terbiumForm = false;
                  void render();
                }),
              ),
            ],
            (data, f) =>
              run(
                f,
                async () => {
                  await terbiumAuth(
                    text(data, "email"),
                    text(data, "password"),
                    "link",
                  );
                  terbiumForm = false;
                },
                "Terbium connected.",
                "Checking…",
              ),
          ),
        );
    }

    const canPasskey = passkeysUsable(options);
    const saved = me.passkeys ?? 0;
    if (canPasskey || saved)
      out.append(
        row(
          badge("fingerprint"),
          saved ? "Passkeys" : "Passkey",
          saved
            ? `${saved} saved`
            : "Sign in with your fingerprint, face or device PIN.",
          canPasskey
            ? button("Add", (b) =>
                run(b, () => addPasskey(), "Passkey added.", "Waiting…"),
              )
            : null,
        ),
      );

    if (last && (saved > 0 || [...providers].some((p) => p !== "credential")))
      out.append(
        el(
          "span",
          { class: "acct-hint" },
          "Add another sign-in method before removing this one.",
        ),
      );

    if (options.hub) {
      const detail = el(
        "span",
        { class: "acct-row-detail" },
        "Our other sites sign this browser in automatically.",
      );
      const toggle = switchButton(false, "Stay signed in across sites", (b) =>
        run(b, async () => {
          if (b.getAttribute("aria-checked") === "true")
            await unlinkCrossSite(true);
          else if (!(await linkCrossSite("toggle")))
            throw new Error(
              "This browser blocks it (third-party cookies are off), or the sign-in hub can't be reached.",
            );
        }),
      );
      toggle.disabled = true;
      out.append(
        row(badge("refresh"), "Stay signed in across sites", detail, toggle),
      );
      void crossSiteStatus().then((s) => {
        if (!s) {
          detail.textContent = "Unavailable in this browser.";
          toggle.remove();
          return;
        }
        toggle.setAttribute("aria-checked", String(s.linked));
        toggle.disabled = false;
      });
    }
    return out;
  }

  function manage(me: Me, options: AuthOptions): HTMLElement {
    const providers = new Set(me.providers ?? []);
    const signInMethods = providers.size + (me.passkeys ?? 0);
    // A real email with mail on is a way back in too: a reset link sets a password.
    const emailRecovery = !!me.user.email && options.mail;
    const avatar = me.user.image || me.lastfm?.image || "";

    const out = el(
      "div",
      { class: "acct-manage" },
      section(
        null,
        avatar
          ? el("img", {
              class: "acct-avatar",
              src: avatar,
              alt: "",
              referrerPolicy: "no-referrer",
            })
          : icon("user", "acct-avatar acct-avatar-blank"),
        el(
          "div",
          { class: "acct-hero-text" },
          el("h1", {}, me.user.name),
          me.username
            ? el("span", { class: "acct-handle" }, `@${me.username}`)
            : null,
          el(
            "span",
            { class: "acct-muted" },
            me.user.email ??
              (me.lastfm
                ? `Signed in with Last.fm (@${me.lastfm.username})`
                : ""),
          ),
        ),
      ),
      banner,
    );
    out.firstElementChild!.classList.add("acct-hero");

    if (me.user.email && !me.user.emailVerified && options.mail)
      out.append(
        el(
          "section",
          { class: "acct-verify" },
          icon("warning", "fa-icon acct-warn"),
          el(
            "div",
            { class: "acct-row-text" },
            el("span", { class: "acct-row-title" }, "Verify your email"),
            el(
              "span",
              { class: "acct-row-detail" },
              "We sent a link to your email. Verifying lets you reset your password if you forget it.",
            ),
          ),
          button("Resend", (b) =>
            run(
              b,
              () => sendVerificationEmail(me.user.email as string),
              "Verification email sent. Check your inbox.",
              "Sending…",
            ),
          ),
        ),
      );

    out.append(
      profile(me),
      services(
        me,
        options,
        signInMethods > 1 || !providers.has("lastfm") || emailRecovery,
      ),
      methods(me, options, signInMethods),
      button(
        "Sign out",
        (b) => run(b, () => signOut()),
        "acct-signout",
        "signout",
      ),
    );
    return out;
  }

  async function render(): Promise<void> {
    showStatus();
    const [options, me] = await Promise.all([getAuthOptions(), getMe()]);
    if (!host?.isConnected) return;
    // A reset link works signed in or out.
    const signedIn = me && !resetToken;
    card.dataset.state = signedIn ? "in" : "out";
    card.replaceChildren(signedIn ? manage(me, options) : signIn(options));
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
  card.replaceChildren(el("p", { class: "acct-loading" }, "Loading…"));
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
