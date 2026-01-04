// ==UserScript==
// @name         AniList Browse: Set default Minimum Tag Percentage to 50
// @namespace    plennhar-anilist-browse-set-defaeult-minimum-tag-percentage-to-50
// @version      1.0
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

  const isSearchPath = (pathname) => SEARCH_RE.test(pathname);
  const hasParam = (u) => u.searchParams.has(PARAM);

  function fixedAbsUrl(u) {
    let search = u.search || "";
    if (search === "?") search = "";
    if (search.endsWith("&") || search.endsWith("?")) search = search.slice(0, -1);
    const sep = search ? "&" : "?";
    return `${u.origin}${u.pathname}${search}${sep}${PARAM}=${VALUE}${u.hash || ""}`;
  }

  function hardRedirectIfNeeded() {
    const u = new URL(location.href);
    if (!isSearchPath(u.pathname) || hasParam(u)) return false;

    const target = fixedAbsUrl(u);
    if (target !== location.href) {
      location.replace(target);
      return true;
    }
    return false;
  }

  if (hardRedirectIfNeeded()) return;

  function computeFixForUrlArg(urlArg) {
    if (urlArg == null) return null;

    const raw = String(urlArg);
    let u;
    try {
      u = new URL(raw, location.href);
    } catch {
      return null;
    }

    if (u.origin !== location.origin) return null;
    if (!isSearchPath(u.pathname)) return null;
    if (hasParam(u)) return null;

    const abs = fixedAbsUrl(u);
    const fixed = new URL(abs);

    const isAbs = /^(https?:)?\/\//i.test(raw);
    const isQueryOnly = raw.startsWith("?");

    const styled = isAbs
      ? abs
      : isQueryOnly
        ? `${fixed.search}${fixed.hash || ""}`
        : `${fixed.pathname}${fixed.search}${fixed.hash || ""}`;

    return { abs, styled, nextUrl: fixed };
  }

  function installHistoryWrapper(methodName) {
    const current = history[methodName];
    if (typeof current !== "function") return;
    if (current.__minTagRank50Wrapped) return;

    function wrapped(state, title, urlArg) {
      const before = new URL(location.href);
      const wasSearch = isSearchPath(before.pathname);

      const fix = computeFixForUrlArg(urlArg);

      if (fix) {
        const enteringSearch = !wasSearch && isSearchPath(fix.nextUrl.pathname);

        if (enteringSearch) {
          location.replace(fix.abs);
          return;
        }

        urlArg = fix.styled;
      }

      const ret = current.call(this, state, title, urlArg);

      hardRedirectIfNeeded();

      return ret;
    }

    wrapped.__minTagRank50Wrapped = true;
    history[methodName] = wrapped;
  }

  function installWrappers() {
    installHistoryWrapper("pushState");
    installHistoryWrapper("replaceState");
  }

  installWrappers();
  setTimeout(installWrappers, 0);
  setTimeout(installWrappers, 1000);
  window.addEventListener("load", installWrappers, true);

  // Back/forward navigation
  window.addEventListener("popstate", () => {
    hardRedirectIfNeeded();
  }, true);
})();
