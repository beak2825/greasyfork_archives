// ==UserScript==
// @name         Shadowfly Theme Color Switcher
// @namespace    shadowfly/theme-switcher
// @version      1.2
// @license AGPL-3.0
// @description  Switch Shadowfly theme colors via Violentmonkey menu
// @match        *://shadowfly.net/*
// @match        *://*.shadowfly.net/*
// @match        *://shadowfly.org/*
// @match        *://*.shadowfly.org/*
// @match        *://4-5.cc/*
// @match        *://*.4-5.cc/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560638/Shadowfly%20Theme%20Color%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/560638/Shadowfly%20Theme%20Color%20Switcher.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STORAGE_KEY = 'shadowfly:theme';

  const THEMES = {
    default:        { name: 'Default',          icon: '🔵' },
    dustRed:        { name: 'Dust Red',         icon: '🔴' },
    volcano:        { name: 'Volcano',          icon: '🟠' },
    sunsetOrange:   { name: 'Sunset Orange',    icon: '🟠' },
    calendulaGold:  { name: 'Calendula Gold',   icon: '🟡' },
    sunriseYellow:  { name: 'Sunrise Yellow',   icon: '🟡' },
    lime:           { name: 'Lime',             icon: '🟢' },
    polarGreen:     { name: 'Polar Green',      icon: '🟢' },
    cyan:           { name: 'Cyan',             icon: '🔵' },
    daybreakBlue:   { name: 'Daybreak Blue',    icon: '🔵' }
  };

  function applyTheme(themeKey) {
    if (!document.body) return;

    Object.keys(THEMES).forEach(t =>
      document.body.classList.remove(t)
    );

    document.body.classList.add(themeKey);
  }

  const currentTheme = GM_getValue(STORAGE_KEY, 'default');

  // Apply as early as possible
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
  });

  // Build Violentmonkey menu (radio-style)
  Object.entries(THEMES).forEach(([key, theme]) => {
    GM_registerMenuCommand(
      `${theme.icon} ${theme.name}${key === currentTheme ? ' ✓' : ''}`,
      () => {
        GM_setValue(STORAGE_KEY, key);
        location.reload(); // ensures clean re-apply
      }
    );
  });
})();