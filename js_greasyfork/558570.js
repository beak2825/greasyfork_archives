// ==UserScript==
// @name         Multisellect + AutoSell Inventario
// @description  Multi-select + Auto Sell com Vendor novo (robusto)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @match        https://degenidle.com/game/inventory*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558570/Multisellect%20%2B%20AutoSell%20Inventario.user.js
// @updateURL https://update.greasyfork.org/scripts/558570/Multisellect%20%2B%20AutoSell%20Inventario.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let multiSelectMode = false;
    let selectedItems = new Set();

    /* ================= UTIL ================= */

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function waitFor(fn, timeout = 6000, interval = 200) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const res = fn();
            if (res) return res;
            await sleep(interval);
        }
        return null;
    }

    /* ================= UI ================= */

    function injectButtons() {
        const partyBoardBtn = document.querySelector('button[title="Party Board"]');
        if (!partyBoardBtn) return;

        const column = partyBoardBtn.closest('div.w-\\[50px\\]');
        if (!column) return;

        /* ===== BOTÃO 1 ===== */
        if (!document.getElementById('custom-btn-1')) {
            const btn1 = document.createElement('button');
            btn1.id = 'custom-btn-1';
            btn1.textContent = '1';
            btn1.className =
                "w-9 h-9 rounded-lg bg-[#1E2330] hover:bg-[#252B3B] " +
                "flex items-center justify-center text-indigo-400 font-bold border border-[#2A3041]";

            btn1.onclick = () => {
                multiSelectMode = !multiSelectMode;
                btn1.textContent = multiSelectMode ? '1*' : '1';
                btn1.style.borderColor = multiSelectMode ? 'lime' : '#2A3041';

                if (!multiSelectMode) {
                    document.querySelectorAll('.inventory-item-selected').forEach(el => {
                        el.classList.remove('inventory-item-selected');
                        el.style.outline = '';
                    });
                    selectedItems.clear();
                }
            };

            partyBoardBtn.insertAdjacentElement('afterend', btn1);
        }

        /* ===== BOTÃO 2 ===== */
        if (!document.getElementById('custom-btn-2')) {
            const btn2 = document.createElement('button');
            btn2.id = 'custom-btn-2';
            btn2.textContent = '2';
            btn2.className =
                "w-9 h-9 rounded-lg bg-[#1E2330] hover:bg-[#252B3B] " +
                "flex items-center justify-center text-indigo-400 font-bold border border-[#2A3041]";

            const btn1 = document.getElementById('custom-btn-1');
            btn1.insertAdjacentElement('afterend', btn2);

            btn2.onclick = async () => {
                if (selectedItems.size === 0) {
                    alert('Nenhum item selecionado.');
                    return;
                }

                console.log('[AutoSell] Iniciado');

                multiSelectMode = false;
                btn1.textContent = '1';
                btn1.style.borderColor = '#2A3041';

                const itemsToProcess = Array.from(selectedItems);

                itemsToProcess.forEach(it => {
                    it.classList.remove('inventory-item-selected');
                    it.style.outline = '';
                });

                for (const slot of itemsToProcess) {
                    try {
                        console.log('[AutoSell] Item');

                        /* 1. abrir item */
                        slot.click();
                        await sleep(350);

                        /* 2. clicar aba Vendor (header) */
                        const vendorTab = await waitFor(() =>
                            [...document.querySelectorAll('button')]
                                .find(b => b.textContent.trim() === 'Vendor' &&
                                    b.parentElement?.className.includes('flex'))
                        );

                        if (!vendorTab) {
                            console.warn('[AutoSell] Aba Vendor não encontrada');
                            continue;
                        }

                        vendorTab.click();
                        console.log('[AutoSell] Aba Vendor');
                        await sleep(350);

                        /* 3. botão Vendor AMARELO (rodapé, segundo botão) */
                        const footer = await waitFor(() =>
                            [...document.querySelectorAll('div.flex.gap-3')].pop()
                        );

                        const vendorBtn = footer?.querySelectorAll('button')[1];

                        if (!vendorBtn) {
                            console.warn('[AutoSell] Botão Vendor amarelo não encontrado');
                            continue;
                        }

                        vendorBtn.click();
                        console.log('[AutoSell] Vendor amarelo');
                        await sleep(350);

                        /* 4. confirmar venda */
                        const confirmBtn = await waitFor(() =>
                            [...document.querySelectorAll('button')]
                                .find(b => b.textContent.trim() === 'Confirm Sell')
                        );

                        if (!confirmBtn) {
                            console.warn('[AutoSell] Confirm Sell não encontrado');
                            continue;
                        }

                        confirmBtn.click();
                        console.log('[AutoSell] Confirmado');
                        await sleep(350);

                        /* 5. fechar modal (X) */
                        const closeBtn = document.querySelector("button svg.lucide-x")?.closest('button');
                        if (closeBtn) {
                            closeBtn.click();
                            await sleep(200);
                        }

                        selectedItems.delete(slot);
                        console.log('[AutoSell] OK');

                    } catch (e) {
                        console.error('[AutoSell] Erro:', e);
                        selectedItems.delete(slot);
                    }
                }

                alert('Auto Sell finalizado.');
                console.log('[AutoSell] Concluído');
            };
        }
    }

    /* ================= INVENTORY ================= */

    function bindInventoryClicks() {
        document.querySelectorAll('.grid > div').forEach(item => {
            if (item.dataset.multiBound) return;
            item.dataset.multiBound = '1';

            item.addEventListener('click', e => {
                if (!multiSelectMode) return;

                e.preventDefault();
                e.stopPropagation();

                if (selectedItems.has(item)) {
                    selectedItems.delete(item);
                    item.classList.remove('inventory-item-selected');
                    item.style.outline = '';
                } else {
                    selectedItems.add(item);
                    item.classList.add('inventory-item-selected');
                    item.style.outline = '3px solid #60a5fa';
                }
            });
        });
    }

    /* ================= CSS ================= */

    const style = document.createElement('style');
    style.textContent = `
        .inventory-item-selected {
            transform: scale(1.02);
            transition: transform .06s;
        }
    `;
    document.head.appendChild(style);

    /* ================= OBSERVER ================= */

    const observer = new MutationObserver(() => {
        injectButtons();
        bindInventoryClicks();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        injectButtons();
        bindInventoryClicks();
    }, 800);

})();
