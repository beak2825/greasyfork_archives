// ==UserScript==
// @name         Internet Roadtrip GPS TTS (Integrated with Minimap + Puter.js)
// @namespace    linktr.ee/gamerfronts
// @version      1.7
// @description  GPS TTS with street names and turn-by-turn directions integrated with the Minimap, using Puter.js for voice synthesis. Overlay sits above the minimap for real-time navigation feedback.
// @author       Gamerfronts
// @match        https://neal.fun/internet-roadtrip/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553326/Internet%20Roadtrip%20GPS%20TTS%20%28Integrated%20with%20Minimap%20%2B%20Puterjs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553326/Internet%20Roadtrip%20GPS%20TTS%20%28Integrated%20with%20Minimap%20%2B%20Puterjs%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /*** Load Puter.js library ***/
    const puterScript = document.createElement('script');
    puterScript.src = 'https://js.puter.com/v2/';
    document.head.appendChild(puterScript);

    /*** TTS Helper using Puter.js or fallback to speechSynthesis ***/
    const TTS = {
        enabled: true,
        usePuter: true,
        lang: 'en-US',
        rate: 1.0,
        volume: 1.0,
        async speak(text) {
            if (!this.enabled || !text) return;

            // Prefer Puter.js if available
            if (this.usePuter && window.puter?.ai?.txt2speech) {
                try {
                    const audio = await puter.ai.txt2speech(text, this.lang);
                    audio.volume = this.volume;
                    await audio.play();
                    return;
                } catch (err) {
                    console.warn('Puter.js TTS failed, using fallback:', err);
                    this._fallback(text);
                }
            } else {
                this._fallback(text);
            }
        },
        _fallback(text) {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = this.lang;
            u.rate = this.rate;
            u.volume = this.volume;
            speechSynthesis.speak(u);
        }
    };

    /*** Reverse geocode with OpenStreetMap Nominatim ***/
    async function getStreetName(lat, lng) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
            const resp = await fetch(url, {headers: {'User-Agent':'IR-TTS-Script'}});
            const data = await resp.json();
            if (data?.address) {
                const street = data.address.road || data.address.residential || data.address.pedestrian || '';
                const city = data.address.city || data.address.town || data.address.village || '';
                return {street, city};
            }
        } catch (e) {
            console.error('Reverse geocode error', e);
        }
        return {street:null, city:null};
    }

    /*** Patch main Vue stop change ***/
    const containerEl = document.querySelector('.container');
    let lastStop = '';

    function patchVue(vue) {
        if (!vue || vue.__ttsPatched) return;
        vue.__ttsPatched = true;

        const orig = vue.changeStop.bind(vue);
        vue.changeStop = async function() {
            const result = orig.apply(this, arguments);
            setTimeout(async () => {
                try {
                    const coords = this.currentCoords;
                    if (!coords) return;
                    const {street, city} = await getStreetName(coords.lat, coords.lng);
                    let text = '';
                    if (street) text = `Now arriving at ${street}${city ? ' in ' + city : ''}`;
                    else text = `Now arriving at destination`;

                    if (text !== lastStop) {
                        lastStop = text;
                        TTS.speak(text);
                        const st = document.getElementById('ir-tts-status');
                        if (st) st.textContent = text;
                    }
                } catch(e){console.error(e);}
            }, 50);
            return result;
        };
        console.log('IR GPS TTS: Vue patched.');
    }

    /*** Overlay UI above minimap ***/
    function createFloatingUI() {
        if (document.getElementById('ir-tts-ui')) return;
        const ui = document.createElement('div');
        ui.id = 'ir-tts-ui';

        Object.assign(ui.style, {
            position: 'fixed',
            bottom: '200px',  // placed above minimap
            left: '60px',
            zIndex: 9999999,
            background: 'rgba(0,0,0,0.75)',
            color: 'white',
            padding: '8px 10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            borderRadius: '6px',
            minWidth: '180px',
            maxWidth: '230px',
            boxShadow: '0 0 6px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            transition: 'opacity 0.3s ease'
        });

        const title = document.createElement('div');
        title.textContent = 'Roadtrip GPS TTS';
        title.style.fontWeight = '700';
        const status = document.createElement('div');
        status.id = 'ir-tts-status';
        status.textContent = 'Status: ready';

        ui.append(title, status);
        document.body.appendChild(ui);
    }

    /*** Optional Settings Tab Section ***/
    function injectTTSSettings() {
        const settingsContainer = document.querySelector('#settings-tab');
        if (!settingsContainer) return;
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        section.style.padding = '5px';
        section.style.borderTop = '1px solid #ccc';

        const title = document.createElement('h3');
        title.textContent = 'GPS Voice Settings';
        title.style.fontSize = '14px';
        section.appendChild(title);

        // Enable checkbox
        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = TTS.enabled;
        toggle.id = 'tts-enable';
        toggle.onchange = () => { TTS.enabled = toggle.checked; };
        const label = document.createElement('label');
        label.textContent = 'Enable TTS';
        label.htmlFor = 'tts-enable';
        label.style.marginLeft = '6px';
        section.append(toggle, label);

        // Use Puter toggle
        const puterToggle = document.createElement('input');
        puterToggle.type = 'checkbox';
        puterToggle.checked = TTS.usePuter;
        puterToggle.id = 'tts-puter';
        puterToggle.style.marginLeft = '12px';
        puterToggle.onchange = () => { TTS.usePuter = puterToggle.checked; };
        const puterLabel = document.createElement('label');
        puterLabel.textContent = 'Use Puter.js voice';
        puterLabel.htmlFor = 'tts-puter';
        puterLabel.style.marginLeft = '6px';
        section.append(document.createElement('br'), puterToggle, puterLabel);

        // Test button
        const testBtn = document.createElement('button');
        testBtn.textContent = '🔊 Test Voice';
        testBtn.style.marginTop = '6px';
        testBtn.onclick = () => TTS.speak('This is a test of the GPS voice navigation system.');
        section.append(document.createElement('br'), testBtn);

        settingsContainer.append(section);
    }

    /*** Wait for Vue instance & hook ***/
    const watcher = setInterval(async () => {
        const vue = containerEl?.__vue__;
        if (vue && typeof vue.changeStop === 'function') {
            clearInterval(watcher);
            injectTTSSettings();
            createFloatingUI();
            patchVue(vue);
        }
    }, 200);

    /*** Integrate with Minimap ***/
    async function waitForMinimap() {
        while (true) {
            try {
                if (window.IRF?.vdom?.map?.data?.marker) return window.IRF.vdom.map;
            } catch {}
            await new Promise(r => setTimeout(r, 500));
        }
    }

    (async () => {
        const vmap = await waitForMinimap();
        console.log('%c[IR GPS TTS] Connected to minimap marker.', 'color: lime;');

        let lastHeading = null;
        let lastStreet = null;
        let lastCoords = { lat: 0, lng: 0 };

        function getTurnDirection(current, previous) {
            if (previous === null || current === null) return null;
            const delta = ((current - previous + 540) % 360) - 180;
            if (Math.abs(delta) < 15) return null;
            if (delta > 15 && delta < 150) return "Turn right ahead";
            if (delta < -15 && delta > -150) return "Turn left ahead";
            return "Make a U-turn";
        }

        const marker = vmap.data.marker;
        const originalSetLngLat = marker.setLngLat;
        marker.setLngLat = new Proxy(originalSetLngLat, {
            async apply(target, thisArg, args) {
                try {
                    const [lng, lat] = args[0];
                    const vue = document.querySelector('.container').__vue__;
                    const heading = vue?.currentHeading || vue?.data?.currentHeading;

                    const turn = getTurnDirection(heading, lastHeading);
                    if (turn) TTS.speak(turn);
                    lastHeading = heading;

                    const moved = Math.hypot(lat - lastCoords.lat, lng - lastCoords.lng) > 0.001;
                    if (moved && Math.random() < 0.05) {
                        lastCoords = { lat, lng };
                        const {street, city} = await getStreetName(lat, lng);
                        if (street && street !== lastStreet) {
                            lastStreet = street;
                            TTS.speak(`Now driving on ${street}${city ? ' in ' + city : ''}.`);
                            const st = document.getElementById('ir-tts-status');
                            if (st) st.textContent = `Now on ${street}${city ? ', ' + city : ''}`;
                        }
                    }
                } catch (e) {
                    console.warn('TTS minimap hook error:', e);
                }
                return Reflect.apply(target, thisArg, args);
            }
        });

        console.log('%c[IR GPS TTS] Linked with minimap updates.', 'color: cyan;');
        TTS.speak('GPS voice navigation linked with minimap.');
    })();
})();
