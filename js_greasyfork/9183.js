// ==UserScript==
// @name         	WME HN Tool
// @description		Highlights un-nudged house numbers
// @version      	1.40.2
// @author			SAR85
// @copyright		SAR85
// @license		 	CC BY-NC-ND
// @grant		 	none
// @include			https://www.waze.com/editor/*
// @include			https://www.waze.com/*/editor/*
// @include			https://editor-beta.waze.com/*
// @namespace		https://greasyfork.org/users/9321
// @require         https://greasyfork.org/scripts/9794-wlib/code/wLib.js?version=106259
// @downloadURL https://update.greasyfork.org/scripts/9183/WME%20HN%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/9183/WME%20HN%20Tool.meta.js
// ==/UserScript==

/* global W */
/* global wLib */

(function () {
    'use strict';
    var hnControl,
        hnControlPrototype,
        hnMarkerLayer,
        messageBar;
    
    /**
     * Changes the highlight status of an HN marker.
     * @param {Object} marker The HN marker to highlight.
     * @param {Boolean} highlight True to highlight, false to unhighlight.
     */
    function changeHighlight(marker, highlight) {
        var color = highlight ? '#FFAD85' : 'white';
        if (marker) {
            marker.icon.$div.find('.uneditable-number').
                    css('background-color', color);
            marker.inputWrapper.css('background-color', color);
        }
    }
    
    /**
     * Nudges all currently loaded house numbers.
     */
    function nudgeAll() {
        var i,
            n,
            currentMarker,
            count = 0,
            hnMarkers = hnMarkerLayer.markers,
            objectForUpdate,
            oldGeometry;
        
        if (!hnControl) { return; }
        
        if (hnControl.selectedNumber) {
            hnControl.unselectNumber(hnControl.selectedNumber);
        }
        
        objectForUpdate = {
            model: W.model,
            houseNumberSets: hnControl.houseNumberSets,
            ignoreUpdates: hnControlPrototype.prototype.ignoreUpdates,
            originalGeometry: null,
            selectedNumber: null
        };
        
        for (i = 0, n = hnMarkers.length; i < n; i++) {
            currentMarker = hnMarkers[i];
            
            if (currentMarker && null === currentMarker.model.updatedBy) {
                
                oldGeometry = currentMarker.model.geometry.clone();
                currentMarker.model.geometry.x += 0.0001;
                
                objectForUpdate.originalGeometry = oldGeometry;
                objectForUpdate.selectedNumber = currentMarker;
                
                hnControlPrototype.prototype.onDragEnd.call(objectForUpdate,
                    objectForUpdate); 
                count++;
            }
        }
        
        messageBar.displayMessage({
            messageText: count + ' house numbers nudged.', 
            messageType: 'info'
        });
    }
    
    /**
     * Highlights never-edited house numbers.
     */
	function highlightUntouched(retryCount) {
        var i,
            n,
            marker,
            hnMarkers;
		retryCount = retryCount || 0;
		hnMarkers = hnMarkerLayer.markers;
		if (hnMarkers.length === 0) {
			if (retryCount < 1000) {
				console.debug('HN Tool: HN Markers not found. Retry #' + (retryCount + 1));
				setTimeout(function () {
					highlightUntouched(++retryCount);
				}, 10);
			} else {
				console.debug('HN Tool: HN Markers not found. Giving up.');
				return;
			}
		}
		for (i = 0, n = hnMarkers.length; i < n; i++) {
			marker = hnMarkers[i];
			if (marker.model && null === marker.model.updatedBy) {
                changeHighlight(marker, true);
			}
		}
    }
    
    /**
     * Checks for the presence of the HN map layer.
     */
	function checkForHNLayer() {
		var layers = W.map.getLayersByName('houseNumberMarkers');
		if (layers.length > 0) {
			hnMarkerLayer = layers[0];
			highlightUntouched();
		}
    }
    
    /**
     * Stores version and changes info and alerts user.
     */
	function updateAlert() {
		var hnVersion = '1.40.2',
			alertOnUpdate = true,
            versionChanges = 'WME Highlight HNs has been updated to ' +
                hnVersion + '.\n';

        versionChanges += 'Changes:\n';
        versionChanges += '[*] Updated for editor compatibility. \n';

        if (alertOnUpdate && window.localStorage &&
            window.localStorage.hnVersion !== hnVersion) {
			window.localStorage.hnVersion = hnVersion;
			alert(versionChanges);
		}
    }
    
    /**
     * Initializes the script variables.
     */
    function hnInit() {
        var segmentEditor = require('Waze/Presenter/FeatureEditor/Segment');
        var customRender = function () {
                hnControlPrototype.prototype.render.call(hnControl);
                checkForHNLayer();
            },
            customOnDragEnd = function () {
                hnControlPrototype.prototype.onDragEnd.call(hnControl);
                changeHighlight(hnControl.selectedNumber, false);
            };
        
        var editHNs = function () {
            var e = this.model.children.clone(),
                t = this.model.children.first(),
                i = t.getEntireStreet(this.dataModel),
                y = require('Waze/Control/HouseNumbers'),
                n = new y({
                    model: this.dataModel,
                    map: W.map,
                    editable: t.canEditHouseNumbers(),
                    segments: i
                });
            n.on("destroy", function () {
                this.selectionManager.select(e);
                hnControl = null;
            }, this);
            hnControl = n;
            hnControl.render = customRender;
            hnControl.onDragEnd = customOnDragEnd;
        };
        
        hnControlPrototype = require('Waze/Control/HouseNumbers') ||
        function () { };
        
        segmentEditor.prototype.editHouseNumbers = editHNs;
        window.require.define('Waze/Presenter/FeatureEditor/Segment', segmentEditor);
        
		messageBar = new wLib.Interface.MessageBar({
			messagePrefix: 'WME HN Tool:'
        });
        
        if (W.loginManager.user.normalizedLevel > 2) {
            new wLib.Interface.Shortcut(
                'nudgeHN', 'editing', 'CS+h', nudgeAll, this).add();
        }

		console.debug('HN Tool: Initialized.');
		updateAlert();
    }
    
    /**
     * Checks for necessary DOM and WME elements before initialization.
     */
    function hnBootstrap(count) {
        count = count || 0;
        
        if ('undefined' !== typeof wLib &&
            window.W &&
            window.W.map &&
            window.W.map.events &&
            window.W.map.events.register &&
            window.W.loginManager &&
            window.W.loginManager.user &&
            window.W.loginManager.user.normalizedLevel &&
            window.require) {
            console.debug('HN Tool: Initializing...');
            hnInit();
            /*
            $.get(W.Config.api_base + '/info/version').done(function (data) {
                if (data.version === '1.2.104-4369560') {
                    hnInit();
                } else {
                    console.error(
                        'HN Tool: WME version problem. Contact SAR85.');
                }
            }).fail(function () {
                console.error('HN Tool: WME version could not be verified.');
            });
            */
		} else if (count < 10) {
			console.debug('HN Tool: Bootstrap failed. Trying again...');
			window.setTimeout(function () {
				hnBootstrap(++count);
			}, 1000);
		} else {
			console.error('HN Tool: Bootstrap error.');
		}
    }
    
	console.debug('HN Tool: Bootstrap...');
    hnBootstrap();
} ());