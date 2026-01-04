// ==UserScript==
// @name         Exclusão Automática
// @namespace    https://github.com/0H4S
// @version      1.0
// @description  Excluí automaticamente os registros na tela de Leis e Atos, lidando com erros comuns e gerando um relatório detalhado das ações realizadas.
// @author       OHAS
// @license      Copyright (c) 2025 OHAS - Todos os direitos reservados.
// @homepageURL  http://github.com/0H4S
// @icon         https://cdn-icons-png.flaticon.com/512/4041/4041994.png
// @match        https://piraidosul.oxy.elotech.com.br/unico/*/leis-atos
// @match        https://piraidosul.oxy.elotech.com.br/unico/*/leis-atos?filter=*
// @match        https://piraidosul.oxy.elotech.com.br/unico/*/leis-atos/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/548838/Exclus%C3%A3o%20Autom%C3%A1tica.user.js
// @updateURL https://update.greasyfork.org/scripts/548838/Exclus%C3%A3o%20Autom%C3%A1tica.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isAutomationRunning = false;
    let ignoredItems = new Set();
    let logHistory = [];
    let isHistoryEnabled = GM_getValue('historyEnabled', true);
    function waitForElement(selector, parent = document, timeout = 0) {
        return new Promise(resolve => {
            let timeoutId = null;
            const interval = setInterval(() => {
                const element = parent.querySelector(selector);
                if (element) {
                    if (timeoutId) clearTimeout(timeoutId);
                    clearInterval(interval);
                    resolve(element);
                }
            }, 30);
            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    clearInterval(interval);
                    resolve(null);
                }, timeout);
            }
        });
    }
    function waitForElementToBeRemoved(element) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (!document.body.contains(element)) {
                    clearInterval(interval);
                    resolve();
                }
            }, 30);
        });
    }
    function getRowUniqueKey(row) {
        const numeroAnoEl = row.querySelector('td:nth-child(1)');
        const naturezaEl = row.querySelector('td:nth-child(4)');
        if (!numeroAnoEl || !naturezaEl) return `Linha ID ${row.id || 'desconhecido'}`;
        const numAno = numeroAnoEl.innerText.replace(/\s+/g, ' ').trim();
        const natureza = naturezaEl.innerText.replace(/\s+/g, ' ').trim();
        return `${numAno} | Natureza: "${natureza || 'Vazia'}"`;
    }
    async function handleDeletionError(targetRow, errorOkButton) {
        try {
            errorOkButton.click();
            await waitForElementToBeRemoved(errorOkButton);
            const mouseoverEvent = new MouseEvent('mouseover', { view: unsafeWindow, bubbles: true, cancelable: true });
            targetRow.dispatchEvent(mouseoverEvent);
            const editButton = await waitForElement('button[id^="idedit_"]', targetRow);
            editButton.click();
            const veiculoRemoveBtn = await waitForElement('adicionar-veiculo-publicacao button[id="_1"] i.fa-trash');
            veiculoRemoveBtn.closest('button').click();
            let confirmOk = await waitForElement('#btOk.btn.inline.positive');
            confirmOk.click();
            await waitForElementToBeRemoved(confirmOk);
            const arquivoRemoveBtn = await waitForElement('lei-ato-arquivo-form button[id^="delete_"]');
            arquivoRemoveBtn.click();
            confirmOk = await waitForElement('#btOk.btn.inline.positive');
            confirmOk.click();
            await waitForElementToBeRemoved(confirmOk);
            const saveButton = await waitForElement('button#save');
            saveButton.click();
            confirmOk = await waitForElement('#btOk.btn.inline.positive');
            confirmOk.click();
            await waitForElement('tr.reduced');
        } catch (err) {
            alert("Falha no procedimento de tratamento de erro. A automação será interrompida.");
            throw err;
        }
    }
    async function runDeletionLoop() {
        while (isAutomationRunning) {
            const allRows = document.querySelectorAll('tr.reduced');
            let targetRow = null;
            for (const row of allRows) {
                const uniqueKey = getRowUniqueKey(row);
                if (!ignoredItems.has(uniqueKey)) {
                    targetRow = row;
                    break;
                }
            }
            if (!targetRow) {
                stopAutomation(true);
                return;
            }
            const itemIdentifier = getRowUniqueKey(targetRow);
            try {
                const mouseoverEvent = new MouseEvent('mouseover', { view: unsafeWindow, bubbles: true, cancelable: true });
                targetRow.dispatchEvent(mouseoverEvent);
                const removeButton = await waitForElement('button[id^="idremove_"]', targetRow);
                removeButton.click();
                const confirmButton = await waitForElement('#btOk.btn.inline.positive');
                confirmButton.click();
                const result = await Promise.race([
                    waitForElementToBeRemoved(targetRow).then(() => 'success'),
                    waitForElement('span#okButton.btn.negative.close-dialoguebox', document, 2500).then(btn => btn)
                ]);
                if (result === 'success') {
                    if (isHistoryEnabled) logHistory.push(`[SUCESSO] Item excluído: ${itemIdentifier}`);
                    continue;
                } else if (result) {
                    const errorOkButton = result;
                    const dependencyErrorMsg = document.querySelector('#exceptionMessageParagraph');
                    if (dependencyErrorMsg && dependencyErrorMsg.innerText.includes("Este registro não pode ser excluído")) {
                        if (isHistoryEnabled) logHistory.push(`[IGNORADO] Item com dependência: ${itemIdentifier}`);
                        ignoredItems.add(itemIdentifier);
                        errorOkButton.click();
                        await waitForElementToBeRemoved(errorOkButton);
                    } else {
                        await handleDeletionError(targetRow, errorOkButton);
                        if (isHistoryEnabled) logHistory.push(`[TRATADO] Item com erro corrigido: ${itemIdentifier}`);
                    }
                }
            } catch (error) {
                if (isHistoryEnabled) logHistory.push(`[ERRO FATAL] A automação parou devido a um erro inesperado ao processar o item: ${itemIdentifier}.`);
                stopAutomation();
                return;
            }
        }
    }
    function downloadLogFile() {
        if (logHistory.length === 0) {
            return;
        }
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        const fileName = `log-exclusao-${timestamp}.txt`;
        let fileContent = `Relatório de Exclusão Automática\n`;
        fileContent += `Gerado em: ${now.toLocaleString()}\n`;
        fileContent += `========================================\n\n`;
        fileContent += logHistory.join('\n');
        fileContent += `\n\n========================================\n`;
        fileContent += `Fim do relatório. Total de ${logHistory.length} ações registradas.`;
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function startAutomation() {
        if (isAutomationRunning) {
            alert("A automação já está em execução.");
            return;
        }
        ignoredItems.clear();
        logHistory = [];
        isAutomationRunning = true;
        if (confirm("Iniciar automação de exclusão?")) {
            runDeletionLoop();
        } else {
            isAutomationRunning = false;
        }
    }
    function stopAutomation(isFinished = false) {
        if (!isAutomationRunning) return;
        isAutomationRunning = false;
        if (isHistoryEnabled) {
            downloadLogFile();
        }
        let message = isFinished ? "Processo de exclusão concluído!" : "Automação de exclusão parada pelo usuário.";
        if (isHistoryEnabled && logHistory.length > 0) {
            message += " Um relatório (.txt) com todas as ações foi baixado.";
        }
        alert(message);
    }
    function toggleHistorySetting() {
        isHistoryEnabled = !isHistoryEnabled;
        GM_setValue('historyEnabled', isHistoryEnabled);
        alert(`O histórico de exclusão foi ${isHistoryEnabled ? 'HABILITADO' : 'DESABILITADO'}.\n\nA página será atualizada agora para aplicar a mudança.`);
        location.reload();
    }
    const historyCommandLabel = isHistoryEnabled ? '❌ Desabilitar Histórico' : '✅ Habilitar Histórico';
    GM_registerMenuCommand(historyCommandLabel, toggleHistorySetting);
    GM_registerMenuCommand("🟢 Iniciar", startAutomation);
    GM_registerMenuCommand("🔴 Parar", stopAutomation);
})();