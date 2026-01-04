// ==UserScript==
// @name           WME RTC Manager
// @description    Utility to manage RTC
// @namespace      gylliegyllie@wazebelgium.be
// @grant          none
// @grant          GM_info
// @version        0.0.2
// @include 	     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @author         GyllieGyllie
// @license        MIT/BSD/X11
// @require        https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/549529/WME%20RTC%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/549529/WME%20RTC%20Manager.meta.js
// ==/UserScript==
/* Changelog

*/
/* global W */
/* global I18n */
/* global $ */

const ScriptName = GM_info.script.name;
const ScriptVersion = GM_info.script.version;

let ChangeLog = "RTC Manager has been updated to " + ScriptVersion + "<br />";
ChangeLog = ChangeLog + "<br /><b>New: </b>";
ChangeLog = ChangeLog + "<br />" + "- (0.0.1) Ability to select all linked segments with a matching closure";
ChangeLog = ChangeLog + "<br /><b>Updated: </b>";
ChangeLog = ChangeLog + "<br />" + "- (0.0.2) Fix not all segments being selected in some scenarios";

let wmeSDK;
const options = loadOptions();

// Now validate the options are ok
validateOptions(options);

function log(message) {
  if (typeof message === 'string') {
    console.log('RTC Manager: ' + message);
  } else {
    console.log('RTC Manager: ', message);
  }
}

// the sdk init function will be available after the WME is initialized
function WMERTCManager_bootstrap() {
  if (!document.getElementById('edit-panel') || !wmeSDK.DataModel.Countries.getTopCountry() || !WazeWrap.Ready) {
    setTimeout(WMERTCManager_bootstrap, 250);
    return;
  }

  if (wmeSDK.State.isReady) {
    WMERTCManager_init();
  } else {
    wmeSDK.Events.once({ eventName: "wme-ready" }).then(WMERTCManager_init);
  }
}

function WMERTCManager_init() {
  log("Start");

  // check for changes in the edit-panel
  const speedLimitsObserver = new MutationObserver((mutations) => {
    mutations.forEach(function(mutation) {
      // Mutation is a NodeList and doesn't support forEach like an array
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const addedNode = mutation.addedNodes[i];

        // Only fire up if it's a node
        if (addedNode.nodeType === Node.ELEMENT_NODE) {
          if (addedNode.querySelector('div.closures')) {
            makeListButtons();
          }
        }
      }

      makeDetailsButtons();
    });
  });

  speedLimitsObserver.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });

  // Catch permalinks
  //makeSigns();

  constructSettings();
  displayChangelog();

  log("Done");

}

// Check if unsafeWindow is availabe, if so use that
('unsafeWindow' in window ? window.unsafeWindow : window).SDK_INITIALIZED.then(() => {
  // initialize the sdk with your script id and script name
  wmeSDK = getWmeSdk({scriptId: "wme-rtc-manager", scriptName: "RTC Manager"});
  WMERTCManager_bootstrap();
});

function displayChangelog() {
  if (!WazeWrap.Interface) {
    setTimeout(displayChangelog, 1000);
    return;
  }

  // Alert the user version updates
  if (options.lastAnnouncedVersion === ScriptVersion) {
    log('Version: ' + ScriptVersion);
  } else {
    WazeWrap.Interface.ShowScriptUpdate(ScriptName, ScriptVersion, ChangeLog + "<br /><br />", "https://github.com/wazers/rtc-manager");

    const updateName = "#wmertcmanager" + ScriptVersion.replaceAll(".", "");
    $(updateName + " .WWSUFooter a").text("Github")

    options.lastAnnouncedVersion = ScriptVersion;
    saveOptions(options);
  }
}

function makeListButtons() {

  const container = $('div.closures-list');

  /*const selectAllButton = $('<wz-button size="sm" style="width: 100%; margin-top: 10px;">Select all</wz-button>');
  selectAllButton.on('click', selectAll);
  container.append(selectAllButton);*/

  /*const saveButton = $('<wz-button size="sm" style="width: 100%; margin-top: 10px;">Delete all</wz-button>');
  saveButton.on('click', deleteAll);
  container.append(saveButton);*/

}

function makeDetailsButtons() {

  const container = $('div.closure');

  if (!container) {
    return;
  }

  const footer = $('div.closure div.action-buttons');

  if ($("#rtcm-detail-all").length > 0) {
    return;
  }

  const selectAllButton = $('<wz-button id="rtcm-detail-all" size="sm"">Select all</wz-button>');
  selectAllButton.on('click', selectAll);
  footer.append(selectAllButton);
}

function selectAll() {

  const ids = [];
  const footerIds = $('div[class^="closureFooterFragmentContainer"] > div > li');
  footerIds.each((el) => ids.push($(footerIds[el]).text()));

  if (ids.length === 0) return;

  const nearbyClosures = wmeSDK.DataModel.RoadClosures.getAll();

  let closure = nearbyClosures.find(closure => ids.indexOf(closure.id) >= 0);

  const segmentIds = [];
  const scanned = new Set();
  if (closure) {
    const segment = wmeSDK.DataModel.Segments.getById({ segmentId: closure.segmentId });

    // Segment not found
    if (!segment) {
      return;
    }

    appendSegments(scanned, segmentIds, segment, closure);
  }

  wmeSDK.Editing.setSelection({
    selection: {
      ids: segmentIds,
      objectType: 'segment'
    }
  });
}

function deleteAll() {

  const selection = wmeSDK.Editing.getSelection();

  if ("segment" !== selection.objectType) {
    return;
  }

  const nearbyClosures = wmeSDK.DataModel.RoadClosures.getAll();

  console.log(selection);
  for (let segmentId of selection.ids) {
    console.log(segmentId);

    const segment = wmeSDK.DataModel.Segments.getById({ segmentId: segmentId });
    console.log(segment);

    if (!segment.hasClosures) {
      continue;
    }
  }


}

function appendSegments(scanned, segmentIds, segment, originalClosure) {

  // This was already scanned
  if (scanned.has(segment.id)) {
    return;
  }

  scanned.add(segment.id);
  const closures = wmeSDK.DataModel.RoadClosures.getAll().filter(rc => rc.segmentId === segment.id);

  // See if any closure matches
  for (let closure of closures) {
    if (originalClosure.description === closure.description
      && originalClosure.startDate === closure.startDate
      && originalClosure.endDate === closure.endDate
      && originalClosure.trafficEventId === closure.trafficEventId) {

      segmentIds.push(segment.id);
      break;
    }
  }

  let linkedSegments = wmeSDK.DataModel.Segments.getConnectedSegments({ segmentId: segment.id });

  for (let ls of linkedSegments) {
    appendSegments(scanned, segmentIds, ls, originalClosure);
  }

  linkedSegments = wmeSDK.DataModel.Segments.getConnectedSegments({ segmentId: segment.id, reverseDirection: true });

  for (let ls of linkedSegments) {
    appendSegments(scanned, segmentIds, ls, originalClosure);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////
//// Option Logic
////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function constructSettings() {

  // -- Set up the tab for the script
  wmeSDK.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
    tabLabel.innerText = 'RTC Manager';
    tabLabel.title = 'RTC Manager Settings';

    tabPane.innerHTML = '<div id="rtc-manager-settings"></div>';

    const scriptContentPane = $('#rtc-manager-settings');

    scriptContentPane.append(`<h2 style="margin-top: 0;">RTC Manager</h2>`);
    scriptContentPane.append(`<span>Current Version: <b>${ScriptVersion}</b></span>`);

    //addTextNumberSettings(scriptContentPane, '', 'Icon Scale in %', 'iconScale');
    //addBooleanSettingsCallback(scriptContentPane, '', 'Enable Clear Sign', 'clearSign', toggleBoolean);
  });

}

function getDefaultOptions() {
  return {
    lastAnnouncedVersion: '',
  }
}

function loadOptions() {
  let text = localStorage.getItem("RTC-Manager-Options");
  let options;

  if (text) {
    options = JSON.parse(text);
  } else {
    options = getDefaultOptions();
  }

  return options;
}

function validateOptions(options) {
  const defaultOptions = getDefaultOptions();

  // Add missing options
  for (let key in defaultOptions) {
    if (!(key in options)) {
      options[key] = defaultOptions[key]
    }
  }
}

function saveOptions(options) {
  const optionsJson = JSON.stringify(options);
  localStorage.setItem("RTC-Manager-Options", optionsJson);
}

function changeText(event) {
  options[event.target.id] = event.target.value;
  saveOptions(options);
}

function addTextNumberSettings(container, title, label, name, step = 1) {
  const currentValue = options[name];

  const textInput = $('<wz-text-input type="number" min="0" max="999" step="' + step + '" id="' + name + '" value="' + currentValue + '"></wz-text-input>');
  const optionHtml = $('<div style="margin-top: 10px;"><span Title="' + title + '">' + label + '</span></div>').append(textInput);

  container.append(optionHtml);

  textInput.on('change', changeText);
}

function addBooleanSettingsCallback(container, title, label, name, clickHandler) {
  const currentValue = options[name];

  const checkbox = $('<wz-checkbox id="' + name + '" Title="' + title + '" name="types" disabled="false" checked="' + currentValue + '">' + label + '</wz-checkbox>');
  const optionHtml = $('<div class="urcom-option"></div>').append(checkbox);

  container.append(optionHtml);

  checkbox.on('click', clickHandler);
}

function toggleBoolean(event) {
  options[event.target.id] = event.target.checked;
  saveOptions(options);
}
