// ==UserScript==
// @name            WME Show Streets
// @description     Shows streets at zooms <= 3
// @version         0.01
// @author          SAR85
// @copyright       SAR85
// @license         CC BY-NC-ND
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://editor-beta.waze.com/*
// @namespace       https://greasyfork.org/users/9321
// @downloadURL https://update.greasyfork.org/scripts/9636/WME%20Show%20Streets.user.js
// @updateURL https://update.greasyfork.org/scripts/9636/WME%20Show%20Streets.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var layerName = 'Zoomed Streets',
        layerStyleMap = new OL.StyleMap({
            default: new OL.Style({
                strokeColor: 'white'
            })
        }),
        map = W.map,
        mapProjectionObj = map.getProjectionObject(),
        segmentProjection = W.controller.segmentProjection;

    /**
     * Transforms an {OpenLayers.Bounds} object from the map projection to the 
     * projection used for segments.
     * @param   {OpenLayers.Bounds} bounds The bounds object to be transformed.
     * @returns {String} String containing the BBOX version of the transformed bounds.
     */
    function segmentBoundsTransform(bounds) {
        return bounds.transform(mapProjectionObj, segmentProjection).toBBOX();
    }

    /**
     * Splits an {OpenLayers.Bounds} object into multiple bounds objects.
     * @param   {OpenLayers.Bounds} bounds The bounds object to be split.
     * @param   {Number}            div    The number of x- and y-axis divisions to make.
     * @returns {Array}             An array of {OpenLayers.Bounds} objects.
     */
    function splitBounds(bounds, div) {
        var x,
            y,
            boundsArray = [],
            sectionWidth = bounds.getWidth() / div,
            sectionHeight = bounds.getHeight() / div;
        if (!bounds || !div) {
            return;
        }
        for (y = 0; y < div; y++) {
            for (x = 0; x < div; x++) {
                boundsArray.push(new OL.Bounds(
                    bounds.left + sectionWidth * x,
                    bounds.top - sectionHeight * (y + 1),
                    bounds.left + sectionWidth * (x + 1),
                    bounds.top - sectionHeight * y
                ));
            }
        }
        return boundsArray;
    }

    /**
     * Retrieves all street-type segments in the map extent and displays them on
     * the map.
     */
    function drawStreets() {
        var i,
            n,
            segmentRequest = [],
            bbox,
            bboxArray = [],
            layer = map.getLayersByName(layerName)[0],
            mapExtent = map.getExtent(),
            zoom = map.zoom;

        //remove existing features from layer
        map.getLayersByName(layerName)[0].removeAllFeatures();

        //return if layer is not visible
        if (!layer.getVisibility()) {
            return;
        }

        if (zoom === 3) {
            bboxArray.push(mapExtent);
        } else if (zoom === 2) {
            bboxArray = splitBounds(mapExtent, 2);
        } else if (zoom === 1) {
            bboxArray = splitBounds(mapExtent, 3);
        } else if (zoom === 0) {
            bboxArray = splitBounds(mapExtent, 4);
        } else {
            return;
        }

        for (i = 0, n = bboxArray.length; i < n; i++) {
            bbox = bboxArray[i];
            //layer.addFeatures(new OL.Feature.Vector(bbox.toGeometry()));
            //continue;
            $.get(W.Config.paths.features, {
                bbox: segmentBoundsTransform(bboxArray[i]),
                roadTypes: '1'
            }).done(function(t, status, jqXHR) {
                var i, n, j, s, currentObj, geo, lonlat, features = [];
                if (t && t.segments.objects) {
                    for (i = 0, n = t.segments.objects.length; i < n; i++) {
                        currentObj = t.segments.objects[i];
                        geo = new OL.Geometry[currentObj.geometry.type]();
                        for (j = 0, s = currentObj.geometry.coordinates.length; j < s; j++) {
                            lonlat = new OL.LonLat(currentObj.geometry
                                .coordinates[j][0], currentObj.geometry.coordinates[j][1]);
                            geo.addPoint(lonlat.toPoint().transform(W.controller
                                .segmentProjection, W.map.getProjectionObject()));
                        }
                        features.push(new OL.Feature.Vector(geo));
                    }
                    layer.addFeatures(features);
                    console.debug(status);
                }
            });
        }
        layer.redraw();
    }

    /**
     * Initializes the script
     */
    function init() {
        if (map.getLayersByName(layerName).length === 0) {
            map.addLayer(new OL.Layer.Vector(layerName, {
                styleMap: layerStyleMap,
                shortcutKey: 'S+S'
            }));
        }
        W.map.events.unregister('moveend', null, drawStreets);
        W.map.events.register('moveend', null, drawStreets);
        W.loginManager.events.register('afterloginchanged', null, init);
    }

    function bootstrap() {
    	var bGreasemonkeyServiceDefined = false;
    	try {
    		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService) {
    			bGreasemonkeyServiceDefined = true;
    		}
    	} catch (err) {
    		/* Ignore. */
    	}
    	if (undefined === typeof unsafeWindow || !bGreasemonkeyServiceDefined) {
    		unsafeWindow = (function () {
    			var dummyElem = document.createElement('p');
    			dummyElem.setAttribute('onclick', 'return window;');
    			return dummyElem.onclick();
    		})();
    	}
    	/* begin running the code! */
    	if (undefined !== typeof W.loginManager.events.register &&
            undefined !== typeof W.map.events.register) {
    		window.setTimeout(init, 100);
    	} else {
    		window.setTimeout(function () {
    			bootstrap();
    		}, 1000);
    	}
    }

    window.setTimeout(bootstrap, 100);
}());