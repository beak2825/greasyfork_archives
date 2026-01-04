// ==UserScript==
// @name         Animate Emoji for Drawaria
// @namespace    Tampermonkey
// @version      3.0
// @description  Adds a stylish, draggable menu with an internal data source for selecting animated emojis and stamping them on the Drawaria.online canvas.
// @author       YouTubeDrawaria / Gemini
// @homepage     https://github.com/quarrel/animate-web-emoji
// @match        https://drawaria.online/
// @match        https://*.drawaria.online/*
// @match        https://drawaria.online/test
// @match        https://drawaria.online/room/*
// @run-at       document-idle
// @icon         https://fonts.gstatic.com/s/e/notoemoji/latest/1f603/512.webp
// @license      MIT
// @noframes
// @resource     LOTTIE_BACKUP_PUREJS_PLAYER_URL https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_canvas.min.js
// @grant        GM.getResourceUrl
// @grant        GM.addStyle
// @grant        GM.xmlHttpRequest
// @connect      cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/551019/Animate%20Emoji%20for%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/551019/Animate%20Emoji%20for%20Drawaria.meta.js
// ==/UserScript==

/* globals lottie */

(function () {
    'use strict';

    const scriptStartTime = Date.now();
    const config = {
        DEBUG_MODE: false,
        UNIQUE_EMOJI_CLASS: 'animated-emoji-q',
    };

    let emojiData = []; // New structure to hold all emoji data
    let codepointToLottie = new Map();
    let isPureLottiePlayerLoaded = false;

    // --- DATOS INTERNOS DE EMOJIS (HARDCODED) ---
    // C: Codepoint | E: Emoji Character | D: Description (for search)
    const ANIMATED_EMOJIS_DATA = [
        // Smileys and Emotion
        { c: '1f600', e: '😀', d: 'Smile' }, { c: '1f603', e: '😃', d: 'Smile big eyes' },
        { c: '1f604', e: '😄', d: 'Grin' }, { c: '1f601', e: '😁', d: 'Grinning' },
        { c: '1f606', e: '😆', d: 'Laughing' }, { c: '1f605', e: '😅', d: 'Grin sweat' },
        { c: '1f602', e: '😂', d: 'Joy tears' }, { c: '1f923', e: '🤣', d: 'Rofl' },
        { c: '1f62d', e: '😭', d: 'Loudly crying' }, { c: '1f609', e: '😉', d: 'Wink' },
        { c: '1f617', e: '😗', d: 'Kissing' }, { c: '1f619', e: '😙', d: 'Kissing smiling eyes' },
        { c: '1f61a', e: '😚', d: 'Kissing closed eyes' }, { c: '1f618', e: '😘', d: 'Kissing heart' },
        { c: '1f970', e: '🥰', d: 'Heart face' }, { c: '1f60d', e: '😍', d: 'Heart eyes' },
        { c: '1f929', e: '🤩', d: 'Star struck' }, { c: '1f973', e: '🥳', d: 'Partying face' },
        { c: '1fae0', e: '🫠', d: 'Melting' }, { c: '1f643', e: '🙃', d: 'Upside down' },
        { c: '1f642', e: '🙂', d: 'Slightly happy' }, { c: '1f972', e: '🥹', d: 'Happy cry' },
        { c: '1f979', e: '🥺', d: 'Holding back tears' }, { c: '1f60a', e: '😊', d: 'Blush' },
        { c: '1f631', e: '😱', d: 'Scream fear' }, { c: '1f60c', e: '😌', d: 'Relieved' },
        { c: '1f60b', e: '😋', d: 'Yummy food' }, { c: '1f61b', e: '😛', d: 'Tongue' },
        { c: '1f911', e: '🤑', d: 'Money face' }, { c: '1f974', e: '🤯', d: 'Exploding head' },
        { c: '1f92a', e: '🤪', d: 'Crazy wacky' }, { c: '1f92b', e: '🤫', d: 'Shushing' },
        { c: '1f92d', e: '🤦', d: 'Facepalm' }, { c: '1f97a', e: '🥺', d: 'Pleading face' },
        { c: '1f64f', e: '🙏', d: 'Praying hands' }, { c: '1f44f', e: '👏', d: 'Clapping hands' },

        // Hands and Symbols
        { c: '1f44d', e: '👍', d: 'Thumbs up' }, { c: '1f44e', e: '👎', d: 'Thumbs down' },
        { c: '1f44c', e: '👌', d: 'OK hand' }, { c: '1f44a', e: '✊', d: 'Raised fist' },
        { c: '1f496', e: '💖', d: 'Sparkling heart' }, { c: '1f499', e: '💙', d: 'Blue heart' },
        { c: '1f4af', e: '💯', d: 'Hundred points' }, { c: '1f525', e: '🔥', d: 'Fire flame hot' },
        { c: '1f389', e: '🎉', d: 'Party popper' }, { c: '1f4a9', e: '💩', d: 'Poop pile' },
        { c: '1f31f', e: '🌟', d: 'Glowing star' }, { c: '1f47d', e: '👽', d: 'Alien monster' },
    ];


    // --- UTILITIES & INITIALIZATION ---

    function loadScript(url, id, callback) {
        if (document.getElementById(id)) {
            if (callback) callback();
            return;
        }
        const script = document.createElement('script');
        script.id = id;
        script.src = url;
        script.onload = () => {
             if (id === 'lottie-canvas-player') isPureLottiePlayerLoaded = true;
             if (callback) callback();
        };
        document.head.appendChild(script);
    }

    async function getLottieAnimationData(codepoint) {
        if (codepointToLottie.has(codepoint)) {
            return codepointToLottie.get(codepoint);
        }

        try {
            // Animation JSONs are consistently hosted here by the original project
            const lottieUrl = `https://cdn.jsdelivr.net/gh/quarrel/noto-emoji-animation-web/emoji/${codepoint}.json`;

            // Use GM.xmlHttpRequest for cross-origin fetch for reliable data loading
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: lottieUrl,
                    onload: (res) => resolve(res),
                    onerror: (err) => reject(err),
                });
            });

            const data = JSON.parse(response.responseText);
            codepointToLottie.set(codepoint, data);
            return data;
        } catch (error) {
            if (config.DEBUG_MODE) {
                console.error(
                    `🇦🇺: Failed to fetch Lottie JSON for ${codepoint}. This emoji cannot be stamped.`,
                    error
                );
            }
            return null;
        }
    }

    // Simplified initialization: just copy the hardcoded data
    function initializeEmojiData() {
        emojiData = ANIMATED_EMOJIS_DATA;
    }


    // --- DRAGGABLE MENU IMPLEMENTATION ---

    const MENU_ID = 'animated-emoji-menu';
    const MENU_TITLE = '🎨 Emojis Animados';
    let selectedEmojiCodepoint = null;

    function createDraggableMenu() {
        const menu = document.createElement('div');
        menu.id = MENU_ID;
        menu.innerHTML = `
            <div class="menu-header">
                ${MENU_TITLE}
                <span class="close-btn">×</span>
            </div>
            <div class="menu-content">
                <input type="text" id="emoji-search" placeholder="Buscar emoji (ej: heart, smile)..." title="Busca por el emoji o su descripción (ej: heart, dog)">
                <div id="emoji-gallery"></div>
            </div>
        `;
        document.body.appendChild(menu);

        // Make it draggable
        const header = menu.querySelector('.menu-header');
        header.addEventListener('mousedown', initDrag, false);
        menu.querySelector('.close-btn').addEventListener('click', () => {
            menu.style.display = 'none';
        });

        // Initialize drag functionality
        let drag = false,
            offsetX,
            offsetY;

        function initDrag(e) {
            if (e.button !== 0) return;
            drag = true;
            offsetX = e.clientX - menu.offsetLeft;
            offsetY = e.clientY - menu.offsetTop;
            document.addEventListener('mousemove', doDrag, false);
            document.addEventListener('mouseup', stopDrag, false);
            e.preventDefault();
        }

        function doDrag(e) {
            if (drag) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - menu.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - menu.offsetHeight));

                menu.style.left = newLeft + 'px';
                menu.style.top = newTop + 'px';
            }
        }

        function stopDrag() {
            drag = false;
            document.removeEventListener('mousemove', doDrag, false);
            document.removeEventListener('mouseup', stopDrag, false);
        }

        // Add a button to toggle the menu
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-emoji-menu-btn';
        toggleBtn.textContent = '🎨 Emojis Animados';
        toggleBtn.onclick = () => {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        };
        document.body.appendChild(toggleBtn);

        return menu;
    }

    function populateEmojiGallery(menu) {
        const gallery = menu.querySelector('#emoji-gallery');
        gallery.innerHTML = '';

        // Use the guaranteed internal data
        for (const item of emojiData) {
            const emojiItem = document.createElement('span');
            emojiItem.className = 'emoji-item';
            emojiItem.textContent = item.e; // The actual emoji character
            emojiItem.dataset.codepoint = item.c;
            emojiItem.title = item.d; // Description for hover and search

            // Pre-fetch Lottie data asynchronously to speed up stamping
            getLottieAnimationData(item.c).catch(() => {});

            emojiItem.addEventListener('click', () => {
                selectEmojiForDrawing(emojiItem);
            });
            gallery.appendChild(emojiItem);
        }

        // Add search functionality
        const searchInput = menu.querySelector('#emoji-search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            gallery.querySelectorAll('.emoji-item').forEach((item) => {
                const description = item.title.toLowerCase();
                const emojiChar = item.textContent;

                // Search by the emoji character or the description
                const isMatch =
                    description.includes(searchTerm) ||
                    emojiChar.includes(searchTerm);

                item.style.display = isMatch ? 'inline-block' : 'none';
            });
        });
    }

    function selectEmojiForDrawing(emojiItem) {
        document.querySelectorAll('.emoji-item.selected').forEach((item) => {
            item.classList.remove('selected');
        });

        emojiItem.classList.add('selected');
        selectedEmojiCodepoint = emojiItem.dataset.codepoint;

        if (config.DEBUG_MODE) {
            console.log(
                '🇦🇺: Emoji selected for drawing:',
                emojiItem.textContent
            );
        }

        // Show a temporary message to the user
        const menu = document.getElementById(MENU_ID);
        if (menu) {
             const message = document.createElement('div');
             message.textContent = `Seleccionado: ${emojiItem.textContent}. 🖌️ Haz clic en el canvas para estampar.`;
             message.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; background: #98c379; color: #282c34; padding: 5px; text-align: center; border-radius: 0 0 12px 12px; font-size: 14px; font-weight: bold; animation: fadein 0.5s;';
             message.classList.add('selection-message');

             // Remove any previous message and add the new one
             menu.querySelectorAll('.selection-message').forEach(m => m.remove());
             menu.appendChild(message);

             // Auto-hide the message after 2.5 seconds
             setTimeout(() => message.remove(), 2500);
        }
    }

    // --- CANVAS STAMP FUNCTIONALITY ---

    async function stampEmojiOnCanvas(e) {
        if (!selectedEmojiCodepoint) return;

        const canvas = document.getElementById('canvas');
        if (!canvas) return;

        // Ensure the Lottie Pure JS Player is loaded before proceeding
        if (!isPureLottiePlayerLoaded) {
            const LOTTIE_BACKUP_PUREJS_PLAYER_URL = await GM.getResourceUrl('LOTTIE_BACKUP_PUREJS_PLAYER_URL');
            loadScript(LOTTIE_BACKUP_PUREJS_PLAYER_URL, 'lottie-canvas-player', () => stampEmojiOnCanvas(e));
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animationData = await getLottieAnimationData(selectedEmojiCodepoint);
        if (!animationData) return;

        // --- RENDER LOGIC ---

        const tempCanvas = document.createElement('canvas');
        const emojiSize = 72; // Larger stamp size
        tempCanvas.width = emojiSize;
        tempCanvas.height = emojiSize;

        // The Lottie player is globally available now:
        const player = lottie.loadAnimation({
            renderer: 'canvas',
            loop: false,
            autoplay: false,
            animationData: animationData,
            container: tempCanvas,
            rendererSettings: {
                context: tempCanvas.getContext('2d'),
                preserveAspectRatio: 'xMidYMid meet',
                clearCanvas: true,
                hideOnTransparent: true,
            },
        });

        player.addEventListener('loaded', () => {
            // Render the first frame
            player.goToAndStop(0, true);

            // Get mouse coordinates relative to the main canvas
            const rect = canvas.getBoundingClientRect();
            // Center the stamp on the click position
            const x = e.clientX - rect.left - emojiSize / 2;
            const y = e.clientY - rect.top - emojiSize / 2;

            // Draw the rendered frame onto the main Drawaria canvas
            ctx.drawImage(tempCanvas, x, y, emojiSize, emojiSize);

            // Clean up
            player.destroy();
            tempCanvas.remove();

            if (config.DEBUG_MODE) console.log('🇦🇺: Emoji stamped successfully.');
        });

        player.addEventListener('error', (err) => {
             if (config.DEBUG_MODE) console.error('🇦🇺: Lottie rendering error:', err);
             player.destroy();
        });
    }

    function attachCanvasListener() {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.addEventListener('click', stampEmojiOnCanvas);
            if (config.DEBUG_MODE)
                console.log('🇦🇺: Canvas listener attached.');
        } else {
            setTimeout(attachCanvasListener, 500);
        }
    }

    // --- MAIN FUNCTION & STYLES ---

    const main = () => {
        try {
            initializeEmojiData();

            // 1. Initialize Menu and Canvas Interaction
            const menu = createDraggableMenu();
            populateEmojiGallery(menu);
            attachCanvasListener();

            // 2. Load the essential Lottie player asynchronously
            GM.getResourceUrl('LOTTIE_BACKUP_PUREJS_PLAYER_URL').then(url => {
                 loadScript(url, 'lottie-canvas-player');
            });

            // 3. Add Styles
            GM.addStyle(`
                /* --- STYLES FOR DRAGGABLE MENU --- */
                #${MENU_ID} {
                    position: fixed;
                    top: 50px;
                    left: 50px;
                    width: 320px;
                    height: 450px;
                    min-width: 200px;
                    min-height: 200px;
                    background: #282c34;
                    border: 1px solid #61afef;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
                    z-index: 99999;
                    display: none;
                    resize: both;
                    overflow: hidden;
                    color: #abb2bf;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    transition: box-shadow 0.2s;
                }

                #${MENU_ID}:hover {
                     box-shadow: 0 8px 20px rgba(0, 0, 0, 0.9), 0 0 10px #61afef80;
                }

                #${MENU_ID} .menu-header {
                    cursor: grab;
                    padding: 12px;
                    background: #3e4451;
                    color: #c678dd;
                    font-weight: bold;
                    font-size: 1.1em;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #61afef;
                }

                #${MENU_ID} .menu-header:active {
                    cursor: grabbing;
                }

                #${MENU_ID} .close-btn {
                    cursor: pointer;
                    font-size: 1.5em;
                    line-height: 1;
                    color: #e06c75;
                    transition: color 0.2s;
                }

                #${MENU_ID} .close-btn:hover {
                    color: #ff0000;
                }

                #${MENU_ID} .menu-content {
                    padding: 10px;
                    height: calc(100% - 47px);
                    display: flex;
                    flex-direction: column;
                }

                #emoji-search {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #555;
                    background: #1e2127;
                    color: #ffffff;
                    border-radius: 6px;
                    font-size: 14px;
                }

                #emoji-gallery {
                    flex-grow: 1;
                    overflow-y: auto;
                    border: 1px solid #3e4451;
                    padding: 5px;
                    border-radius: 6px;
                    background: #21252b;
                }

                #emoji-gallery::-webkit-scrollbar {
                    width: 8px;
                }
                #emoji-gallery::-webkit-scrollbar-thumb {
                    background-color: #565d6c;
                    border-radius: 10px;
                }

                .emoji-item {
                    cursor: pointer;
                    font-size: 28px;
                    padding: 4px;
                    margin: 3px;
                    border-radius: 6px;
                    display: inline-block;
                    transition: background-color 0.1s, transform 0.1s;
                    line-height: 1;
                }

                .emoji-item:hover {
                    background-color: #3e4451;
                    transform: scale(1.1);
                }

                .emoji-item.selected {
                    border: 2px solid #98c379;
                    background-color: #546a48;
                    box-shadow: 0 0 5px #98c379;
                }

                /* --- TOGGLE BUTTON STYLES --- */
                #toggle-emoji-menu-btn {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 100000;
                    padding: 8px 15px;
                    cursor: pointer;
                    background: #56b6c2;
                    color: #1e2127;
                    font-weight: bold;
                    border: none;
                    border-radius: 6px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    transition: background-color 0.2s, transform 0.1s;
                }

                #toggle-emoji-menu-btn:hover {
                    background: #61afef;
                    transform: translateY(-2px);
                }

                /* Keyframes for selection message */
                @keyframes fadein {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `);

            if (config.DEBUG_MODE) {
                console.log(
                    '🇦🇺: ',
                    'Script startup time: ' +
                        (Date.now() - scriptStartTime) +
                        'ms'
                );
            }
        } catch (error) {
            if (config.DEBUG_MODE) {
                console.error(
                    '🇦🇺: ',
                    'Failed to initialize emoji animation script:',
                    error
                );
            }
        }
    };

    main();
})();