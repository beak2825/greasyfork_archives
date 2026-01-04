// ==UserScript==
// @name         WWDC Subtitle Downloader
// @namespace    https://github.com/lixiaolin94
// @version      1.0.0
// @description  Download subtitles from Apple WWDC session videos
// @author       lixiaolin94
// @license      CC BY-NC-ND 4.0
// @match        https://developer.apple.com/videos/play/wwdc*/*
// @grant        GM_xmlhttpRequest
// @connect      devstreaming-cdn.apple.com
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/560713/WWDC%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560713/WWDC%20Subtitle%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ============ 配置 ============
  const CONCURRENCY = 10;
  const LANGUAGES = [
    { code: "eng", name: "English" },
    { code: "zho", name: "简体中文" },
    { code: "jpn", name: "日本語" },
    { code: "kor", name: "한국어" },
    { code: "deu", name: "Deutsch" },
    { code: "fra", name: "Français" },
    { code: "spa", name: "Español" },
  ];
  const CDN_PATTERNS = [
    /(https:\/\/devstreaming-cdn\.apple\.com\/videos\/wwdc\/\d{4}\/\d+\/\d+\/[A-Fa-f0-9-]+)/,
    /(https:\/\/devstreaming-cdn\.apple\.com\/videos\/wwdc\/\d{4}\/\d+[a-z0-9]+\/\d+)/,
  ];

  // ============ 图标 ============
  const ICON_DOWNLOAD = `<svg viewBox="0 0 24 24"><path d="M11.8193 21.9561C17.3174 21.9561 21.7803 17.4932 21.7803 11.9951C21.7803 6.49707 17.3174 2.03418 11.8193 2.03418C6.32129 2.03418 1.8584 6.49707 1.8584 11.9951C1.8584 17.4932 6.32129 21.9561 11.8193 21.9561ZM11.8193 20.2959C7.22949 20.2959 3.51856 16.585 3.51856 11.9951C3.51856 7.40527 7.22949 3.69434 11.8193 3.69434C16.4092 3.69434 20.1201 7.40527 20.1201 11.9951C20.1201 16.585 16.4092 20.2959 11.8193 20.2959Z"/><path d="M11.8193 7.07324C11.3994 7.07324 11.0478 7.41504 11.0478 7.8252V13.3135L11.1162 15.3545C11.1357 15.794 11.4678 16.0283 11.8193 16.0283C12.1709 16.0283 12.5127 15.794 12.5225 15.3545L12.6006 13.3135V7.8252C12.6006 7.41504 12.2393 7.07324 11.8193 7.07324ZM11.8193 16.917C12.0146 16.917 12.1904 16.8584 12.3857 16.6631L15.5986 13.5576C15.7549 13.4112 15.833 13.2549 15.833 13.0401C15.833 12.6397 15.5303 12.3565 15.1201 12.3565C14.9346 12.3565 14.7295 12.4346 14.5928 12.5908L13.1084 14.1729L11.8193 15.5401L10.5303 14.1729L9.04589 12.5908C8.90917 12.4346 8.69433 12.3565 8.50878 12.3565C8.09862 12.3565 7.80566 12.6397 7.80566 13.0401C7.80566 13.2549 7.88378 13.4112 8.03027 13.5576L11.2529 16.6631C11.4482 16.8584 11.624 16.917 11.8193 16.917Z"/></svg>`;
  const ICON_STOP = `<svg viewBox="0 0 24 24"><path d="M11.8193 21.9561C17.3174 21.9561 21.7803 17.4932 21.7803 11.9951C21.7803 6.49707 17.3174 2.03418 11.8193 2.03418C6.32129 2.03418 1.8584 6.49707 1.8584 11.9951C1.8584 17.4932 6.32129 21.9561 11.8193 21.9561ZM11.8193 20.2959C7.22949 20.2959 3.51856 16.585 3.51856 11.9951C3.51856 7.40527 7.22949 3.69434 11.8193 3.69434C16.4092 3.69434 20.1201 7.40527 20.1201 11.9951C20.1201 16.585 16.4092 20.2959 11.8193 20.2959Z"/><path d="M9.23145 15.5498H14.3877C15.0029 15.5498 15.3643 15.1885 15.3643 14.5928V9.39746C15.3643 8.79199 15.0029 8.44043 14.3877 8.44043H9.23145C8.62598 8.44043 8.25488 8.79199 8.25488 9.39746V14.5928C8.25488 15.1885 8.62598 15.5498 9.23145 15.5498Z"/></svg>`;

  // ============ 状态 ============
  const downloads = new Map();

  // ============ 工具函数 ============
  function parseUrl() {
    const m = location.href.match(/wwdc(\d{4})\/(\d+)/);
    return m ? { year: m[1], id: m[2] } : null;
  }

  function getCdnUrl() {
    const html = document.documentElement.innerHTML;
    for (const p of CDN_PATTERNS) {
      const m = html.match(p);
      if (m) return m[1];
    }
    return null;
  }

  function request(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: 30000,
        onload: (r) => resolve({ ok: r.status >= 200 && r.status < 300, text: r.responseText }),
        onerror: reject,
        ontimeout: () => reject(new Error("Timeout")),
      });
    });
  }

  async function checkLang(baseUrl, lang) {
    try {
      const res = await request(`${baseUrl}/subtitles/${lang.code}/prog_index.m3u8`);
      return res.ok && res.text.includes(".webvtt") ? lang : null;
    } catch {
      return null;
    }
  }

  async function fetchAll(urls, onProgress, signal) {
    const results = new Array(urls.length);
    let idx = 0, done = 0;

    async function worker() {
      while (idx < urls.length) {
        if (signal.cancelled) throw new Error("Cancelled");
        const i = idx++;
        const res = await request(urls[i]);
        results[i] = res.text;
        onProgress?.(++done, urls.length);
      }
    }

    await Promise.all(Array(Math.min(CONCURRENCY, urls.length)).fill().map(worker));
    return results;
  }

  function parseWebVTT(segments) {
    const map = new Map();
    for (const text of segments) {
      for (const block of text.split(/\n\n+/)) {
        const tm = block.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
        if (!tm) continue;
        const lines = block.split("\n").filter((l, i, arr) => {
          const idx = arr.findIndex((x) => x.includes("-->"));
          return i > idx && l.trim();
        });
        if (lines.length) {
          const key = `${tm[1]}>${tm[2]}`;
          if (!map.has(key)) {
            map.set(key, { start: tm[1].replace(".", ","), end: tm[2].replace(".", ","), text: lines.join("\n") });
          }
        }
      }
    }
    return [...map.values()].sort((a, b) => a.start.localeCompare(b.start));
  }

  function toSRT(entries) {
    return entries.map((e, i) => `${i + 1}\n${e.start} --> ${e.end}\n${e.text}\n`).join("\n");
  }

  function saveFile(content, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ============ 下载逻辑 ============
  async function download(baseUrl, lang, year, id, onProgress, signal) {
    const m3u8 = await request(`${baseUrl}/subtitles/${lang}/prog_index.m3u8`);
    if (!m3u8.ok) throw new Error("Not available");

    const files = m3u8.text.split("\n").filter((l) => l.endsWith(".webvtt"));
    if (!files.length) throw new Error("No segments");

    const urls = files.map((f) => `${baseUrl}/subtitles/${lang}/${f}`);
    const segments = await fetchAll(urls, onProgress, signal);

    if (signal.cancelled) throw new Error("Cancelled");

    const srt = toSRT(parseWebVTT(segments));
    saveFile(srt, `wwdc${year}-${id}_${lang}.srt`);
  }

  // ============ UI ============
  const STYLES = `
    .wsd-menu { background: #fff; border-radius: 2px; min-width: 160px; box-shadow: 0 2px 8px rgba(0,0,0,.2); overflow: hidden; font: 13px -apple-system, sans-serif; }
    .wsd-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; cursor: pointer; color: #212121; position: relative; }
    .wsd-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: var(--p, 0%); background: rgba(0,0,0,.06); transition: width .15s; }
    .wsd-item > * { position: relative; }
    .wsd-item:hover { background: rgba(0,0,0,.04); }
    .wsd-item .pct { margin-left: 6px; font-size: 11px; color: #888; display: none; }
    .wsd-item.active .pct { display: inline; }
    .wsd-item svg { width: 16px; height: 16px; fill: #212121; opacity: .7; }
    .wsd-item.active .dl { display: none; }
    .wsd-item .st { display: none; }
    .wsd-item.active .st { display: block; }
    .wsd-empty { padding: 12px; text-align: center; color: #888; font-size: 12px; }
  `;

  function createMenu(langs) {
    if (!langs.length) return `<div class="wsd-empty">No subtitles</div>`;
    return langs.map((l) => `
      <div class="wsd-item" data-lang="${l.code}">
        <span><span class="name">${l.name}</span><span class="pct">0%</span></span>
        <span class="dl">${ICON_DOWNLOAD}</span>
        <span class="st">${ICON_STOP}</span>
      </div>
    `).join("");
  }

  function bindEvents(container, baseUrl, year, id) {
    container.querySelectorAll(".wsd-item").forEach((el) => {
      el.addEventListener("click", async (e) => {
        e.stopPropagation();
        const lang = el.dataset.lang;
        const pct = el.querySelector(".pct");

        // 取消下载
        if (el.classList.contains("active")) {
          const sig = downloads.get(lang);
          if (sig) sig.cancelled = true;
          downloads.delete(lang);
          reset(el);
          return;
        }

        // 开始下载
        el.classList.add("active");
        el.style.setProperty("--p", "0%");
        pct.textContent = "0%";

        const signal = { cancelled: false };
        downloads.set(lang, signal);

        try {
          await download(baseUrl, lang, year, id, (done, total) => {
            if (signal.cancelled) return;
            const p = Math.round((done / total) * 100);
            el.style.setProperty("--p", p + "%");
            pct.textContent = p + "%";
          }, signal);
        } catch (err) {
          if (err.message !== "Cancelled") alert("Download failed: " + err.message);
        } finally {
          downloads.delete(lang);
          if (!signal.cancelled) reset(el);
        }
      });
    });

    function reset(el) {
      el.classList.remove("active");
      el.style.setProperty("--p", "0%");
      el.querySelector(".pct").textContent = "0%";
    }
  }

  function initUI(baseUrl, year, id, langs) {
    const video = document.querySelector("video");
    const parent = video?.closest(".developer-video-player") || video?.parentElement;
    if (!parent) return;

    if (getComputedStyle(parent).position === "static") parent.style.position = "relative";

    // 按钮
    const btn = document.createElement("button");
    btn.textContent = "CC";
    btn.title = "Download Subtitles";
    Object.assign(btn.style, {
      position: "absolute", top: "8px", right: "8px", zIndex: "9999",
      width: "36px", height: "36px", border: "none", borderRadius: "18px",
      background: "rgba(0,0,0,.7)", color: "#fff", fontSize: "13px", fontWeight: "600",
      cursor: "pointer", opacity: "0", transition: "opacity .2s"
    });

    // 面板
    const menu = document.createElement("div");
    menu.className = "wsd-menu";
    menu.innerHTML = `<style>${STYLES}</style>${createMenu(langs)}`;
    Object.assign(menu.style, {
      display: "none", position: "absolute", top: "48px", right: "8px", zIndex: "9999"
    });

    // 交互
    let open = false;
    const toggle = (state) => {
      open = state;
      menu.style.display = open ? "block" : "none";
      btn.style.background = open ? "#fff" : "rgba(0,0,0,.7)";
      btn.style.color = open ? "#212121" : "#fff";
    };

    parent.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
    parent.addEventListener("mouseleave", () => { if (!open) btn.style.opacity = "0"; });
    btn.addEventListener("click", (e) => { e.stopPropagation(); toggle(!open); });
    document.addEventListener("click", () => toggle(false));

    parent.append(btn, menu);
    bindEvents(menu, baseUrl, year, id);
  }

  // ============ 入口 ============
  async function init() {
    const info = parseUrl();
    if (!info) return;

    const baseUrl = getCdnUrl();
    if (!baseUrl) return;

    const langs = (await Promise.all(LANGUAGES.map((l) => checkLang(baseUrl, l)))).filter(Boolean);
    console.log(`[WWDC Subtitle] ${info.year}/${info.id} - ${langs.length} subtitle(s)`);

    initUI(baseUrl, info.year, info.id, langs);
  }

  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
})();
