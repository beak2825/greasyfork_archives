// ==UserScript==
// @name       OGame - UserPositions
// @author	   Gh61
// @version    1.1
// @description  Shows user position in galaxy at highscore page.
// @include      http://*.ogame.*/game/index.php?*page=highscore*
// @copyright  2014, Gh61
// @namespace https://greasyfork.org/users/5945
// @downloadURL https://update.greasyfork.org/scripts/5622/OGame%20-%20UserPositions.user.js
// @updateURL https://update.greasyfork.org/scripts/5622/OGame%20-%20UserPositions.meta.js
// ==/UserScript==

// add jQuery
var $j;// no conflict
(function(){
    $j = unsafeWindow.jQuery;
    
    $j.urlParam = function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
        if (!results) { 
            return "";
        }
        return results[1] || "";
    }
    
    UP_LetsJQuery($j);
})();

function UP_LetsJQuery($) {
    //console.log($); // check if the dollar (jquery) function works
    //console.log($().jquery); // check jQuery version
    
    $(document).ajaxComplete(function () {
        UP_UpdatePositions($);
    });
     UP_UpdatePositions($);
}

function UP_UpdatePositions($){
    $(".userHighscore td.name a:not([target=_ally])").each(function(index, element){
        var $this = $(this);
        var url = $this.attr("href");
        
        var galaxy = $.urlParam("galaxy", url);
        var system = $.urlParam("system", url);
        var position = $.urlParam("position", url);
        
        $this.find('.planet-location').remove();
        $this.append($('<span class="planet-location">').html("[" + galaxy + ":" + system + ":" + position + "]"))
    });
}