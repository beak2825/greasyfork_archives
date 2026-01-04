// ==UserScript==
// @name         Drawaria Christmas Filter 🖍️
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Christmas Filter script. Simulates "Cabin Fever" in a snowy setting with resource scarcity (tool blocking) and evidence loss (chat wipe/fog).
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554762/Drawaria%20Christmas%20Filter%20%F0%9F%96%8D%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/554762/Drawaria%20Christmas%20Filter%20%F0%9F%96%8D%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista de herramientas (data-popupbuttonid) que pueden ser "escasas"
    const TOOLS_TO_CONTROL = ['marker', 'floodfill', 'eraser'];
    const CHAT_WIPE_INTERVAL = 90000; // 90 segundos (El Deshielo)
    const SCARCITY_INTERVAL = 30000; // 30 segundos (La Paranoia)
    let currentBlockedTool = null;


    // --- 1. AMBIENTACIÓN: EL AISLAMIENTO DE LA CABAÑA (Cabin Isolation) ---
    GM_addStyle(`
        body {
            /* Filtro de color frío y oscuro para la atmósfera de thriller/supervivencia */
            filter: grayscale(40%) contrast(110%) sepia(10%) hue-rotate(190deg);
            background-color: #1a1a1a !important; /* Fondo oscuro */
        }

        /* Hacemos el lienzo principal ligeramente más oscuro y aislado */
        #game-canvas {
            border: 5px solid #333 !important;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.9) !important;
        }

        /* Oscurecer el panel de chat para un efecto más sombrío */
        .chat-panel {
            background-color: rgba(0, 0, 0, 0.7) !important;
            color: #ddd;
        }
        .chat-messages-container {
            border-top: 1px solid #444;
        }

        /* Estilo para la herramienta bloqueada (escasez) */
        .tool-blocked {
            pointer-events: none !important;
            opacity: 0.3 !important;
            filter: blur(1px) brightness(50%);
            border: 2px solid red !important;
            animation: pulse-red 1s infinite alternate;
        }

        @keyframes pulse-red {
            from { border-color: red; }
            to { border-color: darkred; }
        }
    `);

    // --- 2. EL FRÍO Y LA PARANOIA (Scarcity of Resources) ---

    function updateToolScarcity() {
        // 1. Quitar el bloqueo anterior
        if (currentBlockedTool) {
            const previousToolButton = document.querySelector(`[data-popupbuttonid="${currentBlockedTool}"]`);
            if (previousToolButton) {
                previousToolButton.classList.remove('tool-blocked');
                sendMessageToChat(`[Síndrome de la Cabaña]: ¡Un suministro de ${currentBlockedTool.toUpperCase()} ha sido encontrado!`);
            }
        }

        // 2. Elegir una nueva herramienta para bloquear (simular escasez)
        const availableTools = TOOLS_TO_CONTROL.filter(tool => tool !== currentBlockedTool);
        if (availableTools.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTools.length);
            currentBlockedTool = availableTools[randomIndex];

            const newToolButton = document.querySelector(`[data-popupbuttonid="${currentBlockedTool}"]`);
            if (newToolButton) {
                newToolButton.classList.add('tool-blocked');
                sendMessageToChat(`[Síndrome de la Cabaña]: ¡Alerta de escasez! El ${currentBlockedTool.toUpperCase()} se ha agotado. Busque alternativas.`);
            }
        }
    }


    // --- 3. LA AMENAZA: EL DESHIELO (Evidence Loss) ---

    function triggerTheThaw() {
        const chatPanel = document.querySelector('.chat-messages-container');
        const canvas = document.querySelector('.current-player-canvas'); // Intentar apuntar al canvas de dibujo

        // 3.1. Simular la pérdida de pistas (limpiar el chat)
        if (chatPanel) {
            // Eliminar mensajes viejos para simular que las pistas se desvanecen/borran
            chatPanel.innerHTML = '';
            sendMessageToChat("<b>[LA PISTA CONGELADA]:</b> La evidencia se está derritiendo... El deshielo ha borrado todas las pistas del chat.");
        }

        // 3.2. Efecto visual de niebla/deshielo sobre el lienzo (solo si se está dibujando)
        if (canvas) {
            canvas.style.transition = 'opacity 3s ease-in-out';
            canvas.style.opacity = '0.4'; // Niebla/deshielo

            setTimeout(() => {
                canvas.style.opacity = '1.0'; // El deshielo pasa
            }, 5000);
        }
    }


    // --- 4. FUNCIONES AUXILIARES ---

    // Función para inyectar un mensaje de "sistema" en el chat
    function sendMessageToChat(message) {
        const chatPanel = document.querySelector('.chat-messages-container');
        if (chatPanel) {
            const systemMessage = document.createElement('div');
            systemMessage.className = 'chat-message system-message';
            systemMessage.style.backgroundColor = 'rgba(173, 216, 230, 0.15)'; // Azul hielo
            systemMessage.innerHTML = message;
            chatPanel.appendChild(systemMessage);
            chatPanel.scrollTop = chatPanel.scrollHeight;
        }
    }

    // --- 5. INICIALIZACIÓN Y TRIGGERS ---

    function initThrillerScript() {
        // Esperamos un poco para asegurar que todos los controles estén cargados
        setTimeout(() => {
            // Empezar la escasez de recursos (paranoia)
            updateToolScarcity();
            setInterval(updateToolScarcity, SCARCITY_INTERVAL);

            // Empezar el deshielo (pérdida de evidencia)
            triggerTheThaw(); // Una vez al inicio
            setInterval(triggerTheThaw, CHAT_WIPE_INTERVAL);

            sendMessageToChat("<b>[CABIN FEVER]:</b> El frío ha llegado. La señal es débil. ¡Los recursos son limitados!");
        }, 3000);
    }

    // Usar 'load' para asegurar que la interfaz del juego esté lista
    window.addEventListener('load', initThrillerScript);

})();