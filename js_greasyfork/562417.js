// ==UserScript==
// @name         EU Parliament MEP Scraper -> csv _NL
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Scrapes MEPs, reverses emails, checks gender via Genderize.io, and formats nicknames with gendered form of address. Includes fallback for unknown gender.
// @author       AI
// @license      MIT
// @match        https://www.europarl.europa.eu/meps/*/search/advanced?*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562417/EU%20Parliament%20MEP%20Scraper%20-%3E%20csv%20_NL.user.js
// @updateURL https://update.greasyfork.org/scripts/562417/EU%20Parliament%20MEP%20Scraper%20-%3E%20csv%20_NL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement('button');
    btn.innerHTML = 'Copy MEP Data to CSV';
    btn.style = "position:fixed;top:10px;right:10px;z-index:9999;padding:10px;background:#003399;color:white;border:none;cursor:pointer;border-radius:5px;font-weight:bold;box-shadow: 0px 4px 6px rgba(0,0,0,0.3);";
    document.body.appendChild(btn);

    const normalizeName = (str) => {
        if (!str) return "";
        const lower = str.toLowerCase();
        return lower.replace(/(^|[\s-])\p{L}/gu, char => char.toUpperCase());
    };

    const getGenderNickname = async (firstName, displayName) => {
        const fallbackGreeting = `Geachte afgevaardigde ${displayName}`;

        try {
            const response = await fetch(`https://api.genderize.io?name=${encodeURIComponent(firstName)}`);
            if (!response.ok) throw new Error('API limit or network error');

            const data = await response.json();

            if (data.gender === 'female') {
                return `Geachte mevrouw afgevaardigde ${displayName}`;
            } else if (data.gender === 'male') {
                return `Geachte heer afgevaardigde ${displayName}`;
            }
        } catch (err) {
            console.error('Genderize API Error:', err);
        }

        // Rückfalloption bei null, unknown oder API-Fehler
        return fallbackGreeting;
    };

    btn.onclick = async () => {
        const mepBlocks = document.querySelectorAll('div[id^="member-block-"]');
        let csvRows = ['First Name,Last Name,Display Name,Nickname,Primary Email'];

        btn.disabled = true;
        let count = 0;

        for (let block of mepBlocks) {
            count++;
            btn.innerHTML = `Processing ${count} / ${mepBlocks.length}...`;

            const nameDiv = block.querySelector('.erpl_title-h4.t-item');
            const profileLink = block.querySelector('a[href*="/meps/en/"]');

            if (nameDiv && profileLink) {
                const fullText = nameDiv.innerText.trim();
                const profileUrl = profileLink.href;

                const nameParts = fullText.split(' ');
                const rawLastName = nameParts.filter(part => part === part.toUpperCase() && part.length > 1).join(' ');
                const primaryName = nameParts.filter(part => part !== rawLastName).join(' ');

                const lastName = normalizeName(rawLastName);
                const normalizedFullName = `${primaryName} ${lastName}`;
                const detectionName = primaryName.split(' ')[0];
                const nickname = await getGenderNickname(detectionName, normalizedFullName);

                try {
                    const response = await fetch(profileUrl);
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    const emailElement = doc.querySelector('a.link_email');
                    let email = "";

                    if (emailElement) {
                        let rawEmail = emailElement.getAttribute('href') || "";
                        rawEmail = rawEmail.replace('mailto:', '');
                        let reversedEmail = rawEmail.split("").reverse().join("");
                        email = reversedEmail.replace(/\]ta\[/g, '@').replace(/\]tod\[/g, '.');
                    }

                    csvRows.push(`${primaryName},${lastName},${normalizedFullName},${nickname},${email}`);
                } catch (err) {
                    console.error('Error fetching:', profileUrl);
                }
            }
        }

        GM_setClipboard(csvRows.join('\n'));

        btn.innerHTML = 'Copied to Clipboard!';
        setTimeout(() => {
            btn.innerHTML = 'Copy MEP Data to CSV';
            btn.disabled = false;
        }, 3000);
    };
})();