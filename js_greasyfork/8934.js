// ==UserScript==
// @name        Previsualizer
// @namespace   JVScript
// @include     http://www.jeuxvideo.com/*
// @version     6
// @require	    http://code.jquery.com/jquery-2.1.3.min.js
// @grant       GM_addStyle
// @copyright	MIT
// @author	    Kiwec
// @description Permet de prévisualiser un topic.
// @downloadURL https://update.greasyfork.org/scripts/8934/Previsualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/8934/Previsualizer.meta.js
// ==/UserScript==

"use strict";

(function() {

	function Link(node) {
		this.$message = $('<div><img style="margin: auto; display: block !important; width: 25%;" src="http://s3.noelshack.com/uploads/images/20188032684831_loading.gif" alt="Loading" /></div>');
		this.$message.attr('class', 'prev_content bloc-message-forum');
		this.$topic = node;

		this.initialize();
	}

	Link.prototype = {
		initialize: function() {
			var url = this.$topic.find('a.topic-title').attr('href');
			
			this.$topic.find('img.topic-img').wrap('<span class="span-topic-img"></span>');
			this.$topic.find('.span-topic-img').append(this.$message);
			this.$topic.find('.topic-img').on('mouseenter', (function() {
				$.get(url).done((function(response) {
					var success = $($.parseHTML(response)).find('.bloc-message-forum');
					this.$message.html($(success[0]).html());
				}).bind(this));
			}).bind(this));
		}
	}

	function addPreload() {
		$('.topic-list li:not(.topic-head)').each(function() {
			new Link($(this));
		});
	}

	addPreload();
	addEventListener('instantclick:newpage', addPreload);

	GM_addStyle(
		'.prev_content { position: absolute; z-index: 1000; width: 600px; max-height: 500px; overflow-y: scroll; ' + 
		'display: none; margin-left: 10px; margin-top: 15px; font-weight: 200; }' +
		'.span-topic-img:hover .prev_content { display: block; }'
	);

})();