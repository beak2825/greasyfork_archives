// ==UserScript==
// @name         MooMoo.io Private Server Connector
// @namespace    https://moomoo.io/
// @version      1.0
// @description  Redirects MooMoo.io to a private server
// @author       al007ex
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @match        *://*.moomoo.io/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554786/MooMooio%20Private%20Server%20Connector.user.js
// @updateURL https://update.greasyfork.org/scripts/554786/MooMooio%20Private%20Server%20Connector.meta.js
// ==/UserScript==

// source code: https://github.com/al007ex/moomoo-clone

(() => {
    'use strict';

    window.WebSocket = new Proxy(window.WebSocket, {
        construct(Target, args) {
            args[0] = 'wss://moomoo.al007ex.com/?gameIndex=0';
            console.log('[MooMoo.io Private Server] Redirecting to:', args[0]);
            return new Target(...args);
        }
    });
})();
