// ==UserScript==
// @name         LIMS 로그 관리 부서 숨김 필터
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [v1.0] Processing Dept. 항목 중 불필요한 부서를 숨기고 관리하는 기능을 제공합니다. (톱니바퀴 아이콘으로 설정 진입)
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/log/retrieveLogBizRequestRegPopup.do*
// @match        https://lims3.macrogen.com/ngs/log/retrieveLogBizRequestRegForm.do*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559198/LIMS%20%EB%A1%9C%EA%B7%B8%20%EA%B4%80%EB%A6%AC%20%EB%B6%80%EC%84%9C%20%EC%88%A8%EA%B9%80%20%ED%95%84%ED%84%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559198/LIMS%20%EB%A1%9C%EA%B7%B8%20%EA%B4%80%EB%A6%AC%20%EB%B6%80%EC%84%9C%20%EC%88%A8%EA%B9%80%20%ED%95%84%ED%84%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===============================================
    // Configuration & Styles
    // ===============================================
    const STORAGE_KEY = 'lims_hidden_depts';
    const CHECKBOX_WRAPPER_SELECTOR = 'label'; // 체크박스가 label로 감싸져 있다고 가정
    // (만약 label이 아니라면 span이나 div일 수도 있음. 스크린샷 상으로는 텍스트와 체크박스가 같이 있으므로 label일 확률 높음)

    GM_addStyle(`
        .lims-dept-filter-btn {
            cursor: pointer;
            font-size: 14px;
            margin-left: 5px;
            vertical-align: middle;
            background: none;
            border: none;
            padding: 0;
            opacity: 0.6;
            transition: opacity 0.2s;
        }
        .lims-dept-filter-btn:hover {
            opacity: 1;
        }
        /* Edit Mode Styles */
        .dept-item-hidden-edit {
            opacity: 0.4 !important;
            text-decoration: line-through !important;
            background-color: #ffebee !important; /* 연한 빨강 배경 */
            border-radius: 3px;
        }
        .dept-item-visible-edit {
            /* 기본 상태 */
            cursor: pointer;
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
        /* Modal for detailed management (optional, simpler to toggle in-place for now) */
        .filter-mode-indicator {
            display: inline-block;
            padding: 2px 6px;
            background-color: #d32f2f;
            color: white;
            font-size: 11px;
            border-radius: 3px;
            margin-left: 5px;
            vertical-align: middle;
            cursor: pointer;
        }
    `);

    // ===============================================
    // Main Method
    // ===============================================

    function init() {
        console.log('[LIMS Filter] Initializing...');

        // 1. Find the Header (TH)
        // Explicitly look for 'th' tags first, as the screenshot strongly suggests a table structure.
        let targetHeader = null;
        const ths = Array.from(document.querySelectorAll('th'));
        for (const th of ths) {
            if (th.textContent.includes('Processing Dept')) {
                targetHeader = th;
                console.log('[LIMS Filter] Found specific TH:', th);
                break;
            }
        }

        // Fallback: If no TH found, try 'td' that acts as a header (sometimes used in old layouts)
        if (!targetHeader) {
            const tds = Array.from(document.querySelectorAll('td'));
            for (const td of tds) {
                // Check if it looks like a header (e.g., usually short text, distinct background?)
                // Just relying on text for now.
                if (td.textContent.includes('Processing Dept') && td.innerText.length < 50) {
                    // length check to avoid finding the container TD itself if it mentions the text
                    targetHeader = td;
                    console.log('[LIMS Filter] Found TD acting as header:', td);
                    break;
                }
            }
        }

        if (!targetHeader) {
            console.log('[LIMS Filter] Processing Dept. header not found. (Check selector)');
            return;
        }

        // 2. Find the Container (TD)
        // Usually the next sibling element in the row.
        let container = targetHeader.nextElementSibling;

        // Validation: Verify container is a TD and has checkboxes
        if (!container || container.tagName !== 'TD') {
            console.log('[LIMS Filter] Next sibling is not a TD, checking parent row...');
            const row = targetHeader.closest('tr');
            if (row) {
                // It might be in the same row?
                // Let's look for a TD that matches our criteria (contains labels/checkboxes)
                const tds = row.querySelectorAll('td');
                // Exclude the header itself if it was a td
                for (const td of tds) {
                    if (td !== targetHeader && td.querySelector('input[type="checkbox"]')) {
                        container = td;
                        break;
                    }
                }
            }
        }

        if (!container) {
            console.error('[LIMS Filter] Checkbox container (TD) not found.');
            return;
        }

        console.log('[LIMS Filter] Container found:', container);

        // Success: Inject controls
        injectControls(targetHeader, container);
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
        // Prevent duplicate injection
        if (header.querySelector('.lims-dept-filter-container')) {
            return;
        }

        // Force header width for layout
        header.style.whiteSpace = 'normal';
        header.style.textAlign = 'left'; // Ensure parent aligns left if possible

        // Main Container - Flex Column to handle rows (Buttons row + Status row)
        const mainWrapper = document.createElement('div');
        mainWrapper.className = 'lims-dept-filter-container';
        mainWrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* Strict Left Align */
            margin-top: 5px;
            width: 100%;
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

        // Append to header
        header.appendChild(mainWrapper);
        mainWrapper.appendChild(buttonRow);

        // 1. Settings Button (Gear)
        const btn = document.createElement('button');
        btn.innerHTML = '⚙️ 설정';
        btn.title = '부서 숨김 관리 (Edit Mode)';
        btn.className = 'lims-dept-filter-btn';
        btn.type = 'button';

        // High Contrast Style
        const STYLE_DEFAULT = `
            background-color: #f3f3ff;
            color: #1a237e; /* Very Dark Blue/Purple */
            border: 1px solid #1a237e;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 800; /* Extra Bold */
            line-height: normal;
            vertical-align: middle;
            transition: all 0.2s;
            white-space: nowrap;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            margin: 0; /* No external margins */
        `;

        btn.style.cssText = STYLE_DEFAULT;

        // Hover effects
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#1a237e';
            btn.style.color = '#ffffff';
        });
        btn.addEventListener('mouseleave', () => {
            if (btn.innerText.includes('💾')) { // Save mode
                btn.style.backgroundColor = '#e8f5e9';
                btn.style.color = '#1b5e20';
                btn.style.borderColor = '#1b5e20';
            } else {
                btn.style.backgroundColor = '#f3f3ff';
                btn.style.color = '#1a237e';
                btn.style.borderColor = '#1a237e';
            }
        });

        btn.onclick = () => {
            isEditMode = !isEditMode;
            updateModeUI(mainWrapper, container, btn);
        };

        buttonRow.appendChild(btn);

        // ... (Label wrapping logic/click listeners remain) ...
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
                applyFilters(container, true);
            });
        });
    }

    function updateModeUI(mainWrapper, container, btn) {
        // Find existing rows
        const buttonRow = mainWrapper.querySelector('.lims-filter-btn-row');

        // Remove existing auxiliary items in button row (Reset button)
        // And Status row if exists
        const oldStatus = mainWrapper.querySelector('.lims-filter-status-row');
        if (oldStatus) oldStatus.remove();

        const oldAux = buttonRow.querySelectorAll('.lims-filter-aux');
        oldAux.forEach(el => el.remove());

        if (isEditMode) {
            // 1. Reset Button: "🔄 초기화" (Next to Save button)
            const resetBtn = document.createElement('button');
            resetBtn.className = 'lims-filter-aux';
            resetBtn.innerHTML = '🔄 초기화';
            resetBtn.title = '모든 숨김 설정을 해제합니다';
            resetBtn.type = 'button';

            // High Contrast Red
            resetBtn.style.cssText = `
                background-color: #ffebee; 
                color: #c62828; /* Strong Red */
                border: 1px solid #c62828;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 800;
                line-height: normal;
                vertical-align: middle;
                transition: all 0.2s;
                white-space: nowrap;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                margin: 0;
            `;

            resetBtn.onclick = () => {
                if (confirm('모든 숨김 처리를 해제하시겠습니까? (초기화)')) {
                    setHiddenDepts([]);
                    applyFilters(container, true);
                }
            };

            buttonRow.appendChild(resetBtn);

            // 2. Status Row: "(현재 편집 중..)" (On New Line)
            const statusRow = document.createElement('div');
            statusRow.className = 'lims-filter-status-row';
            statusRow.style.cssText = `
                margin-top: 4px;
                font-size: 11px;
                font-weight: 800;
                color: #e65100; /* Dark Orange */
                text-align: left;
            `;
            statusRow.textContent = '(현재 편집 중..)';

            mainWrapper.appendChild(statusRow);

            // Change main button to SAVE style
            btn.innerHTML = '💾 저장';
            btn.style.backgroundColor = '#e8f5e9';
            btn.style.color = '#1b5e20'; // Dark Green
            btn.style.borderColor = '#1b5e20';
            btn.style.fontWeight = '800';

        } else {
            console.log('[LIMS Filter] Exiting Edit Mode');
            btn.innerHTML = '⚙️ 설정';
            // Restore default style
            btn.style.backgroundColor = '#f3f3ff';
            btn.style.color = '#1a237e';
            btn.style.borderColor = '#1a237e';
            btn.style.fontWeight = '800';
        }

        applyFilters(container, isEditMode);
    }

    function applyFilters(container, editMode) {
        const hiddenList = getHiddenDepts();
        // Target units instead of just labels
        const units = container.querySelectorAll('.dept-unit');

        units.forEach(unit => {
            const name = unit.textContent.trim();
            const isHidden = hiddenList.includes(name);
            const checkboxes = unit.querySelectorAll('input[type="checkbox"]');

            // Reset classes (Ref: unit, NOT label)
            unit.classList.remove('dept-item-hidden', 'dept-item-hidden-edit', 'dept-item-visible-edit');

            if (editMode) {
                // Edit Mode: Show all, differentiate style
                if (isHidden) {
                    unit.classList.add('dept-item-hidden-edit');
                    unit.title = '숨김 처리됨 (클릭하여 해제)';
                } else {
                    unit.classList.add('dept-item-visible-edit');
                    unit.title = '보이는 상태 (클릭하여 숨김)';
                }
                // Disable checkbox
                checkboxes.forEach(cb => { cb.disabled = true; });

            } else {
                // Normal Mode: Hide hidden items entirely
                if (isHidden) {
                    unit.classList.add('dept-item-hidden');
                    // display: none is defined in CSS for .dept-item-hidden
                }
                // Enable checkbox
                checkboxes.forEach(cb => { cb.disabled = false; });
            }
        });
    }

    // Wait for DOM
    const observer = new MutationObserver((mutations) => {
        // "Processing Dept."가 로드되었는지 확인
        const headers = Array.from(document.querySelectorAll('th, label')); // 범용 탐색
        const found = headers.some(el => el.innerText && el.innerText.includes('Processing Dept.'));
        if (found) {
            observer.disconnect();
            init();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // Fallback: DOMContentLoaded
    if (document.readyState !== 'loading') {
        setTimeout(init, 500); // 약간의 딜레이
    }

})();
