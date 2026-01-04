// ==UserScript==
// @name         Quizlet Enhancer
// @namespace    https://greasyfork.org/en/users/1528865-blati
// @version      1.3
// @description  Download flashcards (JSON/CSV/TXT) • Remove blur on definitions • Hide upgrade buttons • Remove sign-up banners • Works with light & dark mode • Mobile optimized
// @author       Blati
// @license      MIT
// @match        https://quizlet.com/*
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234255ff'/%3E%3Cstop offset='100%25' style='stop-color:%233147e0'/%3E%3C/linearGradient%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2366d9ff'/%3E%3Cstop offset='100%25' style='stop-color:%234255ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='48' fill='url(%23g1)'/%3E%3Crect x='20' y='30' width='60' height='40' rx='4' fill='white' opacity='0.95'/%3E%3Crect x='25' y='35' width='50' height='8' rx='2' fill='url(%23g2)' opacity='0.4'/%3E%3Crect x='25' y='47' width='40' height='4' rx='1' fill='%23666' opacity='0.3'/%3E%3Crect x='25' y='54' width='35' height='4' rx='1' fill='%23666' opacity='0.3'/%3E%3Cpath d='M75 20 L78 23 L85 16' stroke='%23FFD700' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='82' cy='30' r='2' fill='%23FFD700'/%3E%3Ccircle cx='88' cy='25' r='1.5' fill='%23FFD700'/%3E%3Cpath d='M15 25 L18 28 L25 21' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='12' cy='32' r='1.8' fill='%23FFD700'/%3E%3Cpath d='M18 75 L20 78 L25 73' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='82' cy='72' r='2' fill='%23FFD700'/%3E%3C/svg%3E
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553599/Quizlet%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/553599/Quizlet%20Enhancer.meta.js
// ==/UserScript==

// MIT License
//
// Copyright (c) 2025 Blati
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function () {
    'use strict';

    // This script automatically adapts to Quizlet's theme (light/dark mode)
    // by dynamically detecting colors from the page at runtime.
    // Fully optimized for mobile and desktop devices.

    // Detect if user is on mobile device
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || window.innerWidth <= 768;
    }

    // Wait for the page to load completely
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkInterval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error('Element not found'));
                }
            }, 100);
        });
    }

    // Extract flashcards from the page
    function extractFlashcards() {
        // Use more specific selector to avoid matching ad containers
        const termCards = document.querySelectorAll('[class*="SetPageTermsList-term"]');
        const flashcards = [];

        termCards.forEach(card => {
            const sides = card.querySelectorAll('[data-testid="set-page-term-card-side"]');

            // Only add if we have both term and definition
            if (sides.length >= 2) {
                const term = sides[0].textContent.trim();
                const definition = sides[1].textContent.trim();

                // Skip if term or definition is empty
                if (term && definition) {
                    flashcards.push({ term, definition });
                }
            }
        });

        return flashcards;
    }

    // Get the set title from the page
    function getSetTitle() {
        const titleElement = document.querySelector('h1, [class*="SetPage-title"]');
        return titleElement ? titleElement.textContent.trim() : 'quizlet-flashcards';
    }

    // Download as JSON
    function downloadJSON(flashcards, filename) {
        const data = JSON.stringify(flashcards, null, 2);
        downloadFile(data, filename + '.json', 'application/json');
    }

    // Download as CSV
    function downloadCSV(flashcards, filename) {
        let csv = 'Term,Definition\n';
        flashcards.forEach(card => {
            const term = '"' + card.term.replace(/"/g, '""') + '"';
            const definition = '"' + card.definition.replace(/"/g, '""') + '"';
            csv += term + ',' + definition + '\n';
        });
        downloadFile(csv, filename + '.csv', 'text/csv');
    }

    // Download as TXT
    function downloadTXT(flashcards, filename) {
        let txt = '';
        flashcards.forEach((card, index) => {
            txt += `Card ${index + 1}:\n`;
            txt += `Term: ${card.term}\n`;
            txt += `Definition: ${card.definition}\n`;
            txt += '\n---\n\n';
        });
        downloadFile(txt, filename + '.txt', 'text/plain');
    }

    // Generic download function
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Get Quizlet's theme colors dynamically
    function getThemeColors() {
        const bodyStyles = window.getComputedStyle(document.body);
        const bgColor = bodyStyles.backgroundColor;

        // Check if dark mode is active by examining background color
        const isDarkMode = bgColor.includes('18, 18, 18') ||
            bgColor.includes('31, 31, 31') ||
            bgColor === 'rgb(0, 0, 0)' ||
            bgColor === 'rgb(18, 18, 18)' ||
            bgColor === 'rgb(31, 31, 31)';

        const colors = {
            background: bgColor,
            text: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(40, 46, 62)',
            primary: 'rgb(66, 85, 255)',
            primaryHover: 'rgb(49, 71, 224)',
            secondary: isDarkMode ? 'rgb(42, 46, 54)' : 'rgb(246, 247, 251)',
            secondaryText: isDarkMode ? 'rgb(180, 183, 192)' : 'rgb(88, 99, 128)',
            cardBg: isDarkMode ? 'rgb(31, 35, 41)' : 'rgb(255, 255, 255)',
            border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            overlay: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)'
        };

        return colors;
    }

    // Check if scroll-to-top button exists and adjust position (desktop only)
    function adjustDownloadButtonPosition(button) {
        const arrowUpButton = document.querySelector('button[aria-label="arrow up"]');

        if (arrowUpButton) {
            // Scroll-to-top button exists, move download button to the left
            button.style.right = '100px';
        } else {
            // No scroll-to-top button, use default position
            button.style.right = '24px';
        }
    }

    // Check if scroll-to-top button exists and adjust position (mobile)
    function adjustMobileButtonPosition(button) {
        const arrowUpButton = document.querySelector('button[aria-label="arrow up"]');

        if (arrowUpButton) {
            // Scroll-to-top button exists, move download button higher up
            button.style.bottom = '90px';
        } else {
            // No scroll-to-top button, use default position
            button.style.bottom = '24px';
        }
    }

    // Create download button with Quizlet styling
    function createDownloadButton() {
        const colors = getThemeColors();
        const button = document.createElement('button');
        const isMobile = isMobileDevice();

        // Create download icon SVG
        const icon = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 6px; display: inline-block; vertical-align: middle;">
                <path d="M8 1v10M4 7l4 4 4-4M2 14h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        button.innerHTML = icon + '<span>Download</span>';

        // Mobile-specific positioning: bottom-right but higher up to avoid conflicts with Quizlet's bottom UI
        if (isMobile) {
            button.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 16px;
                z-index: 10000;
                padding: 8px 14px;
                background-color: ${colors.primary};
                color: white;
                border: 2px solid transparent;
                border-radius: 200px;
                font-size: 13px;
                font-weight: 600;
                font-family: hurme_no2-webfont, -apple-system, BlinkMacSystemFont, sans-serif;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(66, 85, 255, 0.3);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                gap: 4px;
                max-width: fit-content;
            `;
        } else {
            // Desktop positioning: bottom-right (classic position)
            button.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 10000;
                padding: 10px 16px;
                background-color: ${colors.primary};
                color: white;
                border: 2px solid transparent;
                border-radius: 200px;
                font-size: 14px;
                font-weight: 600;
                font-family: hurme_no2-webfont, -apple-system, BlinkMacSystemFont, sans-serif;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(66, 85, 255, 0.3);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                gap: 4px;
            `;
        }

        button.onmouseover = () => {
            button.style.backgroundColor = colors.primaryHover;
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(66, 85, 255, 0.4)';
        };

        button.onmouseout = () => {
            button.style.backgroundColor = colors.primary;
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(66, 85, 255, 0.3)';
        };

        button.onclick = () => {
            showDownloadModal();
        };

        document.body.appendChild(button);

        // Adjust for scroll-to-top button dynamically
        if (isMobile) {
            adjustMobileButtonPosition(button);

            const observer = new MutationObserver(() => {
                adjustMobileButtonPosition(button);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            adjustDownloadButtonPosition(button);

            const observer = new MutationObserver(() => {
                adjustDownloadButtonPosition(button);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        return button;
    }

    // Create modal for format selection with Quizlet styling
    function showDownloadModal() {
        const flashcards = extractFlashcards();

        if (flashcards.length === 0) {
            alert('No flashcards found on this page. Make sure you are on a Quizlet set page.');
            return;
        }

        const title = getSetTitle();
        const colors = getThemeColors();
        const isMobile = isMobileDevice();

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${colors.overlay};
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(4px);
            animation: fadeIn 0.2s ease;
            padding: ${isMobile ? '16px' : '0'};
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: ${colors.cardBg};
            padding: ${isMobile ? '24px' : '32px'};
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            max-width: 440px;
            width: ${isMobile ? '100%' : '90%'};
            font-family: hurme_no2-webfont, -apple-system, BlinkMacSystemFont, sans-serif;
            animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-height: ${isMobile ? '90vh' : 'auto'};
            overflow-y: auto;
        `;

        // Create format buttons with SVG icons
        const formatButtons = [
            {
                id: 'json',
                label: 'JSON',
                icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="color: inherit;"><path d="M6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4V8C2 9.88562 2.59489 10.9248 3.60825 11.6421C2.59489 12.3594 2 13.3986 2 15.2V16C2 17.1046 2.89543 18 4 18C5.10457 18 6 17.1046 6 16M14 4C14 2.89543 14.8954 2 16 2C17.1046 2 18 2.89543 18 4V8C18 9.88562 17.4051 10.9248 16.3918 11.6421C17.4051 12.3594 18 13.3986 18 15.2V16C18 17.1046 17.1046 18 16 18C14.8954 18 14 17.1046 14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
                desc: 'Machine-readable format'
            },
            {
                id: 'csv',
                label: 'CSV',
                icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="color: inherit;"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="7" x2="17" y2="7" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="7" x2="10" y2="17" stroke="currentColor" stroke-width="1.5"/></svg>',
                desc: 'Spreadsheet compatible'
            },
            {
                id: 'txt',
                label: 'Text',
                icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="color: inherit;"><path d="M6 3H14C15.1046 3 16 3.89543 16 5V15C16 16.1046 15.1046 17 14 17H6C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3Z" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="7" y1="13" x2="10" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
                desc: 'Plain text format'
            }
        ];

        const buttonsHTML = formatButtons.map(btn => `
            <button id="download-${btn.id}" style="
                padding: 16px 20px;
                background-color: ${colors.secondary};
                color: ${colors.text};
                border: 2px solid ${colors.border};
                border-radius: 12px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                font-family: inherit;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                gap: 12px;
                text-align: left;
                width: 100%;
            " onmouseover="this.style.backgroundColor='${colors.primary}'; this.style.color='white'; this.style.borderColor='${colors.primary}'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(66, 85, 255, 0.2)'; this.querySelector('.label-text').style.color='white'; this.querySelector('.desc-text').style.color='rgba(255,255,255,0.8)';" onmouseout="this.style.backgroundColor='${colors.secondary}'; this.style.color='${colors.text}'; this.style.borderColor='${colors.border}'; this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.querySelector('.label-text').style.color='${colors.text}'; this.querySelector('.desc-text').style.color='${colors.secondaryText}';">
                <span style="flex-shrink: 0; display: flex; align-items: center;">${btn.icon}</span>
                <div style="flex: 1;">
                    <div class="label-text" style="font-weight: 600; color: ${colors.text}; transition: color 0.2s;">${btn.label}</div>
                    <div class="desc-text" style="font-size: 12px; color: ${colors.secondaryText}; margin-top: 2px; transition: color 0.2s;">${btn.desc}</div>
                </div>
            </button>
        `).join('');

        modalContent.innerHTML = `
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
            <h2 style="margin: 0 0 8px 0; color: ${colors.text}; font-size: ${isMobile ? '20px' : '24px'}; font-weight: 700;">Download Flashcards</h2>
            <p style="color: ${colors.secondaryText}; margin: 0 0 24px 0; font-size: ${isMobile ? '13px' : '14px'};">
                Found ${flashcards.length} flashcard${flashcards.length !== 1 ? 's' : ''} • Choose a format
            </p>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                ${buttonsHTML}
            </div>
            <button id="cancel-download" style="
                width: 100%;
                padding: 10px 16px;
                background-color: transparent;
                color: ${colors.secondaryText};
                border: 2px solid ${colors.border};
                border-radius: 200px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                font-family: inherit;
                transition: all 0.2s ease;
            " onmouseover="this.style.backgroundColor='${colors.secondary}';" onmouseout="this.style.backgroundColor='transparent';">
                Cancel
            </button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('download-json').onclick = () => {
            downloadJSON(flashcards, title);
            document.body.removeChild(modal);
        };

        document.getElementById('download-csv').onclick = () => {
            downloadCSV(flashcards, title);
            document.body.removeChild(modal);
        };

        document.getElementById('download-txt').onclick = () => {
            downloadTXT(flashcards, title);
            document.body.removeChild(modal);
        };

        document.getElementById('cancel-download').onclick = () => {
            document.body.removeChild(modal);
        };

        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    // Check if we're on a Quizlet set page
    function isQuizletSetPage() {
        return window.location.pathname.match(/^\/[a-z]{2}\/\d+\//);
    }

    // Remove upgrade/free trial buttons from header
    function removeUpgradeButtons() {
        const upgradeButtons = Array.from(document.querySelectorAll('a[data-testid="assembly-button-upgrade"]'));
        upgradeButtons.forEach(button => {
            const text = button.textContent.trim();
            if (text.includes('Free trial') || text.includes('Upgrade') || text.includes('free 7-day trial')) {
                button.remove();
                console.log('Removed upgrade button:', text);
            }
        });
    }

    // Remove blur and sign-up banner for non-logged-in users
    function removeLoginWalls() {
        // Check if user is logged in by looking for the "Log in" button
        const loginButton = Array.from(document.querySelectorAll('a, button')).find(el =>
            el.textContent.trim() === 'Log in'
        );

        // If user is not logged in, remove blur and banner
        if (loginButton) {
            // Remove blur from all definition card sides
            const blurredElements = document.querySelectorAll('[data-testid="set-page-term-card-side"]');
            blurredElements.forEach(el => {
                const styles = window.getComputedStyle(el);
                if (styles.filter && styles.filter.includes('blur')) {
                    el.style.filter = 'none';
                }
            });

            // Remove the sticky sign-up banner
            const removeBanner = () => {
                const allElements = document.querySelectorAll('div');
                for (const el of allElements) {
                    if (el.textContent.includes('Sign up to reveal definitions') &&
                        el.textContent.length < 300) {
                        const styles = window.getComputedStyle(el);
                        if (styles.position === 'sticky' || styles.position === 'fixed') {
                            el.remove();
                            console.log('Removed sign-up banner');
                            return true;
                        }
                    }
                }
                return false;
            };

            // Try to remove banner immediately and after scroll
            removeBanner();
            setTimeout(removeBanner, 1000);
            window.addEventListener('scroll', removeBanner, { once: true });

            console.log('Removed blur from definitions for non-logged-in user');
        }
    }

    // Initialize the script
    async function init() {
        if (!isQuizletSetPage()) {
            return;
        }

        try {
            // Wait for flashcards to load
            await waitForElement('[data-testid="set-page-term-card-side"]');

            // Remove upgrade/free trial buttons
            removeUpgradeButtons();

            // Remove login walls (blur and banner)
            removeLoginWalls();

            // Create download button
            createDownloadButton();

            console.log('Quizlet Enhancer v1.2 loaded successfully');
        } catch (error) {
            console.error('Error loading Quizlet Enhancer:', error);
        }
    }

    // Run the script when the page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
