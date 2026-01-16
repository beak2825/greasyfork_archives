// ==UserScript==
// @name         DMA - Bazaar pricer
// @namespace    http://tampermonkey.net/
// @version      2025-08-27
// @description  Sets Bazaar Price
// @author       DMA
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562802/DMA%20-%20Bazaar%20pricer.user.js
// @updateURL https://update.greasyfork.org/scripts/562802/DMA%20-%20Bazaar%20pricer.meta.js
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(`
        .dma_red {
            color: #c55021 !important;
       }

        .dma_green {
            color: green !important;
        }

        .dma_button {
            display: block;
            height: 24px;
            color: rgb(153, 153, 153);
            cursor: pointer;
            font-family: Arial;
            font-size: 12px;
            line-height: 24px;
            border-radius: 5px
        }

        .dma_button:hover {
            color: #ccc;
            background-color: rgb(153, 153, 153);
        }
    `);

  const hash = window.location.hash;

  if (hash === "#/add") addButtons();

  window.addEventListener("hashchange", function () {
    const hash = window.location.hash;

    if (hash === "#/add") addButtons();
  });
})();

function handleFillButton(balance = 0) {
  let listItems = document.querySelectorAll('[data-group="child"]');

  listItems.forEach((item) => {
    let originalQty = item.querySelector(".name-wrap").textContent;
    let qty = originalQty?.match(/[\d]+/)?.[0] || 1;
    qty = qty - balance;
    qty = qty >= 0 ? qty : 0;

    let price = item.querySelector(".info-main-wrap").textContent;
    price = price.match(/[\d,]+/)[0].replaceAll(",", "");
    price = Math.round(price * 0.995);

    const priceMap = {
      Kitten: 825,
      Sheep: 699,
      Teddy: 699,
    };

    if (originalQty.includes("Kitten")) price = priceMap["Kitten"];

    if (originalQty.includes("Sheep")) price = priceMap["Sheep"];

    if (originalQty.includes("Teddy")) price = priceMap["Teddy"];

    const moneyInput = item.querySelector(".input-money");
    const amount = item.querySelector('[name="amount"]');

    moneyInput.value = price;
    amount.value = qty;

    const inputEvent = new Event("input", { bubbles: true });
    moneyInput.dispatchEvent(inputEvent);
    amount.dispatchEvent(inputEvent);
  });
}

function setLocalStorageCategory(category) {
  console.Info("********Category API Call ********");

  GM_xmlhttpRequest({
    method: "GET", // or "POST", "PUT", "DELETE", etc.
    url: `${baseUrl}${endpoint}?cat=${category}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `ApiKey ${key}`,
    },

    onload: function (response) {
      if (response.status >= 200 && response.status < 300) {
        console.info(`API call successful: for ${category}`);
        // Process the API response data here
        const data = JSON.parse(response.responseText);
        const { items: categoryItems } = data;
        masterItems = categoryItems;
        localStorage.setItem("masterItems", JSON.stringify(categoryItems));
      } else {
        console.error("API call failed:", response.status, response.statusText);
      }
    },
    onerror: function (response) {
      console.error("Error during API call:", response.error);
    },
  });
}

function addButtons() {
  setTimeout(() => {
    const buttonBar = document.querySelector('[class^="linksContainer___"]');

    const checkForFillButton = document.querySelector("#fillButton");

    if (!checkForFillButton) {
      const fillButton = document.createElement("button");
      fillButton.id = "fillButton";
      fillButton.classList.add("dma_button");
      fillButton.textContent = "Fill";
      buttonBar.prepend(fillButton);

      fillButton.addEventListener("click", () => {
        handleFillButton();
      });
    }

    const checkForFillButtonLessFifty =
      document.querySelector("#fillButtonLess50");

    if (!checkForFillButtonLessFifty) {
      const fillButtonLessFifty = document.createElement("button");
      fillButtonLessFifty.id = "fillButtonLess50";
      fillButtonLessFifty.classList.add("dma_button");
      fillButtonLessFifty.textContent = "Fill-50";
      buttonBar.prepend(fillButtonLessFifty);

      fillButtonLessFifty.addEventListener("click", () => {
        handleFillButton(50);
      });
    }

    const checkForFillButtonLessHundred =
      document.querySelector("#fillButtonLess100");

    if (!checkForFillButtonLessHundred) {
      const fillButtonLessHundred = document.createElement("button");
      fillButtonLessHundred.id = "fillButtonLess100";
      fillButtonLessHundred.classList.add("dma_button");
      fillButtonLessHundred.textContent = "Fill-100";
      buttonBar.prepend(fillButtonLessHundred);

      fillButtonLessHundred.addEventListener("click", () => {
        handleFillButton(100);
      });
    }
  }, 500);
}
