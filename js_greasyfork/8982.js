// ==UserScript==
// @name        YouTube Stop HTML5 Video Autoplay 2 Simple
// @description YouTube Stop HTML5 Video Autoplay 2 Simple.
// @namespace   2k1dmg@userscript
// @license     GPL version 3 or any later version; http://www.gnu.org/licenses/gpl.html
// @version     0.0.9
// @author      2k1dmg
// @grant       none
// @noframes
// @run-at      document-start
// @match       *://www.youtube.com/*
// @exclude     http://www.youtube.com/embed/*
// @exclude     https://www.youtube.com/embed/*
// @downloadURL https://update.greasyfork.org/scripts/8982/YouTube%20Stop%20HTML5%20Video%20Autoplay%202%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/8982/YouTube%20Stop%20HTML5%20Video%20Autoplay%202%20Simple.meta.js
// ==/UserScript==

(function() {
'use strict';

function forcePause(video) {
	function resetPause() {
		video.pause();
		video.currentTime = 0;
	}
	video.addEventListener('playing', resetPause, false);
	var timeout = document.hasFocus() ? 500 : 1000;
	window.setTimeout(function() {
		video.removeEventListener('playing', resetPause, false);
	}, timeout);
}

function forcePlay(video) {
	function onClick() {
		video.removeEventListener('click', onClick, false);
		function onPause() {
			video.play();
		}
		video.addEventListener('pause', onPause, false);
		window.setTimeout(function() {
			video.removeEventListener('pause', onPause, false);
		}, 750);
		onPause();
	}
	video.addEventListener('click', onClick, false);
	function onPlay() {
		video.removeEventListener('click', onClick, false);
		video.removeEventListener('play', onPlay, false);
	}
	window.setTimeout(function() {
		video.addEventListener('play', onPlay, false);
	}, 250);
}

var MOVIE_PLAYER = '#movie_player';
var YTP_TIME_LIVE = '.ytp-time-live,.ytp-time-liveonly,.ytp-time-live-dvr,.ytp-live-badge';
var YTP_BUTTON_PAUSE = '.ytp-button-pause';
var YTP_PLAY_BUTTON = '.ytp-play-button';

function onLoadedmetadata(event) {
	var video = event.target;
	var movie_player = document.querySelector(MOVIE_PLAYER);
	if(!movie_player) {
		video.pause();
		forcePause(video);
		forcePlay(video);
		return;
	}
	if(movie_player.querySelector(YTP_TIME_LIVE) &&
		movie_player.querySelector(YTP_TIME_LIVE).getAttribute('disabled') !== 'true')
		return;
	function onPlaying() {
		if(location.href.indexOf('list=') != -1)
			return;
		if(movie_player.pauseVideo) {
			movie_player.pauseVideo();
			if(movie_player.seekTo && location.href.indexOf('t=') == -1)
				movie_player.seekTo(0);
		}
		else {
			var ytp_button = movie_player.querySelector(YTP_BUTTON_PAUSE) || movie_player.querySelector(YTP_PLAY_BUTTON);
			if(ytp_button && ytp_button.click)
				ytp_button.click();
		}
	}
	video.addEventListener('playing', onPlaying, false);
	window.setTimeout(function() {
		video.removeEventListener('playing', onPlaying, false);
	}, 1000);
}
window.addEventListener('loadedmetadata', onLoadedmetadata, true);

})();
