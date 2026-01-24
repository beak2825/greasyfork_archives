// ==UserScript==
// @name         DinoDen Region Switcher
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Adds a custom UI server dropdown to dinoden.gg next to the Patreon button.
// @author       You
// @match        https://*.dinoden.gg/*
// @match        https://dinoden.gg/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563749/DinoDen%20Region%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/563749/DinoDen%20Region%20Switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONTAINER_ID = 'dinoden-region-switcher';

    // Define regions
    const REGIONS = [
        {
            id: 'na',
            name: 'North America',
            desc: 'NA Website',
            url: 'https://na.dinoden.gg/',
            active: true
        },
        {
            id: 'eu',
            name: 'Europe',
            desc: 'EU Website',
            url: 'https://eu.dinoden.gg/',
            active: true
        },
        {
            id: 'au',
            name: 'Australia',
            desc: 'AU Website',
            url: 'https://au.dinoden.gg/',
            active: true
        }
    ];

    function injectSwitcher() {
        if (document.getElementById(CONTAINER_ID)) return;

        const patreonBtn = document.querySelector('a[href*="/patreon"]');
        if (!patreonBtn) return;

        // --- 1. THE TRIGGER BUTTON ---
        const container = document.createElement('div');
        container.id = CONTAINER_ID;
        // Standard nav-btn classes
        container.className = 'nav-btn group relative h-20 flex items-center justify-center whitespace-nowrap px-3 xl:px-4 text-sm font-medium transition-colors text-white/70 hover:text-white';
        container.style.cursor = 'pointer';

        // Inner HTML for the trigger (Icon + Text + Arrow)
        container.innerHTML = `
            <span class="icon-sq" style="margin-right: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </span>
            <span class="relative">Region</span>
            <span id="dd-arrow" class="text-white/60 transition-transform duration-200 ml-1">▾</span>
            <!-- Hover Underlines -->
            <span class="pointer-events-none absolute inset-x-3 bottom-0 h-[2px] bg-emerald-400 transition-opacity duration-200 opacity-0"></span>
            <span class="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-white/30 transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]"></span>
        `;

        // --- 2. THE DROPDOWN MENU ---
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute left-0 top-full mt-2 overflow-hidden rounded-2xl bg-gray-900/95 ring-1 ring-white/10 shadow-xl backdrop-blur w-max min-w-[18rem] max-w-[min(26rem,calc(100vw-2rem))] hidden';
        dropdown.style.zIndex = '50';

        // Scrollable content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'p-2 max-h-[calc(100dvh-80px-24px)] overflow-auto';

        // Generate Items
        REGIONS.forEach(region => {
            const item = document.createElement('a');
            item.className = 'flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/5 text-white/80 hover:text-white';
            item.style.cursor = region.active ? 'pointer' : 'not-allowed';

            // Item HTML structure
            item.innerHTML = `
                <span class="menu-icon mt-0.5 w-8 h-6 flex items-center justify-center bg-white/5 rounded-xl ring-1 ring-white/10">
                    <span class="text-white/90 font-bold text-[10px] tracking-wide" style="line-height: 1;">${getRegionIcon(region.id)}</span>
                </span>
                <div class="min-w-0">
                    <div class="font-medium leading-tight">${region.name}</div>
                    <div class="mt-0.5 text-xs text-white/50 leading-snug">${region.desc}</div>
                </div>
            `;

            // Click Handler
            item.addEventListener('click', (e) => {
                if (region.active) {
                    e.preventDefault();
                    window.location.href = region.url;
                }
            });

            contentWrapper.appendChild(item);
        });

        dropdown.appendChild(contentWrapper);
        container.appendChild(dropdown);

        // --- 3. HOVER LOGIC ---
        const arrow = container.querySelector('#dd-arrow');
        let hoverTimeout;

        function openMenu() {
            clearTimeout(hoverTimeout);
            dropdown.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
            container.classList.add('text-white');
        }

        function closeMenu() {
            hoverTimeout = setTimeout(() => {
                dropdown.classList.add('hidden');
                arrow.style.transform = 'rotate(0deg)';
                container.classList.remove('text-white');
            }, 200);
        }

        container.addEventListener('mouseenter', openMenu);
        container.addEventListener('mouseleave', closeMenu);

        // Helper to return text icon
        function getRegionIcon(id) {
            if (id === 'na') return 'NA';
            if (id === 'eu') return 'EU';
            if (id === 'au') return 'AU';
            return '??';
        }

        // Inject
        if (patreonBtn.parentNode) {
            patreonBtn.parentNode.insertBefore(container, patreonBtn.nextSibling);
        }
    }

    injectSwitcher();

    const observer = new MutationObserver(() => {
        if (!document.getElementById(CONTAINER_ID)) {
            injectSwitcher();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();