// ==UserScript==
// @name         (Mobile) XenForo Conversations E2EE
// @namespace    xfenc-userscript
// @version      0.8-mobile
// @description  MOBILE-ONLY: Encrypt outgoing XenForo conversation replies locally and decrypt incoming tokens. For Firefox Android + Violentmonkey / iOS Safari + Userscripts app.
// @author       martyrdom
// @license      GNU GPLv3
// @match        *://*/conversations/*
// @include      *conversations*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563037/%28Mobile%29%20XenForo%20Conversations%20E2EE.user.js
// @updateURL https://update.greasyfork.org/scripts/563037/%28Mobile%29%20XenForo%20Conversations%20E2EE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ========= DEBUG / FAILSAFE =========
  function debugBanner(msg) {
    try {
      const id = "xfenc-mobile-debug";
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("div");
        el.id = id;
        el.style.cssText =
          "position:fixed;z-index:2147483647;left:8px;bottom:8px;" +
          "padding:8px 10px;border-radius:10px;font:12px/1.2 sans-serif;" +
          "background:rgba(0,0,0,.8);color:#fff;max-width:80vw;word-break:break-word;";
        document.documentElement.appendChild(el);
      }
      el.textContent = "XFENC mobile: " + msg;
    } catch {}
  }

  // Wrap everything so one error doesn't kill the script silently
  try {
    // ----------------------------
    // COMPAT LAYER (GM fallbacks)
    // ----------------------------
    const compat = {
      async get(key, def = "") {
        try { if (typeof GM_getValue === "function") return await GM_getValue(key, def); } catch {}
        try { const v = localStorage.getItem(key); return v == null ? def : v; } catch {}
        return def;
      },
      async set(key, val) {
        try { if (typeof GM_setValue === "function") return await GM_setValue(key, val); } catch {}
        try { localStorage.setItem(key, String(val ?? "")); } catch {}
      },
      addStyle(css) {
        try { if (typeof GM_addStyle === "function") return GM_addStyle(css); } catch {}
        try {
          const style = document.createElement("style");
          style.textContent = css;
          (document.head || document.documentElement).appendChild(style);
        } catch {}
      },
      registerMenu(name, fn) {
        try { if (typeof GM_registerMenuCommand === "function") return GM_registerMenuCommand(name, fn); } catch {}
      }
    };

    function envOk() {
      return !!(window.crypto && window.crypto.subtle && window.TextEncoder && window.TextDecoder);
    }

    // Don't instantiate TextEncoder/TextDecoder at top-level (can crash on some mobile setups)
    function getEncoders() {
      return { te: new TextEncoder(), td: new TextDecoder() };
    }

    // ============================
    // SETTINGS / STATE
    // ============================
    const ENC_PREFIX = "[[XFENC:v1:";
    const ENC_SUFFIX = "]]";
    const WRAP_PREFIX = "[plain]";
    const WRAP_SUFFIX = "[/plain]";
    const PBKDF2_ITERATIONS = 250000;
    const PBKDF2_HASH = "SHA-256";
    const AES_ALGO = "AES-GCM";
    const AES_KEY_BITS = 256;

    const DECRYPTED_SPAN_CLASS = "xfenc-decrypted-span";
    const DECRYPT_ERROR_CLASS = "xfenc-decrypt-error";
    const SCAN_DEBOUNCE_MS = 150;

    const state = {
      convId: null,
      keyStoreId: null,
      passphrase: null,
      scanTimer: null,
      scanInProgress: false,
      installedOnce: false
    };

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
      state.passphrase = (await compat.get(state.keyStoreId, "")) || "";
      return state.passphrase;
    }
    async function savePassphrase(pw) {
      state.passphrase = pw || "";
      await compat.set(state.keyStoreId, state.passphrase);
    }

    // ============================
    // BASE64
    // ============================
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

    function stripWrapper(text) {
      const t = (text || "").trim();
      if (t.toLowerCase().startsWith("[plain]") && t.toLowerCase().endsWith("[/plain]")) return t.slice(7, -8).trim();
      if (t.toLowerCase().startsWith("[code]") && t.toLowerCase().endsWith("[/code]")) return t.slice(6, -7).trim();
      return t;
    }
    function isAlreadyEncrypted(text) {
      const t = stripWrapper(text);
      return t.startsWith(ENC_PREFIX) && t.endsWith(ENC_SUFFIX);
    }

    // ============================
    // CRYPTO
    // ============================
    async function deriveAesKey(passphrase, saltU8) {
      const { te } = getEncoders();
      const baseKey = await crypto.subtle.importKey("raw", te.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
      return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: saltU8, iterations: PBKDF2_ITERATIONS, hash: PBKDF2_HASH },
        baseKey,
        { name: AES_ALGO, length: AES_KEY_BITS },
        false,
        ["encrypt", "decrypt"]
      );
    }

    async function encryptText(plaintext, passphrase) {
      const { te } = getEncoders();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveAesKey(passphrase, salt);
      const pt = te.encode(plaintext);
      const ctBuf = await crypto.subtle.encrypt({ name: AES_ALGO, iv }, key, pt);
      const ct = new Uint8Array(ctBuf);
      const token = ENC_PREFIX + `${u8ToB64(salt)}:${u8ToB64(iv)}:${u8ToB64(ct)}` + ENC_SUFFIX;
      return `${WRAP_PREFIX}${token}${WRAP_SUFFIX}`;
    }

    async function decryptToken(token, passphrase) {
      const { td } = getEncoders();
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

    // ============================
    // DOM: FIND EDITOR
    // ============================
    function findReplyForm() {
      const forms = Array.from(document.querySelectorAll("form"));
      const strong = forms.find(f =>
        f.querySelector('textarea[name="message"], textarea[name="message_html"], .fr-element[contenteditable="true"]')
      );
      if (strong) return strong;

      const ce = document.querySelector('.fr-element[contenteditable="true"]');
      if (ce && ce.closest) return ce.closest("form");

      const ta = document.querySelector('textarea[name="message"], textarea[name="message_html"]');
      if (ta && ta.closest) return ta.closest("form");

      return null;
    }

    function findContentEditableIn(form) {
      return form ? form.querySelector('.fr-element[contenteditable="true"]') : null;
    }
    function findTextareaIn(form) {
      return form ? form.querySelector('textarea[name="message"], textarea[name="message_html"]') : null;
    }

    function getEditorTextFromForm(form) {
      const ce = findContentEditableIn(form);
      if (ce) {
        const t = ce.innerText || "";
        if (t.trim()) return t;
      }
      const ta = findTextareaIn(form);
      if (ta) return ta.value || "";
      return "";
    }

    function setEditorTextInForm(form, newText) {
      let ok = false;
      const ce = findContentEditableIn(form);
      if (ce) {
        ce.innerText = newText;
        ce.dispatchEvent(new Event("input", { bubbles: true }));
        ce.dispatchEvent(new Event("change", { bubbles: true }));
        ok = true;
      }
      const ta = findTextareaIn(form);
      if (ta) {
        ta.value = newText;
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.dispatchEvent(new Event("change", { bubbles: true }));
        ok = true;
      }
      return ok;
    }

    // ============================
    // UI
    // ============================
    compat.addStyle(`
      .xfenc-bar { display:inline-flex; gap:8px; align-items:center; margin:8px 0; padding:6px 10px;
        border:1px solid rgba(0,0,0,.15); border-radius:10px; font-size:12px; background:rgba(40,46,57); }
      .xfenc-btn { cursor:pointer; user-select:none; padding:6px 10px; border-radius:10px; border:1px solid rgba(0,0,0,.2);
        background:rgba(40,46,57); -webkit-tap-highlight-color:transparent; }
      .xfenc-btn:active { transform:scale(0.98); }
      .xfenc-status { opacity:0.85; }
      .xfenc-decrypted-span { white-space: pre-wrap; }
      .xfenc-decrypt-error { opacity:0.75; text-decoration: underline dotted; }
    `);

    async function ensureUi() {
      if (document.querySelector(".xfenc-bar")) return;

      const form = findReplyForm();
      if (!form) return;

      const anchor = findContentEditableIn(form) || findTextareaIn(form) || form;
      if (!anchor || !anchor.parentElement) return;

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
      btnRedecrypt.textContent = "Re-decrypt";

      const status = document.createElement("div");
      status.className = "xfenc-status";
      status.textContent = "Key: (not set)";

      async function refresh() {
        const pw = await loadPassphrase();
        if (!envOk()) status.textContent = "XFENC: crypto unavailable ❌";
        else status.textContent = pw ? "Key: set ✅" : "Key: (not set)";
      }

      btnSet.addEventListener("click", async () => {
        const current = await loadPassphrase();
        const pw = prompt(`Set passphrase for conversation ID ${state.convId} (blank clears):`, current);
        if (pw === null) return;
        await savePassphrase(pw);
        await refresh();
        await redecryptPage();
      });

      btnEncrypt.addEventListener("click", async () => {
        if (!envOk()) return alert("XFENC: WebCrypto not available.");
        const pw = await loadPassphrase();
        if (!pw) return alert("Set a passphrase first (🔐 Set key).");

        const text = getEditorTextFromForm(form);
        if (!text.trim()) return;
        if (isAlreadyEncrypted(text)) return alert("Draft already looks encrypted.");

        const enc = await encryptText(text, pw);
        setEditorTextInForm(form, enc);
      });

      btnRedecrypt.addEventListener("click", async () => {
        await redecryptPage();
      });

      bar.appendChild(btnSet);
      bar.appendChild(btnEncrypt);
      bar.appendChild(btnRedecrypt);
      bar.appendChild(status);

      anchor.parentElement.insertBefore(bar, anchor);
      await refresh();
    }

    // ============================
    // ENCRYPT ON SEND (MOBILE SAFE)
    // ============================
    async function encryptDraftIfNeeded(form) {
      if (!envOk()) return false;
      const pw = await loadPassphrase();
      if (!pw) return false;

      const text = getEditorTextFromForm(form);
      if (!text.trim()) return false;
      if (isAlreadyEncrypted(text)) return true;

      const enc = await encryptText(text, pw);
      return setEditorTextInForm(form, enc);
    }

    function installEncryptOnSendButtons() {
      const form = findReplyForm();
      if (!form || form.__xfencSendInstalled) return;
      form.__xfencSendInstalled = true;

      const handler = async (e) => {
        try {
          const pw = await loadPassphrase();
          if (!pw) return; // no key => allow normal send

          e.preventDefault();
          e.stopPropagation();

          const ok = await encryptDraftIfNeeded(form);
          if (!ok) return;

          form.submit();
        } catch (err) {
          console.error("[XFENC mobile] encrypt-on-send failed:", err);
          debugBanner("encrypt-on-send failed (see console)");
        }
      };

      const submitters = form.querySelectorAll('button[type="submit"], input[type="submit"]');
      for (const el of submitters) {
        el.addEventListener("touchstart", handler, { capture: true, passive: false });
        el.addEventListener("pointerdown", handler, true);
        el.addEventListener("click", handler, true);
      }
    }

    // ============================
    // DECRYPT
    // ============================
    function findMessageContainers() {
      const candidates = [
        ...document.querySelectorAll(".message-body .bbWrapper"),
        ...document.querySelectorAll(".message-body"),
        ...document.querySelectorAll(".bbWrapper"),
      ];
      return Array.from(new Set(candidates));
    }

    function expandToIncludeWrapper(raw, startIdx, endIdx) {
      const before = raw.slice(0, startIdx);
      const after = raw.slice(endIdx);
      const prefixMatch = before.match(/(\[plain\]|\[code\])\s*$/i);
      if (prefixMatch) startIdx -= prefixMatch[0].length;
      const suffixMatch = after.match(/^\s*(\[\/plain\]|\[\/code\])/i);
      if (suffixMatch) endIdx += suffixMatch[0].length;
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
        tokens.push({ token: text.slice(expanded.startIdx, expanded.endIdx), start: expanded.startIdx, end: expanded.endIdx });
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
        if (t.start > cursor) frag.appendChild(document.createTextNode(raw.slice(cursor, t.start)));

        const span = document.createElement("span");
        span.className = DECRYPTED_SPAN_CLASS;
        span.setAttribute("data-xfenc", "1");
        span.setAttribute("data-xfenc-token", t.token);

        try {
          const pt = await decryptToken(t.token, passphrase);
          span.textContent = pt;
        } catch {
          span.textContent = t.token;
          span.classList.add(DECRYPT_ERROR_CLASS);
          span.title = "Encrypted message (could not decrypt with current key OR token was altered by formatting)";
        }

        frag.appendChild(span);
        cursor = t.end;
      }

      if (cursor < raw.length) frag.appendChild(document.createTextNode(raw.slice(cursor)));
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
            if (!node.nodeValue || !node.nodeValue.includes(ENC_PREFIX)) return NodeFilter.FILTER_REJECT;
            const p = node.parentElement;
            if (p && p.closest && p.closest(`[data-xfenc="1"]`)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        },
        false
      );

      const targets = [];
      let n;
      while ((n = walker.nextNode())) targets.push(n);

      for (const tn of targets) {
        // eslint-disable-next-line no-await-in-loop
        await replaceTokensInTextNode(tn, passphrase);
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

    function observe() {
      if (state.__obs) return;
      state.__obs = true;
      const target = document.body;
      if (!target) return;

      const obs = new MutationObserver(() => {
        scheduleScan();
        ensureUi().catch(() => {});
        installEncryptOnSendButtons();
      });
      obs.observe(target, { childList: true, subtree: true });
    }

    // ============================
    // DELAYED INIT / RETRIES
    // ============================
    async function installAll() {
      initConversationIdentity();
      await loadPassphrase();

      // If script is running at all, show a debug banner once
      if (!state.installedOnce) {
        state.installedOnce = true;
        debugBanner("loaded ✅");
      }

      await ensureUi();
      installEncryptOnSendButtons();
      await scanAndDecryptAll();
      observe();

      if (!envOk()) debugBanner("loaded ✅ (crypto unavailable ❌)");
    }

    async function retryInit() {
      // Retry for up to ~8 seconds to catch editors injected late
      const start = Date.now();
      while (Date.now() - start < 8000) {
        await installAll().catch((e) => {
          console.error("[XFENC mobile] installAll error:", e);
          debugBanner("error during init (see console)");
        });

        // If UI exists, we’re good
        if (document.querySelector(".xfenc-bar")) return;

        await new Promise(r => setTimeout(r, 300));
      }
      debugBanner("loaded ✅ (no editor/form found)");
    }

    // START
    retryInit();

    // XenForo AJAX navigation + Safari bfcache
    document.addEventListener("xf:load", () => { retryInit().catch(() => {}); });
    document.addEventListener("xf:reinit", () => { retryInit().catch(() => {}); });
    window.addEventListener("pageshow", () => { retryInit().catch(() => {}); });

  } catch (fatal) {
    console.error("[XFENC mobile] fatal error:", fatal);
    // If we can, show visible error
    try { debugBanner("fatal error (see console)"); } catch {}
  }
})();
