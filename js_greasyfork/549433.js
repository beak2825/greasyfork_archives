// ==UserScript==
// @name        Splitwise Unlimited
// @namespace   j6u6947
// @version     0.1.0
// @description Bypass Splitwise daily expense limit
// @grant       unsafeWindow
// @author      j6u6947
// @match       *://secure.splitwise.com/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549433/Splitwise%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/549433/Splitwise%20Unlimited.meta.js
// ==/UserScript==
//
// jshint esversion: 11

function waitFor(path, callback, options = {}) {
    const { timeout = 10000, interval = 100 } = options;
    const startTime = Date.now();

    function check() {
        const obj = path.split('.').reduce((o, prop) => o?.[prop], unsafeWindow);

        if (obj !== undefined) {
            callback(obj);
            return;
        }

        if (Date.now() - startTime < timeout) {
            setTimeout(check, interval);
        }
    }

    check();
}

waitFor('App.metadata.features', (features) => {
    unsafeWindow.App.metadata.features = new Proxy(features, {
        get: (t, p, r) => !t[p] ? t[p] : Object.assign(t[p], { enabled: true }),
    });
});
