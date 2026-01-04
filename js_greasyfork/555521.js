// ==UserScript==
// @name         Debug parameter adder
// @namespace    Violentmonkey Scripts
// @version      2025-11-11
// @description  Script that adds a button for adding debug parameter
// @author       Orbio World
// @match        http://hypnozio.localhost/*
// @match        http://get-hypnozio.localhost/*
// @match        https://get-hypnozio.localhost/*
// @match        http://gethappyo.localhost/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555521/Debug%20parameter%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/555521/Debug%20parameter%20adder.meta.js
// ==/UserScript==

(function () {
  'use strict';
  createButtons();
})();



function createButtons() {
  const debugText = 'Debug';
  
  const debugPanelExists = Array.from(document.querySelectorAll('span.font-semibold.text-xs')).find(element => {
    const text = element.textContent || '';
    return text.includes(debugText);
  });


  console.log(debugPanelExists);
  if (debugPanelExists) {
    return;
  }
  
  let div = document.createElement('button');
  div.style.cssText = 'position: fixed; bottom: 50px; left: 10px; z-index: 1000000; width: 100px; height: 24px;';
  div.classList.add('btn-primary');
  div.classList.add('btn');
  div.classList.add('add-debug-param');
  div.innerHTML = debugText;
  div.setAttribute('onclick', 'addDebugParam();');
  document.body.appendChild(div);
}

window.addDebugParam = async function () {
  const url = new URL(window.location.href);
  url.searchParams.set('sdi', '1');
  window.location.href = url.toString();
}