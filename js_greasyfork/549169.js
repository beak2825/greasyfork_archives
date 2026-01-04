// ==UserScript==
// @name         view cached snaps
// @version      1.0.0
// @description  fuck you snapchat privacy!
// @author       tyrox.cc
// @match        https://www.snapchat.com/web*
// @run-at       document-start
// @icon         https://www.snapchat.com/web/version/17424f89/favicon.png
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1514019
// @downloadURL https://update.greasyfork.org/scripts/549169/view%20cached%20snaps.user.js
// @updateURL https://update.greasyfork.org/scripts/549169/view%20cached%20snaps.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let snapchatWebpackRequire = null;
    let snapchatStore = null;

    const loadWebpackRequire = async () => {
        if (snapchatWebpackRequire == null) {
            return new Promise((resolve) => {
                window.webpackChunk_snapchat_web_calling_app.push([
                    ['inject'],
                    {
                        inject: (a, b, require) => {
                            snapchatWebpackRequire = require;
                            resolve();
                        },
                    },
                    (require) => require('inject'),
                ]);
            });
        }
    };

    const findSelectedModuleId = (webpackRequire) => {
        for (const chunk of window.webpackChunk_snapchat_web_calling_app) {
            if (Array.isArray(chunk)) {
                const [, modules] = chunk;
                for (const moduleKey of Object.keys(modules)) {
                    const module = modules[moduleKey];
                    const moduleDeclaration = module?.toString();
                    if (moduleDeclaration != null && moduleDeclaration.includes('broadcastTypingActivity')) {
                        return moduleKey;
                    }
                }
            }
        }
        return null;
    };

    const setMessageContentType = (prevState) => {
        for (const conversation of Object.values(prevState.messaging.conversations)) {
            const messages = conversation?.messages;
            if (messages instanceof Map) {
                for (const [key, message] of messages.entries()) {
                    if (message.messageContent && message.messageContent.contentType === 1) {
                        message.messageContent.contentType = 3;
                    }
                }
            }
        }
        return prevState;
    };

    const init = async () => {
        await loadWebpackRequire();

        if (snapchatWebpackRequire != null) {
            const selectedModuleId = findSelectedModuleId(snapchatWebpackRequire);

            if (selectedModuleId != null) {
                const module = snapchatWebpackRequire(selectedModuleId);
                snapchatStore = Object.values(module).find(
                    (value) => value.getState != null && value.setState != null
                );

                if (snapchatStore) {
                    snapchatStore.setState(setMessageContentType);
                }
            }
        }
    };

    setInterval(init, 1000);
})();