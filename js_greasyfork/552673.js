// ==UserScript==
// @name         移除 Google 搜尋的 AI 模式
// @name:en      Remove Google Search AI Mode
// @name:zh-TW   移除 Google 搜尋的 AI 模式
// @name:zh-CN   移除 Google 搜索的 AI 模式
// @name:ja      Google検索のAIモードを削除
// @name:ko      Google 검색 AI 모드 제거
// @version      1.3
// @description  移除 Google 搜尋結果中的 AI 模式
// @description:en Remove AI Mode from Google Search results
// @description:zh-TW 移除 Google 搜尋結果中的 AI 模式
// @description:zh-CN 移除 Google 搜索结果中的 AI 模式
// @description:ja Google検索結果からAIモードを削除
// @description:ko Google 검색 결과에서 AI 모드 제거
// @author       movwei
// @license      MIT
// @match        https://www.google.com/*
// @match        https://www.google.com/search*
// @match        https://www.google.*/search*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1041101
// @downloadURL https://update.greasyfork.org/scripts/552673/%E7%A7%BB%E9%99%A4%20Google%20%E6%90%9C%E5%B0%8B%E7%9A%84%20AI%20%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/552673/%E7%A7%BB%E9%99%A4%20Google%20%E6%90%9C%E5%B0%8B%E7%9A%84%20AI%20%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const baseStyle = document.createElement('style');
    baseStyle.id = 'ai-remover-base';
    baseStyle.textContent = `
        div[jsname="xBNgKe"][role="listitem"] {
            display: none !important;
        }
        button.plR5qb[jsname="B6rgad"],
        button[jsname="B6rgad"][role="link"].plR5qb {
            display: none !important;
        }
        div#Odp5De {
            display: none !important;
        }
        .YzCcne {
            display: none !important;
        }
    `;

    const conditionalStyle = document.createElement('style');
    conditionalStyle.id = 'ai-remover-conditional';

    let hasAppliedConditionalStyle = false;
    let observerInstance = null;
    let checkTimeout = null;

    function insertBaseStyle() {
        if (document.head) {
            document.head.appendChild(baseStyle);
            checkAndApplyConditionalStyle();
        } else {
            const observer = new MutationObserver(function() {
                if (document.head) {
                    document.head.appendChild(baseStyle);
                    checkAndApplyConditionalStyle();
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    function checkAndApplyConditionalStyle() {

        const debouncedCheck = () => {
            if (checkTimeout) {
                clearTimeout(checkTimeout);
            }

            checkTimeout = setTimeout(() => {
                const odp5DeElement = document.querySelector('div#Odp5De');

                if (odp5DeElement && !hasAppliedConditionalStyle) {
                    conditionalStyle.textContent = `
                        .QRYxYe.QRYxYe {
                            margin-top: 22px !important;
                        }
                    `;
                    if (!document.head.contains(conditionalStyle)) {
                        document.head.appendChild(conditionalStyle);
                    }
                    hasAppliedConditionalStyle = true;

                    if (observerInstance) {
                        observerInstance.disconnect();
                        observerInstance = null;
                    }
                } else if (!odp5DeElement && hasAppliedConditionalStyle) {
                    conditionalStyle.textContent = '';
                    hasAppliedConditionalStyle = false;
                }
            }, 300);
        };

        debouncedCheck();

        if (!hasAppliedConditionalStyle) {
            observerInstance = new MutationObserver(debouncedCheck);

            const targetNode = document.body || document.documentElement;
            observerInstance.observe(targetNode, {
                childList: true,
                subtree: false,
                attributes: false
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', debouncedCheck);
        }
        window.addEventListener('load', debouncedCheck);
    }

    insertBaseStyle();
})();