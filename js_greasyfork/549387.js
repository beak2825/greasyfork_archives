// ==UserScript==
// @name         Auto Stock Vault
// @namespace    auto_stock_vault.biscuitius
// @version      1.5
// @description  Automatically stash your cash in company stocks to fuck with buy-muggers
// @author       Biscuitius [1936433]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/549387/Auto%20Stock%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/549387/Auto%20Stock%20Vault.meta.js
// ==/UserScript==

let toggleButtonHTML =
  "<button id='auto-vault-toggle' class='torn-btn'>Enable Auto Vault</button>";

// ======================================================================================================================
// ============ stock-vault by nao [2669774] - https://update.greasyfork.org/scripts/522661/stock-vault.user.js =========

let stocks = {};
let stockId = {};

function insert() {
  let current = localStorage.stockVault;
  let symbols = [];
  if ($("ul[class^='stock_']").length == 0) {
    setTimeout(insert, 500);
    return;
  }
  $("ul[class^='stock_']").each(function () {
    let sym = $("img", $(this)).attr("src").split("logos/")[1].split(".svg")[0];
    symbols.push(sym);
    stockId[sym] = $(this).attr("id");
    stocks[sym] = $("div[class^='price_']", $(this));
  });
  symbols.sort();
  let container = `<div><select name="stock" id="stockid"><option value=""></option>`;
  for (let sy of symbols) {
    if (current && current == sy) {
      container += `<option value="${sy}" selected="selected">${sy}</option>`;
    } else {
      container += `<option value="${sy}">${sy}</option>`;
    }
  }

  container += `</select>
        <input type="try" placeholder="Amount" id="sellval" value="2000000">
        <button id="sellamt" class="torn-btn">Withdraw</button></div>
        ${toggleButtonHTML}
        <button id="vaultall" class="torn-btn">Vault</button>
        <span id="responseStock"></span>`;

  $("#stockmarketroot").prepend(container);
  $("#stockid").change(updateStock);
  $("#vaultall").on("click", vault);
  $("#sellamt").on("click", withdraw);
  $("#sellval").on("keyup", updateKMB);
}

function updateStock() {
  localStorage.stockVault = $("#stockid").attr("value");
}

function getPrice(id) {
  return parseFloat($(stocks[id]).text());
}

function vault() {
  let symb = localStorage.stockVault;
  let money = parseInt(
    document.getElementById("user-money").getAttribute("data-money")
  );
  let price = getPrice(symb);
  let amt = Math.floor(money / price);

  $.post(
    `https://www.torn.com/page.php?sid=StockMarket&step=buyShares&rfcv=${getRFC()}`,
    {
      stockId: stockId[symb],
      amount: amt,
    },
    function (response) {
      $("#responseStock").html(response.success ? "Vaulted" : "Failed");
      $("#responseStock").css("color", response.success ? "green" : "red");
    }
  );
}

function updateKMB() {
  try {
    let val = $("#sellval").attr("value");
    if (typeof val !== "string") {
      throw new Error("Invalid input");
    }
    val = val.trim().toLowerCase();

    if (
      val.endsWith(".") &&
      val.length > 1 &&
      !val.slice(0, -1).includes(".")
    ) {
      return; // Allow user to continue typing
    }

    // Parse the value based on suffix
    if (val.endsWith("k")) {
      val = val.replace("k", "") * 1000;
    } else if (val.endsWith("m")) {
      val = val.replace("m", "") * 1000000;
    } else if (val.endsWith("b")) {
      val = val.replace("b", "") * 1000000000;
    } else if (!isNaN(val) && val.length > 0) {
      val = val; // Handle numeric values directly
    } else {
      throw new Error("Invalid input format");
    }
    // Update the attribute with the parsed value
    $("#sellval").attr("value", val);
  } catch (e) {
    // Handle errors by resetting the value
    $("#sellval").attr("value", "");
    console.error("Error in updateKMB:", e.message);
  }
}

function withdraw() {
  let symb = localStorage.stockVault;
  let val = parseFloat($("#sellval").attr("value")) / 0.999;
  let price = getPrice(symb);
  let amt = Math.ceil(val / price);
  console.log(`Value: ${val}, Price: ${price}, Amount: ${amt}`);
  $.post(
    `https://www.torn.com/page.php?sid=StockMarket&step=sellShares&rfcv=${getRFC()}`,
    {
      stockId: stockId[symb],
      amount: amt,
    },
    function (response) {
      // response = JSON.parse(response);

      $("#responseStock").html(response.success ? "Withdrawn" : "Failed");
      $("#responseStock").css("color", response.success ? "green" : "red");
    }
  );
}

function getRFC() {
  var rfc = $.cookie("rfc_v");
  if (!rfc) {
    var cookies = document.cookie.split("; ");
    for (var i in cookies) {
      var cookie = cookies[i].split("=");
      if (cookie[0] == "rfc_v") {
        return cookie[1];
      }
    }
  }
  return rfc;
}

insert();

const style = `

#sellval{

  color: white;
  border: 2px solid #609b9b;
  border-radius: 10px;
  padding: 2px 25px;
  background: transparent;
  max-width: 190px;
}
#sellval:active {
  box-shadow: 2px 2px 15px #8707ff inset;
}

`;
const styleSheet = document.createElement("style");
styleSheet.textContent = style;
(document.head || document.documentElement).appendChild(styleSheet);

// ===================================================================================================
// ==== Auto Vault by Biscuitius [1936433] - https://www.torn.com/profiles.php?XID=1936433 ===========

let moneyObserver;
let checkExist = setInterval(function () {
  if (document.getElementById("auto-vault-toggle")) {
    clearInterval(checkExist);
    addToggleListener();
  }
}, 100); // Check every 100ms

function addToggleListener() {
  const toggleButton = document.getElementById("auto-vault-toggle");
  toggleButton.addEventListener("click", function () {
    const userMoneyElement = document.getElementById("user-money");
    if (userMoneyElement.hasAttribute("data-listener")) {
      console.log("Auto Vault disabled");
      toggleButton.innerText = "Enable Auto Vault";
      userMoneyElement.removeAttribute("data-listener");
      if (moneyObserver) {
        moneyObserver.disconnect();
      }
    } else {
      console.log("Auto Vault enabled");
      toggleButton.innerText = "Disable Auto Vault";
      userMoneyElement.setAttribute("data-listener", "true");
      moneyObserver = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-money"
          ) {
            let money = parseInt(userMoneyElement.getAttribute("data-money"));
            reactionTime = 160 + Math.floor(Math.random() * 80); // Random delay between 160-240ms
            if (money > 3000000) {
              setTimeout(vault, reactionTime);
            }
          }
        }
      });
      moneyObserver.observe(userMoneyElement, { attributes: true });
    }
  });
}
