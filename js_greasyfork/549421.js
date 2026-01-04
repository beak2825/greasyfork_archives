// ==UserScript==
// @name         Progresso - CADASTRO CLIENTE
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Contador de progresso leve e eficiente para verificar campos específicos
// @author       Adriel Alves
// @match        https://cenegedpa.gpm.srv.br/cadastro/geral/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549421/Progresso%20-%20CADASTRO%20CLIENTE.user.js
// @updateURL https://update.greasyfork.org/scripts/549421/Progresso%20-%20CADASTRO%20CLIENTE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aguardar DOM carregar
    if (document.readyState !== 'complete') {
        window.addEventListener('load', init);
    } else {
        setTimeout(init, 1000);
    }

    function init() {
        // Criar estilos CSS simples
        const style = document.createElement('style');
        style.textContent = `
            #progress-counter {
                position: fixed;
                top: 10px;
                right: 10px;
                background: white;
                padding: 15px;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
                min-width: 250px;
                font-family: Arial, sans-serif;
            }

            .progress-title {
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
            }

            .progress-bar-bg {
                background: #e0e0e0;
                height: 20px;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 10px;
            }

            .progress-bar-fill {
                height: 100%;
                background: #4CAF50;
                transition: width 0.3s;
                text-align: center;
                color: white;
                line-height: 20px;
                font-size: 12px;
            }

            .progress-item {
                margin: 5px 0;
                padding: 5px;
                border-radius: 4px;
                font-size: 13px;
            }

            .item-ok {
                background: #d4edda;
                color: #155724;
            }

            .item-error {
                background: #f8d7da;
                color: #721c24;
            }

            .item-warning {
                background: #fff3cd;
                color: #856404;
            }

            .highlight-field {
                background-color: yellow !important;
                border: 2px solid orange !important;
            }
        `;
        document.head.appendChild(style);

        // Criar contador
        const progressDiv = document.createElement('div');
        progressDiv.id = 'progress-counter';
        progressDiv.innerHTML = `
            <div class="progress-title">📊 Progresso: <span id="progress-text">0/4</span></div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" id="progress-bar">0%</div>
            </div>
            <div id="progress-items"></div>
        `;
        document.body.appendChild(progressDiv);

        // Definir verificações
        const checks = [
            {
                name: 'Nome Cliente',
                id: 'inputString',
                validate: function() {
                    const el = document.getElementById('inputString');
                    if (!el) return { valid: false, msg: '⚠️ Campo não encontrado' };
                    const val = el.value.trim();
                    if (!val || val.includes('ATUALIZAR NOME DO CLIENTE')) {
                        el.classList.add('highlight-field');
                        return { valid: false, msg: '❌ Precisa atualizar' };
                    }
                    el.classList.remove('highlight-field');
                    return { valid: true, msg: '✅ OK' };
                }
            },
            {
                name: 'Latitude',
                id: 'idlati',
                validate: function() {
                    const el = document.getElementById('idlati');
                    if (!el) return { valid: false, msg: '⚠️ Campo não encontrado' };
                    const val = el.value.trim();

                    if (!val) {
                        el.classList.add('highlight-field');
                        return { valid: false, msg: '❌ Vazio' };
                    }

                    // Validar formato de latitude para Maranhão (geralmente entre -1 e -10)
                    // Formato esperado: -X.XXXXX (negativo com decimais)
                    const latRegex = /^-([0-9]|10)\.\d{2,}$/;
                    const latNum = parseFloat(val);

                    if (!latRegex.test(val)) {
                        el.classList.add('highlight-field');
                        return { valid: false, msg: '❌ Formato incorreto (-X.XX...)' };
                    }

                    // Verificar se está na faixa do Maranhão
                    if (latNum < -10 || latNum > -1) {
                        el.classList.add('highlight-field');
                        return { valid: false, msg: '❌ Fora da região (-1 a -10)' };
                    }

                    el.classList.remove('highlight-field');
                    return { valid: true, msg: '✅ OK (' + val.substring(0, 8) + '...)' };
                }
            },
            {
                name: 'Longitude',
                id: 'idlong',
                validate: function() {
                    const el = document.getElementById('idlong');
                    if (!el) return { valid: false, msg: '⚠️ Campo não encontrado' };
                    const val = el.value.trim();

                    if (!val) {
                        el.classList.add('highlight-field');
                        return { valid: false, msg: '❌ Vazio' };
                    }

                    // Validar formato de longitude para Maranhão (geralmente entre -41 e -48)
                    // Formato esperado: -XX.XXXXX (negativo com dois dígitos e decimais)
                    const lonRegex = /^-\d{2}\.\d{2,}$/;
                    const lonNum = parseFloat(val);

                    if (!lonRegex.test(val)) {
                        el.classList.add('highlight-field');
                        return { valid: false, msg: '❌ Formato incorreto (-XX.XX...)' };
                    }

                    // Verificar se está na faixa do Maranhão
                    if (lonNum < -48 || lonNum > -41) {
                        el.classList.add('highlight-field');
                        return { valid: false, msg: '❌ Fora da região (-41 a -48)' };
                    }

                    el.classList.remove('highlight-field');
                    return { valid: true, msg: '✅ OK (' + val.substring(0, 9) + '...)' };
                }
            },
            {
                name: 'Contrato 241/2023',
                validate: function() {
                    try {
                        const td = Array.from(document.querySelectorAll('td')).find(
                            el => el.textContent.trim() === 'Contrato:'
                        );
                        if (!td || !td.parentElement) {
                            return { valid: false, msg: '⚠️ Campo não encontrado' };
                        }
                        const chosen = td.parentElement.querySelector('.chosen-single');
                        if (!chosen) {
                            return { valid: false, msg: '⚠️ Seletor não encontrado' };
                        }
                        if (chosen.textContent.includes('241/2023 MARANHAO')) {
                            chosen.classList.remove('highlight-field');
                            return { valid: true, msg: '✅ OK' };
                        }
                        chosen.classList.add('highlight-field');
                        return { valid: false, msg: '❌ Contrato incorreto' };
                    } catch (e) {
                        return { valid: false, msg: '⚠️ Erro ao verificar' };
                    }
                }
            }
        ];

        // Função de atualização
        function updateProgress() {
            let completed = 0;
            const itemsDiv = document.getElementById('progress-items');
            itemsDiv.innerHTML = '';

            checks.forEach(check => {
                const result = check.validate();
                if (result.valid) completed++;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'progress-item ' +
                    (result.valid ? 'item-ok' : result.msg.includes('⚠️') ? 'item-warning' : 'item-error');
                itemDiv.textContent = `${check.name}: ${result.msg}`;
                itemsDiv.appendChild(itemDiv);
            });

            // Atualizar barra
            const percentage = Math.round((completed / checks.length) * 100);
            const bar = document.getElementById('progress-bar');
            bar.style.width = percentage + '%';
            bar.textContent = percentage + '%';

            // Cor da barra
            if (percentage === 100) {
                bar.style.background = '#4CAF50';
            } else if (percentage >= 50) {
                bar.style.background = '#ff9800';
            } else {
                bar.style.background = '#f44336';
            }

            // Texto do progresso
            document.getElementById('progress-text').textContent = `${completed}/${checks.length}`;
        }

        // Executar primeira vez
        updateProgress();

        // Adicionar listeners apenas nos inputs necessários
        const inputIds = ['inputString', 'idlati', 'idlong'];
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', updateProgress);
            }
        });

        // Observador simples apenas para o contrato
        let observerTimeout;
        const observer = new MutationObserver(() => {
            clearTimeout(observerTimeout);
            observerTimeout = setTimeout(updateProgress, 500);
        });

        // Observar apenas a área onde o contrato pode mudar
        const contractArea = document.querySelector('.chosen-container');
        if (contractArea) {
            observer.observe(contractArea, {
                childList: true,
                subtree: true
            });
        }

        // Atualização periódica menos frequente
        setInterval(updateProgress, 5000);
    }

})();