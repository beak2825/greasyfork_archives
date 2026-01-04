// ==UserScript==
// @name         Tesla.com Inventory Harvester
// @namespace    [http://tampermonkey.net/](http://tampermonkey.net/)
// @version      1.6
// @description  Adds a button to Tesla.com inventory pages to copy details for a spreadsheet with simplified names and automated HW detection.
// @author       Your AI Assistant
// @match        https://www.tesla.com/inventory/used/*
// @match        https://www.tesla.com/m3/order/*
// @match        https://www.tesla.com/ms/order/*
// @match        https://www.tesla.com/mx/order/*
// @match        https://www.tesla.com/my/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556715/Teslacom%20Inventory%20Harvester.user.js
// @updateURL https://update.greasyfork.org/scripts/556715/Teslacom%20Inventory%20Harvester.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper function to simplify Trim names ---
    function simplifyTrim(trimText) {
        if (!trimText || trimText === 'Not Found') return 'Not Found';
        const lowerTrim = trimText.toLowerCase();

        if (lowerTrim.includes('performance')) return 'Performance';
        if (lowerTrim.includes('plaid')) return 'Plaid';
        if (lowerTrim.includes('long range awd')) return 'Long Range AWD'; // More specific rule first
        if (lowerTrim.includes('long range')) return 'Long Range'; // Catches "Long Range" and "Long Range RWD"
        if (lowerTrim.includes('standard range')) return 'Standard Range';
        if (lowerTrim.includes('all-wheel drive') || lowerTrim.includes('awd')) return 'AWD';
        if (lowerTrim.includes('rear-wheel drive') || lowerTrim.includes('rwd')) return 'RWD';

        return trimText; // Fallback to the original text if no rule matches
    }

    // --- Helper function to determine Tesla hardware version ---
    function determineHardwareVersion(carName, year, vin) {
        const yearNum = parseInt(year);
        if (isNaN(yearNum)) return 'Not Found';

        const modelName = carName.toLowerCase();

        // Model 3: 2024 or newer is HW4
        if (modelName.includes('model 3')) {
            return yearNum >= 2024 ? 'HW4' : 'HW3';
        }

        // Model S & X: 2023 or newer is HW4
        if (modelName.includes('model s') || modelName.includes('model x')) {
            return yearNum >= 2023 ? 'HW4' : 'HW3';
        }

        // Model Y: Complex logic for 2023, simple for others
        if (modelName.includes('model y')) {
            if (yearNum >= 2024) {
                return 'HW4';
            } else if (yearNum === 2023) {
                // Use VIN-based logic for 2023 Model Y
                return isModelY2023HW4(vin) ? 'HW4' : 'HW3';
            } else {
                return 'HW3';
            }
        }

        // Fallback for any other models
        return yearNum >= 2023 ? 'HW4' : 'HW3';
    }

    // --- Helper function to determine if a 2023 Model Y has HW4 based on VIN ---
    function isModelY2023HW4(vin) {
        if (!vin || vin === 'Not Found' || vin.length !== 17) {
            return false; // Default to HW3 if no VIN
        }

        // HW4 thresholds for 2023 Model Y based on factory and serial number
        const THRESHOLDS = {
            'F': 789500, // Fremont
            'A': 131200, // Austin
            'S': 380000, // Shanghai
            'B': 100000  // Berlin
        };

        const factoryCode = vin.charAt(10).toUpperCase();
        const serialNumber = parseInt(vin.substring(11), 10);
        const threshold = THRESHOLDS[factoryCode];

        if (threshold !== undefined && !isNaN(serialNumber)) {
            return serialNumber >= threshold;
        }

        // Default to HW3 for 2023 if VIN doesn't match known factory codes
        return false;
    }

    // --- Helper function to simplify color names ---
    function simplifyColor(colorText) {
        if (!colorText || colorText === 'Not Found') return 'Not Found';
        const lowerColor = colorText.toLowerCase();

        // Specific Tesla color mappings
        if (lowerColor.includes('stealth grey')) return 'Grey';
        if (lowerColor.includes('midnight silver')) return 'Grey';
        if (lowerColor.includes('quicksilver')) return 'Silver';
        if (lowerColor.includes('ultra red')) return 'Red';
        if (lowerColor.includes('deep blue')) return 'Blue';
        if (lowerColor.includes('pearl white')) return 'White';
        if (lowerColor.includes('solid black')) return 'Black';

        // General simplifications
        if (lowerColor.includes('silver')) return 'Silver';
        if (lowerColor.includes('grey') || lowerColor.includes('gray')) return 'Grey';
        if (lowerColor.includes('black')) return 'Black';
        if (lowerColor.includes('white')) return 'White';
        if (lowerColor.includes('red')) return 'Red';
        if (lowerColor.includes('blue')) return 'Blue';

        return colorText; // Return original if no rule matches
    }

    // --- Helper function to simplify interior color ---
    function simplifyInteriorColor(interiorText) {
        if (!interiorText || interiorText === 'Not Found') return 'Not Found';
        const lowerInterior = interiorText.toLowerCase();

        // If 'white' is mentioned anywhere, it's White. This is the top priority.
        if (lowerInterior.includes('white')) return 'White';
        if (lowerInterior.includes('black')) return 'Black';
        if (lowerInterior.includes('cream')) return 'Cream';

        return 'Not Found'; // Fallback
    }


    // --- Main function to harvest data ---
    function harvestData() {
        // Tesla embeds data in a global JavaScript object, which is the most reliable source.
        const teslaData = window.tesla.product.data;

        // --- 1. Cars Name & Year ---
        const carName = teslaData.Model ? `Tesla Model ${teslaData.Model.slice(-1)}` : 'Not Found';
        const year = teslaData.Year || 'Not Found';

        // --- 2. Trim (Simplified) ---
        const rawTrim = teslaData.TrimName || 'Not Found';
        const trim = simplifyTrim(rawTrim);

        // --- 3. Price ---
        const price = teslaData.InventoryPrice ? `$${teslaData.InventoryPrice.toLocaleString()}` : 'Not Found';

        // --- 4. Location (State Only) ---
        const location = teslaData.StateProvince || 'Not Found';

        // --- 5. Miles ---
        const miles = teslaData.Odometer ? `${teslaData.Odometer.toLocaleString()} ${teslaData.OdometerType}` : 'Not Found';

        // --- 6. FSD (Full Self-Driving) ---
        let fsd = '$100/m'; // Default value
        const fsdOption = teslaData.OptionCodeData.find(opt => opt.group === 'AUTOPILOT' && opt.code === '$APF2');
        const autopilotTrial = teslaData.Rewards.find(r => r.reward_code === 'apf2');

        if (fsdOption) {
            fsd = 'FSD Included';
        } else if (autopilotTrial) {
            fsd = `${autopilotTrial.outcome} Months Trial`;
        }

        // --- 7. Garage (Standardized) ---
        const garage = 'Tesla Used';

        // --- 8. Colour (Simplified) ---
        let exteriorColorRaw = 'Not Found';
        let interiorColorRaw = 'Not Found';
        teslaData.OptionCodeData.forEach(option => {
            if (option.group === 'PAINT') {
                exteriorColorRaw = option.name;
            }
            if (option.group === 'INTERIOR') {
                interiorColorRaw = option.name;
            }
        });
        const simplifiedExterior = simplifyColor(exteriorColorRaw);
        const simplifiedInterior = simplifyInteriorColor(interiorColorRaw);
        const colour = `${simplifiedExterior} on ${simplifiedInterior}`;

        // --- 9. DATE ---
        const today = new Date();
        const date = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;

        // --- 10. VIN ---
        const vin = teslaData.VIN || 'Not Found';

        // --- 11. LINK ---
        const link = window.location.href;

        // --- 12. FSD HW (Hardware) ---
        const fsdHw = determineHardwareVersion(carName, year, vin);

        // --- 13. Notes ---
        const notes = ''; // Placeholder for manual notes

        // --- Assemble the final string for the clipboard ---
        const dataRow = [
            carName, year, trim, price, location, miles, fsd, garage, colour, date, vin, link, fsdHw, notes
        ].join('\t'); // Use a tab character to separate columns

        // --- Copy to clipboard and provide feedback ---
        navigator.clipboard.writeText(dataRow).then(() => {
            const button = document.getElementById('harvest-button');
            button.textContent = 'Copied!';
            button.style.backgroundColor = '#28a745'; // Green for success
            setTimeout(() => {
                button.textContent = 'Copy Car Data';
                button.style.backgroundColor = '#3E6AE1'; // Revert to Tesla blue
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy data: ', err);
            alert('Failed to copy data. See console for details.');
        });
    }

    // --- Create and add the button to the page ---
    function addButton() {
        const button = document.createElement('button');
        button.id = 'harvest-button';
        button.textContent = 'Copy Car Data';
        // Styling the button
        button.style.position = 'fixed';
        button.style.top = '80px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.backgroundColor = '#3E6AE1'; // Tesla blue
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontFamily = '"Gotham SSm", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

        button.addEventListener('click', harvestData);

        document.body.appendChild(button);
    }

    // --- Run the script ---
    // Wait for the window to load to ensure the 'tesla' object is available
    window.addEventListener('load', addButton);
})();