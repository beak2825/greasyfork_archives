// ==UserScript==
// @name         Подписи кораллам
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Внезапно, но подписывает кораллы
// @author       absolute-nothing
// @license      MIT; https://opensource.org/licenses/MIT
// @match        *://catwar.net/*
// @match        *://catwar.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547852/%D0%9F%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B8%20%D0%BA%D0%BE%D1%80%D0%B0%D0%BB%D0%BB%D0%B0%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/547852/%D0%9F%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B8%20%D0%BA%D0%BE%D1%80%D0%B0%D0%BB%D0%BB%D0%B0%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function loading() {
        let load = new Promise((resolve, reject) => {
            let counter = 0;
            let observer = new MutationObserver(records => {
                counter ++;
                if (counter == 27) {
                    observer.disconnect();
                    resolve(1);
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
        return load;
    }
    async function main() {
        await loading();
        const items = document.querySelectorAll(".itemInMouth");
        for (let item of items) {
            let newElement = document.createElement("div");
            newElement.style.textStroke = "2px #FFFFFF";
            newElement.style.position = "relative";
            newElement.style.marginBottom = "-30px";
            newElement.style.bottom = "30px";
            newElement.style.backgroundColor = "white";
            newElement.style.fontSize = "8pt";
            newElement.style.border = "1px solid black";
            if (item.children[0].src === "https://catwar.net/cw3/things/15158.png") {
                newElement.innerHTML = "Могущество";
                item.appendChild(newElement);
            } else if (item.children[0].src === "https://catwar.net/cw3/things/15159.png") {
                newElement.innerHTML = "Здоровье";
                item.appendChild(newElement);
            } else if (item.children[0].src === "https://catwar.net/cw3/things/15160.png") {
                newElement.innerHTML = "Активность";
                item.appendChild(newElement);
            } else if (item.children[0].src === "https://catwar.net/cw3/things/15161.png") {
                newElement.innerHTML = "Нюх";
                item.appendChild(newElement);
            } else if (item.children[0].src === "https://catwar.net/cw3/things/15162.png") {
                newElement.innerHTML = "Копание";
                item.appendChild(newElement);
            } else if (item.children[0].src === "https://catwar.net/cw3/things/15163.png") {
                newElement.innerHTML = "Плавание";
                item.appendChild(newElement);
            } else if (item.children[0].src === "https://catwar.net/cw3/things/15164.png") {
                newElement.innerHTML = "Боевые умения";
                item.appendChild(newElement);
            } else if (item.children[0].src === "https://catwar.net/cw3/things/15165.png") {
                newElement.innerHTML = "Лазание";
                item.appendChild(newElement);
            } else if (item.children[0].src === "https://catwar.net/cw3/things/15166.png") {
                newElement.innerHTML = "Зоркость";
                item.appendChild(newElement);
            }
        }
    }
    main();
})();