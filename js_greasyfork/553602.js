// ==UserScript==
// @name         CM Summary - Cardmarket summary with PSA/CGC/Beckett details
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  Show the grading table only if there are graded cards. Total cards always visible. © Woody
// @author       Woody
// @match        https://www.cardmarket.com/*/Products/Singles/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553602/CM%20Summary%20-%20Cardmarket%20summary%20with%20PSACGCBeckett%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/553602/CM%20Summary%20-%20Cardmarket%20summary%20with%20PSACGCBeckett%20details.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function calcolaSomma() {
        const body = document.querySelector('.table-body');
        if (!body) return;

        let total = 0;
        let psa10 = 0, psa9 = 0, bgs10 = 0, bgs9 = 0, cgc10 = 0, cgc9 = 0, beckett10 = 0, beckett9 = 0;
        let minPSA10 = null, minPSA9 = null, minBGS10 = null, minBGS9 = null;
        let minCGC10 = null, minCGC9 = null, minBeckett10 = null, minBeckett9 = null;
        let found = {};

        let counting = true;
        const rows = Array.from(body.children);
        const hasDivider = rows.some(row => row.classList.contains('divider-row'));
        if (hasDivider) counting = false;

        for (const row of rows) {
            row.style.backgroundColor = ''; // reset stile

            if (row.classList.contains('divider-row')) {
                counting = true;
                continue;
            }
            if (!counting) continue;

            const amountDiv = row.querySelector('.amount-container');
            const qty = amountDiv ? parseInt(amountDiv.textContent.trim(), 10) : 0;
            if (isNaN(qty)) continue;

            total += qty;

            const commentDivs = row.querySelectorAll('.d-block');
            const flags = {
                PSA10: false, PSA9: false,
                BGS10: false, BGS9: false,
                CGC10: false, CGC9: false,
                BECKETT10: false, BECKETT9: false
            };

            commentDivs.forEach(div => {
                const text = div.textContent;
                if (/PSA\s*10/i.test(text)) flags.PSA10 = true;
                else if (/PSA\s*9/i.test(text)) flags.PSA9 = true;
                else if (/BGS\s*10/i.test(text)) flags.BGS10 = true;
                else if (/BGS\s*9/i.test(text)) flags.BGS9 = true;
                else if (/CGC\s*10/i.test(text)) flags.CGC10 = true;
                else if (/CGC\s*9/i.test(text)) flags.CGC9 = true;
                else if (/BECKETT\s*10/i.test(text)) flags.BECKETT10 = true;
                else if (/BECKETT\s*9/i.test(text)) flags.BECKETT9 = true;
            });

            const priceDiv = row.querySelector('[class*="price-container"]');
            const priceText = priceDiv ? priceDiv.textContent.trim() : null;

            if (flags.PSA10) { psa10 += qty; if (!found.PSA10 && priceText) { minPSA10 = priceText; found.PSA10 = true; } }
            else if (flags.PSA9) { psa9 += qty; if (!found.PSA9 && priceText) { minPSA9 = priceText; found.PSA9 = true; } }
            else if (flags.BGS10) { bgs10 += qty; if (!found.BGS10 && priceText) { minBGS10 = priceText; found.BGS10 = true; } }
            else if (flags.BGS9) { bgs9 += qty; if (!found.BGS9 && priceText) { minBGS9 = priceText; found.BGS9 = true; } }
            else if (flags.CGC10) { cgc10 += qty; if (!found.CGC10 && priceText) { minCGC10 = priceText; found.CGC10 = true; } }
            else if (flags.CGC9) { cgc9 += qty; if (!found.CGC9 && priceText) { minCGC9 = priceText; found.CGC9 = true; } }
            else if (flags.BECKETT10) { beckett10 += qty; if (!found.BECKETT10 && priceText) { minBeckett10 = priceText; found.BECKETT10 = true; } }
            else if (flags.BECKETT9) { beckett9 += qty; if (!found.BECKETT9 && priceText) { minBeckett9 = priceText; found.BECKETT9 = true; } }
        }

        const totalPSA = psa10 + psa9;
        const totalBGS = bgs10 + bgs9;
        const totalCGC = cgc10 + cgc9;
        const totalBeckett = beckett10 + beckett9;

        const resultDivId = 'gpt-total-result';
        let resultDiv = document.querySelector('#' + resultDivId);
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = resultDivId;
            resultDiv.style.fontSize = '1em';
            resultDiv.style.fontWeight = 'bold';
            resultDiv.style.backgroundColor = '#1d1f26';
            resultDiv.style.color = '#7fa6fe';
            resultDiv.style.lineHeight = '1.6em';
            const tableWrapper = body.closest('table')?.parentElement || body.parentElement;
            tableWrapper.insertBefore(resultDiv, tableWrapper.firstChild);
        }

        const logos = {
            PSA: 'https://resource.globenewswire.com/Resource/Download/2b2b9b80-3042-4536-9067-e23a3e838652',
            BGS: 'https://primary.jwwb.nl/public/n/d/s/temp-fboxcycsszupuhrhmhwl/uqd7uq/beckettlogo.png',
            CGC: 'https://canadacomicpressing.com/assets/images/cgc.png',
            BECKETT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Beckett_logo.png/320px-Beckett_logo.png'
        };

        const logoImg = (src, alt = "", size = 30) =>
            `<img src="${src}" alt="${alt}" style="height:${size}px; vertical-align:middle; margin-right:6px;">`;

        // Sempre visibile il totale carte
        let html = `
        <div style="margin-bottom: 0.8em;">
            <strong>Total number of cards on sale:</strong> <span style="color: white;">${total}</span>
        </div>`;

        // Mostra tabella solo se esistono gradate
        if (totalPSA + totalBGS + totalCGC + totalBeckett > 0) {
            html += `
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 2px solid #7fa6fe;">
                        <th style="padding: 0.5em;">🏷️ Grading</th>
                        <th style="padding: 0.5em;">📦 Quantity</th>
                        <th style="padding: 0.5em;">💰 Min. Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${totalPSA > 0 ? `
                    <tr><td colspan="3" style="padding: 0.6em; font-weight: bold; color: #7fa6fe;">
                        ${logoImg(logos.PSA, 'PSA')} (${totalPSA})
                    </td></tr>
                    <tr><td>PSA 10</td><td style="color:white;">${psa10}</td><td style="color:white;">${minPSA10 || 'N/D'}</td></tr>
                    <tr><td>PSA 9</td><td style="color:white;">${psa9}</td><td style="color:white;">${minPSA9 || 'N/D'}</td></tr>` : ''}

                    ${totalBGS > 0 ? `
                    <tr><td colspan="3" style="padding: 0.6em; font-weight: bold; color: #7fa6fe;">
                        ${logoImg(logos.BGS, 'BGS')} (${totalBGS})
                    </td></tr>
                    <tr><td>BGS 10</td><td style="color:white;">${bgs10}</td><td style="color:white;">${minBGS10 || 'N/D'}</td></tr>
                    <tr><td>BGS 9</td><td style="color:white;">${bgs9}</td><td style="color:white;">${minBGS9 || 'N/D'}</td></tr>` : ''}

                    ${totalCGC > 0 ? `
                    <tr><td colspan="3" style="padding: 0.6em; font-weight: bold; color: #7fa6fe;">
                        ${logoImg(logos.CGC, 'CGC')} (${totalCGC})
                    </td></tr>
                    <tr><td>CGC 10</td><td style="color:white;">${cgc10}</td><td style="color:white;">${minCGC10 || 'N/D'}</td></tr>
                    <tr><td>CGC 9</td><td style="color:white;">${cgc9}</td><td style="color:white;">${minCGC9 || 'N/D'}</td></tr>` : ''}

                    ${totalBeckett > 0 ? `
                    <tr><td colspan="3" style="padding: 0.6em; font-weight: bold; color: #7fa6fe;">
                        ${logoImg(logos.BECKETT, 'Beckett')} (${totalBeckett})
                    </td></tr>
                    <tr><td>Beckett 10</td><td style="color:white;">${beckett10}</td><td style="color:white;">${minBeckett10 || 'N/D'}</td></tr>
                    <tr><td>Beckett 9</td><td style="color:white;">${beckett9}</td><td style="color:white;">${minBeckett9 || 'N/D'}</td></tr>` : ''}
                </tbody>
            </table>`;
        }

        resultDiv.innerHTML = html;
    }

    function setupObserver() {
        const body = document.querySelector('.table-body');
        if (!body) return;
        const observer = new MutationObserver(() => calcolaSomma());
        observer.observe(body, { childList: true, subtree: false });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            calcolaSomma();
            setupObserver();
        }, 1500);
    });
})();
