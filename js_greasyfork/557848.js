// ==UserScript==
// @name         linux.do 清爽模式(仅移动端个人自用)
// @namespace    https://linux.do/
// @version      1.0.1
// @description  清爽模式 + 全局浅色美化；PC 端轻量美化，移动端卡片化浅色 UI；无任何按钮、无快捷键、无暗黑模式。
// @match        https://linux.do/*
// @match        https://idcflare.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557848/linuxdo%20%E6%B8%85%E7%88%BD%E6%A8%A1%E5%BC%8F%28%E4%BB%85%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557848/linuxdo%20%E6%B8%85%E7%88%BD%E6%A8%A1%E5%BC%8F%28%E4%BB%85%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HIDDEN_ATTR = 'data-ld-clean-hidden';

    function injectBaseStyle() {
        if (document.getElementById('ld-clean-style')) return;
        const style = document.createElement('style');
        style.id = 'ld-clean-style';
        style.textContent = `

/* =========================================================
   移动端卡片式浅色风格（不深色、不暗黑、不渐变）
========================================================= */

@media (max-width: 768px) {
    html.ld-clean-mode body {
        background: #f6f7f9 !important;
        /* 移除了 color: #374151 !important; */
        /* 可选：如果box-sizing未能完全解决，可以尝试 */
        /* overflow-x: hidden !important; */
    }

    html.ld-clean-mode .d-header {
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(12px);
        background: rgba(250, 250, 250, 0.86) !important;
        border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    html.ld-clean-mode #main-outlet,
    html.ld-clean-mode .wrap {
        max-width: 100%;
        margin: 0 auto;
        padding: 12px 6px 20px; /* 修改了左右内边距，从 10px 变为 6px，让内容更宽 */
        box-sizing: border-box !important;
    }

    /* 列表卡片：柔和浅色卡片 */
    html.ld-clean-mode .topic-list {
        border: 0;
        background: transparent;
    }

    html.ld-clean-mode .topic-list thead {
        display: none;
    }

    html.ld-clean-mode .topic-list tbody tr {
        display: block;
        background: #ffffff !important;
        border-radius: 14px;
        margin-bottom: 12px;
        padding: 6px 0;
        border: 1px solid rgba(0,0,0,0.06);
        box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        box-sizing: border-box !important;
    }

    html.ld-clean-mode .topic-list tbody tr td {
        display: block;
        padding: 6px 12px;
        border: none !important;
    }

    html.ld-clean-mode .topic-list .main-link a.title {
        /* 移除了 font-size: 16px; */
        /* 移除了 font-weight: 600; */
        /* 移除了 color: #1e293b !important; */
    }

    html.ld-clean-mode .topic-list td.num.views,
    html.ld-clean-mode .topic-list td.num.posts,
    html.ld-clean-mode .topic-list td.num.activity {
        /* 移除了 display: inline-block; */
        /* 移除了 font-size: 11px; */
        /* 移除了 color: #6b7280 !important; */
        padding-right: 10px;
    }

    /* 帖子阅读卡片 */
    html.ld-clean-mode .topic-post {
        background: #ffffff !important;
        border-radius: 16px;
        border: 1px solid rgba(0,0,0,0.06);
        padding: 12px 14px;
        margin: 12px 0;
        box-shadow: 0 6px 22px rgba(0,0,0,0.08);
        box-sizing: border-box !important;
    }

    html.ld-clean-mode .topic-body .regular,
    html.ld-clean-mode .cooked {
        /* 移除了 font-size: 16px; */
        /* 移除了 line-height: 1.82; */
        /* 移除了 color: #1e293b !important; */
    }

    html.ld-clean-mode .cooked p {
        margin: 0.45em 0 1.05em;
    }

    html.ld-clean-mode .cooked code,
    html.ld-clean-mode .cooked pre {
        border-radius: 6px;
        background: #f3f4f6 !important;
        /* 移除了 color: #1e293b !important; */
    }

    html.ld-clean-mode .suggested-topics,
    html.ld-clean-mode .related-topics {
        background: transparent;
        opacity: 0.9;
        box-shadow: none;
    }

    html.ld-clean-mode #footer,
    html.ld-clean-mode .footer {
        opacity: 0.5;
    }
}

/* =========================================================
   清爽模式隐藏逻辑（与你原脚本一致）
========================================================= */

/* 顶部全局公告 */
html.ld-clean-mode #global-notice-alert-global-notice.alert.alert-info.alert-global-notice,
html.ld-clean-mode .alert-global-notice {
    display: none !important;
}

/* 列表底部分类徽章 */
html.ld-clean-mode div.link-bottom-line a.badge-category__wrapper {
    display: none !important;
}

/* 列表右侧小头像列 */
html.ld-clean-mode td.posters.topic-list-data {
    display: none !important;
}

/* 标签（tag 区域） */
html.ld-clean-mode a.discourse-tag.box[href^="/tag/"] {
    display: none !important;
}

/* 新增：隐藏带有特定类的按钮 */
html.ld-clean-mode a.btn.no-text.icon.btn-flat {
    display: none !important;
}

        `;
        document.head.appendChild(style);
    }

    // 新增函数：注入或修改 viewport meta 标签
    function injectViewportMeta() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        // 设置或更新 content 属性，确保初始缩放和最小缩放
        // width=device-width: 页面宽度等于设备宽度
        // initial-scale=1.0: 初始缩放比例为100%
        // minimum-scale=1.0: 最小缩放比例为100%，防止用户继续缩小
        // user-scalable=yes: 允许用户手动缩放（如果需要禁止缩放，可以设置为 no）
        const desiredContent = 'width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes';
        if (viewportMeta.content !== desiredContent) {
            viewportMeta.content = desiredContent;
        }
    }

    function applyDynamicHiding() {
        document.querySelectorAll('[' + HIDDEN_ATTR + ']').forEach(el => {
            el.style.display = '';
            el.removeAttribute(HIDDEN_ATTR);
        });

        const hide = (el) => {
            if (!el || el.hasAttribute(HIDDEN_ATTR)) return;
            el.setAttribute(HIDDEN_ATTR, '1');
            el.style.display = 'none';
        };

        // 欢迎提示文案
        try {
            const targetText = '希望你喜欢这里。有问题，请提问，或搜索现有帖子。';
            document.querySelectorAll('p').forEach(p => {
                if ((p.textContent || '').includes(targetText)) hide(p);
            });
        } catch {}

        // 指定推广贴
        try {
            const promo = document.querySelector('a[href="https://linux.do/t/topic/482293"]');
            if (promo) hide(promo.closest('div') || promo.parentElement);
        } catch {}

        // 自动收起侧边栏（与原脚本一致）
        try {
            const btn = document.querySelector('button.btn-sidebar-toggle');
            if (btn && btn.getAttribute('aria-expanded') === 'true') btn.click();
        } catch {}
    }

    function setupObserver() {
        let timer = null;
        const target = document.querySelector('#main-outlet') || document.body;
        if (!target) return;

        new MutationObserver((mutations) => {
            let added = false;
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length) added = true;
            }
            if (!added) return;

            clearTimeout(timer);
            timer = setTimeout(() => applyDynamicHiding(), 80);
        }).observe(target, { childList: true, subtree: true });
    }

    function start() {
        injectBaseStyle();
        injectViewportMeta();
        document.documentElement.classList.add('ld-clean-mode');
        applyDynamicHiding();
        setupObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else start();
})();