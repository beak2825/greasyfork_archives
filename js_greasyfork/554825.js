// ==UserScript==
// @name         NGS-鼠标悬浮颜色+双击列宽自适应
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  为 ngs-report.mtttt.cn 的 VXE Table 添加鼠标悬浮高亮 + 双击列宽自适应功能（Excel风格），并同步到 Vue 实例防止还原
// @author       QXY
// @match        http://ngs-report.mtttt.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554825/NGS-%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E9%A2%9C%E8%89%B2%2B%E5%8F%8C%E5%87%BB%E5%88%97%E5%AE%BD%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/554825/NGS-%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E9%A2%9C%E8%89%B2%2B%E5%8F%8C%E5%87%BB%E5%88%97%E5%AE%BD%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const LOG = true;
    const PREFIX = "[NGS TableEnhance]";
    const log = (...a) => LOG && console.log(PREFIX, ...a);

    /* ------------------- 悬浮效果 ------------------- */
    const HOVER_CSS = `
.vxe-table--body .vxe-body--row:hover,
.vxe-table--body .vxe-body--row.tm-table-hover {
    background-color: rgba(33, 150, 243, 0.08) !important;
    transition: background-color 0.15s ease;
}
.vxe-table--body .vxe-body--row.tm-table-hover > .vxe-body--column > .vxe-cell {
    background-color: inherit !important;
}
.vxe-table--body .vxe-body--row.tm-table-hover .vxe-cell {
    pointer-events: auto;
}
.vxe-resizable.tm-hint::after {
    content: "⇆";
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: #888;
}
`;
    function injectCSS() {
        if (document.querySelector('style[data-tm-hover]')) return;
        const s = document.createElement('style');
        s.dataset.tmHover = '1';
        s.textContent = HOVER_CSS;
        document.head.appendChild(s);
    }

    /* ------------------- 悬浮事件 ------------------- */
    function addDelegatedHover() {
        document.addEventListener('mouseover', e => {
            const tr = e.target.closest('.vxe-body--row');
            if (tr) tr.classList.add('tm-table-hover');
        }, true);
        document.addEventListener('mouseout', e => {
            const tr = e.target.closest('.vxe-body--row');
            const toTr = e.relatedTarget?.closest?.('.vxe-body--row');
            if (tr && tr !== toTr) tr.classList.remove('tm-table-hover');
        }, true);
    }

    /* ------------------- 双击列宽自适应（Vue 同步版） ------------------- */
    function autoFitColumnWidth(resizerEl) {
        const th = resizerEl.closest('th.vxe-header--column');
        if (!th) return;
        const colId = th.getAttribute('colid');
        if (!colId) return;
        log('双击列:', colId);

        const tableWrapper = th.closest('.vxe-table--main-wrapper');
        if (!tableWrapper) return;

        const headerTable = tableWrapper.querySelector('.vxe-table--header');
        const bodyTable = tableWrapper.querySelector('.vxe-table--body');
        if (!headerTable || !bodyTable) return;

        const headerCells = headerTable.querySelectorAll(`th[colid="${colId}"] .vxe-cell`);
        const bodyCells = bodyTable.querySelectorAll(`td[colid="${colId}"] .vxe-cell`);

        // 计算最大内容宽度
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'nowrap';
        document.body.appendChild(span);

        let maxWidth = 50;
        const measure = (text) => {
            span.textContent = text || '';
            return span.offsetWidth + 16; // padding
        };

        headerCells.forEach(cell => {
            const text = cell.innerText.trim();
            maxWidth = Math.max(maxWidth, measure(text));
        });
        bodyCells.forEach(cell => {
            const text = cell.innerText.trim();
            maxWidth = Math.max(maxWidth, measure(text));
        });
        document.body.removeChild(span);

        maxWidth = Math.min(maxWidth, 600);

        /* -------- Vue 内部同步列宽 -------- */
        try {
            // 获取 Vue 实例
            const vxeRoot = tableWrapper.closest('.vxe-table');
            if (vxeRoot && vxeRoot.__vue__) {
                const vxeTable = vxeRoot.__vue__;
                const column = vxeTable.visibleColumn.find(c => c.id === colId);
                if (column) {
                    column.width = maxWidth;
                    column.resizeWidth = maxWidth;
                    column.renderWidth = maxWidth;
                    // 触发表格重新计算布局
                    if (typeof vxeTable.recalculate === 'function') {
                        vxeTable.recalculate(true);
                    } else if (typeof vxeTable.recompute === 'function') {
                        vxeTable.recompute();
                    } else {
                        // fallback DOM 修改
                        const headerCol = headerTable.querySelector(`col[name="${colId}"]`);
                        const bodyCol = bodyTable.querySelector(`col[name="${colId}"]`);
                        [headerCol, bodyCol].forEach(c => c && (c.style.width = `${maxWidth}px`));
                    }
                    log(`列 ${colId} 自适应宽度: ${maxWidth}px (Vue同步成功)`);
                    return;
                }
            }
        } catch (err) {
            console.warn("[NGS] Vue 同步失败，使用 DOM 回退模式", err);
        }

        /* -------- DOM 回退模式 -------- */
        const headerCol = headerTable.querySelector(`col[name="${colId}"]`);
        const bodyCol = bodyTable.querySelector(`col[name="${colId}"]`);
        [headerCol, bodyCol].forEach(c => c && (c.style.width = `${maxWidth}px`));

        log(`列 ${colId} 自适应宽度: ${maxWidth}px (仅DOM临时修改)`);
    }

    function bindDoubleClickToResizers() {
        const bind = (node) => {
            if (node.dataset.tmBound) return;
            node.dataset.tmBound = '1';
            node.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                autoFitColumnWidth(node);
            });
        };
        document.querySelectorAll('.vxe-resizable').forEach(bind);

        // 动态表格监听
        const obs = new MutationObserver(muts => {
            muts.forEach(m => {
                m.addedNodes.forEach(n => {
                    if (n.nodeType === 1 && n.classList.contains('vxe-resizable')) bind(n);
                    if (n.querySelectorAll) n.querySelectorAll('.vxe-resizable').forEach(bind);
                });
            });
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    /* ------------------- 初始化 ------------------- */
    function init() {
        injectCSS();
        addDelegatedHover();
        bindDoubleClickToResizers();
        log('Hover + AutoFit(Vue同步) 功能已启用');
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
