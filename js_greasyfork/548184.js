// ==UserScript==
// @name         WhiskZey mug + UI Controls (Inline Title Version)
// @namespace    zero.whiskzey.torn
// @version      0.8
// @description  Reposition attack buttons + inline UI for weapon/outcome/temp toggle (next to Attacking) 🛡️ whiskey_jack edition + single-click lock + centered overlay
// @author       -zero, seintz, whiskey_jack
// @license      GNU GPLv3
// @run-at       document-start
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548184/WhiskZey%20mug%20%2B%20UI%20Controls%20%28Inline%20Title%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548184/WhiskZey%20mug%20%2B%20UI%20Controls%20%28Inline%20Title%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

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

    const objForStorage = {};
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(() => {
        if (document.querySelectorAll(buttonSelector).length > 0) {
            moveButton();
            armSingleClickGuards();
            repositionAllMovedButtons(); // ensure centering after DOM churn
        }
    });

    const checkForElement = () => {
        if (document.querySelectorAll(playerArea).length > 0) {
            clearInterval(cd);
            const wrapper = document.querySelector(playerArea);
            observer.observe(wrapper, config);
        }
    };

    let cd = setInterval(checkForElement, 200);

    function waitForKeyElements(element, callbackFunc) {
        objForStorage[element] = setInterval(function () {
            let node = document.querySelector(element);
            if (node) {
                clearInterval(objForStorage[element]);
                callbackFunc(node);
            }
        }, 200);
    }

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
                calculateStyle(slotName(), useTemp); // sets size; positioning handled by reposition*
            } else if (storage.selectedIndex === index) {
                option.classList.add("btn-move");
                calculateStyle(slotName(), useTemp);
                if (!storage.index) {
                    observer.disconnect();
                    storage.index = 69;
                }
            }
        }
    }

    function slotName() {
        return ['primary', 'secondary', 'melee'][slot - 1];
    }

    // -------- Centering logic ----------
    function getTargetWeaponEl() {
        if (useTemp) return document.querySelector('#weapon_temp');
        const idMap = {
            primary: '#weapon_main',
            secondary: '#weapon_second',
            melee: '#weapon_melee'
        };
        return document.querySelector(idMap[slotName()]);
    }

    // Centers one .btn-move over the chosen weapon card
    function repositionButtonOverWeapon(btn) {
        if (!btn) return;

        const weaponEl = getTargetWeaponEl();
        if (!weaponEl) {
            // fallback to legacy offsets if card not found
            return;
        }

        const rect = weaponEl.getBoundingClientRect();

        // Match our button's intended size
        const BTN_W = 120;
        const BTN_H = 60;

        // center coordinates in viewport
        const left = Math.round(rect.left + (rect.width / 2) - (BTN_W / 2));
        const top  = Math.round(rect.top + (rect.height / 2) - (BTN_H / 2));

        // Strong inline styles override previous absolute CSS
        btn.style.position = 'fixed';
        btn.style.left = left + 'px';
        btn.style.top = top + 'px';
        btn.style.width = BTN_W + 'px';
        btn.style.height = BTN_H + 'px';
        btn.style.zIndex = '9999';
        btn.style.pointerEvents = btn.classList.contains('wj-click-locked') ? 'none' : 'auto';
        btn.classList.add('wj-centered'); // marker class
    }

    function repositionAllMovedButtons() {
        const root = document.querySelector(buttonSelector);
        if (!root) return;
        const moved = root.querySelectorAll('button.btn-move');
        moved.forEach(repositionButtonOverWeapon);
    }
    // -----------------------------------

    function restyleCSS(topMobile, topTablet, topDesktop) {
        // we still define size/appearance here; left/top will be overridden inline by centering
        GM_addStyle(`
            div[class^="dialogButtons"] > button[class$="btn-move"] {
                position: fixed; /* overridden inline each time */
                height: 60px;
                width: 120px;
                z-index: 9999;
            }
            .playerWindow___aDeDI { overflow: visible !important; }
            .modelWrap___j3kfA { visibility: hidden; }

            /* Single-click lock visuals */
            .wj-click-locked {
                pointer-events: none !important;
                opacity: 0.6 !important;
                filter: grayscale(0.4);
            }
        `);
    }

    function calculateStyle(defaultWeapon, useTemp = false) {
        // We still call this to ensure size/CSS exists; center is computed by reposition*
        // (kept for compatibility; top/left no longer used)
        restyleCSS('0px','0px','0px');
    }

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

        // Add listener to the parent since the entire innerHTML is replaced
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

    // >>> Single-click lock (prevents repeat mashing lag/dupes)
    const CLICK_LOCK_MS = 4000; // adjust as you like
    function guardButton(btn) {
        if (!btn || btn.dataset.wjGuard === '1') return;
        btn.dataset.wjGuard = '1';

        btn.addEventListener('click', (ev) => {
            if (btn.dataset.wjClicked === '1') {
                ev.preventDefault();
                ev.stopImmediatePropagation();
                return false;
            }
            btn.dataset.wjClicked = '1';

            queueMicrotask(() => {
                try {
                    btn.classList.add('wj-click-locked');
                    btn.setAttribute('aria-disabled', 'true');
                    btn.setAttribute('disabled', 'disabled');
                    // after locking, keep it centered (disabled state can change width in some themes)
                    repositionButtonOverWeapon(btn);
                } catch (_) {}
            });

            setTimeout(() => {
                if (!document.contains(btn)) return;
                btn.classList.remove('wj-click-locked');
                btn.removeAttribute('aria-disabled');
                btn.removeAttribute('disabled');
                btn.dataset.wjClicked = '0';
                repositionButtonOverWeapon(btn);
            }, CLICK_LOCK_MS);
        }, true);

        btn.addEventListener('keydown', (ev) => {
            if ((ev.key === 'Enter' || ev.key === ' ') && btn.dataset.wjClicked === '1') {
                ev.preventDefault();
                ev.stopImmediatePropagation();
            }
        }, true);
    }

    function armSingleClickGuards() {
        const root = document.querySelector(buttonSelector);
        if (!root) return;
        root.querySelectorAll('button').forEach(guardButton);
    }
    // <<< Single-click lock

    // Initial hooks
    waitForKeyElements(buttonSelector, () => { moveButton(); armSingleClickGuards(); repositionAllMovedButtons(); });
    waitForKeyElements(titleContainerSelector, injectControlPanel);

    // Keep it centered on layout changes
    window.addEventListener("resize", repositionAllMovedButtons, { passive: true });
    window.addEventListener("scroll", repositionAllMovedButtons, { passive: true });
})();
