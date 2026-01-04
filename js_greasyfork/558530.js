// ==UserScript==
// @name         Collapse Flag Emoji Users' Tweets on X/Twitter
// @namespace    https://akun-helper.example
// @version      1.1
// @description  折叠/隐藏x.com个人时间线、搜索页包含国家旗帜的推文
// @match        https://x.com/home*
// @match        https://x.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558530/Collapse%20Flag%20Emoji%20Users%27%20Tweets%20on%20XTwitter.user.js
// @updateURL https://update.greasyfork.org/scripts/558530/Collapse%20Flag%20Emoji%20Users%27%20Tweets%20on%20XTwitter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FLAG_REGEX = /[\u{1F1E6}-\u{1F1FF}]{2,}/u;
    const COLLAPSED_HEIGHT = 40; // 折叠高度 20px

    // 从用户名节点提取国旗信息
    function getFlagInfoFromNameNode(nameNode) {
        if (!nameNode) return { hasFlag: false };

        // 1. img alt="🇨🇳"
        const imgs = nameNode.querySelectorAll('img[alt]');
        for (const img of imgs) {
            const alt = img.getAttribute('alt') || '';
            if (FLAG_REGEX.test(alt)) {
                return { hasFlag: true, imgSrc: img.src, alt };
            }
        }

        // 2. 纯文本 emoji
        const txt = nameNode.textContent || '';
        const match = txt.match(FLAG_REGEX);
        if (match) {
            return { hasFlag: true, textFlag: match[0] };
        }

        return { hasFlag: false };
    }

    // 把国旗信息存到 container 上，方便后面“再次隐藏”使用
    function storeFlagInfoOnContainer(container, flagInfo) {
        if (!flagInfo || !flagInfo.hasFlag) return;
        if (flagInfo.imgSrc) {
            container.dataset.flagEmojiType = 'img';
            container.dataset.flagEmojiSrc = flagInfo.imgSrc;
            container.dataset.flagEmojiAlt = flagInfo.alt || '';
        } else if (flagInfo.textFlag) {
            container.dataset.flagEmojiType = 'text';
            container.dataset.flagEmojiText = flagInfo.textFlag;
        }
    }

    // 从 container 恢复国旗信息
    function getFlagInfoFromContainer(container) {
        const type = container.dataset.flagEmojiType;
        if (type === 'img' && container.dataset.flagEmojiSrc) {
            return {
                hasFlag: true,
                imgSrc: container.dataset.flagEmojiSrc,
                alt: container.dataset.flagEmojiAlt || '',
            };
        }
        if (type === 'text' && container.dataset.flagEmojiText) {
            return {
                hasFlag: true,
                textFlag: container.dataset.flagEmojiText,
            };
        }
        return { hasFlag: false };
    }

    // 用户名后面的“隐藏/显示”按钮
    function attachToggleButton(nameNode, container) {
        if (!nameNode || !container) return;
        if (nameNode.dataset.flagToggleAttached === '1') return;
        nameNode.dataset.flagToggleAttached = '1';

        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginLeft = '6px';
        wrapper.style.fontSize = '11px';

        const btn = document.createElement('button');
        btn.textContent = '隐藏';
        btn.style.padding = '0 6px';
        btn.style.height = '18px';
        btn.style.lineHeight = '16px';
        btn.style.borderRadius = '999px';
        btn.style.border = '2px solid #eb2f96';
        btn.style.background = 'rgba(255,255,255,0.85)';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '11px';
        btn.style.whiteSpace = 'nowrap';

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            const state = container.dataset.flagEmojiState || 'collapsed';
            if (state === 'collapsed') {
                // 从 20px 展开
                expandTweet(container);
            } else {
                // 再次隐藏：重新生成遮罩 + 折叠
                const flagInfo = getFlagInfoFromContainer(container);
                collapseTweet(container, flagInfo);
            }
        });

        wrapper.appendChild(btn);
        nameNode.appendChild(wrapper);
    }

    // 准备动画基础
    function ensureAnimBase(container) {
        const computed = window.getComputedStyle(container);
        const prevPos = computed.position;
        if (!container.dataset.prevPosition) {
            container.dataset.prevPosition = prevPos || 'static';
        }
        if (prevPos === 'static' || !prevPos) {
            container.style.position = 'relative';
        }

        if (!container.dataset.flagTransitionSet) {
            container.style.transition = 'max-height 0.25s ease, opacity 0.25s ease';
            container.dataset.flagTransitionSet = '1';
        }

        if (!container.dataset.flagFullHeight) {
            const oldMax = container.style.maxHeight;
            container.style.maxHeight = 'none';
            const fullHeight = container.scrollHeight || 400;
            container.dataset.flagFullHeight = String(fullHeight);
            container.style.maxHeight = oldMax;
        }
    }

    // 创建遮罩（只含国旗按钮）
    function createFlagButtonOverlay(container, flagInfo) {
        const overlay = document.createElement('div');
        overlay.className = 'flag-filter-overlay';

        overlay.style.position = 'absolute';
        overlay.style.inset = '0';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.boxSizing = 'border-box';
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        overlay.style.backdropFilter = 'blur(12px)';
        overlay.style.WebkitBackdropFilter = 'blur(12px)';
        overlay.style.zIndex = '999';
        overlay.style.pointerEvents = 'auto';
        overlay.style.cursor = 'default';

        const containerRadius = window.getComputedStyle(container).borderRadius;
        if (containerRadius && containerRadius !== '0px') {
            overlay.style.borderRadius = containerRadius;
        } else {
            overlay.style.borderRadius = '12px';
        }

        overlay.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        const btn = document.createElement('button');
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.padding = '4px 10px';
        btn.style.borderRadius = '999px';
        btn.style.border = 'none';
        btn.style.background = 'rgba(255, 255, 255, 0.18)';
        btn.style.cursor = 'pointer';

        if (flagInfo && (flagInfo.imgSrc || flagInfo.textFlag)) {
            if (flagInfo.imgSrc) {
                const img = document.createElement('img');
                img.src = flagInfo.imgSrc;
                img.alt = flagInfo.alt || '';
                img.style.width = '20px';
                img.style.height = '20px';
                btn.appendChild(img);
            } else {
                const span = document.createElement('span');
                span.textContent = flagInfo.textFlag;
                span.style.fontSize = '18px';
                btn.appendChild(span);
            }
        } else {
            const span = document.createElement('span');
            span.textContent = '隐藏';
            span.style.fontSize = '13px';
            span.style.color = '#fff';
            btn.appendChild(span);
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            expandTweet(container);
            overlay.remove();
        });

        overlay.appendChild(btn);
        return overlay;
    }

    // 折叠并加遮罩
    function collapseTweet(container, flagInfo) {
        ensureAnimBase(container);

        // 先移除旧遮罩（如果有）
        const old = container.querySelector('.flag-filter-overlay');
        if (old) old.remove();

        const overlay = createFlagButtonOverlay(container, flagInfo);
        container.appendChild(overlay);

        collapseTweetAnimated(container, true);
    }

    // 折叠动画
    function collapseTweetAnimated(container, withOverlay) {
        ensureAnimBase(container);
        const fullHeight = parseInt(container.dataset.flagFullHeight || '400', 10);

        container.style.opacity = '1';
        container.style.maxHeight = fullHeight + 'px';
        void container.offsetHeight;

        container.dataset.flagEmojiState = 'collapsing';
        container.style.maxHeight = COLLAPSED_HEIGHT + 'px';
        container.style.opacity = withOverlay ? '1' : '0.75';

        const onEnd = (e) => {
            if (e.propertyName !== 'max-height') return;
            container.removeEventListener('transitionend', onEnd);
            container.dataset.flagEmojiState = 'collapsed';
        };
        container.addEventListener('transitionend', onEnd);
    }

    // 展开动画
    function expandTweet(container) {
        ensureAnimBase(container);
        const fullHeight = parseInt(container.dataset.flagFullHeight || '400', 10);

        container.dataset.flagEmojiState = 'expanding';
        container.style.opacity = '0.75';
        container.style.maxHeight = COLLAPSED_HEIGHT + 'px';
        void container.offsetHeight;

        container.style.maxHeight = fullHeight + 'px';
        container.style.opacity = '1';

        const onEnd = (e) => {
            if (e.propertyName !== 'max-height') return;
            container.removeEventListener('transitionend', onEnd);
            container.dataset.flagEmojiState = 'expanded';
            container.style.maxHeight = 'none';
        };
        container.addEventListener('transitionend', onEnd);
    }

    // 扫描页面
    function filterFlagUsers(root = document) {
        const nameNodes = root.querySelectorAll('[data-testid="User-Name"]');

        nameNodes.forEach((nameNode) => {
            if (nameNode.dataset.flagEmojiChecked === '1') return;

            const flagInfo = getFlagInfoFromNameNode(nameNode);
            if (!flagInfo.hasFlag) return;

            nameNode.dataset.flagEmojiChecked = '1';

            let container =
                nameNode.closest('article[data-testid="tweet"]') ||
                nameNode.closest('div[data-testid="cellInnerDiv"]') ||
                nameNode.closest('article') ||
                nameNode.closest('div[role="article"]');

            if (!container) return;

            storeFlagInfoOnContainer(container, flagInfo);
            attachToggleButton(nameNode, container);

            if (!container.dataset.flagEmojiState) {
                collapseTweet(container, flagInfo);
            }
        });
    }

    // 初次 + 监听
    filterFlagUsers();

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (!m.addedNodes || m.addedNodes.length === 0) continue;
            m.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                filterFlagUsers(node);
            });
        }
    });

    function start() {
        if (!document.body) return;
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        filterFlagUsers();
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
