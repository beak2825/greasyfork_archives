// ==UserScript==
// @name 500px.com Download Photo
// @namespace 06msNqk7e1ub45dZ
// @description Add button to download photo.
// @version 1.3
// @author Reek | reeksite.com
// @license Creative Commons BY-NC-SA
// @include http*://500px.com/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/8416/500pxcom%20Download%20Photo.user.js
// @updateURL https://update.greasyfork.org/scripts/8416/500pxcom%20Download%20Photo.meta.js
// ==/UserScript==

(function () {

  var addBtnDownload = function (src) {
    var el = document.querySelector('.main_container .sidebar_region .photo_sidebar .actions_region');
    el.insertAdjacentHTML('afterEnd', '<a href="' + src + '" target="_blank" download class="button medium submit">Download</a>');
  };

  var eventHandler = function (event) {
    // doc: http://help.dottoro.com/ljdchxcl.php
    // tm: https://github.com/derjanb/tampermonkey/issues/18
    if (event.target.tagName == 'IMG' && event.target.className == 'photo') {
      if ('attrChange' in event) { // Firefox, Opera, Internet Explorer from version 9
        if (event.attrChange && event.attrName == 'src' && event.newValue != event.oldValue) {
          if (event.newValue.indexOf('h%3D300') == -1) { // exclude thumbnail
            addBtnDownload(event.newValue);
            //console.log(event.target, event.attrChange, event.attrName, event.newValue);
          }
        }
      }
    }
  };

  window.addEventListener('DOMAttrModified', eventHandler, false);

})();