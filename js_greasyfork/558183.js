// ==UserScript==
// @name         Global YouTube Embed Referrer Workaround
// @namespace    youtube
// @version      1.0.0
// @description  Rewrite YouTube embeds on third-party sites to use an alternative front-end (invidious) so Google never sees the embed requests.
// @author       steven
// @date         2025-11-28
// @icon         https://www.youtube.com/s/desktop/31c2c151/img/favicon.ico
// @license      GNU GPLv3 
// @match        *://*/*
// @exclude      *://*youtube.com*
// @exclude      *://*youtu.be*
// @exclude      *://*youtube-nocookie.com*
// @exclude      *://*google.com*
// @exclude      *://*invidious.nerdvpn.de*
// @exclude      *://*inv.nadeko.net*
// @exclude      *://*piped.video*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558183/Global%20YouTube%20Embed%20Referrer%20Workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/558183/Global%20YouTube%20Embed%20Referrer%20Workaround.meta.js
// ==/UserScript==


(() => {
  // Change this to whatever proxy/front-end you want to use.
  const proxies = {
    nerdvpn: 'invidious.nerdvpn.de',
    nadeko: 'inv.nadeko.net',
    piped: 'piped.video'
  }

  const PROXY_BASE = `https://${proxies.nerdvpn}/embed/`;

  const isYouTubeEmbedSrc = (src) => {
    if (src == null || src === '') {
      return false;
    }

    try {
      const url = new URL(src, window.location.href);
      const host = url.hostname.toLowerCase();
      const path = url.pathname;

      // Handle typical YouTube embed hosts
      if (
        host.endsWith('youtube.com') ||
        host.endsWith('youtube-nocookie.com')
      ) {
        // Standard embed paths: /embed/VIDEO_ID
        if (path.startsWith('/embed/')) {
          return true;
        }
      }

      // Handle rare youtu.be embed-like forms (just in case)
      if (host === 'youtu.be' && path.split('/').filter((p) => p.length > 0).length === 1) {
        return true;
      }

      return false;
    } catch (_err) {
      return false;
    }
  };

  const extractVideoId = (src) => {
    try {
      const url = new URL(src, window.location.href);
      const host = url.hostname.toLowerCase();
      const path = url.pathname;

      if (
        host.endsWith('youtube.com') ||
        host.endsWith('youtube-nocookie.com')
      ) {
        // /embed/VIDEO_ID or /embed/VIDEO_ID/...
        const segments = path.split('/').filter((s) => s.length > 0);
        // Expect ["embed", "VIDEO_ID", ...]
        if (segments.length >= 2 && segments[0] === 'embed') {
          const id = segments[1];
          if (id != null && id !== '') {
            return id;
          }
        }
      }

      if (host === 'youtu.be') {
        // /VIDEO_ID
        const segments = path.split('/').filter((s) => s.length > 0);
        if (segments.length >= 1) {
          const id = segments[0];
          if (id != null && id !== '') {
            return id;
          }
        }
      }

      return null;
    } catch (_err) {
      return null;
    }
  };

  const rewriteIframeToProxy = (iframe) => {
    if (iframe == null) {
      return;
    }

    // Avoid re-processing
    if (iframe.dataset.ytToProxyDone === '1') {
      return;
    }

    const src = iframe.getAttribute('src');
    if (!isYouTubeEmbedSrc(src)) {
      return;
    }

    const videoId = extractVideoId(src);
    if (videoId == null) {
      return;
    }

    // Build proxy embed URL; we ignore YouTube-specific query params on purpose.
    const newSrc = PROXY_BASE + encodeURIComponent(videoId);

    iframe.src = newSrc;
    iframe.dataset.ytToProxyDone = '1';

    // Optional: avoid leaking your page URL to the proxy as referrer.
    iframe.setAttribute('referrerpolicy', 'no-referrer');
  };

  const rewriteAllEmbeds = () => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      rewriteIframeToProxy(iframe);
    });
  };

  const setupMutationObserver = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'childList' &&
          mutation.addedNodes != null &&
          mutation.addedNodes.length > 0
        ) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) {
              return;
            }

            if (node.tagName === 'IFRAME') {
              rewriteIframeToProxy(node);
            }

            const nestedIframes = node.querySelectorAll
              ? node.querySelectorAll('iframe')
              : [];
            nestedIframes.forEach((iframe) => {
              rewriteIframeToProxy(iframe);
            });
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  const init = () => {
    rewriteAllEmbeds();
    setupMutationObserver();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
