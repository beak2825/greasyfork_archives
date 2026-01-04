// ==UserScript==
// @name         WME QuickStreets TJ
// @namespace    https://greasyfork.org/users/1457324
// @version      1.4
// @description  Quick buttons for road settings in WME.
// @author       Honkson
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKICA8IS0tIE91dGVyIGNpcmNsZSBib3JkZXIgLS0+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIHN0cm9rZT0iI0Q3MjY2MCIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgoKICA8IS0tIFJvYWQgd2l0aCBzbW9vdGhlciBwZXJzcGVjdGl2ZSBhbmQgc3VidGxlIHNoYWRpbmcgLS0+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InJvYWRTaGFkZSIgeDE9IjMyIiB5MT0iMTIiIHgyPSIzMiIgeTI9IjUyIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzJCQTRCOCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxRDZFN0EiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIENlbnRlciByb2FkIHNoYXBlIC0tPgogIDxwYXRoIGQ9Ik0yNCAxMiBMNDAgMTIgTDQ4IDUyIEwxNiA1MiBaIiBmaWxsPSJ1cmwoI3JvYWRTaGFkZSkiLz4KCiAgPCEtLSBMYW5lIGRpdmlkZXIgKHJvdW5kZWQgZGFzaGVzKSAtLT4KICA8cGF0aCBkPSJNMzIgMTQgTDMyIDUwIgogICAgICAgIHN0cm9rZT0id2hpdGUiCiAgICAgICAgc3Ryb2tlLXdpZHRoPSIyIgogICAgICAgIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICAgICAgICBzdHJva2UtZGFzaGFycmF5PSI1IDYiLz4KCjwvc3ZnPgo=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557060/WME%20QuickStreets%20TJ.user.js
// @updateURL https://update.greasyfork.org/scripts/557060/WME%20QuickStreets%20TJ.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // inject custom css for quick buttons container and buttons
    const style = document.createElement('style');
    style.textContent = `
  #quick-prop-buttons {
    display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px;
    max-width: 330px; background: none; overflow: visible;
  }
  #quick-prop-buttons .toolbar-button-wrapper {
    flex: 0 0 42px; max-width: 42px; min-width: 0; height: 28px;
    display: flex; align-items: center; justify-content: center;
  }
  #quick-prop-buttons button.custom-btn {
    width: 38px; height: 24px;
    font-size: 11px; font-weight: 600; padding: 0 1.5px;
    text-align: center; display: flex; align-items: center; justify-content: center;
    border-radius: 10px; border: 1px solid black; cursor: pointer; user-select: none;
    color: #374151; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: background-color 0.15s, box-shadow 0.15s;
    text-shadow:
      -1px 0 #fff,
       1px 0 #fff,
       0 -1px #fff,
       0  1px #fff;
  }
  .btn-street      { background-color: #fff;    color: #374151; }
  .btn-ps          { background-color: #ffea3f; color: #78350f; }
  .btn-major       { background-color: #2292a4; color: #fff; }
  .btn-minor       { background-color: #618b4a; color: #fff; }
  .btn-freeway     { background-color: #d72660; color: #fff; }
  .btn-ramp        { background-color: #bdbdbd; color: #333; }
  .btn-parking     { background-color: #585858; color: #fff; }
  .btn-private     { background-color: #ffe066; color: #916700; }
  .btn-offroad     { background-color: #a0522d; color: #fff; }
  .btn-narrow      { background-color: #001f4d; color: #fff; }
  .btn-others      { background-color: #808080; color: #fff; }
  #quick-prop-buttons button.custom-btn:hover {
    filter: brightness(92%);
  }
  `;
    document.head.appendChild(style);

    // SDK instance, wait for SDK initialization first
    const getSdk = async () => {
        if (!window.SDK_INITIALIZED || !window.getWmeSdk)
            throw new Error('Missing WME SDK initialization');
        await window.SDK_INITIALIZED;
        const sdk = await window.getWmeSdk({ scriptId: 'WMEQuickStreets', scriptName: 'WME QuickStreets' });
        if (!sdk)
            throw new Error('Failed to get SDK instance');
        return sdk;
    };

    // Helper: get or create empty city placeholder ("No City")
    const getEmptyCity = (sdk) => {
        const topCountry = sdk.DataModel.Countries.getTopCountry();
        if (!topCountry) return null;
        return sdk.DataModel.Cities.getCity({ countryId: topCountry.id, cityName: '' }) ||
            sdk.DataModel.Cities.addCity({ countryId: topCountry.id, cityName: '' });
    };

    // Helper: get or create empty street placeholder ("No Street")
    const getEmptyStreet = (sdk, cityId) => {
        if (!cityId) return null;
        return sdk.DataModel.Streets.getStreet({ cityId: cityId, streetName: '' }) ||
            sdk.DataModel.Streets.addStreet({ cityId: cityId, streetName: '' });
    };

    // get all directly connected segments (both directions)
    const getConnectedSegmentIDs = (segmentId, sdk) => {
        const segs = ['true', 'false']
        .flatMap(direction => sdk.DataModel.Segments.getConnectedSegments({ segmentId, reverseDirection: direction === 'true' }))
        .map(s => s.id);
        return [...new Set(segs)];
    };

    // search connected segments recursively for first segment with address
    const getFirstConnectedSegmentAddress = (segmentId, sdk) => {
        const checked = new Set();
        const toCheck = [segmentId];
        while (toCheck.length) {
            const currentId = toCheck.pop();
            checked.add(currentId);
            const connected = getConnectedSegmentIDs(currentId, sdk);
            const foundId = connected.find(id => {
                const addr = sdk.DataModel.Segments.getAddress({ segmentId: id });
                return addr && (!addr.isEmpty);
            });
            if (foundId !== undefined) {
                return sdk.DataModel.Segments.getAddress({ segmentId: foundId });
            }
            connected.forEach(id => {
                if (!checked.has(id) && !toCheck.includes(id)) toCheck.push(id);
            });
        }
        return null;
    };

    // copy address from connected segment if rules allow

    const copyAddressIfEmpty = async (segmentId, sdk) => {
        const getEmptyCity = () => {
            const topCountry = sdk.DataModel.Countries.getTopCountry();
            if (!topCountry) return null;
            return (
                sdk.DataModel.Cities.getCity({ countryId: topCountry.id, cityName: '' }) ||
                sdk.DataModel.Cities.addCity({ countryId: topCountry.id, cityName: '' })
            );
        };

        const getEmptyStreet = (cityId) => {
            if (!cityId) return null;
            return (
                sdk.DataModel.Streets.getStreet({ cityId: cityId, streetName: '' }) ||
                sdk.DataModel.Streets.addStreet({ cityId: cityId, streetName: '' })
            );
        };

        const getFirstConnectedSegmentAddress = (segId) => {
            const checked = new Set();
            const toCheck = [segId];

            while (toCheck.length) {
                const currentId = toCheck.pop();
                checked.add(currentId);

                const connectedSegs = [
                    ...sdk.DataModel.Segments.getConnectedSegments({ segmentId: currentId, reverseDirection: false }),
                    ...sdk.DataModel.Segments.getConnectedSegments({ segmentId: currentId, reverseDirection: true }),
                ];

                for (const seg of connectedSegs) {
                    if (checked.has(seg.id)) continue;
                    const addr = sdk.DataModel.Segments.getAddress({ segmentId: seg.id });
                    if (addr && !addr.isEmpty) return addr;
                    toCheck.push(seg.id);
                }
            }
            return null;
        };

        // Fetch segment safely
        const segment = sdk.DataModel.Segments.getById({ segmentId });

        if (!segment) {
            console.warn(`Segment with ID ${segmentId} not found.`);
            return false;
        }

        // Avoid processing if segment already has primaryStreetId set
        if (segment.attributes && segment.attributes.primaryStreetId != null) {
            return false; // No update necessary
        }

        const address = sdk.DataModel.Segments.getAddress({ segmentId });
        if (address && !address.isEmpty) {
            return false; // Address already present
        }

        const connectedAddress = getFirstConnectedSegmentAddress(segmentId);

        if (!connectedAddress) {
            console.warn(`No connected address found for segment ${segmentId}.`);
            return false; // Nothing to copy from
        }

        // Get city from connected address or fallback
        let city = null;
        if (connectedAddress.city && connectedAddress.city.id) {
            city = sdk.DataModel.Cities.getById({ cityId: connectedAddress.city.id });
        }
        if (!city) {
            city = getEmptyCity();
            if (!city) {
                console.error("Could not find or create an empty city.");
                return false;
            }
        }

        // Get street ID from connected address or fallback
        let streetId = connectedAddress.primaryStreetId ?? null;
        if (!streetId) {
            const emptyStreet = getEmptyStreet(city.id);
            if (!emptyStreet) {
                console.error("Could not find or create an empty street.");
                return false;
            }
            streetId = emptyStreet.id;
        }

        const updateData = {
            segmentId,
            cityId: city.id,
            primaryStreetId: streetId,
            alternateStreetIds: [],
        };

        try {
            await sdk.DataModel.Segments.updateAddress(updateData);
            return true;
        } catch (error) {
            console.error("Failed to update segment address:", error);
            return false;
        }
    };

    // Sync ui toggle checkbox state based on desired state
    const syncToggleUIToggle = (openPanel, dataTestId, desired) => {
        if (!openPanel) return;
        const chip = openPanel.querySelector(`wz-checkable-chip[data-testid="${dataTestId}"]`);
        if (!chip) return;
        const isChecked = chip.hasAttribute('checked');
        if ((desired && !isChecked) || (!desired && isChecked)) {
            chip.click();
        }
    };

    // Detect if segment properties need updating
    const propsChanged = (segment, updateData) => {
        return ['roadType', 'fwdSpeedLimit', 'revSpeedLimit', 'lockRank', 'unpaved', 'headlights'].some(
            key => segment[key] !== updateData[key]
        );
    };

    // Apply button props to selected segments, copy address first
    const applyProperties = async (props) => {
        const sdk = await getSdk();
        const selection = sdk.Editing.getSelection();
        if (!selection || selection.objectType !== 'segment' || !selection.ids.length) {
            console.log('No segment selected or invalid selection');
            return;
        }
        const openPanel = document.querySelector('#segment-edit-general');

        for (const segmentId of selection.ids) {
            // NEW: Handle city clearing explicitly if cityId specified
            if (props.cityId !== undefined) {
                // Get/create empty city for "None"
                const emptyCity = getEmptyCity(sdk);
                if (!emptyCity) {
                    console.warn(`No empty city available for ${segmentId}`);
                    continue;
                }

                // Get/create empty street for the empty city
                const emptyStreet = getEmptyStreet(sdk, emptyCity.id);
                if (!emptyStreet) {
                    console.warn(`No empty street available for ${segmentId}`);
                    continue;
                }

                const updateData = {
                    segmentId,
                    cityId: emptyCity.id,  // Empty city ID (not null)
                    primaryStreetId: emptyStreet.id,  // Empty street ID (not null)
                    alternateStreetIds: []
                };
                try {
                    await sdk.DataModel.Segments.updateAddress(updateData);
                    console.log(`Set city to None for ${segmentId}`);
                } catch (e) {
                    console.warn(`Failed to update city for ${segmentId}:`, e);
                }
            } else {
                // Keep existing copy address logic for non-city buttons
                await copyAddressIfEmpty(segmentId, sdk);
            }

            const segment = sdk.DataModel.Segments.getById({ segmentId });
            const updateData = { segmentId };

            if (props.roadType !== undefined) updateData.roadType = props.roadType;
            if (props.speedLimit !== undefined) {
                updateData.fwdSpeedLimit = props.speedLimit;
                updateData.revSpeedLimit = props.speedLimit;
            }
            if (props.lockRank !== undefined && props.lockRank >= segment.lockRank) {
                updateData.lockRank = props.lockRank;
            }
            if (props.unpaved !== undefined) updateData.unpaved = props.unpaved;
            if (props.headlights !== undefined) updateData.headlights = props.headlights;

            if (propsChanged(segment, updateData)) {
                try {
                    await sdk.DataModel.Segments.updateSegment(updateData);
                } catch (e) {
                    console.warn(`Failed to update segment ${segmentId}:`, e.message);
                }
            } else {
                console.log(`No change detected for segment ${segmentId}. Skipping update.`);
            }

            syncToggleUIToggle(openPanel, 'unpavedCheckbox', props.unpaved);
            syncToggleUIToggle(openPanel, 'headlightsCheckbox', props.headlights);

            await new Promise(r => setTimeout(r, 150));
        }
    };

    // Create a quickly reusable button dom element with label and props
    const createButton = (label, props) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'toolbar-button-wrapper';
        const btn = document.createElement('button');
        btn.className = `custom-btn ${props.btnClass || 'btn-others'}`;
        btn.textContent = label;
        btn.addEventListener('click', () => applyProperties(props));
        wrapper.appendChild(btn);
        return wrapper;
    };

    // insert buttons container and buttons before main ui pane
    const insertButtons = async () => {
        const targetSelector = 'div.vstackContainer--Goqgu';
        const target = document.querySelector(targetSelector) || await new Promise(resolve => {
            const intervalId = setInterval(() => {
                const el = document.querySelector(targetSelector);
                if (el) {
                    clearInterval(intervalId);
                    resolve(el);
                }
            }, 300);
        });

        let container = document.getElementById('quick-prop-buttons');
        if (!container) {
            container = document.createElement('div');
            container.id = 'quick-prop-buttons';
            target.parentNode.insertBefore(container, target);
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.gap = '6px';
            container.style.marginBottom = '10px';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'flex-start';
        } else {
            container.innerHTML = '';
        }

        // define buttons with props and colors
        const buttons = [
            { label: 'St60*', roadType: 1, speedLimit: 60, lockRank: 0, unpaved: true, btnClass: 'btn-street' },
            { label: 'St60', roadType: 1, speedLimit: 60, lockRank: 0, unpaved: false, btnClass: 'btn-street' },
            { label: 'St90', roadType: 1, speedLimit: 90, lockRank: 0, cityId: true, unpaved: false, btnClass: 'btn-street' },
            { label: 'PS60', roadType: 2, speedLimit: 60, lockRank: 2, unpaved: false, btnClass: 'btn-ps' },
            { label: 'PS90', roadType: 2, speedLimit: 90, lockRank: 2, cityId: true, unpaved: false, btnClass: 'btn-ps' },
            { label: 'mH60', roadType: 7, speedLimit: 60, lockRank: 2, unpaved: false, btnClass: 'btn-minor' },
            { label: 'mH90', roadType: 7, speedLimit: 90, lockRank: 2, cityId: true, unpaved: false, btnClass: 'btn-minor' },
            { label: 'MH60', roadType: 6, speedLimit: 60, lockRank: 3, unpaved: false, btnClass: 'btn-major' },
            { label: 'MH90', roadType: 6, speedLimit: 90, lockRank: 3, cityId: true, unpaved: false, btnClass: 'btn-major' },
            { label: 'OFF60', roadType: 8, speedLimit: 60, lockRank: 0, unpaved: false, btnClass: 'btn-offroad' },
            { label: 'OFF90', roadType: 8, speedLimit: 90, lockRank: 0, cityId: true, unpaved: false, btnClass: 'btn-offroad' },
            { label: 'PR20', roadType: 17, speedLimit: 20, lockRank: 0, unpaved: false, btnClass: 'btn-private' },
            { label: 'PLR10', roadType: 20, speedLimit: 10, lockRank: 0, unpaved: false, btnClass: 'btn-parking' }
        ];

        buttons.forEach(props => container.appendChild(createButton(props.label, props)));
    };

    // init the buttons on dom ready and monitor for dynamic reloads
    const init = () => {
        insertButtons();
        const observer = new MutationObserver(() => {
            if (!document.getElementById('quick-prop-buttons') && document.querySelector('div.vstackContainer--Goqgu')) {
                insertButtons();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();