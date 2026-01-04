// ==UserScript==
// @name         Kick Player Volume Control for destiny.gg/bigscreen
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Add external volume controls for Kick embed (iframe workaround)
// @author       You
// @match        https://destiny.gg/bigscreen*
// @match        https://www.destiny.gg/bigscreen*
// @match        https://player.kick.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555967/Kick%20Player%20Volume%20Control%20for%20destinyggbigscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/555967/Kick%20Player%20Volume%20Control%20for%20destinyggbigscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // If we're inside the Kick player iframe
    if (window.location.hostname === 'player.kick.com') {
        console.log('Running inside Kick player iframe');

        // Wait for video element to exist
        const checkForVideo = setInterval(() => {
            const video = document.querySelector('video');
            if (video) {
                console.log('Found video element in iframe');
                clearInterval(checkForVideo);

                // Listen for volume control messages from parent
                window.addEventListener('message', (event) => {
                    if (event.data.type === 'SET_VOLUME') {
                        video.volume = event.data.volume;
                        console.log('Set video volume to:', event.data.volume);
                    } else if (event.data.type === 'GET_VOLUME') {
                        window.parent.postMessage({
                            type: 'VOLUME_RESPONSE',
                            volume: video.volume
                        }, '*');
                    }
                });

                // Send initial volume to parent
                setTimeout(() => {
                    window.parent.postMessage({
                        type: 'VOLUME_READY',
                        volume: video.volume
                    }, '*');
                }, 1000);

                // Monitor volume changes from within iframe
                video.addEventListener('volumechange', () => {
                    window.parent.postMessage({
                        type: 'VOLUME_CHANGED',
                        volume: video.volume
                    }, '*');
                });
            }
        }, 500);

        return; // Exit script for iframe context
    }

    // If we're on the destiny.gg page
    console.log('Running on destiny.gg page');

    // Add CSS for volume control
    GM_addStyle(`
        #kick-volume-control {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #53fc18;
            border-radius: 8px;
            padding: 15px 20px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 20px rgba(83, 252, 24, 0.3);
            font-family: Arial, sans-serif;
            min-width: 250px;
            cursor: move;
            user-select: none;
        }

        #kick-volume-control.dragging {
            opacity: 0.8;
        }

        #kick-volume-label {
            color: #53fc18;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        #kick-volume-slider {
            flex: 1;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: #333;
            border-radius: 3px;
            outline: none;
            cursor: pointer;
        }

        #kick-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background: #53fc18;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(83, 252, 24, 0.5);
        }

        #kick-volume-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #53fc18;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(83, 252, 24, 0.5);
        }

        #kick-volume-value {
            color: white;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            font-weight: bold;
            min-width: 45px;
            text-align: right;
        }

        #kick-mute-btn {
            background: #53fc18;
            border: none;
            color: #000;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            transition: all 0.2s;
            min-width: 40px;
        }

        #kick-mute-btn:hover {
            background: #6bff30;
            transform: scale(1.1);
        }

        #kick-mute-btn:active {
            transform: scale(0.95);
        }
    `);

    function init() {
        const kickIframe = document.querySelector('iframe[src*="kick.com"]');

        if (!kickIframe) {
            console.log('Kick iframe not found, retrying...');
            setTimeout(init, 1000);
            return;
        }

        console.log('Found Kick iframe, creating volume controls');

        // Create volume control UI
        const container = document.createElement('div');
        container.id = 'kick-volume-control';

        const label = document.createElement('span');
        label.id = 'kick-volume-label';
        label.textContent = 'Volume';

        const muteBtn = document.createElement('button');
        muteBtn.id = 'kick-mute-btn';
        muteBtn.textContent = '🔊';
        muteBtn.title = 'Mute/Unmute';

        const slider = document.createElement('input');
        slider.id = 'kick-volume-slider';
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = '100';

        const valueDisplay = document.createElement('span');
        valueDisplay.id = 'kick-volume-value';
        valueDisplay.textContent = '100%';

        container.appendChild(label);
        container.appendChild(muteBtn);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        document.body.appendChild(container);

        // Make the container draggable
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Load saved position from localStorage
        const savedPosition = localStorage.getItem('kick-volume-position');
        if (savedPosition) {
            const pos = JSON.parse(savedPosition);
            container.style.left = pos.x + 'px';
            container.style.top = pos.y + 'px';
            container.style.bottom = 'auto';
            xOffset = pos.x;
            yOffset = pos.y;
        }

        container.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            // Don't drag if clicking on slider or button
            if (e.target === slider || e.target === muteBtn) {
                return;
            }

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === container || e.target === label || e.target === valueDisplay) {
                isDragging = true;
                container.classList.add('dragging');
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                // Keep within viewport bounds
                const rect = container.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                xOffset = Math.max(0, Math.min(xOffset, maxX));
                yOffset = Math.max(0, Math.min(yOffset, maxY));

                container.style.left = xOffset + 'px';
                container.style.top = yOffset + 'px';
                container.style.bottom = 'auto';
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                container.classList.remove('dragging');

                // Save position to localStorage
                localStorage.setItem('kick-volume-position', JSON.stringify({
                    x: xOffset,
                    y: yOffset
                }));
            }
        }

        let lastVolume = 100;
        let isMuted = false;
        let isReady = false;

        // Listen for messages from iframe
        window.addEventListener('message', (event) => {
            if (event.data.type === 'VOLUME_READY' || event.data.type === 'VOLUME_RESPONSE') {
                isReady = true;
                const vol = Math.round(event.data.volume * 100);
                slider.value = vol;
                valueDisplay.textContent = vol + '%';
                console.log('Received initial volume:', vol);
            } else if (event.data.type === 'VOLUME_CHANGED') {
                const vol = Math.round(event.data.volume * 100);
                slider.value = vol;
                valueDisplay.textContent = vol + '%';
                muteBtn.textContent = vol === 0 ? '🔇' : '🔊';
            }
        });

        // Function to set volume
        function setVolume(volume) {
            kickIframe.contentWindow.postMessage({
                type: 'SET_VOLUME',
                volume: volume / 100
            }, '*');
        }

        // Slider handler
        slider.addEventListener('input', function() {
            const vol = parseInt(this.value);
            valueDisplay.textContent = vol + '%';
            setVolume(vol);

            if (vol > 0) {
                isMuted = false;
                muteBtn.textContent = '🔊';
                lastVolume = vol;
            } else {
                isMuted = true;
                muteBtn.textContent = '🔇';
            }
        });

        // Mute button handler
        muteBtn.addEventListener('click', function() {
            if (isMuted) {
                slider.value = lastVolume;
                valueDisplay.textContent = lastVolume + '%';
                setVolume(lastVolume);
                muteBtn.textContent = '🔊';
                isMuted = false;
            } else {
                lastVolume = parseInt(slider.value);
                slider.value = 0;
                valueDisplay.textContent = '0%';
                setVolume(0);
                muteBtn.textContent = '🔇';
                isMuted = true;
            }
        });

        // Request initial volume after iframe loads
        kickIframe.addEventListener('load', () => {
            setTimeout(() => {
                kickIframe.contentWindow.postMessage({
                    type: 'GET_VOLUME'
                }, '*');
            }, 2000);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();