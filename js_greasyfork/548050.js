// ==UserScript==
// @name         tixcraft_select_quant
// @namespace    tixcraft_select_quant_cc
// @version      0.1.2
// @description  拓元售票：自動選票數、自動勾同意、自動 focus 在輸入驗證碼、自動填入會員或信用卡驗證碼、輸入驗證碼
// @author       cc
// @match        https://ticket-training.onrender.com/*
// @match        https://tixcraft.com/ticket/verify/*
// @match        https://tixcraft.com/ticket/ticket/*
// @grant        unsafeWindow
// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/548050/tixcraft_select_quant.user.js
// @updateURL https://update.greasyfork.org/scripts/548050/tixcraft_select_quant.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //param
  // 會員或信用卡驗證都是填這個 memberId
  const memberId = '548368';
  const preferCount = "2";
  const google_api_key = 'xxxxxxxx';
  //param end

  //tuned param
  const random_min_ms = 100;
  const random_max_ms = 500;
  //tuned param end

  const checkbox = document.querySelector('#TicketForm_agree');
  if (checkbox) {
    checkbox.checked = true;
  }

  const member = document.querySelector('#form-ticket-verify > div.col-md-12.col-xs-12.text-center.py-3.promo-box > input');
  if (member) {
    member.value = memberId;
    const button = document.querySelector('#form-ticket-verify > div.col-md-12.col-xs-12.text-center.pt-2 > button');
    if (button) {
        button.click();
    }
  }

  const select = document.querySelector('[id^="TicketForm_ticketPrice_"]');
  if (select) {
    select.value = preferCount;
    select.dispatchEvent(new Event('change'));
  }

  const verifycode = document.querySelector('#TicketForm_verifyCode');
  if (verifycode) {
    verifycode.focus();
  }

  const checkboxTrain = document.querySelector('#terms-checkbox');
  if (checkboxTrain) {
    checkboxTrain.checked = true;
  }

  const memberTrain = document.querySelector('#form-ticket-verify > div.col-md-12.col-xs-12.text-center.py-3.promo-box > input');
  if (memberTrain) {
    memberTrain.value = memberId;
    const buttonTrain = document.querySelector('#form-ticket-verify > div.col-md-12.col-xs-12.text-center.pt-2 > button');
    if (buttonTrain) {
        buttonTrain.click();
    }
  }

  const selectTrain = document.querySelector('.quantity-select');
  if (selectTrain) {
    selectTrain.value = preferCount;
    selectTrain.dispatchEvent(new Event('change'));
  }

  const verifycodeTrain = document.querySelector('#TicketForm_verifyCode');
  if (verifycodeTrain) {
    verifycodeTrain.focus();
  }

  //try to fill validate input
  const randNumGenerator = () => (Math.floor(Math.random() * (random_max_ms - random_min_ms + 1)) + random_min_ms);
  const waitForLib = setInterval(() => {
      if (typeof unsafeWindow.libs?.googleVisionApiWrp === 'function' &&
          typeof unsafeWindow.libs?.getBase64Img === 'function') {
          clearInterval(waitForLib);

          var base64img = unsafeWindow.libs.getBase64Img(document.querySelector("img[id='TicketForm_verifyCode-image']"));
          unsafeWindow.libs.googleVisionApiWrp(google_api_key, base64img, 1).then(result => {
              var text = result.text;
              console.log("Detected Text:[", text, "]");
              if (text && text.length == 4 && result.confidence > 0.8) {
                  verifycodeTrain.value = text;
                  document.querySelector("button[type='submit']").click();
              }

          });

      }
  }, randNumGenerator());



})();
