// ==UserScript==
// @name         P3 - User Shop Auto Buyer
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Auto-buy items via AJAX on any user shop page with filters, persistent settings, fade effect, page looping, and completion alert. Properly respects Buy Qty.
// @match        https://pocketpumapets.com/user_shop.php*
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555356/P3%20-%20User%20Shop%20Auto%20Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/555356/P3%20-%20User%20Shop%20Auto%20Buyer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Load saved settings ---
    const savedSettings = JSON.parse(localStorage.getItem('autoBuyerSettings') || '{}');

    // --- UI Setup ---
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '100px';
    panel.style.right = '15px';
    panel.style.zIndex = '99999';
    panel.style.background = 'rgba(0,0,0,0.85)';
    panel.style.border = '2px solid #ccc';
    panel.style.borderRadius = '10px';
    panel.style.padding = '10px';
    panel.style.fontSize = '13px';
    panel.style.color = 'white';
    panel.style.width = '200px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';

    const title = document.createElement('div');
    title.textContent = '🛒 Auto Buyer';
    title.style.fontWeight = 'bold';
    title.style.textAlign = 'center';
    title.style.marginBottom = '6px';

    const qtyLabel = document.createElement('label'); qtyLabel.textContent = 'Buy Qty:'; qtyLabel.style.display='block';
    const qtyBox = document.createElement('input'); qtyBox.type='number'; qtyBox.min='1'; qtyBox.value=savedSettings.qty || '1'; qtyBox.style.width='100%'; qtyBox.style.marginBottom='6px';

    const ownedLabel = document.createElement('label'); ownedLabel.textContent='Buy if Owned ≤'; ownedLabel.style.display='block';
    const ownedBox = document.createElement('input'); ownedBox.type='number'; ownedBox.min='0'; ownedBox.value=savedSettings.owned || '0'; ownedBox.style.width='100%'; ownedBox.style.marginBottom='6px';

    const priceLabel = document.createElement('label'); priceLabel.textContent='Buy if Price ≤'; priceLabel.style.display='block';
    const priceBox = document.createElement('input'); priceBox.type='number'; priceBox.min='0'; priceBox.value=savedSettings.price || ''; priceBox.placeholder='Puma Pence'; priceBox.style.width='100%'; priceBox.style.marginBottom='6px';

    const ppContainer = document.createElement('div'); ppContainer.style.marginBottom='8px';
    const ppToggle = document.createElement('input'); ppToggle.type='checkbox'; ppToggle.id='ppOnlyToggle'; ppToggle.checked = savedSettings.ppOnly || false;
    const ppLabel = document.createElement('label'); ppLabel.textContent=' PP only'; ppLabel.setAttribute('for','ppOnlyToggle');
    ppContainer.append(ppToggle, ppLabel);

    const startBtn = document.createElement('button');
    startBtn.textContent='▶ Start';
    startBtn.style.width='48%';
    startBtn.style.marginRight='4%';
    startBtn.style.padding='3px';
    startBtn.style.cursor='pointer';
    startBtn.style.background='#28a745';
    startBtn.style.color='white';
    startBtn.style.border='none';
    startBtn.style.borderRadius='5px';
    startBtn.style.transition = 'opacity 0.5s ease';

    const stopBtn = document.createElement('button');
    stopBtn.textContent='⏹ Stop';
    stopBtn.style.width='48%';
    stopBtn.style.padding='3px';
    stopBtn.style.cursor='pointer';
    stopBtn.style.background='#dc3545';
    stopBtn.style.color='white';
    stopBtn.style.border='none';
    stopBtn.style.borderRadius='5px';
    stopBtn.disabled=true;

    const btnContainer = document.createElement('div'); btnContainer.style.textAlign='center'; btnContainer.append(startBtn, stopBtn);

    const counterDiv = document.createElement('div'); counterDiv.textContent='Bought: 0'; counterDiv.style.textAlign='center'; counterDiv.style.marginTop='6px'; counterDiv.style.fontWeight='bold';

    panel.append(title, qtyLabel, qtyBox, ownedLabel, ownedBox, priceLabel, priceBox, ppContainer, btnContainer, counterDiv);
    document.body.appendChild(panel);

    // --- Logic ---
    let running = false;
    let boughtCount = 0;

    [qtyBox, ownedBox, priceBox, ppToggle].forEach(el => {
        el.addEventListener('input', saveSettings);
        el.addEventListener('change', saveSettings);
    });

    function saveSettings() {
        const settings = {
            qty: qtyBox.value,
            owned: ownedBox.value,
            price: priceBox.value,
            ppOnly: ppToggle.checked
        };
        localStorage.setItem('autoBuyerSettings', JSON.stringify(settings));
    }

    startBtn.addEventListener('click', () => {
        running = true;
        boughtCount = 0;
        counterDiv.textContent = 'Bought: 0';
        startBtn.style.opacity = '0.3';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        loopPages();
    });

    stopBtn.addEventListener('click', () => {
        running = false;
        startBtn.style.opacity = '1';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });

    async function loopPages() {
        while (running) {
            await autoBuy();

            // Find next page
            const nextPageOption = document.querySelector('select[title="Select Page"] option[selected]')?.nextElementSibling;
            if (nextPageOption) {
                const nextUrl = nextPageOption.value;
                try {
                    const res = await fetch(nextUrl, {credentials: 'include'});
                    const htmlText = await res.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    const newItems = doc.querySelector('#main');
                    if (newItems) {
                        document.querySelector('#main').innerHTML = newItems.innerHTML;
                    }
                } catch(e){
                    console.error('Failed to load next page', e);
                    break;
                }
            } else {
                break; // No more pages
            }
        }

        running = false;
        startBtn.style.opacity = '1';
        startBtn.disabled = false;
        stopBtn.disabled = true;

        // --- Notify user ---
        alert(`Auto Buyer finished! Total items bought: ${boughtCount}`);
    }

    async function autoBuy() {
        const items = [...document.querySelectorAll('div.usershop')];

        for (let i = 0; i < items.length && running; i++) {
            const div = items[i];
            const form = div.querySelector('form[id^="item_"]');
            if (!form) continue;

            const qtySpans = div.querySelectorAll('span.qty');
            const owned = qtySpans.length > 1 ? parseInt(qtySpans[1].innerText.replace(/,/g,'')) : 0;
            if (ownedBox.value && owned > parseInt(ownedBox.value)) continue;

            const priceInput = form.querySelector('input[name="price_pp"]');
            const price = priceInput ? parseInt(priceInput.value) : null;
            if (priceBox.value && price && price > parseInt(priceBox.value)) continue;

            if (ppToggle.checked && (!price || price <= 0)) continue;

            const qty = parseInt(qtyBox.value) || 1;

            // --- AJAX purchase loop for qty ---
            for (let q = 0; q < qty && running; q++) {
                const formData = new FormData();
                formData.append('price_pp', price);
                formData.append('item_id', form.querySelector('input[name="item_id"]').value);
                formData.append('usershop_id', form.querySelector('input[name="usershop_id"]').value);

                try {
                    await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    });
                    boughtCount++; // increment by 1 per successful purchase
                    counterDiv.textContent = `Bought: ${boughtCount}`;
                } catch (e) {
                    console.error('Purchase failed', e);
                    break;
                }

                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
            }

            // --- Fade out item ---
            div.style.transition = 'opacity 0.5s ease';
            div.style.opacity = '0.4';
        }
    }

})();
