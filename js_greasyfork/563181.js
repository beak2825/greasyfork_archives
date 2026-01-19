// ==UserScript==
// @name         Universal Video Sniffer: Speedster (v14.0 Realtime Stats & Resize Fix)
// @namespace    http://tampermonkey.net/
// @version      14.0
// @description  Fix dimensione Canvas, FPS reali GPU, Info Risoluzione Scalata. Default CINEMA.
// @author       Carmelo Battiato
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/563181/Universal%20Video%20Sniffer%3A%20Speedster%20%28v140%20Realtime%20Stats%20%20Resize%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563181/Universal%20Video%20Sniffer%3A%20Speedster%20%28v140%20Realtime%20Stats%20%20Resize%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Speedster v14.0 - Performance Edition");
    const VER = "14.0";
    const CFG = { ext: /\.(mp4|m3u8|flv|webm|mov|avi|mkv|mpd)(\?|$)/i, ign: /doubleclick|googlead|analytics|adsystem|segment|prebid/i };
    const FOUND = new Set(), ACTIVE = new Set();
    const STORE_KEY = "uvs_v14_config";
    let CURRENT_SRC = ""; 

    GM_addStyle(`
        #uvs-c{position:fixed;top:60px;left:50%;transform:translateX(-50%);width:500px;background:#0f0f0f;color:#ccc;z-index:2147483647;border-radius:8px;box-shadow:0 10px 40px #000;font-family:system-ui,sans-serif;display:none;flex-direction:column;border:1px solid #333;font-size:13px}
        #uvs-h{padding:10px;background:#1a1a1a;border-bottom:1px solid #333;display:flex;justify-content:space-between;font-weight:700;color:#fff}
        #uvs-l{overflow-y:auto;padding:10px;max-height:550px;display:flex;flex-direction:column;gap:10px}
        .uvs-i{background:#161616;padding:10px;border-radius:6px;border:1px solid #2a2a2a}.uvs-u{font-size:10px;color:#666;overflow:hidden;text-overflow:ellipsis;background:#0a0a0a;padding:4px;font-family:monospace;margin:5px 0}
        .uvs-a{display:flex;gap:5px}.uvs-b{border:none;padding:8px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:800;flex:1;color:#fff;text-transform:uppercase}
        .pb{background:#2ea043}.cb{background:#333}.tb{background:#e63946}.db{background:#f39c12}
        .pw{display:none;margin-top:8px;background:#111;padding:8px;border-radius:4px}.bar-c{height:8px;background:#333;border-radius:4px;overflow:hidden;margin-top:4px}.bar{height:100%;background:#e63946;width:0%}
        .bg{position:fixed;top:10px;left:50%;transform:translateX(-50%);background:#141414f2;border:1px solid #444;color:#fff;padding:6px 16px;border-radius:20px;font-weight:600;font-size:13px;cursor:pointer;z-index:2147483646;display:none}
    `);

    // --- GOOGLE CAST SDK ---
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    (document.head || document.documentElement).appendChild(script);

    const mainUi = document.createElement('div'), badge = document.createElement('div');
    mainUi.id = 'uvs-c'; mainUi.innerHTML = `<div id="uvs-h"><span>Speedster v${VER}</span><div>⚡ <input type="number" id="uvs-th" value="5" min="1" style="width:40px;background:#333;border:none;color:#fff;text-align:center"> <span id="uvs-x" style="cursor:pointer;margin-left:10px">×</span></div></div><div id="uvs-l"></div>`;
    badge.className = 'bg'; badge.innerHTML = 'VIDEO: <span id="bc">0</span>';
    (document.documentElement || document.body).appendChild(mainUi);
    (document.documentElement || document.body).appendChild(badge);

    document.getElementById('uvs-x').onclick = () => { mainUi.style.display = 'none'; if(FOUND.size > 0) badge.style.display = 'block'; };
    badge.onclick = () => { mainUi.style.display = 'flex'; badge.style.display = 'none'; };

    const req = (u, b) => new Promise((ok, no) => GM_xmlhttpRequest({ method: "GET", url: u, responseType: b ? 'arraybuffer' : 'text', onload: r => r.status < 300 ? ok(r.response) : no(r.status), onerror: no }));
    const getTi = () => (document.querySelector('meta[property="og:title"]')?.content || document.title || "Video").replace(/\s[-|]\s?.*/, '').trim();

    async function dl(u, gui, fn, ct) {
        const { bar, txt, th, sb, pb } = gui;
        try {
            txt.innerText = "Analisi...";
            let m = await req(u), base = u.slice(0, u.lastIndexOf('/') + 1);
            if (ct.stop) throw "Stop";
            if (m.includes('#EXT-X-STREAM-INF')) {
                let sub = (m.match(/^(?!#)(.*\.m3u8)$/m) || [])[1];
                return dl(sub.startsWith('http') ? sub : base + sub, gui, fn, ct);
            }
            let seg = m.split('\n').map(l => l.trim()).filter(l => l && l[0] != '#').map(l => l.startsWith('http') ? l : base + l);
            ACTIVE.add(ct);
            let tot = seg.length, chk = new Array(tot), cmp = 0, act = 0, err = 0;
            txt.innerText = "Avvio..."; sb.style.display = pb.style.display = "inline-block"; th.innerText = "T:0";
            return new Promise((ok, no) => {
                ct.res = () => { txt.innerText = "..."; next() };
                ct.kill = () => { ACTIVE.delete(ct); no("Stop") };
                ct.upd = () => next();
                const next = () => {
                    if (ct.stop || ct.pause) return (ct.pause && (txt.innerText = `Pausa ${cmp}/${tot}`));
                    if (err || cmp === tot) return fin();
                    let max = parseInt(document.getElementById('uvs-th').value) || 5;
                    while (act < max && cmp < tot) { if (ct.stop || ct.pause) return; proc(cmp++); }
                };
                const proc = async (i) => {
                    if (ct.stop) { act--; return; } act++; th.innerText = "T:" + act;
                    try {
                        let d = await req(seg[i], 1);
                        if (ct.stop) { act--; return; }
                        chk[i] = new Uint8Array(d); cmp++; act--; th.innerText = "T:" + act;
                        if (cmp % 2 == 0 || cmp == tot) {
                            let p = Math.round(cmp / tot * 100); bar.style.width = p + '%'; if (!ct.pause) txt.innerText = `${p}% (${cmp}/${tot})`;
                        }
                        next();
                    } catch (e) { if (ct.stop) return; err = 1; txt.innerText = "Err"; ACTIVE.delete(ct); no(e); }
                };
                const fin = () => {
                    ACTIVE.delete(ct); if (ct.stop) return;
                    sb.style.display = pb.style.display = "none"; txt.innerText = "Unione...";
                    setTimeout(() => {
                        try {
                            let b = new Blob(chk, { type: 'video/mp4' }), a = document.createElement('a');
                            a.href = URL.createObjectURL(b); a.download = fn; document.body.appendChild(a); a.click(); a.remove();
                            txt.innerText = "Fatto!"; ok();
                        } catch (e) { no(e) }
                    }, 50);
                };
                next();
            });
        } catch (e) { ACTIVE.delete(ct); throw e; }
    }

    function add(u, src) {
        if (FOUND.has(u)) return; FOUND.add(u);
        let ti = getTi(), isH = u.includes('.m3u8'), div = document.createElement('div');
        div.className = 'uvs-i';
        div.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:9px"><span style="color:#4db8ff;font-weight:800">${isH ? 'M3U8' : 'VID'}</span><span>${src}</span></div>
            <div style="font-weight:600;white-space:nowrap;overflow:hidden">${ti}</div><div class="uvs-u">${u}</div><div class="uvs-a"><button class="uvs-b pb">PLAY</button><button class="uvs-b cb">COPY</button><button class="uvs-b ${isH ? 'tb' : 'db'}">${isH ? 'DOWNLOAD' : 'SCARICA'}</button></div>
            <div class="pw"><div class="sr"><span class="st" style="color:#eee">Wait</span><div style="display:flex;gap:10px;align-items:center"><span class="th" style="font-family:monospace;font-size:11px;color:#aaa"></span><button class="uvs-b psb" style="display:none;background:#f39c12;color:#000">PAUSE</button><button class="uvs-b sb" style="display:none;background:#b71c1c;color:#fff">STOP</button></div></div><div class="bar-c"><div class="bar"></div></div></div>`;

        div.querySelector('.pb').onclick = () => openUltimatePlayer(u, ti, isH);
        div.querySelector('.cb').onclick = e => { GM_setClipboard(u); e.target.innerText = "OK"; setTimeout(() => e.target.innerText = "COPY", 1000) };

        if (isH) {
            let tb = div.querySelector('.tb'), sb = div.querySelector('.sb'), pb = div.querySelector('.psb'), ct = { stop: 0, pause: 0 };
            tb.onclick = () => {
                ct.stop = 0; ct.pause = 0; sb.disabled = 0; sb.innerText = "STOP";
                div.querySelector('.pw').style.display = 'block'; div.querySelector('.bar').style.width = '0%'; div.querySelector('.st').innerText = "Attesa..."; tb.disabled = 1;
                let gui = { bar: div.querySelector('.bar'), txt: div.querySelector('.st'), th: div.querySelector('.th'), sb, pb };
                sb.onclick = () => { ct.stop = 1; sb.innerText = "..."; sb.disabled = 1; if(ct.kill) ct.kill(); };
                pb.onclick = () => { ct.pause = !ct.pause; pb.innerText = ct.pause ? "RESUME" : "PAUSE"; pb.style.background = ct.pause ? "#2ea043" : "#f39c12"; if (!ct.pause && ct.res) ct.res() };
                dl(u, gui, ti + ".mp4", ct).then(() => { tb.disabled = 0 }).catch(e => { tb.disabled = 0; if (e == "Stop") { gui.txt.innerText = "Annullato"; gui.bar.style.width = "0%"; sb.style.display = pb.style.display = "none" } else { gui.txt.innerText = "Err"; gui.txt.style.color = "red" } });
            };
        } else { div.querySelector('.db').onclick = () => GM_download({ url: u, name: ti + ".mp4", saveAs: true }); }
        document.getElementById('uvs-l').prepend(div); document.getElementById('bc').innerText = FOUND.size; if (FOUND.size == 1) badge.style.display = 'block';
    }

    function openUltimatePlayer(u, ti, isHls) {
        CURRENT_SRC = u;
        const svgFilters = `
        <svg width="0" height="0" style="position:absolute;z-index:-1;visibility:hidden">
            <defs>
                <filter id="sh-low"><feConvolveMatrix order="3" kernelMatrix="0 -0.2 0 -0.2 1.8 -0.2 0 -0.2 0"/></filter>
                <filter id="sh-soft"><feConvolveMatrix order="3" kernelMatrix="0 -0.5 0 -0.5 3 -0.5 0 -0.5 0"/></filter>
                <filter id="sh-med"><feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"/></filter>
                <filter id="sh-hard"><feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 9 -1 -1 -1 -1"/></filter>
                <filter id="sh-ultra"><feConvolveMatrix order="3" kernelMatrix="-2 -2 -2 -2 17 -2 -2 -2 -2"/></filter>
            </defs>
        </svg>`;

        const html = `<!doctype html><html><head><meta charset="UTF-8"><title>${ti}</title><link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css"/><style>
            body{margin:0;background:#000;font-family:system-ui,sans-serif;color:#fff;overflow:hidden;user-select:none}
            #wrapper { position: relative; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; background:#000; }
            #viewport { display: flex; width: 100%; height: 100%; z-index: 10; position: relative; }
            .video-pane { position: relative; height: 100%; width: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; transition: width 0.3s ease; }
            .pane-half { width: 50% !important; border-right: 2px solid #4db8ff; }
            .plyr { width: 100%; height: 100%; }
            video { width: 100% !important; height: 100% !important; object-fit: contain; transition: transform 0.3s; }
            
            /* CANVAS LAYERS INSIDE PLYR */
            #grid_layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; display: none; mix-blend-mode: difference; transition: transform 0.3s; }
            #matrix_layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; display: none; mix-blend-mode: hard-light; opacity: 1; image-rendering: auto; will-change: contents; transition: filter 0.2s, transform 0.3s; }
            #up_canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1; pointer-events: none; display: none; }

            #v_comp_pane { background: #000; position: absolute; right: 0; width: 0; height: 100%; z-index: 11; border-left: 2px solid #4db8ff; transition: width 0.3s ease; display: none; }
            #v_comp { width: 100%; height: 100%; object-fit: contain; }
            .pane-label { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.7); padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; color: #4db8ff; z-index: 15; text-transform: uppercase; border: 1px solid #333; }
            .gear-btn{position:absolute;top:20px;left:20px;font-size:24px;cursor:pointer;z-index:2147483647 !important;text-shadow:0 2px 4px #000;opacity:0.7;transition:0.3s}
            
            .safe-zone { position: absolute; z-index: 2147483646; transition: 0.2s; }
            .sz-nav { top: 50%; transform: translateY(-50%); width: 140px; height: 140px; }
            .sz-left { left: 0; }
            .sz-right { right: 0; }
            .sz-gear { top: 0; left: 0; width: 100px; height: 100px; }
            .sz-center { top: 50%; left: 50%; transform: translate(-50%, -50%); width: 150px; height: 150px; cursor: pointer; }

            .skip-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 42px; height: 42px; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; cursor: pointer; transition: 0.2s; z-index: 2147483647 !important; border: 1px solid rgba(255,255,255,0.2); }
            .skip-prev { left: 20px; } .skip-next { right: 20px; }
            .feedback { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); padding: 15px 30px; border-radius: 40px; font-size: 32px; font-weight: 900; z-index: 2147483647; pointer-events: none; opacity: 0; transition: 0.1s; }
            .overlay{position:absolute;top:60px;left:20px;background:rgba(18,18,18,0.98);padding:0;border-radius:12px;z-index:2147483647 !important;width:340px;backdrop-filter:blur(10px);box-shadow:0 10px 30px #000;display:none;animation:fadeIn .2s; border:1px solid #333; overflow:hidden}
            @keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
            .tabs { display:flex; background:#0a0a0a; border-bottom:1px solid #333; }
            .tab { flex:1; text-align:center; padding:10px 0; cursor:pointer; font-size:11px; font-weight:bold; color:#777; transition:0.2s; text-transform:uppercase; }
            .tab.active { color:#4db8ff; border-bottom:2px solid #4db8ff; background:#1a1a1a; }
            .panel-content { padding:15px; display:none; max-height:450px; overflow-y:auto; scrollbar-width: thin; scrollbar-color: #333 transparent; }
            .panel-content.active { display:block; }
            .row { margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; font-size:11px; gap: 5px; }
            label { width:65px; color:#aaa; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
            
            .sl-w { position: relative; flex:1; height: 16px; display:flex; align-items:center; }
            input[type=range] { width:100%; height:4px; cursor:pointer; accent-color:#4db8ff; margin:0; }
            .dot { position: absolute; width: 4px; height: 4px; background: #e74c3c; border-radius: 50%; top: -3px; pointer-events: none; z-index: 5; transform: translateX(-50%); box-shadow: 0 0 2px #000; transition: left 0.2s; }
            
            .lim { width: 34px; background: #222; border: 1px solid #444; color: #888; font-size: 10px; text-align: center; padding: 3px 0; border-radius: 3px; font-family: monospace; }
            .lim:focus { color: #fff; border-color: #4db8ff; outline: none; background: #333; }
            
            select { background:#222; color:#fff; border:1px solid #444; padding:4px; border-radius:4px; font-size:11px; flex:1; outline:none }
            .tit { font-weight:800; margin:15px 0 8px 0; color:#888; border-bottom:1px solid #333; padding-bottom:4px; text-transform:uppercase; font-size:10px; cursor:pointer }
            .val-label { width:32px; text-align:right; font-family:monospace; color:#4db8ff; font-size:10px; }
            .btn-row { display: flex; gap: 5px; margin-top: 10px; }
            button.main-btn { flex: 1; background:#333; border:none; color:#fff; padding:10px; cursor:pointer; font-weight:bold; font-size:11px; text-transform:uppercase; border-radius: 6px; transition: 0.2s }
            button.main-btn:hover { background: #444; }
            #rst_hard { background:#b71c1c; }
            #save_cfg { background:#2ea043; }
            
            #sec-up { display: none; background: #111; padding: 10px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #222; }
            #sec-up.open { display: block; }
            .warn { color: #f39c12; font-size: 10px; margin-bottom: 8px; display: block; }
            .err { color: #e74c3c; font-size: 10px; font-weight: bold; }
            
            .fade-out { opacity: 0 !important; pointer-events: none !important; }
            .resume-prompt { position: absolute; bottom: 80px; left: 20px; background: #2ea043; padding: 10px 15px; border-radius: 8px; z-index: 2147483647 !important; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 15px #000; opacity: 0; transform: translateY(20px); transition: all 0.3s; pointer-events: none; font-weight: 600; }
            .switch { position: relative; display: inline-block; width: 30px; height: 16px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .4s; border-radius: 34px; }
            .slider:before { position: absolute; content: ""; height: 10px; width: 10px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: #4db8ff; }
            input:checked + .slider:before { transform: translateX(14px); }

            #log_win { height: 350px; background: #000; border: 1px solid #333; overflow-y: scroll; font-family: 'Courier New', monospace; font-size: 10px; padding: 5px; color: #ccc; margin-bottom: 10px; scrollbar-width: thin; scrollbar-color: #444 #111; }
            .log-line { border-bottom: 1px solid #111; padding: 1px 0; display: block; word-break: break-all; }
            .l-trace { color: #666; } .l-debug { color: #f1c40f; } .l-info { color: #2ea043; } .l-err { color: #e74c3c; font-weight: bold; }
            #log_btns { display: flex; gap: 5px; }
            #log_btns button { background: #222; border: 1px solid #444; color: #aaa; flex: 1; padding: 6px; cursor: pointer; border-radius: 4px; font-size: 10px; text-transform: uppercase; font-weight: bold; transition: 0.2s }
            #log_btns button:hover { background: #333; color: #fff; }
            #log_copy:hover { border-color: #2ea043; color: #2ea043 !important; }
            #log_down:hover { border-color: #3498db; color: #3498db !important; }
            #log_clr:hover { border-color: #e74c3c; color: #e74c3c !important; }
            
            #cast_btn { margin-bottom: 10px; width: 100%; background: #0d47a1; color: #fff; border: 1px solid #444; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; text-transform: uppercase; font-size: 11px; display: none; }
            #cast_btn.casting { background: #b71c1c; }
        </style></head><body>
        ${svgFilters}
        <div id="wrapper">
            <div id="viewport">
                <div class="video-pane" id="v_main_pane">
                    <video id="p" controls crossorigin="anonymous" playsinline></video>
                    <!-- These will be moved by JS -->
                    <canvas id="up_canvas"></canvas>
                    <canvas id="matrix_layer"></canvas>
                    <div id="grid_layer"></div>
                </div>
                <div id="v_comp_pane"><span class="pane-label" id="comp_lbl">Confronto</span><video id="v_comp" muted playsinline></video></div>
            </div>
            
            <div class="safe-zone sz-nav sz-left" id="sz_left"></div>
            <div class="safe-zone sz-nav sz-right" id="sz_right"></div>
            <div class="safe-zone sz-gear" id="sz_gear"></div>
            <div class="safe-zone sz-center" id="sz_center"></div>
            
            <div class="gear-btn" id="gear">&#9881;</div>
            <div class="skip-btn skip-prev" id="b_prev">⏪</div>
            <div class="skip-btn skip-next" id="b_next">⏩</div>
            
            <div class="feedback" id="feedback"></div>
            <div class="resume-prompt" id="resume_box"><span id="resume_txt">Riprendere?</span><button style="background:#fff;color:#2ea043;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-weight:bold" id="resume_yes">Sì</button><span style="cursor:pointer;margin-left:8px" id="resume_no">×</span></div>
            
            <div class="overlay" id="panel">
                <div class="tabs"><div class="tab active" data-tab="vid">Video</div><div class="tab" data-tab="aud">Audio</div><div class="tab" data-tab="log">Logs</div><div class="tab" data-tab="inf">Info</div></div>
                <div class="panel-content active" id="tab-vid">
                    <button id="cast_btn">TRASMETTI (CAST)</button>
                    <div class="tit" id="toggle_up">Upscaling (Sperimentale) ▼</div>
                    <div id="sec-up">
                        <span class="warn">⚠️ Alto consumo GPU. Nessun automatismo.</span>
                        <div class="row"><label>Stato</label><label class="switch"><input type="checkbox" id="up_chk"><span class="slider"></span></label></div>
                        <div class="row"><label>Preset</label><select id="up_preset">
                            <option value="perf">Performance</option>
                            <option value="bal" selected>Balanced</option>
                            <option value="qual">Quality</option>
                            <option value="cust">Custom</option>
                        </select></div>
                        <div class="row"><label>Output</label><select id="up_res">
                            <option value="native" selected>Nativa Schermo</option>
                            <option value="1080">Full HD (1080p)</option>
                            <option value="2160">4K (2160p)</option>
                            <option value="4320">8K (4320p)</option>
                        </select></div>
                        <div class="row"><label>Algo</label><select id="up_algo">
                            <option value="bicubic">Bicubic</option>
                            <option value="lanczos2" selected>Lanczos 2</option>
                            <option value="lanczos3">Lanczos 3</option>
                        </select></div>
                        <div class="row"><label>Radius</label><input type="range" id="up_rad" min="1" max="4" step="0.1" value="2"><span id="lbl_up_rad" class="val-label">2.0</span></div>
                        <div class="row"><label>Sharpen</label><input type="range" id="up_sharp" min="0" max="1" step="0.1" value="0"><span id="lbl_up_sharp" class="val-label">0.0</span></div>
                        <div class="row"><label>Stat</label><span id="up_stat" style="color:#aaa;font-size:10px">OFF</span></div>
                    </div>

                    <div class="tit">HDR Engine</div>
                    <div class="row"><label>Standard</label><select id="hdr_mode">
                        <option value="custom">Custom (Libero)</option>
                        <option value="hdr_std">HDR Standard (Dyn)</option>
                        <option value="hdr_10">HDR10 (Dyn)</option>
                        <option value="hdr_plus">HDR10+ (Global Dyn)</option>
                        <option value="hdr_dv" selected>Dolby Vision (Granular)</option>
                    </select></div>
                    <div class="row"><label>Preset</label><select id="hdr_preset">
                        <option value="SPORT">SPORT (High Brightness)(</option>
                        <option value="vivid">Vivid / TV (Bilanciato)</option>
                        <option value="CINEMA" selected>CINEMA (OLED Perfect Black)</option>
                        <option value="game">Gaming (Saturazione)</option>
                    </select></div>
                    <div class="row"><label>Livello FX</label><select id="hdr_lv">
                        <option value="1">Livello 1 (±10%)</option>
                        <option value="2">Livello 2 (±20%)</option>
                        <option value="3">Livello 3 (±30%)</option>
                        <option value="4">Livello 4 (±40%)</option>
                        <option value="5" selected>Livello 5 (±50%)</option>
                    </select></div>

                    <div class="tit">Local Dimming & Grid</div>
                    <div class="row"><label>Risoluzione</label><select id="grid_res">
                        <option value="none">Off</option><option value="1">1x1 (Full)</option><option value="3">3x3 (Terzi)</option>
                        <option value="10">10x10</option><option value="50">50x50</option>
                        <option value="100">100x100</option><option value="500">500x500 (⚠️)</option><option value="1000">1000x1000 (☠️)</option>
                    </select></div>
                    <div class="row"><label>Active Dimming</label><label class="switch"><input type="checkbox" id="matrix_chk"><span class="slider"></span></label></div>
                    <div class="row"><label>Vedi Griglia</label><label class="switch"><input type="checkbox" id="grid_vis_chk"><span class="slider"></span></label></div>

                    <div class="tit">SPORT Grading (Live Avg)</div>
                    <div class="row"><label>Luce</label><input type="number" class="lim min" data-id="bri" value="0.5" step="0.1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="bri" min="0.5" max="1.5" step="0.01" value="1"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="bri" value="1.5" step="0.1"><span class="val-label" id="lbl_bri">100%</span></div>
                    <div class="row"><label>Ombre</label><input type="number" class="lim min" data-id="sha" value="0.5" step="0.1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="sha" min="0.5" max="1.5" step="0.01" value="1"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="sha" value="1.5" step="0.1"><span class="val-label" id="lbl_sha">100%</span></div>
                    <div class="row"><label>Scuri</label><input type="number" class="lim min" data-id="gam" value="0.5" step="0.1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="gam" min="0.5" max="1.5" step="0.01" value="1"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="gam" value="1.5" step="0.1"><span class="val-label" id="lbl_gam">100%</span></div>
                    <div class="row"><label>Highl.</label><input type="number" class="lim min" data-id="hig" value="0.5" step="0.1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="hig" min="0.5" max="1.5" step="0.01" value="1"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="hig" value="1.5" step="0.1"><span class="val-label" id="lbl_hig">100%</span></div>
                    <div class="row"><label>Contr.</label><input type="number" class="lim min" data-id="con" value="0.5" step="0.1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="con" min="0.5" max="1.5" step="0.01" value="1"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="con" value="1.5" step="0.1"><span class="val-label" id="lbl_con">100%</span></div>
                    <div class="row"><label>Satur.</label><input type="number" class="lim min" data-id="sat" value="0" step="0.1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="sat" min="0" max="2" step="0.01" value="1"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="sat" value="2" step="0.1"><span class="val-label" id="lbl_sat">100%</span></div>
                    <div class="row"><label>Vibr.</label><input type="number" class="lim min" data-id="vib" value="0.5" step="0.1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="vib" min="0.5" max="1.5" step="0.01" value="1"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="vib" value="1.5" step="0.1"><span class="val-label" id="lbl_vib">100%</span></div>

                    <div class="tit">Display & Dettaglio</div>
                    <div class="row"><label>Confronto</label><select id="comp_sel"><option value="none">Nessuno</option><option value="orig">Originale</option><option value="hdr_std">HDR Standard</option><option value="hdr_10">HDR10</option><option value="hdr_plus">HDR10+</option><option value="hdr_dv">Dolby Vision</option></select></div>
                    <div class="row"><label>Nitidezza</label><select id="us_sel">
                        <option value="none">Off</option><option value="sh-low">Bassa</option><option value="sh-soft">Soft</option><option value="sh-med" selected>Media</option><option value="sh-hard">Alta</option><option value="sh-ultra">Ultra</option>
                    </select></div>
                    <div class="row"><label>Formato</label><select id="ar_sel"><option value="contain">Adatta</option><option value="cover">Riempi</option><option value="fill">Stretch</option><option value="scale_1.25">Zoom 125%</option><option value="scale_1.5">Zoom 150%</option></select></div>
                </div>
                <div class="panel-content" id="tab-aud">
                    <div class="tit">Master & Sync</div>
                    <div class="row"><label>Boost</label><input type="number" class="lim min" data-id="vol" value="0" step="0.5"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="vol" min="0" max="5" step="0.1" value="1"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="vol" value="5" step="0.5"><span id="lbl_vol" class="val-label">100%</span></div>
                    <div class="row"><label>Sync</label><input type="number" class="lim min" data-id="sync" value="0" step="0.1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="sync" min="0" max="2" step="0.05" value="0"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="sync" value="2" step="0.1"><span id="lbl_sync" class="val-label">0</span></div>
                    <div class="row"><label>Night Mode</label><label class="switch"><input type="checkbox" id="night_chk"><span class="slider"></span></label></div>

                    <div class="tit">Equalizzatore 5 Bande</div>
                    <div class="row"><label>60Hz</label><input type="number" class="lim min" data-id="eq_b" value="-12" step="1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="eq_b" min="-12" max="12" step="1" value="0"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="eq_b" value="12" step="1"><span id="lbl_eq_b" class="val-label">0dB</span></div>
                    <div class="row"><label>250Hz</label><input type="number" class="lim min" data-id="eq_lb" value="-12" step="1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="eq_lb" min="-12" max="12" step="1" value="0"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="eq_lb" value="12" step="1"><span id="lbl_eq_lb" class="val-label">0dB</span></div>
                    <div class="row"><label>1kHz</label><input type="number" class="lim min" data-id="eq_m" value="-12" step="1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="eq_m" min="-12" max="12" step="1" value="0"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="eq_m" value="12" step="1"><span id="lbl_eq_m" class="val-label">0dB</span></div>
                    <div class="row"><label>4kHz</label><input type="number" class="lim min" data-id="eq_mh" value="-12" step="1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="eq_mh" min="-12" max="12" step="1" value="0"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="eq_mh" value="12" step="1"><span id="lbl_eq_mh" class="val-label">0dB</span></div>
                    <div class="row"><label>12kHz</label><input type="number" class="lim min" data-id="eq_h" value="-12" step="1"><div class="sl-w"><span class="dot d-min"></span><input type="range" id="eq_h" min="-12" max="12" step="1" value="0"><span class="dot d-max"></span></div><input type="number" class="lim max" data-id="eq_h" value="12" step="1"><span id="lbl_eq_h" class="val-label">0dB</span></div>
                </div>
                <div class="panel-content" id="tab-log">
                    <div class="tit">Logs di Sistema</div>
                    <div class="row"><label>Livello</label><select id="log_lvl">
                        <option value="0">TRACE (Tutto)</option>
                        <option value="1">DEBUG (Tecnico)</option>
                        <option value="2" selected>INFO (Standard)</option>
                        <option value="3">ERROR (Critico)</option>
                    </select></div>
                    <div id="log_win"></div>
                    <div id="log_btns">
                        <button id="log_copy">COPY</button>
                        <button id="log_down">DOWNLOAD</button>
                        <button id="log_clr">CLEAR</button>
                    </div>
                </div>
                <div class="panel-content" id="tab-inf">
                    <div class="tit">Software Info</div>
                    <div class="row"><span>Versione</span><span class="info-val">v${VER} Master</span></div>
                    <div class="row"><span>Sviluppatore</span><span class="info-val">Carmelo Battiato</span></div>
                    <div class="row"><span>Email</span><span class="info-val" style="font-size:11px">b84car@yahoo.it</span></div>
                    
                    <div class="tit">Metadata Realtime</div>
                    <div class="row"><span>MaxCLL (Peak)</span><span class="info-val" id="i_cll">- nits</span></div>
                    <div class="row"><span>MaxFALL (Avg)</span><span class="info-val" id="i_fall">- nits</span></div>
                    
                    <div class="tit">Stream Stats</div>
                    <div class="row"><span>Risoluzione</span><span class="info-val" id="i_res">-</span></div>
                    <div class="row"><span>Buffer</span><span class="info-val" id="i_buf">0.0s</span></div>
                    <div class="row"><span>FPS Realtime</span><span class="info-val" id="i_fps">0</span></div>
                </div>
                <div class="btn-row">
                    <button id="save_cfg" class="main-btn">SALVA DEFAULT</button>
                    <button id="rst_hard" class="main-btn">RESET</button>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/hls.js"></script><script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
        <script>
            // --- LOGGER SYSTEM ---
            const LOG_LEVELS = { TRACE: 0, DEBUG: 1, INFO: 2, ERROR: 3 };
            let currentLogLevel = 2; // Default Info
            const logWin = document.getElementById('log_win');
            
            function logger(level, msg) {
                if (level < currentLogLevel) return;
                console.log("[Speedster]", msg); 
                const span = document.createElement('span');
                span.className = 'log-line';
                const ts = new Date().toLocaleTimeString().split(' ')[0];
                if (level === 0) { span.classList.add('l-trace'); span.innerText = \`[TRC] \${ts} > \${msg}\`; }
                else if (level === 1) { span.classList.add('l-debug'); span.innerText = \`[DBG] \${ts} > \${msg}\`; }
                else if (level === 2) { span.classList.add('l-info'); span.innerText = \`[INF] \${ts} > \${msg}\`; }
                else { span.classList.add('l-err'); span.innerText = \`[ERR] \${ts} > \${msg}\`; }
                logWin.appendChild(span);
                logWin.scrollTop = logWin.scrollHeight;
            }
            
            document.getElementById('log_lvl').onchange = (e) => { 
                currentLogLevel = parseInt(e.target.value); 
                logger(2, "Livello log impostato a: " + e.target.options[e.target.selectedIndex].text);
            };
            
            document.getElementById('log_copy').onclick = async (e) => {
                const txt = Array.from(logWin.children).map(c => c.innerText).join('\\n');
                try { await navigator.clipboard.writeText(txt); e.target.innerText = "COPIATO!"; } 
                catch(err) { GM_setClipboard(txt); e.target.innerText = "COPIATO (GM)!"; }
                setTimeout(() => e.target.innerText = "COPY", 1500);
            };
            
            document.getElementById('log_down').onclick = (e) => {
                const txt = Array.from(logWin.children).map(c => c.innerText).join('\\n');
                const blob = new Blob([txt], {type: 'text/plain'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url;
                a.download = "speedster_log_" + new Date().toLocaleTimeString().replace(/:/g,'') + ".txt";
                a.click(); URL.revokeObjectURL(url);
            };

            document.getElementById('log_clr').onclick = () => { logWin.innerHTML = ''; logger(2, "Log puliti."); };
            
            logger(2, "Speedster v${VER} inizializzato.");

            // CAST LOGIC
            const castBtn = document.getElementById('cast_btn');
            window['__onGCastApiAvailable'] = (isAvailable) => {
                if (isAvailable) {
                    cast.framework.CastContext.getInstance().setOptions({
                        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                    });
                    castBtn.style.display = 'block';
                    logger(2, "Google Cast API Available");
                }
            };

            castBtn.onclick = () => {
                const ctx = cast.framework.CastContext.getInstance();
                if(ctx.getCastState() === cast.framework.CastState.CONNECTED) {
                    ctx.endCurrentSession(true);
                    castBtn.innerText = "TRASMETTI (CAST)";
                    castBtn.classList.remove('casting');
                    logger(2, "Cast Session Ended");
                } else {
                    ctx.requestSession().then(session => {
                        const mediaInfo = new chrome.cast.media.MediaInfo(CURRENT_SRC, 'video/mp4');
                        const request = new chrome.cast.media.LoadRequest(mediaInfo);
                        session.loadMedia(request).then(() => {
                            castBtn.innerText = "STOP CAST";
                            castBtn.classList.add('casting');
                            logger(2, "Cast Started: " + CURRENT_SRC);
                        }).catch(e => logger(3, "Cast Load Error: " + e));
                    }).catch(e => logger(3, "Cast Session Error: " + e));
                }
            };

            // WEBGL UPSCALER CLASS
            class WebGLUpscaler {
                constructor(video, canvas) {
                    this.video = video; this.canvas = canvas; this.gl = null; this.prog = null; this.tex = null; this.raf = null;
                    this.active = false; this.lastT = 0; this.frames = 0; this.fps = 0;
                    this.cfg = { res: 'native', algo: 'lanczos2', radius: 2.0, sharp: 0.0 };
                    this.maxTexSize = 4096; 
                    this.width = 0; this.height = 0;
                }
                init() {
                    if(this.active) return;
                    this.gl = this.canvas.getContext('webgl', {preserveDrawingBuffer:false});
                    if(!this.gl) { logger(3, "WebGL failed init"); return; }
                    this.maxTexSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE) || 4096;
                    logger(1, "WebGL Init. MaxTex: " + this.maxTexSize);
                    this.active = true; this.canvas.style.display = 'block';
                    this.compile(); this.loop();
                }
                compile() {
                    if(!this.gl) return;
                    logger(0, "Compilazione Shader: " + this.cfg.algo);
                    const vSh = 'attribute vec2 p;varying vec2 uv;void main(){uv=p*0.5+0.5;uv.y=1.0-uv.y;gl_Position=vec4(p,0,1);}';
                    let fSh = 'precision mediump float;uniform sampler2D t;uniform vec2 r;varying vec2 uv;uniform float rad;uniform float sharp;';
                    
                    if(this.cfg.algo === 'bicubic') {
                        fSh += 'float w(float x){float a=-0.5;x=abs(x);if(x<1.0)return(a+2.0)*x*x*x-(a+3.0)*x*x+1.0;if(x<2.0)return a*x*x*x-5.0*a*x*x+8.0*a*x-4.0*a;return 0.0;}';
                        fSh += 'vec4 smp(vec2 p){vec2 tex=p/r;return texture2D(t,tex);}';
                        fSh += 'void main(){vec2 uvP=uv*r;vec2 ip=floor(uvP);vec2 fp=fract(uvP);vec4 sum=vec4(0);float wSum=0.0;for(int y=-1;y<=2;y++){for(int x=-1;x<=2;x++){float wt=w(float(x)-fp.x)*w(float(y)-fp.y);sum+=smp(ip+vec2(float(x),float(y)))*wt;wSum+=wt;}}gl_FragColor=sum/wSum;}';
                    } else {
                        fSh += 'float sinc(float x){if(x==0.0)return 1.0;return sin(3.14159*x)/(3.14159*x);}';
                        fSh += 'float l(float x){if(abs(x)<rad)return sinc(x)*sinc(x/rad);return 0.0;}';
                        fSh += 'void main(){vec2 uvP=uv*r;vec2 ip=floor(uvP);vec2 fp=fract(uvP);vec4 sum=vec4(0);float wSum=0.0;';
                        fSh += 'for(int y=-4;y<=4;y++){ if(abs(float(y)) >= rad) continue; for(int x=-4;x<=4;x++){ if(abs(float(x)) >= rad) continue; float wt=l(float(x)-fp.x)*l(float(y)-fp.y);sum+=texture2D(t,(ip+vec2(float(x),float(y)))/r)*wt;wSum+=wt;}}vec4 col=sum/wSum;';
                        fSh += 'if(sharp>0.0){vec4 c=texture2D(t,uv);col=mix(col,c+(col-c)*(1.0+sharp),0.5);}gl_FragColor=col;}';
                    }

                    const vs = this.gl.createShader(this.gl.VERTEX_SHADER); this.gl.shaderSource(vs, vSh); this.gl.compileShader(vs);
                    const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER); this.gl.shaderSource(fs, fSh); this.gl.compileShader(fs);
                    
                    if(!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) { logger(3, this.gl.getShaderInfoLog(fs)); return; }

                    this.prog = this.gl.createProgram(); this.gl.attachShader(this.prog, vs); this.gl.attachShader(this.prog, fs); this.gl.linkProgram(this.prog);
                    
                    if (!this.gl.getProgramParameter(this.prog, this.gl.LINK_STATUS)) { logger(3, "Link Error"); return; }
                    
                    this.gl.useProgram(this.prog);

                    const buf = this.gl.createBuffer(); this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), this.gl.STATIC_DRAW);
                    const loc = this.gl.getAttribLocation(this.prog, 'p'); this.gl.enableVertexAttribArray(loc); this.gl.vertexAttribPointer(loc, 2, this.gl.FLOAT, false, 0, 0);

                    this.tex = this.gl.createTexture(); this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
                    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                }
                update(cfg) { Object.assign(this.cfg, cfg); if(this.active) this.compile(); }
                stop() { this.active = false; cancelAnimationFrame(this.raf); this.canvas.style.display = 'none'; logger(1, "Upscaler fermato"); }
                loop() {
                    if(!this.active) return;
                    this.raf = requestAnimationFrame(() => this.loop());
                    if(this.video.paused || this.video.ended || !this.video.videoWidth) return;

                    let w, h;
                    if(this.cfg.res === 'native') { w = window.innerWidth; h = window.innerHeight; }
                    else if(this.cfg.res === '1080') { w=1920; h=1080; }
                    else if(this.cfg.res === '2160') { w=3840; h=2160; }
                    else { w=7680; h=4320; }
                    
                    if(w > this.maxTexSize) { w = this.maxTexSize; h = (w / (this.video.videoWidth/this.video.videoHeight)); }
                    
                    this.width = w; this.height = h;

                    if(this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width=w; this.canvas.height=h; this.gl.viewport(0,0,w,h); }

                    try {
                        this.gl.activeTexture(this.gl.TEXTURE0); this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
                        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.video);
                        
                        this.gl.uniform1i(this.gl.getUniformLocation(this.prog, 't'), 0);
                        this.gl.uniform2f(this.gl.getUniformLocation(this.prog, 'r'), this.video.videoWidth, this.video.videoHeight);
                        this.gl.uniform1f(this.gl.getUniformLocation(this.prog, 'rad'), this.cfg.radius);
                        this.gl.uniform1f(this.gl.getUniformLocation(this.prog, 'sharp'), this.cfg.sharp);
                        
                        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
                        
                        const now = performance.now(); this.frames++;
                        if(now - this.lastT >= 1000) { this.fps = this.frames; this.frames=0; this.lastT=now; document.getElementById('up_stat').innerText = this.fps + " FPS"; }
                    } catch(e) { 
                        this.stop(); logger(3, "GPU Error: " + e); document.getElementById('up_stat').innerText = "GPU ERROR - OFF"; 
                        document.getElementById('up_chk').checked = false; 
                    }
                }
            }

            // --- Main Application Logic ---
            const v = document.getElementById('p'), vComp = document.getElementById('v_comp');
            const panel = document.getElementById('panel'), gear = document.getElementById('gear'), gridLayer = document.getElementById('grid_layer'), mCanvas = document.getElementById('matrix_layer'), mCtx = mCanvas.getContext('2d', {alpha: true});
            const b_prev = document.getElementById('b_prev'), b_next = document.getElementById('b_next'), fb = document.getElementById('feedback');
            const sz_left = document.getElementById('sz_left'), sz_right = document.getElementById('sz_right'), sz_gear = document.getElementById('sz_gear'), sz_center = document.getElementById('sz_center');
            const vMainPane = document.getElementById('v_main_pane'), vCompPane = document.getElementById('v_comp_pane');
            const hiddenCanvas = document.createElement('canvas'); const hCtx = hiddenCanvas.getContext('2d', {willReadFrequently:true});
            let ac, src, gain, delayNode, idleTimer, eqFilters = [];
            const storeKey = 'uvs_pos_' + encodeURIComponent("${u}").substring(0, 50);

            // WebGL Canvas
            const upCanvas = document.getElementById('up_canvas');
            const upscaler = new WebGLUpscaler(v, upCanvas);

            let lastFPSUpdate = performance.now();
            let lastFrameCount = 0;

            if(Hls.isSupported() && ${isHls}) {
                const h = new Hls({maxBufferLength:300, maxMaxBufferLength:600}); h.loadSource("${u}"); h.attachMedia(v);
                const hc = new Hls(); hc.loadSource("${u}"); hc.attachMedia(vComp);
            } else { v.src = vComp.src = "${u}"; }
            
            const player = new Plyr(v, { autoplay:1, controls:['play-large','play','progress','current-time','mute','volume','settings','pip','fullscreen'], settings:['quality','speed','loop'], fullscreen: { container: '#wrapper' } });
            v.onplay = () => { vComp.play(); logger(2, "Video playing"); }; 
            v.onpause = () => { vComp.pause(); logger(2, "Video paused"); };
            v.onseeking = () => { vComp.currentTime = v.currentTime; };
            v.onseeked = () => { vComp.currentTime = v.currentTime; };
            setInterval(() => { if(!v.paused && Math.abs(v.currentTime - vComp.currentTime) > 0.25) vComp.currentTime = v.currentTime; }, 500);

            v.addEventListener('ready', () => { 
                const pDiv = document.querySelector('.plyr'); 
                if(pDiv) { 
                    [upCanvas, mCanvas, gridLayer].forEach(el => pDiv.appendChild(el));
                    [gear, b_prev, b_next, fb, panel, document.getElementById('resume_box'), sz_left, sz_right, sz_gear, sz_center].forEach(el => pDiv.appendChild(el)); 
                    pDiv.addEventListener('dblclick', e => { e.preventDefault(); e.stopPropagation(); }); 
                } 
            });

            const inputs = { 
                comp: document.getElementById('comp_sel'), hdr: document.getElementById('hdr_mode'), lv: document.getElementById('hdr_lv'), preset: document.getElementById('hdr_preset'),
                bri: document.getElementById('bri'), sha: document.getElementById('sha'), gam: document.getElementById('gam'), 
                hig: document.getElementById('hig'), con: document.getElementById('con'), sat: document.getElementById('sat'), 
                vib: document.getElementById('vib'), ar: document.getElementById('ar_sel'), 
                sh: document.getElementById('us_sel'), vol: document.getElementById('vol'), sync: document.getElementById('sync'), night: document.getElementById('night_chk'),
                res: document.getElementById('grid_res'), matrix: document.getElementById('matrix_chk'), showGrid: document.getElementById('grid_vis_chk'),
                eq_b: document.getElementById('eq_b'), eq_lb: document.getElementById('eq_lb'), eq_m: document.getElementById('eq_m'), eq_mh: document.getElementById('eq_mh'), eq_h: document.getElementById('eq_h'),
                up_chk: document.getElementById('up_chk'), up_preset: document.getElementById('up_preset'), up_res: document.getElementById('up_res'),
                up_algo: document.getElementById('up_algo'), up_rad: document.getElementById('up_rad'), up_sharp: document.getElementById('up_sharp')
            };
            
            document.getElementById('toggle_up').onclick = () => { document.getElementById('sec-up').classList.toggle('open'); };
            
            const applyUpPreset = () => {
                const p = inputs.up_preset.value;
                if(p === 'perf') { inputs.up_algo.value = 'bicubic'; inputs.up_rad.value = 1; inputs.up_sharp.value = 0; }
                else if(p === 'bal') { inputs.up_algo.value = 'lanczos2'; inputs.up_rad.value = 2; inputs.up_sharp.value = 0; }
                else if(p === 'qual') { inputs.up_algo.value = 'lanczos3'; inputs.up_rad.value = 3; inputs.up_sharp.value = 0.2; }
                ['up_rad','up_sharp'].forEach(k => document.getElementById('lbl_'+k).innerText = inputs[k].value);
                updUpscaler();
            };
            inputs.up_preset.onchange = applyUpPreset;

            const updUpscaler = () => {
                if(inputs.up_chk.checked) {
                    upscaler.init();
                    upscaler.update({
                        res: inputs.up_res.value, algo: inputs.up_algo.value,
                        radius: parseFloat(inputs.up_rad.value), sharp: parseFloat(inputs.up_sharp.value)
                    });
                    logger(2, "Upscaler attivo: " + inputs.up_algo.value);
                } else {
                    upscaler.stop();
                    document.getElementById('up_stat').innerText = "OFF";
                }
            };
            
            [inputs.up_chk, inputs.up_res, inputs.up_algo, inputs.up_rad, inputs.up_sharp].forEach(i => i.addEventListener('input', updUpscaler));
            inputs.up_rad.addEventListener('input', e => document.getElementById('lbl_up_rad').innerText = e.target.value);
            inputs.up_sharp.addEventListener('input', e => document.getElementById('lbl_up_sharp').innerText = e.target.value);

            function updateDots(t, minVal, maxVal) {
                const parent = t.parentNode;
                const minDot = parent.querySelector('.d-min');
                const maxDot = parent.querySelector('.d-max');
                const range = parseFloat(t.getAttribute('max')) - parseFloat(t.getAttribute('min'));
                const minOffset = ((minVal - parseFloat(t.getAttribute('min'))) / range) * 100;
                const maxOffset = ((maxVal - parseFloat(t.getAttribute('min'))) / range) * 100;
                minDot.style.left = minOffset + '%'; maxDot.style.left = maxOffset + '%';
            }

            document.querySelectorAll('.lim').forEach(i => {
                i.onchange = (e) => {
                    const t = document.getElementById(i.dataset.id);
                    let minV = parseFloat(document.querySelector('.lim.min[data-id="'+i.dataset.id+'"]').value);
                    let maxV = parseFloat(document.querySelector('.lim.max[data-id="'+i.dataset.id+'"]').value);
                    if(i.classList.contains('min')) { t.min = i.value; if(parseFloat(t.value) < parseFloat(i.value)) t.value = i.value; } 
                    else { t.max = i.value; if(parseFloat(t.value) > parseFloat(i.value)) t.value = i.value; }
                    updateDots(t, minV, maxV); upd(false);
                };
                const t = document.getElementById(i.dataset.id);
                if(t) {
                   let minV = parseFloat(document.querySelector('.lim.min[data-id="'+i.dataset.id+'"]').value);
                   let maxV = parseFloat(document.querySelector('.lim.max[data-id="'+i.dataset.id+'"]').value);
                   updateDots(t, minV, maxV); 
                }
            });

            function initAudio() {
                if(ac) return; try {
                    const AC = window.AudioContext || window.webkitAudioContext; ac = new AC(); src = ac.createMediaElementSource(v);
                    const freqs = [60, 250, 1000, 4000, 12000]; const types = ['lowshelf', 'peaking', 'peaking', 'peaking', 'highshelf'];
                    let lastNode = src;
                    eqFilters = freqs.map((f, i) => { const filter = ac.createBiquadFilter(); filter.type = types[i]; filter.frequency.value = f; filter.Q.value = 1; filter.gain.value = 0; lastNode.connect(filter); lastNode = filter; return filter; });
                    delayNode = ac.createDelay(5.0); gain = ac.createGain(); lastNode.connect(delayNode); delayNode.connect(gain); gain.connect(ac.destination);
                    logger(1, "AudioContext initialized");
                } catch(e) { logger(3, "Audio init error: " + e); }
            }
            v.addEventListener('play', () => { initAudio(); if(ac && ac.state==='suspended') ac.resume(); });

            function updateInfoStats() {
                if(inputs.up_chk.checked && upscaler.active) {
                    document.getElementById('i_res').innerText = v.videoWidth + "x" + v.videoHeight + " ➔ " + upscaler.width + "x" + upscaler.height;
                    document.getElementById('i_fps').innerText = upscaler.fps + " (GPU)";
                } else {
                    document.getElementById('i_res').innerText = v.videoWidth + "x" + v.videoHeight;
                    // Standard FPS calculation
                    if (!v.paused && !v.ended) {
                        const now = performance.now();
                        const quality = v.getVideoPlaybackQuality();
                        const currentFrames = quality.totalVideoFrames;
                        if (now - lastFPSUpdate >= 500) {
                            const deltaFrames = currentFrames - lastFrameCount;
                            const deltaTime = (now - lastFPSUpdate) / 1000;
                            document.getElementById('i_fps').innerText = Math.round(deltaFrames / deltaTime);
                            lastFrameCount = currentFrames;
                            lastFPSUpdate = now;
                        }
                    } else {
                        document.getElementById('i_fps').innerText = "0";
                    }
                }
                requestAnimationFrame(updateInfoStats);
            }
            updateInfoStats(); // Start loop

            let matrixStats = { bri:0, sha:0, gam:0, con:0, sat:0, count:0 };

            function syncOverlays() {
                if(!v.videoWidth) return;
                const mode = inputs.ar.value; 
                const wrapperRatio = v.clientWidth / v.clientHeight; 
                const videoRatio = v.videoWidth / v.videoHeight; 
                let finalW, finalH, finalTop, finalLeft;

                if (mode === 'fill') {
                    finalW = v.clientWidth; finalH = v.clientHeight; finalTop = 0; finalLeft = 0;
                } else if (mode === 'cover') {
                    if (wrapperRatio > videoRatio) { finalW = v.clientWidth; finalH = finalW / videoRatio; } else { finalH = v.clientHeight; finalW = finalH * videoRatio; }
                    finalTop = (v.clientHeight - finalH) / 2; finalLeft = (v.clientWidth - finalW) / 2;
                } else {
                    if (wrapperRatio > videoRatio) { finalH = v.clientHeight; finalW = finalH * videoRatio; } else { finalW = v.clientWidth; finalH = finalW / videoRatio; }
                    finalTop = (v.clientHeight - finalH) / 2; finalLeft = (v.clientWidth - finalW) / 2;
                }

                [gridLayer, mCanvas, upCanvas].forEach(el => {
                    el.style.width = finalW + 'px'; el.style.height = finalH + 'px'; el.style.left = finalLeft + 'px'; el.style.top = finalTop + 'px';
                });
            }
            window.addEventListener('resize', syncOverlays);
            setInterval(syncOverlays, 1000); 

            function processAdaptiveHDR() {
                const mode = inputs.hdr.value; 
                if(mode !== 'custom' && (!inputs.matrix.checked || inputs.res.value === 'none')) {
                    try {
                        if(hiddenCanvas.width !== 16) { hiddenCanvas.width = 16; hiddenCanvas.height = 16; }
                        hCtx.drawImage(v, 0, 0, 16, 16); const d = hCtx.getImageData(0, 0, 16, 16).data;
                        let maxL = 0, avgL = 0;
                        for(let i=0; i<d.length; i+=4) { 
                            let l = (0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2]); 
                            if(l > maxL) maxL = l; avgL += l;
                        }
                        const avg = (avgL / 256) / 255;
                        calcGlobalParams(avg, maxL/255);
                        upd(true);
                    } catch(e) {}
                }
                
                if(inputs.matrix.checked && inputs.res.value !== 'none') {
                    processMatrixHDR();
                }
            }

            function calcGlobalParams(avg, max) {
                 const linearFactor = parseInt(inputs.lv.value) * 0.1;
                 const delta = (0.5 - avg);
                 const p = getPresetParams();
                 document.getElementById('i_cll').innerText = Math.round(max * 4000) + " nits";
                 document.getElementById('i_fall').innerText = Math.round(avg * 1000) + " nits";
                 if (inputs.preset.value === 'SPORT' && avg < 0.2) {
                     inputs.sha.value = 0.5 + (0.3 * (1 - avg*5)); 
                 }
                 applyParams(delta, linearFactor, p);
            }
            
            function processMatrixHDR() {
                try {
                    syncOverlays();
                    const n = parseInt(inputs.res.value);
                    if(hiddenCanvas.width !== n) { hiddenCanvas.width = n; hiddenCanvas.height = n; }
                    hCtx.drawImage(v, 0, 0, n, n);
                    const frame = hCtx.getImageData(0, 0, n, n);
                    const d = frame.data;
                    const blurVal = Math.max(0, 500 / n / 2); 
                    mCanvas.style.filter = "blur(" + blurVal + "px)";
                    if(mCanvas.width !== n) { mCanvas.width = n; mCanvas.height = n; }
                    const mImgData = mCtx.createImageData(n, n);
                    const md = mImgData.data;
                    const p = getPresetParams();
                    const lf = parseInt(inputs.lv.value) * 0.1;
                    const presetName = inputs.preset.value;
                    matrixStats = { bri:0, sha:0, gam:0, con:0, sat:0, count:0 };

                    for(let i=0; i < d.length; i+=4) {
                        const r = d[i], g = d[i+1], b = d[i+2];
                        const lum = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
                        const delta = 0.5 - lum;
                        matrixStats.bri += (1.0 + (delta * lf * p.b));
                        matrixStats.sha += (1.0 - (delta * lf * p.s));
                        matrixStats.gam += (1.0 + (delta * lf * p.g));
                        matrixStats.con += (1.0 + (lf * p.c));
                        matrixStats.sat += (1.0 + (delta * lf * p.sa));
                        matrixStats.count++;
                        if(lum < 0.3) {
                            md[i] = 0; md[i+1] = 0; md[i+2] = 0; 
                            let alphaFactor = (presetName === 'SPORT') ? 3.0 : 1.2;
                            md[i+3] = (0.35 - lum) * lf * 255 * alphaFactor; 
                        } else if(lum > 0.6) {
                            md[i] = 255; md[i+1] = 255; md[i+2] = 255; 
                            md[i+3] = (lum - 0.6) * lf * 255 * 0.8;
                        } else { md[i+3] = 0; }
                    }
                    mCtx.putImageData(mImgData, 0, 0); 
                    mCanvas.style.display = 'block';
                    if(matrixStats.count > 0) {
                         const lerp = (cur, tar) => parseFloat(cur) * 0.85 + tar * 0.15;
                         inputs.bri.value = lerp(inputs.bri.value, matrixStats.bri / matrixStats.count);
                         inputs.sha.value = lerp(inputs.sha.value, matrixStats.sha / matrixStats.count);
                         inputs.gam.value = lerp(inputs.gam.value, matrixStats.gam / matrixStats.count);
                         inputs.con.value = lerp(inputs.con.value, matrixStats.con / matrixStats.count);
                         inputs.sat.value = lerp(inputs.sat.value, matrixStats.sat / matrixStats.count);
                         upd(true);
                    }
                } catch(e) { console.error(e); }
            }

            function getPresetParams() {
                 const PR = {
                    SPORT: { b: 0.95, s: 1.8, g: 1.3, h: 1.0, c: 1.5, sa: 0.2, v: 0.2 }, 
                    CINEMA:  { b: 1.3, s: 0.2, g: 0.9, h: 0.5, c: 1.1, sa: 0.3, v: 0.6 },
                    vivid:  { b: 1.2, s: 1.2, g: 1.1, h: 1.0, c: 1.1, sa: 0.12, v: 0.4 },
                    game:   { b: 1.5, s: 1.4, g: 1.8, h: 1.0, c: 0.9, sa: 0.40, v: 0.6 }
                };
                return PR[inputs.preset.value] || PR.CINEMA;
            }

            function applyParams(delta, linearFactor, p) {
                let tSha = 1.0 - (delta * linearFactor * p.s); 
                let tBri = 1.0 + (delta * linearFactor * p.b);
                let tGam = 1.0 + (delta * linearFactor * p.g);
                let tHig = 1.0 - (delta * linearFactor * p.h);
                let tCon = 1.0 + (linearFactor * p.c);
                let tSat = 1.0 + (delta * linearFactor * p.sa);
                let tVib = 1.0 + (delta * linearFactor * p.v);
                const lerp = (cur, tar) => parseFloat(cur) * 0.85 + tar * 0.15;
                const safeSet = (el, val) => {
                   let v = val;
                   if(v < parseFloat(el.min)) v = parseFloat(el.min);
                   if(v > parseFloat(el.max)) v = parseFloat(el.max);
                   el.value = lerp(el.value, v);
                };
                safeSet(inputs.bri, tBri); safeSet(inputs.sha, tSha); safeSet(inputs.hig, tHig);
                safeSet(inputs.con, tCon); safeSet(inputs.gam, tGam); safeSet(inputs.sat, tSat); safeSet(inputs.vib, tVib);
            }

            function upd(isAuto = false) {
                const comp = inputs.comp.value;
                if(comp !== 'none') { vMainPane.className = 'video-pane pane-half'; vCompPane.style.display = 'block'; vCompPane.style.width = '50%'; } 
                else { vMainPane.className = 'video-pane pane-full'; vCompPane.style.display = 'none'; vCompPane.style.width = '0'; }
                
                const ar = inputs.ar.value; 
                let transformVal = 'scale(1)';
                if(ar.startsWith('scale')) { v.style.objectFit = 'contain'; transformVal = "scale("+ar.split('_')[1]+")"; } 
                else { v.style.objectFit = ar; transformVal = 'scale(1)'; }
                
                v.style.transform = transformVal;
                gridLayer.style.transform = transformVal;
                mCanvas.style.transform = transformVal;
                // Upscale canvas transform
                upCanvas.style.transform = transformVal;

                if(!isAuto) syncOverlays();

                const sha = (parseFloat(inputs.sha.value) - 1) * 45; 
                const gam = (parseFloat(inputs.gam.value) - 1) * 35;
                const hig = (parseFloat(inputs.hig.value) - 1) * 55;
                const vib = (parseFloat(inputs.vib.value) - 1) * 65;

                let f = "brightness("+inputs.bri.value+") contrast("+inputs.con.value+") saturate("+inputs.sat.value+") contrast("+(1 + (sha/100))+") brightness("+(1 - (hig/200))+") hue-rotate("+(gam/5)+"deg)";
                if(vib > 0) f += " saturate("+(1 + (vib/100))+")";
                if(inputs.sh.value !== 'none') f += " url(#"+inputs.sh.value+")";
                
                // If upscaling is ON, apply filter to CANVAS, else to VIDEO
                if(inputs.up_chk.checked) {
                    v.style.filter = 'none';
                    v.style.opacity = '0'; // Hide original video
                    upCanvas.style.display = 'block';
                    upCanvas.style.filter = f;
                } else {
                    v.style.filter = f;
                    v.style.opacity = '1';
                    upCanvas.style.display = 'none';
                }
                
                ['bri','sha','gam','hig','con','sat','vib'].forEach(k => document.getElementById('lbl_'+k).innerText = Math.round(inputs[k].value * 100) + '%');
                if(gain) gain.gain.value = inputs.vol.value; document.getElementById('lbl_vol').innerText = Math.round(inputs.vol.value*100)+'%';
                if(delayNode) delayNode.delayTime.value = parseFloat(inputs.sync.value); document.getElementById('lbl_sync').innerText = Math.round(inputs.sync.value * 1000) + 'ms';
                if(eqFilters.length) { const eqKeys = ['eq_b', 'eq_lb', 'eq_m', 'eq_mh', 'eq_h']; eqFilters.forEach((filter, i) => { filter.gain.value = inputs[eqKeys[i]].value; document.getElementById('lbl_'+eqKeys[i]).innerText = inputs[eqKeys[i]].value + 'dB'; }); }
            }
            
            const updateGridVisuals = () => {
                const val = inputs.res.value;
                if(val === 'none' || !inputs.showGrid.checked) { gridLayer.style.display = 'none'; } 
                else {
                    gridLayer.style.display = 'block'; const cols = parseInt(val);
                    gridLayer.style.backgroundSize = (100/cols) + "% " + (100/cols) + "%"; 
                    gridLayer.style.backgroundImage = "linear-gradient(to right, rgba(0,255,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,0,0.5) 1px, transparent 1px)";
                    if(cols===1) gridLayer.style.border = "1px solid rgba(0,255,0,0.5)"; else gridLayer.style.border = "none";
                    syncOverlays();
                }
            };
            inputs.res.onchange = () => { updateGridVisuals(); };
            inputs.showGrid.onchange = () => { updateGridVisuals(); };
            inputs.matrix.onchange = () => { if(inputs.matrix.checked && inputs.res.value === 'none') { alert("Seleziona una Risoluzione."); inputs.matrix.checked = false; } if(!inputs.matrix.checked) mCanvas.style.display = 'none'; else syncOverlays(); };
            inputs.hdr.addEventListener('change', () => { if(inputs.hdr.value === 'custom') { ['bri','sha','gam','hig','con','sat','vib'].forEach(k => inputs[k].value = 1); upd(false); } });
            Object.values(inputs).forEach(i => i.oninput = () => upd(false));
            setInterval(processAdaptiveHDR, 100);
            
            setInterval(() => {
                if(v.duration && v.buffered.length) {
                    let end = 0;
                    for(let i=0; i<v.buffered.length; i++) { if(v.buffered.start(i) <= v.currentTime && v.buffered.end(i) >= v.currentTime) { end = v.buffered.end(i); break; } }
                    let buf = end - v.currentTime; document.getElementById('i_buf').innerText = (buf > 0 ? buf.toFixed(1) : 0) + "s";
                }
            }, 500);

            document.querySelectorAll('.tab').forEach(t => t.onclick = () => { document.querySelectorAll('.tab, .panel-content').forEach(x => x.classList.remove('active')); t.classList.add('active'); document.getElementById('tab-'+t.dataset.tab).classList.add('active'); });
            
            // Fix per evitare fullscreen accidentale
            gear.onclick = (e) => { e.stopPropagation(); panel.style.display = (panel.style.display == 'block' ? 'none' : 'block'); };
            
            // NEW GEAR EVENT BLOCK
            gear.addEventListener('dblclick', e => { e.preventDefault(); e.stopPropagation(); });
            gear.addEventListener('mousedown', e => { e.stopPropagation(); });

            panel.addEventListener('dblclick', e => { e.stopPropagation(); e.preventDefault(); });
            panel.addEventListener('mousedown', e => { e.stopPropagation(); });

            // SAFE ZONES LOGIC
            [sz_left, sz_right, sz_gear].forEach(sz => {
                sz.addEventListener('dblclick', e => { e.preventDefault(); e.stopPropagation(); });
                sz.addEventListener('mousedown', e => { e.stopPropagation(); });
            });
            
            // CENTRAL SAFE ZONE LOGIC
            sz_center.addEventListener('click', (e) => {
                e.stopPropagation();
                if(v.paused) v.play(); else v.pause();
            });
            sz_center.addEventListener('dblclick', (e) => {
                e.preventDefault(); e.stopPropagation();
            });
            sz_center.addEventListener('mousedown', (e) => e.stopPropagation());
            
            document.addEventListener('keydown', e => { if(e.code === 'Space') { e.preventDefault(); if(v.paused) v.play(); else v.pause(); } });

            // SAVE & LOAD LOGIC
            document.getElementById('save_cfg').onclick = () => {
                const cfg = {
                    hdr: inputs.hdr.value, preset: inputs.preset.value, lv: inputs.lv.value,
                    ar: inputs.ar.value, sh: inputs.sh.value, night: inputs.night.checked,
                    grid: inputs.res.value, matrix: inputs.matrix.checked,
                    // Upscale config
                    upscale: {
                        on: inputs.up_chk.checked, preset: inputs.up_preset.value, res: inputs.up_res.value,
                        algo: inputs.up_algo.value, rad: inputs.up_rad.value, sharp: inputs.up_sharp.value
                    },
                    limits: {} 
                };
                document.querySelectorAll('.lim').forEach(l => {
                    if(!cfg.limits[l.dataset.id]) cfg.limits[l.dataset.id] = {};
                    if(l.classList.contains('min')) cfg.limits[l.dataset.id].min = l.value;
                    else cfg.limits[l.dataset.id].max = l.value;
                });
                localStorage.setItem('${STORE_KEY}', JSON.stringify(cfg));
                const fb = document.getElementById('feedback'); fb.innerText = "SALVATO!"; fb.style.opacity = 1; setTimeout(() => fb.style.opacity = 0, 1500);
            };

            const loadConfig = () => {
                const data = localStorage.getItem('${STORE_KEY}');
                if(data) {
                    try {
                        const c = JSON.parse(data);
                        if(c.hdr) inputs.hdr.value = c.hdr;
                        if(c.preset) inputs.preset.value = c.preset;
                        if(c.lv) inputs.lv.value = c.lv;
                        if(c.ar) inputs.ar.value = c.ar;
                        if(c.sh) inputs.sh.value = c.sh;
                        inputs.night.checked = !!c.night;
                        if(c.grid) inputs.res.value = c.grid;
                        inputs.matrix.checked = !!c.matrix;
                        
                        // Load Upscale
                        if(c.upscale) {
                            inputs.up_chk.checked = c.upscale.on;
                            inputs.up_preset.value = c.upscale.preset;
                            inputs.up_res.value = c.upscale.res;
                            inputs.up_algo.value = c.upscale.algo;
                            inputs.up_rad.value = c.upscale.rad;
                            inputs.up_sharp.value = c.upscale.sharp;
                            updUpscaler();
                        }

                        if(c.limits) {
                            Object.keys(c.limits).forEach(k => {
                                const l = c.limits[k];
                                const minIn = document.querySelector('.lim.min[data-id="'+k+'"]');
                                const maxIn = document.querySelector('.lim.max[data-id="'+k+'"]');
                                const range = document.getElementById(k);
                                if(minIn && l.min) { minIn.value = l.min; range.min = l.min; }
                                if(maxIn && l.max) { maxIn.value = l.max; range.max = l.max; }
                                updateDots(range, parseFloat(minIn.value), parseFloat(maxIn.value));
                            });
                        }
                        upd(false);
                    } catch(e) {}
                }
            };
            loadConfig(); // Auto load on startup

            document.getElementById('rst_hard').onclick = () => {
                localStorage.removeItem(storeKey); localStorage.removeItem('${STORE_KEY}');
                inputs.hdr.value = 'hdr_dv'; inputs.lv.value = '5'; inputs.preset.value = 'CINEMA'; inputs.comp.value = 'none'; inputs.sh.value = 'sh-med'; inputs.ar.value = 'contain'; 
                inputs.res.value = 'none'; inputs.matrix.checked = false; inputs.showGrid.checked = false;
                gridLayer.style.display = 'none'; mCanvas.style.display = 'none';
                inputs.night.checked = false; ['bri','sha','gam','hig','con','sat','vib','vol'].forEach(k => inputs[k].value = 1); ['eq_b', 'eq_lb', 'eq_m', 'eq_mh', 'eq_h'].forEach(k => inputs[k].value = 0);
                inputs.sync.value = 0; 
                // Reset Upscale
                inputs.up_chk.checked = false; inputs.up_preset.value = 'bal'; inputs.up_res.value = 'native'; updUpscaler();

                document.querySelectorAll('.lim.min').forEach(l => l.value = l.defaultValue);
                document.querySelectorAll('.lim.max').forEach(l => l.value = l.defaultValue);
                document.querySelectorAll('input[type=range]').forEach(r => { 
                    r.min = r.getAttribute('min'); r.max = r.getAttribute('max'); 
                    updateDots(r, parseFloat(r.min), parseFloat(r.max));
                });
                upd(false);
            };

            function doSkip(n) { v.currentTime += n; accSkip += n; fb.innerText = (accSkip > 0 ? '+' : '') + accSkip + 's'; fb.style.opacity = 1; clearTimeout(skipTimer); skipTimer = setTimeout(() => { accSkip = 0; fb.style.opacity = 0; }, 800); }
            let accSkip = 0, skipTimer;
            [b_prev, b_next].forEach(b => { b.onclick = (e) => { e.stopPropagation(); doSkip(b == b_prev ? -10 : 10); }; b.ondblclick = (e) => e.stopPropagation(); });
            v.addEventListener('timeupdate', () => { if(v.currentTime > 5) localStorage.setItem(storeKey, v.currentTime); document.getElementById('i_res').innerText = v.videoWidth + "x" + v.videoHeight; });
            v.addEventListener('loadedmetadata', () => { const t = localStorage.getItem(storeKey); if(t && t > 10 && t < v.duration-30) { document.getElementById('resume_box').classList.add('visible'); document.getElementById('resume_yes').onclick = () => { v.currentTime = t; v.play(); document.getElementById('resume_box').classList.remove('visible'); }; document.getElementById('resume_no').onclick = () => document.getElementById('resume_box').classList.remove('visible'); } });
            document.addEventListener('mousemove', () => { 
                clearTimeout(idleTimer); 
                [gear, b_prev, b_next, sz_left, sz_right, sz_gear, sz_center].forEach(el => el.classList.remove('fade-out'));
                document.body.style.cursor = 'default'; 
                idleTimer = setTimeout(() => { 
                    if(panel.style.display == 'block' || v.paused) return; 
                    [gear, b_prev, b_next, sz_left, sz_right, sz_gear, sz_center].forEach(el => el.classList.add('fade-out'));
                    if(!v.paused) document.body.style.cursor = 'none'; 
                }, 2000); 
            });
        </script></body></html>`;
        window.open(URL.createObjectURL(new Blob([html], { type: 'text/html' })), '_blank');
    }

    const X = XMLHttpRequest.prototype, op = X.open, se = X.send;
    X.open = function(m, u) { this._u = u; return op.apply(this, arguments) };
    X.send = function() { if (this._u && CFG.ext.test(this._u) && !CFG.ign.test(this._u)) add(this._u, 'XHR'); return se.apply(this, arguments) };
    const oF = window.fetch; window.fetch = async (i, c) => { let u = i.url || i; if (u && CFG.ext.test(u) && !CFG.ign.test(u)) add(u, 'FETCH'); return oF(i, c) };
})();