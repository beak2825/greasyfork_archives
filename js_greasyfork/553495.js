// ==UserScript==
// @name         Netflix Settings Hijack
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Hijack Netflix's settings to allow customization of certain values.
// @author       TGSAN
// @match        https://www.netflix.com/settings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553495/Netflix%20Settings%20Hijack.user.js
// @updateURL https://update.greasyfork.org/scripts/553495/Netflix%20Settings%20Hijack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[Netflix Settings Hijack] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[Netflix Settings Hijack] use window mode (your userscript extensions not support unsafeWindow)");
    }

    const originFetchNetflixSettingsHijack = windowCtx.fetch;
    windowCtx.fetch = (...arg) => {
        let url = "";
        let isRequest = false;
        switch (typeof arg[0]) {
            case "object":
                url = arg[0].url;
                isRequest = true;
                break;
            case "string":
                url = arg[0];
                break;
            default:
                break;
        }

        if (url.indexOf('//web.prod.cloud.netflix.com/graphql') > -1) {
            if (typeof arg[1] == "object") {
                let options = arg[1];
                if (typeof options.body == "string" && options.body.startsWith("{") && options.body.endsWith("}")) {
                    let body = JSON.parse(options.body);
                    if (body.operationName == "LanguageSettingsTemplateSaveLanguages") {
                        body.variables.primaryLanguage = prompt("Netflix Settings Hijack\n\nPrimaryLanguage", body.variables.primaryLanguage);
                    } else if (body.operationName == "updateProfileInfo") {
                        body.variables.avatarKey = prompt("Netflix Settings Hijack\n\nAvatarKey", body.variables.avatarKey);
                    }
                    options.body = JSON.stringify(body);
                }
                arg[1] = options;
            }
        }

        return originFetchNetflixSettingsHijack(...arg);
    }
})();