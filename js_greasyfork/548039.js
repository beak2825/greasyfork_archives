// ==UserScript==
// @name         MagentaSport Player Keyboard Shortcuts
// @namespace    https://github.com/dusanvin/MagentaSport-Videoplayer-Shortcuts
// @version      1.0
// @description  Add NBA-style shortcuts (J/L/U/O/Space + S/D) to the MagentaSport player. Works with Mozilla Firefox.
// @author       Vincent Dusanek
// @license      CC-BY-NC-SA-4.0
// @match        https://www.magentasport.de/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548039/MagentaSport%20Player%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/548039/MagentaSport%20Player%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Anpassbare Schrittweiten (Sekunden)
  const STEP_SMALL = 10;   // J / L
  const STEP_LARGE = 60;   // U / O

  // Diskrete Geschwindigkeitsstufen (min 0.1x, max 16x)
  const RATE_STEPS = [0.1, 0.25, 0.5, 1, 2, 4, 8, 16];

  // Kleines Overlay für Feedback
  let toast;
  function ensureToast() {
    if (toast) return toast;
    toast = document.createElement('div');
    toast.id = 'ms-shortcuts-toast';
    Object.assign(toast.style, {
      position: 'fixed',
      left: '50%',
      bottom: '12%',
      transform: 'translateX(-50%)',
      padding: '8px 12px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.65)',
      color: '#fff',
      fontSize: '14px',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      zIndex: 999999,
      opacity: '0',
      transition: 'opacity .15s ease',
      pointerEvents: 'none',
      userSelect: 'none'
    });
    document.documentElement.appendChild(toast);
    return toast;
  }
  let toastTimer;
  function showToast(text) {
    const el = ensureToast();
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.style.opacity = '0'), 650);
  }

  // Aktives Video finden (robust bei SPA/Reload des Players)
  function findActiveVideo() {
    // Bevorzugt das bekannte Magenta-Video
    const byId = document.querySelector('#sravvpl_video-element--0');
    if (byId && isUsableVideo(byId)) return byId;

    // Fallback: sichtbares, initialisiertes <video>
    const vids = Array.from(document.querySelectorAll('video'));
    const candidates = vids
      .filter(isUsableVideo)
      .sort((a, b) => (scoreVideo(b) - scoreVideo(a))); // priorisieren

    return candidates[0] || null;
  }
  function isUsableVideo(v) {
    if (!(v instanceof HTMLVideoElement)) return false;
    const rect = v.getBoundingClientRect();
    const visible = rect.width > 0 && rect.height > 0;
    return visible;
  }
  function scoreVideo(v) {
    let s = 0;
    if (v.currentSrc || v.src) s += 2;
    if (isFinite(v.duration) && v.duration > 0) s += 2;
    if (!v.paused) s += 1;
    return s;
  }

  // Zielzeit in erlaubten Bereich klemmen (auch für Live/DVR)
  function clampTime(video, target) {
    try {
      const seekable = video.seekable;
      if (seekable && seekable.length) {
        const start = seekable.start(0);
        const end = seekable.end(seekable.length - 1);
        const epsilon = 0.25; // kleine Marge am Ende
        return Math.min(Math.max(target, start), end - epsilon);
      }
    } catch (e) {}
    if (isFinite(video.duration) && video.duration > 0) {
      const epsilon = 0.25;
      return Math.min(Math.max(target, 0), video.duration - epsilon);
    }
    return Math.max(target, 0);
  }

  function seekBy(video, delta) {
    const target = clampTime(video, (video.currentTime || 0) + delta);
    video.currentTime = target;
    const sign = delta > 0 ? '+' : '–';
    const secs = Math.abs(delta);
    showToast(`${sign}${secs}s`);
  }

  function togglePlay(video) {
    if (video.paused) {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      showToast('▶︎');
    } else {
      video.pause();
      showToast('⏸');
    }
  }

  // Geschwindigkeit anpassen (dir: +1 schneller, -1 langsamer)
  function bumpRate(video, dir) {
    const cur = video.playbackRate || 1;
    const eps = 1e-6;
    let next = cur;

    if (dir > 0) {
      // nächstgrößere Stufe finden, sonst Maximum
      next = RATE_STEPS.find(r => r > cur + eps) ?? RATE_STEPS[RATE_STEPS.length - 1];
    } else {
      // nächstkleinere Stufe finden, sonst Minimum
      for (let i = RATE_STEPS.length - 1; i >= 0; i--) {
        if (RATE_STEPS[i] < cur - eps) {
          next = RATE_STEPS[i];
          break;
        }
      }
      if (next === cur) next = RATE_STEPS[0];
    }

    video.playbackRate = next;
    showToast(`${formatRate(next)}×`);
  }

  function formatRate(r) {
    // hübsche Ausgabe, max. 2 Nachkommastellen, ohne überflüssige Nullen
    const s = (Math.round(r * 100) / 100).toString();
    return s.replace(/(\.\d*[1-9])0+$|\.0+$/, '$1');
  }

  // Nur auslösen, wenn nicht gerade in einem Eingabefeld getippt wird
  function isTypingInField(e) {
    const t = e.target;
    return (
      t &&
      (t.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/i.test(t.tagName))
    );
  }

  // Einmal registrieren – auch bei SPA-Navigation ausreichend
  window.addEventListener('keydown', (e) => {
    if (isTypingInField(e)) return;

    const key = e.key.toLowerCase();
    if (!['j', 'l', 'u', 'o', ' ', 's', 'd'].includes(key)) return;

    const video = findActiveVideo();
    if (!video) return;

    // optional: Wiederholungen (Taste gehalten) ignorieren
    if (e.repeat) return;

    if (key === ' ') {
      e.preventDefault(); // Scrollen der Seite verhindern
      togglePlay(video);
      return;
    }

    switch (key) {
      case 'j':
        seekBy(video, -STEP_SMALL);
        break;
      case 'l':
        seekBy(video, +STEP_SMALL);
        break;
      case 'u':
        seekBy(video, -STEP_LARGE);
        break;
      case 'o':
        seekBy(video, +STEP_LARGE);
        break;
      case 's': // langsamer
        bumpRate(video, -1);
        break;
      case 'd': // schneller
        bumpRate(video, +1);
        break;
    }
  });

  // Bonus: Reagiere auf Player-Wechsel (SPA) und räume altes Toast auf
  const mo = new MutationObserver(() => {
    if (toast && !document.documentElement.contains(toast)) {
      toast = null;
      ensureToast();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
