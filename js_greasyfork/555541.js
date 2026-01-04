// ==UserScript==
// @name         FlyOrDie Helper - Predator Alert & Stats
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Alerta de predadores próximos e contador de kills/mortes para FlyOrDie
// @author       Mingau
// @match        https://flyordie.io/*
// @match        http://flyordie.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555541/FlyOrDie%20Helper%20-%20Predator%20Alert%20%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/555541/FlyOrDie%20Helper%20-%20Predator%20Alert%20%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estatísticas da sessão
    const stats = {
        kills: 0,
        deaths: 0,
        sessionStart: Date.now(),
        bestStreak: 0,
        currentStreak: 0,
        totalXP: 0
    };

    // Configurações
    const config = {
        alertSound: true,
        alertVisual: true,
        alertDistance: 'medium', // close, medium, far
        showStats: true,
        dangerZoneColor: 'rgba(255, 0, 0, 0.15)'
    };

    // Cria painel principal
    function createMainPanel() {
        const panel = document.createElement('div');
        panel.id = 'flyordie-helper-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: 'Arial', sans-serif;
            font-size: 13px;
            z-index: 9999;
            min-width: 250px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 12px; font-weight: bold; font-size: 16px; border-bottom: 2px solid #4CAF50; padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                <span>🎮 FlyOrDie Helper</span>
                <span id="minimize-btn" style="cursor: pointer; font-size: 20px; user-select: none;">−</span>
            </div>
            
            <div id="panel-content">
                <!-- Alerta de Perigo -->
                <div id="danger-alert" style="display: none; background: rgba(255, 0, 0, 0.2); border: 2px solid #f44336; border-radius: 8px; padding: 10px; margin-bottom: 12px; animation: pulse 1s infinite;">
                    <div style="font-weight: bold; font-size: 14px; color: #ff5252;">⚠️ PREDADOR PRÓXIMO!</div>
                    <div id="danger-info" style="font-size: 11px; margin-top: 5px;"></div>
                </div>
                
                <!-- Estatísticas -->
                <div style="background: rgba(76, 175, 80, 0.15); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                    <div style="font-weight: bold; margin-bottom: 8px; color: #4CAF50;">📊 Estatísticas da Sessão</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                        <div>
                            <div style="color: #aaa;">Kills:</div>
                            <div style="font-size: 18px; font-weight: bold; color: #4CAF50;" id="kills-count">0</div>
                        </div>
                        <div>
                            <div style="color: #aaa;">Mortes:</div>
                            <div style="font-size: 18px; font-weight: bold; color: #f44336;" id="deaths-count">0</div>
                        </div>
                        <div>
                            <div style="color: #aaa;">K/D Ratio:</div>
                            <div style="font-size: 16px; font-weight: bold; color: #FFC107;" id="kd-ratio">0.00</div>
                        </div>
                        <div>
                            <div style="color: #aaa;">Melhor Streak:</div>
                            <div style="font-size: 16px; font-weight: bold; color: #2196F3;" id="best-streak">0</div>
                        </div>
                    </div>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <div style="color: #aaa; font-size: 11px;">Tempo de Jogo:</div>
                        <div style="font-size: 14px; font-weight: bold;" id="session-time">00:00:00</div>
                    </div>
                </div>
                
                <!-- Configurações -->
                <div style="background: rgba(33, 150, 243, 0.15); border-radius: 8px; padding: 12px;">
                    <div style="font-weight: bold; margin-bottom: 8px; color: #2196F3;">⚙️ Configurações</div>
                    
                    <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
                        <input type="checkbox" id="toggle-sound" ${config.alertSound ? 'checked' : ''} style="margin-right: 8px;">
                        <span>🔊 Som de Alerta</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer;">
                        <input type="checkbox" id="toggle-visual" ${config.alertVisual ? 'checked' : ''} style="margin-right: 8px;">
                        <span>👁️ Alerta Visual</span>
                    </label>
                    
                    <div style="margin-top: 10px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaa; font-size: 11px;">
                            Distância de Alerta:
                        </label>
                        <select id="alert-distance" style="width: 100%; padding: 5px; border-radius: 5px; background: rgba(0,0,0,0.5); color: white; border: 1px solid #555;">
                            <option value="close">Muito Perto (⚠️)</option>
                            <option value="medium" selected>Médio (⚠️⚠️)</option>
                            <option value="far">Longe (⚠️⚠️⚠️)</option>
                        </select>
                    </div>
                    
                    <button id="reset-stats" style="width: 100%; margin-top: 12px; padding: 8px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        🔄 Resetar Estatísticas
                    </button>
                </div>
                
                <div style="margin-top: 12px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 11px; color: #aaa;">
                    <div style="font-weight: bold; margin-bottom: 5px;">⌨️ Atalhos:</div>
                    <div>• <b>H</b> - Minimizar/Maximizar</div>
                    <div>• <b>K</b> - Adicionar Kill Manual</div>
                    <div>• <b>D</b> - Adicionar Morte Manual</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        setupEventListeners();
        addCustomStyles();
    }

    // Adiciona estilos CSS customizados
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            #danger-alert.active {
                animation: shake 0.3s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // Sistema de sons de alerta
    function playAlertSound() {
        if (!config.alertSound) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Mostra alerta de predador
    function showDangerAlert(predatorInfo) {
        const alert = document.getElementById('danger-alert');
        const info = document.getElementById('danger-info');
        
        if (alert && config.alertVisual) {
            alert.style.display = 'block';
            alert.classList.add('active');
            info.textContent = predatorInfo || 'Fique atento aos seus arredores!';
            
            playAlertSound();
            
            setTimeout(() => {
                alert.classList.remove('active');
            }, 3000);
        }
    }

    // Esconde alerta
    function hideDangerAlert() {
        const alert = document.getElementById('danger-alert');
        if (alert) {
            alert.style.display = 'none';
            alert.classList.remove('active');
        }
    }

    // Atualiza estatísticas
    function updateStats() {
        document.getElementById('kills-count').textContent = stats.kills;
        document.getElementById('deaths-count').textContent = stats.deaths;
        
        const kd = stats.deaths === 0 ? stats.kills : (stats.kills / stats.deaths);
        document.getElementById('kd-ratio').textContent = kd.toFixed(2);
        
        document.getElementById('best-streak').textContent = stats.bestStreak;
        
        saveStats();
    }

    // Adiciona kill
    function addKill() {
        stats.kills++;
        stats.currentStreak++;
        
        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak;
        }
        
        updateStats();
        showNotification('💀 +1 Kill!', '#4CAF50');
    }

    // Adiciona morte
    function addDeath() {
        stats.deaths++;
        stats.currentStreak = 0;
        
        updateStats();
        showNotification('☠️ Você morreu!', '#f44336');
    }

    // Mostra notificação temporária
    function showNotification(message, color) {
        const notif = document.createElement('div');
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${color};
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }

    // Atualiza timer da sessão
    function updateSessionTime() {
        const elapsed = Date.now() - stats.sessionStart;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const timeElement = document.getElementById('session-time');
        if (timeElement) {
            timeElement.textContent = timeStr;
        }
    }

    // Salva estatísticas no localStorage
    function saveStats() {
        localStorage.setItem('flyordie_stats', JSON.stringify(stats));
    }

    // Carrega estatísticas do localStorage
    function loadStats() {
        const saved = localStorage.getItem('flyordie_stats');
        if (saved) {
            const loaded = JSON.parse(saved);
            stats.kills = loaded.kills || 0;
            stats.deaths = loaded.deaths || 0;
            stats.bestStreak = loaded.bestStreak || 0;
        }
    }

    // Configura event listeners
    function setupEventListeners() {
        // Minimizar/Maximizar
        document.getElementById('minimize-btn').addEventListener('click', () => {
            const content = document.getElementById('panel-content');
            const btn = document.getElementById('minimize-btn');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                btn.textContent = '−';
            } else {
                content.style.display = 'none';
                btn.textContent = '+';
            }
        });
        
        // Toggle som
        document.getElementById('toggle-sound').addEventListener('change', (e) => {
            config.alertSound = e.target.checked;
        });
        
        // Toggle visual
        document.getElementById('toggle-visual').addEventListener('change', (e) => {
            config.alertVisual = e.target.checked;
        });
        
        // Distância de alerta
        document.getElementById('alert-distance').addEventListener('change', (e) => {
            config.alertDistance = e.target.value;
        });
        
        // Reset stats
        document.getElementById('reset-stats').addEventListener('click', () => {
            if (confirm('Tem certeza que deseja resetar todas as estatísticas?')) {
                stats.kills = 0;
                stats.deaths = 0;
                stats.bestStreak = 0;
                stats.currentStreak = 0;
                stats.sessionStart = Date.now();
                updateStats();
                showNotification('✅ Estatísticas Resetadas!', '#2196F3');
            }
        });
        
        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            // H - Toggle painel
            if (e.key === 'h' || e.key === 'H') {
                const panel = document.getElementById('flyordie-helper-panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                }
            }
            
            // K - Adicionar kill manual
            if (e.key === 'k' || e.key === 'K') {
                addKill();
            }
            
            // D - Adicionar morte manual
            if (e.key === 'd' || e.key === 'D') {
                addDeath();
            }
        });
    }

    // Simulador de detecção de predadores (exemplo - precisa ser adaptado ao jogo real)
    function monitorPredators() {
        // Nota: Esta é uma função de exemplo. Para funcionar de verdade, 
        // seria necessário acessar os dados do jogo (posições dos jogadores, etc)
        // que podem variar dependendo de como o FlyOrDie armazena essas informações
        
        // Simulação de alerta aleatório para demonstração
        const randomCheck = Math.random();
        if (randomCheck < 0.05) { // 5% de chance a cada verificação
            showDangerAlert('Detectado: Predador a aproximadamente 200m');
            setTimeout(hideDangerAlert, 5000);
        }
    }

    // Inicialização
    function init() {
        console.log('🎮 FlyOrDie Helper carregado!');
        console.log('📊 Atalhos: H (toggle), K (kill manual), D (morte manual)');
        
        loadStats();
        createMainPanel();
        updateStats();
        
        // Atualiza timer a cada segundo
        setInterval(updateSessionTime, 1000);
        
        // Monitora predadores a cada 2 segundos
        setInterval(monitorPredators, 2000);
    }

    // Aguarda o jogo carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();