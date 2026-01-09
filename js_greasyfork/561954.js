// ==UserScript==
// @name         RBX Customize
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customize Roblox with animated backgrounds and fonts.
// @author       Find
// @match        https://*.roblox.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561954/RBX%20Customize.user.js
// @updateURL https://update.greasyfork.org/scripts/561954/RBX%20Customize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        preset: 'matrix',
        transparency: 0.2,
        fontName: '',
        btnPos: { top: 'auto', bottom: '20px', left: 'auto', right: '20px' },
        firstTime: true
    };

    let settings = { ...config, ...GM_getValue('rbx_custom_settings', {}) };
    if (!settings.btnPos) settings.btnPos = config.btnPos;

    let loopId = null;

    const ui = {
        btn: null,
        panel: null,
        overlay: null,
        loader: null
    };

    function start() {
        if (document.getElementById('rbx-custom-btn')) return;

        buildBtn();
        buildMenu();
        render();

        new MutationObserver(() => {
            if (document.body && !document.getElementById('rbx-custom-btn')) {
                start();
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    function buildBtn() {
        ui.btn = document.createElement('div');
        ui.btn.id = 'rbx-custom-btn';
        ui.btn.innerText = 'RBX Customize';

        Object.assign(ui.btn.style, {
            position: 'fixed',
            zIndex: '10001',
            background: '#111',
            color: '#00ffaa',
            border: '2px solid #00ffaa',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(0, 255, 170, 0.3)',
            transition: 'transform 0.1s, top 0.3s, left 0.3s, right 0.3s, bottom 0.3s',
            userSelect: 'none',
            textAlign: 'center',
            fontSize: '14px',
            width: '120px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            ...settings.btnPos
        });

        document.body.appendChild(ui.btn);
        initDrag(ui.btn);

        if (settings.firstTime) {
            tooltip();
            settings.firstTime = false;
            GM_setValue('rbx_custom_settings', settings);
        }
    }

    function buildMenu() {
        ui.panel = document.createElement('div');
        ui.panel.id = 'rbx-custom-panel';

        Object.assign(ui.panel.style, {
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10002',
            background: 'rgba(10, 10, 10, 0.95)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #333',
            display: 'none',
            width: '280px',
            fontFamily: 'sans-serif',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        });

        ui.panel.innerHTML = `
            <h3 style="margin:0 0 10px 0; border-bottom:1px solid #333; padding-bottom:10px; color:#00ffaa; font-size:16px;">RBX Customize</h3>
            <div style="font-size:10px; color:#888; margin-bottom:15px; margin-top:-5px;">Click and hold the RBX customize button to drag it.</div>
            <div style="margin-bottom: 15px;">
                <label style="font-weight:bold; color:#aaa; font-size:11px;">ANIMATION</label>
                <select id="presetSelect" style="width:100%; margin-top:5px; padding:10px; background:#222; color:#fff; border:1px solid #444; border-radius: 4px; cursor:pointer;">
                    <option value="matrix" ${settings.preset === 'matrix' ? 'selected' : ''}>💻 Matrix Rain</option>
                    <option value="fireworks" ${settings.preset === 'fireworks' ? 'selected' : ''}>🎆 Fireworks</option>
                    <option value="storm" ${settings.preset === 'storm' ? 'selected' : ''}>⚡ Thunderstorm</option>
                    <option value="neural" ${settings.preset === 'neural' ? 'selected' : ''}>🧠 Neural Link</option>
                    <option value="snow" ${settings.preset === 'snow' ? 'selected' : ''}>❄️ Night Snow</option>
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="font-weight:bold; color:#aaa; font-size:11px;">FONT (Google Fonts)</label>
                <input type="text" id="fontInput" value="${settings.fontName}" placeholder="e.g. Orbitron" style="width: 100%; padding: 8px; margin-top:5px; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 20px;">
                 <label style="font-weight:bold; font-size:11px; color:#aaa;">TRANSPARENCY</label>
                 <input type="range" id="transparencyInput" min="0" max="1" step="0.05" value="${settings.transparency}" style="width: 100%; margin-top:5px;">
            </div>
            <div style="display:flex; gap: 10px;">
                <button id="saveBtn" style="flex:1; padding: 10px; background: #00ffaa; color: #000; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">APPLY</button>
                <button id="closeBtn" style="padding: 10px 15px; background: #333; color: #fff; border: none; border-radius: 6px; cursor: pointer;">X</button>
            </div>
        `;

        document.body.appendChild(ui.panel);

        document.getElementById('closeBtn').onclick = () => ui.panel.style.display = 'none';

        document.getElementById('saveBtn').onclick = () => {
            const btn = document.getElementById('saveBtn');
            settings.preset = document.getElementById('presetSelect').value;
            settings.transparency = document.getElementById('transparencyInput').value;
            settings.fontName = document.getElementById('fontInput').value.trim();
            settings.btnPos = {
                top: ui.btn.style.top, bottom: ui.btn.style.bottom,
                left: ui.btn.style.left, right: ui.btn.style.right
            };

            GM_setValue('rbx_custom_settings', settings);
            render();

            btn.innerText = "SAVED!";
            setTimeout(() => btn.innerText = "APPLY", 2000);
        };
    }

    function buildLoader() {
        if (ui.loader) ui.loader.remove();

        ui.loader = document.createElement('div');
        ui.loader.id = 'rbx-drag-loader';
        Object.assign(ui.loader.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '24px', height: '24px',
            display: 'none', pointerEvents: 'none'
        });

        ui.loader.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" style="transform: rotate(-90deg);">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" stroke-width="3" fill="none"></circle>
                <circle id="rbx-progress-ring" cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="3" fill="none"
                 stroke-dasharray="63" stroke-dashoffset="63" style="transition: stroke-dashoffset 0.05s linear;"></circle>
            </svg>
        `;

        ui.btn.appendChild(ui.loader);
    }

    function initDrag(el) {
        let dragging = false;
        let holding = false;
        let t1 = null;
        let t2 = null;
        let start = { x: 0, y: 0 };
        let offset = { l: 0, t: 0 };
        let time = 0;

        buildLoader();

        el.onmousedown = (e) => {
            if (e.button !== 0) return;

            const ring = document.getElementById('rbx-progress-ring');
            if (ring) {
                ring.style.transition = 'none';
                ring.style.strokeDashoffset = '63';
                void ring.offsetWidth;
                ring.style.transition = 'stroke-dashoffset 0.05s linear';
            }

            holding = true;
            start = { x: e.clientX, y: e.clientY };
            const rect = el.getBoundingClientRect();
            offset = { l: rect.left, t: rect.top };
            time = Date.now();

            t1 = setTimeout(() => {
                if (!holding) return;

                ui.loader.style.display = 'block';
                el.style.color = 'transparent';

                t2 = setInterval(() => {
                    if (!holding) {
                         clearInterval(t2);
                         return;
                    }
                    const diff = Date.now() - time;
                    const pct = Math.min(100, Math.max(0, ((diff - 200) / 800) * 100));

                    if (ring) {
                        const val = 63 - (63 * pct / 100);
                        ring.style.strokeDashoffset = val;
                    }

                    if (pct >= 100) {
                        clearInterval(t2);
                        dragging = true;
                        ui.panel.style.display = 'none';
                        el.style.transition = 'none';
                        el.style.cursor = 'move';
                        ui.loader.style.display = 'none';
                        el.style.color = '#00ffaa';
                        overlay(true);
                        const t = document.getElementById('rbx-drag-tip');
                        if(t) t.remove();
                    }
                }, 16);

            }, 200);
        };

        document.onmousemove = (e) => {
            if (!dragging) return;
            el.style.left = (offset.l + (e.clientX - start.x)) + 'px';
            el.style.top = (offset.t + (e.clientY - start.y)) + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
        };

        document.onmouseup = () => {
            if (t1) clearTimeout(t1);
            if (t2) clearInterval(t2);

            if (ui.loader) ui.loader.style.display = 'none';
            ui.btn.style.color = '#00ffaa';

            if (dragging) {
                dragging = false;
                holding = false;
                overlay(false);
                el.style.transition = 'top 0.3s, left 0.3s, right 0.3s, bottom 0.3s';
                el.style.cursor = 'pointer';
                snap(el);
            }
            else if (holding) {
                holding = false;
                ui.panel.style.display = ui.panel.style.display === 'none' ? 'block' : 'none';
            }
        };
    }

    function overlay(active) {
        if (active) {
            ui.overlay = document.createElement('div');
            Object.assign(ui.overlay.style, {
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0, 0, 0, 0.7)',
                zIndex: '10000', pointerEvents: 'none'
            });

            const zones = [
                { top: '20px', left: '20px' },
                { top: '20px', right: '20px' },
                { bottom: '20px', left: '20px' },
                { bottom: '20px', right: '20px' }
            ];

            zones.forEach(pos => {
                const z = document.createElement('div');
                Object.assign(z.style, {
                    position: 'absolute', width: '120px', height: '40px',
                    border: '2px dashed rgba(255,255,255,0.5)',
                    borderRadius: '8px', boxSizing: 'border-box',
                    ...pos
                });
                ui.overlay.appendChild(z);
            });

            document.body.appendChild(ui.overlay);
        } else {
            if (ui.overlay) ui.overlay.remove();
        }
    }

    function snap(el) {
        const r = el.getBoundingClientRect();
        const w = window.innerWidth;
        const h = window.innerHeight;

        const d = [
            Math.hypot(r.left, r.top),
            Math.hypot(w - r.right, r.top),
            Math.hypot(r.left, h - r.bottom),
            Math.hypot(w - r.right, h - r.bottom)
        ];

        const m = Math.min(...d);
        let p = {};

        if (m === d[0]) p = { top: '20px', left: '20px', bottom: 'auto', right: 'auto' };
        else if (m === d[1]) p = { top: '20px', right: '20px', bottom: 'auto', left: 'auto' };
        else if (m === d[2]) p = { bottom: '20px', left: '20px', top: 'auto', right: 'auto' };
        else p = { bottom: '20px', right: '20px', top: 'auto', left: 'auto' };

        Object.assign(el.style, p);
        settings.btnPos = p;
        GM_setValue('rbx_custom_settings', settings);
    }

    function tooltip() {
        const t = document.createElement('div');
        t.id = 'rbx-drag-tip';
        t.innerText = 'Drag me!';
        Object.assign(t.style, {
            position: 'absolute', top: '-45px', left: '50%', transform: 'translateX(-50%)',
            background: 'white', color: 'black', padding: '8px 12px', borderRadius: '6px',
            fontSize: '14px', fontWeight: 'bold', pointerEvents: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
        });

        const a = document.createElement('div');
        Object.assign(a.style, {
            position: 'absolute', bottom: '-5px', left: '50%', marginLeft: '-5px',
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: '5px solid white'
        });

        t.appendChild(a);
        ui.btn.appendChild(t);
        setTimeout(() => { if(t) t.remove(); }, 5000);
    }

    function render() {
        if (loopId) clearInterval(loopId);
        const old = document.getElementById('rbx-canvas');
        if (old) old.remove();

        switch (settings.preset) {
            case 'matrix': matrix(); break;
            case 'fireworks': fireworks(); break;
            case 'storm': storm(); break;
            case 'neural': neural(); break;
            case 'snow': snow(); break;
        }

        const fid = 'rbx-font-link';
        let fl = document.getElementById(fid);
        if (fl) fl.remove();

        let fcss = '';
        if (settings.fontName) {
            fl = document.createElement('link');
            fl.id = fid;
            fl.rel = 'stylesheet';
            fl.href = `https://fonts.googleapis.com/css2?family=${settings.fontName.replace(/ /g, '+')}&display=swap`;
            document.head.appendChild(fl);
            fcss = `* { font-family: '${settings.fontName}', sans-serif !important; }`;
        }

        const sid = 'rbx-injected-css';
        let st = document.getElementById(sid);
        if (!st) {
            st = document.createElement('style');
            st.id = sid;
            document.head.appendChild(st);
        }

        st.innerHTML = `
            ${fcss}
            body, .dark-theme, .light-theme, .container-main, #Container { background: transparent !important; background-image: none !important; }
            .content, .container-footer, .footer, .rbx-header, #wrap.wrap,
            .game-home-page-container, .section-content, .rbx-tab-content,
            .profile-header, .rbx-left-col, .rbx-right-col, .rbx-game-status,
            .chat-container, .chat-main, .dialog-container, .navbar-search {
                background-color: rgba(20, 20, 20, ${settings.transparency}) !important; border: none !important; box-shadow: none !important;
            }
            .text-footer-nav, .text-copyright, .text-link, h1, h2, h3, p, div { color: #fff !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
            .rbx-header { backdrop-filter: blur(5px); background-color: rgba(0, 0, 0, 0.6) !important; }
            .ad-container, .gutter-ads, #Skyscraper-Adp-Right, #Skyscraper-Adp-Left { display: none !important; }
        `;
    }

    function canvas(c) {
        const el = document.createElement('canvas');
        el.id = 'rbx-canvas';
        Object.assign(el.style, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: '-1', background: c });
        el.width = window.innerWidth;
        el.height = window.innerHeight;
        document.body.appendChild(el);
        return el;
    }

    function matrix() {
        const c = canvas('black');
        const ctx = c.getContext('2d');
        const set = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリBg0123456789'.split('');
        const arr = Array(Math.floor(c.width / 16)).fill(1);

        loopId = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.fillStyle = '#0F0';
            ctx.font = '16px monospace';

            arr.forEach((y, i) => {
                const t = set[Math.floor(Math.random() * set.length)];
                ctx.fillText(t, i * 16, y * 16);
                if (y * 16 > c.height && Math.random() > 0.975) arr[i] = 0;
                arr[i]++;
            });
        }, 33);
    }

    function fireworks() {
        const c = canvas('#050505');
        const ctx = c.getContext('2d');
        let f = [], p = [];

        loopId = setInterval(() => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.globalCompositeOperation = 'lighter';

            if (Math.random() < 0.04) {
                f.push({ x: Math.random() * c.width, y: c.height, tx: Math.random() * c.width, ty: Math.random() * c.height / 2, h: Math.random() * 360 });
            }

            for (let i = f.length - 1; i >= 0; i--) {
                let r = f[i];
                r.x += (r.tx - r.x) / 15;
                r.y += (r.ty - r.y) / 15;
                ctx.beginPath(); ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${r.h}, 100%, 50%)`; ctx.fill();
                if (Math.hypot(r.tx - r.x, r.ty - r.y) < 15) {
                    for(let j=0; j<40; j++) p.push({ x: r.x, y: r.y, vx: Math.cos(j*10)*Math.random()*6, vy: Math.sin(j*10)*Math.random()*6, h: r.h, a: 1 });
                    f.splice(i, 1);
                }
            }

            for (let i = p.length - 1; i >= 0; i--) {
                let pt = p[i];
                pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.08; pt.a -= 0.08;
                if (pt.a <= 0) p.splice(i, 1);
                else { ctx.beginPath(); ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2); ctx.fillStyle = `hsla(${pt.h}, 100%, 50%, ${pt.a})`; ctx.fill(); }
            }
        }, 25);
    }

    function storm() {
        const c = canvas('#050505');
        const ctx = c.getContext('2d');
        const r = Array(300).fill().map(() => ({ x: Math.random()*c.width, y: Math.random()*c.height, l: Math.random()*20+10, v: Math.random()*10+10 }));
        let fl = { on: false, op: 0, s: [] };

        loopId = setInterval(() => {
            if (fl.op > 0) {
                ctx.fillStyle = `rgba(20, 20, 30, ${fl.op * 0.3})`;
                ctx.fillRect(0,0,c.width, c.height);
                fl.op -= 0.05;
            } else {
                ctx.fillStyle = 'rgba(5, 5, 5, 0.4)';
                ctx.fillRect(0,0,c.width, c.height);
                if (Math.random() > 0.985) {
                    fl.on = true; fl.op = 1;
                    let sx = Math.random() * c.width, sy = 0;
                    fl.s = [{x:sx, y:sy}];
                    while(sy < c.height) { sx += (Math.random()-0.5)*50; sy += Math.random()*20+10; fl.s.push({x:sx, y:sy}); }
                } else fl.on = false;
            }

            if (fl.on || fl.op > 0.5) {
                ctx.beginPath(); ctx.strokeStyle = `rgba(255, 255, 255, ${fl.op})`; ctx.lineWidth = 2;
                ctx.shadowBlur = 15; ctx.shadowColor = "white";
                fl.s.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
                ctx.stroke(); ctx.shadowBlur = 0;
            }

            ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)'; ctx.lineWidth = 1; ctx.beginPath();
            r.forEach(d => {
                ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.l);
                d.y += d.v;
                if (d.y > c.height) { d.y = -20; d.x = Math.random() * c.width; }
            });
            ctx.stroke();
        }, 30);
    }

    function neural() {
        const c = canvas('#111');
        const ctx = c.getContext('2d');
        const pt = Array(80).fill().map(() => ({ x: Math.random()*c.width, y: Math.random()*c.height, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2 }));

        loopId = setInterval(() => {
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.fillStyle = '#00ffaa'; ctx.strokeStyle = '#00ffaa';

            pt.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > c.width) p.vx *= -1;
                if (p.y < 0 || p.y > c.height) p.vy *= -1;
                ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();

                for (let j = i + 1; j < pt.length; j++) {
                    let p2 = pt[j];
                    let d = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (d < 150) {
                        ctx.beginPath(); ctx.lineWidth = 1 - (d/150);
                        ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                    }
                }
            });
        }, 30);
    }

    function snow() {
        const c = canvas('radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)');
        const ctx = c.getContext('2d');
        const fl = Array(100).fill().map(() => ({ x: Math.random()*c.width, y: Math.random()*c.height, r: Math.random()*3+1, d: Math.random()*100 }));

        loopId = setInterval(() => {
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.fillStyle = "white"; ctx.beginPath();
            fl.forEach(f => {
                ctx.moveTo(f.x, f.y); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2, true);
                f.y += Math.cos(f.d) + 1 + f.r/2;
                f.x += Math.sin(f.d) * 2;
                if (f.x > c.width + 5 || f.x < -5 || f.y > c.height) { f.x = Math.random()*c.width; f.y = -10; }
            });
            ctx.fill();
        }, 33);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

})();