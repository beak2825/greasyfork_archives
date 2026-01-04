// ==UserScript==
// @name         디시 분탕 차단기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  분탕은 안보면 그만이다.
// @author       웹연갤러
// @match        *://gall.dcinside.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554195/%EB%94%94%EC%8B%9C%20%EB%B6%84%ED%83%95%20%EC%B0%A8%EB%8B%A8%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/554195/%EB%94%94%EC%8B%9C%20%EB%B6%84%ED%83%95%20%EC%B0%A8%EB%8B%A8%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockerStyleElement = null;
    let observer = null;
    let currentBlockList = [];
    let toastTimer = null;
    let isBlockerEnabled = true;

    function showToast(message) {
        let toast = document.getElementById('gm-blocker-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gm-blocker-toast';
            const wrapper = document.getElementById('gm-blocker-wrapper');
            if(wrapper) wrapper.appendChild(toast);
            else document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = '1';

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2500);
    }

    function showMultiSelectModal(title, groupedList) {
        return new Promise((resolve) => {
            const overlayId = 'gm-blocker-overlay';
            const modalStyleId = 'gm-blocker-modal-style';

            const existingOverlay = document.getElementById(overlayId);
            if (existingOverlay) existingOverlay.remove();
            const existingStyle = document.getElementById(modalStyleId);
            if (existingStyle) existingStyle.remove();

            const modalCss = `
                #${overlayId} {
                  position: fixed; z-index: 99998; top: 0; left: 0; width: 100vw; height: 100vh;
                  background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; font-family: sans-serif;
                }
                #gm-blocker-modal {
                  background: #fff; color: #333; border-radius: 8px; padding: 20px;
                  width: 500px; max-width: 90%; max-height: 80vh; overflow-y: auto;
                  box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: flex; flex-direction: column;
                }
                #gm-blocker-modal h3 {
                  margin-top: 0; margin-bottom: 15px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px;
                }
                #gm-blocker-modal-options {
                  overflow-y: auto; max-height: 50vh;
                }
                .gm-blocker-group {
                  margin-bottom: 15px;
                }
                .gm-blocker-group h4 {
                  font-size: 14px; font-weight: bold; color: #333;
                  margin-top: 0; margin-bottom: 8px; padding-bottom: 5px;
                  border-bottom: 1px solid #f0f0f0;
                }
                .gm-blocker-group-items {
                  display: flex; flex-wrap: wrap; gap: 8px;
                }
                .gm-blocker-modal-item {
                  display: inline-block; padding: 6px 10px;
                  background: #f0f0f0; border: 1px solid #f0f0f0; border-radius: 20px;
                  cursor: pointer; font-size: 14px;
                  word-break: break-all;
                }
                .gm-blocker-modal-item:hover { background: #e0e0e0; }
                .gm-blocker-modal-item.gm-selected {
                  background-color: #cce5ff;
                  color: #004085;
                  border: 1px solid #b8daff;
                }
                .gm-blocker-footer {
                  margin-top: 15px; display: flex; gap: 10px;
                }
                .gm-blocker-footer button {
                  flex: 1; text-align: center; padding: 10px;
                  border: none; border-radius: 5px; cursor: pointer; font-size: 14px;
                }
                #gm-blocker-confirm { background: #007bff; color: white; }
                #gm-blocker-confirm:hover { background: #0056b3; }
                #gm-blocker-cancel { background: #ddd; color: #333; }
                #gm-blocker-cancel:hover { background: #ccc; }
            `;
            const styleEl = document.createElement('style');
            styleEl.id = modalStyleId;
            styleEl.textContent = modalCss;
            document.head.appendChild(styleEl);

            const overlay = document.createElement('div');
            overlay.id = overlayId;
            const modal = document.createElement('div');
            modal.id = 'gm-blocker-modal';

            const titleEl = document.createElement('h3');
            titleEl.textContent = title;
            modal.appendChild(titleEl);

            const optionsContainer = document.createElement('div');
            optionsContainer.id = 'gm-blocker-modal-options';

            const categories = { nick: '닉네임', uid: 'ID', ip: 'IP', subject: '말머리' };

            Object.entries(categories).forEach(([type, name]) => {
                const items = groupedList[type];
                if (items && items.length > 0) {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'gm-blocker-group';

                    const titleH4 = document.createElement('h4');
                    titleH4.textContent = `${name} (${items.length}개)`;
                    groupDiv.appendChild(titleH4);

                    const itemsDiv = document.createElement('div');
                    itemsDiv.className = 'gm-blocker-group-items';

                    items.forEach(item => {
                        const itemSpan = document.createElement('span');
                        itemSpan.className = 'gm-blocker-modal-item';
                        itemSpan.textContent = item.value + (item.reason ? ` (${item.reason})` : '');
                        itemSpan.dataset.value = JSON.stringify(item);
                        itemsDiv.appendChild(itemSpan);
                    });

                    groupDiv.appendChild(itemsDiv);
                    optionsContainer.appendChild(groupDiv);
                }
            });

            modal.appendChild(optionsContainer);

            const footer = document.createElement('div');
            footer.className = 'gm-blocker-footer';
            const confirmButton = document.createElement('button');
            confirmButton.id = 'gm-blocker-confirm';
            confirmButton.textContent = '선택 항목 삭제';
            const cancelButton = document.createElement('button');
            cancelButton.id = 'gm-blocker-cancel';
            cancelButton.textContent = '취소';
            footer.appendChild(confirmButton);
            footer.appendChild(cancelButton);
            modal.appendChild(footer);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            function cleanup() {
                overlay.remove();
                styleEl.remove();
            }

            optionsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('gm-blocker-modal-item')) {
                    e.target.classList.toggle('gm-selected');
                }
            });
            confirmButton.addEventListener('click', () => {
                const selectedItems = optionsContainer.querySelectorAll('.gm-blocker-modal-item.gm-selected');
                const selectedValues = Array.from(selectedItems).map(btn => btn.dataset.value);
                cleanup();
                resolve(selectedValues);
            });
            cancelButton.addEventListener('click', () => {
                cleanup();
                resolve(null);
            });
            overlay.addEventListener('click', (e) => {
                if (e.target.id === overlayId) {
                    cleanup();
                    resolve(null);
                }
            });
        });
    }

    function showImportChoiceModal() {
        return new Promise((resolve) => {
            const overlayId = 'gm-blocker-import-overlay';
            const styleId = 'gm-blocker-import-style';

            document.getElementById(overlayId)?.remove();
            document.getElementById(styleId)?.remove();

            const modalCss = `
                #${overlayId} {
                  position: fixed; z-index: 99999; top: 0; left: 0; width: 100vw; height: 100vh;
                  background: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; font-family: sans-serif;
                }
                #gm-blocker-import-modal {
                  background: #fff; border-radius: 8px; padding: 20px;
                  width: 350px; max-width: 90%; text-align: center;
                  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                #gm-blocker-import-modal p { font-size: 15px; margin-top: 0; margin-bottom: 20px; line-height: 1.5; }
                #gm-blocker-import-modal button {
                  width: 100%; padding: 12px; margin-bottom: 10px;
                  border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold;
                }
                #gm-blocker-import-append { background: #007bff; color: white; }
                #gm-blocker-import-append:hover { background: #0056b3; }
                #gm-blocker-import-overwrite { background: #dc3545; color: white; }
                #gm-blocker-import-overwrite:hover { background: #a71d2a; }
                #gm-blocker-import-cancel { background: #ddd; color: #333; margin-bottom: 0; }
                #gm-blocker-import-cancel:hover { background: #ccc; }
            `;
            const styleEl = document.createElement('style');
            styleEl.id = styleId;
            styleEl.textContent = modalCss;
            document.head.appendChild(styleEl);

            const overlay = document.createElement('div');
            overlay.id = overlayId;
            overlay.innerHTML = `
                <div id="gm-blocker-import-modal">
                    <p>불러오기 방식을 선택하세요.<br>(기존 목록 처리)</p>
                    <button id="gm-blocker-import-append">추가하기 (기존 + 신규)</button>
                    <button id="gm-blocker-import-overwrite">덮어쓰기 (기존 목록 삭제)</button>
                    <button id="gm-blocker-import-cancel">취소</button>
                </div>
            `;
            document.body.appendChild(overlay);

            const cleanup = () => {
                overlay.remove();
                styleEl.remove();
            };

            overlay.addEventListener('click', (e) => {
                if (e.target.id === 'gm-blocker-import-append') {
                    cleanup();
                    resolve('append');
                } else if (e.target.id === 'gm-blocker-import-overwrite') {
                    cleanup();
                    resolve('overwrite');
                } else if (e.target.id === 'gm-blocker-import-cancel' || e.target.id === overlayId) {
                    cleanup();
                    resolve(null);
                }
            });
        });
    }

    function toggleBlockerState(isEnabled) {
        if (isEnabled) {
            showToast("차단기 ON");
            updateBlockerCss(currentBlockList);
            observeLogic();
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        } else {
            showToast("차단기 OFF");
            if (blockerStyleElement) {
                blockerStyleElement.textContent = '';
            }
            unhideAllBlockedElements();
            observer.disconnect();
        }
    }


    function createMainUI() {
        const panelCss = `
            #gm-blocker-wrapper {
                font-family: sans-serif;
            }
            #gm-blocker-trigger {
                position: fixed; bottom: 15px; left: 15px; z-index: 99997;
                width: 40px; height: 40px;
                background: #fff;
                border: 1px solid #ddd; border-radius: 50%;
                font-size: 30px; text-align: center; line-height: 40px;
                cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                user-select: none;
            }
            #gm-blocker-panel {
                position: fixed; bottom: 15px; left: 65px; z-index: 99998;
                width: 300px; background: #fff; border-radius: 8px;
                border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-family: sans-serif; display: none;
                flex-direction: column; max-height: 70vh;
            }
            #gm-blocker-header {
                padding: 10px 15px; font-size: 14px; font-weight: bold;
                border-bottom: 1px solid #eee; display: flex;
                align-items: center;
            }
            #gm-blocker-header > span:first-child {
                flex-grow: 1;
            }
            #gm-blocker-close {
                font-size: 18px; font-weight: bold; cursor: pointer; color: #888;
                padding: 5px;
                margin-left: auto;
            }
            .gm-blocker-toggle {
                position: relative; display: inline-block; width: 44px; height: 24px;
                margin-left: 10px; flex-shrink: 0;
            }
            .gm-blocker-toggle input { opacity: 0; width: 0; height: 0; }
            .gm-blocker-slider {
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: #ccc; border-radius: 24px; transition: .4s;
            }
            .gm-blocker-slider:before {
                position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
                background-color: white; border-radius: 50%; transition: .4s;
            }
            input:checked + .gm-blocker-slider { background-color: #007bff; }
            input:checked + .gm-blocker-slider:before { transform: translateX(20px); }
            #gm-blocker-content {
                padding: 10px; display: flex; flex-direction: column;
                overflow-y: auto; max-height: calc(70vh - 45px);
            }
            .gm-blocker-btn {
                display: block; width: 100%; text-align: left; padding: 10px;
                margin-bottom: 8px; background: #f0f0f0; border: none;
                border-radius: 5px; cursor: pointer; font-size: 14px;
                box-sizing: border-box;
            }
            .gm-blocker-btn:hover { background: #e0e0e0; }
            .gm-blocker-btn:last-child { margin-bottom: 0; }
            #gm-blocker-input {
                width: 100%; padding: 8px 10px; margin-bottom: 10px;
                border: 1px solid #ccc; border-radius: 5px;
                box-sizing: border-box;
            }
            .gm-blocker-save-btn {
                background: #007bff; color: white;
            }
            .gm-blocker-save-btn:hover { background: #0056b3; }
            #gm-blocker-list-view {
                white-space: pre-wrap; font-size: 13px; line-height: 1.6;
                padding: 5px; background: #f9f9f9; border-radius: 5px;
            }
            #gm-blocker-toast {
                position: fixed; bottom: 20px; left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8); color: white;
                padding: 10px 20px; border-radius: 5px;
                z-index: 100000; font-size: 14px;
                opacity: 0; transition: opacity 0.5s;
                pointer-events: none;
            }
        `;
        GM_addStyle(panelCss);

        const wrapper = document.createElement('div');
        wrapper.id = 'gm-blocker-wrapper';

        const trigger = document.createElement('div');
        trigger.id = 'gm-blocker-trigger';
        trigger.textContent = '☠';
        wrapper.appendChild(trigger);

        const panel = document.createElement('div');
        panel.id = 'gm-blocker-panel';
        panel.innerHTML = `
            <div id="gm-blocker-header">
                <span>디시 분탕 차단기 v1.0</span>
                <label class="gm-blocker-toggle">
                    <input type="checkbox" id="gm-blocker-enable-toggle">
                    <span class="gm-blocker-slider"></span>
                </label>
                <span id="gm-blocker-close">×</span>
            </div>
            <div id="gm-blocker-content"></div>
        `;
        wrapper.appendChild(panel);

        const toast = document.createElement('div');
        toast.id = 'gm-blocker-toast';
        wrapper.appendChild(toast);

        document.body.appendChild(wrapper);

        const toggleInput = document.getElementById('gm-blocker-enable-toggle');
        toggleInput.checked = isBlockerEnabled;

        toggleInput.addEventListener('change', async () => {
            isBlockerEnabled = toggleInput.checked;
            await GM_setValue('isBlockerEnabled', isBlockerEnabled);
            toggleBlockerState(isBlockerEnabled);
        });

        trigger.addEventListener('click', () => {
            if (panel.style.display === 'flex') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'flex';
                renderMainMenuView();
            }
        });

        document.getElementById('gm-blocker-close').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    function renderPanel(title, html) {
        let contentEl = document.getElementById('gm-blocker-content');
        if (!contentEl) return;

        let newContentEl = contentEl.cloneNode(false);
        contentEl.parentNode.replaceChild(newContentEl, contentEl);

        let headerTitle = document.querySelector('#gm-blocker-header span:first-child');
        headerTitle.textContent = title ? `차단기 > ${title}` : '디시 분탕 차단기 v1.0';

        newContentEl.innerHTML = html;
    }

    function renderMainMenuView() {
        renderPanel(null, `
            <button class="gm-blocker-btn" data-action="add-user">사용자 차단</button>
            <button class="gm-blocker-btn" data-action="add-subject">말머리 차단</button>
            <button class="gm-blocker-btn" data-action="view-list">현재 차단 목록</button>
            <button class="gm-blocker-btn" data-action="unblock">차단 해제...</button>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 5px 0 10px 0;">
            <button class="gm-blocker-btn" data-action="export-list" style="background-color: #d4edda; color: #155724;">목록 내보내기</button>
            <button class="gm-blocker-btn" data-action="import-list" style="background-color: #d1ecf1; color: #0c5460;">목록 불러오기</button>
        `);

        document.getElementById('gm-blocker-content').addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;
            switch(e.target.dataset.action) {
                case 'add-user': renderAddUserTypeView(); break;
                case 'add-subject': renderAddInputView('subject'); break;
                case 'view-list': renderViewListView(); break;
                case 'unblock': renderUnblockView(); break;
                case 'export-list': exportBlockList(); break;
                case 'import-list': importBlockList(); break;
            }
        });
    }

    function renderAddUserTypeView() {
        renderPanel('사용자 유형', `
            <button class="gm-blocker-btn" data-type="nick">닉네임</button>
            <button class="gm-blocker-btn" data-type="uid">고유 ID (uid)</button>
            <button class="gm-blocker-btn" data-type="ip">IP 주소</button>
            <button class="gm-blocker-btn" data-action="back-main">« 뒤로</button>
        `);

        document.getElementById('gm-blocker-content').addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;
            if (e.target.dataset.action === 'back-main') {
                renderMainMenuView();
            } else if (e.target.dataset.type) {
                renderAddInputView(e.target.dataset.type);
            }
        });
    }

    function renderAddInputView(type) {
        let title = '';
        let placeholder = '';
        switch(type) {
            case 'nick': title = '닉네임 등록'; break;
            case 'uid': title = 'ID 등록'; break;
            case 'ip': title = 'IP 등록'; break;
            case 'subject': title = '말머리 등록'; break;
        }

        placeholder = `쉼표(,)로 구분, '##이유'로 메모가능`;

        renderPanel(title, `
            <input type="text" id="gm-blocker-input" placeholder="${placeholder}">
            <button class="gm-blocker-btn gm-blocker-save-btn" data-action="save">저장</button>
            <button class="gm-blocker-btn" data-action="back">« 뒤로</button>
        `);

        document.getElementById('gm-blocker-input').focus();

        document.getElementById('gm-blocker-content').addEventListener('click', async (e) => {
            if (e.target.tagName !== 'BUTTON') return;
            if (e.target.dataset.action === 'save') {
                const rawValue = document.getElementById('gm-blocker-input').value;

                if (!rawValue.trim()) {
                    showToast("값이 입력되지 않았습니다.");
                    return;
                }

                const itemsToRegister = rawValue.split(',');

                let successCount = 0;
                let typeName = '';
                switch(type) {
                    case 'nick': typeName = '닉네임'; break;
                    case 'uid': typeName = 'ID'; break;
                    case 'ip': typeName = 'IP'; break;
                    case 'subject': typeName = '말머리'; break;
                }

                for (const item of itemsToRegister) {
                    const trimmedItem = item.trim();
                    if (!trimmedItem) continue;

                    const parts = trimmedItem.split('##');
                    const value = parts[0].trim();
                    const reason = (parts.length > 1) ? parts.slice(1).join('##').trim() : '';

                    if (value) {
                        const success = await addBlockItem(type, value, reason);
                        if (success) successCount++;
                    }
                }

                if (successCount > 0) {
                    showToast(`${successCount}개의 ${typeName}을(를) 차단했습니다.`);
                    renderMainMenuView();
                }
            } else if (e.target.dataset.action === 'back') {
                type === 'subject' ? renderMainMenuView() : renderAddUserTypeView();
            }
        });
    }

    async function renderViewListView() {
        const blockList = await GM_getValue('blockList', []);
        let content;
        if (blockList.length === 0) {
            content = "<p style='font-size: 14px; color: #555;'>차단 목록이 비어있습니다.</p>";
        } else {
            content = `<div id="gm-blocker-list-view">${formatBlockListForDisplay(blockList)}</div>`;
        }

        renderPanel('차단 목록', content + `<button class="gm-blocker-btn" data-action="back-main" style="margin-top: 10px;">« 뒤로</button>`);

        document.getElementById('gm-blocker-content').addEventListener('click', (e) => {
            if (e.target.dataset.action === 'back-main') renderMainMenuView();
        });
    }

    function renderUnblockView() {
        renderPanel('차단 해제', `
            <button class="gm-blocker-btn" data-action="individual">개별 차단 해제</button>
            <button class="gm-blocker-btn" data-action="reset-all">차단 목록 초기화</button>
            <button class="gm-blocker-btn" data-action="back-main">« 뒤로</button>
        `);

        document.getElementById('gm-blocker-content').addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;
            switch(e.target.dataset.action) {
                case 'individual':
                    showMultiSelectUnblockModal();
                    break;
                case 'reset-all':
                    resetBlockList();
                    break;
                case 'back-main':
                    renderMainMenuView();
                    break;
            }
        });
    }

    async function showMultiSelectUnblockModal() {
        const blockList = await GM_getValue('blockList', []);
        if (blockList.length === 0) {
            showToast("차단 목록이 비어있습니다.");
            return;
        }

        const groupedList = { nick: [], uid: [], ip: [], subject: [] };
        blockList.forEach(item => {
            if (typeof item === 'object' && item !== null && groupedList[item.type]) {
                groupedList[item.type].push(item);
            }
        });

        const itemsToDelete = await showMultiSelectModal("삭제할 항목을 선택하세요 (다중 선택 가능):", groupedList);

        if (itemsToDelete && itemsToDelete.length > 0) {
            await removeIndividualBlockItem(itemsToDelete);
        }
    }


    function unhideAllBlockedElements() {
        const potentiallyHidden = document.querySelectorAll(
            'tr.ub-content[style*="display: none"], ' +
            'li.ub-content[style*="display: none"], ' +
            'li[style*="display: none"]:has(> div.reply_box)'
        );

        potentiallyHidden.forEach(el => {
            el.style.display = '';
        });
    }


    function updateBlockerCss(blockList) {
        if (!isBlockerEnabled) {
            if(blockerStyleElement) blockerStyleElement.textContent = '';
            return;
        }

        let cssRules = '';
        if (blockList.length > 0) {
            const selectors = [];
            blockList.forEach(item => {
                if (typeof item !== 'object' || item === null) return;

                if (item.type === 'subject') return;
                let attribute = '', operator = '=', value = `"${item.value.trim().replace(/[()]/g, '')}"`;
                switch (item.type) {
                    case 'nick': attribute = 'data-nick'; break;
                    case 'uid': attribute = 'data-uid'; break;
                    case 'ip': attribute = 'data-ip'; operator = '^='; break;
                    default: return;
                }
                const selector = `[${attribute}${operator}${value}]`;
                selectors.push(`tr.ub-content:has(td.gall_writer${selector})`);
                selectors.push(`li.ub-content:has(span.gall_writer${selector})`);
            });
            cssRules = selectors.join(',\n') + ' { display: none !important; }';
        }
        if (blockerStyleElement) {
            blockerStyleElement.textContent = cssRules;
        } else {
            blockerStyleElement = GM_addStyle(cssRules);
        }
    }

    function observeLogic() {
        if (!isBlockerEnabled || currentBlockList.length === 0) return;

        currentBlockList.forEach(item => {
            if (typeof item !== 'object' || item === null) return;

            let value = item.value.trim().replace(/[()]/g, '');
            if (item.type === 'subject') {
                document.querySelectorAll('td.gall_subject').forEach(td => {
                    if (td.textContent.includes(value)) {
                        const postTr = td.closest('tr.ub-content');
                        if (postTr && postTr.style.display !== 'none') postTr.style.display = 'none';
                    }
                });
            } else if (item.type === 'nick' || item.type === 'uid' || item.type === 'ip') {
                let attribute = '', operator = '===';
                switch (item.type) {
                    case 'nick': attribute = 'dataset.nick'; break;
                    case 'uid': attribute = 'dataset.uid'; break;
                    case 'ip': attribute = 'dataset.ip'; operator = 'startsWith'; break;
                    default: return;
                }
                document.querySelectorAll('span.gall_writer').forEach(span => {
                    let writerIdentifier = span[attribute];
                    if (!writerIdentifier) return;
                    let match = (operator === 'startsWith') ? writerIdentifier.startsWith(value) : (writerIdentifier === value);
                    if (match) {
                        const blockedLi = span.closest('li.ub-content');
                        if (!blockedLi || blockedLi.style.display === 'none') return;
                        blockedLi.style.display = 'none';
                        if (blockedLi.id.startsWith('comment_li_')) {
                            const commentId = blockedLi.dataset.no;
                            if (commentId) {
                                const replyListUl = document.getElementById(`reply_list_${commentId}`);
                                if (replyListUl) {
                                    const replyContainerLi = replyListUl.closest('li');
                                    if (replyContainerLi) replyContainerLi.style.display = 'none';
                                }
                            }
                        } else if (blockedLi.id.startsWith('reply_li_')) {
                            const replyListUl = blockedLi.closest('ul.reply_list');
                            if (replyListUl) {
                                const replyContainerLi = replyListUl.closest('li');
                                const originalCommentLi = replyContainerLi ? replyContainerLi.previousElementSibling : null;
                                if (originalCommentLi && originalCommentLi.id.startsWith('comment_li_')) {
                                    originalCommentLi.style.display = 'none';
                                    replyContainerLi.style.display = 'none';
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    async function addBlockItem(type, valueInput, reason = '') {
        const value = valueInput.trim().replace(/[()]/g, '');
        if (!value) {
            showToast("값이 유효하지 않습니다.");
            return false;
        }
        const blockList = await GM_getValue('blockList', []);
        const isDuplicate = blockList.some(item => item.type === type && item.value === value);
        if (isDuplicate) {
            showToast(`[${type}] ${value} (은)는 이미 차단 목록에 있습니다.`);
            return false;
        }
        blockList.push({ type, value, reason });
        await GM_setValue('blockList', blockList);
        currentBlockList = blockList;

        if (isBlockerEnabled) {
            updateBlockerCss(currentBlockList);
            observeLogic();
        }
        return true;
    }

    async function removeIndividualBlockItem(itemsToDelete) {
        if (!itemsToDelete || itemsToDelete.length === 0) return;

        const blockList = await GM_getValue('blockList', []);
        const deleteSet = new Set(itemsToDelete);

        const newBlockList = blockList.filter(item => {
            const itemString = JSON.stringify(item);
            return !deleteSet.has(itemString);
        });

        await GM_setValue('blockList', newBlockList);
        currentBlockList = newBlockList;
        showToast(`${itemsToDelete.length}개 차단 해제 완료.`);

        if (isBlockerEnabled) {
            updateBlockerCss(currentBlockList);
            unhideAllBlockedElements();
            observeLogic();
        }
    }

    async function resetBlockList() {
        const blockList = await GM_getValue('blockList', []);
        if (blockList.length === 0) {
            showToast("차단 목록이 비어있습니다.");
            return;
        }

        if (confirm("차단 목록을 초기화 하시겠습니까?")) {
            await GM_setValue('blockList', []);
            currentBlockList = [];
            showToast("차단 목록 초기화 완료.");

            if (isBlockerEnabled) {
                updateBlockerCss(currentBlockList);
                unhideAllBlockedElements();
            }
        }
    }

    function formatBlockListForDisplay(blockList) {
        const groupedList = { nick: [], uid: [], ip: [], subject: [] };
        blockList.forEach(item => {
            if (typeof item === 'object' && item !== null && groupedList[item.type]) {
                const reasonText = item.reason ? ` (${item.reason})` : '';
                groupedList[item.type].push(`${item.value}${reasonText}`);
            }
        });
        let message = "";
        message += "<b>[닉네임]</b>\n" + (groupedList.nick.length > 0 ? groupedList.nick.join(' | ') : "없음");
        message += "\n\n<b>[ID]</b>\n" + (groupedList.uid.length > 0 ? groupedList.uid.join(' | ') : "없음");
        message += "\n\n<b>[IP]</b>\n" + (groupedList.ip.length > 0 ? groupedList.ip.join(' | ') : "없음");
        message += "\n\n<b>[말머리]</b>\n" + (groupedList.subject.length > 0 ? groupedList.subject.join(' | ') : "없음");
        return message.replace(/\n/g, '<br>');
    }

    function isValidBlockList(list) {
        if (!Array.isArray(list)) return false;
        if (list.length === 0) return true;

        for (const item of list) {
            if (typeof item !== 'object' || item === null) return false;
            if (typeof item.type !== 'string' || typeof item.value !== 'string') {
                return false;
            }
            if (!['nick', 'uid', 'ip', 'subject'].includes(item.type)) {
                return false;
            }
        }
        return true;
    }

    async function exportBlockList() {
        const blockList = await GM_getValue('blockList', []);
        if (blockList.length === 0) {
            showToast("내보낼 목록이 없습니다.");
            return;
        }

        const dataStr = JSON.stringify(blockList, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'dc_blocklist.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast("차단 목록을 'dc_blocklist.json' 파일로 내보냈습니다.");
    }

    async function importBlockList() {
        const importMode = await showImportChoiceModal();
        if (!importMode) {
            showToast("불러오기를 취소했습니다.");
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const content = event.target.result;
                    const importedList = JSON.parse(content);

                    if (!isValidBlockList(importedList)) {
                        throw new Error("유효하지 않은 파일 형식입니다.");
                    }

                    if (importMode === 'overwrite') {
                        await GM_setValue('blockList', importedList);
                        currentBlockList = importedList;
                        showToast(`차단 목록 ${importedList.length}개를 덮어썼습니다.`);

                    } else if (importMode === 'append') {
                        const oldList = await GM_getValue('blockList', []);
                        const mergedMap = new Map();

                        oldList.forEach(item => {
                            if (item && item.type && item.value) {
                                 mergedMap.set(`${item.type}:${item.value}`, item);
                            }
                        });

                        let appendedCount = 0;
                        importedList.forEach(item => {
                             if (item && item.type && item.value) {
                                 const key = `${item.type}:${item.value}`;
                                 if (!mergedMap.has(key)) {
                                     appendedCount++;
                                 }
                                 mergedMap.set(key, item);
                             }
                        });

                        const newList = Array.from(mergedMap.values());
                        await GM_setValue('blockList', newList);
                        currentBlockList = newList;
                        showToast(`차단 목록 ${appendedCount}개를 추가했습니다. (총 ${newList.length}개)`);
                    }

                    if (isBlockerEnabled) {
                        updateBlockerCss(currentBlockList);
                        unhideAllBlockedElements();
                        observeLogic();
                    }

                    renderMainMenuView();
                    document.getElementById('gm-blocker-panel').style.display = 'flex';

                } catch (err) {
                    console.error("[Blocker] Import Error:", err);
                    showToast(`불러오기 실패: ${err.message || '파일을 읽을 수 없습니다.'}`);
                }
            };
            reader.onerror = () => {
                showToast("파일을 읽는 중 오류가 발생했습니다.");
            };
            reader.readAsText(file);
        };

        input.click();
    }


    (async () => {
        currentBlockList = await GM_getValue('blockList', []);
        isBlockerEnabled = await GM_getValue('isBlockerEnabled', true);

        if (isBlockerEnabled) {
            updateBlockerCss(currentBlockList);
            observeLogic();
        }
    })();

    observer = new MutationObserver((mutations) => {
        if (!isBlockerEnabled) return;

        if (mutations.some(m => m.target.closest('#gm-blocker-wrapper'))) {
            return;
        }

        let nodesAdded = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                nodesAdded = true;
                break;
            }
        }
        if (nodesAdded) {
            updateBlockerCss(currentBlockList);
            observeLogic();
        }
    });

    function initialize() {
        if (!document.body) {
            window.addEventListener('DOMContentLoaded', initialize, { once: true });
            return;
        }
        createMainUI();

        if (isBlockerEnabled) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    initialize();

})();

