// ==UserScript==
// @name         Twitch - Keep Tab Active
// @namespace    twitch-keep-tab-active
// @version      1.0.0
// @description  Prevents Twitch from auto-pausing or throttling video when the tab is inactive
// @author       Vikindor (https://vikindor.github.io/)
// @homepageURL  https://github.com/Vikindor/twitch-keep-tab-active/
// @supportURL   https://github.com/Vikindor/twitch-keep-tab-active/issues
// @license      MIT
// @match        https://www.twitch.tv/*
// @match        https://player.twitch.tv/*
// @match        https://embed.twitch.tv/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553862/Twitch%20-%20Keep%20Tab%20Active.user.js
// @updateURL https://update.greasyfork.org/scripts/553862/Twitch%20-%20Keep%20Tab%20Active.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const uw = unsafeWindow || window;

  let lastUserGesture = 0;
  const userGestureWindowMs = 1200;

  const markGesture = () => { lastUserGesture = Date.now(); };
  const gestureEvents = ['pointerdown','mousedown','mouseup','keydown','touchstart','click','space','keypress'];
  uw.addEventListener('DOMContentLoaded', () => {
    gestureEvents.forEach(ev => uw.addEventListener(ev, markGesture, {capture:true, passive:true}));
  }, {once:true});

  const defineConstProp = (proto, prop, val) => {
    try {
      const d = Object.getOwnPropertyDescriptor(proto, prop);
      if (d && d.get && String(d.get).includes('tmKeepActive')) return;
      Object.defineProperty(proto, prop, {
        configurable: true, enumerable: true,
        get: function tmKeepActive() { return val; }
      });
    } catch {}
  };

  const DocProto = (uw.Document && uw.Document.prototype) || Document.prototype;
  defineConstProp(DocProto, 'hidden', false);
  defineConstProp(DocProto, 'webkitHidden', false);
  defineConstProp(DocProto, 'visibilityState', 'visible');
  try {
    Object.defineProperty(DocProto, 'hasFocus', {
      configurable: true,
      value: function(){ return true; }
    });
  } catch {}

  const stopOn = new Set(['visibilitychange','webkitvisibilitychange','freeze','pagehide']);
  const addSilent = (t, type) => {
    try {
      t.addEventListener(type, ev => { ev.stopImmediatePropagation(); }, true);
    } catch {}
  };
  stopOn.forEach(type => addSilent(uw.document, type));
  addSilent(uw, 'blur');

  const HME = (uw.HTMLMediaElement || HTMLMediaElement).prototype;
  const originalPause = HME.pause;
  const originalPlay  = HME.play;

  const shouldAllowProgrammaticPause = () =>
    (Date.now() - lastUserGesture) <= userGestureWindowMs;

  Object.defineProperty(HME, 'pause', {
    configurable: true,
    value: function tmGuardedPause() {
      if (shouldAllowProgrammaticPause()) {
        return originalPause.apply(this, arguments);
      }
      try {
        const p = originalPlay.apply(this, []);
        if (p && typeof p.catch === 'function') p.catch(()=>{});
      } catch {}
    }
  });

  const resumeIfPaused = (v) => {
    try {
      if (v && v.paused && v.readyState > 2) {
        const pr = originalPlay.call(v);
        if (pr && typeof pr.catch === 'function') pr.catch(()=>{});
      }
    } catch {}
  };

  new uw.MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes && m.addedNodes.forEach(n => {
        if (n && n.nodeType === 1) {
          if (n.tagName === 'VIDEO') resumeIfPaused(n);
          n.querySelectorAll?.('video')?.forEach(resumeIfPaused);
        }
      });
    }
  }).observe(uw.document.documentElement, {childList: true, subtree: true});

  uw.document.addEventListener('pause', (ev) => {
    const el = ev.target;
    if (el instanceof uw.HTMLMediaElement && !shouldAllowProgrammaticPause()) {
      try { ev.stopImmediatePropagation(); } catch {}
      resumeIfPaused(el);
    }
  }, true);

  const NativeIO = uw.IntersectionObserver;
  if (typeof NativeIO === 'function') {
    const IOProxy = function(callback, options) {
      const wrapped = function(entries, observer) {
        const patched = entries.map(e => {
          const t = e.target;
          const isVideoish =
            t.tagName === 'VIDEO' ||
            t.closest?.('[data-a-target="player-overlay"],[data-a-target="player-container"]');
          if (isVideoish) {
            return Object.assign({}, e, {
              isIntersecting: true,
              intersectionRatio: 1,
              boundingClientRect: t.getBoundingClientRect?.() || e.boundingClientRect,
              intersectionRect: t.getBoundingClientRect?.() || e.intersectionRect,
              rootBounds: e.rootBounds
            });
          }
          return e;
        });
        try { return callback(patched, observer); } catch {}
      };
      return new NativeIO(wrapped, options);
    };
    IOProxy.prototype = NativeIO.prototype;
    uw.IntersectionObserver = IOProxy;
  }

  uw.setInterval(() => {
    try {
      uw.dispatchEvent(new uw.MouseEvent('mousemove', {bubbles:true}));
    } catch {}
  }, 30000);

  try { uw.navigator.wakeLock?.request?.('screen').catch(()=>{}); } catch {}

  let lastOverlayHandled = 0;

  const tryRecoverStream = () => {
    const overlay = uw.document.querySelector(
      '[data-a-target="player-overlay-content-gate"]'
    );
    if (!overlay) return;

    const now = Date.now();
    if (now - lastOverlayHandled < 3000) return;

    const button = overlay?.querySelector('button:not([disabled])');

    if (button) {
      lastOverlayHandled = now;
      button.click();
    }
  };

  new uw.MutationObserver(tryRecoverStream)
    .observe(uw.document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true
    });
})();
