// ==UserScript==
// @name         KiddoWorksheets 批量下载当前页 PDF
// @namespace    https://www.kiddoworksheets.com/
// @version      0.1.0
// @description  在 KiddoWorksheets 的分类列表页（如 /coloring/）一键批量下载“当前页”所有条目的 PDF。
// @author       you
// @match        https://www.kiddoworksheets.com/*
// @icon         https://www.kiddoworksheets.com/favicon.ico
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      www.kiddoworksheets.com
// @connect      kiddoworksheets.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562694/KiddoWorksheets%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%BD%93%E5%89%8D%E9%A1%B5%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/562694/KiddoWorksheets%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%BD%93%E5%89%8D%E9%A1%B5%20PDF.meta.js
// ==/UserScript==

/* global GM_download, GM_xmlhttpRequest */

(function () {
  'use strict';

  /**
   * @param {string} url
   * @returns {Promise<{finalUrl: string, responseText: string}>}
   */
  function httpGetText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: {
          // 某些站点对无 UA/Accept 的请求会返回不同内容；这里显式声明更稳。
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        onload: (resp) => {
          const finalUrl = resp.finalUrl || resp.responseURL || url;
          const responseText = String(resp.responseText || '');
          if (!responseText) {
            reject(new Error(`Empty response: ${finalUrl}`));
            return;
          }
          resolve({ finalUrl, responseText });
        },
        onerror: () => reject(new Error(`Network error: ${url}`)),
        ontimeout: () => reject(new Error(`Timeout: ${url}`)),
      });
    });
  }

  /**
   * @param {string} html
   * @returns {Document}
   */
  function parseHtml(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  /**
   * @param {string} href
   * @returns {boolean}
   */
  function isWorksheetDetailUrl(href) {
    try {
      const u = new URL(href, location.origin);
      return u.origin === location.origin && u.pathname.startsWith('/worksheet/');
    } catch {
      return false;
    }
  }

  /**
   * @returns {Array<string>}
   */
  function collectWorksheetDetailUrlsOnThisPage() {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    const urls = anchors
      .map((a) => a.getAttribute('href') || '')
      .filter(Boolean)
      .map((href) => {
        try {
          return new URL(href, location.origin).toString();
        } catch {
          return '';
        }
      })
      .filter(Boolean)
      .filter(isWorksheetDetailUrl);

    return Array.from(new Set(urls));
  }

  /**
   * @param {string} detailUrl
   * @returns {Promise<string>} 返回 wpdmdl 下载链接（可能会带 refresh 参数）
   */
  async function extractWpdmdlUrlFromDetailPage(detailUrl) {
    const { responseText } = await httpGetText(detailUrl);
    const doc = parseHtml(responseText);

    // 1) 直接找任何带 wpdmdl 参数的链接（最稳，覆盖 “DOWNLOAD FREE WORKSHEET” 按钮和其它位置）
    const wpdmdlAnchor = doc.querySelector('a[href*="wpdmdl="]');
    if (wpdmdlAnchor) {
      const href = wpdmdlAnchor.getAttribute('href') || '';
      const u = new URL(href, detailUrl);
      if (u.searchParams.get('wpdmdl')) return u.toString();
    }

    // 2) 兼容：找可能的下载按钮文案
    const candidates = Array.from(doc.querySelectorAll('a[href], button'));
    for (const el of candidates) {
      const text = (el.textContent || '').trim().toLowerCase();
      if (!text) continue;
      if (!text.includes('download') || !text.includes('worksheet')) continue;
      if (el instanceof HTMLAnchorElement) {
        const u = new URL(el.getAttribute('href') || '', detailUrl);
        if (u.searchParams.get('wpdmdl')) return u.toString();
      }
    }

    throw new Error(`未在详情页找到 wpdmdl 链接：${detailUrl}`);
  }

  /**
   * @param {string} detailUrl
   * @returns {string}
   */
  function buildFilenameFromDetailUrl(detailUrl) {
    const u = new URL(detailUrl);
    const parts = u.pathname.split('/').filter(Boolean);
    const slug = parts[parts.length - 1] || 'worksheet';
    return `${slug}.pdf`;
  }

  /**
   * @param {number} ms
   * @returns {Promise<void>}
   */
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /**
   * @param {string} url
   * @param {string} name
   * @returns {Promise<void>}
   */
  function gmDownload(url, name) {
    return new Promise((resolve, reject) => {
      GM_download({
        url,
        name,
        saveAs: false,
        onload: () => resolve(),
        onerror: (e) => reject(new Error(`下载失败：${name} (${url}) ${JSON.stringify(e)}`)),
        ontimeout: () => reject(new Error(`下载超时：${name} (${url})`)),
      });
    });
  }

  /**
   * @param {string} msg
   */
  function log(msg) {
    // 同时写到控制台 + UI
    // eslint-disable-next-line no-console
    console.log(`[KiddoDL] ${msg}`);
    const el = document.getElementById('kiddoDlLog');
    if (el) el.textContent = msg;
  }

  /**
   * @returns {{root: HTMLDivElement, startBtn: HTMLButtonElement, stopBtn: HTMLButtonElement}}
   */
  function mountUi() {
    const root = document.createElement('div');
    root.id = 'kiddoDlRoot';
    root.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'z-index:999999',
      'background:rgba(20,20,20,0.92)',
      'color:#fff',
      'padding:12px 12px',
      'border-radius:10px',
      'font:12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif',
      'box-shadow:0 8px 24px rgba(0,0,0,0.28)',
      'min-width:260px',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'KiddoWorksheets 批量下载';
    title.style.cssText = 'font-weight:700;margin-bottom:8px;';

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;';

    const startBtn = document.createElement('button');
    startBtn.textContent = '下载当前页';
    startBtn.style.cssText =
      'cursor:pointer;border:0;border-radius:8px;padding:8px 10px;background:#2d6cdf;color:#fff;font-weight:700;';

    const stopBtn = document.createElement('button');
    stopBtn.textContent = '停止';
    stopBtn.disabled = true;
    stopBtn.style.cssText =
      'cursor:pointer;border:0;border-radius:8px;padding:8px 10px;background:#555;color:#fff;font-weight:700;opacity:0.85;';

    row.appendChild(startBtn);
    row.appendChild(stopBtn);

    const logLine = document.createElement('div');
    logLine.id = 'kiddoDlLog';
    logLine.textContent = '就绪：在分类列表页点击“下载当前页”。';
    logLine.style.cssText = 'opacity:0.95;word-break:break-word;';

    const hint = document.createElement('div');
    hint.textContent = '命名：使用条目 slug（如 color-the-apple.pdf）。';
    hint.style.cssText = 'opacity:0.75;margin-top:6px;';

    root.appendChild(title);
    root.appendChild(row);
    root.appendChild(logLine);
    root.appendChild(hint);
    document.body.appendChild(root);

    return { root, startBtn, stopBtn };
  }

  // 只在“列表/分类页”注入：详情页不需要按钮
  if (location.pathname.startsWith('/worksheet/')) return;

  const detailUrls = collectWorksheetDetailUrlsOnThisPage();
  if (detailUrls.length === 0) return; // 当前页不像是 worksheet 列表页，直接不显示

  const ui = mountUi();

  /** @type {boolean} */
  let stopRequested = false;

  ui.stopBtn.addEventListener('click', () => {
    stopRequested = true;
    log('已请求停止：将于当前条目结束后停止。');
  });

  ui.startBtn.addEventListener('click', async () => {
    stopRequested = false;
    ui.startBtn.disabled = true;
    ui.stopBtn.disabled = false;

    try {
      log(`发现 ${detailUrls.length} 个条目，开始解析并下载（仅当前页）。`);

      // 串行队列：更不容易触发站点限制/被封
      for (let i = 0; i < detailUrls.length; i += 1) {
        if (stopRequested) break;

        const detailUrl = detailUrls[i];
        const filename = buildFilenameFromDetailUrl(detailUrl);
        log(`[${i + 1}/${detailUrls.length}] 解析：${filename}`);

        let wpdmdlUrl;
        try {
          wpdmdlUrl = await extractWpdmdlUrlFromDetailPage(detailUrl);
        } catch (e) {
          log(`[${i + 1}/${detailUrls.length}] 失败：${String(e)}`);
          // 继续下一个
          await sleep(800);
          continue;
        }

        log(`[${i + 1}/${detailUrls.length}] 下载：${filename}`);
        try {
          await gmDownload(wpdmdlUrl, filename);
        } catch (e) {
          log(`[${i + 1}/${detailUrls.length}] 下载失败：${String(e)}`);
        }

        // 轻微限速，避免触发风控
        await sleep(900);
      }

      if (stopRequested) {
        log('已停止。');
      } else {
        log('完成：当前页下载队列已跑完。');
      }
    } finally {
      ui.startBtn.disabled = false;
      ui.stopBtn.disabled = true;
    }
  });
})();


