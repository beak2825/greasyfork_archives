// ==UserScript==
// @name         SpicyChat Export — JSON or .card.png
// @namespace    spicychat-export-v1
// @version      1.0.0
// @description  Fetches https://prod.nd-api.com/v2/characters/<id>, maps to SC Card v1, and exports as .card.json or embeds metadata into avatar as .card.png.
// @match        https://spicychat.ai/chat/*
// @match        https://spicychat.ai/chatbot/*
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      prod.nd-api.com
// @connect      cdn.nd-api.com
// @downloadURL https://update.greasyfork.org/scripts/561691/SpicyChat%20Export%20%E2%80%94%20JSON%20or%20cardpng.user.js
// @updateURL https://update.greasyfork.org/scripts/561691/SpicyChat%20Export%20%E2%80%94%20JSON%20or%20cardpng.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const API_BASE = "https://prod.nd-api.com/v2/characters/";
  const AUTH_STORAGE_KEY = "sc_export_v1_auth"; // { token, guest }

  // -----------------------------
  // UI
  // -----------------------------
  GM_addStyle(`
    .scx-toast {
      position: fixed; right: 18px; bottom: 78px; z-index: 999999;
      padding: 10px 12px; border-radius: 10px;
      background: rgba(20,20,22,0.92);
      border: 1px solid rgba(255,255,255,0.12);
      color: #fff;
      font: 12px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      max-width: 580px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      display: none; white-space: pre-wrap;
    }
    .scx-btn {
      position: fixed; right: 18px; bottom: 18px; z-index: 999999;
      padding: 10px 14px; border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(20,20,22,0.92); color: #fff;
      font: 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      user-select: none; white-space: nowrap;
      display: flex; align-items: center; gap: 10px;
    }
    .scx-btn:hover { filter: brightness(1.08); }

    .scx-menu {
      position: fixed; right: 18px; bottom: 62px; z-index: 1000000;
      width: 260px;
      background: rgba(20,20,22,0.96);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 12px;
      box-shadow: 0 14px 44px rgba(0,0,0,0.55);
      padding: 10px;
      display: none;
      color: #fff;
      font: 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    .scx-menu-title {
      font-weight: 700;
      margin: 4px 6px 10px 6px;
      opacity: 0.95;
    }
    .scx-menu button {
      width: 100%;
      padding: 10px 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.06);
      color: #fff;
      cursor: pointer;
      text-align: left;
      margin: 6px 0;
    }
    .scx-menu button:hover { background: rgba(255,255,255,0.10); }
    .scx-menu small { display:block; opacity: 0.75; margin-top: 4px; }
    .scx-menu .scx-danger { border-color: rgba(255,120,120,0.25); }
    .scx-menu .scx-row {
      display:flex; gap: 8px; margin-top: 8px;
    }
    .scx-menu .scx-row button { width: 50%; text-align:center; }
  `);

  let toastTimer = null;
  function toast(msg) {
    let el = document.querySelector(".scx-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "scx-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.style.display = "none"), 5200);
  }

  function ensureUi() {
    if (document.querySelector(".scx-btn")) return;

    const btn = document.createElement("button");
    btn.className = "scx-btn";
    btn.type = "button";
    btn.textContent = "⬇ Export";

    const menu = document.createElement("div");
    menu.className = "scx-menu";
    menu.innerHTML = `
      <div class="scx-menu-title">Export options</div>
      <button data-action="json">
        Export .card.json
        <small>SC Card v1 JSON (persona→description, title→personality)</small>
      </button>
      <button data-action="png">
        Export .card.png
        <small>Embeds Card v1 JSON into the avatar PNG (tEXt: chara)</small>
      </button>
      <button data-action="token" class="scx-danger">
        Set / Update Token
        <small>Fix 401 invalid/expired token</small>
      </button>
      <div class="scx-row">
        <button data-action="close">Close</button>
        <button data-action="help">Help</button>
      </div>
    `;

    function toggleMenu(show) {
      menu.style.display = show ? "block" : "none";
    }

    btn.addEventListener("click", () => {
      toggleMenu(menu.style.display !== "block");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      const within = menu.contains(e.target) || btn.contains(e.target);
      if (!within) toggleMenu(false);
    });

    menu.addEventListener("click", async (e) => {
      const action = e.target?.closest("button")?.dataset?.action;
      if (!action) return;

      if (action === "close") {
        toggleMenu(false);
        return;
      }
      if (action === "help") {
        toast(
          "If export fails with 401:\n" +
          "1) DevTools → Network → find a successful prod.nd-api.com request\n" +
          "2) Copy the Authorization Bearer token\n" +
          "3) Click “Set / Update Token”"
        );
        return;
      }
      if (action === "token") {
        try {
          const token = (prompt("Paste access token (JWT). Saved locally.") || "").trim();
          if (!looksLikeJwt(token)) return toast("That doesn’t look like a JWT.\nNothing saved.");
          const guest = (prompt("Optional: guest_userid (UUID). Leave blank if unknown.") || "").trim();
          saveAuth(token, guest);
          toast("Saved ✅\nToken stored for exports.");
        } catch (err) {
          toast(`Failed to save token ❌\n${String(err?.message || err)}`);
        }
        return;
      }

      toggleMenu(false);

      try {
        const id = detectCharacterId();
        if (!id) throw new Error("Couldn’t detect character id from URL. Open a /chat/<id> page.");

        toast("Auth check…");
        const auth = await ensureAuthInteractive();

        toast(`Fetching definition…\n${id}`);
        const sc = await fetchScCharacter(id, auth);

        const card = scToCardV1(sc); // mapping requested
        const safeName = safeFileStem(card.name);

        if (action === "json") {
          const filename = `${safeName}.card.json`;
          downloadJson(card, filename);
          toast(`Exported ✅\n${filename}`);
          return;
        }

        if (action === "png") {
          const avatarUrl = resolveAvatarUrl(sc);
          if (!avatarUrl) throw new Error("No avatar_url on character.");

          toast("Fetching avatar…");
          const avatarBytes = await gmFetchArrayBuffer(avatarUrl);

          toast("Converting to PNG…");
          const pngBytes = await toPngArrayBuffer(avatarBytes);

          toast("Embedding metadata…");
          const embedded = embedCharaTextChunk(pngBytes, card);

          const filename = `${safeName}.card.png`;
          downloadPng(embedded, filename);
          toast(`Exported ✅\n${filename}`);
          return;
        }
      } catch (err) {
        toast(`Export failed ❌\n${String(err?.message || err)}`);
      }
    });

    document.body.appendChild(btn);
    document.body.appendChild(menu);

    const saved = readSavedAuth();
    toast(saved?.token ? "Exporter ready ✅\n(Using saved token)" : "Exporter ready ✅\n(Set token if you hit 401)");
  }

  // SPA navigation support
  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      ensureUi();
    }
  }, 800);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureUi);
  } else {
    ensureUi();
  }

  // -----------------------------
  // Helpers
  // -----------------------------
  function safeFileStem(name) {
    return (String(name || "character").trim() || "character")
      .replace(/[^\w\-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "character";
  }

  function detectCharacterId() {
    const m = location.pathname.match(/\/chat\/([^\/?#]+)/i);
    if (m && m[1]) return m[1];
    const uuid = location.pathname.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return uuid ? uuid[0] : "";
  }

  // -----------------------------
  // Auth
  // -----------------------------
  function looksLikeJwt(s) {
    return typeof s === "string" &&
      /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(s.trim());
  }

  function readSavedAuth() {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return {
        token: typeof obj.token === "string" ? obj.token.trim() : "",
        guest: typeof obj.guest === "string" ? obj.guest.trim() : ""
      };
    } catch { return null; }
  }

  function saveAuth(token, guest) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, guest }));
  }

  function findFirstJwtInObject(obj) {
    if (!obj) return null;
    if (typeof obj === "string" && looksLikeJwt(obj)) return obj;

    if (Array.isArray(obj)) {
      for (const it of obj) {
        const hit = findFirstJwtInObject(it);
        if (hit) return hit;
      }
      return null;
    }

    if (typeof obj === "object") {
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (typeof v === "string" && looksLikeJwt(v)) return v;
        if (v && typeof v === "object") {
          const hit = findFirstJwtInObject(v);
          if (hit) return hit;
        }
      }
    }
    return null;
  }

  function autoDiscoverToken() {
    const candidates = [];
    const scan = (store) => {
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (!key) continue;
        let val = "";
        try { val = store.getItem(key) || ""; } catch { continue; }
        if (!val) continue;

        if (looksLikeJwt(val)) candidates.push(val.trim());

        if ((val.startsWith("{") && val.endsWith("}")) || (val.startsWith("[") && val.endsWith("]"))) {
          try {
            const parsed = JSON.parse(val);
            const hit = findFirstJwtInObject(parsed);
            if (hit) candidates.push(hit.trim());
          } catch {}
        }
      }
    };
    scan(localStorage);
    scan(sessionStorage);
    candidates.sort((a, b) => b.length - a.length);
    return candidates[0] || "";
  }

  function autoDiscoverGuestUserId() {
    const uuidRe = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const keys = ["guest_userid","guestUserId","x-guest-userid","nd_guest_userid","spicychat_guest_userid"];
    for (const k of keys) {
      const v = (localStorage.getItem(k) || sessionStorage.getItem(k) || "").trim();
      const m = v.match(uuidRe);
      if (m) return m[0];
    }
    const scan = (store) => {
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (!key) continue;
        let val = "";
        try { val = store.getItem(key) || ""; } catch { continue; }
        const m = val.match(uuidRe);
        if (m) return m[0];
      }
      return "";
    };
    return scan(localStorage) || scan(sessionStorage) || "";
  }

  async function ensureAuthInteractive() {
    const saved = readSavedAuth();
    if (saved?.token && looksLikeJwt(saved.token)) return saved;

    const token = autoDiscoverToken();
    const guest = autoDiscoverGuestUserId();
    if (token && looksLikeJwt(token)) {
      saveAuth(token, guest || "");
      return { token, guest: guest || "" };
    }

    const pasted = prompt("Paste your access token (JWT). It will be saved locally.");
    const t = (pasted || "").trim();
    if (!looksLikeJwt(t)) throw new Error("Token not set or doesn’t look like a JWT.");
    const g = (prompt("Optional: guest_userid (UUID). Leave blank if unknown.") || "").trim();
    saveAuth(t, g);
    return { token: t, guest: g };
  }

  // -----------------------------
  // Fetch SC character
  // -----------------------------
  async function fetchScCharacter(id, auth) {
    const url = API_BASE + encodeURIComponent(id);

    const headers = {
      "Accept": "application/json",
      "Authorization": `Bearer ${auth.token}`,
      "x-app-id": "spicychat"
    };
    if (auth.guest) headers["x-guest-userid"] = auth.guest;

    const res = await fetch(url, { method: "GET", credentials: "include", headers });
    const text = await res.text().catch(() => "");

    if (!res.ok) {
      if (res.status === 401) localStorage.removeItem(AUTH_STORAGE_KEY);
      throw new Error(`API ${res.status}\n${text.slice(0, 500)}`);
    }

    let data = null;
    try { data = JSON.parse(text); } catch {}
    if (!data || typeof data !== "object") throw new Error("API returned non-JSON response.");

    return (data.data && typeof data.data === "object") ? data.data : data;
  }

  // -----------------------------
  // SC -> Card v1 mapping (as requested)
  // persona -> description
  // title   -> personality
  // -----------------------------
  function scToCardV1(sc) {
    const now = Date.now();
    return {
      name: String(sc?.name || "Unnamed").trim(),

      // requested mapping:
      description: String(sc?.persona || "").trim(),
      personality: String(sc?.title || "").trim(),

      scenario: String(sc?.scenario || "").trim(),
      first_mes: String(sc?.greeting || "").trim(),
      mes_example: String(sc?.dialogue || "").trim(),

      metadata: {
        version: 1,
        created: now,
        modified: now,
        source: {
          platform: "SpicyChat",
          id: String(sc?.id || "").trim(),
          creator_username: String(sc?.creator_username || "").trim()
        }
      }
    };
  }

  // -----------------------------
  // JSON download (reliable)
  // -----------------------------
  function downloadJson(obj, filename) {
    const jsonText = JSON.stringify(obj, null, 2);
    const dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(jsonText);

    if (typeof GM_download === "function") {
      GM_download({
        url: dataUrl,
        name: filename,
        saveAs: true,
        onerror: () => fallbackDownload(dataUrl, filename),
        ontimeout: () => fallbackDownload(dataUrl, filename)
      });
      return;
    }
    fallbackDownload(dataUrl, filename);
  }

  function fallbackDownload(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // -----------------------------
  // Avatar fetch + PNG conversion
  // -----------------------------
  function resolveAvatarUrl(sc) {
    const raw = String(sc?.avatar_url || "").trim();
    if (!raw) return "";

    // Already absolute:
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

    // Your CDN is https://cdn.nd-api.com/avatars/...
    if (raw.startsWith("/")) return "https://cdn.nd-api.com" + raw;

    // Most commonly "avatars/....jpg"
    return "https://cdn.nd-api.com/" + raw.replace(/^\/+/, "");
  }

  function gmFetchArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "arraybuffer",
        onload: (res) => {
          if (res.status >= 200 && res.status < 300 && res.response) resolve(res.response);
          else reject(new Error(`Avatar fetch failed ${res.status}`));
        },
        onerror: () => reject(new Error("Avatar fetch network error"))
      });
    });
  }

  async function toPngArrayBuffer(imageArrayBuffer) {
    const blob = new Blob([imageArrayBuffer]);
    const bmp = await createImageBitmap(blob);

    const canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bmp, 0, 0);

    const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    return await pngBlob.arrayBuffer();
  }

  // -----------------------------
  // PNG metadata embedding (tEXt "chara" = base64(json))
  // -----------------------------
  function crc32(buf) {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
    }
    return ~c >>> 0;
  }

  function u32be(n) {
    const b = new Uint8Array(4);
    b[0] = (n >>> 24) & 255;
    b[1] = (n >>> 16) & 255;
    b[2] = (n >>> 8) & 255;
    b[3] = n & 255;
    return b;
  }

  function concatU8(...parts) {
    const len = parts.reduce((a, p) => a + p.length, 0);
    const out = new Uint8Array(len);
    let off = 0;
    for (const p of parts) { out.set(p, off); off += p.length; }
    return out;
  }

  function makeChunk(type4, dataU8) {
    const type = new TextEncoder().encode(type4);
    const len = u32be(dataU8.length);
    const crc = u32be(crc32(concatU8(type, dataU8)));
    return concatU8(len, type, dataU8, crc);
  }

  function parsePngChunks(pngU8) {
    const sig = pngU8.slice(0, 8);
    let off = 8;
    const chunks = [];

    while (off + 8 <= pngU8.length) {
      const len = (pngU8[off] << 24) | (pngU8[off+1] << 16) | (pngU8[off+2] << 8) | pngU8[off+3];
      const type = new TextDecoder().decode(pngU8.slice(off+4, off+8));
      const dataStart = off + 8;
      const dataEnd = dataStart + len;
      const crcEnd = dataEnd + 4;

      chunks.push({ type, rawStart: off, rawEnd: crcEnd });
      off = crcEnd;
      if (type === "IEND") break;
    }
    return { signature: sig, chunks };
  }

  function b64Utf8(s) {
    return btoa(unescape(encodeURIComponent(s)));
  }

  function embedCharaTextChunk(pngArrayBuffer, cardJsonObj) {
    const pngU8 = new Uint8Array(pngArrayBuffer);
    const { signature, chunks } = parsePngChunks(pngU8);

    const jsonText = JSON.stringify(cardJsonObj);
    const b64 = b64Utf8(jsonText);

    // PNG tEXt payload: keyword\0text
    const payload = "chara\0" + b64;
    const textData = new TextEncoder().encode(payload);
    const textChunk = makeChunk("tEXt", textData);

    const outParts = [signature];
    for (const ch of chunks) {
      if (ch.type === "IEND") outParts.push(textChunk);
      outParts.push(pngU8.slice(ch.rawStart, ch.rawEnd));
    }
    return concatU8(...outParts).buffer;
  }

  function downloadPng(arrayBuffer, filename) {
    const blob = new Blob([arrayBuffer], { type: "image/png" });
    const url = URL.createObjectURL(blob);

    // Anchor download is the most reliable for blob binary in browsers
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
})();
