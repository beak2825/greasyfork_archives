// ==UserScript==
// @name         Lewaterpolo API redirect
// @namespace    https://lewaterpolo.com/
// @version      1.1
// @description  Přesměrování do API
// @author       JV
// @license      MIT
// @match        https://lewaterpolo.com/*/partido/*/minuto-a-minuto/*
// @match        https://lewaterpolo.com/*/partido/*/previa/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552675/Lewaterpolo%20API%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/552675/Lewaterpolo%20API%20redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (location.pathname.includes('/rest_api/') || location.href.includes('/rest_api/api.php')) return;
  const m = location.pathname.match(/\/partido\/(\d+)(?:\/|$)/);
  if (!m) return;
  const matchId = m[1];
  const apiUrl = `https://lewaterpolo.com/rest_api/api.php?matchId=${encodeURIComponent(matchId)}`;
  location.replace(apiUrl);
})();