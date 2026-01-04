// ==UserScript==
// @name         Story Downloader - Facebook & Instagram (Overlay + Toast)
// @namespace    https://github.com/oscar370
// @version      2.2.0
// @description  One-click downloader for Facebook & Instagram stories (video & image).
// @author       oscar370 (original), fd2013 (improvements)
// @match        https://*.facebook.com/*
// @match        https://*.instagram.com/*
// @run-at       document-idle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *.fbcdn.net
// @connect      *.cdninstagram.com
// @connect      *.fna.fbcdn.net
// @connect      *
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/551552/Story%20Downloader%20-%20Facebook%20%20Instagram%20%28Overlay%20%2B%20Toast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551552/Story%20Downloader%20-%20Facebook%20%20Instagram%20%28Overlay%20%2B%20Toast%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const isDev = false;
  const log = (...a) => { if (isDev) console.log("[StoryDL]", ...a); };

  // --- Styles: fixed overlay button + toasts ---
  const CSS = `
  #sdx-btn {
    position: fixed;
    right: 14px;
    bottom: 14px;
    z-index: 999999 !important;
    display: none; /* only shown on /stories/ */
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(20,20,20,.85);
    color: #fff;
    border: 1px solid rgba(255,255,255,.16);
    backdrop-filter: blur(6px);
    font: 600 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
    cursor: pointer;
    user-select: none;
  }
  #sdx-btn:hover { background: rgba(30,30,30,.9); }
  #sdx-btn svg { display: block; }

  .sdx-toast {
    position: fixed;
    right: 16px;
    bottom: 60px;
    max-width: 320px;
    z-index: 1000000 !important;
    background: rgba(15,15,15,.95);
    color: #fff;
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 12px;
    padding: 10px 12px;
    margin-top: 8px;
    box-shadow: 0 6px 24px rgba(0,0,0,.4);
    font: 500 13px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Noto Sans";
    opacity: 0;
    transform: translateY(6px);
    transition: opacity .18s ease, transform .18s ease;
    pointer-events: none;
  }
  .sdx-toast.show {
    opacity: 1;
    transform: translateY(0);
  }
  .sdx-toast.ok { border-left: 4px solid #2ecc71; }
  .sdx-toast.err { border-left: 4px solid #e74c3c; }
  `;

  // --- Utilities ---
  const isStoriesUrl = () => /\/stories\//i.test(location.pathname);
  const isFacebook = () => /facebook\.com$/i.test(location.hostname) || /(^|\.)facebook\.com$/i.test(location.hostname);

  const ensureCSS = () => {
    if (typeof GM_addStyle === "function") {
      GM_addStyle(CSS);
    } else if (!document.getElementById("sdx-style")) {
      const s = document.createElement("style");
      s.id = "sdx-style";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  };

  const toast = (msg, type = "ok", timeout = 2200) => {
    let t = document.createElement("div");
    t.className = `sdx-toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    // force reflow for transition
    // eslint-disable-next-line no-unused-expressions
    t.offsetHeight;
    t.classList.add("show");
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 200);
    }, timeout);
  };

  const filenameSanitize = (s, fallback = "unknown") =>
    (s || fallback).replace(/[^\w.\-]+/g, "_").slice(0, 80) || fallback;

  // --- Button lifecycle ---
  const ensureButton = () => {
    let btn = document.getElementById("sdx-btn");
    if (btn) return btn;

    btn = document.createElement("button");
    btn.id = "sdx-btn";
    btn.title = "Download this story (video/image)";
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true" viewBox="0 0 16 16">
        <path fill="currentColor" d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-4 4.5a.5.5 0 0 1 .5.5v5.293l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 10.293V5a.5.5 0 0 1 .5-.5Z"/>
      </svg>
      <span>Download</span>
    `;
    btn.addEventListener("click", onDownloadClick);
    document.body.appendChild(btn);
    return btn;
  };

  const showButtonIfStories = () => {
    const btn = ensureButton();
    btn.style.display = isStoriesUrl() ? "inline-flex" : "none";
  };

  // Observe SPA URL changes (pushState/replaceState/popstate) and DOM churn.
  const hookHistory = () => {
    const wrap = (type) => {
      const orig = history[type];
      if (typeof orig === "function") {
        history[type] = function () {
          const ret = orig.apply(this, arguments);
          setTimeout(showButtonIfStories, 0);
          return ret;
        };
      }
    };
    wrap("pushState");
    wrap("replaceState");
    window.addEventListener("popstate", showButtonIfStories);
  };

  const observeDom = () => {
    const mo = new MutationObserver(() => {
      // Cheap throttle via microtask; only cares about URL mode.
      showButtonIfStories();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  };

  // --- Media detection (robust) ---
  const findVideoUrl = () => {
    const vids = Array.from(document.querySelectorAll("video")).filter(v => v.offsetHeight > 0);
    for (const v of vids) {
      if (v.currentSrc) return v.currentSrc;
      if (v.src) return v.src;
      const s = v.querySelector("source[src]");
      if (s?.src) return s.src;

      // React internals (FB often)
      const fiberKey = Object.keys(v).find(k => k.startsWith("__reactFiber"));
      if (fiberKey) {
        const suffix = fiberKey.replace("__reactFiber", "");
        const parent = v.parentElement?.parentElement?.parentElement?.parentElement;
        const props = parent?.[`__reactProps${suffix}`];

        const impl =
          props?.children?.[0]?.props?.children?.props?.implementations ??
          props?.children?.props?.children?.props?.implementations;

        if (impl && Array.isArray(impl)) {
          for (const idx of [1, 0, 2]) {
            const data = impl[idx]?.data;
            const url = data?.hdSrc || data?.sdSrc || data?.hd_src || data?.sd_src || data?.src;
            if (url) return url;
          }
        }

        const vd = v[fiberKey]?.return?.stateNode?.props?.videoData?.$1;
        const url2 = vd?.hd_src || vd?.sd_src || vd?.src;
        if (url2) return url2;
      }
    }
    return null;
  };

  const findImageUrl = () => {
    const imgs = Array.from(document.querySelectorAll("img")).filter(img =>
      img.offsetHeight > 0 && (img.naturalWidth >= 400 || img.naturalHeight >= 400)
    );
    // Prefer CDNs used by FB/IG stories
    const cdn = imgs.find(img => /fbcdn|cdninstagram|scontent|fna\.fbcdn/i.test(img.src));
    return (cdn || imgs[0])?.src || null;
  };

  const findCandidateFilename = (isVideo) => {
    // Try to extract username or visible display name
    let name = "unknown";

    if (isFacebook()) {
      // Any visible text element at the top may contain the poster's name; keep it simple
      const span = Array.from(document.querySelectorAll("span"))
        .find(el => el instanceof HTMLElement && el.offsetWidth > 0 && el.offsetHeight > 0 && el.innerText?.trim());
      name = (span?.innerText || "").trim() || name;
    } else {
      // IG: anchors or aria labels near header
      const a = Array.from(document.querySelectorAll("a"))
        .find(u => u instanceof HTMLAnchorElement &&
          u.offsetHeight > 0 &&
          /\/stories\/|\/[^/]+$/.test(u.getAttribute("href") || "") &&
          (u.innerText || u.getAttribute("title") || u.getAttribute("aria-label")));
      name = (a?.innerText || a?.getAttribute("title") || a?.getAttribute("aria-label") || "").trim() || name;
    }

    name = filenameSanitize(name);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `${name}-${stamp}.${isVideo ? "mp4" : "jpg"}`;
  };

  // --- Download (prefers GM_download, then <a>, then fetch blob) ---
  const doDownload = async (url, filename) => {
    if (typeof GM_download === "function") {
      await new Promise((res, rej) => {
        try {
          GM_download({
            url,
            name: filename,
            onload: () => res(),
            ontimeout: () => rej(new Error("Download timed out")),
            onerror: e => rej(new Error(e?.error || "GM_download failed")),
          });
        } catch (e) { rej(e); }
      });
      return;
    }

    // Try native link first (often works even when fetch is CORS-blocked)
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    } catch { /* fallthrough */ }

    // Blob fallback (may fail on strict CORS endpoints)
    const resp = await fetch(url, { credentials: "include" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const blob = await resp.blob();
    const obj = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = obj;
    a2.download = filename;
    document.body.appendChild(a2);
    a2.click();
    a2.remove();
    URL.revokeObjectURL(obj);
  };

  // --- Click handler ---
  async function onDownloadClick() {
    try {
      const v = findVideoUrl();
      let url, isVideo = false;
      if (v) {
        url = v;
        isVideo = true;
      } else {
        const img = findImageUrl();
        if (img) url = img;
      }

      if (!url) {
        toast("No story media found here.", "err");
        return;
      }

      const fname = findCandidateFilename(isVideo);
      await doDownload(url, fname);
      toast(`Saved: ${fname}`, "ok");
    } catch (e) {
      log("Download failed", e);
      toast(`Download failed: ${e?.message || e}`, "err", 3000);
    }
  }

  // --- Boot ---
  ensureCSS();
  hookHistory();
  observeDom();
  showButtonIfStories();

  // Optional: quick keyboard shortcut (Alt+D) on stories pages
  document.addEventListener("keydown", (ev) => {
    if (!isStoriesUrl()) return;
    if (ev.altKey && !ev.shiftKey && !ev.ctrlKey && !ev.metaKey && ev.code === "KeyD") {
      ev.preventDefault();
      onDownloadClick();
    }
  });
})();
