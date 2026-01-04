// ==UserScript==
// @name         Veck.io Banner Remover
// @match        *://veck.io/*
// @description  Removes internal legion games banner
// @author       myrrr
// @run-at       document-start
// @version 0.0.1.20251109171751
// @namespace https://greasyfork.org/users/1330310
// @downloadURL https://update.greasyfork.org/scripts/555327/Veckio%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/555327/Veckio%20Banner%20Remover.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function removeBanners() {
    const banners = document.querySelectorAll('.banner-container');
    banners.forEach(el => el.remove());
  }
  removeBanners();
  setInterval(removeBanners, 5000);
})();
