// ==UserScript==
// @name         ibon_select_quant
// @namespace    ibon_select_quant_cc
// @version      0.1.1
// @description  IBON：選擇張數、focus 驗證碼、填寫驗證碼
// @author       cg
// @match        https://orders.ibon.com.tw/application/*PERFORMANCE_PRICE_AREA_ID*
// @license      MIT
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547755/ibon_select_quant.user.js
// @updateURL https://update.greasyfork.org/scripts/547755/ibon_select_quant.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //param
    var quant = 1;
    var google_api_key = 'xxxxxx';
    //param end

    //tuned param
    const random_min_ms = 10;
    const random_max_ms = 100;
    //tuned param end

    //select quant
    document.querySelector("select[name='ctl00$ContentPlaceHolder1$DataGrid$ctl02$AMOUNT_DDL']").selectedIndex = quant;

    //focus on validate input
    document.querySelector("input[name='ctl00$ContentPlaceHolder1$CHK']").focus();

    //try to fill validate input
    const randNumGenerator = () => (Math.floor(Math.random() * (random_max_ms - random_min_ms + 1)) + random_min_ms);
    const waitForLib = setInterval(() => {
        if (typeof unsafeWindow.libs?.googleVisionApiWrp === 'function' &&
            typeof unsafeWindow.libs?.getBase64Img === 'function') {
            clearInterval(waitForLib);

            var base64img = unsafeWindow.libs.getBase64Img(document.querySelector("div[class='row justify-content-center']").querySelector("span").shadowRoot.querySelector("img"));
            unsafeWindow.libs.googleVisionApiWrp(google_api_key, base64img, 0).then(text => {
                console.log("Detected Text:", text);
                if (text && text.length == 4) {
                    document.querySelector("input[name='ctl00$ContentPlaceHolder1$CHK']").value = text;
                    document.querySelector("div[id='Next']").click();
                }

            });

        }
    }, randNumGenerator());
  })();