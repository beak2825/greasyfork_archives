// ==UserScript==
// @name         toonkor for left hander
// @author       Minjae Kim
// @version      3.22
// @description  Moves an element before another element on the page
// @include      /^https?:\/\/(?:www\.)?tkor\d{3}\.com\/.*/
// @grant        none
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjf9ah_nrpbeAvtWWj4SspQhTCY_-bikwFswNoO-ovMA&s=10
// @license      MIT
// @run-at      document-idle
// @namespace clearjade
// @downloadURL https://update.greasyfork.org/scripts/553260/toonkor%20for%20left%20hander.user.js
// @updateURL https://update.greasyfork.org/scripts/553260/toonkor%20for%20left%20hander.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Here you can assume the hostname matched tkor\d{3}.com
  const numberPart = location.hostname.match(/\d+/)[0];

const element = document.querySelector("div.toon-info");
Object.assign(element.style, {
    position: "relative",
    top: "0px",
    left:"37%",
    width: "62%",
});
const elementb = document.querySelector("div.toon-nav");
Object.assign(elementb.style, {
    position: "absolute",
    top: "0.3em",
    left: "0.5em",
    width:"35%",
//style="position: absolute;top: 5px;left: 10px;width: 13em;"
});

})();
