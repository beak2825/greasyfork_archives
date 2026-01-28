// ==UserScript==

// @name         DF Deposit/withdraw (faster)
// @author       MasterJohnson
// @namespace    MasterJohnson
// @version      1.0
// @description  Deposit/withdraw buttons on every page.
// @match        https://fairview.deadfrontier.com/onlinezombiemmo*
// @license      MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/564292/DF%20Depositwithdraw%20%28faster%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564292/DF%20Depositwithdraw%20%28faster%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    if (window.location.search.includes('page=15')) return;
    if (document.getElementById('fairview-iframe')) return;

    const iframe = document.createElement('iframe');
    iframe.id = 'fairview-iframe';
    iframe.src = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.addEventListener('load', () => {
        const win = iframe.contentWindow;
        const doc = iframe.contentDocument;

        const waitForReady = setInterval(() => {
            if (
                typeof win.deposit !== 'function' ||
                typeof win.withdraw !== 'function' ||
                !doc.getElementById('deposit') ||
                !doc.getElementById('withdraw')
            ) return;

            clearInterval(waitForReady);

            const panel = document.createElement('div');
            Object.assign(panel.style, {
                position: 'absolute',
                top: '200px',
                left: '1450px',
                padding: '10px',
                background: '#111',
                border: '2px solid #444',
                zIndex: '9999',
                color: '#fff',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            });

            const updateCashAndReload = () => {
                const parentSpan = document.querySelector('.heldCash.cashhack');
                if (!parentSpan) return;

                const oldValue = parentSpan.dataset.cash;
                const checkInterval = setInterval(() => {
                    const iframeCashSpan = doc.querySelector('.heldCash');
                    if (!iframeCashSpan) return;
                    const newCash = iframeCashSpan.textContent.trim();
                    if (newCash !== oldValue) {
                        parentSpan.dataset.cash = newCash;
                        parentSpan.textContent = newCash;
                        clearInterval(checkInterval);
                        location.reload();
                    }
                }, 50);
            };

            const createBtn = (text, onClick) => {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.style.width = '120px';
                btn.onclick = onClick;
                return btn;
            };

            panel.appendChild(createBtn('Withdraw 50k', () => {
                doc.getElementById('withdraw').value = 50000;
                win.lockInput(1);
                win.withdraw();
                updateCashAndReload();
            }));

            panel.appendChild(createBtn('Withdraw 150k', () => {
                doc.getElementById('withdraw').value = 150000;
                win.lockInput(1);
                win.withdraw();
                updateCashAndReload();
            }));

            panel.appendChild(createBtn('Withdraw 1kk', () => {
                doc.getElementById('withdraw').value = 1000000;
                win.lockInput(1);
                win.withdraw();
                updateCashAndReload();
            }));

            panel.appendChild(createBtn('Withdraw All', () => {
                win.withdraw(1);
                updateCashAndReload();
            }));

            panel.appendChild(createBtn('Deposit All', () => {
                win.deposit(1);
                updateCashAndReload();
            }));

            document.body.appendChild(panel);
        }, 50);
    });
})();
