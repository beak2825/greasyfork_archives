// ==UserScript==
// @name         WME Level Age Filter
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2025.01.21
// @description  Level highlighter with age filter for old segments
// @icon         https://i.ibb.co/ckSvk59/waze-icon.png
// @author       Assistant
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563413/WME%20Level%20Age%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/563413/WME%20Level%20Age%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("=== WME Level Age Filter LOADING ===");
    
    var SCRIPT_VERSION = "2025.01.21";
    var highlightedSegmentIds = [];
    var foundSegmentsList = [];
    var autoRefreshInterval = null;
    var autoRefreshEnabled = false;
    
    var HIGHLIGHT_GREEN = "#00ff00";
    var HIGHLIGHT_BLUE = "#0066ff";
    var HIGHLIGHT_RED = "#ff0000"; // For old segments
    var HIGHLIGHT_OPACITY = 0.7;
    var levelIcon = '⏰';

    // Local storage keys
    var STORAGE_KEYS = {
        selectedLevel: 'wme_age_filter_level',
        daysOld: 'wme_age_filter_days',
        colorMode: 'wme_age_filter_color_mode',
        customColor: 'wme_age_filter_custom_color',
        autoRefresh: 'wme_age_filter_auto_refresh',
        ageFilterDays: 'wme_age_filter_age_days',
        levelFilterEnabled: 'wme_age_filter_level_enabled',
        roadTypeFilterEnabled: 'wme_age_filter_roadtype_enabled',
        selectedRoadTypes: 'wme_age_filter_selected_roadtypes'
    }

    // Road type mapping
    var ROAD_TYPES = {
        1: 'Street',
        2: 'Primary Street', 
        3: 'Freeway',
        4: 'Ramp',
        5: 'Walking Trail',
        6: 'Major Highway',
        7: 'Minor Highway',
        8: 'Dirt Road',
        10: 'Pedestrian Boardwalk',
        14: 'Ferry',
        15: 'Stairway',
        16: 'Private Road',
        17: 'Railroad',
        18: 'Runway/Taxiway',
        19: 'Parking Lot Road',
        20: 'Service Road'
    };

    function toggleAutoRefresh() {
        var autoRefreshCheckbox = getId('_cbAutoRefresh');
        if (!autoRefreshCheckbox) return;

        autoRefreshEnabled = autoRefreshCheckbox.checked;
        saveToLocalStorage(STORAGE_KEYS.autoRefresh, autoRefreshEnabled.toString());

        if (autoRefreshEnabled) {
            console.log("Auto-refresh enabled (5 seconds)");
            autoRefreshInterval = setInterval(function() {
                console.log("Auto-refresh: Running highlighter...");
                runHighlighter();
            }, 5000);
            
            var runButton = getId('_btnRunHighlighter');
            if (runButton) {
                runButton.style.background = "#FF9800";
                runButton.textContent = "AUTO REFRESH ON";
            }
        } else {
            console.log("Auto-refresh disabled");
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
            
            var runButton = getId('_btnRunHighlighter');
            if (runButton) {
                runButton.style.background = "#4CAF50";
                runButton.textContent = "RUN HIGHLIGHTER";
            }
        }
    }

    function saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            console.log("Saved:", key, "=", value);
        } catch (e) {
            console.log("Could not save to localStorage:", e);
        }
    }

    function loadFromLocalStorage(key, defaultValue) {
        try {
            var value = localStorage.getItem(key);
            console.log("Loaded:", key, "=", value || defaultValue);
            return value !== null ? value : defaultValue;
        } catch (e) {
            console.log("Could not load from localStorage:", e);
            return defaultValue;
        }
    }

    function getId(node) {
        return document.getElementById(node);
    }

    function getColorMode() {
        var green = getId('_rbHilightGreen');
        var blue = getId('_rbHilightBlue');
        var custom = getId('_rbHilightCustom');
        
        if (green && green.checked) return 'green';
        if (blue && blue.checked) return 'blue';
        if (custom && custom.checked) return 'custom';
        return 'green';
    }

    function getHighlightColor(mode, customColor) {
        if (mode === 'green') return HIGHLIGHT_GREEN;
        if (mode === 'blue') return HIGHLIGHT_BLUE;
        if (mode === 'custom') return customColor;
        return HIGHLIGHT_GREEN;
    }

    function updateCustomColorVisibility() {
        var customRadio = getId('_rbHilightCustom');
        var colorPicker = getId('_customColorPicker');
        if (customRadio && colorPicker) {
            colorPicker.style.display = customRadio.checked ? 'inline-block' : 'none';
        }
    }

    // Get selected road types
    function getSelectedRoadTypes() {
        var roadTypes = [];
        for (var roadType in ROAD_TYPES) {
            var checkbox = getId('_cbRoadType' + roadType);
            if (checkbox && checkbox.checked) {
                roadTypes.push(parseInt(roadType));
            }
        }
        return roadTypes;
    }

    function updateRoadTypeVisibility() {
        var roadTypeFilterCheckbox = getId('_cbRoadTypeFilter');
        var roadTypeContainer = getId('_roadTypeContainer');
        if (roadTypeFilterCheckbox && roadTypeContainer) {
            roadTypeContainer.style.display = roadTypeFilterCheckbox.checked ? 'block' : 'none';
        }
    }

    function updateLevelVisibility() {
        var levelFilterCheckbox = getId('_cbLevelFilter');
        var levelContainer = getId('_levelContainer');
        if (levelFilterCheckbox && levelContainer) {
            levelContainer.style.display = levelFilterCheckbox.checked ? 'block' : 'none';
        }
    }

    function resetAllHighlights() {
        console.log("=== RESETTING ALL HIGHLIGHTS ===");
        
        if (!window.W || !window.W.model || !window.W.model.segments) return;

        var resetCount = 0;
        for (var seg in W.model.segments.objects) {
            var segment = W.model.segments.getObjectById(seg);
            if (!segment || !segment.attributes) continue;
            
            try {
                var line = W.userscripts.getFeatureElementByDataModel(segment);
                if (line) {
                    line.removeAttribute("stroke");
                    line.removeAttribute("stroke-opacity");
                    line.removeAttribute("stroke-width");
                    line.removeAttribute("stroke-dasharray");
                    resetCount++;
                }
            } catch (e) {}
        }
        
        console.log("Reset highlights on", resetCount, "segments");
        highlightedSegmentIds = [];
        foundSegmentsList = [];
        updateEditorsDisplay();
    }

    function selectSegmentById(segmentId) {
        if (!window.W || !window.W.model || !window.W.model.segments || !window.W.selectionManager) return;

        try {
            var segment = W.model.segments.getObjectById(segmentId);
            if (segment) {
                W.selectionManager.unselectAll();
                W.selectionManager.setSelectedModels([segment]);
                
                setTimeout(function() {
                    try {
                        if (W.selectionManager.getSelectedWMEFeatures && W.selectionManager.getSelectedWMEFeatures().length > 0) {
                            if (W.map && W.map.zoomToSelection) {
                                W.map.zoomToSelection();
                                return;
                            }
                        }
                        
                        if (segment.getOLGeometry) {
                            var olGeometry = segment.getOLGeometry();
                            if (olGeometry && olGeometry.getExtent) {
                                var extent = olGeometry.getExtent();
                                var olMap = W.map.getOLMap();
                                if (olMap && olMap.getView) {
                                    var view = olMap.getView();
                                    if (view.fit) {
                                        view.fit(extent, {
                                            padding: [100, 100, 100, 100],
                                            maxZoom: 6,
                                            duration: 500
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                        
                        console.log("Successfully zoomed to segment:", segmentId);
                        
                    } catch (zoomError) {
                        console.log("Zoom failed for segment", segmentId, ":", zoomError);
                    }
                }, 100);
            }
        } catch (error) {
            console.error("Error selecting segment:", error);
        }
    }

    function selectSegmentsByEditor(editorName) {
        if (!window.W || !window.W.model || !window.W.model.segments || !window.W.selectionManager) return;

        try {
            var editorSegments = [];
            for (var i = 0; i < foundSegmentsList.length; i++) {
                if (foundSegmentsList[i].editorName === editorName) {
                    editorSegments.push(foundSegmentsList[i]);
                }
            }
            
            if (editorSegments.length === 0) return;
            
            W.selectionManager.unselectAll();
            
            var segmentsToSelect = [];
            for (var j = 0; j < editorSegments.length; j++) {
                var segment = W.model.segments.getObjectById(editorSegments[j].segmentId);
                if (segment) {
                    segmentsToSelect.push(segment);
                }
            }
            
            if (segmentsToSelect.length > 0) {
                W.selectionManager.setSelectedModels(segmentsToSelect);
            }
            
        } catch (error) {
            console.error("Error selecting segments by editor:", error);
        }
    }

    // Calculate age statistics
    function calculateAgeStatistics(segments) {
        var stats = {
            totalSegments: segments.length,
            ageGroups: {
                '0-30': 0,      // 0-30 days
                '31-90': 0,     // 1-3 months
                '91-180': 0,    // 3-6 months
                '181-365': 0,   // 6-12 months
                '366-730': 0,   // 1-2 years
                '730+': 0       // 2+ years
            },
            oldSegments: 0,
            averageAge: 0
        };

        var totalAge = 0;
        var today = new Date();

        segments.forEach(function(seg) {
            var editDate = new Date(seg.editDate);
            var daysAgo = Math.floor((today.getTime() - editDate.getTime()) / 86400000);
            totalAge += daysAgo;

            if (seg.isOld) {
                stats.oldSegments++;
            }

            // Categorize by age
            if (daysAgo <= 30) {
                stats.ageGroups['0-30']++;
            } else if (daysAgo <= 90) {
                stats.ageGroups['31-90']++;
            } else if (daysAgo <= 180) {
                stats.ageGroups['91-180']++;
            } else if (daysAgo <= 365) {
                stats.ageGroups['181-365']++;
            } else if (daysAgo <= 730) {
                stats.ageGroups['366-730']++;
            } else {
                stats.ageGroups['730+']++;
            }
        });

        stats.averageAge = segments.length > 0 ? Math.round(totalAge / segments.length) : 0;
        return stats;
    }

    // Update age statistics display
    function updateAgeStatisticsDisplay() {
        var statsElement = getId('_ageStatisticsDisplay');
        if (!statsElement || foundSegmentsList.length === 0) return;

        var stats = calculateAgeStatistics(foundSegmentsList);
        
        var html = '<div style="background: #f0f8ff; padding: 6px; border-radius: 3px; margin-top: 8px; border-left: 3px solid #2196F3; font-size: 10px;">';
        html += '<div style="font-weight: bold; margin-bottom: 4px; color: #1976D2; font-size: 11px;">📊 Stats</div>';
        
        html += '<div style="margin-bottom: 4px;"><strong>Avg Age:</strong> ' + stats.averageAge + 'd</div>';
        
        if (stats.oldSegments > 0) {
            html += '<div style="margin-bottom: 4px; color: #d32f2f;"><strong>Old:</strong> ' + stats.oldSegments + '</div>';
        }
        
        html += '<div style="font-size: 9px; color: #666;">';
        html += '0-30d: ' + stats.ageGroups['0-30'] + ' | ';
        html += '31-90d: ' + stats.ageGroups['31-90'] + ' | ';
        html += '91-180d: ' + stats.ageGroups['91-180'] + '<br>';
        html += '181-365d: ' + stats.ageGroups['181-365'] + ' | ';
        html += '1-2y: ' + stats.ageGroups['366-730'] + ' | ';
        html += '2y+: ' + stats.ageGroups['730+'];
        html += '</div>';
        
        html += '</div>';
        
        statsElement.innerHTML = html;
    }

    function updateEditorsDisplay() {
        var editorsElement = getId('_editorsDisplay');
        if (!editorsElement) return;

        while (editorsElement.firstChild) {
            editorsElement.removeChild(editorsElement.firstChild);
        }

        if (foundSegmentsList.length === 0) {
            return;
        }

        var editorGroups = {};
        for (var i = 0; i < foundSegmentsList.length; i++) {
            var segInfo = foundSegmentsList[i];
            if (!editorGroups[segInfo.editorName]) {
                editorGroups[segInfo.editorName] = [];
            }
            editorGroups[segInfo.editorName].push(segInfo);
        }

        var containerDiv = document.createElement('div');
        containerDiv.style.maxHeight = '150px';
        containerDiv.style.overflowY = 'auto';
        containerDiv.style.border = '1px solid #ddd';
        containerDiv.style.padding = '6px';
        containerDiv.style.background = '#f9f9f9';
        containerDiv.style.borderRadius = '3px';
        containerDiv.style.marginBottom = '8px';
        containerDiv.style.fontSize = '11px';
        
        var editorNames = Object.keys(editorGroups);
        for (var k = 0; k < editorNames.length; k++) {
            var editorName = editorNames[k];
            var segments = editorGroups[editorName];
            
            var editorDiv = document.createElement('div');
            editorDiv.style.marginBottom = '8px';
            
            var editorNameSpan = document.createElement('span');
            editorNameSpan.style.color = '#2196F3';
            editorNameSpan.style.cursor = 'pointer';
            editorNameSpan.style.textDecoration = 'underline';
            editorNameSpan.style.fontWeight = 'bold';
            editorNameSpan.style.fontSize = '11px';
            editorNameSpan.textContent = editorName;
            editorNameSpan.title = 'Click to select all segments by ' + editorName;
            
            (function(name) {
                editorNameSpan.addEventListener('click', function() {
                    selectSegmentsByEditor(name);
                });
            })(editorName);
            
            var segmentCountSpan = document.createElement('span');
            segmentCountSpan.style.color = '#666';
            segmentCountSpan.style.marginLeft = '6px';
            segmentCountSpan.style.fontSize = '10px';
            segmentCountSpan.textContent = '(' + segments.length + ')';
            
            editorDiv.appendChild(editorNameSpan);
            editorDiv.appendChild(segmentCountSpan);
            editorDiv.appendChild(document.createElement('br'));
            
            var maxShow = 3;
            for (var m = 0; m < Math.min(maxShow, segments.length); m++) {
                var seg = segments[m];
                var editDate = new Date(seg.editDate);
                var daysAgo = Math.floor((new Date() - editDate) / 86400000);
                
                var segmentDiv = document.createElement('div');
                segmentDiv.style.color = '#888';
                segmentDiv.style.marginLeft = '10px';
                segmentDiv.style.marginTop = '2px';
                segmentDiv.style.fontSize = '10px';
                
                // Highlight old segments
                if (seg.isOld) {
                    segmentDiv.style.background = '#ffebee';
                    segmentDiv.style.border = '1px solid #ffcdd2';
                    segmentDiv.style.borderRadius = '2px';
                    segmentDiv.style.padding = '1px 3px';
                }
                
                var segmentIdSpan = document.createElement('span');
                segmentIdSpan.style.color = '#2196F3';
                segmentIdSpan.style.cursor = 'pointer';
                segmentIdSpan.style.textDecoration = 'underline';
                segmentIdSpan.style.fontWeight = 'bold';
                segmentIdSpan.textContent = seg.segmentId;
                segmentIdSpan.title = 'Click to select segment ' + seg.segmentId;
                
                (function(segId) {
                    segmentIdSpan.addEventListener('click', function() {
                        selectSegmentById(segId);
                    });
                })(seg.segmentId);
                
                var daysText = document.createTextNode(' - ' + daysAgo + 'd');
                if (seg.isOld) {
                    var oldSpan = document.createElement('span');
                    oldSpan.style.color = '#d32f2f';
                    oldSpan.style.fontWeight = 'bold';
                    oldSpan.textContent = ' - ' + daysAgo + 'd (OLD)';
                    segmentDiv.appendChild(segmentIdSpan);
                    segmentDiv.appendChild(oldSpan);
                } else {
                    segmentDiv.appendChild(segmentIdSpan);
                    segmentDiv.appendChild(daysText);
                }
                
                editorDiv.appendChild(segmentDiv);
            }
            
            if (segments.length > maxShow) {
                var moreDiv = document.createElement('div');
                moreDiv.style.color = '#888';
                moreDiv.style.marginLeft = '10px';
                moreDiv.style.fontStyle = 'italic';
                moreDiv.style.fontSize = '9px';
                moreDiv.style.marginTop = '2px';
                moreDiv.textContent = '... +' + (segments.length - maxShow) + ' more';
                editorDiv.appendChild(moreDiv);
            }
            
            containerDiv.appendChild(editorDiv);
        }
        
        editorsElement.appendChild(containerDiv);
    }

    function selectHighlightedSegments() {
        if (!window.W || !window.W.model || !window.W.model.segments || !window.W.selectionManager) return;

        if (highlightedSegmentIds.length === 0) {
            return;
        }

        try {
            W.selectionManager.unselectAll();
            
            var segmentsToSelect = [];
            for (var i = 0; i < highlightedSegmentIds.length; i++) {
                var segment = W.model.segments.getObjectById(highlightedSegmentIds[i]);
                if (segment) {
                    segmentsToSelect.push(segment);
                }
            }
            
            if (segmentsToSelect.length > 0) {
                W.selectionManager.setSelectedModels(segmentsToSelect);
            }
            
        } catch (error) {
            console.error("Error selecting segments:", error);
        }
    }

    function runHighlighter() {
        console.log("=== RUNNING AGE FILTER ===");
        
        if (!window.W || !window.W.model || !window.W.model.segments) {
            console.log("W.model not ready, retrying...");
            setTimeout(runHighlighter, 2000);
            return;
        }

        resetAllHighlights();

        var selectedLevel = getId('_selectEditorLevel');
        var daysInput = getId('_txtDaysOld');
        var customColorPicker = getId('_customColorPicker');
        var ageFilterInput = getId('_txtAgeFilter');
        var levelFilterCheckbox = getId('_cbLevelFilter');
        var roadTypeFilterCheckbox = getId('_cbRoadTypeFilter');
        var areaSearchCheckbox = getId('_cbAreaSearchMode');

        var selectedDisplayLevel = selectedLevel ? parseInt(selectedLevel.value) || 1 : 1;
        var selectedInternalLevel = selectedDisplayLevel - 1;
        var daysOld = daysInput ? parseInt(daysInput.value) || 30 : 30;
        var colorMode = getColorMode();
        var customColor = customColorPicker ? customColorPicker.value : HIGHLIGHT_GREEN;
        var ageFilterDays = ageFilterInput ? parseInt(ageFilterInput.value) || 180 : 180;
        var levelFilterEnabled = levelFilterCheckbox ? levelFilterCheckbox.checked : false;
        var roadTypeFilterEnabled = roadTypeFilterCheckbox ? roadTypeFilterCheckbox.checked : false;
        var selectedRoadTypes = getSelectedRoadTypes();
        var areaSearchMode = areaSearchCheckbox ? areaSearchCheckbox.checked : false;

        // Save current settings
        if (selectedLevel) {
            saveToLocalStorage(STORAGE_KEYS.selectedLevel, selectedLevel.value);
        }
        if (daysInput) {
            saveToLocalStorage(STORAGE_KEYS.daysOld, daysInput.value);
        }
        saveToLocalStorage(STORAGE_KEYS.colorMode, colorMode);
        if (customColorPicker) {
            saveToLocalStorage(STORAGE_KEYS.customColor, customColorPicker.value);
        }
        if (ageFilterInput) {
            saveToLocalStorage(STORAGE_KEYS.ageFilterDays, ageFilterInput.value);
        }
        if (levelFilterCheckbox) {
            saveToLocalStorage(STORAGE_KEYS.levelFilterEnabled, levelFilterCheckbox.checked.toString());
        }
        if (roadTypeFilterCheckbox) {
            saveToLocalStorage(STORAGE_KEYS.roadTypeFilterEnabled, roadTypeFilterCheckbox.checked.toString());
        }
        saveToLocalStorage(STORAGE_KEYS.selectedRoadTypes, JSON.stringify(selectedRoadTypes));
        
        var autoRefreshCheckbox = getId('_cbAutoRefresh');
        if (autoRefreshCheckbox) {
            saveToLocalStorage(STORAGE_KEYS.autoRefresh, autoRefreshCheckbox.checked.toString());
        }

        console.log("Level Filter:", levelFilterEnabled ? "Level " + selectedDisplayLevel : "disabled", 
                   "Days:", daysOld, "Age Filter:", ageFilterDays,
                   "Road Type Filter:", roadTypeFilterEnabled ? selectedRoadTypes.length + " types" : "disabled",
                   "Area Search Mode:", areaSearchMode);

        if (areaSearchMode) {
            runAreaSearch(selectedDisplayLevel, selectedInternalLevel, daysOld, ageFilterDays, 
                         levelFilterEnabled, roadTypeFilterEnabled, selectedRoadTypes, colorMode, customColor);
        } else {
            runNormalHighlighter(selectedDisplayLevel, selectedInternalLevel, daysOld, ageFilterDays, 
                               levelFilterEnabled, roadTypeFilterEnabled, selectedRoadTypes, colorMode, customColor);
        }
    }

    function runNormalHighlighter(selectedDisplayLevel, selectedInternalLevel, daysOld, ageFilterDays, 
                                 levelFilterEnabled, roadTypeFilterEnabled, selectedRoadTypes, colorMode, customColor) {
        var totalSegments = 0;
        var matchingSegments = 0;
        var highlightedSegments = 0;
        var oldSegments = 0;
        var today = new Date();

        for (var seg in W.model.segments.objects) {
            var segment = W.model.segments.getObjectById(seg);
            if (!segment || !segment.attributes) continue;
            
            totalSegments++;
            var attributes = segment.attributes;
            var updatedBy = attributes.updatedBy || attributes.createdBy;
            
            if (!updatedBy) continue;
            
            var editDate = attributes.updatedOn || attributes.createdOn;
            var editDays = editDate ? (today.getTime() - editDate) / 86400000 : 9999;
            
            if (editDays > daysOld) continue;

            // Road type filter
            if (roadTypeFilterEnabled && selectedRoadTypes.length > 0) {
                var roadType = attributes.roadType;
                if (selectedRoadTypes.indexOf(roadType) === -1) continue;
            }
            
            try {
                var user = W.model.users.getObjectById(parseInt(updatedBy));
                if (!user || !user.attributes || !user.attributes.userName || user.attributes.userName === 'Inactive User') continue;
                
                // Level filter (optional)
                if (levelFilterEnabled) {
                    var userInternalLevel = user.attributes.rank;
                    if (userInternalLevel !== selectedInternalLevel) continue;
                }
                
                matchingSegments++;
                
                var isOld = editDays >= ageFilterDays;
                if (isOld) oldSegments++;
                
                var segmentInfo = {
                    segmentId: seg,
                    editorName: user.attributes.userName,
                    editorLevel: (user.attributes.rank || 0) + 1,
                    editDate: editDate,
                    isOld: isOld,
                    roadType: attributes.roadType,
                    roadTypeName: ROAD_TYPES[attributes.roadType] || 'Unknown'
                };
                foundSegmentsList.push(segmentInfo);
                
                try {
                    var line = W.userscripts.getFeatureElementByDataModel(segment);
                    if (line) {
                        if (isOld) {
                            // Old segments: red, dashed, thicker
                            line.setAttribute("stroke", HIGHLIGHT_RED);
                            line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                            line.setAttribute("stroke-width", 10);
                            line.setAttribute("stroke-dasharray", "10,5");
                        } else {
                            // Normal segments: user color choice
                            var highlightColor = getHighlightColor(colorMode, customColor);
                            line.setAttribute("stroke", highlightColor);
                            line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                            line.setAttribute("stroke-width", 8);
                            line.setAttribute("stroke-dasharray", "none");
                        }
                        highlightedSegments++;
                        highlightedSegmentIds.push(seg);
                    }
                } catch (e) {}
                
            } catch (userError) {
                console.warn("Error accessing user", updatedBy, userError);
            }
        }

        var counterElement = getId('_highlightCounter');
        if (counterElement) {
            var counterText = '<strong>Found ' + matchingSegments + ' segments</strong>';
            
            if (levelFilterEnabled) {
                counterText += ' by Level ' + selectedDisplayLevel + ' editors';
            }
            
            if (roadTypeFilterEnabled && selectedRoadTypes.length > 0) {
                var roadTypeNames = selectedRoadTypes.map(function(rt) { return ROAD_TYPES[rt] || rt; });
                counterText += ' (' + roadTypeNames.join(', ') + ')';
            }
            
            counterText += '<br><strong>Highlighted ' + highlightedSegments + ' segments</strong>';
            
            if (oldSegments > 0) {
                counterText += '<br><strong style="color: #d32f2f;">' + oldSegments + ' old segments (>' + ageFilterDays + ' days) in red</strong>';
            }
            
            counterText += '<br><span style="color: #888;">(' + totalSegments + ' total segments checked)</span>';
            
            counterElement.innerHTML = counterText;
        }

        updateEditorsDisplay();
        updateAgeStatisticsDisplay();

        console.log("Found:", matchingSegments, "Highlighted:", highlightedSegments, "Old:", oldSegments);
    }

    // Area Search Mode functionality
    function runAreaSearch(selectedDisplayLevel, selectedInternalLevel, daysOld, ageFilterDays, 
                          levelFilterEnabled, roadTypeFilterEnabled, selectedRoadTypes, colorMode, customColor) {
        console.log("=== RUNNING AREA SEARCH MODE ===");
        
        var bounds = getCurrentMapBounds();
        if (!bounds) {
            console.log("Could not get map bounds");
            return;
        }
        
        var gridSize = parseFloat(getId('_areaGridSize').value) || 0.01;
        var minSegments = parseInt(getId('_areaMinSegments').value) || 5;
        
        console.log("Scanning area with grid size:", gridSize, "min segments:", minSegments);
        
        var hotspots = scanAreaForOldSegments(bounds, gridSize, minSegments, ageFilterDays, 
                                            levelFilterEnabled, selectedInternalLevel, 
                                            roadTypeFilterEnabled, selectedRoadTypes);
        
        updateAreaHotspotsDisplay(hotspots);
        
        // Highlight all segments in hotspots
        var totalHighlighted = 0;
        for (var i = 0; i < hotspots.length; i++) {
            var hotspot = hotspots[i];
            for (var j = 0; j < hotspot.segments.length; j++) {
                var segmentId = hotspot.segments[j].segmentId;
                var segment = W.model.segments.getObjectById(segmentId);
                if (segment) {
                    try {
                        var line = W.userscripts.getFeatureElementByDataModel(segment);
                        if (line) {
                            line.setAttribute("stroke", HIGHLIGHT_RED);
                            line.setAttribute("stroke-opacity", HIGHLIGHT_OPACITY);
                            line.setAttribute("stroke-width", 10);
                            line.setAttribute("stroke-dasharray", "10,5");
                            highlightedSegmentIds.push(segmentId);
                            totalHighlighted++;
                        }
                    } catch (e) {}
                }
            }
        }
        
        var counterElement = getId('_highlightCounter');
        if (counterElement) {
            counterElement.innerHTML = '<strong>Area Search Mode</strong><br>' +
                                     'Found ' + hotspots.length + ' hotspots<br>' +
                                     'Highlighted ' + totalHighlighted + ' old segments';
        }
        
        console.log("Area search complete. Found", hotspots.length, "hotspots with", totalHighlighted, "segments");
    }

    function getCurrentMapBounds() {
        try {
            if (W && W.map && W.map.getOLMap) {
                var olMap = W.map.getOLMap();
                var view = olMap.getView();
                var extent = view.calculateExtent(olMap.getSize());
                
                // Convert from Web Mercator to WGS84
                var bottomLeft = ol.proj.transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');
                var topRight = ol.proj.transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');
                
                return {
                    south: bottomLeft[1],
                    west: bottomLeft[0],
                    north: topRight[1],
                    east: topRight[0]
                };
            }
        } catch (e) {
            console.error("Error getting map bounds:", e);
        }
        return null;
    }

    function scanAreaForOldSegments(bounds, gridSize, minSegments, ageFilterDays, 
                                   levelFilterEnabled, selectedInternalLevel, 
                                   roadTypeFilterEnabled, selectedRoadTypes) {
        var hotspots = [];
        var today = new Date();
        
        // Create grid
        var latSteps = Math.ceil((bounds.north - bounds.south) / gridSize);
        var lonSteps = Math.ceil((bounds.east - bounds.west) / gridSize);
        
        console.log("Scanning grid:", latSteps, "x", lonSteps, "cells");
        
        for (var latStep = 0; latStep < latSteps; latStep++) {
            for (var lonStep = 0; lonStep < lonSteps; lonStep++) {
                var cellBounds = {
                    south: bounds.south + (latStep * gridSize),
                    north: bounds.south + ((latStep + 1) * gridSize),
                    west: bounds.west + (lonStep * gridSize),
                    east: bounds.west + ((lonStep + 1) * gridSize)
                };
                
                var cellSegments = [];
                
                // Check all segments in this cell
                for (var seg in W.model.segments.objects) {
                    var segment = W.model.segments.getObjectById(seg);
                    if (!segment || !segment.attributes) continue;
                    
                    // Check if segment is in this cell (simplified check using center point)
                    var geometry = segment.getOLGeometry();
                    if (geometry && geometry.getCoordinates) {
                        var coords = geometry.getCoordinates();
                        if (coords && coords.length > 0) {
                            // Get center point
                            var centerIdx = Math.floor(coords.length / 2);
                            var centerCoord = coords[centerIdx];
                            
                            // Convert to WGS84
                            var wgs84Coord = ol.proj.transform(centerCoord, 'EPSG:3857', 'EPSG:4326');
                            var lon = wgs84Coord[0];
                            var lat = wgs84Coord[1];
                            
                            // Check if in cell bounds
                            if (lat >= cellBounds.south && lat <= cellBounds.north &&
                                lon >= cellBounds.west && lon <= cellBounds.east) {
                                
                                var attributes = segment.attributes;
                                var updatedBy = attributes.updatedBy || attributes.createdBy;
                                var editDate = attributes.updatedOn || attributes.createdOn;
                                var editDays = editDate ? (today.getTime() - editDate) / 86400000 : 9999;
                                
                                // Check if segment meets criteria
                                if (editDays >= ageFilterDays && updatedBy) {
                                    // Road type filter
                                    if (roadTypeFilterEnabled && selectedRoadTypes.length > 0) {
                                        var roadType = attributes.roadType;
                                        if (selectedRoadTypes.indexOf(roadType) === -1) continue;
                                    }
                                    
                                    // Level filter
                                    if (levelFilterEnabled) {
                                        try {
                                            var user = W.model.users.getObjectById(parseInt(updatedBy));
                                            if (!user || !user.attributes) continue;
                                            var userInternalLevel = user.attributes.rank;
                                            if (userInternalLevel !== selectedInternalLevel) continue;
                                        } catch (e) {
                                            continue;
                                        }
                                    }
                                    
                                    cellSegments.push({
                                        segmentId: seg,
                                        editDays: editDays,
                                        lat: lat,
                                        lon: lon
                                    });
                                }
                            }
                        }
                    }
                }
                
                // If this cell has enough old segments, it's a hotspot
                if (cellSegments.length >= minSegments) {
                    hotspots.push({
                        bounds: cellBounds,
                        center: {
                            lat: (cellBounds.south + cellBounds.north) / 2,
                            lon: (cellBounds.west + cellBounds.east) / 2
                        },
                        segments: cellSegments,
                        count: cellSegments.length
                    });
                }
            }
        }
        
        // Sort hotspots by segment count (highest first)
        hotspots.sort(function(a, b) { return b.count - a.count; });
        
        return hotspots;
    }

    function updateAreaHotspotsDisplay(hotspots) {
        var editorsElement = getId('_editorsDisplay');
        if (!editorsElement) return;

        while (editorsElement.firstChild) {
            editorsElement.removeChild(editorsElement.firstChild);
        }

        if (hotspots.length === 0) {
            var noHotspotsDiv = document.createElement('div');
            noHotspotsDiv.style.padding = '6px';
            noHotspotsDiv.style.color = '#666';
            noHotspotsDiv.style.fontSize = '11px';
            noHotspotsDiv.textContent = 'No hotspots found.';
            editorsElement.appendChild(noHotspotsDiv);
            return;
        }

        var containerDiv = document.createElement('div');
        containerDiv.style.maxHeight = '150px';
        containerDiv.style.overflowY = 'auto';
        containerDiv.style.border = '1px solid #ddd';
        containerDiv.style.padding = '6px';
        containerDiv.style.background = '#f9f9f9';
        containerDiv.style.borderRadius = '3px';
        containerDiv.style.marginBottom = '8px';
        containerDiv.style.fontSize = '11px';
        
        var titleDiv = document.createElement('div');
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.marginBottom = '6px';
        titleDiv.style.color = '#d32f2f';
        titleDiv.style.fontSize = '11px';
        titleDiv.textContent = '🔥 Hotspots (' + hotspots.length + ')';
        containerDiv.appendChild(titleDiv);
        
        for (var i = 0; i < Math.min(8, hotspots.length); i++) {
            var hotspot = hotspots[i];
            
            var hotspotDiv = document.createElement('div');
            hotspotDiv.style.marginBottom = '6px';
            hotspotDiv.style.padding = '4px';
            hotspotDiv.style.background = '#ffebee';
            hotspotDiv.style.border = '1px solid #ffcdd2';
            hotspotDiv.style.borderRadius = '2px';
            hotspotDiv.style.cursor = 'pointer';
            hotspotDiv.style.fontSize = '10px';
            
            var headerDiv = document.createElement('div');
            headerDiv.style.fontWeight = 'bold';
            headerDiv.style.color = '#d32f2f';
            headerDiv.textContent = '#' + (i + 1) + ': ' + hotspot.count + ' old segments';
            
            var coordsDiv = document.createElement('div');
            coordsDiv.style.fontSize = '9px';
            coordsDiv.style.color = '#666';
            coordsDiv.textContent = hotspot.center.lat.toFixed(4) + ', ' + hotspot.center.lon.toFixed(4);
            
            hotspotDiv.appendChild(headerDiv);
            hotspotDiv.appendChild(coordsDiv);
            
            // Add click handler to zoom to hotspot
            (function(bounds) {
                hotspotDiv.addEventListener('click', function() {
                    zoomToArea(bounds);
                });
            })(hotspot.bounds);
            
            containerDiv.appendChild(hotspotDiv);
        }
        
        if (hotspots.length > 8) {
            var moreDiv = document.createElement('div');
            moreDiv.style.color = '#888';
            moreDiv.style.fontStyle = 'italic';
            moreDiv.style.fontSize = '9px';
            moreDiv.style.marginTop = '4px';
            moreDiv.textContent = '... +' + (hotspots.length - 8) + ' more hotspots';
            containerDiv.appendChild(moreDiv);
        }
        
        editorsElement.appendChild(containerDiv);
    }

    function zoomToArea(bounds) {
        try {
            if (W && W.map && W.map.getOLMap) {
                var olMap = W.map.getOLMap();
                var view = olMap.getView();
                
                // Convert bounds to Web Mercator
                var bottomLeft = ol.proj.transform([bounds.west, bounds.south], 'EPSG:4326', 'EPSG:3857');
                var topRight = ol.proj.transform([bounds.east, bounds.north], 'EPSG:4326', 'EPSG:3857');
                
                var extent = [bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]];
                
                view.fit(extent, {
                    padding: [50, 50, 50, 50],
                    maxZoom: 5,
                    duration: 500
                });
            }
        } catch (e) {
            console.error("Error zooming to area:", e);
        }
    }

    function createUI() {
        console.log("=== CREATING UI ===");
        
        if (!window.W || !window.W.userscripts || !window.W.userscripts.registerSidebarTab) {
            console.log("WME userscripts API not ready, retrying...");
            setTimeout(createUI, 2000);
            return;
        }

        try {
            // Use the new WME SDK API to create sidebar tab
            var tabResult = W.userscripts.registerSidebarTab('wme-level-age-filter');
            var tabLabel = tabResult.tabLabel;
            var tabPane = tabResult.tabPane;

            // Set tab label
            tabLabel.textContent = levelIcon + ' Age Filter';
            tabLabel.title = 'WME Level Age Filter - Find old segments by editor level';

            // Wait for tab pane to be connected to DOM
            W.userscripts.waitForElementConnected(tabPane).then(function() {
                console.log("Tab pane connected to DOM, setting up UI...");
                setupTabContent(tabPane);
            });

        } catch (error) {
            console.error("Error creating sidebar tab:", error);
            // Fallback to old method if new API fails
            createUIFallback();
        }
    }

    function setupTabContent(tabPane) {
        // Set up tab pane styling - remove max height to prevent scrollbar issues
        tabPane.style.padding = '10px';
        tabPane.style.fontSize = '13px';

        // Build UI content with compact styling
        var html = '<div>';
        html += '<h4 style="margin: 0 0 8px 0; color: #2196F3; font-size: 14px;">' + levelIcon + ' Age Filter</h4>';
        html += '<div style="font-size: 11px; color: #666; margin-bottom: 12px;">v' + SCRIPT_VERSION + '</div>';
        
        // Mode Selection - more compact
        html += '<div style="margin-bottom: 10px; padding: 8px; background: #f5f5f5; border-radius: 3px;">';
        html += '<div style="font-weight: bold; margin-bottom: 6px; font-size: 12px;">🔍 Search Mode</div>';
        html += '<label style="display: block; margin-bottom: 3px; font-size: 12px;"><input type="radio" name="searchMode" id="_rbNormalMode" checked> Normal Highlighting</label>';
        html += '<label style="display: block; font-size: 12px;"><input type="radio" name="searchMode" id="_rbAreaSearchMode"> Area Search Mode</label>';
        html += '</div>';

        // Area Search Configuration - more compact
        html += '<div id="_areaSearchConfig" style="display: none; margin-bottom: 10px; padding: 8px; background: #fff3e0; border: 1px solid #ffcc02; border-radius: 3px;">';
        html += '<div style="font-weight: bold; margin-bottom: 6px; color: #f57c00; font-size: 12px;">🔥 Area Search</div>';
        html += '<div style="margin-bottom: 6px;">';
        html += '<label style="display: block; margin-bottom: 3px; font-size: 11px;">Grid Size:</label>';
        html += '<input type="number" id="_areaGridSize" value="0.01" step="0.001" min="0.001" max="0.1" style="width: 80px; padding: 2px; border: 1px solid #ccc; border-radius: 2px; font-size: 11px;">';
        html += '</div>';
        html += '<div>';
        html += '<label style="display: block; margin-bottom: 3px; font-size: 11px;">Min. Segments:</label>';
        html += '<input type="number" id="_areaMinSegments" value="5" min="1" max="50" style="width: 80px; padding: 2px; border: 1px solid #ccc; border-radius: 2px; font-size: 11px;">';
        html += '</div>';
        html += '</div>';

        // Level Filter - more compact
        html += '<div style="margin-bottom: 10px;">';
        html += '<label style="display: block; margin-bottom: 3px; font-size: 12px;"><input type="checkbox" id="_cbLevelFilter"> Filter by Level</label>';
        html += '<div id="_levelContainer" style="display: none; margin-left: 15px;">';
        html += '<div style="margin-bottom: 6px;">';
        html += '<label style="display: block; margin-bottom: 3px; font-size: 11px;">Level:</label>';
        html += '<select id="_selectEditorLevel" style="width: 80px; padding: 2px; border: 1px solid #ccc; border-radius: 2px; font-size: 11px;">';
        for (var level = 1; level <= 7; level++) {
            html += '<option value="' + level + '">L' + level + '</option>';
        }
        html += '</select>';
        html += '</div>';
        html += '<div>';
        html += '<label style="display: block; margin-bottom: 3px; font-size: 11px;">Max Days:</label>';
        html += '<input type="number" id="_txtDaysOld" value="30" min="1" max="3650" style="width: 80px; padding: 2px; border: 1px solid #ccc; border-radius: 2px; font-size: 11px;">';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        // Quick Age Selection - more compact
        html += '<div style="margin-bottom: 10px;">';
        html += '<div style="font-weight: bold; margin-bottom: 6px; font-size: 12px;">⚡ Quick Age</div>';
        html += '<div style="margin-bottom: 6px;">';
        html += '<label style="display: inline-block; margin-right: 8px; margin-bottom: 3px; font-size: 11px;"><input type="radio" name="ageQuick" value="180"> 6M</label>';
        html += '<label style="display: inline-block; margin-right: 8px; margin-bottom: 3px; font-size: 11px;"><input type="radio" name="ageQuick" value="365"> 1Y</label>';
        html += '<label style="display: inline-block; margin-right: 8px; margin-bottom: 3px; font-size: 11px;"><input type="radio" name="ageQuick" value="730"> 2Y</label>';
        html += '<label style="display: inline-block; margin-bottom: 3px; font-size: 11px;"><input type="radio" name="ageQuick" value="1825"> 5Y</label>';
        html += '</div>';
        html += '<div>';
        html += '<label style="display: block; margin-bottom: 3px; font-size: 11px;">Age Filter (days):</label>';
        html += '<input type="number" id="_txtAgeFilter" value="180" min="1" max="3650" style="width: 80px; padding: 2px; border: 1px solid #ccc; border-radius: 2px; font-size: 11px;">';
        html += '</div>';
        html += '</div>';

        // Road Type Filter - more compact
        html += '<div style="margin-bottom: 10px;">';
        html += '<label style="display: block; margin-bottom: 3px; font-size: 12px;"><input type="checkbox" id="_cbRoadTypeFilter"> Filter by Road Type</label>';
        html += '<div id="_roadTypeContainer" style="display: none; margin-left: 15px; max-height: 100px; overflow-y: auto; border: 1px solid #ddd; padding: 4px; background: #f9f9f9; border-radius: 2px;">';
        for (var roadType in ROAD_TYPES) {
            var shortName = ROAD_TYPES[roadType].replace('Street', 'St').replace('Highway', 'Hwy').replace('Road', 'Rd');
            html += '<label style="display: block; margin-bottom: 2px; font-size: 10px;"><input type="checkbox" id="_cbRoadType' + roadType + '"> ' + shortName + '</label>';
        }
        html += '</div>';
        html += '</div>';

        // Color Selection - more compact
        html += '<div style="margin-bottom: 10px;">';
        html += '<div style="font-weight: bold; margin-bottom: 6px; font-size: 12px;">🎨 Color</div>';
        html += '<label style="display: inline-block; margin-right: 8px; margin-bottom: 3px; font-size: 11px;"><input type="radio" name="highlightColor" id="_rbHilightGreen" checked> Green</label>';
        html += '<label style="display: inline-block; margin-right: 8px; margin-bottom: 3px; font-size: 11px;"><input type="radio" name="highlightColor" id="_rbHilightBlue"> Blue</label>';
        html += '<label style="display: inline-block; margin-bottom: 3px; font-size: 11px;"><input type="radio" name="highlightColor" id="_rbHilightCustom"> Custom</label>';
        html += '<input type="color" id="_customColorPicker" value="' + HIGHLIGHT_GREEN + '" style="display: none; margin-left: 8px; width: 30px; height: 20px; border: none; border-radius: 2px;">';
        html += '</div>';

        // Auto Refresh - more compact
        html += '<div style="margin-bottom: 10px;">';
        html += '<label style="display: block; font-size: 12px;"><input type="checkbox" id="_cbAutoRefresh"> Auto Refresh (5s)</label>';
        html += '</div>';

        // Action Buttons - more compact
        html += '<div style="margin-bottom: 10px;">';
        html += '<button id="_btnRunHighlighter" style="background: #4CAF50; color: white; border: none; padding: 6px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px; font-weight: bold; font-size: 11px;">RUN</button>';
        html += '<button id="_btnResetHighlights" style="background: #f44336; color: white; border: none; padding: 6px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px; font-size: 11px;">RESET</button>';
        html += '<button id="_btnSelectAll" style="background: #2196F3; color: white; border: none; padding: 6px 10px; border-radius: 3px; cursor: pointer; font-size: 11px;">SELECT</button>';
        html += '</div>';

        // Results Counter - more compact
        html += '<div id="_highlightCounter" style="margin-bottom: 10px; padding: 6px; background: #e8f5e8; border-left: 3px solid #4CAF50; border-radius: 2px; font-size: 11px;"></div>';

        // Age Statistics - more compact
        html += '<div id="_ageStatisticsDisplay" style="font-size: 11px;"></div>';

        // Results Display - more compact with controlled height
        html += '<div id="_editorsDisplay" style="font-size: 11px;"></div>';

        html += '</div>';

        tabPane.innerHTML = html;

        // Add event listeners
        setupEventListeners();
        
        // Load saved settings
        loadSavedSettings();

        console.log("UI created successfully using new WME SDK");
    }

    function createUIFallback() {
        console.log("=== CREATING UI (FALLBACK) ===");
        
        var userTabs = getId('user-info');
        if (!userTabs) {
            console.log("User tabs not found, retrying...");
            setTimeout(createUIFallback, 2000);
            return;
        }

        var existingTab = getId('_ageFilterTab');
        if (existingTab) {
            console.log("UI already exists");
            return;
        }

        // Create tab using old method as fallback
        var tabLabel = document.createElement('a');
        tabLabel.href = '#sidepanel-agefilter';
        tabLabel.id = '_ageFilterTab';
        tabLabel.textContent = levelIcon + ' Age Filter';
        tabLabel.style.padding = '8px 12px';
        tabLabel.style.display = 'inline-block';
        tabLabel.style.backgroundColor = '#f0f0f0';
        tabLabel.style.border = '1px solid #ccc';
        tabLabel.style.borderBottom = 'none';
        tabLabel.style.marginRight = '2px';
        tabLabel.style.textDecoration = 'none';
        tabLabel.style.color = '#333';
        tabLabel.style.borderRadius = '4px 4px 0 0';

        // Create tab content
        var tabContent = document.createElement('div');
        tabContent.id = 'sidepanel-agefilter';
        tabContent.style.display = 'none';
        tabContent.style.padding = '15px';
        tabContent.style.backgroundColor = '#fff';
        tabContent.style.border = '1px solid #ccc';
        tabContent.style.borderRadius = '0 4px 4px 4px';
        tabContent.style.maxHeight = '600px';
        tabContent.style.overflowY = 'auto';

        // Add tab and content to DOM (fallback method)
        var tabsContainer = userTabs.querySelector('.nav-tabs') || userTabs;
        tabsContainer.appendChild(tabLabel);
        
        var contentContainer = userTabs.querySelector('.tab-content') || userTabs.parentNode;
        contentContainer.appendChild(tabContent);

        // Add event listeners
        setupEventListeners();
        
        // Load saved settings
        loadSavedSettings();

        // Tab switching functionality
        tabLabel.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide all other tab contents
            var allTabContents = contentContainer.querySelectorAll('[id^="sidepanel-"]');
            for (var i = 0; i < allTabContents.length; i++) {
                allTabContents[i].style.display = 'none';
            }
            
            // Remove active class from all tabs
            var allTabs = tabsContainer.querySelectorAll('a');
            for (var j = 0; j < allTabs.length; j++) {
                allTabs[j].style.backgroundColor = '#f0f0f0';
                allTabs[j].style.color = '#333';
            }
            
            // Show this tab content and mark tab as active
            tabContent.style.display = 'block';
            tabLabel.style.backgroundColor = '#fff';
            tabLabel.style.color = '#2196F3';
        });

        console.log("UI created successfully using fallback method");
    }

    function setupEventListeners() {
        // Mode selection
        var normalMode = getId('_rbNormalMode');
        var areaSearchMode = getId('_rbAreaSearchMode');
        var areaSearchConfig = getId('_areaSearchConfig');
        
        if (normalMode && areaSearchMode && areaSearchConfig) {
            normalMode.addEventListener('change', function() {
                if (this.checked) {
                    areaSearchConfig.style.display = 'none';
                }
            });
            
            areaSearchMode.addEventListener('change', function() {
                if (this.checked) {
                    areaSearchConfig.style.display = 'block';
                }
            });
        }

        // Quick age selection
        var ageQuickRadios = document.querySelectorAll('input[name="ageQuick"]');
        var ageFilterInput = getId('_txtAgeFilter');
        
        for (var i = 0; i < ageQuickRadios.length; i++) {
            ageQuickRadios[i].addEventListener('change', function() {
                if (this.checked && ageFilterInput) {
                    ageFilterInput.value = this.value;
                    saveToLocalStorage(STORAGE_KEYS.ageFilterDays, this.value);
                }
            });
        }

        // Filter visibility toggles
        var levelFilterCheckbox = getId('_cbLevelFilter');
        if (levelFilterCheckbox) {
            levelFilterCheckbox.addEventListener('change', updateLevelVisibility);
        }

        var roadTypeFilterCheckbox = getId('_cbRoadTypeFilter');
        if (roadTypeFilterCheckbox) {
            roadTypeFilterCheckbox.addEventListener('change', updateRoadTypeVisibility);
        }

        // Color selection
        var colorRadios = document.querySelectorAll('input[name="highlightColor"]');
        for (var j = 0; j < colorRadios.length; j++) {
            colorRadios[j].addEventListener('change', updateCustomColorVisibility);
        }

        // Auto refresh
        var autoRefreshCheckbox = getId('_cbAutoRefresh');
        if (autoRefreshCheckbox) {
            autoRefreshCheckbox.addEventListener('change', toggleAutoRefresh);
        }

        // Action buttons
        var runButton = getId('_btnRunHighlighter');
        if (runButton) {
            runButton.addEventListener('click', runHighlighter);
        }

        var resetButton = getId('_btnResetHighlights');
        if (resetButton) {
            resetButton.addEventListener('click', resetAllHighlights);
        }

        var selectAllButton = getId('_btnSelectAll');
        if (selectAllButton) {
            selectAllButton.addEventListener('click', selectHighlightedSegments);
        }
    }

    function loadSavedSettings() {
        // Load level filter settings
        var levelFilterCheckbox = getId('_cbLevelFilter');
        var levelFilterEnabled = loadFromLocalStorage(STORAGE_KEYS.levelFilterEnabled, 'false') === 'true';
        if (levelFilterCheckbox) {
            levelFilterCheckbox.checked = levelFilterEnabled;
            updateLevelVisibility();
        }

        var selectedLevel = getId('_selectEditorLevel');
        if (selectedLevel) {
            selectedLevel.value = loadFromLocalStorage(STORAGE_KEYS.selectedLevel, '1');
        }

        var daysInput = getId('_txtDaysOld');
        if (daysInput) {
            daysInput.value = loadFromLocalStorage(STORAGE_KEYS.daysOld, '30');
        }

        // Load age filter settings
        var ageFilterInput = getId('_txtAgeFilter');
        var savedAgeDays = loadFromLocalStorage(STORAGE_KEYS.ageFilterDays, '180');
        if (ageFilterInput) {
            ageFilterInput.value = savedAgeDays;
        }

        // Set corresponding quick selection radio
        var ageQuickRadios = document.querySelectorAll('input[name="ageQuick"]');
        for (var i = 0; i < ageQuickRadios.length; i++) {
            if (ageQuickRadios[i].value === savedAgeDays) {
                ageQuickRadios[i].checked = true;
                break;
            }
        }

        // Load road type filter settings
        var roadTypeFilterCheckbox = getId('_cbRoadTypeFilter');
        var roadTypeFilterEnabled = loadFromLocalStorage(STORAGE_KEYS.roadTypeFilterEnabled, 'false') === 'true';
        if (roadTypeFilterCheckbox) {
            roadTypeFilterCheckbox.checked = roadTypeFilterEnabled;
            updateRoadTypeVisibility();
        }

        var savedRoadTypes = JSON.parse(loadFromLocalStorage(STORAGE_KEYS.selectedRoadTypes, '[]'));
        for (var j = 0; j < savedRoadTypes.length; j++) {
            var checkbox = getId('_cbRoadType' + savedRoadTypes[j]);
            if (checkbox) {
                checkbox.checked = true;
            }
        }

        // Load color settings
        var colorMode = loadFromLocalStorage(STORAGE_KEYS.colorMode, 'green');
        var greenRadio = getId('_rbHilightGreen');
        var blueRadio = getId('_rbHilightBlue');
        var customRadio = getId('_rbHilightCustom');
        
        if (colorMode === 'green' && greenRadio) {
            greenRadio.checked = true;
        } else if (colorMode === 'blue' && blueRadio) {
            blueRadio.checked = true;
        } else if (colorMode === 'custom' && customRadio) {
            customRadio.checked = true;
        }

        var customColorPicker = getId('_customColorPicker');
        if (customColorPicker) {
            customColorPicker.value = loadFromLocalStorage(STORAGE_KEYS.customColor, HIGHLIGHT_GREEN);
        }
        
        updateCustomColorVisibility();

        // Load auto refresh setting
        var autoRefreshCheckbox = getId('_cbAutoRefresh');
        var autoRefreshSetting = loadFromLocalStorage(STORAGE_KEYS.autoRefresh, 'false') === 'true';
        if (autoRefreshCheckbox) {
            autoRefreshCheckbox.checked = autoRefreshSetting;
            if (autoRefreshSetting) {
                toggleAutoRefresh();
            }
        }
    }

    // Initialize when WME is ready
    function init() {
        console.log("=== WME Level Age Filter INIT ===");
        
        if (typeof W === 'undefined' || !W.loginManager || !W.loginManager.user) {
            console.log("WME not ready, retrying in 2 seconds...");
            setTimeout(init, 2000);
            return;
        }

        console.log("WME ready, creating UI...");
        createUI();
    }

    // Start initialization using new WME SDK events
    function initializeScript() {
        console.log("=== WME Level Age Filter INITIALIZING ===");
        
        // Check if WME is already ready
        if (W && W.userscripts && W.userscripts.state && W.userscripts.state.isReady) {
            console.log("WME already ready, initializing immediately...");
            init();
        } else {
            console.log("Waiting for WME to be ready...");
            // Use new WME SDK event
            document.addEventListener("wme-ready", function() {
                console.log("WME ready event received, initializing...");
                init();
            }, { once: true });
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    console.log("=== WME Level Age Filter LOADED ===");
})();