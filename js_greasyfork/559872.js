// ==UserScript==
// @name         Clean Search Results VIP
// @namespace    https://greasyfork.org/users/doom
// @version      14.0
// @description  Filtro VIP global com estatísticas, exportação, reset, tradutor compacto e painel gamificado com conquistas, moedas, mercado e ranking.
// @author       DOOM_
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @match        https://duckduckgo.com/*
// @match        https://search.yahoo.com/search*
// @match        https://www.baidu.com/s*
// @match        https://yandex.com/search/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559872/Clean%20Search%20Results%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/559872/Clean%20Search%20Results%20VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================
    // Tradutor VIP (já implementado)
    // ===============================
    let compactMode = GM_getValue('translatorCompact', false);
    const translatorPanel = document.createElement('div');
    Object.assign(translatorPanel.style, {
        position: 'fixed', bottom: '20px', left: '20px', width: '360px',
        background: 'linear-gradient(180deg, #0a0a1a, #1e1e2f)',
        border: '2px solid #0ff', borderRadius: '10px', padding: '12px',
        color: '#0ff', zIndex: '10000', boxShadow: '0 0 20px rgba(0,255,255,0.6)',
        display: 'none'
    });
    document.body.appendChild(translatorPanel);

    function renderTranslator() {
        translatorPanel.innerHTML = compactMode ? `
            <h4 style="text-align:center; text-shadow:0 0 10px #0ff;">🌐 Tradutor VIP (Compacto)</h4>
            <textarea id="translateText" rows="2"></textarea>
            <div>
                <button id="goGoogle">Google</button>
                <button id="goDeepL">DeepL</button>
                <button id="goBing">Bing</button>
            </div>
            <button id="toggleMode">🔄 Modo completo</button>
        ` : `
            <h4 style="text-align:center; text-shadow:0 0 10px #0ff;">🌐 Tradutor VIP</h4>
            <textarea id="translateText" rows="4"></textarea>
            <div>
                <button id="goGoogle">Google</button>
                <button id="goDeepL">DeepL</button>
                <button id="goBing">Bing</button>
            </div>
            <div>
                <button id="pasteSelection">📥 Colar seleção</button>
                <button id="copyText">📋 Copiar texto</button>
            </div>
            <button id="toggleMode">🔄 Modo compacto</button>
        `;

        const txtArea = translatorPanel.querySelector('#translateText');
        translatorPanel.querySelector('#goGoogle').onclick = () => window.open(`https://translate.google.com/?sl=auto&tl=pt&text=${encodeURIComponent(txtArea.value.trim())}&op=translate`, '_blank');
        translatorPanel.querySelector('#goDeepL').onclick = () => window.open(`https://www.deepl.com/translator#auto/pt/${encodeURIComponent(txtArea.value.trim())}`, '_blank');
        translatorPanel.querySelector('#goBing').onclick = () => window.open(`https://www.bing.com/translator?from=auto&to=pt&text=${encodeURIComponent(txtArea.value.trim())}`, '_blank');
        const pasteBtn = translatorPanel.querySelector('#pasteSelection');
        if (pasteBtn) pasteBtn.onclick = () => { const sel = window.getSelection().toString().trim(); if (sel) txtArea.value = sel; };
        const copyBtn = translatorPanel.querySelector('#copyText');
        if (copyBtn) copyBtn.onclick = () => { const val = txtArea.value.trim(); if (!val) return alert('Nada para copiar.'); navigator.clipboard.writeText(val); alert('Texto copiado!'); };
        translatorPanel.querySelector('#toggleMode').onclick = () => { compactMode = !compactMode; GM_setValue('translatorCompact', compactMode); renderTranslator(); };
    }
    renderTranslator();

    // ===============================
    // Painel VIP Gamificado
    // ===============================
    const statsPanel = document.createElement('div');
    Object.assign(statsPanel.style, {
        position: 'fixed', top: '20px', right: '20px', width: '380px',
        background: '#111', border: '2px solid #0ff', borderRadius: '10px',
        padding: '12px', color: '#0ff', zIndex: '10000',
        boxShadow: '0 0 20px rgba(0,255,255,0.6)', display: 'none'
    });
    document.body.appendChild(statsPanel);

    // Valores iniciais
    let achievements = GM_getValue('achievements', []);
    let vipCoins = GM_getValue('vipCoins', 0);
    let trophies = GM_getValue('trophies', []);
    let customTitle = GM_getValue('customTitle', "Iniciante VIP");

    function renderVIPPanel() {
        statsPanel.innerHTML = `
            <h4 style="text-align:center; text-shadow:0 0 10px #0ff;">⚡ Painel VIP</h4>
            <p style="text-align:center;">🏷️ Título: ${customTitle}</p>
            <p style="text-align:center;">💎 VIP Coins: ${vipCoins}</p>
            <h5>🏅 Conquistas</h5>
            <div>${achievements.map(a => `<span style="margin:5px;">${a}</span>`).join('') || "Nenhuma conquista"}</div>
            <h5>🏆 Troféus</h5>
            <div>${trophies.map(t => `<span style="margin:5px; font-size:22px;">${t}</span>`).join('') || "Nenhum troféu"}</div>
            <h5>🛒 Mercado VIP</h5>
            <button onclick="spendCoins(10,'Glow Especial')">✨ Glow (10💎)</button>
            <button onclick="spendCoins(20,'Insígnia Premium')">🏅 Premium (20💎)</button>
            <div style="margin-top:10px;">
                <input id="titleInput" placeholder="Novo título..." style="padding:5px;"/>
                <button onclick="setCustomTitle(document.getElementById('titleInput').value)">Salvar título</button>
            </div>
        `;
    }

    // Funções de moedas e títulos
    window.spendCoins = function(amount, reward) {
        if (vipCoins >= amount) {
            vipCoins -= amount;
            achievements.push(`💎 ${reward}`);
            GM_setValue('vipCoins', vipCoins);
            GM_setValue('achievements', achievements);
            renderVIPPanel();
        } else alert("Saldo insuficiente!");
    };
    window.setCustomTitle = function(title) {
        if (title.trim()) {
            customTitle = title.trim();
            GM_setValue('customTitle', customTitle);
            renderVIPPanel();
        }
    };

    renderVIPPanel();

    // ===============================
    // Botão VIP principal
    // ===============================
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '⚡ VIP';
    Object.assign(toggleBtn.style, {
        position: 'fixed', bottom: '20px', right: '20px', zIndex: '10000',
        background: '#0ff', color: '#000', fontWeight: 'bold',
        padding: '12px 18px', border: 'none', borderRadius: '50px',
        cursor: 'pointer', boxShadow: '0 0 20px #0ff'
    });
    document.body.appendChild(toggleBtn);

    // Clique normal alterna painel VIP
    toggleBtn.onclick = () => {
        statsPanel.style.display = statsPanel.style.display === 'none' ? 'block' : 'none';
        renderVIPPanel();
    };

    // Clique direito abre tradutor
    toggleBtn.oncontextmenu = (e) => {
        e.preventDefault();
        translatorPanel.style.display = translatorPanel.style.display === 'none' ? 'block' : 'none';
        renderTranslator();
    };

    // Atalho de teclado
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
            translatorPanel.style.display = translatorPanel.style.display === 'none' ? 'block' : 'none';
            renderTranslator();
        }
         if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
            // Atalho para abrir/fechar painel VIP
            statsPanel.style.display = statsPanel.style.display === 'none' ? 'block' : 'none';
            renderVIPPanel();
        }
    });

    // ===============================
    // Inicialização
    // ===============================
    renderVIPPanel();
})();