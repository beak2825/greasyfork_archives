// ==UserScript==
// @name         SimpleMMO Auto Bot
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Optimized auto stepper, job performer, and NPC attacker for SimpleMMO
// @author       PakGembus
// @match        https://web.simple-mmo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559493/SimpleMMO%20Auto%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/559493/SimpleMMO%20Auto%20Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === PREVENT DUPLICATE & EXCLUDE PATHS ===
    if (window.SMMO_BOT_LOADED) return;
    window.SMMO_BOT_LOADED = true;
    if (['/messages', '/chat', '/inbox', '/settings', '/help', '/support'].some(p => location.pathname.startsWith(p))) return;

    // === CONFIG ===
    const CFG = { MIN_DELAY: 500, MAX_DELAY: 2500, CHECK_MS: 300 };
    const K = { STATE: 'smmo_state', STATS: 'smmo_stats', POS: 'smmo_pos', LOCK: 'smmo_lock', COLLAPSED: 'smmo_collapsed' };

    // === STATE ===
    let S = { running: false, waiting: false, paused: false, locked: false, collapsed: true, autoStep: true, autoJob: true, autoAttack: true, autoCatch: true, autoGather: true, autoArena: true, fastMode: false };
    let stats = { steps: 0, attacks: 0, catches: 0, gathers: 0, jobs: 0, arenas: 0, startTime: null };
    let timer = null, worker = null, pending = null, captchaInt = null, titleInt = null;
    const origTitle = document.title;

    // === STORAGE ===
    const get = (k, d = null) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
    const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };

    function loadAll() {
        const s = get(K.STATE, {});
        Object.keys(S).forEach(k => { if (s[k] !== undefined) S[k] = s[k]; });
        const st = get(K.STATS, {});
        if (st.startTime && Date.now() - st.startTime < 3600000) Object.assign(stats, st);
        else stats.startTime = Date.now();
        S.locked = get(K.LOCK, false);
        S.collapsed = get(K.COLLAPSED, true);
    }

    const save = () => set(K.STATE, S);
    const saveStats = () => set(K.STATS, { ...stats, lastUpdate: Date.now() });

    // === UTILITY ===
    const getDelay = () => S.fastMode ? 1000 + Math.random() * 1000 : CFG.MIN_DELAY + Math.random() * CFG.MAX_DELAY + (Math.random() > 0.95 ? 5000 : 0);
    const $ = id => document.getElementById(id);

    // === BUTTON FINDER ===
    const btnCfg = {
        step: { includes: ['take a step'], selectors: ['button[id^="step_btn"]'] },
        attack: { exact: ['attack'], includes: ['attack', 'fight'], excludes: ['step', 'stats', 'generate'], selectors: ['#attackButton'] },
        leave: { exact: ['leave'] },
        catch: { exact: ['catch', 'collect', 'salvage', 'grab', 'take', 'harvest'], includes: ['salvage'] },
        gather: { includes: ['press here to gather', 'gather all', 'gather (energy'], excludes: ['close'] },
        close: { exact: ['press here to close', 'close'] },
        job: { includes: ['perform', 'work', 'collect'] },
        arenaGenerate: { includes: ['generate next opponent'], excludes: [] },
        arenaAttack: { exact: ['attack'], includes: ['attack'], excludes: ['step', 'stats', 'generate'] }
    };

    function findBtn(cfg) {
        const { exact = [], includes = [], excludes = [], selectors = [] } = cfg;
        for (const b of document.querySelectorAll('button, a.btn, a')) {
            if (b.disabled) continue;
            const t = (b.innerText || '').toLowerCase().trim();
            if (excludes.some(e => t.includes(e))) continue;
            if (exact.some(e => t === e) || includes.some(i => t.includes(i))) return b;
        }
        for (const s of selectors) { try { const b = document.querySelector(s); if (b && !b.disabled) return b; } catch { } }
        return null;
    }

    const getBtn = type => findBtn(btnCfg[type] || {});
    const isArenaPage = () => {
        // Cek URL path
        if (location.pathname.includes('/battle/arena') || location.pathname.includes('/arena/')) return true;
        // Cek apakah ada tombol Generate Next Opponent
        const txt = document.body.innerText.toLowerCase();
        if (txt.includes('generate next opponent')) return true;
        // Cek breadcrumb Battle Arena
        if (txt.includes('battle arena')) return true;
        return false;
    };
    const getLeaveBtn = () => location.pathname.includes('/npcs/') && !isArenaPage() && ['defeated', 'victory', 'you won', 'you lost', 'slain'].some(w => document.body.innerText.toLowerCase().includes(w)) ? getBtn('leave') : null;
    const getCloseBtn = () => ['remaining material', 'fishing level', 'mining level', 'woodcutting', 'foraging'].some(w => document.body.innerText.toLowerCase().includes(w)) ? getBtn('close') : null;
    const isBtnLoading = b => !b || b.disabled || (b.querySelector('img[src*="please-wait"], .spinner') && getComputedStyle(b.querySelector('img[src*="please-wait"], .spinner')).display !== 'none');
    const hasArenaEnergy = () => {
        const txt = document.body.innerText;
        const match = txt.match(/[⚡🔋]\s*(\d+)/); // mencari icon energy dengan angka
        if (match) return parseInt(match[1]) > 0;
        // Juga cek tombol generate masih ada dan tidak disabled
        const genBtn = getBtn('arenaGenerate');
        return genBtn && !genBtn.disabled;
    };
    const getArenaLeaveBtn = () => {
        if (!isArenaPage()) return null;
        // Cek apakah battle selesai (menang atau kalah)
        const txt = document.body.innerText.toLowerCase();
        if (['you won', 'you lost', 'victory', 'defeated', 'battle over'].some(w => txt.includes(w))) {
            return getBtn('leave');
        }
        return null;
    };

    function isGatherDone() {
        if (getBtn('gather')) return false;
        const txt = document.body.innerText.toLowerCase();
        if (!txt.includes('press here to close')) return false;
        const m = txt.match(/remaining material[:\s]*(\d+)/i);
        return m ? parseInt(m[1]) === 0 : true;
    }

    // === CAPTCHA ===
    const checkCaptcha = () => location.href.includes('/i-am-not-a-bot') || ['woah! hold up', "i'm a person", 'are you a bot', 'verify you are human'].some(w => document.body.innerText.toLowerCase().includes(w)) || !!document.querySelector('.g-recaptcha, iframe[src*="recaptcha"], .cf-turnstile');

    // === TIMER ===
    function createWorker() {
        try {
            const w = new Worker(URL.createObjectURL(new Blob([`self.onmessage=e=>{setTimeout(()=>self.postMessage('done'),e.data.ms)};`], { type: 'application/javascript' })));
            w.onmessage = () => { if (pending && S.running) { const fn = pending; pending = null; fn(); } };
            return w;
        } catch { return null; }
    }

    function setTimer(fn, ms) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => { if (S.running) fn(); }, ms);
        if (worker) { pending = fn; worker.postMessage({ ms }); }
    }

    // === NOTIFICATIONS ===
    function playBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            [800, 1000, 1200].forEach((f, i) => setTimeout(() => {
                const o = ctx.createOscillator(), g = ctx.createGain();
                o.connect(g); g.connect(ctx.destination);
                o.frequency.value = f; g.gain.setValueAtTime(0.3, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                o.start(); o.stop(ctx.currentTime + 0.3);
            }, i * 150));
        } catch { }
    }

    function flashTitle(msg) {
        if (titleInt) return;
        let orig = true;
        titleInt = setInterval(() => { document.title = orig ? `⚠️ ${msg}` : origTitle; orig = !orig; }, 1000);
    }

    function stopFlash() { if (titleInt) { clearInterval(titleInt); titleInt = null; document.title = origTitle; } }

    function startCaptchaMon() {
        if (captchaInt) return;
        captchaInt = setInterval(() => {
            if (!checkCaptcha()) {
                clearInterval(captchaInt); captchaInt = null; stopFlash();
                S.paused = false; updateUI();
                setTimeout(() => { if (!S.running) startBot(); }, 2000);
            }
        }, 2000);
    }

    function notify(title, msg) {
        playBeep(); flashTitle('CAPTCHA!');
        if ('Notification' in window && Notification.permission === 'granted') {
            const n = new Notification(title, { body: msg, icon: 'https://web.simple-mmo.com/favicon.ico', requireInteraction: true });
            n.onclick = () => { window.focus(); n.close(); stopFlash(); };
            setTimeout(() => n.close(), 60000);
        }
    }

    // === UI ===
    function createUI() {
        const css = document.createElement('style');
        css.textContent = `
            @keyframes pulse{0%,100%{transform:scale(1);box-shadow:0 2px 10px rgba(0,255,136,0.4)}50%{transform:scale(1.1);box-shadow:0 4px 20px rgba(0,255,136,0.7)}}
            @keyframes alert{0%,100%{box-shadow:0 2px 10px rgba(255,100,100,0.4);border-color:#f66}50%{box-shadow:0 4px 20px rgba(255,100,100,0.8);border-color:#f33}}
            #smmo-dot{position:fixed;z-index:99999;width:44px;height:44px;border-radius:50%;background:#1a1a2e;border:2px solid #0df;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:all .2s}
            #smmo-dot:hover{transform:scale(1.15)}
            #smmo-dot.on{animation:pulse 1.5s infinite;border-color:#0f8}
            #smmo-dot.warn{animation:alert 1s infinite}
            #smmo-ui{position:fixed;z-index:99999;background:#1a1a2e;color:#fff;padding:12px;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.4);font:12px/1.4 'Segoe UI',sans-serif;min-width:180px;border:1px solid #333;display:none}
            #smmo-ui.on{box-shadow:0 4px 20px rgba(0,255,136,0.3);border-color:#0f8}
            .smmo-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;color:#0df;font-weight:bold}
            .smmo-btn{width:22px;height:22px;border:none;border-radius:4px;background:#333;color:#fff;cursor:pointer;font-size:11px;margin-left:4px}
            .smmo-btn:hover{background:#444}
            .smmo-toggles{display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;font-size:10px;margin:8px 0;padding:8px;background:#111;border-radius:6px}
            .smmo-toggles label{display:flex;align-items:center;gap:4px;cursor:pointer}
            .smmo-toggles input{margin:0}
            .smmo-main{width:100%;padding:8px;border:none;border-radius:6px;color:#fff;font-weight:bold;cursor:pointer;font-size:11px}
            .smmo-stats{font-size:9px;color:#888;margin-top:8px;text-align:center}
        `;
        document.head.appendChild(css);

        // Dot
        const dot = document.createElement('div');
        dot.id = 'smmo-dot';
        dot.innerHTML = '🎮';
        dot.title = 'SMMO Bot';
        dot.style.cssText = `left:20px;bottom:20px;`;
        dot.onclick = () => { S.collapsed = !S.collapsed; set(K.COLLAPSED, S.collapsed); updateUI(); };
        document.body.appendChild(dot);

        // Panel
        const ui = document.createElement('div');
        ui.id = 'smmo-ui';
        const pos = get(K.POS, { left: 20, top: window.innerHeight - 320 });
        ui.style.cssText = `left:${pos.left}px;top:${pos.top}px;`;
        ui.innerHTML = `
            <div class="smmo-hdr">
                <span>🎮 Bot</span>
                <div>
                    <button class="smmo-btn" id="lock-btn" title="Lock">🔓</button>
                    <button class="smmo-btn" id="close-btn" title="Minimize">●</button>
                </div>
            </div>
            <div id="status" style="text-align:center;padding:6px;background:#111;border-radius:4px;margin-bottom:8px">⏸️ Idle</div>
            <div class="smmo-toggles">
                <label><input type="checkbox" id="t-step" checked>🚶 Step</label>
                <label><input type="checkbox" id="t-attack" checked>⚔️ Attack</label>
                <label><input type="checkbox" id="t-job" checked>💼 Job</label>
                <label><input type="checkbox" id="t-catch" checked>🎣 Catch</label>
                <label><input type="checkbox" id="t-gather" checked>⛏️ Gather</label>
                <label><input type="checkbox" id="t-arena" checked>🏟️ Arena</label>
                <label><input type="checkbox" id="t-fast">⚡ Fast</label>
            </div>
            <button class="smmo-main" id="main-btn" style="background:linear-gradient(135deg,#0a6,#0ac)">▶ START</button>
            <div class="smmo-stats" id="stats"></div>
        `;
        document.body.appendChild(ui);

        // Events
        $('close-btn').onclick = () => { S.collapsed = true; set(K.COLLAPSED, true); updateUI(); };
        $('lock-btn').onclick = () => { S.locked = !S.locked; set(K.LOCK, S.locked); $('lock-btn').textContent = S.locked ? '🔒' : '🔓'; ui.style.cursor = S.locked ? 'default' : 'move'; };
        $('main-btn').onclick = () => S.running ? stopBot() : startBot();

        ['step', 'attack', 'job', 'catch', 'gather', 'arena', 'fast'].forEach(k => {
            const key = k === 'fast' ? 'fastMode' : 'auto' + k.charAt(0).toUpperCase() + k.slice(1);
            const cb = $('t-' + k);
            cb.checked = S[key];
            cb.onchange = () => { S[key] = cb.checked; save(); };
        });

        // Drag
        let drag = false, ox, oy;
        ui.onmousedown = e => {
            if (S.locked || ['BUTTON', 'INPUT'].includes(e.target.tagName)) return;
            drag = true; ox = e.clientX - ui.offsetLeft; oy = e.clientY - ui.offsetTop;
        };
        document.onmousemove = e => { if (drag && !S.locked) { ui.style.left = (e.clientX - ox) + 'px'; ui.style.top = (e.clientY - oy) + 'px'; } };
        document.onmouseup = () => { if (drag && !S.locked) set(K.POS, { left: parseInt(ui.style.left), top: parseInt(ui.style.top) }); drag = false; };

        updateUI();
    }

    function updateUI() {
        const dot = $('smmo-dot'), ui = $('smmo-ui'), btn = $('main-btn'), status = $('status');
        if (dot) {
            dot.style.display = S.collapsed ? 'flex' : 'none';
            dot.className = 'smmo-dot' + (S.paused ? ' warn' : S.running ? ' on' : '');
            dot.innerHTML = S.paused ? '⚠️' : '🎮';
        }
        if (ui) {
            ui.style.display = S.collapsed ? 'none' : 'block';
            ui.className = S.running ? 'on' : '';
        }
        if (btn) {
            if (S.paused) { btn.textContent = '⏸️ PAUSED'; btn.style.background = 'linear-gradient(135deg,#c60,#a40)'; }
            else if (S.running) { btn.textContent = '⏹ STOP'; btn.style.background = 'linear-gradient(135deg,#c33,#a22)'; }
            else { btn.textContent = '▶ START'; btn.style.background = 'linear-gradient(135deg,#0a6,#0ac)'; }
        }
        if (status && S.paused) { status.innerHTML = '⚠️ <b>CAPTCHA</b>'; status.style.color = '#f66'; }
        updateStats();
    }

    function updateStatus(txt, color = '#fff') {
        const s = $('status');
        if (s && !S.paused) { s.textContent = txt; s.style.color = color; }
    }

    function updateStats() {
        const s = $('stats');
        if (!s) return;
        const m = stats.startTime ? Math.floor((Date.now() - stats.startTime) / 60000) : 0;
        s.textContent = `🚶${stats.steps} ⚔️${stats.attacks} 🎣${stats.catches} ⛏️${stats.gathers} 💼${stats.jobs} 🏟️${stats.arenas} ⏱️${m < 60 ? m + 'm' : Math.floor(m / 60) + 'h' + (m % 60) + 'm'}`;
    }

    function inc(type) { stats[type]++; saveStats(); updateStats(); }

    // === ACTIONS ===
    const doAction = (type, stat, msg, color) => {
        const key = 'auto' + type.charAt(0).toUpperCase() + type.slice(1);
        if (type !== 'leave' && type !== 'close' && !S[key]) return false;
        const b = type === 'leave' ? getLeaveBtn() : type === 'close' ? getCloseBtn() : getBtn(type);
        if (!b || (type === 'step' && isBtnLoading(b))) return false;
        b.click();
        if (stat) inc(stat);
        updateStatus(msg, color);
        return true;
    };

    // === MAIN LOOP ===
    function loop() {
        if (!S.running) return;

        if (checkCaptcha()) {
            S.paused = true; S.running = false; S.waiting = false;
            updateUI(); notify('⚠️ CAPTCHA!', 'Solve manually'); startCaptchaMon();
            return;
        }

        const schedule = (fn, delay, next = CFG.CHECK_MS) => {
            if (S.waiting) return true;
            S.waiting = true;
            setTimer(() => { if (!S.running) return; fn(); S.waiting = false; setTimer(loop, next); }, delay);
            return true;
        };

        // Priority: Leave > Close > Arena > Attack > Catch > Gather > Job > Step
        if (getLeaveBtn()) { updateStatus('🚪 Leaving...', '#4c5'); schedule(() => doAction('leave'), 500 + Math.random() * 500); return; }
        if (getCloseBtn() && isGatherDone()) { updateStatus('🔙 Closing...', '#888'); schedule(() => doAction('close'), 500 + Math.random() * 500); return; }

        // Battle Arena Logic
        if (S.autoArena && isArenaPage()) {
            // Cek apakah ada tombol leave setelah battle selesai di arena
            const arenaLeave = getArenaLeaveBtn();
            if (arenaLeave) {
                updateStatus('🏟️ Battle done, next...', '#d4a');
                schedule(() => {
                    // Tidak leave, tapi cari lawan baru
                    const genBtn = getBtn('arenaGenerate');
                    if (genBtn && !genBtn.disabled) {
                        genBtn.click();
                        inc('arenas');
                        updateStatus('🏟️ Next opponent!', '#d4a');
                    }
                }, 1000 + Math.random() * 1500);
                return;
            }

            // Cek tombol attack di arena
            const arenaAttackBtn = getBtn('arenaAttack');
            if (arenaAttackBtn && !arenaAttackBtn.disabled) {
                const d = 1000 + Math.random() * 1500;
                updateStatus(`🏟️ Arena ${(d / 1000).toFixed(1)}s`, '#d4a');
                schedule(() => {
                    arenaAttackBtn.click();
                    updateStatus('🏟️ Attack!', '#d4a');
                }, d, 500);
                return;
            }

            // Cek tombol generate opponent
            const genBtn = getBtn('arenaGenerate');
            if (genBtn && !genBtn.disabled && hasArenaEnergy()) {
                const d = 1500 + Math.random() * 2000;
                updateStatus(`🏟️ Generate ${(d / 1000).toFixed(1)}s`, '#d4a');
                schedule(() => {
                    genBtn.click();
                    inc('arenas');
                    updateStatus('🏟️ Opponent found!', '#d4a');
                }, d, 800);
                return;
            }

            // Energy habis atau tidak ada tombol
            if (!genBtn || genBtn.disabled) {
                updateStatus('🏟️ No energy/cooldown', '#888');
            }
        }

        if (S.autoAttack && getBtn('attack') && !isArenaPage()) { const d = 1000 + Math.random() * 1500; updateStatus(`⚔️ ${(d / 1000).toFixed(1)}s`, '#f66'); schedule(() => doAction('attack', 'attacks', '⚔️ Attack!', '#f66'), d, 500); return; }
        if (S.autoCatch && getBtn('catch')) { updateStatus('🎣 Catching...', '#0bd'); schedule(() => doAction('catch', 'catches', '🎣 Caught!', '#0bd'), 500 + Math.random() * 1000); return; }
        if (S.autoGather && getBtn('gather')) { const d = 1000 + Math.random() * 1000; updateStatus(`⛏️ ${(d / 1000).toFixed(1)}s`, '#8c4'); schedule(() => doAction('gather', 'gathers', '⛏️ Gathered!', '#8c4'), d, 500); return; }
        if (S.autoJob && location.pathname.includes('/job')) doAction('job', 'jobs', '💼 Done!', '#0f0');

        // Step
        if (S.autoStep && !S.waiting) {
            const b = getBtn('step');
            if (b && !isBtnLoading(b)) {
                const d = getDelay();
                updateStatus(`🤔 ${(d / 1000).toFixed(1)}s`, '#fe3');
                schedule(() => doAction('step', 'steps', '✅ Stepped!', '#0f0'), d);
                return;
            }
            updateStatus(b ? '⏳ Cooldown' : '🔍 Looking...', '#888');
        }

        setTimer(loop, CFG.CHECK_MS);
    }

    // === BOT CONTROL ===
    function startBot() {
        S.running = true; S.waiting = false; S.paused = false;
        if (captchaInt) { clearInterval(captchaInt); captchaInt = null; }
        stopFlash();
        if (!worker) worker = createWorker();
        save(); updateUI();
        updateStatus('🚀 Running...', '#0f0');
        loop();
    }

    function stopBot() {
        S.running = false; S.waiting = false;
        if (timer) clearTimeout(timer); timer = null; pending = null;
        save(); updateUI();
        updateStatus('⏸️ Stopped', '#fff');
    }

    // === INIT ===
    function init() {
        loadAll();
        if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
        const setup = () => {
            createUI();
            if (S.running) { updateStatus('🚀 Resumed!', '#0f0'); setTimeout(loop, 1000); }
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(setup, 500));
        else setTimeout(setup, 500);
    }

    init();
})();
