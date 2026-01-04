// ==UserScript==
// @name         Torn Item Market — RW Bonus Badges
// @namespace    smitty.torn.com
// @version      1.0
// @description  Show RW bonus name and percentage directly on each Item Market listing (no hover required)
// @author       Smitty
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://pda.torn.com/page.php?sid=ItemMarket*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549738/Torn%20Item%20Market%20%E2%80%94%20RW%20Bonus%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/549738/Torn%20Item%20Market%20%E2%80%94%20RW%20Bonus%20Badges.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Only run on Item Market pages (SPA friendly)
  const isItemMarket = () => {
    const u = new URL(location.href);
    return u.searchParams.get("sid") === "ItemMarket" || document.querySelector("#item-market-root");
  };

  const STYLE_ID = "rw-bonus-badge-style";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      .rw-badge {
        position: absolute;
        left: 6px;
        bottom: 6px;
        z-index: 5;
        font: 600 11px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        background: rgba(20, 20, 20, 0.85);
        color: #fff;
        padding: 4px 6px;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,.25);
        pointer-events: none;
        max-width: 92%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .rw-badge .rw-bonus {
        margin-right: 6px;
        opacity: 0.9;
      }
      .rw-badge .rw-bonus:last-child { margin-right: 0; }
      .rw-img-wrap-relative {
        position: relative !important;
      }
    `;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Parse bonus display text from an <i class="bonus-attachment-..."> node
  function parseBonusIcon(iEl) {
    if (!iEl) return null;
    const name = iEl.getAttribute("data-bonus-attachment-title") || iEl.getAttribute("aria-label") || "";
    const desc = iEl.getAttribute("data-bonus-attachment-description") || "";

    // Grab the first percentage like "12%" or "7.5%"
    const m = desc.match(/(\d+(?:\.\d+)?)\s*%/);
    const pct = m ? m[1] : null;

    // Fallback: if no percentage present, just surface the description
    const label = pct ? `${name} ${pct}%` : (name || desc || "").trim();
    return label || null;
  }

  // Build a badge label for one tile
  function buildBadgeText(tile) {
    // Any RW bonus icons live inside a container with a class containing "bonuses"
    const iconContainer = tile.querySelector("div[class*='bonuses']");
    if (!iconContainer) return null;

    const icons = iconContainer.querySelectorAll("i[class^='bonus-attachment-'], i[class*=' bonus-attachment-']");
    if (!icons.length) return null;

    const labels = [];
    icons.forEach(i => {
      const label = parseBonusIcon(i);
      if (label) labels.push(label);
    });

    if (!labels.length) return null;

    // Merge duplicates, keep order
    const seen = new Set();
    const unique = labels.filter(t => (seen.has(t) ? false : seen.add(t)));
    return unique;
  }

  function ensureImageWrapperRelative(tile) {
    // Prefer the image wrapper to anchor the badge
    let imgWrap = tile.querySelector("div[class*='imageWrapper']");
    if (!imgWrap) {
      // fall back to the main tile node
      imgWrap = tile;
    }
    if (!imgWrap.classList.contains("rw-img-wrap-relative")) {
      imgWrap.classList.add("rw-img-wrap-relative");
    }
    return imgWrap;
  }

  function applyBadge(tile) {
    if (!tile || tile.dataset.rwBadgeApplied === "1") return;

    const labels = buildBadgeText(tile);
    // Only add a badge when there is at least one RW icon with parsed text
    if (!labels || labels.length === 0) {
      tile.dataset.rwBadgeApplied = "1";
      return;
    }

    const imgWrap = ensureImageWrapperRelative(tile);

    // Remove any old badge we created
    const existing = imgWrap.querySelector(":scope > .rw-badge");
    if (existing) existing.remove();

    // Create badge
    const badge = document.createElement("div");
    badge.className = "rw-badge";
    badge.title = labels.join(" • ");

    // Cap how many labels we render visually to avoid overflow
    // Always show the first; if more exist, append “+N”
    if (labels.length === 1) {
      badge.textContent = labels[0];
    } else {
      const first = document.createElement("span");
      first.className = "rw-bonus";
      first.textContent = labels[0];
      badge.appendChild(first);

      const more = document.createElement("span");
      more.textContent = `+${labels.length - 1}`;
      badge.appendChild(more);
    }

    imgWrap.appendChild(badge);
    tile.dataset.rwBadgeApplied = "1";
  }

  function scanOnce(root = document) {
    // Each listing tile has a class beginning with "itemTile"
    const tiles = root.querySelectorAll("div[class^='itemTile'], div[class*=' itemTile']");
    tiles.forEach(applyBadge);
  }

  // Observe dynamic content (infinite scroll, filters, SPA route changes)
  function observe() {
    const root = document.getElementById("item-market-root") || document.body;
    const mo = new MutationObserver(muts => {
      let needsScan = false;
      for (const m of muts) {
        if (m.addedNodes && m.addedNodes.length) {
          needsScan = true;
          break;
        }
      }
      if (needsScan) scanOnce(root);
    });
    mo.observe(root, { childList: true, subtree: true });
  }

  function boot() {
    if (!isItemMarket()) return;
    injectStyles();
    scanOnce();
    observe();
  }

  // Handle SPA navigations
  let lastHref = location.href;
  new MutationObserver(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      setTimeout(boot, 50);
    }
  }).observe(document, { subtree: true, childList: true });

  // Initial start
  if (document.readyState === "complete" || document.readyState === "interactive") {
    boot();
  } else {
    window.addEventListener("DOMContentLoaded", boot, { once: true });
  }
})();

(function () {
  "use strict";

  // Only run on Item Market pages (SPA friendly)
  const isItemMarket = () => {
    const u = new URL(location.href);
    return u.searchParams.get("sid") === "ItemMarket" || document.querySelector("#item-market-root");
  };

  const STYLE_ID = "rw-bonus-badge-style";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      .rw-badge {
        position: absolute;
        left: 6px;
        bottom: 6px;
        z-index: 5;
        font: 600 11px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        background: rgba(20, 20, 20, 0.85);
        color: #fff;
        padding: 4px 6px;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,.25);
        pointer-events: none;
        max-width: 92%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .rw-badge .rw-bonus {
        margin-right: 6px;
        opacity: 0.9;
      }
      .rw-badge .rw-bonus:last-child { margin-right: 0; }
      .rw-img-wrap-relative {
        position: relative !important;
      }
    `;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Parse bonus display text from an <i class="bonus-attachment-..."> node
  function parseBonusIcon(iEl) {
    if (!iEl) return null;
    const name = iEl.getAttribute("data-bonus-attachment-title") || iEl.getAttribute("aria-label") || "";
    const desc = iEl.getAttribute("data-bonus-attachment-description") || "";

    // Grab the first percentage like "12%" or "7.5%"
    const m = desc.match(/(\d+(?:\.\d+)?)\s*%/);
    const pct = m ? m[1] : null;

    // Fallback: if no percentage present, just surface the description
    const label = pct ? `${name} ${pct}%` : (name || desc || "").trim();
    return label || null;
  }

  // Build a badge label for one tile
  function buildBadgeText(tile) {
    // Any RW bonus icons live inside a container with a class containing "bonuses"
    const iconContainer = tile.querySelector("div[class*='bonuses']");
    if (!iconContainer) return null;

    const icons = iconContainer.querySelectorAll("i[class^='bonus-attachment-'], i[class*=' bonus-attachment-']");
    if (!icons.length) return null;

    const labels = [];
    icons.forEach(i => {
      const label = parseBonusIcon(i);
      if (label) labels.push(label);
    });

    if (!labels.length) return null;

    // Merge duplicates, keep order
    const seen = new Set();
    const unique = labels.filter(t => (seen.has(t) ? false : seen.add(t)));
    return unique;
  }

  function ensureImageWrapperRelative(tile) {
    // Prefer the image wrapper to anchor the badge
    let imgWrap = tile.querySelector("div[class*='imageWrapper']");
    if (!imgWrap) {
      // fall back to the main tile node
      imgWrap = tile;
    }
    if (!imgWrap.classList.contains("rw-img-wrap-relative")) {
      imgWrap.classList.add("rw-img-wrap-relative");
    }
    return imgWrap;
  }

  function applyBadge(tile) {
    if (!tile || tile.dataset.rwBadgeApplied === "1") return;

    const labels = buildBadgeText(tile);
    // Only add a badge when there is at least one RW icon with parsed text
    if (!labels || labels.length === 0) {
      tile.dataset.rwBadgeApplied = "1";
      return;
    }

    const imgWrap = ensureImageWrapperRelative(tile);

    // Remove any old badge we created
    const existing = imgWrap.querySelector(":scope > .rw-badge");
    if (existing) existing.remove();

    // Create badge
    const badge = document.createElement("div");
    badge.className = "rw-badge";
    badge.title = labels.join(" • ");

    // Cap how many labels we render visually to avoid overflow
    // Always show the first; if more exist, append “+N”
    if (labels.length === 1) {
      badge.textContent = labels[0];
    } else {
      const first = document.createElement("span");
      first.className = "rw-bonus";
      first.textContent = labels[0];
      badge.appendChild(first);

      const more = document.createElement("span");
      more.textContent = `+${labels.length - 1}`;
      badge.appendChild(more);
    }

    imgWrap.appendChild(badge);
    tile.dataset.rwBadgeApplied = "1";
  }

  function scanOnce(root = document) {
    // Each listing tile has a class beginning with "itemTile"
    const tiles = root.querySelectorAll("div[class^='itemTile'], div[class*=' itemTile']");
    tiles.forEach(applyBadge);
  }

  // Observe dynamic content (infinite scroll, filters, SPA route changes)
  function observe() {
    const root = document.getElementById("item-market-root") || document.body;
    const mo = new MutationObserver(muts => {
      let needsScan = false;
      for (const m of muts) {
        if (m.addedNodes && m.addedNodes.length) {
          needsScan = true;
          break;
        }
      }
      if (needsScan) scanOnce(root);
    });
    mo.observe(root, { childList: true, subtree: true });
  }

  function boot() {
    if (!isItemMarket()) return;
    injectStyles();
    scanOnce();
    observe();
  }

  // Handle SPA navigations
  let lastHref = location.href;
  new MutationObserver(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      setTimeout(boot, 50);
    }
  }).observe(document, { subtree: true, childList: true });

  // Initial start
  if (document.readyState === "complete" || document.readyState === "interactive") {
    boot();
  } else {
    window.addEventListener("DOMContentLoaded", boot, { once: true });
  }
})();
