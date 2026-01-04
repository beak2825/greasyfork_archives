// ==UserScript==
// @name         Copiar Título Eleitoral
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona botão emoji para copiar número do título eleitoral e outro botão para ir para o ELO22
// @author       Ramon Machado
// @match        https://infodip.tse.jus.br/infodip/comunicacao/consulta/detalhes.jsp*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547853/Copiar%20T%C3%ADtulo%20Eleitoral.user.js
// @updateURL https://update.greasyfork.org/scripts/547853/Copiar%20T%C3%ADtulo%20Eleitoral.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para encontrar o número do título eleitoral
    function encontrarTituloEleitoral() {
        // Busca em tabelas dentro de requestBox ou detalhes-individualizacao
        const requestBoxes = document.querySelectorAll('.requestBox, #detalhes-individualizacao');
        for (let box of requestBoxes) {
            const tabelas = box.querySelectorAll('table');
            for (let tabela of tabelas) {
                const celulas = tabela.querySelectorAll('td');
                for (let i = 0; i < celulas.length; i++) {
                    const celula = celulas[i];
                    const texto = celula.textContent || celula.innerText;

                    if (texto.includes('Título Eleitoral')) {
                        const linha = celula.closest('tr');
                        let proximaLinha = linha.nextElementSibling;

                        while (proximaLinha) {
                            const celulasDados = proximaLinha.querySelectorAll('td');
                            for (let celulaDado of celulasDados) {
                                const span = celulaDado.querySelector('span.fontBlack');
                                if (span) {
                                    const textoSpan = span.textContent.trim();
                                    if (/^\d{11,12}$/.test(textoSpan)) {
                                        return { numero: textoSpan, elemento: span };
                                    }
                                }
                            }
                            proximaLinha = proximaLinha.nextElementSibling;
                            if (proximaLinha && proximaLinha.rowIndex > linha.rowIndex + 3) break;
                        }
                    }
                }
            }
        }

        return null;
    }

    // Função para copiar texto para a área de transferência
    function copiarParaClipboard(texto) {
        navigator.clipboard.writeText(texto).then(function() {
            mostrarNotificacao('Título copiado: ' + texto);
        }).catch(function(err) {
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            mostrarNotificacao('Título copiado: ' + texto);
        });
    }

    // Função para mostrar notificação
    function mostrarNotificacao(mensagem) {
        const notificacaoExistente = document.getElementById('titulo-eleitoral-notificacao');
        if (notificacaoExistente) {
            notificacaoExistente.remove();
        }

        const notificacao = document.createElement('div');
        notificacao.id = 'titulo-eleitoral-notificacao';
        notificacao.textContent = mensagem;
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(notificacao);

        setTimeout(() => {
            notificacao.remove();
        }, 2000);
    }

    // Função principal para criar o botão emoji
    function criarBotaoEmoji() {
        const resultado = encontrarTituloEleitoral();

        if (!resultado) return;

        const { numero, elemento } = resultado;

        // Verifica se os botões já existem
        if (elemento.nextElementSibling && elemento.nextElementSibling.classList.contains('copy-btn-emoji')) return;

        // Cria o botão emoji
        const botaoEmoji = document.createElement('span');
        botaoEmoji.className = 'copy-btn-emoji';
        botaoEmoji.innerHTML = '📋';
        botaoEmoji.style.cssText = `
            margin-left: 8px;
            cursor: pointer;
            font-size: 16px;
            vertical-align: middle;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        `;

        botaoEmoji.title = 'Copiar título eleitoral';

        // Efeitos hover
        botaoEmoji.onmouseover = function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1.1)';
        };
        botaoEmoji.onmouseout = function() {
            this.style.opacity = '0.7';
            this.style.transform = 'scale(1)';
        };

        // Evento de clique
        botaoEmoji.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            copiarParaClipboard(numero);
        };

        // Cria o botão de link (seta)
        const botaoLink = document.createElement('span');
        botaoLink.className = 'link-btn-emoji';
        botaoLink.innerHTML = '➡️';
        botaoLink.style.cssText = `
            margin-left: 8px;
            cursor: pointer;
            font-size: 16px;
            vertical-align: middle;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        `;

        botaoLink.title = 'Abrir no sistema ELO22';

        // Efeitos hover para o botão link
        botaoLink.onmouseover = function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1.1)';
        };
        botaoLink.onmouseout = function() {
            this.style.opacity = '0.7';
            this.style.transform = 'scale(1)';
        };

        // Evento de clique para abrir nova aba
        botaoLink.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const url = `https://cad-elo22.tse.jus.br/#/main/eleitor/atendimento/eleitor/${numero}/dashboard`;
            window.open(url, '_blank');
            mostrarNotificacao('Abrindo no CAD-ELO...');
        };

        // Insere os botões após o span do número
        elemento.parentNode.insertBefore(botaoEmoji, elemento.nextSibling);
        elemento.parentNode.insertBefore(botaoLink, botaoEmoji.nextSibling);
    }

    // Executa quando a página carrega
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', criarBotaoEmoji);
    } else {
        criarBotaoEmoji();
    }

    // Observer para mudanças no DOM
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
        });

        if (shouldCheck) {
            setTimeout(criarBotaoEmoji, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();