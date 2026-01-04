// ==UserScript==
// @name         🥩 Auto-Buy Sushi Meal (One-Click)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Click button to auto-buy 10 Sushi meals in one go
// @match        *://*/World/Popmundo.aspx/Character/ShoppingAssistant
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560874/%F0%9F%A5%A9%20Auto-Buy%20Sushi%20Meal%20%28One-Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560874/%F0%9F%A5%A9%20Auto-Buy%20Sushi%20Meal%20%28One-Click%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = "autoBuyMealBtn";

    function waitFor(selector, conditionFn, callback, timeout = 10000) {
        const start = Date.now();
        const check = () => {
            const el = document.querySelector(selector);
            if (el && conditionFn(el)) return callback(el);
            if (Date.now() - start > timeout) return;
            setTimeout(check, 200);
        };
        check();
    }

    function insertButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const button = document.createElement("div");
        button.id = BUTTON_ID;
        button.textContent = "🥩";
        button.title = "Buy Sushi Meal";
        button.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #fffaf0;
            border: 2px solid rgb(245,25,25);
            border-radius: 50%;
            font-size: 24px;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 8px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(button);

        button.onclick = () => runFlow();
    }

    function runFlow() {
        // Step 1: Select category "Meals"
        const categorySelect = document.getElementById("ctl00_cphLeftColumn_ctl00_ddlShopItemCategories");
        if (!categorySelect) return;
        categorySelect.value = "72"; // Meals
        if (typeof categorySelect.onchange === "function") {
            categorySelect.onchange();
        } else if (typeof __doPostBack === "function") {
            __doPostBack("ctl00$cphLeftColumn$ctl00$ddlShopItemCategories", "");
        }

        // Step 2: Wait for type dropdown, select "Meal"
        waitFor(
            "#ctl00_cphLeftColumn_ctl00_ddlShopItemTypes",
            el => el.options.length > 1,
            typeSelect => {
                typeSelect.value = "1185"; // Meal
                if (typeof typeSelect.onchange === "function") {
                    typeSelect.onchange();
                } else if (typeof __doPostBack === "function") {
                    __doPostBack("ctl00$cphLeftColumn$ctl00$ddlShopItemTypes", "");
                }

                // Step 3: Wait for recipe dropdown, select "Sushi"
                waitFor(
                    "#ctl00_cphLeftColumn_ctl00_ddlShopItemRecipeTypes",
                    el => el.options.length > 1,
                    recipeSelect => {
                        recipeSelect.value = "325"; // Sushi
                        if (typeof recipeSelect.onchange === "function") {
                            recipeSelect.onchange();
                        } else if (typeof __doPostBack === "function") {
                            __doPostBack("ctl00$cphLeftColumn$ctl00$ddlShopItemRecipeTypes", "");
                        }

                        // Step 4: Wait for amount input, set to 10 and click Buy
                        waitFor(
                            "#ctl00_cphLeftColumn_ctl00_repShopItemTypes_ctl01_txtAmount",
                            el => true,
                            amountInput => {
                                amountInput.value = "10";
                                const buyButton = document.getElementById("ctl00_cphLeftColumn_ctl00_repShopItemTypes_ctl01_btnBuyItem");
                                if (buyButton) buyButton.click();

                                // Optional: redirect back to character page
                                setTimeout(() => {
                                    window.location.href = location.origin + "/World/Popmundo.aspx/Character";
                                }, 1500);
                            }
                        );
                    }
                );
            }
        );
    }

    // Inject button once DOM is ready
    const observer = new MutationObserver(() => insertButton());
    observer.observe(document.body, { childList: true, subtree: true });
    insertButton();
})();
