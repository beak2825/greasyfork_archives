// ==UserScript==
// @name         Trakt: Make logo redirect to /dashboard (the v2 version of the site)
// @namespace    plennhar-trakt-make-logo-redirect-to-dashboard-the-v2-version-of-the-site
// @version      1.0
// @description  Changes the header logo link to https://trakt.tv/dashboard
// @author       Plennhar
// @match        https://trakt.tv/*
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/562747/Trakt%3A%20Make%20logo%20redirect%20to%20dashboard%20%28the%20v2%20version%20of%20the%20site%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562747/Trakt%3A%20Make%20logo%20redirect%20to%20dashboard%20%28the%20v2%20version%20of%20the%20site%29.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2026 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(() => {
  'use strict';

  const DASHBOARD_URL = 'https://trakt.tv/dashboard';
  let scheduled = false;

  function updateLogoHref() {
    const logoLink = document.querySelector('#top-nav .logo-wrapper > a[href]');
    if (!logoLink) return;

    if (logoLink.getAttribute('href') !== DASHBOARD_URL) {
      logoLink.setAttribute('href', DASHBOARD_URL);
    }
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      updateLogoHref();
    });
  }

  updateLogoHref();

  window.addEventListener('load', scheduleUpdate, true);
  document.addEventListener('DOMContentLoaded', scheduleUpdate, true);
  document.addEventListener('turbo:load', scheduleUpdate, true);
  document.addEventListener('turbo:render', scheduleUpdate, true);

  const mo = new MutationObserver(scheduleUpdate);
  mo.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['href'],
  });
})();