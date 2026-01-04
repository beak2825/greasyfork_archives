// ==UserScript==
// @name         Myuui's Falixnodes Theme
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Removes ads, upgrade banners & premium-only features. Applies a beautiful purple theme with custom logo to the FalixNodes panel.
// @match        https://client.falixnodes.net/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560818/Myuui%27s%20Falixnodes%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/560818/Myuui%27s%20Falixnodes%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CUSTOM_LOGO_URL = 'https://media.myuui.com/purple-eternal.svg';

    const injectCSS = () => {
        if (document.getElementById("falix-clean-css")) return;

        const style = document.createElement("style");
        style.id = "falix-clean-css";

        style.textContent = `
            /* ===== PURPLE THEME OVERRIDE ===== */
            :root {
                --falcon-primary: #9B6DE5 !important;
                --falcon-primary-rgb: 155, 109, 229 !important;
                --falcon-link-color: #B07CF7 !important;
                --falcon-link-hover-color: #C49DFA !important;
            }

            ::-moz-selection { background-color: #7B4FD1 !important; }
            ::selection { background-color: #7B4FD1 !important; }

            /* ===== HIDE ADS & UNWANTED ELEMENTS ===== */
            #adngin-leaderboard_1_client_panel-0,
            center:has(#adngin-leaderboard_1_client_panel-0),
            #adngin-sidebar_2-0,
            .sidebar2:has(#adngin-sidebar_2-0),
            .col-xl.sidebar2,
            .upgrade-banner,
            #upgradeServerModal,
            .faq-card,
            .row:has(.faq-card),
            .row.gx-3.mt-4:has(.faq-card),
            .step-badge,
            .faq-card-header,
            .faq-card-body,
            .faq-title,
            .faq-text,
            li.nav-item[data-nav-item="backups"],
            li.nav-item[data-nav-item="schedules"],
            .nav-section[data-nav-section="advanced"],
            .fa-crown,
            .badge.bg-warning.text-dark:has(.fa-crown) {
                display: none !important;
            }

            /* ===== RAINBOW ANIMATION ===== */
            @keyframes rainbow {
                0% { color: #ff0000; }
                14% { color: #ff7f00; }
                28% { color: #ffff00; }
                42% { color: #00ff00; }
                57% { color: #0000ff; }
                71% { color: #4b0082; }
                85% { color: #9400d3; }
                100% { color: #ff0000; }
            }

            .falix-rainbow-text {
                animation: rainbow 3s linear infinite;
                font-weight: bold;
            }

            .profile-tag.falix-rainbow-tag {
                animation: rainbow 3s linear infinite;
                font-weight: bold;
                background: transparent !important;
            }

            /* ===== PURPLE BUTTONS ===== */
            .btn-primary, .btn-outline-primary {
                background: rgba(155, 109, 229, 0.15) !important;
                color: #9B6DE5 !important;
                border-color: rgba(155, 109, 229, 0.3) !important;
            }

            .btn-primary:hover, .btn-outline-primary:hover {
                background: rgba(155, 109, 229, 0.25) !important;
                color: #B07CF7 !important;
                border-color: rgba(155, 109, 229, 0.5) !important;
            }

            /* ===== PURPLE FORM CONTROLS ===== */
            .form-control:focus, .form-select:focus {
                border-color: #9B6DE5 !important;
                box-shadow: 0 0 0 0.2rem rgba(155, 109, 229, 0.25) !important;
            }

            .form-check-input:focus {
                border-color: #9B6DE5 !important;
                box-shadow: 0 0 0 0.2rem rgba(155, 109, 229, 0.25) !important;
            }

            .form-check-input:checked {
                background-color: #9B6DE5 !important;
                border-color: #9B6DE5 !important;
            }

            /* ===== PURPLE NAVIGATION ===== */
            .dark .navbar-vertical .navbar-nav .nav-link.active {
                color: #ffffff !important;
                background-color: rgba(155, 109, 229, 0.15) !important;
            }

            .dark .navbar-vertical .navbar-nav .nav-link:hover {
                color: #B07CF7 !important;
            }

            /* ===== PURPLE PROGRESS BAR ===== */
            .progress-bar {
                background-color: #9B6DE5 !important;
            }

            /* ===== PURPLE ALERTS ===== */
            .alert-info {
                border-left-color: #9B6DE5 !important;
            }

            .alert-info:before {
                background: linear-gradient(90deg, rgba(155, 109, 229, 0.2), rgba(155, 109, 229, 0.1), rgba(155, 109, 229, 0.05)) !important;
            }

            .alert-info i {
                color: #9B6DE5 !important;
            }

            /* ===== PURPLE LINKS ===== */
            a { color: #B07CF7 !important; }
            a:hover { color: #C49DFA !important; }

            /* ===== PURPLE DROPDOWN ===== */
            .dark .dropdown-item.active {
                background-color: rgba(155, 109, 229, 0.3) !important;
            }

            /* ===== PURPLE STAT CARDS ===== */
            .blue-card {
                background: linear-gradient(145deg, rgba(155, 109, 229, 0.05) 0%, rgba(123, 79, 209, 0.1) 100%) !important;
            }

            .blue-card .stat-icon {
                background: rgba(155, 109, 229, 0.1) !important;
                color: #9B6DE5 !important;
            }

            .blue-card .stat-value {
                color: #9B6DE5 !important;
            }

            /* ===== PURPLE LOADING SPINNER ===== */
            .loading-state-icon .spinner-border,
            .loading-container .spinner-border {
                color: #9B6DE5 !important;
            }

            /* ===== PURPLE PAGINATION ===== */
            .btn-pagination {
                background: rgba(155, 109, 229, 0.1) !important;
                color: #9B6DE5 !important;
                border: 1px solid rgba(155, 109, 229, 0.2) !important;
            }

            .btn-pagination:hover:not(:disabled) {
                background: rgba(155, 109, 229, 0.2) !important;
            }

            /* ===== PURPLE TABLE HOVER ===== */
            .custom-table tbody tr:hover {
                background-color: rgba(155, 109, 229, 0.1) !important;
            }

            .custom-table thead th {
                border-bottom: 2px solid rgba(155, 109, 229, 0.2) !important;
            }

            /* ===== PURPLE PLAYER CARD ===== */
            .player-card:hover {
                border-color: rgba(155, 109, 229, 0.3) !important;
            }

            .player-status.online {
                background: rgba(155, 109, 229, 0.1) !important;
                color: #9B6DE5 !important;
            }

            /* ===== PURPLE ISLAND HEADER ===== */
            .island-main-icon {
                color: #9B6DE5 !important;
                text-shadow: 0 0 15px rgba(155, 109, 229, 0.5) !important;
            }

            /* ===== PURPLE REFRESH BUTTON ===== */
            .refresh-button:hover {
                box-shadow: 0 0.35rem 0.75rem rgba(155, 109, 229, 0.3) !important;
            }

            /* ===== PURPLE COMPACT INFO ===== */
            .compact-info-icon {
                color: #9B6DE5 !important;
            }

            /* ===== PURPLE STATUS ONLINE ===== */
            .compact-status-online {
                background-color: #9B6DE5 !important;
                box-shadow: 0 0 8px rgba(155, 109, 229, 0.6) !important;
            }

            .compact-status-online::after {
                background-color: rgba(155, 109, 229, 0.4) !important;
            }

            /* ===== PURPLE SWAL CONFIRM ===== */
            .swal2-confirm {
                background: #9B6DE5 !important;
            }

            /* ===== PURPLE MODAL ===== */
            .custom-modal-btn-primary {
                background: #9B6DE5 !important;
            }

            .custom-modal-btn-primary:hover {
                background: #7B4FD1 !important;
            }

            /* ===== PURPLE AVATAR ===== */
            .avatar {
                background-color: #9B6DE5 !important;
            }

            /* ===== PURPLE SCROLL NOTICE ===== */
            .scroll-notice {
                background: rgba(155, 109, 229, 0.1) !important;
                color: #9B6DE5 !important;
            }

            /* ===== PURPLE CUSTOM ALERT INFO ===== */
            .custom-alert.info {
                border-left-color: #9B6DE5 !important;
            }

            .custom-alert.info::before {
                background: linear-gradient(90deg, rgba(155, 109, 229, 0.2), rgba(155, 109, 229, 0.1), rgba(155, 109, 229, 0.05)) !important;
            }

            .custom-alert.info .custom-alert-icon {
                color: #9B6DE5 !important;
            }

            .custom-alert.info .custom-alert-progress {
                background: #9B6DE5 !important;
            }

            /* ===== PURPLE LANG CHECK ===== */
            .dark .lang-check {
                color: #9B6DE5 !important;
            }

            .dark .language-item.active {
                background: rgba(155, 109, 229, 0.15) !important;
            }

            /* ===== LOGO REPLACEMENT ===== */

            /* Custom logo image styling */
            img.falix-custom-logo {
                height: 24px !important;
                width: auto !important;
                display: inline-block !important;
                vertical-align: middle !important;
            }

            /* Ensure proper navbar-brand display */
            .navbar-brand {
                display: flex !important;
                align-items: center !important;
            }
        `;

        document.head.appendChild(style);
    };

    const removeElements = () => {
        // Remove ads
        document.querySelectorAll('[id*="adngin"]').forEach(el => {
            const parent = el.closest("center") || el.closest(".sidebar2");
            (parent || el).remove();
        });

        // Remove upgrade banner
        document.querySelectorAll(".upgrade-banner").forEach(el => el.remove());

        // Remove FAQ cards
        document.querySelectorAll(".faq-card").forEach(el => {
            const rowParent = el.closest(".row.gx-3.mt-4") || el.closest(".row");
            (rowParent || el).remove();
        });

        // Remove step badges
        document.querySelectorAll(".step-badge").forEach(el => {
            const rowParent = el.closest(".row");
            if (rowParent) rowParent.remove();
        });

        // Remove premium nav items
        document.querySelectorAll('li.nav-item[data-nav-item="backups"], li.nav-item[data-nav-item="schedules"], .nav-section[data-nav-section="advanced"]').forEach(el => el.remove());

        // Remove crown icons and premium badges
        document.querySelectorAll(".fa-crown").forEach(el => el.remove());
        document.querySelectorAll(".badge.bg-warning.text-dark").forEach(el => {
            if (el.textContent.includes("Premium")) el.remove();
        });

        // Remove premium-only setting cards
        document.querySelectorAll(".card-body").forEach(el => {
            const settingText = el.querySelector(".setting-card-text h6");
            if (settingText) {
                const text = settingText.textContent.trim();
                if ((text === "Startup Done Message" || text === "Custom Stop Command") &&
                    el.querySelector(".badge.bg-warning")) {
                    const cardParent = el.closest(".card");
                    if (cardParent) cardParent.remove();
                }
            }
        });
    };

    const replaceUpgradeText = () => {
        document.querySelectorAll(".mt-2.text-warning, div.text-warning").forEach(el => {
            if (el.textContent.includes("Upgrade to Premium") &&
                el.textContent.includes("startup command") &&
                !el.querySelector(".falix-rainbow-text")) {
                el.innerHTML = "";
                const rainbowSpan = document.createElement("span");
                rainbowSpan.className = "falix-rainbow-text";
                rainbowSpan.textContent = "Unfortunately, you cannot customize your startup command ＞︿＜";
                el.appendChild(rainbowSpan);
                el.classList.remove("text-warning");
            }
        });
    };

    const replaceProfileTag = () => {
        document.querySelectorAll(".profile-tag").forEach(el => {
            if (el.textContent.trim() === "Free" && !el.classList.contains("falix-rainbow-tag")) {
                el.textContent = "Myuui's Theme";
                el.classList.add("falix-rainbow-tag");
            }
        });
    };

    const replaceLogo = () => {
        // Find ALL images that are Falix logos (both in navbar-brand and elsewhere)
        const logoSelectors = [
            'img[src="/assets/falix.svg"]',
            'img[src*="falix.svg"]',
            'img[alt="Falix"]'
        ];

        logoSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(img => {
                // Skip if already replaced
                if (img.classList.contains('falix-custom-logo')) return;
                if (img.dataset.falixReplaced === 'true') return;

                // Mark as being processed
                img.dataset.falixReplaced = 'true';

                // Simply change the src to our custom logo
                img.src = CUSTOM_LOGO_URL;
                img.classList.add('falix-custom-logo');

                // Ensure it's visible with correct styling
                img.style.cssText = 'height: 24px !important; width: auto !important; display: inline-block !important;';
            });
        });
    };

    const run = () => {
        injectCSS();
        removeElements();
        replaceUpgradeText();
        replaceProfileTag();
        replaceLogo();
    };

    // Wait for body to exist
    const waitForBody = () => {
        if (document.body) {
            run();

            // Set up observer for dynamic content
            const observer = new MutationObserver(() => {
                if (window.falixCleanTimer) cancelAnimationFrame(window.falixCleanTimer);
                window.falixCleanTimer = requestAnimationFrame(run);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            requestAnimationFrame(waitForBody);
        }
    };

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForBody);
    } else {
        waitForBody();
    }

    // Additional delayed runs to catch late-loading elements
    setTimeout(run, 500);
    setTimeout(run, 1500);
    setTimeout(run, 3000);

})();