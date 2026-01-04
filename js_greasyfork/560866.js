// ==UserScript==
// @name         📺 TV Appearance & Tour Matcher
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Strict time-based matching: Only matches if you are still in the city for a gig
// @author       anon
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/TVAppearances*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560866/%F0%9F%93%BA%20TV%20Appearance%20%20Tour%20Matcher.user.js
// @updateURL https://update.greasyfork.org/scripts/560866/%F0%9F%93%BA%20TV%20Appearance%20%20Tour%20Matcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parsePopDate(dateStr) {
        let clean = dateStr.replace(/^[0-9]{4,}/, '').trim();
        clean = clean.replace(/[^\x20-\x7E]/g, '').trim();

        const parts = clean.split(/[\s,/:]+/);
        if (parts.length < 6) return new Date(NaN);

        let day = parseInt(parts[0]);
        let month = parseInt(parts[1]) - 1;
        let year = parseInt(parts[2]);
        let hour = parseInt(parts[3]);
        let minute = parseInt(parts[4]);
        let ampm = parts[5].toUpperCase();

        if (ampm === "PM" && hour < 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;

        return new Date(year, month, day, hour, minute);
    }

    async function init() {
        const tvRows = document.querySelectorAll('table.data tr.odd, table.data tr.even');
        if (tvRows.length === 0) return;

        const perfUrl = window.location.href.replace('/Artist/TVAppearances', '/Artist/UpcomingPerformances');
        const response = await fetch(perfUrl);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const upcomingRows = doc.querySelectorAll('#tableupcoming tbody tr');

        const tourSchedule = Array.from(upcomingRows).map(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) return null;

            const dateCell = cells[0].cloneNode(true);
            const sortSpan = dateCell.querySelector('.sortkey');
            if (sortSpan) sortSpan.remove();

            let city = "";
            const cityLink = cells[1].querySelector('a[href*="/City/"]');
            if (cityLink) {
                city = cityLink.innerText.trim();
            } else {
                const cellText = cells[1].innerText;
                const cityMatch = cellText.match(/\|(.*?)$/);
                city = cityMatch ? cityMatch[1].trim() : cellText.trim();
            }

            return {
                date: parsePopDate(dateCell.innerText),
                city: city,
                cityLower: city.toLowerCase()
            };
        }).filter(item => item !== null && !isNaN(item.date));

        tvRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) return;

            const tvDateText = cells[0].innerText.trim();
            const tvDate = parsePopDate(tvDateText);

            const titleElement = cells[1].querySelector('strong, span[title]');
            const showTitle = (titleElement ? titleElement.innerText : cells[1].childNodes[0].textContent).toLowerCase().trim();

            // STRICT MATCHING LOGIC:
            // Find gigs in this city that occur AT or AFTER the TV show time.
            // If the only gigs in this city are in the past relative to the TV show, it's not a match.
            const validFutureGigsInCity = tourSchedule.filter(gig =>
                showTitle.includes(gig.cityLower) && gig.date >= tvDate
            );

            let matchedGig = null;
            if (validFutureGigsInCity.length > 0) {
                // Pick the gig closest to the TV show time
                matchedGig = validFutureGigsInCity.reduce((prev, curr) => {
                    return (curr.date - tvDate) < (prev.date - tvDate) ? curr : prev;
                });
            }

            const oldStatus = cells[1].querySelector('.ppm-matcher-status');
            if (oldStatus) oldStatus.remove();

            const statusDiv = document.createElement('div');
            statusDiv.className = 'ppm-matcher-status';
            statusDiv.style.cssText = `
                margin-top: 4px;
                margin-left: 4px;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 600;
                border: 1px solid;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background-clip: padding-box;
            `;

            const iconSpan = document.createElement('span');
            const textSpan = document.createElement('span');

            if (matchedGig) {
                statusDiv.style.backgroundColor = '#e9f7ef';
                statusDiv.style.color = '#1e4620';
                statusDiv.style.borderColor = '#b6dfc5';
                iconSpan.textContent = '✓';
                textSpan.textContent = `MATCH`;
            } else {
                statusDiv.style.backgroundColor = '#fbeaea';
                statusDiv.style.color = '#611a1a';
                statusDiv.style.borderColor = '#e0b4b4';
                iconSpan.textContent = '✗';
                textSpan.textContent = `NO MATCH`;
            }

            statusDiv.appendChild(iconSpan);
            statusDiv.appendChild(textSpan);
            cells[1].appendChild(statusDiv);
        });
    }

    init();
})();