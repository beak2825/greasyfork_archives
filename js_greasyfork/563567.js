// ==UserScript==
// @name         Perplexity优化
// @namespace    https://zyco.uk/
// @version      2026-01-22-v3
// @description  不登录状态下，屏蔽全屏登录弹窗
// @author       zyco
// @match        https://www.perplexity.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/563567/Perplexity%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563567/Perplexity%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const container = document.body;
    const main = document.querySelector("#root");

    const mutationObserver = new MutationObserver((mutations) => {
        mutations.map(mutation => {
            Array.from(mutation.addedNodes).map(dom => {
                if(dom.dataset.type === "portal"){
                    dom.style.display = "none";
                }
            })
        });
    });

    // 遮罩比弹窗先创建
    const maskObserver = new MutationObserver((mutations) => {
        mutations.map(mutation => {
            Array.from(mutation.addedNodes).map(dom => {
                if(dom.classList.contains("bg-backdrop/70")){
                    dom.style.display = "none";
                }
            })
        });
    });

    mutationObserver.observe(container, {
        childList: true
    });
    maskObserver.observe(main, {
        childList: true
    });
})();