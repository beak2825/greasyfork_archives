// ==UserScript==
// @name         123
// @namespace    http://tampermonkey.net/
// @version      70.3
// @description  DOĞRU API - Harita Etkileşimli
// @author       Ferres
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552925/123.user.js
// @updateURL https://update.greasyfork.org/scripts/552925/123.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Değişkenler ---
    let currentRoundCoordinates = { lat: null, lng: null };
    let lastKnownCoordinates = { lat: null, lng: null };

    // --- SENİN VERDİĞİN MANTIKLA AĞI DİNLEME ---
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // Sadece bu iki, en önemli ve doğru sonucu veren API adresini dinle.
        if (method.toUpperCase() === 'POST' &&
            (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
             url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

            this.addEventListener('load', function () {
                try {
                    const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
                    // Gelen yanıtta koordinat varsa al. Yoksa hata verir, catch bloğu yakalar.
                    const match = this.responseText.match(pattern);
                    if (match && match.length > 0) {
                        const coords = match[0].split(",");
                        const lat = Number.parseFloat(coords[0]);
                        const lng = Number.parseFloat(coords[1]);

                        // Yakalanan en son doğru konumu değişkene yaz.
                        currentRoundCoordinates.lat = lat;
                        currentRoundCoordinates.lng = lng;

                        // Yeni koordinat geldiğinde otomatik güncelle
                        if (lastKnownCoordinates.lat !== lat || lastKnownCoordinates.lng !== lng) {
                            lastKnownCoordinates.lat = lat;
                            lastKnownCoordinates.lng = lng;

                            // Harita açıksa otomatik güncelle
                            if (mapInitialized && window.geoguessrMapInfo && window.geoguessrMapInfo.mapContainer.style.display !== 'none') {
                                showLocation();
                            }
                        }
                    }
                } catch(e) {
                    // Hata olursa (örn. yanıtta koordinat yoksa) görmezden gel, program çökmesin.
                }
            });
        }
        // Diğer tüm isteklerin orijinal şekilde çalışmasına izin ver.
        return originalOpen.apply(this, arguments);
    };


    // --- Arayüz (Harita etkileşimli yapıldı) ---
    let mapInitialized = false;
    function setupMapOnce() {
        if (mapInitialized) return;
        mapInitialized = true;
        GM_addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
            @keyframes rgb-text-animation { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
            #ferres-map-container { position: fixed; top: 10%; left: 70%; width: 470px; height: 380px; min-width: 300px; min-height: 200px; z-index: 20000; background-color: #f0f0f0; border-top: none; border-left: 5px solid #5a009c; border-right: 5px solid #5a009c; border-bottom: 5px solid #5a009c; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.6); display: none; font-family: sans-serif; pointer-events: none; }
            #ferres-map-header { width: 100%; padding: 6px 0; background-color: #5a009c; text-align: center; font-family: 'Orbitron', sans-serif; font-size: 1.3em; cursor: move; user-select: none; border-top-left-radius: 4px; border-top-right-radius: 4px; color: #ff00de; animation: rgb-text-animation 5s linear infinite; pointer-events: auto; }
            #location-iframe { width: 100%; height: calc(100% - 42px); border: none; pointer-events: auto; }
            .resizer { position: absolute; background: transparent; z-index: 15; pointer-events: auto; } .resizer.top-left { top: -8px; left: -8px; width: 16px; height: 16px; cursor: nwse-resize; } .resizer.top-right { top: -8px; right: -8px; width: 16px; height: 16px; cursor: nesw-resize; } .resizer.bottom-left { bottom: -8px; left: -8px; width: 16px; height: 16px; cursor: nesw-resize; } .resizer.bottom-right { bottom: -8px; right: -8px; width: 16px; height: 16px; cursor: nwse-resize; } .resizer.top { top: -5px; left: 16px; right: 16px; height: 10px; cursor: ns-resize; } .resizer.bottom { bottom: -5px; left: 16px; right: 16px; height: 10px; cursor: ns-resize; } .resizer.left { left: -5px; top: 16px; bottom: 16px; width: 10px; cursor: ew-resize; } .resizer.right { right: -5px; top: 16px; bottom: 16px; width: 10px; cursor: ew-resize; }
        `);
        const mapContainer = document.createElement('div'); mapContainer.id = 'ferres-map-container';
        const header = document.createElement('div'); header.id = 'ferres-map-header'; header.textContent = 'Ahraaareee';
        const iframe = document.createElement('iframe'); iframe.id = 'location-iframe';
        mapContainer.appendChild(header); mapContainer.appendChild(iframe); document.body.appendChild(mapContainer);
        window.geoguessrMapInfo = { mapContainer, iframe };
        dragElement(mapContainer, header); makeResizable(mapContainer);
    }

    function dragElement(elmnt, header) {
        let p1=0,p2=0,p3=0,p4=0;
        header.onmousedown=e=>{
            e.preventDefault();
            e.stopPropagation();
            p3=e.clientX;
            p4=e.clientY;
            const mouseup=()=>{
                document.removeEventListener('mouseup',mouseup);
                document.removeEventListener('mousemove',mousemove);
            };
            const mousemove=e=>{
                e.preventDefault();
                e.stopPropagation();
                p1=p3-e.clientX;
                p2=p4-e.clientY;
                p3=e.clientX;
                p4=e.clientY;
                elmnt.style.top=(elmnt.offsetTop-p2)+"px";
                elmnt.style.left=(elmnt.offsetLeft-p1)+"px";
            };
            document.addEventListener('mousemove',mousemove);
            document.addEventListener('mouseup',mouseup);
        };
    }

    function makeResizable(el) {
        const directions = ['top-left','top-right','bottom-left','bottom-right','top','bottom','left','right'];

        directions.forEach(dir => {
            const resizer = document.createElement('div');
            resizer.className = `resizer ${dir}`;
            el.appendChild(resizer);

            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;

            const startResize = (e) => {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10);
                startLeft = el.offsetLeft;
                startTop = el.offsetTop;

                document.addEventListener('mousemove', doResize);
                document.addEventListener('mouseup', stopResize);
                e.preventDefault();
                e.stopPropagation();
            };

            const doResize = (e) => {
                if (!isResizing) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // Bottom resize
                if (dir.includes('bottom')) {
                    const newHeight = startHeight + dy;
                    if (newHeight >= 200) {
                        el.style.height = newHeight + 'px';
                    }
                }

                // Top resize
                if (dir.includes('top')) {
                    const newHeight = startHeight - dy;
                    if (newHeight >= 200) {
                        el.style.height = newHeight + 'px';
                        el.style.top = (startTop + dy) + 'px';
                    }
                }

                // Right resize
                if (dir.includes('right')) {
                    const newWidth = startWidth + dx;
                    if (newWidth >= 300) {
                        el.style.width = newWidth + 'px';
                    }
                }

                // Left resize
                if (dir.includes('left')) {
                    const newWidth = startWidth - dx;
                    if (newWidth >= 300) {
                        el.style.width = newWidth + 'px';
                        el.style.left = (startLeft + dx) + 'px';
                    }
                }

                e.preventDefault();
            };

            const stopResize = () => {
                isResizing = false;
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
            };

            resizer.addEventListener('mousedown', startResize);
        });
    }

    function showLocation() {
        if (!mapInitialized || !window.geoguessrMapInfo) return;
        const { iframe } = window.geoguessrMapInfo;
        if (currentRoundCoordinates.lat !== null) {
            const { lat, lng } = currentRoundCoordinates;
            const zoomOffset = 3.0; // Ülkeyi görecek kadar geniş bir zoom
            iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-zoomOffset},${lat-zoomOffset},${lng+zoomOffset},${lat+zoomOffset}&layer=mapnik&marker=${lat},${lng}`;
        } else {
            alert('Henüz konum alınamadı. Turun başlamasını bekleyin.');
        }
    }

    function toggleMap() {
        if (!mapInitialized) setupMapOnce();
        window.geoguessrMapInfo.mapContainer.style.display = window.geoguessrMapInfo.mapContainer.style.display === 'none' ? 'block' : 'none';
    }

    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'Insert') toggleMap();
        if (e.key.toLowerCase() === 'q' && mapInitialized && window.geoguessrMapInfo.mapContainer.style.display !== 'none') {
            showLocation();
        }
    });

})();