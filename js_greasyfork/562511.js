// ==UserScript==
// @name          Torn Faction Payout Helper (Manual)
// @namespace     http://tampermonkey.net/
// @match         https://www.torn.com/factions.php*
// @version       1.32
// @author        OptimusGrimeDC
// @description   Manual JSON-based payout updater for Torn faction balances
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/562511/Torn%20Faction%20Payout%20Helper%20%28Manual%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562511/Torn%20Faction%20Payout%20Helper%20%28Manual%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("=== Torn Faction Payout Helper (Manual) Loaded ===");

    let isInitialized = false;
    let container = null;

    function shouldShowBox() {
        return location.href.includes("tab=controls");
    }

    /* ================= UI INIT ================= */

    function initializeBox() {
        if (isInitialized || !shouldShowBox()) return;

        container = document.createElement('div');
        Object.assign(container.style, {
            margin: '10px 0',
            background: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '8px',
            color: '#fff',
            fontSize: '13px'
        });

        const inputBox = document.createElement('input');
        inputBox.type = 'text';
        inputBox.placeholder = 'Paste JSON here';
        inputBox.id = 'faction-json-input';
        Object.assign(inputBox.style, {
            width: '100%',
            marginBottom: '6px',
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid #333',
            background: '#222',
            color: '#fff'
        });

        const runButton = document.createElement('a');
        runButton.className = "torn-btn btn-small";
        runButton.textContent = "Run Balance Updater";

        const results = document.createElement('div');
        results.style.marginTop = '6px';
        results.style.fontSize = '12px';

        container.append(inputBox, runButton, results);
        document.querySelector(".content-wrapper")?.prepend(container);

        /* ================= STATE ================= */

        let payouts = [];
        let index = 0;
        let unpaidUsers = [];

        /* ================= HELPERS ================= */

        function log(msg, error = false) {
            const div = document.createElement('div');
            div.textContent = msg;
            div.style.color = error ? '#f66' : '#6f6';
            results.appendChild(div);
        }

        function delay(ms) {
            return new Promise(r => setTimeout(r, ms));
        }

        function findUserBlock(userId) {
            for (const li of document.querySelectorAll("li.listItem___XjdYl")) {
                for (const a of li.querySelectorAll("a[href*='XID=']")) {
                    const m = a.href.match(/XID=(\d+)/);
                    if (m && m[1] === String(userId)) return li;
                }
            }
            return null;
        }

        function readBalance(block) {
            const el = block.querySelector(
                ".editBalanceWrap___zSfd0.canEdit___AnTEo input[type='hidden']"
            );
            return el ? parseInt(el.value, 10) : null;
        }

        async function applyBalance(block, amount) {
            const wrap = block.querySelector(".editBalanceWrap___zSfd0.canEdit___AnTEo");
            wrap.querySelector("button.submit")?.click();
            await delay(250);

            const input = wrap.querySelector("input.input-money");
            input.value = amount;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            await delay(200);

            wrap.querySelector("button.submit")?.click();
            await delay(300);
        }

        /* ================= POPUP ================= */

        function injectModalStyles(modal) {
            const style = document.createElement('style');
            style.textContent = `
                .unpaid-modal, .unpaid-modal * { color: #e6e6e6 !important; }
                .unpaid-modal table { width:100%; border-collapse:collapse; font-size:12px; }
                .unpaid-modal th { color:#aaa !important; border-bottom:1px solid #444 !important; padding:4px !important; }
                .unpaid-modal td { padding:4px !important; }
                .unpaid-modal td.amount { text-align:right; color:#fff !important; }
                .unpaid-modal a { color:#6cf !important; text-decoration:none !important; }
                .unpaid-modal a:hover { text-decoration:underline !important; }
            `;
            modal.appendChild(style);
        }

        function buildDiscordExport() {
            let lines = [
                "Copy this and paste it into Discord to get payout links for the remaining members:",
                ""
            ];

            unpaidUsers.forEach(u => {
                const amount = Number(u.amount);
                const url = `https://www.torn.com/factions.php?step=your#/tab=controls&addMoneyTo=${u.userId}&money=${amount}`;
                lines.push(`[${u.userId} is owed $${amount.toLocaleString()}](${url})`);
            });

            return lines.join("\n");
        }

        function showUnpaidPopup() {
            if (!unpaidUsers.length) return;

            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.75)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });

            const modal = document.createElement('div');
            modal.className = 'unpaid-modal';
            Object.assign(modal.style, {
                background: '#111',
                border: '1px solid #444',
                borderRadius: '8px',
                padding: '15px',
                width: '500px',
                maxHeight: '70vh',
                overflowY: 'auto'
            });

            modal.innerHTML = `
                <h3 style="margin-top:0;color:#ff6b6b !important;">
                    These people haven't been paid
                </h3>

                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th style="text-align:right;">Amount Owed</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${unpaidUsers.map(u => `
                            <tr>
                                <td>
                                    <a href="https://www.torn.com/profiles.php?XID=${u.userId}"
                                       target="_blank" rel="noopener">
                                        ${u.userId}
                                    </a>
                                </td>
                                <td class="amount">$${u.amount.toLocaleString()}</td>
                                <td>${u.reason}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px;">
                    <button class="torn-btn btn-small discord-btn">Discord Export</button>
                    <button class="torn-btn btn-small copy-btn">Copy JSON</button>
                    <button class="torn-btn btn-small close-btn">Close</button>
                </div>
            `;

            injectModalStyles(modal);

            modal.querySelector('.close-btn').onclick = () => overlay.remove();

            modal.querySelector('.copy-btn').onclick = e => {
                navigator.clipboard.writeText(JSON.stringify(unpaidUsers, null, 2));
                const b = e.target;
                b.textContent = "Copied!";
                setTimeout(() => b.textContent = "Copy JSON", 1500);
            };

            modal.querySelector('.discord-btn').onclick = e => {
                navigator.clipboard.writeText(buildDiscordExport());
                const b = e.target;
                b.textContent = "Discord Copied!";
                setTimeout(() => b.textContent = "Discord Export", 1500);
            };

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        }

        /* ================= RUN ================= */

        runButton.addEventListener('click', async () => {
            if (!payouts.length) {
                try {
                    payouts = JSON.parse(inputBox.value);
                    if (!Array.isArray(payouts)) throw 0;
                    index = 0;
                    unpaidUsers = [];
                    log(`📥 Loaded ${payouts.length} payouts`);
                    return;
                } catch {
                    alert("Invalid JSON – must be an array");
                    return;
                }
            }

            if (index >= payouts.length) {
                log("🎉 All payouts processed!");
                showUnpaidPopup();
                return;
            }

            const { userId, amount } = payouts[index];
            const block = findUserBlock(userId);

            if (!block) {
                unpaidUsers.push({ userId, amount, reason: "User not found" });
                log(`❌ User ${userId} not found`, true);
            } else {
                const bal = readBalance(block);
                if (bal === null) {
                    unpaidUsers.push({ userId, amount, reason: "Balance unreadable" });
                    log(`❌ Could not read balance for ${userId}`, true);
                } else {
                    await applyBalance(block, bal + amount);
                    log(`✅ Updated ${userId}: +${amount}`);
                }
            }

            index++;
        });

        isInitialized = true;
    }

    /* ================= NAV WATCH ================= */

    function checkToggle() {
        if (shouldShowBox() && !isInitialized) initializeBox();
        if (!shouldShowBox() && isInitialized) {
            container.remove();
            container = null;
            isInitialized = false;
        }
    }

    checkToggle();

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkToggle();
        }
    }).observe(document, { childList: true, subtree: true });

})();
