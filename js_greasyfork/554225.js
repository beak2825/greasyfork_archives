// ==UserScript==
// @name         Jklm.fun Bomb Party Dominator 1.3 
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  TU ÉCRIS → TU CLIC → LE MOTS APPARAIT (TROUVER DES WORDLIST EN-FR)
// @author       Myuri
// @match        https://jklm.fun/*
// @match        https://jklm.fun/*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554225/Jklmfun%20Bomb%20Party%20Dominator%2013.user.js
// @updateURL https://update.greasyfork.org/scripts/554225/Jklmfun%20Bomb%20Party%20Dominator%2013.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // CONFIG
    const CONFIG = {
        autoType: GM_getValue('autoType', true), // ACTIVÉ PAR DÉFAUT
        baseDelay: GM_getValue('baseDelay', 35),
        distanceMultiplier: GM_getValue('distanceMultiplier', 6.5),
        minDelay: GM_getValue('minDelay', 7),
        delayVariation: GM_getValue('delayVariation', 0.45),
        typoChance: GM_getValue('typoChance', 0.6),
        language: GM_getValue('language', 'both')
    };

    let FR_WORDS = GM_getValue('frWords', []);
    let EN_WORDS = GM_getValue('enWords', []);
    let WORD_SET = new Set();
    let isRunning = false;
    let lastTypedWord = '';

    // CLAVIER
    const KEYBOARD_LAYOUT = {
        layout: {
            q: [0,0], w: [0,1], e: [0,2], r: [0,3], t: [0,4], y: [0,5], u: [0,6], i: [0,7], o: [0,8], p: [0,9],
            a: [1,0], s: [1,1], d: [1,2], f: [1,3], g: [1,4], h: [1,5], j: [1,6], k: [1,7], l: [1,8],
            z: [2,0], x: [2,1], c: [2,2], v: [2,3], b: [2,4], n: [2,5], m: [2,6]
        },
        adjacent: {}
    };
    Object.entries(KEYBOARD_LAYOUT.layout).forEach(([k, [r, c]]) => {
        KEYBOARD_LAYOUT.adjacent[k] = Object.entries(KEYBOARD_LAYOUT.layout)
            .filter(([x, [rr, cc]]) => x !== k && Math.abs(rr - r) <= 1 && Math.abs(cc - c) <= 1)
            .map(([x]) => x);
    });

    // HYPER STYLE CSS
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');
        .dom-gui, .live-gui {
            position: fixed; width: 340px; background: rgba(10, 10, 25, 0.94);
            border: 1.5px solid #00ffff; border-radius: 16px; color: #fff; font-family: 'Orbitron', sans-serif;
            z-index: 9999999; padding: 16px; box-shadow: 0 8px 32px rgba(0, 255, 255, 0.3);
            backdrop-filter: blur(12px); user-select: none; transition: all 0.3s ease;
        }
        .dom-gui { top: 20px; right: 20px; }
        .live-gui { top: 20px; left: 20px; display: none; }

        .dom-header, .live-header {
            font-weight: 700; font-size: 18px; color: #00ffff; cursor: move; padding: 8px 0;
            text-shadow: 0 0 8px #00ffff; display: flex; justify-content: space-between; align-items: center;
        }
        .close-btn { font-size: 20px; cursor: pointer; opacity: 0.7; transition: 0.2s; }
        .close-btn:hover { opacity: 1; color: #ff00cc; }

        .dom-sec, .live-sec { margin: 12px 0; }
        .dom-lab { font-size: 13px; color: #aaa; margin: 6px 0 4px; display: block; }

        .dom-in, .dom-ta, .live-in {
            width: 100%; padding: 10px 12px; background: rgba(20,20,40,0.9); border: 1px solid #00ffff;
            border-radius: 10px; color: #fff; font-size: 14px; transition: all 0.2s ease;
        }
        .dom-in:focus, .dom-ta:focus, .live-in:focus { outline: none; border-color: #00ccff; box-shadow: 0 0 12px rgba(0,204,255,0.6); }

        .dom-btn, .live-btn {
            background: linear-gradient(135deg, #00ffff, #00ccff); color: #000;
            border: none; padding: 10px; margin: 8px 0; border-radius: 10px;
            cursor: pointer; font-weight: 700; font-size: 14px; width: 100%;
            box-shadow: 0 4px 12px rgba(0,255,255,0.5); transition: all 0.2s ease;
        }
        .dom-btn:hover, .live-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,255,255,0.7); }

        .dom-go { background: linear-gradient(135deg, #ff00cc, #ff33ff) !important; color: white !important; font-size: 15px !important; }
        .live-syll { font-weight: 700; font-size: 26px; color: #00ffff; text-align: center; margin: 12px 0; text-transform: uppercase; letter-spacing: 3px; }
        .live-list { max-height: 260px; overflow-y: auto; background: rgba(15,15,35,0.95); border: 1px solid #00ffff; border-radius: 12px; padding: 10px; }
        .live-item { 
            padding: 10px 14px; margin: 6px 0; background: rgba(0,255,255,0.15); border-radius: 10px; 
            cursor: pointer; font-size: 15px; font-weight: 500; transition: all 0.15s ease;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .live-item:hover { 
            background: #00ffff; color: #000; transform: scale(1.03); font-weight: 700; 
            box-shadow: 0 4px 12px rgba(0,255,255,0.6);
        }
        .live-item:active { transform: scale(0.98); }
        .live-stat { text-align: center; font-weight: 500; color: #00ccff; margin-top: 10px; font-size: 13px; }
        .dom-lang { display: flex; gap: 6px; margin-top: 8px; }
        .dom-lang-btn { flex: 1; text-align: center; padding: 8px; border-radius: 8px; background: rgba(0,255,255,0.2); color: #00ffff; font-size: 13px; cursor: pointer; transition: 0.2s; }
        .dom-lang-btn.active { background: #00ffff; color: #000; font-weight: 700; }
        .manual-input { display: flex; gap: 8px; margin-bottom: 12px; }
        .manual-input input { flex: 1; font-size: 15px; }
        .manual-input button { width: 80px; font-size: 13px; padding: 10px; }

        .live-list::-webkit-scrollbar { width: 6px; }
        .live-list::-webkit-scrollbar-track { background: transparent; }
        .live-list::-webkit-scrollbar-thumb { background: #00ffff; border-radius: 3px; }

        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
        .pulse { animation: pulse 1.5s infinite; }
    `);

    // MAIN GUI
    function buildMainGUI() {
        if (document.getElementById('dom-gui')) return;
        const gui = document.createElement('div');
        gui.id = 'dom-gui';
        gui.className = 'dom-gui';
        gui.innerHTML = `
            <div class="dom-header">DOMINATOR 1.3 <span class="close-btn" id="close-main">×</span></div>

            <div class="dom-sec">
                <label class="dom-lab"><input type="checkbox" id="auto-type" ${CONFIG.autoType?'checked':''}> Auto-Typing (ON = écrit auto)</label>
            </div>

            <div class="dom-sec">
                <label class="dom-lab">Langue</label>
                <div class="dom-lang">
                    <div class="dom-lang-btn ${CONFIG.language==='french'?'active':''}" data-lang="french">FR</div>
                    <div class="dom-lang-btn ${CONFIG.language==='english'?'active':''}" data-lang="english">EN</div>
                    <div class="dom-lang-btn ${CONFIG.language==='both'?'active':''}" data-lang="both">FR+EN</div>
                </div>
            </div>

            <div class="dom-sec">
                <label class="dom-lab">WORDS FR</label>
                <textarea class="dom-ta" id="fr-input" placeholder="trotinette, maison..."></textarea>
                <button class="dom-btn" id="save-fr">SAVE FR</button>
            </div>

            <div class="dom-sec">
                <label class="dom-lab">WORDS EN</label>
                <textarea class="dom-ta" id="en-input" placeholder="computer, love..."></textarea>
                <button class="dom-btn" id="save-en">SAVE EN</button>
            </div>

            <div class="dom-sec">
                <button class="dom-btn dom-go" id="go-btn">GO</button>
            </div>

            <div class="dom-stat pulse" id="main-stat">Prêt</div>
        `;
        document.body.appendChild(gui);
        setupMainGUI(gui);
    }

    function setupMainGUI(gui) {
        const $ = (s, p = gui) => p.querySelector(s);

        let isDragging = false, startX, startY, startL, startT;
        $('.dom-header').onmousedown = e => {
            if (e.target.classList.contains('close-btn')) return;
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            const r = gui.getBoundingClientRect();
            startL = r.left; startT = r.top;
        };
        document.onmousemove = e => {
            if (!isDragging) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            gui.style.left = (startL + dx) + 'px';
            gui.style.top = (startT + dy) + 'px';
            gui.style.right = 'auto';
        };
        document.onmouseup = () => { isDragging = false; };

        $('#close-main').onclick = () => gui.remove();
        $('#auto-type').onchange = e => { 
            CONFIG.autoType = e.target.checked; 
            GM_setValue('autoType', CONFIG.autoType);
            setMainStatus(CONFIG.autoType ? 'Auto-Typing ON' : 'Auto-Typing OFF');
        };
        $('#save-fr').onclick = () => saveWords('frWords', 'fr-input');
        $('#save-en').onclick = () => saveWords('enWords', 'en-input');
        $('#go-btn').onclick = launchLive;

        document.querySelectorAll('.dom-lang-btn').forEach(b => {
            b.onclick = () => {
                document.querySelectorAll('.dom-lang-btn').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                CONFIG.language = b.dataset.lang;
                GM_setValue('language', CONFIG.language);
            };
        });

        setTimeout(() => {
            $('#fr-input').value = FR_WORDS.join('\n');
            $('#en-input').value = EN_WORDS.join('\n');
        }, 300);
    }

    function saveWords(key, id) {
        const gui = document.getElementById('dom-gui');
        if (!gui) return;
        const input = gui.querySelector('#' + id);
        const words = input.value.trim().split('\n').map(s => s.trim().toLowerCase()).filter(Boolean);
        GM_setValue(key, words);
        if (key === 'frWords') FR_WORDS = words;
        else EN_WORDS = words;
        setMainStatus(`✓ ${words.length} mots`);
        buildWordSet();
    }

    function setMainStatus(msg) {
        const el = document.getElementById('main-stat');
        if (el) el.textContent = msg;
    }

    function buildWordSet() {
        WORD_SET.clear();
        const src = CONFIG.language === 'french' ? FR_WORDS :
                    CONFIG.language === 'english' ? EN_WORDS :
                    [...FR_WORDS, ...EN_WORDS];
        src.forEach(w => WORD_SET.add(w));
    }

    function launchLive() {
        if (FR_WORDS.length === 0 && EN_WORDS.length === 0) {
            setMainStatus('✗ Aucun mot');
            return;
        }
        buildWordSet();
        isRunning = true;
        const main = document.getElementById('dom-gui');
        if (main) main.style.display = 'none';
        buildLivePanel();
        setLiveStatus('Écris → OK → CLIC');
    }

    function buildLivePanel() {
        if (document.getElementById('live-gui')) return;
        const gui = document.createElement('div');
        gui.id = 'live-gui';
        gui.className = 'live-gui';
        gui.style.display = 'block';
        gui.innerHTML = `
            <div class="live-header">HYPER MODE <span class="close-btn" id="close-live">×</span></div>
            <div class="live-sec">
                <div class="manual-input">
                    <input type="text" class="live-in" id="manual-syllable" placeholder="ex: et" autofocus>
                    <button class="live-btn" id="ok-btn">GO</button>
                </div>
                <div class="live-syll" id="current-syll">—</div>
                <div class="live-list" id="word-list"></div>
            </div>
            <div class="live-sec">
                <button class="live-btn" id="stop-btn">STOP</button>
            </div>
            <div class="live-stat" id="live-stat">En attente...</div>
        `;
        document.body.appendChild(gui);
        setupLivePanel(gui);
        setTimeout(() => document.getElementById('manual-syllable').focus(), 100);
    }

    function setupLivePanel(gui) {
        const $ = (s, p = gui) => p.querySelector(s);

        let isDragging = false, startX, startY, startL, startT;
        $('.live-header').onmousedown = e => {
            if (e.target.classList.contains('close-btn')) return;
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            const r = gui.getBoundingClientRect();
            startL = r.left; startT = r.top;
        };
        document.onmousemove = e => {
            if (!isDragging) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            gui.style.left = (startL + dx) + 'px';
            gui.style.top = (startT + dy) + 'px';
        };
        document.onmouseup = () => { isDragging = false; };

        $('#close-live').onclick = stopLive;
        $('#stop-btn').onclick = stopLive;

        $('#ok-btn').onclick = () => {
            const syll = $('#manual-syllable').value.trim().toLowerCase();
            if (syll.length >= 2) suggestWords(syll);
        };
        $('#manual-syllable').addEventListener('keypress', e => {
            if (e.key === 'Enter') $('#ok-btn').click();
        });
    }

    function setLiveStatus(msg) {
        const el = document.getElementById('live-stat');
        if (el) el.textContent = msg;
    }

    function stopLive() {
        isRunning = false;
        const live = document.getElementById('live-gui');
        if (live) live.remove();
        const main = document.getElementById('dom-gui');
        if (main) main.style.display = 'block';
        setMainStatus('Arrêté');
    }

    function suggestWords(syllable) {
        if (!isRunning) return;
        const lower = syllable.toLowerCase();
        document.getElementById('current-syll').textContent = lower.toUpperCase();
        const list = document.getElementById('word-list');
        list.innerHTML = '';

        const matches = [];
        WORD_SET.forEach(word => {
            if (word.includes(lower)) matches.push(word);
        });

        if (matches.length === 0) {
            list.innerHTML = '<div style="color:#ff6b6b; text-align:center; padding:12px; font-size:13px;">Aucun mot</div>';
            return;
        }

        matches.sort((a, b) => b.length - a.length);
        matches.slice(0, 80).forEach(word => {
            const item = document.createElement('div');
            item.className = 'live-item';
            const idx = word.indexOf(lower);
            if (idx >= 0) {
                const before = word.slice(0, idx);
                const match = word.slice(idx, idx + lower.length);
                const after = word.slice(idx + lower.length);
                item.innerHTML = `${before}<b style="color:#000;">${match}</b>${after}`;
            } else {
                item.textContent = word;
            }
            item.onclick = () => {
                if (CONFIG.autoType) {
                    simulateTyping(word);
                }
            };
            list.appendChild(item);
        });

        // AUTO-TYPING SI ACTIVÉ
        if (CONFIG.autoType && matches.length > 0) {
            const chosen = matches[0]; // Le plus long
            setTimeout(() => simulateTyping(chosen), 300); // Petit délai humain
            setLiveStatus(`Auto → ${chosen}`);
        }
    }

    // TYPING FIXÉ
    function normalRandom(mean, stdDev) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.floor(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * stdDev + mean);
    }

    function calculateTypingDelay(fromKey, toKey) {
        if (!fromKey) return CONFIG.baseDelay;
        fromKey = fromKey.toLowerCase(); toKey = toKey.toLowerCase();
        const fromPos = KEYBOARD_LAYOUT.layout[fromKey], toPos = KEYBOARD_LAYOUT.layout[toKey];
        if (!fromPos || !toPos) return CONFIG.baseDelay;
        const distance = Math.hypot(fromPos[0] - toPos[0], fromPos[1] - toPos[1]);
        const meanDelay = CONFIG.baseDelay + distance * CONFIG.distanceMultiplier;
        const stdDev = meanDelay * CONFIG.delayVariation;
        return Math.max(CONFIG.minDelay, normalRandom(meanDelay, stdDev));
    }

    async function simulateTypo(input, correctChar) {
        const c = correctChar.toLowerCase();
        if (!KEYBOARD_LAYOUT.adjacent[c] || Math.random() > CONFIG.typoChance / 100) return false;
        const typoChar = KEYBOARD_LAYOUT.adjacent[c][Math.floor(Math.random() * KEYBOARD_LAYOUT.adjacent[c].length)];
        input.value += typoChar; input.dispatchEvent(new Event("input", { bubbles: true }));
        await delay(calculateTypingDelay(null, typoChar));
        await delay(normalRandom(130, 30));
        input.value = input.value.slice(0, -1); input.dispatchEvent(new Event("input", { bubbles: true }));
        await delay(normalRandom(55, 15));
        input.value += correctChar; input.dispatchEvent(new Event("input", { bubbles: true }));
        await delay(normalRandom(100, 20));
        return true;
    }

    async function simulateTyping(word) {
        const selfTurn = document.querySelector(".selfTurn");
        if (!selfTurn || selfTurn.hidden) {
            console.log("Pas ton tour !");
            return;
        }

        const input = selfTurn.querySelector("input");
        const form = selfTurn.querySelector("form");
        if (!input || !form || word === lastTypedWord) return;

        lastTypedWord = word;
        input.value = "";
        input.focus();

        let lastChar = null;
        const startTime = performance.now();

        for (let i = 0; i < word.length; i++) {
            if (!(await simulateTypo(input, word[i]))) {
                input.value += word[i];
                input.dispatchEvent(new Event("input", { bubbles: true }));
                await delay(calculateTypingDelay(lastChar, word[i]));
            }
            lastChar = word[i];
        }

        // SOUMISSION DIRECTE
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);

        const totalTime = performance.now() - startTime;
        setLiveStatus(`✓ ${word} — ${totalTime.toFixed(0)}ms`);
    }

    const delay = ms => new Promise(r => setTimeout(r, ms));

    // START
    const obs = new MutationObserver(() => {
        if (!document.getElementById('dom-gui') && !document.getElementById('live-gui')) {
            buildMainGUI();
        }
    });

    setTimeout(() => {
        buildMainGUI();
        obs.observe(document.body, { childList: true, subtree: true });
    }, 800);

})();