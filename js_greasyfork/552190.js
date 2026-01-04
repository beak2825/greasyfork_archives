// ==UserScript==
// @name         YT CPU Enhancer
// @version      1.1
// @description  Remove no. of notifications, CSS tweaks
// @author       TZ Shuhag
// @license      MIT
// @match        *://www.youtube-nocookie.com/*
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @namespace    https://greasyfork.org/en/users/1495563
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552190/YT%20CPU%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/552190/YT%20CPU%20Enhancer.meta.js
// ==/UserScript==

// Disable Animations, Ambient Mode and other UI tweaks

"use strict";

// --- Flags to assign to yt.config_.EXPERIMENT_FLAGS ---
const flagsToAssign = {
  // Disable animated features (except for sub/like buttons)
  web_animated_actions: false,
  web_animated_like: false,
  web_animated_like_lazy_load: false,
  smartimation_background: false,
  // Disable ambient lighting / cinematic effects
  kevlar_measure_ambient_mode_idle: false,
  kevlar_watch_cinematics_invisible: false,
  web_cinematic_theater_mode: false,
  web_cinematic_fullscreen: false,
  enable_cinematic_blur_desktop_loading: false,
  kevlar_watch_cinematics: false,
  web_cinematic_masthead: false,
  web_watch_cinematics_preferred_reduced_motion_default_disabled: false,
  // More tweaks
  kevlar_refresh_on_theme_change: false
};

// Safe helper to get EXPERIMENT_FLAGS (works even if optional chaining unsupported)
function getExpFlags() {
  try {
    // prefer optional chaining if available
    // eslint-disable-next-line no-undef
    return (window.yt && window.yt.config_ && window.yt.config_.EXPERIMENT_FLAGS) || (window.yt && window.yt.config_ && window.yt.config_.EXPERIMENT_FLAGS);
  } catch (e) {
    return undefined;
  }
}

const updateFlags = () => {
  const expFlags = getExpFlags();
  if (!expFlags) return;
  try {
    Object.assign(expFlags, flagsToAssign);
  } catch (e) {
    // If assignment fails, ignore - we tried our best.
  }
};

// Apply flags immediately and whenever DOM mutates
updateFlags();
const mutationObserver = new MutationObserver(updateFlags);
mutationObserver.observe(document, { subtree: true, childList: true });

// --- Hide notification count in the page title (safely) ---
(function overrideDocumentTitle() {
  // Find a prototype that actually has a 'title' property descriptor
  const protoCandidates = [Document.prototype, (typeof HTMLDocument !== "undefined" ? HTMLDocument.prototype : null), Object.getPrototypeOf(document)];
  let originalTitleDescriptor = null;
  for (const p of protoCandidates) {
    if (!p) continue;
    originalTitleDescriptor = Object.getOwnPropertyDescriptor(p, 'title');
    if (originalTitleDescriptor) break;
  }

  // Fallback: if still not found, try to use the title element observer technique below
  if (!originalTitleDescriptor) {
    // Fallback approach: observe <title> element and strip leading "(N) "
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const safeObserver = new MutationObserver(() => {
        if (!titleEl.textContent) return;
        titleEl.textContent = String(titleEl.textContent).replace(/^\(\d+\)\s?/, '');
      });
      safeObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
    return;
  }

  // Only override if descriptor has at least one accessor or is configurable
  try {
    Object.defineProperty(document, 'title', {
      get: function() {
        if (originalTitleDescriptor.get) {
          return originalTitleDescriptor.get.call(this);
        }
        // fallback to reading <title>
        return (document.querySelector('title') || {}).textContent || '';
      },
      set: function(newValue) {
        const str = String(newValue);
        const interceptedValue = str.replace(/^\(\d+\)\s?/, "");
        if (originalTitleDescriptor.set) {
          originalTitleDescriptor.set.call(this, interceptedValue);
        } else {
          const titleEl = document.querySelector('title');
          if (titleEl) titleEl.textContent = interceptedValue;
        }
      },
      configurable: true,
      enumerable: true
    });
  } catch (err) {
    // If defining property failed (non-configurable), fallback to observing <title>
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const safeObserver = new MutationObserver(() => {
        if (!titleEl.textContent) return;
        titleEl.textContent = String(titleEl.textContent).replace(/^\(\d+\)\s?/, '');
      });
      safeObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
  }
})();

// Small CSS injection to hide the notification badge (redundant with title but helps visuals)
(function() {
  const css1 = '.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge{display:none !important;}';
  if (typeof GM_addStyle !== "undefined") {
    try { GM_addStyle(css1); return; } catch (e) {}
  }
  const s = document.createElement('style');
  s.appendChild(document.createTextNode(css1));
  (document.head || document.documentElement).appendChild(s);
})();

// Big CSS block for many UI tweaks
(function() {
  let css = `
/* Topbar tweaks */
ytm-mobile-topbar-renderer.frosted-glass,
ytm-pivot-bar-renderer.frosted-glass,
ytm-feed-filter-chip-bar-renderer.frosted-glass,
#background.ytd-masthead, #frosted-glass.ytd-app,
#left-arrow-button.ytd-feed-filter-chip-bar-renderer,
#right-arrow-button.ytd-feed-filter-chip-bar-renderer {
  background: var(--yt-spec-base-background) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important
}

#left-arrow.ytd-feed-filter-chip-bar-renderer:after {
  background: linear-gradient(to right, var(--yt-spec-base-background) 20%, rgba(255, 255, 255, 0) 80%) !important
}

#right-arrow.ytd-feed-filter-chip-bar-renderer:before {
  background: linear-gradient(to left, var(--yt-spec-base-background) 20%, rgba(255, 255, 255, 0) 80%) !important
}

ytd-button-renderer.ytd-feed-filter-chip-bar-renderer {
  background: transparent !important
}

div#end.style-scope.ytd-masthead .yt-spec-icon-badge-shape--style-overlay.yt-spec-icon-badge-shape--type-cart-refresh .yt-spec-icon-badge-shape__badge {
  color: #fff !important
}

.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge {
  display: none !important
}

/* Player tweaks */
#cinematics.ytd-watch-flexy {
  display: none !important
}

.ytp-gradient-top, .ytp-gradient-bottom {
  height: 61px !important;
  padding: 0
}

.ytp-small-mode .ytp-gradient-top, .ytp-small-mode .ytp-gradient-bottom {
  height: 50px !important
}

.ytp-big-mode .ytp-gradient-top, .ytp-big-mode .ytp-gradient-bottom {
  height: 0 !important
}

.ytp-gradient-top {
  background: linear-gradient(to bottom, #0009, #0000) !important
}

.ytp-gradient-bottom {
  background: linear-gradient(to top, #0009, #0000) !important
}

/* Remove minimal annoyances and other tweaks */
ytd-ad-slot-renderer,
ytm-ad-slot-renderer,
ad-slot-renderer,
ytd-promoted-video-renderer,
ytm-promoted-video-renderer,
ytd-promoted-sparkles-web-renderer,
ytm-promoted-sparkles-web-renderer,
ytd-text-image-no-button-layout-renderer,
ytm-text-image-no-button-layout-renderer,
ytd-merch-shelf-renderer,
ytd-compact-movie-renderer,
ytd-mealbear-promo-renderer,
ytd-video-quality-promo-renderer,
tp-yt-iron-overlay-backdrop.opened {
  display: none !important
}

.ytd-ghost-grid-renderer,
.info-skeleton,
.meta-skeleton,
#ghost-cards,
#ghost-comment-section,
#related-skeleton {
  display: none !important
}

ytd-watch-metadata.ytd-watch-flexy {
  padding-bottom: 36px !important
}`;
  if (typeof GM_addStyle !== "undefined") {
    try { GM_addStyle(css); return; } catch (e) {}
  }
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
})();
