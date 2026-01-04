// ==UserScript==
// @name         Rule34.xxx Mail Notifications
// @namespace    861ddd094884eac5bea7a3b12e074f34
// @version      2.0.4
// @description  Sends a desktop notification when your inbox has an unread
// @author       Kivl/mja00, Anonymous
// @match        https://rule34.xxx/index.php?*
// @icon         https://www.google.com/s2/favicons?domain=rule34.xxx
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT-0
// @downloadURL https://update.greasyfork.org/scripts/560981/Rule34xxx%20Mail%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/560981/Rule34xxx%20Mail%20Notifications.meta.js
// ==/UserScript==

// CONFIGURATION
const CHECK_INTERVAL = 30; // how often to check mail (seconds, must be >= 20)
const NOTIFICATION_TIMEOUT = 5; // auto-clear note (seconds)
const HIGHLIGHT_TAB = true; // whether to flash the tab when mail is received
const CLEAR_STATE = false; // see note in onNoteDone()
const DEBUG = false; // additional logging
// END CONFIGURATION

//
// TODO: Change the way we check for new mail. Asynchronously GET the inbox
//   page and read its DOM for entries in the table whose subject is bolded.
//   This will allow us to continue to keep a tally of unread mails, send
//   notifications for each as they come in, and deprecate the CLEAR_STATE
//   configuration item.
//

const SCRIPT_NAME = 'Rule34.xxx New Mail Notification';
const DOMAIN = 'rule34.xxx';
const URI_PREFIX = `https://${DOMAIN}`;
const CHECK_URI = `${URI_PREFIX}/index.php?page=account&s=home`;
const MAIL_URI = `${URI_PREFIX}/index.php?page=gmail&s=list`;
const ICON_URI = `${URI_PREFIX}/apple-touch-icon.png`; // higher res

let ACTIVE_NOTE = GM_getValue('activeNote', false);

function deregister(e) {
    heartbeat();
    GM_setValue('initialized', false);
}

function heartbeat() {
    if (DEBUG) console.debug(`${SCRIPT_NAME}: Heartbeat.`);
    const ts = Math.floor(Date.now() / 1000);
    GM_setValue('heartbeat', ts);
}

function handleError(e, sendNote) {
    console.error(`${SCRIPT_NAME}: ${e}`);
    if (sendNote) {
        GM_notification ({
            title:     'Userscript Manager',
            text:      `${SCRIPT_NAME}: e`,
            highlight: false,
            silent:    true,
            timeout:   NOTIFICATION_TIMEOUT
        });
    }
}

function handleAjaxError(r) {
    handleError(`AJAX Error: ${r.statusText} (${r.status})`, false);
}

// triggered by note click/timeout, or the tab which generated it being focused
function onNoteDone() {
    if (DEBUG) console.debug(`${SCRIPT_NAME}: Notification closed.`);
    // NOTE: we don't clear state by default. this results in the site
    //   continuing to show the 'new mail' banner, in case the user missed the
    //   notification. the downside to is that receiving yet more mail won't
    //   trigger another notification until the user manually checks site mail.
    if (CLEAR_STATE) {
        if (DEBUG) console.debug(`${SCRIPT_NAME}: Clearing remote state.`);
        ACTIVE_NOTE = _setValue('activeNote', false);
        GM_xmlhttpRequest({ method: "GET", url: MAIL_URI });
    }
}

// triggered by the note being clicked
function onNoteInteract() {
    console.log(`${SCRIPT_NAME}: Notification interaction.`);
    ACTIVE_NOTE = _setValue('activeNote', false);
    window.focus();
    window.location(MAIL_URI); // acts to clear remote state
}

function handleResponse(r) {
    if (r.status != 200) return false;
    var parser = new DOMParser();
    var responseDoc = parser.parseFromString(r.response, "text/html");
    const unreadMail = isMailUnread(responseDoc);
    if (unreadMail && !ACTIVE_NOTE) {
        toggleBanner(document);
        console.log(`${SCRIPT_NAME}: New mail received, sending notification!`);
        ACTIVE_NOTE = _setValue('activeNote', true);
        GM_notification({
            title:     'Rule34.xxx',
            text:      "You've received new mail!",
            image:     ICON_URI,
            highlight: HIGHLIGHT_TAB,
            silent:    true,
            timeout:   NOTIFICATION_TIMEOUT,
            onclick:   onNoteInteract,
            ondone:    onNoteDone
        });
    }
}

function checkMail() {
    refreshState();
    console.log(`${SCRIPT_NAME}: Checking for new mail.`)
    GM_xmlhttpRequest({
        method:         "GET",
        url:            CHECK_URI,
        onload:         handleResponse,
        onabort:        handleAjaxError,
        onerror:        handleAjaxError,
        ontimeout:      handleAjaxError
    });
}

function toggleBanner(doc) {
    const element = doc.getElementById("has-mail-notice");
    if (element.style.display === 'none') {
        element.style.removeProperty('display');
    } else if (!element.style.display) {
        element.style.display = 'none';
    }
}

function refreshState() {
    // another tab might have read mail
    ACTIVE_NOTE = GM_getValue('activeNote', false);
}

function manageMailBanner() {
    refreshState();
    const bannerState = isMailUnread(document);
    if ((ACTIVE_NOTE && bannerState === false)
        || (!ACTIVE_NOTE && bannerState)
    ) toggleBanner(document);
}

function isMailUnread(doc) {
    // yes, this is really how they natively do it
    const element = doc.getElementById("has-mail-notice");
    if (!element) return null; // element not found
    if ([null, ''].includes(element.style.display)) {
        return true;
    } else if (element.style.display === 'none') {
        return false;
    }
}

function _setValue(k, v) {
    GM_setValue(k, v);
    return v;
}

(function() {
    'use strict';

    let init = GM_getValue('initialized', false);

    // detect crashed tabs that would prevent script from running
    const lastHeartbeat = GM_getValue('heartbeat', null);
    const ts = Math.floor(Date.now() / 1000);
    if (lastHeartbeat !== null && (ts - lastHeartbeat) > 11) {
        console.log(`${SCRIPT_NAME}: Stale heartbeat detected; refreshing state.`);
        GM_setValue('heartbeat', null);
        init = _setValue('initialized', false);
    }

    const unreadMail = isMailUnread(document);
    if (window.location.href === MAIL_URI && !CLEAR_STATE && ACTIVE_NOTE) {
        ACTIVE_NOTE = _setValue('activeNote', false);
        if (unreadMail) toggleBanner(document); // remove first time banner
    } else {
        if (ACTIVE_NOTE && unreadMail === false) {
            ACTIVE_NOTE = _setValue('activeNote', false);
        }
    }

    // toggle banner in time with primary script source flagging
    //   new mail, or the user reading it
    if (!CLEAR_STATE) setInterval(manageMailBanner, CHECK_INTERVAL * 1000);

    if (init) {
        handleError("Skipping init. Already running elsewhere!", false);
        return false;
    } else if (CHECK_INTERVAL < 20) {
        // NOTE: we don't set initialization on failure case of check so that
        //   if the user changes the state or config manually, any future init
        //   attempt in any given tab may succeed.
        handleError('Configured check interval too low; must be >= 20!', true);
        return false;
    }

    // catch navigation events & tab closures to deinitialize
    addEventListener("beforeunload", (e) => { deregister(e); });
    addEventListener("navigate", (e) => { deregister(e); });

    checkMail();
    setInterval(heartbeat, 10 * 1000);
    setInterval(checkMail, CHECK_INTERVAL * 1000);
    console.log(`${SCRIPT_NAME}: Timer set for ${CHECK_INTERVAL}s.`);
    GM_setValue('initialized', true);
})();