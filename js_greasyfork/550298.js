// ==UserScript==
// @name         remove checked mudae suggests
// @namespace    http://tampermonkey.net/
// @version      2025-09-22
// @description  remove checked suggests (for sos/helper)
// @author       chaiburashka
// @match        https://mudae.net/bot/suggests/all
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mudae.net
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550298/remove%20checked%20mudae%20suggests.user.js
// @updateURL https://update.greasyfork.org/scripts/550298/remove%20checked%20mudae%20suggests.meta.js
// ==/UserScript==


const html = `<div class="inline-filter"><div class="radio-group"><input id="filter-checked-all" type="radio" name="filter-checked" ` +
      `value="all" checked="checked"><label for="filter-checked-all">All</label></div><div class="radio-group"><input ` +
      `id="filter-checked-only" type="radio" name="filter-checked" value="only"><label for="filter-checked-only">` +
      `Only</label></div><div class="radio-group"><input id="filter-checked-hide" type="radio" name="filter-checked" value="hide">` +
      `<label for="filter-checked-hide">None</label></div></div>`

const mainloop = () => {
  var filtersDiv = document.querySelector("#filters-wrapper").querySelector("#filters");

  if (!filtersDiv) return;

  if (filtersDiv) {
    var checkedFilter = document.querySelector('[id="checked-filter"]');
    // only if we haven't already added the button
    if (!checkedFilter) hideChecked();
  }
}

const hideChecked = () => {
    'use strict';

    var hideShowChecked = document.createElement('div')

    hideShowChecked.innerHTML = `<div class="title">Checked:</div>${html}`;
    hideShowChecked.classList.add('filter')
    hideShowChecked.setAttribute ('id', 'checked-filter');

    document.querySelector("#filters-wrapper").querySelector("#filters").appendChild (hideShowChecked)

    const radioButtons = document.querySelectorAll('input[name="filter-checked"]');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                console.log('[checked-filter] selected value:', this.value);
                // Perform actions based on the selected value
                if (this.value === 'all') {
                    document.querySelectorAll("[data-data*='\"status\":\"checked\"']").forEach((element) => $(element).show())
                    document.querySelectorAll("[data-data*='\"status\":\"pending\"']").forEach((element) => $(element).show())
                } else if (this.value === 'hide') {
                    document.querySelectorAll("[data-data*='\"status\":\"checked\"']").forEach((element) => $(element).hide())
                    document.querySelectorAll("[data-data*='\"status\":\"pending\"']").forEach((element) => $(element).show())
                } else if (this.value === 'only') {
                    document.querySelectorAll("[data-data*='\"status\":\"checked\"']").forEach((element) => $(element).show())
                    document.querySelectorAll("[data-data*='\"status\":\"pending\"']").forEach((element) => $(element).hide())
                }
            }
        });
    });
};
setInterval(mainloop, 100);