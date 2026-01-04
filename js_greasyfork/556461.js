// ==UserScript==
// @name         Add Custom LI to Settings List
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a new LI element to the betslip settings list on localhost
// @match        https://superbet.ro/profil/bilet*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556461/Add%20Custom%20LI%20to%20Settings%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/556461/Add%20Custom%20LI%20to%20Settings%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 300);
        }
    }

    waitForElement("ul.sds-account-list.betslip-settings-list", function(list) {

        // Проверка да не бъде добавен два пъти
        if (list.innerText.includes("Biletul este vizibil public")) return;

        // Създаване на новия LI елемент
        const li = document.createElement("li");
        li.className = "sds-account-list-item";
        li.setAttribute("data-v-a4eb313a", "");
        li.setAttribute("data-v-53f9e625", "");

        li.innerHTML = `
            <div class="sds-account-list-item__content" data-v-a4eb313a>
                <span class="sds-account-list-item__text" data-v-a4eb313a>
                    Biletul este vizibil public
                </span>
            </div>
            <div class="sds-account-list-item__actions" data-v-a4eb313a>
                <button class="sds-toggle-switch sds-focus sds-toggle-switch--md"
                        role="switch" type="button" aria-checked="false"
                        data-v-07df78c5 data-v-53f9e625>
                    <div class="sds-toggle-switch__knob" data-v-07df78c5>
                        <i class="sds-icon--md sds-icon-navigation-close-small sds-icon sds-toggle-switch__icon"
                           data-v-75d7b44b data-v-07df78c5>
                        </i>
                    </div>
                </button>
            </div>
        `;

        list.appendChild(li);
    });

})();

