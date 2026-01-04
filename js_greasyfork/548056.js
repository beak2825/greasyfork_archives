// ==UserScript==
// @name         ♔ Red King ♔
// @namespace    http://tampermonkey.net/
// @version      2.4.2
// @description  ¡RED KING ♔! Cliente personalizado para Lichess con sonidos, efectos, sprites y más funciones.
// @author       IamGi4nx
// @match        https://lichess.org/*
// @match        https://*.lichess.org/*
// @icon         https://openclipart.org/image/2000px/275290
// @license      All Rights Reserved
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548056/%E2%99%94%20Red%20King%20%E2%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/548056/%E2%99%94%20Red%20King%20%E2%99%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === RED KING PRO v3.0.0 =====
    // Arquitectura completamente reescrita con optimizaciones avanzadas
    // Original by IamGi4nx - Pro Version

    // === PERFORMANCE CORE & ADVANCED UTILITIES ===

    // Cache inteligente para elementos DOM
    class DOMCache {
        constructor() {
            this.cache = new Map();
            this.observers = new WeakMap();
            this.lastUpdate = 0;
            this.CACHE_DURATION = 5000; // 5 segundos
        }

        get(key, selector, parent = document) {
            const now = Date.now();
            const cached = this.cache.get(key);

            if (cached && (now - cached.timestamp) < this.CACHE_DURATION && cached.element && cached.element.parentNode) {
                return cached.element;
            }

            const element = Array.isArray(selector)
                ? this.findFirstMatch(selector, parent)
                : parent.querySelector(selector);

            if (element) {
                this.cache.set(key, { element, timestamp: now });
                this.setupInvalidation(key, element);
            }

            return element;
        }

        findFirstMatch(selectors, parent) {
            for (const selector of selectors) {
                const element = parent.querySelector(selector);
                if (element) return element;
            }
            return null;
        }

        setupInvalidation(key, element) {
            if (this.observers.has(element)) return;

            const observer = new MutationObserver(() => {
                this.cache.delete(key);
                observer.disconnect();
                this.observers.delete(element);
            });

            this.observers.set(element, observer);

            if (element.parentNode) {
                observer.observe(element.parentNode, {
                    childList: true,
                    subtree: false
                });
            }
        }

        clear() {
            this.cache.clear();
        }
    }

    // Sistema de eventos optimizado
    class EventManager {
        constructor() {
            this.listeners = new Map();
            this.delegatedEvents = new Map();
        }

        on(element, event, handler, options = {}) {
            const key = `${element.constructor.name}_${event}`;

            if (!this.listeners.has(key)) {
                this.listeners.set(key, new Set());
            }

            const wrappedHandler = options.throttle
                ? throttle(handler, options.throttle)
                : options.debounce
                ? debounce(handler, options.debounce)
                : handler;

            element.addEventListener(event, wrappedHandler, options);
            this.listeners.get(key).add({ handler: wrappedHandler, original: handler, options });

            return () => this.off(element, event, handler);
        }

        off(element, event, handler) {
            const key = `${element.constructor.name}_${event}`;
            const eventListeners = this.listeners.get(key);

            if (eventListeners) {
                for (const listener of eventListeners) {
                    if (listener.original === handler) {
                        element.removeEventListener(event, listener.handler, listener.options);
                        eventListeners.delete(listener);
                        break;
                    }
                }
            }
        }

        delegate(parent, selector, event, handler, options = {}) {
            const key = `${selector}_${event}`;

            if (this.delegatedEvents.has(key)) return;

            const delegatedHandler = (e) => {
                const target = e.target.closest(selector);
                if (target && parent.contains(target)) {
                    handler.call(target, e);
                }
            };

            parent.addEventListener(event, delegatedHandler, options);
            this.delegatedEvents.set(key, { handler: delegatedHandler, options });
        }

        cleanup() {
            this.listeners.clear();
            this.delegatedEvents.clear();
        }
    }

    // Instancias globales de los sistemas optimizados
    const domCache = new DOMCache();
    const eventManager = new EventManager();
    const SELECTORS = {
        board: ['.cg-wrap', '.board-wrap', 'main.game .cg-wrap', '.game .cg-wrap', '.analyse .cg-wrap', '.lpv .cg-wrap'],
        chat: ['.mchat', '.chat', '.game__chat', '#chat', '.lpv__chat', '.chat-wrap'],
        flipButtons: ['.game .game__buttons .fbt', '.analyse__tools .fbt', 'button.fbt', '.flip', 'button[title*="flip"]', 'button[title*="Flip"]', '.game__menu button[data-icon="B"]', '.lpv__fbt'],
        pieces: 'cg-board piece, .cg-board piece',
        lastMove: 'cg-board square.last-move, .cg-board square.last-move',
        check: 'cg-board square.check, .cg-board square.check',
        moveList: ['.moves .move', '.move-list .move', '.pgn .move', '.replay .move', '.game .moves .move', '.analyse .moves .move']
    };

    const AUDIO_FREQUENCIES = {
        move: { freq: 520, type: 'sine' },
        capture: { freq: 300, type: 'square', lp: 1500 },
        check: { freq: 800, type: 'triangle' },
        checkmate: [440, 554, 659, 880],
        castle: { freq: 660, type: 'sawtooth' },
        promotion: [523, 659, 784],
        gameEnd: [330, 277, 220]
    };

    // Performance optimization: debounce utility
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Throttle utility for frequent events
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Enhanced DOM utility class
    class DOMUtils {
        static querySelector(selectors, parent = document) {
            if (Array.isArray(selectors)) {
                for (const selector of selectors) {
                    const element = parent.querySelector(selector);
                    if (element) return element;
                }
                return null;
            }
            return parent.querySelector(selectors);
        }

        static querySelectorAll(selectors, parent = document) {
            if (Array.isArray(selectors)) {
                for (const selector of selectors) {
                    const elements = parent.querySelectorAll(selector);
                    if (elements.length > 0) return Array.from(elements);
                }
                return [];
            }
            return Array.from(parent.querySelectorAll(selectors));
        }

        static createElement(tag, options = {}) {
            const element = document.createElement(tag);

            if (options.id) element.id = options.id;
            if (options.className) element.className = options.className;
            if (options.textContent) element.textContent = options.textContent;
            if (options.innerHTML) element.innerHTML = options.innerHTML;
            if (options.style) Object.assign(element.style, options.style);
            if (options.attributes) {
                Object.entries(options.attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
            }
            if (options.events) {
                Object.entries(options.events).forEach(([event, handler]) => {
                    element.addEventListener(event, handler);
                });
            }

            return element;
        }

        static animateElement(element, animation, duration = 300) {
            return new Promise((resolve) => {
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                Object.assign(element.style, animation.from || {});

                requestAnimationFrame(() => {
                    Object.assign(element.style, animation.to || {});
                });

                setTimeout(() => {
                    element.style.transition = '';
                    resolve();
                }, duration);
            });
        }
    }

    // Memory management utilities
    class MemoryManager {
        constructor() {
            this.observers = new Set();
            this.eventListeners = new Set();
            this.timeouts = new Set();
            this.intervals = new Set();
        }

        addObserver(observer) {
            this.observers.add(observer);
        }

        addEventListeners(target, events) {
            events.forEach(({ event, handler, options }) => {
                target.addEventListener(event, handler, options);
                this.eventListeners.add({ target, event, handler, options });
            });
        }

        addTimeout(callback, delay) {
            const id = setTimeout(() => {
                this.timeouts.delete(id);
                callback();
            }, delay);
            this.timeouts.add(id);
            return id;
        }

        addInterval(callback, delay) {
            const id = setInterval(callback, delay);
            this.intervals.add(id);
            return id;
        }

        cleanup() {
            // Disconnect observers
            this.observers.forEach(observer => {
                try {
                    observer.disconnect();
                } catch (e) {
                    console.warn('Error disconnecting observer:', e);
                }
            });

            // Remove event listeners
            this.eventListeners.forEach(({ target, event, handler, options }) => {
                try {
                    target.removeEventListener(event, handler, options);
                } catch (e) {
                    console.warn('Error removing event listener:', e);
                }
            });

            // Clear timeouts and intervals
            this.timeouts.forEach(clearTimeout);
            this.intervals.forEach(clearInterval);

            // Reset collections
            this.observers.clear();
            this.eventListeners.clear();
            this.timeouts.clear();
            this.intervals.clear();
        }
    }

    // Global memory manager instance
    const memoryManager = new MemoryManager();


    // === ESTILOS BASE - SOLO ANIMACIONES SIN EFECTOS VISUALES ===
    // Solo definir animaciones, sin aplicarlas automáticamente
    GM_addStyle(`

        @keyframes redKingPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
        }

        @keyframes redKingGlow {
            0% { box-shadow: 0 0 5px rgba(255,215,0,0.5); }
            50% { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
            100% { box-shadow: 0 0 5px rgba(255,215,0,0.5); }
        }

        @keyframes redKingBoardEntry {
            0% {
                opacity: 0;
                transform: scale(0.8) rotateY(10deg);
            }
            100% {
                opacity: 1;
                transform: scale(1) rotateY(0deg);
            }
        }

        @keyframes captureFlash {
            0% { background: radial-gradient(circle, rgba(220,20,60,0.8) 0%, transparent 70%); }
            100% { background: transparent; }
        }

        /* NOTA: Los efectos de hover y animaciones de tablero se aplican SOLO cuando las funciones están activadas */
    `);

    GM_addStyle(`
        #redKingPanel {
            background: linear-gradient(145deg, #1a0a0a 0%, #2b0e0e 100%) !important;
            border: 2px solid #b22222 !important;
            border-radius: 15px !important;
            box-shadow: 0 15px 35px rgba(0,0,0,0.9), 0 0 20px rgba(178,34,34,0.5) !important;
            overflow: hidden !important;
            backdrop-filter: blur(10px) !important;
        }
        #redKingPanel #panelHeader {
            background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%) !important;
            color: #FFD7D7 !important;
            font-weight: bold !important;
        }
        #redKingPanel .tab-btn {
            flex: 1;
            padding: 10px 6px;
            text-align: center;
            font-size: 11px;
            cursor: pointer;
            background: #3a1f1f !important;
            color: #ddd !important;
            transition: all 0.3s ease;
        }
        #redKingPanel .tab-btn.active {
            background: #b22222 !important;
            color: #FFD700 !important;
        }
        #redKingPanel .action-btn, #redKingPanel .social-btn {
            background: linear-gradient(135deg, #a83232 0%, #7a0e0e 100%) !important;
            color: #fff !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            font-size: 12px !important;
            cursor: pointer !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
            transition: all 0.25s ease;
        }
        #redKingPanel .action-btn:hover, #redKingPanel .social-btn:hover {
            background: linear-gradient(135deg, #c0392b 0%, #922b21 100%) !important;
            transform: translateY(-2px);
        }
        .toggle-switch input:checked + .toggle-slider {
            background-color: #b22222 !important;
        }
        #redKingTopNotification {
            background: linear-gradient(90deg, #a10c0c 0%, #b22222 100%) !important;
            color: #fff !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
        }
        #redKingMusicPlayer {
            background: linear-gradient(145deg, #2a0e0e 0%, #1a0a0a 100%) !important;
            border: 2px solid #b22222 !important;
            border-radius: 10px !important;
        }
        #redKingMusicPlayer button {
            background: #b22222 !important;
            color: #fff !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 4px 8px !important;
            cursor: pointer !important;
        }
        #redKingMusicPlayer button:hover {
            background: #c0392b !important;
        }
        .sprite-upload-btn {
            background: #8B0000 !important;
        }
        .sprite-reset-btn {
            background: #a83232 !important;
        }
        #redKingPanel h4, #redKingPanel h5 {
            color: #ffaaaa !important;
        }
        #redKingPanel input[type="color"] {
            border: 2px solid #b22222 !important;
        }
    `);


    console.log('🔴♔ Red King v2.4.2 iniciando...');

    // === MEJORAS VISUALES NOTABLES ===








    // Configuración por defecto mejorada
    const defaultConfig = {
        // Opciones nuevas visibles
        particleEffects: true,
        enhancedAnimations: true,
        theme: 'red-king',
        soundEnabled: false,
        autoRotate: false,
        showStats: false,
        autoAnalysis: false,
        customSounds: false,
        boardEffects: false,
        chatVisible: true,
        boardMoveable: false,
        panelVisible: true,
        // Colores de partículas configurables
        particleColors: {
            primary: '#FFD700',    // Dorado
            secondary: '#FF6B35',  // Naranja
            tertiary: '#FF1744'    // Rojo
        },
        // Configuración de partículas
        particleConfig: {
            count: 8,        // Cantidad de partículas (1-20)
            range: 50        // Rango de dispersión en px (20-100)
        },
        // Nuevas opciones CORREGIDAS
        musicPlayer: {
            enabled: false,
            youtubeUrl: '',
            volume: 0.5,
            autoplay: false
        },
        customSprites: {
            enabled: false,
            pieces: {
                'white-king': '',
                'white-queen': '',
                'white-rook': '',
                'white-bishop': '',
                'white-knight': '',
                'white-pawn': '',
                'black-king': '',
                'black-queen': '',
                'black-rook': '',
                'black-bishop': '',
                'black-knight': '',
                'black-pawn': ''
            }
        },
        customColors: {
            primary: '#8B0000',
            secondary: '#DC143C',
            accent: '#FFD700',
            background: '#1a1a1a',
            text: '#ffffff',
            chatText: '#ffffff'
        },
        buttonColors: {
            enabled: false,
            buttonPrimary: '#8B0000',
            buttonSecondary: '#DC143C',
            hoverPrimary: '#DC143C',
            hoverSecondary: '#8B0000',
            textColor: '#ffffff'
        },
        shortcuts: {
            flipBoard: 'f',
            resign: 'r',
            takeback: 't',
            analysis: 'a',
            panel: 'p',
            toggleChat: 'c'
        },
        userLinks: {
            discord: 'https://discord.gg/2mqdDJAZdq',
            github: 'https://github.com/gi4nxdepelover'
        }
    };

    // Variables globales - CARGA SEGURA DE CONFIGURACIÓN
    let config;
    let panelVisible = true;

    // CRÍTICO: Cargar configuración de forma segura
    try {
        const storedConfig = GM_getValue('redKingConfig242', null);
        if (storedConfig === null) {
            console.log('ℹ️ Primera ejecución - usando configuración por defecto (todo desactivado)');
            config = JSON.parse(JSON.stringify(defaultConfig));
            GM_setValue('redKingConfig242', config);
        } else {
            console.log('📋 Configuración existente encontrada, fusionando...');
            config = JSON.parse(JSON.stringify(defaultConfig));
            // Fusionar solo valores válidos
            Object.keys(defaultConfig).forEach(key => {
                if (storedConfig.hasOwnProperty(key) && typeof storedConfig[key] === typeof defaultConfig[key]) {
                    if (typeof defaultConfig[key] === 'object' && defaultConfig[key] !== null) {
                        Object.keys(defaultConfig[key]).forEach(subKey => {
                            if (storedConfig[key] && storedConfig[key].hasOwnProperty(subKey)) {
                                config[key][subKey] = storedConfig[key][subKey];
                            }
                        });
                    } else {
                        config[key] = storedConfig[key];
                    }
                }
            });
            console.log('✅ Configuración fusionada exitosamente');
        }
        panelVisible = config.panelVisible;
    } catch (error) {
        console.error('❌ Error cargando configuración, usando por defecto:', error);
        config = JSON.parse(JSON.stringify(defaultConfig));
        panelVisible = true;
    }

    // Asegurar compatibilidad con configuraciones antiguas donde no existe panelVisible
    if (typeof config.panelVisible !== 'boolean') {
        config.panelVisible = true; // por defecto visible
        panelVisible = true;
        GM_setValue('redKingConfig242', config);
        console.log('⚙️ Config antigua detectada: estableciendo panelVisible=true por defecto');
    }

    let currentTab = 'general';
    let boardMoved = false;
    let originalBoardPosition = null;
    let boardDragListeners = [];
    let musicPlayerInstance = null;
    let customSpritesApplied = false;
    let youtubeAPIReady = false;

    // Variables para sistemas mejorados
    let soundSystem = null;

    // === SISTEMA DE SONIDOS MEJORADOS ===
    class EnhancedSoundSystem {
        constructor() {
            this.audioContext = null;
            this.sounds = {};
            this.enabled = false;
            this.volume = 0.5;
            this.lastMove = null;
            this.prevPieceCount = null;
            this.lastMoveSignature = '';
            this.initAudioContext();
            this.setupDefaultSounds();
            this.setupMoveObserver();
        }

        initAudioContext() {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('AudioContext not supported:', e);
            }
        }

        setupDefaultSounds() {
            this.sounds = {
                move: this.generateADSR({ freq: 520, type: 'sine', a: 0.005, d: 0.05, s: 0.0, r: 0.08, gain: 0.35 }),
                capture: this.generateADSR({ freq: 300, type: 'square', a: 0.003, d: 0.08, s: 0.0, r: 0.12, gain: 0.4, lp: 1500 }),
                check: this.generateADSR({ freq: 800, type: 'triangle', a: 0.005, d: 0.18, s: 0.0, r: 0.2, gain: 0.4 }),
                checkmate: this.generateArp([440, 554, 659, 880], 0.55, 60, 0.28),
                castle: this.generateADSR({ freq: 660, type: 'sawtooth', a: 0.005, d: 0.1, s: 0.0, r: 0.12, gain: 0.35 }),
                promotion: this.generateArp([523, 659, 784], 0.45, 40, 0.25),
                gameEnd: this.generateArp([330, 277, 220], 0.8, 90, 0.22),
                // Sonidos de UI - Panel
                panelShow: this.generateUIChime([440, 554], 0.25, 80, 0.15),
                panelHide: this.generateUIChime([554, 440], 0.25, 80, 0.15),
                // Sonidos de click para botones (variados)
                buttonClick: this.generateButtonClick(),
                buttonClickLight: this.generateButtonClickLight(), // Para secciones/tabs
                buttonClickToggle: this.generateButtonClickToggle(), // Para toggles/switches
                buttonClickSpecial: this.generateButtonClickSpecial(), // Para botones especiales
                buttonClickMinimize: this.generateButtonClickMinimize(), // Para minimizar panel
                buttonClickMusic: this.generateButtonClickMusic(), // Para controles música
                buttonClickSprite: this.generateButtonClickSprite(), // Para sprites
                buttonClickSocial: this.generateButtonClickSocial(), // Para botones sociales
                buttonClickDanger: this.generateButtonClickDanger(), // Para botones peligrosos (reset, etc.)
                colorPicker: this.generateColorPickerSound() // Para selectores de color
            };
        }

        generateTone(frequency, duration, waveType = 'sine') {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = frequency;
                osc.type = waveType;
                const now = ctx.currentTime;
                gain.gain.cancelScheduledValues(now);
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.exponentialRampToValueAtTime(this.volume * 0.35, now + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
                osc.start(now);
                osc.stop(now + duration);
            };
        }

        generateADSR({ freq, type = 'sine', a = 0.005, d = 0.08, s = 0.0, r = 0.1, gain: g = 0.3, lp }) {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const amp = ctx.createGain();
                let node = amp;
                if (lp) {
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.value = lp;
                    osc.connect(filter);
                    filter.connect(amp);
                } else {
                    osc.connect(amp);
                }
                amp.connect(ctx.destination);
                osc.type = type;
                osc.frequency.value = freq;
                const now = ctx.currentTime;
                // Envelope
                amp.gain.cancelScheduledValues(now);
                amp.gain.setValueAtTime(0.0001, now);
                amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, this.volume * g), now + a);
                amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, this.volume * g * (s || 0.15)), now + a + d);
                amp.gain.exponentialRampToValueAtTime(0.0001, now + a + d + r);
                osc.start(now);
                osc.stop(now + a + d + r + 0.01);
            };
        }

        generateArp(frequencies, duration = 0.5, stepMs = 60, gain = 0.25) {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const start = ctx.currentTime;
                frequencies.forEach((f, i) => {
                    const t = start + (i * stepMs) / 1000;
                    const osc = ctx.createOscillator();
                    const amp = ctx.createGain();
                    osc.connect(amp);
                    amp.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.value = f;
                    amp.gain.setValueAtTime(0.0001, t);
                    amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, this.volume * gain), t + 0.01);
                    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
                    osc.start(t);
                    osc.stop(t + duration);
                });
            };
        }

        generateUIChime(frequencies, duration = 0.3, stepMs = 100, gain = 0.2) {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const start = ctx.currentTime;
                frequencies.forEach((f, i) => {
                    const t = start + (i * stepMs) / 1000;
                    const osc = ctx.createOscillator();
                    const amp = ctx.createGain();
                    const filter = ctx.createBiquadFilter();

                    // Configurar filtro pasa-altos suave para un sonido más limpio
                    filter.type = 'highpass';
                    filter.frequency.value = 200;
                    filter.Q.value = 0.5;

                    osc.connect(filter);
                    filter.connect(amp);
                    amp.connect(ctx.destination);

                    osc.type = 'sine';
                    osc.frequency.value = f;

                    // Envolvente suave y rápida para UI
                    amp.gain.setValueAtTime(0.0001, t);
                    amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, this.volume * gain), t + 0.02);
                    amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, this.volume * gain * 0.3), t + 0.08);
                    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);

                    osc.start(t);
                    osc.stop(t + duration + 0.01);
                });
            };
        }

        generateButtonClick() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const amp = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                // Filtro para un sonido más definido
                filter.type = 'bandpass';
                filter.frequency.value = 1200;
                filter.Q.value = 2;

                osc.connect(filter);
                filter.connect(amp);
                amp.connect(ctx.destination);

                // Sonido rápido y sutil - perfil "click"
                osc.type = 'square';
                osc.frequency.value = 1400;

                const now = ctx.currentTime;
                const duration = 0.08;
                const volume = 0.08;

                // Envolvente ultra-rápida
                amp.gain.setValueAtTime(0, now);
                amp.gain.linearRampToValueAtTime(this.volume * volume, now + 0.005);
                amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.start(now);
                osc.stop(now + duration);
            };
        }

        generateButtonClickLight() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const amp = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                // Sonido muy suave para pestañas
                filter.type = 'highpass';
                filter.frequency.value = 800;
                filter.Q.value = 0.7;

                osc.connect(filter);
                filter.connect(amp);
                amp.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.value = 2200;

                const now = ctx.currentTime;
                const duration = 0.06;
                const volume = 0.05;

                amp.gain.setValueAtTime(0, now);
                amp.gain.linearRampToValueAtTime(this.volume * volume, now + 0.003);
                amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.start(now);
                osc.stop(now + duration);
            };
        }

        generateButtonClickToggle() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const amp = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                // Sonido más grave para toggles/switches
                filter.type = 'lowpass';
                filter.frequency.value = 800;
                filter.Q.value = 1.5;

                osc.connect(filter);
                filter.connect(amp);
                amp.connect(ctx.destination);

                osc.type = 'sawtooth';
                osc.frequency.value = 400;

                const now = ctx.currentTime;
                const duration = 0.12;
                const volume = 0.1;

                amp.gain.setValueAtTime(0, now);
                amp.gain.linearRampToValueAtTime(this.volume * volume, now + 0.008);
                amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.start(now);
                osc.stop(now + duration);
            };
        }

        generateButtonClickSpecial() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const amp = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                // Sonido distintivo para botones especiales
                filter.type = 'bandpass';
                filter.frequency.value = 1800;
                filter.Q.value = 2.5;

                osc.connect(filter);
                filter.connect(amp);
                amp.connect(ctx.destination);

                osc.type = 'triangle';
                osc.frequency.value = 1600;

                const now = ctx.currentTime;
                const duration = 0.1;
                const volume = 0.09;

                amp.gain.setValueAtTime(0, now);
                amp.gain.linearRampToValueAtTime(this.volume * volume, now + 0.006);
                amp.gain.exponentialRampToValueAtTime(this.volume * volume * 0.3, now + 0.04);
                amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.start(now);
                osc.stop(now + duration);
            };
        }

        generateButtonClickMinimize() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const start = ctx.currentTime;

                // Dos tonos rápidos para simular minimizar/expandir
                [1800, 1200].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const amp = ctx.createGain();
                    const filter = ctx.createBiquadFilter();

                    filter.type = 'highpass';
                    filter.frequency.value = 600;
                    filter.Q.value = 1;

                    osc.connect(filter);
                    filter.connect(amp);
                    amp.connect(ctx.destination);

                    osc.type = 'sine';
                    osc.frequency.value = freq;

                    const t = start + (i * 0.05);
                    const duration = 0.08;
                    const volume = 0.07;

                    amp.gain.setValueAtTime(0, t);
                    amp.gain.linearRampToValueAtTime(this.volume * volume, t + 0.005);
                    amp.gain.exponentialRampToValueAtTime(0.001, t + duration);

                    osc.start(t);
                    osc.stop(t + duration);
                });
            };
        }

        generateButtonClickMusic() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const amp = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                // Sonido musical para controles de música
                filter.type = 'bandpass';
                filter.frequency.value = 1000;
                filter.Q.value = 1.8;

                osc.connect(filter);
                filter.connect(amp);
                amp.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.value = 880; // Nota A5

                const now = ctx.currentTime;
                const duration = 0.15;
                const volume = 0.08;

                amp.gain.setValueAtTime(0, now);
                amp.gain.linearRampToValueAtTime(this.volume * volume, now + 0.01);
                amp.gain.linearRampToValueAtTime(this.volume * volume * 0.6, now + 0.08);
                amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.start(now);
                osc.stop(now + duration);
            };
        }

        generateButtonClickSprite() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const start = ctx.currentTime;

                // Sonido creativo para sprites - arpeggio rápido
                const frequencies = [659, 784, 932]; // E5, G5, A#5

                frequencies.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const amp = ctx.createGain();
                    const filter = ctx.createBiquadFilter();

                    filter.type = 'highpass';
                    filter.frequency.value = 400;
                    filter.Q.value = 0.8;

                    osc.connect(filter);
                    filter.connect(amp);
                    amp.connect(ctx.destination);

                    osc.type = 'triangle';
                    osc.frequency.value = freq;

                    const t = start + (i * 0.03);
                    const duration = 0.06;
                    const volume = 0.06;

                    amp.gain.setValueAtTime(0, t);
                    amp.gain.linearRampToValueAtTime(this.volume * volume, t + 0.005);
                    amp.gain.exponentialRampToValueAtTime(0.001, t + duration);

                    osc.start(t);
                    osc.stop(t + duration);
                });
            };
        }

        generateButtonClickSocial() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const amp = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                // Sonido amigable para botones sociales
                filter.type = 'lowpass';
                filter.frequency.value = 1500;
                filter.Q.value = 1.2;

                osc.connect(filter);
                filter.connect(amp);
                amp.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.value = 523; // Nota C5

                const now = ctx.currentTime;
                const duration = 0.12;
                const volume = 0.075;

                amp.gain.setValueAtTime(0, now);
                amp.gain.linearRampToValueAtTime(this.volume * volume, now + 0.008);
                amp.gain.linearRampToValueAtTime(this.volume * volume * 0.4, now + 0.06);
                amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.start(now);
                osc.stop(now + duration);
            };
        }

        generateButtonClickDanger() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const osc = ctx.createOscillator();
                const amp = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                // Sonido de advertencia para botones peligrosos
                filter.type = 'highpass';
                filter.frequency.value = 300;
                filter.Q.value = 2;

                osc.connect(filter);
                filter.connect(amp);
                amp.connect(ctx.destination);

                osc.type = 'square';
                osc.frequency.value = 330; // Nota E4 - más grave y serio

                const now = ctx.currentTime;
                const duration = 0.18;
                const volume = 0.09;

                amp.gain.setValueAtTime(0, now);
                amp.gain.linearRampToValueAtTime(this.volume * volume, now + 0.01);
                amp.gain.linearRampToValueAtTime(this.volume * volume * 0.7, now + 0.05);
                amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.start(now);
                osc.stop(now + duration);
            };
        }

        generateColorPickerSound() {
            if (!this.audioContext) return null;
            return () => {
                const ctx = this.audioContext;
                const start = ctx.currentTime;

                // Sonido melodioso para selección de colores - acordes progresivos
                const frequencies = [523, 659, 784]; // Do5, Mi5, Sol5 (acorde mayor)

                frequencies.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const amp = ctx.createGain();
                    const filter = ctx.createBiquadFilter();

                    // Filtro suave para un sonido más cálido
                    filter.type = 'lowpass';
                    filter.frequency.value = 2000;
                    filter.Q.value = 0.8;

                    osc.connect(filter);
                    filter.connect(amp);
                    amp.connect(ctx.destination);

                    osc.type = 'sine';
                    osc.frequency.value = freq;

                    const t = start + (i * 0.04); // Ligero arpegio
                    const duration = 0.3;
                    const volume = 0.08;

                    // Envolvente suave y armoniosa
                    amp.gain.setValueAtTime(0, t);
                    amp.gain.linearRampToValueAtTime(this.volume * volume, t + 0.01);
                    amp.gain.linearRampToValueAtTime(this.volume * volume * 0.7, t + 0.15);
                    amp.gain.exponentialRampToValueAtTime(0.001, t + duration);

                    osc.start(t);
                    osc.stop(t + duration);
                });
            };
        }

        generateChord(frequencies, duration) {
            if (!this.audioContext) return null;
            return () => {
                frequencies.forEach((freq, index) => {
                    setTimeout(() => {
                        const oscillator = this.audioContext.createOscillator();
                        const gainNode = this.audioContext.createGain();
                        oscillator.connect(gainNode);
                        gainNode.connect(this.audioContext.destination);
                        oscillator.frequency.value = freq;
                        oscillator.type = 'sine';
                        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                        gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.01);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                        oscillator.start();
                        oscillator.stop(this.audioContext.currentTime + duration);
                    }, index * 50);
                });
            };
        }

        setupMoveObserver() {
            // Sistema de sonidos SIMPLIFICADO - solo responder a clicks del usuario
            console.log('🔊 Configurando sistema de sonidos simplificado...');

            // Detectar clicks en el tablero para sonidos
            const addBoardSounds = () => {
                const board = document.querySelector('cg-board, .cg-board');
                if (board && !board.hasAttribute('data-sounds-added')) {
                    board.setAttribute('data-sounds-added', 'true');

                    board.addEventListener('click', () => {
                        if (this.enabled) {
                            console.log('🔊 Click en tablero - sonido de movimiento');
                            this.playSound('move');
                        }
                    });

                    console.log('🔊 Sonidos de tablero configurados');
                }
            };

            // Configurar inmediatamente y reconfigurar si cambia la página
            addBoardSounds();
            setTimeout(addBoardSounds, 1000);
            setTimeout(addBoardSounds, 3000);
        }

        detectGameEvents() {
            // Sistema de detección DESHABILITADO para evitar bugs
            // Solo usar sonidos manuales por clicks
            return;
        }

        processMoveSound(move) {
            if (move.includes('x')) {
                this.playSound('capture');
            } else if (move === 'O-O' || move === 'O-O-O') {
                this.playSound('castle');
            } else {
                this.playSound('move');
            }
        }

        playSound(type) {
            if (!this.enabled || !this.audioContext || !this.sounds[type]) {
                console.log('🔊 Sonido no disponible:', type, {
                    enabled: this.enabled,
                    audioContext: !!this.audioContext,
                    sound: !!this.sounds[type]
                });
                return;
            }
            try {
                if (this.audioContext.state === 'suspended') {
                    console.log('🔊 Resumiendo AudioContext...');
                    this.audioContext.resume();
                }
                console.log('🔊 Reproduciendo sonido:', type);
                this.sounds[type]();
            } catch (e) {
                console.warn('Error playing sound:', e);
            }
        }

        playUISound(type) {
            // Los sonidos de UI siempre se reproducen independientemente de si los sonidos de juego están activados
            if (!this.audioContext || !this.sounds[type]) return;
            try {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                this.sounds[type]();
            } catch (e) {
                console.warn('Error playing UI sound:', e);
            }
        }

        enable() {
            this.enabled = true;
            console.log('🔊 Sonidos mejorados activados');
        }

        disable() {
            this.enabled = false;
            console.log('🔇 Sonidos mejorados desactivados');
        }

        setVolume(volume) {
            this.volume = Math.max(0, Math.min(1, volume));
        }
    }

    // === SISTEMA DE AVISOS SUPERIORES (DESHABILITADO) ===

    function showTopNotification(message, type = 'success', duration = 3000) {
        // Función de notificación deshabilitada - no hace nada
        return;
    }

    // === REPRODUCTOR DE MÚSICA ALTERNATIVO (SIN API EXTERNA) ===

    class YouTubeMusicPlayer {
        constructor() {
            this.player = null;
            this.playerReady = false;
            this.currentVideoId = '';
            this.isPlaying = false;
            this.volume = 0.5;
            this.playerContainer = null;
            this.intervalId = null;
            this.audioElement = null;
            this.useAlternativePlayer = true; // Usar reproductor alternativo
        }

        async initPlayer(url) {
            try {
                if (!url.trim()) {
                    console.error('❌ URL requerida');
                    return false;
                }

                console.log('🎵 Inicializando reproductor alternativo...');

                // Verificar si usar reproductor alternativo
                if (this.useAlternativePlayer) {
                    return this.initAlternativePlayer(url);
                } else {
                    console.warn('⚠️ Modo YouTube no disponible debido a restricciones CSP');
                    return false;
                }
            } catch (error) {
                console.error('Error inicializando reproductor:', error);
                return false;
            }
        }

        initAlternativePlayer(url) {
            console.log('🎵 Usando reproductor HTML5 alternativo');

            try {
                // Crear contenedor del reproductor
                this.createAlternativePlayerContainer();

                // Verificar si es una URL de audio directo o convertir YouTube
                const audioUrl = this.processAudioUrl(url);

                if (audioUrl) {
                    this.setupAudioElement(audioUrl);
                    this.playerReady = true;
                    console.log('✅ Reproductor alternativo listo');
                    return true;
                } else {
                    console.error('❌ No se pudo procesar la URL de audio');
                    this.showUrlHelp();
                    return false;
                }
            } catch (error) {
                console.error('Error configurando reproductor alternativo:', error);
                return false;
            }
        }

        extractVideoId(url) {
            const regexes = [
                /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
                /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
                /(?:youtu\.be\/)([^&\n?#]+)/,
                /(?:youtube\.com\/v\/)([^&\n?#]+)/,
                /(?:youtube\.com\/.*v=)([^&\n?#]+)/
            ];

            for (const regex of regexes) {
                const match = url.match(regex);
                if (match && match[1]) return match[1];
            }
            return null;
        }

        processAudioUrl(url) {
            // Verificar si es una URL de audio directo (mp3, wav, ogg, etc.)
            const audioExtensions = /\.(mp3|wav|ogg|m4a|aac|flac|wma)$/i;
            if (audioExtensions.test(url)) {
                console.log('🎵 URL de audio directo detectada');
                return url;
            }

            // Para YouTube, mostrar mensaje informativo
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                console.warn('⚠️ YouTube requiere API externa (bloqueada por CSP)');
                return null;
            }

            // Para otras URLs, intentar usar como fuente de audio
            console.log('🔍 Intentando usar como fuente de audio:', url);
            return url;
        }

        createAlternativePlayerContainer() {
            if (this.playerContainer) {
                this.playerContainer.remove();
            }

            this.playerContainer = document.createElement('div');
            this.playerContainer.id = 'redKingMusicPlayer';
            this.playerContainer.style.cssText = `
                position: fixed !important;
                bottom: 20px !important;
                left: 20px !important;
                width: 340px !important;
                height: auto !important;
                background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%) !important;
                border: 2px solid #8B0000 !important;
                border-radius: 10px !important;
                padding: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', sans-serif !important;
                z-index: 999998 !important;
                box-shadow: 0 10px 25px rgba(0,0,0,0.7) !important;
                backdrop-filter: blur(10px) !important;
            `;

            this.playerContainer.innerHTML = `
                <div style="margin-bottom: 10px; font-size: 14px; color: #FFD700; font-weight: bold;">
                    🎵 Reproductor de Música HTML5
                </div>
                <audio id="redKingAudioPlayer" style="width: 100%; margin-bottom: 10px;" controls>
                    Tu navegador no soporta el elemento de audio.
                </audio>
                <div id="musicControls" style="margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <button id="playPauseBtn" class="music-btn" title="Reproducir/Pausar">▶️</button>
                        <button id="stopBtn" class="music-btn" title="Detener">⏹️</button>
                        <button id="muteBtn" class="music-btn" title="Mutear/Desmutear">🔊</button>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 12px; margin-right: 10px;">🔊</span>
                        <input type="range" id="volumeSlider" min="0" max="100" value="50" style="flex: 1; margin-right: 10px;">
                        <span id="volumeValue" style="font-size: 12px; color: #FFD700; width: 35px;">50%</span>
                    </div>
                    <div id="audioStatus" style="font-size: 11px; color: #ccc; margin-bottom: 10px; text-align: center;">Listo para reproducir</div>
                    <div style="text-align: center;">
                        <button id="closeMusicPlayer" style="background: #ff4444; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">❌ Cerrar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.playerContainer);
            this.setupAlternativeControls();
        }

        setupAudioElement(audioUrl) {
            this.audioElement = document.getElementById('redKingAudioPlayer');
            if (!this.audioElement) {
                console.error('❌ No se encontró el elemento de audio');
                return;
            }

            this.audioElement.src = audioUrl;
            this.audioElement.volume = this.volume;
            this.audioElement.loop = true;

            // Eventos del elemento de audio
            this.audioElement.addEventListener('play', () => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.updateStatus('Reproduciendo...');
                console.log('✅ Audio reproduciéndose');
            });

            this.audioElement.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updatePlayButton();
                this.updateStatus('Pausado');
                console.log('⏸️ Audio pausado');
            });

            this.audioElement.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updatePlayButton();
                this.updateStatus('Finalizado');
            });

            this.audioElement.addEventListener('error', (e) => {
                console.error('❌ Error de audio:', e);
                this.updateStatus('Error al cargar audio');
            });

            this.audioElement.addEventListener('loadstart', () => {
                this.updateStatus('Cargando...');
            });

            this.audioElement.addEventListener('canplay', () => {
                this.updateStatus('Listo para reproducir');
                if (config.musicPlayer.autoplay) {
                    setTimeout(() => {
                        this.play();
                    }, 500);
                }
            });

            console.log('🎵 Elemento de audio configurado con URL:', audioUrl);
        }

        setupAlternativeControls() {
            const playPauseBtn = document.getElementById('playPauseBtn');
            const stopBtn = document.getElementById('stopBtn');
            const muteBtn = document.getElementById('muteBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            const closeMusicPlayer = document.getElementById('closeMusicPlayer');

            playPauseBtn?.addEventListener('click', () => this.togglePlayPauseAlt());
            stopBtn?.addEventListener('click', () => this.stopAlt());
            muteBtn?.addEventListener('click', () => this.toggleMute());

            volumeSlider?.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                this.setVolumeAlt(volume);
                document.getElementById('volumeValue').textContent = e.target.value + '%';
            });

            closeMusicPlayer?.addEventListener('click', () => this.destroy());
        }

        togglePlayPauseAlt() {
            if (!this.audioElement) {
                console.warn('⚠️ Elemento de audio no disponible');
                return;
            }

            try {
                if (this.isPlaying) {
                    this.audioElement.pause();
                } else {
                    this.play();
                }
            } catch (error) {
                console.error('Error en togglePlayPause:', error);
                this.updateStatus('Error de reproducción');
            }
        }

        play() {
            if (!this.audioElement) return;

            const playPromise = this.audioElement.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ Reproducción iniciada exitosamente');
                }).catch(error => {
                    console.warn('⚠️ Error de autoplay:', error);
                    this.updateStatus('Haz clic para reproducir');
                });
            }
        }

        stopAlt() {
            if (!this.audioElement) return;

            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.isPlaying = false;
            this.updatePlayButton();
            this.updateStatus('Detenido');
        }

        toggleMute() {
            if (!this.audioElement) return;

            this.audioElement.muted = !this.audioElement.muted;
            const muteBtn = document.getElementById('muteBtn');
            if (muteBtn) {
                muteBtn.textContent = this.audioElement.muted ? '🔇' : '🔊';
            }
        }

        setVolumeAlt(volume) {
            this.volume = Math.max(0, Math.min(1, volume));
            if (this.audioElement) {
                this.audioElement.volume = this.volume;
            }
        }

        updatePlayButton() {
            const playPauseBtn = document.getElementById('playPauseBtn');
            if (playPauseBtn) {
                playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
            }
        }

        updateStatus(message) {
            const statusElement = document.getElementById('audioStatus');
            if (statusElement) {
                statusElement.textContent = message;
            }
        }

        showUrlHelp() {
            const statusElement = document.getElementById('audioStatus');
            if (statusElement) {
                statusElement.innerHTML = `
                    <div style="color: #ffaa00; font-size: 10px; line-height: 1.3;">
                        ⚠️ YouTube bloqueado por CSP<br>
                        Usa URLs de audio directo (.mp3, .wav, .ogg)
                    </div>
                `;
            }
        }

        async loadYouTubeAPI() {
            return new Promise((resolve, reject) => {
                if (window.YT && window.YT.Player) {
                    console.log('🎵 API de YouTube ya cargada');
                    youtubeAPIReady = true;
                    resolve();
                    return;
                }

                console.log('🎵 Cargando API de YouTube...');

                // Crear callback global único
                const callbackName = 'onYouTubeIframeAPIReady_' + Date.now();
                window[callbackName] = function() {
                    console.log('🎵 API de YouTube lista');
                    youtubeAPIReady = true;
                    // Limpiar el callback
                    delete window[callbackName];
                    resolve();
                };

                // Si no hay callback global, establecer el nuestro
                if (!window.onYouTubeIframeAPIReady) {
                    window.onYouTubeIframeAPIReady = window[callbackName];
                }

                if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                    const script = document.createElement('script');
                    script.src = 'https://www.youtube.com/iframe_api';
                    script.async = true;
                    script.onload = () => console.log('📦 Script de YouTube cargado');
                    script.onerror = () => {
                        console.error('❌ Error cargando script de YouTube');
                        reject(new Error('Failed to load YouTube API'));
                    };
                    document.head.appendChild(script);
                } else {
                    // Si el script ya existe, verificar si la API está lista
                    const checkExisting = () => {
                        if (window.YT && window.YT.Player) {
                            window[callbackName]();
                        } else {
                            setTimeout(checkExisting, 100);
                        }
                    };
                    checkExisting();
                }
            });
        }

        async waitForYouTubeAPI() {
            return new Promise((resolve) => {
                if (window.YT && window.YT.Player) {
                    resolve();
                    return;
                }

                const checkAPI = () => {
                    if (window.YT && window.YT.Player) {
                        resolve();
                    } else {
                        setTimeout(checkAPI, 100);
                    }
                };
                checkAPI();
            });
        }

        createPlayerContainer() {
            if (this.playerContainer) {
                this.playerContainer.remove();
            }

            this.playerContainer = document.createElement('div');
            this.playerContainer.id = 'redKingMusicPlayer';
            this.playerContainer.style.cssText = `
                position: fixed !important;
                bottom: 20px !important;
                left: 20px !important;
                width: 320px !important;
                height: auto !important;
                background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%) !important;
                border: 2px solid #8B0000 !important;
                border-radius: 10px !important;
                padding: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', sans-serif !important;
                z-index: 999998 !important;
                box-shadow: 0 10px 25px rgba(0,0,0,0.7) !important;
                backdrop-filter: blur(10px) !important;
            `;

            this.playerContainer.innerHTML = `
                <div style="margin-bottom: 10px; font-size: 14px; color: #FFD700; font-weight: bold;">
                    🎵 Reproductor de Música YouTube
                </div>
                <div id="redKingYouTubePlayer"></div>
                <div id="musicControls" style="margin-top: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <button id="playPauseBtn" class="music-btn" title="Reproducir/Pausar">▶️</button>
                        <button id="prevBtn" class="music-btn" title="Retroceder 10s">⏮️</button>
                        <button id="nextBtn" class="music-btn" title="Adelantar 10s">⏭️</button>
                        <button id="stopBtn" class="music-btn" title="Detener">⏹️</button>
                        <button id="reloadBtn" class="music-btn" title="Recargar video" style="background: #FF8C00 !important;">🔄</button>
                    </div>
                    <div style="text-align: center; margin-bottom: 10px;">
                        <button id="debugBtn" class="music-btn" title="Debug info" style="background: #9C27B0 !important; font-size: 11px;">🔍 Debug</button>
                        <button id="forcePlayBtn" class="music-btn" title="Forzar reproducción" style="background: #4CAF50 !important; font-size: 11px;">🚀 Forzar</button>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 12px; margin-right: 10px;">🔊</span>
                        <input type="range" id="volumeSlider" min="0" max="100" value="50" style="flex: 1; margin-right: 10px;">
                        <span id="volumeValue" style="font-size: 12px; color: #FFD700; width: 35px;">50%</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 12px; margin-right: 10px;">⏳</span>
                        <input type="range" id="progressSlider" min="0" max="100" value="0" style="flex: 1; margin-right: 10px;">
                        <span id="timeDisplay" style="font-size: 12px; color: #ccc; width: 80px;">0:00 / 0:00</span>
                    </div>
                    <div style="text-align: center;">
                        <button id="closeMusicPlayer" style="background: #ff4444; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">❌ Cerrar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.playerContainer);
            this.setupMusicControls();
        }

        setupMusicControls() {
            const playPauseBtn = document.getElementById('playPauseBtn');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const stopBtn = document.getElementById('stopBtn');
            const reloadBtn = document.getElementById('reloadBtn');
            const debugBtn = document.getElementById('debugBtn');
            const forcePlayBtn = document.getElementById('forcePlayBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            const progressSlider = document.getElementById('progressSlider');
            const closeMusicPlayer = document.getElementById('closeMusicPlayer');

            playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
            prevBtn?.addEventListener('click', () => this.seekRelative(-10));
            nextBtn?.addEventListener('click', () => this.seekRelative(10));
            stopBtn?.addEventListener('click', () => this.stop());
            reloadBtn?.addEventListener('click', () => this.forceReload());
            debugBtn?.addEventListener('click', () => this.debugPlayerState());
            forcePlayBtn?.addEventListener('click', () => this.forcePlay());

            volumeSlider?.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                this.setVolume(volume);
                document.getElementById('volumeValue').textContent = e.target.value + '%';
            });

            progressSlider?.addEventListener('change', (e) => {
                if (this.player && this.playerReady) {
                    const duration = this.player.getDuration();
                    const newTime = (e.target.value / 100) * duration;
                    this.player.seekTo(newTime, true);
                }
            });

            closeMusicPlayer?.addEventListener('click', () => this.destroy());

            // Actualizar progreso cada segundo
            this.startProgressUpdate();
        }

        startProgressUpdate() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            this.intervalId = setInterval(() => this.updateProgress(), 1000);
        }

        // Esta función ya no se usa porque se maneja en el evento onReady del constructor
        onPlayerReady(event) {
            // Función mantenida por compatibilidad
        }

        onPlayerStateChange(event) {
            const playPauseBtn = document.getElementById('playPauseBtn');
            const stateNames = {
                [-1]: 'UNSTARTED',
                [0]: 'ENDED',
                [1]: 'PLAYING',
                [2]: 'PAUSED',
                [3]: 'BUFFERING',
                [5]: 'CUED'
            };

            const stateName = stateNames[event.data] || 'UNKNOWN';
            console.log('🎵 Cambio de estado del reproductor:', stateName, '(', event.data, ')');

            if (event.data === YT.PlayerState.PLAYING) {
                this.isPlaying = true;
                if (playPauseBtn) playPauseBtn.textContent = '⏸️';
                console.log('✅ ¡REPRODUCIENDO! Audio debería escucharse ahora.');
            } else if (event.data === YT.PlayerState.PAUSED) {
                this.isPlaying = false;
                if (playPauseBtn) playPauseBtn.textContent = '▶️';
                console.log('⏸️ Reproductor pausado');
            } else if (event.data === YT.PlayerState.ENDED) {
                this.isPlaying = false;
                if (playPauseBtn) playPauseBtn.textContent = '▶️';
                console.log('🔚 Reproducción terminada');
            } else if (event.data === YT.PlayerState.BUFFERING) {
                console.log('⏳ Cargando buffer...');
            } else if (event.data === YT.PlayerState.CUED) {
                console.log('📋 Video listo para reproducir');
                // Si el video está listo y debe auto-reproducirse
                if (config.musicPlayer.autoplay && !this.isPlaying) {
                    setTimeout(() => {
                        console.log('🎵 Iniciando reproducción desde estado CUED...');
                        this.player.playVideo();
                    }, 500);
                }
            }
        }

        handlePlayerError(errorCode) {
            const errorMessages = {
                2: 'ID de video inválido',
                5: 'Error HTML5',
                100: 'Video no encontrado o privado',
                101: 'Video no disponible en modo embebido',
                150: 'Video no disponible en modo embebido'
            };

            const message = errorMessages[errorCode] || `Error desconocido: ${errorCode}`;
            console.error('❌ Error del reproductor YouTube:', message);

            // Intentar solución automática para algunos errores
            if (errorCode === 5) {
                console.log('🔄 Error HTML5 detectado, reintentando...');
                setTimeout(() => {
                    this.forceReload();
                }, 2000);
            }
        }

        togglePlayPause() {
            if (!this.player || !this.playerReady) {
                console.warn('⚠️ Reproductor no está listo');
                this.debugPlayerState();
                return;
            }

            try {
                const playerState = this.player.getPlayerState();
                console.log('📊 Estado actual del reproductor:', playerState);

                if (this.isPlaying) {
                    console.log('⏸️ Pausando reproductor');
                    this.player.pauseVideo();
                } else {
                    console.log('▶️ Reproduciendo video - ACTIVANDO AUDIO');

                    // CRÍTICO: Manejar audio antes de reproducir
                    this.ensureAudioEnabled();

                    // Reproducir con reintento
                    this.playWithRetry();
                }
            } catch (error) {
                console.error('Error en togglePlayPause:', error);
                this.debugPlayerState();
            }
        }

        ensureAudioEnabled() {
            try {
                // Múltiples verificaciones de audio
                if (this.player.isMuted && this.player.isMuted()) {
                    console.log('🔊 Desmutando reproductor...');
                    this.player.unMute();
                }

                // Configurar volumen explícitamente
                this.player.setVolume(Math.max(1, this.volume * 100));
                console.log('🔊 Volumen establecido a:', this.player.getVolume());

                // Verificación de estado de mute
                setTimeout(() => {
                    if (this.player.isMuted && this.player.isMuted()) {
                        console.warn('⚠️ Reproductor sigue muted, forzando unmute...');
                        this.player.unMute();
                        this.player.setVolume(Math.max(5, this.volume * 100));
                    }
                }, 100);
            } catch (error) {
                console.error('Error configurando audio:', error);
            }
        }

        playWithRetry() {
            console.log('🎵 Iniciando reproducción con reintentos...');

            const attempt = (retryCount = 0) => {
                if (retryCount >= 5) {
                    console.error('❌ Falló después de 5 intentos');
                    this.debugPlayerState();
                    return;
                }

                console.log(`🎵 Intento ${retryCount + 1}/5 de reproducción`);

                // Asegurar audio en cada intento
                this.ensureAudioEnabled();

                // Intentar reproducir
                this.player.playVideo();

                // Verificar después de un momento
                setTimeout(() => {
                    if (!this.isPlaying && this.player.getPlayerState() !== 1) {
                        console.warn(`⚠️ Intento ${retryCount + 1} falló, reintentando...`);
                        attempt(retryCount + 1);
                    } else if (this.isPlaying) {
                        console.log('✅ Reproducción exitosa!');
                        // Verificar que el audio esté activo
                        this.verifyAudioPlaying();
                    }
                }, 800);
            };

            attempt();
        }

        verifyAudioPlaying() {
            setTimeout(() => {
                const volume = this.player.getVolume();
                const isMuted = this.player.isMuted ? this.player.isMuted() : false;

                console.log('🔍 Verificación de audio:');
                console.log('  - Volumen:', volume);
                console.log('  - ¿Muted?:', isMuted);
                console.log('  - Estado:', this.player.getPlayerState());

                if (isMuted || volume < 1) {
                    console.warn('⚠️ Audio podría estar deshabilitado, corrigiendo...');
                    this.ensureAudioEnabled();
                }
            }, 2000);
        }

        seekRelative(seconds) {
            if (!this.player || !this.playerReady) return;

            const currentTime = this.player.getCurrentTime();
            const newTime = Math.max(0, currentTime + seconds);
            this.player.seekTo(newTime, true);
        }

        setVolume(volume) {
            this.volume = Math.max(0, Math.min(1, volume));
            if (this.player && this.playerReady) {
                this.player.setVolume(this.volume * 100);
            }
        }

        stop() {
            if (this.player && this.playerReady) {
                this.player.stopVideo();
            }
        }

        updateProgress() {
            if (!this.player || !this.playerReady || !document.getElementById('progressSlider')) return;

            try {
                const currentTime = this.player.getCurrentTime();
                const duration = this.player.getDuration();

                if (duration > 0) {
                    const progress = (currentTime / duration) * 100;
                    document.getElementById('progressSlider').value = progress;

                    const timeDisplay = document.getElementById('timeDisplay');
                    if (timeDisplay) {
                        timeDisplay.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
                    }
                }
            } catch (error) {
                // Silenciar errores de actualización
            }
        }

        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }

        // Función para recargar forzadamente el reproductor
        forceReload() {
            console.log('🔄 Recargando reproductor forzadamente...');

            if (this.player && this.playerReady) {
                try {
                    // Intentar recargar el video actual
                    this.player.stopVideo();
                    setTimeout(() => {
                        this.player.loadVideoById(this.currentVideoId);
                        setTimeout(() => {
                            console.log('🎵 Iniciando reproducción después de recargar...');
                            this.player.playVideo();
                        }, 2000);
                    }, 500);
                } catch (error) {
                    console.error('Error recargando:', error);
                    this.debugPlayerState();
                }
            }
        }

        // Función de debug del estado del reproductor
        debugPlayerState() {
            console.log('🔍 === DEBUG DEL REPRODUCTOR ===');
            console.log('Player existe:', !!this.player);
            console.log('Player ready:', this.playerReady);
            console.log('Is playing:', this.isPlaying);
            console.log('Current video ID:', this.currentVideoId);
            console.log('Volume:', this.volume);

            if (this.player) {
                try {
                    console.log('Player state:', this.player.getPlayerState());
                    console.log('Current time:', this.player.getCurrentTime());
                    console.log('Duration:', this.player.getDuration());
                    console.log('Volume (player):', this.player.getVolume());
                    console.log('Video URL:', this.player.getVideoUrl());
                } catch (e) {
                    console.error('Error obteniendo info del player:', e);
                }
            }
            console.log('=================================');
        }

        // Función para forzar reproducción con múltiples intentos
        forcePlay() {
            console.log('🚀 FORZANDO REPRODUCCIÓN - Modo agresivo activado');

            if (!this.player || !this.playerReady) {
                console.error('❌ No se puede forzar: reproductor no listo');
                this.debugPlayerState();
                return;
            }

            try {
                // Múltiples intentos inmediatos
                console.log('🎵 Intento 1/5...');
                this.player.playVideo();

                setTimeout(() => {
                    console.log('🎵 Intento 2/5...');
                    this.player.playVideo();
                }, 200);

                setTimeout(() => {
                    console.log('🎵 Intento 3/5...');
                    this.player.playVideo();
                }, 500);

                setTimeout(() => {
                    console.log('🎵 Intento 4/5...');
                    this.player.playVideo();
                }, 1000);

                setTimeout(() => {
                    console.log('🎵 Intento 5/5 (final)...');
                    this.player.playVideo();

                    // Verificación final
                    setTimeout(() => {
                        if (this.isPlaying) {
                            console.log('✅ ¡ÉXITO! El reproductor está funcionando');
                        } else {
                            console.error('❌ FALLÓ: El reproductor no responde');
                            console.log('🔍 Ejecutando debug completo...');
                            this.debugPlayerState();
                        }
                    }, 1000);
                }, 1500);

            } catch (error) {
                console.error('Error en forcePlay:', error);
                this.debugPlayerState();
            }
        }

        destroy() {
            console.log('🗑️ Destruyendo reproductor...');

            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }

            if (this.player) {
                try {
                    this.player.destroy();
                } catch (error) {
                    console.warn('Error destroying player:', error);
                }
                this.player = null;
            }

            if (this.playerContainer) {
                this.playerContainer.remove();
                this.playerContainer = null;
            }

            this.playerReady = false;
            this.isPlaying = false;
        }
    }

    // === SISTEMA DE SPRITES PERSONALIZADOS CORREGIDO ===

    class CustomSpritesManager {
        constructor() {
            this.customStyleSheet = null;
            this.applied = false;
        }

        initCustomSprites() {
            console.log('🎨 Inicializando sprites personalizados...');

            if (!this.customStyleSheet) {
                this.customStyleSheet = document.createElement('style');
                this.customStyleSheet.id = 'redKingCustomSprites';
                document.head.appendChild(this.customStyleSheet);
            }

            this.applyCustomSprites();
            this.applied = true;
        }

        applyCustomSprites() {
            if (!config.customSprites.enabled) {
                this.removeCustomSprites();
                return;
            }

            console.log('🎨 Aplicando sprites personalizados...');
            let cssRules = '';

            // Selectores CSS más específicos y compatibles con Lichess
            const pieceSelectors = {
                'white-king': 'piece.white.king, .cg-board piece[data-color="white"][data-role="king"]',
                'white-queen': 'piece.white.queen, .cg-board piece[data-color="white"][data-role="queen"]',
                'white-rook': 'piece.white.rook, .cg-board piece[data-color="white"][data-role="rook"]',
                'white-bishop': 'piece.white.bishop, .cg-board piece[data-color="white"][data-role="bishop"]',
                'white-knight': 'piece.white.knight, .cg-board piece[data-color="white"][data-role="knight"]',
                'white-pawn': 'piece.white.pawn, .cg-board piece[data-color="white"][data-role="pawn"]',
                'black-king': 'piece.black.king, .cg-board piece[data-color="black"][data-role="king"]',
                'black-queen': 'piece.black.queen, .cg-board piece[data-color="black"][data-role="queen"]',
                'black-rook': 'piece.black.rook, .cg-board piece[data-color="black"][data-role="rook"]',
                'black-bishop': 'piece.black.bishop, .cg-board piece[data-color="black"][data-role="bishop"]',
                'black-knight': 'piece.black.knight, .cg-board piece[data-color="black"][data-role="knight"]',
                'black-pawn': 'piece.black.pawn, .cg-board piece[data-color="black"][data-role="pawn"]'
            };

            let hasCustomSprites = false;

            for (const [piece, selector] of Object.entries(pieceSelectors)) {
                const customSprite = config.customSprites.pieces[piece];
                if (customSprite && customSprite.trim()) {
                    cssRules += `
                        ${selector} {
                            background-image: url('${customSprite}') !important;
                            background-size: cover !important;
                            background-repeat: no-repeat !important;
                            background-position: center !important;
                        }
                    `;
                    hasCustomSprites = true;
                    console.log('🎨 Sprite aplicado para:', piece);
                }
            }

            if (this.customStyleSheet) {
                this.customStyleSheet.textContent = cssRules;
                console.log('🎨 CSS de sprites actualizado:', hasCustomSprites ? 'Con sprites' : 'Sin sprites');
            }

            if (hasCustomSprites) {
            }
        }

        removeCustomSprites() {
            console.log('🎨 Removiendo sprites personalizados...');
            if (this.customStyleSheet) {
                this.customStyleSheet.textContent = '';
            }
        }

        uploadSprite(pieceType) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                console.log('🎨 Subiendo sprite para:', pieceType);

                if (!file.type.startsWith('image/')) {
                    return;
                }

                // Verificar tamaño del archivo (máximo 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target.result;
                    config.customSprites.pieces[pieceType] = dataUrl;
                    GM_setValue('redKingConfig242', config);

                    console.log('🎨 Sprite guardado para:', pieceType);

                    // Actualizar vista previa
                    const preview = document.getElementById(`preview_${pieceType.replace('-', '_')}`);
                    if (preview) {
                        preview.src = dataUrl;
                        preview.style.display = 'block';
                    }

                    // Aplicar sprites inmediatamente
                    this.applyCustomSprites();
                };

                reader.onerror = () => {
                };

                reader.readAsDataURL(file);
            });

            input.click();
        }

        resetSprite(pieceType) {
        config.customSprites.pieces[pieceType] = '';
        GM_setValue('redKingConfig242', config);

            const preview = document.getElementById(`preview_${pieceType.replace('-', '_')}`);
            if (preview) {
                preview.style.display = 'none';
                preview.src = '';
            }

            this.applyCustomSprites();
        }
    }

    // Instancias globales
    const spritesManager = new CustomSpritesManager();

    // === FUNCIÓN DE VOLTEAR TABLERO SÚPER MEJORADA ===

    function flipBoardAction() {
        console.log('🔄 Iniciando función de voltear tablero...');

        try {
            let success = false;

            // MÉTODO 1: Detectar botón de flip de Lichess
            const flipButtons = [
                '.game .game__buttons .fbt',
                '.analyse__tools .fbt',
                'button.fbt',
                '.flip',
                'button[title*="flip"]',
                'button[title*="Flip"]',
                '.game__menu button[data-icon="B"]',
                '.lpv__fbt'
            ];

            console.log('🔍 Buscando botones de flip...');
            for (const selector of flipButtons) {
                const button = document.querySelector(selector);
                if (button && button.offsetParent !== null) {
                    console.log('✅ Encontrado botón flip:', selector);
                    button.click();
                    success = true;
                    break;
                }
            }

            // MÉTODO 2: Si no encontró botón, usar eventos de teclado
            if (!success) {
                console.log('🎹 Intentando con eventos de teclado...');

                // Enfocar el tablero primero
                const boardElement = document.querySelector('.cg-wrap, .game, .analyse');
                if (boardElement) {
                    boardElement.focus();
                }

                // Crear y disparar evento keydown más completo
                const keyEvent = new KeyboardEvent('keydown', {
                    key: 'f',
                    code: 'KeyF',
                    keyCode: 70,
                    which: 70,
                    charCode: 0,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    view: window,
                    detail: 0
                });

                // Disparar en múltiples elementos
                const targets = [
                    document,
                    document.body,
                    document.querySelector('.cg-wrap'),
                    document.querySelector('.main-wrap'),
                    document.querySelector('.game'),
                    document.querySelector('.analyse')
                ].filter(el => el);

                targets.forEach(target => {
                    try {
                        target.dispatchEvent(keyEvent);
                    } catch (e) {
                        console.warn('Error dispatching to:', target, e);
                    }
                });

                // También keyup
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: 'f',
                    code: 'KeyF',
                    keyCode: 70,
                    which: 70,
                    bubbles: true,
                    cancelable: true
                });

                targets.forEach(target => {
                    try {
                        target.dispatchEvent(keyUpEvent);
                    } catch (e) {
                        console.warn('Error dispatching keyup to:', target, e);
                    }
                });

                success = true;
            }

            // MÉTODO 3: Como último recurso, CSS flip
            if (!success) {
                console.log('🎨 Intentando flip CSS...');
                const board = document.querySelector('.cg-board, .cg-wrap');

                if (board) {
                    const currentTransform = board.style.transform || '';

                    if (currentTransform.includes('rotate(180deg)')) {
                        board.style.transform = currentTransform.replace('rotate(180deg)', '').trim();
                    } else {
                        board.style.transform = (currentTransform + ' rotate(180deg)').trim();
                    }
                    success = true;
                }
            }

            if (!success) {
                console.warn('⚠️ No se pudo voltear el tablero');
            }

        } catch (error) {
            console.error('❌ Error crítico al voltear tablero:', error);
        }
    }

    // Crear panel principal mejorado
    function createPanel() {
        console.log('Creando panel Red King v2.4.2...');

        if (document.getElementById('redKingPanel')) {
            document.getElementById('redKingPanel').remove();
        }

        const panel = document.createElement('div');
        panel.id = 'redKingPanel';
        panel.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 380px !important;
            max-height: 700px !important;
            background: linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            border: 2px solid #8B0000 !important;
            border-radius: 15px !important;
            padding: 0 !important;
            color: white !important;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif !important;
            box-shadow: 0 15px 35px rgba(0,0,0,0.9), 0 0 20px rgba(139,0,0,0.3) !important;
            z-index: 999999 !important;
            overflow: hidden !important;
            backdrop-filter: blur(10px) !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        `;

        panel.innerHTML = createPanelHTML();
        document.body.appendChild(panel);

        // Animación de entrada al crear el panel
        panel.style.transform = 'scale(0.8)';
        panel.style.opacity = '0';

        requestAnimationFrame(() => {
            panel.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
            panel.style.transform = 'scale(1)';
            panel.style.opacity = '1';
        });

        setupPanelEvents();
        makePanelDraggable(panel);

        return panel;
    }

    // HTML del panel con nuevas opciones
    function createPanelHTML() {
        return `
            <div id="panelHeader" style="
                background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
                padding: 15px;
                text-align: center;
                font-size: 18px;
                color: #FFD700;
                cursor: move;
                user-select: none;
                border-radius: 15px 15px 0 0;
                position: relative;
            ">
                <span style="font-weight: bold;">♔ Red King v2.4.2</span>
                <div style="position: absolute; top: 50%; right: 15px; transform: translateY(-50%); cursor: pointer; font-size: 16px;" id="minimizeBtn">−</div>
            </div>

            <div id="panelContent" style="padding: 0;">
                <div id="tabNavigation" style="
                    display: flex;
                    background: #2a2a2a;
                    border-bottom: 1px solid #444;
                ">
                    <div class="tab-btn active" data-tab="general">⚙️ General</div>
                    <div class="tab-btn" data-tab="board">🏁 Tablero</div>
                    <div class="tab-btn" data-tab="music">🎵 Música</div>
                    <div class="tab-btn" data-tab="sprites">🎨 Sprites</div>
                    <div class="tab-btn" data-tab="theme">🌈 Tema</div>
                </div>

                <div id="tabContent" style="padding: 20px; max-height: 480px; overflow-y: auto;">
                    ${createTabContent()}
                </div>
            </div>

            <div style="
                background: #2a2a2a;
                padding: 12px;
                text-align: center;
                font-size: 11px;
                color: #888;
                border-radius: 0 0 15px 15px;
                border-top: 1px solid #444;
            ">
                <div style="margin-bottom: 8px;">
                    <button id="restoreNormal" style="
                        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                        border: none;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: 500;
                        margin-bottom: 8px;
                    ">🔄 Restaurar Normalidad</button>
                </div>
                <div style="margin-bottom: 5px;">
                    <span id="closePanel" style="cursor: pointer; color: #DC143C; margin-right: 15px;">❌ Cerrar</span>
                    <span id="resetConfig" style="cursor: pointer; color: #FFD700;">🔄 Reset Config</span>
                </div>
                <div>v2.4.2 - Hecho por Gi4nx con ❤️</div>
            </div>
        `;
    }

    // Contenido de pestañas mejorado
    function createTabContent() {
        return `
            <!-- Pestaña General -->
            <div id="tab-general" class="tab-content" style="display: block;">
                <div class="option-group">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">🎮 Opciones Básicas</h4>
                    ${createToggleOption('soundEnabled', 'Sonidos mejorados', '🔊')}
                    ${createToggleOption('boardEffects', 'Efectos de tablero', '💫')}
                </div>

                <div class="option-group" style="margin-top: 20px;">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">✨ Mejoras Visuales</h4>
                    ${createToggleOption('enhancedAnimations', 'Movimiento más fluido', '🎭')}
                </div>


                <div class="option-group" style="margin-top: 20px;">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">⚡ Acciones Rápidas</h4>
                    <div style="display: grid; gap: 8px;">
                        <button id="flipBoard" class="action-btn">🔄 Girar Tablero</button>
                        <button id="quickAnalysis" class="action-btn">📊 Análisis Rápido</button>
                        <button id="exportPGN" class="action-btn">📄 Exportar PGN</button>
                    </div>
                </div>

                <div class="option-group" style="margin-top: 15px;">
                    <h4 style="color: #FFD700; margin: 0 0 10px 0; font-size: 12px;">⌨️ Atajos</h4>
                    <div style="font-size: 11px; color: #ccc; line-height: 1.4;">
                        <kbd>F</kbd> Girar • <kbd>A</kbd> Análisis • <kbd>P</kbd> Panel • <kbd>C</kbd> Chat
                    </div>
                </div>
            </div>

            <!-- Pestaña Tablero -->
            <div id="tab-board" class="tab-content" style="display: none;">
                <div class="option-group">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">🏁 Controles de Tablero</h4>

                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 6px; border: 1px solid #FFD700;">
                        <div style="font-size: 12px; color: #FFD700; margin-bottom: 8px;">📐 Estado del Tablero:</div>
                        <div id="boardStatus" style="font-size: 11px; color: #ccc;">Normal (no movible)</div>
                    </div>

                    <div style="display: grid; gap: 8px;">
                        <button id="toggleBoardMove" class="action-btn">📐 Activar/Desactivar Mover</button>
                        <button id="resetBoardPosition" class="action-btn">🎯 Restaurar Posición</button>
                        <button id="toggleChat" class="action-btn">💬 Toggle Chat</button>
                    </div>
                </div>

                <div class="option-group" style="margin-top: 20px;">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">🎨 Colores de Texto</h4>
                    ${createColorPicker('customColors.text', '📄 Texto General')}
                    ${createColorPicker('customColors.chatText', '💬 Texto Chat')}
                </div>

                <div class="option-group" style="margin-top: 15px;">
                    <button id="applyBoardTheme" class="action-btn">✨ Aplicar Cambios</button>
                </div>
            </div>

            <!-- Pestaña Música -->
            <div id="tab-music" class="tab-content" style="display: none;">
                <div class="option-group">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">🎵 Reproductor de Música</h4>

                    ${createToggleOption('musicPlayer.enabled', 'Activar reproductor', '🎵')}

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #FFD700;">🔗 URL de Audio:</label>
                        <input type="text" id="youtubeUrl" value="${config.musicPlayer.youtubeUrl}" placeholder="https://ejemplo.com/musica.mp3" style="
                            width: 100%;
                            padding: 8px;
                            border: 1px solid #FFD700;
                            border-radius: 4px;
                            background: #333;
                            color: white;
                            font-size: 12px;
                        ">
                    </div>

                    <div style="margin: 15px 0;">
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #FFD700;">🔊 Volumen:</label>
                        <input type="range" id="musicVolume" min="0" max="100" value="${Math.round(config.musicPlayer.volume * 100)}" style="width: 100%;">
                        <div style="text-align: center; font-size: 11px; color: #ccc; margin-top: 5px;" id="volumeDisplay">${Math.round(config.musicPlayer.volume * 100)}%</div>
                    </div>

                    ${createToggleOption('musicPlayer.autoplay', 'Reproducir automáticamente', '▶️')}

                    <div style="margin-top: 15px; display: grid; gap: 8px;">
                        <button id="startMusicPlayer" class="action-btn">🎵 Iniciar Reproductor</button>
                        <button id="stopMusicPlayer" class="action-btn">⏹️ Detener Reproductor</button>
                    </div>
                </div>

                <div class="option-group" style="margin-top: 20px;">
                    <h4 style="color: #FFD700; margin: 0 0 10px 0; font-size: 14px;">ℹ️ Instrucciones</h4>
                    <div style="font-size: 11px; color: #ccc; line-height: 1.4;">
                        1. Pega el enlace de audio directo (.mp3, .wav, .ogg)<br>
                        2. Ajusta el volumen deseado<br>
                        3. Activa el reproductor y presiona "Iniciar"<br>
                        4. Usa los controles para pausar, detener, etc.
                    </div>
                </div>
            </div>

            <!-- Pestaña Sprites -->
            <div id="tab-sprites" class="tab-content" style="display: none;">
                <div class="option-group">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">🎨 Sprites Personalizados</h4>

                    ${createToggleOption('customSprites.enabled', 'Activar sprites personalizados', '🎨')}

                    <div style="margin-top: 15px;">
                        <h5 style="color: #FFD700; margin: 0 0 10px 0; font-size: 13px;">⚪ Piezas Blancas</h5>
                        ${createSpriteUploader('white-king', '♔ Rey')}
                        ${createSpriteUploader('white-queen', '♕ Reina')}
                        ${createSpriteUploader('white-rook', '♖ Torre')}
                        ${createSpriteUploader('white-bishop', '♗ Alfil')}
                        ${createSpriteUploader('white-knight', '♘ Caballo')}
                        ${createSpriteUploader('white-pawn', '♙ Peón')}
                    </div>

                    <div style="margin-top: 15px;">
                        <h5 style="color: #FFD700; margin: 0 0 10px 0; font-size: 13px;">⚫ Piezas Negras</h5>
                        ${createSpriteUploader('black-king', '♚ Rey')}
                        ${createSpriteUploader('black-queen', '♛ Reina')}
                        ${createSpriteUploader('black-rook', '♜ Torre')}
                        ${createSpriteUploader('black-bishop', '♝ Alfil')}
                        ${createSpriteUploader('black-knight', '♞ Caballo')}
                        ${createSpriteUploader('black-pawn', '♟ Peón')}
                    </div>

                    <div style="margin-top: 15px; text-align: center;">
                        <button id="resetAllSprites" class="action-btn">🔄 Restablecer Todos</button>
                    </div>
                </div>

                <div class="option-group" style="margin-top: 20px;">
                    <h4 style="color: #FFD700; margin: 0 0 10px 0; font-size: 14px;">ℹ️ Instrucciones</h4>
                    <div style="font-size: 11px; color: #ccc; line-height: 1.4;">
                        • Sube archivos PNG, JPG o GIF<br>
                        • Recomendado: imágenes cuadradas<br>
                        • Los cambios se aplican al instante<br>
                        • Ejemplo: Rey = Patata frita 🍟
                    </div>
                </div>
            </div>

            <!-- Pestaña Tema -->
            <div id="tab-theme" class="tab-content" style="display: none;">
                <div class="option-group">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">🎨 Personalización</h4>
                    ${createToggleOption('buttonColors.enabled', 'Botones rojos', '🎯')}
                </div>

                <div class="option-group" style="margin-top: 20px;">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">🌈 Colores de Botones</h4>
                    ${createColorPicker('buttonColors.buttonPrimary', '🔴 Primario')}
                    ${createColorPicker('buttonColors.buttonSecondary', '🟥 Secundario')}
                    ${createColorPicker('buttonColors.hoverPrimary', '🔺 Hover 1')}
                    ${createColorPicker('buttonColors.hoverSecondary', '🔻 Hover 2')}
                </div>

                <div style="margin-top: 15px;">
                    <button id="applyTheme" class="action-btn">✨ Aplicar Tema</button>
                    <button id="exportConfig" class="action-btn" style="margin-top: 8px;">💾 Exportar Config</button>
                </div>

                <div class="option-group" style="margin-top: 15px;">
                    <h4 style="color: #FFD700; margin: 0 0 15px 0; font-size: 14px;">🌐 Social</h4>
                    <div style="display: grid; gap: 8px;">
                        <button id="joinDiscord" class="social-btn discord-btn">💬 Discord</button>
                        <button id="visitGitHub" class="social-btn github-btn">🐱 GitHub</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Crear uploader de sprites
    function createSpriteUploader(pieceType, pieceName) {
        const currentSprite = config.customSprites.pieces[pieceType];
        const previewId = `preview_${pieceType.replace('-', '_')}`;

        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <span style="font-size: 12px; flex: 1;">${pieceName}:</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img id="${previewId}" src="${currentSprite}" style="width: 24px; height: 24px; display: ${currentSprite ? 'block' : 'none'}; border: 1px solid #FFD700; border-radius: 2px;">
                    <button class="sprite-upload-btn" data-piece="${pieceType}" style="background: #4CAF50; border: none; color: white; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">📁</button>
                    <button class="sprite-reset-btn" data-piece="${pieceType}" style="background: #f44336; border: none; color: white; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">🗑️</button>
                </div>
            </div>
        `;
    }

    // Crear opción toggle
    function createToggleOption(configPath, label, icon) {
        const value = getNestedConfig(configPath);
        const id = configPath.replace(/\./g, '_');

        return `
            <div style="margin: 12px 0; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px;">
                    <span style="margin-right: 8px;">${icon}</span>${label}
                </span>
                <label class="toggle-switch">
                    <input type="checkbox" id="${id}" ${value ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
    }

    // Crear selector de color
    function createColorPicker(configPath, label) {
        const value = getNestedConfig(configPath);
        const id = configPath.replace(/\./g, '_');

        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; font-size: 12px;">
                <span style="flex: 1;">${label}:</span>
                <input type="color" id="${id}" value="${value}" style="
                    width: 40px;
                    height: 30px;
                    border-radius: 6px;
                    border: 2px solid #FFD700;
                    cursor: pointer;
                    background: none;
                    margin-left: 10px;
                ">
            </div>
        `;
    }

    // Funciones de utilidad
    function getNestedConfig(path) {
        return path.split('.').reduce((obj, key) => obj && obj[key], config);
    }

    function setNestedConfig(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], config);
        target[lastKey] = value;
    }

    // === FUNCIONES DE TABLERO (mantenidas del código original que funciona) ===

    // Toggle movimiento de tablero - MANTENER COMO ESTÁ
    function toggleBoardMoveable() {
        console.log('🔧 Toggle board moveable iniciado, boardMoved:', boardMoved);

        const boardSelectors = [
            '.cg-wrap',
            '.board-wrap',
            'main.game .cg-wrap',
            '.game .cg-wrap',
            '.analyse .cg-wrap',
            '.lpv .cg-wrap'
        ];

        let board = null;
        for (const selector of boardSelectors) {
            board = document.querySelector(selector);
            if (board) {
                console.log('✅ Tablero encontrado con selector:', selector);
                break;
            }
        }

        if (!board) {
            console.error('❌ No se encontró ningún tablero con los selectores disponibles');
            return;
        }

        if (!boardMoved) {
            console.log('🔧 Activando modo arrastrable...');

            // Guardar posición original usando getBoundingClientRect() para mayor precisión
            const rect = board.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(board);

            originalBoardPosition = {
                // Estilos directos del elemento
                position: board.style.position,
                left: board.style.left,
                top: board.style.top,
                right: board.style.right,
                bottom: board.style.bottom,
                transform: board.style.transform,
                zIndex: board.style.zIndex,
                cursor: board.style.cursor,

                // Posición computada como respaldo
                computedPosition: computedStyle.position,
                computedLeft: computedStyle.left,
                computedTop: computedStyle.top,
                computedRight: computedStyle.right,
                computedBottom: computedStyle.bottom,

                // Posición absoluta en viewport
                rect: {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                }
            };

            console.log('💾 Posición original guardada:', originalBoardPosition);

            // Aplicar estilos para hacer el tablero movible
            const currentPosition = computedStyle.position;

            if (currentPosition === 'static') {
                board.style.position = 'relative';
            } else {
                // Si ya tiene position, convertir a absolute para mayor control
                board.style.position = 'absolute';
                board.style.left = rect.left + 'px';
                board.style.top = rect.top + 'px';
            }

            board.style.cursor = 'grab';
            board.style.zIndex = '1000';

            console.log('✅ Estilos aplicados - tablero debe mantenerse visible');

            makeBoardDraggable(board);
            boardMoved = true;
            config.boardMoveable = true;
            GM_setValue('redKingConfig242', config);

            // showTopNotification('📐 Tablero ahora es movible', 'success');
            updateBoardStatus();

            console.log('✅ Modo arrastrable activado exitosamente');

        } else {
            console.log('🔧 Desactivando modo arrastrable...');

            // Desactivar modo arrastrable
            removeBoardDragListeners();

            // CAMBIO IMPORTANTE: Mantener la posición actual en lugar de restaurar la original
            console.log('✅ Manteniendo posición actual del tablero...');

            // Solo restaurar las propiedades de estilo que no afectan la posición
            if (originalBoardPosition) {
                // Mantener la posición actual pero restaurar otros estilos
                board.style.cursor = originalBoardPosition.cursor || '';

                // Solo restaurar z-index si no era importante para la funcionalidad
                // (mantener el z-index alto puede ser útil)
                // board.style.zIndex = originalBoardPosition.zIndex || '';

                // Si los estilos originales estaban vacíos, limpiar cursor
                if (!originalBoardPosition.cursor) {
                    board.style.removeProperty('cursor');
                }
            } else {
                console.log('⚠️ No hay posición original guardada, limpiando solo cursor');
                // Solo limpiar el cursor, mantener posición
                board.style.removeProperty('cursor');
            }

            boardMoved = false;
            config.boardMoveable = false;
            GM_setValue('redKingConfig242', config);

            // showTopNotification('🎯 Tablero fijo (no movible)', 'info');
            updateBoardStatus();

            console.log('✅ Modo arrastrable desactivado exitosamente');
        }
    }

    // Hacer tablero arrastrable - MANTENER COMO ESTÁ
    function makeBoardDraggable(board) {
        console.log('🔧 Configurando tablero arrastrable...');

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const startDrag = (e) => {
            if (e.button !== 0) return;

            if (e.target.classList.contains('cg-board') ||
                e.target.classList.contains('cg-wrap') ||
                e.target.tagName === 'CG-CONTAINER') {

                console.log('🎯 Iniciando arrastre del tablero...');
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const computedStyle = window.getComputedStyle(board);
                initialLeft = parseInt(computedStyle.left) || 0;
                initialTop = parseInt(computedStyle.top) || 0;

                console.log('📍 Posición inicial para arrastre:', { initialLeft, initialTop });

                board.style.cursor = 'grabbing';
                board.style.userSelect = 'none';

                e.preventDefault();
                e.stopPropagation();
            }
        };

        const drag = (e) => {
            if (!isDragging) return;

            e.preventDefault();
            e.stopPropagation();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newLeft = initialLeft + deltaX;
            const newTop = initialTop + deltaY;

            const margin = 50;
            const maxLeft = window.innerWidth - board.offsetWidth - margin;
            const maxTop = window.innerHeight - board.offsetHeight - margin;

            const boundedLeft = Math.max(-margin, Math.min(newLeft, maxLeft));
            const boundedTop = Math.max(-margin, Math.min(newTop, maxTop));

            board.style.left = boundedLeft + 'px';
            board.style.top = boundedTop + 'px';

            if (board.style.position !== 'absolute') {
                board.style.position = 'absolute';
            }
        };

        const stopDrag = (e) => {
            if (!isDragging) return;

            console.log('🎯 Finalizando arrastre del tablero...');
            isDragging = false;
            board.style.cursor = 'grab';
            board.style.userSelect = '';
        };

        board.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        boardDragListeners = [
            { element: board, event: 'mousedown', listener: startDrag },
            { element: document, event: 'mousemove', listener: drag },
            { element: document, event: 'mouseup', listener: stopDrag }
        ];

        console.log('✅ Tablero arrastrable configurado exitosamente');
    }

    // Remover listeners del tablero
    function removeBoardDragListeners() {
        console.log('🧹 Removiendo listeners de arrastre...');
        boardDragListeners.forEach(({ element, event, listener }) => {
            try {
                element.removeEventListener(event, listener);
            } catch (error) {
                console.warn('⚠️ Error removiendo listener:', error);
            }
        });
        boardDragListeners = [];
        console.log('✅ Listeners removidos');
    }

    // Solo resetear posición del tablero
    function resetBoardPositionOnly() {
        const boardSelectors = [
            '.cg-wrap', '.board-wrap', 'main.game .cg-wrap',
            '.game .cg-wrap', '.analyse .cg-wrap', '.lpv .cg-wrap'
        ];

        let board = null;
        for (const selector of boardSelectors) {
            board = document.querySelector(selector);
            if (board) break;
        }

        if (!board) {
            // showTopNotification('❌ No se encontró el tablero', 'error');
            return;
        }

        if (originalBoardPosition) {
            if (boardMoved) {
                const rect = originalBoardPosition.rect;
                board.style.left = rect.left + 'px';
                board.style.top = rect.top + 'px';
            } else {
                board.style.left = originalBoardPosition.left;
                board.style.top = originalBoardPosition.top;
                board.style.transform = originalBoardPosition.transform;
            }
        } else {
            const rect = board.getBoundingClientRect();
            const centerX = (window.innerWidth - rect.width) / 2;
            const centerY = (window.innerHeight - rect.height) / 2;

            if (boardMoved) {
                board.style.left = centerX + 'px';
                board.style.top = centerY + 'px';
            }
        }

        // showTopNotification('🎯 Posición del tablero restaurada', 'success');
    }

    // Actualizar estado del tablero en la UI
    function updateBoardStatus() {
        const statusElement = document.getElementById('boardStatus');
        if (statusElement) {
            if (boardMoved) {
                statusElement.innerHTML = '<span style="color: #4CAF50;">📐 Movible</span> - Arrastra desde áreas vacías del tablero';
                statusElement.style.fontSize = '10px';
            } else {
                statusElement.innerHTML = '<span style="color: #ccc;">🔒 Normal (no movible)</span>';
                statusElement.style.fontSize = '11px';
            }
        }
    }

    // Configurar eventos del panel - VERSIÓN CORREGIDA
    function setupPanelEvents() {
        console.log('Configurando eventos v2.4.2 - MODO SEGURO...');

        // CRÍTICO: Prevenir configuración múltiple
        const panel = document.getElementById('redKingPanel');
        if (!panel || panel.hasAttribute('data-events-configured')) {
            console.warn('⚠️ Panel ya configurado o no existe');
            return;
        }
        panel.setAttribute('data-events-configured', 'true');

        // Agregar sonidos de click a todos los botones del panel
        addButtonClickSounds();

        // Navegación por pestañas
        document.querySelectorAll('#redKingPanel .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                switchTab(targetTab);
                // Reproducir sonido específico de pestaña (ligero)
                if (soundSystem) soundSystem.playUISound('buttonClickLight');
            });
        });

        // Toggle switches - CON PREVENCIÓN DE BUCLES
        document.querySelectorAll('#redKingPanel input[type="checkbox"]').forEach(toggle => {
            // CRÍTICO: Remover listeners existentes para evitar duplicados
            const existingHandler = toggle._redKingHandler;
            if (existingHandler) {
                toggle.removeEventListener('change', existingHandler);
            }

            const newHandler = (e) => {
                // CRÍTICO: Prevenir bucles infinitos
                if (toggle._isChanging) {
                    return;
                }
                toggle._isChanging = true;

                const configPath = e.target.id.replace(/_/g, '.');
                const value = e.target.checked;

                console.log(`🔧 Usuario cambió manualmente: ${configPath} = ${value}`);

                setNestedConfig(configPath, value);
                GM_setValue('redKingConfig242', config);

                // CRÍTICO: Solo aplicar cambios si el usuario los activó manualmente
                handleConfigChangeUserTriggered(configPath, value);

                setTimeout(() => {
                    toggle._isChanging = false;
                }, 100);
            };

            toggle._redKingHandler = newHandler;
            toggle.addEventListener('change', newHandler);
        });

        // Color pickers
        document.querySelectorAll('input[type="color"]').forEach(picker => {
            picker.addEventListener('change', (e) => {
                const configPath = e.target.id.replace(/_/g, '.');
                const value = e.target.value;

                setNestedConfig(configPath, value);
                GM_setValue('redKingConfig242', config);

                if (configPath.includes('buttonColors')) {
                    updateButtonStyles();
                } else if (configPath.includes('customColors')) {
                    applyTextColors();
                }

                // showAdvancedNotification('Color actualizado ✨', 'success', 1000);
            });
        });

        // Configuración de partículas - Cantidad
        const particleCountSlider = document.getElementById('particleCount');
        const particleCountValue = document.getElementById('particleCountValue');

        if (particleCountSlider && particleCountValue) {
            particleCountSlider.addEventListener('input', (e) => {
                const count = parseInt(e.target.value);
                if (!config.particleConfig) config.particleConfig = {};
                config.particleConfig.count = count;
                particleCountValue.textContent = count + ' partículas';
                GM_setValue('redKingConfig242', config);
                console.log('🔢 Cantidad de partículas cambiada a:', count);
            });
        }

        // Configuración de partículas - Rango
        const particleRangeSlider = document.getElementById('particleRange');
        const particleRangeValue = document.getElementById('particleRangeValue');

        if (particleRangeSlider && particleRangeValue) {
            particleRangeSlider.addEventListener('input', (e) => {
                const range = parseInt(e.target.value);
                if (!config.particleConfig) config.particleConfig = {};
                config.particleConfig.range = range;
                particleRangeValue.textContent = range + 'px de dispersión';
                GM_setValue('redKingConfig242', config);
                console.log('📏 Rango de partículas cambiado a:', range + 'px');
            });
        }

        setupActionButtons();
        setupMusicPlayerEvents();
        setupSpritesEvents();
        setupPanelControls();
    }

    // Configurar eventos del reproductor de música
    function setupMusicPlayerEvents() {
        const youtubeUrlInput = document.getElementById('youtubeUrl');
        if (youtubeUrlInput) {
            youtubeUrlInput.addEventListener('change', (e) => {
                config.musicPlayer.youtubeUrl = e.target.value;
                GM_setValue('redKingConfig242', config);
                // showTopNotification('🔗 URL de YouTube guardada', 'saved');
            });
        }

        const musicVolumeSlider = document.getElementById('musicVolume');
        const volumeDisplay = document.getElementById('volumeDisplay');

        if (musicVolumeSlider && volumeDisplay) {
            musicVolumeSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value) / 100;
                config.musicPlayer.volume = volume;
                volumeDisplay.textContent = e.target.value + '%';
                GM_setValue('redKingConfig242', config);

                if (musicPlayerInstance) {
                    musicPlayerInstance.setVolume(volume);
                }
            });
        }

        const startMusicBtn = document.getElementById('startMusicPlayer');
        if (startMusicBtn) {
            startMusicBtn.addEventListener('click', startMusicPlayer);
        }

        const stopMusicBtn = document.getElementById('stopMusicPlayer');
        if (stopMusicBtn) {
            stopMusicBtn.addEventListener('click', stopMusicPlayer);
        }
    }

    // Configurar eventos de sprites
    function setupSpritesEvents() {
        // Botones de upload
        document.querySelectorAll('.sprite-upload-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pieceType = e.target.dataset.piece;
                spritesManager.uploadSprite(pieceType);
            });
        });

        // Botones de reset individual
        document.querySelectorAll('.sprite-reset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pieceType = e.target.dataset.piece;
                spritesManager.resetSprite(pieceType);
            });
        });


        // Resetear todos los sprites
        const resetAllSpritesBtn = document.getElementById('resetAllSprites');
        if (resetAllSpritesBtn) {
            resetAllSpritesBtn.addEventListener('click', () => {
                if (confirm('¿Restablecer todos los sprites personalizados?')) {
                    Object.keys(config.customSprites.pieces).forEach(piece => {
                        config.customSprites.pieces[piece] = '';
                    });
                    GM_setValue('redKingConfig242', config);

                    document.querySelectorAll('[id^="preview_"]').forEach(preview => {
                        preview.style.display = 'none';
                    });

                    spritesManager.removeCustomSprites();
                    // showTopNotification('🔄 Todos los sprites restablecidos', 'info');
                }
            });
        }
    }

    // Funciones del reproductor de música CORREGIDAS
    async function startMusicPlayer() {
        const youtubeUrl = config.musicPlayer.youtubeUrl.trim();

        if (!youtubeUrl) {
            // showTopNotification('❌ Ingresa una URL de YouTube válida', 'error');
            return;
        }

        if (!config.musicPlayer.enabled) {
            // showTopNotification('❌ Activa el reproductor de música primero', 'warning');
            return;
        }

        try {
            // showTopNotification('🎵 Iniciando reproductor...', 'info');

            if (musicPlayerInstance) {
                musicPlayerInstance.destroy();
                musicPlayerInstance = null;
            }

            musicPlayerInstance = new YouTubeMusicPlayer();
            const success = await musicPlayerInstance.initPlayer(youtubeUrl);

            if (success) {
                console.log('✅ Reproductor de música iniciado exitosamente');
            } else {
                console.error('❌ No se pudo iniciar el reproductor de música');
                musicPlayerInstance = null;
            }
        } catch (error) {
            console.error('Error iniciando reproductor:', error);
            // showTopNotification('❌ Error al iniciar reproductor', 'error');
            musicPlayerInstance = null;
        }
    }

    function stopMusicPlayer() {
        if (musicPlayerInstance) {
            musicPlayerInstance.destroy();
            musicPlayerInstance = null;
        } else {
            // showTopNotification('ℹ️ No hay reproductor activo', 'info');
        }
    }

    // Configurar botones de acción
    function setupActionButtons() {
        // Botón girar tablero CORREGIDO
        const flipBoard = document.getElementById('flipBoard');
        if (flipBoard) {
            flipBoard.addEventListener('click', flipBoardAction);
        }

        // Botón análisis rápido
        const quickAnalysis = document.getElementById('quickAnalysis');
        if (quickAnalysis) {
            quickAnalysis.addEventListener('click', openAnalysis);
        }

        // Botón exportar PGN
        const exportPGN = document.getElementById('exportPGN');
        if (exportPGN) {
            exportPGN.addEventListener('click', exportPGNAction);
        }

                        // Botón probar partículas - REMOVIDO
                        // Sistema de partículas eliminado por simplicidad

        // Botón mover tablero
        const toggleBoardMove = document.getElementById('toggleBoardMove');
        if (toggleBoardMove) {
            toggleBoardMove.addEventListener('click', toggleBoardMoveable);
        }

        // Reset posición del tablero
        const resetBoardPosition = document.getElementById('resetBoardPosition');
        if (resetBoardPosition) {
            resetBoardPosition.addEventListener('click', resetBoardPositionOnly);
        }

        // Controles de chat
        const toggleChat = document.getElementById('toggleChat');
        if (toggleChat) {
            toggleChat.addEventListener('click', toggleChatVisibility);
        }

        // Aplicar tema tablero
        const applyBoardTheme = document.getElementById('applyBoardTheme');
        if (applyBoardTheme) {
            applyBoardTheme.addEventListener('click', () => {
                applyTextColors();
                // showTopNotification('✨ Cambios de tablero aplicados', 'success');
            });
        }

        // Aplicar tema general
        const applyTheme = document.getElementById('applyTheme');
        if (applyTheme) {
            applyTheme.addEventListener('click', () => {
                applyCustomTheme();
                // showTopNotification('✨ Tema aplicado', 'success');
            });
        }

        // Exportar configuración
        const exportConfig = document.getElementById('exportConfig');
        if (exportConfig) {
            exportConfig.addEventListener('click', exportConfiguration);
        }

        // Botones sociales
        const joinDiscord = document.getElementById('joinDiscord');
        if (joinDiscord) {
            joinDiscord.addEventListener('click', () => {
                GM_openInTab(config.userLinks.discord, false);
                // showTopNotification('💬 Abriendo Discord...', 'info');
            });
        }

        const visitGitHub = document.getElementById('visitGitHub');
        if (visitGitHub) {
            visitGitHub.addEventListener('click', () => {
                GM_openInTab(config.userLinks.github, false);
                // showTopNotification('🐱 Abriendo GitHub...', 'info');
            });
        }
    }

    // Configurar controles del panel
    function setupPanelControls() {
        const minimizeBtn = document.getElementById('minimizeBtn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', togglePanelSize);
        }

        const closePanel = document.getElementById('closePanel');
        if (closePanel) {
            closePanel.addEventListener('click', () => {
                const panel = document.getElementById('redKingPanel');
                if (panel) {
                    // Sonido de cerrar panel
                    if (soundSystem) soundSystem.playUISound('panelHide');

                    // Al cerrar manualmente, persistir que el panel está oculto
                    config.panelVisible = false;
                    GM_setValue('redKingConfig242', config);

                    // Animación de cierre
                    panel.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                    panel.style.transform = 'scale(0.8)';
                    panel.style.opacity = '0';

                    setTimeout(() => panel.remove(), 200);
                }
            });
        }

        const resetConfig = document.getElementById('resetConfig');
        if (resetConfig) {
            resetConfig.addEventListener('click', resetConfiguration);
        }

        const restoreNormal = document.getElementById('restoreNormal');
        if (restoreNormal) {
            restoreNormal.addEventListener('click', restoreToNormal);
        }
    }

    // Cambiar pestañas
    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.cssText = `
                flex: 1;
                padding: 12px 6px;
                text-align: center;
                cursor: pointer;
                font-size: 10px;
                border-right: 1px solid #444;
                transition: all 0.3s;
                background: #3a3a3a;
                color: #ccc;
            `;
        });

        const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.style.cssText = `
                flex: 1;
                padding: 12px 6px;
                text-align: center;
                cursor: pointer;
                font-size: 10px;
                border-right: 1px solid #444;
                transition: all 0.3s;
                background: #8B0000;
                color: #FFD700;
            `;
        }

        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        const activeContent = document.getElementById(`tab-${tabName}`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }

        currentTab = tabName;

        if (tabName === 'board') {
            updateBoardStatus();
        }
    }

    // CRÍTICO: Función separada para cambios activados por el usuario
    function handleConfigChangeUserTriggered(configPath, value) {
        console.log(`🎯 Aplicando cambio del usuario: ${configPath} = ${value}`);

        switch (configPath) {
            case 'buttonColors.enabled':
                if (value) updateButtonStyles();
                else removeButtonStyles();
                break;
            case 'boardEffects':
                toggleBoardEffects(value);
                break;
            case 'soundEnabled':
                toggleSounds(value);
                break;
            case 'customSprites.enabled':
                if (value) {
                    spritesManager.initCustomSprites();
                } else {
                    spritesManager.removeCustomSprites();
                }
                break;
            case 'musicPlayer.enabled':
                if (!value && musicPlayerInstance) {
                    stopMusicPlayer();
                }
                break;
            case 'enhancedAnimations':
                toggleEnhancedAnimations(value);
                break;
        }
    }

    // Manejar cambios de configuración - VERSIÓN ORIGINAL PARA INICIALIZACIÓN
    function handleConfigChange(configPath, value) {
        // CRÍTICO: Esta función solo se debe usar en inicialización automática
        console.log(`⚙️ Inicialización automática: ${configPath} = ${value}`);

        switch (configPath) {
            case 'buttonColors.enabled':
                if (value) updateButtonStyles();
                break;
            case 'boardEffects':
                if (value) toggleBoardEffects(true);
                break;
            case 'soundEnabled':
                if (value) toggleSounds(true);
                break;
            case 'customSprites.enabled':
                if (value) {
                    spritesManager.initCustomSprites();
                } else {
                    spritesManager.removeCustomSprites();
                }
                break;
        }
    }


    // Obtener nombre legible de la opción
    function getOptionName(configPath) {
        const names = {
            'soundEnabled': 'Sonidos',
            'boardEffects': 'Efectos',
            'buttonColors.enabled': 'Botones rojos',
            'musicPlayer.enabled': 'Reproductor de música',
            'musicPlayer.autoplay': 'Reproducción automática',
            'customSprites.enabled': 'Sprites personalizados'
        };
        return names[configPath] || configPath;
    }

    // === FUNCIONES DE ACCIÓN ===

    // Análisis rápido
    function openAnalysis() {
        try {
            const gameId = extractGameId();
            const currentUrl = window.location.href;

            if (gameId && gameId.length >= 8) {
                const analysisUrl = `https://lichess.org/analysis/${gameId}`;
                GM_openInTab(analysisUrl, false);
                // showTopNotification('📊 Abriendo análisis de partida', 'success');
            } else if (currentUrl.includes('/game/')) {
                const gameMatch = currentUrl.match(/\/game\/([a-zA-Z0-9]{8,})/);
                if (gameMatch) {
                    const analysisUrl = `https://lichess.org/analysis/${gameMatch[1]}`;
                    GM_openInTab(analysisUrl, false);
                    // showTopNotification('📊 Abriendo análisis', 'success');
                } else {
                    GM_openInTab('https://lichess.org/analysis', false);
                    // showTopNotification('📊 Abriendo tablero de análisis', 'info');
                }
            } else {
                GM_openInTab('https://lichess.org/analysis', false);
                // showTopNotification('📊 Abriendo tablero de análisis', 'info');
            }
        } catch (error) {
            console.error('Error al abrir análisis:', error);
            // showTopNotification('❌ Error al abrir análisis', 'error');
        }
    }

    // Exportar PGN
    function exportPGNAction() {
        try {
            const gameId = extractGameId();
            if (gameId && gameId.length >= 8) {
                const pgnUrl = `https://lichess.org/game/export/${gameId}.pgn`;

                fetch(pgnUrl)
                    .then(response => response.text())
                    .then(pgnData => {
                        const blob = new Blob([pgnData], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `lichess_${gameId}.pgn`;
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        URL.revokeObjectURL(url);
                        // showTopNotification('📄 PGN descargado', 'success');
                    })
                    .catch(() => {
                        const link = document.createElement('a');
                        link.href = pgnUrl;
                        link.download = `lichess_${gameId}.pgn`;
                        link.click();
                        // showTopNotification('📄 Descargando PGN...', 'success');
                    });
            } else {
                // showTopNotification('❌ No se encontró ID de partida válido', 'error');
            }
        } catch (error) {
            console.error('Error al exportar PGN:', error);
            // showTopNotification('❌ Error al exportar PGN', 'error');
        }
    }

    // === FUNCIONES DE CHAT ===

    function toggleChatVisibility() {
        const chatSelectors = ['.mchat', '.chat', '.game__chat', '#chat', '.lpv__chat', '.chat-wrap'];
        let chatFound = false;

        for (const selector of chatSelectors) {
            const chatElement = document.querySelector(selector);
            if (chatElement) {
                if (chatElement.style.display === 'none') {
                    chatElement.style.display = '';
                    config.chatVisible = true;
                    // showTopNotification('👁️‍🗨️ Chat mostrado', 'success');
                } else {
                    chatElement.style.display = 'none';
                    config.chatVisible = false;
                    // showTopNotification('👁️ Chat oculto', 'info');
                }
                GM_setValue('redKingConfig242', config);
                chatFound = true;
                break;
            }
        }

        if (!chatFound) {
            // showTopNotification('❌ No se encontró el chat', 'error');
        }
    }


    // Extraer ID de partida
    function extractGameId() {
        const url = window.location.href;
        const pathname = window.location.pathname;

        const patterns = [
            /\/([a-zA-Z0-9]{8})(?:\/|$|\?|#)/,
            /\/([a-zA-Z0-9]{12})(?:\/|$|\?|#)/,
            /\/game\/export\/([a-zA-Z0-9]{8,})/,
            /\/analysis\/([a-zA-Z0-9]{8,})/
        ];

        for (const pattern of patterns) {
            const match = pathname.match(pattern) || url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    // === FUNCIONES DE TEMA ===

    function toggleBoardEffects(enabled) {
        const effectsStyle = document.getElementById('redKingBoardEffectsStyle') || document.createElement('style');
        effectsStyle.id = 'redKingBoardEffectsStyle';

        if (enabled) {
            effectsStyle.textContent = `
                /* Último movimiento */
                cg-board square.last-move, .cg-board square.last-move {
                    background: linear-gradient(45deg, rgba(220, 20, 60, 0.25), rgba(220, 20, 60, 0.1)) !important;
                    box-shadow: inset 0 0 12px rgba(220,20,60,0.45) !important;
                }

                /* Piezas/ casillas seleccionadas */
                cg-board square.selected, .cg-board square.selected {
                    background: radial-gradient(circle, rgba(255,215,0,0.45) 0%, rgba(255,215,0,0.18) 65%, transparent 100%) !important;
                    box-shadow: inset 0 0 16px rgba(255,215,0,0.6) !important;
                }

                /* Destinos de movimiento */
                cg-board square.move-dest, .cg-board square.move-dest,
                cg-board square.premove-dest, .cg-board square.premove-dest {
                    background: radial-gradient(circle, rgba(255,215,0,0.35) 28%, transparent 80%) !important;
                }

                /* Capturas disponibles */
                cg-board square.occupied.move-dest, .cg-board square.occupied.move-dest,
                cg-board square.oc.move-dest, .cg-board square.oc.move-dest {
                    background: radial-gradient(circle, rgba(220,20,60,0.45) 28%, transparent 80%) !important;
                }

                /* Jaque visible e intenso */
                cg-board square.check, .cg-board square.check {
                    background: radial-gradient(circle, rgba(220,20,60,0.7) 0%, rgba(220,20,60,0.35) 60%, transparent 100%) !important;
                    animation: redKingBoardCheckPulse 0.9s ease-in-out infinite alternate !important;
                }

                @keyframes redKingBoardCheckPulse {
                    0% { box-shadow: inset 0 0 14px rgba(220,20,60,0.55) }
                    100% { box-shadow: inset 0 0 20px rgba(220,20,60,0.8) }
                }
            `;
        } else {
            effectsStyle.textContent = '';
        }

        if (!effectsStyle.parentNode) {
            document.head.appendChild(effectsStyle);
        }
    }


    function toggleSounds(enabled) {
        try {
            if (enabled) {
                soundSystem.enable();
            } else {
                soundSystem.disable();
            }
        } catch (e) {
            console.warn('No se pudo alternar sonidos mejorados:', e);
        }
    }

    function toggleEnhancedAnimations(enabled) {
        const animStyle = document.getElementById('redKingEnhancedAnimations') || document.createElement('style');
        animStyle.id = 'redKingEnhancedAnimations';

        if (enabled) {
            console.log('✨ Activando animaciones fluidas optimizadas...');
            animStyle.textContent = `
                /* SOLO movimiento más rápido y fluido para piezas */
                cg-board piece, .cg-board piece {
                    transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                    transform-origin: center !important;
                }

                /* Movimiento fluido del tablero (más rápido) */
                cg-board, .cg-board {
                    transition: transform 0.2s ease-out !important;
                }

                /* Animaciones de hover más rápidas */
                cg-board square, .cg-board square {
                    transition: background-color 0.1s ease !important;
                }
            `;
        } else {
            console.log('✨ Desactivando animaciones mejoradas...');
            animStyle.textContent = '';
        }

        if (!animStyle.parentNode) {
            document.head.appendChild(animStyle);
        }
    }

    function applyTextColors() {
        const textColorStyle = document.getElementById('redKingTextColorStyle') || document.createElement('style');
        textColorStyle.id = 'redKingTextColorStyle';

        textColorStyle.textContent = `
            .mchat, .mchat .messages, .chat, .game__chat {
                color: ${config.customColors.chatText} !important;
            }

            .mchat .message, .chat .message {
                color: ${config.customColors.chatText} !important;
            }
        `;

        if (!textColorStyle.parentNode) {
            document.head.appendChild(textColorStyle);
        }
    }

    function removeButtonStyles() {
        const existingStyle = document.getElementById('redKingButtonStyles');
        if (existingStyle) {
            existingStyle.remove();
            console.log('🎨 Estilos de botones removidos');
        }
    }

    function updateButtonStyles() {
        if (!config.buttonColors.enabled) {
            removeButtonStyles();
            return;
        }

        const buttonStyle = document.getElementById('redKingButtonStyles') || document.createElement('style');
        buttonStyle.id = 'redKingButtonStyles';

        buttonStyle.textContent = `
            .button, .form3-submit, .lobby__box .button, .lobby__start .button,
            .game__menu .button, .analyse__tools .button, .board-wrap .button,
            button.button, input[type="submit"], .game .button {
                background: linear-gradient(135deg, ${config.buttonColors.buttonPrimary} 0%, ${config.buttonColors.buttonSecondary} 100%) !important;
                border: none !important;
                color: ${config.buttonColors.textColor} !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
            }

            .button:hover, .form3-submit:hover, .lobby__box .button:hover, .lobby__start .button:hover,
            .game__menu .button:hover, .analyse__tools .button:hover, .board-wrap .button:hover,
            button.button:hover, input[type="submit"]:hover, .game .button:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important;
                background: linear-gradient(135deg, ${config.buttonColors.hoverPrimary} 0%, ${config.buttonColors.hoverSecondary} 100%) !important;
            }
        `;

        if (!buttonStyle.parentNode) {
            document.head.appendChild(buttonStyle);
        }
    }

    function applyCustomTheme() {
        // CRÍTICO: Solo aplicar si las opciones están realmente activadas
        console.log('🎨 Aplicando tema personalizado solo para opciones activadas...');

        if (config.boardEffects === true) {
            console.log('✅ Aplicando efectos de tablero (usuario activó)');
            toggleBoardEffects(true);
        }
        if (config.soundEnabled === true) {
            console.log('✅ Activando sonidos (usuario activó)');
            toggleSounds(true);
        }

        // Colores y botones se pueden aplicar siempre
        applyTextColors();
        if (config.buttonColors.enabled === true) {
            updateButtonStyles();
        }

        if (config.customSprites.enabled === true) {
            console.log('✅ Aplicando sprites personalizados (usuario activó)');
            spritesManager.initCustomSprites();
        }
    }

    // === RESTAURAR NORMALIDAD ===
    function restoreToNormal() {
        if (!confirm('¿Restaurar Lichess a su estado completamente normal?\n\nEsto desactivará TODOS los cambios de Red King incluyendo música y sprites.')) {
            return;
        }

        try {
            // 1. Detener reproductor de música
            if (musicPlayerInstance) {
                musicPlayerInstance.destroy();
                musicPlayerInstance = null;
            }

            // 2. Desactivar sprites personalizados
            spritesManager.removeCustomSprites();

            // 3. Desactivar movimiento de tablero
            if (boardMoved) {
                const boardSelectors = [
                    '.cg-wrap', '.board-wrap', 'main.game .cg-wrap',
                    '.game .cg-wrap', '.analyse .cg-wrap', '.lpv .cg-wrap'
                ];

                let board = null;
                for (const selector of boardSelectors) {
                    board = document.querySelector(selector);
                    if (board) break;
                }

                if (board && originalBoardPosition) {
                    removeBoardDragListeners();

                    ['position', 'left', 'top', 'right', 'bottom', 'transform', 'z-index', 'cursor'].forEach(prop => {
                        board.style.removeProperty(prop);
                    });
                }
                boardMoved = false;
            }

            // 4. Remover todos los estilos personalizados
            const stylesToRemove = [
                'redKingBoardEffectsStyle',
                'redKingHighlightStyle',
                'redKingSoundStyle',
                'redKingTextColorStyle',
                'redKingButtonStyles',
                'redKingCustomSprites'
            ];

            stylesToRemove.forEach(styleId => {
                const style = document.getElementById(styleId);
                if (style) style.remove();
            });

            // 5. Mostrar todo el chat
            const chatSelectors = ['.mchat', '.chat', '.game__chat', '#chat', '.lpv__chat', '.chat-wrap'];
            chatSelectors.forEach(selector => {
                const chatElement = document.querySelector(selector);
                if (chatElement) {
                    chatElement.style.display = '';
                }
            });

            // 6. Resetear configuración completa
            config = JSON.parse(JSON.stringify(defaultConfig));
            GM_setValue('redKingConfig242', config);

            // 7. Actualizar UI del panel
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                const configPath = checkbox.id.replace(/_/g, '.');
                checkbox.checked = getNestedConfig(configPath);
            });

            document.querySelectorAll('input[type="color"]').forEach(colorPicker => {
                const configPath = colorPicker.id.replace(/_/g, '.');
                colorPicker.value = getNestedConfig(configPath);
            });

            const youtubeUrlInput = document.getElementById('youtubeUrl');
            if (youtubeUrlInput) youtubeUrlInput.value = '';

            const musicVolumeSlider = document.getElementById('musicVolume');
            if (musicVolumeSlider) musicVolumeSlider.value = 50;

            const volumeDisplay = document.getElementById('volumeDisplay');
            if (volumeDisplay) volumeDisplay.textContent = '50%';

            updateBoardStatus();

            // showTopNotification('🔄 ¡Lichess restaurado a normalidad completa!', 'success', 4000);

        } catch (error) {
            console.error('Error al restaurar normalidad:', error);
            // showTopNotification('❌ Error al restaurar normalidad', 'error');
        }
    }

    // Agregar sonidos de click específicos a todos los botones del panel
    function addButtonClickSounds() {
        // Función para determinar el tipo de sonido según el botón
        function getSoundTypeForButton(button) {
            const id = button.id;
            const classList = button.classList;

            // Botones de pestañas/secciones (sonido ligero)
            if (classList.contains('tab-btn')) {
                return 'buttonClickLight';
            }

            // Toggles/switches (sonido medio grave)
            if (button.type === 'checkbox' || button.closest('.toggle-switch')) {
                return 'buttonClickToggle';
            }

            // Botón minimizar panel
            if (id === 'minimizeBtn') {
                return 'buttonClickMinimize';
            }

            // Controles de música
            if (classList.contains('music-btn') || id.includes('MusicPlayer') || id.includes('music')) {
                return 'buttonClickMusic';
            }

            // Botones de sprites
            if (classList.contains('sprite-upload-btn') || classList.contains('sprite-reset-btn') ||
                id.includes('Sprites') || id.includes('sprite')) {
                return 'buttonClickSprite';
            }

            // Botones sociales
            if (classList.contains('social-btn') || id === 'joinDiscord' || id === 'visitGitHub') {
                return 'buttonClickSocial';
            }

            // Botones peligrosos/de reset
            if (id === 'restoreNormal' || id === 'resetConfig' || id === 'resetAllSprites' ||
                classList.contains('danger-btn') || button.textContent.toLowerCase().includes('reset') ||
                button.textContent.toLowerCase().includes('restaurar')) {
                return 'buttonClickDanger';
            }

            // Botones especiales
            if (id === 'closePanel' || classList.contains('special-btn') ||
                id.includes('apply') || id.includes('export')) {
                return 'buttonClickSpecial';
            }

            // Botón genérico por defecto
            return 'buttonClick';
        }

        // Mapeo de selectores con sus sonidos específicos
        const buttonMappings = [
            // Pestañas (sonido ligero)
            { selector: '.tab-btn', soundType: 'buttonClickLight' },

            // Toggles/checkboxes (sonido medio grave)
            { selector: 'input[type="checkbox"]', soundType: 'buttonClickToggle' },

            // Botón minimizar
            { selector: '#minimizeBtn', soundType: 'buttonClickMinimize' },

            // Controles de música
            { selector: '.music-btn', soundType: 'buttonClickMusic' },
            { selector: 'button[id*="MusicPlayer"]', soundType: 'buttonClickMusic' },
            { selector: '#startMusicPlayer', soundType: 'buttonClickMusic' },
            { selector: '#stopMusicPlayer', soundType: 'buttonClickMusic' },

            // Botones de sprites
            { selector: '.sprite-upload-btn', soundType: 'buttonClickSprite' },
            { selector: '.sprite-reset-btn', soundType: 'buttonClickSprite' },
            { selector: '#applySprites', soundType: 'buttonClickSprite' },
            { selector: '#resetAllSprites', soundType: 'buttonClickDanger' },

            // Botones sociales
            { selector: '.social-btn', soundType: 'buttonClickSocial' },
            { selector: '#joinDiscord', soundType: 'buttonClickSocial' },
            { selector: '#visitGitHub', soundType: 'buttonClickSocial' },

            // Botones peligrosos
            { selector: '#restoreNormal', soundType: 'buttonClickDanger' },
            { selector: '#resetConfig', soundType: 'buttonClickDanger' },

            // Botones especiales
            { selector: '#closePanel', soundType: 'buttonClickSpecial' },
            { selector: '#exportConfig', soundType: 'buttonClickSpecial' },
            { selector: '#applyTheme', soundType: 'buttonClickSpecial' },
            { selector: '#applyBoardTheme', soundType: 'buttonClickSpecial' },

            // Botones de acción generales
            { selector: '.action-btn', soundType: 'buttonClick' }
        ];

        // Aplicar sonidos específicos a cada grupo de botones
        buttonMappings.forEach(mapping => {
            document.querySelectorAll(mapping.selector).forEach(button => {
                // Evitar duplicar event listeners
                if (button.hasAttribute('data-sound-added')) return;
                button.setAttribute('data-sound-added', 'true');

                const eventType = button.type === 'checkbox' ? 'change' : 'click';
                button.addEventListener(eventType, () => {
                    if (soundSystem) {
                        soundSystem.playUISound(mapping.soundType);
                    }
                });
            });
        });

        // Añadir detección inteligente para botones que no estén en la lista específica
        document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(button => {
            if (button.hasAttribute('data-sound-added')) return;

            // Solo aplicar a botones dentro del panel Red King
            const redKingPanel = document.getElementById('redKingPanel');
            if (!redKingPanel || !redKingPanel.contains(button)) return;

            button.setAttribute('data-sound-added', 'true');
            const soundType = getSoundTypeForButton(button);

            button.addEventListener('click', () => {
                if (soundSystem) {
                    soundSystem.playUISound(soundType);
                }
            });
        });

        console.log('🔊 Sonidos específicos de botón configurados para todos los elementos del panel');
    }

    // === FUNCIONES UTILITARIAS ===

    function togglePanelSize() {
        const panel = document.getElementById('redKingPanel');
        const content = document.getElementById('panelContent');
        const btn = document.getElementById('minimizeBtn');

        if (panelVisible) {
            content.style.display = 'none';
            panel.style.height = 'auto';
            btn.textContent = '+';
            panelVisible = false;
        } else {
            content.style.display = 'block';
            btn.textContent = '−';
            panelVisible = true;
        }
    }

    function makePanelDraggable(panel) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const header = document.getElementById('panelHeader');
        if (!header) return;

        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            if (e.target.id === 'minimizeBtn') return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            header.style.cursor = 'grabbing';
            panel.style.zIndex = '9999999';
            panel.style.transition = 'none';
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            const margin = 10;
            newLeft = Math.max(margin, Math.min(newLeft, window.innerWidth - panel.offsetWidth - margin));
            newTop = Math.max(margin, Math.min(newTop, window.innerHeight - panel.offsetHeight - margin));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = 'auto';
        }

        function stopDrag() {
            if (!isDragging) return;

            isDragging = false;
            header.style.cursor = 'move';
            panel.style.zIndex = '999999';
            panel.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    function exportConfiguration() {
        try {
            const configData = JSON.stringify(config, null, 2);
            const blob = new Blob([configData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `red_king_v242_config_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();

            URL.revokeObjectURL(url);
            // showTopNotification('💾 Configuración exportada', 'success');
        } catch (error) {
            console.error('Error al exportar configuración:', error);
            // showTopNotification('❌ Error al exportar', 'error');
        }
    }

    function resetConfiguration() {
        if (confirm('¿Restaurar configuración por defecto?\n\nEsto eliminará todas las personalizaciones incluyendo sprites y música.')) {
            if (musicPlayerInstance) {
                musicPlayerInstance.destroy();
                musicPlayerInstance = null;
            }

            spritesManager.removeCustomSprites();

            config = JSON.parse(JSON.stringify(defaultConfig));
            GM_setValue('redKingConfig242', config);
            // showTopNotification('🔄 Configuración restaurada', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    }

    function showAdvancedNotification(message, type = 'info', duration = 3000) {
        // Función de notificación avanzada deshabilitada - no hace nada
        return;
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            const key = e.key.toLowerCase();

            if (e.ctrlKey || e.altKey || e.metaKey) {
                return;
            }

            switch (key) {
                case 'f':
                    e.preventDefault();
                    flipBoardAction();
                    break;
                case 'a':
                    e.preventDefault();
                    openAnalysis();
                    break;
                case 'p':
                    e.preventDefault();
                    togglePanel();
                    break;
                case 'c':
                    e.preventDefault();
                    toggleChatVisibility();
                    break;
            }
        });
    }

    function togglePanel() {
        const panel = document.getElementById('redKingPanel');
        if (panel) {
            if (panel.style.display === 'none' || panel.style.opacity === '0') {
                // Mostrar panel con animación y sonido
                if (soundSystem) soundSystem.playUISound('panelShow');

                panel.style.display = 'block';
                panel.style.transform = 'scale(0.8)';
                panel.style.opacity = '0';

                requestAnimationFrame(() => {
                    panel.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
                    panel.style.transform = 'scale(1)';
                    panel.style.opacity = '1';
                });

                config.panelVisible = true;
                GM_setValue('redKingConfig242', config);
            } else {
                // Ocultar panel con animación y sonido
                if (soundSystem) soundSystem.playUISound('panelHide');

                panel.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                panel.style.transform = 'scale(0.9)';
                panel.style.opacity = '0';

                setTimeout(() => {
                    panel.style.display = 'none';
                }, 200);

                config.panelVisible = false;
                GM_setValue('redKingConfig242', config);
            }
        } else {
            // Crear panel con sonido de mostrar
            if (soundSystem) soundSystem.playUISound('panelShow');

            createPanel();
            // Si se crea con "P" cuando no existía, marcar como visible y guardar
            config.panelVisible = true;
            GM_setValue('redKingConfig242', config);
        }
    }

    function addCustomStyles() {
        GM_addStyle(`
            .tab-btn {
                flex: 1;
                padding: 12px 6px;
                text-align: center;
                cursor: pointer;
                font-size: 10px;
                border-right: 1px solid #444;
                transition: all 0.3s;
                background: #3a3a3a;
                color: #ccc;
            }

            .tab-btn:last-child {
                border-right: none;
            }

            .action-btn, .music-btn {
                background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%) !important;
                border: none !important;
                color: white !important;
                padding: 10px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                width: 100% !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
            }

            .music-btn {
                width: auto !important;
                padding: 8px 12px !important;
                font-size: 14px !important;
                margin: 2px !important;
            }

            .action-btn:hover, .music-btn:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
                background: linear-gradient(135deg, #DC143C 0%, #8B0000 100%) !important;
            }

            .social-btn {
                background: linear-gradient(135deg, #4a4a4a 0%, #6a6a6a 100%) !important;
                border: none !important;
                color: white !important;
                padding: 12px 20px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                width: 100% !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
                margin: 4px 0 !important;
            }

            .discord-btn:hover {
                background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%) !important;
                transform: translateY(-1px) !important;
            }

            .github-btn:hover {
                background: linear-gradient(135deg, #333 0%, #24292e 100%) !important;
                transform: translateY(-1px) !important;
            }

            .toggle-switch {
                position: relative !important;
                display: inline-block !important;
                width: 44px !important;
                height: 22px !important;
            }

            .toggle-switch input {
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
            }

            .toggle-slider {
                position: absolute !important;
                cursor: pointer !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background-color: #333 !important;
                transition: 0.3s !important;
                border-radius: 22px !important;
            }

            .toggle-slider:before {
                position: absolute !important;
                content: "" !important;
                height: 16px !important;
                width: 16px !important;
                left: 3px !important;
                bottom: 3px !important;
                background-color: white !important;
                transition: 0.3s !important;
                border-radius: 50% !important;
            }

            input:checked + .toggle-slider {
                background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%) !important;
            }

            input:checked + .toggle-slider:before {
                transform: translateX(22px) !important;
            }

            #redKingPanel *::-webkit-scrollbar {
                width: 6px !important;
            }

            #redKingPanel *::-webkit-scrollbar-track {
                background: #2a2a2a !important;
            }

            #redKingPanel *::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%) !important;
                border-radius: 3px !important;
            }

            kbd {
                background: #333 !important;
                border: 1px solid #555 !important;
                border-radius: 3px !important;
                color: #FFD700 !important;
                padding: 1px 4px !important;
                font-size: 10px !important;
                font-family: monospace !important;
                margin: 0 1px !important;
            }
        `);
    }

    // Función de inicialización principal
    function initialize() {
        console.log('🔴♔ Inicializando Red King v2.4.2...');

        addCustomStyles();

        setTimeout(() => {
            try {
                // Solo crear el panel si debe estar visible
                if (config.panelVisible) {
                    const panel = createPanel();
                    if (panel) {
                        console.log('✅ Panel v2.4.2 creado exitosamente');
                    }
                } else {
                    console.log('ℹ️ Panel oculto según configuración guardada');
                }

                setTimeout(() => {
                    setupKeyboardShortcuts();

                    // Inicializar sistema de sonidos
                    if (!soundSystem) {
                        soundSystem = new EnhancedSoundSystem();
                        console.log('🔊 Sistema de sonidos inicializado');
                    }

                    // CRÍTICO: Solo aplicar tema para opciones EXPLÍCITAMENTE activadas por el usuario
                    console.log('🔍 Verificando opciones para aplicar tema:', {
                        boardEffects: config.boardEffects,
                        buttonColors: config.buttonColors.enabled,
                        customSprites: config.customSprites.enabled,
                        soundEnabled: config.soundEnabled
                    });

                    let hasActiveOptions = false;
                    if (config.boardEffects === true ||
                        config.buttonColors.enabled === true || config.customSprites.enabled === true ||
                        config.soundEnabled === true) {
                        hasActiveOptions = true;
                        applyCustomTheme();
                        console.log('✅ Tema aplicado para opciones activas');
                    } else {
                        console.log('ℹ️ No hay opciones activas, no se aplica tema');
                    }

                    // Activar sonidos si estaba habilitado previamente
                    if (config.soundEnabled) {
                        toggleSounds(true);
                    }

                    // Activar mejoras visuales
                    if (config.enhancedAnimations) toggleEnhancedAnimations(true);

                    console.log('✅ Red King v2.4.2 completamente iniciado');
                }, 500);
            } catch (error) {
                console.error('Error al inicializar Red King v2.4.2:', error);
                // showTopNotification('❌ Error al iniciar Red King', 'error');
            }
        }, 1000);
    }

    // Manejar cambios de página
    let currentUrl = window.location.href;
    function handlePageChange() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log('🔄 Página cambiada, re-aplicando estilos...');

            setTimeout(() => {
                if (config.boardEffects || config.buttonColors.enabled || config.customSprites.enabled) {
                    applyCustomTheme();
                }
                // Re-inicializar sistemas visuales después de cambio de página
                if (config.enhancedAnimations) toggleEnhancedAnimations(true);
            }, 1000);
        }
    }

    // Observer para cambios en la página
    const observer = new MutationObserver(handlePageChange);
    observer.observe(document.body, { childList: true, subtree: true });

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Backup de inicialización
    setTimeout(() => {
        if (!document.getElementById('redKingPanel')) {
            console.log('🔄 Backup: Re-inicializando Red King v2.4.2...');
            initialize();
        }
    }, 5000);

    console.log('🔴♔ Red King v2.4.2 cargado exitosamente');
})();
