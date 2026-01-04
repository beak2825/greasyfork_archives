// ==UserScript==
// @name         Nitro Type Leaderboards (Star Track)
// @namespace    https://ntstartrack.org
// @version      9.2
// @description  Uses brute-force click for speed, Startrack's card layout for style, and adds footer/title features.
// @author       [NTPD1]Captain.Loveridge // adapted from Ginfino & Daymare
// @match        https://www.nitrotype.com/*
// @match        https://www.nitromath.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554792/Nitro%20Type%20Leaderboards%20%28Star%20Track%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554792/Nitro%20Type%20Leaderboards%20%28Star%20Track%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const IFRAME_URL = 'https://ntstartrack.org/leaderboards';
    const TAB_CLASS = 'nt-custom-tab-leaderboards';
    const TAB_ID = 'ntCustomLeaderboardLink'; // ID for our click listener

    /**
     * The "Brute Force" Method (for Clicks)
     * Instantly replaces content without waiting for 404.
     */
    function embedLeaderboards_BruteForce(event) {
        if (event) event.preventDefault(); // Hijack the click

        const main = document.querySelector('main.structure-content');
        if (!main) return; // Main content not found

        // Use Startrack's clean card structure
        main.innerHTML = `
            <section class="card card--b card--shadow card--o card--grit card--f mtxs mbm">
                <div class="well--p well--l_p pll" style="padding:0;">
                    <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
                        <h1 class="tc-i mbs tbs" style="margin:20px 0 10px;">Leaderboards</h1>
                        <div style="width:100%;height:85vh;border-radius:8px;overflow:hidden;">
                            <iframe
                                src="${IFRAME_URL}"
                                style="width:100%;height:100%;border:none;"
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Manually update state
        setActiveTab();
        setTabTitle();
        window.history.pushState({}, '', '/leaderboards');
    }

    /**
     * The "Polite" Method (for Direct Page Loads)
     * Waits for 404 error to replace content.
     */
    function embedLeaderboards_Polite() {
        const main = document.querySelector('main.structure-content');
        if (!main || main.querySelector(`iframe[src="${IFRAME_URL}"]`)) {
            return; // Not ready or already embedded
        }

        // Use Startrack's clean card structure
        main.innerHTML = `
            <section class="card card--b card--shadow card--o card--grit card--f mtxs mbm">
                <div class="well--p well--l_p pll" style="padding:0;">
                    <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
                        <h1 class="tc-i mbs tbs" style="margin:20px 0 10px;">Leaderboards</h1>
                        <div style="width:100%;height:85vh;border-radius:8px;overflow:hidden;">
                            <iframe
                                src="${IFRAME_URL}"
                                style="width:100%;height:100%;border:none;"
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>
                </div>
            </section>
        `;

        setActiveTab();
        setTabTitle();
    }

    /**
     * Inserts the tab before "News" (8.6 style)
     * and adds the brute-force click listener.
     */
    function insertLeaderboardTab() {
        if (document.getElementById(TAB_ID)) return; // Already inserted

        const navList = document.querySelector('.nav-list');
        if (!navList) return;

        const li = document.createElement('li');
        li.className = `nav-list-item ${TAB_CLASS}`;
        // Use href="#" to allow our click listener to take over
        li.innerHTML = `<a href="#" class="nav-link" id="${TAB_ID}">Leaderboards</a>`;

        const newsButton = Array.from(navList.children).find((child) =>
            child.textContent.trim().includes('News')
        );

        if (newsButton) {
            navList.insertBefore(li, newsButton);
        } else {
            navList.appendChild(li);
        }

        // Add the brute-force click listener
        document.getElementById(TAB_ID).addEventListener('click', embedLeaderboards_BruteForce);
    }

    /**
     * Adds a "Leaderboards" link to the site footer.
     */
    function addLeaderboardsToFooter() {
        if (document.querySelector('a.footer-menuLink[href="/leaderboards"]')) return;

        const footerLists = document.querySelectorAll('.footer-menuLink');
        if (footerLists.length > 0) {
            const siteMapLink = footerLists[footerLists.length - 1];
            if (siteMapLink && siteMapLink.href.includes('/support/sitemap')) {
                const leaderboardsLink = document.createElement('a');
                leaderboardsLink.className = 'list-item link link--s link--nav footer-menuLink';
                leaderboardsLink.href = '/leaderboards';
                leaderboardsLink.textContent = 'Leaderboards';
                siteMapLink.parentNode.insertBefore(leaderboardsLink, siteMapLink.nextSibling);
            }
        }
    }

    /**
     * Sets the browser tab title dynamically.
     */
    function setTabTitle() {
        if (window.location.pathname === '/leaderboards') {
            if (window.location.hostname.includes('nitrotype.com')) {
                document.title = 'Nitro Type Leaderboards';
            } else if (window.location.hostname.includes('nitromath.com')) {
                document.title = 'Nitro Math Leaderboards';
            }
        }
    }

    /**
     * Highlights the "Leaderboards" tab as the active one.
     */
    function setActiveTab() {
        document.querySelectorAll('.nav-list-item').forEach(li => li.classList.remove('is-current'));
        const tab = document.querySelector('.' + TAB_CLASS);
        if (tab) {
            tab.classList.add('is-current');
        }
    }

    /**
     * Main function to handle page loads and navigation changes.
     */
    function handlePage() {
        // Always ensure the tab and footer link are present
        insertLeaderboardTab();
        addLeaderboardsToFooter();

        // If we are on the /leaderboards page (from a direct load or link)
        // we MUST use the "polite" 404-waiter method.
        if (location.pathname === '/leaderboards') {
            // Check if it was our click that got us here. If so, it's already handled.
            if (document.querySelector(`iframe[src="${IFRAME_URL}"]`)) {
                setActiveTab(); // Just make sure the tab is active
                return;
            }

            // If not, use the "polite" 404-waiter
            const observer = new MutationObserver(() => {
                const err = document.querySelector('.error');
                const main = document.querySelector('main.structure-content');
                if (err || (main && main.children.length === 0)) {
                    embedLeaderboards_Polite();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            if (document.querySelector('.error')) {
                embedLeaderboards_Polite();
                observer.disconnect();
            }
        }
    }

    // Use a persistent MutationObserver for SPA navigation
    const obs = new MutationObserver(handlePage);
    obs.observe(document.body, { childList: true, subtree: true });

    // Run the handler once on script load
    handlePage();
})();