// ==UserScript==
// @name         Organizador de Itens Popmundo por Dono
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Reorganiza os itens por dono em seções recolhíveis (sanfona/accordion) para melhor visualização.
// @author       Popper
// @match        https://*.popmundo.com/World/Popmundo.aspx/Locale/ItemsEquipment/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=popmundo.com
// @downloadURL https://update.greasyfork.org/scripts/555153/Organizador%20de%20Itens%20Popmundo%20por%20Dono.user.js
// @updateURL https://update.greasyfork.org/scripts/555153/Organizador%20de%20Itens%20Popmundo%20por%20Dono.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adiciona o CSS necessário para a funcionalidade e aparência
    GM_addStyle(`
        .owner-header {
            cursor: pointer;
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10+ */
            user-select: none; /* Padrão */
            background-color: #333 !important;
            color: #fff !important;
            font-weight: bold;
            text-align: center;
        }
        .owner-header:hover {
            background-color: #555 !important;
        }
        .owner-header td {
            padding: 8px !important;
        }
        .toggle-indicator {
            margin-right: 12px;
            font-family: monospace;
            font-size: 1.1em;
            display: inline-block;
            width: 10px;
        }
        .items-hidden {
            display: none;
        }
        #organizer-controls {
            margin-bottom: 10px;
            padding: 5px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #organizer-controls a {
            cursor: pointer;
            text-decoration: underline;
            color: #369;
            margin: 0 10px;
        }
    `);

    /**
     * Função principal para organizar os itens e adicionar a funcionalidade de sanfona.
     */
    function organizeAndMakeCollapsible() {
        const itemsTable = document.getElementById('checkedlist');
        if (!itemsTable) return;

        const tbody = itemsTable.querySelector('tbody');
        if (!tbody) return;

        // 1. Identifica o nome do seu personagem (dono do local)
        let yourCharacterName = "Seus Itens";
        const ownerDiv = document.querySelector('.localebox .grid-2 > div:first-child a');
        if (ownerDiv) {
            yourCharacterName = ownerDiv.textContent.trim();
        }

        const ownersData = {};
        let currentGroupRow = null;

        // 2. Itera sobre todas as linhas da tabela para catalogar os itens
        Array.from(tbody.rows).forEach(row => {
            if (row.classList.contains('group')) {
                currentGroupRow = row;
            } else if (row.classList.contains('hoverable')) {
                const ownerLink = row.querySelector('a[id*="lnkItemOwner"] img');
                if (!ownerLink) return;

                const ownerTitle = ownerLink.title;
                let ownerName = 'Dono Desconhecido';

                if (ownerTitle.startsWith('Este item é seu.')) {
                    ownerName = yourCharacterName;
                } else if (ownerTitle.startsWith('Este item pertence a ')) {
                    ownerName = ownerTitle.replace('Este item pertence a ', '').replace('.', '');
                }

                if (!ownersData[ownerName]) ownersData[ownerName] = [];
                ownersData[ownerName].push({
                    group: currentGroupRow ? currentGroupRow.cloneNode(true) : null,
                    item: row
                });
            }
        });

        // Limpa a tabela original
        tbody.innerHTML = '';

        // Ordena os donos (seu personagem primeiro, depois alfabeticamente)
        const sortedOwners = Object.keys(ownersData).sort((a, b) => {
            if (a === yourCharacterName) return -1;
            if (b === yourCharacterName) return 1;
            return a.localeCompare(b);
        });

        // 3. Recria a tabela com a nova estrutura de sanfona
        sortedOwners.forEach(ownerName => {
            const isOwnerYou = ownerName === yourCharacterName;
            const isInitiallyCollapsed = !isOwnerYou;

            // Cria o cabeçalho clicável para o dono
            const ownerHeader = document.createElement('tr');
            ownerHeader.className = 'owner-header';
            const indicator = isInitiallyCollapsed ? '►' : '▼';
            ownerHeader.innerHTML = `<td colspan="2"><span class="toggle-indicator">${indicator}</span>${ownerName}</td>`;
            tbody.appendChild(ownerHeader);

            let lastGroupText = null;
            const itemRows = [];

            // Adiciona as linhas de itens e categorias
            ownersData[ownerName].forEach(data => {
                const currentGroupText = data.group ? data.group.querySelector('td').textContent.trim() : '';
                if (currentGroupText && currentGroupText !== lastGroupText) {
                    tbody.appendChild(data.group);
                    itemRows.push(data.group);
                    lastGroupText = currentGroupText;
                }
                tbody.appendChild(data.item);
                itemRows.push(data.item);
            });

            // Oculta os itens se for o estado inicial recolhido
            if (isInitiallyCollapsed) {
                itemRows.forEach(r => r.classList.add('items-hidden'));
            }

            // Adiciona o evento de clique ao cabeçalho para alternar a visibilidade
            ownerHeader.addEventListener('click', () => {
                const toggleIndicator = ownerHeader.querySelector('.toggle-indicator');
                const isHidden = itemRows[0].classList.contains('items-hidden');

                itemRows.forEach(r => r.classList.toggle('items-hidden'));
                toggleIndicator.textContent = isHidden ? '▼' : '►';
            });
        });

        // 4. Adiciona controles globais ("Expandir/Recolher Tudo")
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'organizer-controls';
        controlsDiv.innerHTML = `<a id="expand-all">Expandir Tudo</a> | <a id="collapse-all">Recolher Tudo</a>`;
        itemsTable.parentNode.insertBefore(controlsDiv, itemsTable);

        document.getElementById('expand-all').addEventListener('click', () => {
            document.querySelectorAll('.owner-header').forEach(header => {
                if (header.querySelector('.toggle-indicator').textContent === '►') {
                    header.click();
                }
            });
        });

        document.getElementById('collapse-all').addEventListener('click', () => {
            document.querySelectorAll('.owner-header').forEach(header => {
                if (header.querySelector('.toggle-indicator').textContent === '▼') {
                    header.click();
                }
            });
        });
    }

    // Executa o script quando a página carregar
    window.addEventListener('load', organizeAndMakeCollapsible);
})();