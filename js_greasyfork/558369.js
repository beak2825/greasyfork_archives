// ==UserScript==
// @name         WhiskZey mug + UI Controls (Freeze fix)
// @namespace    zero.whiskzey.torn
// @version      0.8.4
// @description  Reposition attack buttons + inline UI (slot/outcome/temp) + single-click lock + centered overlay + lifecycle pause + rAF + debounced scroll-end + breakpoint reinit + DPI/resize stabilization
// @author       -zero, seintz, whiskey_jack
// @license      GNU GPLv3
// @run-at       document-start
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558369/WhiskZey%20mug%20%2B%20UI%20Controls%20%28Freeze%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558369/WhiskZey%20mug%20%2B%20UI%20Controls%20%28Freeze%20fix%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ----------------- selectors & storage keys -----------------
    const buttonSelector = 'div[class^="dialogButtons"]';
    const playerArea = 'div[class^="playerArea"]';
    const titleContainerSelector = '.titleContainer___QrlWP';

    const slotKey = 'torn-attack-slot';
    const typeKey = 'torn-attack-type';
    const tempKey = 'torn-attack-useTemp';

    let slot = Number(localStorage.getItem(slotKey) || 3);        // 1=primary, 2=secondary, 3=melee
    let attackType = Number(localStorage.getItem(typeKey) || 2);  // 1=leave, 2=mug, 3=hosp
    let useTemp = localStorage.getItem(tempKey) === 'true';

    const storage = {
        selectedOutcome: ['leave', 'mug', 'hosp'][attackType - 1],
        button: 0,
        selectedIndex: attackType - 1
    };

    // ----------------- lifecycle pause / resume -----------------
    let isPaused = false;
    let rowsObserver = null;
    let checkPlayerAreaTimer = null;
    const objForStorage = {}; // waitForKeyElements timers
    const config = { attributes: true, childList: true, subtree: true };

    function pauseLifecycle() {
        if (isPaused) return;
        isPaused = true;
        if (rowsObserver) rowsObserver.disconnect();
        detachWeaponResizeObserver();
    }
    function resumeLifecycle() {
        if (!isPaused) return;
        isPaused = false;
        const wrapper = document.querySelector(playerArea);
        if (wrapper) {
            if (rowsObserver) rowsObserver.disconnect();
            rowsObserver = new MutationObserver(observerCallback);
            rowsObserver.observe(wrapper, config);
        }
        reinitForLayoutChange('resumeLifecycle');
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pauseLifecycle(); else resumeLifecycle();
    });
    window.addEventListener('freeze',   pauseLifecycle);
    window.addEventListener('pagehide', pauseLifecycle);
    window.addEventListener('pageshow', resumeLifecycle);

    // ----------------- observer + element detection -----------------
    function observerCallback() {
        if (isPaused) return;
        if (document.querySelectorAll(buttonSelector).length > 0) {
            moveButton();
            armSingleClickGuards();
            scheduleReposition();
        }
    }
    const observer = new MutationObserver(observerCallback);

    const checkForElement = () => {
        if (document.querySelectorAll(playerArea).length > 0) {
            clearInterval(checkPlayerAreaTimer);
            const wrapper = document.querySelector(playerArea);
            if (rowsObserver) rowsObserver.disconnect();
            rowsObserver = new MutationObserver(observerCallback);
            rowsObserver.observe(wrapper, config);
        }
    };
    checkPlayerAreaTimer = setInterval(checkForElement, 200);

    // ----------------- waitForKeyElements (kept) -----------------
    function waitForKeyElements(element, callbackFunc) {
        if (objForStorage[element]) return; // avoid duplicate timers
        objForStorage[element] = setInterval(function () {
            const node = document.querySelector(element);
            if (node) {
                clearInterval(objForStorage[element]);
                delete objForStorage[element];
                callbackFunc(node);
            }
        }, 200);
    }

    // ----------------- core: move/mark buttons -----------------
    function moveButton() {
        const optionsDialogBox = document.querySelector(buttonSelector);
        if (!optionsDialogBox) return;
        const optionsBox = optionsDialogBox.children;

        for (const option of optionsBox) {
            if (option.classList.contains("btn-move")) continue;
            const text = option.innerText.toLowerCase();
            const index = [...option.parentNode.children].indexOf(option);

            if (text.includes("fight")) {
                option.classList.add("btn-move");
                calculateStyle(slotName(), useTemp);
            } else if (storage.selectedIndex === index) {
                option.classList.add("btn-move");
                calculateStyle(slotName(), useTemp);
                if (!storage.index) {
                    observer.disconnect(); // original behavior retained
                    storage.index = 69;
                }
            }
        }
    }

    function slotName() {
        return ['primary', 'secondary', 'melee'][slot - 1];
    }

    // ----------------- centering logic -----------------
    function getTargetWeaponEl() {
        if (useTemp) return document.querySelector('#weapon_temp');
        const idMap = {
            primary: '#weapon_main',
            secondary: '#weapon_second',
            melee: '#weapon_melee'
        };
        return document.querySelector(idMap[slotName()]);
    }

    function repositionButtonOverWeapon(btn) {
        if (!btn) return;
        const weaponEl = getTargetWeaponEl();
        if (!weaponEl) return;

        const rect = weaponEl.getBoundingClientRect();
        const BTN_W = 120;
        const BTN_H = 60;

        const left = Math.round(rect.left + (rect.width / 2) - (BTN_W / 2));
        const top  = Math.round(rect.top  + (rect.height / 2) - (BTN_H / 2));

        btn.style.position = 'fixed';
        btn.style.left = left + 'px';
        btn.style.top = top + 'px';
        btn.style.width = BTN_W + 'px';
        btn.style.height = BTN_H + 'px';
        btn.style.zIndex = '9999';
        btn.style.pointerEvents = btn.classList.contains('wj-click-locked') ? 'none' : 'auto';
        btn.classList.add('wj-centered');
    }

    // rAF coalescing
    let repositionScheduled = false;
    function scheduleReposition() {
        if (isPaused) return;
        if (repositionScheduled) return;
        repositionScheduled = true;
        requestAnimationFrame(() => {
            repositionScheduled = false;
            const root = document.querySelector(buttonSelector);
            if (!root) return;
            const moved = root.querySelectorAll('button.btn-move');
            moved.forEach(repositionButtonOverWeapon);
        });
    }

    // ----------------- styles -----------------
    function restyleCSS() {
        GM_addStyle(`
            div[class^="dialogButtons"] > button[class$="btn-move"] {
                position: fixed; /* we compute left/top inline */
                height: 60px;
                width: 120px;
                z-index: 9999;
            }
            .playerWindow___aDeDI { overflow: visible !important; }
            .modelWrap___j3kfA { visibility: hidden; }

            .wj-click-locked {
                pointer-events: none !important;
                opacity: 0.6 !important;
                filter: grayscale(0.4);
            }
        `);
    }
    function calculateStyle() { restyleCSS(); }

    // ----------------- inline control panel -----------------
    function injectControlPanel() {
        const title = document.querySelector("h4.title___rhtB4");
        if (!title) return;

        const style = `
            font-size: 12px;
            padding: 3px 6px;
            border: 1px solid #444;
            border-radius: 6px;
            background: #222;
            color: #ccc;
            white-space: nowrap;
            display: inline-block;
            box-shadow: 0 0 6px rgba(0,0,0,0.6);
        `;

        title.innerHTML = `
            <span style="${style}">
                <span style="color:#bbb;font-weight:bold;">Attacking:</span>
                <span style="margin-left: 6px; color:#bbb;">Slot:</span>
                <label style="margin:0 6px;"><input type="radio" name="slot" value="1" ${slot === 1 ? "checked" : ""} title="Primary"> P</label>
                <label style="margin-right:6px;"><input type="radio" name="slot" value="2" ${slot === 2 ? "checked" : ""} title="Secondary"> S</label>
                <label style="margin-right:12px;"><input type="radio" name="slot" value="3" ${slot === 3 ? "checked" : ""} title="Melee"> M</label>

                <span style="color:#bbb;">Outcome:</span>
                <label style="margin:0 6px;"><input type="radio" name="type" value="1" ${attackType === 1 ? "checked" : ""} title="Leave"> L</label>
                <label style="margin-right:6px;"><input type="radio" name="type" value="2" ${attackType === 2 ? "checked" : ""} title="Mug"> M</label>
                <label style="margin-right:12px;"><input type="radio" name="type" value="3" ${attackType === 3 ? "checked" : ""} title="Hospitalize"> H</label>

                <label><input type="checkbox" id="usetemp" ${useTemp ? "checked" : ""} title="Use Temporary Weapon"> Temp</label>
            </span>
        `;

        title.addEventListener("change", (e) => {
            const t = e.target;
            if (t.name === "slot") {
                localStorage.setItem(slotKey, t.value);
                location.reload();
            }
            if (t.name === "type") {
                localStorage.setItem(typeKey, t.value);
                location.reload();
            }
            if (t.id === "usetemp") {
                localStorage.setItem(tempKey, t.checked ? "true" : "false");
                location.reload();
            }
        });
    }

    // ----------------- single-click lock -----------------
    const CLICK_LOCK_MS = 4000;
    function guardButton(btn) {
        if (!btn || btn.dataset.wjGuard === '1') return;
        btn.dataset.wjGuard = '1';

        btn.addEventListener('click', (ev) => {
            if (btn.dataset.wjClicked === '1') {
                ev.preventDefault(); ev.stopImmediatePropagation(); return false;
            }
            btn.dataset.wjClicked = '1';

            queueMicrotask(() => {
                try {
                    btn.classList.add('wj-click-locked');
                    btn.setAttribute('aria-disabled', 'true');
                    btn.setAttribute('disabled', 'disabled');
                    scheduleReposition(); // disabled state may shift size
                } catch (_) {}
            });

            setTimeout(() => {
                if (!document.contains(btn)) return;
                btn.classList.remove('wj-click-locked');
                btn.removeAttribute('aria-disabled');
                btn.removeAttribute('disabled');
                btn.dataset.wjClicked = '0';
                scheduleReposition();
            }, CLICK_LOCK_MS);
        }, true);

        btn.addEventListener('keydown', (ev) => {
            if ((ev.key === 'Enter' || ev.key === ' ') && btn.dataset.wjClicked === '1') {
                ev.preventDefault(); ev.stopImmediatePropagation();
            }
        }, true);
    }

    function armSingleClickGuards() {
        const root = document.querySelector(buttonSelector);
        if (!root) return;
        root.querySelectorAll('button').forEach(guardButton);
    }

    // ----------------- initial hooks -----------------
    waitForKeyElements(buttonSelector, () => { moveButton(); armSingleClickGuards(); scheduleReposition(); });
    waitForKeyElements(titleContainerSelector, injectControlPanel);

    // ----------------- debounced scroll-end reposition -----------------
    const SCROLL_END_DELAY_MS = 120;
    let scrollEndTimer = null;
    function onScroll() {
        if (isPaused) return;
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            scrollEndTimer = null;
            scheduleReposition();
        }, SCROLL_END_DELAY_MS);
    }
    window.addEventListener("scroll",  onScroll, { passive: true });

    // ----------------- resize / viewport watchers -----------------
    window.addEventListener("resize",  () => { if (!isPaused) reinitForLayoutChange('window-resize'); }, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => { if (!isPaused) reinitForLayoutChange('visualViewport-resize'); }, { passive: true });
    }

    // ----------------- breakpoint watcher (mobile/tablet/desktop) -----------------
    const mMobile  = matchMedia('(max-width: 767.98px)');
    const mTablet  = matchMedia('(min-width: 768px) and (max-width: 1023.98px)');
    const mDesktop = matchMedia('(min-width: 1024px)');
    let lastBP = bp();

    function bp() {
        if (mDesktop.matches) return 'desktop';
        if (mTablet.matches)  return 'tablet';
        return 'mobile';
    }

    function onBPChange() {
        const now = bp();
        if (now !== lastBP) {
            lastBP = now;
            reinitForLayoutChange('breakpoint-change');
        }
    }

    [mMobile, mTablet, mDesktop].forEach(mq => {
        if (mq && mq.addEventListener) mq.addEventListener('change', onBPChange);
        else if (mq && mq.addListener) mq.addListener(onBPChange); // older browsers
    });

    // ----------------- layout re-init + stabilization -----------------
    function reinitForLayoutChange(reason) {
        // Remap the button (in case DOM nodes got replaced), re-arm guards, then stabilize and center
        moveButton();
        armSingleClickGuards();
        scheduleReposition();
        stabilizeAfterLayout();
        attachWeaponResizeObserver();
    }

    const STABILIZE_CONSEC_FRAMES = 3;
    const STABILIZE_MAX_FRAMES    = 40;
    const STABILIZE_EPS           = 1;

    function stabilizeAfterLayout() {
        let consec = 0;
        let count = 0;
        let lastRect = null;

        function frame() {
            count++;
            const weaponEl = getTargetWeaponEl();
            if (!weaponEl) {
                if (count < STABILIZE_MAX_FRAMES) return requestAnimationFrame(frame);
                return;
            }
            const r = weaponEl.getBoundingClientRect();
            const area = Math.round(r.width) * Math.round(r.height);
            if (area === 0) {
                consec = 0;
                if (count < STABILIZE_MAX_FRAMES) return requestAnimationFrame(frame);
                return;
            }

            if (!lastRect) {
                lastRect = { x: r.x, y: r.y, w: r.width, h: r.height };
                consec = 1;
            } else {
                const dx = Math.abs(r.x - lastRect.x);
                const dy = Math.abs(r.y - lastRect.y);
                const dw = Math.abs(r.width - lastRect.w);
                const dh = Math.abs(r.height - lastRect.h);
                if (dx <= STABILIZE_EPS && dy <= STABILIZE_EPS && dw <= STABILIZE_EPS && dh <= STABILIZE_EPS) {
                    consec++;
                } else {
                    consec = 1;
                    lastRect = { x: r.x, y: r.y, w: r.width, h: r.height };
                }
            }

            if (consec >= STABILIZE_CONSEC_FRAMES) {
                scheduleReposition();
                return;
            }
            if (count < STABILIZE_MAX_FRAMES) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    // ----------------- weapon element ResizeObserver -----------------
    let weaponResizeObs = null;
    function attachWeaponResizeObserver() {
        const el = getTargetWeaponEl();
        if (!el) return; // attach later when available
        detachWeaponResizeObserver();
        // debounce rapid size changes (e.g., fonts load, images settle)
        let to = null;
        weaponResizeObs = new ResizeObserver(() => {
            if (isPaused) return;
            if (to) clearTimeout(to);
            to = setTimeout(() => {
                scheduleReposition();
            }, 60);
        });
        weaponResizeObs.observe(el);
    }
    function detachWeaponResizeObserver() {
        if (weaponResizeObs) {
            try { weaponResizeObs.disconnect(); } catch (_) {}
            weaponResizeObs = null;
        }
    }

})();
