// ==UserScript==
// @name         Sticky Event Dates for UCI ZotSpot
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Makes event date headers sticky as you scroll through the events page
// @author       GooglyBlox
// @match        https://zotspot.uci.edu/events*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550797/Sticky%20Event%20Dates%20for%20UCI%20ZotSpot.user.js
// @updateURL https://update.greasyfork.org/scripts/550797/Sticky%20Event%20Dates%20for%20UCI%20ZotSpot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stickyHeader = null;
    let dateHeaders = [];
    let currentActiveHeader = null;

    function createStickyHeader() {
        stickyHeader = document.createElement('div');
        stickyHeader.id = 'sticky-date-header';
        stickyHeader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #1a1a1a;
            color: #ffffff;
            padding: 12px 20px;
            font-size: 18px;
            font-weight: 600;
            z-index: 1000;
            border-bottom: 2px solid #333;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;
        stickyHeader.textContent = 'Loading...';
        document.body.appendChild(stickyHeader);
    }

    function showStickyHeader() {
        if (stickyHeader) {
            stickyHeader.style.transform = 'translateY(0)';
        }
    }

    function hideStickyHeader() {
        if (stickyHeader) {
            stickyHeader.style.transform = 'translateY(-100%)';
        }
    }

    function shouldHideBanner(text) {
        return text === '[date_text]' || text === 'date_text';
    }

    function updateStickyHeader(text) {
        if (stickyHeader) {
            if (shouldHideBanner(text)) {
                hideStickyHeader();
                return;
            }
            stickyHeader.textContent = text;
        }
    }

    function collectDateHeaders() {
        const separators = document.querySelectorAll('.list-group__separator');
        dateHeaders = Array.from(separators).map(separator => {
            const h2 = separator.querySelector('.header-cg--h4');
            return {
                element: separator,
                text: h2 ? h2.textContent.trim() : '',
                offsetTop: separator.offsetTop
            };
        }).filter(header => header.text);
    }

    function findCurrentSection(scrollTop) {
        const offset = 100;

        for (let i = dateHeaders.length - 1; i >= 0; i--) {
            if (scrollTop + offset >= dateHeaders[i].offsetTop) {
                return dateHeaders[i];
            }
        }

        return dateHeaders[0] || null;
    }

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const currentSection = findCurrentSection(scrollTop);

        if (currentSection && currentSection !== currentActiveHeader) {
            currentActiveHeader = currentSection;
            updateStickyHeader(currentSection.text);

            if (scrollTop > 50 && !shouldHideBanner(currentSection.text)) {
                showStickyHeader();
            }
        }

        if (scrollTop <= 50) {
            hideStickyHeader();
            currentActiveHeader = null;
        }
    }

    function adjustPageContent() {
        const listingCont = document.getElementById('listing-cont');
        if (listingCont) {
            listingCont.style.paddingTop = '20px';
        }
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        setTimeout(() => {
            collectDateHeaders();

            if (dateHeaders.length === 0) {
                setTimeout(init, 1000);
                return;
            }

            createStickyHeader();
            adjustPageContent();

            window.addEventListener('scroll', handleScroll, { passive: true });

            const resizeObserver = new ResizeObserver(() => {
                setTimeout(() => {
                    collectDateHeaders();
                }, 100);
            });

            resizeObserver.observe(document.body);

            handleScroll();

        }, 500);
    }

    init();
})();