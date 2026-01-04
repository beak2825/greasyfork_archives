// ==UserScript==
// @name         Meetup: Unblur + Anti-Popup + Wheel Fix (fast)
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Removes blur and kills popups/overlays
// @author       Your Name
// @match        *://*.meetup.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553020/Meetup%3A%20Unblur%20%2B%20Anti-Popup%20%2B%20Wheel%20Fix%20%28fast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553020/Meetup%3A%20Unblur%20%2B%20Anti-Popup%20%2B%20Wheel%20Fix%20%28fast%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true;
    const log = (...args) => DEBUG && console.debug('[MeetupFix]', ...args);

    /*** ------------------- Config ------------------- ***/
    const CONFIG = {
        MIN_VIEWPORT_COVERAGE: 0.85, // treat as overlay if covers >= 85% viewport
        MIN_ZINDEX: 1000,
        AVATAR_SIZE: 160, // px
        DEBOUNCE_MS: 120 // batch DOM work
    };

    // Small helper to inject a singleton style
    const onceStyle = (id, css) => {
        if (document.getElementById(id)) return;
        const s = document.createElement('style');
        s.id = id;
        s.textContent = css;
        document.head.appendChild(s);
    };

    /*** ------------------- Scroll Untrap ------------------- ***/
    const unfreezeScroll = () => {
        [document.documentElement, document.body].forEach(n => {
            if (!n) return;
            n.style.setProperty('overflow', 'auto', 'important');
            n.style.setProperty('position', 'static', 'important');
            n.style.setProperty('height', 'auto', 'important');
            n.style.setProperty('overscroll-behavior', 'auto', 'important');
            n.style.setProperty('touch-action', 'auto', 'important');
            n.classList?.remove('overflow-hidden', 'fixed');
        });
        onceStyle('unfreeze-style', `
      html, body { overflow:auto!important; position:static!important; height:auto!important;
                   overscroll-behavior:auto!important; touch-action:auto!important; }
      [data-scroll-lock], [class*="scroll-lock"], [class*="no-scroll"] {
        overflow:auto!important; touch-action:auto!important;
      }
    `);
    };

    // Cut in line before their handlers so they can’t preventDefault()
    const neutralizeScrollTraps = (() => {
        let armed = false;
        const passThrough = e => {
            e.stopImmediatePropagation();
        };
        return () => {
            if (armed) return;
            armed = true;
            window.addEventListener('wheel', passThrough, {
                capture: true,
                passive: false
            });
            window.addEventListener('mousewheel', passThrough, {
                capture: true,
                passive: false
            });
            window.addEventListener('DOMMouseScroll', passThrough, {
                capture: true,
                passive: false
            });
            window.addEventListener('touchmove', passThrough, {
                capture: true,
                passive: false
            });
        };
    })();

    /*** ------------------- Blur Killer ------------------- ***/
    // Mark processed nodes so we don’t keep re-cleaning them
    const cleaned = new WeakSet();

    const cleanNodeBlur = (el) => {
        if (!(el instanceof Element)) return;
        // Only touch nodes that smell like blur/filter to avoid work
        const cls = el.className?.toString() ?? '';
        const inlineStyle = el.getAttribute?.('style') ?? '';

        if (!cls.includes('blur') && !inlineStyle.includes('filter')) return;

        if (!cleaned.has(el)) {
            // Remove Tailwind blur tokens (supports md:blur-sm, hover:blur-[6px], blur, blur-sm, blur-[Npx])
            const toRemove = [];
            el.classList?.forEach(token => {
                if (/^(?:[a-z]+:)?blur(?:-\[.*\]|-[a-z]+)?$/i.test(token) || token === 'filter') {
                    toRemove.push(token);
                }
            });
            if (toRemove.length) toRemove.forEach(t => el.classList.remove(t));

            // Kill computed filters
            const cs = getComputedStyle(el);
            if (cs.filter && cs.filter !== 'none') {
                el.style.setProperty('filter', 'none', 'important');
            }
            if (cs.backdropFilter && cs.backdropFilter !== 'none') {
                el.style.setProperty('backdrop-filter', 'none', 'important');
            }
            cleaned.add(el);
        }
    };

    const removeBlur = (root = document) => {
        // Tight selectors; avoid querying entire DOM with '*' frequently
        root.querySelectorAll('[class*="blur"], [style*="filter"]').forEach(cleanNodeBlur);

        // Backstop CSS (one-time)
        onceStyle('unblur-style', `
      [class*="blur-["], [class*="blur-"], .blur {
        filter:none!important; -webkit-filter:none!important; backdrop-filter:none!important;
      }
    `);
    };


    /*** ------------------- Popup Assassin ------------------- ***/
    const overlaySelectors = [
        '[aria-modal="true"]',
        '[class*="modal"]',
        '[id*="modal"]',
        '[class*="overlay"]',
        '[class*="backdrop"]:not([class*="backdrop-blur"])',
        '.modal-backdrop',
        '.ReactModal__Overlay',
        '.ReactModal__Content'
    ].join(',');

    const isFullscreenFixed = (el) => {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed') return false;
        const r = el.getBoundingClientRect();
        const vw = window.innerWidth || document.documentElement.clientWidth;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const coverage = (r.width * r.height) / Math.max(1, vw * vh);
        const zi = parseInt(cs.zIndex || '0', 10);
        return coverage >= CONFIG.MIN_VIEWPORT_COVERAGE && zi >= CONFIG.MIN_ZINDEX;
    };

    const isMenuLike = (el) => {
        const role = el.getAttribute('role') || '';
        return role === 'menu' || role === 'listbox' || role === 'combobox' || role === 'tooltip';
    };

    const isRadixPopover = (el) => {
        // Radix Popover/DatePicker bits
        if (el.getAttribute('data-slot') === 'popover-content') return true;
        const id = el.id || '';
        if (id.startsWith('radix-') && (el.getAttribute('role') === 'dialog' || el.getAttribute('role') === 'menu')) return true;
        return false;
    };

    const shouldNuke = (el) => {
        if (isMenuLike(el)) return false;
        if (isRadixPopover(el)) return false; // calendar & friends live

        const role = el.getAttribute('role') || '';
        const ariaModal = el.getAttribute('aria-modal') === 'true';

        // Only auto-nuke dialogs if they are actually modal or have a backdrop
        if (ariaModal) return true;
        if (role === 'dialog') {
            // Modal-ish if it has a backdrop sibling/descendant or covers most of viewport
            const hasBackdrop = el.closest('.modal-backdrop, .ReactModal__Overlay, [data-backdrop="true"]') ||
                el.querySelector('.modal-backdrop, .ReactModal__Overlay, [data-backdrop="true"]');
            if (hasBackdrop) return true;
            if (isFullscreenFixed(el)) return true;
            return false; // small popovers stay
        }

        // Class-based overlays
        if (el.matches('[class*="overlay"], [class*="backdrop"]:not([class*="backdrop-blur"]), .ReactModal__Overlay, .ReactModal__Content')) return true;

        // Heuristic fallback for true full-screen slabs
        return isFullscreenFixed(el);
    };

    const nukeOverlay = (el) => {
        if (!shouldNuke(el)) {
            return false;
        }
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
        el.querySelectorAll('[class*="backdrop"], [class*="overlay"]').forEach(b => {
            b.style.setProperty('display', 'none', 'important');
            b.style.setProperty('pointer-events', 'none', 'important');
        });
        return true;
    };

    const removePopup = (root = document) => {
        let found = false;

        // 1) Pattern/semantic scan inside the root (cheap)
        root.querySelectorAll(overlaySelectors).forEach(el => {
            if (nukeOverlay(el)) found = true;
        });

        // 2) Heuristic global sweep (only on initial run; avoid per-mutation global scans)
        if (root === document) {
            document.querySelectorAll('body > div, body > section, body > aside').forEach(el => {
                if (isFullscreenFixed(el)) {
                    nukeOverlay(el);
                    found = true;
                }
            });
        }

        if (found) {
            unfreezeScroll();
            neutralizeScrollTraps();
            // Backstop CSS once
            onceStyle('unpopup-style', `
    [aria-modal="true"],
     [class*="modal"], [id*="modal"],
    [class*="overlay"],
    [class*="backdrop"]:not([class*="backdrop-blur"]),
    .modal-backdrop,
     .ReactModal__Overlay, .ReactModal__Content {
       display:none!important; pointer-events:none!important;
     }
    /* Preserve menus/popovers & Radix calendar */
    [role="menu"], [role="listbox"], [role="combobox"], [role="tooltip"],
    [data-slot="popover-content"] {
      display:block!important; opacity:1!important; visibility:visible!important; pointer-events:auto!important;
    }
      `);
        }
        return found;
    };

    /*** ------------------- Orchestration (Debounced) ------------------- ***/
    let timer = null;
    const schedule = (fn) => {
        if (timer) return;
        timer = setTimeout(() => {
            timer = null;
            fn();
        }, CONFIG.DEBOUNCE_MS);
    };

    const applyAll = (root = document) => {
        removePopup(root);
        removeBlur(root);
    };

    // Initial pass (global)
    neutralizeScrollTraps();
    unfreezeScroll();
    applyAll(document);

    // Observe only childList (no attributes) to avoid self-trigger storms
    const mo = new MutationObserver(muts => {
        let hasUsefulNodes = false;
        const batch = new Set();

        for (const m of muts) {
            if (m.type !== 'childList') continue;
            // Ignore style/script insertions (our own and theirs)
            m.addedNodes.forEach(n => {
                if (n.nodeType !== 1) return; // elements only
                const tag = n.nodeName;
                if (tag === 'STYLE' || tag === 'SCRIPT' || tag === 'LINK') return;
                batch.add(n);
                hasUsefulNodes = true;
            });
        }

        if (!hasUsefulNodes) return;
        schedule(() => {
            // Process each added subtree once
            batch.forEach(n => applyAll(n));
        });
    });

    mo.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    // Also re-run shortly after any user click (Meetup likes click-triggered modals)
    document.addEventListener('click', () => schedule(() => applyAll(document)), true);
})();