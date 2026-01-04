// ==UserScript==
// @name         Torn Bazaar Highlight deals! by srsbsns
// @namespace    http://torn.com/
// @version      2.3
// @description  Light up bazaar discounts and rainbow available $1 items!
// @author       srsbsns
// @match        *://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560832/Torn%20Bazaar%20Highlight%20deals%21%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/560832/Torn%20Bazaar%20Highlight%20deals%21%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settings = JSON.parse(localStorage.getItem('igniteSettings')) || {
        yellow: 3, yellowEnabled: true,
        orange: 10, orangeEnabled: true,
        red: 20, redEnabled: true,
        rainbowEnabled: true
    };

    GM_addStyle(`
        @keyframes inner-flicker {
            0% { box-shadow: inset 0 0 15px var(--fire-color); }
            50% { box-shadow: inset 0 0 25px var(--fire-color); }
            100% { box-shadow: inset 0 0 18px var(--fire-color); }
        }
        @keyframes rainbow-glow {
            0% { border-color: #ff0000; box-shadow: inset 0 0 30px rgba(255,0,0,0.7); }
            33% { border-color: #00ff00; box-shadow: inset 0 0 30px rgba(0,255,0,0.7); }
            66% { border-color: #0000ff; box-shadow: inset 0 0 30px rgba(0,0,255,0.7); }
            100% { border-color: #ff0000; box-shadow: inset 0 0 30px rgba(255,0,0,0.7); }
        }

        .ignite-active { position: relative; overflow: hidden !important; border-radius: 4px; z-index: 1; }
        .ignite-yellow { --fire-color: rgba(255, 255, 0, 0.4); border: 2px solid #ffff00 !important; box-shadow: inset 0 0 15px var(--fire-color); }
        .ignite-orange { --fire-color: rgba(255, 140, 0, 0.5); border: 2px solid #ff8c00 !important; box-shadow: inset 0 0 15px var(--fire-color); }
        .ignite-red { --fire-color: rgba(255, 0, 0, 0.7); border: 2px solid #ff0000 !important; animation: inner-flicker 1.5s infinite alternate ease-in-out; }
        .ignite-rainbow { animation: rainbow-glow 2s linear infinite !important; border: 3px solid #fff !important; z-index: 10 !important; }

        /* Compact UI Menu */
        #ignite-menu { position: fixed; bottom: 45px; left: 20px; z-index: 999999; background: #222; color: #ccc; border: 1px solid #444; border-radius: 5px; font-family: Tahoma, Arial, sans-serif; width: 160px; box-shadow: 0 0 10px #000; }
        #ignite-header { padding: 6px; cursor: pointer; background: #333; border-radius: 5px; font-weight: bold; font-size: 11px; text-align: center; color: #fff; }
        #ignite-content { display: none; padding: 8px; border-top: 1px solid #444; }
        .ignite-row { margin-bottom: 6px; display: flex; align-items: center; gap: 5px; font-size: 10px; }
        .ignite-row input[type="number"] { width: 32px; background: #000; color: #fff; border: 1px solid #555; text-align: center; border-radius: 2px; margin-left: auto; font-size: 10px; padding: 1px; }
        .ignite-row label { cursor: pointer; white-space: nowrap; }
        #ignite-save { width: 100%; cursor: pointer; background: #ce1111; color: #fff; border: none; padding: 5px; border-radius: 3px; font-weight: bold; font-size: 10px; margin-top: 4px; }
        #ignite-save:hover { background: #e01212; }
    `);

    function igniteDeals() {
        const items = document.querySelectorAll('li[class*="item"], [class*="bazaar-card"], [class*="item___"]');

        items.forEach(item => {
            item.classList.remove('ignite-active', 'ignite-yellow', 'ignite-orange', 'ignite-red', 'ignite-rainbow');
            if (item.querySelector('svg[class*="lock"], img[src*="lock"], [class*="locked"]')) return;

            if (settings.rainbowEnabled) {
                const spans = item.querySelectorAll('span, p, div');
                if (Array.from(spans).some(el => el.textContent.trim() === '$1')) {
                    item.classList.add('ignite-active', 'ignite-rainbow');
                    return;
                }
            }

            const possibleNodes = item.querySelectorAll('span, font');
            possibleNodes.forEach(node => {
                const text = node.textContent;
                const match = text.match(/(\d+)%/);
                if (match) {
                    const style = window.getComputedStyle(node);
                    const color = style.color;
                    const rgb = color.match(/\d+/g);
                    if (rgb && rgb.length >= 3) {
                        const r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);
                        const isDiscountGreen = (g > (r + 40)) && (g > (b + 40));
                        if (isDiscountGreen) {
                            const percent = parseInt(match[1]);
                            if (percent >= settings.red && settings.redEnabled) {
                                item.classList.add('ignite-active', 'ignite-red');
                            } else if (percent >= settings.orange && settings.orangeEnabled) {
                                item.classList.add('ignite-active', 'ignite-orange');
                            } else if (percent >= settings.yellow && settings.yellowEnabled) {
                                item.classList.add('ignite-active', 'ignite-yellow');
                            }
                        }
                    }
                }
            });
        });
    }

    const menu = document.createElement('div');
    menu.id = 'ignite-menu';
    menu.innerHTML = `
        <div id="ignite-header">🔥 Ignite Settings</div>
        <div id="ignite-content">
            <div class="ignite-row"><input type="checkbox" id="check-rainbow" ${settings.rainbowEnabled ? 'checked' : ''}><label for="check-rainbow">Rainbow $1</label></div>
            <div class="ignite-row"><input type="checkbox" id="check-red" ${settings.redEnabled ? 'checked' : ''}><label for="check-red" style="color:#ff4444;">Red %</label><input type="number" id="in-red" value="${settings.red}"></div>
            <div class="ignite-row"><input type="checkbox" id="check-orange" ${settings.orangeEnabled ? 'checked' : ''}><label for="check-orange" style="color:orange;">Orange %</label><input type="number" id="in-orange" value="${settings.orange}"></div>
            <div class="ignite-row"><input type="checkbox" id="check-yellow" ${settings.yellowEnabled ? 'checked' : ''}><label for="check-yellow" style="color:yellow;">Yellow %</label><input type="number" id="in-yellow" value="${settings.yellow}"></div>
            <button id="ignite-save">Save & Apply</button>
        </div>`;
    document.body.appendChild(menu);

    document.getElementById('ignite-header').onclick = () => {
        const c = document.getElementById('ignite-content');
        c.style.display = (c.style.display === 'block') ? 'none' : 'block';
    };

    document.getElementById('ignite-save').onclick = () => {
        settings.rainbowEnabled = document.getElementById('check-rainbow').checked;
        settings.redEnabled = document.getElementById('check-red').checked;
        settings.orangeEnabled = document.getElementById('check-orange').checked;
        settings.yellowEnabled = document.getElementById('check-yellow').checked;
        settings.red = parseFloat(document.getElementById('in-red').value);
        settings.orange = parseFloat(document.getElementById('in-orange').value);
        settings.yellow = parseFloat(document.getElementById('in-yellow').value);
        localStorage.setItem('igniteSettings', JSON.stringify(settings));
        location.reload();
    };

    const observer = new MutationObserver(() => igniteDeals());
    observer.observe(document.body, { childList: true, subtree: true });
    igniteDeals();
})();