// ==UserScript==
// @name         Clean Search Results VIP (Mobile Optimized)
// @namespace    https://greasyfork.org/users/doom
// @version      15.1
// @description  Painel VIP com tradutor e gamificação, otimizado para celular (toque longo).
// @author       DOOM_
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @match        https://duckduckgo.com/*
// @match        https://search.yahoo.com/search*
// @match        https://www.baidu.com/s*
// @match        https://yandex.com/search/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559877/Clean%20Search%20Results%20VIP%20%28Mobile%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559877/Clean%20Search%20Results%20VIP%20%28Mobile%20Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================
    // Tradutor VIP
    // ===============================
    let compactMode = GM_getValue('translatorCompact', false);

    const translatorPanel = document.createElement('div');
    Object.assign(translatorPanel.style, {
        position: 'fixed', bottom: '80px', left: '5%', width: '90%',
        background: '#1e1e2f', border: '2px solid #0ff', borderRadius: '10px',
        padding: '12px', color: '#0ff', zIndex: '10000',
        boxShadow: '0 0 20px rgba(0,255,255,0.6)', display: 'none'
    });
    document.body.appendChild(translatorPanel);

    function renderTranslator() {
        translatorPanel.innerHTML = compactMode ? `
            <h4 style="text-align:center;">🌐 Tradutor VIP (Compacto)</h4>
            <textarea id="translateText" rows="2" style="width:100%;"></textarea>
            <div style="display:flex; gap:6px; margin-top:8px;">
                <button id="goGoogle">Google</button>
                <button id="goDeepL">DeepL</button>
                <button id="goBing">Bing</button>
            </div>
            <button id="toggleMode">🔄 Modo completo</button>
        ` : `
            <h4 style="text-align:center;">🌐 Tradutor VIP</h4>
            <textarea id="translateText" rows="4" style="width:100%;"></textarea>
            <div style="display:flex; gap:6px; margin-top:8px;">
                <button id="goGoogle">Google</button>
                <button id="goDeepL">DeepL</button>
                <button id="goBing">Bing</button>
            </div>
            <div style="display:flex; gap:6px; margin-top:8px;">
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
        if (copyBtn) copyBtn.onclick = () => copyToClipboard(txtArea.value.trim());
        translatorPanel.querySelector('#toggleMode').onclick = () => { compactMode = !compactMode; GM_setValue('translatorCompact', compactMode); renderTranslator(); };
    }
    renderTranslator();

    // Função auxiliar para copiar com fallback
    function copyToClipboard(text) {
        if (!text) return showCustomAlert('Nada para copiar.');
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => showCustomAlert('Texto copiado!'));
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showCustomAlert('Texto copiado!');
            } catch (err) {
                showCustomAlert('Falha ao copiar. Copie manualmente.');
            }
            document.body.removeChild(textArea);
        }
    }

    // ===============================
    // Painel VIP Gamificado
    // ===============================
    const statsPanel = document.createElement('div');
    Object.assign(statsPanel.style, {
        position: 'fixed', top: '20px', left: '5%', width: '90%',
        background: '#111', border: '2px solid #0ff', borderRadius: '10px',
        padding: '12px', color: '#0ff', zIndex: '10000',
        boxShadow: '0 0 20px rgba(0,255,255,0.6)', display: 'none'
    });
    document.body.appendChild(statsPanel);

    let achievements = GM_getValue('achievements', []);
    let vipCoins = GM_getValue('vipCoins', 0);
    let customTitle = GM_getValue('customTitle', "Iniciante VIP");

    function spendCoins(amount, reward) {
        if (vipCoins < amount) return showCustomAlert("Saldo insuficiente!");
        vipCoins -= amount;
        achievements.push(`💎 ${reward}`);
        GM_setValue('vipCoins', vipCoins);
        GM_setValue('achievements', achievements);
        renderVIPPanel();
    }
    function setCustomTitle(title) {
        if (!title.trim()) return showCustomAlert('Título inválido.');
        customTitle = title.trim();
        GM_setValue('customTitle', customTitle);
        renderVIPPanel();
    }

    function renderVIPPanel() {
        const achList = achievements.map(a => `<span style="display: block; margin: 2px 0; padding: 2px; background: rgba(0,255,255,0.1); border-radius: 4px;">${a}</span>`).join('') || '<span style="color: #666; font-style: italic;">Nenhuma conquista</span>';
        statsPanel.innerHTML = `
            <h4 style="text-align:center;">⚡ Painel VIP</h4>
            <p style="text-align:center;">🏷️ Título: ${customTitle}</p>
            <p style="text-align:center;">💎 VIP Coins: ${vipCoins}</p>
            <h5>🏅 Conquistas</h5>
            <div style="max-height: 150px; overflow-y: auto;">${achList}</div>
            <h5>🛒 Mercado VIP</h5>
            <button id="buyGlow">✨ Glow (10💎)</button>
            <button id="buyPremium">🏅 Premium (20💎)</button>
            <div style="margin-top:10px;">
                <input id="titleInput" placeholder="Novo título..." style="width:70%;"/>
                <button id="saveTitle">Salvar</button>
            </div>
        `;
        statsPanel.querySelector('#buyGlow').onclick = () => spendCoins(10,'Glow Especial');
        statsPanel.querySelector('#buyPremium').onclick = () => spendCoins(20,'Insígnia Premium');
        statsPanel.querySelector('#saveTitle').onclick = () => setCustomTitle(statsPanel.querySelector('#titleInput').value);
    }
    renderVIPPanel();

    // ===============================
    // Modal customizado para alertas
    // ===============================
    function showCustomAlert(message) {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: '#1e1e2f', border: '2px solid #0ff', borderRadius: '10px',
            padding: '20px', color: '#0ff', zIndex: '10001',
            textAlign: 'center', boxShadow: '0 0 20px rgba(0,255,255,0.6)'
        });
        modal.innerHTML = `<p>${message}</p><button onclick="this.parentElement.remove()" style="background:#0ff;color:#000;padding:8px 16px;border:none;border-radius:5px;cursor:pointer;">OK</button>`;
        document.body.appendChild(modal);
    }

    // ===============================
    // Botão principal ⚡
    // ===============================
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '⚡ VIP';
    Object.assign(toggleBtn.style, {
        position: 'fixed', bottom: '20px', right: '20px', zIndex: '10000',
        background: '#0ff', color: '#000', fontWeight: 'bold',
        padding: '14px 20px', border: 'none', borderRadius: '50px',
        cursor: 'pointer', fontSize: '18px', boxShadow: '0 0 20px #0ff'
    });
    document.body.appendChild(toggleBtn);

    // Toggle mútuo: fechar o outro painel ao abrir um
    function togglePanel(panelToShow, panelToHide) {
        if (panelToShow.style.display === 'none') {
            panelToHide.style.display = 'none';
            panelToShow.style.display = 'block';
        } else {
            panelToShow.style.display = 'none';
        }
    }

    // Toque normal → abre painel VIP
    toggleBtn.addEventListener('click', () => {
        togglePanel(statsPanel, translatorPanel);
        renderVIPPanel();
    });

    // Toque longo → abre tradutor (mobile)
    let touchTimer;
    toggleBtn.addEventListener('touchstart', () => {
        touchTimer = setTimeout(() => {
            togglePanel(translatorPanel, statsPanel);
            renderTranslator();
        }, 600); // 600ms = toque longo
    });
    toggleBtn.addEventListener('touchend', () => clearTimeout(touchTimer));

    // Fallback para desktop: long press com mouse
    let pressTimer;
    toggleBtn.addEventListener('mousedown', () => {
        pressTimer = setTimeout(() => {
            togglePanel(translatorPanel, statsPanel);
            renderTranslator();
        }, 600);
    });
    toggleBtn.addEventListener('mouseup', () => clearTimeout(pressTimer));
    toggleBtn.addEventListener('mouseleave', () => clearTimeout(pressTimer)); // Evita trigger se mouse sair

})();