// ==UserScript==
// @name         Kazachstán Basketbal
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redirect na #online + proklik na Infobasket API z ID v /html/body/main/div/text()
// @author       Michal
// @match        https://nbf.kz/en/match/?id=*
// @icon         https://nbf.kz/_templates/page/img/top-logo.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562113/Kazachst%C3%A1n%20Basketbal.user.js
// @updateURL https://update.greasyfork.org/scripts/562113/Kazachst%C3%A1n%20Basketbal.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ------------------------------------------------------------
  // 1) Přepnout na #online BEZ reloadu a NEukončovat skript
  // ------------------------------------------------------------
  const u = new URL(location.href);
  const id = u.searchParams.get('id');

  // jen když máme id
  if (id && location.hash !== '#online') {
    // hash change (typicky bez reloadu)
    location.hash = 'online';
  }

  // ------------------------------------------------------------
  // 2) Proklik z ID v /html/body/main/div/text()
  //    (spustí se po hashchange a pak průběžně čeká na DOM)
  // ------------------------------------------------------------
  const XPATH_TEXT_NODES = '/html/body/main/div/text()';
  const RE_7DIGIT = /\b\d{7}\b/;
  const API_BASE = 'https://reg.infobasket.su/Widget/GetOnlineStatus/?games=';

  function alreadyLinked() {
    return !!document.querySelector('a[data-infobasket="1"]');
  }

  function makeLink(gameId) {
    const a = document.createElement('a');
    a.href = API_BASE + encodeURIComponent(gameId);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = gameId;
    a.dataset.infobasket = '1';
    a.style.textDecoration = 'underline';
    a.style.cursor = 'pointer';
    return a;
  }

  function replaceTextNodeWithLink(textNode, gameId) {
    const original = textNode.nodeValue || '';
    const parts = original.split(gameId);

    const frag = document.createDocumentFragment();
    if (parts[0]) frag.appendChild(document.createTextNode(parts[0]));
    frag.appendChild(makeLink(gameId));
    if (parts[1]) frag.appendChild(document.createTextNode(parts[1]));

    textNode.parentNode.replaceChild(frag, textNode);
  }

  function linkifyViaXPathOnce() {
    if (alreadyLinked()) return true;

    const snap = document.evaluate(
      XPATH_TEXT_NODES,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    for (let i = 0; i < snap.snapshotLength; i++) {
      const node = snap.snapshotItem(i);
      if (!node || node.nodeType !== Node.TEXT_NODE) continue;

      const txt = (node.nodeValue || '');
      const m = txt.match(RE_7DIGIT);
      if (!m) continue;

      replaceTextNodeWithLink(node, m[0]);
      return true;
    }

    return false;
  }

  function startWatcher() {
    // zkus hned
    linkifyViaXPathOnce();

    // opakovaně pár sekund (SPA domalovává)
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (linkifyViaXPathOnce() || tries >= 80) { // ~40s
        clearInterval(timer);
      }
    }, 500);

    // a observer pro eventové změny
    const obs = new MutationObserver(() => {
      if (linkifyViaXPathOnce()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), 40000);
  }

  // Spusť watcher:
  // - hned, pokud už jsme na #online
  // - a taky po změně hashe (když se #online teprve přepíná)
  function boot() {
    startWatcher();
  }

  // když DOM ještě není, počkej
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // pokud se #online teprve přepíná a obsah se načte až po hashchange:
  window.addEventListener('hashchange', () => {
    // malá pauza, ať stránka stihne domalovat #online obsah
    setTimeout(() => startWatcher(), 200);
  });

})();