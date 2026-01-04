// ==UserScript==
// @name         Popmundo - Cozinheiro Chef
// @namespace    http://tampermonkey.net/
// @version      7.6
// @description  Cozinheiro automático.
// @author       Chris Popper
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Recipes*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Recipe/*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/ShoppingAssistant*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Items*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Inventory*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549675/Popmundo%20-%20Cozinheiro%20Chef.user.js
// @updateURL https://update.greasyfork.org/scripts/549675/Popmundo%20-%20Cozinheiro%20Chef.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configurações ---
    const PAGE_SETTLE_DELAY = 1000;
    const INVENTORY_THRESHOLD = 90; // %

    // --- Chaves de Estado ---
    const STATE_KEY = 'auto_cook_state_v12';
    const RECIPE_QUEUE_KEY = 'auto_cook_queue_v12';
    const CURRENT_RECIPE_URL_KEY = 'current_cook_recipe_url_v12';
    const CURRENT_RECIPE_NAME_KEY = 'current_cook_recipe_name_v12';
    const MISSING_ITEM_NAME_KEY = 'current_cook_missing_item_name_v12';
    const MISSING_ITEM_SUBTYPE_KEY = 'current_cook_missing_item_subtype_v12';
    const MISSING_ITEM_TYPE_KEY = 'auto_cook_missing_item_type_v12';
    const RECIPES_LIST_URL_KEY = 'auto_cook_recipes_list_url_v12';
    const SHOPPING_URL_KEY = 'auto_cook_shopping_url_v12';
    const PURCHASED_INGREDIENTS_KEY = 'auto_cook_purchased_ingredients_v12';
    const SCRIPT_ACTIVE_KEY = 'autoCook_scriptActive_v12';
    const THEME_KEY = "autoCook_theme_v12";
    const MINIMIZED_KEY = "autoCook_minimized_v12";
    const LOG_ENTRIES_KEY = 'autoCook_logEntries_v12';
    const FAILED_RECIPES_KEY = 'autoCook_failedRecipes_v12';
    const MAX_LOG_ENTRIES = 100;

    const states = {
        IDLE: 'Inativo',
        PROCESSING_QUEUE: 'Processando fila',
        FIND_MISSING_ITEM: 'Procurando item faltante',
        CHECK_INVENTORY: 'Verificando inventário',
        DROPPING_ITEMS: 'Largando itens',
        NAVIGATE_SHOP: 'Navegando na loja',
        RETURN_TO_RECIPE: 'Retornando para receita'
    };

    // --- Variáveis Globais de UI ---
    let logEntries = JSON.parse(GM_getValue(LOG_ENTRIES_KEY, '[]'));
    let failedRecipes = JSON.parse(GM_getValue(FAILED_RECIPES_KEY, '[]'));
    let currentTheme = GM_getValue(THEME_KEY, 'dark');
    let isMinimized = GM_getValue(MINIMIZED_KEY, false);
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;


    // --- Sistema de Log e Falhas ---
    async function addLogEntry(message) { const timestamp = new Date().toLocaleTimeString('pt-BR'); const entry = `[${timestamp}] ${message}`; logEntries.unshift(entry); if (logEntries.length > MAX_LOG_ENTRIES) logEntries.length = MAX_LOG_ENTRIES; await GM_setValue(LOG_ENTRIES_KEY, JSON.stringify(logEntries)); updateLogDisplay(); console.log(`[Cozinheiro] ${message}`); }
    async function addFailedRecipe(recipeName, reason) { if (!failedRecipes.some(r => r.recipe === recipeName && r.reason === reason)) { failedRecipes.unshift({ recipe: recipeName, reason: reason }); await GM_setValue(FAILED_RECIPES_KEY, JSON.stringify(failedRecipes)); updateFailedDisplay(); await addLogEntry(`FALHA: '${recipeName}' (${reason})`); } }

    // --- Funções Auxiliares ---
    function getState() { return GM_getValue(STATE_KEY, states.IDLE); }
    async function setState(newState) { await GM_setValue(STATE_KEY, newState); await addLogEntry(`Novo estado: ${newState}`); }
    async function stopAutomation() { await setState(states.IDLE); await GM_setValue(RECIPE_QUEUE_KEY, []); await addLogEntry('Automação parada.'); }
    function getInventoryPercentage() { const progressBar = document.querySelector('.progressBar'); if (progressBar && progressBar.title) { return parseInt(progressBar.title, 10) || 0; } return 0; }

    // ========================================================================================================================
    // LÓGICA PRINCIPAL DO COZINHEIRO
    // ========================================================================================================================

    async function handleShoppingPage() {
        const itemName = GM_getValue(MISSING_ITEM_NAME_KEY, '');
        const itemSubtype = GM_getValue(MISSING_ITEM_SUBTYPE_KEY, '');
        const itemType = GM_getValue(MISSING_ITEM_TYPE_KEY, '');
        const currentRecipeName = GM_getValue(CURRENT_RECIPE_NAME_KEY, 'Receita desconhecida');

        // Lógica de Ingrediente com subtipo
        if (itemType === 'ingredient') {
            if (itemSubtype) {
                const refineDropdown = document.querySelector('#ctl00_cphLeftColumn_ctl00_ddlShopItemRecipeTypes, #ctl00_cphLeftColumn_ctl00_ddlShopItemColors');

                if (refineDropdown) {
                    const subtypeOption = Array.from(refineDropdown.options).find(opt => opt.text.trim().toLowerCase() === itemSubtype.toLowerCase());
                    if (subtypeOption && refineDropdown.value !== subtypeOption.value) {
                        await addLogEntry(`Refinando busca para o subtipo '${itemSubtype}'...`);
                        refineDropdown.value = subtypeOption.value;
                        setTimeout(() => document.forms[0].submit(), 1500);
                        return;
                    }
                    if (!subtypeOption) {
                        await addFailedRecipe(currentRecipeName, `${itemName} (${itemSubtype}) (subtipo não encontrado na loja)`);
                        await processNextRecipeInQueue();
                        return;
                    }
                }
            }
            const buyButton = document.querySelector('input[type="submit"][value="Comprar"]:not([disabled])');
            if (buyButton) {
                await addLogEntry(`Comprando ingrediente '${itemName}${itemSubtype ? ` (${itemSubtype})` : ''}'...`);
                let purchased = GM_getValue(PURCHASED_INGREDIENTS_KEY, []);
                purchased.push({ name: itemName, subtype: itemSubtype });
                await GM_setValue(PURCHASED_INGREDIENTS_KEY, purchased);
                await setState(states.RETURN_TO_RECIPE);
                buyButton.click();
            } else {
                await addFailedRecipe(currentRecipeName, `${itemName}${itemSubtype ? ` (${itemSubtype})` : ''} (sem estoque)`);
                await processNextRecipeInQueue();
            }
            return;
        }

        // Lógica de Ferramenta
        const categoryDropdown = document.querySelector('#ctl00_cphLeftColumn_ctl00_ddlShopItemCategories');
        const typeDropdown = document.querySelector('#ctl00_cphLeftColumn_ctl00_ddlShopItemTypes');
        if (categoryDropdown.value !== '51') {
            addLogEntry(`ETAPA 1: Selecionando Categoria 'Ferramentas'.`);
            categoryDropdown.value = '51';
            setTimeout(() => document.forms[0].submit(), 1500);
            return;
        }
        if (!typeDropdown || typeDropdown.options.length <= 1) {
            addLogEntry("Aguardando o dropdown de tipo...");
            setTimeout(() => window.location.reload(), 3000);
            return;
        }
        const toolOption = Array.from(typeDropdown.options).find(opt => opt.text.trim().toLowerCase() === itemName.toLowerCase());
        if (!toolOption) { await addFailedRecipe(currentRecipeName, `${itemName} (não encontrado)`); await processNextRecipeInQueue(); return; }
        if (typeDropdown.value !== toolOption.value) {
            addLogEntry(`ETAPA 2: Selecionando Ferramenta '${itemName}'.`);
            typeDropdown.value = toolOption.value;
            setTimeout(() => document.forms[0].submit(), 1500);
            return;
        }
        const buyButton = document.querySelector('input[type="submit"][value="Comprar"]:not([disabled])');
        if (buyButton) {
            addLogEntry(`ETAPA 3: Comprando '${itemName}'...`);
            await setState(states.RETURN_TO_RECIPE);
            buyButton.click();
        } else {
            await addFailedRecipe(currentRecipeName, `${itemName} (sem estoque)`);
            await processNextRecipeInQueue();
        }
    }

    async function processNextRecipeInQueue() {
        const queue = GM_getValue(RECIPE_QUEUE_KEY, []);
        if (queue.length > 0) {
            const nextRecipe = queue.shift();
            await GM_setValue(RECIPE_QUEUE_KEY, queue);
            await GM_setValue(CURRENT_RECIPE_URL_KEY, nextRecipe.url);
            await GM_setValue(CURRENT_RECIPE_NAME_KEY, nextRecipe.name);
            await setState(states.FIND_MISSING_ITEM);
            window.location.href = nextRecipe.url;
        } else {
            alert('Fila de receitas concluída!');
            await stopAutomation();
        }
    }

    async function handleRecipeDetailPage() {
        const currentRecipeName = GM_getValue(CURRENT_RECIPE_NAME_KEY, 'Receita desconhecida');
        const missingItemSpan = document.querySelector('span.error');

        if (!missingItemSpan) {
             const useButton = document.querySelector('#ctl00_cphLeftColumn_ctl00_btnUseRecipe');
             if (useButton && !useButton.disabled) {
                 await addLogEntry(`Cozinhando '${currentRecipeName}'...`);
                 await setState(states.PROCESSING_QUEUE);
                 useButton.click();
             } else {
                 await addFailedRecipe(currentRecipeName, "Em cooldown / Sem energia");
                 await processNextRecipeInQueue();
             }
             return;
        }

        const parentBox = missingItemSpan.closest('.box');
        const isTool = parentBox && parentBox.querySelector('h2')?.textContent.includes('Informações');
        let itemName = '', itemSubtype = '', itemType = '', shoppingUrl = '';

        if (isTool) {
            itemType = 'tool';
            itemName = missingItemSpan.textContent.trim();
            shoppingUrl = `/World/Popmundo.aspx/Character/ShoppingAssistant`;
        } else {
            itemType = 'ingredient';
            const itemCell = missingItemSpan.closest('tr').querySelector('td:first-child');
            const itemLink = itemCell.querySelector('a');
            if (!itemLink) { await addFailedRecipe(currentRecipeName, `${itemCell.textContent.trim()} (sem link)`); await processNextRecipeInQueue(); return; }
            const fullText = itemCell.textContent.trim();
            itemName = itemLink.textContent.trim();
            const subtypeMatch = fullText.match(/\((.*?)\)/);
            itemSubtype = subtypeMatch ? subtypeMatch[1].trim() : '';
            shoppingUrl = itemLink.href;
            if (itemSubtype) await addLogEntry(`Falta: ${itemName} (${itemSubtype})`);
        }

        await GM_setValue(MISSING_ITEM_TYPE_KEY, itemType);
        await GM_setValue(MISSING_ITEM_NAME_KEY, itemName);
        await GM_setValue(MISSING_ITEM_SUBTYPE_KEY, itemSubtype);
        await GM_setValue(SHOPPING_URL_KEY, shoppingUrl);
        await setState(states.CHECK_INVENTORY);
        window.location.href = `/World/Popmundo.aspx/Character/Items`;
    }

    async function handleInventoryPage() {
        const currentState = getState();
        const inventoryPercentage = getInventoryPercentage();
        await addLogEntry(`No inventário (${inventoryPercentage}%). Estado: ${currentState}`);

        if (currentState === states.CHECK_INVENTORY) {
            if (inventoryPercentage < INVENTORY_THRESHOLD) {
                await addLogEntry('Espaço suficiente. Indo para a loja...');
                await setState(states.NAVIGATE_SHOP);
                window.location.href = GM_getValue(SHOPPING_URL_KEY, '');
            } else {
                await addLogEntry('Inventário cheio. Tentando largar itens...');
                await setState(states.DROPPING_ITEMS);
                window.location.reload();
            }
        } else if (currentState === states.DROPPING_ITEMS) {
            const purchased = GM_getValue(PURCHASED_INGREDIENTS_KEY, []);
            if (purchased.length === 0) {
                await addFailedRecipe(GM_getValue(CURRENT_RECIPE_NAME_KEY), 'Inventário cheio (sem itens descartáveis)');
                await stopAutomation();
                return;
            }

            let itemsToDropFound = false;
            document.querySelectorAll('#checkedlist tbody tr:not(.group)').forEach(row => {
                const link = row.querySelector('a'); const checkbox = row.querySelector('input[type="checkbox"]');
                if (!link || !checkbox) return;
                const itemName = link.textContent.trim();
                const subtypeMatch = link.parentElement.textContent.trim().match(/\((.*)\)/);
                const itemSubtype = subtypeMatch ? subtypeMatch[1].trim() : '';
                if (purchased.some(p => p.name.toLowerCase() === itemName.toLowerCase() && p.subtype.toLowerCase() === itemSubtype.toLowerCase())) {
                    checkbox.checked = true;
                    itemsToDropFound = true;
                    addLogEntry(`Selecionado para descarte: ${itemName} ${itemSubtype}`);
                }
            });

            if (itemsToDropFound) {
                await addLogEntry('Largando itens selecionados para liberar espaço...');
                await GM_setValue(PURCHASED_INGREDIENTS_KEY, []);
                document.querySelector('#ctl00_cphLeftColumn_ctl00_btnDropSelectedItems')?.click();
            } else {
                await addLogEntry('Nenhum item descartável encontrado. Continuando para a loja (pode falhar)...');
                await setState(states.NAVIGATE_SHOP);
                window.location.href = GM_getValue(SHOPPING_URL_KEY, '');
            }
        }
    }

    // --- ROTEADOR PRINCIPAL ---
    async function run() {
        setTimeout(async () => {
            if (!GM_getValue(SCRIPT_ACTIVE_KEY, false)) return;

            const currentState = getState();
            const path = window.location.pathname;
            await addLogEntry(`Página: ${path.split('/').pop()}, Estado: ${currentState}`);

            if (path.includes('/Character/ShoppingAssistant')) {
                if (currentState === states.RETURN_TO_RECIPE) {
                    await addLogEntry("Compra concluída. Retornando para a receita...");
                    await setState(states.FIND_MISSING_ITEM);
                    window.location.href = GM_getValue(CURRENT_RECIPE_URL_KEY);
                } else if (currentState === states.NAVIGATE_SHOP) {
                    handleShoppingPage();
                }
            } else if (path.includes('/Character/Recipe/')) {
                if (currentState === states.FIND_MISSING_ITEM) {
                     handleRecipeDetailPage();
                } else if (currentState === states.PROCESSING_QUEUE) {
                    await addLogEntry("Receita preparada! Voltando para a lista...");
                    const recipesListUrl = GM_getValue(RECIPES_LIST_URL_KEY, null);
                    if (recipesListUrl) { window.location.href = recipesListUrl; }
                    else { await addLogEntry("ERRO: URL da lista não encontrada."); await stopAutomation(); }
                }
            } else if (path.includes('/Character/Recipes')) {
                if (currentState === states.PROCESSING_QUEUE) {
                    processNextRecipeInQueue();
                }
            } else if (path.includes('/Character/Items') || path.includes('/Character/Inventory')) {
                if (currentState === states.CHECK_INVENTORY || currentState === states.DROPPING_ITEMS) {
                    handleInventoryPage();
                } else if (currentState === states.DROPPING_ITEMS) {
                    await setState(states.CHECK_INVENTORY);
                    window.location.reload();
                }
            }
        }, 1000); // Atraso global de 1 segundo
    }

    // ========================================================================================================================
    // UI - PAINEL DE CONTROLE
    // ========================================================================================================================

    function injectFonts() { const fontAwesome = document.createElement('link'); fontAwesome.rel = 'stylesheet'; fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'; document.head.appendChild(fontAwesome); }
    function updateLogDisplay() { const logList = document.getElementById('ac-log-list'); if (!logList) return; logList.innerHTML = logEntries.map(entry => `<li>${entry}</li>`).join(''); }
    function updateFailedDisplay() { const failedList = document.getElementById('ac-failed-list'); if (!failedList) return; if (failedRecipes.length === 0) { failedList.innerHTML = '<li>Nenhuma falha registrada.</li>'; } else { failedList.innerHTML = failedRecipes.map(fail => `<li><strong>${fail.recipe}:</strong> <span class="fail-reason">${fail.reason}</span></li>`).join(''); } }
    function createPanel() { if (document.getElementById('ac-control-panel')) return; injectFonts(); const panel = document.createElement('div'); panel.id = 'ac-control-panel'; panel.className = currentTheme; if (isMinimized) panel.classList.add('minimized'); panel.innerHTML = ` <div class="ac-panel-header"> <h4><i class="fa-solid fa-utensils"></i> Cozinheiro Chef</h4> <div class="ac-header-controls"> <button id="acThemeToggle" title="Alternar Tema"><i class="fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button> <button id="acMinimizeToggle" title="${isMinimized ? 'Maximizar' : 'Minimizar'}"><i class="fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}"></i></button> </div> </div> <div class="ac-panel-content"> <label class="ac-toggle-label" for="ac-activate-checkbox"> <input type="checkbox" id="ac-activate-checkbox" ${GM_getValue(SCRIPT_ACTIVE_KEY, false) ? 'checked' : ''}> <span class="ac-toggle-switch"></span> <span class="ac-toggle-text">${GM_getValue(SCRIPT_ACTIVE_KEY, false) ? 'Automação Ativa' : 'Automação Inativa'}</span> </label> <div class="ac-section-header"> <div><i class="fa-solid fa-scroll"></i> Log de Atividades</div> <button id="ac-clear-log-btn" class="ac-clear-button" title="Limpar Log"><i class="fa-solid fa-broom"></i> Limpar</button> </div> <ul id="ac-log-list"></ul> <div class="ac-section-header"> <div><i class="fa-solid fa-triangle-exclamation"></i> Receitas que Falharam</div> <button id="ac-clear-failed-btn" class="ac-clear-button" title="Limpar Falhas"><i class="fa-solid fa-broom"></i> Limpar</button> </div> <ul id="ac-failed-list"></ul> </div>`; document.body.appendChild(panel); updateLogDisplay(); updateFailedDisplay(); setupPanelListeners(); }
    function setupPanelListeners() { const panel = document.getElementById('ac-control-panel'); const header = panel.querySelector('.ac-panel-header'); header.addEventListener('mousedown', (e) => { if (e.target.closest('button')) return; isDragging = true; dragOffsetX = e.clientX - panel.offsetLeft; dragOffsetY = e.clientY - panel.offsetTop; }); document.addEventListener('mousemove', (e) => { if (isDragging) { panel.style.left = `${e.clientX - dragOffsetX}px`; panel.style.top = `${e.clientY - dragOffsetY}px`; } }); document.addEventListener('mouseup', () => { isDragging = false; }); document.getElementById('ac-activate-checkbox').addEventListener('change', async (e) => { const isActive = e.target.checked; document.querySelector('.ac-toggle-text').textContent = isActive ? 'Automação Ativa' : 'Automação Inativa'; await GM_setValue(SCRIPT_ACTIVE_KEY, isActive); if (isActive) { if (window.location.pathname.includes('/Character/Recipes')) { const checkedBoxes = document.querySelectorAll('.auto-cook-recipe-checkbox:checked'); if (checkedBoxes.length === 0) { alert('Selecione ao menos uma receita!'); e.target.checked = false; document.querySelector('.ac-toggle-text').textContent = 'Automação Inativa'; await GM_setValue(SCRIPT_ACTIVE_KEY, false); return; } const recipeQueue = Array.from(checkedBoxes).map(cb => ({ url: cb.closest('tr').querySelector('a').href, name: cb.closest('tr').querySelector('a').textContent.trim() })); await GM_setValue(RECIPE_QUEUE_KEY, recipeQueue); await GM_setValue(RECIPES_LIST_URL_KEY, window.location.href); await setState(states.PROCESSING_QUEUE); run(); } else { alert('A automação só pode ser iniciada na página de "Receitas".'); e.target.checked = false; document.querySelector('.ac-toggle-text').textContent = 'Automação Inativa'; await GM_setValue(SCRIPT_ACTIVE_KEY, false); } } else { await stopAutomation(); } }); document.getElementById('acThemeToggle').addEventListener('click', (e) => { currentTheme = currentTheme === 'dark' ? 'light' : 'dark'; panel.className = currentTheme; if(isMinimized) panel.classList.add('minimized'); GM_setValue(THEME_KEY, currentTheme); e.currentTarget.querySelector('i').className = `fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`; }); document.getElementById('acMinimizeToggle').addEventListener('click', (e) => { isMinimized = !isMinimized; panel.classList.toggle('minimized', isMinimized); GM_setValue(MINIMIZED_KEY, isMinimized); e.currentTarget.querySelector('i').className = `fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}`; }); document.getElementById('ac-clear-log-btn').addEventListener('click', async () => { if (confirm("Limpar o log?")) { logEntries = []; await GM_setValue(LOG_ENTRIES_KEY, '[]'); updateLogDisplay(); } }); document.getElementById('ac-clear-failed-btn').addEventListener('click', async () => { if (confirm("Limpar a lista de falhas?")) { failedRecipes = []; await GM_setValue(FAILED_RECIPES_KEY, '[]'); updateFailedDisplay(); } }); }
    function initializeUI() { if (document.querySelector('#tblrecipes')) { const headerRow = document.querySelector('#tblrecipes thead tr'); if (headerRow && !headerRow.querySelector('.auto-cook-header')) { const th = document.createElement('th'); th.className = 'auto-cook-header'; th.title = "Selecionar Todos"; th.style.textAlign = 'center'; const selectAllCheckbox = document.createElement('input'); selectAllCheckbox.type = 'checkbox'; selectAllCheckbox.id = 'ac-select-all'; selectAllCheckbox.addEventListener('change', (e) => { document.querySelectorAll('.auto-cook-recipe-checkbox').forEach(cb => cb.checked = e.target.checked); }); th.appendChild(selectAllCheckbox); headerRow.insertBefore(th, headerRow.firstChild); document.querySelectorAll('#tblrecipes tbody tr').forEach(row => { const cell = document.createElement('td'); cell.style.textAlign = 'center'; const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'auto-cook-recipe-checkbox'; cell.appendChild(checkbox); row.insertBefore(cell, row.firstChild); }); } } createPanel(); }
    GM_addStyle(`:root { --ac-font-family: 'Segoe UI', sans-serif; --ac-shadow-color: rgba(0, 0, 0, 0.2); --ac-accent-color: #0d6efd; --ac-fail-color: #dc3545; } #ac-control-panel.light { --ac-bg: #f8f9fa; --ac-text: #212529; --ac-text-sec: #6c757d; --ac-border: #dee2e6; --ac-header-bg: #e9ecef; --ac-list-bg: #fff; } #ac-control-panel.dark { --ac-bg: #212529; --ac-text: #dee2e6; --ac-text-sec: #adb5bd; --ac-border: #495057; --ac-header-bg: #343a40; --ac-list-bg: #2b3035; } #ac-control-panel { position: fixed; top: 20px; right: 20px; width: 400px; background: var(--ac-bg); border: 1px solid var(--ac-border); border-radius: 8px; box-shadow: 0 4px 12px var(--ac-shadow-color); font-family: var(--ac-font-family); font-size: 14px; color: var(--ac-text); z-index: 99999; overflow: hidden; } #ac-control-panel.minimized { height: auto !important; } #ac-control-panel.minimized .ac-panel-content { display: none; } .ac-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--ac-header-bg); cursor: move; border-bottom: 1px solid var(--ac-border); } .ac-panel-header h4 { margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; } .ac-header-controls button { background: none; border: none; color: var(--ac-text-sec); cursor: pointer; font-size: 14px; padding: 4px; } .ac-header-controls button:hover { color: var(--ac-accent-color); } .ac-panel-content { padding: 12px; display: flex; flex-direction: column; gap: 12px; } .ac-toggle-label { display: flex; align-items: center; cursor: pointer; user-select: none; background: var(--ac-header-bg); padding: 8px; border-radius: 5px; } .ac-toggle-label input { display: none; } .ac-toggle-switch { position: relative; width: 40px; height: 20px; background: #555; border-radius: 10px; margin-right: 10px; transition: background 0.2s; } .ac-toggle-switch::before { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: white; top: 3px; left: 3px; transition: transform 0.2s; } .ac-toggle-label input:checked + .ac-toggle-switch { background: #28a745; } .ac-toggle-label input:checked + .ac-toggle-switch::before { transform: translateX(20px); } .ac-toggle-text { font-weight: 500; } .ac-section-header { display: flex; justify-content: space-between; align-items: center; color: var(--ac-text-sec); font-size: 12px; text-transform: uppercase; font-weight: 600; margin-top: 8px; } .ac-section-header div { display: flex; align-items: center; gap: 6px; } .ac-clear-button { background: none; border: none; color: var(--ac-text-sec); cursor: pointer; font-size: 12px; } .ac-clear-button:hover { color: var(--ac-fail-color); } #ac-log-list, #ac-failed-list { font-size: 12px; max-height: 150px; overflow-y: auto; padding: 8px; background: var(--ac-list-bg); border: 1px solid var(--ac-border); border-radius: 5px; list-style: none; margin: 0 !important; color: var(--ac-text-sec); } #ac-log-list li, #ac-failed-list li { padding: 2px 0; border-bottom: 1px dashed var(--ac-border); } #ac-log-list li:last-child, #ac-failed-list li:last-child { border-bottom: none; } #ac-failed-list .fail-reason { color: var(--ac-fail-color); font-style: italic; } #ac-log-list::-webkit-scrollbar, #ac-failed-list::-webkit-scrollbar { width: 6px; } #ac-log-list::-webkit-scrollbar-thumb, #ac-failed-list::-webkit-scrollbar-thumb { background: var(--ac-border); border-radius: 3px; }`);

    // --- PONTO DE ENTRADA ---
    window.addEventListener('load', () => {
        initializeUI();
        run();
    });

})();
