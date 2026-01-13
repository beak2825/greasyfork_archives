// ==UserScript==
// @name         Dom's Scum Mugbot
// @namespace    Scumland
// @version      1
// @description  Display remaining hospital time on attack loader page with reload button + Enable attack button on profiles when user is in hospital + Auto-click fight button and weapon
// @author       Dsuttz [1561637]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID*
// @match        https://www.torn.com/profiles.php*
// @run-at       document-end
// @connect      api.torn.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562456/Dom%27s%20Scum%20Mugbot.user.js
// @updateURL https://update.greasyfork.org/scripts/562456/Dom%27s%20Scum%20Mugbot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    debugger;

    // Configuration
    const notifyAlerts = GM_getValue("notifyAlerts", true);
    const notifyAlertSecs = GM_getValue("notifyAlertSecs", 20);
    let api_key = GM_getValue('gm_api_key');

    // Rate limiting configuration
    const MAX_SAFE_PAGES = 3; // Pages before throttling kicks in
    const BASE_POLL_INTERVAL = 2000; // Base polling interval in ms
    const MAX_POLL_INTERVAL = 10000; // Maximum polling interval in ms

    // State variables
    let wasInHosp = false;
    let outAt = 0;
    let clockTimer = null;
    let apiTimer = null;
    let notified = false;
    let lastActivity = Date.now(); // Track user activity
    let pageId = generatePageId(); // Unique ID for this page instance
    let currentPollInterval = BASE_POLL_INTERVAL;

    // Get user ID from URL (different for each page type)
    let XID = null;
    let isAttackPage = window.location.href.includes('loader.php?sid=attack');
    let isProfilePage = window.location.href.includes('profiles.php?XID=');

    if (isAttackPage) {
        XID = new URLSearchParams(location.search).get("user2ID");
    } else if (isProfilePage) {
        XID = new URLSearchParams(location.search).get("XID");
    }

    // Initialize
    validateApiKey();

    // Register this page and start heartbeat
    if (isAttackPage) {
        registerPage();
        startHeartbeat();
        // Try to auto-click fight button on page load
        autoClickFightButton();
    }

    // Track user activity for anti-detection
    document.addEventListener('mousemove', () => lastActivity = Date.now());
    document.addEventListener('keydown', () => lastActivity = Date.now());
    document.addEventListener('click', () => lastActivity = Date.now());

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        unregisterPage();
    });

    if (isAttackPage) {
        addStyles();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', getHospTime);
        } else {
            getHospTime();
        }
    } else if (isProfilePage && api_key && XID) {
        checkUserStatusForProfile();
    }

    // Auto-click the fight button
    function autoClickFightButton(retries = 0, maxRetries = 20) {
        // Look for "Start fight" or "Join fight" button
        let fightButton = $('button.torn-btn:contains("Start fight")').first();

        if (!fightButton.length) {
            fightButton = $('button.torn-btn:contains("Join fight")').first();
        }

        if (fightButton.length > 0) {
            console.log('Found fight button, clicking...');
            fightButton[0].click();

            // After clicking fight button, start auto-attacking with weapon
            setTimeout(() => startAutoAttack(), 500);
            return true;
        }

        // Retry if button not found yet
        if (retries < maxRetries) {
            setTimeout(() => autoClickFightButton(retries + 1, maxRetries), 100);
        } else {
            console.log('Fight button not found after ' + maxRetries + ' attempts');
        }

        return false;
    }

    // Automatically attack with weapon repeatedly
    function startAutoAttack() {
        let attackInterval = null;
        let consecutiveFailures = 0;
        const maxFailures = 5; // Stop after 5 consecutive failures to find weapon

        function attackWithWeapon() {
            // Find the melee weapon (or any weapon slot)
            let weaponSlot = $('#weapon_melee[role="button"]').first();

            // If melee not found, try any weapon slot
            if (!weaponSlot.length) {
                weaponSlot = $('[id^="weapon_"][role="button"]').first();
            }

            if (weaponSlot.length > 0) {
                consecutiveFailures = 0;

                // Check if weapon is still clickable (not disabled/greyed out)
                let isDisabled = weaponSlot.hasClass('disabled') ||
                                weaponSlot.attr('aria-disabled') === 'true' ||
                                weaponSlot.css('pointer-events') === 'none';

                if (!isDisabled) {
                    console.log('Clicking weapon...');

                    // Trigger click event
                    weaponSlot[0].click();

                    // Also try triggering with jQuery in case native click doesn't work
                    weaponSlot.trigger('click');

                } else {
                    console.log('Weapon appears disabled, fight may be over');
                    if (attackInterval) {
                        clearInterval(attackInterval);
                        attackInterval = null;
                    }
                }
            } else {
                consecutiveFailures++;
                console.log('Weapon slot not found, attempt ' + consecutiveFailures);

                if (consecutiveFailures >= maxFailures) {
                    console.log('Weapon slot not found after ' + maxFailures + ' attempts, stopping auto-attack');
                    if (attackInterval) {
                        clearInterval(attackInterval);
                        attackInterval = null;
                    }
                }
            }

            // Check if fight is over by looking for victory/defeat indicators
            if ($('[class*="winner"]').length > 0 ||
                $('[class*="loser"]').length > 0 ||
                $('button:contains("Leave")').length > 0) {
                console.log('Fight appears to be over');
                if (attackInterval) {
                    clearInterval(attackInterval);
                    attackInterval = null;
                }
            }
        }

        // Start attacking every 100ms (adjust as needed)
        attackInterval = setInterval(attackWithWeapon, 100);

        // Also do an immediate first attack
        attackWithWeapon();
    }

    // Generate unique page ID
    function generatePageId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Register this page in localStorage
    function registerPage() {
        let pages = JSON.parse(GM_getValue('active_pages', '{}'));
        pages[pageId] = {
            timestamp: Date.now(),
            url: window.location.href,
            xid: XID
        };
        GM_setValue('active_pages', JSON.stringify(pages));
    }

    // Unregister this page from localStorage
    function unregisterPage() {
        let pages = JSON.parse(GM_getValue('active_pages', '{}'));
        delete pages[pageId];
        GM_setValue('active_pages', JSON.stringify(pages));
    }

    // Start heartbeat to keep this page registered
    function startHeartbeat() {
        setInterval(() => {
            registerPage();
            cleanupStalePages();
            updatePageCounter();
            adjustPollingInterval();
        }, 5000);
    }

    // Clean up pages that haven't updated in 30 seconds
    function cleanupStalePages() {
        let pages = JSON.parse(GM_getValue('active_pages', '{}'));
        let now = Date.now();
        let cleaned = false;

        for (let id in pages) {
            if (now - pages[id].timestamp > 30000) {
                delete pages[id];
                cleaned = true;
            }
        }

        if (cleaned) {
            GM_setValue('active_pages', JSON.stringify(pages));
        }
    }

    // Get number of active pages
    function getActivePageCount() {
        let pages = JSON.parse(GM_getValue('active_pages', '{}'));
        return Object.keys(pages).length;
    }

    // Update the page counter display
    function updatePageCounter() {
        let pageCount = getActivePageCount();
        let counterElement = $("#page-counter");

        if (counterElement.length === 0) {
            // Counter doesn't exist yet, will be created when timer starts
            return;
        }

        let isThrottled = pageCount > MAX_SAFE_PAGES;
        counterElement.text(`Watching Pages: ${pageCount}`);

        if (isThrottled) {
            counterElement.removeClass('normal-pages').addClass('throttled-pages');
            counterElement.attr('title', 'Polling throttled to prevent API rate limiting - Updates will not be as fast');
        } else {
            counterElement.removeClass('throttled-pages').addClass('normal-pages');
            counterElement.attr('title', `${pageCount} active page${pageCount !== 1 ? 's' : ''} monitoring`);
        }
    }

    // Adjust polling interval based on number of pages
    function adjustPollingInterval() {
        let pageCount = getActivePageCount();

        if (pageCount <= MAX_SAFE_PAGES) {
            currentPollInterval = BASE_POLL_INTERVAL;
        } else {
            // Increase interval proportionally to keep total requests reasonable
            // Aim for max 90 requests per minute across all pages
            let targetRPM = 90;
            let requestsPerPagePerMinute = targetRPM / pageCount;
            let intervalSeconds = 60 / requestsPerPagePerMinute;
            currentPollInterval = Math.min(intervalSeconds * 1000, MAX_POLL_INTERVAL);
        }

        // Restart timer with new interval if it's running
        if (apiTimer) {
            clearInterval(apiTimer);
            apiTimer = setInterval(getHospTime, currentPollInterval);
        }
    }

    // Add red flashing glow to reload button
    function addRedFlashingGlow() {
        let reloadBtn = $("#xrefresh");
        if (reloadBtn.length > 0) {
            reloadBtn.addClass("red-flash-glow");
        } else if (isProfilePage && api_key && XID) {
            checkUserStatusForProfile();
        }
    }

    // Validate and prompt for API key if needed
    function validateApiKey() {
        if (!api_key || api_key === 'undefined' || api_key === '') {
            let scriptName = isAttackPage ? 'Hospital Timer' : 'Profile Attack Enabler';
            let text = scriptName + ':\n\nPlease enter your API key.\n' +
                      'Your key will be saved locally and kept private.\n' +
                      'Only limited access is required. Please use a ';
            api_key = prompt(text, "");
            if (api_key) {
                GM_setValue('gm_api_key', api_key);
            }
        }
    }

    // Query Torn API for user status
    function getHospTime() {
        if (!api_key || !XID) return;
        const currentUnixTime = Math.floor(Date.now() / 1000);

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/user?id=${XID}&timestamp=${currentUnixTime}&key=${api_key}`,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; TornScript/1.0)',

            },
            onload: function(response) {
                try {
                    let jsonObj = JSON.parse(response.responseText);

                    if (jsonObj.error) {
                        console.error('API Error:', jsonObj.error);
                        if (jsonObj.error.code === 2) {
                            GM_setValue('gm_api_key', '');
                            alert('Invalid API key. Please refresh and enter a valid key.');
                        }
                        return;
                    }
                    handleApiResponse(jsonObj);
                } catch (e) {
                    console.error('Error parsing API response:', e);
                }
            },
            onerror: function(response) {
                console.error('API request failed:', response);
                if (wasInHosp && !apiTimer) {
                    apiTimer = setInterval(getHospTime, currentPollInterval);
                }
            }
        });
    }

    // Handle API response
    function handleApiResponse(jsonObj) {

        let status = jsonObj.profile?.status;

        if (!status || status.state !== "Hospital") {
            $("#time-wrap").remove();
            if (apiTimer) {
                clearInterval(apiTimer);
                apiTimer = null;
            }
            if (clockTimer) {
                clearInterval(clockTimer);
                clockTimer = null;
            }
            if (wasInHosp) {
                // Add red flashing glow to reload button immediately
                addRedFlashingGlow();

                if (Date.now() - lastActivity < 60000) { // Active in last minute
                    location.reload();
                }
            }
            wasInHosp = false;
            return;
        }

        outAt = status.until;

        if (!apiTimer) {
            apiTimer = setInterval(getHospTime, currentPollInterval);
        }

        if (!clockTimer && getSecsUntilOut() > 0) {
            startHospTimer();
        }
        wasInHosp = true;
    }

    // Start the hospital timer display
    function startHospTimer(retries = 0) {

        if ($("#time-wrap").length > 0) return;

        let hdr = $("[class^='titleContainer_'] > h4");
        if (!$(hdr).length) {
            if (retries++ < 20) {
                return setTimeout(startHospTimer, 250, retries);
            }
            return;
        }

        let clock = `
            <div id="time-wrap" class='timer-container'>
                <span id='time-left' class="time-span"></span>
                <span id='page-counter' class="page-counter normal-pages" title="1 active page monitoring">Pages: 1</span>
            </div>
        `;

        let reloadBtn = `
            <span class="xrt-btn btn">
                <input id="xrefresh" class="xedx-torn-btn" value="Reload">
            </span>
        `;

        $(hdr).parent().css("position", "relative");
        $(hdr).parent().append($(clock));
        $(hdr).parent().append($(reloadBtn));

        $("#xrefresh").on('click', function() {
            location.reload();
        });

        $(hdr).addClass("header-flex");

        // Initial update of page counter
        updatePageCounter();

        updateHospClock();
        clockTimer = setInterval(updateHospClock, 1000);
    }

    // Get seconds until out of hospital
    function getSecsUntilOut() {
        let nowSecs = new Date().getTime() / 1000;
        return outAt - nowSecs;
    }

    // Update the hospital clock display
    function updateHospClock() {

        let diff = getSecsUntilOut();

        if (diff <= 1) {
            // Add red flashing glow to reload button immediately
            addRedFlashingGlow();

            if (Date.now() - lastActivity < 60000) { // Active in last minute
                location.reload();
            }
            return;
        }

        checkAlerts(diff);

        let date = new Date(null);
        date.setSeconds(diff);
        let timeStr = date.toISOString().slice(11, 19);
        $("#time-left").text(timeStr);
    }

    // Check if we should alert user
    function checkAlerts(secs) {
        if (secs < notifyAlertSecs && !notified && document.hidden && notifyAlerts) {
            doBrowserNotify();
        }
        if (secs <= 10) {
            $("#time-left").addClass("flash-green");
        }
    }

    // Send browser notification
    function doBrowserNotify() {
        notified = true;
        let name = $($("[class^='player_']")[1]).find("[id^='playername']").text() || "Player";
        let msg = name + " out of hospital in " + notifyAlertSecs + " seconds!";

        GM_notification({
            title: 'Hospital Timer',
            text: msg,
            timeout: notifyAlertSecs * 1000,
            onclick: function() {
                window.focus();
            }
        });
    }

    // Add CSS styles
    function addStyles() {
        GM_addStyle(`
            .header-flex {
                display: flex;
                flex-flow: row wrap;
            }

            .timer-container {
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-content: center;
                gap: 10px;
            }

            .time-span {
                padding: 2px 20px;
                position: absolute;
                top: 50%;
                right: 110px;
                transform: translateY(-50%);
                font-size: 18px;
                font-weight: bold;
            }

            .page-counter {
                position: absolute;
                top: 50%;
                right: 225px;
                transform: translateY(-50%);
                font-size: 12px;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 3px;
                cursor: help;
            }

            .page-counter.normal-pages {
                color: #28a745;
                background-color: rgba(40, 167, 69, 0.1);
                border: 1px solid rgba(40, 167, 69, 0.3);
            }

            .page-counter.throttled-pages {
                color: #dc3545;
                background-color: rgba(220, 53, 69, 0.1);
                border: 1px solid rgba(220, 53, 69, 0.3);
                animation: pulse-red 2s ease-in-out infinite;
            }

            @keyframes pulse-red {
                0% { opacity: 1; }
                50% { opacity: 0.6; }
                100% { opacity: 1; }
            }

            .xrt-btn {
                margin-left: auto;
                margin-right: 10px;
                float: right;
            }

            .xedx-torn-btn {
                height: 24px;
                width: 74px;
                line-height: 22px;
                font-family: "Fjalla One", Arial, serif;
                font-size: 14px;
                font-weight: normal;
                text-align: center;
                text-transform: uppercase;
                border-radius: 5px;
                padding: 0 10px;
                cursor: pointer;
                color: #555;
                color: var(--btn-color);
                text-shadow: 0 1px 0 #FFFFFF40;
                text-shadow: var(--btn-text-shadow);
                background: linear-gradient(180deg, #DEDEDE 0%, #F7F7F7 25%, #CFCFCF 60%, #E7E7E7 78%, #D9D9D9 100%);
                background: var(--btn-background);
                border: 1px solid #aaa;
                border: var(--btn-border);
                display: inline-block;
                vertical-align: middle;
            }

            .xedx-torn-btn:hover {
                filter: brightness(2.00);
            }

            .xedx-torn-btn:active {
                filter: brightness(0.80);
            }

            .flash-green {
                animation-name: flash-green;
                animation-duration: 0.4s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-play-state: running;
            }

            @keyframes flash-green {
                from { color: #00ee00; }
                to { color: #eeeeee; }
            }

            @keyframes flash-red-glow {
                0% {
                    box-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 10px #ff0000;
                    border-color: #ff0000;
                }
                50% {
                    box-shadow: 0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 35px #ff0000;
                    border-color: #ff4444;
                }
                100% {
                    box-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 10px #ff0000;
                    border-color: #ff0000;
                }
            }

            .red-flash-glow {
                animation: flash-red-glow 0.5s ease-in-out infinite !important;
                border: 2px solid #ff0000 !important;
            }
        `);
    }

    // ===== PROFILE PAGE FUNCTIONALITY =====

    // Check user status for profile pages
    function checkUserStatusForProfile() {
        let url = `https://api.torn.com/user/${XID}?selections=basic&key=${api_key}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    let jsonObj = JSON.parse(response.responseText);
                    if (jsonObj.error) {
                        console.error('API Error:', jsonObj.error);
                        if (jsonObj.error.code === 2) {
                            GM_setValue('gm_api_key', '');
                            alert('Invalid API key. Please refresh and enter a valid key.');
                        }
                        return;
                    }
                    handleUserStatusForProfile(jsonObj);
                } catch (e) {
                    console.error('Error parsing API response:', e);
                }
            },
            onerror: function(response) {
                console.error('API request failed:', response);
            }
        });
    }

    // Handle user status for profile pages
    function handleUserStatusForProfile(userData) {
        let status = userData.status;

        if (status && status.state === "Hospital") {
            enableAttackButton();
        }
    }

    // Enable the attack button on profile pages
    function enableAttackButton() {
        let attempts = 0;
        let maxAttempts = 5;

        function tryEnable() {
            let attackBtn = $(`#button0-profile-${XID}`);

            if (!attackBtn.length) {
                attackBtn = $("[id^='button0-profile-']").first();
            }

            if (!attackBtn.length) {
                attackBtn = $("input[value='Attack']").first();
            }

            if (!attackBtn.length) {
                attackBtn = $("button:contains('Attack')").first();
            }

            if (attackBtn.length > 0) {
                let isDisabled = attackBtn.prop('disabled') || attackBtn.hasClass('disabled');

                if (isDisabled) {
                    attackBtn.removeAttr('disabled').prop('disabled', false);
                    attackBtn.removeClass('disabled');
                    attackBtn.css({
                        'opacity': '1',
                        'pointer-events': 'auto',
                        'cursor': 'pointer'
                    });

                    if (attackBtn.attr('title')) {
                        let title = attackBtn.attr('title').toLowerCase();
                        if (title.includes('hospital') || title.includes('disabled') || title.includes('cannot')) {
                            attackBtn.removeAttr('title');
                        }
                    }

                    attackBtn.off('click.disabled');
                    restoreAttackButtonClick(attackBtn);
                    addBlueGlowEffect(attackBtn);

                    return true;
                }
                return true;
            }

            if (attempts < maxAttempts) {
                attempts++;
                setTimeout(tryEnable, 250);
            }

            return false;
        }

        tryEnable();
    }

    // Restore click functionality to attack button
    function restoreAttackButtonClick(attackBtn) {
        let attackUrl = attackBtn.attr('data-href') || attackBtn.attr('href');

        if (!attackUrl) {
            attackUrl = `/loader.php?sid=attack&user2ID=${XID}`;
        }

        attackBtn.on('click.attack', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (attackUrl.startsWith('http')) {
                window.location.href = attackUrl;
            } else {
                window.location.href = 'https://www.torn.com' + attackUrl;
            }
        });

        let enabledAttackBtns = $('.profile-button-attack').not('.disabled');
        if (enabledAttackBtns.length > 0) {
            let enabledBtn = $(enabledAttackBtns[0]);
            let events = $._data(enabledBtn[0], 'events');

            if (events && events.click) {
                events.click.forEach(function(event) {
                    attackBtn.on('click.copied', event.handler);
                });
            }
        }
    }

    // Add blue glow effect to attack button
    function addBlueGlowEffect(attackBtn) {
        attackBtn.css({
            'box-shadow': '0 0 10px #007bff, 0 0 20px #007bff, 0 0 30px #007bff',
            'border': '2px solid #007bff',
            'animation': 'hospital-glow 2s ease-in-out infinite alternate'
        });

        if (!$('#hospital-glow-styles').length) {
            $('head').append(`
                <style id="hospital-glow-styles">
                    @keyframes hospital-glow {
                        from {
                            box-shadow: 0 0 5px #007bff, 0 0 10px #007bff, 0 0 15px #007bff;
                        }
                        to {
                            box-shadow: 0 0 10px #007bff, 0 0 20px #007bff, 0 0 30px #007bff;
                        }
                    }
                </style>
            `);
        }
    }

})();