// ==UserScript==
// @name         Youtube Annotation Destroyer
// @namespace    http://userscripts.org/users/zackton
// @description  If you want those damn annotations to go away at the start of every video, this is the right script for you!
// @grant        GM_log
// @include	 http://www.youtube.com/watch*
// @include	 https://www.youtube.com/watch*
// @include	 http://www.youtube.com/user/*
// @include	 https://www.youtube.com/user/*
// @version      1.4
// @downloadURL https://update.greasyfork.org/scripts/7926/Youtube%20Annotation%20Destroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/7926/Youtube%20Annotation%20Destroyer.meta.js
// ==/UserScript==

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

document.getElementsByClassName('ytp-player-content ytp-iv-player-content').remove();
document.getElementsByClassName('video-annotations iv-module')[0].style.display = "none";