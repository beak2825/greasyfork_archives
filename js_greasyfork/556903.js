// ==UserScript==
// @name         FIS Button + Popup AutoClick
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds Button to configure ticket information and auto-clicks popup button if detected
// @author       KLElisa
// @match        https://fisweb.elisa.fi/arsys/forms/fis-prod-lb/TM_Service/BMC_TMVIEW/*
// @match        https://fisweb.elisa.fi/arsys/forms/fis-prod-lb/TM_Ticket/BMC_TMVIEW/*
// @match        fisweb.elisa.fi/arsys/forms/fis-prod-lb/TM_Weblink/Popup/*
// @match        https://fisp.csf.elisa.fi/arsys/forms/fis-prod-app/TM_Ticket/BMC_TMVIEW/*
// @match        https://fisp.csf.elisa.fi/arsys/forms/fis-prod-app/TM_Service/BMC_TMVIEW/*
// @match        fisp.csf.elisa.fi/arsys/forms/fis-prod-app/TM_Weblink/Popup/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556903/FIS%20Button%20%2B%20Popup%20AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/556903/FIS%20Button%20%2B%20Popup%20AutoClick.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = '[MagicBtn]';
    const POPUP_BASE = 'https://fisp.csf.elisa.fi/arsys/forms/fis-prod-app/TM_Weblink/Popup/';
    const POPUP_PARAM = 'cacheid';

    function log(...args) {
        console.log(LOG_PREFIX, ...args);
    }

    // === Styling helpers ===
    function applyRedToLabel(labelEl) {
        if (!labelEl) return;
        const s = labelEl.style;
        if (s.color === 'red' && s.fontWeight === 'bold') return;
        s.color = 'red';
        s.fontWeight = 'bold';
    }

    function applyGreenBox(el, color = 'green') {
        if (!el) return;

        const bg = (color === 'red')
        ? 'rgb(255, 225, 225)' // light red
        : 'rgb(212, 252, 212)'; // light green

        const s = el.style;

        // Avoid compounding styles
        const already =
              s.borderColor === color &&
              s.backgroundColor === bg &&
              s.fontWeight === 'bold';
        if (already) return;

        s.backgroundColor = bg;
        s.border = `2px solid ${color}`;
        s.fontWeight = 'bold';
    }

    // Always color Asiakasviite box green (no matching needed)
    function colorAsiakasviiteAlwaysGreen(doc) {
        const el = doc.querySelector('#arid_WIN_0_700006030');
        if (!el) return;
        applyGreenBox(el, 'green');
    }

    function clearGreenBox(el) {
        if (!el) return;
        const s = el.style;
        if (s.backgroundColor && s.backgroundColor.includes('rgb(212, 252, 212)')) {
            s.backgroundColor = '';
        }
        if (s.border && s.border.includes('solid')) {
            s.border = '';
        }
        if (s.fontWeight === 'bold') {
            s.fontWeight = '';
        }
    }

    // === 1) Always color labels red for the specified controls ===
    function colorLabelsRed(doc) {
        const controlIds = [
            "x-arid_WIN_0_536870919", // Tiketin tyyppi
            "arid_WIN_0_536870993", // Palvelu
            "arid_WIN_0_536870969", // Tila Tieto+
            "arid_WIN_0_700006030", // Asiakasviite
            "arid_WIN_0_536871117", // Automaattitiedotus (email/sms)
            "arid_WIN_0_536870944", // Työjono
            "arid_WIN_0_536871045", // Kuvaus
            "arid_WIN_0_700001099", // Reason code (A) / Siirtokoodi
            "arid_WIN_0_536871002", // Käsittelyn tyyppi
            "arid_WIN_0_536870941", // Sopimusaika
            "arid_WIN_0_536870986" // Vastuutyöjono
        ];

        for (const id of controlIds) {
            const label = doc.querySelector(`label[for="${id}"]`);
            if (label) applyRedToLabel(label);
        }
    }

    // === 2) Color field boxes green only when specific text matches (title or value) ===
    function setupMatchGreenStyling(doc) {
        const matchMap = {
            "EMSCHANGE": "red",
            "EETATYO": "red",
            "Muutosilmoitus": "green",
            "Service; Other service": "green",
            "Standard Change": "green",
            "support@santacare.net": "green",
            "A": "green",
            "Toimitusajan siirto": "green",
            "TTK_MUUTOKSET": "green"
        };
        const selector = 'input, textarea';

        function applyIfMatches(el) {
            const title = el.getAttribute('title') || '';
            const value = (typeof el.value === 'string') ? el.value : '';
            const color = matchMap[title] || matchMap[value];

            if (color) {
                applyGreenBox(el, color);
            } else {
                clearGreenBox(el);
            }
        }

        // Initial pass on already-present elements
        doc.querySelectorAll(selector).forEach(el => applyIfMatches(el));

        // Observe late changes to title/value
        if (!doc.__matchGreenObserverInstalled) {
            doc.__matchGreenObserverInstalled = true;
            const win = doc.defaultView || window;

            const obs = new win.MutationObserver(mutations => {
                for (const m of mutations) {
                    if (m.type !== 'attributes') continue;
                    const target = m.target;
                    if (!(target instanceof Element)) continue;
                    if (!target.matches(selector)) continue;
                    if (m.attributeName !== 'title' && m.attributeName !== 'value') continue;
                    applyIfMatches(target);
                }
            });

            obs.observe(doc, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ['title', 'value']
            });

            // Also react to user/app events updating value/title
            const handler = ev => {
                const el = ev.target;
                if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
                applyIfMatches(el);
            };
            doc.addEventListener('input', handler, true);
            doc.addEventListener('change', handler, true);
            doc.addEventListener('blur', handler, true);
        }
    }

    // Add Button next to Home
    function addMagicButton(doc) {
        if (!doc || doc.__magicBtnAdded) return false;

        const homeDiv = doc.querySelector('#TBhome') || doc.querySelector('td.TBGroup a.home div');
        if (!homeDiv) return false;

        if (doc.querySelector('#magicBtn')) {
            doc.__magicBtnAdded = true;
            return true;
        }

        log('Injecting Magic Button');

        const magicAnchor = doc.createElement('a');
        magicAnchor.className = 'magic btn btn3d tbbtn';
        magicAnchor.href = 'javascript:';
        magicAnchor.style.position = 'static';
        const magicDiv = doc.createElement('div');

        magicDiv.id = 'magicBtn';
        magicDiv.textContent = 'New ticket config';
        magicDiv.style.backgroundColor = '#4CAF50';
        magicDiv.style.transition = 'background-color 0.3s ease';
        magicDiv.addEventListener('mouseenter', () => {
            magicDiv.style.backgroundColor = '#45a049';
        });
        magicDiv.addEventListener('mouseleave', () => {
            magicDiv.style.backgroundColor = '#4CAF50';
        });
        magicDiv.style.padding = '6px 16px';
        magicDiv.style.fontWeight = 'bold';
        magicDiv.style.cursor = 'pointer';
        magicDiv.style.borderRadius = '9px';
        magicAnchor.appendChild(magicDiv);
        magicAnchor.style.background = 'transparent';
        magicAnchor.style.border = 'none';
        magicAnchor.style.padding = '0px';
        magicAnchor.style.borderRadius = '150px';

        const parentTd = homeDiv.closest('td.TBGroup') || homeDiv.parentElement || doc.body;
        parentTd.appendChild(magicAnchor);


        function getNextWorkdayDateTime() {
            const d = new Date();
            const dayOfWeek = d.getDay(); // Sunday=0, Monday=1, ..., Friday=5, Saturday=6

            if (dayOfWeek === 5) {
                // If today is Friday, add 3 days (to Monday)
                d.setDate(d.getDate() + 3);
            } else {
                // Otherwise, just add 1 day
                d.setDate(d.getDate() + 1);
            }

            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}.${month}.${year} 17:00:00`;
        }


        async function setDateField(doc, selector) {
            const input = doc.querySelector(selector);
            if (!input) {
                log(`Date field ${selector} not found`);
                return;
            }
            const value = getNextWorkdayDateTime();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await humanFocus(input);
            await sleep(rand(100, 200));
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            log(`Set Sovittu aika to "${value}"`);
        }

        magicAnchor.addEventListener('click', async (ev) => {
            const btnDoc = ev.currentTarget.ownerDocument;
            log('Magic Button clicked — starting full automation');

            try {
                // === STEP 1: Automaattitiedotus (email/sms) ===
                await setTextField(btnDoc, '#WIN_0_536871117 textarea#arid_WIN_0_536871117', 'support@santacare.net');

                // === STEP 2: Ticket Type ===
                await selectDropdown(btnDoc, '#WIN_0_536870919', 'Muutosilmoitus');

                // === STEP 3: Palvelu ===
                await setTextField(btnDoc, '#WIN_0_536870993 textarea#arid_WIN_0_536870993', 'Service; Other service');

                // === STEP 4: Tila Tieto+ ===
                await selectDropdown(btnDoc, '#WIN_0_536870969', 'Standard Change');

                // === STEP 5: Työjono ===
                //await setTextField(btnDoc, '#WIN_0_536870944 textarea#arid_WIN_0_536870944', 'TTK_MUUTOKSET');
                await typeTTKMAndEnter(btnDoc, '#WIN_0_536870944 textarea#arid_WIN_0_536870944'); //TTK_MUUTOKSET

                // === STEP 998: Kiireellisyys ===
                //await selectDropdown(btnDoc, '#WIN_0_536870933', 'Sov. aika');

                // === STEP 999: Sovittu aika ===
                //await setDateField(btnDoc, '#WIN_0_536871082 input#arid_WIN_0_536871082');

                // === STEP 7: Click Kuvaus expand button ===
                const kuvausBtn = btnDoc.querySelector('a.btn.btn3d.expand img[alt*="Kuvaus"]')?.closest('a');
                if (kuvausBtn) {
                    await humanClick(kuvausBtn);
                    log('Clicked Kuvaus expand button');

                    // Show popup reminder
                    //setTimeout(() => {
                    //    alert("Make sure you fill 'Asiakasviite' with customer SCTASK number from ServiceNow");
                    //}, 500); // slight delay for realism
                } else {
                    log('Kuvaus button not found');
                }

                log('All fields updated successfully!');
            } catch (e) {
                log('Error during automation:', e);
            }
        });

        /* ===== Helper for text fields ===== */
        async function setTextField(doc, selector, value) {
            const input = doc.querySelector(selector);
            if (!input) {
                log(`Text field ${selector} not found`);
                return;
            }
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await humanFocus(input);
            await sleep(rand(100, 200));
            input.value = value;
            input.title = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            log(`Set ${selector} to "${value}"`);
        }

        async function typeTTKMAndEnter(doc, selector) {
            const input = doc.querySelector(selector);
            if (!input) {
                log(`Field ${selector} not found`);
                return;
            }

            // Focus and scroll
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await humanFocus(input);
            await sleep(rand(100, 200));

            // Type TTK_M directly
            input.value = 'TTK_M';
            input.title = 'TTK_M';
            input.dispatchEvent(new Event('input', { bubbles: true }));

            // Simulate Enter
            const sendEnter = (type) => {
                const ev = new KeyboardEvent(type, {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13
                });
                Object.defineProperty(ev, 'keyCode', { get: () => 13 });
                Object.defineProperty(ev, 'which', { get: () => 13 });
                input.dispatchEvent(ev);
            };

            sendEnter('keydown');
            sendEnter('keypress');
            sendEnter('keyup');

            input.dispatchEvent(new Event('change', { bubbles: true }));

            log(`Typed "TTK_M" and pressed Enter in ${selector}`);
        }

        /* ===== Helper for dropdown selection ===== */
        async function selectDropdown(doc, containerSelector, targetValue) {
            const container = doc.querySelector(containerSelector);
            if (!container) {
                log(`Container ${containerSelector} not found`);
                return;
            }

            const dropdownBtn = container.querySelector('.selectionbtn, .menu');
            if (!dropdownBtn) {
                log(`Dropdown button not found in ${containerSelector}`);
                return;
            }

            dropdownBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(rand(100, 200));
            await humanClick(dropdownBtn);
            log(`Clicked dropdown for ${containerSelector}`);

            const topDoc = doc.defaultView?.top?.document || doc;

            // Wait for the specific option to appear
            const targetTd = await waitForAnySelector(
                [`td[arvalue="${targetValue}"]`],
                [doc, topDoc],
                5000
            );
            if (!targetTd) {
                log(`Option "${targetValue}" not found after waiting`);
                return;
            }

            await humanHover(targetTd);
            await sleep(rand(100, 200));
            await humanClick(targetTd);
            log(`Clicked "${targetValue}"`);

            // Verify selection applied
            const input = container.querySelector('input, textarea');
            await sleep(500);
            if (!input || (input.title !== targetValue && input.value !== targetValue)) {
                log(`Selection not applied yet, retrying...`);
                await sleep(rand(100, 200));
                await humanClick(targetTd);
                await sleep(500);
            }

            if (input && (input.title === targetValue || input.value === targetValue)) {
                log(`✅ "${targetValue}" successfully applied`);
            } else {
                log(`⚠ "${targetValue}" may not have applied`);
            }
        }

        /* ===== Utility functions for realistic interaction ===== */
        function sleep(ms) {
            return new Promise(res => setTimeout(res, ms));
        }
        function rand(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        async function humanFocus(el) {
            try {
                el.scrollIntoView({ behavior: 'auto', block: 'center' });
                await sleep(rand(100, 220));
                if (el.focus) el.focus();
                el.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
                await sleep(rand(90, 150));
                await humanClick(el);
            } catch {}
        }

        async function humanHover(el) {
            const rect = el.getBoundingClientRect();
            const x = Math.round(rect.left + rect.width / 2);
            const y = Math.round(rect.top + rect.height / 2);
            const doc = el.ownerDocument;
            const win = doc.defaultView;

            ['mousemove', 'pointermove', 'mouseover'].forEach(type => {
                const ev = new MouseEvent(type, {
                    bubbles: true, cancelable: true,
                    clientX: x, clientY: y, view: win
                });
                el.dispatchEvent(ev);
            });
        }

        async function humanClick(el) {
            const rect = el.getBoundingClientRect();
            const x = Math.round(rect.left + Math.min(rect.width - 3, Math.max(3, rect.width * 0.8)));
            const y = Math.round(rect.top + rect.height / 2);
            const doc = el.ownerDocument;
            const win = doc.defaultView;

            const events = [
                ['pointerover'], ['mouseover'], ['mousemove'],
                ['pointerdown'], ['mousedown'],
                ['mouseup'], ['pointerup'],
                ['click']
            ];

            for (const [type] of events) {
                const ev = new MouseEvent(type, {
                    bubbles: true, cancelable: true,
                    clientX: x, clientY: y, view: win, button: 0
                });
                el.dispatchEvent(ev);
                await sleep(rand(20, 60));
            }
        }

        async function waitForAnySelector(selectors, docs, timeoutMs = 5000) {
            const deadline = Date.now() + timeoutMs;

            while (Date.now() < deadline) {
                for (const d of docs) {
                    for (const sel of selectors) {
                        const el = d.querySelector(sel);
                        if (el && isVisible(el)) return el;
                    }
                }
                await sleep(120);
            }

            // Fallback: MutationObserver within remaining time
            return new Promise(resolve => {
                let resolved = false;
                const observers = [];

                const finish = (el) => {
                    if (resolved) return;
                    resolved = true;
                    observers.forEach(o => o.disconnect());
                    resolve(el || null);
                };

                for (const d of docs) {
                    const obs = new d.defaultView.MutationObserver(() => {
                        for (const sel of selectors) {
                            const el = d.querySelector(sel);
                            if (el && isVisible(el)) finish(el);
                        }
                    });
                    obs.observe(d, { childList: true, subtree: true });
                    observers.push(obs);
                }

                setTimeout(() => finish(null), Math.max(0, deadline - Date.now()));
            });
        }

        function isVisible(el) {
            const style = el.ownerDocument.defaultView.getComputedStyle(el);
            if (style.visibility === 'hidden' || style.display === 'none') return false;
            const rect = el.getBoundingClientRect();
            return rect && rect.width > 0 && rect.height > 0;
        }

        doc.__magicBtnAdded = true;
        return true;
    }

    function addAfterSaveButton(doc) {
        if (!doc || doc.__afterSaveBtnAdded) return false;
        const homeDiv = doc.querySelector('#TBhome') || doc.querySelector('td.TBGroup a.home div');
        if (!homeDiv) return false;
        if (doc.querySelector('#afterSaveBtn')) { doc.__afterSaveBtnAdded = true; return true; }

        log('Injecting After Save Button');
        const afterAnchor = doc.createElement('a');
        afterAnchor.className = 'after-save btn btn3d tbbtn';
        afterAnchor.href = 'javascript:';
        afterAnchor.style.position = 'static';
        afterAnchor.style.background = 'transparent';
        afterAnchor.style.border = 'none';
        afterAnchor.style.padding = '0';
        afterAnchor.style.borderRadius = '150px';

        const afterDiv = doc.createElement('div');
        afterDiv.id = 'afterSaveBtn';
        afterDiv.textContent = 'After save config';
        afterDiv.style.backgroundColor = '#2196F3';
        afterDiv.style.transition = 'background-color 0.3s ease';
        afterDiv.addEventListener('mouseenter', () => { afterDiv.style.backgroundColor = '#1976D2'; });
        afterDiv.addEventListener('mouseleave', () => { afterDiv.style.backgroundColor = '#2196F3'; });
        afterDiv.style.padding = '6px 16px';
        afterDiv.style.fontWeight = 'bold';
        afterDiv.style.cursor = 'pointer';
        afterDiv.style.borderRadius = '9px';

        afterAnchor.appendChild(afterDiv);

        const parentTd = homeDiv.closest('td.TBGroup') || homeDiv.parentElement || doc.body;
        parentTd.appendChild(afterAnchor);

        afterAnchor.addEventListener('click', async () => {
            const btnDoc = afterAnchor.ownerDocument;
            log('After Save Button clicked — starting automation');

            async function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
            function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

            async function humanClick(el) {
                const rect = el.getBoundingClientRect();
                const x = Math.round(rect.left + Math.min(rect.width - 3, Math.max(3, rect.width * 0.8)));
                const y = Math.round(rect.top + rect.height / 2);
                const doc = el.ownerDocument;
                const win = doc.defaultView;
                const events = [
                    ['pointerover'], ['mouseover'], ['mousemove'],
                    ['pointerdown'], ['mousedown'],
                    ['mouseup'], ['pointerup'],
                    ['click']
                ];
                for (const [type] of events) {
                    const ev = new MouseEvent(type, {
                        bubbles: true, cancelable: true,
                        clientX: x, clientY: y, view: win, button: 0
                    });
                    el.dispatchEvent(ev);
                    await sleep(rand(20, 60));
                }
            }

            async function humanHover(el) {
                const rect = el.getBoundingClientRect();
                const x = Math.round(rect.left + rect.width / 2);
                const y = Math.round(rect.top + rect.height / 2);
                const doc = el.ownerDocument;
                const win = doc.defaultView;
                ['mousemove', 'pointermove', 'mouseover'].forEach(type => {
                    const ev = new MouseEvent(type, {
                        bubbles: true, cancelable: true,
                        clientX: x, clientY: y, view: win
                    });
                    el.dispatchEvent(ev);
                });
            }

            async function waitForAnySelector(selectors, docs, timeoutMs = 5000) {
                const deadline = Date.now() + timeoutMs;
                while (Date.now() < deadline) {
                    for (const d of docs) {
                        for (const sel of selectors) {
                            const el = d.querySelector(sel);
                            if (el && isVisible(el)) return el;
                        }
                    }
                    await sleep(120);
                }
                return new Promise(resolve => {
                    let resolved = false;
                    const observers = [];
                    const finish = (el) => {
                        if (resolved) return;
                        resolved = true;
                        observers.forEach(o => o.disconnect());
                        resolve(el || null);
                    };
                    for (const d of docs) {
                        const win = d.defaultView || window;
                        const obs = new win.MutationObserver(() => {
                            for (const sel of selectors) {
                                const el = d.querySelector(sel);
                                if (el && isVisible(el)) finish(el);
                            }
                        });
                        obs.observe(d, { childList: true, subtree: true });
                        observers.push(obs);
                    }
                    setTimeout(() => finish(null), Math.max(0, deadline - Date.now()));
                });
            }

            function isVisible(el) {
                const win = el.ownerDocument.defaultView || window;
                const style = win.getComputedStyle(el);
                if (!style) return false;
                if (style.visibility === 'hidden' || style.display === 'none') return false;
                const rect = el.getBoundingClientRect();
                return rect && rect.width > 0 && rect.height > 0;
            }

            async function selectDropdown(doc, containerSelector, targetValue) {
                const container = doc.querySelector(containerSelector);
                if (!container) { log(`Container ${containerSelector} not found`); return; }
                const dropdownBtn = container.querySelector('.selectionbtn, .menu');
                if (!dropdownBtn) { log(`Dropdown button not found in ${containerSelector}`); return; }
                dropdownBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await sleep(rand(120, 260));
                await humanClick(dropdownBtn);
                log(`Clicked dropdown for ${containerSelector}`);
                const topDoc = doc.defaultView?.top?.document || doc;
                const targetTd = await waitForAnySelector([`td[arvalue="${targetValue}"]`], [doc, topDoc], 5000);
                if (!targetTd) { log(`Option "${targetValue}" not found after waiting`); return; }
                await humanHover(targetTd);
                await sleep(rand(100, 200));
                await humanClick(targetTd);
                log(`Clicked "${targetValue}"`);
            }


            function getNextWorkdayDateTime() {
                const d = new Date();
                const dayOfWeek = d.getDay(); // Sunday=0, Monday=1, ..., Friday=5, Saturday=6

                if (dayOfWeek === 5) {
                    d.setDate(d.getDate() + 3); // Friday → Monday
                } else if (dayOfWeek === 6) {
                    d.setDate(d.getDate() + 2); // Saturday → Monday
                } else {
                    d.setDate(d.getDate() + 1); // Normal case
                }

                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}.${month}.${year} 17:00:00`;
            }


            async function setDateField(doc, selector) {
                const input = doc.querySelector(selector);
                if (!input) { log(`Date field ${selector} not found`); return; }
                const value = getNextWorkdayDateTime();
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                log(`Set date to "${value}"`);
            }

            try {
                await selectDropdown(btnDoc, '#WIN_0_536871002', 'Toimitusajan siirto');
                await setDateField(btnDoc, '#WIN_0_536870941 input#arid_WIN_0_536870941');
                await selectDropdown(btnDoc, '#WIN_0_700001099', 'A');
                alert("Verify and Save");
            } catch (e) {
                log('Error during After Save automation:', e);
            }
        });

        doc.__afterSaveBtnAdded = true;
        return true;
    }

    // Auto-click popup button if URL matches
    function isPopupUrl(url) {
        if (!url || typeof url !== 'string') return false;
        if (!url.startsWith(POPUP_BASE)) return false;
        try {
            const u = new URL(url);
            return u.searchParams.has(POPUP_PARAM);
        } catch {
            return url.includes('?cacheid=');
        }
    }

    function autoClickPopup(doc) {
        if (!doc) return false;
        const href = (doc.defaultView && doc.defaultView.location && doc.defaultView.location.href) || (doc.location && doc.location.href);
        if (!isPopupUrl(href)) return false;
        if (doc.__popupClicked) return true;

        const popupBtn = doc.querySelector('#WIN_0_536870908');
        if (popupBtn) {
            log('Popup detected — clicking button');
            setTimeout(() => {
                try {
                    popupBtn.click();
                    doc.__popupClicked = true;
                    log('Clicked popup button successfully');
                } catch (e) {
                    log('Error clicking popup button:', e);
                }
            }, 300);
            return true;
        }
        return false;
    }

    // Monitor and inject
    function injectEverywhere(rootDoc) {
        let done = false;
        try { done = addMagicButton(rootDoc) || done; } catch (e) { log('Error adding Magic Button:', e); }
        try { done = autoClickPopup(rootDoc) || done; } catch (e) { log('Error auto-clicking popup:', e); }
        try { done = addAfterSaveButton(rootDoc) || done; } catch (e) { log('Error adding After Save Button:', e); }
        try { done = colorLabelsRed(rootDoc) || done; } catch (e) { log('Error coloring labels red:', e); }
        try { done = setupMatchGreenStyling(rootDoc) || done; } catch (e) { log('Error coloring matching fields names green:', e); }
        try { colorAsiakasviiteAlwaysGreen(rootDoc); } catch (e) { log('Error colorAsiakasviiteAlwaysGreen:', e); }

        const frames = rootDoc.querySelectorAll('iframe, frame');
        frames.forEach(frame => {
            try {
                const fdoc = frame.contentDocument || frame.contentWindow?.document;
                if (fdoc) {
                    done = addMagicButton(fdoc) || done;
                    done = autoClickPopup(fdoc) || done;
                    done = addAfterSaveButton(fdoc) || done;
                    colorAsiakasviiteAlwaysGreen(fdoc);
                    done = colorLabelsRed(fdoc) || done;
                    done = setupMatchGreenStyling(fdoc) || done;
                }
            } catch (e) {
                log('Skipped cross-origin frame');
            }
        });
        return done;
    }

    function startMonitoring(rootDoc) {
        injectEverywhere(rootDoc);
        const interval = setInterval(() => injectEverywhere(rootDoc), 1000);
        const observer = new MutationObserver(() => injectEverywhere(rootDoc));
        observer.observe(rootDoc, { childList: true, subtree: true });

        setTimeout(() => {
            clearInterval(interval);
            observer.disconnect();
            log('Stopped monitoring after timeout');
        }, 60000);
    }

    startMonitoring(document);
})();