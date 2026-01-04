// ==UserScript==
// @name         Seeing Red Icon
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Booty Icon, opens Sea Lions booty pic
// @author       copypasta
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549643/Seeing%20Red%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/549643/Seeing%20Red%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomIcon() {
        const statusIconsContainer = document.querySelector('ul[class^="status-icons"]'); // Wildcard selector
        if (!statusIconsContainer || document.querySelector('#custom-status-icon')) return;

        const newIcon = document.createElement('li');
        newIcon.id = 'custom-status-icon';
        newIcon.className = 'icon';
        newIcon.style.display = 'none'; // Hide until image loads

        const newLink = document.createElement('a');
        newLink.href = 'https://i.imgur.com/k0Fugxk.png';
        newLink.setAttribute('aria-label', 'Custom Icon - Click to open Sea Lions booty pic');

        const iconImg = document.createElement('img');
        // Set the icon source directly, without checking for dark mode
        iconImg.src = 'https://i.imgur.com/bWGbaUR.png';
        iconImg.alt = 'Custom Icon';
        iconImg.style.width = '17px';
        iconImg.style.height = '17px';
        
        newLink.appendChild(iconImg);
        newIcon.appendChild(newLink);
        statusIconsContainer.insertBefore(newIcon, statusIconsContainer.firstChild);

        // Show the icon only after the image has successfully loaded
        iconImg.onload = () => {
            newIcon.style.display = '';
        };
    }

    // Use a MutationObserver to wait for the icons container to be added to the DOM
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('ul[class^="status-icons"]')) {
            addCustomIcon();
            obs.disconnect(); // Stop observing once the icon is added to prevent re-running
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();