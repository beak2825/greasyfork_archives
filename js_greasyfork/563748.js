// ==UserScript==
// @name         Bandit.camp Rakeback Rain Alert
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Alerts (sound + notification + title flash) when Rakeback Rain starts + Collapsible Settings Panel + Pleasant Chimes
// @author       N1ko
// @match        https://bandit.camp/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/563748/Banditcamp%20Rakeback%20Rain%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/563748/Banditcamp%20Rakeback%20Rain%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Credit Overlay (bottom-left, transparent) ===
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.bottom = '20px';
    overlay.style.left = '20px';
    overlay.style.color = 'white';
    overlay.style.fontSize = '16px';
    overlay.style.fontWeight = 'bold';
    overlay.style.textShadow = '2px 2px 6px black';
    overlay.style.zIndex = '999999';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0.85';
    overlay.style.whiteSpace = 'nowrap';
    overlay.innerText = 'Made by N1ko ⚡ Discord: n.1.k.o ⚡ YouTube: n1kose145';
    document.body.appendChild(overlay);

    // === Pleasant chime options (soft, non-jumpscare sounds) ===
    const chimeOptions = [
        {
            name: 'Soft Single Chime',
            notes: [{freq: 800, dur: 500, type: 'sine'}]
        },
        {
            name: 'Triple Gentle Bell',
            notes: [
                {freq: 880, dur: 300, type: 'triangle'},
                {freq: 880, dur: 300, type: 'triangle'},
                {freq: 880, dur: 400, type: 'triangle'}
            ]
        },
        {
            name: 'Ding Dong Door Bell',
            notes: [
                {freq: 784, dur: 300, type: 'sine'},
                {freq: 587, dur: 500, type: 'sine'}
            ]
        },
        {
            name: 'iPhone Style Tri-Tone',
            notes: [
                {freq: 880, dur: 150, type: 'sine'},
                {freq: 988, dur: 150, type: 'sine'},
                {freq: 1175, dur: 350, type: 'sine'}
            ]
        },
        {
            name: 'Ascending Pleasant',
            notes: [
                {freq: 700, dur: 200, type: 'sine'},
                {freq: 900, dur: 200, type: 'sine'},
                {freq: 1100, dur: 400, type: 'sine'}
            ]
        },
        {
            name: 'Harmonic Arpeggio',
            notes: [
                {freq: 523, dur: 120, type: 'sine'},
                {freq: 659, dur: 120, type: 'sine'},
                {freq: 784, dur: 400, type: 'sine'}
            ]
        },
        {
            name: 'Calm Double Chime',
            notes: [
                {freq: 1000, dur: 250, type: 'triangle'},
                {freq: 1200, dur: 350, type: 'triangle'}
            ]
        },
        {
            name: 'Relaxing Wave',
            notes: [
                {freq: 600, dur: 300, type: 'sine'},
                {freq: 800, dur: 300, type: 'sine'},
                {freq: 600, dur: 500, type: 'sine'}
            ]
        }
    ];

    // === Play tone with smooth fade-in/out (no harsh starts) ===
    function playTone(freq, duration, type = 'sine', volume = 1.0) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctx.resume().catch(() => {});
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration / 1000 + 0.1);
    }

    // === Play the selected chime ===
    function playCurrentAlert(isTest = false) {
        const index = parseInt(select.value);
        const option = chimeOptions[index];
        const vol = slider.value / 100;
        const repeatTimes = isTest ? 1 : 2; // 2 repeats for alert, 1 for test
        let totalDelay = 0;
        for (let rep = 0; rep < repeatTimes; rep++) {
            let seqDelay = 0;
            option.notes.forEach(note => {
                setTimeout(() => playTone(note.freq, note.dur, note.type || 'sine', vol), totalDelay + seqDelay);
                seqDelay += note.dur + 80;
            });
            totalDelay += seqDelay + 600;
        }
    }

    // === Settings Panel (bottom-right, collapsible) ===
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.background = 'rgba(0,0,0,0.75)';
    panel.style.color = 'white';
    panel.style.padding = '15px';
    panel.style.borderRadius = '12px';
    panel.style.zIndex = '999999';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.boxShadow = '0 0 15px rgba(0,0,0,0.8)';
    panel.style.maxWidth = '300px';
    panel.innerHTML = `
        <div id="rainPanelHeader" style="cursor:pointer; margin-bottom:12px; font-size:18px; text-align:center; user-select:none;">
            🌧️ Rain Alert Settings <span id="rainToggleArrow">▼</span>
        </div>
        <div id="rainPanelContent">
            <div style="margin-bottom:10px;">Alert Sound:</div>
            <select id="rainSoundSelect" style="width:100%; padding:8px; margin-bottom:15px; background:#333; color:white; border:none; border-radius:6px;"></select>
            <div style="margin-bottom:10px;">Volume: <span id="volumeValue">70</span>%</div>
            <input type="range" id="rainVolumeSlider" min="0" max="100" value="70" style="width:100%; margin-bottom:20px;">
            <button id="rainTestButton" style="width:100%; padding:10px; background:#ff6600; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">🔊 Test Sound</button>
            <small style="display:block; margin-top:12px; opacity:0.8;">Click Test to hear + unlock audio</small>
        </div>
    `;
    document.body.appendChild(panel);

    // Panel elements
    const header = document.getElementById('rainPanelHeader');
    const content = document.getElementById('rainPanelContent');
    const arrow = document.getElementById('rainToggleArrow');
    const select = document.getElementById('rainSoundSelect');
    const slider = document.getElementById('rainVolumeSlider');
    const valueSpan = document.getElementById('volumeValue');
    const testBtn = document.getElementById('rainTestButton');

    // Populate sound select
    chimeOptions.forEach((opt, i) => {
        const optionEl = document.createElement('option');
        optionEl.value = i;
        optionEl.textContent = opt.name;
        select.appendChild(optionEl);
    });

    // Load saved settings (default: Triple Bell, 70% volume, panel open)
    let savedIndex = parseInt(localStorage.getItem('rainSoundIndex') || '1');
    let savedVol = parseInt(localStorage.getItem('rainVolume') || '70');
    let panelOpen = localStorage.getItem('rainPanelOpen') !== 'false';
    select.value = savedIndex;
    slider.value = savedVol;
    valueSpan.textContent = savedVol;
    content.style.display = panelOpen ? 'block' : 'none';
    arrow.textContent = panelOpen ? '▼' : '▶';

    // Events
    select.onchange = () => localStorage.setItem('rainSoundIndex', select.value);
    slider.oninput = () => {
        valueSpan.textContent = slider.value;
        localStorage.setItem('rainVolume', slider.value);
    };
    testBtn.onclick = () => playCurrentAlert(true);
    header.onclick = () => {
        panelOpen = !panelOpen;
        content.style.display = panelOpen ? 'block' : 'none';
        arrow.textContent = panelOpen ? '▼' : '▶';
        localStorage.setItem('rainPanelOpen', panelOpen);
    };

    // Notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Rain keywords
    const rainKeywords = [
        'rakeback rain', 'rain has started', 'rain is now active', 'rain event',
        'claim your rain', 'rakeback rain is active', 'free rakeback rain',
        'rain started', 'rain in chat', 'rakeback drop'
    ];

    // Observer for rain detection
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                    const text = (node.textContent || node.innerText || '').toLowerCase();
                    if (rainKeywords.some(kw => text.includes(kw))) {
                        if (Notification.permission === 'granted') {
                            new Notification('🚨 RAIN STARTED on Bandit.camp!', {
                                body: 'Hurry and claim your free scrap!',
                                icon: 'https://bandit.camp/favicon.ico'
                            });
                        }
                        playCurrentAlert(false);
                        const originalTitle = document.title;
                        let flashes = 0;
                        const flashInterval = setInterval(() => {
                            document.title = flashes % 2 === 0 ? '🚨 RAIN ACTIVE! 🚨' : originalTitle;
                            flashes++;
                            if (flashes > 12) {
                                clearInterval(flashInterval);
                                document.title = originalTitle;
                            }
                        }, 500);
                        console.log('Rain detected!');
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    console.log('Bandit.camp Rain Alert v1.4 loaded – pleasant chimes + collapsible panel by N1ko');
})();