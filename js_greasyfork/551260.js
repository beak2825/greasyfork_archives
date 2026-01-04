// ==UserScript==
// @name         X.com 分享連結轉換 (FX/VX Twitter)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  FINAL-AutoCopy: 透過模擬原生複製功能獲取 URL，並自動將轉換後的連結寫入剪貼簿。
// @author       Customized for User
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://pbs.twimg.com/media/GGmfzX_bUAAUUFw?format=png
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551260/Xcom%20%E5%88%86%E4%BA%AB%E9%80%A3%E7%B5%90%E8%BD%89%E6%8F%9B%20%28FXVX%20Twitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551260/Xcom%20%E5%88%86%E4%BA%AB%E9%80%A3%E7%B5%90%E8%BD%89%E6%8F%9B%20%28FXVX%20Twitter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const POTENTIAL_ITEM_SELECTOR = 'div[role="menuitem"]';
    const MENU_CONTAINER_SELECTOR = 'div[role="menu"]';
    const TARGET_TEXT = '複製連結';
    const PROCESSED_ATTR = 'data-fxvx-processed';

    /**
     * 創建新的選單項 DOM 元素 (保持不變)
     */
    function createMenuItem(text, service, originalItem) {
        const newItem = originalItem.cloneNode(true);
        newItem.classList.add('fx-vx-share-item');
        newItem.setAttribute('data-service', service);

        const textSpan = newItem.querySelector('span');
        if (textSpan) {
            textSpan.textContent = text;
        }

        newItem.removeAttribute('tabindex');

        return newItem;
    }

    /**
     * 處理點擊事件：獲取轉換後的連結，並自動寫入剪貼簿。
     */
    function handleCopy(event) {
        event.stopPropagation();
        event.preventDefault();

        const item = event.currentTarget;
        const service = item.getAttribute('data-service');

        // 1. 取得原生「複製連結」按鈕
        let originalCopyItem = null;

        const menuContainer = item.closest(MENU_CONTAINER_SELECTOR);
        if (menuContainer) {
            const menuItems = menuContainer.querySelectorAll(POTENTIAL_ITEM_SELECTOR);
            menuItems.forEach(mi => {
                if (mi.textContent && mi.textContent.includes(TARGET_TEXT)) {
                    originalCopyItem = mi;
                }
            });
        }

        if (!originalCopyItem) {
            console.error('無法找到原生「複製連結」按鈕。');
            return;
        }

        // 2. 模擬點擊原生按鈕
        originalCopyItem.click();

        // 3. 延遲讀取剪貼簿 (給 X.com 程式碼反應時間)
        setTimeout(() => {
            navigator.clipboard.readText()
                .then(originalUrl => {
                    if (!originalUrl || !originalUrl.includes('/status/')) {
                        console.error('剪貼簿中未讀取到有效的貼文連結。');
                        return;
                    }

                    // 4. 轉換 URL
                    const regex = /:\/\/(?:x|twitter)\.com/i;
                    const newUrl = originalUrl.replace(regex, `://${service}.com`);

                    if (newUrl === originalUrl) {
                        console.error("網址轉換失敗：原始 URL 格式不符合預期。");
                        return;
                    }

                    // 5. 將轉換後的 URL 寫回剪貼簿 (自動複製)
                    navigator.clipboard.writeText(newUrl)
                        .then(() => {
                            console.log(`已自動複製 ${service.toUpperCase()} 連結: ${newUrl} ✅`);
                            // 可選：給用戶一個快速視覺回饋（例如在控制台或網頁上）
                        })
                        .catch(err => {
                            console.error('寫入剪貼簿時發生錯誤 (請檢查權限):', err);
                            // 如果寫入失敗，彈出提示讓用戶手動複製
                            prompt(`【複製失敗】請手動複製以下連結：\n\n按 Ctrl+C / Cmd+C 即可複製。`, newUrl);
                        });
                })
                .catch(err => {
                    console.error('讀取剪貼簿時發生錯誤 (請檢查權限):', err);
                });
        }, 100);
    }

    /**
     * 尋找並插入新的分享選項 (保持不變)
     */
    function insertShareOptions() {
        const menuContainers = document.querySelectorAll(MENU_CONTAINER_SELECTOR);

        menuContainers.forEach(menuContainer => {
            if (menuContainer.hasAttribute(PROCESSED_ATTR)) {
                return;
            }

            const menuItems = menuContainer.querySelectorAll(POTENTIAL_ITEM_SELECTOR);
            let originalItem = null;

            menuItems.forEach(item => {
                if (item.textContent && item.textContent.includes(TARGET_TEXT)) {
                     originalItem = item;
                }
            });

            if (originalItem) {
                menuContainer.setAttribute(PROCESSED_ATTR, 'true');

                // 建立並插入 FX 連結選項
                const fxItem = createMenuItem('複製 FxTwitter 連結 (自動)', 'fxtwitter', originalItem);
                fxItem.addEventListener('click', handleCopy);
                menuContainer.insertBefore(fxItem, originalItem.nextSibling);

                // 建立並插入 VX 連結選項
                const vxItem = createMenuItem('複製 VxTwitter 連結 (自動)', 'vxtwitter', originalItem);
                vxItem.addEventListener('click', handleCopy);
                menuContainer.insertBefore(vxItem, fxItem.nextSibling);
            }
        });
    }

    // --- MutationObserver 監聽 DOM 變化 ---

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver(function(mutationsList, observer) {
        insertShareOptions();
    });

    observer.observe(targetNode, config);

    insertShareOptions();
})();