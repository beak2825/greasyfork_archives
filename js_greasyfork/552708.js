// ==UserScript==
// @name         Torn Profile: Torn Hub Checker
// @description  Torn Hub Safety Script
// @license Proprietary License
// @version      2.0
// @namespace    Script By John_Of_Mud 712511
// @match        https://www.torn.com/profiles.php*
// @grant        GM_xmlhttpRequest
// @connect      docs.google.com
// @connect      googleusercontent.com
// @author       Macaria [3252471] & John_Of_Mud [712511]
// @downloadURL https://update.greasyfork.org/scripts/552708/Torn%20Profile%3A%20Torn%20Hub%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/552708/Torn%20Profile%3A%20Torn%20Hub%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQmyK-R85bJr3g6fm9SigCgmIyVVGIuYZVhPLawMKo9tvT29LHY5rnd5VE5QcisZwx_3E5fG61aCBFn/pub?output=csv';
    const factionIdsPromise = fetchFactionIds();

    function injectPlaceholder() {
        const buttonsList = document.querySelector('.buttons-list');
        if (buttonsList && !document.querySelector('#torn-hub-tag')) {
            const tag = document.createElement('div');
            tag.id = 'torn-hub-tag';
            tag.textContent = 'Checking Torn Hub status...';
            tag.style.color = '#999';
            tag.style.fontWeight = 'bold';
            tag.style.textAlign = 'center';
            tag.style.marginTop = '10px';
            tag.style.fontSize = '18px';
            buttonsList.insertAdjacentElement('afterend', tag);
        }
    }

    function updateTag(isMember) {
        const tag = document.querySelector('#torn-hub-tag');
        if (tag) {
            if (isMember) {
                tag.textContent = '';
                const img = document.createElement('img');
                img.src = 'https://i.ibb.co/Hp9P58sV/Torn-Hub-Checker.png';
                img.alt = 'Member of the ';
                img.style.width = '300px';
                img.style.marginTop = '10px';
                tag.appendChild(img);
            } else {
                tag.remove();
            }
        }

        highlightAttackButton(isMember);
    }

    function highlightAttackButton(isMember) {
        const attackButton = document.querySelector('.profile-button-attack');
        if (attackButton) {
            if (isMember) {
                attackButton.style.backgroundColor = '#ff4444';
                attackButton.style.border = '2px solid #ff0000';
                attackButton.style.boxShadow = '0 0 10px red';
            } else {
                attackButton.style.backgroundColor = '#39FF14';
                attackButton.style.border = '2px solid #00FF00';
                attackButton.style.boxShadow = '0 0 15px #39FF14';
            }
            attackButton.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
        }
    }

    function tryCheckFaction() {
        const factionId = extractFactionId();
        if (!factionId) return false;

        injectPlaceholder();

        factionIdsPromise.then(ids => {
            console.log('Extracted faction ID:', factionId);
            console.log('Torn Hub faction IDs from CSV:', ids);

            const isMember = ids.includes(factionId);
            updateTag(isMember);
        }).catch(err => {
            console.error('Error fetching faction IDs:', err);
        });

        return true;
    }

    function waitAndCheck() {
        const interval = setInterval(() => {
            if (tryCheckFaction()) {
                clearInterval(interval);
            }
        }, 200);
    }

    function extractFactionId() {
        const factionSpan = Array.from(document.querySelectorAll('span[title*=" of "]'))
            .find(el => el.querySelector('a[href*="/factions.php"]'));
        if (!factionSpan) return null;

        const factionLink = factionSpan.querySelector('a[href*="/factions.php"]');
        if (!factionLink) return null;

        const href = factionLink.getAttribute('href');
        const match = href.match(/ID=(\d+)/);
        return match ? match[1] : null;
    }

    function fetchFactionIds() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: GOOGLE_SHEET_CSV_URL,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const rows = response.responseText.trim().split('\n');
                        const factionIds = rows
                            .slice(1)
                            .map(row => row.split(',')[0].trim())
                            .filter(id => /^\d+$/.test(id));
                        resolve(factionIds);
                    } else {
                        reject(new Error('Failed to fetch CSV: ' + response.status));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    waitAndCheck();
})();