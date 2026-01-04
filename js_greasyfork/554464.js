// ==UserScript==
// @name         AMK-Online
// @version      1.0
// @description  Индикация онлайна, на мобильной версии!
// @author       Chypakabra
// @match        
// @icon         
// @license      MIT
// @namespace https://greasyfork.org/users/751324
// @downloadURL https://update.greasyfork.org/scripts/554464/AMK-Online.user.js
// @updateURL https://update.greasyfork.org/scripts/554464/AMK-Online.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const amkteam = getComputedStyle(document.documentElement);
    const version = amkteam.getPropertyValue('--amkteam-version').trim();
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    if (version == '"4.7.12"') {
        if (mediaQuery.matches) {
            let elems = document.getElementsByClassName('cPost ipsBox ipsResponsive_pull  ipsComment  ipsComment_parent ipsClearfix ipsClear ipsColumns ipsColumns_noSpacing ipsColumns_collapsePhone');
            for( let i = 0; i < elems.length; i++) {
                let fu = elems[i].getElementsByClassName('fa fa-circle ipsOnlineStatus_online');
                let UserPhoto = elems[i].getElementsByClassName('ipsUserPhoto ipsUserPhoto_large');
                for( let i = 0; i < fu.length; i++) {
                    UserPhoto[i].setAttribute('style', 'border: 2px solid rgb(0, 0, 0)!important; box-shadow: 0 0 0 3px rgba(0, 175, 0, 0.75);');
                }
            }
        }
    }
})();