// ==UserScript==
// @name         EU Parliament MEP Scraper -> CSV Multi-Language (24 EU Official)
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Scrapes MEPs, reverses emails, and applies localized greetings based on URL language code. Supports all 24 official EU languages.
// @author       AI
// @license      MIT
// @match        https://www.europarl.europa.eu/meps/*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562413/EU%20Parliament%20MEP%20Scraper%20-%3E%20CSV%20Multi-Language%20%2824%20EU%20Official%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562413/EU%20Parliament%20MEP%20Scraper%20-%3E%20CSV%20Multi-Language%20%2824%20EU%20Official%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const languageMap = {
        bg: { fallback: "Уважаем член на парламента", female: "Уважаема госпожо народен представител", male: "Уважаеми господин народен представител" },
        es: { fallback: "Estimada representante parlamentaria", female: "Estimada señora diputada", male: "Estimado señor diputado" },
        cs: { fallback: "Vážený člen Parlamentu", female: "Vážená paní poslankyně", male: "Vážený pane poslanče" },
        da: { fallback: "Kære parlamentsmedlem", female: "Kære fru parlamentsmedlem", male: "Kære hr. parlamentsmedlem" },
        de: { fallback: "Sehr geehrte Frau Abgeordnete/Sehr geehrter Herr Abgeordneter", female: "Sehr geehrte Frau Abgeordnete", male: "Sehr geehrter Herr Abgeordneter" },
        et: { fallback: "Lugupeetud parlamendiliige", female: "Lugupeetud proua parlamendiliige", male: "Lugupeetud härra parlamendiliige" },
        el: { fallback: "Αξιότιμο μέλος του Κοινοβουλίου", female: "Αξιότιμη κυρία βουλευτή", male: "Αξιότιμε κύριε βουλευτά" },
        en: { fallback: "Dear MEP", female: "Dear Ms [NAME], MEP", male: "Dear Mr [NAME], MEP" },
        fr: { fallback: "Membre du Parlement", female: "Madame la Députée", male: "Monsieur le Député" },
        ga: { fallback: "A Fheisire de Pharlaimint na hEorpa", female: "A Fheisire de Pharlaimint na hEorpa [NAME], MEP", male: "A Fheisire de Pharlaimint na hEorpa [NAME], MEP" },
        hr: { fallback: "Poštovani/a zastupniče/ice", female: "Poštovana gospođo zastupnice", male: "Poštovani gospodine zastupniče" },
        it: { fallback: "Onorevole", female: "Gentile Onorevole", male: "Egregio Onorevole" },
        lv: { fallback: "Augsti godātais Eiropas Parlamenta deputāt", female: "Augsti godātā Eiropas Parlamenta deputāte", male: "Augsti godātais Eiropas Parlamenta deputāt" },
        lt: { fallback: "Gerbiamas/oji Parlamento nary/nare", female: "Gerbiamoji Parlamento nare", male: "Gerbiamas Parlamento nary" },
        hu: { fallback: "Tisztelt Képviselő", female: "Tisztelt Képviselő Asszony", male: "Tisztelt Képviselő Úr" },
        mt: { fallback: "Onorevoli", female: "Onorevoli Sinjura", male: "Onorevoli Sur" },
        nl: { fallback: "Geachte afgevaardigde", female: "Geachte mevrouw afgevaardigde", male: "Geachte heer afgevaardigde" },
        pl: { fallback: "Szanowny Panie Pośle / Szanowna Pani Poseł", female: "Szanowna Pani Poseł", male: "Szanowny Panie Pośle" },
        pt: { fallback: "Prezado(a) Senhor(a) Deputado(a)", female: "Exma. Senhora Deputada", male: "Exmo. Senhor Deputado" },
        ro: { fallback: "Stimate Domnule / Stimată Doamnă Deputat", female: "Stimată doamnă deputată", male: "Stimate domnule deputat" },
        sk: { fallback: "Vážený člen Parlamentu", female: "Vážená pani poslankyňa", male: "Vážený pán poslanec" },
        sl: { fallback: "Spoštovani član parlamenta", female: "Spoštovana gospa poslanka", male: "Spoštovani gospod poslanec" },
        fi: { fallback: "Arvoisa Euroopan parlamentin jäsen", female: "Arvoisa Euroopan parlamentin jäsen [NAME], MEP", male: "Arvoisa Euroopan parlamentin jäsen [NAME], MEP" },
        sv: { fallback: "Bäste europaparlamentariker", female: "Bästa fru europaparlamentariker", male: "Bäste herr europaparlamentariker" }
    };

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
        const pathParts = window.location.pathname.split('/');
        const lang = pathParts[2] || 'en';
        const config = languageMap[lang] || languageMap['en'];

        const formatGreeting = (template, name) => {
            return template.includes('[NAME]') ? template.replace('[NAME]', name) : `${template} ${name}`;
        };

        const fallbackGreeting = formatGreeting(config.fallback, displayName);

        try {
            const response = await fetch(`https://api.genderize.io?name=${encodeURIComponent(firstName)}`);
            if (!response.ok) throw new Error('API limit or network error');
            const data = await response.json();

            if (data.gender === 'female') return formatGreeting(config.female, displayName);
            if (data.gender === 'male') return formatGreeting(config.male, displayName);
        } catch (err) {
            console.error('Genderize API Error:', err);
        }
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
            const profileLink = block.querySelector('a[href*="/meps/"]');

            if (nameDiv && profileLink) {
                const fullText = nameDiv.innerText.trim();
                const profileUrl = profileLink.href;
                const nameParts = fullText.split(' ');
                const rawLastName = nameParts.filter(part => part === part.toUpperCase() && part.length > 1).join(' ');
                const primaryName = nameParts.filter(part => part !== rawLastName).join(' ');
                const lastName = normalizeName(rawLastName);
                const normalizedFullName = `${primaryName} ${lastName}`;
                const nickname = await getGenderNickname(primaryName.split(' ')[0], normalizedFullName);

                try {
                    const response = await fetch(profileUrl);
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const emailElement = doc.querySelector('a.link_email');
                    let email = "";
                    if (emailElement) {
                        let rawEmail = (emailElement.getAttribute('href') || "").replace('mailto:', '');
                        email = rawEmail.split("").reverse().join("").replace(/\]ta\[/g, '@').replace(/\]tod\[/g, '.');
                    }
                    csvRows.push(`${primaryName},${lastName},${normalizedFullName},${nickname},${email}`);
                } catch (err) { console.error('Error fetching:', profileUrl); }
            }
        }

        GM_setClipboard(csvRows.join('\n'));
        btn.innerHTML = 'Copied to Clipboard!';
        setTimeout(() => { btn.innerHTML = 'Copy MEP Data to CSV'; btn.disabled = false; }, 3000);
    };
})();