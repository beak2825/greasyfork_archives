// ==UserScript==
// @name         Govmap to WME
// @description  Shows a Waze icon in Govmap page. When clicked, opens WME on the same Govmap location, zoom and language.
// @namespace    https://greasyfork.org/users/gad_m/govmap_to_wme
// @version      1.0.1
// @author       gad_m
// @license      MIT
// @include      /^https:\/\/www.govmap.gov.il\/*/
// @icon         data:image/png;base64,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
// @require      https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.2/proj4.js
// @downloadURL https://update.greasyfork.org/scripts/563224/Govmap%20to%20WME.user.js
// @updateURL https://update.greasyfork.org/scripts/563224/Govmap%20to%20WME.meta.js
// ==/UserScript==

/* global proj4 */

(function () {
    'use strict';

    function waitForUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                callback(currentUrl);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    function getMapParams() {
        let locationHref = location.href;
        console.debug('govmap-to-wme: getMapParam() href: ' + locationHref);
        const params = new URL(locationHref).searchParams;
        const [x, y] = params.get('c').split(',').map(Number);
        const zoom = Number(params.get("z")) + 7; // Govmap zoom to WME zoom adjustment
        console.log('govmap-to-wme: getMapParam() x: ' + x); // 226077.94
        console.log('govmap-to-wme: getMapParam() y: ' + y); // 669570.72
        console.log('govmap-to-wme: getMapParam() zoomLevel: ' + zoom);
        if (x && y) {
            let [lon, lat] = proj4("EPSG:2039", "EPSG:4326", [x, y]);
            lat = parseFloat(lat).toFixed(5);
            lon = parseFloat(lon).toFixed(5);
            const langMatch = location.href.match(/[?&]hl=([a-zA-Z-]+)/);
            const lang = langMatch ? langMatch[1] : 'en';

            return {
                lat,
                lon,
                zoomLevel: zoom,
                lang,
                env: 'il' // force Israeli WME
            };
        } else {
            return null;
        }
    }

    function createWazeButton() {
        const btn = document.createElement('img');
        btn.src = "data:image/png;base64,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"

        Object.assign(btn.style, {
            position: 'fixed',
            top: '15px',
            left: '300px',
            width: '36px',
            height: '36px',
            padding: '6px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            zIndex: '2147483647',
            userSelect: 'none',
        });
        btn.title = 'Open in WME';

        btn.addEventListener('click', () => {
            const params = getMapParams();
            console.log('govmap-to-wme: params:', params);
            if (params) {
                const { lat, lon , zoomLevel, lang} = params;
                const wmeUrl = `https://www.waze.com/${lang}/editor?env=il&lon=${lon}&lat=${lat}&zoomLevel=${zoomLevel}`;
                window.open(wmeUrl, '_blank');
            } else {
                alert('Could not extract location from URL.');
            }
        });

        document.body.appendChild(btn);
    }

    function init() {
        console.log('govmap-to-wme: init');
        proj4.defs("EPSG:2039", "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-24.0024,-17.1032,-17.8444,-0.33077,-1.85269,1.66969,5.4248 +units=m +no_defs");
        createWazeButton();
        waitForUrlChange(() => {
            // Optional: update button state or behavior if needed
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
