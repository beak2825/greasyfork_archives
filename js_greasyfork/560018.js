// ==UserScript==
// @name         KORNET OS: CLOUDFLARE ENTERPRISE EDITION
// @namespace    kornet.macos.dracula.pro
// @version      126.0
// @description  Elite DevTools & Fixed Discord Transmission.
// @author       Gemini
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560018/KORNET%20OS%3A%20CLOUDFLARE%20ENTERPRISE%20EDITION.user.js
// @updateURL https://update.greasyfork.org/scripts/560018/KORNET%20OS%3A%20CLOUDFLARE%20ENTERPRISE%20EDITION.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FIXED_WEBHOOK = "https://discord.com/api/webhooks/1453157856126832771/slsvf1nfogjbLXHmWaxmSd_UVowyouNKz2tHHuATbq4YnU5ha_HDgolXao4ey8VRkUG3";
    let AUTH_TOKEN = localStorage.getItem('KORNET_API_KEY') || "";

    const host = document.createElement('div');
    host.id = 'kornet-ghost-root';
    host.style.position = 'fixed'; host.style.zIndex = '2147483647';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({mode: 'open'});

    const Kernel = {
        // --- [ FIXED BROADCAST SYSTEM ] ---
        "send-message": async (msg) => {
            if (!msg) return "Usage: send-message [text]";
            try {
                const response = await fetch(FIXED_WEBHOOK, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: "KORNET OS MONITOR",
                        avatar_url: "https://i.imgur.com/4M79Sxr.png",
                        embeds: [{
                            title: "Engineering Broadcast",
                            description: msg,
                            color: 0x50fa7b,
                            timestamp: new Date().toISOString(),
                            footer: { text: "Cloudflare Node: " + (document.body.innerText.match(/[0-9a-f]{16}/)?.[0] || "Unknown") }
                        }]
                    })
                });

                if (!response.ok) throw new Error(`Discord rejected: ${response.status}`);
                return `<span style="color:#50fa7b;">✓ Broadcast confirmed. Check Discord channel.</span>`;
            } catch (e) {
                return `<span style="color:#ff5555;">Broadcast Failure: ${e.message}</span>`;
            }
        },

        // --- [ CLOUDFLARE GRADE DEVTOOLS ] ---
        "cf-ray": () => `Ray ID: ${document.body.innerText.match(/[0-9a-f]{16}/)?.[0] || "Bypassed/None"}`,
        "net-waterfall": () => performance.getEntriesByType("resource").slice(0, 15).map(r => `<div style="font-size:10px;">[${r.initiatorType.toUpperCase()}] ${r.name.split('/').pop()} -> ${Math.round(r.duration)}ms</div>`).join(''),
        "header-scan": () => `H1-H6: ${document.querySelectorAll('h1,h2,h3,h4,h5,h6').length} | Links: ${document.links.length} | Scripts: ${document.scripts.length}`,
        "cookie-vault": () => document.cookie.split(';').map(c => `<div style="color:#f1fa8c;">${c.trim()}</div>`).join('') || "Vault Empty",
        "storage-audit": () => `LS: ${localStorage.length} items | SS: ${sessionStorage.length} items`,
        "cors-detect": () => Array.from(document.querySelectorAll('script[src]')).filter(s => !s.src.includes(location.hostname)).map(s => `<div style="color:#ff79c6;">EXT: ${s.src.substring(0,60)}...</div>`).join('') || "Clean Origin",
        "dom-depth": () => `Nodes: ${document.getElementsByTagName('*').length} | Max Depth: ${([...document.querySelectorAll('*')].reduce((max, el) => Math.max(max, (function d(e){return e?1+d(e.parentElement):0})(el)), 0))}`,
        "trace-meta": () => Array.from(document.querySelectorAll('meta')).map(m => `<div>${m.name || m.getAttribute('property')}: ${m.content}</div>`).join(''),
        "secure-ctx": () => `HTTPS: ${location.protocol === 'https:'} | Sandbox: ${document.domain ? 'No' : 'Yes'}`,
        "clear-cache": () => { localStorage.clear(); sessionStorage.clear(); return "All local caches purged."; },

        // --- [ SYSTEM ] ---
        "ask-ai": async (query) => {
            if (!AUTH_TOKEN) return "Set API Key first.";
            try {
                const res = await fetch("https://api.openai.com/v1/responses", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${AUTH_TOKEN}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ model: "gpt-5.2", input: query })
                });
                const data = await res.json();
                return `<div style="color:#bd93f9;">${data.output_text || "Error: " + data.error.message}</div>`;
            } catch (e) { return "Link Refused."; }
        },
        "help": () => `<div style="display:grid; grid-template-columns: 1fr 1fr; font-size:11px; color:#6272a4;">
            send-message, cf-ray, net-waterfall, header-scan, cookie-vault, storage-audit, cors-detect, dom-depth, trace-meta, secure-ctx, clear-cache, ask-ai, neofetch, clear
        </div>`,
        "neofetch": () => `<pre style="color:#bd93f9; font-size:10px;">KORNET OS v126.0\nDistro: Engineering Suite\nKernel: Cloudflare-Optimized\nWebhook: ENABLED</pre>`,
        "clear": (log) => { log.innerHTML = ""; return ""; }
    };

    // --- GUI ENGINE ---
    const styles = `
        #win { position: fixed; top: 100px; left: 100px; width: 850px; height: 550px; background: #282a36; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 50px 100px rgba(0,0,0,0.8); font-family: 'Consolas', monospace; border: 1px solid #44475a; overflow: hidden; }
        .head { background: #44475a; height: 40px; display: flex; align-items: center; padding: 0 15px; color: #f8f8f2; font-size: 13px; cursor: move; border-bottom: 2px solid #191a21; }
        .dots { display: flex; gap: 8px; margin-right: 25px; }
        .dot { width: 13px; height: 13px; border-radius: 50%; }
        .body { flex: 1; padding: 25px; overflow-y: auto; color: #f8f8f2; font-size: 15px; line-height: 1.6; scrollbar-width: thin; scrollbar-color: #6272a4 #282a36; }
        .p-line { display: flex; align-items: center; gap: 10px; margin-top: 15px; }
        input { background: transparent; border: none; color: #f8f8f2; outline: none; width: 100%; font-family: inherit; font-size: 15px; }
    `;

    const sheet = new CSSStyleSheet(); sheet.replaceSync(styles);
    shadow.adoptedStyleSheets = [sheet];

    const ui = document.createElement('div');
    ui.innerHTML = `
        <div id="win">
            <div class="head" id="drag"><div class="dots"><div class="dot" style="background:#ff5555"></div><div class="dot" style="background:#f1fa8c"></div><div class="dot" style="background:#50fa7b"></div></div>KORNET — ENGINEER@CLOUDFLARE — v126</div>
            <div class="body" id="main-body">
                <div id="output-log">Welcome, Engineer. Type 'help' to begin.</div>
                <div class="p-line"><span style="color:#50fa7b; font-weight:bold;">➜</span> <span style="color:#bd93f9; font-weight:bold;">kornet</span> <input type="text" id="term-input" spellcheck="false" autocomplete="off" autofocus></div>
            </div>
        </div>
    `;
    shadow.appendChild(ui);

    const input = shadow.getElementById('term-input');
    const log = shadow.getElementById('output-log');
    const win = shadow.getElementById('win');

    input.onkeydown = async (e) => {
        if (e.key === 'Enter') {
            const raw = input.value.trim();
            if (!raw) return;
            const args = raw.split(' ');
            const cmd = args.shift().toLowerCase();
            const val = args.join(' ');

            log.innerHTML += `<div><span style="color:#50fa7b;">➜</span> <span style="color:#bd93f9;">dracula</span> ${raw}</div>`;
            let res = Kernel[cmd] ? (cmd === 'clear' ? Kernel[cmd](log) : Kernel[cmd](val)) : `<span style="color:#ff5555">ERROR: Unknown command '${cmd}'</span>`;
            if (res instanceof Promise) res = await res;

            if (res) log.innerHTML += `<div style="margin: 8px 0 20px 25px; border-left: 2px solid #6272a4; padding-left: 15px;">${res}</div>`;
            input.value = "";
            shadow.getElementById('main-body').scrollTop = shadow.getElementById('main-body').scrollHeight;
        }
    };

    // Drag Logic
    let isDragging = false, offset = [0, 0];
    shadow.getElementById('drag').onmousedown = (e) => { isDragging = true; offset = [win.offsetLeft - e.clientX, win.offsetTop - e.clientY]; };
    window.onmouseup = () => isDragging = false;
    window.onmousemove = (e) => { if (isDragging) { win.style.left = (e.clientX + offset[0]) + 'px'; win.style.top = (e.clientY + offset[1]) + 'px'; }};

})();