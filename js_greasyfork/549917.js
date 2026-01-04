// ==UserScript==
// @name         CF4VN - Mini Bầu Cua
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mini game "Bầu Cua" dạng vũ khí cho cf4vn.com
// @author       ChatGPT
// @match        https://cf4vn.com/*
// @icon         https://cf4vn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549917/CF4VN%20-%20Mini%20B%E1%BA%A7u%20Cua.user.js
// @updateURL https://update.greasyfork.org/scripts/549917/CF4VN%20-%20Mini%20B%E1%BA%A7u%20Cua.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- Cấu hình item (6 loại) ---------- */
    const ITEMS = [
        { id: 'm4', name: 'M4 Commando', img: 'https://cf4vn.com/images/items/ItemIcon_1158.png' },
        { id: 'ak', name: 'AK-47- Scope Red Dragon', img: 'https://cf4vn.com/images/items/ItemIcon_547.png' },
        { id: 'barret', name: 'Barret M99 Ancient Dragon', img: 'https://cf4vn.com/images/items/ItemIcon_1120.png' },
        { id: 'kac', name: 'KAC Chainsaw', img: 'https://cf4vn.com/images/items/ItemIcon_1021.png' },
        { id: 'shovel', name: 'Shovel Red Dragon', img: 'https://cf4vn.com/images/items/ItemIcon_583.png' },
        { id: 'kukri', name: 'Kukri Gold', img: 'https://cf4vn.com/images/items/ItemIcon_753.png' },
    ];

    /* ---------- Storage keys ---------- */
    const STORAGE_BALANCE_KEY = 'cf4vn_minigame_balance_v1';

    /* ---------- Mặc định ---------- */
    const DEFAULT_BALANCE = 999999;

    /* ---------- Utility ---------- */
    function $(sel, root = document) { return root.querySelector(sel); }
    function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
    function moneyFormat(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

    /* ---------- Lấy username từ trang (theo mẫu user-info-bar) ---------- */
    function getUsername() {
        try {
            const el = document.querySelector('.user-info-bar .user-stat.stat-nick .value');
            if (el) return el.textContent.trim();
        } catch (e) { /* ignore */ }
        // fallback
        return 'Khách';
    }

    /* ---------- Balance (persist vào localStorage) ---------- */
    function loadBalance() {
        const v = localStorage.getItem(STORAGE_BALANCE_KEY);
        if (!v) {
            localStorage.setItem(STORAGE_BALANCE_KEY, String(DEFAULT_BALANCE));
            return DEFAULT_BALANCE;
        }
        const n = parseInt(v, 10);
        return isNaN(n) ? DEFAULT_BALANCE : n;
    }
    function saveBalance(n) {
        localStorage.setItem(STORAGE_BALANCE_KEY, String(n));
    }

    /* ---------- Tạo UI ---------- */
    function createUI() {
        // tránh chèn nhiều lần
        if (document.getElementById('cf4vn-minigame-root')) return;

        const root = document.createElement('div');
        root.id = 'cf4vn-minigame-root';
        root.style.cssText = `
            position: fixed;
            right: 12px;
            bottom: 12px;
            width: 360px;
            z-index: 999999;
            font-family: Arial, Helvetica, sans-serif;
            user-select: none;
        `;
        root.innerHTML = `
            <div id="minigame-card" style="background:rgba(0,0,0,0.85); color:#fff; border-radius:12px; padding:12px; box-shadow:0 8px 24px rgba(0,0,0,0.6);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <div style="font-weight:700;">Sàn cược CF4VN</div>
                    <div style="font-size:12px;opacity:0.85;">Huyền Cốt Lão Nhân</div>
                </div>

                <div id="mg-welcome" style="font-size:13px;margin-bottom:8px;"></div>

                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                    <label style="font-size:12px;">Mức cược:</label>
                    <select id="mg-bet-select" style="flex:1;padding:6px;border-radius:6px;border:1px solid #333;background:#111;color:#fff;">
                        <option value="100">100</option>
                        <option value="1000">1.000</option>
                        <option value="10000">10.000</option>
                    </select>
                    <button id="mg-reset-bets" style="padding:6px 8px;border-radius:6px;border:none;background:#b02a2a;color:#fff;cursor:pointer;">Reset</button>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <div style="font-size:12px;">Số dư: <span id="mg-balance" style="font-weight:700;"></span> VCoin</div>
                    <div style="font-size:12px;">Kèo: <span id="mg-total-bet" style="font-weight:700;">0</span> VCoin</div>
                </div>

                <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
                    <div style="flex:1;text-align:center;font-size:12px;color:#ddd;">Kết quả</div>
                </div>

                <div id="mg-results" style="display:flex;justify-content:space-between;gap:8px;margin-bottom:10px;">
                    <div class="mg-res-slot" data-slot="0" style="flex:1;height:68px;border-radius:8px;background:#111;display:flex;align-items:center;justify-content:center;border:1px solid #222;"></div>
                    <div class="mg-res-slot" data-slot="1" style="flex:1;height:68px;border-radius:8px;background:#111;display:flex;align-items:center;justify-content:center;border:1px solid #222;"></div>
                    <div class="mg-res-slot" data-slot="2" style="flex:1;height:68px;border-radius:8px;background:#111;display:flex;align-items:center;justify-content:center;border:1px solid #222;"></div>
                </div>

                <div style="margin-bottom:8px;">
                    <div style="font-size:12px;margin-bottom:6px;">Đặt cược (click để chọn / click lại để huỷ)</div>
                    <div id="mg-bet-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;"></div>
                </div>

                <div style="display:flex;gap:8px;justify-content:space-between;align-items:center;">
                    <button id="mg-start" style="flex:1;padding:8px;border-radius:8px;background:#1f8a1f;border:none;color:#fff;font-weight:700;cursor:pointer;">Start</button>
                    <div style="width:8px;"></div>
                    <div style="width:110px;text-align:right;">
                        <div style="font-size:12px;color:#bbb;">Lãi/lỗ vòng này</div>
                        <div id="mg-round-result" style="font-weight:700;">0</div>
                    </div>
                </div>

                <div id="mg-log" style="margin-top:8px;font-size:12px;color:#ccc;height:68px;overflow:auto;padding:6px;background:rgba(255,255,255,0.02);border-radius:6px;"></div>
            </div>
        `;
        document.body.appendChild(root);

        // Render bet grid (6 items)
        const grid = document.getElementById('mg-bet-grid');
        ITEMS.forEach(it => {
            const card = document.createElement('div');
            card.className = 'mg-bet-item';
            card.dataset.itemId = it.id;
            card.style.cssText = `
                background:#0f0f0f;
                border-radius:8px;
                padding:8px;
                height:86px;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                border:1px solid #222;
                cursor:pointer;
                position:relative;
            `;
            card.innerHTML = `
                <img src="${it.img}" alt="${it.name}" title="${it.name}" style="width:52px;height:52px;object-fit:contain;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.6));"/>
                <div style="font-size:11px;margin-top:6px;text-align:center;">${it.name.split(' ').slice(0,2).join(' ')}...</div>
                <div class="mg-bet-overlay" style="position:absolute;left:6px;top:6px;background:rgba(0,0,0,0.6);padding:2px 6px;border-radius:6px;font-size:12px;display:none;">0</div>
            `;
            grid.appendChild(card);
        });

        // initial bindings
        bindUI();
        refreshUI();
    }

    /* ---------- State ---------- */
    let selectedBets = {}; // key: itemId -> betAmount (number)
    let balance = loadBalance();

    /* ---------- UI binding + handlers ---------- */
    function bindUI() {
        const username = getUsername();
        $('#mg-welcome').textContent = `Chào mừng ${username} đã đến với sàn cược CF4VN!`;

        $('#mg-bet-select').addEventListener('change', () => {
            // nothing immediate
        });

        $('#mg-reset-bets').addEventListener('click', () => {
            selectedBets = {};
            updateBetOverlays();
            refreshTotals();
            log('Đã xóa cược.');
        });

        // attach click selection to each bet item
        $all('.mg-bet-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.itemId;
                const betAmt = parseInt($('#mg-bet-select').value, 10);
                if (selectedBets[id]) {
                    // toggle off
                    delete selectedBets[id];
                    log(`Bỏ cược ${id}.`);
                } else {
                    selectedBets[id] = betAmt;
                    log(`Đặt ${moneyFormat(betAmt)} VCoin vào ${id}.`);
                }
                updateBetOverlays();
                refreshTotals();
            });
        });

        $('#mg-start').addEventListener('click', async () => {
            await startRound();
        });
    }

    function updateBetOverlays() {
        $all('.mg-bet-item').forEach(el => {
            const id = el.dataset.itemId;
            const ov = el.querySelector('.mg-bet-overlay');
            if (selectedBets[id]) {
                ov.style.display = 'block';
                ov.textContent = moneyFormat(selectedBets[id]);
                el.style.boxShadow = '0 6px 16px rgba(0,200,100,0.12)';
                el.style.border = '1px solid rgba(0,200,100,0.25)';
            } else {
                ov.style.display = 'none';
                el.style.boxShadow = '';
                el.style.border = '1px solid #222';
            }
        });
    }

    function refreshUI() {
        $('#mg-balance').textContent = moneyFormat(balance);
        $('#mg-round-result').textContent = '0';
        updateBetOverlays();
        refreshTotals();
    }

    function refreshTotals() {
        const total = Object.values(selectedBets).reduce((a,b)=>a+b,0);
        $('#mg-total-bet').textContent = moneyFormat(total);
    }

    function log(text) {
        const el = $('#mg-log');
        const t = new Date().toLocaleTimeString();
        el.innerHTML = `<div>[${t}] ${text}</div>` + el.innerHTML;
    }

    /* ---------- Spin / Round logic ---------- */
    function randomPick() {
        const idx = Math.floor(Math.random() * ITEMS.length);
        return ITEMS[idx];
    }

    function setResultSlot(slotIndex, item) {
        const slot = document.querySelector(`#mg-results .mg-res-slot[data-slot="${slotIndex}"]`);
        slot.innerHTML = `<img src="${item.img}" title="${item.name}" style="width:56px;height:56px;object-fit:contain;"/>`;
    }

    async function startRound() {
        // validate
        const totalBet = Object.values(selectedBets).reduce((a,b)=>a+b,0);
        if (totalBet <= 0) { alert('Hãy chọn ít nhất 1 cược trước khi Start.'); return; }
        if (balance < totalBet) { alert('Số dư không đủ để đặt cược này.'); return; }

        // disable UI while spinning
        $('#mg-start').disabled = true;
        $('#mg-start').style.opacity = '0.6';
        $all('.mg-bet-item').forEach(el => el.style.pointerEvents = 'none');
        $('#mg-reset-bets').disabled = true;

        // Deduct bets at start
        balance -= totalBet;
        saveBalance(balance);
        refreshUI();
        log(`Bắt đầu vòng - tổng cược ${moneyFormat(totalBet)} VCoin đã bị trừ.`);

        // Animation: nhanh -> chậm -> final
        const slots = [0,1,2];
        const durations = [2200, 2400, 2600]; // ms when final stops (slightly stagger)
        const intervals = [];

        // for each slot, cycle images quickly then stop at random
        const finalResults = [];
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            finalResults[slot] = randomPick(); // decide final now (fair)
        }

        // Start intervals
        const startTime = Date.now();
        const spinIntervals = [];
        slots.forEach((slot, i) => {
            // initial fast interval
            const iv = setInterval(() => {
                const tmp = randomPick();
                setResultSlot(slot, tmp);
            }, 80 + Math.floor(Math.random()*40));
            spinIntervals.push(iv);

            // schedule stop
            setTimeout(() => {
                // clear interval and set final
                clearInterval(iv);
                setResultSlot(slot, finalResults[slot]);
            }, durations[i]);
        });

        // wait until last duration done
        await new Promise(res => setTimeout(res, Math.max(...durations) + 80));

        // Calculate payout
        let totalWon = 0;
        const counts = {}; // count occurrence of each item id in finalResults
        finalResults.forEach(it => { counts[it.id] = (counts[it.id] || 0) + 1; });

        // For each bet placed, if it appears k times, win = betAmount * 2 * k
        Object.entries(selectedBets).forEach(([id, betAmt]) => {
            const k = counts[id] || 0;
            if (k > 0) {
                const win = betAmt * 2 * k; // multiplier 2 per match
                totalWon += win;
            }
        });

        // Apply winnings to balance
        const profit = totalWon - totalBet; // net change compared to before round
        balance += totalWon;
        saveBalance(balance);

        // Update UI and logs
        refreshUI();
        $('#mg-round-result').textContent = (profit >= 0 ? `+${moneyFormat(profit)}` : `${moneyFormat(profit)}`);
        $('#mg-round-result').style.color = profit >= 0 ? '#b7ffb7' : '#ffb7b7';

        // friendly message showing final results names
        const names = finalResults.map(x => x.name).join(' | ');
        log(`Kết quả: ${names}`);
        if (totalWon > 0) {
            log(`Bạn thắng ${moneyFormat(totalWon)} VCoin (lợi nhuận ${profit >= 0 ? '+' : ''}${moneyFormat(profit)})`);
        } else {
            log(`Bạn thua vòng này: mất ${moneyFormat(totalBet)} VCoin`);
        }

        // re-enable UI
        $('#mg-start').disabled = false;
        $('#mg-start').style.opacity = '1';
        $all('.mg-bet-item').forEach(el => el.style.pointerEvents = 'auto');
        $('#mg-reset-bets').disabled = false;
    }

    /* ---------- Kick off ---------- */
    function init() {
        createUI();
        // initial results show random images
        for (let i = 0; i < 3; i++) setResultSlot(i, randomPick());
        refreshUI();
        log('Mini-game sẵn sàng. Chọn kèo và bấm Start!');
    }

    // run after slight delay (chờ DOM)
    setTimeout(init, 800);

})();
