// ==UserScript==
// @name         12333
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  3333
// @author       You
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552928/12333.user.js
// @updateURL https://update.greasyfork.org/scripts/552928/12333.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Değişkenler ---
    // Gördüğümüz en son koordinat (sürekli güncellenir)
    let latestDetectedCoordinates = { lat: null, lng: null };
    // Kullanıcının tuşa basarak sabitlediği koordinat
    let lockedCoordinates = { lat: null, lng: null };
    let lastUrl = window.location.href;

    // --- Marker Değişkenleri ---
    let mapInstance = null;
    let customOverlay = null;
    let isMarkerVisible = false;

    // --- CSS Stilleri ---
    GM_addStyle(`
        .custom-marker { position: absolute; width: 40px; height: 40px; margin-left: -20px; margin-top: -20px; z-index: 1000; pointer-events: none; }
        .custom-marker-dot { position: absolute; top: 12px; left: 12px; width: 16px; height: 16px; background: #FF0000; border: 2px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.7); }
        .custom-marker-cross::before, .custom-marker-cross::after { content: ''; position: absolute; background: rgba(255, 255, 255, 0.7); box-shadow: 0 0 3px rgba(0,0,0,0.7); }
        .custom-marker-cross::before { left: 19px; top: 0; width: 2px; height: 40px; }
        .custom-marker-cross::after { left: 0; top: 19px; width: 40px; height: 2px; }
    `);

    // --- AĞI DİNLEME (SADECE KAYDET, KİLİTLEME YOK) ---
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
                        const lat = Number.parseFloat(coords[0]);
                        const lng = Number.parseFloat(coords[1]);

                        // KİLİTLEME YOK. Sadece en son gördüğümüz koordinatı kaydet.
                        latestDetectedCoordinates.lat = lat;
                        latestDetectedCoordinates.lng = lng;
                    }
                } catch(e) {}
            });
        }
        return originalOpen.apply(this, arguments);
    };

    // --- YENİ TUR ALGILAMA (TAM SIFIRLAMA) ---
    new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (currentUrl.includes("/game/")) {
                console.log("Yeni tur algılandı. Tüm koordinatlar ve marker sıfırlanıyor.");
                // Her şeyi temizle
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


    // --- MARKER YÖNETİM FONKSİYONLARI ---

    function findMapInstance() {
        if (mapInstance) return;
        try {
            let element = document.querySelector('[class^="guess-map_canvas__"]');
            if (!element) return;
            const reactKey = Object.keys(element).find(key => key.startsWith("__reactFiber$"));
            mapInstance = element[reactKey].return.return.memoizedProps.map;
            if (mapInstance) console.log('Oyun haritası bulundu.');
        } catch (e) {}
    }

    function createOrUpdateOnMapMarker() {
        if (!mapInstance) findMapInstance();
        if (!mapInstance || lockedCoordinates.lat === null) return;

        if (customOverlay) customOverlay.setMap(null);

        class MarkerOverlay extends google.maps.OverlayView {
            constructor(position) { super(); this.position = position; this.div = null; }
            onAdd() { this.div = document.createElement('div'); this.div.className = 'custom-marker'; this.div.innerHTML = `<div class="custom-marker-dot"></div><div class="custom-marker-cross"></div>`; this.getPanes().overlayMouseTarget.appendChild(this.div); }
            draw() { if (!this.div) return; const point = this.getProjection().fromLatLngToDivPixel(this.position); if (point) { this.div.style.left = point.x + 'px'; this.div.style.top = point.y + 'px'; } }
            onRemove() { if (this.div) { this.div.parentNode.removeChild(this.div); this.div = null; } }
            setVisible(visible) { if (this.div) this.div.style.display = visible ? 'block' : 'none'; }
        }

        const position = new google.maps.LatLng(lockedCoordinates.lat, lockedCoordinates.lng);
        customOverlay = new MarkerOverlay(position);
        customOverlay.setMap(mapInstance);
        console.log(`Marker, kilitli koordinata göre oluşturuldu: ${lockedCoordinates.lat}, ${lockedCoordinates.lng}`);
    }

    // --- KONTROLLER ---
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // --- 'Insert' Tuşu: Göster / Gizle ---
        if (e.key === 'Insert') {
            if (isMarkerVisible) {
                if(customOverlay) customOverlay.setVisible(false);
                isMarkerVisible = false;
            } else {
                // Eğer bu tur için daha önce hiç koordinat kilitlenmemişse, kilitle.
                if (lockedCoordinates.lat === null) {
                    if (latestDetectedCoordinates.lat === null) {
                        alert('Henüz koordinat algılanmadı. Lütfen biraz bekleyin veya haritada gezinin.');
                        return;
                    }
                    lockedCoordinates.lat = latestDetectedCoordinates.lat;
                    lockedCoordinates.lng = latestDetectedCoordinates.lng;
                    console.log(`'Insert' ile ilk koordinat kilitlendi.`);
                }
                // Artık kilitli bir koordinat olduğuna göre marker'ı oluştur/göster.
                createOrUpdateOnMapMarker();
                if(customOverlay) customOverlay.setVisible(true);
                isMarkerVisible = true;
            }
        }

        // --- 'Q' Tuşu: Mevcut Konumu Kilitle ve Göster/Yenile ---
        if (e.key.toLowerCase() === 'q') {
            if (latestDetectedCoordinates.lat === null) {
                alert('Henüz kilitlenecek bir koordinat algılanmadı!');
                return;
            }
            // 'Q' tuşu, o anki en son koordinatı alır ve kilitler.
            lockedCoordinates.lat = latestDetectedCoordinates.lat;
            lockedCoordinates.lng = latestDetectedCoordinates.lng;
            console.log(`'Q' ile koordinat kilitlendi/yenilendi.`);

            // Ve marker'ı bu yeni kilitli konuma göre oluşturup gösterir.
            createOrUpdateOnMapMarker();
            if(customOverlay) customOverlay.setVisible(true);
            isMarkerVisible = true;
        }
    });

})();