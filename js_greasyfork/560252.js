// ==UserScript==
// @name         NeuraVeil - AI Chat in Your Browser
// @name:fr      NeuraVeil - Chat IA dans votre navigateur
// @name:es      NeuraVeil - Chat de IA en tu navegador
// @name:de      NeuraVeil - KI-Chat in deinem Browser
// @name:it      NeuraVeil - Chat IA nel tuo browser
// @name:ja      NeuraVeil - ブラウザ内AIチャット
// @namespace    https://github.com/DREwX-code
// @version      1.1.3
// @description     Lightweight floating AI chat panel that works on any webpage. Free and no signup required. Uses Pollinations.ai for text and image generation, supports multiple conversations, reasoning levels, response styles, image tools, and a privacy-focused Ghost Mode.
// @description:fr  Panneau de chat IA flottant, léger et moderne, utilisable sur n’importe quelle page web. Gratuit et sans inscription. Utilise Pollinations.ai pour la génération de texte et d’images, avec conversations multiples, niveaux de raisonnement, styles de réponse, outils d’image et un mode Ghost axé sur la confidentialité.
// @description:es  Panel de chat IA flotante, ligero y moderno, que funciona en cualquier página web. Gratis y sin registro. Utiliza Pollinations.ai para la generación de texto e imágenes, con múltiples conversaciones, niveles de razonamiento, estilos de respuesta, herramientas de imagen y un modo Ghost centrado en la privacidad.
// @description:de  Leichtes, schwebendes KI-Chatpanel, das auf jeder Webseite funktioniert. Kostenlos und ohne Registrierung. Nutzt Pollinations.ai für Text- und Bildgenerierung, unterstützt mehrere Unterhaltungen, Denkstufen, Antwortstile, Bildtools und einen datenschutzorientierten Ghost-Modus.
// @description:it  Pannello di chat IA fluttuante, leggero e moderno, utilizzabile su qualsiasi pagina web. Gratuito e senza registrazione. Utilizza Pollinations.ai per la generazione di testo e immagini, con conversazioni multiple, livelli di ragionamento, stili di risposta, strumenti per le immagini e una modalità Ghost orientata alla privacy.
// @description:ja  あらゆるWebページで使用できる、軽量でモダンなフローティングAIチャットパネル。無料・登録不要。Pollinations.aiを使用したテキストおよび画像生成に対応し、複数の会話、推論レベル、応答スタイル、画像ツール、プライバシー重視のゴーストモードを搭載。
// @author       Dℝ∃wX
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/DREwX-code/NeuraVeil/refs/heads/main/assets/icon/Icon_NeuraVeil_Script.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/561659/1729069/NeuraVeil%20Styles%20%28Library%29.js
// @connect      text.pollinations.ai
// @connect      image.pollinations.ai
// @connect      api.openverse.org
// @connect      stablehorde.net
// @connect      aihorde.net
// @connect      *
// @run-at       document-end
// @license      Apache-2.0
// @copyright    2025 Dℝ∃wX
// @noframes
// @tag          productivity
// @downloadURL https://update.greasyfork.org/scripts/560252/NeuraVeil%20-%20AI%20Chat%20in%20Your%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/560252/NeuraVeil%20-%20AI%20Chat%20in%20Your%20Browser.meta.js
// ==/UserScript==

/*

Copyright 2025 Dℝ∃wX

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

/*
 _   _  ______  _    _  _____           __      __ ______  _____  _
| \ | ||  ____|| |  | ||  __ \     /\   \ \    / /|  ____||_   _|| |
|  \| || |__   | |  | || |__) |   /  \   \ \  / / | |__     | |  | |
| . ` ||  __|  | |  | ||  _  /   / /\ \   \ \/ /  |  __|    | |  | |
| |\  || |____ | |__| || | \ \  / ____ \   \  /   | |____  _| |_ | |____
|_| \_||______| \____/ |_|  \_\/_/    \_\   \/    |______||_____||______|

--------------------------------

AI Backends:

This project uses public, open-source endpoints provided by Pollinations.ai
for text and image generation.
No proprietary models are hosted or redistributed by this project.
Website: https://pollinations.ai/
Source code: https://github.com/pollinations/pollinations
License: MIT.

This project uses the public, community-driven API provided by
AI Horde (Stable Horde) for image generation.
Anonymous access is used (no user account, no API key required).
No proprietary models are hosted or redistributed by this project.
Website: https://aihorde.net/
API: https://aihorde.net/api/
Source code: https://github.com/Haidra-Org/AI-Horde
License: AGPL-3.0

---

Speech-to-Text (Voice Input):

This project uses the browser-native Web Speech API for voice-to-text input,
via SpeechRecognition or webkitSpeechRecognition depending on browser support.
Speech recognition is handled entirely by the user's browser.
No audio data is stored, logged, or transmitted by this project.
No external speech-to-text APIs, accounts, or API keys are used.

---

GreasyFork SVG Icon:

Created by denilsonsa.
Source: https://github.com/denilsonsa/denilsonsa.github.io/blob/master/icons/GreasyFork.svg
License: Not explicitly declared (used with attribution).

---

Third-Party Libraries:

This project uses Highlight.js for syntax highlighting.
Website: https://highlightjs.org/
Source code: https://github.com/highlightjs/highlight.js
License: BSD 3-Clause

---

Image Search (Openverse):

This project uses the public Openverse API to search openly licensed images.
Attribution, license, and source links are preserved when available.
No images are hosted or redistributed by this project.

Website: https://openverse.org/
API: https://api.openverse.engineering/
Source: https://github.com/WordPress/openverse
License: CC0

---

*/



(function () {
    'use strict';

    class NeuraVeil {
        constructor() {
            this.REASONING_LEVELS = ['auto', 'minimal', 'low', 'medium', 'high', 'ultra'];
            this.STYLE_OPTIONS = [
                { id: 'default', label: 'Default', desc: 'Balanced, natural' },
                { id: 'professional', label: 'Professional', desc: 'Clear, structured, formal' },
                { id: 'direct', label: 'Direct', desc: 'Short replies, no fluff' },
                { id: 'pedagogic', label: 'Teaching', desc: 'Step-by-step, clear explanations' },
                { id: 'creative', label: 'Creative', desc: 'Original, vivid language' },
                { id: 'technical', label: 'Technical', desc: 'Precise, dev-oriented' },
                { id: 'geek', label: 'Geek', desc: 'Tech jargon and references' },
                { id: 'persuasive', label: 'Persuasive', desc: 'Structured and convincing' }
            ];

            this.IMAGE_MODELS = [
                { id: 'pollinations', label: 'Pollinations' },
                { id: 'ai-horde', label: 'AI Horde' }
            ];
            this.IMAGE_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            this.INPUT_MAX_ROWS = 5;
            this.SIDEBAR_WIDTH = 430;
            this.DEFAULT_GREETING = 'Hello! I am NeuraVeil. How can I help you today?';
            this.hljsReady = null;
            this.hljsCssLoaded = false;
            this.host = null;
            this.shadow = null;
            this.elements = {};
            this.state = {
                isOpen: false,
                isTyping: false,
                loadingChatId: null,
                isSidebar: false,
                isHistoryOpen: false,
                isSettingsOpen: false,
                isInfoOpen: false,
                isGhostMode: false,
                isImageMode: false,
                sidebarSide: 'right',
                reasoningEffort: 'low',
                responseStyle: 'default',
                manualTitle: null,
                autoTitle: null,
                historySearchTerm: '',
                historySearchIndex: -1
            };
            this.history = [];
            this.filteredHistory = [];
            this.currentChatId = Date.now(); // Start with a new session ID
            this.messages = [
                { role: 'assistant', content: this.DEFAULT_GREETING }
            ];

            this.recognition = null;
            this.isRecording = false;
            this.ignoreNextTriggerClick = false;
            this.triggerDragState = null;
            this.panelPlacementRaf = null;

            this.init();
        }

        loadHighlightJS() {
            if (this.hljsReady) return this.hljsReady;

            this.hljsReady = new Promise((resolve) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
                this.shadow.appendChild(link);

                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
                script.onload = () => resolve();
                this.shadow.appendChild(script);
            });

            return this.hljsReady;
        }

        request(url, options = {}) {
            const gmRequest = typeof GM_xmlhttpRequest === 'function'
                ? GM_xmlhttpRequest
                : (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function' ? GM.xmlHttpRequest : null);
            if (gmRequest) {
                return this.requestWithGM(gmRequest, url, options);
            }

            const { responseType, ...fetchOptions } = options;
            return fetch(url, fetchOptions);
        }

        requestWithGM(gmRequest, url, options = {}) {
            const method = options.method || 'GET';
            const headers = options.headers || {};
            const data = options.body || null;
            const responseType = options.responseType || 'text';

            return new Promise((resolve, reject) => {
                gmRequest({
                    method,
                    url,
                    headers,
                    data,
                    responseType,
                    onload: (res) => {
                        const parsedHeaders = this.parseResponseHeaders(res.responseHeaders || '');
                        const responseText = typeof res.responseText === 'string' ? res.responseText : '';
                        const responseBody = res.response;
                        const decodeBuffer = (buffer) => {
                            if (!buffer) return '';
                            if (typeof TextDecoder !== 'undefined') {
                                return new TextDecoder().decode(buffer);
                            }
                            const bytes = new Uint8Array(buffer);
                            let out = '';
                            for (let i = 0; i < bytes.length; i += 1) {
                                out += String.fromCharCode(bytes[i]);
                            }
                            return out;
                        };

                        resolve({
                            ok: res.status >= 200 && res.status < 300,
                            status: res.status,
                            headers: parsedHeaders,
                            json: async () => {
                                if (responseBody && responseType === 'json') return responseBody;
                                const text = responseText ||
                                    (responseBody instanceof ArrayBuffer ? decodeBuffer(responseBody) : '') ||
                                    (responseBody instanceof Blob ? await responseBody.text() : '');
                                if (!text) return null;
                                return JSON.parse(text);
                            },
                            text: async () => {
                                if (responseText) return responseText;
                                if (responseBody instanceof ArrayBuffer) return decodeBuffer(responseBody);
                                if (responseBody instanceof Blob) return await responseBody.text();
                                return '';
                            },
                            blob: async () => {
                                if (responseBody instanceof Blob) return responseBody;
                                if (responseBody instanceof ArrayBuffer) return new Blob([responseBody]);
                                if (responseText) return new Blob([responseText]);
                                return new Blob();
                            }
                        });
                    },
                    onerror: (err) => reject(err),
                    ontimeout: () => reject(new Error('Request timed out'))
                });
            });
        }

        parseResponseHeaders(rawHeaders) {
            const headerMap = new Map();
            const lines = String(rawHeaders || '').trim().split(/\r?\n/);
            lines.forEach((line) => {
                const index = line.indexOf(':');
                if (index === -1) return;
                const key = line.slice(0, index).trim().toLowerCase();
                const value = line.slice(index + 1).trim();
                if (key) headerMap.set(key, value);
            });
            return {
                get(name) {
                    if (!name) return null;
                    return headerMap.get(String(name).toLowerCase()) || null;
                }
            };
        }



        init() {
            this.loadHistory();
            this.createHost();
            this.injectStyles();
            this.createUI();
            this.attachEvents();
            this.loadSavedReasoning();
            this.loadSavedStyle();
            this.loadSavedSidebarSide();
            this.restoreActiveChat();
            this.restoreActiveChat();
            this.updateGhostUI();
            this.setupSpeechRecognition();
            this.buildInfoContent();
        }

        loadSavedReasoning() {
            const savedReasoning = GM_getValue('NeuraVeil_reasoning', 'low');
            if (this.REASONING_LEVELS.includes(savedReasoning)) {
                this.state.reasoningEffort = savedReasoning;
                this.elements.modelSelect.value = savedReasoning;
            }
        }

        getReasoningEffort(level) {
            const mapping = {
                'auto': 'low',
                'minimal': 'low',
                'low': 'low',
                'medium': 'medium',
                'high': 'high',
                'ultra': 'high'
            };
            return mapping[level] || 'low';
        }

        createHost() {
            this.host = document.createElement('div');
            this.host.id = 'ghost-chat-host';
            this.host.style.position = 'fixed';
            this.host.style.bottom = '20px';
            this.host.style.right = '20px'; // Stacks comfortably with standard scrollbars
            this.host.style.width = '56px';
            this.host.style.height = '56px';
            this.host.style.zIndex = '2147483646'; // Just under PixelPicker if present
            this.host.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

            this.shadow = this.host.attachShadow({ mode: 'open' });
            document.body.appendChild(this.host);
            this.restoreTriggerPosition();
        }

        restoreTriggerPosition() {
            const raw = GM_getValue('NeuraVeil_trigger_pos', '');
            if (!raw) return;
            try {
                const pos = JSON.parse(raw);
                if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') return;
                const clamped = this.clampTriggerPosition(pos.x, pos.y);
                this.host.style.left = `${clamped.x}px`;
                this.host.style.top = `${clamped.y}px`;
                this.host.style.right = 'auto';
                this.host.style.bottom = 'auto';
            } catch (e) {
                // Ignore invalid saved position.
            }
        }

        resetTriggerPosition() {
            if (!this.host) return;
            this.host.style.left = 'auto';
            this.host.style.top = 'auto';
            this.host.style.right = '20px';
            this.host.style.bottom = '20px';
        }

        clampTriggerPosition(x, y) {
            const hostWidth = this.host.offsetWidth || 56;
            const hostHeight = this.host.offsetHeight || 56;
            const maxX = Math.max(0, window.innerWidth - hostWidth);
            const maxY = Math.max(0, window.innerHeight - hostHeight);
            return {
                x: Math.min(Math.max(0, Math.round(x)), maxX),
                y: Math.min(Math.max(0, Math.round(y)), maxY)
            };
        }

        resetPanelPlacement() {
            if (!this.elements.panel) return;
            this.elements.panel.style.position = '';
            this.elements.panel.style.left = '';
            this.elements.panel.style.top = '';
            this.elements.panel.style.right = '';
            this.elements.panel.style.bottom = '';
            this.elements.panel.style.transformOrigin = '';
        }

        schedulePanelPlacement() {
            if (this.panelPlacementRaf) {
                cancelAnimationFrame(this.panelPlacementRaf);
            }
            this.panelPlacementRaf = requestAnimationFrame(() => {
                this.panelPlacementRaf = null;
                this.updatePanelPlacement();
            });
        }

        updatePanelPlacement() {
            if (!this.elements.panel || !this.host) return;
            if (this.state.isSidebar) {
                this.resetPanelPlacement();
                return;
            }

            const panel = this.elements.panel;
            const hostRect = this.host.getBoundingClientRect();
            const panelWidth = panel.offsetWidth || 425;
            const panelHeight = panel.offsetHeight || 500;
            const hostWidth = this.host.offsetWidth || 56;
            const hostHeight = this.host.offsetHeight || 56;
            const gap = 12;
            const padding = 8;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const spaceLeft = hostRect.left;
            const spaceRight = viewportWidth - hostRect.right;
            const spaceAbove = hostRect.top;
            const spaceBelow = viewportHeight - hostRect.bottom;

            let openRight = spaceRight >= spaceLeft;
            if (spaceRight < panelWidth && spaceLeft >= panelWidth) {
                openRight = false;
            } else if (spaceRight >= panelWidth && spaceLeft < panelWidth) {
                openRight = true;
            }

            let openAbove = spaceAbove >= spaceBelow;
            if (spaceAbove < panelHeight && spaceBelow >= panelHeight) {
                openAbove = false;
            } else if (spaceAbove >= panelHeight && spaceBelow < panelHeight) {
                openAbove = true;
            }

            let left = openRight ? 0 : (hostWidth - panelWidth);
            let top = openAbove ? (-panelHeight - gap) : (hostHeight + gap);

            const clampToViewport = () => {
                const absLeft = hostRect.left + left;
                const absTop = hostRect.top + top;
                const clampedLeft = Math.min(Math.max(padding, absLeft), viewportWidth - panelWidth - padding);
                const clampedTop = Math.min(Math.max(padding, absTop), viewportHeight - panelHeight - padding);
                left += clampedLeft - absLeft;
                top += clampedTop - absTop;
            };

            clampToViewport();

            const hostOnLeft = (hostRect.left + (hostWidth / 2)) <= (viewportWidth / 2);
            let absLeft = hostRect.left + left;
            let absTop = hostRect.top + top;
            const overlapsHost = absLeft < hostRect.right &&
                (absLeft + panelWidth) > hostRect.left &&
                absTop < hostRect.bottom &&
                (absTop + panelHeight) > hostRect.top;

            if (overlapsHost) {
                if (hostOnLeft) {
                    const targetLeft = hostRect.right + gap;
                    const shift = targetLeft - absLeft;
                    if (shift > 0) left += shift;
                } else {
                    const targetRight = hostRect.left - gap;
                    const shift = targetRight - (absLeft + panelWidth);
                    if (shift < 0) left += shift;
                }
                clampToViewport();
            }

            panel.style.position = 'absolute';
            panel.style.left = `${left}px`;
            panel.style.top = `${top}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.style.transformOrigin = `${openRight ? 'left' : 'right'} ${openAbove ? 'bottom' : 'top'}`;
        }

        // CSS styles are not loaded from GitHub, as GreasyFork blocks external script connections.
        //Styles are provided through an approved GreasyFork library instead.
        injectStyles() {
            const style = document.createElement('style');
            style.textContent = NEURAVEIL_CSS;
            this.shadow.appendChild(style);
        }

        createUI() {
            const trigger = document.createElement('div');
            trigger.className = 'nv-trigger';
            trigger.innerHTML = `
                <svg viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                  <path d="M7 9h10v2H7zm0-4h10v2H7z"/>
                </svg>
            `;

            // Panel
            const panel = document.createElement('div');
            panel.className = 'nv-panel';
            panel.innerHTML = `
                <div class="nv-header">
                    <div class="nv-header-main">
                        <div class="nv-header-left">
                            <div class="nv-title">
                                <img src="https://raw.githubusercontent.com/DREwX-code/NeuraVeil/refs/heads/main/assets/icon/Icon_NeuraVeil_Script.png" class="nv-status-logo" alt="NeuraVeil logo">
                                <span>NeuraVeil AI</span>
                                <button class="nv-title-toggle" id="nv-btn-toggle-extra" title="More">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="nv-header-right">
                         <button class="nv-btn-icon" id="nv-btn-new" title="New Chat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                        <button class="nv-btn-icon" id="nv-btn-history" title="History">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </button>
                        <div class="nv-sidebar-toggle">
                            <button class="nv-btn-icon" id="nv-btn-sidebar" title="Toggle Sidebar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                            </button>
                            <button class="nv-sidebar-arrow" id="nv-btn-sidebar-arrow" title="Move Sidebar" aria-label="Move Sidebar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                        </div>
                        </div>
                        <button class="nv-btn-icon" id="nv-btn-close" title="Close" style="margin-left: 8px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
                <div class="nv-header-extra" id="nv-header-extra">
                    <button class="nv-btn-icon" id="nv-btn-settings" title="Settings">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        </svg>
                    </button>

                    <button class="nv-btn-icon" id="nv-btn-ghost" title="Ghost Mode">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a8 8 0 0 0-8 8v12l3-2 2.5 2 2.5-2 2.5 2 2.5-2 3 2V10a8 8 0 0 0-8-8z"></path>
                            <circle cx="9" cy="11" r="1" fill="currentColor"></circle>
                            <circle cx="15" cy="11" r="1" fill="currentColor"></circle>
                        </svg>
                    </button>

                <button class="nv-btn-icon" id="nv-btn-info" title="Info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="8"></line>
                    </svg>
                </button>
            </div>
                <div class="nv-settings" id="nv-settings-panel">
                    <button class="nv-panel-close" id="nv-settings-close" title="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div class="nv-settings-title">Choose how NeuraVeil should respond.</div>
                    <div class="nv-settings-list" id="nv-settings-list"></div>
                    <div class="nv-settings-danger">
                        <div class="nv-danger-title">Danger Zone</div>
                        <div class="nv-danger-desc">Reset all data stored by NeuraVeil, including settings and conversations.</div>
                        <button class="nv-danger-btn" id="nv-btn-reset-all" type="button">Reset all data</button>
                    </div>
                </div>

                <div class="nv-info" id="nv-info-panel">
                    <button class="nv-panel-close" id="nv-info-close" title="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div class="nv-info-title">Information</div>

                    <div class="nv-info-grid">
                        <div class="nv-info-card variant-a">
                            <h4>Version</h4>
                            <p>1.1.3<br>Last updated: 2026-01-06</p>
                        </div>

                        <div class="nv-info-card variant-b">
                            <h4>Author</h4>
                            <p>Dℝ∃wX / @DREwX-code</p>
                            <div class="nv-info-links">
                            <!--  GreasyFork SVG icon by denilsonsa
                            Source: https://github.com/denilsonsa/denilsonsa.github.io/blob/master/icons/GreasyFork.svg -->

                            <a class="nv-info-link" href="https://greasyfork.org/users/1259433-d%E2%84%9D-wx" target="_blank" rel="noopener noreferrer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 96 96"
                                    width="18"
                                    height="18"
                                    aria-hidden="true">
                                    <circle fill="#000" r="48" cy="48" cx="48"/>

                                    <clipPath id="GreasyForkCircleClip">
                                        <circle r="47" cy="48" cx="48"/>
                                    </clipPath>

                                    <text
                                        fill="#fff"
                                        clip-path="url(#GreasyForkCircleClip)"
                                        text-anchor="middle"
                                        font-size="18"
                                        font-family="'DejaVu Sans', Verdana, Arial, sans-serif"
                                        letter-spacing="-0.75"
                                        pointer-events="none">
                                        <tspan x="51" y="13">= null;</tspan>
                                        <tspan x="56" y="35">function init</tspan>
                                        <tspan x="49" y="57">for (var i = 0;</tspan>
                                        <tspan x="50" y="79">XmlHttpReq</tspan>
                                    </text>

                                    <path fill="#000" stroke="#000" stroke-width="4"
                                        d="M 44,29 a6.36,6.36 0,0,1 0,9 l36,36 a3.25,3.25 0,0,1 -6.5,6.5 l-36,-36 a6.36,6.36 0,0,1 -9,0 l-19,-19 a1.77,1.77 0,0,1 0,-2.5 l13,-13 a1.77,1.77 0,0,1 2.5,0 z"/>
                                    <path fill="#fff"
                                        d="M 44,29 a6.36,6.36 0,0,1 0,9 l36,36 a3.25,3.25 0,0,1 -6.5,6.5 l-36,-36 a6.36,6.36 0,0,1 -9,0 l-19,-19 a1.77,1.77 0,0,1 2.5,-2.5 l14,14 4,-4 -14,-14 a1.77,1.77 0,0,1 2.5,-2.5 l14,14 4,-4 -14,-14 a1.77,1.77 0,0,1 2.5,-2.5 z"/>
                                </svg>
                                <span>GreasyFork</span>
                            </a>

                                <a class="nv-info-link" href="https://github.com/DREwX-code" target="_blank" rel="noopener noreferrer">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 .5a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.89 1.53 2.34 1.09 2.9.84.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 .5Z"></path>
                                    </svg>
                                    <span>GitHub</span>
                                </a>
                            </div>
                        </div>

                        <div class="nv-info-card variant-c">
                            <h4>About</h4>
                            <p>
                                NeuraVeil is a modern, in-browser floating chat panel.
                                AI responses are served through the open-source Pollinations endpoints.
                            </p>
                            <div class="nv-info-links">
                               <a class="nv-info-link" href="https://hello.pollinations.ai/" target="_blank" rel="noopener noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="18" height="18">
                                <path style="fill: #ffffff; stroke:none;" d="M117 74C107.231 69.7971 97.4206 70 87 70L52 70L52 107C52 110.655 53.2747 117.433 50.3966 120.258C48.1657 122.447 43.882 122.231 41 122.808C35.1822 123.972 29.5012 125.801 24 128C21.3907 129.043 17.0648 130.003 16.4113 133.225C15.6968 136.746 18.2516 140.896 19.5787 144C23.188 152.441 27.7557 160.567 33.152 168C50.9487 192.515 77.3192 210.861 108 213.83C118.888 214.884 129.237 212.462 140 212C125.587 230.759 99.6636 220.161 84.4676 238.039C78.6982 244.827 78.5571 252.541 74.686 259.961C72.9705 263.249 69.6858 265.254 67.3403 268.039C63.8007 272.243 62.0938 277.553 62.0185 283C61.8036 298.545 78.8554 310.043 92.9992 301.772C102.52 296.204 106.408 281.672 100.772 272C96.8944 265.347 86.5961 262.749 90.3326 254C90.931 252.599 91.7547 251.238 92.6381 250C101.601 237.442 113.768 239.897 127 236.985C137.36 234.704 147.836 226.835 152 217C154.779 226.403 153 238.218 153 248C153 251.884 153.906 257.17 152.397 260.826C150.949 264.332 146.877 266.226 144.533 269.09C140.18 274.412 138.999 282.381 140.529 289C144.901 307.913 175.241 310.054 179.61 290C181.098 283.167 180.419 274.449 175.775 269.015C172.912 265.665 167.505 263.426 166.318 258.957C165.189 254.703 166 249.376 166 245L166 216C172.604 225.708 180.285 233.672 192 236.841C204.523 240.229 217.395 236.967 226.211 249.015C227.119 250.256 227.965 251.607 228.622 253C233.092 262.474 224.541 263.812 220.367 271.004C214.765 280.655 216.493 294.343 226.04 300.891C239.871 310.378 258.868 299.388 258.921 283C258.939 277.263 256.585 271.366 252.671 267.184C250.261 264.608 246.831 262.996 244.988 259.907C240.975 253.18 240.953 245.377 235.671 239.001C220.088 220.189 193.289 231.272 179 211C220.766 221.806 262.92 202.625 287.279 168C292.398 160.724 296.656 153.096 300.306 145C301.801 141.683 304.067 137.891 303.758 134.105C303.436 130.158 299.126 129.026 296 127.811C290.487 125.669 284.79 123.891 279 122.665C276.34 122.102 272.709 122.206 271.028 119.682C268.671 116.143 270 109.069 270 105L270 70C254.015 70 237.979 69.6221 222 70.0147C217.521 70.1247 209.398 73.8076 205.39 71.7986C201.137 69.6665 198.637 60.852 195.961 57C189.174 47.2314 181.112 38.1938 173.576 29C170.613 25.3861 167.03 19.1444 162.718 17.0864C157.356 14.5276 151.106 25.6572 148.389 29C136.831 43.2172 124.121 56.896 117 74z"/>
                                <path style="fill: #2d272d; stroke:none;" d="M160 35C152.305 45.2098 143.241 54.4271 136.029 65C133.56 68.6192 129.073 74.3338 129.531 79C129.856 82.3064 132.842 84.7733 135.001 87C138.664 90.7792 142.224 94.6598 145.226 99C153.533 111.01 158.843 126.459 160 141C161.926 136.453 161.862 130.85 163.155 126C165.627 116.73 169.708 107.989 175.004 100C178.458 94.7897 182.528 90.3951 186.995 86.0394C189.003 84.0818 192.151 81.9398 192.469 78.9105C192.899 74.8216 189.102 70.1842 186.996 67C181.889 59.2763 175.989 52.1183 170.081 45C166.983 41.2669 164.376 37.2171 160 35M65 82L65 121C75.0069 122.864 84.4971 124.572 94 128.452C101.279 131.424 107.81 135.902 115 139C110.199 121.923 109.754 104.422 113 87C98.9518 79.627 80.3718 82 65 82M208 137C219.691 133.301 229.731 126.171 242 123.425C245.878 122.557 254.396 122.791 256.972 119.411C258.89 116.896 258 111.96 258 109L258 82C246.617 82 235.323 82.8069 224 82.9969C220.024 83.0636 212.653 82.9235 210.067 86.7022C207.731 90.116 210.789 98.0842 210.961 102C211.49 114.091 208.946 125.113 208 137M196 94C191.363 98.6498 186.899 103.36 183.464 109C172.159 127.559 172 148.966 172 170C188.418 157.915 198.086 133.947 198.961 114C199.235 107.743 199.971 99.1619 196 94M124 95C124 104.506 123.061 114.568 124.289 124C126.328 139.645 135.703 158.053 148 168C148 148.709 148.092 130.69 139.241 113C135.823 106.17 131.089 98.3335 124 95M255 134C245.951 136.75 236.857 137.609 228 141.428C206.487 150.705 187.042 170.398 178 192C188.462 189.509 199.429 192.223 210 190.7C228.373 188.052 242.658 173.125 250.218 157C253.094 150.866 257.72 140.67 255 134M32 139C38.7435 162.409 62.103 186.191 85 194C80.1511 187.986 73.9628 183.236 69.2392 177C60.376 165.299 54.1676 149.673 53 135C45.5584 135.021 39.0339 136.712 32 139M66 135C66.4916 158.691 84.575 184.411 108 190.1C119.096 192.795 130.885 189.354 142 192C131.782 162.517 97.5878 135.652 66 135M269 135C267.131 149.474 261.907 164.163 253.243 176C248.691 182.219 242.611 186.971 238 193C261.173 183.35 279.485 161.855 289 139C282.473 136.913 275.872 135.295 269 135M236 193L237 194L236 193M140 211L141 212L140 211M81.0046 274.667C71.0189 276.698 73.7819 292.76 83.9954 291.091C94.4016 289.391 91.2993 272.573 81.0046 274.667M236.015 274.617C226.584 276.801 229.341 293.034 238.996 291.319C249.603 289.434 246.583 272.169 236.015 274.617M157.108 275.746C148.366 279.349 154.028 294.967 162.981 290.781C172.528 286.318 166.733 271.779 157.108 275.746z"/>
                                </svg>
                                <span>Site Pollinations</span>
                                </a>
                                <a class="nv-info-link" href="https://github.com/pollinations/pollinations" target="_blank" rel="noopener noreferrer">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 .5a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.89 1.53 2.34 1.09 2.9.84.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 .5Z"></path>
                                    </svg>
                                    <span>GitHub Pollinations</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="nv-info-support">
                        <div class="nv-info-support-title">
                            <svg viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.8 4.6c-1.5-1.7-4.2-1.7-5.7 0L12 7.7 8.9 4.6c-1.6-1.7-4.2-1.7-5.7 0-1.9 2-1.8 5.1.2 7.1L12 21l8.6-9.3c2-2 2.1-5.1.2-7.1z"></path>
                            </svg>
                            <span>Support the project :</span>
                        </div>
                        <div class="nv-info-support-links">
                            <a class="nv-support-link" href="https://greasyfork.org/en/scripts/560252-neuraveil-ai-chat-in-your-browser/feedback" target="_blank" rel="noopener noreferrer" style="--nv-support-accent: 96, 165, 250;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span>Feedback GreasyFork</span>
                            </a>
                            <a class="nv-support-link" href="https://github.com/DREwX-code/NeuraVeil" target="_blank" rel="noopener noreferrer" style="--nv-support-accent: 251, 191, 36;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.4 21 12 17.6 5.6 21 7 14.1 2 9.3 9 8.5 12 2"></polygon>
                                </svg>
                                <span>Star the project</span>
                            </a>
                            <a class="nv-support-link" href="https://github.com/DREwX-code/NeuraVeil/issues" target="_blank" rel="noopener noreferrer" style="--nv-support-accent: 239, 68, 68;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M10 4h4v2h-4z"></path>
                                    <rect x="7" y="8" width="10" height="10" rx="2"></rect>
                                    <path d="M5 10h2"></path>
                                    <path d="M17 10h2"></path>
                                    <path d="M5 14h2"></path>
                                    <path d="M17 14h2"></path>
                                </svg>
                                <span>GitHub Issues</span>
                            </a>
                        </div>
                    </div>
                </div>


                <div class="nv-history" id="nv-history-panel">
                    <div class="nv-history-header">
                        <span>Recent Conversations</span>
                        <div class="nv-history-actions">
                            <div class="nv-history-search" id="nv-history-search">
                                <button class="nv-search-btn" id="nv-btn-history-search" title="Search for discussions">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="6"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke-linecap="round"/></svg>
                                </button>
                                <input type="text" class="nv-search-input" id="nv-input-history-search" placeholder="Search..." spellcheck="false" aria-label="Search conversations">
                            </div>
                            <button class="nv-clear-all" id="nv-btn-clear-all" title="Clear All History">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="nv-history-list" id="nv-history-list"></div>
                </div>

                <div class="nv-messages" id="nv-messages">
                    <div class="typing-indicator" id="typing-indicator">
                        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                        <span id="nv-typing-text" style="margin-left:8px; font-size:11px; color:var(--nv-text-muted); display:none; animation: fadeIn 0.3s;"></span>
                    </div>
                </div>
                <div class="nv-input-area">
                    <div class="nv-input-wrapper">
                        <textarea class="nv-input" placeholder="Type a message..." spellcheck="false" rows="1"></textarea>
                        <div class="nv-controls-row">
                             <button class="nv-img-btn-small" id="nv-btn-img-toggle" title="Image Mode">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                             </button>
                             <select class="nv-model-select" id="nv-model-select" title="Model Selection">
                                <option value="auto">Reasoning: Auto</option>
                                <option value="minimal">Reasoning: Minimal</option>
                                <option value="low" selected>Reasoning: Low</option>
                                <option value="medium">Reasoning: Medium</option>
                                <option value="high">Reasoning: High</option>
                                <option value="ultra">Reasoning: Ultra</option>
                             </select>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: baseline;">
                        <button class="nv-img-btn-small" id="nv-btn-mic" title="Voice Input" style="margin-top: 13px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </button>
                        <button class="nv-send-btn" style="margin-top: 1px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                    <span class="nv-ghost-pill" id="nv-ghost-pill">Mode fantome actif</span>
                </div>

                <div class="nv-modal-overlay" id="nv-modal-overlay">
                    <div class="nv-modal">
                        <div class="nv-modal-text" id="nv-modal-text">Are you sure?</div>
                        <div class="nv-modal-actions">
                            <button class="nv-btn nv-btn-secondary" id="nv-modal-cancel">Cancel</button>
                            <button class="nv-btn nv-btn-danger" id="nv-modal-confirm">Delete</button>
                        </div>
                    </div>
                </div>
            `;

            this.shadow.appendChild(trigger);
            this.shadow.appendChild(panel);

            this.elements = {
                trigger,
                panel,
                closeBtn: panel.querySelector('#nv-btn-close'),
                sidebarBtn: panel.querySelector('#nv-btn-sidebar'),
                sidebarArrow: panel.querySelector('#nv-btn-sidebar-arrow'),
                historyBtn: panel.querySelector('#nv-btn-history'),
                newChatBtn: panel.querySelector('#nv-btn-new'),
                clearAllBtn: panel.querySelector('#nv-btn-clear-all'),
                modelSelect: panel.querySelector('#nv-model-select'),
                toggleExtraBtn: panel.querySelector('#nv-btn-toggle-extra'),
                headerExtra: panel.querySelector('#nv-header-extra'),
                settingsBtn: panel.querySelector('#nv-btn-settings'),
                ghostBtn: panel.querySelector('#nv-btn-ghost'),
                ghostPill: panel.querySelector('#nv-ghost-pill'),
                statusLogo: panel.querySelector('.nv-status-logo'),
                infoBtn: panel.querySelector('#nv-btn-info'),
                settingsPanel: panel.querySelector('#nv-settings-panel'),
                settingsCloseBtn: panel.querySelector('#nv-settings-close'),
                settingsList: panel.querySelector('#nv-settings-list'),
                resetAllBtn: panel.querySelector('#nv-btn-reset-all'),
                infoPanel: panel.querySelector('#nv-info-panel'),
                infoCloseBtn: panel.querySelector('#nv-info-close'),
                historyPanel: panel.querySelector('#nv-history-panel'),
                historyList: panel.querySelector('#nv-history-list'),
                historySearchWrap: panel.querySelector('#nv-history-search'),
                historySearchInput: panel.querySelector('#nv-input-history-search'),
                historySearchBtn: panel.querySelector('#nv-btn-history-search'),
                msgContainer: panel.querySelector('#nv-messages'),
                input: panel.querySelector('.nv-input'),
                sendBtn: panel.querySelector('.nv-send-btn'),
                micBtn: panel.querySelector('#nv-btn-mic'),
                imgBtn: panel.querySelector('#nv-btn-img-toggle'),
                typingIndicator: panel.querySelector('#typing-indicator'),
                typingText: panel.querySelector('#nv-typing-text'),
                modalOverlay: panel.querySelector('#nv-modal-overlay'),
                modalText: panel.querySelector('#nv-modal-text'),
                modalCancel: panel.querySelector('#nv-modal-cancel'),
                modalConfirm: panel.querySelector('#nv-modal-confirm')
            };

            this.buildSettingsOptions();
        }

        attachEvents() {
            this.elements.trigger.addEventListener('click', () => {
                if (this.ignoreNextTriggerClick) {
                    this.ignoreNextTriggerClick = false;
                    return;
                }
                this.togglePanel(!this.state.isOpen);
            });
            this.initTriggerDrag();
            this.elements.closeBtn.addEventListener('click', () => this.togglePanel(false));

            this.elements.sidebarBtn.addEventListener('click', () => this.toggleSidebar());
            if (this.elements.sidebarArrow) {
                this.elements.sidebarArrow.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleSidebarSide(true);
                    this.temporarilyHideSidebarArrow();
                    this.elements.sidebarArrow.blur();
                });
            }
            this.elements.historyBtn.addEventListener('click', () => this.toggleHistory());
            this.elements.newChatBtn.addEventListener('click', () => this.startNewChat());
            this.elements.clearAllBtn.addEventListener('click', () => this.clearAllHistory());
            this.elements.historySearchBtn.addEventListener('click', () => this.toggleHistorySearch());
            this.elements.historySearchInput.addEventListener('input', (e) => this.handleHistorySearch(e.target.value));
            this.bindInputKeyShield(this.elements.historySearchInput);
            this.elements.historySearchInput.addEventListener('keydown', (e) => this.handleHistorySearchKeydown(e));
            this.elements.historySearchInput.addEventListener('blur', () => this.handleHistorySearchBlur());
            this.elements.modelSelect.addEventListener('change', (e) => this.changeReasoningEffort(e.target.value));
            this.elements.toggleExtraBtn.addEventListener('click', () => this.toggleHeaderExtra());
            this.elements.settingsBtn.addEventListener('click', () => this.toggleSettingsPanel());
            this.elements.infoBtn.addEventListener('click', () => this.toggleInfoPanel());
            this.elements.ghostBtn.addEventListener('click', () => this.toggleGhostMode());
            if (this.elements.settingsCloseBtn) {
                this.elements.settingsCloseBtn.addEventListener('click', () => this.closeSettingsPanel());
            }
            if (this.elements.resetAllBtn) {
                this.elements.resetAllBtn.addEventListener('click', () => this.resetAllData());
            }
            if (this.elements.infoCloseBtn) {
                this.elements.infoCloseBtn.addEventListener('click', () => this.closeInfoPanel());
            }
            window.addEventListener('resize', () => this.schedulePanelPlacement());
            const sidebarToggle = this.elements.sidebarBtn?.closest('.nv-sidebar-toggle');
            if (sidebarToggle) {
                sidebarToggle.addEventListener('mouseleave', () => this.temporarilyHideSidebarArrow());
                sidebarToggle.addEventListener('focusout', (e) => {
                    if (!sidebarToggle.contains(e.relatedTarget)) {
                        this.temporarilyHideSidebarArrow();
                    }
                });
            }
            this.elements.panel.addEventListener('focusout', (e) => {
                if (!this.elements.panel.contains(e.relatedTarget)) {
                    this.temporarilyHideSidebarArrow();
                }
            });

            this.elements.micBtn.addEventListener('click', () => this.toggleSpeech());
            this.elements.sendBtn.addEventListener('click', () => this.handleSend());
            this.elements.imgBtn.addEventListener('click', () => this.toggleImageMode());

            this.elements.input.addEventListener('input', () => this.adjustHeight());
            this.bindInputKeyShield(this.elements.input);
            this.elements.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });

            // Close logic for floating mode
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.state.isOpen) this.togglePanel(false);
            });
            document.addEventListener('mousedown', (e) => this.handleOutsideHistoryClick(e));

            this.autoResizeInput();
        }

        bindInputKeyShield(el) {
            if (!el) return;
            const stop = (e) => e.stopPropagation();
            el.addEventListener('keydown', stop);
            el.addEventListener('keypress', stop);
            el.addEventListener('keyup', stop);
        }

        initTriggerDrag() {
            if (!this.elements.trigger || !this.host) return;
            const trigger = this.elements.trigger;
            const state = {
                active: false,
                pointerId: null,
                startX: 0,
                startY: 0,
                originX: 0,
                originY: 0,
                holdTimer: null
            };
            this.triggerDragState = state;

            const startDrag = () => {
                if (state.active) return;
                state.active = true;
                this.ignoreNextTriggerClick = true;
                trigger.classList.add('grabbing');
            };

            const onPointerDown = (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                state.pointerId = e.pointerId;
                state.startX = e.clientX;
                state.startY = e.clientY;
                const rect = this.host.getBoundingClientRect();
                state.originX = rect.left;
                state.originY = rect.top;
                trigger.setPointerCapture(e.pointerId);
                state.holdTimer = setTimeout(() => startDrag(), 180);
            };

            const onPointerMove = (e) => {
                if (state.pointerId !== e.pointerId) return;
                const dx = e.clientX - state.startX;
                const dy = e.clientY - state.startY;
                const distance = Math.hypot(dx, dy);

                if (!state.active) {
                    if (distance < 6) return;
                    if (state.holdTimer) {
                        clearTimeout(state.holdTimer);
                        state.holdTimer = null;
                    }
                    startDrag();
                }

                if (!state.active) return;
                e.preventDefault();

                const pos = this.clampTriggerPosition(state.originX + dx, state.originY + dy);
                this.host.style.left = `${pos.x}px`;
                this.host.style.top = `${pos.y}px`;
                this.host.style.right = 'auto';
                this.host.style.bottom = 'auto';
                this.schedulePanelPlacement();
            };

            const finish = (e) => {
                if (state.holdTimer) {
                    clearTimeout(state.holdTimer);
                    state.holdTimer = null;
                }
                const wasDragging = state.active;
                state.active = false;
                state.pointerId = null;
                trigger.classList.remove('grabbing');
                if (wasDragging) {
                    const rect = this.host.getBoundingClientRect();
                    const pos = this.clampTriggerPosition(rect.left, rect.top);
                    this.host.style.left = `${pos.x}px`;
                    this.host.style.top = `${pos.y}px`;
                    this.host.style.right = 'auto';
                    this.host.style.bottom = 'auto';
                    GM_setValue('NeuraVeil_trigger_pos', JSON.stringify(pos));
                    this.ignoreNextTriggerClick = true;
                    this.schedulePanelPlacement();
                }
                if (e && e.pointerId !== undefined) {
                    try { trigger.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
                }
            };

            trigger.addEventListener('pointerdown', onPointerDown);
            trigger.addEventListener('pointermove', onPointerMove);
            trigger.addEventListener('pointerup', finish);
            trigger.addEventListener('pointercancel', finish);
        }

        toggleHeaderExtra() {
            const isOpen = this.elements.headerExtra.classList.toggle('open');
            this.elements.toggleExtraBtn.classList.toggle('open', isOpen);
            if (!isOpen) {
                this.state.isSettingsOpen = false;
                this.elements.settingsPanel.classList.remove('visible');
                this.state.isInfoOpen = false;
                this.elements.infoPanel.classList.remove('visible');
            }
        }

        toggleSettingsPanel() {
            this.state.isSettingsOpen = !this.state.isSettingsOpen;
            this.elements.settingsPanel.classList.toggle('visible', this.state.isSettingsOpen);
            if (this.state.isSettingsOpen) {
                this.state.isHistoryOpen = false;
                this.elements.historyPanel.classList.remove('visible');
                this.setHistoryButtonActive(false);
                this.state.isInfoOpen = false;
                this.elements.infoPanel.classList.remove('visible');
            }
        }

        closeSettingsPanel() {
            this.state.isSettingsOpen = false;
            this.elements.settingsPanel.classList.remove('visible');
            this.collapseHeaderExtra();
        }

        toggleGhostMode() {
            this.state.isGhostMode = !this.state.isGhostMode;
            if (this.state.isGhostMode) {
                this.state.isHistoryOpen = false;
                this.elements.historyPanel.classList.remove('visible');
                this.setHistoryButtonActive(false);
            }
            this.updateGhostUI();
            this.updateBodyOffset();
        }

        toggleInfoPanel() {
            this.state.isInfoOpen = !this.state.isInfoOpen;
            this.elements.infoPanel.classList.toggle('visible', this.state.isInfoOpen);
            if (this.state.isInfoOpen) {
                this.state.isHistoryOpen = false;
                this.state.isSettingsOpen = false;
                this.elements.historyPanel.classList.remove('visible');
                this.setHistoryButtonActive(false);
                this.elements.settingsPanel.classList.remove('visible');
            }
        }

        closeInfoPanel() {
            this.state.isInfoOpen = false;
            this.elements.infoPanel.classList.remove('visible');
            this.collapseHeaderExtra();
        }

        collapseHeaderExtra() {
            if (this.elements.headerExtra.classList.contains('open')) {
                this.toggleHeaderExtra();
            }
        }

        updateGhostUI() {
            const active = this.state.isGhostMode;
            this.elements.ghostBtn.classList.toggle('ghost-active', active);
            this.elements.panel.classList.toggle('ghost-mode', active);
            if (this.elements.statusLogo) {
                this.elements.statusLogo.classList.toggle('ghost-active', active);
            }
            this.elements.ghostPill.textContent = active ? 'Ghost Mode is active — nothing is being saved.' : '';
            this.elements.ghostPill.classList.toggle('visible', active);

            // Refresh model select if in image mode
            if (this.state.isImageMode) {
                this.renderModelSelect();
            }
        }

        buildSettingsOptions() {
            this.elements.settingsList.innerHTML = '';
            this.STYLE_OPTIONS.forEach((option) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'nv-settings-item';
                button.dataset.style = option.id;
                button.innerHTML = `
                    <div class="nv-settings-label">${option.label}</div>
                    <div class="nv-settings-desc">${option.desc}</div>
                `;
                button.addEventListener('click', () => this.setResponseStyle(option.id));
                this.elements.settingsList.appendChild(button);
            });
            this.applyActiveStyle();
        }

        buildInfoContent() {
            const infoPanel = this.elements.infoPanel;
            if (!infoPanel) return;
            // content is static in markup; hook for future dynamic updates if needed
        }

        loadSavedStyle() {
            const savedStyle = GM_getValue('NeuraVeil_style', 'default');
            if (this.STYLE_OPTIONS.some(option => option.id === savedStyle)) {
                this.state.responseStyle = savedStyle;
            }
            this.applyActiveStyle();
        }

        loadSavedSidebarSide() {
            const savedSide = GM_getValue('NeuraVeil_sidebar_side', 'right');
            if (savedSide === 'left' || savedSide === 'right') {
                this.state.sidebarSide = savedSide;
            }
            this.applySidebarSide();
        }

        setResponseStyle(styleId) {
            if (!this.STYLE_OPTIONS.some(option => option.id === styleId)) return;
            this.state.responseStyle = styleId;
            GM_setValue('NeuraVeil_style', styleId);
            this.applyActiveStyle();
        }

        applyActiveStyle() {
            const items = this.elements.settingsList.querySelectorAll('.nv-settings-item');
            items.forEach((item) => {
                item.classList.toggle('active', item.dataset.style === this.state.responseStyle);
            });
        }

        applySidebarSide() {
            if (!this.elements.panel) return;
            const isLeft = this.state.sidebarSide === 'left';
            this.elements.panel.classList.toggle('sidebar-left', isLeft);
            this.updateBodyOffset();
        }

        toggleSidebarSide(animate = false) {
            const nextSide = this.state.sidebarSide === 'left' ? 'right' : 'left';
            this.setSidebarSide(nextSide, animate);
        }

        setSidebarSide(side, animate = false) {
            if (side !== 'left' && side !== 'right') return;
            if (this.state.sidebarSide === side) return;

            const applySide = () => {
                this.state.sidebarSide = side;
                GM_setValue('NeuraVeil_sidebar_side', side);
                this.applySidebarSide();
            };

            if (animate && this.state.isSidebar && this.state.isOpen) {
                this.elements.panel.classList.remove('open');
                this.elements.panel.classList.add('animating-out');
                setTimeout(() => {
                    applySide();
                    this.elements.panel.classList.remove('animating-out');
                    this.elements.panel.classList.add('open');
                }, 360);
                return;
            }

            applySide();
        }

        temporarilyHideSidebarArrow() {
            const toggle = this.elements.sidebarBtn?.closest('.nv-sidebar-toggle');
            if (!toggle) return;
            toggle.classList.add('arrow-hidden');
            setTimeout(() => {
                toggle.classList.remove('arrow-hidden');
            }, 600);
        }

        autoResizeInput() {
            if (!this.elements.input) return;
            const el = this.elements.input;

            // Reset to 1 row to get accurate scrollHeight
            el.rows = 1;

            const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
            const padding = parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom);

            // Calculate how many rows we need
            const contentHeight = el.scrollHeight - padding;
            const calculatedRows = Math.ceil(contentHeight / lineHeight);

            // Limit to INPUT_MAX_ROWS (5)
            const newRows = Math.min(calculatedRows, this.INPUT_MAX_ROWS);
            el.rows = newRows;

            // Enable scroll if content exceeds max rows
            if (calculatedRows > this.INPUT_MAX_ROWS) {
                el.style.overflowY = 'auto';
            } else {
                el.style.overflowY = 'hidden';
            }
        }

        adjustHeight() {
            this.autoResizeInput();
            // Scroll to bottom of textarea
            if (this.elements.input) {
                this.elements.input.scrollTop = this.elements.input.scrollHeight;
            }
        }

        async ensureHighlight() {
            if (this.hljsReady) return this.hljsReady;
            this.hljsReady = new Promise((resolve) => {
                if (!this.hljsCssLoaded) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
                    this.shadow.appendChild(link);
                    this.hljsCssLoaded = true;
                }

                if (window.hljs) {
                    resolve(window.hljs);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
                script.onload = () => resolve(window.hljs || null);
                script.onerror = () => resolve(null);
                this.shadow.appendChild(script);
            });
            return this.hljsReady;
        }

        applyHighlighting(container) {
            this.loadHighlightJS().then(() => {
                container.querySelectorAll('pre code').forEach(codeEl => {
                    hljs.highlightElement(codeEl);
                });
            });
        }



        copyTextToClipboard(text, button, variant) {
            if (!text) return;
            const fallbackCopy = () => {
                const area = document.createElement('textarea');
                area.value = text;
                area.setAttribute('readonly', '');
                area.style.position = 'fixed';
                area.style.top = '-9999px';
                document.body.appendChild(area);
                area.select();
                try { document.execCommand('copy'); } catch (e) { /* ignore */ }
                document.body.removeChild(area);
            };

            // Try modern API, but always run fallback immediately to stay in the user gesture.
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(text).catch(() => { });
            }
            fallbackCopy();
            this.triggerCopyFeedback(button, variant);
        }

        getStylePrompt() {
            switch (this.state.responseStyle) {
                case 'professional':
                    return 'Use a professional voice: clear, structured, formal, and neutral. Keep paragraphs tidy and well presented.';
                case 'direct':
                    return 'Be direct and concise. Get straight to the point without unnecessary filler.';
                case 'pedagogic':
                    return 'Explain in a teaching style: clear, progressive, and structured. Use steps or examples when helpful.';
                case 'creative':
                    return 'Be creative: original, expressive, and lively. Use imagery and a fluid tone.';
                case 'technical':
                    return 'Be technical: precise, development- or logic-oriented. Include technical details and code when relevant.';
                case 'geek':
                    return 'Be geeky: use well-controlled technical jargon, relevant tech references, and high precision.';
                case 'persuasive':
                    return 'Be persuasive: structure arguments, highlight key points, and aim to convince clearly.';
                default:
                    return 'Use a balanced, clear, and natural style.';
            }
        }


        toggleImageMode() {
            this.state.isImageMode = !this.state.isImageMode;
            this.elements.imgBtn.classList.toggle('active', this.state.isImageMode);

            this.elements.imgBtn.classList.toggle('active', this.state.isImageMode);
            this.renderModelSelect();
        }

        renderModelSelect() {
            const select = this.elements.modelSelect;
            select.innerHTML = '';
            select.disabled = false; // Reset disabled state by default
            select.classList.remove('nv-ghost-icon');

            if (this.state.isImageMode) {
                this.elements.input.placeholder = 'Describe your image...';

                if (this.state.isGhostMode) {
                    // Restrict to Pollinations Only
                    const opt = document.createElement('option');
                    opt.value = 'pollinations';
                    opt.textContent = 'Pollinations (private)';
                    select.appendChild(opt);
                    select.value = 'pollinations';
                    select.disabled = true; // User cannot change it
                    select.classList.add('nv-ghost-icon');
                } else {
                    // Populate with Image Models
                    this.IMAGE_MODELS.forEach(m => {
                        const opt = document.createElement('option');
                        opt.value = m.id;
                        opt.textContent = `Model: ${m.label}`;
                        select.appendChild(opt);
                    });
                    // Default to pollinations
                    select.value = 'pollinations';
                }
            } else {
                this.elements.input.placeholder = 'Type a message...';
                // Restore Reasoning Levels
                const levels = [
                    { val: 'auto', txt: 'Auto' }, { val: 'minimal', txt: 'Minimal' },
                    { val: 'low', txt: 'Low' }, { val: 'medium', txt: 'Medium' },
                    { val: 'high', txt: 'High' }, { val: 'ultra', txt: 'Ultra' }
                ];
                levels.forEach(l => {
                    const opt = document.createElement('option');
                    opt.value = l.val;
                    opt.textContent = `Reasoning: ${l.txt}`;
                    select.appendChild(opt);
                });
                // Restore saved reasoning
                select.value = this.state.reasoningEffort;
            }
        }

        changeReasoningEffort(level) {
            // If in image mode, change is checking image model, not reasoning
            if (this.state.isImageMode) {
                // Could save image model preference here if needed
                return;
            }

            if (this.REASONING_LEVELS.includes(level)) {
                this.state.reasoningEffort = level;
                GM_setValue('NeuraVeil_reasoning', level);
                this.elements.modelSelect.value = level;
            }
        }

        async handleImageGen() {
            const prompt = this.elements.input.value.trim();
            if (!prompt || this.state.isTyping) return;

            const requestChatId = this.currentChatId;
            this.elements.input.value = '';
            this.autoResizeInput();
            this.clearTrailingErrorMessage();
            this.appendMessage('user', prompt);
            this.setLoading(true, requestChatId);

            try {
                const selectedModel = this.elements.modelSelect.value;
                let imageUrl = '';

                if (selectedModel === 'ai-horde') {
                    this.setLoadingText('Generating AI Horde in progress (please wait)');
                    imageUrl = await this.generateHordeImage(prompt);
                } else {
                    // Pollinations
                    const encoded = encodeURIComponent(prompt);
                    const isPrivate = this.state.isGhostMode ? '&private=true' : '';
                    const seed = Math.floor(Math.random() * 100000);
                    // Base pollinations URL without explicit model
                    imageUrl = `https://image.pollinations.ai/prompt/${encoded}?nologo=true${isPrivate}&seed=${seed}`;
                }

                if (!imageUrl) throw new Error('No image URL generated');

                // Preload image via Fetch to handle rate limits and avoid double-requests
                const blobUrl = await this.preloadImage(imageUrl);

                // Save original URL to history, but use a local placeholder in the markup
                const imageHtmlOriginal = `<img src="${this.IMAGE_PLACEHOLDER}" data-nv-image-raw="${imageUrl}" data-nv-image-full="${imageUrl}" alt="${prompt}" style="max-width: 100%; border-radius: 8px; margin-top: 4px;">`;
                this.appendMessageToChat(requestChatId, 'assistant', imageHtmlOriginal, true);

                // Swap src to blobUrl in DOM to prevent re-fetching and hitting rate limits
                setTimeout(() => {
                    const images = this.elements.msgContainer.querySelectorAll('img');
                    if (images.length) {
                        const lastImg = images[images.length - 1];
                        const raw = lastImg.dataset.nvImageRaw || lastImg.getAttribute('src') || '';
                        if (raw === imageUrl) {
                            lastImg.src = blobUrl;
                            lastImg.dataset.nvImageProxied = '1';
                        }
                    }
                }, 0);

                // Reset image mode after generation
                if (this.state.isImageMode) {
                    this.toggleImageMode();
                }

            } catch (error) {
                this.appendMessageToChat(
                    requestChatId,
                    'assistant',
                    'Error • Unable to generate image. ' + (error.message || 'Check your connection.')
                );
                console.error('NeuraVeil Image Error:', error);
            } finally {
                this.setLoading(false, requestChatId);
            }
        }

        async generateHordeImage(prompt) {
            const apiKey = '0000000000'; // Anonymous key
            const payload = {
                prompt: prompt,
                params: {
                    steps: 30,
                    n: 1,
                    sampler_name: 'k_euler',
                    width: 512,
                    height: 512,
                    cfg_scale: 7
                },
                nsfw: true, // Allow NSFW if blocked by worker preference, but script is generally SFW
                censor_nsfw: false,
                models: ['stable_diffusion']
            };

            // 1. Submit Job
            const submitResponse = await this.request('https://stablehorde.net/api/v2/generate/async', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                },
                body: JSON.stringify(payload)
            });

            if (!submitResponse.ok) {
                throw new Error(`Horde API Error: ${submitResponse.status}`);
            }

            const submitData = await submitResponse.json();
            const id = submitData.id;
            if (!id) throw new Error('No Job ID from Horde');

            // 2. Poll Status
            let attempts = 0;
            const maxAttempts = 60;

            while (attempts < maxAttempts) {
                await new Promise(r => setTimeout(r, 2000));
                attempts++;

                const checkResponse = await this.request(`https://stablehorde.net/api/v2/generate/check/${id}`, {
                    headers: { 'apikey': apiKey }
                });

                if (!checkResponse.ok) continue;
                const checkData = await checkResponse.json();

                if (checkData.done) {
                    // 3. Get Result
                    const statusResponse = await this.request(`https://stablehorde.net/api/v2/generate/status/${id}`, {
                        headers: { 'apikey': apiKey }
                    });
                    if (!statusResponse.ok) throw new Error('Failed to retrieve Horde image');
                    const statusData = await statusResponse.json();
                    const generation = statusData.generations && statusData.generations[0];
                    // V2 async status endpoint returns:
                    // { generations: [{ img: "...", ... }] }
                    // `img` can be a URL or Base64 depending on the worker.
                    if (generation && generation.img) {
                        return generation.img;
                    }
                    return statusData.generations[0].img;
                }
            }
            throw new Error('Horde generation timed out');
        }

        async preloadImage(url) {
            const response = await this.request(url, { responseType: 'arraybuffer' });

            // Check for specific Rate Limit headers or errors
            // Pollinations might return 200 OK but with a rate limit image, checking headers:
            const rateLimited = response.headers.get('x-rate-limited') === 'true' ||
                response.headers.get('x-error-type') === 'Too Many Requests';

            if (rateLimited) {
                throw new Error('Pollinations Rate Limit Reached. Please try again later.');
            }

            if (!response.ok) {
                throw new Error(`Image load failed: ${response.status}`);
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }

        loadExternalImage(img, rawUrl) {
            if (!img) return;
            if (img.dataset.nvImageProxying === '1' || img.dataset.nvImageProxied === '1') return;
            const url = this.sanitizeUrl(rawUrl || '');
            if (!url) return;
            if (/^(data:|blob:)/i.test(url)) {
                img.src = url;
                return;
            }
            img.dataset.nvImageProxying = '1';
            this.preloadImage(url)
                .then((blobUrl) => {
                    img.src = blobUrl;
                })
                .catch(() => {
                    img.src = url;
                })
                .finally(() => {
                    delete img.dataset.nvImageProxying;
                    img.dataset.nvImageProxied = '1';
                });
        }

        initDirectImages(container) {
            const images = container.querySelectorAll('img');
            images.forEach((img) => {
                if (img.dataset.nvImageProxied === '1') return;
                let raw = img.dataset.nvImageRaw || img.getAttribute('src') || '';
                if (!raw) return;
                if (/^(data:|blob:)/i.test(raw)) return;
                if (!/^https?:\/\//i.test(raw) && !/^\/\//.test(raw)) return;
                const isPlaceholder = img.getAttribute('src') === this.IMAGE_PLACEHOLDER;
                if (img.dataset.nvImageProxying === '1' && !isPlaceholder) return;
                if (img.dataset.nvImageProxying === '1' && isPlaceholder) {
                    delete img.dataset.nvImageProxying;
                }
                if (!img.dataset.nvImageRaw) {
                    img.dataset.nvImageRaw = raw;
                    img.src = this.IMAGE_PLACEHOLDER;
                }
                raw = img.dataset.nvImageRaw || raw;
                this.loadExternalImage(img, raw);
            });
        }

        togglePanel(show) {
            if (show) {
                if (this.state.isOpen) return;
                this.state.isOpen = true;
                this.elements.panel.classList.remove('animating-out');
                this.elements.panel.classList.add('open');
                this.updateBodyOffset();
                this.schedulePanelPlacement();
                setTimeout(() => this.elements.input.focus(), 300);
                return;
            }

            if (!this.state.isOpen) return;
            this.state.isOpen = false;
            this.elements.panel.classList.remove('open');
            this.elements.panel.classList.add('animating-out');
            this.updateBodyOffset();
            this.schedulePanelPlacement();
            setTimeout(() => {
                if (this.state.isOpen) return;
                this.elements.panel.classList.remove('animating-out');
                this.resetPanelPlacement();
            }, 300);
        }

        toggleSidebar() {
            this.state.isSidebar = !this.state.isSidebar;
            this.elements.panel.classList.toggle('sidebar', this.state.isSidebar);
            if (this.state.isSidebar) {
                this.resetPanelPlacement();
                if (!this.state.isOpen) {
                    requestAnimationFrame(() => this.togglePanel(true));
                }
            } else if (this.state.isOpen) {
                this.schedulePanelPlacement();
            }
            this.updateBodyOffset();
        }

        setHistoryButtonActive(isOpen) {
            if (this.elements.historyBtn) {
                this.elements.historyBtn.classList.toggle('active', isOpen);
            }
        }

        toggleHistory() {
            this.state.isHistoryOpen = !this.state.isHistoryOpen;
            this.elements.historyPanel.classList.toggle('visible', this.state.isHistoryOpen);
            this.setHistoryButtonActive(this.state.isHistoryOpen);
            if (this.state.isHistoryOpen) {
                this.state.isSettingsOpen = false;
                this.elements.settingsPanel.classList.remove('visible');
                this.state.isInfoOpen = false;
                this.elements.infoPanel.classList.remove('visible');
            } else {
                this.resetHistorySearch();
            }
            if (this.state.isHistoryOpen) this.renderHistoryList();
        }

        toggleHistorySearch() {
            if (!this.elements.historySearchWrap || !this.elements.historySearchInput) return;
            const isActive = this.elements.historySearchWrap.classList.contains('active');
            if (isActive && !this.state.historySearchTerm) {
                this.resetHistorySearch();
                return;
            }
            this.elements.historySearchWrap.classList.add('active');
            this.elements.historySearchInput.focus();
            this.elements.historySearchInput.select();
        }

        handleHistorySearch(value) {
            this.state.historySearchTerm = value || '';
            this.state.historySearchIndex = this.state.historySearchTerm ? 0 : -1;
            if (this.state.historySearchTerm) {
                this.elements.historySearchWrap.classList.add('active');
            }
            this.renderHistoryList();
        }

        handleHistorySearchKeydown(e) {
            const items = this.filteredHistory || [];
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!items.length) return;
                const next = this.state.historySearchIndex + 1;
                this.state.historySearchIndex = next >= items.length ? items.length - 1 : next;
                this.renderHistoryList();
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!items.length) return;
                const prev = this.state.historySearchIndex - 1;
                this.state.historySearchIndex = prev < 0 ? 0 : prev;
                this.renderHistoryList();
                return;
            }
            if (e.key === 'Enter') {
                if (items.length && this.state.historySearchIndex >= 0) {
                    e.preventDefault();
                    const chat = items[this.state.historySearchIndex];
                    if (chat) this.loadChat(chat.id);
                }
                return;
            }
            if (e.key === 'Escape') {
                e.stopPropagation();
                if (this.state.historySearchTerm) {
                    this.resetHistorySearch();
                } else if (this.elements.historySearchWrap) {
                    this.elements.historySearchWrap.classList.remove('active');
                }
            }
        }

        handleHistorySearchBlur() {
            if (!this.state.historySearchTerm && this.elements.historySearchWrap) {
                this.elements.historySearchWrap.classList.remove('active');
            }
        }

        resetHistorySearch() {
            this.state.historySearchTerm = '';
            this.state.historySearchIndex = -1;
            this.filteredHistory = this.history;
            if (this.elements.historySearchInput) {
                this.elements.historySearchInput.value = '';
                this.elements.historySearchInput.blur();
            }
            if (this.elements.historySearchWrap) this.elements.historySearchWrap.classList.remove('active');
            this.renderHistoryList();
        }

        handleOutsideHistoryClick(e) {
            if (!this.state.isHistoryOpen) return;
            if (!this.elements.historyPanel) return;
            const path = e.composedPath ? e.composedPath() : [];
            const inHistory = path.includes(this.elements.historyPanel);
            const inSearch = path.includes(this.elements.historySearchWrap);
            if (!inHistory && !inSearch) {
                this.resetHistorySearch();
            }
        }
        updateBodyOffset() {
            const shouldOffset = this.state.isSidebar && this.state.isOpen;
            const isLeft = this.state.sidebarSide === 'left';
            document.body.style.marginLeft = shouldOffset && isLeft ? `${this.SIDEBAR_WIDTH}px` : '';
            document.body.style.marginRight = shouldOffset && !isLeft ? `${this.SIDEBAR_WIDTH}px` : '';
        }


        startNewChat() {
            this.currentChatId = Date.now();
            this.messages = [];
            this.setActiveChatId(this.currentChatId);
            this.state.manualTitle = null;
            this.state.autoTitle = null;
            this.elements.input.value = '';
            this.autoResizeInput();

            // Clear UI
            this.elements.msgContainer.innerHTML = '';
            this.elements.msgContainer.appendChild(this.elements.typingIndicator);
            this.appendMessage('assistant', this.DEFAULT_GREETING);

            this.state.isHistoryOpen = false;
            this.elements.historyPanel.classList.remove('visible');
            this.setHistoryButtonActive(false);
            this.state.isSettingsOpen = false;
            this.elements.settingsPanel.classList.remove('visible');
            this.state.isInfoOpen = false;
            this.elements.infoPanel.classList.remove('visible');
            this.state.isTyping = false;
            this.state.loadingChatId = null;
            this.elements.sendBtn.disabled = false;
            this.elements.input.disabled = false;
            this.updateTypingIndicatorVisibility();
            this.elements.input.focus();
        }

        setActiveChatId(chatId) {
            if (this.state.isGhostMode) return;
            GM_setValue('NeuraVeil_active_chat_id', chatId);
        }

        loadHistory() {
            const saved = GM_getValue('NeuraVeil_history', '');
            if (saved) {
                try {
                    this.history = JSON.parse(saved);
                } catch (e) { console.error('NeuraVeil: Corrupt history', e); }
            }
            this.filteredHistory = this.history;
        }

        restoreActiveChat() {
            const activeId = GM_getValue('NeuraVeil_active_chat_id', '');
            let chat = null;

            if (activeId) {
                chat = this.history.find(h => h.id === activeId);
            }
            if (!chat && this.history.length) {
                chat = this.history[0];
            }

            if (chat) {
                this.currentChatId = chat.id;
                this.messages = chat.messages;
                this.setActiveChatId(chat.id);
                this.state.manualTitle = chat.manualTitle || null;
                this.state.autoTitle = chat.autoTitle || null;
            }

            this.renderMessages();
        }

        async generateTextOnce(prompt) {
            const url = 'https://text.pollinations.ai/openai';
            const payload = {
                messages: [
                    { role: 'system', content: 'You generate short conversation titles.' },
                    { role: 'user', content: prompt }
                ],
                model: 'openai',
                reasoning_effort: 'low',
                seed: Math.floor(Math.random() * 10000)
            };

            const response = await this.request(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Title request failed: ${response.status}`);
            const data = await response.json();
            return data.choices?.[0]?.message?.content || '';
        }

        async generateConversationTitle(firstUserMessage) {
            const text = String(firstUserMessage || '').trim();
            if (!text) return 'New chat';

            const fallback = text.split(/\s+/).slice(0, 6).join(' ').slice(0, 48);

            try {
                const prompt =
                    'Generate a short conversation title (3-6 words, max 48 chars). ' +
                    'Keep the meaning, correct spelling if needed. No quotes, no emojis, no punctuation at the end.\n\n' +
                    `User message: ${text}\nTitle:`;

                const title = await this.generateTextOnce(prompt);
                const cleaned = String(title || '')
                    .replace(/["“”]/g, '')
                    .replace(/[.!?]+$/g, '')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 48);

                return cleaned || fallback || 'New chat';
            } catch (e) {
                return fallback || 'New chat';
            }
        }

        maybeGenerateConversationTitle(chatId, userText) {
            if (this.state.isGhostMode) return;
            const text = String(userText || '').trim();
            if (!text) return;

            const chat = this.history.find(h => h.id === chatId);
            const manualTitle = chat?.manualTitle || (chatId === this.currentChatId ? this.state.manualTitle : null);
            const existingAuto = chat?.autoTitle || (chatId === this.currentChatId ? this.state.autoTitle : null);
            if (manualTitle || existingAuto) return;

            if (!this._titleGenerationInFlight) {
                this._titleGenerationInFlight = new Set();
            }
            if (this._titleGenerationInFlight.has(chatId)) return;
            this._titleGenerationInFlight.add(chatId);

            this.generateConversationTitle(text)
                .then((title) => {
                    if (!title) return;
                    const target = this.history.find(h => h.id === chatId);
                    if (target && !target.manualTitle && !target.autoTitle) {
                        target.autoTitle = title;
                        target.title = title;
                        target.timestamp = Date.now();
                    }
                    if (chatId === this.currentChatId && !this.state.manualTitle) {
                        this.state.autoTitle = title;
                        this.saveHistory();
                        if (this.state.isHistoryOpen) this.renderHistoryList();
                    } else if (target) {
                        GM_setValue('NeuraVeil_history', JSON.stringify(this.history));
                        if (this.state.isHistoryOpen) this.renderHistoryList();
                    }
                })
                .catch((err) => {
                    console.warn('Title generation failed:', err);
                })
                .finally(() => {
                    this._titleGenerationInFlight.delete(chatId);
                });
        }

        saveHistory() {
            if (this.state.isGhostMode) return;
            // Don't save if no user messages yet
            if (!this.messages.some(m => m.role === 'user')) return;

            const existing = this.history.find(h => h.id === this.currentChatId);
            const manualTitle = this.state.manualTitle || existing?.manualTitle || null;
            const autoTitle = this.state.autoTitle || existing?.autoTitle || null;
            const chatData = {
                id: this.currentChatId,
                timestamp: Date.now(),
                title: manualTitle || autoTitle || existing?.title || 'New Conversation',
                manualTitle: manualTitle,
                autoTitle: autoTitle || existing?.autoTitle || null,
                messages: this.messages
            };

            // Remove existing instance of this chat ID (to handle reordering)
            this.history = this.history.filter(h => h.id !== this.currentChatId);
            this.history.unshift(chatData);


            GM_setValue('NeuraVeil_history', JSON.stringify(this.history));
            this.setActiveChatId(this.currentChatId);
        }

        showConfirm(message, onConfirm) {
            this.elements.modalText.textContent = message;
            this.elements.modalOverlay.classList.add('visible');

            const close = () => {
                this.elements.modalOverlay.classList.remove('visible');
                cleanup();
            };

            const handleConfirm = () => {
                onConfirm();
                close();
            };

            const handleCancel = () => close();

            this.elements.modalConfirm.onclick = handleConfirm;
            this.elements.modalCancel.onclick = handleCancel;

            const cleanup = () => {
                this.elements.modalConfirm.onclick = null;
                this.elements.modalCancel.onclick = null;
            };
        }

        clearAllHistory() {
            this.showConfirm('Are you sure you want to delete ALL history? This cannot be undone.', () => {
                this.history = [];
                GM_setValue('NeuraVeil_history', '');
                this.setActiveChatId('');
                this.resetHistorySearch();
                this.startNewChat();
            });
        }

        resetAllData() {
            this.showConfirm('Reset all NeuraVeil data? This clears settings and conversations.', () => {
                this.history = [];
                this.filteredHistory = [];
                this.messages = [];
                this.state.manualTitle = null;
                this.state.autoTitle = null;
                this.state.responseStyle = 'default';
                this.state.reasoningEffort = 'low';
                this.state.sidebarSide = 'right';

                GM_setValue('NeuraVeil_history', '');
                GM_setValue('NeuraVeil_active_chat_id', '');
                GM_setValue('NeuraVeil_style', '');
                GM_setValue('NeuraVeil_reasoning', '');
                GM_setValue('NeuraVeil_trigger_pos', '');
                GM_setValue('NeuraVeil_sidebar_side', '');

                this.resetHistorySearch();
                this.resetTriggerPosition();
                this.applySidebarSide();
                this.applyActiveStyle();
                this.renderModelSelect();
                this.renderHistoryList();
                this.startNewChat();
            });
        }

        deleteChat(chatId, e) {
            if (e) e.stopPropagation();
            this.showConfirm('Delete this conversation?', () => {
                this.history = this.history.filter(h => h.id !== chatId);
                GM_setValue('NeuraVeil_history', JSON.stringify(this.history));

                // If deleting active chat, clear it
                if (chatId === this.currentChatId) this.startNewChat();
                else this.renderHistoryList();
            });
        }

        startInlineRename(chatId, item, e) {
            if (e) e.stopPropagation();
            const chat = this.history.find(h => h.id === chatId);
            if (!chat) return;
            const titleEl = item.querySelector('.nv-h-title');
            if (!titleEl) return;

            const maxLength = 90;
            const original = chat.manualTitle || chat.title || 'Conversation';
            titleEl.contentEditable = 'true';
            titleEl.spellcheck = false;
            titleEl.classList.add('nv-h-editing');
            titleEl.focus();

            const range = document.createRange();
            range.selectNodeContents(titleEl);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            const blockOpen = (evt) => evt.stopPropagation();
            titleEl.addEventListener('mousedown', blockOpen);
            titleEl.addEventListener('mouseup', blockOpen);
            titleEl.addEventListener('click', blockOpen);

            const persist = (text) => {
                const cleaned = text.trim();
                if (!cleaned) return;
                chat.manualTitle = cleaned;
                chat.title = cleaned;
                if (chatId === this.currentChatId) {
                    this.state.manualTitle = cleaned;
                }
                GM_setValue('NeuraVeil_history', JSON.stringify(this.history));
            };

            const enforceMax = () => {
                const current = titleEl.textContent || '';
                if (current.length > maxLength) {
                    titleEl.textContent = current.slice(0, maxLength);
                    const selection = window.getSelection();
                    const newRange = document.createRange();
                    newRange.selectNodeContents(titleEl);
                    newRange.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    return titleEl.textContent;
                }
                return current;
            };

            const handleInput = () => {
                const text = enforceMax();
                persist(text);
            };

            const finish = (commit = true) => {
                titleEl.removeEventListener('input', handleInput);
                titleEl.removeEventListener('keydown', handleKey);
                titleEl.removeEventListener('blur', handleBlur);
                titleEl.removeEventListener('mousedown', blockOpen);
                titleEl.removeEventListener('mouseup', blockOpen);
                titleEl.removeEventListener('click', blockOpen);
                titleEl.classList.remove('nv-h-editing');
                titleEl.contentEditable = 'false';
                if (!commit) {
                    titleEl.textContent = original;
                } else {
                    const text = enforceMax();
                    persist(text || original);
                }
            };

            const handleBlur = () => finish(true);
            const handleKey = (evt) => {
                if (evt.key === 'Enter') {
                    evt.preventDefault();
                    finish(true);
                } else if (evt.key === 'Escape') {
                    evt.preventDefault();
                    finish(false);
                }
            };

            titleEl.addEventListener('input', handleInput);
            titleEl.addEventListener('keydown', handleKey);
            titleEl.addEventListener('blur', handleBlur);
        }

        loadChat(chatId) {
            const chat = this.history.find(h => h.id === chatId);
            if (!chat) return;

            this.currentChatId = chat.id;
            this.messages = chat.messages;
            this.setActiveChatId(chat.id);
            this.state.manualTitle = chat.manualTitle || null;
            this.state.autoTitle = chat.autoTitle || null;

            this.renderMessages();
            this.toggleHistory(); // Close history
        }

        isDefaultGreeting(msg, index = 0) {
            return index === 0 && msg?.role === 'assistant' && msg?.content === this.DEFAULT_GREETING;
        }

        highlightHistoryTitle(title, query) {
            if (!query) return this.escapeHtml(title);
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedQuery, 'gi');
            return this.escapeHtml(title).replace(regex, (match) => `<span class="nv-h-match">${match}</span>`);
        }

        renderHistoryList() {
            this.elements.historyList.innerHTML = '';
            const query = (this.state.historySearchTerm || '').toLowerCase();

            if (this.elements.historySearchInput) {
                this.elements.historySearchInput.value = this.state.historySearchTerm || '';
                const isFocused = (this.shadow && this.shadow.activeElement === this.elements.historySearchInput) ||
                    document.activeElement === this.elements.historySearchInput ||
                    this.elements.historySearchInput.matches(':focus');
                const keepOpen = !!this.state.historySearchTerm || isFocused;
                this.elements.historySearchWrap.classList.toggle('active', keepOpen);
            }

            const items = query
                ? this.history.filter(chat => {
                    const title = (chat.manualTitle || chat.title || '').toLowerCase();
                    return title.includes(query);
                })
                : this.history;

            this.filteredHistory = items;

            if (query) {
                if (items.length === 0) {
                    this.state.historySearchIndex = -1;
                } else if (this.state.historySearchIndex < 0) {
                    this.state.historySearchIndex = 0;
                } else if (this.state.historySearchIndex >= items.length) {
                    this.state.historySearchIndex = items.length - 1;
                }
            } else {
                this.state.historySearchIndex = -1;
            }

            if (!items.length) {
                const empty = document.createElement('div');
                empty.className = 'nv-history-empty';
                empty.textContent = query ? 'Aucune discussion trouvée.' : 'No conversations yet.';
                this.elements.historyList.appendChild(empty);
                return;
            }

            items.forEach((chat, index) => {
                const item = document.createElement('div');
                item.className = 'nv-history-item';
                if (chat.id === this.currentChatId) item.classList.add('active');
                const isFocused = query && index === this.state.historySearchIndex;
                if (isFocused) item.classList.add('search-focus');

                const date = new Date(chat.timestamp).toLocaleDateString();
                const titleText = chat.title || '';
                const highlightedTitle = this.highlightHistoryTitle(titleText, query);
                item.innerHTML = `
                    <div class="nv-h-title">${highlightedTitle}</div>
                    <div class="nv-h-date">${date}</div>
                    <div class="nv-h-rename" title="Rename">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                    </div>
                    <div class="nv-h-delete" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                `;
                item.onclick = () => this.loadChat(chat.id);
                item.querySelector('.nv-h-rename').onclick = (e) => this.startInlineRename(chat.id, item, e);
                item.querySelector('.nv-h-delete').onclick = (e) => this.deleteChat(chat.id, e);
                this.elements.historyList.appendChild(item);
            });
        }

        renderMessage(msg) {
            // Check if message content looks like an image tag
            if (msg.content.trim().startsWith('<img')) {
                return `<div class="nv-message ${msg.role}">${msg.content}</div>`;
            }
            if (msg.role === 'assistant') {
                const rendered = this.renderToolMarkup(msg.content);
                if (rendered.hasTool) {
                    return `<div class="nv-message ${msg.role}">${rendered.html}</div>`;
                }
            }
            // For text, sanitize/escape
            const div = document.createElement('div');
            div.textContent = msg.content;
            return `<div class="nv-message ${msg.role}">${div.innerHTML}</div>`;
        }

        escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        escapeAttr(value) {
            return this.escapeHtml(value);
        }

        parseToolAttributes(raw) {
            const attrs = {};
            const regex = /(\w+)\s*=\s*"([^"]*)"/g;
            let match;
            while ((match = regex.exec(raw || '')) !== null) {
                attrs[match[1].toLowerCase()] = match[2];
            }
            return attrs;
        }

        sanitizeUrl(url) {
            const raw = String(url || '').trim();
            if (!raw) return '';
            const hasProtocol = /^https?:\/\//i.test(raw);
            const isProtocolRelative = /^\/\//.test(raw);
            if (!hasProtocol && !isProtocolRelative) return '';
            try {
                const parsed = new URL(raw, window.location.href);
                if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                    return parsed.toString();
                }
            } catch (e) {
                return '';
            }
            return '';
        }

        extractFirstUrl(value) {
            const match = String(value || '').match(/https?:\/\/[^\s<>"')\]]+/i);
            return match ? match[0] : '';
        }

        normalizeImageQuery(rawQuery) {
            const query = String(rawQuery || '').trim();
            if (!query) return '';
            return query;
        }

        simplifyOpenverseQuery(query) {
            const raw = String(query || '').toLowerCase();
            if (!raw) return '';
            let cleaned = raw
                .replace(/image\s+libre\s+de\s+droits/gi, ' ')
                .replace(/libre\s+de\s+droits/gi, ' ')
                .replace(/royalty[-\s]?free/gi, ' ')
                .replace(/public\s+domain/gi, ' ')
                .replace(/creative\s+commons/gi, ' ')
                .replace(/cc\s*(by|0|sa|nd|nc)?/gi, ' ')
                .replace(/[^\w\s-]/g, ' ')
                .replace(/[_-]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            if (!cleaned) return '';

            const stopwords = new Set([
                'image', 'images', 'photo', 'photos', 'picture', 'pictures',
                'libre', 'droits', 'free', 'royalty', 'domain',
                'de', 'du', 'des', 'la', 'le', 'les', 'un', 'une', 'et', 'ou', 'pour', 'avec',
                'the', 'a', 'an', 'of', 'and', 'for', 'with', 'to', 'in'
            ]);
            const translate = {
                'poule': 'chicken',
                'poulet': 'chicken',
                'coq': 'rooster',
                'domestique': 'domestic',
                'oiseau': 'bird',
                'chat': 'cat',
                'chien': 'dog',
                'fleur': 'flower',
                'fleurs': 'flowers',
                'arbre': 'tree',
                'mer': 'sea',
                'ocean': 'ocean',
                'montagne': 'mountain'
            };

            const tokens = cleaned.split(/\s+/).filter(Boolean);
            const mapped = [];
            tokens.forEach((token) => {
                if (stopwords.has(token)) return;
                mapped.push(translate[token] || token);
            });

            const unique = [];
            mapped.forEach((token) => {
                if (!unique.includes(token)) unique.push(token);
            });
            if (!unique.length) return '';

            if (unique.includes('domestic') && unique.includes('chicken')) {
                return 'domestic chicken';
            }

            return unique.slice(0, 3).join(' ');
        }

        buildOpenverseSearchQueries(rawQuery) {
            const base = this.normalizeImageQuery(rawQuery);
            if (!base) return [];
            const queries = [base];
            const simplified = this.simplifyOpenverseQuery(base);
            if (simplified && simplified !== base) queries.push(simplified);
            return Array.from(new Set(queries));
        }

        getDomainFromUrl(rawUrl) {
            if (!rawUrl) return '';
            try {
                const parsed = new URL(rawUrl);
                return parsed.hostname.replace(/^www\./i, '');
            } catch (e) {
                return '';
            }
        }

        formatOpenverseDisplayName(value) {
            return String(value || '').trim().replace(/\s+/g, '_');
        }

        formatOpenverseLicense(result) {
            return this.formatOpenverseDisplayName(result?.license || '');
        }

        async fetchOpenverseApiJson(url) {
            const response = await this.request(url);
            if (!response.ok) throw new Error(`Openverse error: ${response.status}`);
            return await response.json();
        }

        buildOpenverseMetadata(result, previewUrlOverride) {
            const fullUrl = this.sanitizeUrl(result?.url || '');
            const previewUrl = previewUrlOverride || fullUrl;
            if (!previewUrl) return null;

            const source = this.formatOpenverseDisplayName(result?.source || '');
            const foreignLandingUrl = this.sanitizeUrl(result?.foreign_landing_url || '');
            const creator = this.formatOpenverseDisplayName(result?.creator || '');
            const creatorUrl = this.sanitizeUrl(result?.creator_url || '');
            const license = this.formatOpenverseLicense(result);
            const licenseUrl = this.sanitizeUrl(result?.license_url || '');

            return {
                thumbnail: previewUrl,
                url: fullUrl || previewUrl,
                source,
                foreignLandingUrl,
                creator,
                creatorUrl,
                license,
                licenseUrl
            };
        }

        normalizeTextForTitleMatch(value) {
            return String(value || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, ' ')
                .trim();
        }

        doesOpenverseTitleMatch(title, query) {
            const normalizedTitle = this.normalizeTextForTitleMatch(title);
            const normalizedQuery = this.normalizeTextForTitleMatch(query);
            if (!normalizedTitle || !normalizedQuery) return false;
            const tokens = normalizedQuery.split(/\s+/).filter((token) => token.length > 1);
            if (!tokens.length) return false;
            return tokens.every((token) => normalizedTitle.includes(token));
        }

        isIrrelevantOpenverseTitle(title) {
            const text = String(title || '').toLowerCase().trim();
            if (!text) return false;
            const badTerms = /\b(cahier|document|scan|scanned|page|pages)\b/i;
            const trailingPage = /(?:^|[\s_-])p\s*\d+\s*$/i;
            return badTerms.test(text) || trailingPage.test(text);
        }

        async fetchOpenverseImage(query) {
            const normalizedQuery = this.normalizeImageQuery(query);
            if (!normalizedQuery) throw new Error('Openverse: empty query');

            const queries = this.buildOpenverseSearchQueries(normalizedQuery);
            let data = null;
            let results = [];
            let usedQuery = normalizedQuery;
            for (const q of queries) {
                const encoded = encodeURIComponent(q);
                const url = `https://api.openverse.org/v1/images/?q=${encoded}&page_size=1`;
                data = await this.fetchOpenverseApiJson(url);
                results = Array.isArray(data?.results) ? data.results : [];
                if (results.length) {
                    usedQuery = q;
                    break;
                }
            }
            if (!results.length) throw new Error('Openverse: no results');
            const result = results[0];
            const payload = this.buildOpenverseMetadata(result);
            if (!payload) throw new Error('Openverse: no image url');
            payload.titleMatch = this.doesOpenverseTitleMatch(result?.title || '', usedQuery);
            return payload;
        }

        escapeToolAttrValue(value) {
            return String(value || '')
                .replace(/["[\]]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }

        shouldAutoShowImage(userText, reasoningLevel, assistantText) {
            if (reasoningLevel !== 'ultra') return false;
            if (!userText) return false;
            if (/\[tool:(show_image|generate_image)\b/i.test(assistantText || '')) return false;

            const normalized = String(userText).toLowerCase();
            if (normalized.length > 140) return false;
            if (/(sans\s+image|no\s+image|pas\s+d['’]?image|without\s+image)/i.test(normalized)) return false;
            if (/(comment\s|how\s+to|pourquoi|expliquer|explain|guide|tutoriel|tutorial)/i.test(normalized)) return false;

            if (/(à?\s*quoi\s+ressemble|a\s*quoi\s+ressemble|looks?\s+like|what\s+does.+look\s+like|montre(?:-moi)?|show\s+me|image|photo|picture|voir|visuel|visual)/i.test(normalized)) {
                return true;
            }
            if (/(c'?est\s+quoi|qu['’]?est-ce\s+que|what\s+is|what['’]s)/i.test(normalized)) {
                return true;
            }
            return false;
        }

        extractImageQuery(userText) {
            let query = String(userText || '').trim();
            const patterns = [
                /^\s*à?\s*quoi\s+ressemble\s+/i,
                /^\s*a\s*quoi\s+ressemble\s+/i,
                /^\s*what\s+does\s+/i,
                /^\s*what\s+is\s+/i,
                /^\s*what['’]s\s+/i,
                /^\s*c'?est\s+quoi\s+/i,
                /^\s*qu['’]?est-ce\s+que\s+/i,
                /^\s*montre(?:-moi)?\s+/i,
                /^\s*show\s+me\s+/i,
                /^\s*image\s+de\s+/i,
                /^\s*photo\s+de\s+/i,
                /^\s*image\s+d['’]\s*/i,
                /^\s*photo\s+d['’]\s*/i
            ];
            patterns.forEach((pattern) => {
                query = query.replace(pattern, '');
            });

            query = query.replace(/[?!.]+$/, '').trim();
            query = query.replace(/^(un|une|des|le|la|les|the|a|an)\s+/i, '');
            query = query.replace(/^d['’]\s+/i, '');
            return query || String(userText || '').trim();
        }

        maybeInjectUltraImage(userText, reasoningLevel, assistantText) {
            if (!this.shouldAutoShowImage(userText, reasoningLevel, assistantText)) {
                return assistantText;
            }
            const query = this.extractImageQuery(userText);
            if (!query) return assistantText;

            const safeQuery = this.escapeToolAttrValue(query);
            const safeAlt = this.escapeToolAttrValue(query);
            const toolTag = `[tool:show_image query="${safeQuery}" alt="${safeAlt}"]`;
            if (!assistantText || !assistantText.trim()) {
                return toolTag;
            }
            return `${assistantText}\n\n${toolTag}`;
        }

        buildWebImageAttributionHtml(data) {
            const creator = String(data?.creator || '').trim();
            const license = String(data?.license || '').trim();
            const titleMatch = data?.titleMatch !== false;
            const mismatchNotice = titleMatch ? '' : 'Image does not match.';
            if (!creator && !license) return mismatchNotice;

            const creatorUrl = this.sanitizeUrl(data?.creatorUrl || '');
            const licenseUrl = this.sanitizeUrl(data?.licenseUrl || '');
            const parts = [];

            if (creator) {
                const safeCreator = this.escapeHtml(creator);
                const value = creatorUrl
                    ? `<a href="${this.escapeAttr(creatorUrl)}" target="_blank" rel="noopener noreferrer">${safeCreator}</a>`
                    : safeCreator;
                parts.push(`By ${value}`);
            }

            if (license) {
                const safeLicense = this.escapeHtml(license);
                const value = licenseUrl
                    ? `<a href="${this.escapeAttr(licenseUrl)}" target="_blank" rel="noopener noreferrer">${safeLicense}</a>`
                    : safeLicense;
                parts.push(`Licence ${value}`);
            }

            const line = parts.join(' | ');
            if (!mismatchNotice) return line;
            return line ? `${mismatchNotice} ${line}` : mismatchNotice;
        }

        async searchWebImage(query) {
            return await this.fetchOpenverseImage(query);
        }

        updateToolImageCaption(container, text, allowHtml = false) {
            const caption = container.querySelector('.nv-tool-caption');
            if (!caption) return;
            const raw = String(text || '');
            const value = raw.trim();
            if (value) {
                if (allowHtml) {
                    caption.innerHTML = raw;
                } else {
                    caption.textContent = value;
                }
                caption.style.display = 'block';
            } else {
                caption.textContent = '';
                caption.style.display = 'none';
            }
        }

        initToolImages(container) {
            const nodes = container.querySelectorAll('[data-nv-image-query]');
            nodes.forEach((node) => {
                if (node.dataset.nvImageLoaded === '1') return;
                node.dataset.nvImageLoaded = '1';
                const query = node.dataset.nvImageQuery || '';
                const img = node.querySelector('img');
                if (!query || !img) return;
                const alt = node.dataset.nvImageAlt || query;
                if (!img.alt) img.alt = alt;
                this.searchWebImage(query)
                    .then((result) => {
                        const isString = typeof result === 'string';
                        const sourceLinkEl = node.querySelector('[data-nv-image-source-link]');

                        const applyWebImageResult = (data, previewUrl) => {
                            const fullUrl = data?.url || '';
                            const source = data?.source || '';
                            const foreignLandingUrl = data?.foreignLandingUrl || '';
                            const attributionHtml = data ? this.buildWebImageAttributionHtml(data) : '';

                            if (previewUrl) {
                                img.dataset.nvImageRaw = previewUrl;
                                this.loadExternalImage(img, previewUrl);
                            }
                            if (fullUrl) {
                                img.dataset.nvImageFull = fullUrl;
                            } else {
                                delete img.dataset.nvImageFull;
                            }
                            if (foreignLandingUrl) {
                                img.dataset.nvImageSourceUrl = foreignLandingUrl;
                            } else {
                                delete img.dataset.nvImageSourceUrl;
                            }

                            if (sourceLinkEl) {
                                const safeForeign = this.sanitizeUrl(foreignLandingUrl || '');
                                const sourceValue = String(source || '').trim();
                                if (safeForeign) {
                                    sourceLinkEl.href = safeForeign;
                                    sourceLinkEl.target = '_blank';
                                    sourceLinkEl.rel = 'noopener noreferrer';
                                    sourceLinkEl.textContent = sourceValue ? `${sourceValue}` : 'Source';
                                    sourceLinkEl.style.display = '';
                                } else {
                                    sourceLinkEl.textContent = '';
                                    sourceLinkEl.style.display = 'none';
                                }
                            }

                            this.updateToolImageCaption(node, attributionHtml, true);
                        };

                        const showFallbackState = () => {
                            if (sourceLinkEl) {
                                sourceLinkEl.textContent = '';
                                sourceLinkEl.style.display = 'none';
                            }
                            delete img.dataset.nvImageFull;
                            delete img.dataset.nvImageSourceUrl;
                            this.updateToolImageCaption(node, '', false);
                        };

                        if (isString) {
                            img.onerror = null;
                            if (result) {
                                img.dataset.nvImageRaw = result;
                                this.loadExternalImage(img, result);
                            }
                            showFallbackState();
                            return;
                        }

                        img.onerror = null;
                        const previewUrl = result?.url || '';
                        if (previewUrl) {
                            applyWebImageResult(result, previewUrl);
                        } else {
                            showFallbackState();
                        }
                    })
                    .catch(() => {
                        img.alt = alt;
                        this.updateToolImageCaption(node, '', false);
                    });
            });
        }

        renderImageActionsHtml(includeLink = false) {
            const linkButton = includeLink
                ? `<button class="nv-image-action" data-nv-image-link title="Copy Image Link" aria-label="Copy Image Link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L10.5 5"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13.5 19"/></svg></button>`
                : '';
            return `<div class="nv-image-actions" data-nv-image-actions>
                <button class="nv-image-action" data-nv-image-copy title="Copy Image" aria-label="Copy Image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
                <button class="nv-image-action" data-nv-image-download title="Download Image" aria-label="Download Image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></button>
                ${linkButton}
            </div>`;
        }

        createImageActionsElement() {
            const wrapper = document.createElement('div');
            wrapper.className = 'nv-image-actions';
            wrapper.dataset.nvImageActions = '1';
            wrapper.innerHTML = `
                <button class="nv-image-action" data-nv-image-copy title="Copy Image" aria-label="Copy Image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
                <button class="nv-image-action" data-nv-image-download title="Download Image" aria-label="Download Image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></button>
            `;
            return wrapper;
        }

        wrapStandaloneImages(container) {
            const images = container.querySelectorAll('img');
            images.forEach((img) => {
                if (img.closest('.nv-tool-image')) return;
                if (img.closest('.nv-image-frame')) return;
                if (img.closest('.nv-tool-code, .nv-code-block')) return;
                const parent = img.parentNode;
                if (!parent) return;

                const frame = document.createElement('div');
                frame.className = 'nv-image-frame';
                const actions = this.createImageActionsElement();
                parent.insertBefore(frame, img);
                frame.appendChild(actions);
                frame.appendChild(img);
            });
        }

        initImageActions(container) {
            const frames = container.querySelectorAll('.nv-image-frame');
            frames.forEach((frame) => {
                if (frame.dataset.nvImageActionsBound === '1') return;
                frame.dataset.nvImageActionsBound = '1';

                const img = frame.querySelector('img');
                if (!img) return;

                const getImageUrl = () => {
                    return img.dataset.nvImageFull || img.currentSrc || img.src || '';
                };

                const copyBtn = frame.querySelector('[data-nv-image-copy]');
                if (copyBtn) {
                    copyBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const url = getImageUrl();
                        if (!url) return;
                        this.copyImageToClipboard(url, copyBtn);
                    });
                }

                const downloadBtn = frame.querySelector('[data-nv-image-download]');
                if (downloadBtn) {
                    downloadBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const url = getImageUrl();
                        if (!url) return;
                        const filename = this.buildImageFilename(img.alt || '', url);
                        this.downloadImage(url, filename);
                    });
                }

                const linkBtn = frame.querySelector('[data-nv-image-link]');
                if (linkBtn) {
                    linkBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const url = getImageUrl();
                        if (!url) return;
                        this.copyTextToClipboard(url, linkBtn, 'primary');
                    });
                }
            });
        }

        initCodeCopy(container) {
            const buttons = container.querySelectorAll('.nv-code-copy');
            buttons.forEach((btn) => {
                if (btn.dataset.nvCopyBound === '1') return;
                btn.dataset.nvCopyBound = '1';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const wrapper = btn.closest('.nv-tool-code, .nv-code-block');
                    const codeEl = wrapper?.querySelector('code');
                    const text = codeEl?.textContent || '';
                    if (!text.trim()) return;
                    this.copyTextToClipboard(text, btn, 'primary');
                });
            });
        }

        renderTextWithBareUrls(text) {
            const urlRegex = /(https?:\/\/[^\s<]+)/g;
            let html = '';
            let hasLinks = false;
            let lastIndex = 0;
            let match;

            while ((match = urlRegex.exec(text)) !== null) {
                html += this.escapeHtml(text.slice(lastIndex, match.index));

                let url = match[1];
                let trailing = '';
                while (/[).,;:!?\]]$/.test(url)) {
                    trailing = url.slice(-1) + trailing;
                    url = url.slice(0, -1);
                }

                const safeUrl = this.sanitizeUrl(url);
                if (safeUrl) {
                    const safeText = this.escapeHtml(url);
                    const safeHref = this.escapeAttr(safeUrl);
                    html += `<a class="nv-inline-link" href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
                    hasLinks = true;
                } else {
                    html += this.escapeHtml(match[1]);
                }

                html += this.escapeHtml(trailing);
                lastIndex = match.index + match[1].length;
            }

            html += this.escapeHtml(text.slice(lastIndex));
            return { html, hasLinks };
        }

        renderTextWithLinks(text) {
            const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
            let html = '';
            let hasLinks = false;
            let lastIndex = 0;
            let match;

            while ((match = markdownLinkRegex.exec(text)) !== null) {
                const before = text.slice(lastIndex, match.index);
                const beforeRendered = this.renderTextWithBareUrls(before);
                html += beforeRendered.html;
                hasLinks = hasLinks || beforeRendered.hasLinks;

                const safeUrl = this.sanitizeUrl(match[2]);
                if (safeUrl) {
                    const safeText = this.escapeHtml(match[1]);
                    const safeHref = this.escapeAttr(safeUrl);
                    html += `<a class="nv-inline-link" href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
                    hasLinks = true;
                } else {
                    html += this.escapeHtml(match[0]);
                }

                lastIndex = markdownLinkRegex.lastIndex;
            }

            const tail = text.slice(lastIndex);
            const tailRendered = this.renderTextWithBareUrls(tail);
            html += tailRendered.html;
            hasLinks = hasLinks || tailRendered.hasLinks;

            return { html, hasLinks };
        }

        renderTextWithBoldAndLinks(text) {
            let html = '';
            let hasMarkup = false;
            let index = 0;

            while (index < text.length) {
                const start = text.indexOf('**', index);
                if (start === -1) {
                    const tail = text.slice(index);
                    const renderedTail = this.renderTextWithLinks(tail);
                    html += renderedTail.html;
                    hasMarkup = hasMarkup || renderedTail.hasLinks;
                    break;
                }

                const before = text.slice(index, start);
                const renderedBefore = this.renderTextWithLinks(before);
                html += renderedBefore.html;
                hasMarkup = hasMarkup || renderedBefore.hasLinks;

                const end = text.indexOf('**', start + 2);
                if (end === -1) {
                    const rest = text.slice(start);
                    const renderedRest = this.renderTextWithLinks(rest);
                    html += renderedRest.html;
                    hasMarkup = hasMarkup || renderedRest.hasLinks;
                    break;
                }

                const boldText = text.slice(start + 2, end);
                if (!boldText.trim()) {
                    const literal = text.slice(start, end + 2);
                    const renderedLiteral = this.renderTextWithLinks(literal);
                    html += renderedLiteral.html;
                    hasMarkup = hasMarkup || renderedLiteral.hasLinks;
                    index = end + 2;
                    continue;
                }

                const renderedBold = this.renderTextWithLinks(boldText);
                html += `<strong>${renderedBold.html}</strong>`;
                hasMarkup = true;
                index = end + 2;
            }

            return { html, hasMarkup };
        }

        renderTextWithInlineCode(text) {
            const inlineCodeRegex = /`([^`]+)`/g;
            let html = '';
            let hasMarkup = false;
            let lastIndex = 0;
            let match;

            while ((match = inlineCodeRegex.exec(text)) !== null) {
                const before = text.slice(lastIndex, match.index);
                const beforeRendered = this.renderTextWithBoldAndLinks(before);
                html += beforeRendered.html;
                hasMarkup = hasMarkup || beforeRendered.hasMarkup;

                const code = this.escapeHtml(match[1]);
                html += `<code class="nv-inline-code">${code}</code>`;
                hasMarkup = true;

                lastIndex = inlineCodeRegex.lastIndex;
            }

            const tail = text.slice(lastIndex);
            const tailRendered = this.renderTextWithBoldAndLinks(tail);
            html += tailRendered.html;
            hasMarkup = hasMarkup || tailRendered.hasMarkup;

            return { html, hasMarkup };
        }

        renderInlineMarkdown(text) {
            const rendered = this.renderTextWithInlineCode(text);
            const html = rendered.html.replace(/\n/g, '<br>');
            return { html, hasMarkup: rendered.hasMarkup || html !== this.escapeHtml(text) };
        }

        renderMarkdownBlocks(text) {
            const lines = String(text || '').split('\n');
            let html = '';
            let hasMarkup = false;
            let listType = null;
            let paragraphLines = [];
            let quoteLines = [];

            const flushParagraph = () => {
                if (!paragraphLines.length) return;
                const blockText = paragraphLines.join('\n');
                const rendered = this.renderInlineMarkdown(blockText);
                html += `<p class="nv-md-p">${rendered.html}</p>`;
                hasMarkup = true;
                paragraphLines = [];
            };

            const flushList = () => {
                if (!listType) return;
                html += `</${listType}>`;
                listType = null;
            };

            const flushQuote = () => {
                if (!quoteLines.length) return;
                const blockText = quoteLines.join('\n');
                const rendered = this.renderInlineMarkdown(blockText);
                html += `<blockquote class="nv-md-quote">${rendered.html}</blockquote>`;
                hasMarkup = true;
                quoteLines = [];
            };

            lines.forEach((line) => {
                const trimmed = line.trim();

                if (!trimmed) {
                    flushParagraph();
                    flushQuote();
                    flushList();
                    return;
                }

                const hrMatch = /^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed);
                if (hrMatch) {
                    flushParagraph();
                    flushQuote();
                    flushList();
                    html += '<hr class="nv-md-hr">';
                    hasMarkup = true;
                    return;
                }

                const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
                if (headingMatch) {
                    flushParagraph();
                    flushQuote();
                    flushList();
                    const level = headingMatch[1].length;
                    const rendered = this.renderInlineMarkdown(headingMatch[2] || '');
                    html += `<div class="nv-md-h${level}">${rendered.html}</div>`;
                    hasMarkup = true;
                    return;
                }

                const quoteMatch = line.match(/^\s*>\s?(.*)$/);
                if (quoteMatch) {
                    flushParagraph();
                    flushList();
                    quoteLines.push(quoteMatch[1] || '');
                    return;
                }

                if (quoteLines.length) {
                    flushQuote();
                }

                const unorderedMatch = line.match(/^\s*[-*+]\s+(.*)$/);
                const orderedMatch = line.match(/^\s*\d+[.)]\s+(.*)$/);
                if (unorderedMatch || orderedMatch) {
                    flushParagraph();
                    const nextType = unorderedMatch ? 'ul' : 'ol';
                    if (listType && listType !== nextType) {
                        flushList();
                    }
                    if (!listType) {
                        listType = nextType;
                        html += `<${listType} class="nv-md-list">`;
                        hasMarkup = true;
                    }
                    const itemText = unorderedMatch ? unorderedMatch[1] : orderedMatch[1];
                    const rendered = this.renderInlineMarkdown(itemText || '');
                    html += `<li>${rendered.html}</li>`;
                    hasMarkup = true;
                    return;
                }

                paragraphLines.push(line);
            });

            flushParagraph();
            flushQuote();
            flushList();

            return { html, hasMarkup };
        }

        renderTextWithFormatting(text) {
            const normalized = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const codeBlockRegex = /```([\w-]+)?\s*\n([\s\S]*?)```/g;
            let html = '';
            let hasMarkup = false;
            let lastIndex = 0;
            let match;

            while ((match = codeBlockRegex.exec(normalized)) !== null) {
                const before = normalized.slice(lastIndex, match.index);
                const beforeRendered = this.renderMarkdownBlocks(before);
                html += beforeRendered.html;
                hasMarkup = hasMarkup || beforeRendered.hasMarkup;

                const lang = (match[1] || '').trim();
                const langLabel = lang ? this.escapeHtml(lang) : 'Plain';
                const langClass = lang ? lang.toLowerCase().replace(/[^a-z0-9_-]/g, '') : 'plaintext';
                const rawCode = match[2].replace(/\s+$/, '');
                const safeCode = this.escapeHtml(rawCode);
                const codeClass = ` class="language-${langClass}"`;
                html += `<div class="nv-code-block"><div class="nv-code-header"><div class="nv-code-left"><span class="nv-code-label">Code</span><button class="nv-code-copy" title="Copy code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button></div><span class="nv-code-lang">${langLabel}</span></div><pre><code${codeClass}>${safeCode}</code></pre></div>`;
                hasMarkup = true;

                lastIndex = codeBlockRegex.lastIndex;
            }

            const tail = normalized.slice(lastIndex);
            const tailRendered = this.renderMarkdownBlocks(tail);
            html += tailRendered.html;
            hasMarkup = hasMarkup || tailRendered.hasMarkup;

            return { html, hasMarkup };
        }

        renderImageTool(url, alt, label, caption) {
            const safeUrl = this.escapeAttr(url);
            const safeAlt = this.escapeAttr(alt || '');
            const safeLabel = this.escapeHtml(label || 'Image');
            const safeCaption = caption ? this.escapeHtml(caption) : '';
            const captionHtml = safeCaption ? `<div class="nv-tool-caption">${safeCaption}</div>` : '';
            const actionsHtml = this.renderImageActionsHtml(false);
            const rawAttr = safeUrl ? ` data-nv-image-raw="${safeUrl}" data-nv-image-full="${safeUrl}"` : '';
            const imageHtml = `<div class="nv-image-frame">${actionsHtml}<img src="${this.IMAGE_PLACEHOLDER}" alt="${safeAlt}" loading="lazy"${rawAttr}></div>`;
            return `<div class="nv-tool nv-tool-image"><div class="nv-tool-label">${safeLabel}</div>${imageHtml}${captionHtml}</div>`;
        }

        renderWebImageTool(url, alt, label, source, foreignLandingUrl, attributionHtml, fullUrl) {
            const safeUrl = this.escapeAttr(url);
            const safeAlt = this.escapeAttr(alt || '');
            const safeLabel = this.escapeHtml(label || 'Web Image : ');
            const sourceText = String(source || '').trim();
            const safeSourceText = sourceText ? this.escapeHtml(sourceText) : '';
            const safeForeignUrl = this.sanitizeUrl(foreignLandingUrl || '');
            const sourceLabelText = safeSourceText ? `${safeSourceText}` : 'Source';
            const sourceLinkHtml = safeForeignUrl
                ? `<a class="nv-tool-source-link" data-nv-image-source-link href="${this.escapeAttr(safeForeignUrl)}" target="_blank" rel="noopener noreferrer">${sourceLabelText}</a>`
                : `<a class="nv-tool-source-link" data-nv-image-source-link style="display:none"></a>`;
            const labelHtml = `<div class="nv-tool-label-row"><div class="nv-tool-label">${safeLabel}</div>${sourceLinkHtml}</div>`;
            const captionHtml = attributionHtml
                ? `<div class="nv-tool-caption nv-tool-attribution">${attributionHtml}</div>`
                : `<div class="nv-tool-caption nv-tool-attribution" style="display:none"></div>`;
            const fullAttr = fullUrl ? ` data-nv-image-full="${this.escapeAttr(fullUrl)}"` : '';
            const sourceAttr = safeForeignUrl ? ` data-nv-image-source-url="${this.escapeAttr(safeForeignUrl)}"` : '';
            const actionsHtml = this.renderImageActionsHtml(true);
            const rawAttr = safeUrl ? ` data-nv-image-raw="${safeUrl}"` : '';
            const imageHtml = `<div class="nv-image-frame">${actionsHtml}<img src="${this.IMAGE_PLACEHOLDER}" alt="${safeAlt}" loading="lazy"${fullAttr}${sourceAttr}${rawAttr}></div>`;
            return `<div class="nv-tool nv-tool-image">${labelHtml}${imageHtml}${captionHtml}</div>`;
        }

        renderImageToolWithQuery(query, alt, label, caption) {
            const safeQuery = this.escapeAttr(query);
            const safeAlt = this.escapeAttr(alt || query || '');
            const safeLabel = this.escapeHtml(label || 'Web Image : ');
            const safeCaption = caption ? this.escapeHtml(caption) : '';
            const captionStyle = safeCaption ? '' : ' style="display:none"';
            const captionHtml = `<div class="nv-tool-caption nv-tool-attribution" data-nv-image-caption${captionStyle}>${safeCaption}</div>`;
            const labelHtml = `<div class="nv-tool-label-row"><div class="nv-tool-label">${safeLabel}</div><a class="nv-tool-source-link" data-nv-image-source-link style="display:none"></a></div>`;
            const actionsHtml = this.renderImageActionsHtml(true);
            const imageHtml = `<div class="nv-image-frame">${actionsHtml}<img src="${this.IMAGE_PLACEHOLDER}" alt="${safeAlt}" loading="lazy"></div>`;
            return `<div class="nv-tool nv-tool-image" data-nv-image-query="${safeQuery}" data-nv-image-alt="${safeAlt}">${labelHtml}${imageHtml}${captionHtml}</div>`;
        }

        renderToolCall(toolName, attrs) {
            const handlers = {
                'generate_image': () => this.handleGenerateImageTool(attrs),
                'show_image': () => this.handleShowImageTool(attrs),
                'link': () => this.handleLinkTool(attrs)
            };

            const handler = handlers[toolName];
            return handler ? handler() : '';
        }

        handleGenerateImageTool(attrs) {
            const prompt = attrs.prompt || attrs.text || '';
            if (!prompt) return '';

            const encoded = encodeURIComponent(prompt);
            const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?nologo=true`;
            return this.renderImageTool(imageUrl, prompt, 'Generated Image', prompt);
        }

        handleShowImageTool(attrs) {
            // Try to render from query first
            const queryResult = this.tryRenderFromQuery(attrs);
            if (queryResult) return queryResult;

            // Fallback to direct URL rendering
            return this.renderFromDirectUrl(attrs);
        }

        tryRenderFromQuery(attrs) {
            const rawQuery = attrs.query || attrs.search || attrs.text || '';
            const directUrl = this.extractFirstUrl(rawQuery);
            if (directUrl && rawQuery.trim() === directUrl) {
                const alt = attrs.alt || 'Web image : ';
                return this.renderWebImageTool(directUrl, alt, 'Web Image : ', '', '', '', directUrl);
            }
            const query = this.normalizeImageQuery(rawQuery);
            if (!query) return null;

            const alt = attrs.alt || query;
            return this.renderImageToolWithQuery(query, alt, 'Web Image : ', '');
        }

        renderFromDirectUrl(attrs) {
            const rawUrl = String(attrs.url || '').trim();
            if (!rawUrl) return '';

            const url = this.sanitizeUrl(rawUrl);
            if (!url) {
                if (/^https?:\/\//i.test(rawUrl) || /^\/\//.test(rawUrl)) {
                    return '';
                }
                const query = this.normalizeImageQuery(rawUrl);
                if (!query) return '';
                const alt = attrs.alt || query;
                return this.renderImageToolWithQuery(query, alt, 'Web Image : ', '');
            }

            const alt = attrs.alt || 'Web image : ';
            return this.renderWebImageTool(url, alt, 'Web Image : ', '', '', '', url);
        }

        handleLinkTool(attrs) {
            const url = this.sanitizeUrl(attrs.url || '');
            if (!url) return '';

            const text = attrs.text || url;
            const safeText = this.escapeHtml(text);
            const safeUrl = this.escapeAttr(url);
            return `<span class="nv-tool nv-tool-link"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeText}</a></span>`;
        }

        renderToolMarkup(content) {
            // Normalize tool tags that may come as <tool:code>...</tool:code>
            const normalizedContent = (content || '')
                .replace(/<tool:(\w+)([^>]*)>/gi, '[tool:$1$2]')
                .replace(/<\/tool:(\w+)>/gi, '[/tool:$1]');

            const regex = /\[tool:code([^\]]*)\]([\s\S]*?)\[\/tool:code\]|\[tool:(\w+)([^\]]*)\]/gi;
            let html = '';
            let hasTool = false;
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(normalizedContent)) !== null) {
                if (match.index > lastIndex) {
                    const chunk = normalizedContent.slice(lastIndex, match.index);
                    const renderedChunk = this.renderTextWithFormatting(chunk);
                    html += renderedChunk.html;
                    hasTool = hasTool || renderedChunk.hasMarkup;
                }

                if (match[1] !== undefined) {
                    const attrs = this.parseToolAttributes(match[1]);
                    const lang = attrs.lang || attrs.language || '';
                    const langLabel = lang ? this.escapeHtml(lang) : 'Plain';
                    const langClass = lang ? lang.toLowerCase().replace(/[^a-z0-9_-]/g, '') : 'plaintext';
                    const rawCode = match[2].replace(/\s+$/, '');
                    const safeCode = this.escapeHtml(rawCode);
                    const codeClass = ` class="language-${langClass}"`;
                    html += `<div class="nv-tool nv-tool-code"><div class="nv-code-header"><div class="nv-code-left"><span class="nv-code-label">Code</span><button class="nv-code-copy" title="Copy code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button></div><span class="nv-code-lang">${langLabel}</span></div><pre><code${codeClass}>${safeCode}</code></pre></div>`;
                    hasTool = true;
                } else {
                    const toolName = (match[3] || '').toLowerCase();
                    const attrs = this.parseToolAttributes(match[4] || '');
                    const toolHtml = this.renderToolCall(toolName, attrs);
                    if (toolHtml) {
                        html += toolHtml;
                        hasTool = true;
                    } else {
                        html += this.escapeHtml(match[0]);
                    }
                }

                lastIndex = regex.lastIndex;
            }

            if (lastIndex < content.length) {
                const tailChunk = normalizedContent.slice(lastIndex);
                const renderedTail = this.renderTextWithFormatting(tailChunk);
                html += renderedTail.html;
                hasTool = hasTool || renderedTail.hasMarkup;
            }

            return { html, hasTool };
        }

        applyAssistantContent(contentDiv, content, forceHtml = false) {
            if (forceHtml || content.startsWith('<img')) {
                contentDiv.innerHTML = content;
                this.wrapStandaloneImages(contentDiv);
                this.initDirectImages(contentDiv);
                this.initImageActions(contentDiv);
                return;
            }
            const rendered = this.renderToolMarkup(content);
            contentDiv.innerHTML = rendered.html;
            if (rendered.hasTool) {
                this.initToolImages(contentDiv);
            }
            this.wrapStandaloneImages(contentDiv);
            this.initDirectImages(contentDiv);
            this.initImageActions(contentDiv);
            this.initCodeCopy(contentDiv);
            this.applyHighlighting(contentDiv);
        }

        updateMessageContent(messageIndex) {
            // Find the message element by index
            const messageElements = this.elements.msgContainer.querySelectorAll('.nv-message');
            const messageElement = messageElements[messageIndex];
            if (!messageElement) return;

            const msg = this.messages[messageIndex];
            if (!msg || msg.role !== 'assistant') return;

            let contentDiv = messageElement.querySelector('.nv-message-content');
            if (!contentDiv) {
                // If no content wrapper exists, create one
                contentDiv = document.createElement('div');
                contentDiv.className = 'nv-message-content';

                // Insert after tabs if they exist, otherwise at the beginning
                const tabsContainer = messageElement.querySelector('.nv-version-tabs');
                if (tabsContainer) {
                    tabsContainer.after(contentDiv);
                } else {
                    messageElement.insertBefore(contentDiv, messageElement.firstChild);
                }
            }

            contentDiv.innerHTML = '';
            if (msg.isLoading && msg.regenTargetIndex !== undefined && msg.currentVersion === msg.regenTargetIndex) {
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'nv-inline-loading';
                loadingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
                contentDiv.appendChild(loadingDiv);
            } else {
                this.applyAssistantContent(contentDiv, msg.content);
            }
            this.initCodeCopy(contentDiv);
            this.applyHighlighting(contentDiv);
            this.applyHighlighting(this.shadow);

            if (msg.versions && msg.versions.length > 1) {
                const tabs = messageElement.querySelectorAll('.nv-version-tab');
                tabs.forEach((tab, index) => {
                    if (index === (msg.currentVersion || 0)) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
            }

            const actions = messageElement.querySelector('.nv-message-actions');
            if (actions) {
                const hideActions = msg.isLoading && msg.regenTargetIndex !== undefined && msg.currentVersion === msg.regenTargetIndex;
                actions.style.display = hideActions ? 'none' : '';
            }
        }

        renderMessages(preserveScroll = false) {
            // Save scroll position if needed
            const scrollPos = preserveScroll ? this.elements.msgContainer.scrollTop : null;

            this.elements.msgContainer.innerHTML = '';
            this.elements.msgContainer.appendChild(this.elements.typingIndicator);

            this.messages.forEach((msg, messageIndex) => {
                const isGreeting = this.isDefaultGreeting(msg, messageIndex);
                const div = document.createElement('div');
                div.className = `nv-message ${msg.role}`;

                // Add version tabs for assistant messages with multiple versions
                if (msg.role === 'assistant' && msg.versions && msg.versions.length > 1) {
                    const tabsContainer = document.createElement('div');
                    tabsContainer.className = 'nv-version-tabs';

                    msg.versions.forEach((version, versionIndex) => {
                        const tab = document.createElement('button');
                        tab.className = 'nv-version-tab';
                        if (versionIndex === (msg.currentVersion || 0)) {
                            tab.classList.add('active');
                        }
                        tab.textContent = versionIndex + 1;
                        tab.onclick = (e) => {
                            e.stopPropagation();
                            this.switchVersion(messageIndex, versionIndex);
                        };
                        tabsContainer.appendChild(tab);
                    });

                    div.appendChild(tabsContainer);
                }

                const contentDiv = document.createElement('div');
                contentDiv.className = 'nv-message-content';

                // Show inline loading if message is being regenerated
                if (msg.isLoading) {
                    const loadingDiv = document.createElement('div');
                    loadingDiv.className = 'nv-inline-loading';
                    loadingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
                    contentDiv.appendChild(loadingDiv);
                } else {
                    // Allow HTML for images, text otherwise
                    if (msg.role === 'assistant') {
                        this.applyAssistantContent(contentDiv, msg.content);
                    } else {
                        contentDiv.textContent = msg.content;
                    }
                }
                div.appendChild(contentDiv);

                // Add action buttons for assistant messages (only if not loading)
                if (msg.role === 'assistant' && !isGreeting) {
                    const actions = document.createElement('div');
                    actions.className = 'nv-message-actions';

                    if (msg.content.trim().startsWith('<img')) {
                        // Extract image URL from HTML
                        const urlMatch = msg.content.match(/src="([^"]+)"/);
                        const altMatch = msg.content.match(/alt="([^"]*)"/);
                        const altText = altMatch ? altMatch[1] : '';
                        if (urlMatch) {
                            const imageUrl = urlMatch[1];

                            // Download Button (Icon Only)
                            const downloadBtn = document.createElement('button');
                            downloadBtn.className = 'nv-action-btn';
                            downloadBtn.title = 'Download Image';
                            downloadBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>`;
                            downloadBtn.onclick = (e) => {
                                e.stopPropagation();
                                const filename = this.buildImageFilename(altText, imageUrl);
                                this.downloadImage(imageUrl, filename);
                            };
                            actions.appendChild(downloadBtn);

                            // Copy Image Button (Icon Only)
                            const copyImgBtn = document.createElement('button');
                            copyImgBtn.className = 'nv-action-btn';
                            copyImgBtn.title = 'Copy Image';
                            copyImgBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
                            copyImgBtn.onclick = (e) => {
                                e.stopPropagation();
                                this.copyImageToClipboard(imageUrl, copyImgBtn);
                            };
                            actions.appendChild(copyImgBtn);
                        }
                    } else {
                        // Copy button for text (Icon Only)
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'nv-action-btn';
                        copyBtn.title = 'Copy';
                        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
                        copyBtn.onclick = (e) => {
                            e.stopPropagation();
                            this.copyToClipboard(msg.content, copyBtn);
                        };
                        actions.appendChild(copyBtn);
                    }

                    // Regenerate button (Icon Only)
                    const regenBtn = document.createElement('button');
                    regenBtn.className = 'nv-action-btn';
                    regenBtn.title = 'Regenerate';
                    regenBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2"/></svg>`;
                    regenBtn.onclick = (e) => {
                        e.stopPropagation();
                        this.regenerateResponse(messageIndex);
                    };
                    actions.appendChild(regenBtn);

                    div.appendChild(actions);
                }

                this.elements.msgContainer.insertBefore(div, this.elements.typingIndicator);
            });

            // Restore scroll position or scroll to bottom
            if (preserveScroll && scrollPos !== null) {
                this.elements.msgContainer.scrollTop = scrollPos;
            } else if (!preserveScroll) {
                this.scrollToBottom();
            }
            this.updateTypingIndicatorVisibility();
            this.initCodeCopy(this.elements.msgContainer);
            this.applyHighlighting(this.elements.msgContainer);
        }

        findPreviousUserMessageIndex(startIndex) {
            for (let i = startIndex - 1; i >= 0; i--) {
                if (this.messages[i] && this.messages[i].role === 'user') {
                    return i;
                }
            }
            return -1;
        }

        async regenerateResponse(messageIndex) {
            const validationResult = this.validateRegenerateRequest(messageIndex);
            if (!validationResult.isValid) return;

            const { userMessage, currentMessage, userMessageIndex } = validationResult;
            const requestChatId = this.currentChatId;
            const isImageGen = this.isImageGeneration(currentMessage);

            this.initializeVersionForRegeneration(currentMessage);
            const targetVersionIndex = currentMessage.regenTargetIndex ?? currentMessage.currentVersion ?? (currentMessage.versions.length - 1);

            if (requestChatId === this.currentChatId) {
                this.updateRegenerateUI(messageIndex, currentMessage);
            }

            try {
                const newContent = await this.generateNewContent(
                    isImageGen,
                    userMessage,
                    userMessageIndex
                );

                this.finalizeSuccessfulRegeneration(
                    currentMessage,
                    targetVersionIndex,
                    newContent,
                    requestChatId
                );
            } catch (error) {
                this.handleRegenerationError(
                    error,
                    currentMessage,
                    targetVersionIndex,
                    requestChatId
                );
            }
        }

        validateRegenerateRequest(messageIndex) {
            if (messageIndex === 0) {
                return { isValid: false };
            }

            const userMessageIndex = this.findPreviousUserMessageIndex(messageIndex);
            if (userMessageIndex === -1) {
                return { isValid: false };
            }

            const userMessage = this.messages[userMessageIndex];
            if (!userMessage || userMessage.role !== 'user') {
                return { isValid: false };
            }

            const currentMessage = this.messages[messageIndex];
            if (!currentMessage || currentMessage.role !== 'assistant') {
                return { isValid: false };
            }

            return {
                isValid: true,
                userMessage,
                currentMessage,
                userMessageIndex
            };
        }

        isImageGeneration(message) {
            return message.content.trim().startsWith('<img') ||
                (message.versions && message.versions[0].trim().startsWith('<img'));
        }

        isErrorMessageContent(content) {
            return typeof content === 'string' && content.startsWith('Error •');
        }

        clearTrailingErrorMessage() {
            const lastIndex = this.messages.length - 1;
            if (lastIndex < 0) return false;

            const lastMessage = this.messages[lastIndex];
            if (!lastMessage || lastMessage.role !== 'assistant' || !this.isErrorMessageContent(lastMessage.content)) {
                return false;
            }

            this.messages.pop();
            const messageElements = this.elements.msgContainer.querySelectorAll('.nv-message');
            if (messageElements.length) {
                messageElements[messageElements.length - 1].remove();
            }

            const newLastIndex = this.messages.length - 1;
            const previousMessage = newLastIndex >= 0 ? this.messages[newLastIndex] : null;
            if (previousMessage && previousMessage.role === 'user') {
                this.messages.pop();
                const remainingElements = this.elements.msgContainer.querySelectorAll('.nv-message');
                if (remainingElements.length) {
                    remainingElements[remainingElements.length - 1].remove();
                }
            }

            this.saveHistory();
            return true;
        }

        initializeVersionForRegeneration(currentMessage) {
            if (!currentMessage.versions) {
                currentMessage.versions = [currentMessage.content];
                currentMessage.currentVersion = 0;
            }

            const previousVersionIndex = currentMessage.currentVersion ?? 0;
            let targetVersionIndex = currentMessage.versions.length;

            if (this.isErrorMessageContent(currentMessage.content)) {
                targetVersionIndex = previousVersionIndex;
            }

            currentMessage.regenPrevIndex = previousVersionIndex;
            currentMessage.regenTargetIndex = targetVersionIndex;
            currentMessage.versions[targetVersionIndex] = '';
            currentMessage.currentVersion = targetVersionIndex;
            currentMessage.content = '';
            currentMessage.isLoading = true;
        }

        updateRegenerateUI(messageIndex, currentMessage) {
            const messageElements = this.elements.msgContainer.querySelectorAll('.nv-message');
            const messageElement = messageElements[messageIndex];

            if (!messageElement) return;

            const existingTabs = messageElement.querySelector('.nv-version-tabs');
            if (currentMessage.versions && currentMessage.versions.length > 1) {
                const tabsContainer = existingTabs || this.ensureVersionTabsContainer(messageElement);
                this.rebuildVersionTabs(tabsContainer, currentMessage, messageIndex);
            } else if (existingTabs) {
                existingTabs.remove();
            }
            this.updateMessageContent(messageIndex);
        }

        ensureVersionTabsContainer(messageElement) {
            let tabsContainer = messageElement.querySelector('.nv-version-tabs');

            if (!tabsContainer) {
                tabsContainer = document.createElement('div');
                tabsContainer.className = 'nv-version-tabs';
                messageElement.insertBefore(tabsContainer, messageElement.firstChild);
            }

            return tabsContainer;
        }

        rebuildVersionTabs(tabsContainer, currentMessage, messageIndex) {
            tabsContainer.innerHTML = '';

            currentMessage.versions.forEach((version, versionIndex) => {
                const tab = this.createVersionTab(
                    versionIndex,
                    currentMessage.currentVersion,
                    messageIndex
                );
                tabsContainer.appendChild(tab);
            });
        }

        createVersionTab(versionIndex, currentVersion, messageIndex) {
            const tab = document.createElement('button');
            tab.className = 'nv-version-tab';

            if (versionIndex === currentVersion) {
                tab.classList.add('active');
            }

            tab.textContent = versionIndex + 1;
            tab.onclick = (e) => {
                e.stopPropagation();
                this.switchVersion(messageIndex, versionIndex);
            };

            return tab;
        }

        async generateNewContent(isImageGen, userMessage, userMessageIndex) {
            if (isImageGen) {
                return await this.regenerateImageContent(userMessage);
            } else {
                return await this.regenerateTextContent(userMessage, userMessageIndex);
            }
        }

        async regenerateImageContent(userMessage) {
            const encoded = encodeURIComponent(userMessage.content);
            const isPrivate = this.state.isGhostMode ? '&private=true' : '';
            const seed = Math.floor(Math.random() * 100000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?nologo=true${isPrivate}&seed=${seed}`;

            // Preload via Fetch/Blob
            await this.preloadImage(imageUrl);

            // Store the original URL in history and display via blob when rendered
            return `<img src="${this.IMAGE_PLACEHOLDER}" data-nv-image-raw="${imageUrl}" data-nv-image-full="${imageUrl}" alt="${userMessage.content}" style="max-width: 100%; border-radius: 8px; margin-top: 4px;">`;
        }

        async regenerateTextContent(userMessage, userMessageIndex) {
            const historyBeforeMessage = this.messages.slice(0, userMessageIndex + 1);
            const reasoningLevel = await this.getSelectedReasoningLevel(userMessage.content);
            return await this.fetchAIResponse(userMessage.content, historyBeforeMessage, reasoningLevel);
        }

        finalizeSuccessfulRegeneration(currentMessage, targetVersionIndex, newContent, requestChatId) {
            currentMessage.versions[targetVersionIndex] = newContent;
            currentMessage.currentVersion = targetVersionIndex;
            currentMessage.content = newContent;
            currentMessage.isLoading = false;

            this.cleanupRegenerationMetadata(currentMessage);
            this.saveHistory();

            if (requestChatId === this.currentChatId) {
                this.renderMessages(true);
            }
        }

        handleRegenerationError(error, currentMessage, targetVersionIndex, requestChatId) {
            console.error('NeuraVeil Regenerate Error:', error);

            const errorMsg = 'Error • ' + (error.message || 'Unable to regenerate.');
            currentMessage.versions[targetVersionIndex] = errorMsg;
            currentMessage.currentVersion = targetVersionIndex;
            currentMessage.content = errorMsg;
            currentMessage.isLoading = false;

            this.cleanupRegenerationMetadata(currentMessage);
            this.saveHistory();

            if (requestChatId === this.currentChatId) {
                this.renderMessages(true);
            }
        }

        cleanupRegenerationMetadata(currentMessage) {
            delete currentMessage.regenPrevIndex;
            delete currentMessage.regenTargetIndex;
        }

        switchVersion(messageIndex, versionIndex) {
            const message = this.messages[messageIndex];
            if (!message || !message.versions || versionIndex >= message.versions.length) return;

            message.currentVersion = versionIndex;
            message.content = message.versions[versionIndex];
            this.saveHistory();
            this.updateMessageContent(messageIndex);
        }

        triggerCopyFeedback(button, variant = 'success') {
            if (!button) return;
            if (!button.dataset.nvCopyOriginal) {
                button.dataset.nvCopyOriginal = button.innerHTML;
            }
            if (button._nvCopyTimeout) {
                clearTimeout(button._nvCopyTimeout);
            }

            button.classList.remove('nv-copy-success', 'nv-copy-success-primary');
            const className = variant === 'primary' ? 'nv-copy-success-primary' : 'nv-copy-success';
            button.classList.add(className);
            button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

            button._nvCopyTimeout = setTimeout(() => {
                button.classList.remove(className);
                if (button.dataset.nvCopyOriginal) {
                    button.innerHTML = button.dataset.nvCopyOriginal;
                }
                button._nvCopyTimeout = null;
            }, 900);
        }

        stripToolTagsForCopy(text) {
            const raw = String(text || '');
            let stripped = raw
                .replace(/\[tool:link([^\]]*)\]/gi, (match, attrs) => {
                    const urlMatch = String(attrs || '').match(/url\s*=\s*"([^"]+)"/i);
                    return urlMatch ? urlMatch[1] : '';
                })
                .replace(/<tool:link([^>]*)>/gi, (match, attrs) => {
                    const urlMatch = String(attrs || '').match(/url\s*=\s*"([^"]+)"/i);
                    return urlMatch ? urlMatch[1] : '';
                })
                .replace(/\[tool:[^\]]+\]/gi, '')
                .replace(/\[\/tool:[^\]]+\]/gi, '')
                .replace(/<tool:[^>]+>/gi, '')
                .replace(/<\/tool:[^>]+>/gi, '');

            stripped = stripped
                .replace(/\r\n/g, '\n')
                .replace(/```[\w-]*\s*\n([\s\S]*?)```/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/^\s*#{1,6}\s+/gm, '')
                .replace(/^\s*[-*_]{3,}\s*$/gm, '')
                .replace(/^\s*>\s?/gm, '')
                .replace(/^\s*[-*+]\s+/gm, '')
                .replace(/^\s*\d+[.)]\s+/gm, '')
                .replace(/\*\*([\s\S]+?)\*\*/g, '$1')
                .replace(/__([\s\S]+?)__/g, '$1')
                .replace(/\*\*/g, '')
                .replace(/__/g, '');

            return stripped.replace(/\n{3,}/g, '\n\n').trim();
        }

        copyToClipboard(text, button) {
            const cleaned = this.stripToolTagsForCopy(text);
            navigator.clipboard.writeText(cleaned).then(() => {
                this.triggerCopyFeedback(button);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }

        async copyImageToClipboard(imageUrl, button) {
            try {
                const response = await this.request(imageUrl, { responseType: 'arraybuffer' });
                const sourceBlob = await response.blob();
                const blobUrl = URL.createObjectURL(sourceBlob);

                const img = new Image();
                img.src = blobUrl;

                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = () => reject(new Error('Failed to load image for copying'));
                });

                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Convert to PNG blob (universally supported by Clipboard API)
                const clipboardBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

                if (!clipboardBlob) throw new Error('Failed to create image blob');

                const item = new ClipboardItem({ 'image/png': clipboardBlob });
                await navigator.clipboard.write([item]);
                this.triggerCopyFeedback(button);
                URL.revokeObjectURL(blobUrl);
            } catch (err) {
                console.error('Failed to copy image:', err);
            }
        }

        getImageExtensionFromUrl(url) {
            const match = String(url || '').match(/\.(png|jpe?g|webp|gif|bmp)(?:[?#].*)?$/i);
            return match ? match[1].toLowerCase() : 'png';
        }

        buildImageFilename(altText, url) {
            const raw = String(altText || '').trim();
            let base = raw
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9 _-]/g, ' ')
                .replace(/\s+/g, '_')
                .replace(/^_+|_+$/g, '');
            if (!base) base = 'image';
            const maxLength = 48;
            if (base.length > maxLength) {
                base = base.slice(0, maxLength).replace(/_+$/g, '');
            }
            const ext = this.getImageExtensionFromUrl(url);
            return `${base}.${ext}`;
        }

        async downloadImage(url, filename) {
            try {
                // Fetch image as blob to force download
                const response = await this.request(url, { responseType: 'arraybuffer' });
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename || this.buildImageFilename('', url);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Clean up blob URL
                URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error('Download failed:', error);
                // Fallback: open in new tab
                window.open(url, '_blank');
            }
        }

        appendMessageToChat(chatId, role, content, isHtml = false) {
            if (this.state.isGhostMode) {
                if (chatId === this.currentChatId) {
                    this.appendMessage(role, content, isHtml);
                }
                return;
            }

            if (chatId === this.currentChatId) {
                this.appendMessage(role, content, isHtml);
                return;
            }

            let chat = this.history.find(h => h.id === chatId);
            if (!chat) {
                chat = {
                    id: chatId,
                    timestamp: Date.now(),
                    title: 'New Conversation',
                    autoTitle: null,
                    messages: []
                };
                this.history.unshift(chat);
            }

            chat.messages.push({ role, content });
            if (role === 'user' && !chat.manualTitle && !chat.autoTitle) {
                const userCount = chat.messages.filter(m => m.role === 'user').length;
                if (userCount === 1) {
                    this.maybeGenerateConversationTitle(chatId, content);
                }
            }
            chat.title = chat.manualTitle || chat.autoTitle || chat.title || 'New Conversation';
            chat.timestamp = Date.now();

            this.history = this.history.filter(h => h.id !== chatId);
            this.history.unshift(chat);
            GM_setValue('NeuraVeil_history', JSON.stringify(this.history));
            if (this.state.isHistoryOpen) this.renderHistoryList();
        }

        appendMessage(role, content, isHtml = false) {
            const messageIndex = this.messages.length;
            const isGreeting = this.isDefaultGreeting({ role, content }, messageIndex);
            const div = document.createElement('div');
            div.className = `nv-message ${role}`;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'nv-message-content';
            if (role === 'assistant') {
                this.applyAssistantContent(contentDiv, content, isHtml);
            } else if (isHtml) {
                contentDiv.innerHTML = content;
            } else {
                contentDiv.textContent = content;
            }
            div.appendChild(contentDiv);
            this.applyHighlighting(div);
            this.initCodeCopy(div);

            // Add action buttons for assistant messages
            if (role === 'assistant' && !isGreeting) {
                const actions = document.createElement('div');
                actions.className = 'nv-message-actions';

                if (isHtml && content.trim().startsWith('<img')) {
                    // Extract image URL from HTML
                    const urlMatch = content.match(/src="([^"]+)"/);
                    const altMatch = content.match(/alt="([^"]*)"/);
                    const altText = altMatch ? altMatch[1] : '';
                    if (urlMatch) {
                        const imageUrl = urlMatch[1];

                        // Download Button (Icon Only)
                        const downloadBtn = document.createElement('button');
                        downloadBtn.className = 'nv-action-btn';
                        downloadBtn.title = 'Download Image';
                        downloadBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>`;
                        downloadBtn.onclick = (e) => {
                            e.stopPropagation();
                            const filename = this.buildImageFilename(altText, imageUrl);
                            this.downloadImage(imageUrl, filename);
                        };
                        actions.appendChild(downloadBtn);

                        // Copy Image Button (Icon Only)
                        const copyImgBtn = document.createElement('button');
                        copyImgBtn.className = 'nv-action-btn';
                        copyImgBtn.title = 'Copy Image';
                        copyImgBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
                        copyImgBtn.onclick = (e) => {
                            e.stopPropagation();
                            this.copyImageToClipboard(imageUrl, copyImgBtn);
                        };
                        actions.appendChild(copyImgBtn);
                    }
                } else {
                    // Copy button for text (Icon Only)
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'nv-action-btn';
                    copyBtn.title = 'Copy';
                    copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
                    copyBtn.onclick = (e) => {
                        e.stopPropagation();
                        this.copyToClipboard(content, copyBtn);
                    };
                    actions.appendChild(copyBtn);
                }

                // Regenerate button (Icon Only)
                const regenBtn = document.createElement('button');
                regenBtn.className = 'nv-action-btn';
                regenBtn.title = 'Regenerate';
                regenBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2"/></svg>`;
                regenBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.regenerateResponse(messageIndex);
                };
                actions.appendChild(regenBtn);

                div.appendChild(actions);
            }

            const isFirstUserMessage = role === 'user' && !this.messages.some(m => m.role === 'user');
            this.elements.msgContainer.insertBefore(div, this.elements.typingIndicator);
            this.scrollToBottom();
            this.messages.push({ role, content });
            this.saveHistory();

            if (isFirstUserMessage) {
                this.maybeGenerateConversationTitle(this.currentChatId, content);
            }

            if (role === 'assistant') {
                this.applyHighlighting(this.shadow);
            }
        }

        scrollToBottom() {
            const container = this.elements.msgContainer;
            container.scrollTop = container.scrollHeight;
        }

        updateTypingIndicatorVisibility() {
            const shouldShow = this.state.isTyping && this.state.loadingChatId === this.currentChatId;
            this.elements.typingIndicator.classList.toggle('visible', shouldShow);
        }

        setLoadingText(text) {
            if (this.elements.typingText) {
                this.elements.typingText.textContent = text || '';
                this.elements.typingText.style.display = text ? 'inline-block' : 'none';
            }
        }

        setLoading(loading, chatId = this.currentChatId) {
            if (!loading) this.setLoadingText('');

            if (loading) {
                this.state.isTyping = true;
                this.state.loadingChatId = chatId;
            } else if (this.state.loadingChatId === chatId) {
                this.state.isTyping = false;
                this.state.loadingChatId = null;
            }

            const isCurrentChat = chatId === this.currentChatId;
            if (isCurrentChat) {
                this.elements.sendBtn.disabled = loading;
                this.elements.input.disabled = loading;
            }

            this.updateTypingIndicatorVisibility();
            if (!loading && isCurrentChat) this.elements.input.focus();
            if (isCurrentChat) this.scrollToBottom();
        }

        async handleSend() {
            const text = this.elements.input.value.trim();
            if (!text || this.state.isTyping) return;

            // Check if image mode is active
            if (this.state.isImageMode) {
                await this.handleImageGen();
                return;
            }

            const requestChatId = this.currentChatId;
            this.elements.input.value = '';
            this.autoResizeInput();
            this.clearTrailingErrorMessage();
            this.appendMessage('user', text);
            this.setLoading(true, requestChatId);

            try {
                const reasoningLevel = await this.getSelectedReasoningLevel(text);
                const response = await this.fetchAIResponse(text, null, reasoningLevel);
                this.appendMessageToChat(requestChatId, 'assistant', response);
            } catch (error) {
                this.appendMessageToChat(
                    requestChatId,
                    'assistant',
                    'Error • The connection failed. Please wait a few seconds and try again.'
                );
                console.error('NeuraVeil Error:', error);
            } finally {
                this.setLoading(false, requestChatId);
            }
        }

        async getSelectedReasoningLevel(userText) {
            if (this.state.reasoningEffort !== 'auto') {
                return this.state.reasoningEffort;
            }
            return await this.fetchAutoReasoningLevel(userText);
        }

        async fetchAutoReasoningLevel(userText) {
            const url = 'https://text.pollinations.ai/openai';
            const routerSystemPrompt = `You are an internal router.

                Task:
                Given the user prompt, choose the most appropriate reasoning level.

                Rules:
                - Respond with ONE word only.
                - No explanation.
                - No punctuation.
                - No extra text.

                Allowed outputs:
                minimal
                low
                medium
                high

                Criteria:
                - minimal: extraction, formatting, very short tasks
                - low: simple questions, factual answers
                - medium: general tasks, summaries, explanations
                - high: complex reasoning, planning, strategy, multi-step tasks`;

            const payload = {
                messages: [
                    { role: 'system', content: routerSystemPrompt },
                    { role: 'user', content: `User prompt:\n"${userText}"` }
                ],
                model: 'openai',
                reasoning_effort: 'low',
                seed: Math.floor(Math.random() * 10000)
            };

            const makeRequest = async (retryCount = 0) => {
                try {
                    const response = await this.request(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (response.status === 429) {
                        if (retryCount < 2) {
                            const delay = 2000 * Math.pow(2, retryCount);
                            console.warn(`NeuraVeil: Router rate limit, retrying in ${delay}ms...`);
                            await new Promise(r => setTimeout(r, delay));
                            return makeRequest(retryCount + 1);
                        }
                        throw new Error('Router request rate limited.');
                    }

                    if (!response.ok) throw new Error(`Router network error: ${response.status}`);
                    const data = await response.json();
                    const raw = (data.choices?.[0]?.message?.content || '').trim().toLowerCase();
                    const normalized = raw.split(/\s+/)[0].replace(/[^a-z]/g, '');
                    const allowed = ['minimal', 'low', 'medium', 'high'];
                    if (allowed.includes(normalized)) {
                        return normalized;
                    }
                    return 'low';
                } catch (e) {
                    console.warn('NeuraVeil: Router failed, defaulting to low.', e);
                    return 'low';
                }
            };

            return await makeRequest();
        }

        async fetchAIResponse(userText, historyOverride = null, reasoningOverride = null) {
            const url = 'https://text.pollinations.ai/openai';
            // Limit history to 6 to prevent context length issues
            const sourceHistory = Array.isArray(historyOverride) ? historyOverride : this.messages;
            const recentHistory = sourceHistory.slice(-6);
            const reasoningLevel = reasoningOverride || this.state.reasoningEffort;
            const stylePrompt = this.getStylePrompt();
            const baseSystemPrompt = `You are NeuraVeil, a helpful and concise AI assistant living in a browser overlay.${stylePrompt ? `\n\nStyle:\n${stylePrompt}` : ''}\n\nCode formatting rule:\n- Any code you return must be wrapped in a markdown code fence with a language (e.g., \`\`\`js ...\`\`\`) or in [tool:code lang=\"...\"] blocks. Do NOT leave code as plain text.`;
            const toolSpec = `Tools:
                - generate_image: [tool:generate_image prompt="..."]
                - show_image: [tool:show_image query="..." alt="..."] or [tool:show_image url="..." alt="..."]
                - link: [tool:link url="..." text="..."]
                - code: [tool:code lang="js"]...[/tool:code]  (preferred for code)

                Rules:
                - You may also use Markdown code fences (\\\`\\\`\\\`lang ... \\\`\\\`\\\`). Either fences or [tool:code] is accepted.
                - Never output raw HTML.
                - Mix normal text and tool calls as needed.`;
            const highModePrompt = `You are in HIGH reasoning mode.

                Instructions:
                - Apply deep, multi-step reasoning internally.
                - Fully understand the user intent before answering.
                - If the input text is rough, unclear, or poorly structured, rewrite it automatically.
                - Produce a clear, well-written final answer with proper paragraphs and spacing.
                - When relevant, structure the output (sections, lists, steps).
                - Decide whether the response should include images, links, or code; if so, include the appropriate tool calls in the final output.
                - Only include images (generate_image/show_image) when the user explicitly asks for an image.
                - You may include a show_image tool call when the user asks what something looks like (e.g., "what does a truck look like").

                Constraints:
                - Never reveal internal reasoning or analysis.
                - Do not mention intermediate steps.
                - Output only the final, polished result.

                Goal:
                Deliver the most accurate, thoughtful, and well-presented answer possible.

                ${toolSpec}`;
            const ultraModePrompt = `You are in ULTRA reasoning mode.

                Instructions:
                - Apply intermediate, multi-step reasoning internally (more thorough than high).
                - Validate assumptions and check for edge cases when relevant.
                - Fully understand the user intent before answering.
                - If the input text is rough, unclear, or poorly structured, rewrite it automatically.
                - Produce a clear, well-written final answer with proper paragraphs and spacing.
                - When relevant, structure the output (sections, lists, steps).
                - Decide whether the response should include images, links, or code; if so, include the appropriate tool calls in the final output.
                - Only generate images when the user explicitly asks for an image.
                - Prefer including a show_image tool call for visual or concrete objects when helpful (e.g., "what is a dog", "what does it look like..."), even if the user did not explicitly ask for an image.
                - When you use show_image, prefer a short query (e.g., [tool:show_image query="ford mustang" alt="Ford Mustang"]).

                Constraints:
                - Never reveal internal reasoning or analysis.
                - Do not mention intermediate steps.
                - Output only the final, polished result.

                Goal:
                Deliver the most accurate, thoughtful, and well-presented answer possible.

            ${toolSpec}`;
            let systemPrompt = baseSystemPrompt;
            if (reasoningLevel === 'high') {
                systemPrompt = `${baseSystemPrompt}\n\n${highModePrompt}`;
            } else if (reasoningLevel === 'ultra') {
                systemPrompt = `${baseSystemPrompt}\n\n${ultraModePrompt}`;
            }

            const payload = {
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...recentHistory
                ],
                model: 'openai',
                reasoning_effort: this.getReasoningEffort(reasoningLevel),
                seed: Math.floor(Math.random() * 10000) // Avoid cache collisions
            };

            const makeRequest = async (retryCount = 0) => {
                const response = await this.request(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.status === 429) {
                    if (retryCount < 2) {
                        // Exponential backoff: 2s, 4s
                        const delay = 2000 * Math.pow(2, retryCount);
                        console.warn(`NeuraVeil: Rate limit hit, retrying in ${delay}ms...`);
                        await new Promise(r => setTimeout(r, delay));
                        return makeRequest(retryCount + 1);
                    }
                    throw new Error('Server is currently overloaded (Too Many Requests). Please try again in a moment.');
                }

                if (!response.ok) throw new Error(`Network error: ${response.status}`);
                const data = await response.json();
                const content = data.choices?.[0]?.message?.content || 'No response.';
                let cleaned = this.sanitizeAssistantText(content);
                cleaned = this.maybeInjectUltraImage(userText, reasoningLevel, cleaned);
                return cleaned;
            };

            return await makeRequest();
        }

        sanitizeAssistantText(text) {
            if (!text) return text;
            let cleaned = text;
            const adBlockRegex = /\n*\s*---\s*\n\s*\*\*Support Pollinations\.AI:\*\*[\s\S]*?keep AI accessible for everyone\.\s*/gi;
            cleaned = cleaned.replace(adBlockRegex, '');
            cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
            return cleaned.trim();
        }

        setupSpeechRecognition() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                if (this.elements.micBtn) this.elements.micBtn.style.display = 'none';
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'fr-FR';

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                const input = this.elements.input;

                // Track where we started inserting text for this session if not already tracked
                if (typeof this.speechCursorStart === 'undefined' || !this.isRecording) {
                    this.speechCursorStart = input.selectionStart;
                    this.speechTextBefore = input.value.substring(0, this.speechCursorStart);
                    this.speechTextAfter = input.value.substring(input.selectionEnd);
                }


                const prefix = (this.speechTextBefore && !this.speechTextBefore.endsWith(' ') && !(finalTranscript || interimTranscript).startsWith(' ')) ? ' ' : '';
                // Accumulate only finalized speech results

                if (!this.accumulatedFinal) this.accumulatedFinal = '';
                this.accumulatedFinal += finalTranscript;

                const displayText = this.accumulatedFinal + interimTranscript;

                input.value = this.speechTextBefore + prefix + displayText + this.speechTextAfter;

                const newPos = this.speechTextBefore.length + prefix.length + displayText.length;
                input.selectionStart = newPos;
                input.selectionEnd = newPos;
                this.adjustHeight();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    this.stopRecording();
                }
            };

            this.recognition.onend = () => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            };
        }

        toggleSpeech() {
            if (!this.recognition) return;

            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        }

        startRecording() {
            try {
                // Reset speech state variables
                this.speechCursorStart = undefined;
                this.speechTextBefore = '';
                this.speechTextAfter = '';
                this.accumulatedFinal = '';

                this.recognition.start();
                this.isRecording = true;
                this.elements.micBtn.classList.add('active');
                // Check icon
                this.elements.micBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                this.elements.micBtn.style.color = '#22c55e';
                this.elements.input.placeholder = 'Listening...';
            } catch (e) {
                console.error(e);
            }
        }

        stopRecording() {
            if (this.recognition) {
                this.recognition.stop();
            }
            this.isRecording = false;

            // Clear speech state variables
            this.speechCursorStart = undefined;
            this.speechTextBefore = '';
            this.speechTextAfter = '';
            this.accumulatedFinal = '';

            // Reset to mic icon
            if (this.elements.micBtn) {
                this.elements.micBtn.classList.remove('active');
                this.elements.micBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;
                this.elements.micBtn.style.color = '';
            }
            if (this.elements.input) {
                this.elements.input.placeholder = this.state.isImageMode ? 'Describe your image...' : 'Type a message...';
            }
        }
    }

    // Initialize NeuraVeil !
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new NeuraVeil());
    } else {
        new NeuraVeil();
    }

})();
