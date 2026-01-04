// ==UserScript==
// @name           Neopets - Inventory Link
// @version        1.1
// @description    Adds an inventory link to pages with the new layout
// @match          *://*.neopets.com/*
// @author         0o0slytherinpride0o0
// @namespace      https://github.com/0o0slytherinpride0o0/
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/554900/Neopets%20-%20Inventory%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/554900/Neopets%20-%20Inventory%20Link.meta.js
// ==/UserScript==

(function() {
  
  'use strict';
  
  const once = {
    once: true,
  };
  
  function init() {
    var navRight = document.querySelector(".navsub-right__2020");
    if (navRight) {
      var invLink = navRight.children[0].cloneNode(true);
      invLink.href = invLink.getAttribute("href").replace("bank","inventory");
      invLink.children[0].style = "min-width: 20px !important;";
      invLink.children[0].children[1].removeAttribute("id");
      invLink.children[0].children[1].innerText = "Inv";
      invLink.children[0].children[0].style = 
        "background: url(https://images.neopets.com/themes/h5/common/inventory/images/inventory-chest.png) center center no-repeat !important;" +
        "background-size: contain  !important;";
      
      navRight.insertBefore(invLink, navRight.children[0]);
      invLink.insertAdjacentText("afterend","\n");
    }
  }
  
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init, once);
  }
  
})();
