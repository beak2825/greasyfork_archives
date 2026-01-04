// ==UserScript==
// @name         FV - A User Furvilla Labs Page
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.7
// @description  Adds fa-cat icon that leads to the User Furvilla Labs page. The information regarding the available scripts is controlled by a villager!
// @author       necroam
// @match        https://www.furvilla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555964/FV%20-%20A%20User%20Furvilla%20Labs%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/555964/FV%20-%20A%20User%20Furvilla%20Labs%20Page.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let labsURL;
    try {
        labsURL = new URL('/townhall', window.location.origin);
        labsURL.searchParams.set('nolabs', '1');
    } catch (e) {
        console.error('Could not construct Labs URL:', e);
        return;
    }

    const catHTML = `
        <a href="${labsURL.toString()}">
            <i class="fas fa-cat" aria-hidden="true"></i>
        </a>
    `;

    function insertCatIcon() {
        const rightLinks = document.querySelector('.float-right.links');
        if (!rightLinks || rightLinks.querySelector('.fa-cat')) return;

        const temp = document.createElement('div');
        temp.innerHTML = catHTML;
        const catLink = temp.firstElementChild;

        rightLinks.insertBefore(catLink, rightLinks.firstChild);
    }

    function replaceLeftColumnWithNews() {
        const url = new URL(window.location.href);
        if (url.pathname !== '/townhall' || url.searchParams.get('nolabs') !== '1') return;

        const leftCol = document.querySelector('.left-column');
        if (!leftCol || leftCol.querySelector('#labs-footer')) return;

        const announcements = [
            {
                title: 'User Style: Dark Mode Modern (Grey)',
                link: 'https://userstyles.world/style/25057/default-slug',
                note: 'A clean, grayscale theme for Furvilla browsing.'
            },
            {
                title: 'User Style: Dark Mode Whiskerton (Blue)',
                link: 'https://userstyles.world/style/25064/default-slug',
                note: 'Blue-accented dark mode inspired by Whiskerton’s palette.'
            },
            {
                title: 'User Style: Whiskerton Takeover (Custom)',
                link: '#',
                note: 'A full custom theme featuring Whiskerton. COMING SOON!'
            }
        ];

        const announcementHTML = announcements.map(item => `
            <li>
                <a href="${item.link}">${item.title}</a>
                <div class="footer">
                    <strong>Description:</strong> <span class="tooltipster tooltipstered">${item.note}</span>
                </div>
            </li>
        `).join('');

        leftCol.innerHTML = `
            <div class="widget recent-posts">
                <div class="widget-content profanity-filter">
                    <div class="job-description" style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div class="job-img" style="margin-right: 12px;">
                            <img src="https://www.furvilla.com/img/items/3/3223-paper-feesh.png" width="100">
                        </div>
                        <div class="job-text">
                            <p style="margin: 0;">
                              Unofficial user-made scripts for Furvilla. Try things out, and see what works. Check back now and then to see what’s new! -Robo-CATBot</p>
                        </div>
                    </div>

                    <div class="widget-header">
                        <h3>User Furvilla Labs - Styles</h3>
                    </div>
                    <div class="mayor-avatar pull-left">
                        <a href="https://www.furvilla.com/villager/95646">
                            <img src="https://f2.toyhou.se/file/f2-toyhou-se/images/110376728_pkUmSl1qoxYX9X3.png" width="200">
                        </a>
                    </div>
                    <ul class="mayor-announcements clearfix">
                        ${announcementHTML}
                    </ul>
                    <div class="text-right">
                        <small><a href="https://www.furvilla.com/forums/post/2979732" class="btn btn-link">Furvilla Dark Mode Feedback Forum <i class="fa fa-play-circle" aria-hidden="true"></i></a></small>
                    </div>
                    <div class="widget-header">
                        <h3>User Furvilla Labs - Scripts</h3>
                    </div>
                    <div id="labs-footer" style="margin-top: 10px;"></div>
                </div>
            </div>
        `;
    }

    function updateLabsFooterContent() {
        const url = new URL(window.location.href);
        if (url.pathname !== '/townhall' || url.searchParams.get('nolabs') !== '1') return;

        const footerDiv = document.getElementById('labs-footer');
        if (!footerDiv) return;

        fetch('https://www.furvilla.com/villager/95646')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const aboutSection = doc.querySelector('.villager-description .profanity-filter');
                if (aboutSection) {
                    footerDiv.innerHTML = `
                        <div class="profanity-filter" data-profanityfilter="true" style="margin: 12px 0px; padding: 12px; text-align: left;">
                            ${aboutSection.innerHTML}
                        </div>
                    `;
                } else {
                    footerDiv.innerHTML = '<p><em>Unable to load profile content.</em></p>';
                }
            })
            .catch(() => {
                footerDiv.innerHTML = '<p><em>Error fetching profile content.</em></p>';
            });
    }

    function initializeLabsPage() {
        insertCatIcon();
        replaceLeftColumnWithNews();
        updateLabsFooterContent();
    }

    function observePageChanges() {
        let lastPath = location.pathname + location.search;

        const observer = new MutationObserver(() => {
            const currentPath = location.pathname + location.search;
            if (currentPath !== lastPath) {
                lastPath = currentPath;
                initializeLabsPage();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initializeLabsPage();
    document.addEventListener('DOMContentLoaded', initializeLabsPage);
    window.addEventListener('popstate', initializeLabsPage);
    observePageChanges();
})();

