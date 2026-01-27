// ==UserScript==
// @name         Remove thumdnail on top right corner
// @description  Removing the thumbnail from MyNelson book viewer.
// @version      1.0

// @author       5Gswatergod
// @match        https://www.mynelson.com/*
// @run-at       document-start
// @license      N/A

// @namespace    https://www.mynelson.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mynelson.com

// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setClipboard
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_download
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/564263/Remove%20thumdnail%20on%20top%20right%20corner.user.js
// @updateURL https://update.greasyfork.org/scripts/564263/Remove%20thumdnail%20on%20top%20right%20corner.meta.js
// ==/UserScript==

/*
    Author: 5Gswatergod
    Github: https://github.com/5Gswatergod
*/

(function () {
    'use strict';


    const SELECTOR = '.thumbnail_map';


    function kill() {
        document.querySelectorAll(SELECTOR).forEach(el => el.remove());
    }


    // Run immediately
    kill();


    // 1) Detect when zoom injects new nodes
    const addObserver = new MutationObserver(kill);
    addObserver.observe(document.documentElement, { childList: true, subtree: true });


    // 2) Detect when zoom just changes style (display:none -> block)
    const styleObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes') {
                const el = m.target;
                if (el instanceof HTMLElement && el.matches?.(SELECTOR)) {
                    el.remove();
                } else {
                    // In case style changes happen on ancestors, do a quick sweep
                    kill();
                }
            }
        }
    });


    styleObserver.observe(document.documentElement, {
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
})();