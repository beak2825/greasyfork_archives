// ==UserScript==
// @name         Always use Google Web mode (udm=14)
// @namespace    https://github.com/isaacl
// @version      0.2
// @description  Redirects browser search to web mode (udm=14), avoiding AI and other distractions.
// @author       Isaac Levy
// @license      MIT
// @match        *://www.google.*/search?*
// @match        *://www.google.*/search
// @match        *://www.google.*/search/*
// @run-at       document-start
// @grant        none
// @homepageURL  https://github.com/isaacl/il-userscripts
// @supportURL   https://github.com/isaacl/il-userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/551274/Always%20use%20Google%20Web%20mode%20%28udm%3D14%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551274/Always%20use%20Google%20Web%20mode%20%28udm%3D14%29.meta.js
// ==/UserScript==

"use strict";

// Note: udm param means a search engine mode, tbm is used for some legacy searches.
// Quick check to avoid unnecessary work.  Not for correctness.
const rawSearch = window.location.search;
if (rawSearch.includes("udm=") || rawSearch.includes("tbm="))
  return;

let fromGoogleSearch = false;
if (document.referrer) {
  try {
    const { hostname, pathname } = new URL(document.referrer);
    // Matches google.com, google.co.uk, google.com.au, etc.
    const googleHost = /^(www\.)?google(\.[a-z]{2,3}){1,2}$/.test(hostname);
    fromGoogleSearch = googleHost && pathname === "/search";
  } catch {}
}

// Don't redirect if user may have explicitly clicked 'All' for a search.
if (!fromGoogleSearch) {
  const url = new URL(window.location.href);
  // Don't set if already has a search choice param.
  if (!url.searchParams.has("udm") && !url.searchParams.has("tbm")) {
    url.searchParams.set("udm", "14");
    window.location.replace(url);
  }
}
