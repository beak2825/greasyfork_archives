// ==UserScript==
// @name        YouTube Anti-Google+ comments
// @name:de     YouTube Google+ Kommentarentferner
// @namespace   http://xmine128.tk/gm/youtube-anti-google-comments/
// @description Prevent "via Google+" comments to show up on YouTube
// @description:de Verhindern, dass "Über Google+"-Kommentare auf YouTube erscheinen
// @include     https://*.youtube.com/watch?*
// @version     1.1.2
// @license     GPL-3+
// @grant       unsafeWindow
// @icon        http://xmine128.tk/gm/youtube-anti-google-comments/icon.png
// @downloadURL https://update.greasyfork.org/scripts/7136/YouTube%20Anti-Google%2B%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/7136/YouTube%20Anti-Google%2B%20comments.meta.js
// ==/UserScript==


/**
 * Inject the code of the given callback function as unprivileged code into the current page
 *
 * Note: The function will not have access to anything defined in the scope of the user script.
 *
 * @param {Function} callback
 *        The function that should be inject into and call in the scope of the current page
 */
function inject_callback_code(callback)
{
	var code = "";
	var name;
	
	if(callback.name) {
		name = callback.name;
		
		code += callback.toString()                         + ";";
	} else {
		name = "_inject_func_01";
		
		code += "var " + name + " = " + callback.toString() + ";";
	}
	
	code += "void(" + name + "()"      + ");";
	code += "void(" + "delete " + name + ");";
	
	window.location.href = "javascript:" + code;
}


/**
 * Converts an arbitrary collection (must have indexes and a `length` attribute into a JavaScript array)
 *
 * This function is inspired by ProtoType.js' `$A` function, which does the same thing.
 *
 * @param {Collection} collection
 * @return {Array}
 */
function $A(collection)
{
	return Array.prototype.slice.call(collection, 0);
}

function fuck_yt_gplus()
{
	// Iterate over all comments
	$A(document.querySelectorAll("#yt-comments-list > .comment-entry")).forEach(function(comment)
	{
		// Find comment header
		var comment_header = comment.querySelector(".comment-header > .comment-source");
		if(comment_header) {
			// Search for text node containing the string "Google+"
			// Note: The "Google+" part of the string is always the same in any localization of the page, while the "via"
			//       part is always translated to the user/browser locale
			//       (and can therefor not reliably be used for searching)
			var comment_via_gplus = false;
			$A(comment_header.childNodes).forEach(function(node)
			{
				if(node.nodeType === Node.TEXT_NODE && node.textContent.indexOf("Google+") > -1) {
					comment_via_gplus = true;
				}
			});
		
			// Delete comment
			if(comment_via_gplus) {
				comment.parentNode.removeChild(comment);
			}
		}
	});
};

// Trigger on DOMContentLoaded (GreaseMonkey default script start)
fuck_yt_gplus();

/****************************************
 * Retrigger after loading new comments *
 ****************************************/

// Provide main function to content scripts :-P
exportFunction(fuck_yt_gplus, unsafeWindow, { defineAs: "fuck_yt_gplus" });

// Override XMLHttpRequest object
inject_callback_code(function()
{
	var _XMLHttpRequest = window.XMLHttpRequest;
	window.XMLHttpRequest = function(params)
	{
		var request = new _XMLHttpRequest(params);
		request.addEventListener("load", function(event)
		{
			window.setTimeout(function()
			{
				fuck_yt_gplus();
			}, 0);
		});
		return request;
	};
});
