// ==UserScript==
// @name         GC Shop Wizard Default Identical Search
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.1
// @description  Sets the Shop Wizard to always search for items identical to your phrase on GC.
// @author       sanjix
// @match        https://www.grundos.cafe/market/wizard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561192/GC%20Shop%20Wizard%20Default%20Identical%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/561192/GC%20Shop%20Wizard%20Default%20Identical%20Search.meta.js
// ==/UserScript==

var searchSetting = document.querySelectorAll('.sw_search_right label input[name="search_method"]');
searchSetting[1].checked = true;