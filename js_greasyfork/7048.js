// ==UserScript==
// @name        fix_pol_chrome
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   fixpol
// @description fix_pol_for_chrome
// @include     http://boards.4chan.org/pol/*
// @include     boards.4chan.org/pol/*
// @include     *4chan.org/pol/*
// @version     1
// @grant       none 
// @downloadURL https://update.greasyfork.org/scripts/7048/fix_pol_chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/7048/fix_pol_chrome.meta.js
// ==/UserScript==
 // a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.
  
    window.setInterval(function(){
	jQ("marquee").remove();  
	jQ("div blockquote a.deadlink").each(function() 
	{
		var postnum = jQ(this).attr("data-post-i-d");
		if(postnum.length == 9)
		{
			jQ(this).removeAttr("data-board-i-d");
			jQ(this).attr("class","quotelink");
			jQ(this).attr("href","#p"+postnum.slice(0,-1));
			jQ(this).removeAttr("target");
			jQ(this).removeAttr("data-post-i-d");
			jQ(this).html(">>"+postnum.slice(0,-1));
		}
	}); 
}, 5000);

}

// load jQuery and execute the main function
addJQuery(main);
