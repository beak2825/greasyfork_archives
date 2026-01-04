// ==UserScript==
// @name         Save SHEIN Category XHR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows save and download SHEIN's listings
// @author       yhuang2
// @match         *://*.SHEIN.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shein.com
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.2/FileSaver.min.js
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/555507/Save%20SHEIN%20Category%20XHR.user.js
// @updateURL https://update.greasyfork.org/scripts/555507/Save%20SHEIN%20Category%20XHR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetUrl = "real_category_goods_list";

    let savedData = GM_getValue('savedData', {});
    if (!window.location.pathname.includes('login')) {
        let fileName = window.location.pathname.split('/').pop().replace('.html', '');
        GM_setValue('fileName', fileName);
    }
    let fileCounter = GM_getValue('fileCounter', 0); // File counter
    let saveThreshold = 600; // Save threshold
    let itemCounter = Object.keys(savedData).length;
    let itemCounterTotal = GM_getValue('itemCounterTotal', 0); // Total item counter
    let countryCode = "";
    let currencyCode = "";
    let lowerPriceRange = "";
    let upperPriceRange = "";


    (function(send) {

        XMLHttpRequest.prototype.send = function(body) {
            // Check if this._url is set
            if (this._url && this._url.includes(targetUrl)) {
                console.log(body)
            };

            // call original send method
            send.call(this, body);
        };

    })(XMLHttpRequest.prototype.send);


    (function(open) {

        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {


            if (url.includes(targetUrl)) {
                this._url = url;
                this.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {  // When the request is completed
                        try {
                            updateButtonStatus(false);
                            // Parse the response text
                            let data = JSON.parse(this.responseText);
                            let goodsList = data["info"]["products"];
                            let addedTime = Date.now();

                            // Loop through each element in the goods list
                            for (let i = 0; i < goodsList.length; i++) {
                                let itemId = goodsList[i]["spu"];

                                // Add server time to the goods item
                                goodsList[i]["addedTime"] = addedTime;
                                // goodsList[i]['countryCode'] = countryCode;

                                // Save each element in savedData
                                savedData[itemId] = goodsList[i];
                            }

                            // Update the file name
                            if (!window.location.pathname.includes('login')) {
                                let fileName = window.location.pathname.replace(/\//g, '').replace(".html", '');
                                fileName = fileName;
                                GM_setValue('fileName', fileName);
                            }

                            // Update the counter
                            itemCounter = Object.keys(savedData).length;
                            itemCounterTotal += goodsList.length; // Update total item counter

                            // Save and reset savedData if the number of keys is over the threshold
                            if (itemCounter >= saveThreshold) {
                                let blob = new Blob([JSON.stringify(savedData, null, 2)], {type : 'application/json'});
                                fileCounter++;
                                let fileName = GM_getValue('fileName', "");
                                saveAs(blob, `${fileName}_${String(fileCounter).padStart(4, '0')}_${new Date().toISOString().slice(0,10)}.json`);
                                savedData = {};
                                itemCounter = 0;
                                GM_setValue('savedData', savedData);
                                GM_setValue('fileCounter', fileCounter);
                            }


                            // Persist the saved data
                            GM_setValue('savedData', savedData);

                        } catch (e) {
                            console.error('Failed to save XHR response:', e);
                        }
                    }
                }, false);
            }

            // Update the counter display
            updateCounterCountryDisplay();

            open.call(this, method, url, async, user, pass);
        };

    })(XMLHttpRequest.prototype.open);

    function updateCounterCountryDisplay() {
        counterDisplay.textContent = "Count: " + itemCounterTotal + ". ";

    }

    function updateButtonStatus(isBottom, isGenerating = false) {
        if (isGenerating) {
            buttonJson.textContent = "Generating Downloadable File...";
            buttonJson.disabled = true;
        } else if (isBottom) {
            buttonJson.style.color = "red";
            buttonJson.style.fontWeight = "bold";
        } else {
            buttonJson.style.color = "black";
            buttonJson.style.fontWeight = "normal";
        }
    }

    // Create a container for our elements
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '600px';
    container.style.right = '0';
    container.style.zIndex = '1000';
    container.style.backgroundColor = 'white';
    container.style.padding = '10px';
    container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(container);

    // Create the counter display
    let platformDisplay = document.createElement('p');
    platformDisplay.textContent = "Getting SHEIN items";
    platformDisplay.style.fontSize = "30px";
    container.appendChild(platformDisplay);

    // Create the counter display
    let counterDisplay = document.createElement('p');
    counterDisplay.textContent = "Count: " + itemCounter;
    counterDisplay.style.fontSize = "20px";
    container.appendChild(counterDisplay);


    // Create the Export as JSON and Refresh button
    let buttonJson = document.createElement('button');
    buttonJson.textContent = "Export as JSON and Refresh";
    buttonJson.style.fontSize = "20px"
    buttonJson.onclick = function() {
        updateButtonStatus(false, true);
        setTimeout(function() {
            let blob = new Blob([JSON.stringify(savedData, null, 2)], {type : 'application/json'});
            let fileName = GM_getValue('fileName', "");
            fileCounter++;
            saveAs(blob, `${fileName}_${String(fileCounter).padStart(4, '0')}_${new Date().toISOString().slice(0,10)}.json`);
            savedData = {};
            itemCounter = 0;
            fileCounter = 0; // Reset file counter
            GM_setValue('savedData', savedData);
            GM_setValue('fileCounter', fileCounter);
            updateCounterCountryDisplay();
            updateButtonStatus(false, false);
            location.reload();
        }, 3000);
    };
    buttonJson.style.height = "100px";
    buttonJson.style.width = "300px";
    container.appendChild(buttonJson);


})();
