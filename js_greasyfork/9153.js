// ==UserScript==
// @name            WME Show Alt Names
// @description     Shows alt names for selected segments
// @version         1.0.2
// @author          SAR85
// @copyright       SAR85
// @license         CC BY-NC-ND
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://editor-beta.waze.com/*
// @namespace       https://greasyfork.org/users/9321
// @require			https://greasyfork.org/scripts/9794-wlib/code/wLib.js?version=52323
// @require         http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require         http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/9153/WME%20Show%20Alt%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/9153/WME%20Show%20Alt%20Names.meta.js
// ==/UserScript==
/* global wLib */
/* global W */
/* global OL */

var jq214 = jQuery.noConflict(true);

(function ($) {
    var $altDiv,
        $altTable,
        alternateObjectsArray = [],
        altLayer,
        betaEditor,
        draggableSupported = true,
        highlightLayer,
        nameArray = [],
        selectedSegments = [],
        CSS = {
            'altTable': {
                'width': '100%'
            },
            'altTableClass': {
                'border': '1px solid white',
                'padding': '3px',
                'border-collapse': 'collapse',
                '-moz-user-select': '-moz-none',
                '-khtml-user-select': 'none',
                '-webkit-user-select': 'none'
            },
            'altTableType': {
                'width': '50px'
            },
            'altTableID': {
                'text-align': 'center',
                'border-left': 'none',
                'width': '80px'
            },
            'altTableRoadType': {
                'border-radius': '10px',
                'color': 'black',
                'text-shadow': '1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff,0px 1px 0 #fff,1px 0px 0 #fff,0px -1px 0 #fff,-1px 0px 0 #fff',
                'border': '1px solid white',
                'font-size': '0.8em',
                'text-align': 'center',
                'padding': '0 3px 0 3px',
                'min-width': '32px'
            },
            'altTableSelected': {
                'font-weight': 'bold',
                'background-color': 'white',
                'color': 'black'
            },
            'altDiv': {
                'display': 'none',
                'position': 'absolute',
                'left': '6px',
                'bottom': '60px',
                'min-height': '120px',
                'min-width': '335px',
                'overflow-y': 'scroll',
                'overflow-x': 'hidden',
                'white-space': 'nowrap',
                'background-color': 'rgba(0,0,0,0.8)',
                'color': 'white',
                'padding': '5px'
            },
            'altDivScrollbar': {
                'width': '15px',
                'border-radius': '5px'
            },
            'altDivScrollbarTrack': {
                'border-radius': '5px',
                'background': 'none',
                'width': '10px'
            },
            'altDivScrollbarThumb': {
                'background-color': 'white',
                'border-radius': '5px',
                'border': '2px solid black'
            },
            'altDivScrollbarCorner': {
                'background': 'none'
            },
            'altOptionsButton': {
                'margin': '0 0 3px 3px',
                'height': '2em',
                'font-size': '0.8em'
            },
            'autoSelectButton': {
                'display': 'none'
            },
            'optionsDiv': {
                'display': 'none',
                'clear': 'both',
                'border': '1px solid white',
                'padding': '3px',
                'margin': ' 0 0 3px 0',
                'font-weight': 'normal'
            },
            'optionsDivTd': {
                'padding-right': '5px'
            },
            'optionsDivInput': {
                'margin-right': '3px'
            }
        },
        ROAD_TYPES = {
            1: { name: 'St', expColor: '#FFFFDD' },
            2: { name: 'PS', expColor: '#FDFAA7' },
            3: { name: 'Fwy', expColor: '#6870C3' },
            4: { name: 'Rmp', expColor: '#B3BFB3' },
            5: { name: 'Trl', expColor: '#B0A790' },
            6: { name: 'MH', expColor: '#469FBB' },
            7: { name: 'mH', expColor: '#69BF88' },
            8: { name: 'Dirt', expColor: '#867342' },
            10: { name: 'Bdwk', expColor: '#9A9A9A' },
            16: { name: 'Stwy', expColor: '#9A9A9A' },
            17: { name: 'Pvt', expColor: '#BEBA6C' },
            18: { name: 'RR', expColor: '#B2B6B4' },
            19: { name: 'Rwy', expColor: '#222222' },
            20: { name: 'PLR', expColor: '#ABABAB' }
            //add ferry
        };

	/**
	 * Returns a random color in rgba() notation.
	 * @param {Number} opacity The desirected opacity (a value of the color).
	 * returns {String} The rgba() color.
	 */
    function randomRgbaColor(opacity) {
        opacity = opacity || 0.8;
        function random255() {
            return Math.floor(Math.random() * 255);
        }
        return 'rgba(' + random255() + ',' + random255() + ',' + random255() + ',' + opacity + ')';
    }

	/**
	 * Resets the renderIntent of all features on altLayer.
	 * @param {String} intent Optional parameter specifying the intent. The 
     * default intent is 'default'.
	 */
    function resetRenderIntent(intent) {
        var i, n;
        intent = intent || 'default';
        for (i = 0, n = altLayer.features.length; i < n; i++) {
            altLayer.features[i].renderIntent = intent;
        }
    }

	/**
	 * Pans the map to a segment specified by its ID.
	 * @param {Number} id The ID of the segment.
	 */
    function panToSegment(id) {
        var segment = id && W.model.segments.get(id);
        return segment && W.map.moveTo(segment.geometry.getBounds().getCenterLonLat());
    }

	/**
	 * Selects a segment specified by its ID.
	 * @param {Number} id The ID of the segment.
	 */
    function selectSegment(id) {
        var seg = id && W.model.segments.get(id);
        return seg && W.selectionManager.select([seg]);
    }

	/** 
     * Event handler for changing the highlight color for a segment.
	 * @param {Event} event
	 */
    function changeHighlightColor(event) {
        var i, n,
            $this = $(this),
            name = $this.find('.altTable-primary-name').text() || $this.find('.altTable-alt-name').text(),
            city = $this.find('.altTable-primary-city').text() || $this.find('.altTable-alt-city').text(),
            useCity = $('#altUseCity').prop('checked');
        for (i = 0, n = nameArray.length; i < n; i++) {
            if (nameArray[i].name === name && (useCity ? nameArray[i].city === city : true)) {
                nameArray[i].color = randomRgbaColor();
                colorTable();
                $this.trigger('mouseenter', { singleSegment: false });
                break;
            }
        }
    }

	/**
	 * Lookup function for the display color of a specified road type. Will 
     * return the color for the experimental layer if it is activated, 
     * otherwise it will return the color for the old roads layer.
	 * @param {Number} type The roadType to look up.
	 * @returns {Object} Object of form:  
     * {typeString: 'RoadTypeName', typeColor: '#FFFFFF'}, 
	 * where RoadTypeName is an abbreviated form of the name of the road type 
     * and typeColor is the hex value of the display color.
	 */
    function getRoadColor(type) {
        if (type && undefined !== typeof ROAD_TYPES[type]) {
            return {
                typeString: ROAD_TYPES[type].name,
                typeColor: ROAD_TYPES[type].expColor
            };
        } else {
            return { typeString: 'error', typeColor: ROAD_TYPES[1].expColor };
        }
    }

	/**
	 * Data structure for segment information used to build highlight layer 
     * features and the alternate names table.
	 * @class
	 * @param {Waze.Feature.Vector.Segment} The segment feature on which to 
     * base the new instance.
	 */
    function Alternate(baseFeature) {
        var i, n, street, city;
        if (!baseFeature) {
            return;
        }

        this.attributes = baseFeature.model.attributes;
        this.segmentID = this.attributes.id;
	
        // Make a feature for highlighting on the map.
        this.layerFeature = new OL.Feature.Vector(baseFeature.geometry.clone(), this.attributes);
	
        // Store segment name information.
        street = W.model.streets.get(this.attributes.primaryStreetID);
        city = street && W.model.cities.get(street.cityID);
        this.primaryName = street ? street.name || 'No name' : 'New road';
        this.primaryCity = city ? city.name || 'No city' : 'New road';

        this.alternates = [];
        for (i = 0, n = this.attributes.streetIDs.length; i < n; i++) {
            street = W.model.streets.get(this.attributes.streetIDs[i]);
            city = street && W.model.cities.get(street.cityID);
            this.alternates.push({
                name: street ? street.name || 'No name' : 'New road',
                city: city ? city.name || 'No city' : 'New road'
            });
        }

        // Make a table row for displaying segment data.
        this.tableRow = this.createTableRow();
	
        // Add name info to attributes of layer feature and add the feature to the layer.
        // (For compatibility with highlighting functions--old method)
        this.layerFeature.attributes.alt = this.alternates;
        this.layerFeature.attributes.primary = { name: this.primaryName, city: this.primaryCity };
    }
    Alternate.prototype = /** @lends Alternate.prototype */ {
        createTableRow: function () {
            var i, n, $row, $cell, roadType;

            $row = $('<tr/>').attr('id', 'alt' + this.segmentID);
		
            //add road type to row
            roadType = getRoadColor(this.layerFeature.attributes.roadType);
            $cell = $('<td/>')
                .addClass('altTable-type')
                .css('border-right', 'none')
                .append($('<div/>')
                    .addClass('altTable-roadType')
                    .css('background-color', roadType.typeColor)
                    .text(roadType.typeString))
                .append($('<div/>')
                    .css({ 'text-align': 'center', 'font-size': '0.8em' })
                    .text(this.layerFeature.attributes.length + ' m')
                    );
            $row.append($cell);
        
            //add id to row
            $cell = $('<td/>')
                .addClass('altTable-id').css('border-left', 'none')
                .append($('<div/>')
                    .text(this.segmentID));
            $row.append($cell);
		
            //add primary name and city to row
            $cell = $('<td/>').addClass('altTable-primary')
                .append($('<div/>')
                    .addClass('altTable-primary-name')
                    .text(this.primaryName))
                .append($('<div/>')
                    .addClass('altTable-primary-city')
                    .text(this.primaryCity)
                    );
            $row.append($cell);
		
            //add alt names and cities to row
            for (i = 0, n = this.alternates.length; i < n; i++) {
                $cell = $('<td/>').addClass('altTable-alt')
                    .append($('<div/>').addClass('altTable-alt-name').text(this.alternates[i].name))
                    .append($('<div/>').addClass('altTable-alt-city').text(this.alternates[i].city)
                        );
                $row.append($cell);
            }
            return $row;
        }
    };

	/**
	 * Colors the table cells based on segment/city name.
	 */
    function colorTable() {
        'use strict';
        var i,
            n,
            useCity = $('#altUseCity').prop('checked');

        $altTable.find('.altTable-primary, .altTable-alt').each(function (index1) {
            var $this = $(this),
                name = $this.find('.altTable-primary-name').text() || $this.find('.altTable-alt-name').text(),
                city = $this.find('.altTable-primary-city').text() || $this.find('.altTable-alt-city').text(),
                match = false,
                color;

            for (i = 0, n = nameArray.length; i < n; i++) {
                if (nameArray[i].name === name && (useCity ? nameArray[i].city === city : true)) {
                    $this.css('background-color', nameArray[i].color);
                    match = true;
                    break;
                }
            }
            if (match === false) {
                color = randomRgbaColor();
                $this.css('background-color', color);
                nameArray.push({ name: name, city: city, color: color });
            }
            match = false;
        });
    }

	/**
	 * Populates the table with segment information
	 * @param {Number} maxAlternates The maxiumum number of alternates
	 * a segment has (how many "Alt" columns are needed).
	 * @param {Boolean} sortByNode Whether to sort the table in driving
	 * order by node ID.
	 */
    function populateTable(maxAlternates, sortByNode) {
        'use strict';
        var i, n, j, m, $row;
	
        // Empty table contents.
        $altTable.find('tbody').empty();
        $('.altTable-header-alt').remove();
	
        // Sort if needed.
        if (sortByNode) {
            sortSegmentsByNode();
        }
	
        // Add table rows for each segment.
        for (i = 0, n = selectedSegments.length; i < n; i++) {
            $row = selectedSegments[i].tableRow.clone();
            for (j = selectedSegments[i].alternates.length, m = maxAlternates; j < m; j++) {
                $row.append($('<td/>').addClass('altTable-placeholder'));
            }
            $altTable.append($row);
        }
	
        // Add column headings for alt names.
        for (i = 1, n = maxAlternates; i <= n; i++) {
            $('#altTable-header').append($('<th/>')
                .addClass('altTable-header-alt')
                .text('Alt ' + i));
        }

        $('#altShowCity').change();
        colorTable();
    }

	/**
	 * Callback for hovering over segment name in the table that
	 * colors all features on the altLayer with the same name/city as the
	 * one being hovered over.
	 * @callback
	 * @param {jQuery} $el The cell from the table to match.
	 * @param {String} color The rgba-formatted color value.
	 */
    function colorFeatures($el, color) {
        'use strict';
        var i,
            n,
            j,
            t,
            colorValues,
            feature,
            names,
            name = $el.find('.altTable-primary-name').text() || $el.find('.altTable-alt-name').text(),
            city = $el.find('.altTable-primary-city').text() || $el.find('.altTable-alt-city').text(),
            useCity = $('#altUseCity').prop('checked');
    
        //remove opacity from color so it can be controlled by layer style
        colorValues = color.match(/\d+/g);
        color = 'rgb(' + colorValues[0] + ',' + colorValues[1] + ',' + colorValues[2] + ')';

        for (i = 0, n = altLayer.features.length; i < n; i++) {
            feature = altLayer.features[i];
            //combine primary and alt names in one array
            names = feature.attributes.alt.concat(feature.attributes.primary);
            //test names for match
            for (j = 0, t = names.length; j < t; j++) {
                if (names[j].name === name && (useCity ? names[j].city === city : true)) {
                    feature.attributes.bgColor = color;
                    feature.renderIntent = 'highlight';
                }
            }
        }
    }

	/**
	 * Callback for hovering over a segment ID in the table. Highlights the 
     * corresponding altLayer feature black or as specified.
	 * @callback
	 * @param {Number} id The segment ID to highlight.
	 * @param {String} color The rgba-formatted color (optional--default is 
     * black).
	 */
    function colorSegment(id, color) {
        'use strict';
        var i, n, feature;
        color = color || 'rgba(0, 0, 0, 0.8)';
        for (i = 0, n = altLayer.features.length; i < n; i++) {
            feature = altLayer.features[i];
            if (feature.attributes.id == id) {
                feature.attributes.bgColor = color;
                feature.renderIntent = 'highlight';
                break;
            }
        }
    }

	/**
	 * Handles table events for hovering and calls appropriate function
	 * for highlighting.
	 * @callback
	 * @param {Event} event The event object.
	 */
    function applyHighlighting(event) {
        var $this1, name1, city1,
            useCity = $('#altUseCity').prop('checked');
        switch (event.type) {
            case 'mouseenter':
                $this1 = $(this);
                if (event.data.singleSegment) {
                    colorSegment($this1.text());
                    $this1.parent().addClass('altTable-selected');
                } else {
                    colorFeatures($this1, $this1.css('background-color'));
                    if ($this1.hasClass('altTable-primary')) {
                        name1 = $this1.find('.altTable-primary-name').text();
                        city1 = $this1.find('.altTable-primary-city').text();
                    } else {
                        name1 = $this1.find('.altTable-alt-name').text();
                        city1 = $this1.find('.altTable-alt-city').text();
                    }
                    $('#altTable tbody td').each(function (index) {
                        var $this2 = $(this),
                            name2 = $this2.find('.altTable-primary-name').text() || $this2.find('.altTable-alt-name').text(),
                            city2 = $this2.find('.altTable-primary-city').text() || $this2.find('.altTable-alt-city').text();
                        if (name1 === name2 && (useCity ? city1 === city2 : true)) {
                            $this2.parent().addClass('altTable-selected');
                        }
                    });
                }

                break;
            case 'mouseleave':
                resetRenderIntent();
                $('#altTable tr').each(function (index) {
                    $(this).removeClass('altTable-selected');
                });
                break;
        }
        altLayer.redraw();
    }

	/**
	 * Event handler for selection events. Checks for appropriate condions
	 * for running script, creates Alternate objects as necessary, 
     * displays/hides UI elements.
	 * @callback
	 */
    function checkSelection() {
        var i, n, j, m, alternate, thisItem, maxAlternates = 0, selectedItems;
        selectedSegments = [];
        $('#altAutoSelect').hide();
        if (W.selectionManager.selectionCountByType.segment && altLayer.getVisibility()) {
            selectedItems = W.selectionManager.selectedItems;
            if (selectedItems.length > 1) {
                $('#altAutoSelect').show();
            }
            for (i = 0, n = selectedItems.length; i < n; i++) {
                thisItem = selectedItems[i];
                if (thisItem.model.type === 'segment') {
                    for (j = 0, m = alternateObjectsArray.length; j < m; j++) {
                        if (alternateObjectsArray[j].segmentID === thisItem.model.attributes.id) {
                            if (alternateObjectsArray[j].layerFeature.attributes.updatedOn !==
                                thisItem.model.attributes.updatedOn) {
                                alternateObjectsArray.splice(j, 1);
                            } else {
                                alternate = alternateObjectsArray[j];
                                continue;
                            }
                        }
                    }
                    if (!alternate) {
                        alternate = new Alternate(thisItem);
                        alternateObjectsArray.push(alternate);
                    }
                    selectedSegments.push(alternate);
                    altLayer.addFeatures(alternate.layerFeature);
                    if (maxAlternates < alternate.alternates.length) {
                        maxAlternates = alternate.alternates.length;
                        selectedSegments.maxAlternates = maxAlternates;
                    }
                    alternate = null;
                }
            }
            populateTable(maxAlternates, $('#altSortByNode').prop('checked'));
            $altDiv.fadeIn();
        } else {
            $altDiv.fadeOut();
            altLayer.removeAllFeatures();
            if (alternateObjectsArray.length > 100) {
                alternateObjectsArray = [];
            }
        }
    }

	/**
	 * Checks all segments in WME for alt names and adds feature for
	 * highlighting.
	 */
    function checkAllSegments() {
        'use strict';
        var segID, segment;
        highlightLayer.removeAllFeatures();
        if (altLayer.getVisibility() && $('#altHighlights').prop('checked')) {
            for (segID in W.model.segments.objects) {
                segment = W.model.segments.objects[segID];
                if (W.model.segments.objects.hasOwnProperty(segID) &&
                    segment.attributes.streetIDs.length > 0) {
                    highlightLayer.addFeatures(new OL.Feature.Vector(segment.geometry.clone()));
                }
            }
        }
    }

	/**
	 * Sorts the selected segments in "driving order" starting with first 
     * selected based on Node ID.
	 */
    function sortSegmentsByNode(useFromNode) {
        'use strict';
        var path = [],
            startingNodeID = useFromNode ? selectedSegments[0].
                attributes.fromNodeID : selectedSegments[0].attributes.toNodeID;
        var findNextSegment = function (nodeID) {
            var fromNodeMatched = false,
                nextNode,
                tempPath = [],
                toNodeMatched = false;
            _.each(selectedSegments, function (segment) {
                console.debug('Checking segment ' + segment.attributes.id);
                if (path.indexOf(segment.attributes.id) !== -1) {
                    console.debug('Segment already in path.');
                    return;
                }
                if (segment.attributes.fromNodeID === nodeID) {
                    fromNodeMatched = true;
                    tempPath.push(segment);
                } else if (segment.attributes.toNodeID === nodeID) {
                    toNodeMatched = true;
                    tempPath.push(segment);
                }
            });
            if (tempPath.length === 1) {
                path.push(tempPath[0].attributes.id);
                if (fromNodeMatched) {
                    nextNode = tempPath[0].attributes.toNodeID;
                } else if (toNodeMatched) {
                    nextNode = tempPath[0].attributes.fromNodeID;
                }
                findNextSegment(nextNode);
            }
        };

        path.push(selectedSegments[0].attributes.id);

        console.debug('Looking for connected segments at node ' +
            startingNodeID);
        findNextSegment(startingNodeID);

        if (path.length === 0 && !useFromNode) {
            console.debug('No connections at toNode. Looking at fromNode.');
            sortSegmentsByNode(true);
        } else {
            selectedSegments = _.sortBy(selectedSegments, function (segment) {
                return path.indexOf(segment.attributes.id);
            });
        }
    }


	/**
	 * Uses wLib to fetch route from routing server based on selected segments 
     * then attempts to select the route segments.
	 */
    function performAutoSelect() {
        'use strict';
        var i,
            options,
            route,
            segmentsToSelect = [],
            selection = W.selectionManager.selectedItems,
            n = selection.length;

        /**
         * Callback for the route selection utility. Gets the segment IDs of
         * segments on the route, checks to see if they are loaded in WME and
         * pushes them to array for selection later.
         * @callback
         */
        function routeCallback() {
            var segIDs, seg;
            segIDs = this.getRouteSegmentIDs()[0];
            segIDs.forEach(function (item) {
                seg = W.model.segments.get(item);
                if (seg) {
                    segmentsToSelect.push(seg);
                }
            });
            if (this.last) {
                W.selectionManager.select(segmentsToSelect);
            }
        }

        /**
         * Fetches the route (or sub-route) via wLib.
         * @param {OpenLayers.Feature.Vector} start The starting segment of the 
         * sub-route.
         * @param {OpenLayers.Feature.Vector} end The ending segment of the 
         * sub-route.
         * @param {Boolean} last Whether the sub-route is the last of the total 
         * route.
         * @param {Number} The timeout before fetching the route in 
         * milliseconds.
         */
        function fetchRoute(start, end, last, timeout) {
            window.setTimeout(function () {
                route = new wLib.Model.RouteSelection(start, end, routeCallback, options);
                route.last = last ? true : false;
            }, timeout);
        }

        if (n > 0) {
            options = {
                fastest: $('#altFastest').prop('checked'),
                tolls: $('#altAvoidTolls').prop('checked'),
                freeways: $('#altAvoidFreeways').prop('checked'),
                dirt: $('#altAvoidDirt').prop('checked'),
                longtrails: $('#altAvoidLongDirt').prop('checked'),
                uturns: $('#altAllowUturns').prop('checked')
            };
            for (i = 0; i < n - 1; i++) {
                if ('segment' === selection[i].model.type && 'segment' === selection[i + 1].model.type) {
                    fetchRoute(selection[i], selection[i + 1], i === n - 2 ? true : false, 1000 * i);
                }
            }
        }
    }

    /**
     * Saves checkbox states to localStorage.
     */
    function saveOptions(event) {
        'use strict';
        var options = {
            fastest: $('#altFastest').prop('checked'),
            tolls: $('#altAvoidTolls').prop('checked'),
            freeways: $('#altAvoidFreeways').prop('checked'),
            dirt: $('#altAvoidDirt').prop('checked'),
            longtrails: $('#altAvoidLongDirt').prop('checked'),
            uturns: $('#altAllowUturns').prop('checked'),
            highlights: $('#altHighlights').prop('checked'),
            sortByNode: $('#altSortByNode').prop('checked'),
            useCity: $('#altUseCity').prop('checked'),
            showCity: $('#altShowCity').prop('checked')
        };
        return window.localStorage.altNamesOptions = JSON.stringify(options);
    }

    /**
     * Loads checkbox states from localStorage.
     */
    function loadOptions() {
        'use strict';
        var options;
        if (undefined !== typeof window.localStorage.altNamesOptions) {
            options = JSON.parse(window.localStorage.altNamesOptions);
            if (undefined !== typeof options.fastest) {
                $('#altFastest').prop('checked', options.fastest);
            }
            if (undefined !== typeof options.tolls) {
                $('#altAvoidTolls').prop('checked', options.tolls);
            }
            if (undefined !== typeof options.freeways) {
                $('#altAvoidFreeways').prop('checked', options.freeways);
            }
            if (undefined !== typeof options.dirt) {
                $('#altAvoidDirt').prop('checked', options.dirt);
            }
            if (undefined !== typeof options.longrails) {
                $('#altAvoidDirt').prop('checked', options.longtrails);
            }
            if (undefined !== typeof options.uturns) {
                $('#altAllowUturns').prop('checked', options.uturns);
            }
            if (undefined !== typeof options.highlights) {
                $('#altHighlights').prop('checked', options.highlights);
            }
            if (undefined !== typeof options.sortByNode) {
                $('#altSortByNode').prop('checked', options.sortByNode);
            }
            if (undefined !== typeof options.useCity) {
                $('#altUseCity').prop('checked', options.useCity);
            }
            if (undefined !== typeof options.useCity) {
                $('#altShowCity').prop('checked', options.showCity);
            }
        }
    }

    /**
     * Shows alert box with version information and changes.
     */
    function updateAlert() {
        var altVersion = '1.0.2',
            alertOnUpdate = true,
            versionChanges = 'WME Show Alt Names has been updated to ' + altVersion + '.\n';
        versionChanges += 'Changes:\n';
        versionChanges += '[*] Table can be moved and resized.\n';
        if (alertOnUpdate && window.localStorage && window.localStorage.altVersion !== altVersion) {
            window.localStorage.altVersion = altVersion;
            alert(versionChanges);
        }
    }

    /**
     * Initializes the script by adding CSS and HTML to page, registering event 
     * listeners, adding map layers, checking for beta editor, and running main 
     * functions to check for segments loaded at init and highlighting.
     */
    function init() {
        var altStyleMap,
            css,
            $header,
            highlightStyle,
            optionsHTML,
            $row;

        css = '#altTable {width: 100%;}';
        css += '.altTable, .altTable th, .altTable td {border: 1px solid white; padding: 3px; border-collapse: collapse; -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none;}\n';
        css += '.altTable-type {width: 50px;}\n';
        css += '.altTable-id {text-align: center; border-left: none; width: 80px}\n';
        css += '.altTable-roadType {border-radius: 10px; color: black; text-shadow: 1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff,0px 1px 0 #fff,1px 0px 0 #fff,0px -1px 0 #fff,-1px 0px 0 #fff; border: 1px solid white; font-size: 0.8em; text-align: center; padding: 0 3px 0 3px; min-width: 32px;}';
        css += 'tr.altTable-selected > .altTable-id {font-weight: bold; background-color: white; color: black;}\n';

        css += '#altDiv {display: none; position: absolute; left: 6px; bottom: 60px; min-height: 120px; min-width: 335px;';
        css += 'overflow-y: scroll; overflow-x: hidden; white-space: nowrap; background-color: rgba(0,0,0,0.8); color: white; padding: 5px; ';
        css += 'z-index: 1001; border-radius: 5px; max-height: 60%;}\n';

        // scroll bar CSS
        css += '#altDiv::-webkit-scrollbar {width: 15px; border-radius: 5px;}\n';
        css += '#altDiv::-webkit-scrollbar-track {border-radius: 5px; background: none; width: 10px;}\n';
        css += '#altDiv::-webkit-scrollbar-thumb {background-color: white; border-radius: 5px; border: 2px solid black;}\n';
        css += '#altDiv::-webkit-scrollbar-corner {background: none;}\n';

        // buttons css
        css += '.altOptions-button {margin: 0 0 3px 3px; height: 2em; font-size: 0.8em;}\n';
	
        // Options Menu CSS
        css += '#optionsDiv {display: none; clear: both; border: 1px solid white; padding: 3px; margin: 0 0 3px 0; font-weight: normal;}';
        css += '#optionsDiv td {padding-right: 5px;}';
        css += '#optionsDiv input {margin-right: 3px;}';
	
        //add css to page
        $('<style/>').html(css).appendTo($(document.head));
        
        // add jqui style to page
        $('head').append($('<link/>').attr({
            href: '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/le-frog/jquery-ui.min.css',
            rel: 'stylesheet',
            type: 'text/css'
        }));

        // Make the options menu.
        optionsHTML = '<div id="altOptions"> <button id="altAutoSelect" class="altOptions-button" style="display: none;">Auto Select</button> <label style="float: right; margin: 3px;"> <input id="altHighlights" type="checkbox">Highlight Alt Names</label> <button id="altOptionsButton" class="altOptions-button" style="float: right;">Show Options</button> </div> <div id="optionsDiv"> <div> <label style="font-weight: normal;"> <input type="checkbox" id="altShowCity">Show city name in table</label> </div> <div> <label style="font-weight: normal;"> <input type="checkbox" id="altUseCity">Use city name in name matching</label> </div> <div> <label style="font-weight: normal;"> <input type="checkbox" id="altSortByNode">Sort table by driving order (experimental)</label> </div> <form> <table> <thead> <tr> <td colspan="2" style="text-align: center; text-decoration: underline; font-weight: bold;">Auto Selection Route Options</td> </tr> </thead> <tbody> <tr> <td> <input type="checkbox" id="altAvoidTolls">Avoid toll roads</td> <td> <input type="checkbox" id="altAvoidFreeways">Avoid freeways</td> </tr> <tr> <td> <input type="checkbox" id="altAvoidLongDirt">Avoid long dirt roads</td> <td> <input type="checkbox" id="altAvoidDirt">Avoid dirt roads</td> </tr> <tr> <td> <input type="checkbox" id="altAllowUturns">Allow U-turns</td> <td> <input type="checkbox" id="altFastest">Fastest route</td> </tr> </tbody> </table> </form> </div>';
            
        // Make the table to hold segment information.
        $altTable = $('<table/>').attr('id', 'altTable').addClass('altTable');
        $header = $('<thead/>');
        $row = $('<tr/>').attr('id', 'altTable-header');
        $row.append($('<th/>').attr('colspan', '2').text('Segment ID'));
        $row.append($('<th/>').text('Primary'));
        $header.append($row);
        $altTable.append($header);
        $altTable.append('<tbody/>');
	
        // Make the main div to hold script content.
        $altDiv = $('<div/>').attr('id', 'altDiv');
        $altDiv.append(optionsHTML);
        $altDiv.append($altTable);
        $altDiv.appendTo($('#WazeMap'));
        $('#altAutoSelect').click(performAutoSelect);
        $('#altOptionsButton').click(function () {
            var $optionsDiv = $('#optionsDiv');
            if ($optionsDiv.css('display') === 'none') {
                $optionsDiv.show();
                $(this).text('Hide Options');
            } else {
                $optionsDiv.hide();
                $(this).text('Show Options');
            }
        });
        $('#altSortByNode').on('change', checkSelection);
        $('#altHighlights').on('change', checkAllSegments);
        $('#altUseCity').on('change', colorTable);
        $('#altShowCity').on('change', function () {
            if ($(this).prop('checked')) {
                $altTable.find('.altTable-primary-city, .altTable-alt-city').each(function () {
                    $(this).show();
                });
            } else {
                $altTable.find('.altTable-primary-city, .altTable-alt-city').each(function () {
                    $(this).hide();
                });
            }
        });
        $('#optionsDiv input[type=checkbox], #altOptions input[type=checkbox]').on('change', saveOptions);
        $altDiv.on('mouseenter mouseleave', 'td.altTable-primary, td.altTable-alt', { singleSegment: false }, applyHighlighting);
        $altDiv.on('dblclick', 'td.altTable-primary, td.altTable-alt', null, changeHighlightColor);
        $altDiv.on('mouseenter mouseleave', 'td.altTable-id', { singleSegment: true }, applyHighlighting);
        $altDiv.on('click', 'td.altTable-id', null, function () {
            panToSegment($(this).text());
        });
        $altDiv.on('dblclick', 'td.altTable-id', null, function () {
            selectSegment($(this).text());
        });
	
        // Make $altDiv resizable and draggable
        try {
            $altDiv.one('resize', function () {
                $(this).css('max-height', '100%');
            });
            $altDiv.resizable({ handles: 'all', containment: 'parent' });
            $altDiv.one('drag', function () {
                $(this).css('bottom', 'auto');
            });

            $altDiv.draggable({ containment: 'parent' });
        } catch (err) {
            draggableSupported = false;
        };
	
        // Create the map layers for segment highlighting.
        altStyleMap = new OL.StyleMap({
            default: new OL.Style({
                stroke: false
            }),
            highlight: new OL.Style({
                stroke: true,
                strokeWidth: 20,
                strokeColor: '${bgColor}',
                strokeOpacity: 1,
                strokeLinecap: 'round'
            })
        });
        altLayer = new OL.Layer.Vector('WME Show Alt Names', { styleMap: altStyleMap });
        altLayer.events.register('visibilitychanged', null, checkSelection);

        highlightStyle = new OL.StyleMap({
            default: new OL.Style({
                strokeWidth: 20,
                strokeColor: '#FFFFFF',
                strokeOpacity: 0.4
            })
        });
        highlightLayer = new OL.Layer.Vector('WME Show Alt Names - Highlight All', {
            styleMap: highlightStyle,
            displayInLayerSwitcher: false
        });

        W.map.addLayers([highlightLayer, altLayer]);
	
        //check for beta editor due to road layer name differences
        if (location.href.match(/-beta/)) {
            betaEditor = true;
        }
	
        //register WME event listeners
        W.loginManager.events.register('afterloginchanged', null, init);
        W.selectionManager.events.register('selectionchanged', null, checkSelection);
        W.map.events.register('moveend', null, checkAllSegments);
        W.map.getLayersByName('Roads')[0].events.register('visibilitychanged', null, checkSelection);
	
        // Ready to go. Alert user to any updates and check for selected segments.
        updateAlert();
        loadOptions();
        checkAllSegments();
        checkSelection();
    }

    /**
     * Checks for key components of the page before initializing the script.
     */
    function bootstrap() {
        if ('undefined' !== typeof $ &&
            'undefined' !== typeof wLib &&
            $('#WazeMap').size() &&
            window.W.selectionManager.events.register &&
            window.W.loginManager.events.register) {
            init();
        } else {
            setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }
    debugger;
    bootstrap();
} (jq214));