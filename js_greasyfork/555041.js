// ==UserScript==
// @name         Luckybird (Autoclaim)
// @description  Claims bonus on https://luckybird.io/?c=tab every 24 houres 
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      1.0
// @match        https://luckybird.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555041/Luckybird%20%28Autoclaim%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555041/Luckybird%20%28Autoclaim%29.meta.js
// ==/UserScript==

(async () => {const clickElementByText = (text) => {const xpath = `//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${text.toLowerCase()}')]`;const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);if (result.snapshotLength > 0) {const element = result.snapshotItem(0);element.click();console.log(`Clicked on element with text: ${element.textContent}`);return true;} else {console.log(`No element with text "${text}" found.`);return false;}};try {(function(){const t="buy";const e=`//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${t.toLowerCase()}')]`;const o=document.evaluate(e,document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);if(o.snapshotLength>0){const t=o.snapshotItem(0);t.click();console.log(`Clicked on the element with text: ${t.textContent}`)}else{console.log(`No element with text "${t}" found.`)}})();console.log("Initial function executed.");} catch (error) {console.error("Error executing initial function:", error);}console.log("Waiting for 3 seconds...");await new Promise(resolve => setTimeout(resolve, 3000));console.log("3 seconds passed. Continuing with clicks.");clickElementByText("daily bonus");clickElementByText("claim daily bonus");})();