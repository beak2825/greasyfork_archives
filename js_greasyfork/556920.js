// ==UserScript==
// @name         Torn Forums User Activity Panel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Floating panel + useractivity personalstats on name line in Torn forums
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/forums.php*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @run-at       document-end\
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556920/Torn%20Forums%20User%20Activity%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/556920/Torn%20Forums%20User%20Activity%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var STORAGE_KEY_DATA = 'tfua_userActivity';
    var STORAGE_KEY_APIKEY = 'tfua_apiKey';
    var STORAGE_KEY_ENABLED = 'tfua_enabled';
    var STORAGE_KEY_PANEL = 'tfua_panelState';
    var STORAGE_KEY_STYLE = 'tfua_style';
    var STORAGE_KEY_PANEL_VISIBLE = 'tfua_panelVisible';

    var DEFAULT_STYLE = {
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: 10,
        colorFirst: '#99c2ff',
        colorLast: '#c2ffc2',
        colorDiff: '#ffcc99'
    };

    function extend(target, source) {
        if (!source) return target;
        for (var k in source) {
            if (Object.prototype.hasOwnProperty.call(source, k)) {
                target[k] = source[k];
            }
        }
        return target;
    }

    function loadJson(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            console.error('[TFUA] parse error', key, e);
            return fallback;
        }
    }

    function saveJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('[TFUA] save error', key, e);
        }
    }

    var userData = loadJson(STORAGE_KEY_DATA, {});
    var enabledStr = localStorage.getItem(STORAGE_KEY_ENABLED);
    var enabled = enabledStr === null ? true : enabledStr !== 'false';
    var apiKey = localStorage.getItem(STORAGE_KEY_APIKEY) || '';
    var panelState = loadJson(STORAGE_KEY_PANEL, null);
    var styleSettings = extend(extend({}, DEFAULT_STYLE), loadJson(STORAGE_KEY_STYLE, {}));
    var panelVisibleStr = localStorage.getItem(STORAGE_KEY_PANEL_VISIBLE);
    var panelVisible = panelVisibleStr === null ? true : panelVisibleStr !== 'false';

    GM_addStyle(
        '#tfua-panel{' +
        'position:fixed;' +
        'top:100px;' +
        'left:40px;' +
        'width:260px;' +
        'min-width:220px;' +
        'min-height:80px;' +
        'background:#111;' +
        'color:#eee;' +
        'font-family:Tahoma,Arial,sans-serif;' +
        'font-size:12px;' +
        'border:1px solid #666;' +
        'border-radius:4px;' +
        'z-index:99999;' +
        'resize:both;' +
        'overflow:auto;' +
        'box-shadow:0 0 10px rgba(0,0,0,0.7);' +
        '}' +
        '#tfua-panel-header{' +
        'cursor:move;' +
        'padding:4px 6px;' +
        'background:#222;' +
        'border-bottom:1px solid #444;' +
        'font-weight:bold;' +
        'user-select:none;' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:space-between;' +
        '}' +
        '#tfua-close{' +
        'background:transparent;' +
        'border:none;' +
        'color:#ccc;' +
        'cursor:pointer;' +
        'font-size:16px;' +
        'padding:0 4px;' +
        '}' +
        '#tfua-close:hover{' +
        'color:#fff;' +
        '}' +
        '#tfua-panel-body{' +
        'padding:6px;' +
        '}' +
        '#tfua-panel label{' +
        'display:block;' +
        'margin-bottom:2px;' +
        '}' +
        '#tfua-api-input{' +
        'width:100%;' +
        'box-sizing:border-box;' +
        'margin-bottom:4px;' +
        '}' +
        '#tfua-save-api{' +
        'margin-right:6px;' +
        '}' +
        '#tfua-toggle{' +
        'min-width:60px;' +
        '}' +
        '.tfua-on{' +
        'background:#285f2a!important;' +
        'color:#fff!important;' +
        '}' +
        '.tfua-off{' +
        'background:#5f2a2a!important;' +
        'color:#fff!important;' +
        '}' +
        '.tfua-small-btn{' +
        'display:inline-block;' +
        'margin-left:4px;' +
        'padding:1px 5px;' +
        'border-radius:3px;' +
        'border:1px solid #555;' +
        'background:#333;' +
        'color:#eee;' +
        'cursor:pointer;' +
        '}' +
        '.tfua-small-btn[disabled]{' +
        'opacity:0.5;' +
        'cursor:default;' +
        '}' +
        '.tfua-info-span{' +
        'margin-left:6px;' +
        'font-size:10px;' +
        'color:#ccc;' +
        '}'
    );

    function setPanelVisibility(visible) {
        panelVisible = !!visible;
        localStorage.setItem(STORAGE_KEY_PANEL_VISIBLE, panelVisible ? 'true' : 'false');
        var panel = document.getElementById('tfua-panel');
        if (panel) {
            panel.style.display = panelVisible ? 'block' : 'none';
        }
    }

    function createPanel() {
        var existing = document.getElementById('tfua-panel');
        if (existing) return existing;

        var panel = document.createElement('div');
        panel.id = 'tfua-panel';

        if (panelState) {
            if (panelState.top) panel.style.top = panelState.top;
            if (panelState.left) panel.style.left = panelState.left;
            if (panelState.width) panel.style.width = panelState.width;
            if (panelState.height) panel.style.height = panelState.height;
        }

        var header = document.createElement('div');
        header.id = 'tfua-panel-header';
        header.innerHTML = '<span>Torn Forum Activity</span><button id="tfua-close" type="button">×</button>';

        var body = document.createElement('div');
        body.id = 'tfua-panel-body';
        body.innerHTML =
            '<label for="tfua-api-input">API key:</label>' +
            '<input id="tfua-api-input" type="text" autocomplete="off" />' +
            '<div style="margin-top:4px;">' +
            '<button id="tfua-save-api" class="tfua-small-btn">Save</button>' +
            '<button id="tfua-toggle" class="tfua-small-btn">OFF</button>' +
            '</div>' +
            '<div id="tfua-status" style="margin-top:6px;font-size:10px;color:#bbb;">' +
            'Set the API key and press ON.' +
            '</div>' +
            '<hr style="margin:6px 0;border:none;border-top:1px solid #333;">' +
            '<div>' +
            '<label for="tfua-font-select">Font:</label>' +
            '<select id="tfua-font-select" style="width:100%;margin-bottom:4px;">' +
            '<option value="Tahoma, Arial, sans-serif">Tahoma</option>' +
            '<option value="Arial, Helvetica, sans-serif">Arial</option>' +
            '<option value="Verdana, Geneva, sans-serif">Verdana</option>' +
            '<option value="Courier New, monospace">Courier New</option>' +
            '</select>' +
            '<label for="tfua-font-size">Font size (px):</label>' +
            '<input id="tfua-font-size" type="number" min="8" max="24" step="1" style="width:100%;box-sizing:border-box;margin-bottom:4px;">' +
            '<label for="tfua-color-first">First activity color:</label>' +
            '<input id="tfua-color-first" type="color" style="width:100%;margin-bottom:4px;">' +
            '<label for="tfua-color-last">Last update color:</label>' +
            '<input id="tfua-color-last" type="color" style="width:100%;margin-bottom:4px;">' +
            '<label for="tfua-color-diff">Difference color:</label>' +
            '<input id="tfua-color-diff" type="color" style="width:100%;margin-bottom:2px;">' +
            '</div>';

        panel.appendChild(header);
        panel.appendChild(body);
        document.body.appendChild(panel);

        panel.style.display = panelVisible ? 'block' : 'none';

        var apiInput = document.getElementById('tfua-api-input');
        var toggleBtn = document.getElementById('tfua-toggle');
        var statusDiv = document.getElementById('tfua-status');

        var fontSelect = document.getElementById('tfua-font-select');
        var fontSizeInput = document.getElementById('tfua-font-size');
        var colorFirstInput = document.getElementById('tfua-color-first');
        var colorLastInput = document.getElementById('tfua-color-last');
        var colorDiffInput = document.getElementById('tfua-color-diff');

        apiInput.value = apiKey;
        fontSelect.value = styleSettings.fontFamily;
        fontSizeInput.value = styleSettings.fontSize;
        colorFirstInput.value = styleSettings.colorFirst;
        colorLastInput.value = styleSettings.colorLast;
        colorDiffInput.value = styleSettings.colorDiff;

        function refreshToggleUi() {
            toggleBtn.textContent = enabled ? 'ON' : 'OFF';
            if (enabled) {
                toggleBtn.classList.add('tfua-on');
                toggleBtn.classList.remove('tfua-off');
                statusDiv.textContent = 'Script is active. "Update" buttons will use the saved API key.';
            } else {
                toggleBtn.classList.add('tfua-off');
                toggleBtn.classList.remove('tfua-on');
                statusDiv.textContent = 'Script is OFF. Turn it ON to update users.';
            }
        }
        refreshToggleUi();

        document.getElementById('tfua-save-api').addEventListener('click', function () {
            apiKey = apiInput.value.trim();
            localStorage.setItem(STORAGE_KEY_APIKEY, apiKey);
            statusDiv.textContent = 'API key saved.';
        });

        toggleBtn.addEventListener('click', function () {
            enabled = !enabled;
            localStorage.setItem(STORAGE_KEY_ENABLED, enabled ? 'true' : 'false');
            refreshToggleUi();
        });

        fontSelect.addEventListener('change', function () {
            styleSettings.fontFamily = fontSelect.value;
            saveJson(STORAGE_KEY_STYLE, styleSettings);
            applyStylesToAll();
        });

        fontSizeInput.addEventListener('change', function () {
            var size = parseInt(fontSizeInput.value, 10);
            if (!size || size < 8) size = 8;
            if (size > 24) size = 24;
            styleSettings.fontSize = size;
            fontSizeInput.value = size;
            saveJson(STORAGE_KEY_STYLE, styleSettings);
            applyStylesToAll();
        });

        colorFirstInput.addEventListener('change', function () {
            styleSettings.colorFirst = colorFirstInput.value;
            saveJson(STORAGE_KEY_STYLE, styleSettings);
            applyStylesToAll();
        });

        colorLastInput.addEventListener('change', function () {
            styleSettings.colorLast = colorLastInput.value;
            saveJson(STORAGE_KEY_STYLE, styleSettings);
            applyStylesToAll();
        });

        colorDiffInput.addEventListener('change', function () {
            styleSettings.colorDiff = colorDiffInput.value;
            saveJson(STORAGE_KEY_STYLE, styleSettings);
            applyStylesToAll();
        });

        var closeBtn = document.getElementById('tfua-close');
        closeBtn.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });
        closeBtn.addEventListener('click', function () {
            setPanelVisibility(false);
        });

        makeDraggable(panel, header);
        panel.addEventListener('mouseup', savePanelState);
        panel.addEventListener('mouseleave', savePanelState);

        return panel;
    }

    function savePanelState() {
        var panel = document.getElementById('tfua-panel');
        if (!panel) return;
        panelState = {
            top: panel.style.top,
            left: panel.style.left,
            width: panel.style.width,
            height: panel.style.height
        };
        saveJson(STORAGE_KEY_PANEL, panelState);
    }

    function makeDraggable(el, handle) {
        var isDragging = false;
        var offsetX = 0;
        var offsetY = 0;

        handle.addEventListener('mousedown', function (e) {
            if (e.target && e.target.id === 'tfua-close') return;
            isDragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            e.preventDefault();
        });

        function onMove(e) {
            if (!isDragging) return;
            el.style.left = (e.clientX - offsetX) + 'px';
            el.style.top = (e.clientY - offsetY) + 'px';
        }

        function onUp() {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            savePanelState();
        }
    }

    function secondsToDHM(sec) {
        var s = Math.max(0, Math.floor(sec || 0));
        var days = Math.floor(s / 86400);
        s -= days * 86400;
        var hours = Math.floor(s / 3600);
        s -= hours * 3600;
        var minutes = Math.floor(s / 60);
        return { days: days, hours: hours, minutes: minutes };
    }

    function formatDHM(obj) {
        var parts = [];
        if (obj.days) parts.push(obj.days + 'd');
        if (obj.hours) parts.push(obj.hours + 'h');
        if (obj.minutes || (!obj.days && !obj.hours)) parts.push(obj.minutes + 'm');
        return parts.join(' ');
    }

    function buildUserInfoHtml(entry) {
        if (!entry) return '(no data)';

        var first = entry.first;
        var last = entry.last || first;
        var firstDHM = formatDHM(secondsToDHM(first.useractivity));
        var lastDHM = formatDHM(secondsToDHM(last.useractivity));
        var firstDate = first.timestamp.split('T')[0];
        var lastDate = last.timestamp.split('T')[0];

        var firstHtml =
            '<span style="color:' +
            styleSettings.colorFirst +
            '">F: ' +
            firstDHM +
            ' (' +
            firstDate +
            ')</span>';

        var lastHtml =
            '<span style="color:' +
            styleSettings.colorLast +
            '">L: ' +
            lastDHM +
            ' (' +
            lastDate +
            ')</span>';

        var diffHtml;
        if (!entry.history || entry.history.length < 2) {
            diffHtml =
                '<span style="color:' +
                styleSettings.colorDiff +
                '">Δ total: -, Δ last: -</span>';
        } else {
            var prev = entry.history[entry.history.length - 2];
            var diffLastStr = formatDHM(
                secondsToDHM(last.useractivity - prev.useractivity)
            );
            var diffTotalStr = formatDHM(
                secondsToDHM(last.useractivity - first.useractivity)
            );
            diffHtml =
                '<span style="color:' +
                styleSettings.colorDiff +
                '">Δ total: ' +
                diffTotalStr +
                ', Δ last: ' +
                diffLastStr +
                '</span>';
        }

        return 'Activity: ' + firstHtml + ' | ' + lastHtml + ' | ' + diffHtml;
    }

    function styleUpdateButton(btn) {
        var px = Number(styleSettings.fontSize) || 10;
        btn.style.fontSize = px + 'px';
        btn.style.lineHeight = (px + 4) + 'px';
        var vertical = Math.max(1, Math.round(px * 0.3));
        var horizontal = Math.max(4, Math.round(px * 0.8));
        btn.style.padding = vertical + 'px ' + horizontal + 'px';
    }

    function updateInfoSpan(userId, span) {
        var entry = userData[userId];
        span.innerHTML = buildUserInfoHtml(entry);
        span.style.fontFamily = styleSettings.fontFamily;
        span.style.fontSize = styleSettings.fontSize + 'px';
    }

    function applyStylesToAll() {
        var spans = document.querySelectorAll('.tfua-info-span');
        var i;
        for (i = 0; i < spans.length; i++) {
            var span = spans[i];
            var userId = span.getAttribute('data-user-id');
            if (userId) updateInfoSpan(userId, span);
        }
        var btns = document.querySelectorAll('.tfua-update-btn');
        for (i = 0; i < btns.length; i++) {
            styleUpdateButton(btns[i]);
        }
    }

    function fetchUserActivity(userId, span, btn) {
        if (!enabled) {
            alert('Script is OFF in the panel.');
            return;
        }
        if (!apiKey) {
            alert('No API key set in the panel.');
            return;
        }

        btn.disabled = true;
        span.textContent = 'Loading...';

        var url =
            'https://api.torn.com/user/' +
            encodeURIComponent(userId) +
            '?selections=personalstats&key=' +
            encodeURIComponent(apiKey);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (res) {
                btn.disabled = false;
                try {
                    var data = JSON.parse(res.responseText);
                    if (data.error) {
                        console.error('[TFUA] API error', data.error);
                        span.textContent = 'Error: ' + data.error.code;
                        return;
                    }
                    var ps = data.personalstats || {};
                    var val = ps.useractivity;
                    if (typeof val === 'undefined') {
                        span.textContent = 'No useractivity in response';
                        return;
                    }
                    var nowIso = new Date().toISOString();
                    var entry = userData[userId];
                    if (!entry) {
                        entry = {
                            first: { timestamp: nowIso, useractivity: val },
                            last: { timestamp: nowIso, useractivity: val },
                            history: [{ timestamp: nowIso, useractivity: val }]
                        };
                    } else {
                        if (!entry.history || !Object.prototype.toString.call(entry.history) === '[object Array]' || entry.history.length === 0) {
                            entry.history = [entry.first];
                        }
                        entry.last = { timestamp: nowIso, useractivity: val };
                        entry.history.push({ timestamp: nowIso, useractivity: val });
                    }
                    userData[userId] = entry;
                    saveJson(STORAGE_KEY_DATA, userData);
                    updateInfoSpan(userId, span);
                } catch (e) {
                    console.error('[TFUA] parse error', e, res.responseText);
                    span.textContent = 'Error parsing response';
                }
            },
            onerror: function (err) {
                btn.disabled = false;
                console.error('[TFUA] request failed', err);
                span.textContent = 'Request error';
            }
        });
    }

    function processNameLi(nameLi) {
        if (!nameLi || nameLi.getAttribute('data-tfua-processed') === '1') return;
        nameLi.setAttribute('data-tfua-processed', '1');

        var rootLi = nameLi.closest('li[data-id]');
        if (!rootLi) return;

        var userId = null;
        var postWrap = rootLi.querySelector('.post-wrap');
        if (postWrap && postWrap.getAttribute('data-author')) {
            userId = postWrap.getAttribute('data-author');
        } else {
            var posterIdEl = rootLi.querySelector('.poster-id');
            if (posterIdEl) {
                var match = posterIdEl.textContent.match(/\[(\d+)\]/);
                if (match) userId = match[1];
            }
        }
        if (!userId) return;

        var infoSpan = document.createElement('span');
        infoSpan.className = 'tfua-info-span';
        infoSpan.setAttribute('data-user-id', userId);
        updateInfoSpan(userId, infoSpan);

        var updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update';
        updateBtn.className = 'tfua-small-btn tfua-update-btn';
        styleUpdateButton(updateBtn);
        updateBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            fetchUserActivity(userId, infoSpan, updateBtn);
        });

        nameLi.appendChild(infoSpan);
        nameLi.appendChild(updateBtn);
    }

    function processAllExistingPosts() {
        var nameLis = document.querySelectorAll('li[data-id] li.name-id');
        for (var i = 0; i < nameLis.length; i++) {
            processNameLi(nameLis[i]);
        }
    }

    function observeNewPosts() {
        var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                for (var j = 0; j < m.addedNodes.length; j++) {
                    var node = m.addedNodes[j];
                    if (!(node instanceof HTMLElement)) continue;
                    if (node.matches && node.matches('li[data-id]')) {
                        var nameLi = node.querySelector('li.name-id');
                        if (nameLi) processNameLi(nameLi);
                    } else if (node.querySelectorAll) {
                        var inner = node.querySelectorAll('li[data-id] li.name-id');
                        if (inner && inner.length) {
                            for (var k = 0; k < inner.length; k++) {
                                processNameLi(inner[k]);
                            }
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        createPanel();
        processAllExistingPosts();
        observeNewPosts();
        applyStylesToAll();
    }

    function togglePanelFromMenu() {
        var panel = document.getElementById('tfua-panel') || createPanel();
        if (panel.style.display === 'none') {
            setPanelVisibility(true);
        } else {
            setPanelVisibility(false);
        }
    }

    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('Show/Hide panel', togglePanelFromMenu);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();
