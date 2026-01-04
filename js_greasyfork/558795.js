// ==UserScript==
// @name         Neopets Gallery Auto Upgrader Pro
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Auto-click gallery upgrade button and calculate bulk upgrade costs
// @author       Thezuki10@clraik.com
// @match        https://www.neopets.com/gallery/gallery_desc_edit.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558795/Neopets%20Gallery%20Auto%20Upgrader%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/558795/Neopets%20Gallery%20Auto%20Upgrader%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we're in the middle of an auto-upgrade sequence
    const upgradeState = localStorage.getItem('neopets_gallery_upgrade');

    if (upgradeState) {
        const state = JSON.parse(upgradeState);
        const currentBtn = document.querySelector('form[action="process_gallery_mgt.phtml"] input[type="submit"][value*="Cost to Upgrade"]');

        if (currentBtn && state.completed < state.total) {
            // Extract current NP to check if we still have enough
            const pageText = document.body.innerText;
            const npMatch = pageText.match(/NP:\s*([\d,]+)/);
            let currentNP = 0;
            if (npMatch) {
                currentNP = parseInt(npMatch[1].replace(/,/g, ''));
            }

            // Extract current cost from button
            const buttonText = currentBtn.value;
            const currentCost = parseInt(buttonText.match(/\d+/)[0]);

            // Check if we still have enough NP for the next upgrade
            if (currentNP < currentCost) {
                // Not enough NP - stop the upgrade cycle
                let progressDiv = document.getElementById('upgrade_progress_display');
                if (!progressDiv) {
                    progressDiv = document.createElement('div');
                    progressDiv.id = 'upgrade_progress_display';
                    progressDiv.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-image: url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);
                        background-repeat: repeat;
                        background-size: 288px 446px;
                        image-rendering: pixelated;
                        border: 2px solid #333;
                        padding: 30px;
                        border-radius: 10px;
                        z-index: 10000;
                        font-size: 18px;
                        font-weight: bold;
                        text-align: center;
                        font-family: "Cafeteria", "Arial Bold", sans-serif;
                        box-shadow: 4px 4px 12px rgba(0,0,0,0.4);
                        color: #333;
                    `;
                    document.body.appendChild(progressDiv);
                }

                progressDiv.style.background = 'linear-gradient(to bottom, rgb(255, 200, 200), rgb(255, 150, 150))';
                progressDiv.innerHTML = `<span style="color: #cc0000;">⚠️ Upgrade Stopped</span><br><span style="font-size: 14px; color: #333;">Insufficient NP for next upgrade!<br>Completed: ${state.completed} of ${state.total}<br>Current NP: ${currentNP.toLocaleString()}<br>Next upgrade cost: ${currentCost.toLocaleString()}`;
                localStorage.removeItem('neopets_gallery_upgrade');

                setTimeout(() => {
                    progressDiv.style.display = 'none';
                    location.reload();
                }, 3000);
                return;
            }

            // Page has reloaded, increment counter and click again
            state.completed++;
            localStorage.setItem('neopets_gallery_upgrade', JSON.stringify(state));

            // Update or create progress display
            let progressDiv = document.getElementById('upgrade_progress_display');
            if (!progressDiv) {
                progressDiv = document.createElement('div');
                progressDiv.id = 'upgrade_progress_display';
                progressDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-image: url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);
                    background-repeat: repeat;
                    background-size: 288px 446px;
                    image-rendering: pixelated;
                    border: 2px solid #333;
                    padding: 30px;
                    border-radius: 10px;
                    z-index: 10000;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    font-family: "Cafeteria", "Arial Bold", sans-serif;
                    box-shadow: 4px 4px 12px rgba(0,0,0,0.4);
                    color: #333;
                `;
                document.body.appendChild(progressDiv);
            }

            progressDiv.textContent = `Upgrading... ${state.completed} of ${state.total}`;

            // Auto-click the button
            setTimeout(() => {
                currentBtn.click();
            }, 500);
        } else if (state.completed >= state.total) {
            // Upgrades complete
            let progressDiv = document.getElementById('upgrade_progress_display');
            if (!progressDiv) {
                progressDiv = document.createElement('div');
                progressDiv.id = 'upgrade_progress_display';
                progressDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-image: url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);
                    background-repeat: repeat;
                    background-size: 288px 446px;
                    image-rendering: pixelated;
                    border: 2px solid #333;
                    padding: 30px;
                    border-radius: 10px;
                    z-index: 10000;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    font-family: "Cafeteria", "Arial Bold", sans-serif;
                    box-shadow: 4px 4px 12px rgba(0,0,0,0.4);
                    color: #333;
                `;
                document.body.appendChild(progressDiv);
            }

            progressDiv.textContent = `✓ Gallery upgraded ${state.total} time(s)!`;
            localStorage.removeItem('neopets_gallery_upgrade');

            setTimeout(() => {
                progressDiv.style.display = 'none';
                location.reload();
            }, 3000);
        } else {
            // Button not found - upgrades stopped
            let progressDiv = document.getElementById('upgrade_progress_display');
            if (!progressDiv) {
                progressDiv = document.createElement('div');
                progressDiv.id = 'upgrade_progress_display';
                progressDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-image: url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);
                    background-repeat: repeat;
                    background-size: 288px 446px;
                    image-rendering: pixelated;
                    border: 2px solid #333;
                    padding: 30px;
                    border-radius: 10px;
                    z-index: 10000;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    font-family: "Cafeteria", "Arial Bold", sans-serif;
                    box-shadow: 4px 4px 12px rgba(0,0,0,0.4);
                    color: #333;
                `;
                document.body.appendChild(progressDiv);
            }

            progressDiv.textContent = `⚠️ Upgrades stopped at ${state.completed} of ${state.total}.\nButton unavailable (out of money or max level).`;
            localStorage.removeItem('neopets_gallery_upgrade');

            setTimeout(() => {
                progressDiv.style.display = 'none';
                location.reload();
            }, 3000);
        }
        return; // Exit early, don't show the initial UI
    }

    // Initial page load - show controls
    const upgradeForm = document.querySelector('form[action="process_gallery_mgt.phtml"] input[type="submit"][value*="Cost to Upgrade"]');

    if (!upgradeForm) {
        console.log('Upgrade button not found');
        return;
    }

    // Extract current cost from button
    const buttonText = upgradeForm.value;
    const currentCost = parseInt(buttonText.match(/\d+/)[0]);

    // Extract current gallery info from page
    let currentSize = 254;
    let currentFloorspace = 2540;
    let currentItems = 1270;

    const pageText = document.body.innerText;
    const sizeMatch = pageText.match(/Your gallery is currently size.*?(\d+)\D+(\d+)\s*sq ft/);
    const itemsMatch = pageText.match(/it can hold\s+(\d+)\s+items/);

    if (sizeMatch) {
        currentSize = parseInt(sizeMatch[1]);
        currentFloorspace = parseInt(sizeMatch[2]);
    }
    if (itemsMatch) {
        currentItems = parseInt(itemsMatch[1]);
    }

    // Extract current NP amount
    let currentNP = 0;
    const npMatch = pageText.match(/NP:\s*([\d,]+)/);
    if (npMatch) {
        currentNP = parseInt(npMatch[1].replace(/,/g, ''));
    }

    // Find the form
    const form = upgradeForm.closest('form');
    const container = document.createElement('div');
    container.style.cssText = `
        margin-top: 15px;
        padding: 20px;
        background-image: url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);
        background-repeat: repeat;
        background-size: 288px 446px;
        image-rendering: pixelated;
        border: 2px solid #333;
        border-radius: 15px;
        font-family: "Cafeteria", "Arial Bold", sans-serif;
        font-size: 14px;
        box-shadow: rgb(246,226,80) 0 0 0 1px inset,
                    rgb(196,124,25) 0 -3px 2px 3px inset,
                    rgb(253,249,220) 0 2px 0 1px inset,
                    rgb(0,0,0) 0 0 0 2px;
        color: #333;
    `;

    // Create input label and field
    const label = document.createElement('label');
    label.style.cssText = `
        display: block;
        font-weight: bold;
        margin-bottom: 12px;
        color: #333;
        font-size: 16px;
    `;
    label.textContent = 'How many times do you want to upgrade?';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = '1';
    input.style.cssText = `
        padding: 10px;
        font-size: 14px;
        width: 120px;
        margin-right: 10px;
        border: 0.8px solid white;
        border-radius: 8px;
        background: linear-gradient(to bottom, rgb(255, 255, 255), rgb(240, 240, 240));
        box-shadow: rgb(255,255,255) 0 0 0 1px inset,
                    rgb(100,100,100) 0 -2px 1px 2px inset,
                    rgb(255,255,255) 0 1px 0 0 inset,
                    rgb(0,0,0) 0 0 0 1px;
        font-family: "Cafeteria", "Arial Bold", sans-serif;
        color: #333;
    `;

    // Create cost display
    const costDisplay = document.createElement('div');
    costDisplay.style.cssText = `
        margin-top: 16px;
        font-size: 16px;
        font-weight: bold;
        color: #8b5a00;
        padding: 10px;
        background: linear-gradient(to bottom, rgba(255, 250, 200, 0.6), rgba(255, 240, 150, 0.6));
        border-radius: 8px;
        border: 1px solid rgba(139, 90, 0, 0.3);
    `;

    // Create space display
    const spaceDisplay = document.createElement('div');
    spaceDisplay.style.cssText = `
        margin-top: 12px;
        font-size: 13px;
        color: #000;
        line-height: 1.8;
        padding: 12px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(250, 250, 240, 0.4));
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    `;

    // Create NP display
    const npDisplay = document.createElement('div');
    npDisplay.style.cssText = `
        margin-top: 12px;
        font-size: 13px;
        color: #000;
        line-height: 1.8;
        padding: 12px;
        background: linear-gradient(to bottom, rgba(255, 255, 200, 0.5), rgba(255, 245, 150, 0.5));
        border-radius: 8px;
        border: 1px solid rgba(184, 134, 11, 0.4);
    `;

    // Function to calculate total cost
    function calculateTotalCost(times) {
        let total = 0;
        for (let i = 0; i < times; i++) {
            total += currentCost + (i * 200);
        }
        return total;
    }

    // Update displays
    function updateCostDisplay() {
        const times = parseInt(input.value) || 1;
        const totalCost = calculateTotalCost(times);

        // Calculate new size and space after upgrades
        const newSize = currentSize + times;
        const newFloorspace = newSize * 10;
        const newItems = newFloorspace / 2;
        const remainingNP = currentNP - totalCost;

        costDisplay.textContent = `💰 Total cost for ${times} upgrade${times !== 1 ? 's' : ''}: ${totalCost.toLocaleString()} NP`;

        spaceDisplay.innerHTML = `
            <strong>📦 Current:</strong> Size ${currentSize} (${currentFloorspace} sq ft) - ${currentItems} items<br>
            <strong>✨ After upgrades:</strong> Size ${newSize} (${newFloorspace} sq ft) - ${newItems} items<br>
            <strong>📈 Space gained:</strong> +${times * 5} items (+${newFloorspace - currentFloorspace} sq ft)
        `;

        // Update NP display
        if (totalCost > currentNP) {
            const maxUpgrades = Math.floor(currentNP / currentCost);
            let maxTotalCost = 0;
            for (let i = 0; i < maxUpgrades && i < times; i++) {
                maxTotalCost += currentCost + (i * 200);
            }
            npDisplay.innerHTML = `
                <strong style="color: #cc0000;">⚠️ Insufficient NP!</strong><br>
                <strong>Current NP:</strong> ${currentNP.toLocaleString()} NP<br>
                <strong>Cost for ${times} upgrades:</strong> ${totalCost.toLocaleString()} NP<br>
                <strong style="color: #cc0000;">You would need: ${(totalCost - currentNP).toLocaleString()} more NP</strong><br>
                <strong style="color: #008800;">Max upgrades you can do: ${maxUpgrades}</strong>
            `;
        } else {
            npDisplay.innerHTML = `
                <strong>Current NP:</strong> ${currentNP.toLocaleString()} NP<br>
                <strong>Cost for ${times} upgrades:</strong> ${totalCost.toLocaleString()} NP<br>
                <strong style="color: #008800;">NP after upgrades:</strong> ${remainingNP.toLocaleString()} NP
            `;
        }
    }

    input.addEventListener('input', updateCostDisplay);

    // Create progress display
    const progressDisplay = document.createElement('div');
    progressDisplay.style.cssText = `
        margin-top: 14px;
        font-size: 14px;
        color: #0066cc;
        font-weight: bold;
        display: none;
        padding: 10px;
        background: linear-gradient(to bottom, rgba(200, 230, 255, 0.4), rgba(180, 220, 255, 0.4));
        border-radius: 8px;
        border: 1px solid rgba(0, 102, 204, 0.3);
        text-align: center;
    `;

    // Create auto-click button
    const autoClickBtn = document.createElement('button');
    autoClickBtn.type = 'button';
    autoClickBtn.textContent = 'Auto Upgrade';
    autoClickBtn.style.cssText = `
        padding: 10px 20px;
        margin-top: 16px;
        background: linear-gradient(to bottom, rgb(246, 226, 80), rgb(235, 178, 51));
        border: 0.8px solid white;
        border-radius: 15px;
        box-shadow: rgb(246,226,80) 0 0 0 1px inset,
                    rgb(196,124,25) 0 -3px 2px 3px inset,
                    rgb(253,249,220) 0 2px 0 1px inset,
                    rgb(0,0,0) 0 0 0 2px;
        color: rgb(0,0,0);
        font-family: "Cafeteria", "Arial Bold", sans-serif;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
        max-width: 300px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    `;

    autoClickBtn.addEventListener('mouseover', () => {
        autoClickBtn.style.background = 'linear-gradient(to bottom, rgb(250, 230, 90), rgb(240, 185, 60))';
    });

    autoClickBtn.addEventListener('mouseout', () => {
        autoClickBtn.style.background = 'linear-gradient(to bottom, rgb(246, 226, 80), rgb(235, 178, 51))';
    });

    autoClickBtn.addEventListener('click', async () => {
        const times = parseInt(input.value) || 1;
        const totalCost = calculateTotalCost(times);

        if (!confirm(`This will upgrade your gallery ${times} time(s) for a total of ${totalCost.toLocaleString()} NP. Continue?`)) {
            return;
        }

        // Save upgrade state to localStorage
        const upgradeData = {
            total: times,
            completed: 0,
            startTime: Date.now()
        };
        localStorage.setItem('neopets_gallery_upgrade', JSON.stringify(upgradeData));

        // Show progress and click
        const progressDiv = document.createElement('div');
        progressDiv.id = 'upgrade_progress_display';
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-image: url(https://images.neopets.com/ncmall/ui/assets/bg-ncmall-BDtvB-Ef.png);
            background-repeat: repeat;
            background-size: 288px 446px;
            image-rendering: pixelated;
            border: 2px solid #333;
            padding: 30px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            font-family: "Cafeteria", "Arial Bold", sans-serif;
            box-shadow: 4px 4px 12px rgba(0,0,0,0.4);
            color: #333;
        `;
        progressDiv.textContent = `Upgrading... 1 of ${times}`;
        document.body.appendChild(progressDiv);

        autoClickBtn.disabled = true;
        input.disabled = true;
        autoClickBtn.style.opacity = '0.6';
        progressDisplay.style.display = 'block';
        progressDisplay.textContent = 'Initializing upgrade sequence...';

        // Click the button to start the chain
        upgradeForm.click();
    });

    // Assemble container
    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(costDisplay);
    container.appendChild(npDisplay);
    container.appendChild(spaceDisplay);
    container.appendChild(autoClickBtn);
    container.appendChild(progressDisplay);

    // Insert after the upgrade button
    form.insertBefore(container, form.querySelector('input[type="submit"]').nextSibling);

    // Initial cost display
    updateCostDisplay();
})();