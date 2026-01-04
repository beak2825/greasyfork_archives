// ==UserScript==
// @name         Arson Action Tracker
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Tracks successful Place, Stoke, Dampen actions.
// @author       Allenone[2033011]
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/553144/Arson%20Action%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/553144/Arson%20Action%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let data = GM_getValue('arsonCounts', {}) || {};

    function getTargetKey(targetCard) {
        const title = targetCard.querySelector('.titleAndScenario___uWExi > div:first-child')?.textContent.trim();
        const scenario = targetCard.querySelector('.titleAndScenario___uWExi .scenario___msSka')?.textContent.trim();
        return title && scenario ? `${title} - ${scenario}` : null;
    }

    function updateCounters(div, counts) {
        if (!counts) {
            div.innerHTML = '';
            return;
        }
        div.innerHTML = `
            Placed: ${counts.placed}<br>
            Stoked: ${counts.stoked}<br>
            Dampened: ${counts.dampened}
        `;
    }

    function attachToTarget(targetCard) {
        const key = getTargetKey(targetCard);
        if (!key) return;

        if (!data[key]) data[key] = { placed: 0, stoked: 0, dampened: 0 };

        // Find or create counter display
        let countersDiv = targetCard.querySelector('.custom-counters');
        if (!countersDiv) {
            countersDiv = document.createElement('div');
            countersDiv.className = 'custom-counters';
            Object.assign(countersDiv.style, {
                fontSize: 'smaller',
                lineHeight: '1.2',
                paddingLeft: 'inherit',
                textAlign: 'right',
                minWidth: '80px',
                marginLeft: 'auto',
                paddingRight: '4px',
                whiteSpace: 'nowrap'
            });

            const titleSection = targetCard.querySelector('.titleSection___CiZ8O');
            if (titleSection) {
                titleSection.appendChild(countersDiv);
                titleSection.style.display = 'flex';
                titleSection.style.alignItems = 'center';
                titleSection.style.justifyContent = 'space-between';
            }
        }

        updateCounters(countersDiv, data[key]);

        // Watch commit button
        const commitBtn = targetCard.querySelector('.commitButton___NYsg8');
        if (commitBtn && !commitBtn.dataset.listenerAdded) {
            commitBtn.addEventListener('click', () => {
                // Determine intended action
                let action = '';
                const actionSpan = commitBtn.querySelector('.title___kEtkc');
                if (actionSpan) {
                    action = actionSpan.textContent.trim().toLowerCase();
                } else if (commitBtn.ariaLabel) {
                    action = commitBtn.ariaLabel.split(',')[0].trim().toLowerCase();
                }

                // Watch for outcome after click
                const outcomeWrapper = targetCard.querySelector('.outcomeWrapper___I8dXb');
                if (!outcomeWrapper) return;

                const observer = new MutationObserver((mutations, obs) => {
                    const outcomeText = outcomeWrapper.querySelector('.outcomeReward___E34U7 .title___IrNe6')?.textContent.trim().toLowerCase();
                    if (outcomeText) {
                        if (outcomeText.includes('success')) {
                            if (action.includes('place')) data[key].placed++;
                            else if (action.includes('stoke')) data[key].stoked++;
                            else if (action.includes('dampen')) data[key].dampened++;
                            else if (action.includes('collect')) {
                                delete data[key];
                                GM_setValue('arsonCounts', data);
                                updateCounters(countersDiv, null);
                                obs.disconnect();
                                return;
                            }
                            updateCounters(countersDiv, data[key]);
                            GM_setValue('arsonCounts', data);
                        }
                        obs.disconnect();
                    }
                });

                observer.observe(outcomeWrapper, { childList: true, subtree: true });
            });

            commitBtn.dataset.listenerAdded = 'true';
        }
    }

    function init() {
        const targets = document.querySelectorAll('.virtualList___noLef .virtualItem___BLyAl');
        targets.forEach(target => {
            if (!target.dataset.processed) {
                attachToTarget(target);
                target.dataset.processed = 'true';
            }
        });
    }

    const observer = new MutationObserver(() => init());
    observer.observe(document.body, { childList: true, subtree: true });

    init();
})();
