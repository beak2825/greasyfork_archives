// ==UserScript==
// @name            TORN attack screen Energy + Stealth
// @namespace       http://tampermonkey.net/
// @version         1.6.1
// @description     Show auto-updating energy and stealth percentage on attack screen, with flashing warning colors + glow when low energy.
// @author          Apollyon
// @license         MIT
// @match           https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/548574/TORN%20attack%20screen%20Energy%20%2B%20Stealth.user.js
// @updateURL https://update.greasyfork.org/scripts/548574/TORN%20attack%20screen%20Energy%20%2B%20Stealth.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================
    // API Key management
    // ================================
    function getAPIKey() {
        return localStorage.getItem('torn_minimal_key');
    }

    function setAPIKey(key) {
        localStorage.setItem('torn_minimal_key', key);
    }

    let API_KEY = getAPIKey();
    if (!API_KEY) {
        showAPIKeySetup();
    } else {
        initializeScript();
    }

    function showAPIKeySetup() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const dialog = document.createElement('div');
        dialog.style.backgroundColor = '#2a2a2a';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.border = '1px solid #444';
        dialog.style.minWidth = '300px';
        dialog.style.textAlign = 'center';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Minimal API Key';
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginBottom = '15px';
        input.style.backgroundColor = '#1a1a1a';
        input.style.color = 'white';
        input.style.border = '1px solid #444';
        input.style.borderRadius = '4px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '8px 16px';
        okButton.style.backgroundColor = '#0ea01fff';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';

        okButton.addEventListener('click', () => {
            const apiKey = input.value.trim();
            if (apiKey) {
                setAPIKey(apiKey);
                API_KEY = apiKey;
                overlay.remove();
                initializeScript();
            }
        });

        dialog.appendChild(input);
        dialog.appendChild(okButton);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        input.focus();
    }

    // ================================
    // Initialization
    // ================================
    function initializeScript() {
        fetchAttackerEnergy();
        setInterval(fetchAttackerEnergy, 30000); // refresh every 30s
        initStealthWatcher();
    }

    // ================================
    // Energy Display
    // ================================
    function fetchAttackerEnergy() {
        fetch(`https://api.torn.com/user/?selections=bars&key=${API_KEY}&comment=attackpageimprovements`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.energy) return;
                const currentEnergy = data.energy.current;
                const maxEnergy = data.energy.maximum;

                function insertEnergyDisplay() {
                    const attackerUsernameElement = document.querySelector('div[class*="green"] .user-name');
                    if (attackerUsernameElement) {
                        const existing = attackerUsernameElement.parentNode.querySelector('.torn-energy-display');
                        if (existing) existing.remove();

                        const energyContainer = document.createElement('div');
                        energyContainer.className = 'torn-energy-display';
                        energyContainer.style.display = 'inline-block';
                        energyContainer.style.marginLeft = '8px';
                        energyContainer.style.verticalAlign = 'middle';
                        energyContainer.title = `Energy: ${currentEnergy}/${maxEnergy}`;

                        const progressContainer = document.createElement('div');
                        progressContainer.style.position = 'relative';
                        progressContainer.style.width = '80px';
                        progressContainer.style.height = '12px';
                        progressContainer.style.backgroundColor = '#2a2a2a';
                        progressContainer.style.borderRadius = '8px';
                        progressContainer.style.overflow = 'hidden';
                        progressContainer.style.border = '1px solid #444';

                        const progressBar = document.createElement('div');
                        const percentage = (currentEnergy / maxEnergy) * 100;
                        progressBar.style.width = `${percentage}%`;
                        progressBar.style.height = '100%';
                        progressBar.style.borderRadius = '8px';
                        progressBar.style.transition = 'width 0.3s ease';

                        // Default color
                        progressBar.style.backgroundColor = '#0ea01fff';

                        // Flash + glow if low energy
                        if (currentEnergy === 25) {
                            progressBar.style.animation = 'flash-yellow 1s infinite';
                        } else if (currentEnergy < 25) {
                            progressBar.style.animation = 'flash-red 1s infinite';
                        } else {
                            progressBar.style.animation = 'none';
                        }

                        const textDisplay = document.createElement('span');
                        textDisplay.textContent = `${currentEnergy}/${maxEnergy}`;
                        textDisplay.style.position = 'absolute';
                        textDisplay.style.top = '50%';
                        textDisplay.style.left = '50%';
                        textDisplay.style.transform = 'translate(-50%, -50%)';
                        textDisplay.style.fontSize = '10px';
                        textDisplay.style.color = '#fff';
                        textDisplay.style.fontWeight = 'bold';
                        textDisplay.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';

                        progressContainer.appendChild(progressBar);
                        progressContainer.appendChild(textDisplay);
                        energyContainer.appendChild(progressContainer);

                        attackerUsernameElement.parentNode.insertBefore(energyContainer, attackerUsernameElement.nextSibling);

                        // Add CSS animations
                        if (!document.getElementById('energy-flash-styles')) {
                            const style = document.createElement('style');
                            style.id = 'energy-flash-styles';
                            style.textContent = `
                                @keyframes flash-yellow {
                                    0%, 100% { background-color: #FFD700; box-shadow: 0 0 10px 3px #FFD700; }
                                    50% { background-color: #2a2a2a; box-shadow: none; }
                                }
                                @keyframes flash-red {
                                    0%, 100% { background-color: #FF0000; box-shadow: 0 0 12px 4px #FF0000; }
                                    50% { background-color: #2a2a2a; box-shadow: none; }
                                }
                            `;
                            document.head.appendChild(style);
                        }
                    } else {
                        setTimeout(insertEnergyDisplay, 200);
                    }
                }
                insertEnergyDisplay();
            });
    }

    // ================================
    // Stealth Watcher
    // ================================
    function watchPercentage(target, title) {
        function updatePercentage() {
            const percent = parseFloat(target.style.height.replace('%', '')).toFixed(2) + '%';
            title.innerText = `Stealth ${percent}`;
        }
        var observer = new MutationObserver(() => updatePercentage());
        updatePercentage();
        observer.observe(target, { attributes : true, attributeFilter : ['style'] });
    }

    function addTitleWrapper(title, className) {
        const toggleClass = 'brainslug-title';
        if (title.classList.contains(toggleClass)) {
            title.appendChild(document.createTextNode(" - "));
            const wrapper = document.createElement('span');
            wrapper.classList.add(className);
            title.appendChild(wrapper);
            return wrapper;
        } else {
            title.classList.add(toggleClass);
            title.innerHTML = `<span class="${className}"></span>`;
        }
        return title.getElementsByClassName(className)[0];
    }

    function initStealthWatcher() {
        const maxLoop = 10000;
        let counter = 1;
        let loop = setInterval(function () {
            const bar = document.querySelector(`div[class^='stealthBarWrap_'] [class^='level_']`);
            const title = document.querySelector(`div[class^='titleContainer_'] [class^='title_']`);
            if (bar && title) {
                const wrapped = addTitleWrapper(title, 'stealth');
                watchPercentage(bar, wrapped);
                return clearInterval(loop);
            }
            if (counter > maxLoop) {
                console.error('stealth bar never found');
                return clearInterval(loop);
            }
            counter++;
        }, 100);
    }

})();
