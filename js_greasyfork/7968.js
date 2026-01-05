// ==UserScript==
// @name        CALOToSuperCALOHooks
// @namespace   dodintso@cisco.com
// @include     http://*.cisco.com/omnitool*
// @version     1.2.3
// @grant       GM_xmlhttpRequest
// @grant       func
// @grant       manageStdView
// @grant       manageStdView_orig
// @description CALO to SuperCALO Interface hooks
// @downloadURL https://update.greasyfork.org/scripts/7968/CALOToSuperCALOHooks.user.js
// @updateURL https://update.greasyfork.org/scripts/7968/CALOToSuperCALOHooks.meta.js
// ==/UserScript==
var script_version = '1.2.3';
console.log('CALO to SuperCALO Hooks ' + script_version + ' started');

// Variables

var devicesOnPage = {};
var superCaloDevices = [];

// Functions

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function arrayDeduplicate(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

function superCaloCommandResponse(selector, responseResultText) {
  selector.disabled = false;
  selector.selectedIndex = 0;
  selector.parentNode.getElementsByClassName('SuperCaloDIV')[0].innerHTML = responseResultText;
  console.log(responseResultText);
}

function superCaloSendCommandToServer(command, selector, fileInput, file) {
  if (fileInput && fileInput.files.length > 0 && !file) {
    console.log('File is not ready, scheduling');
    setTimeout(sendData, 10);
    return;
  }
  var deviceName = selector.id;
  selector.disabled = true;
  var i;
  var username;
  var ahrefs = top.document.getElementsByTagName('head')[0].getElementsByTagName('LINK');
  for (i = 0; i < ahrefs.length; i++) {
      var match = /username=(.+)$/g.exec(ahrefs[i].href);
      if (match) {
          username = match[1];
          break;
      }
  }
  var boundary = "SuperCALOFormBoundaryHzWUdtKjpJ6vsm6Q";
  var data     = "";
  data += '--' + boundary + "\r\n";
  data += 'content-disposition: form-data; name="command"\r\n\r\n' + command + "\r\n";
  data += '--' + boundary + "\r\n";
  data += 'content-disposition: form-data; name="deviceName"\r\n\r\n' + deviceName + "\r\n";
  data += '--' + boundary + "\r\n";
  data += 'content-disposition: form-data; name="username"\r\n\r\n'+ username +"\r\n";
  var inputFields = selector.parentNode.getElementsByTagName('INPUT');
  if (inputFields) {
    for (i = 0; i < inputFields.length; i++) {
      switch (inputFields[i].type) {
        case 'text':
          data += '--' + boundary + "\r\n";
          data += 'content-disposition: form-data; name="' + inputFields[i].name + '"\r\n\r\n' + inputFields[i].value + "\r\n";
          //console.log('Parameter ' + inputFields[i].name + ' = ' + inputFields[i].value);
          break;
        case 'file':
          if (fileInput && fileInput.files[0] && file) {
            data += '--' + boundary + "\r\n";
            data += 'content-disposition: form-data; name="fileName"\r\n\r\n' + fileInput.files[0].name + "\r\n";
            data += '--' + boundary + "\r\n";
            data += 'content-disposition: form-data; name="file"; filename="' + fileInput.files[0].name + '"\r\n';
            data += 'Content-Type: application/octet-stream\r\n\r\n';
            data += file + '\r\n';
            //console.log('File name ' + fileInput.files[0].name + ', file length ' + file.length + ', number of files ' + fileInput.files.length);
          }
          break;
      }
    }
  }
  data += '--' + boundary + "--\r\n\r\n";
  
  GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://10.48.45.236:8000/',
      data: data,
      headers: {
          'Content-Type': 'multipart/form-data; boundary=' + boundary,
          'Content-Length': data.length
      },
      timeout: 10000, // Ten seconds
      ontimeout: function(response) {
        superCaloCommandResponse(selector, "request timed out");
      },
      onerror: function(response) {
        superCaloCommandResponse(selector, "request error");
      },
      onload: function(response) {
        superCaloCommandResponse(selector, "completed");
      }
  });
  console.log("Command " + command + " sent for " + deviceName + " device, username " + username);
  return false;
}

function superCaloSelectorOnChange(selector) {
  var div;
  if (div = selector.parentNode.getElementsByClassName('SuperCaloDIV')[0]) {
    div.innerHTML = "";
    switch (selector.options[selector.selectedIndex].value) {
      case "SetBootImage":
        div.innerHTML="Image Name <input type='text' name='fileName'></input><br>Interface <input type='text' name='deviceInterface'></input>";
        break;
      case "Recover":
        div.innerHTML="Interface <input type='text' name='deviceInterface'></input>";
        break;
      case "RestoreDefaults":
        superCaloSendCommandToServer("RestoreDefaults", selector);
        break;
      case "UploadImageToDevice":
        div.innerHTML="Image Name <input type='text' name='fileName'></input><br>Interface <input type='text' name='deviceInterface'></input>";
        break;
      case "UploadFileToDevice":
        div.innerHTML="File <input class='superCaloFileSelector' type='file' name='file'></input><br>Interface <input type='text' name='deviceInterface'></input>";
        break;
      case "DeployShowtech":
        div.innerHTML="File <input class='superCaloFileSelector' type='file' name='file'></input><br>Interface <input type='text' name='deviceInterface'></input>";
        break;
      case "Backup":
        superCaloSendCommandToServer("Backup", selector);
        break;
      case "PowerOn":
        superCaloSendCommandToServer("PowerOn", selector);
        break;
      case "PowerOff":
        superCaloSendCommandToServer("PowerOff", selector);
        break;
      case "PowerCycle":
        superCaloSendCommandToServer("PowerCycle", selector);
        break;
    }
    if (selector.options[selector.selectedIndex].value == "SetBootImage" ||
        selector.options[selector.selectedIndex].value == "Recover" ||
        selector.options[selector.selectedIndex].value == "UploadImageToDevice" ||
        selector.options[selector.selectedIndex].value == "UploadFileToDevice" ||
        selector.options[selector.selectedIndex].value == "DeployShowtech") {
          var submit = document.createElement("INPUT");
          submit.setAttribute("type", "submit");
          submit.value = "send";
          submit.id = selector.id;
          var fileInput = div.getElementsByClassName('superCaloFileSelector');
          if (fileInput.length > 0) {
            var file;
            var reader = new FileReader()
            reader.addEventListener("load", function ()
                                    {
                                        file = reader.result;
                                    });
            fileInput[0].addEventListener("change", function ()
                                       {
                                           if(reader.readyState === FileReader.LOADING) {
                                               reader.abort();
                                           }
                                           reader.readAsBinaryString(fileInput[0].files[0]);
                                       });
            submit.addEventListener('click', function() {
              superCaloSendCommandToServer(selector.options[selector.selectedIndex].value, selector, fileInput[0], file);
            });
          } else {
            submit.addEventListener('click', function() {
              superCaloSendCommandToServer(selector.options[selector.selectedIndex].value, selector);
            });
          }
          div.appendChild(submit);
    }
  } else {
    console.log('div ' + selector.id + ' not found ');
  }
}

exportFunction(superCaloSelectorOnChange, unsafeWindow, {defineAs: "superCaloSelectorOnChange"});

function injectSuperCaloMenu(element, deviceName) {
    var existingCaloSelector;
    existingCaloSelector = element.getElementsByClassName('action-menu')[0];
    if (existingCaloSelector) {
        existingCaloSelector.parentNode.innerHTML = existingCaloSelector.parentNode.innerHTML + 
          "<select id=\""+deviceName+"\" class=\"SuperCaloSELECTOR\" name=\"command\" onchange=\"superCaloSelectorOnChange(this);\"><option>Select Action</option><option value=\"SetBootImage\">Set Boot Image</option><option value=\"Recover\">Recover</option><option value=\"RestoreDefaults\">Restore Defaults</option><option value=\"UploadImageToDevice\">Upload Image</option><option value=\"UploadFileToDevice\">Upload File</option><option value=\"DeployShowtech\">Deploy Showtech</option><option value=\"Backup\">Backup</option><option value=\"PowerOn\">Power On</option><option value=\"PowerOff\">Power Off</option><option value=\"PowerCycle\">Power Cycle</option></select>" +
          "<br><div id=\""+deviceName+"\" class=\"SuperCaloDIV\"></div>";
    }
}

function injectSuperCaloControls(forDevices) {
    var deviceName;
    var elementToInject;
    for (deviceName in forDevices) {
        if (superCaloDevices.indexOf(deviceName) != -1) {
            elementToInject = devicesOnPage[deviceName].getElementsByClassName('columnNoBorder')[0];
            if (elementToInject) {
                injectSuperCaloMenu(elementToInject, deviceName);
            }
        }
    }
}

function doThis() {
    setTimeout(doThis, 10000);
    var elem = document.getElementById('doActions');
    if (elem) {
        console.log(elem.innerHTML);
    }
}
/*
var div = document.getElementById('searchResults');
console.log('searchResults ' + div.innerHTML.length);
*/
function getDevicesOnPage() {
    var devices = {};
    var results = document.getElementsByClassName('resultTable');
    if (results) {
        for (i = 0; i < results.length; i++) {
            element = results[i].getElementsByClassName('columnWithBorder')[0];
            if (element) {
                for (m = 0; m < element.childNodes.length; m++) {
                    if (element.childNodes[m].nodeType == 8) {
                        deviceName = element.childNodes[m].data.trim();
                        devices[deviceName] = results[i];
                        break;
                    }
                }
            }
        }
    }
    return devices;
}

function superCaloRequestForDevicesResponseReceived(response) {
    var i;
    var updateDevices = {};
    var responseJSON = JSON.parse(response.responseText);
    console.log("Reply received confirming " + responseJSON.devices.length + " devices");
    superCaloDevices = arrayDeduplicate(superCaloDevices.concat(responseJSON.devices));
    for (i = 0; i < responseJSON.devices.length; i++) {
        updateDevices[responseJSON.devices[i]] = devicesOnPage[responseJSON.devices[i]];
    }
    injectSuperCaloControls(updateDevices);
}

function superCaloRequestForDevices(devices) {
    var deviceName;
    var i;
    var parameters = '';
    if (devices.length > 0) {
	    for (i = 0; i < devices.length; i++) {
            parameters = parameters + '&device=' + devices[i];
        }
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://10.48.45.236:8000/',
            data: 'command=IsSuperCALOItem' + parameters,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 10000, // Ten seconds
            ontimeout: function(response)
            {
                console.log("request timed out");
            },
            onerror: function(response)
            {
                console.log("request error");
            },
            onload: superCaloRequestForDevicesResponseReceived
        });
        console.log('Request sent for ' + devices.length + ' devices');
    }
}

function devicesWeHaveNoStoredInformationAbout(devicesOnPage) {
    var deviceName;
    var devices = [];
    for (deviceName in devicesOnPage) {
        if (superCaloDevices.indexOf(deviceName) == -1) {
            devices.push(deviceName);
        }
    }
    return devices;
}

function redrawSuperCaloControls() {
  devicesOnPage = getDevicesOnPage();
  injectSuperCaloControls(devicesOnPage);
  superCaloRequestForDevices(devicesWeHaveNoStoredInformationAbout(devicesOnPage));
}

// This is where we start

if (unsafeWindow.manageStdView) {
    var manageStdView_orig = unsafeWindow.manageStdView;
    var manageStdView_hijack = function(text) {
        manageStdView_orig(text);
        console.log("SuperCALO hijacked refresh function. Assuming view was updated, refreshing SuperCALO controls on the page");
        redrawSuperCaloControls();
    };
    exportFunction(manageStdView_hijack, unsafeWindow, {defineAs: "manageStdView_hijack"});
    unsafeWindow.manageStdView = unsafeWindow.manageStdView_hijack;
}

redrawSuperCaloControls();
