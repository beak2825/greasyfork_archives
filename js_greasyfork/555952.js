// ==UserScript==
// @name         SP TABLE REPORT + DRIVE EXPORT
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Floating button → modal: Shopee conversion+click report by SubID, summary table preview, export CSV to Drive via GAS (configurable settings) + GSheet link. Now with Same-Day vs 7-Day commissions.
// @author       Mark
// @match        https://affiliate.shopee.ph/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      affiliate.shopee.ph
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/555952/SP%20TABLE%20REPORT%20%2B%20DRIVE%20EXPORT.user.js
// @updateURL https://update.greasyfork.org/scripts/555952/SP%20TABLE%20REPORT%20%2B%20DRIVE%20EXPORT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====== SETTINGS STORAGE ======
    const LS_SETTINGS_KEY = 'sp_table_report_settings_v1';

    function loadSettings() {
        try {
            const raw = localStorage.getItem(LS_SETTINGS_KEY);
            if (!raw) return { gasUploadUrl: '', driveFolderId: '', gsheetUrl: '' };
            const obj = JSON.parse(raw);
            return {
                gasUploadUrl: obj.gasUploadUrl || '',
                driveFolderId: obj.driveFolderId || '',
                gsheetUrl: obj.gsheetUrl || ''
            };
        } catch (e) {
            console.error('Error loading settings:', e);
            return { gasUploadUrl: '', driveFolderId: '', gsheetUrl: '' };
        }
    }

    function saveSettings(s) {
        localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify({
            gasUploadUrl: s.gasUploadUrl || '',
            driveFolderId: s.driveFolderId || '',
            gsheetUrl: s.gsheetUrl || ''
        }));
    }

    let SETTINGS = loadSettings();

    // ====== GLOBAL STATE (REPORT) ======
    let capturedData = null;          // grouped CONVERSION rows (internal)
    let summaryContainer = null;
    let summaryTitle = null;          // "Summary: Total Clicks | Total Comms"
       let capturedDataClick = [];
    let clickMap = {};               // subId -> total clicks
    let convPerSubMap = {};          // subId -> total commission (Peso)
    let ordersPerSubMap = {};        // subId -> Set of unique checkout_id with non-zero commission
    let summaryRows = [];            // [{ subId, clicks, commission }]

    let convReady = false;
    let clicksReady = false;
    let currentLogArea = null;
    let lastStartISO = null;
    let lastEndISO = null;
    let summaryTotalClicks = 0;
    let summaryTotalComms = 0;

    // ====== NEW GLOBAL STATE (SAMEDAY vs 7DAY) ======
    let sameDayOrders = [];           // array of {checkout_id, click_time, purchase_time, estimated_total_commission}
    let sevenDayOrders = [];
    let sameDayTotalCommission = 0;
    let sevenDayTotalCommission = 0;
    let sameDayCount = 0;
    let sevenDayCount = 0;

    // ====== GLOBAL STATE (EXPORT) ======
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // ====== UTILITIES ======

    function getUnixTimestampStart(date) {
        return Math.floor(new Date(date + 'T00:00:00').getTime() / 1000);
    }

    function getUnixTimestampEnd(date) {
        return Math.floor(new Date(date + 'T23:59:59').getTime() / 1000);
    }

    function getYesterdayDate() {
        let today = new Date();
        today.setDate(today.getDate() - 1);
        return today.toISOString().split('T')[0];
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const months2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months2[date.getMonth()] + '-' + date.getDate() + '-' + date.getFullYear();
    }

        // Check if two unix timestamps (in seconds) fall on the same calendar day (local time)
    function isSameCalendarDay(ts1, ts2) {
        if (ts1 == null || ts2 == null) return false;
        const d1 = new Date(ts1 * 1000);
        const d2 = new Date(ts2 * 1000);
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    function formatInt(n) {
        return Number(n || 0).toLocaleString('en-US', {
            maximumFractionDigits: 0
        });
    }

    function formatMoney(n) {
        return Number(n || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatPercent(n) {
        return Number(n || 0).toFixed(1);
    }

    // Sanitize filename
    function sanitizeBaseName(name) {
        name = (name || '').split(/\r?\n/)[0];
        name = name.replace(/[\\/:*?"<>|]+/g, '_');
        name = name.replace(/\s+/g, '_');
        name = name.replace(/_+/g, '_');
        name = name.replace(/^_+|_+$/g, '');
        if (!name) name = 'export.csv';
        if (!/\.csv$/i.test(name)) name += '.csv';
        return name;
    }

    function formatFilename(username, startISO, endISO, extHint) {
        const s = new Date(startISO);
        const e = new Date(endISO);
        const same = s.getFullYear() === e.getFullYear() &&
                     s.getMonth() === e.getMonth() &&
                     s.getDate() === e.getDate();
        const single = `${months[s.getMonth()]}_${s.getDate()}_${s.getFullYear()}`;
        const range  = `${months[s.getMonth()]}_${s.getDate()}_${e.getDate()}_${e.getFullYear()}`;
        return `${username}_${(same ? single : range)}.${extHint || 'csv'}`;
    }

    // ====== LOG HELPER (no duplicate "LOG:") ======

    function setLogText(outputArea, lines, sheetLink) {
        if (!outputArea) return;

        if (sheetLink) {
            const safeLines = lines.map(function (l) {
                return String(l).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            });
            let html = '';
            for (let i = 0; i < safeLines.length; i++) {
                if (/See Report Now/i.test(safeLines[i])) {
                    html += '<a href="' + sheetLink +
                            '" target="_blank" style="color:#1976d2;text-decoration:underline;">See Report Now (CLICK HERE)</a><br>';
                } else {
                    html += safeLines[i] + '<br>';
                }
            }
            outputArea.innerHTML = html;
        } else {
            outputArea.innerText = lines.join('\n');
        }
    }

        // ====== SUBID RESOLUTION HELPERS ======
    // CLICK SIDE: sub_id is PRIMARY, fallback to internal_source, else "NO-SUBID"
    function resolveClickSubId(item) {
        const sub = (item.sub_id || '').trim();
        const internal = (item.internal_source || '').trim();
        if (sub) return sub;
        if (internal) return internal;
        return 'NO-SUBID';
    }

    // CONVERSION SIDE: utm_content is PRIMARY, fallback to internal_source, else "NO-SUBID"
    function resolveConvSubId(item) {
        const utm = (item.utm_content || '').trim();
        const internal = (item.internal_source || '').trim();
        if (utm) return utm;
        if (internal) return internal;
        return 'NO-SUBID';
    }


    // ====== CONVERSION GROUPING ======

        function groupData(data) {
        const groupedData = {};

        data.forEach(function (item) {
            const key = item.purchase_time + '|' + item.subId;
            if (!groupedData[key]) {
                groupedData[key] = {
                    purchase_time: item.purchase_time,
                    subId: item.subId,
                    affiliate_net_commission: 0,
                    affiliate_name: item.affiliate_name
                };
            }
            groupedData[key].affiliate_net_commission += parseFloat(item.affiliate_net_commission || 0);
        });

        return Object.values(groupedData).map(function (item) {
            return {
                purchase_time: item.purchase_time,
                subId: item.subId,
                affiliate_net_commission: Number(item.affiliate_net_commission.toFixed(2)),
                affiliate_name: item.affiliate_name
            };
        });
    }


        function buildConvPerSubFromGrouped(data) {
        convPerSubMap = {};
        data.forEach(function (row) {
            const sub = row.subId || 'NO-SUBID';
            const comm = Number(row.affiliate_net_commission || 0);
            if (!convPerSubMap[sub]) convPerSubMap[sub] = 0;
            convPerSubMap[sub] += comm;
        });
    }


    // ====== CLICK GROUPING ======

        function groupDataClick(data) {
        const grouped = {};
        data.forEach(function (item) {
            const subId = resolveClickSubId(item); // sub_id primary, fallback to internal_source, else "NO-SUBID"
            if (!grouped[subId]) grouped[subId] = new Set();
            grouped[subId].add(item.click_id);
        });

        const rows = [];
        Object.keys(grouped).forEach(function (subId) {
            rows.push({
                sub_id: subId,
                count: grouped[subId].size
            });
        });
        return rows;
    }


    function buildClickMapFromGrouped(groupedClicks) {
        clickMap = {};
        groupedClicks.forEach(function (row) {
            const sub = row.sub_id || '';
            clickMap[sub] = row.count;
        });
    }

    function clearSummaryTable() {
                summaryRows = [];
        summaryTotalClicks = 0;
        summaryTotalComms = 0;
        ordersPerSubMap = {};

        // reset SAME-DAY vs 7-DAY state as well

        sameDayOrders = [];
        sevenDayOrders = [];
        sameDayTotalCommission = 0;
        sevenDayTotalCommission = 0;
        sameDayCount = 0;
        sevenDayCount = 0;

        if (!summaryContainer || !summaryTitle) return;
        summaryContainer.innerHTML = '';
        summaryTitle.style.display = 'none';
        summaryContainer.style.display = 'none';
    }

    // ====== SUMMARY BUILD + LOG ======

    function buildSummaryRowsAndLog(outputArea) {
        summaryRows = [];
        const allSubs = new Set();

        Object.keys(convPerSubMap).forEach(function (s) { allSubs.add(s); });
        Object.keys(clickMap).forEach(function (s) { allSubs.add(s); });

        allSubs.forEach(function (sub) {
            const comm = convPerSubMap[sub] || 0;
            const clicks = clickMap[sub] || 0;
            summaryRows.push({
                subId: sub,
                commission: comm,
                clicks: clicks
            });
        });

        let totalClicks = 0;
        let totalComms = 0;

        summaryRows.forEach(function (row) {
            totalClicks += row.clicks;
            totalComms += row.commission;
        });

        summaryTotalClicks = totalClicks;
        summaryTotalComms = totalComms;

        const convTotalForPct = sameDayTotalCommission + sevenDayTotalCommission;
        const sameDayPct = convTotalForPct > 0 ? (sameDayTotalCommission / convTotalForPct * 100) : 0;
        const sevenDayPct = convTotalForPct > 0 ? (sevenDayTotalCommission / convTotalForPct * 100) : 0;

        setLogText(outputArea, [
            'Total Clicks: ' + formatInt(totalClicks),
            'Total Commissions: ' + formatMoney(totalComms),
            'Same-Day Comms: ' + formatMoney(sameDayTotalCommission) +
                ' (' + formatPercent(sameDayPct) + '% of est. total_comm)',
            '7-Day Comms: ' + formatMoney(sevenDayTotalCommission) +
                ' (' + formatPercent(sevenDayPct) + '% of est. total_comm)'
        ]);

        console.log('Summary totals:', {
            totalClicks: totalClicks,
            totalComms: totalComms,
            sameDayTotalCommission: sameDayTotalCommission,
            sevenDayTotalCommission: sevenDayTotalCommission
        });
    }

    function maybeFinalize() {
        if (!currentLogArea) return;
        if (!convReady || !clicksReady) return;
        buildSummaryRowsAndLog(currentLogArea);
        renderSummaryTable();
        updateSaveButtonStatus();
    }

    // ====== SUMMARY TABLE RENDERER ======

    function renderSummaryTable() {
        if (!summaryContainer || !summaryTitle) return;

        summaryContainer.innerHTML = '';

        if (!summaryRows || summaryRows.length === 0) {
            summaryTitle.style.display = 'none';
            summaryContainer.style.display = 'none';
            return;
        }

        const convTotalForPct = sameDayTotalCommission + sevenDayTotalCommission;
        const sameDayPct = convTotalForPct > 0 ? (sameDayTotalCommission / convTotalForPct * 100) : 0;
        const sevenDayPct = convTotalForPct > 0 ? (sevenDayTotalCommission / convTotalForPct * 100) : 0;

        // === EXACT COMPACT SUMMARY FORMAT (NO raw values, % only for SD & 7D) ===
        const sameDayUnique = new Set(sameDayOrders.map(o => o.checkout_id)).size;
        const sevenDayUnique = new Set(sevenDayOrders.map(o => o.checkout_id)).size;
        const totalUnique = sameDayUnique + sevenDayUnique;

        // Conversion share (%)
        const sdConvPct = totalUnique > 0 ? (sameDayUnique / totalUnique * 100) : 0;
        const zConvPct = totalUnique > 0 ? (sevenDayUnique / totalUnique * 100) : 0;

        // Comms share (%)
        const sdCommPct = summaryTotalComms > 0 ? (sameDayTotalCommission / summaryTotalComms * 100) : 0;
        const zCommPct = summaryTotalComms > 0 ? (sevenDayTotalCommission / summaryTotalComms * 100) : 0;

        // === FINAL DISPLAY (EXACT LABELS REQUESTED) ===
        summaryTitle.innerHTML =
            'Summary: Total Clicks (' + formatInt(summaryTotalClicks) +
            ') | Total Comms (' + formatMoney(summaryTotalComms) + ')' +
            '<br>' +
            'Same-Day: Conversion (' + formatPercent(sdConvPct) + '%) | Comms (' +
                formatPercent(sdCommPct) + '%)' +
            '<br>' +
            '7-Day: Conversion (' + formatPercent(zConvPct) + '%) | Comms (' +
                formatPercent(zCommPct) + '%)';

        summaryTitle.style.display = 'block';
        summaryContainer.style.display = 'block';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '11px';
        table.style.tableLayout = 'fixed';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // ✅ Updated headers: SubID, Clicks, Orders, Comms, Avg ₱/Click
        const headers = ['SubID', 'Clicks', 'Orders', 'Comms', 'Avg ₱/Click'];

        headers.forEach(function (text, idx) {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.border = '1px solid #ddd';
            th.style.padding = '4px';
            th.style.backgroundColor = '#f0f0f0';
            th.style.position = 'sticky';
            th.style.top = '0';
            th.style.zIndex = '1';
            th.style.whiteSpace = 'nowrap';
            if (idx === 0) {
                th.style.width = '50%';
            } else {
                th.style.width = '16%';
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        summaryRows.forEach(function (row) {
            const tr = document.createElement('tr');

            const subId = row.subId || '';
            const clicks = Number(row.clicks || 0);
            const comm = Number(row.commission || 0);

            const ordersSet = ordersPerSubMap[subId];
            const ordersCount = ordersSet ? ordersSet.size : 0;

            const ratio = clicks > 0 ? (comm / clicks) : null;

            let displaySubId = (subId || '').replace(/-+$/g, '');
            if (!displaySubId || displaySubId === 'NO-SUBID') {
                displaySubId = 'NO-SUBID';
            }

            const tdSub = document.createElement('td');
            tdSub.textContent = displaySubId;
            tdSub.style.border = '1px solid #ddd';
            tdSub.style.padding = '4px';
            tdSub.style.wordBreak = 'break-all';
            tdSub.style.width = '50%';

            // ✅ NEW: Clicks column
            const tdClicks = document.createElement('td');
            tdClicks.textContent = formatInt(clicks);
            tdClicks.style.border = '1px solid #ddd';
            tdClicks.style.padding = '4px';
            tdClicks.style.textAlign = 'right';

            const tdOrders = document.createElement('td');
            tdOrders.textContent = formatInt(ordersCount);
            tdOrders.style.border = '1px solid #ddd';
            tdOrders.style.padding = '4px';
            tdOrders.style.textAlign = 'right';

            const tdComm = document.createElement('td');
            tdComm.textContent = formatMoney(comm);
            tdComm.style.border = '1px solid #ddd';
            tdComm.style.padding = '4px';
            tdComm.style.textAlign = 'right';

            const tdRatio = document.createElement('td');
            tdRatio.textContent = (ratio === null) ? '-' : formatMoney(ratio);
            tdRatio.style.border = '1px solid #ddd';
            tdRatio.style.padding = '4px';
            tdRatio.style.textAlign = 'right';

            // ✅ Order: SubID, Clicks, Orders, Comms, Avg ₱/Click
            tr.appendChild(tdSub);
            tr.appendChild(tdClicks);
            tr.appendChild(tdOrders);
            tr.appendChild(tdComm);
            tr.appendChild(tdRatio);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        summaryContainer.appendChild(table);
    }

    // ====== DATA FETCHING: CONVERSIONS ======

    async function fetchTotalCount(url, outputArea) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);

            const data = await response.json();
            console.log('Fetched CONVERSION Data:', data);

            const totalCount = data.data.total_count || 0;
            console.log('Conv API total_count:', totalCount);

            if (totalCount > 0) {
                processData(url, totalCount);
            } else {
                convPerSubMap = {};
                convReady = true;
                maybeFinalize();
            }
        } catch (error) {
            console.error('Error fetching conversion data:', error);
            setLogText(outputArea, ['Error fetching conversion data.']);
            convPerSubMap = {};
            convReady = true;
            maybeFinalize();
        }
    }

    function processData(url, totalCount) {
        const maxPageSize = 500;

        if (totalCount > maxPageSize) {
            const numRequests = Math.ceil(totalCount / maxPageSize);

            for (let i = 1; i <= numRequests; i++) {
                const currentPageSize =
                    i === numRequests ? (totalCount % maxPageSize || maxPageSize) : maxPageSize;
                const newUrl = url
                    .replace('page_size=20', 'page_size=' + currentPageSize)
                    .replace(/&page_num=\d+/, '&page_num=' + i);
                console.log('Generated CONVERSION URL (backend):', newUrl);
                fetchNewData(newUrl);
            }
        } else {
            const newUrl = url
                .replace('page_size=20', 'page_size=' + totalCount)
                .replace(/&page_num=\d+/, '&page_num=1');
            console.log('Generated CONVERSION URL (backend):', newUrl);
            fetchNewData(newUrl);
        }
    }

    function fetchNewData(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const newResponseText = response.responseText;
                        console.log('New CONVERSION API Response:', newResponseText);

                        const newFullResponse = JSON.parse(newResponseText);
                        if (newFullResponse.data && newFullResponse.data.list) {
                            const list = newFullResponse.data.list;

                            // ====== SAME-DAY vs 7-DAY ARRAYS & TOTALS (by calendar date) ======
                            list.forEach(function (item) {
                                const estComm = parseFloat(item.estimated_total_commission || 0) / 100000;

                                const rec = {
                                    checkout_id: item.checkout_id,
                                    click_time: item.click_time,
                                    purchase_time: item.purchase_time,
                                    estimated_total_commission: estComm
                                };

                                if (isSameCalendarDay(item.purchase_time, item.click_time)) {
                                    // SAME-DAY: purchase & click are on the same calendar date
                                    sameDayOrders.push(rec);
                                    sameDayTotalCommission += estComm;
                                    sameDayCount += 1;
                                } else {
                                    // 7-DAY (or any other-day) conversion
                                    sevenDayOrders.push(rec);
                                    sevenDayTotalCommission += estComm;
                                    sevenDayCount += 1;
                                }
                            });


                                                        const rawData = list.map(function (item) {
                                const subKey = resolveConvSubId(item); // utm_content primary, fallback to internal_source, else "NO-SUBID"
                                const netComm = parseFloat(item.affiliate_net_commission || 0) / 100000;
                                const estComm = parseFloat(item.estimated_total_commission || 0) / 100000;

                                // Build ORDERS per SubID: unique checkout_id with non-zero estimated_total_commission
                                if (estComm !== 0 && item.checkout_id) {
                                    if (!ordersPerSubMap[subKey]) {
                                        ordersPerSubMap[subKey] = new Set();
                                    }
                                    ordersPerSubMap[subKey].add(item.checkout_id);
                                }

                                return {
                                    purchase_time: formatDate(item.purchase_time),
                                    subId: subKey,
                                    utm_content: item.utm_content,
                                    internal_source: item.internal_source,
                                    affiliate_net_commission: netComm,
                                    affiliate_name: item.affiliate_name
                                };
                            });


                            if (!capturedData) capturedData = [];
                            capturedData = capturedData.concat(rawData);
                            console.log('Captured CONVERSION Data Length:', capturedData.length);

                            if (capturedData.length >= newFullResponse.data.total_count) {
                                capturedData = groupData(capturedData);
                                console.log('Grouped and Processed CONVERSION Data:', capturedData);

                                buildConvPerSubFromGrouped(capturedData);
                                convReady = true;
                                maybeFinalize();
                            }
                        } else {
                            console.log('No conversion list data found in the response.');
                            convPerSubMap = {};
                            convReady = true;
                            maybeFinalize();
                        }
                    } catch (error) {
                        console.error('Error processing conversion response:', error);
                        convPerSubMap = {};
                        convReady = true;
                        maybeFinalize();
                    }
                } else {
                    console.error('Failed to fetch conversion data. Status:', response.status);
                    convPerSubMap = {};
                    convReady = true;
                    maybeFinalize();
                }
            },
            onerror: function (error) {
                console.error('Error fetching conversion data:', error);
                convPerSubMap = {};
                convReady = true;
                maybeFinalize();
            }
        });
    }

    // ====== DATA FETCHING: CLICKS ======

    async function fetchTotalCountClick(url, outputArea) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);

            const data = await response.json();
            console.log('Fetched CLICK Data:', data);

            const totalCount = data.data.total_count || 0;
            console.log('Click API total_count:', totalCount);

            if (totalCount > 0) {
                processDataClick(url, totalCount);
            } else {
                clickMap = {};
                clicksReady = true;
                maybeFinalize();
            }
        } catch (error) {
            console.error('Error fetching click data:', error);
            setLogText(outputArea, ['Error fetching click data.']);
            clickMap = {};
            clicksReady = true;
            maybeFinalize();
        }
    }

    function processDataClick(url, totalCount) {
        let urls = [];
        const originalUrl = new URL(url);
        const clickTimeStart = parseInt(originalUrl.searchParams.get('click_time_s'), 10);
        const clickTimeEnd = parseInt(originalUrl.searchParams.get('click_time_e'), 10);

        if (totalCount > 10000) {
            const numSegments = Math.ceil(totalCount / 10000);
            const timeInterval = Math.floor((clickTimeEnd - clickTimeStart + 1) / numSegments);

            for (let i = 0; i < numSegments; i++) {
                const segmentStart = clickTimeStart + i * timeInterval;
                const segmentEnd = i === numSegments - 1
                    ? clickTimeEnd
                    : segmentStart + timeInterval - 1;

                const newUrl = url
                    .replace(/click_time_s=\d+/, 'click_time_s=' + segmentStart)
                    .replace(/click_time_e=\d+/, 'click_time_e=' + segmentEnd)
                    .replace(/&page_num=\d+/, '&page_num=1')
                    .replace(/&page_size=\d+/, '&page_size=10000');

                urls.push(newUrl);
            }
        } else {
            const newUrl = url
                .replace(/&page_num=\d+/, '&page_num=1')
                .replace(/&page_size=\d+/, '&page_size=10000');
            urls.push(newUrl);
        }

        let totalURLsClick = urls.length;
        let completedRequestsClick = 0;
        capturedDataClick = [];

        urls.forEach(function (u) {
            console.log('Generated CLICK URL (backend):', u);
            fetchNewDataClick(u, function () {
                completedRequestsClick += 1;
                if (completedRequestsClick === totalURLsClick) {
                    const groupedClicks = groupDataClick(capturedDataClick);
                    console.log('Grouped CLICK Data:', groupedClicks);
                    buildClickMapFromGrouped(groupedClicks);
                    clicksReady = true;
                    maybeFinalize();
                }
            });
        });
    }

    function fetchNewDataClick(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const newResponseText = response.responseText;
                        console.log('New CLICK API Response:', newResponseText);

                        const newFullResponse = JSON.parse(newResponseText);
                        if (newFullResponse.data && newFullResponse.data.list) {
                                                        const rawData = newFullResponse.data.list.map(function (item) {
                                return {
                                    click_time: item.click_time,
                                    sub_id: item.sub_id,
                                    internal_source: item.internal_source,
                                    click_id: item.click_id
                                };
                            });


                            capturedDataClick = capturedDataClick.concat(rawData);
                            console.log('Captured CLICK Data Length:', capturedDataClick.length);
                        } else {
                            console.log('No click list data found in the response.');
                        }
                    } catch (error) {
                        console.error('Error processing click response:', error);
                    }
                } else {
                    console.error('Failed to fetch click data. Status:', response.status);
                }
                callback();
            },
            onerror: function (error) {
                console.error('Error fetching click data:', error);
                callback();
            }
        });
    }
    // ====== EXPORT CORE ======

    function fetchShopeeUsername() {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://affiliate.shopee.ph/api/v3/user/profile',
                onload: function (res) {
                    try {
                        const j = JSON.parse(res.responseText);
                        const name = j && j.data && (j.data.shopee_user_name || j.data.username);
                        if (name) resolve(name);
                        else reject(new Error('shopee_user_name not found'));
                    } catch (e) { reject(e); }
                },
                onerror: reject
            });
        });
    }

    function triggerExport(startISO, endISO) {
        const s = getUnixTimestampStart(startISO);
        const e = getUnixTimestampEnd(endISO);
        const url = 'https://affiliate.shopee.ph/api/v1/report/download?page_size=20&page_num=1' +
            '&purchase_time_s=' + s +
            '&purchase_time_e=' + e +
            '&version=1';

        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (res) {
                    try {
                        const j = JSON.parse(res.responseText);
                        const taskId = j && j.data && j.data.task_id;
                        if (!taskId) return reject(new Error('No task_id in response'));
                        resolve({ taskId: taskId, startISO: startISO, endISO: endISO });
                    } catch (e) { reject(e); }
                },
                onerror: reject
            });
        });
    }

    function sleep(ms) {
        return new Promise(function (r) { return setTimeout(r, ms); });
    }

    function tryDownload(taskId) {
        const url = 'https://affiliate.shopee.ph/api/v1/export/download?task_id=' + encodeURIComponent(taskId);
        return new Promise(function (resolve) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                onload: function (res) {
                    const headers = res.responseHeaders || '';
                    const ctMatch = headers.match(/content-type:\s*([^\r\n]+)/i);
                    const dispMatch = headers.match(/content-disposition:\s*attachment/ig);
                    const contentType = (ctMatch ? ctMatch[1] : '').trim().toLowerCase();
                    const isDownloadish = !!dispMatch || /text\/csv|application\/octet-stream/i.test(contentType);
                    const ok = res.status === 200 &&
                               res.response &&
                               res.response.byteLength > 128 &&
                               isDownloadish;

                    if (ok) {
                        let ext = 'csv';
                        const nameFromDisp = headers.match(/filename="?([^"]+)"?/i);
                        if (nameFromDisp && nameFromDisp[1]) {
                            const nm = nameFromDisp[1].trim();
                            const dot = nm.lastIndexOf('.');
                            if (dot > -1) ext = nm.slice(dot + 1).toLowerCase();
                        }
                        const blob = new Blob([res.response], { type: contentType || 'text/csv;charset=utf-8' });
                        blob.__extHint = ext;
                        blob.__sourceURL = url;
                        resolve(blob);
                    } else {
                        resolve(null);
                    }
                },
                onerror: function () { resolve(null); }
            });
        });
    }

    async function downloadWhenReady(taskId, maxAttempts, intervalMs) {
        const attempts = maxAttempts || 30;
        const step = intervalMs || 3000;
        for (let i = 1; i <= attempts; i++) {
            const blob = await tryDownload(taskId);
            if (blob) return blob;
            await sleep(step);
        }
        throw new Error('File not ready after multiple attempts.');
    }

    async function blobToBase64(blob) {
        const buf = await blob.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(buf);
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }

    async function uploadToDriveViaGAS(fileBlob, filename) {
        const safeMime = 'text/csv';
        const safeName = sanitizeBaseName(filename);
        const base64 = await blobToBase64(fileBlob);

        const payload = {
            folderId: SETTINGS.driveFolderId,
            filename: safeName,
            mimeType: safeMime,
            base64: base64
        };

        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'POST',
                url: SETTINGS.gasUploadUrl,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(payload),
                onload: function (res) {
                    const text = res.responseText || '';
                    try {
                        const j = JSON.parse(text);
                        if (j.ok) {
                            resolve(j);
                        } else {
                            reject(new Error(j.error || 'GAS upload failed'));
                        }
                    } catch (e) {
                        reject(new Error('GAS returned non-JSON.'));
                    }
                },
                onerror: function (e) {
                    reject(e);
                }
            });
        });
    }

    async function runExportFlow(outputArea, saveButton) {
        if (!lastStartISO || !lastEndISO) {
            alert('Generate the report first before exporting.');
            return;
        }
        if (!SETTINGS.gasUploadUrl || !SETTINGS.driveFolderId || !SETTINGS.gsheetUrl) {
            alert('Please configure WEBAPP URL, DRIVE FOLDER ID, and GSHEET URL in Settings (⚙️) first.');
            return;
        }

        try {
            if (saveButton) {
                saveButton.textContent = 'PUSHING DATA…';
                saveButton.disabled = true;
                saveButton.style.backgroundColor = '#cccccc';
            }

            setLogText(outputArea, [
                'Preparing export to Drive…'
            ]);

            const username = await fetchShopeeUsername();
            const result = await triggerExport(lastStartISO, lastEndISO);
            const taskId = result.taskId;

            const blob = await downloadWhenReady(taskId, 30, 3000);
            const rawName = formatFilename(username, lastStartISO, lastEndISO, blob.__extHint);
            await uploadToDriveViaGAS(blob, rawName);

            setLogText(outputArea, [
                'Uploaded to Drive ✓',
                'See Report Now'
            ], SETTINGS.gsheetUrl);

            if (saveButton) {
                saveButton.style.display = 'none';
            }

        } catch (err) {
            console.error('Export error:', err);
            setLogText(outputArea, [
                'Error during export.',
                (err && err.message) ? err.message : String(err)
            ]);

            if (saveButton) {
                saveButton.textContent = 'SAVE TO GSHEETS';
                saveButton.disabled = false;
                saveButton.style.backgroundColor = '#4CAF50';
            }
        }
    }

    // ====== POPUP GUI (FULLSCREENISH MODAL) ======

    function createModalAndLauncher() {
        const launcher = document.createElement('button');
        launcher.textContent = '📊';
        launcher.title = 'Generate Shopee Report';
        launcher.style.position = 'fixed';
        launcher.style.right = '10px';
        launcher.style.bottom = '10px';
        launcher.style.width = '44px';
        launcher.style.height = '44px';
        launcher.style.borderRadius = '22px';
        launcher.style.border = 'none';
        launcher.style.backgroundColor = '#1976d2';
        launcher.style.color = '#fff';
        launcher.style.fontSize = '22px';
        launcher.style.cursor = 'pointer';
        launcher.style.zIndex = '99998';
        launcher.style.boxShadow = '0 4px 10px rgba(0,0,0,0.25)';

        document.body.appendChild(launcher);

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.35)';
        overlay.style.display = 'none';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '99999';

        const modal = document.createElement('div');
        modal.style.backgroundColor = '#fff';
        modal.style.borderRadius = '10px';
        modal.style.width = '95%';
        modal.style.maxWidth = '420px';
        modal.style.maxHeight = '90vh';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        modal.style.overflow = 'hidden';
        modal.style.fontFamily = 'Arial, sans-serif';
        modal.style.fontSize = '12px';

        const headerRow = document.createElement('div');
        headerRow.style.display = 'flex';
        headerRow.style.alignItems = 'center';
        headerRow.style.justifyContent = 'space-between';
        headerRow.style.padding = '6px 10px';
        headerRow.style.borderBottom = "1px solid #eee";
        headerRow.style.backgroundColor = '#fafafa';

        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '⚙️';
        settingsBtn.title = 'Settings';
        settingsBtn.style.border = 'none';
        settingsBtn.style.background = 'transparent';
        settingsBtn.style.cursor = 'pointer';
        settingsBtn.style.fontSize = '16px';

        const headerTitle = document.createElement('div');
        headerTitle.textContent = 'SP TABLE REPORT';
        headerTitle.style.fontWeight = 'bold';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '🙈';
        closeBtn.title = 'Close';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'transparent';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '16px';

        headerRow.appendChild(settingsBtn);
        headerRow.appendChild(headerTitle);
        headerRow.appendChild(closeBtn);
        modal.appendChild(headerRow);

        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.padding = '8px 10px';
        content.style.overflow = 'hidden';
        modal.appendChild(content);

        const settingsPanel = document.createElement('div');
        settingsPanel.style.position = 'absolute';
        settingsPanel.style.left = '50%';
        settingsPanel.style.top = '50%';
        settingsPanel.style.transform = 'translate(-50%, -50%)';
        settingsPanel.style.backgroundColor = '#ffffff';
        settingsPanel.style.border = '1px solid #ddd';
        settingsPanel.style.borderRadius = '8px';
        settingsPanel.style.padding = '10px';
        settingsPanel.style.width = '90%';
        settingsPanel.style.maxWidth = '420px';
        settingsPanel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        settingsPanel.style.zIndex = '100000';
        settingsPanel.style.display = 'none';
        settingsPanel.style.fontSize = '12px';

        const settingsTitle = document.createElement('div');
        settingsTitle.textContent = 'Settings';
        settingsTitle.style.fontWeight = 'bold';
        settingsTitle.style.marginBottom = '6px';
        settingsPanel.appendChild(settingsTitle);

        function makeField(label, value) {
            const wrap = document.createElement('div');
            wrap.style.marginBottom = '6px';
            const lbl = document.createElement('div');
            lbl.textContent = label;
            lbl.style.fontSize = '11px';
            lbl.style.marginBottom = '2px';
            const input = document.createElement('input');
            input.type = 'text';
            input.value = value || '';
            input.style.width = '100%';
            input.style.padding = '4px';
            input.style.fontSize = '12px';
            input.style.boxSizing = 'border-box';
            wrap.appendChild(lbl);
            wrap.appendChild(input);
            return { wrap: wrap, input: input };
        }

        const webappField = makeField('WEBAPP URL (GAS /exec)', SETTINGS.gasUploadUrl);
        const folderField = makeField('DRIVE FOLDER ID', SETTINGS.driveFolderId);
        const sheetField = makeField('GSHEET URL (See Report Now)', SETTINGS.gsheetUrl);

        settingsPanel.appendChild(webappField.wrap);
        settingsPanel.appendChild(folderField.wrap);
        settingsPanel.appendChild(sheetField.wrap);

        const settingsBtnsRow = document.createElement('div');
        settingsBtnsRow.style.display = 'flex';
        settingsBtnsRow.style.justifyContent = 'flex-end';
        settingsBtnsRow.style.marginTop = '8px';

        const settingsSave = document.createElement('button');
        settingsSave.textContent = 'Save';
        settingsSave.style.marginRight = '6px';
        settingsSave.style.padding = '4px 8px';
        settingsSave.style.border = 'none';
        settingsSave.style.borderRadius = '4px';
        settingsSave.style.backgroundColor = '#4CAF50';
        settingsSave.style.color = '#fff';
        settingsSave.style.cursor = 'pointer';

        const settingsClose = document.createElement('button');
        settingsClose.textContent = 'Close';
        settingsClose.style.padding = '4px 8px';
        settingsClose.style.border = '1px solid #ccc';
        settingsClose.style.borderRadius = '4px';
        settingsClose.style.backgroundColor = '#f5f5f5';
        settingsClose.style.cursor = 'pointer';

        settingsBtnsRow.appendChild(settingsSave);
        settingsBtnsRow.appendChild(settingsClose);
        settingsPanel.appendChild(settingsBtnsRow);

        modal.appendChild(settingsPanel);

        const dateLabel = document.createElement('div');
        dateLabel.textContent = 'SELECT DATE/s:';
        dateLabel.style.fontWeight = 'bold';
        dateLabel.style.marginBottom = '4px';
        content.appendChild(dateLabel);

        const dateRow = document.createElement('div');
        dateRow.style.display = 'flex';
        dateRow.style.gap = '4px';
        dateRow.style.marginBottom = '6px';

        const yesterday = getYesterdayDate();

        const startDateInput = document.createElement('input');
        startDateInput.type = 'date';
        startDateInput.value = yesterday;
        startDateInput.style.flex = '1';
        startDateInput.style.padding = '4px';

        const endDateInput = document.createElement('input');
        endDateInput.type = 'date';
        endDateInput.value = yesterday;
        endDateInput.style.flex = '1';
        endDateInput.style.padding = '4px';

        dateRow.appendChild(startDateInput);
        dateRow.appendChild(endDateInput);
        content.appendChild(dateRow);

        const generateButton = document.createElement('button');
        generateButton.innerText = 'Generate Report';
        generateButton.style.display = 'block';
        generateButton.style.marginBottom = '6px';
        generateButton.style.width = '100%';
        generateButton.style.padding = '8px';
        generateButton.style.backgroundColor = '#2196F3';
        generateButton.style.color = '#fff';
        generateButton.style.border = 'none';
        generateButton.style.borderRadius = '4px';
        generateButton.style.cursor = 'pointer';
        content.appendChild(generateButton);

        summaryTitle = document.createElement('div');
        summaryTitle.style.marginTop = '4px';
        summaryTitle.style.fontWeight = 'bold';
        summaryTitle.style.fontSize = '11px';
        summaryTitle.style.display = 'none';
        content.appendChild(summaryTitle);

        summaryContainer = document.createElement('div');
        summaryContainer.style.display = 'none';
        summaryContainer.style.marginTop = '4px';
        summaryContainer.style.flex = '1';
        summaryContainer.style.maxHeight = '40vh';
        summaryContainer.style.overflowY = 'auto';
        summaryContainer.style.border = '1px solid #ddd';
        summaryContainer.style.borderRadius = '5px';
        summaryContainer.style.backgroundColor = '#fff';
        content.appendChild(summaryContainer);

        const logLabel = document.createElement('div');
        logLabel.textContent = 'LOG:';
        logLabel.style.marginTop = '6px';
        logLabel.style.fontWeight = 'bold';
        content.appendChild(logLabel);

        const outputArea = document.createElement('div');
        outputArea.style.marginTop = '2px';
        outputArea.style.padding = '6px';
        outputArea.style.border = '1px solid #ddd';
        outputArea.style.borderRadius = '5px';
        outputArea.style.backgroundColor = '#f9f9f9';
        outputArea.style.wordWrap = 'break-word';
        outputArea.style.maxHeight = '80px';
        outputArea.style.overflowY = 'auto';
        outputArea.style.whiteSpace = 'pre-line';
        outputArea.innerText = '';
        content.appendChild(outputArea);

        const saveButton = document.createElement('button');
        saveButton.id = 'saveToGSheetsButton';
        saveButton.textContent = 'SAVE TO GSHEETS';
        saveButton.style.marginTop = '8px';
        saveButton.style.marginBottom = '4px';
        saveButton.style.width = '100%';
        saveButton.style.padding = '10px';
        saveButton.style.backgroundColor = '#cccccc';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.disabled = true;
        content.appendChild(saveButton);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        launcher.addEventListener('click', function () {
            overlay.style.display = 'flex';
        });

        closeBtn.addEventListener('click', function () {
            overlay.style.display = 'none';
        });

        settingsBtn.addEventListener('click', function () {
            webappField.input.value = SETTINGS.gasUploadUrl || '';
            folderField.input.value = SETTINGS.driveFolderId || '';
            sheetField.input.value = SETTINGS.gsheetUrl || '';
            settingsPanel.style.display = 'block';
        });

        settingsClose.addEventListener('click', function () {
            settingsPanel.style.display = 'none';
        });

        settingsSave.addEventListener('click', function () {
            SETTINGS.gasUploadUrl = webappField.input.value.trim();
            SETTINGS.driveFolderId = folderField.input.value.trim();
            SETTINGS.gsheetUrl = sheetField.input.value.trim();
            saveSettings(SETTINGS);
            settingsPanel.style.display = 'none';
        });

        generateButton.onclick = function () {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;

            clearSummaryTable();

            saveButton.style.display = 'block';
            saveButton.textContent = 'SAVE TO GSHEETS';
            saveButton.disabled = true;
            saveButton.style.backgroundColor = '#cccccc';
            updateSaveButtonStatus();

            if (startDate && endDate) {
                lastStartISO = startDate;
                lastEndISO = endDate;

                const purchase_time_s = getUnixTimestampStart(startDate);
                const purchase_time_e = getUnixTimestampEnd(endDate);

                const convUrl =
                    'https://affiliate.shopee.ph/api/v3/report/list?page_size=20&page_num=1' +
                    '&purchase_time_s=' + purchase_time_s +
                    '&purchase_time_e=' + purchase_time_e +
                    '&version=1';

                const clickUrl =
                    'https://affiliate.shopee.ph/api/v1/click_report/list?' +
                    'click_time_s=' + purchase_time_s +
                    '&click_time_e=' + purchase_time_e +
                    '&page_num=1&page_size=20';

                console.log('Generated CONVERSION Report URL (backend):', convUrl);
                console.log('Generated CLICK Report URL (backend):', clickUrl);

                setLogText(outputArea, [
                    'Start Date: ' + startDate,
                    'End Date: ' + endDate,
                    'Requesting Conv + Click total_count...'
                ]);

                capturedData = null;
                capturedDataClick = [];
                clickMap = {};
                convPerSubMap = {};
                ordersPerSubMap = {};
                summaryRows = [];

                convReady = false;
                clicksReady = false;
                currentLogArea = outputArea;

                // also reset SAME-DAY vs 7-DAY (extra safety)
                sameDayOrders = [];
                sevenDayOrders = [];
                sameDayTotalCommission = 0;
                sevenDayTotalCommission = 0;
                sameDayCount = 0;
                sevenDayCount = 0;

                fetchTotalCount(convUrl, outputArea);
                fetchTotalCountClick(clickUrl, outputArea);
            } else {
                setLogText(outputArea, ['Please select both START and END dates.']);
            }
        };

        saveButton.onclick = function () {
            runExportFlow(outputArea, saveButton);
        };
    }

    // ====== BUTTON / SAVE STATE ======

    function updateSaveButtonStatus() {
        const button = document.getElementById('saveToGSheetsButton');
        if (!button) return;
        const enabled = !!(summaryRows && summaryRows.length > 0);
        button.disabled = !enabled;
        button.style.backgroundColor = enabled ? '#4CAF50' : '#cccccc';
    }

    // ====== INIT ======

    if (document.readyState === 'loading') {
        window.addEventListener('load', createModalAndLauncher);
    } else {
        createModalAndLauncher();
    }

})();
