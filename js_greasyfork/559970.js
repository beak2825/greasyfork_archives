// ==UserScript==
// @name         WME HN2RPP UK
// @namespace    tbrks
// @version      0.0.1
// @description  Convert house numbers to RPPs on classified roads (UK only)
// @author       tbrks
// @license      MIT
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559970/WME%20HN2RPP%20UK.user.js
// @updateURL https://update.greasyfork.org/scripts/559970/WME%20HN2RPP%20UK.meta.js
// ==/UserScript==

(function () {
    const classifiedRegex = /[AB]\d{1,4}(?: \([A-Z]+\))?\s?-?\s?/;

    let sdk;
    let selection;

    window.SDK_INITIALIZED.then(initScript);

    function initScript() {
        sdk = window.getWmeSdk({ scriptId: 'hn2rpp-uk', scriptName: 'WME HN2RPP UK' });

        sdk.Sidebar.registerScriptTab().then((r) => {
            r.tabLabel.innerHTML = "HN2RPP";
            r.tabPane.innerHTML = `<div><button id="hn2rpp-convert">Convert HNs to RPPs</button></div>`;
            $('#hn2rpp-convert').on('click', convert);
        });

        sdk.Events.on({
            eventName: "wme-selection-changed",
            eventHandler: () => {
                const sel = sdk.Editing.getSelection();
                if (sel?.objectType === 'segment') {
                    selection = sel;
                } else {
                    selection = null;
                }
            }
        });
    }

    async function convert() {
        if (selection === null) {
            alert('Select some segments');
            return;
        }

        const segments = getSegments(selection.ids);
        const hns = await sdk.DataModel.HouseNumbers.fetchHouseNumbers({ segmentIds: selection.ids });

        hns.forEach(hn => {
            const streetId = getStreetIdFromSegment(segments[hn.segmentId]);
            if (streetId) {
                const rppId = sdk.DataModel.Venues.addVenue({ category: 'RESIDENTIAL', geometry: hn.geometry });
                sdk.DataModel.Venues.updateAddress({ venueId: rppId.toString(), houseNumber: hn.number, streetId: streetId })
                sdk.DataModel.HouseNumbers.deleteHouseNumber({ houseNumberId: hn.id });
            }
        });
    }

    function getSegments(ids) {
        return Object.fromEntries(
            ids.map(id => [id, sdk.DataModel.Segments.getById({ segmentId: id })])
        );
    }

    /**
     * If street name matches classified regex, create a new street and return it.
     * Otherwise, return the existing street ID.
     */
    function getStreetIdFromSegment(segment) {
        const street = sdk.DataModel.Streets.getById({ streetId: segment.primaryStreetId });
        if (!street) {
            console.log('no street?');
            return null;
        }

        if (!classifiedRegex.test(street.name)) {
            // only allow script to work on classified roads
            return null;
            // console.log('street ok', segment.primaryStreetId);
            // return segment.primaryStreetId;
        }

        const newName = street.name.replace(classifiedRegex, '');
        const existingStreet = sdk.DataModel.Streets.getStreet({ streetName: newName, cityId: street.cityId });
        if (existingStreet) {
            console.log('street exists in data model', existingStreet.id);
            return existingStreet.id;
        }

        const newStreet = sdk.DataModel.Streets.addStreet({ streetName: newName, cityId: street.cityId });
        console.log('created new street', newStreet.id);
        return newStreet.id;
    }
})();
