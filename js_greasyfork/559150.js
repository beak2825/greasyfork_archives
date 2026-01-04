// ==UserScript==
// @name         OneDrive Shared Folder - Bulk Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Bulk download all images from a OneDrive shared folder link (optionally recursive).
// @author       sharmanhall
// @match        https://onedrive.live.com/*
// @match        https://1drv.ms/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onedrive.live.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559150/OneDrive%20Shared%20Folder%20-%20Bulk%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/559150/OneDrive%20Shared%20Folder%20-%20Bulk%20Image%20Downloader.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const API_BASE = "https://api.onedrive.com/v1.0";
  const BADGER_TOKEN_URL = "https://api-badgerp.svc.ms/v1.0/token";
  // This appId is widely referenced publicly for “Badger token” bootstrapping.
  const BADGER_APP_ID = "5cbed6ac-a083-4e14-b191-b4ba07653de2";

  const DEFAULT_CONCURRENCY = 3;
  const DEFAULT_RECURSIVE = true;

  const IMAGE_EXTS = new Set([
    "jpg","jpeg","png","gif","webp","bmp","tif","tiff","svg","heic","heif","avif"
  ]);

  // ---------------------------
  // UI
  // ---------------------------
  GM_addStyle(`
    #od-bulkdl {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999999;
      width: 340px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: rgba(20,20,20,0.92);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.35);
      overflow: hidden;
    }
    #od-bulkdl header {
      padding: 10px 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255,255,255,0.06);
    }
    #od-bulkdl .body { padding: 12px; }
    #od-bulkdl label { display:block; font-size: 12px; opacity: 0.9; margin-bottom: 6px; }
    #od-bulkdl input[type="text"] {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.22);
      background: rgba(0,0,0,0.28);
      color: #fff;
      outline: none;
      margin-bottom: 10px;
      font-size: 12px;
    }
    #od-bulkdl .row { display:flex; gap: 10px; align-items:center; margin: 10px 0; }
    #od-bulkdl .row > * { flex: 1; }
    #od-bulkdl button {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.14);
      color: #fff;
      cursor: pointer;
      font-weight: 700;
    }
    #od-bulkdl button:disabled { opacity: 0.55; cursor: not-allowed; }
    #od-bulkdl .muted { font-size: 12px; opacity: 0.8; }
    #od-bulkdl .status {
      margin-top: 10px;
      font-size: 12px;
      line-height: 1.35;
      white-space: pre-wrap;
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 10px;
      max-height: 220px;
      overflow: auto;
    }
    #od-bulkdl .mini {
      width: auto;
      padding: 6px 10px;
      font-weight: 600;
      background: rgba(255,255,255,0.10);
    }
    #od-bulkdl .top-actions { display:flex; gap: 8px; }
    #od-bulkdl .check {
      display:flex; gap: 8px; align-items: center;
      font-size: 12px; opacity: 0.95;
    }
    #od-bulkdl input[type="checkbox"] { transform: translateY(1px); }
  `);

  const panel = document.createElement("div");
  panel.id = "od-bulkdl";
  panel.innerHTML = `
    <header>
      <div>Bulk Download Images</div>
      <div class="top-actions">
        <button id="od-min" class="mini" title="Minimize">—</button>
      </div>
    </header>
    <div class="body" id="od-body">
      <label>Shared link (auto-detected; you can paste the 1drv.ms link)</label>
      <input id="od-link" type="text" spellcheck="false" />
      <div class="row">
        <div class="check">
          <input id="od-rec" type="checkbox" />
          <label for="od-rec" style="display:inline;margin:0;">Recurse subfolders</label>
        </div>
        <div>
          <label style="margin:0 0 6px 0;">Concurrency</label>
          <input id="od-conc" type="text" value="${DEFAULT_CONCURRENCY}" />
        </div>
      </div>
      <button id="od-go">Start downloading</button>
      <div class="muted" style="margin-top:8px;">
        Tip: your browser may show a “multiple downloads” permission prompt — allow it.
      </div>
      <div class="status" id="od-status">Idle.</div>
    </div>
  `;
  document.documentElement.appendChild(panel);

  const $ = (sel) => panel.querySelector(sel);
  const linkInput = $("#od-link");
  const recCheckbox = $("#od-rec");
  const concInput = $("#od-conc");
  const goBtn = $("#od-go");
  const statusBox = $("#od-status");

  recCheckbox.checked = DEFAULT_RECURSIVE;

  $("#od-min").addEventListener("click", () => {
    const body = $("#od-body");
    body.style.display = body.style.display === "none" ? "block" : "none";
  });

  function log(line) {
    statusBox.textContent = `${statusBox.textContent}\n${line}`.trim();
    statusBox.scrollTop = statusBox.scrollHeight;
  }
  function setStatus(s) {
    statusBox.textContent = s;
    statusBox.scrollTop = statusBox.scrollHeight;
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  function safeBase64DecodeMaybe(s) {
    // add padding if missing
    const pad = s.length % 4;
    const padded = pad ? (s + "=".repeat(4 - pad)) : s;
    try { return atob(padded); } catch { return null; }
  }

  function detectShareUrl() {
    const u = new URL(window.location.href);

    // onedrive.live.com share pages often carry a "redeem" param which is base64 of a 1drv.ms URL
    const redeem = u.searchParams.get("redeem");
    if (redeem) {
      const decoded = safeBase64DecodeMaybe(redeem);
      if (decoded && decoded.startsWith("http")) return decoded;
    }

    // if we’re already on 1drv.ms (short link), just use it
    if (u.hostname === "1drv.ms") return u.href;

    // otherwise use current URL
    return u.href;
  }

  function toBase64Url(b64) {
    return b64.replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }

  function encodeSharingUrlToShareId(sharingUrl) {
    // per MS docs: base64(url) -> base64url (unpadded) -> prefix "u!"
    const utf8 = new TextEncoder().encode(sharingUrl);
    let bin = "";
    for (const b of utf8) bin += String.fromCharCode(b);
    const b64 = btoa(bin);
    return "u!" + toBase64Url(b64);
  }

  function extOf(name) {
    const m = /\.([a-z0-9]+)$/i.exec(name || "");
    return m ? m[1].toLowerCase() : "";
  }

  function isImageName(name) {
    return IMAGE_EXTS.has(extOf(name));
  }

  function sanitizeFilename(name) {
    // Keep it conservative for Windows/macOS
    return (name || "file")
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
      .replace(/\s+/g, " ")
      .trim();
  }

  function gmRequest({ method, url, headers, data, responseType = "json" }) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data,
        responseType,
        onload: (r) => resolve(r),
        onerror: (e) => reject(e),
        ontimeout: (e) => reject(e),
      });
    });
  }

  function asJson(resp) {
    if (resp.response && typeof resp.response === "object") return resp.response;
    try { return JSON.parse(resp.responseText); } catch { return null; }
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ---------------------------
  // Auth bootstrap (anonymous first, badger fallback)
  // ---------------------------
  async function tryGetRootDriveItem(shareId, authHeader) {
    const url = `${API_BASE}/shares/${shareId}/driveItem`;
    const headers = {
      "Accept": "application/json",
      "Prefer": "autoredeem",
      ...(authHeader ? { "Authorization": authHeader } : {}),
    };
    const resp = await gmRequest({ method: "GET", url, headers, responseType: "json" });
    return { status: resp.status, json: asJson(resp), raw: resp };
  }

  async function getBadgerToken() {
    const resp = await gmRequest({
      method: "POST",
      url: BADGER_TOKEN_URL,
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      data: JSON.stringify({ appId: BADGER_APP_ID }),
      responseType: "json",
    });
    const j = asJson(resp);
    if (!j || !j.token) throw new Error("Failed to obtain Badger token.");
    return j.token;
  }

  async function getRootWithFallback(shareId) {
    // 1) Try anonymous
    log("Attempting anonymous access…");
    const anon = await tryGetRootDriveItem(shareId, null);
    if (anon.status >= 200 && anon.status < 300 && anon.json && anon.json.id) {
      log("Anonymous access OK.");
      return { root: anon.json, authHeader: null };
    }

    // 2) Try Badger
    log(`Anonymous access failed (HTTP ${anon.status}). Trying Badger token…`);
    const badgerToken = await getBadgerToken();
    const authHeader = `Badger ${badgerToken}`;
    const badger = await tryGetRootDriveItem(shareId, authHeader);

    if (badger.status >= 200 && badger.status < 300 && badger.json && badger.json.id) {
      log("Badger access OK.");
      return { root: badger.json, authHeader };
    }

    throw new Error(`Failed to read shared folder. HTTP ${badger.status} (${badger.raw.responseText?.slice?.(0, 200) || "no body"})`);
  }

  // ---------------------------
  // Traversal + download
  // ---------------------------
  async function listChildrenPaged(driveId, folderId, authHeader) {
    const headers = {
      "Accept": "application/json",
      ...(authHeader ? { "Authorization": authHeader } : {}),
    };

    const items = [];
    let next = `${API_BASE}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(folderId)}/children?$top=200`;

    while (next) {
      const resp = await gmRequest({ method: "GET", url: next, headers, responseType: "json" });
      const j = asJson(resp);
      if (resp.status < 200 || resp.status >= 300 || !j) {
        throw new Error(`List children failed. HTTP ${resp.status}`);
      }
      if (Array.isArray(j.value)) items.push(...j.value);
      next = j["@odata.nextLink"] || null;
      // be polite
      await sleep(150);
    }
    return items;
  }

  function gmDownloadPromise({ url, name, headers }) {
    return new Promise((resolve, reject) => {
      GM_download({
        url,
        name,
        headers,
        saveAs: false,
        onload: () => resolve(),
        onerror: (e) => reject(e),
        ontimeout: (e) => reject(e),
      });
    });
  }

  async function runWithConcurrency(tasks, concurrency) {
    let idx = 0;
    let active = 0;
    let done = 0;

    return new Promise((resolve) => {
      const tick = () => {
        while (active < concurrency && idx < tasks.length) {
          const t = tasks[idx++];
          active++;
          t()
            .catch(() => {})
            .finally(() => {
              active--;
              done++;
              if (done >= tasks.length) resolve();
              else tick();
            });
        }
      };
      tick();
    });
  }

  async function bulkDownload({ shareUrl, recursive, concurrency }) {
    setStatus("Starting…");

    const shareId = encodeSharingUrlToShareId(shareUrl);
    log(`Share URL: ${shareUrl}`);
    log(`ShareId: ${shareId}`);

    const { root, authHeader } = await getRootWithFallback(shareId);

    if (!root.folder) {
      throw new Error("This link appears to be a single file, not a folder.");
    }
    const driveId = root.parentReference?.driveId;
    const rootId = root.id;

    if (!driveId || !rootId) {
      throw new Error("Could not determine driveId/root folder id from the share.");
    }

    log(`driveId: ${driveId}`);
    log(`root folder id: ${rootId}`);

    // BFS through folders
    const foldersQ = [{ id: rootId, path: "" }];
    const imageFiles = [];
    const seenItemIds = new Set();

    while (foldersQ.length) {
      const { id: folderId, path } = foldersQ.shift();
      log(`Listing: /${path || ""} (id=${folderId})`);

      const children = await listChildrenPaged(driveId, folderId, authHeader);

      for (const it of children) {
        if (!it || !it.id || seenItemIds.has(it.id)) continue;
        seenItemIds.add(it.id);

        if (it.folder) {
          if (recursive) {
            const nextPath = path ? `${path}/${it.name}` : `${it.name}`;
            foldersQ.push({ id: it.id, path: nextPath });
          }
          continue;
        }

        if (it.file && isImageName(it.name)) {
          imageFiles.push({
            id: it.id,
            name: it.name,
            path,
          });
        }
      }

      // little pacing
      await sleep(200);
    }

    log(`Found ${imageFiles.length} image(s). Preparing downloads…`);

    const usedNames = new Map();
    function uniqueName(name) {
      const base = sanitizeFilename(name);
      const n = usedNames.get(base) || 0;
      usedNames.set(base, n + 1);
      if (n === 0) return base;

      // add (2), (3)…
      const dot = base.lastIndexOf(".");
      if (dot > 0) {
        return `${base.slice(0, dot)} (${n + 1})${base.slice(dot)}`;
      }
      return `${base} (${n + 1})`;
    }

    let started = 0;
    let finished = 0;
    let failed = 0;

    const headers = authHeader ? { "Authorization": authHeader } : undefined;

    const tasks = imageFiles.map((f) => async () => {
      started++;
      const prefix = f.path ? `${f.path.replaceAll("/", "__")}__` : "";
      const filename = uniqueName(prefix + f.name);

      // Download via the /content endpoint (it will redirect to the actual file bytes)
      const contentUrl = `${API_BASE}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(f.id)}/content`;

      log(`[${started}/${imageFiles.length}] Downloading: ${filename}`);
      try {
        await gmDownloadPromise({ url: contentUrl, name: filename, headers });
        finished++;
      } catch (e) {
        failed++;
        log(`!! Failed: ${filename}`);
      }
      // small delay to avoid tripping throttles
      await sleep(250);
    });

    log(`Downloading with concurrency=${concurrency}…`);
    await runWithConcurrency(tasks, concurrency);

    log(`Done. Success: ${finished} | Failed: ${failed}`);
  }

  // ---------------------------
  // Wire up UI
  // ---------------------------
  linkInput.value = detectShareUrl();

  goBtn.addEventListener("click", async () => {
    goBtn.disabled = true;
    setStatus("Starting…");

    try {
      const shareUrl = (linkInput.value || "").trim() || detectShareUrl();
      const recursive = !!recCheckbox.checked;
      let concurrency = parseInt((concInput.value || "").trim(), 10);
      if (!Number.isFinite(concurrency) || concurrency < 1) concurrency = DEFAULT_CONCURRENCY;
      if (concurrency > 8) concurrency = 8;

      await bulkDownload({ shareUrl, recursive, concurrency });
    } catch (err) {
      log(`ERROR: ${err?.message || String(err)}`);
    } finally {
      goBtn.disabled = false;
    }
  });

})();
