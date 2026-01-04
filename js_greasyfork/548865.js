// ==UserScript==
// @name         Reddit Video Download (Best Quality on Player)
// @description  Adds a single Download button on Reddit video player in feed, always best MP4
// @version      0.6
// @author       GPT
// @match        https://www.reddit.com/*
// @match        https://*.reddit.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @namespace https://greasyfork.org/users/1203953
// @downloadURL https://update.greasyfork.org/scripts/548865/Reddit%20Video%20Download%20%28Best%20Quality%20on%20Player%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548865/Reddit%20Video%20Download%20%28Best%20Quality%20on%20Player%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BTN_CLASS = "rvdl-btn";

  const sanitizeFilename = (s) =>
    (s || "reddit-video")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, " ")
      .slice(0, 120) || "reddit-video";

  const gmDownload = (url, filename) =>
    new Promise((resolve, reject) => {
      if (typeof GM_download === "function") {
        GM_download({
          url,
          name: filename,
          ontimeout: reject,
          onerror: reject,
          onload: resolve,
        });
      } else {
        fetch(url)
          .then((r) => r.blob())
          .then((blob) => {
            const a = document.createElement("a");
            const link = URL.createObjectURL(blob);
            a.href = link;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              URL.revokeObjectURL(link);
              a.remove();
            }, 0);
            resolve();
          })
          .catch(reject);
      }
    });

  const parsePackagedMedia = (player) => {
    const raw = player.getAttribute("packaged-media-json");
    if (!raw) return [];
    try {
      const text = raw.replace(/&quot;/g, '"');
      const json = JSON.parse(text);
      const perms = json?.playbackMp4s?.permutations || [];
      return perms
        .map((p) => ({
          url: p?.source?.url,
          width: p?.source?.dimensions?.width,
          height: p?.source?.dimensions?.height,
        }))
        .filter((x) => x.url)
        .sort((a, b) => b.width - a.width);
    } catch (e) {
      console.warn("[RVDL] parse error", e);
      return [];
    }
  };

  const insertButton = (post, player, options, title) => {
    if (player.dataset.rvdlDone === "1") return;
    player.dataset.rvdlDone = "1";

    const best = options[0];
    if (!best) return;

    // оборачиваем контейнер для позиционирования
    const host = player.closest("div[slot='post-media-container']") || player.parentElement;
    if (!host) return;
    host.style.position = host.style.position || "relative";

    const btn = document.createElement("button");
    btn.className = BTN_CLASS;
    btn.textContent = "Download";
    btn.title = `Download best quality (${best.width}x${best.height})`;

    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        const filename = `${sanitizeFilename(title)}_${best.width}x${best.height}.mp4`;
        await gmDownload(best.url, filename);
      } catch (err) {
        alert("Download failed: " + err);
      }
    });

    host.appendChild(btn);
  };

  const ensureStyle = () => {
    if (document.getElementById("rvdl-style")) return;
    const style = document.createElement("style");
    style.id = "rvdl-style";
    style.textContent = `
      .${BTN_CLASS} {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #000;
        color: #fff;
        border: 1px solid #444;
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 13px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        cursor: pointer;
        opacity: 0.85;
      }
      .${BTN_CLASS}:hover { background: #222; opacity: 1; }
    `;
    document.head.appendChild(style);
  };

  const scan = () => {
    document.querySelectorAll("shreddit-post[post-type='video']").forEach((post) => {
      const player = post.querySelector("shreddit-player-2, shreddit-player");
      if (!player) return;
      const opts = parsePackagedMedia(player);
      if (!opts.length) return;
      const title =
        post.getAttribute("post-title") ||
        post.querySelector('a[slot="title"]')?.textContent ||
        "reddit-video";
      insertButton(post, player, opts, title);
    });
  };

  const init = () => {
    ensureStyle();
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
