// ==UserScript==
// @name         微博聊天-纯表情消息优化（放大+取消气泡）
// @namespace    http://tampermonkey.net/
// @version      1
// @author       tu
// @description  放大纯表情消息，移除其气泡背景（支持多个表情）
// @match        https://api.weibo.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556949/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E7%BA%AF%E8%A1%A8%E6%83%85%E6%B6%88%E6%81%AF%E4%BC%98%E5%8C%96%EF%BC%88%E6%94%BE%E5%A4%A7%2B%E5%8F%96%E6%B6%88%E6%B0%94%E6%B3%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556949/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E7%BA%AF%E8%A1%A8%E6%83%85%E6%B6%88%E6%81%AF%E4%BC%98%E5%8C%96%EF%BC%88%E6%94%BE%E5%A4%A7%2B%E5%8F%96%E6%B6%88%E6%B0%94%E6%B3%A1%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 注入 CSS
    const style = document.createElement("style");
    style.innerHTML = `
        /* 放大纯表情，仅作用于被标记的消息 */
        .wb-large-emoji img.defaulticon {
            max-width: 36px !important;
            max-height: 36px !important;
        }

        /* 移除箭头 */
        .wb-remove-bubble-arrow {
            border: none !important;
            background: transparent !important;
        }

        /* 移除气泡外层 */
        .wb-remove-bubble-cont {
            background: transparent !important;
            border: none !important;
            margin-top: 0 !important;
            box-shadow: none !important;
        }

        /* 移除 bubble_cont 内部小白块 */
        .wb-remove-bubble-cont > div:not([data-v-09bbef1a]) {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }
    `;
    document.head.appendChild(style);

    function process() {
        const ps = document.querySelectorAll('p[data-v-09bbef1a]');

        ps.forEach(p => {
            const imgs = p.querySelectorAll("img.defaulticon");

            // 必须至少有 1 个 img，且所有 childNode 都是 IMG（排除文本/空白）
            const allChildrenAreImgs =
                imgs.length > 0 &&
                imgs.length === Array.from(p.childNodes).filter(n => n.nodeType === 1 || n.nodeType === 3).length &&
                Array.from(p.childNodes).every(n =>
                    n.nodeType === 1 && n.tagName === "IMG"
                );

            if (!allChildrenAreImgs) return;

            // 标记 p（用于放大）
            p.classList.add("wb-large-emoji");

            // 找到 bubble_cont
            const bubbleCont = p.closest('.bubble_cont.basi.left');
            if (bubbleCont) {
                bubbleCont.classList.add("wb-remove-bubble-cont");
            }

            // 找 bubble_arrow（同级）
            const bubbleArrow = bubbleCont?.parentNode?.querySelector('.bubble_arrow.absolute.left');
            if (bubbleArrow) {
                bubbleArrow.classList.add("wb-remove-bubble-arrow");
            }
        });
    }

    // 初次执行
    process();

    // 监听动态加载
    const observer = new MutationObserver(() => process());
    observer.observe(document.body, { childList: true, subtree: true });
})();
