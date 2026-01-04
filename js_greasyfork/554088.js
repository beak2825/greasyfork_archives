// ==UserScript==
// @name         Wheelsage Dark Mode 深色模式 (Uniform Background)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Enable dark mode for Wheelsage, uniform background color and protect images & navigation bar
// @author       SupperGR
// @match        https://en.wheelsage.org/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554088/Wheelsage%20Dark%20Mode%20%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%20%28Uniform%20Background%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554088/Wheelsage%20Dark%20Mode%20%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F%20%28Uniform%20Background%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDark = GM_getValue('darkMode', false);

    function applyDarkMode() {
        if (isDark) {
            GM_addStyle(`
                /* ======================== Dark Mode Settings ======================== */

                /* Uniform page background to dark gray, maintain text brightness */
                html.dark-mode-wheelsage,
                html.dark-mode-wheelsage body {
                    background-color: #1a1a1a !important;
                    color: #ddd !important;
                }

                /* Link text color */
                html.dark-mode-wheelsage a {
                    color: #66b3ff !important;
                }

                /* Uniform card backgrounds to dark gray */
                .card,
                .alert,
                .brand-hero-unit,
                .card-body,
                .alert-info,
                .app-markdown,
                div[class*="card"],
                div[class*="alert"],
                div[class*="brand"],
                div[class*="hero"],
                div[class*="copyrights"] {
                    background-color: #2b2b2b !important;
                    color: #ffffff !important;
                    border-color: #3a3a3a !important;
                }

                /* Fix card titles and description text */
                .card-title,
                .card-text,
                .picture-behaviour,
                .user,
                .brand-hero-unit h1,
                .brand-hero-unit p {
                    color: #ddd !important;
                }

                /* Alert box style fixes */
                .alert a {
                    color: #66b3ff !important;
                    text-decoration: underline !important;
                }

                /* Fix copyright block background and text color */
                .copyrights {
                    background-color: #111 !important;
                    color: #ddd !important;
                    border: 1px solid #333 !important;
                }

                /* Fix progress bar background and segment colors */
                .progress {
                    background-color: #222 !important;
                    border: 1px solid #333 !important;
                }
                .progress-bar {
                    filter: brightness(0.7) !important;
                }
                .progress-bar.bg-danger {
                    background-color: #a33 !important;
                }
                .progress-bar.bg-warning {
                    background-color: #a66b00 !important;
                }
                .progress-bar.bg-success {
                    background-color: #2f7a2f !important;
                }

                /* Fix brand header background and text color */
                .brand-hero-unit {
                    background-color: #1a1a1a !important;
                    color: #ddd !important;
                    border: 1px solid #333 !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
                }
                .brand-hero-unit h1,
                .brand-hero-unit p {
                    color: #ddd !important;
                }
                .brand-hero-unit hr {
                    border-color: #444 !important;
                }
                .brand-hero-unit img.logo {
                    filter: none !important;
                }

                /* ======================== Other Dark Mode Settings ======================== */
                .progress-bar {
                    filter: brightness(0.7) !important;
                }

				/* Fix footer light-colored blocks and text */
				html.dark-mode-wheelsage strong,
				html.dark-mode-wheelsage strong span,
				html.dark-mode-wheelsage footer strong,
				html.dark-mode-wheelsage footer,
				html.dark-mode-wheelsage footer div {
					background-color: #1a1a1a !important;
					color: #ddd !important;
					border-color: #333 !important;
				}

				/* Adjust search box background and text color in dark mode */
				html.dark-mode-wheelsage .form-control {
					background-color: #333 !important;  /* Dark gray background */
					color: #fff !important;              /* White text */
					border: 1px solid #444 !important;   /* Dark gray border */
				}

				/* Search box focus style */
				html.dark-mode-wheelsage .form-control:focus {
					background-color: #444 !important;  /* Slightly brighter when focused */
					color: #fff !important;             /* Maintain white text */
					border-color: #666 !important;      /* Slightly brighter border when focused */
					box-shadow: 0 0 5px rgba(0, 123, 255, 0.5) !important;  /* Blue shadow when focused */
				}

				/* Hide image borders (or adjust to match background) */
				html.dark-mode-wheelsage img.rounded.border-light {
					border-color: transparent !important;  /* Transparent border */
				}

				/* If you want it to match the background color (dark gray): */
				html.dark-mode-wheelsage img.rounded.border-light {
					border-color: #2b2b2b !important;  /* Dark gray border */
				}

            `);
            document.documentElement.classList.add('dark-mode-wheelsage');
        } else {
            document.documentElement.classList.remove('dark-mode-wheelsage');
        }
    }

    // Create toggle button
    let toggleBtn = document.createElement('button');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px;
        background: #444;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;

    toggleBtn.addEventListener('click', function() {
        isDark = !isDark;
        GM_setValue('darkMode', isDark);
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        applyDarkMode();
    });

    applyDarkMode();
    document.body.appendChild(toggleBtn);
})();