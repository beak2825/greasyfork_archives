// ==UserScript==
// @name         Drawaria Arcana Menu (Magical Automation)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Combines the magical, draggable "Arcana Menu" aesthetic for Drawaria.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554766/Drawaria%20Arcana%20Menu%20%28Magical%20Automation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554766/Drawaria%20Arcana%20Menu%20%28Magical%20Automation%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- VARIABLES GLOBALES Y SETUP DE WEBSOCKET ---

    // Almacena sockets para la función de auto-invitación
    const sockets = [];

    // Intercepta el constructor de WebSocket para rastrear conexiones
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(...args) {
        const socket = new originalWebSocket(...args);

        // Almacena el socket si no está ya en la lista
        if (sockets.indexOf(socket) === -1) {
            sockets.push(socket);
        }

        socket.addEventListener("close", function () {
            const pos = sockets.indexOf(socket);
            if (~pos) sockets.splice(pos, 1);
        });

        return socket;
    };

    // También intercepta el método 'send' para asegurar que el socket sea rastreado
    const originalSend = originalWebSocket.prototype.send;
    originalWebSocket.prototype.send = function (...args) {
        let socket = this;
        if (sockets.indexOf(socket) === -1) {
            sockets.push(socket);
        }
        return originalSend.apply(socket, args);
    };

    // --- 1. ESTILOS MÁGICOS (GM_addStyle) ---
    GM_addStyle(`
        /* Keyframes para el brillo del menú */
        @keyframes menu-glow {
            from { box-shadow: 0 0 10px #7d3c98, 0 0 20px #7d3c98; }
            to { box-shadow: 0 0 5px #7d3c98, 0 0 10px #7d3c984d; }
        }

        /* Ambientación de Noche Estrellada con la nueva imagen */
        body {
            background-image: url('https://img.freepik.com/foto-gratis/3d-render-paisaje-arbol-contra-cielo-nocturno_1048-5698.jpg?semt=ais_hybrid&w=740&q=80') !important;
            background-size: cover !important;
            background-attachment: fixed !important;
            background-color: #0d0d1a !important;
            /* Aplicar un filtro sutil para el ambiente mágico oscuro */
            filter: grayscale(10%) contrast(110%) brightness(90%);
        }

        /* --- Menú Flotante Draggable "Arcana Menu" --- */
        #arcanaMenu {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 300px;
            background: rgba(30, 3, 50, 0.9); /* Morado Oscuro Mágico */
            border: 2px solid #7d3c98;
            border-radius: 12px;
            padding: 10px;
            z-index: 10000;
            cursor: grab; /* Indica que es arrastrable */
            box-shadow: 0 0 15px #7d3c98;
            font-family: 'Times New Roman', serif;
            color: #ecf0f1;
            transition: all 0.3s ease;
            animation: menu-glow 2s infinite alternate;
        }
        #arcanaMenu:active {
            cursor: grabbing;
        }

        /* Encabezado del menú para arrastrar */
        #arcanaMenu h3 {
            margin: 0 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #7d3c98;
            font-size: 1.5em;
            text-shadow: 0 0 5px #fff;
            text-align: center;
        }
        #arcanaMenu h4 {
            margin-top: 15px;
            border-bottom: 1px solid #555;
            padding-bottom: 3px;
        }

        /* Estilo para los botones de Automatización/Hechizos */
        .automation-spell {
            margin: 5px 0;
            padding: 8px;
            width: 100%;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s, box-shadow 0.2s;
            background: #f1c40f; /* Dorado Mágico */
            color: #1a1a1a;
            box-shadow: 0 2px 5px #000;
        }
        .automation-spell:hover {
            background: #f39c12; /* Naranja/Dorado más oscuro */
        }
    `);

    // --- 2. LÓGICA DE DRAG AND DROP ---
    function makeMenuDraggable(menuElement) {
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        menuElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - menuElement.offsetLeft;
            offset.y = e.clientY - menuElement.offsetTop;
            menuElement.style.cursor = 'grabbing';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            menuElement.style.cursor = 'grab';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            menuElement.style.left = (e.clientX - offset.x) + 'px';
            menuElement.style.top = (e.clientY - offset.y) + 'px';
        });
    }

    // --- 3. FUNCIONES DE AUTOMATIZACIÓN (La Magia de la Eficiencia) ---

    // Función auxiliar para inyectar un mensaje de "sistema" en el chat
    function sendMessageToChat(message) {
        const chatPanel = document.querySelector('.chat-messages-container');
        if (chatPanel) {
            const systemMessage = document.createElement('div');
            systemMessage.className = 'chat-message system-message';
            systemMessage.style.backgroundColor = 'rgba(128, 0, 128, 0.15)';
            systemMessage.innerHTML = message;
            chatPanel.appendChild(systemMessage);
            chatPanel.scrollTop = chatPanel.scrollHeight;
        }
    }

    const autoJoinRoom = () => {
        const joinButton = document.querySelector('#quickplay');
        if (joinButton) {
            joinButton.click();
            sendMessageToChat("🔮 **[Hechizo]**: 'UnirseRápido' activado. Teletransportándose a una sala aleatoria...");
        } else {
            sendMessageToChat("❌ **[Error]**: El hechizo 'UnirseRápido' falló. Botón Quick Play no encontrado.");
        }
    };

    const autoInvitePlayers = () => {
        const inviteButton = document.querySelector('#invurl');
        if (inviteButton) {
            // El botón 'invurl' tiene la URL de invitación
            const inviteLink = inviteButton.value;

            // Simular el envío de un mensaje de invitación al chat (para el jugador local)
            const chatInput = document.querySelector('#chat-message'); // Selector correcto de Drawaria
            const sendButton = document.querySelector('.chat-submit-button'); // Selector correcto de Drawaria

            if (chatInput && sendButton) {
                const inviteMessage = `¡Únete a mi portal mágico! Enlace: ${inviteLink}`;
                chatInput.value = inviteMessage;
                sendButton.click();

                sendMessageToChat(`✨ **[Hechizo]**: 'InvitarCompañeros' lanzado. Enlace de invitación enviado al chat.`);

                // NOTA: La lógica de enviar el enlace a todos los jugadores a través de WebSocket
                // es compleja y específica del juego. Por seguridad y estabilidad, es mejor
                // dejar que el jugador comparta la URL generada. La implementación de la lógica
                // de 'sendInvitation' con sockets es altamente inestable y no recomendada para userscripts.

            } else {
                sendMessageToChat("❌ **[Error]**: El hechizo 'InvitarCompañeros' falló. Chat no disponible.");
            }
        } else {
            sendMessageToChat("❌ **[Error]**: El hechizo 'InvitarCompañeros' falló. El enlace de invitación no se encontró.");
        }
    };

    const autoExitRoom = () => {
        const homeButton = document.querySelector('#homebutton');
        if (homeButton) {
            homeButton.click();
            sendMessageToChat("🚪 **[Hechizo]**: 'SalidaInstantánea' activado. Dejando la sala y regresando al plano principal.");
        } else {
            sendMessageToChat("❌ **[Error]**: El hechizo 'SalidaInstantánea' falló. Botón de inicio no encontrado.");
        }
    };

    const exportChatMessages = () => {
        const chatbox = document.querySelector('.chat-messages-container'); // Selector correcto del contenedor
        if (!chatbox) {
            sendMessageToChat("❌ **[Error]**: El hechizo 'ExportarProfecías' falló. El chat no se encontró.");
            return;
        }

        const messages = chatbox.querySelectorAll('.chat-message');
        let exportedMessages = [];

        messages.forEach(message => {
            let line = '';
            if (message.classList.contains('system-message')) {
                line = `[System] ${message.textContent.trim()}`;
            } else {
                // Para mensajes de jugadores
                const nameEl = message.querySelector('.chat-message-name');
                const textEl = message.querySelector('.chat-message-text');

                if (nameEl && textEl) {
                     line = `${nameEl.textContent.trim()}: ${textEl.textContent.trim()}`;
                } else {
                    line = message.textContent.trim(); // Fallback para otros tipos de mensajes
                }
            }
            exportedMessages.push(line);
        });

        // Crear un blob con los mensajes y descargarlo
        const blob = new Blob([exportedMessages.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'drawaria_profecias_chat.txt';
        a.click();
        URL.revokeObjectURL(url);

        sendMessageToChat("💾 **[Hechizo]**: 'ExportarProfecías' exitoso. Mensajes de chat descargados.");
    };

    // Función para invocar clics en botones por ID (Quickplay, etc.)
    const clickButtonById = (id, message) => {
        const button = document.getElementById(id);
        if (button) {
            button.click();
            sendMessageToChat(`✨ **[Hechizo]**: '${message}' activado.`);
        } else {
            sendMessageToChat(`❌ **[Error]**: El hechizo '${message}' falló. Botón #${id} no encontrado.`);
        }
    };

    // --- 4. CREACIÓN DEL MENÚ ARCANA ---

    function createArcanaMenu() {
        const menu = document.createElement('div');
        menu.id = 'arcanaMenu';

        // Título Arrastrable
        menu.innerHTML = '<h3>✨ Arcana Automation ✨</h3>';

        // Sección de Hechizos (Automatización)
        const spellSection = document.createElement('div');
        spellSection.innerHTML = '<h4>Hechizos de Sala:</h4>';

        const spells = [
            { text: 'Unirse Rápido (Quick Play)', action: autoJoinRoom },
            { text: 'Unirse a Patio (Playground)', action: () => clickButtonById('joinplayground', 'Unirse a Patio') },
            { text: 'Siguiente Patio', action: () => clickButtonById('playgroundroom_next', 'Siguiente Patio') },
            { text: 'Crear Sala', action: () => clickButtonById('createroom', 'Crear Sala') },
            { text: 'Mostrar Salas (Room List)', action: () => clickButtonById('showroomlist', 'Mostrar Salas') },
            { text: 'Invitar Compañeros', action: autoInvitePlayers },
            { text: 'Salida Instantánea', action: autoExitRoom },
            { text: 'Exportar Profecías (Chat)', action: exportChatMessages }
        ];

        spells.forEach(spell => {
            const btn = document.createElement('button');
            btn.className = 'automation-spell';
            btn.innerText = spell.text;
            btn.onclick = spell.action;
            spellSection.appendChild(btn);
        });

        menu.appendChild(spellSection);
        document.body.appendChild(menu);

        // Hacer el menú arrastrable
        makeMenuDraggable(menu);
    }

    // --- 5. INICIALIZACIÓN ---

    window.addEventListener('load', () => {
        // Ejecutar con un pequeño retraso para asegurar que la interfaz del juego esté cargada
        setTimeout(() => {
            createArcanaMenu();
            sendMessageToChat("🌌 <b>[ARCANA]:</b> El Menú de Automatización Mágica ha sido conjurado. ¡Usa sus hechizos sabiamente!");
        }, 1000);
    });

})();