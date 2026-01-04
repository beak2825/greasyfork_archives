// ==UserScript==
// @name         [Popmundo] Pichador 2.0
// @namespace    Violentmonkey Scripts
// @author       Popper
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @version      4.3
// @description  Permite selecionar manualmente qual tipo de local pichar.
// @downloadURL https://update.greasyfork.org/scripts/548604/%5BPopmundo%5D%20Pichador%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/548604/%5BPopmundo%5D%20Pichador%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    // CONFIGURAÇÕES
    // ========================================================================
    const SCRIPT_VERSION = "4.3";
    const COOLDOWN_DURATION = (3 * 60 + 10) * 1000; // 3 minutos e 10 segundos
    const SPRAY_CAN_NAMES = ["Lata de spray", "Spray Can"];
    const TIPOS_DE_LOCAL_ALVO = { "Clube": "1", "Restaurante": "50", "Loja genérica": "20", "Academia": "11", "Estúdio de ensaio": "8", "Estúdio de gravação": "6", "Universidade": "88", "Tribunal de Justiça": "65", "Prefeitura": "10", "Hospital": "5", "Banco": "26", "Delegacia": "37", "Achados e perdidos": "100", "Advocacia": "31", "Aeroporto": "2", "Cadeia": "23", "Cemitério": "22", "Centro de pesquisa": "61", "Clínica de cirurgia plástica": "47", "Clínica psicológica": "86", "Clube social": "56", "Concessionária": "39", "Corpo de bombeiros": "63", "Correios": "114", "Creche": "59", "Depósito abandonado": "110", "Empreiteira": "27", "Empresa de segurança": "36", "Escola": "25", "Estação de TV": "53", "Estacionamento": "85", "Estádio": "102", "Estrada para fora da cidade": "99", "Estúdio de tatuagem": "52", "Fábrica": "29", "Hotel": "32", "Imobiliária": "98", "Linha de metrô": "64", "Lixão": "67", "Local do Festival": "89", "Loja": "124", "Loja de armas": "83", "Loja de equipamentos": "41", "Mercado Clandestino": "28", "Museu": "111", "Parque": "3", "Praia pública": "104", "Quitanda": "84", "Reservatório de água": "58", "Rodoviária": "38", "Sede administrativa": "66", "Templo": "60", "Usina elétrica": "57", "Zona rural": "49" };

    const PANEL_POSITION_KEY = "pichadorPanelPosition";
    const THEME_KEY = "pichadorTheme";
    const MINIMIZED_KEY = "pichadorMinimized";

    // ========================================================================
    // LÓGICA DO SCRIPT
    // ========================================================================
    let cityId = null;
    let isLogicRunning = false;
    let currentTheme = GM_getValue(THEME_KEY, 'light');
    let isMinimized = GM_getValue(MINIMIZED_KEY, false);

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function injectExternalStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(link);
    }

    function toggleMinimize(minimized, save = true) {
        const panel = document.getElementById('pichadorPanel');
        const toggleButton = document.getElementById('pichadorMinimizeToggle');
        if (minimized) {
            panel.classList.add('minimized');
            toggleButton.querySelector('i').classList.remove('fa-window-minimize');
            toggleButton.querySelector('i').classList.add('fa-window-maximize');
            toggleButton.title = 'Maximizar';
        } else {
            panel.classList.remove('minimized');
            toggleButton.querySelector('i').classList.remove('fa-window-maximize');
            toggleButton.querySelector('i').classList.add('fa-window-minimize');
            toggleButton.title = 'Minimizar';
        }
        if (save) { GM_setValue(MINIMIZED_KEY, minimized); }
    }

    function setupUI() {
        const container = document.createElement('div');
        container.id = 'pichadorPanel';
        container.className = currentTheme;
        container.innerHTML = `
            <div class="pm-panel-header">
                <h4><i class="fa-solid fa-spray-can-sparkles"></i> Pichador Automático <span>v${SCRIPT_VERSION}</span></h4>
                <div class="pm-header-controls">
                    <button id="pichadorThemeToggle" title="Alternar Tema"><i class="fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button>
                    <button id="pichadorMinimizeToggle" title="Minimizar"><i class="fa-solid fa-window-minimize"></i></button>
                </div>
            </div>
            <div class="pm-content-wrapper">
                <div class="setting">
                    <label for="localeTypeSelect"><i class="fa-solid fa-crosshairs"></i> Selecione o Tipo de Alvo:</label>
                    <select id="localeTypeSelect"></select>
                </div>
                <div id="pichadorStatus" class="pm-status-box">Pronto.</div>
                <div id="pichadorProgress" class="pm-progress-box"></div>
                <button id="startStopBtn" class="pm-action-button">Iniciar</button>
                <div class="pm-log-header">
                    <div><i class="fa-solid fa-clipboard-list"></i> Log de Atividades:</div>
                    <button id="clearLogBtn" class="pm-clear-button"><i class="fa-solid fa-broom"></i> Limpar</button>
                </div>
                <div id="pichadorActionLog" class="pm-log-container"></div>
            </div>
        `;
        document.body.appendChild(container);

        const panelElement = document.getElementById('pichadorPanel');
        const savedPosition = JSON.parse(GM_getValue(PANEL_POSITION_KEY, '{}'));
        if (savedPosition.top && savedPosition.left) {
            panelElement.style.top = savedPosition.top;
            panelElement.style.left = savedPosition.left;
        }

        toggleMinimize(isMinimized, false);

        const select = document.getElementById('localeTypeSelect');
        Object.entries(TIPOS_DE_LOCAL_ALVO).forEach(([name, value]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = name;
            select.appendChild(option);
        });
        select.value = GM_getValue('pichador_lastTarget', '1');
        select.addEventListener('change', () => GM_setValue('pichador_lastTarget', select.value));

        updateUI();

        document.getElementById('startStopBtn').addEventListener('click', () => {
            const isRunning = GM_getValue('pichador_isRunning', false);
            GM_setValue('pichador_isRunning', !isRunning);
            if (!isRunning) {
                log('▶️ Script iniciado pelo usuário.');
                GM_deleteValue('pichador_run_state');
                runScriptLogic();
            } else {
                log('⏹️ Script pausado pelo usuário.');
                updateStatus('Pausado.');
            }
            updateUI();
        });

        document.getElementById('pichadorThemeToggle').addEventListener('click', (e) => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            panelElement.className = currentTheme;
            e.currentTarget.querySelector('i').className = `fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
            GM_setValue(THEME_KEY, currentTheme);
        });

        document.getElementById('pichadorMinimizeToggle').addEventListener('click', () => {
            isMinimized = !isMinimized;
            toggleMinimize(isMinimized, true);
        });

        document.getElementById('clearLogBtn').addEventListener('click', () => {
            if (confirm("Limpar todo o log de atividades?")) {
                document.getElementById('pichadorActionLog').innerHTML = '';
                log("Log limpo.");
            }
        });

        const header = panelElement.querySelector('.pm-panel-header');
        header.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            const pos1 = e.clientX, pos2 = e.clientY;
            const initialTop = panelElement.offsetTop;
            const initialLeft = panelElement.offsetLeft;

            function elementDrag(e) {
                const pos3 = e.clientX, pos4 = e.clientY;
                panelElement.style.top = (initialTop + pos4 - pos2) + "px";
                panelElement.style.left = (initialLeft + pos3 - pos1) + "px";
            }
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                GM_setValue(PANEL_POSITION_KEY, JSON.stringify({ top: panelElement.style.top, left: panelElement.style.left }));
            }
            document.onmousemove = elementDrag;
            document.onmouseup = closeDragElement;
        });
    }

    function updateUI() {
        const isRunning = GM_getValue('pichador_isRunning', false);
        const startStopBtn = document.getElementById('startStopBtn');
        startStopBtn.textContent = isRunning ? 'Pausar' : 'Iniciar';
        startStopBtn.style.backgroundColor = isRunning ? 'var(--pm-error-color)' : 'var(--pm-success-color)';
        document.getElementById('localeTypeSelect').disabled = isRunning;
    }

    function log(message) {
        const logContainer = document.getElementById('pichadorActionLog');
        if (logContainer) {
            const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            logContainer.insertAdjacentHTML('afterbegin', `<div class="pm-log-entry">[${timestamp}] ${message}</div>`);
        }
        console.log(`[Pichador] ${message}`);
    }

    function updateStatus(message) { document.getElementById('pichadorStatus').innerHTML = message; }
    function updateProgress(message) {
        const progressEl = document.getElementById('pichadorProgress');
        progressEl.style.display = message ? 'block' : 'none';
        progressEl.innerHTML = message;
    }

    async function createIframe() {
        let iframe = document.getElementById('pichador-iframe');
        if (iframe) iframe.remove();
        iframe = document.createElement('iframe');
        iframe.id = 'pichador-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        return iframe;
    }

    async function loadIframePage(iframe, url) {
        return new Promise((resolve, reject) => {
            iframe.onload = () => setTimeout(() => iframe.contentDocument ? resolve(iframe.contentDocument) : reject(new Error('Iframe access error')), 2000);
            iframe.onerror = () => reject(new Error(`Failed to load iframe: ${url}`));
            iframe.src = url;
        });
    }

    async function detectCurrentCity(iframe) {
        if (cityId) return true;
        log(`🔍 Detectando cidade...`);
        const doc = await loadIframePage(iframe, `https://${window.location.hostname}/World/Popmundo.aspx/City`);
        const cityDropdown = doc.querySelector('#ctl00_cphRightColumn_ctl01_ddlCities');
        if (cityDropdown && cityDropdown.value) {
            cityId = cityDropdown.value;
            log(`🏙️ Cidade detectada: ${cityDropdown.options[cityDropdown.selectedIndex].text} (ID: ${cityId})`);
            return true;
        }
        log("❌ Falha ao detectar a cidade.");
        return false;
    }

    async function fetchLocations(iframe, categoryValue) {
        const categoryName = document.querySelector(`#localeTypeSelect option[value="${categoryValue}"]`).textContent;
        log(`🎯 Buscando locais para "${categoryName}"...`);
        const searchPageUrl = `https://${window.location.hostname}/World/Popmundo.aspx/City/Locales/${cityId}`;
        const doc = await loadIframePage(iframe, searchPageUrl);
        const typeDropdown = doc.querySelector('#ctl00_cphLeftColumn_ctl00_ddlLocaleType');
        const findBtn = doc.querySelector('#ctl00_cphLeftColumn_ctl00_btnFind');
        if (!typeDropdown || !findBtn) { log("❌ Formulário de busca não encontrado."); return []; }
        typeDropdown.value = categoryValue;
        findBtn.click();
        await new Promise(resolve => iframe.onload = resolve);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const updatedDoc = iframe.contentDocument;
        const links = updatedDoc.querySelectorAll('#ppm-content table a[href*="/Locale/"]');
        if (links.length === 0) { log(`- Nenhum local encontrado para "${categoryName}".`); return []; }
        log(`✅ Encontrados ${links.length} locais para "${categoryName}".`);
        return Array.from(links).map(link => link.href);
    }

    async function checkGraffiti(iframe, localeUrl) {
        const doc = await loadIframePage(iframe, localeUrl);
        return { isTagged: !!doc.querySelector('#ctl00_cphLeftColumn_ctl00_divGraffiti'), doc: doc };
    }

    async function moveToLocale(iframe, doc) {
        let moveLink = null;
        const moveTexts = ["Mover-se para este local", "Move to this locale"];
        moveLink = Array.from(doc.querySelectorAll('a')).find(link => moveTexts.includes(link.textContent.trim()));
        if (!moveLink) {
            const moveImage = doc.querySelector('img[src*="movetolocale"]');
            if (moveImage) moveLink = moveImage.closest('a');
        }
        if (moveLink) {
            log("🔗 Link de movimento encontrado. Clicando...");
            await loadIframePage(iframe, moveLink.href);
            return true;
        }
        if (doc.querySelector('.information-box')?.textContent.includes("Você já está aqui")) {
            log("- Já estamos no local.");
            return true;
        }
        log("❌ Link de movimento não encontrado.");
        return false;
    }

    async function useSprayCan() {
        const itemRows = document.querySelectorAll('#checkedlist tbody tr.hoverable');
        for (const row of itemRows) {
            const itemName = row.querySelector('td.middle a[id*="lnkItem"]')?.textContent.trim();
            if (itemName && SPRAY_CAN_NAMES.some(name => itemName.includes(name))) {
                const useBtn = row.querySelector('td.right input[type="image"][title="Usar"]');
                if (useBtn) { useBtn.click(); return true; }
            }
        }
        return false;
    }

    async function runScriptLogic() {
        if (isLogicRunning || !GM_getValue('pichador_isRunning', false)) return;
        isLogicRunning = true;
        try {
            const cooldownEnd = GM_getValue('pichador_cooldownEnd', 0);
            if (Date.now() < cooldownEnd) {
                isLogicRunning = false; return;
            }
            const iframe = await createIframe();
            if (!(await detectCurrentCity(iframe))) {
                GM_setValue('pichador_isRunning', false); updateUI(); isLogicRunning = false; return;
            }
            let state = JSON.parse(GM_getValue('pichador_run_state', '{}'));
            if (!state.locations) {
                const selectedCategory = document.getElementById('localeTypeSelect').value;
                state.locations = await fetchLocations(iframe, selectedCategory);
                state.currentIndex = 0;
            }
            if (state.locations.length === 0) {
                log('- Nenhum local para pichar nesta categoria.');
                updateStatus('🏁 Nenhum local encontrado.');
                GM_setValue('pichador_isRunning', false); updateUI(); isLogicRunning = false; return;
            }
            while (state.currentIndex < state.locations.length) {
                if (!GM_getValue('pichador_isRunning', false)) { isLogicRunning = false; return; }
                const localeUrl = state.locations[state.currentIndex];
                const localeName = localeUrl.split('/').pop();
                updateStatus(`Verificando alvos...`);
                updateProgress(`📍 ${state.currentIndex + 1}/${state.locations.length}: ${localeName}`);
                log(`👀 Verificando ${localeName}...`);
                const { isTagged, doc } = await checkGraffiti(iframe, localeUrl);
                if (isTagged) {
                    log(`- Já pichado. Pulando.`);
                    state.currentIndex++;
                } else {
                    log(`🎯 Alvo encontrado! Movendo para ${localeName}...`);
                    updateStatus(`Movendo para o local...`);
                    if (await moveToLocale(iframe, doc)) {
                        log("✅ Movimento bem-sucedido. Usando o spray...");
                        updateStatus(`Pichando...`);
                        if (await useSprayCan()) {
                            log(`✅ Pichação bem-sucedida!`);
                            GM_setValue('pichador_cooldownEnd', Date.now() + COOLDOWN_DURATION);
                            state.currentIndex++;
                            GM_setValue('pichador_run_state', JSON.stringify(state));
                            updateStatus(`⏳ Entrando em cooldown...`);
                            isLogicRunning = false; return;
                        } else {
                            log(`❌ Lata de spray não encontrada! Pausando script.`);
                            updateStatus('❌ Sem lata de spray!');
                            GM_setValue('pichador_isRunning', false); updateUI(); isLogicRunning = false; return;
                        }
                    } else {
                        log(`❌ Falha ao se mover. Pulando para o próximo alvo.`);
                        updateStatus(`❌ Falha no movimento.`);
                        state.currentIndex++;
                    }
                }
                GM_setValue('pichador_run_state', JSON.stringify(state));
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            log('🎉🎉🎉 Todos os locais desta categoria foram verificados! 🎉🎉🎉');
            updateStatus('🏁 Categoria finalizada!');
            GM_setValue('pichador_isRunning', false);
            GM_deleteValue('pichador_run_state');
            updateUI();
        } catch (error) {
            log(`❌ Erro inesperado: ${error.message}`);
            console.error(error);
            updateStatus('❌ Erro no script');
            GM_setValue('pichador_isRunning', false);
            updateUI();
        } finally {
            isLogicRunning = false;
        }
    }

    function tick() {
        if (!GM_getValue('pichador_isRunning', false)) return;
        const cooldownEnd = GM_getValue('pichador_cooldownEnd', 0);
        if (Date.now() < cooldownEnd) {
            const remainingMs = cooldownEnd - Date.now();
            const totalSeconds = Math.floor(remainingMs / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            updateStatus(`⏳ Em cooldown (${minutes} min e ${seconds} seg)`);
        } else {
            runScriptLogic();
        }
    }

    GM_addStyle(`
        :root { --pm-font-family: 'Roboto', 'Segoe UI', sans-serif; --pm-shadow-color: rgba(0, 0, 0, 0.15); --pm-success-color: #28a745; --pm-error-color: #dc3545; --pm-warning-color: #ffc107; --pm-info-color: #17a2b8; --pm-accent-color: #0056b3; }
        #pichadorPanel.light { --pm-bg-color: #f0f0f0; --pm-text-color: #2c3e50; --pm-text-color-secondary: #7f8c8d; --pm-border-color: #bdc3c7; --pm-subtle-bg: #ffffff; --pm-input-bg: #ffffff; --pm-input-border: var(--pm-border-color); --pm-button-text: #ffffff; --pm-log-bg: #e9ecef; }
        #pichadorPanel.dark { --pm-bg-color: #3d3d3d; --pm-text-color: #f0f0f0; --pm-text-color-secondary: #b0b0b0; --pm-border-color: #555555; --pm-subtle-bg: #474747; --pm-input-bg: #505050; --pm-input-border: #6a6a6a; --pm-button-text: #ffffff; --pm-log-bg: #474747; --pm-shadow-color: rgba(0, 0, 0, 0.4); }
        #pichadorPanel { position: fixed; top: 100px; right: 20px; background-color: var(--pm-bg-color); border: 1px solid var(--pm-border-color); z-index: 10001; width: 280px; font-family: var(--pm-font-family); font-size: 12px; color: var(--pm-text-color); box-shadow: 0 4px 12px var(--pm-shadow-color); border-radius: 5px; overflow: hidden; }
        #pichadorPanel i.fa-solid { margin-right: 5px; width: 1.1em; text-align: center; }
        .pm-panel-header { background-color: var(--pm-subtle-bg); border-bottom: 1px solid var(--pm-border-color); padding: 6px 10px; cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center; }
        .pm-panel-header h4 { margin: 0; font-size: 14px; font-weight: 700; } .pm-panel-header h4 i { color: var(--pm-accent-color); } .pm-panel-header h4 span { font-size: 9px; color: var(--pm-text-color-secondary); margin-left: 5px; }
        .pm-header-controls { display: flex; gap: 8px; } .pm-header-controls button { background: none; border: none; color: var(--pm-text-color-secondary); cursor: pointer; font-size: 12px; padding: 0; } .pm-header-controls button:hover { color: var(--pm-accent-color); }
        #pichadorPanel.minimized .pm-content-wrapper { display: none; }
        .pm-content-wrapper { padding: 10px; }
        .setting { margin-bottom: 12px; } .setting label { font-size: 11px; color: var(--pm-text-color-secondary); margin-bottom: 4px; display: block; }
        select#localeTypeSelect { width: 100%; padding: 6px 8px; border: 1px solid var(--pm-input-border); background: var(--pm-input-bg); color: var(--pm-text-color); border-radius: 3px; font-size: 12px; }
        .pm-action-button { width: 100%; border: none; border-radius: 4px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s ease; padding: 10px 12px; color: var(--pm-button-text); margin-top: 10px; }
        .pm-status-box { font-size: 11px; padding: 8px 10px; margin: 10px 0; background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); border-left: 3px solid var(--pm-accent-color); border-radius: 3px; text-align: center; }
        .pm-progress-box { font-size: 11px; color: var(--pm-text-color-secondary); text-align: center; margin-bottom: 10px; display: none; }
        .pm-log-header { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; margin-bottom: 5px; font-size: 10px; color: var(--pm-text-color-secondary); }
        .pm-clear-button { background: transparent; border: 1px solid var(--pm-border-color); color: var(--pm-text-color-secondary); font-size: 10px; padding: 2px 8px; border-radius: 3px; cursor: pointer; }
        .pm-log-container { font-size: 10px; height: 150px; overflow-y: auto; padding: 8px; background: var(--pm-log-bg); border: 1px solid var(--pm-border-color); border-radius: 3px; color: var(--pm-text-color-secondary); }
        .pm-log-entry { padding-bottom: 3px; margin-bottom: 3px; border-bottom: 1px dashed var(--pm-border-color); } .pm-log-entry:last-child { border-bottom: none; }
    `);

    waitForElement('#checkedlist').then(() => {
        console.log('[Pichador] Tabela de itens carregada. Iniciando UI.');
        injectExternalStyles();
        setupUI();
        setInterval(tick, 1000);
    });

})();
