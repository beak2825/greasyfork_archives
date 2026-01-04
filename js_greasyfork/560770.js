// ==UserScript==
// @name         Jc
// @namespace    http://tampermonkey.net/
// @version      2025-05-21
// @description  only show uncen, only show more than 5 in cats
// @author       nmtt
// @license MIT
// @match        *://javct.net/*
// @match        *://*.javct.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560770/Jc.user.js
// @updateURL https://update.greasyfork.org/scripts/560770/Jc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Keys and IDs for "uncen" filter ---
    const UNCEN_FILTER_ENABLED_KEY = 'uncenFilterEnabled_example_net_v2';
    const UNCEN_STYLE_TAG_ID = 'customUncenFilterStyle_example_net';
    const uncenCssSelectorToHide = 'div.card:not(:has(span.card__cover_label--uncen))';
    const uncenCssRule = `${uncenCssSelectorToHide} { display: none !important; }`;

    // --- Keys and IDs for "hide by word(s)" filter ---
    const HIDE_WORDS_FILTER_ENABLED_KEY = 'hideWordsFilterEnabled_example_net_v2';
    const HIDE_WORDS_FILTER_CUSTOM_WORDS_KEY = 'hideWordsFilterCustomWords_example_net_v3';
    const HIDE_WORDS_FILTER_STYLE_TAG_ID = 'customHideWordsFilterStyle_example_net';
    const HIDE_WORDS_FILTER_HIDE_CLASS = 'hide-card-with-custom-words-link';
    const hideWordsFilterCssRule = `.${HIDE_WORDS_FILTER_HIDE_CLASS} { display: none !important; }`;

    // --- Keys and IDs for "only by word(s)" filter ---
    const ONLY_WORDS_FILTER_ENABLED_KEY = 'onlyWordsFilterEnabled_example_net_v1';
    const ONLY_WORDS_FILTER_CUSTOM_WORDS_KEY = 'onlyWordsFilterCustomWords_example_net_v2';
    const ONLY_WORDS_FILTER_STYLE_TAG_ID = 'customOnlyWordsFilterStyle_example_net';
    const ONLY_WORDS_FILTER_HIDE_CLASS = 'hide-card-without-custom-words-link';
    const onlyWordsFilterCssRule = `.${ONLY_WORDS_FILTER_HIDE_CLASS} { display: none !important; }`;

    // --- Keys for "Auto gallery" feature ---
    const AUTO_GALLERY_ENABLED_KEY = 'autoGalleryEnabled_example_net_v1';


    // ========== Functions for "uncen" filter ==========
    function applyOrRemoveUncenStyle(isEnabled) {
        let styleElement = document.getElementById(UNCEN_STYLE_TAG_ID);
        if (isEnabled) {
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = UNCEN_STYLE_TAG_ID;
                styleElement.type = 'text/css';
                styleElement.textContent = uncenCssRule;
                (document.head || document.documentElement).appendChild(styleElement);
            }
        } else {
            if (styleElement) {
                styleElement.parentNode.removeChild(styleElement);
            }
        }
    }

    function toggleUncenFilter() {
        let isCurrentlyEnabled = GM_getValue(UNCEN_FILTER_ENABLED_KEY, false);
        let newStatus = !isCurrentlyEnabled;
        GM_setValue(UNCEN_FILTER_ENABLED_KEY, newStatus);
        applyOrRemoveUncenStyle(newStatus);
        alert(`"Only Uncen" filter is now ${newStatus ? 'ON' : 'OFF'}.`);
    }

    // ========== Functions for "hide by word(s)" filter ==========
    function manageHideWordsFilterStyleTag(isEnabled) {
        let styleElement = document.getElementById(HIDE_WORDS_FILTER_STYLE_TAG_ID);
        if (isEnabled) {
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = HIDE_WORDS_FILTER_STYLE_TAG_ID;
                styleElement.type = 'text/css';
                styleElement.textContent = hideWordsFilterCssRule;
                (document.head || document.documentElement).appendChild(styleElement);
            }
        } else {
            if (styleElement) {
                styleElement.parentNode.removeChild(styleElement);
            }
        }
    }

    function getWordsArrayFromString(wordsString) {
        if (!wordsString || typeof wordsString !== 'string') return [];
        return wordsString.split(',')
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length > 0);
    }

    function updateCardsForHideWordsFilter() {
        const wordsString = GM_getValue(HIDE_WORDS_FILTER_CUSTOM_WORDS_KEY, "");
        const wordsToFilterArray = getWordsArrayFromString(wordsString);

        if (wordsToFilterArray.length === 0) {
            clearHideWordsFilterClasses();
            return;
        }
        const cards = document.querySelectorAll('div.card');
        cards.forEach(card => {
            let cardContainsAllWords = false;
            const links = card.querySelectorAll('a');
            for (const link of links) {
                if (link.textContent) {
                    const linkTextLower = link.textContent.toLowerCase();
                    if (wordsToFilterArray.every(filterWord => linkTextLower.includes(filterWord))) {
                        cardContainsAllWords = true;
                        break;
                    }
                }
            }
            if (cardContainsAllWords) {
                card.classList.add(HIDE_WORDS_FILTER_HIDE_CLASS);
            } else {
                card.classList.remove(HIDE_WORDS_FILTER_HIDE_CLASS);
            }
        });
    }

    function clearHideWordsFilterClasses() {
        const hiddenCards = document.querySelectorAll('.' + HIDE_WORDS_FILTER_HIDE_CLASS);
        hiddenCards.forEach(card => card.classList.remove(HIDE_WORDS_FILTER_HIDE_CLASS));
    }

    function toggleHideWordsFilter() {
        let isCurrentlyEnabled = GM_getValue(HIDE_WORDS_FILTER_ENABLED_KEY, false);
        let newStatus = !isCurrentlyEnabled;

        if (newStatus) {
            let currentWords = GM_getValue(HIDE_WORDS_FILTER_CUSTOM_WORDS_KEY, "");
            let targetWordsString = prompt("Enter words to hide cards containing ALL of them (comma-separated):", currentWords);

            if (targetWordsString === null) {
                alert("Operation cancelled. Word filter unchanged.");
                return;
            }
            const targetWordsArray = getWordsArrayFromString(targetWordsString);

            if (targetWordsArray.length === 0) {
                alert("No words entered or invalid format. Word filter not activated.");
                GM_setValue(HIDE_WORDS_FILTER_ENABLED_KEY, false);
                manageHideWordsFilterStyleTag(false);
                clearHideWordsFilterClasses();
                return;
            }
            GM_setValue(HIDE_WORDS_FILTER_CUSTOM_WORDS_KEY, targetWordsArray.join(','));
            GM_setValue(HIDE_WORDS_FILTER_ENABLED_KEY, true);
            manageHideWordsFilterStyleTag(true);
            updateCardsForHideWordsFilter();
            alert(`"Hide by Word(s)" filter activated for: "${targetWordsArray.join(', ')}".`);
        } else {
            GM_setValue(HIDE_WORDS_FILTER_ENABLED_KEY, false);
            manageHideWordsFilterStyleTag(false);
            clearHideWordsFilterClasses();
            alert(`"Hide by Word(s)" filter is now OFF.`);
        }
    }

    // ========== Functions for "only by word(s)" filter ==========
    function manageOnlyWordsFilterStyleTag(isEnabled) {
        let styleElement = document.getElementById(ONLY_WORDS_FILTER_STYLE_TAG_ID);
        if (isEnabled) {
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = ONLY_WORDS_FILTER_STYLE_TAG_ID;
                styleElement.type = 'text/css';
                styleElement.textContent = onlyWordsFilterCssRule;
                (document.head || document.documentElement).appendChild(styleElement);
            }
        } else {
            if (styleElement) {
                styleElement.parentNode.removeChild(styleElement);
            }
        }
    }

    function updateCardsForOnlyWordsFilter() {
        const wordsString = GM_getValue(ONLY_WORDS_FILTER_CUSTOM_WORDS_KEY, "");
        const wordsToFilterArray = getWordsArrayFromString(wordsString);

        if (wordsToFilterArray.length === 0) {
            clearOnlyWordsFilterClasses();
            return;
        }
        const cards = document.querySelectorAll('div.card');
        cards.forEach(card => {
            let cardContainsAllWords = false;
            const links = card.querySelectorAll('a');
            for (const link of links) {
                if (link.textContent) {
                    const linkTextLower = link.textContent.toLowerCase();
                    if (wordsToFilterArray.every(filterWord => linkTextLower.includes(filterWord))) {
                        cardContainsAllWords = true;
                        break;
                    }
                }
            }
            if (!cardContainsAllWords) {
                card.classList.add(ONLY_WORDS_FILTER_HIDE_CLASS);
            } else {
                card.classList.remove(ONLY_WORDS_FILTER_HIDE_CLASS);
            }
        });
    }

    function clearOnlyWordsFilterClasses() {
        const hiddenCards = document.querySelectorAll('.' + ONLY_WORDS_FILTER_HIDE_CLASS);
        hiddenCards.forEach(card => card.classList.remove(ONLY_WORDS_FILTER_HIDE_CLASS));
    }

    function toggleOnlyWordsFilter() {
        let isCurrentlyEnabled = GM_getValue(ONLY_WORDS_FILTER_ENABLED_KEY, false);
        let newStatus = !isCurrentlyEnabled;

        if (newStatus) {
            let currentWords = GM_getValue(ONLY_WORDS_FILTER_CUSTOM_WORDS_KEY, "");
            let targetWordsString = prompt("Enter words to show ONLY cards containing ALL of them (comma-separated):", currentWords);

            if (targetWordsString === null) {
                alert("Operation cancelled. Word filter unchanged.");
                return;
            }
            const targetWordsArray = getWordsArrayFromString(targetWordsString);

            if (targetWordsArray.length === 0) {
                alert("No words entered or invalid format. Word filter not activated.");
                GM_setValue(ONLY_WORDS_FILTER_ENABLED_KEY, false);
                manageOnlyWordsFilterStyleTag(false);
                clearOnlyWordsFilterClasses();
                return;
            }
            GM_setValue(ONLY_WORDS_FILTER_CUSTOM_WORDS_KEY, targetWordsArray.join(','));
            GM_setValue(ONLY_WORDS_FILTER_ENABLED_KEY, true);
            manageOnlyWordsFilterStyleTag(true);
            updateCardsForOnlyWordsFilter();
            alert(`"Only by Word(s)" filter activated for: "${targetWordsArray.join(', ')}".`);
        } else {
            GM_setValue(ONLY_WORDS_FILTER_ENABLED_KEY, false);
            manageOnlyWordsFilterStyleTag(false);
            clearOnlyWordsFilterClasses();
            alert(`"Only by Word(s)" filter is now OFF.`);
        }
    }

    // ========== Function to Reset All Settings ==========
    function resetAllSettingsToDefaults() {
        if (confirm("Are you sure you want to reset all filter settings to their defaults? This will turn off all filters and clear any custom words.")) {
            // Reset "Only Uncen" Filter
            GM_setValue(UNCEN_FILTER_ENABLED_KEY, false);
            applyOrRemoveUncenStyle(false);

            // Reset "Hide by Word(s)" Filter
            GM_setValue(HIDE_WORDS_FILTER_ENABLED_KEY, false);
            GM_setValue(HIDE_WORDS_FILTER_CUSTOM_WORDS_KEY, "");
            manageHideWordsFilterStyleTag(false);
            clearHideWordsFilterClasses();

            // Reset "Only by Word(s)" Filter
            GM_setValue(ONLY_WORDS_FILTER_ENABLED_KEY, false);
            GM_setValue(ONLY_WORDS_FILTER_CUSTOM_WORDS_KEY, "");
            manageOnlyWordsFilterStyleTag(false);
            clearOnlyWordsFilterClasses();

            // Reset "Auto gallery" feature (turn it ON by default if user resets all)
            // GM_setValue(AUTO_GALLERY_ENABLED_KEY, true); // Or keep its current state if preferred upon global reset

            alert("All filter settings have been reset to defaults.");
        }
    }

    // ========== Functions for "Auto gallery" feature ==========
    function toggleAutoGallery() {
        let isCurrentlyEnabled = GM_getValue(AUTO_GALLERY_ENABLED_KEY, true); // Default ON
        let newStatus = !isCurrentlyEnabled;
        GM_setValue(AUTO_GALLERY_ENABLED_KEY, newStatus);
        alert(`"Auto Gallery" feature is now ${newStatus ? 'ON' : 'OFF'}. Page may need a refresh for changes to take full effect if disabling.`);
        // If disabling, existing modifications might remain until page refresh.
        // If enabling, pageSpecificModifications will run on next suitable page load or DOMContentLoaded.
    }


    // ========== Page Specific Modifications ==========
    function pageSpecificModifications() {
        const isAutoGalleryEnabled = GM_getValue(AUTO_GALLERY_ENABLED_KEY, true); // Default ON
        if (!isAutoGalleryEnabled) {
            return; // Do nothing if the feature is disabled
        }

        if (window.location.href.includes('javct.net/v/')) {
            const galleryTabLink = document.querySelector('a.nav-link[href="#tab-gallery"]');
            if (galleryTabLink) {
                // Deactivate any other active tab link and its pane
                const activeTabLink = document.querySelector('.nav-tabs .nav-link.active');
                if (activeTabLink && activeTabLink !== galleryTabLink) {
                    activeTabLink.classList.remove('active');
                    const activePaneId = activeTabLink.getAttribute('href');
                    if (activePaneId) {
                        const activePane = document.querySelector(activePaneId);
                        if (activePane) activePane.classList.remove('active', 'show');
                    }
                }

                // Activate the target gallery tab link and its pane
                galleryTabLink.classList.add('active');
                const galleryTabPane = document.querySelector('#tab-gallery');
                if (galleryTabPane) {
                    galleryTabPane.classList.add('active', 'show');

                    // Modify DIV classes
                    const divsToModify = document.querySelectorAll('div.col-12.col-sm-12.col-md-6.col-xl-7');
                    divsToModify.forEach(div => {
                        if (div.querySelector('div.gallery')) {
                            div.className = 'col-12';
                        }
                    });

                    // Scroll to H1 (visible title)
                    //const scrollElement = document.querySelector('h1.section__title');
                    const scrollElement = document.querySelector('ul.server-list');
                    if (scrollElement) {
                        setTimeout(() => {
                            scrollElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        }, 150); // Small delay for content to render
                    }
                }
            }
        }
    }


    // --- Initial script execution and menu command registration ---

    // Apply page specific modifications on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', pageSpecificModifications);
    } else {
        pageSpecificModifications(); // DOM is already ready
    }


    // Order of registration determines menu order.
    // 1. Hide by Word(s)
    let initialHideWordsFilterState = GM_getValue(HIDE_WORDS_FILTER_ENABLED_KEY, false);
    manageHideWordsFilterStyleTag(initialHideWordsFilterState);
    if (initialHideWordsFilterState) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateCardsForHideWordsFilter);
        } else {
            updateCardsForHideWordsFilter();
        }
    }
    GM_registerMenuCommand(
        `Hide by Word(s)`,
        toggleHideWordsFilter,
        'h'
    );

    // 2. Only by Word(s)
    let initialOnlyWordsFilterState = GM_getValue(ONLY_WORDS_FILTER_ENABLED_KEY, false);
    manageOnlyWordsFilterStyleTag(initialOnlyWordsFilterState);
    if (initialOnlyWordsFilterState) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateCardsForOnlyWordsFilter);
        } else {
            updateCardsForOnlyWordsFilter();
        }
    }
    GM_registerMenuCommand(
        `Only by Word(s)`,
        toggleOnlyWordsFilter,
        'o'
    );

    // 3. Only Uncen
    let initialUncenFilterState = GM_getValue(UNCEN_FILTER_ENABLED_KEY, false);
    applyOrRemoveUncenStyle(initialUncenFilterState);
    GM_registerMenuCommand(
        `Only Uncen`,
        toggleUncenFilter,
        'u'
    );

    // 4. Auto gallery
    GM_registerMenuCommand(
        `Auto gallery`,
        toggleAutoGallery,
        'a'
    );

    // 5. Reset
    GM_registerMenuCommand(
        `Reset`,
        resetAllSettingsToDefaults,
        'r'
    );

})();
