// ==UserScript==
// @name         Screen Freeze
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Freeze everything on the page with a button or key press
// @author       KukuModZ
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554165/Screen%20Freeze.user.js
// @updateURL https://update.greasyfork.org/scripts/554165/Screen%20Freeze.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let frozen = false;
    const timers = [];

    // Function to stop all intervals and timeouts
    function freezeTimers() {
        let id = window.setTimeout(() => {}, 0);
        while (id--) {
            clearTimeout(id);
            clearInterval(id);
        }
    }

    // Pause all videos and audios
    function pauseMedia() {
        document.querySelectorAll('video, audio').forEach(media => media.pause());
    }

    // Freeze CSS animations and transitions
    function freezeAnimations() {
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
            el.style.transition = 'none';
        });
    }

    // Create a fullscreen overlay to prevent interactions
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);

    // Create control panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.padding = '10px';
    panel.style.backgroundColor = 'rgba(0,0,0,0.7)';
    panel.style.color = 'white';
    panel.style.zIndex = '1000000';
    panel.style.borderRadius = '5px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.cursor = 'pointer';
    panel.textContent = 'Freeze Page';
    document.body.appendChild(panel);

    function toggleFreeze() {
        frozen = !frozen;
        overlay.style.display = frozen ? 'block' : 'none';
        panel.textContent = frozen ? 'Unfreeze Page' : 'Freeze Page';

        if (frozen) {
            freezeTimers();
            pauseMedia();
            freezeAnimations();
            document.body.style.pointerEvents = 'none';
        } else {
            document.body.style.pointerEvents = 'auto';
            // Refresh page elements to resume animations if needed
            document.querySelectorAll('*').forEach(el => {
                el.style.animationPlayState = '';
                el.style.transition = '';
            });
            document.querySelectorAll('video, audio').forEach(media => media.play());
        }
    }

    panel.addEventListener('click', toggleFreeze);
    document.addEventListener('keydown', e => {
        if (e.key === 'f' || e.key === 'F') toggleFreeze();
    });

})();
