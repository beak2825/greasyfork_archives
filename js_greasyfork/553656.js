// ==UserScript==
// @name         Torn Attack Next ID Button
// @namespace    idrinkcereal.torn
// @version      1.0
// @description  Adds a button that increments the attack URL user ID and reloads the page
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553656/Torn%20Attack%20Next%20ID%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/553656/Torn%20Attack%20Next%20ID%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Create the button
  const btn = document.createElement('button');
  btn.textContent = 'Next ID';
  btn.style.position = 'fixed';
  btn.style.top = '10px';
  btn.style.right = '10px';
  btn.style.zIndex = '9999';
  btn.style.padding = '8px 12px';
  btn.style.backgroundColor = '#222';
  btn.style.color = '#fff';
  btn.style.border = '1px solid #555';
  btn.style.borderRadius = '5px';
  btn.style.cursor = 'pointer';
  btn.style.fontSize = '14px';
  btn.style.fontFamily = 'Arial, sans-serif';
  btn.title = 'Go to the next user ID';

  // Add click action
  btn.addEventListener('click', () => {
    const url = new URL(window.location.href);
    const id = parseInt(url.searchParams.get('user2ID'));
    if (!isNaN(id)) {
      const nextId = id + 1;
      url.searchParams.set('user2ID', nextId);
      window.location.href = url.toString(); // reloads with new ID
    } else {
      alert('Could not detect a valid user2ID in the URL.');
    }
  });

  // Add to page
  document.body.appendChild(btn);
})();
