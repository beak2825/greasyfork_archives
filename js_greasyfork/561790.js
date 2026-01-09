// ==UserScript==
// @name         Trans-Logistics Copy Buttons - OB
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Botones de copiado avanzados para Trans-Logistics
// @author       DNALDAIR - TOM BJX1
// @match        https://trans-logistics.amazon.com/ssp/dock/hrz/ob*
// @grant        unsafeWindow
// @license      MIT
// @supportURL   https://github.com/tuusuario/Trans-Logistics Copy Buttons - OB
// @downloadURL https://update.greasyfork.org/scripts/561790/Trans-Logistics%20Copy%20Buttons%20-%20OB.user.js
// @updateURL https://update.greasyfork.org/scripts/561790/Trans-Logistics%20Copy%20Buttons%20-%20OB.meta.js
// ==/UserScript==


(function() {
    'use strict';

const styles = [
'.emoji-content {',
'    pointer-events: none;',
'    user-select: none;',
'    -webkit-user-select: none;',
'    -moz-user-select: none;',
'    -ms-user-select: none;',
'    display: inline-block;',
'    position: relative;',
'    z-index: 1;',
'}',
    '.tooltip-container {',
    '    position: absolute;',
    '    width: 100%;',
    '    height: 0;',
    '    top: 0;',
    '    left: 0;',
    '    pointer-events: none;',
    '    user-select: none;',
    '    z-index: 9999;',
    '}',
    '.copy-button-tooltip {',
    '    position: absolute;',
    '    pointer-events: none !important;',
    '    user-select: none !important;',
    '    -webkit-user-select: none !important;',
    '    -moz-user-select: none !important;',
    '    -ms-user-select: none !important;',
    '}',
    '.copy-button {',
'    padding: 6px 12px;',
'    margin-left: 4px;',
'    background: linear-gradient(45deg, #000000, #1a1a1a);',
'    color: #fff;',
'    position: relative;',
'    overflow: hidden;',
'    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
'    border: 2px solid;',
'    border-image: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000, #ff4d00, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff1a1a) 1;',
'    border-radius: 4px;',
'    cursor: pointer;',
'    font-size: 12px;',
'    clip-path: polygon(92% 0, 100% 25%, 100% 75%, 92% 100%, 8% 100%, 0% 75%, 0% 25%, 8% 0);',
'    box-shadow: 0 0 5px rgba(255, 0, 0, 0.3),',
'                0 0 10px rgba(0, 255, 255, 0.2),',
'                0 0 15px rgba(0, 255, 0, 0.2),',
'                inset 0 0 5px rgba(255, 0, 255, 0.2);',
'    animation: multiColorGlow 2s linear infinite;', // Cambiado de 8s a 2s
'}',
    '.copy-button::before {',
    '    content: "";',
    '    position: absolute;',
    '    width: 150%;',
    '    height: 150%;',
    '    background: linear-gradient(',
    '        0deg,',
    '        transparent 0%,',
    '        rgba(32, 255, 255, 0.2) 45%,',
    '        rgba(32, 255, 255, 0.8) 50%,',
    '        rgba(32, 255, 255, 0.2) 55%,',
    '        transparent 100%',
    '    );',
    '    top: -25%;',
    '    left: -100%;',
    '    transform: rotate(35deg);',
    '    transition: all 0.5s;',
    '    animation: hologram-scan 3s linear infinite;',
    '    pointer-events: none;',
    '}',
    '.copy-button::after {',
'    content: "";',
'    position: absolute;',
'    inset: -2px;',
'    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000, #ff4d00, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff1a1a);',
'    background-size: 400%;',
'    animation: borderMove 8s linear infinite;',
'    z-index: -1;',
'    filter: blur(5px);',
'    opacity: 0.5;',
'}',
    '.copy-button:hover {',
    '    transform: translateY(-2px);',
    '    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5),',
    '                0 0 20px rgba(0, 255, 255, 0.3),',
    '                0 0 30px rgba(0, 255, 255, 0.2),',
    '                inset 0 0 10px rgba(0, 255, 255, 0.3);',
    '    border-color: #00ffff;',
    '}',
    '@keyframes borderGlow {',
    '    0%, 100% { border-color: rgba(0, 255, 255, 0.5); }',
    '    50% { border-color: rgba(0, 255, 255, 0.8); }',
    '}',
        '@keyframes borderMove {',
    '    0% { background-position: 0% 50%; }',
    '    50% { background-position: 100% 50%; }',
    '    100% { background-position: 0% 50%; }',
    '}',
    ].join('\n');
    const moreStyles = [
        '.copy-button-tooltip {',
        '    position: absolute;',
        '    background: rgba(0, 0, 0, 0.9);',
        '    color: cyan;',
        '    padding: 6px 10px;',
        '    border-radius: 4px;',
        '    font-size: 11px;',
        '    bottom: 120%;',
        '    left: 50%;',
        '    transform: translateX(-50%);',
        '    white-space: nowrap;',
        '    opacity: 0;',
        '    visibility: hidden;',
        '    transition: all 0.3s ease;',
        '    pointer-events: none;',
        '    border: 1px solid rgba(0, 255, 255, 0.3);',
        '    backdrop-filter: blur(4px);',
        '    z-index: 1000;',
        '}',
        '.copy-button:hover .copy-button-tooltip {',
        '    opacity: 1;',
        '    visibility: visible;',
        '    bottom: 130%;',
        '}',
        '@keyframes hologram-scan {',
        '    0% { left: -100%; }',
        '    100% { left: 200%; }',
        '}',
        '@keyframes shine {',
        '    0% { left: -100%; }',
        '    20% { left: 100%; }',
        '    100% { left: 100%; }',
        '}',
        '@keyframes multiColorGlow {',
'    0% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.3), 0 0 10px rgba(255, 0, 0, 0, 0.2), inset 0 0 5px rgba(255, 0, 0, 0.2); }',
'    6.25% { box-shadow: 0 0 5px rgba(255, 115, 0, 0.3), 0 0 10px rgba(255, 115, 0, 0.2), inset 0 0 5px rgba(255, 115, 0, 0.2); }',
'    12.5% { box-shadow: 0 0 5px rgba(255, 251, 0, 0.3), 0 0 10px rgba(255, 251,51, 0, 0.2), inset 0 0 5px rgba(255, 251, 0, 0.2); }',
'    18.75% { box-shadow: 0 0 5px rgba(72, 255, 0, 0.3), 0 0 10px rgba(72, 255, 0, 0.2), inset 0 0 5px rgba(72, 255, 0, 0.2); }',
'    25% { box-shadow: 0 0 5px rgba(0, 255, 213, 0.3), 0 0 10px rgba(0, 255, 213, 0.2), inset 0 0 5px rgba(0, 255, 213, 0.2); }',
'    31.25% { box-shadow: 0 0 5px rgba(0, 43, 255, 0.3), 0 0 10px rgba(0, 43, 255, 0.2), inset 0 0 5px rgba(0, 43, 255, 0.2); }',
'    37.5% { box-shadow: 0 0 5px rgba(122, 0, 255, 0.3), 0 0 10px rgba(122, 0, 255, 0.2), inset 0 0 5px rgba(122, 0, 255, 0.2); }',
'    43.75% { box-shadow: 0 0 5px rgba(255, 0, 200, 0.3), 0 0 10px rgba(255, 0, 200, 0.2), inset 0 0 5px rgba(255, 0, 200, 0.2); }',
'    50% { box-shadow: 0 0 5px rgba(255, 77, 0, 0.3), 0 0 10px rgba(255, 77, 0, 0.2), inset 0 0 5px rgba(255, 77, 0, 0.2); }',
'    56.25% { box-shadow: 0 0 5px rgba(255, 255, 0, 0.3), 0 0 10px rgba(255, 255, 0, 0.2), inset 0 0 5px rgba(255, 255, 0, 0.2); }',
'    62.5% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.2), inset 0 0 5px rgba(0, 255, 0, 0.2); }',
'    68.75% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.3), 0 0 10px rgba(0, 255, 255, 0.2), inset 0 0 5px rgba(0, 255, 255, 0.2); }',
'    75% { box-shadow: 0 0 5px rgba(0, 0, 255, 0.3), 0 0 10px rgba(0, 0, 255, 0.2), inset 0 0 5px rgba(0, 0, 255, 0.2); }',
'    81.25% { box-shadow: 0 0 5px rgba(255, 0, 255, 0.3), 0 0 10px rgba(255, 0, 255, 0.2), inset 0 0 5px rgba(255, 0, 255, 0.2); }',
'    87.5% { box-shadow: 0 0 5px rgba(255, 26, 26, 0.3), 0 0 10px rgba(255, 26, 26, 0.2), inset 0 0 5px rgba(255, 26, 26, 0.2); }',
'    93.75% { box-shadow: 0 0 5px rgba(255, 128, 0, 0.3), 0 0 10px rgba(255, 128, 0, 0.2), inset 0 0 5px rgba(255, 128, 0, 0.2); }',
'    100% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.3), 0 0 10px rgba(255, 0, 0, 0.2), inset 0 0 5px rgba(255, 0, 0, 0.2); }',
'}',
        '@keyframes ripple {',
        '    to {',
        '        transform: scale(4);',
        '        opacity: 0;',
        '    }',
        '}',
        '.ripple {',
        '    position: absolute;',
        '    border-radius: 50%;',
        '    background: rgba(0, 255, 255, 0.4);',
        '    transform: scale(0);',
        '    animation: ripple 0.6s linear;',
        '    pointer-events: none;',
        '}',
        '.notification {',
        '    position: fixed;',
        '    bottom: 20px;',
        '    right: 20px;',
        '    background: rgba(0, 0, 0, 0.9);',
        '    color: cyan;',
        '    padding: 15px 25px;',
        '    border-radius: 8px;',
        '    z-index: 1000;',
        '    font-weight: 500;',
        '    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);',
        '    animation: notificationIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);',
        '    display: flex;',
        '    align-items: center;',
        '    gap: 12px;',
        '    backdrop-filter: blur(8px);',
        '    border: 1px solid rgba(0, 255, 255, 0.3);',
        '    min-width: 200px;',
        '}',
        '.notification-content {',
        '    display: flex;',
        '    flex-direction: column;',
        '    gap: 4px;',
        '}',
        '.notification-title {',
        '    font-size: 14px;',
        '    font-weight: bold;',
        '    color: #fff;',
        '    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);',
        '}',
        '.notification-text {',
        '    font-size: 12px;',
        '    color: rgba(255, 255, 255, 0.8);',
        '}'
    ].join('\n');
    const finalStyles = [
        '.notification::before {',
        '    content: "";',
        '    width: 24px;',
        '    height: 24px;',
        '    background: linear-gradient(45deg, cyan, #00ffaa);',
        '    border-radius: 50%;',
        '    display: flex;',
        '    align-items: center;',
        '    justify-content: center;',
        '    font-size: 14px;',
        '    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);',
        '    position: relative;',
        '}',
        '.notification::after {',
        '    content: "✓";',
        '    position: absolute;',
        '    left: 25px;',
        '    color: rgba(0, 0, 0, 0.7);',
        '    font-size: 14px;',
        '    font-weight: bold;',
        '}',
        '@keyframes notificationIn {',
        '    0% {',
        '        transform: translateX(100%) scale(0.8);',
        '        opacity: 0;',
        '    }',
        '    50% {',
        '        transform: translateX(-5%) scale(1.1);',
        '    }',
        '    100% {',
        '        transform: translateX(0) scale(1);',
        '        opacity: 1;',
        '    }',
        '}',
        '@keyframes notificationOut {',
        '    0% {',
        '        transform: translateX(0) scale(1);',
        '        opacity: 1;',
        '    }',
        '    100% {',
        '        transform: translateX(100%) scale(0.8);',
        '        opacity: 0;',
        '    }',
        '}'
    ].join('\n');

    // Función para agregar estilos
    function addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles + moreStyles + finalStyles;
        document.head.appendChild(styleSheet);
    }

    // Función para reproducir sonido
function playSound() {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'square';

    // Secuencia simple de Mario
    oscillator.frequency.setValueAtTime(493.88, context.cu.currentTime); // SI
    oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1); // MI
    oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2); // SOL

    gainNode.gain.setValueAtTime(0.2, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
}

    // Funciones de extracción
    function extractVRID(text) {
        return text.split('FMCTT')[0].replace(/📋/g, '').trim();
    }

    function extractTrailer(text) {
        const parts = text.split(' ');
        return (parts.length > 1 ? parts[1] : text).replace(/📋/g, '').trim();
    }

    function extractSortRoute(text) {
    // Extraer solo el patrón XXXX->XXXX y eliminar cualquier texto adicional
    const routeMatch = text.match(/([A-Z0-9]+)->([A-Z0-9]+)/);
    if (routeMatch) {
        return routeMatch[0].split(':')[0].trim();
    }
    return text.split(':')[0].replace(/📋/g, '').trim();
}
    // Función para mostrar notificación
    function showNotification(text) {
        // Eliminar notificación existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';

        const content = document.createElement('div');
        content.className = 'notification-content';

        const title = document.createElement('div');
        title.className = 'notification-title';
        title.textContent = 'Copiado exitosamente';

        const textElement = document.createElement('div');
        textElement.className = 'notification-text';
        textElement.textContent = text;

        content.appendChild(title);
        content.appendChild(textElement);
        notification.appendChild(content);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'notificationOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Función de copiado mejorada
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            playSound();
               showNotification(text);
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    }

    // Función para crear botón con animación
    function createCopyButton(onClick, type = 'default') {
    const button = document.createElement('button');
    button.className = 'copy-button';

    // Contenedor principal para el emoji
const emojiContainer = document.createElement('div');
emojiContainer.className = 'emoji-content';
emojiContainer.style.cssText = 'pointer-events: none; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; position: relative; z-index: 1; display: inline-block;';

    const emojis = {
        'vrid': '🆔',
        'trailer': '🚛',
        'sortRoute': '📍',
        'default': '📋'
    };
    emojiContainer.textContent = emojis[type];
    button.appendChild(emojiContainer);

    // Tooltip completamente separado
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'tooltip-container';
    tooltipContainer.style.cssText = 'pointer-events: none; user-select: none; position: absolute; width: 100%; height: 0;';

    const tooltip = document.createElement('div');
    tooltip.className = 'copy-button-tooltip';
    tooltip.style.cssText = 'pointer-events: none; user-select: none;';

    const tooltipMessages = {
        'vrid': 'Copiar VR ID',
        'trailer': 'Copiar número de trailer',
        'sortRoute': 'Copiar ruta de clasificación',
        'default': 'Copiar al portapapeles'
    };
    tooltip.textContent = tooltipMessages[type];
    tooltipContainer.appendChild(tooltip);
    button.appendChild(tooltipContainer);

    // Efecto de onda
    button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size/2;
        const y = e.clientY - rect.top - size/2;

        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        // Ejecutar callback
        onClick();

        // Limpiar efecto
        setTimeout(() => ripple.remove(), 600);
    });

    return button;
}
    // Procesamiento de tablas con observer optimizado
    function findAndProcessTables() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const headers = Array.from(table.querySelectorAll('th'));

            const vrIdIndex = headers.findIndex(th => th.textContent.includes('VR Id'));
            const trailerIndex = headers.findIndex(th => th.textContent.includes('Trailer'));
            const sortRouteIndex = headers.findIndex(th => th.textContent.includes('Sort/Route'));

            if (vrIdIndex === -1 && trailerIndex === -1 && sortRouteIndex === -1) return;

            const rows = table.querySelectorAll('tr:not(:first-child)');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length === 0) return;

               // VR Id
if (vrIdIndex !== -1 && cells[vrIdIndex] && !cells[vrIdIndex].querySelector('.copy-button')) {
    const text = cells[vrIdIndex].textContent.trim();
    if (text) {
        const button = createCopyButton(() => copyToClipboard(extractVRID(text)), 'vrid');
        cells[vrIdIndex].appendChild(button);
    }
}


                // Trailer
if (trailerIndex !== -1 && cells[trailerIndex] && !cells[trailerIndex].querySelector('.copy-button')) {
    const text = cells[trailerIndex].textContent.trim();
    if (text) {
        const button = createCopyButton(() => copyToClipboard(extractTrailer(text)), 'trailer');
        cells[trailerIndex].appendChild(button);
    }
}

 // Sort/Route
if (sortRouteIndex !== -1 && cells[sortRouteIndex] && !cells[sortRouteIndex].querySelector('.copy-button')) {
    const routeText = cells[sortRouteIndex].textContent;
    const vridText = vrIdIndex !== -1 ? cells[vrIdIndex].textContent : '';
    if (routeText) {
        const button = createCopyButton(() => {
            // Extraer el patrón de ruta y eliminar el "WT" si existe
            const routePattern = routeText.match(/(?:WT)?([A-Z0-9]+->[\w\d]+)/);
            const cleanRoute = routePattern ? routePattern[1] : ''; // Usamos [1] para obtener el grupo sin el "WT"

            // Extraer solo el VR ID sin ningún texto adicional
            const vridPattern = vridText.match(/[A-Z0-9]+/);
            const cleanVrid = vridPattern ? vridPattern[0] : '';

            // Combinar sin ningún texto adicional
            const finalText = cleanRoute && cleanVrid ? `${cleanRoute} - ${cleanVrid}` : cleanRoute;

            // Logs para depuración
            console.log('Texto original:', routeText);
            console.log('VR ID original:', vridText);
            console.log('Texto final:', finalText);

            copyToClipboard(finalText);
        }, 'sortRoute');
        cells[sortRouteIndex].appendChild(button);
    }
}
            });
        });
    }

    // Inicialización
    function init() {
        addStyles();

        // Configuración del observer optimizado
        const observerOptions = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        };

        const observer = new MutationObserver((mutations) => {
            const shouldUpdate = mutations.some(mutation =>
                mutation.addedNodes.length > 0 &&
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 &&
                    (node.matches('table') || node.querySelector('table'))
                )
            );

            if (shouldUpdate) {
                findAndProcessTables();
            }
        });

        // Iniciar observer
        observer.observe(document.body, observerOptions);

        // Procesar tablas existentes
        findAndProcessTables();

        // Agregar soporte para atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'c') {
                const activeElement = document.activeElement;
                const cell = activeElement.closest('td');
                if (cell) {
                    const button = cell.querySelector('.copy-button');
                    if (button) {
                        button.click();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();