// ==UserScript==
// @name         Drawaria Racing Minigame Mod
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Top-down racing minigame with polished physics and AI, overlay on drawaria.online.
// @author       YouTubeDrawaria
// @include	     https://drawaria.online/*
// @include	     https://*.drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551755/Drawaria%20Racing%20Minigame%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/551755/Drawaria%20Racing%20Minigame%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =====================================================================
    // CONFIGURACIÓN GLOBAL
    // =====================================================================
    const CONFIG = {
        // ACTIVATION_KEY: 'r',      // ELIMINADO: La activación ahora es por Menú de Usuario.
        NUM_AI_CARS: 2,             // Cantidad de autos controlados por IA
        CANVAS_Z_INDEX: 10000,      // Asegura que el juego esté encima de todo
        LAP_GOAL: 3,                // Vueltas para ganar
        // Parámetros de la Física (Ajustados para jugabilidad tipo arcade)
        ACCELERATION: 0.17,         // Aceleración más rápida (usado en Car.update)
        MAX_SPD: 6,                 // Velocidad máxima (usado en Car.update)
        BRAKE: 0.13,                // Fuerza de frenado (usado en Car.update)
        FRICTION: 0.015,            // Fricción mínima (usado en Car.update)
        GRIP: 0.85,                 // Agarre: 0.85 permite drift sutil y controlable (usado en Car.update)
        TURN_GAIN: 0.065,           // Ganancia de giro (usado en Car.update)
        MIN_TURN_SPEED: 0.45,       // Mínimo giro incluso a baja velocidad (usado en Car.update)
    };

    // =====================================================================
    // UTILIDADES DE FÍSICA Y MATEMÁTICAS
    // =====================================================================

    const degToRad = (deg) => deg * (Math.PI / 180);
    const dist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const normalizeAngle = (angle) => {
        while (angle < 0) angle += 2 * Math.PI;
        while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
        return angle;
    };

    // =====================================================================
    // CLASE VIRTUALJOYSTICK (SIN CAMBIOS)
    // =====================================================================

    class VirtualJoystick {
        // ... [Código de VirtualJoystick sin cambios] ...
        constructor(canvas) {
            this.canvas = canvas;
            this.active = false;
            this.baseX = 0;
            this.baseY = 0;
            this.stickX = 0;
            this.stickY = 0;
            this.radius = 60;
            this.maxPull = 45;
            this.steering = 0;
            this.thrust = 0;

            this.initialBaseX = 100;
            this.initialBaseY = canvas.height - 100;

            this.canvas.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
            this.canvas.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
            this.canvas.addEventListener('touchend', this.handleEnd.bind(this), { passive: false });
            this.canvas.addEventListener('touchcancel', this.handleEnd.bind(this), { passive: false });
        }

        handleStart(e) {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.baseX = this.baseX || this.initialBaseX;
            this.baseY = this.baseY || this.initialBaseY;

            for (let touch of e.changedTouches) {
                const touchX = touch.clientX - rect.left;
                const touchY = touch.clientY - rect.top;

                if (dist(touchX, touchY, this.baseX, this.baseY) < this.radius + this.maxPull) {
                    this.active = true;
                    this.stickX = touchX;
                    this.stickY = touchY;
                    break;
                }
            }
        }

        handleMove(e) {
            if (!this.active) return;
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            let touch = Array.from(e.changedTouches).find(t =>
                dist(t.clientX - rect.left, t.clientY - rect.top, this.baseX, this.baseY) < this.radius + this.maxPull * 2
            );

            if (!touch) return;

            let dx = touch.clientX - rect.left - this.baseX;
            let dy = touch.clientY - rect.top - this.baseY;
            let distance = dist(0, 0, dx, dy);

            if (distance > this.maxPull) {
                dx *= this.maxPull / distance;
                dy *= this.maxPull / distance;
            }

            this.stickX = this.baseX + dx;
            this.stickY = this.baseY + dy;

            this.steering = dx / this.maxPull;
            this.thrust = -dy / this.maxPull;
        }

        handleEnd(e) {
            const rect = this.canvas.getBoundingClientRect();
            let endedJoystickTouch = Array.from(e.changedTouches).some(t =>
                dist(t.clientX - rect.left, t.clientY - rect.top, this.baseX, this.baseY) < this.radius + this.maxPull * 2
            );

            if (endedJoystickTouch) {
                this.active = false;
                this.steering = 0;
                this.thrust = 0;
                this.stickX = this.baseX;
                this.stickY = this.baseY;
            }
        }

        draw(ctx) {
            this.baseX = this.canvas.width * 0.1;
            this.baseY = this.canvas.height * 0.85;

            if (!this.active) {
                this.stickX = this.baseX;
                this.stickY = this.baseY;
            }

            ctx.beginPath();
            ctx.arc(this.baseX, this.baseY, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.stickX, this.stickY, this.radius * 0.4, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fill();
        }

        cleanup() {
            this.canvas.removeEventListener('touchstart', this.handleStart);
            this.canvas.removeEventListener('touchmove', this.handleMove);
            this.canvas.removeEventListener('touchend', this.handleEnd);
            this.canvas.removeEventListener('touchcancel', this.handleEnd);
        }
    }


    // =====================================================================
    // CLASE CAR (AUTO) - FÍSICA Y AI MEJORADAS
    // =====================================================================

    class Car {
        constructor(x, y, angle, color, isPlayer = false, waypoints = []) {
            this.x = x;
            this.y = y;
            this.angle = angle;
            this.color = color;
            this.isPlayer = isPlayer;
            this.width = 15;
            this.height = 25;

            this.vx = 0;
            this.vy = 0;
            this.speed = 0;

            this.thrustInput = 0;
            this.turnLeft = false;
            this.turnRight = false;

            this.waypoints = waypoints;
            this.currentWaypoint = 0;

            this.laps = 0;
            this.lastCheckpoint = 0;
            this.position = 1;

            this.dustTrail = [];
        }

        /**
         * Lógica de Física (Arcade-Drift Controlable)
         * Implementación de la física robusta solicitada por el usuario.
         */
        update(inputs) {
            let thrust = 0, turnLeft = false, turnRight = false;

            if (!this.isPlayer) {
                // La IA actualiza sus propios controles
                this._updateAI();
                thrust = this.thrustInput;
                turnLeft = this.turnLeft;
                turnRight = this.turnRight;
            } else {
                // El jugador usa los inputs
                thrust = inputs.thrust;
                turnLeft = inputs.turnLeft;
                turnRight = inputs.turnRight;
            }

            // Constantes de la nueva física
            const ACC = CONFIG.ACCELERATION;
            const MAX_SPD = CONFIG.MAX_SPD;
            const BRAKE = CONFIG.BRAKE;
            const FRICTION = CONFIG.FRICTION;
            const GRIP = CONFIG.GRIP;
            const TURN_GAIN = CONFIG.TURN_GAIN;
            const MIN_TURN_SPEED = CONFIG.MIN_TURN_SPEED;

            // 1. Aceleración/Frenado (solo en alcance adelante o atrás)
            let forward = Math.cos(this.angle - Math.PI/2);
            let forwardY = Math.sin(this.angle - Math.PI/2);

            // Ajuste de aceleración/frenado
            if (thrust > 0.1) {
                this.vx += forward * ACC * thrust;
                this.vy += forwardY * ACC * thrust;
            } else if (thrust < -0.1) {
                // Frenar como aceleración inversa
                this.vx -= forward * BRAKE * Math.abs(thrust);
                this.vy -= forwardY * BRAKE * Math.abs(thrust);
            }

            // 2. Fricción - reduce todo movimiento ligeramente
            this.vx *= (1 - FRICTION);
            this.vy *= (1 - FRICTION);

            // 3. Aplica grip para limitar el drift lateral
            let speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
            if (speed > 0.001) {
                // Vector en la dirección del auto
                let carDirX = forward;
                let carDirY = forwardY;
                // Proyección de la velocidad sobre el eje del auto
                let dot = this.vx * carDirX + this.vy * carDirY;
                let lateralVx = this.vx - (dot * carDirX);
                let lateralVy = this.vy - (dot * carDirY);

                // Reduce el lateral (drift)
                this.vx -= lateralVx * GRIP;
                this.vy -= lateralVy * GRIP;
            }

            // 4. Limita la velocidad máxima
            let vel = Math.sqrt(this.vx ** 2 + this.vy ** 2);
            if (vel > MAX_SPD) {
                this.vx *= MAX_SPD / vel;
                this.vy *= MAX_SPD / vel;
            }

            // 5. Giro - giro suave
            let turn = 0;
            if (turnLeft) turn -= 1;
            if (turnRight) turn += 1;

            // Ganancia de giro escalado con la velocidad, pero nunca cero
            this.angle += turn * (TURN_GAIN * Math.max(MIN_TURN_SPEED, speed / MAX_SPD));
            this.angle = normalizeAngle(this.angle);

            // 6. Movimiento
            this.x += this.vx;
            this.y += this.vy;

            // 7. Guardar para velocímetro, drift, etc.
            this.speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
            this._addDustTrail();
        }

        /**
         * Lógica de AI Mejorada (Apunta directamente y modula la velocidad en curvas)
         */
        _updateAI() {
            if (this.waypoints.length === 0) return;

            const target = this.waypoints[this.currentWaypoint];
            let dx = target.x - this.x;
            let dy = target.y - this.y;
            const targetDist = dist(0, 0, dx, dy);

            const AI_TURN_LIMIT = 0.05; // Margen de error para el giro
            const AI_SLOWDOWN_DIST = 150; // Distancia para empezar a frenar

            // 1. Avance de Waypoint: Solo por distancia (con más waypoints funciona bien)
            if (targetDist < 40) {
                this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
                if (this.currentWaypoint === 0) {
                    this.laps++;
                }
            }

            // 2. Ángulo Objetivo (Sin el PI/2 extra, solo apunta al waypoint)
            let targetAngle = Math.atan2(dy, dx) + Math.PI / 2; // Mantener PI/2 por la orientación del sprite
            targetAngle = normalizeAngle(targetAngle);

            let diff = targetAngle - this.angle;
            if (diff > Math.PI) diff -= 2 * Math.PI;
            if (diff < -Math.PI) diff += 2 * Math.PI;

            // 3. Control de Giro Suavizado (umbral de giro más amplio)
            this.turnLeft = diff < -AI_TURN_LIMIT;
            this.turnRight = diff > AI_TURN_LIMIT;

            // 4. Modulación de Aceleración (Frenado Progresivo)
            const absDiff = Math.abs(diff);

            // Ajuste de aceleración: acelera menos cuanto más tenga que girar
            let thrust = 1 - (absDiff / Math.PI) * 2; // 1 (recto) a -1 (giro de 180)
            thrust = Math.max(0.2, thrust); // Mínimo de aceleración para no detenerse

            // Frenar extra si la curva es muy cerrada y está cerca
            if (absDiff > degToRad(45) && targetDist < AI_SLOWDOWN_DIST) {
                thrust = Math.min(thrust, 0.4); // Forzar la velocidad a ser baja en curvas cerradas
            }

            this.thrustInput = thrust;
        }

        // ... [Los métodos _addDustTrail, draw, correctCollision son los mismos] ...
        _addDustTrail() {
            const slipAngle = Math.abs(normalizeAngle(this.angle - Math.atan2(this.vy, this.vx) - Math.PI / 2));
            if (this.speed > 1.5 && slipAngle > degToRad(20) && Math.random() < 0.3) {
                this.dustTrail.push({
                    x: this.x - Math.cos(this.angle - Math.PI / 2) * this.height * 0.4,
                    y: this.y - Math.sin(this.angle - Math.PI / 2) * this.height * 0.4,
                    size: 4 + Math.random() * 3,
                    opacity: 1
                });
            }
            this.dustTrail = this.dustTrail.filter(p => {
                p.opacity -= 0.05;
                p.size *= 0.95;
                return p.opacity > 0;
            });
        }

        draw(ctx) {
            this.dustTrail.forEach(p => {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
                ctx.fill();
            });

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width, this.height);

            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(-this.width / 3, -this.height / 3, this.width / 1.5, this.height / 4);

            if (this.isPlayer) {
                ctx.strokeStyle = 'gold';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, this.height * 0.7, 0, 2 * Math.PI);
                ctx.stroke();
            }

            ctx.restore();
        }

        correctCollision(normalX, normalY) {
            const pushStrength = 0.5;
            this.x += normalX * pushStrength;
            this.y += normalY * pushStrength;

            this.vx *= 0.8;
            this.vy *= 0.8;
        }
    }


    // =====================================================================
    // CLASE RACINGGAME (CONTROLADOR PRINCIPAL)
    // =====================================================================

    class RacingGame {
        constructor() {
            this.isRunning = false;
            this.overlayDiv = null;
            this.canvas = null;
            this.ctx = null;
            this.lastTime = 0;
            this.rafHandle = null;

            this.width = 0;
            this.height = 0;
            this.trackCenterX = 0;
            this.trackCenterY = 0;
            this.trackOuterW = 0;
            this.trackOuterH = 0;
            this.trackInnerW = 0;
            this.trackInnerH = 0;
            this.trackCornerRadius = 0;
            this.trackWidth = 100;

            this.keys = {};
            this.playerCar = null;
            this.aiCars = [];
            this.cars = [];
            this.joystick = null;
            this.obstacles = [];
            this.checkpoints = [];

            this.startTime = 0;
            this.gameStatus = 'RACING';
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            this._setupDOM();
            this._initDimensions();
            this._setupListeners();
            this._setupGameObjects();
            this.startTime = Date.now();
            this.rafHandle = requestAnimationFrame(this._gameLoop.bind(this));
        }

        stop() {
            if (!this.isRunning) return;
            this.isRunning = false;
            cancelAnimationFrame(this.rafHandle);
            this._cleanupListeners();
            this._cleanupDOM();
        }

        // ... [Métodos _setupDOM, _initDimensions, _setupCheckpoints sin cambios importantes] ...
        _setupDOM() {
            this.overlayDiv = document.createElement('div');
            this.overlayDiv.id = 'racing-overlay';
            this.overlayDiv.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: ${CONFIG.CANVAS_Z_INDEX}; background-color: rgba(0, 0, 0, 0.8);
                display: flex; justify-content: center; align-items: center;
            `;

            this.canvas = document.createElement('canvas');
            this.canvas.id = 'racing-canvas';
            this.overlayDiv.appendChild(this.canvas);
            document.body.appendChild(this.overlayDiv);

            this.ctx = this.canvas.getContext('2d');
            this.joystick = new VirtualJoystick(this.canvas);
        }

        _initDimensions() {
            this.width = window.innerWidth * 0.95;
            this.height = window.innerHeight * 0.95;
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.trackCenterX = this.width / 2;
            this.trackCenterY = this.height / 2;

            const trackSize = Math.min(this.width, this.height) * 0.8;
            this.trackOuterW = trackSize * 1.5;
            this.trackOuterH = trackSize;

            this.trackCornerRadius = Math.min(this.trackOuterW, this.trackOuterH) * 0.15;
            this.trackWidth = 100;

            this.trackInnerW = this.trackOuterW - 2 * this.trackWidth;
            this.trackInnerH = this.trackOuterH - 2 * this.trackWidth;

            this.joystick.initialBaseY = this.height - 100;

            this._setupCheckpoints();
        }

        _setupCheckpoints() {
            const gap = 10;
            this.checkpoints = [
                // 0: Start/Finish
                { x1: this.trackCenterX - 50, y1: this.trackCenterY + this.trackOuterH / 2 - gap, x2: this.trackCenterX + 50, y2: this.trackCenterY + this.trackOuterH / 2 - gap, hit: false, isStart: true },
                // 1: Mid-Right
                { x1: this.trackCenterX + this.trackOuterW / 2 - gap, y1: this.trackCenterY - 50, x2: this.trackCenterX + this.trackOuterW / 2 - gap, y2: this.trackCenterY + 50, hit: false, isStart: false },
                // 2: Mid-Top
                { x1: this.trackCenterX - 50, y1: this.trackCenterY - this.trackOuterH / 2 + gap, x2: this.trackCenterX + 50, y2: this.trackCenterY - this.trackOuterH / 2 + gap, hit: false, isStart: false },
                // 3: Mid-Left
                { x1: this.trackCenterX - this.trackOuterW / 2 + gap, y1: this.trackCenterY - 50, x2: this.trackCenterX - this.trackOuterW / 2 + gap, y2: this.trackCenterY + 50, hit: false, isStart: false },
            ];
        }

        /**
         * Generación de 8 Waypoints para una IA más suave (Mejorado)
         */
        _setupGameObjects() {
            const trackW_Half = this.trackOuterW / 2 - this.trackWidth / 2;
            const trackH_Half = this.trackOuterH / 2 - this.trackWidth / 2;

            // 8 Waypoints para una mejor navegación del óvalo
            const waypoints = [
                { x: this.trackCenterX, y: this.trackCenterY - trackH_Half }, // Top-Center (0)
                { x: this.trackCenterX + trackW_Half / 2, y: this.trackCenterY - trackH_Half / 2 }, // Top-Right (1)
                { x: this.trackCenterX + trackW_Half, y: this.trackCenterY }, // Mid-Right (2)
                { x: this.trackCenterX + trackW_Half / 2, y: this.trackCenterY + trackH_Half / 2 }, // Bottom-Right (3)
                { x: this.trackCenterX, y: this.trackCenterY + trackH_Half }, // Bottom-Center (4) - START/FINISH
                { x: this.trackCenterX - trackW_Half / 2, y: this.trackCenterY + trackH_Half / 2 }, // Bottom-Left (5)
                { x: this.trackCenterX - trackW_Half, y: this.trackCenterY }, // Mid-Left (6)
                { x: this.trackCenterX - trackW_Half / 2, y: this.trackCenterY - trackH_Half / 2 }, // Top-Left (7)
            ];

            const startY = this.trackCenterY + trackH_Half;
            const startAngle = 0; // Mirando hacia arriba

            this.playerCar = new Car(this.trackCenterX - 20, startY, startAngle, '#1E90FF', true);
            this.cars = [this.playerCar];

            for (let i = 0; i < CONFIG.NUM_AI_CARS; i++) {
                const colors = ['#FFD700', '#3CB371'];
                const aiCar = new Car(this.trackCenterX + (i * 20), startY + 10, startAngle, colors[i % colors.length], false, waypoints);
                // La IA debe empezar en el waypoint 4 (Bottom-Center)
                aiCar.currentWaypoint = 4;
                this.aiCars.push(aiCar);
                this.cars.push(aiCar);
            }

            this.cars.forEach(car => car.lastCheckpoint = this.checkpoints.length - 1);

            this.obstacles = [
                { x: this.trackCenterX, y: this.trackCenterY - this.trackInnerH / 4, radius: 20 },
                { x: this.trackCenterX, y: this.trackCenterY + this.trackInnerH / 4, radius: 20 },
                { x: this.trackCenterX + 20, y: this.trackCenterY + 10, radius: 20 }
            ];

            // ELIMINADO: this._setupButtons(); // Botones gestionados por GM_registerMenuCommand
        }

        // ELIMINADO: _setupButtons() { /* Lógica del botón de salir eliminada */ }

        _setupListeners() {
            this.boundKeyDown = this._handleKeyDown.bind(this);
            this.boundKeyUp = this._handleKeyUp.bind(this);
            this.boundResize = this._initDimensions.bind(this);
            // ELIMINADO: this.boundKeyToggle = this._handleGlobalToggle.bind(this);

            document.addEventListener('keydown', this.boundKeyDown);
            document.addEventListener('keyup', this.boundKeyUp);
            window.addEventListener('resize', this.boundResize);
            // ELIMINADO: document.addEventListener('keydown', this.boundKeyToggle);
        }

        _cleanupListeners() {
            document.removeEventListener('keydown', this.boundKeyDown);
            document.removeEventListener('keyup', this.boundKeyUp);
            window.removeEventListener('resize', this.boundResize);
            // ELIMINADO: document.removeEventListener('keydown', this.boundKeyToggle);
            if (this.joystick) this.joystick.cleanup();
        }

        _cleanupDOM() {
            if (this.overlayDiv && this.overlayDiv.parentNode) {
                this.overlayDiv.parentNode.removeChild(this.overlayDiv);
            }
            // Eliminada la lógica para ocultar el botón de Reiniciar, ya que no se crea.
        }

        _handleKeyDown(e) {
            if (e.key === 'Escape') {
                this.stop();
                return;
            }
            switch (e.key.toLowerCase()) {
                case 'arrowup': case 'w': this.keys.accelerate = true; break;
                case 'arrowdown': case 's': this.keys.brake = true; break;
                case 'arrowleft': case 'a': this.keys.turnLeft = true; break;
                case 'arrowright': case 'd': this.keys.turnRight = true; break;
            }
        }

        _handleKeyUp(e) {
            switch (e.key.toLowerCase()) {
                case 'arrowup': case 'w': this.keys.accelerate = false; break;
                case 'arrowdown': case 's': this.keys.brake = false; break;
                case 'arrowleft': case 'a': this.keys.turnLeft = false; break;
                case 'arrowright': case 'd': this.keys.turnRight = false; break;
            }
        }

        _getCarInputs(car) {
            if (car.isPlayer && this.joystick && this.joystick.active) {
                return {
                    thrust: this.joystick.thrust,
                    turnLeft: this.joystick.steering < -0.1,
                    turnRight: this.joystick.steering > 0.1
                };
            } else if (car.isPlayer) {
                return {
                    thrust: this.keys.accelerate ? 1 : (this.keys.brake ? -1 : 0),
                    turnLeft: this.keys.turnLeft,
                    turnRight: this.keys.turnRight
                };
            }
            return {};
        }

        // ELIMINADO: _handleGlobalToggle(e) { ... }

        // ... [Los métodos _gameLoop, _update, _checkCollisions, _checkLapProgress, _draw, _drawTrack, _drawRoundedRect, _drawStylizedObstacle, _drawUI, _drawWinScreen siguen aquí] ...

        _gameLoop(time) {
            if (!this.isRunning) return;

            const deltaTime = (time - this.lastTime) / (1000 / 60);
            this.lastTime = time;

            this._update(deltaTime);
            this._draw();

            this.rafHandle = requestAnimationFrame(this._gameLoop.bind(this));
        }

        _update(deltaTime) {
            if (this.gameStatus === 'FINISHED') return;

            this.cars.forEach(car => {
                const inputs = this._getCarInputs(car);
                car.update(inputs, deltaTime);
            });

            this.cars.forEach(car => this._checkCollisions(car));

            this.cars.forEach(car => this._checkLapProgress(car));

            this.cars.sort((a, b) => {
                if (a.laps !== b.laps) return b.laps - a.laps;
                if (a.currentWaypoint !== b.currentWaypoint) return b.currentWaypoint - a.currentWaypoint;
                return dist(a.x, a.y, b.x, b.y);
            });
            this.cars.forEach((car, index) => car.position = index + 1);

            if (this.playerCar.laps >= CONFIG.LAP_GOAL) {
                this.gameStatus = 'FINISHED';
            }
        }

        _checkCollisions(car) {
            const w = this.trackOuterW / 2;
            const h = this.trackOuterH / 2;
            const innerW = this.trackInnerW / 2;
            const innerH = this.trackInnerH / 2;
            const x = this.trackCenterX;
            const y = this.trackCenterY;

            if (car.x > x - innerW && car.x < x + innerW && car.y > y - innerH && car.y < y + innerH) {
                const angle = Math.atan2(car.y - y, car.x - x);
                car.correctCollision(Math.cos(angle), Math.sin(angle));
            }

            const trackW = this.trackOuterW / 2;
            const trackH = this.trackOuterH / 2;
            if (car.x < x - trackW || car.x > x + trackW || car.y < y - trackH || car.y > y + trackH) {
                const angle = Math.atan2(y - car.y, x - car.x);
                car.correctCollision(Math.cos(angle), Math.sin(angle));
            }

            this.obstacles.forEach(obs => {
                if (dist(car.x, car.y, obs.x, obs.y) < obs.radius + car.width / 2) {
                    car.speed *= 0.6;
                    const angle = Math.atan2(car.y - obs.y, car.x - obs.x);
                    car.x += Math.cos(angle) * 5;
                    car.y += Math.sin(angle) * 5;
                }
            });
        }

        _checkLapProgress(car) {
            const cpIndex = (car.lastCheckpoint + 1) % this.checkpoints.length;
            const cp = this.checkpoints[cpIndex];

            const hitDistance = 15;

            if (car.x > cp.x1 - hitDistance && car.x < cp.x2 + hitDistance &&
                car.y > cp.y1 - hitDistance && car.y < cp.y2 + hitDistance) {

                if (cp.isStart && car.lastCheckpoint === this.checkpoints.length - 1) {
                    car.laps++;
                    car.lastCheckpoint = 0;
                } else if (!cp.isStart && cpIndex === car.lastCheckpoint + 1) {
                    car.lastCheckpoint = cpIndex;
                }
            }
        }

        _draw() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this._drawTrack();
            this.cars.forEach(car => car.draw(this.ctx));

            if ('ontouchstart' in window) {
                this.joystick.draw(this.ctx);
            }

            this._drawUI();

            if (this.gameStatus === 'FINISHED') {
                this._drawWinScreen();
            }
        }

        _drawTrack() {
            const ctx = this.ctx;
            const x = this.trackCenterX;
            const y = this.trackCenterY;
            const w = this.trackOuterW;
            const h = this.trackOuterH;
            const r = this.trackCornerRadius;
            const innerW = this.trackInnerW;
            const innerH = this.trackInnerH;
            const borderWidth = 10;
            const outerBorder = 20;

            ctx.fillStyle = '#D4C49F';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            for (let i = 0; i < this.width; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + 10, this.height);
                ctx.stroke();
            }

            ctx.fillStyle = '#AA8A60';
            this._drawRoundedRect(x, y, w, h, r);
            ctx.fill();

            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = outerBorder;
            this._drawRoundedRect(x, y, w + outerBorder, h + outerBorder, r + outerBorder / 2, true);

            ctx.strokeStyle = '#FFFFFF';
            ctx.setLineDash([outerBorder * 2, outerBorder * 2]);
            this._drawRoundedRect(x, y, w + outerBorder, h + outerBorder, r + outerBorder / 2, true);
            ctx.setLineDash([]);

            ctx.strokeStyle = '#0000FF';
            ctx.lineWidth = borderWidth;
            this._drawRoundedRect(x, y, innerW, innerH, r * 0.5, true);

            ctx.strokeStyle = '#FFFFFF';
            ctx.setLineDash([borderWidth * 2, borderWidth * 2]);
            this._drawRoundedRect(x, y, innerW, innerH, r * 0.5, true);
            ctx.setLineDash([]);

            ctx.fillStyle = '#C2B280';
            this._drawRoundedRect(x, y, innerW - borderWidth, innerH - borderWidth, r * 0.5);
            ctx.fill();

            const cp = this.checkpoints[0];
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 6;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(cp.x1, cp.y1);
            ctx.lineTo(cp.x2, cp.y2);
            ctx.stroke();
            ctx.setLineDash([]);

            this.obstacles.forEach(obs => this._drawStylizedObstacle(ctx, obs));
        }

        _drawRoundedRect(x, y, w, h, r, stroke = false) {
            const ctx = this.ctx;
            const x0 = x - w / 2;
            const y0 = y - h / 2;

            ctx.beginPath();
            ctx.moveTo(x0 + r, y0);
            ctx.arcTo(x0 + w, y0, x0 + w, y0 + h, r);
            ctx.arcTo(x0 + w, y0 + h, x0, y0 + h, r);
            ctx.arcTo(x0, y0 + h, x0, y0, r);
            ctx.arcTo(x0, y0, x0 + w, y0, r);
            ctx.closePath();

            if (stroke) ctx.stroke();
        }

        _drawStylizedObstacle(ctx, obs) {
            ctx.save();
            ctx.translate(obs.x, obs.y);

            ctx.beginPath();
            ctx.arc(4, 4, obs.radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fill();

            ctx.fillStyle = '#3CB371';
            ctx.fillRect(-8, -obs.radius, 16, obs.radius * 2);
            ctx.fillRect(-obs.radius, -8, obs.radius * 2, 16);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(-4, -obs.radius, 8, obs.radius * 2 * 0.3);

            ctx.restore();
        }

        _drawUI() {
            const ctx = this.ctx;
            const timeElapsed = (Date.now() - this.startTime) / 1000;
            const speedKPH = (this.playerCar.speed * 10).toFixed(1);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, 250, 150);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`POSICIÓN: ${this.playerCar.position}/${this.cars.length}`, 10, 30);

            ctx.font = '20px Arial';
            ctx.fillText(`VUELTAS: ${this.playerCar.laps}/${CONFIG.LAP_GOAL}`, 10, 60);
            ctx.fillText(`TIEMPO: ${timeElapsed.toFixed(2)}s`, 10, 90);

            ctx.fillText(`VELOCIDAD: ${speedKPH} Km/h`, 10, 120);

            const mapSize = 150;
            const mapX = this.width - mapSize - 10;
            const mapY = 10;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(mapX, mapY, mapSize, mapSize);

            const mapScaleX = mapSize / this.trackOuterW;
            const mapScaleY = mapSize / this.trackOuterH;

            ctx.save();
            ctx.translate(mapX + mapSize / 2, mapY + mapSize / 2);

            ctx.fillStyle = '#AA8A60';
            this._drawRoundedRect(0, 0, this.trackOuterW * mapScaleX, this.trackOuterH * mapScaleY, this.trackCornerRadius * mapScaleX);
            ctx.fill();

            ctx.fillStyle = '#C2B280';
            this._drawRoundedRect(0, 0, this.trackInnerW * mapScaleX, this.trackInnerH * mapScaleY, this.trackCornerRadius * mapScaleX * 0.5);
            ctx.fill();

            this.cars.forEach(car => {
                const mapCarX = (car.x - this.trackCenterX) * mapScaleX;
                const mapCarY = (car.y - this.trackCenterY) * mapScaleY;

                ctx.fillStyle = car.isPlayer ? 'gold' : car.color;
                ctx.beginPath();
                ctx.arc(mapCarX, mapCarY, 3, 0, 2 * Math.PI);
                ctx.fill();
            });

            ctx.restore();
        }

        _drawWinScreen() {
            const ctx = this.ctx;
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            const finalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 72px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('CARRERA TERMINADA', centerX, centerY - 50);

            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.fillText(`Tu Tiempo: ${finalTime} segundos`, centerX, centerY + 20);
            ctx.fillText(`Posición Final: ${this.playerCar.position}/${this.cars.length}`, centerX, centerY + 70);

            // ELIMINADA toda la lógica de creación y visualización del botón de Reiniciar.
            ctx.font = '30px Arial';
            ctx.fillText(`Usa el menú de Tampermonkey para Iniciar, Detener o Reiniciar.`, centerX, centerY + 140);
        }
    }

    // =====================================================================
    // INICIADOR DEL SCRIPT MODIFICADO
    // =====================================================================

    const gameInstance = new RacingGame();

    /**
     * Función para iniciar el juego.
     */
    function startGame() {
        if (!gameInstance.isRunning) {
            gameInstance.start();
        }
    }

    /**
     * Función para detener el juego.
     */
    function stopGame() {
        if (gameInstance.isRunning) {
            gameInstance.stop();
        }
    }

    /**
     * Función para reiniciar la carrera. Solo funciona si el juego está activo.
     */
    function restartGame() {
        if (gameInstance.isRunning) {
            gameInstance.stop();
            // Pequeño retraso para asegurar que el DOM se limpie completamente antes de reiniciar
            setTimeout(() => gameInstance.start(), 50);
        } else {
            gameInstance.start(); // Si no está corriendo, simplemente inicia.
        }
    }


    function initRacingGame() {
        // Registrar comandos de menú para iniciar, detener y reiniciar el juego
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand("Drawaria Racing: Iniciar Carrera", startGame);
            GM_registerMenuCommand("Drawaria Racing: Detener Carrera", stopGame);
            GM_registerMenuCommand("Drawaria Racing: Reiniciar Carrera", restartGame);
        } else {
            console.error('GM_registerMenuCommand no está disponible. Asegúrate de que el script tiene el permiso @grant.');
        }

        console.log(`Drawaria Racing Minigame v3: Usa el menú de usuario de Tampermonkey para iniciar, detener y reiniciar la carrera.`);
    }

    window.addEventListener('load', () => {
        setTimeout(initRacingGame, 100);
    });

    window.drawariaRacingGameInstance = gameInstance;

})();