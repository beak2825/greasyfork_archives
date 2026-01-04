// ==UserScript==
// @name         Obsidian Media Vault
// @description  Adds Copy, Save, and Quote modals to YouTube for clean transcript export, Obsidian-friendly Markdown, and timestamped quotes. Focused on structured text workflows, offline use, and predictable UI without automation or clutter.
// @namespace    local.yt.obsidian.media.vault
// @version      10.5.13
// @author       cleancoder https://greasyfork.org/en/users/1555211-cleancoder
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/live/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561149/Obsidian%20Media%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/561149/Obsidian%20Media%20Vault.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // =========================
  // Global Switches
  // =========================

  // Alternate downloader sites: Choose according to preferred by swapping the URl below.
  // Try from this list, or add your own: "youtubepi.com", "9xyoutube.com", "ssyoutube.com", "www.pwnyoutube.com", "www.youpak.com"
  const SAVE_DOWNLOAD_HOST = "9xyoutube.com";

  // Debug Mode = enables (true) / disables (false) the display of error popups over the native browser UI (disableing only recommended, when false positives annoyingly occur).
  const DEBUG_MODE = true;
  const ENABLE_ERROR_POPUPS = true;

  // Playback stop switches
  const STOP_PLAYBACK_ON_QUOTE = true;
  const STOP_PLAYBACK_ON_SAVE = true;
  const STOP_PLAYBACK_ON_COPY = true;

  // UI switches
  // Enable the Comments function button
  const ENABLE_COMMENTS_BUTTON = false;

  // Time Delay Error
  const ERROR_CHECK_DELAY_MS = 600;
  const AFTER_SHOW_DELAY_MS = 600;

  // =========================
  // UI Style (central block)
  // =========================
  const UI_STYLE = {
    bottomPx: 7,

    // Bar must be 95% opacity
    barBg: "rgba(20,20,20,0.95)",
    barRadiusPx: 10,
    barPadding: "7px",
    barGapPx: 7,
    barGroupGapPx: 3,
    barShadow: "0 6px 24px rgba(0,0,0,0.35)",

    btnHeightPx: 24,
    btnPadX: 10,
    btnRadiusPx: 9,

    // Buttons must be fully opaque
    btnBg: "rgba(46,46,46,1)",
    btnText: "rgba(245,245,245,0.92)",
    btnFont: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    btnFontSizePx: 13,

    // Premium hover highlight (filter only)
    hoverFilter: "brightness(1.33) contrast(1.1)",
    flashMs: 300,
    flashFilter: "brightness(0.9)",
  };

  function applyBarStyle(bar) {
    bar.style.position = "fixed";
    bar.style.left = "50%";
    bar.style.bottom = `${UI_STYLE.bottomPx}px`;
    bar.style.transform = "translateX(-50%)";
    bar.style.zIndex = "2147483647";
    bar.style.display = "flex";
    bar.style.alignItems = "center";
    bar.style.padding = UI_STYLE.barPadding;
    bar.style.borderRadius = `${UI_STYLE.barRadiusPx}px`;
    bar.style.background = UI_STYLE.barBg;
    bar.style.boxShadow = UI_STYLE.barShadow;
    bar.style.border = "none";
    bar.style.gap = `${UI_STYLE.barGapPx}px`;
  }

  function applyButtonStyle(b) {
    b.style.height = `${UI_STYLE.btnHeightPx}px`;
    b.style.padding = `0 ${UI_STYLE.btnPadX}px`;
    b.style.borderRadius = `${UI_STYLE.btnRadiusPx}px`;
    b.style.border = "none";
    b.style.background = UI_STYLE.btnBg;
    b.style.color = UI_STYLE.btnText;
    b.style.cursor = "pointer";
    b.style.userSelect = "none";
    b.style.fontFamily = UI_STYLE.btnFont;
    b.style.fontSize = `${UI_STYLE.btnFontSizePx}px`;
    b.style.display = "inline-flex";
    b.style.alignItems = "center";
    b.style.justifyContent = "center";
    b.style.transition = "filter 140ms ease";
    b.onmouseenter = () => { if (!b.disabled) b.style.filter = UI_STYLE.hoverFilter; };
    b.onmouseleave = () => { b.style.filter = ""; };
  }

  function uiFlashButton(btnId) {
    const b = document.getElementById(btnId);
    if (!b) return;
    const prev = b.style.filter;
    b.style.filter = UI_STYLE.flashFilter;
    setTimeout(() => { b.style.filter = prev || ""; }, UI_STYLE.flashMs);
  }


  // =========================
  // Fullscreen overlay sync
  // =========================
  function getPlayerEl() {
    return (
      document.querySelector(".html5-video-player") ||
      document.querySelector("ytd-player .html5-video-player") ||
      null
    );
  }

  function isFullscreenActive() {
    try { return !!(document.fullscreenElement || document.webkitFullscreenElement); } catch { return false; }
  }

  function setBarHidden(hidden) {
    const bar = document.getElementById('omv_bar');
    if (!bar) return;
    bar.style.opacity = hidden ? "0" : "1";
    bar.style.pointerEvents = hidden ? "none" : "auto";
  }

  function shouldHideBarBecauseOverlaysHidden() {
    // Only relevant in fullscreen. Mirror YouTube chrome autohide behavior.
    if (!isFullscreenActive()) return false;
    const p = getPlayerEl();
    if (!p) return false;

    // YouTube commonly toggles these classes when chrome is hidden.
    const cls = p.classList;
    if (cls.contains("ytp-autohide")) return true;
    if (cls.contains("ytp-chrome-bottom-hidden")) return true;
    if (cls.contains("ytp-chrome-top-hidden")) return true;

    // Fallback: check bottom controls computed visibility.
    const chrome = p.querySelector(".ytp-chrome-bottom");
    if (chrome) {
      const st = window.getComputedStyle(chrome);
      const op = Number(st.opacity || "1");
      if (op <= 0.05 || st.display === "none" || st.visibility === "hidden") return true;
    }
    return false;
  }

  let __omv_fs_tick = null;

  function startFullscreenOverlaySync() {
    stopFullscreenOverlaySync();
    __omv_fs_tick = window.setInterval(() => {
      try {
        const hide = shouldHideBarBecauseOverlaysHidden();
        setBarHidden(hide);
      } catch (_) {}
    }, 120);
  }

  function stopFullscreenOverlaySync() {
    if (__omv_fs_tick != null) {
      clearInterval(__omv_fs_tick);
      __omv_fs_tick = null;
    }
    // Ensure bar is visible when leaving fullscreen.
    setBarHidden(false);
  }

  function onFullscreenChange() {
    if (isFullscreenActive()) startFullscreenOverlaySync();
    else stopFullscreenOverlaySync();
  }

// =========================
  // Config
  // =========================
  const CFG = {
    debug: DEBUG_MODE,
    errorPopup: ENABLE_ERROR_POPUPS,

    paragraphTargetMin: 400,
    paragraphTargetMax: 450,

    includeTimestampsInYouTube: true,
    includeTimestampsInLocal: true,

    censorPlaceholderToBraces: true,
    removeNonCensorBrackets: true,

    keepCaptures: 16,
    toastMs: 850,

    vttDefaultCueTailMs: 2500,
    vttMinCueDurMs: 800,

    commentsHeader: "## Comments",
    commentsTabKey: "__ytobs_comments_buffer__",

    // Show/Hide state must be TAB-isolated (sessionStorage)
    showTranscriptKey: "__ytobs_show_transcript__",

    commentsBlacklist: [
      "antworten",
      "antwort",
      "antworten ausblenden",
      "mehr",
      "mehr anzeigen",
      "weniger anzeigen",
      "reply",
      "replies",
      "read more",
      "show more",
      "show less",
      "hide replies",
      "more",
    ],
  };

  const log = (...a) => CFG.debug && console.log("[omv]", ...a);
  const warn = (...a) => CFG.debug && console.warn("[omv]", ...a);
  const err = (...a) => console.error("[omv]", ...a);

  function popupError(msg) {
    if (!CFG.errorPopup) return;
    try { alert(String(msg || "Unknown error.")); } catch (_) {}
  }

  function noTranscriptHint(base) {
    return (
      `Your request could not be completed.
The transcript segments for this video are currently not available.

If the transcript panel keeps loading forever or never appears, there may simply be no transcript for this video, or it may be a loading issue that can often be resolved with a hard refresh (Cmd–Shift–R on macOS, Ctrl–Shift–R on Windows).

You can confirm transcript availability via the Subtitles / CC button in the video controls.`
    );
  }
// ---------------- State ----------------
  const STATE = {
    captures: [],
    lastToken: null,
    lastSegments: null,
    lastVideoId: null,
  };

  function pushCapture(c) {
    STATE.captures.push(c);
    while (STATE.captures.length > CFG.keepCaptures) STATE.captures.shift();
  }

  function getVideoId() {
    try {
      const u = new URL(location.href);
      return u.searchParams.get("v") || (location.pathname.match(/\/live\/([^/?]+)/) || [])[1] || null;
    } catch {
      return null;
    }
  }

  function resetState(reason) {
    log("state reset:", reason);
    STATE.captures = [];
    STATE.lastToken = null;
    STATE.lastSegments = null;
    STATE.lastVideoId = getVideoId();
    uiResetButtons();
  }

  // =========================
  // Utilities
  // =========================
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function normalizeSpaces(s) {
    return String(s || "")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.;:!?…])/g, "$1")
      .replace(/\s+([)\]])/g, "$1")
      .trim();
  }

  function textOf(el) {
    return el ? String(el.textContent || "").replace(/\s+/g, " ").trim() : "";
  }

  async function writeClipboard(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);

    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    if (!ok) throw new Error("Clipboard write failed.");
  }



async function writeClipboardImagePng(blob) {
  // Best-effort: write PNG image to clipboard.
  // Can fail due to browser permissions/support or a tainted canvas (cross-origin video).
  if (!blob) throw new Error("No image data.");
  const cb = navigator.clipboard;
  if (!cb || typeof cb.write !== "function" || typeof ClipboardItem === "undefined") {
    throw new Error("Clipboard image write not supported in this browser.");
  }
  const item = new ClipboardItem({ "image/png": blob });
  await cb.write([item]);
}

async function writeClipboardRtf(rtf, plainFallback) {
  // Best-effort: write RTF to clipboard (Word-friendly). Falls back to plain text.
  const r = String(rtf || "");
  const p = String(plainFallback || "");
  const cb = navigator.clipboard;
  if (cb && typeof cb.write === "function" && typeof ClipboardItem !== "undefined") {
    try {
      const item = new ClipboardItem({
        "text/rtf": new Blob([r], { type: "text/rtf" }),
        "text/plain": new Blob([p || r], { type: "text/plain" }),
      });
      await cb.write([item]);
      return;
    } catch (_) {
      // fall through
    }
  }
  await writeClipboard(p || r);
}

async function writeClipboardRich({ rtf, html, plain }) {
  // Best-effort: write a rich clipboard payload. Prefers text/rtf + text/html + text/plain.
  const r = String(rtf || "");
  const h = String(html || "");
  const p = String(plain || "");
  const cb = navigator.clipboard;
  if (cb && typeof cb.write === "function" && typeof ClipboardItem !== "undefined") {
    try {
      const payload = {};
      if (r) payload["text/rtf"] = new Blob([r], { type: "text/rtf" });
      if (h) payload["text/html"] = new Blob([h], { type: "text/html" });
      payload["text/plain"] = new Blob([p || r || h], { type: "text/plain" });
      const item = new ClipboardItem(payload);
      await cb.write([item]);
      return;
    } catch (_) {
      // fall through
    }
  }
  await writeClipboard(p || r || h);
}

function omvEscapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function omvPlainToHtml(plain) {
  // Keep line breaks as <br>. Minimal, predictable HTML.
  const esc = omvEscapeHtml(plain);
  return `<div style="white-space:pre-wrap;">${esc.replace(/\n/g, "<br>")}</div>`;
}


async function readClipboardText() {
    if (navigator.clipboard?.readText) return navigator.clipboard.readText();
    throw new Error("Clipboard readText not available.");
  }

  function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Delay revoke for Brave/Chromium reliability, especially with multiple downloads.
    setTimeout(() => {
      try { URL.revokeObjectURL(url); } catch (_) {}
    }, 2000);
  }

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => {
    try { URL.revokeObjectURL(url); } catch (_) {}
  }, 2000);
}


  // =========================
  // RTF export (copy-friendly for Word)
  // =========================
  function rtfEscape(text) {
    const s = String(text ?? "");
    let out = "";
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      const code = s.charCodeAt(i);

      if (ch === "\\") { out += "\\\\"; continue; }
      if (ch === "{") { out += "\\{"; continue; }
      if (ch === "}") { out += "\\}"; continue; }

      // RTF best practice for non-ASCII: \uN?
      if (code >= 128) {
        const signed = code > 32767 ? code - 65536 : code;
        out += `\\u${signed}?`;
        continue;
      }

      // normalize newlines later
      out += ch;
    }
    return out;
  }

  function rtfLine(line, bold = false) {
    const escaped = rtfEscape(String(line ?? "")).replace(/\r?\n/g, " ").trim();
    if (!escaped) return "\\par\n";
    if (bold) return `\\b ${escaped}\\b0\\par\n`;
    return `${escaped}\\par\n`;
  }

  function rtfHyperlink(displayText, url) {
    const disp = rtfEscape(String(displayText ?? "")).replace(/\r?\n/g, " ").trim();
    const u = rtfEscape(String(url ?? "")).replace(/\r?\n/g, " ").trim();
    // Word-compatible hyperlink field
    return `{\\field{\\*\\fldinst{HYPERLINK "${u}"}}{\\fldrslt{${disp}}}}`;
  }

  function rtfParagraphWithTimestampLink(tsDisplay, tsUrl, restText) {
    const link = rtfHyperlink(tsDisplay, tsUrl);
    const rest = rtfEscape(String(restText ?? "")).replace(/\r?\n/g, " ").trim();
    if (rest) return `${link} ${rest}\\par\n`;
    return `${link}\\par\n`;
  }

  function buildTranscriptRtf(videoId, meta, segments) {
    const channel = normalizeSpaces(meta?.channel || "") || "YouTube";
    const title = normalizeSpaces(meta?.title || "") || "Untitled";
    const url = baseWatchUrl(videoId);

    const uploadYmd = publishDateToYMD(meta?.publishDate) || "";
    const uploadLine = uploadYmd ? `Upload Date: ${uploadYmd}` : "";

    const paras = buildFlowParagraphs(segments);

    let bodyRtf = "";
    for (const p of paras) {
      const line = normalizeSpaces(p.text || "");
      if (!line) continue;
      const sec = Math.floor((p.startMs || 0) / 1000);
      const ts = formatHMS(sec);
      const urlTs = watchLink(videoId, sec);
      bodyRtf += rtfParagraphWithTimestampLink(ts, urlTs, line);
      bodyRtf += "\\par\n";
    }

    let rtf = "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\fs22\n";
    rtf += rtfLine(channel, true);
    rtf += rtfLine(title, true);
    rtf += rtfLine(url, false);
    if (uploadLine) rtf += rtfLine(uploadLine, false);
    rtf += "\\par\n";
    rtf += bodyRtf;
    rtf += "}";
    return rtf;
  }



  // =========================
  // Global Persisted State (preparation layer)
  // =========================
  const OMV_STORAGE = {
    exportProfileKey: "__omv_export_profile__",
    copySelectionKey: "__omv_copy_selection__",
  };

  function readJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(String(key));
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    try {
      localStorage.setItem(String(key), JSON.stringify(value));
    } catch (_) {}
  }

  function getExportProfile() {
    return readJsonStorage(OMV_STORAGE.exportProfileKey, null);
  }

  function setExportProfile(profile) {
    writeJsonStorage(OMV_STORAGE.exportProfileKey, profile);
  }

  function getCopySelection() {
    const v = localStorage.getItem(OMV_STORAGE.copySelectionKey);
    return (v && typeof v === "string") ? v : null;
  }

  function setCopySelection(key) {
    try { localStorage.setItem(OMV_STORAGE.copySelectionKey, String(key)); } catch (_) {}
  }

  function nowIsoLocalNoT() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function yamlEscape(v) {
    if (v == null) return '""';
    const s = String(v);
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }

  function pad2(n) { return String(n).padStart(2, "0"); }
  function formatHMS(sec) {
    const s = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return `${pad2(h)}:${pad2(m)}:${pad2(r)}`;
  }

  function baseWatchUrl(videoId) {
    return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  }

  function watchLink(videoId, sec) {
    const t = Math.max(0, Math.floor(sec || 0));
    return `${baseWatchUrl(videoId)}&t=${t}s`;
  }

  function formatDDMMYYYY(d) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear());
    return `${dd}.${mm}.${yy}`;
  }


function getActiveVideoEl() {
  return (
    document.querySelector("video.html5-main-video") ||
    document.querySelector("ytd-player video") ||
    document.querySelector("video") ||
    null
  );
}

async function captureCurrentFramePngBlob() {
  const v = getActiveVideoEl();
  if (!v) throw new Error("No active video element.");

  const w = Number(v.videoWidth || 0);
  const h = Number(v.videoHeight || 0);
  if (!w || !h) throw new Error("Video frame not ready.");

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available.");

  ctx.drawImage(v, 0, 0, w, h);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Failed to encode PNG.");
  return blob;
}

async function fetchThumbnailPngBlob(videoId) {
  const vid = String(videoId || "").trim();
  if (!vid) throw new Error("No video ID.");

  const candidates = [
    `https://i.ytimg.com/vi/${encodeURIComponent(vid)}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${encodeURIComponent(vid)}/hqdefault.jpg`,
  ];

  let lastErr = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url, { mode: "cors", credentials: "omit" });
      if (!res.ok) throw new Error(`Thumbnail fetch failed (${res.status}).`);
      const blob = await res.blob();

      const imgUrl = URL.createObjectURL(blob);
      try {
        const img = await new Promise((resolve, reject) => {
          const im = new Image();
          im.crossOrigin = "anonymous";
          im.onload = () => resolve(im);
          im.onerror = () => reject(new Error("Thumbnail image decode failed."));
          im.src = imgUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not available.");
        ctx.drawImage(img, 0, 0);

        const png = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!png) throw new Error("Failed to encode PNG.");
        return png;
      } finally {
        try { URL.revokeObjectURL(imgUrl); } catch (_) {}
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("Thumbnail fetch failed.");
}



  // =========================
  // Show/Hide state (TAB-isolated)
  // =========================
  function isTranscriptShown() {
    try { return sessionStorage.getItem(CFG.showTranscriptKey) === "1"; } catch { return false; }
  }
  function setTranscriptShown(on) {
    try { sessionStorage.setItem(CFG.showTranscriptKey, on ? "1" : "0"); } catch {}
  }

  function uiApplyShowHideStyle() {
    const b = document.getElementById(UI.btnShowHideId);
    if (!b) return;
    // Label stays constant for simplicity
    b.textContent = "On / Off";
    b.style.opacity = "1";
    b.style.color = UI_STYLE.btnText;
    // Must match button color
    b.style.background = UI_STYLE.btnBg;
  }

  function wireShowHideButtonOnly() {
    const b = document.getElementById(UI.btnShowHideId);
    if (!b) return;

    if (b.dataset.wiredShowHide === "1") return;
    b.dataset.wiredShowHide = "1";

    b.onclick = async () => {
      uiFlashButton(UI.btnShowHideId);

      const nextShown = !isTranscriptShown();
      setTranscriptShown(nextShown);
      uiApplyShowHideStyle();

      if (nextShown) {
        try { await showTranscriptPanel(); } catch (_) {}
      } else {
        try { await hideTranscriptPanel(); } catch (_) {}
      }
    };
  }

  // =========================
  // Filename + Title Cleaning
  // =========================
  function stripEmojisAndHashtags(s) {
    let t = String(s || "");
    t = t.replace(/#[\p{L}\p{N}_]+/gu, "");
    t = t.replace(/\p{Extended_Pictographic}+/gu, "");
    t = t.replace(/\p{Emoji_Modifier}+/gu, "");
    t = t.replace(/[\uFE0E\uFE0F]/g, "");
    t = t.replace(/[\u200D]/g, "");
    return t;
  }

  function cleanTitleCore(rawTitle) {
    let t = String(rawTitle || "");
    t = stripEmojisAndHashtags(t);
    t = t.replace(/;/g, ",");
    t = t.replace(/:/g, " - ");
    t = t.replace(/\?/g, "!");
    t = t.replace(/["'`]/g, "");
    t = t.replace(/[‘’‚‛´]/g, "");
    t = t.replace(/[“”„‟«»‹›]/g, "");
    t = t.replace(/\*/g, "");
    t = t.replace(/\[[^\]]*?\]/g, " ");
    t = normalizeSpaces(t);
    return t || "youtube";
  }

  function sanitizeForFile(s) {
    let t = String(s || "");
    t = t.replace(/[\\/:*"<>\|]/g, "-");
    t = t.replace(/\s+/g, " ").trim();
    t = t.replace(/-+/g, "-").trim();
    t = t.slice(0, 180);
    return t || "youtube";
  }

  // IMPORTANT: do not normalize hyphens globally (breaks YYYY-MM-DD)
  function sanitizeRichTitle(s) {
    let t = String(s || "");
    t = t.replace(/[\\/:*"<>\|]/g, "-");
    t = t.replace(/\s+/g, " ").trim();
    t = t.replace(/\s+-\s+/g, " - "); // only spaced separators
    t = t.replace(/-{2,}/g, "-");
    t = t.trim().slice(0, 180);
    return t || "youtube";
  }

  // NEW: Use raw DOM meta.publishDate as source of truth, extract ONLY YYYY-MM-DD (strict).
  // No Date() parsing. If it fails, we leave a debug-friendly placeholder.
  function publishDateToYMD(metaPublishText) {
    const raw = normalizeSpaces(metaPublishText || "");
    if (!raw) return null;

    const cleaned = raw
      .replace(/^(Premiered|Published|Streamed live on|Started streaming on)\s+/i, "")
      .trim();

    // strict YYYY-MM-DD anywhere in the raw string
    let m = cleaned.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;

    // strict numeric forms like 31.12.2025 / 31/12/2025 / 31-12-2025
    m = cleaned.match(/\b(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})\b/);
    if (m) {
      const dd = String(m[1]).padStart(2, "0");
      const mm = String(m[2]).padStart(2, "0");
      const yy = String(m[3]);
      return `${yy}-${mm}-${dd}`;
    }

    return null;
  }

  // RichTitle: "ChannelName - CleanTitle YYYY-MM-DD"
  function buildRichTitle(meta, videoId) {
    const channelNameRaw = meta.channel ? normalizeSpaces(meta.channel) : "YouTube";
    const channelName = sanitizeForFile(channelNameRaw);

    const CleanTitle = sanitizeForFile(cleanTitleCore(meta.title || ""));

    const ymd = publishDateToYMD(meta.publishDate) || "0000-00-00";

    const base = `${channelName} - ${CleanTitle} ${ymd}`;
    return sanitizeRichTitle(base);
  }

  // =========================
  // DOM metadata
  // =========================
  function getDomTitle() {
    return (
      textOf(document.querySelector("h1.ytd-watch-metadata")) ||
      textOf(document.querySelector("#title h1")) ||
      document.title.replace(/\s*-\s*YouTube\s*$/i, "").trim()
    );
  }

  function getDomChannel() {
    const a =
      document.querySelector("ytd-channel-name a") ||
      document.querySelector("#owner #channel-name a") ||
      document.querySelector("a.yt-simple-endpoint.style-scope.yt-formatted-string[href*='/@']");
    const name = textOf(a);
    const url = a && a.href ? a.href : "";
    return { name, url };
  }

  function getDomDescription() {
    // Preserve original line breaks. Prefer the pre-wrap span inside the description expander.
    const root =
      document.querySelector("ytd-text-inline-expander#description-inline-expander") ||
      document.querySelector("#description-inline-expander") ||
      null;

    const preWrap =
      (root && root.querySelector("span.yt-core-attributed-string--white-space-pre-wrap")) ||
      document.querySelector("ytd-text-inline-expander#description-inline-expander span.yt-core-attributed-string--white-space-pre-wrap") ||
      document.querySelector("#description-inline-expander span.yt-core-attributed-string--white-space-pre-wrap") ||
      null;

    const expanded =
      (root && root.querySelector("#expanded")) ||
      document.querySelector("ytd-text-inline-expander#description-inline-expander #expanded") ||
      document.querySelector("#description-inline-expander #expanded") ||
      null;

    const d =
      preWrap ||
      expanded ||
      (root && root.querySelector("yt-attributed-string")) ||
      (root && root.querySelector("#content")) ||
      document.querySelector("#description.ytd-watch-metadata") ||
      root ||
      null;

    let raw = d ? String(d.innerText || d.textContent || "") : "";
    raw = raw.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n");

    // Remove UI-only lines that sometimes leak into innerText.
    if (raw) {
      const lines = raw.split("\n").map((l) => l.replace(/[ \t]+$/g, ""));
      const cleaned = lines.filter((l) => {
        const t = l.trim();
        if (!t) return true;
        if (/^(…?mehr|mehr anzeigen|weniger anzeigen)$/i.test(t)) return false;
        return true;
      });
      raw = cleaned.join("\n");
    }

    let out = raw.trim();

    // Fallback: meta description (no guaranteed line breaks, but better than empty).
    if (!out) {
      const metaEl =
        document.querySelector('meta[name="description"]') ||
        document.querySelector('meta[itemprop="description"]') ||
        null;
      const metaDesc = metaEl ? String(metaEl.getAttribute("content") || "") : "";
      out = metaDesc.replace(/\r/g, "").trim();
    }

    return out;
  }

  function getDomPublishDate() {
    const el =
      document.querySelector("#info-strings yt-formatted-string") ||
      document.querySelector("ytd-watch-info-text #info-strings") ||
      null;
    return textOf(el);
  }

  function getDomMeta() {
    const title = getDomTitle();
    const ch = getDomChannel();
    const description = getDomDescription();
    const publishDate = getDomPublishDate();
    return { title, channel: ch.name, channelUrl: ch.url, publishDate, description };
  }

  // =========================
  // Transcript panel: show / hide
  // =========================
  function findTranscriptShowButton() {
    return (
      document.querySelector("ytd-video-description-transcript-section-renderer button[aria-label*='transcript' i]") ||
      document.querySelector("ytd-video-description-transcript-section-renderer button[aria-label*='transkript' i]") ||
      document.querySelector("#button-container button[aria-label*='transcript' i]") ||
      document.querySelector("#button-container button[aria-label*='transkript' i]") ||
      document.querySelector("button[aria-label*='Show transcript' i]") ||
      document.querySelector("button[aria-label*='Transkript anzeigen' i]") ||
      null
    );
  }

  function findTranscriptHideButton() {
    const btns = Array.from(document.querySelectorAll("#visibility-button button[aria-label]"));
    for (const b of btns) {
      const a = b.getAttribute("aria-label") || "";
      if (/(transcript|transkript)/i.test(a) && /(close|schlie|schließ|hide)/i.test(a)) return b;
      if (/(transcript|transkript)/i.test(a) && /(schließen)/i.test(a)) return b;
    }
    const btns2 = Array.from(document.querySelectorAll("ytd-engagement-panel-title-header-renderer button[aria-label]"));
    for (const b of btns2) {
      const a = b.getAttribute("aria-label") || "";
      if (/(transcript|transkript)/i.test(a) && /(close|schlie|schließ|hide)/i.test(a)) return b;
    }
    return null;
  }

  async function showTranscriptPanel() {
    const b = findTranscriptShowButton();
    if (b) b.click();
    await sleep(AFTER_SHOW_DELAY_MS);
  }

  async function hideTranscriptPanel() {
    const b = findTranscriptHideButton();
    if (b) b.click();
    await sleep(180);
  }

  // =========================
  // DOM transcript extraction
  // =========================
  function parseTimeToMs(s) {
    const t = String(s || "").trim();
    if (!t) return null;
    const parts = t.split(":").map(x => Number(x));
    if (parts.some(n => Number.isNaN(n))) return null;
    let sec = 0;
    if (parts.length === 2) sec = parts[0] * 60 + parts[1];
    else if (parts.length === 3) sec = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else return null;
    return sec * 1000;
  }

  function extractSegmentsFromDom() {
    const nodes = Array.from(document.querySelectorAll("ytd-transcript-segment-renderer"));
    if (!nodes.length) return null;

    const segs = [];
    for (const n of nodes) {
      const tEl =
        n.querySelector("#timestamp") ||
        n.querySelector(".segment-timestamp") ||
        n.querySelector("[class*='timestamp' i]");

      const sEl =
        n.querySelector("#segment-text") ||
        n.querySelector(".segment-text") ||
        n.querySelector("yt-formatted-string") ||
        n.querySelector("[class*='segment' i] yt-formatted-string");

      const tMs = parseTimeToMs(textOf(tEl));
      const txt = normalizeSpaces(textOf(sEl));
      if (tMs == null || !txt) continue;
      segs.push({ tMs, text: txt });
    }
    if (!segs.length) return null;

    segs.sort((a, b) => a.tMs - b.tMs);
    const out = [];
    const set = new Set();
    for (const s of segs) {
      const k = `${s.tMs}|${s.text}`;
      if (set.has(k)) continue;
      set.add(k);
      out.push(s);
    }
    return out;
  }

  // =========================
// Quote builder
// =========================
function buildQuoteFromWindow(segments, tStartSec, tEndSec) {
  if (!segments?.length) return null;

  const tStartMs = Math.max(0, Math.floor((tStartSec || 0) * 1000));
  const tEndMs = Math.max(0, Math.floor((tEndSec || 0) * 1000));
  if (tEndMs < tStartMs) return null;

  const idxs = [];
  for (let i = 0; i < segments.length; i++) {
    const t = Number(segments[i]?.tMs ?? -1);
    if (t >= tStartMs && t <= tEndMs) idxs.push(i);
  }
  if (!idxs.length) return null;

  const firstIdx = idxs[0];
  const lastIdx = idxs[idxs.length - 1];

  const text = normalizeSpaces(idxs.map(i => segments[i]?.text || "").join(" "));
  if (!text) return null;

  const startSec = Math.max(0, Math.floor((segments[firstIdx]?.tMs || 0) / 1000));
  const endSec = Math.max(startSec, Math.floor((segments[lastIdx]?.tMs || 0) / 1000));

  return { text, startSec, endSec, firstIdx, lastIdx };
}

// =========================
// Modal helpers
// =========================
function omvRemoveById(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function omvMakeOverlay(id) {
  const overlay = document.createElement("div");
  overlay.id = id;
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "2147483647";
  overlay.style.background = "rgba(0,0,0,0.55)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "22px";
  return overlay;
}

function omvMakeModalBox() {
  const box = document.createElement("div");
  // shrink-to-fit (but never exceed viewport)
  box.style.display = "inline-block";
  box.style.width = "auto";
  box.style.maxHeight = "84vh";
  box.style.overflow = "auto";
  box.style.maxWidth = "92vw";
  box.style.background = "rgba(26,26,26,0.98)";
  box.style.borderRadius = "12px";
  box.style.boxShadow = "0 10px 36px rgba(0,0,0,0.55)";
  box.style.padding = "22px";
  box.style.color = "rgba(245,245,245,0.92)";
  box.style.fontFamily = UI_STYLE.btnFont;
  box.style.fontSize = "13px";
  box.style.lineHeight = "1.35";
  return box;
}

function omvWireOutsideClickClose(overlay, closeFn) {
  if (!overlay) return;
  overlay.addEventListener("mousedown", (ev) => {
    if (ev.target === overlay) closeFn();
  });
}

function omvAddCloseX(modalBoxEl, closeFn) {
  if (!modalBoxEl) return;
  try { modalBoxEl.style.position = modalBoxEl.style.position || "relative"; } catch (_) {}

  const x = document.createElement("button");
  x.type = "button";
  x.textContent = "✕";
  applyButtonStyle(x);
  x.style.position = "absolute";
  x.style.top = "10px";
  x.style.right = "10px";
  x.style.width = "28px";
  x.style.height = "28px";
  x.style.padding = "0";
  x.style.borderRadius = "9px";
  x.style.lineHeight = "1";
  x.style.fontSize = "16px";
  x.style.display = "inline-flex";
  x.style.alignItems = "center";
  x.style.justifyContent = "center";
  x.onclick = (ev) => {
    try { ev.preventDefault(); ev.stopPropagation(); } catch (_) {}
    closeFn();
  };

  modalBoxEl.appendChild(x);
}


  function buildQuoteMetaBlock(meta, url, quoteText) {
    const ch = normalizeSpaces(meta?.channel || "") || "YouTube";
    const title = normalizeSpaces(meta?.title || "") || "Untitled";
    const link = String(url || "").trim();
    const q = String(quoteText || "").trim();
    return `${ch}\n${title}\n${link}\n${q}`;
  }

  function openQuoteModal({ videoId, text, startSec, endSec, meta, segments, tStartSec, tEndSec }) {
    const existing = document.getElementById(UI.quoteModalId);
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = UI.quoteModalId;
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.background = "rgba(0,0,0,0.55)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "22px";

    const box = document.createElement("div");
    // shrink-to-fit (but never exceed viewport)
    box.style.display = "inline-block";
    box.style.width = "auto";
    box.style.maxHeight = "84vh";
    box.style.overflow = "auto";
    box.style.maxWidth = "92vw";
    box.style.background = "rgba(26,26,26,0.98)";
    box.style.borderRadius = "12px";
    box.style.boxShadow = "0 10px 36px rgba(0,0,0,0.55)";
    box.style.padding = "22px 22px 22px 22px";
    box.style.color = "rgba(245,245,245,0.92)";
    box.style.fontFamily = UI_STYLE.btnFont;
    box.style.fontSize = "13px";
    box.style.lineHeight = "1.35";

    const state = {
      videoId,
      segments: Array.isArray(segments) ? segments : null,
      tStartSec: Math.max(0, Number(tStartSec ?? startSec ?? 0)),
      tEndSec: Math.max(0, Number(tEndSec ?? endSec ?? 0)),
      startSec: Math.max(0, Number(startSec ?? 0)),
      endSec: Math.max(0, Number(endSec ?? 0)),
      text: String(text || "").trim(),
      meta: meta || {},
      firstIdx: null,
      lastIdx: null,
      userEdited: false,
    };

    // Header (Quoting + Channel, then Video Title)
    const header = document.createElement("div");
    header.style.marginBottom = "6px";
    header.style.paddingRight = "44px";

    const quotingLine = document.createElement("div");
    quotingLine.style.fontSize = "16px";
    quotingLine.style.fontWeight = "700";
    quotingLine.style.marginBottom = "12px";
    quotingLine.textContent = `Quoting: ${normalizeSpaces(state.meta?.channel || "") || "YouTube"}`;

    const videoTitleLine = document.createElement("div");
    videoTitleLine.style.fontSize = "14px";
    videoTitleLine.style.fontWeight = "700";
    videoTitleLine.style.opacity = "0.96";
    videoTitleLine.style.marginBottom = "0px";
    videoTitleLine.textContent = normalizeSpaces(state.meta?.title || "") || "Untitled";

    header.appendChild(quotingLine);
    header.appendChild(videoTitleLine);

    // Link line (below text)
    const linkLine = document.createElement("div");
    linkLine.style.display = "block";
    linkLine.style.fontSize = "12px";
    linkLine.style.marginTop = "2px";
    linkLine.style.marginBottom = "6px";
    linkLine.style.opacity = "0.66";
    linkLine.style.userSelect = "none";

    const linkA = document.createElement("a");

    let __omv_linkCopyTimer = null;
    function flashLinkCopied() {
      try {
        const base = String(linkA.dataset.url || linkA.textContent || "").split(" (")[0].trim();
        if (!base) return;
        linkA.textContent = `${base} ✓`;
        if (__omv_linkCopyTimer) clearTimeout(__omv_linkCopyTimer); __omv_linkCopyTimer = setTimeout(() => {
          try { linkA.textContent = `${base} (click to copy)`; } catch (_) {}
          __omv_linkCopyTimer = null;
        }, 650);
      } catch (_) {}
    }
    linkA.style.color = "rgba(200,220,255,0.72)";
    linkA.style.textDecoration = "none";
    linkA.onmouseenter = () => { linkA.style.textDecoration = "underline"; };
    linkA.onmouseleave = () => { linkA.style.textDecoration = "none"; };

    linkA.href = "#";
    linkA.style.cursor = "pointer";
    linkA.onclick = async (ev) => {
      try {
        ev.preventDefault();
        const u = String(linkA.dataset.url || "").trim();
        if (!u) return;
        await writeClipboard(u);
        flashLinkCopied();
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      }
    };

    linkLine.appendChild(linkA);

    // Time window line (above link, below textbox)
    const timeLine = document.createElement("div");
    timeLine.style.marginTop = "0px";
    timeLine.style.opacity = "0.62";
    timeLine.style.marginBottom = "22px";
    timeLine.style.userSelect = "none";

    // Quote text (editable + auto-grow)
    const textBox = document.createElement("textarea");
    textBox.value = state.text;
    textBox.spellcheck = false;
    textBox.wrap = "soft";
    textBox.style.width = "100%";
    textBox.style.marginTop = "0px";
    textBox.style.marginBottom = "12px";
    textBox.style.minHeight = "140px";
    textBox.style.maxHeight = "44vh";
    textBox.style.resize = "none";
    textBox.style.overflow = "hidden";
    textBox.style.whiteSpace = "pre-wrap";
    textBox.style.background = "rgba(18,18,18,0.95)";
    textBox.style.borderRadius = "10px";
    textBox.style.padding = "17px";
    textBox.style.border = "none";
    textBox.style.outline = "none";
    textBox.style.color = "rgba(245,245,245,0.92)";
    textBox.style.fontFamily = UI_STYLE.btnFont;
    textBox.style.fontSize = "13px";
    textBox.style.lineHeight = "1.35";
    textBox.style.boxSizing = "border-box";

    function autoGrowTextarea() {
      try {
        textBox.style.height = "auto";
        const maxPx = Math.floor(window.innerHeight * 0.44);
        const h = Math.max(140, Math.min(textBox.scrollHeight + 2, maxPx));
        textBox.style.height = `${h}px`;
      } catch (_) {}
    }

    textBox.addEventListener("input", () => {
      state.userEdited = true;
      autoGrowTextarea();
    });

    function getPayloadText() {
      const v = String(textBox.value || "");
      try {
        const a = Number(textBox.selectionStart ?? 0);
        const b = Number(textBox.selectionEnd ?? 0);
        if (Number.isFinite(a) && Number.isFinite(b) && b > a) {
          const sel = v.slice(a, b).trim();
          if (sel) return normalizeSpaces(sel);
        }
      } catch (_) {}
      return normalizeSpaces(v);
    }

    // Buttons row (single line: arrows left, save/cancel right)
    const rowActions = document.createElement("div");
    rowActions.style.display = "flex";
    rowActions.style.alignItems = "center";
    rowActions.style.gap = "10px";
    rowActions.style.flexWrap = "nowrap";
    rowActions.style.marginTop = "0px";

    const leftActions = document.createElement("div");
    leftActions.style.display = "flex";
    leftActions.style.alignItems = "center";
    leftActions.style.gap = "8px";

    const rightActions = document.createElement("div");
    rightActions.style.display = "flex";
    rightActions.style.alignItems = "center";
    rightActions.style.gap = "10px";
    rightActions.style.marginLeft = "auto";
    rightActions.style.flexWrap = "wrap";
    rightActions.style.justifyContent = "flex-end";

    const mkBtn = (label) => {
      const b = document.createElement("button");
      b.textContent = label;
      applyButtonStyle(b);
      b.style.height = "26px";
      return b;
    };

    const btnPrev = mkBtn("←");
    const btnNext = mkBtn("→");
    btnPrev.style.width = "34px";
    btnNext.style.width = "34px";
    btnPrev.style.padding = "0";
    btnNext.style.padding = "0";

    const btnMeta = mkBtn("Copy with Meta");
    const btnPlain = mkBtn("Copy");

    function close() {
      const m = document.getElementById(UI.quoteModalId);
      if (m) m.remove();
    }

    omvAddCloseX(box, close);

    btnPlain.onclick = async () => {
      try {
        const payload = getPayloadText();
        if (!payload) return close();
        await writeClipboard(payload);
        close();
        uiToast(UI.btnQuoteId, "✓");
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      }
    };

    btnMeta.onclick = async () => {
      try {
        const payload = getPayloadText();
        if (!payload) return close();
        const linkUrl = watchLink(state.videoId, state.startSec);
        const block = buildQuoteMetaBlock(state.meta, linkUrl, payload);
        await writeClipboard(block);
        close();
        uiToast(UI.btnQuoteId, "✓");
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      }
    };

    function refreshInfo() {
      const s = formatHMS(state.tStartSec);
      const e = formatHMS(state.tEndSec);
      const dur = Math.max(0, Number(state.tEndSec) - Number(state.tStartSec));
      timeLine.textContent = `${s} – ${e} | ${dur.toFixed(1)}s`;

      const linkUrl = watchLink(state.videoId, state.startSec);
      linkA.dataset.url = linkUrl;
      linkA.href = "#";
      linkA.textContent = `${linkUrl} (click to copy)`;
    }

    function recomputeQuote() {
      if (!state.segments?.length) return false;
      const q = buildQuoteFromWindow(state.segments, state.tStartSec, state.tEndSec);
      if (!q?.text) return false;

      state.text = String(q.text || "").trim();
      state.startSec = Math.max(0, Number(q.startSec ?? state.startSec));
      state.endSec = Math.max(state.startSec, Number(q.endSec ?? state.endSec));
      state.firstIdx = Number.isFinite(q.firstIdx) ? q.firstIdx : null;
      state.lastIdx = Number.isFinite(q.lastIdx) ? q.lastIdx : null;

      // overwrite on expand; edits stay possible after final window selection
      state.userEdited = false;

      const prevSelStart = textBox.selectionStart;
      const prevSelEnd = textBox.selectionEnd;

      textBox.value = state.text;

      try {
        if (Number.isFinite(prevSelStart) && Number.isFinite(prevSelEnd)) {
          const L = textBox.value.length;
          textBox.selectionStart = Math.max(0, Math.min(prevSelStart, L));
          textBox.selectionEnd = Math.max(0, Math.min(prevSelEnd, L));
        }
      } catch (_) {}

      refreshInfo();
      autoGrowTextarea();
      return true;
    }

    function prevTimestamp() {
      if (!state.segments?.length) return;
      const curMs = Math.max(0, Math.floor(state.tStartSec * 1000));
      let prevMs = null;
      for (let i = 0; i < state.segments.length; i++) {
        const t = Number(state.segments[i]?.tMs ?? -1);
        if (t >= 0 && t < curMs) prevMs = t;
        else if (t >= curMs) break;
      }
      if (prevMs == null) return;
      state.tStartSec = Math.max(0, Math.floor(prevMs / 1000));
      if (state.tEndSec < state.tStartSec) state.tEndSec = state.tStartSec;
      recomputeQuote();
    }

    function nextTimestamp() {
      if (!state.segments?.length) return;
      const curMs = Math.max(0, Math.floor(state.tEndSec * 1000));
      let nextMs = null;
      for (let i = 0; i < state.segments.length; i++) {
        const t = Number(state.segments[i]?.tMs ?? -1);
        if (t > curMs) { nextMs = t; break; }
      }
      if (nextMs == null) return;
      state.tEndSec = Math.max(state.tStartSec, Math.floor(nextMs / 1000));
      recomputeQuote();
    }

    btnPrev.onclick = () => prevTimestamp();
    btnNext.onclick = () => nextTimestamp();

    function toastLocal(btn, symbol, ms = 900) {
      if (!btn) return;
      const orig = btn.textContent || "";
      btn.textContent = symbol || orig;
      btn.disabled = true;
      setTimeout(() => {
        try { btn.textContent = orig; btn.disabled = false; } catch (_) {}
      }, ms);
    }


    // click outside closes
    overlay.addEventListener("mousedown", (ev) => {
      if (ev.target === overlay) close();
    });

    leftActions.appendChild(btnPrev);
    leftActions.appendChild(btnNext);

    rightActions.appendChild(btnPlain);
    rightActions.appendChild(btnMeta);

    rowActions.appendChild(leftActions);
    rowActions.appendChild(rightActions);

    box.appendChild(header);
    box.appendChild(linkLine);
    box.appendChild(timeLine);
    box.appendChild(textBox);
    box.appendChild(rowActions);

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // initial refresh
    refreshInfo();
    recomputeQuote();
    autoGrowTextarea();
  }



  // =========================
  // Obsidian cleanup
  // =========================
  function obsidianCleanText(text) {
    let t = String(text || "");
    if (CFG.censorPlaceholderToBraces || CFG.removeNonCensorBrackets) {
      const MARK = "__YT_OBS_CENSOR__";
      if (CFG.censorPlaceholderToBraces) t = t.replace(/\[_\]/g, MARK);
      if (CFG.removeNonCensorBrackets) t = t.replace(/\[[^\]]*?\]/g, "");
      if (CFG.censorPlaceholderToBraces) t = t.replace(new RegExp(MARK, "g"), "{ _ }");
    }
    return normalizeSpaces(t);
  }

  function buildFlowParagraphs(segments) {
    const paras = [];
    let buf = "";
    let startMs = null;

    const minLen = CFG.paragraphTargetMin;
    const maxLen = CFG.paragraphTargetMax;
    const endsSentence = (s) => /[.!?…]["”’)\]]*$/.test(s);

    function flush() {
      let p = normalizeSpaces(buf);
      if (!p) { buf = ""; startMs = null; return; }
      p = obsidianCleanText(p);
      paras.push({ startMs: startMs ?? 0, text: p });
      buf = "";
      startMs = null;
    }

    for (const seg of segments) {
      const segText = String(seg.text || "").trim();
      if (!segText) continue;

      if (startMs == null) startMs = Number(seg.tMs || 0);
      buf = normalizeSpaces(buf ? (buf + " " + segText) : segText);

      if (buf.length >= maxLen) { flush(); continue; }
      if (endsSentence(segText) && buf.length >= minLen) flush();
    }
    if (buf.trim()) flush();
    return paras;
  }

  // =========================
  // MarkdownYoutube builder (for COPY)
  // =========================
  function buildFrontmatter(meta, url, exportedAt) {
    const fm = [];
    const CleanTitle = sanitizeForFile(cleanTitleCore(meta.title || ""));
    fm.push("---");
    fm.push(`title: ${yamlEscape(CleanTitle)}`);
    if (meta.channel) fm.push(`channel: ${yamlEscape(meta.channel)}`);
    if (meta.channelUrl) fm.push(`channel_url: ${yamlEscape(meta.channelUrl)}`);
    fm.push(`source: ${yamlEscape("YouTube")}`);
    fm.push(`url: ${yamlEscape(url)}`);
    fm.push(`save_it: ${yamlEscape(url.replace("www.youtube.com", SAVE_DOWNLOAD_HOST))}`);
    if (meta.publishDate) fm.push(`published: ${yamlEscape(meta.publishDate)}`);
    fm.push(`exported_at: ${yamlEscape(exportedAt)}`);
    fm.push("tags:");
    fm.push("  - youtube");
    fm.push("  - transcript");
    fm.push("---");
    fm.push("");
    return fm.join("\n");
  }

  function buildMarkdownYoutube(videoId, meta, segments) {
    const url = location.href;
    const exportedAt = nowIsoLocalNoT();

    const CleanTitle = sanitizeForFile(cleanTitleCore(meta.title || ""));
    const paras = buildFlowParagraphs(segments);

    const md = [];
    md.push(buildFrontmatter(meta, url, exportedAt));

    md.push(`# ${CleanTitle}`);
    md.push("");

    const baseUrl = baseWatchUrl(videoId);
    md.push(`![${CleanTitle}](${baseUrl})`);
    md.push("");

    if (meta.description) {
      md.push("## Description");
      md.push("");
      md.push(String(meta.description).trim());
      md.push("");
    }

    md.push("## Transcript");
    md.push("");

    for (const p of paras) {
      let line = p.text;
      if (CFG.includeTimestampsInYouTube) {
        const sec = Math.floor((p.startMs || 0) / 1000);
        const ts = formatHMS(sec);
        const link = `[${ts}](${baseUrl}&t=${sec}s)`;
        line = `${link} ${line}`;
      }
      md.push(line);
      md.push("");
    }

    return md.join("\n").trimEnd() + "\n";
  }
  // =========================
  // Transcript TXT (no Markdown, no links)
  // =========================
  function buildTranscriptTxt(videoId, meta, segments) {
    const channel = normalizeSpaces(meta?.channel || "") || "YouTube";
    const title = normalizeSpaces(meta?.title || "") || "Untitled";
    const url = baseWatchUrl(videoId);

    const uploadYmd = publishDateToYMD(meta?.publishDate) || "";
    const uploadLine = uploadYmd ? `Upload Date: ${uploadYmd}` : "";

    const paras = buildFlowParagraphs(segments);
    const body = [];
    for (const p of paras) {
      const line = normalizeSpaces(p.text || "");
      if (!line) continue;
      const sec = Math.floor((p.startMs || 0) / 1000);
      const ts = formatHMS(sec);
      body.push(`${ts} ${line}`);
      body.push(""); // blank line between paragraphs
    }
    // trim trailing blank
    while (body.length && !String(body[body.length - 1]).trim()) body.pop();

    const head = [channel, title, url];
    if (uploadLine) head.push(uploadLine);

    return `${head.join("\n")}\n\n${body.join("\n")}`.trimEnd() + "\n";
  }


  // =========================
  // MarkdownLocal derived from MarkdownYoutube (for .md downloads)
  // =========================
  function secondsToTStamp(sec) {
    const s = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    if (h > 0) return `${pad2(h)}:${pad2(m)}:${pad2(r)}`;
    return `${pad2(m)}:${pad2(r)}`;
  }

  function buildLocalTimestampLink(richTitle, sec) {
    const ts = secondsToTStamp(sec);
    return `[[${richTitle}.mp4#t=${ts}|${ts}]]`;
  }

  function convertYoutubeMdToLocal(mdYt, richTitle, videoId) {
    const lines = String(mdYt || "").replace(/\r/g, "").split("\n");
    const out = [];

    const baseUrl = baseWatchUrl(videoId);
    const baseEsc = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const mediaRe = new RegExp("^!\\[[^\\]]*\\]\\(" + baseEsc + "\\)\\s*$");
    const tsRe = new RegExp("^\\[(\\d{2}:\\d{2}:\\d{2})\\]\\(" + baseEsc + "&t=(\\d+)s\\)\\s+(.*)$");

    let replacedMedia = false;

    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];

      if (!replacedMedia && mediaRe.test(ln.trim())) {
        out.push(`![[${richTitle}.mp4]]`);
        replacedMedia = true;
        continue;
      }

      const m = ln.match(tsRe);
      if (m) {
        const sec = Number(m[2]);
        const rest = m[3] || "";
        const localLink = buildLocalTimestampLink(richTitle, sec);
        out.push(`${localLink} ${rest}`);
        continue;
      }

      out.push(ln);
    }

    return out.join("\n").trimEnd() + "\n";
  }

  // =========================
  // VTT export
  // =========================
  function fmtVttTime(ms) {
    const t = Math.max(0, Math.floor(ms || 0));
    const h = Math.floor(t / 3600000);
    const m = Math.floor((t % 3600000) / 60000);
    const s = Math.floor((t % 60000) / 1000);
    const mm = t % 1000;
    const pad = (n, w) => String(n).padStart(w, "0");
    return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}.${pad(mm, 3)}`;
  }

  function buildVtt(segments) {
    if (!segments?.length) return "WEBVTT\n\n";
    const cues = [];
    for (let i = 0; i < segments.length; i++) {
      const cur = segments[i];
      const next = segments[i + 1];
      const start = Number(cur.tMs || 0);
      let end = next ? Number(next.tMs || 0) : start + CFG.vttDefaultCueTailMs;
      if (end - start < CFG.vttMinCueDurMs) end = start + CFG.vttMinCueDurMs;
      cues.push(`${fmtVttTime(start)} --> ${fmtVttTime(end)}\n${cur.text}`);
    }
    return "WEBVTT\n\n" + cues.join("\n\n") + "\n";
  }


  // =========================
  // SRT export
  // =========================
  function fmtSrtTime(ms) {
    const t = Math.max(0, Math.floor(ms || 0));
    const h = Math.floor(t / 3600000);
    const m = Math.floor((t % 3600000) / 60000);
    const s = Math.floor((t % 60000) / 1000);
    const mm = t % 1000;
    const pad = (n, w) => String(n).padStart(w, "0");
    return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)},${pad(mm, 3)}`;
  }

  function buildSrt(segments) {
    if (!segments?.length) return "";
    const cues = [];
    for (let i = 0; i < segments.length; i++) {
      const cur = segments[i];
      const next = segments[i + 1];
      const start = Number(cur.tMs || 0);
      let end = next ? Number(next.tMs || 0) : start + CFG.vttDefaultCueTailMs;
      if (end - start < CFG.vttMinCueDurMs) end = start + CFG.vttMinCueDurMs;

      const idx = i + 1;
      cues.push(`${idx}\n${fmtSrtTime(start)} --> ${fmtSrtTime(end)}\n${String(cur.text || "").trim()}`);
    }
    return cues.join("\n\n") + "\n";
  }

// =========================
  // Fallback: capture youtubei get_transcript (kept)
  // =========================
  function findSegmentsAggressive(obj) {
    const out = [];
    const seen = new Set();

    function add(tMs, text) {
      const t = Number(tMs || 0);
      const s = String(text || "").replace(/\s+/g, " ").trim();
      if (!s) return;
      out.push({ tMs: t, text: s });
    }

    function walk(n) {
      if (!n || typeof n !== "object") return;
      if (seen.has(n)) return;
      seen.add(n);

      const tcr = n.transcriptCueRenderer;
      if (tcr?.cue?.simpleText != null) add(tcr.startOffsetMs, tcr.cue.simpleText);
      if (tcr?.cue?.runs && Array.isArray(tcr.cue.runs)) {
        const txt = tcr.cue.runs.map(r => r.text || "").join("");
        add(tcr.startOffsetMs, txt);
      }

      for (const k of Object.keys(n)) walk(n[k]);
    }

    walk(obj);
    out.sort((a, b) => a.tMs - b.tMs);

    const dedup = [];
    const set = new Set();
    for (const x of out) {
      const k = `${x.tMs}|${x.text}`;
      if (set.has(k)) continue;
      set.add(k);
      dedup.push(x);
    }
    return dedup;
  }

  function findContinuationToken(obj) {
    const seen = new Set();
    let token = null;

    function walk(n) {
      if (!n || typeof n !== "object" || token) return;
      if (seen.has(n)) return;
      seen.add(n);

      const t =
        n?.continuationCommand?.token ||
        n?.continuationEndpoint?.continuationCommand?.token ||
        n?.nextContinuationData?.continuation ||
        n?.continuation ||
        null;

      if (typeof t === "string" && t.length > 12) { token = t; return; }
      for (const k of Object.keys(n)) walk(n[k]);
    }

    walk(obj);
    return token;
  }

  function maybeCapture(url, status, json, via) {
    try {
      if (!String(url).includes("/youtubei/v1/get_transcript")) return;

      const videoId = getVideoId();
      const segs = findSegmentsAggressive(json);
      const token = findContinuationToken(json);

      if (STATE.lastVideoId && STATE.lastVideoId !== videoId) resetState("capture video switch");
      if (token) STATE.lastToken = token;
      if (segs.length) STATE.lastSegments = segs;
      STATE.lastVideoId = videoId;

      pushCapture({ t: Date.now(), via, status, url: String(url), json, segCount: segs.length, hasToken: !!token, videoId });
      log("captured", { via, status, videoId, segCount: segs.length, hasToken: !!token });
    } catch (e) {
      warn("capture error", e);
    }
  }

  (function hookFetch() {
    const orig = window.fetch;
    if (typeof orig !== "function") return;

    window.fetch = async function (input, init) {
      const url = typeof input === "string" ? input : (input && input.url) ? input.url : "";
      const p = orig.apply(this, arguments);

      if (String(url).includes("/youtubei/v1/get_transcript")) {
        p.then(async (res) => {
          try {
            const clone = res.clone();
            const txt = await clone.text();
            if (!txt || !txt.trim()) return;
            const json = JSON.parse(txt);
            maybeCapture(url, res.status, json, "fetch");
          } catch (e) {
            warn("fetch capture failed", e);
          }
        }).catch(() => {});
      }
      return p;
    };

    log("fetch hook active");
  })();

  (function hookXHR() {
    const XHR = window.XMLHttpRequest;
    if (!XHR) return;

    const oOpen = XHR.prototype.open;
    const oSend = XHR.prototype.send;

    XHR.prototype.open = function (method, url) {
      this.__ytobs_url = url;
      return oOpen.apply(this, arguments);
    };

    XHR.prototype.send = function () {
      try {
        this.addEventListener("load", () => {
          const url = String(this.__ytobs_url || "");
          if (!url.includes("/youtubei/v1/get_transcript")) return;
          const txt = this.responseText;
          if (!txt || !String(txt).trim()) return;
          try {
            const json = JSON.parse(txt);
            maybeCapture(url, this.status, json, "xhr");
          } catch (e) {
            warn("xhr json parse failed", e);
          }
        });
      } catch (_) {}
      return oSend.apply(this, arguments);
    };

    log("xhr hook active");
  })();

  async function getSegmentsOrThrow(videoId) {
    const domSegs = extractSegmentsFromDom();
    if (domSegs?.length) return domSegs;

    if (STATE.lastVideoId && STATE.lastVideoId !== videoId) resetState("video switch");
    STATE.lastVideoId = videoId;

    if (STATE.lastSegments?.length) return STATE.lastSegments;

    const cap = [...STATE.captures].reverse().find(c => c.videoId === videoId && c.status === 200 && c.json);
    if (cap?.json) {
      const segs = findSegmentsAggressive(cap.json);
      if (segs.length) {
        STATE.lastSegments = segs;
        return segs;
      }
      const token = findContinuationToken(cap.json);
      if (token) STATE.lastToken = token;
    }

    throw new Error(noTranscriptHint("Transcript segments are currently not available. Open the transcript panel and wait until segments appear."));
  }

  async function getSegmentsForQuoteOrThrow(videoId) {
    // a) DOM
    let domSegs = extractSegmentsFromDom();
    if (domSegs?.length) { STATE.lastSegments = domSegs; STATE.lastVideoId = videoId; return domSegs; }

    // b) cache (youtubei hook)
    if (STATE.lastVideoId && STATE.lastVideoId !== videoId) resetState("quote video switch");
    STATE.lastVideoId = videoId;

    if (STATE.lastSegments?.length) return STATE.lastSegments;

    // c) on-demand: temporarily open transcript panel and retry DOM
    const wasShown = isTranscriptShown();
    try {
      setTranscriptShown(true);
      uiApplyShowHideStyle();
      await showTranscriptPanel();
      await sleep(AFTER_SHOW_DELAY_MS);

      domSegs = extractSegmentsFromDom();
      if (domSegs?.length) { STATE.lastSegments = domSegs; return domSegs; }

      // allow hook-capture to land if it is mid-flight
      await sleep(240);
      if (STATE.lastSegments?.length) return STATE.lastSegments;

      throw new Error(noTranscriptHint("Transcript segments currently not available. This video may not offer a transcript."));
    } finally {
      if (!wasShown) {
        try { await hideTranscriptPanel(); } catch (_) {}
        setTranscriptShown(false);
        uiApplyShowHideStyle();
      }
    }
  }

  // =========================
  // Comments feature (threaded clipboard builder)
  // =========================
  function getTabCommentsBuffer() {
    try { return sessionStorage.getItem(CFG.commentsTabKey) || ""; } catch { return ""; }
  }
  function setTabCommentsBuffer(v) {
    try { sessionStorage.setItem(CFG.commentsTabKey, String(v || "")); } catch {}
  }

  function selectionText() {
    try {
      const sel = window.getSelection();
      const t = sel ? sel.toString() : "";
      return String(t || "");
    } catch {
      return "";
    }
  }

  function firstNonEmptyLine(s) {
    return String(s || "")
      .split(/\r?\n/)
      .map(x => x.trim())
      .find(x => !!x) || "";
  }

  function isCommentsClipboard(text) {
    return firstNonEmptyLine(text) === CFG.commentsHeader;
  }

  function getNextThreadIndex(existing) {
    const t = String(existing || "");
    let max = 0;
    const re = /###\s*Thread\s+(\d+)/gi;
    let m;
    while ((m = re.exec(t)) !== null) {
      const n = Number(m[1]);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
    return max + 1;
  }

  function isBlacklistLine(line) {
    const l = normalizeSpaces(line).toLowerCase();
    if (!l) return false;
    for (const w of CFG.commentsBlacklist) {
      if (l === String(w).toLowerCase()) return true;
    }
    return false;
  }

  function isRepliesCountLine(line) {
    const l = normalizeSpaces(line);
    if (!l) return false;
    if (/^\d+\s+Antworten$/i.test(l)) return true;
    if (/^\d+\s+replies$/i.test(l)) return true;
    if (/^\d+\s+reply$/i.test(l)) return true;
    if (/^\d+\s+Antwort$/i.test(l)) return true;
    return false;
  }

  function approxDateFromRelative(relRaw) {
    const rel = normalizeSpaces(relRaw || "").toLowerCase();
    if (!rel) return null;

    const now = new Date();

    let m = rel.match(/^vor\s+(\d+)\s+(minute|minuten|stunde|stunden|tag|tage|woche|wochen|monat|monate|jahr|jahre)\b/);
    if (!m) m = rel.match(/^(\d+)\s+(minute|minuten|stunde|stunden|tag|tage|woche|wochen|monat|monate|jahr|jahre)\b/);

    if (m) {
      const n = Number(m[1]);
      const unit = m[2];
      if (!Number.isFinite(n) || n < 0) return null;

      const d = new Date(now.getTime());
      if (unit.startsWith("minute")) d.setMinutes(d.getMinutes() - n);
      else if (unit.startsWith("stunde")) d.setHours(d.getHours() - n);
      else if (unit.startsWith("tag")) d.setDate(d.getDate() - n);
      else if (unit.startsWith("woche")) d.setDate(d.getDate() - (n * 7));
      else if (unit.startsWith("monat")) d.setMonth(d.getMonth() - n);
      else if (unit.startsWith("jahr")) d.setFullYear(d.getFullYear() - n);
      return formatDDMMYYYY(d);
    }

    m = rel.match(/^(\d+)\s+(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+ago\b/);
    if (m) {
      const n = Number(m[1]);
      const unit = m[2];
      if (!Number.isFinite(n) || n < 0) return null;

      const d = new Date(now.getTime());
      if (unit.startsWith("minute")) d.setMinutes(d.getMinutes() - n);
      else if (unit.startsWith("hour")) d.setHours(d.getHours() - n);
      else if (unit.startsWith("day")) d.setDate(d.getDate() - n);
      else if (unit.startsWith("week")) d.setDate(d.getDate() - (n * 7));
      else if (unit.startsWith("month")) d.setMonth(d.getMonth() - n);
      else if (unit.startsWith("year")) d.setFullYear(d.getFullYear() - n);
      return formatDDMMYYYY(d);
    }

    return null;
  }

  function looksLikeRelativeTimeLine(line) {
    const l = normalizeSpaces(line || "");
    if (!l) return false;
    if (/^vor\s+\d+\s+\S+/i.test(l)) return true;
    if (/^\d+\s+\S+\s+ago/i.test(l)) return true;
    if (/^vor\s+\d+\s+(minute|minuten|stunde|stunden|tag|tage|woche|wochen|monat|monate|jahr|jahre)\b/i.test(l)) return true;
    return false;
  }

  function sanitizeAndBuildCommentsBlock(rawSelection) {
    const raw = String(rawSelection || "");
    if (!raw.trim()) return { ok: false, text: "", reason: "Empty selection." };

    const lines0 = raw.replace(/\r/g, "").split("\n").map(l => l.replace(/\u00A0/g, " "));

    const lines1 = [];
    for (const ln of lines0) {
      const t = ln.trim();
      if (!t) { lines1.push(""); continue; }
      if (isBlacklistLine(t)) continue;
      if (isRepliesCountLine(t)) continue;
      lines1.push(t);
    }

    const blocks = [];
    let cur = null;

    function flush() {
      if (!cur) return;
      if (cur.handle && cur.handle.startsWith("@")) blocks.push(cur);
      cur = null;
    }

    for (let i = 0; i < lines1.length; i++) {
      const line = lines1[i];

      if (line && line.startsWith("@")) {
        flush();
        const handle = normalizeSpaces(line);
        cur = { handle, rel: "", body: [], likes: null };
        continue;
      }

      if (!cur) continue;

      if (/^\d+$/.test(line)) {
        cur.likes = Number(line);
        continue;
      }

      if (!cur.rel && looksLikeRelativeTimeLine(line)) {
        cur.rel = normalizeSpaces(line);
        continue;
      }

      if (line !== "") cur.body.push(line);
    }
    flush();

    if (!blocks.length) return { ok: false, text: "", reason: "No @handle blocks detected." };

    const out = [];
    for (const b of blocks) {
      const ca = b.rel ? approxDateFromRelative(b.rel) : null;
      const head = ca ? `${b.handle} *(ca. ${ca})*` : `${b.handle}`;
      out.push(head);

      const bodyLines = b.body.map(x => normalizeSpaces(x)).filter(x => !!x);
      if (bodyLines.length) out.push(...bodyLines);

      if (Number.isFinite(b.likes) && b.likes > 0) out.push(`❤︎ ${b.likes}`);

      out.push("");
    }

    const collapsed = [];
    for (const ln of out) {
      const isBlank = !String(ln).trim();
      const prevBlank = collapsed.length ? !String(collapsed[collapsed.length - 1]).trim() : false;
      if (isBlank && prevBlank) continue;
      collapsed.push(ln);
    }
    while (collapsed.length && !String(collapsed[collapsed.length - 1]).trim()) collapsed.pop();

    const text = collapsed.join("\n").trim();
    if (!text) return { ok: false, text: "", reason: "Sanitized output empty." };
    return { ok: true, text };
  }

  async function overwriteCommentsClipboardNewBeginnings() {
    const s = "(new beginnings)";
    await writeClipboard(s);
    setTabCommentsBuffer(s);
  }

  async function appendSelectionAsNewThread() {
    const selected = selectionText().trim();

    if (!selected) {
      await overwriteCommentsClipboardNewBeginnings();
      return { ok: true, action: "cleared" };
    }

    let existing = "";
    let readOk = false;
    try {
      existing = await readClipboardText();
      readOk = true;
    } catch (_) {
      existing = getTabCommentsBuffer();
      readOk = false;
    }

    const sanitized = sanitizeAndBuildCommentsBlock(selected);
    if (!sanitized.ok) return { ok: false, reason: sanitized.reason };

    const hasStruct = isCommentsClipboard(existing);
    const idx = hasStruct ? getNextThreadIndex(existing) : 1;

    const threadHeader = `### Thread ${idx}`;
    const threadBlock = `${threadHeader}\n\n${sanitized.text}`;

    let out = "";
    if (!hasStruct) out = `${CFG.commentsHeader}\n\n${threadBlock}\n`;
    else out = String(existing).trimEnd() + `\n\n${threadBlock}\n`;

    await writeClipboard(out);
    setTabCommentsBuffer(out);
    return { ok: true, action: "appended", usedClipboardRead: readOk, threadIndex: idx };
  }



  // =========================
  // Export action wrappers (preparation layer)
  // =========================
  async function actionCopyYoutubeMarkdownToClipboard(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);
    const mdYt = buildMarkdownYoutube(videoId, meta, segs);
    await writeClipboard(mdYt);
  }

  async function actionDownloadLocalMd(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);

    const mdYt = buildMarkdownYoutube(videoId, meta, segs);
    const rich = buildRichTitle(meta, videoId);

    try { await writeClipboard(rich); } catch (_) {}

    const mdLocal = convertYoutubeMdToLocal(mdYt, rich, videoId);
    downloadText(`${rich}.md`, mdLocal, "text/markdown;charset=utf-8");
  }

  async function actionDownloadVtt(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);
    const vtt = buildVtt(segs);

    const rich = buildRichTitle(meta, videoId);

    try { await writeClipboard(rich); } catch (_) {}

    downloadText(`${rich}.vtt`, vtt, "text/vtt;charset=utf-8");
  }


  async function actionDownloadSrt(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);
    const srt = buildSrt(segs);

    const rich = buildRichTitle(meta, videoId);

    try { await writeClipboard(rich); } catch (_) {}

    downloadText(`${rich}.srt`, srt, "application/x-subrip;charset=utf-8");
  }

  async function actionDownloadLocalMdAndVtt(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);

    const mdYt = buildMarkdownYoutube(videoId, meta, segs);
    const rich = buildRichTitle(meta, videoId);

    try { await writeClipboard(rich); } catch (_) {}

    const mdLocal = convertYoutubeMdToLocal(mdYt, rich, videoId);
    const vtt = buildVtt(segs);

    downloadText(`${rich}.md`, mdLocal, "text/markdown;charset=utf-8");
    await sleep(80);
    downloadText(`${rich}.vtt`, vtt, "text/vtt;charset=utf-8");
  }


  async function actionDownloadYoutubeMd(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);

    const mdYt = buildMarkdownYoutube(videoId, meta, segs);
    const rich = buildRichTitle(meta, videoId);

    try { await writeClipboard(rich); } catch (_) {}

    downloadText(`${rich} YT.md`, mdYt, "text/markdown;charset=utf-8");
  }

  async function actionDownloadTranscriptTxt(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);

    const txt = buildTranscriptTxt(videoId, meta, segs);
    const rich = buildRichTitle(meta, videoId);

    try { await writeClipboard(rich); } catch (_) {}

    downloadText(`${rich}.txt`, txt, "text/plain;charset=utf-8");
  }

  async function actionDownloadTranscriptRtf(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);

    const rtf = buildTranscriptRtf(videoId, meta, segs);
    const rich = buildRichTitle(meta, videoId);

    try { await writeClipboard(rich); } catch (_) {}

    downloadText(`${rich}.rtf`, rtf, "application/rtf;charset=utf-8");
  }

  async function actionDownloadCurrentFramePng(videoId) {
    const meta = getDomMeta();
    const rich = buildRichTitle(meta, videoId);
    const blob = await captureCurrentFramePngBlob();
    downloadBlob(`${rich} Frame.png`, blob);
  }

  async function actionDownloadThumbnailPng(videoId) {
    const meta = getDomMeta();
    const rich = buildRichTitle(meta, videoId);
    const blob = await fetchThumbnailPngBlob(videoId);
    downloadBlob(`${rich} Thumbnail.png`, blob);
  }

  async function actionCopyTranscriptTxtToClipboard(videoId) {
    const meta = getDomMeta();
    const segs = await getSegmentsOrThrow(videoId);
    const txt = buildTranscriptTxt(videoId, meta, segs);
    await writeClipboard(txt);
  }
  async function actionOpenSaveHostInNewTab() {
    const u = new URL(location.href);
    u.hostname = SAVE_DOWNLOAD_HOST;

    const meta = getDomMeta();
    const vid = getVideoId();
    if (vid) {
      const rich = buildRichTitle(meta, vid);
      try { await writeClipboard(rich); } catch (_) {}
    }

    window.open(u.toString(), "_blank", "noopener,noreferrer");
  }

  // =========================
  // Save Modal (multi-export controller)
  // =========================
  function getDefaultExportProfile() {
    return {
      mdLocal: false,
      mdYoutube: false,
      txt: false,
      rtf: false,
      vtt: false,
      srt: false,
      framePng: false,
      thumbPng: false,
      openLink: false,
    };
  }

  function readExportProfileOrDefault() {
    const p = getExportProfile();
    const d = getDefaultExportProfile();
    if (!p || typeof p !== "object") return d;
    return {
      mdLocal: !!p.mdLocal,
      mdYoutube: !!p.mdYoutube,
      txt: !!p.txt,
      rtf: !!p.rtf,
      vtt: !!p.vtt,
      srt: !!p.srt,
      framePng: !!p.framePng,
      thumbPng: !!p.thumbPng,
      openLink: !!p.openLink,
    };
  }

  function openSaveModal() {
    omvRemoveById(UI.saveModalId);

    const overlay = omvMakeOverlay(UI.saveModalId);
    const box = omvMakeModalBox();

    const title = document.createElement("div");
    title.textContent = "Select Files to Download";
    title.style.fontSize = "16px";
    title.style.fontWeight = "700";
    title.style.marginBottom = "22px";

    const profile = readExportProfileOrDefault();

    const options = [
      { key: "mdLocal", label: "Markdown with Obsidian Timestamps (.md)" },
      { key: "mdYoutube", label: "Markdown with YouTube Timestamps (.md)" },
      { key: "txt", label: "Plain Text Transcript (.txt)" },
      { key: "rtf", label: "Rich Text Transcript (.rtf)" },
      { key: "vtt", label: "Subtitles (.vtt)" },
      { key: "srt", label: "Subtitles (.srt)" },
      { key: "framePng", label: "Current Playback Frame (.png)" },
      { key: "thumbPng", label: "Video Thumbnail (.png)" },
      { key: "openLink", label: "Media Download (Options in New Tab)" },
    ];

    const list = document.createElement("div");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "10px";
    list.style.marginBottom = "22px";
    list.style.marginRight = "33px";

    const cbs = {};

    function makeRow(opt) {
      const row = document.createElement("label");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "10px";
      row.style.cursor = "pointer";
      row.style.userSelect = "none";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!profile[opt.key];
      cb.style.transform = "scale(1.05)";
      cb.style.cursor = "pointer";

      cbs[opt.key] = cb;

      const tx = document.createElement("div");
      tx.textContent = opt.label;
      tx.style.opacity = "0.92";

      cb.addEventListener("change", () => {
        profile[opt.key] = !!cb.checked;
        setExportProfile(profile);
      });

      row.appendChild(cb);
      row.appendChild(tx);
      return row;
    }

    for (const opt of options) list.appendChild(makeRow(opt));

    const footer = document.createElement("div");
    footer.style.display = "flex";
    footer.style.alignItems = "center";
    footer.style.gap = "10px";
    footer.style.marginTop = "8px";

    const footerLeft = document.createElement("div");
    footerLeft.style.display = "flex";
    footerLeft.style.alignItems = "center";
    footerLeft.style.gap = "8px";

    const footerRight = document.createElement("div");
    footerRight.style.display = "flex";
    footerRight.style.alignItems = "center";
    footerRight.style.gap = "8px";
    footerRight.style.marginLeft = "auto";

    const btnSelectAll = document.createElement("button");
    btnSelectAll.textContent = "Select All";
    applyButtonStyle(btnSelectAll);
    btnSelectAll.style.height = "28px";

    const btnDeselectAll = document.createElement("button");
    btnDeselectAll.textContent = "Deselect All";
    applyButtonStyle(btnDeselectAll);
    btnDeselectAll.style.height = "28px";

    const btnSave = document.createElement("button");
    btnSave.textContent = "Save";
    applyButtonStyle(btnSave);
    btnSave.style.height = "28px";

    btnSelectAll.onclick = () => {
      for (const opt of options) {
        profile[opt.key] = true;
        if (cbs[opt.key]) cbs[opt.key].checked = true;
      }
      setExportProfile(profile);
    };

    btnDeselectAll.onclick = () => {
      for (const opt of options) {
        profile[opt.key] = false;
        if (cbs[opt.key]) cbs[opt.key].checked = false;
      }
      setExportProfile(profile);
    };

    function close() { omvRemoveById(UI.saveModalId); }
    omvAddCloseX(box, close);

    btnSave.onclick = async () => {
      try {
        uiFlashButton(UI.btnSaveId);
        close();

        const vid = getVideoId();
        if (!vid) throw new Error("No video ID.");

        // prepare transcript availability if any export/copy needs it
        const needsTranscript = !!(profile.mdLocal || profile.mdYoutube || profile.txt || profile.rtf || profile.vtt || profile.srt);
        if (needsTranscript) {
          setTranscriptShown(true);
          uiApplyShowHideStyle();
          await showTranscriptPanel();
          await sleep(AFTER_SHOW_DELAY_MS);
        }

        // Deterministic order:
        // 1) Open link (save host) first (popup blocker friendliness)
        if (profile.openLink) await actionOpenSaveHostInNewTab();

        // 2) Markdown Offline
        if (profile.mdLocal) await actionDownloadLocalMd(vid);

        // 3) Markdown YouTube
        if (profile.mdYoutube) await actionDownloadYoutubeMd(vid);

        // 4) Transcript TXT
        if (profile.txt) await actionDownloadTranscriptTxt(vid);

        // 4b) Transcript RTF
        if (profile.rtf) await actionDownloadTranscriptRtf(vid);

        // 4c) Current Frame PNG
        if (profile.framePng) await actionDownloadCurrentFramePng(vid);

        // 4d) Thumbnail PNG
        if (profile.thumbPng) await actionDownloadThumbnailPng(vid);

        // 5) Subtitles VTT
        if (profile.vtt) await actionDownloadVtt(vid);

        // 6) Subtitles SRT
        if (profile.srt) await actionDownloadSrt(vid);
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      } finally {
        uiApplyShowHideStyle();
      }
    };

    footerLeft.appendChild(btnSelectAll);
    footerLeft.appendChild(btnDeselectAll);
    footerRight.appendChild(btnSave);

    footer.appendChild(footerLeft);
    footer.appendChild(footerRight);

    box.appendChild(title);
    box.appendChild(list);
    box.appendChild(footer);

    overlay.appendChild(box);
    omvWireOutsideClickClose(overlay, close);
    document.body.appendChild(overlay);
  }


  // =========================
  // Copy Modal (single-select)
  // =========================
  function openCopyModal() {
    omvRemoveById(UI.copyModalId);

    const overlay = omvMakeOverlay(UI.copyModalId);
    const box = omvMakeModalBox();

    const title = document.createElement("div");
    title.textContent = "Select Content to Copy";
    title.style.fontSize = "16px";
    title.style.fontWeight = "700";
    title.style.marginBottom = "22px";

    const options = [
      { key: "txt", label: "Plain Text Transcript" },
      { key: "framePng", label: "Current Playback Frame (.png)" },
      { key: "thumbPng", label: "Video Thumbnail (.png)" },
    ];

    const list = document.createElement("div");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "10px";
    list.style.marginBottom = "22px";
    list.style.marginRight = "33px";


    const persisted = getCopySelection();

    const selectedKey = { v: (persisted && options.some(o => o.key === persisted)) ? persisted : options[0].key };
    if (!persisted) setCopySelection(selectedKey.v);

    // default selection (persistent)
    function makeRow(opt) {
      const row = document.createElement("label");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "10px";
      row.style.cursor = "pointer";
      row.style.userSelect = "none";

      const rb = document.createElement("input");
      rb.type = "radio";
      rb.name = "omv_copy_select";
      rb.checked = opt.key === selectedKey.v;
      rb.style.transform = "scale(1.05)";
      rb.style.cursor = "pointer";

      const tx = document.createElement("div");
      tx.textContent = opt.label;
      tx.style.opacity = "0.92";

      rb.addEventListener("change", () => {
        if (rb.checked) {
          selectedKey.v = opt.key;
          setCopySelection(opt.key);
        }
      });

      row.addEventListener("mousedown", () => {
        selectedKey.v = opt.key;
        rb.checked = true;
        setCopySelection(opt.key);
      });

      row.appendChild(rb);
      row.appendChild(tx);
      return row;
    }

    for (const opt of options) list.appendChild(makeRow(opt));

    const footer = document.createElement("div");
    footer.style.display = "flex";
    footer.style.alignItems = "center";
    footer.style.gap = "10px";
    footer.style.marginTop = "8px";

    const footerRight = document.createElement("div");
    footerRight.style.display = "flex";
    footerRight.style.alignItems = "center";
    footerRight.style.gap = "8px";
    footerRight.style.marginLeft = "auto";

    const btnCopy = document.createElement("button");
    btnCopy.textContent = "Copy";
    applyButtonStyle(btnCopy);
    btnCopy.style.height = "28px";
    // Match width logic of Quote modal copy button
    (function () {
      try {
        const probe = document.createElement("span");
        probe.style.position = "fixed";
        probe.style.left = "-9999px";
        probe.style.top = "-9999px";
        probe.style.whiteSpace = "nowrap";
        probe.style.fontFamily = UI_STYLE.btnFont;
        probe.style.fontSize = `${UI_STYLE.btnFontSizePx}px`;
        probe.textContent = "Copy";
        document.body.appendChild(probe);
        const w = Math.ceil(probe.getBoundingClientRect().width);
        probe.remove();
        const padX = Number.parseInt(UI_STYLE.btnPadX, 10) || 10;
        const target = Math.max(54, w + padX * 2 + 6);
        btnCopy.style.width = `${target}px`;
      } catch (_) {
        btnCopy.style.width = "84px";
      }
    })();
    btnCopy.style.display = "flex";
    btnCopy.style.alignItems = "center";
    btnCopy.style.justifyContent = "center";
    btnCopy.style.justifyContent = "center";

    function close() { omvRemoveById(UI.copyModalId); }
    omvAddCloseX(box, close);

    btnCopy.onclick = async () => {
      btnCopy.disabled = true;

      // Dots-only animation: ".", "..", "..." (centered by button flex)
      const dots = [".", "..", "..."];
      let di = 0;
      const prevText = btnCopy.textContent;
      let tick = null;

      function stopAnim() {
        if (tick != null) {
          try { clearInterval(tick); } catch (_) {}
          tick = null;
        }
      }

      function startAnim() {
        stopAnim();
        btnCopy.textContent = dots[0];
        tick = setInterval(() => {
          try {
            di = (di + 1) % dots.length;
            btnCopy.textContent = dots[di];
          } catch (_) {}
        }, 260);
      }

      startAnim();

      try {
        uiFlashButton(UI.btnCopyId);

        const vid = getVideoId();
        if (!vid) throw new Error("No video ID.");

        // Scroll to top for structural consistency
        try { window.scrollTo(0, 0); } catch (_) {}

        const k = String(selectedKey.v || "");
        if (k === "framePng") {
          const blob = await captureCurrentFramePngBlob();
          await writeClipboardImagePng(blob);
        } else if (k === "thumbPng") {
          const blob = await fetchThumbnailPngBlob(vid);
          await writeClipboardImagePng(blob);
        } else {
          // transcript-dependent actions
          setTranscriptShown(true);
          uiApplyShowHideStyle();
          await showTranscriptPanel();
          await sleep(AFTER_SHOW_DELAY_MS);

          const meta = getDomMeta();
          const segs = await getSegmentsOrThrow(vid);

          const txt = buildTranscriptTxt(vid, meta, segs);
          await writeClipboard(txt);
        }

        stopAnim();
        btnCopy.textContent = "✓";
        await sleep(450);
        close();
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      } finally {
        stopAnim();
        btnCopy.disabled = false;
        btnCopy.textContent = prevText;
        uiApplyShowHideStyle();
      }
    };

    footerRight.appendChild(btnCopy);
    footer.appendChild(footerRight);

    box.appendChild(title);
    box.appendChild(list);
    box.appendChild(footer);

    overlay.appendChild(box);
    omvWireOutsideClickClose(overlay, close);
    document.body.appendChild(overlay);
  }

// =========================
  // UI
  // =========================
  const UI = {
    barId: "omv_bar",
    btnCopyId: "omv_btn_copy",
    btnMdId: "omv_btn_md",
    btnVttId: "omv_btn_vtt",
    btnBothId: "omv_btn_both",
    btnQuoteId: "omv_btn_quote",
    btnSaveId: "omv_btn_save",
    btnShowHideId: "omv_btn_showhide",
    btnCommentsId: "omv_btn_comments",
    quoteModalId: "omv_quote_modal",
    saveModalId: "omv_save_modal",
    copyModalId: "omv_copy_modal",
    labels: new Map(),
    toastTimers: new Map(),
  };

  let TRANSCRIPT_ACTION_LOCK = false;
  let QUOTE_ACTION_LOCK = false;

  function uiResetButtons() {
    for (const [id, label] of UI.labels.entries()) {
      const b = document.getElementById(id);
      if (b) b.textContent = label;
    }
    uiApplyShowHideStyle();
  }

  function uiToast(btnId, symbol) {
    const b = document.getElementById(btnId);
    if (!b) return;
    if (btnId !== UI.btnCopyId && btnId !== UI.btnCommentsId && btnId !== UI.btnQuoteId) return;

    const original = UI.labels.get(btnId) || b.textContent || "";
    b.textContent = symbol || original;

    if (UI.toastTimers.has(btnId)) clearTimeout(UI.toastTimers.get(btnId));
    UI.toastTimers.set(btnId, setTimeout(() => {
      const bb = document.getElementById(btnId);
      if (bb) bb.textContent = UI.labels.get(btnId) || "";
      UI.toastTimers.delete(btnId);
    }, CFG.toastMs));
  }

  function setBusy(btnId, on) {
    const b = document.getElementById(btnId);
    if (!b) return;
    b.disabled = !!on;
    b.style.opacity = on ? "0.78" : "1";
  }

  function setFixedButtonWidths(buttonIds, extraPx = 3) {
    requestAnimationFrame(() => {
      try {
        const ctx = document.createElement("span");
        ctx.style.position = "fixed";
        ctx.style.left = "-9999px";
        ctx.style.top = "-9999px";
        ctx.style.whiteSpace = "nowrap";
        ctx.style.fontFamily = UI_STYLE.btnFont;
        ctx.style.fontSize = `${UI_STYLE.btnFontSizePx}px`;
        document.body.appendChild(ctx);

        for (const id of buttonIds) {
          const b = document.getElementById(id);
          if (!b) continue;
          const label = UI.labels.get(id) || b.textContent || "";
          ctx.textContent = label;
          const w = Math.ceil(ctx.getBoundingClientRect().width);
          const fixed = Math.max(54, w + 26 + extraPx);
          b.style.width = fixed + "px";
        }
        ctx.remove();
      } catch (e) {
        warn("width lock failed", e);
      }
    });
  }

  function ensureUI() {
    if (document.getElementById('omv_bar')) return;
    if (!document.body) return;

    const bar = document.createElement("div");
    bar.id = UI.barId;
    applyBarStyle(bar);

    const mkBtn = (label, id) => {
      const b = document.createElement("button");
      b.id = id;
      b.textContent = label;
      applyButtonStyle(b);
      UI.labels.set(id, label);
      return b;
    };

    const btnCopy = mkBtn("Copy", UI.btnCopyId);
    const btnSave = mkBtn("Save", UI.btnSaveId);
    const btnQuote = mkBtn("Quote", UI.btnQuoteId);

    bar.appendChild(btnCopy);
    bar.appendChild(btnSave);
    bar.appendChild(btnQuote);

    let btnComments = null;
    if (ENABLE_COMMENTS_BUTTON) {
      btnComments = mkBtn("Comments", UI.btnCommentsId);
      bar.appendChild(btnComments);
    }

    const btnShowHide = mkBtn("On / Off", UI.btnShowHideId);
    // Visual group separation before On/Off
    btnShowHide.style.marginLeft = "18px";
    bar.appendChild(btnShowHide);
    document.body.appendChild(bar);

        const widthIds = [UI.btnCopyId, UI.btnSaveId, UI.btnQuoteId];
    if (ENABLE_COMMENTS_BUTTON) widthIds.push(UI.btnCommentsId);
    widthIds.push(UI.btnShowHideId);
    setFixedButtonWidths(widthIds, 3);

    wireUI();
  }

  async function runWithDelayedError(fn) {
    try {
      return await fn();
    } catch (e) {
      await sleep(ERROR_CHECK_DELAY_MS);
      throw e;
    }
  }

  function wireUI() {
    const btnCopy = document.getElementById(UI.btnCopyId);
    const btnSave = document.getElementById(UI.btnSaveId);
    const btnQuote = document.getElementById(UI.btnQuoteId);
    const btnComments = document.getElementById(UI.btnCommentsId);
    const btnShowHide = document.getElementById(UI.btnShowHideId);

    if (!btnCopy || !btnSave || !btnQuote || !btnShowHide) return;
    if (btnCopy.dataset.wired === "1") return;

    // wire Show/Hide (tab-isolated)
    wireShowHideButtonOnly();
    uiApplyShowHideStyle();

    btnSave.onclick = async () => {
      setBusy(UI.btnSaveId, true);
      try {
        try { window.scrollTo(0, 0); } catch (_) {}
        if (STOP_PLAYBACK_ON_SAVE) {
          const v = getActiveVideoEl();
          if (v) { try { v.pause(); } catch (_) {} }
        }
        openSaveModal();
} catch (e) {
        err(e);
        popupError(e?.message || String(e));
      } finally {
        setBusy(UI.btnSaveId, false);
      }
    };

    btnQuote.onclick = async () => {
      if (QUOTE_ACTION_LOCK) return;
      QUOTE_ACTION_LOCK = true;

      uiFlashButton(UI.btnQuoteId);
      setBusy(UI.btnQuoteId, true);

      try {
        try { window.scrollTo(0, 0); } catch (_) {}

        const vid = getVideoId();
        if (!vid) throw new Error("No video ID.");

        const v = getActiveVideoEl();
        if (!v) throw new Error("No active video element.");

        if (STOP_PLAYBACK_ON_QUOTE) {
          try { v.pause(); } catch (_) {}
        }

        const tNow = Number(v.currentTime || 0);
        const tEnd = tNow;
        const tStart = Math.max(0, tNow - 7);

        const meta = getDomMeta();
        const segs = await runWithDelayedError(async () => await getSegmentsForQuoteOrThrow(vid));

        const q = buildQuoteFromWindow(segs, tStart, tEnd);
        if (!q?.text) {
          if (CFG.errorPopup) popupError("Quote window empty.");
          return;
        }

        openQuoteModal({ videoId: vid, text: q.text, startSec: q.startSec, endSec: q.endSec, meta, segments: segs, tStartSec: tStart, tEndSec: tEnd });
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      } finally {
        setBusy(UI.btnQuoteId, false);
        QUOTE_ACTION_LOCK = false;
      }
    };
    if (btnComments) {
      btnComments.onclick = async () => {
      uiFlashButton(UI.btnCommentsId);
      setBusy(UI.btnCommentsId, true);
      try {
        const r = await appendSelectionAsNewThread();
        if (!r.ok) {
          if (CFG.errorPopup) popupError(r.reason || "Comments input invalid.");
          return;
        }
        if (r.action === "cleared") uiToast(UI.btnCommentsId, "✗");
        else uiToast(UI.btnCommentsId, "✓");
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      } finally {
        setBusy(UI.btnCommentsId, false);
      }
      };
    }

    async function doTranscriptAction(actionBtnId, actionFn, onSuccessToast) {
      if (TRANSCRIPT_ACTION_LOCK) return;
      TRANSCRIPT_ACTION_LOCK = true;

      setBusy(actionBtnId, true);
      uiFlashButton(actionBtnId);

      try {
        await runWithDelayedError(async () => {
          const vid = getVideoId();
          if (!vid) throw new Error("No video ID.");
          if (STATE.lastVideoId && STATE.lastVideoId !== vid) resetState("button video switch");

          setTranscriptShown(true);
          uiApplyShowHideStyle();

          await showTranscriptPanel();
          await sleep(AFTER_SHOW_DELAY_MS);

          await actionFn(vid);
        });

        if (onSuccessToast) uiToast(actionBtnId, "✓");
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      } finally {
        setBusy(actionBtnId, false);
        TRANSCRIPT_ACTION_LOCK = false;
        uiApplyShowHideStyle();
      }
    }

    btnCopy.onclick = async () => {
      try {
        try { window.scrollTo(0, 0); } catch (_) {}
        if (STOP_PLAYBACK_ON_COPY) {
          const v = getActiveVideoEl();
          if (v) { try { v.pause(); } catch (_) {} }
        }
        openCopyModal();
      } catch (e) {
        err(e);
        popupError(e?.message || String(e));
      }
    };

    btnCopy.dataset.wired = "1";
  }

  // =========================
  // Ensure transcript state on mount/navigate (tab-isolated persistence)
  // =========================
  async function applyPersistedTranscriptState() {
    if (!isTranscriptShown()) return;
    try { await showTranscriptPanel(); } catch (_) {}
  }

  // =========================
  // SPA navigation + UI mount
  // =========================
  function mount() {
    const isWatch = location.pathname === "/watch" || location.pathname.startsWith("/live/");
    const bar = document.getElementById('omv_bar');
    if (!isWatch) { if (bar) bar.remove(); return; }
    if (!bar && document.body) ensureUI();
    wireUI();
    uiApplyShowHideStyle();
    setTimeout(() => { applyPersistedTranscriptState(); }, 250);
    try { onFullscreenChange(); } catch (_) {}

  }

  async function onNavigate() {
    const vid = getVideoId();
    if (!vid) return;
    if (STATE.lastVideoId && vid !== STATE.lastVideoId) resetState("yt navigate");
    STATE.lastVideoId = vid;
    mount();
  }

  window.addEventListener("fullscreenchange", onFullscreenChange, true);
  window.addEventListener("webkitfullscreenchange", onFullscreenChange, true);

  window.addEventListener("yt-navigate-finish", onNavigate, true);
  window.addEventListener("popstate", onNavigate, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }

  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      onNavigate();
    } else {
      if ((location.pathname === "/watch" || location.pathname.startsWith("/live/")) && !document.getElementById('omv_bar')) {
        mount();
      }
    }
  }, 600);

})();
