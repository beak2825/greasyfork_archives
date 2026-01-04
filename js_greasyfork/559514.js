// ==UserScript==
// @name         MonkeyType AutoTyper Bot
// @namespace    https://greasyfork.org/users/1546585
// @version      6.9
// @description  Combines the working V6.2 engine with V6.6 features and anti-cheat bypass.
// @author       greedism
// @match        *://monkeytype.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559514/MonkeyType%20AutoTyper%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/559514/MonkeyType%20AutoTyper%20Bot.meta.js
// ==/UserScript==

(function () {
    "use strict";

    class AutoTyper {
        constructor() {
            this.isTyping = false;
            this.timeoutId = null;
            this.isHidden = false;
            this.wpmHistory = [];
            this.stats = { charsTyped: 0, errors: 0, startTime: null };
            
            this.loadSettings();
            this.init();
        }

        loadSettings() {
            // grab saved stuff, or use defaults if first time
            const sWpm = localStorage.getItem('mt-bot-wpm');
            const sAcc = localStorage.getItem('mt-bot-acc');
            const sDelay = localStorage.getItem('mt-bot-delay');
            
            this.config = {
                accuracy: sAcc ? parseFloat(sAcc) : 0.97,
                wpm: sWpm ? parseInt(sWpm) : 80,
                startDelay: sDelay ? parseInt(sDelay) : 500,
                humanMode: true
            };
        }

        init() {
            this.createGUI();
            this.makeDraggable(document.getElementById('monkeytype-autotyper-gui'));
            console.log("MT-Bot: Engine V6.9 Ready.");
        }

        getNextCharacter() {
            const word = document.querySelector(".word.active");
            if (!word) return " ";
            // loop through letters to find the one without a status class
            const letters = word.children;
            for (let i = 0; i < letters.length; i++) {
                if (letters[i].className === "" || letters[i].classList.contains("letter")) {
                    return letters[i].textContent;
                }
            }
            return " ";
        }

        pressKey(k) {
            const input = document.getElementById("wordsInput");
            if (!input) return;

            const evInit = {
                key: k,
                code: k === " " ? "Space" : `Key${k.toUpperCase()}`,
                bubbles: true,
                cancelable: true,
                composed: true,
                which: k.charCodeAt(0),
                keyCode: k.charCodeAt(0)
            };

            input.dispatchEvent(new KeyboardEvent('keydown', evInit));
            
            // update the hidden input field so monkeytype sees it
            if (k !== " ") {
                input.value += k;
            } else {
                input.value = "";
            }

            input.dispatchEvent(new InputEvent('input', { 
                inputType: 'insertText', 
                data: k, 
                bubbles: true 
            }));
            
            input.dispatchEvent(new KeyboardEvent('keyup', evInit));
        }

        getHumanDelay(base, char) {
            const sd = base * 0.25;
            const u1 = Math.random();
            const u2 = Math.random();
            // normal distribution randomizer
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            let d = base + z * sd;

            // Speed up common bigrams - feels more like a real typist
            const common = ['th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'nd'];
            if (common.includes((this.lastChar || '') + char)) {
                d *= 0.62; 
            }

            // Random micro-pause (distraction/stumble simulation)
            if (Math.random() < 0.012) {
                d += (Math.random() * 250) + 150;
            }

            // Fatigue logic: slow down slightly as the test goes on
            const fatigue = 1 + (this.stats.charsTyped / 2200); 
            d *= fatigue;

            if (char === " ") d += (Math.random() * 140) + 45;

            this.lastChar = char;
            return Math.max(d, 24); 
        }

        typeCharacter() {
            if (!this.canType()) { this.stopTyping(); return; }
            
            const char = this.getNextCharacter();
            this.stats.charsTyped++;

            // Mistake Simulation
            if (Math.random() > this.config.accuracy) {
                this.stats.errors++;
                const chars = "abcdefghijklmnopqrstuvwxyz";
                const wrong = chars.charAt(Math.floor(Math.random() * chars.length));
                
                this.pressKey(wrong);
                
                // human-like reaction time to realize a mistake happened
                this.timeoutId = setTimeout(() => {
                    this.pressKey("Backspace");
                    this.timeoutId = setTimeout(() => this.typeCharacter(), this.getHumanDelay(115, char));
                }, 90 + Math.random() * 110);
                return;
            } else {
                this.pressKey(char);
            }

            let bDelay = (60000 / (this.config.wpm * 5));
            let finalD = this.config.humanMode ? this.getHumanDelay(bDelay, char) : bDelay;

            this.updateStats();
            this.timeoutId = setTimeout(() => this.typeCharacter(), finalD);
        }

        toggleTyping() {
            const btn = document.getElementById('mainStartBtn');
            if (!this.isTyping) {
                this.updateStatusText('Preparing...', '#e2b714');
                setTimeout(() => {
                    this.isTyping = true;
                    this.wpmHistory = [];
                    this.stats = { charsTyped: 0, errors: 0, startTime: Date.now() };
                    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg> STOP`;
                    btn.style.color = "#ff4444";
                    this.typeCharacter();
                }, this.config.startDelay);
            } else {
                this.stopTyping();
            }
        }

        stopTyping() {
            this.isTyping = false;
            clearTimeout(this.timeoutId);
            const btn = document.getElementById('mainStartBtn');
            if (btn) {
                btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> START`;
                btn.style.color = "#fff";
            }
            this.updateStatusText('Ready', '#444');
        }

        updateStats() {
            const diff = (Date.now() - this.stats.startTime) / 1000;
            const wpm = Math.round((this.stats.charsTyped / 5) / (diff / 60)) || 0;
            document.getElementById('w-val').innerText = wpm;
            
            if (Math.floor(diff) > this.wpmHistory.length) {
                this.wpmHistory.push(wpm);
                if (this.wpmHistory.length > 25) this.wpmHistory.shift();
                this.drawGraph();
            }
            this.updateStatusText('<span class="pulse">●</span> Typing...', '#fff');
        }

        drawGraph() {
            const svg = document.getElementById('wpm-graph');
            if (!svg || this.wpmHistory.length < 2) return;
            const max = Math.max(...this.wpmHistory, 150);
            const pts = this.wpmHistory.map((w, i) => `${(i / (this.wpmHistory.length - 1)) * 240},${40 - (w / max) * 40}`).join(' ');
            svg.innerHTML = `<polyline points="${pts}" fill="none" stroke="#e2b714" stroke-width="2" stroke-linejoin="round" />`;
        }

        updateStatusText(t, c) { 
            const s = document.getElementById('status');
            if (s) { s.innerHTML = t; s.style.color = c; }
        }

        canType() { return !!document.querySelector('.word.active'); }

        makeDraggable(el) {
            let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
            const h = document.getElementById('gui-header');
            h.onmousedown = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                p3 = e.clientX; p4 = e.clientY;
                document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
                document.onmousemove = (ev) => {
                    p1 = p3 - ev.clientX; p2 = p4 - ev.clientY;
                    p3 = ev.clientX; p4 = ev.clientY;
                    el.style.top = (el.offsetTop - p2) + "px"; 
                    el.style.left = (el.offsetLeft - p1) + "px";
                    el.style.bottom = "auto"; el.style.right = "auto";
                };
            };
        }

        createGUI() {
            const gui = document.createElement('div');
            gui.id = 'monkeytype-autotyper-gui';
            gui.style.cssText = `position:fixed;top:100px;right:20px;width:280px;background:rgba(10,10,10,0.98);border:1px solid #222;border-radius:12px;color:#fff;font-family:'Lexend Deca',sans-serif;z-index:100000;backdrop-filter:blur(10px);box-shadow:0 10px 40px #000;`;

            gui.innerHTML = `
                <div id="gui-header" style="padding:12px;background:#111;border-radius:12px 12px 0 0;cursor:move;display:flex;justify-content:space-between;border-bottom:1px solid #222;font-size:11px;color:#e2b714;font-weight:bold;align-items:center;">
                    <span>MONKEY BOT STEALTH V6.9</span>
                    <button id="hideBtn" style="background:none;border:none;color:#444;cursor:pointer;font-size:9px;">HIDE</button>
                </div>
                <div style="padding:15px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:15px;">
                        <div class="stat-card">WPM <b id="w-val">0</b></div>
                        <div class="stat-card">ACC <b id="a-val">${Math.round(this.config.accuracy*100)}%</b></div>
                    </div>
                    
                    <div class="ctrl">
                        <label>Target WPM: <span id="v-wpm">${this.config.wpm}</span></label>
                        <input type="range" id="s-wpm" min="10" max="350" value="${this.config.wpm}">
                    </div>

                    <div class="ctrl">
                        <label>Start Delay:</label>
                        <div style="display:flex;gap:5px;margin-top:5px;">
                            <button class="d-btn ${this.config.startDelay === 0 ? 'active' : ''}" data-ms="0">Instant</button>
                            <button class="d-btn ${this.config.startDelay === 500 ? 'active' : ''}" data-ms="500">Normal</button>
                            <button class="d-btn ${this.config.startDelay === 2000 ? 'active' : ''}" data-ms="2000">Slow</button>
                        </div>
                    </div>

                    <button id="mainStartBtn"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> START</button>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
                        <button id="exportBtn" class="sec-btn">EXPORT</button>
                        <button id="importBtn" class="sec-btn">IMPORT</button>
                    </div>

                    <div style="background:#000; border: 1px solid #111; border-radius: 8px; height: 40px; margin-top: 15px; position:relative; overflow:hidden;">
                        <svg id="wpm-graph" width="240" height="40" style="position:absolute;left:5px;"></svg>
                    </div>

                    <div id="status" style="text-align:center;font-size:10px;color:#444;margin-top:10px;">Ready</div>
                </div>
                <style>
                    .stat-card { background:#000; padding:10px; border-radius:8px; border:1px solid #1a1a1a; text-align:center; font-size:10px; color:#555; }
                    .stat-card b { display:block; font-size:16px; color:#fff; }
                    .ctrl { margin-bottom:12px; }
                    .ctrl label { font-size:10px; color:#888; display:flex; justify-content:space-between; }
                    .ctrl label span { color:#e2b714; }
                    input[type=range] { width:100%; accent-color:#e2b714; }
                    #mainStartBtn { width:100%; background:#111; color:#fff; border:1px solid #333; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
                    .sec-btn { background:#080808; border:1px solid #222; color:#666; padding:6px; border-radius:6px; cursor:pointer; font-size:9px; font-weight:bold; }
                    .d-btn { flex:1; background:#111; border:1px solid #222; color:#555; font-size:9px; padding:6px; border-radius:4px; cursor:pointer; }
                    .d-btn.active { border-color:#e2b714; color:#fff; }
                    .pulse { color:#ff4444; animation: blink 1s infinite; }
                    @keyframes blink { 50% { opacity: 0; } }
                </style>
            `;

            const tab = document.createElement('div');
            tab.id = 'mt-restore-tab'; 
            tab.innerHTML = 'BOT';
            tab.style.cssText = `position:fixed;top:50%;right:0;transform:translateY(-50%);background:#e2b714;color:#000;padding:15px 8px;border-radius:10px 0 0 10px;cursor:pointer;font-size:10px;font-weight:900;writing-mode:vertical-rl;display:none;z-index:100000;`;

            document.body.appendChild(gui);
            document.body.appendChild(tab);

            // Click handlers
            document.getElementById('mainStartBtn').onclick = () => this.toggleTyping();
            document.getElementById('hideBtn').onclick = () => { gui.style.display='none'; tab.style.display='flex'; };
            tab.onclick = () => { gui.style.display='block'; tab.style.display='none'; };
            document.getElementById('exportBtn').onclick = () => this.exportConfig();
            document.getElementById('importBtn').onclick = () => this.importConfig();
            
            document.getElementById('s-wpm').oninput = (e) => {
                this.config.wpm = e.target.value;
                document.getElementById('v-wpm').innerText = e.target.value;
                localStorage.setItem('mt-bot-wpm', e.target.value);
            };

            document.querySelectorAll('.d-btn').forEach(btn => {
                btn.onclick = () => {
                    this.config.startDelay = parseInt(btn.dataset.ms);
                    document.querySelectorAll('.d-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    localStorage.setItem('mt-bot-delay', btn.dataset.ms);
                };
            });
        }

        exportConfig() {
            const data = JSON.stringify({ wpm: this.config.wpm, acc: this.config.accuracy });
            navigator.clipboard.writeText(data).then(() => {
                this.updateStatusText('Copied!', '#e2b714');
            });
        }

        importConfig() {
            const raw = prompt("Paste JSON Config:");
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    this.config.wpm = parsed.wpm; 
                    this.config.accuracy = parsed.acc;
                    localStorage.setItem('mt-bot-wpm', parsed.wpm); 
                    localStorage.setItem('mt-bot-acc', parsed.acc);
                    location.reload();
                } catch(e) { alert("Invalid JSON!"); }
            }
        }
    }

    // Startup
    new AutoTyper();
})();