// ==UserScript==
// @name         巴哈GNN新聞留言屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  依用戶ID或內容關鍵字隱藏留言 
// @author       ryan1992
// @match        https://gnn.gamer.com.tw/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548547/%E5%B7%B4%E5%93%88GNN%E6%96%B0%E8%81%9E%E7%95%99%E8%A8%80%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/548547/%E5%B7%B4%E5%93%88GNN%E6%96%B0%E8%81%9E%E7%95%99%E8%A8%80%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定要隱藏留言的用戶ID
    const targetUserIDs = [
        "userID1","userID2"
    ];

    // 設定要隱藏的留言文字關鍵字
    const targetKeywords = [
        "範例1","範例2"
    ];

    function hideTargetRows() {
        const rows = document.querySelectorAll(".dynamic-reply__row");
        rows.forEach(row => {
            let hide = false;

            // 1. 檢查用戶 href
            const aUser = row.querySelector("a.dynamic-reply-user");
            if(aUser){
                const href = aUser.href;
                for(const id of targetUserIDs){
                    if(href.includes(id)){
                        hide = true;
                        break;
                    }
                }
            }

            // 2. 檢查留言文字
            if(!hide){
                const pMsg = row.querySelector("p.dynamic-reply__msg");
                if(pMsg){
                    const text = pMsg.textContent;
                    for(const kw of targetKeywords){
                        if(text.includes(kw)){
                            hide = true;
                            break;
                        }
                    }
                }
            }

            if(hide){
                row.style.display = "none";
            }
        });
    }

    // 初次隱藏
    hideTargetRows();

    // 監控動態加載的留言
    const observer = new MutationObserver(() => {
        hideTargetRows();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
