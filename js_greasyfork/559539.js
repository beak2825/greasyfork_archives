// ==UserScript==
// @name         AniList Browse: Set default Minimum Tag Percentage to 50
// @namespace    plennhar-anilist-browse-set-defaeult-minimum-tag-percentage-to-50
// @version      1.1
// @description  Changes the default tag percentage from 18 to 50 by automatically adding minimumTagRank=50 to AniList's anime/manga Browse page URLs (and forcing a reload to apply it).
// @author       Plennhar
// @match        https://anilist.co/*
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/559539/AniList%20Browse%3A%20Set%20default%20Minimum%20Tag%20Percentage%20to%2050.user.js
// @updateURL https://update.greasyfork.org/scripts/559539/AniList%20Browse%3A%20Set%20default%20Minimum%20Tag%20Percentage%20to%2050.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2025 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later


(() => {
  "use strict";

  const PARAM = "minimumTagRank";
  const VALUE = "50";  // Default Minimum Tag Percentage.
  const SEARCH_RE = /^\/search\/(anime|manga)(\/|$)/;

  const RELOAD_GUARD_KEY = "anilist_minTagRank50_lastReloadTarget";

  const isSearchPath = (pathname) => SEARCH_RE.test(pathname);

  function fixedAbsUrl(u) {
    let search = u.search || "";
    if (search === "?") search = "";
    if (search.endsWith("&") || search.endsWith("?")) search = search.slice(0, -1);
    const sep = search ? "&" : "?";
    return `${u.origin}${u.pathname}${search}${sep}${PARAM}=${VALUE}${u.hash || ""}`;
  }

  function enforceOnCurrentUrl({ reloadIfAdded } = { reloadIfAdded: true }) {
    let u;
    try {
      u = new URL(location.href);
    } catch {
      return false;
    }

    if (!isSearchPath(u.pathname)) return false;
    if (u.searchParams.has(PARAM)) return false;

    const target = fixedAbsUrl(u);
    if (target === location.href) return false;

    history.replaceState(history.state, document.title, target);

    if (!reloadIfAdded) return true;

    const last = sessionStorage.getItem(RELOAD_GUARD_KEY);
    if (last !== target) {
      sessionStorage.setItem(RELOAD_GUARD_KEY, target);
      location.reload();
      return true;
    }

    location.replace(target);
    return true;
  }

  function wrapHistoryMethod(methodName) {
    const original = history[methodName];
    if (typeof original !== "function") return;
    if (original.__minTagRank50Wrapped) return;

    function wrapped(...args) {
      const ret = original.apply(this, args);
      setTimeout(() => enforceOnCurrentUrl({ reloadIfAdded: true }), 0);
      return ret;
    }

    wrapped.__minTagRank50Wrapped = true;
    history[methodName] = wrapped;
  }

  function install() {
    wrapHistoryMethod("pushState");
    wrapHistoryMethod("replaceState");
  }

  install();

  if (enforceOnCurrentUrl({ reloadIfAdded: true })) return;

  // Back/forward navigation
  window.addEventListener(
    "popstate",
    () => {
      enforceOnCurrentUrl({ reloadIfAdded: true });
    },
    true
  );

  setTimeout(install, 0);
  setTimeout(install, 500);
  setTimeout(install, 1500);
  window.addEventListener("load", install, true);

  setInterval(() => enforceOnCurrentUrl({ reloadIfAdded: true }), 750);
})();