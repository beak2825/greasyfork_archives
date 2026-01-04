// ==UserScript==
// @name         YMS Time Highlighter BJX1 - Professional Edition
// @namespace    https://github.com/yourusername
// @version      2.0
// @description  Sistema profesional de monitoreo YMS con análisis en tiempo real para Amazon BJX1. Optimiza el seguimiento de trailers y DWELL mediante una interfaz moderna y eficiente.
// @author       dnaldair
// @match        https://*.amazon.com/yms/shipclerk*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/tuusuariorio/YMS-Time-Highlighter-BJX1/issues
// @downloadURL https://update.greasyfork.org/scripts/555805/YMS%20Time%20Highlighter%20BJX1%20-%20Professional%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/555805/YMS%20Time%20Highlighter%20BJX1%20-%20Professional%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Colores constantes para asegurar consistencia
    const COLORS = {
        DWELL: '#808080',
        WARNING: '#FF4136',
        CAUTION: '#FFA500',
        GOOD: '#2ECC40'
    };

    function addStylesheet() {
        const style = document.createElement('style');
        style.textContent = `
            .yms-dashboard, .yms-time-panel {
                position: fixed !important;
                background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%) !important;
                border-radius: 12px !important;
                padding: 10px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
                z-index: 9999 !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                color: white !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }

            .yms-dashboard {
                top: 10px !important;
                left: 10px !important;
                width: 200px !important;
                transform: scale(0.95) !important;
            }

            .yms-time-panel {
                top: 10px !important;
                right: 10px !important;
                width: 150px !important;
                transform: scale(0.95) !important;
            }

            .yms-card {
                background: linear-gradient(145deg, #2d2d2d 0%, #353535 100%) !important;
                border-radius: 10px !important;
                padding: 10px !important;
                margin-bottom: 8px !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
            }

            .yms-title {
                font-size: 11px !important;
                font-weight: 600 !important;
                margin-bottom: 8px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                cursor: move !important;
                padding: 4px 8px !important;
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 6px !important;
            }

            .yms-stat {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 6px !important;
                padding: 8px !important;
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 6px !important;
                transition: all 0.3s ease !important;
            }

            .yms-stat:hover {
                background: rgba(255, 255, 255, 0.08) !important;
                transform: translateX(2px) !important;
            }

            .yms-stat-label {
                font-size: 11px !important;
                color: #ffffff !important;
                font-weight: 500 !important;
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
            }

            .yms-stat-value {
                font-size: 12px !important;
                font-weight: 600 !important;
                color: white !important;
                background: rgba(255, 255, 255, 0.1) !important;
                padding: 3px 6px !important;
                border-radius: 4px !important;
                min-width: 20px !important;
                text-align: center !important;
            }

            .yms-badge-dwell {
                background: linear-gradient(145deg, #ff3d00 0%, #ff6b4a 100%) !important;
                color: white !important;
                padding: 2px 6px !important;
                border-radius: 4px !important;
                font-size: 10px !important;
                font-weight: 600 !important;
                margin-left: 4px !important;
                box-shadow: 0 2px 4px rgba(255, 61, 0, 0.3) !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .total-stats {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 6px !important;
                text-align: center !important;
            }

            .total-stat-card {
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 6px !important;
                padding: 8px !important;
                text-align: center !important;
                transition: all 0.3s ease !important;
            }

            .total-stat-value {
                font-size: 16px !important;
                font-weight: bold !important;
                margin: 2px 0 !important;
                color: white !important;
                text-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
                text-align: center !important;
            }

            .total-stat-label {
                font-size: 10px !important;
                color: #b3b3b3 !important;
                font-weight: 500 !important;
                text-align: center !important;
            }

            .minimize-button, .refresh-button {
                cursor: pointer !important;
                padding: 2px 6px !important;
                background: rgba(255, 255, 255, 0.1) !important;
                border: none !important;
                border-radius: 4px !important;
                color: white !important;
                font-size: 10px !important;
                transition: all 0.3s ease !important;
            }

            .minimize-button:hover, .refresh-button:hover {
                background: rgba(255, 255, 255, 0.2) !important;
                transform: translateY(-1px) !important;
            }

            .highlight-value {
                color: #ff3d00 !important;
                font-weight: bold !important;
            }
        `;
        document.head.appendChild(style);
    }
    function createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'yms-dashboard';
        dashboard.innerHTML = `
            <div class="yms-title">
                <div style="display: flex; align-items: center; gap: 6px;">
                    📊 YMS Monitor
                    <span id="yms-refresh-button" class="refresh-button">🔄</span>
                </div>
                <span id="yms-minimize-button" class="minimize-button">−</span>
            </div>
            <div id="yms-content">
                <div class="yms-card">
                    <div class="total-stats">
                        <div class="total-stat-card">
                            <div class="total-stat-label">🚛 Total Activos</div>
                            <div class="total-stat-value" id="yms-total-active">0</div>
                        </div>
                        <div class="total-stat-card">
                            <div class="total-stat-label">⚠️ Total DWELL</div>
                            <div class="total-stat-value highlight-value" id="yms-total-dwell">0</div>
                        </div>
                    </div>
                </div>
                <div class="yms-card">
                    <div class="yms-stat">
                        <div class="yms-stat-label">
                            <span>🔄 TransfersInventor</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span class="yms-stat-value" id="transfer-count">0</span>
                            <span class="yms-badge-dwell" id="transfer-dwell" style="display: none;">0</span>
                        </div>
                    </div>
                    <div class="yms-stat">
                        <div class="yms-stat-label">
                            <span>📦 OutboundAMZLWePay</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span class="yms-stat-value" id="outbound-count">0</span>
                            <span class="yms-badge-dwell" id="outbound-dwell" style="display: none;">0</span>
                        </div>
                    </div>
                    <div class="yms-stat">
                        <div class="yms-stat-label">
                            <span>🏭 AAON</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span class="yms-stat-value" id="aaon-count">0</span>
                            <span class="yms-badge-dwell" id="aaon-dwell" style="display: none;">0</span>
                        </div>
                    </div>
                    <div class="yms-stat">
                        <div class="yms-stat-label">
                            <span>🚛 TransfersEmptyCar</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span class="yms-stat-value" id="empty-count">0</span>
                            <span class="yms-badge-dwell" id="empty-dwell" style="display: none;">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dashboard);

        const timePanel = document.createElement('div');
        timePanel.className = 'yms-time-panel';
        timePanel.innerHTML = `
            <div class="yms-title">
                <div>⏱️ Tiempo</div>
                <span id="yms-time-minimize" class="minimize-button">−</span>
            </div>
            <div id="yms-time-content">
                <div class="yms-card">
                    <div class="yms-stat">
                        <span class="yms-stat-label">⚡ +12h</span>
                        <span class="yms-stat-value highlight-value" id="yms-12h">0</span>
                    </div>
                    <div class="yms-stat">
                        <span class="yms-stat-label">📅 +24h</span>
                        <span class="yms-stat-value highlight-value" id="yms-24h">0</span>
                    </div>
                    <div class="yms-stat">
                        <span class="yms-stat-label">⚠️ +48h</span>
                        <span class="yms-stat-value highlight-value" id="yms-48h">0</span>
                    </div>
                    <div class="yms-stat">
                        <span class="yms-stat-label">🚨 +72h</span>
                        <span class="yms-stat-value highlight-value" id="yms-72h">0</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(timePanel);

        makeDraggable(dashboard);
        makeDraggable(timePanel);

        setupMinimizeFunction('yms-minimize-button', 'yms-content');
        setupMinimizeFunction('yms-time-minimize', 'yms-time-content');
    }

    function makeDraggable(element) {
        const titleBar = element.querySelector('.yms-title');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        titleBar.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target === titleBar || titleBar.contains(e.target)) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(0.95)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    function setupMinimizeFunction(buttonId, contentId) {
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);
        if (!button || !content) return;

        button.addEventListener('click', () => {
            const isMinimized = content.style.display === 'none';
            content.style.display = isMinimized ? 'block' : 'none';
            button.textContent = isMinimized ? '−' : '+';
        });
    }
    function parseTimeString(timeStr) {
        try {
            if (!timeStr || typeof timeStr !== 'string') return 0;
            timeStr = timeStr.trim().toLowerCase();
            let hours = 0;

            if (timeStr.includes('day')) {
                const days = parseInt(timeStr);
                if (!isNaN(days)) {
                    hours = days * 24;
                }
            } else if (timeStr.includes(':')) {
                const [h, m] = timeStr.split(':');
                hours = parseInt(h) || 0;
                const minutes = parseInt(m) || 0;
                hours += minutes / 60;
            }

            return hours;
        } catch (error) {
            console.error('Error parsing time:', timeStr);
            return 0;
        }
    }

    function colorearTiempos() {
        const filas = document.querySelectorAll('tbody.masterYardLP tr, tr tr[data-test-yms-row]');

        let stats = {
            active: 0,
            transfer: 0, transferD: 0,
            outbound: 0, outboundD: 0,
            aaon: 0, aaonD: 0,
            empty: 0, emptyD: 0,
            totalDalDwell: 0,
            hours12: 0,
            hours24: 0,
            hours48: 0,
            hours72: 0
        };

        filas.forEach((fila) => {
            try {
                const timeCell = fila.querySelector('.col4 span') || fila.querySelector('td:nth-child(4) span');
                const visitReasonCell = fila.querySelector('.col5 div') || fila.querySelector('td:nth-child(5) div');
                const loadIdElement = fila.querySelector('.col9 .load-identifiers') || fila.querySelector('td:nth-child(9) .load-identifiers');

                if (!timeCell || !visitReasonCell) return;

                const visitReason = visitReasonCell.textContent.trim().toUpperCase();
                if (!visitReason.includes('INBOUND')) return;

                const timeText = timeCell.textContent.trim();
                const hours = parseTimeString(timeText);
                const loadIdText = loadIdElement?.textContent?.trim() || '';

                stats.active++;

                let isInDwell = false;
                if (loadIdText.includes('TransfersInventor')) {
                    isInDwell = hours >= 12;
                } else {
                    isInDwell = hours >= 24;
                }

                // Solo contar para tiempos si está en DWELL
                if (isInDwell) {
                    if (hours >= 72) {
                        stats.hours72++;
                    } else if (hours >= 48) {
                        stats.hours48++;
                    } else if (hours >= 24) {
                        stats.hours24++;
                    } else if (hours >= 12 && loadIdText.includes('TransfersInventor')) {
                        stats.hours12++;
                    }
                }

                let newStyle = '';

                if (loadIdText.includes('TransfersInventor')) {
                    stats.transfer++;
                    if (hours >= 12) {
                        stats.transferD++;
                        stats.totalDwell++;
                        newStyle = `background-color: ${COLORS.DWELL} !important;`;
                    } else if (hours > 10) {
                        newStyle = `background-color: ${COLORS.WARNING} !important;`;
                    } else if (hours > 8) {
                        newStyle = `background-color: ${COLORS.CAUTION} !important;`;
                    } else {
                        newStyle = `background-color: ${COLORS.GOOD} !important;`;
                    }
                } else {
                    if (loadIdText.includes('OutboundAMZLWePay') || loadIdText.includes('INWP') || loadIdText.includes('AAQL')) {
                        stats.outbound++;
                        if (hours >= 24) {
                            stats.outboundD++;
                            stats.totalDwell++;
                        }
                    } else if (loadIdText.includes('AAON') || loadIdText.includes('Xihutec')) {
                        stats.aaon++;
                        if (hours >= 24) {
                            stats.aaonD++;
                            stats.totalDwell++;
                        }
                    } else if (loadIdText.includes('TransfersEmptyCar')) {
                        stats.empty++;
                        if (hours >= 24) {
                            stats.emptyD++;
                            stats.totalDwell++;
                        }
                    }

                    if (hours >= 24) {
                        newStyle = `background-color: ${COLORS.DWELL} !important;`;
                    } else if (hours >= 23) {
                        newStyle = `background-color: ${COLORS.WARNING} !important;`;
                    } else if (hours >= 19) {
                        newStyle = `background-color: ${COLORS.CAUTION} !important;`;
                    } else {
                        newStyle = `background-color: ${COLORS.GOOD} !important;`;
                    }
                }

                newStyle += (newStyle.includes(COLORS.DWELL) || newStyle.includes(COLORS.WARNING)) ?
                    ' color: white !important;' : ' color: black !important;';
                newStyle += ' padding: 2px 6px !important; border-radius: 4px !important; font-weight: bold !important;';

                timeCell.style.cssText = newStyle;

            } catch (error) {
                console.error('Error processing row:', error);
            }
        });

        updateCounters(stats);
    }

    function updateCounters(stats) {
        // Asegurarse que totalDwell sea un número
        stats.totalDwell = stats.transferD + stats.outboundD + stats.aaonD + stats.emptyD;

        // Actualizar totales
        document.getElementById('yms-total-active').textContent = stats.active;
        document.getElementById('yms-total-dwell').textContent = stats.totalDwell;

        // Actualizar contadores de tiempo
        document.getElementById('yms-12h').textContent = stats.hours12;
        document.getElementById('yms-24h').textContent = stats.hours24;
        document.getElementById('yms-48h').textContent = stats.hours48;
        document.getElementById('yms-72h').textContent = stats.hours72;

        // Actualizar contadores por tipo
        const types = [
            {id: 'transfer', count: stats.transfer, dwell: stats.transferD},
            {id: 'outbound', count: stats.outbound, dwell: stats.outboundD},
            {id: 'aaon', count: stats.aaon, dwell: stats.aaonD},
            {id: 'empty', count: stats.empty, dwell: stats.emptyD}
        ];

        types.forEach(type => {
            const countElement = document.getElementById(`${type.id}-count`);
            const dwellElement = document.getElementById(`${type.id}-dwell`);

            if (countElement) countElement.textContent = type.count;
            if (dwellElement) {
                dwellElement.textContent = type.dwell;
                dwellElement.style.display = type.dwell > 0 ? 'inline-flex' : 'none';
            }
        });
    }

    function init() {
        console.log('Iniciando YMS Monitor...');
        addStylesheet();
        createDashboard();

        // Primera ejecución inmediata
        colorearTiempos();

        // Actualizaciones periódicas
        setInterval(colorearTiempos, 15000);

        // Configurar botón de actualización
        const refreshButton = document.getElementById('yms-refresh-button');
        if (refreshButton) {
            refreshButton.onclick = () => {
                colorearTiempos();
                refreshButton.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    refreshButton.style.transform = 'rotate(0deg)';
                }, 500);
            };
        }

        // Sistema de refresco automático
        const checkInterval = setInterval(() => {
            const anyCell = document.querySelector('.col4 span');
            if (anyCell && !anyCell.style.backgroundColor) {
                colorearTiempos();
            }
        }, 5000);

        // Observador para cambios en la tabla
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = mutations.some(mutation =>
                mutation.type === 'childList' ||
                mutation.target.classList.contains('col4')
            );
            if (needsUpdate) {
                requestAnimationFrame(colorearTiempos);
            }
        });

        const targetNode = document.querySelector('.a-container') || document.body;
        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
    }

    // Iniciar el script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();