// ==UserScript==
// @name         WTFounty
// @namespace    http://tampermonkey.net/
// @version      V1.2
// @description  Prefill bounty money + reason
// @author       LordTaz
// @match        https://www.torn.com/bounties.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561877/WTFounty.user.js
// @updateURL https://update.greasyfork.org/scripts/561877/WTFounty.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const setNativeValue = (el, value) => {
    if (!el) return false;

    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');

    try {
      if (desc && typeof desc.set === 'function') {
        desc.set.call(el, value);
      } else {
        el.value = value;
      }

      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));

      return true;
    } catch (e) {
      return false;
    }
  };

  const run = () => {
    const params = new URLSearchParams(window.location.search);
    const moneyValue = params.get('money');
    const reasonValue = params.get('reason');

    if (!moneyValue && !reasonValue) {
      return;
    }

    let tries = 0;
    const maxTries = 60;

    const waitForInputs = () => {
      tries++;

      const moneyNodes = document.querySelectorAll('.input-money');
      const reasonNodes = document.querySelectorAll('.reason-input');
      const moneyInput = moneyNodes[0] || null;
      const reasonInput = reasonNodes[0] || null;

      if ((moneyValue && !moneyInput) || (reasonValue && !reasonInput)) {
        if (tries >= maxTries) {
          return;
        }
        setTimeout(waitForInputs, 300);
        return;
      }

      if (moneyInput && moneyValue) setNativeValue(moneyInput, moneyValue);
      if (reasonInput && reasonValue) setNativeValue(reasonInput, reasonValue);

    };

    waitForInputs();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
