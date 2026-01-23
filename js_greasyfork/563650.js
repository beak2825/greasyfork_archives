// ==UserScript==
// @name          Lestrades Hide Tiers Filter (Dropdown Menu)
// @namespace     http://tampermonkey.net/
// @version       2.0
// @description   Script to hide tiered elements of Lestrades
// @match         https://lestrades.com/wishlist/*
// @match         https://lestrades.com/*/wishlist/*
// @match         https://lestrades.com/tradables/
// @match         https://lestrades.com/*/tradables/
// @grant         GM_getValue
// @grant         GM_setValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/563650/Lestrades%20Hide%20Tiers%20Filter%20%28Dropdown%20Menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563650/Lestrades%20Hide%20Tiers%20Filter%20%28Dropdown%20Menu%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TIERS_MAPPING = {
        "Filler": ["⏪︎", "Low priority"],
        "Low Tier": ["▼", "Low tier"],
        "Mid Tier": ["■", "Mid tier"],
        "High Tier": ["▲", "High tier"],
        "Would like to get this ASAP, or get rid of it. Offers welcome!": ["⏩︎", "High priority"]
    };

    const ALL_TIERS = Object.keys(TIERS_MAPPING);
    let bannedTitles = new Set(GM_getValue('lestradesFilteredTiers', []));
    let hideAllTiers = GM_getValue('lestradesHideAllTiers', false);

    const styleEl = document.createElement('style');
    const filterStyleEl = document.createElement('style');
    document.head.append(styleEl, filterStyleEl);

    styleEl.textContent = `
        .lestrades-dropdown .item {
            padding: 4px 8px !important;
            font-size: 14px;
            cursor: pointer;
            white-space: nowrap;
            display: flex;
            align-items: center;
        }
        .lestrades-dropdown .tier-icon {
            display: inline-block;
            width: 15px;
            flex-shrink: 0;
        }
        .lestrades-dropdown .item:hover { background-color: #1a1a1a !important; }
        .lestrades-dropdown .selected { background-color: #404040 !important; }
        .lestrades-dropdown .items {
            display: none; position: absolute; top: 100%; left: 0; width: 112px;
            background: #0d0d0d; border: 1px solid #383a42; border-radius: 6px; z-index: 999;
        }
        .lestrades-dropdown.open .items { display: block; }
    `;

    const applyFilterCSS = () => {
        if (bannedTitles.size > 0) {
            filterStyleEl.textContent = [...bannedTitles]
                .map(tier => `tr.img:has(span[title="${tier}"]) { display: none !important; }`)
                .join('\n');
        } else {
            filterStyleEl.textContent = '';
        }
        updateUI();
    };

    const updateUI = () => {
        const container = document.querySelector('.lestrades-dropdown');
        if (!container) return;

        const count = bannedTitles.size;
        const display = container.querySelector('.display .text');

        display.innerHTML = count > 0
            ? `<span style="font-size:14px;color:#fff;">${count} hidden tier${count > 1 ? 's' : ''}</span>`
            : `<span class="premium">Hide Tiers</span>`;

        container.querySelectorAll('.item').forEach(el => {
            const tier = el.dataset.tier;
            if (tier) {
                el.classList.toggle('selected', bannedTitles.has(tier));
            } else if (el.classList.contains('hide-all')) {
                el.classList.toggle('selected', hideAllTiers);
            }
        });
    };

    const createDropdown = () => {
        const div = document.createElement('div');
        div.className = 'sbox lestrades-dropdown';
        div.style.cssText = 'margin-left:10px; margin-bottom: 5px; position:relative;';

        div.innerHTML = `
            <div class="display" style="cursor:pointer; height:24px; display:flex; align-items:center; justify-content:space-between; padding: 1 8px;">
                <div class="text"></div>
                <div class="btn" style="font-size:10px; margin-left:4px;">▼</div>
            </div>
            <div class="items">
                <div class="item hide-all" style="font-weight:500; border-bottom: 1px solid #333; margin-bottom: 4px;">Hide all tiers</div>
                ${ALL_TIERS.map(t => `
                    <div class="item tier-item" data-tier="${t}">
                        <span class="tier-icon">${TIERS_MAPPING[t][0]}</span>
                        <span class="tier-text">${TIERS_MAPPING[t][1]}</span>
                    </div>`).join('')}
            </div>
        `;

        div.querySelector('.display').onclick = (e) => {
            e.stopPropagation();
            const isOpen = div.classList.toggle('open');
            div.querySelector('.btn').textContent = isOpen ? '▲' : '▼';
        };

        div.addEventListener('click', (e) => {
            const item = e.target.closest('.item');
            if (!item) return;
            e.stopPropagation();

            if (item.classList.contains('hide-all')) {
                hideAllTiers = !hideAllTiers;
                bannedTitles = hideAllTiers ? new Set(ALL_TIERS) : new Set();
            } else {
                const tier = item.dataset.tier;
                bannedTitles.has(tier) ? bannedTitles.delete(tier) : bannedTitles.add(tier);
                hideAllTiers = bannedTitles.size === ALL_TIERS.length;
            }

            GM_setValue('lestradesFilteredTiers', [...bannedTitles]);
            GM_setValue('lestradesHideAllTiers', hideAllTiers);
            applyFilterCSS();
        });

        return div;
    };

    const init = setInterval(() => {
        const label = [...document.querySelectorAll('label')].find(l => l.textContent.includes('Show banners'));
        if (label) {
            label.after(createDropdown());
            applyFilterCSS();
            document.addEventListener('click', () => {
                const dropdown = document.querySelector('.lestrades-dropdown');
                if (dropdown) {
                    dropdown.classList.remove('open');
                    dropdown.querySelector('.btn').textContent = '▼';
                }
            });
            clearInterval(init);
        }
    }, 200);
})();