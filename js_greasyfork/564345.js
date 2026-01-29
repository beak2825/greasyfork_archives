// ==UserScript==
// @name         jp kawai
// @namespace    charismafight@hotmail.com
// @version      1.0
// @description  automatically submit basic data to order
// @author       lli
// @match        *://www.tokyokawaiilife.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564345/jp%20kawai.user.js
// @updateURL https://update.greasyfork.org/scripts/564345/jp%20kawai.meta.js
// ==/UserScript==

function addPersistentNumberInputToTopLeft(options = {}) {
  const STORAGE_KEY = "persistent_number_input"; // 本地存储的键名
  const config = {
    placeholder: "input quantity",
    onInput: null,
    onBlur: null,
    ...options,
  };

  // 创建容器和输入框（同之前）
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "10px";
  container.style.left = "10px";
  container.style.zIndex = "9999";
  container.style.backgroundColor = "white";
  container.style.padding = "10px";
  container.style.borderRadius = "4px";
  container.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";

  const input = document.createElement("input");
  input.id = "abcdefghijk";
  input.type = "number";
  input.placeholder = config.placeholder;
  input.style.padding = "8px";
  input.style.border = "1px solid #ccc";
  input.style.borderRadius = "4px";
  input.style.fontSize = "14px";

  const errorMsg = document.createElement("div");
  errorMsg.style.color = "red";
  errorMsg.style.fontSize = "12px";
  errorMsg.style.marginTop = "5px";
  errorMsg.style.height = "15px";

  container.appendChild(input);
  container.appendChild(errorMsg);
  document.body.appendChild(container);

  // ===== 新增：从 localStorage 恢复值 =====
  const savedValue = localStorage.getItem(STORAGE_KEY);
  if (savedValue !== null) {
    input.value = savedValue;
  }

  // 事件监听
  input.addEventListener("input", function () {
    const value = this.value;
    errorMsg.textContent = "";

    // 实时保存到 localStorage
    localStorage.setItem(STORAGE_KEY, value);

    if (typeof config.onInput === "function") {
      config.onInput(value);
    }
  });

  input.addEventListener("blur", function () {
    const value = this.value;
    if (value && !/^\d+$/.test(value)) {
      errorMsg.textContent = "请输入有效的整数！";
      this.value = "";
      localStorage.removeItem(STORAGE_KEY); // 清除无效值
    } else if (typeof config.onBlur === "function") {
      config.onBlur(value);
    }
  });

  return {
    input,
    clearStorage: () => localStorage.removeItem(STORAGE_KEY),
  };
}

function isCart() {
  const currentURL = window.location.href;
  const targetURL = "https://www.tokyokawaiilife.jp/fs/lizlisaadmin/ShoppingCart.html";
  return currentURL === targetURL;
}

function isOrderPayment() {
  const currentURL = window.location.href;
  const targetURL = "https://www.tokyokawaiilife.jp/fs/lizlisaadmin/DeliveryEdit.html";
  return currentURL === targetURL;
}

function isConfirm() {
  const currentURL = window.location.href;
  const targetURL = "https://www.tokyokawaiilife.jp/fs/lizlisaadmin/SettleEdit.html";
  return currentURL === targetURL;
}

function blockThreadForSeconds(seconds) {
  const startTime = Date.now();
  while (Date.now() - startTime < seconds * 1000) {}
}

(function () {
  "use strict";
  addPersistentNumberInputToTopLeft();
  const testName = "カートに入れる";
  document.addEventListener("click", (e) => {
    if (e.target.matches(`input[alt="${testName}"]`)) {
      console.log("input was clicked");
    }
  });

  if (isCart()) {
    const countInput = document.getElementById("count");
    const tempValue = document.getElementById("abcdefghijk")?.value;
    console.log(`countInput.value:${countInput.value}  tempValue:${tempValue} `);
    if (countInput.value != tempValue) {
      countInput.value = tempValue;
      document.getElementById("submit_1")?.click();
      console.log("calc clicked");
    } else {
      document.getElementById("buy_here").click();
      console.log("buy_here clicked");
    }
  }

  if (isOrderPayment()) {
    document.getElementById("settleEdit").click();
    console.log("settleEdit clicked");
  }

  if (isConfirm()) {
    document.getElementById("fs2_settle-cod").click();
    console.log("fs2_settle-cod clicked");
    document.getElementById("submit").click();
    console.log("submit clicked");
  }
})();
