// ==UserScript==
// @name        Sltrooms Enable Uploads
// @namespace   Violentmonkey Scripts
// @match       *://sltrooms.cc/r/*
// @grant       none
// @version     1.0
// @author      SenorCompost
// @description 8/2/2025, 1:53:46 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552468/Sltrooms%20Enable%20Uploads.user.js
// @updateURL https://update.greasyfork.org/scripts/552468/Sltrooms%20Enable%20Uploads.meta.js
// ==/UserScript==


waitForElement("button[class='btn btn-success btn-icon upload_new_files_to_room']").then((element) => {
 enableUploads();
});


function enableUploads(){
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      var myobserver = new MutationObserver(mutations => {
        var element = document.querySelector("button[class='btn btn-success btn-icon upload_new_files_to_room']");
        if(element && element.style.display == 'none'){
          element.removeAttribute('style');
        }
      });

    myobserver.observe(document, {
        childList: true,
        subtree: true,
        attributes: true
  });
}

function waitForElement(selector) {
    return new Promise((resolve) => {
        var observer = new MutationObserver((mutations, observer) => {
            var element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true
        });
    });
}