// ==UserScript==
// @name         Torn Competition Team Target Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show 3 "okay" attack targets under a chosen level on competition team page.
// @author       ChatGPT
// @match        https://www.torn.com/page.php?sid=competition*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558268/Torn%20Competition%20Team%20Target%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558268/Torn%20Competition%20Team%20Target%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- CONFIG ----------
    const SCAN_INTERVAL_MS = 3000; // how often to rescan the table
    const DEFAULT_MAX_LEVEL = 50;
    // Attack link pattern – change if Torn ever updates it
    const buildAttackUrl = (id) => `https://www.torn.com/loader.php?sid=attack&user2ID=${id}`;

    let maxLevel = DEFAULT_MAX_LEVEL;

    // ---------- UI PANEL ----------
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'tcth-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            left: '50%',
            bottom: '40px',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            zIndex: 999999,
            minWidth: '260px',
            boxShadow: '0 0 10px rgba(0,0,0,0.6)',
        });

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">Comp Targets</div>
            <div style="margin-bottom:6px;">
              Max level:
              <input id="tcth-maxlevel" type="number" value="${DEFAULT_MAX_LEVEL}"
                     style="width:60px; margin-left:4px; font-size:11px;">
            </div>
            <div id="tcth-targets" style="max-height:150px; overflow-y:auto;"></div>
        `;

        document.body.appendChild(panel);

        const maxLevelInput = document.getElementById('tcth-maxlevel');
        maxLevelInput.addEventListener('change', () => {
            const val = parseInt(maxLevelInput.value, 10);
            if (!isNaN(val) && val > 0) {
                maxLevel = val;
            }
        });
    }

    function ensurePanel() {
        if (!document.getElementById('tcth-panel')) {
            createPanel();
        }
    }

    // ---------- TABLE SCANNING ----------
    function getTeamRows() {
        // Torn uses React with hashed class names. We search for a row that
        // looks like the team rows by using "teamRow" fragment.
        return Array.from(document.querySelectorAll('div[class*="teamRow"]'));
    }

    function parseRow(row) {
        try {
            const nameLink = row.querySelector('a[href*="profiles.php?XID="]');
            if (!nameLink) return null;

            const href = nameLink.getAttribute('href') || '';
            const idMatch = href.match(/XID=(\d+)/);
            if (!idMatch) return null;
            const id = idMatch[1];
            const name = nameLink.textContent.trim();

            // level: any div whose class contains "level" with a span inside
            const levelContainer = row.querySelector('div[class*="level"] span');
            if (!levelContainer) return null;
            const level = parseInt(levelContainer.textContent.trim(), 10);
            if (isNaN(level)) return null;

            // status: any div whose class contains "status" with a span inside
            const statusSpan = row.querySelector('div[class*="status"] span');
            const statusText = statusSpan ? statusSpan.textContent.trim().toLowerCase() : '';

            return { id, name, level, statusText, row };
        } catch (e) {
            return null;
        }
    }

    function findTargets() {
        const rows = getTeamRows();
        const players = [];

        for (const row of rows) {
            const data = parseRow(row);
            if (!data) continue;

            // Only "okay" and <= max level
            if (data.statusText === 'okay' && data.level <= maxLevel) {
                players.push(data);
            }
        }

        // sort ascending by level (lowest first)
        players.sort((a, b) => a.level - b.level);
        return players.slice(0, 3);
    }

    // ---------- UI UPDATE ----------
    function renderTargets(targets) {
        const container = document.getElementById('tcth-targets');
        if (!container) return;

        if (!targets || targets.length === 0) {
            container.innerHTML = `<div>No "okay" targets ≤ level ${maxLevel} found.</div>`;
            return;
        }

        const lines = targets.map(t => {
            const attackUrl = buildAttackUrl(t.id);
            const profileUrl = `https://www.torn.com/profiles.php?XID=${t.id}`;
            return `
                <div style="margin-bottom:4px; line-height:1.3;">
                    <strong>${t.name}</strong> (lvl ${t.level})<br>
                    <a href="${attackUrl}" target="_blank" style="color:#ffb347; text-decoration:underline;">
                        Attack
                    </a>
                    &nbsp;|&nbsp;
                    <a href="${profileUrl}" target="_blank" style="color:#9ecbff; text-decoration:underline;">
                        Profile
                    </a>
                </div>
            `;
        });

        container.innerHTML = lines.join('');
    }

    // ---------- MAIN LOOP ----------
    function startScanner() {
        ensurePanel();

        setInterval(() => {
            // Only run while we're on a team view
            if (!location.href.includes('sid=competition') || !location.href.includes('#/team/')) {
                return;
            }
            const targets = findTargets();
            renderTargets(targets);
        }, SCAN_INTERVAL_MS);
    }

    // ---------- WAIT FOR PAGE ----------
    function waitForAppAndStart() {
        const check = () => {
            // React content present?
            const hasTeamRows = getTeamRows().length > 0;
            if (hasTeamRows) {
                startScanner();
            } else {
                // keep waiting
                setTimeout(check, 1000);
            }
        };
        check();
    }

    // Kick off when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForAppAndStart);
    } else {
        waitForAppAndStart();
    }
})();