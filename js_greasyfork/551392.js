// ==UserScript==
// @name         Lihuelworks LinkedIn Messaging Pro Layout Enhancement
// @namespace    https://github.com/lihuelworks/lihuelworks_linkedin_messages_layout
// @version      2.3
// @description  Transform LinkedIn's messaging experience with intelligent DOM manipulation - removes sidebar for 40% more conversation space
// @author       LihuelWorks
// @match        https://www.linkedin.com/messaging*
// @match        https://www.linkedin.com/messaging/*
// @homepageURL  https://github.com/lihuelworks/lihuelworks_linkedin_messages_layout
// @supportURL   https://github.com/lihuelworks/lihuelworks_linkedin_messages_layout/issues
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551392/Lihuelworks%20LinkedIn%20Messaging%20Pro%20Layout%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/551392/Lihuelworks%20LinkedIn%20Messaging%20Pro%20Layout%20Enhancement.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let layoutModified = false;
    let stylesInjected = false;

    function injectCustomStyles() {
        if (stylesInjected) return;

        const style = document.createElement('style');
        style.textContent = `
            .scaffold-layout__content--list-detail-aside {
                grid-template-columns: 1fr !important;
                grid-template-areas: "main" !important;
                display: grid !important;
            }
            .scaffold-layout__row.scaffold-layout__content--list-detail-aside {
                grid-template-columns: 1fr !important;
                grid-template-areas: "main" !important;
            }
            aside.scaffold-layout__aside {
                display: none !important;
            }
            #main, .scaffold-layout__main {
                width: 100% !important;
                max-width: 100% !important;
                flex: 1 !important;
                grid-area: main !important;
            }
            .msg-overlay-container {
                width: 100% !important;
                max-width: 100% !important;
            }
        `;

        document.head.appendChild(style);
        stylesInjected = true;
    }

    function isLinkedInLoaded() {
        const loadingScreen = document.querySelector('#app-boot-bg-loader');
        const scaffoldLayout = document.querySelector('.scaffold-layout');
        const loadingGone = !loadingScreen || loadingScreen.style.display === 'none' || !loadingScreen.offsetParent;
        return loadingGone && scaffoldLayout;
    }

    function modifyLayout() {
        if (!isLinkedInLoaded()) return false;

        injectCustomStyles();

        const asideElement = document.querySelector('aside.scaffold-layout__aside');
        if (asideElement) {
            asideElement.remove();
            layoutModified = true;
            return true;
        }

        return false;
    }

    function waitForLinkedInAndModify() {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;

            if (isLinkedInLoaded()) {
                if (modifyLayout()) {
                    clearInterval(checkInterval);
                } else if (attempts > 20) {
                    clearInterval(checkInterval);
                }
            } else if (attempts >= 100) {
                clearInterval(checkInterval);
            }
        }, 500);
    }

    waitForLinkedInAndModify();

    const observer = new MutationObserver(function (mutations) {
        if (layoutModified) return;

        const shouldReapply = mutations.some(mutation =>
            mutation.type === 'childList' &&
            Array.from(mutation.addedNodes).some(node =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.matches?.('aside.scaffold-layout__aside, .scaffold-layout') ||
                    node.querySelector?.('aside.scaffold-layout__aside, .scaffold-layout'))
            )
        );

        if (shouldReapply && isLinkedInLoaded()) {
            setTimeout(() => {
                if (modifyLayout()) {
                    layoutModified = true;
                }
            }, 300);
        }
    });

    setTimeout(() => {
        observer.observe(document.body, { childList: true, subtree: true });
    }, 1000);

    setInterval(() => {
        if (!layoutModified && isLinkedInLoaded()) {
            modifyLayout();
        }
    }, 5000);
})();
