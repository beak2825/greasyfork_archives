// ==UserScript==
// @name         YMS Util
// @namespace    https://trans-logistics.amazon.com
// @version      2021.04.14
// @description  Adds Valet-style move notification (DISABLED FOR REIMPLEMENTATION). Changes links next to VRIDs and ISAs (!!BROKEN!!). Visually groups spots with 2 assets (tractor and trailer). Pings Event History for recent TDR release and notifies.
// @author       bjerkt@
// @license      MIT
// @match        https://trans-logistics.amazon.com/yms/shipclerk/*
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @grant        GM_addStyle
// @grant        window.focus
// @grant        parent.focus
// @downloadURL https://update.greasyfork.org/scripts/562741/YMS%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/562741/YMS%20Util.meta.js
// ==/UserScript==
(function() {
    'use strict';
     // Handle Tampermonkey running the script too late to catch the loading events
    if (document.readyState != 'complete') {
        window.addEventListener('load', windowLoadedCallback);
    } else {
        windowLoadedCallback();
    }
    function windowLoadedCallback() {
        if (window.location.href.indexOf("shipclerk/#/yard") > -1) {
            // Fix comment button collapsing to a few pixels wide
            document.styleSheets[0].insertRule('.note-present-icon {flex-shrink: 0;}');
            // ISA link to DM: https://fc-inbound-dock-hub-na.aka.amazon.com/en_US/#/dockmaster/appointment/{yard}/view/{ISA}/appointmentDetail
            // VRID link to FMC: https://trans-logistics.amazon.com/fmc/execution/search/{VRID}
            // Add the dashboard
            document.getElementById('mainContainer').insertAdjacentHTML('beforebegin', `
               <div id="dashboard">
               <!--
                   <div>
                       <h2>Notify on TDR Release</h2>
                       <label class="switch">
                           <input id="dingToggle" type="checkbox" checked>
                           <span class="slider round"></span>
                       </label>
                   </div>
                 -->
                   <div>
                       <h2>Highlight Tractor-Trailer Pairs</h2>
                       <label class="switch">
                           <input id="highlightToggle" type="checkbox">
                           <span class="slider round"></span>
                       </label>
                   </div>
               </div>
          ` );
            GM_addStyle ( `
               /* Override move queue dialog width because it's very narrow for some reason */
               div#moveQueueDialog {
                   width: 75vw !important;
               }
               /*SCACs overflow into next row, this fixes*/
               table#ship-clerk-dashboard-table .masterYard td:nth-child(5) > div {
                   overflow: auto;
               }
               table.movementQueueTable > tbody > tr > td:last-child {}
               #dashboard{
                   position:       relative;
                   top:            0px;
                   left:           0px;
                   border-top-style:    solid;
                   border-bottom-style: solid;
                   border-color:   grey;
                   display:        flex;
               }
               /* The switch - the box around the slider */
               .switch {
                   position: relative;
                   display: inline-block;
                   width: 60px;
                   height: 34px;
                }
                /* Hide default HTML checkbox */
                .switch input {
                   opacity: 0;
                   width: 0;
                   height: 0;
                }
                /* The slider */
                .slider {
                   position: absolute;
                   cursor: pointer;
                   top: 0;
                   left: 0;
                   right: 0;
                   bottom: 0;
                   background-color: #ccc;
                   -webkit-transition: .4s;
                   transition: .4s;
                }
                .slider:before {
                   position: absolute;
                   content: "";
                   height: 26px;
                   width: 26px;
                   left: 4px;
                   bottom: 4px;
                   background-color: white;
                   -webkit-transition: .4s;
                   transition: .4s;
                }
                input:checked + .slider {
                   background-color: #2196F3;
                }
                input:focus + .slider {
                   box-shadow: 0 0 1px #2196F3;
                }
                input:checked + .slider:before {
                   -webkit-transform: translateX(26px);
                   -ms-transform: translateX(26px);
                   transform: translateX(26px);
                }
                /* Rounded sliders */
                .slider.round {
                   border-radius: 34px;
                }
                .slider.round:before {
                   border-radius: 50%;
                }
            ` );
//=============================================
// Set up MutationObsevers
//=============================================
            // Is there a better way to detect list changes?
            //document.getElementById('searchInput').addEventListener(search or something)
            var overlayChangeCallback = function(mutationsList, observer) {
                for (var mutation of mutationsList) {
                    // When loading overlay is re-hidden, i.e. all elements are created and populated
                    // THIS IS NOT TRUE, angular performs another digest cycle after hiding overlay, oerwriting everything that goes on here.
                    // TODO: figure out what to do about this. $$PostDigest()?
                    if (mutation.oldValue == 'yms-modal-backdrop ng-scope' && mutation.target.className == 'yms-modal-backdrop ng-scope hidden') {
                        // Add links here
                        /*
                        var loadIdContainers = document.querySelectorAll('div.load-identifiers > div.shipclerk-std-label > span');
                        if (loadIdContainers.length > 0) {
                            addLinks(loadIdContainers);
                        }
                        */
                        // Hook in pair highlighting here
                        if (highlightPairsBool) {
                            highlightPairs()
                        }
                    }
                }
            };
            // Need to wait for loadingMask to be created by angularjs
            // Simple polling of DOM, not ideal but it gets the job done
            var findLoadingMask = new Promise(function (resolve){
                waitForLoadingMask(resolve);
            });
            function waitForLoadingMask(resolve) {
                var loadingMask = document.getElementById('loadingMask');
                if (loadingMask == undefined) {
                    setTimeout(waitForLoadingMask.bind(this, resolve), 500); // Wait 50ms before polling DOM again
                } else {
                    resolve(loadingMask);
                }
            }
            // Watch loading mask to see when list has been built & it's safe to grab elements
            var overlayObserver = new MutationObserver(overlayChangeCallback);
            var overlayObsConfig = { attributes: true, attributeFilter:["class"], attributeOldValue: true };
            findLoadingMask.then(function(loadingMask) {
                overlayObserver.observe(loadingMask, overlayObsConfig);
            });
//=============================================
// Add links to the VRIDs & ISAs
//=============================================
            var yard = document.querySelector('#headerNav > div.header-rightpanel > span.a-text-bold:not(.a-color-link)').textContent.match(/\S{4}/)[0];
            /*
            function addLinks(idConts) {
                var regExVRID = /VRID (\w{9})/; //VRIDs always 9 chars long
                var regExISA = /ISA (\d+)/; //ISAs are indeterminate length (8? now 9?)
                Array.prototype.forEach.call(idConts, function(container, i) {
                    // Don't make a double
                    if (container.querySelector('a.yms-util-link') === null) {
                        var vrid = regExVRID.exec(container.innerText);
                        var isa = regExISA.exec(container.innerText);
                        if (vrid) {
                            requestAnimationFrame(function() {
                                var sspLink = container.querySelector('span > a');
                                sspLink.target = "_blank";
                                var a = document.createElement('a');
                                var linkText = document.createTextNode("FMC");
                                a.appendChild(linkText);
                                a.title = "Open VRID in FMC";
                                a.href = "https://trans-logistics.amazon.com/fmc/execution/search/" + vrid[1];
                                a.target = "_blank";
                                a.classList.add('yms-util-link');
                                container.appendChild(a);
                            });
                        } else if (isa) {
                            requestAnimationFrame(function() {
                                // Change vanilla DM link to regular text
                                var dmLink = container.querySelector('a');
                                var txt = document.createElement('span');
                                txt.innerHTML = dmLink.innerHTML;
                                container.children[0].insertBefore(txt, dmLink);
                                container.children[0].removeChild(dmLink);
                                // Add my own DM link
                                var b = document.createElement('a');
                                var bc = document.createTextNode('DM');
                                b.appendChild(bc);
                                b.title = "Open ISA in DockMaster";
                                b.href = "https://fc-inbound-dock-hub-na.aka.amazon.com/en_US/#/dockmaster/appointment/" + yard + "/view/" + isa[1] + "/appointmentDetail";
                                b.target = "_blank";
                                b.classList.add('yms-util-link');
                                container.appendChild(b);
                            });
                        }
                    }
                });
            };
            */
//=============================================
// Highlight tractor-trailer pairs
//=============================================
            var highlightPairsBool = false;
            document.getElementById('highlightToggle').addEventListener('change', function(event) {
               if (this.checked) {
                   highlightPairs();
                   highlightPairsBool = true;
               } else {
                   // Clear any highlighted rows
                   var rows = document.querySelectorAll('tbody.masterYard > tr');
                   Array.prototype.forEach.call(rows, function(row, i) {
                       row.removeAttribute('style');
                   });
                   highlightPairsBool = false;
               }
            });;
            function highlightPairs() {
                var dblHeightRows = document.querySelectorAll('tr > td.col2[rowspan="2"]');
                if (dblHeightRows && dblHeightRows.length > 0) {
                    var colors = [];
                    var huedelta = Math.trunc(360 / dblHeightRows.length);
                    for (let j = 0; j < dblHeightRows.length; j++) {
                        var hue = j * huedelta;
                        colors.push('hsla('+hue+',100%,50%, 0.5)');
                    }
                    Array.prototype.forEach.call(dblHeightRows, function(col, i) {
                        // Make sure it's a tractor & trailer
                        if (col.children[0].childElementCount == 2 && col.children[0].children[0].children[0].classList.value.match(/TRAILER/) && col.children[0].children[1].children[0].classList.value.match(/TRACTOR/)) {
                            var row = col.parentNode;
                            var nextRow = getNextSibling(row, 'tr');
                            var color = colors.pop();
                            row.style.setProperty('background-color', color, 'important');
                            nextRow.style.setProperty('background-color', color, 'important');
                            row.style.borderTop = '5px solid #722727';
                            nextRow.style.borderBottom = '5px solid #722727';
                        }
                    });
                }
            }
            var getNextSibling = function (elem, selector) {
	            // Get the next sibling element
	            var sibling = elem.nextElementSibling;
	            // If the sibling matches our selector, use it
	            // If not, jump to the next sibling and continue the loop
	            while (sibling) {
	            	if (sibling.matches(selector)) return sibling;
	            	sibling = sibling.nextElementSibling
            	}
            };
//=============================================
// Notification on new move detected
//=============================================
            /*
            var hasNotifyLock = false;
            var shouldNotifyToggle = true;
            var movePoll = setInterval(checkMoves ,60000); // Poll for moves every 60 seconds. Upped from 10sec by YardTech request
            var moves = {"movements": []};
            document.getElementById('dingToggle').addEventListener('change', function(event) {
                if (document.getElementById('dingToggle').checked) {
                    shouldNotifyToggle = true;
               } else {
                   shouldNotifyToggle = false;
               }
            });
            var notifySound = new Audio("https://raw.githubusercontent.com/ipython-contrib/jupyter_contrib_nbextensions/master/src/jupyter_contrib_nbextensions/nbextensions/notify/notify.mp3");

            function checkMoves() {
                var postUrl = "https://yms-na.amazon.com/YMSServiceInternal/";
                var postHeaders = {"content-encoding": "amz-1.0",
                                  "Content-Type": "application/json",
                                  "X-Amz-Target": "com.amazon.yms.coral.privateapi.YMSServiceInternal.listHostlerMoves"}
                var postBody = {method: "com.amazon.yms.coral.privateapi.YMSServiceInternal.listHostlerMoves",
                                context: {securityToken: ymsSecurityToken}}
                jQuery.ajax({
                    method: "POST",
                    cache: false,
                    url: postUrl,
                    headers: postHeaders,
                    processData: true,
                    data: JSON.stringify(postBody),
                    dataType: "json"
                })
                .done(function(response) {
                    // Check if moves have been added (more or different)
                    // Any unregistered moves? If response has entries not in moves...if response is not complete subset of moves
                    // Shouldn't even have to worry about count except for short-circuiting to bypass subset calculation
                    if ((response.movements.length > moves.movements.length) || (!isSubset(response.movements, moves.movements))) {
                        // Can this instance get the notification lock?
                        if(!cookieExists() && !hasNotifyLock) {
                            setCookie(1);
                            hasNotifyLock = true;
                        }
                        // Do we have notification lock? Does user want notification (toggle switch)?
                        if(cookieExists() && hasNotifyLock && shouldNotifyToggle) {
                            // Notify user of new moves
                            let promise = notifySound.play();
                            if (promise !== undefined) {
                                promise.catch(function(e) {
                                    console.log('Error playing notification sound:\n' + e.message);
                                });
                            }
                            // Make a notification if we don't have focus
                            if (!document.hasFocus()) {
                                buildNotification(response);
                            }
                        }
                    }
                    // Sould we bother touching DOM
                    if (response.movements.length != moves.movements.length) {
                        // Set hostler moves in ui to new move count
                        document.querySelector("div.mainAlert[ng-click='topbar.showHostlerMovesDialog()'] > div").textContent = response.movements.length;
                    }
                    moves = response;
                })
                .fail(function(jqXHRObj, errorMsg) {console.log('listHostlerMoves fail.'); console.log(errorMsg);});
            }
            var isSubset = function(a, b) {
                // Compare array a to array b
                // True if all elements of a are found in b
                for (var i = 0; i < a.length; i++) {
                    var isPresent = false
                    for (var j = 0; j < b.length; j++) {
                        if (a[i].toString() == b[j].toString()) {
                            isPresent = true;
                            break;
                        }
                    }
                    if (!isPresent) {return false;}
                }
                return true;
            }
            var buildNotification = function(response) {
                if (Notification.permission !== "granted") {
                    Notification.requestPermission();
                }
                else {
                    var moveStr = 'Moves: ' + response.movements.length + '\n\n';
                    Array.prototype.forEach.call(response.movements, function(move, i){
                        var src = move.sourceLocation.name;
                        var dst = move.targetLocation.name;
                        var tlr = move.yardAssets[0].owner.code;
                            moveStr += tlr + ': ' + src + ' -> ' + dst + '\n';
                    });

                    var notifyIcon = 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Move_icon.svg';
                    // new notifications with same tag replace instead of stack
                    var notification = new Notification('Hostler', {body: moveStr, icon: notifyIcon, tag: 'movesNotify'});
                    notification.onclick = function () {
                        parent.focus();
                        window.focus(); //just in case, older browsers
                        this.close();
                    };
                    // Timeout 5 sec
                    setTimeout(function() {notification.close()}, 5000);
                }
            }
            function setCookie(exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires="+d.toUTCString();
                document.cookie = 'notification-lock' + "=" + 'locked' + ";" + expires + ";path=/";
            }
            function getCookie() {
                var name = 'notification-lock' + '=';
                var ca = document.cookie.split(';');
                for(var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
            function cookieExists() {
                var c = getCookie();
                if (c != "") {
                    return true;
                } else {
                    return false;
                }
            }
            // Release lock on window exit
            window.addEventListener('unload', function() {
                setCookie(0);
                hasNotifyLock = false;
            });
            */
//=============================================
// Batch rename dialog
//=============================================
            /*
            var assetsBySCAC = {};
            document.getElementById('batchRenameDialogBtn').addEventListener('click', openRenameDialog);
            document.getElementById('batchRenameBtn').addEventListener('click', function() {
                try {
                    // Commit changes
                    var scacsSelected = document.getElementById('scacList').selectedOptions;
                    var reasonSelected = document.getElementById('reasonList').value;
                    // Loop through all selected SCACs
                    Array.prototype.forEach.call(scacsSelected, function(option) {
                        // Loop through all recorded assets with selected SCAC
                        Array.prototype.forEach.call(assetsBySCAC[option.value], function(asset) {
                            var updateModel = buildUpdateModel(asset, reasonSelected.toUpperCase());
                            var postUrl = "https://yms-na.amazon.com/YMSServiceInternal/";
                            var postHeaders = {"content-encoding": "amz-1.0",
                                              "Content-Type": "application/json",
                                              "X-Amz-Target": "com.amazon.yms.coral.privateapi.YMSServiceInternal.updateAsset"}
                            var postBody = {method: "com.amazon.yms.coral.privateapi.YMSServiceInternal.updateAsset",
                                            updateModel: updateModel,
                                            context: {securityToken: ymsSecurityToken}}
                            jQuery.ajax({
                                method: "POST",
                                cache: false,
                                url: postUrl,
                                headers: postHeaders,
                                processData: true,
                                data: JSON.stringify(postBody),
                                dataType: "json"
                            })
                            .done(function(response) {
                                 console.log('updateAsset success.');
                            })
                            .fail(function(jqXHRObj, textStatus, errorMsg) {console.log('updateAsset fail.'); console.log(textStatus); console.log(errorMsg);});
                        });
                    });
                    document.getElementById('rightMenu').querySelector('.ui-refresh-icon').click();
                } catch(e) {
                    console.log('caught error:')
                    console.log(e);
                } finally {closeRenameOverlay();}
            });
            document.getElementById('batchRenameCancelBtn').addEventListener('click', closeRenameOverlay);
            function openRenameDialog() {
                // Initialize display
                document.getElementById('renameDialog').style.display = 'flex';
                document.getElementById('reasonList').selectedIndex = -1;
                var postUrl = "https://yms-na.amazon.com/YMSServiceInternal/";
                var postHeaders = {"content-encoding": "amz-1.0",
                                  "Content-Type": "application/json",
                                  "X-Amz-Target": "com.amazon.yms.coral.privateapi.YMSServiceInternal.listYardAssetsInYard"}
                var postBody = {method: "com.amazon.yms.coral.privateapi.YMSServiceInternal.listYardAssetsInYard",
                                context: {securityToken: ymsSecurityToken}}
                jQuery.ajax({
                    method: "POST",
                    cache: false,
                    url: postUrl,
                    headers: postHeaders,
                    processData: true,
                    data: JSON.stringify(postBody),
                    dataType: "json"
                })
                .done(function(response) {
                    assetsBySCAC = {};
                    var scacs = [];
                    // Group assets by SCAC, must have a blank visit reason
                    Array.prototype.forEach.call(response.yardAssets, function(asset) {
                        if (asset.visitReason == null) {
                            if (assetsBySCAC[asset.owner.code]) {
                                assetsBySCAC[asset.owner.code].push(asset);
                            } else {
                                assetsBySCAC[asset.owner.code] = [asset];
                            }
                        }
                    });
                    // Add SCACs to listbox, clearing out any existing data
                    scacs = Object.keys(assetsBySCAC).sort();
                    var list = document.getElementById('scacList');
                    if (list.hasChildNodes()) {
                        requestAnimationFrame(function() {
                            for(var i = list.options.length-1; i >= 0; i--) {
                                list.remove(i);
                            }
                        });
                    }
                    requestAnimationFrame(function() {
                        Array.prototype.forEach.call(scacs, function(scac) {
                            var option = document.createElement('option')
                            option.text = scac;
                            list.add(option);
                        });
                    });
                })
                .fail(function(jqXHRObj, errorMsg) {console.log('listYardAssetsInYard fail.'); console.log(errorMsg);});
            }
            function closeRenameOverlay() {document.getElementById('renameDialog').style.display = 'none';};
            function buildUpdateModel(asset, visitString) {
                var sealNum = [];
                if (asset.sealNumbers.length > 0) {sealNum = [asset.sealNumbers[0]]}
                var model = {
                    assetType: asset.type,
                    isSealable: asset.isSealable,
                    expectedNumberOfSeals: asset.expectedNumberOfSeals,
                    owner: {
                        code: asset.owner.code,
                        name: asset.owner.name
                    },
                    vehicleNumber: asset.vehicleNumber,
                    visitReason: visitString,
                    rangeOfSeals: [0],
                    sealNumbers: sealNum,
                    status: asset.status,
                    broker: {
                        originalObject: {
                            code: asset.broker.code,
                            name: asset.broker.name
                        }
                    },
                    ownerCode: asset.owner.code,
                    brokerCode: asset.brokerCode,
                    id: asset.id,
                    removeLoad: false,
                    annotationsToBeAdded: {}
                };
                return model;
            }
            */
//=============================================
// Notification on TDR release
//=============================================

            var tdrNotifySound = new Audio("https://drive.corp.amazon.com/view/bjerkt@/Tools%20-%20Mine/Userscripts/res/tdr-notify.mp3");
            let postUrlRegional = window.location.href.indexOf('trans-logistics-eu') > 0 ? "https://yms-eu.amazon.com/YMSServiceInternal/" : "https://yms-na.amazon.com/YMSServiceInternal/"
            var tdrPoll = setInterval(checkTDR, 10000); // Poll for new TDR release events every 10 seconds
            function checkTDR() {
                const dateFull = new Date();
                const dtEnd = Math.floor(dateFull.getTime()/1000) // Round to seconds
                const dtStart = dtEnd - 9; // Look back 9 seconds (was getting duplicate events with a 10/10 setup)
                const postHeaders = {"api": "getEventReport",
                                  "Content-Type": "application/json;charset=UTF-8",
                                   "method": "POST",
                                  "token": ymsSecurityToken}
                const postBody = {annotation: "",
                                eventType: "TDR_RELEASE",
                                firstRow: 0,
                                fromDate: dtStart,
                                loadIdentifier: "",
                                loadIdentifierType: "VRID",
                                location: "",
                                requester: {system: "YMSWebApp"},
                                rowCount: 20,
                                seal: "",
                                toDate: dtEnd,
                                userId: "",
                                vehicleNumber: "",
                                vehicleOwner: "",
                                vehicleType: "",
                                visitReason: "OUTBOUND",
                                yard: yard
                               }
                jQuery.ajax({
                    method: "POST",
                    cache: false,
                    url: yardConsoleServiceEndpoint + 'call/getEventReport',
                    headers: postHeaders,
                    processData: true,
                    data: JSON.stringify(postBody),
                    dataType: "json"
                })
                .done(function(response) {
                    if (response.events.length > 0) {
                        // Notify user of TDR event(s)
                        const promise = tdrNotifySound.play()
                        if (promise !== undefined) {
                            promise.catch(function(e) {
                                console.log('Error playing notification sound:\n' + e.message);
                            });
                        }
                        // Build notification
                        if (Notification.permission !== "granted") {
                            Notification.requestPermission();
                        } else {
                            var bodyStr = "";
                            Array.prototype.forEach.call(response.events, function(event, i) {
                                bodyStr += event.location;
                                // If we have other doors to add...
                                if (i < response.events.length-1) {
                                    bodyStr += '\n';
                                }
                            });
                            var notifyIcon = 'https://d36nckxftc4f80.cloudfront.net/YMSWebsiteAngularApp-3_0_201127_0/assets/images/dock.png';
                            var notification = new Notification('TDR Release', {body: bodyStr, icon: notifyIcon, tag: 'tdrNotify'});
                            notification.onclick = function() {
                                patrent.focus();
                                window.focus(); // For older browsers
                                this.close();
                            }
                            // Timeout 5 sec
                            setTimeout(function() {notification.close()}, 5000);
                        }
                    }
                })
                .fail(function(jqXHRObj, errorMsg) {console.log('getTDRStatus fail.'); console.log(errorMsg);});
            }
        }
    };
})();