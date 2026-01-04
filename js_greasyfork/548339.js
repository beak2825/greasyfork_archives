// ==UserScript==
// @name         Reddit Snap Scroll
// @description  Keyboard navigation (W/S), highlight, open (E), hide previous post
// @name:ru      Reddit Snap Scroll — навигация и скрытие
// @description:ru Навигация по постам (W/S), подсветка, открытие (E), скрытие предыдущего поста
// @namespace    https://git.prizmed.com/Leviann/tampermonkey-personal
// @version      2025.09.04.3
// @author       Farid Ismailov
// @match        https://www.reddit.com/*
// @grant        GM_openInTab
// @run-at       document-end
// @icon         https://www.reddit.com/favicon.ico
// @license      Personal
// @downloadURL https://update.greasyfork.org/scripts/548339/Reddit%20Snap%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/548339/Reddit%20Snap%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POST_SELECTOR = 'article';
    const HEADER_SELECTOR = 'header';
    const CENTER_OFFSET = 30;
    const HIGHLIGHT_STYLE = 'outline:2px solid orange;outline-offset:2px;';

    const AUTO_HIDE_ENABLED = false;
    const HIDE_PREVIOUS_ON_NEXT = true;
    const AUTO_HIDE_DEBOUNCE_MS = 120;
    const MENU_APPEAR_TIMEOUT_MS = 1500;
    const MENU_POLL_INTERVAL_MS = 120;
    const SEEN_ACTIVATE_RATIO = 0.55;

    const header = document.querySelector(HEADER_SELECTOR);
    const headerHeight = header ? header.offsetHeight : 0;
    let currentHighlightedPost = null;
    const seenPosts = new WeakSet();
    const hiddenPosts = new WeakSet();
    let autoHideScheduled = false;
    let autoHideRunning = false;

    function getCookie(name) {
        const pattern = new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)');
        const match = document.cookie.match(pattern);
        return match ? decodeURIComponent(match[1]) : null;
    }

    function getCsrfToken() {
        return getCookie('csrf_token') || getCookie('csrfToken') || getCookie('csrf') || '';
    }

    function isTypingTarget(el) {
        if (!el) return false;
        const tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return true;
        return false;
    }

    function getCenteredScrollPosition(post) {
        const rect = post.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const h = rect.height;
        const wh = window.innerHeight;
        return top - wh / 2 + h / 2 - headerHeight + CENTER_OFFSET;
    }

    function highlightPost(post) {
        if (currentHighlightedPost) {
            currentHighlightedPost.style.cssText = '';
        }
        if (post) {
            post.style.cssText = HIGHLIGHT_STYLE;
            currentHighlightedPost = post;
        }
    }

    function listPosts() {
        return Array.from(document.querySelectorAll(POST_SELECTOR));
    }

    function resolveThingId(post) {
        try {
            const idAttr = post.getAttribute('id');
            if (idAttr && /^t3_/.test(idAttr)) return idAttr;
        } catch (_) { }
        try {
            const sp = post.closest('shreddit-post');
            if (sp) {
                const pid = sp.getAttribute('post-id');
                if (pid) return pid;
            }
        } catch (_) { }
        try {
            const a = post.querySelector('a[href*="/comments/"]');
            if (a) {
                const href = a.getAttribute('href') || '';
                const m = href.match(/\/comments\/([a-z0-9]+)\//i);
                if (m && m[1]) return 't3_' + m[1];
            }
        } catch (_) { }
        return '';
    }

    async function apiHideByThingId(thingId, csrfToken) {
        if (!thingId || !csrfToken) return false;
        try {
            const res = await fetch('/svc/shreddit/graphql', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    operation: 'UpdatePostHideState',
                    variables: { input: { postId: thingId, hideState: 'HIDDEN' } },
                    csrf_token: csrfToken
                })
            });
            if (!res.ok) return false;
            const data = await res.json().catch(() => ({}));
            const ok = !!(data && data.data && data.data.updatePostHideState && data.data.updatePostHideState.ok);
            return ok;
        } catch (_) {
            return false;
        }
    }

    function findNextPost() {
        for (const post of document.querySelectorAll(POST_SELECTOR)) {
            if (post.getBoundingClientRect().top > window.innerHeight / 2) {
                return post;
            }
        }
        return null;
    }

    function findPreviousPost() {
        const posts = document.querySelectorAll(POST_SELECTOR);
        for (let i = posts.length - 1; i >= 0; i--) {
            if (posts[i].getBoundingClientRect().bottom < window.innerHeight / 2) {
                return posts[i];
            }
        }
        return null;
    }

    function isFeedPage() {
        const p = location.pathname;
        if (p.includes('/comments/')) return false;
        return true;
    }

    function rectCenterY(rect) {
        return rect.top + rect.height / 2;
    }

    function shouldMarkSeen(rect) {
        const centerY = rectCenterY(rect);
        return centerY >= 0 && centerY <= window.innerHeight * SEEN_ACTIVATE_RATIO;
    }

    function shouldHide(rect) {
        return rect.bottom < (headerHeight + 4);
    }

    function getOverflowMenu(post) {
        let el = null;
        try { el = post.querySelector('shreddit-post-overflow-menu'); } catch (_) { }
        if (el) return el;
        const postId = (function () {
            const idAttr = post.getAttribute('id');
            if (idAttr && /^t3_/.test(idAttr)) return idAttr;
            const sp = post.closest('shreddit-post');
            if (sp && sp.getAttribute) {
                const pid = sp.getAttribute('post-id');
                if (pid) return pid;
            }
            return null;
        })();
        if (postId) {
            const byId = document.querySelector(`shreddit-post-overflow-menu[post-id="${postId}"]`);
            if (byId) return byId;
        }
        const all = Array.from(document.querySelectorAll('shreddit-post-overflow-menu'));
        if (!all.length) return null;
        const pr = post.getBoundingClientRect();
        all.sort((a, b) => distanceBetweenRects(a.getBoundingClientRect(), pr) - distanceBetweenRects(b.getBoundingClientRect(), pr));
        return all[0] || null;
    }

    function elementText(el) {
        if (!el) return '';
        const txt = (el.getAttribute('aria-label') || '') + ' ' + (el.textContent || '');
        return txt.trim().toLowerCase();
    }

    function isHideMenuItem(btn) {
        const t = elementText(btn);
        if (!t) return false;
        if (t.includes('unhide')) return false;
        return t.includes(' hide') || t.startsWith('hide') || t.includes('скрыть') || t.includes('hide post') || t.includes('скрыть публикацию');
    }

    function distanceBetweenRects(a, b) {
        const ax = a.left + a.width / 2;
        const ay = a.top + a.height / 2;
        const bx = b.left + b.width / 2;
        const by = b.top + b.height / 2;
        const dx = ax - bx;
        const dy = ay - by;
        return Math.hypot(dx, dy);
    }

    function queryVisibleMenuItems() {
        const all = Array.from(document.querySelectorAll('button[role="menuitem"], [role="menuitem"]'));
        return all.filter(b => b instanceof HTMLElement && b.offsetParent !== null);
    }

    function findNearestHideMenuItem(anchorRect) {
        const items = queryVisibleMenuItems().filter(isHideMenuItem);
        if (!items.length) return null;
        items.sort((a, b) => distanceBetweenRects(a.getBoundingClientRect(), anchorRect) - distanceBetweenRects(b.getBoundingClientRect(), anchorRect));
        return items[0] || null;
    }

    function smartClick(el) {
        try { el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true })); } catch (_) { }
        try { el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true })); } catch (_) { }
        try { el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true })); } catch (_) { }
        try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true })); } catch (_) { }
    }

    function findNearestMoreButton(post) {
        const pr = post.getBoundingClientRect();
        const cand = Array.from(document.querySelectorAll('button[aria-haspopup="menu"], button[aria-label*="more" i], button[aria-label*="options" i]'));
        if (!cand.length) return null;
        cand.sort((a, b) => distanceBetweenRects(a.getBoundingClientRect(), pr) - distanceBetweenRects(b.getBoundingClientRect(), pr));
        return cand[0] || null;
    }

    function openOverflow(overflowEl, post) {
        try {
            const root = overflowEl.shadowRoot || overflowEl;
            let btn = root.querySelector('button[aria-label*="More" i], button[aria-label*="more" i], button, [role="button"]');
            if (!btn) btn = overflowEl.querySelector('button, [role="button"]');
            if (btn) { smartClick(btn); return true; }
        } catch (_) { }
        try { smartClick(overflowEl); return true; } catch (_) { }
        const altBtn = findNearestMoreButton(post);
        if (altBtn) { smartClick(altBtn); return true; }
        return false;
    }

    function waitForMenuAndHide(anchorRect, deadlineMs) {
        const end = Date.now() + deadlineMs;
        return new Promise(resolve => {
            const tick = () => {
                const item = findNearestHideMenuItem(anchorRect);
                if (item) {
                    item.click();
                    resolve(true);
                    return;
                }
                if (Date.now() >= end) { resolve(false); return; }
                setTimeout(tick, MENU_POLL_INTERVAL_MS);
            };
            tick();
        });
    }

    async function tryHidePost(post) {
        if (hiddenPosts.has(post)) return false;
        const thingId = resolveThingId(post);
        const csrf = getCsrfToken();
        let ok = false;
        if (thingId && csrf) {
            ok = await apiHideByThingId(thingId, csrf);
        }
        if (!ok) {
            const overflow = getOverflowMenu(post);
            if (!overflow) return false;
            const anchorRect = overflow.getBoundingClientRect();
            const opened = openOverflow(overflow, post);
            if (!opened) return false;
            ok = await waitForMenuAndHide(anchorRect, MENU_APPEAR_TIMEOUT_MS);
        }
        if (ok) {
            hiddenPosts.add(post);
            return true;
        }
        return false;
    }

    async function hidePreviousIfNeeded(prevPost) {
        if (!HIDE_PREVIOUS_ON_NEXT) return;
        if (!prevPost) return;
        try { await tryHidePost(prevPost); } catch (_) { }
    }

    async function autoHideTick() {
        if (!AUTO_HIDE_ENABLED || !isFeedPage()) return;
        if (autoHideRunning) return;
        autoHideRunning = true;
        try {
            const posts = listPosts();
            for (const post of posts) {
                if (hiddenPosts.has(post)) continue;
                const rect = post.getBoundingClientRect();
                if (!seenPosts.has(post) && shouldMarkSeen(rect)) {
                    seenPosts.add(post);
                }
                if (seenPosts.has(post) && shouldHide(rect)) {
                    // Try hide and stop early if we actually hid one, to avoid multi-clicks at once
                    const ok = await tryHidePost(post);
                    if (ok) break;
                }
            }
        } finally {
            autoHideRunning = false;
            autoHideScheduled = false;
        }
    }

    function scheduleAutoHide() {
        if (!AUTO_HIDE_ENABLED || !isFeedPage()) return;
        if (autoHideScheduled) return;
        autoHideScheduled = true;
        setTimeout(() => { autoHideTick(); }, AUTO_HIDE_DEBOUNCE_MS);
    }

    function getGallery(container) {
        const faceplate = container.querySelector('faceplate-carousel');
        if (faceplate) return { type: 'faceplate', el: faceplate };
        const gallery = container.querySelector('gallery-carousel');
        if (gallery) return { type: 'gallery', el: gallery };
        return { type: 'none', el: null };
    }

    function getCarouselButtons(faceplate) {
        const prev = faceplate.querySelector('span[slot="prevButton"] button, [slot="prevButton"] button, button[aria-label="Previous page"], button[aria-label^="Previous"]');
        const next = faceplate.querySelector('span[slot="nextButton"] button, [slot="nextButton"] button, button[aria-label="Next page"], button[aria-label^="Next"]');
        return { prev, next };
    }

    function dispatchArrow(targetEl, key) {
        try {
            const ev1 = new KeyboardEvent('keydown', { key, code: key, bubbles: true, composed: true });
            targetEl.dispatchEvent(ev1);
        } catch (_) { }
        try {
            const ev2 = new KeyboardEvent('keydown', { key, code: key, bubbles: true, composed: true });
            document.dispatchEvent(ev2);
        } catch (_) { }
        try {
            const ev3 = new KeyboardEvent('keydown', { key, code: key, bubbles: true, composed: true });
            window.dispatchEvent(ev3);
        } catch (_) { }
    }

    function navigateCarousel(direction) {
        const target = (function () {
            if (currentHighlightedPost) return currentHighlightedPost;
            const next = findNextPost();
            if (next) return next;
            return findPreviousPost();
        })();
        if (!target) return;
        const gallery = getGallery(target);
        if (gallery.type === 'faceplate' || gallery.type === 'gallery') {
            // Avoid hiding carousel slides as "posts"
            return;
        }
        if (gallery.type === 'faceplate') {
            const { prev, next } = getCarouselButtons(gallery.el);
            if (direction === 'next' && next) next.click();
            else if (direction === 'prev' && prev) prev.click();
            return;
        }
        if (gallery.type === 'gallery') {
            const el = gallery.el;
            if (direction === 'next' && typeof el.next === 'function') { el.next(); return; }
            if (direction === 'prev' && typeof el.prev === 'function') { el.prev(); return; }
            if (direction === 'next' && typeof el.nextPage === 'function') { el.nextPage(); return; }
            if (direction === 'prev' && typeof el.prevPage === 'function') { el.prevPage(); return; }
            const key = direction === 'next' ? 'ArrowRight' : 'ArrowLeft';
            dispatchArrow(el, key);
            return;
        }
    }

    function handleKeydown(event) {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        if (isTypingTarget(event.target)) return;
        if (event.code === 'KeyS') {
            const prevToHide = currentHighlightedPost;
            const next = findNextPost();
            if (next) {
                window.scrollTo({ top: getCenteredScrollPosition(next), behavior: 'auto' });
                highlightPost(next);
                hidePreviousIfNeeded(prevToHide);
                scheduleAutoHide();
            }
        } else if (event.code === 'KeyW') {
            const prev = findPreviousPost();
            if (prev) {
                window.scrollTo({ top: getCenteredScrollPosition(prev), behavior: 'auto' });
                highlightPost(prev);
                scheduleAutoHide();
            }
        } else if (event.code === 'KeyE' || event.key === 'у' || event.key === 'У') {
            const target = (function () {
                if (currentHighlightedPost) return currentHighlightedPost;
                const next = findNextPost();
                if (next) return next;
                return findPreviousPost();
            })();
            if (target) {
                let link = target.querySelector('a[data-click-id="body"]');
                if (!link) link = target.querySelector('a[href*="/comments/"]');
                if (!link) link = target.querySelector('a[href]:not([href^="#"]):not([href^="javascript:"])');
                if (link) {
                    let url = link.getAttribute('href');
                    if (url && url.startsWith('/')) url = location.origin + url;
                    if (url) {
                        if (typeof GM_openInTab === 'function') {
                            GM_openInTab(url, { active: false, insert: true, setParent: true });
                        } else {
                            window.open(url, '_blank', 'noopener,noreferrer');
                        }
                    }
                }
            }
        } else if (event.code === 'KeyD' || event.key === 'в' || event.key === 'В') {
            navigateCarousel('next');
        } else if (event.code === 'KeyA' || event.key === 'ф' || event.key === 'Ф') {
            navigateCarousel('prev');
        }
    }

    // Вешаем на window, фаза захвата
    window.addEventListener('keydown', handleKeydown, true);
    window.addEventListener('scroll', scheduleAutoHide, { passive: true });

    // Отслеживаем динамически подгружаемые посты (слушатель уже на window, дополнительная переинициализация не нужна)
    const observer = new MutationObserver(() => { scheduleAutoHide(); });
    observer.observe(document.body, { childList: true, subtree: true });

    // First run
    scheduleAutoHide();
})();
