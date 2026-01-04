// ==UserScript==
// @name         Bounce Client For Bloxd New Hacks
// @namespace    http://ugvsos.local
// @version      1.1
// @description  Bloxd Io
// @match        https://bloxd.io/*
// @match        https://discordapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552838/Bounce%20Client%20For%20Bloxd%20New%20Hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/552838/Bounce%20Client%20For%20Bloxd%20New%20Hacks.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Configuration (edit if you want) ----------
  const videoId = 'dQw4w9WgXcQ'; // Rickroll video
  const autoShow = true;          // show automatically when script runs
  const muted = false;            // set false to request sound (browsers may block autoplay with sound)
  const controls = false;         // show player controls (true/false)
  const loop = false;             // loop the video (true/false)
  const startSeconds = 0;         // start time in seconds
  const OVERLAY_ID = 'vm-rickroll-overlay-ugvs';
  // -------------------------------------------------------

  function getSrc() {
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      controls: controls ? '1' : '0',
      start: String(startSeconds),
      loop: loop ? '1' : '0',
      // when loop is true, playlist param required
      ...(loop ? { playlist: videoId } : {})
    });
    // YouTube's embed doesn't support a "mute" query param on all platforms; we set it here for best-effort.
    if (muted) params.set('mute', '1');
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  function removeOverlay() {
    const existing = document.getElementById(OVERLAY_ID);
    if (existing) existing.remove();
    const s = document.getElementById(OVERLAY_ID + '-style');
    if (s) s.remove();
    // try to restore scrolling (best-effort)
    try { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; } catch (e) {}
  }

  function createOverlay() {
    removeOverlay();

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('role', 'presentation');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 2147483647 !important;
      background: rgba(0,0,0,0.0);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      user-select: none;
    `;

    // Lighter background layer (greenish cinematic tint) - reduced opacity so video is clearer
    const tint = document.createElement('div');
    tint.style.cssText = `
      position:absolute;
      inset:0;
      pointer-events:none;
      background:
        linear-gradient(90deg,#003300 0%, #004400 25%, #111111 50%, #004400 75%, #003300 100%);
      filter: contrast(105%) saturate(120%);
      opacity: 0.28; /* lighter than before */
    `;
    overlay.appendChild(tint);

    // Slight vignette to keep edges readable but not too dark
    const vignette = document.createElement('div');
    vignette.style.cssText = `
      position:absolute;
      inset:0;
      pointer-events:none;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.12) 100%);
      mix-blend-mode: multiply;
      opacity: 1;
    `;
    overlay.appendChild(vignette);

    // Holder for iframe
    const holder = document.createElement('div');
    holder.style.cssText = `
      width:100%;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:0;
      margin:0;
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = getSrc();
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.style.cssText = `
      width:100vw;
      height:100vh;
      max-width:100%;
      max-height:100%;
      border:0;
      margin:0;
      padding:0;
      display:block;
      background:#000;
    `;

    // Make iframe clickable so the user can click to unmute / interact.
    // NOTE: clicking may open YouTube controls or focus the player; browsers often require user interaction to allow sound.
    iframe.style.pointerEvents = 'auto';

    holder.appendChild(iframe);
    overlay.appendChild(holder);

    // Instruction text (small) to help unmute if autoplay is blocked
    const instruct = document.createElement('div');
    instruct.id = OVERLAY_ID + '-hint';
    instruct.style.cssText = `
      position: fixed;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483648 !important;
      padding: 8px 14px;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      font-size: 14px;
      color: #dfffe0;
      background: rgba(0,0,0,0.45);
      border: 1px solid rgba(0,255,120,0.08);
      border-radius: 8px;
      backdrop-filter: blur(4px);
      pointer-events: auto;
    `;
    instruct.textContent = muted
      ? 'Autoplay is muted so it can start automatically. Click video to unmute.'
      : 'If you hear no sound, click the video area to enable audio (browser may block autoplay with sound).';
    overlay.appendChild(instruct);

    // Clicking the instruction focuses the iframe (helpful)
    instruct.addEventListener('click', () => {
      try { iframe.focus(); } catch (e) {}
    });

    // Append style to lock scroll and ensure overlay top-most
    const style = document.createElement('style');
    style.id = OVERLAY_ID + '-style';
    style.textContent = `
      html, body { overflow: hidden !important; }
      #${OVERLAY_ID} { z-index: 2147483647 !important; }
      /* hide possible focus outlines when clicking */
      #${OVERLAY_ID} iframe:focus { outline: none !important; }
    `;
    document.head.appendChild(style);

    // Add the overlay
    document.body.appendChild(overlay);

    // Expose a helper so user can click-to-unmute programmatically:
    // Note: due to cross-origin iframe, we cannot programmatically unmute the YouTube iframe reliably without API and same-origin.
    // But exposing show/hide is still useful.
  }

  // Public controls
  window.rickroll = {
    show: () => createOverlay(),
    hide: () => removeOverlay(),
    config: { videoId, autoShow, muted, controls, loop, startSeconds }
  };

  // Auto-show
  if (autoShow) {
    if (document.body) {
      setTimeout(() => window.rickroll.show(), 300);
    } else {
      window.addEventListener('load', () => setTimeout(() => window.rickroll.show(), 300));
    }
  }
})();