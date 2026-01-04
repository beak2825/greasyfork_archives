// ==UserScript==
// @name         Roblox Dashboard Thumbnails - RateLimit Fix
// @namespace    local.roblox.thumbs.ratelimit.fix
// @version      0.9.1
// @description  Limit concurrent thumbnail requests + retry on 429 / "Too many requests" for Roblox Creator Dashboard
// @author       m.
// @match        https://create.roblox.com/dashboard/creations/experiences*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559467/Roblox%20Dashboard%20Thumbnails%20-%20RateLimit%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559467/Roblox%20Dashboard%20Thumbnails%20-%20RateLimit%20Fix.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ====== 调参区 ======
  const MAX_CONCURRENT = 5;  // 同时最多跑几个缩略图请求：2~4 比较稳
  const MAX_RETRY = 8;       // 最多重试次数
  const BASE_DELAY = 600;    // 退避初始延迟 ms
  const MAX_DELAY = 30000;   // 最大等待 ms
  const DEBUG_LOG = false;

  // 只拦截缩略图接口（你截图里就是这个）
  function isThumbRequest(url) {
    try {
      const u = typeof url === "string" ? url : (url?.url || "");
      return /https:\/\/thumbnails\.roblox\.com\/v1\/assets/i.test(u);
    } catch {
      return false;
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function getRetryAfterMs(headers) {
    try {
      const v = headers?.get?.("retry-after");
      if (!v) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n * 1000 : null;
    } catch {
      return null;
    }
  }

  function backoffMs(attempt, retryAfterMs) {
    if (retryAfterMs && retryAfterMs > 0) return Math.min(retryAfterMs, MAX_DELAY);
    const exp = Math.min(MAX_DELAY, BASE_DELAY * (2 ** Math.max(0, attempt - 1)));
    const jitter = Math.floor(Math.random() * 250); // 抖动避免一起重试
    return exp + jitter;
  }

  // ====== 简单并发队列 ======
  let active = 0;
  const queue = [];

  function pump() {
    while (active < MAX_CONCURRENT && queue.length) {
      const job = queue.shift();
      active++;
      job()
        .catch(() => {})
        .finally(() => {
          active--;
          pump();
        });
    }
  }

  function schedule(task) {
    return new Promise((resolve, reject) => {
      queue.push(() => task().then(resolve, reject));
      pump();
    });
  }

  // ====== fetch：重试 + 限并发 ======
  const originalFetch = window.fetch?.bind(window);
  if (originalFetch) {
    window.fetch = function (input, init) {
      const url = typeof input === "string" ? input : input?.url;
      if (!isThumbRequest(url)) return originalFetch(input, init);

      return schedule(async () => {
        for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
          const resp = await originalFetch(input, init);

          // 1) 直接 429
          if (resp.status === 429) {
            const wait = backoffMs(attempt, getRetryAfterMs(resp.headers));
            if (DEBUG_LOG) console.log("[ThumbFix] 429, wait", wait, "ms", url);
            await sleep(wait);
            continue;
          }

          // 2) 有些情况：HTTP 200 但 body 里是 {"errors":[{"message":"Too many requests"}]}
          // 用 clone() 读取，不影响原 resp 给页面使用
          const ct = resp.headers?.get?.("content-type") || "";
          if (ct.includes("application/json")) {
            try {
              const data = await resp.clone().json();
              const msg = data?.errors?.[0]?.message || "";
              if (/too many requests/i.test(msg)) {
                const wait = backoffMs(attempt, getRetryAfterMs(resp.headers));
                if (DEBUG_LOG) console.log("[ThumbFix] body says Too many requests, wait", wait, "ms", url);
                await sleep(wait);
                continue;
              }
            } catch {
              // 解析失败就不管
            }
          }

          // 成功/或其它错误：直接交给页面处理
          return resp;
        }

        // 重试耗尽：最后再真实请求一次交给页面（避免一直转圈）
        return originalFetch(input, init);
      });
    };
  }

  // ====== XHR：只做并发限制（不做重试，避免破坏页面逻辑） ======
  const XHR = window.XMLHttpRequest;
  if (XHR && XHR.prototype) {
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;

    XHR.prototype.open = function (method, url) {
      this.__thumbFixUrl = url;
      return origOpen.apply(this, arguments);
    };

    XHR.prototype.send = function () {
      const url = this.__thumbFixUrl;
      if (!isThumbRequest(url)) return origSend.apply(this, arguments);

      const xhr = this;
      const args = arguments;

      // 延迟真正 send，达到限并发效果
      schedule(() => new Promise((resolve) => {
        xhr.addEventListener("loadend", resolve, { once: true });
        try {
          origSend.apply(xhr, args);
        } catch {
          resolve();
        }
      }));

      // 这里必须返回 undefined（保持 XHR 的行为）
      return;
    };
  }
})();
