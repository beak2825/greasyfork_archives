// ==UserScript==
// @name         qweqrtrtw
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  asdfsdf
// @author       f
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560791/qweqrtrtw.user.js
// @updateURL https://update.greasyfork.org/scripts/560791/qweqrtrtw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- AYARLAR ---
    // Klasik Kırmızı Konum İğnesi (Görsel Yardımcı)
    const MARKER_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
            </filter>
            <path fill="#EA4335" stroke="#FFFFFF" stroke-width="1.5" filter="url(#shadow)" d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
    `;
    const MARKER_ICON_URL = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(MARKER_SVG);

    // --- Değişkenler ---
    let latestDetectedCoordinates = { lat: null, lng: null };
    let lockedCoordinates = { lat: null, lng: null };
    let lastUrl = window.location.href;
    let mapInstance = null;
    let customOverlay = null;
    let isMarkerVisible = false;

    // --- CSS Stilleri ---
    GM_addStyle(`
        .custom-marker {
            position: absolute;
            width: 50px;
            height: 50px;
            margin-left: -25px;
            margin-top: -50px;
            z-index: 1000;
            pointer-events: none;
            background-image: url('${MARKER_ICON_URL}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: bottom center;
        }
        /* Mobil Kontrol Paneli */
        #mobile-cheat-controls {
            position: fixed;
            top: 20%;
            right: 10px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 999999;
        }
        .cheat-btn {
            width: 45px;
            height: 45px;
            background-color: rgba(0, 0, 0, 0.6);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            color: white;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            transition: transform 0.1s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .cheat-btn:active {
            transform: scale(0.9);
            background-color: rgba(0, 0, 0, 0.9);
            border-color: #fff;
        }
        /* Özel Renkler */
        .btn-place { background-color: rgba(234, 67, 53, 0.7); } /* Kırmızımsı */
    `);

    // --- AĞI DİNLEME (Koordinat Yakalama) ---
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (method.toUpperCase() === 'POST' &&
            (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
             url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

            this.addEventListener('load', function () {
                try {
                    const pattern = /-?\d+\.\d{6,},-?\d+\.\d{6,}/g;
                    const match = this.responseText.match(pattern);
                    if (match && match.length > 0) {
                        const coords = match[0].split(",");
                        latestDetectedCoordinates.lat = Number.parseFloat(coords[0]);
                        latestDetectedCoordinates.lng = Number.parseFloat(coords[1]);
                    }
                } catch(e) {}
            });
        }
        return originalOpen.apply(this, arguments);
    };

    // --- YENİ TUR ALGILAMA ---
    new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (currentUrl.includes("/game/")) {
                latestDetectedCoordinates = { lat: null, lng: null };
                lockedCoordinates = { lat: null, lng: null };
                if (customOverlay) {
                    customOverlay.setMap(null);
                    customOverlay = null;
                }
                isMarkerVisible = false;
            }
        }
    }).observe(document.body, { subtree: true, childList: true });

    // --- MARKER (Görsel) FONKSİYONLARI ---
    function findMapInstance() {
        if (mapInstance) return;
        try {
            let element = document.querySelector('[class^="guess-map_canvas__"]');
            if (!element) return;
            const reactKey = Object.keys(element).find(key => key.startsWith("__reactFiber$"));
            mapInstance = element[reactKey].return.return.memoizedProps.map;
        } catch (e) {}
    }

    function createOrUpdateOnMapMarker() {
        if (!mapInstance) findMapInstance();
        if (!mapInstance || lockedCoordinates.lat === null) return;

        if (customOverlay) customOverlay.setMap(null);

        class MarkerOverlay extends google.maps.OverlayView {
            constructor(position) { super(); this.position = position; this.div = null; }
            onAdd() {
                this.div = document.createElement('div');
                this.div.className = 'custom-marker';
                this.getPanes().overlayMouseTarget.appendChild(this.div);
            }
            draw() {
                if (!this.div) return;
                const point = this.getProjection().fromLatLngToDivPixel(this.position);
                if (point) {
                    this.div.style.left = point.x + 'px';
                    this.div.style.top = point.y + 'px';
                }
            }
            onRemove() { if (this.div) { this.div.parentNode.removeChild(this.div); this.div = null; } }
            setVisible(visible) { if (this.div) this.div.style.display = visible ? 'block' : 'none'; }
        }

        const position = new google.maps.LatLng(lockedCoordinates.lat, lockedCoordinates.lng);
        customOverlay = new MarkerOverlay(position);
        customOverlay.setMap(mapInstance);
    }

    // --- OTOMATİK GUESS (Resolver Kodundan Entegre Edildi) ---
    function autoPlaceMarkerOnGameMap() {
        // En son tespit edilen koordinatları kullan
        let lat = latestDetectedCoordinates.lat;
        let lng = latestDetectedCoordinates.lng;

        if (!lat || !lng) {
            // Eğer anlık koordinat yoksa kilitlenmiş olana bak
            if (lockedCoordinates.lat) {
                lat = lockedCoordinates.lat;
                lng = lockedCoordinates.lng;
            } else {
                alert("Koordinat bulunamadı! Biraz hareket edin.");
                return;
            }
        }

        let element = document.querySelectorAll('[class^="guess-map_canvas__"]')[0];
        if(!element){
            alert("Harita elementi bulunamadı. Haritanın açık olduğundan emin olun.");
            return;
        }

        const latLngFns = {
            latLng:{
                lat: () => lat,
                lng: () => lng,
            }
        };

        try {
            // React Fiber üzerinden harita tıklama fonksiyonunu bul ve çalıştır
            const reactKeys = Object.keys(element);
            const reactKey = reactKeys.find(key => key.startsWith("__reactFiber$"));
            const elementProps = element[reactKey];
            const mapElementClick = elementProps.return.return.memoizedProps.map.__e3_.click;
            const mapElementPropKeys = Object.keys(mapElementClick);
            const mapElementPropKey = mapElementPropKeys[mapElementPropKeys.length - 1];
            const mapClickProps = mapElementClick[mapElementPropKey];
            const mapClickPropKeys = Object.keys(mapClickProps);

            for(let i = 0; i < mapClickPropKeys.length ;i++){
                if(typeof mapClickProps[mapClickPropKeys[i]] === "function"){
                    mapClickProps[mapClickPropKeys[i]](latLngFns);
                }
            }
            // Başarılı olursa görsel geri bildirim (Titreme efekti vs. eklenebilir ama basit tutuyoruz)
        } catch (err) {
            console.error("Auto place hatası:", err);
            alert("Otomatik yerleştirme başarısız oldu. Geoguessr kodu değiştirmiş olabilir.");
        }
    }

    // --- ORTAK FONKSİYONLAR ---

    function actionToggle() {
        if (isMarkerVisible) {
            if(customOverlay) customOverlay.setVisible(false);
            isMarkerVisible = false;
        } else {
            if (lockedCoordinates.lat === null) {
                if (latestDetectedCoordinates.lat === null) {
                    alert('Koordinat bulunamadı.');
                    return;
                }
                lockedCoordinates.lat = latestDetectedCoordinates.lat;
                lockedCoordinates.lng = latestDetectedCoordinates.lng;
            }
            createOrUpdateOnMapMarker();
            if(customOverlay) customOverlay.setVisible(true);
            isMarkerVisible = true;
        }
    }

    function actionLockAndShow() {
        if (latestDetectedCoordinates.lat === null) {
            alert('Henüz koordinat verisi yakalanmadı!');
            return;
        }
        lockedCoordinates.lat = latestDetectedCoordinates.lat;
        lockedCoordinates.lng = latestDetectedCoordinates.lng;
        createOrUpdateOnMapMarker();
        if(customOverlay) customOverlay.setVisible(true);
        isMarkerVisible = true;
    }

    // --- KLAVYE KONTROLLERİ (Sadece PC için eskiler) ---
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'Insert') actionToggle();
        if (e.key.toLowerCase() === 'q') actionLockAndShow();
        // İsteğin üzerine: Bu fonksiyona klavye kısayolu eklemedim.
    });

    // --- MOBİL ARAYÜZ ---
    function createMobileControls() {
        if (document.getElementById('mobile-cheat-controls')) return;

        const container = document.createElement('div');
        container.id = 'mobile-cheat-controls';

        // 1. Buton: Lock (Q Tuşu Görevi)
        const btnLock = document.createElement('div');
        btnLock.className = 'cheat-btn';
        btnLock.innerHTML = '📍';
        btnLock.title = "Görsel İşaretle (Q)";
        btnLock.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            actionLockAndShow();
        });

        // 2. Buton: Toggle (Insert Tuşu Görevi)
        const btnToggle = document.createElement('div');
        btnToggle.className = 'cheat-btn';
        btnToggle.innerHTML = '👁️';
        btnToggle.title = "Görseli Gizle/Aç";
        btnToggle.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            actionToggle();
        });

        // 3. YENİ BUTON: Auto Place 
        const btnPlace = document.createElement('div');
        btnPlace.className = 'cheat-btn btn-place'; // Buna özel renk verdik
        btnPlace.innerHTML = '🎯'; // Hedef ikonu
        btnPlace.title = "Haritaya Otomatik İşaretle (Guess Hazırla)";
        btnPlace.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            // Bu fonksiyon direkt haritaya tıklama simülasyonu yapar
            autoPlaceMarkerOnGameMap();
        });

        container.appendChild(btnLock);
        container.appendChild(btnToggle);
        container.appendChild(btnPlace); // En alta ekledik
        document.body.appendChild(container);
    }

    // Yükleme
    window.addEventListener('load', createMobileControls);
    setTimeout(createMobileControls, 2000);

})();