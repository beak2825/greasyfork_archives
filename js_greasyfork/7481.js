// ==UserScript==
// @name         WK Auto Wrap-Up
// @namespace    http://your.homepage/
// @version      0.1
// @description  deletes the review queue forcing WK to do reviews in batches of 10 and make get requests every 10 reviews
// @author       Ethan at the request of MatthewR
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7481/WK%20Auto%20Wrap-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/7481/WK%20Auto%20Wrap-Up.meta.js
// ==/UserScript==

$.jStorage.listenKeyChange("reviewQueue", reviewLoaded);

function reviewLoaded(){
    if($.jStorage.get("reviewQueue").length>0){
	    console.log($.jStorage.get("reviewQueue").length);
		$.jStorage.set("reviewQueue", []);
	    console.log($.jStorage.get("reviewQueue").length);
    }
}
