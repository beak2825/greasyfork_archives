// ==UserScript==
// @name Quick sell Steam
// @include  http*://steamcommunity.com/profiles/*/inventory*
// @include  http*://steamcommunity.com/id/*/inventory*
// @description Fast sell Steam items with the current market price
// @version 1.1.1
// @namespace https://greasyfork.org/users/6507
// @downloadURL https://update.greasyfork.org/scripts/6211/Quick%20sell%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/6211/Quick%20sell%20Steam.meta.js
// ==/UserScript==
// 
// 
// 
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

async function asyncQuerySelector(selector, win = window) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const node = win.document.querySelector(selector);
      if (node) {
        clearInterval(interval);
        resolve(node);
      }
    }, 250);
  });
}

/**
 * Disable auto-reload Steam inventory on sell as it is resetting all filters
 */
CInventory.prototype.GetCountTotalItems = function () {
  return 1001;
};

asyncQuerySelector('.item_market_action_button').then(addFastSellButton);
document.addEventListener('click', addFastSellButton);

function addFastSellButton() {
  const sellButtons = document.querySelectorAll('.item_market_action_button:not(:has(+ .fast_sell)):not(.fast_sell)');
  sellButtons.forEach((btn) => {
    const fastSellButton = btn.cloneNode(true);
    fastSellButton.classList.add('fast_sell', 'btn_darkblue_white_innerfade');
    fastSellButton.classList.remove('item_market_action_button_green');
    fastSellButton.style.marginLeft = '10px';
    fastSellButton.querySelector('.item_market_action_button_contents').innerText = 'Fast Sell';
    fastSellButton.href = '';
    fastSellButton.addEventListener('click', (event) => {
      event.preventDefault();
      fastSellCurrentItem(btn);
    });
    insertAfter(btn, fastSellButton);
  });
}

function getCurrentItemPrice() {
  const pricesDivs = [...document.querySelectorAll('.inventory_iteminfo')].filter((x) => x.style.display !== 'none');
  if (pricesDivs.length > 1 || !pricesDivs.length) {
    return null;
  }

  const [priceDiv] = pricesDivs;
  const priceText = priceDiv.querySelector('.item_market_actions').innerText;
  const PRICE_REGEX = /(\d+(?:\.|,?)\d+)/;
  const [, price] = priceText.match(PRICE_REGEX) || [];
  return price;
}

async function fastSellCurrentItem(sellButton) {
  const price = getCurrentItemPrice();
  if (!price) {
    return alert("Can't determine price");
  }

  sellButton.click();
  const priceInput = await asyncQuerySelector('#market_sell_buyercurrency_input');
  priceInput.value = price;
  priceInput.dispatchEvent(new KeyboardEvent('keyup'));
  document.querySelector('#market_sell_dialog_accept_ssa').checked = true;
  document.querySelector('#market_sell_dialog_accept').click();
  document.querySelector('#market_sell_dialog_ok').click();
}

