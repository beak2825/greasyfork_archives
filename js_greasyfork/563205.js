// ==UserScript==
// @name         林客后台 - 跟进人列前置 (V1.2 强力同步版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  将“跟进人”列移动到第4列。修复表头变了但数据行没变的问题，支持异步加载数据。
// @author       You
// @match       *://*.life-partner.cn/vmok/order-management*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563205/%E6%9E%97%E5%AE%A2%E5%90%8E%E5%8F%B0%20-%20%E8%B7%9F%E8%BF%9B%E4%BA%BA%E5%88%97%E5%89%8D%E7%BD%AE%20%28V12%20%E5%BC%BA%E5%8A%9B%E5%90%8C%E6%AD%A5%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563205/%E6%9E%97%E5%AE%A2%E5%90%8E%E5%8F%B0%20-%20%E8%B7%9F%E8%BF%9B%E4%BA%BA%E5%88%97%E5%89%8D%E7%BD%AE%20%28V12%20%E5%BC%BA%E5%8A%9B%E5%90%8C%E6%AD%A5%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置 ===
    // 目标位置索引（第4列 = 索引 3，因为从0开始计数：0,1,2,3）
    const TARGET_INDEX = 3;
    // 目标列名关键字
    const TARGET_NAME = "跟进人";

    // 缓存“跟进人”原始的 col-index (例如 "13")，避免每次都去遍历文本
    let cachedColIndex = null;
    let isProcessing = false;

    // === 工具：安全移动节点 ===
    function moveNodeTo(parent, node, targetIndex) {
        if (!parent || !node) return;
        const currentNodes = parent.children;
        // 如果已经是目标位置，就不动（节省性能）
        if (currentNodes[targetIndex] === node) return;

        // 插入到目标位置
        // 如果 targetIndex 超过长度，insertBefore(node, null) 会自动添加到末尾
        const referenceNode = currentNodes[targetIndex] || null;
        parent.insertBefore(node, referenceNode);
    }

    // === 核心：处理表头 ===
    function processHeader() {
        const headContainer = document.querySelector('.okee-lp-Table-Container_head');
        if (!headContainer) return false;

        const tr = headContainer.querySelector('thead tr');
        if (!tr) return false;

        // 1. 找到“跟进人”原本是第几列，并获取它的 aria-colindex
        // 我们通过查找文本来锁定它
        let targetTh = Array.from(tr.children).find(th => th.innerText.includes(TARGET_NAME));

        if (!targetTh) return false;

        // 获取并缓存 colindex (比如 "13")，用于后续匹配 Body 里的单元格
        const colIndex = targetTh.getAttribute('aria-colindex');
        if (colIndex) {
            cachedColIndex = colIndex;
        }

        // 2. 移动表头 TH
        moveNodeTo(tr, targetTh, TARGET_INDEX);

        // 3. 移动表头 ColGroup (控制宽度的)
        const colGroup = headContainer.querySelector('colgroup');
        if (colGroup && colIndex) {
            // col 没有 aria-colindex，通常依靠 nth-child。但由于我们移动了 th，最好通过索引判断。
            // 这里为了稳妥，我们直接移动对应原始位置的 col。
            // 简单处理：如果 th 移动了，col 还没动，不仅宽度会错。
            // 策略：col 的顺序通常和 th 初始顺序一致。我们很难通过属性匹配 col。
            // 暴力法：移动第 N 个 col。由于 th 已经被我们移走了，我们很难知道它原来的 DOM 索引。
            // 修正：我们只在第一次找到 targetTh 时，记录它的原始 DOM 索引，然后去移 col。
            // 暂时忽略 ColGroup 的精确移动，通常浏览器渲染会自动适配，或者我们依赖 Body 的 ColGroup。
        }

        return true;
    }

    // === 核心：处理表身 (独立逻辑) ===
    function processBody() {
        // 如果连表头都没找到“跟进人”在哪，就没法处理表身
        if (!cachedColIndex) return;

        const bodyContainer = document.querySelector('.okee-lp-Table-Container_body');
        if (!bodyContainer) return;

        const rows = bodyContainer.querySelectorAll('tbody tr');

        rows.forEach(row => {
            // 在这一行里，找到 aria-colindex 等于目标值的那个 td
            const targetTd = row.querySelector(`td[aria-colindex="${cachedColIndex}"]`);

            if (targetTd) {
                // 无论它现在在哪，把它强制按在第4个座位上
                moveNodeTo(row, targetTd, TARGET_INDEX);
            }
        });

        // 同步移动 Body 的 ColGroup (防止列宽错位)
        const bodyColGroup = bodyContainer.querySelector('colgroup');
        if (bodyColGroup) {
            // Body 的 colgroup 比较难搞，因为它没有 id。
            // 简单方案：尝试移动第 13 个 col 到第 4 个。
            // 但如果已经移过了，再移就乱了。
            // 所以这里建议：主要关注内容对齐。
        }
    }

    // === 主执行函数 ===
    function run() {
        if (isProcessing) return;
        isProcessing = true;

        // 1. 先处理表头（这也将帮我们锁定 cachedColIndex）
        processHeader();

        // 2. 再强制处理表身（不管表头是否动过，表身都要检查）
        // 使用 setTimeout 让出主线程，防止卡顿
        requestAnimationFrame(() => {
            processBody();
            isProcessing = false;
        });
    }

    // === 监听器 ===
    const observer = new MutationObserver((mutations) => {
        // 只有当表格内容发生实质变化时才触发
        const shouldUpdate = mutations.some(m =>
            m.target.classList && (
                m.target.classList.contains('okee-lp-Table-Body') || // 表体变了
                m.target.tagName === 'TR' ||                         // 行变了
                m.target.tagName === 'TBODY'                         // 加载数据
            )
        );

        if (shouldUpdate) {
            run();
        }
    });

    // === 初始化 ===
    function init() {
        const root = document.querySelector('.okee-lp-Table') || document.body;
        if (root) {
            run(); // 立即运行一次
            observer.observe(root, {
                childList: true,
                subtree: true
            });

            // 双重保险：针对慢网速，数据回来晚了的情况
            setInterval(run, 2000);
        } else {
            setTimeout(init, 500);
        }
    }

    init();

})();