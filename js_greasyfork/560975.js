// ==UserScript==
// @name         YouTube Mobile Instant Up Next (0s) - No Countdown Overlay
// @version      0.4
// @description  m.youtube.com：拖到结尾/结束立刻跳下一部；若出现“Up next in 10”倒数层则自动点 Play now（0秒）
// @namespace    http://tampermonkey.net/
// @author       ?
// @license      CC-BY-4.0
// @run-at       document-start
// @match        https://m.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560975/YouTube%20Mobile%20Instant%20Up%20Next%20%280s%29%20-%20No%20Countdown%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/560975/YouTube%20Mobile%20Instant%20Up%20Next%20%280s%29%20-%20No%20Countdown%20Overlay.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const DEBUG = false;
  const dlog = (...a) => DEBUG && console.log('[YT-Next-0s]', ...a);

  const NEAR_END_SEC = 1.0;     // 接近结束阈值
  const SEEK_END_SEC = 0.35;    // 你“拖到最后”的判定（更激进）
  const WAIT_MS = 15000;        // 只在触发时短暂等待 next DOM/按钮出现（覆盖10秒倒数）

  let redirectedForVideoId = '';   // 已经为哪个 videoId 执行过跳转
  let observingForVideoId = '';    // 当前正在为哪个 videoId 做短期观察（避免重复开 observer）

  function isWatchPage() {
    return location.hostname === 'm.youtube.com' && location.pathname === '/watch';
  }

  function curVideoId() {
    try { return new URL(location.href).searchParams.get('v') || ''; }
    catch { return ''; }
  }

  function normalizeNextUrl(href) {
    try {
      const u = new URL(href, location.origin);
      if (u.pathname !== '/watch') return '';
      const v = u.searchParams.get('v') || '';
      if (!v) return '';
      const cur = curVideoId();
      if (cur && v === cur) return '';
      u.hostname = 'm.youtube.com';
      return u.toString();
    } catch {
      return '';
    }
  }

  // ① 最快：<link rel="next">（很多时候最早就存在）
  function findNextFromRelNext() {
    const link = document.querySelector('link[rel="next"][href]');
    if (!link) return '';
    return normalizeNextUrl(link.getAttribute('href') || link.href || '');
  }

  // ② 次快：从 ytInitialData（不依赖结束画面 DOM）
  function findNextFromInitialData() {
    const d = window.ytInitialData;
    if (!d) return '';

    // 桌面/移动不同路径，尽量多兜底
    const candidates = [
      d?.contents?.twoColumnWatchNextResults?.autoplay?.autoplay?.sets?.[0]?.autoplayVideo?.watchEndpoint,
      d?.contents?.singleColumnWatchNextResults?.autoplay?.autoplay?.sets?.[0]?.autoplayVideo?.watchEndpoint,
      d?.playerOverlays?.playerOverlayRenderer?.autoplay?.playerOverlayAutoplayRenderer?.videoId
        ? { videoId: d.playerOverlays.playerOverlayRenderer.autoplay.playerOverlayAutoplayRenderer.videoId }
        : null,
    ].filter(Boolean);

    for (const ep of candidates) {
      const vid = ep.videoId || ep?.watchEndpoint?.videoId;
      if (!vid) continue;
      if (vid === curVideoId()) continue;

      // 如果有 playlist/index，尽量保留（行为更像原生 up next）
      const url = new URL('https://m.youtube.com/watch');
      url.searchParams.set('v', vid);

      const list = ep.playlistId || ep?.watchEndpoint?.playlistId;
      const index = ep.index || ep?.watchEndpoint?.index;
      if (list) url.searchParams.set('list', list);
      if (Number.isFinite(index)) url.searchParams.set('index', String(index));

      return url.toString();
    }
    return '';
  }

  // ③ DOM 兜底
  const NEXT_LINK_SELECTORS = [
    '.ytm-autonav-bar a[href^="/watch"]',
    '.ytm-autonav-bar a[href*="/watch"]',
    'ytm-compact-autoplay-renderer a[href^="/watch"]',
    '[section-identifier="related-items"] a[href^="/watch"]',
    'a[href^="/watch"][data-sessionlink]',
    'a[href^="/watch"]'
  ];

  function findNextFromDom() {
    for (const sel of NEXT_LINK_SELECTORS) {
      const a = document.querySelector(sel);
      if (!a) continue;
      const href = a.getAttribute('href') || a.href || '';
      const next = normalizeNextUrl(href);
      if (next) return next;
    }
    return '';
  }

  function findNextUrlOnce() {
    return (
      findNextFromRelNext() ||
      findNextFromInitialData() ||
      findNextFromDom()
    );
  }

  // 自动点“Play now”（处理你截图那种倒数层）
  function clickPlayNowIfPresent() {
    // 优先：YouTube 常见 class（桌面播放器/部分移动播放器会有）
    const known = document.querySelector(
      '.ytp-autonav-endscreen-upnext-play-button,' +
      '.ytp-autonav-endscreen-upnext-button,' +
      'button.ytp-autonav-endscreen-upnext-play-button'
    );
    if (known && typeof known.click === 'function') {
      dlog('click known play button');
      known.click();
      return true;
    }

    // 通用：找按钮文本（多语言兜底）
    const texts = [
      'play now', 'play next',
      '立即播放', '现在播放', '馬上播放', '立即播放下一部', '播放', '立即'
    ];

    const buttons = document.querySelectorAll('button, [role="button"]');
    for (const b of buttons) {
      const t = (b.textContent || '').trim().toLowerCase();
      if (!t) continue;
      // 避免点到 Cancel
      if (t.includes('cancel') || t.includes('取消')) continue;

      for (const key of texts) {
        if (t.includes(key)) {
          dlog('click play button by text:', t);
          b.click();
          return true;
        }
      }
    }
    return false;
  }

  function isNearEnd(video) {
    try {
      if (video.ended) return true;
      const dur = video.duration;
      const t = video.currentTime;
      if (!Number.isFinite(dur) || dur <= 0) return false;
      return (dur - t) <= NEAR_END_SEC;
    } catch {
      return false;
    }
  }

  function isSeekToEnd(video) {
    try {
      const dur = video.duration;
      const t = video.currentTime;
      if (!Number.isFinite(dur) || dur <= 0) return false;
      return (dur - t) <= SEEK_END_SEC;
    } catch {
      return false;
    }
  }

  function goNext(videoId, reason) {
    if (!isWatchPage()) return;
    if (!videoId || curVideoId() !== videoId) return;
    if (redirectedForVideoId === videoId) return;

    const next = findNextUrlOnce();
    if (next) {
      redirectedForVideoId = videoId;
      dlog('replace =>', next, 'reason=', reason);
      location.replace(next);
      return;
    }

    // next URL 还没出现：短时观察 + 自动点 Play now
    if (observingForVideoId === videoId) {
      // 观察期间也尝试点一次（有时按钮先出来）
      clickPlayNowIfPresent();
      return;
    }
    observingForVideoId = videoId;

    let done = false;
    const obs = new MutationObserver(() => {
      if (done) return;
      if (curVideoId() !== videoId || redirectedForVideoId === videoId) {
        done = true; obs.disconnect(); observingForVideoId = '';
        return;
      }

      // 优先直接跳
      const nx = findNextUrlOnce();
      if (nx) {
        done = true; obs.disconnect(); observingForVideoId = '';
        redirectedForVideoId = videoId;
        dlog('replace (delayed) =>', nx, 'reason=', reason);
        location.replace(nx);
        return;
      }

      // 否则就点“Play now”把倒数变0
      clickPlayNowIfPresent();
    });

    const root = document.body || document.documentElement;
    if (root) obs.observe(root, { childList: true, subtree: true });

    // 立刻尝试一次（避免等 mutation）
    clickPlayNowIfPresent();

    setTimeout(() => {
      if (!done) {
        done = true;
        try { obs.disconnect(); } catch {}
        observingForVideoId = '';
      }
    }, WAIT_MS);
  }

  function bindVideo(video, videoId) {
    // 防止同元素复用导致监听器叠加：用 AbortController 清旧监听
    if (video.__ytNextAbort) {
      try { video.__ytNextAbort.abort(); } catch {}
    }
    const ac = new AbortController();
    video.__ytNextAbort = ac;
    video.dataset.ytNextBoundId = videoId;

    // ended：直接跳
    video.addEventListener('ended', () => {
      if (curVideoId() !== videoId) return;
      goNext(videoId, 'ended');
    }, { passive: true, signal: ac.signal });

    // seeking/seeked：拖到结尾直接跳（你要的“拉到最尾端就跳”）
    const checkSeekEnd = (why) => {
      if (curVideoId() !== videoId) return;
      if (redirectedForVideoId === videoId) return;

      requestAnimationFrame(() => {
        if (curVideoId() !== videoId) return;
        if (isSeekToEnd(video)) goNext(videoId, why);
      });
    };
    video.addEventListener('seeking', () => checkSeekEnd('seeking-to-end'), { passive: true, signal: ac.signal });
    video.addEventListener('seeked',  () => checkSeekEnd('seeked-to-end'),  { passive: true, signal: ac.signal });

    // near-end：无缝（不等倒数层）
    // 这里不用常驻轮询：用 timeupdate 是高频；我们用“偶发触发”的 playing + rAF 小段检查
    let raf = 0;
    const stopRaf = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };

    const rafCheck = () => {
      if (curVideoId() !== videoId || redirectedForVideoId === videoId) return stopRaf();
      if (isNearEnd(video)) return goNext(videoId, 'near-end');
      raf = requestAnimationFrame(rafCheck);
    };

    video.addEventListener('playing', () => {
      stopRaf();
      raf = requestAnimationFrame(rafCheck);
    }, { passive: true, signal: ac.signal });

    video.addEventListener('pause', stopRaf, { passive: true, signal: ac.signal });
  }

  function tryBindCurrentVideo() {
    if (!isWatchPage()) return;
    const videoId = curVideoId();
    if (!videoId) return;

    const video = document.querySelector('video');
    if (!video) return;

    // videoId 变了：允许新一轮跳转
    if (redirectedForVideoId && redirectedForVideoId !== videoId) {
      // 不清也行，但清掉更直观
      // redirectedForVideoId = '';
    }

    if (video.dataset.ytNextBoundId === videoId) return;
    bindVideo(video, videoId);
  }

  // 你原版的常驻 observer（可以保证 SPA / DOM 变化都能重新 bind）
  function startPersistentObserver() {
    let scheduled = false;
    const check = () => { scheduled = false; tryBindCurrentVideo(); };

    const obs = new MutationObserver(() => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(check);
      }
    });

    const start = () => {
      obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
      tryBindCurrentVideo();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }
  }

  function onRouteChange() {
    requestAnimationFrame(tryBindCurrentVideo);
  }

  const _pushState = history.pushState;
  const _replaceState = history.replaceState;

  history.pushState = function () { _pushState.apply(this, arguments); setTimeout(onRouteChange, 0); };
  history.replaceState = function () { _replaceState.apply(this, arguments); setTimeout(onRouteChange, 0); };

  window.addEventListener('popstate', onRouteChange, { passive: true });
  window.addEventListener('yt-navigate-finish', onRouteChange, { passive: true });
  window.addEventListener('yt-navigate-start', onRouteChange, { passive: true });

  startPersistentObserver();
})();
