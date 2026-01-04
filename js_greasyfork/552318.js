// ==UserScript==
// @name         YouTube "Interruptions" Popup Remover
// @license      MIT
// @version      1.5
// @namespace    https://github.com/tukarsdev
// @description  Automatically removes the "Experiencing interruptions?" popup on YouTube.
// @author       tukars
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/*
// @require      https://update.greasyfork.org/scripts/552301/1676024/Observe.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552318/YouTube%20%22Interruptions%22%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/552318/YouTube%20%22Interruptions%22%20Popup%20Remover.meta.js
// ==/UserScript==

const { contextPrint, waitForElement, observeAndHandle } = window.userscript.com.tukars.Observe;

const ENABLE_DEBUG_LOGGING = true;

const { log, warn, error, info, debug } = contextPrint(
    "YT Interruptions Remover", ENABLE_DEBUG_LOGGING
);

function destroyNotification(notification) {
    if (!notification) {
        error("Notification element does not exist! Cannot delete it!");
        return;
    }
    if (!notification.parentNode) {
        warn("Notification element already removed from the DOM.");
        return;
    }
    debug("Destroying 'Interruptions' notification element.", notification);
    notification.remove();
    log("Successfully removed 'Interruptions' notification.");
}

async function handleInterruptionNotification(notification) {
    debug("Detected a potential notification element:", notification);

    const textElement = await waitForElement("#text", 2000, notification);

    if (!textElement) {
        debug("This notification does not have the expected text element. Ignoring.");
        return;
    }

    debug(`Got text element. Text is: "${textElement.textContent}"`)

    const textContent = textElement.textContent.trim();

    if (textContent.includes("Experiencing interruptions?")) {
        log("Found 'Experiencing interruptions?' notification. Removing it.");
        destroyNotification(notification);
    } else {
        debug(`Notification text did not match. Text was: "${textContent}"`);
        setTimeout(() => { debug(`Text after 300ms: "${textElement.textContent}"`) }, 300);
    }
}

(async function () {
    "use strict";
    log("Interruptions remover is active.");

    const popupContainer = await waitForElement("ytd-popup-container.style-scope.ytd-app");

    observeAndHandle(popupContainer, "tp-yt-paper-toast", handleInterruptionNotification);
})();