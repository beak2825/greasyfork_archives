// ==UserScript==
// @name         VS Marketplace: Download VSIX
// @namespace    https://github.com/brandonhenness/vs-marketplace-vsix-download-button
// @version      1.8.3
// @description  Adds a "Download VSIX" button next to Install, copying its style exactly.
// @match        *://marketplace.visualstudio.com/*
// @match        https://marketplace.visualstudio.com/items*
// @run-at       document-idle
// @grant        none
// @license      GPL-3.0-only; https://www.gnu.org/licenses/gpl-3.0.txt
// @author       Brandon Henness
// @downloadURL https://update.greasyfork.org/scripts/548857/VS%20Marketplace%3A%20Download%20VSIX.user.js
// @updateURL https://update.greasyfork.org/scripts/548857/VS%20Marketplace%3A%20Download%20VSIX.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BTN_ID = "bh-vsix-dl";

  const getItem = () => {
    try {
      const u = new URL(location.href);
      const q = u.searchParams.get("itemName");
      if (q && q.includes(".")) return q;
      const m = u.pathname.match(/items\/([^/?#]+)/i);
      if (m && m[1] && m[1].includes(".")) return m[1];
    } catch {}
    return null;
  };

  function findInstallButton() {
    return document.querySelector(".ux-oneclick-install-button-container .install");
  }

  function createDownloadButton() {
    const installBtn = findInstallButton();
    if (!installBtn) return null;

    // Clone Install button for identical style
    const clone = installBtn.cloneNode(true);
    clone.id = BTN_ID;

    // Add spacing so the buttons are not touching
    clone.style.marginLeft = "8px";

    // Change label
    const labelDiv = clone.querySelector(".ms-Button-label");
    if (labelDiv) labelDiv.textContent = "Download VSIX";

    // Wire up latest VSIX URL
    const key = getItem();
    if (key) {
      const [publisher, extension] = key.split(".");
      clone.href = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/latest/vspackage`;
      clone.setAttribute("download", `${publisher}.${extension}_latest.vsix`);
      clone.removeAttribute("aria-disabled");
    }

    return clone;
  }

  function ensureButton() {
    if (document.getElementById(BTN_ID)) return;

    const installBtn = findInstallButton();
    if (installBtn && installBtn.parentElement) {
      const dlBtn = createDownloadButton();
      if (dlBtn) installBtn.parentElement.appendChild(dlBtn);
    }
  }

  // Keep the button present across SPA re-renders
  const observer = new MutationObserver(() => ensureButton());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureButton);
  } else {
    ensureButton();
  }
})();



