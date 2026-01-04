// ==UserScript==
// @name         Scroll to Bottom with Vertical Menu (Multiple Links)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scroll to the bottom of the page when "☟" is clicked and show a vertical menu on hover with links and delete icons
// @author       Bibek Chand Sah
// @match        https://github.com/*
// @match        https://github.com/bebedudu/keylogger/tree/main/uploads/*
// @grant        none
// @icon         https://cdn-icons-png.flaticon.com/512/2111/2111432.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551118/Scroll%20to%20Bottom%20with%20Vertical%20Menu%20%28Multiple%20Links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551118/Scroll%20to%20Bottom%20with%20Vertical%20Menu%20%28Multiple%20Links%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to scroll to the bottom
    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Create the "☟" element and style it
    const scrollText = document.createElement('div');
    scrollText.textContent = '☟'; // Use the "☟" symbol
    scrollText.style.position = 'fixed';
    scrollText.style.bottom = '20px'; // Distance from the bottom
    scrollText.style.right = '20px'; // Distance from the right
    scrollText.style.fontSize = '35px'; // Adjust size of the symbol
    scrollText.style.cursor = 'pointer'; // Show pointer cursor on hover
    scrollText.style.color = '#ffffff'; // Corrected color to white
    scrollText.style.zIndex = '9997';
    scrollText.style.background = 'rgba(0, 0, 0, 0.3)';
    scrollText.style.backdropFilter = 'blur(10px)';
    scrollText.style.border = '1px solid rgba(107, 107, 111, 0.61)';
    scrollText.style.transition = 'all 0.3s ease'; // Smooth transition for all changes
    scrollText.style.width = '50px'; // width around the symbol
    scrollText.style.borderRadius = '50%'; // Make it round
    scrollText.style.textAlign = 'center';
    scrollText.setAttribute('title', 'Scroll to bottom'); // Add title for accessibility

    // Append the symbol to the body
    document.body.appendChild(scrollText);

    // Create the vertical menu (hidden by default)
    const menu = document.createElement('div');
    menu.style.position = 'fixed'; // Changed to fixed
    menu.style.bottom = '80px'; // Place it above the "☟" button
    menu.style.right = '20px'; // Same right position
    menu.style.width = '220px'; // Set the width of the menu
    menu.style.backgroundColor = '#333'; // Dark background for the menu
    menu.style.color = '#fff'; // White text
    menu.style.borderRadius = '5px';
    menu.style.padding = '10px';
    menu.style.display = 'none'; // Hidden by default
    menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    menu.style.zIndex = '9998';
    menu.style.transition = 'all 0.3s ease'; // Smooth transition for appearance
    menu.style.overflow = 'hidden'; // Ensure menu doesn’t spill over the edges

    // Add the links to the menu
    const links = [
        { text: 'Active Users', url: 'https://github.com/bebedudu/keylogger/blob/main/uploads/activeuserinfo.txt', deleteUrl: 'https://github.com/bebedudu/keylogger/tree/delete/main/uploads/activeuserinfo.txt' },
        { text: 'Cache', url: 'https://github.com/bebedudu/keylogger/tree/main/uploads/cache', deleteUrl: 'https://github.com/bebedudu/keylogger/tree/delete/main/uploads/cache' },
        { text: 'Config', url: 'https://github.com/bebedudu/keylogger/tree/main/uploads/config', deleteUrl: 'https://github.com/bebedudu/keylogger/tree/delete/main/uploads/config' },
        { text: 'Logs', url: 'https://github.com/bebedudu/keylogger/tree/main/uploads/logs', deleteUrl: 'https://github.com/bebedudu/keylogger/tree/delete/main/uploads/logs' },
        { text: 'Keylogerror', url: 'https://github.com/bebedudu/keylogger/tree/main/uploads/keylogerror', deleteUrl: 'https://github.com/bebedudu/keylogger/tree/delete/main/uploads/keylogerror' },
        { text: 'Screenshots', url: 'https://github.com/bebedudu/keylogger/tree/main/uploads/screenshots', deleteUrl: 'https://github.com/bebedudu/keylogger/tree/delete/main/uploads/screenshots' }
    ];

    // Create link elements and append them to the menu
    links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.textContent = link.text;
        linkElement.href = link.url;
        linkElement.target = '_blank'; // Open in a new tab
        linkElement.style.display = 'flex'; // Use flexbox to align the content
        linkElement.style.alignItems = 'center'; // Center vertically
        linkElement.style.padding = '5px';
        linkElement.style.textDecoration = 'none';
        linkElement.style.color = '#fff';
        linkElement.style.borderBottom = '1px solid #444';
        linkElement.style.transition = 'all 0.3s ease';

        // Add trash icon (🗑️) and link it to the delete URL
        const trashIcon = document.createElement('span');
        trashIcon.textContent = ' 🗑️';
        trashIcon.style.cursor = 'pointer';
        trashIcon.style.marginLeft = 'auto'; // Push the trash icon to the right
        trashIcon.style.transition = 'transform 0.3s ease'; // Transition for scaling effect

        // On hover, scale the trash icon to 1.1x
        trashIcon.addEventListener('mouseenter', function() {
            trashIcon.style.transform = 'scale(1.1)'; // Scale to 1.1
            trashIcon.style.background = 'rgba(0, 0, 0, 0.3)';
            trashIcon.style.backdropFilter = 'blur(10px)';
            trashIcon.style.border = '1px solid rgba(107, 107, 111, 0.61)';
            trashIcon.style.borderRadius = '50%';
            trashIcon.style.padding = '3px';
        });
        trashIcon.addEventListener('mouseleave', function() {
            trashIcon.style.transform = 'scale(1)'; // Reset scale to normal
        });

        // Add click event to open delete URL
        trashIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the link from being followed
            window.open(link.deleteUrl, '_blank'); // Open delete URL in a new tab
        });

        // Append the trash icon to the link
        linkElement.appendChild(trashIcon);

        // Append the link element to the menu
        menu.appendChild(linkElement);
    });

    // Append the menu to the body
    document.body.appendChild(menu);

    // Add click event to scroll to the bottom
    scrollText.addEventListener('click', function() {
        scrollToBottom();

        // Ensure the menu is shown after click
        menu.style.display = 'block';
    });

    // Show the menu when hovered over the "☟" symbol
    scrollText.addEventListener('mouseenter', function() {
        menu.style.display = 'block'; // Show the menu
    });

    // Hide the menu only if neither the "☟" nor the menu is being hovered
    scrollText.addEventListener('mouseleave', function() {
        setTimeout(function() {
            // Check if mouse is outside both elements before hiding
            if (!menu.matches(':hover')) {
                menu.style.display = 'none'; // Hide the menu
            }
        }, 100); // Small delay to allow for mouse movement to the menu
    });

    // Prevent hiding the menu when hovering over the menu
    menu.addEventListener('mouseenter', function() {
        menu.style.display = 'block'; // Ensure menu stays visible
    });

    // Hide the menu when mouse leaves both the "☟" and the menu
    menu.addEventListener('mouseleave', function() {
        menu.style.display = 'none'; // Hide the menu when leaving
    });
})();
