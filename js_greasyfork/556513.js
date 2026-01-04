// ==UserScript==
// @name         Flow Veo - Mostrar só Veo 3.1 Fast (v2.2 - Com Seleção Automática e Mais Tags)
// @namespace    https://thehorizon.pro/js/
// @version      1.2
// @description  Esconde Veo 3.1 - Quality, Veo 2 - Fast e Veo 2 - Quality no seletor de modelo E seleciona Veo 3.1 - Fast
// @author       Manus
// @match        https://labs.google/fx/tools/flow/*
// @run-at       document-idle
// @grant        none
// @source       https://thehorizon.pro/js/tamper-veo.js
// @homepageURL  https://thehorizon.pro/js/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556513/Flow%20Veo%20-%20Mostrar%20s%C3%B3%20Veo%2031%20Fast%20%28v22%20-%20Com%20Sele%C3%A7%C3%A3o%20Autom%C3%A1tica%20e%20Mais%20Tags%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556513/Flow%20Veo%20-%20Mostrar%20s%C3%B3%20Veo%2031%20Fast%20%28v22%20-%20Com%20Sele%C3%A7%C3%A3o%20Autom%C3%A1tica%20e%20Mais%20Tags%29.meta.js
// ==/UserScript==

(function ( ) {
    'use strict';

    const LABELS_OCULTAR = [
        'Veo 3.1 - Quality',
        'Veo 2 - Fast',
        'Veo 2 - Quality'
    ];
    const LABEL_MANTER = 'Veo 3.1 - Fast';

    /**
     * Aplica o filtro nos itens do menu e tenta selecionar o modelo desejado.
     */
    function aplicarFiltro() {
        // Seleciona itens de menu que usam roles comuns em componentes de seleção
        const itens = document.querySelectorAll(
            '[role="menuitemradio"], [role="option"]'
        );

        if (itens.length === 0) {
            return;
        }

        let itemParaSelecionar = null;

        itens.forEach(item => {
            // Tenta encontrar o texto dentro do item
            const texto = (item.textContent || '').trim();

            if (LABELS_OCULTAR.some(label => texto.includes(label))) {
                // Oculta o item indesejado usando display: none
                item.style.display = 'none';
            } else if (texto.includes(LABEL_MANTER)) {
                // Guarda a referência para o item que queremos manter e selecionar
                itemParaSelecionar = item;
            }
        });

        // Garante que o Veo 3.1 - Fast esteja selecionado
        if (itemParaSelecionar) {
            const isChecked = itemParaSelecionar.getAttribute('aria-checked') === 'true' ||
                              itemParaSelecionar.getAttribute('data-state') === 'checked';

            // Se não estiver selecionado, simula um clique para selecioná-lo
            //if (!isChecked) {
                // ESTA LINHA CAUSA O AVISO DE SEGURANÇA
              //  setTimeout(() => {
                //    itemParaSelecionar.click();
                //}, 100);
            //}
        }
    }

    // Cria um observador para detectar a adição do menu suspenso ao DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        // Verifica se o menu suspenso está visível
        const menuContainer = document.querySelector('[role="menu"], [role="listbox"]');

        if (menuContainer) {
            // Se o contêiner do menu for encontrado, aplica o filtro
            aplicarFiltro();
        }
    });

    // Começa a observar o corpo do documento para a adição de novos elementos (o menu suspenso)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Tenta aplicar o filtro imediatamente, caso o menu já esteja aberto na carga da página
    aplicarFiltro();

})();
