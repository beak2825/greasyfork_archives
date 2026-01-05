// ==UserScript==
// @name			EroProfile.com Infinite Scrolling
// @version			3.0
// @description		Adds the ability to automatically load more videos, as you scroll down the page
// @grant			none
// @include			http*://www.eroprofile.com/m/videos/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace		https://greasyfork.org/users/11286
// @downloadURL https://update.greasyfork.org/scripts/9811/EroProfilecom%20Infinite%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/9811/EroProfilecom%20Infinite%20Scrolling.meta.js
// ==/UserScript==

$(function() {
	$.addGlobalStyle = function (css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if(!head)
			return;
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	};
	
	$.addGlobalStyle('#divVideoListItems{height:auto;overflow:auto;}#divVideoListPageNav{height:200px!important;margin-top:20px;position:relative}#loading{position:absolute;width:256px;height:256px;top:50%;left:50%;margin:-128px 0 0 -128px;transform:scale(.6);-moz-transform:scale(.6);-webkit-transform:scale(.6);-ms-transform:scale(.6);-o-transform:scale(.6)}#loading>div{position:absolute;background-color:#E8E8E8;color:inherit;height:47px;width:47px;border-radius:23px;animation-name:map_loading;animation-duration:1.04s;animation-iteration-count:infinite;animation-direction:normal;-moz-border-radius:23px;-moz-animation-name:map_loading;-moz-animation-duration:1.04s;-moz-animation-iteration-count:infinite;-moz-animation-direction:normal;-webkit-border-radius:23px;-webkit-animation-name:map_loading;-webkit-animation-duration:1.04s;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:normal;-ms-border-radius:23px;-ms-animation-name:map_loading;-ms-animation-duration:1.04s;-ms-animation-iteration-count:infinite;-ms-animation-direction:normal;-o-border-radius:23px;-o-animation-name:map_loading;-o-animation-duration:1.04s;-o-animation-iteration-count:infinite;-o-animation-direction:normal}#loading>div:nth-child(1){left:0;top:105px;animation-delay:.39s;-moz-animation-delay:.39s;-webkit-animation-delay:.39s;-ms-animation-delay:.39s;-o-animation-delay:.39s}#loading>div:nth-child(2){left:30px;top:30px;animation-delay:.52s;-moz-animation-delay:.52s;-webkit-animation-delay:.52s;-ms-animation-delay:.52s;-o-animation-delay:.52s}#loading>div:nth-child(3){left:105px;top:0;animation-delay:.65s;-moz-animation-delay:.65s;-webkit-animation-delay:.65s;-ms-animation-delay:.65s;-o-animation-delay:.65s}#loading>div:nth-child(4){right:30px;top:30px;animation-delay:.78s;-moz-animation-delay:.78s;-webkit-animation-delay:.78s;-ms-animation-delay:.78s;-o-animation-delay:.78s}#loading>div:nth-child(5){right:0;top:105px;animation-delay:.91s;-moz-animation-delay:.91s;-webkit-animation-delay:.91s;-ms-animation-delay:.91s;-o-animation-delay:.91s}#loading>div:nth-child(6){right:30px;bottom:30px;animation-delay:1.04s;-moz-animation-delay:1.04s;-webkit-animation-delay:1.04s;-ms-animation-delay:1.04s;-o-animation-delay:1.04s}#loading>div:nth-child(7){left:105px;bottom:0;animation-delay:1.17s;-moz-animation-delay:1.17s;-webkit-animation-delay:1.17s;-ms-animation-delay:1.17s;-o-animation-delay:1.17s}#loading>div:nth-child(8){left:30px;bottom:30px;animation-delay:1.3s;-moz-animation-delay:1.3s;-webkit-animation-delay:1.3s;-ms-animation-delay:1.3s;-o-animation-delay:1.3s}@-moz-keyframes map_loading{0%{background-color:#0069C6}100%{background-color:transparent}}@-webkit-keyframes map_loading{0%{background-color:#0069C6}100%{background-color:transparent}}@-ms-keyframes map_loading{0%{background-color:#0069C6}100%{background-color:transparent}}@-o-keyframes map_loading{0%{background-color:#0069C6}100%{background-color:transparent}}@keyframes map_loading{0%{background-color:#0069C6}100%{background-color:transparent}}');
	
	$.urlParam = function(name) {
		var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
		if(results === null)
			return null;
		else
			return results[1] || 0;
	};
	
	var loading = false;
	$('.boxNav2').hide();
	$('<div/>', {
		id: 'loading'
	}).appendTo('#divVideoListPageNav');
	for(var i = 0; i < 8; i++) {
		$('<div/>').appendTo('#loading');
	}
	
	$(window).on('scroll', function() {
		var end = $('#divVideoListAd2').offset().top;
		var viewEnd = $(window).scrollTop() + $(window).height();
		var distance = end - viewEnd;
		if(distance <= 0) {
			if(loading === false) {
				loading = true;
				$('#divVideoListPageNav').show();
				var params = '';
				var niche = $.urlParam('niche');
				if(niche)
					params += '&niche=' + niche;
				var text = $.urlParam('text');
				if(text)
					params += '&text=' + text;
				var pnum = parseInt($.urlParam('pnum')) || 1;
				var new_pnum = pnum + 1;
				params += '&pnum=' + new_pnum;
				new_url = '?' + params.substring(1);
				$.ajax({
					url: 'https://www.eroprofile.com/m/videos/' + new_url,
					type: 'post',
					dataType: 'html',
					success: function(data) {
						$(data).find('div.video').appendTo('#divVideoListItems > .videoGrid');
						window.history.pushState('', '', new_url);
						$('#divVideoListPageNav').hide();
						loading = false;
					}
				});
			}
		}
	});
});
