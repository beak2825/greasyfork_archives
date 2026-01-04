// ==UserScript==
// @name         Drawaria x Hollow Knight Silksong - Hornet Follower
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hornet from Hollow Knight Silksong follows your character around in Drawaria with authentic sounds and dynamic animations!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://ih1.redbubble.net/image.2501187840.3535/pp,504x498-pad,600x600,f8f8f8.u1.jpg
// @downloadURL https://update.greasyfork.org/scripts/548185/Drawaria%20x%20Hollow%20Knight%20Silksong%20-%20Hornet%20Follower.user.js
// @updateURL https://update.greasyfork.org/scripts/548185/Drawaria%20x%20Hollow%20Knight%20Silksong%20-%20Hornet%20Follower.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ----------  PREVENCIÓN DE MÚLTIPLES INSTANCIAS  ---------- */

    if (window.hornetCompanionLoaded) {
        console.log('🕷️ Hornet Companion already loaded, skipping...');
        return;
    }
    window.hornetCompanionLoaded = true;

    /* ----------  CONFIGURACIÓN SEGURA DE HORNET  ---------- */

    const HORNET_CONFIG = {
        imageUrl: 'https://i.ibb.co/jZgRrT4V/ezgif-1b3e16ce996509.gif',
        collisionImageUrl: 'https://i.ibb.co/cKs6VfhW/hollow-knight-silksong-doodle.gif',
        size: 240,
        speed: 1.8,
        followDistance: 60,
        collisionDistance: 50, // Distancia para detectar colisión
        soundInterval: 5000,
        bounceAmplitude: 5,
        bounceSpeed: 0.1,
        maxRetries: 3
    };

    const HORNET_SOUNDS = [
        'https://www.myinstants.com/media/sounds/hollow-knight-hornet-voice-3-2.mp3',
        'https://www.myinstants.com/media/sounds/hollow-knight-hornet-voice-4-2.mp3',
        'https://www.myinstants.com/media/sounds/hollow-knight-hornet-voice-9.mp3',
        'https://www.myinstants.com/media/sounds/hollow-knight-hornet-voice-11.mp3',
        'https://www.myinstants.com/media/sounds/hornet_edino.mp3',
        'https://www.myinstants.com/media/sounds/hollow-knight-hornet-voice-2-3.mp3',
        'https://www.myinstants.com/media/sounds/hollow-knight-hornet-voice-10.mp3'
    ];

    /* ----------  VARIABLES GLOBALES SEGURAS  ---------- */

    let hornetElement = null;
    let targetPlayer = null;
    let animationFrame = null;
    let soundTimeout = null;
    let hornetPosition = { x: 100, y: 100 };
    let bounceOffset = 0;
    let isActive = false;
    let retryCount = 0;
    let lastKnownPosition = { x: 100, y: 100 };
    let isColliding = false; // Nueva variable para estado de colisión
    let currentAnimation = 'following'; // 'following' o 'colliding'

    /* ----------  FUNCIONES DE AUDIO SEGURAS  ---------- */

    function safePreloadSounds() {
        try {
            HORNET_SOUNDS.forEach((url, index) => {
                setTimeout(() => {
                    try {
                        const audio = new Audio();
                        audio.preload = 'metadata';
                        audio.src = url;
                        audio.volume = 0.2;
                    } catch (e) {
                        console.warn(`Failed to preload sound ${index}:`, e);
                    }
                }, index * 200);
            });
        } catch (error) {
            console.error('Error in sound preloading:', error);
        }
    }

    function safePlayHornetSound() {
        try {
            const randomSound = HORNET_SOUNDS[Math.floor(Math.random() * HORNET_SOUNDS.length)];
            const audio = new Audio(randomSound);
            audio.volume = 0.2;

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log('Audio play prevented by browser:', e.name);
                });
            }
        } catch (error) {
            console.error('Error playing Hornet sound:', error);
        }
    }

    function scheduleNextSound() {
        if (soundTimeout) {
            clearTimeout(soundTimeout);
            soundTimeout = null;
        }

        if (!isActive) return;

        try {
            const randomDelay = HORNET_CONFIG.soundInterval + (Math.random() * 6000 - 3000);
            soundTimeout = setTimeout(() => {
                if (isActive && targetPlayer) {
                    safePlayHornetSound();
                    scheduleNextSound();
                }
            }, Math.max(5000, randomDelay));
        } catch (error) {
            console.error('Error scheduling sound:', error);
        }
    }

    /* ----------  FUNCIONES DE DETECCIÓN SEGURAS  ---------- */

    function safeGetCurrentPlayerCoords() {
        try {
            const canvas = document.getElementById('canvas');
            if (!canvas) return null;

            const selfAvatar = document.querySelector('.spawnedavatar[data-playerid]:not([style*="display: none"])');
            if (!selfAvatar) return null;

            const canvasRect = canvas.getBoundingClientRect();
            const avatarRect = selfAvatar.getBoundingClientRect();

            if (!canvasRect.width || !canvasRect.height || !avatarRect.width || !avatarRect.height) {
                return null;
            }

            const coords = {
                x: Math.round((avatarRect.left - canvasRect.left) + (avatarRect.width / 2)),
                y: Math.round((avatarRect.top - canvasRect.top) + (avatarRect.height / 2)),
                width: avatarRect.width,
                height: avatarRect.height,
                element: selfAvatar
            };

            if (coords.x < 0 || coords.y < 0 || coords.x > canvasRect.width || coords.y > canvasRect.height) {
                return lastKnownPosition.x ? lastKnownPosition : null;
            }

            lastKnownPosition = { x: coords.x, y: coords.y };
            retryCount = 0;
            return coords;

        } catch (error) {
            console.error('Error getting player coordinates:', error);
            return lastKnownPosition.x ? lastKnownPosition : null;
        }
    }

    function safeGetPlayerCoords(playerId) {
        try {
            if (!playerId) return null;

            const canvas = document.getElementById('canvas');
            if (!canvas) return null;

            const avatar = document.querySelector(`.spawnedavatar[data-playerid="${playerId}"]:not([style*="display: none"])`);
            if (!avatar) return null;

            const canvasRect = canvas.getBoundingClientRect();
            const avatarRect = avatar.getBoundingClientRect();

            if (!canvasRect.width || !canvasRect.height || !avatarRect.width || !avatarRect.height) {
                return null;
            }

            const coords = {
                x: Math.round((avatarRect.left - canvasRect.left) + (avatarRect.width / 2)),
                y: Math.round((avatarRect.top - canvasRect.top) + (avatarRect.height / 2)),
                width: avatarRect.width,
                height: avatarRect.height,
                element: avatar
            };

            if (coords.x < 0 || coords.y < 0 || coords.x > canvasRect.width || coords.y > canvasRect.height) {
                return null;
            }

            return coords;

        } catch (error) {
            console.error('Error getting target player coordinates:', error);
            return null;
        }
    }

    /* ----------  FUNCIONES DE COLISIÓN Y ANIMACIÓN  ---------- */

    function checkCollision(hornetX, hornetY, playerCoords) {
        if (!playerCoords) return false;

        const canvas = document.getElementById('canvas');
        if (!canvas) return false;

        const canvasRect = canvas.getBoundingClientRect();

        // Convertir posición de Hornet a coordenadas del canvas
        const hornetCanvasX = hornetX - canvasRect.left;
        const hornetCanvasY = hornetY - canvasRect.top;

        // Calcular distancia entre Hornet y el jugador
        const dx = Math.abs(hornetCanvasX - playerCoords.x);
        const dy = Math.abs(hornetCanvasY - playerCoords.y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance <= HORNET_CONFIG.collisionDistance;
    }

    function updateHornetAnimation(newState) {
        if (!hornetElement || currentAnimation === newState) return;

        try {
            currentAnimation = newState;

            if (newState === 'colliding') {
                hornetElement.style.backgroundImage = `url('${HORNET_CONFIG.collisionImageUrl}')`;
                console.log('🕷️ Hornet collision animation activated!');
            } else {
                hornetElement.style.backgroundImage = `url('${HORNET_CONFIG.imageUrl}')`;
                console.log('🕷️ Hornet following animation activated!');
            }
        } catch (error) {
            console.error('Error updating Hornet animation:', error);
        }
    }

    /* ----------  FUNCIONES DE HORNET MEJORADAS  ---------- */

    function createHornetElement() {
        try {
            if (hornetElement) {
                if (hornetElement.parentNode) {
                    hornetElement.parentNode.removeChild(hornetElement);
                }
                hornetElement = null;
            }

            hornetElement = document.createElement('div');
            hornetElement.id = 'hornet-companion';
            hornetElement.style.cssText = `
                position: fixed;
                width: ${HORNET_CONFIG.size}px;
                height: ${HORNET_CONFIG.size}px;
                background-image: url('${HORNET_CONFIG.imageUrl}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                pointer-events: none;
                z-index: 9999;
                transition: background-image 0.3s ease;
                image-rendering: pixelated;
                transform-origin: center;
                display: none;
                will-change: transform, left, top;
            `;

            if (document.body) {
                document.body.appendChild(hornetElement);
                console.log('🕷️ Hornet element created successfully!');
            } else {
                throw new Error('Document body not available');
            }

            // Inicializar estado de animación
            currentAnimation = 'following';
            isColliding = false;

            return hornetElement;

        } catch (error) {
            console.error('Error creating Hornet element:', error);
            return null;
        }
    }

    function safeUpdateHornetPosition() {
        try {
            if (!hornetElement || !targetPlayer || !isActive) return;

            const playerCoords = targetPlayer.type === 'self' ?
                safeGetCurrentPlayerCoords() :
                safeGetPlayerCoords(targetPlayer.id);

            if (!playerCoords) {
                retryCount++;
                if (retryCount > HORNET_CONFIG.maxRetries) {
                    hornetElement.style.display = 'none';
                }
                return;
            }

            retryCount = 0;
            hornetElement.style.display = 'block';

            // Calcular posición objetivo
            const targetX = Math.max(0, playerCoords.x - HORNET_CONFIG.followDistance);
            const targetY = Math.max(0, playerCoords.y - HORNET_CONFIG.followDistance);

            // Movimiento suave con límites
            const dx = targetX - hornetPosition.x;
            const dy = targetY - hornetPosition.y;

            hornetPosition.x += dx * (HORNET_CONFIG.speed / 100);
            hornetPosition.y += dy * (HORNET_CONFIG.speed / 100);

            // Efecto de rebote controlado
            bounceOffset += HORNET_CONFIG.bounceSpeed;
            const bounce = Math.sin(bounceOffset) * HORNET_CONFIG.bounceAmplitude;

            // Obtener canvas para posición relativa
            const canvas = document.getElementById('canvas');
            if (!canvas) return;

            const canvasRect = canvas.getBoundingClientRect();

            // Calcular posición final con límites de pantalla
            const finalX = Math.max(0, Math.min(canvasRect.left + hornetPosition.x, window.innerWidth - HORNET_CONFIG.size));
            const finalY = Math.max(0, Math.min(canvasRect.top + hornetPosition.y + bounce, window.innerHeight - HORNET_CONFIG.size));

            // **NUEVA FUNCIONALIDAD: Detectar colisión y cambiar animación**
            const wasColliding = isColliding;
            isColliding = checkCollision(finalX, finalY, playerCoords);

            // Cambiar animación según el estado de colisión
            if (isColliding && !wasColliding) {
                updateHornetAnimation('colliding');
                console.log('🕷️ Hornet is now colliding with player!');
            } else if (!isColliding && wasColliding) {
                updateHornetAnimation('following');
                console.log('🕷️ Hornet resumed following player!');
            }

            // Aplicar posición de forma segura
            hornetElement.style.left = `${finalX}px`;
            hornetElement.style.top = `${finalY}px`;

            // Voltear sprite según dirección (solo cuando no está colisionando)
            if (!isColliding) {
                const isMovingLeft = dx < -0.5;
                hornetElement.style.transform = `scaleX(${isMovingLeft ? -1 : 1})`;
            } else {
                // Cuando está colisionando, mantener orientación normal
                hornetElement.style.transform = `scaleX(1)`;
            }

        } catch (error) {
            console.error('Error updating Hornet position:', error);
            if (hornetElement) {
                hornetElement.style.display = 'none';
            }
        }
    }

    function startHornetFollowing(playerData) {
        try {
            if (isActive) stopHornetFollowing();

            targetPlayer = playerData;
            isActive = true;
            retryCount = 0;
            isColliding = false; // Reset estado de colisión
            currentAnimation = 'following'; // Reset animación

            // Crear elemento de Hornet
            if (!createHornetElement()) {
                throw new Error('Failed to create Hornet element');
            }

            // Inicializar posición segura
            const initialCoords = playerData.type === 'self' ?
                safeGetCurrentPlayerCoords() :
                safeGetPlayerCoords(playerData.id);

            if (initialCoords) {
                hornetPosition.x = initialCoords.x;
                hornetPosition.y = initialCoords.y;
            }

            // Función de animación segura
            function safeAnimate() {
                if (!isActive) return;

                try {
                    safeUpdateHornetPosition();
                    animationFrame = requestAnimationFrame(safeAnimate);
                } catch (error) {
                    console.error('Animation error:', error);
                    stopHornetFollowing();
                }
            }

            // Iniciar animación después de un breve delay
            setTimeout(() => {
                if (isActive) safeAnimate();
            }, 500);

            // Iniciar sonidos después de un delay mayor
            setTimeout(() => {
                if (isActive) scheduleNextSound();
            }, 2000);

            console.log(`🕷️ Hornet is now safely following ${playerData.name || 'player ' + playerData.id}!`);

        } catch (error) {
            console.error('Error starting Hornet following:', error);
            stopHornetFollowing();
            alert('❌ Error: Could not summon Hornet. Check console for details.');
        }
    }

    function stopHornetFollowing() {
        try {
            console.log('🕷️ Stopping Hornet following...');

            isActive = false;
            targetPlayer = null;
            retryCount = 0;
            isColliding = false; // Reset estado de colisión
            currentAnimation = 'following'; // Reset animación

            // Limpiar animación
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            // Limpiar sonidos
            if (soundTimeout) {
                clearTimeout(soundTimeout);
                soundTimeout = null;
            }

            // Ocultar elemento
            if (hornetElement) {
                hornetElement.style.display = 'none';
            }

            console.log('🕷️ Hornet has stopped following safely.');

        } catch (error) {
            console.error('Error stopping Hornet:', error);
        }
    }

    /* ----------  INTERFAZ DE USUARIO MEJORADA  ---------- */

    function createSafeControlPanel() {
        try {
            // Verificar si ya existe un panel
            const existingPanel = document.getElementById('hornet-control-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            const panel = document.createElement('div');
            panel.id = 'hornet-control-panel';
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9998;
                background: linear-gradient(135deg, #2d1b69, #11998e);
                color: white;
                padding: 20px;
                border-radius: 15px;
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.6);
                border: 2px solid #8e44ad;
                min-width: 280px;
                max-width: 320px;
                backdrop-filter: blur(10px);
            `;

            const title = document.createElement('div');
            title.innerHTML = '🕷️ HORNET FOLLOWER 🕷️';
            title.style.cssText = `
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                margin-bottom: 15px;
                background: linear-gradient(45deg, #e74c3c, #8e44ad);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
            `;
            panel.appendChild(title);

            // **NUEVA SECCIÓN: Estado de Animación**
            const animationStatus = document.createElement('div');
            animationStatus.id = 'hornet-animation-status';
            animationStatus.style.cssText = `
                margin-bottom: 15px;
                padding: 8px;
                background: rgba(0,0,0,0.4);
                border-radius: 8px;
                text-align: center;
                font-size: 12px;
                border: 1px solid #8e44ad;
            `;
            animationStatus.innerHTML = '🎭 Animation: <span style="color: #95a5a6;">Waiting...</span>';
            panel.appendChild(animationStatus);

            // Selector de objetivo
            const targetSection = document.createElement('div');
            targetSection.style.cssText = `margin-bottom: 15px;`;

            const targetLabel = document.createElement('div');
            targetLabel.textContent = '🎯 Follow Target:';
            targetLabel.style.cssText = `margin-bottom: 8px; font-weight: bold; color: #ecf0f1;`;
            targetSection.appendChild(targetLabel);

            const targetSelect = document.createElement('select');
            targetSelect.style.cssText = `
                width: 100%;
                padding: 8px;
                border-radius: 8px;
                border: 2px solid #8e44ad;
                background: rgba(20, 20, 40, 0.9);
                color: #ecf0f1;
                font-size: 13px;
                outline: none;
            `;

            // Opción para seguir a uno mismo
            const selfOption = document.createElement('option');
            selfOption.value = 'self';
            selfOption.textContent = '👤 Follow Myself';
            targetSelect.appendChild(selfOption);

            targetSection.appendChild(targetSelect);
            panel.appendChild(targetSection);

            // Botones de control
            const buttonsDiv = document.createElement('div');
            buttonsDiv.style.cssText = `display: flex; gap: 10px; flex-direction: column;`;

            const startBtn = document.createElement('button');
            startBtn.textContent = '🕷️ SUMMON HORNET';
            startBtn.style.cssText = `
                padding: 12px;
                border-radius: 8px;
                border: none;
                background: linear-gradient(45deg, #e74c3c, #8e44ad);
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
                outline: none;
            `;

            const stopBtn = document.createElement('button');
            stopBtn.textContent = '❌ DISMISS HORNET';
            stopBtn.style.cssText = `
                padding: 12px;
                border-radius: 8px;
                border: none;
                background: linear-gradient(45deg, #34495e, #2c3e50);
                color: white;
                font-weight: bold;
                cursor: not-allowed;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(52, 73, 94, 0.4);
                opacity: 0.6;
                outline: none;
            `;
            stopBtn.disabled = true;

            buttonsDiv.appendChild(startBtn);
            buttonsDiv.appendChild(stopBtn);
            panel.appendChild(buttonsDiv);

            // Estado
            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = `
                margin-top: 15px;
                padding: 10px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                font-size: 12px;
                text-align: center;
                color: #bdc3c7;
            `;
            statusDiv.textContent = '🕷️ Hornet is waiting...';
            panel.appendChild(statusDiv);

            // Event listeners seguros
            startBtn.addEventListener('click', () => {
                try {
                    const selectedTarget = targetSelect.value;

                    let playerData;
                    if (selectedTarget === 'self') {
                        playerData = { type: 'self', name: 'You', id: null };
                    } else {
                        const selectedOption = targetSelect.options[targetSelect.selectedIndex];
                        const playerName = selectedOption ? selectedOption.textContent.replace('🎯 ', '') : 'Unknown';
                        playerData = { type: 'other', name: playerName, id: selectedTarget };
                    }

                    startHornetFollowing(playerData);

                    startBtn.disabled = true;
                    startBtn.style.opacity = '0.6';
                    startBtn.style.cursor = 'not-allowed';

                    stopBtn.disabled = false;
                    stopBtn.style.opacity = '1';
                    stopBtn.style.cursor = 'pointer';

                    statusDiv.textContent = `🕷️ Hornet is following ${playerData.name}!`;
                    statusDiv.style.color = '#2ecc71';

                } catch (error) {
                    console.error('Error in start button:', error);
                    alert('❌ Error starting Hornet. Please try again.');
                }
            });

            stopBtn.addEventListener('click', () => {
                try {
                    stopHornetFollowing();

                    startBtn.disabled = false;
                    startBtn.style.opacity = '1';
                    startBtn.style.cursor = 'pointer';

                    stopBtn.disabled = true;
                    stopBtn.style.opacity = '0.6';
                    stopBtn.style.cursor = 'not-allowed';

                    statusDiv.textContent = '🕷️ Hornet has been dismissed.';
                    statusDiv.style.color = '#e67e22';

                    // Reset estado de animación en interfaz
                    const animStatus = document.getElementById('hornet-animation-status');
                    if (animStatus) {
                        animStatus.innerHTML = '🎭 Animation: <span style="color: #95a5a6;">Waiting...</span>';
                    }

                } catch (error) {
                    console.error('Error in stop button:', error);
                }
            });

            if (document.body) {
                document.body.appendChild(panel);
                console.log('🕷️ Control panel created successfully!');
            }

            return { targetSelect, statusDiv, animationStatus };

        } catch (error) {
            console.error('Error creating control panel:', error);
            return null;
        }
    }

    /* ----------  ACTUALIZACIÓN DE INTERFAZ EN TIEMPO REAL  ---------- */

    function updateAnimationStatusInUI() {
        try {
            const animStatus = document.getElementById('hornet-animation-status');
            if (!animStatus) return;

            if (!isActive) {
                animStatus.innerHTML = '🎭 Animation: <span style="color: #95a5a6;">Waiting...</span>';
            } else if (isColliding) {
                animStatus.innerHTML = '🎭 Animation: <span style="color: #e74c3c;">💥 Colliding</span>';
            } else {
                animStatus.innerHTML = '🎭 Animation: <span style="color: #2ecc71;">🏃 Following</span>';
            }
        } catch (error) {
            console.error('Error updating animation status UI:', error);
        }
    }

    // Modificar safeUpdateHornetPosition para incluir actualización de UI
    const originalSafeUpdateHornetPosition = safeUpdateHornetPosition;
    safeUpdateHornetPosition = function() {
        originalSafeUpdateHornetPosition();
        updateAnimationStatusInUI();
    };

    /* ----------  SISTEMA SEGURO DE GESTIÓN DE JUGADORES  ---------- */

    function safeRefreshPlayerList(targetSelect) {
        if (!targetSelect) return;

        try {
            const currentSelection = targetSelect.value;

            // Preservar opción "Follow Myself"
            while (targetSelect.children.length > 1) {
                targetSelect.removeChild(targetSelect.lastChild);
            }

            // Buscar jugadores de forma segura
            const playerRows = document.querySelectorAll('.playerlist-row[data-playerid]');
            let playersAdded = 0;

            playerRows.forEach(row => {
                try {
                    if (row.dataset.self === 'true') return;
                    if (row.dataset.playerid === '0') return;
                    if (!row.dataset.playerid) return;

                    const nameElement = row.querySelector('.playerlist-name a');
                    const name = nameElement ? nameElement.textContent.trim() : `Player ${row.dataset.playerid}`;

                    if (name && row.dataset.playerid) {
                        const opt = document.createElement('option');
                        opt.value = row.dataset.playerid;
                        opt.textContent = `🎯 ${name}`;
                        targetSelect.appendChild(opt);
                        playersAdded++;
                    }
                } catch (error) {
                    console.warn('Error processing player row:', error);
                }
            });

            // Restaurar selección si es posible
            if (currentSelection && targetSelect.querySelector(`option[value="${currentSelection}"]`)) {
                targetSelect.value = currentSelection;
            }

            console.log(`🎯 Refreshed player list: ${playersAdded} players found`);

        } catch (error) {
            console.error('Error refreshing player list:', error);
        }
    }

    /* ----------  INICIALIZACIÓN SEGURA  ---------- */

    function safeInitialize() {
        try {
            console.log('🕷️ Initializing Hornet Companion (Safe Mode)...');

            // Verificar entorno
            if (!document.body) {
                throw new Error('Document body not ready');
            }

            // Precargar sonidos de forma segura
            setTimeout(safePreloadSounds, 1000);

            // Crear panel de control
            const controlElements = createSafeControlPanel();
            if (!controlElements) {
                throw new Error('Failed to create control panel');
            }

            const { targetSelect, statusDiv } = controlElements;

            // Configurar observador de jugadores con throttling
            let observerTimeout = null;
            const throttledRefresh = () => {
                if (observerTimeout) clearTimeout(observerTimeout);
                observerTimeout = setTimeout(() => {
                    safeRefreshPlayerList(targetSelect);
                }, 500);
            };

            // Observar lista de jugadores
            const playerListElement = document.getElementById('playerlist');
            if (playerListElement) {
                try {
                    const observer = new MutationObserver(throttledRefresh);
                    observer.observe(playerListElement, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['data-playerid']
                    });
                    console.log('👁️ Player list observer configured');
                } catch (observerError) {
                    console.warn('Could not set up player list observer:', observerError);
                }
            }

            // Actualizar lista inicial
            setTimeout(() => safeRefreshPlayerList(targetSelect), 1500);

            console.log('🕷️ Hornet Companion initialized successfully!');

        } catch (error) {
            console.error('Critical error during initialization:', error);
            alert('❌ Hornet Companion failed to load. Check console for details.');
        }
    }

    /* ----------  CLEANUP Y PREVENCIÓN DE MEMORY LEAKS  ---------- */

    function cleanup() {
        try {
            console.log('🧹 Cleaning up Hornet Companion...');

            stopHornetFollowing();

            if (hornetElement && hornetElement.parentNode) {
                hornetElement.parentNode.removeChild(hornetElement);
                hornetElement = null;
            }

            const panel = document.getElementById('hornet-control-panel');
            if (panel && panel.parentNode) {
                panel.parentNode.removeChild(panel);
            }

            window.hornetCompanionLoaded = false;

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

    /* ----------  EVENT LISTENERS GLOBALES  ---------- */

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('error', (event) => {
        if (event.message && event.message.includes('hornet')) {
            console.error('Hornet-related error detected:', event);
            stopHornetFollowing();
        }
    });

    /* ----------  INICIALIZACIÓN CON RETRY  ---------- */

    function initializeWithRetry(attempts = 0) {
        const maxAttempts = 3;

        if (attempts >= maxAttempts) {
            console.error('❌ Max initialization attempts reached');
            return;
        }

        try {
            // Verificar si los elementos necesarios están disponibles
            const canvas = document.getElementById('canvas');
            const playerList = document.getElementById('playerlist');

            if (!canvas || !playerList) {
                console.log(`⏳ Waiting for game elements... (attempt ${attempts + 1}/${maxAttempts})`);
                setTimeout(() => initializeWithRetry(attempts + 1), 2000);
                return;
            }

            safeInitialize();

        } catch (error) {
            console.error(`Initialization attempt ${attempts + 1} failed:`, error);
            setTimeout(() => initializeWithRetry(attempts + 1), 2000);
        }
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => initializeWithRetry(), 1000);
        });
    } else {
        setTimeout(() => initializeWithRetry(), 1000);
    }

    console.log('🕷️ Hornet Companion script loaded - awaiting initialization...');

})();
