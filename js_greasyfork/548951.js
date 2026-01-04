// ==UserScript==
// @name         aquagloop's armory manager
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  please pm to set it up:D
// @author       aquagloop
// @match        https://www.torn.com/factions.php?step=your&type=1*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/548951/aquagloop%27s%20armory%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/548951/aquagloop%27s%20armory%20manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyelA5lJik0rQfDqvaLvOHp8eSL5nYORQC58aN6tV82_VkCTw-zWm5K6flbru-uDg5D/exec';

    let debounceTimer;
    const lastProcessedSignatures = {
        weapons: null,
        armor: null
    };

    function processPageChange() {
        const weaponList = document.querySelector('#armoury-weapons .item-list');
        if (weaponList) {
            checkAndProcessList(weaponList, 'weapons');
        }
        const armorList = document.querySelector('#armoury-armour .item-list');
        if (armorList) {
            checkAndProcessList(armorList, 'armor');
        }
    }

    function checkAndProcessList(listEl, type) {
        if (!listEl.querySelector('li')) {
            lastProcessedSignatures[type] = null;
            return;
        }

        const ids = Array.from(listEl.querySelectorAll('li .img-wrap[data-armoryid]')).map(el => el.getAttribute('data-armoryid'));
        const currentPageSignature = ids.join(',');

        if (!currentPageSignature || currentPageSignature === lastProcessedSignatures[type]) {
            return;
        }

        lastProcessedSignatures[type] = currentPageSignature;
        runScriptForList(listEl, type);
    }

    async function runScriptForList(listContainer, type) {
        if (GOOGLE_SHEET_URL === 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            return;
        }
        try {
            let itemsData;
            if (type === 'weapons') {
                itemsData = parseWeapons(listContainer);
            } else if (type === 'armor') {
                itemsData = parseArmor(listContainer);
            } else {
                return;
            }

            if (itemsData.length === 0) {
                applyFeedbackStyles('success', listContainer);
                return;
            }

            await sendDataToSheet(itemsData, type);
            applyFeedbackStyles('success', listContainer);

        } catch (error) {
            applyFeedbackStyles('error', listContainer);
        }
    }

    const observerCallback = (mutationsList, observer) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processPageChange, 750);
    };

    const observer = new MutationObserver(observerCallback);

    const initialWaitTimer = setInterval(() => {
        const observerTarget = document.getElementById('faction-armoury');
        if (observerTarget) {
            clearInterval(initialWaitTimer);
            observer.observe(observerTarget, {
                childList: true,
                subtree: true
            });
            processPageChange();
        }
    }, 500);

    function applyFeedbackStyles(status, listContainer) {
        if (listContainer) {
            const color = status === 'success' ? '#4CAF50' : '#F44336';
            listContainer.style.outline = `3px solid ${color}`;
            listContainer.style.boxShadow = `0 0 15px ${color}`;
            listContainer.style.transition = 'outline 0.5s ease, box-shadow 0.5s ease';
        }
    }

    function parseWeapons(listContainer) {
        const allWeaponsData = [];
        const weaponElements = listContainer.querySelectorAll(':scope > li');
        weaponElements.forEach(li => {
            const armoryid = li.querySelector('.img-wrap[data-armoryid]')?.getAttribute('data-armoryid');
            if (!armoryid) return;

            const nameEl = li.querySelector('.name.bold');
            let name = 'N/A';
            if (nameEl) {
                const nameClone = nameEl.cloneNode(true);
                nameClone.querySelectorAll('*').forEach(child => child.remove());
                name = nameClone.textContent.trim();
            }

            const damageEl = li.querySelector('i.bonus-attachment-item-damage-bonus + span');
            const damage = damageEl ? parseFloat(damageEl.textContent.trim()) : 'N/A';

            const accuracyEl = li.querySelector('i.bonus-attachment-item-accuracy-bonus + span');
            const accuracy = accuracyEl ? parseFloat(accuracyEl.textContent.trim()) : 'N/A';

            const bonuses = [];
            const bonusElements = li.querySelectorAll('.bonuses > .bonus i[title]');
            bonusElements.forEach(bonusEl => {
                const title = bonusEl.getAttribute('title');
                if (title) {
                    const nameMatch = title.match(/<b>(.*?)<\/b>/);
                    const valueMatch = title.match(/(\d+)%/);
                    if (nameMatch && nameMatch[1]) {
                        bonuses.push(`${nameMatch[1]} ${valueMatch ? valueMatch[0] : '(Effect)'}`);
                    }
                }
            });
            allWeaponsData.push({
                armoryid,
                name,
                damage,
                accuracy,
                bonuses: bonuses.join(', ')
            });
        });
        return allWeaponsData;
    }

    function parseArmor(listContainer) {
        const allArmorData = [];
        const armorElements = listContainer.querySelectorAll(':scope > li');
        armorElements.forEach(li => {
            const armoryid = li.querySelector('.img-wrap[data-armoryid]')?.getAttribute('data-armoryid');
            if (!armoryid) return;

            const nameEl = li.querySelector('.name.bold');
            let name = 'N/A';
            if (nameEl) {
                const nameClone = nameEl.cloneNode(true);
                nameClone.querySelectorAll('*').forEach(child => child.remove());
                name = nameClone.textContent.trim();
            }

            const armorEl = li.querySelector('i.bonus-attachment-item-defence-bonus + span');
            const armor = armorEl ? parseFloat(armorEl.textContent.trim()) : 'N/A';

            const bonuses = [];
            const bonusElements = li.querySelectorAll('.bonuses > .bonus i[title]');
            bonusElements.forEach(bonusEl => {
                const title = bonusEl.getAttribute('title');
                if (title) {
                    const nameMatch = title.match(/<b>(.*?)<\/b>/);
                    const valueMatch = title.match(/(\d+)%/);
                    if (nameMatch && nameMatch[1]) {
                        bonuses.push(`${nameMatch[1]} ${valueMatch ? valueMatch[0] : '(Effect)'}`);
                    }
                }
            });
            allArmorData.push({
                armoryid,
                name,
                armor,
                bonus: bonuses.join(', ')
            });
        });
        return allArmorData;
    }

    function sendDataToSheet(data, type) {
        return new Promise((resolve, reject) => {
            const payload = {
                type: type,
                items: data
            };
            GM_xmlhttpRequest({
                method: 'POST',
                url: GOOGLE_SHEET_URL,
                data: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: res => {
                    try {
                        const d = JSON.parse(res.responseText);
                        if (d.status === 'success') resolve(d);
                        else reject(`Script Error: ${d.message}`);
                    } catch (e) {
                        reject('Bad JSON response from Google Script.');
                    }
                },
                onerror: err => reject(`Request Error: ${JSON.stringify(err)}`)
            });
        });
    }

})();