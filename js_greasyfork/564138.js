// ==UserScript==
// @name         OpenGuessr - OMNISCIENT CLASSIC
// @version      1.2
// @namespace    https://github.com/kosmosa/openguessr-omni
// @description  Full Map Recovery + Auto-Unlock + Settings Memory
// @author       kosmosa
// @license MIT
// @match        *://*.openguessr.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564138/OpenGuessr%20-%20OMNISCIENT%20CLASSIC.user.js
// @updateURL https://update.greasyfork.org/scripts/564138/OpenGuessr%20-%20OMNISCIENT%20CLASSIC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ბიბლიოთეკების იძულებითი ჩატვირთვა
    function loadLib(url, type) {
        return new Promise((resolve) => {
            const el = document.createElement(type === 'js' ? 'script' : 'link');
            if (type === 'js') { el.src = url; el.onload = resolve; }
            else { el.rel = 'stylesheet'; el.href = url; resolve(); }
            document.head.appendChild(el);
        });
    }

    let cfg = JSON.parse(localStorage.getItem('omni_cfg')) || {
        lang: 'ka', theme: 'dark', hard: false, zoom: true, head: true, mIdx: 0
    };
    function save() { localStorage.setItem('omni_cfg', JSON.stringify(cfg)); }

    let currentLang = cfg.lang, isHardMode = cfg.hard, currentTheme = cfg.theme, lastLoc = "";
    let savedCity = "", savedCountry = "", showInHeader = cfg.head, autoZoom = cfg.zoom, isVisible = true;
    let map = null, marker = null, currentLayer = null, mapIndex = cfg.mIdx;

    const layers = [
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    ];

    const themes = {
        dark: { main: '#bbbbbb', bg: 'rgba(20, 20, 20, 0.98)', text: '#ffffff' },
        matrix: { main: '#00cc33', bg: 'rgba(5, 10, 5, 0.98)', text: '#00ff41' },
        sea: { main: '#00aacc', bg: 'rgba(5, 10, 15, 0.98)', text: '#00d4ff' },
        blood: { main: '#cc3333', bg: 'rgba(15, 5, 5, 0.98)', text: '#ff4141' },
        gold: { main: '#ccaa00', bg: 'rgba(15, 10, 5, 0.98)', text: '#ffcc00' }
    };

    const translations = {
        ka: { header: "Omniscient v1.2", lock: "დაშიფრულია", mode: "რეჟიმი: ", easy: "მარტივი", hard: "რთული", map: "რუკა 🔄", cityPop: "🏙️ ქალაქი: ", countryPop: "👥 ქვეყანა: ", lang: "🗣️ ენა: ", call: "📞 კოდი: ", dist: "ბაზიდან: ", km: " კმ", zoom: "ზუმი: ", head: "სათაური: ", on: "ჩართ", off: "გამორთ" },
        en: { header: "Omniscient v1.2", lock: "ENCRYPTED", mode: "MODE: ", easy: "EASY", hard: "HARD", map: "MAP 🔄", cityPop: "🏙️ City: ", countryPop: "👥 Country: ", lang: "🗣️ Lang: ", call: "📞 Code: ", dist: "From Base: ", km: " km", zoom: "ZOOM: ", head: "HEAD: ", on: "ON", off: "OFF" },
        ru: { header: "Omniscient v1.2", lock: "ЗАШИФРОВАНО", mode: "РЕЖИМ: ", easy: "ЛЕГКИЙ", hard: "СЛОЖНЫЙ", map: "КАРТА 🔄", cityPop: "🏙️ Город: ", countryPop: "👥 Страна: ", lang: "🗣️ Язык: ", call: "📞 Код: ", dist: "От базы: ", km: " км", zoom: "ЗУМ: ", head: "ШАПКА: ", on: "ВКЛ", off: "ВЫКЛ" }
    };

    const panel = document.createElement('div');
    panel.id = "main-panel";
    panel.style = "position: fixed; top: 10px; left: 10px; width: 440px; z-index: 2147483647; border-radius: 10px; border: 1px solid; font-family: 'Consolas', monospace; box-shadow: 0 10px 30px rgba(0,0,0,0.8); display: flex; flex-direction: column; overflow: hidden;";
    panel.innerHTML = `
        <div id="og-header" style="padding: 10px; cursor: move; color: #000 !important; font-weight: bold; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0;">
            <div style="display: flex; gap: 8px; align-items: center; pointer-events: none;">
                <span id="ui-header" style="font-size: 11px; text-transform: uppercase; color: #000 !important;"></span>
                <span id="ui-header-info" style="font-size: 11px; font-weight: normal; opacity: 0.9; color: #000 !important;"></span>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button id="btn-settings" style="background: none; border: none; cursor: pointer; font-size: 14px;">⚙️</button>
                <button id="btn-collapse" style="background: rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.3); cursor: pointer; font-weight: bold; width: 22px; height: 22px; color: #000 !important;">_</button>
            </div>
        </div>
        <div id="settings-popup" style="display: none; position: absolute; top: 42px; right: 10px; background: #111; border: 1px solid; padding: 12px; z-index: 200006; border-radius: 8px; flex-direction: column; gap: 8px; min-width: 160px;">
            <select id="sel-lang" style="background: #000; color: inherit; border: 1px solid;"><option value="ka">GE</option><option value="en">EN</option><option value="ru">RU</option></select>
            <select id="sel-theme" style="background: #000; color: inherit; border: 1px solid;"><option value="dark">Midnight Dark</option><option value="matrix">Matrix</option><option value="sea">Sea</option><option value="blood">Blood</option><option value="gold">Gold</option></select>
            <button id="btn-zoom-toggle" style="background: #222; color: #fff; border: 1px solid #444; padding: 5px; cursor: pointer; font-size: 10px;"></button>
            <button id="btn-head-toggle" style="background: #222; color: #fff; border: 1px solid #444; padding: 5px; cursor: pointer; font-size: 10px;"></button>
        </div>
        <div id="panel-content">
            <div id="lock-overlay" style="position: absolute; top: 40px; left: 0; width: 100%; height: calc(100% - 40px); background: rgba(10,10,10,0.98); z-index: 200001; display: none; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <div style="font-size: 40px;">🔒</div><div id="ui-lock-text" style="margin-top: 10px;"></div>
            </div>
            <div id="mini-map" style="width: 100%; height: 240px; background: #111; border-bottom: 1px solid; position: relative;"></div>
            <div style="padding: 15px; display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; gap: 8px;"><button id="btn-mode-toggle" style="flex: 2; background: rgba(0,0,0,0.3); border: 1px solid; padding: 6px; cursor: pointer; font-size: 10px; color: inherit;"></button><button id="btn-map-cycle" style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid; padding: 6px; cursor: pointer; font-size: 10px; color: inherit;"></button></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div id="b1" style="background: rgba(255,255,255,0.02); border: 1px solid; padding: 10px; border-radius: 6px;"><div id="flag-box" style="font-size: 18px; margin-bottom: 5px;">-</div><div id="city-pop-box" style="font-size: 10px;"></div><div id="pop-box" style="font-size: 10px; opacity: 0.5;"></div></div>
                    <div id="b2" style="background: rgba(255,255,255,0.02); border: 1px solid; padding: 10px; border-radius: 6px;"><div id="temp-box" style="font-size: 18px; margin-bottom: 5px;">--°C</div><div id="lang-box" style="font-size: 10px;"></div><div id="call-box" style="font-size: 10px; opacity: 0.5;"></div></div>
                </div>
                <div id="loc-info" style="padding: 12px; border-radius: 6px; border: 1px solid;"><div id="city-name" style="font-size: 16px; font-weight: bold;"></div><div id="country-name" style="font-size: 10px;"></div></div>
                <div id="dist-display" style="font-size: 10px; text-align: center; color: #000; background: #aaa; padding: 5px; font-weight: bold; border-radius: 4px;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    function updateUI() {
        const t = translations[currentLang], theme = themes[currentTheme];
        panel.style.borderColor = theme.main; panel.style.color = theme.text; panel.style.backgroundColor = theme.bg;
        document.getElementById('og-header').style.backgroundColor = theme.main;
        document.getElementById('ui-header').innerText = t.header;
        document.getElementById('ui-header-info').innerText = (showInHeader && savedCity) ? `| ${savedCity}, ${savedCountry}` : "";
        document.getElementById('ui-lock-text').innerText = t.lock;
        document.getElementById('btn-map-cycle').innerText = t.map;
        document.getElementById('btn-mode-toggle').innerText = t.mode + (isHardMode ? t.hard : t.easy);
        document.getElementById('btn-zoom-toggle').innerText = t.zoom + (autoZoom ? t.on : t.off);
        document.getElementById('btn-head-toggle').innerText = t.head + (showInHeader ? t.on : t.off);
        document.getElementById('sel-lang').value = currentLang;
        document.getElementById('sel-theme').value = currentTheme;
        const gd = (id) => document.getElementById(id).getAttribute('data-val') || '-';
        document.getElementById('city-pop-box').innerText = t.cityPop + gd('city-pop-box');
        document.getElementById('pop-box').innerText = t.countryPop + gd('pop-box');
        document.getElementById('lang-box').innerText = t.lang + gd('lang-box');
        document.getElementById('call-box').innerText = t.call + gd('call-box');
        document.getElementById('dist-display').innerText = t.dist + gd('dist-display') + (gd('dist-display') !== '-' ? t.km : '');
        document.getElementById('dist-display').style.backgroundColor = theme.main;
    }

    async function initMapSystem() {
        await loadLib('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'css');
        await loadLib('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'js');
        if (!map) {
            map = L.map('mini-map', { zoomControl: false, attributionControl: false }).setView([0,0], 2);
            currentLayer = L.tileLayer(layers[mapIndex]).addTo(map);
            marker = L.marker([0, 0]).addTo(map);
            setTimeout(() => map.invalidateSize(), 500);
        }
    }

    function process(lat, lon) {
        if (isHardMode && isVisible) document.getElementById('lock-overlay').style.display = 'flex';
        if (!map) initMapSystem();
        if (map) {
            if (autoZoom) map.setView([lat, lon], 7);
            marker.setLatLng([lat, lon]);
            map.invalidateSize();
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${currentLang}`,
            onload: (res) => {
                const d = JSON.parse(res.responseText), a = d.address, code = (a.country_code||"").toUpperCase();
                savedCity = a.city || a.town || a.village || "N/A"; savedCountry = a.country || "N/A";
                document.getElementById('city-name').innerText = savedCity;
                document.getElementById('country-name').innerText = savedCountry;
                document.getElementById('flag-box').innerText = code.replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397)) + " " + savedCountry;
                updateUI();
                GM_xmlhttpRequest({ method: "GET", url: `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`, onload: (rw) => { if(rw.responseText) document.getElementById('temp-box').innerText = JSON.parse(rw.responseText).current_weather.temperature + "°C"; } });
                GM_xmlhttpRequest({ method: "GET", url: `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${savedCity}&rows=1`, onload: (r2) => { if(r2.responseText) document.getElementById('city-pop-box').setAttribute('data-val', JSON.parse(r2.responseText).records?.[0]?.fields?.population?.toLocaleString() || "N/A"); updateUI(); } });
                if(code) GM_xmlhttpRequest({ method: "GET", url: `https://restcountries.com/v3.1/alpha/${code}`, onload: (r3) => { if(r3.responseText){const c = JSON.parse(r3.responseText)[0]; document.getElementById('pop-box').setAttribute('data-val', (c.population / 1000000).toFixed(1) + " M"); document.getElementById('lang-box').setAttribute('data-val', Object.values(c.languages)[0]); document.getElementById('call-box').setAttribute('data-val', c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : "")); updateUI();} } });
            }
        });
        const dist = Math.round(6371 * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(((41.7151-lat)*Math.PI/180)/2),2)+Math.cos(lat*Math.PI/180)*Math.cos(41.7151*Math.PI/180)*Math.pow(Math.sin(((44.8271-lon)*Math.PI/180)/2),2))));
        document.getElementById('dist-display').setAttribute('data-val', dist);
        updateUI();
    }

    setInterval(() => {
        const iframe = document.querySelector('#PanoramaIframe') || document.querySelector('iframe[src*="location"]');
        if (iframe && iframe.src) {
            const loc = new URL(iframe.src).searchParams.get('location');
            if (loc && loc !== lastLoc) { lastLoc = loc; const [lat, lon] = loc.split(',').map(Number); process(lat, lon); }
        }
        const btns = document.querySelectorAll('button');
        btns.forEach(b => {
            const t = b.innerText.toLowerCase();
            if (t.includes('locked') || t.includes('continue') || t.includes('next') || t.includes('round')) {
                const overlay = document.getElementById('lock-overlay');
                if (overlay && overlay.style.display !== 'none') overlay.style.display = 'none';
            }
        });
    }, 1000);

    // გადათრევა და სეთინგები
    let isDragging = false, ox, oy;
    document.getElementById('og-header').onmousedown = (e) => { if(e.target.tagName !== 'BUTTON'){isDragging = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop;} };
    document.onmousemove = (e) => { if (isDragging) { panel.style.left = (e.clientX - ox) + 'px'; panel.style.top = (e.clientY - oy) + 'px'; } };
    document.onmouseup = () => isDragging = false;
    document.getElementById('btn-map-cycle').onclick = () => { if(map){mapIndex = (mapIndex + 1) % layers.length; cfg.mIdx = mapIndex; save(); map.removeLayer(currentLayer); currentLayer = L.tileLayer(layers[mapIndex]).addTo(map);} };
    document.getElementById('btn-zoom-toggle').onclick = () => { autoZoom = !autoZoom; cfg.zoom = autoZoom; save(); updateUI(); };
    document.getElementById('btn-head-toggle').onclick = () => { showInHeader = !showInHeader; cfg.head = showInHeader; save(); updateUI(); };
    document.getElementById('btn-collapse').onclick = () => { const c = document.getElementById('panel-content'); c.style.display = c.style.display === "none" ? "block" : "none"; if(map) setTimeout(()=>map.invalidateSize(), 100); };
    document.getElementById('btn-settings').onclick = () => { const s = document.getElementById('settings-popup'); s.style.display = s.style.display === "none" ? "flex" : "none"; };
    document.getElementById('sel-lang').onchange = (e) => { currentLang = e.target.value; cfg.lang = currentLang; save(); updateUI(); };
    document.getElementById('sel-theme').onchange = (e) => { currentTheme = e.target.value; cfg.theme = currentTheme; save(); updateUI(); };
    document.getElementById('btn-mode-toggle').onclick = () => { isHardMode = !isHardMode; cfg.hard = isHardMode; save(); updateUI(); document.getElementById('lock-overlay').style.display = isHardMode ? 'flex' : 'none'; };

    window.addEventListener('keydown', (e) => { if (e.key === "F2") { isVisible = !isVisible; panel.style.setProperty('display', isVisible ? 'flex' : 'none', 'important'); } });

    updateUI();
    initMapSystem();
})();