// ==UserScript==
// @name         Bergziegen panoid applier (Ä)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  mma script
// @author       BennoGHG
// @match        https://map-making.app/maps/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549063/Bergziegen%20panoid%20applier%20%28%C3%84%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549063/Bergziegen%20panoid%20applier%20%28%C3%84%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dropdownSelector = 'button[role="combobox"]';
    const bannedKeywords = ['badcam', 'unofficial', 'default'];
    const delay = 10;

    function isTyping(target) {
        return !!(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable));
    }

    function waitForOptions(timeout = 100) {
        return new Promise(resolve => {
            const start = Date.now();
            (function check() {
                const opts = Array.from(document.querySelectorAll('div[role="option"]'))
                    .filter(o => {
                        try {
                            const rect = o.getBoundingClientRect();
                            return rect.width > 0 && rect.height > 0;
                        } catch (e) {
                            return true;
                        }
                    });
                if (opts.length > 0) return resolve(opts);
                if (Date.now() - start > timeout) return resolve([]);
                setTimeout(check, 5);
            })();
        });
    }

    async function selectDropdownOption() {
        const options = await waitForOptions();
        if (!options.length) {
            const dropdown = document.querySelector(dropdownSelector);
            if (dropdown) {
                dropdown.blur();
                setTimeout(() => {
                    dropdown.focus();
                    setTimeout(() => {
                        const escEvent = new KeyboardEvent('keydown', {
                            key: 'Escape',
                            bubbles: true,
                            cancelable: true
                        });
                        document.dispatchEvent(escEvent);
                        setTimeout(() => {
                            ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                                const event = new MouseEvent(eventType, {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    buttons: 1
                                });
                                dropdown.dispatchEvent(event);
                            });
                        }, 20);
                    }, 20);
                }, 20);
            }
            return;
        }

        const candidates = options
            .map(opt => {
                const text = (opt.innerText || opt.textContent || '').trim().toLowerCase();
                const m = text.match(/\b(20[0-9]{2})\b/);
                const num = m ? parseInt(m[1], 10) : null;
                const isBadcam = bannedKeywords.some(keyword => text.includes(keyword));
                return { el: opt, text, num, isBadcam };
            })
            .filter(item => item.num)
            .sort((a, b) => b.num - a.num);

        if (!candidates.length) return;

        const goodCandidates = candidates.filter(item => !item.isBadcam);

        if (goodCandidates.length > 0) {
            goodCandidates[0].el.click();
        } else {
            candidates[0].el.click();
        }
    }

    document.addEventListener('keydown', function(event) {
        const target = event.target;
        if (isTyping(target)) return;

        if (event.key === 'ä' || event.key === 'Ä') {
            const dropdowns = document.querySelectorAll(dropdownSelector);
            if (!dropdowns.length) return;

            let targetDropdown = null;
            for (const dropdown of dropdowns) {
                const isOpen = dropdown.getAttribute('aria-expanded') === 'true' ||
                              dropdown.getAttribute('data-state') === 'open';
                if (!isOpen) {
                    targetDropdown = dropdown;
                    break;
                }
            }

            if (!targetDropdown && dropdowns.length > 0) {
                targetDropdown = dropdowns[0];
            }

            if (!targetDropdown) return;

            const tryClick = (element) => {
                element.click();
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    const event = new MouseEvent(eventType, {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        buttons: 1
                    });
                    element.dispatchEvent(event);
                });
                element.focus();
                ['Enter', ' '].forEach(key => {
                    const keyEvent = new KeyboardEvent('keydown', {
                        key: key,
                        bubbles: true,
                        cancelable: true
                    });
                    element.dispatchEvent(keyEvent);
                });
            };

            if (targetDropdown.getAttribute('aria-expanded') === 'true') {
                tryClick(targetDropdown);
                setTimeout(() => {
                    tryClick(targetDropdown);
                    setTimeout(selectDropdownOption, delay);
                }, 50);
            } else {
                tryClick(targetDropdown);
                setTimeout(selectDropdownOption, delay);
            }
        }
    });

})();