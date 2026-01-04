// ==UserScript==
// @name        [Popmundo] Pichador de Zona Automático
// @namespace   Violentmonkey Scripts
// @author      Popper 
// @match       https://*.popmundo.com/World/Popmundo.aspx/City/CityZoneDetails/*
// @grant       none
// @version     3.8
// @description Picha uma ZONA INTEIRA com modos "Pichar (Evitando Amigos)", "Pichar Pichados/Vazio" e "Pichar Vazio".
// @downloadURL https://update.greasyfork.org/scripts/548598/%5BPopmundo%5D%20Pichador%20de%20Zona%20Autom%C3%A1tico.user.js
// @updateURL https://update.greasyfork.org/scripts/548598/%5BPopmundo%5D%20Pichador%20de%20Zona%20Autom%C3%A1tico.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIGURAÇÕES GERAIS =====
    const COOLDOWN_DURATION = ((3 * 60) + 10) * 1000;
    const SPRAY_CAN_NAMES = ["Lata de spray", "Spray Can"];

    // ===== CONFIGURAÇÕES DO NOME DO TIME =====
    const SPRAY_CAN_CUSTOM_NAME = "👻TIME TRAVESSURAS👻";

    // ===== LISTA DE TIMES PARA NÃO PICHAR EM CIMA =====
    // O modo "Evitando Amigos" vai pular qualquer local que contenha um desses textos.
    const IGNORED_GRAFFITI_TEAMS = [
        "👻TIME TRAVESSURAS👻"
        // Adicione outros nomes de times amigos aqui, se precisar. Ex:
        // "🎃TIME GOSTOSURAS🎃"
    ];

    // ===== CONFIGURAÇÕES DE COMPRA =====
    const PURCHASE_QUANTITY = 1;
    const CATEGORY_ID_ART_SUPPLIES = "55";
    const ITEM_TYPE_ID_SPRAY_CAN = "67";
    // ===================================

    let isRunning = false;
    let allLocalesInZone = [];
    let currentLocaleIndex = 0;
    let cooldownEndTime = 0;

    // #region --- UI & Estilos ---
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .graffiti-panel { margin-bottom: 20px; position: relative; z-index: 1000; }
            .graffiti-panel .box { background: #fff; border: 1px solid #d3d3d3; padding: 10px; }
            .graffiti-panel .header { background: #e6e6e6; padding: 5px 10px; border-bottom: 1px solid #d3d3d3; }
            .graffiti-panel h2 { margin: 0; color: #003087; font-size: 16px; font-weight: bold; }
            .graffiti-panel .description { color: #333; margin: 5px 0 0; font-size: 12px; }
            .graffiti-panel .content { padding: 10px 0; }
            .graffiti-panel .status { color: #0066cc; font-weight: bold; margin: 10px 0; font-size: 12px; }
            .graffiti-panel .actionbuttons { margin: 10px 0; display: flex; flex-wrap: wrap; gap: 10px; }
            .graffiti-panel .actionbuttons input[type="button"] { background: #666666; color: white; border: 1px solid #444444; padding: 5px 10px; cursor: pointer; font-size: 12px; }
            .graffiti-panel .actionbuttons input[type="button"].test-button { background: #003087; border-color: #00205b; }
            .graffiti-panel .actionbuttons input[type="button"]:disabled { background: #cccccc; border-color: #999999; cursor: not-allowed; }
            .graffiti-panel .progress { margin: 10px 0; font-size: 12px; color: #555; }
            .graffiti-panel .dataTable { width: 100%; border-collapse: collapse; margin-top: 10px; max-height: 150px; overflow-y: auto; font-size: 11px; }
            .graffiti-panel .dataTable thead { background: #e6e6e6; }
            .graffiti-panel .dataTable th { width: 100%; padding: 5px 10px; text-align: left; border-bottom: 1px solid #d3d3d3; position: sticky; top: 0; box-sizing: border-box; }
            .graffiti-panel .dataTable td { padding: 5px 10px; border-bottom: 1px solid #eee; color: #333; }
        `;
        document.head.appendChild(style);
    }

    function setupUI() {
        const zoneName = document.querySelector('h1')?.textContent || 'Zona Atual';
        const container = document.createElement('div');
        container.className = 'graffiti-panel';
        container.innerHTML = `
            <div class="box">
                <div class="header">
                    <h2>Pichador da Zona: ${zoneName}</h2>
                    <p class="description">Comprará ${PURCHASE_QUANTITY} lata e a renomeará para "${SPRAY_CAN_CUSTOM_NAME}" se o estoque acabar.</p>
                </div>
                <div class="content">
                    <div class="status" id="status">Pronto para começar</div>
                    <p class="actionbuttons">
                        <input type="button" id="startAvoidBtn" value="Pichar (Evitando Amigos)">
                        <input type="button" id="startTaggedOrUntaggedBtn" value="Pichar Pichados/Vazio">
                        <input type="button" id="startUntaggedBtn" value="Pichar Vazio">
                        <input type="button" id="startTestBtn" value="Testar Compra" class="test-button">
                    </p>
                    <div class="progress" id="progress"></div>
                    <table class="data dataTable" id="logTable">
                        <thead><tr><th>Log de Atividade</th></tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;

        const target = document.querySelector('table#tabletypes') || document.querySelector('#aspnetForm');
        target.parentNode.insertBefore(container, target);

        document.getElementById('startTestBtn').addEventListener('click', runPurchaseTest);
        document.getElementById('startAvoidBtn').addEventListener('click', () => startTagging('avoid_friends'));
        document.getElementById('startTaggedOrUntaggedBtn').addEventListener('click', () => startTagging('tagged_or_untagged'));
        document.getElementById('startUntaggedBtn').addEventListener('click', () => startTagging('untagged'));
        injectStyles();
    }
    // #endregion

    // #region --- Funções de Utilidade (Log, Iframe, etc.) ---
    function log(message) {
        const tbody = document.querySelector('#logTable tbody');
        if (tbody) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${new Date().toLocaleTimeString()} - ${message}</td>`;
            tbody.appendChild(row);
            tbody.scrollTop = tbody.scrollHeight;
        }
        console.log(`[Pichador de Zona] ${message}`);
    }

    function updateStatus(message) { document.getElementById('status').innerHTML = message; }
    function updateProgress(message) { document.getElementById('progress').innerHTML = message; }

    async function createIframe() {
        let iframe = document.getElementById('graffiti_iframe');
        if (iframe) iframe.remove();
        iframe = document.createElement('iframe');
        iframe.id = 'graffiti_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        return iframe;
    }

    async function loadIframePage(iframe, url) {
        return new Promise((resolve, reject) => {
            iframe.onload = () => setTimeout(() => {
                if (iframe.contentDocument) resolve(iframe.contentDocument);
                else reject(new Error(`Iframe content not accessible: ${url}`));
            }, 3500);
            iframe.onerror = () => reject(new Error(`Failed to load iframe: ${url}`));
            iframe.src = url;
        });
    }
    // #endregion

    // #region --- Lógica de Compra e Renomeação ---
    async function countSprayCansInInventory(iframe) {
        log("🔎 Verificando inventário...");
        const inventoryUrl = `https://${window.location.hostname}/World/Popmundo.aspx/Character/Items`;
        const doc = await loadIframePage(iframe, inventoryUrl);
        let canCount = 0;
        const itemRows = doc.querySelectorAll('#checkedlist tbody tr');
        for (const row of itemRows) {
            const itemNameElement = row.querySelector('td.middle a[id*="lnkItem"]');
            if (itemNameElement && SPRAY_CAN_NAMES.some(name => itemNameElement.textContent.trim().includes(name))) {
                const stackElement = row.querySelector('td.middle em');
                if (stackElement && stackElement.textContent.trim().startsWith('x')) {
                    canCount += parseInt(stackElement.textContent.trim().replace('x', ''), 10);
                } else {
                    canCount += 1;
                }
            }
        }
        log(canCount > 0 ? `✅ Encontradas ${canCount} latas de spray.` : "❌ Nenhuma lata de spray no inventário.");
        return canCount;
    }

    async function buySprayCans(iframe) {
        log(`🛒 Iniciando compra para ${PURCHASE_QUANTITY} lata(s)...`);
        updateStatus("🛒 Comprando latas de spray...");
        try {
            const shoppingUrl = `https://${window.location.hostname}/World/Popmundo.aspx/Character/ShoppingAssistant`;
            let doc = await loadIframePage(iframe, shoppingUrl);
            const categorySelect = doc.querySelector('select[id*="ddlShopItemCategories"]');
            if (!categorySelect) throw new Error("Dropdown de categoria não encontrado.");
            categorySelect.value = CATEGORY_ID_ART_SUPPLIES;
            await new Promise(resolve => { iframe.onload = () => setTimeout(resolve, 3000); iframe.contentWindow.__doPostBack(categorySelect.name, ''); });
            doc = iframe.contentDocument;
            const itemTypeSelect = doc.querySelector('select[id*="ddlShopItemTypes"]');
            if (!itemTypeSelect) throw new Error("Dropdown de tipo de item não encontrado.");
            itemTypeSelect.value = ITEM_TYPE_ID_SPRAY_CAN;
            await new Promise(resolve => { iframe.onload = () => setTimeout(resolve, 3000); iframe.contentWindow.__doPostBack(itemTypeSelect.name, ''); });
            doc = iframe.contentDocument;
            const amountInput = doc.querySelector('input[id*="txtAmount"]');
            const buyButton = doc.querySelector('input[id*="btnBuyItem"]');
            if (!amountInput || !buyButton) throw new Error("Campos de compra não encontrados.");
            amountInput.value = PURCHASE_QUANTITY;
            await new Promise(resolve => { iframe.onload = () => setTimeout(resolve, 3000); buyButton.click(); });
            doc = iframe.contentDocument;
            const successNotification = doc.querySelector('div.notification-success');
            if (successNotification && successNotification.textContent.includes("Você comprou")) {
                log("✅ Compra confirmada!");
                return true;
            } else {
                const errorNotification = doc.querySelector('div.notification-error');
                const reason = errorNotification ? errorNotification.textContent.trim() : "Mensagem de sucesso não encontrada.";
                throw new Error(reason);
            }
        } catch (error) {
            log(`❌ Erro durante a compra: ${error.message}`);
            updateStatus(`❌ Falha na compra: ${error.message}`);
            return false;
        }
    }

    async function renameNewlyBoughtCans(iframe) {
        log("✏️ Iniciando processo para renomear latas...");
        updateStatus("✏️ Renomeando latas...");
        try {
            const inventoryUrl = `https://${window.location.hostname}/World/Popmundo.aspx/Character/Items`;
            let doc = await loadIframePage(iframe, inventoryUrl);
            const urlsToRename = [];
            const itemRows = doc.querySelectorAll('#checkedlist tbody tr');
            for (const row of itemRows) {
                const itemNameElement = row.querySelector('a[id*="lnkItem"]');
                const isSprayCan = itemNameElement && SPRAY_CAN_NAMES.includes(itemNameElement.textContent.trim());
                if (isSprayCan) {
                    const customNameDiv = row.querySelector('div[class*="cText_"] em');
                    if (!customNameDiv) { urlsToRename.push(itemNameElement.href); }
                }
            }
            if (urlsToRename.length === 0) { log("⚠️ Nenhuma lata sem nome encontrada para renomear."); return true; }
            log(`   - Encontradas ${urlsToRename.length} latas para renomear.`);
            for (let i = 0; i < urlsToRename.length; i++) {
                const url = urlsToRename[i];
                log(`   - Renomeando lata ${i + 1}/${urlsToRename.length}...`);
                doc = await loadIframePage(iframe, url);
                const initialRenameButton = doc.querySelector('input[id*="btnItemName"]');
                if (!initialRenameButton) { log(`   - ⚠️ Botão 'Nomear' inicial não encontrado.`); continue; }
                await new Promise(resolve => { iframe.onload = () => setTimeout(resolve, 3000); initialRenameButton.click(); });
                doc = iframe.contentDocument;
                const renameInput = doc.querySelector('input[id*="txtItemName"]');
                const confirmButton = doc.querySelector('input[id*="btnItemNameConfirm"]');
                if (renameInput && confirmButton) {
                    renameInput.value = SPRAY_CAN_CUSTOM_NAME;
                    await new Promise(resolve => { iframe.onload = () => setTimeout(resolve, 3000); confirmButton.click(); });
                    log(`   - ✅ Lata renomeada.`);
                } else {
                    log(`   - ⚠️ Formulário de renomeação não encontrado.`);
                }
            }
            log("✅ Todas as latas novas foram renomeadas.");
            return true;
        } catch (error) {
            log(`❌ Erro ao renomear latas: ${error.message}`);
            return false;
        }
    }
    // #endregion

    // #region --- Lógica de Pichação ---
    async function fetchAllLocalesInZone(iframe) {
        log('🗺️ Mapeando todos os locais na zona...');
        updateStatus('🗺️ Mapeando locais...');
        const localeTypeRows = document.querySelectorAll('#tabletypes tbody tr');
        let allLocales = [];

        for (const row of localeTypeRows) {
            const linkElement = row.querySelector('td:first-child a');
            const countElement = row.querySelector('td:nth-child(2)');
            const localeTypeName = linkElement ? linkElement.textContent.trim() : "Tipo sem link";

            if (linkElement && countElement && parseInt(countElement.textContent.trim(), 10) > 0) {
                log(`🔹 Buscando locais do tipo "${localeTypeName}"...`);
                updateProgress(`Buscando: ${localeTypeName}`);
                try {
                    let doc = await loadIframePage(iframe, linkElement.href);
                    const findBtn = doc.querySelector('input[id*="btnFind"]');
                    if (!findBtn) {
                        log(`   - ⚠️ Botão "Encontrar" não encontrado para "${localeTypeName}". Pulando.`);
                        continue;
                    }
                    log(`   - Clicando em "Encontrar locais" para carregar a lista...`);
                    await new Promise(resolve => {
                        iframe.onload = () => setTimeout(resolve, 3500);
                        findBtn.click();
                    });
                    const updatedDoc = iframe.contentDocument;
                    const moveLinks = updatedDoc.querySelectorAll('table#tablelocales a[href*="/Locale/MoveToLocale/"]');
                    if (moveLinks.length > 0) {
                        const localesData = Array.from(moveLinks).map(link => ({
                            moveUrl: link.href,
                            mainUrl: link.href.replace('/MoveToLocale', '')
                        }));
                        allLocales.push(...localesData);
                        log(`   - ✅ Adicionados ${localesData.length} locais.`);
                    } else {
                        log(`   - ⚠️ Nenhum local encontrado para "${localeTypeName}" após o clique.`);
                    }
                } catch (error) {
                    log(`   - ❌ Erro ao buscar "${localeTypeName}": ${error.message}`);
                }
            }
        }

        if (allLocales.length > 0) {
            log(`🗺️ Mapeamento concluído. Total de ${allLocales.length} locais encontrados na zona.`);
        } else {
            log('❌ Nenhum local disponível para pichar nesta zona.');
        }

        return allLocales;
    }

    async function analyzeGraffiti(iframe, mainUrl) {
        const localeName = new URL(mainUrl).pathname.split('/').pop();
        log(`👀 Analisando pichação em ${localeName}...`);
        try {
            const doc = await loadIframePage(iframe, mainUrl);
            const graffitiDiv = doc.querySelector('#ctl00_cphLeftColumn_ctl00_divGraffiti');
            if (!graffitiDiv) {
                log(`❌ Local não pichado.`);
                return 'UNTAGGED';
            }
            const graffitiContent = graffitiDiv.textContent || "";
            for (const friend of IGNORED_GRAFFITI_TEAMS) {
                if (graffitiContent.includes(friend)) {
                    log(`🤝 Pichação amiga encontrada ("${friend}"). Pulando.`);
                    return 'FRIENDLY_GRAFFITI';
                }
            }
            log(`✅ Local já pichado por outro time.`);
            return 'TAGGED_BY_OTHER';
        } catch (error) {
            log(`⚠️ Erro ao analisar pichação em ${localeName}. Assumindo como "vazio".`);
            return 'UNTAGGED';
        }
    }

    async function moveToLocale(iframe, moveUrl) {
        const localeName = new URL(moveUrl).pathname.split('/').pop();
        log(`🚶 Movendo-se para a porta de ${localeName}...`);
        try {
            await loadIframePage(iframe, moveUrl);
            log(`✅ Movimento para ${localeName} concluído.`); return true;
        } catch (error) {
            log(`❌ Falha ao se mover: ${error.message}`); return false;
        }
    }

    async function useSprayCan(iframe) {
        log(`🎨 Tentando pichar...`);
        const itemsUrl = `https://${window.location.hostname}/World/Popmundo.aspx/Character/Items/`;
        try {
            const doc = await loadIframePage(iframe, itemsUrl);
            const itemRows = doc.querySelectorAll('#checkedlist tbody tr');
            for (const row of itemRows) {
                const itemNameElement = row.querySelector('a[id*="lnkItem"]');
                if (itemNameElement && SPRAY_CAN_NAMES.some(name => itemNameElement.textContent.trim().includes(name))) {
                    const useBtn = row.querySelector('input[id*="btnUse"]');
                    if (useBtn) {
                        useBtn.click();
                        await new Promise(resolve => { iframe.onload = () => setTimeout(resolve, 3000); });
                        log(`✅ Pichação concluída.`); return true;
                    }
                }
            }
            log(`⚠️ Pichação falhou ou sem latas de spray.`); return false;
        } catch (error) {
            log(`❌ Erro ao usar o spray: ${error.message}`); return false;
        }
    }
    // #endregion

    // #region --- Controladores ---
    async function runPurchaseTest() {
        if (isRunning) return;
        isRunning = true;
        const buttons = document.querySelectorAll('.graffiti-panel .actionbuttons input[type="button"]');
        buttons.forEach(btn => btn.disabled = true);
        try {
            log("🚀 MODO DE TESTE INICIADO: Compra e Renomeação");
            updateStatus("🧪 Testando compra e renomeação...");
            const iframe = await createIframe();
            await countSprayCansInInventory(iframe);
            if (await buySprayCans(iframe)) {
                if (await renameNewlyBoughtCans(iframe)) {
                    log("✅ TESTE CONCLUÍDO com sucesso!");
                    updateStatus("✅ Teste de Compra/Renomeação Concluído!");
                } else {
                    log("❌ TESTE FALHOU na etapa de renomeação.");
                    updateStatus("❌ Teste Falhou: Renomeação.");
                }
            } else {
                log("❌ TESTE FALHOU na etapa de compra.");
                updateStatus("❌ Teste Falhou: Compra.");
            }
        } catch (error) {
            log(`❌ Erro Crítico no Teste: ${error.message}`);
            updateStatus('❌ Erro no Teste!');
        } finally {
            isRunning = false;
            buttons.forEach(btn => btn.disabled = false);
        }
    }

    async function startTagging(mode) {
        if (isRunning) return;
        isRunning = true;
        const buttons = document.querySelectorAll('.graffiti-panel .actionbuttons input[type="button"]');
        buttons.forEach(btn => btn.disabled = true);

        try {
            const now = Date.now();
            if (now < cooldownEndTime) {
                const remainingMs = cooldownEndTime - now;
                const totalRemainingSeconds = Math.ceil(remainingMs / 1000);
                const remainingMinutes = Math.floor(totalRemainingSeconds / 60);
                const remainingSeconds = totalRemainingSeconds % 60;
                const timeString = `${remainingMinutes}m ${remainingSeconds}s`;
                log(`⏳ Em espera por ${timeString}`);
                updateStatus(`⏳ Cooldown (${timeString})`);
                return;
            }

            const iframe = await createIframe();

            if (await countSprayCansInInventory(iframe) === 0) {
                if (await buySprayCans(iframe)) {
                    await renameNewlyBoughtCans(iframe);
                } else {
                    updateStatus('❌ Falha na compra inicial. Processo interrompido.'); return;
                }
            }

            if (allLocalesInZone.length === 0) {
                allLocalesInZone = await fetchAllLocalesInZone(iframe);
                if (allLocalesInZone.length === 0) { updateStatus('🏁 Nenhum local encontrado na zona.'); return; }
                currentLocaleIndex = 0;
            }

            updateStatus('🎨 Iniciando pichação...');

            while (currentLocaleIndex < allLocalesInZone.length) {
                const totalLocales = allLocalesInZone.length;
                const localeInfo = allLocalesInZone[currentLocaleIndex];
                const localeName = new URL(localeInfo.mainUrl).pathname.split('/').pop();

                updateProgress(`📈 ${currentLocaleIndex + 1}/${totalLocales} - Alvo: ${localeName}`);

                let shouldTag = false;
                const graffitiStatus = await analyzeGraffiti(iframe, localeInfo.mainUrl);

                switch (mode) {
                    case 'untagged':
                        if (graffitiStatus === 'UNTAGGED') shouldTag = true;
                        break;
                    case 'tagged_or_untagged':
                        if (graffitiStatus === 'UNTAGGED' || graffitiStatus === 'TAGGED_BY_OTHER') shouldTag = true;
                        break;
                    case 'avoid_friends':
                        if (graffitiStatus !== 'FRIENDLY_GRAFFITI') shouldTag = true;
                        break;
                }

                if (shouldTag) {
                    if (await moveToLocale(iframe, localeInfo.moveUrl)) {
                        if (await useSprayCan(iframe)) {
                            cooldownEndTime = Date.now() + COOLDOWN_DURATION;
                            const minutes = Math.floor(COOLDOWN_DURATION / 60000);
                            const seconds = Math.floor((COOLDOWN_DURATION % 60000) / 1000);
                            const timeString = `${minutes}m ${seconds}s`;
                            log(`⏳ Pausa de ${timeString} iniciada.`);
                            updateStatus(`⏳ Pausado por ${timeString}...`);
                            await new Promise(resolve => setTimeout(resolve, COOLDOWN_DURATION));
                            updateStatus('🎨 Retomando...');
                        } else {
                            if (await countSprayCansInInventory(iframe) === 0) {
                                if (await buySprayCans(iframe) && await renameNewlyBoughtCans(iframe)) {
                                    log("✅ Compra e renomeação concluídas. Tentando pichar novamente...");
                                    updateStatus("🎨 Tentando pichar novamente...");
                                    continue;
                                } else {
                                    updateStatus("❌ Falha na compra/renomeação. Processo interrompido."); break;
                                }
                            } else {
                                log("❌ Temos spray, mas 'useSprayCan' falhou. Pulando local.");
                            }
                        }
                    } else {
                        log(`⏩ Pulando ${localeName} por falha ao se mover.`);
                    }
                } else {
                    log(`⏩ Pulando ${localeName} (não corresponde aos critérios).`);
                }

                currentLocaleIndex++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            if (currentLocaleIndex >= allLocalesInZone.length) {
                updateStatus('🏁 Finalizado!'); updateProgress('');
                log('🎉 Todos os locais da zona foram processados.');
                allLocalesInZone = []; currentLocaleIndex = 0;
            }

        } catch (error) {
            log(`❌ Erro Crítico: ${error.message}`);
            updateStatus('❌ Erro!');
        } finally {
            isRunning = false;
            buttons.forEach(btn => btn.disabled = false);
        }
    }

    (function initialize() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setupUI();
        } else {
            window.addEventListener('DOMContentLoaded', setupUI);
        }
    })();
    // #endregion
})();
