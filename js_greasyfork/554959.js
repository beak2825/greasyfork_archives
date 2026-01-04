// ==UserScript==
// @name         QQ跳过不安全访问 (c.pc.qq.com → real URL)
// @version      1.0.0
// @namespace    https://greasyfork.org/zh-CN/users/1534692-kanokeine
// @description  遇到QQ安全提示跳转页，自动解析真实链接并直达目标网址；支持 ios.html、middle.html、middlem.html，多字段容错、重复解码与协议白名单
// @author       Kanokeine
// @match        https://c.pc.qq.com/*
// @match        https://*/c.pc.qq.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554959/QQ%E8%B7%B3%E8%BF%87%E4%B8%8D%E5%AE%89%E5%85%A8%E8%AE%BF%E9%97%AE%20%28cpcqqcom%20%E2%86%92%20real%20URL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554959/QQ%E8%B7%B3%E8%BF%87%E4%B8%8D%E5%AE%89%E5%85%A8%E8%AE%BF%E9%97%AE%20%28cpcqqcom%20%E2%86%92%20real%20URL%29.meta.js
// ==/UserScript==
(function () {
  'use strict';

  /** 允许的目标协议 */
  const ALLOWED_PROTOCOLS = ['http:', 'https:'];

  /** 可能使用的参数名（优先级从前到后） */
  const CANDIDATE_KEYS = ['url', 'pfurl', 'qurl', 'target', 'u', 'r', 's'];

  /** 多次尝试 decode，直到稳定或达到次数上限 */
  function multiDecode(str, max = 5) {
    let prev = str;
    for (let i = 0; i < max; i++) {
      try {
        const next = decodeURIComponent(prev);
        if (next === prev) break;
        prev = next;
      } catch {
        break;
      }
    }
    return prev;
  }

  /** 从当前 URL 的查询串中找真实链接 */
  function extractRealUrl() {
    const usp = new URLSearchParams(location.search);
    for (const key of CANDIDATE_KEYS) {
      const raw = usp.get(key);
      if (raw) {
        return multiDecode(raw);
      }
    }
    // 有些页面把链接塞在 hash 里，兜底再扫一次
    if (location.hash) {
      const hash = location.hash.replace(/^#/, '');
      try {
        const usp2 = new URLSearchParams(hash);
        for (const key of CANDIDATE_KEYS) {
          const raw2 = usp2.get(key);
          if (raw2) return multiDecode(raw2);
        }
      } catch {}
      // 再尝试直接从 hash 中找 http(s) 链接
      const m = decodeURIComponent(hash).match(/https?:\/\/[^\s#"]+/i);
      if (m) return m[0];
    }
    return null;
  }

  /** 简单安全校验，只允许 http/https */
  function isSafeHttpUrl(u) {
    try {
      const url = new URL(u, location.href);
      return ALLOWED_PROTOCOLS.includes(url.protocol);
    } catch {
      return false;
    }
  }

  /** 执行跳转（优先使用 replace 避免污染历史） */
  function go(u) {
    if (!u) return;
    if (!isSafeHttpUrl(u)) return;
    // 若已在目标页就不跳
    if (u === location.href) return;
    // iOS/Android 的内置浏览器更适合用 replace
    location.replace(u);
  }

  // 主流程：尽早解析并跳转
  const real = extractRealUrl();
  if (real) {
    go(real);
    return;
  }

  // 如果加载早期没拿到，再在 DOM 可用时兜底试一次
  document.addEventListener('DOMContentLoaded', () => {
    const again = extractRealUrl();
    if (again) go(again);
    else {
      // 最后兜底：页面中若有明显的外链按钮
      const a = Array.from(document.querySelectorAll('a[href]')).find(x =>
        /^https?:\/\//i.test(x.getAttribute('href') || '')
      );
      if (a) go(a.href);
    }
  });
})();