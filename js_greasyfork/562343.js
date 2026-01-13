// ==UserScript==
// @name         Npm input focus
// @namespace    GYING AD BLOCK
// @version      2024-12-07 -8
// @description  NO AD IN GYING
// @author       You
// @license      AGPL-3.0
// @match        https://www.npmjs.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562343/Npm%20input%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/562343/Npm%20input%20focus.meta.js
// ==/UserScript==
 
(function () {
  "use strict";
  setTimeout(() => {

              const pathName = window.location.href
if(pathName == 'https://www.npmjs.com/') {
  const input = document.querySelector('input')
if (input){
  input.focus()
}
}
  }, 0);
})();