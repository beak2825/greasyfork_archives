// ==UserScript==
// @name         Arkmeds - Force Sort (Interceptador V5)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Intercepta leituras e escritas no Storage para forçar a ordenação descendente de ordem de serviços.
// @author       Gemini AI
// @match        https://*.arkmeds.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556614/Arkmeds%20-%20Force%20Sort%20%28Interceptador%20V5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556614/Arkmeds%20-%20Force%20Sort%20%28Interceptador%20V5%29.meta.js
// ==/UserScript==

(function () {
    'use strict'

    // A chave exata que o DataTables usa
    const TARGET_KEY = "DataTables_datatable_/ordem_servico/"

    // A ordenação que queremos forçar: Coluna 11 (índice 11), Descendente
    const FORCE_ORDER = [[11, "desc"]]

    console.log("Arkmeds Script V5: Iniciando interceptação de Storage...")

    // Função auxiliar para corrigir o JSON
    function corrigirObjeto(jsonString) {
        try {
            if (!jsonString) return jsonString
            const obj = JSON.parse(jsonString)

            // Verifica se é o objeto certo (tem estrutura de DataTables)
            if (obj && (obj.time || obj.start)) {
                // Força a ordem
                obj.order = FORCE_ORDER
                // Atualiza o time para parecer recente
                obj.time = Date.now()
                return JSON.stringify(obj)
            }
        } catch (e) {
            // Se der erro no parse, retorna o original sem mexer
            return jsonString
        }
        return jsonString
    }

    // --- INTERCEPTAÇÃO (HOOK) ---

    // Guardamos as funções originais do navegador
    const originalSetItem = Storage.prototype.setItem
    const originalGetItem = Storage.prototype.getItem

    // Sobrescrevemos a função de LER dados (getItem)
    Storage.prototype.getItem = function (key) {
        // Chamamos a original para pegar o dado real
        let valor = originalGetItem.apply(this, arguments)

        // Se o site estiver pedindo a chave da tabela, nós entregamos o dado adulterado
        if (key === TARGET_KEY && valor) {
            // console.log("Arkmeds Script: O site tentou ler a configuração. Entregando versão corrigida (desc).");
            return corrigirObjeto(valor)
        }

        return valor
    }

    // Sobrescrevemos a função de SALVAR dados (setItem)
    Storage.prototype.setItem = function (key, value) {
        // Se o site tentar salvar a configuração da tabela
        if (key === TARGET_KEY) {
            // console.log("Arkmeds Script: O site tentou salvar 'asc'. Forçando 'desc' antes de gravar.");
            value = corrigirObjeto(value)
        }

        // Chama a original para salvar de fato
        originalSetItem.apply(this, [key, value])
    }

    // --- INJEÇÃO INICIAL (Garantia Extra) ---
    // Mesmo com os hooks, tentamos injetar um valor inicial caso esteja vazio
    try {
        const storageAlvo = sessionStorage // Tenta sessionStorage primeiro
        if (!storageAlvo.getItem(TARGET_KEY)) {
            // Template mínimo apenas para inicializar
            const templateInicial = {
                "time": Date.now(),
                "start": 0,
                "length": 25,
                "order": FORCE_ORDER,
                "search": { "search": "", "smart": true, "regex": false, "caseInsensitive": true },
                "columns": [] // O DataTables preenche o resto se estiver vazio
            }
            storageAlvo.setItem(TARGET_KEY, JSON.stringify(templateInicial))
            console.log("Arkmeds Script: Valor inicial injetado.")
        }
    } catch (e) {
        console.log("Erro na injeção inicial:", e)
    }

})()