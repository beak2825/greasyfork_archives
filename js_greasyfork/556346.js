// ==UserScript==
// @name         BOT - BJX1 ETA-CCP 🤖
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Sistema automatizado para gestión de solicitudes ETA (Estimated Time of Arrival) 🕒 y CCP (Comprobante de Carga Procesada) 📄 en BJX1. Optimiza la comunicación con carriers mediante webhooks integrados con Amazon Chime, mejorando la eficiencia operativa en procesos IB/OB.
// @author       dnaldair - Transportation Operations Manager BJX1
// @match        https://trans-logistics.amazon.com/ssp/dock/hrz/ib*
// @match        https://trans-logistics.amazon.com/ssp/dock/hrz/ob*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @supportURL   https://github.com/tuusuario/BOT-BJX1-ETA-CCP/issues
// @downloadURL https://update.greasyfork.org/scripts/556346/BOT%20-%20BJX1%20ETA-CCP%20%F0%9F%A4%96.user.js
// @updateURL https://update.greasyfork.org/scripts/556346/BOT%20-%20BJX1%20ETA-CCP%20%F0%9F%A4%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuración global y sistema de temas
    const APP_CONFIG = {
        version: '1.0',
        debug: false,
        theme: localStorage.getItem('preferred-theme') || 'light',
        animationsEnabled: true,
        notificationDuration: 3000,
        refreshInterval: 2000,
        sounds: {
            enabled: true,
            volume: 0.5
        }
    };

    // Sistema de temas
    const THEMES = {
        light: {
            primary: '#2196F3',
            secondary: '#FF9800',
            background: '#ffffff',
            surface: 'rgba(255, 255, 255, 0.95)',
            text: '#000000',
            textSecondary: '#666666',
            border: 'rgba(255, 255, 255, 0.18)',
            shadow: 'rgba(31, 38, 135, 0.15)'
        },
        dark: {
            primary: '#64B5F6',
            secondary: '#FFB74D',
            background: '#1a1a1a',
            surface: 'rgba(33, 33, 33, 0.95)',
            text: '#ffffff',
            textSecondary: '#bbbbbb',
            border: 'rgba(255, 255, 255, 0.1)',
            shadow: 'rgba(0, 0, 0, 0.3)'
        }
    };

    // Función para detectar si estamos en IB u OB
    function isInboundPage() {
        return window.location.href.includes('/hrz/ib');
    }

    // Log inicial para verificar que el script se está ejecutando
    console.log('Script iniciado - Versión:', APP_CONFIG.version);

    // Objeto para almacenar los timestamps de las solicitudes de ETA
    const etaRequestTimes = {};

    // Función para formatear la hora en 12h
    function formatTime(date) {
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    // Configuración de webhooks por carrier
    const CARRIER_CONFIGS = {
    'TRRS': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/924a4843-2a80-42ba-954e-55674f09c54a?token=UVVnZEJVa1F8MXwyQ0ZmakgweEdtV1hiT0RBVkVkNkZuQWozYU0xZ1BqdkxEaGJUWHdFckJ3',
        color: '#FF5252',
        enabled: true
    },
    'MXBP': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/584cd794-5911-466b-ab8c-8fc6968d1d2d?token=cHZ0bENSNnB8MXx6ZTlZejFldThOTlEycEdWLXVlR3M2OXRnbEtwU1FrbVQ2QXpjdGROQ1JN',
        color: '#2196F3',
        enabled: true
    },
    'TRUCK': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/40bbdbf8-bd08-4f95-a275-c8a1dc1e1340?token=ODBYQjJoWER8MXxfUkNqbmxwYlIwWHd2NTdTWUcyNmotZUZYMmc5dFM4V0NVbUNRZ29lRUhF',
        color: '#2196F3',
        enabled: true
    },

        'MXVGO': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/2a86ea89-3b33-4c99-bb92-5d32f74eb6db?token=dEJFTEo1ekZ8MXxwSU02dlJhXzBBUXhQMFdxeWh4LXV0LXlLV1Rfa0g3Z29vWllMTWJwVDhz',
        color: '#00BCD4',
        enabled: true
    },
    'RLB1': {
        webhook: '',
        color: '#FFC107',
        enabled: false,
        isSpecial: true,
        specialMessage: 'Pendiente de carrier'
    },
    'MINAN': {
        webhook: '',
        color: '#4CAF50',
        enabled: false
    },
    'MPRU': {
        webhook: '',
        color: '#8BC34A',
        enabled: false
    },
    'MXEF': {
        webhook: '',
        color: '#CDDC39',
        enabled: false
    },
    'ARDMV': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/9e0c76df-370c-471f-b5d0-596d00a8907d?token=bVc5V2ZwT3B8MXxvN0RyOXRQTzVmbGlJLWFyaTRrbmZSYlg0cHFjOTA4WVp1UUlLdU55VHdN',
        color: '#FF9800',
        enabled: true
    },
    'MARVA': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/bb63ed20-e375-4c6a-b89b-16babe063c35?token=cHVzZHVJbDh8MXwtTk1NRFN5RmMzcHlvSk5xNlh5NkVNclhDSnpDcEVFel9JY1gydW5ZazNJ',
        color: '#FF5722',
        enabled: true
    },
    'MXAK': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/b9968bd0-f16e-4d6a-9d75-a83534792766?token=eG10ZmlWYmx8MXxLdUgzbjRzQThpOFQ0eWVaUV81MENWb3pIaTdObkRJRXpobE9mbTlHREp3',
        color: '#795548',
        enabled: true
    },
    'MXGTM': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/d041ec1b-9919-4d69-8971-153d88435a79?token=OHZkTEh6cUh8MXxqWkVxX29fZkcyZGhzXzh4RmR2ZGtjNHVnR0JXY3M1R3EzNWlraUVfam5j',
        color: '#9E9E9E',
        enabled: true
    },
    'MXLAR': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/4b999303-9aab-4504-bb47-6502c414991d?token=a2F5SzNvVVZ8MXxvVl9vd1pPLU1BV3dEZ3RBU3N2RlJkRTh4blZ6ZHc5OHZuOC1EdWJjeF9R',
        color: '#607D8B',
        enabled: true
    },
    'MTUML': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/b12a85fa-c0f3-46c9-bfab-9ad2d0ac33e1?token=MGlMSHdtTGl8MXxEaE5zVjFDNGI4Wi1BSlcyMkp2Qkd2OU1vQXJDZmpWNmdWSjMteWJWQ28w',
        color: '#3F51B5',
        enabled: true
    },
    'GOMX': {
        webhook: '',
        color: '#673AB7',
        enabled: false
    },
    'MGUR': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/86df076e-661e-4685-9dd8-4bb024dd4823?token=WlhuMHl3NXp8MXw1d0xtYVM1aEg2MnhZbWI3cmFJMERmNEZIdUl4aG5aUjRLUlh0NUl4elBB',
        color: '#9C27B0',
        enabled: true
    },
    'AWLRY': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/715ca057-b030-4d05-8f79-0e1d0ff5945a?token=SkdKeVR2Q0d8MXxBYXdYeE0yU3BBako3YnpaVi1ZdXR1TG5nTG15N05zTHZ3R1hkVkhneXZn',
        color: '#E91E63',
        enabled: true
    },
    'FMEX': {
        webhook: '',
        color: '#F44336',
        enabled: false
    },
    'AWJNS': {
        webhook: '',
        color: '#009688',
        enabled: false
    },
    'MXTX': {
        webhook: '',
        color: '#4DB6AC',
        enabled: false
    },
    'INTLO': {
        webhook: '',
        color: '#26A69A69A',
        enabled: false
    },
    'AQTNS': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/e8e2b828-33c6-49bf-9f20-976473fb3395?token=dzdqbnI1ZjF8MXxsd1daZnZBTzRuVUh4QmxLdUVTN20zaGxiTWFhUGNTSkkycW5wWjZjeXpB',
        color: '#66BB6A',
        enabled: true
    },
    'MXTDR': {
        webhook: '',
        color: '#9CCC65',
        enabled: false
    },
    'MXFH': {
        webhook: '',
        color: '#D4E157',
        enabled: false
    },
    'MXAX': {
        webhook: '',
        color: '#FFEE58',
        enabled: false
    },
    'RDPK': {
        webhook: '',
        color: '#FFCA28',
        enabled: false
    },
    'MXDLR': {
        webhook: '',
        color: '#FFA726',
        enabled: false
    },
    'SIFRA': {
        webhook: '',
        color: '#FF7043',
        enabled: false
    },
    'AMPM': {
        webhook: '',
        color: '#8D6E63',
        enabled: false
    },
    'AYLSO': {
        webhook: '',
        color: '#78909C',
        enabled: false
    },
    'PQEX': {
        webhook: '',
        color: '#5C6BC0',
        enabled: false
    },
    'TXDV': {
        webhook: 'https://hooks.chime.aws/incomingwebhooks/94f1e8a7-8fbc-4864-9a23-3e7aef38e234?token=emJ3VDdlYTl8MXxnazhRYnFrX2lxdWJCTXFCWFI1ZEtlRFRVcjlJdjROLUROX0czS0pqaHBZ',
        color: '#7E57C2',
        enabled: true
    },
    'DHLC': {
        webhook: '',
        color: '#EC407A',
        enabled: false
    },
    'NCSL': {
        webhook: '',
        color: '#AB47BC',
        enabled: false,
        isSpecial: true,
        specialMessage: 'VRID DUMMY'
    },
};

    // Array para almacenar unidades seleccionadas
    let unitsToRequest = [];

    // Sistema de notificaciones con sonido
    const NOTIFICATION_SOUNDS = {
        success: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFbgCenp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6e//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAW7LZ3a6AAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZDwP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
        error: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFbgCenp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6e//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAW7A+JvXAAAAAAAAAAAAAAAAAAAA//sUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUZDwP8AAAaQAAAAgAAA0gA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
    };
    // Estilos globales mejorados - Primera parte
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
    /* Animaciones Globales */
    @keyframes neonGlow {
        0% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.5), 0 0 10px rgba(33, 150, 243, 0.3); }
        50% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.8), 0 0 30px rgba(33, 150, 243, 0.5); }
        100% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.5), 0 0 10px rgba(33, 150, 243, 0.3); }
    }

    @keyframes shimmer {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
    }

    @keyframes floatAnimation {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0px); }
    }

    @keyframes pulseAnimation {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
        from { transform: translateX(50px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(20px); opacity: 0; }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }

    @keyframes sendingPulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }

    /* Variables de tema */
    :root {
        --background: #ffffff;
        --text: #000000;
        --primary: #2196F3;
        --secondary: #FF9800;
        --success: #4CAF50;
        --warning: #FFC107;
        --error: #F44336;
    }

    /* Container principal */
    .button-container {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        margin: 4px 0;
        flex-wrap: wrap;
        transition: all 0.3s ease;
    }

    .button-container:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 36px rgba(31, 38, 135, 0.25);
    }

    /* Botones de acción */
    .action-button {
        padding: 6px 12px;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-width: 130px;
        max-width: 130px;
        height: 28px;
        line-height: 16px;
        text-align: center;
        position: relative;
        overflow: hidden;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: linear-gradient(45deg, var(--primary), #1976D2);
        box-shadow: 0 2px 10px rgba(33, 150, 243, 0.3);
    }
`;
document.head.appendChild(styleSheet);

// Segunda parte de los estilos
const styleSheet2 = document.createElement('style');
styleSheet2.innerHTML = `
    .action-button {
        position: relative;
        overflow: hidden;
    }

    .action-button::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transform: rotate(45deg);
        animation: shimmer 3s infinite;
        z-index: 1;
    }

    .eta-action-button {
        background: linear-gradient(45deg, #2196F3, #3F51B5);
        box-shadow: 0 0 15px rgba(33, 150, 243, 0.3);
    }

    .ccp-action-button {
        background: linear-gradient(45deg, #FF9800, #F57C00);
        box-shadow: 0 0 15px rgba(255, 152, 0, 0.3);
    }

    .action-button.selected {
        animation: pulseAnimation 2s infinite;
        background: linear-gradient(45deg, #4CAF50, #45a049);
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
    }

    .action-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }

    .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        filter: brightness(1.1);
    }

    /* Iconos de los botones */
    .eta-action-button::after {
        content: '🕒';
        font-size: 14px;
        margin-right: 4px;
        position: relative;
        z-index: 2;
    }

    .ccp-action-button::after {
        content: '📄';
        font-size: 14px;
        margin-right: 4px;
        position: relative;
        z-index: 2;
    }

    .action-button.selected::after {
        content: '✓';
        animation: checkmarkGlow 1.5s ease-in-out infinite alternate;
    }
`;
document.head.appendChild(styleSheet2);

// Tercera parte de los estilos
const styleSheet3 = document.createElement('style');
styleSheet3.innerHTML = `
    /* Carrier Indicator */
    .carrier-indicator {
        padding: 6px 12px;
        border-radius: 8px;
        color: white;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
        background: linear-gradient(45deg, var(--carrier-color), var(--carrier-color-dark));
    }

    .carrier-indicator::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transform: rotate(45deg);
        animation: shimmer 3s infinite;
    }

    .carrier-indicator.disabled {
        opacity: 0.7;
    }

    .carrier-indicator.disabled::after {
        content: "⚠️";
        font-size: 12px;
        margin-left: 4px;
        animation: shake 0.5s ease-in-out;
    }

.panel-container {
    position: fixed;
    top: 20px;
    right: 80px;
    width: auto;
    min-width: 240px;  /* Tamaño reducido */
    max-width: 280px;
    background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,255,0.95));
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
    z-index: 9999999;  /* Aumentado para asegurar que esté por encimaima */
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transform-origin: right top;
    animation: slideIn 0.5s ease-out;
    pointer-events: auto;  /* Asegura que sea interactivo */
}

.panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(45deg, #1976D2, #2196F3);
        border-radius: 16px 16px 0 0;
        color: white;
    }

    .panel-title {
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .panel-controls {
        display: flex;
        gap: 8px;
    }

    .panel-minimize,
    .panel-drag {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    .panel-minimize:hover,
    .panel-drag:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    .panel-content {
        transition: all 0.3s ease;
    }

    .panel-content.minimized {
        height: 0;
        overflow: hidden;
        padding: 0;
    }

    .panel-footer {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }
`;
document.head.appendChild(styleSheet3);

// Cuarta parte de los estilos
const styleSheet4 = document.createElement('style');
styleSheet4.innerHTML = `
    /* Stats Container */
    .stats-container {
        display: flex;
        justify-content: space-around;
        padding: 16px;
        background: rgba(33, 150, 243, 0.1);
        border-radius: 12px;
        margin: 12px;
        backdrop-filter: blur(4px);
    }

    .stat-item {
        text-align: center;
        animation: floatAnimation 3s ease-in-out infinite;
    }

    .stat-label {
        font-size: 12px;
        color: #666;
        display: block;
        margin-bottom: 4px;
    }

    .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary);
        text-shadow: 0 0 10px rgba(33, 150, 243, 0.3);
    }

/* Botón principal de envío mejorado */
.send-button {
    padding: 12px 24px;
    background: linear-gradient(45deg, #1976D2, #2196F3, #42A5F5);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 200px;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: 1.4;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
}`;

document.head.appendChild(styleSheet4);
// Quinta parte de los estilos
const styleSheet5 = document.createElement('style');
styleSheet5.innerHTML = `
    .send-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 30px rgba(33, 150, 243, 0.6);
    }

    .send-button.sending {
        animation: sendingPulse 1s infinite;
    }

    /* Timestamps y mensajes */
    .eta-timestamp {
        font-size: 10px;
        color: #666;
        margin-top: 6px;
        text-align: center;
        font-style: italic;
        width: 100%;
        display: block;
        padding: 4px 8px;
        background: rgba(33, 150, 243, 0.1);
        border-radius: 6px;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.3s ease-in-out;
    }

    .last-request-time {
        font-size: 11px;
        color: #666;
        text-align: center;
        margin-top: 8px;
        font-style: italic;
        background: rgba(33, 150, 243, 0.1);
        padding: 8px 16px;
        border-radius: 8px;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.3s ease-in-out;
    }

/* Notificaciones mejoradas */
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,255,0.95));
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    animation: slideUp 0.3s ease-out;
    z-index: 1000000;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
    transform-origin: right;
}

.notification-message {
    color: #000000;  /* Color más oscuro */
    font-size: 14px;
    font-weight: 700;  /* Más negrita */
    letter-spacing: 0.5px;  /* Mejor legibilidad */
}

.notification.success {
    border-left: 4px solid #4CAF50;
}

.notification.warning {
    border-left: 4px solid #FFC107;
}

.notification.error {
    border-left: 4px solid #F44336;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.notification-icon {
    font-size: 20px;
}

    /* Tooltip mejorado */
    .tooltip {
        position: relative;
        display: inline-block;
    }

    .tooltip:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 12px;
        background: rgba(0,0,0,0.8);
        color: white;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
    }

    /* Efectos adicionales */
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }

    /* Tema oscuro */
    [data-theme="dark"] {
        --background: #1a1a1a;
        --text: #ffffff;
        --text-secondary: #bbbbbb;
    }

    /* Efectos de carga */
    .loading-indicator {
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .button-icon {
        margin-right: 8px;
    }

    /* Mejoras de accesibilidad */
    .action-button:focus,
    .send-button:focus,
    .panel-minimize:focus,
    .panel-drag:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.5);
    }

    /* Animación de éxito */
    @keyframes successPulse {
        0% { transform: scale(1); background: var(--success); }
        50% { transform: scale(1.05); background: #45a049; }
        100% { transform: scale(1); background: var(--success); }
    }
`;
document.head.appendChild(styleSheet5);
// Sistema de notificaciones mejorado
function playNotificationSound(type = 'success') {
    if (APP_CONFIG.sounds.enabled) {
        const audio = new Audio(NOTIFICATION_SOUNDS[type]);
        audio.volume = APP_CONFIG.sounds.volume;
        audio.play().catch(() => {});
    }
}

function showNotification(message, type = 'success') {
    // Eliminar notificaciones anteriores
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.animation = 'slideDown 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    });

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    playNotificationSound(type);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, APP_CONFIG.notificationDuration);
}

// Función para detectar el carrier
function detectCarrier(row) {
    const cells = Array.from(row.cells);
    for (const cell of cells) {
        const text = cell.textContent.trim();
        if (text.includes('[ATS_CONTRACTED]')) {
            console.log('Encontrado [ATS_CONTRACTED] en:', text);

            if (text.includes('RLB1')) {
                console.log('Carrier detectado: RLB1');
                return 'RLB1';
            }

            for (const carrier of Object.keys(CARRIER_CONFIGS)) {
                if (text.includes(carrier)) {
                    console.log('Carrier detectado:', carrier);
                    return carrier;
                }
            }
        }
    }
    console.log('No se encontró carrier específico, usando TRRS por defecto');
    return 'TRRS';
}

// Función para obtener el webhook según el carrier
function getWebhookUrl(carrier) {
    console.log('Obteniendo webhook para carrier:', carrier);

    if (!CARRIER_CONFIGS[carrier]) {
        console.error('Carrier no encontrado en configuración:', carrier);
        return null;
    }

    const webhook = CARRIER_CONFIGS[carrier].webhook;
    if (!webhook) {
        CARRIER_CONFIGS[carrier].enabled = false;
    }
    console.log('Webhook encontrado:', webhook || 'No configurado');

    return webhook;
}

// Función para limpiar el texto
function cleanText(text) {
    if (!text) return '';
    text = text.trim();
    if (text.includes('->')) {
        return text.replace('WT', '').split('📋')[0].split('📍')[0].trim();
    }
    return text.split('FMCTT')[0].split('📋')[0].split('🆔')[0].trim();
}

// Función para obtener el saludo según la hora
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'buenos días';
    if (hour < 19) return 'buenas tardes';
    return 'buenas noches';
}

// Función para formatear mensajes ETA
function formatMessage(units) {
    let message = `/md **Hola team ${getGreeting()}, nos podrias apoyar con la ETA de las siguientes unidades, por favor, muchas gracias por su apoyo**

🚛 Apoyo con ETA de unidades:`;

    units.forEach(unit => {
        message += `

• 🛣️ Route: **${unit.route}**
• 📦 VRID: **${unit.vrid}**`;
    });

    message += `

**Quedamos atentos, gracias por su apoyo!**`;

    return message;
}

// Función para formatear mensajes CCP
function formatCCPMessage(units) {
    let message = `/md **Hola team ${getGreeting()}, nos podrian apoyar a compartir CCP para ${units.length > 1 ? 'las siguientes unidades' : 'la siguiente unidad'}:**

🚛 Unidades para CCP:`;

    units.forEach(unit => {
        message += `

• 🛣️ Route: **${unit.route}**
• 📦 VRID: **${unit.vrid}**`;
    });

    message += `

**Gracias por su apoyo!**`;

    return message;
}
// Función para enviar mensaje al webhook
function sendWebhookMessage(message, carrier, type) {
    console.log('Iniciando envío de mensaje...', {message, carrier, type});

    if (!CARRIER_CONFIGS[carrier]) {
        console.error('Carrier no encontrado:', carrier);
        showNotification(`Error: Carrier ${carrier} no encontrado`, 'error');
        return;
    }

    if (!CARRIER_CONFIGS[carrier].enabled) {
        console.warn('Carrier deshabilitado:', carrier);
        showNotification(`El carrier ${carrier} no tiene webhook configurado aún`, 'warning');
        return;
    }

    const webhookUrl = getWebhookUrl(carrier);
    if (!webhookUrl) {
        console.error('No se encontró URL del webhook para:', carrier);
        showNotification(`Error: No hay URL de webhook para ${carrier}`, 'error');
        return;
    }

    // Mostrar notificación de envío con animación
    showNotification(`Enviando solicitud a ${carrier}...`, 'info');

    // Agregar animación de carga al botón correspondiente
    const buttons = document.querySelectorAll(`.${type}-action-button[data-carrier="${carrier}"].selected`);
    buttons.forEach(button => button.classList.add('loading'));

    const data = JSON.stringify({ Content: message }); // Corregido aquí

    try {
        GM_xmlhttpRequest({
            method: 'POST',
            url: webhookUrl,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                console.log('Respuesta:', response);

                if (response.status === 200) {
                    handleSuccessfulRequest(carrier, type, buttons);
                } else {
                    handleFailedRequest(carrier, response.status);
                }
            },
            onerror: function(error) {
                handleFailedRequest(carrier, error.message || 'Error desconocido');
            }
        });
    } catch (error) {
        handleFailedRequest(carrier, error.message);
    }
}

// Manejador de solicitud exitosa
function handleSuccessfulRequest(carrier, type, buttons) {
    const successMessage = `${type === 'eta' ? 'ETA' : 'CCP'} solicitado exitosamente a ${carrier}`;
    showNotification(successMessage, 'success');

    // Actualizar timestamps y efectos visuales
    if (type === 'eta') {
        updateEtaTimestamps(carrier);
    }

    // Efectos visuales en botones
    buttons.forEach(button => {
        button.classList.remove('loading');
        button.style.animation = 'successPulse 0.5s ease';

        setTimeout(() => {
            button.classList.remove('selected');
            button.textContent = type === 'eta' ? 'Solicitar ETA' : 'Solicitar CCP';
            button.style.backgroundColor = type === 'eta' ? '#2196F3' : '#FF9800';
            button.style.animation = '';
        }, 500);
    });

    // Actualizar lista de solicitudes y panel
    unitsToRequest = unitsToRequest.filter(u => !(u.carrier === carrier && u.type === type));
    updatePanel();
    updateStatistics();
}

// Manejador de solicitud fallida
function handleFailedRequest(carrier, errorMessage) {
    console.error('Error en la solicitud:', errorMessage);
    showNotification(`Error al enviar mensaje a ${carrier}: ${errorMessage}`, 'error');

    // Remover estados de carga
    document.querySelectorAll('.action-button.loading').forEach(button => {
        button.classList.remove('loading');
    });
}

// Función para crear el panel principal mejorado
function createWebhookPanel() {
    console.log('Creando panel de webhook...');
    const existingPanel = document.querySelector('.panel-container');
    if (existingPanel) return;

    const panel = document.createElement('div');
    panel.className = 'panel-container';
    panel.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">
                <span class="robot-icon">🤖</span>
                Control de Solicitudes - dnaldair
                <span class="version-badge" title="Versión ${APP_CONFIG.version}">v${APP_CONFIG.version}</span>
            </div>
            <div class="panel-controls">
                <button class="panel-minimize tooltip" data-tooltip="Minimizar panel" title="Minimizar">_</button>
                <button class="panel-drag tooltip" data-tooltip="Mover panel" title="Mover">⋮</button>
            </div>
        </div>
        <div class="panel-content">
            <div class="stats-container">
                <div class="stat-item tooltip" data-tooltip="Total de ETAs pendientes">
                    <span class="stat-label">ETAs</span>
                    <span class="stat-value" id="etaCount">0</span>
                </div>
                <div class="stat-item tooltip" data-tooltip="Total de CCPs pendientes">
                    <span class="stat-label">CCPs</span>
                    <span class="stat-value" id="ccpCount">0</span>
                </div>
            </div>
            <div class="panel-footer">
                <button id="sendRequest" class="send-button tooltip" data-tooltip="Enviar todas las solicitudes pendientes">
                    <span class="button-icon">📤</span>
                    <span class="button-text">Enviar Solicitudes</span>
                </button>
                <div id="lastRequestTime" class="last-request-time"></div>
            </div>
        </div>
    `;

    document.body.appendChild(panel);
    console.log('Panel agregado al DOM exitosamente');

    // Inicializar funcionalidades del panel
    initializePanelControls(panel);
}

// Función para inicializar los controles del panel
function initializePanelControls(panel) {
    const minimizeButton = panel.querySelector('.panel-minimize');
    const panelContent = panel.querySelector('.panel-content');
    const sendButton = panel.querySelector('#sendRequest');

    // Minimizar/Maximizar
    minimizeButton.addEventListener('click', () => {
        panelContent.classList.toggle('minimized');
        minimizeButton.textContent = panelContent.classList.contains('minimized') ? '+' : '_';
        minimizeButton.setAttribute('data-tooltip',
            panelContent.classList.contains('minimized') ? 'Maximizar panel' : 'Minimizar panel');
    });

    // Manejo de envío de solicitudes
    sendButton.addEventListener('click', () => {
        if (unitsToRequest.length === 0) {
            showNotification("Selecciona al menos una unidad antes de enviar la solicitud", 'warning');
            return;
        }

        const now = new Date();
        document.getElementById('lastRequestTime').textContent =
            `Última solicitud: ${formatTime(now)}`;

        sendButton.classList.add('sending');

        const groupedRequests = unitsToRequest.reduce((acc, unit) => {
            const key = `${unit.carrier}-${unit.type}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(unit);
            return acc;
        }, {});

        updateRequestCounters(groupedRequests);

        Object.entries(groupedRequests).forEach(([key, units]) => {
            const [carrier, type] = key.split('-');
            const message = type === 'eta' ? formatMessage(units) : formatCCPMessage(units);
            sendWebhookMessage(message, carrier, type);
        });

        setTimeout(() => {
            sendButton.classList.remove('sending');
        }, 1000);
    });

    // Hacer el panel draggable
    makeDraggable(panel);
}

// Función para actualizar timestamps de ETA
function updateEtaTimestamps(carrier) {
    const now = new Date();
    unitsToRequest.forEach(unit => {
        if (unit.type === 'eta' && unit.carrier === carrier) {
            etaRequestTimes[unit.vrid] = now;

            const button = document.querySelector(`.eta-action-button[data-carrier="${carrier}"][data-vrid="${unit.vrid}"]`);
            if (button) {
                let timestampDiv = button.parentElement.querySelector('.eta-timestamp');
                if (!timestampDiv) {
                    timestampDiv = document.createElement('div');
                    timestampDiv.className = 'eta-timestamp';
                    button.parentElement.appendChild(timestampDiv);
                }
                timestampDiv.textContent = `Última solicitud: ${formatTime(now)}`;
                timestampDiv.style.animation = 'fadeIn 0.3s ease-in-out';
            }
        }
    });
}

// Función para actualizar estadísticas
function updateStatistics() {
    const stats = unitsToRequest.reduce((acc, unit) => {
        acc[unit.type]++;
        return acc;
    }, { eta: 0, ccp: 0 });

    animateCounterUpdate('etaCount', stats.eta);
    animateCounterUpdate('ccpCount', stats.ccp);
}

// Función para animar actualización de contadores
function animateCounterUpdate(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const currentValue = parseInt(element.textContent);
    if (currentValue === newValue) return;

    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'pulseAnimation 0.5s ease-out';
    element.textContent = newValue;
}
// Función mejorada para manejar el clic del botón
function handleButtonClick(e, buttonElement, button, route, vrid, carrier) {
    e.stopPropagation();
    const selected = buttonElement.classList.contains('selected');

    if (!selected) {
        selectButton(buttonElement, button, route, vrid, carrier);
    } else {
        deselectButton(buttonElement, button, vrid);
    }

    updatePanel();
}

// Función para seleccionar botón
function selectButton(buttonElement, button, route, vrid, carrier) {
    buttonElement.classList.add('selected');
    buttonElement.textContent = button.type === 'eta' ? 'ETA Solicitada' : 'CCP Solicitada';
    buttonElement.style.backgroundColor = button.selectedColor;

    // Efecto de selección
    buttonElement.style.animation = 'pulseAnimation 0.5s ease-out';
    setTimeout(() => {
    buttonElement.style.animation = '';
}, 500);


    if (button.type === 'eta') {
        addEtaTimestamp(buttonElement, vrid);
    }

    unitsToRequest.push({ route, vrid, carrier, type: button.type });

    // Efecto visual en el contenedor de estadísticas
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsContainer.style.animation = 'shake 0.5s ease-out';
        setTimeout(() => {
    statsContainer.style.animation = '';
}, 500);

    }
}

// Función para deseleccionar botón
function deselectButton(buttonElement, button, vrid) {
    buttonElement.classList.remove('selected');
    buttonElement.textContent = button.type === 'eta' ? 'Solicitar ETA' : 'Solicitar CCP';
    buttonElement.style.backgroundColor = button.color;

    if (button.type === 'eta') {
        removeEtaTimestamp(buttonElement, vrid);
    }

    unitsToRequest = unitsToRequest.filter(
        u => !(u.vrid === vrid && u.type === button.type)
    );
}

// Función para agregar timestamp de ETA
function addEtaTimestamp(buttonElement, vrid) {
    const now = new Date();
    etaRequestTimes[vrid] = now;

    let timestampDiv = buttonElement.parentElement.querySelector('.eta-timestamp');
    if (!timestampDiv) {
        timestampDiv = document.createElement('div');
        timestampDiv.className = 'eta-timestamp';
        buttonElement.parentElement.appendChild(timestampDiv);
    }

    timestampDiv.textContent = `Última solicitud: ${formatTime(now)}`;
    timestampDiv.style.animation = 'fadeIn 0.3s ease-in-out';
}

// Función para remover timestamp de ETA
function removeEtaTimestamp(buttonElement, vrid) {
    const timestampDiv = buttonElement.parentElement.querySelector('.eta-timestamp');
    if (timestampDiv) {
        timestampDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => timestampDiv.remove(), 300);
    }
    delete etaRequestTimes[vrid];
}

// Función mejorada para actualizar el panel
function updatePanel() {
    const button = document.getElementById('sendRequest');
    if (!button) return;

    const etaUnits = unitsToRequest.filter(u => u.type === 'eta');
    const ccpUnits = unitsToRequest.filter(u => u.type === 'ccp');

    let buttonContent = `
        <span class="button-icon">📤</span>
        <span class="button-text">
            ${unitsToRequest.length === 0 ? 'Enviar Solicitudes' : ''}
    `;

    if (etaUnits.length > 0) {
        buttonContent += `
            <div class="request-group">
                <span class="group-label">ETA:</span>
                <span class="group-vrids">${etaUnits.map(u => u.vrid).join(', ')}</span>
            </div>
        `;
    }

    if (ccpUnits.length > 0) {
        buttonContent += `
            <div class="request-group">
                <span class="group-label">CCP:</span>
                <span class="group-vrids">${ccpUnits.map(u => u.vrid).join(', ')}</span>
            </div>
        `;
    }

    buttonContent += '</span>';
    button.innerHTML = buttonContent;

    // Actualizar estado del botón
    button.disabled = unitsToRequest.length === 0;
    button.classList.toggle('has-requests', unitsToRequest.length > 0);

    // Actualizar estadísticas
    updateStatistics();
}

// Función para hacer el panel draggable mejorada
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragHandle = element.querySelector('.panel-drag');

    dragHandle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        // Efecto visual al comenzar el arrastre
        element.style.transition = 'none';
        element.style.opacity = '0.8';
        element.style.transform = 'scale(0.98)';
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Limitar el movimiento dentro de la ventana
        const newTop = element.offsetTop - pos2;
        const newRight = parseInt(getComputedStyle(element).right) + pos1;

        if (newTop >= 0 && newTop <= window.innerHeight - element.offsetHeight) {
            element.style.top = newTop + "px";
        }
        if (newRight >= 0 && newRight <= window.innerWidth - element.offsetWidth) {
            element.style.right = newRight + "px";
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;

        // Restaurar estilos después del arrastre
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    }
}
// Función para procesar las filas de la tabla
function processTableRows(table) {
    const rows = table.getElementsByTagName('tr');
    console.log(`Procesando ${rows.length} filas`);

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        if (row.querySelector('.button-container')) {
            console.log(`Fila ${i}: Ya tiene botones`);
            continue;
        }

        const cells = row.cells;
        if (!cells || cells.length === 0) continue;

        let route = '';
        let vrid = '';
        let foundRoute = false;
        let foundVrid = false;

        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.trim();
            if (cellText.includes('->')) {
                route = cleanText(cellText);
                foundRoute = true;
            }
            if (/^\d{3}[A-Z0-9]+/.test(cellText)) {
                vrid = cleanText(cellText);
                foundVrid = true;
            }
        }

        if (!foundRoute || !foundVrid) {
            console.log(`Fila ${i}: No se encontró route o VRID`);
            continue;
        }

        const carrier = detectCarrier(row);
        console.log(`Fila ${i}: Route=${route}, VRID=${vrid}, Carrier=${carrier}`);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const carrierIndicator = document.createElement('span');
        carrierIndicator.className = `carrier-indicator ${!CARRIER_CONFIGS[carrier].enabled ? 'disabled' : ''}`;
        carrierIndicator.textContent = carrier;
        carrierIndicator.style.backgroundColor = CARRIER_CONFIGS[carrier].color;
        buttonContainer.appendChild(carrierIndicator);

        if (CARRIER_CONFIGS[carrier].isSpecial) {
            const specialMessage = document.createElement('div');
            specialMessage.className = 'special-message';
            specialMessage.textContent = CARRIER_CONFIGS[carrier].specialMessage;
            buttonContainer.appendChild(specialMessage);
        } else {
            const buttons = [
                { type: 'eta', text: 'Solicitar ETA', color: '#2196F3', selectedColor: '#4CAF50' }
            ];

            if (!isInboundPage()) {
                buttons.push({ type: 'ccp', text: 'Solicitar CCP', color: '#FF9800', selectedColor: '#E65100' });
            }

            buttons.forEach(button => {
                const buttonElement = document.createElement('button');
                buttonElement.className = `action-button ${button.type}-action-button`;
                buttonElement.textContent = button.text;
                buttonElement.style.backgroundColor = button.color;
                buttonElement.dataset.carrier = carrier;
                buttonElement.dataset.vrid = vrid;
                buttonElement.disabled = !CARRIER_CONFIGS[carrier].enabled;
                buttonElement.title = CARRIER_CONFIGS[carrier].enabled ?
                    `Solicitar ${button.type.toUpperCase()}` :
                    'Carrier no configurado';

                buttonElement.addEventListener('click', (e) =>
                    handleButtonClick(e, buttonElement, button, route, vrid, carrier)
                );

                buttonContainer.appendChild(buttonElement);
            });
        }

        const lastCell = cells[cells.length - 1];
        lastCell.appendChild(buttonContainer);
        console.log(`Fila ${i}: Botones agregados`);
    }
}

// Función para agregar botones a la tabla
function addActionButtons() {
    const tables = document.querySelectorAll('table');
    console.log(`Encontradas ${tables.length} tablas`);

    tables.forEach((table, index) => {
        console.log(`Procesando tabla ${index + 1}`);
        processTableRows(table);
    });
}

// Función para actualizar contadores
function updateRequestCounters(groupedRequests) {
    const etaCount = document.getElementById('etaCount');
    const ccpCount = document.getElementById('ccpCount');

    let etaTotal = 0;
    let ccpTotal = 0;

    Object.entries(groupedRequests).forEach(([key, units]) => {
        const [, type] = key.split('-');
        if (type === 'eta') etaTotal += units.length;
        if (type === 'ccp') ccpTotal += units.length;
    });

    if (etaCount) etaCount.textContent = etaTotal;
    if (ccpCount) ccpCount.textContent = ccpTotal;
}

// Función de inicialización mejorada
function init() {
    console.log('Iniciando script versión:', APP_CONFIG.version);

    // Mostrar notificación de inicio
    showNotification('Bot ETA-CCP iniciado correctamente', 'success');

    // Crear panel con efecto de entrada
    createWebhookPanel();

    // Observar cambios en el DOM
const observer = new MutationObserver((mutations) => {
    // Debounce para evitar múltiples actualizaciones
    if (window.updateTimeout) clearTimeout(window.updateTimeout);
    window.updateTimeout = setTimeout(() => {
        if (APP_CONFIG.debug) console.log('Cambios detectados en el DOM');
        addActionButtons();
    }, 100);
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributeFilter: ['class']
});
    // Actualizar botones periódicamente
    setInterval(addActionButtons, APP_CONFIG.refreshInterval);

    // Inicializar tema
    const savedTheme = localStorage.getItem('preferred-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

    // Iniciar cuando el documento esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();