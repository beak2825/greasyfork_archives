// ==UserScript==
// @name         Vectal Advanced Pro - Drawaria Script Maker
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Restores saving, exporting, and loading conversations, managing prompts, and an integrated JavaScript executor for vectal.ai.
// @match        https://vectal.ai/*
// @match        https://www.vectal.ai/*
// @author       YouTubeDrawaria
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/9/9a/Noun_Robot_1749584.svg
// @downloadURL https://update.greasyfork.org/scripts/549747/Vectal%20Advanced%20Pro%20-%20Drawaria%20Script%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/549747/Vectal%20Advanced%20Pro%20-%20Drawaria%20Script%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        INIT_TIMEOUT: 10000,
        RETRY_INTERVAL: 500,
        MAX_RETRIES: 20,
        AUTO_SAVE_INTERVAL: 30000, // 30 segundos
        MAX_AUTO_SAVES: 50, // Máximo de autoguardados
        FLOATING_UI_INITIAL_POS_X: 20,
        FLOATING_UI_INITIAL_POS_Y: 80,
    };

    // --- CSS Selectors (CRÍTICO: ADAPTAR PARA VECTAL.AI) ---
    // ESTOS SELECTORES DEBEN SER REVISADOS Y ACTUALIZADOS SEGÚN LA ESTRUCTURA HTML REAL DE VECTAL.AI.
    // Utiliza las herramientas de desarrollador (F12) para inspeccionar los elementos.
    const SELECTORS = {
        // Selector para el textarea principal de entrada. ¡Ahora más específico!
        INPUT_TEXTAREA: 'textarea[placeholder*="Message Vectal..."]',

        // Selectores para mensajes de la IA y del usuario, y bloques de código.
        // **ESTOS SON CRÍTICOS Y SEGURAMENTE NECESITARÁN AJUSTES PROFUNDOS PARA VECTAL.AI**
        // Necesitas inspeccionar el DOM de Vectal.ai para encontrar las clases o atributos correctos.
        // EJEMPLO: Si los mensajes de la IA tienen una clase 'ai-response' y los del usuario 'user-input',
        // y ambos están dentro de un contenedor con clase 'chat-message-bubble'.
        // Posibles selectores para la IA: 'div.chat-message-bubble.ai-response'
        // Posibles selectores para el Usuario: 'div.chat-message-bubble.user-input'
        // Contenedor general: div[data-message-id] o div[class*="message-bubble"]
        VECTAL_MESSAGES_CONTAINER: 'div[class*="message-container"]', // Placeholder genérico, busca el contenedor principal de cada mensaje
        USER_MESSAGES_BUBBLE: 'div[class*="user-message-bubble"]', // Placeholder: Clase o atributo para identificar mensajes del usuario
        AI_MESSAGES_BUBBLE: 'div[class*="ai-message-bubble"]',     // Placeholder: Clase o atributo para identificar mensajes de la IA
        MESSAGE_TEXT_ELEMENT: '.prose p, .message-content p, div.whitespace-pre-wrap', // Placeholder: Donde está el texto real dentro de las burbujas de mensaje
        CODE_BLOCKS: 'pre code',                                  // Selector común para bloques de código
        CODE_CONTAINERS: 'div[data-testid="code-block-wrapper"]', // Placeholder: Contenedor alrededor de los bloques de código (para extraer lenguaje, si existe)
        CODE_CONTENT: 'code[class*="language-"]',                 // Placeholder: El elemento de código en sí

        // Botones de control (ajusta si los aria-labels o clases son diferentes en Vectal.ai)
        CLEAR_BUTTON: 'button[aria-label="Clear Chat"]',
        STOP_BUTTON: 'button[aria-label="Stop Generating"]',
        SUBMIT_BUTTON: 'button[aria-label="Send message"]', // Típico para enviar mensaje
    };

    // --- Categorized Prompts (unchanged) ---
    const ALL_CATEGORIZED_PROMPTS = {
         "Prompts de Juego": [
            { name: "Juego Simple HTML", text: `Crea un juego en un solo archivo HTML. No uses data:image/png;base64. Genera los gráficos usando formas y SVG.` },
            { name: "Juego Completo", text: `Genera recursos, sprites, assets, sfx, música, mecánicas, conceptos, diseños de juego, ideas y características para un juego completo. Sé preciso, inteligente y conciso.` },
            { name: "Recrear Juego", text: `Crea un prompt detallado para que una IA recree un juego existente. Explica paso a paso cómo debe abordar la recreación, incluyendo el análisis del juego original, la identificación de mecánicas clave, la creación de assets, la implementación del código y las fases de prueba. Sé minucioso en cada detalle.` },
            { name: "Juego Complejo HTML", text: `Crea un juego en un solo archivo HTML con un mapa grande, añade elementos, objetos, detalles y los mejores gráficos. Sé preciso, inteligente y conciso. Usa solo formas y SVG para todos los gráficos (sin base64encoded o imágenes PNG). Todos los gráficos deben ser creados usando formas y trazados SVG, sin recursos externos, con animaciones y transiciones fluidas, mecánicas de batalla por turnos adecuadas, elementos de UI responsivos, un sistema de gestión de salud, cuatro movimientos diferentes con cálculo de daño aleatorio, IA enemesa con lógica de ataque básica, y retroalimentación visual para ataques y daño.` },
            { name: "Juego Detallado", text: `Mejora, expande y perfecciona un juego existente. El juego debe tener un mapa grande, y debe incluir elementos, objetos, detalles y los mejores gráficos, junto con personajes mejorados y detallados. Quiero que todo el juego esté contenido en un solo archivo. No uses imágenes base64encoded o PNG; debes crear los gráficos con la máxima complejidad, detalle y mejora posible, utilizando únicamente formas y SVG. Haz que el juego sea lo mejor y más grande que pueda ser. Además, añade más tipos de plataformas, crea más tipos de enemigos, implementa diferentes efectos de power-up, establece un sistema de niveles, diseña distintos entornos, desarrolla una IA enemesa más compleja, haz que los movimientos de los jugadores sean más suaves y mejora la interfaz de usuario tanto para el jugador como para los enemigos.` }
        ],
        "Prompts Web": [
            { name: "Web Moderna", text: `Crea el código para una landing page de un sitio web moderno que . Make the code for landing page. Make sure it looks nice and well designed` }
        ],
        "Prompts Personaje": [
            { name: "Descripción Personaje", text: `Haz una descripción larga describiendo todo sobre el personaje con información extra detallada. Haz una descripción profesional describiendo detalladamente todo sobre la imagen con información más detallada.` }
        ],
        "Prompts Canción": [
            { name: "Atributos de Canción", text: `Dame los atributos de la canción separados por comas. Atributos de la canción separados por comas.` }
        ],
        "Prompts Gemini": [
            { name: "Generar 4 Imágenes X", text: `Genera 4 nuevas [X] diferentes en 4 imágenes cada una.` }
        ],
        "Prompts de Scripting/Desarrollo": [
            { name: "Crear Script Drawaria", text: `Crea un script tampermonkey completo para drawaria.online con la siguiente estructura inicial:\n // ==UserScript==\n// @name New Userscript\n// @namespace http://tampermonkey.net/\n// @version 1.0\n// @description try to take over the world!\n// @author YouTubeDrawaria\n// @match https://drawaria.online/*\n// @grant none\n// @license MIT\n// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online\n// ==/UserScript==\n\n(function() {\n    'use strict';\n\n    // Your code here...\n})();\n` },
            { name: "Script Drawaria Avanzado", text: "Crea un script tampermonkey completo para drawaria.online con funcionalidades avanzadas: efectos visuales, partículas, animaciones, interfaz mejorada, y características especiales. No uses placeholders ni archivos externos." },
            { name: "Mejorar Script Drawaria", text: `Mejora, actualiza, maximiza, sorprende, crea realismo y alto nivel de detalle en el script para drawaria.online. Quiero elementos de X en pantalla, música, efectos, partículas, brillos y una interfaz bien animada y detallada con todo. No uses placeholders, .mp3 ni data:image/png;base64. Debes crear los gráficos tú mismo, sin archivos reemplazables.` },
            { name: "Atributos de Juego", text: `Dame los atributos de un juego. Incluye: icono del juego (<link rel="icon" href="https://drawaria.online/avatar/cache/ab53c430-1b2c-11f0-af95-072f6d4ed084.1749767757401.jpg" type="image/x-icon">) y música de fondo con reproducción automática al hacer clic: (<audio id="bg-music" src="https://www.myinstants.com/media/sounds/super-mini-juegos-2.mp3" loop></audio><script>const music = document.getElementById('bg-music'); document.body.addEventListener('click', () => { if (music.paused) { music.play(); } });</script>).` },
            { name: "API Cubic Engine Info", text: `Proporciona información sobre APIs ampliamente utilizadas que no estén alojadas en Vercel, no presenten problemas con CORS al usarlas desde navegadores/shell, se puedan integrar rápidamente en Cubic Engine / Drawaria, y sean gratuitas y de uso inmediato.` },
            { name: "Integrar Función Cubic Engine", text: `Para integrar una nueva adición a un módulo de Cubic Engine, necesito el código completo actualizado de la función. Esto incluye el botón con todas sus propiedades, los activadores con sus IDs, los listeners de este evento y los archivos que lo ejecutan. Solo proporciona el código de la función actualizada, no el código de Cubic Engine desde cero.` }
        ]
    };

    let featuresInitialized = false;
    let retryCount = 0;
    let autoSaveInterval = null;
    let isAutoSaveActive = false;

    // --- SVG Icons (for internal windows or if text isn't chosen) ---
    const ICON_SVG = {
        DOWNLOAD: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path><polyline points="7 11 12 16 17 11"></polyline><line x1="12" y1="4" x2="12" y2="16"></line></svg>`,
        UPLOAD: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10"></path><polyline points="17 7 12 2 7 7"></polyline><line x1="12" y1="4" x2="12" y2="14"></line></svg>`,
        CODE: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
        AUTO_SAVE: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24"></path></svg>`,
        TOGGLE: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16M4 16h16"></path></svg>`, // Example toggle icon
        PROMPTS: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2h6a2 2 0 0 1 2 2v6m-2 4v6a2 2 0 0 1 -2 2H4a2 2 0 0 1 -2 -2V4a2 2 0 0 1 2 -2h6"></path><path d="M10 9h4v4h-4z"></path></svg>`
    };


    // --- Robust Storage Manager (Claves actualizadas a 'vectal_') ---
    const RobustStorage = {
        setItem: function(key, value) {
            const serialized = JSON.stringify(value);
            try {
                localStorage.setItem(`vectal_${key}`, serialized);
                return true;
            } catch (e) {
                console.warn(`⚠️ Error con localStorage para vectal_${key}:`, e);
                try {
                    sessionStorage.setItem(`vectal_${key}`, serialized);
                    return true;
                } catch (e2) {
                    console.error(`❌ Error con sessionStorage para vectal_${key}:`, e2);
                    return false;
                }
            }
        },
        getItem: function(key, defaultValue = null) {
            let result = null;
            try {
                result = localStorage.getItem(`vectal_${key}`);
            } catch (e) {
                console.warn(`⚠️ Error leyendo localStorage para vectal_${key}:`, e);
                try {
                    result = sessionStorage.getItem(`vectal_${key}`);
                } catch (e2) {
                    console.error(`❌ Error leyendo sessionStorage para vectal_${key}:`, e2);
                }
            }
            return result ? JSON.parse(result) : defaultValue;
        }
    };

    // --- Helper Functions ---
    function extractCleanCodeContent(codeElement) {
        try {
            let codeText = codeElement.innerText || codeElement.textContent || '';
            if (!codeText || codeText.length < 10) {
                const spans = codeElement.querySelectorAll('span');
                if (spans.length > 0) {
                    codeText = Array.from(spans)
                        .map(span => span.innerText || span.textContent || '')
                        .join('');
                }
            }
            if (!codeText || codeText.length < 10) {
                const codeContainer = codeElement.closest('div[class*="pr-lg"]'); // Este selector puede necesitar ajuste
                if (codeContainer) {
                    codeText = codeContainer.innerText || codeContainer.textContent || '';
                }
            }
            codeText = codeText
                .replace(/^\s*[\d\s]+/gm, '') // Elimina números de línea
                .replace(/\s*\n\s*\n\s*/g, '\n') // Limpia saltos de línea extra
                .trim();
            if (codeText.length > 5 && /[a-zA-Z(){};=]/.test(codeText)) {
                return codeText;
            }
            return null;
        } catch (error) {
            console.warn('⚠️ Error extrayendo código:', error);
            return null;
        }
    }

    function findElement(selectors) {
        const specificSelectors = [SELECTORS.INPUT_TEXTAREA]; // No tiene botones de control genéricos
        if (typeof selectors === 'string') {
            const element = document.querySelector(selectors);
            if (element) return element;
        }
        const allSelectors = Array.isArray(selectors) ? [...specificSelectors, ...selectors] : specificSelectors;
        for (const selector of allSelectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    function createStylizedButton(text, onClick, iconHtml = null, customStyles = {}) {
        const button = document.createElement('button');
        button.className = `vectal-advanced-pro-btn`; // Custom class for styling
        button.innerHTML = iconHtml ? `<span class="icon">${iconHtml}</span> <span class="text">${text}</span>` : `<span class="text">${text}</span>`;
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        Object.assign(button.style, customStyles);
        return button;
    }

    function createCategorizedDropdown(categorizedOptions, onSelect, placeholder = "Seleccionar Prompt") {
        const selectWrapper = document.createElement('div');
        selectWrapper.className = 'vectal-advanced-pro-dropdown-wrapper';

        const select = document.createElement('select');
        select.className = 'vectal-advanced-pro-dropdown-select';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = placeholder;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        for (const category in categorizedOptions) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;
            categorizedOptions[category].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.text;
                option.textContent = opt.name;
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        }

        select.addEventListener('change', (event) => {
            if (event.target.value) {
                onSelect(event.target.value);
                event.target.value = "";
                setTimeout(() => {
                    defaultOption.selected = true;
                }, 0);
            }
        });
        selectWrapper.appendChild(select);

        const arrow = document.createElement('span');
        arrow.className = 'vectal-advanced-pro-dropdown-arrow';
        arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        selectWrapper.appendChild(arrow);

        return selectWrapper;
    }

    function getCurrentChatContent() {
        const chatContent = [];
        // ATENCIÓN: ESTOS SELECTORES NECESITAN SER ADAPTADOS PARA VECTAL.AI
        // Usa F12 para inspeccionar los elementos de mensaje en Vectal.ai.
        const allMessageContainers = document.querySelectorAll([
            // Por ejemplo, si todos los mensajes están en divs con 'data-message-id'
            // O si tienen clases distintivas como 'user-chat-bubble', 'ai-chat-bubble'
            SELECTORS.VECTAL_MESSAGES_CONTAINER
            // Añade más selectores si los mensajes de usuario y AI tienen estructuras distintas que no están bajo un contenedor común.
        ].join(','));

        allMessageContainers.forEach((container, index) => {
            let fullText = '';
            let messageType = 'Unknown'; // Asume Unknown, luego intenta determinar.

            // Intenta identificar si es un mensaje de usuario o de la IA
            // ADAPTAR AQUÍ: Necesitas identificar qué clase o estructura indica mensaje de usuario vs AI
            if (container.querySelector(SELECTORS.USER_MESSAGES_BUBBLE)) { // Por ejemplo, si hay una burbuja específica dentro
                messageType = 'Usuario';
            } else if (container.querySelector(SELECTORS.AI_MESSAGES_BUBBLE)) {
                messageType = 'Vectal AI';
            } else {
                // Fallback: si no se puede determinar por una burbuja, busca por alineación o por el remitente
                const alignmentCheck = container.querySelector('.text-right'); // Ejemplo: si los mensajes de usuario están alineados a la derecha
                if (alignmentCheck) messageType = 'Usuario';
                else messageType = 'Vectal AI'; // Asume que el resto son de la IA
            }


            // Extrae el texto principal del mensaje
            const textElements = container.querySelectorAll(SELECTORS.MESSAGE_TEXT_ELEMENT); // ATENCIÓN: AJUSTA ESTE SELECTOR
            if (textElements.length > 0) {
                 fullText += Array.from(textElements).map(el => el.innerText || el.textContent || '').join('\n').trim();
            } else {
                 // Si no se encuentra el selector específico, toma el texto directo del contenedor del mensaje
                 fullText += (container.innerText || container.textContent || '').trim();
            }


            // Extrae bloques de código si existen
            const codeElements = container.querySelectorAll(SELECTORS.CODE_BLOCKS); // ATENCIÓN: AJUSTA ESTE SELECTOR
            codeElements.forEach(codeEl => {
                const codeText = extractCleanCodeContent(codeEl);
                if (codeText && !fullText.includes(codeText)) {
                    // Intenta encontrar el lenguaje del código si hay un indicador (adaptar selector)
                    const languageIndicator = codeEl.closest(SELECTORS.CODE_CONTAINERS) // ATENCIÓN: AJUSTA ESTE SELECTOR
                        ?.querySelector('[data-testid="code-language-indicator"]'); // ATENCIÓN: AJUSTA ESTE SELECTOR
                    const language = languageIndicator?.textContent?.trim() || '';
                    fullText += `\n\`\`\`${language}\n${codeText}\n\`\`\`\n`;
                }
            });

            if (fullText.trim()) {
                chatContent.push({
                    type: messageType,
                    text: fullText.trim(),
                    timestamp: new Date().toISOString(),
                    index: index
                });
            }
        });

        console.log(`✅ Mensajes extraídos correctamente: ${chatContent.length}`);
        return chatContent;
    }


    function insertTextIntoTextarea(text) {
        const textarea = findElement(SELECTORS.INPUT_TEXTAREA);
        if (textarea) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(textarea, text);
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true })); // Algunos frameworks pueden escuchar 'change'
            textarea.focus();
            return true;
        }
        console.warn('⚠️ No se encontró el textarea');
        return false;
    }

    function handlePromptSelection(promptText) {
        if (!insertTextIntoTextarea(promptText)) {
            navigator.clipboard.writeText(promptText).then(() => {
                console.log('📋 Contenido copiado al portapapeles: ' + promptText);
            }).catch(() => {
                console.error('❌ No se pudo copiar el prompt al portapapeles. Inténtalo de nuevo.');
            });
        } else {
            console.log('✅ Prompt insertado en el textarea.');
        }
    }

    // --- JavaScript Executor (Textos actualizados) ---
    function openJSExecutorWindow() {
        console.log('⚡ === ABRIENDO EJECUTOR DE JAVASCRIPT ===');

        const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes,menubar=no,toolbar=no');

        if (!newWindow) {
            console.error('❌ El navegador bloqueó la ventana emergente. Permite ventanas emergentes para vectal.ai');
            return;
        }

        newWindow.document.open();
        newWindow.document.write('<!DOCTYPE html><html><head>');
        newWindow.document.write('<title>⚡ JavaScript Executor - Vectal Advanced Pro</title>');
        newWindow.document.write('<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">');

        const jsExecutorCSS = `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                background: linear-gradient(135deg, #0f0f14 0%, #1a1a1f 50%, #2a2a30 100%);
                color: #e0e0e0;
                line-height: 1.6;
                min-height: 100vh;
                overflow-x: hidden;
            }
            .header {
                background: linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #48cae4 100%);
                padding: 25px 20px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
                position: sticky;
                top: 0;
                z-index: 100;
            }
            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                color: white;
            }
            .controls-bar {
                background: #2a2a30;
                padding: 20px;
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
                border-bottom: 1px solid #404040;
            }
            .btn {
                background: #4a4a50;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            .btn-success { background: #10b981; }
            .btn-success:hover { background: #059669; }
            .btn-danger { background: #ef4444; }
            .btn-danger:hover { background: #dc2626; }
            .btn-warning { background: #f59e0b; }
            .btn-warning:hover { background: #d97706; }
            .btn-secondary { background: #6b7280; }
            .btn-secondary:hover { background: #4b5563; }
            .container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 20px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                height: calc(100vh - 140px);
            }
            .editor-panel, .output-panel {
                background: #1e1e1e;
                border: 1px solid #404040;
                border-radius: 12px;
                padding: 20px;
                display: flex;
                flex-direction: column;
            }
            .panel-header {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #6366f1;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .code-editor {
                flex: 1;
                background: #0d1117;
                border: 1px solid #30363d;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 14px;
                color: #c9d1d9;
                resize: none;
                outline: none;
                line-height: 1.5;
            }
            .output-area {
                flex: 1;
                background: #0d1117;
                border: 1px solid #30363d;
                border-radius: 8px;
                padding: 15px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 13px;
                color: #c9d1d9;
                overflow-y: auto;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .editor-controls {
                display: flex;
                gap: 10px;
                margin-top: 15px;
                flex-wrap: wrap;
            }
            .small-btn {
                padding: 8px 12px;
                font-size: 12px;
                border-radius: 6px;
            }
            .history-panel {
                grid-column: 1 / -1;
                max-height: 200px;
                overflow-y: auto;
                background: #1e1e1e;
                border: 1px solid #404040;
                border-radius: 12px;
                padding: 15px;
                margin-top: 20px;
            }
            .history-item {
                background: #2d2d30;
                border: 1px solid #404040;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .history-item:hover {
                border-color: #6366f1;
                background: #3a3a40;
            }
            .history-time {
                font-size: 11px;
                color: #888;
                margin-bottom: 5px;
            }
            .history-code {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 12px;
                color: #c9d1d9;
                background: #0d1117;
                padding: 8px;
                border-radius: 4px;
                max-height: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .log-entry {
                margin: 5px 0;
                padding: 5px 8px;
                border-radius: 4px;
                border-left: 3px solid #6366f1;
            }
            .log-error {
                background: rgba(239, 68, 68, 0.1);
                border-left-color: #ef4444;
                color: #fca5a5;
            }
            .log-warn {
                background: rgba(245, 158, 11, 0.1);
                border-left-color: #f59e0b;
                color: #fbbf24;
            }
            .log-info {
                background: rgba(59, 130, 246, 0.1);
                border-left-color: #3b82f6;
                color: #93c5fd;
            }
            .log-success {
                background: rgba(16, 185, 129, 0.1);
                border-left-color: #10b981;
                color: #6ee7b7;
            }
            @media (max-width: 1200px) {
                .container {
                    grid-template-columns: 1fr;
                    gap: 15px;
                }
            }
        `;

        newWindow.document.write('<style>' + jsExecutorCSS + '</style>');
        newWindow.document.write('</head><body>');

        newWindow.document.write('<div class="header">');
        newWindow.document.write('<h1>⚡ JavaScript Executor - Vectal Advanced Pro</h1>');
        newWindow.document.write('<div>Ejecuta código JavaScript directamente en la página principal de Vectal.ai</div>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="controls-bar">');
        newWindow.document.write('<button class="btn btn-success" onclick="executeCode()">▶️ Ejecutar Código</button>');
        newWindow.document.write('<button class="btn btn-warning" onclick="clearEditor()">🗑️ Limpiar Editor</button>');
        newWindow.document.write('<button class="btn btn-secondary" onclick="clearOutput()">📄 Limpiar Salida</button>');
        newWindow.document.write('<button class="btn btn-secondary" onclick="formatCode()">✨ Formatear Código</button>');
        newWindow.document.write('<button class="btn btn-danger" onclick="window.close()">❌ Cerrar</button>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="container">');

        newWindow.document.write('<div class="editor-panel">');
        newWindow.document.write('<div class="panel-header">📝 Editor de Código JavaScript</div>');
        newWindow.document.write('<textarea id="codeEditor" class="code-editor" placeholder="// Escribe tu código JavaScript aquí...\n// Ejemplos:\n// console.log(\'Hola mundo!\');\n// document.title = \'Nuevo título\';\n// alert(\'Código ejecutado!\');\n\nconsole.log(\'¡Ejecutor de JavaScript de Vectal listo!\');\ndocument.querySelector(\'body\').style.backgroundColor = \'#ff6b6b\';\nsetTimeout(() => {\n    document.querySelector(\'body\').style.backgroundColor = \'\';\n}, 2000);"></textarea>');
        newWindow.document.write('<div class="editor-controls">');
        newWindow.document.write('<button class="btn small-btn btn-success" onclick="executeCode()">▶️ Ejecutar</button>');
        newWindow.document.write('<button class="btn small-btn btn-secondary" onclick="saveToHistory()">💾 Guardar</button>');
        newWindow.document.write('<button class="btn small-btn btn-secondary" onclick="loadPreset(\'dom\')">[DOM] Preset</button>');
        newWindow.document.write('<button class="btn small-btn btn-secondary" onclick="loadPreset(\'style\')">[Style] Preset</button>');
        newWindow.document.write('<button class="btn small-btn btn-secondary" onclick="loadPreset(\'fetch\')">[Fetch] Preset</button>');
        newWindow.document.write('</div>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="output-panel">');
        newWindow.document.write('<div class="panel-header">📊 Salida y Logs</div>');
        newWindow.document.write('<div id="outputArea" class="output-area">⚡ Ejecutor de JavaScript de Vectal iniciado...\n\n📝 Escribe código en el editor y presiona "Ejecutar" para ver los resultados aquí.\n\n💡 Tips:\n- Los console.log() aparecerán aquí\n- Los errores se mostrarán en rojo\n- El código se ejecuta en la página principal de Vectal.ai\n</div>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="history-panel">');
        newWindow.document.write('<div class="panel-header">🕒 Historial de Código (click para cargar)</div>');
        newWindow.document.write('<div id="historyContainer">No hay código en el historial aún...</div>');
        newWindow.document.write('</div>');

        newWindow.document.write('</div>'); // End container

        // JavaScript funcional para el ejecutor
        const jsExecutorScript = newWindow.document.createElement('script');
        jsExecutorScript.textContent = `
            let executionHistory = JSON.parse(localStorage.getItem('vectal_js_history') || '[]'); // Clave de almacenamiento actualizada
            const parentWindow = window.opener;
            const outputArea = document.getElementById('outputArea');
            const codeEditor = document.getElementById('codeEditor');
            const historyContainer = document.getElementById('historyContainer');

            // Interceptar console.log para mostrarlos en nuestra ventana
            const originalConsole = parentWindow.console;
            let logBuffer = [];

            function addLogEntry(message, type = 'info') {
                const timestamp = new Date().toLocaleTimeString();
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry log-' + type;
                logEntry.innerHTML = '[' + timestamp + '] ' + message;

                // Add to buffer for our output
                logBuffer.push({
                    timestamp,
                    message,
                    type
                });

                updateOutput();
            }

            function updateOutput() {
                let output = logBuffer.map(entry =>
                    '[' + entry.timestamp + '] [' + entry.type.toUpperCase() + '] ' + entry.message
                ).join('\\n');

                if (!output) {
                    output = '⚡ Listo para ejecutar código en Vectal...\\n\\n💡 Los console.log() y errores aparecerán aquí.';
                }
                outputArea.textContent = output;
                outputArea.scrollTop = outputArea.scrollHeight;
            }

            function executeCode() {
                const code = codeEditor.value.trim();
                if (!code) {
                    addLogEntry('❌ No hay código para ejecutar', 'error');
                    return;
                }

                try {
                    addLogEntry('🚀 Ejecutando código...', 'info');

                    // Crear función para capturar console.log
                    const captureConsole = \`
                        const originalLog = console.log;
                        const originalError = console.error;
                        const originalWarn = console.warn;

                        console.log = function(...args) {
                            originalLog.apply(console, args);
                            if (window.jsExecutorCallback) {
                                window.jsExecutorCallback(args.join(' '), 'info');
                            }
                        };

                        console.error = function(...args) {
                            originalError.apply(console, args);
                            if (window.jsExecutorCallback) {
                                window.jsExecutorCallback(args.join(' '), 'error');
                            }
                        };

                        console.warn = function(...args) {
                            originalWarn.apply(console, args);
                            if (window.jsExecutorCallback) {
                                window.jsExecutorCallback(args.join(' '), 'warn');
                            }
                        };
                    \`;

                    // Inyectar callback en la ventana principal
                    parentWindow.jsExecutorCallback = (message, type) => {
                        addLogEntry(message, type);
                    };

                    // Ejecutar código en la ventana principal
                    parentWindow.eval(captureConsole);
                    const result = parentWindow.eval(code);

                    if (result !== undefined) {
                        addLogEntry('✅ Resultado: ' + JSON.stringify(result), 'success');
                    } else {
                        addLogEntry('✅ Código ejecutado correctamente', 'success');
                    }

                    // Guardar en historial
                    saveToHistory();

                } catch (error) {
                    addLogEntry('❌ Error: ' + error.message, 'error');
                    console.error('Error ejecutando código:', error);
                }
            }

            function clearEditor() {
                codeEditor.value = '';
                codeEditor.focus();
            }

            function clearOutput() {
                logBuffer = [];
                updateOutput();
            }

            function formatCode() {
                try {
                    const code = codeEditor.value;
                    // Formateo básico
                    const formatted = code
                        .replace(/;/g, ';\\n')
                        .replace(/{/g, '{\\n')
                        .replace(/}/g, '\\n}')
                        .replace(/\\n\\s*\\n/g, '\\n');
                    codeEditor.value = formatted;
                } catch (e) {
                    addLogEntry('⚠️ Error formateando código', 'warn');
                }
            }

            function saveToHistory() {
                const code = codeEditor.value.trim();
                if (!code) return;

                const historyItem = {
                    id: Date.now(),
                    code: code,
                    timestamp: new Date().toISOString(),
                    preview: code.substring(0, 100) + (code.length > 100 ? '...' : '')
                };

                executionHistory.unshift(historyItem);
                if (executionHistory.length > 20) {
                    executionHistory = executionHistory.slice(0, 20);
                }

                localStorage.setItem('vectal_js_history', JSON.stringify(executionHistory)); // Clave de almacenamiento actualizada
                updateHistoryDisplay();
                addLogEntry('💾 Código guardado en historial', 'info');
            }

            function loadFromHistory(id) {
                const item = executionHistory.find(h => h.id === id);
                if (item) {
                    codeEditor.value = item.code;
                    addLogEntry('📂 Código cargado desde historial', 'info');
                }
            }

            function updateHistoryDisplay() {
                if (executionHistory.length === 0) {
                    historyContainer.innerHTML = 'No hay código en el historial aún...';
                    return;
                }

                historyContainer.innerHTML = '';
                executionHistory.forEach(item => {
                    const historyDiv = document.createElement('div');
                    historyDiv.className = 'history-item';
                    historyDiv.onclick = () => loadFromHistory(item.id);

                    historyDiv.innerHTML = \`
                        <div class="history-time">\${new Date(item.timestamp).toLocaleString()}</div>
                        <div class="history-code">\${item.preview}</div>
                    \`;

                    historyContainer.appendChild(historyDiv);
                });
            }

            function loadPreset(type) {
                const presets = {
                    dom: \`// Manipular DOM
// Cambiar texto de un elemento
document.querySelector('h1')?.textContent = 'Texto cambiado';

// Crear nuevo elemento
const newDiv = document.createElement('div');
newDiv.textContent = 'Elemento creado por JS';
newDiv.style.cssText = 'background: #ff6b6b; color: white; padding: 10px; margin: 10px; border-radius: 5px;';
document.body.appendChild(newDiv);

// Eliminar después de 3 segundos
setTimeout(() => newDiv.remove(), 3000);\`,

                    style: \`// Cambiar estilos de la página
// Cambiar fondo del body
document.body.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';

// Aplicar efecto a todos los botones
document.querySelectorAll('button').forEach(btn => {
    btn.style.transform = 'scale(1.1)';
    btn.style.transition = 'all 0.3s ease';
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
});

// Restaurar después de 5 segundos
setTimeout(() => {
    document.body.style.background = '';
    document.querySelectorAll('button').forEach(btn => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
    });
}, 5000);\`,

                    fetch: \`// Hacer petición fetch
fetch('https://api.github.com/users/octocat')
    .then(response => response.json())
    .then(data => {
        console.log('Usuario GitHub:', data.name);
        console.log('Repositorios públicos:', data.public_repos);
        console.log('Seguidores:', data.followers);

        // Mostrar datos en la página
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = \\\`
            <h3>Información de GitHub</h3>
            <p>Nombre: \\\${data.name}</p>
            <p>Repos: \\\${data.public_repos}</p>
            <p>Seguidores: \\\${data.followers}</p>
        \\\`;
        infoDiv.style.cssText = 'background: #333; color: white; padding: 15px; margin: 10px; border-radius: 8px; position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(infoDiv);

        setTimeout(() => infoDiv.remove(), 8000);
    })
    .catch(error => console.error('Error:', error));\`
                };

                if (presets[type]) {
                    codeEditor.value = presets[type];
                    addLogEntry('📝 Preset "' + type + '" cargado', 'info');
                }
            }

            // Inicializar
            updateHistoryDisplay();
            updateOutput();

            // Atajos de teclado
            codeEditor.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    executeCode();
                }
            });

            // Focus automático
            window.addEventListener('load', () => {
                codeEditor.focus();
            });
        `;

        newWindow.document.body.appendChild(jsExecutorScript);
        newWindow.document.close();
        newWindow.focus();

        console.log('✅ Ejecutor de JavaScript abierto correctamente');
    }

    // --- Auto-Save System (Textos y claves actualizadas) ---
    function startAutoSave() {
        if (isAutoSaveActive) return;

        isAutoSaveActive = true;
        console.log('🔄 Iniciando autoguardado cada', CONFIG.AUTO_SAVE_INTERVAL / 1000, 'segundos');

        autoSaveInterval = setInterval(() => {
            const chatContent = getCurrentChatContent();
            if (chatContent.length > 0) {
                saveAutoChat(chatContent);
            }
        }, CONFIG.AUTO_SAVE_INTERVAL);
    }

    function stopAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
            isAutoSaveActive = false;
            console.log('⏹️ Autoguardado detenido');
        }
    }

    function saveAutoChat(chatContent) {
        try {
            const autoSaves = RobustStorage.getItem('auto_saves', []); // Clave de almacenamiento actualizada
            const timestamp = new Date().toISOString();

            let preview = 'Sin vista previa';
            if (chatContent && Array.isArray(chatContent) && chatContent.length > 0 && chatContent[0].text) {
                const firstMessage = chatContent[0].text;
                preview = firstMessage.length > 100 ? firstMessage.substring(0, 100) + '...' : firstMessage;
            }

            const autoSave = {
                id: Date.now(),
                timestamp,
                url: window.location.href,
                messageCount: chatContent.length,
                messages: chatContent,
                preview: preview,
                type: 'auto'
            };

            autoSaves.unshift(autoSave);
            if (autoSaves.length > CONFIG.MAX_AUTO_SAVES) {
                autoSaves.splice(CONFIG.MAX_AUTO_SAVES);
            }

            RobustStorage.setItem('auto_saves', autoSaves); // Clave de almacenamiento actualizada
            console.log('💾 Chat autoguardado:', timestamp, 'con', chatContent.length, 'mensajes');
            notifyAutoSaveWindow();

        } catch (error) {
            console.error('❌ Error autoguardando:', error);
            console.error('Error stack:', error.stack);
            console.error('Problema al procesar:', {
                chatContent: chatContent,
                chatContentLength: chatContent ? chatContent.length : 'undefined',
                firstMessageContent: chatContent && chatContent[0] ? chatContent[0].text : 'n/a'
            });
        }
    }

    function notifyAutoSaveWindow() {
        if (window.autoSaveWindows) {
            window.autoSaveWindows.forEach(win => {
                if (!win.closed) {
                    try {
                        win.postMessage({ action: 'refreshAutoSaves' }, window.location.origin);
                    } catch (e) {
                        console.warn('⚠️ Error notificando ventana autoguardado:', e);
                    }
                }
            });
        }
    }

    function openAutoSaveWindow() {
        console.log('🔄 === ABRIENDO VENTANA DE AUTOGUARDADO ===');

        const newWindow = window.open('', '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');

        if (!newWindow) {
            console.error('❌ El navegador bloqueó la ventana emergente. Permite ventanas emergentes para vectal.ai');
            return;
        }

        if (!window.autoSaveWindows) {
            window.autoSaveWindows = [];
        }
        window.autoSaveWindows.push(newWindow);

        const autoSaves = RobustStorage.getItem('auto_saves', []); // Clave de almacenamiento actualizada
        const manualSaves = RobustStorage.getItem('chats', []); // Clave de almacenamiento actualizada

        newWindow.document.open();
        newWindow.document.write('<!DOCTYPE html><html><head>');
        newWindow.document.write('<title>🔄 Auto-Guardado Vectal - Chats en Tiempo Real</title>'); // Título actualizado
        newWindow.document.write('<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">');

        const autoSaveCSS = `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background: linear-gradient(135deg, #0f0f14 0%, #1a1a1f 50%, #2a2a30 100%);
                color: white;
                line-height: 1.6;
                min-height: 100vh;
            }
            .header {
                background: linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%);
                padding: 25px 20px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
                position: sticky;
                top: 0;
                z-index: 100;
            }
            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                color: white;
            }
            .header .stats {
                font-size: 16px;
                opacity: 0.9;
                font-weight: 500;
            }
            .controls-bar {
                background: #2a2a30;
                padding: 20px;
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
                border-bottom: 1px solid #404040;
            }
            .btn {
                background: #4a4a50;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            .btn-success { background: #10b981; }
            .btn-success:hover { background: #059669; }
            .btn-danger { background: #ef4444; }
            .btn-danger:hover { background: #dc2626; }
            .btn-warning { background: #f59e0b; }
            .btn-warning:hover { background: #d97706; }
            .btn-secondary { background: #6b7280; }
            .btn-secondary:hover { background: #4b5563; }
            .container {
                max-width: 1300px;
                margin: 0 auto;
                padding: 20px;
            }
            .status-panel {
                background: #1e1e1e;
                border: 1px solid #404040;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }
            .status-item {
                text-align: center;
                padding: 15px;
                background: #2a2a30;
                border-radius: 8px;
                border: 1px solid #404040;
            }
            .status-number {
                font-size: 24px;
                font-weight: bold;
                color: #10b981;
                margin-bottom: 5px;
            }
            .status-label {
                font-size: 14px;
                color: #94a3b8;
            }
            .tabs {
                display: flex;
                background: #2a2a30;
                border-radius: 10px 10px 0 0;
                overflow: hidden;
            }
            .tab {
                flex: 1;
                padding: 15px 20px;
                background: #2a2a30;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
                border-bottom: 3px solid transparent;
            }
            .tab.active {
                background: #1e1e1e;
                color: #10b981;
                border-bottom-color: #10b981;
            }
            .tab:hover:not(.active) {
                background: #3a3a40;
                color: #e0e0e0;
            }
            .tab-content {
                background: #1e1e1e;
                border: 1px solid #404040;
                border-top: none;
                border-radius: 0 0 10px 10px;
                padding: 20px;
                min-height: 400px;
                max-height: 600px;
                overflow-y: auto;
            }
            .saves-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 15px;
            }
            .save-card {
                background: #2a2a30;
                border: 1px solid #404040;
                border-radius: 8px;
                padding: 15px;
                transition: all 0.3s ease;
                position: relative;
                cursor: pointer;
            }
            .save-card:hover {
                border-color: #10b981;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
            }
            .save-card.auto-save {
                border-left: 4px solid #10b981;
            }
            .save-card.manual-save {
                border-left: 4px solid #6366f1;
            }
            .save-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }
            .save-title {
                font-weight: bold;
                color: #e0e0e0;
                font-size: 16px;
                line-height: 1.2;
            }
            .save-type {
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 12px;
                font-weight: 600;
                text-transform: uppercase;
            }
            .save-type.auto {
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
            }
            .save-type.manual {
                background: rgba(99, 102, 241, 0.2);
                color: #6366f1;
            }
            .save-meta {
                font-size: 12px;
                color: #94a3b8;
                margin-bottom: 10px;
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            .save-preview {
                background: #1a1a1f;
                padding: 10px;
                border-radius: 5px;
                font-size: 13px;
                color: #cbd5e1;
                max-height: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
                position: relative;
            }
            .save-preview::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 15px;
                background: linear-gradient(transparent, #1a1a1f);
            }
            .save-actions {
                display: flex;
                gap: 8px;
                margin-top: 10px;
            }
            .action-btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
                transition: all 0.2s ease;
                text-align: center;
            }
            .view-btn {
                background: #6366f1;
                color: white;
            }
            .view-btn:hover {
                background: #5856eb;
            }
            .export-btn {
                background: #10b981;
                color: white;
            }
            .export-btn:hover {
                background: #059669;
            }
            .delete-btn {
                background: #ef4444;
                color: white;
            }
            .delete-btn:hover {
                background: #dc2626;
            }
            .empty-state {
                text-align: center;
                padding: 60px 20px;
                color: #94a3b8;
            }
            .empty-state h3 {
                font-size: 20px;
                margin-bottom: 10px;
                color: #6b7280;
            }
            .refresh-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 10px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1000;
            }
            .refresh-indicator.show {
                opacity: 1;
            }
            @media (max-width: 768px) {
                .saves-grid {
                    grid-template-columns: 1fr;
                }
                .status-panel {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;

        newWindow.document.write('<style>' + autoSaveCSS + '</style>');
        newWindow.document.write('</head><body>');

        newWindow.document.write('<div class="header">');
        newWindow.document.write('<h1>🔄 Auto-Guardado en Tiempo Real (Vectal)</h1>'); // Título actualizado
        newWindow.document.write('<div class="stats">Chats guardados automáticamente • Actualización en tiempo real</div>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="controls-bar">');
        newWindow.document.write('<button class="btn btn-success" onclick="toggleAutoSave()">🔄 Toggle Auto-Guardado</button>');
        newWindow.document.write('<button class="btn btn-warning" onclick="exportAllSaves()">📤 Exportar Todo</button>');
        newWindow.document.write('<button class="btn btn-secondary" onclick="refreshData()">🔃 Actualizar</button>');
        newWindow.document.write('<button class="btn btn-danger" onclick="clearAutoSaves()">🗑️ Limpiar Auto-Guardados</button>');
        newWindow.document.write('<button class="btn btn-secondary" onclick="window.close()">❌ Cerrar</button>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="container">');

        newWindow.document.write('<div class="status-panel">');
        newWindow.document.write('<div class="status-item">');
        newWindow.document.write('<div class="status-number" id="autoSaveCount">' + autoSaves.length + '</div>');
        newWindow.document.write('<div class="status-label">Auto-Guardados</div>');
        newWindow.document.write('</div>');
        newWindow.document.write('<div class="status-item">');
        newWindow.document.write('<div class="status-number" id="manualSaveCount">' + manualSaves.length + '</div>');
        newWindow.document.write('<div class="status-label">Guardados Manuales</div>');
        newWindow.document.write('</div>');
        newWindow.document.write('<div class="status-item">');
        newWindow.document.write('<div class="status-number" id="totalMessages">' + (autoSaves.reduce((sum, save) => sum + (save.messageCount || 0), 0) + manualSaves.reduce((sum, save) => sum + (save.messages?.length || 0), 0)) + '</div>');
        newWindow.document.write('<div class="status-label">Mensajes Totales</div>');
        newWindow.document.write('</div>');
        newWindow.document.write('<div class="status-item">');
        newWindow.document.write('<div class="status-number" id="autoSaveStatus">' + (isAutoSaveActive ? 'ON' : 'OFF') + '</div>');
        newWindow.document.write('<div class="status-label">Auto-Guardado</div>');
        newWindow.document.write('</div>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="tabs">');
        newWindow.document.write('<button class="tab active" onclick="switchTab(\'auto\')">🔄 Auto-Guardados (' + autoSaves.length + ')</button>');
        newWindow.document.write('<button class="tab" onclick="switchTab(\'manual\')">💾 Guardados Manuales (' + manualSaves.length + ')</button>');
        newWindow.document.write('<button class="tab" onclick="switchTab(\'all\')">📚 Todos (' + (autoSaves.length + manualSaves.length) + ')</button>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="tab-content">');
        newWindow.document.write('<div id="savesContainer" class="saves-grid"></div>');
        newWindow.document.write('</div>');

        newWindow.document.write('</div>'); // End container

        newWindow.document.write('<div id="refreshIndicator" class="refresh-indicator">🔄 Actualizando...</div>');

        const autoSaveScript = newWindow.document.createElement('script');
        autoSaveScript.textContent = `
            let currentTab = 'auto';
            let autoSaveData = ${JSON.stringify(autoSaves)};
            let manualSaveData = ${JSON.stringify(manualSaves)};
            let isAutoSaveOn = ${isAutoSaveActive};

            function escapeHTML(str) {
                const div = document.createElement('div');
                div.appendChild(document.createTextNode(str));
                return div.innerHTML;
            }

            function switchTab(tab) {
                currentTab = tab;

                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                event.target.classList.add('active');

                updateSavesDisplay();
            }

            function updateSavesDisplay() {
                const container = document.getElementById('savesContainer');
                let saves = [];

                switch(currentTab) {
                    case 'auto':
                        saves = autoSaveData.map(s => ({...s, type: 'auto'}));
                        break;
                    case 'manual':
                        saves = manualSaveData.map(s => ({...s, type: 'manual'}));
                        break;
                    case 'all':
                        saves = [
                            ...autoSaveData.map(s => ({...s, type: 'auto'})),
                            ...manualSaveData.map(s => ({...s, type: 'manual'}))
                        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        break;
                }

                if (saves.length === 0) {
                    container.innerHTML = '<div class="empty-state"><h3>📭 No hay guardados en esta categoría</h3><p>Los chats aparecerán aquí automáticamente</p></div>';
                    return;
                }

                container.innerHTML = '';
                saves.forEach((save, index) => {
                    const isAuto = save.type === 'auto';
                    const title = isAuto ?
                        'Auto-Guardado ' + new Date(save.timestamp).toLocaleTimeString() :
                        save.name || 'Chat Guardado';

                    const preview = save.preview ||
                        (save.messages && save.messages.length > 0 && save.messages[0]?.text
                            ? save.messages[0].text.substring(0, 100) + '...'
                            : 'Sin vista previa');

                    const messageCount = save.messageCount || save.messages?.length || 0;

                    const cardHTML = \`
                        <div class="save-card \${isAuto ? 'auto-save' : 'manual-save'}" data-index="\${index}" data-type="\${save.type}">
                            <div class="save-header">
                                <div class="save-title">\${escapeHTML(title)}</div>
                                <div class="save-type \${save.type}">\${save.type}</div>
                            </div>
                            <div class="save-meta">
                                <span>🕒 \${new Date(save.timestamp).toLocaleString()}</span>
                                <span>💬 \${messageCount} mensajes</span>
                                \${save.url ? \`<span>🔗 \${new URL(save.url).pathname}</span>\` : ''}
                            </div>
                            <div class="save-preview">\${escapeHTML(preview)}</div>
                            <div class="save-actions">
                                <button class="action-btn view-btn" onclick="viewSave('\${save.type}', \${index})">👁️ Ver</button>
                                <button class="action-btn export-btn" onclick="exportSave('\${save.type}', \${index})">📤 Exportar</button>
                                <button class="action-btn delete-btn" onclick="deleteSave('\${save.type}', \${index})">🗑️ Eliminar</button>
                            </div>
                        </div>
                    \`;

                    container.insertAdjacentHTML('beforeend', cardHTML);
                });
            }

            function viewSave(type, index) {
                const save = type === 'auto' ? autoSaveData[index] : manualSaveData[index];
                if (!save) return;

                const title = type === 'auto' ?
                    'Auto-Guardado ' + new Date(save.timestamp).toLocaleTimeString() :
                    save.name || 'Chat Guardado';

                const viewWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
                if (!viewWindow) {
                    console.error('❌ Ventana emergente bloqueada');
                    return;
                }

                viewWindow.document.open();
                viewWindow.document.write(\`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>\${escapeHTML(title)} - Vista Completa</title>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: system-ui, sans-serif; background: #1a1a1f; color: white; margin: 0; padding: 20px; line-height: 1.6; }
                        .header { background: #2a2a30; padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 2px solid #10b981; text-align: center; }
                        .header h1 { color: #10b981; margin-bottom: 10px; font-size: 24px; }
                        .header .meta { color: #94a3b8; font-size: 14px; }
                        .message { margin: 20px 0; padding: 18px; border-radius: 12px; max-width: 85%; word-wrap: break-word; white-space: pre-wrap; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
                        .user { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); margin-left: auto; text-align: right; }
                        .vectal-ai { background: linear-gradient(135deg, #374151 0%, #111827 100%); margin-right: auto; text-align: left; }
                        .type-label { font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 10px; opacity: 0.7; letter-spacing: 1px; }
                        .controls { position: fixed; top: 20px; right: 20px; background: rgba(42, 42, 48, 0.95); padding: 15px; border-radius: 10px; border: 1px solid #444; backdrop-filter: blur(10px); }
                        .control-btn { background: #10b981; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; margin: 0 5px 5px 0; font-size: 13px; transition: all 0.2s ease; }
                        .control-btn:hover { background: #059669; transform: translateY(-1px); }
                        .close-btn { background: #ef4444; } .close-btn:hover { background: #dc2626; }
                    </style>
                </head>
                <body>
                    <div class="controls">
                        <button class="control-btn close-btn" onclick="window.close()">❌ Cerrar</button>
                    </div>
                    <div class="header">
                        <h1>\${escapeHTML(title)}</h1>
                        <div class="meta">🕒 \${new Date(save.timestamp).toLocaleString()} • 💬 \${save.messageCount || save.messages?.length || 0} mensajes</div>
                    </div>
                    <div class="container" style="max-width: 900px; margin: 0 auto;">
                \`);

                const messages = save.messages || [];
                if (messages.length > 0) {
                    messages.forEach((msg, i) => {
                        const isUser = msg.type === 'Usuario'; // 'Usuario' en lugar de 'User'
                        const className = isUser ? 'user' : 'vectal-ai'; // Clase adaptada
                        const labelColor = isUser ? '#bfdbfe' : '#a7f3d0';

                        viewWindow.document.write(\`
                            <div class="message \${className}">
                                <div class="type-label" style="color: \${labelColor};">\${msg.type}</div>
                                <div>\${escapeHTML(msg.text)}</div>
                            </div>
                        \`);
                    });
                } else {
                    viewWindow.document.write('<div style="text-align: center; color: #94a3b8; padding: 60px 20px; font-size: 16px;">📭 Esta conversación no tiene mensajes</div>');
                }

                viewWindow.document.write('</div></body></html>');
                viewWindow.document.close();
                viewWindow.focus();
            }

            function exportSave(type, index) {
                const save = type === 'auto' ? autoSaveData[index] : manualSaveData[index];
                if (!save) return;

                const title = type === 'auto' ?
                    'Auto-Guardado ' + new Date(save.timestamp).toLocaleTimeString() :
                    save.name || 'Chat Guardado';

                let content = '=== ' + title + ' ===\\n';
                content += 'Fecha: ' + new Date(save.timestamp).toLocaleString() + '\\n';
                content += 'Tipo: ' + (type === 'auto' ? 'Auto-Guardado' : 'Guardado Manual') + '\\n';
                content += 'Mensajes: ' + (save.messageCount || save.messages?.length || 0) + '\\n\\n';

                const messages = save.messages || [];
                if (messages.length > 0) {
                    messages.forEach((msg, i) => {
                        content += '[' + (i + 1) + '] ' + msg.type + ':\\n';
                        content += msg.text + '\\n';
                        content += '============================================================\\n\\n';
                    });
                }

                const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'vectal_chat_' + title.replace(/[^a-zA-Z0-9\\s]/g, '_').replace(/\\s+/g, '_') + '_' + new Date().toISOString().slice(0,10) + '.txt'; // Nombre de archivo actualizado
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                showRefreshIndicator('✅ Exportado: ' + title);
            }

            function deleteSave(type, index) {
                const save = type === 'auto' ? autoSaveData[index] : manualSaveData[index];
                if (!save) return;

                const title = type === 'auto' ?
                    'Auto-Guardado ' + new Date(save.timestamp).toLocaleTimeString() :
                    save.name || 'Chat Guardado';

                if (confirm('⚠️ ¿Eliminar "' + title + '"?\\n\\nEsta acción no se puede deshacer.')) {
                    try {
                        if (type === 'auto') {
                            autoSaveData.splice(index, 1);
                            localStorage.setItem('vectal_auto_saves', JSON.stringify(autoSaveData)); // Clave actualizada
                        } else {
                            manualSaveData.splice(index, 1);
                            localStorage.setItem('vectal_chats', JSON.stringify(manualSaveData)); // Clave actualizada
                        }

                        updateStats();
                        updateSavesDisplay();
                        showRefreshIndicator('🗑️ Eliminado: ' + title);
                    } catch (error) {
                        console.error('❌ Error al eliminar: ' + error.message);
                    }
                }
            }

            function toggleAutoSave() {
                try {
                    if (window.opener && !window.opener.closed) {
                        if (isAutoSaveOn) {
                            window.opener.postMessage({ action: 'stopAutoSave' }, window.location.origin);
                            isAutoSaveOn = false;
                            showRefreshIndicator('⏹️ Auto-guardado desactivado');
                        } else {
                            window.opener.postMessage({ action: 'startAutoSave' }, window.location.origin);
                            isAutoSaveOn = true;
                            showRefreshIndicator('▶️ Auto-guardado activado');
                        }
                        updateStats();
                    }
                } catch (error) {
                        console.error('❌ Error al comunicarse con la ventana principal: ' + error.message);
                }
            }

            function exportAllSaves() {
                const allSaves = [...autoSaveData, ...manualSaveData];
                if (allSaves.length === 0) {
                    console.warn('❌ No hay guardados para exportar');
                    return;
                }

                let content = '=== EXPORTACIÓN COMPLETA - VECTAL ADVANCED PRO AUTO-GUARDADO ===\\n'; // Texto actualizado
                content += 'Fecha de exportación: ' + new Date().toLocaleString() + '\\n';
                content += 'Auto-guardados: ' + autoSaveData.length + '\\n';
                content += 'Guardados manuales: ' + manualSaveData.length + '\\n';
                content += 'Total: ' + allSaves.length + '\\n\\n';
                content += '================================================================================\\n\\n';

                allSaves.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                allSaves.forEach((save, saveIndex) => {
                    const isAuto = autoSaveData.includes(save);
                    const title = isAuto ?
                        'Auto-Guardado ' + new Date(save.timestamp).toLocaleTimeString() :
                        save.name || 'Chat Guardado';

                    content += '[' + (isAuto ? 'AUTO' : 'MANUAL') + ' - ' + (saveIndex + 1) + '] ' + title + '\\n';
                    content += 'Fecha: ' + new Date(save.timestamp).toLocaleString() + '\\n';
                    content += 'Mensajes: ' + (save.messageCount || save.messages?.length || 0) + '\\n\\n';

                    const messages = save.messages || [];
                    if (messages.length > 0) {
                        messages.forEach((msg, msgIndex) => {
                            content += '  [' + (msgIndex + 1) + '] ' + msg.type + ':\\n';
                            content += '  ' + msg.text.replace(/\\n/g, '\\n  ') + '\\n\\n';
                        });
                    }
                    content += '================================================================================\\n\\n';
                });

                const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'vectal_complete_backup_' + new Date().toISOString().slice(0,19).replace(/[:.]/g, '-') + '.txt'; // Nombre de archivo actualizado
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                showRefreshIndicator('✅ Exportación completa realizada (' + allSaves.length + ' guardados)');
            }

            function clearAutoSaves() {
                if (confirm('⚠️ ¿ELIMINAR TODOS LOS AUTO-GUARDADOS?\\n\\nEsta acción es PERMANENTE y eliminará:\\n\\n📊 ' + autoSaveData.length + ' auto-guardados\\n\\n¿Estás completamente seguro?')) {
                    try {
                        localStorage.removeItem('vectal_auto_saves'); // Clave actualizada
                        autoSaveData = [];
                        updateStats();
                        updateSavesDisplay();
                        showRefreshIndicator('🗑️ Todos los auto-guardados eliminados');
                    } catch (error) {
                        console.error('❌ Error: ' + error.message);
                    }
                }
            }

            function refreshData() {
                try {
                    autoSaveData = JSON.parse(localStorage.getItem('vectal_auto_saves') || '[]'); // Clave actualizada
                    manualSaveData = JSON.parse(localStorage.getItem('vectal_chats') || '[]'); // Clave actualizada
                    updateStats();
                    updateSavesDisplay();
                    showRefreshIndicator('🔄 Datos actualizados');
                } catch (error) {
                    console.error('❌ Error actualizando: ' + error.message);
                }
            }

            function updateStats() {
                document.getElementById('autoSaveCount').textContent = autoSaveData.length;
                document.getElementById('manualSaveCount').textContent = manualSaveData.length;
                document.getElementById('totalMessages').textContent =
                    autoSaveData.reduce((sum, save) => sum + (save.messageCount || 0), 0) +
                    manualSaveData.reduce((sum, save) => sum + (save.messages?.length || 0), 0);
                document.getElementById('autoSaveStatus').textContent = isAutoSaveOn ? 'ON' : 'OFF';

                document.querySelectorAll('.tab').forEach((tab, index) => {
                    switch(index) {
                        case 0:
                            tab.textContent = '🔄 Auto-Guardados (' + autoSaveData.length + ')';
                            break;
                        case 1:
                            tab.textContent = '💾 Guardados Manuales (' + manualSaveData.length + ')';
                            break;
                        case 2:
                            tab.textContent = '📚 Todos (' + (autoSaveData.length + manualSaveData.length) + ')';
                            break;
                    }
                });
            }

            function showRefreshIndicator(message) {
                const indicator = document.getElementById('refreshIndicator');
                indicator.textContent = message;
                indicator.classList.add('show');
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 3000);
            }

            window.addEventListener('message', (event) => {
                if (event.origin !== window.location.origin) return;

                if (event.data && event.data.action === 'refreshAutoSaves') {
                    refreshData();
                }
            });

            setInterval(refreshData, 10000); // Cada 10 segundos

            window.addEventListener('load', () => {
                document.body.focus();
                showRefreshIndicator('🔄 Auto-guardado iniciado - Actualizaciones en tiempo real');
            });
        `;

        newWindow.document.body.appendChild(autoSaveScript);
        newWindow.document.close();
        newWindow.focus();

        console.log('✅ Ventana de autoguardado abierta correctamente');
    }

    // --- Core Chat Management Functions (Textos y claves actualizadas) ---
    function saveCurrentChat() {
        const chatContent = getCurrentChatContent();
        if (chatContent.length === 0) {
            console.warn('❌ No hay conversación para guardar. Asegúrate de que hay mensajes en el chat.');
            return;
        }
        const chatName = prompt("💾 Introduce un nombre para esta conversación en Vectal:", `Chat Vectal ${new Date().toLocaleString()}`); // Texto actualizado
        if (chatName && chatName.trim()) {
            try {
                const savedChats = RobustStorage.getItem('chats', []); // Clave actualizada
                const newChat = {
                    name: chatName.trim(),
                    timestamp: new Date().toISOString(),
                    messages: chatContent,
                    messageCount: chatContent.length,
                    url: window.location.href
                };
                savedChats.push(newChat);
                RobustStorage.setItem('chats', savedChats); // Clave actualizada
                console.log(`✅ Conversación Vectal "${chatName}" guardada con éxito. ${chatContent.length} mensajes guardados.`); // Texto actualizado
            } catch (e) {
                console.error("❌ Error al guardar:", e);
                console.error("❌ Error al guardar la conversación: " + e.message);
            }
        }
    }

    function exportChatToText() {
        const chatContent = getCurrentChatContent();
        if (chatContent.length === 0) {
            console.warn('❌ No se encontraron mensajes para exportar.');
            return;
        }
        try {
            let exportText = `=== Conversación Vectal Advanced Pro ===\n`; // Texto actualizado
            exportText += `Fecha: ${new Date().toLocaleString()}\n`;
            exportText += `URL: ${window.location.href}\n`;
            exportText += `Mensajes: ${chatContent.length}\n\n`;
            chatContent.forEach((msg, index) => {
                exportText += `[${index + 1}] ${msg.type}:\n`;
                exportText += `${msg.text}\n\n`;
                exportText += `${'='.repeat(80)}\n\n`;
            });
            const blob = new Blob([exportText], { type: 'text/plain; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vectal_chat_${new Date().toISOString().slice(0,19).replace(/[:.]/g, '-')}.txt`; // Nombre de archivo actualizado
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log(`✅ Conversación exportada exitosamente. ${chatContent.length} mensajes exportados.`);
        } catch (error) {
            console.error('❌ Error al exportar:', error);
            console.error('❌ Error al exportar la conversación: ' + error.message);
        }
    }

    // --- File Import Functions (Texto del botón actualizado) ---
    function loadTesseractJs() { return new Promise((resolve, reject) => { if (window.Tesseract) { resolve(); return; } console.log("📷 Cargando Tesseract.js para OCR..."); const script = document.createElement('script'); script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"; script.onload = () => window.Tesseract ? resolve() : reject(new Error("Tesseract.js no disponible")); script.onerror = reject; document.head.appendChild(script); }); }
    function loadPdfJs() { return new Promise((resolve, reject) => { if (window.pdfjsLib) { resolve(); return; } console.log("📄 Cargando PDF.js..."); const script = document.createElement('script'); script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js"; script.onload = () => { if (window.pdfjsLib) { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js"; resolve(); } else { reject(new Error("PDF.js no disponible")); } }; script.onerror = reject; document.head.appendChild(script); }); }
    function loadMammothJs() { return new Promise((resolve, reject) => { if (window.mammoth) { resolve(); return; } console.log("📝 Cargando Mammoth.js para DOCX..."); const script = document.createElement('script'); script.src = "https://unpkg.com/mammoth/mammoth.browser.min.js"; script.onload = () => window.mammoth ? resolve() : reject(new Error("Mammoth.js no disponible")); script.onerror = reject; document.head.appendChild(script); }); }
    function readFileAsText(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = (e) => resolve(e.target.result); reader.onerror = reject; reader.readAsText(file); }); }
    async function extractTextFromPdf(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = async (e) => { try { const typedarray = new Uint8Array(e.target.result); const loadingTask = window.pdfjsLib.getDocument({ data: typedarray }); const pdf = await loadingTask.promise; let text = ''; for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) { const page = await pdf.getPage(pageNum); const content = await page.getTextContent(); text += content.items.map(item => item.str).join(' ') + '\n'; } resolve(text); } catch (err) { reject(new Error(`Error al procesar PDF: ${err.message}`)); } }; reader.onerror = reject; reader.readAsArrayBuffer(file); }); }
    async function extractTextFromDocx(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = async (e) => { try { const arrayBuffer = e.target.result; const result = await mammoth.extractRawText({ arrayBuffer }); resolve(result.value.trim()); } catch (err) { reject(new Error(`Error al procesar DOCX: ${err.message}`)); } }; reader.onerror = reject; reader.readAsArrayBuffer(file); }); }

    async function processDroppedFiles(files) {
        const textarea = findElement(SELECTORS.INPUT_TEXTAREA);
        if (!textarea) {
            console.error('❌ No se encontró el área de texto');
            return;
        }
        let allContent = '';
        // Find the import button specifically for updating its text/icon during processing
        const importButtonTextSpan = document.querySelector('#vectal-import-button .text'); // ID actualizado
        const originalButtonText = importButtonTextSpan ? importButtonTextSpan.textContent : 'Importar';

        const updateButtonStatus = (text) => {
            if (importButtonTextSpan) {
                importButtonTextSpan.textContent = text;
            }
        };

        for (const file of files) {
            const textExtensions = new Set(['txt', 'html', 'htm', 'css', 'js', 'json', 'csv', 'xml', 'md', 'log', 'yaml', 'yml', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'go', 'php', 'rb', 'sh', 'bat', 'ps1', 'ini', 'cfg', 'conf', 'rs', 'ts', 'jsx', 'tsx', 'vue']);
            const imageExtensions = new Set(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp']);
            const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
            const isTextFile = textExtensions.has(fileExt) || file.type.startsWith('text/');
            const isImage = imageExtensions.has(fileExt) || file.type.startsWith('image/');
            const isPdf = fileExt === 'pdf' || file.type === 'application/pdf';
            const isDocx = fileExt === 'docx' || file.type.includes('wordprocessingml');
            try {
                if (allContent) allContent += `\n\n--- ${file.name} ---\n\n`;
                if (isTextFile) {
                    const content = await readFileAsText(file);
                    allContent += content;
                }
                else if (isImage) {
                    updateButtonStatus(`OCR ${file.name}...`);
                    await loadTesseractJs();
                    const { data: { text } } = await Tesseract.recognize(file, 'spa+eng', {
                        logger: m => {
                            if (m.status === 'recognizing') {
                                updateButtonStatus(`OCR ${file.name}: ${Math.round(m.progress * 100)}%`);
                            }
                        }
                    });
                    allContent += text.trim();
                }
                else if (isPdf) {
                    updateButtonStatus(`PDF ${file.name}...`);
                    await loadPdfJs();
                    const text = await extractTextFromPdf(file);
                    allContent += text.trim();
                }
                else if (isDocx) {
                    updateButtonStatus(`DOCX ${file.name}...`);
                    await loadMammothJs();
                    const text = await extractTextFromDocx(file);
                    allContent += text;
                }
                else {
                    console.warn(`⚠️ Tipo de archivo no soportado: ${file.name}`);
                    continue;
                }
            } catch (error) {
                console.error(`❌ Error procesando ${file.name}:`, error);
            }
        }
        updateButtonStatus(originalButtonText); // Restore original button text
        if (allContent.trim()) {
            insertTextIntoTextarea(textarea.value + (textarea.value ? '\n\n' : '') + allContent);
        }
    }

    function createImportButton() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = `.txt,.html,.htm,.css,.js,.json,.csv,.xml,.md,.log,.yaml,.yml,.py,.java,.c,.cpp,.h,.hpp,.go,.php,.rb,.sh,.bat,.ps1,.ini,.cfg,.conf,.rs,.ts,.jsx,.tsx,.vue,.png,.jpg,.jpeg,.bmp,.gif,.webp,.pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/*,application/json,application/xml,application/javascript,image/*`.replace(/\s/g, '');
        fileInput.style.display = 'none';

        const importButton = createStylizedButton('Importar', () => fileInput.click(), ICON_SVG.UPLOAD);
        importButton.id = 'vectal-import-button'; // ID actualizado

        ['dragover', 'dragenter'].forEach(eventName => {
            importButton.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                importButton.classList.add('drag-active'); // Add a class for drag styles
            });
        });
        ['dragleave', 'dragend'].forEach(eventName => {
            importButton.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                importButton.classList.remove('drag-active');
            });
        });
        importButton.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            importButton.classList.remove('drag-active');
            if (e.dataTransfer.files.length > 0) {
                processDroppedFiles(e.dataTransfer.files);
            }
        });
        fileInput.addEventListener('change', (event) => {
            if (event.target.files.length > 0) {
                processDroppedFiles(event.target.files);
                event.target.value = '';
            }
        });
        document.body.appendChild(fileInput); // Append hidden input to body
        return importButton;
    }

    function setupCharacterCounter() {
        const textarea = findElement(SELECTORS.INPUT_TEXTAREA);
        if (!textarea) return;
        if (document.getElementById('vectal-char-counter')) return; // ID actualizado

        const counter = document.createElement('div');
        counter.id = 'vectal-char-counter'; // ID actualizado
        // Add basic inline styles, can be overridden by GM_addStyle
        counter.style.cssText = `
            position: absolute; bottom: 8px; right: 12px; font-size: 11px;
            color: #888; background: rgba(0,0,0,0.7); padding: 2px 6px;
            border-radius: 4px; pointer-events: none; z-index: 1000;
        `;

        // Busca el padre más cercano que sea un div y tenga position:relative o se lo pueda dar
        let counterWrapper = textarea.closest('div.relative');
        if (!counterWrapper) {
            // Si no hay un padre con 'relative', usa el padre inmediato y hazlo relative
            counterWrapper = textarea.parentElement;
            if (counterWrapper && getComputedStyle(counterWrapper).position === 'static') {
                counterWrapper.style.position = 'relative';
            }
        }

        if (counterWrapper) {
            counterWrapper.appendChild(counter);
        } else {
            console.warn('Could not find a suitable wrapper for the character counter, appending to body.');
            document.body.appendChild(counter);
        }

        const updateCounter = () => {
            const text = textarea.value;
            const chars = text.length;
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            counter.textContent = `${chars} chars | ${words} words`;
        };
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    }

    // --- Floating UI Creation and Drag Logic (Textos y claves actualizadas) ---
    let floatingContainer = null;
    let isDragging = false;
    let offsetX, offsetY;

    function savePosition(x, y) {
        RobustStorage.setItem('floating_ui_pos', { x, y }); // Clave actualizada
    }

    function loadPosition() {
        const savedPos = RobustStorage.getItem('floating_ui_pos'); // Clave actualizada
        if (savedPos) {
            return { x: savedPos.x, y: savedPos.y };
        }
        return { x: CONFIG.FLOATING_UI_INITIAL_POS_X, y: CONFIG.FLOATING_UI_INITIAL_POS_Y };
    }

    function toggleFloatingUI() {
        if (floatingContainer) {
            const isHidden = floatingContainer.classList.toggle('hidden-ui');
            RobustStorage.setItem('floating_ui_hidden', isHidden); // Clave actualizada
            // Update the toggle button text
            const toggleButton = document.getElementById('vectal-toggle-ui-button'); // ID actualizado
            if (toggleButton && toggleButton.querySelector('.text')) {
                toggleButton.querySelector('.text').textContent = isHidden ? 'Mostrar UI' : 'Ocultar UI';
            }
        }
    }

    function addControlsToFloatingUI() {
        if (document.getElementById('vectal-floating-container')) { // ID actualizado
            console.log('Floating UI already exists.');
            return;
        }

        floatingContainer = document.createElement('div');
        floatingContainer.id = 'vectal-floating-container'; // ID actualizado
        floatingContainer.className = 'vectal-advanced-pro-floating-container'; // Clase actualizada

        const savedHiddenState = RobustStorage.getItem('floating_ui_hidden', false); // Clave actualizada
        if (savedHiddenState) {
            floatingContainer.classList.add('hidden-ui');
        }

        const initialPos = loadPosition();
        floatingContainer.style.left = `${initialPos.x}px`;
        floatingContainer.style.top = `${initialPos.y}px`;

        // Make draggable
        const header = document.createElement('div');
        header.className = 'vectal-advanced-pro-header'; // Clase actualizada
        header.textContent = '🛠️ Vectal Advanced Pro'; // Texto actualizado
        header.style.cursor = 'grab'; // Indicate it's draggable
        floatingContainer.appendChild(header);

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - floatingContainer.getBoundingClientRect().left;
            offsetY = e.clientY - floatingContainer.getBoundingClientRect().top;
            floatingContainer.style.cursor = 'grabbing';
            floatingContainer.style.userSelect = 'none'; // Prevent text selection during drag
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Boundary checks
            newX = Math.max(0, Math.min(newX, window.innerWidth - floatingContainer.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - floatingContainer.offsetHeight));

            floatingContainer.style.left = `${newX}px`;
            floatingContainer.style.top = `${newY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                floatingContainer.style.cursor = 'grab';
                floatingContainer.style.userSelect = 'auto'; // Re-enable text selection
                savePosition(
                    parseFloat(floatingContainer.style.left),
                    parseFloat(floatingContainer.style.top)
                );
            }
        });

        // Controls container inside floating UI
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'vectal-advanced-pro-controls-panel'; // Clase actualizada

        // Dropdown for prompts
        const promptsDropdown = createCategorizedDropdown(ALL_CATEGORIZED_PROMPTS, handlePromptSelection, "🎯 Seleccionar Prompt");
        controlsPanel.appendChild(promptsDropdown);

        // Buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'vectal-advanced-pro-buttons-grid'; // Clase actualizada

        buttonsContainer.appendChild(createStylizedButton('Guardar Chat', saveCurrentChat, ICON_SVG.DOWNLOAD));
        buttonsContainer.appendChild(createStylizedButton('Cargar Chats', loadSavedChatsMain, ICON_SVG.DOWNLOAD));
        buttonsContainer.appendChild(createStylizedButton('Exportar Chat', exportChatToText, ICON_SVG.DOWNLOAD));
        buttonsContainer.appendChild(createImportButton()); // This creates its own button and hidden input
        buttonsContainer.appendChild(createStylizedButton('JS Executor', openJSExecutorWindow, ICON_SVG.CODE));
        buttonsContainer.appendChild(createStylizedButton('Auto-Guardado', openAutoSaveWindow, ICON_SVG.AUTO_SAVE));

        controlsPanel.appendChild(buttonsContainer);
        floatingContainer.appendChild(controlsPanel);

        // Toggle UI button (always visible, outside the main panel, at the bottom of floatingContainer)
        const toggleButton = createStylizedButton(savedHiddenState ? 'Mostrar UI' : 'Ocultar UI', toggleFloatingUI, ICON_SVG.TOGGLE);
        toggleButton.id = 'vectal-toggle-ui-button'; // ID actualizado
        toggleButton.classList.add('vectal-advanced-pro-toggle-button'); // Clase actualizada
        floatingContainer.appendChild(toggleButton);


        document.body.appendChild(floatingContainer);
        console.log('✅ Interfaz flotante y arrastrable creada para Vectal.'); // Texto actualizado
    }

    // --- Chat Manager (Textos y claves actualizadas) ---
    function loadSavedChatsMain() {
        console.log('📂 === CARGANDO CHATS EN NUEVA VENTANA (MÉTODO ROBUSTO) ===');
        try {
            const savedChats = RobustStorage.getItem('chats', []); // Clave actualizada
            if (!savedChats || savedChats.length === 0) {
                console.warn('📂 No hay conversaciones guardadas. Primero guarda una conversación con "💾 Guardar Chat".');
                return;
            }
            openChatsManagerWindow(savedChats);
        } catch (error) {
            console.error('❌ Error en loadSavedChatsMain:', error);
        }
    }

    function openChatsManagerWindow(savedChats) {
        console.log('🪟 === ABRIENDO GESTOR DE CHATS EN NUEVA VENTANA ===');

        const newWindow = window.open('', '_blank', 'width=1300,height=900,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no');

        if (!newWindow) {
            console.error('❌ El navegador bloqueó la ventana emergente. Permite ventanas emergentes para vectal.ai o usa Ctrl+Click en el botón "📂 Cargar Chat"'); // Texto actualizado
            return;
        }

        newWindow.document.open();
        newWindow.document.write('<!DOCTYPE html><html><head>');
        newWindow.document.write('<title>📚 Vectal Advanced Pro - Gestor de Conversaciones (' + savedChats.length + ' conversaciones)</title>'); // Título actualizado
        newWindow.document.write('<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">');

        const cssContent = `
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #0f0f14 0%, #1a1a1f 50%, #2a2a30 100%); color: white; line-height: 1.6; min-height: 100vh; overflow-x: hidden; }
            .header { background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3); position: sticky; top: 0; z-index: 100; }
            .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            .header .stats { font-size: 16px; opacity: 0.9; font-weight: 500; }
            .controls-bar { background: #2a2a30; padding: 20px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; border-bottom: 1px solid #404040; }
            .btn { background: #4a4a50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            .btn-primary { background: #6366f1; } .btn-primary:hover { background: #5856eb; }
            .btn-success { background: #10b981; } .btn-success:hover { background: #059669; }
            .btn-danger { background: #ef4444; } .btn-danger:hover { background: #dc2626; }
            .btn-warning { background: #f59e0b; } .btn-warning:hover { background: #d97706; }
            .container { max-width: 1200px; margin: 0 auto; padding: 30px 20px; }
            .chats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-top: 20px; }
            .chat-card { background: linear-gradient(145deg, #2a2a30 0%, #1f1f24 100%); border: 1px solid #404040; border-radius: 12px; padding: 20px; transition: all 0.3s ease; position: relative; overflow: hidden; }
            .chat-card:hover { transform: translateY(-5px); border-color: #6366f1; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2); }
            .chat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899); }
            .chat-name { font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 10px; word-wrap: break-word; line-height: 1.4; }
            .chat-meta { color: #94a3b8; font-size: 13px; margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
            .chat-preview { background: #1a1a1f; padding: 12px; border-radius: 8px; border-left: 3px solid #6366f1; margin: 15px 0; font-size: 13px; color: #cbd5e1; max-height: 80px; overflow: hidden; position: relative; }
            .chat-preview::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 20px; background: linear-gradient(transparent, #1a1a1f); }
            .chat-actions { display: flex; gap: 10px; margin-top: 15px; }
            .action-btn { flex: 1; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s ease; text-align: center; }
            .view-btn { background: #6366f1; color: white; } .view-btn:hover { background: #5856eb; }
            .delete-btn { background: #ef4444; color: white; } .delete-btn:hover { background: #dc2626; }
            .export-btn { background: #10b981; color: white; } .export-btn:hover { background: #059669; }
            .empty-state { text-align: center; padding: 60px 20px; color: #94a3b8; }
            .empty-state h2 { font-size: 24px; margin-bottom: 15px; color: #6366f1; }
            @media (max-width: 768px) { .chats-grid { grid-template-columns: 1fr; } .controls-bar { flex-direction: column; align-items: center; } }
        `;
        newWindow.document.write('<style>' + cssContent + '</style>');
        newWindow.document.write('</head><body>');

        newWindow.document.write('<div class="header">');
        newWindow.document.write('<h1>📚 Gestor de Conversaciones Vectal Advanced Pro</h1>'); // Título actualizado
        newWindow.document.write('<div class="stats">💬 ' + savedChats.length + ' conversaciones guardadas • 📊 ' + savedChats.reduce((total, chat) => total + (chat.messages?.length || 0), 0) + ' mensajes totales</div>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="controls-bar">');
        newWindow.document.write('<button class="btn btn-success" onclick="exportAllChats()">📤 Exportar Todas las Conversaciones</button>');
        newWindow.document.write('<button class="btn btn-warning" onclick="refreshFromParent()">🔄 Actualizar Lista</button>');
        newWindow.document.write('<button class="btn btn-danger" onclick="clearAllChats()">🗑️ Eliminar Todas</button>');
        newWindow.document.write('<button class="btn btn-primary" onclick="window.close()">❌ Cerrar Ventana</button>');
        newWindow.document.write('</div>');

        newWindow.document.write('<div class="container">');

        if (savedChats.length === 0) {
            newWindow.document.write('<div class="empty-state"><h2>📂 No hay conversaciones guardadas</h2><p>Regresa a Vectal.ai y usa el botón <strong>"💾 Guardar Chat"</strong> para guardar tu conversación actual.</p></div>'); // Texto actualizado
        } else {
            newWindow.document.write('<div class="chats-grid">');

            savedChats.forEach((chat, index) => {
                const previewText = chat.messages && chat.messages.length > 0 && chat.messages[0]?.text
                    ? (chat.messages[0].text.length > 150
                        ? chat.messages[0].text.substring(0, 150) + '...'
                        : (chat.messages[0].text || 'Sin contenido de vista previa'))
                    : 'Sin contenido de vista previa';

                const safeChatName = escapeHTML(chat.name);
                const safePreviewText = escapeHTML(previewText);

                newWindow.document.write('<div class="chat-card" data-chat-index="' + index + '">');
                newWindow.document.write('<div class="chat-name">' + safeChatName + '</div>');
                newWindow.document.write('<div class="chat-meta">');
                newWindow.document.write('<span>🕒 ' + new Date(chat.timestamp).toLocaleString() + '</span>');
                newWindow.document.write('<span>💬 ' + (chat.messages?.length || 0) + ' mensajes</span>');
                newWindow.document.write('</div>');
                newWindow.document.write('<div class="chat-preview">' + safePreviewText + '</div>');
                newWindow.document.write('<div class="chat-actions">');
                newWindow.document.write('<button class="action-btn view-btn" onclick="viewChat(' + index + ')">👁️ Ver Completo</button>');
                newWindow.document.write('<button class="action-btn export-btn" onclick="exportSingleChat(' + index + ')">📤 Exportar</button>');
                newWindow.document.write('<button class="action-btn delete-btn" onclick="deleteChat(' + index + ')">🗑️ Eliminar</button>');
                newWindow.document.write('</div>');
                newWindow.document.write('</div>');
            });

            newWindow.document.write('</div>');
        }
        newWindow.document.write('</div>'); // End container

        const scriptElement = newWindow.document.createElement('script');
        scriptElement.textContent = `
            let savedChatsData = ${JSON.stringify(savedChats)};
            const parentOrigin = '${window.location.origin}';

            function escapeHTML(str) {
                if (!str) return '';
                const div = document.createElement('div');
                div.appendChild(document.createTextNode(str));
                return div.innerHTML;
            }

            function getFormattedTime(timestamp) {
                return new Date(timestamp).toLocaleString();
            }

            function getChatPreview(chat) {
                if (!chat.messages || chat.messages.length === 0) return 'Sin contenido de vista previa';

                for (const msg of chat.messages) {
                    if (msg.text && msg.text.trim()) {
                        return msg.text.trim().substring(0, 150) +
                               (msg.text.length > 150 ? '...' : '');
                    }
                }
                return 'Sin contenido de vista previa';
            }

            function viewChat(index) {
                const chat = savedChatsData[index];
                if (!chat) return;

                const viewWindow = window.open('', 'chat_view_' + index, 'width=800,height=700,scrollbars=yes,resizable=yes');
                if (!viewWindow) {
                    console.error('❌ No se pudo abrir la ventana de visualización');
                    return;
                }

                viewWindow.document.open();
                viewWindow.document.write('<!DOCTYPE html><html><head>');
                viewWindow.document.write('<title>👁️ Vista Completa: ' + escapeHTML(chat.name) + '</title>');
                viewWindow.document.write('<style>');
                viewWindow.document.write('body { background: #1a1a1f; color: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 20px; line-height: 1.6; }');
                viewWindow.document.write('.message { margin: 15px 0; padding: 15px; border-radius: 8px; }');
                viewWindow.document.write('.user { background: #2a2a30; border-left: 3px solid #3b82f6; margin-left: 20%; }');
                viewWindow.document.write('.vectal-ai { background: #2a2a30; border-left: 3px solid #10b981; margin-right: 20%; }'); // Clase actualizada
                viewWindow.document.write('.message-header { font-weight: bold; margin-bottom: 5px; }');
                viewWindow.document.write('.timestamp { color: #888; font-size: 12px; }');
                viewWindow.document.write('</style>');
                viewWindow.document.write('</head><body>');

                viewWindow.document.write('<h1>' + escapeHTML(chat.name) + '</h1>');
                viewWindow.document.write('<p>📅 ' + getFormattedTime(chat.timestamp) + ' | 💬 ' + (chat.messages?.length || 0) + ' mensajes</p>');

                if (chat.messages && chat.messages.length > 0) {
                    chat.messages.forEach((msg, i) => {
                        if (!msg.text) return;

                        const msgClass = msg.type === 'Usuario' ? 'user' : 'vectal-ai'; // 'Usuario' y clase actualizada
                        const formattedText = msg.text.replace(/\\n/g, '<br>');

                        viewWindow.document.write('<div class="message ' + msgClass + '">');
                        viewWindow.document.write('<div class="message-header">' +
                                                 msg.type +
                                                 ' <span class="timestamp">' + (i + 1) + '.</span></div>');
                        viewWindow.document.write('<div>' + escapeHTML(formattedText) + '</div>');
                        viewWindow.document.write('</div>');
                    });
                }

                viewWindow.document.write('<div style="text-align: center; margin-top: 20px;">');
                viewWindow.document.write('<button onclick="window.close()" style="padding: 8px 15px; background: #4a4a50; color: white; border: none; border-radius: 4px; cursor: pointer;">Cerrar</button>');
                viewWindow.document.write('</div>');

                viewWindow.document.write('</body></html>');
                viewWindow.document.close();
            }

            function exportSingleChat(index) {
                const chat = savedChatsData[index];
                if (!chat) {
                    console.warn('❌ Conversación no encontrada');
                    return;
                }

                let exportText = '=== ' + (chat.name || 'Conversación Vectal') + ' ===\\n'; // Texto actualizado
                exportText += 'Fecha: ' + getFormattedTime(chat.timestamp) + '\\n';
                exportText += 'Mensajes: ' + (chat.messages?.length || 0) + '\\n\\n';

                if (chat.messages && chat.messages.length > 0) {
                    chat.messages.forEach((msg, i) => {
                        if (msg.text) {
                            exportText += '[' + (i + 1) + '] ' + msg.type + ':\\n';
                            exportText += msg.text + '\\n';
                            exportText += '============================================================\\n\\n';
                        }
                    });
                }

                const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'vectal_chat_' + chat.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_' + Date.now() + '.txt'; // Nombre de archivo actualizado
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                console.log('✅ Conversación exportada correctamente');
            }

            function deleteChat(index) {
                if (confirm('⚠️ ¿Estás seguro de querer eliminar "' + savedChatsData[index].name + '"?\\n\\nEsta acción no se puede deshacer.')) {
                    try {
                        window.opener.postMessage({ action: 'deleteChat', chatName: savedChatsData[index].name }, parentOrigin);
                    } catch (e) {
                        console.warn('⚠️ No se pudo notificar a la ventana principal:', e);
                    }

                    savedChatsData.splice(index, 1);
                    localStorage.setItem('vectal_chats', JSON.stringify(savedChatsData)); // Clave actualizada
                    refreshUI();

                    console.log('✅ Conversación eliminada');
                }
            }

            function exportAllChats() {
                if (savedChatsData.length === 0) {
                    console.warn('❌ No hay conversaciones para exportar');
                    return;
                }

                let exportText = '=== EXPORTACIÓN DE CONVERSACIONES VECTAL ===\\n'; // Texto actualizado
                exportText += 'Fecha: ' + getFormattedTime(new Date().toISOString()) + '\\n';
                exportText += 'Total de conversaciones: ' + savedChatsData.length + '\\n\\n';

                savedChatsData.forEach((chat, chatIndex) => {
                    exportText += '--- [' + (chatIndex + 1) + '] ' + (chat.name || 'Conversación Vectal') + ' ---\\n'; // Texto actualizado
                    exportText += 'Fecha: ' + getFormattedTime(chat.timestamp) + '\\n';
                    exportText += 'Mensajes: ' + (chat.messages?.length || 0) + '\\n\\n';

                    if (chat.messages && chat.messages.length > 0) {
                        chat.messages.forEach((msg, msgIndex) => {
                            if (msg.text) {
                                exportText += '[' + (msgIndex + 1) + '] ' + msg.type + ':\\n';
                                exportText += msg.text + '\\n\\n';
                            }
                        });
                    }

                    exportText += '\\n============================================================\\n\\n';
                });

                const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'vectal_conversations_backup_' + Date.now() + '.txt'; // Nombre de archivo actualizado
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                console.log('✅ Exportación completada con ' + savedChatsData.length + ' conversaciones');
            }

            function clearAllChats() {
                if (confirm('⚠️ ¡ADVERTENCIA!\\n\\nEsta acción eliminará todas las conversaciones guardadas de Vectal (' + savedChatsData.length + ').\\n\\n¿Estás seguro de que quieres continuar?')) { // Texto actualizado
                    try {
                        window.opener.postMessage({ action: 'clearAllChats' }, parentOrigin);
                    } catch (e) {
                        console.warn('⚠️ No se pudo notificar a la ventana principal:', e);
                    }

                    savedChatsData = [];
                    localStorage.removeItem('vectal_chats'); // Clave actualizada
                    refreshUI();

                    console.log('✅ Todas las conversaciones de Vectal han sido eliminadas'); // Texto actualizado
                }
            }

            function refreshFromParent() {
                try {
                    if (window.opener && !window.opener.closed) {
                        const updatedChats = window.opener.RobustStorage.getItem('chats', []); // Clave actualizada
                        if (updatedChats && Array.isArray(updatedChats)) {
                            savedChatsData = updatedChats;
                            refreshUI();
                            console.log('✅ Lista de conversaciones actualizada desde la ventana principal de Vectal'); // Texto actualizado
                        }
                    }
                } catch (e) {
                    console.error('❌ Error actualizando: ' + e.message);
                }
            }

            function refreshUI() {
                const container = document.querySelector('.chats-grid');
                if (!container) return;

                if (savedChatsData.length === 0) {
                    container.innerHTML = '<div class="empty-state"><h2>📂 No hay conversaciones guardadas</h2><p>Regresa a Vectal.ai y usa el botón <strong>"💾 Guardar Chat"</strong> para guardar tu conversación actual.</p></div>'; // Texto actualizado
                    document.querySelector('.header .stats').textContent = '💬 0 conversaciones guardadas • 📊 0 mensajes totales';
                    return;
                }

                const totalMessages = savedChatsData.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0);
                document.querySelector('.header .stats').textContent = '💬 ' + savedChatsData.length + ' conversaciones guardadas • 📊 ' + totalMessages + ' mensajes totales';

                let cardsHTML = '';
                savedChatsData.forEach((chat, index) => {
                    const previewText = getChatPreview(chat);
                    const safeChatName = escapeHTML(chat.name);
                    const safePreviewText = escapeHTML(previewText);

                    cardsHTML += '<div class="chat-card" data-chat-index="' + index + '">';
                    cardsHTML += '<div class="chat-name">' + safeChatName + '</div>';
                    cardsHTML += '<div class="chat-meta">';
                    cardsHTML += '<span>🕒 ' + getFormattedTime(chat.timestamp) + '</span>';
                    cardsHTML += '<span>💬 ' + (chat.messages?.length || 0) + ' mensajes</span>';
                    cardsHTML += '</div>';
                    cardsHTML += '<div class="chat-preview">' + safePreviewText + '</div>';
                    cardsHTML += '<div class="chat-actions">';
                    cardsHTML += '<button class="action-btn view-btn" onclick="viewChat(' + index + ')">👁️ Ver Completo</button>');
                    cardsHTML += '<button class="action-btn export-btn" onclick="exportSingleChat(' + index + ')">📤 Exportar</button>');
                    cardsHTML += '<button class="action-btn delete-btn" onclick="deleteChat(' + index + ')">🗑️ Eliminar</button>');
                    cardsHTML += '</div>';
                    cardsHTML += '</div>';
                });

                container.innerHTML = cardsHTML;
            }

            window.addEventListener('message', function(event) {
                if (event.origin !== parentOrigin) return;
                if (event.data && event.data.action === 'refreshChatData') {
                    try {
                        const updatedChats = JSON.parse(event.data.chats);
                        if (Array.isArray(updatedChats)) {
                            savedChatsData = updatedChats;
                            refreshUI();
                        }
                    } catch (e) {
                        console.error('Error procesando actualización:', e);
                    }
                }
            });

            setInterval(function() {
                if (window.opener && !window.opener.closed) {
                    try {
                        const updatedChats = window.opener.RobustStorage.getItem('chats', []); // Clave actualizada
                        if (JSON.stringify(updatedChats) !== JSON.stringify(savedChatsData)) {
                            savedChatsData = updatedChats;
                            refreshUI();
                        }
                    } catch (e) {
                        console.warn('No se pudo verificar actualizaciones:', e);
                    }
                } else {
                    console.log('Ventana principal cerrada, deteniendo comprobación periódica');
                    clearInterval(this);
                }
            }, 5000);

            window.addEventListener('load', function() {
                document.body.focus();
            });

            console.log('✅ Gestor de Chats de Vectal completamente inicializado'); // Texto actualizado
        `;

        newWindow.document.body.appendChild(scriptElement);
        newWindow.document.close();
        newWindow.focus();

        console.log('✅ Gestor de chats abierto en nueva ventana con JavaScript funcional.');
    }

    // --- Initialization and Observers (Textos y claves actualizadas) ---
    function initializeFeatures() {
        if (featuresInitialized) return;
        console.log('🚀 Iniciando Vectal Advanced Pro...'); // Texto actualizado

        try {
            GM_addStyle(`
                .vectal-advanced-pro-floating-container { /* Clase actualizada */
                    position: fixed;
                    z-index: 2000; /* Ensure it's above most UI elements */
                    background: #2a2a30; /* Dark background */
                    border: 1px solid #404040;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    min-width: 250px;
                    max-height: 90vh; /* Limit height */
                    overflow-y: auto; /* Allow scrolling if many buttons */
                    resize: both; /* Allow resizing */
                    overflow: auto; /* Ensure scrollbars appear if resized too small */
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                }
                .vectal-advanced-pro-floating-container.hidden-ui .vectal-advanced-pro-controls-panel { /* Clase actualizada */
                    display: none !important;
                }
                .vectal-advanced-pro-floating-container.hidden-ui { /* Clase actualizada */
                    padding: 5px; /* Smaller padding when hidden */
                    min-width: unset;
                    max-height: unset;
                    height: auto;
                    width: auto;
                    overflow: visible;
                }
                .vectal-advanced-pro-floating-container.hidden-ui .vectal-advanced-pro-header { /* Clase actualizada */
                    margin-bottom: 0;
                }

                .vectal-advanced-pro-header { /* Clase actualizada */
                    font-weight: bold;
                    color: #6366f1; /* Accent color */
                    text-align: center;
                    padding: 8px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #404040;
                    cursor: grab;
                }
                .vectal-advanced-pro-controls-panel { /* Clase actualizada */
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .vectal-advanced-pro-buttons-grid { /* Clase actualizada */
                    display: grid;
                    grid-template-columns: 1fr 1fr; /* Two columns */
                    gap: 6px;
                }

                .vectal-advanced-pro-btn { /* Clase actualizada */
                    background: #4a4a50; /* Button background */
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    white-space: nowrap;
                    text-align: center;
                }
                .vectal-advanced-pro-btn:hover { /* Clase actualizada */
                    background: #5c5c63;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
                .vectal-advanced-pro-btn .icon { /* Clase actualizada */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                }
                .vectal-advanced-pro-btn .icon svg { /* Clase actualizada */
                    width: 100%;
                    height: 100%;
                }

                .vectal-advanced-pro-dropdown-wrapper { /* Clase actualizada */
                    position: relative;
                    margin-bottom: 8px;
                    display: block;
                }
                .vectal-advanced-pro-dropdown-select { /* Clase actualizada */
                    width: 100%;
                    background: #4a4a50;
                    color: white;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    min-height: 34px;
                    appearance: none; /* Remove native dropdown arrow */
                    padding-right: 30px; /* Space for custom arrow */
                }
                .vectal-advanced-pro-dropdown-select:focus { /* Clase actualizada */
                    outline: none;
                    box-shadow: 0 0 0 2px #6366f1;
                }
                .vectal-advanced-pro-dropdown-select option { /* Clase actualizada */
                    background: #2a2a30; /* Options background */
                    color: white;
                }
                .vectal-advanced-pro-dropdown-select optgroup { /* Clase actualizada */
                    background: #2a2a30;
                    color: #ccc;
                }
                .vectal-advanced-pro-dropdown-arrow { /* Clase actualizada */
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    color: #ccc;
                }

                .vectal-advanced-pro-toggle-button { /* Clase actualizada */
                    width: 100%;
                    margin-top: 10px;
                    background: #3a3a40;
                    border-top: 1px solid #404040;
                    border-radius: 0 0 10px 10px;
                }
                .vectal-advanced-pro-floating-container.hidden-ui .vectal-advanced-pro-toggle-button { /* Clase actualizada */
                    border-radius: 10px; /* Full border when only toggle button visible */
                }
                .vectal-advanced-pro-toggle-button:hover { /* Clase actualizada */
                    background: #4b4b50;
                }

                .vectal-advanced-pro-btn.drag-active { /* Clase actualizada */
                    border: 2px dashed #6366f1;
                    background-color: #3b82f620; /* Light blue background for drag indication */
                }
            `);

            // setDefaultModel(); // Comentado: Esta función es específica de Perplexity.
            addControlsToFloatingUI();
            setupCharacterCounter();

            const autoSaveEnabled = RobustStorage.getItem('auto_save_enabled', true); // Clave actualizada
            if (autoSaveEnabled) {
                startAutoSave();
            }

            featuresInitialized = true;
            console.log('✅ Vectal Advanced Pro inicializado correctamente'); // Texto actualizado
        }
        catch (error) {
            console.error('❌ Error durante la inicialización de Vectal Advanced Pro:', error); // Texto actualizado
        }
    }

    // Comentado: Esta función es específica de Perplexity y probablemente no aplicable a Vectal.ai
    /*
    function setDefaultModel() {
        const possibleSelectors = ['#lamma-select', 'select[value*="sonar"]', 'select option[value*="sonar"]', '[data-testid*="model"] select', 'select'];
        for (const selector of possibleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.tagName === 'SELECT') {
                const sonarOption = Array.from(element.options).find(option => option.value.includes('sonar') || option.textContent.includes('sonar'));
                if (sonarOption) {
                    element.value = sonarOption.value;
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`✅ Modelo establecido a: ${sonarOption.value}`);
                    return true;
                }
            }
        }
        return false;
    }
    */

    function checkPageReady() {
        const textarea = findElement(SELECTORS.INPUT_TEXTAREA);
        const hasContent = document.body.children.length > 5;
        const floatingUIExists = document.getElementById('vectal-floating-container'); // ID actualizado

        // Page is ready if textarea and basic content are there, AND our UI is either present or we haven't tried to create it yet (featuresInitialized == false)
        if (textarea && hasContent && (floatingUIExists || !featuresInitialized)) {
            console.log('✅ Página de Vectal lista o controles no inicializados, procediendo a verificar/inicializar.'); // Texto actualizado
            return true;
        }
        return false;
    }

    function startInitialization() {
        if (featuresInitialized && document.getElementById('vectal-floating-container')) { // ID actualizado
            console.log('Vectal Advanced Pro ya inicializado y UI presente.'); // Texto actualizado
            return;
        }

        if (checkPageReady()) {
            initializeFeatures();
            return;
        }

        retryCount++;
        if (retryCount >= CONFIG.MAX_RETRIES) {
            console.warn('⚠️ Máximo de reintentos alcanzado. La página de Vectal podría no estar completamente cargada, forzando inicialización.'); // Texto actualizado
            initializeFeatures(); // Force initialize even if not fully ready to avoid a completely dead script
            return;
        }

        console.log(`🔄 Reintento ${retryCount}/${CONFIG.MAX_RETRIES}...`);
        setTimeout(startInitialization, CONFIG.RETRY_INTERVAL);
    }

    // --- Inter-window Message Handling (Claves actualizadas) ---
    window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data && event.data.action) {
            switch(event.data.action) {
                case 'startAutoSave':
                    startAutoSave();
                    RobustStorage.setItem('auto_save_enabled', true); // Clave actualizada
                    break;
                case 'stopAutoSave':
                    stopAutoSave();
                    RobustStorage.setItem('auto_save_enabled', false); // Clave actualizada
                    break;
                case 'deleteChat':
                    try {
                        const currentChats = RobustStorage.getItem('chats', []); // Clave actualizada
                        const chatIndexToDelete = currentChats.findIndex(c => c.name === event.data.chatName);
                        if (chatIndexToDelete !== -1) {
                            currentChats.splice(chatIndexToDelete, 1);
                            RobustStorage.setItem('chats', currentChats); // Clave actualizada
                            console.log(`✅ Chat Vectal "${event.data.chatName}" eliminado desde ventana hija.`); // Texto actualizado
                        }
                    } catch (error) {
                        console.error('❌ Error eliminando chat desde ventana hija:', error);
                    }
                    break;
                case 'clearAllChats':
                    try {
                        RobustStorage.setItem('chats', []); // Clave actualizada
                        console.log('✅ Todos los chats de Vectal eliminados desde ventana hija.'); // Texto actualizado
                    } catch (error) {
                        console.error('❌ Error limpiando chats desde ventana hija:', error);
                    }
                    break;
            }
        }
    });

    // --- Lifecycle Hooks ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startInitialization);
    } else {
        startInitialization();
    }

    // Use a MutationObserver to react to significant DOM changes that might indicate a page transition or dynamic loading
    const observer = new MutationObserver((mutations) => {
        // If features are not initialized OR if our floating container has been removed (e.g., page navigation)
        if (!featuresInitialized || !document.getElementById('vectal-floating-container')) { // ID actualizado
            console.log('Detectado cambio en el DOM de Vectal o UI faltante, verificando estado de inicialización...'); // Texto actualizado
            startInitialization();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: false }); // Observe for child list changes, but not attribute changes to avoid noise

    window.addEventListener('beforeunload', () => {
        stopAutoSave();
        if (window.autoSaveWindows) {
            window.autoSaveWindows.forEach(win => {
                if (!win.closed) { try { win.close(); } catch (e) { console.warn('⚠️ Error cerrando ventana:', e); } }
            });
        }
        observer.disconnect();
    });

    // --- Global Functions for Debugging/Control (Textos y claves actualizadas) ---
    function testChatExtraction() {
        console.log('🧪 === TESTING EXTRACCIÓN DE CHAT DE VECTAL ==='); // Texto actualizado
        const chatContent = getCurrentChatContent();
        console.log('📊 Resultado de extracción:', chatContent);
        if (chatContent.length === 0) {
            console.warn('❌ No se encontraron mensajes en el chat actual de Vectal. Abre la consola (F12) para ver los detalles del debugging.'); // Texto actualizado
        } else {
            console.log(`✅ Extracción exitosa: ${chatContent.length} mensajes encontrados.`);
            console.log(`📝 Primeros 2 mensajes:`);
            console.log(`1. [${chatContent[0].type}]: ${chatContent[0].text.substring(0, Math.min(chatContent[0].text.length, 100))}...`);
            if (chatContent[1]) {
                console.log(`2. [${chatContent[1].type}]: ${chatContent[1].text.substring(0, Math.min(chatContent[1].text.length, 100))}...`);
            }
        }
        return chatContent;
    }
    function clearAllSavedChats() {
        if (confirm('⚠️ ¿Estás seguro de que quieres eliminar TODAS las conversaciones guardadas de Vectal?\n\nEsta acción es PERMANENTE y no se puede deshacer.')) { // Texto actualizado
            try {
                RobustStorage.setItem('chats', []); // Clave actualizada
                console.log('✅ Todas las conversaciones de Vectal han sido eliminadas del almacenamiento local.'); // Texto actualizado
            } catch (e) {
                console.error('❌ Error limpiando localStorage:', e);
            }
        }
    }
    function clearAutoSavedChats() {
        if (confirm('⚠️ ¿Eliminar TODOS los chats autoguardados de Vectal?\n\nEsta acción es PERMANENTE.')) { // Texto actualizado
            try {
                RobustStorage.setItem('auto_saves', []); // Clave actualizada
                console.log('✅ Todos los autoguardados de Vectal han sido eliminados.'); // Texto actualizado
            } catch (e) {
                console.error('❌ Error limpiando autoguardados:', e);
            }
        }
    }
    function getAutoSaveStatus() {
        return {
            isActive: isAutoSaveActive,
            interval: CONFIG.AUTO_SAVE_INTERVAL,
            maxSaves: CONFIG.MAX_AUTO_SAVES,
            currentSaves: RobustStorage.getItem('auto_saves', []).length, // Clave actualizada
            lastSave: RobustStorage.getItem('auto_saves', [])[0]?.timestamp || 'Nunca' // Clave actualizada
        };
    }

    // Expone funciones al scope global para debugging
    window.testChatExtraction = testChatExtraction;
    window.clearAllSavedChats = clearAllSavedChats;
    window.loadSavedChatsMain = loadSavedChatsMain;
    window.openChatsManagerWindow = openChatsManagerWindow;
    window.openJSExecutorWindow = openJSExecutorWindow;
    window.openAutoSaveWindow = openAutoSaveWindow;
    window.startAutoSave = startAutoSave;
    window.stopAutoSave = stopAutoSave;
    window.clearAutoSavedChats = clearAutoSavedChats;
    window.getAutoSaveStatus = getAutoSaveStatus;
    window.getCurrentChatContent = getCurrentChatContent;
    window.RobustStorage = RobustStorage;

    console.log('✨ Vectal Advanced Pro v3.2 cargado'); // Texto actualizado
    console.log('🔧 Funciones disponibles en consola para debugging:');
    console.log('- window.testChatExtraction()');
    console.log('- window.openJSExecutorWindow()');
    console.log('- window.openAutoSaveWindow()');
    console.log('- window.startAutoSave()');
    console.log('- window.stopAutoSave()');
    console.log('- window.getAutoSaveStatus()');
    console.log('- window.clearAllSavedChats()');
    console.log('- window.clearAutoSavedChats()');
})();