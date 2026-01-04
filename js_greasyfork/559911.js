// ==UserScript==
// @name         Auctions Definitive Tool
// @namespace    MoonLord
// @version      1.0
// @description  Compare prices with ItemDB, generate countdowns on each item, and automatically open a tab when there are 2:00 minutes left to use Auto-Bidder.
// @icon         https://pixsector.com/cache/afa23d3a/av1c12f667576e96088e6.png
// @match        https://www.neopets.com/auctions.phtml*
// @match        https://www.neopets.com/genie.phtml*
// @grant        GM_xmlhttpRequest
// @connect      itemdb.com.br
// @downloadURL https://update.greasyfork.org/scripts/559911/Auctions%20Definitive%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/559911/Auctions%20Definitive%20Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(location.href);

    /* ======================
       ROUTER
    ====================== */

    if (url.pathname === '/auctions.phtml' && url.searchParams.get('type') === 'bids') {
        runBids();
    } else if (url.pathname === '/auctions.phtml' && url.searchParams.get('type') === 'leading') {
        runLeadingAuctions();
    } else if (url.pathname === '/auctions.phtml' && !url.searchParams.has('type')) {
        runAuctionsList();
    } else if (url.pathname === '/genie.phtml') {
        runGenie();
    }

    /* ============================================================
       1) AUCTIONS LIST (ORIGINAL – NO TOCAR)
    ============================================================ */

    function runAuctionsList() {
        let table = null;

        document.querySelectorAll('b').forEach(b => {
            if (b.textContent.includes('Current Price')) {
                table = b.closest('table');
            }
        });

        if (!table) return;

        const headerRow = table.querySelector('tr');
        if (![...headerRow.children].some(td => td.textContent.includes('DB Value'))) {
            const td = document.createElement('td');
            td.innerHTML = '<b>DB Value</b>';
            td.align = 'center';
            td.bgColor = '#dddd77';
            headerRow.appendChild(td);
        }

        const rows = Array.from(table.querySelectorAll('tr')).slice(1);
        const names = [];

        rows.forEach(r => {
            const name = r.children[2]?.textContent.trim();
            if (name) names.push(name);
        });

        if (!names.length) return;

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://itemdb.com.br/api/v1/items/many',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ name: names }),
            onload: res => {
                if (res.status !== 200) return;
                const data = JSON.parse(res.responseText);

                rows.forEach(row => {
                    const name = row.children[2]?.textContent.trim();
                    const currentPrice = parseInt(
                        row.children[6]?.textContent.replace(/,/g, ''),
                        10
                    ) || 0;

                    const cell = document.createElement('td');
                    cell.align = 'center';
                    cell.bgColor = '#d3d3d3';
                    cell.textContent = 'NO DATA';

                    const item = data[name];
                    if (item?.price?.value) {
                        const value = item.price.value;
                        cell.textContent = value.toLocaleString();
                        cell.bgColor = value >= currentPrice ? '#90ee90' : '#fc9aaa';
                    }

                    row.appendChild(cell);
                });
            }
        });
    }

    /* ============================================================
       2) GENIE (ORIGINAL)
    ============================================================ */

    function runGenie() {
        const observer = new MutationObserver(() => {
            const tables = document.querySelectorAll('table');
            let table = null;

            tables.forEach(t => {
                if (t.querySelector('a[href*="auction_id="]')) {
                    table = t;
                }
            });

            if (!table || table.dataset.dbvalue) return;
            table.dataset.dbvalue = '1';

            const headerRow = table.querySelector('tr');
            const headerCell = document.createElement('td');
            headerCell.innerHTML = '<b>DB Value</b>';
            headerCell.align = 'center';
            headerCell.bgColor = '#dddd77';
            headerRow.appendChild(headerCell);

            const rows = Array.from(table.querySelectorAll('tr')).slice(1);
            const names = [];

            rows.forEach(r => {
                const name = r.children[2]?.textContent.trim();
                if (name) names.push(name);
            });

            if (!names.length) return;

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://itemdb.com.br/api/v1/items/many',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ name: names }),
                onload: res => {
                    if (res.status !== 200) return;
                    const data = JSON.parse(res.responseText);

                    rows.forEach(row => {
                        const name = row.children[2]?.textContent.trim();
                        const currentPrice = parseInt(
                            row.children[6]?.textContent.replace(/,/g, ''),
                            10
                        ) || 0;

                        const cell = document.createElement('td');
                        cell.align = 'center';
                        cell.bgColor = '#d3d3d3';
                        cell.textContent = 'NO DATA';

                        const item = data[name];
                        if (item?.price?.value) {
                            const value = item.price.value;
                            cell.textContent = value.toLocaleString();
                            cell.bgColor = value >= currentPrice ? '#90ee90' : '#fc9aaa';
                        }

                        row.appendChild(cell);
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ============================================================
       3) LEADING AUCTIONS (ORIGINAL – SIN CAMBIOS)
    ============================================================ */

    function runLeadingAuctions() {
        /* ================= SETTINGS ================= */

        const SETTINGS_KEY = 'neopets_auction_settings';
        const settings = Object.assign({
            autoRefresh: false,
            refreshSeconds: 30,
            soundOn30: true,
            openAt2: true
        }, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));

        function saveSettings() {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        }

        /* ================= SOUND (BUILT-IN) ================= */

        function playSound() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

                gain.gain.setValueAtTime(0.0001, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                osc.stop(ctx.currentTime + 0.6);

                osc.onended = () => ctx.close();
            } catch (e) {}
        }

        /* ================= UI ================= */

        function createUI() {
            const btn = document.createElement('img');
            btn.src = 'https://cdn-icons-png.flaticon.com/512/204/204180.png';
            btn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                cursor: pointer;
                z-index: 9999;
                border-radius: 50%;
                box-shadow: 0 6px 16px rgba(0,0,0,.25);
            `;
            document.body.appendChild(btn);

            const panel = document.createElement('div');
            panel.style.cssText = `
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 270px;
                background: #fdf4ff;
                border-radius: 18px;
                box-shadow: 0 10px 28px rgba(0,0,0,.25);
                padding: 14px;
                font-family: Arial, sans-serif;
                font-size: 13px;
                transform: scale(0.9);
                opacity: 0;
                pointer-events: none;
                transition: all .25s ease;
                z-index: 9999;
            `;

            panel.innerHTML = `
                <b style="color:#a855f7;">Auction Tools</b><br><br>

                <label><input type="checkbox" id="ar"> Auto-refresh</label><br>
                Refresh every <input type="number" id="rs" min="5" style="width:55px"> sec<br><br>

                <label><input type="checkbox" id="s30"> Sound on &lt; 30 min</label><br>
                <label><input type="checkbox" id="o2"> Open tab at 2:00</label><br><br>

                <button id="saveBtn" style="
                    width:100%;
                    padding:8px;
                    border:none;
                    border-radius:12px;
                    background:#c084fc;
                    color:white;
                    font-weight:bold;
                    cursor:pointer;
                    box-shadow:0 4px 10px rgba(0,0,0,.2);
                ">SAVE</button>
            `;
            document.body.appendChild(panel);

            let open = false;
            btn.onclick = () => {
                open = !open;
                panel.style.opacity = open ? '1' : '0';
                panel.style.transform = open ? 'scale(1)' : 'scale(0.9)';
                panel.style.pointerEvents = open ? 'auto' : 'none';
            };

            panel.querySelector('#ar').checked = settings.autoRefresh;
            panel.querySelector('#rs').value = settings.refreshSeconds;
            panel.querySelector('#s30').checked = settings.soundOn30;
            panel.querySelector('#o2').checked = settings.openAt2;

            panel.querySelector('#saveBtn').onclick = () => {
                settings.autoRefresh = panel.querySelector('#ar').checked;
                settings.refreshSeconds = +panel.querySelector('#rs').value || 30;
                settings.soundOn30 = panel.querySelector('#s30').checked;
                settings.openAt2 = panel.querySelector('#o2').checked;
                saveSettings();
                location.reload();
            };
        }

        /* ================= AUTO REFRESH ================= */

        if (settings.autoRefresh) {
            setTimeout(() => location.reload(), settings.refreshSeconds * 1000);
        }

        /* ================= CORE LOGIC ================= */

        const COUNTDOWN_MS = 30 * 60 * 1000;
        const OPEN_AT_MS = 2 * 60 * 1000;

        function getAuctionId(row) {
            return row.querySelector('a[href*="auction_id="]')?.href.match(/auction_id=(\d+)/)?.[1];
        }

        function getTimeText(row) {
            return row.children[4]?.textContent.trim() || '';
        }

        function getAuctionLink(row) {
            return row.querySelector('a[href*="auction_id="]')?.href;
        }

        function findTable() {
            let table = null;
            document.querySelectorAll('tr').forEach(tr => {
                if (tr.textContent.includes('Lot No.') && tr.textContent.includes('Item') && tr.textContent.includes('Last Bid')) {
                    table = tr.closest('table');
                }
            });
            return table;
        }

        function runAuctionsList() {
            const table = findTable();
            if (!table) return;

            const headerRow = table.querySelector('tr');

            if (![...headerRow.children].some(td => td.textContent.includes('DB Value'))) {
                const td = document.createElement('td');
                td.innerHTML = '<b>DB Value</b>';
                td.align = 'center';
                td.bgColor = '#dddd77';
                headerRow.appendChild(td);
            }

            if (![...headerRow.children].some(td => td.textContent.includes('Countdown'))) {
                const td = document.createElement('td');
                td.innerHTML = '<b>Countdown</b>';
                td.align = 'center';
                td.bgColor = '#dddd77';
                headerRow.appendChild(td);
            }

            const rows = Array.from(table.querySelectorAll('tr')).slice(1);
            const names = [];

            rows.forEach(row => {
                const name = row.children[2]?.textContent.trim();
                if (name) names.push(name);

                const dbCell = document.createElement('td');
                dbCell.align = 'center';
                dbCell.bgColor = '#d3d3d3';
                dbCell.textContent = '...';
                row.appendChild(dbCell);

                const cdCell = document.createElement('td');
                cdCell.align = 'center';
                cdCell.textContent = '-';
                row.appendChild(cdCell);

                row._dbCell = dbCell;
                row._cdCell = cdCell;
            });

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://itemdb.com.br/api/v1/items/many',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ name: names }),
                onload: res => {
                    if (res.status !== 200) return;
                    const data = JSON.parse(res.responseText);

                    rows.forEach(row => {
                        const name = row.children[2]?.textContent.trim();
                        const lastBid = parseInt(row.children[5]?.textContent.replace(/,/g, ''), 10) || 0;
                        const cell = row._dbCell;

                        const item = data[name];
                        if (item?.price?.value) {
                            const value = item.price.value;
                            cell.textContent = value.toLocaleString();
                            cell.bgColor = value >= lastBid ? '#90ee90' : '#fc9aaa';
                            cell.title = `Profit: ${(value - lastBid).toLocaleString()} NP`;
                        } else {
                            cell.textContent = 'NO DATA';
                        }
                    });
                }
            });

            rows.forEach(row => {
                const auctionId = getAuctionId(row);
                const timeText = getTimeText(row);
                const link = getAuctionLink(row);
                const cell = row._cdCell;

                if (!auctionId) return;

                const stateKey = `auction_state_${auctionId}`;
                const prevState = localStorage.getItem(stateKey);

                let currentState = 'other';
                if (timeText.includes('30 min-2 hours')) currentState = 'mid';
                if (timeText.includes('< 30 min')) currentState = 'short';

                localStorage.setItem(stateKey, currentState);

                if (!(prevState === 'mid' && currentState === 'short')) return;

                const cdKey = `auction_countdown_${auctionId}`;
                let data = JSON.parse(localStorage.getItem(cdKey));

                if (!data) {
                    data = { startTime: Date.now(), opened: false };
                    localStorage.setItem(cdKey, JSON.stringify(data));
                    if (settings.soundOn30) playSound();
                }

                function update() {
                    const remaining = COUNTDOWN_MS - (Date.now() - data.startTime);
                    if (remaining <= 0) {
                        cell.textContent = 'Closed';
                        return;
                    }

                    const m = Math.floor(remaining / 60000);
                    const s = Math.floor((remaining % 60000) / 1000);
                    cell.textContent = `${m}:${s.toString().padStart(2, '0')}`;

                    if (remaining <= OPEN_AT_MS && !data.opened && settings.openAt2 && link) {
                        window.open(link, '_blank');
                        data.opened = true;
                        localStorage.setItem(cdKey, JSON.stringify(data));
                    }
                }

                update();
                setInterval(update, 1000);
            });
        }

        window.addEventListener('load', () => {
            createUI();
            setTimeout(runAuctionsList, 300);
        });

    }

    /* ======================
   4) BIDS – AUTOBID + UI
====================== */

function runBids() {

    const auctionId = url.searchParams.get('auction_id');
    if (!auctionId) return;

    const STATE_KEY = `autobid_enabled_${auctionId}`;

    // ===== DEFAULT: START =====
    if (sessionStorage.getItem(STATE_KEY) === null) {
        sessionStorage.setItem(STATE_KEY, '1');
    }

    let enabled = sessionStorage.getItem(STATE_KEY) === '1';

    /* ======================
       UI START / STOP
    ====================== */

    const btn = document.createElement('div');
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #c084fc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        font-weight: bold;
        font-size: 14px;
        color: white;
        cursor: pointer;
        user-select: none;
        z-index: 9999;
        box-shadow: 0 8px 18px rgba(0,0,0,.3);
        transition: transform .15s ease, opacity .15s ease;
    `;

    function updateBtn() {
        btn.textContent = enabled ? 'STOP' : 'START';
        btn.style.opacity = enabled ? '1' : '0.75';
    }

    btn.onclick = () => {
        enabled = !enabled;
        sessionStorage.setItem(STATE_KEY, enabled ? '1' : '0');
        updateBtn();
    };

    btn.onmouseenter = () => btn.style.transform = 'scale(1.08)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';

    updateBtn();
    document.body.appendChild(btn);

    /* ======================
       SETTINGS
    ====================== */

    const maxBid = 100000;
    const minRef = 222;
    const maxRef = 223;

    function getBetween(str, start, end, pos = 0) {
        const i1 = str.indexOf(start, pos);
        const i2 = str.indexOf(end, i1 + start.length);
        return (i1 > -1 && i2 > i1)
            ? str.substring(i1 + start.length, i2)
            : '';
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const html = document.body.innerHTML;

    /* ======================
       CLOSED SOUND (ONCE)
    ====================== */

    if (
        html.includes("Time Left in Auction") &&
        html.includes("Closed") &&
        !sessionStorage.getItem(`closed_sound_${auctionId}`)
    ) {
        sessionStorage.setItem(`closed_sound_${auctionId}`, '1');
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = 880;
            gain.gain.value = 0.08;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        } catch {}
    }

    /* ======================
       AUTOBID CORE
    ====================== */

    if (!enabled) return;

    if (html.includes("Time Left in Auction")) {

        const lastBidder = getBetween(
            html,
            "randomfriend.phtml?user=",
            "\">",
            html.indexOf("Welcome, <a href=") + 50
        );

        const currentUser = getBetween(
            html,
            "/userlookup.phtml?user=",
            "\">"
        );

        let newBid = getBetween(
            html,
            "<input name=\"amount\" value=\"",
            "\">"
        );

        newBid = parseInt(newBid.replace(/"/g, ''), 10);

        if (
            (html.includes("No bids have been placed") || lastBidder !== currentUser) &&
            newBid <= maxBid
        ) {
            document.forms[1]?.submit();
        } else {
            setTimeout(() => location.reload(), random(minRef, maxRef));
        }

    } else if (
        html.includes("BID SUCCESSFUL") ||
        html.includes("view the updated list") ||
        html.includes("you are not allowed to bid on an auction") ||
        html.includes("ERROR :")
    ) {
        history.go(-1);
    }
}


})();
