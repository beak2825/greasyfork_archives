// ==UserScript==
// @name                Greasyfork notifications dropdown
// @namespace           https://greasyfork.org/users/821661
// @version             1.0.1
// @description         add notifications dropdown to greasyfork
// @author              hdyzen
// @require             https://update.greasyfork.org/scripts/526417/1666689/USToolkit.js
// @match               https://greasyfork.org/*
// @grant               GM_addStyle
// @icon                https://www.google.com/s2/favicons?domain=greasyfork.org/&sz=64
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/550687/Greasyfork%20notifications%20dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/550687/Greasyfork%20notifications%20dropdown.meta.js
// ==/UserScript==

function initializeDropdown() {
    const userProfileLink = document.querySelector(".user-profile-link a[href*='/users/']");
    if (!userProfileLink) {
        console.error("User profile link not found. Script initialization failed.");
        return;
    }

    const notificationButton = createNotificationButton();
    const notificationDropdown = createIframeNotifications(userProfileLink.href);

    insertElements(notificationButton, notificationDropdown, userProfileLink.parentElement.parentElement);
    setupEventListeners(notificationButton);
}

function handleIframeMode() {
    document.documentElement.classList.add("notifications-dropdown");

    addIframeStyles();
    setupIframeLinkHandler();
}

function createNotificationButton() {
    const button = document.createElement("div");
    button.id = "notification-button";
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" height="18">
        <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
        <path d="M22 8c0-2.3-.8-4.3-2-6"></path>
        <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
        <path d="M4 2C2.8 3.7 2 5.7 2 8"></path>
      </svg>
    `;
    return button;
}

function createIframeNotifications(profileLink) {
    const iframe = document.createElement("iframe");
    iframe.id = "notifications-dropdown";
    iframe.src = `${profileLink}/notifications?dropdown=true`;
    document.documentElement.appendChild(iframe);
    return iframe;
}

function insertElements(button, dropdown, parentElement) {
    parentElement.appendChild(button);
    button.appendChild(dropdown);
}

function setupEventListeners(button) {
    button.addEventListener("click", () => {
        button.classList.toggle("dropdown-visible");
    });
}

function addMainStyles() {
    GM_addStyle(`
      #notification-button {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
      #notifications-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 9999;
        height: clamp(5rem, 35rem, 100vh);
        border: 1px solid var(--content-box-shadow-color);
        border-radius: 1rem;
        box-shadow: 0 0 5px var(--content-box-shadow-color);
      }
      .dropdown-visible #notifications-dropdown {
        display: block;
      }
    `);
}

function addIframeStyles() {
    GM_addStyle(`
      *:not(:has(.notification-list), .notification-list, .notification-list *) {
        display: none !important;
      }
      .notification-list {
        margin: 0;
      }
    `);
}

function setupIframeLinkHandler() {
    document.addEventListener("click", (event) => {
        const targetA = event.target.closest("a[href]");
        if (targetA) {
            event.preventDefault();
            window.open(targetA.href, "_blank");
        }
    });
}

if (unsafeWindow.location.search.includes("dropdown=true")) {
    handleIframeMode();
} else {
    addMainStyles();
    initializeDropdown();
}
