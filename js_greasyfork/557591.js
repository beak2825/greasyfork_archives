// ==UserScript==
// @name         Nexus Streaming: God Mode (Ultimate Suite)
// @namespace    https://github.com/NexusScriptworks/Streaming-God-Mode
// @version      5.0.0
// @description  Suite completa para streaming (YouTube, Twitch, Kick): Remove anúncios, amplifica áudio, captura de tela, PiP, controle de velocidade e modo cinema. Funciona de forma otimizada e leve.
// @author       Nexus Scriptworks (Marcello Edition)
// @match        *://*.youtube.com/*
// @match        *://music.youtube.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.kick.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @run-at       document-start
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/557591/Nexus%20Streaming%3A%20God%20Mode%20%28Ultimate%20Suite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557591/Nexus%20Streaming%3A%20God%20Mode%20%28Ultimate%20Suite%29.meta.js
// ==/UserScript==

/*
 * [LICENÇA MIT]
 * Copyright (c) 2025 Nexus Scriptworks
 */

(function() {
    'use strict';

    console.log('[NEXUS STREAMING] Inicializando Suite Universal v5.0...');

    // ==========================================
    // 1. CONFIGURAÇÃO & ESTADO (KERNEL)
    // ==========================================

    const CONFIG = {
        checkInterval: 500, // Ciclo de verificação em ms
        ui: {
            primary: '#00ff41', // Verde Cyberpunk
            bg: 'rgba(10, 10, 15, 0.95)',
            text: '#ececf1',
            alert: '#ff003c',
            grid: 'rgba(255, 255, 255, 0.05)'
        }
    };

    // Definição de estados iniciais
    const SETTINGS = {
        adBlock: GM_getValue('nexusAdBlock', true),
        bgPlay: GM_getValue('nexusBgPlay', true),
        autoClaim: GM_getValue('nexusAutoClaim', true),
        cinemaMode: GM_getValue('nexusCinemaMode', false),
        hideShorts: GM_getValue('nexusHideShorts', false),
        audioBoost: GM_getValue('nexusAudioBoost', false)
    };

    const STATE = {
        adsSkipped: 0,
        pointsClaimed: 0,
        audioContext: null,
        gainNode: null,
        videoElement: null,
        loopActive: false,
        currentPlatform: 'UNKNOWN'
    };

    // ==========================================
    // 2. UTILITÁRIOS (TOOLBOX)
    // ==========================================

    const Utils = {
        // Cria elementos DOM
        create: (tag, options = {}) => {
            const el = document.createElement(tag);
            if (options.text) el.textContent = options.text;
            if (options.html) el.innerHTML = options.html;
            if (options.className) el.className = options.className;
            if (options.style) Object.assign(el.style, options.style);
            if (options.attrs) Object.entries(options.attrs).forEach(([k, v]) => el.setAttribute(k, v));
            if (options.events) Object.entries(options.events).forEach(([k, v]) => el.addEventListener(k, v));
            if (options.id) el.id = options.id;
            return el;
        },

        // Notificações discretas
        toast: (msg, type = 'info') => {
            const color = type === 'alert' ? CONFIG.ui.alert : CONFIG.ui.primary;
            const el = Utils.create('div', {
                text: `[NEXUS] ${msg}`,
                style: {
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: color, color: '#000', padding: '6px 14px', borderRadius: '4px',
                    fontSize: '12px', fontWeight: 'bold', zIndex: 2147483647, 
                    boxShadow: `0 0 15px ${color}`, pointerEvents: 'none', fontFamily: 'monospace'
                }
            });
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 2500);
        },

        // Recuperação inteligente do vídeo principal (ignora thumbnails/previews)
        getVideo: () => {
            if (STATE.videoElement && STATE.videoElement.isConnected && !STATE.videoElement.ended) {
                return STATE.videoElement;
            }
            // Procura o maior vídeo visível na tela
            const videos = Array.from(document.querySelectorAll('video'));
            if (videos.length === 0) return null;
            
            // Se houver apenas um, é ele
            if (videos.length === 1) {
                STATE.videoElement = videos[0];
                return STATE.videoElement;
            }

            // Se houver múltiplos, pega o que tem maior área ou está tocando
            STATE.videoElement = videos.reduce((prev, curr) => {
                const rectPrev = prev.getBoundingClientRect();
                const rectCurr = curr.getBoundingClientRect();
                return (rectCurr.width * rectCurr.height > rectPrev.width * rectPrev.height) ? curr : prev;
            });
            
            return STATE.videoElement;
        }
    };

    // ==========================================
    // 3. MÓDULO DE MÍDIA GENÉRICO (TOOLS)
    // ==========================================

    const MediaTools = {
        screenshot: () => {
            const video = Utils.getVideo();
            if (!video) return Utils.toast('Vídeo não detectado', 'alert');

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            try {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    const title = document.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
                    a.href = url;
                    a.download = `NEXUS_${STATE.currentPlatform}_${title}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    Utils.toast('Screenshot Capturada');
                });
            } catch(e) {
                Utils.toast('Erro DRM/CORS (Proteção do Site)', 'alert');
            }
        },

        togglePiP: async () => {
            const video = Utils.getVideo();
            if (!video) return;
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    await video.requestPictureInPicture();
                }
            } catch (e) { Utils.toast('PiP Bloqueado pelo Browser', 'alert'); }
        },

        toggleLoop: () => {
            const video = Utils.getVideo();
            if (!video) return;
            STATE.loopActive = !STATE.loopActive;
            video.loop = STATE.loopActive;
            Utils.toast(`Loop: ${STATE.loopActive ? 'ON' : 'OFF'}`);
            
            const btn = document.getElementById('btn-loop');
            if(btn) btn.style.color = STATE.loopActive ? CONFIG.ui.primary : '#888';
        },

        setSpeed: (rate) => {
            const video = Utils.getVideo();
            if (video) {
                video.playbackRate = rate;
                Utils.toast(`Velocidade: ${rate}x`);
            }
        },

        initAudioBoost: () => {
            if (STATE.audioContext) return;
            const video = Utils.getVideo();
            if (!video) return;

            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                STATE.audioContext = new AudioContext();
                const source = STATE.audioContext.createMediaElementSource(video);
                STATE.gainNode = STATE.audioContext.createGain();
                
                source.connect(STATE.gainNode);
                STATE.gainNode.connect(STATE.audioContext.destination);
                Utils.toast('Áudio Amplificado Ativado');
            } catch (e) { console.warn('Nexus Audio: Contexto já inicializado ou protegido.'); }
        },

        setVolume: (multiplier) => { 
            if (!SETTINGS.audioBoost) return;
            if (!STATE.audioContext) MediaTools.initAudioBoost();
            if (STATE.gainNode) STATE.gainNode.gain.value = multiplier;
        }
    };

    // ==========================================
    // 4. MÓDULO YOUTUBE
    // ==========================================

    const YouTube = {
        init: () => {
            STATE.currentPlatform = 'YOUTUBE';
            if (SETTINGS.bgPlay) YouTube.hackVisibility();
            
            const observer = new MutationObserver(() => {
                if(STATE.loopActive) {
                    const v = Utils.getVideo();
                    if(v && !v.loop) v.loop = true;
                }
                if(SETTINGS.hideShorts) YouTube.removeShorts();
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setInterval(() => {
                if (SETTINGS.adBlock) YouTube.destroyAds();
                YouTube.handleOverlays();
                if (SETTINGS.cinemaMode) YouTube.forceCinema();
            }, CONFIG.checkInterval);
        },

        hackVisibility: () => {
            try {
                Object.defineProperty(document, 'hidden', { get: () => false });
                Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
                window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
            } catch(e) {}
        },

        destroyAds: () => {
            const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton');
            if (skipBtn) {
                skipBtn.click();
                STATE.adsSkipped++;
                UI.updateStats();
                return; 
            }
            const adContainer = document.querySelector('.ad-showing');
            const video = document.querySelector('video');
            if (adContainer && video) {
                video.playbackRate = 16.0;
                video.muted = true;
                if(video.duration && isFinite(video.duration)) video.currentTime = video.duration;
            }
            const statics = document.querySelectorAll('ytd-ad-slot-renderer, ytd-rich-item-renderer:has(.ytd-ad-slot-renderer)');
            statics.forEach(el => el.style.display = 'none');
        },

        handleOverlays: () => {
            const close = document.querySelector('.ytp-ad-overlay-close-button');
            const confirm = document.querySelector('yt-confirm-dialog-renderer #confirm-button');
            if (close) close.click();
            if (confirm) confirm.click();
        },

        forceCinema: () => {
            const styleId = 'nexus-cinema-yt';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    ytd-watch-flexy[flexy] #secondary.ytd-watch-flexy, 
                    #secondary-inner, #chat-container, ytd-live-chat-frame { display: none !important; }
                    ytd-watch-flexy[flexy] #primary.ytd-watch-flexy { 
                        max-width: 100% !important; min-width: 100% !important; width: 100% !important; margin: 0 !important; 
                    }
                    ytd-watch-next-secondary-results-renderer { display: none !important; }
                `;
                document.head.appendChild(style);
                
                const theaterBtn = document.querySelector('.ytp-size-button');
                const app = document.querySelector('ytd-watch-flexy');
                if (theaterBtn && app && !app.hasAttribute('theater')) theaterBtn.click();
            }
        },

        removeShorts: () => {
            const selectors = ['ytd-rich-shelf-renderer[is-shorts]', 'ytd-reel-shelf-renderer', 'a[href^="/shorts"]'];
            document.querySelectorAll(selectors.join(',')).forEach(el => {
                const item = el.closest('ytd-rich-item-renderer') || el.closest('ytd-item-section-renderer') || el;
                if(item) item.style.display = 'none';
            });
        }
    };

    // ==========================================
    // 5. MÓDULO TWITCH
    // ==========================================

    const Twitch = {
        init: () => {
            STATE.currentPlatform = 'TWITCH';
            setInterval(() => {
                if (SETTINGS.autoClaim) Twitch.claimPoints();
                if (SETTINGS.cinemaMode) Twitch.focusMode();
                Twitch.recoverStream();
            }, 2000);
        },

        claimPoints: () => {
            const chest = document.querySelector('[aria-label="Claim Bonus"], [aria-label="Resgatar bônus"]');
            if (chest) {
                chest.click();
                STATE.pointsClaimed++;
                UI.updateStats();
            }
        },

        recoverStream: () => {
            const errBtn = document.querySelector('.content-overlay-gate__allow-pointers button');
            if (errBtn && document.body.innerText.includes('#2000')) {
                errBtn.click();
            }
        },

        focusMode: () => {
            const sidebars = document.querySelectorAll('.right-column, .navigation-sidebar');
            sidebars.forEach(el => el.style.display = 'none');
        }
    };

    // ==========================================
    // 6. MÓDULO KICK (NOVO)
    // ==========================================

    const Kick = {
        init: () => {
            STATE.currentPlatform = 'KICK';
            // Kick usa Tailwind classes, IDs são raros. Usaremos observadores estruturais.
            const observer = new MutationObserver(() => {
                if (SETTINGS.cinemaMode) Kick.focusMode();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        focusMode: () => {
            // Tenta identificar sidebar e chat baseado em estrutura comum do Kick
            // O Kick geralmente tem uma estrutura de Grid.
            // Sidebar esquerda
            const sidebar = document.querySelector('#sidebar-nav') || document.querySelector('aside'); 
            // Chat direita
            const chat = document.querySelector('#chatroom') || document.querySelector('.chatroom-container');
            
            if(sidebar) sidebar.style.display = 'none';
            if(chat) chat.style.display = 'none';
        }
    };

    // ==========================================
    // 7. INTERFACE HUD (ADAPTATIVA)
    // ==========================================

    const UI = {
        init: () => {
            if (document.getElementById('nexus-stream-hud')) return;

            GM_addStyle(`
                .nexus-hud {
                    position: fixed; top: 60px; right: 20px; width: 240px;
                    background: ${CONFIG.ui.bg}; border: 1px solid ${CONFIG.ui.primary};
                    color: ${CONFIG.ui.text}; font-family: 'Consolas', 'Monaco', monospace;
                    font-size: 11px; z-index: 2147483647; border-radius: 4px;
                    box-shadow: 0 0 20px rgba(0, 255, 65, 0.1);
                    backdrop-filter: blur(5px); transition: opacity 0.3s;
                }
                .nexus-header {
                    padding: 8px; font-weight: bold; background: rgba(0,255,65,0.1);
                    display: flex; justify-content: space-between; cursor: move;
                    border-bottom: 1px solid ${CONFIG.ui.primary}; color: ${CONFIG.ui.primary};
                }
                .nexus-content { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
                
                .nexus-row { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; }
                .nexus-switch { position: relative; width: 28px; height: 14px; }
                .nexus-switch input { opacity: 0; width: 0; height: 0; }
                .nexus-slider {
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #333; transition: .2s; border-radius: 14px;
                }
                .nexus-slider:before {
                    position: absolute; content: ""; height: 10px; width: 10px; left: 2px; bottom: 2px;
                    background-color: #888; transition: .2s; border-radius: 50%;
                }
                input:checked + .nexus-slider { background-color: rgba(0,255,65,0.3); }
                input:checked + .nexus-slider:before { transform: translateX(14px); background-color: ${CONFIG.ui.primary}; }

                .nexus-tools-grid { 
                    display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; 
                    margin-top: 5px; padding-top: 8px; border-top: 1px dashed #333; 
                }
                .nexus-tool-btn {
                    background: ${CONFIG.ui.grid}; border: 1px solid #333; color: #aaa;
                    height: 25px; border-radius: 3px; cursor: pointer; transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center; font-size: 14px;
                }
                .nexus-tool-btn:hover { border-color: ${CONFIG.ui.primary}; color: ${CONFIG.ui.primary}; }
                
                .nexus-range-container { margin-top: 5px; }
                .nexus-range { width: 100%; height: 4px; background: #333; -webkit-appearance: none; border-radius: 2px; }
                .nexus-range::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; background: ${CONFIG.ui.primary}; border-radius: 50%; cursor: pointer; }
                
                .nexus-stats { margin-top: 8px; font-size: 9px; color: #666; text-align: right; }
            `);

            const hud = Utils.create('div', { className: 'nexus-hud', id: 'nexus-stream-hud' });
            const header = Utils.create('div', { className: 'nexus-header', html: '<span>NEXUS SUITE v5</span><span>_</span>' });
            hud.appendChild(header);

            const content = Utils.create('div', { className: 'nexus-content' });

            // Helper para criar Toggles
            const createToggle = (label, key, callback) => {
                const row = Utils.create('div', { className: 'nexus-row' });
                row.innerHTML = `<span>${label}</span>`;
                const sw = Utils.create('label', { className: 'nexus-switch' });
                const inp = Utils.create('input', { attrs: { type: 'checkbox' } });
                inp.checked = SETTINGS[key];
                
                inp.onchange = (e) => {
                    SETTINGS[key] = e.target.checked;
                    GM_setValue(key, SETTINGS[key]);
                    Utils.toast(`${label}: ${e.target.checked ? 'ON' : 'OFF'}`);
                    
                    if (key === 'cinemaMode') {
                        // Reseta estados visuais ao desligar
                        if (!e.target.checked) {
                            const s = document.getElementById('nexus-cinema-yt');
                            if(s) s.remove();
                            document.querySelectorAll('aside, #sidebar-nav, .right-column, .navigation-sidebar, #chatroom').forEach(el => el.style.display = '');
                        } else {
                            if(STATE.currentPlatform === 'KICK') Kick.focusMode();
                            else if(STATE.currentPlatform === 'TWITCH') Twitch.focusMode();
                            else YouTube.forceCinema();
                        }
                    }
                    if (key === 'audioBoost' && e.target.checked) MediaTools.initAudioBoost();
                    if (callback) callback(e.target.checked);
                };

                const sl = Utils.create('span', { className: 'nexus-slider' });
                sw.appendChild(inp); sw.appendChild(sl);
                row.appendChild(sw);
                content.appendChild(row);
            };

            // Toggles Condicionais
            createToggle('Bloquear Ads', 'adBlock');
            if (STATE.currentPlatform === 'YOUTUBE') createToggle('Background Play', 'bgPlay');
            createToggle('Modo Foco/Cinema', 'cinemaMode');
            createToggle('Audio Boost', 'audioBoost', (active) => {
                const range = document.getElementById('audio-boost-range');
                if (range) range.disabled = !active;
                if (!active && STATE.gainNode) STATE.gainNode.gain.value = 1;
            });
            if (STATE.currentPlatform === 'YOUTUBE') createToggle('Ocultar Shorts', 'hideShorts');
            if (STATE.currentPlatform === 'TWITCH') createToggle('Auto-Loot Twitch', 'autoClaim');

            // Tools Grid
            const grid = Utils.create('div', { className: 'nexus-tools-grid' });
            const addTool = (icon, title, action, id) => {
                const btn = Utils.create('button', { 
                    className: 'nexus-tool-btn', html: icon, attrs: { title }, id: id, events: { click: action }
                });
                grid.appendChild(btn);
            };

            addTool('📷', 'Screenshot', MediaTools.screenshot);
            addTool('📺', 'PiP', MediaTools.togglePiP);
            addTool('🔁', 'Loop', MediaTools.toggleLoop, 'btn-loop');
            addTool('⚡', 'Speed 2x', () => MediaTools.setSpeed(2.0));

            content.appendChild(grid);

            // Audio Slider
            const boostContainer = Utils.create('div', { className: 'nexus-range-container' });
            boostContainer.innerHTML = '<div style="display:flex;justify-content:space-between;"><span>Boost</span><span id="vol-val">100%</span></div>';
            const range = Utils.create('input', { 
                className: 'nexus-range', id: 'audio-boost-range',
                attrs: { type: 'range', min: '1', max: '5', step: '0.1', value: '1' }
            });
            range.disabled = !SETTINGS.audioBoost;
            range.oninput = (e) => {
                const val = e.target.value;
                document.getElementById('vol-val').innerText = `${Math.round(val * 100)}%`;
                MediaTools.setVolume(val);
            };
            boostContainer.appendChild(range);
            content.appendChild(boostContainer);

            // Stats Footer
            const stats = Utils.create('div', { className: 'nexus-stats', id: 'nexus-stats-disp', text: `Nexus [${STATE.currentPlatform}]` });
            content.appendChild(stats);

            hud.appendChild(content);
            document.body.appendChild(hud);

            // Drag & Minimize
            UI.makeDraggable(hud, header);
            header.querySelector('span:last-child').onclick = () => {
                const isMin = content.style.display === 'none';
                content.style.display = isMin ? 'flex' : 'none';
                hud.style.width = isMin ? '240px' : 'auto';
            };
        },

        updateStats: () => {
            const el = document.getElementById('nexus-stats-disp');
            if (el) el.innerText = `Ads: ${STATE.adsSkipped} | Loot: ${STATE.pointsClaimed}`;
        },

        makeDraggable: (el, handle) => {
            let isDown = false, startX, startY, initialLeft, initialTop;
            handle.onmousedown = (e) => {
                isDown = true;
                startX = e.clientX; startY = e.clientY;
                const rect = el.getBoundingClientRect();
                initialLeft = rect.left; initialTop = rect.top;
                el.style.right = 'auto'; el.style.bottom = 'auto';
                e.preventDefault();
            };
            document.onmousemove = (e) => {
                if (!isDown) return;
                el.style.left = (initialLeft + (e.clientX - startX)) + 'px';
                el.style.top = (initialTop + (e.clientY - startY)) + 'px';
            };
            document.onmouseup = () => isDown = false;
        }
    };

    // ==========================================
    // 8. ROTEADOR DE PLATAFORMA
    // ==========================================

    const init = () => {
        const host = window.location.hostname;
        
        // Define a plataforma antes de iniciar a UI
        if (host.includes('youtube.com')) {
            YouTube.init();
        } else if (host.includes('twitch.tv')) {
            Twitch.init();
        } else if (host.includes('kick.com')) {
            Kick.init();
        } else {
            STATE.currentPlatform = 'GENERIC'; // Tenta carregar ferramentas genéricas
        }

        UI.init();
    };

    const checkBody = setInterval(() => {
        if (document.body) {
            clearInterval(checkBody);
            init();
        }
    }, 100);

})();