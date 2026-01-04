// ==UserScript==
// @name         주문 상세 및 로그 관리(재접수 요청, 보류 관리) 모달
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  [v1.1.3] Quiet Mode 적용 (로그 최소화) - Log Biz Details 및 주문조회상세 페이지에서 재접수 요청 및 보류 관리 모달을 띄우고 주문번호를 자동 검색합니다.
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/log/retrieveLogBizRequestDetailForm.do*
// @match        https://lims3.macrogen.com/ngs/order/retrieveNgsOrdForm.do*
// @match        https://lims3.macrogen.com/ngs/order/retrieveOrdSearchDetailForm.do*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557188/%EC%A3%BC%EB%AC%B8%20%EC%83%81%EC%84%B8%20%EB%B0%8F%20%EB%A1%9C%EA%B7%B8%20%EA%B4%80%EB%A6%AC%28%EC%9E%AC%EC%A0%91%EC%88%98%20%EC%9A%94%EC%B2%AD%2C%20%EB%B3%B4%EB%A5%98%20%EA%B4%80%EB%A6%AC%29%20%EB%AA%A8%EB%8B%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557188/%EC%A3%BC%EB%AC%B8%20%EC%83%81%EC%84%B8%20%EB%B0%8F%20%EB%A1%9C%EA%B7%B8%20%EA%B4%80%EB%A6%AC%28%EC%9E%AC%EC%A0%91%EC%88%98%20%EC%9A%94%EC%B2%AD%2C%20%EB%B3%B4%EB%A5%98%20%EA%B4%80%EB%A6%AC%29%20%EB%AA%A8%EB%8B%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================
    // CONFIG
    // ========================================
    const CONFIG = {
        STYLE_RE: { bg: '#fff0f3', text: '#d63031' }, // Soft Rose (Red-Pink)
        STYLE_HOLD: { bg: '#e0f2f1', text: '#00695c' }, // Soft Teal (Blue-Green)
        DEBUG: false,
        SEARCH_DELAY: 500,
        MODAL_Z_INDEX: 9999
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    function log(message, data = null) {
        if (CONFIG.DEBUG) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[${timestamp}] [LogBizModal] ${message}`, data || '');
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ========================================
    // MAIN LOGIC
    // ========================================

    function init() {
        log('Initializing...');
        injectModalStyles();

        // Wait for the injection point to be available
        // Case 1: <h3>Process</h3> (Log Biz Details)
        // Case 2: <h3>Processing Dept.</h3> (Order Detail)
        const checkInterval = setInterval(() => {
            let targetElement = null;

            const headers = Array.from(document.querySelectorAll('h3'));

            // Find 'Process' or 'Processing Dept.'
            const targetHeader = headers.find(h => {
                const text = h.textContent.trim();
                return text === 'Process' || text === 'Processing Dept.';
            });

            if (targetHeader) {
                targetElement = targetHeader;
            }

            if (targetElement) {
                clearInterval(checkInterval);
                injectButtons(targetElement);
            }
        }, 500);
    }

    function injectButtons(targetElement) {
        log('Injecting buttons...', targetElement);

        // Ensure header and buttons are on the same line
        targetElement.style.display = 'inline-block';
        targetElement.style.marginRight = '10px';

        // Check if buttons already exist to prevent duplicates
        if (targetElement.parentNode.querySelector('.logbiz-btn-container')) return;

        const container = document.createElement('div');
        container.className = 'logbiz-btn-container';
        container.style.display = 'inline-block';
        container.style.verticalAlign = 'middle';

        // Button 1: 재접수 요청 (RE)
        const btnRe = createButton('재접수 요청', CONFIG.STYLE_RE, () => {
            handleButtonClick('재접수 요청', 'https://lims3.macrogen.com/ngs/order/retrieveNgsReSmplReqManageForm.do?menuCd=NGS103000', 'RE');
        });

        // Button 2: 보류 관리 (HOLD)
        const btnHold = createButton('보류 관리', CONFIG.STYLE_HOLD, () => {
            handleButtonClick('보류 관리', 'https://lims3.macrogen.com/ngs/order/retrieveResrveManageForm.do?menuCd=NGS102000', 'HOLD');
        });

        container.appendChild(btnRe);
        container.appendChild(btnHold);

        // Append container after the target element
        targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
    }

    function createButton(text, style, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.backgroundColor = style.bg;
        btn.style.color = style.text;
        btn.style.border = `1px solid ${style.text}`;
        btn.style.padding = '5px 10px';
        btn.style.marginLeft = '5px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '3px';
        btn.style.fontSize = '12px';
        btn.style.fontWeight = 'bold';
        btn.type = 'button';
        btn.onclick = onClick;

        btn.addEventListener('mouseenter', () => { btn.style.opacity = '0.8'; });
        btn.addEventListener('mouseleave', () => { btn.style.opacity = '1'; });

        return btn;
    }

    async function handleButtonClick(title, url, type) {
        const ordNo = getOrderNo();
        log(`Button clicked: ${title}, Order No: ${ordNo}, Type: ${type}`);

        if (!ordNo) {
            alert('주문번호(Order No)를 찾을 수 없습니다.\n화면에 주문 정보가 로드되었는지 확인해주세요.');
            return;
        }

        createAndShowModal(title, url, ordNo, type);
    }

    function getOrderNo() {
        // Strategy 0: Hidden Input (Most reliable for Order Detail pages)
        const hiddenInput = document.querySelector('input[name="ordNo"]');
        if (hiddenInput && hiddenInput.value.trim() !== '') {
            log('Order No found in hidden input');
            return hiddenInput.value.trim();
        }

        // Strategy 1: Check IBSheets (Log Biz Details)
        // ibsLogBizReqOrd
        if (typeof window.ibsLogBizReqOrd !== 'undefined') {
            try {
                if (window.ibsLogBizReqOrd.RowCount() > 0) {
                    // Assuming 'ordNo' is the SaveName
                    const val = window.ibsLogBizReqOrd.GetCellValue(1, "ordNo");
                    if (val && val.trim() !== '') return val.trim();
                }
            } catch (e) { log('Error reading ibsLogBizReqOrd', e); }
        }

        // ibsLogBizReqAdd
        if (typeof window.ibsLogBizReqAdd !== 'undefined') {
            try {
                if (window.ibsLogBizReqAdd.RowCount() > 0) {
                    const val = window.ibsLogBizReqAdd.GetCellValue(1, "ordNo");
                    if (val && val.trim() !== '') return val.trim();
                }
            } catch (e) { log('Error reading ibsLogBizReqAdd', e); }
        }

        // Strategy 2: DOM Search (Fallback)
        // User provided example: <td ...>HN00259464</td>
        // Pattern: 2 Uppercase Letters + 8 Digits (Total 10 chars)
        const tds = Array.from(document.querySelectorAll('td'));
        const orderNoPattern = /^[A-Z]{2}\d{8}$/;

        for (const td of tds) {
            const text = td.textContent.trim();
            if (orderNoPattern.test(text)) {
                log(`Order No found in DOM: ${text}`);
                return text;
            }
        }

        // Strategy 3: Unity Search Input (Top Header)
        const unitySearch = document.getElementById('unitySearch');
        if (unitySearch && unitySearch.value.trim() !== '') {
            const val = unitySearch.value.trim();
            if (orderNoPattern.test(val)) {
                log('Order No found in Unity Search');
                return val;
            }
        }

        return null;
    }

    // ========================================
    // MODAL & AUTOMATION
    // ========================================

    function injectModalStyles() {
        if (document.getElementById('logbiz-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'logbiz-modal-styles';
        style.innerHTML = `
            .logbiz-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0); /* Transparent background */
                z-index: ${CONFIG.MODAL_Z_INDEX};
                pointer-events: none; /* Allow clicks to pass through overlay area */
            }
            .logbiz-modal-content {
                position: absolute; /* Changed to absolute for dragging */
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%; /* Default width */
                height: 90%; /* Default height */
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                pointer-events: auto; /* Re-enable pointer events for the modal itself */
                min-width: 300px;
                min-height: 200px;
            }
            .logbiz-modal-header {
                padding: 10px 15px;
                background-color: #f1f1f1;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                font-weight: bold;
                color: #333;
                cursor: move; /* Indicate draggable */
                user-select: none;
            }
            .logbiz-modal-close {
                font-size: 24px;
                font-weight: bold;
                color: #888;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0 5px;
            }
            .logbiz-modal-close:hover { color: #000; }
            .logbiz-modal-body {
                flex-grow: 1;
                position: relative;
                overflow: hidden;
            }
            .logbiz-modal-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                transform: translate(-50%, -50%);
                z-index: 10;
            }
            .logbiz-modal-resize-handle {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 15px;
                height: 15px;
                cursor: nwse-resize;
                background: linear-gradient(135deg, transparent 50%, #ccc 50%);
                z-index: 20;
            }
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    function createAndShowModal(title, url, ordNo, type) {
        // Remove existing modal
        const oldModal = document.getElementById('logbiz-modal-overlay');
        if (oldModal) oldModal.remove();

        // Create Modal DOM
        const overlay = document.createElement('div');
        overlay.id = 'logbiz-modal-overlay';
        overlay.className = 'logbiz-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'logbiz-modal-content';

        const header = document.createElement('div');
        header.className = 'logbiz-modal-header';
        header.innerHTML = `<span>${title} (Order: ${ordNo})</span>`;

        const closeButton = document.createElement('button');
        closeButton.className = 'logbiz-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => overlay.remove();
        header.appendChild(closeButton);

        const body = document.createElement('div');
        body.className = 'logbiz-modal-body';

        const spinner = document.createElement('div');
        spinner.className = 'logbiz-modal-spinner';
        body.appendChild(spinner);

        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.visibility = 'hidden';
        body.appendChild(iframe);

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'logbiz-modal-resize-handle';
        modal.appendChild(resizeHandle);

        modal.appendChild(header);
        modal.appendChild(body);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Make Draggable
        makeDraggable(modal, header);

        // Make Resizable
        makeResizable(modal, resizeHandle);

        // Load Iframe
        iframe.src = url;
        iframe.onload = async () => {
            log('Iframe loaded');
            try {
                const doc = iframe.contentWindow.document;

                // Automate Search
                await automateSearch(doc, ordNo, type);

                spinner.style.display = 'none';
                iframe.style.visibility = 'visible';
            } catch (e) {
                log('Automation error', e);
                spinner.style.display = 'none';
                iframe.style.visibility = 'visible';
            }
        };
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            // Fix position if transform is present (initial state)
            // This prevents the modal from jumping to center when drag starts
            const style = window.getComputedStyle(element);
            if (style.transform !== 'none') {
                const rect = element.getBoundingClientRect();
                element.style.transform = 'none';
                element.style.left = rect.left + 'px';
                element.style.top = rect.top + 'px';
            }

            // Disable iframe pointer events to prevent event stealing
            const iframe = element.querySelector('iframe');
            if (iframe) iframe.style.pointerEvents = 'none';

            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // Re-enable iframe pointer events
            const iframe = element.querySelector('iframe');
            if (iframe) iframe.style.pointerEvents = 'auto';

            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function makeResizable(element, handle) {
        handle.addEventListener('mousedown', function (e) {
            e.preventDefault();

            // Fix position if transform is present (initial state)
            const style = window.getComputedStyle(element);
            if (style.transform !== 'none') {
                const rect = element.getBoundingClientRect();
                element.style.transform = 'none';
                element.style.left = rect.left + 'px';
                element.style.top = rect.top + 'px';
            }

            // Disable iframe pointer events to prevent event stealing
            const iframe = element.querySelector('iframe');
            if (iframe) iframe.style.pointerEvents = 'none';

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

            function doDrag(e) {
                element.style.width = (startWidth + e.clientX - startX) + 'px';
                element.style.height = (startHeight + e.clientY - startY) + 'px';
            }

            function stopDrag() {
                // Re-enable iframe pointer events
                const iframe = element.querySelector('iframe');
                if (iframe) iframe.style.pointerEvents = 'auto';

                document.documentElement.removeEventListener('mousemove', doDrag, false);
                document.documentElement.removeEventListener('mouseup', stopDrag, false);
            }

            document.documentElement.addEventListener('mousemove', doDrag, false);
            document.documentElement.addEventListener('mouseup', stopDrag, false);
        }, false);
    }

    async function automateSearch(doc, ordNo, type) {
        log(`Starting automation for type: ${type}`);
        await delay(500);

        // 1. Find Search Type Dropdown (searchBaseCd)
        const searchTypeSelect = doc.getElementById('searchBaseCd');
        if (!searchTypeSelect) {
            log('Search type dropdown (searchBaseCd) not found');
            // Fallback logic if needed, or just proceed to input
        } else {
            // Set value based on type
            if (type === 'RE') {
                searchTypeSelect.value = '04'; // Ord. # for Re-request
            } else if (type === 'HOLD') {
                searchTypeSelect.value = '01'; // Ord. # for Hold Management
            }
            searchTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 2. Find Search Input (searchBase)
        const input = doc.getElementById('searchBase');
        if (!input) {
            throw new Error('Search input (searchBase) not found');
        }

        // 3. Set Value
        input.value = ordNo;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // 4. Action based on type
        if (type === 'RE') {
            // For Re-request, click search button
            const btn = doc.getElementById('btnSearch');
            if (btn) {
                log('Clicking search button...');
                btn.click();
            } else {
                log('Search button (btnSearch) not found');
            }
        } else if (type === 'HOLD') {
            // For Hold Management, DO NOT click search
            log('Hold Management: Skipping search button click as requested.');
        }
    }

    // Run Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
