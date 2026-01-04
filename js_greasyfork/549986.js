// ==UserScript==
// @name         Degen Idle Collector (Atualizado Espaçamento)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Coleta itens acumulando em matriz, limpa e exporta CSV com espaçamento entre botões.
// @author       DarkDragon + Lucashmg
// @match        https://degenidle.com/inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549986/Degen%20Idle%20Collector%20%28Atualizado%20Espa%C3%A7amento%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549986/Degen%20Idle%20Collector%20%28Atualizado%20Espa%C3%A7amento%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_IDS = {
        collect: 'collect-items-button',
        clear: 'clear-data-button',
        export: 'export-csv-button'
    };

    let dataMatrix = [];

    function createButton(id, text, color, bottom, onClick) {
        if (document.getElementById(id)) return;

        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = text;
        Object.assign(btn.style, {
            position: 'fixed',
            right: '20px',
            bottom: bottom,
            padding: '10px 15px',
            backgroundColor: color,
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: '9999'
        });
        btn.addEventListener('click', onClick);
        document.body.appendChild(btn);
    }

    function coletarItens() {
        const itens = [];
        const inventoryItems = document.querySelectorAll('.rounded-lg.relative.group.cursor-pointer');
        inventoryItems.forEach(item => {
            try {
                let nome = 'Nome não encontrado';
                let quantidade = '1';

                const nameDiv = item.querySelector('div.text-sm');
                const imgElement = item.querySelector('img');
                const quantityDiv = item.querySelector('.absolute.-top-2.-right-2');

                if (nameDiv && nameDiv.textContent.trim() !== '') {
                    nome = nameDiv.textContent.trim();
                } else if (imgElement && imgElement.alt.trim() !== '') {
                    nome = imgElement.alt.trim();
                }

                if (quantityDiv && quantityDiv.textContent.trim() !== '') {
                    quantidade = quantityDiv.textContent.trim();
                }

                itens.push({ nome, quantidade });
            } catch (e) {
                console.error('Erro ao coletar item:', e);
            }
        });
        return itens;
    }

    function adicionarItensNaMatriz(itens) {
        itens.forEach(item => {
            dataMatrix.push([item.nome, item.quantidade]);
        });
        console.table(dataMatrix);
    }

    function limparDados() {
        dataMatrix = [];
        console.clear();
        console.log('Dados limpos.');
    }

    function escapeCsv(value) {
        if (value == null) return '';
        const str = String(value);
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    function exportarCsv() {
        if (dataMatrix.length === 0) {
            return;
        }
        const separator = ',';
        const headers = ['Item', 'Quantidade'];
        let csv = headers.map(escapeCsv).join(separator) + '\n';

        dataMatrix.forEach(row => {
            csv += row.map(escapeCsv).join(separator) + '\n';
        });

        navigator.clipboard.writeText(csv).then(() => {
            const btn = document.getElementById(BUTTON_IDS.export);
            const textoOriginal = btn.textContent;
            btn.textContent = 'Copiado!';
            btn.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                btn.textContent = textoOriginal;
                btn.style.backgroundColor = '#0099cc';
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar CSV:', err);
        });
    }

    function init() {
        createButton(BUTTON_IDS.collect, 'Coletar Itens', '#f39c12', '120px', () => {
            const itens = coletarItens();
            adicionarItensNaMatriz(itens);
        });

        createButton(BUTTON_IDS.clear, 'Limpar Dados', '#e74c3c', '80px', () => {
            limparDados();
        });

        createButton(BUTTON_IDS.export, 'Exportar CSV', '#0099cc', '40px', exportarCsv);
    }

    function waitForBody() {
        if (document.body) {
            init();
        } else {
            requestAnimationFrame(waitForBody);
        }
    }

    waitForBody();

})();