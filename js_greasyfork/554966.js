// ==UserScript==
// @name         xHamster Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  Adds HD and Newest quick filter buttons on pornstar/creator profiles + auto-shows description and date under the video.
// @author       nereids
// @match        https://xhamster.com/pornstars/*
// @match        https://xhamster.com/creators/*
// @match        https://xhamster.com/videos/*
// @icon         https://icons.duckduckgo.com/ip3/xhamster.com.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554966/xHamster%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/554966/xHamster%20Tweaks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === SVG ICONS ===
    const HD_SVG_DEFAULT = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M300-440h80v50q0 13 8.5 21.5T410-360q13 0 21.5-8.5T440-390v-180q0-13-8.5-21.5T410-600q-13 0-21.5 8.5T380-570v70h-80v-70q0-13-8.5-21.5T270-600q-13 0-21.5 8.5T240-570v180q0 13 8.5 21.5T270-360q13 0 21.5-8.5T300-390v-50Zm240 80h140q17 0 28.5-11.5T720-400v-160q0-17-11.5-28.5T680-600H540q-8 0-14 6t-6 14v200q0 8 6 14t14 6Zm40-60v-120h80v120h-80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>`;
    const HD_SVG_SELECTED = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M300-446.15h92.31V-390q0 10.31 6.77 17.08 6.77 6.77 17.07 6.77 10.31 0 17.08-6.77Q440-379.69 440-390v-180q0-10.31-6.77-17.08-6.77-6.77-17.08-6.77-10.3 0-17.07 6.77T392.31-570v76.15H300V-570q0-10.31-6.77-17.08-6.77-6.77-17.08-6.77-10.3 0-17.07 6.77T252.31-570v180q0 10.31 6.77 17.08 6.77 6.77 17.07 6.77 10.31 0 17.08-6.77Q300-379.69 300-390v-56.15Zm238.08 80h128.07q17.39 0 29.46-12.08 12.08-12.08 12.08-29.46v-144.62q0-17.38-12.08-29.46-12.07-12.08-29.46-12.08H538.08q-7.23 0-12.66 5.43Q520-583 520-575.77v191.54q0 7.23 5.42 12.65 5.43 5.43 12.66 5.43Zm29.61-47.7v-132.3h86.16q2.3 0 4.23 1.92Q660-542.31 660-540v120q0 2.31-1.92 4.23-1.93 1.92-4.23 1.92h-86.16ZM172.31-180Q142-180 121-201q-21-21-21-51.31v-455.38Q100-738 121-759q21-21 51.31-21h615.38Q818-780 839-759q21 21 21 51.31v455.38Q860-222 839-201q-21 21-51.31 21H172.31Z"/></svg>`;
    const NEW_SVG_DEFAULT = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160q-33 0-56.5-23.5T40-240v-480q0-33 23.5-56.5T120-800h720q33 0 56.5 23.5T920-720v480q0 33-23.5 56.5T840-160H120Zm0-80h720v-480H120v480Zm70-260 95 130q3 5 8 7.5t11 2.5h12q10 0 17-7t7-17v-191q0-11-7-18t-18-7q-11 0-18 7t-7 18v115l-93-130q-4-5-9-7.5t-11-2.5h-12q-11 0-18 7t-7 18v190q0 11 7 18t18 7q11 0 18-7t7-18v-115Zm210 140h115q11 0 18-7t7-18q0-11-7-18t-18-7h-75v-44h75q11 0 18-7t7-18q0-11-7-18t-18-7h-75v-46h75q11 0 18-7t7-18q0-11-7-18t-18-7H400q-8 0-14 6t-6 14v200q0 8 6 14t14 6Zm220 0h160q17 0 28.5-11.5T820-400v-175q0-11-7-18t-18-7q-11 0-18 7t-7 18v155h-44v-115q0-11-7-18t-18-7q-11 0-18 7t-7 18v115h-46v-155q0-11-7-18t-18-7q-11 0-18 7t-7 18v175q0 17 11.5 28.5T620-360ZM120-240v-480 480Z"/></svg>`;
    const NEW_SVG_SELECTED = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M132.31-180Q102-180 81-201q-21-21-21-51.31v-455.38Q60-738 81-759q21-21 51.31-21h695.38Q858-780 879-759q21 21 21 51.31v455.38Q900-222 879-201q-21 21-51.31 21H132.31Zm56.92-336.16L288.46-375q2.62 4.23 6.86 6.54 4.24 2.31 9.33 2.31h10.18q8.48 0 14.52-5.99 6.03-5.99 6.03-14.55v-186.39q0-9.14-5.8-14.95-5.8-5.82-14.92-5.82-9.12 0-14.97 5.82-5.84 5.81-5.84 14.95v129.24L197-585q-3.23-4.61-7.75-6.73t-9.94-2.12h-10.26q-9.39 0-15.38 6.03-5.98 6.04-5.98 15.51v185.39q0 9.14 5.81 14.95 5.8 5.82 14.92 5.82 9.12 0 14.96-5.82 5.85-5.81 5.85-14.95v-129.24Zm215 150.01h108.85q9.14 0 14.95-5.81 5.82-5.8 5.82-14.92 0-9.12-5.82-14.97-5.81-5.84-14.95-5.84h-79.23v-50.16h79.23q9.14 0 14.95-5.8 5.82-5.8 5.82-14.92 0-9.12-5.82-14.97-5.81-5.84-14.95-5.84h-79.23v-52.93h79.23q9.14 0 14.95-5.8 5.82-5.8 5.82-14.92 0-9.12-5.82-14.97-5.81-5.85-14.95-5.85H404.23q-7.23 0-12.65 5.43-5.43 5.42-5.43 12.65v191.54q0 7.23 5.43 12.65 5.42 5.43 12.65 5.43Zm214.23 0h160q14.69 0 24.27-9.58t9.58-24.27v-173.08q0-9.14-5.81-14.95-5.8-5.82-14.92-5.82-9.12 0-14.96 5.82-5.85 5.81-5.85 14.95v159.23h-50.92v-119.23q0-9.14-5.81-14.95-5.8-5.82-14.92-5.82-9.12 0-14.97 5.82-5.84 5.81-5.84 14.95v119.23h-52.16v-159.23q0-9.14-5.8-14.95-5.8-5.82-14.92-5.82-9.12 0-14.97 5.82-5.84 5.81-5.84 14.95V-400q0 14.69 9.57 24.27 9.58 9.58 24.27 9.58Z"/></svg>`;

    // === PORNSTARS + CREATORS: QUICK FILTERS ===
    if (/^\/(pornstars|creators)\//.test(location.pathname)) {
        function updateButtons() {
            const hdBtn = document.getElementById('quick-hd-btn');
            const newBtn = document.getElementById('quick-new-btn');
            if (!hdBtn || !newBtn) return;

            const currentPath = window.location.pathname;
            const isHD = /\/hd(\/|$)/.test(currentPath);
            const isNewest = /\/newest(\/|$)/.test(currentPath);

            hdBtn.querySelector('span').innerHTML = isHD ? HD_SVG_SELECTED : HD_SVG_DEFAULT;
            hdBtn.style.backgroundColor = isHD ? 'var(--color-cobalt-light, #eaeaea)' : 'var(--color-cobalt-lighter, #f5f5f5)';
            toggleHover(hdBtn, !isHD);

            newBtn.querySelector('span').innerHTML = isNewest ? NEW_SVG_SELECTED : NEW_SVG_DEFAULT;
            newBtn.style.backgroundColor = isNewest ? 'var(--color-cobalt-light, #eaeaea)' : 'var(--color-cobalt-lighter, #f5f5f5)';
            toggleHover(newBtn, !isNewest);
        }

        function toggleHover(btn, enable) {
            if (enable && !btn.dataset.hover) {
                btn.addEventListener('mouseenter', () => btn.style.backgroundColor = 'var(--color-cobalt-light, #eaeaea)');
                btn.addEventListener('mouseleave', () => btn.style.backgroundColor = 'var(--color-cobalt-lighter, #f5f5f5)');
                btn.dataset.hover = 'true';
            } else if (!enable && btn.dataset.hover) {
                btn.onmouseenter = btn.onmouseleave = null;
                delete btn.dataset.hover;
            }
        }

        const observer = new MutationObserver((mutations, obs) => {
            const filterTrigger = document.querySelector('.item-50dd2.categories-container__item.linking-vertical-item.quick-filter.filter-trigger');
            if (filterTrigger && !document.getElementById('quick-hd-btn')) {
                obs.disconnect();
                addQuickButtons(filterTrigger);
                updateButtons();
                startPaginationObserver();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        function addQuickButtons(filterTrigger) {
            const container = filterTrigger.parentElement;
            if (!container) return;
            const currentPath = window.location.pathname;
            const basePath = currentPath.replace(/\/(hd|newest)?(\/\d+)?$/, '');
            const isHD = /\/hd(\/|$)/.test(currentPath);
            const isNewest = /\/newest(\/|$)/.test(currentPath);
            const hdBtn = createButton('HD', isHD ? HD_SVG_SELECTED : HD_SVG_DEFAULT, basePath + '/hd', isHD);
            hdBtn.id = 'quick-hd-btn';
            const newBtn = createButton('New', isNewest ? NEW_SVG_SELECTED : NEW_SVG_DEFAULT, basePath + '/newest', isNewest);
            newBtn.id = 'quick-new-btn';
            container.insertBefore(hdBtn, filterTrigger.nextSibling);
            container.insertBefore(newBtn, hdBtn.nextSibling);
        }

        function createButton(text, iconSvg, url, isActive) {
            const btn = document.createElement('div');
            btn.className = 'item-50dd2 categories-container__item linking-vertical-item quick-filter';
            btn.style.cssText = `
                background-color: ${isActive ? 'var(--color-cobalt-light, #eaeaea)' : 'var(--color-cobalt-lighter, #f5f5f5)'};
                border: 1px solid var(--color-cobalt-light, #dadada);
                border-radius: var(--xh-border-radius-s);
                padding: var(--xh-spacers-s) var(--xh-spacers-m);
                height: 30px;
                line-height: var(--xh-h4-bold-line-height-px);
                margin: 0 var(--xh-spacers-s) var(--xh-spacers-s) 0;
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
            `;
            const iconWrapper = document.createElement('span');
            iconWrapper.style.display = 'flex';
            iconWrapper.innerHTML = iconSvg;
            const textNode = document.createElement('span');
            textNode.textContent = text;
            textNode.style.color = '#FFF';
            textNode.style.fontSize = '13px';
            btn.appendChild(iconWrapper);
            btn.appendChild(textNode);
            if (!isActive) toggleHover(btn, true);
            btn.addEventListener('click', e => { e.preventDefault(); location.href = url; });
            return btn;
        }

        function startPaginationObserver() {
            const paginationObserver = new MutationObserver(updateButtons);
            const paginator = document.querySelector('.xh-paginator');
            if (paginator) paginationObserver.observe(paginator, { childList: true, subtree: true });
            let lastUrl = location.href;
            setInterval(() => {
                if (lastUrl !== location.href) { lastUrl = location.href; updateButtons(); }
            }, 500);
            window.addEventListener('popstate', updateButtons);
        }
    }

    // === VIDEO PAGE: AUTO ABOUT INFO BELOW CONTROLS WITH AUTO-WIDTH ===
    if (location.pathname.includes('/videos/')) {
        const observer = new MutationObserver((mutations, obs) => {
            const controls = document.querySelector('.controls');
            const aboutBox = document.querySelector('.ab-info.controls-info__item');
            if (controls && aboutBox && !document.getElementById('auto-about-info')) {
                obs.disconnect();
                showAboutInfo(controls, aboutBox);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        function showAboutInfo(controls, aboutBox) {
            const descriptionP = aboutBox.querySelector('p');
            const dateDiv = aboutBox.querySelector('.entity-info-container__date');
            const authorLink = aboutBox.querySelector('.entity-author-container__name');

            if (!descriptionP && !dateDiv) return;

            const container = document.createElement('div');
            container.id = 'auto-about-info';
            container.style.cssText = `
                margin: 12px 0 12px 0;
                padding: 12px;
                background: var(--color-cobalt-light, #eaeaea);
                border-radius: var(--xh-border-radius-m, 8px);
                font-size: 14px;
                line-height: 1.5;
                color: var(--xh-color-font-primary);
                width: fit-content;
                max-width: 100%;
            `;

            if (descriptionP) {
                const desc = document.createElement('p');
                desc.innerHTML = descriptionP.innerHTML;
                desc.style.margin = '0 0 8px 0';
                desc.style.fontWeight = '500';
                desc.style.maxWidth = '100%';
                desc.style.wordWrap = 'break-word';
                container.appendChild(desc);
            }

            const meta = document.createElement('div');
            meta.style.cssText = 'display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--color-text-secondary, #666); white-space: nowrap;';

            if (authorLink) {
                const author = document.createElement('span');
                author.innerHTML = `Published by ${authorLink.outerHTML}`;
                //meta.appendChild(author); // Uncomment if you want to display uploader as well.
            }

            if (dateDiv) {
                const date = document.createElement('span');
                date.textContent = dateDiv.textContent.trim();
                date.setAttribute('data-tooltip', dateDiv.getAttribute('data-tooltip'));
                date.className = 'tooltip-nocache';
                meta.appendChild(date);
            }

            container.appendChild(meta);
            controls.parentNode.insertBefore(container, controls.nextSibling);
        }
    }
})();