// ==UserScript==
// @name         Linux Client Spoofer
// @namespace    http://tampermonkey.net/
// @version      2025-10-25
// @description  Allows downloading an EXE file from the website if your operating system is Linux.
// @author       Diramix
// @match        https://pulsesync.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pulsesync.dev
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553692/Linux%20Client%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/553692/Linux%20Client%20Spoofer.meta.js
// ==/UserScript==

(() => {
  const u = 'https://ru-node-1.pulsesync.dev/api/v1/download/link';
  const s = x => x === u + '?os=linux' ? u : x;
  const f = fetch;
  window.fetch = (i, o = {}) => (o.method || 'GET') === 'GET' ? f(s(i), o) : f(i, o);
  const X = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m, u2, ...a) {
    X.call(this, m, (m === 'GET' ? s(u2) : u2), ...a);
  };
})();