// ==UserScript==
// @name         youtube.com -  Declutter Youtube
// @namespace    local.yt.tweaks
// @version      1.0.1
// @description  Removes all reccomended & homepage functionality, only search, subscriptions, comments and channels are now availible. Shorts are also disabled.
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562590/youtubecom%20-%20%20Declutter%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/562590/youtubecom%20-%20%20Declutter%20Youtube.meta.js
// ==/UserScript==

// ---- Redirect Shorts -> Watch using the SAME video id (SPA-safe) ----
(function shortsToWatchRedirect() {
  function getShortsIdFromPath(pathname) {
    const m = pathname.match(/^\/shorts\/([^\/?#]+)/i);
    return m ? m[1] : null;
  }

  function redirectIfShorts() {
    const id = getShortsIdFromPath(location.pathname);
    if (!id) return;

    const target = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;

    // avoid loops / redundant replaces
    if (location.href.startsWith(target)) return;

    location.replace(target);
  }

  // Direct loads
  redirectIfShorts();

  // YouTube internal SPA events (best signal)
  window.addEventListener("yt-navigate-start", redirectIfShorts, true);
  window.addEventListener("yt-navigate-finish", redirectIfShorts, true);

  // History API patch (covers SPA route changes)
  const push = history.pushState;
  const replace = history.replaceState;

  history.pushState = function () {
    const r = push.apply(this, arguments);
    queueMicrotask(redirectIfShorts);
    return r;
  };

  history.replaceState = function () {
    const r = replace.apply(this, arguments);
    queueMicrotask(redirectIfShorts);
    return r;
  };

  window.addEventListener("popstate", redirectIfShorts);

  // Safety net: URL changes without events
  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      redirectIfShorts();
    }
  }, 250);
})();

(function () {
  "use strict";

  // ---------- Helpers ----------
  function addStyle(id, cssText) {
    if (!cssText || !cssText.trim()) return;
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const style = document.createElement("style");
    style.id = id;
    style.type = "text/css";
    style.appendChild(document.createTextNode(cssText));
    document.documentElement.appendChild(style);
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  // ---------- CSS ----------
  const CSS_COMMON_DESKTOP = `
/* Common */

#frosted-glass {
  display: none !important;
}

::-webkit-scrollbar {
  width: 15px !important;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.594) !important;
}

#country-code {
  display: none;
}

/* Youtube Home */

#endpoint[title='Shorts'] { display: none !important; }
#endpoint[title='Trending'] { display: none !important; }
#endpoint[title='Music'] { display: none !important; }
#endpoint[title='Gaming'] { display: none !important; }
#endpoint[title='Sports'] { display: none !important; }

#items ytd-mini-guide-entry-renderer.ytd-mini-guide-renderer:nth-child(2) {
  display: none !important;
}

ytd-two-column-browse-results-renderer[page-subtype='home']
  div:nth-child(1)
  ytd-rich-grid-renderer:nth-child(1) {
  display: none !important;
}

/* Youtube Watch */

#related { display: none !important; }

#secondary.ytd-watch-flexy {
  width: min-content !important;
  min-width: 0 !important;
}

.videowall-endscreen { display: none !important; }

/* Youtube Home Revert */

ytd-topbar-logo-renderer#logo {
  position: unset !important;
  left: unset !important;
  top: unset !important;
  transform: unset !important;
}

#logo-icon {
  height: 20px !important;
  width: 97px !important;
}

#center.ytd-masthead {
  position: unset !important;
  top: unset !important;
  left: unset !important;
  min-width: unset !important;
  transform: unset !important;
}

.gstl_50.sbdd_a {
  left: 50% !important;
  top: 6% !important;
  translate: -62% 0 !important;
}

a.ytd-mini-guide-entry-renderer { width: 64px !important; }

ytd-mini-guide-entry-renderer[aria-label='Home'] {
  display: flex !important;
}

ytd-mini-guide-entry-renderer[aria-label='Subscriptions'],
ytd-mini-guide-entry-renderer[aria-label='YouTube Music'],
ytd-mini-guide-entry-renderer[aria-label='You'],
ytd-mini-guide-entry-renderer[aria-label='Downloads'] {
  position: unset !important;
  left: unset !important;
  top: unset !important;
  transform: unset !important;
}

ytd-mini-guide-renderer.ytd-app {
  display: unset !important;
  z-index: unset !important;
}
  `.trim();

  const CSS_HOME_DESKTOP = `
ytd-topbar-logo-renderer#logo {
  position: fixed !important;
  left: 50% !important;
  top: 37vh !important;
  transform: translate(-11vh, -50%) !important;
}

#logo-icon {
  height: 10vh !important;
  width: 20vh !important;
}

#center.ytd-masthead {
  position: fixed !important;
  top: 47vh !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  min-width: 588px !important;
  max-width: 700px !important;
}

.gstl_50.sbdd_a {
  left: 50% !important;
  top: 50% !important;
  translate: -58.5% -2px !important;
}

ytd-mini-guide-entry-renderer[aria-label='Home'] { display: none !important; }
ytd-mini-guide-entry-renderer[aria-label='History'] { display: none !important; }

ytd-mini-guide-entry-renderer[aria-label='YouTube Music'] {
  position: fixed !important;
  top: 57vh !important;
  left: 40% !important;
  transform: translate(-50%, -50%) !important;
}

ytd-mini-guide-entry-renderer[aria-label='Subscriptions'] {
  position: fixed !important;
  top: 57vh !important;
  left: 46.66% !important;
  transform: translate(-50%, -50%) !important;
}

ytd-mini-guide-entry-renderer[aria-label='You'] {
  position: fixed !important;
  top: 57vh !important;
  left: 53.32% !important;
  transform: translate(-50%, -50%) !important;
}

ytd-mini-guide-entry-renderer[aria-label='Downloads'] {
  position: fixed !important;
  top: 57vh !important;
  left: 60% !important;
  transform: translate(-50%, -50%) !important;
}

a.ytd-mini-guide-entry-renderer { width: 80px !important; }

ytd-mini-guide-renderer.ytd-app {
  display: block !important;
  z-index: 1 !important;
}
  `.trim();

  const CSS_WATCH_DESKTOP = `
ytd-mini-guide-renderer.ytd-app {
  display: none !important;
}
  `.trim();

  const CSS_MOBILE = `
#filter-chip-bar { display: none !important; }

ytm-pivot-bar-renderer ytm-pivot-bar-item-renderer:nth-child(2) {
  display: none !important;
}

.tab-content[tab-title='Home'] {
  display: none !important;
}

ytm-item-section-renderer[data-content-type='related'] {
  display: none !important;
}
  `.trim();

  // ---------- JS (from your files, lightly wrapped) ----------
  function runDesktopGenericScript() {
    let eFlag = false;

    let observer3 = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          if (!eFlag) {
            const sections = document.getElementById("sections");
            if (sections) {
              const trending = document.querySelector('#endpoint[title="Trending"]');
              if (trending) {
                const explore = trending.parentElement.parentElement.parentElement;
                explore.style.display = "none";
                eFlag = true;
              }
            }
          }
          if (eFlag && observer3) {
            observer3.disconnect();
            observer3 = null;
            break;
          }
        }
      }
    });

    observer3.observe(document, { childList: true, subtree: true });
  }

  function runDesktopHomeScript() {
    let eFlag = false;

    let observer1 = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          if (!eFlag) {
            const searchInput = document.querySelector("#search");
            if (searchInput) searchInput.focus();

            const sections = document.getElementById("sections");
            if (sections) {
              const menuButton = document.getElementById("guide-button");
              if (menuButton && menuButton.getAttribute("data-pressed") == null) {
                menuButton.click();
                menuButton.setAttribute("data-pressed", "true");
              }

              const trending = document.querySelector('#endpoint[title="Trending"]');
              if (trending) {
                const explore = trending.parentElement.parentElement.parentElement;
                explore.style.display = "none";
                eFlag = true;
              }
            }
          }

          if (eFlag && observer1) {
            observer1.disconnect();
            observer1 = null;
            break;
          }
        }
      }
    });

    observer1.observe(document, { childList: true, subtree: true });
  }

  function runDesktopWatchScript() {
    let vFlag = false;
    let eFlag = false;

    let observer2 = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          if (!vFlag) {
            const moviePlayer = document.getElementById("movie_player");
            if (moviePlayer) {
              const videoContainer = moviePlayer.children[0];
              if (videoContainer && videoContainer.children[0]) vFlag = true;
            }
          }

          if (!eFlag) {
            const sections = document.getElementById("sections");
            if (sections) {
              const trending = document.querySelector('#endpoint[title="Trending"]');
              if (trending) {
                const explore = trending.parentElement.parentElement.parentElement;
                explore.style.display = "none";
                eFlag = true;
              }
            }
          }

          if (vFlag && eFlag && observer2) {
            observer2.disconnect();
            observer2 = null;
            break;
          }
        }
      }
    });

    observer2.observe(document, { childList: true, subtree: true });
  }

  // ---------- Routing ----------
  function applyForCurrentPage() {
    const host = location.hostname;
    const path = location.pathname;

    const isMobile = host === "m.youtube.com";
    const isWatch = path === "/watch";
    const isHome = path === "/";

    if (isMobile) {
      addStyle("yt-tweaks-mobile", CSS_MOBILE);
      return;
    }

    addStyle("yt-tweaks-common", CSS_COMMON_DESKTOP);

    if (isHome) {
      addStyle("yt-tweaks-home", CSS_HOME_DESKTOP);
      runDesktopHomeScript();
      return;
    }

    if (isWatch) {
      addStyle("yt-tweaks-watch", CSS_WATCH_DESKTOP);
      runDesktopWatchScript();
      return;
    }

    runDesktopGenericScript();
  }

  // Re-apply on SPA navigation changes
  let lastUrl = location.href;

  function watchUrlChanges() {
    const newUrl = location.href;
    if (newUrl !== lastUrl) {
      lastUrl = newUrl;
      applyForCurrentPage();
    }
  }

  applyForCurrentPage();

  const spaObserver = new MutationObserver(watchUrlChanges);
  spaObserver.observe(document.documentElement, { childList: true, subtree: true });

  onReady(applyForCurrentPage);
})();
