// ==UserScript==
// @name         Pinterest Board Image Downloader
// @namespace    https://github.com/austinpresley
// @version      2.1.1
// @description  Fast Pinterest board image downloader. Scan page or scan+scroll, then download. 
// @match        https://www.pinterest.com/*/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      i.pinimg.com
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/563977/Pinterest%20Board%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/563977/Pinterest%20Board%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------- Guards ----------
  if (window.top !== window.self) return;
  if (document.getElementById("__pbd_simple_panel__")) return;

  const pathParts = location.pathname.split("/").filter(Boolean);
  const isPinPage = pathParts[0] === "pin";
  const looksLikeBoard = pathParts.length >= 2 && !isPinPage;
  if (!looksLikeBoard) return;

  // ---------- Settings ----------
  const MAX_IMAGES = 10000;

  const SCROLL_STEP_PX = 1700;
  const SCROLL_PAUSE_MS = 950;
  const STOP_AFTER_NO_NEW_ROUNDS = 10;

  const DOWNLOAD_DELAY_MS = 350;

  // Toggles (UI)
  let tryOriginalsFirst = true; // originals -> 736x -> 564x -> current (falls back automatically)
  let blobFallback = false;     // if direct download fails, fetch as blob and download blob
  let watchBoard = false;       // keep collecting while you scroll (debounced)

  // ---------- State ----------
  const imageUrls = new Set();
  let running = false;
  let scanning = false;
  let stopRequested = false;

  let downloadsAttempted = 0;
  let downloaded = 0;
  let downloadFails = 0;
  let skippedAvatars = 0;
  let scans = 0;

  // Resume numbering
  let nextIndex = 1;

  // Mutation observer for watchBoard
  let observer = null;
  let scanTimer = null;
  const SCAN_DEBOUNCE_MS = 1200;

  // ---------- Helpers ----------
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function sanitizeFilename(name) {
    return (name || "")
      .replace(/[\/\\?%*:|"<>]/g, "_")
      .replace(/\s+/g, " ")
      .trim();
  }

  function slugToTitle(slug) {
    if (!slug) return "";
    const words = decodeURIComponent(slug)
      .replace(/[-_]+/g, " ")
      .trim()
      .split(/\s+/);
    return words.map(w => (w ? (w[0].toUpperCase() + w.slice(1)) : "")).join(" ");
  }

  function getBoardDisplayName() {
    // Most reliable on Pinterest board pages
    const h1 = document.querySelector("h1#board-name");
    const t1 = h1?.textContent?.trim();
    if (t1) return t1;

    // fallback: any h1
    const anyH1 = document.querySelector("h1");
    const t2 = anyH1?.textContent?.trim();
    if (t2) return t2;

    // fallback: URL slug
    const parts = location.pathname.split("/").filter(Boolean);
    const slug = parts[1] || "board";
    return slugToTitle(slug) || slug;
  }

  function getBoardPrefixForFiles() {
    // ✅ Board name only, no username
    return sanitizeFilename(getBoardDisplayName()) || "Pinterest";
  }

  function getBoardStorageKey() {
    // Use the board URL path as a stable key so each board has its own counter
    const path = location.pathname.replace(/\/+$/, "");
    return `pbd_nextIndex:${location.origin}${path}`;
  }

  function loadNextIndex() {
    const key = getBoardStorageKey();
    const stored = GM_getValue(key, 1);
    const n = Number(stored);
    nextIndex = Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
  }

  function saveNextIndex(value) {
    const key = getBoardStorageKey();
    GM_setValue(key, value);
  }

  function pickBestFromSrcset(srcset) {
    if (!srcset) return null;
    const candidates = srcset
      .split(",")
      .map((s) => s.trim().split(" ")[0])
      .filter(Boolean);
    return candidates.length ? candidates[candidates.length - 1] : null;
  }

  function isLikelyAvatarUrl(url) {
    // Skip profile/rounded images like: /75x75_RS/...jpg
    try {
      const u = new URL(url);
      if (!u.hostname.includes("pinimg.com")) return false;
      return /\/\d+x\d+_RS\//.test(u.pathname);
    } catch {
      return false;
    }
  }

  function isAllowedPinimgFolder(url) {
    // Allow typical pin image folders: /236x/, /564x/, /736x/, /originals/
    try {
      const u = new URL(url);
      if (!u.hostname.includes("pinimg.com")) return false;
      const parts = u.pathname.split("/").filter(Boolean);
      const folder = parts[0] || "";
      return folder === "originals" || /^\d+x$/.test(folder) || /^\d+x\d+_RS$/.test(folder);
    } catch {
      return false;
    }
  }

  function makeVariant(url, folder) {
    try {
      const u = new URL(url);
      if (!u.hostname.includes("pinimg.com")) return url;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return url;
      parts[0] = folder;
      u.pathname = "/" + parts.join("/");
      return u.toString();
    } catch {
      return url;
    }
  }

  function buildCandidates(url) {
    if (!url) return [];
    if (isLikelyAvatarUrl(url)) return [];

    const out = [];
    const add = (x) => {
      if (!x) return;
      if (isLikelyAvatarUrl(x)) return;
      if (!out.includes(x)) out.push(x);
    };

    if (tryOriginalsFirst) add(makeVariant(url, "originals"));
    add(makeVariant(url, "736x"));
    add(makeVariant(url, "564x"));
    add(url);

    return out;
  }

  function guessExtFromUrl(url) {
    try {
      const p = new URL(url).pathname.toLowerCase();
      const m = p.match(/\.(jpg|jpeg|png|gif|webp)$/);
      return m ? m[1] : "jpg";
    } catch {
      return "jpg";
    }
  }

  // ---------- Scanning ----------
  function scanOnce() {
    scans++;
    let added = 0;

    const imgs = Array.from(
      document.querySelectorAll('img[src*="pinimg.com"], img[srcset*="pinimg.com"]')
    );

    for (const img of imgs) {
      const best = pickBestFromSrcset(img.getAttribute("srcset")) || img.getAttribute("src");
      if (!best) continue;

      if (!isAllowedPinimgFolder(best)) continue;

      if (isLikelyAvatarUrl(best)) {
        skippedAvatars++;
        continue;
      }

      if (!imageUrls.has(best)) {
        imageUrls.add(best);
        added++;
        if (imageUrls.size >= MAX_IMAGES) break;
      }
    }

    updateCounts();
    return added;
  }

  async function scanAndScroll() {
    if (scanning) return;
    scanning = true;
    stopRequested = false;
    updateButtons();

    statusLine.textContent = "Auto-scrolling… loading more images";
    let noNewRounds = 0;

    while (!stopRequested) {
      const before = imageUrls.size;
      const added = scanOnce();
      const after = imageUrls.size;

      if ((after - before) === 0 && added === 0) noNewRounds++;
      else noNewRounds = 0;

      if (noNewRounds >= STOP_AFTER_NO_NEW_ROUNDS) break;

      window.scrollBy(0, SCROLL_STEP_PX);
      await sleep(SCROLL_PAUSE_MS);

      statusLine.textContent = `Auto-scrolling… (images collected: ${imageUrls.size})`;
    }

    scanning = false;
    updateButtons();
    statusLine.textContent = stopRequested ? "Scan stopped." : "Scan finished.";
  }

  function scheduleDebouncedScan() {
    if (!watchBoard) return;
    if (scanTimer) return;
    scanTimer = setTimeout(() => {
      scanTimer = null;
      const added = scanOnce();
      statusLine.textContent = `Watching… (+${added} new)`;
    }, SCAN_DEBOUNCE_MS);
  }

  function startWatching() {
    stopWatching();
    observer = new MutationObserver(() => scheduleDebouncedScan());
    observer.observe(document.documentElement, { childList: true, subtree: true });
    statusLine.textContent = "Watch ON (debounced).";
  }

  function stopWatching() {
    if (observer) observer.disconnect();
    observer = null;
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = null;
    statusLine.textContent = "Watch OFF.";
  }

  // ---------- Downloading ----------
  function gmGetBlob(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "blob",
        anonymous: false,
        headers: {
          Referer: "https://www.pinterest.com/",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
        onload: (res) => resolve({ ok: true, status: res.status, blob: res.response }),
        onerror: () => resolve({ ok: false, status: 0, blob: null }),
        ontimeout: () => resolve({ ok: false, status: 0, blob: null }),
      });
    });
  }

  async function directDownload(url, filename) {
    return await new Promise((resolve) => {
      GM_download({
        url,
        name: filename,
        saveAs: false,
        onload: () => resolve(true),
        onerror: () => resolve(false),
        ontimeout: () => resolve(false),
      });
    });
  }

  async function blobDownload(url, filename) {
    const res = await gmGetBlob(url);
    if (!res.ok || !res.blob) return false;

    const blobUrl = URL.createObjectURL(res.blob);
    const ok = await new Promise((resolve) => {
      GM_download({
        url: blobUrl,
        name: filename,
        saveAs: false,
        onload: () => resolve(true),
        onerror: () => resolve(false),
        ontimeout: () => resolve(false),
      });
    });

    try { URL.revokeObjectURL(blobUrl); } catch {}
    return ok;
  }

  async function downloadWithFallback(candidates, filename) {
    for (const url of candidates) {
      if (stopRequested) return false;
      if (!url) continue;

      let ok = await directDownload(url, filename);
      if (ok) return true;

      if (blobFallback) {
        ok = await blobDownload(url, filename);
        if (ok) return true;
      }
    }
    return false;
  }

  async function startDownload() {
    if (running) return;
    if (imageUrls.size === 0) {
      statusLine.textContent = "No images collected yet. Click Scan first.";
      return;
    }

    // Load the stored counter for THIS board right before downloading
    loadNextIndex();

    running = true;
    stopRequested = false;
    updateButtons();

    const urls = Array.from(imageUrls).filter((u) => !isLikelyAvatarUrl(u));
    progressBar.max = Math.max(1, urls.length);
    progressNow.textContent = "0";
    progressMax.textContent = String(urls.length);

    const prefix = getBoardPrefixForFiles();

    statusLine.textContent = `Downloading… (starting at ${String(nextIndex).padStart(4, "0")})`;

    for (let i = 0; i < urls.length; i++) {
      if (stopRequested) break;

      const baseUrl = urls[i];
      const candidates = buildCandidates(baseUrl);
      if (candidates.length === 0) continue;

      const ext = guessExtFromUrl(candidates[candidates.length - 1] || baseUrl);

      // ✅ Reserve the number first so re-running never creates "(1)" duplicates
      const currentNumber = nextIndex;
      nextIndex++;
      saveNextIndex(nextIndex);

      const filename = `${prefix}_${String(currentNumber).padStart(4, "0")}.${ext}`;

      progressNow.textContent = String(i + 1);
      progressBar.value = i + 1;

      detailLine.textContent = filename;

      downloadsAttempted++;
      const ok = await downloadWithFallback(candidates, filename);
      if (ok) downloaded++;
      else downloadFails++;

      updateCounts();
      await sleep(DOWNLOAD_DELAY_MS);
    }

    running = false;
    updateButtons();
    statusLine.textContent = stopRequested ? "Download stopped." : "Download finished.";
    GM_notification({
      title: "Pinterest downloader",
      text: `Downloaded: ${downloaded}. Fails: ${downloadFails}. Next #: ${String(nextIndex).padStart(4, "0")}`,
      timeout: 3000,
    });
  }

  function stopAll() {
    stopRequested = true;
    if (scanning) statusLine.textContent = "Stopping scan…";
    else if (running) statusLine.textContent = "Stopping download…";
    else statusLine.textContent = "Stopped.";
    updateButtons();
  }

  // ---------- Reset ----------
  function resetTool() {
    stopRequested = true;
    running = false;
    scanning = false;

    imageUrls.clear();

    downloadsAttempted = 0;
    downloaded = 0;
    downloadFails = 0;
    skippedAvatars = 0;
    scans = 0;

    progressBar.value = 0;
    progressBar.max = 1;
    progressNow.textContent = "0";
    progressMax.textContent = "0";
    detailLine.textContent = "";

    statusLine.textContent = "Reset complete (scans + counters).";
    updateCounts();
    updateButtons();
  }

  function resetNumbering() {
    const key = getBoardStorageKey();
    GM_setValue(key, 1);
    loadNextIndex();
    statusLine.textContent = "Numbering reset to 0001 for this board.";
    updateCounts();
  }

  // ---------- UI ----------
  const panel = document.createElement("div");
  panel.id = "__pbd_simple_panel__";
  panel.style.cssText = `
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 999999;
    width: 360px;
    background: rgba(20,20,20,0.92);
    color: #fff;
    font: 12px/1.35 -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  `;

  const header = document.createElement("div");
  header.style.cssText = "display:flex; align-items:center; justify-content:space-between; gap:10px;";

  const title = document.createElement("div");
  title.textContent = "Pinterest Downloader";
  title.style.cssText = "font-weight: 900;";

  const headerBtns = document.createElement("div");
  headerBtns.style.cssText = "display:flex; gap:8px;";

  const btnInfo = mkSmallBtn("i");
  btnInfo.title = "Info";
  const btnMin = mkSmallBtn("–");
  btnMin.title = "Minimize";

  headerBtns.append(btnInfo, btnMin);
  header.append(title, headerBtns);

  const bodyWrap = document.createElement("div");
  bodyWrap.style.cssText = "margin-top:10px;";

  const boardLine = document.createElement("div");
  boardLine.style.cssText = "opacity:0.9; margin-bottom:6px; font-weight:800;";
  boardLine.textContent = `Board: ${getBoardDisplayName()}`;

  const countsLine = document.createElement("div");
  countsLine.style.cssText = "opacity: 0.9; margin-bottom: 8px;";

  const progressWrap = document.createElement("div");
  progressWrap.style.cssText = "display:flex; align-items:center; gap:8px; margin-bottom: 8px; opacity: 0.95;";

  const progressNow = document.createElement("span");
  progressNow.textContent = "0";
  const slash = document.createElement("span");
  slash.textContent = "/";
  const progressMax = document.createElement("span");
  progressMax.textContent = "0";

  const progressBar = document.createElement("progress");
  progressBar.max = 1;
  progressBar.value = 0;
  progressBar.style.cssText = "width: 100%; height: 12px; flex: 1;";

  const statusLine = document.createElement("div");
  statusLine.style.cssText = "margin: 8px 0 4px; opacity: 0.98;";
  statusLine.textContent = "Idle. Scan first.";

  const detailLine = document.createElement("div");
  detailLine.style.cssText = "opacity: 0.7; word-break: break-all; max-height: 38px; overflow: hidden;";
  detailLine.textContent = "";

  const btnRow1 = document.createElement("div");
  btnRow1.style.cssText = "display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;";

  const btnScan = mkBtn("Scan (page)");
  btnScan.onclick = () => {
    const added = scanOnce();
    statusLine.textContent = `Scan complete. +${added} images.`;
  };

  const btnScanScroll = mkBtn("Scan + scroll");
  btnScanScroll.onclick = () => scanAndScroll();

  btnRow1.append(btnScan, btnScanScroll);

  const btnRow2 = document.createElement("div");
  btnRow2.style.cssText = "display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;";

  const btnStart = mkBtn("Start download");
  btnStart.onclick = () => startDownload();

  const btnStop = mkBtn("Stop");
  btnStop.onclick = () => stopAll();

  const btnReset = mkBtn("Reset");
  btnReset.onclick = () => resetTool();

  const btnResetNum = mkBtn("Reset numbering");
  btnResetNum.onclick = () => resetNumbering();

  btnRow2.append(btnStart, btnStop, btnReset, btnResetNum);

  const settingsWrap = document.createElement("div");
  settingsWrap.style.cssText = "margin-top:10px; display:flex; gap:12px; flex-wrap:wrap; opacity:0.95;";

  const originalsToggle = mkToggle("Try originals first", tryOriginalsFirst, (v) => (tryOriginalsFirst = v));
  const blobToggle = mkToggle("Blob fallback", blobFallback, (v) => (blobFallback = v));
  const watchToggle = mkToggle("Watch board", watchBoard, (v) => {
    watchBoard = v;
    if (watchBoard) startWatching();
    else stopWatching();
  });

  settingsWrap.append(originalsToggle.wrap, blobToggle.wrap, watchToggle.wrap);

  const infoBox = document.createElement("div");
  infoBox.style.cssText = `
    display:none;
    margin-top:10px;
    padding:10px;
    border-radius:10px;
    background: rgba(255,255,255,0.08);
    opacity: 0.98;
  `;
  infoBox.innerHTML = `
    <div style="font-weight:900; margin-bottom:6px;">How it works</div>
    <div style="opacity:0.95;">
      <div><b>Scan (page)</b>: grabs images currently loaded on screen.</div>
      <div><b>Scan + scroll</b>: auto-scrolls to load more, then stops when nothing new appears.</div>
      <div><b>Start download</b>: downloads what you collected, one-by-one.</div>
      <div><b>Resume numbering</b>: remembers the next number for this board, so re-running won’t create <code>(1)</code> duplicates.</div>
      <div style="margin-top:8px; font-weight:900;">Settings</div>
      <div><b>Try originals first</b>: attempts higher-res variants (originals → 736x → 564x → current). Falls back automatically.</div>
      <div><b>Blob fallback</b>: retries failed downloads by fetching bytes first. Slower, sometimes helps.</div>
      <div><b>Watch board</b>: keeps collecting as you scroll manually (debounced to avoid tab crashes).</div>
      <div style="margin-top:8px; opacity:0.9;">
        <b>Skips</b> profile pics like <code>75x75_RS</code>.
      </div>
    </div>
  `;

  btnInfo.onclick = () => {
    infoBox.style.display = (infoBox.style.display === "none") ? "block" : "none";
  };

  let minimized = false;
  btnMin.onclick = () => {
    minimized = !minimized;
    if (minimized) {
      bodyWrap.style.display = "none";
      panel.style.width = "240px";
      btnMin.textContent = "+";
      btnMin.title = "Expand";
    } else {
      bodyWrap.style.display = "block";
      panel.style.width = "360px";
      btnMin.textContent = "–";
      btnMin.title = "Minimize";
    }
  };

  progressWrap.append(progressNow, slash, progressMax);
  bodyWrap.append(
    boardLine,
    countsLine,
    progressWrap,
    progressBar,
    statusLine,
    detailLine,
    btnRow1,
    btnRow2,
    settingsWrap,
    infoBox
  );

  panel.append(header, bodyWrap);
  document.body.appendChild(panel);

  function mkBtn(label) {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText = `
      appearance:none; border:0; border-radius:10px;
      padding:8px 10px;
      cursor:pointer;
      background: rgba(255,255,255,0.14);
      color:#fff; font-weight:900;
    `;
    b.onmouseenter = () => (b.style.background = "rgba(255,255,255,0.2)");
    b.onmouseleave = () => (b.style.background = "rgba(255,255,255,0.14)");
    return b;
  }

  function mkSmallBtn(label) {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText = `
      appearance:none; border:0; border-radius:10px;
      width:32px; height:28px;
      cursor:pointer;
      background: rgba(255,255,255,0.14);
      color:#fff; font-weight:900;
    `;
    b.onmouseenter = () => (b.style.background = "rgba(255,255,255,0.2)");
    b.onmouseleave = () => (b.style.background = "rgba(255,255,255,0.14)");
    return b;
  }

  function mkToggle(label, initial, onChange) {
    const wrap = document.createElement("label");
    wrap.style.cssText = "display:flex; gap:6px; align-items:center; cursor:pointer; user-select:none;";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = initial;
    cb.onchange = () => onChange(cb.checked);
    const text = document.createElement("span");
    text.textContent = label;
    text.style.cssText = "font-weight:800;";
    wrap.append(cb, text);
    return { wrap, cb };
  }

  function countsText() {
    return `Images: ${imageUrls.size} | Downloaded: ${downloaded} | Fails: ${downloadFails} | Next #: ${String(nextIndex).padStart(4, "0")} | Scans: ${scans}`;
  }

  function updateCounts() {
    countsLine.textContent = countsText();
  }

  function updateButtons() {
    btnScan.disabled = running || scanning;
    btnScanScroll.disabled = running || scanning;
    btnStart.disabled = running || scanning;
    btnStop.disabled = !(running || scanning);

    btnScan.style.opacity = btnScan.disabled ? "0.5" : "1";
    btnScanScroll.style.opacity = btnScanScroll.disabled ? "0.5" : "1";
    btnStart.style.opacity = btnStart.disabled ? "0.5" : "1";
    btnStop.style.opacity = btnStop.disabled ? "0.5" : "1";
  }

  // Initial
  loadNextIndex();
  scanOnce();
  updateCounts();
  updateButtons();

})();