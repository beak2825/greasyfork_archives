// ==UserScript==
// @name         ETI Inline Pic Viewer
// @namespace    http://your.homepage/
// @version      0.1
// @description  expands inline images 4chan style
// @author       eyebrow
// @match        htt*://*.endoftheinter.net/*
// @include      htt*://*.endoftheinter.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8589/ETI%20Inline%20Pic%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/8589/ETI%20Inline%20Pic%20Viewer.meta.js
// ==/UserScript==

var imgDiv = document.createElement("img");
imgDiv.style.maxWidth = "50%";
imgDiv.style.height = "auto";
imgDiv.style.maxHeight = "100%";
imgDiv.style.position = "fixed";
imgDiv.style.top = "0";
imgDiv.style.right = "0";
imgDiv.style.display = "none";
document.querySelector("body").appendChild(imgDiv);

var ess = document.querySelectorAll("a.img");
var es;

var mousein = function(link) {
   return function() {
      imgDiv.style.display = "initial";
      imgDiv.src = link.attributes.imgsrc.value;
   };
};

var mouseout = function() {
   return function() {
      imgDiv.style.display = "none";
   };
};

for (var i = 0; i < ess.length; i++) {
   es = ess[i];
   es.style.backgroundColor = "#FFFFFF";
   es.onmouseover = mousein(es, imgDiv);
   es.onmouseleave = mouseout();
}