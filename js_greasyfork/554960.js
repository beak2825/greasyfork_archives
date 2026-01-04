// ==UserScript==
// @name         Gemini 定位器
// @name:en      Gemini Chat Anchor Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  為 Gemini 的每個回應新增錨點，並建立可折疊的原生風格導覽面板。採用更可靠的頁面 ID 隔離錨點，並修正了滾動功能。新增錨點名稱唯一性檢查。
// @description:en Add an anchor button to each Gemini response with a collapsible, native-style panel. Uses a more reliable page ID for anchor isolation and fixes scrolling functionality.
// @author       9code.ai
// @license      9code.ai, or feel free to use as long as you credit me
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @downloadURL https://update.greasyfork.org/scripts/554960/Gemini%20%E5%AE%9A%E4%BD%8D%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554960/Gemini%20%E5%AE%9A%E4%BD%8D%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // --- 樣式設定 (原生 Google 風格) ---
    GM_addStyle(`
        /* 導覽面板 (預設隱藏) */
        #anchor-nav-panel {
            position: fixed;
            top: 50%;
            right: 80px; /* Position next to the toggle button */
            width: 240px;
            max-height: 70vh;
            background-color: #f0f4f9;
            border-radius: 12px;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
            z-index: 9998;
            font-family: 'Google Sans', sans-serif;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s;
        }
        #anchor-nav-panel.expanded {
            opacity: 1;
            visibility: visible;
        }

        /* 面板觸發按鈕 (恆定可見) */
        #anchor-nav-toggle-btn {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 9999;
            background-color: #f0f4f9;
            border: none;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, box-shadow 0.2s;
        }
        #anchor-nav-toggle-btn:hover {
            box-shadow: 0 2px 4px 0 rgba(60,64,67,.3), 0 3px 9px 3px rgba(60,64,67,.15);
        }
        #anchor-nav-toggle-btn.active {
            background-color: #e8f0fe; /* Lighter blue when active */
        }
        #anchor-nav-toggle-btn .mat-icon {
            font-size: 24px;
            color: #1f6fea;
        }

        /* 面板標題 */
        #anchor-nav-panel h3 {
            margin: 0;
            color: #1f6fea;
            font-size: 16px;
            padding: 12px 16px;
            user-select: none;
            background-color: #eaf1fb;
            flex-shrink: 0;
            display: flex;
            align-items: center;
        }
        #anchor-nav-panel h3 .panel-title-icon {
            margin-right: 8px;
            font-size: 22px;
        }

        /* 錨點列表 */
        #anchor-list { list-style: none; padding: 8px; margin: 0; overflow-y: auto; flex-grow: 1; }
        #anchor-list li { margin-bottom: 8px; display: flex; align-items: center; background-color: #fff; border-radius: 8px; transition: box-shadow .2s; }
        #anchor-list li:hover { box-shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15); }
        .anchor-link { text-decoration: none; color: #3c4043; padding: 10px 12px; cursor: pointer; flex-grow: 1; text-align: left; word-break: break-all; }

        /* 面板底部 */
        #anchor-nav-footer {
            padding: 4px 8px 8px 8px;
            flex-shrink: 0;
            background-color: #f0f4f9;
            border-top: 1px solid #dde3ea;
        }
        .clear-anchors-btn {
            width: 100%;
            background-color: #fff;
            color: #d93025;
            border: 1px solid #dadce0;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }
        .clear-anchors-btn:hover { background-color: #fdf2f2; }
        .clear-anchors-btn mat-icon { margin-right: 8px; }

        /* 錨點操作按鈕 */
        .anchor-buttons { display: flex; align-items: center; padding-right: 8px; }
        .rename-anchor-btn, .remove-anchor-btn { border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; background-color: transparent; color: #5f6368; }
        .rename-anchor-btn:hover, .remove-anchor-btn:hover { background-color: rgba(60,64,67,.08); }

        /* 新增錨點按鈕 */
        .add-anchor-btn { background-color: transparent; color: var(--bard-color-on-surface-variant); border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; }
        .add-anchor-btn:hover { background-color: rgba(0,0,0,0.08); }
        .add-anchor-btn.anchored { color: #1e8e3e; }

        /* 回到最底按鈕 */
        #scroll-to-bottom-btn { position: fixed; bottom: 30px; right: 20px; z-index: 9997; background-color: #fff; color: #1f6fea; border: 1px solid #dadce0; border-radius: 50%; width: 48px; height: 48px; box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: box-shadow 0.2s, opacity 0.3s, transform 0.3s; }
        #scroll-to-bottom-btn:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.2); border-color: transparent; }
        #scroll-to-bottom-btn.hidden { opacity: 0; transform: translateY(20px); pointer-events: none; }

        /* 確認對話框 */
        #confirm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; }
        #confirm-modal { background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 320px; text-align: center; }
        #confirm-modal p { margin-top: 0; margin-bottom: 24px; font-size: 16px; color: #3c4043;}
        #confirm-modal-buttons button { margin: 0 8px; padding: 8px 24px; border-radius: 4px; border: 1px solid transparent; cursor: pointer; font-weight: 500;}
        #confirm-modal-yes { background-color: #d93025; color: white; }
        #confirm-modal-no { background-color: #f1f3f4; color: #3c4043; border-color: #dadce0;}
    `);

    // --- 變數與狀態管理 ---
    let allAnchors = GM_getValue('geminiAnchors_v2.7', {});
    let panelState = GM_getValue('geminiPanelState_v2.7', 'collapsed');

    // --- UI 元素建立 (安全) ---
    function createIcon(iconName, ...classNames) {
        const icon = document.createElement('mat-icon');
        icon.className = ['mat-icon', 'notranslate', 'google-symbols', 'mat-ligature-font', 'mat-icon-no-color', ...classNames].join(' ');
        icon.textContent = iconName;
        return icon;
    }

    const navPanel = document.createElement('div');
    navPanel.id = 'anchor-nav-panel';
    const panelTitle = document.createElement('h3');
    const titleText = document.createElement('span');
    titleText.className = 'panel-title-text';
    titleText.textContent = '錨點導覽';
    panelTitle.appendChild(createIcon('bookmark', 'panel-title-icon'));
    panelTitle.appendChild(titleText);
    const anchorList = document.createElement('ul');
    anchorList.id = 'anchor-list';
    const panelFooter = document.createElement('div');
    panelFooter.id = 'anchor-nav-footer';
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-anchors-btn';
    clearBtn.appendChild(createIcon('delete_sweep'));
    const clearBtnText = document.createElement('span');
    clearBtnText.textContent = '清除所有錨點';
    clearBtn.appendChild(clearBtnText);
    panelFooter.appendChild(clearBtn);
    navPanel.appendChild(panelTitle);
    navPanel.appendChild(anchorList);
    navPanel.appendChild(panelFooter);

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'anchor-nav-toggle-btn';
    toggleBtn.title = '錨點導覽';
    toggleBtn.appendChild(createIcon('bookmark'));

    const scrollToBottomBtn = document.createElement('button');
    scrollToBottomBtn.id = 'scroll-to-bottom-btn';
    scrollToBottomBtn.title = '移至最新回應';
    scrollToBottomBtn.appendChild(createIcon('arrow_downward'));

    document.body.appendChild(navPanel);
    document.body.appendChild(toggleBtn);
    document.body.appendChild(scrollToBottomBtn);

    // --- 函式庫 ---
    function saveState() {
        GM_setValue('geminiAnchors_v2.7', allAnchors);
        GM_setValue('geminiPanelState_v2.7', panelState);
    }

    function getCurrentPageKey() {
        return window.location.pathname;
    }

    function updatePanelAppearance() {
        const pageKey = getCurrentPageKey();
        const hasAnchors = (allAnchors[pageKey] || []).length > 0;
        panelFooter.style.display = hasAnchors ? 'block' : 'none';
        navPanel.classList.toggle('expanded', panelState === 'expanded');
        toggleBtn.classList.toggle('active', panelState === 'expanded');
        toggleBtn.querySelector('.mat-icon').textContent = panelState === 'expanded' ? 'close' : 'bookmark';
    }

    function renderAnchorPanel() {
        const pageKey = getCurrentPageKey();
        anchorList.replaceChildren(); // Clear old listeners and elements
        const anchors = allAnchors[pageKey] || [];
        anchors.forEach((anchor) => {
            const listItem = document.createElement('li');

            const link = document.createElement('a');
            link.className = 'anchor-link';
            link.textContent = anchor.name;
            link.addEventListener('click', () => {
                const target = document.getElementById(anchor.id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    console.warn(`Anchor target not found: ${anchor.id}`);
                }
            });

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'anchor-buttons';

            const renameBtn = document.createElement('button');
            renameBtn.className = 'rename-anchor-btn';
            renameBtn.title = '重新命名';
            renameBtn.appendChild(createIcon('edit'));
            renameBtn.addEventListener('click', () => {
                const newName = prompt('請輸入新的錨點名稱：', anchor.name);
                if (newName && newName.trim()) {
                    const pageKey = getCurrentPageKey();
                    const anchorsForPage = allAnchors[pageKey] || [];
                    const trimmedNewName = newName.trim();
                    if (anchorsForPage.some(a => a.id !== anchor.id && a.name === trimmedNewName)) {
                        alert('此名稱的錨點已存在，請使用不同的名稱。');
                        return;
                    }
                    anchor.name = trimmedNewName;
                    saveState();
                    renderAnchorPanel();
                }
            });

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-anchor-btn';
            removeBtn.title = '移除';
            removeBtn.appendChild(createIcon('delete'));
            removeBtn.addEventListener('click', () => {
                const pageKey = getCurrentPageKey();
                const anchorsForPage = allAnchors[pageKey] || [];
                const indexToRemove = anchorsForPage.findIndex(a => a.id === anchor.id);
                if (indexToRemove > -1) {
                    const [removedAnchor] = anchorsForPage.splice(indexToRemove, 1);
                    saveState();
                    renderAnchorPanel();
                    updateAnchorButton(document.getElementById(removedAnchor.id));
                }
            });

            buttonsDiv.appendChild(renameBtn);
            buttonsDiv.appendChild(removeBtn);
            listItem.appendChild(link);
            listItem.appendChild(buttonsDiv);
            anchorList.appendChild(listItem);
        });
        updatePanelAppearance();
    }


    function showConfirmModal(message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.id = 'confirm-modal-overlay';
        const modal = document.createElement('div');
        modal.id = 'confirm-modal';
        const msg = document.createElement('p');
        msg.textContent = message;
        const btnContainer = document.createElement('div');
        btnContainer.id = 'confirm-modal-buttons';
        const yesBtn = document.createElement('button');
        yesBtn.id = 'confirm-modal-yes';
        yesBtn.textContent = '確認刪除';
        const noBtn = document.createElement('button');
        noBtn.id = 'confirm-modal-no';
        noBtn.textContent = '取消';
        btnContainer.appendChild(yesBtn);
        btnContainer.appendChild(noBtn);
        modal.appendChild(msg);
        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        const closeModal = () => document.body.removeChild(overlay);
        noBtn.onclick = closeModal;
        overlay.onclick = (e) => { if(e.target === overlay) closeModal(); };
        yesBtn.onclick = () => { onConfirm(); closeModal(); };
        document.body.appendChild(overlay);
    }

    function updateAnchorButton(modelResponseEl) {
        if (!modelResponseEl || !modelResponseEl.id) return; // 需要 ID 才能運作

        const actionsContainer = modelResponseEl.querySelector('message-actions .buttons-container-v2');
        if (!actionsContainer) return; // 找不到按鈕列，提前退出

        let btn = modelResponseEl.querySelector('.add-anchor-btn');

        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'add-anchor-btn mdc-icon-button mat-mdc-icon-button mat-mdc-button-base';
            const icon = createIcon('');
            btn.appendChild(icon);
            btn.addEventListener('click', () => {
                const pageKey = getCurrentPageKey();
                const anchorName = prompt('請為此錨點命名：', `錨點 ${(allAnchors[pageKey]?.length || 0) + 1}`);

                if (anchorName && anchorName.trim()) {
                    const trimmedName = anchorName.trim();
                    const anchorsForPage = allAnchors[pageKey] || [];
                    if (anchorsForPage.some(anchor => anchor.name === trimmedName)) {
                        alert('此名稱的錨點已存在，請使用不同的名稱。');
                        return;
                    }

                    if (!allAnchors[pageKey]) allAnchors[pageKey] = [];
                    allAnchors[pageKey].push({ id: modelResponseEl.id, name: trimmedName });
                    saveState();
                    renderAnchorPanel();
                    updateAnchorButton(modelResponseEl); // 再次調用以更新狀態
                }
            });
            const shareButton = actionsContainer.querySelector('[data-test-id="share-and-export-menu-button"]');
            if (shareButton) {
                 actionsContainer.insertBefore(btn, shareButton.closest('div.tooltip-anchor-point'));
            } else {
                 actionsContainer.appendChild(btn);
            }
        }

        const pageKey = getCurrentPageKey();
        const icon = btn.querySelector('mat-icon');
        const existingAnchor = (allAnchors[pageKey] || []).find(a => a.id === modelResponseEl.id);

        if (existingAnchor) {
            icon.textContent = 'bookmark_added';
            btn.classList.add('anchored');
            btn.disabled = true; // 已經加入錨點，禁用按鈕
        } else {
            icon.textContent = 'bookmark_add';
            btn.classList.remove('anchored');
            btn.disabled = false; // 尚未加入，啟用按鈕
            btn.title = '新增錨點';
        }
    }

    function assignIdToResponse(node) {
        if (node.tagName === 'MODEL-RESPONSE' && !node.id) {
            // 嘗試從 'message-content' 獲取 ID
            const messageContent = node.querySelector('message-content[id]');
            if (messageContent) {
                 node.id = messageContent.id.replace('message-content-id-', 'model-response-');
            }
            // 如果還是失敗，給一個備用 ID (雖然風險較高，但聊勝於無)
            if (!node.id) {
                // 備用方案：使用內容 hash (簡化版) 或隨機 ID
                // 為了穩定性，我們優先等待 messageContent ID
                // console.warn('Gemini Anchor: Could not find message-content ID immediately.');
            }
        }
    }

    // --- (v1.2) 穩健的按鈕更新函數 ---
    function robustlyRunUpdate(modelResponseEl) {
        // (v1.2) 加入輪詢守衛，防止重複執行
        if (!modelResponseEl || modelResponseEl.dataset.anchorPolling) return;
        modelResponseEl.dataset.anchorPolling = 'true'; // 設置守衛

        // 1. 確保有 ID
        assignIdToResponse(modelResponseEl);
        if (!modelResponseEl.id) {
            let assignAttempts = 0;
            const assignInterval = setInterval(() => {
                assignAttempts++;
                assignIdToResponse(modelResponseEl);
                if (modelResponseEl.id) {
                    clearInterval(assignInterval);
                    pollForContainer(modelResponseEl); // 成功分配 ID，現在開始輪詢容器
                } else if (assignAttempts >= 15) { // 嘗試 1.5 秒
                    clearInterval(assignInterval);
                    console.warn('Gemini Anchor: Failed to assign ID, cannot update button.', modelResponseEl);
                    delete modelResponseEl.dataset.anchorPolling; // (v1.2) 移除守衛
                }
            }, 100);
        } else {
            // ID 已存在，直接開始輪詢容器
            pollForContainer(modelResponseEl);
        }
    }

    // --- (v1.2) 輪詢按鈕容器的輔助函數 ---
    function pollForContainer(modelResponseEl) {
        let pollAttempts = 0;
        const maxPollAttempts = 50; // 嘗試 5 秒 (50 * 100ms)，應對串流完成後才載入按鈕的情況
        const pollInterval = setInterval(() => {
            pollAttempts++;
            // 尋找按鈕列
            const actionsContainer = modelResponseEl.querySelector('message-actions .buttons-container-v2');

            if (actionsContainer) {
                // 找到了！
                clearInterval(pollInterval);
                updateAnchorButton(modelResponseEl); // 執行原始的更新/插入邏輯
                delete modelResponseEl.dataset.anchorPolling; // (v1.2) 移除守衛
            } else if (pollAttempts >= maxPollAttempts) {
                // 超時了
                clearInterval(pollInterval);
                console.warn(`Gemini Anchor: Could not find actions-container in ${modelResponseEl.id} after ${maxPollAttempts} attempts.`);
                delete modelResponseEl.dataset.anchorPolling; // (v1.2) 移除守衛
            }
        }, 100); // 每 100ms 檢查一次
    }


    function processAllVisibleResponses() {
        document.querySelectorAll('model-response').forEach(el => {
            robustlyRunUpdate(el);
        });
    }

    // --- 啟動與監聽 ---
    function initialize() {
        toggleBtn.onclick = () => {
            panelState = (panelState === 'expanded') ? 'collapsed' : 'expanded';
            saveState();
            updatePanelAppearance();
        };

        clearBtn.onclick = (e) => {
            e.stopPropagation();
            const pageKey = getCurrentPageKey();
            const currentAnchors = allAnchors[pageKey] || [];
            if (currentAnchors.length === 0) return;

            showConfirmModal('您確定要刪除這個對話中的所有錨點嗎？此操作無法復原。', () => {
                const anchorsToReset = [...currentAnchors];
                delete allAnchors[pageKey];
                saveState();
                renderAnchorPanel();
                anchorsToReset.forEach(anchor => {
                    // 重新調用 updateAnchorButton 以重置按鈕狀態
                    const el = document.getElementById(anchor.id);
                    if (el) updateAnchorButton(el);
                });
            });
        };

        // *** (v1.2) 升級版 MutationObserver ***
        const observer = new MutationObserver(mutations => {
            // 使用 Set 避免在一次批次中重複處理同一個元素
            const elementsToProcess = new Set();

            mutations.forEach(m => {
                // 類型 1：新節點被加入 (例如：全新的 model-response)
                if (m.type === 'childList') {
                    m.addedNodes.forEach(n => {
                        if (n.nodeType === 1) {
                            if (n.matches('model-response')) {
                                elementsToProcess.add(n);
                            } else if (n.querySelectorAll) {
                                // 如果加入了一個包含 model-response 的區塊
                                n.querySelectorAll('model-response').forEach(el => elementsToProcess.add(el));
                            }
                        }
                    });
                }

                // (例如：串流結束後，Gemini 把按鈕列加了進去)
                if (m.target && m.target.closest) {
                    const el = m.target.closest('model-response');
                    if (el) {
                        elementsToProcess.add(el);
                    }
                }
            });

            // 統一處理所有受影響的元素
            elementsToProcess.forEach(el => {
                // 檢查：如果它 (1)還沒有按鈕 且 (2)沒有正在被輪詢
                if (!el.querySelector('.add-anchor-btn') && !el.dataset.anchorPolling) {
                    robustlyRunUpdate(el);
                }
            });
        });

        // 監聽 body 及其所有子樹的子節點變化
        observer.observe(document.body, { childList: true, subtree: true });


        // ** 最準確的滾動容器選擇器 **
        const scrollContainerSelector = 'infinite-scroller[data-test-id="chat-history-container"]';

        scrollToBottomBtn.onclick = () => {
            const container = document.querySelector(scrollContainerSelector);
            if (container) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                 console.error("Gemini Anchor Navigator: SCROLL CONTAINER NOT FOUND!");
            }
        };

        const checkScrollPosition = () => {
            const container = document.querySelector(scrollContainerSelector);
            if (container) {
                const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
                scrollToBottomBtn.classList.toggle('hidden', isAtBottom);
            } else {
                 scrollToBottomBtn.classList.add('hidden');
            }
        };

        // URL 變更偵測
        let lastPath = window.location.pathname;
        setInterval(() => {
            if (window.location.pathname !== lastPath) {
                lastPath = window.location.pathname;
                console.log(`Gemini Anchor Navigator: URL Path changed to ${lastPath}`);
                setTimeout(() => {
                    processAllVisibleResponses();
                    renderAnchorPanel();
                }, 500); // 等待 Gemini 渲染新頁面內容
            }
            // 持續檢查滾動位置
            checkScrollPosition();
        }, 300);

        // 初始載入
        setTimeout(() => {
            processAllVisibleResponses();
            renderAnchorPanel(); // 根據儲存的狀態進行初始渲染
            checkScrollPosition();
            console.log('Gemini Anchor Navigator: Initial setup complete (v1.2).');
        }, 1500); // 保持 1.5 秒的初始延遲，以確保頁面完全載入
    }

    initialize();

})();