// ==UserScript==
// @name         WME RO Alt Names + Traffic
// @namespace    https://greasyfork.org/users/1457324
// @version      1.4
// @description  Converts Romanian street abbreviations to full names as alternate streets + Google Traffic overlay toggle in WME
// @author       Honkson
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIyIj48L2NpcmNsZT4KCiAgPCEtLSBUaGljayByb2FkIC0tPgogIDxyZWN0IHg9IjIyIiB5PSIxMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjQwIiByeD0iMTAiIGZpbGw9IiMwMDAwMDAiPjwvcmVjdD4KCiAgPCEtLSBEYXNoZXMgLS0+CiAgPGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+CiAgICA8bGluZSB4MT0iMzIiIHkxPSIxOCIgeDI9IjMyIiB5Mj0iMjUiPjwvbGluZT4KICAgIDxsaW5lIHgxPSIzMiIgeTE9IjMwIiB4Mj0iMzIiIHkyPSIzNyI+PC9saW5lPgogICAgPGxpbmUgeDE9IjMyIiB5MT0iNDIiIHgyPSIzMiIgeTI9IjQ5Ij48L2xpbmU+CiAgPC9nPgoKICA8IS0tIFJPIHRleHQgLS0+CiAgPHRleHQgeD0iMzIiIHk9IjU4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iOTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZpbGw9IiNkYzI2MjYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwLjciPlJPPC90ZXh0Pgo8L3N2Zz4K
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/557414/WME%20RO%20Alt%20Names%20%2B%20Traffic.user.js
// @updateURL https://update.greasyfork.org/scripts/557414/WME%20RO%20Alt%20Names%20%2B%20Traffic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let wmeSDK;
    let trafficLayer;
    let trafficBtn;

    unsafeWindow.SDK_INITIALIZED.then(initScript);

    function initScript() {
        wmeSDK = getWmeSdk({
            scriptId: 'wme-ro-alt-traffic',
            scriptName: 'WME RO Alt+Traffic',
        });
        bootstrap();
    }

    function bootstrap() {
        if (!document.getElementById('edit-panel') || !wmeSDK.DataModel.Countries.getTopCountry()) {
            setTimeout(bootstrap, 250);
            return;
        }
        if (wmeSDK.State.isReady) {
            initAltButtons();
        } else {
            wmeSDK.Events.once({ eventName: 'wme-ready' }).then(initAltButtons);
        }
    }

    function initAltButtons() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    const addressEdit = node.querySelector('.address-edit');
                    if (!addressEdit) continue;

                    if (addressEdit.parentNode.querySelector('[data-alt-traffic-container="true"]')) {
                        continue;
                    }

                    const btnContainer = document.createElement('div');
                    btnContainer.setAttribute('data-alt-traffic-container', 'true');
                    btnContainer.style.display = 'flex';
                    btnContainer.style.gap = '6px';
                    btnContainer.style.marginBottom = '6px';

                    const baseStyle = `
                    padding: 4px 10px;
                    font-size: 11px;
                    height: 26px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                    transition: background 0.15s ease, transform 0.05s ease;
                `;


                const altBtn = document.createElement('button');
                altBtn.type = 'button';
                altBtn.textContent = 'ALT NAME';
                altBtn.style.cssText = baseStyle + `
                    background: #3b82f6;   /* blue-500 */
                    color: #ffffff;
                `;
                altBtn.addEventListener('click', addAltStreetName);

                trafficBtn = document.createElement('button');
                trafficBtn.type = 'button';
                trafficBtn.textContent = 'TRAFFIC OFF';
                trafficBtn.style.cssText = baseStyle + `
                    background: #6b7280;   /* gray-500 */
                    color: #ffffff;
                `;
                trafficBtn.addEventListener('click', toggleTrafficLayer);

                btnContainer.appendChild(altBtn);
                btnContainer.appendChild(trafficBtn);

                addressEdit.parentNode.insertBefore(btnContainer, addressEdit);
            }
        }
    });

       observer.observe(document.getElementById('edit-panel'), {
           childList: true,
           subtree: true
       });
   }



    function addAltStreetName() {
        const selection = wmeSDK.Editing.getSelection();
        if (!selection || selection.objectType !== 'segment') {
            alert('Please select a segment first.');
            return;
        }

        const addedAltNames = [];

        selection.ids.forEach(segId => {
            const seg = wmeSDK.DataModel.Segments.getById({ segmentId: segId });
            if (!seg || !seg.primaryStreetId) return;

            const primaryStreet = wmeSDK.DataModel.Streets.getById({ streetId: seg.primaryStreetId });
            if (!primaryStreet || !primaryStreet.name) return;

            const name = primaryStreet.name.trim();
            let altName = null;

            if (/^Str\.\s*/i.test(name)) {
                altName = name.replace(/^Str\.\s*/i, "Strada ");
            }
            else if (/^Int\.\s*/i.test(name)) {
                altName = name.replace(/^Int\.\s*/i, "Intrarea ");
            }
            else {
                let match = name.match(/^(D[JCN]\d+[A-Z]?)\s*-\s*(Str\.\s*.+)/i);
                if (match) altName = match[2].replace(/^Str\.\s*/i, "Strada ");

                match = name.match(/^(DN\d+[A-Z]?)\s*-\s*(Șos\.\s*.+)/i);
                if (match) altName = match[2].replace(/^Șos\.\s*/i, "Șoseaua ");
            }

            if (!altName) return;

            const cityId = primaryStreet.cityId;
            let altStreet = wmeSDK.DataModel.Streets.getStreet({ cityId, streetName: altName });
            if (!altStreet) altStreet = wmeSDK.DataModel.Streets.addStreet({ cityId, streetName: altName });

            let altIds = seg.alternateStreetIds || [];
            if (!altIds.includes(altStreet.id)) {
                altIds = [...altIds, altStreet.id];
                wmeSDK.DataModel.Segments.updateAddress({
                    segmentId: segId,
                    primaryStreetId: primaryStreet.id,
                    alternateStreetIds: altIds
                });
                addedAltNames.push(altName);
            }
        });

        if (addedAltNames.length > 0) {
            const namesList = addedAltNames.join('<br>');
            if (WazeWrap?.Alerts) {
                WazeWrap.Alerts.success('Alt Street Names Added', namesList);
            } else {
                alert('Added alt names:\n' + addedAltNames.join('\n'));
            }
        }
    }

    function toggleTrafficLayer(event) {
        if (!W || !W.map) return;

        if (!trafficLayer) {
            trafficLayer = new OpenLayers.Layer.XYZ(
                "Google Traffic",
                "https://mt1.google.com/vt?lyrs=h@159000000,traffic&hl=en&x=${x}&y=${y}&z=${z}",
                { isBaseLayer: false, opacity: 0.9, visibility: false }
            );
            W.map.addLayer(trafficLayer);
        }

        const isVisible = trafficLayer.getVisibility();
        trafficLayer.setVisibility(!isVisible);

        if (!isVisible) {
            trafficBtn.textContent = 'Google Traffic ON';
        } else {
            trafficBtn.textContent = 'Google Traffic OFF';
        }
    }


})();