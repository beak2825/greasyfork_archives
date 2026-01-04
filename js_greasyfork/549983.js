// ==UserScript==
// @name         WME UR Shortcuts
// @namespace    tbrks
// @version      0.1.1
// @description  Mark Update Requests as solved / not identified via keyboard shortcuts
// @author       tbrks
// @license      MIT
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549983/WME%20UR%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/549983/WME%20UR%20Shortcuts.meta.js
// ==/UserScript==

(function () {
    let sdk;
    let currentUR;

    window.SDK_INITIALIZED.then(initScript);

    function initScript() {
        sdk = window.getWmeSdk({ scriptId: 'waze-ur-shortcuts', scriptName: 'UR Shortcuts' });

        sdk.Shortcuts.createShortcut({
            shortcutId: 'ur-mark-solved',
            description: 'Mark UR as solved',
            shortcutKeys: '187',
            callback: () => markUpdateRequest('solved')
        });

        sdk.Shortcuts.createShortcut({
            shortcutId: 'ur-mark-not-identified',
            description: 'Mark UR as not identified',
            shortcutKeys: '189',
            callback: () => markUpdateRequest('not-identified')
        });

        sdk.Events.on({
            eventName: 'wme-update-request-panel-opened',
            eventHandler: function (e) {
                currentUR = e.updateRequestId ?? null;
            },
        });
    }

    function markUpdateRequest(status) {
        if (!currentUR) {
            return false;
        }

        sdk.DataModel.MapUpdateRequests.updateResolutionState({
            mapUpdateRequestId: currentUR,
            resolutionState: status,
        });
    }
})();
