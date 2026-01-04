// ==UserScript==
// @name         IEEE Scihub Link Adder
// @namespace    http://github.com/RibomBalt
// @version      2025-11-05
// @description  Add Scihub Link to IEEE Explore Paper Page
// @author       RibomBalt
// @match        https://ieeexplore.ieee.org/abstract/document/*
// @match        https://ieeexplore.ieee.org/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ieee.org
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554832/IEEE%20Scihub%20Link%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/554832/IEEE%20Scihub%20Link%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const DOI_CONTAINER = document.querySelector("div.stats-document-abstract-doi");
    const DOI = document.querySelector("div.stats-document-abstract-doi > a").innerText;
    const new_link = document.createElement("a");
    new_link.href = `https://www.sci-hub.st/${DOI}`;
    new_link.innerText = " [Sci-Hub Link]";
    new_link.target = "_blank";
    new_link.style.color = "#FF0000";
    new_link.style.fontWeight = "bold";
    DOI_CONTAINER.appendChild(new_link);
})();