// ==UserScript==
// @name           Dress to Impress (DTI) - Item Tracking Improvements
// @version        2.0
// @description    Adds visuals so you can more easily tell if an item is on one of your lists or not 
// @match          *://impress.openneo.net/*
// @author         0o0slytherinpride0o0
// @namespace      https://github.com/0o0slytherinpride0o0/
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/549314/Dress%20to%20Impress%20%28DTI%29%20-%20Item%20Tracking%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/549314/Dress%20to%20Impress%20%28DTI%29%20-%20Item%20Tracking%20Improvements.meta.js
// ==/UserScript==

(function() {
  
  'use strict';
  
  const once = {
    once: true,
  };
  
  var scriptCSS = `
.closet-hangers-ownership-groups div:first-child input[type="number"][name^="quantity"]:not([value="0"],[value=""]) {
	background-color: #cfffcf;
}
.closet-hangers-ownership-groups div:last-child input[type="number"][name^="quantity"]:not([value="0"],[value=""]) {
	background-color: #ece0ff;
}
.closet-hangers-ownership-groups div:has(input:not([value="0"])) h4:after {
    content: " \u2705";
}
.closet-hangers-ownership-groups div:not(:has(input:not([value="0"]))) h4:after {
    content: " \u274C";
}
form[hidden] + .item-description {
	margin-top: 2em;
}
header.item-header .item-header-main:before {
	content: "";
}
header.item-header .item-header-main:after {
	font-weight: bold;
  color: navy !important;
  font-size: 16pt;
  height: 5px;
  margin-top: -5px;
  z-index: -999;
}
header.item-header:has(.user-lists-form[hidden]):has(.closet-hangers-ownership-groups div:first-child input:not([value="0"])):has(.closet-hangers-ownership-groups div:nth-child(2) input:not([value="0"])) 
                  		.item-header-main:after {
	content: "Have: \u2705 \u00A0 Want: \u2705";
}
header.item-header:has(.user-lists-form[hidden]):has(.closet-hangers-ownership-groups div:first-child input:not([value="0"])):not(:has(.closet-hangers-ownership-groups div:nth-child(2) input:not([value="0"]))) 
                  		.item-header-main:after {
	content: "Have: \u2705 \u00A0 Want: \u274C";
}
header.item-header:has(.user-lists-form[hidden]):not(:has(.closet-hangers-ownership-groups div:first-child input:not([value="0"]))):has(.closet-hangers-ownership-groups div:nth-child(2) input:not([value="0"])) 
                  		.item-header-main:after {
	content: "Have: \u274C \u00A0 Want: \u2705";
}
header.item-header:has(.user-lists-form[hidden]):not(:has(.closet-hangers-ownership-groups div:first-child input:not([value="0"]))):not(:has(.closet-hangers-ownership-groups div:nth-child(2) input:not([value="0"]))) 
                  		.item-header-main:after {
	content: "Have: \u274C \u00A0 Want: \u274C";
}

`
  const scriptStyle = document.createElement("style");
  scriptStyle.innerHTML = scriptCSS;
  document.head.appendChild(scriptStyle);
  
  // this just updates the "value" attribute of the input to whatever is currently in the box
  // that way, if you change it, the added CSS rules will take effect dynamically
  document.addEventListener("change", function(event) {
    if (event.target.tagName == "INPUT" && document.URL.includes("impress.openneo.net/items/")) {
      var parent = event.target.parentElement.parentElement.parentElement.parentElement;
      if (parent && parent.classList.contains("closet-hangers-ownership-groups")) {
        event.target.setAttribute("value", event.target.value);  
      }
    }
  });
  
  // this just fixes it if you reload the page
  // DTI (or your browser?) remembers changes if you reload (but they aren't saved yet), 
  // so this reapplies the CSS rules when this happens
  // it does *not* change your data, just the appearance based on what's currently in the inputs
  function init() {
    var inputArr = Array.from(document.querySelectorAll('.closet-hangers-ownership-groups input[type="number"][name^="quantity"]'));
    inputArr.filter(input => input.value != input.getAttribute("value")).forEach(input => {
      input.setAttribute("value", input.value);
    });
  }
  
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init, once);
  }
})();
