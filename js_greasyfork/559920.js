// ==UserScript==
// @name        Limax Client
// @namespace   Violentmonkey Scripts
// @match       *://limax.io/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       unsafeWindow
// @version     1.0
// @author      Drik
// @description Hud(RAlt): Ad Blocker, Auto Play, esp, tracers and more functions!!!
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559920/Limax%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/559920/Limax%20Client.meta.js
// ==/UserScript==
(async function() {
    'use strict';

    const STORAGE_KEY = 'lt';

    const defaults = {
        visible: false,
        AdBlocker: false,
        BetterLeaderBoard: false,
        AutoPlay: false,
        AutoPlayKillMode: false,
        Tracers: false,
        ESP: false,
        AutoNick: false,
        AutoNickValue: ''
    };

    async function gmGet(key, def) {
        try {
            if (typeof GM_getValue === 'function') return GM_getValue(key, def);
            if (typeof GM === 'object' && typeof GM.getValue === 'function') return await GM.getValue(key, def);
        } catch (e) {}
        return def;
    }

    async function gmSet(key, val) {
        try {
            if (typeof GM_setValue === 'function') return GM_setValue(key, val);
            if (typeof GM === 'object' && typeof GM.setValue === 'function') return await GM.setValue(key, val);
        } catch (e) {}
    }

    async function gmDelete(key) {
        try {
            if (typeof GM_deleteValue === 'function') return GM_deleteValue(key);
            if (typeof GM === 'object' && typeof GM.deleteValue === 'function') return await GM.deleteValue(key);
        } catch (e) {}
    }

    const raw = await gmGet(STORAGE_KEY, null);
    let state = (() => {
        try {
            if (!raw) return Object.assign({}, defaults);
            const p = JSON.parse(raw);
            return Object.assign({}, defaults, p);
        } catch (e) {
            return Object.assign({}, defaults);
        }
    })();

    GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');

    :root {
      --bg: rgba(18,18,20,0.95);
      --panel: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
      --accent: linear-gradient(90deg,#6ee7b7,#3b82f6);
      --muted: rgba(255,255,255,0.62);
      --shadow: 0 6px 24px rgba(2,6,23,0.6);
    }

    #limax-toolbox {
      font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
      position: fixed;
      right: 40px;
      top: 40px;
      width: 720px;
      max-width: calc(100% - 80px);
      z-index: 2147483647;
      border-radius: 12px;
      background: var(--bg);
      padding: 18px;
      box-shadow: var(--shadow);
      color: #e6eef8;
      display: none;
      backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255,255,255,0.03);
      line-height: 1.18;
    }

    #limax-toolbox, #limax-toolbox * {
      font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif !important;
    }

    #limax-toolbox.show { display:block; animation: dropIn 220ms cubic-bezier(.2,.9,.3,1); }
    @keyframes dropIn { from { transform: translateY(-8px) scale(.995); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

    .lt-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px; }
    .lt-title { display:flex; gap:12px; align-items:center; }
    .lt-logo { min-width:120px; height:44px; border-radius:10px; background:var(--accent); display:flex; align-items:center; justify-content:center; font-weight:800; color:#04263b; font-size:14px; padding:0 12px; }
    .lt-h1 { font-size:18px; font-weight:700; margin:0; }
    .lt-sub { font-size:12px; color:var(--muted); margin-top:2px; }

    .lt-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

    .lt-card { background:var(--panel); border-radius:10px; padding:12px; min-height:92px; display:flex; flex-direction:column; justify-content:space-between; transition: transform .12s, box-shadow .12s; border:1px solid rgba(255,255,255,0.02); }
    .lt-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(2,6,23,0.6); }
    .title-row { display:flex; justify-content:space-between; align-items:center; gap:8px; }
    .lt-card h3 { margin:0; font-size:14px; font-weight:700; }
    .lt-card p { margin:8px 0 0 0; font-size:12px; color:var(--muted); line-height:1.25; }

    .lt-switch { position:relative; width:56px; height:30px; border-radius:999px; background: rgba(255,255,255,0.06); display:flex; align-items:center; padding:4px; cursor:pointer; box-sizing:border-box; }
    .lt-switch.on { background: linear-gradient(90deg,#34d399,#3b82f6); box-shadow: 0 6px 18px rgba(59,130,246,0.18); }
    .lt-switch .knob { width:22px; height:22px; border-radius:50%; background:#fff; transform: translateX(0); transition: transform .14s; box-shadow: 0 6px 16px rgba(2,6,23,0.25); }
    .lt-switch.on .knob { transform: translateX(26px); }

    .lt-controls { margin-top:10px; display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
    .lt-input { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.04); color: #eaf6ff; padding:8px 10px; border-radius:8px; outline:none; min-width:160px; font-size:13px; }
    .lt-small { font-size:12px; color:var(--muted); }

    .lt-footer { margin-top:14px; display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .lt-toggle-key { font-weight:700; font-size:12px; color:#cfefff; }
    .lt-footer .save { background: linear-gradient(90deg,#60a5fa,#7dd3fc); color:#04263b; border-radius:10px; padding:8px 12px; font-weight:700; cursor:pointer; border:none; }

    @media (max-width:780px) { #limax-toolbox{ right:16px; left:16px;} .lt-grid{grid-template-columns:1fr;} .lt-logo{min-width:96px;font-size:13px;padding:0 8px;} }
  `);

    const root = document.createElement('div');
    root.id = 'limax-toolbox';
    document.body.appendChild(root);

    let adIv = null;
    let lbIv = null;
    let trRunner = null;
    let espRunner = null;
    let origWsSend = null;

    function adStart() {
        const S = ['#advert', '#vertad', '#crossPromotion'];
        const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
        const hide = el => {
            if (!el) return;
            try {
                el.style.setProperty('pointer-events', 'none', 'important');
                el.style.setProperty('opacity', '0', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                el.style.setProperty('display', 'none', 'important');
            } catch (e) {}
        };
        const hideAll = () => S.forEach(sel => document.querySelectorAll(sel).forEach(hide));
        const patch = () => {
            try {
                hideAll();
                if (!w) return;
                w.wait_banner_rendering = 0;
                w.adinplay_counter = 0;
                w.ADINPLAY_LOOP = 1e9;
                if (w.Widget && typeof w.Widget === 'object') {
                    try {
                        w.Widget.preroll = function() {
                            try {
                                w.start && w.start();
                            } catch (e) {}
                        };
                    } catch (e) {}
                    try {
                        w.Widget.play = function() {
                            try {
                                w.start && w.start();
                            } catch (e) {}
                        };
                    } catch (e) {}
                    try {
                        w.Widget.adsRefresh = function() {};
                    } catch (e) {}
                    try {
                        w.Widget.refresh = function() {};
                    } catch (e) {}
                    try {
                        w.Widget.stop = function() {};
                    } catch (e) {}
                }
                const p = document.getElementById('play');
                if (p) p.onclick = function() {
                    try {
                        if (!w.disa_interface && w.wait_banner_rendering === 0) {
                            w.disa_interface = true;
                            w.start && w.start();
                        }
                    } catch (e) {}
                };
            } catch (e) {}
        };
        patch();
        adIv = setInterval(patch, 777);
    }

    function adStop() {
        if (adIv) {
            clearInterval(adIv);
            adIv = null;
        }
    }

    function lbStart() {
        const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

        function tick() {
            try {
                if (!w) return;
                const arr = Array.isArray(w.players) ? w.players.filter(p => p != null) : [];
                const map = {};
                arr.forEach(p => map[p.id] = p.score || 0);
                const cand = [];
                if (Array.isArray(w.players_nickname)) {
                    for (let i = 0; i < w.players_nickname.length; i++) {
                        const name = w.players_nickname[i];
                        if (name && name !== " ") cand.push({
                            id: i,
                            nickname: (typeof w.filterBadWords === 'function' ? w.filterBadWords(name) : name),
                            score: map[i] || 0
                        });
                    }
                }
                arr.forEach(p => {
                    if (!cand.find(x => x.id === p.id)) cand.push({
                        id: p.id,
                        nickname: (w.players_nickname && w.players_nickname[p.id]) ? (typeof w.filterBadWords === 'function' ? w.filterBadWords(w.players_nickname[p.id]) : w.players_nickname[p.id]) : " ",
                        score: p.score || 0
                    });
                });
                if (cand.length === 0) return;
                cand.sort((a, b) => b.score - a.score);
                const N = Math.min(10, cand.length);
                const top = {
                    nickname: [],
                    score: [],
                    id: [],
                    rank: "?",
                    total: cand.length
                };
                for (let i = 0; i < N; i++) {
                    top.nickname.push(cand[i].nickname);
                    top.score.push(cand[i].score);
                    top.id.push(cand[i].id);
                }
                const idx = cand.findIndex(x => x.id === w.true_id);
                if (idx >= 0) top.rank = idx + 1;
                if (typeof w.draw_leaderboard === 'function') w.draw_leaderboard(top);
                if (typeof w.draw_personal_info === 'function') w.draw_personal_info(top);
            } catch (e) {}
        }
        tick();
        lbIv = setInterval(tick, 150);
    }

    function lbStop() {
        if (lbIv) {
            clearInterval(lbIv);
            lbIv = null;
        }
    }

    function makeTracers() {
        let ctx = null,
            canvas = null,
            raf = null;

        function getCanvas() {
            return document.getElementById('myCanvas');
        }

        function safeHas(a, i) {
            return a && typeof a[i] !== 'undefined';
        }

        function hexToRgba(hex, a) {
            if (!hex) return 'rgba(255,255,255,' + a + ')';
            if (hex[0] === '#') hex = hex.slice(1);
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            let r = parseInt(hex.slice(0, 2), 16);
            let g = parseInt(hex.slice(2, 4), 16);
            let b = parseInt(hex.slice(4, 6), 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        }

        function draw() {
            try {
                if (!state.Tracers) return;
                if (typeof players === 'undefined' || typeof players_show_pos === 'undefined') return;
                if (typeof id === 'undefined' || !players || !players[id]) return;
                let meIndex = players[id].id;
                if (typeof players_show_pos[meIndex] === 'undefined') return;
                canvas = canvas || getCanvas();
                if (!canvas) return;
                ctx = ctx || canvas.getContext('2d');
                let cam = {
                    x: canvas.width / 2 - players_show_pos[meIndex].x,
                    y: canvas.height / 2 - players_show_pos[meIndex].y
                };
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                let ps = typeof player_scale !== 'undefined' && player_scale !== -1 ? player_scale : 1;
                ctx.scale(ps, ps);
                let offset = (ps - 1) / (2 * ps);
                ctx.translate(-canvas.width * offset, -canvas.height * offset);
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                for (let i = 0; i < players.length; i++) {
                    let p = players[i];
                    if (!p) continue;
                    let pid = p.id;
                    if (pid === meIndex) continue;
                    if (!safeHas(players_show_pos, pid)) continue;
                    if (safeHas(players_alpha, pid) && players_alpha[pid] <= 0) continue;
                    let sx = players_show_pos[pid].x + cam.x,
                        sy = players_show_pos[pid].y + cam.y;
                    let mx = players_show_pos[meIndex].x + cam.x,
                        my = players_show_pos[meIndex].y + cam.y;
                    let dx = sx - mx,
                        dy = sy - my,
                        dist = Math.hypot(dx, dy) || 1;
                    let baseW = Math.max(0.6, Math.min(2.2, 1.8 - dist * 0.004));
                    let skinIdx = safeHas(players_skin, pid) ? players_skin[pid] : 0;
                    let rawColor = (typeof skin_color !== 'undefined' && skin_color[skinIdx]) ? skin_color[skinIdx] : '#ffffff';
                    let alphaFactor = Math.min(1, (safeHas(players_alpha, pid) ? players_alpha[pid] / 100 : 1) * 0.95);
                    let glow = hexToRgba(rawColor, 0.12 * alphaFactor);
                    let coreS = hexToRgba(rawColor, 0.98 * alphaFactor);
                    let coreE = hexToRgba(rawColor, 0.36 * alphaFactor);
                    let gx = mx + dx * 0.5,
                        gy = my + dy * 0.5;
                    let nx = -dy,
                        ny = dx;
                    let nlen = Math.hypot(nx, ny) || 1;
                    nx /= nlen;
                    ny /= nlen;
                    let side = (pid % 2 === 0) ? 1 : -1;
                    let curve = Math.min(100, dist * 0.10);
                    let cx = gx + nx * curve * side,
                        cy = gy + ny * curve * side;
                    ctx.save();
                    ctx.shadowBlur = Math.max(5, baseW * 2.5);
                    ctx.shadowColor = glow;
                    ctx.lineWidth = baseW * 1.8;
                    ctx.beginPath();
                    ctx.moveTo(mx, my);
                    ctx.quadraticCurveTo(cx, cy, sx, sy);
                    ctx.strokeStyle = hexToRgba(rawColor, 0.20 * alphaFactor);
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.stroke();
                    ctx.restore();
                    ctx.save();
                    let grad = ctx.createLinearGradient(mx, my, sx, sy);
                    grad.addColorStop(0, coreS);
                    grad.addColorStop(0.6, coreE);
                    grad.addColorStop(1, hexToRgba(rawColor, 0.06 * alphaFactor));
                    ctx.lineWidth = baseW;
                    ctx.beginPath();
                    ctx.moveTo(mx, my);
                    ctx.quadraticCurveTo(cx, cy, sx, sy);
                    ctx.strokeStyle = grad;
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.stroke();
                    ctx.restore();
                    ctx.save();
                    let dotR = Math.max(2.5, Math.min(6, baseW * 1.1));
                    let rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, dotR * 3);
                    rg.addColorStop(0, hexToRgba(rawColor, 0.98 * alphaFactor));
                    rg.addColorStop(0.3, hexToRgba(rawColor, 0.45 * alphaFactor));
                    rg.addColorStop(1, hexToRgba(rawColor, 0.0));
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.beginPath();
                    ctx.fillStyle = rg;
                    ctx.arc(sx, sy, dotR * 1.8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.fillStyle = hexToRgba('#ffffff', 0.85 * alphaFactor);
                    ctx.arc(sx - Math.min(2, dotR * 0.5), sy - Math.min(2, dotR * 0.5), Math.max(0.8, dotR * 0.45), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                ctx.restore();
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';
            } catch (e) {}
        }

        function loop() {
            if (!state.Tracers) {
                raf = null;
                return;
            }
            try {
                draw();
            } catch (e) {}
            raf = requestAnimationFrame(loop);
        }
        return {
            start: () => {
                if (!raf) loop();
            },
            stop: () => {
                if (raf) {
                    cancelAnimationFrame(raf);
                    raf = null;
                }
            }
        };
    }

    function makeESP() {
        let ctx = null,
            canvas = null,
            raf = null,
            prevPred = {};
        const MAX_TARGETS = 12,
            SMOOTH = 0.22,
            LEAD_MIN = 0.06,
            LEAD_MAX = 1.0,
            DIST_TO_LEAD = 600;

        function getCanvas() {
            return document.getElementById('myCanvas');
        }

        function safeHas(a, i) {
            return a && typeof a[i] !== 'undefined';
        }

        function hexToRgba(hex, a) {
            if (!hex) return 'rgba(255,255,255,' + a + ')';
            if (hex[0] === '#') hex = hex.slice(1);
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            let r = parseInt(hex.slice(0, 2), 16);
            let g = parseInt(hex.slice(2, 4), 16);
            let b = parseInt(hex.slice(4, 6), 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        }

        function draw() {
            try {
                if (!state.ESP) return;
                if (typeof players === 'undefined' || typeof players_show_pos === 'undefined') return;
                if (typeof id === 'undefined' || !players || players === -1) return;
                if (!players[id]) return;
                let meNum = players[id].id;
                if (typeof players_show_pos[meNum] === 'undefined') return;
                canvas = canvas || getCanvas();
                if (!canvas) return;
                ctx = ctx || canvas.getContext('2d');
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                let ps = (typeof player_scale !== 'undefined' && player_scale !== -1) ? player_scale : 1;
                ctx.scale(ps, ps);
                let offset = (ps - 1) / (2 * ps);
                ctx.translate(-canvas.width * offset, -canvas.height * offset);
                let cam = {
                    x: canvas.width / 2 - players_show_pos[meNum].x,
                    y: canvas.height / 2 - players_show_pos[meNum].y
                };
                let targets = [];
                for (let i = 0; i < players.length; i++) {
                    let p = players[i];
                    if (!p) continue;
                    let pid = p.id;
                    if (pid === meNum) continue;
                    if (!safeHas(players_show_pos, pid)) continue;
                    if (safeHas(players_alpha, pid) && players_alpha[pid] <= 0) continue;
                    let sx = players_show_pos[pid].x + cam.x,
                        sy = players_show_pos[pid].y + cam.y,
                        mx = players_show_pos[meNum].x + cam.x,
                        my = players_show_pos[meNum].y + cam.y;
                    let dx = sx - mx,
                        dy = sy - my,
                        dist = Math.hypot(dx, dy);
                    targets.push({
                        p,
                        dist,
                        px: sx,
                        py: sy
                    });
                }
                targets.sort((a, b) => a.dist - b.dist);
                targets = targets.slice(0, MAX_TARGETS);
                for (let t of targets) {
                    let p = t.p,
                        pid = p.id,
                        dist = t.dist;
                    let ang = (safeHas(players_angle, pid) ? players_angle[pid] : 0) + Math.PI;
                    let speed = safeHas(players_speed, pid) ? players_speed[pid] : 0;
                    let lead = Math.min(LEAD_MAX, Math.max(LEAD_MIN, dist / DIST_TO_LEAD));
                    let lx = players_show_pos[pid].x + Math.cos(ang) * speed * lead;
                    let ly = players_show_pos[pid].y + Math.sin(ang) * speed * lead;
                    if (!prevPred[pid]) prevPred[pid] = {
                        x: lx,
                        y: ly
                    };
                    prevPred[pid].x = prevPred[pid].x * (1 - SMOOTH) + lx * SMOOTH;
                    prevPred[pid].y = prevPred[pid].y * (1 - SMOOTH) + ly * SMOOTH;
                    let px = prevPred[pid].x + cam.x,
                        py = prevPred[pid].y + cam.y;
                    let size = Math.max(8, Math.min(48, (safeHas(players_radius, pid) ? players_radius[pid] : 12) * 0.95));
                    ctx.save();
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.shadowBlur = Math.max(6, size * 1.8);
                    ctx.shadowColor = 'rgba(255,50,50,0.55)';
                    let g = ctx.createLinearGradient(px - size, py - size, px + size, py + size);
                    g.addColorStop(0, hexToRgba('#ff3b3b', 0.98));
                    g.addColorStop(0.6, hexToRgba('#ff6767', 0.42));
                    g.addColorStop(1, hexToRgba('#ff3b3b', 0.06));
                    ctx.fillStyle = g;
                    ctx.strokeStyle = hexToRgba('#ff1a1a', 0.98);
                    ctx.lineWidth = Math.max(1, size * 0.12);
                    ctx.beginPath();
                    ctx.rect(px - size, py - size, size * 2, size * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                    ctx.save();
                    ctx.beginPath();
                    ctx.globalAlpha = 0.92;
                    ctx.fillStyle = hexToRgba('#ffffff', 0.9);
                    ctx.arc(px - Math.min(3, size * 0.12), py - Math.min(3, size * 0.12), Math.max(1, size * 0.18), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                ctx.restore();
                ctx.globalCompositeOperation = 'source-over';
            } catch (e) {}
        }

        function loop() {
            if (!state.ESP) {
                raf = null;
                return;
            }
            try {
                draw();
            } catch (e) {}
            raf = requestAnimationFrame(loop);
        }
        return {
            start: () => {
                if (!raf) loop();
            },
            stop: () => {
                if (raf) {
                    cancelAnimationFrame(raf);
                    raf = null;
                }
            }
        };
    }

    function injectBot() {
        try {
            if (unsafeWindow && unsafeWindow.AutoBot) return;
        } catch (e) {}
        const botSrc = `
    (function(){
      try{
        var OrigWS = window.WebSocket;
        var sock = null;
        function wrap(u, p){
          var s = p ? new OrigWS(u,p) : new OrigWS(u);
          try{ if((u && u.indexOf('limax.io')!==-1) || (u && u.indexOf('127.0.0.1')!==-1)) sock = s; }catch(e){}
          var orig = s.send.bind(s);
          s.send = function(data){ return orig(data); };
          s.addEventListener('close', function(){ if(sock===s) sock = null; });
          return s;
        }
        window.WebSocket = function(u,p){ return wrap(u,p); };
        window.WebSocket.prototype = OrigWS.prototype;
        var on = false, iv = null;
        var RT = 33, FD = 300, PUSH = 700, PF = 2, TC = 10;
        var lastTrap = 0, TRAPBUF = 12, PBW = 6;
        var kill = false, KMIN = 300, KR = 250, KTS = 55, KTI = 10, SHELBUF = 200, SHELREACH = 200;
        function getMe(){ try{ if(typeof window.true_id==='undefined' || window.true_id===-1) return null; return (window.players_show_pos && window.players_show_pos[window.true_id]) ? window.players_show_pos[window.true_id] : null; }catch(e){return null;} }
        function myScore(){ try{ if(typeof window.id!=='undefined' && window.players && window.players[window.id] && window.players[window.id].id===window.true_id) return window.players[window.id].score||0; if(window.players && Array.isArray(window.players)){ for(var i=0;i<window.players.length;i++){ var p=window.players[i]; if(p && p.id===window.true_id) return p.score||0; } } return (typeof window.score!=='undefined')?window.score:0; }catch(e){return 0;} }
        function gatherTraps(){ var out=[]; try{ var pt=window.players_trap || window.trap_map || []; if(Array.isArray(pt)){ for(var pid=0; pid<pt.length; pid++){ var arr = pt[pid]; if(!arr) continue; for(var ti=0; ti<arr.length; ti++){ var t=arr[ti]; if(!t) continue; var tx=(typeof t.x!=='undefined')?t.x:((typeof t.rx!=='undefined')?t.rx:0); var ty=(typeof t.y!=='undefined')?t.y:((typeof t.ry!=='undefined')?t.ry:0); var tr=(typeof t.radius!=='undefined')?t.radius:((typeof t.r!=='undefined')?t.r:(t.instRadius||0)); out.push({x:tx,y:ty,r:tr,owner:pid,lifetime:(t.lifetime||0)}); } } } else if(typeof pt==='object'){ for(var k in pt){ if(!pt.hasOwnProperty(k)) continue; var list=pt[k]; if(!list) continue; for(var j=0;j<list.length;j++){ var t=list[j]; if(!t) continue; var tx=(typeof t.x!=='undefined')?t.x:((typeof t.rx!=='undefined')?t.rx:0); var ty=(typeof t.y!=='undefined')?t.y:((typeof t.ry!=='undefined')?t.ry:0); var tr=(typeof t.radius!=='undefined')?t.radius:((typeof t.r!=='undefined')?t.r:0); out.push({x:tx,y:ty,r:tr,owner:k,lifetime:(t.lifetime||0)}); } } } }catch(e){} return out; }
        function dist(x1,y1,x2,y2){ var dx=x1-x2, dy=y1-y2; return Math.sqrt(dx*dx+dy*dy); }
        function projectionParam(px,py,x1,y1,x2,y2){ var Cx=x2-x1, Cy=y2-y1; var len_sq=Cx*Cx+Cy*Cy; if(len_sq===0) return 0; return ((px-x1)*Cx + (py-y1)*Cy)/len_sq; }
        function pointLineDist(px,py,x1,y1,x2,y2){ var A=px-x1, B=py-y1, C=x2-x1, D=y2-y1; var dot=A*C + B*D; var len_sq=C*C + D*D; var param=-1; if(len_sq!==0) param = dot/len_sq; var xx, yy; if(param<0){ xx = x1; yy = y1;} else if(param>1){ xx = x2; yy = y2; } else { xx = x1 + param * C; yy = y1 + param * D; } var dx=px-xx, dy=py-yy; return Math.sqrt(dx*dx + dy*dy); }
        function isTrapNearPoint(traps,x,y,buf){ buf = buf||0; for(var i=0;i<traps.length;i++){ var t=traps[i]; if(dist(t.x,t.y,x,y) <= (t.r||0) + buf) return true; } return false; }
        function pathIntersectsTrap(traps,x1,y1,x2,y2,excludeOwner){ for(var i=0;i<traps.length;i++){ var t=traps[i]; if(typeof excludeOwner!=='undefined' && t.owner==excludeOwner) continue; var extra = (typeof window.true_id!=='undefined' && t.owner != window.true_id) ? 30 : 0; var d = pointLineDist(t.x,t.y,x1,y1,x2,y2); if(d <= (t.r||0) + TRAPBUF + extra) return true; } return false; }
        function closestPlayer(){ try{ var me=getMe(); if(!me||!window.players_show_pos||!window.players) return null; var bestD=Infinity,bestId=null; for(var i=0;i<window.players.length;i++){ var p=window.players[i]; if(!p) continue; if(p.id===window.true_id) continue; var pos=window.players_show_pos[p.id]; if(!pos) continue; var dx=pos.x-me.x, dy=pos.y-me.y, d2=dx*dx+dy*dy; if(d2<bestD){ bestD=d2; bestId=p.id; } } return bestId===null?null:{id:bestId,d2:bestD,dist:Math.sqrt(bestD)}; }catch(e){return null;} }
        function nearestInfo(){ try{ var best=closestPlayer(); if(!best) return null; var p=null; for(var i=0;i<window.players.length;i++) if(window.players[i] && window.players[i].id===best.id){ p=window.players[i]; break; } var pos=(window.players_show_pos && window.players_show_pos[best.id])?window.players_show_pos[best.id]:null; return { id: best.id, dist: best.dist, player: p, pos: pos }; }catch(e){return null;} }
        function sendControl(angle, trapFlag){ try{ if(!sock && window.socket) sock = window.socket; if(!sock) return; if(!isFinite(angle)) angle = 0; var t = trapFlag ? 1 : 0; sock.send("[" + 0 + "," + angle + "," + t + "]"); }catch(e){} }
        function normalize(x,y){ var L=Math.sqrt(x*x+y*y); if(L===0) return {x:0,y:0}; return {x:x/L,y:y/L}; }
        function safeApproach(tx,ty,me,traps,excludeOwner){ var angle=Math.atan2(ty-me.y,tx-me.x)+Math.PI; if(!pathIntersectsTrap(traps,me.x,me.y,tx,ty,excludeOwner)) return {x:tx,y:ty,angle:angle}; var best=null,bestScore=Infinity; var steps=36,dists=[40,80,140,220]; for(var s=0;s<dists.length;s++){ var distOffset=dists[s]; for(var i=0;i<steps;i++){ var a=-Math.PI + (i/steps)*(2*Math.PI); var ca=Math.cos(a), sa=Math.sin(a); var nx = tx + ca*distOffset, ny = ty + sa*distOffset; var penalty=0; if(pathIntersectsTrap(traps,me.x,me.y,nx,ny,excludeOwner)) penalty += 1000000; for(var ti=0; ti<traps.length; ti++){ var t=traps[ti]; if(typeof excludeOwner!=='undefined' && t.owner==excludeOwner) continue; var td = dist(nx,ny,t.x,t.y) - (t.r||0); if(td < 0) penalty += (15000 + Math.abs(td) * 80); else if(td < 120) penalty += (1200 - td * 6); } var d = dist(me.x,me.y,nx,ny); var score = d + penalty + distOffset*0.2; if(score < bestScore){ bestScore = score; best = { x: nx, y: ny, angle: Math.atan2(ny - me.y, nx - me.x) + Math.PI }; } } } if(best) return best; return { x: tx, y: ty, angle: angle }; }
        function trapBetween(me,target,trap,buffer){ var t = projectionParam(trap.x, trap.y, me.x, me.y, target.x, target.y); if(t < 0 || t > 1) return false; var d = pointLineDist(trap.x, trap.y, me.x, me.y, target.x, target.y); return d <= (trap.r || 0) + (buffer || 0); }
        function findBestTrapBetween(me,target,traps){ var list=[]; for(var i=0;i<traps.length;i++){ var t=traps[i]; if(trapBetween(me,target,t, TRAPBUF + 10)){ var ed = dist(t.x,t.y,target.x,target.y); list.push({ trap: t, ed: ed }); } } if(list.length===0) return null; list.sort(function(a,b){ return a.ed - b.ed; }); return list[0].trap; }
        function repulsionVector(me,traps){ var rx=0, ry=0, minDanger=Infinity; for(var i=0;i<traps.length;i++){ var t=traps[i]; if(typeof window.true_id!=='undefined' && t.owner == window.true_id) continue; var dcenter=dist(me.x,me.y,t.x,t.y); var d=dcenter - (t.r||0); if(d < minDanger) minDanger = d; var dd = Math.max(d,0.1); var w = 1/(dd*dd); rx += (me.x - t.x) * w; ry += (me.y - t.y) * w; } return { rx: rx, ry: ry, minDanger: minDanger }; }
        function emergencyEvade(me,traps){ var rep = repulsionVector(me,traps); if(!rep) return false; if(rep.minDanger > 160) return false; var v = normalize(rep.rx, rep.ry); if(v.x===0 && v.y===0) return false; var push = 900; var targetX = me.x + v.x * push, targetY = me.y + v.y * push; var angle = Math.atan2(targetY - me.y, targetX - me.x) + Math.PI; sendControl(angle,0); for(var k=1;k<=3;k++){ (function(a,d){ setTimeout(function(){ sendControl(a,0); }, d); })(angle, k*40); } return true; }
        function performKillBehavior(){ var me=getMe(); if(!me) return false; var sc=myScore(); if(sc <= KMIN) return false; var info=nearestInfo(); if(!info || !info.pos) return false; var enemyScore = (info.player && typeof info.player.score!=='undefined')?info.player.score:0; if(enemyScore < 100) return false; var traps=gatherTraps(); var ev=emergencyEvade(me,traps); if(ev) return true; var pvx=0,pvy=0; try{ if(info.player){ if(typeof info.player.vx!=='undefined') pvx=info.player.vx; if(typeof info.player.vy!=='undefined') pvy=info.player.vy; } }catch(e){} var predX = info.pos.x + pvx * PF; var predY = info.pos.y + pvy * PF; var distToTarget = dist(me.x, me.y, predX, predY); if(distToTarget <= KR){ var targetPoint={x:predX,y:predY}; var chosen=findBestTrapBetween(me,targetPoint,traps); if(chosen){ var dir=normalize(chosen.x-targetPoint.x, chosen.y-targetPoint.y); var shelterX = chosen.x + dir.x * ((chosen.r||0)+SHELBUF); var shelterY = chosen.y + dir.y * ((chosen.r||0)+SHELBUF); var safe = safeApproach(shelterX,shelterY,me,traps,undefined); if(safe){ var distShelter=dist(me.x,me.y,shelterX,shelterY); if(distShelter <= SHELREACH){ var angleToEnemy = Math.atan2(predY - me.y, predX - me.x) + Math.PI; for(var i=0;i<KTS;i++){ (function(a,delay){ setTimeout(function(){ sendControl(a,1); }, delay); })(angleToEnemy, i * KTI); } setTimeout(function(){ sendControl(Math.atan2(predY - me.y, predX - me.x) + Math.PI, 0); }, KTS * KTI + 30); return true; } else { sendControl(safe.angle,0); return true; } } } var angle = Math.atan2(predY - me.y, predX - me.x) + Math.PI; for(var j=0;j<KTS;j++){ (function(a,delay){ setTimeout(function(){ sendControl(a,1); }, delay); })(angle, j * KTI); } setTimeout(function(){ sendControl(Math.atan2(predY - me.y, predX - me.x) + Math.PI, 0); }, KTS * KTI + 30); return true; } else { var safe2 = safeApproach(predX,predY,me,traps,undefined); if(safe2){ sendControl(safe2.angle,0); return true; } } return false; }
        function findClosestBonusSafe(traps){ try{ var update_map = window.update_bonus_map || window.player_update_bonus_map || []; var bonus_map = window.bonus_map || window.bonusMap || null; var player_bonus_map = window.player_bonus_map || window.playerBonusMap || window.player_bonus_map; var me = getMe(); if(!me) return null; var best=null,bestScore=Infinity; for(var i=0;i<update_map.length;i++){ var idb = update_map[i]; var bx=0,by=0,isPlayerBonus=false; if(typeof idb==='number' && bonus_map && typeof bonus_map[idb] !== 'undefined'){ var b = bonus_map[idb]; if(!b) continue; bx = (typeof b.rx!=='undefined')?b.rx:((typeof b.x!=='undefined')?b.x:0); by = (typeof b.ry!=='undefined')?b.ry:((typeof b.y!=='undefined')?b.y:0); } else { isPlayerBonus = true; try{ var BIG = (typeof window.BONUS_DEAD_KEY !== 'undefined') ? window.BONUS_DEAD_KEY : 1000000; if(BIG && idb >= BIG){ var j = Math.floor(idb / BIG) - 1; var k = idb % BIG; var pb = (player_bonus_map && player_bonus_map[j]) ? player_bonus_map[j][k] : null; if(!pb) continue; bx = (typeof pb.rx!=='undefined')?pb.rx:((typeof pb.x!=='undefined')?pb.x:0); by = (typeof pb.ry!=='undefined')?pb.ry:((typeof pb.y!=='undefined')?pb.y:0); } else continue; }catch(e){ continue; } } var dx=bx-me.x, dy=by-me.y; var d=Math.sqrt(dx*dx + dy*dy); if(isPlayerBonus){ if(isTrapNearPoint(traps,bx,by,PBW)) continue; } var penalty=0; if(pathIntersectsTrap(traps, me.x, me.y, bx, by)) penalty += 1000000; for(var tI=0; tI<traps.length; tI++){ var t=traps[tI]; var td = dist(bx,by,t.x,t.y) - (t.r||0); if(td < 0) penalty += (10000 + Math.abs(td) * 50); else if(td < 60) penalty += (600 - td * 5); } var score = d + penalty; if(score < bestScore){ bestScore = score; best = { x: bx, y: by, isPlayerBonus: isPlayerBonus, d: d }; } } return best; }catch(e){return null;} }
        function botTick(){ try{ if(!sock && window.socket) sock = window.socket; if(!sock) return; if(typeof window.game_is_show !== 'undefined' && !window.game_is_show) return; var me=getMe(); if(!me) return; var traps = gatherTraps(); var evadeNow = emergencyEvade(me,traps); if(evadeNow) return; if(kill){ var did=performKillBehavior(); if(did) return; } var nearestP = closestPlayer(); var isFlee = nearestP && nearestP.dist < FD; if(isFlee){ var pPos = window.players_show_pos[nearestP.id]; if(!pPos) return; var pvx=0,pvy=0; try{ for(var i=0;i<window.players.length;i++){ var pe=window.players[i]; if(pe && pe.id===nearestP.id){ if(typeof pe.vx!=='undefined') pvx=pe.vx; if(typeof pe.vy!=='undefined') pvy=pe.vy; break; } } }catch(e){} var predX = pPos.x + pvx * PF; var predY = pPos.y + pvy * PF; var dx = me.x - predX, dy = me.y - predY; var distv = Math.sqrt(dx*dx + dy*dy); if(distv < 1) distv = 1; var ux = dx / distv, uy = dy / distv; var push = PUSH + Math.max(0, (FD - distv)) * 2; var targetX = me.x + ux * push, targetY = me.y + uy * push; if(pathIntersectsTrap(traps, me.x, me.y, targetX, targetY)){ var rx=0, ry=0, totalw=0; for(var ti=0; ti<traps.length; ti++){ var t=traps[ti]; var td = dist(me.x, me.y, t.x, t.y) - Math.max(1, t.r||0); if(td <= 0) td = 0.1; var w = 1/(td*td); rx += (me.x - t.x)*w; ry += (me.y - t.y)*w; totalw += w; } if(totalw>0){ rx /= totalw; ry /= totalw; var rlen = Math.sqrt(rx*rx + ry*ry); if(rlen < 1){ rx = ux; ry = uy; rlen = 1; } rx = rx / rlen; ry = ry / rlen; targetX = me.x + rx * push; targetY = me.y + ry * push; } } var angle = Math.atan2(targetY - me.y, targetX - me.x) + Math.PI; var now=Date.now(); var wantTrap = (myScore() > 1000 && (now - lastTrap) > TC); if(wantTrap){ lastTrap = now; sendControl(angle,1); setTimeout(function(){ sendControl(angle,0); }, 80); } else sendControl(angle,0); return; } var target = findClosestBonusSafe(traps); if(target){ var dx = target.x - me.x, dy = target.y - me.y; var angle = Math.atan2(dy, dx) + Math.PI; sendControl(angle,0); return; } var jitter = (Math.random() - 0.5) * 0.6; var base = (typeof window.mouseangle !== 'undefined') ? window.mouseangle : 0; sendControl(base + jitter, 0); }catch(e){} }
        function startBot(){ if(iv) clearInterval(iv); iv = setInterval(botTick, RT); on = true; }
        function stopBot(){ if(iv){ clearInterval(iv); iv=null; } on=false; }
        window.AutoBot = { start: startBot, stop: stopBot, setKill: function(v){ kill = !!v; }, isRunning: function(){ return !!on; } };
        try{ if(window.socket) sock = window.socket; }catch(e){}
      }catch(e){} })();
    `;
        try {
            const s = document.createElement('script');
            s.textContent = botSrc;
            (document.head || document.documentElement).appendChild(s);
            s.parentNode.removeChild(s);
        } catch (e) {}
    }

    try {
        injectBot();
    } catch (e) {}

    function startAutoNick() {
        if (origWsSend) return;
        try {
            origWsSend = WebSocket.prototype.send;
            WebSocket.prototype.send = function(data) {
                try {
                    if (state.AutoNick && typeof data === "string" && data.charAt(0) === "[") {
                        let parsed = JSON.parse(data);
                        if (Array.isArray(parsed) && parsed.length >= 3 && parsed[0] === 1 && typeof parsed[1] === "string") {
                            let skin = parsed[2];
                            if (typeof skin === "number" && Number.isInteger(skin) && skin >= 0) {
                                let newNick = state.AutoNickValue || '';
                                if (newNick && newNick.indexOf("{skin}") !== -1) newNick = newNick.split("{skin}").join(String(skin));
                                if (newNick) parsed[1] = newNick;
                                data = JSON.stringify(parsed);
                            }
                        }
                    }
                } catch (e) {}
                return origWsSend.call(this, data);
            };
        } catch (e) {}
    }

    function stopAutoNick() {
        if (!origWsSend) return;
        try {
            WebSocket.prototype.send = origWsSend;
        } catch (e) {}
        origWsSend = null;
    }

    function applyFeature(key, on) {
        try {
            if (key === 'AdBlocker') {
                if (on) adStart();
                else adStop();
            } else if (key === 'BetterLeaderBoard') {
                if (on) lbStart();
                else lbStop();
            } else if (key === 'Tracers') {
                if (on) {
                    trRunner = trRunner || makeTracers();
                    trRunner.start();
                } else {
                    if (trRunner) trRunner.stop();
                }
            } else if (key === 'ESP') {
                if (on) {
                    espRunner = espRunner || makeESP();
                    espRunner.start();
                } else {
                    if (espRunner) espRunner.stop();
                }
            } else if (key === 'AutoNick') {
                if (on) startAutoNick();
                else stopAutoNick();
            } else if (key === 'AutoPlay') {
                try {
                    const api = unsafeWindow && unsafeWindow.AutoBot;
                    if (api && typeof api.start === 'function') {
                        if (on) {
                            api.setKill(!!state.AutoPlayKillMode);
                            api.start();
                        } else {
                            api.stop();
                        }
                    } else {
                        injectBot();
                        setTimeout(() => {
                            try {
                                const api2 = unsafeWindow && unsafeWindow.AutoBot;
                                if (api2 && on) {
                                    api2.setKill(!!state.AutoPlayKillMode);
                                    api2.start();
                                } else if (api2 && !on) {
                                    api2.stop();
                                }
                            } catch (e) {}
                        }, 300);
                    }
                } catch (e) {}
            }
        } catch (e) {}
    }

    function applyAll() {
        Object.keys(defaults).forEach(k => {
            if (k === 'visible' || k === 'AutoNickValue') return;
            applyFeature(k, !!state[k]);
        });
    }

    function render() {
        root.innerHTML = `
      <div class="lt-header">
        <div class="lt-title">
          <div class="lt-logo">Limax Client</div>
          <div>
            <div class="lt-h1">Limax Client</div>
            <div class="lt-sub">The game is better with this script :D</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:center"></div>
      </div>

      <div class="lt-grid">
        <div class="lt-card" data-feature="AdBlocker">
          <div class="title-row">
            <h3>AdBlocker</h3>
            <div class="lt-switch ${state.AdBlocker ? 'on' : ''}" data-switch="AdBlocker" role="switch" aria-checked="${!!state.AdBlocker}"><div class="knob"></div></div>
          </div>
          <p class="lt-small">Removes common ads/overlays and forces play handlers to skip banners</p>
        </div>

        <div class="lt-card" data-feature="BetterLeaderBoard">
          <div class="title-row">
            <h3>Better LeaderBoard</h3>
            <div class="lt-switch ${state.BetterLeaderBoard ? 'on' : ''}" data-switch="BetterLeaderBoard" role="switch" aria-checked="${!!state.BetterLeaderBoard}"><div class="knob"></div></div>
          </div>
          <p class="lt-small">Collects player scores and redraws leaderboard with accurate sorting and rank</p>
        </div>

        <div class="lt-card" data-feature="AutoPlay">
          <div class="title-row">
            <h3>Auto Play</h3>
            <div class="lt-switch ${state.AutoPlay ? 'on' : ''}" data-switch="AutoPlay" role="switch" aria-checked="${!!state.AutoPlay}"><div class="knob"></div></div>
          </div>
          <p class="lt-small">Auto-gather & basic combat routines (beta)</p>
          <div class="lt-controls" data-controls-for="AutoPlay" style="display:${state.AutoPlay ? 'flex' : 'none'}">
            <label class="lt-small" style="display:flex;align-items:center;gap:8px">
              <input type="checkbox" class="lt-input-checkbox" id="autoPlayKill" ${state.AutoPlayKillMode ? 'checked' : ''}>
              <span>Kill Mode (beta)</span>
            </label>
          </div>
        </div>

        <div class="lt-card" data-feature="Tracers">
          <div class="title-row">
            <h3>Tracers</h3>
            <div class="lt-switch ${state.Tracers ? 'on' : ''}" data-switch="Tracers" role="switch" aria-checked="${!!state.Tracers}"><div class="knob"></div></div>
          </div>
          <p class="lt-small">Draws smooth curved lines from you to players for easier tracking</p>
        </div>

        <div class="lt-card" data-feature="ESP">
          <div class="title-row">
            <h3>ESP</h3>
            <div class="lt-switch ${state.ESP ? 'on' : ''}" data-switch="ESP" role="switch" aria-checked="${!!state.ESP}"><div class="knob"></div></div>
          </div>
          <p class="lt-small">Predictive lead boxes and visual markers for nearby players</p>
        </div>

        <div class="lt-card" data-feature="AutoNick">
          <div class="title-row">
            <h3>AutoNick</h3>
            <div class="lt-switch ${state.AutoNick ? 'on' : ''}" data-switch="AutoNick" role="switch" aria-checked="${!!state.AutoNick}"><div class="knob"></div></div>
          </div>
          <p class="lt-small">Automatically sets a chosen nickname in game when entering the game and always uses only it</p>
          <div class="lt-controls" data-controls-for="AutoNick" style="display:${state.AutoNick ? 'flex' : 'none'}">
            <input class="lt-input" id="autoNickInput" value="${escapeHtml(state.AutoNickValue || '')}" placeholder="Enter nickname">
            <button class="lt-save-nick lt-input" id="saveNickBtn" style="min-width:88px; cursor:pointer; padding:8px 10px;">Save</button>
            <button class="lt-input" id="clearNickBtn" style="min-width:88px; cursor:pointer; padding:8px 10px;">Clear</button>
          </div>
        </div>
      </div>

      <div class="lt-footer">
        <div></div>
        <div style="display:flex;gap:10px;align-items:center">
          <div class="lt-toggle-key">Right Alt - toggle</div>
          <button class="save" id="lt-close">Close</button>
        </div>
      </div>
    `;
        attachHandlers();
    }

    function attachHandlers() {
        const switches = root.querySelectorAll('[data-switch]');
        switches.forEach(el => {
            el.onclick = async function() {
                const key = this.getAttribute('data-switch');
                state[key] = !state[key];
                if (key === 'AutoPlay' && !state.AutoPlay) state.AutoPlayKillMode = false;
                await saveState();
                applyFeature(key, !!state[key]);
                render();
            };
        });

        const autoPlayKill = root.querySelector('#autoPlayKill');
        if (autoPlayKill) {
            autoPlayKill.onchange = async function() {
                state.AutoPlayKillMode = !!this.checked;
                await saveState();
                try {
                    if (unsafeWindow && unsafeWindow.AutoBot) unsafeWindow.AutoBot.setKill(!!state.AutoPlayKillMode);
                } catch (e) {}
                render();
            };
        }

        const autoNickInput = root.querySelector('#autoNickInput');
        const saveNickBtn = root.querySelector('#saveNickBtn');
        const clearNickBtn = root.querySelector('#clearNickBtn');
        if (autoNickInput && saveNickBtn) {
            saveNickBtn.onclick = async function() {
                state.AutoNickValue = autoNickInput.value.trim();
                await saveState();
            };
            autoNickInput.onkeydown = async function(e) {
                if (e.key === 'Enter') {
                    state.AutoNickValue = autoNickInput.value.trim();
                    await saveState();
                }
            };
            clearNickBtn.onclick = async function() {
                delete state.AutoNickValue;
                await saveState();
                render();
            };
        }

        const closeBtn = root.querySelector('#lt-close');
        closeBtn.onclick = function() {
            toggle(false);
            render();
        };
    }

    function toggle(force) {
        const should = typeof force === 'boolean' ? force : !state.visible;
        state.visible = should;
        saveState();
        if (should) root.classList.add('show');
        else root.classList.remove('show');
    }

    async function saveState() {
        try {
            await gmSet(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {}
    }



    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, function(m) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[m];
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.code === 'AltRight') {
            e.preventDefault();
            toggle();
            render();
            return;
        }
        if (e.key === 'Escape') {
            toggle(false);
            render();
        }
    });

    render();
    applyAll();
    try {
        if (state.AutoPlay) {
            try {
                if (unsafeWindow && unsafeWindow.AutoBot) {
                    unsafeWindow.AutoBot.setKill(!!state.AutoPlayKillMode);
                    unsafeWindow.AutoBot.start();
                }
            } catch (e) {}
        }
    } catch (e) {}
    if (state.visible) toggle(true);

    window.LimaxClient = {
        getState: () => JSON.parse(JSON.stringify(state)),
        setState: async (ns) => {
            state = Object.assign({}, state, ns);
            await saveState();
            applyAll();
            render();
        },
        gmDelete
    };
})();