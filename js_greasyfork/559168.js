// ==UserScript==
// @name         KaHoax (Clean Viewer + Search + Rainbow)
// @namespace    https://github.com/KRWCLASSIC
// @version      2.2.0
// @description  Kahoot quiz ID lookup, public search, answer viewer, game PIN helper + rainbow mode
// @match        https://kahoot.it/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559168/KaHoax%20%28Clean%20Viewer%20%2B%20Search%20%2B%20Rainbow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559168/KaHoax%20%28Clean%20Viewer%20%2B%20Search%20%2B%20Rainbow%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* =========================
       STATE
    ========================= */
    let lastValidQuizID = null;
    let lastKnownPin = null;
    let questions = [];
    let rainbowEnabled = false;

    /* =========================
       HELPERS
    ========================= */
    const sanitizeInput = (val) => {
        val = val.trim();
        if (/^https?:\/\//i.test(val)) {
            return val.split('/').filter(Boolean).pop();
        }
        return val;
    };

    const isGamePage = () =>
        ['/join', '/instructions', '/start', '/getready', '/gameblock', '/answer', '/ranking']
            .some(p => location.pathname.includes(p));

    /* =========================
       UI ROOT
    ========================= */
    const ui = document.createElement('div');
    ui.style.cssText = `
        position:fixed;
        top:5%;
        left:5%;
        width:380px;
        max-width:92vw;
        max-height:90vh;
        background:#1e1e1e;
        border-radius:10px;
        box-shadow:0 0 15px rgba(0,0,0,.6);
        z-index:99999;
        color:white;
        font-family:Montserrat,Arial,sans-serif;
        overflow:hidden;
    `;

    /* =========================
       HEADER
    ========================= */
    const header = document.createElement('div');
    header.style.cssText = `
        padding:10px 15px;
        background:#2c2c2c;
        font-weight:bold;
        cursor:move;
        display:flex;
        justify-content:space-between;
        align-items:center;
    `;
    header.innerHTML = `<span>KaHoax — Viewer</span>`;
    ui.appendChild(header);

    const closeBtn = document.createElement('div');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        cursor:pointer;
        font-size:16px;
        padding:2px 8px;
        border-radius:4px;
        background:#ff4d4d;
    `;
    closeBtn.onclick = () => ui.remove();
    header.appendChild(closeBtn);

    /* =========================
       CONTENT
    ========================= */
    const content = document.createElement('div');
    content.style.cssText = 'padding:15px; overflow:auto; max-height:calc(90vh - 45px);';
    ui.appendChild(content);

    /* =========================
       INPUT
    ========================= */
    const input = document.createElement('input');
    input.placeholder = 'Quiz ID or search term (e.g. Iliad)';
    input.style.cssText = `
        width:100%;
        padding:8px;
        border-radius:6px;
        border:1px solid #444;
        background:#333;
        color:white;
        text-align:center;
    `;
    content.appendChild(input);

    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Search / Load';
    loadBtn.style.cssText = `
        margin-top:8px;
        width:100%;
        padding:8px;
        border:none;
        border-radius:6px;
        background:#6c757d;
        color:white;
        cursor:pointer;
    `;
    content.appendChild(loadBtn);

    /* 🌈 Rainbow Button */
    const rainbowBtn = document.createElement('button');
    rainbowBtn.textContent = '🌈 Rainbow Mode';
    rainbowBtn.style.cssText = `
        margin-top:6px;
        width:100%;
        padding:6px;
        border:none;
        border-radius:6px;
        background:#444;
        color:white;
        cursor:pointer;
    `;
    content.appendChild(rainbowBtn);

    /* =========================
       DROPDOWN SEARCH RESULTS
    ========================= */
    const dropdown = document.createElement('div');
    dropdown.style.cssText = `
        margin-top:8px;
        border:1px solid #444;
        border-radius:6px;
        display:none;
        max-height:260px;
        overflow:auto;
        background:#2a2a2a;
    `;
    content.appendChild(dropdown);

    loadBtn.onclick = async () => {
        const value = sanitizeInput(input.value);
        if (!value) return;

        try {
            await loadByID(value);
            input.style.background = '#2e7d32';
        } catch {
            input.style.background = '#8b0000';
            searchPublic(value);
        }
    };

    /* =========================
       GAME PIN
    ========================= */
    const pinBox = document.createElement('div');
    pinBox.style.cssText = `
        margin:10px 0;
        padding:6px;
        background:#333;
        border-radius:6px;
        text-align:center;
        cursor:pointer;
    `;
    pinBox.textContent = 'Game PIN: None';
    content.appendChild(pinBox);

    pinBox.onclick = () => {
        if (lastKnownPin) navigator.clipboard.writeText(lastKnownPin);
    };

    /* =========================
       QUESTIONS LIST
    ========================= */
    const list = document.createElement('div');
    content.appendChild(list);

    const renderQuestions = () => {
        list.innerHTML = '';
        if (!questions.length) {
            list.textContent = 'No questions loaded.';
            list.style.opacity = '0.6';
            return;
        }

        questions.forEach((q, i) => {
            const item = document.createElement('div');
            item.style.cssText = `
                margin-bottom:8px;
                border:1px solid #444;
                border-radius:6px;
                overflow:hidden;
            `;

            const h = document.createElement('div');
            h.innerHTML = `<b>Q${i + 1}</b> — ${q.question || '[No text]'}`;
            h.style.cssText = `padding:8px;background:#333;cursor:pointer;`;
            item.appendChild(h);

            const body = document.createElement('div');
            body.style.cssText = `display:none;padding:8px;background:#2a2a2a;`;

            (q.choices || []).forEach(c => {
                const a = document.createElement('div');
                a.innerHTML = (c.correct ? '✓ ' : '○ ') + (c.answer || '');
                a.style.color = c.correct ? '#4CAF50' : '#ccc';
                body.appendChild(a);
            });

            h.onclick = () => {
                body.style.display = body.style.display === 'none' ? 'block' : 'none';
            };

            item.appendChild(body);
            list.appendChild(item);
        });
    };

    /* =========================
       FETCH LOGIC
    ========================= */
    const loadByID = async (id) => {
        const res = await fetch(
            `https://damp-leaf-16aa.johnwee.workers.dev/api-proxy/${encodeURIComponent(id)}`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        questions = data.questions || [];
        lastValidQuizID = id;
        dropdown.style.display = 'none';
        renderQuestions();
    };

    const searchPublic = async (term) => {
        dropdown.innerHTML = '';
        dropdown.style.display = 'block';

        const res = await fetch(
            `https://damp-leaf-16aa.johnwee.workers.dev/rest/kahoots/?query=${encodeURIComponent(term)}`
        );
        const data = await res.json();
        const results = data.entities || [];

        if (!results.length) {
            dropdown.textContent = 'No results found.';
            dropdown.style.opacity = '0.7';
            return;
        }

        results.forEach(e => {
            const card = e.card || {};
            const uuid = card.uuid;
            const title = card.title || 'Untitled quiz';
            const cover = card.cover || card.image || 'https://dummyimage.com/40x40/444/fff&text=?';

            const row = document.createElement('div');
            row.style.cssText = `
                display:flex;
                align-items:center;
                gap:10px;
                padding:8px;
                border-bottom:1px solid #444;
                cursor:pointer;
            `;

            const img = document.createElement('img');
            img.src = cover;
            img.style.cssText = `width:40px;height:40px;border-radius:6px;object-fit:cover;`;

            const text = document.createElement('div');
            text.textContent = title;
            text.style.flex = '1';

            const openBtn = document.createElement('button');
            openBtn.textContent = 'Open';
            openBtn.onclick = e => {
                e.stopPropagation();
                window.open(`https://create.kahoot.it/details/${uuid}`, '_blank');
            };

            row.onclick = () => {
                input.value = uuid;
                loadByID(uuid);
            };

            row.append(img, text, openBtn);
            dropdown.appendChild(row);
        });
    };

    /* =========================
       RAINBOW MODE
    ========================= */
    rainbowBtn.onclick = () => {
        rainbowEnabled = !rainbowEnabled;
        ui.classList.toggle('rainbow-mode', rainbowEnabled);
        rainbowBtn.classList.toggle('rainbow-button', rainbowEnabled);
        rainbowBtn.textContent = rainbowEnabled ? '🌈 Rainbow Mode: ON' : '🌈 Rainbow Mode';
    };

    const style = document.createElement('style');
    style.textContent = `
    @keyframes rainbowShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .rainbow-mode {
        background: linear-gradient(270deg, red, orange, yellow, green, cyan, blue, violet, red) !important;
        background-size: 800% 800% !important;
        animation: rainbowShift 10s linear infinite;
    }
    .rainbow-mode * { text-shadow: 0 0 6px rgba(255,255,255,.6); }
    .rainbow-button {
        background: linear-gradient(270deg, red, orange, yellow, green, cyan, blue, violet);
        background-size: 600% 600%;
        animation: rainbowShift 6s linear infinite;
        color:black !important;
    }`;
    document.head.appendChild(style);

    /* =========================
       DRAG
    ========================= */
    let drag = false, dx = 0, dy = 0;
    header.onmousedown = e => {
        drag = true;
        dx = e.clientX - ui.offsetLeft;
        dy = e.clientY - ui.offsetTop;
    };
    document.onmousemove = e => {
        if (drag) {
            ui.style.left = e.clientX - dx + 'px';
            ui.style.top = e.clientY - dy + 'px';
        }
    };
    document.onmouseup = () => drag = false;

    document.body.appendChild(ui);
})();