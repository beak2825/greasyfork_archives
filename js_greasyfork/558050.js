// ==UserScript==
// @name         Nextcloud Mail — Darkmode in mail.
// @namespace    https://greasyfork.org
// @author       r-hiland
// @version      1.2
// @description  Forces dark background/text inside the message HTML iframe on Nextcloud Mail
// @match        https://nextcloud.example.com/apps/mail/* // YOU NEED TO MODIFY THIS TO YOUR DOMAIN.
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558050/Nextcloud%20Mail%20%E2%80%94%20Darkmode%20in%20mail.user.js
// @updateURL https://update.greasyfork.org/scripts/558050/Nextcloud%20Mail%20%E2%80%94%20Darkmode%20in%20mail.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BG = "#171717";
  const FG = "#ebebeb";
  const FG_SOFT = "#d8d8d8";
  const BORDER = "#2a2a2a";
  const MUTED = "#b3b3b3";
  const LINK = "#8ab4f8";

  const STYLE_ID = "tm-nextcloud-mail-dark-style";

  const css = `
    :root, html, body {
      color-scheme: dark !important;
      background: ${BG} !important;
      color: ${FG} !important;
    }

    body, p, div, section, article, main, footer, header, aside,
    span, strong, em, small, blockquote, figure,
    ul, ol, li, dl, dt, dd {
      background: transparent !important;
      color: ${FG} !important;
    }

    table, thead, tbody, tfoot, tr, th, td {
      background: transparent !important;
      color: ${FG} !important;
      border-color: ${BORDER} !important;
    }
    table[bgcolor], td[bgcolor], tr[bgcolor] { background-color: ${BG} !important; }

    hr { border: 0 !important; border-top: 1px solid ${BORDER} !important; }

    a, a * { color: ${LINK} !important; }
    a:visited { opacity: 0.95 !important; }

    small, .muted, .subtle, [style*="color:#999"], [style*="color: #999"] {
      color: ${MUTED} !important;
    }

    input, textarea, select, button {
      background: #1f1f1f !important;
      color: ${FG} !important;
      border: 1px solid ${BORDER} !important;
    }

    /* Kill hard-coded white backgrounds */
    [style*="background:#fff"], [style*="background: #fff"],
    [style*="background:#ffffff"], [style*="background: #ffffff"],
    [bgcolor="white"], [bgcolor="#ffffff"], [bgcolor="#fff"] {
      background: ${BG} !important;
    }

    /* Kill hard-coded dark text */
    [style*="color:#000"], [style*="color: #000"],
    [style*="color:#111"], [style*="color: #111"],
    [style*="color:#222"], [style*="color: #222"] {
      color: ${FG} !important;
    }

    img, svg, video, canvas { filter: none !important; }

    pre, code, kbd, samp {
      background: #1f1f1f !important;
      color: ${FG_SOFT} !important;
    }
  `;

  function injectIntoFrame(doc) {
    try {
      if (!doc || doc.getElementById(STYLE_ID)) return;

      // Early paint guard
      doc.documentElement.style.background = BG;
      doc.documentElement.style.color = FG;

      const s = doc.createElement("style");
      s.id = STYLE_ID;
      s.textContent = css;
      (doc.head || doc.documentElement).appendChild(s);
    } catch (_) {
      /* ignore cross-origin or timing issues */
    }
  }

  function tryWireFrame(iframe) {
    if (!iframe || iframe.__tmDarkWired) return;
    iframe.__tmDarkWired = true;

    // Inject when it loads (or if already loaded)
    const onload = () => injectIntoFrame(iframe.contentDocument);
    iframe.addEventListener("load", onload, { once: false });

    // If it's already there and same-origin:
    if (iframe.contentDocument && iframe.contentDocument.readyState !== "loading") {
      injectIntoFrame(iframe.contentDocument);
    }
  }

  // Initial scan
  function scan() {
    document.querySelectorAll("iframe.message-frame").forEach(tryWireFrame);
  }
  scan();

  // Observe just the message container for newly inserted/replicated iframes
  const container = document.querySelector("#message-container") || document.body;
  const obs = new MutationObserver((muts) => {
    let needsScan = false;
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) {
        for (const n of m.addedNodes) {
          if (n.nodeType === 1 && (n.matches?.("iframe.message-frame") || n.querySelector?.("iframe.message-frame"))) {
            needsScan = true;
            break;
          }
        }
      }
      if (needsScan) break;
    }
    if (needsScan) {
      // throttle to next frame to avoid storms
      requestAnimationFrame(scan);
    }
  });
  obs.observe(container, { childList: true, subtree: true });
})();
