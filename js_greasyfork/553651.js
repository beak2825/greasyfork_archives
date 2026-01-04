// ==UserScript==
// @name         SG Region lock assistant
// @namespace    sg-helpers
// @version      2025-08-25
// @description  Script that helps you with region locks when creating gifts in steamgifts
// @author       You
// @match        https://www.steamgifts.com/giveaways/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamgifts.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553651/SG%20Region%20lock%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/553651/SG%20Region%20lock%20assistant.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const ALL_CODES = [ "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BR", "BQ", "IO", "VG",
   "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE",
   "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM",
   "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD",
   "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RE",
   "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY",
   "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UM", "VI", "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VA", "VE", "VN", "WF", "YE", "ZM", "ZW"]

  const COUNTRY_LIST_SELECTOR = '.form_list[data-input="country_item_string"]';

  window.addEventListener('load', () => {
    const nav = document.querySelector('.form_list_navigation');
    if (!nav) {
      console.error('Could not find .form_list_navigation');
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.style.margin = '1em 0';

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Enter country codes, e.g. AF,NL,AS,AD';
    textarea.style.width = '100%';
    textarea.style.height = '50px';
    textarea.style.display = 'block';
    textarea.style.marginBottom = '0.5em';

    // === New toggle ===
    const toggle = document.createElement('div');
    toggle.className = 'esgst-button form__submit-button';
    toggle.innerHTML = '<i class="fa fa-exchange"></i> Mode: INCLUDE';
    toggle.style.cursor = 'pointer';
    toggle.style.display = 'inline-block';
    toggle.style.marginRight = '1em';

    let mode = 'include'; // or 'exclude'

    toggle.addEventListener('click', () => {
      mode = mode === 'include' ? 'exclude' : 'include';
      toggle.innerHTML = `<i class="fa fa-exchange"></i> Mode: ${mode.toUpperCase()}`;
    });

    const sendButton = document.createElement('div');
    sendButton.className = 'esgst-button form__submit-button';
    sendButton.innerHTML = '<i class="fa fa-check-circle"></i> Send';
    sendButton.style.cursor = 'pointer';
    sendButton.style.display = 'inline-block';

    const counter = document.createElement('div');
    counter.style.marginTop = '0.5em';
    counter.style.fontWeight = 'bold';
    counter.textContent = 'Selected: 0';

    wrapper.appendChild(textarea);
    wrapper.appendChild(toggle);
    wrapper.appendChild(sendButton);
    wrapper.appendChild(counter);
    nav.parentNode.insertBefore(wrapper, nav.nextSibling);

    sendButton.addEventListener('click', (event) => {
      event.preventDefault();

      // First ensure region lock YES is selected
      const regionLockYes = Array.from(document.querySelectorAll('.form__checkbox'))
        .find(checkbox => checkbox.textContent.includes('Yes'));

      if (regionLockYes && !regionLockYes.checked) {
        regionLockYes.click();
      }

      const input = textarea.value.trim();
      const selectNoneBtn = document.querySelector('[data-form-list-action="select_none"]');

      if (!input) {
        if (selectNoneBtn) {
          selectNoneBtn.click();
        } else {
          console.warn('Could not find [data-form-list-action="select_none"]');
        }
        return;
      }

      const inputCodes = input.split(' ').map(c => c.trim()).filter(Boolean);

      // Build ALL_CODES from the list
      const countryList = document.querySelector(COUNTRY_LIST_SELECTOR);
      if (!countryList) {
        console.error('Could not find country list');
        return;
      }

      const ALL_CODES = Array.from(countryList.querySelectorAll('.form_list_item'))
        .map(item => {
          const dataName = item.getAttribute('data-name');
          return dataName ? dataName.split(' ').pop() : null;
        })
        .filter(Boolean);

      let targetCodes;
      if (mode === 'include') {
        targetCodes = inputCodes;
      } else {
        // Exclude mode
        targetCodes = ALL_CODES.filter(code => !inputCodes.includes(code));
      }

      if (selectNoneBtn) {
        selectNoneBtn.click();
      } else {
        console.warn('Could not find [data-form-list-action="select_none"]');
      }

      setTimeout(() => {
        countryList.querySelectorAll('.form_list_item').forEach(item => {
          const dataName = item.getAttribute('data-name');
          if (dataName) {
            const countryCode = dataName.split(' ').pop();
            const isTarget = targetCodes.includes(countryCode);
            const isSelected = item.classList.contains('is-selected');

            if (isTarget && !isSelected) {
              item.click();
            }
          }
        });
      }, 100);
    });

    const countryList = document.querySelector(COUNTRY_LIST_SELECTOR);
    if (!countryList) {
      console.error('Could not find country list');
      return;
    }

    const observer = new MutationObserver(() => {
      const selectedCount = countryList.querySelectorAll('.form_list_item.is-selected').length;
      counter.textContent = `Selected regions where the game CAN be activated: ${selectedCount}`;
    });

    observer.observe(countryList, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    const initialCount = countryList.querySelectorAll('.form_list_item.is-selected').length;
    counter.textContent = `Selected regions where the game CAN be activated: ${initialCount}`;
  });
})();