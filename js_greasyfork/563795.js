// ==UserScript==
// @name         NerdyTeachers Top200: Add PICO-8 cart download links
// @namespace    https://github.com/austinpresley/
// @version      1.0.3
// @description  Adds a "Download cart" action per game by scraping the Lexaloffle Cart File URL and downloading directly.
// @match        https://nerdyteachers.com/PICO-8/Games/Top200/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @connect      www.lexaloffle.com
// @connect      lexaloffle.com
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/563795/NerdyTeachers%20Top200%3A%20Add%20PICO-8%20cart%20download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/563795/NerdyTeachers%20Top200%3A%20Add%20PICO-8%20cart%20download%20links.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  const CONCURRENCY = 6;

  function gmRequest(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (res) => resolve(res),
        onerror: (err) => reject(err),
      });
    });
  }

  function cacheGet(key) {
    const raw = GM_getValue(key, null);
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      if (!obj || !obj.url || !obj.ts) return null;
      if (Date.now() - obj.ts > CACHE_TTL_MS) return null;
      return obj.url;
    } catch {
      return null;
    }
  }

  function cacheSet(key, url) {
    GM_setValue(key, JSON.stringify({ url, ts: Date.now() }));
  }

  function absoluteLexUrl(href) {
    // Normalize pid links
    try {
      const u = new URL(href, location.href);
      if (u.hostname === "lexaloffle.com") u.hostname = "www.lexaloffle.com";
      if (u.protocol !== "https:") u.protocol = "https:";
      return u.toString();
    } catch {
      return href;
    }
  }

  function extractCartPngUrl(lexHtml) {
    const doc = new DOMParser().parseFromString(lexHtml, "text/html");

    // Primary: Find any link to a .p8.png cart in /bbs/cposts/
    const a = doc.querySelector('a[href*="/bbs/cposts/"][href$=".p8.png"]');
    if (a) {
      const href = a.getAttribute("href");
      if (href) {
        if (href.startsWith("http")) return href;
        return "https://www.lexaloffle.com" + href;
      }
    }

    // Fallback: raw text search (covers odd pages where it isn't a normal <a> link)
    const m = lexHtml.match(/\/bbs\/cposts\/[a-z0-9]{2}\/[a-z0-9_\-\.]+\.p8\.png/gi);
    if (!m || !m.length) return null;
    return "https://www.lexaloffle.com" + m[0];
  }

  function filenameFromCartUrl(cartUrl) {
    try {
      const u = new URL(cartUrl);
      const base = u.pathname.split("/").pop() || "cart.p8.png";
      return decodeURIComponent(base);
    } catch {
      return "cart.p8.png";
    }
  }

  function makeDownloadLink(label, cartUrl) {
    const a = document.createElement("a");
    a.textContent = label;
    a.href = "javascript:void(0)";
    a.style.marginLeft = "8px";
    a.style.fontWeight = "600";
    a.style.cursor = "pointer";

    a.addEventListener("click", (e) => {
      e.preventDefault();

      const name = filenameFromCartUrl(cartUrl);

      // If GM_download exists, use it (best UX)
      if (typeof GM_download === "function") {
        GM_download({
          url: cartUrl,
          name,
          saveAs: false, // set true if you want a save dialog every time
          onerror: (err) => console.log("GM_download error:", err),
          ontimeout: () => console.log("GM_download timeout:", cartUrl),
        });
        return;
      }

      // Fallback: fetch as blob then trigger download
      fetch(cartUrl)
        .then((r) => {
          if (!r.ok) throw new Error("Download failed: " + r.status);
          return r.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const tmp = document.createElement("a");
          tmp.href = url;
          tmp.download = name;
          document.body.appendChild(tmp);
          tmp.click();
          tmp.remove();
          URL.revokeObjectURL(url);
        })
        .catch(() => {
          // absolute fallback: open it if browser blocks programmatic download
          window.open(cartUrl, "_blank", "noopener,noreferrer");
        });
    });

    return a;
  }

  function makeStatus(text) {
    const s = document.createElement("span");
    s.textContent = text;
    s.style.marginLeft = "8px";
    s.style.opacity = "0.75";
    return s;
  }

  function findGameLinks() {
    // Only grab game pages (pid=), not user profile links (uid=) etc.
    const anchors = Array.from(document.querySelectorAll('a[href*="lexaloffle.com/bbs/"]'));
    return anchors.filter((a) => {
      const href = a.getAttribute("href") || "";
      return /lexaloffle\.com\/bbs\/\?pid=\d+/i.test(href);
    });
  }

  function pickInsertPoint(gameAnchor) {
    // Best effort: stick the download link near the existing game link.
    // Try a nearby container so it looks like it belongs to the "tile".
    return (
      gameAnchor.closest("article, li, .card, .tile, .game, .entry, div, section") ||
      gameAnchor.parentElement ||
      gameAnchor
    );
  }

  async function enrichOne(gameAnchor) {
    if (gameAnchor.dataset.ntdlDone) return;
    gameAnchor.dataset.ntdlDone = "1";

    const lexUrl = absoluteLexUrl(gameAnchor.href);
    const cacheKey = "nt_cart_" + lexUrl;

    const insertPoint = pickInsertPoint(gameAnchor);

    const status = makeStatus(" (cart: loading…)"); // lightweight status
    insertPoint.appendChild(status);

    // Cache hit
    const cached = cacheGet(cacheKey);
    if (cached) {
      status.remove();
      insertPoint.appendChild(makeDownloadLink("Download cart", cached));
      return;
    }

    try {
      const res = await gmRequest(lexUrl);
      const html = res.responseText || "";
      const cartUrl = extractCartPngUrl(html);

      status.remove();

      if (!cartUrl) {
        insertPoint.appendChild(makeStatus(" (no cart link found)"));
        return;
      }

      cacheSet(cacheKey, cartUrl);
      insertPoint.appendChild(makeDownloadLink("Download cart", cartUrl));
    } catch (e) {
      status.remove();
      insertPoint.appendChild(makeStatus(" (failed to fetch)"));
    }
  }

  async function runQueue(items, worker, concurrency) {
    let i = 0;
    const runners = new Array(concurrency).fill(0).map(async () => {
      while (i < items.length) {
        const idx = i++;
        await worker(items[idx]);
      }
    });
    await Promise.all(runners);
  }

  function main() {
    const gameLinks = findGameLinks();
    if (!gameLinks.length) return;

    runQueue(gameLinks, enrichOne, CONCURRENCY);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();