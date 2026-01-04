// ==UserScript==
// @name         Tesla VIN HW3/HW4 Detector (URL VIN Detection)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Detects Tesla VIN from URL or page content on Tesla.com, Autotrader.com, and Cars.com
// @author       You
// @match        https://www.tesla.com/*
// @match        https://www.autotrader.com/*
// @match        https://www.cars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556717/Tesla%20VIN%20HW3HW4%20Detector%20%28URL%20VIN%20Detection%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556717/Tesla%20VIN%20HW3HW4%20Detector%20%28URL%20VIN%20Detection%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // HW4 thresholds
    const THRESHOLDS = {
        'F': 789500, // Fremont
        'A': 131200, // Austin
        'S': 380000, // Shanghai
        'B': 100000  // Berlin
    };

    // Model year mapping
    const MODEL_YEARS = {
        'N': 2022,
        'P': 2023,
        'R': 2024,
        'S': 2025
    };

    let currentVIN = null;
    const siteType = getSiteType();

    function getSiteType() {
        const hostname = window.location.hostname;
        if (hostname.includes('tesla.com')) return 'tesla';
        if (hostname.includes('autotrader.com')) return 'autotrader';
        if (hostname.includes('cars.com')) return 'cars';
        return null;
    }

    // Main function to check for VIN and display status
    function checkForVIN() {
        const vin = findVIN();
        const currentUrl = window.location.href;

        // Remove banner if not on a vehicle page or if VIN not found
        if (!isVehiclePage(currentUrl) || !vin) {
            removeHWStatus();
            return;
        }

        // Skip if we already processed this VIN
        if (vin === currentVIN) return;

        // Process new VIN
        showHWStatus(vin);
        currentVIN = vin;
    }

    // Find VIN in URL or page content
    function findVIN() {
        // First try to get VIN from URL (Tesla only)
        const urlVIN = getVINFromURL();
        if (urlVIN) return urlVIN;

        if (siteType === 'tesla') {
            // Tesla.com fallback detection
            const vinElement = document.querySelector('.vin-display');
            if (vinElement) {
                const match = vinElement.textContent.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
                if (match) return match[1];
            }
            // Final fallback for Tesla
            const match = document.body.innerText.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
            return match ? match[1] : null;
        } else if (siteType === 'autotrader') {
            // Autotrader detection
            const vinElement = document.querySelector('[data-cmp="vin"], .vin, [class*="vin"]');
            if (vinElement) {
                const match = vinElement.textContent.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
                if (match) return match[1];
            }
            // Fallback for Autotrader
            const match = document.body.innerText.match(/\bVIN:?\s*([A-HJ-NPR-Z0-9]{17})\b/i);
            return match ? match[1] : null;
        } else if (siteType === 'cars') {
            // Cars.com detection
            const vinElements = document.querySelectorAll('.sds-page-section.basics-section .fancy-description-list dt');
            for (const dt of vinElements) {
                if (dt.textContent.trim().toLowerCase() === 'vin') {
                    const dd = dt.nextElementSibling;
                    if (dd) {
                        const match = dd.textContent.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
                        if (match) return match[1];
                    }
                }
            }
            // Fallback for Cars.com
            const match = document.body.innerText.match(/\bVIN:?\s*([A-HJ-NPR-Z0-9]{17})\b/i);
            return match ? match[1] : null;
        }
        return null;
    }

    // Extract VIN from URL if present (Tesla only)
    function getVINFromURL() {
        if (siteType !== 'tesla') return null;

        const url = window.location.href;
        const vinMatch = url.match(/\/order\/([A-HJ-NPR-Z0-9]{17})/);
        return vinMatch ? vinMatch[1] : null;
    }

    // Determine if current page shows a specific vehicle
    function isVehiclePage(url) {
        if (siteType === 'tesla') {
            return getVINFromURL() !== null ||
                   url.includes('/vehicle/') ||
                   document.querySelector('.vin-display') !== null;
        } else if (siteType === 'autotrader') {
            return url.includes('/vehicle/') ||
                   document.querySelector('[data-cmp="vin"]') !== null;
        } else if (siteType === 'cars') {
            return url.includes('/vehicledetail/') ||
                   document.querySelector('.vehicle-details, .vehicle-card, .sds-page-section.basics-section') !== null;
        }
        return false;
    }

    // Determine HW version
    function isHW4(vin) {
        if (!vin || vin.length !== 17) return false;

        const modelYearCode = vin.charAt(9);
        const factoryCode = vin.charAt(10);
        const serialNumber = parseInt(vin.substring(11), 10);
        const modelYear = MODEL_YEARS[modelYearCode] || 0;

        if (modelYear >= 2024) return true;
        if (modelYear <= 2022) return false;
        if (modelYear === 2023) {
            const threshold = THRESHOLDS[factoryCode];
            return threshold !== undefined && serialNumber >= threshold;
        }
        return false;
    }

    // Show HW status banner
    function showHWStatus(vin) {
        removeHWStatus();

        const isHW4Vehicle = isHW4(vin);
        const modelYear = MODEL_YEARS[vin.charAt(9)] || "Unknown";

        const banner = document.createElement('div');
        banner.id = 'tesla-hw-banner';
        banner.textContent = `VIN: ${vin} - ${isHW4Vehicle ? "HW4 ✅" : "HW3 🚨"} (${modelYear})`;

        Object.assign(banner.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: isHW4Vehicle ? '#4CAF50' : '#FF0000',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '999999',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif'
        });

        document.body.appendChild(banner);
    }

    // Remove HW status banner
    function removeHWStatus() {
        const banner = document.getElementById('tesla-hw-banner');
        if (banner) banner.remove();
        currentVIN = null;
    }

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver(function(mutations) {
        checkForVIN();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Handle SPA navigation
    window.addEventListener('popstate', checkForVIN);
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(checkForVIN, 100);
    };

    // Initial check
    checkForVIN();
})();