// ==UserScript==
// @name         lop michelin nat center
// @namespace    https://natcenter.vn/lop-o-to/lop-michelin/
// @version      1.0.0
// @description  Tìm hiểu các dòng lốp nổi bật cho mọi dòng xe
// @author       NAT Dev
// @match        https://natcenter.vn/lop-o-to/lop-michelin/*
// @license      MIT
// @locale       en
// @run-at       document-end

/// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/557055/lop%20michelin%20nat%20center.user.js
// @updateURL https://update.greasyfork.org/scripts/557055/lop%20michelin%20nat%20center.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("NAT Price Highlighter đã chạy!");

    function highlightPrices() {
        $("[class*='price'], .price, .gia, .cost").css({
            "background": "#fff4c4",
            "padding": "4px 6px",
            "border-radius": "4px",
            "font-weight": "bold"
        });
    }

    $(document).ready(() => {
        highlightPrices();
    });
})();