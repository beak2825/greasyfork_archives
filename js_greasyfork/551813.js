// ==UserScript==
// @name         T̸̞̈S̵͎͗A̴̪̋R̵̮͛ ̶̖͂P̵̭̕O̶̫͂K̸͉̈́Ē̸̮  ᶠᵒʳ ᶠᵃᶜᵉᵇᵒᵒᵏ 'ᵛ'
// @namespace    http://tampermonkey.net/
// @version      1.8.0
// @description  Billions must POKE!!!
// @author       Gemini
// @match        https://www.facebook.com/pokes*
// @icon         https://i.postimg.cc/RJQ37W8P/BAAAAAAAA.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551813/T%CC%B8%CC%88%CC%9ES%CC%B5%CD%97%CD%8EA%CC%B4%CC%8B%CC%AAR%CC%B5%CD%9B%CC%AE%20%CC%B6%CD%82%CC%96P%CC%B5%CC%95%CC%ADO%CC%B6%CD%82%CC%ABK%CC%B8%CD%84%CD%89E%CC%B8%CC%84%CC%AE%20%20%E1%B6%A0%E1%B5%92%CA%B3%20%E1%B6%A0%E1%B5%83%E1%B6%9C%E1%B5%89%E1%B5%87%E1%B5%92%E1%B5%92%E1%B5%8F%20%27%E1%B5%9B%27.user.js
// @updateURL https://update.greasyfork.org/scripts/551813/T%CC%B8%CC%88%CC%9ES%CC%B5%CD%97%CD%8EA%CC%B4%CC%8B%CC%AAR%CC%B5%CD%9B%CC%AE%20%CC%B6%CD%82%CC%96P%CC%B5%CC%95%CC%ADO%CC%B6%CD%82%CC%ABK%CC%B8%CD%84%CD%89E%CC%B8%CC%84%CC%AE%20%20%E1%B6%A0%E1%B5%92%CA%B3%20%E1%B6%A0%E1%B5%83%E1%B6%9C%E1%B5%89%E1%B5%87%E1%B5%92%E1%B5%92%E1%B5%8F%20%27%E1%B5%9B%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Cấu hình mặc định của script ---
    let pokeStyle = 'none';
    let currentOpacity = 1.0;
    const baseSpeed = 1000;
    let pokeSpeed = baseSpeed;
    let graphicOptionsEnabled = true;
    let isAnimating = false;
    let isEffectActive = false;
    const POKES_URL = 'https://www.facebook.com/pokes';
    let pokeIntervalId = null;

    let currentEffectElement = null;

    let pokeCount = 0;
    let pokeButtonsCache = [];
    let pokeBackButtonsCache = [];

    // TRỌNG SỐ: Ưu tiên 7, 12, 3, 1, 40 (từ v164.63)
    const specialPokeIndexes = [7, 7, 7, 7, 12, 12, 12, 12, 3, 3, 3, 1, 1, 40];
    let targetSpecialPokeIndex = null;

    // --- Mật mã cho Tsar Poke ---
    const TSARPOKE_PASSWORD = '2041889';
    let currentPasswordInput = '';
    const passwordPlaceholder = '_______';

    const speedMap = [
        { mult: 0.25, ms: 4000, label: '0.25x' },
        { mult: 0.5, ms: 2000, label: '0.5x' },
        { mult: 0.75, ms: 1333, label: '0.75x' },
        { mult: 1, ms: 1000, label: '1x (Default)' }, // Index 3
        { mult: 1.25, ms: 800, label: '1.25x' },
        { mult: 1.75, ms: 571, label: '1.75x' },
        { mult: 2, ms: 500, label: '2x' },
        { mult: 3, ms: 333, label: '3x' } // Index 7
    ];
    const noobVisualEffectUrl = 'https://media.tenor.com/YK8B8C2n3GUAAAAj/smiling-face-with-horns-poop-pile-of-poo.gif';
    const proPokeFullScreenGifUrl = 'https://media.tenor.com/94fAucnFhToAAAAj/quickscope.gif';
    const proPokeButtonImageUrl = 'https://media.tenor.com/hvBy8lfQWsAAAAAi/hitmarker.gif';
    const hackerFullScreenGifUrl = 'https://media1.tenor.com/m/CgGUXc-LDc4AAAAC/hacker-pc.gif';
    const godPokeFullScreenGifUrl = 'https://media.tenor.com/1M-Okhe0FvcAAAAj/shockwave.gif';
    const specialGodPokeFullScreenGifUrl = 'https://media1.tenor.com/m/YO5-C7asKaoAAAAC/christian.gif';
    const madGodPokeFullScreenGifUrl = 'https://media.tenor.com/9sSTiaKKvIAAAAAi/mad.gif';
    const tsarPokeFullScreenGifUrl = 'https://media.tenor.com/6PQyu6KqLhQAAAAi/clash-royale-rocket.gif';

    // --- TSAR POKE SUB-SEQUENCE GIFS (v164.67) ---
    const tsarGif1Url = 'https://media1.tenor.com/m/6jPY8cf6JgwAAAAC/explosive-diarrhea.gif';
    const tsarGif2Url = 'https://media.tenor.com/9vAe2mjDY-oAAAAj/gun-gunpoint.gif';
    const tsarGif3Url = 'https://media.tenor.com/dr6HHZLcydcAAAAi/police-car-car-crash.gif';
    const tsarGif4Url = 'https://media.tenor.com/klrLI7N_DAYAAAAi/explosion-explode.gif';
    const tsarGif5Url = 'https://media.tenor.com/tu-a5t6eyxcAAAAi/explosion-explode.gif';
    const tsarGif6Url = 'https://media.tenor.com/I4TflxssYuYAAAAj/explosive-diarrhea-plane.gif';
    const tsarGif7Url = 'https://media1.tenor.com/m/V6Gf3fcGS_UAAAAC/fireman-on-fire.gif';
    const tsarGif8Url = 'https://media.tenor.com/ZIJRdKKfvfQAAAAj/baby-coughing-baby.gif';


    const fullScreenAnimationDuration = 1500; // Thời gian hiển thị GIF: 1.5 giây
    const pokeDelay = 1000; // Thời gian chờ để poke: 1 giây
    const buttonImageDuration = 100;

    // --- CÁC HẰNG SỐ MỚI ---
    const specialProGif1Url = 'https://media.tenor.com/He7zmjwx0oQAAAAj/oh.gif';
    const specialProGif2Url = 'https://media.tenor.com/_rTkeQh5YmUAAAAi/explosion-explode.gif';
    const specialProGif3Url = 'https://media.tenor.com/qkBhP0wm4OIAAAAi/hitmarker-spam.gif';
    const specialProGif4Url = 'https://media.tenor.com/OVclQYgKnOgAAAAi/mlg-rekt.gif';
    let isSpecialProEffectActive = false;
    const specialProPokeSpeed = 50;
    const PRO_3X_SPEED_INDEX = 7; // Index của 3x speed
    const DEFAULT_SPEED_INDEX = 3; // Index của 1x speed
    const TSAR_POKE_DURATION = 8000; // Thời gian cho Tsar Poke GIF chính (8 giây)
    const GIF_8_DURATION = 4300; // Thời gian phát GIF 8 (4.3 giây)
    const FADE_OUT_DURATION = 750; // Thời gian hiệu ứng mờ dần (0.75 giây)

    // --- HÀM TSAR POKE SUB-SEQUENCE (UPDATED) ---
    function startTsarSubSequence(container) {
        if (!graphicOptionsEnabled) return;

        const gifElements = new Map();
        const gifUrls = { 1: tsarGif1Url, 2: tsarGif2Url, 3: tsarGif3Url, 4: tsarGif4Url, 5: tsarGif5Url, 6: tsarGif6Url, 7: tsarGif7Url, 8: tsarGif8Url };

        function createGif(id, url, zIndex = 1) {
            const gif = document.createElement('img');
            gif.src = url + '?t=' + Date.now();
            gif.id = `tsar-sub-gif-${id}`;
            gif.style.cssText = `position: absolute; width: 100%; height: 100%; object-fit: fill; z-index: ${zIndex}; opacity: 0; filter: opacity(var(--current-opacity, 1.0)); transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out;`;
            container.appendChild(gif);
            gifElements.set(id, gif);
            return gif;
        }

        function showGif(id) {
            const gif = gifElements.get(id);
            if (gif) {
                void gif.offsetWidth;
                gif.style.opacity = '1';
                gif.style.filter = `opacity(${currentOpacity})`;
            }
        }

        function hideGif(id, duration = 500) {
            const gif = gifElements.get(id);
            if (gif) {
                gif.style.opacity = '0';
                setTimeout(() => gif.remove(), duration);
            }
        }

        for (let i = 1; i <= 8; i++) createGif(i, gifUrls[i], i);

        setTimeout(() => showGif(1), 1000);
        setTimeout(() => { showGif(2); showGif(3); }, 2000);
        setTimeout(() => { showGif(4); showGif(5); }, 3000);
        setTimeout(() => showGif(6), 4000);
        setTimeout(() => {
            for (let i = 1; i <= 6; i++) hideGif(i, 500);
            showGif(7);
        }, 4750);
        setTimeout(() => {
            hideGif(7, 500);
            const gif8 = gifElements.get(8);
            if (gif8) {
                gif8.style.transition = `opacity ${FADE_OUT_DURATION}ms ease-in-out, filter ${FADE_OUT_DURATION}ms ease-in-out`;
                showGif(8);
                setTimeout(() => {
                    gif8.style.opacity = '0';
                    gif8.style.filter = 'opacity(0)';
                    setTimeout(() => {
                        container.remove();
                        isAnimating = false;
                        const tsarLunchButton = document.getElementById('tsarLunchButton');
                        if(tsarLunchButton) {
                           tsarLunchButton.style.opacity = '1.0';
                           tsarLunchButton.style.cursor = 'pointer';
                        }
                    }, FADE_OUT_DURATION);
                }, GIF_8_DURATION);
            }
        }, 6750);
    }

    // --- CÁC HÀM HỖ TRỢ HIỂN THỊ TSAR ---
    function updatePasswordDisplay() {
        let maskedDisplay = currentPasswordInput.padEnd(TSARPOKE_PASSWORD.length, '_');
        const displayElem = document.getElementById('passwordDisplay');
        if(displayElem) displayElem.textContent = maskedDisplay;
    }

    function showTsarPokeButton() {
        const tsarPokeButton = document.getElementById('tsarPokeButton');
        const tsarLunchContainer = document.getElementById('tsarLunchContainer');
        const tsarCodeContainer = document.getElementById('tsarCodeContainer');
        if(tsarPokeButton) tsarPokeButton.classList.remove('hidden');
        if(tsarLunchContainer) tsarLunchContainer.classList.add('hidden');
        if(tsarCodeContainer) tsarCodeContainer.classList.add('hidden');
        currentPasswordInput = '';
        const hiddenPasswordInput = document.getElementById('hiddenPasswordInput');
        if (hiddenPasswordInput) hiddenPasswordInput.value = '';
        updatePasswordDisplay();
    }

    function showLunchContainer() {
        const tsarPokeButton = document.getElementById('tsarPokeButton');
        const tsarLunchContainer = document.getElementById('tsarLunchContainer');
        const tsarCodeContainer = document.getElementById('tsarCodeContainer');
        const hiddenPasswordInput = document.getElementById('hiddenPasswordInput');
        const tsarLunchButton = document.getElementById('tsarLunchButton');
        const codeTextSpan = document.getElementById('codeTextSpan');
        const passwordDisplayContainer = document.getElementById('passwordDisplayContainer');

        if(tsarLunchButton) tsarLunchButton.textContent = 'lunch';
        if(codeTextSpan) codeTextSpan.style.opacity = '0.5';
        if(passwordDisplayContainer) passwordDisplayContainer.classList.remove('hidden');
        if(tsarPokeButton) tsarPokeButton.classList.add('hidden');
        if(tsarLunchContainer) tsarLunchContainer.classList.remove('hidden');
        if(tsarCodeContainer) tsarCodeContainer.classList.add('hidden');
        if (hiddenPasswordInput) hiddenPasswordInput.focus();
    }

    function showLaunchCodeContainer() {
        const tsarPokeButton = document.getElementById('tsarPokeButton');
        const tsarLunchContainer = document.getElementById('tsarLunchContainer');
        const tsarCodeContainer = document.getElementById('tsarCodeContainer');
        const tsarCodePasswordDisplay = document.querySelector('#tsarCodeContainer .password-info');
        if(tsarPokeButton) tsarPokeButton.classList.add('hidden');
        if(tsarLunchContainer) tsarLunchContainer.classList.add('hidden');
        if(tsarCodeContainer) tsarCodeContainer.classList.remove('hidden');
        if (tsarCodePasswordDisplay) tsarCodePasswordDisplay.textContent = TSARPOKE_PASSWORD;
    }

    // =================================================================
    // ===== HÀM ĐÃ ĐƯỢC SỬA LỖI - BẮT ĐẦU TỪ ĐÂY =====
    // =================================================================
    function createVisualEffect(target, imageUrl, duration = 300) {
        if (!graphicOptionsEnabled) return;

        // Nếu target là element, lấy rect. Nếu không, coi nó đã là rect.
        const rect = target.getBoundingClientRect ? target.getBoundingClientRect() : target;

        const effectElement = document.createElement('img');
        effectElement.src = imageUrl;
        let finalWidth = rect.width, finalHeight = rect.height, finalLeft = rect.left + window.scrollX, finalTop = rect.top + window.scrollY;

        if (imageUrl === proPokeButtonImageUrl) {
            finalHeight = rect.height * 1.2;
            finalWidth = rect.height * 1.2;
            finalLeft = rect.left + window.scrollX + (rect.width / 2) - (finalWidth / 2);
            finalTop = rect.top + window.scrollY + (rect.height / 2) - (finalHeight / 2);
            effectElement.style.objectFit = 'contain';
        }
        if (imageUrl === noobVisualEffectUrl) {
            effectElement.style.objectFit = 'fill';
        }
        effectElement.style.cssText += `position: absolute; left: ${finalLeft}px; top: ${finalTop}px; width: ${finalWidth}px; height: ${finalHeight}px; z-index: 9999; pointer-events: none; opacity: ${currentOpacity};`;
        document.body.appendChild(effectElement);
        setTimeout(() => effectElement.remove(), duration);
    }
    // ===============================================================
    // ===== KẾT THÚC HÀM SỬA LỖI ===================================
    // ===============================================================

    function createTemporaryFullScreenEffect(imageUrl, duration) {
        if (!graphicOptionsEnabled) return;
        const effectElement = document.createElement('div');
        effectElement.classList.add('full-screen-gif-overlay');
        effectElement.style.setProperty('--current-opacity', currentOpacity);
        const gifImg = document.createElement('img');
        gifImg.src = imageUrl;
        gifImg.style.cssText = `width: 100%; height: 100%; object-fit: fill; opacity: var(--current-opacity, 1.0);`;
        effectElement.appendChild(gifImg);
        document.body.appendChild(effectElement);
        setTimeout(() => effectElement.remove(), duration);
    }

    function createHackerOverlay() {
        if (!graphicOptionsEnabled) return;
        const overlay = document.createElement('div');
        overlay.classList.add('full-screen-gif-overlay');
        overlay.id = 'hackerOverlay';
        overlay.style.setProperty('--current-opacity', currentOpacity);
        const gifImg = document.createElement('img');
        gifImg.src = hackerFullScreenGifUrl;
        gifImg.style.cssText = `width: 100%; height: 100%; object-fit: fill; opacity: var(--current-opacity, 1.0);`;
        overlay.appendChild(gifImg);
        document.body.appendChild(overlay);
        currentEffectElement = overlay;
    }

    function createSpecialProPokeEffect() {
        if (!graphicOptionsEnabled || isAnimating || isSpecialProEffectActive) return;
        isAnimating = true;
        isSpecialProEffectActive = true;
        removeCurrentEffect();
        const uiPanel = document.getElementById('tsarPokeUI');
        if (uiPanel) uiPanel.style.pointerEvents = 'none';
        if (pokeIntervalId) { clearInterval(pokeIntervalId); pokeIntervalId = null; }

        const container = document.createElement('div');
        container.classList.add('full-screen-gif-overlay');
        container.style.setProperty('--current-opacity', currentOpacity);
        container.style.zIndex = '9999';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
        currentEffectElement = container;

        const gif1 = document.createElement('img');
        gif1.src = specialProGif1Url + '?t=' + Date.now();
        gif1.style.cssText = `position: absolute; width: 100%; height: 100%; object-fit: fill; opacity: 1; transition: opacity 0.5s; z-index: 10;`;
        container.appendChild(gif1);
        setTimeout(() => { gif1.style.opacity = '0'; setTimeout(() => gif1.remove(), 500); }, 2000);

        setTimeout(() => {
            const gif2 = document.createElement('img');
            gif2.src = specialProGif2Url + '?t=' + Date.now();
            gif2.style.cssText = `position: absolute; width: 100%; height: 100%; object-fit: fill; opacity: 1; transition: opacity 0.5s; z-index: 11;`;
            container.appendChild(gif2);
            setTimeout(() => { gif2.style.opacity = '0'; setTimeout(() => gif2.remove(), 500); }, 3500);
        }, 1500);

        setTimeout(() => {
            isAnimating = false;
            ['gif3', 'gif4', 'proGif'].forEach((type, i) => {
                const gif = document.createElement('img');
                if (type === 'gif3') gif.src = specialProGif3Url + '?t=' + Date.now();
                if (type === 'gif4') gif.src = specialProGif4Url + '?t=' + Date.now();
                if (type === 'proGif') gif.src = proPokeFullScreenGifUrl + '?t=' + Date.now();
                gif.style.cssText = `position: absolute; width: 100%; height: 100%; object-fit: fill; z-index: ${i + 1};`;
                container.appendChild(gif);
            });
            pokeIntervalId = setInterval(randomPokeFromCache, specialProPokeSpeed);
            if (uiPanel) uiPanel.style.pointerEvents = 'auto';
        }, 2500);
    }

    function createGodPokeFullScreenEffect() {
        pokeBackButtonsOnce();
        if (isAnimating) return;
        if (graphicOptionsEnabled) {
            isAnimating = true;
            const godPokeButton = document.getElementById('godPokeButton');
            godPokeButton.style.opacity = '0.5';
            godPokeButton.style.cursor = 'not-allowed';
            const godPokeImg = new Image();
            godPokeImg.src = godPokeFullScreenGifUrl + '?timestamp=' + Date.now();
            godPokeImg.onload = () => {
                const effectElement = document.createElement('div');
                effectElement.classList.add('full-screen-gif-overlay');
                effectElement.style.setProperty('--current-opacity', currentOpacity);
                const gifImgElement = document.createElement('img');
                gifImgElement.src = godPokeImg.src;
                gifImgElement.style.cssText = `width: 100%; height: 100%; object-fit: fill;`;
                effectElement.appendChild(gifImgElement);
                document.body.appendChild(effectElement);
                setTimeout(() => {
                    effectElement.remove();
                    isAnimating = false;
                    godPokeButton.style.opacity = '1.0';
                    godPokeButton.style.cursor = 'pointer';
                }, 3000);
            };
        }
    }

    function createSpecialGodPokeEffect() {
        if (isAnimating || isEffectActive) return;
        const gifImage = new Image();
        gifImage.src = specialGodPokeFullScreenGifUrl + '?timestamp=' + Date.now();
        gifImage.onload = () => {
            localStorage.setItem('endlessEffectActive', 'initial_pending');
            pokeBackButtonsOnce();
            isAnimating = true; isEffectActive = true;
            const godPokeButton = document.getElementById('godPokeButton');
            const uiPanel = document.getElementById('tsarPokeUI');
            if(godPokeButton) { godPokeButton.style.opacity = '0.5'; godPokeButton.style.cursor = 'not-allowed'; }
            if (uiPanel) { uiPanel.style.display = 'none'; uiPanel.style.pointerEvents = 'none'; }

            const effectElement = document.createElement('div');
            effectElement.classList.add('full-screen-gif-overlay');
            effectElement.style.cssText += `background-color: black; pointer-events: auto; z-index: 100000;`;
            const gifImgElement = document.createElement('img');
            gifImgElement.src = gifImage.src;
            gifImgElement.style.cssText = `width: 100%; height: 100%; object-fit: contain; opacity: 1.0; transition: filter 1s ease-in-out; pointer-events: none;`;
            effectElement.appendChild(gifImgElement);
            document.body.appendChild(effectElement);

            const viewportAspectRatio = window.innerWidth / window.innerHeight;
            const imageAspectRatio = gifImage.naturalWidth / gifImage.naturalHeight;
            let renderedWidth, renderedHeight, topOffset, leftOffset;
            if (viewportAspectRatio > imageAspectRatio) {
                renderedHeight = window.innerHeight; renderedWidth = renderedHeight * imageAspectRatio; topOffset = 0; leftOffset = (window.innerWidth - renderedWidth) / 2;
            } else {
                renderedWidth = window.innerWidth; renderedHeight = renderedWidth / imageAspectRatio; topOffset = (window.innerHeight - renderedHeight) / 2; leftOffset = 0;
            }

            const yesButtonOverlay = document.createElement('div');
            yesButtonOverlay.style.cssText = `position: absolute; top: ${topOffset + renderedHeight * 0.78507}px; left: ${leftOffset + renderedWidth * 0.14713}px; width: ${renderedWidth * 0.16676}px; height: ${renderedHeight * 0.06705}px; cursor: pointer; z-index: 100001;`;
            const noButtonOverlay = document.createElement('div');
            noButtonOverlay.style.cssText = `position: absolute; top: ${topOffset + renderedHeight * 0.78507}px; left: ${leftOffset + renderedWidth * 0.72880}px; width: ${renderedWidth * 0.12640}px; height: ${renderedHeight * 0.06705}px; cursor: pointer; z-index: 100001;`;
            effectElement.appendChild(yesButtonOverlay);
            effectElement.appendChild(noButtonOverlay);

            yesButtonOverlay.addEventListener('click', () => {
                effectElement.remove(); isAnimating = false; isEffectActive = false; localStorage.removeItem('endlessEffectActive');
                if(godPokeButton) { godPokeButton.style.opacity = '1.0'; godPokeButton.style.cursor = 'pointer'; }
                if (uiPanel) { uiPanel.style.display = 'block'; uiPanel.style.pointerEvents = 'auto'; }
            });
            noButtonOverlay.addEventListener('click', () => {
                localStorage.setItem('endlessEffectActive', 'pending');
                document.body.style.overflow = 'hidden';
                effectElement.remove();
                const mainEffectContainer = document.createElement('div');
                mainEffectContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 100000; pointer-events: auto; background-color: black;`;
                const specialGifImg = document.createElement('img');
                specialGifImg.src = specialGodPokeFullScreenGifUrl + '?timestamp=' + Date.now();
                specialGifImg.style.cssText = `width: 100%; height: 100%; object-fit: contain; opacity: 1.0; transition: filter 1s ease-in-out; pointer-events: none;`;
                mainEffectContainer.appendChild(specialGifImg);
                document.body.appendChild(mainEffectContainer);
                setTimeout(() => {
                    specialGifImg.style.filter = 'grayscale(100%)';
                    setTimeout(() => {
                        const madGifImgElement = document.createElement('img');
                        madGifImgElement.src = madGodPokeFullScreenGifUrl + '?timestamp=' + Date.now();
                        madGifImgElement.style.cssText = `position: absolute; top: 0%; left: 25%; width: 50%; height: 145%; object-fit: contain; opacity: 0; transition: opacity 1s ease-in-out; pointer-events: none;`;
                        mainEffectContainer.appendChild(madGifImgElement);
                        setTimeout(() => { madGifImgElement.style.opacity = '1'; }, 50);
                        const exitButton = document.createElement('div');
                        exitButton.style.cssText = `position: absolute; top: 15%; left: 50%; width: 1%; height: 2%; cursor: pointer; z-index: 100002; opacity: 0;`;
                        mainEffectContainer.appendChild(exitButton);
                        exitButton.addEventListener('click', () => {
                            setTimeout(() => {
                                madGifImgElement.style.opacity = '0';
                                setTimeout(() => {
                                    specialGifImg.style.filter = 'grayscale(0%)';
                                    setTimeout(() => {
                                        mainEffectContainer.remove();
                                        document.body.style.overflow = '';
                                        localStorage.removeItem('endlessEffectActive');
                                        isAnimating = false; isEffectActive = false;
                                        if (uiPanel) { uiPanel.style.display = 'block'; uiPanel.style.pointerEvents = 'auto'; }
                                    }, 3000);
                                }, 500);
                            }, 3000);
                        });
                    }, 1000);
                }, 1000);
            });
        };
    }

    function startEndlessEffect() {
        if (isEffectActive) return;
        isEffectActive = true;
        document.body.style.overflow = 'hidden';
        const uiPanel = document.getElementById('tsarPokeUI');
        if (uiPanel) { uiPanel.style.display = 'none'; uiPanel.style.pointerEvents = 'none'; }
        const mainEffectContainer = document.createElement('div');
        mainEffectContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 100000; pointer-events: auto; background-color: black;`;
        document.body.appendChild(mainEffectContainer);
        const specialGifImg = document.createElement('img');
        specialGifImg.src = specialGodPokeFullScreenGifUrl + '?timestamp=' + Date.now();
        specialGifImg.style.cssText = `width: 100%; height: 100%; object-fit: contain; filter: grayscale(100%); transition: filter 1s ease-in-out; pointer-events: none;`;
        mainEffectContainer.appendChild(specialGifImg);
        const madGifImg = document.createElement('img');
        madGifImg.src = madGodPokeFullScreenGifUrl + '?timestamp=' + Date.now();
        madGifImg.style.cssText = `position: absolute; top: 0; left: 25%; width: 50%; height: 145%; object-fit: contain; opacity: 1; transition: opacity 1s ease-in-out; pointer-events: none;`;
        mainEffectContainer.appendChild(madGifImg);
        const exitButton = document.createElement('div');
        exitButton.style.cssText = `position: absolute; top: 15%; left: 50%; width: 1%; height: 2%; cursor: pointer; z-index: 100002; opacity: 0;`;
        mainEffectContainer.appendChild(exitButton);
        exitButton.addEventListener('click', () => {
            setTimeout(() => {
                madGifImg.style.opacity = '0';
                setTimeout(() => {
                    specialGifImg.style.filter = 'grayscale(0%)';
                    setTimeout(() => {
                        mainEffectContainer.remove();
                        document.body.style.overflow = '';
                        localStorage.removeItem('endlessEffectActive');
                        isAnimating = false; isEffectActive = false;
                        if (uiPanel) { uiPanel.style.display = 'block'; uiPanel.style.pointerEvents = 'auto'; }
                    }, 3000);
                }, 500);
            }, 3000);
        });
    }

    function startInitialEffect() { createSpecialGodPokeEffect(); }

    function createTsarPokeFullScreenEffect() {
        if (!graphicOptionsEnabled || isAnimating) return;
        isAnimating = true;
        const tsarLunchButton = document.getElementById('tsarLunchButton');
        tsarLunchButton.style.opacity = '0.5';
        tsarLunchButton.style.cursor = 'not-allowed';
        const tsarPokeImg = new Image();
        tsarPokeImg.src = tsarPokeFullScreenGifUrl + '?timestamp=' + Date.now();
        tsarPokeImg.onload = () => {
            const effectElement = document.createElement('div');
            effectElement.classList.add('full-screen-gif-overlay');
            effectElement.style.setProperty('--current-opacity', currentOpacity);
            effectElement.style.zIndex = '9999';
            const mainGifElement = document.createElement('img');
            mainGifElement.src = tsarPokeImg.src;
            mainGifElement.style.cssText = `width: 100%; height: 100%; object-fit: fill; position: absolute; filter: opacity(var(--current-opacity, 1.0));`;
            effectElement.appendChild(mainGifElement);
            document.body.appendChild(effectElement);
            setTimeout(() => {
                mainGifElement.remove();
                pokeAllButtonsOnce();
                startTsarSubSequence(effectElement);
            }, TSAR_POKE_DURATION);
        };
    }

    function removeCurrentEffect() {
        if (currentEffectElement) {
            currentEffectElement.remove();
            currentEffectElement = null;
        }
    }

    function pokeAllButtonsOnce() {
        findAndCacheButtons();
        [...pokeBackButtonsCache, ...pokeButtonsCache].forEach(btn => btn.click());
    }

    function pokeBackButtonsOnce() {
        findAndCacheButtons();
        pokeBackButtonsCache.forEach(btn => btn.click());
    }

    function findAndCacheButtons() {
        const pokeBackSelectors = [ 'div[aria-label="Poke Back"]', 'div[aria-label="Chọc lại"]', 'div[role="button"]:has(img[src*="pokes/poke_back.png"])' ];
        const pokeSelectors = [ 'div[aria-label="Poke"]', 'div[aria-label="Chọc"]', 'div[role="button"]:has(img[src*="pokes/poke.png"])' ];
        const findButtons = (selectors) => {
            for (const selector of selectors) {
                const buttons = document.querySelectorAll(selector);
                if (buttons.length > 0) return Array.from(buttons);
            }
            return [];
        };
        pokeBackButtonsCache = findButtons(pokeBackSelectors);
        pokeButtonsCache = findButtons(pokeSelectors);
    }

    function randomPokeFromCache() {
        findAndCacheButtons();
        const allButtons = [...pokeBackButtonsCache, ...pokeButtonsCache];
        if (allButtons.length === 0) return;
        const button = allButtons[Math.floor(Math.random() * allButtons.length)];
        const rect = button.getBoundingClientRect();
        button.click();
        if (graphicOptionsEnabled) createVisualEffect(rect, proPokeButtonImageUrl, buttonImageDuration);
    }

    // =================================================================
    // ===== HÀM ĐÃ ĐƯỢC SỬA LỖI - BẮT ĐẦU TỪ ĐÂY =====
    // =================================================================
    function pokeFromCache() {
        const uiPanel = document.getElementById('tsarPokeUI');
        if (!uiPanel || uiPanel.style.display === 'none' || isSpecialProEffectActive || isAnimating) return;

        switch (pokeStyle) {
            case 'noob':
                const noobButton = pokeBackButtonsCache.length > 0 ? pokeBackButtonsCache[0] : (pokeButtonsCache.length > 0 ? pokeButtonsCache[0] : null);
                if (noobButton) {
                    const rect = noobButton.getBoundingClientRect();
                    noobButton.click();
                    if (graphicOptionsEnabled) createVisualEffect(rect, noobVisualEffectUrl);
                }
                break;
            case 'pro':
                const currentSpeedIndex = parseInt(document.getElementById('speedSlider').value);
                if (graphicOptionsEnabled && currentSpeedIndex === PRO_3X_SPEED_INDEX) return;

                if (pokeBackButtonsCache.length > 0 || pokeButtonsCache.length > 0) {
                    isAnimating = true;
                    if (graphicOptionsEnabled) createTemporaryFullScreenEffect(proPokeFullScreenGifUrl, fullScreenAnimationDuration);

                    setTimeout(() => {
                        if (pokeBackButtonsCache.length > 0) {
                            const btn = pokeBackButtonsCache[0];
                            const rect = btn.getBoundingClientRect(); // Lấy tọa độ TRƯỚC khi click
                            btn.click();
                            if (graphicOptionsEnabled) createVisualEffect(rect, proPokeButtonImageUrl, buttonImageDuration);
                        }
                        if (pokeButtonsCache.length > 0) {
                            const btn = pokeButtonsCache[0];
                            const rect = btn.getBoundingClientRect(); // Lấy tọa độ TRƯỚC khi click
                            btn.click();
                            if (graphicOptionsEnabled) createVisualEffect(rect, proPokeButtonImageUrl, buttonImageDuration);
                        }
                    }, pokeDelay);

                    setTimeout(() => { isAnimating = false; }, fullScreenAnimationDuration);
                }
                break;
            case 'hacker':
                [...pokeBackButtonsCache, ...pokeButtonsCache].forEach(button => button.click());
                break;
        }
    }
    // ===============================================================
    // ===== KẾT THÚC HÀM SỬA LỖI ===================================
    // ===============================================================

    function resetSpecialPokeTarget() {
        targetSpecialPokeIndex = specialPokeIndexes[Math.floor(Math.random() * specialPokeIndexes.length)];
    }

    function initializeUI() {
        if (document.getElementById('tsarPokeUI')) return;
        const uiDiv = document.createElement('div');
        uiDiv.id = 'tsarPokeUI';
        const uiCss = `
            #tsarContextMenu { position: fixed; background-color: #fff; border: 1px solid #ccc; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); border-radius: 4px; z-index: 10001; min-width: 150px; } .context-menu-item { padding: 8px 12px; cursor: pointer; font-size: 14px; color: #1c1e21; } .context-menu-item:hover { background-color: #f0f2f5; } #tsarPokeUI { position: fixed; top: 20px; left: 20px; z-index: 10000; background-color: #f0f2f5; border: 1px solid #ddd; border-radius: 8px; padding: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 200px; } #tsarPokeUIHeader { cursor: move; text-align: center; } #tsarPokeUI h3 { margin: 0 0 10px 0; font-size: 16px; color: #1c1e21; } #tsarPokeUI h4 { margin: 10px 0 5px 0; font-size: 14px; color: #65676b; border-bottom: 1px solid #ccc; padding-bottom: 5px; } .option-section { margin-bottom: 10px; } .option-item { margin-bottom: 5px; } .option-item label { display: block; font-size: 12px; margin-bottom: 3px; } input[type="range"] { width: 100%; } #customSelect { position: relative; width: 100%; cursor: pointer; user-select: none; } #selectDisplay { padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; background-color: #fff; } #selectDisplay::after { content: '▼'; position: absolute; top: 50%; right: 10px; transform: translateY(-50%); font-size: 10px; } #selectDropdown { position: absolute; top: 100%; left: 0; width: 100%; background-color: #fff; border: 1px solid #ccc; border-top: none; border-radius: 0 0 6px 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 10; } #selectDropdown > div { padding: 8px; font-size: 14px; } #selectDropdown > div:hover { background-color: #f0f2f5; } .hidden { display: none !important; } #speedDisplay { position: fixed; z-index: 10001; padding: 5px 8px; background-color: #333; color: white; border-radius: 4px; font-size: 12px; transform: translate(-50%, -120%); pointer-events: none; transition: opacity 0.1s; } .hidden-display { opacity: 0; } .switch { position: relative; display: inline-block; width: 34px; height: 20px; } .switch input { opacity: 0; width: 0; height: 0; } .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; } .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; } input:checked + .slider { background-color: #2196F3; } input:checked + .slider:before { transform: translateX(14px); } .full-screen-gif-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.3); z-index: 9998; display: flex; justify-content: center; align-items: center; pointer-events: none; overflow: hidden; } .tsar-button { background-color: #E74C3C; color: white; border: none; padding: 10px; margin-top: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; text-align: center; width: 100%; box-sizing: border-box; transition: transform 0.1s ease-in-out; } .tsar-button:active { transform: scale(0.95); } .god-button { background-color: white; color: gold; border: 2px solid gold; padding: 10px; margin-top: 10px; border-radius: 6px; cursor: pointer; text-align: center; width: 100%; box-sizing: border-box; box-shadow: 0 0 5px gold, 0 0 15px gold, 0 0 25px gold; transition: transform 0.1s ease-in-out, box-shadow 0.3s ease-in-out; } .god-button:active { transform: scale(0.95); } .god-button .click-here-text { font-size: 1.25em; display: block; } #tsarButtonContainer.tsar-container { display: flex; flex-direction: column; background-color: #E74C3C; color: white; border: none; padding: 0; margin-top: 10px; border-radius: 6px; font-weight: bold; text-align: center; width: 100%; box-sizing: border-box; position: relative; } #tsarLunchContainer, #tsarCodeContainer { position: relative; width: 100%; height: auto; min-height: 67px; padding: 10px; border-radius: 6px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; } #tsarLunchContainer { background-color: #E74C3C; } #tsarCodeContainer { background-color: #6aa84f; color: white; } .lunch-button { background-color: transparent; border: none; color: white; font-weight: bold; cursor: pointer; text-align: center; width: 100%; flex-grow: 1; font-size: 2em; display: flex; align-items: center; justify-content: center; padding: 0; } #passwordDisplayContainer { display: flex; align-items: center; justify-content: center; width: 100%; gap: 5px; cursor: pointer; margin-top: -5px; } #passwordDisplay { font-family: 'Courier New', Courier, monospace; font-size: 1em; letter-spacing: 2px; } #tsarCodeContainer .code-text { font-size: 20px; display: flex; align-items: center; justify-content: center; width: 100%; height: 50%; padding-bottom: 5px; } #tsarCodeContainer .password-info { font-size: 1.2em; font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; width: 100%; height: 50%; display: flex; align-items: center; justify-content: center; } .tsar-back-button-overlay { position: absolute; top: 0; left: 0; width: 25px; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; } .tsar-back-button { font-size: 24px; font-weight: bold; color: white; opacity: 0; transition: opacity 0.3s; } .tsar-back-button-overlay:hover .tsar-back-button { opacity: 1; }
        `;
        const uiHtml = `
            <div id="tsarPokeUIHeader"><h3>Options</h3></div><div class="option-section"><h4>Poke Options</h4><div id="customSelect"><div id="selectDisplay" style="opacity: 0.5;">Choose ur ˡᶦᵗᵗᵉˡ Poke ᶜʰᵃᵐᵖ...</div><div id="selectDropdown" class="hidden"><div data-value="noob"> 𝙽𝚘𝚘𝚋 𝙿o𝚔e ◔_◔</div><div data-value="pro">▄︻デքʀօ քօӄɛ══━一</div><div data-value="hacker">ℍ𝕒𝕔𝕜𝕖𝕣 ℙ𝕠𝕜ę</div><div data-value="god">✞ 𝕲𝖔𝖉 𝕻𝖔𝖐𝖊 ✞</div><div data-value="tsar">T̵̨̧̡͚͚̠̫̖̖̫͍̦͖̣͚̭̦̜̖̳̟͖͖͎̙͈̪͚̤͔̽͌̈́̿̾̚ş̸̗̳̖̻̺̪̖͙̹̹̪̫̔̿̅͐̑̀͛͆́͗̌́̅̿̅̊̇̇͌̈́̚̕͠͝ͅa̴̡̧͕̳̹͕̹̦̙̰̻̱̗͕̦̤̳̗̣͖̻̽̀͋̇r̶̨̧̛͔̤̘͖̱̮̲̖̞̰͇̩̮̪͂̂͐̉̔͊̉͋̀́͛̎̏̍̀̿̔̎͘̕͠͝ͅ ̵̧̛̩͉͈̼̮̫̯̩̤̹̺̝̭̣̾͑͆̎̋̿̿͐̾̌̐̕P̷̧̧̨͙̫̥̥͇͎͎̻͕̦̦̩̩̣̥̬̣̲͕͔̭͖̞͙̬͋̋̈́͐̈́̍̀̽̄̄̽̑͗͑́͛͒̀̿̇͗͋̈́̈́̓̕͜͝͝o̴̡̠̙̖̟͖̥̜̪̝̒́̈́́͆̑͛̿̈́̀̽̅̀͘̕̕͜ķ̷̛̟̯̰̣̣̥͔̖̼̲͉͍̳̻̰̩̖̞̳̥͈͚͍̬̊̅̂́̒̎͑̍̀͐̌͋̌͊͗͑͌̏̏̃̓̃̿̾͆͘̚͜͠͝ę̵̤̝̟͖̥̜̪̝̂̆͜ͅ</div></div></div><div class="option-item" id="speedSliderContainer"><label for="speedSlider">Speed</label><input type="range" id="speedSlider" min="0" max="${speedMap.length - 1}" value="${DEFAULT_SPEED_INDEX}"></div><div id="tsarButtonContainer" class="tsar-container hidden"><button id="tsarPokeButton" class="tsar-button">The west has fallen<br>Billions must POKE!!!☢️</button><div id="tsarCodeContainer" class="hidden"><div id="codeBackButtonOverlay" class="tsar-back-button-overlay"><span class="tsar-back-button">&lt;</span></div><div class="code-text">CODE</div><div class="password-info"></div></div><div id="tsarLunchContainer" class="hidden"><div id="lunchBackButtonOverlay" class="tsar-back-button-overlay"><span class="tsar-back-button">&lt;</span></div><button id="tsarLunchButton" class="lunch-button">lunch</button><div id="passwordDisplayContainer"><span id="codeTextSpan" style="opacity: 0.5;">code:</span><span id="passwordDisplay"></span></div></div></div><button id="godPokeButton" class="god-button hidden">𝐀𝐜𝐜𝐞𝐩𝐭 𝐂𝐡𝐫𝐢𝐬𝐭 𝐚𝐧𝐝 a 𝐟𝐫𝐞𝐞 𝐏𝐎𝐊𝐄<br><span class="click-here-text">𝐂𝐥𝐢𝐜𝐤 𝐇𝐞𝐫𝐞!</span></button></div><div class="option-section graphic-section"><h4 style="display: flex; justify-content: space-between; align-items: center;">Graphic Options <label class="switch"><input type="checkbox" id="graphicToggle" checked><span class="slider round"></span></label></h4><div id="graphicOptionsContainer"><div class="option-item"><label for="opacitySlider">Opacity</label><input type="range" id="opacitySlider" min="0" max="1" step="0.1" value="${currentOpacity}"></div></div></div><div id="speedDisplay" class="hidden-display"></div><input type="text" id="hiddenPasswordInput" style="position: absolute; left: -9999px;">
        `;
        uiDiv.innerHTML = uiHtml;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = uiCss;
        document.head.appendChild(styleSheet);
        document.body.appendChild(uiDiv);
        const contextMenuHtml = `<div id="tsarContextMenu" class="hidden"><div class="context-menu-item" data-action="code">launch code</div><div class="context-menu-item" data-action="lunch">TSAR LUNCH</div></div>`;
        const contextMenuDiv = document.createElement('div');
        contextMenuDiv.innerHTML = contextMenuHtml.trim();
        document.body.appendChild(contextMenuDiv.firstChild);

        const dragHandle = document.getElementById('tsarPokeUIHeader');
        const selectDisplay = document.getElementById('selectDisplay');
        const selectDropdown = document.getElementById('selectDropdown');
        const graphicToggle = document.getElementById('graphicToggle');
        const graphicOptionsContainer = document.getElementById('graphicOptionsContainer');
        const opacitySlider = document.getElementById('opacitySlider');
        const speedSlider = document.getElementById('speedSlider');
        const speedSliderContainer = document.getElementById('speedSliderContainer');
        const tsarPokeButton = document.getElementById('tsarPokeButton');
        const tsarLunchButton = document.getElementById('tsarLunchButton');
        const tsarButtonContainer = document.getElementById('tsarButtonContainer');
        const godPokeButton = document.getElementById('godPokeButton');
        const passwordDisplay = document.getElementById('passwordDisplay');
        const hiddenPasswordInput = document.getElementById('hiddenPasswordInput');
        const speedDisplay = document.getElementById('speedDisplay');
        const passwordDisplayContainer = document.getElementById('passwordDisplayContainer');
        const tsarContextMenu = document.getElementById('tsarContextMenu');
        const lunchBackButtonOverlay = document.getElementById('lunchBackButtonOverlay');
        const codeBackButtonOverlay = document.getElementById('codeBackButtonOverlay');
        const codeTextSpan = document.getElementById('codeTextSpan');

        passwordDisplay.textContent = passwordPlaceholder;
        findAndCacheButtons();
        resetSpecialPokeTarget();

        selectDisplay.addEventListener('click', () => {
            selectDropdown.classList.toggle('hidden');
            selectDisplay.style.opacity = '0.5';
            selectDisplay.textContent = 'Choose ur ˡᶦᵗᵗᵉˡ Poke ᶜʰᵃᵐᵖ...';
            pokeStyle = 'none';
            removeCurrentEffect();
            currentOpacity = 1.0;
            opacitySlider.value = currentOpacity;
            speedSliderContainer.classList.add('hidden');
            tsarButtonContainer.classList.add('hidden');
            godPokeButton.classList.add('hidden');
            isSpecialProEffectActive = false;
            if (pokeIntervalId) { clearInterval(pokeIntervalId); pokeIntervalId = null; }
        });

        selectDropdown.querySelectorAll('div').forEach(item => {
            item.addEventListener('click', () => {
                const newPokeStyle = item.dataset.value;
                if (newPokeStyle !== pokeStyle) {
                    removeCurrentEffect();
                    pokeStyle = newPokeStyle;
                    currentPasswordInput = '';
                    passwordDisplay.textContent = passwordPlaceholder;
                    showTsarPokeButton();
                    isSpecialProEffectActive = false;
                    if (['noob', 'pro', 'hacker'].includes(pokeStyle)) {
                        speedSlider.value = DEFAULT_SPEED_INDEX;
                        pokeSpeed = speedMap[DEFAULT_SPEED_INDEX].ms;
                    }
                    currentOpacity = pokeStyle === 'hacker' ? 0.5 : 1.0;
                    opacitySlider.value = currentOpacity;
                    if (pokeStyle === 'hacker') createHackerOverlay();

                    tsarButtonContainer.classList.toggle('hidden', pokeStyle !== 'tsar');
                    godPokeButton.classList.toggle('hidden', pokeStyle !== 'god');
                    speedSliderContainer.classList.toggle('hidden', ['tsar', 'god', 'none'].includes(pokeStyle));

                    if (pokeIntervalId) { clearInterval(pokeIntervalId); pokeIntervalId = null; }

                    if (pokeStyle === 'pro' && graphicOptionsEnabled && parseInt(speedSlider.value) === PRO_3X_SPEED_INDEX) {
                        createSpecialProPokeEffect();
                    } else if (!['none', 'tsar', 'god'].includes(pokeStyle)) {
                        pokeIntervalId = setInterval(pokeFromCache, pokeSpeed);
                    }
                }
                selectDropdown.classList.add('hidden');
                selectDisplay.textContent = item.textContent;
                selectDisplay.style.opacity = '1.0';
            });
        });

        hiddenPasswordInput.addEventListener('input', (e) => {
            currentPasswordInput = e.target.value.slice(0, TSARPOKE_PASSWORD.length);
            e.target.value = currentPasswordInput;
            updatePasswordDisplay();
        });

        tsarPokeButton.addEventListener('click', showLunchContainer);
        tsarPokeButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            tsarContextMenu.style.left = `${e.clientX}px`;
            tsarContextMenu.style.top = `${e.clientY}px`;
            tsarContextMenu.classList.remove('hidden');
            e.stopPropagation();
        });
        document.addEventListener('click', (e) => {
            if (!tsarPokeButton.contains(e.target) && !tsarContextMenu.contains(e.target)) {
                tsarContextMenu.classList.add('hidden');
            }
        });
        tsarContextMenu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                if (action === 'lunch') showLunchContainer();
                else if (action === 'code') showLaunchCodeContainer();
                tsarContextMenu.classList.add('hidden');
                e.stopPropagation();
            });
        });
        lunchBackButtonOverlay.addEventListener('click', showTsarPokeButton);
        codeBackButtonOverlay.addEventListener('click', showTsarPokeButton);

        tsarLunchButton.addEventListener('click', () => {
            if (currentPasswordInput === TSARPOKE_PASSWORD) {
                if (graphicOptionsEnabled) {
                    if (isAnimating) return;
                    const originalLunchText = tsarLunchButton.textContent;
                    const originalPasswordDisplay = passwordDisplay.textContent;
                    tsarLunchButton.textContent = '😌';
                    codeTextSpan.style.opacity = '0';
                    passwordDisplayContainer.classList.add('hidden');
                    const totalAnimationDuration = TSAR_POKE_DURATION + 6750 + GIF_8_DURATION + FADE_OUT_DURATION;
                    setTimeout(() => {
                        tsarLunchButton.textContent = originalLunchText;
                        codeTextSpan.style.opacity = '0.5';
                        passwordDisplayContainer.classList.remove('hidden');
                        passwordDisplay.textContent = originalPasswordDisplay;
                        currentPasswordInput = '';
                        hiddenPasswordInput.value = '';
                        updatePasswordDisplay();
                    }, totalAnimationDuration);
                    createTsarPokeFullScreenEffect();
                } else {
                    pokeAllButtonsOnce();
                }
            } else {
                passwordDisplay.textContent = "WRONG!";
                setTimeout(() => {
                    currentPasswordInput = '';
                    hiddenPasswordInput.value = '';
                    updatePasswordDisplay();
                }, 1000);
            }
        });

        godPokeButton.addEventListener('click', () => {
            if (isAnimating) return;
            pokeCount++;
            if (pokeCount === targetSpecialPokeIndex) {
                createSpecialGodPokeEffect();
                pokeCount = 0;
                resetSpecialPokeTarget();
            } else {
                createGodPokeFullScreenEffect();
            }
            if (pokeCount >= 40) {
                pokeCount = 0;
                resetSpecialPokeTarget();
            }
        });

        graphicToggle.addEventListener('change', () => {
            graphicOptionsEnabled = graphicToggle.checked;
            graphicOptionsContainer.style.display = graphicOptionsEnabled ? 'block' : 'none';
            if (pokeIntervalId) { clearInterval(pokeIntervalId); pokeIntervalId = null; }
            if (!graphicOptionsEnabled && isSpecialProEffectActive) {
                isSpecialProEffectActive = false;
                removeCurrentEffect();
            }
            if (graphicOptionsEnabled) {
                const currentSpeedIndex = parseInt(speedSlider.value);
                if (pokeStyle === 'hacker') createHackerOverlay();
                else if (pokeStyle === 'pro' && currentSpeedIndex === PRO_3X_SPEED_INDEX) createSpecialProPokeEffect();
                else if (!['none', 'tsar', 'god'].includes(pokeStyle)) pokeIntervalId = setInterval(pokeFromCache, pokeSpeed);
            } else {
                if (pokeStyle === 'pro' && parseInt(speedSlider.value) === PRO_3X_SPEED_INDEX) {
                    pokeIntervalId = setInterval(pokeFromCache, pokeSpeed);
                }
            }
        });

        opacitySlider.addEventListener('input', () => {
            currentOpacity = parseFloat(opacitySlider.value);
            const fullScreenOverlay = document.querySelector('.full-screen-gif-overlay, #hackerOverlay');
            if (fullScreenOverlay) {
                fullScreenOverlay.style.setProperty('--current-opacity', currentOpacity);
            }
        });

        speedSlider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value);
            pokeSpeed = speedMap[value].ms;
            if (pokeIntervalId) { clearInterval(pokeIntervalId); pokeIntervalId = null; }
            if (isSpecialProEffectActive) {
                isSpecialProEffectActive = false;
                removeCurrentEffect();
            }
            if (pokeStyle === 'pro' && graphicOptionsEnabled && value === PRO_3X_SPEED_INDEX) {
                createSpecialProPokeEffect();
            } else if (!['none', 'tsar', 'god'].includes(pokeStyle)) {
                pokeIntervalId = setInterval(pokeFromCache, pokeSpeed);
            }
            updateSpeedDisplay(event.clientX, event.clientY, speedMap[value].label);
        });

        const updateSpeedDisplay = (x, y, text) => {
            speedDisplay.classList.remove('hidden-display');
            speedDisplay.style.left = `${x}px`;
            speedDisplay.style.top = `${y}px`;
            speedDisplay.textContent = text;
        };
        speedSlider.addEventListener('mousemove', (event) => updateSpeedDisplay(event.clientX, event.clientY, speedMap[parseInt(event.target.value)].label));
        speedSlider.addEventListener('mouseout', () => speedDisplay.classList.add('hidden-display'));

        passwordDisplayContainer.addEventListener('click', () => { if (pokeStyle === 'tsar' && !document.getElementById('tsarLunchContainer').classList.contains('hidden')) hiddenPasswordInput.focus(); });
        window.addEventListener('focus', () => { if (pokeStyle === 'tsar' && !document.getElementById('tsarLunchContainer').classList.contains('hidden')) hiddenPasswordInput.focus(); });

        let isDragging = false, offsetX, offsetY;
        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const uiRect = uiDiv.getBoundingClientRect();
            offsetX = e.clientX - uiRect.left;
            offsetY = e.clientY - uiRect.top;
            uiDiv.style.cursor = 'move';
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            uiDiv.style.left = `${e.clientX - offsetX}px`;
            uiDiv.style.top = `${e.clientY - offsetY}px`;
        });
        document.addEventListener('mouseup', () => { isDragging = false; uiDiv.style.cursor = 'default'; });
    }

    function manageUI() {
        const uiPanel = document.getElementById('tsarPokeUI');
        const isPokesPage = window.location.href.startsWith(POKES_URL);

        if (isPokesPage) {
            if (!uiPanel) initializeUI();
            else uiPanel.style.display = 'block';
            findAndCacheButtons();
            const endlessEffectActive = localStorage.getItem('endlessEffectActive');
            if (endlessEffectActive) {
                if (endlessEffectActive === 'pending' || endlessEffectActive === 'true') startEndlessEffect();
                else if (endlessEffectActive === 'initial_pending') startInitialEffect();
            }
            if (!['none', 'tsar', 'god'].includes(pokeStyle)) {
                const speedSlider = document.getElementById('speedSlider');
                const currentSpeedIndex = speedSlider ? parseInt(speedSlider.value) : DEFAULT_SPEED_INDEX;
                pokeSpeed = speedMap[currentSpeedIndex].ms;
                const isPro3xWithGraphics = (pokeStyle === 'pro' && currentSpeedIndex === PRO_3X_SPEED_INDEX && graphicOptionsEnabled);
                if (isPro3xWithGraphics) {
                    if (!isSpecialProEffectActive) createSpecialProPokeEffect();
                } else {
                    if (isSpecialProEffectActive) {
                        isSpecialProEffectActive = false;
                        removeCurrentEffect();
                        if (pokeIntervalId) { clearInterval(pokeIntervalId); }
                        pokeIntervalId = null;
                    }
                    if (pokeIntervalId === null) {
                        if (pokeStyle === 'hacker' && graphicOptionsEnabled) createHackerOverlay();
                        pokeIntervalId = setInterval(pokeFromCache, pokeSpeed);
                    }
                }
            } else if (pokeStyle === 'none') {
                const speedSliderContainer = document.getElementById('speedSliderContainer');
                if (speedSliderContainer) speedSliderContainer.classList.add('hidden');
            }
        } else {
            if (uiPanel) uiPanel.style.display = 'none';
            if (pokeIntervalId) { clearInterval(pokeIntervalId); pokeIntervalId = null; }
            isSpecialProEffectActive = false;
            removeCurrentEffect();
        }
    }

    const observer = new MutationObserver(manageUI);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('popstate', manageUI);
    document.addEventListener('DOMContentLoaded', manageUI);
})();