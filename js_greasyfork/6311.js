// ==UserScript==
// @name         Swappa Out of Stock Device Remover
// @namespace    http://swappa.com/
// @version      0.2
// @description  removes out of stock devices from Swappa
// @author       S Mattison (Ayelis)
// @match        https://swappa.com/*
// @match        http://swappa.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6311/Swappa%20Out%20of%20Stock%20Device%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/6311/Swappa%20Out%20of%20Stock%20Device%20Remover.meta.js
// ==/UserScript==

$('.price .fa-circle-o').parents('.col-xs-4,.col-xs-6,.col-xs-12').remove();