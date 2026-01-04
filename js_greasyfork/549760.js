// ==UserScript==
// @name           WME Reselect
// @description    Utility to redo recent selections
// @namespace      gylliegyllie@wazebelgium.be
// @grant          none
// @grant          GM_info
// @version        0.0.1
// @include 	     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @author         GyllieGyllie
// @license        MIT/BSD/X11
// @require        https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/549760/WME%20Reselect.user.js
// @updateURL https://update.greasyfork.org/scripts/549760/WME%20Reselect.meta.js
// ==/UserScript==
/* Changelog

*/
/* global W */
/* global I18n */
/* global $ */

// Credits for icon go to FlatIcon
const undoIcon = 'data:image/png;base64,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';

const ScriptName = GM_info.script.name;
const ScriptVersion = GM_info.script.version;

let ChangeLog = "WME Reselect has been updated to " + ScriptVersion + "<br />";
ChangeLog = ChangeLog + "<br /><b>New: </b>";
ChangeLog = ChangeLog + "<br />" + "- Ability to redo your recent selections";

let wmeSDK;
const options = loadOptions();

const selectionHistory = [];
let rollbackCount = 0;
let rollbackPending = undefined;

// Now validate the options are ok
validateOptions(options);

function log(message) {
  if (typeof message === 'string') {
    console.log('Reselect: ' + message);
  } else {
    console.log('Reselect: ', message);
  }
}

// the sdk init function will be available after the WME is initialized
function WMEReselect_bootstrap() {
  if (!wmeSDK.DataModel.Countries.getTopCountry() || !WazeWrap.Ready) {
    setTimeout(WMEReselect_bootstrap, 250);
    return;
  }

  if (wmeSDK.State.isReady) {
    WMEReselect_init();
  } else {
    wmeSDK.Events.once({ eventName: "wme-ready" }).then(WMEReselect_init);
  }
}

function WMEReselect_init() {
  log("Start");

  constructSettings();
  displayChangelog();

  const button = document.createElement('div');
  button.style.cssText = 'cursor:pointer;float:left;height:20px;width:20px;margin:5px;background-image: url(\''+ undoIcon + '\');background-size:contain;';

  button.onclick = () =>  doRollback();
  $('.secondary-toolbar-actions:not(.user-toolbar)').prepend(button);

  wmeSDK.Events.on({
    eventName: 'wme-selection-changed',
    eventHandler: addSelection
  });

  log("Done");

}

// Check if unsafeWindow is availabe, if so use that
('unsafeWindow' in window ? window.unsafeWindow : window).SDK_INITIALIZED.then(() => {
  // initialize the sdk with your script id and script name
  wmeSDK = getWmeSdk({scriptId: "wme-reselect", scriptName: "Reselect"});
  WMEReselect_bootstrap();
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
    WazeWrap.Interface.ShowScriptUpdate(ScriptName, ScriptVersion, ChangeLog + "<br /><br />", "https://github.com/wazers/wme-reselect");

    const updateName = "#wmereselect" + ScriptVersion.replaceAll(".", "");
    $(updateName + " .WWSUFooter a").text("Github")

    options.lastAnnouncedVersion = ScriptVersion;
    saveOptions(options);
  }
}

function addSelection() {
  const selection = wmeSDK.Editing.getSelection();
  console.log(selection);

  if (!selection) {
    if (!rollbackPending) {
      // Only reset when no pending rollback
      // Sometimes the set selection does an unselect first?
      rollbackCount = 0;
    }
    return;
  }

  if (rollbackPending && selection.objectType === rollbackPending.objectType && selection.ids.length === rollbackPending.ids.length) {
    rollbackPending = null;
    return;
  }

  // We don't track this selection type
  if (options.activeSelectionTypes.indexOf(selection.objectType) === -1) {
    rollbackCount = 0;
    return;
  }

  // New selection so remove all rolled back selections
  if (rollbackCount > 1) {
    selectionHistory.splice(selectionHistory.length - rollbackCount);
    rollbackCount = 0;
  }

  selectionHistory.push(selection);
  log("count: " + selectionHistory.length);
  log("rollback: " + rollbackCount);

  // History is becoming to large so remove oldest element
  if (selectionHistory.length > options.maxHistory) {
    selection.splice(0, 1);
  }
}

function doRollback() {
  const currentSelection = wmeSDK.Editing.getSelection();

  rollbackCount += 1;

  if (rollbackCount > selectionHistory.length) {
    rollbackCount = selectionHistory.length;
  }

  rollbackPending = selectionHistory[selectionHistory.length - rollbackCount];

  if (rollbackCount === 0 && !!currentSelection && currentSelection.objectType === rollbackPending.objectType) {
    // Selection was still active so we need to ignore current selection for rollback
    rollbackCount = 1;
    rollbackPending = selectionHistory[selectionHistory.length - rollbackCount];
  }

  log("rollback: " + rollbackCount);
  log(rollbackPending);

  wmeSDK.Editing.setSelection({
    selection: rollbackPending
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////
//// Option Logic
////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function constructSettings() {

  // -- Set up the tab for the script
  wmeSDK.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
    tabLabel.innerText = 'Reselect';
    tabLabel.title = 'Reselect';

    tabPane.innerHTML = '<div id="reselect-settings"></div>';

    const scriptContentPane = $('#reselect-settings');

    scriptContentPane.append(`<h2 style="margin-top: 0;">Reselect</h2>`);
    scriptContentPane.append(`<span>Current Version: <b>${ScriptVersion}</b></span>`);

    addTextNumberSettings(scriptContentPane, 'To avoid memory issues during long edit sessions do not make this too large', 'Max history', 'maxHistory');

    scriptContentPane.append(`<h5>Selection Types To Track:</h5>`);

    addBooleanListSettingsCallback(scriptContentPane, '', 'Segments', 'activeSelectionTypes', 'segment')
  });

}

function toggleTrackOptions(event, value) {
  const current = options['activeSelectionTypes'].indexOf(value);

  if (current >= 0) {
    options['activeSelectionTypes'].splice(current, 1);
  } else {
    options['activeSelectionTypes'].push(value);
  }
  saveOptions(options);
}

function getDefaultOptions() {
  return {
    lastAnnouncedVersion: '',
    maxHistory: 100,
    activeSelectionTypes: [
      'segment'
    ]
  }
}

function loadOptions() {
  let text = localStorage.getItem("Reselect-Options");
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
  localStorage.setItem("Reselect-Options", optionsJson);
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
  const optionHtml = $('<div class="reselect-option"></div>').append(checkbox);

  container.append(optionHtml);

  checkbox.on('click', clickHandler);
}

function addBooleanListSettingsCallback(container, title, label, name, value, clickHandler) {
  const currentlyActive = options[name].indexOf(value) >= 0;

  const checkbox = $('<wz-checkbox id="' + name + '" Title="' + title + '" name="types" disabled="false" checked="' + currentlyActive + '">' + label + '</wz-checkbox>');
  const optionHtml = $('<div class="reselect-option"></div>').append(checkbox);

  container.append(optionHtml);

  checkbox.on('click', clickHandler);
}

function toggleBoolean(event) {
  options[event.target.id] = event.target.checked;
  saveOptions(options);
}
