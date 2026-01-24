// ==UserScript==
// @name         Gemini - Better Scrollbar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Scripted By Gemini AI! Web's Gemini Always Show Scrollbar And More Visible, Included Light & Dark Mode. Gemini网页版滚动条优化。
// @author       Martin______X, Gemini
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563950/Gemini%20-%20Better%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/563950/Gemini%20-%20Better%20Scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* 1. Overall Dimensions */
        ::-webkit-scrollbar {
            width: 14px !important;
            height: 14px !important;
            display: block !important;
        }

        /* 2. Track Background */
        ::-webkit-scrollbar-track {
            background: rgba(128, 128, 128, 0.05) !important;
        }

        /* 3. Thumb Lock (Forces consistent color, disables interaction filters) */
        html body *::-webkit-scrollbar-thumb,
        html body *::-webkit-scrollbar-thumb:hover,
        html body *::-webkit-scrollbar-thumb:active {
            background-color: #1a73e8 !important;
            filter: none !important;
            -webkit-filter: none !important;
            border-radius: 6px !important;
            border: 2px solid transparent !important;
            background-clip: content-box !important;
            transition: none !important;
        }

        /* 4. Arrow Button General Settings */
        ::-webkit-scrollbar-button {
            display: block !important;
            background-color: transparent !important;
            background-repeat: no-repeat !important;
            background-size: 9px 9px !important; /* Side length set to 9px */
        }

        /* 5. Display Logic: Keep only the arrows at the extreme ends */
        ::-webkit-scrollbar-button:start:increment,
        ::-webkit-scrollbar-button:end:decrement {
            display: none !important;
        }

        /* === Vertical Scrollbar === */
        ::-webkit-scrollbar-button:vertical {
            width: 14px !important;
            height: 10px !important; /* Compact button height */
        }
        /* Up Arrow (Aligned to bottom, close to thumb) */
        ::-webkit-scrollbar-button:vertical:start:decrement {
            background-position: center bottom !important;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='%231a73e8'%3E%3Cpath d='M5 1.2L9.3 8.8H0.7L5 1.2Z'/%3E%3C/svg%3E") !important;
        }
        /* Down Arrow (Aligned to top, close to thumb) */
        ::-webkit-scrollbar-button:vertical:end:increment {
            background-position: center top !important;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='%231a73e8'%3E%3Cpath d='M5 8.8L0.7 1.2H9.3L5 8.8Z'/%3E%3C/svg%3E") !important;
        }

        /* === Horizontal Scrollbar === */
        ::-webkit-scrollbar-button:horizontal {
            width: 10px !important;
            height: 14px !important;
        }
        /* Left Arrow (Aligned to right) */
        ::-webkit-scrollbar-button:horizontal:start:decrement {
            background-position: right center !important;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='%231a73e8'%3E%3Cpath d='M1.2 5L8.8 0.7V9.3L1.2 5Z'/%3E%3C/svg%3E") !important;
        }
        /* Right Arrow (Aligned to left) */
        ::-webkit-scrollbar-button:horizontal:end:increment {
            background-position: left center !important;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='%231a73e8'%3E%3Cpath d='M8.8 5L1.2 9.3V0.7L8.8 5Z'/%3E%3C/svg%3E") !important;
        }

        /* 6. Dark Mode Adaptation */
        @media (prefers-color-scheme: dark) {
            html body *::-webkit-scrollbar-thumb,
            html body *::-webkit-scrollbar-thumb:hover,
            html body *::-webkit-scrollbar-thumb:active {
                background-color: #8ab4f8 !important;
            }
            ::-webkit-scrollbar-button:vertical:start:decrement {
                background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='%238ab4f8'%3E%3Cpath d='M5 1.2L9.3 8.8H0.7L5 1.2Z'/%3E%3C/svg%3E") !important;
            }
            ::-webkit-scrollbar-button:vertical:end:increment {
                background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='%238ab4f8'%3E%3Cpath d='M5 8.8L0.7 1.2H9.3L5 8.8Z'/%3E%3C/svg%3E") !important;
            }
            ::-webkit-scrollbar-button:horizontal:start:decrement {
                background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='%238ab4f8'%3E%3Cpath d='M1.2 5L8.8 0.7V9.3L1.2 5Z'/%3E%3C/svg%3E") !important;
            }
            ::-webkit-scrollbar-button:horizontal:end:increment {
                background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='%238ab4f8'%3E%3Cpath d='M8.8 5L1.2 9.3V0.7L8.8 5Z'/%3E%3C/svg%3E") !important;
            }
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
})();