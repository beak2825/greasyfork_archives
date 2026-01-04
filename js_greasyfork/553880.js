// ==UserScript==
// @name         盛趣充值中心修改_狒狒专用
// @namespace    https://greasyfork.org/zh-CN/scripts/553880
// @version      2025-10-27
// @description  修改一些奇怪的东西
// @author       ShadniW
// @match        https://pay.sdo.com/item/*
// @match        https://pay.sdo.com/cashier/pay*
// @icon         https://paystatic.sdoprofile.com/img/favicon.ico
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/553880/%E7%9B%9B%E8%B6%A3%E5%85%85%E5%80%BC%E4%B8%AD%E5%BF%83%E4%BF%AE%E6%94%B9_%E7%8B%92%E7%8B%92%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553880/%E7%9B%9B%E8%B6%A3%E5%85%85%E5%80%BC%E4%B8%AD%E5%BF%83%E4%BF%AE%E6%94%B9_%E7%8B%92%E7%8B%92%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector("input#ds_account")?.removeAttribute("disabled");

    document.querySelector('.amount .charItem[productid="1087"] .cell_radio')?.insertAdjacentHTML("beforeend", `
    <label for="ds_amount" class="form-select other_amount other_input selected">
         <input type="text" id="ds_amount" name="ds_amount" class="form-text-select del-val" placeholder="其他数量" min="100" max="3000000" checktype="iptnum">

         <span class="icon_close" style="display: none;"></span>
    </label>
    <br>
    <label class="error" style="display: inline;">请输入100-3000000的整数！</label>
    `);

    document.querySelector('.amount .charItem[productid="1083"] .cell_radio')?.insertAdjacentHTML("beforeend", `
    <label for="ds_amount" class="form-select other_amount other_input selected">
         <input type="text" id="ds_amount" name="ds_amount" class="form-text-select del-val" placeholder="其他数量" min="30" max="3000000" checktype="iptnum">

         <span class="icon_close" style="display: none;"></span>
    </label>
    <br>
    <label class="error" style="display: inline;">请输入30-3000000的整数！</label>
    `);


    setTimeout(() => {
        document.querySelector('.amount .charItem[productid="1083"] .cell_radio .other_amount')?.removeAttribute("style");

        document.querySelector('#paytab .tab_item.further_tabitem')?.click();


        let areas = document.querySelectorAll(".pp_sel.pp_sel1 div.inner .clear li a");

        if (areas.length == 8) {
            switch(GM_getValue("ffxiv_gamearea", "1")) {
                case "1":
                    areas[0].click();
                    areas[4].click();
                    break;
                case "6":
                    areas[1].click();
                    areas[5].click();
                    break;
                case "7":
                    areas[2].click();
                    areas[6].click();
                    break;
                case "8":
                    areas[3].click();
                    areas[7].click();
                    break;
            }

            document.querySelectorAll(".cell_select2 .selecttxt").forEach(span => {
                span.setAttribute("style", 'background:url(//paystatic.sdoprofile.com/img/gray_arrow.png) 215px 15px no-repeat;*background:url(//paystatic.sdoprofile.com/img/gray_arrow.png) 210px 15px no-repeat');
            });

            areas.forEach(a => {
                let areaid = a.getAttribute("areaid");
                a.addEventListener("click", () => {
                    GM_setValue("ffxiv_gamearea", areaid);
                });
            });
        }
    }, 500);
})();
