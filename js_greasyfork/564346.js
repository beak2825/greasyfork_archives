// ==UserScript==
// @name         angelicpretty
// @namespace    charismafight@hotmail.com
// @version      1.0
// @description  automatically submit basic data to order
// @author       lli
// @match        *://angelicpretty.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564346/angelicpretty.user.js
// @updateURL https://update.greasyfork.org/scripts/564346/angelicpretty.meta.js
// ==/UserScript==

function addPersistentNumberInputToTopLeft(options = {}) {
  const STORAGE_KEY = "persistent_number_input"; // 本地存储的键名
  const STORAGE_SUBMIT_DIRECTLY = "STORAGE_SUBMIT_DIRECTLY";
  const config = {
    placeholder: "input quantity",
    onInput: null,
    onBlur: null,
    ...options,
  };

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

  // 新增：创建checkbox和标签
  const checkboxWrapper = document.createElement("div");
  checkboxWrapper.style.marginTop = "8px";
  checkboxWrapper.style.display = "flex";
  checkboxWrapper.style.alignItems = "center";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "cbAutoSubmit";
  checkbox.style.marginRight = "6px";

  const checkboxLabel = document.createElement("label");
  checkboxLabel.htmlFor = "cbAutoSubmit";
  checkboxLabel.textContent = "自动提交";
  checkboxLabel.style.fontSize = "14px";
  checkboxLabel.style.color = "#333";

  checkboxWrapper.appendChild(checkbox);
  checkboxWrapper.appendChild(checkboxLabel);

  const errorMsg = document.createElement("div");
  errorMsg.style.color = "red";
  errorMsg.style.fontSize = "12px";
  errorMsg.style.marginTop = "5px";
  errorMsg.style.height = "15px";

  container.appendChild(input);
  container.appendChild(checkboxWrapper);
  container.appendChild(errorMsg);
  document.body.appendChild(container);

  // ===== 新增：从 localStorage 恢复值 =====
  const savedValue = localStorage.getItem(STORAGE_KEY);
  if (savedValue !== null) {
    input.value = savedValue;
  }
  const autoSubmit = localStorage.getItem(STORAGE_SUBMIT_DIRECTLY);
  if (autoSubmit != null) {
    checkbox.checked = autoSubmit == "true";
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

  checkbox.addEventListener("change", function () {
    localStorage.setItem(STORAGE_SUBMIT_DIRECTLY, this.checked);
  });

  return {
    input,
    clearStorage: () => localStorage.removeItem(STORAGE_KEY),
  };
}

function isCart() {
  const currentURL = window.location.href;
  const targetURL = "https://angelicpretty.com/Form/Order/CartList.aspx";
  return currentURL === targetURL;
}

function isOrderPayment() {
  const currentURL = window.location.href;
  const targetURL = "https://angelicpretty.com/Form/Order/OrderPayment.aspx";
  return currentURL === targetURL;
}

function isConfirm() {
  const currentURL = window.location.href;
  const targetURL = "https://angelicpretty.com/Form/Order/OrderConfirm.aspx";
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
    const countInputs = document.querySelectorAll('input[name*="tbProductCount"]');
    const tempValue = document.getElementById("abcdefghijk")?.value;
    countInputs.forEach((input, idx) => {
      input.value = tempValue;
    });
    const linkBtn = document.querySelector('a[href*="WebForm_DoPostBackWithOptions"]');
    linkBtn.click();
  }

  if (isOrderPayment()) {
    const confirmButton = [...document.querySelectorAll("a")].find((a) => a.textContent.includes("ご注文内容確認へ"));
    confirmButton.click();
  }

  if (isConfirm()) {
    const submitBtn = document.querySelector('[id*="lbCompleteAfterComfirmPayment"]');
    if (localStorage.getItem(STORAGE_SUBMIT_DIRECTLY, false) == "true") {
      console.log("自动提交");
      //   submitBtn.click();
    }
  }
})();
