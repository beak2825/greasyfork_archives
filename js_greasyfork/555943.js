// ==UserScript==
// @name         FV - Better Trades Overall
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.3
// @description  Adds (autofilled) trade icon beside the Curio Case. Replaces transfer item icon with gift box. Adds auto "Check All" on top of the trades giving x1 of each. Adds "Max Owned" label and picks the biggest number in the drop down menu for that item.
// @author       necroam
// @match        https://www.furvilla.com/profile/*
// @match        https://www.furvilla.com/trade/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555943/FV%20-%20Better%20Trades%20Overall.user.js
// @updateURL https://update.greasyfork.org/scripts/555943/FV%20-%20Better%20Trades%20Overall.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let tradeIconAdded = false;
    let checkAllState = false; // false = all 0, true = all 1

    function enhanceTradePage() {
        const recipientId = new URLSearchParams(location.search).get('recipient');
        const input = document.querySelector('input[name="recipient_id"]');
        if (recipientId && input && !input.value) {
            input.value = recipientId;
        }

        // --- Global Check All toggle ---
        const tableWrapper = document.querySelector('.inventory-table');
        if (tableWrapper && !document.querySelector('.serpent-all')) {
            const link = document.createElement('a');
            link.className = 'pull-right label label-primary serpent-all';
            link.href = '#';
            link.innerHTML = '<i class="fa fa-check-square-o" aria-hidden="true"></i> Check All';

            tableWrapper.parentNode.insertBefore(link, tableWrapper);

            link.addEventListener('click', function (e) {
                e.preventDefault();

                document.querySelectorAll('.inventory-table select').forEach(sel => {
                    sel.value = checkAllState ? "0" : "1";
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                });

                checkAllState = !checkAllState;
                link.innerHTML = checkAllState
                    ? '<i class="fa fa-times" aria-hidden="true"></i> Uncheck All'
                    : '<i class="fa fa-check-square-o" aria-hidden="true"></i> Check All';
            });
        }

        // --- Per-item toggle labels ---
        document.querySelectorAll('.inventory-table tr').forEach(tr => {
            if (tr.querySelector('.item-toggle')) return;

            const select = tr.querySelector('select');
            if (!select) return;

            const td = select.closest('td'); // reliable across browsers

            const label = document.createElement('a');
            label.href = '#';
            label.className = 'label label-warning item-toggle'; // Furvilla native style
            label.style.marginRight = '6px';
            label.innerHTML = '<i class="fa fa-check-square-o" aria-hidden="true"></i> Max Owned';

            td.insertBefore(label, td.firstChild);

            let toggled = false;

            label.addEventListener('click', function (e) {
                e.preventDefault();

                if (!toggled) {
                    const maxVal = select.options[select.options.length - 1].value;
                    select.value = maxVal;
                } else {
                    select.value = "0";
                }

                select.dispatchEvent(new Event('change', { bubbles: true }));
                toggled = !toggled;

                label.innerHTML = toggled
                    ? '<i class="fa fa-times" aria-hidden="true"></i> Reset'
                    : '<i class="fa fa-check-square-o" aria-hidden="true"></i> Max Owned';
            });
        });
    }

    function addTradeIcon() {
        if (tradeIconAdded) return;

        const curioLink = document.querySelector('a[href*="/curio-case/"]');
        if (!curioLink) return;

        const match = curioLink.href.match(/\/curio-case\/(\d+)/);
        if (!match) return;

        const userId = match[1];
        const curioLi = curioLink.closest('li.gallery-button');
        if (!curioLi) return;

        const tradeLi = document.createElement('li');
        tradeLi.className = 'gallery-button';

        const tradeLink = document.createElement('a');
        tradeLink.href = `/trade/new?recipient=${userId}`;
        tradeLink.title = 'Send Trade';
        tradeLink.className = 'tooltipster tooltipstered';

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-arrow-right-arrow-left';
        icon.setAttribute('aria-hidden', 'true');

        tradeLink.appendChild(icon);
        tradeLi.appendChild(tradeLink);
        curioLi.parentNode.insertBefore(tradeLi, curioLi.nextSibling);

        tradeIconAdded = true;
    }

    function replaceTransferIcons() {
        document.querySelectorAll('a[data-url*="/transfers/items/new/"] i.fa-solid.fa-arrow-right-arrow-left')
            .forEach(icon => {
                icon.className = 'fa fa-gift';
            });
    }

    function runEnhancements() {
        if (location.pathname.startsWith('/trade/new')) {
            enhanceTradePage();
        } else {
            addTradeIcon();
            replaceTransferIcons();
        }
    }

    function safeRunEnhancements() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(runEnhancements, { timeout: 1000 });
        } else {
            setTimeout(runEnhancements, 300);
        }
    }

    const observer = new MutationObserver(safeRunEnhancements);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    safeRunEnhancements();
})();