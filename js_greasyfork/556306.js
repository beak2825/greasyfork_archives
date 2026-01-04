// ==UserScript==
// @name         T3 Chat Zipper
// @namespace    t3.chat
// @version      6.3.1
// @description  Build ZIP from clipboard, last message, or last X messages
// @author       Microck
// @match        https://t3.chat/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556306/T3%20Chat%20Zipper.user.js
// @updateURL https://update.greasyfork.org/scripts/556306/T3%20Chat%20Zipper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SCRIPT = "[T3ZIP]";
  const VERSION = "6.3.1";

  const BTN_CLIPBOARD_ID = "t3zip-clipboard";
  const BTN_LASTMSG_ID = "t3zip-lastmsg";
  const BTN_LASTX_ID = "t3zip-lastx";

  // ---------- CONFIG & MENU ----------
  const DEBUG_KEY = "t3zip-debug";
  const SIDE_KEY = "t3zip-side";

  let DEBUG = GM_getValue(DEBUG_KEY, false);
  let BUTTON_SIDE = GM_getValue(SIDE_KEY, "right");

  function log(...args) {
    if (DEBUG) console.log(SCRIPT, ...args);
  }

  GM_registerMenuCommand("T3ZIP: Toggle debug logs", () => {
    DEBUG = !DEBUG;
    GM_setValue(DEBUG_KEY, DEBUG);
    alert(
      `Debug logs ${DEBUG ? "ENABLED" : "DISABLED"}.\nReload page to apply.`
    );
  });

  GM_registerMenuCommand("T3ZIP: Toggle button side (left/right)", () => {
    BUTTON_SIDE = BUTTON_SIDE === "right" ? "left" : "right";
    GM_setValue(SIDE_KEY, BUTTON_SIDE);
    alert(`Buttons will appear on the ${BUTTON_SIDE} after reload.`);
  });

  // ---------- STYLE ----------
  if (document.getElementById(BTN_CLIPBOARD_ID)) return;

  const sideRule = BUTTON_SIDE === "right" ? "right: 20px;" : "left: 270px;";

  const style = document.createElement("style");
  style.textContent = `
    .t3zip-btn {
      position: fixed;
      ${sideRule}
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      white-space: nowrap;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      height: 2.25rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: white;
      background-color: rgba(162, 59, 103, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.06);
      cursor: pointer;
      user-select: none;
      transition: all 150ms ease;
    }
    .t3zip-btn:hover { background-color: rgb(162,59,103); }
    .t3zip-btn:active { background-color: rgb(162,59,103); transform: translateY(1px); }
    .t3zip-btn:disabled { opacity: .55; cursor: not-allowed; }

    #${BTN_CLIPBOARD_ID} { bottom: 120px; }
    #${BTN_LASTMSG_ID} { bottom: 70px; }
    #${BTN_LASTX_ID} { bottom: 20px; }

    .t3zip-icon { position: relative; width: 1rem; height: 1rem; }
    .t3zip-default, .t3zip-success { position: absolute; inset: 0; transition: all 200ms ease; }
    .t3zip-btn[data-state="success"] .t3zip-default { transform: scale(0); opacity: 0; }
    .t3zip-btn[data-state="success"] .t3zip-success { transform: scale(1); opacity: 1; }
    .t3zip-success { transform: scale(0); opacity: 0; }
  `;
  document.head.appendChild(style);

  // ---------- SVG ICONS ----------
  const downloadIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>`;

  const clipboardIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10
      c1.1 0 2 .9 2 2"/>
    </svg>`;

  const checkIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>`;

  const layersIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polygon points="2 17 12 22 22 17"/>
      <polygon points="2 12 12 17 22 12"/>
    </svg>`;

  // ---------- Buttons ----------
  function createBtn(id, text, icon) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.className = "t3zip-btn";
    btn.innerHTML = `
      <div class="t3zip-icon">
        <div class="t3zip-default">${icon}</div>
        <div class="t3zip-success">${checkIcon}</div>
      </div>
      <span>${text}</span>
    `;
    document.body.appendChild(btn);
    return btn;
  }

  const clipboardBtn = createBtn(BTN_CLIPBOARD_ID, "ZIP from Clipboard", clipboardIcon);
  const lastMsgBtn = createBtn(BTN_LASTMSG_ID, "ZIP from Last Message", downloadIcon);
  const lastXBtn = createBtn(BTN_LASTX_ID, "ZIP from Last X Messages", layersIcon);

  // ---------- Helpers ----------
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function getMessageElements() {
    const container = document.querySelector('[role="log"][aria-label="Chat messages"]');
    return container
      ? Array.from(container.querySelectorAll("div.flex.justify-\\start, div.flex.justify-\\end"))
      : [];
  }

  async function exportMessageText(msgEl) {
    const copyBtn = msgEl.querySelector("svg.lucide-copy, svg.lucide-copy-icon");
    if (!copyBtn) return "";
    (copyBtn.closest("button") || copyBtn).click();
    await sleep(200);
    try {
      return await navigator.clipboard.readText();
    } catch {
      return "";
    }
  }

  async function getLastNMessagesText(N) {
    const msgs = getMessageElements().slice(-N);
    const parts = [];
    for (const m of msgs) {
      const t = await exportMessageText(m);
      if (t.trim()) parts.push(t.trim());
    }
    return parts.join("\n\n");
  }

  // ---------- CRC + Encode ----------
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c >>> 0;
    }
    return t;
  })();
  function crc32(b) {
    let c = -1;
    for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 255] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  }
  const enc = new TextEncoder();
  const utf8 = (s) => enc.encode(s);

  // ---------- ZIP builder ----------
  function buildZipBlob(files) {
    const locals = [];
    const centrals = [];
    let offset = 0;

    const prepped = files.map((f) => {
      const name = utf8(f.name);
      const data = utf8(f.content);
      const crc = crc32(data);
      return { name, data, crc, size: data.length, offset: 0 };
    });

    for (const f of prepped) {
      const h = new Uint8Array(30 + f.name.length);
      const v = new DataView(h.buffer);
      v.setUint32(0, 0x04034b50, true);
      v.setUint16(4, 20, true);
      v.setUint32(14, f.crc, true);
      v.setUint32(18, f.size, true);
      v.setUint32(22, f.size, true);
      v.setUint16(26, f.name.length, true);
      h.set(f.name, 30);
      f.offset = offset;
      offset += h.length + f.data.length;
      locals.push(h, f.data);
    }

    let cdSize = 0;
    for (const f of prepped) {
      const h = new Uint8Array(46 + f.name.length);
      const v = new DataView(h.buffer);
      v.setUint32(0, 0x02014b50, true);
      v.setUint16(4, 20, true);
      v.setUint16(6, 20, true);
      v.setUint32(16, f.crc, true);
      v.setUint32(20, f.size, true);
      v.setUint32(24, f.size, true);
      v.setUint16(28, f.name.length, true);
      v.setUint32(42, f.offset, true);
      h.set(f.name, 46);
      centrals.push(h);
      cdSize += h.length;
    }

    const end = new Uint8Array(22);
    const v = new DataView(end.buffer);
    v.setUint32(0, 0x06054b50, true);
    v.setUint16(8, prepped.length, true);
    v.setUint16(10, prepped.length, true);
    v.setUint32(12, cdSize, true);
    v.setUint32(16, offset, true);

    return new Blob([...locals, ...centrals, end], { type: "application/zip" });
  }

  // ---------- Download ----------
  function downloadBlob(name, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 3000);
  }

  async function runZipper(text, btn) {
    const label = btn.querySelector("span");
    const orig = label.textContent;
    const files = parseFiles(text);
    if (!files.length) return alert("No code fences found.");

    const blob = buildZipBlob(files);
    downloadBlob(`t3chat-${timestamp()}.zip`, blob);

    label.textContent = `Saved ${files.length} files`;
    btn.dataset.state = "success";
    setTimeout(() => ((btn.dataset.state = ""), (label.textContent = orig)), 1800);
  }

  // ---------- Buttons ----------
  clipboardBtn.onclick = async () => {
    clipboardBtn.disabled = true;
    try {
      let t = "";
      try {
        t = await navigator.clipboard.readText();
      } catch {
        t = prompt("Paste output here:") || "";
      }
      if (t.trim()) await runZipper(t, clipboardBtn);
    } finally {
      clipboardBtn.disabled = false;
    }
  };

  lastMsgBtn.onclick = async () => {
    lastMsgBtn.disabled = true;
    try {
      const t = await getLastNMessagesText(1);
      if (t.trim()) await runZipper(t, lastMsgBtn);
    } finally {
      lastMsgBtn.disabled = false;
    }
  };

  lastXBtn.onclick = async () => {
    lastXBtn.disabled = true;
    try {
      const N = parseInt(prompt("How many messages?", "3") || "3", 10);
      if (!N || N < 1) return;
      const t = await getLastNMessagesText(N);
      if (t.trim()) await runZipper(t, lastXBtn);
    } finally {
      lastXBtn.disabled = false;
    }
  };

  // ---------- Parsing ----------
  function parseFiles(text) {
    const out = [];
    const seen = new Map();
    const re1 =
      /(?:^|\n)\s*`?([\w.\-\/]+)`?\s*\n\s*```[^\n]*\n([\s\S]*?)```/g;
    const re2 =
      /```[^\n]*?\b(?:filename|file|path|name)\s*=\s*(\S+)[^\n]*\n([\s\S]*?)```/g;
    const push = (raw, c) => {
      let n = sanitize(raw);
      if (!n) return;
      if (seen.has(n)) {
        const i = seen.get(n) + 1;
        seen.set(n, i);
        const dot = n.lastIndexOf(".");
        n = dot > 0 ? `${n.slice(0, dot)}-${i}${n.slice(dot)}` : `${n}-${i}`;
      } else seen.set(n, 1);
      out.push({ name: n, content: c.trimEnd() });
    };
    let m;
    while ((m = re1.exec(text))) push(m[1], m[2]);
    while ((m = re2.exec(text))) push(m[1], m[2]);
    return out;
  }

  function sanitize(p) {
    return p
      .replace(/^[\/\\]+/, "")
      .replace(/\\/g, "/")
      .split("/")
      .filter((s) => s && s !== "." && s !== "..")
      .map((s) => s.replace(/[:"*?<>|]/g, "-"))
      .join("/");
  }

  function timestamp() {
    const d = new Date();
    const z = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}-${z(
      d.getHours()
    )}-${z(d.getMinutes())}`;
  }
})();