// ==UserScript==
// @name         PoseMyArt Premium Auto-Unlock
// @namespace    Violentmonkey Scripts
// @match        https://posemy.art/app/*
// @grant        none
// @version      1.0
// @author       4ns0n
// @description  Automatically unlocks all Premium features on PoseMyArt.
// @license      CC0 1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/562602/PoseMyArt%20Premium%20Auto-Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/562602/PoseMyArt%20Premium%20Auto-Unlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let successCount = 0; // Track successful runs

    const intervalId = setInterval(() => {
        const appElement = document.getElementById('v-app');

        if (appElement && appElement.__vue__ && appElement.__vue__.$children[0]) {
            try {
                const mainComponent = appElement.__vue__.$children[0];

                if (
                    !mainComponent.isPremium ||
                    !mainComponent.isSignedIn ||
                    !mainComponent.userInfo ||
                    !mainComponent.userInfo.is_lifetime_access // Check if premium has been unlocked
                ) {
                    mainComponent.isPremium = true;
                    mainComponent.isSignedIn = true;
                    mainComponent.userInfo = { is_lifetime_access: true }; // Unlock Premium

                    mainComponent.$forceUpdate();

                    console.log('Set variables...');

                    successCount++;

                    if (successCount >= 2) {
                        console.log('%cPremium unlock applied!', 'color: green;'); 
                        clearInterval(intervalId);
                    }
                }
            } catch (e) {
                console.error('Unlock attempt failed, retrying...');
            }
        }
    }, 500);
})();