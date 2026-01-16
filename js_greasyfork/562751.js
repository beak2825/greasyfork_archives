// ==UserScript==
// @name         Trakt: Re-direct app.trakt.tv (v3) to trakt.tv/dashboard (v2)
// @namespace    plennhar-trakt-re-direct-app-trakt-tv-v3-to-trakt-tv-dashboard-v2
// @version      1.0
// @description  Re-directs app.trakt.tv to trakt.tv/dashboard (which effectively redirects trakt.tv to trakt.tv/dasbhoard, since Trakt has a redirect set up that redirects trakt.tv to app.trakt.tv).
// @author       Plennhar
// @match        https://app.trakt.tv/*
// @match        https://trakt.tv/*
// @match        https://www.trakt.tv/*
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/562751/Trakt%3A%20Re-direct%20apptrakttv%20%28v3%29%20to%20trakttvdashboard%20%28v2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562751/Trakt%3A%20Re-direct%20apptrakttv%20%28v3%29%20to%20trakttvdashboard%20%28v2%29.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2026 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(() => {
  'use strict';

  const TARGET = 'https://trakt.tv/dashboard';

  if (window.top !== window.self) return;

  const host = location.hostname;
  const path = location.pathname || '/';

  const onAppLanding = (host === 'app.trakt.tv' && path === '/');
  const onTraktLanding = ((host === 'trakt.tv' || host === 'www.trakt.tv') && path === '/');

  if (!onAppLanding && !onTraktLanding) return;

  const params = new URLSearchParams(location.search);
  const looksLikeOAuth =
    params.has('code') || params.has('state') || params.has('error') || params.has('redirect');

  if (looksLikeOAuth) return;

  location.replace(TARGET);
})();