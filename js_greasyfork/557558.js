// ==UserScript==
// @name         Kleinanzeigen Verkäufer-Bewertungen in Suchergebnissen anzeigen
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Zeigt in der Suchübersicht Account Alter und Bewertungen der einzelnen Nutzer unter den Suchergebissen an.
// @author       Uli König
// @match        https://www.kleinanzeigen.de/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      www.kleinanzeigen.de
// @run-at       document-end
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/557558/Kleinanzeigen%20Verk%C3%A4ufer-Bewertungen%20in%20Suchergebnissen%20anzeigen.user.js
// @updateURL https://update.greasyfork.org/scripts/557558/Kleinanzeigen%20Verk%C3%A4ufer-Bewertungen%20in%20Suchergebnissen%20anzeigen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_REQUESTS = 100000; //Obergrenze pro Tag
    const BASE_DELAY = 1000;

    function calculateActivePeriod(activeStr) {
        const dateMatch = activeStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if (!dateMatch) return activeStr;

        const day = parseInt(dateMatch[1], 10);
        const month = parseInt(dateMatch[2], 10) - 1;
        const year = parseInt(dateMatch[3], 10);

        const startDate = new Date(year, month, day);
        const now = new Date();
        const diffMs = now - startDate;
        if (diffMs < 0) return activeStr;

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 30) {
            return `${diffDays} Tag${diffDays !== 1 ? 'e' : ''} aktiv`;
        }

        const diffMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
        if (diffMonths < 12) {
            return `${diffMonths} Monat${diffMonths !== 1 ? 'e' : ''} aktiv`;
        }

        const diffYears = now.getFullYear() - startDate.getFullYear();
        return `${diffYears} Jahr${diffYears !== 1 ? 'e' : ''} aktiv`;
    }

    function getRatingLevel(activeDays, satisfaction, reliability) {
        const ratings = [];

        // Aktiv seit Bewertung (genaue Tage für Logik)
        if (activeDays < 90) ratings.push('schlecht');      // <3 Monate
        else if (activeDays < 365) ratings.push('mittel');   // <1 Jahr
        else ratings.push('gut');                            // >1 Jahr

        // Zufriedenheit
        if (satisfaction === 'TOP') ratings.push('gut');
        else if (satisfaction === 'OK') ratings.push('mittel');
        else if (satisfaction === 'NAJA') ratings.push('schlecht');
        else ratings.push('mittel'); // keine = Mittel

        // Zuverlässigkeit
        if (reliability) ratings.push('gut');
        else ratings.push('mittel');

        // Schlechtester Wert entscheidet
        return ratings.some(r => r === 'schlecht') ? 'schlecht' :
        ratings.every(r => r === 'gut') ? 'gut' : 'mittel';
    }

    function extractSellerData(doc) {
        const data = {
            satisfaction: 'fehlt',
            reliability: '',
            sustainability: '',
            type: '',
            active: '',
            activeDays: 0 // Für interne Rating-Berechnung
        };

        // Zufriedenheit (TOP/OK/NAJA)
        const satisfactionEls = doc.querySelectorAll('[data-testid="seller-rating"], [class*="rating"], [class*="badge"], [title*="Zufriedenheit"]');
        for (let el of satisfactionEls) {
            const text = el.textContent.toUpperCase();
            if (text.includes('TOP')) data.satisfaction = 'TOP';
            else if (text.includes('OK')) data.satisfaction = 'OK';
            else if (text.includes('NAJA')) data.satisfaction = 'NAJA';
        }

        // Zuverlässigkeit
        const relEl = doc.querySelector('[title*="zuverlässig"], [alt*="zuverlässig"], [class*="reliab"], [data-testid*="reliab"]');
        if (relEl) data.reliability = relEl.textContent.trim() || relEl.title || relEl.alt;

        // Nachhaltigkeit
        const susEl = doc.querySelector('[title*="nachhalt"], [alt*="nachhalt"], [class*="sustain"], [data-testid*="sustain"]');
        if (susEl) data.sustainability = susEl.textContent.trim() || susEl.title || susEl.alt;

        // Nutzertyp und Aktiv seit
        const vipDetails = doc.querySelectorAll('span.userprofile-vip-details-text');
        vipDetails.forEach(span => {
            const text = span.textContent.trim();
            if (text.match(/privat/i)) data.type = 'Privater Nutzer';
            else if (text.match(/gewerblich/i)) data.type = 'Gewerblicher Nutzer';

            const activeSpan = span.querySelector('span.Aktiv.seit, span[class*="Aktiv"], span[class*="aktiv"]');
            let rawActive = '';
            if (activeSpan) {
                rawActive = activeSpan.textContent.trim();
            } else {
                const aktivMatch = text.match(/Aktiv seit\s*[:]?(.+)/i);
                if (aktivMatch && aktivMatch[1]) rawActive = aktivMatch[1].trim();
            }

            if (rawActive) {
                const dateMatch = rawActive.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
                if (dateMatch) {
                    const day = parseInt(dateMatch[1], 10);
                    const month = parseInt(dateMatch[2], 10) - 1;
                    const year = parseInt(dateMatch[3], 10);
                    const startDate = new Date(year, month, day);
                    const now = new Date();
                    data.activeDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
                    data.active = calculateActivePeriod(rawActive);
                } else {
                    data.active = rawActive;
                }
            }
        });

        // Bewertung berechnen
        data.rating = getRatingLevel(data.activeDays, data.satisfaction, data.reliability);

        return data;
    }

    function addSellerInfo(adElement, data) {
        let infoContainer = adElement.querySelector('.aditem-main .aditem-details-footer, [class*="shipping"], [class*="tags"]');
        if (!infoContainer) {
            const footer = adElement.querySelector('.aditem-main > div:last-child');
            infoContainer = document.createElement('div');
            infoContainer.className = 'aditem-details-footer seller-info';
            infoContainer.style.cssText = 'font-size:12px;color:#666;margin-top:5px;';
            footer.appendChild(infoContainer);
        }

        // PASTELLFARBEN mit schwarzem Text (hoher Kontrast)
        const ratingColors = {
            'gut': '#d4edda',      // Pastell-Grün
            'mittel': '#fff3cd',   // Pastell-Gelb
            'schlecht': '#f8d7da'  // Pastell-Rot
        };

        const ratingBorders = {
            'gut': '#28a745',      // Intensives Grün für Rahmen
            'mittel': '#ffc107',   // Intensives Gelb für Rahmen
            'schlecht': '#dc3545'  // Intensives Rot für Rahmen
        };

        const infos = [];
        if (data.satisfaction !== 'fehlt') infos.push(data.satisfaction);
        if (data.reliability) infos.push(data.reliability);
        if (data.sustainability) infos.push(data.sustainability);
        if (data.type) infos.push(data.type);
        if (data.active) infos.push(data.active); // Natürliche Form: "2 Jahre aktiv"

        if (infos.length > 0) {
            const infoSpan = document.createElement('span');
            infoSpan.textContent = infos.join(' | ');

            const rating = data.rating;
            infoSpan.style.cssText = `
            background: ${ratingColors[rating]};
            color: #000 !important;
            padding: 4px 8px;
            border-radius: 12px;
            margin-left: 10px;
            font-size: 11px;
            font-weight: 600;
            border: 2px solid ${ratingBorders[rating]};
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        `;

        infoSpan.title = `Gesamtbewertung: ${rating.toUpperCase()}\n${data.active}`;
        infoContainer.appendChild(infoSpan);

        // Anzeige subtil einfärben (Pastell + Linkslinien)
        adElement.style.borderLeft = `4px solid ${ratingColors[rating]}`;
        adElement.style.backgroundColor = `${ratingColors[rating]}20`; // 12% Transparenz
        adElement.style.transition = 'all 0.3s ease';

        // Hover-Effekt
        adElement.onmouseenter = () => {
            adElement.style.backgroundColor = `${ratingColors[rating]}40`;
            adElement.style.transform = 'translateX(2px)';
        };
        adElement.onmouseleave = () => {
            adElement.style.backgroundColor = `${ratingColors[rating]}20`;
            adElement.style.transform = 'translateX(0)';
        };
    }
}

    async function stealthFetch(detailUrl, listingReferer) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: detailUrl,
                timeout: 10000,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-User': '?1',
                    'Cache-Control': 'max-age=0',
                    // ECHTER REFERER: Aktuelle Listing-Seite
                    'Referer': listingReferer || window.location.href
                },
                onload: (response) => {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        resolve(parser.parseFromString(response.responseText, 'text/html'));
                    } else {
                        resolve(null);
                    }
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null)
            });
        });
    }

    async function processAdList() {
        const adItems = Array.from(document.querySelectorAll('.aditem, [data-testid="l-aditem"], [class*="ad-list-item"]')).slice(0, MAX_REQUESTS);
        let processed = 0;

        console.log(`Verarbeite ${adItems.length} Anzeigen (max ${MAX_REQUESTS})...`);

        for (let adItem of adItems) {
            // Überspringen wenn schon verarbeitet
            if (adItem.querySelector('.seller-info')) continue;
            if (processed >= MAX_REQUESTS) break;

            const detailLink = adItem.querySelector('a[href*="/s-anzeige/"], .aditem-title a');
            if (!detailLink) continue;

            const detailUrl = detailLink.href;
            // REFERER = ECHTE LISTING-SEITE (window.location.href)
            console.log(`Lade ${detailUrl} (Referer: ${window.location.href})`);

            // 3-5 Sekunden Pause (menschliches Tempo)
            const delay = BASE_DELAY + Math.random() * 2000;
            await new Promise(r => setTimeout(r, delay));

            const doc = await stealthFetch(detailUrl, window.location.href);
            if (doc) {
                const data = extractSellerData(doc);
                addSellerInfo(adItem, data);
                console.log('✓ Verkäuferdaten:', data);
            } else {
                console.log('✗ Fehler beim Laden:', detailUrl);
            }

            processed++;
            const total = GM_getValue('totalProcessed', 0) + 1;
            GM_setValue('totalProcessed', total);

            if (total >= MAX_REQUESTS * 2) { // 2 Sessions pro Tag
                console.log('Tageslimit erreicht. Warte 24h.');
                break;
            }
        }
    }

    // Auto-Start nach 2 Sekunden + manueller Trigger (Ctrl+F8)
    setTimeout(() => {
        console.log('Kleinanzeigen Verkäufer-Checker bereit. Auto-Start in 2s...');
        processAdList();
    }, 2000);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F8' && e.ctrlKey) {
            console.log('Manueller Start (Ctrl+F8)');
            GM_setValue('totalProcessed', 0);
            processAdList();
        }
    });

    console.log('Script aktiv. Referer=echte Listing-Seite. Ctrl+F8 für manuellen Start.');
})();
