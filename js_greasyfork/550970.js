// ==UserScript==
// @name         Yahoo!News 自動合併多頁
// @namespace    yahoo-news-merger
// @author       gpt5
// @version      2.0
// @description  自動讀取並合併 Yahoo! News 文章
// @match        https://news.yahoo.co.jp/articles/*
// @exclude      https://news.yahoo.co.jp/articles/*/comments*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550970/Yahoo%21News%20%E8%87%AA%E5%8B%95%E5%90%88%E4%BD%B5%E5%A4%9A%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/550970/Yahoo%21News%20%E8%87%AA%E5%8B%95%E5%90%88%E4%BD%B5%E5%A4%9A%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待主文區塊載入
    function waitForArticleBody(callback) {
        const check = () => {
            // 嘗試多種常見 selector
            let body = document.querySelector('[data-ylk*="art_main"]') ||
                       document.querySelector('.sc-iBPTik.jViSDk') ||
                       document.querySelector('.article_body');
            if (body) {
                callback(body);
            } else {
                setTimeout(check, 300);
            }
        };
        check();
    }

    // 自動逐頁加載（最多到5頁）
    function fetchAndAppendPages(mainBody) {
        // 解析目前網址與 base
        const baseUrl = location.href.replace(/(\?|&)page=\d+/, '').replace(/#.*$/, '');
        let page = 2;
        const maxPage = 5;
        const insertDivider = () => {
            let hr = document.createElement('hr');
            hr.style.margin = "2em 0";
            mainBody.appendChild(hr);
        };

        function fetchNextPage() {
            if (page > maxPage) return;

            const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`;
            fetch(url)
                .then(resp => resp.text())
                .then(htmlText => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(htmlText, "text/html");
                    let pageBody = doc.querySelector('[data-ylk*="art_main"]') ||
                                   doc.querySelector('.sc-iBPTik.jViSDk') ||
                                   doc.querySelector('.article_body');
                    // 若該頁無內容可能提前終止
                    if (pageBody && pageBody.textContent.trim().length > 30) {
                        insertDivider();
                        Array.from(pageBody.childNodes).forEach(node => {
                            mainBody.appendChild(node.cloneNode(true));
                        });
                        page++;
                        fetchNextPage(); // 遞迴去抓下一頁
                    }
                })
                .catch(()=>{}); // 安靜處理失敗
        }
        fetchNextPage();
    }

    waitForArticleBody(mainBody => {
        fetchAndAppendPages(mainBody);
    });
})();
