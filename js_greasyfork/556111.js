// ==UserScript==
// @name         Hírstart admin - sortípus képek bekapcsolása
// @namespace    http://tampermonkey.net/
// @version      1.39
// @description  Automatikusan kattintgatja a sorokat és aktiválja az input mezőket
// @author       attila.virag@centralmediacsoport.hu
// @match        https://admin-hirstart.p24.hu/oldalszerk.php?id=*
// @match        https://admin.hirstart.hu/oldalszerk.php?id=*
// @grant        none
// @license      hirstart.hu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @downloadURL https://update.greasyfork.org/scripts/556111/H%C3%ADrstart%20admin%20-%20sort%C3%ADpus%20k%C3%A9pek%20bekapcsol%C3%A1sa.user.js
// @updateURL https://update.greasyfork.org/scripts/556111/H%C3%ADrstart%20admin%20-%20sort%C3%ADpus%20k%C3%A9pek%20bekapcsol%C3%A1sa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Layout konfigurációk - teljes XPath-ek
    const LAYOUTS = {
        DEFAULT_BOXES: {
            name:               'DEFAULT BOXES',
            targetDiv:          '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[1]/div',
            secondButtonTd:     '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[1]/div/div[1]/div/table/tbody/tr/td[3]',
            rowsContainer:      '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[1]/div/div[2]/div/div[1]/div[2]/div',
            rowItem:            '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[1]/div/div[2]/div/div[1]/div[2]/div/div[${i}]',
            inputField:         '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[2]/div[2]/form/div[2]/div[1]/div/div/input',
            clickableElement:   '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[1]/div/div[2]/div/div[1]/div[2]/div/div[${i}]/table/tbody/tr/td[2]/div',
            checkbox:           '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[1]/div/div[2]/div/div[1]/div[2]/div/div[${i}]/table/tbody/tr/td[1]/input',
            checkWrapDiv:       '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[2]/div[2]/form/div[2]/div[1]/div',
            detectXPath:        '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[1]/div/div/div[1]/div[2]/div/div[1]/div/div[1]/div/table/tbody/tr/td[3]'
        },
        REGIONAL_BOXES: {
            name:               'REGIONAL BOXES',
            targetDiv:          '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[2]/div',
            secondButtonTd:     '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div/table/tbody/tr/td[3]',
            rowsContainer:      '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[2]/div/div[2]/div/div[1]/div[2]/div',
            rowItem:            '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div[${i}]',
            inputField:         '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[3]/div[2]/form/div[2]/div[1]/div/div/input',
            clickableElement:   '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div[${i}]/table/tbody/tr/td[2]/div',
            checkbox:           '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div[${i}]/table/tbody/tr/td[1]/input',
            checkWrapDiv:       '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[3]/div[2]/form/div[2]/div[1]/div',
            detectXPath:        '/html/body/div[7]/div[2]/div[1]/div/div/div/div/div[2]/div/div[3]/div/div/div[3]/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div/table/tbody/tr/td[3]'
        }
    };

    let detectedLayouts = [];
    const addedButtonIds = new Set();
    let automationTriggered = false;

    // Összes layout detektálása - csak akkor fut, ha a user kattintott egy box-ra
    function detectAndAddButtons() {
        // console.log('🔍 Layout detektálás és gomb elhelyezés kezdése...');
        
        detectedLayouts = [];
        let placedCount = 0;

        // Mindegyik layout-ot egyenként próbáljuk feldolgozni
        for (const [key, layout] of Object.entries(LAYOUTS)) {
            // console.log(`\n  Vizsgálva: ${layout.name}`);
            
            // Próbáljuk meg az elsődleges XPath-et
            let targetDiv = document.evaluate(
                layout.targetDiv,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (!targetDiv) {
                // console.log(`  ✗ ${layout.name} targetDiv nem található, kihagyjuk`);
                continue;
            }

            // console.log(`  ✓ ${layout.name} targetDiv megtalálva!`);
            detectedLayouts.push(layout);

            // Megpróbáljuk elhelyezni a gombot
            const placed = tryPlaceButton(layout);
            if (placed) {
                placedCount++;
            }
        }
        
        // console.log(`\n📊 ${placedCount} gomb elhelyezésre került`);
        return placedCount;
    }

    // Gomb elhelyezésének megkísérlése egy konkrét layout-hoz
    function tryPlaceButton(layout) {
        const layoutIndex = Object.values(LAYOUTS).indexOf(layout);
        const buttonId = `ext-gen-kep-be-${layoutIndex}`;
        
        // console.log(`\n🎯 ${layout.name} gomb elhelyezésének kísérlete...`);
        
        // Már létezik-e?
        if (document.getElementById(buttonId)) {
            // console.log(`  Gomb már létezik: ${layout.name}`);
            return true;
        }

        const targetDiv = document.evaluate(
            layout.targetDiv,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (!targetDiv) {
            console.warn(`  ❌ targetDiv nem található`);
            return false;
        }

        // Próbáljuk meg a secondButtonTd alapján
        const secondButtonTd = document.evaluate(
            layout.secondButtonTd,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (secondButtonTd) {
            // console.log(`  ✓ secondButtonTd megtalálva, gomb elhelyezése...`);
            return createAndInsertButton(buttonId, secondButtonTd, layout);
        }

        // Fallback: keressünk a targetDiv-ben a táblázat header-jén keresztül
        // console.log(`  ⚠️ secondButtonTd nem található, fallback módban...`);
        const firstTable = targetDiv.querySelector('table');
        if (firstTable) {
            const thead = firstTable.querySelector('thead');
            if (thead) {
                const firstHeadTd = thead.querySelector('tr td');
                if (firstHeadTd) {
                    // console.log(`  ✓ thead alapú fallback, gomb elhelyezése...`);
                    return createAndInsertButton(buttonId, firstHeadTd.parentNode, layout, true);
                }
            }
        }

        console.warn(`  ❌ Gomb elhelyezése sikertelen: ${layout.name}`);
        return false;
    }

    // Gomb létrehozása és beszúrása
    function createAndInsertButton(buttonId, targetElement, layout, isHeadTd = false) {
        const newTd = document.createElement('td');
        newTd.id = `ext-comp-kep-be-${buttonId}`;

        const buttonTable = document.createElement('table');
        buttonTable.setAttribute('border', '0');
        buttonTable.setAttribute('cellpadding', '0');
        buttonTable.setAttribute('cellspacing', '0');
        buttonTable.className = 'x-btn-wrap x-btn x-btn-text-icon';
        buttonTable.style.width = 'auto';

        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');

        const leftTd = document.createElement('td');
        leftTd.className = 'x-btn-left';
        leftTd.innerHTML = '<i>&nbsp;</i>';

        const centerTd = document.createElement('td');
        centerTd.className = 'x-btn-center';
        centerTd.innerHTML = `<em unselectable="on"><button class="x-btn-text icon-add" type="button" id="${buttonId}">Kép</button></em>`;

        const rightTd = document.createElement('td');
        rightTd.className = 'x-btn-right';
        rightTd.innerHTML = '<i>&nbsp;</i>';

        tr.appendChild(leftTd);
        tr.appendChild(centerTd);
        tr.appendChild(rightTd);
        tbody.appendChild(tr);
        buttonTable.appendChild(tbody);
        newTd.appendChild(buttonTable);

        // Beszúrás
        if (isHeadTd) {
            targetElement.appendChild(newTd);
            // console.log(`  ✓ Gomb elhelyezve (thead append)`);
        } else {
            targetElement.parentNode.insertBefore(newTd, targetElement.nextSibling);
            // console.log(`  ✓ Gomb elhelyezve (insertBefore)`);
        }

        addedButtonIds.add(buttonId);

        // Event listener
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', (event) => {
                // console.log(`Kép gomb kattintva (${layout.name})!`);
                event.stopPropagation();
                startAutomation(layout);
            });
        }

        return true;
    }

    // XPath interpolálása változókkal
    function interpolateXPath(xpath, variables = {}) {
        let result = xpath;
        for (const [key, value] of Object.entries(variables)) {
            result = result.replace(`\${${key}}`, value);
        }
        return result;
    }

    // Automatizációs folyamat
    async function startAutomation(layout) {
        // console.log(`Automatizáció elindult (${layout.name})`);

        const rowsContainer = document.evaluate(
            layout.rowsContainer,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (!rowsContainer) {
            // console.log('Sorok konténer nem található, várakozás...');
            setTimeout(() => startAutomation(layout), 3000);
            return;
        }

        // Számoljuk meg a sorokat
        let rowCount = 0;
        let rowIndex = 1;
        while (true) {
            const rowXPath = interpolateXPath(layout.rowItem, { i: rowIndex });
            const rowElement = document.evaluate(rowXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (!rowElement) {
                break;
            }
            rowCount++;
            rowIndex++;
        }

        // console.log(`Talált sorok száma: ${rowCount}`);

        if (rowCount === 0) {
            // console.log('Nincsenek sorok a feldolgozáshoz');
            return;
        }

        const inputField = document.evaluate(
            layout.inputField,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (!inputField) {
            // console.log('Input mező nem található, várakozás...');
            setTimeout(() => startAutomation(layout), 3000);
            return;
        }

        // console.log('Automatizáció elkezdődött, várakozás a sorok feldolgozására...');

        for (let i = 1; i <= rowCount; i++) {
            // console.log(`Feldolgozás: ${i}. sor`);

            const clickableElementXPath = interpolateXPath(layout.clickableElement, { i });
            const clickableElement = document.evaluate(clickableElementXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (clickableElement) {
                const checkboxXPath = interpolateXPath(layout.checkbox, { i });
                const checkbox = document.evaluate(checkboxXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (checkbox && checkbox.checked) {
                    // console.log(`${i}. sor: checkbox már aktív, kihagyjuk a kép aktiválását`);
                    createRedDot(clickableElement, `${i}. sor kihagyva (checkbox aktív)`);
                } else {
                    createRedDot(clickableElement, `${i}. sor kattintása`);

                    clickableElement.click();
                    // console.log(`Kattintás a ${i}. sorra`);

                    await new Promise(resolve => setTimeout(resolve, 200));

                    if (document.activeElement !== inputField) {
                        const checkWrapDiv = document.evaluate(layout.checkWrapDiv, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                        if (checkWrapDiv && checkWrapDiv.classList.contains('x-form-check-checked')) {
                            // console.log(`${i}. sor: pipa már aktív (div class: ${checkWrapDiv.className}), nem kattintunk`);
                            createRedDot(inputField, `${i}. sor kihagyva (pipa aktív)`);
                        } else {
                            createRedDot(inputField, `${i}. sor input mező aktiválása`);

                            inputField.click();
                            // console.log(`Input mező aktiválása a ${i}. sorhoz (div class: ${checkWrapDiv ? checkWrapDiv.className : 'nincs'})`);

                            await new Promise(resolve => setTimeout(resolve, 200));
                        }
                    }
                }
            } else {
                // console.log(`A ${i}. sor kattintható eleme nem található`);
            }

            await new Promise(resolve => setTimeout(resolve, 200));
        }

        const finalDot = document.querySelector('.automation-dot');
        if (finalDot) {
            finalDot.remove();
        }

        // console.log('Automatizáció befejeződött');
    }

    // Piros pötty létrehozása
    function createRedDot(element, description) {
        // Töröljük a meglévő piros pöttyöket
        const existingDots = document.querySelectorAll('.automation-dot');
        existingDots.forEach(dot => dot.remove());

        // Hozz létre egy piros pöttyöt
        const dot = document.createElement('div');
        dot.className = 'automation-dot';
        dot.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background-color: red;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0,0,0,0.5);
            z-index: 999999;
            pointer-events: none;
        `;

        // Pozícionáljuk az elem fölé, de ne feljebb, hanem középre
        const rect = element.getBoundingClientRect();
        dot.style.left = (rect.left + rect.width / 2 - 6) + 'px';
        dot.style.top = (rect.top + rect.height / 2 - 6) + 'px';

        // Adjunk hozzá egy tooltippet
        dot.title = description;

        document.body.appendChild(dot);
        // console.log(`Piros pötty elhelyezve: ${description}`);

        return dot;
    }

    // Az oldal betöltésekor inicializálunk
    function initScript() {
        // console.log('=== SCRIPT INDÍTÁS ===');
        
        // Figyeljük az hs_boxbuttons diveket
        const observer = new MutationObserver(() => {
            // Keressünk hs_boxbuttons div-eket
            const boxButtons = document.querySelectorAll('[class*="hs_boxbuttons"]');
            
            if (boxButtons.length > 0 && !automationTriggered) {
                // Kattintás-eseményt hallgatunk az összes hs_boxbutton-ra
                boxButtons.forEach(boxBtn => {
                    boxBtn.addEventListener('click', handleBoxButtonClick, { once: true });
                });
                
                // console.log(`✓ ${boxButtons.length} hs_boxbutton div megtalálva, figyelem alatt...`);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Box button kattintáskezelő
    function handleBoxButtonClick() {
        if (automationTriggered) return;
        
        automationTriggered = true;
        // console.log('📍 Box gomb kattintva, layout detektálás indítása...');
        
        // Adjunk időt az oldal teljes betöltésére
        setTimeout(() => {
            detectAndAddButtons();
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();