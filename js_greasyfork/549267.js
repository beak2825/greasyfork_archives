// ==UserScript==
// @name         Enhanced Video Speed Controller
// @name:zh-CN   增强视频速度控制器
// @name:zh-TW   增強影片速度控制器
// @name:ja      拡張ビデオスピードコントローラー
// @name:ko      향상된 비디오 속도 컨트롤러
// @name:es      Controlador de Velocidad de Video Mejorado
// @name:fr      Contrôleur de Vitesse Vidéo Amélioré
// @name:de      Erweiterte Video-Geschwindigkeitskontrolle
// @name:pt      Controlador de Velocidade de Vídeo Aprimorado
// @name:pt-BR   Controlador de Velocidade de Vídeo Aprimorado
// @name:ru      Расширенный Контроллер Скорости Видео
// @name:it      Controllore di Velocità Video Avanzato
// @name:nl      Verbeterde Video Snelheidscontroller
// @name:ar      تحكم محسن في سرعة الفيديو
// @name:hi      उन्नत वीडियो गति नियंत्रक
// @name:th      ตัวควบคุมความเร็ววิดีโอขั้นสูง
// @name:vi      Bộ Điều Khiển Tốc Độ Video Nâng Cao
// @name:id      Pengontrol Kecepatan Video Tingkat Lanjut
// @name:tr      Gelişmiş Video Hız Kontrolcüsü
// @name:pl      Zaawansowany Kontroler Prędkości Wideo
// @name:cs      Pokročilý Ovladač Rychlosti Videa
// @name:hu      Fejlett Videó Sebesség Vezérlő
// @name:sv      Avancerad Videohastighetscontroller
// @name:da      Avanceret Videohastigheds Controller
// @name:no      Avansert Videohastighets Kontroller
// @name:fi      Edistynyt Videonopeus Ohjain
// @name:he      בקר מהירות וידאו מתקדם
// @name:fa      کنترل کننده پیشرفته سرعت ویدیو
// @name:uk      Розширений Контролер Швидкості Відео
// @name:bg      Разширен Контролер на Скоростта на Видеото
// @name:ro      Controler Avansat de Viteză Video
// @name:hr      Napredni Kontroler Brzine Videa
// @name:sk      Pokročilý Ovládač Rýchlosti Videa
// @name:sl      Napreden Nadzornik Hitrosti Videa
// @name:et      Täiustatud Video Kiiruse Kontroller
// @name:lv      Uzlabots Video Ātruma Kontrolieris
// @name:lt      Išplėstinis Vaizdo Įrašo Greičio Valdiklis
// @name:el      Προηγμένος Ελεγκτής Ταχύτητας Βίντεο
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Universal video speed control for HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube, and more with intelligent detection
// @description:zh-CN  为HTML5、Video.js、JW Player、Plyr、HLS.js、YouTube等提供通用视频速度控制，具有智能检测功能
// @description:zh-TW  為HTML5、Video.js、JW Player、Plyr、HLS.js、YouTube等提供通用影片速度控制，具有智慧檢測功能
// @description:ja     HTML5、Video.js、JW Player、Plyr、HLS.js、YouTubeなどに対応したインテリジェント検出機能付きユニバーサル動画速度制御
// @description:ko     HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube 등을 위한 지능형 감지 기능이 있는 범용 비디오 속도 제어
// @description:es     Control universal de velocidad de video para HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube y más con detección inteligente
// @description:fr     Contrôle universel de vitesse vidéo pour HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube et plus avec détection intelligente
// @description:de     Universelle Videogeschwindigkeitskontrolle für HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube und mehr mit intelligenter Erkennung
// @description:pt     Controle universal de velocidade de vídeo para HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube e mais com detecção inteligente
// @description:pt-BR  Controle universal de velocidade de vídeo para HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube e mais com detecção inteligente
// @description:ru     Универсальное управление скоростью видео для HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube и других с интеллектуальным обнаружением
// @description:it     Controllo universale della velocità video per HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube e altri con rilevamento intelligente
// @description:nl     Universele videosnelheidscontrole voor HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube en meer met intelligente detectie
// @description:ar     تحكم عالمي في سرعة الفيديو لـ HTML5، Video.js، JW Player، Plyr، HLS.js، YouTube والمزيد مع الكشف الذكي
// @description:hi     HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube और अन्य के लिए बुद्धिमान पहचान के साथ सार्वभौमिक वीडियो गति नियंत्रण
// @description:th     การควบคุมความเร็ววิดีโอสากลสำหรับ HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube และอื่น ๆ พร้อมการตรวจจับอัจฉริยะ
// @description:vi     Điều khiển tốc độ video phổ quát cho HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube và nhiều hơn nữa với tính năng phát hiện thông minh
// @description:id     Kontrol kecepatan video universal untuk HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube dan lainnya dengan deteksi cerdas
// @description:tr     HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube ve daha fazlası için akıllı algılamalı evrensel video hız kontrolü
// @description:pl     Uniwersalna kontrola prędkości wideo dla HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube i innych z inteligentnym wykrywaniem
// @description:cs     Univerzální ovládání rychlosti videa pro HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube a další s inteligentní detekcí
// @description:hu     Univerzális videó sebesség vezérlés HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube és mások számára intelligens felismeréssel
// @description:sv     Universell videohastighetscontrol för HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube och mer med intelligent upptäckt
// @description:da     Universal videohastigheds kontrol for HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube og mere med intelligent detektering
// @description:no     Universell videohastighets kontroll for HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube og mer med intelligent deteksjon
// @description:fi     Universaali videonopeus hallinta HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube ja muille älykkäällä tunnistuksella
// @description:he     בקרת מהירות וידאו אוניברסלית עבור HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube ועוד עם זיהוי חכם
// @description:fa     کنترل سرعت ویدیوی جهانی برای HTML5، Video.js، JW Player، Plyr، HLS.js، YouTube و بیشتر با تشخیص هوشمند
// @description:uk     Універсальне керування швидкістю відео для HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube та інших з інтелектуальним виявленням
// @description:bg     Универсален контрол на скоростта на видеото за HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube и други с интелигентно откриване
// @description:ro     Control universal al vitezei video pentru HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube și altele cu detecție inteligentă
// @description:hr     Univerzalna kontrola brzine videa za HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube i ostalo s inteligentnim otkrivanjem
// @description:sk     Univerzálne ovládanie rýchlosti videa pre HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube a ďalšie s inteligentnou detekciou
// @description:sl     Univerzalen nadzor hitrosti videa za HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube in druge z inteligentnim zaznavanjem
// @description:et     Universaalne video kiiruse kontroll HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube ja teiste jaoks nutika tuvastamisega
// @description:lv     Universāla video ātruma kontrole HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube un citiem ar inteliģentu noteikšanu
// @description:lt     Universalus vaizdo įrašo greičio valdymas HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube ir kitiems su protingu aptikimu
// @description:el     Καθολικός έλεγχος ταχύτητας βίντεο για HTML5, Video.js, JW Player, Plyr, HLS.js, YouTube και άλλα με έξυπνη ανίχνευση
// @author       aspen138 (using Claude code)
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB60lEQVRoge2arY7bQBSFv4yLLBUtsdYkpHQNQhYUGJeW+gEiBZQZ7RMsW2mBH8Bly/YFDAJDHGpi4sgkqJLZqAW206jNun93OmtpPmQwss8Zn7lzR5oFwHq9Dj3Puwdi4JrXzQEotNZplmXNYhBfAle2lf0hR611pIaZn5t4gCvP8+7VEJu5EqsZZH6Ka2Vbwb/iDNjGGbCNM2AbZ8A2zoBtZm/gjcRLkrtHbgPoqifSh2JqJHePtwR0VE8pk0N/E5E/kNctAH4YTffmyZIAoGsoBcQjFqF8S9UBfkg04SBZBgB0TYmQfqk1UFA2HeDz7n3ywpiEXn/LXiI7A2KLuCgbOoBgyUULY3zamlzqo6JVqChpegcsLzgY49PWkvJFy+gYIwh+cvA9PsL6ZfeBF2NkKD6Ib2TFA/uWH2IU8+kmADqqrbR8AzvxuCecYhRHhL5s7T9HvpXIa/qf0McojkJ84dp/joFeKKc+xSgm6qefxsT0m2rmTjG6+dDHp92L9D2XMNONjjHyfXwDtf8cQ+10zrbqhmf52n/OYrPZfDX3evPM/kDjDNjGGbCNM2AbZ8A2zoBt1HD3YK4cFBg5KP0vCqW1ToGjbSV/wVFrnXq73e7LarX6rJQKhksfb20r+wUH4Flr/THLsuYbF5+Zis2FqgMAAAAASUVORK5CYII=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549267/Enhanced%20Video%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/549267/Enhanced%20Video%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        version: '1.1.1',
        defaultSpeed: 1.0,
        speedPresets: [0.5, 0.75, 1, 1.25, 1.5, 2],
        minSpeed: 0.25,
        maxSpeed: 4.0,
        speedStep: 0.25,
        detectionDelay: 1000,
        retryDelay: 500,
        persistKey: 'videoSpeedController',
        uiPosition: { right: '20px', top: '20px' }
    };

    // Enhanced Video Speed Manager Class
    class EnhancedVideoSpeedManager {
        constructor() {
            this.detectedPlayers = [];
            this.currentSpeed = CONFIG.defaultSpeed;
            this.isInitialized = false;
            this.contentObserver = null;
            this.detectionTimer = null;
            this.ui = null;
            this.isUIHidden = true; // Start hidden by default

            // Player type definitions and detection patterns
            this.playerTypes = {
                HTML5: { selector: 'video', priority: 1, name: 'HTML5 Video' },
                VIDEOJS: { selector: '.video-js', priority: 3, name: 'Video.js' },
                JWPLAYER: { selector: '.jw-video, .jwplayer', priority: 3, name: 'JW Player' },
                PLYR: { selector: '.plyr', priority: 2, name: 'Plyr' },
                HLSJS: { selector: 'video[src*=".m3u8"], video[data-hls]', priority: 2, name: 'HLS.js' },
                YOUTUBE: { selector: '#movie_player, .html5-video-player', priority: 4, name: 'YouTube' },
                VIMEO: { selector: '.vp-player, [data-vimeo-player]', priority: 4, name: 'Vimeo' },
                TWITCH: { selector: '.video-player, [data-a-target="video-player"]', priority: 4, name: 'Twitch' }
            };

            this.init();
        }

        async init() {
            console.log('Enhanced Video Speed Controller: Initializing...');

            // Load saved settings
            await this.loadSettings();

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            // Create UI
            this.createUI();

            // Initial player detection
            this.detectAllPlayers();

            // Set up observers and event listeners
            this.setupContentObserver();
            this.setupKeyboardShortcuts();
            this.setupMenuCommands();

            // Apply saved speed
            if (this.currentSpeed !== CONFIG.defaultSpeed) {
                setTimeout(() => this.setAllPlayersSpeed(this.currentSpeed), CONFIG.detectionDelay);
            }

            this.isInitialized = true;
            console.log('Enhanced Video Speed Controller: Initialization complete');
        }

        // Player Detection System
        detectAllPlayers() {
            console.log('Enhanced Video Speed Controller: Scanning for video players...');

            this.detectedPlayers = [];

            Object.keys(this.playerTypes).forEach(playerType => {
                const players = this.detectPlayerType(playerType);
                this.detectedPlayers.push(...players);
            });

            // Sort by priority (higher priority first)
            this.detectedPlayers.sort((a, b) => b.priority - a.priority);

            const playerSummary = this.getPlayerSummary();
            console.log('Enhanced Video Speed Controller: Detected players:', playerSummary);

            // Update UI
            this.updateUI();

            return this.detectedPlayers;
        }

        detectPlayerType(playerType) {
            const config = this.playerTypes[playerType];
            const elements = document.querySelectorAll(config.selector);
            const players = [];

            elements.forEach((element, index) => {
                const player = this.createPlayerInstance(playerType, element, index);
                if (player) {
                    players.push(player);
                }
            });

            if (players.length > 0) {
                console.log(`Enhanced Video Speed Controller: Found ${players.length} ${playerType} player(s)`);
            }

            return players;
        }

        createPlayerInstance(type, element, index) {
            const basePlayer = {
                type,
                element,
                index,
                id: `${type}_${index}`,
                priority: this.playerTypes[type].priority,
                name: this.playerTypes[type].name,
                currentSpeed: CONFIG.defaultSpeed
            };

            switch (type) {
                case 'HTML5': return this.createHTML5Player(basePlayer);
                case 'VIDEOJS': return this.createVideoJSPlayer(basePlayer);
                case 'JWPLAYER': return this.createJWPlayer(basePlayer);
                case 'PLYR': return this.createPlyrPlayer(basePlayer);
                case 'HLSJS': return this.createHLSJSPlayer(basePlayer);
                case 'YOUTUBE': return this.createYouTubePlayer(basePlayer);
                case 'VIMEO': return this.createVimeoPlayer(basePlayer);
                case 'TWITCH': return this.createTwitchPlayer(basePlayer);
                default: return null;
            }
        }

        // Player Type Implementations
        createHTML5Player(basePlayer) {
            const video = basePlayer.element;
            if (!(video instanceof HTMLVideoElement)) return null;

            return {
                ...basePlayer,
                setSpeed: (speed) => {
                    try {
                        video.playbackRate = speed;
                        basePlayer.currentSpeed = speed;
                        return true;
                    } catch (error) {
                        console.error(`Enhanced Video Speed Controller: HTML5 speed error:`, error);
                        return false;
                    }
                },
                getSpeed: () => video.playbackRate || CONFIG.defaultSpeed,
                isReady: () => video.readyState >= 1
            };
        }

        createVideoJSPlayer(basePlayer) {
            const container = basePlayer.element;
            let vjsPlayer = null;

            // Try multiple methods to get Video.js instance
            if (typeof videojs !== 'undefined') {
                try {
                    vjsPlayer = videojs(container);
                } catch (e) {
                    // Fallback methods
                    vjsPlayer = container.player || window.videojs?.getPlayer?.(container);
                }
            }

            // Fallback to HTML5 if Video.js API not available
            const videoElement = container.querySelector('video');
            if (!vjsPlayer && videoElement) {
                return this.createHTML5Player({ ...basePlayer, element: videoElement, type: 'HTML5_VIDEOJS_FALLBACK' });
            }

            if (!vjsPlayer) return null;

            return {
                ...basePlayer,
                vjsInstance: vjsPlayer,
                setSpeed: (speed) => {
                    try {
                        if (vjsPlayer.playbackRate) {
                            vjsPlayer.playbackRate(speed);
                        } else if (vjsPlayer.tech_?.el_) {
                            vjsPlayer.tech_.el_.playbackRate = speed;
                        }
                        basePlayer.currentSpeed = speed;
                        return true;
                    } catch (error) {
                        console.error(`Enhanced Video Speed Controller: Video.js speed error:`, error);
                        return false;
                    }
                },
                getSpeed: () => {
                    try {
                        return vjsPlayer.playbackRate ? vjsPlayer.playbackRate() : CONFIG.defaultSpeed;
                    } catch (e) {
                        return CONFIG.defaultSpeed;
                    }
                },
                isReady: () => {
                    try {
                        return vjsPlayer.readyState() >= 1;
                    } catch (e) {
                        return true;
                    }
                }
            };
        }

        createJWPlayer(basePlayer) {
            const container = basePlayer.element;
            let jwPlayer = null;

            if (typeof jwplayer !== 'undefined') {
                try {
                    jwPlayer = jwplayer(container);
                } catch (e) {
                    // Try alternative detection
                    jwPlayer = container.jwplayer || window.jwplayer?.getPlayer?.(container);
                }
            }

            // Fallback to HTML5
            const videoElement = container.querySelector('video');
            if (!jwPlayer && videoElement) {
                return this.createHTML5Player({ ...basePlayer, element: videoElement, type: 'HTML5_JW_FALLBACK' });
            }

            if (!jwPlayer) return null;

            return {
                ...basePlayer,
                jwInstance: jwPlayer,
                setSpeed: (speed) => {
                    try {
                        if (jwPlayer.setPlaybackRate) {
                            jwPlayer.setPlaybackRate(speed);
                        } else if (jwPlayer.getContainer) {
                            const video = jwPlayer.getContainer().querySelector('video');
                            if (video) video.playbackRate = speed;
                        }
                        basePlayer.currentSpeed = speed;
                        return true;
                    } catch (error) {
                        console.error(`Enhanced Video Speed Controller: JW Player speed error:`, error);
                        return false;
                    }
                },
                getSpeed: () => {
                    try {
                        return jwPlayer.getPlaybackRate ? jwPlayer.getPlaybackRate() : CONFIG.defaultSpeed;
                    } catch (e) {
                        return CONFIG.defaultSpeed;
                    }
                },
                isReady: () => {
                    try {
                        return jwPlayer.getState && jwPlayer.getState() !== 'idle';
                    } catch (e) {
                        return true;
                    }
                }
            };
        }

        createPlyrPlayer(basePlayer) {
            const container = basePlayer.element;
            const plyrPlayer = container.plyr;

            // Fallback to HTML5
            const videoElement = container.querySelector('video');
            if (!plyrPlayer && videoElement) {
                return this.createHTML5Player({ ...basePlayer, element: videoElement, type: 'HTML5_PLYR_FALLBACK' });
            }

            if (!plyrPlayer) return null;

            return {
                ...basePlayer,
                plyrInstance: plyrPlayer,
                setSpeed: (speed) => {
                    try {
                        if (plyrPlayer.speed) {
                            plyrPlayer.speed = speed;
                        } else if (plyrPlayer.media) {
                            plyrPlayer.media.playbackRate = speed;
                        }
                        basePlayer.currentSpeed = speed;
                        return true;
                    } catch (error) {
                        console.error(`Enhanced Video Speed Controller: Plyr speed error:`, error);
                        return false;
                    }
                },
                getSpeed: () => {
                    try {
                        return plyrPlayer.speed || plyrPlayer.media?.playbackRate || CONFIG.defaultSpeed;
                    } catch (e) {
                        return CONFIG.defaultSpeed;
                    }
                },
                isReady: () => plyrPlayer.ready
            };
        }

        createHLSJSPlayer(basePlayer) {
            // HLS.js uses standard HTML5 video elements
            return this.createHTML5Player({ ...basePlayer, type: 'HLSJS_HTML5' });
        }

        createYouTubePlayer(basePlayer) {
            const container = basePlayer.element;

            return {
                ...basePlayer,
                setSpeed: (speed) => {
                    const video = container.querySelector('video');
                    if (video) {
                        try {
                            video.playbackRate = speed;
                            basePlayer.currentSpeed = speed;
                            return true;
                        } catch (error) {
                            console.error(`Enhanced Video Speed Controller: YouTube speed error:`, error);
                            return false;
                        }
                    }
                    return false;
                },
                getSpeed: () => {
                    const video = container.querySelector('video');
                    return video ? video.playbackRate || CONFIG.defaultSpeed : CONFIG.defaultSpeed;
                },
                isReady: () => true
            };
        }

        createVimeoPlayer(basePlayer) {
            const container = basePlayer.element;

            return {
                ...basePlayer,
                setSpeed: (speed) => {
                    const video = container.querySelector('video');
                    if (video) {
                        try {
                            video.playbackRate = speed;
                            basePlayer.currentSpeed = speed;
                            return true;
                        } catch (error) {
                            console.error(`Enhanced Video Speed Controller: Vimeo speed error:`, error);
                            return false;
                        }
                    }
                    return false;
                },
                getSpeed: () => {
                    const video = container.querySelector('video');
                    return video ? video.playbackRate || CONFIG.defaultSpeed : CONFIG.defaultSpeed;
                },
                isReady: () => true
            };
        }

        createTwitchPlayer(basePlayer) {
            const container = basePlayer.element;

            return {
                ...basePlayer,
                setSpeed: (speed) => {
                    const video = container.querySelector('video');
                    if (video) {
                        try {
                            video.playbackRate = speed;
                            basePlayer.currentSpeed = speed;
                            return true;
                        } catch (error) {
                            console.error(`Enhanced Video Speed Controller: Twitch speed error:`, error);
                            return false;
                        }
                    }
                    return false;
                },
                getSpeed: () => {
                    const video = container.querySelector('video');
                    return video ? video.playbackRate || CONFIG.defaultSpeed : CONFIG.defaultSpeed;
                },
                isReady: () => true
            };
        }

        // Content Observer for Dynamic Detection
        setupContentObserver() {
            this.contentObserver = new MutationObserver((mutations) => {
                let shouldDetect = false;

                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const hasVideo = node.tagName === 'VIDEO' ||
                                           node.querySelector && Object.values(this.playerTypes).some(type =>
                                               node.querySelector(type.selector)
                                           );

                            if (hasVideo) {
                                shouldDetect = true;
                            }
                        }
                    });
                });

                if (shouldDetect) {
                    clearTimeout(this.detectionTimer);
                    this.detectionTimer = setTimeout(() => {
                        console.log('Enhanced Video Speed Controller: New content detected, re-scanning...');
                        this.detectAllPlayers();
                    }, CONFIG.retryDelay);
                }
            });

            this.contentObserver.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'id']
            });
        }

        // Speed Control Methods
        setAllPlayersSpeed(speed, forceRedetect = false) {
            if (isNaN(speed) || speed <= 0 || speed > 10) {
                console.error('Enhanced Video Speed Controller: Invalid speed value:', speed);
                return false;
            }

            this.currentSpeed = speed;
            let successCount = 0;

            // If forced redetect or no players, detect first
            if (forceRedetect || this.detectedPlayers.length === 0) {
                this.detectAllPlayers();
            }

            this.detectedPlayers.forEach(player => {
                try {
                    if (player.setSpeed && player.setSpeed(speed)) {
                        successCount++;
                    }
                } catch (error) {
                    console.error(`Enhanced Video Speed Controller: Failed to set speed for ${player.type}:`, error);
                }
            });

            console.log(`Enhanced Video Speed Controller: Set speed to ${speed}x for ${successCount}/${this.detectedPlayers.length} players`);

            // Update UI
            this.updateUI();

            // Save settings
            this.saveSettings();

            // Re-detect and apply to new players with retry logic
            setTimeout(() => {
                this.detectAllPlayers();
                this.detectedPlayers.forEach(player => {
                    if (player.currentSpeed !== speed && player.setSpeed) {
                        player.setSpeed(speed);
                    }
                });
            }, CONFIG.retryDelay);

            return successCount > 0;
        }

        // Force apply current speed to all players (useful after URL changes)
        forceApplyCurrentSpeed() {
            console.log(`Enhanced Video Speed Controller: Force applying current speed ${this.currentSpeed}x`);
            return this.setAllPlayersSpeed(this.currentSpeed, true);
        }

        adjustSpeed(delta) {
            const newSpeed = Math.max(CONFIG.minSpeed, Math.min(CONFIG.maxSpeed, this.currentSpeed + delta));
            this.setAllPlayersSpeed(parseFloat(newSpeed.toFixed(2)));
        }

        resetSpeed() {
            this.setAllPlayersSpeed(CONFIG.defaultSpeed);
        }

        // UI Creation and Management
        createUI() {
            if (this.ui) return;

            // Create main container
            this.ui = document.createElement('div');
            this.ui.id = 'enhanced-video-speed-controller';
            this.ui.innerHTML = `
                <div class="evsc-header">
                    <span class="evsc-title">Video Speed</span>
                    <div class="evsc-header-buttons">
                        <button class="evsc-hide" title="Hide (Press H to show/hide)">⚊</button>
                        <button class="evsc-toggle" title="Collapse/Expand">−</button>
                    </div>
                </div>
                <div class="evsc-content">
                    <div class="evsc-current-speed">
                        <span>Current: </span>
                        <span class="evsc-speed-value">${this.currentSpeed}x</span>
                    </div>
                    <div class="evsc-player-info">
                        <span class="evsc-player-count">0 players</span>
                    </div>
                    <div class="evsc-presets">
                        ${CONFIG.speedPresets.map(speed =>
                            `<button class="evsc-preset-btn" data-speed="${speed}" ${speed === CONFIG.defaultSpeed ? 'data-active="true"' : ''}>${speed}x</button>`
                        ).join('')}
                    </div>
                    <div class="evsc-slider-container">
                        <input type="range" class="evsc-slider" min="${CONFIG.minSpeed}" max="${CONFIG.maxSpeed}" step="0.05" value="${this.currentSpeed}">
                        <div class="evsc-slider-labels">
                            <span>${CONFIG.minSpeed}x</span>
                            <span>${CONFIG.maxSpeed}x</span>
                        </div>
                    </div>
                    <div class="evsc-custom-speed">
                        <input type="number" class="evsc-custom-input" placeholder="Custom speed" min="0.1" max="10" step="0.1">
                        <button class="evsc-apply-btn">Apply</button>
                    </div>
                    <div class="evsc-controls">
                        <button class="evsc-control-btn" data-action="decrease">− Slower</button>
                        <button class="evsc-control-btn" data-action="reset">Reset</button>
                        <button class="evsc-control-btn" data-action="increase">+ Faster</button>
                    </div>
                    <div class="evsc-player-details">
                        <details class="evsc-details">
                            <summary>Player Details</summary>
                            <div class="evsc-player-list"></div>
                        </details>
                    </div>
                </div>
            `;

            document.body.appendChild(this.ui);

            // Apply initial hidden state
            if (this.isUIHidden) {
                this.ui.classList.add('evsc-hidden');
            }

            this.addStyles();
            this.setupUIEventListeners();
        }

        addStyles() {
            GM_addStyle(`
                #enhanced-video-speed-controller {
                    position: fixed;
                    top: ${CONFIG.uiPosition.top};
                    right: ${CONFIG.uiPosition.right};
                    width: 280px;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    border-radius: 8px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 13px;
                    z-index: 999999;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }

                #enhanced-video-speed-controller.evsc-collapsed .evsc-content {
                    display: none;
                }

                #enhanced-video-speed-controller.evsc-hidden {
                    display: none;
                }

                .evsc-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: rgba(0, 122, 204, 0.8);
                    border-radius: 8px 8px 0 0;
                    cursor: move;
                }

                .evsc-title {
                    font-weight: 600;
                    font-size: 14px;
                }

                .evsc-header-buttons {
                    display: flex;
                    gap: 4px;
                }

                .evsc-hide,
                .evsc-toggle {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                }

                .evsc-toggle:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .evsc-content {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .evsc-current-speed {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                }

                .evsc-speed-value {
                    font-weight: 600;
                    color: #4da6ff;
                }

                .evsc-player-info {
                    text-align: center;
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.7);
                    padding: 4px;
                }

                .evsc-presets {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 6px;
                }

                .evsc-preset-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s ease;
                }

                .evsc-preset-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: #4da6ff;
                }

                .evsc-preset-btn[data-active="true"] {
                    background: #4da6ff;
                    border-color: #4da6ff;
                    color: white;
                }

                .evsc-slider-container {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .evsc-slider {
                    width: 100%;
                    height: 4px;
                    border-radius: 2px;
                    background: rgba(255, 255, 255, 0.2);
                    outline: none;
                    cursor: pointer;
                    -webkit-appearance: none;
                    appearance: none;
                }

                .evsc-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #4da6ff;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .evsc-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #4da6ff;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .evsc-slider-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.6);
                }

                .evsc-custom-speed {
                    display: flex;
                    gap: 8px;
                }

                .evsc-custom-input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 6px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                }

                .evsc-custom-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .evsc-custom-input:focus {
                    outline: none;
                    border-color: #4da6ff;
                }

                .evsc-apply-btn {
                    background: #4da6ff;
                    border: none;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background-color 0.2s ease;
                }

                .evsc-apply-btn:hover {
                    background: #3d8bd1;
                }

                .evsc-controls {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 6px;
                }

                .evsc-control-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 8px 6px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s ease;
                }

                .evsc-control-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: #4da6ff;
                }

                .evsc-control-btn[data-action="reset"] {
                    border-color: #28a745;
                    color: #28a745;
                }

                .evsc-control-btn[data-action="reset"]:hover {
                    background: #28a745;
                    color: white;
                }

                .evsc-details {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 8px;
                }

                .evsc-details summary {
                    cursor: pointer;
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.7);
                    padding: 4px 0;
                }

                .evsc-details[open] summary {
                    margin-bottom: 8px;
                }

                .evsc-player-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    max-height: 120px;
                    overflow-y: auto;
                }

                .evsc-player-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 4px 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                    font-size: 10px;
                }

                .evsc-player-name {
                    color: rgba(255, 255, 255, 0.8);
                }

                .evsc-player-speed {
                    color: #4da6ff;
                    font-weight: 600;
                }

                .evsc-no-players {
                    text-align: center;
                    color: rgba(255, 255, 255, 0.5);
                    font-style: italic;
                    padding: 8px;
                    font-size: 10px;
                }

                /* Draggable functionality */
                .evsc-dragging {
                    cursor: move;
                    user-select: none;
                }

                /* Scrollbar for player list */
                .evsc-player-list::-webkit-scrollbar {
                    width: 4px;
                }

                .evsc-player-list::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }

                .evsc-player-list::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                }

                .evsc-player-list::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `);
        }

        setupUIEventListeners() {
            if (!this.ui) return;

            // Hide UI
            const hideBtn = this.ui.querySelector('.evsc-hide');
            hideBtn.addEventListener('click', () => {
                this.toggleUI();
            });

            // Toggle UI (collapse/expand)
            const toggleBtn = this.ui.querySelector('.evsc-toggle');
            toggleBtn.addEventListener('click', () => {
                this.ui.classList.toggle('evsc-collapsed');
                toggleBtn.textContent = this.ui.classList.contains('evsc-collapsed') ? '+' : '−';
            });

            // Preset buttons
            this.ui.querySelectorAll('.evsc-preset-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const speed = parseFloat(e.target.dataset.speed);
                    this.setAllPlayersSpeed(speed);
                });
            });

            // Slider
            const slider = this.ui.querySelector('.evsc-slider');
            slider.addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                this.setAllPlayersSpeed(speed);
            });

            // Custom speed
            const customInput = this.ui.querySelector('.evsc-custom-input');
            const applyBtn = this.ui.querySelector('.evsc-apply-btn');

            const applyCustomSpeed = () => {
                const speed = parseFloat(customInput.value);
                if (!isNaN(speed) && speed > 0 && speed <= 10) {
                    this.setAllPlayersSpeed(speed);
                    customInput.value = '';
                }
            };

            applyBtn.addEventListener('click', applyCustomSpeed);
            customInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') applyCustomSpeed();
            });

            // Control buttons
            this.ui.querySelectorAll('.evsc-control-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.target.dataset.action;
                    switch (action) {
                        case 'decrease':
                            this.adjustSpeed(-CONFIG.speedStep);
                            break;
                        case 'increase':
                            this.adjustSpeed(CONFIG.speedStep);
                            break;
                        case 'reset':
                            this.resetSpeed();
                            break;
                    }
                });
            });

            // Make UI draggable
            this.makeDraggable();
        }

        makeDraggable() {
            const header = this.ui.querySelector('.evsc-header');
            let isDragging = false;
            let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('evsc-toggle') || e.target.classList.contains('evsc-hide')) return;

                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                    this.ui.classList.add('evsc-dragging');
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    this.ui.style.transform = `translate(${currentX}px, ${currentY}px)`;
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.ui.classList.remove('evsc-dragging');
                }
            });
        }

        updateUI() {
            if (!this.ui) return;

            // Update current speed display
            const speedValue = this.ui.querySelector('.evsc-speed-value');
            speedValue.textContent = `${this.currentSpeed}x`;

            // Update slider
            const slider = this.ui.querySelector('.evsc-slider');
            slider.value = this.currentSpeed;

            // Update preset button states
            this.ui.querySelectorAll('.evsc-preset-btn').forEach(btn => {
                const isActive = parseFloat(btn.dataset.speed) === this.currentSpeed;
                btn.setAttribute('data-active', isActive);
            });

            // Update player count
            const playerCount = this.ui.querySelector('.evsc-player-count');
            const summary = this.getPlayerSummary();
            const summaryText = Object.keys(summary).length > 0
                ? Object.entries(summary).map(([type, count]) => `${type}: ${count}`).join(', ')
                : 'No players detected';
            playerCount.textContent = `${this.detectedPlayers.length} players (${summaryText})`;

            // Update player details
            this.updatePlayerDetails();
        }

        updatePlayerDetails() {
            const playerList = this.ui.querySelector('.evsc-player-list');

            if (this.detectedPlayers.length === 0) {
                playerList.innerHTML = '<div class="evsc-no-players">No video players found</div>';
                return;
            }

            const playerItems = this.detectedPlayers.map(player => {
                const speedText = player.currentSpeed ? `${player.currentSpeed}x` : '1x';
                return `
                    <div class="evsc-player-item">
                        <span class="evsc-player-name">${player.name} #${player.index + 1}</span>
                        <span class="evsc-player-speed">${speedText}</span>
                    </div>
                `;
            }).join('');

            playerList.innerHTML = playerItems;
        }

        // UI Toggle Methods
        toggleUI() {
            // If trying to show UI, check if there are any video players
            if (this.isUIHidden) {
                // Re-detect players first
                this.detectAllPlayers();

                // If no players found, don't show UI
                if (this.detectedPlayers.length === 0) {
                    console.log('Enhanced Video Speed Controller: No video players found, UI will not be shown');
                    return;
                }
            }

            this.isUIHidden = !this.isUIHidden;
            if (this.isUIHidden) {
                this.ui.classList.add('evsc-hidden');
            } else {
                this.ui.classList.remove('evsc-hidden');
            }
        }

        showUI() {
            // Check if there are any video players before showing
            this.detectAllPlayers();

            if (this.detectedPlayers.length === 0) {
                console.log('Enhanced Video Speed Controller: No video players found, UI will not be shown');
                return false;
            }

            this.isUIHidden = false;
            this.ui.classList.remove('evsc-hidden');
            return true;
        }

        hideUI() {
            this.isUIHidden = true;
            this.ui.classList.add('evsc-hidden');
        }

        // Keyboard Shortcuts
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Only handle shortcuts when not typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') return;

                // Handle single key shortcuts
                switch (e.key.toLowerCase()) {
                    case 'h':
                        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                            e.preventDefault();
                            this.toggleUI();
                        }
                        break;
                    case 'd':
                        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                            e.preventDefault();
                            this.adjustSpeed(CONFIG.speedStep);
                        }
                        break;
                    case 's':
                        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                            e.preventDefault();
                            this.adjustSpeed(-CONFIG.speedStep);
                        }
                        break;
                }

                // Handle Ctrl/Cmd shortcuts
                if (e.ctrlKey || e.metaKey) {
                    switch (e.key) {
                        case ',':
                        case '<':
                            e.preventDefault();
                            this.adjustSpeed(-CONFIG.speedStep);
                            break;
                        case '.':
                        case '>':
                            e.preventDefault();
                            this.adjustSpeed(CONFIG.speedStep);
                            break;
                        case '0':
                            e.preventDefault();
                            this.resetSpeed();
                            break;
                    }
                }
            });
        }

        // Menu Commands
        setupMenuCommands() {
            GM_registerMenuCommand('Toggle Video Speed Controller UI', () => {
                this.toggleUI();
            });

            GM_registerMenuCommand('Show/Hide Speed Controller', () => {
                this.toggleUI();
            });

            GM_registerMenuCommand('Reset to Normal Speed', () => {
                this.resetSpeed();
            });

            GM_registerMenuCommand('Refresh Player Detection', () => {
                this.detectAllPlayers();
            });

            GM_registerMenuCommand('Force Apply Current Speed', () => {
                this.forceApplyCurrentSpeed();
            });
        }

        // Settings Persistence
        async loadSettings() {
            try {
                const saved = GM_getValue(CONFIG.persistKey, null);
                if (saved) {
                    const settings = JSON.parse(saved);
                    this.currentSpeed = settings.currentSpeed || CONFIG.defaultSpeed;
                }
            } catch (error) {
                console.error('Enhanced Video Speed Controller: Failed to load settings:', error);
            }
        }

        saveSettings() {
            try {
                const settings = {
                    currentSpeed: this.currentSpeed,
                    timestamp: Date.now()
                };
                GM_setValue(CONFIG.persistKey, JSON.stringify(settings));
            } catch (error) {
                console.error('Enhanced Video Speed Controller: Failed to save settings:', error);
            }
        }

        // Utility Methods
        getPlayerSummary() {
            return this.detectedPlayers.reduce((acc, player) => {
                const displayName = player.name || player.type;
                acc[displayName] = (acc[displayName] || 0) + 1;
                return acc;
            }, {});
        }
    }

    // Initialize the Enhanced Video Speed Manager
    let videoSpeedManager;

    function initializeManager() {
        if (!videoSpeedManager && document.body) {
            videoSpeedManager = new EnhancedVideoSpeedManager();
            console.log('Enhanced Video Speed Controller: UserScript loaded successfully');
        }
    }

    // Wait for DOM to be ready and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeManager);
    } else {
        setTimeout(initializeManager, 100);
    }

    // Handle SPA navigation and URL changes
    let lastUrl = location.href;

    function handleUrlChange() {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('Enhanced Video Speed Controller: URL change detected:', url);

            if (videoSpeedManager) {
                setTimeout(() => {
                    // Re-detect players
                    videoSpeedManager.detectAllPlayers();

                    // Automatically apply saved speed if it's not default
                    if (videoSpeedManager.currentSpeed !== CONFIG.defaultSpeed) {
                        console.log(`Enhanced Video Speed Controller: Auto-applying saved speed ${videoSpeedManager.currentSpeed}x after URL change`);
                        setTimeout(() => {
                            videoSpeedManager.forceApplyCurrentSpeed();
                        }, CONFIG.retryDelay);
                    }
                }, CONFIG.detectionDelay);
            }
        }
    }

    // Monitor for URL changes via multiple methods
    new MutationObserver(handleUrlChange).observe(document, { subtree: true, childList: true });

    // Also listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);

    // Also listen for pushstate/replacestate events (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(handleUrlChange, 50);
    };

    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        setTimeout(handleUrlChange, 50);
    };

})();