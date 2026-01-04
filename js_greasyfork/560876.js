// ==UserScript==
// @name        Custom LEADERBOARD 🧬
// @namespace   https://popmundo.com/
// @version     1.9.9
// @description Replaces achievement table with custom leaderboard per Social Club, injects styled family tree, and adds online/inactivity/death status checking
// @author      chk
// @match       https://*.popmundo.com/World/Popmundo.aspx/SocialClub/AchievementPoints/*
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_setValue
// @grant       GM_getValue
// @connect     *
// @downloadURL https://update.greasyfork.org/scripts/560876/Custom%20LEADERBOARD%20%F0%9F%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/560876/Custom%20LEADERBOARD%20%F0%9F%A7%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🚨 Delay settings
    const FETCH_DELAY = 500; // Delay between character fetches for full data
    const ONLINE_CHECK_DELAY = 100; // Delay between online status checks
    const INACTIVE_CHECK_DELAY = 100; // Delay between inactivity status checks
    const HEALTH_MOOD_CHECK_DELAY = 100; // Delay between health & mood checks
    const INACTIVITY_THRESHOLD_DAYS = 5; // Threshold for 'Inactive' badge
    const DEFAULT_POINTS = "1240"; // Default points for all characters
    const ALERT_CHECK_INTERVAL = 120000; // 2 minutes in milliseconds
    const ALERT_STORAGE_KEY = 'onlineAlertStatus';

    // --- SMART Custom Rows ---
    // Just list characters as {id: "characterID", name: "Character Name"}
    // Points will be set automatically to DEFAULT_POINTS
    const smartRows = {
        "7370": [
            {id: "3252082", name: "Lain Iwakura"},
            {id: "3295314", name: "Tyra Katana"},
            {id: "3267953", name: "Julián Iwakura"},
            {id: "3389930", name: "Allen Iwakura"},
            {id: "3373307", name: "Melina Dijns"},
            {id: "3386933", name: "Vaula Dijns"},
            {id: "3553720", name: "Yuki Iwakura"},
            {id: "3607777", name: "Chihiro Iwakura"},
            {id: "3481277", name: "James Florence"},
            {id: "3615967", name: "Tomi Kuno"},
            {id: "3616027", name: "Yume Iwakura"},
            {id: "3622690", name: "Natsu Koga 💀"},
            {id: "3621638", name: "Yukio Hayata 💀"},
            {id: "3616429", name: "Akihisa Takai 💀"},
        ],
        "7252": [
            {id: "2913778", name: "Hande Kawamura", points: "1435"},
            {id: "3563409", name: "Sakura Kawamura", points: "1355"},
            {id: "3590641", name: "Natsu Kawamura", points: "1405"},
            {id: "2803340", name: "Young-Jae Choi", points: "1405"},
            {id: "3493670", name: "Meryl Choi", points: "1405"},
            {id: "3591017", name: "Felix Choi"},
            {id: "3618490", name: "Juro Kawamura"},
            {id: "3556283", name: "April Kawamura", points: "1405"},
            {id: "3621325", name: "Katsuhisa Fujiwara"},
            {id: "3622787", name: "Ayumi Miyamae", points: "1405"}
        ],
        "7253": [
            {id: "2699715", name: "Lolita Winterbourn"},
            {id: "3078086", name: "Afrodite Simonelli"},
            {id: "3107170", name: "Aliyah Li"},
            {id: "3108138", name: "XinJie Diamantis"},
            {id: "3166293", name: "Kiyoko Diamantis"},
            {id: "3236271", name: "Blizzard Machineheart"},
            {id: "3574901", name: "Mickey Slater"},
            {id: "3583371", name: "Blanche Blackshadow"},
            {id: "2390263", name: "Mizuki Jung"},
            {id: "3211338", name: "Crash Saint London 💀"},
            {id: "3620259", name: "Ann-Christin Gottstein 💀"},
        ],
        "7256": [
            {id: "1912560", name: "Mei Moon-Dragon"},
            {id: "2913778", name: "Chae-Rin Choi"},
            {id: "3252082", name: "Lain Iwakura"},
            {id: "3347939", name: "Tokki Shin"},
            {id: "3532036", name: "Light Yagami"},
            {id: "3537089", name: "Vita Matsuzawa"},
            {id: "3549968", name: "Nana Moon"},
            {id: "3576749", name: "Natsu Nishimura"},
            {id: "3597918", name: "Osamu Yoshizaki"},
            {id: "3600890", name: "Cressida Wishart"},
            {id: "3606856", name: "Alba V."},
            {id: "3610148", name: "Chiyuki Mikkelsen"},
            {id: "3610205", name: "Uma Sugihara"},
            {id: "3614091", name: "Usagi Ozu"},
            {id: "3614164", name: "Shimae Kataoka"},
            {id: "3614368", name: "Uma Honami"},
            {id: "3616381", name: "Ilaria Fukuyama"},
            {id: "3618255", name: "Yoshiteru Yamasaki"},
            {id: "3619482", name: "Chieko Tansho"},
            {id: "3619677", name: "Sia Dratzig"},
            {id: "3621269", name: "Nae Satou"},
            {id: "3621313", name: "Nan Akamatsu"},
            {id: "3545774", name: "Kim Lerwill"},
            {id: "3616687", name: "Tsukiko Kikutake"},
            {id: "3617848", name: "Yoshino Yamashita 💀"},
        ],
        "7257": [
            {id: "1150432", name: "Saúl Rojas"},
            {id: "1488072", name: "Thraex Weisdorf"},
            {id: "1815938", name: "Steve Harris"},
            {id: "3177806", name: "Sakura Bae"},
            {id: "3267184", name: "Gerard Jäger "},
            {id: "3351712", name: "André Kaiser"},
            {id: "3425107", name: "Haskell Curry"},
            {id: "3492408", name: "Jimmie Hendrix"},
            {id: "3504219", name: "Jorja Jäger"},
            {id: "3525869", name: "Genco Hocazâde"},
            {id: "3559444", name: "Nuri Öyken"},
            {id: "3561149", name: "Alan Powell"},
            {id: "3571403", name: "Derrick Belfort"},
            {id: "3581228", name: "Clyde Winslow"},
            {id: "3594697", name: "Gaia Noctareth"},
            {id: "3595413", name: "Marc Wasserscheid"},
            {id: "3596398", name: "Robin Nilsen"},
            {id: "3606980", name: "Corey Harden"},
            {id: "3614055", name: "James Satanás"},
            {id: "3495747", name: "Bullet Chavo"},
            {id: "3455980", name: "Heinar Hartmeier"},
            {id: "3584806", name: "Cindy Selly 💀"},
            {id: "3612741", name: "Des Barratt 💀"},
        ],
        "7266": [
            {id: "3542726", name: "Mika Park"},
            {id: "3556385", name: "Lucas Sky"},
            {id: "3576410", name: "Jay Lynx Jun"},
            {id: "3617745", name: "Taiki Ikeda 💤"}
        ],
        "7265": [
            {id: "3281447", name: "Luvenia Moriarty"},
            {id: "3447787", name: "Sakura Hojo"},
            {id: "3457449", name: "Jae-Min Hojo"},
            {id: "3519515", name: "Namiji Nakayama"},
            {id: "3555838", name: "Devon Xue"},
            {id: "3599687", name: "Kiyotoshi Takaoka"},
            {id: "3607561", name: "Akali Wong"},
            {id: "3610286", name: "Hyesun Kim"},
            {id: "3613373", name: "Toshimitsu Uesugi"},
            {id: "3614190", name: "Suiko Amori"},
            {id: "3615572", name: "Ayana Slowley"},
            {id: "3617447", name: "Misato Yanagita"},
            {id: "3617492", name: "Kumiko Isayama"},
            {id: "3619671", name: "Suzuko Sugawara"},
            {id: "3596238", name: "Lara Kwon"},
            {id: "3622990", name: "Arumi Watabe"},
            {id: "3623501", name: "Eriko Tanaka"},
        ],
        "7478": [
            {id: "3577905", name: "Kia Rivera"},
            {id: "2887796", name: "Kitty Buttercup 么"},
            {id: "3498957", name: "Park Wonbin"},
            {id: "3568978", name: "Lee Sohee"},
            {id: "3570664", name: "Osaki Shotaro"},
            {id: "3570722", name: "Jung Sungchan"},
            {id: "3571113", name: "Song Eunseok"},
            {id: "3571876", name: "Martin Edwards"},
            {id: "3572154", name: "Keonho Ahn"},
            {id: "3572316", name: "James Yufan"},
            {id: "3572401", name: "Juhoon Kim"},
            {id: "3065847", name: "Rei Xie"},
            {id: "3579423", name: "Tomie Ito 富江"},
            {id: "3247354", name: "Koko Koharu"},
            {id: "3602175", name: "Ruby Ross"},
            {id: "3602139", name: "Nova Xie"},
            {id: "3620400", name: "Chuu Xxnana"},
            {id: "3620479", name: "Yuqi Kawai 㡺"},
            {id: "3616694", name: "Betty Doty"},
            {id: "3613832", name: "Kookie XXIN ア"},
            {id: "3613365", name: "Ryuzen 月影"},
            {id: "3570776", name: "Yuzu Bunny 月"},
            {id: "3609829", name: "Alina Burrell"},
            {id: "3614576", name: "Ruth Kemp"},
            {id: "3580037", name: "Ruby Hamm"},
            {id: "3613871", name: "Yuki Makino"},
            {id: "3616012", name: "Tomie Xie"}
        ],
    };

    const clubId = window.location.pathname.split('/').pop();
    let characterDetailsCache = {};
    let inactivityCache = {};
    let deathStatusCache = {};
    let healthMoodCache = {};
    let detailsLoaded = false;
    let alertIntervalId = null;
    let lastOnlineStatus = {}; // Store last known online status for alerts
    let isAlertActive = false;

    // Initialize from storage
    function initAlertStatus() {
        const storedStatus = GM_getValue(ALERT_STORAGE_KEY, false);
        isAlertActive = storedStatus;
        if (isAlertActive) {
            startAlertMonitoring();
        }
    }

    // Request notification permission
    function requestNotificationPermission() {
        if ("Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }
            // Also ensure we have permission for GM_notification
            if (typeof GM_notification !== 'undefined') {
                // GM_notification usually works without explicit permission request
                console.log('GM_notification available');
            }
        }
    }

    // Send Chrome notification
    function sendNotification(title, message, characterId = null) {
        // Create notification options for GM_notification
        const notificationOptions = {
            text: message,
            title: title,
            silent: false
        };

        if (characterId) {
            notificationOptions.onclick = function() {
                window.open(`/World/Popmundo.aspx/Character/${characterId}`, '_blank');
            };
        }

        // Try GM_notification first (for Tampermonkey)
        if (typeof GM_notification !== 'undefined') {
            GM_notification(notificationOptions);
        }
        // Fallback to HTML5 notifications
        else if ("Notification" in window && Notification.permission === "granted") {
            const notification = new Notification(title, {
                body: message,
                icon: 'https://popmundo.com/Static/Icons/TinyIcon_World.png'
            });

            if (characterId) {
                notification.onclick = function() {
                    window.open(`/World/Popmundo.aspx/Character/${characterId}`, '_blank');
                    notification.close();
                };
            }
        }
        // Fallback to alert
        else {
            console.log(`${title}: ${message}`);
        }
    }

    // Start monitoring for online alerts
    function startAlertMonitoring() {
        if (alertIntervalId) {
            clearInterval(alertIntervalId);
        }

        isAlertActive = true;
        GM_setValue(ALERT_STORAGE_KEY, true);

        // Initial scan to populate lastOnlineStatus
        scanForOnlineCharacters().then(() => {
            // Start periodic scanning every 2 minutes
            alertIntervalId = setInterval(scanForOnlineCharacters, ALERT_CHECK_INTERVAL);
            console.log('Online alert monitoring started');
        });
    }

    // Stop monitoring for online alerts
    function stopAlertMonitoring() {
        if (alertIntervalId) {
            clearInterval(alertIntervalId);
            alertIntervalId = null;
        }

        isAlertActive = false;
        GM_setValue(ALERT_STORAGE_KEY, false);
        console.log('Online alert monitoring stopped');
    }

    // Scan all characters and check for online status changes
    async function scanForOnlineCharacters() {
        const table = document.querySelector('#tablecharts tbody');
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        console.log(`[${timeString}] Scanning ${rows.length} characters for online status...`);

        let onlineCount = 0;
        let offlineCount = 0;
        let errorCount = 0;

        // Check each character
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const link = row.querySelector('a[href*="/Character/"]');

            if (link) {
                const name = link.textContent.trim();
                // Skip deceased characters
                if (name.includes('💀')) {
                    continue;
                }

                const id = link.href.match(/Character\/(\d+)/)?.[1];
                if (id) {
                    try {
                        const isOnline = await checkCharacterOnline(id);
                        const previousStatus = lastOnlineStatus[id];

                        // Debug logging
                        console.log(`  ${name} (${id}): ${isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'} (was: ${previousStatus === true ? '🟢' : previousStatus === false ? '🔴' : '❓'})`);

                        if (isOnline) onlineCount++;
                        else offlineCount++;

                        // Check if status changed from offline to online
                        if (isOnline && (!previousStatus || previousStatus === false)) {
                            // Character just came online!
                            const notificationTitle = `${name} is now online!`;
                            const notificationMessage = `${name} has just logged into Popmundo`;

                            sendNotification(notificationTitle, notificationMessage, id);
                            console.log(`📢 ${name} is now online!`);

                            // Update the online status indicator if visible
                            updateOnlineIndicator(id, true);
                        }

                        // Update last known status
                        lastOnlineStatus[id] = isOnline;

                        // Small delay between checks to avoid rate limiting
                        await wait(200);

                    } catch (error) {
                        errorCount++;
                        console.error(`Error checking ${name}:`, error);
                    }
                }
            }
        }

        console.log(`[${timeString}] Scan complete. Online: ${onlineCount}, Offline: ${offlineCount}, Errors: ${errorCount}. Next scan in 2 minutes.`);
    }

    // Update online indicator in the table
    function updateOnlineIndicator(characterId, isOnline) {
        const table = document.querySelector('#tablecharts tbody');
        if (!table) return;

        const links = table.querySelectorAll('a[href*="/Character/"]');
        links.forEach(link => {
            const id = link.href.match(/Character\/(\d+)/)?.[1];
            if (id === characterId) {
                // Remove existing indicator
                const existingIndicator = link.parentElement.querySelector('.online-status-indicator');
                if (existingIndicator) {
                    existingIndicator.remove();
                }

                // Add new indicator
                const statusSpan = document.createElement('span');
                statusSpan.className = 'status-indicator online-status-indicator';
                statusSpan.style = `
                    margin-left: 6px;
                    font-size: 11px;
                    font-weight: 600;
                `;
                statusSpan.innerHTML = isOnline
                    ? '<span style="color:#39bb68;" title="Online">🟢</span>'
                    : '<span style="color:#999;" title="Offline">🔴</span>';

                link.parentElement.appendChild(statusSpan);
            }
        });
    }

    function replaceTable() {
        const table = document.querySelector('#tablecharts');
        if (table && smartRows[clubId]) {
            // Generate table rows automatically
            let tableBodyHTML = '';
            smartRows[clubId].forEach((character, index) => {
                const rowNumber = index + 1;
                const rowClass = (rowNumber % 2 === 0) ? 'even' : 'odd';
                const points = character.points || DEFAULT_POINTS;

                tableBodyHTML += `
          <tr class="${rowClass}">
            <td>${rowNumber}</td>
            <td><a href="/World/Popmundo.aspx/Character/${character.id}">${character.name}</a></td>
            <td class="right">${points}</td>
            <td class="right">—</td>
          </tr>
        `;
            });

            table.innerHTML = `
        <thead>
          <tr>
            <th class="width5 header"></th>
            <th class="header">Name</th>
            <th class="right width25 header">Points</th>
            <th class="right width25 header">Achievements</th>
          </tr>
        </thead>
        <tbody>
          ${tableBodyHTML}
        </tbody>
      `;
        }

        setTimeout(() => addCustomButtons(), 100);
    }

    // --- BUTTON LOGIC ---
    function addCustomButtons() {
        if (document.querySelector('#customButtonContainer')) {
            return;
        }

        const table = document.querySelector('#tablecharts');
        if (!table) {
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'customButtonContainer';
        buttonContainer.style.cssText = `
      margin: 0 0 20px 0;
      padding: 0;
      text-align: left;
      display: flex;
      gap: 1px;
      flex-wrap: wrap;
    `;

        const buttonStyle = `
      display: inline-block;
      padding: 6px 14px;
      font-family: "Bahnschrift", sans-serif;
      font-size: 11px;
      font-weight: 500;
      background-color: #eae6f9;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    `;
        const onMouseOver = '#dcd6f0';
        const onMouseOut = '#eae6f9';

        // Helper to create buttons
        const createButton = (id, text, clickHandler) => {
            const button = document.createElement('button');
            button.id = id;
            button.textContent = text;
            button.style.cssText = buttonStyle;
            button.onmouseover = () => button.style.backgroundColor = onMouseOver;
            button.onmouseout = () => button.style.backgroundColor = onMouseOut;
            button.onclick = clickHandler;
            return button;
        };

        // 1. Online Check Button
        const checkButton = createButton(
            'onlineCheckButton',
            '🔵 ONLINE',
            checkAllOnlineStatus
        );

        // 2. Last Login Check Button (now also checks death status)
        const inactiveCheckButton = createButton(
            'inactiveCheckButton',
            '🎯 ACTIVE',
            checkAllInactiveAndDeathStatus
        );

        // 3. Load Full Details Button
        const loadDetailsButton = createButton(
            'loadDetailsButton',
            '🖼️ PP',
            () => {
                detailsLoaded = true;
                buildTree({ groupBySurname: document.querySelector('#liveFamilyTree .familyTreeRow') && document.querySelector('#liveFamilyTree h3')?.textContent !== 'All Members', fetchData: true });
            }
        );

        // 4. Copy All IDs Button
        const copyIdsButton = createButton(
            'copyIdsButton',
            '📋 IDs',
            copyAllCharacterIds
        );

        // 5. Health & Mood Check Button
        const healthMoodButton = createButton(
            'healthMoodButton',
            '💚 STATS',
            checkAllHealthMoodStatus
        );

        // 6. NEW: Online Alert Button
        const onlineAlertButton = createButton(
            'onlineAlertButton',
            isAlertActive ? '🔔 ALERTS ON' : '🔕 ALERTS OFF',
            toggleOnlineAlerts
        );

        // Update button appearance based on alert status
        if (isAlertActive) {
            onlineAlertButton.style.backgroundColor = '#d4edda';
            onlineAlertButton.style.color = '#155724';
            onlineAlertButton.style.borderColor = '#c3e6cb';
        }

        buttonContainer.appendChild(checkButton);
        buttonContainer.appendChild(inactiveCheckButton);
        buttonContainer.appendChild(loadDetailsButton);
        buttonContainer.appendChild(copyIdsButton);
        buttonContainer.appendChild(healthMoodButton);
        buttonContainer.appendChild(onlineAlertButton);

        // Insert before the table
        table.parentNode.insertBefore(buttonContainer, table);
    }

    // Toggle online alerts
    async function toggleOnlineAlerts() {
        const alertButton = document.querySelector('#onlineAlertButton');

        if (!isAlertActive) {
            // Request notification permission
            requestNotificationPermission();

            // Start monitoring
            startAlertMonitoring();

            // Update button
            alertButton.textContent = '🔔 ALERTS ON';
            alertButton.style.backgroundColor = '#d4edda';
            alertButton.style.color = '#155724';
            alertButton.style.borderColor = '#c3e6cb';

            // Show confirmation notification
            sendNotification(
                'Online Alerts Activated',
                'I will notify you when any club member comes online. Scanning every 2 minutes.'
            );

            console.log('Online alerts activated');
        } else {
            // Stop monitoring
            stopAlertMonitoring();

            // Update button
            alertButton.textContent = '🔕 ALERTS OFF';
            alertButton.style.backgroundColor = '';
            alertButton.style.color = '';
            alertButton.style.borderColor = '';

            // Show deactivation notification
            sendNotification(
                'Online Alerts Deactivated',
                'Online monitoring has been stopped.'
            );

            console.log('Online alerts deactivated');
        }
    }

    async function copyAllCharacterIds() {
        const table = document.querySelector('#tablecharts tbody');
        if (!table) {
            alert('Table not found!');
            return;
        }

        const copyBtn = document.querySelector('#copyIdsButton');
        const originalText = copyBtn.textContent;

        const links = table.querySelectorAll('a[href*="/Character/"]');
        const ids = [];

        links.forEach(link => {
            const id = link.href.match(/Character\/(\d+)/)?.[1];
            if (id) {
                ids.push(id);
            }
        });

        if (ids.length === 0) {
            alert('No character IDs found!');
            return;
        }

        const idsString = ids.join(', ');

        try {
            await navigator.clipboard.writeText(idsString);

            copyBtn.textContent = '✅ Copied!';
            copyBtn.style.backgroundColor = '#d4edda';
            copyBtn.style.color = '#155724';
            copyBtn.style.borderColor = '#c3e6cb';

            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 10px 15px;
                border-radius: 4px;
                font-family: "Bahnschrift", sans-serif;
                font-size: 12px;
                z-index: 10000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;
            notification.textContent = `✅ Copied ${ids.length} IDs to clipboard!`;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 2000);

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 1500);

            console.log(`Copied ${ids.length} IDs: ${idsString}`);

        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard. Please copy manually:\n\n' + idsString);
            copyBtn.textContent = '❌ Failed';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);
        }
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Helper to toggle buttons state
    function toggleButtons(disabled, statusText) {
        const buttons = ['onlineCheckButton', 'loadDetailsButton', 'inactiveCheckButton', 'copyIdsButton', 'healthMoodButton', 'onlineAlertButton'];
        buttons.forEach(id => {
            const btn = document.querySelector(`#${id}`);
            if (btn) {
                btn.disabled = disabled;
                btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
            }
        });

        const activeBtn = document.querySelector(`#${statusText.id}`);
        if(activeBtn) {
             activeBtn.textContent = disabled ? statusText.loading : statusText.default;
        }
    }

    // --- ONLINE CHECK LOGIC ---
    function checkCharacterOnline(id) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `/World/Popmundo.aspx/Character/${id}`,
                onload: function (response) {
                    let isOnline = false;
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");

                        // Try multiple methods to detect online status
                        const onlineRow = doc.querySelector("#ctl00_cphLeftColumn_ctl00_trOnlineStatus");

                        if (onlineRow) {
                            const text = onlineRow.textContent.trim();

                            // Check for various indicators of being online
                            if (text.includes("Online Status:")) {
                                // If it says "Online Status:" without a date, they're online
                                if (!text.includes("Last Login:")) {
                                    isOnline = true;
                                }
                            }
                            // Check if the row shows "Currently Online" or similar
                            else if (text.includes("Currently Online") ||
                                     text.includes("Online now") ||
                                     text.includes("online now")) {
                                isOnline = true;
                            }
                            // Check if there's a "last login" date (offline) vs no date (online)
                            else if (!text.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
                                // No date found - likely online
                                isOnline = true;
                            }
                        }

                        // Alternative detection: Look for the green online indicator icon
                        const onlineIcon = doc.querySelector('img[src*="online"], img[alt*="online"], img[title*="online"]');
                        if (onlineIcon) {
                            isOnline = true;
                        }
                    }
                    resolve(isOnline);
                },
                onerror: function () {
                    resolve(false);
                }
            });
        });
    }

    async function checkAllOnlineStatus() {
        const table = document.querySelector('#tablecharts tbody');
        if (!table) return;

        toggleButtons(true, {
            id: 'onlineCheckButton',
            loading: '⏳ Checking Online...',
            default: '🔵 ONLINE'
        });

        const rows = table.querySelectorAll('tr');
        table.querySelectorAll('.status-indicator').forEach(el => el.remove());

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const link = row.querySelector('a[href*="/Character/"]');

            if (link) {
                const name = link.textContent.trim();
                if (name.includes('💀')) {
                    continue;
                }

                const id = link.href.match(/Character\/(\d+)/)?.[1];
                if (id) {
                    const isOnline = await checkCharacterOnline(id);

                    const statusSpan = document.createElement('span');
                    statusSpan.className = 'status-indicator online-status-indicator';
                    statusSpan.style = `
                        margin-left: 6px;
                        font-size: 11px;
                        font-weight: 600;
                    `;
                    statusSpan.innerHTML = isOnline
                        ? '<span style="color:#39bb68;" title="Online">🟢</span>'
                        : '<span style="color:#999;" title="Offline">🔴</span>';

                    link.parentElement.appendChild(statusSpan);

                    // Update last online status for alerts
                    lastOnlineStatus[id] = isOnline;

                    if (i < rows.length - 1) {
                        await wait(ONLINE_CHECK_DELAY);
                    }
                }
            }
        }

        toggleButtons(false, {
            id: 'onlineCheckButton',
            loading: '⏳ Checking Online...',
            default: '🔵 ONLINE'
        });
    }

    // --- DEATH STATUS CHECK LOGIC ---
    function checkCharacterDeathStatus(id) {
        return new Promise((resolve) => {
            if (deathStatusCache[id]) {
                return resolve(deathStatusCache[id]);
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `/World/Popmundo.aspx/Character/${id}`,
                onload: function (response) {
                    let isDead = false;
                    let deathDate = null;

                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");

                        const charPresBox = doc.querySelector('.charPresBox');
                        if (charPresBox) {
                            const text = charPresBox.textContent || charPresBox.innerText;

                            if (text.includes("Date of Death:")) {
                                isDead = true;

                                const deathMatch = text.match(/Date of Death:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
                                if (deathMatch) {
                                    deathDate = deathMatch[1];
                                }
                            }
                        }
                    }

                    const result = {
                        isDead: isDead,
                        deathDate: deathDate
                    };

                    deathStatusCache[id] = result;
                    resolve(result);
                },
                onerror: function() {
                    resolve({ isDead: false, deathDate: null });
                }
            });
        });
    }

    function parseDate(dateString) {
        if (!dateString || dateString === '—') return null;
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return null;
    }

    function fetchLastLogin(id) {
        return new Promise((resolve) => {
            if (inactivityCache[id] && inactivityCache[id].lastLogin) {
                return resolve(inactivityCache[id].lastLogin);
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `/World/Popmundo.aspx/Character/${id}`,
                onload: function (response) {
                    let lastLogin = '—';
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const onlineRow = doc.querySelector("#ctl00_cphLeftColumn_ctl00_trOnlineStatus");

                        if (onlineRow) {
                            const text = onlineRow.textContent.trim();
                            const match = text.match(/Last Login:\s*([^\s]+)/);
                            if (match) lastLogin = match[1];
                        }
                    }
                    if (!inactivityCache[id]) inactivityCache[id] = {};
                    inactivityCache[id].lastLogin = lastLogin;
                    resolve(lastLogin);
                },
                onerror: function() {
                    resolve('Error');
                }
            });
        });
    }

    async function checkAllInactiveAndDeathStatus() {
        const table = document.querySelector('#tablecharts tbody');
        if (!table) return;

        toggleButtons(true, {
            id: 'inactiveCheckButton',
            loading: '⏳ Checking...',
            default: '🎯 ACTIVE'
        });

        const rows = table.querySelectorAll('tr');
        table.querySelectorAll('.status-indicator').forEach(el => el.remove());

        const today = new Date();
        const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const link = row.querySelector('a[href*="/Character/"]');

            if (link) {
                const id = link.href.match(/Character\/(\d+)/)?.[1];
                if (id) {
                    const { isDead, deathDate } = await checkCharacterDeathStatus(id);

                    if (isDead) {
                        const statusSpan = document.createElement('span');
                        statusSpan.className = 'status-indicator inactive-status-indicator';
                        statusSpan.style = `
                            margin-left: 6px;
                            padding: 2px 6px;
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 4px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            color: #fff;
                            background-color: #2c3e50;
                            border: 1px solid #1a2530;
                        `;

                        let tooltipText = 'Deceased';
                        if (deathDate) {
                            tooltipText = `Died: ${deathDate}`;
                        }

                        statusSpan.textContent = 'DEAD';
                        statusSpan.title = tooltipText;
                        link.parentElement.appendChild(statusSpan);

                    } else {
                        const lastLoginStr = await fetchLastLogin(id);
                        const lastLoginDate = parseDate(lastLoginStr);
                        let isInactive = false;
                        let titleText = `Last Login: ${lastLoginStr}`;
                        let activeBadgeText = 'Active';

                        if (lastLoginDate) {
                            const diffTime = Math.abs(todayNormalized - lastLoginDate);
                            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                            if (diffDays > INACTIVITY_THRESHOLD_DAYS) {
                                isInactive = true;
                                titleText = `Inactive: Last logged in ${diffDays} days ago (${lastLoginStr})`;
                            } else {
                                if (diffDays === 0) {
                                    activeBadgeText = 'Today';
                                    titleText = `Active: Last logged in Today (${lastLoginStr})`;
                                } else {
                                    titleText = `Active: Last logged in ${diffDays} days ago (${lastLoginStr})`;
                                    activeBadgeText = `${diffDays} Days`;
                                }
                            }
                        } else if (lastLoginStr === '—') {
                            isInactive = false;
                            titleText = `Currently Online`;
                            activeBadgeText = 'Online';
                        }

                        const statusSpan = document.createElement('span');
                        statusSpan.className = 'status-indicator inactive-status-indicator';
                        statusSpan.style = `
                            margin-left: 6px;
                            padding: 2px 6px;
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 4px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        `;
                        statusSpan.title = titleText;

                        if (isInactive) {
                            statusSpan.textContent = 'INACTIVE';
                            statusSpan.style.color = '#c0392b';
                            statusSpan.style.backgroundColor = '#fbeaea';
                            statusSpan.style.border = '1px solid #c0392b';
                        } else {
                            statusSpan.textContent = activeBadgeText;
                            statusSpan.style.color = '#797979';
                            statusSpan.style.backgroundColor = 'transparent';
                            statusSpan.style.border = 'none';
                        }
                        link.parentElement.appendChild(statusSpan);
                    }

                    if (i < rows.length - 1) {
                        await wait(INACTIVE_CHECK_DELAY);
                    }
                }
            }
        }

        toggleButtons(false, {
            id: 'inactiveCheckButton',
            loading: '⏳ Checking...',
            default: '🎯 ACTIVE'
        });
    }

    // --- HEALTH & MOOD CHECK LOGIC ---
    function checkCharacterHealthMood(id) {
        return new Promise((resolve) => {
            // Check cache first
            if (healthMoodCache[id]) {
                return resolve(healthMoodCache[id]);
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `/World/Popmundo.aspx/Character/${id}`,
                onload: function (response) {
                    let health = null;
                    let mood = null;
                    let isDead = false;

                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");

                        // Check if character is dead first
                        const charPresBox = doc.querySelector('.charPresBox');
                        if (charPresBox) {
                            const text = charPresBox.textContent || charPresBox.innerText;
                            if (text.includes("Date of Death:")) {
                                isDead = true;
                            }
                        }

                        // Only try to extract health/mood if character is alive
                        if (!isDead) {
                            // Look for the charMainValues div which contains the health/mood table
                            const charMainValues = doc.querySelector('.charMainValues');

                            if (charMainValues) {
                                // Find all rows in the table
                                const rows = charMainValues.querySelectorAll('tr');

                                // Process each row
                                rows.forEach(row => {
                                    // Get the img element to identify the row type
                                    const img = row.querySelector('img');
                                    if (img) {
                                        const imgTitle = img.getAttribute('title') || '';

                                        // Check for Mood row
                                        if (imgTitle === 'Mood') {
                                            // Extract from sortkey span (first method)
                                            const sortkey = row.querySelector('.sortkey');
                                            if (sortkey) {
                                                const text = sortkey.textContent.trim();
                                                if (!isNaN(parseInt(text))) {
                                                    mood = parseInt(text);
                                                }
                                            }

                                            // Also check progress bar title as backup
                                            if (!mood) {
                                                const progressBar = row.querySelector('.progressBar');
                                                if (progressBar) {
                                                    const title = progressBar.getAttribute('title');
                                                    if (title) {
                                                        const match = title.match(/(\d+)%/);
                                                        if (match) mood = parseInt(match[1]);
                                                    }
                                                }
                                            }
                                        }

                                        // Check for Health row
                                        else if (imgTitle === 'Health') {
                                            // Extract from sortkey span (first method)
                                            const sortkey = row.querySelector('.sortkey');
                                            if (sortkey) {
                                                const text = sortkey.textContent.trim();
                                                if (!isNaN(parseInt(text))) {
                                                    health = parseInt(text);
                                                }
                                            }

                                            // Also check progress bar title as backup
                                            if (!health) {
                                                const progressBar = row.querySelector('.progressBar');
                                                if (progressBar) {
                                                    const title = progressBar.getAttribute('title');
                                                    if (title) {
                                                        const match = title.match(/(\d+)%/);
                                                        if (match) health = parseInt(match[1]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }

                            // Alternative: If charMainValues not found, try direct table search
                            if ((health === null || mood === null) && !charMainValues) {
                                // Look for the specific table with the health/mood icons
                                const tables = doc.querySelectorAll('table.width100');
                                tables.forEach(table => {
                                    const rows = table.querySelectorAll('tr');
                                    rows.forEach(row => {
                                        const img = row.querySelector('img');
                                        if (img) {
                                            const imgTitle = img.getAttribute('title') || '';
                                            const sortkey = row.querySelector('.sortkey');

                                            if (sortkey) {
                                                const value = parseInt(sortkey.textContent.trim());
                                                if (!isNaN(value)) {
                                                    if (imgTitle === 'Mood' && mood === null) {
                                                        mood = value;
                                                    } else if (imgTitle === 'Health' && health === null) {
                                                        health = value;
                                                    }
                                                }
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    }

                    const result = {
                        health: health,
                        mood: mood,
                        isDead: isDead
                    };

                    healthMoodCache[id] = result;
                    resolve(result);
                },
                onerror: function() {
                    resolve({ health: null, mood: null, isDead: false });
                }
            });
        });
    }

    // Color functions for badges - Updated with new colors
    function getHealthColor(percentage) {
        if (percentage === 100) return '#f1d565'; // Yellow (100%)
        if (percentage >= 78) return '#51cd86'; // Green (78-99)
        if (percentage >= 29) return '#7bb4d9'; // Blue (29-77)
        return '#ff513f'; // Red (0-28)
    }

    function getMoodColor(percentage) {
        if (percentage === 100) return '#f1d565'; // Yellow (100%)
        if (percentage >= 78) return '#51cd86'; // Green (78-99)
        if (percentage >= 29) return '#7bb4d9'; // Blue (29-77)
        return '#ff513f'; // Red (0-28)
    }

    // Get border color based on background color
    function getBorderColor(bgColor) {
        switch(bgColor) {
            case '#f1d565': // Yellow
                return '#f3e196';
            case '#51cd86': // Green
                return '#6be79f';
            case '#7bb4d9': // Blue
                return '#74c7ff';
            case '#ff513f': // Red
                return '#ff4837';
            default:
                return '#ccc';
        }
    }

    async function checkAllHealthMoodStatus() {
        const table = document.querySelector('#tablecharts tbody');
        if (!table) return;

        toggleButtons(true, {
            id: 'healthMoodButton',
            loading: '⏳ Checking Health/Mood...',
            default: '💚 STATS'
        });

        const rows = table.querySelectorAll('tr');
        // Remove existing health/mood indicators
        table.querySelectorAll('.health-mood-badge').forEach(el => el.remove());

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const link = row.querySelector('a[href*="/Character/"]');

            if (link) {
                const name = link.textContent.trim();
                const id = link.href.match(/Character\/(\d+)/)?.[1];

                if (id) {
                    const { health, mood, isDead } = await checkCharacterHealthMood(id);

                    const badgeContainer = document.createElement('span');
                    badgeContainer.className = 'status-indicator health-mood-badge';
                    badgeContainer.style.cssText = `
                        margin-left: 8px;
                        display: inline-flex;
                        gap: 4px;
                        align-items: center;
                    `;

                    if (isDead) {
                        // Character is dead - show RIP badge
                        const deadBadge = document.createElement('span');
                        deadBadge.style.cssText = `
                            padding: 2px 8px;
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 12px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            color: #fff;
                            background-color: #2c3e50;
                            border: 1px solid #1a2530;
                            white-space: nowrap;
                        `;
                        deadBadge.textContent = '💀 DEAD';
                        deadBadge.title = 'Deceased';
                        badgeContainer.appendChild(deadBadge);

                    } else if (health !== null && mood !== null) {
                        // Both health and mood found - create two badges (MOOD FIRST)
                        const moodColor = getMoodColor(mood);
                        const healthColor = getHealthColor(health);

                        // Create tooltip with exact values and color explanation
                        let moodStatus = '';
                        if (mood === 100) moodStatus = 'Perfect (Yellow)';
                        else if (mood >= 74) moodStatus = 'Good (Green)';
                        else if (mood >= 29) moodStatus = 'Fair (Blue)';
                        else moodStatus = 'Poor (Red)';

                        let healthStatus = '';
                        if (health === 100) healthStatus = 'Perfect (Yellow)';
                        else if (health >= 74) healthStatus = 'Good (Green)';
                        else if (health >= 29) healthStatus = 'Fair (Blue)';
                        else healthStatus = 'Poor (Red)';

                        // Mood badge FIRST
                        const moodBadge = document.createElement('span');
                        moodBadge.style.cssText = `
                            padding: 2px 6px;
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 12px;
                            color: #333;
                            background-color: ${moodColor};
                            border: 1px solid ${getBorderColor(moodColor)};
                            white-space: nowrap;
                            cursor: help;
                        `;
                        moodBadge.innerHTML = `😊 ${mood}%`;
                        moodBadge.title = `Mood: ${mood}% - ${moodStatus}`;

                        // Health badge SECOND
                        const healthBadge = document.createElement('span');
                        healthBadge.style.cssText = `
                            padding: 2px 6px;
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 12px;
                            color: #333;
                            background-color: ${healthColor};
                            border: 1px solid ${getBorderColor(healthColor)};
                            white-space: nowrap;
                            cursor: help;
                        `;
                        healthBadge.innerHTML = `❤️ ${health}%`;
                        healthBadge.title = `Health: ${health}% - ${healthStatus}`;

                        // Add badges in order: Mood first, Health second
                        badgeContainer.appendChild(moodBadge);
                        badgeContainer.appendChild(healthBadge);

                    } else if (mood !== null) {
                        // Only mood found
                        const moodColor = getMoodColor(mood);
                        let moodStatus = '';
                        if (mood === 100) moodStatus = 'Perfect (Yellow)';
                        else if (mood >= 78) moodStatus = 'Good (Green)';
                        else if (mood >= 29) moodStatus = 'Fair (Blue)';
                        else moodStatus = 'Poor (Red)';

                        const moodBadge = document.createElement('span');
                        moodBadge.style.cssText = `
                            padding: 2px 6px;
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 12px;
                            color: #333;
                            background-color: ${moodColor};
                            border: 1px solid ${getBorderColor(moodColor)};
                            white-space: nowrap;
                            cursor: help;
                        `;
                        moodBadge.innerHTML = `😊 ${mood}%`;
                        moodBadge.title = `Mood: ${mood}% - ${moodStatus}`;
                        badgeContainer.appendChild(moodBadge);

                    } else if (health !== null) {
                        // Only health found
                        const healthColor = getHealthColor(health);
                        let healthStatus = '';
                        if (health === 100) healthStatus = 'Perfect (Yellow)';
                        else if (health >= 78) healthStatus = 'Good (Green)';
                        else if (health >= 29) healthStatus = 'Fair (Blue)';
                        else healthStatus = 'Poor (Red)';

                        const healthBadge = document.createElement('span');
                        healthBadge.style.cssText = `
                            padding: 2px 6px;
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 12px;
                            color: #333;
                            background-color: ${healthColor};
                            border: 1px solid ${getBorderColor(healthColor)};
                            white-space: nowrap;
                            cursor: help;
                        `;
                        healthBadge.innerHTML = `❤️ ${health}%`;
                        healthBadge.title = `Health: ${health}% - ${healthStatus}`;
                        badgeContainer.appendChild(healthBadge);

                    } else {
                        // Data not available - show info badge
                        const naBadge = document.createElement('span');
                        naBadge.style.cssText = `
                            padding: 2px 8px;
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 12px;
                            color: #666;
                            background-color: #f0f0f0;
                            border: 1px solid #ddd;
                            white-space: nowrap;
                            cursor: help;
                        `;
                        naBadge.innerHTML = '❓ N/A';
                        naBadge.title = 'Health/Mood data not available';
                        badgeContainer.appendChild(naBadge);
                    }

                    link.parentElement.appendChild(badgeContainer);

                    if (i < rows.length - 1) {
                        await wait(HEALTH_MOOD_CHECK_DELAY);
                    }
                }
            }
        }

        toggleButtons(false, {
            id: 'healthMoodButton',
            loading: '⏳ Checking Health/Mood...',
            default: '💚 STATS'
        });
    }

    // --- FAMILY TREE LOGIC ---
    function injectStyles() {
        const style = document.createElement("style");
        style.textContent = `
      .status-indicator {
          display: inline-block;
          white-space: nowrap;
          vertical-align: middle;
      }
      .death-status-indicator {
          margin-left: 6px !important;
      }
      #liveFamilyTree .avatar.pointer.idTrigger {
        height: 156px;
        width: 114px;
        position: relative;
        background-position: top center;
        background-repeat: no-repeat;
        background-size: 100% !important;
        z-index: 0;
        border-radius: 6px;
      }
      #liveFamilyTree .familyTreeItems {
        display: flex;
        flex-wrap: wrap;
        column-gap: 50px;
        row-gap: 0;
      }
      #liveFamilyTree .familyTreePortrait {
        width: 114px;
        font-family: "Bahnschrift", sans-serif !important;
        font-size: 12px !important;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        line-height: 1.3;
        letter-spacing: -0.1px;
        color: #000;
        overflow-wrap: break-word;
        text-align: left;
      }
      #liveFamilyTree .familyTreePortrait p {
        margin-top: 6px;
        margin-bottom: 10px;
      }
      #liveFamilyTree .idHolder {
        position: absolute;
        top: 5px;
        left: 5px;
        display: none;
        padding: 5px;
        background: #fff;
        border-radius: 4px;
        font-family: Bahnschrift, sans-serif;
        color: #333;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        font-size: 12px !important;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        line-height: 1.3;
        letter-spacing: -0.1px;
      }
      #liveFamilyTree button {
        display: inline-block;
        margin: 5px 0 20px;
        padding: 6px 14px;
        font-family: "Bahnschrift", sans-serif;
        font-size: 11px;
        font-weight: 500;
        background-color: #eae6f9;
        color: #333;
        border: 1px solid #ccc;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      #liveFamilyTree button:hover {
        background-color: #dcd6f0;
      }
      #liveFamilyTree button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
        document.head.appendChild(style);
    }

    function makePortrait(id, name, age, imgURL, isDead = false) {
        const deathOverlay = isDead ?
            `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(44, 62, 80, 0.7); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">RIP</div>` :
            '';

        return `
      <div class="familyTreePortrait">
        <div class="avatar pointer idTrigger" style="background: url('${imgURL}') no-repeat;"
          onclick="window.location.href='/World/Popmundo.aspx/Character/${id}';"
          onmouseover="this.querySelector('.idHolder').style.display = 'block';"
          onmouseout="this.querySelector('.idHolder').style.display = 'none';">
          <div class="idHolder">${id}${isDead ? ' 💀' : ''}</div>
          <a class="abusereport rightcornerabuse" href="/World/Popmundo.aspx/Help/PreviewReport/1/${id}">
            <img src="/Static/Icons/TinyIcon_Report.png">
          </a>
          ${deathOverlay}
        </div>
        <p><a href="/World/Popmundo.aspx/Character/${id}">${name}</a><br>Age: ${age}${isDead ? ' 💀' : ''}</p>
      </div>`;
    }

    function makePortraitPlaceholder(id, name) {
        return `
      <div class="familyTreePortrait">
        <div class="avatar pointer idTrigger" style="background: #f0f0f0;"
          onclick="window.location.href='/World/Popmundo.aspx/Character/${id}';">
          <div class="idHolder">${id}</div>
        </div>
        <p><a href="/World/Popmundo.aspx/Character/${id}">${name}</a><br>Age: —</p>
      </div>`;
    }

    async function fetchCharacterData(id) {
        if (characterDetailsCache[id]) {
            return characterDetailsCache[id];
        }

        try {
            const res = await fetch(`/World/Popmundo.aspx/Character/${id}`);
            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, "text/html");
            const avatarDiv = doc.querySelector("div.avatar.pointer.idTrigger");

            const imgURL = avatarDiv?.style.backgroundImage?.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') || '';
            const name = doc.querySelector("h2")?.textContent?.trim() || `ID ${id}`;

            let age = '—';
            const ageRow = doc.querySelector("#ctl00_cphLeftColumn_ctl00_trDaysActive td");
            if (ageRow) {
                const daysActiveText = ageRow.textContent.replace('Days Active:', '').trim();
                if (daysActiveText && !isNaN(parseInt(daysActiveText))) {
                    age = `${Math.floor(parseInt(daysActiveText) / 36)} yrs`;
                }
            }

            let isDead = false;
            const charPresBox = doc.querySelector('.charPresBox');
            if (charPresBox) {
                const text = charPresBox.textContent || charPresBox.innerText;
                if (text.includes("Date of Death:") || text.includes("resting in peace")) {
                    isDead = true;
                }
            }

            const data = { id, name, age, imgURL, isDead };
            characterDetailsCache[id] = data;
            return data;
        } catch (err) {
            console.error("Error fetching:", id, err);
            return null;
        }
    }

    function getGroupKey(name) {
        const parts = name.trim().split(/\s+/);
        return parts.length > 1 ? parts[parts.length - 1] : name;
    }

    function injectGroup(title, members, container) {
        const section = document.createElement("div");
        section.className = "familyTreeRow";
        section.innerHTML = `<h3>${title}</h3><div class="familyTreeItems"></div>`;
        members.forEach(html => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            section.querySelector(".familyTreeItems").appendChild(wrapper.firstElementChild);
        });
        container.appendChild(section);
    }

    function getCharacterList() {
        const table = document.querySelector("#tablecharts");
        if (!table) return [];

        return Array.from(table.querySelectorAll("tbody a[href*='/Character/']"))
            .map(link => {
                const id = link.href.match(/Character\/(\d+)/)?.[1];
                const name = link.textContent.trim();
                return id ? { id, name } : null;
            })
            .filter(Boolean);
    }

    async function buildTree({ groupBySurname, fetchData }) {
        const treeContainer = document.querySelector("#liveFamilyTree");
        treeContainer.innerHTML = "";

        const characters = getCharacterList();
        if (characters.length === 0) return;

        const groups = {};
        const flat = [];
        const toggleBtn = document.createElement("button");

        toggleBtn.textContent = groupBySurname ? "Switch to Flat View" : "Group by Surname";
        toggleBtn.onclick = () => buildTree({ groupBySurname: !groupBySurname, fetchData: false });
        treeContainer.appendChild(toggleBtn);

        if (fetchData || detailsLoaded) {
            if (fetchData) {
                toggleButtons(true, {
                    id: 'loadDetailsButton',
                    loading: '⏳ Loading...',
                    default: '🖼️ PP'
                });
                toggleBtn.disabled = true;

                for (let i = 0; i < characters.length; i++) {
                    const { id, name } = characters[i];

                    const data = await fetchCharacterData(id);
                    if (!data) continue;

                    const html = makePortrait(data.id, data.name, data.age, data.imgURL, data.isDead);
                    flat.push(html);
                    const key = getGroupKey(data.name);
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(html);

                    if (i < characters.length - 1) {
                        await wait(FETCH_DELAY);
                    }
                }

                toggleButtons(false, {
                    id: 'loadDetailsButton',
                    loading: '⏳ Loading...',
                    default: '🖼️ PP'
                });
                toggleBtn.disabled = false;

            } else {
                characters.forEach(({ id, name }) => {
                    const data = characterDetailsCache[id];
                    const html = data
                        ? makePortrait(data.id, data.name, data.age, data.imgURL, data.isDead)
                        : makePortraitPlaceholder(id, name);

                    flat.push(html);
                    const key = getGroupKey(data ? data.name : name);
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(html);
                });
            }

            treeContainer.innerHTML = '';
            treeContainer.appendChild(toggleBtn);

            if (groupBySurname) {
                Object.entries(groups).forEach(([groupName, portraits]) => {
                    injectGroup(groupName, portraits, treeContainer);
                });
            } else {
                injectGroup("All Members", flat, treeContainer);
            }
        }
    }

    function initTree() {
        const contentArea = document.querySelector("#ppm-content");
        if (!contentArea) return;

        if (document.querySelector("#liveFamilyTree")) return;

        const outerBox = document.createElement("div");
        outerBox.className = "box ofauto";
        outerBox.innerHTML = `<h2>Nearest family</h2><div id="liveFamilyTree"></div>`;
        contentArea.appendChild(outerBox);

        buildTree({ groupBySurname: false, fetchData: false });
    }

    // Initialize alert system on page load
    initAlertStatus();

    const observer = new MutationObserver(() => {
        const table = document.querySelector("#tablecharts");
        if (table) {
            replaceTable();
            injectStyles();
            initTree();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();