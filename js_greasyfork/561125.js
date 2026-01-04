// ==UserScript==
// @name         少数派优化
// @namespace    https://zyco.uk/
// @version      2026-01-02-v2
// @description  优化少数派首页文章跳转方式，由原本点击链接新开标签页，修改为在屏幕右侧新开窗口，且所有链接跳转都复用同一窗口。
// @author       zyco
// @match        https://sspai.com/*
// @icon         https://cdn-static.sspai.com/favicon/sspai.ico
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/561125/%E5%B0%91%E6%95%B0%E6%B4%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561125/%E5%B0%91%E6%95%B0%E6%B4%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.singlePaiWindow = null;
    const optimize = ()=>{
        const article = document.querySelectorAll(".articleCard");
        Array.from(article).map(i=>{
            i.outerHTML = i.outerHTML;
        });
        const alink = document.querySelectorAll("a");
        Array.from(alink).map(i=>{
            i.setAttribute("target","singlePaiWindow");
            i.addEventListener("click",(event) => {
                if(!!window.singlePaiWindow){
                    if(window.singlePaiWindow.closed){
                        openWindow(i.href);
                    }else{
                        resumeWindow(i.href);
                    }
                }else{
                    openWindow(i.href);
                }
                event.preventDefault();
            },false);
        });
        // 因少数派动态修改img的src，导致outerHTML后部分图片未加载
        const cardImg = document.querySelectorAll(".card_img");
        Array.from(cardImg).map(i=>{
            const dataSrc = i.getAttribute("data-src");
            i.setAttribute("src",dataSrc);
        });
    };

    const openWindow = (url)=>{
        const width = window.screen.width * 0.6;
        window.singlePaiWindow=window.open(url,"singlePaiWindow",`popup=1,left=999999,top=0,width=${width},height=999999`);
    }
    const resumeWindow = (url)=>{
        window.singlePaiWindow.location.href=url;
        window.singlePaiWindow.focus();
    }

    (function(open) {
        XMLHttpRequest.prototype.open = function(m, u, a, us, p) {
            this.addEventListener('readystatechange', function() {
                if(this.readyState === XMLHttpRequest.DONE && this.responseURL.includes("page/get")){
                    setTimeout(optimize,500);
                }
            }, false);
            open.call(this, m, u, a, us, p);
        }
    })(XMLHttpRequest.prototype.open);

})();