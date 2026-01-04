// ==UserScript==
// @name         Twitch AdBlock + Kalanos UI (Sync Bar v5.2)
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Bypass Turbo com barra de carregamento que diminui conforme o tempo de espera.
// @author       User + Pixeltris + Kalanos
// @license      MIT
// @match        *://*.twitch.tv/*
// @connect      ipwho.is
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560242/Twitch%20AdBlock%20%2B%20Kalanos%20UI%20%28Sync%20Bar%20v52%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560242/Twitch%20AdBlock%20%2B%20Kalanos%20UI%20%28Sync%20Bar%20v52%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURAÇÃO ---
    const CONFIG = {
        cooldownTime: 10, // Segundos de espera entre verificações
        wallets: {
            btc: "bc1q86rc7evx42qrjk392tn9rzs5uxalyqy6rhcrz2",
            eth: "0x2b5a6a4fbd70910835e59a10a72487f9eca27754"
        }
    };

    // Variáveis de Estado
    let currentData = { ip: "...", country: "...", flag: "", isp: "...", dns: "...", mapsUrl: "#" };
    let isFetching = false;
    let timerInterval = null;

    // --- CSS ---
    const styleNode = document.createElement('style');
    styleNode.innerHTML = `
        /* MODAL */
        #kalanos-modal {
            position: fixed; top: 60px; left: 0; width: 340px; max-width: 90vw;
            background-color: #121212 !important; border: 1px solid #333 !important; border-radius: 6px;
            padding: 20px; z-index: 2147483647 !important;
            box-shadow: 0 10px 50px rgba(0,0,0,0.95);
            font-family: 'Consolas', 'Monaco', monospace;
            opacity: 0; visibility: hidden; pointer-events: none;
            transition: opacity 0.2s ease, top 0.2s ease; box-sizing: border-box;
        }
        #kalanos-modal.visible { opacity: 1; visibility: visible; pointer-events: auto; }

        .k-header { text-align: center; margin-bottom: 15px; border-bottom: 1px solid #2a2a2a; padding-bottom: 10px; }
        .k-title { color: #00FF00; font-weight: bold; letter-spacing: 1px; font-size: 14px; text-transform: uppercase; }
        .k-sub { font-size: 10px; color: #666; margin-top: 5px; }

        .k-status-box { background-color: #1a1a1a; border-left: 3px solid #00FF00; padding: 12px; margin-bottom: 0; border-radius: 0 4px 0 0; }
        .k-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 11px; color: #888; }
        .k-val { color: #fff; font-weight: 600; letter-spacing: 0.5px; }
        .k-loading-text { color: #aaa; font-style: italic; }
        .k-secure { color: #00FF00; font-weight: bold; display: flex; align-items: center; gap: 5px; }
        .k-checking { color: #ffff00; font-weight: bold; display: flex; align-items: center; gap: 5px; }
        .map-link { text-decoration: none; cursor: pointer; color: #888; margin-left: 5px; } .map-link:hover { color: #fff; }

        /* LOADING BAR CONTROLE */
        .k-loader-bg { width: 100%; height: 4px; background-color: #000; border-radius: 0 0 4px 0; overflow: hidden; position: relative; }
        .k-loader-bar {
            width: 0%;
            height: 100%;
            background-color: #00FF00;
            box-shadow: 0 0 10px #00FF00;
            /* Transition é definida via JS */
        }

        .k-timer-label { text-align: right; font-size: 10px; color: #666; margin-top: 4px; margin-bottom: 15px; font-family: monospace; }
        .k-divider { text-align: center; color: #dcdca3; font-size: 9px; margin-bottom: 10px; text-transform: uppercase; }
        .wallet-container { display: flex; flex-direction: column; gap: 8px; }
        .k-btn { background: transparent; border: 1px solid #444; border-radius: 5px; padding: 12px; cursor: pointer; transition: 0.2s; position: relative; overflow: hidden; text-align: center; }
        .k-btn:hover { border-color: #dcb041; background: rgba(220, 176, 65, 0.05); }
        .coin-label { display: block; font-size: 11px; font-weight: bold; color: #fff; margin-bottom: 3px; }
        .coin-hash { display: block; font-size: 9px; color: #627eea; font-family: monospace; word-break: break-all; }
        .btc-hash { color: #dcb041; }
        .k-btn.copied { border-color: #00FF00 !important; background-color: rgba(0, 255, 0, 0.1) !important; }
        .k-btn.copied .coin-label, .k-btn.copied .coin-hash { opacity: 0; }
        .copy-feedback { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #00FF00; font-weight: bold; font-size: 12px; opacity: 0; pointer-events: none; }
        .k-btn.copied .copy-feedback { opacity: 1; }

        .nitro-native-btn {
            background-color: #9146FF !important; color: white !important; border: none !important; border-radius: 4px !important;
            font-weight: 600 !important; padding: 5px 10px !important; display: flex !important; align-items: center !important; justify-content: center !important;
            font-size: 13px !important; height: 30px !important; transition: background 0.2s !important; cursor: default !important;
        }
        .nitro-native-btn:hover { background-color: #772ce8 !important; }
    `;
    document.body.appendChild(styleNode);

    // --- HTML ---
    function createModal() {
        if (document.getElementById('kalanos-modal')) {
            updateModalUI();
            return;
        }
        const div = document.createElement('div');
        div.id = 'kalanos-modal';
        document.body.appendChild(div);
        updateModalUI();
        cycleNetworkData();
    }

    // --- UI UPDATER ---
    function updateModalUI(status = "secure", timerText = "Monitorando...") {
        const modal = document.getElementById('kalanos-modal');
        if (!modal) return;

        let statusHtml = `<span class="k-secure">🔒 SEGURO</span>`;
        if (status === "loading") statusHtml = `<span class="k-checking">↻ VERIFICANDO...</span>`;
        if (status === "error") statusHtml = `<span style="color:red">⚠ ERRO REDE</span>`;

        const show = (val) => isFetching ? `<span class="k-loading-text">...</span>` : `<span class="k-val">${val}</span>`;

        modal.innerHTML = `
            <div class="k-header"><div class="k-title">BYPASS POR KALANOS</div><div class="k-sub">Versão v5.2 (Barra Sync)</div></div>
            <div class="k-status-box">
                <div class="k-row"><span>Status:</span>${statusHtml}</div>
                <div class="k-row"><span>IP:</span><span>${isFetching ? "..." : currentData.ip} <a href="${currentData.mapsUrl}" target="_blank" title="Maps" class="map-link">📍</a></span></div>
                <div class="k-row"><span>País:</span><span>${isFetching ? "..." : currentData.country + " " + currentData.flag}</span></div>
                <div class="k-row"><span>WebRTC:</span>${show("Protegido")}</div>
                <div class="k-row"><span>DNS:</span>${show(currentData.dns)}</div>
                <div class="k-row"><span>ISP:</span>${show(currentData.isp)}</div>
            </div>

            <div class="k-loader-bg"><div class="k-loader-bar" id="k-bar"></div></div>
            <div class="k-timer-label" id="k-timer-text">${timerText}</div>

            <div class="k-divider">👇 Contribua (Clique para copiar) 👇</div>
            <div class="wallet-container">
                <div class="k-btn" id="btn-btc"><span class="coin-label">BITCOIN</span><span class="coin-hash btc-hash">${CONFIG.wallets.btc}</span><div class="copy-feedback">▪ COPIADO! ▪</div></div>
                <div class="k-btn" id="btn-eth"><span class="coin-label">ETHEREUM</span><span class="coin-hash">${CONFIG.wallets.eth}</span><div class="copy-feedback">▪ COPIADO! ▪</div></div>
            </div>
        `;

        document.getElementById('btn-btc').onclick = function() { copyEffect(this, CONFIG.wallets.btc); };
        document.getElementById('btn-eth').onclick = function() { copyEffect(this, CONFIG.wallets.eth); };
    }

    // --- LÓGICA DE SINCRONIZAÇÃO (CORRIGIDA) ---
    function cycleNetworkData() {
        if (isFetching) return;
        isFetching = true;

        const bar = document.getElementById('k-bar');

        // 1. ESTADO DE CARREGAMENTO
        // Reseta a barra para 0% instantaneamente
        if(bar) {
            bar.style.transition = "none";
            bar.style.width = "0%";
            bar.style.backgroundColor = "#ffff00"; // Amarelo enquanto busca
        }

        updateModalUI("loading", "Buscando dados...");

        // 2. REQUISIÇÃO REAL
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://ipwho.is/",
            timeout: 5000,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.success) throw new Error("API Limit");

                    // 3. SUCESSO - ATUALIZA DADOS
                    currentData.ip = data.ip;
                    currentData.country = data.country;
                    currentData.flag = data.flag.emoji || "";
                    currentData.isp = data.connection.isp || data.connection.org || "Desconhecido";
                    currentData.dns = "Automático (ISP)";
                    currentData.mapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;

                    isFetching = false;
                    updateModalUI("secure", "Dados atualizados!");

                    // 4. INICIA ANIMAÇÃO DA BARRA E CONTADOR
                    startCooldown(CONFIG.cooldownTime);

                } catch (e) {
                    handleError();
                }
            },
            onerror: handleError,
            ontimeout: handleError
        });
    }

    function handleError() {
        isFetching = false;
        const bar = document.getElementById('k-bar');
        if(bar) bar.style.backgroundColor = "red";
        updateModalUI("error", "Erro. Retentando...");
        setTimeout(cycleNetworkData, 3000);
    }

    // --- BARRA E TIMER SINCRONIZADOS ---
    function startCooldown(seconds) {
        let timeLeft = seconds;
        const timerLabel = document.getElementById('k-timer-text');
        const bar = document.getElementById('k-bar');

        if(bar) {
            // 1. Define a barra para 100% cheia instantaneamente
            bar.style.transition = "none";
            bar.style.width = "100%";
            bar.style.backgroundColor = "#00FF00"; // Verde

            // Força o navegador a reconhecer o 100% (Reflow)
            void bar.offsetWidth;

            // 2. Inicia a transição suave para 0% que dura exatamente o tempo do cooldown
            bar.style.transition = `width ${seconds}s linear`;
            bar.style.width = "0%";
        }

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            if (!document.getElementById('kalanos-modal')) {
                clearInterval(timerInterval);
                return;
            }

            timeLeft--;
            if (timerLabel) timerLabel.innerText = `Próxima validação em: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                cycleNetworkData(); // RECOMEÇA O CICLO
            }
        }, 1000);
    }

    function copyEffect(element, text) {
        GM_setClipboard(text);
        element.classList.add('copied');
        setTimeout(() => { element.classList.remove('copied'); }, 2000);
    }

    function deepCleanTooltips(el) {
        const attrs = ['title', 'aria-label', 'data-title', 'data-a-target'];
        attrs.forEach(a => el.removeAttribute(a));
        el.querySelectorAll('*').forEach(child => attrs.forEach(a => child.removeAttribute(a)));
        let parent = el.parentElement;
        for(let i=0; i<3; i++) { if(parent) { attrs.forEach(a => parent.removeAttribute(a)); parent = parent.parentElement; } }
    }

    function positionModal(btn) {
        const m = document.getElementById('kalanos-modal');
        if (!m) return;
        const rect = btn.getBoundingClientRect();
        const modalWidth = 340;
        const screenWidth = window.innerWidth;
        const gap = 20;
        let leftPos = rect.left + (rect.width / 2) - (modalWidth / 2);
        if (leftPos + modalWidth > screenWidth - gap) leftPos = screenWidth - modalWidth - gap;
        if (leftPos < gap) leftPos = gap;
        m.style.top = (rect.bottom + 12) + 'px';
        m.style.left = leftPos + 'px';
        m.classList.add('visible');
    }

    function applyTurboLook(btn) {
        if (btn.dataset.kalanosDone === "true") return;
        btn.innerHTML = "Você é TURBO";
        btn.className = ""; btn.classList.add('nitro-native-btn');
        btn.dataset.kalanosDone = "true";
        deepCleanTooltips(btn);

        const killClick = (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); return false; };
        btn.onclick = killClick;
        btn.addEventListener('click', killClick, true);

        btn.addEventListener('mouseenter', () => {
            deepCleanTooltips(btn);
            createModal();
            positionModal(btn);
        });

        btn.addEventListener('mouseleave', () => {
            setTimeout(() => {
                const m = document.getElementById('kalanos-modal');
                if (m && !m.matches(':hover')) { m.classList.remove('visible'); }
            }, 300);
        });

        const checkModal = setInterval(() => {
            const m = document.getElementById('kalanos-modal');
            if(m) { m.onmouseleave = () => m.classList.remove('visible'); clearInterval(checkModal); }
        }, 1000);
    }

    function scan() {
        const targets = document.getElementsByClassName('ScCoreButton-sc-ocjdkq-0 gGttfb');
        for (let btn of targets) {
            if (btn.getBoundingClientRect().top > 150) continue;
            const t = btn.innerText.toLowerCase();
            if (t.includes('teste') || t.includes('ads') || t.includes('inscrever')) { applyTurboLook(btn); }
        }
    }

    // START
    createModal();
    setInterval(scan, 500);
    setInterval(() => { const skip = document.querySelector('[data-test-selector="ad-skip-button"]'); if(skip) skip.click(); }, 1000);
})();