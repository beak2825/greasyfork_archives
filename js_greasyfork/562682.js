// ==UserScript==
// @name        HoG Diplomacy CSS Fix
// @namespace   https://github.com/Ralgert/HoG
// @match       *://*.konggames.com/gamez/*
// @match       *://*.heartofgalaxy.com/*
// @grant       GM_addStyle
// @version     0.2.8
// @author      Ralgert / Gemini
// @description 20260114 - Für das Spiel Heart of Galaxy: Horizons.
// @description Erzeugt Sichtbarkeit für den Diplomatie-Menüpunkt, falls dieser fälschlicherweise ausgeblendet bleibt.
// @downloadURL https://update.greasyfork.org/scripts/562682/HoG%20Diplomacy%20CSS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562682/HoG%20Diplomacy%20CSS%20Fix.meta.js
// ==/UserScript==

GM_addStyle('#b_diplomacy_icon { display: inline-block !important; cursor: pointer !important; }');
