// ==UserScript==
// @name         WME Beta Redirect
// @namespace    https://greasyfork.org/users/Astheron
// @version      1.0
// @description  Redirects the Waze Editor to Beta Editor.
// @author       Astheron
// @license      All Rights Reserved
// @match        https://www.waze.com/*
// @match        http://www.waze.com/*
// @match        https://beta.waze.com/*
// @match        http://beta.waze.com/*
// @connect      update.greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_openInTab
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/559329/WME%20Beta%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/559329/WME%20Beta%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = new URL(location.href);
    const path = currentUrl.pathname;
    const isBeta = currentUrl.hostname === 'beta.waze.com';
    const isEditor = path.includes('/editor');

    if (!isBeta && isEditor) {
        if (currentUrl.hostname === 'www.waze.com') {
            currentUrl.hostname = 'beta.waze.com';
            location.replace(currentUrl.toString());
        }
        return;
    }

    if (isBeta && isEditor) {
        checkScriptUpdate();
    }

    function checkScriptUpdate() {
        const updateURL = GM_info.scriptUpdateURL;
        if (!updateURL) return;

        GM_xmlhttpRequest({
            method: 'GET',
            url: updateURL + '?t=' + Date.now(),
            onload: function(response) {
                const remoteVersionMatch = response.responseText.match(/@version\s+([0-9.]+)/);
                if (!remoteVersionMatch) return;

                const remoteVersion = remoteVersionMatch[1];
                const currentVersion = GM_info.script.version;

                if (isNewerVersion(remoteVersion, currentVersion)) {
                    showUpdateNotification(remoteVersion);
                }
            }
        });
    }

    function isNewerVersion(remote, local) {
        const v1parts = remote.split('.').map(Number);
        const v2parts = local.split('.').map(Number);

        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            const val1 = v1parts[i] || 0;
            const val2 = v2parts[i] || 0;
            if (val1 > val2) return true;
            if (val1 < val2) return false;
        }
        return false;
    }

    function showUpdateNotification(ver) {
        const div = document.createElement('div');
        div.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; background:#fff; border:2px solid #33ccff; padding:15px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.3); font-family:sans-serif; font-size:14px; color:#333;';
        div.innerHTML = '<div style="font-weight:bold; margin-bottom:5px; color:#000;">WME Beta Redirect</div>' +
                        '<div>New version available: <b>' + ver + '</b></div>' +
                        '<div style="margin-top:10px; text-align:right;">' +
                        '<button id="wbr-update-btn" style="background:#33ccff; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">Update</button> ' +
                        '<button id="wbr-close-btn" style="background:#ccc; color:#333; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-left:5px;">Close</button>' +
                        '</div>';

        document.body.appendChild(div);

        document.getElementById('wbr-update-btn').onclick = function() {
            const downloadURL = GM_info.script.downloadURL + '?t=' + Date.now();
            GM_openInTab(downloadURL, { active: true });
            div.remove();
        };
        document.getElementById('wbr-close-btn').onclick = function() {
            div.remove();
        };
    }
})();