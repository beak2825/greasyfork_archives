// ==UserScript==
// @name         教學反應問卷 - 跨頁面全自動填寫 (v3.1)
// @name:zh-TW        教學反應問卷 - 跨頁面全自動填寫 (v3.1)
// @name:zh-CN        教学反应问卷 - 跨页面全自动填写 (v3.1)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  [v3.1 - 修正時序問題] 在課程列表頁新增一個按鈕，點擊後會自動依序點擊"填寫問卷"，進入頁面後自動勾選正面選項，然後自動"送出"，直到全部完成。
// @description:zh-TW [v3.1 - 修正時序問題] 在課程列表頁新增一個按鈕，點擊後會自動依序點擊"填寫問卷"，進入頁面後自動勾選正面選項，然後自動"送出"，直到全部完成。
// @description:zh-CN [v3.1 - 修正时序问题] 在课程列表页新增一个按钮，点击后会自动依序点击"填写问卷"，进入页面后自动勾选正面选项，然后自动"送出"，直到全部完成。
// @author       Mark
// @match        *://*/*Stud_Feedback.aspx*
// @grant        GM_addStyle
// @run-at       document-idle
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/555712/%E6%95%99%E5%AD%B8%E5%8F%8D%E6%87%89%E5%95%8F%E5%8D%B7%20-%20%E8%B7%A8%E9%A0%81%E9%9D%A2%E5%85%A8%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB%20%28v31%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555712/%E6%95%99%E5%AD%B8%E5%8F%8D%E6%87%89%E5%95%8F%E5%8D%B7%20-%20%E8%B7%A8%E9%A0%81%E9%9D%A2%E5%85%A8%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB%20%28v31%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 localStorage 來跨頁面追蹤狀態
    const automationStateKey = 'autoFillState_v1';
    let automationState = localStorage.getItem(automationStateKey) || 'idle';

    // --- 輔助功能 ---

    function fillPositiveOptions() {
        checkRadio('ctl00_ContentPlaceHolder1_01_0'); // 全勤100%
        checkRadio('ctl00_ContentPlaceHolder1_02_0'); // 很用心聽講
        checkRadio('ctl00_ContentPlaceHolder1_03_0'); // 6小時以上
        checkRadio('ctl00_ContentPlaceHolder1_A1_0'); // 非常同意
        checkRadio('ctl00_ContentPlaceHolder1_A2_0'); // 非常同意
        checkRadio('ctl00_ContentPlaceHolder1_A3_0'); // 非常同意
        checkRadio('ctl00_ContentPlaceHolder1_A4_0'); // 非常同意
        checkRadio('ctl00_ContentPlaceHolder1_A5_0'); // 非常同意
    }

    function checkRadio(id) {
        try {
            const element = document.getElementById(id);
            if (element) {
                element.checked = true;
            } else {
                console.warn(`[Auto-Feedback] 找不到元素: ${id}`);
            }
        } catch (e) {
            console.error(`[Auto-Feedback] 選取 ${id} 時發生錯誤:`, e);
        }
    }

    function findAndClickNext() {
        const nextButton = document.querySelector('input[type="submit"][value="填寫問卷"]');
        if (nextButton) {
            nextButton.click();
        } else {
            localStorage.setItem(automationStateKey, 'idle');
            alert('所有「未完成」的問卷都已處理完畢！');
            const masterButton = document.getElementById('masterAutoFillButton');
            if (masterButton) {
                masterButton.textContent = '🚀 開始自動填寫所有問卷';
                masterButton.disabled = false;
            }
        }
    }

    function createMasterButton() {
        const targetLocation = document.getElementById('ctl00_ContentPlaceHolder1_lblmsg');
        if (!targetLocation) {
            console.error('[Auto-Feedback] 找不到插入點 (lblmsg)，按鈕無法建立。');
            return;
        }

        const button = document.createElement('button');
        button.id = 'masterAutoFillButton';
        button.type = 'button';
        button.textContent = '🚀 開始自動填寫所有問卷';

        if (automationState === 'running') {
            button.textContent = '...自動處理中 (請稍候)...';
            button.disabled = true;
        }

        button.addEventListener('click', function() {
            if (confirm('您確定要自動填寫所有「未完成」的問卷嗎？\n\n腳本將會：\n1. 自動點擊「填寫問卷」\n2. 自動勾選「全部正面」選項\n3. 自動「送出」\n\n請在跳轉時不要操作，直到全部完成。')) {
                localStorage.setItem(automationStateKey, 'running');
                this.textContent = '...自動處理中...';
                this.disabled = true;
                findAndClickNext();
            }
        });

        targetLocation.parentNode.insertBefore(button, targetLocation.nextSibling);

        GM_addStyle(`
            #masterAutoFillButton {
                display: block;
                padding: 10px 20px;
                font-size: 16px;
                font-weight: bold;
                color: white;
                background-color: #28a745; /* 綠色 */
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin: 15px auto; /* 置中 */
            }
            #masterAutoFillButton:hover { background-color: #218838; }
            #masterAutoFillButton:disabled { background-color: #6c757d; cursor: not-allowed; }
        `);
    }

    // --- 程式主邏輯 ---
    // **重要修正：** 等待整個頁面 'load' 完成後才執行
    window.addEventListener('load', function() {
        // 偵測是否為「課程列表」頁
        const isCourseListPage = document.getElementById('ctl00_ContentPlaceHolder1_dlPollStatus') !== null;
        // 偵測是否為「問卷填寫」頁
        const isQuestionnairePage = document.getElementById('ctl00_ContentPlaceHolder1_01_0') !== null;

        // 更新狀態 (因為 'load' 事件可能較晚觸發)
        automationState = localStorage.getItem(automationStateKey) || 'idle';

        if (isCourseListPage) {
            // 1. 在課程列表頁
            createMasterButton(); // 建立主按鈕

            if (automationState === 'running') {
                setTimeout(findAndClickNext, 1000);
            }
        }
        else if (isQuestionnairePage) {
            // 2. 在問卷填寫頁
            if (automationState === 'running') {
                fillPositiveOptions();
                const submitButton = document.getElementById('ctl00_ContentPlaceHolder1_SubmitPoll');
                if (submitButton) {
                    submitButton.click();
                } else {
                    localStorage.setItem(automationStateKey, 'idle');
                    alert('錯誤：找不到「送出」按鈕，自動填寫已停止。');
                }
            }
        }
    });

})();