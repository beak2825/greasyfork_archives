// ==UserScript==
// @name         Hírstart admin - üres Robot kategória kitöltés
// @namespace    http://tampermonkey.net/
// @version      1.50
// @description  Kitölti az üres "Robot kategória" cellákat, ha a mellette lévő cella nem speciális beállítású, vizuális visszajelzéssel. v1.5: Kategória- gomb hozzáadva a "[hirdetés], [N/A]" kategóriák törléséhez.
// @author       attila.virag@centralmediacsoport.hu
// @match        https://admin.hirstart.hu/?pid=*&fid=*
// @grant        none
// @license      hirstart.hu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @downloadURL https://update.greasyfork.org/scripts/557092/H%C3%ADrstart%20admin%20-%20%C3%BCres%20Robot%20kateg%C3%B3ria%20kit%C3%B6lt%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/557092/H%C3%ADrstart%20admin%20-%20%C3%BCres%20Robot%20kateg%C3%B3ria%20kit%C3%B6lt%C3%A9s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Konfiguráció ---
    const CONFIG = {
        BUTTON_CLASS: 'custom-admin-button',
        START_BUTTON_ID: 'robot-kategoria-start',
        REMOVE_BUTTON_ID: 'robot-kategoria-remove',
        VISUAL_FEEDBACK_SIZE: '16px',
        VISUAL_FEEDBACK_DURATION: 400
    };

    const TIMING = {
        CELL_CLICK_WAIT: 250,           // Várakozás cella kattintás után
        POPUP_OPEN_WAIT: 350,           // Popup megnyitás várás
        DROPDOWN_WAIT: 350,             // Dropdown megnyitás
        SAVE_WAIT: 400,                 // Mentés után várakozás
        POPUP_POLL_INTERVAL: 100,       // Popup keresés polling interval
        POPUP_POLL_TIMEOUT: 3000,       // Max 3 sec popup várakozás
        DROPDOWN_POLL_INTERVAL: 100,    // Dropdown keresés polling interval
        DROPDOWN_POLL_TIMEOUT: 1500,    // Max 1.5 sec dropdown várakozás
        BUTTON_CHECK_INTERVAL: 500      // Gomb jelenlét ellenőrzés
    };

    const COLORS = {
        CELL_CLICK: 'red',
        INPUT_FOCUS: 'blue',
        TRIGGER_OPEN: 'green',
        ADD_BUTTON: 'purple',
        DROPDOWN_ITEM_1: 'orange',
        TRIGGER_OPEN_2: 'lime',
        DROPDOWN_ITEM_2: 'magenta',
        CLOSE_BUTTON: 'cyan'
    };

    let isProcessing = false;
    let isRemoving = false;

    // --- Utility függvények ---

    /**
     * Aszinkron várakozás megadott milliszekundumig.
     * @param {number} ms - Várakozási idő milliszekundumban
     * @returns {Promise<void>}
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Hibát logol a konzolra formázott üzenettel.
     * @param {string} msg - Hibaüzenet
     * @param {...any} args - További argumentumok
     */
    function logError(msg, ...args) {
        console.error('[Robot kategória script]', msg, ...args);
    }

    /**
     * Információt logol a konzolra formázott üzenettel.
     * @param {string} msg - Információs üzenet
     * @param {...any} args - További argumentumok
     */
    function logInfo(msg, ...args) {
        console.log('[Robot kategória script]', msg, ...args);
    }

    /**
     * Toast notification megjelenítése a képernyő jobb alsó sarkában.
     * @param {string} msg - Megjelenítendő üzenet
     * @param {string} type - Típus: 'info', 'success', 'error', 'warning'
     * @param {number} duration - Megjelenési idő milliszekundumban
     */
    function showToast(msg, type = 'info', duration = 3000) {
        const bgColors = {
            info: '#2196F3',
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800'
        };
        
        const toast = document.createElement('div');
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '99999',
            padding: '12px 20px',
            background: bgColors[type] || bgColors.info,
            color: 'white',
            borderRadius: '4px',
            fontFamily: 'system-ui',
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    /**
     * Vizuális visszajelzés megjelenítése egy elem közelében.
     * @param {HTMLElement} element - Az elem, amely mellett a visszajelzés megjelenik
     * @param {string} color - A visszajelzés színe
     * @param {number} duration - Megjelenési idő milliszekundumban
     */
    function showVisualFeedback(element, color = 'red', duration = CONFIG.VISUAL_FEEDBACK_DURATION) {
        const rect = element.getBoundingClientRect();
        const dot = document.createElement('div');
        Object.assign(dot.style, {
            position: 'fixed',
            left: `${rect.left + rect.width / 2}px`,
            top: `${rect.top + rect.height / 2}px`,
            width: CONFIG.VISUAL_FEEDBACK_SIZE,
            height: CONFIG.VISUAL_FEEDBACK_SIZE,
            background: color,
            borderRadius: '50%',
            zIndex: '99999',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)'
        });
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), duration);
    }

    /**
     * Egérkattintás szimulálása egy elemen (mousedown, mouseup, click eseménysor).
     * @param {HTMLElement} element - Az elem, amelyre kattintani kell
     */
    function simulateClick(element) {
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            const evt = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(evt);
        });
    }

    /**
     * Várakozás egy DOM elem megjelenésére megadott timeout-tal.
     * @param {Function|string} selector - Selector string vagy függvény, amely az elemet visszaadja
     * @param {number} timeout - Maximum várakozási idő milliszekundumban
     * @param {number} interval - Polling intervallum milliszekundumban
     * @returns {Promise<HTMLElement>} - A megtalált elem
     * @throws {Error} - Ha az elem nem található a timeout alatt
     */
    async function waitForElement(selector, timeout = 3000, interval = 100) {
        const maxAttempts = Math.ceil(timeout / interval);
        for (let i = 0; i < maxAttempts; i++) {
            const element = typeof selector === 'function' 
                ? selector() 
                : document.querySelector(selector);
            if (element) {
                return element;
            }
            await sleep(interval);
        }
        throw new Error(`Element nem található (${timeout}ms timeout)`);
    }

    /**
     * ExtJS popup ablak keresése robusztus módon.
     * Először az ext-comp-2573 ID alapján, majd fallback class-alapú kereséssel.
     * @returns {Promise<HTMLElement|null>} - A popup elem vagy null
     */
    async function findPopup() {
        try {
            // Elsődleges keresés: hardkódolt ID (gyorsabb, ha létezik)
            const popup = await waitForElement(() => {
                const el = document.getElementById('ext-comp-2573');
                if (el && el.style.display !== 'none' && el.style.visibility !== 'hidden') {
                    return el;
                }
                return null;
            }, TIMING.POPUP_POLL_TIMEOUT, TIMING.POPUP_POLL_INTERVAL);
            return popup;
        } catch (err) {
            logInfo('Hardkódolt ID nem található, class-alapú keresés...');
            // Fallback: class-alapú keresés
            try {
                const popup = await waitForElement(() => {
                    const divs = Array.from(document.querySelectorAll('body > div'));
                    return divs.find(div => {
                        const style = window.getComputedStyle(div);
                        if (style.display === 'none' || style.visibility === 'hidden') return false;
                        // ExtJS popup jellemzői: tartalmaz input mezőt és form elemet
                        const hasInput = div.querySelector('input[type="text"]');
                        const hasForm = div.querySelector('form');
                        const hasExtClass = div.className && (
                            div.className.includes('x-window') || 
                            div.className.includes('x-panel') ||
                            div.className.includes('x-form')
                        );
                        return hasInput && hasForm && hasExtClass;
                    });
                }, TIMING.POPUP_POLL_TIMEOUT, TIMING.POPUP_POLL_INTERVAL);
                return popup;
            } catch (err2) {
                logError('Popup nem található egyik módszerrel sem:', err2);
                return null;
            }
        }
    }

    /**
     * ExtJS dropdown lista keresése.
     * @returns {Promise<HTMLElement|null>} - A dropdown elem vagy null
     */
    async function findDropdown() {
        try {
            const dropdown = await waitForElement(() => {
                return Array.from(document.querySelectorAll('body > div')).find(div => {
                    const style = window.getComputedStyle(div);
                    return style.display !== 'none' && 
                           style.visibility !== 'hidden' && 
                           div.className.includes('x-combo-list');
                });
            }, TIMING.DROPDOWN_POLL_TIMEOUT, TIMING.DROPDOWN_POLL_INTERVAL);
            return dropdown;
        } catch (err) {
            logError('Dropdown nem található:', err);
            return null;
        }
    }

    // --- Gomb beszúrása ---

    /**
     * Indító gomb beszúrása az oldalra.
     */
    function insertButtons() {
        // Kategória+ gomb
        if (!document.getElementById(CONFIG.START_BUTTON_ID)) {
            const startBtn = document.createElement('button');
            startBtn.id = CONFIG.START_BUTTON_ID;
            startBtn.className = CONFIG.BUTTON_CLASS;
            startBtn.setAttribute('data-source', 'robotkategoria');
            startBtn.textContent = 'Kategória+';
            
            Object.assign(startBtn.style, {
                position: 'fixed',
                top: '55px',
                right: '4px',
                zIndex: '1001',
                margin: '0',
                padding: '2px 4px',
                background: 'rgb(0, 123, 255)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: '12px',
                fontFamily: 'system-ui'
            });
            
            startBtn.onclick = startProcessing;
            document.body.appendChild(startBtn);
            logInfo('Kategória+ gomb beszúrva');
        }
        
        // Kategória- gomb
        if (!document.getElementById(CONFIG.REMOVE_BUTTON_ID)) {
            const removeBtn = document.createElement('button');
            removeBtn.id = CONFIG.REMOVE_BUTTON_ID;
            removeBtn.className = CONFIG.BUTTON_CLASS;
            removeBtn.setAttribute('data-source', 'robotkategoria-remove');
            removeBtn.textContent = 'Kategória-';
            
            Object.assign(removeBtn.style, {
                position: 'fixed',
                top: '55px',
                right: '85px', // Balra a Kategória+ gombtól
                zIndex: '1001',
                margin: '0',
                padding: '2px 4px',
                background: 'rgb(220, 53, 69)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: '12px',
                fontFamily: 'system-ui'
            });
            
            removeBtn.onclick = startRemoving;
            document.body.appendChild(removeBtn);
            logInfo('Kategória- gomb beszúrva');
        }
    }

    // --- Fő feldolgozási logika ---

    /**
     * Feldolgozás indítása (gomb eseménykezelő).
     */
    async function startProcessing() {
        if (isProcessing) {
            showToast('Már fut egy feldolgozás!', 'warning');
            logInfo('Feldolgozás már folyamatban van, kérés figyelmen kívül hagyva');
            return;
        }
        
        isProcessing = true;
        const startBtn = document.getElementById(CONFIG.START_BUTTON_ID);
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.style.opacity = '0.6';
        }
        
        try {
            await processNextEmptyCell();
        } catch (e) {
            logError('Feldolgozás megszakadt:', e);
            showToast('Hiba történt a feldolgozás során', 'error');
        } finally {
            isProcessing = false;
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.opacity = '1';
            }
        }
    }

    /**
     * Következő üres cella megkeresése és feldolgozása.
     * Rekurzívan folytatja a következő cellával, ha sikeres.
     * @returns {Promise<void>}
     */
    async function processNextEmptyCell() {
        const tables = Array.from(document.querySelectorAll('table'));
        let found = false;
        
        outer: for (const table of tables) {
            const rows = Array.from(table.querySelectorAll('tbody > tr'));
            
            for (const row of rows) {
                const robotCell = row.querySelector('td:nth-child(3) > div');
                const filterCell = row.querySelector('td:nth-child(4) > div');
                
                if (!robotCell || !filterCell) continue;
                
                const robotValue = robotCell.textContent.trim();
                const filterValue = filterCell.textContent.trim();
                
                // Szűrés: csak üres cellák, amelyek melletti cella nem [hirdetés] vagy [N/A] vagy "-- kuka --"
                if (robotValue !== '' || ['[hirdetés]', '[N/A]', '-- kuka --'].includes(filterValue)) {
                    continue;
                }
                
                // Üres, feldolgozható cella találva
                logInfo('Feldolgozható cella találva:', { robotValue, filterValue });
                
                try {
                    await processSingleCell(row);
                    found = true;
                    
                    // Rekurzív folytatás a következő üres cellával
                    // TODO: Refaktorálás iterációvá a stack overflow elkerülésére
                    await processNextEmptyCell();
                    break outer;
                } catch (err) {
                    logError('Cella feldolgozási hiba:', err);
                    showToast(`Hiba a cella feldolgozásakor: ${err.message}`, 'error');
                    throw err;
                }
            }
        }
        
        if (!found) {
            showToast('Nincs több feldolgozható "Robot kategória" cella', 'success');
            logInfo('Feldolgozás befejezve: nincs több üres cella');
        }
    }

    /**
     * Egyetlen cella feldolgozása: kattintás, popup kezelés, értékek kitöltése.
     * @param {HTMLElement} row - A táblázat sora, amely a cellát tartalmazza
     * @returns {Promise<void>}
     */
    async function processSingleCell(row) {
        // 1. Kattintás a td elemre
        const td = row.querySelector('td:nth-child(3)');
        if (!td) throw new Error('Robot kategória td nem található');
        
        showVisualFeedback(td, COLORS.CELL_CLICK);
        simulateClick(td);
        await sleep(TIMING.CELL_CLICK_WAIT);
        
        // 2. Popup keresése
        const popup = await findPopup();
        if (!popup) {
            throw new Error('Szerkesztő popup nem található');
        }
        logInfo('Popup megtalálva');
        
        // 3. Első input mező kezelése
        await handleFirstInput(popup);
        
        // 4. Új input hozzáadása
        await addSecondInput(popup);
        
        // 5. Második input mező kezelése
        await handleSecondInput(popup);
        
        // 6. Popup bezárása/mentése
        await closePopup(popup);
        
        logInfo('Cella sikeresen feldolgozva');
    }

    /**
     * Első input mező kezelése: trigger kattintás, dropdown megnyitás, első elem kiválasztása.
     * @param {HTMLElement} popup - A popup elem
     * @returns {Promise<void>}
     */
    async function handleFirstInput(popup) {
        // Trigger (lenyíló ikon) keresése és kattintása
        const triggerImg = popup.querySelector('table tbody tr td:first-child div img');
        if (triggerImg) {
            showVisualFeedback(triggerImg, COLORS.TRIGGER_OPEN);
            simulateClick(triggerImg);
            await sleep(TIMING.DROPDOWN_WAIT);
            
            // Dropdown lista megkeresése
            const dropdown = await findDropdown();
            if (dropdown) {
                // Első elem kiválasztása
                const firstItem = dropdown.querySelector('.x-combo-list-item');
                if (firstItem) {
                    showVisualFeedback(firstItem, COLORS.DROPDOWN_ITEM_1);
                    simulateClick(firstItem);
                    await sleep(TIMING.CELL_CLICK_WAIT);
                    logInfo('Első dropdown elem kiválasztva');
                } else {
                    logError('Első dropdown elem nem található');
                }
            } else {
                logError('Dropdown nem található az első inputnál');
            }
        }
        
        // Input mező fókuszálása (opcionális, ha szükséges)
        const input1 = popup.querySelector('input[type="text"]');
        if (input1) {
            showVisualFeedback(input1, COLORS.INPUT_FOCUS);
            input1.focus();
            simulateClick(input1);
            await sleep(TIMING.CELL_CLICK_WAIT);
        }
    }

    /**
     * Második input hozzáadása: "+" gomb kattintása.
     * @param {HTMLElement} popup - A popup elem
     * @returns {Promise<void>}
     */
    async function addSecondInput(popup) {
        const addButton = popup.querySelector('table tbody tr td:nth-child(2) em button');
        if (addButton) {
            showVisualFeedback(addButton, COLORS.ADD_BUTTON);
            simulateClick(addButton);
            await sleep(TIMING.DROPDOWN_WAIT);
            logInfo('Második input hozzáadva');
        } else {
            throw new Error('Hozzáadás gomb nem található');
        }
    }

    /**
     * Második input mező kezelése: trigger kattintás, dropdown megnyitás, második elem kiválasztása.
     * @param {HTMLElement} popup - A popup elem
     * @returns {Promise<void>}
     */
    async function handleSecondInput(popup) {
        const inputs = popup.querySelectorAll('input[type="text"]');
        if (inputs.length > 1) {
            const input2 = inputs[1];
            
            // Második input trigger képének keresése
            const triggerImg2 = input2.parentElement ? input2.parentElement.querySelector('img') : null;
            if (triggerImg2) {
                showVisualFeedback(triggerImg2, COLORS.TRIGGER_OPEN_2);
                simulateClick(triggerImg2);
                await sleep(TIMING.DROPDOWN_WAIT);
                
                // Dropdown lista megkeresése
                const dropdown2 = await findDropdown();
                if (dropdown2) {
                    // Második elem kiválasztása
                    const items = dropdown2.querySelectorAll('.x-combo-list-item');
                    if (items.length > 1) {
                        const secondItem = items[1];
                        showVisualFeedback(secondItem, COLORS.DROPDOWN_ITEM_2);
                        simulateClick(secondItem);
                        await sleep(TIMING.CELL_CLICK_WAIT);
                        logInfo('Második dropdown elem kiválasztva');
                    } else {
                        logError('Második dropdown elem nem található');
                    }
                } else {
                    logError('Dropdown nem található a második inputnál');
                }
            } else {
                logError('Második input trigger képe nem található');
            }
        } else {
            throw new Error('Második input mező nem jött létre');
        }
    }

    /**
     * Popup bezárása/mentése: bezáró/mentő gomb kattintása.
     * @param {HTMLElement} popup - A popup elem
     * @returns {Promise<void>}
     */
    async function closePopup(popup) {
        const closeBtn = popup.querySelector('div > div > table tbody tr td:first-child table tbody tr td:nth-child(2) em button');
        if (closeBtn) {
            showVisualFeedback(closeBtn, COLORS.CLOSE_BUTTON);
            simulateClick(closeBtn);
            await sleep(TIMING.SAVE_WAIT);
            logInfo('Popup bezárva/mentve');
        } else {
            logError('Bezárás gomb nem található - popup manuális bezárása szükséges lehet');
        }
    }

    // --- Kategória törlés logika ---

    /**
     * Kategória törlés indítása (gomb eseménykezelő).
     */
    async function startRemoving() {
        if (isRemoving) {
            showToast('Már fut egy törlés!', 'warning');
            logInfo('Törlés már folyamatban van, kérés figyelmen kívül hagyva');
            return;
        }
        
        if (isProcessing) {
            showToast('Várja meg a feldolgozás befejezését!', 'warning');
            return;
        }
        
        isRemoving = true;
        const removeBtn = document.getElementById(CONFIG.REMOVE_BUTTON_ID);
        if (removeBtn) {
            removeBtn.disabled = true;
            removeBtn.style.opacity = '0.6';
        }
        
        try {
            await processNextCategoryToRemove();
        } catch (e) {
            logError('Törlés megszakadt:', e);
            showToast('Hiba történt a törlés során', 'error');
        } finally {
            isRemoving = false;
            if (removeBtn) {
                removeBtn.disabled = false;
                removeBtn.style.opacity = '1';
            }
        }
    }

    /**
     * Következő törlendő kategória megkeresése és feldolgozása.
     * @returns {Promise<void>}
     */
    async function processNextCategoryToRemove() {
        const tables = Array.from(document.querySelectorAll('table'));
        let found = false;
        
        outer: for (const table of tables) {
            const rows = Array.from(table.querySelectorAll('tbody > tr'));
            
            for (const row of rows) {
                const robotCell = row.querySelector('td:nth-child(3) > div');
                
                if (!robotCell) continue;
                
                const robotValue = robotCell.textContent.trim();
                
                // Keresés: olyan cellák, amelyek értéke "[hirdetés], [N/A]"
                if (robotValue === '[hirdetés], [N/A]') {
                    logInfo('Törlendő kategória találva:', { robotValue });
                    
                    try {
                        await removeCategoryFromCell(row);
                        found = true;
                        
                        // Rekurzív folytatás a következő törlendő cellával
                        await processNextCategoryToRemove();
                        break outer;
                    } catch (err) {
                        logError('Kategória törlési hiba:', err);
                        showToast(`Hiba a kategória törlésekor: ${err.message}`, 'error');
                        throw err;
                    }
                }
            }
        }
        
        if (!found) {
            showToast('Nincs több "[hirdetés], [N/A]" kategória', 'success');
            logInfo('Törlés befejezve: nincs több törlendő kategória');
        }
    }

    /**
     * Kategória törlése egy cellából.
     * @param {HTMLElement} row - A táblázat sora, amely a cellát tartalmazza
     * @returns {Promise<void>}
     */
    async function removeCategoryFromCell(row) {
        // 1. Kattintás a td elemre
        const td = row.querySelector('td:nth-child(3)');
        if (!td) throw new Error('Robot kategória td nem található');
        
        showVisualFeedback(td, COLORS.CELL_CLICK);
        simulateClick(td);
        await sleep(TIMING.CELL_CLICK_WAIT);
        
        // 2. Popup keresése
        const popup = await findPopup();
        if (!popup) {
            throw new Error('Szerkesztő popup nem található');
        }
        logInfo('Popup megtalálva törléshez');
        
        // 3. Törlő gombok megkeresése és kattintása
        await removeAllCategoriesFromPopup(popup);
        
        // 4. Popup bezárása/mentése
        await closePopup(popup);
        
        logInfo('Kategóriák sikeresen törölve a cellából');
    }

    /**
     * Összes kategória törlése a popupból a törlő gombok használatával.
     * @param {HTMLElement} popup - A popup elem
     * @returns {Promise<void>}
     */
    async function removeAllCategoriesFromPopup(popup) {
        // Az XPath-ok alapján keresünk törlő gombokat
        // /html/body/div[28]/div[2]/div[1]/div/div/div/div/div/form/div[1]/div/div/div/div/div/table/tbody/tr/td[2]/table/tbody/tr/td[2]/em/button
        // /html/body/div[28]/div[2]/div[1]/div/div/div/div/div/form/div[2]/div/div/div/div/div/table/tbody/tr/td[2]/table/tbody/tr/td[2]/em/button
        
        // Általánosítva: form/div[N]/div/div/div/div/div/table/tbody/tr/td[2]/table/tbody/tr/td[2]/em/button
        const form = popup.querySelector('form');
        if (!form) {
            throw new Error('Form elem nem található a popupban');
        }
        
        // Keresünk minden törlő gombot
        const deleteButtons = form.querySelectorAll('table tbody tr td:nth-child(2) table tbody tr td:nth-child(2) em button');
        
        if (deleteButtons.length === 0) {
            logError('Nem találhatók törlő gombok');
            return;
        }
        
        logInfo(`${deleteButtons.length} törlő gomb találva`);
        
        // Törlő gombok kattintása (fordított sorrendben, hogy az indexek ne változzanak)
        for (let i = deleteButtons.length - 1; i >= 0; i--) {
            const btn = deleteButtons[i];
            showVisualFeedback(btn, 'red');
            simulateClick(btn);
            await sleep(TIMING.CELL_CLICK_WAIT);
            logInfo(`Törlő gomb ${i + 1}/${deleteButtons.length} kattintva`);
        }
    }

    // --- Inicializálás ---

    /**
     * Callback függvény az oldal betöltődésekor.
     * @param {Function} fn - Futtatandó függvény
     */
    function onReady(fn) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(fn, 1);
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    /**
     * Script inicializálás.
     */
    onReady(() => {
        // URL ellenőrzés
        if (!/^https:\/\/admin\.hirstart\.hu\//.test(window.location.href) || 
            !window.location.href.includes('pid=') || 
            !window.location.href.includes('fid=')) {
            logInfo('Script nem fut ezen az oldalon (URL nem egyezik)');
            return;
        }
        
        logInfo('Script inicializálva');
        
        // Gomb jelenlét ellenőrzése és újraszúrása (dinamikus DOM esetén)
        setInterval(() => {
            const existingStartButton = document.getElementById(CONFIG.START_BUTTON_ID);
            const existingRemoveButton = document.getElementById(CONFIG.REMOVE_BUTTON_ID);
            if (!existingStartButton || !existingRemoveButton) {
                insertButtons();
            }
        }, TIMING.BUTTON_CHECK_INTERVAL);
    });

})();
