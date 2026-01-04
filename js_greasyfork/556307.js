// ==UserScript==
// @name         Kimi K2 Stealth (Violentmonkey) — Crosshair Capture, Clipboard
// @namespace    t3.kimi.smart.vm
// @version      1.4.0
// @description  Stealth context menu + hotkeys to send selected text, clipboard
//               text, clipboard image, right-clicked image, or crosshair A→B
//               capture to Moonshot Kimi K2 (vision for images). Auto-copies
//               outputs. No per-action prompts; uses saved defaults. Optional
//               toasts. Camouflaged UI. Alt+Right-click menu + Ctrl+Shift+M.
// @author       Microck
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @connect      api.moonshot.ai
// @connect      api-sg.moonshot.ai
// @connect      api.moonshot.cn
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556307/Kimi%20K2%20Stealth%20%28Violentmonkey%29%20%E2%80%94%20Crosshair%20Capture%2C%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/556307/Kimi%20K2%20Stealth%20%28Violentmonkey%29%20%E2%80%94%20Crosshair%20Capture%2C%20Clipboard.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // --------------------------------------------------------------------------
  // API notes
  // Assumes Kimi chat completions are OpenAI-compatible:
  // POST https://api.moonshot.ai/v1/chat/completions
  // Body: { model, messages[], temperature, stream:false }
  // Resp: { choices[0].message.content, usage, ... }
  // Vision uses OpenAI-style content blocks: [{type:"text"},{type:"image_url"}]
  // --------------------------------------------------------------------------

  const addStyle =
    typeof GM_addStyle === "function"
      ? GM_addStyle
      : (css) => {
          const s = document.createElement("style");
          s.textContent = css;
          document.head.appendChild(s);
        };

  const STORAGE = {
    apiKey: "t3_kimi_api_key",
    cfg: "t3_kimi_cfg",
    profile: "t3_kimi_profile",
    prompts: "t3_kimi_prompts",
    debug: "t3_kimi_debug",
  };

  const DEFAULT_CFG = {
    baseUrl: "https://api.moonshot.ai",
    endpointPath: "/v1/chat/completions",
    modelText: "kimi-k2-0905-preview",
    modelVision: "moonshot-v1-128k-vision-preview",
    temperature: 0.2,
    // UI
    menuTrigger: "altRightClick", // or "alwaysRightClick"
    toastsEnabled: true,
    // Image
    imgMaxDim: 1600,
    jpegQuality: 0.85,
    // Output
    autoClearMs: 10 * 60 * 1000,
    // Hotkeys
    hotkeys: {
      openMenu: "Ctrl+Shift+M",
      inputSelectedText: "Ctrl+Shift+T",
      inputClipboardText: "Ctrl+Shift+L",
      inputImage: "Ctrl+Shift+I",
      captureArea: "Ctrl+Shift+C",
      pasteOutputText: "Ctrl+Shift+P",
      copyOutputText: "Ctrl+Shift+Y",
      showOutputTooltip: "Ctrl+Shift+U",
    },
  };

  const DEFAULT_PROFILE = {
    language: "en-US", // "es-ES" | "en-US"
    mode: "technical", // "technical" | "student" | "singleAnswer" | "shortAnswer"
    outputFormat: "plain", // "plain" | "json"
    length: "medium", // "short" | "medium" | "long" | "extraLong"
    autoLangDetect: true,
    // Input text handling
    maxChars: 1600,
    trimInput: true,
  };

  const DEFAULT_PROMPTS = {
    inputSelectedText:
      "Focus only on relevant content. Ignore unrelated parts. Be concise.",
    inputClipboardText:
      "Use only what is necessary from the clipboard text. Be concise.",
    inputImage:
      "Answer the captured region and answer the task briefly and precisely. Be concise and exact.",
    captureArea:
      "Explain the captured region and answer the task briefly and precisely.",
  };

  const LENGTH_PRESETS = {
    short:
      "Respond in one single plain-line sentence (~20 words). No intro text.",
    medium:
      "Respond in one concise paragraph of ~3 lines. Plain text only. No intro.",
    long:
      "Respond in one compact paragraph of ~5 lines. Plain text only. No intro.",
    extraLong:
      "Respond in about 3 short paragraphs. Plain text only. No intro.",
  };

  let CFG = loadCfg();
  let PROFILE = loadProfile();
  let PROMPTS = loadPrompts();

  let menuEl, toastEl, tipEl, capEl;
  let contextTarget = null;
  let lastOutput = "";
  let lastMeta = "";
  let lastTimer = null;
  let lastMouse = { x: 100, y: 100 };

  // ------------------------------ Styles ------------------------------

  addStyle(`
    .t3km-ctx {
      position: fixed;
      z-index: 2147483647;
      background: #f8f8f8;
      color: #2a2a2a;
      border: 1px solid rgba(0,0,0,0.15);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font: 13px/1.25 -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
      min-width: 230px;
      padding: 4px 0;
      display: none;
      user-select: none;
    }
    .t3km-ctx .item {
      padding: 6px 12px;
      cursor: default;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .t3km-ctx .item:hover { background: #eaeaea; }
    .t3km-ctx .sep { height: 1px; margin: 4px 0; background: rgba(0,0,0,0.08); }
    .t3km-ctx .hint { color: #666; font-size: 11px; margin-left: 10px; }

    .t3km-toast {
      position: fixed;
      z-index: 2147483647;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      background: rgba(50,50,50,0.95);
      color: #fff;
      border-radius: 6px;
      padding: 8px 10px;
      font: 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: none;
      max-width: 70vw;
      word-break: break-word;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }

    .t3km-tip {
      position: fixed;
      z-index: 2147483647;
      right: 16px;
      bottom: 16px;
      width: 420px;
      max-width: calc(95vw - 20px);
      max-height: 60vh;
      overflow: auto;
      background: #fff;
      color: #222;
      border: 1px solid rgba(0,0,0,0.15);
      border-radius: 6px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.2);
      display: none;
      font: 13px/1.38 -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
    }
    .t3km-tip .hdr {
      display: flex; align-items: center; justify-content: space-between;
      padding: 6px 8px; border-bottom: 1px solid rgba(0,0,0,0.08);
      font-weight: 600;
    }
    .t3km-tip .hdr .meta { font-weight: 500; color: #666; font-size: 12px; }
    .t3km-tip .body { padding: 8px 10px; white-space: pre-wrap; word-wrap: break-word; }
    .t3km-tip .btn {
      background: #f1f1f1; color: #222; border: 1px solid rgba(0,0,0,0.1);
      border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;
      margin-left: 6px;
    }
    .t3km-tip .btn:hover { background: #e8e8e8; }

    /* Crosshair capture overlay (no UI, just video + rectangle) */
    .t3km-cap {
      position: fixed; z-index: 2147483646; inset: 0; display: none;
      background: transparent; cursor: crosshair;
    }
    .t3km-cap video {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: contain; background: #000; opacity: 0.9;
    }
    .t3km-cap canvas { position: absolute; inset: 0; pointer-events: none; }
  `);

  // ------------------------------ Elements ------------------------------

  menuEl = document.createElement("div");
  menuEl.className = "t3km-ctx";
  menuEl.innerHTML = `
    <div class="item" data-action="inputSelectedText">
      Input selected text <span class="hint">${hk("inputSelectedText")}</span>
    </div>
    <div class="item" data-action="inputClipboardText">
      Input clipboard text <span class="hint">${hk("inputClipboardText")}</span>
    </div>
    <div class="item" data-action="inputImage">
      Input image (clipboard/hovered) <span class="hint">${hk("inputImage")}</span>
    </div>
    <div class="item" data-action="captureArea">
      Capture area (A→B) <span class="hint">${hk("captureArea")}</span>
    </div>
    <div class="sep"></div>
    <div class="item" data-action="pasteOutputText">
      Paste output text <span class="hint">${hk("pasteOutputText")}</span>
    </div>
    <div class="item" data-action="copyOutputText">
      Copy output <span class="hint">${hk("copyOutputText")}</span>
    </div>
    <div class="item" data-action="showOutputTooltip">
      Show output (tooltip) <span class="hint">${hk("showOutputTooltip")}</span>
    </div>
    <div class="sep"></div>
    <div class="item" data-action="settings">Settings...</div>
  `;
  document.documentElement.appendChild(menuEl);

  toastEl = document.createElement("div");
  toastEl.className = "t3km-toast";
  document.documentElement.appendChild(toastEl);

  tipEl = document.createElement("div");
  tipEl.className = "t3km-tip";
  tipEl.innerHTML = `
    <div class="hdr">
      <div>Kimi Output</div>
      <div>
        <span class="meta"></span>
        <button class="btn copy">Copy</button>
        <button class="btn close">Close</button>
      </div>
    </div>
    <div class="body"></div>
  `;
  document.documentElement.appendChild(tipEl);

  capEl = document.createElement("div");
  capEl.className = "t3km-cap";
  capEl.innerHTML = `
    <video playsinline></video>
    <canvas></canvas>
  `;
  document.documentElement.appendChild(capEl);

  tipEl.querySelector(".close").addEventListener("click", () => {
    tipEl.style.display = "none";
  });
  tipEl.querySelector(".copy").addEventListener("click", () => {
    if (!lastOutput) return;
    copyToClipboard(lastOutput);
    toast("Copied.");
  });

  // ------------------------------ Utils ------------------------------

  function hk(k) {
    return CFG.hotkeys[k] || "";
  }

  function loadCfg() {
    const raw = GM_getValue(STORAGE.cfg, null);
    if (!raw) return { ...DEFAULT_CFG };
    try {
      return { ...DEFAULT_CFG, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_CFG };
    }
  }
  function saveCfg() {
    GM_setValue(STORAGE.cfg, JSON.stringify(CFG));
  }

  function loadProfile() {
    const raw = GM_getValue(STORAGE.profile, null);
    if (!raw) return { ...DEFAULT_PROFILE };
    try {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  }
  function saveProfile() {
    GM_setValue(STORAGE.profile, JSON.stringify(PROFILE));
  }

  function loadPrompts() {
    const raw = GM_getValue(STORAGE.prompts, null);
    if (!raw) return { ...DEFAULT_PROMPTS };
    try {
      return { ...DEFAULT_PROMPTS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_PROMPTS };
    }
  }
  function savePrompts() {
    GM_setValue(STORAGE.prompts, JSON.stringify(PROMPTS));
  }

  function debugOn() {
    return !!GM_getValue(STORAGE.debug, false);
  }
  function log(...args) {
    if (debugOn()) console.log("[KimiVM]", ...args);
  }

  function toast(msg, ms = 1600) {
    if (!CFG.toastsEnabled) return;
    toastEl.textContent = msg;
    toastEl.style.display = "block";
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => {
      toastEl.style.display = "none";
    }, ms);
  }

  function getSelectionText() {
    const sel = window.getSelection();
    return sel ? sel.toString() : "";
  }

  function normalizeInput(str, cap, doTrim) {
    let s = String(str || "");
    if (doTrim) s = s.replace(/\s+/g, " ").trim();
    if (cap && s.length > cap) s = s.slice(0, cap);
    return s;
  }

  function isHotkey(e, combo) {
    if (!combo) return false;
    const parts = combo.toLowerCase().split("+").map((x) => x.trim());
    const need = {
      alt: parts.includes("alt"),
      shift: parts.includes("shift"),
      ctrl: parts.includes("ctrl") || parts.includes("control"),
      meta: parts.includes("meta") || parts.includes("cmd"),
    };
    const main = parts.find(
      (k) =>
        !["alt", "shift", "ctrl", "control", "meta", "cmd"].includes(k)
    );
    const key = e.key.toLowerCase();
    if (!!e.altKey !== need.alt) return false;
    if (!!e.shiftKey !== need.shift) return false;
    if (!!e.ctrlKey !== need.ctrl) return false;
    if (!!e.metaKey !== need.meta) return false;
    return !main || key === main;
  }

  function activeTextTarget() {
    const el = document.activeElement;
    if (!el) return null;
    const tag = (el.tagName || "").toLowerCase();
    if (
      tag === "textarea" ||
      (tag === "input" && /^(text|search|url|email|tel)$/i.test(el.type))
    ) {
      return el;
    }
    if (el.isContentEditable) return el;
    return null;
  }

  function insertAtCaret(text) {
    const el = activeTextTarget();
    if (!el) return false;
    if (el.isContentEditable) {
      try {
        document.execCommand("insertText", false, text);
        return true;
      } catch {}
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return false;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      return true;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    el.value = before + text + after;
    const pos = start + text.length;
    el.selectionStart = el.selectionEnd = pos;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }

  async function copyToClipboard(text) {
    try {
      GM_setClipboard(text);
      return true;
    } catch {}
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}
    try {
      const tmp = document.createElement("textarea");
      tmp.value = text;
      tmp.style.position = "fixed";
      tmp.style.opacity = "0";
      document.body.appendChild(tmp);
      tmp.focus();
      tmp.select();
      const ok = document.execCommand("copy");
      tmp.remove();
      return ok;
    } catch {
      return false;
    }
  }

  function scheduleAutoClear() {
    if (!CFG.autoClearMs) return;
    if (lastTimer) window.clearTimeout(lastTimer);
    lastTimer = window.setTimeout(() => {
      lastOutput = "";
      lastMeta = "";
      log("Auto-cleared cached output");
    }, CFG.autoClearMs);
  }

  // ------------------------------ Language ------------------------------

  function detectLanguage(sample) {
    if (!PROFILE.autoLangDetect) return PROFILE.language;
    const s = (sample || "").slice(0, 800).toLowerCase();
    let es = 0;
    [" el ", " la ", " los ", " las ", " un ", " una ", " es ", " para ", " con ",
     " que ", " de ", " por ", " en ", " y ", " o ", "¿", "¡", "ción", "sión",
     "ñ", "á", "é", "í", "ó", "ú"].forEach((h) => s.includes(h) && es++);
    let en = 0;
    [" the ", " and ", " or ", " with ", " for ", " of ", " to ", " in ", " on ",
     " is ", " are ", " can ", " will "].forEach((h) => s.includes(h) && en++);
    if (es > en + 1) return "es-ES";
    if (en > es + 1) return "en-US";
    return PROFILE.language;
  }

  // ------------------------------ Prompt Engine ------------------------------

  function buildSystemPrompt(lang, mode) {
    const fmt =
      mode === "singleAnswer" || mode === "shortAnswer"
        ? "json"
        : PROFILE.outputFormat || "plain";
    const lengthRule =
      mode === "singleAnswer" || mode === "shortAnswer"
        ? "Ignore length; answer must be minimal."
        : LENGTH_PRESETS[PROFILE.length] || LENGTH_PRESETS.medium;

    const langLine = lang === "es-ES" ? "Language: Español (España)." : "Language: English.";

    let modeLine = "";
    if (mode === "technical") {
      modeLine =
        lang === "es-ES"
          ? "Modo: técnico, preciso y conciso."
          : "Mode: technical, precise, and concise.";
    } else if (mode === "student") {
      modeLine =
        lang === "es-ES"
          ? "Modo: estudiante (grado medio de informática). Lenguaje sencillo, claro y natural."
          : "Mode: student (mid-level IT). Simple, clear, natural language.";
    } else if (mode === "singleAnswer") {
      modeLine =
        lang === "es-ES"
          ? "Modo: respuesta única (una letra o palabra)."
          : "Mode: single answer (one letter or one word).";
    } else if (mode === "shortAnswer") {
      modeLine =
        lang === "es-ES"
          ? "Modo: respuesta corta (pocas palabras)."
          : "Mode: short answer (few words).";
    }

    const fmtLine =
      fmt === "json"
        ? "Output format: JSON only. No code fences, no markdown, no extra keys."
        : "Output format: plain text only. No markdown, no lists, no intro text.";

    const behavior =
      lang === "es-ES"
        ? [
            "Responde solo con el contenido solicitado, sin saludos ni frases de relleno.",
            "No uses formato markdown, emojis, negritas o cursivas.",
            "Mantén el espaciado normal y sin líneas extra.",
          ].join("\n")
        : [
            "Respond only with the requested content; no greetings or filler phrases.",
            "Do not use markdown, emojis, bold or italics.",
            "Keep normal spacing with no extra blank lines.",
          ].join("\n");

    const jsonRule =
      (mode === "singleAnswer" || mode === "shortAnswer") && fmt === "json"
        ? lang === "es-ES"
          ? 'Devuelve únicamente: {"answer":"..."} sin claves adicionales.'
          : 'Return only: {"answer":"..."} with no additional keys.'
        : "";

    return [
      "You are Kimi, an AI assistant by Moonshot AI.",
      langLine,
      modeLine,
      fmtLine,
      "Length target: " + lengthRule,
      "Behavior rules:",
      behavior,
      jsonRule,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function buildUserForText(directive, text, lang) {
    const label =
      lang === "es-ES"
        ? "Texto (entre triple comillas)."
        : "Text (between triple quotes).";
    const replyLine = lang === "es-ES" ? "Responde de forma concisa." : "Reply concisely.";
    const head = directive ? (lang === "es-ES" ? `Directiva: ${directive}\n` : `Directive: ${directive}\n`) : "";
    return head + `${label}\n"""${text}"""\n` + replyLine;
  }

  function buildUserForImage(directive, lang) {
    const text =
      directive ||
      (lang === "es-ES"
        ? "Describe o responde sobre la imagen con precisión y brevedad."
        : "Describe or answer about the image precisely and briefly.");
    return { type: "text", text };
  }

  function stripMarkdownAndFiller(s) {
    let out = String(s || "");
    out = out.replace(/^\s*```[\s\S]*?```/g, "").trim();
    out = out.replace(/^\s*[*_#>\-]+/gm, "").trim();
    const heads = [
      /^answer\s*[:\-]\s*/i,
      /^respuesta\s*[:\-]\s*/i,
      /^(here(?:’|')?s|here is)\s+(the\s+)?(answer|result|summary)\s*[:\-]?\s*/i,
      /^(la|una)\s+respuesta\s*[:\-]?\s*/i,
      /^(resultado|resumen)\s*[:\-]?\s*/i,
    ];
    for (const re of heads) out = out.replace(re, "");
    out = out.replace(/[ \t]+/g, " ");
    out = out.replace(/\n{3,}/g, "\n\n").trim();
    if (!out.includes("\n")) {
      out = out.replace(/([^\w)])\s*$/, (m, g1) => (/[.?!,:;)]/.test(g1) ? "" : g1));
    }
    return out.trim();
  }

  function extractJsonAnswer(raw) {
    if (!raw) return null;
    let s = String(raw).trim();
    s = s.replace(/^```json\s*|^```\s*|```$/gim, "").trim();
    try {
      const obj = JSON.parse(s);
      if (obj && typeof obj.answer !== "undefined") return obj;
    } catch {}
    if (/^answer\s*[:\-]\s*/i.test(s)) {
      const ans = s.replace(/^answer\s*[:\-]\s*/i, "").trim();
      return { answer: ans };
    }
    return null;
  }

  function postProcess(text, lang, mode, fmt) {
    let out = String(text || "");
    if (mode === "singleAnswer" || mode === "shortAnswer") {
      const obj = extractJsonAnswer(out);
      if (obj && typeof obj.answer !== "undefined") return String(obj.answer || "").trim();
      return stripMarkdownAndFiller(out);
    }
    if (fmt === "json") {
      const obj = extractJsonAnswer(out);
      if (obj && typeof obj.answer !== "undefined") return String(obj.answer || "").trim();
    }
    out = stripMarkdownAndFiller(out);
    if (PROFILE.length === "short") {
      out = out.replace(/\s*\n\s*/g, " ").trim();
    }
    return out;
  }

  // ------------------------------ API ------------------------------

  async function callKimi(messages, model) {
    const apiKey = GM_getValue(STORAGE.apiKey, "");
    if (!apiKey) {
      toast("Set Kimi API key in VM menu.");
      throw new Error("Missing API key");
    }
    const url = new URL(CFG.endpointPath, CFG.baseUrl).toString();

    log("POST", url, { model, count: messages?.length });

    const r = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        data: JSON.stringify({
          model,
          messages,
          temperature: CFG.temperature,
          stream: false,
        }),
        responseType: "json",
        onload: (res) => resolve(res),
        onerror: (e) => reject(e),
      });
    });

    if (r.status < 200 || r.status >= 300) {
      throw new Error("Kimi API error: " + r.status + " " + (r.responseText || ""));
    }

    const data = r.response || tryParse(r.responseText);
    const text =
      data?.choices?.[0]?.message?.content ||
      data?.output_text ||
      data?.text ||
      "";
    return { text: String(text || "").trim(), raw: data, usage: data?.usage || null };
  }

  function tryParse(t) {
    try {
      return JSON.parse(t);
    } catch {
      return null;
    }
  }

  function metaFrom(raw, usage, extra) {
    try {
      const finish = raw?.choices?.[0]?.finish_reason || "";
      const u = usage
        ? `tok p${usage.prompt_tokens || 0}/c${usage.completion_tokens || 0}/t${usage.total_tokens || 0}`
        : "";
      const add = extra ? `, ${extra}` : "";
      return `${finish}${add} ${u}`.trim();
    } catch {
      return extra || "";
    }
  }

  // ------------------------------ Clipboard helpers ------------------------------

  async function readClipboardText() {
    if (navigator.clipboard?.readText) {
      try {
        const t = await navigator.clipboard.readText();
        if (t && t.trim()) return t;
      } catch {}
    }
    return null;
  }

  async function readClipboardImageDataUrl() {
    if (navigator.clipboard?.read) {
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const type = item.types.find((t) => t.startsWith("image/"));
          if (type) {
            const blob = await item.getType(type);
            const url = await blobToDataURL(blob);
            return url;
          }
        }
      } catch {}
    }
    return null;
  }

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result || ""));
      fr.onerror = (e) => reject(e);
      fr.readAsDataURL(blob);
    });
  }

  function toBase64FromArrayBuffer(buf) {
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function fetchImageAsBase64(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "arraybuffer",
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(toBase64FromArrayBuffer(res.response));
          } else {
            reject(new Error("Image fetch failed: " + res.status + " " + res.statusText));
          }
        },
        onerror: (e) => reject(e),
      });
    });
  }

  async function downscaleDataUrl(dataUrl, maxDim, quality) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        if (w <= maxDim && h <= maxDim) return resolve(dataUrl);
        const s = Math.min(maxDim / w, maxDim / h);
        const nw = Math.max(1, Math.round(w * s));
        const nh = Math.max(1, Math.round(h * s));
        const c = document.createElement("canvas");
        c.width = nw;
        c.height = nh;
        c.getContext("2d").drawImage(img, 0, 0, nw, nh);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // ------------------------------ Actions ------------------------------

  async function doInputSelectedText() {
    let text = getSelectionText();
    if (!text) {
      // fallback to clipboard text if selection is empty
      text = await readClipboardText();
      if (!text) {
        toast("No selection or clipboard text.");
        return;
      }
    }
    const lang = detectLanguage(text);
    const sys = buildSystemPrompt(lang, PROFILE.mode);
    const user = buildUserForText(
      PROMPTS.inputSelectedText,
      normalizeInput(text, PROFILE.maxChars, PROFILE.trimInput),
      lang
    );
    const messages = [
      { role: "system", content: sys },
      { role: "user", content: user },
    ];

    try {
      const { text: out, raw, usage } = await callKimi(messages, CFG.modelText);
      const fmtUsed =
        PROFILE.mode === "singleAnswer" || PROFILE.mode === "shortAnswer"
          ? "json"
          : PROFILE.outputFormat;
      const clean = postProcess(out, lang, PROFILE.mode, fmtUsed);
      lastOutput = clean;
      lastMeta = `${CFG.modelText}, ${metaFrom(raw, usage, lang)}`;
      await copyToClipboard(lastOutput);
      toast("Copied.");
      scheduleAutoClear();
    } catch (e) {
      toast("Error: " + (e.message || e));
    }
  }

  async function doInputClipboardText() {
    const clip = await readClipboardText();
    if (!clip) {
      toast("No clipboard text.");
      return;
    }
    const lang = detectLanguage(clip);
    const sys = buildSystemPrompt(lang, PROFILE.mode);
    const user = buildUserForText(
      PROMPTS.inputClipboardText,
      normalizeInput(clip, PROFILE.maxChars, PROFILE.trimInput),
      lang
    );
    const messages = [
      { role: "system", content: sys },
      { role: "user", content: user },
    ];
    try {
      const { text: out, raw, usage } = await callKimi(messages, CFG.modelText);
      const fmtUsed =
        PROFILE.mode === "singleAnswer" || PROFILE.mode === "shortAnswer"
          ? "json"
          : PROFILE.outputFormat;
      const clean = postProcess(out, lang, PROFILE.mode, fmtUsed);
      lastOutput = clean;
      lastMeta = `${CFG.modelText}, ${metaFrom(raw, usage, lang)}`;
      await copyToClipboard(lastOutput);
      toast("Copied.");
      scheduleAutoClear();
    } catch (e) {
      toast("Error: " + (e.message || e));
    }
  }

  async function doInputImage() {
    // Priority: clipboard image → right-clicked <img>
    let dataUrl = await readClipboardImageDataUrl();
    let source = "clipboard";
    if (!dataUrl && contextTarget && contextTarget.tagName === "IMG" && contextTarget.src) {
      try {
        const b64 = await fetchImageAsBase64(contextTarget.src);
        dataUrl = `data:image/*;base64,${b64}`;
        source = "img";
      } catch {}
    }
    if (!dataUrl) {
      toast("No clipboard or hovered image.");
      return;
    }

    dataUrl = await downscaleDataUrl(dataUrl, CFG.imgMaxDim, CFG.jpegQuality);
    const lang = PROFILE.language;
    const sys = buildSystemPrompt(lang, PROFILE.mode);
    const textPart = buildUserForImage(PROMPTS.inputImage, lang);
    const messages = [
      { role: "system", content: sys },
      { role: "user", content: [textPart, { type: "image_url", image_url: dataUrl }] },
    ];

    try {
      const { text: out, raw, usage } = await callKimi(messages, CFG.modelVision);
      const fmtUsed =
        PROFILE.mode === "singleAnswer" || PROFILE.mode === "shortAnswer"
          ? "json"
          : PROFILE.outputFormat;
      const clean = postProcess(out, lang, PROFILE.mode, fmtUsed);
      lastOutput = clean;
      lastMeta = `${CFG.modelVision}, ${metaFrom(raw, usage, source)}`;
      await copyToClipboard(lastOutput);
      toast("Copied.");
      scheduleAutoClear();
    } catch (e) {
      toast("Error: " + (e.message || e));
    }
  }

  async function doCaptureArea() {
    // Two-click crosshair overlay; requires screen picker (cannot bypass)
    let stream;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    } catch {
      toast("Screen capture denied.");
      return;
    }
    const video = capEl.querySelector("video");
    const canvas = capEl.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    video.srcObject = stream;
    await video.play();

    capEl.style.display = "block";
    resizeCanvasToOverlay();

    let a = null;
    let b = null;
    const onClick = (e) => {
      const r = capEl.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (!a) {
        a = { x, y };
      } else {
        b = { x, y };
        window.removeEventListener("click", onClick, true);
        window.removeEventListener("keydown", onKey, true);
        finish();
      }
      drawRect(a, b);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        cleanup();
      }
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", resizeCanvasToOverlay);

    function resizeCanvasToOverlay() {
      const r = capEl.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      drawRect(a, b);
    }

    function drawRect(p1, p2) {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!p1) return;
      const x1 = p1.x * dpr;
      const y1 = p1.y * dpr;
      const x2 = (p2 ? p2.x : p1.x) * dpr;
      const y2 = (p2 ? p2.y : p1.y) * dpr;
      const x = Math.min(x1, x2);
      const y = Math.min(y1, y2);
      const w = Math.abs(x2 - x1);
      const h = Math.abs(y2 - y1);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 2 * dpr;
      ctx.strokeRect(x + 1 * dpr, y + 1 * dpr, Math.max(1, w - 2 * dpr), Math.max(1, h - 2 * dpr));
    }

    async function finish() {
      if (!a || !b) return cleanup();
      const vRect = mapSelectionToVideo(a, b);
      if (!vRect) {
        toast("Selection invalid.");
        return cleanup();
      }

      // Capture current frame
      const full = document.createElement("canvas");
      full.width = video.videoWidth;
      full.height = video.videoHeight;
      full.getContext("2d").drawImage(video, 0, 0, full.width, full.height);

      // Crop
      const crop = document.createElement("canvas");
      crop.width = vRect.w;
      crop.height = vRect.h;
      crop.getContext("2d").drawImage(
        full,
        vRect.x,
        vRect.y,
        vRect.w,
        vRect.h,
        0,
        0,
        vRect.w,
        vRect.h
      );

      // Downscale
      let dataUrl;
      if (Math.max(vRect.w, vRect.h) <= CFG.imgMaxDim) {
        dataUrl = crop.toDataURL("image/jpeg", CFG.jpegQuality);
      } else {
        const s = CFG.imgMaxDim / Math.max(vRect.w, vRect.h);
        const nw = Math.max(1, Math.round(vRect.w * s));
        const nh = Math.max(1, Math.round(vRect.h * s));
        const small = document.createElement("canvas");
        small.width = nw;
        small.height = nh;
        small.getContext("2d").drawImage(crop, 0, 0, nw, nh);
        dataUrl = small.toDataURL("image/jpeg", CFG.jpegQuality);
      }

      cleanup();

      // Send to vision
      const lang = PROFILE.language;
      const sys = buildSystemPrompt(lang, PROFILE.mode);
      const textPart = buildUserForImage(PROMPTS.captureArea, lang);
      const messages = [
        { role: "system", content: sys },
        { role: "user", content: [textPart, { type: "image_url", image_url: dataUrl }] },
      ];
      try {
        const { text: out, raw, usage } = await callKimi(messages, CFG.modelVision);
        const fmtUsed =
          PROFILE.mode === "singleAnswer" || PROFILE.mode === "shortAnswer"
            ? "json"
            : PROFILE.outputFormat;
        const clean = postProcess(out, lang, PROFILE.mode, fmtUsed);
        lastOutput = clean;
        lastMeta = `${CFG.modelVision}, ${metaFrom(raw, usage, "capture")}`;
        await copyToClipboard(lastOutput);
        toast("Copied.");
        scheduleAutoClear();
      } catch (e) {
        toast("Error: " + (e.message || e));
      }
    }

    function mapSelectionToVideo(p1, p2) {
      // Map overlay clicks to video pixel rect considering letterboxing
      const over = capEl.getBoundingClientRect();
      const vw = video.videoWidth || 0;
      const vh = video.videoHeight || 0;
      if (!vw || !vh) return null;
      const scale = Math.min(over.width / vw, over.height / vh);
      const dispW = vw * scale;
      const dispH = vh * scale;
      const dx = (over.width - dispW) / 2;
      const dy = (over.height - dispH) / 2;

      const x1 = clamp(p1.x - dx, 0, dispW);
      const y1 = clamp(p1.y - dy, 0, dispH);
      const x2 = clamp(p2.x - dx, 0, dispW);
      const y2 = clamp(p2.y - dy, 0, dispH);

      const rx1 = Math.min(x1, x2) / dispW;
      const ry1 = Math.min(y1, y2) / dispH;
      const rx2 = Math.max(x1, x2) / dispW;
      const ry2 = Math.max(y1, y2) / dispH;

      const px = Math.round(rx1 * vw);
      const py = Math.round(ry1 * vh);
      const pw = Math.max(1, Math.round((rx2 - rx1) * vw));
      const ph = Math.max(1, Math.round((ry2 - ry1) * vh));
      if (pw < 3 || ph < 3) return null;
      return { x: px, y: py, w: pw, h: ph };
    }

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    function cleanup() {
      try {
        window.removeEventListener("click", onClick, true);
        window.removeEventListener("keydown", onKey, true);
        window.removeEventListener("resize", resizeCanvasToOverlay);
      } catch {}
      try {
        const tracks = stream.getTracks();
        tracks.forEach((t) => t.stop());
      } catch {}
      capEl.style.display = "none";
      video.srcObject = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  async function doPasteOutputText() {
    if (!lastOutput) {
      toast("No output yet.");
      return;
    }
    const ok = insertAtCaret(lastOutput);
    toast(ok ? "Pasted." : "Copied.");
    if (!ok) await copyToClipboard(lastOutput);
  }

  function doCopyOutputText() {
    if (!lastOutput) {
      toast("No output yet.");
      return;
    }
    copyToClipboard(lastOutput);
    toast("Copied.");
  }

  function doShowOutputTooltip() {
    if (!lastOutput) {
      toast("No output yet.");
      return;
    }
    tipEl.querySelector(".body").textContent = lastOutput;
    tipEl.querySelector(".meta").textContent = lastMeta;
    tipEl.style.display = "block";
  }

  // ------------------------------ Event wiring ------------------------------

  document.addEventListener(
    "contextmenu",
    (e) => {
      contextTarget = e.target;
      const ok =
        CFG.menuTrigger === "alwaysRightClick" ||
        (CFG.menuTrigger === "altRightClick" && e.altKey);
      if (!ok) return;
      e.preventDefault();
      hideMenu();
      showMenuAt(e.clientX, e.clientY);
    },
    true
  );

  document.addEventListener(
    "mousemove",
    (e) => {
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
    },
    true
  );

  document.addEventListener(
    "click",
    (e) => {
      const el = e.target;
      if (el && el.closest && el.closest(".t3km-ctx")) {
        const action = el.closest(".item")?.getAttribute("data-action");
        hideMenu();
        if (action) routeAction(action);
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (menuEl.style.display === "block") hideMenu();
    },
    true
  );

  window.addEventListener(
    "keydown",
    (e) => {
      try {
        if (isHotkey(e, CFG.hotkeys.openMenu)) {
          e.preventDefault();
          showMenuAt(lastMouse.x, lastMouse.y);
          return;
        }
        if (e.key === "Escape") {
          hideMenu();
        }
        if (isHotkey(e, CFG.hotkeys.inputSelectedText)) {
          e.preventDefault();
          doInputSelectedText();
        } else if (isHotkey(e, CFG.hotkeys.inputClipboardText)) {
          e.preventDefault();
          doInputClipboardText();
        } else if (isHotkey(e, CFG.hotkeys.inputImage)) {
          e.preventDefault();
          doInputImage();
        } else if (isHotkey(e, CFG.hotkeys.captureArea)) {
          e.preventDefault();
          doCaptureArea();
        } else if (isHotkey(e, CFG.hotkeys.pasteOutputText)) {
          e.preventDefault();
          doPasteOutputText();
        } else if (isHotkey(e, CFG.hotkeys.copyOutputText)) {
          e.preventDefault();
          doCopyOutputText();
        } else if (isHotkey(e, CFG.hotkeys.showOutputTooltip)) {
          e.preventDefault();
          doShowOutputTooltip();
        }
      } catch {}
    },
    true
  );

  function showMenuAt(x, y) {
    menuEl.style.left = x + "px";
    menuEl.style.top = y + "px";
    menuEl.style.display = "block";
  }
  function hideMenu() {
    menuEl.style.display = "none";
  }
  menuEl.addEventListener("contextmenu", (e) => e.preventDefault());

  function routeAction(a) {
    if (a === "inputSelectedText") doInputSelectedText();
    else if (a === "inputClipboardText") doInputClipboardText();
    else if (a === "inputImage") doInputImage();
    else if (a === "captureArea") doCaptureArea();
    else if (a === "pasteOutputText") doPasteOutputText();
    else if (a === "copyOutputText") doCopyOutputText();
    else if (a === "showOutputTooltip") doShowOutputTooltip();
    else if (a === "settings") openSettings();
  }

  // ------------------------------ Menu commands ------------------------------

  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("Set Kimi API Key", () => {
      const cur = GM_getValue(STORAGE.apiKey, "");
      const v = window.prompt("Enter Kimi API key:", cur);
      if (v != null) {
        GM_setValue(STORAGE.apiKey, v.trim());
        toast("API key saved.");
      }
    });

    GM_registerMenuCommand("Toggle toasts", () => {
      CFG.toastsEnabled = !CFG.toastsEnabled;
      saveCfg();
      if (CFG.toastsEnabled) toast("Toasts ON");
    });

    GM_registerMenuCommand("Toggle Language (ES/EN)", () => {
      PROFILE.language = PROFILE.language === "es-ES" ? "en-US" : "es-ES";
      saveProfile();
      toast("Language: " + PROFILE.language);
    });

    GM_registerMenuCommand("Cycle Mode (technical/student/single/short)", () => {
      const order = ["technical", "student", "singleAnswer", "shortAnswer"];
      const i = order.indexOf(PROFILE.mode);
      PROFILE.mode = order[(i + 1) % order.length];
      PROFILE.outputFormat =
        PROFILE.mode === "singleAnswer" || PROFILE.mode === "shortAnswer"
          ? "json"
          : "plain";
      saveProfile();
      toast("Mode: " + PROFILE.mode);
    });

    GM_registerMenuCommand("Select Output Length", () => {
      const pick = window.prompt(
        "Length: short | medium | long | extraLong",
        PROFILE.length
      );
      if (!pick) return;
      if (!["short", "medium", "long", "extraLong"].includes(pick)) {
        toast("Invalid length.");
        return;
      }
      PROFILE.length = pick;
      saveProfile();
      toast("Length: " + PROFILE.length);
    });

    GM_registerMenuCommand("Edit default prompts", () => {
      const a = window.prompt(
        "Default for Selected text:",
        PROMPTS.inputSelectedText
      );
      if (a == null) return;
      const b = window.prompt(
        "Default for Clipboard text:",
        PROMPTS.inputClipboardText
      );
      if (b == null) return;
      const c = window.prompt("Default for Input image:", PROMPTS.inputImage);
      if (c == null) return;
      const d = window.prompt("Default for Capture area:", PROMPTS.captureArea);
      if (d == null) return;
      PROMPTS.inputSelectedText = a.trim();
      PROMPTS.inputClipboardText = b.trim();
      PROMPTS.inputImage = c.trim();
      PROMPTS.captureArea = d.trim();
      savePrompts();
      toast("Prompts saved.");
    });

    GM_registerMenuCommand("Set hotkeys", () => {
      const hk = { ...CFG.hotkeys };
      const s0 = window.prompt("Open menu hotkey", hk.openMenu);
      if (s0 == null) return;
      const s1 = window.prompt("Selected text", hk.inputSelectedText);
      if (s1 == null) return;
      const s2 = window.prompt("Clipboard text", hk.inputClipboardText);
      if (s2 == null) return;
      const s3 = window.prompt("Input image", hk.inputImage);
      if (s3 == null) return;
      const s4 = window.prompt("Capture area", hk.captureArea);
      if (s4 == null) return;
      const s5 = window.prompt("Paste output", hk.pasteOutputText);
      if (s5 == null) return;
      const s6 = window.prompt("Copy output", hk.copyOutputText);
      if (s6 == null) return;
      const s7 = window.prompt("Show tooltip", hk.showOutputTooltip);
      if (s7 == null) return;
      CFG.hotkeys.openMenu = s0.trim();
      CFG.hotkeys.inputSelectedText = s1.trim();
      CFG.hotkeys.inputClipboardText = s2.trim();
      CFG.hotkeys.inputImage = s3.trim();
      CFG.hotkeys.captureArea = s4.trim();
      CFG.hotkeys.pasteOutputText = s5.trim();
      CFG.hotkeys.copyOutputText = s6.trim();
      CFG.hotkeys.showOutputTooltip = s7.trim();
      saveCfg();
      toast("Hotkeys saved.");
    });

    GM_registerMenuCommand("Toggle Alt+Right-click activation", () => {
      CFG.menuTrigger =
        CFG.menuTrigger === "altRightClick" ? "alwaysRightClick" : "altRightClick";
      saveCfg();
      toast(
        CFG.menuTrigger === "altRightClick"
          ? "Menu requires Alt+Right-click"
          : "Menu on Right-click"
      );
    });

    GM_registerMenuCommand("Toggle debug logs", () => {
      const cur = !!GM_getValue(STORAGE.debug, false);
      GM_setValue(STORAGE.debug, !cur);
      toast("Debug " + (!cur ? "ON" : "OFF"));
    });
  }

  function openSettings() {
    // Minimal: just show quick tips via toast or rely on VM menu commands.
    toast("Use Violentmonkey menu for settings.");
  }

  // ------------------------------ Init ------------------------------

  function initUI() {
    // nothing else
  }
  initUI();

  log("Kimi VM ready.", { hotkeys: CFG.hotkeys, lang: PROFILE.language, mode: PROFILE.mode });

  // End IIFE

})();
