// ==UserScript==
// @namespace		https://greasyfork.org/users/8637
// @name        	The West - Connection booster
// @author      	neversleep1911
// @description		A utility for boost connection
// @include     	http://*.the-west.*/game.php*
// @include     	https://*.the-west.*/game.php*
// @grant       	none
// @version     	1.0
// @copyright		Copyright (c) 2015 neversleep1911
// @license			MIT (http://opensource.org/licenses/MIT)
// @downloadURL https://update.greasyfork.org/scripts/9007/The%20West%20-%20Connection%20booster.user.js
// @updateURL https://update.greasyfork.org/scripts/9007/The%20West%20-%20Connection%20booster.meta.js
// ==/UserScript==

(function(func) {
    var script;
    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.textContent = "(" + func.toString() + ")();";
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function() {
    var Booster;
    Booster = function() {
        function Booster() {
            this.timer = setInterval(Chat.Request.Nop, this.INTERVAL);
        }
        Booster.ID = "tw_booster";
        Booster.NAME = "Booster";
        Booster.AUTHOR = "neversleep1911";
        Booster.WEB_SITE = "https://greasyfork.org/scripts/9007";
        Booster.MIN_GAME_VERSION = "2.21";
        Booster.MAX_GAME_VERSION = Game.version.toString();
        Booster.prototype.INTERVAL = 2e4;
        return Booster;
    }();
    $(document).ready(function() {
        var api;
        api = TheWestApi.register(Booster.ID, Booster.NAME, Booster.MIN_GAME_VERSION, Booster.MAX_GAME_VERSION, Booster.AUTHOR, Booster.WEB_SITE);
        api.setGui("Copyrights, changelog and other details see <a href='" + Booster.WEB_SITE + "' target='_blank'>here</a>.");
        new Booster;
        return true;
    });
});