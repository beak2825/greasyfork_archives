// ==UserScript==
// @name         Chain Warn with Toggleable Glitter (Shadowcrest)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  When the chain is about to die, it'll produce noise each 5 seconds and make ur screen full with glitter
// @author       ShAdOwCrEsT [3929345]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @license      GPU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/564000/Chain%20Warn%20with%20Toggleable%20Glitter%20%28Shadowcrest%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564000/Chain%20Warn%20with%20Toggleable%20Glitter%20%28Shadowcrest%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .glitter-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        }

        .glitter-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #ffffff 0%, #c0c0c0 50%, transparent 70%);
            border-radius: 50%;
            opacity: 0.8;
            animation: fall linear infinite;
            box-shadow: 0 0 3px #ffffff;
        }

        @keyframes fall {
            0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `);

    const showTestButton = false;
    let alertSoundEnabled = GM_getValue('alertSoundEnabled');
    if (alertSoundEnabled === undefined) {
        const soundChoice = prompt('Would you like to enable sound alerts? (Yes or No)', 'Yes');
        alertSoundEnabled = soundChoice.toLowerCase() === 'yes';
        GM_setValue('alertSoundEnabled', alertSoundEnabled);
    }

    let glitterEnabled = GM_getValue('glitterEnabled');
    if (glitterEnabled === undefined) {
        const glitterChoice = prompt('Would you like to enable glitter animation? (Yes or No)', 'Yes');
        glitterEnabled = glitterChoice.toLowerCase() === 'yes';
        GM_setValue('glitterEnabled', glitterEnabled);
    }

    const userAlertTime = GM_getValue('alertTime', 100);
    const userMinChain = GM_getValue('minChain', 100);

    if (!GM_getValue('alertTime')) GM_setValue('alertTime', userAlertTime);
    if (!GM_getValue('minChain')) GM_setValue('minChain', userMinChain);

    const API_STORAGE_KEY = 'tornApiKey';
    const API_URL = 'https://api.torn.com/faction/?selections=chain&key=';
    let apiKey = GM_getValue(API_STORAGE_KEY);

    async function requestApiKey() {
        const inputKey = prompt('Enter your Torn API key:', '');
        if (inputKey) {
            GM_setValue(API_STORAGE_KEY, inputKey);
            apiKey = inputKey;
        } else {
            alert('API key is required to use this script.');
        }
    }

    if (!apiKey) {
        requestApiKey();
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let beepInterval = null;
    let alertTriggered = false;

    function playBeep() {
        if (!alertSoundEnabled) return;

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    function startBeeping() {
        if (beepInterval) return;

        playBeep();
        beepInterval = setInterval(() => {
            playBeep();
        }, 5000);
    }

    function stopBeeping() {
        if (beepInterval) {
            clearInterval(beepInterval);
            beepInterval = null;
        }
    }

    function createGlitterParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'glitter-particle';

        const startX = Math.random() * 100;
        const duration = 3 + Math.random() * 2;
        const delay = Math.random() * 2;
        const size = 4 + Math.random() * 6;

        particle.style.left = startX + '%';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';

        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, (duration + delay) * 1000);
    }

    function createGlitterEffect() {
        const container = document.createElement('div');
        container.className = 'glitter-container';
        document.body.appendChild(container);

        const particleCount = 150;
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                if (document.querySelector('.glitter-container')) {
                    createGlitterParticle(container);
                }
            }, i * 100);
        }

        const regenerateInterval = setInterval(() => {
            if (!document.querySelector('.glitter-container')) {
                clearInterval(regenerateInterval);
                return;
            }
            createGlitterParticle(container);
        }, 100);

        container.dataset.regenerateInterval = regenerateInterval;
    }

    async function fetchChainData() {
        if (!apiKey) {
            requestApiKey();
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL + apiKey,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        alert('Invalid API key. Please enter a valid one.');
                        GM_setValue(API_STORAGE_KEY, '');
                        requestApiKey();
                        return;
                    }
                    handleChainData(data.chain);
                } catch (error) {
                    console.error('Failed to fetch chain data:', error);
                }
            },
            onerror: function() {
                console.error('API request failed.');
            }
        });
    }

    function handleChainData(chain) {
        const { current, cooldown, end } = chain;
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = end - currentTime;
        const inCooldown = cooldown > 0;

        if (current > 0 && timeRemaining > 0 && !inCooldown && timeRemaining < userAlertTime) {
            triggerGlitterAlert();
        } else {
            alertTriggered = false;
            removeGlitter();
        }
    }

    function triggerGlitterAlert() {
        if (alertTriggered) return;

        if (glitterEnabled) {
            createGlitterEffect();
        }

        startBeeping();

        alertTriggered = true;
    }

    function removeGlitter() {
        const container = document.querySelector('.glitter-container');
        if (container) {
            const intervalId = container.dataset.regenerateInterval;
            if (intervalId) {
                clearInterval(parseInt(intervalId));
            }
            container.remove();
        }
        stopBeeping();
    }

    setInterval(fetchChainData, 10000);
    fetchChainData();
})();