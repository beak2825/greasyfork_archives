// ==UserScript==
// @name        Dead Frontier market price on hover | auto-copy
// @namespace   MasterJohnson
// @match       https://fairview.deadfrontier.com/*
// @grant       unsafeWindow
// @version     1.1
// @author      MasterJohnson
// @license     MIT
// @description Shows item market value on hover with dynamic border and auto-copy
// @downloadURL https://update.greasyfork.org/scripts/563054/Dead%20Frontier%20market%20price%20on%20hover%20%7C%20auto-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/563054/Dead%20Frontier%20market%20price%20on%20hover%20%7C%20auto-copy.meta.js
// ==/UserScript==

const set_timer = 1; // Delays the script execution
const copy_timer = 1; // seconds before auto-copying price

const tooltip = document.createElement('div');
tooltip.style.cssText = `
    position: absolute;
    background: linear-gradient(135deg, #222, #444);
    color: #fff;
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 6px;
    pointer-events: none;
    z-index: 9999;
    display: none;
    border: 1px solid gray; /* sharp border */
    box-sizing: border-box;
    min-width: 100px;
    text-align: center;
    font-weight: bold;
`;
document.body.appendChild(tooltip);

class MarketHover {
    constructor(tooltip) {
        this.tooltip = tooltip;
        this.pageData = unsafeWindow.globalData || {};
        this.timerId = null;
        this.currentHoverEl = null;
        this.attachListeners();

        new MutationObserver(() => this.attachListeners())
            .observe(document.body, { childList: true, subtree: true });
    }

    attachListeners() {
        document.querySelectorAll('.item:not([data-hover-added])').forEach(el => {
            el.setAttribute('data-hover-added', 'true');

            el.addEventListener('mouseenter', async e => {
                this.currentHoverEl = el;

                const type  = el.getAttribute('data-type');
                const name  = el.getAttribute('data-name') || this.pageData[type]?.name || 'Unknown Item';
                const stack = parseInt(el.getAttribute('data-quantity')) || 1;

                let total = 0;
                const unitPrice = await this.fetchUnitPrice(name);
                if (unitPrice != null) total = unitPrice * stack;

                // Border color based on total value
                let borderColor = 'gray';
                if (total >= 300000) borderColor = 'gold';
                else if (total >= 150000) borderColor = 'red';
                else if (total >= 80000)  borderColor = 'purple';
                else if (total >= 40000)  borderColor = 'blue';
                this.tooltip.style.borderColor = borderColor;

                this.tooltip.textContent = unitPrice != null
                    ? `${name}: $${total.toLocaleString()} (${copy_timer}s)`
                    : name;

                this.tooltip.style.left = `${e.pageX + 12}px`;
                this.tooltip.style.top  = `${e.pageY + 12}px`;
                this.tooltip.style.display = 'block';

                // Clear previous timer
                if (this.timerId) clearInterval(this.timerId);

                // Countdown for auto-copy
                let remaining = copy_timer;
                this.timerId = setInterval(() => {
                    if (this.currentHoverEl !== el) {
                        clearInterval(this.timerId);
                        this.timerId = null;
                        return;
                    }

                    remaining--;
                    if (remaining <= 0) {
                        clearInterval(this.timerId);
                        this.timerId = null;

                        if (unitPrice != null && this.currentHoverEl === el) {
                            navigator.clipboard.writeText(total.toFixed(2))
                                .then(() => {
                                    if (this.currentHoverEl === el) {
                                        this.tooltip.textContent = `${name}: $${total.toLocaleString()} (copied!)`;
                                    }
                                })
                                .catch(err => console.error('Copy failed', err));
                        }
                    } else {
                        if (unitPrice != null && this.currentHoverEl === el) {
                            this.tooltip.textContent = `${name}: $${total.toLocaleString()} (${remaining}s)`;
                        }
                    }
                }, 1000);
            });

            el.addEventListener('mouseleave', () => {
                this.currentHoverEl = null;
                this.tooltip.style.display = 'none';
                if (this.timerId) {
                    clearInterval(this.timerId);
                    this.timerId = null;
                }
            });
        });
    }

    async fetchUnitPrice(itemName) {
        const hash = decodeURIComponent(this.getCookie('DeadFrontierFairview') || '');
        const payload = new URLSearchParams({
            hash,
            pagetime: Math.floor(Date.now() / 1000),
            tradezone: 21,
            search: 'trades',
            searchtype: 'buyinglistitemname',
            searchname: itemName
        });

        try {
            const res = await fetch('https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': location.href,
                    'Origin': location.origin
                },
                body: payload.toString()
            });

            const text = await res.text();
            const matches = [...text.matchAll(/tradelist_\d+_price=(\d+)&.*?tradelist_\d+_quantity=(\d+)/g)]
                .map(m => Number(m[1]) / Number(m[2]))
                .sort((a,b) => a - b);

            return matches[0] ?? null;
        } catch (err) {
            console.error('fetchUnitPrice error', err);
            return null;
        }
    }

    getCookie(name) {
        const parts = document.cookie.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';')[0] : '';
    }
}

// Initialize after delay
setTimeout(() => {
    new MarketHover(tooltip);
}, set_timer * 1000);
