// ==UserScript==
// @name         Blog Silici
// @version      0.1
// @author       Anthony McDonald
// @description  It doesn't show characters' blogs.
// @match        http://*.popmundo.com/World/Popmundo.aspx/Character/*
// @grant        none
// @namespace https://greasyfork.org/users/6949
// @downloadURL https://update.greasyfork.org/scripts/6516/Blog%20Silici.user.js
// @updateURL https://update.greasyfork.org/scripts/6516/Blog%20Silici.meta.js
// ==/UserScript==

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
document.getElementById("ctl00_cphLeftColumn_ctl00_divBlog").remove();