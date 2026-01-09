// ==UserScript==
// @name         EvoWars.io ESP, TRIGGER BOT
// @version      2.0.1
// @description  Triggerbot, ESP Avançado
// @match        *://evowars.io/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1558269
// @downloadURL https://update.greasyfork.org/scripts/561984/EvoWarsio%20ESP%2C%20TRIGGER%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/561984/EvoWarsio%20ESP%2C%20TRIGGER%20BOT.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ================= CONFIGURAÇÕES ================= */

    const CONFIG = {
        KEYS: {
            TOGGLE_ESP: 'z',
            TOGGLE_AIMBOT: 'x',
            TOGGLE_TRIGGERBOT: 'c',
            RANGE_UP: '=',
            RANGE_DOWN: '-',
            MENU: 'm'
        },

        // Sistema de espada com range manual
        SWORD: {
            TIP_RADIUS: 18,
            MANUAL_RANGE: 150, // Range inicial ajustável
            MIN_RANGE: 50,
            MAX_RANGE: 1200,
            RANGE_STEP: 10 // Aumenta/diminui 10px por vez
        },

        // Hitbox e colisão
        PLAYER_HITBOX: 35,
        PREDICTION_MULTIPLIER: 2, // ✅ CORRIGIDO: era 8, agora é 2

        // Ataque automático
        ATTACK: {
            DELAY: 100,
            DURATION: 50,
            MIN_DISTANCE: 50
        },

        // Cores do ESP
        COLORS: {
            ESP_LINE: '#00ffff',
            ESP_BOX: '#ffffff',
            ESP_NAME: '#ffff00',
            ESP_HP: '#00ff00',
            AIMBOT_LINE: '#ff00ff',
            TARGET_BOX: '#ff0000',
            PREDICTION: '#ffa500',
            SWORD_TIP: '#ff0000',
            HITBOX: 'rgba(255,0,0,0.2)',
            HIT_CONFIRM: '#00ff00'
        }
    };

    /* ================= ESTADO GLOBAL ================= */

    const state = {
        runtime: null,
        playerType: null,
        gameCanvas: null,

        // Features toggle
        espEnabled: true,
        aimbotEnabled: true,
        triggerbotEnabled: true,

        // Controles
        swordRange: CONFIG.SWORD.MANUAL_RANGE,
        lastAttack: 0,
        isAttacking: false,

        // Alvo atual
        currentTarget: null,

        // Menu
        menuVisible: false
    };

    /* ================= CANVAS OVERLAY ================= */

    const overlay = document.createElement('canvas');
    const ctx = overlay.getContext('2d');

    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(overlay);

    function resizeCanvas() {
        overlay.width = window.innerWidth;
        overlay.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* ================= MENU GUI ================= */

    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #00ff00;
        border-radius: 10px;
        padding: 20px;
        color: #fff;
        font-family: monospace;
        font-size: 14px;
        z-index: 10000;
        min-width: 300px;
        display: none;
    `;

    menu.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px; font-size: 18px; color: #00ff00;">
            ⚔️ EVOWARS HACK MENU ⚔️
        </div>
        <div style="text-align: center; margin-bottom: 10px; font-size: 11px; color: #00ff88;">
            ✅ VERSÃO CORRIGIDA - Predição Ajustada
        </div>
        <div style="margin: 10px 0;">
            <span id="esp-status">🟢 ESP: ON</span> - Tecla: ${CONFIG.KEYS.TOGGLE_ESP.toUpperCase()}
        </div>
        <div style="margin: 10px 0;">
            <span id="aimbot-status">🟢 Aimbot: ON</span> - Tecla: ${CONFIG.KEYS.TOGGLE_AIMBOT.toUpperCase()}
        </div>
        <div style="margin: 10px 0;">
            <span id="triggerbot-status">🟢 Triggerbot: ON</span> - Tecla: ${CONFIG.KEYS.TOGGLE_TRIGGERBOT.toUpperCase()}
        </div>
        <div style="margin: 10px 0;">
            <span id="range-status">🎯 Alcance: 150px</span> - Teclas: ${CONFIG.KEYS.RANGE_UP}/${CONFIG.KEYS.RANGE_DOWN}
        </div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #333; font-size: 12px; color: #888;">
            Pressione M para fechar
        </div>
    `;

    document.body.appendChild(menu);

    function updateMenuStatus() {
        document.getElementById('esp-status').textContent =
            `${state.espEnabled ? '🟢' : '🔴'} ESP: ${state.espEnabled ? 'ON' : 'OFF'}`;
        document.getElementById('aimbot-status').textContent =
            `${state.aimbotEnabled ? '🟢' : '🔴'} Aimbot: ${state.aimbotEnabled ? 'ON' : 'OFF'}`;
        document.getElementById('triggerbot-status').textContent =
            `${state.triggerbotEnabled ? '🟢' : '🔴'} Triggerbot: ${state.triggerbotEnabled ? 'ON' : 'OFF'}`;
        document.getElementById('range-status').textContent =
            `🎯 Alcance: ${state.swordRange}px`;
    }

    /* ================= CONTROLE DE ENTRADA ================= */

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        switch(key) {
            case CONFIG.KEYS.TOGGLE_ESP:
                state.espEnabled = !state.espEnabled;
                console.log(`[ESP] ${state.espEnabled ? 'ON' : 'OFF'}`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.TOGGLE_AIMBOT:
                state.aimbotEnabled = !state.aimbotEnabled;
                console.log(`[AIMBOT] ${state.aimbotEnabled ? 'ON' : 'OFF'}`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.TOGGLE_TRIGGERBOT:
                state.triggerbotEnabled = !state.triggerbotEnabled;
                if (!state.triggerbotEnabled) stopAttack();
                console.log(`[TRIGGERBOT] ${state.triggerbotEnabled ? 'ON' : 'OFF'}`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.RANGE_UP:
                state.swordRange = Math.min(state.swordRange + CONFIG.SWORD.RANGE_STEP, CONFIG.SWORD.MAX_RANGE);
                console.log(`[RANGE] Aumentado para ${state.swordRange}px`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.RANGE_DOWN:
                state.swordRange = Math.max(state.swordRange - CONFIG.SWORD.RANGE_STEP, CONFIG.SWORD.MIN_RANGE);
                console.log(`[RANGE] Diminuído para ${state.swordRange}px`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.MENU:
                state.menuVisible = !state.menuVisible;
                menu.style.display = state.menuVisible ? 'block' : 'none';
                break;
        }
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        switch(key) {
            case CONFIG.KEYS.TOGGLE_ESP:
                state.espEnabled = !state.espEnabled;
                console.log(`[ESP] ${state.espEnabled ? 'ON' : 'OFF'}`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.TOGGLE_AIMBOT:
                state.aimbotEnabled = !state.aimbotEnabled;
                console.log(`[AIMBOT] ${state.aimbotEnabled ? 'ON' : 'OFF'}`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.TOGGLE_TRIGGERBOT:
                state.triggerbotEnabled = !state.triggerbotEnabled;
                if (!state.triggerbotEnabled) stopAttack();
                console.log(`[TRIGGERBOT] ${state.triggerbotEnabled ? 'ON' : 'OFF'}`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.RANGE_UP:
                state.swordRange = Math.min(state.swordRange + CONFIG.SWORD.RANGE_STEP, CONFIG.SWORD.MAX_RANGE);
                console.log(`[RANGE] Aumentado para ${state.swordRange}px`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.RANGE_DOWN:
                state.swordRange = Math.max(state.swordRange - CONFIG.SWORD.RANGE_STEP, CONFIG.SWORD.MIN_RANGE);
                console.log(`[RANGE] Diminuído para ${state.swordRange}px`);
                updateMenuStatus();
                break;

            case CONFIG.KEYS.MENU:
                state.menuVisible = !state.menuVisible;
                menu.style.display = state.menuVisible ? 'block' : 'none';
                break;
        }
    });

    /* ================= SISTEMA DE ZOOM ================= */

    function applyZoom() {
        if (!state.runtime?.running_layout) return;

        const layout = state.runtime.running_layout;
        if (layout.scale !== undefined) {
            layout.scale = state.currentZoom;
        }
    }

    /* ================= SISTEMA DE ATAQUE ================= */

    function dispatchMouseEvent(isDown) {
        if (!state.gameCanvas) return;

        state.gameCanvas.dispatchEvent(
            new MouseEvent(isDown ? 'mousedown' : 'mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );
        state.isAttacking = isDown;
    }

    function stopAttack() {
        if (state.isAttacking) {
            dispatchMouseEvent(false);
        }
    }

    function executeAttack() {
        const now = Date.now();
        if (now - state.lastAttack < CONFIG.ATTACK.DELAY) return;

        state.lastAttack = now;
        dispatchMouseEvent(true);

        setTimeout(() => {
            dispatchMouseEvent(false);
        }, CONFIG.ATTACK.DURATION);
    }

    /* ================= FUNÇÕES DE JOGADOR ================= */

    function getPlayerScore(player) {
        return player.instance_vars?.[20] || 0;
    }

    function getPlayerName(player) {
        return player.instance_vars?.[0] || 'Unknown';
    }

    function getPlayerHP(player) {
        return player.instance_vars?.[21] || 100;
    }

    function getPlayerMaxHP(player) {
        return player.instance_vars?.[22] || 100;
    }

    function getPlayerLevel(player) {
        // Nível real está na variável [19] (vai de 1 a 27)
        return player.instance_vars?.[19] || 1;
    }

    function getPlayerVelocity(player) {
        // Estimativa de velocidade baseada em movimento recente
        if (!player.lastX || !player.lastY) {
            player.lastX = player.x;
            player.lastY = player.y;
            return { vx: 0, vy: 0 };
        }

        const vx = player.x - player.lastX;
        const vy = player.y - player.lastY;

        player.lastX = player.x;
        player.lastY = player.y;

        return { vx, vy };
    }

    function predictPlayerPosition(player, frames = CONFIG.PREDICTION_MULTIPLIER) {
        const velocity = getPlayerVelocity(player);
        return {
            x: player.x + (velocity.vx * frames),
            y: player.y + (velocity.vy * frames)
        };
    }

    function findSelfPlayer() {
        if (!state.playerType?.instances || !state.runtime?.running_layout) {
            return null;
        }

        let closestPlayer = null;
        let minDistance = Infinity;

        const scrollX = state.runtime.running_layout.scrollX;
        const scrollY = state.runtime.running_layout.scrollY;

        for (const player of state.playerType.instances) {
            if (!player || player.opacity === 0) continue;

            const distance = Math.hypot(
                player.x - scrollX,
                player.y - scrollY
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestPlayer = player;
            }
        }

        return closestPlayer;
    }

    /* ================= RENDERIZAÇÃO ================= */

    function drawLine(x1, y1, x2, y2, color, width = 2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }

    function drawCircle(x, y, radius, color, fill = false) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    function drawText(text, x, y, color = '#ffffff', size = 12) {
        ctx.font = `bold ${size}px Arial`;
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x + 1, y + 1);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }

    function drawBox(x, y, width, height, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - width/2, y - height/2, width, height);
    }

    /* ================= ESP AVANÇADO ================= */

    function drawESP(self, centerX, centerY, scale) {
        for (const player of state.playerType.instances) {
            if (!player || player.uid === self.uid || player.opacity === 0) continue;

            const deltaX = player.x - self.x;
            const deltaY = player.y - self.y;
            const distance = Math.hypot(deltaX, deltaY);

            const screenX = centerX + deltaX * scale;
            const screenY = centerY + deltaY * scale;

            // Linha ESP
            drawLine(centerX, centerY, screenX, screenY, CONFIG.COLORS.ESP_LINE, 1);

            // Box ao redor do player
            const boxSize = CONFIG.PLAYER_HITBOX * scale;
            drawBox(screenX, screenY, boxSize * 2, boxSize * 2, CONFIG.COLORS.ESP_BOX);

            // Nome do jogador
            const name = getPlayerName(player);
            drawText(name, screenX - 30, screenY - boxSize - 20, CONFIG.COLORS.ESP_NAME, 11);

            // HP Bar
            const hp = getPlayerHP(player);
            const maxHp = getPlayerMaxHP(player);
            const hpPercent = hp / maxHp;
            const barWidth = 50;
            const barHeight = 5;

            ctx.fillStyle = '#ff0000';
            ctx.fillRect(screenX - barWidth/2, screenY - boxSize - 10, barWidth, barHeight);
            ctx.fillStyle = CONFIG.COLORS.ESP_HP;
            ctx.fillRect(screenX - barWidth/2, screenY - boxSize - 10, barWidth * hpPercent, barHeight);

            // Distância
            drawText(`${Math.floor(distance)}m`, screenX - 20, screenY + boxSize + 15, '#ffffff', 10);

            // Score/Level
            const level = getPlayerLevel(player);
            drawText(`Lv.${level}`, screenX - 20, screenY + boxSize + 28, '#ffaa00', 10);
        }
    }

    /* ================= AIMBOT COM PREDIÇÃO ================= */

    function processAimbot(self, centerX, centerY, scale) {
        // Desenhar círculo de alcance ao redor do personagem
const rangeRadius = state.swordRange * scale;

// Círculo preenchido (transparente)
ctx.beginPath();
ctx.arc(centerX, centerY, rangeRadius, 0, Math.PI * 2);
ctx.fillStyle = 'rgba(0, 255, 255, 0.04)';
ctx.fill();

// Borda do círculo
ctx.beginPath();
ctx.arc(centerX, centerY, rangeRadius, 0, Math.PI * 2);
ctx.strokeStyle = 'rgba(0, 255, 255, 0.12)';
ctx.lineWidth = 2;
ctx.stroke();
        let closestEnemy = null;
        let closestDistance = Infinity;

        // Encontrar inimigo mais próximo
        for (const player of state.playerType.instances) {
            if (!player || player.uid === self.uid || player.opacity === 0) continue;

            const distance = Math.hypot(player.x - self.x, player.y - self.y);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = player;
            }
        }

        if (!closestEnemy) {
            state.currentTarget = null;
            stopAttack();
            return;
        }

        state.currentTarget = closestEnemy;

        // Predição de movimento (AGORA COM MULTIPLICADOR CORRETO!)
        const predicted = predictPlayerPosition(closestEnemy);
        const predictedDeltaX = predicted.x - self.x;
        const predictedDeltaY = predicted.y - self.y;

        const predictedScreenX = centerX + predictedDeltaX * scale;
        const predictedScreenY = centerY + predictedDeltaY * scale;

        const currentScreenX = centerX + (closestEnemy.x - self.x) * scale;
        const currentScreenY = centerY + (closestEnemy.y - self.y) * scale;

        // Desenhar predição
        drawCircle(predictedScreenX, predictedScreenY, 10, CONFIG.COLORS.PREDICTION, true);
        drawLine(currentScreenX, currentScreenY, predictedScreenX, predictedScreenY,
                CONFIG.COLORS.PREDICTION, 2);

        // Calcular ângulo para posição predita
        const angle = Math.atan2(predictedDeltaY, predictedDeltaX);

        // Alcance da espada (agora manual, controlado por = e -)
        const swordRange = state.swordRange;

        // Posição da ponta da espada
        const swordTipX = self.x + Math.cos(angle) * swordRange;
        const swordTipY = self.y + Math.sin(angle) * swordRange;

        const tipScreenX = centerX + (swordTipX - self.x) * scale;
        const tipScreenY = centerY + (swordTipY - self.y) * scale;

        // Verificar hit com posição predita
        const distanceToTip = Math.hypot(
            swordTipX - predicted.x,
            swordTipY - predicted.y
        );

        const hitThreshold = CONFIG.SWORD.TIP_RADIUS + CONFIG.PLAYER_HITBOX;
        const canHit = distanceToTip <= hitThreshold;

        // DEBUG: Log para ver o que está acontecendo
        if (state.triggerbotEnabled) {
            console.log(`[TRIGGERBOT DEBUG]
                Nível: ${getPlayerLevel(self)}
                Alcance Espada: ${swordRange.toFixed(0)}px
                Distância até ponta: ${distanceToTip.toFixed(0)}px
                Threshold: ${hitThreshold}px
                Pode acertar: ${canHit}
                Distância inimigo: ${closestDistance.toFixed(0)}px
                Min distância: ${CONFIG.ATTACK.MIN_DISTANCE}px
            `);
        }

        // Linha do aimbot
        const lineColor = canHit ? CONFIG.COLORS.HIT_CONFIRM : CONFIG.COLORS.AIMBOT_LINE;
        drawLine(centerX, centerY, predictedScreenX, predictedScreenY, lineColor, 3);

        // Box do alvo
        drawBox(currentScreenX, currentScreenY,
                CONFIG.PLAYER_HITBOX * scale * 2.5,
                CONFIG.PLAYER_HITBOX * scale * 2.5,
                CONFIG.COLORS.TARGET_BOX);

        // Ponta da espada
        drawCircle(tipScreenX, tipScreenY,
                  CONFIG.SWORD.TIP_RADIUS * scale,
                  canHit ? CONFIG.COLORS.HIT_CONFIRM : CONFIG.COLORS.SWORD_TIP);

        // Hitbox do inimigo
        drawCircle(currentScreenX, currentScreenY,
                  CONFIG.PLAYER_HITBOX * scale,
                  CONFIG.COLORS.HITBOX, true);

        // TRIGGERBOT: Atacar se pode acertar
        if (state.triggerbotEnabled && canHit && closestDistance > CONFIG.ATTACK.MIN_DISTANCE) {
            executeAttack();
        } else if (state.triggerbotEnabled) {
            stopAttack();
        }
    }

    /* ================= LOOP PRINCIPAL ================= */

    function mainLoop() {
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        if (!state.runtime || !state.playerType || !state.gameCanvas) {
            requestAnimationFrame(mainLoop);
            return;
        }

        const self = findSelfPlayer();
        if (!self) {
            requestAnimationFrame(mainLoop);
            return;
        }

        const canvasRect = state.gameCanvas.getBoundingClientRect();
        const centerX = canvasRect.left + canvasRect.width / 2;
        const centerY = canvasRect.top + canvasRect.height / 2;
        const scale = self.layer.getScale();

        // Desenhar ESP
        if (state.espEnabled) {
            drawESP(self, centerX, centerY, scale);
        }

        // Processar Aimbot + Triggerbot
        if (state.aimbotEnabled) {
            processAimbot(self, centerX, centerY, scale);
        } else if (state.triggerbotEnabled) {
            // Triggerbot sem aimbot (modo básico)
            stopAttack();
        }

        requestAnimationFrame(mainLoop);
    }

    /* ================= INICIALIZAÇÃO ================= */

    function initialize() {
        console.log('[HACK] Iniciando...');

        const initInterval = setInterval(() => {
            if (!window.cr_getC2Runtime) return;

            const runtime = window.cr_getC2Runtime();
            if (!runtime?.canvas) return;

            state.runtime = runtime;
            state.gameCanvas = runtime.canvas;

            // Encontrar tipo de jogador (72 variáveis de instância)
            for (const type of runtime.types_by_index) {
                if (type?.instvar_sids?.length === 72) {
                    state.playerType = type;
                    break;
                }
            }

            if (state.playerType) {
                clearInterval(initInterval);
                console.log('╔════════════════════════════════════════╗');
                console.log('║   EVOWARS.IO - HACK                    ║');
                console.log('║                                        ║');
                console.log('╠════════════════════════════════════════╣');
                console.log('║  [Z] Toggle ESP                        ║');
                console.log('║  [X] Toggle Aimbot                     ║');
                console.log('║  [C] Toggle Triggerbot                 ║');
                console.log('║  [=/-] Ajustar Alcance                 ║');
                console.log('║                                        ║');
                console.log('╠════════════════════════════════════════╣');
                console.log('║             by: gabriel                ║');
                console.log('║                                        ║');
                console.log('╚════════════════════════════════════════╝');

                updateMenuStatus();
                mainLoop();
            }
        }, 400);
    }

    // Iniciar o hack
    initialize();
})();