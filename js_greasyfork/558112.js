// ==UserScript==
// @name         duckduckgo-bang
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add an additional G button to jump to google
// @author       levinion
// @match        *://duckduckgo.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558112/duckduckgo-bang.user.js
// @updateURL https://update.greasyfork.org/scripts/558112/duckduckgo-bang.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const googleGSVG = `
<svg fill="#c0bfbc" viewBox="0 0 32.00 32.00" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="#000000" stroke-width="0.32">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <title>Google</title>
    <path d="M26.592 15.161h-10.527c-0.442 0-0.8 0.358-0.8 0.8v0.929c0 0.442 0.358 0.8 0.8 0.8h8.774c-0.029 4.464-3.655 8.071-8.122 8.071-0.127 0-0.254-0.003-0.38-0.009l0.018 0.001c-0.081 0.003-0.177 0.004-0.273 0.004-2.562 0-4.874-1.073-6.509-2.795l-0.004-0.004c-1.684-1.718-2.723-4.074-2.723-6.672 0-0.103 0.002-0.205 0.005-0.307l-0 0.015c-0.002-0.073-0.003-0.159-0.003-0.245 0-2.621 1.075-4.991 2.808-6.693l0.001-0.001c1.675-1.741 4.024-2.822 6.626-2.822 0.070 0 0.14 0.001 0.21 0.002l-0.010-0c0.018-0 0.039-0 0.059-0 1.668 0 3.236 0.427 4.602 1.177l-0.050-0.025c1.396 0.757 2.538 1.823 3.363 3.112l0.022 0.036c0.144 0.225 0.393 0.372 0.676 0.372 0.174 0 0.334-0.055 0.465-0.149l-0.002 0.002 0.768-0.544c0.205-0.147 0.337-0.384 0.337-0.652 0-0.164-0.049-0.316-0.134-0.443l0.002 0.003c-2.177-3.283-5.857-5.417-10.035-5.417-0.026 0-0.051 0-0.077 0l0.004-0c-0.059-0.001-0.128-0.002-0.197-0.002-3.312 0-6.305 1.365-8.448 3.563l-0.002 0.003c-2.191 2.168-3.547 5.174-3.547 8.498 0 0.080 0.001 0.159 0.002 0.239l-0-0.012c-0.002 0.082-0.003 0.178-0.003 0.275 0 3.293 1.315 6.278 3.448 8.46l-0.002-0.002c2.104 2.194 5.059 3.558 8.332 3.558 0.091 0 0.181-0.001 0.271-0.003l-0.013 0c0.057 0.001 0.125 0.002 0.193 0.002 2.274 0 4.389-0.685 6.149-1.859l-0.040 0.025c0.872-0.585 1.613-1.283 2.226-2.085l0.016-0.022v2.852c0.001 0.442 0.359 0.8 0.801 0.801h0.928c0.442-0.001 0.8-0.359 0.801-0.801v-11.233c-0.001-0.442-0.359-0.8-0.801-0.8h-0z"></path>
  </g>
</svg>
`

  const targetSelector = 'ul.XvPRmQVeIoCP5lQhICTv.ofDl_1VxUG_EKc3b9E3x';
  const existingAnchorClass = 'kFFXe30DOpq5j1hbWU1q wZ4JdaHxSAhGy1HoNVja d26Geqs1C__RaCO7MUs2';

  function insertGoogleIcon(ulElement, observer) {
    observer.disconnect();

    const newListItem = document.createElement('li');

    const newAnchor = document.createElement('a');
    newAnchor.className = existingAnchorClass;
    newAnchor.innerHTML = googleGSVG;
    newAnchor.onclick = function (e) {
      e.preventDefault();
      const searchInput = document.querySelector("#search_form_input");
      if (searchInput) {
        const queryText = searchInput.value.trim();
        if (queryText.length === 0) {
          return;
        }
        const bangQuery = `!g ${queryText}`;
        const encodedQuery = encodeURIComponent(bangQuery);
        const searchURL = `https://duckduckgo.com/?q=${encodedQuery}`;
        window.location.href = searchURL;
      }
    };

    newListItem.appendChild(newAnchor);
    ulElement.insertBefore(newListItem, ulElement.firstChild);
  }

  const observer = new MutationObserver((_, observer) => {
    const ulElement = document.querySelector(targetSelector);

    if (ulElement) {
      insertGoogleIcon(ulElement, observer);
    }
  });

  const config = { childList: true, subtree: true };

  if (document.body) {
    observer.observe(document.body, config);
  } else {
    window.addEventListener('load', () => {
      if (document.body) {
        observer.observe(document.body, config);
      }
    });
  }

})();