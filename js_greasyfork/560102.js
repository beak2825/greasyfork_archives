// ==UserScript==
// @name         屏蔽知乎网页版嵌入广告卡片
// @namespace    https://tampermonkey.net/
// @version      1.4
// @description  基于结构特征给知乎信息流广告卡片添加标记/隐藏
// @match        *://*.zhihu.com/*
// @run-at       document-end
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/560102/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%89%88%E5%B5%8C%E5%85%A5%E5%B9%BF%E5%91%8A%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/560102/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%89%88%E5%B5%8C%E5%85%A5%E5%B9%BF%E5%91%8A%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const HIDE_AD_CARD = false; // false = 打标签，true = 直接隐藏

    /**
     * 判断是否为广告卡片，并返回命中规则
     * @param {HTMLElement} card
     * @returns {string|null}
     */
    function detectAdReason(card) {
        if (!card) return null;

        // ---------- 强规则 ----------
        const feed = card.querySelector('.Feed');
        if (feed) {
            const attached = feed.getAttribute('attached_info_bytes');
            if (attached && attached.includes('PromotionExtra')) {
                return 'PromotionExtra';
            }
        }

        // ---------- 中规则 ----------
        const contentItem = card.querySelector('.ContentItem');
        if (contentItem) {
            const isArticle = contentItem.classList.contains('ArticleItem');
            const itemType = contentItem.getAttribute('itemtype');
            const zaExtra = contentItem.getAttribute('data-za-extra-module');

            if (
                isArticle &&
                itemType === 'http://schema.org/SocialMediaPosting' &&
                zaExtra &&
                zaExtra.includes('"type":"Post"')
            ) {
                return 'Post + SocialMediaPosting';
            }
        }

        return null;
    }

    /**
     * 给广告卡片添加角标
     * @param {HTMLElement} card
     * @param {string} reason
     */
    function markAd(card, reason) {
        if (card.dataset.zhihuAdMarked) return;
        card.dataset.zhihuAdMarked = 'true';

        // 保证定位可用
        const style = window.getComputedStyle(card);
        if (style.position === 'static') {
            card.style.position = 'relative';
        }

        const badge = document.createElement('div');
        badge.textContent = 'AD';
        badge.title = `Ad detected by: ${reason}`;

        badge.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            padding: 2px 6px;
            font-size: 12px;
            line-height: 1.4;
            font-weight: bold;
            color: #fff;
            background: rgba(220, 38, 38, 0.95);
            border-radius: 4px;
            pointer-events: none;
            user-select: none;
        `;

        card.appendChild(badge);
    }

    /**
     * 扫描卡片并打标
     * @param {ParentNode} root
     */
    function scan(root = document) {
        const cards = root.querySelectorAll('.TopstoryItem');
        cards.forEach(card => {
            if (card.dataset.zhihuAdChecked) return;
            card.dataset.zhihuAdChecked = 'true';

            const reason = detectAdReason(card);
            if (reason) {
                if (HIDE_AD_CARD) {
                    card.style.display = 'none';
                } else {
                    markAd(card, reason);
                }
            }
        });
    }

    /**
     * 监听动态加载
     */
    function observe() {
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;

                    if (node.matches?.('.TopstoryItem')) {
                        scan(node.parentNode);
                    } else if (node.querySelector?.('.TopstoryItem')) {
                        scan(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        scan(document);
        observe();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
