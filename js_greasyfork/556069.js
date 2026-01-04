// ==UserScript==
// @name         Google Scholar Advanced Sorting Toolbox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Integrates advanced sorting options (Year, Citations) directly into the Google Scholar sidebar menu.
// @author       Bui Quoc Dung
// @match        https://scholar.google.com/scholar?*
// @match        https://scholar.google.com.hk/scholar?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556069/Google%20Scholar%20Advanced%20Sorting%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/556069/Google%20Scholar%20Advanced%20Sorting%20Toolbox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getYear(node) {
        const authorLine = node.querySelector('.gs_a');
        if (!authorLine) return 0;
        const text = authorLine.textContent;
        const yearMatch = text.match(/\b(19|20)\d{2}\b/);
        return yearMatch ? parseInt(yearMatch[0], 10) : 0;
    }

    function getCiteCount(node) {
        const citeLink = node.querySelector('a[href*="/scholar?cites"]');
        if (!citeLink) return 0;
        const citeMatch = citeLink.textContent.match(/\d+/);
        return citeMatch ? parseInt(citeMatch[0], 10) : 0;
    }

    function sortElements(sortKey, isDescending) {
        const gsResCclMid = document.getElementById('gs_res_ccl_mid');
        if (!gsResCclMid) return;

        const elementsWithData = [...gsResCclMid.querySelectorAll('.gs_or')]
            .map(node => ({
                node: node,
                year: getYear(node),
                cite: getCiteCount(node)
            }));

        elementsWithData.sort((a, b) => {
            if (sortKey === 'year') {
                const yearDiff = isDescending ? b.year - a.year : a.year - b.year;
                if (yearDiff !== 0) return yearDiff;
                return b.cite - a.cite;
            } else {
                return isDescending ? b.cite - a.cite : a.cite - b.cite;
            }
        });

        gsResCclMid.innerHTML = '';
        gsResCclMid.append(...elementsWithData.map(item => item.node));
    }

    function integrateSortOptions() {
        const allMenus = document.querySelectorAll('.gs_bdy_sb_sec');
        if (allMenus.length < 2) {
            return;
        }
        const menu = allMenus[1];

        const createSortOption = (text, sortKey, isDescending) => {
            const li = document.createElement('li');
            li.className = 'gs_ind';

            const a = document.createElement('a');
            a.href = '#';
            a.textContent = text;

            a.addEventListener('click', (event) => {
                event.preventDefault();
                sortElements(sortKey, isDescending);

                document.querySelectorAll('.gs_bdy_sb_sec li.gs_ind').forEach(item => {
                    item.classList.remove('gs_bdy_sb_sel');
                });
                li.classList.add('gs_bdy_sb_sel');
            });

            li.appendChild(a);
            return li;
        };

        const sortYearDesc = createSortOption('Year (Newest)', 'year', true);
        const sortYearAsc = createSortOption('Year (Oldest)', 'year', false);
        const sortCiteDesc = createSortOption('Cites (Highest)', 'cite', true);
        const sortCiteAsc = createSortOption('Cites (Lowest)', 'cite', false);

        menu.appendChild(sortYearDesc);
        menu.appendChild(sortYearAsc);
        menu.appendChild(sortCiteDesc);
        menu.appendChild(sortCiteAsc);
    }

    window.addEventListener('load', integrateSortOptions);

})();