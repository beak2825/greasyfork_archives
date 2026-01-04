// ==UserScript==
// @name         Kick Left Chat
// @namespace    https://kick.com/
// @version      0.1.1
// @description  Move channel chatroom to the left of main content
// @match        https://kick.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550282/Kick%20Left%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/550282/Kick%20Left%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Make the parent of main + chatroom a flex row */
        main#main + #channel-chatroom,
        #channel-chatroom + main#main {
            order: initial; /* reset */
        }

        /* Target parent wrapper that contains main + chatroom */
        #page-content {
            display: flex !important;
            flex-direction: row !important;
        }

        /* Move chatroom left */
        #channel-chatroom {
            order: -1 !important;
            width: 350px !important; /* adjust width */
        }

        /* Make main fill remaining space */
        main {
            flex: 1 !important;
        }
    `);
})();
