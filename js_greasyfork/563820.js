// ==UserScript==
// @name         Jewzoid Extensions
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Necro is greatest
// @author       Necro
// @match        *://sanegames.elouan.xyz/?game=stabfish2-io-multiplayer*
// @grant        none
// @run-at       document-start
// @license      not MIT
// @downloadURL https://update.greasyfork.org/scripts/563820/Jewzoid%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/563820/Jewzoid%20Extensions.meta.js
// ==/UserScript==

(function() {
    const runScript = () => {
        document.body.innerHTML = '';
        document.body.style.cssText = "margin:0;padding:0;height:100vh;background:#121212;overflow:hidden;display:flex;flex-direction:column;align-items:center;color:white;font-family:sans-serif;user-select:none;";

        const controls = document.createElement('div');
        controls.style.cssText = "height:40px; z-index:1000; font-weight:bold; display:flex; align-items:center;";
        controls.innerHTML = '<input type="range" id="hSlider" min="10" max="100" value="90" style="cursor:not-allowed;" disabled> <span id="hDisplay" style="margin-left:10px;">90%</span>';
        document.body.appendChild(controls);

        const configBtn = document.createElement('button');
        configBtn.innerText = 'Configure';
        configBtn.style.cssText = "position:fixed; bottom:10px; right:10px; z-index:1001; padding:8px 12px; background:#333; color:white; border:1px solid #555; cursor:pointer; border-radius:4px;";
        document.body.appendChild(configBtn);

        const iframe = document.createElement('iframe');
        iframe.id = "game-iframe";
        iframe.src = "https://stabfish2.io/?game=stabfish2-io-multiplayer#/?p=czg";
        iframe.style.cssText = "border:none; width:100vw; height:100vh; position:fixed; left:0; transition: top 0.15s ease-out, height 0.05s linear;";
        iframe.setAttribute('allow', "accelerometer; gyroscope; autoplay; payment; fullscreen; microphone; clipboard-read; clipboard-write 'self'");
        iframe.setAttribute('sandbox', "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-presentation allow-scripts allow-same-origin allow-downloads allow-popups-to-escape-sandbox");

        document.body.appendChild(iframe);

        const slider = document.getElementById('hSlider');
        const display = document.getElementById('hDisplay');

        configBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isLocked = slider.disabled;
            slider.disabled = !isLocked;
            slider.style.cursor = isLocked ? "pointer" : "not-allowed";
            configBtn.style.background = isLocked ? "#007bff" : "#333";
            configBtn.innerText = isLocked ? "Lock Settings" : "[]";
        });

        window.addEventListener('mousedown', (e) => {
            if (slider.value >= 100) {
                iframe.style.top = "40px";
                return;
            }

            const iframeHeight = iframe.offsetHeight;
            const windowHeight = window.innerHeight;
            let newTop = e.clientY - (iframeHeight / 2);

            if (newTop < 40) newTop = 40;
            if (newTop > windowHeight - iframeHeight) newTop = windowHeight - iframeHeight;

            iframe.style.top = newTop + "px";
        });

        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            iframe.style.height = val + '%';
            display.innerText = val + '%';
        });

        window.addEventListener('contextmenu', e => e.preventDefault());
    };

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('iframe[src*="stabfish2.io"]')) {
            obs.disconnect();
            runScript();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();