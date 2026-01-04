// ==UserScript==
// @name         destiny.gg Kick iframe -> HLS player
// @namespace    tuur-kick-replacer
// @version      1.8
// @description  Replace Kick embed iframe with HTML5 video using hls.js in Chrome/Firefox, bypassing CORS via GM_xmlhttpRequest. Logs playback URL.
// @match        https://destiny.gg/*
// @match        https://www.destiny.gg/*
// @grant        GM_xmlhttpRequest
// @connect      kick.com
// @connect      player.kick.com
// @connect      live-video.net
// @connect      *.live-video.net
// @connect      *.playback.live-video.net
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556687/destinygg%20Kick%20iframe%20-%3E%20HLS%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/556687/destinygg%20Kick%20iframe%20-%3E%20HLS%20player.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const IFRAME_SELECTOR =
    'iframe.embed-frame[src*="player.kick.com/"], iframe[src*="player.kick.com/"]';

  const seen = new WeakSet();

  function extractSlug(src) {
    try {
      const u = new URL(src);
      const path = u.pathname.replace(/^\/+/, "").trim();
      if (!path) return null;
      return path.split("/")[0];
    } catch {
      return null;
    }
  }

  function gmGetJSON(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { Accept: "application/json" },
        onload: (res) => {
          try { resolve(JSON.parse(res.responseText)); }
          catch (e) { reject(e); }
        },
        onerror: reject,
      });
    });
  }

  // ---- CORS-bypassing HLS loader ----
  // ---- CORS-bypassing HLS loader (Fixed for Firefox & HLS.js 1.5+) ----
  class GMLoader {
    constructor(config) {
      this.config = config;
      this.req = null;
      this.aborted = false;

      // Initialize stats with ALL required sub-objects (loading, parsing, buffering)
      this.stats = {
        aborted: false,
        retry: 0,
        loaded: 0,
        total: 0,
        trequest: 0,
        tfirst: 0,
        tload: 0,
        loading: { start: 0, first: 0, end: 0 },
        parsing: { start: 0, end: 0 },
        buffering: { start: 0, first: 0, end: 0 }, // FIX: This was missing
        bwEstimate: 0,
        chunkCount: 0,
      };

      this.context = null;
      this.url = null;
    }

    destroy() {
      this.abort();
      this.req = null;
      this.config = null;
      this.context = null;
      this.url = null;
      // FIX: Do NOT set this.stats = null.
    }

    abort() {
      this.aborted = true;
      if (this.req && this.req.abort) {
        try { this.req.abort(); } catch (e) {}
      }
    }

    load(context, config, callbacks) {
      this.aborted = false;
      this.context = context;
      this.url = context.url;

      if (!context.type && context.frag?.type) {
        context.type = context.frag.type;
      }
      if (!context.type) context.type = "fragment";

      const isBinary =
        context.responseType === "arraybuffer" ||
        context.responseType === "blob";

      const trequest = performance.now();

      // Reset stats for this request
      this.stats.trequest = trequest;
      this.stats.loading.start = trequest;
      this.stats.loaded = 0;
      this.stats.total = 0;
      this.stats.chunkCount = 0;
      this.stats.aborted = false;
      // Reset sub-objects timing
      this.stats.loading = { start: trequest, first: 0, end: 0 };
      this.stats.parsing = { start: 0, end: 0 };
      this.stats.buffering = { start: 0, first: 0, end: 0 };

      const gmOpts = {
        method: "GET",
        url: context.url,
        headers: context.headers || {},
        timeout: config.timeout || 20000,
        responseType: isBinary ? "arraybuffer" : undefined,

        // Add onprogress to help HLS calculate bandwidth
        onprogress: (res) => {
           if (this.aborted) return;
           const now = performance.now();

           const loaded = res.loaded || res.position || 0;
           const total = res.total || res.totalSize || 0;

           this.stats.loading.first = this.stats.loading.first || now;
           this.stats.loaded = loaded;
           this.stats.total = total;

           if (callbacks.onProgress) {
              callbacks.onProgress(this.stats, context, null, res);
           }
        },

        onload: (res) => {
          if (this.aborted) return;

          const ok = res.status >= 200 && res.status < 300;
          const now = performance.now();

          this.stats.tload = now;
          this.stats.loading.first = this.stats.loading.first || now;
          this.stats.loading.end = now;
          this.stats.parsing.start = now;
          this.stats.parsing.end = now;
          this.stats.buffering.start = now;
          this.stats.buffering.first = now;
          this.stats.buffering.end = now;

          if (!ok) {
            callbacks.onError(
              { code: res.status, text: res.statusText || "HTTP error" },
              context,
              res
            );
            return;
          }

          const data = res.response;

          const len = isBinary
            ? (data ? data.byteLength : 0)
            : (res.responseText ? res.responseText.length : 0);

          this.stats.loaded = len;
          this.stats.total = len;
          this.stats.chunkCount = 1;

          const duration = (now - trequest);
          if (duration > 0 && len > 0) {
             this.stats.bwEstimate = (len * 8) / (duration / 1000);
          }

          callbacks.onSuccess(
            {
              url: res.finalUrl || context.url,
              data: data || res.responseText,
            },
            this.stats,
            context,
            res
          );
        },

        ontimeout: () => {
          if (this.aborted) return;
          const now = performance.now();
          this.stats.tload = now;
          this.stats.loading.end = now;
          callbacks.onTimeout(this.stats, context, null);
        },

        onerror: (err) => {
          if (this.aborted) return;
          const now = performance.now();
          this.stats.tload = now;
          this.stats.loading.end = now;
          callbacks.onError(
            { code: err?.status || 0, text: err?.statusText || "GM error" },
            context,
            err || null
          );
        },
      };

      this.req = GM_xmlhttpRequest(gmOpts);
    }
  }

  function makeWrapper() {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.background = "black";
    wrapper.style.aspectRatio = "16 / 9";

    const label = document.createElement("div");
    label.textContent = "Loading Kick stream…";
    label.style.position = "absolute";
    label.style.inset = "0";
    label.style.display = "grid";
    label.style.placeItems = "center";
    label.style.color = "white";
    label.style.fontSize = "14px";
    label.style.opacity = "0.8";
    wrapper.appendChild(label);

    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.display = "block";
    video.style.background = "black";
    wrapper.appendChild(video);

    return { wrapper, video, label };
  }

  function attachHls(video, m3u8Url, label) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = m3u8Url; // Safari native HLS
      label.remove();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        lowLatencyMode: true,
        backBufferLength: 30,
        loader: GMLoader,
        enableWorker: false,
      });

      hls.loadSource(m3u8Url);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        label.remove();
        video.play().catch(() => {});
      });

      hls.on(window.Hls.Events.ERROR, (evt, data) => {
        console.warn("[tm-kick] HLS error", data);
      });

      video._tm_hls = hls;
      return;
    }

    video.src = m3u8Url;
    label.textContent = "Your browser can’t play HLS here.";
  }

  async function replaceIframe(iframe) {
    if (seen.has(iframe)) return;
    seen.add(iframe);

    const slug = extractSlug(iframe.src);
    if (!slug) return;

    const apiUrl = `https://kick.com/api/v2/channels/${encodeURIComponent(slug)}/playback-url`;

    let playback;
    try {
      playback = await gmGetJSON(apiUrl);
    } catch (e) {
      console.error("[tm-kick] Failed fetching playback-url", e);
      return;
    }

    const m3u8Url = playback?.data;
    if (!m3u8Url) return;

    console.log(`[tm-kick] Kick playback for ${slug}:`, m3u8Url);

    const { wrapper, video, label } = makeWrapper();
    attachHls(video, m3u8Url, label);

    iframe.parentElement?.replaceChild(wrapper, iframe);
  }

  function scan() {
    document.querySelectorAll(IFRAME_SELECTOR).forEach(replaceIframe);
  }

  scan();
  new MutationObserver(scan).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
