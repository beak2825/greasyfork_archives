// ==UserScript==
// @name         Mapear Esteio - BCI Inline Numbers
// @namespace    http://tampermonkey.net/
// @version      1.2 // Enable/disable inline numbers based on edit state
// @description  Adds inline numbers, fills fields, auto-associates, indicates pressed number, and manages enabled state.
// @author       Seu Nome ou Gemini
// @match        http://mapear.esteio.com.br/teresina/selecao/painel/index.php?pagina=boletim*
// @grant        GM_addStyle
// @grant        GM_log
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548481/Mapear%20Esteio%20-%20BCI%20Inline%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/548481/Mapear%20Esteio%20-%20BCI%20Inline%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NUM_EDIF_INPUT_ID = 'associ_numero_da_edificacao';
    const RELACAO_BASE_DROPDOWN_ID = 'selecao_tb_pessoa';
    const ASSOCIAR_BUTTON_ID = 'btnAssociarPessoa';
    const DADOS_PESSOA_FIELDSET_SELECTOR = '#dados_pessoa fieldset.border.p-4';
    const INLINE_NUMBERS_ROW_CLASS = 'gm-inline-numbers-row';
    const INLINE_NUM_BUTTON_CLASS = 'gm-inline-num-button';
    const PRESSED_BUTTON_CLASS = 'gm-inline-num-button-pressed';
    const SALVAR_CADASTRO_BUTTON_ID = 'btnSalvarCadastro';
    const EDITAR_BOLETIM_SELECTOR = 'a[onclick^="editarBoletim("][title="Editar Boletim"]'; // Seletor do botão "Editar" na lista
    const EDIFICACOES_LIST_CONTAINER_ID = 'listar_edif'; // Container da lista de edificações

    GM_addStyle(`
        .${INLINE_NUMBERS_ROW_CLASS} {
            margin-top: 10px;
            margin-bottom: 15px;
            padding-top: 5px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
        }
        .${INLINE_NUM_BUTTON_CLASS} {
            padding: 6px 12px;
            margin: 2px 3px;
            border: 1px solid #007bff;
            background-color: #f8f9fa;
            color: #007bff;
            cursor: pointer;
            min-width: 35px;
            text-align: center;
            border-radius: 0.25rem;
            font-size: 0.9em;
            font-weight: bold;
            transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, opacity 0.15s ease-in-out;
            display: inline-block;
        }
        .${INLINE_NUM_BUTTON_CLASS}:hover:not(:disabled) { /* Hover effect only when not disabled */
            background-color: #007bff;
            color: white;
        }
        .${INLINE_NUM_BUTTON_CLASS}.${PRESSED_BUTTON_CLASS} {
            background-color: #0056b3;
            color: white;
            border-color: #004085;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .${INLINE_NUM_BUTTON_CLASS}:disabled {
            background-color: #e9ecef;
            color: #6c757d;
            border-color: #ced4da;
            cursor: not-allowed;
            opacity: 0.65; /* Visual indication of disabled */
            box-shadow: none;
        }
    `);

    function setInlineNumberButtonsEnabled(enable) {
        const allNumButtons = document.querySelectorAll(`.${INLINE_NUM_BUTTON_CLASS}`);
        allNumButtons.forEach(btn => {
            btn.disabled = !enable;
        });
        GM_log(`Botões numéricos inline ${enable ? 'HABILITADOS' : 'DESABILITADOS'}.`);
    }

    function clearNumberButtonSelection() {
        const allNumButtons = document.querySelectorAll(`.${INLINE_NUM_BUTTON_CLASS}`);
        allNumButtons.forEach(btn => {
            btn.classList.remove(PRESSED_BUTTON_CLASS);
        });
        GM_log("Seleção de botão numérico (estado 'pressionado') foi limpa.");
    }

    function handleNumberButtonClick(selectedNumber, clickedButtonElement) {
        if (clickedButtonElement.disabled) return; // Não faz nada se o botão estiver desabilitado

        GM_log(`Botão numérico inline '${selectedNumber}' clicado.`);
        clearNumberButtonSelection();
        clickedButtonElement.classList.add(PRESSED_BUTTON_CLASS);
        GM_log(`Botão '${selectedNumber}' marcado como pressionado.`);

        const numEdifInput = document.getElementById(NUM_EDIF_INPUT_ID);
        if (numEdifInput) {
            numEdifInput.value = selectedNumber;
            numEdifInput.dispatchEvent(new Event('input', { bubbles: true }));
            numEdifInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            GM_log(`ERRO: Campo '${NUM_EDIF_INPUT_ID}' não encontrado.`);
            return;
        }

        const relacaoBaseDropdown = document.getElementById(RELACAO_BASE_DROPDOWN_ID);
        if (relacaoBaseDropdown) {
            if (relacaoBaseDropdown.options.length > 1 && relacaoBaseDropdown.options[0].value === "" && relacaoBaseDropdown.options[1]) {
                relacaoBaseDropdown.selectedIndex = 1;
                relacaoBaseDropdown.dispatchEvent(new Event('change', { bubbles: true }));
            } else if (relacaoBaseDropdown.options.length > 0 && relacaoBaseDropdown.options[0].value !== "") {
                 relacaoBaseDropdown.selectedIndex = 0;
                 relacaoBaseDropdown.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        const associarButton = document.getElementById(ASSOCIAR_BUTTON_ID);
        if (associarButton) {
            associarButton.disabled = false;
            setTimeout(() => {
                associarButton.click();
            }, 150);
        }
    }

    let inlineButtonsCreated = false;
    function initInlineNumberButtons() {
        if (inlineButtonsCreated) return true;

        const dadosPessoaFieldset = document.querySelector(DADOS_PESSOA_FIELDSET_SELECTOR);
        if (!dadosPessoaFieldset) return false;

        if (dadosPessoaFieldset.querySelector(`.${INLINE_NUMBERS_ROW_CLASS}`)) {
            inlineButtonsCreated = true;
            setInlineNumberButtonsEnabled(false); // Garante que estejam desabilitados ao recarregar a página se já existirem
            return true;
        }

        const numbersRow = document.createElement('div');
        numbersRow.className = `${INLINE_NUMBERS_ROW_CLASS} form-row`;

        for (let i = 1; i <= 9; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.type = 'button';
            button.className = INLINE_NUM_BUTTON_CLASS;
            button.disabled = true; // Começam desabilitados
            button.addEventListener('click', function() {
                handleNumberButtonClick(this.textContent, this);
            });
            numbersRow.appendChild(button);
        }
        dadosPessoaFieldset.appendChild(numbersRow);
        GM_log('Botões numéricos inline CRIADOS (desabilitados) na seção "Dados Pessoa".');
        inlineButtonsCreated = true;
        return true;
    }

    let saveButtonListenerAttached = false;
    function attachListenerToSaveButton() {
        if (saveButtonListenerAttached) return true;

        const salvarCadastroButton = document.getElementById(SALVAR_CADASTRO_BUTTON_ID);
        if (salvarCadastroButton) {
            salvarCadastroButton.addEventListener('click', function() {
                GM_log(`Botão '${SALVAR_CADASTRO_BUTTON_ID}' clicado. Limpando e desabilitando botões numéricos.`);
                clearNumberButtonSelection();
                setInlineNumberButtonsEnabled(false); // Desabilita os botões
            });
            saveButtonListenerAttached = true;
            GM_log(`Listener adicionado ao botão '${SALVAR_CADASTRO_BUTTON_ID}'.`);
            return true;
        }
        return false;
    }

    let editarBoletimListenerAttached = false;
    function attachListenerToEditarBoletim() {
        if (editarBoletimListenerAttached) return true;

        const container = document.getElementById(EDIFICACOES_LIST_CONTAINER_ID);
        if (container) {
            container.addEventListener('click', function(event) {
                let currentElement = event.target;
                while (currentElement && currentElement !== this && currentElement !== document.body) {
                    if (currentElement.matches(EDITAR_BOLETIM_SELECTOR)) {
                        GM_log('Tampermonkey: Botão "Editar Boletim" clicado. Habilitando botões numéricos inline.');
                        setInlineNumberButtonsEnabled(true); // Habilita os botões
                        clearNumberButtonSelection();      // Limpa seleção anterior
                        return;
                    }
                    currentElement = currentElement.parentElement;
                }
            });
            editarBoletimListenerAttached = true;
            GM_log(`Listener para "${EDITAR_BOLETIM_SELECTOR}" adicionado ao container '${EDIFICACOES_LIST_CONTAINER_ID}'.`);
            return true;
        }
        return false;
    }

    // Função principal de configuração
    function setupAllFunctionality() {
        let allSetup = true;
        if (!inlineButtonsCreated) {
            inlineButtonsCreated = initInlineNumberButtons();
        }
        if (!saveButtonListenerAttached) {
            saveButtonListenerAttached = attachListenerToSaveButton();
        }
        if (!editarBoletimListenerAttached) {
            editarBoletimListenerAttached = attachListenerToEditarBoletim();
        }

        // Se tudo foi configurado, podemos parar de observar
        if (inlineButtonsCreated && saveButtonListenerAttached && editarBoletimListenerAttached) {
            if (observer) {
                observer.disconnect();
                GM_log('Tampermonkey: Observer desconectado após todas as funcionalidades (v1.2) serem configuradas.');
            }
            timeoutIds.forEach(clearTimeout);
            timeoutIds = [];
        }
    }

    let observer = null;
    let timeoutIds = [];

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        setupAllFunctionality();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            GM_log('Evento DOMContentLoaded (v1.2).');
            setupAllFunctionality();
        });
    }

    window.addEventListener('load', () => {
        GM_log('Evento window.load (v1.2).');
        setupAllFunctionality();
    });

    observer = new MutationObserver((mutationsList, obs) => {
        setupAllFunctionality();
    });

    function startObserverWhenReady() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            GM_log('MutationObserver (v1.2) iniciado no document.body.');
        } else {
            setTimeout(startObserverWhenReady, 50);
        }
    }
    startObserverWhenReady();

    [500, 1500, 3000, 5000].forEach(delay => {
        timeoutIds.push(setTimeout(setupAllFunctionality, delay));
    });

})();