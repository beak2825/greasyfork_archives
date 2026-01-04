// ==UserScript==
// @name         WME Overlay HR maps
// @namespace    https://waze.com
// @version      1.3
// @description  WME overlay for HR, based on WME Map Overlay script
// @match         https://www.waze.com/*editor*
// @grant         none
// @require       https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license       MIT
// @author        makunasis
// @downloadURL https://update.greasyfork.org/scripts/560670/WME%20Overlay%20HR%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/560670/WME%20Overlay%20HR%20maps.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let sliderContainer, isSliderVisible = false;
    let wazeLiveLayer, googleBaseLayer, osmLayer, trafficLayerRef, bingTrafficLayer;

    function initOverlay() {
        if (typeof W === 'undefined' || typeof W.map === 'undefined' || !WazeWrap.Ready) {
            setTimeout(initOverlay, 1000);
            return;
        }

        const mapElement = document.getElementById('map');
        if (!mapElement) {
            setTimeout(initOverlay, 1000);
            return;
        }

        if (document.getElementById('wme-overlay-hr-btn')) return;

        const map = W.map;

        googleBaseLayer = new OpenLayers.Layer.XYZ("Google Maps", 
            "https://mt${s}.google.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}", 
            { 
                isBaseLayer: false, 
                opacity: 0.0, 
                visibility: true,
                serverResolutions: [156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875, 305.7481130859375, 152.87405654296875, 76.43702827148438, 38.21851413574219, 19.109257067871094, 9.554628533935547, 4.777314266967773, 2.3886571334838865, 1.1943285667419433, 0.5971642833709716, 0.2985821416854858],
                transitionEffect: 'resize',
                buffer: 0,
                getURL: function (bounds) {
                    let res = this.getServerResolution();
                    let x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                    let y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                    let z = this.getServerZoom();
                    let s = Math.abs(x + y) % 4;
                    return this.url.replace("${s}", s).replace("${x}", x).replace("${y}", y).replace("${z}", z);
                }
            }
        );

        osmLayer = new OpenLayers.Layer.XYZ("OpenStreetMap", "https://tile.openstreetmap.org/${z}/${x}/${y}.png", { isBaseLayer: false, opacity: 0.0, visibility: true });
        wazeLiveLayer = new OpenLayers.Layer.XYZ("Waze Live Map", "https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png", { isBaseLayer: false, opacity: 0.0, visibility: true });
        trafficLayerRef = new OpenLayers.Layer.XYZ("Google Traffic", "https://mt1.google.com/vt?lyrs=h@159000000,traffic&hl=en&x=${x}&y=${y}&z=${z}", { isBaseLayer: false, opacity: 0.0, visibility: true });

        bingTrafficLayer = new OpenLayers.Layer.XYZ("Bing Satellite",
            "https://ecn.t${s}.tiles.virtualearth.net/tiles/h${quadkey}.jpeg?g=12361&mkt=en-hr&shading=hill&stl=h&trfc=1&it=G,L,TR&n=z",
            {
                isBaseLayer: false,
                opacity: 0.0,
                visibility: true,
                sphericalMercator: true,
                getURL: function (bounds) {
                    let res = this.getServerResolution();
                    let x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                    let y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                    let z = this.getServerZoom();
                    let quadKey = "";
                    for (let i = z; i > 0; i--) {
                        let digit = 0; let mask = 1 << (i - 1);
                        if ((x & mask) !== 0) digit++;
                        if ((y & mask) !== 0) digit += 2;
                        quadKey += digit;
                    }
                    let s = Math.abs(x + y) % 8;
                    return this.url.replace("${s}", s).replace("${quadkey}", quadKey);
                }
            }
        );

        map.addLayers([wazeLiveLayer, osmLayer, googleBaseLayer, trafficLayerRef, bingTrafficLayer]);

        sliderContainer = document.createElement("div");
        sliderContainer.id = 'wme-overlay-hr-container';
        Object.assign(sliderContainer.style, {
            position: "absolute", top: "70px", left: "50%", transform: "translateX(-50%)",
            zIndex: "9999", padding: "8px", background: "rgba(10, 25, 50, 0.95)",
            borderRadius: "10px", border: "1px solid #444", display: "none",
            flexDirection: "row", gap: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            maxWidth: "98vw", overflowX: "auto", whiteSpace: "nowrap"
        });

        const items = [
            { name: "Waze Live", label: "Waze Live", icon: "https://www.waze.com/favicon.ico", layer: wazeLiveLayer },
            { name: "OSM", label: "OSM", icon: "https://www.openstreetmap.org/favicon.ico", layer: osmLayer },
            { name: "Google", label: "GoogleMaps", icon: "https://www.google.com/favicon.ico", layer: googleBaseLayer },
            { name: "Traffic", label: "Promet/Mjesta", icon: "https://i.ibb.co/rK09xy0d/traffic-layer.jpg", layer: trafficLayerRef },
            { name: "BingTraffic", label: "Bing", icon: "https://www.bing.com/sa/simg/favicon-2x.ico", layer: bingTrafficLayer },
            { name: "Mapillary", label: "Mapillary", icon: "https://play-lh.googleusercontent.com/z3qzEc13E2sDWky9LgqADojcdy8hrX_szuAAeX21k_dFe7GNXLIYXJtOu5RcE3_5Jz8", isJumpOnly: true },
            { name: "AppleMaps", label: "AppleMaps", icon: "https://www.apple.com/favicon.ico", isJumpOnly: true },
            { name: "HAK", label: "HAK", icon: "https://map.hak.hr/favicon.ico", isJumpOnly: true },
            { name: "Kamere", label: "Kamere", icon: "https://cdn-icons-png.flaticon.com/512/4144/4144933.png", isJumpOnly: true }
        ];

        items.forEach(item => {
            const wrapper = document.createElement("div");
            Object.assign(wrapper.style, {
                display: "inline-flex", flexDirection: "column", alignItems: "center",
                gap: "3px", width: "70px", flexShrink: "0"
            });

            const img = document.createElement("img");
            img.src = item.icon;
            img.onerror = function() {
                this.src = "https://www.waze.com/favicon.ico";
                this.onerror = null;
            };
            Object.assign(img.style, { 
                width: "40px", height: "40px", borderRadius: "6px", border: "1px solid white", 
                cursor: "pointer", backgroundColor: "white", objectFit: "contain", flexShrink: "0",
                padding: "4px"
            });

            img.onclick = () => {
                const center = W.map.getCenter();
                const zoom = W.map.getZoom();
                const projSrc = new OpenLayers.Projection("EPSG:900913");
                const projDest = new OpenLayers.Projection("EPSG:4326");
                const lonlat = new OpenLayers.LonLat(center.lon, center.lat).transform(projSrc, projDest);
                const lat = parseFloat(lonlat.lat.toFixed(6));
                const lon = parseFloat(lonlat.lon.toFixed(6));

                if (item.name === "Google") window.open(`https://www.google.com/maps/@${lat},${lon},${zoom}z`, '_blank');
                if (item.name === "OSM") window.open(`https://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`, '_blank');
                if (item.name === "Mapillary") window.open(`https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=${zoom}`, '_blank');
                if (item.name === "AppleMaps") window.open(`https://lookmap.eu.pythonanywhere.com/#c=${zoom}/${lat}/${lon}`, '_blank');
                if (item.name === "HAK") window.open(`https://map.hak.hr/?lang=hr&z=${zoom}&c=${lat},${lon}`, '_blank');
                if (item.name === "Kamere") window.open(`https://www.google.com/maps/d/u/0/viewer?mid=1W8NNPa3GwVfPZnGRlu-ZNlTJUrJYbmDi&ll=${lat},${lon}&z=${zoom}`, '_blank');
                if (item.name === "Waze Live") window.open(`https://www.waze.com/live-map/directions?latlng=${lat}%2C${lon}&zoom=${zoom}`, '_blank');
                if (item.name === "BingTraffic") window.open(`https://www.bing.com/maps/traffic?v=2&FORM=Trafi2&cp=${lat}~${lon}&lvl=${zoom}&sty=h&form=LMLTEW&style=h`, '_blank');
            };

            wrapper.appendChild(img);
            const textLabel = document.createElement("div");
            textLabel.textContent = item.label;
            Object.assign(textLabel.style, { fontSize: "9px", color: "white", fontWeight: "bold", textAlign: "center", width: "100%", overflow: "hidden" });
            wrapper.appendChild(textLabel);

            if (!item.isJumpOnly) {
                const slider = document.createElement("input");
                slider.type = "range"; slider.min = "0"; slider.max = "1"; slider.step = "0.05"; slider.value = "0";
                slider.style.width = "60px";
                slider.style.height = "4px";
                slider.oninput = () => {
                    const val = parseFloat(slider.value);
                    item.layer.setOpacity(val);
                    if (val > 0) {
                        item.layer.setVisibility(true);
                        item.layer.redraw();
                    } else {
                        item.layer.setVisibility(false);
                    }
                };
                wrapper.appendChild(slider);
            } else {
                const spacer = document.createElement("div");
                spacer.style.height = "16px";
                wrapper.appendChild(spacer);
            }
            sliderContainer.appendChild(wrapper);
        });

        const toggleBtn = document.createElement("button");
        toggleBtn.id = 'wme-overlay-hr-btn';
        toggleBtn.textContent = "Overlay HR";
        Object.assign(toggleBtn.style, {
            position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)",
            zIndex: "9999", padding: "5px 12px", backgroundColor: "#0074D9", color: "white",
            border: "1px solid white", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "12px"
        });

        toggleBtn.onclick = () => {
            isSliderVisible = !isSliderVisible;
            sliderContainer.style.display = isSliderVisible ? "flex" : "none";
        };

        mapElement.appendChild(toggleBtn);
        mapElement.appendChild(sliderContainer);
    }

    setTimeout(initOverlay, 3000);
})();