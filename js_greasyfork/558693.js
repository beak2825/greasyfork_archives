// ==UserScript==
// @name         YouTube ライブチャット 軽量化
// @name:en      YouTube Live Chat Lightweight
// @namespace    bolt-youtube-live-chat-lightweight
// @version      0.4.1
// @description  ライブチャットの動作を軽くします。配信中のカクつきやCPU負荷を軽減。
// @description:en  Reduces live chat rendering load for smoother streaming experience.
// @author       utamaro
// @license      MIT
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/live_chat*
// @match        https://www.youtube.com/live_chat_replay*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558693/YouTube%20%E3%83%A9%E3%82%A4%E3%83%96%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%20%E8%BB%BD%E9%87%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558693/YouTube%20%E3%83%A9%E3%82%A4%E3%83%96%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%20%E8%BB%BD%E9%87%8F%E5%8C%96.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const p = location.pathname;
    if (!p.startsWith('/live_chat') && !p.startsWith('/live_chat_replay')) return;

    const DEFAULT_HEIGHT = 72;
    const MAX_HEIGHT = 1200;
    const BOOT_INTERVAL = 300;
    const MAX_RETRIES = 50;

    const ITEM_TAGS = [
        'yt-live-chat-text-message-renderer',
        'yt-live-chat-paid-message-renderer',
        'yt-live-chat-paid-sticker-renderer',
        'yt-live-chat-membership-item-renderer',
        'yt-live-chat-sponsor-message-renderer',
        'yt-live-chat-mode-change-message-renderer',
        'yt-live-chat-viewer-engagement-message-renderer',
        'yt-live-chat-banner-renderer',
        'yt-live-chat-auto-mod-message-renderer',
        'yt-live-chat-placeholder-item-renderer',
    ].join(',');

    const CONTAINER_QUERIES = [
        'yt-live-chat-item-list-renderer #items',
        'yt-live-chat-item-list-renderer #item-scroller #items',
        'yt-live-chat-item-list-renderer #contents #items',
    ];

    const css = document.createElement('style');
    css.textContent = `
        .ulc-item {
            content-visibility: auto;
            contain: layout paint style;
            contain-intrinsic-block-size: var(--ulc-h, ${DEFAULT_HEIGHT}px);
        }
        yt-live-chat-item-list-renderer #items {
            contain: paint style;
        }
    `;
    const mountPoint = document.head || document.documentElement;
    if (mountPoint) mountPoint.appendChild(css);
    else document.addEventListener('readystatechange', () => (document.head || document.documentElement)?.appendChild(css), { once: true });

    const seen = new WeakSet();
    const heights = new WeakMap();

    const resizer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const target = entry.target;
            if (!target.isConnected) {
                resizer.unobserve(target);
                continue;
            }

            const bbs = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
            const h = Math.round(bbs?.blockSize ?? entry.contentRect.height);

            if (h < 24 || h > MAX_HEIGHT) continue;

            const prev = heights.get(target) || 0;
            if (Math.abs(h - prev) < 2) continue;

            heights.set(target, h);
            target.style.setProperty('--ulc-h', h + 'px');
        }
    });

    function optimizeImg(img) {
        if (img.dataset.ulc) return;
        img.dataset.ulc = '1';

        if (img.decoding !== 'async') img.decoding = 'async';
        if ('loading' in img && img.loading !== 'lazy') img.loading = 'lazy';
        if ('fetchPriority' in img && img.fetchPriority !== 'low') img.fetchPriority = 'low';
    }

    function optimizeItem(el) {
        if (seen.has(el)) return;
        seen.add(el);

        el.classList.add('ulc-item');
        el.style.setProperty('--ulc-h', DEFAULT_HEIGHT + 'px');

        for (const img of el.querySelectorAll('img')) optimizeImg(img);

        resizer.observe(el);
    }

    let queue = new Set();
    let raf = 0;

    function flush() {
        raf = 0;
        const nodes = Array.from(queue);
        queue.clear();

        for (const node of nodes) {
            if (node.matches?.(ITEM_TAGS)) optimizeItem(node);
            node.querySelectorAll?.(ITEM_TAGS).forEach(optimizeItem);
        }
    }

    function enqueue(node) {
        if (node instanceof Element) {
            queue.add(node);
            raf ||= requestAnimationFrame(flush);
        }
    }

    function unobserveTree(node) {
        if (!(node instanceof Element)) return;
        if (node.matches?.(ITEM_TAGS)) resizer.unobserve(node);
        node.querySelectorAll?.(ITEM_TAGS).forEach(el => resizer.unobserve(el));
    }

    function findContainer() {
        for (const q of CONTAINER_QUERIES) {
            const el = document.querySelector(q);
            if (el) return el;
        }
        return null;
    }

    let initialized = false;

    function init() {
        if (initialized) return true;

        const container = findContainer();
        if (!container) return false;

        initialized = true;

        container.querySelectorAll(ITEM_TAGS).forEach(optimizeItem);

        new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) enqueue(node);
                for (const node of m.removedNodes) unobserveTree(node);
            }
        }).observe(container, { childList: true, subtree: false });

        container.addEventListener(
            'load',
            e => {
                const t = e.target;
                if (t instanceof HTMLImageElement) optimizeImg(t);
            },
            true
        );

        return true;
    }

    let retries = 0;
    (function boot() {
        if (init() || ++retries > MAX_RETRIES) return;
        setTimeout(boot, BOOT_INTERVAL);
    })();
})();