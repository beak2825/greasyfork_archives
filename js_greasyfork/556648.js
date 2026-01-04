// ==UserScript==
// @name         少数派-派早报华为新闻自动点踩
// @version      1.5
// @author       Steve Hou
// @description  当派早报新闻与华为有关，即包含华为相关产品关键词时，自动点击此条新闻的“踩”按钮。
// @match        https://sspai.com/post/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1540700
// @downloadURL https://update.greasyfork.org/scripts/556648/%E5%B0%91%E6%95%B0%E6%B4%BE-%E6%B4%BE%E6%97%A9%E6%8A%A5%E5%8D%8E%E4%B8%BA%E6%96%B0%E9%97%BB%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/556648/%E5%B0%91%E6%95%B0%E6%B4%BE-%E6%B4%BE%E6%97%A9%E6%8A%A5%E5%8D%8E%E4%B8%BA%E6%96%B0%E9%97%BB%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B8%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEYWORDS = ['华为', 'HarmonyOS', '鸿蒙', '问界', '智界', '享界','尊界','尚界'];

    const CONTENT_SELECTOR = '.post__body__extend__item__content.wangEditor-txt';
    // const CONTENT_SELECTOR = 'post__body__extend__item comp__PostBodyExtendItem';
    const EMOJI_DIV_SELECTOR = '.emoji.comp__Emoji';
    const ALT_ATTR = '踩';

    function simulateClick(el) {
        if (!el) return;
        try {
            const ev = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            el.dispatchEvent(ev);
        } catch {
            el.click();
        }
    }

    function handleContentNode(node) {
        if (!node) return;

        const text = (node.textContent || '').trim();
        const hit = KEYWORDS.some(k => text.includes(k));
        if (!hit) return;

        /** -------------------------
         * 新增功能：检测此区块是否已被当前用户点过“踩”
         * 若满足：span.emoji__reaction__item.login_user_on 下面有 img[alt="踩"]
         * 则直接跳过，不再点击
         -------------------------- */
        const alreadyPoked = node.parentElement.querySelector(
            'div.comment__footer__wrapper span.emoji__reaction__item.login_user_on div.emoji img[alt="踩"]'
        );
        if (alreadyPoked) {
            console.log('[自动踩] 本段已由用户点过“踩”，跳过：', node);
            return;
        }

        // 找最近的父块（emoji 所在区块）
        const ancestorWithEmoji = node.closest('.post__body__extend__item');
        let emojiDiv = null;

        if (ancestorWithEmoji) {
            const img = ancestorWithEmoji.querySelector(`${EMOJI_DIV_SELECTOR} img[alt="${ALT_ATTR}"]`);
            if (img) emojiDiv = img.closest(EMOJI_DIV_SELECTOR) || img.parentElement;
        }

        // fallback
        if (!emojiDiv) {
            const globalImg = document.querySelector(`${EMOJI_DIV_SELECTOR} img[alt="${ALT_ATTR}"]`);
            if (globalImg) emojiDiv = globalImg.closest(EMOJI_DIV_SELECTOR) || globalImg.parentElement;
        }

        if (!emojiDiv) return;

        if (emojiDiv.dataset.__auto_poked === '1') return;

        emojiDiv.dataset.__auto_poked = '1';

        console.log('[自动踩] 匹配关键词 -> 点踩：', node);
        simulateClick(emojiDiv);
    }

    function scanExisting() {
        document.querySelectorAll(CONTENT_SELECTOR).forEach(n => handleContentNode(n));
    }

    const observer = new MutationObserver(muts => {
        muts.forEach(m => {
            m.addedNodes.forEach(added => {
                if (!(added instanceof Element)) return;

                if (added.matches?.(CONTENT_SELECTOR)) handleContentNode(added);

                const inner = added.querySelectorAll?.(CONTENT_SELECTOR);
                inner?.forEach(n => handleContentNode(n));
            });
        });
    });

    function startObserver() {
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            scanExisting();
            startObserver();
        });
    } else {
        scanExisting();
        startObserver();
    }

    setTimeout(scanExisting, 1500);
    setTimeout(scanExisting, 4000);
})();
