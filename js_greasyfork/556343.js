// ==UserScript==
// @name         Musixmatch - Popup #INSTRUMENTAL
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Popup estilo nativo do Musixmatch. Insere #INSTRUMENTAL em linhas vazias.
// @author       Nero Legendary
// @match        https://curators.musixmatch.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556343/Musixmatch%20-%20Popup%20INSTRUMENTAL.user.js
// @updateURL https://update.greasyfork.org/scripts/556343/Musixmatch%20-%20Popup%20INSTRUMENTAL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TAG_MAP = {
        'Instrumental': '#INSTRUMENTAL',
    };

    let popup = null;
    let currentlyFocusedElement = null;

    // --- Função para verificar se está na página de transcrição ---
    function isTranscriptionPage() {
        const url = window.location.href;
        return url.includes('/tool?') && 
               (url.includes('mode=edit') || url.includes('mode=transcribe'));
    }

    // --- 1. Criação do Popup (Sem mudanças no estilo) ---
    function createPopup() {
        if (popup) document.body.removeChild(popup);

        popup = document.createElement('div');
        popup.id = 'mxm_tag_popup_menu';

        popup.style.cssText = `
            position: fixed;
            z-index: 2147483647;
            display: none;
            flex-direction: column;
            transform: translateY(-50%);
            pointer-events: none;
            transition: top 0.05s ease-out, left 0.05s ease-out;
        `;

        Object.entries(TAG_MAP).forEach(([label, value]) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.dataset.tag = value;

            button.style.cssText = `
                pointer-events: auto;
                background-color: var(--mxm-backgroundSecondary, #f4f4f4);
                color: var(--mxm-contentPrimary, #131313);
                border: 1px solid var(--mxm-backgroundTertiary, #e0e0e0);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                padding: 4px 12px;
                margin: 0;
                border-radius: 16px;
                cursor: pointer;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.1s, background-color 0.2s;
            `;

            button.onmouseover = () => {
                button.style.transform = 'scale(1.05)';
                button.style.filter = 'brightness(0.95)';
            };
            button.onmouseout = () => {
                button.style.transform = 'scale(1)';
                button.style.filter = 'brightness(1)';
            };

            button.addEventListener('mousedown', (e) => e.preventDefault());
            button.onclick = handleTagButtonClick;

            popup.appendChild(button);
        });

        document.body.appendChild(popup);
    }

    // --- 2. Lógica de Posicionamento e Inserção ---
    function updatePopupPosition() {
        if (!popup || popup.style.display === 'none' || !currentlyFocusedElement) return;
        const rect = currentlyFocusedElement.getBoundingClientRect();

        // POSICIONAMENTO CORRIGIDO: Ao lado da linha
        popup.style.left = `${rect.right + 15}px`;
        const verticalCenter = rect.top + (rect.height / 2);
        popup.style.top = `${verticalCenter}px`;
    }

    function setNativeValue(element, value) {
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            element.value = value;
        }

        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function insertTextAtCursor(element, text) {
        if (!element) return;
        const start = element.selectionStart;
        const end = element.selectionEnd;
        const currentValue = element.value;
        const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
        setNativeValue(element, newValue);
        const newCursorPos = start + text.length;
        element.selectionStart = element.selectionEnd = newCursorPos;
    }

    function handleTagButtonClick(event) {
        event.stopPropagation();
        const tag = event.target.dataset.tag;

        if (currentlyFocusedElement && tag) {
            insertTextAtCursor(currentlyFocusedElement, tag);
        }
        popup.style.display = 'none';
    }

    // --- 3. Detecção de Foco (Lógica Corrigida com verificação de página) ---
    function isRelevantInput(element) {
        const tag = element.tagName;
        return tag === 'TEXTAREA' || (tag === 'INPUT' && element.type === 'text');
    }

    document.addEventListener('focusin', function(event) {
        const target = event.target;

        if (isRelevantInput(target)) {
            currentlyFocusedElement = target;

            // VERIFICAÇÃO CRÍTICA: Se estiver na página de transcrição, NUNCA mostra o popup
            if (isTranscriptionPage()) {
                popup.style.display = 'none';
                return;
            }

            const lineValue = target.value;
            const lineTrimmed = lineValue.trim();

            // 1. Prioriza: Se a tag já existe, sempre esconde.
            if (lineValue.includes('#INSTRUMENTAL')) {
                popup.style.display = 'none';
            }
            // 2. Senão, mostra se a linha está VAZIA.
            else if (lineTrimmed === '') {
                updatePopupPosition();
                popup.style.display = 'flex';
            }
            // 3. Em qualquer outro caso (tem outro texto, mas não a tag), esconde.
            else {
                popup.style.display = 'none';
            }
        } else {
            if (popup.style.display !== 'none' && !popup.contains(target)) {
                popup.style.display = 'none';
            }
        }
    }, true);

    document.addEventListener('click', function(event) {
        if (popup && popup.style.display !== 'none' && !popup.contains(event.target) && event.target !== currentlyFocusedElement) {
            popup.style.display = 'none';
        }
    });

    window.addEventListener('scroll', updatePopupPosition, true);
    window.addEventListener('resize', updatePopupPosition);

    createPopup();

})();