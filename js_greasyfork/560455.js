// ==UserScript==
// @name         Project-Aurora for Braains.io
// @match        https://www.modd.io/play/braainsio*
// @description  a braains.io pill detection system
// @author       diquer
// @version      1.0
// @icon         https://th.bing.com/th/id/OIP.v07c-MQIQreFgoAl4oB5GgHaE8?w=260&h=180&c=7&r=0&o=7&pid=1.7&rm=3
// @license MIT 
// @grant        none
// @namespace https://greasyfork.org/users/1553254
// @downloadURL https://update.greasyfork.org/scripts/560455/Project-Aurora%20for%20Braainsio.user.js
// @updateURL https://update.greasyfork.org/scripts/560455/Project-Aurora%20for%20Braainsio.meta.js
// ==/UserScript==

/*
 NOTES:
 This script is under development; you may find some bugs.
 This script is not 100% accurate because of the X-Mas update.
 Updating this script soon to be more accurate.
 If you find any bugs please report them on my Discord: jbu90
 If you have any ideas please tell me.
 Adding rare item radar soon.
 Stay tuned.
*/


(function () {
    'use strict';

    /* ---------------- READY ---------------- */
    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else fn();
    }

    /* ---------------- FONT ---------------- */
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap';
    document.head.appendChild(font);

    /* ---------------- CONSTANTS ---------------- */
    const CONFIRM_AMOUNTS = [500, 1000, 1500, 2000, 3000];
    const SCAN_INTERVAL = 1000;
    const MAX_VISIBLE_ROWS = 6;
    const ROW_HEIGHT = 38;

    /* ---------------- STATE ---------------- */
    const lastScores = new Map();
    const states = new Map();
    const calculating = new Map();

    let pillListDirty = false;

    /* ---------------- HUD ---------------- */
    function getHUDText() {
        const t1 = document.getElementById('ui-text-top-id')?.innerText || '';
        const t2 = document.getElementById('ui-text-center-lg-id')?.innerText || '';
        return (t1 + ' ' + t2).trim();
    }

    function parseSeconds(txt) {
        const m = txt.match(/(\d+)\s*seconds?/i);
        return m ? parseInt(m[1], 10) : null;
    }

    /* ---------------- UI ---------------- */
    let pillList, pillContainer;

    function updatePanelHeight() {
        const rows = states.size;
        const visible = Math.min(rows, MAX_VISIBLE_ROWS);
        pillContainer.style.maxHeight = (visible * ROW_HEIGHT + 12) + 'px';
        pillContainer.style.overflowY = rows > MAX_VISIBLE_ROWS ? 'auto' : 'hidden';
    }

    function render() {
        pillList.innerHTML = '';

        for (const [name, st] of states) {
            const row = document.createElement('div');
            row.style.padding = '6px 8px';
            row.style.marginBottom = '4px';
            row.style.borderRadius = '8px';
            row.style.background = 'rgba(0,0,0,0.25)';
            row.style.fontSize = '13px';
            row.style.animation = 'fadeIn .25s ease';

            if (st === 'calculating') {
                row.innerHTML = `
                    <div style="display:flex;align-items:center;gap:8px;color:#ffd">
                        <span class="orbit"></span>${name} — Calculating
                    </div>`;
            } else if (st === 'pilled') {
                row.innerHTML = `✅ ${name} — <b>PILLED</b>`;
            } else if (st === 'maybe') {
                row.innerHTML = `⚠ ${name} — <b>MAYBE</b>`;
            }

            pillList.appendChild(row);
        }

        updatePanelHeight();
        pillListDirty = false;
    }

    /* ---------------- SCORE LOGIC ---------------- */
    function handleScore(name, last, now) {
        if (states.has(name)) return;

        const diff = now - last;
        if (diff >= 0) return;

        const loss = Math.abs(diff);

        if (last >= 4500 && loss === 500) {
            states.set(name, 'pilled');
            calculating.delete(name);
            pillListDirty = true;
            return;
        }

        if (last >= 1000 && last <= 4499 && loss === 500) {
            if (!calculating.has(name)) {
                calculating.set(name, 500);
                states.set(name, 'calculating');
            } else {
                const total = calculating.get(name) + 500;
                calculating.set(name, total);
                if (CONFIRM_AMOUNTS.includes(total)) {
                    states.set(name, 'pilled');
                    calculating.delete(name);
                }
            }
            pillListDirty = true;
            return;
        }

        if (last >= 500 && last <= 999 && loss === 500 && !calculating.has(name)) {
            states.set(name, 'maybe');
            pillListDirty = true;
        }
    }

    /* ---------------- MAIN ---------------- */
    onReady(() => {

        const menu = document.createElement('div');
        Object.assign(menu.style, {
            position: 'fixed',
            left: '20px',
            top: '80px',
            width: '320px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            backgroundImage: 'url(https://i.redd.it/0aypzzkjea8a1.gif)',
            backgroundSize: 'cover',
            boxShadow: '0 20px 60px rgba(0,0,0,.6)',
            fontFamily: `'Space Grotesk', sans-serif`,
            color: '#eaf6ff',
            zIndex: 999999,
            overflow: 'hidden'
        });

        /* overlay (FIXED: does not block mouse) */
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,5,20,.65)',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none'
        });
        menu.appendChild(overlay);

        const root = document.createElement('div');
        root.style.position = 'relative';
        root.style.zIndex = 1;
        root.style.display = 'flex';
        root.style.flexDirection = 'column';
        menu.appendChild(root);

        const header = document.createElement('div');
        header.textContent = 'PROJECT-AURORA';
        Object.assign(header.style, {
            padding: '14px',
            fontWeight: 700,
            cursor: 'grab',
            borderBottom: '1px solid rgba(255,255,255,.15)'
        });
        root.appendChild(header);

        /* tabs */
        const tabs = document.createElement('div');
        tabs.style.display = 'flex';
        tabs.style.gap = '8px';
        tabs.style.padding = '10px';
        root.appendChild(tabs);

        const mkTab = t => {
            const b = document.createElement('button');
            b.textContent = t;
            Object.assign(b.style, {
                flex: 1,
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255,255,255,.1)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer'
            });
            return b;
        };

        const pillTab = mkTab('PILL-LIST');
        const devTab  = mkTab('DEV-LOG');
        const infoTab = mkTab('INFO');
        tabs.append(pillTab, devTab, infoTab);

        const view = document.createElement('div');
        root.appendChild(view);

        pillContainer = document.createElement('div');
        pillContainer.style.padding = '12px';

        pillList = document.createElement('div');
        pillContainer.appendChild(pillList);

        const devLog = document.createElement('div');
        devLog.style.display = 'none';
        devLog.style.padding = '12px';
        devLog.innerHTML = `<div style="text-align:center">Soon</div>`;

        const info = document.createElement('div');
        info.style.display = 'none';
        info.style.padding = '12px';
        info.style.textAlign = 'center';
        info.innerHTML = `Project-Aurora<br>Made by <b>diquer</b>`;

        view.append(pillContainer, devLog, info);

        function show(t) {
            pillContainer.style.display = t === 'pill' ? 'block' : 'none';
            devLog.style.display = t === 'dev' ? 'block' : 'none';
            info.style.display = t === 'info' ? 'block' : 'none';
        }
        pillTab.onclick = () => show('pill');
        devTab.onclick  = () => show('dev');
        infoTab.onclick = () => show('info');
        show('pill');

        /* DRAG (RESTORED) */
        let drag = false, dx = 0, dy = 0;
        header.onmousedown = e => {
            drag = true;
            header.style.cursor = 'grabbing';
            dx = e.clientX - menu.offsetLeft;
            dy = e.clientY - menu.offsetTop;
        };
        document.addEventListener('mousemove', e => {
            if (!drag) return;
            menu.style.left = (e.clientX - dx) + 'px';
            menu.style.top  = (e.clientY - dy) + 'px';
        });
        document.addEventListener('mouseup', () => {
            drag = false;
            header.style.cursor = 'grab';
        });

        document.body.appendChild(menu);

        /* ---------------- SCAN LOOP ---------------- */
        setInterval(() => {
            const hud = getHUDText();
            if (!hud) return;

            if (/outbreak happening/i.test(hud)) {
                const sec = parseSeconds(hud);
                if (sec !== null && sec <= 10) {
                    states.clear();
                    calculating.clear();
                    lastScores.clear();
                    pillListDirty = true;
                }

                document.querySelectorAll('.scoreboard-user-entry').forEach(row => {
                    const nameEl = row.querySelector('.scoreboard-player-name');
                    const scoreEl = row.querySelector('.scoreboard-player-score span');
                    if (!nameEl || !scoreEl) return;

                    const name = nameEl.innerText.trim();
                    const score = parseInt(scoreEl.innerText.replace(/\D/g, ''), 10);
                    if (isNaN(score)) return;

                    if (!lastScores.has(name)) {
                        lastScores.set(name, score);
                        return;
                    }

                    handleScore(name, lastScores.get(name), score);
                    lastScores.set(name, score);
                });
            }

            if (pillListDirty) render();

        }, SCAN_INTERVAL);

        /* STYLE (moon cursor + animations) */
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin { to { transform:rotate(360deg); } }
            @keyframes fadeIn {
                from { opacity:0; transform:translateY(4px); }
                to { opacity:1; transform:none; }
            }
            .orbit {
                width:14px;height:14px;
                border:2px solid #fff4;
                border-top-color:#fff;
                border-radius:50%;
                animation:spin 1s linear infinite;
            }

            /* Moon cursor on panel hover */
            div[style*="PROJECT-AURORA"]:hover {
                cursor: url("https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.png") 16 16, auto;
            }
        `;
        document.head.appendChild(style);
    });

})();
