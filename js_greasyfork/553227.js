// ==UserScript==
// @name         Angi HA Lead Copier (F6 + F7 with City and State for AHK)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Adds buttons to copy HA lead info: F6 (JSON w/ city,state), F7 (formatted) - infers VA/DC from address/zip
// @match        https://office.angi.com/app/h/*/leads/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553227/Angi%20HA%20Lead%20Copier%20%28F6%20%2B%20F7%20with%20City%20and%20State%20for%20AHK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553227/Angi%20HA%20Lead%20Copier%20%28F6%20%2B%20F7%20with%20City%20and%20State%20for%20AHK%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const clean = text => text?.replace(/\s+/g, ' ').trim() || '';

    // simple city/state/zip parse helper
    const parseCityStateZip = (s) => {
        if (!s) return { city: '', state: '', zip: '' };
        const t = s.replace(/\bUNCONTACTED\b/i, '').trim();
        // patterns like "Ashburn VA, 20110" or "Ashburn, VA 20110" or "Ashburn VA 20110"
        let m = t.match(/^(.+?)[,\s]+([A-Za-z]{2})[,\s]+(\d{5}(?:-\d{4})?)$/);
        if (m) return { city: clean(m[1]), state: m[2].toUpperCase(), zip: m[3] };
        m = t.match(/^(.+?)[,\s]+(\d{5}(?:-\d{4})?)$/);
        if (m) return { city: clean(m[1]), state: '', zip: m[2] };
        m = t.match(/^(.+?)\s+([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/);
        if (m) return { city: clean(m[1]), state: m[2].toUpperCase(), zip: m[3] };
        // fallback: try extract zip
        const zipMatch = t.match(/\b(\d{5})(?:-\d{4})?\b/);
        const zip = zipMatch ? zipMatch[1] : '';
        const cityOnly = t.replace(/\b\d{5}(?:-\d{4})?\b/, '').replace(/\b[A-Za-z]{2}\b/,'').replace(/[,]/g,'').trim();
        return { city: clean(cityOnly), state: '', zip };
    };

    // infer state from zip prefixes (small map; extend as needed)
    const inferStateFromZip = (zip) => {
        if (!zip) return '';
        const p = ('' + zip).replace(/\D/g, '').slice(0,3);
        const ZIP_STATE_MAP = { '200':'DC','201':'VA','220':'VA','221':'VA','222':'VA','223':'VA','208':'MD','207':'MD','234':'VA' };
        return ZIP_STATE_MAP[p] || '';
    };

    const extractData = () => {
        const fullName = clean(document.querySelector('h4#chosen-lead-name')?.innerText || '');
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ') || '';

        const address = clean(document.querySelector('span.address-label')?.innerText || '');
        // split by first comma to try separate street and city/state/zip
        const parts = address.split(',');
        const streetAddress = parts[0]?.trim() || '';
        const cityStateZipRaw = parts.slice(1).join(',').trim() || '';

        // parse city/state/zip robustly
        const csz = parseCityStateZip(cityStateZipRaw);
        let city = csz.city || '';
        let state = csz.state || '';
        let zip = csz.zip || '';

        // If state missing but zip present, infer
        if (!state && zip) state = inferStateFromZip(zip);

        // If still missing state and city contains a trailing state token like "Ashburn VA", try quick hack
        if (!state && city) {
            const trail = city.match(/\b([A-Za-z]{2})$/);
            if (trail) {
                state = trail[1].toUpperCase();
                city = city.replace(/\b([A-Za-z]{2})$/,'').trim();
            }
        }

        const email = clean(document.querySelector('div.email-address')?.innerText || '');
        const phone = clean(document.querySelector('#customer-phone-number')?.innerText || '');

        return {
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            streetAddress,
            city,
            state,
            zip,
            email,
            phone
        };
    };

    const copyForF6 = () => {
        const d = extractData();
        const payload = {
            firstName: d.firstName,
            lastName: d.lastName,
            streetAddress: d.streetAddress,
            zip: d.zip,
            email: d.email,
            city: d.city,
            state: d.state // added state for AHK/tidewater logic
        };
        GM_setClipboard(JSON.stringify(payload));
        alert(`✅ Copied for F6:\n${d.firstName} ${d.lastName}\n${d.streetAddress}, ${d.city} ${d.state} ${d.zip}`);
    };

    const copyForF7 = () => {
        const d = extractData();
        const digits = (d.phone || '').replace(/\D/g, '');
        const formattedPhone = digits.length === 11 && digits.charAt(0) === '1'
            ? `${digits.slice(1,4)}-${digits.slice(4,7)}-${digits.slice(7)}`
            : (digits.length === 10 ? `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}` : d.phone);

        // include state in the F7 tab-separated output for easier parsing downstream
        const output = `${d.fullName}\t${formattedPhone}\t${d.city}\t${d.state}`;
        GM_setClipboard(output);
        alert(`✅ Copied for F7:\n${output}`);
    };

    const injectButtons = () => {
        const card = document.querySelector('div.customer-details-card.first-card');
        if (!card || document.querySelector('#haCopyF6')) return;

        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            gap: 12px;
            flex-wrap: wrap;
        `;

        const baseStyle = `
            background-color: #FFDF03;
            color: black;
            font-weight: bold;
            padding: 10px 0;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            width: 200px;
            text-align: center;
        `;

        const btnF6 = document.createElement('button');
        btnF6.id = 'haCopyF6';
        btnF6.textContent = 'New Customer Copy';
        btnF6.style.cssText = baseStyle;
        btnF6.onclick = copyForF6;

        const btnF7 = document.createElement('button');
        btnF7.id = 'haCopyF7';
        btnF7.textContent = 'HA Log info copy';
        btnF7.style.cssText = baseStyle;
        btnF7.onclick = copyForF7;

        btnContainer.appendChild(btnF6);
        btnContainer.appendChild(btnF7);
        card.appendChild(btnContainer);
    };

    window.addEventListener('load', () => setTimeout(injectButtons, 1000));
})();