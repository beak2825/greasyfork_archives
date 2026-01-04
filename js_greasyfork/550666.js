// ==UserScript==
// @name                Reddit notifications dropdown
// @namespace           https://greasyfork.org/users/821661
// @version             1.0.8
// @description         add notifications dropdown to reddit
// @author              hdyzen
// @match               https://www.reddit.com/*
// @run-at              document-start
// @allFrames           true
// @grant               GM_addStyle
// @icon                https://www.google.com/s2/favicons?domain=www.reddit.com/&sz=64
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/550666/Reddit%20notifications%20dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/550666/Reddit%20notifications%20dropdown.meta.js
// ==/UserScript==

function initializeDropdown() {
    addMainStyles();

    const notificationDropdown = createIframeNotifications();

    const observer = new MutationObserver(() => {
        const notifications = document.querySelector("#notifications-inbox-button:not(:has(#notifications-dropdown))");

        if (!notifications || notifications.contains(notificationDropdown)) {
            return;
        }

        setupEventListeners(notifications);
        insertDropdown(notifications, notificationDropdown);
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener("click", (event) => {
        const notificationsTarget = event.target.closest("#notifications-inbox-button");
        if (notificationsTarget) return;

        const notifications = document.querySelector("#notifications-inbox-button");
        notifications.classList.remove("dropdown-visible");
    });
}

function handleIframeMode() {
    addIframeStyles();
    setupIframeLinkHandler();
}

function createIframeNotifications() {
    const iframe = document.createElement("iframe");
    iframe.id = "notifications-dropdown";
    iframe.src = "https://www.reddit.com/notifications?dropdown=true";
    return iframe;
}

function insertDropdown(button, dropdown) {
    button.appendChild(dropdown);
}

function setupEventListeners(button) {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        button.classList.toggle("dropdown-visible");

        const badgeCount = button.closest("faceplate-tracker")?.nextElementSibling;
        badgeCount?.remove();
    });
}

function addMainStyles() {
    GM_addStyle(`
        #notifications-inbox-button {
            overflow: visible !important;
            position: relative !important;
        }
        #notifications-dropdown {
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            transition: 150ms ease;
            margin-inline: 1rem;
            position: absolute;
            top: 100%;
            right: 0;
            z-index: 99999999;
            height: clamp(5rem, 35rem, calc(100vh - var(--shreddit-header-height, 56px)));
            border: 1px solid var(--color-inverted-neutral-content);
            border-radius: 1rem;
            box-shadow: var(--elevation-md);
        }
        .dropdown-visible #notifications-dropdown {
            opacity: 1;
            pointer-events: auto;
            visibility: visible;
        }
    `);
}

function addIframeStyles() {
    GM_addStyle(`
        *:not(:has(notifications-main-manager), notifications-main-manager, notifications-main-manager *),
        notifications-main-manager h1 {
            display: none !important;
        }
        shreddit-app {
            padding: 0 !important;
        }    
        shreddit-app[devicetype="mobile"] {
            margin-inline: 1rem;
        }
    `);
}

function setupIframeLinkHandler() {
    let interceptingNavigation;

    document.addEventListener("click", () => {
        if (interceptingNavigation) {
            return;
        }
        interceptingNavigation = true;

        unsafeWindow.navigation.addEventListener("navigate", (event) => {
            event.preventDefault();
            unsafeWindow.top.navigation.navigate(event.destination.url);
        });
    });
}

if (unsafeWindow.location.search.includes("dropdown=true")) {
    handleIframeMode();
} else {
    initializeDropdown();
}
