// ==UserScript==
// @name         rekonise.com bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  bypasses annoying time taking rekonise links.
// @author       ronjam
// @match        *://rekonise.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556820/rekonisecom%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/556820/rekonisecom%20bypass.meta.js
// ==/UserScript==

var link = window.location.href.replace("https://rekonise.com/", "");

let xhr= new XMLHttpRequest();

xhr.responseType = "";
xhr.onreadystatechange = () => {
  if (xhr.status == 200 && xhr.readyState == 4) {
    var response_json = JSON.parse(xhr.responseText);
    let destination = response_json.url;

    window.location.href = destination;
  }
};

let url = `https://api.rekonise.com/social-unlocks/${link}/unlock`;

xhr.open('GET',url);

xhr.send();