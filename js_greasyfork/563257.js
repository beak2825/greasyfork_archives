// ==UserScript==
// @name         Warline - Online Counter
// @namespace    https://github.com/mtxve/Torn-QOL-Scripts
// @version      1.0
// @author       Asemov/mtxve
// @match        *://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @description  Shows online/idle counts
// @downloadURL https://update.greasyfork.org/scripts/563257/Warline%20-%20Online%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/563257/Warline%20-%20Online%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BADGE_ID_LEFT = 'tc-online-counter-left';
    const BADGE_ID_RIGHT = 'tc-online-counter-right';

    function createBadge(id) {
        const badge = document.createElement('span');
        badge.id = id;
        badge.style.marginLeft = '8px';
        badge.style.padding = '2px 8px';
        badge.style.borderRadius = '12px';
        badge.style.background = 'rgba(0,150,0,0.12)';
        badge.style.color = '#0b8a0b';
        badge.style.fontWeight = '700';
        badge.style.fontSize = '12px';
        badge.style.verticalAlign = 'middle';
        badge.textContent = '0 online';
        badge.style.display = 'none';
        return badge;
    }
    function findTabMenuForSide(side) {
        const allTabMenus = Array.from(document.querySelectorAll('div.tab-menu-cont'));
        for (const tm of allTabMenus) {
            if (tm.className && ((' ' + tm.className + ' ').includes(' ' + side + ' '))) return tm;
        }
        const allMembersCont = Array.from(document.querySelectorAll('div.members-cont, div[class*="members-cont"]'));
        for (const mc of allMembersCont) {
            if (mc.className && ((' ' + mc.className + ' ').includes(' ' + side + ' '))) return mc.closest('div.tab-menu-cont') || mc;
        }
        return null;
    }

    function countStatusesInContainer(container) {
        if (!container) return { online: 0, idle: 0, offline: 0 };
        const selector = 'svg[fill*="svg_status_online"], svg[fill*="svg_status_idle"], svg[fill*="svg_status_offline"], svg[fill*="#svg_status_online"], svg[fill*="#svg_status_idle"], svg[fill*="#svg_status_offline"]';
        const items = Array.from(container.querySelectorAll(selector));
        let online = 0, idle = 0, offline = 0;
        items.forEach(svg => {
            try {
                if (!(svg instanceof SVGElement)) return;
                const rect = svg.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0) return;
                const f = (svg.getAttribute('fill') || '').toLowerCase();
                if (f.includes('svg_status_online') || f.includes('#svg_status_online') ) online++;
                else if (f.includes('svg_status_idle') || f.includes('#svg_status_idle')) idle++;
                else if (f.includes('svg_status_offline') || f.includes('#svg_status_offline')) offline++;
            } catch (e) {
            }
        });
        return { online, idle, offline };
    }

    function placeBadges() {
        const leftMenu = findTabMenuForSide('left');
        if (leftMenu && !document.getElementById(BADGE_ID_LEFT)) {
            const tab = leftMenu.querySelector('.member.tab___UztMc, .member');
            const span = tab ? tab.querySelector('span') : leftMenu.querySelector('span');
            const badge = createBadge(BADGE_ID_LEFT);
            if (span) span.after(badge); else if (tab) tab.appendChild(badge); else leftMenu.insertBefore(badge, leftMenu.firstChild);
        }
        const rightMenu = findTabMenuForSide('right');
        if (rightMenu && !document.getElementById(BADGE_ID_RIGHT)) {
            const tab = rightMenu.querySelector('.member.tab___UztMc, .member');
            const span = tab ? tab.querySelector('span') : rightMenu.querySelector('span');
            const badge = createBadge(BADGE_ID_RIGHT);
            if (span) span.after(badge); else if (tab) tab.appendChild(badge); else rightMenu.insertBefore(badge, rightMenu.firstChild);
        }
    }
    let last = { left: null, right: null };
    function updateBadges() {
        placeBadges();
        const leftMenu = findTabMenuForSide('left');
        const rightMenu = findTabMenuForSide('right');
        const leftCounts = countStatusesInContainer(leftMenu ? leftMenu.querySelector('ul.members-list, ul') : document);
        const rightCounts = countStatusesInContainer(rightMenu ? rightMenu.querySelector('ul.members-list, ul') : document);

        const leftBadge = document.getElementById(BADGE_ID_LEFT);
        const rightBadge = document.getElementById(BADGE_ID_RIGHT);

        if (leftBadge) {
            const text = `${leftCounts.online} online` + (leftCounts.idle ? ` / ${leftCounts.idle} idle` : '');
            if (!last.left || last.left.online !== leftCounts.online || last.left.idle !== leftCounts.idle) {
                leftBadge.textContent = text;
                leftBadge.style.display = (leftCounts.online + leftCounts.idle) === 0 ? 'none' : '';
                leftBadge.title = `${leftCounts.online} online, ${leftCounts.idle} idle, ${leftCounts.offline} offline`;
                last.left = leftCounts;
            }
        }

        if (rightBadge) {
            const text = `${rightCounts.online} online` + (rightCounts.idle ? ` / ${rightCounts.idle} idle` : '');
            if (!last.right || last.right.online !== rightCounts.online || last.right.idle !== rightCounts.idle) {
                rightBadge.textContent = text;
                rightBadge.style.display = (rightCounts.online + rightCounts.idle) === 0 ? 'none' : '';
                rightBadge.title = `${rightCounts.online} online, ${rightCounts.idle} idle, ${rightCounts.offline} offline`;
                last.right = rightCounts;
            }
        }
    }

    let tries = 0;
    const starter = setInterval(() => {
        tries++;
        placeBadges();
        updateBadges();
        if (tries > 300) clearInterval(starter); 
    }, 500);
    setInterval(() => updateBadges(), 1500);
})();