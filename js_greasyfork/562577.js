// ==UserScript==
// @name         Torn Shop Sell Item Highlighter
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Help you sell at NPC shops!
// @author       srsbsns
// @match        https://www.torn.com/shops.php*
// @match        https://www.torn.com/bigalgunshop.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562577/Torn%20Shop%20Sell%20Item%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/562577/Torn%20Shop%20Sell%20Item%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .custom-highlight { background-color: rgba(40, 167, 69, 0.15) !important; }
        .custom-highlight li { border-left: none !important; border-right: none !important; box-shadow: none !important; }
        .img-wrap { position: relative !important; }
        .item-check-cb {
            position: absolute !important; top: 1px !important; left: 1px !important;
            z-index: 9999 !important; width: 14px !important; height: 14px !important; cursor: pointer !important;
            margin: 0 !important; padding: 0 !important;
        }
        .smart-select-li { display: block !important; margin-bottom: 12px !important; clear: both; }
        .smart-select-btn {
            background: #333; color: #fff; border: 1px solid #666; padding: 6px 12px;
            cursor: pointer; border-radius: 3px; font-size: 11px; font-weight: bold;
            text-transform: uppercase; box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .smart-select-btn:hover { background: #444; border-color: #999; }
    `;
    document.head.appendChild(style);

    function triggerEvents(el) {
        const events = ['focus', 'keydown', 'keypress', 'input', 'keyup', 'change', 'blur'];
        events.forEach(type => {
            el.dispatchEvent(new Event(type, { bubbles: true }));
        });
    }

    function init() {
        const items = document.querySelectorAll('ul.item:not(.processed)');
        items.forEach(item => {
            const idInput = item.querySelector('input[name="ID"]');
            const imgWrap = item.querySelector('li.img-wrap');
            if (!idInput || !imgWrap) return;

            const itemId = idInput.value;
            item.classList.add('processed');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'item-check-cb';

            if (localStorage.getItem('highlight_item_' + itemId)) {
                cb.checked = true;
                item.classList.add('custom-highlight');
            }

            cb.onchange = (e) => {
                e.stopPropagation();
                if (cb.checked) {
                    item.classList.add('custom-highlight');
                    localStorage.setItem('highlight_item_' + itemId, 'true');
                } else {
                    item.classList.remove('custom-highlight');
                    localStorage.removeItem('highlight_item_' + itemId);
                }
            };
            imgWrap.prepend(cb);
        });

        const sellButtons = Array.from(document.querySelectorAll('button, input[type="button"]'));
        const targetBtn = sellButtons.find(b => b.textContent.includes('SELL ITEMS') || b.value?.includes('SELL ITEMS'));

        if (targetBtn && !document.querySelector('.smart-select-btn')) {
            const sellLi = targetBtn.closest('li');
            const parentUl = sellLi?.parentElement;

            if (parentUl) {
                const newLi = document.createElement('li');
                newLi.className = 'smart-select-li';
                const btn = document.createElement('button');
                btn.className = 'smart-select-btn';
                btn.innerText = 'Select Highlighted';

                btn.onclick = (e) => {
                    e.preventDefault();
                    const highlightedRows = document.querySelectorAll('ul.item.custom-highlight');
                    let lastInput = null;

                    highlightedRows.forEach(row => {
                        const sellCb = row.querySelector('input[type="checkbox"]:not(.item-check-cb)');
                        if (sellCb && !sellCb.checked) {
                            sellCb.click();
                            lastInput = sellCb;
                        }

                        const qtyInput = row.querySelector('input.input-money[type="text"]');
                        if (qtyInput) {
                            const maxQty = qtyInput.getAttribute('data-money');
                            if (maxQty) {
                                qtyInput.value = maxQty;
                                triggerEvents(qtyInput);
                                lastInput = qtyInput;
                            }
                        }
                    });

                    // Final Kick: Focus the last item we changed to force the UI to update
                    if (lastInput) {
                        lastInput.focus();
                    }
                };

                newLi.appendChild(btn);
                parentUl.insertBefore(newLi, sellLi);
            }
        }
    }

    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
    init();
})();