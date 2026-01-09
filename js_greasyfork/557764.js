// ==UserScript==
// @name         装点扇贝
// @namespace    https://www.galasp.cn/
// @version      2026-01-07
// @description  改为护眼背景；仅使用两个按键完成背词，不认识点←，认识点→。
// @author       薯片
// @match        https://web.shanbay.com/wordsweb/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shanbay.com
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557764/%E8%A3%85%E7%82%B9%E6%89%87%E8%B4%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/557764/%E8%A3%85%E7%82%B9%E6%89%87%E8%B4%9D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
        div[class*="index_hint"] ~ div[class*="index_progressBox"],
        div[class*="index_hint"] ~ div[class*="index_btnBox"] {
            display: none !important;
        }
        div[class="study-page"] {
            min-height: 577.75px !important;
        }
        div[class*="Layout_page"],
        .study-page,
        .study-page > div {
            background: #fffae8 !important;
        }
        td[class*="StudySummaryItem_word"] {
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
        }
        td[class*="StudySummaryItem_word"]:hover {
            opacity: 1 !important;
        }
    `);
    let lock = false
    $(document).keydown(function (event) {
        event.stopImmediatePropagation()
        if (event.originalEvent.repeat) return
        if (lock) return
        else {
            lock = true
            setTimeout(() => {
                lock = false
            }, 100)
        }
        console.log(' 按下的键码是: ' + event.which);
        if (event.which == 37) {
            $(`span:contains("撤销")`).click()
            $(`div[class*="index_red"]`).click()
        } else if (event.which == 39) {
            if ($("table").length == 1) {
                $(`div[class*="StudyPage_nextBtn"]`).click()
            } else {
                $(`div[class*="StudyPage_nextBtn"]`).click()
                $(`div[class*="index_green"]`).click()
            }
        }
    });
})();