// ==UserScript==
// @name         Claude Usage Monitor
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Monitora l'utilizzo di Claude in tempo reale - Integrato nella UI (con MutationObserver)
// @author       Francy
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/564156/Claude%20Usage%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/564156/Claude%20Usage%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurazione
    const CONFIG = {
        updateInterval: 30000,
        consumptionRates: {
            simpleMessage: 2.5,
            imageOCR: 1.4,
            complexOperation: 4.3
        }
    };

    // Classe per gestire l'API
    class ClaudeUsageAPI {
        constructor() {
            this.baseUrl = 'https://claude.ai/api';
            this.orgId = null;
        }

        async getOrganizationId() {
            if (this.orgId) return this.orgId;

            try {
                const response = await fetch(`${this.baseUrl}/organizations`, {
                    credentials: 'include'
                });
                const orgs = await response.json();
                this.orgId = orgs[0]?.uuid;
                return this.orgId;
            } catch (error) {
                console.error('Errore nel recupero organization ID:', error);
                return null;
            }
        }

        async getUsage() {
            const orgId = await this.getOrganizationId();
            if (!orgId) return null;

            try {
                const response = await fetch(
                    `${this.baseUrl}/organizations/${orgId}/usage`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error('Errore API Usage:', error);
                return null;
            }
        }

        async getCapacityInfo() {
            const usage = await this.getUsage();
            if (!usage || !usage.five_hour) return null;

            const utilization = usage.five_hour.utilization;
            const remaining = 100 - utilization;
            const resetsAt = new Date(usage.five_hour.resets_at);
            const timeUntilReset = resetsAt - Date.now();

            return {
                utilization,
                remaining,
                resetsAt,
                timeUntilReset,
                estimatedCapacity: {
                    simpleMessages: Math.floor(remaining / CONFIG.consumptionRates.simpleMessage),
                    imageOCR: Math.floor(remaining / CONFIG.consumptionRates.imageOCR),
                    complexOperations: Math.floor(remaining / CONFIG.consumptionRates.complexOperation)
                }
            };
        }

        formatTime(ms) {
            if (ms < 0) return 'Resettato';
            const hours = Math.floor(ms / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            if (hours > 0) return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
    }

    // Classe per la UI
    class UsageMonitorUI {
        constructor(api) {
            this.api = api;
            this.isOpen = false;
            this.updateTimer = null;
            this.observer = null;
            this.currentInfo = null;
            this.injectStyles();
            this.startObserving();
            this.startMonitoring();
        }

        injectStyles() {
            if (document.getElementById('claude-usage-styles')) return;

            const style = document.createElement('style');
            style.id = 'claude-usage-styles';
            style.textContent = `
                #claude-usage-button {
                    position: relative;
                }

                .usage-button-inner {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .usage-percentage-badge {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-size: 8px;
                    font-weight: 700;
                    padding: 1px 4px;
                    border-radius: 6px;
                    min-width: 20px;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                }

                .usage-percentage-badge.warning {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                }

                .usage-percentage-badge.danger {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                }

                .usage-panel {
                    position: fixed;
                    top: 60px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                    padding: 20px;
                    min-width: 320px;
                    opacity: 0;
                    transform: translateY(-10px);
                    pointer-events: none;
                    transition: all 0.3s ease;
                    z-index: 10000;
                }

                .usage-panel.open {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: all;
                }

                .usage-panel::before {
                    content: '';
                    position: absolute;
                    top: -6px;
                    right: 20px;
                    width: 12px;
                    height: 12px;
                    background: white;
                    transform: rotate(45deg);
                }

                .usage-header {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .progress-bar-container {
                    background: #e5e7eb;
                    border-radius: 8px;
                    height: 8px;
                    overflow: hidden;
                    margin: 16px 0;
                }

                .progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    transition: width 0.5s ease;
                    border-radius: 8px;
                }

                .progress-bar.warning {
                    background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
                }

                .progress-bar.danger {
                    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
                }

                .usage-stats {
                    display: grid;
                    gap: 10px;
                    margin: 16px 0;
                }

                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    background: #f9fafb;
                    border-radius: 8px;
                    font-size: 13px;
                }

                .stat-label {
                    color: #6b7280;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .stat-value {
                    font-weight: 600;
                    color: #1f2937;
                }

                .capacity-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    margin-top: 12px;
                }

                .capacity-card {
                    text-align: center;
                    padding: 10px;
                    background: #f9fafb;
                    border-radius: 8px;
                }

                .capacity-value {
                    font-size: 18px;
                    font-weight: 700;
                    color: #667eea;
                }

                .capacity-label {
                    font-size: 10px;
                    color: #6b7280;
                    margin-top: 4px;
                }

                .reset-info {
                    margin-top: 16px;
                    padding: 12px;
                    background: #f0f9ff;
                    border-left: 3px solid #3b82f6;
                    border-radius: 6px;
                    font-size: 12px;
                    color: #1e40af;
                }

                .reset-time {
                    font-weight: 600;
                    margin-top: 4px;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }

                .loading-pulse {
                    animation: pulse 1.5s ease-in-out infinite;
                }
            `;
            document.head.appendChild(style);
        }

        startObserving() {
            // Osserva i cambiamenti nel DOM per reinserire il bottone se viene rimosso
            this.observer = new MutationObserver(() => {
                this.ensureButtonExists();
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Prima verifica immediata
            this.ensureButtonExists();
        }

        ensureButtonExists() {
            // Se il bottone esiste già, non fare nulla
            if (document.getElementById('claude-usage-button')) return;

            // Cerca il container delle azioni nella topbar
            const actionsContainer = document.querySelector('[data-testid="wiggle-controls-actions"]');

            if (actionsContainer) {
                this.createButton(actionsContainer);
            }
        }

        createButton(container) {
            // Non creare duplicati
            if (document.getElementById('claude-usage-button')) return;

            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'w-fit';
            buttonWrapper.setAttribute('data-state', 'closed');
            buttonWrapper.id = 'claude-usage-button';

            buttonWrapper.innerHTML = `
                <button class="inline-flex
                    items-center
                    justify-center
                    relative
                    shrink-0
                    can-focus
                    select-none
                    disabled:pointer-events-none
                    disabled:opacity-50
                    disabled:shadow-none
                    disabled:drop-shadow-none border-transparent
                    transition
                    font-base
                    duration-300
                    ease-[cubic-bezier(0.165,0.85,0.45,1)] h-8 w-8 rounded-md active:scale-95 !bg-bg-400 Button_ghost__BUAoh"
                    type="button"
                    aria-label="Utilizzo Claude"
                    id="usage-toggle-btn">
                    <div class="usage-button-inner" style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex-shrink: 0;">
                            <path d="M3 3.5C3 2.67157 3.67157 2 4.5 2H15.5C16.3284 2 17 2.67157 17 3.5V16.5C17 17.3284 16.3284 18 15.5 18H4.5C3.67157 18 3 17.3284 3 16.5V3.5ZM4.5 3C4.22386 3 4 3.22386 4 3.5V16.5C4 16.7761 4.22386 17 4.5 17H15.5C15.7761 17 16 16.7761 16 16.5V3.5C16 3.22386 15.7761 3 15.5 3H4.5ZM6 5.5C6 5.22386 6.22386 5 6.5 5H13.5C13.7761 5 14 5.22386 14 5.5C14 5.77614 13.7761 6 13.5 6H6.5C6.22386 6 6 5.77614 6 5.5ZM6 8.5C6 8.22386 6.22386 8 6.5 8H13.5C13.7761 8 14 8.22386 14 8.5C14 8.77614 13.7761 9 13.5 9H6.5C6.22386 9 6 8.77614 6 8.5ZM6 11.5C6 11.2239 6.22386 11 6.5 11H10.5C10.7761 11 11 11.2239 11 11.5C11 11.7761 10.7761 12 10.5 12H6.5C6.22386 12 6 11.7761 6 11.5ZM6 14.5C6 14.2239 6.22386 14 6.5 14H8.5C8.77614 14 9 14.2239 9 14.5C9 14.7761 8.77614 15 8.5 15H6.5C6.22386 15 6 14.7761 6 14.5Z"/>
                        </svg>
                        <span class="usage-percentage-badge loading-pulse">--</span>
                    </div>
                </button>
            `;

            // Inserisci il bottone PRIMA del bottone di chiusura
            container.insertBefore(buttonWrapper, container.firstChild);

            // Event listeners
            const toggleBtn = buttonWrapper.querySelector('#usage-toggle-btn');

            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel();
            });

            // Aggiorna subito con i dati già disponibili
            if (this.currentInfo) {
                this.updateButtonBadge(this.currentInfo);
            }

            console.log('✅ Bottone usage inserito');
        }

        createPanel() {
            // Crea il panel solo una volta, separato dal bottone
            if (document.getElementById('claude-usage-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'claude-usage-panel';
            panel.className = 'usage-panel';

            panel.innerHTML = `
                <div class="usage-header">
                    <span>📊</span>
                    <span>Utilizzo Claude</span>
                </div>

                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>

                <div class="usage-stats">
                    <div class="stat-row">
                        <span class="stat-label">
                            <span>🔥</span>
                            Utilizzato
                        </span>
                        <span class="stat-value" id="used-percent">0%</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">
                            <span>✨</span>
                            Disponibile
                        </span>
                        <span class="stat-value" id="remaining-percent">100%</span>
                    </div>
                </div>

                <div class="capacity-grid">
                    <div class="capacity-card">
                        <div class="capacity-value" id="cap-messages">--</div>
                        <div class="capacity-label">Messaggi</div>
                    </div>
                    <div class="capacity-card">
                        <div class="capacity-value" id="cap-ocr">--</div>
                        <div class="capacity-label">Img OCR</div>
                    </div>
                    <div class="capacity-card">
                        <div class="capacity-value" id="cap-complex">--</div>
                        <div class="capacity-label">Complessi</div>
                    </div>
                </div>

                <div class="reset-info">
                    <div>⏰ Prossimo reset</div>
                    <div class="reset-time" id="reset-time">Caricamento...</div>
                </div>
            `;

            document.body.appendChild(panel);

            // Chiudi il panel se clicco fuori
            document.addEventListener('click', (e) => {
                const button = document.getElementById('claude-usage-button');
                if (button && !button.contains(e.target) && !panel.contains(e.target)) {
                    this.closePanel();
                }
            });

            this.panel = panel;
        }

        togglePanel() {
            if (!this.panel) {
                this.createPanel();
            }

            this.isOpen = !this.isOpen;

            if (this.isOpen) {
                this.panel.classList.add('open');
            } else {
                this.panel.classList.remove('open');
            }
        }

        closePanel() {
            if (!this.panel) return;
            this.isOpen = false;
            this.panel.classList.remove('open');
        }

        async updateUsage() {
            const info = await this.api.getCapacityInfo();

            if (!info) {
                this.showError();
                return;
            }

            this.currentInfo = info;
            this.updateButtonBadge(info);
            this.updatePanelContent(info);
        }

        updateButtonBadge(info) {
            const badge = document.querySelector('.usage-percentage-badge');
            if (!badge) return;

            badge.classList.remove('loading-pulse');
            badge.textContent = Math.round(info.utilization);
            badge.classList.remove('warning', 'danger');

            if (info.utilization >= 90) {
                badge.classList.add('danger');
            } else if (info.utilization >= 70) {
                badge.classList.add('warning');
            }
        }

        updatePanelContent(info) {
            if (!this.panel) return;

            const progressBar = this.panel.querySelector('.progress-bar');
            progressBar.classList.remove('warning', 'danger');

            if (info.utilization >= 90) {
                progressBar.classList.add('danger');
            } else if (info.utilization >= 70) {
                progressBar.classList.add('warning');
            }

            progressBar.style.width = `${info.utilization}%`;

            document.getElementById('used-percent').textContent = `${Math.round(info.utilization)}%`;
            document.getElementById('remaining-percent').textContent = `${Math.round(info.remaining)}%`;

            document.getElementById('cap-messages').textContent = info.estimatedCapacity.simpleMessages;
            document.getElementById('cap-ocr').textContent = info.estimatedCapacity.imageOCR;
            document.getElementById('cap-complex').textContent = info.estimatedCapacity.complexOperations;

            const resetTimeEl = document.getElementById('reset-time');
            const updateResetTime = () => {
                const timeLeft = this.api.formatTime(info.resetsAt - Date.now());
                resetTimeEl.textContent = `${timeLeft} (${info.resetsAt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })})`;
            };
            updateResetTime();

            if (this.resetCountdown) clearInterval(this.resetCountdown);
            this.resetCountdown = setInterval(updateResetTime, 60000);
        }

        showError() {
            const badge = document.querySelector('.usage-percentage-badge');
            if (badge) {
                badge.classList.remove('loading-pulse');
                badge.textContent = '!';
                badge.classList.add('danger');
            }
        }

        startMonitoring() {
            // Prima chiamata immediata
            this.updateUsage();

            // Poi ogni 30 secondi
            this.updateTimer = setInterval(() => {
                this.updateUsage();
            }, CONFIG.updateInterval);
        }

        destroy() {
            if (this.updateTimer) clearInterval(this.updateTimer);
            if (this.resetCountdown) clearInterval(this.resetCountdown);
            if (this.observer) this.observer.disconnect();

            const button = document.getElementById('claude-usage-button');
            if (button) button.remove();

            if (this.panel) this.panel.remove();
        }
    }

    // Inizializzazione
    function init() {
        const api = new ClaudeUsageAPI();
        const ui = new UsageMonitorUI(api);

        console.log('✅ Claude Usage Monitor attivato con MutationObserver');

        window.claudeUsageMonitor = { api, ui };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();