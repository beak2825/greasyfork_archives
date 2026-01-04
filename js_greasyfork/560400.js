// ==UserScript==
// @name         AcFun 时间显示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将acfun评论区时间、文章、视频的发布时间展示为完整的北京时间
// @author       You
// @match        https://www.acfun.cn/v/ac*
// @match        https://www.acfun.cn/a/ac*
// @grant        unsafeWindow
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560400/AcFun%20%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560400/AcFun%20%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置常量 ===
    const TARGET_COLOR = 'rgb(153, 153, 153)'; // 统一灰色
    const TARGET_WEIGHT = 'normal'; // 之前是bold，灰色通常不需要加粗，如需加粗改回 'bold'

    // === 数据池 ===
    const idMap = new Map(); // ID -> 时间
    const floorMap = new Map(); // 楼层 -> 时间
    let pendingUpdate = false; // 防抖标志位

    // 安全获取页面 Window
    const getPageWindow = () => typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // === 工具：北京时间格式化 (高频调用，保持高效) ===
    const fmt = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });

    function formatBeijingTime(ts) {
        if (!ts || typeof ts !== 'number') return null;
        try {
            return fmt.format(new Date(ts)).replace(/\//g, '-');
        } catch (e) { return null; }
    }

    // ==========================================
    // 模块一：主内容时间 (文章/视频)
    // ==========================================
    function updateMainContentTime() {
        const win = getPageWindow();
        const info = win.pageInfo || win.videoInfo || win.articleInfo;
        if (!info || !info.createTimeMillis) return;

        // 避免重复计算
        if (win._acfun_time_main_fixed) return;

        const fullTime = formatBeijingTime(info.createTimeMillis);
        if (!fullTime) return;

        const shortDate = info.createTime; // 用于定位
        const candidates = document.querySelectorAll('.publish-time, .up-time, .time, .article-time, .caption span');

        for (let i = 0; i < candidates.length; i++) {
            const el = candidates[i];
            // 精确匹配：必须包含短日期，且不是评论区的时间
            if (el.innerText.includes(shortDate) && !el.closest('.fc-comment-item') && !el.closest('.area-comment-right')) {
                el.innerText = el.innerText.replace(shortDate, fullTime);
                el.style.color = TARGET_COLOR;
                el.style.fontWeight = TARGET_WEIGHT;
                win._acfun_time_main_fixed = true; // 标记全局已处理
                break;
            }
        }
    }

    // ==========================================
    // 模块二：评论区数据处理
    // ==========================================

    function processItem(item) {
        if (!item) return null;
        // 优先取 timestamp，其次 postDate
        const ts = (typeof item.timestamp === 'number') ? item.timestamp :
                   (typeof item.postDate === 'number') ? item.postDate : null;

        if (!ts) return null;
        const timeStr = formatBeijingTime(ts);

        const id = item.cid || item.commentId || item.id;
        if (id) idMap.set(String(id), timeStr);
        if (typeof item.floor === 'number') floorMap.set(item.floor, timeStr);

        return String(id);
    }

    // 拦截 API
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            if (!this._url || typeof this._url !== 'string') return;
            // 简单判断字符串以减少开销
            if (this._url.indexOf('comment') === -1 && this._url.indexOf('paged') === -1) return;

            try {
                const res = JSON.parse(this.responseText);
                const capturedIds = [];

                // 递归扫描，性能关键点
                const scanner = (obj) => {
                    if (!obj || typeof obj !== 'object') return;
                    // 特征判断
                    if (obj.timestamp || obj.postDate || obj.cid || obj.commentId) {
                        const id = processItem(obj);
                        if (id) capturedIds.push(id);
                    }
                    // 遍历
                    for (const key in obj) {
                        const val = obj[key];
                        if (Array.isArray(val)) {
                            for (let i = 0; i < val.length; i++) scanner(val[i]);
                        } else if (typeof val === 'object') {
                            scanner(val);
                        }
                    }
                };
                scanner(res);

                if (capturedIds.length > 0) {
                    // 数据到达后，立刻请求更新，但不强制同步执行
                    requestUpdate();
                }
            } catch (e) {}
        });
        return originalSend.apply(this, arguments);
    };

    // ==========================================
    // 模块三：DOM 渲染 (性能 & 准确性优化)
    // ==========================================

    // 应用时间的通用函数
    function applyTimeText(container, text) {
        // === 修复引用评论问题的关键 ===
        // 我们必须精确查找属于当前 container 的时间元素，避免找到子元素(引用)里的

        let target = null;

        // 1. 新版/番剧区/子评论：时间通常在顶部标题栏
        // 结构：.area-comment-title > .time_times
        if (!target) target = container.querySelector('.area-comment-title .time_times');

        // 2. 旧版/文章区：时间在底部 Footer
        // 结构：.comment-item-footer > ... > .post-time
        // 使用 css selector 确保层级，防止选中 content 里的引用
        if (!target) target = container.querySelector('.comment-item-footer .post-time');

        // 3. 兜底 (小心使用)
        // 只有当前面两个精确查找都失败时，才尝试找泛泛的 .time
        // 并且要排除掉可能存在于 .comment-quote-container 里的 .time
        if (!target) {
            const looseTarget = container.querySelector('.time');
            // 简单检查：这个 target 必须不属于 container 内部的另一个 .fc-comment-item
            if (looseTarget && looseTarget.closest('[data-cid]') === container) {
                target = looseTarget;
            }
        }

        if (target && !target.getAttribute('data-fixed')) {
            target.innerText = text;
            target.style.color = TARGET_COLOR;
            target.style.fontWeight = TARGET_WEIGHT;
            target.setAttribute('data-fixed', 'true');
        }
    }

    // 核心更新逻辑
    function updateAllDom() {
        pendingUpdate = false; // 重置防抖标志

        // 1. 更新主内容
        updateMainContentTime();

        // 2. 只有当有数据时才遍历 DOM
        if (idMap.size === 0 && floorMap.size === 0) return;

        // 3. 使用高效的属性选择器
        // 兼容所有属性名
        const idNodes = document.querySelectorAll(
            '[data-cid]:not([data-fixed-node]), [data-id]:not([data-fixed-node]), [data-comment-id]:not([data-fixed-node]), [data-commentid]:not([data-fixed-node])'
        );

        idNodes.forEach(node => {
            const id = node.getAttribute('data-cid') || node.getAttribute('data-id') ||
                       node.getAttribute('data-comment-id') || node.getAttribute('data-commentid');
            const timeStr = idMap.get(id);
            if (timeStr) {
                applyTimeText(node, timeStr);
                // 标记节点本身已处理，减少下次 querySelectorAll 的开销 (优化项)
                // 注意：如果 UI 会重绘导致内部时间元素重建，则不能加这个标记。
                // AcFun 评论翻页是销毁重建，所以加标记没问题；但如果是展开子评论，父级不变。
                // 稳妥起见，我们只给时间元素加 data-fixed，这里不给 node 加标记，
                // 或者我们在 querySelectorAll 里不排除，靠内部 data-fixed 判断。
                // 为了性能，我们仅对 .time_times 等元素判断 data-fixed。
            }
        });

        // 4. 番剧楼层匹配 (数量少，可以直接扫)
        const floorNodes = document.querySelectorAll('.area-comment-first, .area-comment-child');
        floorNodes.forEach(node => {
            // 性能优化：如果已经处理过内部时间，跳过
            if (node.querySelector('[data-fixed]')) return;

            const indexEl = node.querySelector('.index-comment, .area-comment-index');
            if (indexEl) {
                const match = indexEl.innerText.match(/#(\d+)/);
                if (match) {
                    const timeStr = floorMap.get(parseInt(match[1], 10));
                    if (timeStr) applyTimeText(node, timeStr);
                }
            }
        });
    }

    // ==========================================
    // 调度系统 (防抖 & 监听)
    // ==========================================

    // 请求更新：防抖，200ms 内只执行一次
    function requestUpdate() {
        if (pendingUpdate) return;
        pendingUpdate = true;

        // 使用 requestAnimationFrame 或 setTimeout
        setTimeout(() => {
            // 再次检查 pendingUpdate，确保逻辑闭环
            if (pendingUpdate) updateAllDom();
        }, 200);
    }

    // 1. 页面加载初始化
    window.addEventListener('load', () => {
        setTimeout(updateMainContentTime, 500);
        // 初始扫描
        requestUpdate();
    });

    // 2. 监听 DOM 变化 (Observer)
    const observer = new MutationObserver((mutations) => {
        // 过滤掉无关的变动 (比如只是 style 变化，或者 script 标签插入)
        let relevantChange = false;
        for (let i = 0; i < mutations.length; i++) {
            if (mutations[i].type === 'childList') {
                relevantChange = true;
                break;
            }
        }
        if (relevantChange) requestUpdate();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 3. 交互触发 (点击后强制多扫几次，应对懒加载)
    document.addEventListener('click', (e) => {
        // 如果点击的是回复、展开等按钮
        setTimeout(updateAllDom, 300);
        setTimeout(updateAllDom, 1000);
    }, true);

})();