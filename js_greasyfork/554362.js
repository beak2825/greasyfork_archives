// ==UserScript==
// @name         GGn Inventory Prices
// @namespace    https://gazellegames.net/
// @version      1.0
// @description  Show prices in GGn inventory
// @author       monkeys
// @license      MIT
// @match        https://gazellegames.net/user.php?*action=inventory*
// @icon         https://gazellegames.net/favicon.ico
// @homepage     https://greasyfork.org/en/scripts/554362-ggn-inventory-prices
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/554362/GGn%20Inventory%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/554362/GGn%20Inventory%20Prices.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  var coins_img = document.createElement('img');
  coins_img.src = '/static/styles/game_room/images/icons/coins.png'
  const user_id = new URLSearchParams(location.search).get("userid");
  var api_key = await GM.getValue("api_key");

  if (!api_key) {
    if (!(api_key = prompt("Please enter an API key with the 'Items' permission to use this script.")?.trim())) {
      return;
    }
    GM.setValue("api_key", api_key);
  }

  const url = `https://gazellegames.net/api.php?request=items&type=inventory&include_info=true&userid=${user_id}`;
  const options = {
    method: "GET",
    mode: "same-origin",
    credentials: "omit",
    redirect: "error",
    referrerPolicy: "no-referrer",
    headers: {
      "X-API-Key": api_key
    }
  };
  var inventory = await (await fetch(url, options)).json();
  if (inventory.status !== "success") {
    if (inventory.status === 401) {
      GM.deleteValue("api_key");
    }
    return;
  }
  for (const item_obj of inventory.response) {
    var item = item_obj.item;
    var amount_elm = document.getElementById (`amount_${item.id}`);
    if (!amount_elm) { continue; }
    var costs_elm = document.createElement('p');
    costs_elm.innerText = `Cost: ${Number(item.gold).toLocaleString()}, Total Value: ${(item.gold * item_obj.amount).toLocaleString()}`;
    // TODO: Can't get this coins img to actually show up
    // costs_elm.appendChild(coins_img);

    var shop_elm = document.createElement('p');
    shop_elm.innerText = `${item.infStock ? 'In' : 'Not in'} shop`;
    amount_elm.parentNode.insertBefore(shop_elm, amount_elm.nextSibling);
    amount_elm.parentNode.insertBefore(costs_elm, amount_elm.nextSibling);
  }
})();
