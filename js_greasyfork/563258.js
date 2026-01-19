// ==UserScript==
// @name        ez-vault-deposit v2.0
// @namespace   seintz.torn.ez-vault-deposit
// @version     1.5
// @description double click $ to deposit all to property, company & faction vault
// @author      finally [2060206], seintz [2460991]
// @license     GNU GPLv3
// @run-at      document-end
// @match       https://www.torn.com/properties.php*
// @match       https://www.torn.com/companies.php*
// @match       https://www.torn.com/factions.php*
// @match       https://www.torn.com/trade.php*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/563258/ez-vault-deposit%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/563258/ez-vault-deposit%20v20.meta.js
// ==/UserScript==

const addHandlerSelector = ".deposit-box input[value='DEPOSIT'], .deposit button.torn-btn, #armoury-donate .cash button, .init-trade.add-money input[value='Change']";
const dollarButtonSelector = ".deposit-box .input-money-symbol, .deposit .input-money-symbol, .init-trade.add-money .input-money-symbol";
const mutationSelector = ".deposit-box .input-money-symbol, .deposit .input-money-symbol, .donate .input-money-symbol, .init-trade.add-money .input-money-symbol";
const dollarButton = document.querySelector(dollarButtonSelector);

function addHandler(button) {
    let double = 0;
    button.addEventListener("click", () => {
        if (double++ == 1) {
            double = 0;
            document.querySelector(addHandlerSelector).click();
            let confirm = document.querySelector("#armoury-donate .cash-confirm .yes");
            if (confirm) confirm.click();
        }
    });
}

if (dollarButton) addHandler(dollarButton);

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (const node of mutation.addedNodes) {
            let dollarButtonMutation = node.querySelector && node.querySelector(mutationSelector);
            if (dollarButtonMutation) addHandler(dollarButtonMutation);
        }
    });
}).observe(document.body, { childList: true, subtree: true });
