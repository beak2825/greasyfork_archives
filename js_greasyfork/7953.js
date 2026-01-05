// ==UserScript==
// @name         My Fancy New Userscript
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7953/My%20Fancy%20New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/7953/My%20Fancy%20New%20Userscript.meta.js
// ==/UserScript==


javascript:for( i = 1;i< document.getElementsByName("actions[accept]").length;i++){document.getElementsByName("actions[accept]")[i].click();}void(0);

