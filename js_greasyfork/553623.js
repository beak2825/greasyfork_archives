// ==UserScript==
// @license MIT
// @name         BilibiliSponsorBlock-Tampermonkey
// @namespace    https://github.com/MCfengyou/BilibiliSponsorBlock-Tampermonkey
// @version      1.1
// @description  使用 bsbsb.top API 跳过标注片段，并以绿色在进度条上标注广告时段
// @author       NeoGe_and_GPT-5
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553623/BilibiliSponsorBlock-Tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/553623/BilibiliSponsorBlock-Tampermonkey.meta.js
// ==/UserScript==



(function() {
  'use strict';
  const LOG = (...a)=>console.log('[BSB+ FIX6R7]',...a);
  const API = 'https://bsbsb.top/api/skipSegments?videoID=';

  // state
  let currentBV = null;
  let segments = [];
  let videoEl = null;
  let progressEl = null;
  let markerLayer = null;
  let observer = null;
  let pendingPrompt = null;    // { seg, rule, key }
  let promptTimer = null;

  // control flags
  let manualInSegment = false; // user manually entered this ad segment
  let userSeeking = false;
  let suppressedSegmentKey = null; // the segment key for which prompts are suppressed while inside it
  let lastTime = 0;

  // throttle
  let renderScheduled = false;
  let lastProgressCheck = 0;

  const CATEGORY_RULES = {
    intro:       { label: '过场/开场动画', color: 'rgb(0,255,255)', mode: 'manual' },
    selfpromo:   { label: '无偿/自我推广', color: 'rgb(255,255,0)', mode: 'manual' },
    sponsor:     { label: '赞助/恰饭', color: 'rgb(0,212,0)', mode: 'auto' },
    interaction: { label: '三连/互动提醒', color: 'rgb(204,0,255)', mode: 'manual' },
    preview:     { label: '回顾/概要', color: 'rgb(0,143,214)', mode: 'marker' },
    outro:       { label: '鸣谢/结束画面', color: 'rgb(2,2,237)', mode: 'manual' }
  };

  // ---------- helpers ----------
  function getBV(){ const m = location.href.match(/BV[0-9A-Za-z]+/); return m ? m[0] : null; }

  async function fetchSegments(bv) {
    if (!bv) return [];
    try {
      const res = await fetch(API + bv);
      if (!res.ok) { LOG('segment API status', res.status); return []; }
      const json = await res.json();
      if (!Array.isArray(json)) return [];
      return json.map(item => ({
        start: Number(item.segment?.[0] ?? item.start ?? 0),
        end: Number(item.segment?.[1] ?? item.end ?? 0),
        category: item.category ?? 'sponsor'
      })).filter(s => CATEGORY_RULES[s.category] && isFinite(s.start) && isFinite(s.end) && s.end > s.start);
    } catch (e) {
      LOG('fetchSegments error', e);
      return [];
    }
  }

  function findVideo() {
    const vids = Array.from(document.querySelectorAll('video'));
    for (const v of vids) if (v.offsetParent !== null || v.getClientRects().length) return v;
    return vids[0] || null;
  }

  function findProgress() {
    const candidates = [
      '.bpx-player-progress-wrap',
      '.bpx-player-progress',
      '.bilibili-player-video-progress',
      '.bilibili-player-progress',
      '.bui-progress'
    ];
    for (const s of candidates) {
      const el = document.querySelector(s);
      if (el) return el;
    }
    // fallback near controls
    const ctrl = document.querySelector('.bilibili-player-video-control-bottom') || document.querySelector('.bpx-player-container');
    if (ctrl) {
      const el = ctrl.querySelector('.bpx-player-progress-wrap, .bpx-player-progress, .bilibili-player-video-progress');
      if (el) return el;
    }
    return null;
  }

  function ensureMarkerLayerAttached() {
    const p = findProgress();
    if (!p) return null;
    progressEl = p;
    if (markerLayer && markerLayer.parentElement && markerLayer.parentElement !== progressEl) {
      markerLayer.remove();
      markerLayer = null;
    }
    if (!markerLayer) {
      markerLayer = document.createElement('div');
      markerLayer.className = 'bsb-marker-layer';
      Object.assign(markerLayer.style, {
        position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9
      });
    }
    const cs = getComputedStyle(progressEl);
    if (cs.position === 'static') progressEl.style.position = 'relative';
    if (!progressEl.contains(markerLayer)) progressEl.appendChild(markerLayer);
    return markerLayer;
  }

  function renderMarkers() {
    if (!videoEl) return;
    const p = findProgress();
    if (!p) return;
    ensureMarkerLayerAttached();
    const dur = videoEl.duration || 0;
    if (!dur || !isFinite(dur) || dur <= 0) return;
    const html = segments.map(seg => {
      const rule = CATEGORY_RULES[seg.category];
      if (!rule) return '';
      const left = (seg.start / dur) * 100;
      const width = ((seg.end - seg.start) / dur) * 100;
      return `<div style="position:absolute;left:${left}%;width:${width}%;height:100%;background:${rule.color};opacity:.45;border-radius:2px;"></div>`;
    }).join('');
    markerLayer.innerHTML = html;
    LOG('Markers rendered (count=' + segments.length + ')');
  }

  function scheduleRenderThrottled() {
    if (renderScheduled) return;
    renderScheduled = true;
    setTimeout(() => { try { renderMarkers(); } catch (e) { LOG('renderMarkers e', e); } renderScheduled = false; }, 500);
  }

  function delayedMarkerAttempts(times = 3, interval = 800) {
    for (let i = 1; i <= times; i++) {
      setTimeout(() => scheduleRenderThrottled(), i * interval);
    }
  }

  // ---------- prompt management ----------
  // segKey string
  function segKeyFor(seg){ return `${seg.start}-${seg.end}`; }

  function removePrompt(suppressForCurrentSegment = true) {
    try {
      const el = document.getElementById('bsb-prompt');
      if (el) {
        // fade out
        el.style.transition = 'opacity .18s ease';
        el.style.opacity = '0';
        setTimeout(()=>{ if (el && el.parentElement) el.remove(); }, 200);
      }
      if (promptTimer) { clearInterval(promptTimer); promptTimer = null; }
      if (pendingPrompt && suppressForCurrentSegment) {
        // Suppress further prompts for this segment while user remains inside it
        suppressedSegmentKey = pendingPrompt.key;
        LOG('Suppressed segment', suppressedSegmentKey);
      }
      pendingPrompt = null;
    } catch (e) { LOG('removePrompt error', e); }
  }

  function showManualPrompt(seg, rule) {
    try {
      // if this segment is currently suppressed, do nothing
      const key = segKeyFor(seg);
      if (suppressedSegmentKey === key) return;

      // remove any previous prompt cleanly
      removePrompt(false);

      const div = document.createElement('div');
      div.id = 'bsb-prompt';
      // Ensure pointer events enabled and high z-index
      div.style.cssText = `
        position:fixed;
        right:40px;
        bottom:120px;
        background:rgba(0,0,0,0.78);
        color:#fff;
        padding:10px 14px;
        border-radius:10px;
        font-size:14px;
        z-index:2147483647;
        display:flex;
        align-items:center;
        gap:8px;
        pointer-events:auto;
        user-select:none;
        opacity:0;
      `;

      const span = document.createElement('span');
      span.style.color = rule.color;
      span.innerHTML = `[${rule.label}] ｜ 按 Enter 键跳过 (<span id="bsb-count">5</span>s)`;
      const closeBtn = document.createElement('span');
      closeBtn.id = 'bsb-close';
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = 'cursor:pointer;margin-left:8px;pointer-events:auto;';

      div.appendChild(span);
      div.appendChild(closeBtn);
      document.body.appendChild(div);
      // fade in
      requestAnimationFrame(()=> { div.style.transition='opacity .18s'; div.style.opacity='1'; });

      pendingPrompt = { seg, rule, key };

      // timer ensure single timer; always clear older timer first
      if (promptTimer) { clearInterval(promptTimer); promptTimer = null; }
      let sec = 5;
      const countSpan = div.querySelector('#bsb-count');
      promptTimer = setInterval(() => {
        sec--;
        const cnt = document.getElementById('bsb-count');
        if (cnt) cnt.textContent = sec;
        if (sec <= 0) {
          // when timeout expire, we consider this as "user closed via timeout"
          removePrompt(true);
        }
      }, 1000);

      // close button handling - stop propagation and remove prompt + suppress
      closeBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        removePrompt(true);
      }, { passive: true });

    } catch (e) { LOG('showManualPrompt error', e); }
  }

  function showNotice(text, color='rgba(0,212,0,0.92)') {
    try {
      const el = document.createElement('div');
      el.textContent = text;
      Object.assign(el.style, {
        position: 'fixed', right: '28px', bottom: '120px',
        background: color, color: '#fff', padding: '8px 12px',
        borderRadius: '8px', fontSize: '14px', zIndex: 2147483647,
        pointerEvents: 'none', opacity: '0', transition: 'opacity .2s'
      });
      const target = document.fullscreenElement || document.body;
      target.appendChild(el);
      requestAnimationFrame(()=> el.style.opacity='1');
      setTimeout(()=> el.style.opacity='0', 1600);
      setTimeout(()=> el.remove(), 2000);
    } catch (e) { LOG('showNotice error', e); }
  }

  // ---------- key handling: Enter skip, Delete close ----------
  if (!window.__bsb_keys_attached) {
    window.addEventListener('keydown', (ev) => {
      try {
        if (!pendingPrompt) return;
        if (ev.key === 'Enter') {
          // perform skip
          if (videoEl && pendingPrompt) {
            videoEl.currentTime = Math.min(pendingPrompt.seg.end + 0.05, videoEl.duration || pendingPrompt.seg.end + 0.05);
            showNotice(`${pendingPrompt.rule.label} 已跳过`, pendingPrompt.rule.color);
            removePrompt(true); // suppress while in segment
          }
        } else if (ev.key === 'Delete' || ev.key === 'Backspace') {
          // close prompt without skipping, but suppress while inside
          removePrompt(true);
          showNotice('已关闭提示', 'rgba(120,120,120,0.9)');
        }
      } catch (e) { LOG('keydown handler error', e); }
    }, { passive: true });
    window.__bsb_keys_attached = true;
  }

  // ---------- playback handlers ----------
  function inSegmentAtTime(t) {
    return segments.find(s => t >= s.start && t < s.end);
  }

  function onTimeUpdate() {
    if (!videoEl) return;
    const t = videoEl.currentTime;
    const seg = inSegmentAtTime(t);

    // if left any previously suppressed segment, clear suppression
    if (!seg) {
      if (suppressedSegmentKey) {
        // user moved out of suppressed segment - reset suppression
        suppressedSegmentKey = null;
        LOG('Cleared suppressedSegmentKey (left segment)');
      }
      manualInSegment = false;
      lastTime = t;
      return;
    }

    // If we are inside a segment
    const rule = CATEGORY_RULES[seg.category];
    if (!rule) { lastTime = t; return; }

    // If the current segment is the suppressed one, do nothing (no prompts)
    const key = segKeyFor(seg);
    if (suppressedSegmentKey === key) { lastTime = t; return; }

    // Determine naturalPlay: small positive delta and not currently seeking and not known manualInSegment
    const delta = t - lastTime;
    const naturalPlay = delta > 0 && delta < 2 && !userSeeking && !manualInSegment;
    lastTime = t;

    if (rule.mode === 'auto') {
      if (naturalPlay) {
        try {
          videoEl.currentTime = Math.min(seg.end + 0.05, videoEl.duration || seg.end + 0.05);
          showNotice(`${rule.label} 已跳过`, rule.color);
        } catch (e) { LOG('auto skip failed', e); }
      } else {
        // user manually seeked into it -> do nothing (allow watching)
      }
    } else if (rule.mode === 'manual') {
      // show prompt only on naturalPlay OR if user arrived exactly at seg.start (special case)
      // But we must avoid prompting repeatedly: only show if not pendingPrompt and not suppressed
      if (!pendingPrompt && naturalPlay) {
        showManualPrompt(seg, rule);
      }
      // also: if user just seeked exactly to segment start (we detect in seeking handler and set manualInSegment accordingly),
      // we want to show prompt when they re-enter segment HEAD (requirement #4). We'll handle that in seeking handler.
    }
  }

  function onSeeking() {
    userSeeking = true;
    try {
      const t = videoEl.currentTime;
      const seg = inSegmentAtTime(t);
      if (seg) {
        // user manually entered the segment -> set manualInSegment true and do NOT show prompt instantly
        manualInSegment = true;
        // Do NOT set suppressedSegmentKey yet — we only suppress after user actively closes prompt.
        LOG('User seeking: manualInSegment set for segment', segKeyFor(seg));
      }
    } catch (e) { LOG('onSeeking error', e); }
  }

  function onSeeked() {
    // If user seeked to just before the segment start (within small tolerance) -- treat as "re-enter at segment head"
    try {
      const t = videoEl.currentTime;
      const seg = inSegmentAtTime(t);
      if (seg) {
        const tolerance = 0.35; // seconds tolerance for "segment head"
        if (Math.abs(t - seg.start) < tolerance) {
          // reset suppression for this segment so prompt will appear (requirement 4)
          if (suppressedSegmentKey === segKeyFor(seg)) {
            suppressedSegmentKey = null;
            LOG('User jumped to segment head -> cleared suppression for', segKeyFor(seg));
          }
          // Show prompt since user explicitly jumped to segment head (but only if not already pending)
          if (!pendingPrompt && CATEGORY_RULES[seg.category].mode === 'manual') {
            // show prompt after a tiny delay so timeupdate doesn't race
            setTimeout(()=>{ if (!pendingPrompt) showManualPrompt(seg, CATEGORY_RULES[seg.category]); }, 60);
          }
        } else {
          // user seeked somewhere inside the segment - mark manualInSegment so we don't auto-skip
          manualInSegment = true;
        }
      } else {
        // not in segment
        manualInSegment = false;
      }
    } catch (e) { LOG('onSeeked error', e); }
    // clear seeking flag after short delay
    setTimeout(()=> { userSeeking = false; }, 700);
  }

  function attachVideoHandlers(v) {
    if (!v) return;
    if (videoEl && videoEl !== v) {
      try {
        videoEl.removeEventListener('timeupdate', onTimeUpdate);
        videoEl.removeEventListener('seeking', onSeeking);
        videoEl.removeEventListener('seeked', onSeeked);
        videoEl.removeEventListener('loadedmetadata', onLoadedMetadata);
      } catch (e) { /* ignore */ }
    }
    videoEl = v;
    videoEl.addEventListener('timeupdate', onTimeUpdate, { passive: true });
    videoEl.addEventListener('seeking', onSeeking);
    videoEl.addEventListener('seeked', onSeeked);
    videoEl.addEventListener('loadedmetadata', onLoadedMetadata);
    LOG('Attached video handlers.');
  }

  function onLoadedMetadata() {
    delayedMarkerAttempts(3, 700);
  }

  // progress observer
  function attachProgressObserver() {
    try {
      if (observer) { observer.disconnect(); observer = null; }
      const target = findProgress();
      if (!target) return;
      observer = new MutationObserver(()=> scheduleRenderThrottled());
      observer.observe(target, { childList: true, subtree: true });
      LOG('Progress observer attached.');
    } catch (e) { LOG('attachProgressObserver error', e); }
  }

  // pollers to detect replacements
  function checkVideoChange() {
    try {
      const v = findVideo();
      if (v && v !== videoEl) {
        LOG('Detected video element change -> reattach');
        attachVideoHandlers(v);
        scheduleRenderThrottled();
        delayedMarkerAttempts(3,700);
        attachProgressObserver();
      }
    } catch (e) { LOG('checkVideoChange error', e); }
  }

  function checkProgressAndMarkers() {
    const now = Date.now();
    if (now - lastProgressCheck < 900) return;
    lastProgressCheck = now;
    try {
      if (!videoEl) {
        const v = findVideo();
        if (v) attachVideoHandlers(v);
      }
      if (!videoEl || !segments.length) return;
      const p = findProgress();
      if (!p) { delayedMarkerAttempts(3,800); return; }
      if (!p.contains(markerLayer) || !markerLayer) {
        LOG('Marker layer missing -> reattach');
        ensureMarkerLayerAttached();
        scheduleRenderThrottled();
        delayedMarkerAttempts(3,700);
      } else {
        if (markerLayer && markerLayer.children.length === 0 && segments.length > 0) {
          scheduleRenderThrottled();
        }
      }
      if (!observer) attachProgressObserver();
    } catch (e) { LOG('checkProgressAndMarkers error', e); }
  }

  // init for BV
  async function initializeForBV() {
    const bv = getBV(); if (!bv) return;
    if (bv === currentBV) return;
    currentBV = bv;
    LOG('Initialize for', bv);
    // reset state
    suppressedSegmentKey = null;
    manualInSegment = false;
    userSeeking = false;
    pendingPrompt && removePrompt(false);

    segments = await fetchSegments(bv);
    LOG('Segments loaded', segments.length);

    // attach video handlers if present
    const v = findVideo();
    if (v) attachVideoHandlers(v);
    scheduleRenderThrottled();
    delayedMarkerAttempts(3, 700);
    attachProgressObserver();
  }

  // SPA detection + pollers
  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      LOG('URL changed -> schedule init');
      setTimeout(initializeForBV, 700);
    }
    try { checkVideoChange(); checkProgressAndMarkers(); } catch (e) {}
  }, 800);

  // light global observer to detect heavy DOM churn
  const globalObserver = new MutationObserver((muts) => {
    if (muts.length > 8) setTimeout(initializeForBV, 900);
  });
  globalObserver.observe(document.body, { childList: true, subtree: true });

  // start
  setTimeout(initializeForBV, 1200);

  // Expose debug helper
  window.__bsb_debug_state = () => ({
    currentBV, segmentsCount: segments.length, videoExists: !!videoEl, progressExists: !!findProgress(), markerExists: !!markerLayer, suppressedSegmentKey
  });

  LOG('BSB+ FIX6R7 loaded.');
})();
