// ==UserScript==
// @name         知乎首页自定义过滤器（支持过低赞、过高赞、创建时间）
// @namespace    https://example.com/
// @version      2.0.0
// @description  屏蔽过低赞或过高赞的回答。可通过油猴菜单自定义阈值。
// @author       davis.zheng
// @match        https://www.zhihu.com/
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/548590/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E6%94%AF%E6%8C%81%E8%BF%87%E4%BD%8E%E8%B5%9E%E3%80%81%E8%BF%87%E9%AB%98%E8%B5%9E%E3%80%81%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548590/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E6%94%AF%E6%8C%81%E8%BF%87%E4%BD%8E%E8%B5%9E%E3%80%81%E8%BF%87%E9%AB%98%E8%B5%9E%E3%80%81%E5%88%9B%E5%BB%BA%E6%97%B6%E9%97%B4%EF%BC%89.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // --- 默认配置 ---
    const DEFAULT_MIN_UPVOTES = 500;    // 默认的最低赞同阈值 (低于此值屏蔽)
    const DEFAULT_MAX_UPVOTES = Infinity; // 示例值：7000。默认的最高赞同阈值 (高于此值屏蔽, Infinity 表示不设上限)
    const DEFAULT_MAX_DATE = '9999-12-31'; // 示例值：2024-01-01。 新增：默认的日期阈值 (晚于此日期的回答将被屏蔽)

    const REMOVE_MODE = true;           // true: 直接 remove 容器，不留空白；false: display:none 可按热键恢复
    const TOGGLE_HOTKEY = 'h';          // 折叠模式下切换显示/隐藏的热键


    const HIDDEN_ATTR = 'data-vote-hidden';

    // --- 读取用户自定义配置 ---
    // 使用 GM_getValue 读取保存的设置，如果未设置，则使用默认值
    const minUpvotes = GM_getValue('minUpvotes', DEFAULT_MIN_UPVOTES);
    const maxUpvotes = GM_getValue('maxUpvotes', DEFAULT_MAX_UPVOTES);
    const maxDateStr = GM_getValue('maxDate', DEFAULT_MAX_DATE); // <--- 新增：读取保存的日期字符串
    const maxDate = new Date(maxDateStr); // <--- 新增：创建一个 Date 对象用于比较
    
    // --- 注册菜单命令，用于自定义阈值 ---
    GM_registerMenuCommand(`设置屏蔽低赞阈值 (当前: ${minUpvotes})`, () => {
        const input = prompt('请输入新的【最低】赞数阈值 (低于此值将被屏蔽，输入0则不屏蔽低赞):', minUpvotes);
        if (input === null) return; // 用户点击了取消

        const newValue = parseInt(input, 10);
        if (!isNaN(newValue) && newValue >= 0) {
            GM_setValue('minUpvotes', newValue);
            alert(`低赞屏蔽阈值已设置为 ${newValue}。\n页面将刷新以应用新设置。`);
            location.reload();
        } else {
            alert('输入无效，请输入一个非负整数。');
        }
    });


    GM_registerMenuCommand(`设置屏蔽高赞阈值 (当前: ${maxUpvotes === Infinity ? '不限' : maxUpvotes})`, () => {
        const currentDisplay = maxUpvotes === Infinity ? '' : maxUpvotes;
        const input = prompt('请输入新的【最高】赞数阈值 (高于此值将被屏蔽，留空则不屏蔽高赞):', currentDisplay);
        if (input === null) return; // 用户点击了取消

        if (input.trim() === '') {
            GM_setValue('maxUpvotes', Infinity);
            alert('已取消高赞屏蔽。\n页面将刷新以应用新设置。');
            location.reload();
        } else {
            const newValue = parseInt(input, 10);
            if (!isNaN(newValue) && newValue >= 0) {
                GM_setValue('maxUpvotes', newValue);
                alert(`高赞屏蔽阈值已设置为 ${newValue}。\n页面将刷新以应用新设置。`);
                location.reload();
            } else {
                alert('输入无效，请输入一个非负整数。');
            }
        }
    });

    GM_registerMenuCommand(`设置屏蔽时间 (晚于 ${maxDateStr} 的回答将被屏蔽)`, () => {
        const input = prompt('请输入屏蔽日期 (格式 YYYY-MM-DD)，晚于此日期的回答将被屏蔽。\n留空则不按时间屏蔽。', maxDateStr);
        if (input === null) return; // 用户点击了取消

        if (input.trim() === '') {
            // 用户留空，表示不进行时间屏蔽。我们存一个非常遥远的未来日期来实现这个效果。
            GM_setValue('maxDate', '9999-12-31');
            alert('已取消时间屏蔽。\n页面将刷新以应用新设置。');
            location.reload();
            return;
        }

        // 校验输入是否为 YYYY-MM-DD 格式的有效日期
        if (/^\d{4}-\d{2}-\d{2}$/.test(input) && !isNaN(new Date(input))) {
            GM_setValue('maxDate', input);
            alert(`屏蔽时间已设置为 ${input}。\n页面将刷新以应用新设置。`);
            location.reload();
        } else {
            alert('输入格式无效，请输入 YYYY-MM-DD 格式的有效日期。');
        }
    });

    // --- 核心功能函数 (与原版基本一致，仅修改判断逻辑) ---

    // 工具：解析文本里的数字（含 K/万/亿）
    function parseCount(str) {
        if (!str) return NaN;
        str = String(str).replace(/\s+/g, '');
        const m = str.match(/([\d.,]+)\s*([kK]|万|亿)?/);
        if (!m) return NaN;
        const n = parseFloat((m[1] || '').replace(/,/g, ''));
        if (isNaN(n)) return NaN;
        switch (m[2]) {
            case 'k':
            case 'K': return Math.round(n * 1000);
            case '万': return Math.round(n * 10000);
            case '亿': return Math.round(n * 100000000);
            default: return n;
        }
    }

    // 从容器读取赞同数
    function getVoteCountFromContainer(container) {
        const meta = container.querySelector('meta[itemprop="upvoteCount"]');
        if (meta && meta.content) {
            const v = parseInt(meta.content, 10);
            if (!Number.isNaN(v)) return v;
        }
        const upBtn = container.querySelector('button.VoteButton:not(.VoteButton--down)');
        if (upBtn) {
            const aria = upBtn.getAttribute('aria-label') || '';
            let n = parseCount(aria);
            if (!isNaN(n)) return n;
            n = parseCount(upBtn.textContent || '');
            if (!isNaN(n)) return n;
        }
        return NaN;
    }

    // 从容器读取创建日期
    function getCreationDateFromContainer(container) {
        const meta = container.querySelector('meta[itemprop="dateCreated"]');
        if (meta && meta.content) {
            const date = new Date(meta.content);
            // 确保解析出的日期是有效的
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        return null; // 如果找不到或日期无效，返回 null
    }


    // 查找需要评估的“外层卡片/列表项”容器
    function findAllAnswerContainers(root = document) {
        const sels = [
            '.Card.TopstoryItem'
        ];
        const set = new Set();
        sels.forEach(sel => {
            root.querySelectorAll(sel).forEach(el => set.add(el));
        });
        return Array.from(set);
    }

    function hideContainer(container) {
        if (!container) return;
        if (REMOVE_MODE) {
            container.remove();
        } else {
            container.style.display = 'none';
            container.setAttribute(HIDDEN_ATTR, '1');
        }
    }

    function showContainer(container) {
        if (!container) return;
        container.style.display = '';
        container.removeAttribute(HIDDEN_ATTR);
    }

    // !! 核心判断逻辑修改处 !!
    function evaluateAndHide(root = document) {
        const containers = findAllAnswerContainers(root);
        containers.forEach(container => {
            if (!REMOVE_MODE && container.hasAttribute(HIDDEN_ATTR)) return;

            const v = getVoteCountFromContainer(container);
            const creationDate = getCreationDateFromContainer(container); // <--- 新增：获取回答创建日期

            let shouldHide = false;

            // 条件1: 赞同数不符合范围
            if (!Number.isNaN(v) && (v < minUpvotes || v > maxUpvotes)) {
                shouldHide = true;
            }

            // 条件2: 回答时间太新 (仅在赞同数符合范围时检查)
            if (!shouldHide && creationDate && creationDate > maxDate) { // <--- 新增：日期判断逻辑
                console.log(creationDate)
                shouldHide = true;
            }

            if (shouldHide) {
                hideContainer(container);
            }
        });
    }

    function init() { 
        evaluateAndHide();

        const mo = new MutationObserver(mutations => {
            let need = false;
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length) { need = true; break; }
            }
            if (need) {
                if (evaluateAndHide._tid) cancelAnimationFrame(evaluateAndHide._tid);
                evaluateAndHide._tid = requestAnimationFrame(() => evaluateAndHide(document));
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });

        if (!REMOVE_MODE) {
            window.addEventListener('keydown', e => {
                if (e.key.toLowerCase() !== TOGGLE_HOTKEY) return;
                const hidden = document.querySelectorAll(`[${HIDDEN_ATTR}]`);
                const allHidden = Array.from(hidden).every(el => el.style.display === 'none');
                if (allHidden) hidden.forEach(showContainer);
                else hidden.forEach(hideContainer);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();