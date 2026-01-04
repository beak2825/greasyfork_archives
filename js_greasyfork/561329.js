// ==UserScript==
// @license MIT 
// @name         JL Award on AA Calendar Scanner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scans JL award availability on aa.com
// @author       AnonAno
// @match        https://www.aa.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561329/JL%20Award%20on%20AA%20Calendar%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/561329/JL%20Award%20on%20AA%20Calendar%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[AA Scanner v0.5] Script loaded');

    let statusEl;

    function createUI() {
        console.log('[AA Scanner] Creating UI');

        const container = document.createElement('div');
        container.id = 'aa-scanner-panel';
        Object.assign(container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '999999',
            background: 'white',
            border: '3px solid #0067a0',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            width: '340px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#333',
            maxHeight: '85vh',
            overflowY: 'auto'
        });

        // Title
        const title = document.createElement('h3');
        title.textContent = 'AA Award Scanner';
        Object.assign(title.style, { margin: '0 0 12px', color: '#0067a0', textAlign: 'center' });
        container.appendChild(title);

        // Helper to add labeled input
        function addInput(labelText, id, type = 'text', value = '', attrs = {}) {
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.display = 'block';
            label.style.marginBottom = '4px';
            container.appendChild(label);

            const input = document.createElement('input');
            input.id = id;
            input.type = type;
            input.value = value;
            Object.assign(input.style, { width: '100%', padding: '6px', marginBottom: '10px' });
            Object.assign(input, attrs);
            container.appendChild(input);
        }

        addInput('From Year:', 'fromYear', 'number', '2026');
        addInput('From Month (1-12):', 'fromMonth', 'number', '2', { min: 1, max: 12 });
        addInput('To Month (1-12):', 'toMonth', 'number', '1', { min: 1, max: 12 });
        addInput('Origins (comma sep):', 'origins', 'text', 'TYO,SFO');
        addInput('Destinations:', 'destinations', 'text', 'TYO,SFO');
        addInput('Cabin:', 'cabin', 'text', 'BUSINESS,FIRST');
        addInput('Max Stops (0/1/2):', 'maxStops', 'text', '1');
        addInput('Delay ms:', 'delayMs', 'number', '300', { min: 100 });

        // Checkbox
        const chkLabel = document.createElement('label');
        chkLabel.style.display = 'block';
        chkLabel.style.marginBottom = '10px';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.id = 'includeLink';
        chk.checked = true;
        chkLabel.appendChild(chk);
        chkLabel.appendChild(document.createTextNode(' Include booking links'));
        container.appendChild(chkLabel);

        // Status
        statusEl = document.createElement('div');
        statusEl.id = 'scanner-status';
        Object.assign(statusEl.style, {
            marginTop: '12px',
            minHeight: '24px',
            color: '#0067a0',
            fontWeight: 'bold',
            textAlign: 'center'
        });
        statusEl.textContent = 'Ready – click Start';
        container.appendChild(statusEl);

        // Start button
        const btn = document.createElement('button');
        btn.textContent = 'Start Scan';
        Object.assign(btn.style, {
            width: '100%',
            padding: '10px',
            background: '#0067a0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '12px'
        });
        btn.addEventListener('click', runScan);
        container.appendChild(btn);

        (document.body || document.documentElement).appendChild(container);
        console.log('[AA Scanner] UI created and appended');
    }

    async function runScan() {
        if (!statusEl) return;

        statusEl.textContent = 'Initializing...';
        statusEl.style.color = 'blue';

        const config = {
            fromYear: parseInt(document.getElementById('fromYear').value),
            fromMonth: parseInt(document.getElementById('fromMonth').value),
            toMonth: parseInt(document.getElementById('toMonth').value),
            origins: document.getElementById('origins').value.split(',').map(s => s.trim().toUpperCase()),
            destinations: document.getElementById('destinations').value.split(',').map(s => s.trim().toUpperCase()),
            cabin: document.getElementById('cabin').value.trim(),
            maxStops: document.getElementById('maxStops').value.trim(),
            includeLink: document.getElementById('includeLink').checked,
            delayMs: parseInt(document.getElementById('delayMs').value)
        };

        if (isNaN(config.fromYear) || config.origins.length === 0 || config.destinations.length === 0) {
            statusEl.textContent = 'Invalid configuration';
            statusEl.style.color = 'red';
            return;
        }

        // TYO city handling
        const TYO = new Set(['NRT', 'HND']);
        const isSameCity = (a, b) => a === b || (TYO.has(a) && TYO.has(b));

        // Build VALID direction pairs only
        const validPairs = [];
        for (const origin of config.origins) {
            for (const dest of config.destinations) {
                if (!isSameCity(origin, dest)) {
                    validPairs.push({ origin, dest });
                }
            }
        }

        if (validPairs.length === 0) {
            statusEl.textContent = 'No valid direction pairs';
            statusEl.style.color = 'red';
            return;
        }

        // Generate list of departure dates (first of each month)
        const dates = [];
        for (let y = config.fromYear; y <= (config.fromMonth <= config.toMonth ? config.fromYear : config.fromYear + 1); y++) {
            const startM = (y === config.fromYear) ? config.fromMonth : 1;
            const endM = (y === config.fromYear && config.fromMonth <= config.toMonth) ? config.toMonth : (y > config.fromYear ? config.toMonth : 12);
            for (let m = startM; m <= endM; m++) {
                dates.push(`${y}-${String(m).padStart(2, '0')}-01`);
            }
        }

        const totalValidRequests = dates.length * validPairs.length;
        let processed = 0;
        const results = [];

        statusEl.textContent = `Scanning ${totalValidRequests} valid requests (${dates.length} months × ${validPairs.length} directions)`;

        for (const depDate of dates) {
            for (const { origin, dest } of validPairs) {
                processed++;
                statusEl.textContent = `${depDate} ${origin}→${dest} (${processed}/${totalValidRequests})`;

                await new Promise(r => setTimeout(r, config.delayMs || 300));

                try {
                    const response = await fetch("https://www.aa.com/booking/api/search/calendar", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json, text/plain, */*",
                            "cache-control": "no-cache"
                        },
                        body: JSON.stringify({
                            metadata: { tripType: "OneWay" },
                            passengers: [{ type: "adult", count: 1 }],
                            requestHeader: { clientId: "AAcom" },
                            slices: [{
                                allCarriers: true,
                                cabin: config.cabin,
                                departureDate: depDate,
                                destination: dest,
                                destinationNearbyAirports: false,
                                maxStops: config.maxStops,
                                origin: origin,
                                originNearbyAirports: false
                            }],
                            tripOptions: {
                                corporateBooking: false,
                                fareType: "Lowest",
                                locale: "en_US",
                                pointOfSale: null,
                                searchType: "Award"
                            },
                            loyaltyInfo: null,
                            version: "",
                            queryParams: { sliceIndex: 0, sessionId: "", solutionSet: "", solutionId: "" }
                        })
                    });

                    if (!response.ok) {
                        console.warn(`HTTP ${response.status} for ${depDate} ${origin}→${dest}`);
                        continue;
                    }

                    const data = await response.json();
                    for (const month of data.calendarMonths || []) {
                        for (const week of month.weeks || []) {
                            for (const day of week.days || []) {
                                if (!day.validDay || !day.solution) continue;
                                const sol = day.solution;
                                if (sol.perPassengerAwardPoints && sol.perPassengerAwardPoints < 100000) {
                                    const bookUrl = `https://www.aa.com/booking/search?type=OneWay&searchType=Award&from=${origin}&to=${dest}&pax=1&cabin=${config.cabin}&locale=en_US&nearbyAirports=false&depart=${day.date}&carriers=ALL&pos=US&adult=1`;
                                    results.push({
                                        date: day.date,
                                        route: `${origin} → ${dest}`,
                                        dayOfWeek: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
                                        points: sol.perPassengerAwardPoints.toLocaleString(),
                                        cash: sol.perPassengerSaleTotal?.amount || 0,
                                        currency: sol.perPassengerSaleTotal?.currency || 'USD',
                                        link: config.includeLink ? `<a href="${bookUrl}" target="_blank">Book</a>` : ''
                                    });
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.error('Request failed:', err);
                }
            }
        }

        statusEl.textContent = `Scan complete • ${results.length} awards found • ${processed}/${totalValidRequests}`;
        statusEl.style.color = results.length > 0 ? 'green' : 'orange';

        if (results.length === 0) {
            alert('No award availability found under 100,000 points in the scanned period.');
            return;
        }

        // Results overlay
        results.sort((a, b) => a.date.localeCompare(b.date));

        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.7)',
            zIndex: '999998',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 0 30px black'
        });

        let tableRows = results.map(r => `
            <tr>
                <td style="padding:8px;">${r.date}</td>
                <td style="padding:8px;">${r.dayOfWeek}</td>
                <td style="padding:8px;">${r.route}</td>
                <td style="padding:8px; text-align:right;">${r.points}</td>
                <td style="padding:8px; text-align:right;">${r.cash} ${r.currency}</td>
                <td style="padding:8px;">${r.link}</td>
            </tr>
        `).join('');

        modal.innerHTML = `
            <h2 style="color:green; text-align:center; margin-top:0;">🎉 ${results.length} Award Opportunities Found!</h2>
            <p style="text-align:center;"><strong>Period:</strong> ${dates[0]} – ${dates[dates.length-1].slice(0,7)}-31</p>
            <table style="border-collapse:collapse; width:100%; margin:15px 0; font-size:13px;">
                <thead style="background:#0067a0; color:white;">
                    <tr>
                        <th style="padding:8px;">Date</th>
                        <th style="padding:8px;">Day</th>
                        <th style="padding:8px;">Route</th>
                        <th style="padding:8px;">Points</th>
                        <th style="padding:8px;">+ Cash</th>
                        <th style="padding:8px;">Link</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
            <button style="display:block; margin:20px auto; padding:10px 30px; background:#0067a0; color:white; border:none; border-radius:4px; cursor:pointer;"
                    onclick="this.closest('div').parentElement.remove()">Close</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // Launch UI after short delay
    setTimeout(createUI, 2000);
})();