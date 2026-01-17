// ==UserScript==
// @name            WME Address Manager
// @namespace       00000123456789
// @author          MyvdSTg0X0
// @copyright       2026 MyvdSTg0X0
// @license         All Rights Reserved
// @version         1.01.00
// @description     Script qui permet de modifier facilement l'adresse des RPP ou POI sur le WME.
//
// @grant           GM_addStyle
//
// @match           https://*.waze.com/*/editor*
// @exclude         https://*.waze.com/*/user*
//
// @downloadURL https://update.greasyfork.org/scripts/562949/WME%20Address%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/562949/WME%20Address%20Manager.meta.js
// ==/UserScript==

(() => {
    'use strict';

    GM_addStyle(`
    #me--edit-window {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        width: 1000px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        z-index: 999999;
        border-radius: 10px;
    }

    #me--top-bar {
        background-color: #ccc;
        border-radius: 10px 10px 0 0;
        cursor: move;
        display: flex;
        flex-direction: row-reverse;
    }

    #me--close {
        font-size: 20px;
        padding: 5px;
        width: fit-content;
        cursor: pointer;
        border-radius: 0 10px 0 0;
    }

    #me--close:hover {
        background-color: #f00;
        color: #fff;
    }

    #me--window-content {
        display: flex;
        gap: 25px;
        padding: 25px;
    }

    #me--list-venue {
        overflow: auto;
        height: 540px;
    }

    #me--list-filter {
        padding: 20px 15px 0 15px;
    }

    #me--window-edit {
        padding: 25px;
        border: 1px solid rgb(230 230 230);
        border-radius: 10px;
        display: flex;
        gap: 8px;
        flex-direction: column;
        height: fit-content;
    }

    .me--button {
        background: #0099ff;
        color: #ffffff;
        border-radius: 20px;
        height: 40px;
        border: none;
        padding: 12px;
        font-weight: bold;
        display: flex;
        align-items: center;
        margin-top: 14px;
        margin-left: auto;
    }

    .me--button:hover {
        background: #0585dc;
    }

    .me--button:active {
        background: #0a71b7;
    }

    .me--input-name {
        font-weight: 500;
        font-size: 12px;
        margin-bottom: 8px;
    }

    .me--input-num {
        color: #72767d;
        text-align: end;
        font-size: 12px;
        margin-top: 8px;
        padding: 0 16px;
    }

    .me--edit-input {
        padding: 0 16px;
        background-color: #f2f4f7;
        border-radius: 6px;
        border: none;
        height: 40px !important;
        outline: none;
    }

    .me--adresse {
        display: flex;
        gap: 25px;
        cursor: pointer;
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        align-items: center;
        justify-content: space-between;
    }

    .me--adresse:hover {
        background-color: #f5f5f5;
    }

    #me--window-list{
        border: 1px solid rgb(230 230 230);
        border-radius: 10px;
        width: 100%;
    }
`);

    let wmeSDK, toEditRppId = [], toEditRppAddress = [];
    const $id = $ => document.getElementById($);

    unsafeWindow.SDK_INITIALIZED.then(() => {
        wmeSDK = getWmeSdk({ scriptId: "WME_AddressManager", scriptName: "Address Manager" });

        wmeSDK.Shortcuts.createShortcut({
            callback: () => wmeSDK.Map.drawPolygon().then((p) => addWindow(p)),
            description: "Sélectionner des lieux",
            shortcutId: "am_venue_selection",
            shortcutKeys: "C+Q"
        })
    });

    function addWindow(poly) {
        if ($id('me--edit-window')) return;

        const div = document.createElement('div');
        div.id = "me--edit-window"
        div.innerHTML = `
            <div id="me--top-bar"><i class="w-icon w-icon-x" id="me--close" aria-hidden="true"></i></div>
            <div id="me--window-content">
                <div id="me--window-list">
                    <div id="me--list-filter">
                    <span id="me--sel-counter">0 : sélectionné</span>
                        <input type="checkbox" id="me--filter-poi" checked>POI</input>
                        <input type="checkbox" id="me--filter-rpp" checked>RPP</input>
                        <input type="checkbox" id="me--filter-pic" checked>Avec Photo</input>
                        <input type="checkbox" id="me--filter-nopic" checked>Sans Photo</input>
                    </div>
                    <hr>
                    <div id="me--list-venue"></div>
                </div>
                <div id="me--window-edit">
                    <div>
                        <div class="me--input-name">Rue</div>
                        <input class="me--edit-input" type="text">
                        <div id="me--street-input-num" class="me--input-num">/ 100</div>
                    </div>
                    <div>
                        <div class="me--input-name">Numéro de rue</div>
                        <input class="me--edit-input" type="text">
                        <div id="me--number-input-num" class="me--input-num">/ 20</div>
                    </div>
                    <div>
                        <div class="me--input-name">Ville</div>
                        <input class="me--edit-input" type="text">
                        <div id="me--city-input-num" class="me--input-num">/ 100</div>
                    </div>
                    <div>
                        <div class="me--input-name">État</div>
                        <input class="me--edit-input" type="text" style="cursor: no-drop;color: #afafaf;" disabled>
                        <div id="me--state-input-num" class="me--input-num">/ 100</div>
                    </div>
                    <div>
                        <div class="me--input-name">Pays</div>
                        <input class="me--edit-input" type="text" style="cursor: no-drop;color: #afafaf;" disabled>
                        <div id="me--country-input-num" class="me--input-num">/ 100</div>
                    </div>
                    <button class="me--button" id="me--save-change">Appliquer</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);
        $id('me--close').addEventListener('click', () => { div.remove(); toEditRppId = []; toEditRppAddress = [] });

        (() => { // Rend la fenêtre déplacable
            let isDragging, offsetX, offsetY;

            $id('me--top-bar').addEventListener('mousedown', (e) => {
                isDragging = true;

                const rect = div.getBoundingClientRect();

                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                div.style.transform = 'none';
                div.style.left = rect.left + 'px';
                div.style.top = rect.top + 'px';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                div.style.left = e.clientX - offsetX + 'px';
                div.style.top = e.clientY - offsetY + 'px';
            });

            document.addEventListener('mouseup', () => isDragging = false);

        })();

        (() => { // maj de la longueur des inputs
            const maxValues = [100, 20, 100, 100, 100];
            const inputs = document.querySelectorAll('.me--edit-input');
            const counters = document.querySelectorAll('.me--input-num');

            inputs.forEach((input, index) => {
                input.addEventListener('input', () => {
                    if (counters[index]) counters[index].innerText = `${input.value.length} / ${maxValues[index]}`;
                });
            });
        })();

        function updateInputs() {
            const inputs = document.querySelectorAll('#me--window-edit input');

            if (!toEditRppAddress.length) {
                inputs.forEach(input => input.value = "");
                return;
            }

            const fields = ["street", "houseNumber", "city", "state", "country"];

            fields.forEach((field, index) => {
                const values = toEditRppAddress.map(addr => addr[field]);
                const unique = [...new Set(values)];

                inputs[index].value = unique.length === 1 ? unique[0] : "Multiple";
            });
        }

        (() => { // gestion filtres
            ["poi", "rpp"].forEach(el => {
                const checkbox = document.getElementById("me--filter-" + el);

                checkbox.addEventListener("change", (e) => {
                    document.querySelectorAll(".me--adresse").forEach(ee => {
                        if (ee.getAttribute("type") === el) {
                            ee.style.display = e.target.checked ? "flex" : "none";
                        }
                    });
                });
            });
        })();

        (() => { // gestion filtres 2
            ["pic", "nopic"].forEach(el => {
                const checkbox = document.getElementById("me--filter-" + el);

                checkbox.addEventListener("change", (e) => {
                    document.querySelectorAll(".me--adresse").forEach(ee => {
                        if (ee.getAttribute("pic") === el) {
                            ee.style.display = e.target.checked ? "flex" : "none";
                        }
                    });
                });
            });
        })();

        wmeSDK.DataModel.Venues.getAll().forEach((el) => {
            if (!inPoly(el.geometry.coordinates, poly.coordinates[0])) return;

            const venue = wmeSDK.DataModel.Venues.getAddress({ venueId: el.id });
            const address = document.createElement("div");
            address.id = `me--adresse_${el.id}`;
            address.className = "me--adresse";

            const selRpp = {
                residence: el.isResidential ?? "",
                image: el.images[0]?.url ?? "",
                houseNumber: venue.houseNumber ?? "",
                street: venue.street?.name ?? "",
                city: venue.city?.name ?? "",
                state: venue.state?.name ?? "",
                country: venue.country?.name ?? ""
            };

            Object.values(selRpp).forEach((value, i) => {
                if (i === 6) return
                if (i === 0) {
                    const url = "https://web-assets.waze.com/webapps/wme/v2.331-11-gf9507e2eb9-20260107095304-production/font/";
                    const img = document.createElement("img");
                    img.src = value ? url + "6597bd1b89e9a7c1/residential.svg" : url + "c9b8c03d5bb4723d/location.svg";
                    img.height = 25;
                    img.style.pointerEvents = "none";
                    address.setAttribute("type", value ? "rpp" : "poi");
                    address.append(img);
                }

                if (i === 1) {
                    const img = document.createElement("img");
                    img.src = value;
                    img.height = 25;
                    img.style.pointerEvents = "none";
                    address.setAttribute("pic", value ? "pic" : "nopic");
                    address.append(img);
                }

                if (i !== 0 && i !== 1) {
                    const span = document.createElement("span");
                    span.innerText = value;
                    span.style.pointerEvents = "none";
                    span.style.textAlign = "center";
                    address.append(span);
                }
            });

            address.addEventListener("click", () => {
                toEditRppId.includes(el.id) ? toEditRppId.splice(toEditRppId.indexOf(el.id), 1) : toEditRppId.push(el.id);
                const exists = toEditRppAddress.some(addr =>
                    addr.residence === selRpp.residence &&
                    addr.image === selRpp.image &&
                    addr.houseNumber === selRpp.houseNumber &&
                    addr.street === selRpp.street &&
                    addr.city === selRpp.city &&
                    addr.state === selRpp.state &&
                    addr.country === selRpp.country
                );

                if (exists) {
                    toEditRppAddress = toEditRppAddress.filter(addr =>
                        !(
                            addr.residence === selRpp.residence &&
                            addr.image === selRpp.image &&
                            addr.houseNumber === selRpp.houseNumber &&
                            addr.street === selRpp.street &&
                            addr.city === selRpp.city &&
                            addr.state === selRpp.state &&
                            addr.country === selRpp.country)
                    );
                } else toEditRppAddress.push(selRpp);

                document.querySelectorAll(".me--adresse").forEach(div => {
                    const divId = div.id.replaceAll("me--adresse_", "");
                    Object.assign(div.style, toEditRppId.includes(divId)
                        ? { backgroundColor: "#09f", fontStyle: "italic", color: "#fff" }
                        : { backgroundColor: null, fontStyle: null, color: null });
                });
                updateInputs();
                document.getElementById("me--sel-counter").innerText = `${toEditRppId.length} : ${toEditRppId.length > 0 ? "sélectionnés" : "sélectionné"}`;
            });

            address.addEventListener("dblclick", () => wmeSDK.Editing.setSelection({ selection: { ids: [el.id], objectType: "venue" } }));

            $id("me--list-venue").append(address);
        });

        function updateVenue() {
            const inputsSet = document.querySelectorAll('#me--window-edit input');
            const streetSet = inputsSet[0].value;
            const citySet = inputsSet[2].value;

            toEditRppId.forEach(venueId => {
                const address = wmeSDK.DataModel.Venues.getAddress({ venueId });
                const citySDK = wmeSDK.DataModel.Cities;
                const streetSDK = wmeSDK.DataModel.Streets;

                // City
                let newCity = citySDK.getCity({ cityName: citySet, countryId: 73, stateId: address.state.id });
                if (!newCity) newCity = citySDK.addCity({ cityName: citySet, countryId: 73, stateId: address.state.id });

                // Street
                let newStreet = streetSDK.getStreet({ cityId: newCity.id, streetName: streetSet });
                if (!newStreet) newStreet = streetSDK.addStreet({ cityId: newCity.id, streetName: streetSet });

                wmeSDK.DataModel.Venues.updateAddress({ streetId: newStreet.id, venueId });
            });
        }

        const applyBtn = document.getElementById('me--save-change');
        if (applyBtn) applyBtn.addEventListener('click', updateVenue);
    }

    function inPoly(point, vs, mode = "some") {
        const isPoint = !Array.isArray(point[0]);

        if (!isPoint) {
            const bools = point.map((p) => inPoly(p, vs, mode));
            return mode === "every" ? bools.every(Boolean) : bools.some(Boolean);
        }

        const x = point[0],
            y = point[1];
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            const xi = vs[i][0],
                yi = vs[i][1];
            const xj = vs[j][0],
                yj = vs[j][1];

            const intersect =
                yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }
        return inside;
    }
})();