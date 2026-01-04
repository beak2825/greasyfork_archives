// ==UserScript==
// @name         YouTube No Saturated Hover
// @namespace    https://greasyfork.org/users/1476331-jon78
// @version      1.2.2
// @description  Removes YouTube's 2025 saturated hover effects.
// @author       jon78
// @license      CC0
// @match        *://*.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554047/YouTube%20No%20Saturated%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/554047/YouTube%20No%20Saturated%20Hover.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const ID = "no-saturated-hover";
  let styleEl = null;
  let dark = undefined;

  /* --------------------------
     Detect YouTube Dark/Light mode
  -------------------------- */
  const detectDark = () => {
    const html = document.documentElement;
    if (html.hasAttribute("dark") || html.classList.contains("dark-theme")) return true;
    if (html.hasAttribute("light") || html.classList.contains("light-theme")) return false;

    try {
      const cs = getComputedStyle(html);
      const bg = (cs && cs.getPropertyValue("--yt-spec-base-background") || "").trim();
      if (bg.startsWith("rgb")) {
        const nums = bg.match(/\d+/g);
        if (nums && nums.length >= 3) {
          const r = Number(nums[0]), g = Number(nums[1]), b = Number(nums[2]);
          return ((r + g + b) / 3) < 60;
        }
      }
    } catch (e) {}
    return false;
  };

  /* --------------------------
     Build CSS based on theme
  -------------------------- */
  const buildCss = d => {
    return (`
html {
  --ytc-base-background:${d ? "#0f0f0f" : "#fff"};
  --ytc-additive-background:${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};
  --ytc-text-primary:${d ? "#f1f1f1" : "#0f0f0f"};
  --ytc-text-secondary:${d ? "#aaa" : "#606060"};

  --yt-spec-base-background:var(--yt-spec-base-background,var(--ytc-base-background));
  --yt-spec-additive-background:var(--yt-spec-additive-background,var(--ytc-additive-background));
  --yt-spec-text-primary:var(--yt-spec-text-primary,var(--ytc-text-primary));
  --yt-spec-text-secondary:var(--yt-spec-text-secondary,var(--ytc-text-secondary));

  --yt-active-playlist-panel-background-color: var(--yt-spec-additive-background);
  --yt-lightsource-primary-title-color: var(--ytc-text-primary);
  --yt-lightsource-secondary-title-color: var(--ytc-text-secondary);
  --iron-icon-fill-color: var(--yt-lightsource-primary-title-color);
}

/* Disable saturated hover feedback UI */
.yt-spec-touch-feedback-shape__hover-effect,
.yt-spec-touch-feedback-shape__stroke,
.yt-spec-touch-feedback-shape__fill {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Remove highlight from promoted videos */
ytd-rich-item-renderer.ytd-rich-item-renderer-highlight {
  background: transparent !important;
  box-shadow: none !important;
  --yt-spec-outline: transparent !important;
}

/* Primary title colors */
ytd-rich-grid-renderer #video-title,
.yt-lockup-metadata-view-model__title,
.yt-lockup-metadata-view-model__title a {
  color: var(--yt-spec-text-primary, var(--ytc-text-primary)) !important;
}

/* Metadata text colors */
.yt-lockup-metadata-view-model__metadata,
.yt-lockup-metadata-view-model__metadata span,
#metadata-line span {
  color: var(--yt-spec-text-secondary, var(--ytc-text-secondary)) !important;
}

/* Description */
.yt-core-attributed-string--link-inherit-color:not(:has(a)) {
    color: var(--yt-spec-text-primary, var(--ytc-text-primary)) !important;
}

/* Collapsed description */
ytd-watch-metadata #description,
ytd-video-secondary-info-renderer #description,
ytd-watch-info-text,
#metadata.ytd-watch-info-text,
#metadata-line.ytd-video-primary-info-renderer span,
#snippet-text,
#snippet-text *,
#attributed-snippet-text,
#attributed-snippet-text * {
  color: var(--yt-spec-text-primary, var(--ytc-text-primary)) !important;
}

#snippet-text:hover,
#snippet-text *:hover,
#attributed-snippet-text:hover,
#attributed-snippet-text *:hover,
ytd-watch-info-text *:hover {
  color: var(--yt-spec-text-primary, var(--ytc-text-primary)) !important;
  filter: none !important;
  opacity: 1 !important;
}

/* Highlighted links */
.yt-core-attributed-string--highlight-text-decorator > a.yt-core-attributed-string__link--call-to-action-color,
.yt-core-attributed-string--link-inherit-color .yt-core-attributed-string--highlight-text-decorator > a.yt-core-attributed-string__link--call-to-action-color {
  color: var(--yt-spec-text-primary, var(--ytc-text-primary)) !important;
}

/* CTA links */
ytd-watch-metadata :not(.yt-core-attributed-string--highlight-text-decorator) > .yt-core-attributed-string__link--call-to-action-color,
#snippet-text :not(.yt-core-attributed-string--highlight-text-decorator) > .yt-core-attributed-string__link--call-to-action-color,
#attributed-snippet-text :not(.yt-core-attributed-string--highlight-text-decorator) > .yt-core-attributed-string__link--call-to-action-color {
  color: var(--yt-spec-call-to-action, #3ea6ff) !important;
}

/* Saturation overrides on watch page */
ytd-watch-metadata, .ytd-watch-metadata {
  --yt-saturated-base-background: var(--ytc-base-background);
  --yt-saturated-raised-background: var(--yt-spec-additive-background,var(--ytc-additive-background));
  --yt-saturated-additive-background: var(--yt-spec-additive-background,var(--ytc-additive-background));
  --yt-saturated-text-primary: var(--yt-spec-text-primary,var(--ytc-text-primary));
  --yt-saturated-text-secondary: var(--yt-spec-text-secondary,var(--ytc-text-secondary));
  --yt-saturated-overlay-background: var(--yt-spec-additive-background,var(--ytc-additive-background));
  --yt-spec-overlay-background: var(--yt-spec-additive-background,var(--ytc-additive-background));
  --yt-spec-static-overlay-background-light: var(--yt-spec-additive-background,var(--ytc-additive-background));

  --yt-active-playlist-panel-background-color: var(--yt-spec-additive-background);
  --yt-lightsource-primary-title-color: var(--ytc-text-primary);
  --yt-lightsource-secondary-title-color: var(--ytc-text-secondary);
  --iron-icon-fill-color: var(--yt-lightsource-primary-title-color);
}

/* Highlight background cleanup */
.yt-core-attributed-string--highlight-text-decorator {
  background-color: var(--yt-spec-static-overlay-background-light, ${d ? "rgba(255,255,255,0.102)" : "rgba(0,0,0,0.051)"}) !important;
  border-radius: 8px !important;
  padding-bottom: 1px !important;
}
`).trim();
  };

  const CSS_CACHE = { dark: buildCss(true), light: buildCss(false) };

  /* --------------------------
     Apply or update CSS
  -------------------------- */
  const applyStyle = isDark => {
    if (!styleEl) {
      styleEl = document.getElementById(ID);
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = ID;
        (document.head || document.documentElement).appendChild(styleEl);
      }
    }
    const newCss = isDark ? CSS_CACHE.dark : CSS_CACHE.light;
    if (styleEl.textContent !== newCss) {
      styleEl.textContent = newCss;
    }
  };

  /* --------------------------
     Playlist panel updater
  -------------------------- */
  const updatePlaylistPanel = () => {
    const panels = document.querySelectorAll("ytd-playlist-panel-renderer");
    panels.forEach(panel => {
      try {
        panel.style.setProperty("--yt-active-playlist-panel-background-color", "var(--yt-spec-additive-background)");
        panel.style.setProperty("--yt-lightsource-primary-title-color", "var(--ytc-text-primary)");
        panel.style.setProperty("--yt-lightsource-secondary-title-color", "var(--ytc-text-secondary)");
        panel.style.setProperty("--iron-icon-fill-color", "var(--yt-lightsource-primary-title-color)");
      } catch (e) {}
    });
  };

  /* --------------------------
     Retry-based playlist finder
  -------------------------- */
  const MAX_RAF_ATTEMPTS = 60; // ~1s at 60Hz; tweak if needed
  let rafAttempts = 0;
  let playlistRafId = null;

  const updatePlaylistPanelOnce = () => {
    const panels = document.querySelectorAll("ytd-playlist-panel-renderer");
    if (panels.length) {
      updatePlaylistPanel();
      rafAttempts = 0;
      return true;
    }
    return false;
  };

  const schedulePlaylistPanelRetry = () => {
    // stop if we've exhausted attempts
    if (rafAttempts >= MAX_RAF_ATTEMPTS) {
      playlistRafId = null;
      return;
    }
    rafAttempts++;
    playlistRafId = requestAnimationFrame(() => {
      playlistRafId = null;
      if (!updatePlaylistPanelOnce()) {
        schedulePlaylistPanelRetry();
      }
    });
  };

  /* --------------------------
     Debounced refresh()
  -------------------------- */
  let refreshRAF = null;

  const refresh = () => {
    if (refreshRAF) cancelAnimationFrame(refreshRAF);
    refreshRAF = requestAnimationFrame(() => {
      refreshRAF = null;
      const isDark = detectDark();
      if (isDark !== dark) {
        dark = isDark;
        applyStyle(dark);
      }
      // retry a few frames for playlist panel if it appears soon
      schedulePlaylistPanelRetry();
    });
  };

  /* --------------------------
     Initialization
  -------------------------- */
  const init = () => {
    // schedule initial CSS + playlist attempt next frame
    requestAnimationFrame(() => {
      dark = detectDark();
      applyStyle(dark);
      schedulePlaylistPanelRetry();
    });

    addEventListener("yt-navigate-finish", refresh, { passive: true });
    addEventListener("yt-dark-mode-toggled", refresh, { passive: true });

    // cleanup on pagehide to avoid leaking RAFs across SPA navigation
    addEventListener("pagehide", () => {
      if (playlistRafId) {
        try { cancelAnimationFrame(playlistRafId); } catch (e) {}
        playlistRafId = null;
      }
      if (refreshRAF) {
        try { cancelAnimationFrame(refreshRAF); } catch (e) {}
        refreshRAF = null;
      }
    }, { once: true });
  };

  if (document.documentElement && (document.head || document.readyState === "complete")) {
    init();
  } else {
    addEventListener("DOMContentLoaded", init, { once: true });
  }
})();
