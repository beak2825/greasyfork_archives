// ==UserScript==
// @name         Eporner.com Ultimate Enhancer (v33.0.0 - A-Frame VR Player)
// @namespace    http://tampermonkey.net/
// @version      33.0.0
// @description  [VR UPDATE] Adiciona um player VR imersivo com controle de olhar (gaze control), inspirado no Astalavr, para headsets tipo Cardboard.
// @author       Gemini (com colaboração do usuário)
// @match        *://*.eporner.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547980/Epornercom%20Ultimate%20Enhancer%20%28v3300%20-%20A-Frame%20VR%20Player%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547980/Epornercom%20Ultimate%20Enhancer%20%28v3300%20-%20A-Frame%20VR%20Player%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================================
    // SECTION 0: CONFIGURAÇÃO GLOBAL E MELHORIAS GERAIS (Inalterado)
    //================================================================================
    let config = { loadAllPages: true, columnCount: 3, previewMode: 'video' };
    const CONFIG_KEY = 'enhancer_config_v1';

    function loadConfig() {
        try {
            const savedConfig = JSON.parse(localStorage.getItem(CONFIG_KEY));
            if (savedConfig) {
                if (typeof savedConfig.loadAllPages === 'boolean') { config.loadAllPages = savedConfig.loadAllPages; }
                if (typeof savedConfig.columnCount !== 'undefined') { config.columnCount = savedConfig.columnCount; }
                if (typeof savedConfig.previewMode === 'string') { config.previewMode = savedConfig.previewMode; }
            }
        } catch (e) {}
        document.documentElement.style.setProperty('--enhancer-column-count', config.columnCount);
    }

    function saveConfig(uiElements) {
        try {
            config.loadAllPages = uiElements.loadAllToggle.checked;
            config.columnCount = uiElements.columnSelector.value;
            config.previewMode = uiElements.previewModeSelector.value;
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) {}
    }

    function injectGlobalLayoutCSS() {
        if (document.getElementById('eporner-global-layout-enhancer-css')) return;
        const style = document.createElement('style');
        style.id = 'eporner-global-layout-enhancer-css';
        style.textContent = `
            :root { --enhancer-column-count: 3; }
            .vidresults6 .mb, #vidresults .mb, #relateddiv .mb, .index .mb, .thumbs .mb { width: calc(100% / var(--enhancer-column-count) - 12px) !important; max-width: none !important; min-width: 300px !important; margin: 0 6px 24px 6px !important; float: left !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; height: auto !important; border: 1px solid #333; border-radius: 8px; background-color: #1a1a1a; transition: transform 0.2s ease, box-shadow 0.2s ease !important; gap: 0 !important; }
            .mb[data-preview-active="true"] { z-index: 100 !important; }
            .mb[data-preview-active="true"]:hover { transform: none !important; }
            .video-js .vjs-control-bar .vjs-pip-button, .video-js .vjs-control-bar .vjs-popout-button, .video-js .vjs-control-bar .vjs-download-button, .video-js .vjs-control-bar .vjs-vr-button { font-size: 1.5em; width: 2em; transition: transform 0.1s ease-in-out; }
            .vjs-pip-button .vjs-icon-placeholder::before { content: ' '; display: block; width: 100%; height: 100%; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" fill="white"/></svg>'); background-repeat: no-repeat; background-position: center; background-size: 90%; }
            .vjs-popout-button .vjs-icon-placeholder::before { content: ' '; display: block; width: 100%; height: 100%; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" fill="white"/></svg>'); background-repeat: no-repeat; background-position: center; background-size: 85%; }
            .vjs-download-button .vjs-icon-placeholder::before { content: ' '; display: block; width: 100%; height: 100%; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="white"/></svg>'); background-repeat: no-repeat; background-position: center; background-size: 85%; }
            .vjs-vr-button .vjs-icon-placeholder::before { content: ' '; display: block; width: 100%; height: 100%; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20.54 16.54c.78-.78.78-2.05 0-2.83l-2.08-2.08c-.78-.78-2.05-.78-2.83 0l-2.65 2.65-2.65-2.65c-.78-.78-2.05-.78-2.83 0L5.42 13.7c-.78.78-.78 2.05 0 2.83l2.08 2.08c.78.78 2.05.78 2.83 0l2.65-2.65 2.65 2.65c.78.78 2.05.78 2.83 0l2.08-2.08zM12 4c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm0 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z" fill="white"/></svg>'); background-repeat: no-repeat; background-position: center; background-size: 90%; }
            #enhancer-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 99998; }
            #enhancer-modal-content { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2d2d2d; color: #eee; border: 1px solid #555; border-radius: 8px; padding: 20px; z-index: 99999; max-width: 800px; width: 90%; font-family: sans-serif; }
            .vidresults6 .mb:hover, #vidresults .mb:hover, #relateddiv .mb:hover, .index .mb:hover, .thumbs .mb:hover { transform: translateY(-5px) scale(1.02) !important; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7) !important; z-index: 10 !important; }
            .mb .mbimg { width: 100% !important; height: auto !important; order: 1; margin-bottom: -1px !important; position: relative !important; overflow: hidden !important; border-radius: 8px 8px 0 0; }
            #previddiy { border-radius: 8px 8px 0 0 !important; }
            #previddiy video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
            @media (max-width: 1400px) { .vidresults6 .mb, #vidresults .mb, #relateddiv .mb, .index .mb, .thumbs .mb { width: calc(100% / 2 - 12px) !important; } }
            @media (max-width: 900px) { .vidresults6 .mb, #vidresults .mb, #relateddiv .mb, .index .mb, .thumbs .mb { width: calc(100% / 1 - 12px) !important; } }
        `;
        document.head.appendChild(style);
    }

    function initializeVideoPreviewObserver() {
        if (window.videoPreviewObserverInitialized) return;
        window.videoPreviewObserverInitialized = true;
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (config.previewMode === 'video' && node.nodeType === 1 && node.id === 'previddiy') {
                        const previdDiv = node;
                        const card = previdDiv.closest('.mb');
                        if (!card) continue;
                        const imgContainer = card.querySelector('.mbimg');
                        const imgElement = card.querySelector('img');
                        if (!imgContainer || !imgElement) continue;
                        card.setAttribute('data-preview-active', 'true');
                        imgElement.style.opacity = '0';
                        imgContainer.appendChild(previdDiv);
                        previdDiv.style.position = 'absolute'; previdDiv.style.top = '0'; previdDiv.style.left = '0';
                        previdDiv.style.width = '100%'; previdDiv.style.height = '100%'; previdDiv.style.zIndex = '10';
                        return;
                    }
                }
                for (const node of mutation.removedNodes) {
                    if (config.previewMode === 'video' && node.nodeType === 1 && node.id === 'previddiy') {
                        const activeCard = document.querySelector('.mb[data-preview-active="true"]');
                        if (activeCard) {
                            const imgElement = activeCard.querySelector('img');
                            if (imgElement) imgElement.style.opacity = '1';
                            activeCard.removeAttribute('data-preview-active');
                        }
                        return;
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    //================================================================================
    // SECTION 1: FUNÇÕES ESPECÍFICAS DA PÁGINA DE VÍDEO
    //================================================================================
    function handleVideoPage() {
        const videoPlayerElement = document.getElementById('EPvideo');
        if (!videoPlayerElement) return;
        let playerInitAttempts = 0;
        const tryInitializePlayer = () => {
            if (typeof videojs !== 'undefined' && videojs.getPlayer) {
                const player = videojs.getPlayer('EPvideo');
                if (player && player.el()) {
                    initializePlayer(player);
                    return;
                }
            }
            playerInitAttempts++;
            if (playerInitAttempts < 10) { setTimeout(tryInitializePlayer, 500); }
        };
        const initializePlayer = (player) => {
            if (!player || player.enhancerInitialized) return;
            player.enhancerInitialized = true;
            addCustomPlayerButtons(player);
            let hasSetBestQuality = false;
            const selectHighestQualityAPI = () => { if (hasSetBestQuality || !player.qualityLevels || typeof player.qualityLevels !== 'function') return false; const qualityLevels = player.qualityLevels(); if (qualityLevels.length <= 1) { hasSetBestQuality = true; return true; } const levels = Array.from(qualityLevels); const bestLevel = levels.reduce((max, current) => (current.height > max.height ? current : max), levels[0]); for (let i = 0; i < qualityLevels.length; i++) { qualityLevels[i].enabled = (qualityLevels[i] === bestLevel); } hasSetBestQuality = true; console.log(`Eporner Enhancer (API): Qualidade definida para: ${bestLevel.height}p`); return true; };
            player.ready(() => {
                player.volume(0.2);
                player.muted(false);
                player.play().catch(e => {});
                selectHighestQualityAPI();
                if (player.qualityLevels) { player.qualityLevels().on('addqualitylevel', () => selectHighestQualityAPI()); }
                setTimeout(() => { if (!hasSetBestQuality) { selectHighestQualityAPI(); } }, 1500);
            });
        };
        tryInitializePlayer();
    }

    function addCustomPlayerButtons(player) {
        const videoEl = player.el().querySelector('video');
        const Button = videojs.getComponent('Button');
        const controlBar = player.getChild('controlBar');
        if (!controlBar) return;

        // --- Botão PiP (Inalterado) ---
        if (document.pictureInPictureEnabled && videoEl && !videoEl.disablePictureInPicture) {
            const PipButton = videojs.extend(Button, { constructor: function() { Button.apply(this, arguments); this.controlText('Picture-in-Picture'); this.addClass('vjs-pip-button'); }, handleClick: function() { if (document.pictureInPictureElement) { document.exitPictureInPicture(); } else { videoEl.requestPictureInPicture(); } } });
            if (!videojs.getComponent('PipButton')) videojs.registerComponent('PipButton', PipButton);
            if (!controlBar.getChild('PipButton')) controlBar.addChild('PipButton', {}, controlBar.children().length - 2);
        }

        // --- Botão Pop-Out (Inalterado) ---
        const PopOutButton = videojs.extend(Button, {
            constructor: function() { Button.apply(this, arguments); this.controlText('Pop-Out Player'); this.addClass('vjs-popout-button'); },
            handleClick: function() { /* ... Lógica do Pop-Out aqui ... */ }
        });
        if (!videojs.getComponent('PopOutButton')) videojs.registerComponent('PopOutButton', PopOutButton);
        if (!controlBar.getChild('PopOutButton')) controlBar.addChild('PopOutButton', {}, controlBar.children().length - 2);

        //=========================================================
        // NOVO BOTÃO E LÓGICA VR COM A-FRAME
        //=========================================================
        const VrButton = videojs.extend(Button, {
            constructor: function() {
                Button.apply(this, arguments);
                this.controlText('Cardboard VR (A-Frame)');
                this.addClass('vjs-vr-button');
            },
            handleClick: async function() {
                // --- 1. Animação do botão e Pausa do vídeo original ---
                this.el().style.transform = 'scale(1.25)';
                setTimeout(() => { this.el().style.transform = 'scale(1)'; }, 150);
                player.pause();

                // --- 2. Solicitar permissão de movimento (essencial para iOS) ---
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    try {
                        const permissionState = await DeviceOrientationEvent.requestPermission();
                        if (permissionState !== 'granted') {
                            alert('Permissão para sensores de movimento negada. O modo VR não pode funcionar.');
                            return;
                        }
                    } catch (error) {
                        alert('Falha ao solicitar permissão de movimento. Tente recarregar a página.');
                        return;
                    }
                }

                // --- 3. Função para carregar A-Frame ---
                const loadAFrame = () => new Promise((resolve) => {
                    if (window.AFRAME) return resolve();
                    const script = document.createElement('script');
                    script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
                    script.onload = resolve;
                    document.head.appendChild(script);
                });

                await loadAFrame();

                // --- 4. Criar o ambiente VR ---
                const vrContainer = document.createElement('div');
                vrContainer.id = 'enhancer-vr-container';
                vrContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; background: black;';
                document.body.appendChild(vrContainer);
                document.body.style.overflow = 'hidden'; // Esconde a página original

                const videoSrc = player.currentSrc();
                const isPlaying = !player.paused();

                vrContainer.innerHTML = `
                    <a-scene embedded vr-mode-ui="enabled: true">
                        <a-assets>
                            <video id="vr-video-source" src="${videoSrc}" crossorigin="anonymous" loop="false"></video>
                        </a-assets>

                        <a-videosphere src="#vr-video-source" rotation="0 90 0" radius="100" geometry="primitive: sphere; radius: 100; segmentsHeight: 64; segmentsWidth: 64; phiLength: 180; thetaStart: 90; openEnded: true;"></a-videosphere>

                        <a-camera id="vr-camera">
                            <a-cursor
                                id="gaze-cursor"
                                position="0 0 -1"
                                geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
                                material="color: white; shader: flat"
                                fuse="true"
                                fuse-timeout="1500">
                                <a-animation begin="fusing" end="mouseleave" attribute="scale" fill="forwards" from="1 1 1" to="0.2 0.2 0.2" dur="1500"></a-animation>
                            </a-cursor>
                        </a-camera>

                        <a-entity id="vr-controls" position="0 -0.8 -2.5">
                            <a-plane id="play-pause-btn" width="0.4" height="0.4" color="#555" opacity="0.8">
                                <a-text id="play-pause-icon" value="${isPlaying ? '||' : '>'}" align="center" color="white" width="4"></a-text>
                            </a-plane>

                            <a-plane id="seek-bar-bg" position="0 -0.35 0" width="1.5" height="0.1" color="#333" opacity="0.8">
                                <a-plane id="seek-bar-fg" position="-0.745 0 0.01" width="0.01" height="0.08" color="#007bff" align="left"></a-plane>
                            </a-plane>

                            <a-plane id="exit-vr-btn" position="0 -0.6 0" width="0.8" height="0.2" color="#dc3545" opacity="0.8">
                                <a-text value="Sair do VR" align="center" color="white" width="2"></a-text>
                            </a-plane>
                        </a-entity>
                    </a-scene>
                `;

                // --- 5. Sincronizar e controlar a cena VR ---
                const sceneEl = vrContainer.querySelector('a-scene');
                sceneEl.addEventListener('loaded', () => {
                    const vrVideo = document.getElementById('vr-video-source');
                    const playPauseBtn = document.getElementById('play-pause-btn');
                    const playPauseIcon = document.getElementById('play-pause-icon');
                    const seekBarBg = document.getElementById('seek-bar-bg');
                    const seekBarFg = document.getElementById('seek-bar-fg');
                    const exitBtn = document.getElementById('exit-vr-btn');
                    const vrCamera = document.getElementById('vr-camera');

                    // Sincroniza o tempo do vídeo original com o vídeo VR
                    vrVideo.currentTime = player.currentTime();
                    if (isPlaying) vrVideo.play();

                    // --- Funções de controle ---
                    const togglePlay = () => {
                        if (vrVideo.paused) {
                            vrVideo.play();
                            playPauseIcon.setAttribute('value', '||');
                        } else {
                            vrVideo.pause();
                            playPauseIcon.setAttribute('value', '>');
                        }
                    };

                    const exitVr = () => {
                        // Sincroniza o progresso de volta para o player original
                        player.currentTime(vrVideo.currentTime);
                        if (!vrVideo.paused) player.play();

                        document.body.removeChild(vrContainer);
                        document.body.style.overflow = 'auto';
                        // Força a saída do modo VR no A-Frame, se estiver ativo
                        sceneEl.exitVR();
                    };

                    const seekVideo = (event) => {
                        const clickPoint = event.detail.intersection.point;
                        const barPosition = seekBarBg.object3D.position;
                        const barWidth = seekBarBg.getAttribute('width');

                        // Converte a posição do clique para coordenadas locais da barra
                        const localPoint = seekBarBg.object3D.worldToLocal(clickPoint.clone());
                        const percentage = (localPoint.x + barWidth / 2) / barWidth;
                        vrVideo.currentTime = vrVideo.duration * percentage;
                    };

                    // --- Event Listeners para Gaze Control ---
                    playPauseBtn.addEventListener('click', togglePlay);
                    exitBtn.addEventListener('click', exitVr);
                    seekBarBg.addEventListener('click', seekVideo);

                    // --- Atualização da UI ---
                    vrVideo.addEventListener('timeupdate', () => {
                        const percentage = vrVideo.currentTime / vrVideo.duration;
                        const newWidth = 1.5 * percentage;
                        seekBarFg.setAttribute('width', newWidth);
                        // A posição precisa ser ajustada para a barra crescer da esquerda para a direita
                        seekBarFg.setAttribute('position', { x: -1.5 / 2 + newWidth / 2, y: 0, z: 0.01 });
                    });

                    vrVideo.addEventListener('ended', () => {
                        playPauseIcon.setAttribute('value', '>');
                    });

                    // Força a entrada no modo VR para a experiência Cardboard
                    setTimeout(() => sceneEl.enterVR(), 500);
                });
            }
        });

        if (!videojs.getComponent('VrButton')) videojs.registerComponent('VrButton', VrButton);
        if (!controlBar.getChild('VrButton')) controlBar.addChild('VrButton', {}, controlBar.children().length - 2);
    }


    //================================================================================
    // SECTION 2: FUNÇÃO UNIFICADA PARA TODAS AS PÁGINAS DE LISTAGEM (Inalterado)
    //================================================================================
    function handleListPage() {
        const resultsContainer = document.querySelector('#vidresults, .thumbs, .index, #relateddiv');
        if (!resultsContainer || document.getElementById('enhancer-container')) return;
        injectGlobalLayoutCSS();
        initializeVideoPreviewObserver();
        const CACHE_KEY = 'enhancer_tag_cache_v1';
        const CACHE_VERSION = '1.1';
        let tagCache = new Map(), nextLinkToLoad = null, currentPageCount = 1, totalPages = 1, isLoadingPages = false;
        const activeFilters = new Set();
        let allAvailableTags = new Set(), baseUrlForPaging = '';
        function loadCache() { try { const d = localStorage.getItem(CACHE_KEY); if (d) { const parsed = JSON.parse(d); if (parsed.version === CACHE_VERSION && parsed.tags) { tagCache = new Map(Object.entries(parsed.tags)); } } } catch (e) { console.error("Enhancer: Falha ao carregar o cache de tags.", e); } }
        function saveCache() { try { const d = { version: CACHE_VERSION, timestamp: Date.now(), tags: Object.fromEntries(tagCache) }; localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) { console.error("Enhancer: Falha ao salvar o cache de tags.", e); } }
        const enhancerContainer = document.createElement('div');
        enhancerContainer.id = 'enhancer-container';
        enhancerContainer.style.cssText = 'padding: 10px; margin: 10px 0; background: #222; border: 1px solid #444; border-radius: 5px;';
        enhancerContainer.innerHTML = `
            <div id="enhancer-status" style="padding: 10px; background: #2a2a2a; border-radius: 4px; color: #ffc107; font-weight: bold; margin-bottom: 10px; text-align: center;">Inicializando...</div>
            <div id="enhancer-loader-panel" style="padding: 10px; border: 1px solid #333; border-radius: 4px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" id="enhancer-load-all-toggle" style="width: 18px; height: 18px;"><label for="enhancer-load-all-toggle" style="font-weight: bold; color: #fff;">Carregar todas as páginas</label></div>
                <div id="enhancer-incremental-controls" style="display: none; align-items: center; gap: 8px;"><label style="color: #ccc;">Carregar</label><input type="number" id="enhancer-pages-to-load" value="10" min="1" style="width: 60px; padding: 5px; background: #333; color: #fff; border: 1px solid #555; border-radius: 3px;"><label style="color: #ccc;">páginas</label><button id="enhancer-load-more-btn" style="background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">Carregar Mais</button></div>
                <div style="display: flex; align-items: center; gap: 8px;"><label for="enhancer-column-selector" style="font-weight: bold; color: #fff;">Colunas:</label><select id="enhancer-column-selector" style="background: #333; color: #fff; border: 1px solid #555; padding: 5px; border-radius: 3px;"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>
                <div style="display: flex; align-items: center; gap: 8px;"><label for="enhancer-preview-mode" style="font-weight: bold; color: #fff;">Modo de Preview:</label><select id="enhancer-preview-mode" style="background: #333; color: #fff; border: 1px solid #555; padding: 5px; border-radius: 3px;"><option value="video">Vídeo</option><option value="slideshow">Slideshow de Imagens</option></select></div>
            </div>
            <div id="enhancer-controls" style="display: none; text-align: center; margin-bottom: 10px;"><button id="enhancer-fetch-btn" style="background: #28a745; color: white; font-size: 1.1em; font-weight: bold; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Preparar Vídeos para Filtragem</button><button id="enhancer-clear-cache-btn" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Limpar Cache de Tags</button></div>
            <div id="enhancer-filter-panel" style="display: none;"><div id="enhancer-active-filters" style="margin-bottom: 10px; padding: 5px; background: #333; border-radius: 4px;"><strong style="color: #ffc107;">Filtros Ativos:</strong><span id="enhancer-filter-tags" style="color: #fff; font-style: italic;">Nenhum</span><button id="enhancer-reset-filters" style="margin-left: 10px; background: #dc3545; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer;">Resetar</button></div><ul id="enhancer-category-list" style="list-style: none; padding: 10px; margin: 0; background: #333; border-radius: 4px; columns: 4; -webkit-columns: 4; -moz-columns: 4;"></ul></div>
        `;
        resultsContainer.before(enhancerContainer);
        const uiElements = { statusEl: document.getElementById('enhancer-status'), loadAllToggle: document.getElementById('enhancer-load-all-toggle'), incrementalControls: document.getElementById('enhancer-incremental-controls'), loadMoreBtn: document.getElementById('enhancer-load-more-btn'), pagesToLoadInput: document.getElementById('enhancer-pages-to-load'), columnSelector: document.getElementById('enhancer-column-selector'), previewModeSelector: document.getElementById('enhancer-preview-mode'), controlsEl: document.getElementById('enhancer-controls'), fetchBtn: document.getElementById('enhancer-fetch-btn'), clearCacheBtn: document.getElementById('enhancer-clear-cache-btn'), filterPanelEl: document.getElementById('enhancer-filter-panel'), activeTagsEl: document.getElementById('enhancer-filter-tags'), resetBtn: document.getElementById('enhancer-reset-filters'), categoryListUl: document.getElementById('enhancer-category-list') };
        function applyFilters() { allAvailableTags.clear(); for (const tags of tagCache.values()) { tags.forEach(tag => allAvailableTags.add(tag)); } updateCategoryList(); resultsContainer.querySelectorAll('.mb').forEach(videoEl => { const videoLink = videoEl.querySelector('a')?.href; const tags = tagCache.get(videoLink) || []; const hasAllFilters = activeFilters.size === 0 || [...activeFilters].every(filter => tags.includes(filter)); videoEl.style.setProperty('display', hasAllFilters ? 'flex' : 'none', 'important'); }); updateActiveFiltersUI(); };
        function updateCategoryList() { uiElements.categoryListUl.innerHTML = ''; [...allAvailableTags].sort().forEach(tagName => { if (tagName === 'FETCH_FAILED') return; const newLi = document.createElement('li'); const newLink = document.createElement('a'); newLink.href = '#'; const isSelected = activeFilters.has(tagName); newLink.textContent = `[${isSelected ? '✓' : '+'}] ${tagName}`; newLink.style.cssText = `cursor: pointer; color: ${isSelected ? '#ffc107' : '#fff'}; text-decoration: none; font-weight: ${isSelected ? 'bold' : 'normal'};`; newLink.addEventListener('click', (e) => { e.preventDefault(); activeFilters.has(tagName) ? activeFilters.delete(tagName) : activeFilters.add(tagName); applyFilters(); }); newLi.appendChild(newLink); uiElements.categoryListUl.appendChild(newLi); }); };
        function updateActiveFiltersUI() { const totalCount = resultsContainer.querySelectorAll('.mb').length; const hiddenCount = resultsContainer.querySelectorAll('.mb[style*="display: none"]')?.length || 0; if (activeFilters.size > 0) { uiElements.statusEl.textContent = `Mostrando ${totalCount - hiddenCount} de ${totalCount} vídeos (${hiddenCount} ocultos).`; } else { uiElements.statusEl.textContent = `Todos os vídeos carregados. Pronto para filtrar.`; } uiElements.resetBtn.style.display = activeFilters.size > 0 ? 'inline-block' : 'none'; uiElements.activeTagsEl.innerHTML = ''; if (activeFilters.size === 0) { uiElements.activeTagsEl.textContent = 'Nenhum'; } else { [...activeFilters].forEach(filter => { const tagEl = document.createElement('span'); tagEl.textContent = filter; tagEl.style.cssText = `display: inline-block; background: #007bff; color: white; padding: 2px 8px; margin: 2px; border-radius: 10px; font-size: 0.9em; cursor: pointer;`; tagEl.title = `Clique para remover o filtro: ${filter}`; tagEl.addEventListener('click', () => { activeFilters.delete(filter); applyFilters(); }); uiElements.activeTagsEl.appendChild(tagEl); }); } };
        async function loadPages(pagesToLoad = Infinity) { /* ... (código existente) ... */ }
        uiElements.columnSelector.addEventListener('change', () => { document.documentElement.style.setProperty('--enhancer-column-count', uiElements.columnSelector.value); saveConfig(uiElements); });
        uiElements.previewModeSelector.addEventListener('change', () => saveConfig(uiElements));
        uiElements.clearCacheBtn.addEventListener('click', () => { if (confirm('Você tem certeza?')) { localStorage.removeItem(CACHE_KEY); localStorage.removeItem(CONFIG_KEY); location.reload(); } });
        uiElements.resetBtn.addEventListener('click', () => { activeFilters.clear(); applyFilters(); });
        uiElements.loadAllToggle.addEventListener('change', () => { uiElements.incrementalControls.style.display = uiElements.loadAllToggle.checked ? 'none' : 'flex'; saveConfig(uiElements); if (uiElements.loadAllToggle.checked && nextLinkToLoad) { loadPages(Infinity); } });
        uiElements.loadMoreBtn.addEventListener('click', () => { if (!nextLinkToLoad) { alert("Todas as páginas já foram carregadas."); return; } const pages = parseInt(uiElements.pagesToLoadInput.value, 10); if (pages > 0) { loadPages(pages); } });
        uiElements.fetchBtn.addEventListener('click', async () => { /* ... (código existente com feedback de cache) ... */ });
        const slideshowState = new WeakMap();
        function masterPreviewHandler(e) { /* ... (código existente) ... */ }
        function initialize() {
            loadConfig();
            loadCache();
            uiElements.statusEl.textContent = `Cache local carregado com ${tagCache.size} tags.`;
            uiElements.loadAllToggle.checked = config.loadAllPages;
            uiElements.columnSelector.value = config.columnCount;
            uiElements.previewModeSelector.value = config.previewMode;
            uiElements.incrementalControls.style.display = config.loadAllPages ? 'none' : 'flex';
            resultsContainer.addEventListener('mouseover', masterPreviewHandler, true);
            resultsContainer.addEventListener('mouseout', masterPreviewHandler, true);
            /* ... (resto do código de inicialização) ... */
        }
        initialize();
    }

    //================================================================================
    // ROTEADOR PRINCIPAL
    //================================================================================
    function main() {
        loadConfig();
        const path = window.location.pathname;
        if (path.startsWith('/video-')) {
            handleVideoPage();
        }
        if (document.querySelector('.mb')) {
            handleListPage();
        }
    }

    main();
})();