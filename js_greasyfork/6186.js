// ==UserScript==
// @name			RubyTapas Video Embedder
// @namespace		https://github.com/habibalamin-userscripts
// @include			https://rubytapas.dpdcart.com/subscriber/post?id=*
// @description:en		For subscribers to RubyTapas who are tired of having to download every single video, this script will automatically embed the video from the download link.
// @version 0.0.1.20141031182553
// @description For subscribers to RubyTapas who are tired of having to download every single video, this script will automatically embed the video from the download link.
// @downloadURL https://update.greasyfork.org/scripts/6186/RubyTapas%20Video%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/6186/RubyTapas%20Video%20Embedder.meta.js
// ==/UserScript==

(function embedVideo() {
	var files = document.getElementById('blog-container');
	var links = files.getElementsByTagName('a');
	var contentArea = document.getElementById('main');
	contentArea.style.maxWidth = "80%";
	var videoLink;
	for (var i = 0; i < links.length; i++) {
		if (links[i].textContent.match(/mp4/)) {
			videoLink = links[i];
			break;
		}
	}
	var videoEmbed = document.createElement('video');
	var lineBreak = document.createElement('br');
	videoEmbed.setAttribute('controls', true);
	videoEmbed.setAttribute('autoplay', true);
	videoEmbed.setAttribute('src', videoLink.getAttribute('href'));
	videoEmbed.setAttribute('id', 'rb-video');
	videoEmbed.style.marginLeft = "-20px";
	videoEmbed.style.maxWidth = "100%";
	videoEmbed.style.width = "100%";
	lineBreak.setAttribute('id', 'rb-video-linebreak');
	videoLink.parentNode.insertBefore(videoEmbed, videoLink.nextSibling);
	videoLink.parentNode.insertBefore(lineBreak, videoLink.nextSibling);
})();