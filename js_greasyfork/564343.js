// ==UserScript==
// @name         Rostelecom Injected Ads Remover
// @name:en      Rostelecom Injected Ads Remover
// @namespace    Rostelecom-AD-remover
// @version      0.2
// @description  Removes ads injected by Rostelecom on HTTP websites
// @description:en Removes ads injected by Rostelecom on HTTP websites
// @description:ru Удаляет рекламу, внедряемую Ростелекомом на HTTP-сайтах
// @author       github.com/abyss-soft
// @match        http://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564343/Rostelecom%20Injected%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/564343/Rostelecom%20Injected%20Ads%20Remover.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload = function() {
        setTimeout(()=>{
            //скрипт для удаления рекламы от Ростелеком, которые она вставляет на сайты с HTTP

            const arrayID = [
                '[id^="large-r-"]',
                '[id^="medium-r-"]',
                '[id^="txtblock-"]'
            ];
            arrayID.forEach(item =>{
                const element = document.querySelector(item);
                if(element) {
                    element.style.display="none";
                    console.log('Remove: ', element)}
            })
        },1000, this);
    };
})();