// ==UserScript==
// @name         Story Downloader - Facebook & Instagram (Desktop — Icon Fallback)
// @namespace    https://github.com/oscar370
// @version      2.2.0
// @description  Download stories (videos/images) from facebook.com and instagram.com (desktop). Small icon fallback top-right if UI insertion fails. Dev logs ON for testing.
// @author       patched
// @match        *://*.facebook.com/*
// @match        *://*.instagram.com/*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/551450/Story%20Downloader%20-%20Facebook%20%20Instagram%20%28Desktop%20%E2%80%94%20Icon%20Fallback%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551450/Story%20Downloader%20-%20Facebook%20%20Instagram%20%28Desktop%20%E2%80%94%20Icon%20Fallback%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // CONFIG
  const POLL_INTERVAL_MS = 300;
  const MAX_POLL_ATTEMPTS = 120; // ~36s before guaranteed fallback shown (but fallback will also show earlier if needed)
  const TOAST_ZINDEX = 2147483647;
  const isDev = true; // set to false after testing

  class StoryDownloader {
    constructor() {
      this.mediaUrl = null;
      this.detectedVideo = false;
      this._poller = null;
      this._toastTimer = null;
      this._attempts = 0;
      this.init();
    }

    init() {
      this.log("init");
      this.injectStyles();
      this.setupObservers();
      this.checkPageStructure(); // run initial check
      window.addEventListener("popstate", () => this.checkPageStructure());
    }

    log(...args) {
      if (isDev) console.log("[SD]", ...args);
    }

    // -------------------------
    // Page checks
    // -------------------------
    checkPageStructure() {
      const onStory = this._isStoryUrl() || this._looksLikeStoryModal();
      this.log("checkPageStructure - onStory:", onStory);
      if (onStory) {
        this.startPollingForButton();
      } else {
        this.removeAllUI();
        this.stopPollingForButton();
      }
    }

    _isStoryUrl() {
      try {
        return /(\/stories\/|\/reels\/|\/stories$|\/stories\/\d+)/i.test(location.href);
      } catch (e) {
        return false;
      }
    }

    _looksLikeStoryModal() {
      try {
        const dialog = document.querySelector('div[role="dialog"], [role="presentation"]');
        if (dialog && dialog.querySelector("video, img, [style*='background-image']")) return true;
        // FB-specific hints
        if (document.querySelector('[data-pagelet*="Story"], [aria-label*="Story"]')) return true;
      } catch (e) { /* ignore */ }
      return false;
    }

    // -------------------------
    // Styles & small icon button
    // -------------------------
    injectStyles() {
      if (document.getElementById("sd-styles")) return;
      const style = document.createElement("style");
      style.id = "sd-styles";
      style.textContent = `
        #sd-download-icon {
          position: fixed;
          top: 10px;
          right: 10px;
          width: 40px;
          height: 40px;
          background: rgba(0,0,0,0.6);
          color: white;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: ${TOAST_ZINDEX};
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0,0,0,0.35);
          transition: transform .12s ease;
        }
        #sd-download-icon:hover { transform: translateY(-2px); }
        #downloadBtn { border: none; background: transparent; color: inherit; cursor: pointer; }
        #sd-toast {
          position: fixed;
          right: 12px;
          top: 60px;
          z-index: ${TOAST_ZINDEX};
          background: rgba(0,0,0,0.85);
          color: #fff;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          max-width: 360px;
          word-break: break-word;
        }
      `;
      document.head.appendChild(style);
    }

    showToast(text, duration = 2500) {
      try {
        let toast = document.getElementById("sd-toast");
        if (!toast) {
          toast = document.createElement("div");
          toast.id = "sd-toast";
          document.body.appendChild(toast);
        }
        toast.textContent = text;
        if (this._toastTimer) clearTimeout(this._toastTimer);
        if (duration > 0) {
          this._toastTimer = setTimeout(() => {
            try { toast.remove(); } catch (e) {}
            this._toastTimer = null;
          }, duration);
        }
      } catch (e) { this.log("toast error", e); }
    }

    removeAllUI() {
      try {
        const b = document.getElementById("downloadBtn"); if (b) b.remove();
        const f = document.getElementById("sd-download-icon"); if (f) f.remove();
        const t = document.getElementById("sd-toast"); if (t) t.remove();
      } catch (e) { /* ignore */ }
    }

    // -------------------------
    // Poll for UI & insert button
    // -------------------------
    startPollingForButton() {
      if (this._poller) return;
      this._attempts = 0;
      this._poller = setInterval(() => {
        this._attempts++;
        this.log("poll attempt", this._attempts);

        // if story no longer present stop
        if (!this._isStoryUrl() && !this._looksLikeStoryModal()) {
          this.stopPollingForButton();
          return;
        }

        // if already injected, skip
        if (document.getElementById("downloadBtn") || document.getElementById("sd-download-icon")) {
          // keep it visible if present
          if (this._attempts === 1) this.log("button already present");
          return;
        }

        // try insertion targets
        const tryInsert = this._insertIntoTopBar() || this._insertIntoDialog() || null;
        if (tryInsert) {
          this.log("Inserted into page UI", tryInsert);
          return;
        }

        // after some attempts, ensure fallback icon exists
        if (this._attempts >= 6) {
          this.log("creating guaranteed fallback icon");
          this._createFallbackIcon(); // idempotent
        }

        // if beyond max attempts, keep fallback, but keep polling in case topbar appears.
        if (this._attempts >= MAX_POLL_ATTEMPTS) {
          this.log("max attempts reached — keeping fallback icon");
        }
      }, POLL_INTERVAL_MS);
    }

    stopPollingForButton() {
      if (this._poller) {
        clearInterval(this._poller);
        this._poller = null;
      }
    }

    _createFallbackIcon() {
      if (document.getElementById("sd-download-icon")) return document.getElementById("sd-download-icon");
      const icon = document.createElement("div");
      icon.id = "sd-download-icon";
      icon.title = "Download story";
      icon.innerHTML = `
        <button id="downloadBtn" aria-label="Download story" style="all:unset;display:inline-flex;align-items:center;justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M.5 9.9v3.6A1 1 0 0 0 1.5 15h13a1 1 0 0 0 1-1.5V9.9a.5.5 0 0 0-1 0v3.6a.001.001 0 0 1-.001.001H1.5a.001.001 0 0 1-.001-.001V9.9a.5.5 0 0 0-1 0zM8 0a.5.5 0 0 0-.5.5V9H5.354a.5.5 0 0 0-.354.854l2.647 2.646a.5.5 0 0 0 .707 0L10.999 9.854a.5.5 0 0 0-.354-.854H8V.5A.5.5 0 0 0 8 0z"/>
          </svg>
        </button>
      `;
      // click handled by the inner button
      icon.querySelector("#downloadBtn").addEventListener("click", () => this._onClickDownload());
      document.body.appendChild(icon);
      return icon;
    }

    _insertIntoTopBar() {
      const selectors = [
        'header[role="banner"]',
        '[role="toolbar"]',
        '[data-testid="story-header"]',
        'div[aria-label*="Story"]',
        'div[style*="position: sticky"][style*="top"]',
        'div[style*="position: fixed"][style*="top"]'
      ];
      for (const sel of selectors) {
        try {
          const nodes = Array.from(document.querySelectorAll(sel)).filter(n => n instanceof HTMLElement && n.offsetParent !== null);
          if (!nodes.length) continue;
          for (const node of nodes) {
            if (node.querySelector("#downloadBtn")) return node.querySelector("#downloadBtn");
            try {
              const btn = this._createPageButton();
              node.appendChild(btn);
              return btn;
            } catch (e) {
              this.log("append failed for selector", sel, e);
              try {
                const btn = this._createPageButton();
                node.insertBefore(btn, node.firstChild);
                return btn;
              } catch (e2) {
                this.log("insertBefore failed", e2);
                continue;
              }
            }
          }
        } catch (e) { this.log("selector error", sel, e); }
      }
      return null;
    }

    _insertIntoDialog() {
      const dialog = document.querySelector('div[role="dialog"], [role="presentation"]');
      if (!dialog || !(dialog instanceof HTMLElement) || dialog.offsetParent === null) return null;
      // try to find a top-right or toolbar inside the dialog
      const candidate = dialog.querySelector('[role="toolbar"], header, div[style*="position: absolute"], div[style*="position: fixed"]');
      if (candidate && candidate instanceof HTMLElement && candidate.offsetParent !== null) {
        if (candidate.querySelector("#downloadBtn")) return candidate.querySelector("#downloadBtn");
        try {
          const btn = this._createPageButton();
          candidate.appendChild(btn);
          return btn;
        } catch (e) {
          this.log("dialog append failed", e);
          try {
            const btn = this._createPageButton();
            candidate.insertBefore(btn, candidate.firstChild);
            return btn;
          } catch (e2) { this.log("dialog insert failed", e2); }
        }
      }
      return null;
    }

    _createPageButton() {
      if (document.getElementById("downloadBtn")) return document.getElementById("downloadBtn");
      const btn = document.createElement("button");
      btn.id = "downloadBtn";
      btn.title = "Download story";
      btn.style.all = "unset";
      btn.style.cursor = "pointer";
      btn.style.display = "inline-flex";
      btn.style.alignItems = "center";
      btn.style.gap = "6px";
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 0a.5.5 0 0 0-.5.5V8H5.354a.5.5 0 0 0-.354.854l2.647 2.646a.5.5 0 0 0 .707 0L10.999 8.854A.5.5 0 0 0 10.646 8H8V.5A.5.5 0 0 0 8 0z"/>
        </svg>
      `;
      btn.addEventListener("click", () => this._onClickDownload());
      return btn;
    }

    // -------------------------
    // Download flow
    // -------------------------
    async _onClickDownload() {
      this.showToast("Detecting story...");
      try {
        await this._detectMedia();
        if (!this.mediaUrl) throw new Error("No media detected");
        const filename = this._generateFileName();
        await this._downloadResource(this.mediaUrl, filename);
        this.showToast(`Saved: ${filename}`, 3200);
      } catch (err) {
        this.log("download error", err);
        this.showToast(`Download failed: ${err?.message || "unknown"}`, 4500);
      }
    }

    async _detectMedia() {
      this.mediaUrl = null;
      this.detectedVideo = false;

      // 1) direct video elements
      const v = this._scanForVideoDirect();
      if (v) { this.mediaUrl = v; this.detectedVideo = true; this.log("video direct", v); return; }

      // 2) meta og:video
      const metaV = this._readMeta(['og:video', 'og:video:url', 'og:video:secure_url']);
      if (metaV) { this.mediaUrl = metaV; this.detectedVideo = true; this.log("video meta", metaV); return; }

      // 3) images
      const imgElemOrUrl = this._scanForImageDirect();
      if (imgElemOrUrl) {
        this.mediaUrl = typeof imgElemOrUrl === "string" ? imgElemOrUrl : (imgElemOrUrl.src || this._getBackgroundUrl(imgElemOrUrl));
        this.detectedVideo = false;
        this.log("image direct", this.mediaUrl);
        return;
      }

      // 4) meta image
      const metaImg = this._readMeta(['og:image', 'twitter:image']);
      if (metaImg) { this.mediaUrl = metaImg; this.detectedVideo = false; this.log("image meta", metaImg); return; }

      // 5) React internal fallback
      const react = this._detectVideoViaReact();
      if (react) { this.mediaUrl = react; this.detectedVideo = true; this.log("react fallback", react); return; }

      this.log("no media after all strategies");
    }

    _scanForVideoDirect() {
      try {
        const vids = Array.from(document.querySelectorAll("video")).filter(v => v instanceof HTMLVideoElement && v.offsetParent !== null && v.offsetHeight > 8 && v.offsetWidth > 8);
        for (const v of vids) {
          const src = v.currentSrc || v.src || (v.querySelector('source') && v.querySelector('source').src);
          if (src) return src;
        }
        const sources = Array.from(document.querySelectorAll("source")).map(s => s.src).filter(Boolean);
        if (sources.length) return sources[0];
      } catch (e) { this.log("video scan error", e); }
      return null;
    }

    _scanForImageDirect() {
      try {
        const imgs = Array.from(document.querySelectorAll("img")).filter(img => img instanceof HTMLImageElement && img.offsetParent !== null && img.naturalWidth >= 120 && img.naturalHeight >= 120 && img.src && !img.src.startsWith("data:"));
        if (imgs.length) {
          const cdn = imgs.find(i => /cdn|fbcdn|instagram|akama|akamai|cdninstagram/i.test(i.src));
          return cdn || imgs[0];
        }
        const elems = Array.from(document.querySelectorAll("div, span")).filter(e => {
          try { return e.offsetParent !== null && window.getComputedStyle(e).backgroundImage && window.getComputedStyle(e).backgroundImage !== "none"; } catch (e) { return false; }
        });
        if (elems.length) return elems[0];
      } catch (e) { this.log("image scan error", e); }
      return null;
    }

    _readMeta(names = []) {
      try {
        for (const key of names) {
          const el = document.querySelector(`meta[property="${key}"], meta[name="${key}"], meta[itemprop="${key}"]`);
          if (el && el.content) return el.content;
        }
      } catch (e) { /* ignore */ }
      return null;
    }

    _getBackgroundUrl(el) {
      try {
        if (!el) return null;
        const bg = window.getComputedStyle(el).backgroundImage;
        if (!bg || bg === "none") return null;
        const m = bg.match(/url\\((?:'|")?(.*?)(?:'|")?\\)/);
        return m ? m[1] : null;
      } catch (e) { return null; }
    }

    _detectVideoViaReact() {
      try {
        const videos = Array.from(document.querySelectorAll("video")).filter(v => v instanceof HTMLVideoElement);
        for (const video of videos) {
          const keys = Object.keys(video).filter(k => k.startsWith("__react") || k.startsWith("_react"));
          if (!keys.length) continue;
          for (const k of keys) {
            try {
              const fiber = video[k];
              const parent = video.parentElement?.parentElement?.parentElement?.parentElement;
              const reactKey = k.replace("__reactFiber", "");
              const props = parent?.[`__reactProps${reactKey}`] || parent?.props || fiber?.return?.stateNode?.props || {};
              const impl = props?.children?.[0]?.props?.children?.props?.implementations || props?.implementations || props?.videoData || {};
              if (Array.isArray(impl)) {
                for (const c of impl) {
                  const url = c?.data?.hdSrc || c?.data?.sdSrc || c?.data?.hd_src || c?.data?.sd_src || c?.data?.url || c?.url;
                  if (url) return url;
                }
              } else {
                const url = impl?.hdSrc || impl?.sdSrc || impl?.hd_src || impl?.sd_src || impl?.url;
                if (url) return url;
              }
              const videoData = fiber?.return?.stateNode?.props?.videoData || {};
              const alt = videoData?.$1 || videoData;
              if (alt) return alt.hd_src || alt.sd_src || alt.url || null;
            } catch (e) { this.log("react inner error", e); }
          }
        }
      } catch (e) { this.log("react fallback error", e); }
      return null;
    }

    // -------------------------
    // File naming & sanitize
    // -------------------------
    _generateFileName() {
      const date = new Date().toISOString().split("T")[0];
      let name = this._extractUserName() || (location.hostname.includes("facebook") ? "facebook-user" : "instagram-user");
      name = String(name).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 64) || "user";
      const ext = this.detectedVideo ? "mp4" : "jpg";
      return `${name}-${date}.${ext}`;
    }

    _extractUserName() {
      try {
        const og = document.querySelector('meta[property="og:title"]')?.content;
        if (og) return og.split(" - ")[0].split("|")[0].trim();
        const canonical = document.querySelector('link[rel="canonical"]')?.href;
        if (canonical) {
          const parts = new URL(canonical).pathname.split("/").filter(Boolean);
          if (parts.length) return parts[parts.length - 1];
        }
        const anchor = Array.from(document.querySelectorAll('a[href*="/stories/"], a[href*="/"]')).find(a => {
          try { const h = a.getAttribute("href"); return h && !h.includes("http") && h.split("/").length <= 3 && h !== "/"; } catch (e) { return false; }
        });
        if (anchor) return anchor.pathname.replace(/\//g, "");
        const texts = Array.from(document.querySelectorAll("h1,h2,span,strong")).map(n => n.textContent?.trim()).filter(Boolean);
        if (texts.length) return texts.sort((a,b)=>a.length-b.length)[0];
      } catch (e) { /* ignore */ }
      return null;
    }

    // -------------------------
    // Download helper
    // -------------------------
    async _downloadResource(url, filename) {
      if (!url) throw new Error("No url");
      try {
        if (url.startsWith("blob:") || url.startsWith("data:")) {
          this._triggerAnchorDownload(url, filename);
          return;
        }
      } catch (e) {}

      try {
        const resp = await fetch(url, { credentials: "include" });
        if (!resp.ok) throw new Error(`Network error ${resp.status}`);
        const blob = await resp.blob();
        const objectUrl = URL.createObjectURL(blob);
        try {
          this._triggerAnchorDownload(objectUrl, filename);
        } finally {
          setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
        }
        return;
      } catch (err) {
        this.log("fetch failed; opening in new tab as fallback", err);
        try {
          window.open(url, "_blank");
          this.showToast("Opened media in new tab. Right-click > Save as...", 4500);
          return;
        } catch (e) {
          throw new Error("Unable to fetch or open the resource.");
        }
      }
    }

    _triggerAnchorDownload(href, filename) {
      const a = document.createElement("a");
      a.href = href;
      a.download = filename || "";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { try { a.remove(); } catch (e) {} }, 80);
    }
  }

  // start
  try {
    new StoryDownloader();
    console.log("[SD] StoryDownloader injected (dev logs ON).");
  } catch (e) {
    console.error("[SD] init failed", e);
  }
})();
