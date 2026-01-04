// ==UserScript==
// @name         Twitch Video Audio Controls (iFrame Hover)
// @match        *://*.kick.com/*
// @grant        none
// @version      1.2
// @description  Adds hover-activated audio controls to video elements on Twitch, specifically within iFrames (e.g., embedded players).
// @namespace    https://greasyfork.org/users/1524434
// @downloadURL https://update.greasyfork.org/scripts/552039/Twitch%20Video%20Audio%20Controls%20%28iFrame%20Hover%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552039/Twitch%20Video%20Audio%20Controls%20%28iFrame%20Hover%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run script inside of an iFrame
    if (window.self === window.top) {
        return;
    }

    function addAudioControls(video) {
        if (video.dataset.audioControlAdded) return;
        video.dataset.audioControlAdded = true;

        const parent = video.parentElement;
        // The parent element must be a positioned element to contain the absolute controls
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        const controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.bottom = '10px';
        controls.style.left = '10px';
        controls.style.background = 'rgba(0,0,0,0.7)';
        controls.style.color = 'white';
        controls.style.padding = '5px';
        controls.style.borderRadius = '5px';
        controls.style.zIndex = '2147483647';
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '8px';
        controls.style.fontSize = '12px';
        controls.style.fontFamily = 'sans-serif';
        // --- New styles for hover effect ---
        controls.style.opacity = '0';
        controls.style.visibility = 'hidden';
        controls.style.transition = 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out';


        controls.onclick = (e) => e.stopPropagation();

        const playBtn = document.createElement('button');
        playBtn.textContent = video.paused ? '▶' : '❚❚';
        playBtn.style.border = 'none';
        playBtn.style.background = 'transparent';
        playBtn.style.color = 'white';
        playBtn.style.cursor = 'pointer';
        playBtn.style.fontSize = '14px';
        playBtn.onclick = () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        };
        controls.appendChild(playBtn);

        const muteBtn = document.createElement('button');
        muteBtn.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
        muteBtn.style.border = 'none';
        muteBtn.style.background = 'transparent';
        muteBtn.style.color = 'white';
        muteBtn.style.cursor = 'pointer';
        muteBtn.style.fontSize = '14px';
        muteBtn.onclick = () => {
            video.muted = !video.muted;
        };
        controls.appendChild(muteBtn);

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = 0;
        volumeSlider.max = 1;
        volumeSlider.step = 0.05;
        volumeSlider.value = video.muted ? 0 : video.volume;
        volumeSlider.style.cursor = 'pointer';
        volumeSlider.oninput = () => {
            video.volume = volumeSlider.value;
            video.muted = Number(video.volume) === 0;
        };
        controls.appendChild(volumeSlider);

        parent.appendChild(controls);

        // Update controls based on video state
        video.onplay = () => playBtn.textContent = '❚❚';
        video.onpause = () => playBtn.textContent = '▶';
        video.onvolumechange = () => {
            volumeSlider.value = video.muted ? 0 : video.volume;
            muteBtn.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
        };

        // --- New hover logic ---
        parent.addEventListener('mouseenter', () => {
            controls.style.opacity = '1';
            controls.style.visibility = 'visible';
        });

        parent.addEventListener('mouseleave', () => {
            controls.style.opacity = '0';
            controls.style.visibility = 'hidden';
        });
    }

    // Handles videos that load dynamically after the page is ready
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    if (node.tagName === 'VIDEO') {
                        addAudioControls(node);
                    } else if (node.querySelector) {
                        node.querySelectorAll('video').forEach(addAudioControls);
                    }
                }
            });
        });
    });

    // Add controls to any videos already on the page
    document.querySelectorAll('video').forEach(addAudioControls);

    // Start observing the document for new video elements
    observer.observe(document.body, { childList: true, subtree: true });
})();