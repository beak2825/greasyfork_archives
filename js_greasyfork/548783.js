// ==UserScript==
// @name         WX-内框滑动
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  检测商品ID变化，点击内框空白并聚焦，空格键滑动作用于内框
// @author       刚学会做蛋饼
// @license      MIT
//
// @match        https://wanx.myapp.com/aop/audit/*
//
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548783/WX-%E5%86%85%E6%A1%86%E6%BB%91%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548783/WX-%E5%86%85%E6%A1%86%E6%BB%91%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const productIdXpath = "/html/body/div[2]/div[2]/div[1]/section[2]/div[1]/div/div/div/div/div/div/div/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div[7]/div[1]/div/div[3]/div/div[2]/div/main/div/span/span[2]/span/div/span[2]";
    const blankXpath     = "/html/body/div[2]/div[2]/div[1]/section[2]/div[1]/div/div/div/div/div/div/div/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div[7]/div[1]/div/div[1]/div/div[1]/div/div";

    let lastProductId = null;

    function getByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function clickAndFocus() {
        const node = getByXpath(blankXpath);
        if(node) {
            node.setAttribute("tabindex", "-1");
            node.focus();
            node.click();
        }
    }

    function checkProduct() {
        const prodNode = getByXpath(productIdXpath);
        if(!prodNode) return;
        const id = prodNode.textContent.trim();
        if(id && id !== lastProductId) {
            lastProductId = id;
            waitForBlankNode(clickAndFocus);
        }
    }

    function waitForBlankNode(callback) {
        const interval = setInterval(() => {
            if(getByXpath(blankXpath)) {
                clearInterval(interval);
                callback();
            }
        }, 200);
    }

    const targetNode = getByXpath(productIdXpath)?.parentNode || document.body;
    new MutationObserver(checkProduct).observe(targetNode, { childList: true, subtree: true, characterData: true });

})();
