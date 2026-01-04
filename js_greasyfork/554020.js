// ==UserScript==
// @name         Perplexity Power Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  Keyboard Shortcuts for Perplexity.ai: GSAP-powered scrolling, edit message, focus input, set sources (Academic/Social/GitHub), Search, Research.
// @author       Brian Hurd
// @match        https://perplexity.ai/*
// @match        https://www.perplexity.ai/*
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollToPlugin.min.js
// @downloadURL https://update.greasyfork.org/scripts/554020/Perplexity%20Power%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/554020/Perplexity%20Power%20Shortcuts.meta.js
// ==/UserScript==

// Alt+t         → Scroll to top of main thread
// Alt+z         → Scroll to bottom of main thread
// Alt+j         → Scroll up one message block
// Alt+k         → Scroll down one message block
// Alt+e         → Edit lowest user message (clicks [data-testid="edit-query-button"]; simulates hover if needed; falls back to Search if none found)
// Alt+Shift+s   → Click Search mode (SVG d^="M11 2.125a8.378 8.378")
// Alt+r         → Click Research mode (SVG d^="M8.175 13.976a.876.876")
// Alt+w         → Focus chat input (#ask-input contenteditable)
// Alt+a         → Set Sources → Academic (First: Set Sources SVG d^="M3 12a9 9 0 1 0", then submenu data-testid="source-toggle-scholar")
// Alt+s         → Set Sources → Social (submenu data-testid="source-toggle-social")
// Alt+g         → Set Sources → GitHub (submenu by testid if present or text "GitHub")
// Alt+n         → Start new conversation


// #1
// Css tweaks (hide download comet)
(function() {
    var target = document.querySelector('div.h-bannerHeight.rounded-sm');
    if (target) target.style.display = 'none';
})();


// #2
// on page reload, automatically run the “Research + Social” sequence (same as your alt+g logic) on page load, waiting 1500 ms.
(function () {
    function clickSegmentedControlBySVGPath(pathPrefix) {
        const segButtons = Array.from(document.querySelectorAll('button[role="radio"]'));
        for (const btn of segButtons) {
            const svg = btn.querySelector('svg');
            if (svg) {
                const path = svg.querySelector('path');
                if (path && path.getAttribute('d') && path.getAttribute('d').startsWith(pathPrefix)) {
                    if (btn.getAttribute('aria-checked') !== "true") {
                        btn.click();
                        return true;
                    }
                }
            }
        }
        return false;
    }
    function openSourcesMenuAndClickSubmenuByTestId(testid) {
        const sourcesBtn = document.querySelector('button[data-testid="sources-switcher-button"]');
        if (!sourcesBtn) return false;
        sourcesBtn.click();
        setTimeout(() => {
            const menu = document.querySelector('div[role="menu"], ul[role="menu"]');
            if (menu) {
                const item = menu.querySelector(`[data-testid="${testid}"]`);
                if (item) item.click();
            }
        }, 250);
        return true;
    }
    function sendEscapeKey() {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
        }));
    }
    function doAltGSequence() {
        clickSegmentedControlBySVGPath('M8.175 13.976a.876.876');
        setTimeout(() => {
            openSourcesMenuAndClickSubmenuByTestId('source-toggle-social');
            setTimeout(() => {
                sendEscapeKey();
            }, 350);
        }, 250);
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(doAltGSequence, 1500);
    } else {
        window.addEventListener('DOMContentLoaded', function () {
            setTimeout(doAltGSequence, 1500);
        });
    }
})();

// #3
// Alt+t         → Scroll to top of main thread
// Alt+z         → Scroll to bottom of main thread
// Alt+j         → Scroll up one message block
// Alt+k         → Scroll down one message block
// Alt+e         → Edit lowest user message (clicks [data-testid="edit-query-button"]; simulates hover if needed; falls back to Search if none found)
// Alt+Shift+s   → Click Search mode (SVG d^="M11 2.125a8.378 8.378")
// Alt+r         → Click Research mode (SVG d^="M8.175 13.976a.876.876")
// Alt+w         → Focus chat input (#ask-input contenteditable)
// Alt+p         → Set Sources → Academic (submenu data-testid="source-toggle-scholar")
// Alt+s         → Set Sources → Social (submenu data-testid="source-toggle-social")
// Alt+g         → Set Sources → GitHub (submenu by testid if present or text "GitHub")

(function () {
    'use strict';

    /* Ensure ScrollTo works, but never block if GSAP isn't ready */
    function ensureScrollToReady() {
        const start = Date.now();
        (function waitAndRegister() {
            const gs = window.gsap;
            const plug = window.ScrollToPlugin;
            if (gs && plug) {
                try {
                    if (!(gs.plugins && gs.plugins.ScrollToPlugin)) {
                        gs.registerPlugin(plug);
                    }
                    return; // success
                } catch (e) {
                    // keep polling until timeout
                }
            }
            if (Date.now() - start < 4000) setTimeout(waitAndRegister, 100);
        })();
    }
    // Kick off registration (safe even if @require already loaded)
    ensureScrollToReady();



    const __SCROLL_CACHE = { el: null };

function getScrollableContainer(forceRecalc = false) {
    const isScrollable = (el) => {
        if (!el) return false;
        const st = getComputedStyle(el);
        const oy = st.overflowY || st.overflow || '';
        return /(auto|scroll)/.test(oy) && (el.scrollHeight - el.clientHeight > 2);
    };
    const nearestScrollable = (el) => {
        let cur = el;
        while (cur && cur !== document.body && cur !== document.documentElement) {
            if (isScrollable(cur)) return cur;
            cur = cur.parentElement;
        }
        return null;
    };

    // Use cached container if still valid
    if (!forceRecalc && __SCROLL_CACHE.el && document.contains(__SCROLL_CACHE.el) && isScrollable(__SCROLL_CACHE.el)) {
        return __SCROLL_CACHE.el;
    }

    // Prefer anchors that are guaranteed to be inside the chat thread
    const anchorSelectors = [
        'div[id^="Markdown-Content-"]',                          // assistant message root
        '.mb-xs.group.relative.flex.items-end',                  // user prompt group
        '.group.relative.flex.items-end.mb-xs',
        'button[data-testid="edit-query-button"]'                // climb from edit btn if present
    ];
    let best = null;
    document.querySelectorAll(anchorSelectors.join(',')).forEach(a => {
        const sc = a.tagName === 'BUTTON' ? nearestScrollable(a.closest('.group') || a) : nearestScrollable(a);
        if (sc && (!best || sc.clientHeight > best.clientHeight)) best = sc;
    });

    // Known selector(s) as a fallback
    if (!best) {
        const known = document.querySelector(
            '.scrollable-container.scrollbar-subtle.flex.flex-1.basis-0.overflow-auto, .scrollbar-subtle.flex.flex-1.basis-0.overflow-auto'
        );
        if (isScrollable(known)) best = known;
    }

    // Generic fallback: biggest visible scrollable region
    if (!best) {
        const candidates = Array.from(document.querySelectorAll('div,main,section')).filter(n => {
            try {
                const st = getComputedStyle(n);
                const oy = st.overflowY || st.overflow || '';
                return /(auto|scroll)/.test(oy) &&
                       n.clientHeight >= window.innerHeight * 0.5 &&
                       (n.scrollHeight - n.clientHeight > 2);
            } catch { return false; }
        }).sort((a, b) => b.clientHeight - a.clientHeight);
        if (candidates[0]) best = candidates[0];
    }

    if (!best) best = document.scrollingElement || document.documentElement;
    __SCROLL_CACHE.el = best;
    return best;
}

    function scrollToTop() {
    const c = getScrollableContainer();
    if (!c) return;
    scrollToPosition(c, 0);
}

function scrollToBottom() {
    const c = getScrollableContainer();
    if (!c) return;

    const isRoot = c === document.documentElement || c === document.body || c === document.scrollingElement;
    const target = (window.gsap && window.ScrollToPlugin && isRoot) ? window : c;

    if (window.gsap && window.ScrollToPlugin) {
        try {
            if (!(gsap.plugins && gsap.plugins.ScrollToPlugin)) gsap.registerPlugin(ScrollToPlugin);
            gsap.to(target, { duration: 0.55, scrollTo: { y: "max" }, ease: "power4.out", overwrite: "auto" });
            return;
        } catch (_) {}
    }
    try { (isRoot ? window : c).scrollTo({ top: c.scrollHeight, behavior: 'smooth' }); }
    catch (_) { c.scrollTop = c.scrollHeight; }
}

    function scrollToPosition(container, top) {
    if (!container) return;
    const isRoot = container === document.documentElement || container === document.body || container === document.scrollingElement;
    const target = (window.gsap && window.ScrollToPlugin && isRoot) ? window : container;

    let usedGSAP = false;
    if (window.gsap && window.ScrollToPlugin) {
        try {
            if (!(gsap.plugins && gsap.plugins.ScrollToPlugin)) gsap.registerPlugin(ScrollToPlugin);
            gsap.to(target, { duration: 0.55, scrollTo: { y: top }, ease: "power4.out", overwrite: "auto" });
            usedGSAP = true;
        } catch (_) {}
    }
    if (!usedGSAP) {
        try {
            if (isRoot && 'scrollTo' in window) window.scrollTo({ top, behavior: 'smooth' });
            else container.scrollTo({ top, behavior: 'smooth' });
        } catch (_) {
            if (isRoot) (document.scrollingElement || document.documentElement).scrollTop = top;
            else container.scrollTop = top;
        }
    }
}



    /* Build a unified, ordered list of “message anchors”:
   - user prompt top: .group.relative.flex.items-end.mb-xs
   - assistant answer top: #Markdown-Content-*
*/
    function getMessageAnchors() {
        const set = new Set();

        // User header/group container (contains Edit/Copy button group)
        document.querySelectorAll(
            '.group.relative.flex.items-end.mb-xs, .mb-xs.group.relative.flex.items-end'
        ).forEach(el => set.add(el));

        // If present, also climb from Edit button → group (covers future class changes)
        document.querySelectorAll('button[data-testid="edit-query-button"]').forEach(btn => {
            const grp = btn.closest('.group') || btn.closest('.mb-xs');
            if (grp) set.add(grp);
        });

        // Assistant content root(s)
        document.querySelectorAll('div[id^="Markdown-Content-"]').forEach(el => set.add(el));

        // Fallbacks if DOM shifts
        if (set.size === 0) {
            document.querySelectorAll(
                'div[role="textbox"][data-lexical-editor="true"], [data-testid="message"], [data-anchor^="message-"]'
            ).forEach(el => set.add(el));
        }
        return Array.from(set);
    }

    function getTopRelativeToContainer(el, sc) {
        const scRect = sc.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        return sc.scrollTop + (rect.top - scRect.top);
    }

    function getSortedAnchorTops(sc) {
        const anchors = getMessageAnchors();
        const tops = anchors
        .map(el => ({ el, top: Math.round(getTopRelativeToContainer(el, sc)) }))
        .filter(d => Number.isFinite(d.top))
        .sort((a, b) => a.top - b.top);

        // De-dup nearly-equal tops (e.g., if two anchors share the same top)
        const dedup = [];
        for (const d of tops) {
            if (!dedup.length || Math.abs(d.top - dedup[dedup.length - 1].top) > 2) dedup.push(d);
        }
        return dedup;
    }

    // Scroll helpers using the anchors.
    // Alt+J: go to the start of the current message; if already near it, go to the previous.
    // Alt+K: go to the next message anchor.
    function scrollUpOneMessage() {
        const sc = getScrollableContainer();
        if (!sc) return;

        const anchors = getSortedAnchorTops(sc);
        if (!anchors.length) return;

        const y = sc.scrollTop;
        const tol = 8;      // treat within 8px as “at” an anchor
        const snap = 24;    // if we’re more than 24px past the anchor, snap back to it

        // Last anchor at/above current position
        let idx = -1;
        for (let i = 0; i < anchors.length; i++) {
            if (anchors[i].top <= y + tol) idx = i; else break;
        }

        let target;
        if (idx === -1) {
            // We are above the first anchor: go to the very first anchor
            target = anchors[0].top;
        } else if (y > anchors[idx].top + snap) {
            // We’re inside the current message: go to its start
            target = anchors[idx].top;
        } else {
            // We’re already at (or very near) the current start: go to previous
            target = idx > 0 ? anchors[idx - 1].top : 0;
        }
        scrollToPosition(sc, Math.max(0, target - 50));

    }

    function scrollDownOneMessage() {
        const sc = getScrollableContainer();
        if (!sc) return;

        const anchors = getSortedAnchorTops(sc);
        if (!anchors.length) return;

        const y = sc.scrollTop;
        const tol = 8;

        // First anchor strictly below current position
        let target = null;
        for (let i = 0; i < anchors.length; i++) {
            if (anchors[i].top > y + tol) { target = anchors[i].top; break; }
        }
        scrollToPosition(sc, target != null ? target : sc.scrollHeight);
    }
    // Edit lowest user message
    function isVisible(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return !!(rect.width && rect.height && rect.bottom > 0 && rect.right > 0 &&
                  rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
                  rect.left < (window.innerWidth || document.documentElement.clientWidth));
    }
    function simulateHover(el) {
        if (!el) return;
        el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        el.dispatchEvent(new PointerEvent('mouseover', { bubbles: true }));
    }
    function editLowestMessage() {
        const btns = Array.from(document.querySelectorAll('button[data-testid="edit-query-button"]'));
        if (!btns.length) return false;
        let target = null;
        let maxBottom = -Infinity;
        for (const btn of btns) {
            const rect = btn.getBoundingClientRect();
            if (isVisible(btn) && rect.bottom > maxBottom) {
                target = btn;
                maxBottom = rect.bottom;
            }
        }
        if (!target) target = btns[btns.length - 1];
        if (!target) return false;
        const group = target.closest('.mb-xs.group.relative.flex.items-end');
        if (group) simulateHover(group);
        setTimeout(() => { target.click(); }, 120);
        return true;
    }

    // Focus chat input
    function focusChatInput() {
        const el = document.querySelector('#ask-input[contenteditable="true"]');
        if (!el) return false;
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
    }

    // Search/Research mode by SVG path (segment control)
    function clickSegmentedControlBySVGPath(pathPrefix) {
        const segButtons = Array.from(document.querySelectorAll('button[role="radio"]'));
        for (const btn of segButtons) {
            const svg = btn.querySelector('svg');
            if (svg) {
                const path = svg.querySelector('path');
                if (path && path.getAttribute('d') && path.getAttribute('d').startsWith(pathPrefix)) {
                    if (btn.getAttribute('aria-checked') !== "true") {
                        btn.click();
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Sources menu helpers
    // Sources menu helpers with Escape key auto-close
    function sendEscapeKey() {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
        }));
    }

    // testidOrText: either the data-testid or text to match
    // byTestId: if true, use data-testid; else, use text match
    function openSourcesMenuAndClickAndClose(testidOrText, byTestId) {
        const sourcesBtn = document.querySelector('button[data-testid="sources-switcher-button"]');
        if (!sourcesBtn) return false;
        sourcesBtn.click();
        setTimeout(() => {
            const menu = document.querySelector('div[role="menu"], ul[role="menu"]');
            let clicked = false;
            if (menu) {
                if (byTestId) {
                    const item = menu.querySelector(`[data-testid="${testidOrText}"]`);
                    if (item) {
                        item.click();
                        clicked = true;
                    }
                }
                // Fallback to text if not found or not using testid
                if (!clicked && !byTestId) {
                    const items = Array.from(menu.querySelectorAll('[role="menuitem"],button,[data-testid]'));
                    const target = items.find(n => (n.innerText || n.textContent || '').toLowerCase().includes(testidOrText.toLowerCase()));
                    if (target) {
                        target.click();
                        clicked = true;
                    }
                }
            }
            setTimeout(sendEscapeKey, 250);
        }, 250);
        return true;
    }



    /* Keyboard handler with stronger suppression so site scripts don't swallow keys */
    document.addEventListener('keydown', function (e) {
        if (!e.altKey || e.repeat) return;
        const key = e.key.toLowerCase();

        // Modes / menus
        if (e.shiftKey && key === 's') {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            clickSegmentedControlBySVGPath('M11 2.125a8.378');
            return;
        }
        if (!e.shiftKey && key === 'a') {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            openSourcesMenuAndClickAndClose('source-toggle-scholar', true);
            return;
        }
        if (!e.shiftKey && key === 's') {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            openSourcesMenuAndClickAndClose('source-toggle-social', true);
            return;
        }
        if (!e.shiftKey && key === 'g') {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            openSourcesMenuAndClickAndClose('source-toggle-github', true);
            setTimeout(() => openSourcesMenuAndClickAndClose('github', false), 600);
            return;
        }
        if (!e.shiftKey && key === 'r') {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            clickSegmentedControlBySVGPath('M8.175 13.976a.876.876');
            return;
        }
        if (!e.shiftKey && key === 'e') {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            if (!editLowestMessage()) {
                clickSegmentedControlBySVGPath('M11 2.125a8.378');
            }
            return;
        }

        // Scrolling and focus
        switch (key) {
            case 't':
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                scrollToTop(); break;
            case 'z':
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                scrollToBottom(); break;
            case 'j':
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                scrollUpOneMessage(); break;
            case 'k':
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                scrollDownOneMessage(); break;
            case 'w':
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                focusChatInput(); break;
        }
    }, true);

})();

// #4
// alt+n starts new conversation

(function() {
    document.addEventListener('keydown', function(e) {
        if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.repeat && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'i',
                code: 'KeyI',
                keyCode: 73,
                which: 73,
                ctrlKey: true,
                bubbles: true,
            }));
        }
    }, true);
})();

