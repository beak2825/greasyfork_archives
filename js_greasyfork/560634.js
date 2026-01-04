// ==UserScript==
// @name         Premiership Rugby redirect
// @namespace    https://premiershiprugby.com/
// @version      1.1
// @license      MIT
// @description  Redirects any match-centre page to the corresponding InCrowd JSON feed
// @match        https://premiershiprugby.com/match-centre/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560634/Premiership%20Rugby%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/560634/Premiership%20Rugby%20redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const match = location.pathname.match(/\/match-centre\/(\d+)/);
  if (!match) return;

  const matchId = match[1];

  const target =
    `https://rugby-union-feeds.incrowdsports.com/v1/matches/${matchId}` +
    `?clientId=PRL&provider=rugbyviz&seasonId=202501`;

  // zabrání přesměrovací smyčce
  if (!location.href.startsWith(target)) {
    location.replace(target);
  }
})();