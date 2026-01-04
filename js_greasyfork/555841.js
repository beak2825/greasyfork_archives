// ==UserScript==
// @name         Land Tax Dashboard UI Changer
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Fix layout and apply Bangla font on Bangladesh government land tax portal
// @author       Md. Nazmul Alam
// @license      MIT
// @match        https://portal.ldtax.gov.bd/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_addElement
// @resource     BanglaFontCSS https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@100..900&family=Tiro+Bangla:ital@0;1&display=swap
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555841/Land%20Tax%20Dashboard%20UI%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/555841/Land%20Tax%20Dashboard%20UI%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject Anek Bangla font
    const fontCSS = GM_getResourceText("BanglaFontCSS");
    GM_addStyle(fontCSS);

    // Main style injection for navbar fixes
    GM_addStyle(`
        /* Apply Bangla font to all elements */
        * {
            font-family: 'Noto Serif Bengali', 'Tiro Bangla', Arial, sans-serif !important;
            font-weight: 400;
            font-size: 16px;
        }

        /* Hide active account badge */
        p.text-12.text-center.font-semibold.text-white {
            display: none !important;
        }

        /* Decrease sidebar width */
        .bg-white.rounded-md.w-\\[17\\.25em\\].lg\\:flex.lg\\:flex-col.lg\\:justify-between {
            width: 16em !important; /* Reduced from 17.25em to 16em */
        }

        /* Add px-5 padding to all sidebar list items */
        .bg-white.rounded-md.w-\\[17\\.25em\\].lg\\:flex.lg\\:flex-col.lg\\:justify-between li.rounded-md.text-16.group {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
        }

        /* Remove lg:pl-[44px] from all sidebar links */
        .bg-white.rounded-md.w-\\[17\\.25em\\].lg\\:flex.lg\\:flex-col.lg\\:justify-between a.lg\\:pl-\\[44px\\] {
            padding-left: 0.5rem !important; /* Reset to default or use p-2 value */
        }

        /* Improve fieldset layout - flex-row with better spacing */
        .flex.flex-wrap.pb-\\[16px\\].lg\\:pb-\\[51px\\] {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 1rem !important; /* Add space between fields */
            justify-content: space-between !important;
        }

        .flex.flex-wrap.pb-\\[16px\\].lg\\:pb-\\[51px\\] fieldset {
            margin: 0 !important; /* Remove default margins */
            width: calc(25% - 0.75rem) !important; /* Adjust width for 4 items with gap */
            min-width: 200px !important; /* Minimum width for better responsiveness */
        }

        /* Navbar container fixes */
        .container.mx-auto.px-2.flex.flex-col.lg\\:flex-row.justify-between.items-center {
            padding: 0.5rem 5rem !important; /* Adjusted padding */
            max-width: 100% !important;
            display: flex !important;
            align-items: center !important; /* Center items vertically */
            height: 2rem !important;
        }

        /* Logo adjustments */
        a.w-\\[10em\\].lg\\:w-\\[12\\.3125em\\].pb-\\[12px\\].lg\\:pb-0.hidden.lg\\:block.mx-4 {
            margin-left: 0 !important;
            padding-bottom: 0 !important;
        }

        /* Home icon */
        a.mb-2 img {
            width: 24px !important; /* Set size for home icon */
            height: 24px !important;
        }

        /* Notification bell */
        .m-2 {
            margin: 0 !important;
        }

        /* SSO widget fixes */
        #mysoft-sso-box.apps-icon {
            position: absolute !important;
            right: -4rem !important;
            top: 120% !important;
            background: white !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 0.5rem !important;
            z-index: 50 !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
            max-width: 170px !important; /* Limit the overall width of the SSO widget */
        }

        #getDynamicWidgets {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
        }

        #getDynamicWidgets li {
            display: flex !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .app-logo {
            width: 36px !important;
            height: 36px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .app-logo img {
            max-width: 100% !important;
            max-height: 100% !important;
        }

        /* Add margin between list items */
        li.rounded-md.text-16.group {
            margin: 0 1rem 0.5rem 1rem !important; /* Adjust the value as needed */
        }

        /* Ensure the last item does not have extra margin */
        li.rounded-md.text-16.group:last-child {
           margin-bottom: 0 !important;
        }
        li.rounded-md.text-16.group:first-child {
           margin-top: 1rem !important;
        }
    `);

    // Function to reorganize navbar elements
    function reorganizeNavbar() {
        const navbar = document.querySelector('.container.mx-auto.px-2.flex.flex-col.lg\\:flex-row.justify-between.items-center');
        if (!navbar) return;

        // Create a new container for right-aligned items
        const rightContainer = document.createElement('div');
        rightContainer.className = 'flex items-center gap-4';

        // Move elements to the right container
        const homeIcon = document.querySelector('a.mb-2');
        const notification = document.querySelector('.m-2');
        const ssoWidget = document.querySelector('#mysoft-sso-widget');
        const profile = document.querySelector('.flex.items-center.space-x-3 > div:last-child');
        const activeAccountBadge = document.querySelector('.text-12.text-center.font-semibold.text-white');

        if (homeIcon) rightContainer.appendChild(homeIcon);
        if (notification) rightContainer.appendChild(notification);
        if (ssoWidget) rightContainer.appendChild(ssoWidget);
        if (activeAccountBadge) rightContainer.appendChild(activeAccountBadge); // Add badge here
        if (profile) rightContainer.appendChild(profile);

        // Find the existing flex container and append our right container
        const flexContainer = document.querySelector('.w-full.lg\\:w-auto.flex.justify-between.items-center.bg-white');
        if (flexContainer) {
            // Remove any existing right-aligned items
            const existingRightItems = flexContainer.querySelectorAll('a.mb-2, .m-2, #mysoft-sso-widget, .flex.items-center.space-x-3 > div:last-child, .text-12.text-center.font-semibold.text-white');
            existingRightItems.forEach(item => item.remove());

            // Append our organized right container
            flexContainer.appendChild(rightContainer);
        }

        // Replace the logo
        updateLogo();
    }

    // Function to update the logo
    function updateLogo() {
        // multiple selectors to find the logo image
        const logoSelectors = [
            'img[alt="Land Tax"]',
            'img[src*="ldtax_logo"]',
            '.w-full.h-full.lg\\:w-full.lg\\:h-\\[3\\.063em\\]',
            'a img[width="500"][height="100"]'
        ];

        let logoImg = null;
        for (const selector of logoSelectors) {
            logoImg = document.querySelector(selector);
            if (logoImg) break;
        }

        if (logoImg) {
            console.log('Updating logo...');
            logoImg.src = 'https://land.gov.bd/images/logo2.jpg';
            logoImg.srcset = '';
            logoImg.alt = 'Land Tax Logo';
        } else {
            console.log('Logo not found. Waiting for it to load...');
        }
    }

    // Wait for elements to be available
    const observer = new MutationObserver(() => {
        if (document.querySelector('.container.mx-auto.px-2.flex.flex-col.lg\\:flex-row.justify-between.items-center')) {
            observer.disconnect();
            reorganizeNavbar();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Reorganize on route changes (for SPA)
    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(this, arguments);
        setTimeout(reorganizeNavbar, 300);
    };

    const replaceState = history.replaceState;
    history.replaceState = function() {
        replaceState.apply(this, arguments);
        setTimeout(reorganizeNavbar, 300);
    };

    // Observe dynamic loading of the logo
    const logoObserver = new MutationObserver(() => {
        updateLogo();
    });

    logoObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();