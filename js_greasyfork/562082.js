// ==UserScript==
// @name         WHUT选课跳过弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  基于API拦截与精准DOM扫描，自动跳过选课首页5s倒计时并实现选课页快速点击。
// @author       毫厘
// @match        https://jwxk.whut.edu.cn/*
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562082/WHUT%E9%80%89%E8%AF%BE%E8%B7%B3%E8%BF%87%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/562082/WHUT%E9%80%89%E8%AF%BE%E8%B7%B3%E8%BF%87%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // 0. 全局变量：防止重复点击与卡死
    // ============================================================
    const clickedElements = new Set(); // 记录已点击过的按钮实例

    console.log('%c WHUT-Helper: v1.0 稳定版已启动', 'background: #28a745; color: #fff; font-weight: bold;');

    // ============================================================
    // 1. API 数据拦截 (核心逻辑：修改后端返回的控制状态)
    // ============================================================
    function cleanData(json) {
        let modified = false;
        const fixItem = (item) => {
            // 强制修改后端标记，解锁倒计时或确认限制
            if (item.needConfirm == 1 || item.needConfirm === "1") {
                item.needConfirm = "0";
                item.isConfirmed = "1";
                item.canSelect = "1";
                modified = true;
            }
        };

        // 递归检查不同的 API 数据结构
        if (json?.data?.student?.electiveBatchList) {
            json.data.student.electiveBatchList.forEach(fixItem);
        } else if (json?.data?.electiveBatchList) {
            json.data.electiveBatchList.forEach(fixItem);
        }
        return modified;
    }

    // --- Fetch 拦截 ---
    const originalFetch = unsafeWindow.fetch || window.fetch;
    unsafeWindow.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        if (response.url.includes('/xsxk/elective/user') || response.url.includes('/web/now')) {
            try {
                const clone = response.clone();
                const json = await clone.json();
                if (cleanData(json)) {
                    return new Response(JSON.stringify(json), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (e) {}
        }
        return response;
    };

    // ============================================================
    // 2. 自动化点击逻辑 (分路径精准匹配)
    // ============================================================
    const clicker = setInterval(() => {
        const currentPath = window.location.href;

        /**
         * 场景 A：首页或入口页 (跳过 5s 强制弹窗)
         * 逻辑：仅在 profile/index 页面下点击通用的“确定”按钮。
         */
        if (currentPath.includes('profile/index')) {
            const primaryBtns = document.querySelectorAll('button.el-button--primary');
            primaryBtns.forEach(btn => {
                const text = btn.innerText.replace(/\s+/g, ""); // 清除空格干扰
                if (text.includes('确定')) {
                    safeClick(btn);
                }
            });
        }

        /**
         * 场景 B：选课内页 (精准点击列表中的“选课”)
         * 逻辑：匹配 class 包含 courseBtn 的按钮，不受 URL 严格限制，确保响应速度。
         */
        const courseBtns = document.querySelectorAll('button.courseBtn.el-button--primary');
        courseBtns.forEach(btn => {
            const text = btn.innerText.replace(/\s+/g, "");
            if (text === '选课') {
                safeClick(btn);
            }
        });

    }, 100); // 100ms 扫描一次，在性能与速度间取得平衡

    /**
     * 安全点击函数：处理 ElementUI 禁用状态并防止连点卡死
     */
    function safeClick(btn) {
        // 1. 过滤：不可见或本轮已点过的按钮直接跳过
        if (btn.offsetParent === null || clickedElements.has(btn)) return;

        // 2. 锁定：立即标记，防止在 DOM 刷新前被 setInterval 多次触发
        clickedElements.add(btn);

        // 3. 强攻：如果按钮被禁用（倒计时中），强制移除禁用属性
        if (btn.classList.contains('is-disabled') || btn.disabled) {
            btn.classList.remove('is-disabled');
            btn.disabled = false;
            btn.removeAttribute('disabled');
        }

        // 4. 执行
        btn.click();
        console.log(`%c [自动触发] ${btn.innerText.trim()}`, 'color: #17a2b8;');

        // 5. 释放：3秒后从 Set 中移除，允许页面局部刷新或翻页后再次点击
        setTimeout(() => {
            clickedElements.add(btn); // 实际上这里逻辑应为保持锁定直到页面重载，或短暂释放
            clickedElements.delete(btn);
        }, 3000);
    }

    // 运行 20s后自动销毁定时器，节省系统资源
    setTimeout(() => clearInterval(clicker), 20000);

})();