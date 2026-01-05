// ==UserScript==
// @name          Jacob's WME Tools
// @version       0.1.9
// @description   Jacob's Custom WME Tools
// @match         https://editor-beta.waze.com/*editor/*
// @match         https://www.waze.com/*editor/*
// @grant         none
// @author        JJohnston84
// @namespace     https://greasyfork.org/users/10332
// @downloadURL https://update.greasyfork.org/scripts/9113/Jacob%27s%20WME%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/9113/Jacob%27s%20WME%20Tools.meta.js
// ==/UserScript==

(function () {   
  // Count of bootstrap attempts;
  var jjwme_bootstrapCount = 0;
  
  // Bootstrap
  function jjwme_bootstrap() {
    'use strict';
    jjwme_bootstrapCount++;
    if (undefined !== typeof Waze &&
      Waze.appPresenter && Waze.appPresenter.sidebar && Waze.appPresenter.sidebar.editPanel &&
      Waze.appPresenter.sidebar && Waze.appPresenter.sidebar.editPanel &&
      Waze.appPresenter.sidebar.editPanel.typeToEditorClass &&
      Waze.appPresenter.sidebar.editPanel.typeToEditorClass.segment) {
      console.debug('Jacob\'s WME Tools: Initializing...');
      window.setTimeout(jjwme_init, 100);
    } else if (jjwme_bootstrapCount < 15) {
      console.debug('Jacob\'s WME Tools: Bootstrap failed. Trying again...');
      window.setTimeout(jjwme_bootstrap, 1000);
    } else {
      console.debug('Jacob\'s WME Tools: Bootstrap error.');
    }
  }
  console.debug('Jacob\'s WME Tools: Bootstrapping');
  window.setTimeout(jjwme_bootstrap, 100);

  function jjwme_init() {    
    // Update user attributes
    jjwme_userLevel = W.loginManager.user.rank + 1;
    isAreaManager = W.loginManager.user.isAreaManager;

    var settings = document.createElement("section");
    settings.innerHTML = "<h3>Jacob's WME Tools</h3>";
    
    // Auto-Lock Controls
    if (isAreaManager || jjwme_userLevel >= 4) {
      var autoLockSection = document.createElement('p');
      autoLockSection.id = "autoLockSection";
      autoLockSection.innerHTML = '<hr />' + '<i>Auto-Lock</i><br /><br />' +
      '<input type="number" name="street" id="street" min="0" max="6" step="1" value="0" /> Street<br />' +
      '<input type="number" name="priSt" id="priSt" min="0" max="6" step="1" value="2" /> Primary Street<br />' +
      '<input type="number" name="minHwy" id="minHwy" min="0" max="6" step="1" value="2" /> Minor Highway<br />' +
      '<input type="number" name="majHwy" id="majHwy" min="0" max="6" step="1" value="3" /> Major Highway<br />' +
      '<input type="number" name="ramp" id="ramp" min="0" max="6" step="1" value="5" /> Ramp<br />' +
      '<input type="number" name="fwy" id="fwy" min="0" max="6" step="1" value="5" /> Freeway<br />';
      settings.appendChild(autoLockSection);

      var inputAutoLock = document.createElement('input');
      inputAutoLock.type = 'button';
      inputAutoLock.value = 'Perform Auto-Lock';
      inputAutoLock.onclick = jjwme_performAutoLock;
      settings.appendChild(inputAutoLock);
    }
    
    // Base Map Tools Controls
    if (isAreaManager || jjwme_userLevel >= 4) {
      var baseMapSection = document.createElement('p');
      baseMapSection.id = "baseMapSection";
      baseMapSection.innerHTML = '<hr /><i>Base Map Tools</i><br />';
      settings.appendChild(baseMapSection);

      var inputUnknownToTwoWay = document.createElement('input');
      inputUnknownToTwoWay.type = 'button';
      inputUnknownToTwoWay.value = 'Unknown to 2-Way';
      inputUnknownToTwoWay.onclick = jjwme_convertUnknownToTwoWay;
      settings.appendChild(inputUnknownToTwoWay);

      jjwme_appendBreak(settings);

      var inputOneWayToTwoWay = document.createElement('input');
      inputOneWayToTwoWay.type = 'button';
      inputOneWayToTwoWay.value = '1-Way to 2-Way';
      inputOneWayToTwoWay.onclick = jjwme_convertOneWayToTwoWay;
      settings.appendChild(inputOneWayToTwoWay);

      jjwme_appendBreak(settings);

      var allToTwoWay = document.createElement('input');
      allToTwoWay.type = 'button';
      allToTwoWay.value = 'All to 2-Way';
      allToTwoWay.onclick = jjwme_convertAllToTwoWay;
      settings.appendChild(allToTwoWay);

      jjwme_appendBreak(settings);

      var enableAllTurns = document.createElement('input');
      enableAllTurns.type = 'checkbox';
      enableAllTurns.id = "enableAllTurns";
      enableAllTurns.checked = true;
      settings.appendChild(enableAllTurns);
      var enableAllTurnsDescription = document.createTextNode(" Enable All Turns");
      settings.appendChild(enableAllTurnsDescription);
    }
    
    // Selection History Tools
    var selectionHistorySection = document.createElement('p');
    selectionHistorySection.id = "selectionHistorySection";
    selectionHistorySection.innerHTML = '<hr /><i>Selection History</i><br />';
    settings.appendChild(selectionHistorySection);

    var inputPreviousSelection = document.createElement('input');
    inputPreviousSelection.type = 'button';
    inputPreviousSelection.id = "inputPreviousSelectionButton";
    inputPreviousSelection.value = 'Previous Selection';
    inputPreviousSelection.onclick = jjwme_stepBackSelection;
    settings.appendChild(inputPreviousSelection);

    jjwme_appendBreak(settings);

    var inputNextSelection = document.createElement('input');
    inputNextSelection.type = 'button';
    inputNextSelection.id = "inputNextSelectionButton";
    inputNextSelection.value = 'Next Selection';
    inputNextSelection.onclick = jjwme_stepForwardSelection;
    settings.appendChild(inputNextSelection);
    
    // Undo All Controls
    var undoAllSection = document.createElement('p');
    undoAllSection.id = "undoAllSection";
    undoAllSection.innerHTML = '<hr /><i>Undo All</i><br />';
    settings.appendChild(undoAllSection);

    var inputUndoAll = document.createElement('input');
    inputUndoAll.type = 'button';
    inputUndoAll.value = 'Undo All';
    inputUndoAll.onclick = jjwme_clearUndo;
    settings.appendChild(inputUndoAll);

    // Tab creation
    var userTabs = document.getElementById('user-info');
    var navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = document.getElementsByClassName('tab-content', userTabs)[0];

    settings.id = "sidepanel-jcwt";
    settings.className = "tab-pane";
    if (tabContent !== null) {
      tabContent.appendChild(settings);
    }

    var jjwmeTab = document.createElement('li');
    jjwmeTab.innerHTML = '<!--suppress HtmlUnknownAnchorTarget --><a href="#sidepanel-jcwt" data-toggle="tab">JJ</a>';
    if (navTabs !== null)
      navTabs.appendChild(jjwmeTab);
    
    // Register Selection Changed event
    Waze.selectionManager.events.register("selectionchanged", null, jjwme_selectionChangedHandler);
    
    // Load stored auto-lock settings
    jjwme_loadAutoLockSettings();
    
    // Update availability of selection commands
    jjwme_updateSelectionButtonsAvailability();
  } 
  
  /********* Global Variables **********/
  // Max number of changes allowed in a mass edit action.
  var jjwme_MAX_MASS_EDITS = 100; 
  
  // Max number of changes allowed in a mass edit action.
  var jjwme_MAX_BASE_EDITS = 50; 
  
  // User's rank (Level 1 = 1)
  var jjwme_userLevel = 1;
  
  // A store of user settings, index by name
  var jjwme_userSettings = {};
  
  // Flag indicating whether user settings have been loaded.
  var jjwme_userSettingsLoaded = false;
  
  // Flag indicating whether the user is an Area Manager  
  var isAreaManager = false;
  
  // Identifier of last used line break.
  var jjwme_breakId = 0;
  
  /********* Utility Functions **********/
  // Gets the count of pending changes
  function jjwme_pendingChangeCount() {
    return W.model.actionManager.actions.length;
  }
  
  // Gets whether the object is on screen
  function jjwme_onScreen(obj) {
    return obj.geometry && W.map.getExtent().intersectsBounds(obj.geometry.getBounds());
  }  
  
  // Loads user settings from local storage
  function jjwme_loadUserSettings() {
    jjwme_userSettingsLoaded = true;

    console.log("Loading User Settings for JCWT");
    if (localStorage !== null) {
      try
      {
        jjwme_userSettings = JSON.parse(localStorage.getItem("wme_jcwt_options"));
      }
      catch (e) {
        console.log("Loading user settings failed. " + e.message);
        jjwme_userSettings = {};
      }
    }
    else {
      console.log("JCWT: Unable to locate local storage for user settings");
    }

    if (jjwme_userSettings == null) {
      localStorage.setItem("wme_jcwt_options", "");
    }
  }
  
  // Saves a user setting
  function jjwme_saveUserSetting(name, val) {
    jjwme_userSettings[name] = val;
    if (localStorage) {
      localStorage.setItem("wme_jcwt_options", JSON.stringify(jjwme_userSettings));
    }
  }
  
  // Gets the user setting or loads the default value.
  function jjwme_loadUserSetting(name, defaultValue) {
    if (!jjwme_userSettingsLoaded)
      jjwme_loadUserSettings();

    if (!jjwme_userSettings.hasOwnProperty(name) || typeof jjwme_userSettings[name] === 'undefined') {
      jjwme_userSettings[name] = defaultValue;
    }
    return jjwme_userSettings[name];
  }
  
  // Gets whether the segment is a base map segment.
  function jjwme_isBaseMapSegment(segment) {
    return segment.updatedBy == null && segment.updatedOn == null && segment.lockRank == null;
  }
  
  // Appends a break to the section
  function jjwme_appendBreak(block) {
    var breakSection = document.createElement('p');
    breakSection.id = "breakSection" + jjwme_breakId;
    block.appendChild(breakSection);
    jjwme_breakId++;
  }
  
  // Gets whether any segments are currently selected.
  function jjwme_getSegmentsSelected() {
    return W.selectionManager.selectedItems.length >= 1 && W.selectionManager.selectedItems[0].model.type == "segment";
  }
  
  // Gets the segments to modify: if there are segments selected - use those, otherwise use all segments
  function jjwme_getSegmentsToModify() {
    var returnSegments = {};
    if (jjwme_getSegmentsSelected()) {
      for (var i = 0; i < W.selectionManager.selectedItems.length; i++) {
        var segment = W.selectionManager.selectedItems[i].model;
        returnSegments[segment.attributes.id] = segment;
      }
    }
    else {
      return W.model.segments.objects;
    }
    return returnSegments;
  }
  
  /********** Lock Levels for Road Types **********/
  function jjwme_performAutoLock() {
    jjwme_saveAutoLockSettings();

    var segmentsToModify = jjwme_getSegmentsToModify();
    for (var segIndex in segmentsToModify) {
      // Check that we don't have too many pending changes.
      if (jjwme_pendingChangeCount() >= jjwme_MAX_MASS_EDITS) {
        alert("Too many changes. Please save and run auto-lock again.");
        break;
      }

      var streetLevel = document.getElementById("street").value;
      var primaryStreetLevel = document.getElementById("priSt").value;
      var minorHighwayLevel = document.getElementById("minHwy").value;
      var majorHighwayLevel = document.getElementById("majHwy").value;
      var rampLevel = document.getElementById("ramp").value;
      var freewayLevel = document.getElementById("fwy").value;
      var trailLevel;
      var dirtLevel;
      var boardwalkLevel;
      var stairwayLevel;
      var privateLevel;
      var railroadLevel;
      var runwayLevel;
      var parkingLevel;
      var serviceLevel;

      var lockLevels = [undefined, streetLevel, primaryStreetLevel, freewayLevel, rampLevel, trailLevel, majorHighwayLevel, minorHighwayLevel, dirtLevel, undefined, boardwalkLevel, undefined, undefined, undefined, undefined, undefined, stairwayLevel, privateLevel, railroadLevel, runwayLevel, parkingLevel, serviceLevel];

      var segment = segmentsToModify[segIndex];
      if (segment.isGeometryEditable() && jjwme_onScreen(segment)) {
        var desiredLevel = lockLevels[segment.attributes.roadType];
        // Because we only lock at levels higher than currently exist, no need to try to lock at Automatic(1) (i.e., a value of 0)
        if (desiredLevel == undefined || desiredLevel < 1)
          continue;

        var levelToLock = Math.min(desiredLevel, jjwme_userLevel) - 1;
        var currentLockLevel = segment.attributes.lockRank;
        if (currentLockLevel == undefined || currentLockLevel < levelToLock) {
          W.model.actionManager.add(new UpdateObject(segment, { lockRank: (levelToLock < 0 ? null : levelToLock) }));
        }
      }
    }
  }

  function jjwme_saveAutoLockSettings() {
    console.log("Saving auto-lock settings");
    jjwme_saveUserSetting("autoLockStreetLevel", document.getElementById("street").value);
    jjwme_saveUserSetting("autoLockPrimaryStreetLevel", document.getElementById("priSt").value);
    jjwme_saveUserSetting("autoLockMinorHighwayLevel", document.getElementById("minHwy").value);
    jjwme_saveUserSetting("autoLockMajorHighwayLevel", document.getElementById("majHwy").value);
    jjwme_saveUserSetting("autoLockRampLevel", document.getElementById("ramp").value);
    jjwme_saveUserSetting("autoLockFreewayLevel", document.getElementById("fwy").value);
  }

  function jjwme_loadAutoLockSettings() {
    document.getElementById("street").value = jjwme_loadUserSetting("autoLockStreetLevel", 0);
    document.getElementById("priSt").value = jjwme_loadUserSetting("autoLockPrimaryStreetLevel", 2);
    document.getElementById("minHwy").value = jjwme_loadUserSetting("autoLockMinorHighwayLevel", 2);
    document.getElementById("majHwy").value = jjwme_loadUserSetting("autoLockMajorHighwayLevel", 3);
    document.getElementById("ramp").value = jjwme_loadUserSetting("autoLockRampLevel", 5);
    document.getElementById("fwy").value = jjwme_loadUserSetting("autoLockFreewayLevel", 5);
  }
  
  /********** Base Map Tools **********/
  function jjwme_convertUnknownToTwoWay() {
    if (W.map.zoom < 5) {
      alert("Cannot perform this action at a zoom level less than 5.");
      return;
    }

    var enableTurns = document.getElementById("enableAllTurns").checked;
    var segmentsToModify = jjwme_getSegmentsToModify();
    for (var segIndex in segmentsToModify) {
      // Check that we don't have too many pending changes.
      if (jjwme_pendingChangeCount() >= jjwme_MAX_BASE_EDITS) {
        alert("You've reached the maximum number of changes for base map edits. Please review, save, and run again.");
        break;
      }

      var segment = segmentsToModify[segIndex];
      if (jjwme_isBaseMapSegment(segment) && segment.getDirection() == 0 && jjwme_onScreen(segment) && segment.isGeometryEditable()) {
        W.model.actionManager.add(new UpdateObject(segment, { fwdDirection: true, revDirection: true }));

        if (enableTurns == true) {
          W.model.actionManager.add(new ModifyAllConnections(segment.getToNode(), true));
          W.model.actionManager.add(new ModifyAllConnections(segment.getFromNode(), true));
        }
      }
    }
  }

  function jjwme_convertOneWayToTwoWay() {
    if (W.map.zoom < 5) {
      alert("Cannot perform this action at a zoom level less than 5.");
      return;
    }

    var enableTurns = document.getElementById("enableAllTurns").checked;
    var segmentsToModify = jjwme_getSegmentsToModify();
    for (var segIndex in segmentsToModify) {
      // Check that we don't have too many pending changes.
      if (jjwme_pendingChangeCount() >= jjwme_MAX_BASE_EDITS) {
        alert("You've reached the maximum number of changes for base map edits. Please review, save, and run again.");
        break;
      }

      var segment = segmentsToModify[segIndex];
      if (jjwme_isBaseMapSegment(segment) && segment.isOneWay() && jjwme_onScreen(segment) && segment.isGeometryEditable()) {
        W.model.actionManager.add(new UpdateObject(segment, { fwdDirection: true, revDirection: true }));

        if (enableTurns == true) {
          W.model.actionManager.add(new ModifyAllConnections(segment.getToNode(), true));
          W.model.actionManager.add(new ModifyAllConnections(segment.getFromNode(), true));
        }
      }
    }
  }

  function jjwme_convertAllToTwoWay() {
    if (W.map.zoom < 5) {
      alert("Cannot perform this action at a zoom level less than 5.");
      return;
    }

    var enableTurns = document.getElementById("enableAllTurns").checked;
    var segmentsToModify = jjwme_getSegmentsToModify();
    for (var segIndex in segmentsToModify) {
      // Check that we don't have too many pending changes.
      if (jjwme_pendingChangeCount() >= jjwme_MAX_BASE_EDITS) {
        alert("You've reached the maximum number of changes for base map edits. Please review, save, and run again.");
        break;
      }

      var segment = segmentsToModify[segIndex];
      if (jjwme_isBaseMapSegment(segment) && (segment.isOneWay() || segment.getDirection() == 0) && jjwme_onScreen(segment) && segment.isGeometryEditable()) {
        W.model.actionManager.add(new UpdateObject(segment, { fwdDirection: true, revDirection: true }));

        if (enableTurns == true) {
          W.model.actionManager.add(new ModifyAllConnections(segment.getToNode(), true));
          W.model.actionManager.add(new ModifyAllConnections(segment.getFromNode(), true));
        }
      }
    }
  }
  
  /********** Unknown to Two-Way **********/
  function jjwme_clearUndo() {
    while (W.model.actionManager.canUndo()) {
      W.model.actionManager.undo();
    }
  } 
  
  /********** Selection History **********/ 
  // The cache of selection history Ids. This will
  // be a 2D array - first dimension containting a
  // history index, second dimenstion containting the
  // segment Ids
  var jjwme_selectionIdCache = [];
  
  // The current selection cache index. We wrap around when
  // exceeding the max number of selections to store.
  var jjwme_currentSelectionCacheIndex = 0;
  
  // The number of "backs" still available.
  var jjwme_backSelectionCount = 0;
  
  // The number of "forwards" still available.
  var jjwme_forwardSelectionCount = 0;
  
  // The maximum number of selections to store.
  var jjwme_MAX_SELECTION_STORES = 100;
  
  // Flag indicating if we're in the process or restoring selection - used
  // so we don't store any selection changes while this is happening.
  var jjwme_isRestoringSelection = false;

  var jjwme_firstSelectionMade = false;
  
  // Restore the previous selection in the selection history
  function jjwme_stepBackSelection() {
    jjwme_backSelectionCount--;
    jjwme_forwardSelectionCount++;
    jjwme_restoreSelection();
    jjwme_updateSelectionButtonsAvailability();
  }
   
  // Restore the next selection in the selection history (only applicable if you have stepped back)
  function jjwme_stepForwardSelection() {
    jjwme_backSelectionCount++;
    jjwme_forwardSelectionCount--;
    jjwme_restoreSelection();
    jjwme_updateSelectionButtonsAvailability();
  }
  
  // Restores a selection from the selection history.
  function jjwme_restoreSelection() {
    if (!jjwme_firstSelectionMade)
      return;

    jjwme_isRestoringSelection = true;

    var segementsToSelect = [];

    var cacheIndex = jjwme_currentSelectionCacheIndex - jjwme_forwardSelectionCount;
    if (cacheIndex < 0)
      cacheIndex = jjwme_selectionIdCache.length + cacheIndex;

    for (var i = 0; i < jjwme_selectionIdCache[cacheIndex].length; i++) {
      var segmentId = jjwme_selectionIdCache[cacheIndex][i];
      var segment = Waze.model.segments.get(segmentId);
      segementsToSelect.push(segment);
    }
    Waze.selectionManager.select(segementsToSelect);

    jjwme_isRestoringSelection = false;
  }
  
  // Stores a selection in the selection history
  function jjwme_storeSelection() {
    if (jjwme_firstSelectionMade)
      jjwme_currentSelectionCacheIndex++;

    jjwme_firstSelectionMade = true;
    if (jjwme_currentSelectionCacheIndex >= jjwme_MAX_SELECTION_STORES)
      jjwme_currentSelectionCacheIndex = 0;

    jjwme_currentSelectionCacheIndex = jjwme_currentSelectionCacheIndex - jjwme_forwardSelectionCount;
    if (jjwme_currentSelectionCacheIndex < 0)
      jjwme_currentSelectionCacheIndex = jjwme_selectionIdCache.length + jjwme_currentSelectionCacheIndex;
    jjwme_forwardSelectionCount = 0;

    jjwme_selectionIdCache[jjwme_currentSelectionCacheIndex] = [];

    for (var i = 0; i < W.selectionManager.selectedItems.length; i++) {
      jjwme_selectionIdCache[jjwme_currentSelectionCacheIndex][i] = W.selectionManager.selectedItems[i].model.attributes.id;
    }

    jjwme_backSelectionCount = Math.min(jjwme_MAX_SELECTION_STORES, jjwme_backSelectionCount + 1);

    jjwme_updateSelectionButtonsAvailability();
  }
  
  // Updates a selection in the selection history
  function jjwme_updateSelectionButtonsAvailability() {
    document.getElementById("inputPreviousSelectionButton").disabled = !jjwme_firstSelectionMade || (jjwme_backSelectionCount <= 1);
    document.getElementById("inputNextSelectionButton").disabled = !jjwme_firstSelectionMade || (jjwme_forwardSelectionCount <= 0);
  }
  
  // Event handler for segment selection changing.
  function jjwme_selectionChangedHandler() {
    var hasSelection = W.selectionManager.hasSelectedItems();
    if (hasSelection && !jjwme_isRestoringSelection) {
      jjwme_storeSelection();
    }
  }

})();