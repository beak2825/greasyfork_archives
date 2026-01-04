// ==UserScript==
// @name         手机审核 Auto-Clicker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Clicks the specified menu item and the "审核" button of the last table item without continuous polling.
// @author       ChatGPT
// @match        https://www.ejy365.com/czcytzjt_first
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/554692/%E6%89%8B%E6%9C%BA%E5%AE%A1%E6%A0%B8%20Auto-Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/554692/%E6%89%8B%E6%9C%BA%E5%AE%A1%E6%A0%B8%20Auto-Clicker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const MENU_ITEM_TEXT = '企业忘记手机号申请审核';
    const FILTER_START_DATE_STR = '2025-01-01 00:00:00';
    const FILTER_START_DATE_OBJ = new Date(FILTER_START_DATE_STR);

    // !!! IMPORTANT: CHANGE THIS TO THE ACTUAL ID OF YOUR AUDIT STATUS COMBOBOX/DROPDOWN on the main page
    const MAIN_PAGE_AUDIT_STATUS_COMBOBOX_ID = 'search_audit_status'; // 假设主页面审核状态下拉框的ID
    const MAIN_PAGE_AUDIT_OPTION_TEXT = '审核';

    // iframe 的父 div ID
    const IFRAME_PARENT_DIV_ID = 'w1';

    // 审核通过面板中的ID和要选择的文本
    const IFRAME_AUDIT_STATUS_SELECT_ID = 'status'; // iframe内部 "审核状态" 下拉框的ID
    const IFRAME_AUDIT_PASS_TEXT = '审核通过';
    const IFRAME_SAVE_BUTTON_ID = 'log_save'; // iframe内部 "保存" 按钮的ID

    // iframe 内部 datagrid 表格的 ID，用于 EasyUI API 调用
    const IFRAME_DATAGRID_TABLE_ID = 'hyinfo_table'; // 从你提供的HTML中看到这个ID


    /**
     * Simulates a mouse event (e.g., 'click', 'mousedown', 'mouseup') on a given element.
     * This is often more reliable for complex frameworks than element.click().
     * @param {HTMLElement} element - The DOM element to click.
     * @param {string} eventType - The type of mouse event to dispatch (e.g., 'click').
     * @returns {boolean} - True if event was dispatched successfully, false otherwise.
     */
    function simulateMouseEvent(element, eventType = 'click') {
        if (!element || typeof element.dispatchEvent !== 'function') {
            console.error(`[Userscript] Cannot dispatch event: element is invalid or does not support dispatchEvent for ${eventType}.`, element);
            return false;
        }

        const event = new MouseEvent(eventType, {
            view: unsafeWindow,
            bubbles: true,
            cancelable: true
        });

        const success = element.dispatchEvent(event);
        console.log(`[Userscript] Dispatched MouseEvent "${eventType}" on element:`, element, `Success: ${success}`);
        return success;
    }

    /**
     * Checks for "No Data" messages within a datagrid.
     * @param {Document} doc - The document to search within (e.g., main document or iframe document).
     * @returns {boolean} - True if a "No Data" message is found, false otherwise.
     */
    function checkForNoDataMessage(doc = document) {
        const commonNoDataSelectors = [
            '.datagrid-body .datagrid-empty-text',
            '.datagrid-body:not(.datagrid-f) div[style*="text-align: center"]'
        ];

        for (const selector of commonNoDataSelectors) {
            const el = doc.querySelector(selector);
            if (el) {
                const text = el.textContent.trim();
                if (text.includes('无数据显示') || text.toLowerCase().includes('no records') || text.toLowerCase().includes('no data')) {
                    console.log(`[Userscript] Found "No data" message via selector "${selector}" in ${doc === document ? 'main page' : 'iframe'}: "${text}"`);
                    return true;
                }
            }
        }

        const datagridBody = doc.querySelector('.datagrid-body');
        if (datagridBody) {
             const bodyText = datagridBody.textContent.trim();
             if (bodyText.includes('无数据显示') || bodyText.toLowerCase().includes('no records') || bodyText.toLowerCase().includes('no data')) {
                 console.log(`[Userscript] Found "No data" message in datagrid body in ${doc === document ? 'main page' : 'iframe'}: "${bodyText}"`);
                 return true;
             }
        }
        return false;
    }

    /**
     * Handles the logic for interacting with the iframe:
     * 1. Checks for "No Data" in "选择系统会员信息" datagrid.
     * 2. Selects all rows in the "选择系统会员信息" datagrid.
     * 3. Selects "审核通过" in the audit status dropdown.
     * 4. Clicks "保存".
     */
    function handleIframeContent() {
        console.log('[Userscript] Attempting to find and interact with the iframe content...');

        const iframeElement = document.querySelector(`#${IFRAME_PARENT_DIV_ID} iframe`);
        if (!iframeElement) {
            console.error(`[Userscript] iframe not found inside parent div with ID '${IFRAME_PARENT_DIV_ID}'. Cannot proceed.`);
            return;
        }
        console.log('[Userscript] Found iframe element:', iframeElement);

        setTimeout(() => {
            let iframeDoc;
            try {
                if (!iframeElement.contentWindow || !iframeElement.contentWindow.document) {
                     console.warn('[Userscript] iframe.contentWindow.document not yet available. Retrying...');
                     setTimeout(handleIframeContent, 500); // Retry after 500ms
                     return;
                }
                iframeDoc = iframeElement.contentWindow.document;
            } catch (e) {
                console.error('[Userscript] Could not access iframe contentDocument. Possible cross-origin issue or iframe not ready:', e);
                return;
            }

            if (!iframeDoc) {
                console.error('[Userscript] iframe document object is null after retry. iframe content might not be loaded.');
                return;
            }

            console.log('[Userscript] Successfully accessed iframe document. Proceeding to interact with internal elements.');

            // Ensure jQuery and EasyUI are loaded within THE IFRAME'S context
            if (iframeElement.contentWindow.$ && iframeElement.contentWindow.$.fn.combobox && iframeElement.contentWindow.$.fn.datagrid) {
                const $iframe = iframeElement.contentWindow.$; // Get jQuery object from iframe's window

                // --- Step 1 & 2: Check for "No Data" and then select all rows in "选择系统会员信息" datagrid ---
                // Wait for a moment for the datagrid to fully render its content
                setTimeout(() => {
                    const hyinfoDatagrid = $iframe(`#${IFRAME_DATAGRID_TABLE_ID}`);

                    if (checkForNoDataMessage(iframeDoc)) { // Check for no data message specific to this datagrid area
                        console.log('[Userscript] "选择系统会员信息" datagrid shows "无数据显示". No rows to select.');
                    } else if (hyinfoDatagrid.length && hyinfoDatagrid.datagrid) {
                        console.log(`[Userscript] Found datagrid #${IFRAME_DATAGRID_TABLE_ID}. Attempting to check all rows...`);
                        hyinfoDatagrid.datagrid('checkAll'); // Use EasyUI API to check all rows
                        console.log('[Userscript] Successfully called datagrid("checkAll").');
                    } else {
                        console.warn(`[Userscript] Datagrid with ID '#${IFRAME_DATAGRID_TABLE_ID}' not found or not initialized as EasyUI datagrid. Attempting fallback: click header checkbox.`);
                        // Fallback: manually click the header checkbox if API fails or isn't desired
                        const headerCheckbox = iframeDoc.querySelector('.datagrid-header-check input[type="checkbox"]');
                        if (headerCheckbox && !headerCheckbox.checked) {
                            console.log('[Userscript] Found datagrid header checkbox, attempting to click it.');
                            simulateMouseEvent(headerCheckbox, 'click');
                        } else if (headerCheckbox && headerCheckbox.checked) {
                            console.log('[Userscript] Datagrid header checkbox is already checked.');
                        } else {
                            console.warn('[Userscript] Datagrid header checkbox not found in iframe. Cannot select rows.');
                        }
                    }

                    // --- Step 3: Select "审核通过" in the audit status dropdown ---
                    const auditStatusComboboxInIframe = $iframe(`#${IFRAME_AUDIT_STATUS_SELECT_ID}`);
                    if (auditStatusComboboxInIframe.length) {
                        console.log(`[Userscript] Found iframe audit status combobox: #${IFRAME_AUDIT_STATUS_SELECT_ID}`);

                        const auditPassValue = '1'; // From <option value="1">审核通过
                        auditStatusComboboxInIframe.combobox('setValue', auditPassValue);
                        auditStatusComboboxInIframe.trigger('change'); // Trigger change event

                        console.log(`[Userscript] Set iframe audit status to "${IFRAME_AUDIT_PASS_TEXT}" (value: ${auditPassValue}).`);

                        // --- Step 4: Click the save button ---
                        const saveButton = iframeDoc.querySelector(`#${IFRAME_SAVE_BUTTON_ID}`);
                        if (saveButton) {
                            console.log('[Userscript] Found iframe "保存" button, clicking...');
                            simulateMouseEvent(saveButton, 'click');
                        } else {
                            console.warn(`[Userscript] iframe "保存" button with ID '${IFRAME_SAVE_BUTTON_ID}' not found.`);
                        }

                    } else {
                        console.warn(`[Userscript] iframe audit status combobox with ID '${IFRAME_AUDIT_STATUS_SELECT_ID}' not found.`);
                    }
                }, 1000); // Small delay to ensure datagrid is visually ready after iframe loads

            } else {
                console.error('[Userscript] jQuery or EasyUI combobox/datagrid API not found within iframe\'s contentWindow. Cannot interact with form elements.');
            }
        }, 1500); // Give iframe content some time to fully initialize EasyUI components
    }


    // Encapsulate search button click logic
    function clickSearchButton() {
        const searchButton = document.querySelector('#phoneOrgApply_search');
        if (searchButton) {
            console.log('[Userscript] Found "查询" button, clicking...');
            simulateMouseEvent(searchButton, 'click');

            // Step 4: 搜索后，等待 *筛选后* 的表格加载，然后处理最后一个 "审核" 链接
            setTimeout(() => {
                console.log('[Userscript] Waiting for search results to load and checking the LAST "审核" link based on its createTime...');

                if (checkForNoDataMessage()) {
                    console.log('[Userscript] Datagrid shows "无数据显示" (No data to display) after filter. No review links will be clicked.');
                    return;
                }

                const reviewLinks = document.querySelectorAll(
                    'a[onclick^="process("][style*="color: green"]'
                );
                const createTimeDivs = document.querySelectorAll('.datagrid-body .datagrid-cell-c1-createTime');

                if (reviewLinks.length === 0) {
                    console.warn('[Userscript] No "审核" links found in the table after search.');
                    return;
                }
                if (createTimeDivs.length === 0) {
                    console.warn('[Userscript] No "createTime" elements found in the table after search.');
                    return;
                }
                if (reviewLinks.length !== createTimeDivs.length) {
                    console.warn(`[Userscript] Mismatch in count: Found ${reviewLinks.length} review links and ${createTimeDivs.length} createTime divs. This might indicate an unexpected table structure. Attempting to match by index.`);
                }

                const lastItemIndex = reviewLinks.length - 1;
                const lastReviewLink = reviewLinks[lastItemIndex];
                const lastCreateTimeDiv = createTimeDivs[lastItemIndex];

                if (lastReviewLink && lastCreateTimeDiv) {
                    const createTimeString = lastCreateTimeDiv.textContent.trim();
                    const rowCreateDate = new Date(createTimeString);

                    console.log(`[Userscript] Checking the last available item. createTime: ${createTimeString}, Required: >= ${FILTER_START_DATE_STR}`);

                    if (rowCreateDate >= FILTER_START_DATE_OBJ) {
                        console.log('[Userscript] The last "审核" link passes the date filter. Attempting to click it:', lastReviewLink);
                        simulateMouseEvent(lastReviewLink, 'click');

                        // After clicking the review link, wait for the iframe to open and then handle its content
                        setTimeout(handleIframeContent, 1000); // Adjust this delay if the iframe takes longer to appear
                    } else {
                        console.warn(`[Userscript] The last "审核" link (createTime: ${createTimeString}) does NOT meet the date requirement (>= ${FILTER_START_DATE_STR}). Not clicking.`);
                    }
                } else {
                    console.warn('[Userscript] Could not find the last review link or its corresponding createTime div with a matching index after search.');
                }

            }, 4500);

        } else {
            console.warn('[Userscript] "查询" (Search) button (#phoneOrgApply_search) not found. Cannot trigger search.');
        }
    }


    window.addEventListener('load', function() {
        console.log('[Userscript] Page loaded, starting automation sequence.');

        setTimeout(() => {
            const menuItem = document.querySelector('#_easyui_tree_2 .tree-title');
            if (menuItem && menuItem.textContent.replace(/\s+/g, '') === MENU_ITEM_TEXT) {
                console.log('[Userscript] Found menu item, attempting to click:', MENU_ITEM_TEXT);
                simulateMouseEvent(menuItem, 'click');

                setTimeout(() => {
                    console.log('[Userscript] Attempting to set date filter, select audit status and click search...');

                    if (typeof unsafeWindow.$ === 'function' && typeof unsafeWindow.$.fn.datetimebox === 'function' && typeof unsafeWindow.$.fn.combobox === 'function') {
                        // --- Set Date Filter ---
                        const searchStartInput = unsafeWindow.$('#search_start');
                        if (searchStartInput.length) {
                             searchStartInput.datetimebox('setValue', FILTER_START_DATE_STR);
                             searchStartInput.trigger('change');
                             console.log(`[Userscript] Set '申请日期' start to: ${FILTER_START_DATE_STR} and triggered change event.`);
                        } else {
                            console.warn("[Userscript] 'search_start' datetimebox element not found. Cannot apply start date filter.");
                        }

                        const searchEndInput = unsafeWindow.$('#search_end');
                        if (searchEndInput.length) {
                            searchEndInput.datetimebox('clear');
                            searchEndInput.trigger('change');
                            console.log("[Userscript] Cleared '申请日期' end and triggered change event.");
                        } else {
                            console.warn("[Userscript] 'search_end' datetimebox element not found.");
                        }

                        // --- Select Audit Status Dropdown on Main Page ---
                        const mainPageAuditStatusCombobox = unsafeWindow.$(`#${MAIN_PAGE_AUDIT_STATUS_COMBOBOX_ID}`);
                        if (mainPageAuditStatusCombobox.length) {
                            console.log(`[Userscript] Found main page audit status combobox (${MAIN_PAGE_AUDIT_STATUS_COMBOBOX_ID}).`);

                             const mainPageAuditValue = '1'; // Assuming '审核' corresponds to value "1"
                             mainPageAuditStatusCombobox.combobox('setValue', mainPageAuditValue);
                             mainPageAuditStatusCombobox.trigger('change'); // Trigger change event
                             console.log(`[Userscript] Set main page audit status to "${MAIN_PAGE_AUDIT_OPTION_TEXT}" (value: ${mainPageAuditValue}).`);

                            clickSearchButton(); // Now trigger search

                        } else {
                            console.warn(`[Userscript] EasyUI combobox with ID '${MAIN_PAGE_AUDIT_STATUS_COMBOBOX_ID}' not found on main page. Cannot set audit status filter.`);
                            clickSearchButton(); // Fallback: try to click search anyway
                        }

                    } else {
                        console.error('[Userscript] jQuery or EasyUI datetimebox/combobox API not found on unsafeWindow. Cannot set filters. Make sure jQuery is loaded before EasyUI.');
                    }
                }, 2500);

            } else {
                console.warn('[Userscript] Menu item "企业忘记手机号申请审核" not found after initial delay. Please check the selector or page loading.');
            }
        }, 1000);
    });

})();

