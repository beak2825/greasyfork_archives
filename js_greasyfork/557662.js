// ==UserScript==
// @name         Recruiter 3000
// @namespace    https://torn.com/
// @version      1.0
// @description  working 9 to 5
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557662/Recruiter%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/557662/Recruiter%203000.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY_PREFIX = "recruiter_3000_";
    const KEY_INDEX = KEY_PREFIX + "index";
    const KEY_MSG = KEY_PREFIX + "msg";
    const KEY_IDS = KEY_PREFIX + "ids";
    const KEY_ENABLED = KEY_PREFIX + "enabled";

    const SEND_SVG_START = "M18,0l-4.5,16.5";

    let currentIndex = parseInt(localStorage.getItem(KEY_INDEX) || "0");
    let customMessage = localStorage.getItem(KEY_MSG) || "";
    let rawIdString = localStorage.getItem(KEY_IDS) || "";
    let isAutoTextEnabled = (localStorage.getItem(KEY_ENABLED) !== "false");
    let isCloseMode = false;

    let idList = parseIdString(rawIdString);

    function parseIdString(str) {
        if (!str) return [];
        return str.replace(/[\[\]'"]/g, ' ')
                  .replace(/,/g, ' ')
                  .split(/\s+/)
                  .map(s => s.trim())
                  .filter(s => s.length > 0);
    }

    function setReactValue(element, value) {
        let lastValue = element.value;
        element.value = value;
        let event = new Event('input', { bubbles: true });
        let tracker = element._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        element.dispatchEvent(event);
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function triggerEvent(element, type) {
        let e = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(e);
    }

    function attachSearchListener() {
        let searchInput = document.querySelector('input[placeholder*="Search by player name"]');

        if (searchInput && !searchInput.dataset.acsHooked) {
            searchInput.dataset.acsHooked = "true";

            ['click', 'focus'].forEach(evt => {
                searchInput.addEventListener(evt, () => {
                    if (idList.length === 0) return;
                    if (currentIndex < idList.length) {
                        let targetID = idList[currentIndex];
                        if (searchInput.value !== targetID) {
                            setReactValue(searchInput, targetID);
                        }
                    }
                });
            });
        }
    }

    function addToggleButton() {
        if (document.getElementById('acs-toggle-btn')) return;

        let btn = document.createElement('button');
        btn.id = 'acs-toggle-btn';
        btn.innerText = "WAITING...";

        Object.assign(btn.style, {
            position: 'fixed',
            zIndex: '9999998',
            border: 'none',
            borderTopRightRadius: '5px',
            borderBottomRightRadius: '5px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            fontSize: '12px',
            cursor: 'default',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
            display: 'none',
            color: '#fff',
            transition: 'background 0.1s'
        });

        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(confirm("Reset Progress to 0?")) {
                localStorage.setItem(KEY_INDEX, "0");
                currentIndex = 0;
                isCloseMode = false;
            }
        });

        btn.addEventListener('click', (e) => {
            handleToggleClick(btn);
        });

        document.body.appendChild(btn);
    }

    function addSettingsPanel() {
        if (document.getElementById('acs-settings-panel')) return;

        let panel = document.createElement('div');
        panel.id = 'acs-settings-panel';

        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            zIndex: '9999999',
            background: 'rgba(0,0,0,0.9)',
            padding: '10px',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
            fontSize: '11px',
            border: '1px solid #444',
            width: '260px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        });

        let headerRow = document.createElement('div');
        headerRow.style.display = 'flex';
        headerRow.style.justifyContent = 'space-between';
        headerRow.style.alignItems = 'center';

        let label = document.createElement('span');
        label.innerText = "Recruiter 3000";
        label.style.fontWeight = 'bold';
        label.style.color = '#00ff00';

        let toggleLabel = document.createElement('label');
        toggleLabel.style.cursor = 'pointer';
        toggleLabel.innerText = "Auto-Paste? ";

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isAutoTextEnabled;
        checkbox.style.verticalAlign = 'middle';
        checkbox.addEventListener('change', (e) => {
            isAutoTextEnabled = e.target.checked;
            localStorage.setItem(KEY_ENABLED, isAutoTextEnabled);
        });

        toggleLabel.appendChild(checkbox);
        headerRow.appendChild(label);
        headerRow.appendChild(toggleLabel);

        let idLabel = document.createElement('div');
        idLabel.innerText = "Target IDs:";
        idLabel.style.color = '#ccc';

        let idInput = document.createElement('textarea');
        idInput.value = rawIdString;
        idInput.placeholder = "12345, 67890...";
        Object.assign(idInput.style, {
            width: '100%',
            height: '40px',
            background: '#222',
            color: '#afa',
            border: '1px solid #555',
            borderRadius: '4px',
            fontSize: '10px',
            resize: 'vertical',
            fontFamily: 'monospace'
        });

        idInput.addEventListener('input', (e) => {
            rawIdString = e.target.value;
            localStorage.setItem(KEY_IDS, rawIdString);
            idList = parseIdString(rawIdString);
        });

        let msgLabel = document.createElement('div');
        msgLabel.innerText = "Message:";
        msgLabel.style.color = '#ccc';

        let msgInput = document.createElement('textarea');
        msgInput.value = customMessage;
        msgInput.placeholder = "Enter message...";
        Object.assign(msgInput.style, {
            width: '100%',
            height: '40px',
            background: '#222',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            fontSize: '11px',
            resize: 'vertical'
        });

        msgInput.addEventListener('input', (e) => {
            customMessage = e.target.value;
            localStorage.setItem(KEY_MSG, customMessage);
        });

        panel.appendChild(headerRow);
        panel.appendChild(idLabel);
        panel.appendChild(idInput);
        panel.appendChild(msgLabel);
        panel.appendChild(msgInput);

        document.body.appendChild(panel);
    }

    function magnetLoop() {
        let btn = document.getElementById('acs-toggle-btn');
        if (!btn) return;

        let searchInput = document.querySelector('input[placeholder*="Search by player name"]');

        if (searchInput) {
            let rect = searchInput.getBoundingClientRect();
            let halfWidth = rect.width / 2;

            btn.style.display = 'block';
            btn.style.top = rect.top + 'px';
            btn.style.left = (rect.left + halfWidth) + 'px';
            btn.style.width = halfWidth + 'px';
            btn.style.height = rect.height + 'px';
        } else {
            btn.style.display = 'none';
        }
    }

    function updateLoop() {
        let btn = document.getElementById('acs-toggle-btn');
        if (!btn) return;

        if (currentIndex >= idList.length) {
            if (idList.length > 0) {
                currentIndex = 0;
                localStorage.setItem(KEY_INDEX, "0");
            }
        }

        if (idList.length === 0) {
            btn.innerText = "NO IDS";
            btn.style.background = "#555";
            return;
        }

        let targetID = idList[currentIndex];
        let textAreas = document.querySelectorAll('textarea.textarea___V8HsV');
        let activeArea = Array.from(textAreas).find(el => el.offsetParent !== null);
        let progressStr = `[${currentIndex + 1}/${idList.length}]`;

        if (!activeArea) {
            if (isCloseMode) isCloseMode = false;
            btn.innerText = `ID: ${targetID} ${progressStr}`;
            btn.style.background = "#444";
            btn.dataset.status = "waiting";
            attachSearchListener();
        } else {
            if (isAutoTextEnabled && activeArea.value === "" && !isCloseMode) {
                setReactValue(activeArea, customMessage);
            }
            if (!isCloseMode) {
                btn.innerText = `SEND >> ${progressStr}`;
                btn.style.background = "#00cc00";
                btn.dataset.status = "ready_send";
            } else {
                btn.innerText = `CLOSE [X] ${progressStr}`;
                btn.style.background = "#cc0000";
                btn.dataset.status = "ready_close";
            }
        }
    }

    function handleToggleClick(btn) {
        let status = btn.dataset.status;

        if (status === "ready_send") {
            let textAreas = document.querySelectorAll('textarea.textarea___V8HsV');
            let activeArea = Array.from(textAreas).find(el => el.offsetParent !== null);
            if (!activeArea) return;

            let wrapper = activeArea.parentElement;
            let sendPath = Array.from(wrapper.querySelectorAll('path')).find(p => p.getAttribute('d') && p.getAttribute('d').startsWith(SEND_SVG_START));
            let realSendBtn = sendPath ? sendPath.closest('button') : null;

            if (realSendBtn) {
                realSendBtn.removeAttribute('disabled');
                realSendBtn.disabled = false;
                realSendBtn.click();
                isCloseMode = true;
            }
        } else if (status === "ready_close") {
            let textAreas = document.querySelectorAll('textarea.textarea___V8HsV');
            let activeArea = Array.from(textAreas).find(el => el.offsetParent !== null);
            let chatWindow = activeArea ? activeArea.closest('div[id^="private-"]') : null;

            if (chatWindow) {
                let closeSvg = chatWindow.querySelector('svg[aria-label="Close"]');
                if (closeSvg) {
                     triggerEvent(closeSvg, 'mousedown');
                     triggerEvent(closeSvg, 'click');
                     triggerEvent(closeSvg, 'mouseup');
                }
            }

            setTimeout(() => {
                if (chatWindow) chatWindow.remove();
            }, 50);

            currentIndex++;
            localStorage.setItem(KEY_INDEX, currentIndex.toString());
            isCloseMode = false;
        }
    }

    function init() {
        addToggleButton();
        addSettingsPanel();
        setInterval(updateLoop, 100);
        setInterval(magnetLoop, 50);
        setInterval(attachSearchListener, 1000);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();