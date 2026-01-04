// ==UserScript==
// @name         Discord Immediate Push (preserve settings; offline proto + captured Authorization)
// @namespace    local
// @version      2.6
// @description  Set 'Push Notification Inactive Timeout' to Immediate (0s) preserving ALL other settings. Uses a built-in minimal .proto and your captured endpoint+headers (incl. Authorization).
// @match        https://discord.com/*
// @match        https://ptb.discord.com/*
// @match        https://canary.discord.com/*
// @run-at       document-idle
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/protobufjs@7.2.4/dist/protobuf.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554729/Discord%20Immediate%20Push%20%28preserve%20settings%3B%20offline%20proto%20%2B%20captured%20Authorization%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554729/Discord%20Immediate%20Push%20%28preserve%20settings%3B%20offline%20proto%20%2B%20captured%20Authorization%29.meta.js
// ==/UserScript==

(function () {
  const AUTO_APPLY = false; // set true AFTER you've captured once if you want 0-click
  const LS_CAPTURE = "immediatePush_settingsProtoCapture_offline"; // { url, method, headers }
  const BTN_ID = "immediatePushSafeBtn";

  // ---- minimal schema (only what we need) ----
  // Tags deduced from the known minimal blob "KgQyAggA":
  // - PreloadedUserSettings.voice_and_video = field 5 (len-delimited)
  // - VoiceAndVideo.afk_timeout = field 6 (len-delimited)
  // - afk_timeout is a wrappers.UInt32Value where field 1 = value (varint)
  const INLINE_PROTO = `
    syntax = "proto3";
    package discord_users.v1;

    message UInt32Value { uint32 value = 1; }  // local wrapper; only "value" is needed

    message VoiceAndVideo {
      UInt32Value afk_timeout = 6;  // we only need this field
    }

    message PreloadedUserSettings {
      VoiceAndVideo voice_and_video = 5;  // we only need this field
    }
  `;

  // ---------- UI ----------
  if (!document.getElementById(BTN_ID)) {
    const btn = document.createElement("button");
    btn.textContent = "Immediate Push (safe)";
    btn.id = BTN_ID;
    Object.assign(btn.style, {
      position: "fixed", right: "18px", bottom: "18px", zIndex: 999999,
      padding: "10px 12px", border: "0", borderRadius: "10px",
      background: "#5865F2", color: "#fff", fontWeight: 700,
      cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,.28)"
    });
    btn.onclick = onClick;
    document.documentElement.appendChild(btn);
  }
  if (AUTO_APPLY) setTimeout(() => onClick(), 1500);

  // ---------- capture via fetch + XHR (URL + headers incl. Authorization) ----------
  hookFetch();
  hookXHR();

  // ---------- helpers ----------
  function toast(text) {
    try { GM_notification({ title: "Discord", text, timeout: 3500 }); } catch {}
    alert(text);
  }

  function headersToObject(h) {
    const out = {};
    try {
      if (!h) return out;
      if (Array.isArray(h)) { for (const [k, v] of h) out[String(k).toLowerCase()] = String(v); }
      else if (h instanceof Headers) { h.forEach((v, k) => out[String(k).toLowerCase()] = String(v)); }
      else if (typeof h === "object") { for (const k of Object.keys(h)) out[String(k).toLowerCase()] = String(h[k]); }
    } catch {}
    return out;
  }

  function saveCapture(obj) {
    try {
      const h = {};
      for (const k of Object.keys(obj.headers || {})) {
        const lk = k.toLowerCase();
        if (["content-length", "host", "origin"].includes(lk)) continue; // drop volatile headers
        h[lk] = String(obj.headers[k]);
      }
      const payload = { url: obj.url, method: (obj.method || "PATCH").toUpperCase(), headers: h };
      localStorage.setItem(LS_CAPTURE, JSON.stringify(payload));
      if (!window.__immediatePushCapturedNotified) {
        window.__immediatePushCapturedNotified = true;
        toast("Captured Discord settings-proto endpoint. Button is now fully 1-click.");
      }
    } catch {}
  }
  function getCapture() {
    try { const s = localStorage.getItem(LS_CAPTURE); return s ? JSON.parse(s) : null; } catch { return null; }
  }

  function hookFetch() {
    const nf = window.fetch;
    if (!nf || nf.__immediatePushWrapped) return;
    window.fetch = async function(input, init) {
      let url = "", method = "GET", headersObj = {};
      try {
        if (typeof input === "string") {
          url = input;
          if (init && init.method) method = String(init.method).toUpperCase();
          if (init && init.headers) headersObj = headersToObject(init.headers);
        } else if (input && typeof input.url === "string") {
          url = input.url;
          method = (input.method || "GET").toUpperCase();
          headersObj = headersToObject(input.headers || init?.headers);
        }
      } catch {}
      if (url.includes("/settings-proto/")) saveCapture({ url, method, headers: headersObj });
      return nf.apply(this, arguments);
    };
    window.fetch.__immediatePushWrapped = true;
  }

  function hookXHR() {
    const XHR = window.XMLHttpRequest;
    if (!XHR || XHR.__immediatePushWrapped) return;
    const open = XHR.prototype.open, setRequestHeader = XHR.prototype.setRequestHeader, send = XHR.prototype.send;

    XHR.prototype.open = function(method, url) {
      this.__immediatePush = { method: (method || "GET").toUpperCase(), url, headers: {} };
      return open.apply(this, arguments);
    };
    XHR.prototype.setRequestHeader = function(name, value) {
      try { if (this.__immediatePush && name) this.__immediatePush.headers[String(name).toLowerCase()] = String(value); } catch {}
      return setRequestHeader.apply(this, arguments);
    };
    XHR.prototype.send = function(body) {
      try {
        const info = this.__immediatePush;
        if (info && typeof info.url === "string" && info.url.includes("/settings-proto/")) {
          saveCapture({ url: info.url, method: info.method, headers: info.headers });
        }
      } catch {}
      return send.apply(this, arguments);
    };
    XHR.__immediatePushWrapped = true;
  }

  // ---------- main action ----------
  async function onClick() {
    try {
      // 1) Need a captured endpoint (do the 1-minute flip once if not captured yet)
      const cap = getCapture();
      if (!cap || !/\/settings-proto\/\d+/.test(cap.url)) {
        toast("I don't have the endpoint yet. Do this ONCE: Settings → Notifications → set timeout to '1 minute', then click again.");
        return;
      }

      // 2) Build headers from capture; must include Authorization
      const headers = { ...(cap.headers || {}) };
      if (!headers["authorization"]) {
        toast("Captured endpoint found but no Authorization header. Flip to 1 minute again, then click once more.");
        return;
      }
      headers["content-type"] = "application/json";

      // 3) Create the proto root from inline schema (no network)
      const root = protobuf.parse(INLINE_PROTO).root;
      const Type =
        root.lookupType("discord_users.v1.PreloadedUserSettings") ||
        root.lookupType("PreloadedUserSettings");

      // 4) GET current settings
      const resGet = await fetch(cap.url, { method: "GET", headers, credentials: "include" });
      if (!resGet.ok) throw new Error(`GET failed: ${resGet.status}`);
      const j = await resGet.json();
      if (!j || typeof j.settings !== "string") throw new Error("GET returned no settings blob");

      // 5) decode → patch afk_timeout only → encode
      const decoded = Type.decode(b64ToBuf(j.settings));
      const vav = decoded.voice_and_video || decoded.voiceAndVideo || (decoded.voice_and_video = {});
      const afk = vav.afk_timeout || vav.afkTimeout || (vav.afk_timeout = {});
      afk.value = 0; // Immediate
      const outB64 = bufToB64(Type.encode(decoded).finish());

      // 6) PATCH back
      const resPatch = await fetch(cap.url, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ settings: outB64 }),
        credentials: "include"
      });
      if (!resPatch.ok) throw new Error(`PATCH failed: ${resPatch.status}`);

      toast("Done! Timeout set to IMMEDIATE (all other settings preserved). Check: Settings → Notifications.");
    } catch (e) {
      console.error(e);
      toast("Failed: " + (e?.message || String(e)));
    }
  }

  // ---------- base64 helpers ----------
  function b64ToBuf(b64) {
    const len = protobuf.util.base64.length(b64);
    const arr = new Uint8Array(len);
    protobuf.util.base64.decode(b64, arr, 0);
    return arr;
  }
  function bufToB64(buf) {
    return protobuf.util.base64.encode(buf, 0, buf.length);
  }
})();