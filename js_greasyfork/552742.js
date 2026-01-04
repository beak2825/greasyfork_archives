// ==UserScript==
// @name         Broadcom Docs Version/Language Switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to Broadcom Tech Docs to easily switch versions and languages.
// @author       sh0510
// @match        https://techdocs.broadcom.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552742/Broadcom%20Docs%20VersionLanguage%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/552742/Broadcom%20Docs%20VersionLanguage%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Main function to create and display the switcher UI.
     * This is called when the launch button is clicked.
     */
    function showSwitcherUI() {
        // --- 1. Scrape Available Versions & Identify Current State ---

        // Find all version links within the page's dropdown menu.
        const versionLinks = document.querySelectorAll('[aria-labelledby="version-dropdown-btn"] a.dropdown-item');
        if (versionLinks.length === 0) {
            alert('Could not find the version dropdown menu on this page.');
            return;
        }

        // Create an array of available version numbers from the link text.
        const availableVersions = Array.from(versionLinks).map(link => link.innerText.trim()).reverse();
        const currentUrl = window.location.href;
        let currentVersion = null;
        let currentLang = "";

        // Determine the current version by checking the URL against the available versions.
        for (const version of availableVersions) {
            const versionForUrl = version.replace(/\./g, '-'); // e.g., '8.17.1' -> '8-17-1'
            if (currentUrl.includes(`/${versionForUrl}/`)) {
                currentVersion = version;
                break;
            }
        }

        // Determine the current language from the URL path.
        if (currentUrl.includes('/jp/ja/')) {
            currentLang = "ja";
        } else if (currentUrl.includes('/us/en/')) {
            currentLang = "en";
        }

        // --- 2. Create Custom UI Elements ---

        // Create the background overlay.
        const overlay = document.createElement('div');
        overlay.id = 'bkm-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;';

        // Create the modal dialog box.
        const modal = document.createElement('div');
        modal.style.cssText = 'background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-family: sans-serif; width: 320px;';

        // Create UI components (title, labels, dropdown, radio buttons, etc.).
        const title = document.createElement('h3');
        title.innerText = 'Change Document';
        title.style.cssText = 'margin-top: 0; margin-bottom: 20px; color: #333;';

        const versionLabel = document.createElement('label');
        versionLabel.innerText = 'Version:';
        versionLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';

        const versionSelect = document.createElement('select');
        versionSelect.id = 'bkm-version-select';
        versionSelect.style.cssText = 'width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 15px;';

        availableVersions.forEach(v => {
            const option = document.createElement('option');
            option.value = v;
            option.innerText = v;
            if (v === currentVersion) {
                option.selected = true;
            }
            versionSelect.appendChild(option);
        });

        const langLabel = document.createElement('label');
        langLabel.innerText = 'Language:';
        langLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';

        const langContainer = document.createElement('div');
        langContainer.style.cssText = 'margin-bottom: 20px;';

        const enRadio = document.createElement('input');
        enRadio.type = 'radio'; enRadio.id = 'bkm-lang-en'; enRadio.name = 'language'; enRadio.value = 'en';
        if (currentLang === 'en') enRadio.checked = true;
        const enLabel = document.createElement('label');
        enLabel.htmlFor = 'bkm-lang-en'; enLabel.innerText = ' English'; enLabel.style.marginRight = '15px';

        const jaRadio = document.createElement('input');
        jaRadio.type = 'radio'; jaRadio.id = 'bkm-lang-ja'; jaRadio.name = 'language'; jaRadio.value = 'ja';
        if (currentLang === 'ja') jaRadio.checked = true;
        const jaLabel = document.createElement('label');
        jaLabel.htmlFor = 'bkm-lang-ja'; jaLabel.innerText = ' Japanese';

        langContainer.append(enRadio, enLabel, jaRadio, jaLabel);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'text-align: right; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;';

        const goButton = document.createElement('button');
        goButton.innerText = 'Go';
        goButton.style.cssText = 'padding: 8px 16px; border: none; background-color: #007bff; color: white; border-radius: 4px; cursor: pointer; margin-right: 10px;';

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';
        cancelButton.style.cssText = 'padding: 8px 16px; border: 1px solid #ccc; background-color: #f0f0f0; color: #333; border-radius: 4px; cursor: pointer;';

        buttonContainer.append(goButton, cancelButton);

        // Create the fallback search feature UI.
        const fallbackContainer = document.createElement('div');
        const fallbackLabel = document.createElement('p');
        fallbackLabel.innerText = 'If the above fails, search for this title:';
        fallbackLabel.style.cssText = 'font-size: 14px; color: #555; margin: 0 0 10px 0;';

        const searchButton = document.createElement('button');
        searchButton.innerText = 'Search Title on Google';
        searchButton.style.cssText = 'width: 100%; padding: 10px; border: 1px solid #ccc; background-color: #f8f9fa; color: #333; border-radius: 4px; cursor: pointer;';

        fallbackContainer.append(fallbackLabel, searchButton);

        // Assemble the modal and append it to the page.
        modal.append(title, versionLabel, versionSelect, langLabel, langContainer, buttonContainer, fallbackContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // --- 3. Add Event Handlers ---

        // Event handler to close the modal.
        cancelButton.onclick = () => document.body.removeChild(overlay);
        overlay.onclick = (e) => { if (e.target === overlay) { document.body.removeChild(overlay); } };

        // Event handler for the "Go" button to perform URL replacement.
        goButton.onclick = function() {
            let newUrl = currentUrl;
            const targetVersion = versionSelect.value;
            const targetLang = document.querySelector('input[name="language"]:checked').value;

            if (currentVersion && targetVersion !== currentVersion) {
                const currentVersionSanitized = currentVersion.replace(/\./g, '-');
                const targetVersionSanitized = targetVersion.replace(/\./g, '-');
                const regex = new RegExp(currentVersionSanitized, 'g');
                newUrl = newUrl.replace(regex, targetVersionSanitized);
            }

            if (currentLang && targetLang !== currentLang) {
                if (targetLang === 'en') { newUrl = newUrl.replace('/jp/ja/', '/us/en/'); }
                else { newUrl = newUrl.replace('/us/en/', '/jp/ja/'); }
            }

            if (newUrl !== currentUrl) { window.location.href = newUrl; }
            else { document.body.removeChild(overlay); }
        };

        // Event handler for the "Search" button to perform a title search on Google.
        searchButton.onclick = function() {
            const titleElement = document.querySelector('h1.title');
            if (!titleElement) { alert('Could not find the page title element (h1.title).'); return; }

            // Clone the title element to avoid modifying the live page.
            const clonedTitle = titleElement.cloneNode(true);
            const lastUpdated = clonedTitle.querySelector('.lastUpdatedDate');
            if (lastUpdated) { lastUpdated.remove(); } // Remove date for a cleaner search query.
            const titleText = clonedTitle.innerText.trim();

            if (!titleText) { alert('Could not extract title text.'); return; }

            // Build a prospective URL based on the user's selection in the UI.
            let prospectiveUrl = currentUrl;
            const targetVersion = versionSelect.value;
            const targetLang = document.querySelector('input[name="language"]:checked').value;

            if (currentVersion && targetVersion !== currentVersion) {
                const currentVersionSanitized = currentVersion.replace(/\./g, '-');
                const targetVersionSanitized = targetVersion.replace(/\./g, '-');
                const regex = new RegExp(currentVersionSanitized, 'g');
                prospectiveUrl = prospectiveUrl.replace(regex, targetVersionSanitized);
            }

            if (currentLang && targetLang !== currentLang) {
                if (targetLang === 'en') { prospectiveUrl = prospectiveUrl.replace('/jp/ja/', '/us/en/'); }
                else { prospectiveUrl = prospectiveUrl.replace('/us/en/', '/jp/ja/'); }
            }

            // Construct the final Google search query.
            const searchBaseUrl = prospectiveUrl.substring(0, prospectiveUrl.lastIndexOf('/') + 1);
            const searchQuery = `site:${searchBaseUrl} "${titleText}"`;
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

            window.open(googleUrl, '_blank'); // Open search results in a new tab.
            document.body.removeChild(overlay);
        };
    }

    /**
     * Creates and injects the floating launch button onto the page.
     */
    function addLaunchButton() {
        const launchButton = document.createElement('button');
        launchButton.innerText = '🚀';
        launchButton.title = 'Open Version/Language Switcher';
        launchButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9998; width: 50px; height: 50px; border-radius: 50%; border: 1px solid #ccc; background-color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.2); font-size: 24px; cursor: pointer;';

        // When clicked, it will trigger the main UI function.
        launchButton.onclick = showSwitcherUI;

        document.body.appendChild(launchButton);
    }

    /**
     * Entry point of the script.
     * Waits for the page to fully load before adding the launch button.
     */
    window.addEventListener('load', addLaunchButton);

})();