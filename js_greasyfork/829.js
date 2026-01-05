// ==UserScript==
// @name            Restore Youtube Embed Defaults
// @description     Removes special options from Youtube embeds, resetting everything to defaults. Useful for restoring disabled buttons like fullscreen and watch on Youtube.
// @include         *
// @exclude	        *.youtube.com/*
// @version         0.0.3
// @namespace       https://greasyfork.org/users/910
// @downloadURL https://update.greasyfork.org/scripts/829/Restore%20Youtube%20Embed%20Defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/829/Restore%20Youtube%20Embed%20Defaults.meta.js
// ==/UserScript==

var i, j, k, index;
var video_id, video_url, video_link;

var risky_elements, risky_attributes, risky_node;
var risky_tags = ["object", "embed", "iframe"];

var bad_elements = [];
var bad_ids = [];

for (i = 0; i < risky_tags.length; i++) {
	risky_elements = document.getElementsByTagName(risky_tags[i]);
	for (j = 0; j < risky_elements.length; j++) {
		index = 0;
		risky_attributes = risky_elements[j].attributes;
		for (k = 0; k < risky_attributes.length; k++) {
			risky_node = risky_attributes[k].nodeValue;
			if ((risky_node.indexOf("youtube.com") >= 0) || (risky_node.indexOf("ytimg.com") >= 0) || (risky_node.indexOf("youtube-nocookie.com") >= 0)) {
				risky_elements[j].style.display = "none";
				if (risky_node.indexOf("/v/") >= 0) {
					index = risky_node.indexOf("/v/") + 3;
				} else if (risky_node.indexOf("?v=") >= 0) {
					index = risky_node.indexOf("?v=") + 3;
				} else if (risky_node.indexOf("/embed/") >= 0) {
					index = risky_node.indexOf("/embed/") + 7;
				}
				if (index > 0) {
					video_id = risky_node.substring(index, index + 11);
					bad_elements.push(risky_elements[j]);
					bad_ids.push(video_id);
				}
				break;
			}
		}
	}
}

for (i = 0; i < bad_ids.length; i++) {
	video_id = bad_ids[i];
	video_url = "//www.youtube.com/embed/" + video_id;
	video_link = document.createElement("iframe");
	video_link.setAttribute("src", video_url);

	// Set the width, if present
	width = bad_elements[i].getAttribute("width");
	if ( width !== null ) {
		video_link.setAttribute("width", width);
	}

	// Set the height, if present
	height = bad_elements[i].getAttribute("height");
	if ( height !== null ) {
		video_link.setAttribute("height", height);
	}

	video_link.setAttribute("frameborder", "0");
	video_link.setAttribute("allowfullscreen", "1");

	bad_elements[i].parentNode.replaceChild(video_link, bad_elements[i]);
}
