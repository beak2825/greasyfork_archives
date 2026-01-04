// ==UserScript==
// @name        1Password Extension Passkey Fix
// @namespace   rinsuki.net
// @description Treat 1Password extension's response as a instance of window.PublicKeyCredential
// @version     1.0
// @match       https://accounts.nintendo.com/*
// @grant       none
// @homepageURL https://github.com/rinsuki/userscripts
// @supportURL  https://github.com/rinsuki/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/550400/1Password%20Extension%20Passkey%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/550400/1Password%20Extension%20Passkey%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (() => {
        const origPublicKeyCredential = window.PublicKeyCredential;
        window.PublicKeyCredential = new Proxy(origPublicKeyCredential, {
            get(...args) {
                if (args[1] === Symbol.hasInstance) {
                    return (instance) => {
                        if (typeof instance !== "object")
                            return false;
                        if (instance == null)
                            return false;
                        if (!("type" in instance))
                            return false;
                        if (instance.type !== "public-key")
                            return false;
                        if (!("id" in instance))
                            return false;
                        if (typeof instance.id !== "string")
                            return false;
                        return true;
                    };
                }
                return Reflect.get(...args);
            }
        });
    })();

})();
