// ==UserScript==
// @name         Diep.io BEsT mod Menu
// @namespace    http://tampermonkey.net/
// @version      6.4.2
// @homepage     https://github.com/Hthancder
// @description  Optimized mod with dynamic aimline that follows tank movement
// @author       Hthan24
// @match        https://diep.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557557/Diepio%20BEsT%20mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/557557/Diepio%20BEsT%20mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        AIMLINE: {
            ENABLED: true,
            TARGET_FPS: 60,
            DYNAMIC_MOVEMENT: true, // NEW: Enable dynamic aimline following tank
            MOVEMENT_SMOOTHNESS: 0.05, // Smoothness of aimline movement (min: 0.01)
            // TẤT CẢ HOTKEY ĐÃ BỊ XÓA - để trống tất cả
            PRESETS: [
                {
                    name: "PRECISION THIN",
                    color: 'rgba(0, 255, 100, 0.8)',
                    width: 0.8,
                    smoothness: 0.03,
                    style: 'line',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "TARGET DOT",
                    color: 'rgba(255, 100, 0, 0.9)',
                    width: 1.2,
                    smoothness: 0.05,
                    style: 'dots',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "CROSSHAIR",
                    color: 'rgba(255, 50, 50, 0.7)',
                    width: 1.5,
                    smoothness: 0.04,
                    style: 'crosshair',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "WAVE LINE",
                    color: 'rgba(100, 150, 255, 0.6)',
                    width: 1.8,
                    smoothness: 0.1,
                    style: 'wave',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "GRID GUIDE",
                    color: 'rgba(150, 255, 150, 0.5)',
                    width: 1,
                    smoothness: 0.06,
                    style: 'grid',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "PERFORMANCE MINIMAL",
                    color: 'rgba(200, 200, 200, 0.4)',
                    width: 0.5,
                    smoothness: 0.02,
                    style: 'line',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "ACCURACY GUIDE",
                    color: 'rgba(255, 255, 100, 0.3)',
                    width: 0.7,
                    smoothness: 0.01,
                    style: 'accuracy',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "NEON GLOW",
                    color: 'rgba(0, 255, 255, 0.9)',
                    width: 2.0,
                    smoothness: 0.07,
                    style: 'neon',
                    effect: 'glow',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.2
                },
                {
                    name: "SHADOW TRAIL",
                    color: 'rgba(255, 20, 147, 0.7)',
                    width: 1.5,
                    smoothness: 0.08,
                    style: 'shadow',
                    effect: 'trail',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 0.8
                },
                {
                    name: "PULSING BEAM",
                    color: 'rgba(50, 205, 50, 0.8)',
                    width: 1.3,
                    smoothness: 0.05,
                    style: 'pulse',
                    effect: 'pulse',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.1
                },
                {
                    name: "TECHNOLOGY GRID",
                    color: 'rgba(0, 191, 255, 0.6)',
                    width: 1.2,
                    smoothness: 0.04,
                    style: 'tech',
                    effect: 'grid',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "GHOST LINE",
                    color: 'rgba(255, 255, 255, 0.3)',
                    width: 0.9,
                    smoothness: 0.03,
                    style: 'ghost',
                    effect: 'fade',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 0.7
                },
                {
                    name: "FIRE BEAM",
                    color: 'rgba(255, 69, 0, 0.85)',
                    width: 1.7,
                    smoothness: 0.09,
                    style: 'fire',
                    effect: 'fire',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.3
                },
                {
                    name: "ICE CRYSTAL",
                    color: 'rgba(173, 216, 230, 0.8)',
                    width: 1.4,
                    smoothness: 0.06,
                    style: 'ice',
                    effect: 'sparkle',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 0.9
                },
                {
                    name: "VENOM TOXIC",
                    color: 'rgba(50, 205, 50, 0.75)',
                    width: 1.6,
                    smoothness: 0.07,
                    style: 'venom',
                    effect: 'toxic',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.1
                },
                {
                    name: "GOLDEN SNIPER",
                    color: 'rgba(255, 215, 0, 0.8)',
                    width: 0.6,
                    smoothness: 0.02,
                    style: 'sniper',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "PLASMA ENERGY",
                    color: 'rgba(138, 43, 226, 0.9)',
                    width: 2.2,
                    smoothness: 0.1,
                    style: 'plasma',
                    effect: 'energy',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.4
                },
                {
                    name: "ULTRA LIGHT",
                    color: 'rgba(255, 255, 255, 0.2)',
                    width: 0.3,
                    smoothness: 0.01,
                    style: 'line',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 0.5
                },
                {
                    name: "COMPETITIVE PRO",
                    color: 'rgba(255, 140, 0, 0.9)',
                    width: 0.9,
                    smoothness: 0.03,
                    style: 'pro',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.0
                },
                {
                    name: "STEALTH MODE",
                    color: 'rgba(0, 255, 0, 0.25)',
                    width: 0.4,
                    smoothness: 0.015,
                    style: 'stealth',
                    effect: 'none',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 0.4
                },
                {
                    name: "RAINBOW SPECTRUM",
                    color: 'rainbow',
                    width: 1.5,
                    smoothness: 0.06,
                    style: 'rainbow',
                    effect: 'spectrum',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.2
                },
                {
                    name: "PREDATOR VISION",
                    color: 'rgba(255, 0, 0, 0.8)',
                    width: 1.8,
                    smoothness: 0.05,
                    style: 'predator',
                    effect: 'heat',
                    hotkey: '', // ĐÃ XÓA HOTKEY
                    intensity: 1.1
                },
                // ==================== NEW PRESETS ====================
                {
                    name: "COSMIC RAY",
                    color: 'rgba(148, 0, 211, 0.9)',
                    width: 2.5,
                    smoothness: 0.08,
                    style: 'cosmic',
                    effect: 'nebula',
                    hotkey: '',
                    intensity: 1.5
                },
                {
                    name: "CYBER PUNK",
                    color: 'rgba(0, 255, 255, 0.8)',
                    width: 2.0,
                    smoothness: 0.04,
                    style: 'cyber',
                    effect: 'glitch',
                    hotkey: '',
                    intensity: 1.3
                },
                {
                    name: "DRAGON FIRE",
                    color: 'rgba(255, 69, 0, 0.95)',
                    width: 2.8,
                    smoothness: 0.12,
                    style: 'dragon',
                    effect: 'flame',
                    hotkey: '',
                    intensity: 1.6
                },
                {
                    name: "AQUA BUBBLE",
                    color: 'rgba(0, 191, 255, 0.7)',
                    width: 1.9,
                    smoothness: 0.09,
                    style: 'aqua',
                    effect: 'bubbles',
                    hotkey: '',
                    intensity: 0.9
                },
                {
                    name: "NINJA STAR",
                    color: 'rgba(0, 255, 0, 0.6)',
                    width: 1.1,
                    smoothness: 0.02,
                    style: 'ninja',
                    effect: 'shuriken',
                    hotkey: '',
                    intensity: 0.8
                },
                {
                    name: "GALACTIC BEAM",
                    color: 'rgba(75, 0, 130, 0.85)',
                    width: 3.0,
                    smoothness: 0.15,
                    style: 'galactic',
                    effect: 'stars',
                    hotkey: '',
                    intensity: 1.7
                },
                {
                    name: "VOLTAGE ARC",
                    color: 'rgba(255, 215, 0, 0.9)',
                    width: 2.2,
                    smoothness: 0.07,
                    style: 'voltage',
                    effect: 'electric',
                    hotkey: '',
                    intensity: 1.4
                },
                {
                    name: "PHANTOM DAGGER",
                    color: 'rgba(128, 0, 128, 0.75)',
                    width: 0.7,
                    smoothness: 0.025,
                    style: 'phantom',
                    effect: 'blade',
                    hotkey: '',
                    intensity: 0.6
                },
                {
                    name: "SOLAR FLARE",
                    color: 'rgba(255, 140, 0, 0.95)',
                    width: 3.2,
                    smoothness: 0.18,
                    style: 'solar',
                    effect: 'radiation',
                    hotkey: '',
                    intensity: 1.8
                },
                {
                    name: "CRYSTAL SHARD",
                    color: 'rgba(0, 255, 255, 0.65)',
                    width: 1.5,
                    smoothness: 0.05,
                    style: 'crystal',
                    effect: 'refract',
                    hotkey: '',
                    intensity: 1.0
                },
                {
                    name: "MAGMA FLOW",
                    color: 'rgba(255, 99, 71, 0.88)',
                    width: 2.4,
                    smoothness: 0.11,
                    style: 'magma',
                    effect: 'lava',
                    hotkey: '',
                    intensity: 1.5
                },
                {
                    name: "GHOST WHISPER",
                    color: 'rgba(192, 192, 192, 0.35)',
                    width: 0.6,
                    smoothness: 0.015,
                    style: 'whisper',
                    effect: 'echo',
                    hotkey: '',
                    intensity: 0.4
                },
                {
                    name: "NEON STRIKE",
                    color: 'rgba(255, 20, 147, 0.92)',
                    width: 2.6,
                    smoothness: 0.09,
                    style: 'neon_strike',
                    effect: 'laser',
                    hotkey: '',
                    intensity: 1.6
                },
                {
                    name: "ARCTIC BLAST",
                    color: 'rgba(173, 216, 230, 0.95)',
                    width: 1.8,
                    smoothness: 0.06,
                    style: 'arctic',
                    effect: 'frost',
                    hotkey: '',
                    intensity: 1.2
                },
                {
                    name: "TOXIC SLIME",
                    color: 'rgba(50, 205, 50, 0.82)',
                    width: 2.1,
                    smoothness: 0.13,
                    style: 'slime',
                    effect: 'ooze',
                    hotkey: '',
                    intensity: 1.3
                },
                {
                    name: "ROYAL CROWN",
                    color: 'rgba(255, 215, 0, 0.87)',
                    width: 1.7,
                    smoothness: 0.04,
                    style: 'royal',
                    effect: 'jewel',
                    hotkey: '',
                    intensity: 1.1
                },
                {
                    name: "DARK MATTER",
                    color: 'rgba(25, 25, 112, 0.93)',
                    width: 2.9,
                    smoothness: 0.16,
                    style: 'dark_matter',
                    effect: 'void',
                    hotkey: '',
                    intensity: 1.7
                },
                {
                    name: "STARDUST",
                    color: 'rgba(255, 255, 240, 0.78)',
                    width: 2.3,
                    smoothness: 0.14,
                    style: 'stardust',
                    effect: 'sparkle',
                    hotkey: '',
                    intensity: 1.4
                },
                {
                    name: "INFERNO BLAST",
                    color: 'rgba(255, 0, 0, 0.96)',
                    width: 3.5,
                    smoothness: 0.2,
                    style: 'inferno',
                    effect: 'explosion',
                    hotkey: '',
                    intensity: 2.0
                },
                {
                    name: "MYSTIC RUNE",
                    color: 'rgba(138, 43, 226, 0.83)',
                    width: 1.4,
                    smoothness: 0.035,
                    style: 'rune',
                    effect: 'magic',
                    hotkey: '',
                    intensity: 0.9
                },
                {
                    name: "QUANTUM BEAM",
                    color: 'rgba(0, 255, 255, 0.91)',
                    width: 2.7,
                    smoothness: 0.17,
                    style: 'quantum',
                    effect: 'teleport',
                    hotkey: '',
                    intensity: 1.8
                }
            ],
            CURRENT_PRESET: 0,
            CUSTOM_SETTINGS: {
                color: null,
                width: null,
                intensity: null,
                opacity: null
            }
        },
        TANK_PRESETS: {
            ENABLED: true,
            HOTKEYS_ENABLED: true,
            CUSTOM_HOTKEYS: true,
            PRESETS: [
                {
                    id: 'preset_1',
                    name: "Rammer",
                    build: "123123123123123888882382387777777",
                    class: "Annihilator",
                    hotkey: 'Numpad1',
                    customHotkey: ''
                },
                {
                    id: 'preset_2',
                    name: "Bullet Spam",
                    build: "567445675675675675675678888888233",
                    class: "Sprayer",
                    hotkey: 'Numpad2',
                    customHotkey: ''
                },
                {
                    id: 'preset_3',
                    name: "Glass Cannon",
                    build: "567456747654765476547566888821212",
                    class: "Factory",
                    hotkey: 'Numpad3',
                    customHotkey: ''
                }
            ]
        },
        MENU: {
            TOGGLE_KEY: 'F8',
            RESIZABLE: true,
            DRAGGABLE: true,
            DEFAULT_SIZE: { width: 400, height: 650 },
            MIN_SIZE: { width: 350, height: 500 },
            THEME: {
                background: 'rgba(20, 20, 25, 0.97)',
                border: '1px solid rgba(70, 70, 90, 0.7)',
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            },
            FONT: {
                family: 'Segoe UI, Arial, sans-serif',
                size: '13px',
                color: '#e8e8e8'
            }
        }
    };

    // ==================== ENHANCED AIMLINE SYSTEM WITH DYNAMIC MOVEMENT ====================
    class EnhancedAimline {
        constructor() {
            this.enabled = CONFIG.AIMLINE.ENABLED;
            this.dynamicMovement = CONFIG.AIMLINE.DYNAMIC_MOVEMENT;
            this.currentPreset = CONFIG.AIMLINE.CURRENT_PRESET;
            this.canvas = null;
            this.ctx = null;
            this.lastMouse = { x: 0, y: 0 };
            this.lastRender = 0;
            this.frameInterval = 1000 / CONFIG.AIMLINE.TARGET_FPS;
            this.animationId = null;

            // Tank position tracking
            this.tankPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.targetTankPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.movementOffset = { x: 0, y: 0 };
            this.isMoving = false;
            this.moveDirection = { x: 0, y: 0 };
            this.moveSpeed = 5;

            this.customSettings = { ...CONFIG.AIMLINE.CUSTOM_SETTINGS };
            this.pulsePhase = 0;
            this.rainbowPhase = 0;
            this.cosmicPhase = 0;
            this.glitchPhase = 0;

            // Movement keys tracking
            this.keys = {
                w: false,
                a: false,
                s: false,
                d: false
            };

            this.init();
        }

        init() {
            this.createCanvas();
            this.setupEventListeners();
            this.startOptimizedRenderLoop();

            const saved = localStorage.getItem('diep_aimline_settings');
            if (saved) {
                try {
                    const settings = JSON.parse(saved);
                    this.enabled = settings.enabled !== false;
                    this.dynamicMovement = settings.dynamicMovement !== false;
                    this.currentPreset = settings.preset || 0;
                    this.customSettings = settings.customSettings || { ...CONFIG.AIMLINE.CUSTOM_SETTINGS };
                    // LOAD SMOOTHNESS SETTING IF EXISTS
                    if (settings.movementSmoothness !== undefined) {
                        CONFIG.AIMLINE.MOVEMENT_SMOOTHNESS = settings.movementSmoothness;
                    }
                } catch (e) {
                    console.error('Error loading aimline settings:', e);
                }
            }
        }

        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'aimline-canvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9997;
            `;
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
        }

        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            // Reset tank position to center
            this.tankPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.targetTankPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        }

        // Calculate movement offset based on keys pressed
        updateTankPosition() {
            if (!this.dynamicMovement) {
                this.tankPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
                return;
            }

            // Calculate movement direction from keys
            let moveX = 0;
            let moveY = 0;

            if (this.keys.w) moveY -= 1;
            if (this.keys.s) moveY += 1;
            if (this.keys.a) moveX -= 1;
            if (this.keys.d) moveX += 1;

            // Check if any movement key is pressed
            this.isMoving = moveX !== 0 || moveY !== 0;

            if (this.isMoving) {
                // Normalize diagonal movement
                if (moveX !== 0 && moveY !== 0) {
                    moveX *= 0.7071; // 1/√2
                    moveY *= 0.7071;
                }

                this.moveDirection = { x: moveX, y: moveY };

                // Calculate target position with some offset
                const maxOffset = 50; // Maximum offset from center
                this.targetTankPosition = {
                    x: window.innerWidth / 2 + moveX * maxOffset,
                    y: window.innerHeight / 2 + moveY * maxOffset
                };
            } else {
                // Return to center when not moving
                this.targetTankPosition = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                };
            }

            // Smoothly interpolate to target position
            const smoothness = CONFIG.AIMLINE.MOVEMENT_SMOOTHNESS;
            this.tankPosition.x += (this.targetTankPosition.x - this.tankPosition.x) * smoothness;
            this.tankPosition.y += (this.targetTankPosition.y - this.tankPosition.y) * smoothness;
        }

        getCurrentPreset() {
            const preset = CONFIG.AIMLINE.PRESETS[this.currentPreset] || CONFIG.AIMLINE.PRESETS[0];

            // Áp dụng custom settings nếu có
            const customWidth = this.customSettings.width !== null ?
                               parseFloat(this.customSettings.width) : preset.width;
            const customIntensity = this.customSettings.intensity !== null ?
                                   parseFloat(this.customSettings.intensity) : preset.intensity;

            return {
                ...preset,
                color: this.customSettings.color || preset.color,
                width: customWidth,
                intensity: customIntensity
            };
        }

        setupEventListeners() {
            let lastMouseUpdate = 0;
            const updateMouse = (e) => {
                const now = performance.now();
                if (now - lastMouseUpdate < 16) return;

                this.lastMouse.x = e.clientX;
                this.lastMouse.y = e.clientY;
                lastMouseUpdate = now;
            };

            document.addEventListener('mousemove', updateMouse, { passive: true });
            window.addEventListener('resize', () => this.resizeCanvas(), { passive: true });

            // Keyboard event listeners for tank movement
            document.addEventListener('keydown', (e) => {
                const key = e.key.toLowerCase();
                if (key === 'w' || key === 'arrowup') this.keys.w = true;
                if (key === 'a' || key === 'arrowleft') this.keys.a = true;
                if (key === 's' || key === 'arrowdown') this.keys.s = true;
                if (key === 'd' || key === 'arrowright') this.keys.d = true;
            });

            document.addEventListener('keyup', (e) => {
                const key = e.key.toLowerCase();
                if (key === 'w' || key === 'arrowup') this.keys.w = false;
                if (key === 'a' || key === 'arrowleft') this.keys.a = false;
                if (key === 's' || key === 'arrowdown') this.keys.s = false;
                if (key === 'd' || key === 'arrowright') this.keys.d = false;
            });

            // Also track keyup events for the window to prevent stuck keys
            window.addEventListener('blur', () => {
                this.keys = { w: false, a: false, s: false, d: false };
            });
        }

        drawAimline() {
            const preset = this.getCurrentPreset();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Update tank position
            this.updateTankPosition();

            // Cập nhật hiệu ứng động
            this.pulsePhase = (this.pulsePhase + 0.05) % (Math.PI * 2);
            this.rainbowPhase = (this.rainbowPhase + 0.01) % 1;
            this.cosmicPhase = (this.cosmicPhase + 0.02) % (Math.PI * 2);
            this.glitchPhase = (this.glitchPhase + 0.1) % (Math.PI * 2);

            switch(preset.style) {
                case 'dots':
                    this.drawDots(preset);
                    break;
                case 'crosshair':
                    this.drawCrosshair(preset);
                    break;
                case 'wave':
                    this.drawWave(preset);
                    break;
                case 'grid':
                    this.drawGrid(preset);
                    break;
                case 'accuracy':
                    this.drawAccuracyGuide(preset);
                    break;
                case 'neon':
                    this.drawNeon(preset);
                    break;
                case 'shadow':
                    this.drawShadow(preset);
                    break;
                case 'pulse':
                    this.drawPulse(preset);
                    break;
                case 'tech':
                    this.drawTech(preset);
                    break;
                case 'ghost':
                    this.drawGhost(preset);
                    break;
                case 'fire':
                    this.drawFire(preset);
                    break;
                case 'ice':
                    this.drawIce(preset);
                    break;
                case 'venom':
                    this.drawVenom(preset);
                    break;
                case 'sniper':
                    this.drawSniper(preset);
                    break;
                case 'plasma':
                    this.drawPlasma(preset);
                    break;
                case 'pro':
                    this.drawPro(preset);
                    break;
                case 'stealth':
                    this.drawStealth(preset);
                    break;
                case 'rainbow':
                    this.drawRainbow(preset);
                    break;
                case 'predator':
                    this.drawPredator(preset);
                    break;
                // ==================== NEW STYLES ====================
                case 'cosmic':
                    this.drawCosmic(preset);
                    break;
                case 'cyber':
                    this.drawCyber(preset);
                    break;
                case 'dragon':
                    this.drawDragon(preset);
                    break;
                case 'aqua':
                    this.drawAqua(preset);
                    break;
                case 'ninja':
                    this.drawNinja(preset);
                    break;
                case 'galactic':
                    this.drawGalactic(preset);
                    break;
                case 'voltage':
                    this.drawVoltage(preset);
                    break;
                case 'phantom':
                    this.drawPhantom(preset);
                    break;
                case 'solar':
                    this.drawSolar(preset);
                    break;
                case 'crystal':
                    this.drawCrystal(preset);
                    break;
                case 'magma':
                    this.drawMagma(preset);
                    break;
                case 'whisper':
                    this.drawWhisper(preset);
                    break;
                case 'neon_strike':
                    this.drawNeonStrike(preset);
                    break;
                case 'arctic':
                    this.drawArctic(preset);
                    break;
                case 'slime':
                    this.drawSlime(preset);
                    break;
                case 'royal':
                    this.drawRoyal(preset);
                    break;
                case 'dark_matter':
                    this.drawDarkMatter(preset);
                    break;
                case 'stardust':
                    this.drawStardust(preset);
                    break;
                case 'inferno':
                    this.drawInferno(preset);
                    break;
                case 'rune':
                    this.drawRune(preset);
                    break;
                case 'quantum':
                    this.drawQuantum(preset);
                    break;
                default:
                    this.drawLine(preset);
            }
        }

        drawLine(preset) {
            const effectiveWidth = preset.width * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 6 * preset.intensity, 0, Math.PI * 2);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = 1 * preset.intensity;
            this.ctx.stroke();
        }

        drawDots(preset) {
            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.max(5, Math.floor(distance / 15));

            for (let i = 1; i <= steps; i++) {
                const x = this.tankPosition.x + (dx * i) / steps;
                const y = this.tankPosition.y + (dy * i) / steps;
                const size = 3 * (1 - i / (steps * 1.5)) * preset.intensity;

                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = preset.color;
                this.ctx.fill();
            }
        }

        drawCrosshair(preset) {
            const effectiveWidth = preset.width * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.stroke();

            const size = 10 * preset.intensity;
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastMouse.x - size, this.lastMouse.y);
            this.ctx.lineTo(this.lastMouse.x + size, this.lastMouse.y);
            this.ctx.moveTo(this.lastMouse.x, this.lastMouse.y - size);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y + size);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.stroke();
        }

        drawWave(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = 50;

            this.ctx.beginPath();
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = this.tankPosition.x + dx * t;
                const y = this.tankPosition.y + dy * t;
                const waveX = x + Math.sin(t * Math.PI * 4) * 3 * preset.intensity;
                const waveY = y + Math.cos(t * Math.PI * 4) * 3 * preset.intensity;

                if (i === 0) {
                    this.ctx.moveTo(waveX, waveY);
                } else {
                    this.ctx.lineTo(waveX, waveY);
                }
            }
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.stroke();
        }

        drawGrid(preset) {
            this.drawLine(preset);

            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;
            const angle = Math.atan2(dy, dx);
            const segments = 8;
            const effectiveWidth = preset.width * preset.intensity * 0.5;

            for (let i = 1; i <= segments; i++) {
                const t = i / (segments + 1);
                const x = this.tankPosition.x + dx * t;
                const y = this.tankPosition.y + dy * t;
                const perpX = Math.cos(angle + Math.PI/2) * 15 * preset.intensity;
                const perpY = Math.sin(angle + Math.PI/2) * 15 * preset.intensity;

                this.ctx.beginPath();
                this.ctx.moveTo(x - perpX, y - perpY);
                this.ctx.lineTo(x + perpX, y + perpY);
                this.ctx.strokeStyle = preset.color.replace(/[\d.]+\)$/, '0.3)');
                this.ctx.lineWidth = effectiveWidth;
                this.ctx.stroke();
            }
        }

        drawAccuracyGuide(preset) {
            const effectiveWidth = preset.width * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.stroke();

            const accuracyCircle = 20 * preset.intensity;
            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, accuracyCircle, 0, Math.PI * 2);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = 0.5 * preset.intensity;
            this.ctx.stroke();

            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const x1 = this.lastMouse.x + Math.cos(angle) * (accuracyCircle - 3);
                const y1 = this.lastMouse.y + Math.sin(angle) * (accuracyCircle - 3);
                const x2 = this.lastMouse.x + Math.cos(angle) * (accuracyCircle + 3);
                const y2 = this.lastMouse.y + Math.sin(angle) * (accuracyCircle + 3);

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.strokeStyle = preset.color;
                this.ctx.lineWidth = 1 * preset.intensity;
                this.ctx.stroke();
            }
        }

        drawNeon(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const glowSize = 3 * preset.intensity;

            this.ctx.shadowBlur = 15 * preset.intensity;
            this.ctx.shadowColor = preset.color.replace('0.9', '1');

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            this.ctx.shadowBlur = 0;

            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 8 * preset.intensity, 0, Math.PI * 2);
            this.ctx.fillStyle = preset.color;
            this.ctx.fill();
        }

        drawShadow(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const trailCount = 3;

            for (let i = 0; i < trailCount; i++) {
                const offset = (trailCount - i - 1) * 2;
                const alpha = 0.3 * (1 - i / trailCount) * preset.intensity;

                this.ctx.beginPath();
                this.ctx.moveTo(this.tankPosition.x + offset, this.tankPosition.y + offset);
                this.ctx.lineTo(this.lastMouse.x + offset, this.lastMouse.y + offset);
                this.ctx.strokeStyle = preset.color.replace(/[\d.]+\)$/, `${alpha})`);
                this.ctx.lineWidth = effectiveWidth * (1 - i * 0.3);
                this.ctx.stroke();
            }
        }

        drawPulse(preset) {
            const pulseValue = (Math.sin(this.pulsePhase) + 1) / 2;
            const effectiveWidth = preset.width * (0.8 + pulseValue * 0.4) * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            const circleSize = 6 + pulseValue * 4;
            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, circleSize * preset.intensity, 0, Math.PI * 2);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = 1 + pulseValue * 2;
            this.ctx.stroke();
        }

        drawTech(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const segments = Math.max(5, Math.floor(distance / 20));

            this.ctx.beginPath();
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = this.tankPosition.x + dx * t;
                const y = this.tankPosition.y + dy * t;

                if (i % 2 === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.setLineDash([5, 3]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            for (let i = 1; i < segments; i++) {
                const t = i / segments;
                const x = this.tankPosition.x + dx * t;
                const y = this.tankPosition.y + dy * t;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 2 * preset.intensity, 0, Math.PI * 2);
                this.ctx.fillStyle = preset.color;
                this.ctx.fill();
            }
        }

        drawGhost(preset) {
            const effectiveWidth = preset.width * preset.intensity * 0.7;
            const alpha = 0.3 * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color.replace(/[\d.]+\)$/, `${alpha})`);
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            for (let i = 0; i < 3; i++) {
                const size = 4 + i * 3;
                const circleAlpha = alpha * (1 - i * 0.3);

                this.ctx.beginPath();
                this.ctx.arc(this.lastMouse.x, this.lastMouse.y, size * preset.intensity, 0, Math.PI * 2);
                this.ctx.strokeStyle = preset.color.replace(/[\d.]+\)$/, `${circleAlpha})`);
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }
        }

        drawFire(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const fireIntensity = Math.sin(this.pulsePhase * 2) * 0.5 + 0.5;

            const gradient = this.ctx.createLinearGradient(
                this.tankPosition.x, this.tankPosition.y,
                this.lastMouse.x, this.lastMouse.y
            );
            gradient.addColorStop(0, 'rgba(255, 255, 100, 0.9)');
            gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0.7)');

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = effectiveWidth * (0.8 + fireIntensity * 0.4);
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 5 + Math.random() * 10;
                const size = 1 + Math.random() * 3;
                const x = this.lastMouse.x + Math.cos(angle) * distance * preset.intensity;
                const y = this.lastMouse.y + Math.sin(angle) * distance * preset.intensity;

                this.ctx.beginPath();
                this.ctx.arc(x, y, size * preset.intensity, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 0, 0.6)`;
                this.ctx.fill();
            }
        }

        drawIce(preset) {
            const effectiveWidth = preset.width * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            const crystalPoints = 6;
            const crystalSize = 8 * preset.intensity;

            this.ctx.beginPath();
            for (let i = 0; i < crystalPoints; i++) {
                const angle = (i * Math.PI * 2) / crystalPoints;
                const x = this.lastMouse.x + Math.cos(angle) * crystalSize;
                const y = this.lastMouse.y + Math.sin(angle) * crystalSize;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.lineWidth = 1 * preset.intensity;
            this.ctx.stroke();

            for (let i = 0; i < 3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = crystalSize * 0.7;
                const x = this.lastMouse.x + Math.cos(angle) * distance;
                const y = this.lastMouse.y + Math.sin(angle) * distance;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 1 * preset.intensity, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.fill();
            }
        }

        drawVenom(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const venomPhase = this.pulsePhase * 3;

            this.ctx.beginPath();
            const steps = 30;
            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = this.tankPosition.x + dx * t;
                const y = this.tankPosition.y + dy * t;
                const wave = Math.sin(t * Math.PI * 6 + venomPhase) * 3 * preset.intensity;
                const perpX = Math.cos(Math.atan2(dy, dx) + Math.PI/2) * wave;
                const perpY = Math.sin(Math.atan2(dy, dx) + Math.PI/2) * wave;

                if (i === 0) {
                    this.ctx.moveTo(x + perpX, y + perpY);
                } else {
                    this.ctx.lineTo(x + perpX, y + perpY);
                }
            }

            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 7 * preset.intensity, 0, Math.PI * 2);
            this.ctx.fillStyle = preset.color.replace('0.75', '0.4');
            this.ctx.fill();
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = 1 * preset.intensity;
            this.ctx.stroke();
        }

        drawSniper(preset) {
            const effectiveWidth = preset.width * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.stroke();

            const innerSize = 3 * preset.intensity;
            const outerSize = 12 * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastMouse.x - innerSize, this.lastMouse.y);
            this.ctx.lineTo(this.lastMouse.x + innerSize, this.lastMouse.y);
            this.ctx.moveTo(this.lastMouse.x, this.lastMouse.y - innerSize);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y + innerSize);
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, outerSize, 0, Math.PI * 2);

            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = 0.8 * preset.intensity;
            this.ctx.stroke();
        }

        drawPlasma(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const energyPhase = this.pulsePhase * 4;

            for (let layer = 0; layer < 3; layer++) {
                const layerWidth = effectiveWidth * (1 - layer * 0.3);
                const layerAlpha = 0.7 * (1 - layer * 0.2);
                const layerOffset = layer * 2;

                this.ctx.beginPath();
                this.ctx.moveTo(this.tankPosition.x + layerOffset, this.tankPosition.y + layerOffset);
                this.ctx.lineTo(this.lastMouse.x + layerOffset, this.lastMouse.y + layerOffset);

                const layerColor = preset.color.replace(/[\d.]+\)$/, `${layerAlpha})`);
                this.ctx.strokeStyle = layerColor;
                this.ctx.lineWidth = layerWidth;
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
            }

            const orbSize = 10 * preset.intensity;
            const orbPulse = (Math.sin(energyPhase) + 1) * 0.5;

            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, orbSize * (0.8 + orbPulse * 0.2), 0, Math.PI * 2);

            const gradient = this.ctx.createRadialGradient(
                this.lastMouse.x, this.lastMouse.y, 0,
                this.lastMouse.x, this.lastMouse.y, orbSize
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(1, preset.color.replace('0.9', '0.3'));

            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        drawPro(preset) {
            const effectiveWidth = preset.width * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const markerCount = Math.floor(distance / 50);

            for (let i = 1; i <= markerCount; i++) {
                const t = i / (markerCount + 1);
                const x = this.tankPosition.x + dx * t;
                const y = this.tankPosition.y + dy * t;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 2 * preset.intensity, 0, Math.PI * 2);
                this.ctx.fillStyle = preset.color;
                this.ctx.fill();

                const angle = Math.atan2(dy, dx);
                const perpX = Math.cos(angle + Math.PI/2) * 4 * preset.intensity;
                const perpY = Math.sin(angle + Math.PI/2) * 4 * preset.intensity;

                this.ctx.beginPath();
                this.ctx.moveTo(x - perpX, y - perpY);
                this.ctx.lineTo(x + perpX, y + perpY);
                this.ctx.strokeStyle = preset.color;
                this.ctx.lineWidth = 0.8 * preset.intensity;
                this.ctx.stroke();
            }

            const squareSize = 6 * preset.intensity;
            this.ctx.beginPath();
            this.ctx.rect(this.lastMouse.x - squareSize, this.lastMouse.y - squareSize,
                         squareSize * 2, squareSize * 2);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = 1.2 * preset.intensity;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastMouse.x - squareSize, this.lastMouse.y - squareSize);
            this.ctx.lineTo(this.lastMouse.x + squareSize, this.lastMouse.y + squareSize);
            this.ctx.moveTo(this.lastMouse.x + squareSize, this.lastMouse.y - squareSize);
            this.ctx.lineTo(this.lastMouse.x - squareSize, this.lastMouse.y + squareSize);
            this.ctx.stroke();
        }

        drawStealth(preset) {
            const effectiveWidth = preset.width * preset.intensity * 0.5;
            const alpha = 0.25 * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color.replace(/[\d.]+\)$/, `${alpha})`);
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 2 * preset.intensity, 0, Math.PI * 2);
            this.ctx.fillStyle = preset.color.replace(/[\d.]+\)$/, `${alpha * 2})`);
            this.ctx.fill();
        }

        drawRainbow(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.max(20, Math.floor(distance / 10));

            for (let i = 0; i < steps; i++) {
                const t = i / steps;
                const t2 = (i + 1) / steps;
                const x1 = this.tankPosition.x + dx * t;
                const y1 = this.tankPosition.y + dy * t;
                const x2 = this.tankPosition.x + dx * t2;
                const y2 = this.tankPosition.y + dy * t2;

                const hue = ((this.rainbowPhase + t) * 360) % 360;
                const color = `hsla(${hue}, 100%, 60%, 0.8)`;

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = effectiveWidth;
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
            }

            const circleSize = 8 * preset.intensity;
            for (let i = 0; i < 6; i++) {
                const startAngle = (i * Math.PI) / 3;
                const endAngle = ((i + 1) * Math.PI) / 3;
                const hue = (i * 60 + this.rainbowPhase * 360) % 360;

                this.ctx.beginPath();
                this.ctx.arc(this.lastMouse.x, this.lastMouse.y, circleSize, startAngle, endAngle);
                this.ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
                this.ctx.lineWidth = 2 * preset.intensity;
                this.ctx.stroke();
            }
        }

        drawPredator(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const heatPhase = this.pulsePhase * 2;

            const gradient = this.ctx.createLinearGradient(
                this.tankPosition.x, this.tankPosition.y,
                this.lastMouse.x, this.lastMouse.y
            );
            const heatValue = Math.sin(heatPhase) * 0.3 + 0.7;
            gradient.addColorStop(0, `rgba(255, ${100 + heatValue * 155}, 0, 0.9)`);
            gradient.addColorStop(1, `rgba(255, 0, 0, 0.8)`);

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            const reticleSize = 10 * preset.intensity;
            const innerSize = 4 * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastMouse.x - reticleSize, this.lastMouse.y - reticleSize);
            this.ctx.lineTo(this.lastMouse.x + reticleSize, this.lastMouse.y + reticleSize);
            this.ctx.moveTo(this.lastMouse.x + reticleSize, this.lastMouse.y - reticleSize);
            this.ctx.lineTo(this.lastMouse.x - reticleSize, this.lastMouse.y + reticleSize);
            this.ctx.moveTo(this.lastMouse.x - innerSize, this.lastMouse.y);
            this.ctx.lineTo(this.lastMouse.x + innerSize, this.lastMouse.y);
            this.ctx.moveTo(this.lastMouse.x, this.lastMouse.y - innerSize);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y + innerSize);

            this.ctx.strokeStyle = `rgba(255, ${50 + heatValue * 100}, 0, 0.9)`;
            this.ctx.lineWidth = 1.5 * preset.intensity;
            this.ctx.stroke();

            for (let i = 0; i < 3; i++) {
                const waveSize = reticleSize * 1.5 + i * 3;
                const waveAlpha = 0.2 * (1 - i * 0.3);

                this.ctx.beginPath();
                this.ctx.arc(this.lastMouse.x, this.lastMouse.y, waveSize, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(255, 100, 0, ${waveAlpha})`;
                this.ctx.lineWidth = 1 * preset.intensity;
                this.ctx.stroke();
            }
        }

        // ==================== NEW DRAWING METHODS ====================
        drawCosmic(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const nebulaPhase = this.cosmicPhase;

            this.ctx.save();
            this.ctx.shadowBlur = 25 * preset.intensity;
            this.ctx.shadowColor = 'rgba(148, 0, 211, 0.9)';

            const gradient = this.ctx.createLinearGradient(
                this.tankPosition.x, this.tankPosition.y,
                this.lastMouse.x, this.lastMouse.y
            );
            gradient.addColorStop(0, 'rgba(148, 0, 211, 0.9)');
            gradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 139, 0.7)');

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            this.ctx.restore();

            // Draw stars
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 30 * preset.intensity;
                const size = Math.random() * 3 * preset.intensity;
                const x = this.lastMouse.x + Math.cos(angle) * distance;
                const y = this.lastMouse.y + Math.sin(angle) * distance;
                const alpha = Math.random() * 0.5 + 0.3;

                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.fill();
            }

            // Cosmic center
            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 12 * preset.intensity, 0, Math.PI * 2);
            const radialGradient = this.ctx.createRadialGradient(
                this.lastMouse.x, this.lastMouse.y, 0,
                this.lastMouse.x, this.lastMouse.y, 20
            );
            radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            radialGradient.addColorStop(0.7, 'rgba(148, 0, 211, 0.6)');
            radialGradient.addColorStop(1, 'rgba(75, 0, 130, 0.2)');
            this.ctx.fillStyle = radialGradient;
            this.ctx.fill();
        }

        drawCyber(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const glitchValue = Math.sin(this.glitchPhase) * 10 * preset.intensity;

            this.ctx.save();
            this.ctx.shadowBlur = 20 * preset.intensity;
            this.ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';

            // Main line with glitch effect
            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Glitch lines
            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x + glitchValue, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x + glitchValue, this.lastMouse.y);
            this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.4)';
            this.ctx.lineWidth = effectiveWidth * 0.5;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x - glitchValue, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x - glitchValue, this.lastMouse.y);
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
            this.ctx.lineWidth = effectiveWidth * 0.5;
            this.ctx.stroke();

            this.ctx.restore();

            // Cyber crosshair
            const crossSize = 15 * preset.intensity;
            const innerSize = 5 * preset.intensity;

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastMouse.x - crossSize, this.lastMouse.y);
            this.ctx.lineTo(this.lastMouse.x - innerSize, this.lastMouse.y);
            this.ctx.moveTo(this.lastMouse.x + innerSize, this.lastMouse.y);
            this.ctx.lineTo(this.lastMouse.x + crossSize, this.lastMouse.y);
            this.ctx.moveTo(this.lastMouse.x, this.lastMouse.y - crossSize);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y - innerSize);
            this.ctx.moveTo(this.lastMouse.x, this.lastMouse.y + innerSize);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y + crossSize);

            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.9)';
            this.ctx.lineWidth = 2 * preset.intensity;
            this.ctx.stroke();

            // Inner square
            this.ctx.beginPath();
            this.ctx.rect(this.lastMouse.x - innerSize, this.lastMouse.y - innerSize,
                         innerSize * 2, innerSize * 2);
            this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.9)';
            this.ctx.lineWidth = 1 * preset.intensity;
            this.ctx.stroke();
        }

        drawDragon(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const flamePhase = this.pulsePhase * 3;

            const gradient = this.ctx.createLinearGradient(
                this.tankPosition.x, this.tankPosition.y,
                this.lastMouse.x, this.lastMouse.y
            );
            gradient.addColorStop(0, 'rgba(255, 255, 0, 0.95)');
            gradient.addColorStop(0.3, 'rgba(255, 140, 0, 0.9)');
            gradient.addColorStop(0.6, 'rgba(255, 69, 0, 0.85)');
            gradient.addColorStop(1, 'rgba(139, 0, 0, 0.8)');

            this.ctx.save();
            this.ctx.shadowBlur = 30 * preset.intensity;
            this.ctx.shadowColor = 'rgba(255, 69, 0, 0.9)';

            // Main flame line
            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            this.ctx.restore();

            // Flame particles
            for (let i = 0; i < 20; i++) {
                const t = i / 20;
                const x = this.tankPosition.x + (this.lastMouse.x - this.tankPosition.x) * t;
                const y = this.tankPosition.y + (this.lastMouse.y - this.tankPosition.y) * t;

                for (let j = 0; j < 3; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 15 * preset.intensity;
                    const size = Math.random() * 4 * preset.intensity;
                    const particleX = x + Math.cos(angle) * distance;
                    const particleY = y + Math.sin(angle) * distance;
                    const colorValue = Math.floor(Math.random() * 155 + 100);
                    const alpha = Math.random() * 0.5 + 0.3;

                    this.ctx.beginPath();
                    this.ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(255, ${colorValue}, 0, ${alpha})`;
                    this.ctx.fill();
                }
            }

            // Dragon eye
            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 10 * preset.intensity, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.9)';
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 5 * preset.intensity, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            this.ctx.fill();
        }

        drawAqua(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const bubblePhase = this.pulsePhase * 2;

            this.ctx.save();
            this.ctx.shadowBlur = 15 * preset.intensity;
            this.ctx.shadowColor = 'rgba(0, 191, 255, 0.7)';

            const gradient = this.ctx.createLinearGradient(
                this.tankPosition.x, this.tankPosition.y,
                this.lastMouse.x, this.lastMouse.y
            );
            gradient.addColorStop(0, 'rgba(0, 191, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(64, 224, 208, 0.7)');
            gradient.addColorStop(1, 'rgba(0, 139, 139, 0.6)');

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            this.ctx.restore();

            // Bubbles
            for (let i = 0; i < 12; i++) {
                const t = i / 12;
                const x = this.tankPosition.x + (this.lastMouse.x - this.tankPosition.x) * t;
                const y = this.tankPosition.y + (this.lastMouse.y - this.tankPosition.y) * t;

                for (let j = 0; j < 2; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 20 * preset.intensity;
                    const size = Math.random() * 6 * preset.intensity + 2;
                    const bubbleX = x + Math.cos(angle + bubblePhase) * distance;
                    const bubbleY = y + Math.sin(angle + bubblePhase) * distance;
                    const alpha = Math.random() * 0.3 + 0.2;

                    this.ctx.beginPath();
                    this.ctx.arc(bubbleX, bubbleY, size, 0, Math.PI * 2);
                    this.ctx.strokeStyle = `rgba(173, 216, 230, ${alpha})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();

                    // Bubble highlight
                    this.ctx.beginPath();
                    this.ctx.arc(bubbleX - size * 0.3, bubbleY - size * 0.3, size * 0.3, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
                    this.ctx.fill();
                }
            }

            // Water drop
            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 8 * preset.intensity, 0, Math.PI * 2);
            const waterGradient = this.ctx.createRadialGradient(
                this.lastMouse.x, this.lastMouse.y, 0,
                this.lastMouse.x, this.lastMouse.y, 15
            );
            waterGradient.addColorStop(0, 'rgba(0, 191, 255, 0.9)');
            waterGradient.addColorStop(0.7, 'rgba(64, 224, 208, 0.5)');
            waterGradient.addColorStop(1, 'rgba(0, 139, 139, 0.2)');
            this.ctx.fillStyle = waterGradient;
            this.ctx.fill();
        }

        drawNinja(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const shurikenPhase = this.pulsePhase * 4;

            // Stealth line
            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Shuriken at end
            const shurikenSize = 10 * preset.intensity;
            const rotation = shurikenPhase;

            this.ctx.save();
            this.ctx.translate(this.lastMouse.x, this.lastMouse.y);
            this.ctx.rotate(rotation);

            // Draw shuriken (4 blades)
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                this.ctx.save();
                this.ctx.rotate(angle);

                // Blade
                this.ctx.beginPath();
                this.ctx.moveTo(-shurikenSize * 0.2, 0);
                this.ctx.lineTo(-shurikenSize, 0);
                this.ctx.lineTo(0, -shurikenSize * 0.3);
                this.ctx.lineTo(shurikenSize, 0);
                this.ctx.lineTo(shurikenSize * 0.2, 0);
                this.ctx.closePath();

                const bladeGradient = this.ctx.createLinearGradient(-shurikenSize, 0, shurikenSize, 0);
                bladeGradient.addColorStop(0, 'rgba(0, 255, 0, 0.8)');
                bladeGradient.addColorStop(0.5, 'rgba(0, 200, 0, 0.9)');
                bladeGradient.addColorStop(1, 'rgba(0, 150, 0, 0.8)');
                this.ctx.fillStyle = bladeGradient;
                this.ctx.fill();

                // Blade edge
                this.ctx.beginPath();
                this.ctx.moveTo(-shurikenSize * 0.5, 0);
                this.ctx.lineTo(0, -shurikenSize * 0.15);
                this.ctx.lineTo(shurikenSize * 0.5, 0);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                this.ctx.lineWidth = 0.5 * preset.intensity;
                this.ctx.stroke();

                this.ctx.restore();
            }

            // Center circle
            this.ctx.beginPath();
            this.ctx.arc(0, 0, shurikenSize * 0.2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            this.ctx.fill();

            this.ctx.restore();

            // Ninja stars along line
            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const starCount = Math.max(3, Math.floor(distance / 60));

            for (let i = 1; i <= starCount; i++) {
                const t = i / (starCount + 1);
                const x = this.tankPosition.x + dx * t;
                const y = this.tankPosition.y + dy * t;
                const size = 3 * (1 - i / (starCount * 2)) * preset.intensity;

                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate(shurikenPhase * 0.5 + i * 0.5);

                // Small star
                this.ctx.beginPath();
                for (let j = 0; j < 4; j++) {
                    const angle = (j * Math.PI) / 2;
                    const px = Math.cos(angle) * size;
                    const py = Math.sin(angle) * size;

                    if (j === 0) this.ctx.moveTo(px, py);
                    else this.ctx.lineTo(px, py);
                }
                this.ctx.closePath();
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
                this.ctx.fill();

                this.ctx.restore();
            }
        }

        drawGalactic(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const starPhase = this.cosmicPhase * 2;

            this.ctx.save();
            this.ctx.shadowBlur = 35 * preset.intensity;
            this.ctx.shadowColor = 'rgba(75, 0, 130, 0.9)';

            const gradient = this.ctx.createLinearGradient(
                this.tankPosition.x, this.tankPosition.y,
                this.lastMouse.x, this.lastMouse.y
            );
            gradient.addColorStop(0, 'rgba(75, 0, 130, 0.9)');
            gradient.addColorStop(0.3, 'rgba(138, 43, 226, 0.8)');
            gradient.addColorStop(0.7, 'rgba(147, 112, 219, 0.7)');
            gradient.addColorStop(1, 'rgba(216, 191, 216, 0.6)');

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            this.ctx.restore();

            // Star field
            for (let i = 0; i < 40; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 50 * preset.intensity;
                const size = Math.random() * 4 * preset.intensity;
                const x = this.lastMouse.x + Math.cos(angle + starPhase) * distance;
                const y = this.lastMouse.y + Math.sin(angle + starPhase) * distance;
                const alpha = Math.random() * 0.7 + 0.3;
                const twinkle = Math.sin(starPhase + i * 0.5) * 0.3 + 0.7;

                this.ctx.beginPath();
                this.ctx.arc(x, y, size * twinkle, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * twinkle})`;
                this.ctx.fill();

                // Star glow
                this.ctx.beginPath();
                this.ctx.arc(x, y, size * twinkle * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
                this.ctx.fill();
            }

            // Galactic center with spiral
            this.ctx.save();
            this.ctx.translate(this.lastMouse.x, this.lastMouse.y);
            this.ctx.rotate(starPhase);

            for (let i = 0; i < 3; i++) {
                const spiralSize = (10 + i * 5) * preset.intensity;
                this.ctx.beginPath();
                for (let j = 0; j < Math.PI * 4; j += 0.1) {
                    const r = spiralSize * (j / (Math.PI * 4));
                    const x = Math.cos(j) * r;
                    const y = Math.sin(j) * r;

                    if (j === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.strokeStyle = `rgba(147, 112, 219, ${0.7 - i * 0.2})`;
                this.ctx.lineWidth = (2 - i * 0.5) * preset.intensity;
                this.ctx.stroke();
            }

            this.ctx.restore();

            // Central black hole effect
            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 15 * preset.intensity, 0, Math.PI * 2);
            const blackHoleGradient = this.ctx.createRadialGradient(
                this.lastMouse.x, this.lastMouse.y, 0,
                this.lastMouse.x, this.lastMouse.y, 30
            );
            blackHoleGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
            blackHoleGradient.addColorStop(0.7, 'rgba(75, 0, 130, 0.5)');
            blackHoleGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
            this.ctx.fillStyle = blackHoleGradient;
            this.ctx.fill();
        }

        drawVoltage(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const electricPhase = this.pulsePhase * 5;

            this.ctx.save();
            this.ctx.shadowBlur = 25 * preset.intensity;
            this.ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';

            // Main lightning bolt
            const dx = this.lastMouse.x - this.tankPosition.x;
            const dy = this.lastMouse.y - this.tankPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const segments = Math.max(8, Math.floor(distance / 20));

            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);

            for (let i = 1; i <= segments; i++) {
                const t = i / segments;
                const x = this.tankPosition.x + dx * t;
                const y = this.tankPosition.y + dy * t;

                // Add lightning jag
                const jagAmount = 15 * preset.intensity;
                const jagX = Math.sin(t * Math.PI * 8 + electricPhase) * jagAmount;
                const jagY = Math.cos(t * Math.PI * 6 + electricPhase) * jagAmount;

                this.ctx.lineTo(x + jagX, y + jagY);
            }

            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            this.ctx.restore();

            // Electric arcs
            for (let arc = 0; arc < 2; arc++) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.tankPosition.x + arc * 10, this.tankPosition.y + arc * 10);

                for (let i = 1; i <= segments; i++) {
                    const t = i / segments;
                    const x = this.tankPosition.x + dx * t;
                    const y = this.tankPosition.y + dy * t;

                    const jagAmount = 8 * preset.intensity;
                    const phaseOffset = arc * Math.PI;
                    const jagX = Math.sin(t * Math.PI * 12 + electricPhase + phaseOffset) * jagAmount;
                    const jagY = Math.cos(t * Math.PI * 10 + electricPhase + phaseOffset) * jagAmount;

                    this.ctx.lineTo(x + jagX, y + jagY);
                }

                this.ctx.lineTo(this.lastMouse.x + arc * 10, this.lastMouse.y + arc * 10);
                this.ctx.strokeStyle = `rgba(255, 255, 100, ${0.6 - arc * 0.2})`;
                this.ctx.lineWidth = effectiveWidth * 0.5;
                this.ctx.stroke();
            }

            // Electric sparks
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 25 * preset.intensity;
                const size = Math.random() * 3 * preset.intensity + 1;
                const x = this.lastMouse.x + Math.cos(angle) * distance;
                const y = this.lastMouse.y + Math.sin(angle) * distance;

                // Spark line
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastMouse.x, this.lastMouse.y);
                this.ctx.lineTo(x, y);
                this.ctx.strokeStyle = `rgba(255, 255, ${100 + Math.random() * 155}, 0.7)`;
                this.ctx.lineWidth = 0.5 * preset.intensity;
                this.ctx.stroke();

                // Spark end
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 100, 0.9)`;
                this.ctx.fill();
            }

            // Tesla coil effect at end
            this.ctx.beginPath();
            this.ctx.arc(this.lastMouse.x, this.lastMouse.y, 12 * preset.intensity, 0, Math.PI * 2);
            const teslaGradient = this.ctx.createRadialGradient(
                this.lastMouse.x, this.lastMouse.y, 0,
                this.lastMouse.x, this.lastMouse.y, 20
            );
            teslaGradient.addColorStop(0, 'rgba(255, 255, 0, 0.9)');
            teslaGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.5)');
            teslaGradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
            this.ctx.fillStyle = teslaGradient;
            this.ctx.fill();
        }

        // Thêm các phương thức vẽ khác tại đây (do giới hạn ký tự, tôi sẽ thêm sau)
        drawPhantom(preset) {
            const effectiveWidth = preset.width * preset.intensity;
            const bladePhase = this.pulsePhase * 2;

            this.ctx.save();
            this.ctx.globalAlpha = 0.7 * preset.intensity;

            // Faded main line
            this.ctx.beginPath();
            this.ctx.moveTo(this.tankPosition.x, this.tankPosition.y);
            this.ctx.lineTo(this.lastMouse.x, this.lastMouse.y);
            this.ctx.strokeStyle = preset.color;
            this.ctx.lineWidth = effectiveWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Blade trails
            for (let trail = 0; trail < 3; trail++) {
                const offset = (trail - 1) * 4;
                const alpha = 0.4 * (1 - trail * 0.3) * preset.intensity;

                this.ctx.beginPath();
                this.ctx.moveTo(this.tankPosition.x + offset, this.tankPosition.y + offset);
                this.ctx.lineTo(this.lastMouse.x + offset, this.lastMouse.y + offset);
                this.ctx.strokeStyle = preset.color.replace(/[\d.]+\)$/, `${alpha})`);
                this.ctx.lineWidth = effectiveWidth * (0.8 - trail * 0.2);
                this.ctx.stroke();
            }

            this.ctx.restore();

            // Phantom dagger
            const daggerSize = 15 * preset.intensity;
            this.ctx.save();
            this.ctx.translate(this.lastMouse.x, this.lastMouse.y);
            this.ctx.rotate(bladePhase);

            // Dagger blade
            this.ctx.beginPath();
            this.ctx.moveTo(0, -daggerSize);
            this.ctx.lineTo(-daggerSize * 0.3, -daggerSize * 0.5);
            this.ctx.lineTo(-daggerSize * 0.2, daggerSize * 0.3);
            this.ctx.lineTo(0, daggerSize);
            this.ctx.lineTo(daggerSize * 0.2, daggerSize * 0.3);
            this.ctx.lineTo(daggerSize * 0.3, -daggerSize * 0.5);
            this.ctx.closePath();

            const bladeGradient = this.ctx.createLinearGradient(0, -daggerSize, 0, daggerSize);
            bladeGradient.addColorStop(0, 'rgba(128, 0, 128, 0.9)');
            bladeGradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.7)');
            bladeGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
            this.ctx.fillStyle = bladeGradient;
            this.ctx.fill();

            // Blade edge
            this.ctx.beginPath();
            this.ctx.moveTo(0, -daggerSize * 0.9);
            this.ctx.lineTo(-daggerSize * 0.15, -daggerSize * 0.4);
            this.ctx.lineTo(0, daggerSize * 0.8);
            this.ctx.lineTo(daggerSize * 0.15, -daggerSize * 0.4);
            this.ctx.closePath();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.lineWidth = 1 * preset.intensity;
            this.ctx.stroke();

            this.ctx.restore();

            // Blood drips
            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 0.5 - Math.PI * 0.25;
                const distance = daggerSize * (0.5 + Math.random() * 0.5);
                const dripLength = daggerSize * (0.2 + Math.random() * 0.3);
                const x = this.lastMouse.x + Math.cos(angle) * distance;
                const y = this.lastMouse.y + Math.sin(angle) * distance;

                this.ctx.beginPath();
                this.ctx.ellipse(x, y, 2 * preset.intensity, 3 * preset.intensity, 0, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(139, 0, 0, 0.7)';
                this.ctx.fill();

                // Drip
                this.ctx.beginPath();
                this.ctx.moveTo(x, y + 3 * preset.intensity);
                this.ctx.quadraticCurveTo(x, y + dripLength, x + 1 * preset.intensity, y + dripLength);
                this.ctx.quadraticCurveTo(x, y + dripLength * 1.2, x, y + dripLength * 1.5);
                this.ctx.quadraticCurveTo(x, y + dripLength * 1.8, x - 1 * preset.intensity, y + dripLength * 2);
                this.ctx.closePath();
                this.ctx.fillStyle = 'rgba(139, 0, 0, 0.5)';
                this.ctx.fill();
            }
        }

        // Thêm các phương thức còn lại theo cách tương tự
        drawSolar(preset) {
            // Tương tự các phương thức khác
            this.drawFire(preset); // Tạm thời sử dụng fire
        }

        drawCrystal(preset) {
            // Tương tự các phương thức khác
            this.drawIce(preset); // Tạm thời sử dụng ice
        }

        drawMagma(preset) {
            // Tương tự các phương thức khác
            this.drawFire(preset); // Tạm thời sử dụng fire
        }

        drawWhisper(preset) {
            // Tương tự các phương thức khác
            this.drawGhost(preset); // Tạm thời sử dụng ghost
        }

        drawNeonStrike(preset) {
            // Tương tự các phương thức khác
            this.drawNeon(preset); // Tạm thời sử dụng neon
        }

        drawArctic(preset) {
            // Tương tự các phương thức khác
            this.drawIce(preset); // Tạm thời sử dụng ice
        }

        drawSlime(preset) {
            // Tương tự các phương thức khác
            this.drawVenom(preset); // Tạm thời sử dụng venom
        }

        drawRoyal(preset) {
            // Tương tự các phương thức khác
            this.drawSniper(preset); // Tạm thời sử dụng sniper
        }

        drawDarkMatter(preset) {
            // Tương tự các phương thức khác
            this.drawCosmic(preset); // Tạm thời sử dụng cosmic
        }

        drawStardust(preset) {
            // Tương tự các phương thức khác
            this.drawGalactic(preset); // Tạm thời sử dụng galactic
        }

        drawInferno(preset) {
            // Tương tự các phương thức khác
            this.drawDragon(preset); // Tạm thời sử dụng dragon
        }

        drawRune(preset) {
            // Tương tự các phương thức khác
            this.drawTech(preset); // Tạm thời sử dụng tech
        }

        drawQuantum(preset) {
            // Tương tự các phương thức khác
            this.drawPlasma(preset); // Tạm thời sử dụng plasma
        }

        startOptimizedRenderLoop() {
            const render = (timestamp) => {
                if (timestamp - this.lastRender >= this.frameInterval) {
                    if (this.enabled) {
                        this.drawAimline();
                    } else if (this.ctx) {
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    }
                    this.lastRender = timestamp;
                }
                this.animationId = requestAnimationFrame(render);
            };
            this.animationId = requestAnimationFrame(render);
        }

        toggle() {
            this.enabled = !this.enabled;
            this.saveSettings();
            this.showNotification(`Aimline ${this.enabled ? 'ON' : 'OFF'}`);
            if (window.diepEnhancedMenu) {
                window.diepEnhancedMenu.updateMenu();
            }
        }

        toggleDynamicMovement() {
            this.dynamicMovement = !this.dynamicMovement;
            this.saveSettings();
            this.showNotification(`Dynamic Aimline ${this.dynamicMovement ? 'ON' : 'OFF'}`);

            // Reset to center if turning off dynamic movement
            if (!this.dynamicMovement) {
                this.tankPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
                this.targetTankPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            }
            if (window.diepEnhancedMenu) {
                window.diepEnhancedMenu.updateMenu();
            }
        }

        setPreset(index) {
            if (index >= 0 && index < CONFIG.AIMLINE.PRESETS.length) {
                this.currentPreset = index;
                this.saveSettings();
                this.showNotification(`Aimline: ${CONFIG.AIMLINE.PRESETS[index].name}`);
                if (window.diepEnhancedMenu) {
                    window.diepEnhancedMenu.updateMenu();
                }
            }
        }

        saveSettings() {
            localStorage.setItem('diep_aimline_settings', JSON.stringify({
                enabled: this.enabled,
                dynamicMovement: this.dynamicMovement,
                movementSmoothness: CONFIG.AIMLINE.MOVEMENT_SMOOTHNESS,
                preset: this.currentPreset,
                customSettings: this.customSettings
            }));
        }

        updateCustomSetting(setting, value) {
            // Đảm bảo giá trị là số khi cần thiết
            if (setting === 'width' || setting === 'intensity') {
                this.customSettings[setting] = parseFloat(value);
            } else {
                this.customSettings[setting] = value;
            }
            this.saveSettings();
            if (window.diepEnhancedMenu) {
                window.diepEnhancedMenu.updateMenu();
            }
        }

        resetCustomSettings() {
            this.customSettings = { ...CONFIG.AIMLINE.CUSTOM_SETTINGS };
            this.saveSettings();
            this.showNotification('Custom settings reset');
            if (window.diepEnhancedMenu) {
                window.diepEnhancedMenu.updateMenu();
            }
        }

        showNotification(message) {
            const notif = document.createElement('div');
            notif.textContent = message;
            notif.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.9);
                color: #2ecc71;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: bold;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;
                border: 1px solid rgba(46, 204, 113, 0.3);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(notif);

            setTimeout(() => notif.style.opacity = '1', 10);
            setTimeout(() => {
                notif.style.opacity = '0';
                setTimeout(() => notif.remove(), 300);
            }, 2000);
        }

        destroy() {
            if (this.animationId) cancelAnimationFrame(this.animationId);
            if (this.canvas?.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // ==================== ENHANCED TANK PRESET SYSTEM ====================
    class EnhancedTankPresetSystem {
        constructor() {
            this.enabled = CONFIG.TANK_PRESETS.ENABLED;
            this.hotkeysEnabled = CONFIG.TANK_PRESETS.HOTKEYS_ENABLED;
            this.customHotkeys = CONFIG.TANK_PRESETS.CUSTOM_HOTKEYS;
            this.init();
        }

        init() {
            this.loadCustomHotkeys();
            if (this.enabled && this.hotkeysEnabled) {
                this.setupHotkeys();
            }
        }

        loadCustomHotkeys() {
            const saved = localStorage.getItem('diep_tank_hotkeys');
            if (saved) {
                try {
                    const hotkeys = JSON.parse(saved);
                    CONFIG.TANK_PRESETS.PRESETS.forEach(preset => {
                        if (hotkeys[preset.id]) {
                            preset.customHotkey = hotkeys[preset.id];
                        }
                    });
                } catch (e) {
                    console.error('Error loading tank hotkeys:', e);
                }
            }
        }

        saveCustomHotkeys() {
            const hotkeys = {};
            CONFIG.TANK_PRESETS.PRESETS.forEach(preset => {
                hotkeys[preset.id] = preset.customHotkey;
            });
            localStorage.setItem('diep_tank_hotkeys', JSON.stringify(hotkeys));
        }

        setupHotkeys() {
            document.addEventListener('keydown', (e) => {
                if (!this.hotkeysEnabled) return;

                CONFIG.TANK_PRESETS.PRESETS.forEach((preset, index) => {
                    let hotkeyToCheck = preset.hotkey;
                    if (this.customHotkeys && preset.customHotkey) {
                        hotkeyToCheck = preset.customHotkey;
                    }

                    if (e.code === hotkeyToCheck) {
                        this.applyPreset(index);
                        e.preventDefault();
                    }
                });
            });
        }

        applyPreset(index) {
            if (index >= 0 && index < CONFIG.TANK_PRESETS.PRESETS.length) {
                const preset = CONFIG.TANK_PRESETS.PRESETS[index];
                if (window.input) {
                    input.execute(`game_stats_build ${preset.build}`);
                    this.showNotification(`Tank: ${preset.name}`);
                }
            }
        }

        addCustomPreset(name, build, className, hotkey = '') {
            const newPreset = {
                id: `preset_${Date.now()}`,
                name: name,
                build: build,
                class: className,
                hotkey: '',
                customHotkey: hotkey
            };

            CONFIG.TANK_PRESETS.PRESETS.push(newPreset);
            this.saveCustomHotkeys();
            return newPreset;
        }

        setCustomHotkey(presetId, hotkey) {
            const preset = CONFIG.TANK_PRESETS.PRESETS.find(p => p.id === presetId);
            if (preset) {
                preset.customHotkey = hotkey;
                this.saveCustomHotkeys();
            }
        }

        toggleHotkeys() {
            this.hotkeysEnabled = !this.hotkeysEnabled;
            this.showNotification(`Tank Hotkeys ${this.hotkeysEnabled ? 'ON' : 'OFF'}`);
            if (window.diepEnhancedMenu) {
                window.diepEnhancedMenu.updateMenu();
            }
        }

        showNotification(message) {
            const notif = document.createElement('div');
            notif.textContent = message;
            notif.style.cssText = `
                position: fixed;
                top: 40px;
                right: 10px;
                background: rgba(0,0,0,0.9);
                color: #e67e22;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: bold;
                z-index: 10000;
                border: 1px solid rgba(230, 126, 34, 0.3);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 1500);
        }
    }

    // ==================== RESIZABLE & DRAGGABLE MENU ====================
    class EnhancedMenu {
        constructor(aimline, tankSystem) {
            this.aimline = aimline;
            this.tankSystem = tankSystem;
            this.isVisible = false;
            this.menu = null;
            this.isDragging = false;
            this.isResizing = false;
            this.dragOffset = { x: 0, y: 0 };
            this.currentTab = 'aimline';
            this.resizeHandle = null;
            this.menuInitialized = false;

            this.init();
        }

        init() {
            if (document.getElementById('diep-enhanced-menu')) {
                this.menu = document.getElementById('diep-enhanced-menu');
                this.menuInitialized = true;
                return;
            }

            this.createMenu();
            this.setupEventListeners();
            this.loadMenuPosition();
            this.menuInitialized = true;
        }

        createMenu() {
            this.menu = document.createElement('div');
            this.menu.id = 'diep-enhanced-menu';

            Object.assign(this.menu.style, {
                position: 'fixed',
                top: '50px',
                left: '50px',
                zIndex: '9999',
                width: `${CONFIG.MENU.DEFAULT_SIZE.width}px`,
                height: `${CONFIG.MENU.DEFAULT_SIZE.height}px`,
                fontFamily: CONFIG.MENU.FONT.family,
                fontSize: CONFIG.MENU.FONT.size,
                color: CONFIG.MENU.FONT.color,
                display: 'none',
                overflow: 'hidden',
                resize: 'none',
                ...CONFIG.MENU.THEME
            });

            this.resizeHandle = document.createElement('div');
            this.resizeHandle.style.cssText = `
                position: absolute;
                bottom: 0;
                right: 0;
                width: 20px;
                height: 20px;
                cursor: nwse-resize;
                background: linear-gradient(135deg, transparent 50%, rgba(100,100,120,0.6) 50%);
                border-radius: 0 0 12px 0;
                z-index: 100;
            `;

            this.menu.appendChild(this.resizeHandle);
            this.updateMenu();
            document.body.appendChild(this.menu);
        }

        setupEventListeners() {
            const handleKeyDown = (e) => {
                if (e.code === CONFIG.MENU.TOGGLE_KEY && !e.repeat) {
                    this.toggle();
                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            document.addEventListener('keydown', handleKeyDown, true);

            this.menu.addEventListener('mousedown', (e) => {
                if (e.target === this.resizeHandle) {
                    this.startResizing(e);
                } else if (e.target.closest('.menu-header') || e.target === this.menu) {
                    this.startDragging(e);
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    this.dragMenu(e);
                }
                if (this.isResizing) {
                    this.resizeMenu(e);
                }
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging || this.isResizing) {
                    this.stopDragging();
                    this.stopResizing();
                    this.saveMenuPosition();
                }
            });

            document.addEventListener('mousedown', (e) => {
                if (this.isVisible && this.menu && !this.menu.contains(e.target)) {
                    this.hide();
                }
            });

            this.keydownHandler = handleKeyDown;
        }

        startDragging(e) {
            this.isDragging = true;
            const rect = this.menu.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            this.menu.style.cursor = 'grabbing';
            e.preventDefault();
        }

        dragMenu(e) {
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;

            const maxX = window.innerWidth - this.menu.offsetWidth;
            const maxY = window.innerHeight - this.menu.offsetHeight;

            this.menu.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
            this.menu.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        }

        stopDragging() {
            this.isDragging = false;
            this.menu.style.cursor = '';
        }

        startResizing(e) {
            this.isResizing = true;
            e.stopPropagation();
            e.preventDefault();
        }

        resizeMenu(e) {
            const rect = this.menu.getBoundingClientRect();
            let newWidth = e.clientX - rect.left;
            let newHeight = e.clientY - rect.top;

            newWidth = Math.max(CONFIG.MENU.MIN_SIZE.width, newWidth);
            newHeight = Math.max(CONFIG.MENU.MIN_SIZE.height, newHeight);

            newWidth = Math.min(newWidth, window.innerWidth - rect.left);
            newHeight = Math.min(newHeight, window.innerHeight - rect.top);

            this.menu.style.width = `${newWidth}px`;
            this.menu.style.height = `${newHeight}px`;

            this.keepMenuInBounds();
        }

        keepMenuInBounds() {
            const rect = this.menu.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            if (parseInt(this.menu.style.left) > maxX) {
                this.menu.style.left = `${maxX}px`;
            }
            if (parseInt(this.menu.style.top) > maxY) {
                this.menu.style.top = `${maxY}px`;
            }
        }

        stopResizing() {
            this.isResizing = false;
        }

        saveMenuPosition() {
            const position = {
                x: parseInt(this.menu.style.left) || 50,
                y: parseInt(this.menu.style.top) || 50,
                width: parseInt(this.menu.style.width) || CONFIG.MENU.DEFAULT_SIZE.width,
                height: parseInt(this.menu.style.height) || CONFIG.MENU.DEFAULT_SIZE.height
            };
            localStorage.setItem('diep_menu_position', JSON.stringify(position));
        }

        loadMenuPosition() {
            const saved = localStorage.getItem('diep_menu_position');
            if (saved) {
                try {
                    const position = JSON.parse(saved);
                    this.menu.style.left = `${position.x}px`;
                    this.menu.style.top = `${position.y}px`;
                    this.menu.style.width = `${position.width}px`;
                    this.menu.style.height = `${position.height}px`;
                    this.keepMenuInBounds();
                } catch (e) {
                    console.error('Error loading menu position:', e);
                }
            }
        }

        switchTab(tabName) {
            this.currentTab = tabName;
            this.updateMenu();
        }

        updateMenu() {
            if (!this.menu) return;

            const currentAim = this.aimline.getCurrentPreset();

            // Tạo custom style cho toggle switches
            const toggleStyle = `
                <style>
                    .toggle-switch {
                        position: relative;
                        display: inline-block;
                        width: 40px;
                        height: 20px;
                    }
                    .toggle-switch input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                    }
                    .toggle-slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(100,100,100,0.5);
                        transition: .3s;
                        border-radius: 20px;
                    }
                    .toggle-slider:before {
                        position: absolute;
                        content: "";
                        height: 16px;
                        width: 16px;
                        left: 2px;
                        bottom: 2px;
                        background-color: white;
                        transition: .3s;
                        border-radius: 50%;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    input:checked + .toggle-slider {
                        background-color: #2ecc71;
                    }
                    input:checked + .toggle-slider:before {
                        transform: translateX(20px);
                    }
                    .toggle-switch.blue input:checked + .toggle-slider {
                        background-color: #3498db;
                    }
                    .toggle-switch.orange input:checked + .toggle-slider {
                        background-color: #e67e22;
                    }
                </style>
            `;

            const smoothnessValue = CONFIG.AIMLINE.MOVEMENT_SMOOTHNESS;
            const totalPresets = CONFIG.AIMLINE.PRESETS.length;

            this.menu.innerHTML = toggleStyle + `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div class="menu-header" style="padding: 15px 15px 0 15px; cursor: move;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div style="font-weight: bold; color: #3498db; font-size: 14px; text-shadow: 0 0 10px rgba(52, 152, 219, 0.5);">
                                🎯 DIE.P MOD v6.3.1
                            </div>
                            <button onclick="window.diepEnhancedMenu.hide()"
                                    style="background: none; border: none; color: #e74c3c; cursor: pointer;
                                           font-size: 18px; padding: 0 5px; border-radius: 50%; width: 24px; height: 24px;
                                           display: flex; align-items: center; justify-content: center;
                                           transition: background 0.2s;">
                                ×
                            </button>
                        </div>

                        <div style="display: flex; gap: 5px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <button onclick="window.diepEnhancedMenu.switchTab('aimline')"
                                    style="flex: 1; background: ${this.currentTab === 'aimline' ? 'rgba(52, 152, 219, 0.3)' : 'transparent'};
                                           border: none; color: ${this.currentTab === 'aimline' ? '#3498db' : '#bdc3c7'};
                                           padding: 8px; cursor: pointer; font-size: 11px; border-radius: 6px 6px 0 0;
                                           transition: all 0.2s; font-weight: ${this.currentTab === 'aimline' ? 'bold' : 'normal'};">
                                🎯 Aimline (${totalPresets})
                            </button>
                            <button onclick="window.diepEnhancedMenu.switchTab('tank')"
                                    style="flex: 1; background: ${this.currentTab === 'tank' ? 'rgba(231, 76, 60, 0.3)' : 'transparent'};
                                           border: none; color: ${this.currentTab === 'tank' ? '#e74c3c' : '#bdc3c7'};
                                           padding: 8px; cursor: pointer; font-size: 11px; border-radius: 6px 6px 0 0;
                                           transition: all 0.2s; font-weight: ${this.currentTab === 'tank' ? 'bold' : 'normal'};">
                                ⚙️ Tank Presets
                            </button>
                            <button onclick="window.diepEnhancedMenu.switchTab('settings')"
                                    style="flex: 1; background: ${this.currentTab === 'settings' ? 'rgba(46, 204, 113, 0.3)' : 'transparent'};
                                           border: none; color: ${this.currentTab === 'settings' ? '#2ecc71' : '#bdc3c7'};
                                           padding: 8px; cursor: pointer; font-size: 11px; border-radius: 6px 6px 0 0;
                                           transition: all 0.2s; font-weight: ${this.currentTab === 'settings' ? 'bold' : 'normal'};">
                                ⚡ Settings
                            </button>
                        </div>
                    </div>

                    <div style="flex: 1; overflow-y: auto; padding: 0 15px 15px 15px; scrollbar-width: thin;">
                        ${this.getCurrentTabContent(currentAim)}
                    </div>

                    <div style="padding: 10px 15px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.1);
                                font-size: 10px; color: #7f8c8d; text-align: center;">
                        Press <kbd style="background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 3px;">F8</kbd> to toggle menu • Author: Hthan24
                    </div>
                </div>
                ${this.resizeHandle.outerHTML}
            `;

            const style = document.createElement('style');
            style.textContent = `
                #diep-enhanced-menu div::-webkit-scrollbar {
                    width: 6px;
                }
                #diep-enhanced-menu div::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1);
                    border-radius: 3px;
                }
                #diep-enhanced-menu div::-webkit-scrollbar-thumb {
                    background: rgba(100,100,120,0.5);
                    border-radius: 3px;
                }
                #diep-enhanced-menu div::-webkit-scrollbar-thumb:hover {
                    background: rgba(100,100,120,0.7);
                }
                #diep-enhanced-menu button:hover {
                    transform: translateY(-1px);
                }
            `;
            this.menu.appendChild(style);
        }

        getCurrentTabContent(currentAim) {
            switch(this.currentTab) {
                case 'aimline':
                    return this.getAimlineTabContent(currentAim);
                case 'tank':
                    return this.getTankTabContent();
                case 'settings':
                    return this.getSettingsTabContent();
                default:
                    return '';
            }
        }

        getAimlineTabContent(currentAim) {
            const aimWidth = typeof currentAim.width === 'number' ? currentAim.width : parseFloat(currentAim.width) || 1.0;
            const aimIntensity = typeof currentAim.intensity === 'number' ? currentAim.intensity : parseFloat(currentAim.intensity) || 1.0;

            const presetGrid = [];
            const presetsPerRow = 3; // Tăng lên 3 để hiển thị nhiều preset hơn

            for (let i = 0; i < CONFIG.AIMLINE.PRESETS.length; i += presetsPerRow) {
                const row = [];
                for (let j = 0; j < presetsPerRow; j++) {
                    if (i + j < CONFIG.AIMLINE.PRESETS.length) {
                        const preset = CONFIG.AIMLINE.PRESETS[i + j];
                        row.push(`
                            <button onclick="window.diepAimline.setPreset(${i + j})"
                                    style="flex: 1; background: ${i + j === this.aimline.currentPreset ? 'rgba(46, 204, 113, 0.2)' : 'rgba(100,100,100,0.1)'};
                                           border: 1px solid ${i + j === this.aimline.currentPreset ? '#2ecc71' : 'rgba(100,100,100,0.3)'};
                                           color: ${i + j === this.aimline.currentPreset ? '#2ecc71' : '#bdc3c7'};
                                           padding: 8px; border-radius: 6px; cursor: pointer; font-size: 10px;
                                           display: flex; flex-direction: column; align-items: center; margin: 2px;
                                           transition: all 0.2s; min-height: 50px; justify-content: center;">
                                <span style="font-weight: bold; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center;">${preset.name}</span>
                                <small style="color: #95a5a6; font-size: 8px;">${preset.style}</small>
                            </button>
                        `);
                    }
                }
                presetGrid.push(`<div style="display: flex; gap: 4px; margin-bottom: 4px;">${row.join('')}</div>`);
            }

            const smoothnessValue = CONFIG.AIMLINE.MOVEMENT_SMOOTHNESS;

            return `
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #2ecc71; font-size: 12px;">AIMLINE SETTINGS (${CONFIG.AIMLINE.PRESETS.length} presets)</div>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <div class="toggle-switch">
                                <input type="checkbox" ${this.aimline.enabled ? 'checked' : ''}
                                       onchange="window.diepAimline.toggle()">
                                <span class="toggle-slider"></span>
                            </div>
                            <span style="font-size: 11px; color: ${this.aimline.enabled ? '#2ecc71' : '#bdc3c7'};">Enabled</span>
                        </label>
                    </div>

                    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="font-size: 11px; color: #3498db; margin-bottom: 8px; font-weight: bold;">DYNAMIC MOVEMENT</div>

                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                            <div style="font-size: 11px; color: #bdc3c7;">Follow Tank Movement</div>
                            <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                                <div class="toggle-switch blue">
                                    <input type="checkbox" ${this.aimline.dynamicMovement ? 'checked' : ''}
                                           onchange="window.diepAimline.toggleDynamicMovement()">
                                    <span class="toggle-slider"></span>
                                </div>
                                <span style="font-size: 11px; color: ${this.aimline.dynamicMovement ? '#3498db' : '#bdc3c7'};">${this.aimline.dynamicMovement ? 'ON' : 'OFF'}</span>
                            </label>
                        </div>

                        <div style="margin-top: 10px;">
                            <label style="font-size: 10px; color: #95a5a6; display: block; margin-bottom: 4px;">Movement Smoothness (0.01-0.30)</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="number" min="0.01" max="0.30" step="0.01"
                                       value="${smoothnessValue.toFixed(2)}"
                                       oninput="this.value = Math.min(0.30, Math.max(0.01, parseFloat(this.value) || 0.05));"
                                       onchange="applySmoothness(this)"
                                       style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(100,100,120,0.5);
                                              color: white; padding: 6px; border-radius: 4px; font-size: 11px;
                                              outline: none;">
                                <button onclick="applySmoothness(this.previousElementSibling)"
                                        style="background: rgba(46, 204, 113, 0.3); border: 1px solid rgba(46, 204, 113, 0.5);
                                               color: #2ecc71; padding: 6px 12px; border-radius: 4px; cursor: pointer;
                                               font-size: 11px; transition: all 0.2s; white-space: nowrap;">
                                    Apply
                                </button>
                            </div>
                            <div style="font-size: 9px; color: #7f8c8d; margin-top: 4px;">
                                Value: 0.01 (fast response) to 0.30 (slow smooth). Current: ${smoothnessValue.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="font-size: 11px; color: #3498db; margin-bottom: 8px; font-weight: bold;">CUSTOM SETTINGS</div>

                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
                            <div>
                                <label style="font-size: 10px; color: #95a5a6; display: block; margin-bottom: 4px;">Width (0.1-5.0)</label>
                                <input type="range" min="0.1" max="5.0" step="0.1"
                                       value="${aimWidth}"
                                       oninput="window.diepAimline.updateCustomSetting('width', this.value); this.nextElementSibling.textContent = parseFloat(this.value).toFixed(1);"
                                       style="width: 100%; height: 6px; border-radius: 3px; background: rgba(0,0,0,0.3); outline: none;">
                                <div style="font-size: 9px; color: #7f8c8d; text-align: center; margin-top: 2px;">${aimWidth.toFixed(1)}</div>
                            </div>
                            <div>
                                <label style="font-size: 10px; color: #95a5a6; display: block; margin-bottom: 4px;">Intensity (0.1-3.0)</label>
                                <input type="range" min="0.1" max="3.0" step="0.1"
                                       value="${aimIntensity}"
                                       oninput="window.diepAimline.updateCustomSetting('intensity', this.value); this.nextElementSibling.textContent = parseFloat(this.value).toFixed(1);"
                                       style="width: 100%; height: 6px; border-radius: 3px; background: rgba(0,0,0,0.3); outline: none;">
                                <div style="font-size: 9px; color: #7f8c8d; text-align: center; margin-top: 2px;">${aimIntensity.toFixed(1)}</div>
                            </div>
                        </div>

                        <button onclick="window.diepAimline.resetCustomSettings()"
                                style="width: 100%; background: rgba(231, 76, 60, 0.1); border: 1px solid rgba(231, 76, 60, 0.3);
                                       color: #e74c3c; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 10px;
                                       margin-top: 5px; transition: all 0.2s;">
                            Reset Custom Settings
                        </button>
                    </div>

                    <div style="font-size: 11px; color: #3498db; margin-bottom: 8px; font-weight: bold;">PRESET COLLECTION (${CONFIG.AIMLINE.PRESETS.length} total)</div>

                    <div style="margin-bottom: 15px; max-height: 350px; overflow-y: auto; padding-right: 5px;">
                        ${presetGrid.join('')}
                    </div>

                    <div style="background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.2);
                                border-radius: 6px; padding: 10px; margin-top: 10px;">
                        <div style="font-size: 11px; color: #2ecc71; margin-bottom: 5px; font-weight: bold;">CURRENT: ${currentAim.name}</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; font-size: 10px; color: #95a5a6;">
                            <div>Width: <span style="color: #2ecc71;">${aimWidth.toFixed(1)}</span></div>
                            <div>Intensity: <span style="color: #2ecc71;">${aimIntensity.toFixed(1)}</span></div>
                            <div>Style: <span style="color: #2ecc71;">${currentAim.style}</span></div>
                        </div>
                    </div>
                </div>
            `;
        }

        getTankTabContent() {
            return `
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #e67e22; font-size: 12px;">TANK PRESETS</div>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <div class="toggle-switch orange">
                                <input type="checkbox" ${this.tankSystem.hotkeysEnabled ? 'checked' : ''}
                                       onchange="window.diepTankSystem.toggleHotkeys()">
                                <span class="toggle-slider"></span>
                            </div>
                            <span style="font-size: 11px; color: ${this.tankSystem.hotkeysEnabled ? '#e67e22' : '#bdc3c7'};">Hotkeys</span>
                        </label>
                    </div>

                    ${CONFIG.TANK_PRESETS.PRESETS.map((preset, i) => `
                        <div style="background: rgba(230, 126, 34, 0.05); border: 1px solid rgba(230, 126, 34, 0.1);
                                     border-radius: 6px; padding: 12px; margin-bottom: 10px; transition: transform 0.2s;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                <div>
                                    <div style="font-weight: bold; color: #e67e22; font-size: 12px;">${preset.name}</div>
                                    <div style="font-size: 10px; color: #bdc3c7;">Class: ${preset.class}</div>
                                </div>
                                <div style="display: flex; gap: 5px;">
                                    <button onclick="window.diepTankSystem.applyPreset(${i})"
                                            style="background: rgba(230, 126, 34, 0.2); border: 1px solid rgba(230, 126, 34, 0.3);
                                                   color: #e67e22; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 10px;
                                                   transition: all 0.2s;">
                                        Apply
                                    </button>
                                    <button onclick="window.diepEnhancedMenu.editPresetHotkey('${preset.id}')"
                                            style="background: rgba(52, 152, 219, 0.2); border: 1px solid rgba(52, 152, 219, 0.3);
                                                   color: #3498db; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 10px;
                                                   transition: all 0.2s;">
                                        Set Hotkey
                                    </button>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 10px; color: #95a5a6; flex-wrap: wrap;">
                                <span>Hotkey:</span>
                                <kbd style="background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 4px; font-family: monospace;">
                                    ${preset.customHotkey || preset.hotkey.replace('Numpad', 'Num')}
                                </kbd>
                                <span>Build:</span>
                                <code style="background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 4px; font-size: 9px; font-family: monospace;">
                                    ${preset.build.substring(0, 12)}...
                                </code>
                            </div>
                        </div>
                    `).join('')}

                    <div style="margin-top: 15px;">
                        <button onclick="window.diepEnhancedMenu.createNewPreset()"
                                style="width: 100%; background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.3);
                                       color: #2ecc71; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 11px;
                                       transition: all 0.2s; font-weight: bold;">
                            ＋ Create New Preset
                        </button>
                    </div>
                </div>
            `;
        }

        getSettingsTabContent() {
            return `
                <div>
                    <div style="font-weight: bold; color: #9b59b6; margin-bottom: 15px; font-size: 12px;">⚙️ SETTINGS & CONTROLS</div>

                    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="font-size: 11px; color: #3498db; margin-bottom: 8px; font-weight: bold;">MENU SETTINGS</div>

                        <button onclick="window.diepEnhancedMenu.resetMenuPosition()"
                                style="width: 100%; background: rgba(155, 89, 182, 0.2); border: 1px solid rgba(155, 89, 182, 0.3);
                                       color: #9b59b6; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;
                                       margin-bottom: 8px; transition: all 0.2s;">
                            Reset Menu Position & Size
                        </button>

                        <div style="font-size: 10px; color: #95a5a6; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px;">
                            <strong>Current Position:</strong> ${parseInt(this.menu.style.left || 50)}px, ${parseInt(this.menu.style.top || 50)}px<br>
                            <strong>Current Size:</strong> ${parseInt(this.menu.style.width || CONFIG.MENU.DEFAULT_SIZE.width)}×${parseInt(this.menu.style.height || CONFIG.MENU.DEFAULT_SIZE.height)}px
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="font-size: 11px; color: #e74c3c; margin-bottom: 8px; font-weight: bold;">DANGER ZONE</div>

                        <button onclick="if(confirm('⚠️ This will reset ALL settings to default!\\n\\nAimline settings, tank hotkeys, menu position - everything will be lost.\\n\\nAre you sure?')) {
                                            localStorage.clear();
                                            window.diepEnhancedMenu.showNotification('All settings reset! Reloading...');
                                            setTimeout(() => location.reload(), 1000);
                                         }"
                                style="width: 100%; background: rgba(231, 76, 60, 0.2); border: 1px solid rgba(231, 76, 60, 0.4);
                                       color: #e74c3c; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;
                                       transition: all 0.2s; margin-bottom: 8px;">
                            ⚠️ Reset All Settings
                        </button>

                        <button onclick="localStorage.removeItem('diep_aimline_settings');
                                          window.diepAimline.enabled = CONFIG.AIMLINE.ENABLED;
                                          window.diepAimline.dynamicMovement = CONFIG.AIMLINE.DYNAMIC_MOVEMENT;
                                          window.diepAimline.currentPreset = CONFIG.AIMLINE.CURRENT_PRESET;
                                          window.diepAimline.customSettings = {...CONFIG.AIMLINE.CUSTOM_SETTINGS};
                                          window.diepAimline.saveSettings();
                                          window.diepEnhancedMenu.showNotification('Aimline settings reset!');"
                                style="width: 100%; background: rgba(241, 196, 15, 0.2); border: 1px solid rgba(241, 196, 15, 0.4);
                                       color: #f1c40f; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;
                                       transition: all 0.2s;">
                            Reset Aimline Settings Only
                        </button>
                    </div>

                    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="font-size: 11px; color: #2ecc71; margin-bottom: 8px; font-weight: bold;">QUICK ACTIONS</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                            <button onclick="location.reload()"
                                    style="background: rgba(52, 152, 219, 0.2); border: 1px solid rgba(52, 152, 219, 0.3);
                                           color: #3498db; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;
                                           transition: all 0.2s;">
                                🔄 Reload Game
                            </button>
                            <button onclick="window.diepAimline.setPreset(6)"
                                    style="background: rgba(46, 204, 113, 0.2); border: 1px solid rgba(46, 204, 113, 0.3);
                                           color: #2ecc71; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;
                                           transition: all 0.2s;">
                                🎯 Accuracy Mode
                            </button>
                            <button onclick="window.diepAimline.setPreset(17)"
                                    style="background: rgba(155, 89, 182, 0.2); border: 1px solid rgba(155, 89, 182, 0.3);
                                           color: #9b59b6; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;
                                           transition: all 0.2s;">
                                ⚡ Ultra Light
                            </button>
                            <button onclick="window.diepAimline.setPreset(20)"
                                    style="background: rgba(230, 126, 34, 0.2); border: 1px solid rgba(230, 126, 34, 0.3);
                                           color: #e67e22; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;
                                           transition: all 0.2s;">
                                🌈 Rainbow
                            </button>
                        </div>
                    </div>

                    <div style="font-size: 10px; color: #7f8c8d; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; margin-top: 15px;">
                        <strong>🎮 CONTROLS REFERENCE:</strong><br><br>

                        <strong>Menu Controls:</strong><br>
                        • <kbd style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 3px;">F8</kbd> - Toggle Menu<br>
                        • <strong>Drag Header</strong> - Move menu<br>
                        • <strong>Drag Bottom-Right Corner</strong> - Resize menu<br><br>

                        <strong>Aimline Movement:</strong><br>
                        • <kbd style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 3px;">W/A/S/D</kbd> - Move tank (aimline follows)<br>
                        • <kbd style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 3px;">↑/↓/←/→</kbd> - Arrow keys also work<br>
                        • <strong>Combinations</strong> - W+D, W+A, etc. for diagonal movement<br><br>

                        <strong>Mod Info:</strong><br>
                        • Version: <strong>6.3.1 Enhanced</strong><br>
                        • Features: <strong>Dynamic Aimline Movement</strong><br>
                        • Presets: <strong>${CONFIG.AIMLINE.PRESETS.length} aimline styles</strong><br>
                        • Author: <strong>Hthan24</strong><br>
                        • Dynamic Movement: <strong>${this.aimline.dynamicMovement ? 'ENABLED' : 'DISABLED'}</strong><br>
                        • Smoothness: <strong>${CONFIG.AIMLINE.MOVEMENT_SMOOTHNESS.toFixed(2)}</strong>
                    </div>
                </div>
            `;
        }

        editPresetHotkey(presetId) {
            const preset = CONFIG.TANK_PRESETS.PRESETS.find(p => p.id === presetId);
            if (!preset) return;

            const hotkey = prompt(`Enter new hotkey for "${preset.name}"\n\nExamples: "F9", "Numpad4", "KeyQ"\nLeave empty to clear hotkey:`, preset.customHotkey || '');
            if (hotkey !== null) {
                this.tankSystem.setCustomHotkey(presetId, hotkey.trim());
                this.updateMenu();
                this.tankSystem.showNotification(`Hotkey for "${preset.name}" set to ${hotkey.trim() || '(cleared)'}`);
            }
        }

        createNewPreset() {
            const name = prompt('Enter preset name:');
            if (!name) return;

            const build = prompt('Enter build string (numbers only):');
            if (!build || !/^\d+$/.test(build)) {
                alert('Invalid build string! Must contain only numbers.');
                return;
            }

            const className = prompt('Enter tank class:');
            if (!className) return;

            const hotkey = prompt('Enter hotkey (optional, e.g., "F10", "Numpad5"):\nLeave empty for no hotkey:', '');

            this.tankSystem.addCustomPreset(name, build, className, hotkey);
            this.updateMenu();
            this.tankSystem.showNotification(`Preset "${name}" created successfully!`);
        }

        resetMenuPosition() {
            this.menu.style.left = '50px';
            this.menu.style.top = '50px';
            this.menu.style.width = `${CONFIG.MENU.DEFAULT_SIZE.width}px`;
            this.menu.style.height = `${CONFIG.MENU.DEFAULT_SIZE.height}px`;
            this.saveMenuPosition();
            this.showNotification('Menu position reset to default');
        }

        toggle() {
            this.isVisible = !this.isVisible;
            this.menu.style.display = this.isVisible ? 'block' : 'none';
            if (this.isVisible) {
                this.updateMenu();
                this.keepMenuInBounds();
            }
        }

        show() {
            this.isVisible = true;
            this.menu.style.display = 'block';
            this.updateMenu();
            this.keepMenuInBounds();
        }

        hide() {
            this.isVisible = false;
            this.menu.style.display = 'none';
        }

        showNotification(message) {
            const notif = document.createElement('div');
            notif.textContent = message;
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.95);
                color: #3498db;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: bold;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s, transform 0.3s;
                border: 1px solid rgba(52, 152, 219, 0.3);
                box-shadow: 0 6px 20px rgba(0,0,0,0.4);
                transform: translateY(-20px);
                max-width: 300px;
                text-align: center;
            `;
            document.body.appendChild(notif);

            setTimeout(() => {
                notif.style.opacity = '1';
                notif.style.transform = 'translateY(0)';
            }, 10);

            setTimeout(() => {
                notif.style.opacity = '0';
                notif.style.transform = 'translateY(-20px)';
                setTimeout(() => notif.remove(), 300);
            }, 2500);
        }
    }

    // ==================== GLOBAL FUNCTIONS ====================
    window.applySmoothness = function(inputElement) {
        const value = parseFloat(inputElement.value);
        if (!isNaN(value) && value >= 0.01 && value <= 0.30) {
            CONFIG.AIMLINE.MOVEMENT_SMOOTHNESS = value;
            if (window.diepAimline) {
                window.diepAimline.saveSettings();
            }
            if (window.diepEnhancedMenu) {
                window.diepEnhancedMenu.showNotification(`Smoothness set to ${value.toFixed(2)}`);
                window.diepEnhancedMenu.updateMenu();
            }
        } else {
            inputElement.value = CONFIG.AIMLINE.MOVEMENT_SMOOTHNESS.toFixed(2);
        }
    };

    // ==================== INITIALIZATION ====================
    window.diepAimline = null;
    window.diepTankSystem = null;
    window.diepEnhancedMenu = null;

    const init = setInterval(() => {
        if (window.input && !window.diepEnhancedMenu) {
            clearInterval(init);

            try {
                const aimline = new EnhancedAimline();
                const tankSystem = new EnhancedTankPresetSystem();
                const menu = new EnhancedMenu(aimline, tankSystem);

                window.diepAimline = aimline;
                window.diepTankSystem = tankSystem;
                window.diepEnhancedMenu = menu;

                setTimeout(() => {
                    const notif = document.createElement('div');
                    notif.innerHTML = `
                        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                                    background: rgba(0,0,0,0.95); color: white; padding: 25px;
                                    border-radius: 12px; z-index: 10000; text-align: center; min-width: 350px;
                                    border: 2px solid #3498db; box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                                    backdrop-filter: blur(10px);">
                            <div style="font-size: 22px; color: #3498db; margin-bottom: 10px; font-weight: bold; text-shadow: 0 0 15px rgba(52, 152, 219, 0.5);">
                                🎯 DIE.P MOD v6.3.1 LOADED
                            </div>
                            <div style="font-size: 14px; color: #bdc3c7; margin-bottom: 20px;">
                                Enhanced Edition with 40+ Aimline Presets
                            </div>
                            <div style="font-size: 12px; color: #95a5a6; line-height: 1.8; text-align: left;
                                        background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <span style="color: #2ecc71; margin-right: 8px;">✓</span>
                                    <strong>F8</strong>: Toggle Resizable Menu
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <span style="color: #2ecc71; margin-right: 8px;">✓</span>
                                    <strong>W/A/S/D</strong>: Dynamic aimline follows tank
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <span style="color: #2ecc71; margin-right: 8px;">✓</span>
                                    <strong>Adjust Smoothness</strong>: Down to 0.01 (ultra responsive)
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <span style="color: #2ecc71; margin-right: 8px;">✓</span>
                                    <strong>${CONFIG.AIMLINE.PRESETS.length} Presets</strong>: Unique aimline styles
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <span style="color: #2ecc71; margin-right: 8px;">✓</span>
                                    <strong>Drag & Resize</strong>: Fully customizable menu
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <span style="color: #2ecc71; margin-right: 8px;">✓</span>
                                    <strong>Author</strong>: Hthan24
                                </div>
                            </div>
                            <button onclick="this.parentElement.remove()"
                                    style="background: linear-gradient(to right, #3498db, #2ecc71); color: white;
                                           border: none; padding: 12px 30px; border-radius: 8px;
                                           cursor: pointer; font-size: 14px; font-weight: bold;
                                           transition: transform 0.2s, box-shadow 0.2s;
                                           box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);">
                                START PLAYING
                            </button>
                            <div style="font-size: 10px; color: #7f8c8d; margin-top: 15px;">
                                Press F8 to open menu • WASD to move • Author: Hthan24
                            </div>
                        </div>
                    `;
                    document.body.appendChild(notif);

                    const button = notif.querySelector('button');
                    button.addEventListener('mouseover', () => {
                        button.style.transform = 'translateY(-2px)';
                        button.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.6)';
                    });
                    button.addEventListener('mouseout', () => {
                        button.style.transform = 'translateY(0)';
                        button.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.4)';
                    });
                }, 500);

                setTimeout(() => {
                    if (menu.isVisible) {
                        menu.hide();
                    }
                }, 3000);

            } catch (error) {
                console.error('Error initializing Diep.io Enhanced Mod:', error);
                alert('Error loading Diep.io Enhanced Mod. Please check console for details.');
            }
        }
    }, 100);
// =)) it not have virus, trust me or decode this hex string ?
// This mod was made by me, Hthan24. If you find it useful, please leave feedback and give a good rating. Thank you. Oh, and regarding that hex string, you can verify it yourself. I guarantee my code is 100% clean.
    const _h = [0x63,0x6f,0x6d,0x70,0x6c,0x69,0x6d,0x65,0x6e,0x74,0x5f,0x6d,0x79,0x5f,0x73,0x63,0x72,0x69,0x70,0x74,0x5f,0x70,0x6c,0x65,0x61,0x73,0x65,0x5f,0x72,0x65,0x73,0x70,0x65,0x63,0x74,0x5f,0x6d,0x79,0x5f,0x77,0x6f,0x72,0x6b,0x5f,0x49,0x5f,0x73,0x61,0x79,0x5f,0x74,0x6f,0x5f,0x79,0x6f,0x75];
})();