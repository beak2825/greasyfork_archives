// ==UserScript==
// @name         XenForo Conversations E2EE + No Draft Autosave
// @namespace    xfenc-userscript
// @version      0.8.5-testing
// @description  Encrypt outgoing XenForo conversation messages and decrypt incoming ones locally. Blocks draft autosave requests.
// @author       martyrdom
// @license      GNU GPLv3
// @match        *://*/conversations/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563035/XenForo%20Conversations%20E2EE%20%2B%20No%20Draft%20Autosave.user.js
// @updateURL https://update.greasyfork.org/scripts/563035/XenForo%20Conversations%20E2EE%20%2B%20No%20Draft%20Autosave.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //bismillah rahman raheem
  // ============================================================
  // A) NO-DRAFT AUTOSAVE (block draft-save network calls)
  // ============================================================

  function installNoDraftAutosave() {
    function toAbsUrl(u) {
      try { return new URL(u, location.href); } catch { return null; }
    }

    function pathLooksLikeDraft(urlObj) {
      if (!urlObj) return false;

      const segments = urlObj.pathname
        .split("/")
        .filter(Boolean)
        .map(s => s.toLowerCase());

      // Only block if it contains an actual /draft or /drafts segment (avoid false positives).
      if (segments.includes("draft") || segments.includes("drafts")) return true;

      // Some add-ons use "auto-draft" in the path.
      if (/auto-?draft/i.test(urlObj.pathname)) return true;

      return false;
    }

    function bodyLooksLikeDraft(body) {
      if (!body) return false;
      try {
        if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
          const s = body.toString();
          return /draft/i.test(s) || /draft_id=|conversation_id=|message=|message_html=|title=/i.test(s);
        }
        if (typeof FormData !== "undefined" && body instanceof FormData) {
          for (const [k, v] of body.entries()) {
            const kv = `${k}=${typeof v === "string" ? v : ""}`;
            if (/draft/i.test(kv) || /draft_id|conversation_id|message|message_html|title/i.test(kv)) return true;
          }
          return false;
        }
        if (typeof body === "object") {
          const s = JSON.stringify(body);
          return /draft/i.test(s) || /draft_id|conversation_id/i.test(s);
        }
        const s = String(body);
        return /draft/i.test(s) || /draft_id|conversation_id/i.test(s);
      } catch {
        return false;
      }
    }

    // Never block the actual reply submission.
    function looksLikeActualSend(urlObj) {
      if (!urlObj) return false;
      const p = urlObj.pathname.toLowerCase();
      return (
        p.includes("/conversations/") &&
        (p.includes("/reply") || p.includes("/add-reply") || p.includes("/reply-preview") || p.includes("/insert"))
      );
    }

    function shouldBlock(url, init, method) {
      const u = typeof url === "string" ? url : (url && url.url) || "";
      const urlObj = toAbsUrl(u);
      if (!urlObj) return false;

      if (looksLikeActualSend(urlObj)) return false;

      if (pathLooksLikeDraft(urlObj)) return true;

      const m = (method || (init && init.method) || "").toUpperCase();
      if (m === "POST" || m === "PUT" || m === "PATCH") {
        if (bodyLooksLikeDraft(init && init.body)) return true;
      }

      return false;
    }

    function logBlocked(kind, url) {
      // Comment out if you want silence.
      console.info("[XF no-drafts] Blocked", kind, url);
    }

    // Patch fetch
    if (typeof window.fetch === "function") {
      const origFetch = window.fetch.bind(window);
      window.fetch = function (input, init) {
        const isReq = (typeof Request !== "undefined" && input instanceof Request);
        const url = isReq ? input.url : ((typeof input === "string") ? input : (input && input.url));
        const method = (init && init.method) || (isReq ? input.method : (input && input.method)) || "";

        // 1) Block drafts
        if (shouldBlock(url, init, method)) {
          logBlocked("fetch", url);
          return Promise.resolve(new Response("", { status: 204, statusText: "No Content" }));
        }

        // 2) Rewrite outgoing reply body (async)
        return (async () => {
          try {
            const headers = (init && init.headers) || (isReq ? input.headers : (input && input.headers));
            const body = (init && "body" in init) ? init.body : undefined;

            const rewritten = await rewriteOutgoingBodyIfNeeded(url, method, body, headers);

            if (rewritten !== null) {
              // If input is a Request, create a new Request with same settings but new body.
              if (isReq) {
                const newReq = new Request(input, { body: rewritten });
                // IMPORTANT: do not pass init again or it may override body
                return origFetch(newReq);
              }

              const newInit = Object.assign({}, init || {});
              newInit.body = rewritten;
              return origFetch(input, newInit);
            }
          } catch (e) {
            console.warn("[XFENC] fetch rewrite failed:", e);
          }
          return origFetch(input, init);
        })();
      };

    }

    // Patch XHR
    if (typeof window.XMLHttpRequest === "function") {
      const OrigXHR = window.XMLHttpRequest;

      function PatchedXHR() {
        const xhr = new OrigXHR();
        let _url = "";
        let _method = "";

        const origOpen = xhr.open;
        const origSend = xhr.send;

        xhr.open = function (method, url, ...rest) {
          _method = method || "";
          _url = url || "";
          return origOpen.call(this, method, url, ...rest);
        };

        xhr.send = function (body) {
          // 1) Block drafts
          if (shouldBlock(_url, { body }, _method)) {
            logBlocked(`XHR ${(_method || "").toUpperCase()}`, _url);
            try { this.abort(); } catch {}
            return;
          }

          // 2) Rewrite outgoing reply body (async)
          (async () => {
            try {
              const rewritten = await rewriteOutgoingBodyIfNeeded(_url, _method, body, null);
              if (rewritten !== null) {
                return origSend.call(this, rewritten);
              }
            } catch (e) {
              console.warn("[XFENC] XHR rewrite failed:", e);
            }
            return origSend.call(this, body);
          })();

          // Important: don't call origSend synchronously here (the async IIFE will).
          return;
        };


        return xhr;
      }

      PatchedXHR.prototype = OrigXHR.prototype;
      window.XMLHttpRequest = PatchedXHR;
    }

    // Patch sendBeacon
    if (navigator && typeof navigator.sendBeacon === "function") {
      const origBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function (url, data) {
        if (shouldBlock(url, { body: data }, "POST")) {
          logBlocked("sendBeacon", url);
          return true;
        }
        return origBeacon(url, data);
      };
    }

    // Best-effort: disable draft init markup once DOM exists
    function disableDraftInit(root = document) {
      const forms = root.querySelectorAll?.('form[data-xf-init]') || [];
      for (const form of forms) {
        const init = (form.getAttribute("data-xf-init") || "").trim();
        if (!init) continue;

        const parts = init.split(/\s+/);
        if (!parts.includes("draft") && !parts.includes("draft-trigger")) continue;

        const cleaned = parts.filter(p => p !== "draft" && p !== "draft-trigger").join(" ");
        form.setAttribute("data-xf-init", cleaned);
        form.setAttribute("data-auto-draft-autosave", "0");
      }
    }

    window.addEventListener("DOMContentLoaded", () => disableDraftInit(document), { once: true });
    document.addEventListener("xf:reinit", (e) => disableDraftInit(e.target || document));
    document.addEventListener("xf:load", (e) => disableDraftInit(e.target || document));
  }

  // Install draft blockers immediately (document-start)
  installNoDraftAutosave();

  // ============================================================
  // B) E2EE
  // ============================================================

  // ----------------------------
  // 1) SETTINGS
  // ----------------------------

  const ENC_PREFIX = "[[XFENC:v1:";
  const ENC_SUFFIX = "]]";

  // Wrap token to prevent XenForo smiley/emoji auto-formatting corrupting ciphertext.
  const WRAP_MODE = "plain"; // "plain" | "code"
  const WRAP_PREFIX = WRAP_MODE === "plain" ? "[plain]" : "[code]";
  const WRAP_SUFFIX = WRAP_MODE === "plain" ? "[/plain]" : "[/code]";

  const PBKDF2_ITERATIONS = 250000;
  const PBKDF2_HASH = "SHA-256";

  const AES_ALGO = "AES-GCM";
  const AES_KEY_BITS = 256;

  const DECRYPTED_SPAN_CLASS = "xfenc-decrypted-span";
  const DECRYPT_ERROR_CLASS = "xfenc-decrypt-error";

  const SCAN_DEBOUNCE_MS = 150;

  // ADDED: message keys XenForo may use depending on mode/add-ons
  const MESSAGE_KEYS = ["message", "message_html", "messageHtml"];

  // ----------------------------
  // 2) RUNTIME STATE
  // ----------------------------

  const state = {
    convId: null,
    keyStoreId: null,
    passphrase: null,
    scanTimer: null,
    scanInProgress: false
  };

  // ----------------------------
  // 3) HELPERS (base64 + text)
  // ----------------------------

  function u8ToB64(u8) {
    let s = "";
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    return btoa(s);
  }

  function b64ToU8(b64) {
    const s = atob(b64);
    const u8 = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
    return u8;
  }

  const te = new TextEncoder();
  const td = new TextDecoder();

  // ----------------------------
  // 4) CONVERSATION ID + STORAGE
  // ----------------------------

  function getConversationId() {
    const m = location.pathname.match(/\/conversations\/(?:[^\/]+\.)?(\d+)\b/);
    return m ? m[1] : "unknown";
  }

  function initConversationIdentity() {
    state.convId = getConversationId();
    state.keyStoreId = `xfenc:passphrase:${location.host}:${state.convId}`;
  }

  async function loadPassphrase() {
    if (state.passphrase !== null) return state.passphrase;
    state.passphrase = (await GM_getValue(state.keyStoreId, "")) || "";
    return state.passphrase;
  }

  async function savePassphrase(pw) {
    state.passphrase = pw || "";
    await GM_setValue(state.keyStoreId, state.passphrase);
  }

  // ----------------------------
  // 5) WRAPPER STRIPPER (anti-emoji)
  // ----------------------------

  function stripWrapper(text) {
    const t = (text || "").trim();

    // Strip [plain]...[/plain] or [code]...[/code] if present.
    if (t.toLowerCase().startsWith("[plain]") && t.toLowerCase().endsWith("[/plain]")) {
      return t.slice(7, -8).trim();
    }
    if (t.toLowerCase().startsWith("[code]") && t.toLowerCase().endsWith("[/code]")) {
      return t.slice(6, -7).trim();
    }
    return t;
  }

  // ----------------------------
  // 6) ENCRYPTION / DECRYPTION
  // ----------------------------

  async function deriveAesKey(passphrase, saltU8) {
    const baseKey = await crypto.subtle.importKey(
      "raw",
      te.encode(passphrase),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltU8,
        iterations: PBKDF2_ITERATIONS,
        hash: PBKDF2_HASH
      },
      baseKey,
      { name: AES_ALGO, length: AES_KEY_BITS },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptText(plaintext, passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveAesKey(passphrase, salt);

    const pt = te.encode(plaintext);
    const ctBuf = await crypto.subtle.encrypt({ name: AES_ALGO, iv }, key, pt);
    const ct = new Uint8Array(ctBuf);

    const token =
      ENC_PREFIX +
      `${u8ToB64(salt)}:${u8ToB64(iv)}:${u8ToB64(ct)}` +
      ENC_SUFFIX;

    // Wrap token to prevent XenForo formatting (emojis) from corrupting it. dont know how to make it work with formatting and no emojis unfortunately
    return `${WRAP_PREFIX}${token}${WRAP_SUFFIX}`;
  }

  async function decryptToken(token, passphrase) {
    token = stripWrapper(token);

    const inner = token.slice(ENC_PREFIX.length, token.length - ENC_SUFFIX.length);
    const parts = inner.split(":");
    if (parts.length !== 3) throw new Error("Bad token format");

    const salt = b64ToU8(parts[0]);
    const iv = b64ToU8(parts[1]);
    const ct = b64ToU8(parts[2]);

    const key = await deriveAesKey(passphrase, salt);
    const ptBuf = await crypto.subtle.decrypt({ name: AES_ALGO, iv }, key, ct);
    return td.decode(ptBuf);
  }

  function isAlreadyEncrypted(text) {
    const t = stripWrapper(text);
    return t.startsWith(ENC_PREFIX) && t.endsWith(ENC_SUFFIX);
  }

  // ----------------------------
  // 6b) OUTGOING REQUEST REWRITE
  // ----------------------------

  function isLikelyReplyEndpoint(urlObj) {
    if (!urlObj) return false;
    const p = urlObj.pathname.toLowerCase();
    return (
      p.includes("/conversations/") &&
      (p.includes("/reply") || p.includes("/add-reply") || p.includes("/reply-preview") || p.includes("/insert"))
    );
  }

  function toAbsUrl(u) {
    try { return new URL(u, location.href); } catch { return null; }
  }

  function getContentTypeFromHeaders(headers) {
    if (!headers) return "";
    try {
      if (headers.get) return headers.get("content-type") || "";
      // Plain object or array-ish
      if (Array.isArray(headers)) {
        for (const [k, v] of headers) if (String(k).toLowerCase() === "content-type") return String(v || "");
      }
      for (const k of Object.keys(headers)) {
        if (String(k).toLowerCase() === "content-type") return String(headers[k] || "");
      }
    } catch {}
    return "";
  }

  // ADDED: helper to locate the actual message key
  function pickMessageKeyFromFormData(fd) {
    for (const k of MESSAGE_KEYS) {
      const v = fd.get(k);
      if (typeof v === "string" && v.trim()) return k;
    }
    return null;
  }

  // ADDED: helper to locate the actual message key
  function pickMessageKeyFromUrlSearchParams(usp) {
    for (const k of MESSAGE_KEYS) {
      const v = usp.get(k);
      if (typeof v === "string" && v.trim()) return k;
    }
    return null;
  }

  async function rewriteOutgoingBodyIfNeeded(url, method, body, headers) {
    const urlObj = toAbsUrl(url);
    if (!urlObj) return null;

    // Orewrite real sends assuming this shit works this time
    if (!isLikelyReplyEndpoint(urlObj)) return null;

    const m = String(method || "").toUpperCase();
    if (!(m === "POST" || m === "PUT" || m === "PATCH")) return null;

    const pw = await loadPassphrase();
    if (!pw) return null;

    // ---- FormData ----
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      // CHANGED: support message_html variants
      const keyFound = pickMessageKeyFromFormData(body);
      if (!keyFound) return null;

      const msg = body.get(keyFound);
      if (typeof msg !== "string" || !msg.trim()) return null;
      if (isAlreadyEncrypted(msg)) return null;

      const enc = await encryptText(msg, pw);

      // Clone FormData, replacing message
      const fd = new FormData();
      for (const [k, v] of body.entries()) {
        if (k === keyFound) fd.append(k, enc);
        else fd.append(k, v);
      }
      return fd;
    }

    // ---- URLSearchParams ----
    if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
      // CHANGED: support message_html variants
      const keyFound = pickMessageKeyFromUrlSearchParams(body);
      if (!keyFound) return null;

      const msg = body.get(keyFound);
      if (!msg || !String(msg).trim()) return null;
      if (isAlreadyEncrypted(String(msg))) return null;

      const enc = await encryptText(String(msg), pw);
      const usp = new URLSearchParams(body.toString());
      usp.set(keyFound, enc);
      return usp;
    }

    // ---- String body ----
    if (typeof body === "string") {
      const ct = getContentTypeFromHeaders(headers).toLowerCase();

      // If it looks like form-encoded, rewrite via URLSearchParams
      const looksForm =
        ct.includes("application/x-www-form-urlencoded") ||
        (body.includes("=") && body.includes("&") && !body.trim().startsWith("{"));

      if (looksForm) {
        const usp = new URLSearchParams(body);

        // CHANGED: support message_html variants
        const keyFound = pickMessageKeyFromUrlSearchParams(usp);
        if (!keyFound) return null;

        const msg = usp.get(keyFound);
        if (!msg || !String(msg).trim()) return null;
        if (isAlreadyEncrypted(String(msg))) return null;

        const enc = await encryptText(String(msg), pw);
        usp.set(keyFound, enc);
        return usp.toString();
      }

      // If JSON, try rewriting message property (less common for XenForo, but safe)
      if (body.trim().startsWith("{")) {
        try {
          const obj = JSON.parse(body);
          if (!obj || typeof obj !== "object") return null;

          // CHANGED: support message_html variants
          let keyFound = null;
          for (const k of MESSAGE_KEYS) {
            if (typeof obj[k] === "string" && obj[k].trim()) { keyFound = k; break; }
          }
          if (!keyFound) return null;

          const msg = obj[keyFound];
          if (typeof msg !== "string" || !msg.trim()) return null;
          if (isAlreadyEncrypted(msg)) return null;

          obj[keyFound] = await encryptText(msg, pw);
          return JSON.stringify(obj);
        } catch {
          return null;
        }
      }

      return null;
    }

    // Unknown body type (Blob/ArrayBuffer/etc) -> don't touch
    return null;
  }

  // ----------------------------
  // 7) FIND THE EDITOR
  // ----------------------------

  function findEditorRoot() {
    return document.querySelector(".js-editor") || document;
  }

  // CHANGED: scope editor lookup to the actual reply form
  function findReplyForm() {
  // Prefer: form that actually contains the editor fields (works even if action="" or missing)
  const forms = Array.from(document.querySelectorAll("form"));

  // 1) Strong match: has message textarea or froala editable
  const strong = forms.find(f =>
    f.querySelector('textarea[name="message"], textarea[name="message_html"], .fr-element[contenteditable="true"]')
  );
  if (strong) return strong;

  // 2) Next: closest form around a known editor element
  const ce = document.querySelector('.fr-element[contenteditable="true"]');
  if (ce && ce.closest) {
    const f = ce.closest("form");
    if (f) return f;
  }
  const ta = document.querySelector('textarea[name="message"], textarea[name="message_html"]');
  if (ta && ta.closest) {
    const f = ta.closest("form");
    if (f) return f;
  }

  // 3) Last resort: original heuristic (action contains /conversations/)
  return forms.find((f) => (f.getAttribute("action") || "").includes("/conversations/")) || null;
}


  // ADDED: scoped editor finders
  function findMessageTextareaIn(form) {
    if (!form) return null;
    return form.querySelector('textarea[name="message"], textarea[name="message_html"]');
  }

  function findContentEditableIn(form) {
    if (!form) return null;
    return form.querySelector('.fr-element[contenteditable="true"]');
  }

  // CHANGED: read from the form being submitted (prevents grabbing wrong textarea)
  function getEditorTextFromForm(form) {
  // Prefer Froala visible content first (textarea may be unsynced until submit)
  const ce = findContentEditableIn(form);
  if (ce) {
    const t = ce.innerText || "";
    if (t.trim()) return t;
  }

  const ta = findMessageTextareaIn(form);
  if (ta && typeof ta.value === "string") return ta.value;

  return "";
}


  // CHANGED: write to the form being submitted
  function setEditorTextInForm(form, newText) {
  let ok = false;

  // Write to Froala surface if present
  const ce = findContentEditableIn(form);
  if (ce) {
    ce.innerText = newText;
    ce.dispatchEvent(new Event("input", { bubbles: true }));
    ce.dispatchEvent(new Event("change", { bubbles: true }));
    ok = true;
  }

  // ALSO write to textarea so XF has the value even if it submits from textarea
  const ta = findMessageTextareaIn(form);
  if (ta) {
    ta.value = newText;
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    ta.dispatchEvent(new Event("change", { bubbles: true }));
    ok = true;
  }

  return ok;
}


  // KEEP: legacy helpers for UI buttons; now they just route through reply form
  function findMessageTextarea() {
    const form = findReplyForm();
    return form ? findMessageTextareaIn(form) : null;
  }

  function findContentEditable() {
    const form = findReplyForm();
    return form ? findContentEditableIn(form) : null;
  }

  function getEditorText() {
    const form = findReplyForm();
    return form ? getEditorTextFromForm(form) : "";
  }

  function setEditorText(newText) {
    const form = findReplyForm();
    return form ? setEditorTextInForm(form, newText) : false;
  }

  // ----------------------------
  // 8) CSS
  // ----------------------------

  GM_addStyle(`
    .xfenc-bar {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      margin: 8px 0;
      padding: 6px 10px;
      border: 1px solid rgba(0,0,0,.15);
      border-radius: 10px;
      font-size: 12px;
      background: rgba(40, 46, 57);
    }
    .xfenc-btn {
      cursor: pointer;
      user-select: none;
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,.2);
      background: rgba(40, 46, 57);
    }
    .xfenc-btn:hover { background: rgba(149, 159, 180); }
    .xfenc-status { opacity: 0.8; }

    .${DECRYPTED_SPAN_CLASS} { white-space: pre-wrap; }
    .${DECRYPT_ERROR_CLASS} { opacity: 0.75; text-decoration: underline dotted; }
  `);

  // ----------------------------
  // 9) UI BAR
  // ----------------------------

  async function ensureUi() {
    const root = findEditorRoot();
    if (!root) return;
    if (document.querySelector(".xfenc-bar")) return;

    const bar = document.createElement("div");
    bar.className = "xfenc-bar";

    const btnSet = document.createElement("div");
    btnSet.className = "xfenc-btn";
    btnSet.textContent = "🔐 Set key";

    const btnEncrypt = document.createElement("div");
    btnEncrypt.className = "xfenc-btn";
    btnEncrypt.textContent = "Encrypt draft";

    const btnRedecrypt = document.createElement("div");
    btnRedecrypt.className = "xfenc-btn";
    btnRedecrypt.textContent = "Re-decrypt page";

    const status = document.createElement("div");
    status.className = "xfenc-status";
    status.textContent = "Key: (not set)";

    async function refreshStatus() {
      const pw = await loadPassphrase();
      status.textContent = pw ? "Key: set ✅" : "Key: (not set)";
    }

    btnSet.addEventListener("click", async () => {
      const current = await loadPassphrase();
      const pw = prompt(
        `Set passphrase for this conversation (ID ${state.convId}).\n\nShare this passphrase with the other participant safely.\n(Leaving blank clears it.)`,
        current
      );
      if (pw === null) return;
      await savePassphrase(pw);
      await refreshStatus();
      await redecryptPage();
    });

    btnEncrypt.addEventListener("click", async () => {
      const pw = await loadPassphrase();
      if (!pw) return alert("Set a passphrase first (🔐 Set key).");

      const text = getEditorText();
      if (!text.trim()) return;
      if (isAlreadyEncrypted(text)) return alert("Draft already looks encrypted.");

      const enc = await encryptText(text, pw);
      if (!setEditorText(enc)) alert("Couldn't locate the XenForo editor input on this page.");
    });

    btnRedecrypt.addEventListener("click", async () => {
      await redecryptPage();
    });

    bar.appendChild(btnSet);
    bar.appendChild(btnEncrypt);
    bar.appendChild(btnRedecrypt);
    bar.appendChild(status);

    const ta = findMessageTextarea();
    const ce = findContentEditable();
    const anchor = ta || ce || root;
    anchor.parentElement?.insertBefore(bar, anchor);

    await refreshStatus();
  }

  GM_registerMenuCommand("XFENC: Set conversation key", async () => {
    const current = await loadPassphrase();
    const pw = prompt(`Set passphrase for conversation ID ${state.convId} (blank clears):`, current);
    if (pw === null) return;
    await savePassphrase(pw);
    await redecryptPage();
    alert("Saved.");
  });

  GM_registerMenuCommand("XFENC: Re-decrypt page", async () => {
    await redecryptPage();
    alert("Re-decrypt complete (if key matches).");
  });

  // ----------------------------
  // 10) ENCRYPT AUTOMATICALLY WHEN SENDING
  // ----------------------------

  async function interceptSend() {
    const form = findReplyForm();
    if (!form) return;

    if (form.__xfencHooked) return;
    form.__xfencHooked = true;

    form.addEventListener(
      "submit",
      async (ev) => {
        try {
          const f = ev.target || form;

          const pw = await loadPassphrase();
          if (!pw) return;

          // CHANGED: scope to this form
          const text = getEditorTextFromForm(f);
          if (!text.trim()) return;
          if (isAlreadyEncrypted(text)) return;

          ev.preventDefault();
          ev.stopPropagation();

          const enc = await encryptText(text, pw);
          if (!setEditorTextInForm(f, enc)) throw new Error("Editor not found");

          Promise.resolve().then(() => f.submit());
        } catch (e) {
          console.error("XFENC encrypt-on-send failed:", e);
        }
      },
      true
    );
  }

  // ADDED: Ctrl+Enter capture hook (some XF setups bypass submit listener)
  function installCtrlEnterEncrypt() {
    if (document.__xfencCtrlEnterInstalled) return;
    document.__xfencCtrlEnterInstalled = true;

    document.addEventListener("keydown", async (e) => {
      const isCtrlEnter =
        (e.ctrlKey || e.metaKey) && (e.key === "Enter" || e.keyCode === 13);

      if (!isCtrlEnter) return;

      const form = findReplyForm();
      if (!form) return;

      const pw = await loadPassphrase();
      if (!pw) return;

      const text = getEditorTextFromForm(form);
      if (!text.trim()) return;
      if (isAlreadyEncrypted(text)) return;

      e.preventDefault();
      e.stopPropagation();

      try {
        const enc = await encryptText(text, pw);
        setEditorTextInForm(form, enc);
        Promise.resolve().then(() => (typeof form.requestSubmit === "function" ? form.requestSubmit() : form.submit()));
      } catch (err) {
        console.error("[XFENC] Ctrl+Enter encrypt failed:", err);
      }
    }, true);
  }

  // ADDED: patch native submit/requestSubmit to catch programmatic submits
  function installNativeSubmitEncryption() {
    if (HTMLFormElement.prototype.__xfencPatched) return;
    HTMLFormElement.prototype.__xfencPatched = true;

    const origSubmit = HTMLFormElement.prototype.submit;
    const origRequestSubmit = HTMLFormElement.prototype.requestSubmit;

    async function maybeEncryptAndThen(form, doSubmit) {
      try {
        const action = (form.getAttribute("action") || "");
        if (!action.includes("/conversations/")) return doSubmit();

        const pw = await loadPassphrase();
        if (!pw) return doSubmit();

        const text = getEditorTextFromForm(form);
        if (!text.trim()) return doSubmit();
        if (isAlreadyEncrypted(text)) return doSubmit();

        const enc = await encryptText(text, pw);
        setEditorTextInForm(form, enc);

        return doSubmit();
      } catch (e) {
        console.warn("[XFENC] native submit hook failed:", e);
        return doSubmit();
      }
    }

    HTMLFormElement.prototype.submit = function () {
      const form = this;
      maybeEncryptAndThen(form, () => origSubmit.call(form));
    };

    if (typeof origRequestSubmit === "function") {
      HTMLFormElement.prototype.requestSubmit = function (submitter) {
        const form = this;
        maybeEncryptAndThen(form, () => origRequestSubmit.call(form, submitter));
      };
    }
  }

  // ADDED: patch XF.ajax / jQuery.ajax (ctrl+enter can use these directly)
  function installAjaxEncryptionHooks() {
    if (window.__xfencAjaxHooksInstalled) return;
    window.__xfencAjaxHooksInstalled = true;

    function patchXF() {
      if (!window.XF || typeof window.XF.ajax !== "function" || window.XF.ajax.__xfencPatched) return;

      const orig = window.XF.ajax.bind(window.XF);

      window.XF.ajax = function (url, data, success, options) {
        const urlObj = toAbsUrl(url);
        if (!isLikelyReplyEndpoint(urlObj)) return orig(url, data, success, options);

        if (data && typeof data === "object" && !(data instanceof FormData) && !(data instanceof URLSearchParams)) {
          (async () => {
            try {
              const pw = await loadPassphrase();
              if (!pw) return orig(url, data, success, options);

              const newData = Object.assign({}, data);
              for (const k of MESSAGE_KEYS) {
                if (typeof newData[k] === "string" && newData[k].trim() && !isAlreadyEncrypted(newData[k])) {
                  newData[k] = await encryptText(newData[k], pw);
                  break;
                }
              }
              return orig(url, newData, success, options);
            } catch (e) {
              console.warn("[XFENC] XF.ajax encrypt failed:", e);
              return orig(url, data, success, options);
            }
          })();
          return;
        }

        return orig(url, data, success, options);
      };

      window.XF.ajax.__xfencPatched = true;
      console.info("[XFENC] Patched XF.ajax");
    }

    function patchJQ() {
      const $ = window.jQuery;
      if (!$ || typeof $.ajax !== "function" || $.ajax.__xfencPatched) return;

      const orig = $.ajax.bind($);

      $.ajax = function (opts) {
        try {
          const url = (typeof opts === "string") ? opts : (opts && opts.url);
          const data = opts && opts.data;

          const urlObj = toAbsUrl(url);
          if (!isLikelyReplyEndpoint(urlObj)) return orig(opts);

          if (data && typeof data === "object" && !(data instanceof FormData) && !(data instanceof URLSearchParams)) {
            return (async () => {
              const pw = await loadPassphrase();
              if (!pw) return orig(opts);

              const newOpts = Object.assign({}, opts);
              const newData = Object.assign({}, data);

              for (const k of MESSAGE_KEYS) {
                if (typeof newData[k] === "string" && newData[k].trim() && !isAlreadyEncrypted(newData[k])) {
                  newData[k] = await encryptText(newData[k], pw);
                  break;
                }
              }

              newOpts.data = newData;
              return orig(newOpts);
            })();
          }
        } catch (e) {
          console.warn("[XFENC] $.ajax encrypt failed:", e);
        }

        return orig(opts);
      };

      $.ajax.__xfencPatched = true;
      console.info("[XFENC] Patched jQuery.ajax");
    }

    patchXF();
    patchJQ();

    const maxMs = 10000;
    const start = Date.now();
    const t = setInterval(() => {
      patchXF();
      patchJQ();
      const okXF = window.XF && window.XF.ajax && window.XF.ajax.__xfencPatched;
      const okJQ = window.jQuery && window.jQuery.ajax && window.jQuery.ajax.__xfencPatched;
      if (okXF || okJQ || (Date.now() - start) > maxMs) clearInterval(t);
    }, 250);
  }

  // ----------------------------
  // 11) DECRYPT MESSAGES (token-aware, wrapper-aware)
  // ----------------------------

  function findMessageContainers() {
    const candidates = [
      ...document.querySelectorAll(".message-body .bbWrapper"),
      ...document.querySelectorAll(".message-body"),
      ...document.querySelectorAll(".bbWrapper"),
    ];
    return Array.from(new Set(candidates));
  }

  // If token is wrapped, we want the WHOLE wrapped token string:
  // [plain][[XFENC...]] [/plain]  OR  [code][[XFENC...]] [/code]
  function expandToIncludeWrapper(raw, startIdx, endIdx) {
    const before = raw.slice(0, startIdx);
    const after = raw.slice(endIdx);

    // Include wrapper prefix if it ends immediately before startIdx (allow whitespace)
    const prefixMatch = before.match(/(\[plain\]|\[code\])\s*$/i);
    if (prefixMatch) {
      startIdx -= prefixMatch[0].length;
    }

    // Include wrapper suffix if it begins immediately after endIdx (allow whitespace)
    const suffixMatch = after.match(/^\s*(\[\/plain\]|\[\/code\])/i);
    if (suffixMatch) {
      endIdx += suffixMatch[0].length;
    }

    return { startIdx, endIdx };
  }

  function extractTokensFromText(text) {
    const tokens = [];
    let idx = 0;

    while (true) {
      let start = text.indexOf(ENC_PREFIX, idx);
      if (start === -1) break;

      let end = text.indexOf(ENC_SUFFIX, start + ENC_PREFIX.length);
      if (end === -1) break;

      end = end + ENC_SUFFIX.length;

      const expanded = expandToIncludeWrapper(text, start, end);

      tokens.push({
        token: text.slice(expanded.startIdx, expanded.endIdx),
        start: expanded.startIdx,
        end: expanded.endIdx,
      });

      idx = expanded.endIdx;
    }

    return tokens;
  }

  async function replaceTokensInTextNode(textNode, passphrase) {
    const raw = textNode.nodeValue || "";
    if (!raw.includes(ENC_PREFIX)) return false;

    const tokens = extractTokensFromText(raw);
    if (!tokens.length) return false;

    const frag = document.createDocumentFragment();
    let cursor = 0;

    for (const t of tokens) {
      if (t.start > cursor) {
        frag.appendChild(document.createTextNode(raw.slice(cursor, t.start)));
      }

      const span = document.createElement("span");
      span.className = DECRYPTED_SPAN_CLASS;
      span.setAttribute("data-xfenc", "1");
      span.setAttribute("data-xfenc-token", t.token);

      try {
        const pt = await decryptToken(t.token, passphrase);
        span.textContent = pt;
      } catch {
        // If it can't decrypt, show original string to help debugging.
        span.textContent = t.token;
        span.classList.add(DECRYPT_ERROR_CLASS);
        span.title = "Encrypted message (could not decrypt with current key OR token was altered by formatting)";
      }

      frag.appendChild(span);
      cursor = t.end;
    }

    if (cursor < raw.length) {
      frag.appendChild(document.createTextNode(raw.slice(cursor)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
    return true;
  }

  async function decryptWithinElement(el, passphrase) {
    if (!el.textContent || !el.textContent.includes(ENC_PREFIX)) return;

    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.includes(ENC_PREFIX)) {
            return NodeFilter.FILTER_REJECT;
          }

          const parentEl = node.parentElement;
          if (parentEl && parentEl.closest && parentEl.closest(`[data-xfenc="1"]`)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false
    );

    const targets = [];
    let n;
    while ((n = walker.nextNode())) targets.push(n);

    for (const textNode of targets) {
      // eslint-disable-next-line no-await-in-loop
      await replaceTokensInTextNode(textNode, passphrase);
    }
  }

  async function scanAndDecryptAll() {
    if (state.scanInProgress) return;
    state.scanInProgress = true;

    try {
      const pw = await loadPassphrase();
      if (!pw) return;

      const els = findMessageContainers();
      for (const el of els) {
        // eslint-disable-next-line no-await-in-loop
        await decryptWithinElement(el, pw);
      }
    } finally {
      state.scanInProgress = false;
    }
  }

  function scheduleScan() {
    if (state.scanTimer) return;
    state.scanTimer = setTimeout(async () => {
      state.scanTimer = null;
      await scanAndDecryptAll().catch(() => {});
    }, SCAN_DEBOUNCE_MS);
  }

  async function redecryptPage() {
    const spans = document.querySelectorAll(`[data-xfenc="1"][data-xfenc-token]`);
    for (const sp of spans) {
      const token = sp.getAttribute("data-xfenc-token");
      if (!token) continue;
      sp.replaceWith(document.createTextNode(token));
    }
    await scanAndDecryptAll();
  }

  // ----------------------------
  // 12) WATCH THE PAGE
  // ----------------------------

  function observeNewMessages() {
    const target = document.body;
    if (!target) return;

    const obs = new MutationObserver(() => {
      scheduleScan();
      ensureUi().catch(() => {});
      interceptSend().catch(() => {});
    });

    obs.observe(target, { childList: true, subtree: true });
  }

  // ----------------------------
  // 13) START
  // ----------------------------

  (async function init() {
    initConversationIdentity();
    await loadPassphrase();

    if (document.readyState === "loading") {
      await new Promise((res) => document.addEventListener("DOMContentLoaded", res, { once: true }));
    }

    // ADDED: install extra send-path hooks
    installCtrlEnterEncrypt();
    installNativeSubmitEncryption();
    installAjaxEncryptionHooks();

    await ensureUi();
    await interceptSend();
    await scanAndDecryptAll();
    observeNewMessages();
  })().catch(console.error);

})();
