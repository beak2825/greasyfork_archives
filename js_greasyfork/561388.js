// ==UserScript==
// @name         放大微博字体
// @namespace    weibo-font-final
// @version      1.9
// @description  放大微博正文、转发及评论中的字体大小
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561388/%E6%94%BE%E5%A4%A7%E5%BE%AE%E5%8D%9A%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/561388/%E6%94%BE%E5%A4%A7%E5%BE%AE%E5%8D%9A%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置存储键（类似于YAWF的GM存储）
    const FONT_SIZE_KEY = 'weibo_font_size';
    const DEFAULT_FONT_SIZE = 20; // 默认值，像YAWF默认16，但您原脚本是20-22
    const MIN_FONT_SIZE = 12;
    const MAX_FONT_SIZE = 30;

    // 获取或初始化字体大小（类似于YAWF的getConfig）
    function getFontSize() {
        let size = GM_getValue(FONT_SIZE_KEY, DEFAULT_FONT_SIZE);
        if (size < MIN_FONT_SIZE || size > MAX_FONT_SIZE) size = DEFAULT_FONT_SIZE;
        return size;
    }

    // 设置字体大小（类似于YAWF的setConfig）
    function setFontSize(size) {
        if (size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
            GM_setValue(FONT_SIZE_KEY, size);
            applyStyles(); // 立即应用新样式
        }
    }

    // 动态生成并注入CSS（类似于YAWF的css.append）
    function applyStyles() {
        const size = getFontSize();
        const styleId = 'weibo-font-style';
        let style = document.getElementById(styleId);
        if (style) style.remove(); // 移除旧样式，重新注入

        style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            /* ===== 原创微博正文（类似于YAWF的.WB_feed_detail .WB_text） ===== */
            .wbpro-feed-content .wbpro-feed-ogText > div {
                font-size: ${size}px !important;
                line-height: 1.5 !important;
            }

            /* ===== 转发微博里的「被转发正文」（类似于YAWF的.WB_expand .WB_text） ===== */
            .wbpro-feed-reText [class^="_wbtext_"] {
                font-size: ${size - 2}px !important; /* 略小，像原脚本的20px */
                line-height: 1.5 !important;
            }

            /* ===== 评论正文 ===== */
            .wbpro-list .item1 .text {
                font-size: ${size - 2}px !important;
                line-height: 1.5 !important;
            }

            /* ===== 评论 / 转发 / 网页各处昵称 ===== */
            .wbpro-list .item1 .text a span,
            .wbpro-feed-reText a span,
            ._link_18nz8_124 span,
            ._bolder_18nz8_63 span,
            ._nick_18nz8_25 span {
                font-size: ${size}px !important;
                line-height: 1.5 !important;
            }

            /* ===== 正文和评论表情放大并微调（随文字大小调整，像YAWF动态） ===== */
            .wbpro-feed-content ._wbtext_1psp9_14 img,
            .wbpro-list .item1 .text img {
                width: 1em !important;
                height: 1em !important;
                vertical-align: middle !important;
                transform: translateY(-0.08em);
            }

            /* ===== 其他图标 / 表情垂直居中 ===== */
            .wbpro-feed-content svg,
            .wbpro-list svg {
                vertical-align: middle !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 使用MutationObserver监视页面变化，确保动态内容应用样式（类似于YAWF的observer）
    function observePage() {
        const observer = new MutationObserver(() => {
            applyStyles(); // 页面变化时重新应用
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 添加脚本菜单入口（类似于YAWF的GM_registerMenuCommand外部菜单）
    GM_registerMenuCommand('调整字体大小（当前: ' + getFontSize() + 'px）', () => {
        const newSize = prompt('请输入字体大小 (12-30px，默认20px):', getFontSize());
        if (newSize !== null) {
            const parsedSize = parseInt(newSize, 10);
            if (!isNaN(parsedSize)) {
                setFontSize(parsedSize);
                alert('字体大小已更新为 ' + parsedSize + 'px。刷新页面查看效果。');
            } else {
                alert('无效输入，请输入12-30之间的数字。');
            }
        }
    });

    // 初始化：页面加载时应用样式并启动观察
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyStyles();
            observePage();
        });
    } else {
        applyStyles();
        observePage();
    }
})();