// ==UserScript==
// @name         Wnacg Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 wnacg 網頁上新增一個按鈕來複製標籤或搜索內容，並新增一個搜尋框
// @license MIT
// @author       scbmark
// @icon         https://wnacg.com/favicon.ico
// @match        https://wnacg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553717/Wnacg%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/553717/Wnacg%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addSearchBox() {
        const searchBox = document.createElement('div');
        searchBox.id = 'q-input';
        searchBox.className = 'input-append';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '搜索...';

        const button = document.createElement('button');
        button.textContent = '搜尋';
        button.onclick = function () {
            const searchTerm = input.value;
            window.location.href = `https://wnacg.com/search?q=${encodeURIComponent(searchTerm)}`;
        };

        searchBox.appendChild(input);
        searchBox.appendChild(button);

        const tabs = document.getElementById('tabs');
        if (tabs) {
            tabs.insertAdjacentElement('afterend', searchBox);
        }

        const loginElement = document.getElementById('settings_person');
        if (loginElement) {
            loginElement.remove()
        }
    }

    function addCopyTitleButton() {
        let bread = document.querySelector("div.png");
        if (bread) {
            let bread_text = (bread.innerHTML);
            if (bread_text.includes("標籤：") || bread_text.includes("搜索：")) {
                let tags_name = bread.innerHTML.split("：")[1].trim()
                var button = document.createElement("button");
                button.innerHTML = `複製${tags_name}`;
                button.addEventListener('click', () => {
                    navigator.clipboard.writeText(tags_name).then(() => {
                        button.innerHTML = '複製成功';
                        setTimeout(() => {
                            button.innerHTML = `複製${tags_name}`;
                        }, 3000);
                    }).catch(err => {
                        console.error('無法複製到剪貼簿', err);
                    });
                });
                bread.appendChild(button)
            }
        }
    }

    window.addEventListener('load', addSearchBox);
    window.addEventListener('load', addCopyTitleButton);

})();
