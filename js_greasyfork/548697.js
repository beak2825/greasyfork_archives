// ==UserScript==
// @name         Discord server list and sidebar toggle
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  cleanup your discord by toggling sidebar elements (servers, channels & messages)
// @author       albyp
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548697/Discord%20server%20list%20and%20sidebar%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/548697/Discord%20server%20list%20and%20sidebar%20toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let serversHidden = false;
    let channelsHidden = false;
    let buttonsAdded = false;

    // utility function to create buttons for servers, channels and messages
    function createButton(ariaLabel, char, onClick) {
        const button = document.createElement('div');
        button.setAttribute('aria-label', ariaLabel);
        button.onclick = onClick;
        button.style.padding = "4px";

        const label = document.createElement('span');
        label.textContent = char;
        label.style.color = "var(--icon-secondary)";

        button.appendChild(label);

        return button;
    }

    function toggleServers() {
        const serversElem = document.querySelector('[aria-label="Servers sidebar"]');
        if (serversHidden) {
            serversElem.style.display = "";
            serversHidden = false;
        } else {
            serversElem.style.display = "none";
            serversHidden = true;
        }
    }

    function toggleChannels() {
        const sidebarElem = document.querySelector('[aria-label="Servers sidebar"]').nextElementSibling;
        if (channelsHidden) {
            sidebarElem.style.display = "";
            channelsHidden = false;
        } else {
            sidebarElem.style.display = "none";
            channelsHidden = true;
        }
    }

    const serverButton = createButton(
        "server-toggle-button",
        "S",
        toggleServers
    )

    const channelButton = createButton(
        "channel-toggle-button",
        "C",
        toggleChannels
    )

    function addButtons() {
        const title = document.querySelector('[aria-label="Open Quick Switcher"]');

        // check if title exists
        if (!title) {
            console.log("Title element not found");
            return;
        }

        // main elements
        const titleBar = document.querySelector('[aria-label="Open Quick Switcher"]').parentElement;
        const headerBar = titleBar.parentElement;
        const leadingSection = headerBar.firstChild;

        // add padding
        headerBar.style.padding = ("0 12px");

        // button container
        const container = document.createElement('div');
        container.id = 'toggle-buttons';
        container.style.display = "flex";
        container.style.gap = "var(--space-12)";

        if (leadingSection.querySelector('[aria-label="server-toggle-button"]')) {
            buttonsAdded = true;
            return;
        }

        container.appendChild(serverButton);
        container.appendChild(channelButton);
        leadingSection.appendChild(container);
        console.log("Added toggle buttons");
    }

    // wait for discord to load
    function waitAndTry() {
        if (!buttonsAdded) {
            addButtons();
        }
        setTimeout(waitAndTry, 1000);
    }

    setTimeout(waitAndTry, 3000); // start after 3 seconds
})();