// ==UserScript==
// @name 		PI Search 
// @version    0.1
// @namespace    Space
// @description  (Hide instructions and mark first bubbles)
// @author     Lowlife
// @include    https://s3.amazonaws.com/*
// @include    https://www.mturkcontent.com/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/7605/PI%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/7605/PI%20Search.meta.js
// ==/UserScript==


var page = document.getElementById("mturk_form");
var div = page.getElementsByClassName("panel-body")[0];
div.style.display = "none";


document.getElementById('Q1_5').checked = true;
document.getElementById('Q2_5').checked = true;
document.getElementById('Q3_5').checked = true;
document.getElementById('Q4_5').checked = true;
document.getElementById('Q5_5').checked = true;
document.getElementById('Q6_5').checked = true;