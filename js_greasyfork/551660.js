// ==UserScript==
// @name         OneLook Quick Click
// @namespace    onelook
// @version      0.1.1
// @description  Makes all words longer than 4 characters in the 'Usually means' section of OneLook.com clickable for quick searching.
// @match        https://www.onelook.com/?w=*
// @match        https://onelook.com/?w=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551660/OneLook%20Quick%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/551660/OneLook%20Quick%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 找到包含 "Usually means:" 的容器 div
    const inBriefDiv = document.querySelector('div.ol_inbrief');
    if (!inBriefDiv) {
        return; // 如果頁面上沒有這個區塊，就直接退出
    }

    // 找到作為標記的標題 span
    const titleSpan = inBriefDiv.querySelector('span.ol_inbrief_title');
    if (!titleSpan) {
        return; // 如果沒有標題，也退出
    }

    // 取得容器中所有的子節點 (包括文字、<a> 標籤等)
    const allNodes = Array.from(inBriefDiv.childNodes);
    // 找到標題 span 在所有子節點中的位置
    const titleIndex = allNodes.indexOf(titleSpan);

    // 從標題後面的節點開始遍歷，這樣就不會動到 "Usually means:" 本身
    for (let i = titleIndex + 1; i < allNodes.length; i++) {
        const node = allNodes[i];

        // 我們只處理純文字節點 (nodeType === 3)
        // 這樣可以完美避開已經存在的 <a> 連結或其他 HTML 元素
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {

            // 創建一個 DocumentFragment 來存放處理後的新節點，這樣可以減少對 DOM 的操作次數
            const fragment = document.createDocumentFragment();

            // 使用 split 保留分隔符 (空格、標點)，這樣可以完整重現原始文本結構
            const parts = node.textContent.split(/(\b\w+\b)/);

            parts.forEach(part => {
                // 判斷這個部分是不是一個長度大於4的單字
                if (/\b\w{5,}\b/.test(part)) {
                    const link = document.createElement('a');
                    link.href = `https://www.onelook.com/?w=${part}`;
                    link.textContent = part;

                    // 應用您期望的「不明顯」樣式
                    link.style.textDecoration = 'none';
                    link.style.color = 'inherit';
                    link.onmouseover = () => { link.style.textDecoration = 'underline'; };
                    link.onmouseout = () => { link.style.textDecoration = 'none'; };

                    fragment.appendChild(link);
                } else {
                    // 如果不是，就將原樣的文字 (空格、標點、短單字) 加回去
                    fragment.appendChild(document.createTextNode(part));
                }
            });

            // 用我們處理好的 fragment 替換掉原始的文字節點
            node.parentNode.replaceChild(fragment, node);
        }
    }
})();