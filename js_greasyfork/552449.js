// ==UserScript==
// @name         Execute highlighter
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Adds a red outline to secondary when opponent's health is in execute range
// @author       aquagloop
// @match        https://www.torn.com/loader.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552449/Execute%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/552449/Execute%20highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // EDIT THIS LINE TO WHATEVER UR EXECUTE IS! <3 

    const DEFAULT_HEALTH_THRESHOLD_PERCENT = 21;

    const APP_CONTAINER_SELECTOR = '#react-root';
    const DESKTOP_PLAYERS_CONTAINER_SELECTOR = '.players___eKiHL';
    const DESKTOP_PLAYER_SELECTOR = '.player___wiE8R';
    const MOBILE_PLAYER_WEAPON_AREA_SELECTOR = '.playerArea___AEVBU';
    const MOBILE_OPPonent_HEADER_SELECTOR = '.headerWrapper___p6yrL[class*="rose"]';
    const HEALTH_SELECTOR_INNER = 'i[class*="iconHealth"] + span[aria-live="polite"]';
    const TARGET_SELECTOR_INNER = '#weapon_second';
    const OUTLINE_STYLE_CLASS = 'gm-health-warning-outline';

    const hasAdvancedFeatures = typeof GM_registerMenuCommand !== 'undefined';

    function addGlobalStyle(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
            return;
        }
        try {
            const style = document.createElement('style');
            style.innerHTML = css;
            document.head.appendChild(style);
        } catch (e) {
        }
    }

    addGlobalStyle(`
        .${OUTLINE_STYLE_CLASS} {
            outline: 3px solid red !important;
            outline-offset: -3px;
        }
    `);

    const getSettings = async () => {
        if (hasAdvancedFeatures) {
            const percent = await GM_getValue('healthThresholdPercent', DEFAULT_HEALTH_THRESHOLD_PERCENT);
            const testMode = await GM_getValue('testModeActive', false);
            return { percent, testMode };
        }
        return { percent: DEFAULT_HEALTH_THRESHOLD_PERCENT, testMode: false };
    };

    if (hasAdvancedFeatures) {
        GM_registerMenuCommand('Set Health Threshold %', async () => {
            const { percent: oldPercent } = await getSettings();
            const newPercentStr = prompt('Enter the health percentage threshold (e.g., 21):', oldPercent);

            if (newPercentStr) {
                const newPercent = parseFloat(newPercentStr);
                if (!isNaN(newPercent) && newPercent > 0 && newPercent < 100) {
                    await GM_setValue('healthThresholdPercent', newPercent);
                    updateOutline();
                } else {
                    alert('Invalid percentage. Please enter a number between 1 and 99.');
                }
            }
        });

        GM_registerMenuCommand('Toggle Test Outline', async () => {
            const { testMode: oldTestMode } = await getSettings();
            const newTestMode = !oldTestMode;
            await GM_setValue('testModeActive', newTestMode);
            updateOutline();
        });
    }

    let lastHealthText = '';

    const updateOutline = async () => {
        const { percent, testMode } = await getSettings();

        let leftSideContainer;
        let rightSideContainer;

        const desktopContainer = document.querySelector(DESKTOP_PLAYERS_CONTAINER_SELECTOR);
        if (desktopContainer) {
            const playerDivs = desktopContainer.querySelectorAll(DESKTOP_PLAYER_SELECTOR);
            if (playerDivs.length >= 2) {
                leftSideContainer = playerDivs[0];
                rightSideContainer = playerDivs[1];
            }
        }

        if (!leftSideContainer || !rightSideContainer) {
            leftSideContainer = document.querySelector(MOBILE_PLAYER_WEAPON_AREA_SELECTOR);
            rightSideContainer = document.querySelector(MOBILE_OPPonent_HEADER_SELECTOR);
        }

        if (!leftSideContainer || !rightSideContainer) {
            return;
        }

        const targetElement = leftSideContainer.querySelector(TARGET_SELECTOR_INNER);
        if (!targetElement) {
             return;
        }

        if (testMode && hasAdvancedFeatures) {
            targetElement.classList.add(OUTLINE_STYLE_CLASS);
            return;
        }

        const healthElement = rightSideContainer.querySelector(HEALTH_SELECTOR_INNER);
        if (!healthElement) {
            targetElement.classList.remove(OUTLINE_STYLE_CLASS);
            return;
        }

        const healthText = healthElement.innerText;
        if (healthText === lastHealthText) {
            return;
        }
        lastHealthText = healthText;

        const healthValues = healthText.split('/').map(val => parseInt(val.trim().replace(/,/g, ''), 10));

        if (healthValues.length === 2 && !isNaN(healthValues[0]) && !isNaN(healthValues[1]) && healthValues[1] > 0) {
            const [currentHealth, maxHealth] = healthValues;
            const threshold = maxHealth * (percent / 100);

            if (currentHealth < threshold) {
                targetElement.classList.add(OUTLINE_STYLE_CLASS);
            } else {
                targetElement.classList.remove(OUTLINE_STYLE_CLASS);
            }
        } else {
            targetElement.classList.remove(OUTLINE_STYLE_CLASS);
        }
    };

    function startObserver(targetNode) {
        let updateTimeout;
        const observer = new MutationObserver(() => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                updateOutline();
            }, 100);
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            characterData: true
        });
        updateOutline();
    }

    const interval = setInterval(() => {
        const mainContainer = document.querySelector(APP_CONTAINER_SELECTOR);
        if (mainContainer) {
            clearInterval(interval);
            startObserver(mainContainer);
        }
    }, 500);

})();

