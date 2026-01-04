// ==UserScript==
// @name         MusixMatch - Calculadora de Instrumentais
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Calcula automaticamente a duração das tags instrumentais
// @author       Nero Legendary
// @match        https://curators.musixmatch.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553704/MusixMatch%20-%20Calculadora%20de%20Instrumentais.user.js
// @updateURL https://update.greasyfork.org/scripts/553704/MusixMatch%20-%20Calculadora%20de%20Instrumentais.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observadorAtivo = false;
    let timeoutCalculo;

    console.log('🎵 MusixMatch Calculator FINAL - INICIADO');

    // Funções de conversão
    function timestampParaSegundos(timestamp) {
        if (!timestamp) return 0;
        const partes = timestamp.split(/[:.]/);
        if (partes.length >= 2) {
            const minutos = parseInt(partes[0]) || 0;
            const segundos = parseInt(partes[1]) || 0;
            const milesimos = parseInt(partes[2]) || 0;
            return minutos * 60 + segundos + milesimos / 1000;
        }
        return 0;
    }

    function segundosParaTimestamp(segundos) {
        const min = Math.floor(segundos / 60);
        const seg = Math.floor(segundos % 60);
        const cs = Math.floor((segundos % 1) * 100);
        return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
    }

    // **FUNÇÃO OTIMIZADA: Encontrar linhas do editor**
    function encontrarLinhasEditor() {
        // Seletor EXATO das linhas do editor baseado no debug
        const seletorLinhas = '.css-g5y9jx.r-1xfd6ze.r-1awozwy.r-13awgt0.r-18u37iz.r-1h0z5md.r-1eey0nk.r-1559e4e.r-3pj75a';
        const linhas = document.querySelectorAll(seletorLinhas);

        console.log(`📝 Encontradas ${linhas.length} linhas do editor`);
        return Array.from(linhas);
    }

    // **FUNÇÃO OTIMIZADA: Encontrar timestamp na linha**
    function encontrarTimestamp(linha) {
        // Procura por elementos de timestamp dentro da linha
        const timestampElement = linha.querySelector('.css-146c3p1.r-fdjqy7.r-a023e6.r-rjixqe');
        if (timestampElement) {
            return timestampElement.textContent.trim();
        }

        // Fallback: procura por padrão mm:ss no texto
        const texto = linha.textContent || '';
        const timestampMatch = texto.match(/(\d+:\d+\.\d+)/);
        return timestampMatch ? timestampMatch[0] : null;
    }

    // **FUNÇÃO OTIMIZADA: Verificar se é instrumental**
    function isInstrumental(linha) {
        // Verifica se tem a tag "Instrumental" específica
        const tagInstrumental = linha.querySelector('.css-146c3p1.r-fdjqy7.r-a023e6.r-1kfrs79.r-1cwl3u0');
        if (tagInstrumental && tagInstrumental.textContent.trim() === 'Instrumental') {
            return true;
        }

        // Fallback: verifica no texto
        const texto = linha.textContent || '';
        return texto.toLowerCase().includes('instrumental');
    }

    // **FUNÇÃO PRINCIPAL OTIMIZADA**
    function calcularInstrumentais() {
        clearTimeout(timeoutCalculo);

        try {
            const linhas = encontrarLinhasEditor();

            if (linhas.length === 0) {
                console.log('⏳ Aguardando linhas do editor...');
                return;
            }

            let instrumentaisEncontrados = 0;
            let instrumentaisProcessados = 0;

            linhas.forEach((linha, index) => {
                if (isInstrumental(linha)) {
                    instrumentaisEncontrados++;

                    // Remove cálculo anterior
                    const calculoAnterior = linha.querySelector('.mxm-instrumental-calc');
                    if (calculoAnterior) calculoAnterior.remove();

                    // Encontra timestamp atual
                    const timestampAtual = encontrarTimestamp(linha);
                    if (!timestampAtual) {
                        console.log('❌ Não encontrou timestamp para instrumental:', linha.textContent);
                        return;
                    }

                    const tempoAtualSegundos = timestampParaSegundos(timestampAtual);

                    // Encontra próxima linha não-instrumental
                    let tempoProximaSegundos = null;
                    let proximaIndex = -1;

                    for (let i = index + 1; i < linhas.length; i++) {
                        if (!isInstrumental(linhas[i])) {
                            const timestampProximo = encontrarTimestamp(linhas[i]);
                            if (timestampProximo) {
                                tempoProximaSegundos = timestampParaSegundos(timestampProximo);
                                proximaIndex = i;
                                break;
                            }
                        }
                    }

                    // Se não encontrou próxima linha, usa o final da música
                    if (!tempoProximaSegundos) {
                        // Tenta encontrar duração total
                        const duracaoTotalElements = document.querySelectorAll('[class*="duration"], [class*="time"]');
                        for (let el of duracaoTotalElements) {
                            const texto = el.textContent || '';
                            const match = texto.match(/(\d+):(\d+)/);
                            if (match) {
                                tempoProximaSegundos = parseInt(match[1]) * 60 + parseInt(match[2]);
                                break;
                            }
                        }
                    }

                    // Calcula e exibe
                    if (tempoProximaSegundos && tempoProximaSegundos > tempoAtualSegundos) {
                        const duracaoSegundos = tempoProximaSegundos - tempoAtualSegundos;

                        instrumentaisProcessados++;

                        const calculoElement = document.createElement('div');
                        calculoElement.className = 'mxm-instrumental-calc';
                        calculoElement.style.cssText = `
                            position: absolute;
                            right: 15px;
                            top: 50%;
                            transform: translateY(-50%);
                            background: ${duracaoSegundos >= 15 ? '#4CAF50' : '#F44336'};
                            color: white;
                            padding: 4px 8px;
                            border-radius: 12px;
                            font-size: 11px;
                            font-weight: bold;
                            z-index: 1000;
                            white-space: nowrap;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                            font-family: 'Courier New', monospace;
                            cursor: help;
                            border: 1px solid ${duracaoSegundos >= 15 ? '#388E3C' : '#D32F2F'};
                        `;

                        calculoElement.textContent = segundosParaTimestamp(duracaoSegundos);
                        calculoElement.title = `Duração: ${duracaoSegundos.toFixed(2)}s | ${duracaoSegundos >= 15 ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`;

                        linha.style.position = 'relative';
                        linha.appendChild(calculoElement);

                        console.log(`🎵 Instrumental ${instrumentaisProcessados}: ${timestampAtual} → ${segundosParaTimestamp(duracaoSegundos)} (${duracaoSegundos.toFixed(2)}s)`);
                    }
                }
            });

            if (instrumentaisEncontrados > 0) {
                console.log(`✅ ${instrumentaisProcessados}/${instrumentaisEncontrados} instrumentais processados com sucesso`);
            } else {
                console.log('🔍 Nenhum instrumental encontrado');
            }

        } catch (error) {
            console.error('❌ Erro no cálculo:', error);
        }
    }

    // **OBSERVADOR OTIMIZADO**
    function iniciarObservador() {
        if (observadorAtivo) return;

        const observer = new MutationObserver(function(mutations) {
            let deveRecalcular = false;

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    // Verifica se foram adicionadas linhas do editor
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.matches &&
                            node.matches('.css-g5y9jx.r-1xfd6ze.r-1awozwy.r-13awgt0.r-18u37iz.r-1h0z5md.r-1eey0nk.r-1559e4e.r-3pj75a')) {
                            deveRecalcular = true;
                            break;
                        }
                    }
                }

                // Se texto mudou
                if (mutation.type === 'characterData') {
                    const parent = mutation.target.parentElement;
                    if (parent && parent.closest('.css-g5y9jx.r-1xfd6ze.r-1awozwy.r-13awgt0.r-18u37iz.r-1h0z5md.r-1eey0nk.r-1559e4e.r-3pj75a')) {
                        deveRecalcular = true;
                    }
                }
            }

            if (deveRecalcular) {
                clearTimeout(timeoutCalculo);
                timeoutCalculo = setTimeout(calcularInstrumentais, 300);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        observadorAtivo = true;
        console.log('👀 Observador ativado');
    }

    // **INICIALIZAÇÃO ROBUSTA**
    function inicializar() {
        console.log('🚀 Iniciando calculadora FINAL...');

        // Tentativa inicial após 2 segundos
        setTimeout(() => {
            calcularInstrumentais();
            iniciarObservador();
        }, 2000);

        // Backup após 5 segundos
        setTimeout(calcularInstrumentais, 5000);

        // Verificação periódica
        setInterval(calcularInstrumentais, 10000);
    }

    // **DETECTOR DE MUDANÇA DE PÁGINA**
    let urlAnterior = window.location.href;
    setInterval(() => {
        if (window.location.href !== urlAnterior) {
            urlAnterior = window.location.href;
            console.log('🔄 Página mudou - reiniciando calculadora...');
            setTimeout(() => {
                observadorAtivo = false;
                inicializar();
            }, 3000);
        }
    }, 1000);

    // **INICIAR QUANDO PÁGINA ESTIVER PRONTA**
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

    // **BACKUP FINAL**
    window.addEventListener('load', () => {
        setTimeout(inicializar, 1000);
    });

})();