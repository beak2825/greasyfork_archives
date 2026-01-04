// ==UserScript==
// @name         HBStatz redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       JV
// @license      MIT
// @description  Přesměruje URL na hbstatz.is podle délky ID
// @match        https://hbstatz.is/*
// @match        https://www.hbstatz.is/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548773/HBStatz%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/548773/HBStatz%20redirect.meta.js
// ==/UserScript==

(() => {
  const url = new URL(location.href);

  // pokud už jsme na cílové stránce, nedělej nic
  if (/hsilive\.php/i.test(url.pathname) || /test10\.php/i.test(url.pathname)) {
    return;
  }

  // zkus najít ID v query stringu (?ID= nebo ?id=)
  let id = url.searchParams.get('ID') || url.searchParams.get('id');

  // nebo z posledního segmentu cesty
  if (!id) {
    id = url.pathname.split('/').filter(Boolean).pop();
  }

  if (!id) return;

  if (/^\d{4}$/.test(id)) {
    // 4 čísla
    location.replace(`https://hbstatz.is/HSILive.php?ID=${id}`);
  } else if (/^\d{5}$/.test(id)) {
    // 5 čísel
    location.replace(`https://hbstatz.is/test10.php?ID=${id}`);
  }
})();