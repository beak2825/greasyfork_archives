// ==UserScript==
// @name         Coursera 双语字幕 (覆盖层: 英上中下, 可调行距, 默认大字号)
// @namespace    http://tampermonkey.net/
// @version      2025.9.16
// @description  自建覆盖层显示双语：英文在上中文在下；零/负行距紧贴；独立背景；可调字号与垂直位置与行距；默认更大字号 130%。
// @author       唐无诗
// @match        *://*.coursera.org/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549736/Coursera%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%20%28%E8%A6%86%E7%9B%96%E5%B1%82%3A%20%E8%8B%B1%E4%B8%8A%E4%B8%AD%E4%B8%8B%2C%20%E5%8F%AF%E8%B0%83%E8%A1%8C%E8%B7%9D%2C%20%E9%BB%98%E8%AE%A4%E5%A4%A7%E5%AD%97%E5%8F%B7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549736/Coursera%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%20%28%E8%A6%86%E7%9B%96%E5%B1%82%3A%20%E8%8B%B1%E4%B8%8A%E4%B8%AD%E4%B8%8B%2C%20%E5%8F%AF%E8%B0%83%E8%A1%8C%E8%B7%9D%2C%20%E9%BB%98%E8%AE%A4%E5%A4%A7%E5%AD%97%E5%8F%B7%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /********* 可配置默认 *********/
  const PRIMARY_LANG          = 'en';
  const SECONDARY_LANG        = 'zh-CN';
  const DEFAULT_BOTTOM_PERCENT= 8;      // 英文行基线（底部偏移百分比）
  const DEFAULT_FONT_SIZE     = 130;    // 初始更大字号
  const DEFAULT_LINE_GAP_EM   = -0.05;  // 中英文之间的默认行距 (可为负数压紧)
  const MIN_LINE_GAP_EM       = -0.30;
  const MAX_LINE_GAP_EM       = 0.40;
  const LINE_GAP_STEP         = 0.05;
  /********************************/

  let isDualEnabled   = GM_getValue('isDualEnabled', true);
  let fontSizePercent = GM_getValue('fontSize', DEFAULT_FONT_SIZE);
  let bottomOffsetPct = GM_getValue('bottomOffsetPct', DEFAULT_BOTTOM_PERCENT);
  let lineGapEm       = GM_getValue('lineGapEm', DEFAULT_LINE_GAP_EM);

  let overlay, linePrimary, lineSecondary;
  let videoEl = null;
  let tracksBound = false;

  injectBaseStyles();
  observePage();

  function injectBaseStyles() {
    GM_addStyle(`
      .dual-sub-overlay {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
        z-index: 9999;
        font-family: "Helvetica Neue", Arial, sans-serif;
        white-space: pre-line;
      }
      .dual-sub-line {
        display: inline-block;
        background: rgba(0,0,0,0.75);
        color: #fff;
        font-weight: 400;
        line-height: 1.20;              /* 略减行高，整体更紧凑 */
        padding: 0.22em 0.65em 0.18em;  /* 上下不对称，进一步压缩竖向空间 */
        margin: 0;
        border-radius: 2px;
        max-width: 90vw;
        text-align: center;
        box-sizing: border-box;
        white-space: pre-line;
      }
      /* 第二行与第一行的间距用变量控制，可为负值 */
      .dual-sub-line + .dual-sub-line {
        margin-top: var(--dual-gap, 0);
      }

      /* 控制条样式 */
      #custom-subtitle-controls-container {
        display: flex;
        align-items: center;
        gap: 8px;
        border-left: 1px solid #e0e0e0;
        margin-left: 8px;
        padding-left: 16px;
        flex-wrap: wrap;
      }
      #custom-subtitle-controls-container button {
        height: 32px;
        padding: 0 10px;
        cursor: pointer;
      }
      #custom-subtitle-controls-container span.value {
        min-width: 48px;
        text-align: center;
        font-size: 13px;
      }

      /* 启用双语覆盖层时隐藏原生显示 */
      .dual-sub-active .vjs-text-track-display {
        display: none !important;
      }
    `);
  }

  function observePage() {
    const mo = new MutationObserver(() => {
      const v = document.querySelector('video');
      if (v && v !== videoEl) {
        videoEl = v;
        setupVideo();
      }
      injectControlsIfNeeded();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function setupVideo() {
    if (!videoEl) return;
    tracksBound = false;
    const tryBind = () => {
      if (!videoEl.textTracks || videoEl.textTracks.length === 0) return;
      if (tracksBound) return;
      tracksBound = true;

      videoEl.addEventListener('timeupdate', refreshOverlay);
      for (const track of videoEl.textTracks) {
        track.addEventListener('cuechange', refreshOverlay);
      }
      applyMode();
      buildOverlay();
      refreshOverlay();
    };
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      tryBind();
      if (tracksBound || attempts > 30) clearInterval(interval);
    }, 500);
  }

  function getTrackByLang(langCode) {
    if (!videoEl || !videoEl.textTracks) return null;
    return Array.from(videoEl.textTracks).find(t => (t.language || '').toLowerCase() === langCode.toLowerCase());
  }

  function applyMode() {
    if (!videoEl) return;
    const pTrack = getTrackByLang(PRIMARY_LANG);
    const sTrack = getTrackByLang(SECONDARY_LANG);

    if (isDualEnabled) {
      if (pTrack) pTrack.mode = 'hidden';
      if (sTrack) sTrack.mode = 'hidden';
      addDualClass(true);
    } else {
      if (pTrack) pTrack.mode = 'showing';
      if (sTrack) sTrack.mode = 'disabled';
      addDualClass(false);
      if (overlay) overlay.style.display = 'none';
    }
  }

  function addDualClass(active) {
    const playerWrap = findPlayerContainer();
    if (!playerWrap) return;
    if (active) playerWrap.classList.add('dual-sub-active');
    else playerWrap.classList.remove('dual-sub-active');
  }

  function findPlayerContainer() {
    if (!videoEl) return null;
    let node = videoEl.parentElement;
    while (node && node !== document.body) {
      const style = window.getComputedStyle(node);
      if (/(relative|absolute|fixed)/.test(style.position)) return node;
      node = node.parentElement;
    }
    return videoEl.parentElement;
  }

  function buildOverlay() {
    const container = findPlayerContainer();
    if (!container) return;
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'dual-sub-overlay';
      linePrimary = document.createElement('div');
      lineSecondary = document.createElement('div');
      linePrimary.className = 'dual-sub-line primary-line';
      lineSecondary.className = 'dual-sub-line secondary-line';
      overlay.appendChild(linePrimary);
      overlay.appendChild(lineSecondary);
      container.appendChild(overlay);
    }
    overlay.style.display = isDualEnabled ? 'flex' : 'none';
    applyFontSize();
    applyBottomOffset();
    applyLineGap();
  }

  function getActiveMergedText(track) {
    if (!track || !track.activeCues || track.activeCues.length === 0) return '';
    const parts = [];
    for (const cue of track.activeCues) {
      if (cue && cue.text) parts.push(cue.text.trim());
    }
    return parts.join('\n');
  }

  function refreshOverlay() {
    if (!isDualEnabled || !videoEl) return;
    const pTrack = getTrackByLang(PRIMARY_LANG);
    const sTrack = getTrackByLang(SECONDARY_LANG);
    if (!overlay) buildOverlay();

    const pText = getActiveMergedText(pTrack);
    const sText = getActiveMergedText(sTrack);

    if (pText) {
      linePrimary.style.display = 'inline-block';
      linePrimary.textContent = pText;
      if (sText) {
        lineSecondary.style.display = 'inline-block';
        lineSecondary.textContent = sText;
      } else {
        lineSecondary.style.display = 'none';
        lineSecondary.textContent = '';
      }
    } else if (sText) {
      linePrimary.style.display = 'inline-block';
      linePrimary.textContent = sText;
      lineSecondary.style.display = 'none';
      lineSecondary.textContent = '';
    } else {
      linePrimary.style.display = 'none';
      lineSecondary.style.display = 'none';
    }
  }

  function injectControlsIfNeeded() {
    if (document.getElementById('custom-subtitle-controls-container')) return;
    const coachBtn = document.querySelector('div[data-testid="coach-chat-launcher-container"]');
    if (!coachBtn) return;
    const host = coachBtn.parentElement?.parentElement?.parentElement;
    if (!host) return;

    const bar = document.createElement('div');
    bar.id = 'custom-subtitle-controls-container';

    const btnDual = document.createElement('button');
    btnDual.textContent = isDualEnabled ? '双语: 开' : '双语: 关';
    btnDual.onclick = () => {
      isDualEnabled = !isDualEnabled;
      GM_setValue('isDualEnabled', isDualEnabled);
      btnDual.textContent = isDualEnabled ? '双语: 开' : '双语: 关';
      applyMode();
      buildOverlay();
      refreshOverlay();
    };

    // 字号
    const btnMinus = document.createElement('button'); btnMinus.textContent = '字号 -';
    const sizeVal = document.createElement('span'); sizeVal.className='value'; sizeVal.textContent = fontSizePercent + '%';
    const btnPlus = document.createElement('button'); btnPlus.textContent = '字号 +';

    btnMinus.onclick = () => {
      if (fontSizePercent > 50) {
        fontSizePercent -= 10;
        GM_setValue('fontSize', fontSizePercent);
        sizeVal.textContent = fontSizePercent + '%';
        applyFontSize();
      }
    };
    btnPlus.onclick = () => {
      fontSizePercent += 10;
      GM_setValue('fontSize', fontSizePercent);
      sizeVal.textContent = fontSizePercent + '%';
      applyFontSize();
    };

    // 垂直位置
    const btnPosDown = document.createElement('button'); btnPosDown.textContent = '位置 ↓';
    const posVal = document.createElement('span'); posVal.className='value'; posVal.textContent = bottomOffsetPct + '%';
    const btnPosUp = document.createElement('button'); btnPosUp.textContent = '位置 ↑';

    btnPosDown.onclick = () => {
      bottomOffsetPct = Math.max(0, bottomOffsetPct - 1);
      GM_setValue('bottomOffsetPct', bottomOffsetPct);
      posVal.textContent = bottomOffsetPct + '%';
      applyBottomOffset();
    };
    btnPosUp.onclick = () => {
      bottomOffsetPct = Math.min(25, bottomOffsetPct + 1);
      GM_setValue('bottomOffsetPct', bottomOffsetPct);
      posVal.textContent = bottomOffsetPct + '%';
      applyBottomOffset();
    };

    // 行距（中英文之间距离）
    const btnGapMinus = document.createElement('button'); btnGapMinus.textContent = '行距 -';
    const gapVal = document.createElement('span'); gapVal.className='value'; gapVal.textContent = lineGapEm.toFixed(2);
    const btnGapPlus = document.createElement('button'); btnGapPlus.textContent = '行距 +';

    btnGapMinus.onclick = () => {
      lineGapEm = Math.max(MIN_LINE_GAP_EM, +(lineGapEm - LINE_GAP_STEP).toFixed(2));
      GM_setValue('lineGapEm', lineGapEm);
      gapVal.textContent = lineGapEm.toFixed(2);
      applyLineGap();
    };
    btnGapPlus.onclick = () => {
      lineGapEm = Math.min(MAX_LINE_GAP_EM, +(lineGapEm + LINE_GAP_STEP).toFixed(2));
      GM_setValue('lineGapEm', lineGapEm);
      gapVal.textContent = lineGapEm.toFixed(2);
      applyLineGap();
    };

    bar.appendChild(btnDual);

    bar.appendChild(btnMinus);
    bar.appendChild(sizeVal);
    bar.appendChild(btnPlus);

    bar.appendChild(btnPosDown);
    bar.appendChild(posVal);
    bar.appendChild(btnPosUp);

    bar.appendChild(btnGapMinus);
    bar.appendChild(gapVal);
    bar.appendChild(btnGapPlus);

    host.appendChild(bar);
  }

  function applyFontSize() {
    if (!overlay) return;
    overlay.style.fontSize = fontSizePercent + '%';
  }

  function applyBottomOffset() {
    if (!overlay) return;
    overlay.style.bottom = bottomOffsetPct + '%';
  }

  function applyLineGap() {
    if (!overlay) return;
    overlay.style.setProperty('--dual-gap', lineGapEm + 'em');
  }
})();