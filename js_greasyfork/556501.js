// ==UserScript==
// @name            BetterTTV Plus
// @description     It's BetterTTV but the settings are stored by the Script Manager.
// @icon            https://cdn.betterttv.net/assets/logos/bttv_logo.png
// @author          SkauOfArcadia
// @homepage        https://skau.neocities.org/
// @match           https://*.twitch.tv/*
// @version         2025.11.24
// @grant           GM.getValue
// @grant           GM.setValue
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @run-at          document-start
// @namespace https://greasyfork.org/users/751327
// @downloadURL https://update.greasyfork.org/scripts/556501/BetterTTV%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/556501/BetterTTV%20Plus.meta.js
// ==/UserScript==
(function() {
    const BTTV_CDN = 'https://cdn.betterttv.net';
    const SETTINGS_KEY = 'bttv_settings';
    const DEFAULT_SETTINGS = '{\"emoteMenu\":2,\"emotes\":[55,16],\"channelPoints\":[7,2],\"autoClaim\":[1,1]}';
    const POLLING_INTERVAL = 1000; // Time in milliseconds for checking updates

    // Load BetterTTV script
    window.addEventListener("DOMContentLoaded", function() {
        const jsNode = document.createElement('script');
        jsNode.setAttribute('src', `${BTTV_CDN}/betterttv.js`);
        document.body.appendChild(jsNode);
    });

    // Variables for tracking the last known settings
    let lastSettings = localStorage.getItem(SETTINGS_KEY) || DEFAULT_SETTINGS;

    function logWithTimestamp(message) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] BTTV Plus: ${message}`);
    }

    // Function to save settings to GM
    function saveSettings(settings) {
        GM.setValue(SETTINGS_KEY, settings);
        logWithTimestamp("Settings saved!");
    }

    // Load settings from GM and set them to localStorage
    async function loadSettings() {
        const savedSettings = await GM.getValue(SETTINGS_KEY, lastSettings);
        localStorage.setItem(SETTINGS_KEY, savedSettings);
        logWithTimestamp("Settings loaded!");
    }

    // Initialize settings on script load
    loadSettings();

    // First use save
    GM.getValue(SETTINGS_KEY, null).then(value => {
        if (value === null) {
            saveSettings(lastSettings);
        }
    });

    // Periodically check for changes in localStorage
    setInterval(() => {
        const currentSettings = localStorage.getItem(SETTINGS_KEY);
        if (currentSettings === null) {
            currentSettings = lastSettings;
            localStorage.setItem(SETTINGS_KEY, currentSettings);
        }
        if (currentSettings !== lastSettings) {
            lastSettings = currentSettings;
            saveSettings(currentSettings);
        }
    }, POLLING_INTERVAL);
})();