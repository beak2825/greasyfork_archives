// ==UserScript==
// @name         Bronze Pack Auto Opener
// @namespace    http://tampermonkey.net/
// @version      2025.1.1
// @description  Automate bronze pack method opening
// @author       metaHC
// @match        https://www.ea.com/en-au/ea-sports-fc/ultimate-team/web-app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ea.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557781/Bronze%20Pack%20Auto%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/557781/Bronze%20Pack%20Auto%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const DEFAULT_FIFTY_PACKS = 50;
    const MAX_RETRIES = 300;
    const DEFAULT_FAST_DELAY = 10;
    const DEFAULT_LONG_DELAY = 300;
    const PLAYER_SORT_DELAY = 1000;
    const SPINNER_TIMEOUT = 10000;
    let important_manager_countries = ["Brazil", "England", "Canada", "Ecuador", "Ghana", "Japan", "Ukraine", "United States", "Uruguay", "Wales"];
    // example important_manager_countries = ["Brazil", "Portugal", "Germany"];
    // just make sure that the game spells it exactly the same (capital letters, space)

    let counter = 0;
    let isRunning = false;

    // global selectors
    const unassigned_section = '.ut-unassigned-view .entityContainer';

    function delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    function waitForElement(selector, interval = 100, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                }
            }, interval);
        });
    }

    async function waitForSpinner() {
        const start = Date.now();
        while (document.querySelector('.ut-click-shield.showing')) {
            if (Date.now() - start > SPINNER_TIMEOUT) {
                console.warn('Spinner timeout');
                return false;
            }
            await delay(200);
        }
        return true;
    }

    function simulateFullClick(element) {
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            element.dispatchEvent(new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        });
    }

    async function select_classic_packs() {
        const menu_bar = document.querySelectorAll('.ea-filter-bar-item-view');

        counter = 0;
        for (const menu_tab of menu_bar) {
            if (menu_tab.textContent == "Classic Packs") {
                while (document.querySelector('.ea-filter-bar-item-view.selected').textContent != "Classic Packs" && counter < MAX_RETRIES) {
                    simulateFullClick(menu_tab);
                    await delay(DEFAULT_FAST_DELAY);
                }
                if (document.querySelector('.ea-filter-bar-item-view.selected').textContent != "Classic Packs") {
                    console.log("failed to enter classic packs");
                    return false;
                }
            }
        }
    }


    async function locate_and_open_bronze_pack() {
        // document.querySelector('.ut-store-pack-details-view.is-tradeable[data-title="Premium Bronze Pack"] button.currency.coins.primary');

        const bronze_pack = document.querySelector('.ut-store-pack-details-view.is-tradeable[data-title="Premium Bronze Pack"]');
        const open_button = bronze_pack.querySelector('button.currency.coins.primary');

        while (document.querySelector('.ea-dialog-view.ea-dialog-view-type--message') == null && counter < MAX_RETRIES) {
            simulateFullClick(open_button);
            await delay(DEFAULT_FAST_DELAY);
        }

        // click ok
        while (document.querySelector('.ea-dialog-view.ea-dialog-view-type--message .btn-standard.primary') && counter < MAX_RETRIES) {
            simulateFullClick(document.querySelector('.ea-dialog-view.ea-dialog-view-type--message .btn-standard.primary'));
            await delay(DEFAULT_FAST_DELAY);
        }
    }

    async function send_non_duplicate_bronze_player_to_club() {
        const storedPlayers = new Set();
        let processedCount = 0;
        const maxPlayers = 13;

        while (processedCount < maxPlayers) {
            // Get FRESH list each iteration
            const player_list = document.querySelectorAll(unassigned_section + ' .player');

            if (player_list.length === 0) {
                console.log('No more players found');
                break;
            }

            // Find first player that hasn't been stored yet
            let player = null;
            let playerName = null;
            let playerId = null;

            for (const p of player_list) {
                const container = p.closest('.entityContainer');
                if (!container) continue;

                // Use data-definition-id or name as unique identifier
                playerId = container.getAttribute('data-definition-id') ||
                        container.querySelector('.name')?.textContent;

                if (!storedPlayers.has(playerId)) {
                    player = p;
                    playerName = container.querySelector('.name')?.textContent || 'Unknown';
                    break;
                } else {
                    console.log(`Already stored ${playerId}, skipping`);
                }
            }

            if (!player) {
                console.log('All visible players already processed');
                break;
            }

            let counter = 0;
            let selected = false;

            while (counter < MAX_RETRIES) {
                const listItem = player.closest('.listFUTItem');
                if (!listItem) break;

                if (listItem.classList.contains('selected')) {
                    selected = true;
                    break;
                }

                console.log('attempting to click player: ' + playerName);
                simulateFullClick(player);
                await delay(DEFAULT_LONG_DELAY);
                counter++;
            }

            if (selected || counter > 0) {
                console.log('Selected player: ' + playerName);
                await delay(DEFAULT_LONG_DELAY);

                let store_btn = document.querySelector('.send-to-club');
                if (store_btn) {
                    simulateFullClick(store_btn);
                    console.log('Stored in club: ' + playerName);
                    storedPlayers.add(playerId); // Mark as stored
                    processedCount++;
                }

                await delay(DEFAULT_LONG_DELAY * 2); // Wait for potential re-render
            } else {
                console.log('Failed to select player, breaking');
                break;
            }
        }

        console.log(`Processed ${processedCount} players`);
        console.log('Stored player IDs:', Array.from(storedPlayers));
    }

    async function check_manager_country() {
        await delay(DEFAULT_FAST_DELAY);
        const bioRows = document.querySelectorAll('.ut-item-bio-row-view');
        let countryValue = null;

        for (const row of bioRows) {
            const label = row.querySelector('h1');
            if (label && label.textContent.trim() === 'Country/Region') {
                countryValue = row.querySelector('h2').textContent.trim();
                return countryValue;
            }
        }
        return null;
    }

    async function send_important_managers_to_transfer_list() {
        await delay(DEFAULT_LONG_DELAY * 2);
        let manager_list = document.querySelectorAll('.entityContainer .small.manager.staff');
        console.log('manager list length: ' + manager_list.length);
        await waitForElement('.listFUTItem');
        if (manager_list.length != 0) {
            for (const manager of manager_list) {
                simulateFullClick(manager);
                console.log('clicking manager');
                await delay(DEFAULT_LONG_DELAY);
                let manager_info_button = document.querySelector('.more');
                simulateFullClick(manager_info_button);
                // await delay(DEFAULT_FAST_DELAY);

                let country = await check_manager_country();
                console.log('manager country: ' + country);
                let back_button = document.querySelectorAll('.ut-navigation-button-control')[1]; // hard coded back button.. might error if failed
                simulateFullClick(back_button);
                await delay(DEFAULT_LONG_DELAY);

                if (country != null && important_manager_countries.includes(country)) {
                    let send_to_transfer_list_button = document.querySelector('.send-to-transfer-list');
                    simulateFullClick(send_to_transfer_list_button);
                    await delay(DEFAULT_FAST_DELAY);
                }
            }
        }

    }

    async function redeem_misc_items() {
        console.log('redeem_misc_items: start');
        await waitForElement('.listFUTItem'); // wait for list
        await delay(DEFAULT_LONG_DELAY); // small buffer

        while (true) {
            // Always query fresh
            const misc = document.querySelector('.small.misc');
            if (!misc) {
                console.log('redeem_misc_items: no misc items left');
                break;
            }

            // Select the misc item (if needed)
            simulateFullClick(misc);
            await delay(DEFAULT_LONG_DELAY);

            // Find redeem button safely
            const redeem_button = document.querySelector('.redeem-item');
            if (!redeem_button) {
                console.log('redeem_misc_items: redeem button not found, aborting');
                break;
            }

            console.log('redeem_misc_items: redeeming one misc item');
            simulateFullClick(redeem_button);
            await waitForSpinner(); // wait for server roundtrip
            await delay(DEFAULT_LONG_DELAY * 4); // give UI time to settle

            // Optional: detect global error dialog and bail
            const errorDialog = document.querySelector('.ea-dialog-view.ea-dialog-view-type--error');
            if (errorDialog) {
                console.log('redeem_misc_items: error dialog detected, stopping');
                break;
            }
        }

        console.log('redeem_misc_items: done');
    }



    async function sort_players() {
        // for failsafe i should check for presence of dup section or
        // and/or unassigned section. There could be a case where all items are duplicates, although unlikely. That would break the code.
        counter = 0;
        let items = document.querySelectorAll(unassigned_section);
        while (items.length == 0 && counter < MAX_RETRIES) {
            items = document.querySelectorAll(unassigned_section);
            await delay(DEFAULT_FAST_DELAY);
            counter++;
        }

        await send_non_duplicate_bronze_player_to_club();

        // after sending to non dupes to club, i check if there are any more players in the non dupe section.
        // if there are, exit to the store and reenter unassigned menu

        // this selector checks if there are players left, and if there is, whether it is a dupe. if its a not a dupe, then i exit and re-enter
        if (document.querySelector(unassigned_section + ' .player') && !document.querySelector(unassigned_section + ' .player').closest('.entityContainer').classList.contains('club-duplicated')) {
            const left_side_store_button = document.querySelector('.icon-store');
            simulateFullClick(left_side_store_button);
            await waitForSpinner();
            await delay(DEFAULT_FAST_DELAY);
            const unassigned_tab = document.querySelector('.ut-unassigned-tile-view');
            simulateFullClick(unassigned_tab);

            counter = 0;
            while (document.querySelectorAll(unassigned_section).length === 0 && counter < MAX_RETRIES) {
                await delay(DEFAULT_FAST_DELAY);
                counter++;
            }

            // await send_non_duplicate_bronze_player_to_club(); // failsafe? can comment out later
            // await waitForSpinner();
        }

        // make one for manager and coins too + ' .manager'
        console.log('entering manager');
        await send_important_managers_to_transfer_list();
        console.log('exiting manager');

        await redeem_misc_items();
    }

    async function quick_sell() {
        console.log('inside quick sell');
        await delay(DEFAULT_LONG_DELAY * 2);
        let quick_sell_button = document.querySelector('.currency.primary.coins');
        counter = 0;
        while (!quick_sell_button && counter < MAX_RETRIES) {
            quick_sell_button = document.querySelector('.currency.primary.coins');
            await delay(DEFAULT_FAST_DELAY);
            counter++;
        }
        counter = 0;
        while (quick_sell_button && counter < MAX_RETRIES) {
            simulateFullClick(quick_sell_button);
            await delay(DEFAULT_LONG_DELAY * 2);
            let ok_button = document.querySelector('.ut-st-button-group .btn-standard.primary');
            simulateFullClick(ok_button);

            await waitForSpinner();
            quick_sell_button = document.querySelector('.currency.primary.coins');
            counter++;
        }
        // document.querySelectorAll('.ut-st-button-group .btn-standard.primary');
    }


    async function mainLoop() {
        // ensure i am in packs -> classic packs
        // check if classic packs is selected, if not selected, return false and exit
        console.log("running = true, checking classic pack");
        let menu_bar = document.querySelector('.ea-filter-bar-item-view.selected');
        if (!menu_bar) {
            alert("Please click into my packs.");
            isRunning = false;
            return false;
        }

        if (menu_bar.textContent != "Classic Packs") {
            alert("Not inside classic packs. Please navigate to Classic Packs first.");
            isRunning = false;
            return false;
        }

        // loop
        // click classic pack in the top menu
        while (isRunning) {
            if (!isRunning) break;
            try {
                await select_classic_packs();
            } catch (err) {
                console.log("Failed to select classic pack somewhere");
                return false;
            }

            if (!isRunning) break;
            try {
                await locate_and_open_bronze_pack();
            } catch (err) {
                console.log("Failed to locate or open bronze pack");
            }

            // should wait for spinner before calling sort

            // handle pack logic
            if (!isRunning) break;
            await sort_players();

            if (!isRunning) break;
            await quick_sell();

            if (!isRunning) break;
            let back_button = document.querySelector('.ut-navigation-button-control');
            simulateFullClick(back_button);
            await waitForSpinner();
        }
    }
    async function startAutomation() {
        if (isRunning) return;
        isRunning = true;
        await mainLoop();
    }
    function stopAutomation() {
        isRunning = false;
    }

    window.addEventListener('keydown', async (e) => {
        if (e.key === '-') {
            startAutomation();
        } else if (e.key === '=' || e.key === '+') {
            stopAutomation();
        }
    });



})();