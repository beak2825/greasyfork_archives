// ==UserScript==
// @name         Southpaw018's Kongscripts
// @namespace    moofit.com
// @include      http://www.kongregate.com/*
// @description  Minor modifications to Kongregate's interface
// @version       1
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8367/Southpaw018%27s%20Kongscripts.user.js
// @updateURL https://update.greasyfork.org/scripts/8367/Southpaw018%27s%20Kongscripts.meta.js
// ==/UserScript==

var isGamePage = false;
var winTopPos;

if (window.location.href.match(/games/) !== null) {
    isGamePage = true;
}

if (isGamePage) {
    $j('document').ready(function() {
        var $gameTitle = $j('h1[itemprop=name]');
        winTopPos = $gameTitle.offset().top - 5;
        
        setTimeout(function() {
            window.scrollTo(0, winTopPos);
        }, 1000);

        ChatDialogue.prototype.oldDisplayUnsanitizedMessage = ChatDialogue.prototype.displayUnsanitizedMessage;
        ChatDialogue.prototype.displayUnsanitizedMessage = function(user, msg, attributes, options) {
            if (!attributes) attributes = {};
            if (msg.lastIndexOf('௵') > -1) msg = msg.substring(0,1) + "...";
		    this.oldDisplayUnsanitizedMessage(user, msg, attributes, options);
 		}
    });
    
    $j('body').append('<input class="southpaw018Scroll top" type="button" value="Scroll to 0, ' + winTopPos + '" />');
    $j('.game_details_outer').append('<input class="southpaw018Scroll bot" type="button" value="Scroll to 0, ' + winTopPos + '" />');
    $j('.southpaw018Scroll').click(function() {
        window.scrollTo(0, winTopPos);
    });
}

GM_addStyle(
	".southpaw018Scroll {\
	width: 100px;\
	height: 40px;\
	position: absolute;\
	right: 0;\
}");
GM_addStyle(
	".southpaw018Scroll.top {\
	top: 0;\
}");
GM_addStyle(
	".southpaw018Scroll.bot {\
	top: 60px;\
}");

GM_addStyle(
	".incomplete .check_ico {\
	background-position: 0 0;\
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gQGECoJPpr5HwAAAG5JREFUKM/lzjEKwzAUg+HnTB5jeLpDh7RQenxfxBlKIBklcEaPPYLjrZB/1gcKaynfbTtrtV5zSp/3EnLOKc3u3gWSaj0nklfWZubuJCcb7B9BjHEMtNbud2kYAJB0ZSoJQFhL2Y+DZBcAeD0fPxCqK7cLr3v3AAAAAElFTkSuQmCC);\
}");