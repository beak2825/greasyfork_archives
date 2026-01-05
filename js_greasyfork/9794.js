// ==UserScript==
// @name            wLib
// @description     A library for WME script developers.
// @version         1.0.7
// @author          SAR85
// @copyright       SAR85
// @license         CC BY-NC-ND
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://editor-beta.waze.com/*
// @namespace       https://greasyfork.org/users/9321
// ==/UserScript==

/* global W */
/* global OL */
/* global wLib */

(function () {
    function bootstrap(tries) {
        tries = tries || 1;

        if (window.$ &&
            window.Backbone &&
            window._ &&
            window.OL &&
            window.W &&
            window.W.map &&
            window.W.accelerators &&
            window.W.model) {

            init();

        } else if (tries < 1000) {

            setTimeout(function () {
                bootstrap(tries++);
            }, 200);

        }
    }

    bootstrap();

    function init() {
        var oldLib = window.wLib;
        var root = this;
        
        /**
         * The wLib namespace.
         * @namespace {Object} wLib
         * @global
         */
        var wLib = {};
    
        /**
         * The current wLib version.
         * @member {string} wLib.VERSION
         */
        wLib.VERSION = '1.0.7';
        
        /**
         * Whether or not the current WME is the beta version.
         * @member {boolean} wLib.isBetaEditor
         */
        wLib.isBetaEditor = /beta/.test(location.href);
        
        /**
         * Sets window.wLib to the last wLib object and returns the current 
         * version.
         * @function wLib.noConflict
         */
        wLib.noConflict = function () {
            root.wLib = oldLib;
            return this;
        };
        
        /**
         * Namespace for functions related to geometry.
         * @namespace {Object} wLib.Geometry
         */
        wLib.Geometry = new Geometry;
        
        /**
         * Namespace for functions related to the model.
         * @namespace {Object} wLib.Model
         */
        wLib.Model = new Model;
        
        /**
         * Namespace for functions related to the WME interface
         * @namespace {Obect} wLib.Interface
         */
        wLib.Interface = new Interface;
        
        /**
         * Namespace for utility functions.
         * @namespace {Object} wLib.Util
         */
        wLib.Util = new Util;
        
        /**
         * Namespace for functions related to WME actions.
         * @namespace {Object} wLib.api
         */
        wLib.api = new API;

        /* Export library to window */
        root.wLib = wLib;
    }

    /*** GEOMETRY ***/
    function Geometry() {
        /**
         * Determines if an OpenLayers.Geometry is within the map view.
         * @function wLib.Geometry.isGeometryInMapExtent
         * @param geometry OpenLayers.Geometry
         * @return {Boolean} Whether or not the geometry is in the map extent.
         */
        this.isGeometryInMapExtent = function (geometry) {
            'use strict';
            return geometry && geometry.getBounds &&
                W.map.getExtent().intersectsBounds(geometry.getBounds());
        };
        
        /**
         * Determines if an {OpenLayers.LonLat} is within the map view.
         * @function wLib.Geometry.isLonLatInMapExtent
         * @param {OpenLayers.LonLat} lonLat The LonLat to check.
         * @return {Boolean} Whether or not the LonLat is in the map extent.
         */
        this.isLonLatInMapExtent = function (lonLat) {
            'use strict';
            return lonLat && W.map.getExtent().containsLonLat(lonLat);
        };
    };

    /*** MODEL ***/
    function Model() {
        /**
         * Returns whether or not the passed object or object id represents a 
         * venue.
         * @function wLib.Model.isPlace
         * @param {(String|Venue)} place A string representing the id of 
         * the place to test (only works if place is in the data extent) or the 
         * venue model object itself.
         * @return {Boolean} Whether or not the place is a venue.
         */
        this.isPlace = function (place) {
            if (typeof place === 'string') {
                place = W.model.venues.get(place);
            }
            return place && place.CLASS_NAME === 'Waze.Feature.Vector.Landmark';
        },
    
        /**
         * Returns the geometry object representing the navigation stop point 
         * of a venue.
         * @function wLib.Model.getPlaceNavStopPoint
         * @param {(String|Venue)} place A string representing the id of 
         * the place to test (only works if place is in the data extent) or the 
         * venue model object itself.
         * @return {OL.Geometry.Point} The geometry object representing the 
         * navigation stop point of a venue.
         */
        this.getPlaceNavStopPoint = function (place) {
            if (typeof place === 'string') {
                place = W.model.venues.get(place);
            }
            return place && place.isPoint() ? place.geometry : place.attributes.entryExitPoints[0].point;
        };
    
        /**
        * Gets the IDs of any selected segments.
        * @function wLib.Model.getSelectedSegmentIDs
        * @return {Array} Array containing the IDs of selected segments.
        */
        this.getSelectedSegmentIDs = function () {
            'use strict';
            var i, n, selectedItems, item, segments = [];
            if (!W.selectionManager.hasSelectedItems()) {
                return false;
            } else {
                selectedItems = W.selectionManager.selectedItems;
                for (i = 0, n = selectedItems.length; i < n; i++) {
                    item = selectedItems[i].model;
                    if ('segment' === item.type) {
                        segments.push(item.attributes.id);
                    }
                }
                return segments.length === 0 ? false : segments;
            }
        };

        /**
         * Defers execution of a callback function until the WME map and data 
         * model are ready. Call this function before calling a function that 
         * causes a map and model reload, such as W.map.moveTo(). After the 
         * move is completed the callback function will be executed.
         * @function wLib.Model.onModelReady
         * @param {Function} callback The callback function to be executed.
         * @param {Boolean} now Whether or not to call the callback now if the
         * model is currently ready.
         * @param {Object} context The context in which to call the callback.
         */
        this.onModelReady = function (callback, now, context) {
            var deferModelReady = function () {
                return $.Deferred(function (dfd) {
                    var resolve = function () {
                        dfd.resolve();
                        W.model.events.unregister('mergeend', null, resolve);
                    };
                    W.model.events.register('mergeend', null, resolve);
                }).promise();
            };
            var deferMapReady = function () {
                return $.Deferred(function (dfd) {
                    var resolve = function () {
                        dfd.resolve();
                        W.vent.off('operationDone', resolve);
                    };
                    W.vent.on('operationDone', resolve);
                }).promise();
            };

            if (typeof callback === 'function') {
                context = context || callback;
                if (now && wLib.Util.mapReady() && wLib.Util.modelReady()) {
                    callback.call(context);
                } else {
                    $.when(deferMapReady() && deferModelReady()).
                        then(function () {
                            callback.call(context);
                        });
                }
            }
        };
    
        /**
         * Retrives a route from the Waze Live Map.
         * @class
         * @name wLib.Model.RouteSelection
         * @param firstSegment The segment to use as the start of the route.
         * @param lastSegment The segment to use as the destination for the route.
         * @param {Array|Function} callback A function or array of funcitons to be 
         * executed after the route
         * is retrieved. 'This' in the callback functions will refer to the 
         * RouteSelection object.
         * @param {Object} options A hash of options for determining route. Valid 
         * options are:
         * fastest: {Boolean} Whether or not the fastest route should be used. 
         * Default is false, which selects the shortest route.
         * freeways: {Boolean} Whether or not to avoid freeways. Default is false.
         * dirt: {Boolean} Whether or not to avoid dirt roads. Default is false.
         * longtrails: {Boolean} Whether or not to avoid long dirt roads. Default 
         * is false.
         * uturns: {Boolean} Whether or not to allow U-turns. Default is true.
         * @return {wLib.Model.RouteSelection} The new RouteSelection object.
         * @example: // The following example will retrieve a route from the Live Map and select the segments in the route.
         * selection = W.selectionManager.selectedItems;
         * myRoute = new wLib.Model.RouteSelection(selection[0], selection[1], function(){this.selectRouteSegments();}, {fastest: true});
         */
        this.RouteSelection = function (firstSegment, lastSegment, callback, options) {
            var i,
                n,
                start = this.getSegmentCenterLonLat(firstSegment),
                end = this.getSegmentCenterLonLat(lastSegment);
            this.options = {
                fastest: options && options.fastest || false,
                freeways: options && options.freeways || false,
                dirt: options && options.dirt || false,
                longtrails: options && options.longtrails || false,
                uturns: options && options.uturns || true
            };
            this.requestData = {
                from: 'x:' + start.x + ' y:' + start.y + ' bd:true',
                to: 'x:' + end.x + ' y:' + end.y + ' bd:true',
                returnJSON: true,
                returnGeometries: true,
                returnInstructions: false,
                type: this.options.fastest ? 'HISTORIC_TIME' : 'DISTANCE',
                clientVersion: '4.0.0',
                timeout: 60000,
                nPaths: 3,
                options: this.setRequestOptions(this.options)
            };
            this.callbacks = [];
            if (callback) {
                if (!(callback instanceof Array)) {
                    callback = [callback];
                }
                for (i = 0, n = callback.length; i < n; i++) {
                    if ('function' === typeof callback[i]) {
                        this.callbacks.push(callback[i]);
                    }
                }
            }
            this.routeData = null;
            this.getRouteData();
        };

        this.RouteSelection.prototype = 
            /** @lends wLib.Model.RouteSelection.prototype */ {
                
            /**
             * Formats the routing options string for the ajax request.
             * @private
             * @param {Object} options Object containing the routing options.
             * @return {String} String containing routing options.
             */
            setRequestOptions: function (options) {
                return 'AVOID_TOLL_ROADS:' + (options.tolls ? 't' : 'f') + ',' +
                    'AVOID_PRIMARIES:' + (options.freeways ? 't' : 'f') + ',' +
                    'AVOID_TRAILS:' + (options.dirt ? 't' : 'f') + ',' +
                    'AVOID_LONG_TRAILS:' + (options.longtrails ? 't' : 'f') + ',' +
                    'ALLOW_UTURNS:' + (options.uturns ? 't' : 'f');
            },
            
            /**
             * Gets the center of a segment in LonLat form.
             * @private
             * @param segment A Waze model segment object.
             * @return {OpenLayers.LonLat} The LonLat object corresponding to the
             * center of the segment.
             */
            getSegmentCenterLonLat: function (segment) {
                var x, y, componentsLength, midPoint;
                if (segment) {
                    componentsLength = segment.geometry.components.length;
                    midPoint = Math.floor(componentsLength / 2);
                    if (componentsLength % 2 === 1) {
                        x = segment.geometry.components[midPoint].x;
                        y = segment.geometry.components[midPoint].y;
                    } else {
                        x = (segment.geometry.components[midPoint - 1].x +
                            segment.geometry.components[midPoint].x) / 2;
                        y = (segment.geometry.components[midPoint - 1].y +
                            segment.geometry.components[midPoint].y) / 2;
                    }
                    return new OL.Geometry.Point(x, y).
                        transform(W.map.getProjectionObject(), 'EPSG:4326');
                }

            },
            
            /**
             * Gets the route from Live Map and executes any callbacks upon success.
             * @private
             * @returns The ajax request object. The responseJSON property of the 
             * returned object
             * contains the route information.
             *
             */
            getRouteData: function () {
                var i,
                    n,
                    that = this;
                return $.ajax({
                    dataType: 'json',
                    url: this.getURL(),
                    data: this.requestData,
                    dataFilter: function (data, dataType) {
                        return data.replace(/NaN/g, '0');
                    },
                    success: function (data) {
                        that.routeData = data;
                        for (i = 0, n = that.callbacks.length; i < n; i++) {
                            that.callbacks[i].call(that);
                        }
                    }
                });
            },
            
            /**
             * Extracts the IDs from all segments on the route.
             * @private
             * @return {Array} Array containing an array of segment IDs for
             * each route alternative.
             */
            getRouteSegmentIDs: function () {
                var i, j, route, len1, len2, segIDs = [],
                    routeArray = [],
                    data = this.routeData;
                if ('undefined' !== typeof data.alternatives) {
                    for (i = 0, len1 = data.alternatives.length; i < len1; i++) {
                        route = data.alternatives[i].response.results;
                        for (j = 0, len2 = route.length; j < len2; j++) {
                            routeArray.push(route[j].path.segmentId);
                        }
                        segIDs.push(routeArray);
                        routeArray = [];
                    }
                } else {
                    route = data.response.results;
                    for (i = 0, len1 = route.length; i < len1; i++) {
                        routeArray.push(route[i].path.segmentId);
                    }
                    segIDs.push(routeArray);
                }
                return segIDs;
            },
            
            /**
             * Gets the URL to use for the ajax request based on country.
             * @private
             * @return {String} Relative URl to use for route ajax request.
             */
            getURL: function () {
                if (W.model.countries.get(235) || W.model.countries.get(40)) {
                    return '/RoutingManager/routingRequest';
                } else if (W.model.countries.get(106)) {
                    return '/il-RoutingManager/routingRequest';
                } else {
                    return '/row-RoutingManager/routingRequest';
                }
            },
            
            /**
             * Selects all segments on the route in the editor.
             * @param {Integer} routeIndex The index of the alternate route.
             * Default route to use is the first one, which is 0.
             */
            selectRouteSegments: function (routeIndex) {
                var i, n, seg,
                    segIDs = this.getRouteSegmentIDs()[Math.floor(routeIndex) || 0],
                    segments = [];
                if ('undefined' === typeof segIDs) {
                    return;
                }
                for (i = 0, n = segIDs.length; i < n; i++) {
                    seg = W.model.segments.get(segIDs[i]);
                    if ('undefined' !== seg) {
                        segments.push(seg);
                    }
                }
                return W.selectionManager.select(segments);
            }
        };
    };

    /*** INTERFACE ***/
    function Interface() {
        /**
         * Generates id for message bars.
         * @private
         */
        var getNextID = function () {
            var id = 1;
            return function () {
                return id++;
            };
        } ();

        this.MessageBar = OL.Class(this, /** @lends wLib.Interface.MessageBar.prototype */ {
            $el: null,
            id: null,
            elementID: null,
            divStyle: {
                'margin': 'auto',
                'border-radius': '10px',
                'text-align': 'center',
                'width': '40%',
                'font-size': '1em',
                'font-weight': 'bold',
                'color': 'white'
            },
            
            /**
             * Class to store individual message information.
             * @class {Backbone.Model} Message
             * @private 
             */
            Message: Backbone.Model.extend({
                defaults: {
                    messageName: null,
                    messageType: 'info',
                    messageText: '',
                    displayDuration: null,
                    skipPrefix: false
                }
            }),
            
            /**
             * Class to display messages on page.
             * @class {Object} MessageView
             * @private 
             */
            MessageView: Backbone.View.extend({
                styles: {
                    defaultStyle: {
                        'border-radius': '20px',
                        'display': 'inline-block',
                        'padding': '5px',
                        'background-color': 'rgba(0,0,0,0.7)'
                    },
                    error: {
                        'background-color': 'rgba(180,0,0,0.9)',
                        'color': 'black'
                    },
                    warn: {
                        'background-color': 'rgba(230,230,0,0.9)',
                        'color': 'black'
                    },
                    info: {
                        'background-color': 'rgba(0,0,230,0.9)'
                    }
                },
                template: function () {
                    var messageText = '',
                        style,
                        $messageEl = $('<p/>');

                    if (!this.model.attributes.skipPrefix && this.messagePrefix) {
                        messageText = this.messagePrefix + ' ';
                    }

                    messageText += this.model.attributes.messageText;

                    style = (this.model.attributes.messageType &&
                        this.styles[this.model.attributes.messageType]) ?
                        this.styles[this.model.attributes.messageType] : this.styles.defaultStyle;
                    style = _.defaults(style, this.styles.defaultStyle);

                    $messageEl.
                        css(style).
                        text(messageText);

                    return $messageEl;
                },
                initialize: function () {
                    this.render();
                },
                render: function () {
                    this.$el.
                        append(this.template()).
                        appendTo(this.messageBar.$el).
                        fadeIn('fast').
                        delay(this.model.attributes.displayDuration ||
                            this.displayDuration || 5000).
                        fadeOut('slow', function () {
                            $(this).remove();
                        });
                    return this;
                }
            }),
            
            /**
             * Class to hold Messages.
             * @class {Object} MessageCollection
             * @private 
             */
            MessageCollection: Backbone.Collection.extend(),

            messages: null,
            
            /**
             * An object containing message attributes.
             * @typedef {Object} wLib.Interface.MessageBar.messageAttributes
             * @property {string} [messageName] The name of the message, used for 
             * looking up the message.
             * @property {string} [messageType] The name of the type/style of 
             * the message, used for looking up the message display css options. 
             * Default styles include 'info', 'warn', and 'error'. You can also use 
             * a custom-defined messageType (see {@link 
             * wLib.Interface.MessageBar.addMessageType}).
             * @property {string} messageText The text to display when showing the 
             * message.
             * @property {number} [displayDuration] The duration to display the 
             * message in milliseconds.
             * @property {boolean} [skipPrefix] Whether or not to skip the default 
             * message prefix when displaying the message.
             */
        
            /**
             * @typedef {object} wLib.Interface.MessageBar.options
             * @property {array<wLib.Interface.MessageBar.messageAttributes>} 
             * [messages] An array of objects containing message attributes to save 
             * during initialization.
             * @property {string} [messagePrefix] The prefix to prepend to each 
             * message. This can be disabled per message by using skipPrefix in the 
             * message attributes.
             * @property {number} [displayDuration] The duration to display message 
             * by default in milliseconds.
             * @property {object} [styles] Hash with keys representing a name for 
             * the style/messageType and values containing objects with css 
             * properties that style/messageType.
             */
        
            /**
             * Creates a new message bar.
             * @class
             * @name wLib.Interface.MessageBar
             * @param [options] {wLib.Interface.MessageBar.options} Options to set 
             * during initialization
             * @example myMessageBar = new wLib.Interface.MessageBar({
             *  messages: [{
             *      messageName: 'exampleMessage',
             *      messageType: 'info',
             *      displayDuration: 5000,
             *      skipPrefix: true
             *  }],
             *  displayDuration: 10000,
             *  messagePrefix: 'My Script:',
             *  styles: {
             *      'purpleBackground': {
             *          'background-color': 'rgba(255,0,255,0.9)'
             *      }
             *  }
             * }); 
             */
            initialize: function (options) {
                var $insertTarget = $('#search');

                options = _.defaults(options || {}, {
                    messagePrefix: null,
                    messages: [],
                    styles: {},
                    displayDuration: 5000
                });

                this.messages = new this.MessageCollection({ model: this.Message });
                this.id = getNextID();
                this.elementID = 'wlib-messagebar-' + this.id;

                _(options.styles).each(function (style, name) {
                    this.addMessageType(name, style);
                }, this);

                _(options.messages).each(function (message) {
                    this.messages.add(message);
                }, this);

                this.MessageView.prototype.messagePrefix = options.messagePrefix;
                this.MessageView.prototype.displayDuration = options.displayDuration;
                this.MessageView.prototype.messageBar = this;

                this.$el = $('<div/>').
                    css(this.divStyle).
                    attr('id', this.elementID);

                wLib.Util.waitForElement($insertTarget, function () {
                    this.$el.insertAfter($insertTarget);
                }, this);
            },
            
            /**
             * Adds a style for a message type.
             * @param {String} name The name of the message type/style.
             * @param style {Object} Object containing css properties and 
             * values to use for the new messageType.
             */
            addMessageType: function (name, style) {
                style = style || {};

                if (name) {
                    this.MessageView.prototype.styles[name] = style;
                }

                return this;
            },
            
            /**
             * Removes the message bar from the page.
             */
            destroy: function () {
                this.messages.reset();
                this.$el.remove();
            },
            
            /**
             * Displays a message.
             * @param {(string|wLib.Interface.MessageBar.messageAttributes)} message A hash with message options for a new message or the name of a saved message to look up.
             * @example myMessageBar.displayMessage('previouslysavedmessage');
             * @example myMessageBar.displayMessage({
             *      messageName: 'newMessage',
             *      messageType: 'warn',
             *      displayDuration: 5000,
             *      skipPrefix: true
             *  });
             */
            displayMessage: function (message) {
                if (typeof message === 'string') {
                    // look up message by name and display
                    message = this.messages.findWhere({ 'messageName': message });
                } else {
                    // add the new message object to the collection and display
                    message = this.messages.add(message);
                }
                new this.MessageView({
                    model: message
                });
                if (!message.attributes.messageName) {
                    this.messages.remove(message);
                }
            },
            
            /**
             * Adds a new message to the collection of saved messages.
             * @param {wLib.Interface.MessageBar.messageAttributes} messageObject 
             * The attributes to use for the new message.
             * @example myMessageBar.saveMessage({
             *      messageName: 'exampleMessage',
             *      messageType: 'info',
             *      displayDuration: 5000,
             *      skipPrefix: true
             * });
             */
            saveMessage: function (messageObject) {
                this.messages.add(messageObject);
                return this;
            }
        });

        this.Options = OL.Class(this,
        /** @lends wLib.Interface.Options.prototype */ {
                localStorageName: null,
                options: {},
                
                /**
                 * Creates a new Options object to handle saving and retrieving 
                 * script options. During initialization, any options stored under 
                 * the named key in localStorage will be loaded. Any options 
                 * provided as a parameter to the constructor will be applied to 
                 * the retrieved options and thus may overwrite any stored values.
                 * @name wLib.Interface.Options
                 * @class
                 * @param {String} name The string used as the localStorage key 
                 * under which to store the options.
                 * @param {Object} options A hash containing options to set during 
                 * initialization.
                 * @example var myOptions = new wLib.Interface.Options('thebestscriptever', {scriptVersion: x});
                 * myOptions.set('option1', true);
                 * myOptions.set({'option2': false, 'option3': 'very true'});
                 * myOptions.get('option2') === false // true;
                 */
                initialize: function (name, options) {
                    var i = 1;

                    if (window.localStorage && typeof name === 'string') {

                        this.localStorageName = name.toLowerCase().
                            replace(/[^a-z]/g, '');

                        if (localStorage.getItem(this.localStorageName)) {
                            while (localStorage.getItem(
                                this.localStorageName + i)) {
                                i += 1;
                            }
                            this.localStorageName = this.localStorageName + i;
                        }

                        this.retrieveOptions();

                        if (options && _.isObject(options)) {
                            this.set(options);
                        }
                    }
                },
                
                /**
                 * Clears all stored options.
                 */
                clear: function () {
                    this.options = null;
                    this.saveOptions();
                    return this;
                },
                
                /**
                 * Retrieves a stored value. If no key is specified, the entire 
                 * options object is returned.
                 * @param {String} key Optional. The key to retrieve.
                 */
                get: function (key) {
                    return key && this.options[key] || this.options;
                },
                
                /**
                 * Saves the options to localStorage
                 * @private
                 */
                saveOptions: function () {
                    localStorage[this.localStorageName] =
                    JSON.stringify(this.options);
                },
                
                /**
                 * Stores a value under the provided key. Provide either an object 
                 * hash of keys and values to store as a single parameter or 
                 * provide a key and value as two parameters.
                 * @param {Object} key The name of the option. Can be string, 
                 * number if providing a value as the second parameter, or a hash 
                 * of multiple options (see function description).
                 * @param {Any} value The value to store. Not used if providing a 
                 * hash as the first argument.
                 * @example myOptions.set('option1', true); // or
                 * myOptions.set({'option2': false, 'option3': 'very true'});
                 */
                set: function (key, value) {
                    var j;
                    if ((typeof key === 'string' || !isNaN(key)) && value) {
                        this.options[key] = value;
                    } else if (_.isObject(key)) {
                        for (j in key) {
                            if (key.hasOwnProperty(j)) {
                                this.options[j] = key[j];
                            }
                        }
                    }
                    this.saveOptions();
                    return this;
                }, 
                          
                /**
                 * Retrieves options previously stored in localStorage.
                 * @private
                 */
                retrieveOptions: function () {
                    var options = localStorage[this.localStorageName];
                    if (options) {
                        this.options = options;
                    }
                }
            });

        this.Shortcut = OL.Class(this, /** @lends wLib.Interface.Shortcut.prototype */ {
            name: null,
            group: null,
            shortcut: {},
            callback: null,
            scope: null,
            groupExists: false,
            actionExists: false,
            eventExists: false,
            defaults: {
                group: 'default'
            },
                
            /**
             * Creates a new {wLib.Interface.Shortcut}.
             * @class
             * @name wLib.Interface.Shortcut
             * @param name {String} The name of the shortcut.
             * @param group {String} The name of the shortcut group.
             * @param shortcut {String} The shortcut key(s). The shortcut  
             * should be of the form 'i' where i is the keyboard shortuct or 
             * include modifier keys  such as 'CSA+i', where C = the control 
             * key, S = the shift key, A = the alt key, and i = the desired 
             * keyboard shortcut. The modifier keys are optional.
             * @param callback {Function} The function to be called by the 
             * shortcut.
             * @param scope {Object} The object to be used as this by the 
             * callback.
             * @return {wLib.Interface.Shortcut} The new shortcut object.
             * @example //Creates new shortcut and adds it to the map.
             * shortcut = new wLib.Interface.Shortcut('myName', 'myGroup', 'C+p', callbackFunc, null).add();
             */
            initialize: function (name, group, shortcut, callback, scope) {
                if ('string' === typeof name && name.length > 0 &&
                    'string' === typeof shortcut && shortcut.length > 0 &&
                    'function' === typeof callback) {
                    this.name = name;
                    this.group = group || this.defaults.group;
                    this.callback = callback;
                    this.shortcut[shortcut] = name;
                    if ('object' !== typeof scope) {
                        this.scope = null;
                    } else {
                        this.scope = scope;
                    }
                    return this;
                }
            },
                
            /**
            * Determines if the shortcut's group already exists.
            * @private
            */
            doesGroupExist: function () {
                this.groupExists = 'undefined' !== typeof W.accelerators.Groups[this.group] &&
                undefined !== typeof W.accelerators.Groups[this.group].members &&
                W.accelerators.Groups[this.group].length > 0;
                return this.groupExists;
            },
                
            /**
            * Determines if the shortcut's action already exists.
            * @private
            */
            doesActionExist: function () {
                this.actionExists = 'undefined' !== typeof W.accelerators.Actions[this.name];
                return this.actionExists;
            },
                
            /**
            * Determines if the shortcut's event already exists.
            * @private
            */
            doesEventExist: function () {
                this.eventExists = 'undefined' !== typeof W.accelerators.events.listeners[this.name] &&
                W.accelerators.events.listeners[this.name].length > 0 &&
                this.callback === W.accelerators.events.listeners[this.name][0].func &&
                this.scope === W.accelerators.events.listeners[this.name][0].obj;
                return this.eventExists;
            },
                
            /**
            * Creates the shortcut's group.
            * @private
            */
            createGroup: function () {
                W.accelerators.Groups[this.group] = [];
                W.accelerators.Groups[this.group].members = [];
            },
                
            /**
            * Registers the shortcut's action.
            * @private
            */
            addAction: function () {
                W.accelerators.addAction(this.name, { group: this.group });
            },
                
            /**
            * Registers the shortcut's event.
            * @private
            */
            addEvent: function () {
                W.accelerators.events.register(this.name, this.scope, this.callback);
            },
                
            /**
            * Registers the shortcut's keyboard shortcut.
            * @private
            */
            registerShortcut: function () {
                W.accelerators._registerShortcuts(this.shortcut);
            },
                
            /**
            * Adds the keyboard shortcut to the map.
            * @return {wLib.Interface.Shortcut} The keyboard shortcut.
            */
            add: function () {
                /* If the group is not already defined, initialize the group. */
                if (!this.doesGroupExist()) {
                    this.createGroup();
                }

                /* Clear existing actions with same name */
                if (this.doesActionExist()) {
                    W.accelerators.Actions[this.name] = null;
                }
                this.addAction();

                /* Register event only if it's not already registered */
                if (!this.doesEventExist()) {
                    this.addEvent();
                }

                /* Finally, register the shortcut. */
                this.registerShortcut();
                return this;
            },
                
            /**
            * Removes the keyboard shortcut from the map.
            * @return {wLib.Interface.Shortcut} The keyboard shortcut.
            */
            remove: function () {
                if (this.doesEventExist()) {
                    W.accelerators.events.unregister(this.name, this.scope, this.callback);
                }
                if (this.doesActionExist()) {
                    delete W.accelerators.Actions[this.name];
                }
                //remove shortcut?
                return this;
            },
                
            /**
            * Changes the keyboard shortcut and applies changes to the map.
            * @return {wLib.Interface.Shortcut} The keyboard shortcut.
            */
            change: function (shortcut) {
                if (shortcut) {
                    this.shortcut = {};
                    this.shortcut[shortcut] = this.name;
                    this.registerShortcut();
                }
                return this;
            }
        }),

        this.Tab = OL.Class(this, {
            /** @lends wLib.Interface.Tab */
            TAB_SELECTOR: '#user-tabs ul.nav-tabs',
            CONTENT_SELECTOR: '#user-info div.tab-content',
            callback: null,
            $content: null,
            context: null,
            $tab: null,
            
            /**
             * Creates a new wLib.Interface.Tab. The tab is appended to the WME 
             * editor sidebar and contains the passed HTML content.
             * @class
             * @name wLib.Interface.Tab
             * @param {String} name The name of the tab. Should not contain any 
             * special characters.
             * @param {String} content The HTML content of the tab.
             * @param {Function} [callback] A function to call upon successfully 
             * appending the tab.
             * @param {Object} [context] The context in which to call the callback 
             * function.
                     * @return {wLib.Interface.Tab} The new tab object.
             * @example //Creates new tab and adds it to the page.
             * new wLib.Interface.Tab('thebestscriptever', '<div>Hello World!</div>');
             */
            initialize: function (name, content, callback, context) {
                var idName, i = 0;
                if (name && 'string' === typeof name &&
                    content && 'string' === typeof content) {
                    if (callback && 'function' === typeof callback) {
                        this.callback = callback;
                        this.context = context || callback;
                    }
                    /* Sanitize name for html id attribute */
                    idName = name.toLowerCase().replace(/[^a-z-_]/g, '');
                    /* Make sure id will be unique on page */
                    while (
                        $('#sidepanel-' + (i ? idName + i : idName)).length > 0) {
                        i++;
                    }
                    if (i) {
                        idName = idName + i;
                    }
                    /* Create tab and content */
                    this.$tab = $('<li/>')
                        .append($('<a/>')
                            .attr({
                                'href': '#sidepanel-' + idName,
                                'data-toggle': 'tab',
                            })
                            .text(name));
                    this.$content = $('<div/>')
                        .addClass('tab-pane')
                        .attr('id', 'sidepanel-' + idName)
                        .html(content);

                    this.appendTab();
                }
            },

            append: function (content) {
                this.$content.append(content);
            },

            appendTab: function () {
                wLib.Util.waitForElement(
                    this.TAB_SELECTOR + ',' + this.CONTENT_SELECTOR,
                    function () {
                        $(this.TAB_SELECTOR).append(this.$tab);
                        $(this.CONTENT_SELECTOR).first().append(this.$content);
                        if (this.callback) {
                            this.callback.call(this.context);
                        }
                    }, this);
            },

            clearContent: function () {
                this.$content.empty();
            },

            destroy: function () {
                this.$tab.remove();
                this.$content.remove();
            }
        });
    };

    /*** Utilities ***/
    function Util() {
        /**
         * Function to track the ready state of the map.
         * @function wLib.Util.mapReady
         * @return {Boolean} Whether or not a map operation is pending or 
         * undefined if the function has not yet seen a map ready event fired.
         */
        this.mapReady = function () {
            var mapReady = true;
            W.vent.on('operationPending', function () {
                mapReady = false;
            });
            W.vent.on('operationDone', function () {
                mapReady = true;
            });
            return function () {
                return mapReady;
            };
        } ();

        /**
         * Function to track the ready state of the model.
         * @function wLib.Util.modelReady
         * @return {Boolean} Whether or not the model has loaded objects or 
         * undefined if the function has not yet seen a model ready event fired.
         */
        this.modelReady = function () {
            var modelReady = true;
            W.model.events.register('mergestart', null, function () {
                modelReady = false;
            });
            W.model.events.register('mergeend', null, function () {
                modelReady = true;
            });
            return function () {
                return modelReady;
            };
        } ();
    
        /**
         * Function to defer function execution until an element is present on 
         * the page.
         * @function wLib.Util.waitForElement
         * @param {String} selector The CSS selector string or a jQuery object 
         * to find before executing the callback.
         * @param {Function} callback The function to call when the page 
         * element is detected.
         * @param {Object} [context] The context in which to call the callback.
         */
        this.waitForElement = function (selector, callback, context) {
            var jqObj;

            if (!selector || typeof callback !== 'function') {
                return;
            }

            jqObj = typeof selector === 'string' ?
                $(selector) : selector instanceof $ ? selector : null;

            if (!jqObj.size()) {
                window.requestAnimationFrame(function () {
                    wLib.Util.waitForElement(selector, callback, context);
                });
            } else {
                callback.call(context || callback);
            }
        };
    
        /**
         * Returns a callback function in the appropriate scope.
         * @function wLib.Util.createCallback
         * @private
         * @param {function} func The callback function.
         * @param {object} [scope] The scope in which to call the callback.
         * @return {function} A function that returns the callback function 
         * called in the appropriate scope.
         */
        this.createCallback = function (func, scope) {
            return typeof func === 'function' && function () {
                return func.call(scope || func);
            };
        };

    };

    /*** API ***/
    function API() {

        this.UpdateFeatureAddress = function () {
            return require('Waze/Action/UpdateFeatureAddress');
        } ();

        this.UpdateFeatureGeometry = function () {
            return require('Waze/Action/UpdateFeatureGeometry');
        } ();

        this.UpdateObject = function () {
            return require('Waze/Action/UpdateObject');
        } ();

        this.UpdateSegmentGeometry = function () {
            return require('Waze/Action/UpdateSegmentGeometry');
        } ();
    
        /**
         * Updates the address for a place (venue).
         * @function wLib.api.updateFeatureAddress
         * @param {(String|Venue)} place A string containing the id of 
         * the venue to change or the venue model object itself.
         * @param address {Object} An object containing the country, state, city, 
         * and street objects to use as the new address.
         * objects.
         */
        this.updateFeatureAddress = function (place, address) {
            'use strict';
            var newAttributes,
                UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
            if (typeof place === 'string') {
                place = W.model.venues.get(place);
            }
            if (place && place.CLASS_NAME === 'Waze.Feature.Vector.Landmark' &&
                address && address.state && address.country) {
                newAttributes = {
                    countryID: address.country.id,
                    stateID: address.state.id,
                    cityName: address.city.name,
                    emptyCity: address.city.name ? null : true,
                    streetName: address.street.name,
                    emptyStreet: address.street.name ? null : true
                };
                W.model.actionManager.add(
                    new UpdateFeatureAddress(place, newAttributes));
            }
        };
    
        /**
         * Updates the geometry of a place (venue) in WME.
         * @function wLib.api.updateFeatureGeometry
         * @param {(String|Venue)} place A string containing the id of 
         * the venue to change or the venue model object itself.
         * @param {(OL.Geometry.Point|OL.Geometry.Polygon)} newGeometry The 
         * geometry object to use as the new geometry for the venue.
         */
        this.updateFeatureGeometry = function (place, newGeometry) {
            var oldGeometry,
                model = W.model.venues,
                WMEUPdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
            if (typeof place === 'string') {
                place = W.model.venues.get(place);
            }
            if (place && place.CLASS_NAME === 'Waze.Feature.Vector.Landmark' &&
                newGeometry && (newGeometry instanceof OL.Geometry.Point ||
                    newGeometry instanceof OL.Geometry.Polygon)) {
                oldGeometry = place.attributes.geometry.clone();
                W.model.actionManager.add(
                    new WMEUPdateFeatureGeometry(place, model, oldGeometry,
                        newGeometry));
            }
        };
    };
}.call(this));
