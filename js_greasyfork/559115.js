// ==UserScript==
// @name         Techmeme improve navigation on mobile
// @namespace    https://fanis.dev/userscripts
// @author       Fanis Hatzidakis
// @license      PolyForm-Internal-Use-1.0.0; https://polyformproject.org/licenses/internal-use/1.0.0/
// @version      1.0.0
// @description  Adds a history entry when tapping Techmeme's "more" link on each story on its mobile site so Browser Back closes the overlay and Forward reopens it.
// @match        https://www.techmeme.com/*
// @match        https://techmeme.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559115/Techmeme%20improve%20navigation%20on%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/559115/Techmeme%20improve%20navigation%20on%20mobile.meta.js
// ==/UserScript==

// SPDX-License-Identifier: PolyForm-Internal-Use-1.0.0
// Copyright (c) 2025 Fanis Hatzidakis
// License: PolyForm Internal Use License 1.0.0
// Summary: Free for personal and internal business use. No redistribution, resale,
// or offering as a service without a separate commercial license from the author.
// Full text: https://polyformproject.org/licenses/internal-use/1.0.0/

(() => {
  "use strict";

  const HASH_PREFIX = "#tm_more=";

  const parseItemIdFromOnclick = (onclick) => {
    if (!onclick) return null;
    const m = onclick.match(/openItemPage\('(\d+)'/);
    return m ? m[1] : null;
  };

  const pushMoreState = (itemId) => {
    if (!itemId) return;
    if (location.hash.startsWith(HASH_PREFIX)) return;

    const newUrl = `${location.pathname}${location.search}${HASH_PREFIX}${encodeURIComponent(
      itemId
    )}`;

    history.pushState({ tmMore: true, itemId }, "", newUrl);
  };

  const closeOverlay = () => {
    const back = document.getElementById("back_selector");
    if (back) {
      back.click();
      return true;
    }
    return false;
  };

  const reopenOverlay = (itemId) => {
    if (!itemId) return false;

    const cell = document.querySelector(
      `td.nav_to_more[onclick*="openItemPage('${CSS.escape(itemId)}'"]`
    );
    if (!cell) return false;

    const onclick = cell.getAttribute("onclick");
    const parsed = parseItemIdFromOnclick(onclick);
    if (!parsed) return false;

    const fn = window.openItemPage;
    if (typeof fn !== "function") return false;

    // Techmeme signature: openItemPage('0', this, ['...'])
    // Passing only (id, element) is typically fine; the function can read element state.
    fn(parsed, cell);
    return true;
  };

  // 1) When tapping the "more" cell, push a history entry before Techmeme opens the overlay.
  document.addEventListener(
    "click",
    (e) => {
      const cell = e.target?.closest?.("td.nav_to_more");
      if (!cell) return;

      const onclick = cell.getAttribute("onclick");
      const itemId = parseItemIdFromOnclick(onclick);
      if (!itemId) return;

      pushMoreState(itemId);
      // Do not stop propagation; Techmeme must still run its onclick to open the overlay.
    },
    true
  );

  // 2) On Back/Forward gesture, close or reopen based on the hash.
  window.addEventListener("popstate", () => {
    const hash = location.hash || "";

    // Back: returning to base URL (no tm_more hash) -> close overlay.
    if (!hash.startsWith(HASH_PREFIX)) {
      const closed = closeOverlay();
      if (!closed) {
        location.replace(`${location.pathname}${location.search}`);
      }
      return;
    }

    // Forward: tm_more hash present -> reopen overlay for that itemId.
    const itemId = decodeURIComponent(hash.slice(HASH_PREFIX.length));
    const reopened = reopenOverlay(itemId);

    // Fallback: if we couldn't reopen, clean up the URL.
    if (!reopened) {
      location.replace(`${location.pathname}${location.search}`);
    }
  });
})();
