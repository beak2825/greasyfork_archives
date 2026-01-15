// ==UserScript==
// @name        HoG Diplomacy CSS Fix
// @namespace   https://github.com/Ralgert/HoG
// @match       *://*.konggames.com/gamez/*
// @match       *://*.heartofgalaxy.com/*
// @grant       GM_addStyle
// @version     0.2.7
// @author      Ralgert / Gemini
// @description 20260114
// @description Für das Spiel Heart of Galaxy: Horizons
// @description auch bei richtigen Voraussetzungen bleibt der Menü Punkt Diplomatie ausgeblendet; hiermit nicht
// @downloadURL https://update.greasyfork.org/scripts/562682/HoG%20Diplomacy%20CSS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562682/HoG%20Diplomacy%20CSS%20Fix.meta.js
// ==/UserScript==

GM_addStyle('#b_diplomacy_icon { display: inline-block !important; cursor: pointer !important; }');
