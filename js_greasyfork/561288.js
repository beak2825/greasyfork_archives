// ==UserScript==
// @name         KnobCloud: better tab titles + link developer name (with fallback)
// @namespace    https://knobcloud.com/
// @version      1.5.1
// @description  Search pages: "<term> - KnobCloud Search Results". Item pages: "<Developer> - <Item title> - KnobCloud" + make developer name clickable (falls back to search if developer page doesn't exist). Developer index: "KnobCloud Developer Database". Developer pages: "<Developer> - KnobCloud Developer Page" (and default sort orderBy=new). User profiles: "<username> KnobCloud User Profile".
// @match        https://knobcloud.com/search*
// @match        https://knobcloud.com/item/*
// @match        https://knobcloud.com/developer*
// @match        https://knobcloud.com/user-profile/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561288/KnobCloud%3A%20better%20tab%20titles%20%2B%20link%20developer%20name%20%28with%20fallback%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561288/KnobCloud%3A%20better%20tab%20titles%20%2B%20link%20developer%20name%20%28with%20fallback%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const TITLES = {
    searchSuffix: "KnobCloud Search Results",
    siteSuffix: "KnobCloud",
    developerSuffix: "KnobCloud Developer Page",
    developerIndexTitle: "KnobCloud Developer Database",
    userProfileSuffix: "KnobCloud User Profile",
  };

  // Cache developer slug existence per-tab-session (fast + avoids repeated fetch)
  const DEV_EXISTS_KEY_PREFIX = "kc_dev_exists:"; // sessionStorage key: kc_dev_exists:<slug> => "1" | "0"

  function setTitleIfChanged(newTitle) {
    if (!newTitle) return false;
    if (document.title === newTitle) return true; // avoid triggering mutations
    document.title = newTitle;
    return true;
  }

  function decodeLoose(s) {
    if (!s) return "";
    return String(s).replace(/\+/g, " ").trim();
  }

  function toTitleCaseWords(str) {
    return str
      .split(/[\s\-]+/g)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // ---------- Routing ----------
  function isSearchPage() {
    return /^\/search\/?$/.test(window.location.pathname);
  }

  function isItemPage() {
    return /^\/item\/\d+\/?$/.test(window.location.pathname);
  }

  function isDeveloperIndexPage() {
    return /^\/developer\/?$/.test(window.location.pathname);
  }

  function isDeveloperDetailPage() {
    return /^\/developer\/[^/]+\/?$/.test(window.location.pathname) && !isDeveloperIndexPage();
  }

  function isUserProfilePage() {
    return /^\/user-profile\/\d+\/?$/.test(window.location.pathname);
  }

  // ---------- Developer pages: default sort ----------
  // Only adds orderBy=new when missing (so if you manually pick a different sort, it won’t fight you).
  function enforceDeveloperOrderByNew() {
    if (!isDeveloperDetailPage()) return false;

    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (params.get("orderBy") === "new") return false;
    if (params.has("orderBy")) return false; // respect user override

    params.set("orderBy", "new");
    url.search = params.toString();

    // Use replace() so back button doesn't bounce you through the unsorted URL.
    window.location.replace(url.toString());
    return true;
  }

  // ---------- Search page ----------
  function getSearchTerm() {
    const params = new URLSearchParams(window.location.search);
    let term = (params.get("search_key") || "").trim();
    if (!term) term = (params.get("q") || "").trim();
    if (!term) term = (params.get("search") || "").trim();
    return decodeLoose(term);
  }

  function setSearchTitle() {
    const term = getSearchTerm();
    const desired = term ? `${term} - ${TITLES.searchSuffix}` : TITLES.searchSuffix;
    return setTitleIfChanged(desired);
  }

  // ---------- Item page helpers ----------
  function getInfoPanel() {
    return document.querySelector("#InfoMessagePanel");
  }

  function getItemInfoRoot(panel) {
    return panel?.querySelector("#itemInfo") || panel || null;
  }

  function findDeveloperHeading(panel) {
    const root = getItemInfoRoot(panel);
    if (!root) return null;
    return root.querySelector("h3.mb-0.h3") || root.querySelector("h3");
  }

  function findItemTitleHeading(panel) {
    const root = getItemInfoRoot(panel);
    if (!root) return null;
    return root.querySelector("h1.h1") || root.querySelector("h1");
  }

  function readItemTitlesFromDOM() {
    const panel = getInfoPanel();
    if (!panel) return { developer: "", itemTitle: "" };

    const developerEl = findDeveloperHeading(panel);
    const titleEl = findItemTitleHeading(panel);

    return {
      developer: developerEl?.textContent?.trim() || "",
      itemTitle: titleEl?.textContent?.trim() || "",
    };
  }

  function setItemTitle() {
    const { developer, itemTitle } = readItemTitlesFromDOM();
    if (developer && itemTitle) {
      return setTitleIfChanged(`${developer} - ${itemTitle} - ${TITLES.siteSuffix}`);
    }
    if (itemTitle) {
      return setTitleIfChanged(`${itemTitle} - ${TITLES.siteSuffix}`);
    }
    return false;
  }

  function slugifyDeveloperName(name) {
    return name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function makeDeveloperUrls(devName) {
    const slug = slugifyDeveloperName(devName);
    const devUrl = new URL(`/developer/${slug}`, window.location.origin).href;
    const searchUrl = new URL(`/search?search_key=${encodeURIComponent(devName)}`, window.location.origin).href;
    return { slug, devUrl, searchUrl };
  }

  function getCachedDevExists(slug) {
    try {
      const v = sessionStorage.getItem(DEV_EXISTS_KEY_PREFIX + slug);
      if (v === "1") return true;
      if (v === "0") return false;
    } catch (_) {}
    return null;
  }

  function setCachedDevExists(slug, exists) {
    try {
      sessionStorage.setItem(DEV_EXISTS_KEY_PREFIX + slug, exists ? "1" : "0");
    } catch (_) {}
  }

  async function developerPageExists(slug, devUrl) {
    const cached = getCachedDevExists(slug);
    if (cached !== null) return cached;

    let resp = null;
    let usedGet = false;

    try {
      resp = await fetch(devUrl, { method: "HEAD", credentials: "same-origin", redirect: "follow" });
      if (resp.status === 405) throw new Error("HEAD not allowed");
    } catch (_) {
      try {
        usedGet = true;
        resp = await fetch(devUrl, { method: "GET", credentials: "same-origin", redirect: "follow" });
      } catch (_) {
        setCachedDevExists(slug, false);
        return false;
      }
    }

    if (resp.status === 404 || resp.status === 410) {
      setCachedDevExists(slug, false);
      return false;
    }

    try {
      const finalPath = new URL(resp.url).pathname.replace(/\/$/, "");
      if (finalPath === "/developer" || finalPath === "/search") {
        setCachedDevExists(slug, false);
        return false;
      }
    } catch (_) {}

    if (usedGet && resp.ok) {
      try {
        const ct = String(resp.headers.get("content-type") || "");
        if (ct.includes("text/html")) {
          const html = await resp.text();
          const looksMissing =
            /developer\s+database/i.test(html) ||
            /\b404\b/i.test(html) ||
            /not\s+found/i.test(html) ||
            /does\s+not\s+exist/i.test(html) ||
            /no\s+developer/i.test(html);
          if (looksMissing) {
            setCachedDevExists(slug, false);
            return false;
          }
        }
      } catch (_) {}
    }

    const exists = !!resp.ok;
    setCachedDevExists(slug, exists);
    return exists;
  }

  async function validateAndFixDeveloperLink(a, devName) {
    if (!a || !devName) return;
    if (a.dataset.kcDevValidated === "1") return;
    a.dataset.kcDevValidated = "1";

    const { slug, devUrl, searchUrl } = makeDeveloperUrls(devName);

    if (a.href !== devUrl) a.href = devUrl;

    const exists = await developerPageExists(slug, devUrl);
    if (!exists) {
      a.href = searchUrl;
      a.title = "Developer page missing; linking to search instead";
      a.dataset.kcDevFallback = "1";
    }
  }

  function ensureDeveloperLinkOnItemPage() {
    const panel = getInfoPanel();
    if (!panel) return false;

    const developerEl = findDeveloperHeading(panel);
    if (!developerEl) return false;

    const devName = developerEl.textContent?.trim();
    if (!devName) return false;

    let linkEl = null;

    if (developerEl.tagName.toLowerCase() === "a") {
      linkEl = developerEl;
    } else {
      const existingLink = developerEl.querySelector?.("a");
      if (existingLink) {
        linkEl = existingLink;
      } else {
        const a = document.createElement("a");
        a.style.color = "inherit";
        a.style.textDecoration = "underline";
        a.style.textDecorationThickness = "from-font";
        a.style.textUnderlineOffset = "2px";
        a.textContent = devName;

        developerEl.textContent = "";
        developerEl.appendChild(a);
        linkEl = a;
      }
    }

    validateAndFixDeveloperLink(linkEl, devName);
    return true;
  }

  // ---------- Developer page titles ----------
  function setDeveloperIndexTitle() {
    return setTitleIfChanged(TITLES.developerIndexTitle);
  }

  function readDeveloperNameFromDeveloperPage() {
    const h1 = document.querySelector("h1");
    const fromH1 = h1?.textContent?.trim();
    if (fromH1) return fromH1;

    const slug = window.location.pathname.replace(/^\/developer\//, "").replace(/\/$/, "");
    if (!slug) return "";

    return toTitleCaseWords(slug.replace(/-/g, " "));
  }

  function setDeveloperDetailTitle() {
    const name = readDeveloperNameFromDeveloperPage();
    if (!name) return false;
    return setTitleIfChanged(`${name} - ${TITLES.developerSuffix}`);
  }

  // ---------- User profile pages ----------
  function readUsernameFromUserProfilePage() {
    const h1 = document.querySelector("h1.h1") || document.querySelector("h1");
    const h3 = document.querySelector("h3.mt-1.h3") || document.querySelector("h3");

    const nameFromH1 = h1?.textContent?.trim();
    if (nameFromH1) return nameFromH1;

    const nameFromH3 = h3?.textContent?.trim();
    if (nameFromH3) return nameFromH3;

    const id = window.location.pathname.replace(/^\/user-profile\//, "").replace(/\/$/, "");
    return id ? `User ${id}` : "";
  }

  function setUserProfileTitle() {
    const username = readUsernameFromUserProfilePage();
    if (!username) return false;
    return setTitleIfChanged(`${username} ${TITLES.userProfileSuffix}`);
  }

  // ---------- Apply routing ----------
  function applyForCurrentPage() {
    // Do redirects first.
    if (enforceDeveloperOrderByNew()) return;

    if (isSearchPage()) {
      setSearchTitle();
      return;
    }
    if (isItemPage()) {
      setItemTitle();
      ensureDeveloperLinkOnItemPage();
      return;
    }
    if (isDeveloperIndexPage()) {
      setDeveloperIndexTitle();
      return;
    }
    if (isDeveloperDetailPage()) {
      setDeveloperDetailTitle();
      return;
    }
    if (isUserProfilePage()) {
      setUserProfileTitle();
      return;
    }
  }

  // Initial run
  applyForCurrentPage();

  // SPA-ish navigation handling
  const _pushState = history.pushState;
  const _replaceState = history.replaceState;

  history.pushState = function (...args) {
    const ret = _pushState.apply(this, args);
    setTimeout(applyForCurrentPage, 0);
    return ret;
  };

  history.replaceState = function (...args) {
    const ret = _replaceState.apply(this, args);
    setTimeout(applyForCurrentPage, 0);
    return ret;
  };

  window.addEventListener("popstate", () => setTimeout(applyForCurrentPage, 0));

  // Mutation observer (observe BODY so title changes in HEAD won't retrigger endlessly)
  const obs = new MutationObserver(() => {
    // No redirects here (avoid surprise navigation off DOM mutations).
    if (isSearchPage()) {
      setSearchTitle();
      return;
    }
    if (isItemPage()) {
      ensureDeveloperLinkOnItemPage();
      setItemTitle();
      return;
    }
    if (isDeveloperIndexPage()) {
      setDeveloperIndexTitle();
      return;
    }
    if (isDeveloperDetailPage()) {
      setDeveloperDetailTitle();
      return;
    }
    if (isUserProfilePage()) {
      setUserProfileTitle();
      return;
    }
  });

  if (document.body) {
    obs.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener(
      "DOMContentLoaded",
      () => {
        if (document.body) obs.observe(document.body, { childList: true, subtree: true });
      },
      { once: true }
    );
  }
})();
