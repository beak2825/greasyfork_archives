// ==UserScript==
// @name         YouTube Private Equity Detector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Identifies YouTube channels owned by private equity firms or media conglomerates and displays ownership info above the description.
// @author       jv
// @match        *://*.youtube.com/*
// @match        *://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558360/YouTube%20Private%20Equity%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/558360/YouTube%20Private%20Equity%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & Database ---

    // A database of known acquired channels.
    // keys: Channel Name (exact match or partial match logic can be added)
    // values: Object containing owner details.
    const ACQUISITION_DB = {
        // Moonbug Entertainment (Candle Media / Blackstone)
        "Cocomelon - Nursery Rhymes": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },
        "Little Baby Bum - Nursery Rhymes & Kids Songs": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },
        "Blippi - Educational Videos for Kids": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },
        "Blippi": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },
        "My Magic Pet Morphle": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },
        "Gecko's Garage - Trucks For Kids": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },
        "Supa Strikas": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },
        "Oddbods": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },
        "Little Angel: Nursery Rhymes & Kids Songs": { owner: "Moonbug Entertainment", parent: "Candle Media (Blackstone)" },

        // Valnet (Valsef Group)
        "Screen Rant": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "CBR": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "Collider": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "MovieWeb": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "TheGamer": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "Game Rant": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "TheRichest": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "TheTalko": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "BabbleTop": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "TheSportster": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "Simple Flying": { owner: "Valnet Inc.", parent: "Valsef Group" },
        "CarBuzz": { owner: "Valnet Inc.", parent: "Valsef Group" },

        // Electrify Video Partners
        "Veritasium": { owner: "Electrify Video Partners", parent: "Private Equity Backed" },
        "Fireship": { owner: "Electrify Video Partners", parent: "Private Equity Backed" },
        "Astrum": { owner: "Electrify Video Partners", parent: "Private Equity Backed" },
        "Mentour Pilot": { owner: "Electrify Video Partners", parent: "Private Equity Backed" },
        "Simple History": { owner: "Electrify Video Partners", parent: "Private Equity Backed" },
        "SpitBrix": { owner: "Electrify Video Partners", parent: "Private Equity Backed" },

        // Recurrent Ventures (North Equity)
        "Donut": { owner: "Recurrent Ventures", parent: "North Equity" },
        "The Drive": { owner: "Recurrent Ventures", parent: "North Equity" },
        "Task & Purpose": { owner: "Recurrent Ventures", parent: "North Equity" },

        // Little Dot Studios (All3Media)
        "Real Stories": { owner: "Little Dot Studios", parent: "All3Media" },
        "History Hit": { owner: "Little Dot Studios", parent: "All3Media" },
        "Wonder": { owner: "Little Dot Studios", parent: "All3Media" },

        // 3BlackDot
        "VanossGaming": { owner: "3BlackDot", parent: "Media Conglomerate" }, // Often associated/founded
    };

    // --- DOM Manipulation Logic ---

    function getChannelName() {
        // Selector for the channel name on a Video Page
        const channelLink = document.querySelector('#owner #channel-name a');
        return channelLink ? channelLink.innerText.trim() : null;
    }

    function createBanner(info) {
        const container = document.createElement('div');
        container.id = 'pe-detector-banner';
        container.style.cssText = `
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-left: 6px solid #ff4e45;
            padding: 12px 16px;
            margin-bottom: 12px;
            border-radius: 4px;
            font-family: Roboto, Arial, sans-serif;
            color: #0f0f0f;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        `;

        // Dark mode adjustment (basic)
        if (document.documentElement.getAttribute('dark') === 'true') {
            container.style.backgroundColor = '#2a2a2a';
            container.style.color = '#ffffff';
            container.style.border = '1px solid #3e3e3e';
            container.style.borderLeft = '6px solid #ff4e45';
        }

        const textContent = document.createElement('div');
        textContent.innerHTML = `
            <strong style="font-size: 14px; display: block; margin-bottom: 4px;">Ownership Alert</strong>
            <span style="font-size: 13px; opacity: 0.9;">
                This channel is owned by <strong>${info.owner}</strong>
                ${info.parent ? `(Parent: ${info.parent})` : ''}.
            </span>
        `;

        const icon = document.createElement('div');
        icon.innerText = 'ℹ️';
        icon.style.fontSize = '20px';
        icon.style.marginLeft = '10px';

        container.appendChild(textContent);
        container.appendChild(icon);

        return container;
    }

    function runCheck() {
        // 1. Remove existing banner if present (to avoid duplicates on nav)
        const existingBanner = document.getElementById('pe-detector-banner');
        if (existingBanner) existingBanner.remove();

        // 2. Get Channel Name
        const channelName = getChannelName();
        if (!channelName) return;

        // 3. Check Database
        let match = ACQUISITION_DB[channelName];

        // 4. Inject if match found
        if (match) {
            // Target the description box area
            // #bottom-row is the container above the description on modern YT layout
            // #description-inner is inside the collapsible box.

            const descriptionContainer = document.querySelector('#bottom-row');
            // Fallback for different layouts
            const secondaryTarget = document.querySelector('#secondary-inner');
            const metaTarget = document.querySelector('ytd-watch-metadata');

            if (metaTarget) {
                 metaTarget.parentNode.insertBefore(createBanner(match), metaTarget.nextSibling);
            } else if (descriptionContainer) {
                descriptionContainer.parentNode.insertBefore(createBanner(match), descriptionContainer);
            }
        }
    }

    // --- Observer for Single Page App Navigation ---
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Wait for DOM to settle
            setTimeout(runCheck, 2000);
        }
    }).observe(document, {subtree: true, childList: true});

    // Initial check (with delay for dynamic load)
    setTimeout(runCheck, 1500);
    // Double check for slow connections
    setTimeout(runCheck, 5000);

})();