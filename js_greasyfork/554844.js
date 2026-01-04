// ==UserScript==
// @name         Amazon Safari Video Overlay Fix
// @namespace    https://github.com/zerongyu/amazon-fix
// @version      1.0.0
// @description  Neutralize Amazon’s product video dimming overlay in Safari so playback brightness stays constant when controls appear.
// @author       zerongyu
// @match        https://www.amazon.com/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554844/Amazon%20Safari%20Video%20Overlay%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/554844/Amazon%20Safari%20Video%20Overlay%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'amazon-video-overlay-fix-style';

  const OVERLAY_SELECTORS = [
    '#a-popover-lgtbox',
    '#ivFullscreenVideoBackdrop',
    '.vjs-big-play-button',
    '.vjs-poster',
    '.dim-video-player',
    'div[class*="overlay"]',
    'div[class*="mask"]',
    'div[class*="fade"]',
    'div[class*="shade"]',
    'div[style*="rgba(0, 0, 0"]',
    'div[style*="background-color: rgba(0, 0, 0"]',
    'div[style*="background-color: black"]',
  ];

  const CSS_PATCH = `
    ${OVERLAY_SELECTORS.join(',\n    ')} {
      background: transparent !important;
      opacity: 0 !important;
      transition: none !important;
      pointer-events: none !important;
    }

    .dim-video-player,
    .vjs-tech.dim-video-player {
      opacity: 1 !important;
      transition: none !important;
      filter: brightness(1) !important;
      -webkit-filter: brightness(1) !important;
    }

    .video-js,
    .video-js * {
      filter: none !important;
      -webkit-filter: none !important;
    }

    .video-js video,
    video.vjs-tech {
      filter: brightness(1) !important;
      -webkit-filter: brightness(1) !important;
      opacity: 1 !important;
      transition: none !important;
      mix-blend-mode: normal !important;
      background: black !important;
    }

    .video-js .vjs-control-bar {
      background: transparent !important;
      opacity: 1 !important;
    }

    .video-js .vjs-control-bar::before,
    .video-js .vjs-control-bar::after {
      display: none !important;
    }
  `;

  const VIDEO_SELECTORS = [
    '.video-js video',
    'video.vjs-tech',
    'video[id*="container-element_html5_api"]',
  ];

  const enforceInlineStyles = (element, styles) => {
    if (!element) return;
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value, 'important');
    });
  };

  const neutralizeOverlay = (overlay) => {
    enforceInlineStyles(overlay, {
      background: 'transparent',
      opacity: '0',
      transition: 'none',
      pointerEvents: 'none',
      mixBlendMode: 'normal',
    });
  };

  const neutralizeAllOverlays = () => {
    OVERLAY_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach(neutralizeOverlay);
    });
  };

  const ensureStyleTag = () => {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.id = STYLE_ID;
    styleTag.textContent = CSS_PATCH;
    document.head.appendChild(styleTag);
  };

  const reinforceVideoNodes = () => {
    VIDEO_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((video) => {
        enforceInlineStyles(video, {
          filter: 'brightness(1)',
          '-webkit-filter': 'brightness(1)',
          opacity: '1',
          transition: 'none',
          mixBlendMode: 'normal',
        });
        if (video.classList.contains('dim-video-player')) {
          video.classList.remove('dim-video-player');
        }
        const parent = video.closest('.video-js');
        enforceInlineStyles(parent, {
          background: 'black',
          filter: 'none',
          '-webkit-filter': 'none',
        });
        const dimParent = video.closest('.dim-video-player');
        enforceInlineStyles(dimParent, {
          opacity: '1',
          transition: 'none',
        });
      });
    });
  };

  const observeMutations = () => {
    const overlayWatcher = new MutationObserver(() => {
      neutralizeAllOverlays();
      reinforceVideoNodes();
    });

    overlayWatcher.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  };

  const init = () => {
    ensureStyleTag();
    neutralizeAllOverlays();
    reinforceVideoNodes();
    observeMutations();
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
