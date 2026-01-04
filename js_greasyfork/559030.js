// ==UserScript==
// @name         Uber Receipts Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download Uber ride receipts as PDFs
// @match        https://riders.uber.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559030/Uber%20Receipts%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/559030/Uber%20Receipts%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add download button to page
    const btn = document.createElement('button');
    btn.innerHTML = '📥 Download Receipts';
    btn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;padding:10px 15px;background:#000;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:14px;';
    document.body.appendChild(btn);

    btn.onclick = () => showModal();

    function showModal() {
        const modal = document.createElement('div');
        modal.id = 'uber-dl-modal';
        modal.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;">
                <div style="background:#fff;padding:20px;border-radius:10px;width:400px;max-height:80vh;overflow-y:auto;">
                    <h3 style="margin:0 0 15px;">Download Uber Receipts</h3>
                    <label>Year: <input type="number" id="uber-year" value="${new Date().getFullYear()}" style="width:80px;padding:5px;"></label>
                    <label style="margin-left:10px;">Month: <input type="number" id="uber-month" min="1" max="12" value="${new Date().getMonth()+1}" style="width:60px;padding:5px;"></label>
                    <br><br>
                    <button id="uber-fetch" style="padding:8px 15px;background:#000;color:#fff;border:none;border-radius:5px;cursor:pointer;">Fetch Trips</button>
                    <button id="uber-close" style="padding:8px 15px;margin-left:10px;background:#ccc;border:none;border-radius:5px;cursor:pointer;">Close</button>
                    <div id="uber-results" style="margin-top:15px;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('uber-close').onclick = () => modal.remove();
        document.getElementById('uber-fetch').onclick = () => fetchTrips();
    }

    async function fetchTrips() {
        const year = parseInt(document.getElementById('uber-year').value);
        const month = parseInt(document.getElementById('uber-month').value);
        const results = document.getElementById('uber-results');
        results.innerHTML = '<p>Fetching trips...</p>';

        const startMs = new Date(year, month - 1, 1).getTime();
        const endMs = new Date(year, month, 0, 23, 59, 59).getTime();

        const query = `query Activities($endTimeMs: Float, $limit: Int = 10, $nextPageToken: String, $orderTypes: [RVWebCommonActivityOrderType!] = [RIDES, TRAVEL], $startTimeMs: Float) { activities { past(endTimeMs: $endTimeMs, limit: $limit, nextPageToken: $nextPageToken, orderTypes: $orderTypes, startTimeMs: $startTimeMs) { activities { cardURL description subtitle title uuid } nextPageToken } } }`;

        let trips = [], nextToken = null;
        try {
            while (true) {
                const variables = { includePast: true, limit: 10, orderTypes: ["RIDES", "TRAVEL"], endTimeMs: endMs, startTimeMs: startMs };
                if (nextToken) variables.nextPageToken = nextToken;

                const resp = await fetch('https://riders.uber.com/graphql', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json', 'x-csrf-token': 'x' },
                    credentials: 'include',
                    body: JSON.stringify({ operationName: 'Activities', variables, query })
                });
                const data = await resp.json();
                const past = data?.data?.activities?.past || {};
                trips.push(...(past.activities || []));
                nextToken = past.nextPageToken;
                if (!nextToken) break;
            }

            let total = 0;
            let html = `<p><strong>Found ${trips.length} trips</strong></p><table style="width:100%;font-size:12px;border-collapse:collapse;">`;
            html += '<tr style="background:#f0f0f0;"><th style="padding:5px;text-align:left;">Date</th><th>Fare</th><th>Destination</th><th>Receipt</th></tr>';

            for (const t of trips) {
                const uuid = t.cardURL.split('/trips/')[1];
                const fare = parseFloat(t.description.replace('$', ''));
                total += fare;
                html += `<tr style="border-bottom:1px solid #eee;">
                    <td style="padding:5px;">${t.subtitle}</td>
                    <td style="padding:5px;">${t.description}</td>
                    <td style="padding:5px;">${t.title}</td>
                    <td style="padding:5px;"><a href="https://riders.uber.com/trips/${uuid}/receipt?contentType=PDF" target="_blank">PDF</a></td>
                </tr>`;
            }
            html += `</table><p style="margin-top:10px;"><strong>Total: $${total.toFixed(2)}</strong></p>`;
            html += `<button id="uber-dl-all" style="margin-top:10px;padding:8px 15px;background:#000;color:#fff;border:none;border-radius:5px;cursor:pointer;">Download All PDFs</button>`;
            results.innerHTML = html;

            document.getElementById('uber-dl-all').onclick = () => downloadAll(trips);
        } catch (e) {
            results.innerHTML = `<p style="color:red;">Error: ${e.message}</p>`;
        }
    }

    async function downloadAll(trips) {
        for (const t of trips) {
            const uuid = t.cardURL.split('/trips/')[1];
            const dateStr = t.subtitle.replace(' • ', '_').replace(/ /g, '_').replace(':', '');
            const dest = t.title.replace(/ /g, '_');
            const fare = t.description.replace('$', '');
            const filename = `uber_receipt_${dateStr}_${dest}_${fare}.pdf`;

            const resp = await fetch(`https://riders.uber.com/trips/${uuid}/receipt?contentType=PDF`, { credentials: 'include' });
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            await new Promise(r => setTimeout(r, 500)); // delay between downloads
        }
        alert('All receipts downloaded!');
    }
})();
