// ==UserScript==
// @name         Google Drive: Open Direct Image from /view
// @namespace    https://greasyfork.org/users/573dave2
// @version      1.3.0
// @description  Adds a floating “Open Image” button on Google Drive file preview pages (those ending in /view). Click it to open the full-size direct image URL in a new tab. Right-click and comments remain fully functional.
// @author       573dave2
// @license      MIT
// @match        https://drive.google.com/file/d/*/view*
// @match        https://drive.google.com/file/d/*/view
// @grant        GM_openInTab
// @run-at       document-idle
// @icon         https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png
// @downloadURL https://update.greasyfork.org/scripts/552070/Google%20Drive%3A%20Open%20Direct%20Image%20from%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/552070/Google%20Drive%3A%20Open%20Direct%20Image%20from%20view.meta.js
// ==/UserScript==


(() => {
  "use strict";

  const BTN_ID = "gd-open-image-btn";
  let lastHref = location.href;
  let poll;

  // --- Utilities ---
  const byId = (id) => document.getElementById(id);
  const isView = () => /\/file\/d\/[^/]+\/view/.test(location.pathname);
  const getFileId = () => (location.pathname.match(/\/file\/d\/([^/]+)\//) || [])[1] || null;

  function mountBtn() {
    if (byId(BTN_ID)) return;

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.textContent = "Open Image";
    // Minimal inline styles; no classes, no shadow, no innerHTML (Trusted Types safe)
    Object.assign(btn.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: "2147483647",
      padding: "10px 14px",
      fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif",
      fontSize: "14px",
      fontWeight: "600",
      color: "#1a73e8",
      background: "#fff",
      border: "1px solid #dadce0",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,.12)",
      cursor: "pointer",
    });

    // Keep Drive’s right-click intact: we don't intercept any global events.
    // Only clicks on the button itself are handled.
    btn.addEventListener("click", onOpenClick, { passive: true });

    // Optional: right-click on the button should show the browser menu (do nothing).
    // (No listener needed; just don't preventDefault.)

    document.body.appendChild(btn);
  }

  function unmountBtn() {
    const b = byId(BTN_ID);
    if (b) b.remove();
  }

  async function onOpenClick() {
    const fileId = getFileId();
    if (!fileId) {
      alert("Could not detect Drive file ID from URL.");
      return;
    }
    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

    try {
      const html = await fetch(previewUrl, { credentials: "include" }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      });
      const best = pickLargestViewerImage(html);
      if (best) {
        GM_openInTab(best, { active: true, insert: true });
        return;
      }
    } catch {
      // ignore; use fallback below
    }

    const fallback = `https://drive.usercontent.google.com/uc?id=${encodeURIComponent(fileId)}&export=download`;
    GM_openInTab(fallback, { active: true, insert: true });
  }

  function pickLargestViewerImage(html) {
    // Extract all URLs; normalize \u003d -> '='
    const urls = [];
    const re = /(https:\/\/[^\s"'<>]+)/g;
    let m;
    while ((m = re.exec(html)) !== null) urls.push(m[1].replace(/\\u003d/g, "="));

    // Viewer variants: .../u/<n>/drive-viewer/...=s####(-rw-v1)?
    const candidates = urls.filter((u) =>
      /^https:\/\/drive\.google\.com\/u\/\d+\/drive-viewer\/[^?]*=s\d+(?:-rw-v1)?$/i.test(u)
    );
    if (!candidates.length) return null;

    let best = null;
    let bestSize = -1;
    for (const u of candidates) {
      const mm = u.match(/=s(\d+)(?:-rw-v1)?$/i);
      const sz = mm ? parseInt(mm[1], 10) : 0;
      if (sz > bestSize) {
        bestSize = sz;
        best = u;
      }
    }
    return best;
  }

  function tick() {
    const href = location.href;
    if (href !== lastHref) {
      lastHref = href;
      isView() ? mountBtn() : unmountBtn();
      return;
    }
    isView() ? mountBtn() : unmountBtn();
  }

  function start() {
    if (!poll) poll = setInterval(tick, 500);
    window.addEventListener(
      "beforeunload",
      () => {
        if (poll) clearInterval(poll);
        poll = null;
      },
      { passive: true }
    );
    tick();
  }

  start();
})();
