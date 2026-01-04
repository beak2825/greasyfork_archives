// ==UserScript==
// @name         AmbAssist
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  A userscript to manage Torn faction bank requests via a Discord backend.
// @author       AMBiSCA [2662550]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/549733/AmbAssist.user.js
// @updateURL https://update.greasyfork.org/scripts/549733/AmbAssist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BACKEND_URL = 'https://tornrequest-ggvqizj32q-nw.a.run.app';
    const COOLDOWN_SECONDS = 60;
    let cooldownInterval;

    if (typeof GM_getValue === 'undefined' && window.localStorage) {
        window.GM_getValue = (key, defaultValue) => {
            const r = localStorage.getItem(key);
            if (r === null) return defaultValue;
            try { return JSON.parse(r); } catch (e) { return r; }
        };
        window.GM_setValue = (key, value) => {
            localStorage.setItem(key, JSON.stringify(value));
        };
    }
    if (typeof GM_xmlhttpRequest === 'undefined' && window.flutter_inappwebview) {
        window.GM_xmlhttpRequest = (details) => {
            const { method, url, headers, data, onload, onerror } = details;
            const isPost = method && method.toLowerCase() === 'post';
            const promise = isPost
                ? window.flutter_inappwebview.callHandler("PDA_httpPost", url, headers || {}, data || "")
                : window.flutter_inappwebview.callHandler("PDA_httpGet", url, headers || {});
            promise.then(onload).catch(onerror);
        };
    }

    let settings = {
        apiKey: GM_getValue('apiKey', ''),
        channelId: GM_getValue('channelId', '')
    };

    function parseShorthandAmount(inputStr) {
    if (!inputStr || typeof inputStr !== 'string') return 0;

    const str = String(inputStr).toLowerCase().trim().replace(/[^\d.kmb]/g, '');

    const lastChar = str.slice(-1);
    let value;

    if (['k', 'm', 'b'].includes(lastChar)) {
        const numPart = parseFloat(str.slice(0, -1));
        if (isNaN(numPart)) return 0;

        switch (lastChar) {
            case 'k': value = numPart * 1000; break;
            case 'm': value = numPart * 1000000; break;
            case 'b': value = numPart * 1000000000; break;
        }
    } else {
        value = parseFloat(str);
    }

    return isNaN(value) ? 0 : Math.floor(value);
}


    function updateCooldownDisplay(buttonElement) {
        clearInterval(cooldownInterval);
        const originalText = 'Request';

        const update = () => {
            const endTime = GM_getValue('cooldownEndTime', 0);
            const remaining = Math.ceil((endTime - new Date().getTime()) / 1000);

            if (remaining > 0) {
                buttonElement.disabled = true;
                buttonElement.textContent = `On Cooldown (${remaining}s)`;
            } else {
                buttonElement.disabled = false;
                buttonElement.textContent = originalText;
                clearInterval(cooldownInterval);
            }
        };
        const endTime = GM_getValue('cooldownEndTime', 0);
        if (endTime > new Date().getTime()) {
            cooldownInterval = setInterval(update, 1000);
        }
        update();
    }

   function showSettingsPopup() {
        if (document.getElementById('ambassist-settings-panel')) return;

        const isMobile = isMobileDevice();

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'ambassist-settings-panel';

        const settingsHtml = `
        <div class="header">
            <div class="title">
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="24" height="24" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;fill-rule:evenodd;clip-rule:evenodd" viewBox="0 0 512 481.75">
<path fill="#ccc" d="M11.18 166.57 246.07 0l236.1 166.57H11.18zm414.96 156.44-5.39-24.71c23.12 4.31 60.2 51.38 72.19 72.78 6.12 10.92 11.48 22.96 15.86 36.41 8.75 32.55.33 63-34.99 70.09-22.13 4.46-63.4 4.77-86.66 3.56-25.03-1.28-63.74-1.25-73.86-26.94-16.31-41.46 13.58-90.85 40.85-121.09 3.6-3.98 7.32-7.68 11.14-11.11 9.92-8.72 20.62-19.08 33.39-23.38l-12.34 22.96 17.92-23.75h9.42l12.47 25.18zm-11.53 19.59v6.95c4.58.49 8.52 1.43 11.79 2.83 3.29 1.42 6.14 3.55 8.59 6.43 1.93 2.19 3.42 4.44 4.47 6.74 1.05 2.33 1.58 4.43 1.58 6.36 0 2.15-.79 4.02-2.35 5.57-1.57 1.56-3.46 2.35-5.69 2.35-4.21 0-6.95-2.28-8.18-6.82-1.43-5.35-4.83-8.92-10.21-10.68v26.72c5.3 1.45 9.55 2.79 12.69 3.99 3.15 1.19 5.98 2.92 8.46 5.2 2.65 2.35 4.71 5.17 6.16 8.44 1.42 3.29 2.14 6.86 2.14 10.76 0 4.89-1.13 9.45-3.43 13.7-2.31 4.28-5.68 7.74-10.13 10.46-4.48 2.7-9.76 4.3-15.89 4.8v16c0 2.52-.25 4.37-.75 5.53-.49 1.16-1.56 1.73-3.25 1.73-1.53 0-2.6-.46-3.24-1.4-.62-.95-.92-2.42-.92-4.39v-17.34c-5-.54-9.38-1.73-13.13-3.53-3.75-1.79-6.89-4.03-9.39-6.71-2.49-2.69-4.36-5.48-5.54-8.35-1.21-2.89-1.8-5.74-1.8-8.53 0 2.03.79-3.9 2.41-5.54 1.6-1.64 3.6-2.48 5.99-2.48 1.93 0 3.55.44 4.88 1.34 1.32.9 2.24 2.17 2.77 3.79 1.14 3.51 2.15 6.21 3 8.07.88 1.86 2.17 3.57 3.9 5.11 1.73 1.53 4.04 2.71 6.91 3.53v-29.86c-5.75-1.6-10.53-3.35-14.38-5.3-3.86-1.96-7-4.72-9.38-8.31-2.39-3.6-3.6-8.22-3.6-13.88 0-7.36 2.35-13.41 7.04-18.11 4.69-4.71 11.46-7.45 20.32-8.22v-6.81c0-3.6 1.36-5.4 4.05-5.4 2.75 0 4.11 1.76 4.11 5.26zm-8.16 44.07v-24.6c-3.6 1.08-6.4 2.48-8.42 4.23-2.02 1.75-3.03 4.43-3.03 7.98 0 3.37.95 5.94 2.83 7.67 1.89 1.74 4.76 3.31 8.62 4.72zm8.16 19.07v28.14c4.31-.85 7.65-2.58 10.01-5.19 2.35-2.63 3.53-5.66 3.53-9.14 0-3.73-1.14-6.6-3.44-8.64-2.28-2.04-5.66-3.77-10.1-5.17zm-23.46-142.75c-4.08-12.02-7.76-24.2-10.85-36.56 11.55-12.68 56.24-10.99 69.08-.19l-11.89 28.28c6.4-8.4 8.55-11.85 12.37-16.54 1.59 1.05 3.11 2.23 4.53 3.52 3.38 3.07 6.4 6.45 7.02 11.16.39 3.06-.49 6.18-3.2 9.35L430.9 293.8c-3.5-.58-6.94-1.41-10.27-2.6 1.55-3.64 3.42-7.65 4.96-11.29l-9.94 10.73c-10.34-2.19-18.67-.89-26.43 3.22l-27.68-33.23c-1.64-1.97-2.38-3.96-2.38-5.93.03-8.04 11.99-14.96 18.27-17.59l13.72 25.88zM0 409.64h27.32v-25.35h14.33v-12.1h15.42v-145.1H25.55v-34.77h367.39c-12.5 2.38-23.86 7.12-31.36 14.51a27.239 27.239 0 0 0-7.33 12.15c-3.14 2.06-6.26 4.46-9.03 7.12l-1 .99h-15.8v94.31c-15.65 18.55-31.3 42.46-39.91 67.98-5.15 15.26-7.82 31.07-6.71 46.81H0v-26.55zm433.74-217.32h32.81v13.07c-7.58-6.27-19.7-10.74-32.81-13.07zM130.53 384.29h17.78v-12.1h15.42v-145.1h-48.62v145.1h15.42v12.1zm106.65 0H255v-12.1h15.38v-145.1h-48.62v145.1h15.42v12.1zm-70.21-259.73 79.46-60.96 79.9 60.96H166.97z"/>
</svg>
                AmbAssist Settings
            </div>
            <button class="close-btn" id="settingsPanelClose">&times;</button>
        </div>
        <div style="padding: 10px;">
            <label style="display: block; margin-bottom: 5px;">Limited Torn API Key: (links faction balance)</label>
            <input type="text" id="apiKeyInput" value="${settings.apiKey}" style="width: 100%; padding: 8px; box-sizing: border-box; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px; margin-bottom: 15px;">
           <label style="display: block; margin-bottom: 5px;">Discord Channel ID: (For your requests)</label>
            <input type="text" id="channelIdInput" value="${settings.channelId}" style="width: 100%; padding: 8px; box-sizing: border-box; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px; margin-bottom: 20px;">
            <div style="display: flex; gap: 10px;">
                <button id="saveButton" style="flex: 1; padding: 10px; background-color: #007bff; border: none; color: white; cursor: pointer; border-radius: 4px;">Save</button>
                <button id="closeButton" style="flex: 1; padding: 10px; background-color: #6c757d; border: none; color: white; cursor: pointer; border-radius: 4px;">Close</button>
            </div>
        </div>
    `;

        settingsPanel.innerHTML = settingsHtml;
        document.body.appendChild(settingsPanel);
        settingsPanel.style.display = 'flex';

        const bankIcon = document.getElementById('ambassist-bank-icon');
        const buttonRect = bankIcon.getBoundingClientRect();
        settingsPanel.style.bottom = `${window.innerHeight - buttonRect.top - 36}px`;
        if (isMobile) {
            settingsPanel.style.right = `${window.innerWidth - buttonRect.right + 38}px`;
        } else {
            settingsPanel.style.right = `${window.innerWidth - buttonRect.right + 26}px`;
        }

        const settingsTimer = setTimeout(() => {
            if (document.getElementById('ambassist-settings-panel')) {
                settingsPanel.remove();
            }
        }, 45000);

        const closeSettingsPanel = () => {
            clearTimeout(settingsTimer);
            settingsPanel.remove();
        };

        document.getElementById('saveButton').addEventListener('click', () => {
            settings.apiKey = document.getElementById('apiKeyInput').value.trim();
            settings.channelId = document.getElementById('channelIdInput').value.trim();
            GM_setValue('apiKey', settings.apiKey);
            GM_setValue('channelId', settings.channelId);
            alert('Settings saved successfully!');
            closeSettingsPanel();
        });

        document.getElementById('closeButton').addEventListener('click', closeSettingsPanel);
        document.getElementById('settingsPanelClose').addEventListener('click', closeSettingsPanel);
    }

function sendRequestHandler(amount, buttonElement, callback) {
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    if (!settings.apiKey || !settings.channelId) {
        alert("Please set your API Key and Channel ID in settings first.");
        return;
    }
    if (!BACKEND_URL || !BACKEND_URL.includes('https://')) {
        alert("The backend URL is not a valid HTTPS URL.");
        return;
    }
    buttonElement.disabled = true;
    const originalText = buttonElement.textContent || 'Request';
    buttonElement.textContent = 'Sending...';

    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.torn.com/user/?selections=&key=${settings.apiKey}`,
        onload: (userResponse) => {
            const userData = JSON.parse(userResponse.responseText);
            if (userData.error) {
                alert(`API Error: ${userData.error.error}`);
                buttonElement.disabled = false;
                buttonElement.textContent = originalText;
                return;
            }
            if (!userData.faction || !userData.faction.faction_id) {
                alert("Could not find Faction ID.");
                buttonElement.disabled = false;
                buttonElement.textContent = originalText;
                return;
            }

            const factionId = userData.faction.faction_id;
            const userId = userData.player_id;
            const factionName = userData.faction.faction_name;

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/v2/user/money?key=${settings.apiKey}`,
                onload: (balanceResponse) => {
                    const balanceData = JSON.parse(balanceResponse.responseText);
                    if (balanceData.error) {
                        alert(`API Error while fetching balance: ${balanceData.error.error}`);
                        buttonElement.disabled = false;
                        buttonElement.textContent = originalText;
                        return;
                    }

                    const memberBalance = balanceData.money && balanceData.money.faction ? balanceData.money.faction.money : 0;

                    if (memberBalance >= amount) {
                        const tornData = { username: userData.name, amount: amount, userId: userId, factionId: factionId, channelId: settings.channelId, factionName: factionName };

                        GM_xmlhttpRequest({
                            method: "POST",
                            url: BACKEND_URL + '/torn-request',
                            headers: { "Content-Type": "application/json" },
                            data: JSON.stringify(tornData),
                            onload: function(response) {
                                if (response.status === 200) {
                                    const endTime = new Date().getTime() + (COOLDOWN_SECONDS * 1000);
                                    GM_setValue('cooldownEndTime', endTime);
                                    updateCooldownDisplay(buttonElement);

                                    buttonElement.textContent = 'Sent!';
                                    setTimeout(() => {
                                        if (callback) callback();
                                    }, 2000);
                                } else {
                                    alert("Failed to send request to bot. Check console.");
                                    buttonElement.disabled = false;
                                    buttonElement.textContent = originalText;
                                }
                            },
                            onerror: function(error) {
                                alert("A network error occurred. Is the backend running and firewall configured?");
                                buttonElement.disabled = false;
                                buttonElement.textContent = originalText;
                            }
                        });
                    } else {
                        alert(`Insufficient funds in your faction bank account. The requested amount is $${new Intl.NumberFormat().format(amount)}, but your balance is only $${new Intl.NumberFormat().format(memberBalance)}.`);
                        buttonElement.disabled = false;
                        buttonElement.textContent = originalText;
                    }
                },
                onerror: function(error) {
                    alert("A network error occurred while checking your balance. Check your API key.");
                    buttonElement.disabled = false;
                    buttonElement.textContent = originalText;
                }
            });
        },
        onerror: function(error) {
            alert("A network error occurred with the Torn API. Check your API key.");
            buttonElement.disabled = false;
            buttonElement.textContent = originalText;
        }
    });
}

    function isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    }

function initializeUI() {
    if (document.getElementById('ambassist-bank-icon')) return;

    const isMobile = isMobileDevice();

    const style = document.createElement('style');
    style.innerHTML = `
    #ambassist-bank-icon {
        position: fixed !important;
        bottom: 37px !important;
        right: 5px !important;
        z-index: 99999 !important;
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        cursor: pointer;
        width: 38px;
        min-width: 38px;
        height: 38px;
        border: none;
        padding: 0;
        background: linear-gradient(180deg, #00698c, #003040);
        border-radius: 5px 5px 0 0;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 0 4px hsla(0,0%,100%,.251), inset 0 -2px 4px 0 rgba(0,0,0,.502);
    }
    #ambassist-bank-icon:hover {
        background: linear-gradient(180deg, #008fbf, #004c66);
        box-shadow: inset 0 0 4px hsla(0,0%,100%,.251), inset 0 -2px 4px 0 rgba(0,0,0,.502);
    }
    #ambassist-request-panel, #ambassist-settings-panel {
        position: fixed;
        z-index: 9998;
        width: 280px;
        background-color: #2e2e2e;
        border: 1px solid #444;
        border-bottom: none;
        border-radius: 5px 5px 0 0;
        box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.3);
        color: #fff;
        padding: 10px;
        display: none;
        flex-direction: column;
    }
    #ambassist-request-panel .header, #ambassist-settings-panel .header {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 16px;
        padding: 10px 10px 10px 15px;
        margin: -10px -10px 10px -10px;
        font-weight: bold;
        color: #c0c0c0;
        background-image: linear-gradient(to bottom, #101010, #222222);
        border-top: 1px solid #005080;
        border-bottom: 1px solid #005080;
        border-radius: 4px 4px 0 0;
        box-shadow: 0 1px 0 rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.1);
    }
    #ambassist-request-panel .header .title, #ambassist-settings-panel .header .title {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-grow: 1;
        color: #008fbf;
        text-shadow: 1px 1px 1px #000;
    }
    #ambassist-request-panel .header .close-btn, #ambassist-settings-panel .header .close-btn {
        background: linear-gradient(180deg, #101010, #222222);
        border: 1px solid #005080;
        color: #c0c0c0;
        cursor: pointer;
        font-size: 20px;
        opacity: 1;
        border-radius: 4px;
        padding: 2px 8px;
        text-shadow: 1px 1px 1px #000;
    }
    #ambassist-request-panel .header .close-btn:hover, #ambassist-settings-panel .header .close-btn:hover {
        background: #555;
        color: #fff;
    }
    #ambassist-request-panel input, #ambassist-settings-panel input {
        background-color: #222;
        border: 1px solid #444;
        color: #fff;
        padding: 8px;
        border-radius: 4px;
        margin-bottom: 10px;
        width: 100%;
        box-sizing: border-box;
    }
    #ambassist-request-panel button, #ambassist-settings-panel button {
        background: linear-gradient(180deg, #2884b2, #18506b);
        border: 1px solid #23698c;
        color: #fff;
        cursor: pointer;
        padding: 10px;
        border-radius: 4px;
        font-weight: bold;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 1px rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.4);
    }
    #ambassist-request-panel button:hover, #ambassist-settings-panel button:hover {
        background: linear-gradient(180deg, #37a3d9, #1e6e91);
        border: 1px solid #2884b2;
    }
    #ambassist-request-panel button:active, #ambassist-settings-panel button:active {
        background: linear-gradient(180deg, #18506b, #2884b2);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
    }
    `;
    document.head.appendChild(style);

    const uiHtml = `
          <div id="ambassist-request-panel">
              <div class="header">
                  <div class="title">
                       <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="24" height="24" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;fill-rule:evenodd;clip-rule:evenodd" viewBox="0 0 512 481.75">
<path fill="#ccc" d="M11.18 166.57 246.07 0l236.1 166.57H11.18zm414.96 156.44-5.39-24.71c23.12 4.31 60.2 51.38 72.19 72.78 6.12 10.92 11.48 22.96 15.86 36.41 8.75 32.55.33 63-34.99 70.09-22.13 4.46-63.4 4.77-86.66 3.56-25.03-1.28-63.74-1.25-73.86-26.94-16.31-41.46 13.58-90.85 40.85-121.09 3.6-3.98 7.32-7.68 11.14-11.11 9.92-8.72 20.62-19.08 33.39-23.38l-12.34 22.96 17.92-23.75h9.42l12.47 25.18zm-11.53 19.59v6.95c4.58.49 8.52 1.43 11.79 2.83 3.29 1.42 6.14 3.55 8.59 6.43 1.93 2.19 3.42 4.44 4.47 6.74 1.05 2.33 1.58 4.43 1.58 6.36 0 2.15-.79 4.02-2.35 5.57-1.57 1.56-3.46 2.35-5.69 2.35-4.21 0-6.95-2.28-8.18-6.82-1.43-5.35-4.83-8.92-10.21-10.68v26.72c5.3 1.45 9.55 2.79 12.69 3.99 3.15 1.19 5.98 2.92 8.46 5.2 2.65 2.35 4.71 5.17 6.16 8.44 1.42 3.29 2.14 6.86 2.14 10.76 0 4.89-1.13 9.45-3.43 13.7-2.31 4.28-5.68 7.74-10.13 10.46-4.48 2.7-9.76 4.3-15.89 4.8v16c0 2.52-.25 4.37-.75 5.53-.49 1.16-1.56 1.73-3.25 1.73-1.53 0-2.6-.46-3.24-1.4-.62-.95-.92-2.42-.92-4.39v-17.34c-5-.54-9.38-1.73-13.13-3.53-3.75-1.79-6.89-4.03-9.39-6.71-2.49-2.69-4.36-5.48-5.54-8.35-1.21-2.89-1.8-5.74-1.8-8.53 0-2.03.79-3.9 2.41-5.54 1.6-1.64 3.6-2.48 5.99-2.48 1.93 0 3.55.44 4.88 1.34 1.32.9 2.24 2.17 2.77 3.79 1.14 3.51 2.15 6.21 3 8.07.88 1.86 2.17 3.57 3.9 5.11 1.73 1.53 4.04 2.71 6.91 3.53v-29.86c-5.75-1.6-10.53-3.35-14.38-5.3-3.86-1.96-7-4.72-9.38-8.31-2.39-3.6-3.6-8.22-3.6-13.88 0-7.36 2.35-13.41 7.04-18.11 4.69-4.71 11.46-7.45 20.32-8.22v-6.81c0-3.6 1.36-5.4 4.05-5.4 2.75 0 4.11 1.76 4.11 5.26zm-8.16 44.07v-24.6c-3.6 1.08-6.4 2.48-8.42 4.23-2.02 1.75-3.03 4.43-3.03 7.98 0 3.37.95 5.94 2.83 7.67 1.89 1.74 4.76 3.31 8.62 4.72zm8.16 19.07v28.14c4.31-.85 7.65-2.58 10.01-5.19 2.35-2.63 3.53-5.66 3.53-9.14 0-3.73-1.14-6.6-3.44-8.64-2.28-2.04-5.66-3.77-10.1-5.17zm-23.46-142.75c-4.08-12.02-7.76-24.2-10.85-36.56 11.55-12.68 56.24-10.99 69.08-.19l-11.89 28.28c6.4-8.4 8.55-11.85 12.37-16.54 1.59 1.05 3.11 2.23 4.53 3.52 3.38 3.07 6.4 6.45 7.02 11.16.39 3.06-.49 6.18-3.2 9.35L430.9 293.8c-3.5-.58-6.94-1.41-10.27-2.6 1.55-3.64 3.42-7.65 4.96-11.29l-9.94 10.73c-10.34-2.19-18.67-.89-26.43 3.22l-27.68-33.23c-1.64-1.97-2.38-3.96-2.38-5.93.03-8.04 11.99-14.96 18.27-17.59l13.72 25.88zM0 409.64h27.32v-25.35h14.33v-12.1h15.42v-145.1H25.55v-34.77h367.39c-12.5 2.38-23.86 7.12-31.36 14.51a27.239 27.239 0 0 0-7.33 12.15c-3.14 2.06-6.26 4.46-9.03 7.12l-1 .99h-15.8v94.31c-15.65 18.55-31.3 42.46-39.91 67.98-5.15 15.26-7.82 31.07-6.71 46.81H0v-26.55zm433.74-217.32h32.81v13.07c-7.58-6.27-19.7-10.74-32.81-13.07zM130.53 384.29h17.78v-12.1h15.42v-145.1h-48.62v145.1h15.42v12.1zm106.65 0H255v-12.1h15.38v-145.1h-48.62v145.1h15.42v12.1zm-70.21-259.73 79.46-60.96 79.9 60.96H166.97z"/>
</svg>
                      AmbAssist
                  </div>
                  <button class="close-btn" id="requestPanelClose">&times;</button>
              </div>
              <label for="requestAmount">Request from Faction Balance:</label><br>
              <input type="text" id="requestAmount" placeholder="e.g., 50m (then push enter)"><br>
              <button id="requestButton">Request</button>
          </div>`;
    document.body.insertAdjacentHTML('beforeend', uiHtml);
    const requestPanel = document.getElementById('ambassist-request-panel');

    const bankIcon = document.createElement('button');
    bankIcon.id = 'ambassist-bank-icon';
    bankIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="24" height="24" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;fill-rule:evenodd;clip-rule:evenodd" viewBox="0 0 512 481.75">
<path fill="#ccc" d="M11.18 166.57 246.07 0l236.1 166.57H11.18zm414.96 156.44-5.39-24.71c23.12 4.31 60.2 51.38 72.19 72.78 6.12 10.92 11.48 22.96 15.86 36.41 8.75 32.55.33 63-34.99 70.09-22.13 4.46-63.4 4.77-86.66 3.56-25.03-1.28-63.74-1.25-73.86-26.94-16.31-41.46 13.58-90.85 40.85-121.09 3.6-3.98 7.32-7.68 11.14-11.11 9.92-8.72 20.62-19.08 33.39-23.38l-12.34 22.96 17.92-23.75h9.42l12.47 25.18zm-11.53 19.59v6.95c4.58.49 8.52 1.43 11.79 2.83 3.29 1.42 6.14 3.55 8.59 6.43 1.93 2.19 3.42 4.44 4.47 6.74 1.05 2.33 1.58 4.43 1.58 6.36 0 2.15-.79 4.02-2.35 5.57-1.57 1.56-3.46 2.35-5.69 2.35-4.21 0-6.95-2.28-8.18-6.82-1.43-5.35-4.83-8.92-10.21-10.68v26.72c5.3 1.45 9.55 2.79 12.69 3.99 3.15 1.19 5.98 2.92 8.46 5.2 2.65 2.35 4.71 5.17 6.16 8.44 1.42 3.29 2.14 6.86 2.14 10.76 0 4.89-1.13 9.45-3.43 13.7-2.31 4.28-5.68 7.74-10.13 10.46-4.48 2.7-9.76 4.3-15.89 4.8v16c0 2.52-.25 4.37-.75 5.53-.49 1.16-1.56 1.73-3.25 1.73-1.53 0-2.6-.46-3.24-1.4-.62-.95-.92-2.42-.92-4.39v-17.34c-5-.54-9.38-1.73-13.13-3.53-3.75-1.79-6.89-4.03-9.39-6.71-2.49-2.69-4.36-5.48-5.54-8.35-1.21-2.89-1.8-5.74-1.8-8.53 0 2.03.79-3.9 2.41-5.54 1.6-1.64 3.6-2.48 5.99-2.48 1.93 0 3.55.44 4.88 1.34 1.32.9 2.24 2.17 2.77 3.79 1.14 3.51 2.15 6.21 3 8.07.88 1.86 2.17 3.57 3.9 5.11 1.73 1.53 4.04 2.71 6.91 3.53v-29.86c-5.75-1.6-10.53-3.35-14.38-5.3-3.86-1.96-7-4.72-9.38-8.31-2.39-3.6-3.6-8.22-3.6-13.88 0-7.36 2.35-13.41 7.04-18.11 4.69-4.71 11.46-7.45 20.32-8.22v-6.81c0-3.6 1.36-5.4 4.05-5.4 2.75 0 4.11 1.76 4.11 5.26zm-8.16 44.07v-24.6c-3.6 1.08-6.4 2.48-8.42 4.23-2.02 1.75-3.03 4.43-3.03 7.98 0 3.37.95 5.94 2.83 7.67 1.89 1.74 4.76 3.31 8.62 4.72zm8.16 19.07v28.14c4.31-.85 7.65-2.58 10.01-5.19 2.35-2.63 3.53-5.66 3.53-9.14 0-3.73-1.14-6.6-3.44-8.64-2.28-2.04-5.66-3.77-10.1-5.17zm-23.46-142.75c-4.08-12.02-7.76-24.2-10.85-36.56 11.55-12.68 56.24-10.99 69.08-.19l-11.89 28.28c6.4-8.4 8.55-11.85 12.37-16.54 1.59 1.05 3.11 2.23 4.53 3.52 3.38 3.07 6.4 6.45 7.02 11.16.39 3.06-.49 6.18-3.2 9.35L430.9 293.8c-3.5-.58-6.94-1.41-10.27-2.6 1.55-3.64 3.42-7.65 4.96-11.29l-9.94 10.73c-10.34-2.19-18.67-.89-26.43 3.22l-27.68-33.23c-1.64-1.97-2.38-3.96-2.38-5.93.03-8.04 11.99-14.96 18.27-17.59l13.72 25.88zM0 409.64h27.32v-25.35h14.33v-12.1h15.42v-145.1H25.55v-34.77h367.39c-12.5 2.38-23.86 7.12-31.36 14.51a27.239 27.239 0 0 0-7.33 12.15c-3.14 2.06-6.26 4.46-9.03 7.12l-1 .99h-15.8v94.31c-15.65 18.55-31.3 42.46-39.91 67.98-5.15 15.26-7.82 31.07-6.71 46.81H0v-26.55zm433.74-217.32h32.81v13.07c-7.58-6.27-19.7-10.74-32.81-13.07zM130.53 384.29h17.78v-12.1h15.42v-145.1h-48.62v145.1h15.42v12.1zm106.65 0H255v-12.1h15.38v-145.1h-48.62v145.1h15.42v12.1zm-70.21-259.73 79.46-60.96 79.9 60.96H166.97z"/>
</svg>`;
    document.body.appendChild(bankIcon);

    const notificationBubble = document.querySelector('div[class^="notification-wrapper___"]');
    if (notificationBubble) {
        notificationBubble.style.zIndex = '99999';
    }

    let pressTimer;
    let requestPanelTimer;

    function updatePanelPosition() {
        const buttonRect = bankIcon.getBoundingClientRect();
        requestPanel.style.bottom = `${window.innerHeight - buttonRect.top - 36}px`;
        if (isMobile) {
            requestPanel.style.right = `${window.innerWidth - buttonRect.right + 38}px`;
        } else {
            requestPanel.style.right = `${window.innerWidth - buttonRect.right + 26}px`;
        }
    }

    const closeRequestPanel = () => {
        clearTimeout(requestPanelTimer);
        requestPanel.style.display = 'none';
    };

    const openRequestPanel = () => {
        updatePanelPosition();
        requestPanel.style.display = 'flex';
        requestPanelTimer = setTimeout(closeRequestPanel, 25000);
    };

    bankIcon.addEventListener('click', (event) => {
        event.preventDefault();
        if (requestPanel.style.display === 'none' || requestPanel.style.display === '') {
            openRequestPanel();
        } else {
            closeRequestPanel();
        }
    });

    bankIcon.addEventListener('pointerdown', () => {
        pressTimer = setTimeout(() => {
            showSettingsPopup();
        }, 1000);
    });
    bankIcon.addEventListener('pointerup', () => {
        clearTimeout(pressTimer);
    });

    document.getElementById('requestPanelClose').addEventListener('click', closeRequestPanel);

    const requestButton = document.getElementById('requestButton');
    const requestAmountInput = document.getElementById('requestAmount');
    requestButton.addEventListener('click', () => {
        const rawAmount = requestAmountInput.value;
        const amount = parseShorthandAmount(rawAmount);
        sendRequestHandler(amount, requestButton, () => {
            requestAmountInput.value = '';
            closeRequestPanel();
        });
    });
    requestAmountInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); requestButton.click(); } });
}

// Initial run on page load after a delay to ensure the UI is fully rendered
setTimeout(initializeUI, 25);

})();