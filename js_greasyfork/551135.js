// ==UserScript==
// @name         zerozero: jogo → live-ao-minuto
// @namespace    https://example.com/
// @version      1.0
// @author       JV
// @license      MIT
// @description  Přepiš /jogo/ na /live-ao-minuto/ na zerozero.pt
// @match        *://zerozero.pt/*
// @match        *://www.zerozero.pt/*
// @match        *://m.zerozero.pt/*
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551135/zerozero%3A%20jogo%20%E2%86%92%20live-ao-minuto.user.js
// @updateURL https://update.greasyfork.org/scripts/551135/zerozero%3A%20jogo%20%E2%86%92%20live-ao-minuto.meta.js
// ==/UserScript==

(function() {
  'use strict';
  try {
    const url = new URL(location.href);

    // Pokud už jsme na live-ao-minuto, nic nedělej
    if (/^\/live-ao-minuto\//.test(url.pathname)) return;

    // Přesměrování jen pokud cesta ZAČÍNÁ na /jogo/
    if (/^\/jogo\//.test(url.pathname)) {
      url.pathname = url.pathname.replace(/^\/jogo\//, '/live-ao-minuto/');
      if (url.href !== location.href) {
        // replace() nezanechá položku v historii
        location.replace(url.href);
      }
    }
  } catch (e) {
    // tiše ignoruj
  }
})();