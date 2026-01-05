// ==UserScript==
// @name        KoL NS Tower Scroller
// @namespace   https://greasyfork.org
// @include     http://127.0.0.1:*/place.php?whichplace=nstower
// @include     http://localhost:*/place.php?whichplace=nstower
// @include     http://www.kingdomofloathing.com/place.php?whichplace=nstower
// @version     1
// @grant       none
// @description Scrolls the huuuuuge new tower to the location of interest
// @downloadURL https://update.greasyfork.org/scripts/7544/KoL%20NS%20Tower%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/7544/KoL%20NS%20Tower%20Scroller.meta.js
// ==/UserScript==

// Modified from solution here:
// http://stackoverflow.com/questions/4801655/how-to-go-to-a-specific-element-on-page
(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: ($(this).offset().top - $(window).height()/2 + $(this).height()/2) + 'px'
        }, 0);
        return this; // for chaining...
    }
})(jQuery);

function scrollIfExists(titletext)
{
  if($("img[title='" + titletext + "']").length)
  {
    $("img[title='" + titletext + "']").goTo();
  }
}

scrollIfExists('Contest Registration Desk');
scrollIfExists('Coronation Courtyard');
scrollIfExists('The Hedge Maze');
scrollIfExists('A Perplexing Door');
scrollIfExists('Tower Level 1 (1)');
scrollIfExists('Tower Level 2 (1)');
scrollIfExists('Tower Level 3 (1)');
scrollIfExists('Tower Level 4 (1)');
scrollIfExists('Tower Level 5 (1)');
//The rest is going to be at the top already
