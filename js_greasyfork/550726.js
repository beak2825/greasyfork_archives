// ==UserScript==
// @name         TorrentBD Shoutbox Cleaner (Enhanced)
// @namespace    N/A
// @version      1.1
// @description  Modern, highly configurable cleaner for the TorrentBD shoutbox. Hide system messages, all user messages, and specific User IDs.
// @author       Sumbul⚡(UI by Gojuuroku & original script by LittleFox)
// @license      MIT
// @icon         https://s14.gifyu.com/images/bTqsQ.png
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550726/TorrentBD%20Shoutbox%20Cleaner%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550726/TorrentBD%20Shoutbox%20Cleaner%20%28Enhanced%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const systemFilters = {
        torrent: { phrase: "New Torrent :", label: "New Torrents" },
        forumPost: { phrase: "New Forum Post", label: "New Forum Posts" },
        forumTopic: { phrase: "New Forum Topic", label: "New Forum Topics" },
        request: { phrase: "New Request :", label: "New Requests" }
    };

    function checkShoutbox() {
        const shoutItems = document.querySelectorAll(".shout-item");
        const isEnabled = GM_getValue('sbc_enabled', true);
        const systemFilterStates = {};
        for (const key in systemFilters) {
            systemFilterStates[key] = GM_getValue(`sbc_filter_${key}`, true);
        }
        const hideAllUsers = GM_getValue('sbc_hide_all_users', false);
        const blockUsersEnabled = GM_getValue('sbc_block_users_enabled', true);
        const blockedUserIDs = GM_getValue('sbc_blocked_user_ids', []).filter(Boolean);

        shoutItems.forEach((item) => {
            item.style.display = "";
            if (!isEnabled) return;

            const textField = item.querySelector(".shout-text");
            if (!textField) return;

            const lowerCaseText = textField.textContent.toLowerCase();
            let shouldHide = false;

            let isSystemMessage = false;
            let systemMessageType = null;
            for (const key in systemFilters) {
                if (lowerCaseText.includes(systemFilters[key].phrase.toLowerCase())) {
                    isSystemMessage = true;
                    systemMessageType = key;
                    break;
                }
            }

            if (isSystemMessage) {
                if (systemFilterStates[systemMessageType]) {
                    shouldHide = true;
                }
            } else {
                if (hideAllUsers) {
                    shouldHide = true;
                }
                else if (blockUsersEnabled && blockedUserIDs.length > 0) {
                    const idElement = item.querySelector('.shout-user [data-tid]');
                    const userID = idElement ? idElement.getAttribute('data-tid') : null;
                    if (userID && blockedUserIDs.includes(userID)) {
                        shouldHide = true;
                    }
                }
            }

            if (shouldHide) {
                item.style.display = "none";
            }
        });
    }

    function createSettingsUI() {
        if (document.querySelector("#sbc-modal-wrapper")) return;
        const uiWrapper = document.createElement("div");
        uiWrapper.id = "sbc-modal-wrapper";
        uiWrapper.style.display = "none";
        uiWrapper.innerHTML = `
            <div id="sbc-container">
                <div id="sbc-header">
                    <h1>🧹 Shoutbox Cleaner</h1>
                    <p>Hide unwanted messages from the shoutbox</p>
                    <button id="sbc-close-btn" title="Close">×</button>
                </div>
                <div id="sbc-content">
                    <div class="sbc-setting-row sbc-master-switch">
                        <label for="sbc-enabled-switch">Enable Cleaner</label>
                        <label class="sbc-switch"><input type="checkbox" id="sbc-enabled-switch"><span class="sbc-slider"></span></label>
                    </div>
                    <hr class="sbc-divider">
                    <div class="sbc-section">
                        <h2 class="sbc-section-header">Hide system messages</h2>
                        <div class="sbc-setting-row">
                           <label for="sbc-hide-all-users-switch">New Messages</label>
                           <label class="sbc-switch"><input type="checkbox" id="sbc-hide-all-users-switch"><span class="sbc-slider"></span></label>
                        </div>
                        ${Object.keys(systemFilters).map(key => `<div class="sbc-setting-row"><label for="sbc_filter_${key}">${systemFilters[key].label}</label><label class="sbc-switch"><input type="checkbox" id="sbc_filter_${key}"><span class="sbc-slider"></span></label></div>`).join("")}
                    </div>
                    <hr class="sbc-divider">
                    <div class="sbc-section">
                        <h2 class="sbc-section-header">Custom Filters</h2>
                        <div class="sbc-form-group">
                             <div class="sbc-setting-row">
                                <label for="sbc-block-users-switch">Block by User ID</label>
                                <label class="sbc-switch"><input type="checkbox" id="sbc-block-users-switch"><span class="sbc-slider"></span></label>
                            </div>
                            <textarea id="sbc-blocked-user-ids" placeholder=""></textarea>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(uiWrapper);
        const elements = {
            enabledSwitch: document.getElementById('sbc-enabled-switch'),
            hideAllUsersSwitch: document.getElementById('sbc-hide-all-users-switch'),
            blockUsersSwitch: document.getElementById('sbc-block-users-switch'),
            blockedUserIDsArea: document.getElementById('sbc-blocked-user-ids'),
            contentContainer: document.getElementById('sbc-content'),
            closeBtn: document.getElementById('sbc-close-btn')
        };
        const loadSettings = () => {
            const isEnabled = GM_getValue('sbc_enabled', true);
            elements.enabledSwitch.checked = isEnabled;
            // The content container itself is no longer grayed out, only its child sections
            const sections = elements.contentContainer.querySelectorAll('.sbc-section');
            sections.forEach(section => {
                section.style.opacity = isEnabled ? '1' : '0.5';
                section.style.pointerEvents = isEnabled ? 'auto' : 'none';
            });

            for (const key in systemFilters) {
                document.getElementById(`sbc_filter_${key}`).checked = GM_getValue(`sbc_filter_${key}`, true);
            }
            elements.hideAllUsersSwitch.checked = GM_getValue('sbc_hide_all_users', false);
            const blockUsersEnabled = GM_getValue('sbc_block_users_enabled', true);
            elements.blockUsersSwitch.checked = blockUsersEnabled;
            elements.blockedUserIDsArea.disabled = !blockUsersEnabled;
            elements.blockedUserIDsArea.value = GM_getValue('sbc_blocked_user_ids', []).join('\n');
        };
        elements.enabledSwitch.addEventListener('change', () => {
            const isEnabled = elements.enabledSwitch.checked;
            GM_setValue('sbc_enabled', isEnabled);
            const sections = elements.contentContainer.querySelectorAll('.sbc-section');
            sections.forEach(section => {
                section.style.opacity = isEnabled ? '1' : '0.5';
                section.style.pointerEvents = isEnabled ? 'auto' : 'none';
            });
            checkShoutbox();
        });
        for (const key in systemFilters) {
            document.getElementById(`sbc_filter_${key}`).addEventListener('change', (e) => {
                GM_setValue(`sbc_filter_${key}`, e.target.checked);
                checkShoutbox();
            });
        }
        elements.hideAllUsersSwitch.addEventListener('change', (e) => {
            GM_setValue('sbc_hide_all_users', e.target.checked);
            checkShoutbox();
        });
        elements.blockUsersSwitch.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            GM_setValue('sbc_block_users_enabled', isChecked);
            elements.blockedUserIDsArea.disabled = !isChecked;
            checkShoutbox();
        });
        elements.blockedUserIDsArea.addEventListener('input', () => {
            GM_setValue('sbc_blocked_user_ids', elements.blockedUserIDsArea.value.split('\n').map(u => u.trim()));
            checkShoutbox();
        });
        elements.closeBtn.addEventListener('click', () => { uiWrapper.style.display = 'none'; });
        uiWrapper.addEventListener('click', (e) => {
            if (e.target.id === 'sbc-modal-wrapper') {
                uiWrapper.style.display = 'none';
            }
        });
        loadSettings();
        return { uiWrapper, loadSettings };
    }

    function addSettingsButton() {
        const { uiWrapper, loadSettings } = createSettingsUI();
        const titleElement = document.querySelector('#shoutbox-container .content-title h6.left');
        if (titleElement && !document.querySelector("#sbc-settings-btn")) {
            const btn = document.createElement("div");
            btn.id = "sbc-settings-btn";
            btn.title = "Shoutbox Cleaner Settings";
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M14.457 1.314a1.5 1.5 0 0 1 2.112 1.056l.106.425a1.5 1.5 0 0 0 1.341 1.033l.443.044a1.5 1.5 0 0 1 1.579 1.95l-.17.426a1.5 1.5 0 0 0 .618 1.51l.36.27a1.5 1.5 0 0 1 .18 2.23l-.282.376a1.5 1.5 0 0 0 0 1.732l.282.376a1.5 1.5 0 0 1-.18 2.23l-.36.27a1.5 1.5 0 0 0-.618 1.51l.17.426a1.5 1.5 0 0 1-1.58 1.95l-.443.044a1.5 1.5 0 0 0-1.34 1.033l-.107.425a1.5 1.5 0 0 1-2.112 1.056L9.6 22.32a1.5 1.5 0 0 0-1.2 0L3.957 23.686a1.5 1.5 0 0 1-2.112-1.056l-.106-.425a1.5 1.5 0 0 0-1.341-1.033l-.443-.044a1.5 1.5 0 0 1-1.579-1.95l.17-.426a1.5 1.5 0 0 0-.618-1.51l-.36-.27a1.5 1.5 0 0 1-.18-2.23l.282-.376a1.5 1.5 0 0 0 0-1.732l-.282-.376a1.5 1.5 0 0 1 .18-2.23l.36-.27a1.5 1.5 0 0 0 .618-1.51l-.17-.426A1.5 1.5 0 0 1 .71 3.91l.443-.044A1.5 1.5 0 0 0 2.494 2.83l.107-.425a1.5 1.5 0 0 1 2.112-1.056L9.6 1.68a1.5 1.5 0 0 0 1.2 0l3.657-1.424ZM9.25 12.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H9.25Z" clip-rule="evenodd" /></svg>`;
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                loadSettings();
                uiWrapper.style.display = "flex";
            });
            titleElement.style.display = 'flex';
            titleElement.style.alignItems = 'center';
            titleElement.appendChild(btn);
        }
    }

    GM_addStyle(`
        #sbc-modal-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: fixed; z-index: 9998; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: none; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
        #sbc-container { background-color: #2c2c2c; color: #e0e0e0; border: 1px solid #4a4a4a; border-radius: 16px; width: 90%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; max-height: 90vh; }
        #sbc-header { padding: 24px; text-align: center; position: relative; flex-shrink: 0; }
        #sbc-header h1 { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 8px 0; }
        #sbc-header p { font-size: 14px; color: #a0a0a0; margin: 0; }
        #sbc-close-btn { position: absolute; top: 8px; right: 12px; border: none; background: none; color: #888; cursor: pointer; font-size: 28px; font-weight: bold; transition: color .2s; padding: 4px; line-height: 1; }
        #sbc-close-btn:hover { color: #fff; }
        #sbc-content { padding: 24px; overflow-y: auto; }
        .sbc-section { transition: opacity 0.3s ease; }
        .sbc-form-group { margin-bottom: 20px; }
        #sbc-content label { font-weight: 500; color: #CFCFCF; font-size: 14px; }
        .sbc-setting-row > label:first-child { flex-grow: 1; }
        textarea { width: 100%; height: 100px; resize: vertical; background-color: #202020; border: 1px solid #555; border-radius: 8px; padding: 10px; font-size: 14px; box-sizing: border-box; margin-top: 8px; transition: opacity 0.3s; }
        textarea:disabled { opacity: 0.5; cursor: not-allowed; }
        textarea:focus { outline: none; border-color: #888; }
        .sbc-section-header { font-size: 12px; text-transform: uppercase; color: #888; margin: 0 0 16px 0; letter-spacing: 0.5px; }
        .sbc-divider { border: none; border-top: 1px solid #444; margin: 20px 0; }
        .sbc-setting-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
        .sbc-master-switch { padding-bottom: 0; }
        .sbc-master-switch label:first-child { font-size: 16px; font-weight: 600; color: #fff; }
        .sbc-switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; cursor: pointer; }
        .sbc-switch input { opacity: 0; width: 0; height: 0; }
        .sbc-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .4s; border-radius: 24px; }
        .sbc-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .sbc-slider { background-color: #14a76c; }
        input:checked + .sbc-slider:before { transform: translateX(20px); }
        #sbc-settings-btn { cursor: pointer; margin-left: 10px; display: inline-flex; align-items: center; color: #9e9e9e; transition: color .2s ease; }
        #sbc-settings-btn:hover { color: #fff; }
    `);

    window.addEventListener('load', () => {
        addSettingsButton();
        const shoutContainer = document.querySelector("#shouts-container");
        if (shoutContainer) {
            const observer = new MutationObserver(checkShoutbox);
            observer.observe(shoutContainer, { childList: true, subtree: true });
            checkShoutbox();
        } else {
            let retries = 0;
            const fallbackInterval = setInterval(() => {
                const dynamicShoutContainer = document.querySelector("#shouts-container");
                if (dynamicShoutContainer) {
                    clearInterval(fallbackInterval);
                    const observer = new MutationObserver(checkShoutbox);
                    observer.observe(dynamicShoutContainer, { childList: true, subtree: true });
                    checkShoutbox();
                }
                retries++;
                if (retries > 20) {
                    clearInterval(fallbackInterval);
                }
            }, 500);
        }
    });
})();