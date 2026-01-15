// ==UserScript==
// @name         mn-image-cache
// @namespace    https://monster-nest.com/
// @version      0.1.0
// @description  Monster Nest 图片缓存脚本
// @license      MIT
// @icon         https://monster-nest.com/favicon.ico
// @match        https://monster-nest.com/forum.php*
// @match        https://monster-nest.com/thread-*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562672/mn-image-cache.user.js
// @updateURL https://update.greasyfork.org/scripts/562672/mn-image-cache.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
WORKER_API: "https://cache-upload.pinni.vip/cache",
CACHE_BASE_URL: "https://test-cache.pinni.vip/",
API_KEY: "if9r369E5ia7X1jS52KdfJK67ZrDF6o49533155A58B8l4yC36",
MAIN_DOMAIN: "monster-nest.com",

LOAD_MODE: localStorage.getItem("mn_image_cache_mode") || "race"
  };
  async function generateSaveKey(targetImageUrl) {
    try {
      targetImageUrl = decodeURIComponent(targetImageUrl);
    } catch (e) {
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(targetImageUrl);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }
  async function triggerCacheGeneration(originalUrl) {
    try {
      console.debug(`[ImageCache] Calling Worker API for: ${originalUrl}`);
      const response = await fetch(CONFIG.WORKER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: CONFIG.API_KEY
        },
        body: JSON.stringify({ url: originalUrl })
      });
      const resultText = await response.text();
      console.log(
        `[ImageCache] Worker API Response (${response.status}):`,
        resultText
      );
      if (response.ok) {
        const localKey = await generateSaveKey(originalUrl);
        if (resultText.trim() !== localKey) {
          console.error(
            `[ImageCache] Key Mismatch! Local: "${localKey}", Worker: "${resultText.trim()}"`
          );
        }
      }
      return response.ok;
    } catch (e) {
      console.error("Trigger cache failed", e);
      return false;
    }
  }
  const loadingTasks = new WeakMap();
  const pendingGenerations = new Map();
  const stats = {
    original: 0,
    cache: 0,
    total: 0
  };
  function logStats() {
    console.log(
      `[ImageCache Stats] Total: ${stats.total} | Original: ${stats.original} | Cache: ${stats.cache}`
    );
  }
  function getOrStartGeneration(originalUrl) {
    if (pendingGenerations.has(originalUrl)) {
      return pendingGenerations.get(originalUrl);
    }
    const task = triggerCacheGeneration(originalUrl).then((success) => {
      pendingGenerations.delete(originalUrl);
      return success;
    });
    pendingGenerations.set(originalUrl, task);
    return task;
  }
  async function getCachedUrl(originalUrl) {
    const key = await generateSaveKey(originalUrl);
    return `${CONFIG.CACHE_BASE_URL}${key}`;
  }
  function attemptLoadImage(url, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error("Aborted"));
        return;
      }
      const img = new Image();
      const onAbort = () => {
        img.src = "";
        reject(new Error("Aborted"));
      };
      if (signal) {
        signal.addEventListener("abort", onAbort);
      }
      img.onload = () => {
        if (signal?.aborted) return;
        resolve(url);
      };
      img.onerror = () => {
        if (signal?.aborted) return;
        reject(new Error(`Failed to load: ${url}`));
      };
      img.src = url;
    });
  }
  async function loadCachedImageFlow(originalUrl, signal, traceId) {
    const cachedUrl = await getCachedUrl(originalUrl);
    return new Promise((resolve, reject) => {
      const probe = new Image();
      let isSettled = false;
      const onAbort = () => {
        if (isSettled) return;
        console.log(`[ImageCache #${traceId}] Probe aborted`);
        isSettled = true;
        probe.onload = null;
        probe.onerror = null;
        probe.src = "";
        reject(new Error("Aborted"));
      };
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener("abort", onAbort);
      probe.onload = () => {
        if (isSettled) return;
        signal.removeEventListener("abort", onAbort);
        isSettled = true;
        resolve(cachedUrl);
      };
      probe.onerror = async (e) => {
        if (isSettled) return;
        console.log(
          `[ImageCache #${traceId}] Probe failed (404/Error) for: ${cachedUrl}, triggering generation.`,
          e
        );
        try {
          const success = await getOrStartGeneration(originalUrl);
          if (!success) {
            if (isSettled) return;
            console.warn(`[ImageCache #${traceId}] Generation failed`);
            reject(new Error("Cache generation failed"));
            return;
          }
          if (isSettled) return;
          console.log(
            `[ImageCache #${traceId}] Generation success, verifying...`
          );
          probe.src = "";
          probe.onload = () => {
            if (isSettled) return;
            console.log(`[ImageCache #${traceId}] Verification HIT.`);
            signal.removeEventListener("abort", onAbort);
            isSettled = true;
            resolve(cachedUrl);
          };
          probe.onerror = () => {
            if (isSettled) return;
            console.warn(
              `[ImageCache #${traceId}] Verification failed after generation.`
            );
            isSettled = true;
            reject(new Error("Verification failed after generation"));
          };
          probe.src = cachedUrl;
        } catch (err) {
          if (isSettled) return;
          console.error(`[ImageCache #${traceId}] Generation error`, err);
          reject(err);
        }
      };
      probe.src = cachedUrl;
    });
  }
  function observeAndLazyLoad(img, originalUrl) {
    if (loadingTasks.has(img)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(
            `[ImageCache] Image visible, starting race logic for: ${originalUrl}`
          );
          startRaceLogc(img, originalUrl);
          observer.disconnect();
        }
      });
    });
    observer.observe(img);
  }
  let traceIdCounter = 0;
  function startRaceLogc(img, originalUrl) {
    const traceId = ++traceIdCounter;
    console.log(
      `[ImageCache #${traceId}] Start loading: ${originalUrl} (Mode: ${CONFIG.LOAD_MODE})`
    );
    loadingTasks.set(img, true);
    const controller = new AbortController();
    const signal = controller.signal;
    let resultPromise;
    const wapper = (promise, name) => {
      return promise.then((url) => {
        return { url, winner: name };
      });
    };
    if (CONFIG.LOAD_MODE === "source-first") {
      resultPromise = wapper(
        attemptLoadImage(originalUrl, signal),
        "original"
      ).catch(() => {
        if (signal.aborted) throw new Error("Aborted");
        console.log(
          `[ImageCache #${traceId}] Source first failed, trying cache: ${originalUrl}`
        );
        return wapper(loadCachedImageFlow(originalUrl, signal, traceId), "cache");
      });
    } else if (CONFIG.LOAD_MODE === "cache-first") {
      resultPromise = wapper(
        loadCachedImageFlow(originalUrl, signal, traceId),
        "cache"
      ).catch((err) => {
        if (signal.aborted) throw new Error("Aborted");
        console.log(
          `[ImageCache] Cache first failed, trying original: ${originalUrl}`,
          err
        );
        return wapper(attemptLoadImage(originalUrl, signal), "original");
      });
    } else {
      const taskOriginal = attemptLoadImage(originalUrl, signal);
      const taskCache = loadCachedImageFlow(originalUrl, signal, traceId);
      resultPromise = Promise.any([
        wapper(taskOriginal, "original"),
        wapper(taskCache, "cache")
      ]);
    }
    resultPromise.then((result) => {
      const url = result.url;
      stats.total++;
      if (result.winner === "original") {
        stats.original++;
      } else {
        stats.cache++;
      }
      logStats();
      const restoreDimensions = () => {
        img.removeAttribute("width");
        img.removeAttribute("height");
        const urlParams = new URLSearchParams(location.search);
        const isMobile = urlParams.get("mobile") === "2";
        img.style.width = "auto";
        img.style.height = "auto";
        img.style.maxWidth = isMobile ? "100%" : "80%";
        const currentSrc = img.src;
        if (isMobile) {
          img.setAttribute("data-mn-pswp-base", currentSrc);
          img.setAttribute("data-mn-pswp-url", currentSrc);
        } else {
          img.setAttribute("data-mn-viewer-url", currentSrc);
        }
        delete img.dataset.layoutLocked;
        delete img.dataset.originalWidth;
        delete img.dataset.originalHeight;
        if (img.dataset.originalObjectFit) {
          img.style.objectFit = img.dataset.originalObjectFit;
          delete img.dataset.originalObjectFit;
        } else {
          img.style.objectFit = "";
        }
      };
      const applyImage = (targetUrl) => {
        const onSuccess = () => {
          restoreDimensions();
          img.removeEventListener("error", onError);
        };
        const onError = () => {
          img.removeEventListener("load", onSuccess);
          console.warn(`[ImageCache] Failed to load image: ${targetUrl}`);
          if (targetUrl !== originalUrl) {
            console.log(
              `[ImageCache] Falling back to original: ${originalUrl}`
            );
            applyImage(originalUrl);
          } else {
            restoreDimensions();
          }
        };
        img.addEventListener("load", onSuccess, { once: true });
        img.addEventListener("error", onError, { once: true });
        img.src = targetUrl;
        img.removeAttribute("data-src");
        if (img.complete) {
          if (img.naturalWidth > 0) {
            onSuccess();
          }
        }
      };
      applyImage(url);
      controller.abort();
    }).catch((err) => {
      console.error("Both original and cache failed to load.", err);
    });
  }
  const placeholderSrc = "data:image/svg+xml,%3csvg%20id='octo4423'%20width='50'%20height='50'%20viewBox='0%200%20512%20512'%20fill='hsl(228,%2097%25,%2042%25)'%20xmlns='http://www.w3.org/2000/svg'%3e%3cstyle%3e%23octo4423%20.part%20{%20animation-name:%20fade4423;%20animation-duration:%201s;%20animation-iteration-count:%20infinite;%20animation-timing-function:%20ease-out;%20fill:%20currentColor;%20}%20%23octo4423%20%23part1%20{%20animation-delay:%200.000s%20}%20%23octo4423%20%23part2%20{%20animation-delay:%200.125s%20}%20%23octo4423%20%23part3%20{%20animation-delay:%200.250s%20}%20%23octo4423%20%23part4%20{%20animation-delay:%200.375s%20}%20%23octo4423%20%23part5%20{%20animation-delay:%200.500s%20}%20%23octo4423%20%23part6%20{%20animation-delay:%200.625s%20}%20%23octo4423%20%23part7%20{%20animation-delay:%200.750s%20}%20%23octo4423%20%23part8%20{%20animation-delay:%200.875s%20}%20@keyframes%20fade4423%20{%200%25,%2025%25%20{%20fill-opacity:%200;%20}%2050%25,%2075%25%20{%20fill-opacity:%201;%20}%20}%3c/style%3e%3cpath%20id='part1'%20class='part'%20d='m332.289429,87.087219c60.033295,-20.366676%20114.402222,-21.83609%20172.935547,1.047241l-11.403595,32.850952c-43.333344,-15.5%20-104.147491,-15.984329%20-148.480804,-0.734329'%20transform='rotate(45%20418.757%2096.1885)'/%3e%3cpath%20id='part2'%20class='part'%20d='m398.527466,246.388596c60.033325,-20.366684%20114.402222,-21.83609%20172.935547,1.047241l-11.403564,32.850967c-43.333374,-15.500031%20-104.147491,-15.984344%20-148.480835,-0.734344'%20transform='rotate(90%20484.995%20255.49)'/%3e%3cpath%20id='part3'%20class='part'%20d='m331.332214,404.823669c60.033325,-20.366699%20114.402252,-21.83609%20172.935547,1.047241l-11.403534,32.850952c-43.333405,-15.500031%20-104.147522,-15.984344%20-148.480865,-0.734344'%20transform='rotate(135%20417.8%20413.925)'/%3e%3cpath%20id='part4'%20class='part'%20d='m171.58223,470.323669c60.03331,-20.366699%20114.402237,-21.83609%20172.935532,1.047241l-11.403534,32.850952c-43.333405,-15.500031%20-104.147522,-15.984344%20-148.48085,-0.734344'%20transform='rotate(180%20258.05%20479.425)'/%3e%3cpath%20id='part5'%20class='part'%20d='m13.0822,406.074005c60.033301,-20.367004%20114.401801,-21.835999%20172.935805,1.046997l-11.404007,32.850983c-43.332993,-15.5%20-104.147301,-15.983978%20-148.480589,-0.733978'%20transform='rotate(-135%2099.55%20415.175)'/%3e%3cpath%20id='part6'%20class='part'%20d='m-53.713486,247.091553c60.03331,-20.367004%20114.40181,-21.835999%20172.935806,1.046997l-11.404022,32.850983c-43.332977,-15.5%20-104.147277,-15.983978%20-148.480576,-0.733978'%20transform='rotate(-90%2032.754%20256.193)'/%3e%3cpath%20id='part7'%20class='part'%20d='m12.883621,87.061485c60.033295,-20.366669%20114.402206,-21.836082%20172.935562,1.047249l-11.403595,32.850952c-43.333344,-15.5%20-104.147507,-15.984329%20-148.48082,-0.734337'%20transform='rotate(-45%2099.3514%2096.1628)'/%3e%3cpath%20id='part8'%20class='part'%20d='m172.906631,20.929741c60.03331,-20.366681%20114.402206,-21.836091%20172.935562,1.04723l-11.403595,32.85096c-43.333344,-15.5%20-104.147507,-15.984322%20-148.48082,-0.734329'/%3e%3c/svg%3e";
  function initSettingsUI() {
    if (document.getElementById("mn-image-cache-settings")) return;
    const style = document.createElement("style");
    style.textContent = `
    #mn-ic-setting-btn {
      position: fixed;
      left: 20px;
      bottom: 80px;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999;
      color: white;
      transition: all 0.3s;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      -webkit-tap-highlight-color: transparent;
    }
    #mn-ic-setting-btn:hover {
      background: rgba(0, 0, 0, 0.8);
      transform: scale(1.1);
    }
    #mn-ic-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(2px);
    }
    #mn-ic-modal.show {
      display: flex;
    }
    .mn-ic-panel {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 24px;
      border-radius: 12px;
      width: 85%;
      max-width: 340px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      animation: mn-ic-fadein 0.2s ease-out;
    }
    @keyframes mn-ic-fadein {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .mn-ic-title {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 12px;
    }
    .mn-ic-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .mn-ic-label {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
      padding: 10px;
      border-radius: 8px;
      transition: background 0.2s;
      border: 1px solid transparent;
    }
    .mn-ic-label:hover {
      background: #f8f9fa;
    }
    .mn-ic-label input {
      margin-top: 3px;
      margin-right: 12px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .mn-ic-text {
        display: flex;
        flex-direction: column;
    }
    .mn-ic-name {
        font-weight: 500;
        font-size: 15px;
        color: #333;
    }
    .mn-ic-desc {
        font-size: 12px;
        color: #888;
        margin-top: 2px;
    }
    .mn-ic-actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .mn-ic-btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      min-width: 60px;
    }
    .mn-ic-btn-cancel {
      background: #f1f3f5;
      color: #495057;
    }
    .mn-ic-btn-save {
      background: #339af0;
      color: white;
    }
    .mn-ic-btn:active {
        opacity: 0.8;
    }
    
    /* Discuz Mobile specific tweaks */
    @media screen and (max-width: 600px) {
      #mn-ic-setting-btn {
        bottom: 120px; /* Adjust for common bottom bars */
        left: 15px;
        width: 48px;
        height: 48px;
      }
      .mn-ic-panel {
          width: 90%;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .mn-ic-panel {
            background: rgba(45, 45, 45, 0.85);
            color: #eee;
        }
        .mn-ic-title {
            color: #eee;
            border-bottom-color: #444;
        }
        .mn-ic-label:hover {
            background: #383838;
        }
        .mn-ic-name { color: #eee; }
        .mn-ic-desc { color: #aaa; }
        .mn-ic-btn-cancel {
            background: #444;
            color: #eee;
        }
        .mn-ic-btn-save {
            background: #1c7ed6;
        }
    }
  `;
    document.head.appendChild(style);
    const container = document.createElement("div");
    container.id = "mn-image-cache-settings";
    container.innerHTML = `
    <div id="mn-ic-setting-btn" title="Image Cache Settings">
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </div>
    
    <div id="mn-ic-modal">
        <div class="mn-ic-panel">
            <h3 class="mn-ic-title">图片加载模式设置</h3>
            <div class="mn-ic-options">
                <label class="mn-ic-label">
                    <input type="radio" name="mn-load-mode" value="race">
                     <div class="mn-ic-text">
                        <span class="mn-ic-name">竞速模式 (默认推荐)</span>
                        <span class="mn-ic-desc">同时加载原图和缓存，谁快显示谁。消耗双倍流量但体验最佳。</span>
                    </div>
                </label>
                <label class="mn-ic-label">
                    <input type="radio" name="mn-load-mode" value="cache-first">
                    <div class="mn-ic-text">
                        <span class="mn-ic-name">缓存优先</span>
                        <span class="mn-ic-desc">优先加载加速缓存，失败后回退原图。省流。</span>
                    </div>
                </label>
                <label class="mn-ic-label">
                    <input type="radio" name="mn-load-mode" value="source-first">
                     <div class="mn-ic-text">
                        <span class="mn-ic-name">原图优先</span>
                        <span class="mn-ic-desc">优先加载原站图片。如果原站慢，体验会较差。</span>
                    </div>
                </label>
            </div>
            <div class="mn-ic-actions">
                <button class="mn-ic-btn mn-ic-btn-cancel" id="mn-ic-cancel">取消</button>
                <button class="mn-ic-btn mn-ic-btn-save" id="mn-ic-save">保存并刷新</button>
            </div>
        </div>
    </div>
  `;
    document.body.appendChild(container);
    const btn = document.getElementById("mn-ic-setting-btn");
    const modal = document.getElementById("mn-ic-modal");
    const cancelBtn = document.getElementById("mn-ic-cancel");
    const saveBtn = document.getElementById("mn-ic-save");
    const radios = document.querySelectorAll('input[name="mn-load-mode"]');
    radios.forEach((r) => {
      if (r.value === CONFIG.LOAD_MODE) {
        r.checked = true;
      }
    });
    const openModal = (e) => {
      e.stopPropagation();
      modal.classList.add("show");
    };
    btn.addEventListener("click", openModal);
    btn.addEventListener(
      "touchstart",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );
    const closeModal = () => {
      modal.classList.remove("show");
      radios.forEach((r) => {
        if (r.value === CONFIG.LOAD_MODE) {
          r.checked = true;
        }
      });
    };
    cancelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal();
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      let selected = CONFIG.LOAD_MODE;
      radios.forEach((r) => {
        if (r.checked) selected = r.value;
      });
      if (selected !== CONFIG.LOAD_MODE) {
        localStorage.setItem("mn_image_cache_mode", selected);
        location.reload();
      } else {
        closeModal();
      }
    });
  }
  (function() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initSettingsUI);
    } else {
      initSettingsUI();
    }
    const CONTENT_SELECTORS = ".t_f, .message, .article_content, .post_content";
    function processImage(img) {
      if (!img.closest(CONTENT_SELECTORS)) return;
      if (img.hasAttribute("data-src")) return;
      const rawUrl = img.getAttribute("src");
      if (!rawUrl) return;
      let fullUrl;
      try {
        fullUrl = new URL(rawUrl, location.href).href;
      } catch (e) {
        return;
      }
      if (fullUrl.includes("iili.io") && fullUrl.includes(".md.")) {
        fullUrl = fullUrl.replace(".md.", ".");
      }
      if (!fullUrl.startsWith("http")) {
        return;
      }
      try {
        const urlObj = new URL(fullUrl);
        const hostname = urlObj.hostname;
        if (hostname === CONFIG.MAIN_DOMAIN || hostname.endsWith(`.${CONFIG.MAIN_DOMAIN}`)) {
          return;
        }
        if (img.getAttribute("loading") === "lazy") {
          img.removeAttribute("loading");
        }
        if (img.offsetWidth > 0 && img.offsetHeight > 0) {
          if (img.hasAttribute("width"))
            img.dataset.originalWidth = img.getAttribute("width");
          if (img.hasAttribute("height"))
            img.dataset.originalHeight = img.getAttribute("height");
          img.width = img.offsetWidth;
          img.height = img.offsetHeight;
          img.dataset.layoutLocked = "true";
        }
        if (img.style.objectFit) {
          img.dataset.originalObjectFit = img.style.objectFit;
        }
        img.style.objectFit = "scale-down";
        img.setAttribute("data-src", fullUrl);
        img.src = placeholderSrc;
        observeAndLazyLoad(img, fullUrl);
      } catch (e) {
        console.error("URL parse failed:", e);
      }
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node instanceof HTMLImageElement) {
              processImage(node);
            }
            const imgs = node.querySelectorAll("img");
            imgs.forEach(processImage);
          }
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    document.querySelectorAll("img").forEach(processImage);
  })();

})();