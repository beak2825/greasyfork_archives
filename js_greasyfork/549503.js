// ==UserScript==
// @name         即梦AI左侧大图下载按钮
// @namespace    https://jimeng.jianying.com/
// @version      0.1.0
// @description  在即梦AI资产页添加“下载左侧大图”按钮，一键下载左侧大图（优先WebP）
// @author       Nick Liu
// @match        https://jimeng.jianying.com/ai-tool/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"/>

// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549503/%E5%8D%B3%E6%A2%A6AI%E5%B7%A6%E4%BE%A7%E5%A4%A7%E5%9B%BE%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/549503/%E5%8D%B3%E6%A2%A6AI%E5%B7%A6%E4%BE%A7%E5%A4%A7%E5%9B%BE%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========= 配置 =========
  const UI_POS = { top: '90px', right: '18px' }; // 按钮位置（固定定位）
  const SCAN_DEBOUNCE_MS = 600;                  // 变更后扫描的防抖时间
  const MIN_ABS_AREA = 60000;                   // 候选元素最小像素面积下限
  const MIN_VIEWPORT_AREA_RATIO = 0.04;         // 最小面积阈值占视窗比例
  // ========================

  let lastBest = null;   // { url, area, left, isWebp, w, h, tag }
  let scanTimer = null;

  function log(...args) {
    // console.debug('[即梦大图DL]', ...args);
  }

  function ensureButton() {
    let btn = document.getElementById('jm-left-big-image-download-btn');
    if (btn) return btn;

    btn = document.createElement('button');
    btn.id = 'jm-left-big-image-download-btn';
    btn.textContent = '下载左侧大图';
    btn.title = '下载页面左侧显示的大图（优先 WebP）';
    btn.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      top: ${UI_POS.top};
      right: ${UI_POS.right};
      padding: 10px 14px;
      border-radius: 8px;
      background: #1f6feb;
      color: #fff;
      border: none;
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,.15);
      opacity: .95;
    `;
    btn.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
    btn.addEventListener('mouseleave', () => (btn.style.opacity = '.95'));
    btn.addEventListener('click', onDownloadClick);
    document.documentElement.appendChild(btn);

    const hint = document.createElement('div');
    hint.id = 'jm-left-big-image-download-hint';
    hint.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      top: calc(${UI_POS.top} + 48px);
      right: ${UI_POS.right};
      padding: 6px 10px;
      border-radius: 6px;
      background: rgba(0,0,0,.67);
      color: #fff;
      font-size: 12px;
      display: none;
      max-width: 42vw;
      word-break: break-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    document.documentElement.appendChild(hint);

    return btn;
  }

  function setBtnState(found, textExtra) {
    const btn = ensureButton();
    const hint = document.getElementById('jm-left-big-image-download-hint');
    if (!found) {
      btn.disabled = true;
      btn.style.background = '#8b949e';
      btn.style.cursor = 'not-allowed';
      btn.textContent = '未找到左侧大图';
      hint.style.display = 'none';
    } else {
      btn.disabled = false;
      btn.style.background = '#1f6feb';
      btn.style.cursor = 'pointer';
      btn.textContent = '下载左侧大图';
      if (textExtra) {
        hint.textContent = textExtra;
        hint.style.display = 'block';
      } else {
        hint.style.display = 'none';
      }
    }
  }

  function isVisible(el, vpH) {
    const rect = el.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) return false;
    if (rect.bottom <= 0 || rect.top >= vpH) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    return true;
  }

  function absUrl(u) {
    try {
      return new URL(u, location.href).href;
    } catch (e) {
      return u;
    }
  }

  function extractUrlsFromBackgroundImage(bg) {
    const urls = [];
    const regex = /url\((?:\"|')?([^\"')]+)(?:\"|')?\)/g;
    let m;
    while ((m = regex.exec(bg))) {
      urls.push(m[1]);
    }
    return urls;
  }

  function getUrlFromEl(el) {
    if (el.tagName === 'IMG') {
      const u = el.currentSrc || el.src || '';
      return u ? absUrl(u) : '';
    }
    const cs = getComputedStyle(el);
    // 背景图、content中的 url(...)
    const bgs = (cs.backgroundImage || '') + ',' + (cs.content || '');
    const urls = extractUrlsFromBackgroundImage(bgs).filter(Boolean);
    return urls.length ? absUrl(urls[0]) : '';
  }

  function pickBestLeftBigImage() {
    const vpW = window.innerWidth || document.documentElement.clientWidth;
    const vpH = window.innerHeight || document.documentElement.clientHeight;
    const leftThreshold = vpW * 0.5;
    const minArea = Math.max(MIN_ABS_AREA, vpW * vpH * MIN_VIEWPORT_AREA_RATIO);

    const elems = new Set();
    // img
    document.querySelectorAll('img, picture img').forEach(e => elems.add(e));
    // 有背景图的元素（需要遍历并看计算样式）
    const all = document.querySelectorAll('*');
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      const cs = getComputedStyle(el);
      if ((cs.backgroundImage && cs.backgroundImage.includes('url(')) ||
          (cs.content && cs.content.includes('url('))) {
        elems.add(el);
      }
    }

    const candidates = [];
    elems.forEach(el => {
      if (!isVisible(el, vpH)) return;
      const rect = el.getBoundingClientRect();
      if (rect.left > leftThreshold) return; // 限定在视窗左半侧
      const area = rect.width * rect.height;
      if (area < minArea) return;

      const url = getUrlFromEl(el);
      if (!url || url.startsWith('data:')) return;

      const isWebp = /\.webp(\?|#|$)/i.test(url) || /[?&]format=\.?webp/i.test(url);
      candidates.push({ url, area, left: rect.left, isWebp, w: rect.width, h: rect.height, tag: el.tagName });
    });

    // 优先：webp > 面积大 > 越靠左
    candidates.sort((a, b) => {
      if (a.isWebp !== b.isWebp) return a.isWebp ? -1 : 1;
      if (b.area !== a.area) return b.area - a.area;
      if (a.left !== b.left) return a.left - b.left;
      return 0;
    });

    return candidates[0] || null;
  }

  function scheduleScan() {
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(scanAndUpdate, SCAN_DEBOUNCE_MS);
  }

  function scanAndUpdate() {
    scanTimer = null;
    const best = pickBestLeftBigImage();
    if (!best) {
      lastBest = null;
      setBtnState(false);
      return;
    }
    const changed = !lastBest || lastBest.url !== best.url;
    lastBest = best;
    const info = `${best.tag} ${Math.round(best.w)}×${Math.round(best.h)} ${best.isWebp ? 'webp' : ''}`.trim();
    setBtnState(true, `${info} | ${best.url}`);
    if (changed) log('found image:', best);
  }

  function filenameFromUrl(u) {
    try {
      const url = new URL(u);
      let base = decodeURIComponent(url.pathname.split('/').pop() || 'left-image').replace(/[?#].*$/, '');
      // 若无扩展名，按 query 中 format 或默认 webp
      if (!/\.(webp|jpg|jpeg|png|gif|bmp|svg|avif|heic)$/i.test(base)) {
        if (/[?&]format=\.?webp/i.test(u)) {
          base += '.webp';
        } else {
          base += '.webp';
        }
      }
      // 简单清洗
      base = base.replace(/[^\w.\-~]+/g, '_');
      return base;
    } catch (e) {
      return `left-image-${Date.now()}.webp`;
    }
  }

  function gmDownload(url, name) {
    return new Promise((resolve, reject) => {
      if (typeof GM_download !== 'function') {
        return reject(new Error('GM_download not available'));
      }
      try {
        GM_download({
          url,
          name,
          onload: () => resolve(),
          onerror: (err) => reject(err && err.error || err || new Error('GM_download error'))
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function fallbackDownload(url, name) {
    // 尝试 fetch -> blob（可能受 CORS 限制）
    try {
      const resp = await fetch(url, { mode: 'cors', credentials: 'omit' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objUrl), 15000);
      return;
    } catch (e) {
      // 最后退：直接在新标签打开（用户可另存为）
      window.open(url, '_blank', 'noopener');
    }
  }

  async function onDownloadClick() {
    if (!lastBest || !lastBest.url) return;
    const url = lastBest.url;
    const name = filenameFromUrl(url);
    const btn = ensureButton();
    const prevText = btn.textContent;
    btn.textContent = '下载中...';
    btn.disabled = true;
    btn.style.background = '#8b949e';

    try {
      await gmDownload(url, name);
    } catch (e) {
      log('GM_download failed, fallback:', e);
      await fallbackDownload(url, name);
    } finally {
      btn.textContent = prevText;
      btn.disabled = false;
      btn.style.background = '#1f6feb';
    }
  }

  function initObservers() {
    const mo = new MutationObserver(() => scheduleScan());
    mo.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'style', 'class']
    });
    window.addEventListener('resize', scheduleScan, { passive: true });
    window.addEventListener('scroll', scheduleScan, { passive: true });
  }

  // 启动
  ensureButton();
  initObservers();
  // 初次扫描（多次确保）
  scanAndUpdate();
  setTimeout(scanAndUpdate, 800);
  setTimeout(scanAndUpdate, 1800);
})();
