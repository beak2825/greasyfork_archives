// ==UserScript==
// @name        OCMP Extract Multiple Dividends
// @description Expand the work area and site boxes
// @version       0.1
// @include      https://mi-div.crowdcomputingsystems.com/mturk-web*
// @author        Cristo
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/5605/OCMP%20Extract%20Multiple%20Dividends.user.js
// @updateURL https://update.greasyfork.org/scripts/5605/OCMP%20Extract%20Multiple%20Dividends.meta.js
// ==/UserScript==

document.getElementsByClassName('center-box')[2].style.maxWidth='none';
var aBoxes = document.getElementsByClassName('nohighlight hasmenu extraction-content');
for (var f = 0; f < aBoxes.length; f++){
    aBoxes[f].style.maxWidth='none';
      aBoxes[f].style.width='auto';
}
