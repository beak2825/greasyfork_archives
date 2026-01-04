// ==UserScript==
// @name         LIMS 작업선택 팝업 필터
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  작업선택 팝업 전용 숨김 및 필터링 (다크 모드, 취소선 지원)
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/com/retrieveWorkSelectPopup.do*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559436/LIMS%20%EC%9E%91%EC%97%85%EC%84%A0%ED%83%9D%20%ED%8C%9D%EC%97%85%20%ED%95%84%ED%84%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559436/LIMS%20%EC%9E%91%EC%97%85%EC%84%A0%ED%83%9D%20%ED%8C%9D%EC%97%85%20%ED%95%84%ED%84%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===============================================
    // Configuration & Styles (Modern / Dark Mode)
    // ===============================================
    const STORAGE_KEY = 'lims_work_select_hidden_depts'; // Key separated to avoid conflicts

    GM_addStyle(`
        .lims-dept-filter-btn {
            cursor: pointer;
            font-size: 14px;
            margin-left: 5px;
            vertical-align: middle;
            background: none;
            border: none;
            padding: 0;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .lims-dept-filter-btn:hover {
            opacity: 1;
        }
        /* Edit Mode Styles - Strike-through for Modern Look */
        .dept-item-hidden-edit {
            opacity: 0.8 !important;
            text-decoration: line-through !important;
            text-decoration-color: #d32f2f !important;
            text-decoration-thickness: 2px !important;
            background-color: #ffcdd2 !important;
            border-radius: 3px;
            padding: 2px 4px;
        }
        .dept-item-visible-edit {
            cursor: pointer;
            opacity: 1 !important;
        }
        .dept-item-wrapper {
            display: inline-block;
            margin-right: 15px;
            margin-bottom: 5px;
            padding: 2px 4px;
            transition: all 0.2s;
        }
        .dept-item-wrapper:hover {
            background-color: #f5f5f5;
        }
        /* Normal Mode: Hide elements */
        .dept-item-hidden {
            display: none !important;
        }
    `);

    // ===============================================
    // Main Method
    // ===============================================

    function init() {
        console.log('[Work Select Filter] Initializing...');

        let header = null;
        let container = null;

        // Strategy: "Work Select Popup"
        const candidates = Array.from(document.querySelectorAll('.pop_tit, h1, h2, h3, .title'));
        for (const el of candidates) {
            if (el.textContent.includes('작업선택')) {
                header = el;
                break;
            }
        }
        if (!header) {
            header = document.querySelector('.pop_header') || document.body.firstElementChild;
        }

        const firstCheckbox = document.querySelector('input[type="checkbox"]');
        if (firstCheckbox) {
            container = firstCheckbox.closest('tbody') || firstCheckbox.closest('.pop_cont') || firstCheckbox.closest('div');
        }

        if (!header || !container) {
            console.log('[Work Select Filter] Header or Container not found.');
            return;
        }

        console.log('[Work Select Filter] Elements Found:', header, container);
        injectControls(header, container);
        applyFilters(container, false);
    }

    // ===============================================
    // Logic
    // ===============================================

    let isEditMode = false;

    function getHiddenDepts() {
        return GM_getValue(STORAGE_KEY, []);
    }

    function setHiddenDepts(list) {
        GM_setValue(STORAGE_KEY, list);
    }

    function toggleHiddenDept(name) {
        const list = getHiddenDepts();
        const index = list.indexOf(name);
        if (index > -1) {
            list.splice(index, 1); // Unhide
        } else {
            list.push(name); // Hide
        }
        setHiddenDepts(list);
    }

    function injectControls(header, container) {
        if (header.querySelector('.lims-dept-filter-container')) return;

        // Force header width for layout
        header.style.whiteSpace = 'normal';
        header.style.textAlign = 'left';

        // Main Container
        const mainWrapper = document.createElement('div');
        mainWrapper.className = 'lims-dept-filter-container';
        mainWrapper.style.cssText = `
            display: inline-flex;
            flex-direction: row;
            align-items: center;
            margin-left: 10px;
            vertical-align: middle;
        `;

        // Row 1: Buttons
        const buttonRow = document.createElement('div');
        buttonRow.className = 'lims-filter-btn-row';
        buttonRow.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            margin: 0;
            padding: 0;
        `;

        header.appendChild(mainWrapper);
        mainWrapper.appendChild(buttonRow);

        // Settings Button
        const btn = document.createElement('button');
        btn.innerHTML = '⚙️ 설정';
        btn.title = '부서 숨김 관리 (Edit Mode)';
        btn.className = 'lims-dept-filter-btn';
        btn.type = 'button';

        // Dark Mode Style
        btn.style.cssText = `
            background-color: #37474f;
            color: #eceff1;
            border: 1px solid #90a4ae;
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            line-height: normal;
            white-space: nowrap;
        `;

        btn.onclick = () => {
            isEditMode = !isEditMode;
            updateModeUI(mainWrapper, container, btn);
        };

        buttonRow.appendChild(btn);

        // Checkbox Wrapping & Listeners
        initCheckboxListeners(container);
    }

    function updateModeUI(mainWrapper, container, btn) {
        const buttonRow = mainWrapper.querySelector('.lims-filter-btn-row');

        // Cleanup
        const oldStatus = mainWrapper.querySelector('.lims-filter-status-row');
        if (oldStatus) oldStatus.remove();
        const oldAux = buttonRow.querySelectorAll('.lims-filter-aux');
        oldAux.forEach(el => el.remove());

        if (isEditMode) {
            // Reset Button
            const resetBtn = document.createElement('button');
            resetBtn.className = 'lims-filter-aux';
            resetBtn.innerHTML = '🔄 초기화';
            resetBtn.title = '모든 숨김 설정을 해제합니다';
            resetBtn.type = 'button';
            resetBtn.style.cssText = `
                background-color: #3e2723;
                color: #ffcdd2;
                border: 1px solid #e57373;
                padding: 4px 8px;
                cursor: pointer;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                margin-left: 5px;
            `;
            resetBtn.onclick = () => {
                if (confirm('모든 숨김 처리를 해제하시겠습니까? (초기화)')) {
                    setHiddenDepts([]);
                    applyFilters(container, true);
                }
            };
            buttonRow.appendChild(resetBtn);

            // Status Row
            const statusRow = document.createElement('div');
            statusRow.className = 'lims-filter-status-row';
            statusRow.style.cssText = `margin-left: 10px; font-size:11px; font-weight:bold; color:#ffcc80;`;
            statusRow.textContent = '(현재 편집 중..)';
            mainWrapper.appendChild(statusRow);

            // Save Style
            btn.innerHTML = '💾 저장';
            btn.style.backgroundColor = '#1b5e20';
            btn.style.color = '#a5d6a7';
            btn.style.borderColor = '#66bb6a';
            btn.style.fontWeight = '800';

        } else {
            // Default Style
            btn.innerHTML = '⚙️ 설정';
            btn.style.backgroundColor = '#37474f';
            btn.style.color = '#eceff1';
            btn.style.borderColor = '#90a4ae';
            btn.style.fontWeight = '800';
        }

        applyFilters(container, isEditMode);
    }

    function initCheckboxListeners(container) {
        const labels = Array.from(container.querySelectorAll('label'));
        labels.forEach(label => {
            if (label.closest('.dept-unit')) return;
            let checkbox = label.previousElementSibling;
            if (!checkbox || checkbox.tagName !== 'INPUT') {
                const innerInput = label.querySelector('input');
                if (innerInput) {
                    label.classList.add('dept-unit');
                    label.style.display = 'inline-block';
                    label.style.marginRight = '10px';
                    return;
                }
                let prev = label.previousSibling;
                while (prev && prev.nodeType === 3) { prev = prev.previousSibling; }
                if (prev && prev.tagName === 'INPUT' && prev.type === 'checkbox') checkbox = prev;
            }
            if (checkbox && checkbox.tagName === 'INPUT') {
                const wrapper = document.createElement('span');
                wrapper.className = 'dept-unit';
                wrapper.style.display = 'inline-block';
                wrapper.style.marginRight = '10px';
                wrapper.style.marginBottom = '2px';
                wrapper.style.cursor = 'pointer';
                checkbox.parentNode.insertBefore(wrapper, checkbox);
                wrapper.appendChild(checkbox);
                wrapper.appendChild(label);
            }
        });

        const units = container.querySelectorAll('.dept-unit');
        units.forEach(unit => {
            if (unit.dataset.hasListener) return;
            unit.dataset.hasListener = 'true';
            unit.addEventListener('click', (e) => {
                if (!isEditMode) return;
                e.preventDefault();
                e.stopPropagation();
                const name = unit.textContent.trim();
                toggleHiddenDept(name);
                applyFilters(container, isEditMode);
            });
        });
    }

    function applyFilters(container, editMode) {
        const hiddenList = getHiddenDepts();
        const units = container.querySelectorAll('.dept-unit');

        units.forEach(unit => {
            const name = unit.textContent.trim();
            const isHidden = hiddenList.includes(name);
            const checkboxes = unit.querySelectorAll('input[type="checkbox"]');

            unit.classList.remove('dept-item-hidden', 'dept-item-hidden-edit', 'dept-item-visible-edit');

            if (editMode) {
                // Edit Mode: Show all, differentiate style with strike-through
                if (isHidden) {
                    unit.classList.add('dept-item-hidden-edit');
                    unit.title = '숨김 처리됨 (클릭하여 해제)';
                } else {
                    unit.classList.add('dept-item-visible-edit');
                    unit.title = '보이는 상태 (클릭하여 숨김)';
                }
                checkboxes.forEach(cb => { cb.disabled = true; });

            } else {
                // Normal Mode: Hide hidden items entirely
                if (isHidden) {
                    unit.classList.add('dept-item-hidden');
                }
                checkboxes.forEach(cb => { cb.disabled = false; });
            }
        });
    }

    // Wait for DOM
    const observer = new MutationObserver((mutations) => {
        const textFound = document.body.innerText.includes('작업선택');
        if (textFound) {
            if (document.querySelector('.lims-dept-filter-container')) return;
            observer.disconnect();
            init();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState !== 'loading') {
        setTimeout(init, 500);
    }

})();
