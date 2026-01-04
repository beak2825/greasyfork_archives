// ==UserScript==
// @name         YouTube List 逆序播放
// @namespace    https://example.com/yt-reverse-autoplay
// @version      2.7
// @description  在播放器控制栏中添加一个开启list逆序播放功能开关
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550479/YouTube%20List%20%E9%80%86%E5%BA%8F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/550479/YouTube%20List%20%E9%80%86%E5%BA%8F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const log = (...a) => console.log('[YT-Rev]', ...a);

  let enabled = false;
  let guardTimer = null;
  let stateListenerSet = false;

  const BTN_ID = 'yt-rev-autoplay-toggle-in-controls';
  const CONTROLS_SEL = '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls';

  const hasPlaylist = () => {
    try {
      const u = new URL(location.href);
      if (u.searchParams.get('list')) return true;
    } catch {}
    return !!document.querySelector('ytd-playlist-panel-renderer');
  };

  const player = () => document.getElementById('movie_player');

  const goPrevPlay = () => {
    const p = player();
    if (!p || typeof p.previousVideo !== 'function') return false;
    p.previousVideo();
    setTimeout(() => p.playVideo && p.playVideo(), 50);
    return true;
  };

  const ensureShuffleOff = () => {
    const shuffleBtn = document.querySelector(
      'ytd-toggle-button-renderer[button-renderer] button[aria-pressed]'
    );
    if (enabled && shuffleBtn && shuffleBtn.getAttribute('aria-pressed') === 'true') {
      shuffleBtn.click();
      log('shuffle off');
    }
  };

  const patchNextButtons = () => {
    const p = player();
    if (!p) return;

    const nextBtn = document.querySelector('.ytp-next-button');
    if (nextBtn && !nextBtn.__revPatched) {
      nextBtn.__revPatched = true;
      nextBtn.addEventListener('click', (e) => {
        if (!enabled) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        goPrevPlay();
      }, true);
      log('patched main next');
    }

    qsa('ytd-playlist-panel-renderer #next-button button').forEach(btn => {
      if (!btn.__revPatched) {
        btn.__revPatched = true;
        btn.addEventListener('click', (e) => {
          if (!enabled) return;
          e.stopImmediatePropagation();
          e.preventDefault();
          goPrevPlay();
        }, true);
        log('patched panel next');
      }
    });
  };

  const attachStateListener = () => {
    const p = player();
    if (!p || stateListenerSet || typeof p.addEventListener !== 'function') return;

    const onState = (s) => {
      // 1 PLAYING, 2 PAUSED, 0 ENDED, 3 BUFFERING, 5 CUED
      if (!enabled) return;
      if (s === 0) {
        log('onStateChange -> ENDED, go previous');
        goPrevPlay();
      } else if (s === 1) {
        startNearEndGuard();
      }
    };

    try {
      p.addEventListener('onStateChange', onState);
      stateListenerSet = true;
      log('state listener attached');
    } catch (e) {
      log('addEventListener failed', e);
    }
  };

  const startNearEndGuard = () => {
    clearInterval(guardTimer);
    const p = player();
    if (!p || typeof p.getDuration !== 'function' || typeof p.getCurrentTime !== 'function') return;

    guardTimer = setInterval(() => {
      if (!enabled) return clearInterval(guardTimer);
      const d = p.getDuration ? p.getDuration() : 0;
      const t = p.getCurrentTime ? p.getCurrentTime() : 0;
      if (d > 0 && d - t <= 0.7) {
        log('near end, preempt -> previous');
        clearInterval(guardTimer);
        goPrevPlay();
      }
    }, 150);
  };

    const makeBtn = () => {
        const btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.className = 'ytp-button';
        btn.title = '逆序播放';
        btn.setAttribute('aria-label', '逆序播放');
        btn.style.opacity = '0.6';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';

        const ref = document.querySelector('.ytp-subtitles-button.ytp-button') || document.querySelector('.ytp-button');
        if (ref) {
            const cs = getComputedStyle(ref);
            btn.style.width = cs.width;
            btn.style.height = cs.height;
            btn.style.padding = cs.padding;
        } else {
            btn.style.width = '54px';
            btn.style.height = '54px';
            btn.style.padding = '0 2px';
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 36 36');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'currentColor');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '1.4');
        path.setAttribute('d', 'M7 6h6a7 7 0 1 1-6.3 9.8l.9-.45A6 6 0 1 0 13 7H7.8l1.6 1.6-.7.7L5.7 6.3 8.7 3.3l.7.7L7 6z');
        path.setAttribute('transform', 'translate(6,6) scale(0.90)');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        svg.appendChild(path);
        btn.appendChild(svg);

        const setOn = (on) => {
            enabled = on;
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
            btn.style.opacity = on ? '1' : '0.6';
            if (on) {
                ensureShuffleOff();
                patchNextButtons();
                attachStateListener();
                startNearEndGuard();
            } else {
                clearInterval(guardTimer);
            }
        };

        btn.addEventListener('click', () => setOn(!enabled));
        setOn(hasPlaylist());
        return btn;
    };

    const placeBtn = async () => {
        let host = null;
        for (let i = 0; i < 40; i++) {
            host = qs('.ytp-right-controls');
            if (host) break;
            await sleep(150);
        }
        if (!host) return;

        if (!document.getElementById(BTN_ID)) {
            const btn = makeBtn();
            host.insertBefore(btn, host.firstChild);
        }
    };

  const keepAlive = () => {
    const mo = new MutationObserver(() => {
      if (!qs(`#${BTN_ID}`)) placeBtn();
      if (enabled) {
        patchNextButtons();
        attachStateListener();
      }
    });
    mo.observe(document.body, {subtree: true, childList: true});

    let last = location.href;
    const urlMo = new MutationObserver(() => {
      const now = location.href;
      if (now !== last) {
        last = now;
        const old = qs(`#${BTN_ID}`);
        if (old && old.parentElement) old.parentElement.removeChild(old);
        placeBtn();
      }
    });
    urlMo.observe(document, {subtree: true, childList: true});
  };

  (async () => {
    await placeBtn();
    keepAlive();
    log('ready');
  })();
})();
