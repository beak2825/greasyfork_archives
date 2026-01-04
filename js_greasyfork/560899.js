// ==UserScript==
// @name         學系自動選擇器
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  整合版：自動選擇學系 + 老師快速查詢,支援自訂關鍵字與匯入名單
// @author       anonymous
// @license      MIT
// @match        *://web.sys.scu.edu.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560899/%E5%AD%B8%E7%B3%BB%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560899/%E5%AD%B8%E7%B3%BB%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 防止在同一個 window context 中重複執行
    if (window.scuHelperInitialized) {
        return;
    }
    window.scuHelperInitialized = true;
    // ===========================
    // 全域設定區
    // ===========================
    let targetKeyword = GM_getValue("targetDeptKeyword", "國際經營與貿易學系");
    let debugMode = GM_getValue("debugMode", false);
    const defaultTeachers = ["小明"];
    // 除錯用 log 函數
    function debugLog(...args) {
        if (debugMode) {
            console.log('[東吳助手]', ...args);
        }
    }
    // ===========================
    // 選單命令註冊（只在頂層視窗註冊）
    // ===========================
    const isTopWindow = (window.self === window.top);
    if (isTopWindow) {
        GM_registerMenuCommand("⚙️ 設定目標學系", function() {
            const input = prompt(
                "請輸入要自動選擇的學系關鍵字：\n(包含此文字的選項就會被選中)",
                targetKeyword
            );
            if (input !== null && input.trim() !== "") {
                targetKeyword = input.trim();
                GM_setValue("targetDeptKeyword", targetKeyword);
                alert(`已儲存關鍵字：「${targetKeyword}」\n頁面將自動重新載入。`);
                location.reload();
            }
        });
        GM_registerMenuCommand("👨‍🏫 管理教師名單", function() {
            const teachers = getTeacherList();
            const current = teachers.join('\n');
            const input = prompt(
                "目前的教師名單（每行一位）：\n" +
                "※ 你也可以用「匯入txt」按鈕批量匯入\n\n" +
                "直接編輯下方內容後按確定儲存：",
                current
            );
            if (input !== null) {
                const nameList = input.split(/\r\n|\n/)
                                    .map(name => name.trim())
                                    .filter(name => name.length > 0);
                if (nameList.length > 0) {
                    GM_setValue("teacherList", nameList);
                    alert(`已儲存 ${nameList.length} 位教師！\n頁面將重新載入。`);
                    location.reload();
                } else {
                    alert('名單不可為空');
                }
            }
        });
        GM_registerMenuCommand("💾 匯出教師名單", function() {
            const teachers = getTeacherList();
            const content = teachers.join('\n');
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `東吳教師名單_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert(`已匯出 ${teachers.length} 位教師名單！`);
        });
        GM_registerMenuCommand("🐛 切換除錯模式", function() {
            debugMode = !debugMode;
            GM_setValue("debugMode", debugMode);
            alert(`除錯模式已${debugMode ? '開啟' : '關閉'}`);
        });
        debugLog('✓ 選單命令已註冊（頂層視窗）');
    } else {
        debugLog('⊘ 非頂層視窗，跳過選單註冊');
    }
    // ===========================
    // 模組 1: 學系自動選擇器
    // ===========================
    /**
     * 執行選取動作
     */
    function selectDepartment(deptSelect) {
        if (!deptSelect || deptSelect.options.length === 0) {
            debugLog('學系選單不存在或為空');
            return false;
        }
        const currentOption = deptSelect.options[deptSelect.selectedIndex];
        if (currentOption && currentOption.text.includes(targetKeyword)) {
            debugLog(`已選中目標：${currentOption.text}`);
            return true;
        }
        for (let i = 0; i < deptSelect.options.length; i++) {
            const option = deptSelect.options[i];
            if (option.text.includes(targetKeyword)) {
                debugLog(`找到目標：${option.text} (Value: ${option.value})`);
                deptSelect.selectedIndex = i;
                const events = ['change', 'input'];
                events.forEach(eventType => {
                    deptSelect.dispatchEvent(new Event(eventType, { bubbles: true }));
                });
                if (window.jQuery) {
                    window.jQuery(deptSelect).trigger('change');
                }
                return true;
            }
        }
        debugLog(`找不到包含「${targetKeyword}」的選項`);
        return false;
    }
    /**
     * 使用 MutationObserver 監聽選單變化
     */
    function setupObserver(deptSelect) {
        if (deptSelect.dataset.observerAttached) return;
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    debugLog('偵測到選單內容變更');
                    setTimeout(() => selectDepartment(deptSelect), 100);
                    break;
                }
            }
        });
        observer.observe(deptSelect, {
            childList: true,
            subtree: true
        });
        deptSelect.dataset.observerAttached = 'true';
        debugLog('已設定選單變化監聽器');
    }
    /**
     * 初始化學系自動選擇功能
     */
    function initDeptAutoSelect() {
        const progSelect = document.querySelector('select[name="clsid1"], select[id="clsid1"]');
        const deptSelect = document.querySelector('select[name="clsid02"], select[id="clsid02"]');
        if (!deptSelect) {
            debugLog('未找到學系選單');
            return;
        }
        const alreadyInit = deptSelect.dataset.autoSelectInitialized;
        if (!alreadyInit) {
            debugLog('偵測到學系選單，開始執行自動選擇');
            deptSelect.dataset.autoSelectInitialized = 'true';
        }
        selectDepartment(deptSelect);
        if (!alreadyInit) {
            setupObserver(deptSelect);
        }
        if (progSelect && !progSelect.dataset.isMonitored) {
            progSelect.addEventListener('change', function() {
                debugLog('偵測到部別變更，等待選單刷新...');
                const retryTimes = [200, 500, 1000];
                retryTimes.forEach(delay => {
                    setTimeout(() => selectDepartment(deptSelect), delay);
                });
            });
            progSelect.dataset.isMonitored = 'true';
            debugLog('已設定部別選單監聯器');
        }
    }
    // ===========================
    // 模組 2: 教師快速查詢
    // ===========================
    /**
     * 讀取教師名單（從 GM 儲存空間）
     */
    function getTeacherList() {
        const saved = GM_getValue("teacherList", null);
        if (saved && Array.isArray(saved)) {
            return saved;
        }
        return defaultTeachers;
    }
    /**
     * 儲存教師名單（到 GM 儲存空間）
     */
    function saveTeacherList(list) {
        GM_setValue("teacherList", list);
    }
    /**
     * 初始化教師快速查詢功能
     */
    function initTeacherQuickSelect() {
        const targetInput = document.querySelector('input[name="teachname"]');
        if (!targetInput) {
            debugLog('未找到教師姓名輸入框');
            return;
        }
        if (targetInput.dataset.quickSelectInitialized) {
            debugLog('教師快速選單已建立，跳過');
            return;
        }
        targetInput.dataset.quickSelectInitialized = 'true';
        debugLog('偵測到教師姓名輸入框，建立快速選單');
        const select = document.createElement('select');
        select.style.marginLeft = '8px';
        select.style.padding = '2px';
        select.style.verticalAlign = 'middle';
        select.style.cursor = 'pointer';
        function renderOptions() {
            select.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.text = "▼ 常用教師";
            defaultOption.value = "";
            select.add(defaultOption);
            const teachers = getTeacherList();
            teachers.forEach(name => {
                const option = document.createElement('option');
                option.text = name;
                option.value = name;
                select.add(option);
            });
        }
        renderOptions();
        select.addEventListener('change', function() {
            if (this.value) {
                targetInput.value = this.value;
                debugLog(`已選擇教師：${this.value}，準備送出查詢`);
                if (targetInput.form) {
                    targetInput.form.submit();
                } else {
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        which: 13,
                        keyCode: 13,
                        bubbles: true
                    });
                    targetInput.dispatchEvent(enterEvent);
                    const submitBtn = document.querySelector('input[type="submit"], button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.click();
                    }
                }
            }
        });
        const importBtn = document.createElement('button');
        importBtn.innerText = '📂 匯入';
        importBtn.style.marginLeft = '5px';
        importBtn.style.fontSize = '12px';
        importBtn.style.verticalAlign = 'middle';
        importBtn.type = 'button';
        const exportBtn = document.createElement('button');
        exportBtn.innerText = '💾 匯出';
        exportBtn.style.marginLeft = '5px';
        exportBtn.style.fontSize = '12px';
        exportBtn.style.verticalAlign = 'middle';
        exportBtn.type = 'button';
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
        fileInput.style.display = 'none';
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });
        exportBtn.addEventListener('click', () => {
            const teachers = getTeacherList();
            const content = teachers.join('\n');
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `東吳教師名單_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            debugLog(`已匯出 ${teachers.length} 位教師名單`);
        });
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const nameList = content.split(/\r\n|\n/)
                                        .map(name => name.trim())
                                        .filter(name => name.length > 0);
                if (nameList.length > 0) {
                    saveTeacherList(nameList);
                    alert(`成功匯入 ${nameList.length} 位教師！`);
                    renderOptions();
                    debugLog(`已匯入 ${nameList.length} 位教師`);
                } else {
                    alert('檔案內容似乎是空的？');
                }
            };
            reader.readAsText(file, 'UTF-8');
            this.value = '';
        });
        if (targetInput.parentNode) {
            targetInput.parentNode.insertBefore(select, targetInput.nextSibling);
            select.parentNode.insertBefore(importBtn, select.nextSibling);
            select.parentNode.insertBefore(exportBtn, importBtn.nextSibling);
            select.parentNode.insertBefore(fileInput, exportBtn.nextSibling);
        }
    }
    // ===========================
    // 主程式啟動
    // ===========================
    function main() {
        debugLog('腳本開始執行');
        initDeptAutoSelect();
        initTeacherQuickSelect();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main, { once: true });
    } else {
        main();
    }
    debugLog(`腳本已載入完成 | 目標學系：「${targetKeyword}」 | 教師名單：${getTeacherList().length} 位`);
})();