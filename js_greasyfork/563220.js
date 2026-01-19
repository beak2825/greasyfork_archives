// ==UserScript==
// @name         Alpine Linux apk add: Calculate Install MiB for Your System
// @namespace    https://mekineer.com
// @license      GPL-3.0-or-later
// @version      1.5.2
// @description  Show provider pkg + Installed size for each dependency, Total MiB and LocalMachine MiB via file picker of /lib/apk/db/installed
// @author       mekineer and Nova (ChatGPT 5.2 Thinking)
// @match        https://pkgs.alpinelinux.org/package/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563220/Alpine%20Linux%20apk%20add%3A%20Calculate%20Install%20MiB%20for%20Your%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/563220/Alpine%20Linux%20apk%20add%3A%20Calculate%20Install%20MiB%20for%20Your%20System.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // -------------------------
  // UI / Styling
  // -------------------------
  document.head.insertAdjacentHTML("beforeend", `
    <style>
      .depSizeTag{margin-left:6px;opacity:.75;font-size:.95em}
      .depBtn{margin-left:10px;padding:3px 8px;border:1px solid #999;border-radius:6px;cursor:pointer;background:#fff}
      .depBtn:disabled{opacity:.5;cursor:default}
      .depMsg{margin-left:10px;opacity:.7;font-size:.9em}
      .depTotal{margin-left:10px;opacity:.85;font-size:.9em;font-weight:600}
      .depLocal{margin-left:10px;opacity:.85;font-size:.9em;font-weight:600}
    </style>
  `);

  // Find "Depends (N)" element
  const header = [...document.querySelectorAll("body *")].find(el =>
    el.children.length === 0 && /^Depends\s*\(\d+\)\s*$/.test(el.textContent.trim())
  );
  if (!header) return;

  // Find first UL after the header (even if wrapped)
  const nextUl = (start) => {
    let cur = start;
    while (cur) {
      for (let sib = cur.nextElementSibling; sib; sib = sib.nextElementSibling) {
        if (sib.tagName === "UL") return sib;
        const u = sib.querySelector?.("ul");
        if (u) return u;
      }
      cur = cur.parentElement;
    }
    return null;
  };

  const ul = nextUl(header);
  if (!ul) return;

  const showBtn = document.createElement("button");
  showBtn.className = "depBtn";
  showBtn.textContent = "Show installed sizes";
  showBtn.title = "Tip: Shift+Click to force refresh (ignore size cache)";
  header.insertAdjacentElement("afterend", showBtn);

  const loadBtn = document.createElement("button");
  loadBtn.className = "depBtn";
  loadBtn.textContent = "Load installed DB…";
  loadBtn.title = "Pick /lib/apk/db/installed (Shift+Click clears loaded list)";
  header.insertAdjacentElement("afterend", loadBtn);

  const msg = document.createElement("span");
  msg.className = "depMsg";
  header.insertAdjacentElement("afterend", msg);

  const totalEl = document.createElement("span");
  totalEl.className = "depTotal";
  header.insertAdjacentElement("afterend", totalEl);

  const localEl = document.createElement("span");
  localEl.className = "depLocal";
  header.insertAdjacentElement("afterend", localEl);

  // Hidden file input (triggered by Load button)
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "*/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  // -------------------------
  // Politeness + cache
  // -------------------------
  const CONCURRENCY = 6;
  const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
  const CACHE_PREFIX = "depSizeCache:";

  const cacheKey = (url) => `${CACHE_PREFIX}${url}`;

  const cacheGet = (url) => {
    try {
      const raw = localStorage.getItem(cacheKey(url));
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.t || !obj.v) return null;

      if ((Date.now() - obj.t) > CACHE_TTL_MS) {
        localStorage.removeItem(cacheKey(url));
        return null;
      }
      if (obj.v === "?") {
        localStorage.removeItem(cacheKey(url));
        return null;
      }
      return obj.v;
    } catch {
      return null;
    }
  };

  const cacheSet = (url, size) => {
    if (!size || size === "?") return; // never cache unknown
    try {
      localStorage.setItem(cacheKey(url), JSON.stringify({ t: Date.now(), v: size }));
    } catch {}
  };

  const cacheClearOne = (url) => {
    try { localStorage.removeItem(cacheKey(url)); } catch {}
  };

  const runLimited = async (items, limit, worker) => {
    let i = 0;
    const n = Math.min(limit, items.length);
    const runners = Array.from({ length: n }, async () => {
      while (i < items.length) {
        const item = items[i++];
        await worker(item);
      }
    });
    await Promise.all(runners);
  };

  // -------------------------
  // Helpers
  // -------------------------
  const pkgFromUrl = (url) => {
    try {
      const parts = new URL(url).pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || "?";
    } catch {
      return "?";
    }
  };

  const sizeToBytes = (s) => {
    if (!s || s === "?") return null;
    const m = String(s).trim().match(/^([0-9.]+)\s*([KMGT]?iB|B)$/i);
    if (!m) return null;

    const n = Number(m[1]);
    if (!Number.isFinite(n)) return null;

    const u = m[2].toUpperCase();
    const mult = (u === "B")   ? 1 :
                 (u === "KIB") ? 1024 :
                 (u === "MIB") ? 1024 ** 2 :
                 (u === "GIB") ? 1024 ** 3 :
                 (u === "TIB") ? 1024 ** 4 : null;

    return mult ? n * mult : null;
  };

  const bytesToMiB = (b) => (b / (1024 ** 2));

  // Read Installed size from dependency page (DOMParser -> table row)
  const getSize = async (url, forceRefresh) => {
    if (forceRefresh) cacheClearOne(url);

    const cached = !forceRefresh ? cacheGet(url) : null;
    if (cached) return cached;

    const html = await fetch(url).then(r => r.text());
    const doc = new DOMParser().parseFromString(html, "text/html");

    const rows = [...doc.querySelectorAll("table#package tr")];
    const row = rows.find(tr =>
      tr.querySelector("th.header")?.textContent.trim().toLowerCase() === "installed size"
    );

    const size = row?.querySelector("td")?.textContent.trim() || "?";
    cacheSet(url, size);
    return size;
  };

  // Parse /lib/apk/db/installed (package records contain "P:<name>")
  const parseInstalledPkgs = (installedText) => {
    const set = new Set();
    const lines = installedText.split(/\r?\n/);
    for (const line of lines) {
      if (line.startsWith("P:")) {
        const name = line.slice(2).trim();
        if (name) set.add(name);
      }
    }
    return set;
  };

  // -------------------------
  // State
  // -------------------------
  const state = {
    installedSet: null,
    urls: [],
    providerByUrl: new Map(),
    sizeBytesByUrl: new Map(),
    sumBytesAll: 0
  };

  const updateLocalMachine = () => {
    if (!state.installedSet) {
      localEl.textContent = " LocalMachine: (click “Load installed DB…”)";
      return;
    }
    if (!state.urls.length || !state.sizeBytesByUrl.size) {
      localEl.textContent = " LocalMachine: (click “Show installed sizes” first)";
      return;
    }

    let missingBytes = 0;
    for (const url of state.urls) {
      const pkg = state.providerByUrl.get(url);
      const b = state.sizeBytesByUrl.get(url);
      if (!pkg || b == null) continue;
      if (!state.installedSet.has(pkg)) missingBytes += b;
    }

    localEl.textContent = ` LocalMachine: ${bytesToMiB(missingBytes).toFixed(2)} MiB`;
  };

  // -------------------------
  // Button: Load installed DB (file picker)
  // -------------------------
  loadBtn.onclick = (ev) => {
    if (ev.shiftKey) {
      state.installedSet = null;
      updateLocalMachine();
      return;
    }
    fileInput.value = "";
    fileInput.click();
  };

  fileInput.addEventListener("change", async () => {
    const f = fileInput.files?.[0];
    if (!f) return;

    localEl.textContent = " LocalMachine: reading file…";

    try {
      const text = await f.text();
      const installed = parseInstalledPkgs(text);

      if (!installed.size) {
        localEl.textContent = " LocalMachine: file had 0 packages (wrong file?)";
        return;
      }

      state.installedSet = installed;
      localEl.textContent = ` LocalMachine: loaded (${installed.size} pkgs)`;
      updateLocalMachine();
    } catch {
      localEl.textContent = " LocalMachine: failed to read file";
    }
  });

  // -------------------------
  // Button: Show installed sizes
  // -------------------------
  showBtn.onclick = async (ev) => {
    showBtn.disabled = true;
    totalEl.textContent = "";
    msg.textContent = "";
    localEl.textContent = "";

    const forceRefresh = !!ev.shiftKey;

    const links = [...ul.querySelectorAll('a[href*="/package/"]')];
    if (!links.length) {
      msg.textContent = " (no deps found)";
      showBtn.disabled = false;
      updateLocalMachine();
      return;
    }

    // Reset state for this run
    state.urls = [];
    state.providerByUrl.clear();
    state.sizeBytesByUrl.clear();
    state.sumBytesAll = 0;

    // Group by URL (unique provider package pages)
    const map = new Map(); // url -> { pkg, tags: [] }

    for (const a of links) {
      const url = new URL(a.getAttribute("href"), location.origin).href;
      const pkg = pkgFromUrl(url);

      const tag = document.createElement("span");
      tag.className = "depSizeTag";
      tag.textContent = "( … )";
      a.insertAdjacentElement("afterend", tag);

      const bucket = map.get(url) || (map.set(url, { pkg, tags: [] }), map.get(url));
      bucket.tags.push(tag);
    }

    state.urls = [...map.keys()];
    for (const url of state.urls) state.providerByUrl.set(url, map.get(url).pkg);

    let done = 0, total = state.urls.length;
    msg.textContent = `${forceRefresh ? " (refreshing" : " (loading"} 0/${total})`;

    await runLimited(state.urls, CONCURRENCY, async (url) => {
      const { pkg, tags } = map.get(url);

      let size = "?";
      try {
        size = await getSize(url, forceRefresh);
      } catch {
        size = "?";
      }

      for (const t of tags) t.textContent = `( ${pkg} ${size} )`;

      const b = sizeToBytes(size);
      if (b != null) {
        state.sumBytesAll += b;
        state.sizeBytesByUrl.set(url, b);
      }

      done++;
      msg.textContent = `${forceRefresh ? " (refreshing" : " (loading"} ${done}/${total})`;
      totalEl.textContent = ` Total: ${bytesToMiB(state.sumBytesAll).toFixed(2)} MiB`;
    });

    msg.textContent = " (done)";
    showBtn.disabled = false;

    updateLocalMachine();
  };

  // Initial hint
  updateLocalMachine();
})();
