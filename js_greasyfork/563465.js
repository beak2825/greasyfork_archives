// ==UserScript==
// @name         SnowCrows - Sort Builds by Latest Update
// @namespace    https://github.com/thalaguer/Snowcrows-Sort-by-Latest-Updated
// @version      1.0.1
// @description  Sorts raid builds by last updated date 
// @author       Thalaguer
// @match        https://snowcrows.com/*
// @match        https://*.snowcrows.com/*
// @icon         https://snowcrows.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563465/SnowCrows%20-%20Sort%20Builds%20by%20Latest%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/563465/SnowCrows%20-%20Sort%20Builds%20by%20Latest%20Update.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // All the classes.
    const professions = {
        Guardian: ["Guardian", "Dragonhunter", "Firebrand", "Willbender", "Luminary"],
        Revenant: ["Revenant", "Herald", "Renegade", "Vindicator", "Conduit"],
        Warrior: ["Warrior", "Berserker", "Spellbreaker", "Bladesworn", "Paragon"],
        Engineer: ["Engineer", "Scrapper", "Holosmith", "Mechanist", "Amalgam"],
        Ranger: ["Ranger", "Druid", "Soulbeast", "Untamed", "Galeshot"],
        Thief: ["Thief", "Daredevil", "Deadeye", "Specter", "Antiquary"],
        Elementalist: ["Elementalist", "Tempest", "Weaver", "Catalyst", "Evoker"],
        Mesmer: ["Mesmer", "Chronomancer", "Mirage", "Virtuoso", "Troubadour"],
        Necromancer: ["Necromancer", "Reaper", "Scourge", "Harbinger", "Ritualist"]
    };

    const allSpecs = Object.values(professions).flat();

    console.log("SnowCrows SortByLatestUpdated Script - Loaded");

    // Date parser
    //todo : check if website is available in some other languages
    function getDateFromText(txt) {
        const m = txt.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s*,?\s*(\d{4})/i);
        if (!m) return new Date(0);

        const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
        return new Date(parseInt(m[3]), months[m[1].toLowerCase()], parseInt(m[2]));
    }



    function sortBuilds() {
        const container = document.querySelector('div.grid.gap-1.mt-4') ||
            document.querySelector('[wire\\:snapshot] > div') ||
            document.body;

        const links = [...container.querySelectorAll('a[href*="raids/"]:not([href*="raids.html"])')];

        if (links.length < 2) {
            console.warn("Not enough builds found");
            return;
        }

        //1. copy  class icons / bars from nearby full builds (before sorting !!!)
        links.forEach(target => {
            const txt = target.innerText.toLowerCase();
            if (allSpecs.some(spec => txt.includes(spec.toLowerCase()))) return;

            let prev = target.previousElementSibling;
            while (prev) {
                if (prev.tagName === 'A' && prev.href.includes('/raids/')) {
                    const hasStuff =
                        prev.children.length >= 3 &&
                        prev.children[0].classList.contains('flex-none') &&
                        prev.children[1].classList.contains('flex-none') &&
                        prev.children[1].querySelector('img.h-6');

                    if (hasStuff && !target.dataset.iconsDone) {
                        target.prepend(prev.children[1].cloneNode(true));
                        target.prepend(prev.children[0].cloneNode(true));
                        target.dataset.iconsDone = 'y';
                        break;
                    }
                }
                prev = prev.previousElementSibling;
            }
        });

        // 2.copy titles + tags from main build
        let lastGood = null;
        document.querySelectorAll('a[href*="raids/"]:not([href*="raids.html"])').forEach(link => {
            const hasIcon = link.querySelector('img.h-6');
            const hasTitle = link.querySelector('h2');
            const hasTags = link.querySelector('div.text-sm.flex.gap-1.flex-wrap.justify-end') ||
                link.querySelector('[class*="bg-"][class*="rounded-2xl"]');

            if (hasIcon && hasTitle) {
                lastGood = link;
                return;
            }

            if (!lastGood) return;

            // missing title?
            if (!hasTitle) {
                const titleClone = lastGood.querySelector('h2')?.cloneNode(true);
                if (titleClone) {
                    const weap = link.querySelector('div.text-sm.text-neutral-400');
                    if (weap) {
                        weap.parentNode.insertBefore(titleClone, weap);
                        titleClone.style.marginBottom = '0.25rem';
                    }
                }
            }

            // missing roles tags (quick / alac / heal / power / condi ) ?
            if (!hasTags) {
                const tagsSrc = lastGood.querySelector('div.text-sm.flex.gap-1.flex-wrap.justify-end') ||
                    lastGood.querySelector('div.hidden.lg\\:block > div.inline-block');

                if (tagsSrc) {
                    const tagsCopy = tagsSrc.cloneNode(true);

                    const difficultyDiv = link.querySelector('div.text-neutral-300.hidden.md\\:block.w-16[style*="font-size: 0"]') ||
                        link.querySelector('div[style*="font-size: 0"]');

                    if (difficultyDiv) {
                        difficultyDiv.parentNode.insertBefore(tagsCopy, difficultyDiv.nextSibling || null);
                    } else {
                        link.appendChild(tagsCopy);
                    }

                    // copy other tag style - right align....
                    tagsCopy.style.cssText = `
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        gap: 0.25rem;
                        flex-wrap: nowrap;
                        margin-top: 0.25rem;
                        margin-left: auto;
                    `;
                    tagsCopy.classList.remove('hidden', 'lg:block');

                    const inner = tagsCopy.querySelector('div.text-sm.flex.gap-1.flex-wrap.justify-end');
                    if (inner) {
                        inner.style.justifyContent = 'flex-end';
                        inner.style.flexWrap = 'nowrap';
                    }
                }
            }
        });

        //no more sub-builds
        links.forEach(l => {
            l.className = l.className.replace(/\bpl-\d+\b/g, '').trim();
        });

        document.head.insertAdjacentHTML('beforeend', `
            <style>
                a[href*="/builds/raids/"] {
                    padding-left: 1rem !important;
                    margin-left: 0 !important;
                }
            </style>
        `);

        // 3. sort by date
        const buildsWithDates = links.map(link => {
            let dateStr = null;
            const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
            let n;
            while ((n = walker.nextNode())) {
                let t = n.nodeValue.trim().replace(/\s+/g, ' ');
                if (t.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s*,?\s*\d{4}/i)) {
                    dateStr = t;
                    break;
                }
            }
            return { link, dateStr, date: dateStr ? getDateFromText(dateStr) : new Date(0) };
        }).filter(b => b.dateStr && !isNaN(b.date.getTime()));

        if (buildsWithDates.length < 2) return;

        buildsWithDates.sort((a, b) => b.date - a.date);

        const parentNode = buildsWithDates[0].link.parentNode;
        if (parentNode) {
            buildsWithDates.forEach(b => parentNode.appendChild(b.link));
            cleanupPage();
        }
    }

    function cleanupPage() {
        // profession headers
        document.querySelectorAll('div.mt-4.rounded > h2').forEach(h => h.parentNode.remove());

        // useless empty divs
        document.querySelectorAll('div.h-4:empty, div.w-full.h-px.rounded.bg-neutral-600.mt-10')
            .forEach(d => {
                if (!d.children.length && !d.textContent.trim()) d.remove();
            });

        // featured / beginner / legacy headers
        document.querySelectorAll('h2.mt-4.text-xl.font-medium.pl-4').forEach(h => {
            const t = h.textContent.trim();
            if (['Featured', 'Beginner', 'Legacy'].includes(t)) h.remove();
        });

        // "you've reached the end" message
        document.querySelectorAll('div.text-center.py-4.text-gray-400').forEach(d => {
            if (d.textContent.includes('reached the end')) d.remove();
        });
    }

    // Add the sort button – only once
    function addSortButton() {
        if (document.getElementById('sc-sort-btn')) return;
        if (isSpinnerPresentAndVisible()) return;
        const spans = document.querySelectorAll('span.rounded-full.inline-block.hover\\:bg-black\\/100');
        const diffSpan = [...spans].find(s => s.textContent.includes('Build Difficulty:'));

        if (!diffSpan) return; // wait for next check

        const wrapper = document.createElement('span');
        wrapper.className = diffSpan.className;

        const btn = document.createElement('button');
        btn.id = 'sc-sort-btn';
        btn.textContent = 'Sort by Latest (local)';
        btn.style.cssText = 'background:none;border:none;cursor:pointer;padding:0.5rem 1rem;color:#fdba74;font-weight:500;';

        btn.onclick = () => {
            btn.textContent = 'Sorting…';
            btn.disabled = true;
            sortBuilds();
            setTimeout(() => {
                btn.textContent = 'Sort by Latest (local)';
                btn.disabled = false;
            }, 2500);
        };

        wrapper.appendChild(btn);
        diffSpan.after(wrapper);

    }

    function isSpinnerPresentAndVisible() {
        const spinnerSpan = document.querySelector('span[wire\\:loading]');
        if (!spinnerSpan) return false;

        const visible = spinnerSpan.style.display !== 'none' &&
            getComputedStyle(spinnerSpan).display !== 'none' &&
            spinnerSpan.offsetParent !== null;
        return visible;
    }

    function watchForButton() {
        addSortButton();
        const timer = setInterval(() => {
            if (!document.getElementById('sc-sort-btn')) {
                addSortButton();
            }
        }, 3000);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => {
          watchForButton();}, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', watchForButton);
    }
})();