// ==UserScript==
// @name         显示亚马逊广告ID(自用)
// @version      1.0.1
// @author       Haer
// @description  在亚马逊后台广告活动页面显示广告ID
// @match        https://advertising.amazon.com/*
// @match        https://advertising.amazon.co.uk/*
// @match        https://advertising.amazon.de/*
// @match        https://advertising.amazon.it/*
// @match        https://advertising.amazon.fr/*
// @match        https://advertising.amazon.es/*
// @match        https://advertising.amazon.se/*
// @match        https://advertising.amazon.com.mx/*
// @match        https://advertising.amazon.co.jp/*
// @match        https://advertising.amazon.ca/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1124651
// @downloadURL https://update.greasyfork.org/scripts/557860/%E6%98%BE%E7%A4%BA%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B9%BF%E5%91%8AID%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557860/%E6%98%BE%E7%A4%BA%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B9%BF%E5%91%8AID%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processAsinElements() {
        let asinElements = document.querySelectorAll("[data-e2e-id='tableCell_cell_asin']:not(.processed)");


        asinElements.forEach(function (asinElement) {
            let rowId = asinElement.getAttribute('data-udt-row-id');

            let rowIdElement = document.createElement('p');
            rowIdElement.style.position = 'relative';
            rowIdElement.style.background = 'lightblue';
            rowIdElement.style.color = 'black';
            rowIdElement.innerHTML = '广告ID:<br>' + rowId;

            // 查找目标div元素（asinRenderer）来添加新创建的rowIdElement
            let targetDiv = asinElement.querySelector('[data-e2e-id="asinRenderer"]');
            if (targetDiv) {
                // 如果找到了目标div，将新创建的行ID元素添加到它内部
                targetDiv.appendChild(rowIdElement);
            }

            // 标记这个asinElement已经被处理过
            asinElement.classList.add('processed');

            asinElement.classList.add('processed');
        });
    }

    processAsinElements();

    var observer = new MutationObserver(processAsinElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();