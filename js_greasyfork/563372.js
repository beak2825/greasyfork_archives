// ==UserScript==
// @name         Clothing Store Checker
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  FINAL: Fetches job data and shows if the user works at a Clothing Store (type_id 5) only. Test lines removed.
// @author       WTV1
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563372/Clothing%20Store%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/563372/Clothing%20Store%20Checker.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Ensure your key is pasted here, replacing
    const API_KEY = 'PUBLIC API HERE'; 
    if (API_KEY === 'YOUR_API_KEY_HERE' || !API_KEY) {
        console.error("Torn Profile Injector: API Key is missing. Please edit the script to insert your API key.");
        return; 
    }
 
    // --- 1. CONFIGURATION: HTML for the Main Profile (Only shown on success) ---
    // FINAL MODIFICATION for single line: smallest size, tightest spacing, and NO COMMENTS in the HTML string.
    const CLOTHING_STORE_HTML_MAIN = `
        <div style="
            padding: 3px; /* Minimal vertical padding for small height */
            margin: 5px 0; 
            border: 1px solid #ff0000; /* Minimal border */
            background: #330000; 
            text-align: center;
            color: white; 
            font-weight: bold;
            font-size: 11px; /* Smallest font size */
            text-shadow: 1px 1px 1px #000; 
            clear: both; 
            display: block;
        ">
            <span style="letter-spacing: 1px;">CLOTHING STORE</span>
        </div>
    `;
 
    // --- 2. CONFIGURATION: HTML for the Mini-Profile (Only shown on success) ---
    const CLOTHING_STORE_HTML_MINI = `
        <div style="
            padding: 5px; 
            margin-top: 5px;
            border: 1px solid #ff0000; 
            background: #330000; 
            color: #ffcccc; 
            font-size: 11px;
            text-align: center;
            font-weight: bold;
        ">
            WORKS ON CLOTHING STORE
        </div>
    `;
 
    // =========================================================================
    // SECTION A: API Logic
    // =========================================================================
 
    async function checkClothingStore(userID) {
        if (!userID) return false;
 
        const url = `https://api.torn.com/v2/user/${userID}/job?selections=job&key=${API_KEY}`;
 
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Torn API Error for User ${userID}: HTTP Status ${response.status}`);
                return false;
            }
 
            const data = await response.json();
 
            // Check: job type must be 'company' AND job type_id must be 5 (Clothing Store)
            return data?.job?.type === 'company' && data.job.type_id === 5;
 
        } catch (error) {
            console.error(`Torn API Fetch Failed for User ${userID}:`, error);
            return false;
        }
    }
 
    // =========================================================================
    // SECTION B: Utility Functions & Observer Logic
    // =========================================================================
 
    function getUserIdFromUrl() {
        const match = window.location.href.match(/XID=(\d+)/);
        return match ? match[1] : null;
    }
 
    function getMiniProfileUserId(miniProfileElement) {
        const link = miniProfileElement.querySelector('a[href*="profiles.php?XID="]');
        if (link) {
            const match = link.getAttribute('href').match(/XID=(\d+)/); 
            return match ? match[1] : null;
        }
        return null;
    }
 
    // Set to store unique keys of profiles currently being processed by the API
    const fetchingIDs = new Set();
 
    async function processInjection(element, userID, htmlTemplate, isMainProfile) {
        // Use a unique key for tracking across all profile types (Main/Mini)
        const uniqueKey = `${isMainProfile ? 'main' : 'mini'}-${userID}`;
        if (fetchingIDs.has(uniqueKey)) return; 
 
        fetchingIDs.add(uniqueKey);
 
        const worksAtStore = await checkClothingStore(userID);
 
        if (worksAtStore) {
            if (isMainProfile) {
                // Main profile injection: Insert before the profile wrapper
                element.insertAdjacentHTML('beforebegin', htmlTemplate);
            } else {
                // Mini profile injection: Insert inside the description area
                element.insertAdjacentHTML('beforeend', htmlTemplate);
            }
        }
 
        // Processing complete (whether it inserted HTML or not)
        fetchingIDs.delete(uniqueKey); 
    }
 
 
    function unifiedEnhancementLogic() {
        // --- 1. Handle Main Profile Injection ---
        if (window.location.href.includes('profiles.php')) {
            const userID = getUserIdFromUrl();
            // Target the profile-wrapper and use a data attribute to check if it's been processed
            const profileWrapper = document.querySelector('.profile-wrapper:not([data-gemini-processed="main"])'); 
 
            if (profileWrapper && userID) {
                profileWrapper.setAttribute('data-gemini-processed', 'main');
                processInjection(profileWrapper, userID, CLOTHING_STORE_HTML_MAIN, true);
            }
        }
 
 
        // --- 2. Handle Mini-Profile Injection ---
        // Target all mini-profile wrappers that haven't been processed
        const miniProfiles = document.querySelectorAll('[class*="profile-mini-_userProfileWrapper_"]:not([data-gemini-processed="mini"])');
 
        miniProfiles.forEach(mini => {
            const userID = getMiniProfileUserId(mini);
            if (!userID) return;
 
            // Mark the mini-profile as processed
            mini.setAttribute('data-gemini-processed', 'mini'); 
 
            // The injection point is the description area
            const descriptionArea = mini.querySelector('.description');
            if (descriptionArea) {
                // We pass the description area as the target element for insertion
                processInjection(descriptionArea, userID, CLOTHING_STORE_HTML_MINI, false);
            }
        });
    }
 
 
    // --- Set up the Mutation Observer (the reliable way to handle Torn PDA's dynamic loading) ---
    const unifiedObserver = new MutationObserver(unifiedEnhancementLogic);
 
    // Start observing the entire body for new elements appearing
    unifiedObserver.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
 
    // Initial run
    unifiedEnhancementLogic(); 
 
})();