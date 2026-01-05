// ==UserScript==
// @name         WME Closest Segments
// @namespace    https://greasyfork.org/
// @version      1.0.0
// @description  Tìm tên đường gần nhất của venue (Place) đang được chọn
// @author       Minh Tan
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/*user/editor*
// @grant        GM_xmlhttpRequest
// @grant        GM.setClipboard
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://update.greasyfork.org/scripts/389765/1090053/CommonUtils.js
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @require      https://update.greasyfork.org/scripts/450221/1691071/WME-Base.js
// @require      https://update.greasyfork.org/scripts/450320/1688694/WME-UI.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @downloadURL https://update.greasyfork.org/scripts/559338/WME%20Closest%20Segments.user.js
// @updateURL https://update.greasyfork.org/scripts/559338/WME%20Closest%20Segments.meta.js
// ==/UserScript==
/* global require */
/* global $, jQuery */
/* global I18n */
/* global WMEBase, WMEUI, WMEUIHelper, WMEUIHelperFieldset */
/* global Container, Settings, SimpleCache, Tools  */
/* global Node$1, Segment, Venue, VenueAddress, WmeSDK */
/* global W, WazeWrap, $, XLSX */
/* global turf */

(function() {
    'use strict';
    const NAME = 'ClosestSeg'
    const LOCALE = {
        240: {
            country: 'vn',
            language: 'en',
            locale: 'vi_VN'
        }
    }
    const SETTINGS = {
        options: {
            modal: true,
            transparent: false,
            entryPoint: true,
            lock: true,
        },
        ranges: {
            radius: 200,
            collapse: 3,
        },
        providers: {
            magic: true
        }
    }

    // Road Types
    //   I18n.translations.uk.segment.road_types
    //   I18n.translations.en.segment.road_types
    const TYPES = {
        street: 1,
        primary: 2,
        freeway: 3,
        ramp: 4,
        trail: 5,
        major: 6,
        minor: 7,
        offroad: 8,
        walkway: 9,
        boardwalk: 10,
        ferry: 15,
        stairway: 16,
        private: 17,
        railroad: 18,
        runway: 19,
        parking: 20,
        narrow: 22
    }
    const TRANSLATION = {
        'en': {
            title: 'Closest Segments',
            notFound: 'Not found',
            options: {
                title: 'Options',
                modal: 'Use modal window',
                transparent: 'Transparent modal window',
                entryPoint: 'Create Entry Point if not exists',
                lock: 'Lock POI to 2 level',
            },
            ranges: {
                title: 'Additional',
                radius: 'Radius for search',
                collapse: 'Collapse the lists longer than',
            },
            providers: {
                title: 'Providers',
                magic: 'Closest Segments',
            },
            questions: {
                changeName: 'Are you sure to change the name?',
                changeCity: 'Are you sure to change the city?',
                changeStreet: 'Are you sure to change the street name?',
                changeNumber: 'Are you sure to change the house number?',
                notFoundCity: 'City not found in the current location, are you sure to create a new one?',
                notFoundStreet: 'Street not found in the current location, are you sure to create a new one?'
            }
        }
    }
    WMEUI.addTranslation(NAME, TRANSLATION)
    const STYLE =
          '.form-group.closestseg .header h5 { padding: 16px 16px 0; font-size: 16px }' +
          '.form-group.closestseg .body { overflow-x: auto; max-height: 420px; padding: 4px 0; }' +
          '#venue-edit-general .closestseg fieldset { border: 0; padding: 0; margin: 0; }' +
          '#venue-edit-general .closestseg legend { width: 100%; text-align: left; }' +
          '#venue-edit-general .closestseg fieldset legend,        .wme-ui-panel.closestseg fieldset legend { cursor:pointer; font-size: 12px; font-weight: bold; margin: 0; padding: 0 8px; background-color: #f6f7f7; border: 1px solid #e5e5e5 }' +
          '#venue-edit-general .closestseg fieldset legend::after, .wme-ui-panel.closestseg fieldset legend::after { display: inline-block; text-rendering: auto; content: "↑"; float: right; font-size: 10px; line-height: inherit; position: relative; right: 3px; } ' +
          '#venue-edit-general .closestseg fieldset legend span,   .wme-ui-panel.closestseg fieldset legend span { font-weight: bold; background-color: #fff; border-radius: 5px; color: #ed503b; display: inline-block; font-size: 12px; line-height: 14px; max-width: 30px; padding: 1px 5px; text-align: center; } ' +
          '#venue-edit-general .closestseg fieldset ul,            .wme-ui-panel.closestseg fieldset ul { border: 1px solid #ddd; } ' +
          '#venue-edit-general .closestseg fieldset.collapsed ul,  .wme-ui-panel.closestseg fieldset.collapsed ul { display: none } ' +
          '#venue-edit-general .closestseg fieldset.collapsed legend::after, .wme-ui-panel.closestseg fieldset.collapsed legend::after { content: "↓" }' +
          '#venue-edit-general .closestseg ul, .wme-ui-panel.closestseg ul { padding: 8px; margin: 0 }' +
          '#venue-edit-general .closestseg li, .wme-ui-panel.closestseg li { padding: 0; margin: 0; list-style: none; margin-bottom: 2px }' +
          '#venue-edit-general .closestseg li a, .wme-ui-panel.closestseg li a { display: block; padding: 2px 4px; text-decoration: none; border: 1px solid #e4e4e4; }' +
          '#venue-edit-general .closestseg li a:hover, .wme-ui-panel.closestseg li a:hover { background: rgba(255, 255, 200, 1) }' +
          '#venue-edit-general .closestseg li a.nonumber, .wme-ui-panel.closestseg li a.nonumber { background: rgba(250, 250, 200, 0.5) }' +
          '#venue-edit-general .closestseg li a.nonumber:hover, .wme-ui-panel.closestseg li a.nonumber:hover { background: rgba(250, 250, 200, 1) }' +
          '#venue-edit-general .closestseg li a.noaddress, .wme-ui-panel.closestseg li a.noaddress { background: rgba(250, 200, 100, 0.5) }' +
          '#venue-edit-general .closestseg li a.noaddress:hover, .wme-ui-panel.closestseg li a.noaddress:hover { background: rgba(250, 200, 100, 1) }' +
          '.form-group.closestseg legend { cursor:pointer; font-size: 12px; font-weight: bold; width: auto; text-align: right; border: 0; margin: 0; padding: 0 8px; }' +
          '.form-group.closestseg fieldset { border: 1px solid #ddd; padding: 8px; }' +
          '.form-group.closestseg div.controls { padding: 8px; }' +
          '.form-group.closestseg div.controls:empty, #panel-container .archive-panel .body:empty { min-height: 20px; }' +
          '.form-group.closestseg div.controls:empty::after, #panel-container .archive-panel .body:empty::after { color: #ccc; padding: 0 8px; content: "' + I18n.t(NAME).notFound + '" }' +
          '.form-group.closestseg div.controls label { white-space: normal; font-weight: normal; margin-top: 5px; line-height: 18px; font-size: 13px; }' +
          '.form-group.closestseg div.controls input[type="text"] { float:right; }' +
          '.form-group.closestseg div.controls input[type="number"] { float:right; width: 60px; text-align:right; }' +
          '.distance-over-200 { background-color: #f08a24; }' +
          '.distance-over-1000 { background-color: #ed503b; }' +
          '.external-operational a.url { border: 4px solid #009900; border-radius: 50% }' +
          '.external-closed-temporarily a.url { border: 4px solid #ff7300; border-radius: 50%  }' +
          '.external-closed-permanently a.url { border: 4px solid #ff0000; border-radius: 50%  }' +
          'p.closestseg-info { border-top: 1px solid #ccc; color: #777; font-size: x-small; margin-top: 15px; padding-top: 10px; text-align: center; }' +
          '#sidebar p.closestseg-blue { background-color:#0057B8;color:white;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }' +
          '#sidebar p.closestseg-yellow { background-color:#FFDD00;color:black;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }'
    WMEUI.addStyle(STYLE)
    const layerConfig = {
        defaultRule: {
            styleContext: {
                label: (context) => {
                    const style = context?.feature?.properties?.style;
                    if (!style)
                        return style;
                    return style?.label;
                },
            },
            styleRules: [
                {
                    predicate: (properties) => properties.styleName === "styleNode",
                    style: {
                        pointRadius: 8,
                        fillOpacity: 0.5,
                        fillColor: '#fff',
                        strokeColor: '#fff',
                        strokeWidth: 2,
                        strokeLinecap: 'round',
                        graphicZIndex: 9999,
                    },
                },
                {
                    predicate: (properties) => properties.styleName === "styleLine",
                    style: {
                        strokeWidth: 4,
                        strokeColor: '#fff',
                        strokeLinecap: 'round',
                        strokeDashstyle: 'dash',
                        label: "${label}",
                        labelOutlineColor: '#000',
                        labelOutlineWidth: 3,
                        labelAlign: 'cm',
                        fontColor: '#fff',
                        fontSize: '24px',
                        fontFamily: 'Courier New, monospace',
                        fontWeight: 'bold',
                        labelYOffset: 24,
                        graphicZIndex: 9999,
                    }
                }
            ],
        },
    };
    let E50Instance, E50Cache
    class ClosestSeg extends WMEBase {
        constructor(name, settings) {
            super(name, settings)
            this.initHelper()
            this.initTab()
            this.initLayer()
        }
        initHelper() {
            this.helper = new WMEUIHelper(this.name)
            this.modal = this.helper.createModal(I18n.t(this.name).title)
            this.panel = this.helper.createPanel(I18n.t(this.name).title)
        }
        initTab() {
            let tab = this.helper.createTab(
                I18n.t(this.name).title,
                {
                    sidebar: this.wmeSDK.Sidebar,
                    image: GM_info.script.icon
                }
            )
            // Setup options
            /** @type {WMEUIHelperFieldset} */
            let fsOptions = this.helper.createFieldset(I18n.t(this.name).options.title)
            let options = this.settings.get('options')
            for (let item in options) {
                if (options.hasOwnProperty(item)) {
                    fsOptions.addCheckbox(
                        item,
                        I18n.t(this.name).options[item],
                        (event) => this.settings.set(['options', item], event.target.checked),
                        this.settings.get('options', item)
                    )
                }
            }
            tab.addElement(fsOptions)
            // Setup ranges
            /** @type {WMEUIHelperFieldset} */
            let fsRanges = this.helper.createFieldset(I18n.t(this.name).ranges.title)
            let ranges = this.settings.get('ranges')
            for (let item in ranges) {
                if (ranges.hasOwnProperty(item)) {
                    fsRanges.addNumber(
                        'settings-ranges-' + item,
                        I18n.t(NAME).ranges[item],
                        event => this.settings.set(['ranges', item], event.target.value),
                        this.settings.get('ranges', item),
                        (item === 'radius') ? 100 : 0,
                        (item === 'radius') ? 1000 : 10,
                        (item === 'radius') ? 50 : 1
                    )
                }
            }
            tab.addElement(fsRanges)
            tab.addText(
                'info',
                '<a href="' + GM_info.scriptUpdateURL + '">' + GM_info.script.name + '</a> ' + GM_info.script.version
            )
            tab.inject()
        }
        initLayer() {
            this.wmeSDK.Map.addLayer({
                layerName: this.name,
                styleRules: layerConfig.defaultRule.styleRules,
                styleContext: layerConfig.defaultRule.styleContext
            });
            // this.wmeSDK.LayerSwitcher.addLayerCheckbox({ name: this.name });
            this.wmeSDK.Map.setLayerZIndex({ layerName: this.name, zIndex: 9999 });
            this.wmeSDK.Map.setLayerVisibility({ layerName: this.name, visibility: false });
        }
        /**
         * Create the vector from the center of the selected POI to point by lon and lat
         * @param {Number} lon
         * @param {Number} lat
         */
        createVector(lon, lat) {
            let poi = this.getSelectedPOI()
            if (!poi) {
                return
            }
            const from = turf.centroid(poi.geometry)
            const to = turf.point([lon, lat], { styleName: "styleNode" }, { id: `node_${lon}_${lat}` });
            this.wmeSDK.Map.addFeatureToLayer({ layerName: this.name, feature: to });
            const lineCoordinates = [
                from.geometry.coordinates,
                to.geometry.coordinates,
            ];
            const distance = Math.round(turf.distance(to, from) * 1000)
            const label = (distance > 2000)
            ? (distance / 1000).toFixed(1) + 'km'
            : distance + 'm'
            // https://www.waze.com/editor/sdk/interfaces/index.SDK.FeatureStyle.html
            const line = turf.lineString(lineCoordinates, {
                styleName: "styleLine",
                style: {
                    label: label,
                },
            }, { id: `line_${lon}_${lat}` });
            this.wmeSDK.Map.addFeatureToLayer({ layerName: this.name, feature: line });
        }
        /**
         * Remove all vectors from the layer
         */
        removeVectors() {
            this.wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: this.name });
        }
        /**
         * Show the Layer
         */
        showLayer() {
            this.wmeSDK.Map.setLayerVisibility({ layerName: this.name, visibility: true });
        }
        /**
         * Hide the Layer
         */
        hideLayer() {
            this.wmeSDK.Map.setLayerVisibility({ layerName: this.name, visibility: false });
        }
        /**
         * Handler for `none.wme` event
         * @param {jQuery.Event} event
         * @return {Null}
         */
        onNone(event) {
            if (this.settings.get('options', 'modal')) {
                this.modal.html().remove()
            }
        }
        /**
         * Handler for `venue.wme` event
         *  - create and fill the modal panel
         *
         * @param {jQuery.Event} event
         * @param {HTMLElement} element
         * @param {Venue} model
         * @return {null|void}
         */
        onVenue(event, element, model) {
            let container, parent
            if (this.settings.get('options', 'modal')) {
                parent = this.modal.html()
                container = parent.querySelector('.wme-ui-body')
            } else {
                parent = this.panel.html()
                container = parent.querySelector('.controls')
            }
            // Clear container
            try {
                if (container)
                    while (container.hasChildNodes()) {
                        container.removeChild(container.lastChild)
                    }
            } catch (e) {
                console.error(e)
            }
            if (!model) {
                return
            }
            let feature = turf.centroid(model.geometry)
            let [lon, lat] = feature.geometry.coordinates;
            let providers = []
            let country = this.wmeSDK.DataModel.Countries.getTopCountry()?.id || 240
            let settings = LOCALE[country]
            this.group(
                '📍' + lon + ' ' + lat
            )
            let radius = this.settings.get('ranges', 'radius')
            if (this.settings.get('providers', 'magic')) {
                let Magic = new MagicProvider(container, settings)
                let providerPromise = Magic
                .search(lon, lat, radius)
                .then(() => Magic.render())
                .catch(() => this.log(':('))
                providers.push(providerPromise)
            }
            Promise
                .all(providers)
                .then(() => this.groupEnd())
            if (this.settings.get('options', 'modal')) {
                if (this.settings.get('options', 'transparent')) {
                    parent.style.opacity = '0.6'
                    parent.onmouseover = () => (parent.style.opacity = '1')
                    parent.onmouseout = () => (parent.style.opacity = '0.6')
                }
                this.modal.container().append(parent)
            } else {
                element.prepend(parent)
            }
        }
        /**
         * Get Selected Venue if it not the NATURAL_FEATURES
         * @return {null|Object}
         */
        getSelectedPOI() {
            let venue = this.getSelectedVenues().shift()
            if (!venue) {
                return null
            }
            let except = ['NATURAL_FEATURES']
            if (except.indexOf(venue.categories[0]) === -1) {
                return venue
            }
            return null
        }
        /**
        * Apply data to the current selected place
        * @param {Object} data
        */
        applyData(data) {
            let venue = this.getSelectedPOI()
            if (!this.wmeSDK.DataModel.Venues.hasPermissions({ venueId: venue.id })) {
                this.log('You don\'t have permissions to edit this venue')
                return
            }
            let address = this.wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id })
            let lat = parseFloat(data.lat)
            let lon = parseFloat(data.lon)
            if (isNaN(lat) || isNaN(lon)) {
                this.log('Invalid coordinates')
                return
            }
            this.group('Apply data to selected Venue ↓')
            let name = data.name ? data.name.trim() : ''
            let cityId = isNaN(parseInt(data.cityId)) ? null : parseInt(data.cityId)
            let cityName = data.cityName ? data.cityName.trim() : ''
            let streetId = isNaN(parseInt(data.streetId)) ? null : parseInt(data.streetId)
            let streetName = data.streetName ? data.streetName.trim() : ''
            let number = data.number ? data.number.trim() : ''
            // Apply new Name
            let newName
            // If exists, ask the user to replace it or not
            // If not exists - use name or house number as name
            if (venue.name) {
                this.log('The Venue has a Name «' + venue.name + '»')
                if (name && name !== venue.name) {
                    this.log('Replace a Venue Name with a new one?')
                    if (window.confirm(I18n.t(NAME).questions.changeName + '\n«' + venue.name + '» ⟶ «' + name + '»?')) {
                        newName = name
                        this.log(' — Yes, a new Venue Name is «' + newName + '»')
                    } else {
                        newName = venue.name
                        this.log(' — No, use a old Venue Name «' + newName + '»')
                    }
                } else if (number && number !== venue.name) {
                    this.log('Replace the Venue Name with a number?')
                    if (window.confirm(I18n.t(NAME).questions.changeName + '\n«' + venue.name + '» ⟶ «' + number + '»?')) {
                        newName = number
                        this.log(' — Yes, a new Venue Name is «' + newName + '»')
                    } else {
                        newName = venue.name
                        this.log(' — No, use a old Venue Name «' + newName + '»')
                    }
                }
            } else if (name) {
                newName = name
                this.log('Use a new Venue Name «' + newName + '»')
            } else if (number) {
                newName = number
                this.log('Use a new Venue Name «' + newName + '»')
                // Update alias for korpus
                if ((new RegExp('[0-9]+[а-яі]?к[0-9]+', 'i')).test(number)) {
                    let alias = number.replace('к', ' корпус ')
                    let aliases = venue.aliases?.slice() || []
                    if (aliases.indexOf(alias) === -1) {
                        aliases.push(alias)
                        this.log('Apply a new Venue Alias «' + alias + '»')
                        this.wmeSDK.DataModel.Venues.updateVenue({
                            venueId: venue.id,
                            aliases: aliases
                        })
                    }
                }
            }
            // Set only really new name
            if (newName && newName !== venue.name) {
                this.log('Apply a new Venue Name «' + newName + '»')
                this.wmeSDK.DataModel.Venues.updateVenue({
                    venueId: venue.id,
                    name: newName
                })
            }
            // Apply a City name
            if (!cityId && cityName) {
                this.log('We don\'t find a City with name «' + cityName + '», create a new one?')
                // Ask to create a new City
                if (window.confirm(I18n.t(NAME).questions.notFoundCity + '\n«' + cityName + '»?')) {
                    cityId = this.getCity(cityName).id
                    this.log(' — Yes, create new City «' + cityName + '»')
                } else {
                    cityId = this.getCity().id
                    this.log(' — No, use the empty City with ID «' + cityId + '»')
                }
            } else if (!cityId && !cityName) {
                cityId = this.getCity().id
                this.log('We don\'t find a City and use the empty City with ID «' + cityId + '»')
            }
            let city = this.getCityById(cityId)
            let newStreetId
            // Apply a new Street
            if (streetId && address.street
                && streetId !== address.street.id
                && '' !== address.street.name) {
                this.log('Replace the Street with a new one?')
                if (window.confirm(I18n.t(NAME).questions.changeStreet + '\n«' + address.street.name + '» ⟶ «' + streetName + '»?')) {
                    newStreetId = streetId
                    this.log(' — Yes, use a new Street Name «' + streetName + '»')
                } else {
                    this.log(' — No, use a old Street Name «' + address.street.name + '»')
                }
            } else if (streetId) {
                newStreetId = streetId
                this.log('Use a new Street with ID «' + newStreetId + '»')
            } else if (!streetId) {
                let street
                if (streetName) {
                    this.log('We don\'t find the street «' + streetName + '»')
                    this.log('Create a new Street?')
                    if (window.confirm(I18n.t(NAME).questions.notFoundStreet + '\n«' + streetName + '»?')) {
                        street = this.getStreet(city.id, streetName)
                        this.log(' — Yes, create a new Street «' + streetName + '»')
                    } else if ('' !== address.street?.name) {
                        street = this.wmeSDK.DataModel.Streets.getById({ streetId: address.street.id })
                        this.log(' — No, use the current Street «' + street.name + '»')
                    } else {
                        street = this.getStreet(city.id, '')
                        this.log(' — No, use the empty Street with ID «' + street.id + '»')
                    }
                } else {
                    this.log('We don\'t find the street')
                    street = this.getStreet(city.id, '')
                    this.log('Use the empty Street with ID «' + street.id + '»')
                }
                if (street.id !== address.street?.id && '' !== address.street?.name) {
                    this.log('Replace the Street with new one?')
                    if (window.confirm(I18n.t(NAME).questions.changeStreet + '\n«' + address.street.name + '» ⟶ «' + streetName + '»?')) {
                        newStreetId = street.id
                        this.log(' — Yes, use a new Street Name «' + streetName + '»')
                    } else {
                        this.log(' — No, use the current Street Name «' + address.street.name + '»')
                    }
                } else {
                    newStreetId = street.id
                }
            }
            if (newStreetId && newStreetId !== address.street?.id) {
                this.log('Apply a new Street ID «' + newStreetId + '»')
                this.wmeSDK.DataModel.Venues.updateAddress({
                    venueId: venue.id,
                    streetId: newStreetId
                })
            }
            let newHouseNumber
            // Apply a House Number
            if (number) {
                if (address.houseNumber) {
                    this.log('Replace the House Number with a new one?')
                    if (address.houseNumber !== number &&
                        window.confirm(I18n.t(NAME).questions.changeNumber + '\n«' + address.houseNumber + '» ⟶ «' + number + '»?')) {
                        newHouseNumber = number
                        this.log(' — Yes, use a new House Number «' + number + '»')
                    } else {
                        this.log(' — No, use the current House Number «' + address.houseNumber + '»')
                    }
                } else {
                    newHouseNumber = number
                    this.log('Use a new House Number «' + number + '»')
                }
            }
            if (newHouseNumber) {
                this.log('Apply a new House Number «' + newHouseNumber + '»')
                this.wmeSDK.DataModel.Venues.updateAddress({
                    venueId: venue.id,
                    houseNumber: newHouseNumber
                })
            }
            // Lock to level 2
            if (this.settings.get('options', 'lock')
                && venue.lockRank < 1
                && this.wmeSDK.State.getUserInfo().rank > 0) {
                this.log('Apply a new Lock Rank «' + (1 + 1) + '»')
                this.wmeSDK.DataModel.Venues.updateVenue({
                    venueId: venue.id,
                    lockRank: 1
                })
            }
            // If no an entry point, we would create it
            if (this.settings.get('options', 'entryPoint')
                && venue.navigationPoints?.length === 0) {
                let point = turf.point([lon, lat])
                if (venue.geometry.type === 'Point') {
                    this.log('Use the coordinates for new Navigation Point for Point')
                } else if (turf.pointsWithinPolygon(point, venue.geometry).features?.length > 0) {
                    this.log('Use the coordinates for new Navigation Point inside Polygon')
                } else {
                    // point is outside the venue geometry
                    this.log('Use the intersection of Polygon and vector to coordinates as new Navigation Point')
                    let centroid = turf.centroid(venue.geometry);
                    let line = turf.lineString([
                        centroid.geometry.coordinates,
                        point.geometry.coordinates,
                    ]);
                    let featureCollection = turf.lineIntersect(venue.geometry, line);
                    point = featureCollection.features?.pop()
                }
                // create a navigation point
                let navigationPoint = {
                    isEntry: true,
                    isExit: false,
                    isPrimary: true,
                    name: "",
                    point: point.geometry
                }
                this.wmeSDK.DataModel.Venues.replaceNavigationPoints({
                    venueId: venue.id,
                    navigationPoints: [navigationPoint]
                })
            }
            this.groupEnd()
        }
        getCityById(cityID) {
            if (!cityID || isNaN(parseInt(cityID))) {
                return null
            }
            return this.wmeSDK.DataModel.Cities.getById({
                cityId: cityID
            })
        }
        getCity(cityName = '') {
            return this.wmeSDK.DataModel.Cities.getCity({
                countryId: this.wmeSDK.DataModel.Countries.getTopCountry().id,
                cityName: cityName
            })
            || this.wmeSDK.DataModel.Cities.addCity({
                countryId: this.wmeSDK.DataModel.Countries.getTopCountry().id,
                cityName: cityName
            })
        }
        getStreet(cityId, streetName = '') {
            return this.wmeSDK.DataModel.Streets.getStreet({
                cityId: cityId,
                streetName: streetName,
            })
            || this.wmeSDK.DataModel.Streets.addStreet({
                cityId: cityId,
                streetName: streetName
            })
        }
    }
    /**
* Basic Provider class
*/
    class Provider {
        constructor(uid, container, settings) {
            this.uid = uid.trim().toLowerCase().replace(/\s/g, '-')
            this.name = uid
            this.response = []
            this.settings = settings
            // prepare DOM
            this.panel = this._panel()
            this.container = container
            this.container.append(this.panel)
        }
        /**
        * @param {String} url
        * @param {Object} data
        * @returns {Promise<unknown>}
        */
        async makeRequest(url, data) {
            let query = new URLSearchParams(data).toString()
            if (query.length) {
                url = url + '?' + query
            }
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    responseType: 'json',
                    url: url,
                    onload: response => response && response.response && resolve(response.response) || reject(response),
                    onabort: response => reject(response),
                    onerror: response => reject(response),
                    ontimeout: response => reject(response),
                })
            })
        }
        /**
        * @param  {Number} lon
        * @param  {Number} lat
        * @param  {Number} radius
        * @return {Promise<array>}
        */
        async request(lon, lat, radius) {
            throw new Error('Abstract method')
        }
        /**
        * @param  {Number} lon
        * @param  {Number} lat
        * @param  {Number} radius
        * @return {Promise<void>}
        */
        async search(lon, lat, radius = 1000) {
            let key = this.uid + ':' + lon + ',' + lat
            if (E50Cache.has(key)) {
                this.response = E50Cache.get(key)
            } else {
                this.response = await this.request(lon, lat, radius).catch(e => console.error(this.uid, 'search return error', e))
                E50Cache.set(key, this.response)
            }
            return new Promise((resolve, reject) => {
                if (this.response) {
                    resolve()
                } else {
                    reject()
                }
            })
        }
        /**
        * @param  {Array} res
        * @return {Array}
        */
        collection(res) {
            let result = []
            for (let i = 0; i < res.length; i++) {
                result.push(this.item(res[i]))
            }
            result = result.filter(x => x)
            return result
        }
        /**
        * Should return {Object}
        * @param  {Object} res
        * @return {Object}
        */
        item(res) {
            throw new Error('Abstract method')
        }
        /**
        * @param  {Number} lon
        * @param  {Number} lat
        * @param  {String} city
        * @param  {String} street
        * @param  {String} number
        * @param  {String} name
        * @param  {String} reference
        * @return {{number: *, cityId: Number, cityName: *, streetId: Number, streetName: *, name: *, raw: *, lon: *, title: *, lat: *}}
        */
        element(lon, lat, city, street, number, name = '', reference = '') {
            // Raw data from provider
            let raw = [city, street, number, name].filter(x => !!x).join(', ')
            let [cityId, cityName] = detectCity(city)
            let [streetId, streetName] = detectStreet(cityId, street)
            if (!cityId && streetId) {
                let streetModel = E50Instance.wmeSDK.DataModel.Streets.getById({ streetId: streetId })
                let cityModel = E50Instance.wmeSDK.DataModel.Cities.getById({ cityId: streetModel.cityId })
                cityId = cityModel.id
                cityName = cityModel.name
            }
            let title = [street, number, name].filter(x => !!x).join(', ')
            return {
                lat: lat,
                lon: lon,
                cityId: cityId,
                cityName: cityName,
                streetId: streetId,
                streetName: streetName,
                number: number,
                name: name,
                title: title,
                raw: raw,
                reference: reference
            }
        }
        /**
        * Render result to target element
        */
        render() {
            if (this.response.length === 0) {
                // remove empty panel
                this.panel.remove()
                return
            }
            this.panel.append(this._fieldset())
        }
        /**
        * Create div for all items
        * @return {HTMLDivElement}
        * @private
        */
        _panel() {
            let div = document.createElement('div')
            div.id = NAME.toLowerCase() + '-' + this.name
            div.className = NAME.toLowerCase()
            return div
        }
        /**
        * Build fieldset with the list of the response items
        * @return {HTMLFieldSetElement}
        * @protected
        */
        _fieldset() {
            let fieldset = document.createElement('fieldset')
            let list = document.createElement('ul')
            let collapse = parseInt(E50Instance.settings.get('ranges', 'collapse'))
            if (collapse && this.response.length > collapse) {
                fieldset.className = 'collapsed'
            } else {
                fieldset.className = ''
            }
            for (let i = 0; i < this.response.length; i++) {
                let item = document.createElement('li')
                item.append(this._link(this.response[i]))
                list.append(item)
            }
            let legend = document.createElement('legend')
            legend.innerHTML = this.name + ' <span>' + this.response.length + '</span>'
            legend.onclick = function () {
                this.parentElement.classList.toggle("collapsed")
                return false
            }
            fieldset.append(legend, list)
            return fieldset
        }
        /**
        * Build link by {Object}
        * @param  {Object} item
        * @return {HTMLAnchorElement}
        * @protected
        */
        _link(item) {
            let a = document.createElement('a')
            a.href = '#'
            a.dataset.lat = item.lat
            a.dataset.lon = item.lon
            a.dataset.cityId = item.cityId || ''
            a.dataset.cityName = item.cityName || ''
            a.dataset.streetId = item.streetId || ''
            a.dataset.streetName = item.streetName || ''
            a.dataset.number = item.number
            a.dataset.name = item.name
            a.dataset.reference = item.reference || ''
            a.innerText = item.title || item.raw
            a.title = item.raw
            a.className = NAME + '-link'
            if (!item.cityId || !item.streetId) {
                a.className += ' noaddress'
            }
            if (!item.number) {
                a.className += ' nonumber'
            }
            return a
        }
    }
    /**
* Based on the closest segment and city
*/
    class MagicProvider extends Provider {
        constructor(container, settings) {
            super(I18n.t(NAME).providers.magic, container, settings)
        }
        async request(lon, lat, radius) {
            let segments = E50Instance.getAllSegments(
                [TYPES.boardwalk, TYPES.stairway, TYPES.railroad, TYPES.runway, TYPES.parking]
            )
            let streets = {}
            console.groupCollapsed(this.uid)
            for (let key in segments) {
                let segment = segments[key]
                let address = E50Instance.wmeSDK.DataModel.Segments.getAddress({ segmentId: segment.id })
                if (address.street.name === '') {
                    continue
                }
                let distance = turf.pointToLineDistance(
                    turf.point([lon, lat]),
                    segment.geometry,
                    {
                        units: 'meters'
                    }
                )
                if (!streets[address.street.id]
                    || distance < streets[address.street.id].distance) {
                    let nearestPointOnLine = turf.nearestPointOnLine(
                        segment.geometry,
                        turf.point([lon, lat])
                    )
                    streets[address.street.id] = {
                        lon: nearestPointOnLine.geometry.coordinates[0],
                        lat: nearestPointOnLine.geometry.coordinates[1],
                        streetId: address.street.id,
                        streetName: address.street.name,
                        cityId: address.city.id,
                        cityName: address.city.name,
                        number: '',
                        name: '',
                        title: address.street.name,
                        raw: address.street.name + ', ' + address.city.name,
                        distance: distance,
                    }
                }
            }
            let result = []
            for (let key in streets) {
                if (streets.hasOwnProperty(key) && streets[key].distance <= radius) {
                    result.push(streets[key])
                }
            }
            result.sort((a, b) => {
                if (a.distance < b.distance) {
                    return -1;
                }
                if (a.distance > b.distance) {
                    return 1;
                }
                return 0;
            })
            return result
        }
    }
    $(document)
        .on('bootstrap.wme', ready)
        .on('click', '.' + NAME + '-link', applyData)
        .on('mouseenter', '.' + NAME + '-link', showLayer)
        .on('mouseleave', '.' + NAME + '-link', hideLayer)
        .on('mouseenter', '.' + NAME + '-external', showLayer)
        .on('mouseleave', '.' + NAME + '-external', hideLayer)
        .on('none.wme', hideLayer)
    /**
    * Initializes the `E50Instance` and `E50Cache` objects with predefined configurations.
    *
    * @return {void} This function does not return a value.
    */
    function ready() {
        E50Instance = new ClosestSeg(NAME, SETTINGS)
        E50Cache = new SimpleCache()
    }
    /**
* Apply data to the current selected POI
* @param event
*/
    function applyData(event) {
        event.preventDefault()
        E50Instance.applyData(event.target.dataset)
    }
    /**
    * Create the vector from the center of the selected POI to point by lon and lat
    */
    function showLayer(event) {
        const lon = parseFloat(event.target.dataset.lon)
        const lat = parseFloat(event.target.dataset.lat)
        E50Instance.createVector(lon, lat)
        E50Instance.showLayer()
    }
    /**
    * Remove all vectors and hide the layer
    */
    function hideLayer() {
        E50Instance.removeVectors()
        E50Instance.hideLayer()
    }
    /**
    * Search the city name from available in the editor area
    * @param  {String} city
    * @return {[Number,String]}
    */
    function detectCity(city) {
        // Get the list of all available cities
        let cities = E50Instance.wmeSDK.DataModel.Cities.getAll()
        .filter(city => city.name)
        // More than one city, use city with best matching score
        // Remove text in the "()"; Waze puts the region name to the pair brackets
        let best = findBestMatch(city, cities.map(city => city.name.replace(/( ?\(.*\))/gi, '')))
        if (best > -1) {
            console.info("✅ City detected")
            return [cities[best]['id'], cities[best]['name']]
            /*} else if (cities.length === 1) {
            console.info("❎ City doesn't found, uses default city")
            return [cities[0]['id'], cities[0]['name']]*/
        } else {
            console.info("❌ City doesn't found")
            return [null, city]
        }
    }
    /**
    * Search the street name from available in the editor area
    * Normalize the street name by UA rules
    * @param  {Number} cityId
    * @param  {String} street
    * @return {[Number,String]}
    */
    function detectStreet(cityId, street) {
        // It can be empty
        if (street.trim() === '') {
            return [null, null]
        }
        // Get all streets
        let streets = E50Instance.wmeSDK.DataModel.Streets.getAll()
        .filter(street => street.cityId === cityId)
        .filter(street => street.name)
        // Get type and create RegExp for filter streets
        let reTypes = new RegExp('(đường|QL|quốc lộ|QL\.|TL|TL.|tỉnh lộ|đường tỉnh|ĐT\.|hẻm|ngõ|phố|đại lộ|cầu|Đ\.|khu phố|thôn|xóm|đường huyện|ĐH|ĐH\.)', 'gi')
        let matches = [...street.matchAll(reTypes)]
        let types = []
        // Detect type(s)
        if (matches.length === 0) {
            types.push('Đ.') // set up a basic type
            street = 'Đ. ' + street
        } else {
            types = matches.map(match => match[0].toLowerCase())
        }
        // Filter streets by detected type(s)
        let filteredStreets = streets.filter(street => types.some(type => street.name.indexOf(type) > -1))
        // Matching names without type(s)
        let best = findBestMatch(
            street.replace(reTypes, '').toLowerCase().trim(),
            filteredStreets.map(street => street.name.replace(reTypes, '').toLowerCase().trim())
        )
        if (best > -1) {
            return [filteredStreets[best]['id'], filteredStreets[best]['name']]
        } else {
            return [null, street]
        }
    }
    /**
    * @link   https://github.com/aceakash/string-similarity
    * @param  {String} first
    * @param  {String} second
    * @return {Number}
    */
    function compareTwoStrings(first, second) {
        first = first.replace(/\s+/g, '')
        second = second.replace(/\s+/g, '')
        if (!first.length && !second.length) return 1           // if both are empty strings
        if (!first.length || !second.length) return 0           // if only one is empty string
        if (first === second) return 1                          // identical
        if (first.length === 1 && second.length === 1) return 0 // both are 1-letter strings
        if (first.length < 2 || second.length < 2) return 0     // if either is a 1-letter string
        let firstBigrams = new Map()
        for (let i = 0; i < first.length - 1; i++) {
            const bigram = first.substring(i, i + 2)
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1
            firstBigrams.set(bigram, count)
        }
        let intersectionSize = 0
        for (let i = 0; i < second.length - 1; i++) {
            const bigram = second.substring(i, i + 2)
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0
            if (count > 0) {
                firstBigrams.set(bigram, count - 1)
                intersectionSize++
            }
        }
        return (2.0 * intersectionSize) / (first.length + second.length - 2)
    }
    /**
    * @param  {String} mainString
    * @param  {String[]} targetStrings
    * @return {Number}
    */
    function findBestMatch(mainString, targetStrings) {
        let bestMatch = ''
        let bestMatchRating = 0
        let bestMatchIndex = -1
        for (let i = 0; i < targetStrings.length; i++) {
            let rating = compareTwoStrings(mainString, targetStrings[i])
            if (rating > bestMatchRating) {
                bestMatch = targetStrings[i]
                bestMatchRating = rating
                bestMatchIndex = i
            }
        }
        if (bestMatch === '' || bestMatchRating < 0.35) {
            console.log('❌', mainString, '🆚', targetStrings)
            return -1
        } else {
            console.log('✅', mainString, '🆚', bestMatch, ':', bestMatchRating)
            return bestMatchIndex
        }
    }
})();