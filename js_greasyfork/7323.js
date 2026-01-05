// ==UserScript==
// @name		v4c/InstaSynch Additional Features
// @namespace		v4c
// @description 	gives many additional features on instasynch. created by biggles, unless otherwise noted in script source.
// @locale     	     	en
// @include     	*://*.instasynch.com/*
// @include     	*://instasynch.com/*
// @match       	*://*.instasynch.com/*
// @match       	*://instasynch.com/*
// @require		https://cdn.jsdelivr.net/tiptip/1.3/jquery.tipTip.minified.js
// @require		http://openuserjs.org/src/libs/TimidScript/TSL_-_jsColorGM.js
// @version		1.886
// @grant		none
// @author		biggles
// ==/UserScript==

//REL 1.886

//Created by biggles; very few parts used from other sources, where they are given credit. Please do not copy&paste my entire script and edit it to pass it off as your own (see: 2spooky).
//Edited by Snoop_Dank, Added a few emotes. I Take no credit for this script.

/*
	<InstaSynch - Watch Videos with friends.>
	Copyright (C) 2013-2014  InstaSynch

	<Instasynch modified code>
	Copyright (C) 2013-2014  biggles (unless otherwise noted)

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

	http://opensource.org/licenses/GPL-3.0
*/

window.secondsToTime = function(num) {
	var hours = Math.floor(num / 3600);
	var minutes = Math.floor((num - (hours * 3600)) / 60);
	var seconds = num - (hours * 3600) - (minutes * 60);

	if (minutes < 10 && hours > 0)
		minutes = "0" + minutes;

	if (seconds < 10)
		seconds = "0" + seconds;

	var time = "";
	if (hours !== 0)
		time += hours + ':';

	time += minutes + ':' + seconds;
	return time;
};
	
var postConnect = [];
var reconnectFns = [];

loadedFunctions = loadedGlobalVariables = loadedCSS = loadedConnected = loadedCookies = loadedClock = loadedChatListeners = loadedEmoteMenu = loadedHTML = loadedBinds = initialLoad = false;

window.postConnectDo = function(a) { /* modified postConnect, originally by Faqqq */
// bool a: if false, use initial function list
// else, load functions in the reconnect list (used when changing rooms)

		if ($('.users #userlist li').length < 1) {
			setTimeout(function() {
				postConnectDo(initialLoad);
			}, 100);
			return;
		}
	if (!a) {
		for (var i = 0; i < postConnect.length; i++) {
			postConnect[i]();
		}
		initialLoad = true;
	} else {
		for (var i = 0; i < reconnectFns.length; i++) {
			reconnectFns[i]();
		}
	}
	
}

window.reloadFunctions = function() {

}

$('head').append('<link rel="stylesheet" type="text/css" href="https://googledrive.com/host/0B2hdmKDeA0HDak92NTA2amhMZ2s?v=001"/>');

function loadGlobalVariables() {
	window.scriptVer = "1.886";
	window.maxemotes = window.MAXLOGS = window.MAXFAST = 4;
	currentVid = '';
	isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	chenSound = new Audio('http://drowngaben.x10.mx/unused/bikehorn.ogg');
	dootSound = new Audio('http://drowngaben.x10.mx/unused/dootdoot.mp3');
	chadSound = new Audio('http://drowngaben.x10.mx/unused/gayniggas.mp3');
	noSound = new Audio('http://drowngaben.x10.mx/unused/no.mp3');
	window.emoteSounds = {chen: chenSound, doot: dootSound, chad: chadSound, no: noSound};
	logTraffic = logVids = impone = showRoll = sameUserMessages = useColons = true;
	logs = fastmsgs = 0;
	recentVidInfo = [];
	marqueeSpeed = 50;
	autoClean = isv4c = largePlayer = largerPlayer = shuffling = false;
	loadedGlobalVariables = true;
	stageBase = 675;
	userStyleList = ['registered ', 'registered um0 ', 'registered um1 ', 'registered ummb ', 'registered umbiggles '];
	customUsers = ['manboss'];
	eight_choices = [
		"It is certain",
		"It is decidedly so",
		"Without a doubt",
		"Yes - definitely",
		"You may rely on it",
		"As I see it, yes",
		"Most likely",
		"Outlook good",
		"Signs point to yes",
		"Yes",
		"Ask again later",
		"Better not tell you now",
		"Cannot predict now",
		"Don't count on it",
		"My reply is no",
		"My sources say no",
		"Outlook not so good",
		"Very doubtful",
		"Never",
		"Of course not"
	];
}

function loadCSS() {

	loadedCSS = true;
	$('.scriptCSS').remove();
	switch ($.cookie('largePlayerSetting')) {
		case '0':
			largePlayer = false;
			largerPlayer = false;
			$('.jspContainer').attr('style', 'width: 536px; height: 327px;');
			break;
		case '1':
			largePlayer = true;
			largerPlayer = false;
			$('head').append('<link rel="stylesheet" class="scriptCSS" href="https://googledrive.com/host/0B2hdmKDeA0HDVHVVWFBoMzZqdUU?d=20140526&v=000" type="text/css" />');
			stageBase = 890;
			$('.jspContainer').attr('style', 'width: 735px; height: 398px;');
			$('#videos').attr('style', 'width: 739px');
			break;
		case '2':
			largePlayer = false;
			largerPlayer = true;
			$('head').append('<link rel="stylesheet" class="scriptCSS" href="https://googledrive.com/host/0B2hdmKDeA0HDSkxuR1J0MUppRnc?d=20140526&v=000" type="text/css" />');
			stageBase = 1393;
			$('.jspContainer').attr('style', 'width: 1346px; height: 519px;');
			$('#videos').attr('style', 'width: 1350px');
			break;
	}
}

function connected() {

	loadedConnected = true;

	addMessage({username:'[v' + scriptVer + ']Script'}, '<span style="font-weight:bold; color:#23B323">Loaded.</span>', 'system');
	
	isMod = false;
	if (userInfo['permissions'] > 0)
		isMod = true;
		
	//window.scrollTo(0, 120);

	$('.stage').height(stageBase);
		setTimeout(function() {
		var names = {};
		if (isv4c)
			names = {
				manboss: 'manboss',
				captainfalcon: 'user_cap',
				grinsly: 'grins',
				gingersnap: 'ginger',
				biggles: 'biggles'
			};
		names[ROOMNAME.toLowerCase()] = 'admin';
		for (var k = 0; k < users.length; k++) {
			var i = $('#userlist li').eq(k);
			var j = $('#userlist li')[k].textContent.toLowerCase();
			if (j in names) {
				i.addClass(names[j]);
			}
		}
	}, 1000);
}

loadFunctions = function() {

	loadedFunctions = true;
		
	window.setMediaShadow = function(a) { // a = video provider
		var shadows = {'youtube': '#CC181E', 'vimeo': '#00ADEF', 'twitch': '#B9A3E3', 'dailymotion': '#FF0'}
		if (a in shadows)
			$('#media').css('box-shadow', '0 0 10px ' + shadows[a]);
	}
	
	window.playVideo = function(vidinfo, time, playing) {
		var addedby,title;
		addedby = title = '';
		var indexOfVid = getVideoIndex(vidinfo);
		if (indexOfVid > -1) {
			if (mediashadow)
				setMediaShadow(vidinfo.provider);
				
			title = checkEmote(playlist[indexOfVid].title);
			addedby = playlist[indexOfVid].addedby;
			$('.video.active .video-info').css('color', '#888');
			$('.video.active .video-info .duration').css('color', '#888');
			$('.video.active').removeClass('active');
			$($('#video-list').children('li')[indexOfVid]).addClass('active');
			$('.video.active .video-info').css('color', '#000');
			$('.video.active .video-info .duration').css('color', '#000');
			$('#vidTitle').html(title + ' <div class=\'via\'> via ' + addedby + '</div>');
			$('#vidTitle .via').css('color', '#ccc');
			updateRecent(indexOfVid);
			setTabTitle(vidinfo, addedby, indexOfVid);
			video.play(vidinfo, time, playing);
			$('#skip-count').attr('style', 'color: #fff!important');
			if (autoClean && isMod) {
				setTimeout(function() {
					if (indexOfVid == 1)
						global.sendcmd('clean', null);
				}, 1000);
			}
			var bgtimer = '';
			if (playlist[indexOfVid].info.id == 'IniyZZqlcwA') {
				clearTimeout(bgtimer);
				window.bgtimer = setTimeout(function() {
					$('#stage').css('background-image', 'url("http://whereduaneat.org/duane.gif")');
				}, 21000);
			} else {
				clearTimeout(bgtimer);
				$('#stage').css('background-image', 'none');
			}
		}
	};
	
	window.setFast = function(data) {
		if (!isNaN(parseInt(data))) {
			if (data > 99) {
				data = 99;
				$('#marqueeinput').val(data);
			}
			marqueeSpeed = data;
			if (typeof($codes.fast) === 'string') {
				$codes['fast'] = '<marquee direction="right" scrollamount="' + marqueeSpeed + '">';
			}
		}
	};
	
	
	window.updateColor = function(id, hex) {
		switch (id) {
			case 'pickerButtons': $('.vjs-default-skin .vjs-play-control, .vjs-mute-control, .vjs-fullscreen-control').css('color', '#'+hex); break;
			case 'pickerHandles': $('.vjs-slider-handle').css('color', '#'+hex); break;
			case 'pickerProgress': $('.vjs-play-progress, .vjs-volume-level').css('background-color', '#'+hex); break;
			case 'pickerText': $('.vjs-current-time-display, .vjs-time-divider, .vjs-duration-display, .vjs-quality-button').css('color', '#'+hex); break;
		}
	};
	
	window.showChangelog = function() {
		$('#chat-messages').append('<div class="message changelog"><strong style="color: #f0f">============= Changelog =============</strong></div>');
		$('#chat-messages').append('<div class="message changelog"><strong style="color: #00a">[1.881b]</strong> Emote menu no longer stays between room switches. General fixes.</div>');
		$('#chat-messages').append('<div class="message changelog"><strong style="color: #00a">[1.882]</strong> New toggle in Script Options for black chat. New emote: /tip. Added "Script Help" link at the top. Decreased Script Menu width. Changed update message.</div>');
		$('#chat-messages').append('<div class="message changelog"><strong style="color: #0f0">[1.883]</strong> Updated a few functions. Added onClick sound to /no. Added "Shuffle Playlist" button to playlist menu. Fixed curtain not working after changing rooms. Emote menu fades in/out.</div>');
		$('#chat-messages').append('<div class="message changelog"><strong style="color: #f0f">====================================</strong></div>');
		messages += 5;
		chatScroll();
	};
	
	window.swapEmoteStyle = function() {
		useColons = !useColons;
		if (useColons)
			$('#op-button.switchemotestyle').html('Emote Menu: use <span style="color: #0f0">/emote</span> instead');
		else
			$('#op-button.switchemotestyle').html('Emote Menu: use <span style="color: #0f0">:emote:</span> instead');
	}

	window.byteCount = function(str) {
		return encodeURI(str).split(/%..|./).length - 1;
	}; /*Lauri Oherd on stackoverflow*/

	jQuery.lazyCookie = function() {
		if (jQuery.cookie(arguments[0]) === null) return;
		jQuery.cookie.apply(this, arguments);
	}; /*by Jacob Relkin on stackoverflow*/
	
	window.playSound = function(sound) {
		var vol = video.video.volume();
		sound.volume = vol;
		sound.play();
	};

	window.getUserIndex = function(id) {
		for (var i = 0; i < users.length; i++) {
			if (id == users[i].id) {
				return i;
			}
		}
		return -1;
	};

    // adjustCurtain() -- resize curtain, if it's open, upon change of screen layout
    window.adjustCurtain = function() {
        var cHeights = {top: $('#curtainTop').height(), bottom: $('#curtainFloor').height()};
        var a = {h: $('#media').height(), w: $('#media').width()};
        
        // a is an object of #media dimensions {h: height,w: width}
        
        // floor of the curtain always has a constant height, so subtract
        // the height of the floor from the height of the video to get the new curtainTop height
        
        $('#curtainTop').width(a.w);
        $('#curtainFloor').width(a.w);
        
        switch (a.h) {
            case 320:
            
                if (cHeights.top > a.h)
                    $('#curtainTop').height(248)
                break;
                    
            case 436:
            
                if (cHeights.top > a.h || (cHeights.top > 0 && cHeights.top < 364))
                    $('#curtainTop').height(364)
                break;
                    
            case 796:
                
                if (cHeights.top > a.h || (cHeights.top > 0 && cHeights.top < 724))
                    $('#curtainTop').height(724)
                break;
        }
    }
    
	window.switchResolution = function(level) {
		var switchRes = false;
		switch (level) {
			case 0:
				$.cookie('largePlayerSetting', '0');
				largePlayer = false;
				largerPlayer = false;
				var currentCSS = $('.scriptCSS');
				$('.jspContainer').attr('style', 'width: 536px; height: 327px;');
				$('#videos').attr('style', 'width: 539px');
				stageBase = 675;
				$('#players a.normal').attr('style', 'color: white!important; text-decoration: none!important');
				$('#players a.normal').attr('href', null);
				$('#players a.large, #players a.larger').attr('style', 'color: #ccc!important; text-decoration: underline!important');
				$('#players a.large, #players a.larger').attr('href', '#');
				$('.stage').height(stageBase);
				currentCSS.remove();
				break;
			case 1:
				$.cookie('largePlayerSetting', '1');
				largePlayer = true;
				largerPlayer = false;
				var currentCSS = $('.scriptCSS');
				$('head').append('<link rel="stylesheet" class="scriptCSS" href="https://googledrive.com/host/0B2hdmKDeA0HDVHVVWFBoMzZqdUU?d=20140526&v=000" type="text/css" />');
				stageBase = 890;
				$('#players a.large').attr('style', 'color: white!important; text-decoration: none!important');
				$('#players a.large').attr('href', null);
				$('#players a.larger, #players a.normal').attr('style', 'color: #ccc!important; text-decoration: underline!important');
				$('#players a.larger, #players a.normal').attr('href', '#');
				$('.stage').height(stageBase);
				$('.jspContainer').attr('style', 'width: 735px; height: 398px;');
				$('#videos').attr('style', 'width: 739px');
				currentCSS.remove();
				break;
			case 2:
				$.cookie('largePlayerSetting', '2');
				largePlayer = false;
				largerPlayer = true;
				var currentCSS = $('.scriptCSS');
				$('head').append('<link rel="stylesheet" class="scriptCSS" href="https://googledrive.com/host/0B2hdmKDeA0HDSkxuR1J0MUppRnc?d=20140526&v=000" type="text/css" />');
				stageBase = 1393;
				$('#players a.larger').attr('style', 'color: white!important; text-decoration: none!important');
				$('#players a.larger').attr('href', null);
				$('#players a.large, #players a.normal').attr('style', 'color: #ccc!important; text-decoration: underline!important');
				$('#players a.large, #players a.normal').attr('href', '#');
				$('.stage').height(stageBase);
				$('.jspContainer').attr('style', 'width: 1346px; height: 519px;');
				$('#videos').attr('style', 'width: 1350px');
				currentCSS.remove();
				break;
		}
        adjustCurtain();
	};

	window.addLog = function(title, addedby) {
		var cl = $('#chat-messages .message');
		if (cl[cl.length - 1].textContent !== ': Reconnected to chat server.' && messages > 2) {
			if (title.length > 80)
				title = title.slice(0, 80) + '...';
		addMessage({username:'%addVideo'}, addedby + ' added ' + title, 'gm vid');
		}
	};

	window.updateNotice = function(state, ver) {
		if (state == 'on' && ver != scriptVer) {
			$('#newUpdate').show();
		} else if (state == 'off') {
			$('#newUpdate').hide();
		}
	};

	window.addTempEmote = function(name, url, w, h) {
		var newEmote = {};
		var node = '<img src="' + url + '" width="' + w + '" height="' + h + '">';
		newEmote[name] = node;
		$.extend($codes, newEmote);
	};

	window.findUserVideos = function(user) {
		var vids = 0;
		var userLower = user.toLowerCase();
		if (playlist.length !== 0) {
			for (var i = 0; i < playlist.length; i++) {
			  if (playlist[i].addedby.toLowerCase() == userLower) {
				vids++;
			  }
			}
			addMessage({username:''},'Found ' + vids + ' video(s) added by ' + user + '.','hashtext');
		} else {
			addMessage({username:''},'No videos in playlist.','urgenttext');
		}
	};

	window.checkMod = function(user) {
		user = user.toLowerCase();
		for (var i = 0; i < users.length; i++) {
			if (users[i].username.toLowerCase() == user) {
				var p = users[i].permissions;
				var Mod;
				if (p == "1" && customUsers.indexOf(user) < 0) {
					Mod = 1; //normal mod
				} else if (p == 2) {
					Mod = 2; //admin of room
				} else if (customUsers.indexOf(user) > -1) {
					Mod = 3; //user in custom admin list
				} else {
					Mod = 0; //normal user
				}
				return Mod;
			}
		}
	};

	window.checkEmote = function(message) {
		var a,b,c,d,e;
		a = b = c = d = e = 0;
		while (a < message.length && a >= 0 && e < 4) {
			d++;
			a = message.indexOf(':', a);
			b = message.indexOf(':', a + 1);
			var f = message.slice(a, b + 1);
			if ($codes[f.slice(1, -1).toLowerCase()] !== undefined) {

				c = $codes[f.slice(1, -1).toLowerCase()].length;

				var emote = f.slice(1, -1).toLowerCase();
				message = message.replace(f, $codes[emote]);
				if ($colorcodes[emote] !== undefined || $fontcodes[emote] !== undefined) e += 0.5;
				else e++;

				if (c < f.slice(1, -1).length) {
					a = message.indexOf(f.slice(1, -1));
				} else {
					a = ($codes[f.slice(1, -1).toLowerCase()].length + a);
				}

			} else if ($codes[f.slice(1, -1).toLowerCase()] === undefined) {
				a = b;
			} else if (d >= 10) {
				break;
			}
		}
		return message;
	};

	window.expandEmotes = function() {
		$('#facecodesmenu').fadeToggle();
		$('#facecodesmenu #emotes').fadeToggle();
	};

	window.setFavIcon = function(src) {
		var a = '<link rel="shortcut icon" class="scr-fav" href="' + src + '">';
		$('.scr-fav').remove();
		$('head').append(a);
	};

	window.cssCommand = function(mode, item, c) {
		if (mode == 'glow') {
			if (c == 'off') {
				$(item).css('box-shadow', 'none');
			} else {
				$(item).css('box-shadow', '0 0 15px ' + c);
			}
		} else if (mode == 'bg') {
			if (c == 'off') {
				$(item).css('background-image', 'none');
			} else {
				$(item).css('background-image', 'url(' + c + ')');
			}
		}
	};

	window.clearChat = function() {
		$('#chat-messages').empty();
		messages = fastmsgs = 0;
	};

	window.cleanLog = function() {
		if (logs > MAXLOGS) {
			$('#logs span').eq(1).css('opacity', '.2');
			$('#logs span').eq(2).css('opacity', '.4');
			$('#logs span').eq(3).css('opacity', '.6');
			$('#logs span').eq(0).remove();
			logs--;
		}
	};

	String.prototype.repeat = function(num) {
		return new Array(num + 1).join(this);
	};

	window.toggleAutoClean = function() {
		autoClean = !autoClean;
		if (autoClean) {
			addMessage({username:''}, 'Autoclean is now on. The next video must be position 1 to autoclean.', 'hashtext');
		} else {
			addMessage({username:''}, 'Autoclean is now off.', 'hashtext');
		}
	};

	window.viewHistory = function(vids) {
		var icon = '';
		var host = '';
		var thumb = '';
		var title = '';
		var key = {
			'youtube': {icon: 'http://i.imgur.com/KpOgg0D.png', host: 'http://youtube.com/watch?v='},
			'vimeo': {icon: 'http://i.imgur.com/TOogvwC.png', host: 'http://vimeo.com/'},
			'dailymotion': {icon: 'http://i.imgur.com/n7HR2hF.png', host: 'http://dailymotion.com/video/'},
			'twitch': {icon: 'http://i.imgur.com/0jO0wYz.png', host: 'http://twitch.tv/'},
		}
		$('#viewHistory').empty();
		$('#viewHistory').append('<div class="close-history x" onclick="$(\'#gethistory\').click();"></div>');
		for (var i = vids.length - 1; i > -1; i--) {
			thumb = vids[i].info.thumbnail;
			if (vids[i].info.provider in key) {
				icon = key[vids[i].info.provider].icon;
				host = key[vids[i].info.provider].host;
				if (vids[i].info.provider === 'twitch')
					vids[i].info.id = vids[i].info.channel;
			}
			title = vids[i].title;
			if (title.length > 100)
				title = title.slice(0,100) + '...';
				
			$('#viewHistory').append('<li class="search-result" title="' + title + '"><a href="' + host + vids[i].info.id + '" target="_blank"><span class="video-thumb"><img class="video-thumbnail" src="' + thumb + '"><img class="video-icon" src="' + icon + '"><span class="video-time">' + secondsToTime(vids[i].duration) + '</span></span><span class="video-title">' + title + '</span><span class="video-uploader">added by <b><span id="vidUploader">' + vids[i].addedby + '</span></b></a></li>');
		}
	}

		window.addUser = function(user, sort) {
			var css = '';
			if (user['loggedin']) {
				css += 'registered ';
				if (logTraffic) {
					$('<span class="logJoined" style="opacity: 1">+ ' + user.username + '<br />').appendTo('#logs');
					logs++;
					cleanLog();
				}
			}
		if (user.permissions > 0) {
			css += 'm ';
		}
		if (user.permissions == "1" || user.permissions == 2) {
			var name = user.username.toLowerCase();
			var names = {};
			if (isv4c)
				names = {
					manboss: 'manboss',
					captainfalcon: 'user_cap ',
					grinsly: 'grins ',
					gingersnap: 'ginger ',
					biggles: 'biggles '
				};
			names[ROOMNAME.toLowerCase()] = 'admin ';
			if (name in names) {
				css += names[name];
			}
		}
		css += isMuted(user.ip) ? "muted" : "";
		user.css = css;
		users.push(user);
		var userElement = $('<li/>', {
			"class": css,
			"text":user.username,
			"data": {username: String(user.username), id: user.id, css: css, loggedin: user.loggedin, ip: user.ip},
			"click": function () {
				$('#cin')['val']($('#cin')['val']() + $(this).data('username'));
				$('#cin')['focus']();
			}
		});
		userElement.hover(function ()
		{
			var thisElement = $(this);
			$(this).data('hover', setTimeout(function ()
			{
				$('#bio-username').text(thisElement.data('username').toUpperCase());
				$("#user_bio_hover").css('top', $(thisElement).offset().top - $("#chat").offset().top + 10);
				$('#bio-image').attr('src', '');
				$('#bio-text').text('');
				//reset
				$('#ban').data('id', "");
				$('#kick').data('id', "");
				$('#mute-button').data('ip', "");
				//
				$('#user_bio_hover').show();
				if (thisElement.data('loggedin') == true)
				{
					getUserInfo(thisElement.data('username'), function (avatar, bio) {
						$('#bio-image').attr('src', avatar);
						$('#bio-text').text(bio);
					});
				} else {
					$('#bio-text').html("<span style='color: grey; font-style:italic'>User is not registered.</span>");
				}
				$('#ban').data('id', user['id']);
				$('#kick').data('id', user['id']);
				$('#mute-button').data('ip', user.ip);
				//show or hide mute/unmute buttons
				if (isMuted(user.ip))
				{
					$("#mute-button").removeClass("");
					$("#mute-button").addClass("");
				}
				else
				{
					$("#mute-button").removeClass("");
					$("#mute-button").addClass("");
				}
			}, 600));
		}, function () {
			clearTimeout($(this).data('hover'));
			setTimeout(function () {
				if (!mouseOverBio) {
					$('#user_bio_hover').hide();
				}
			}, 50);
		});
		$('#userlist').append(userElement);
		$('#viewercount').text(users.length);
		if (sort === true) {
			sortUserlist();
		}
		if (users.length >= 100) {
			if (users.length < 200) {
				if (!$('#viewercount').hasClass('highviewcount'))
					$('#viewercount').addClass('highviewcount');
				if ($('#viewercount').hasClass('higherviewcount'))
					$('#viewercount').removeClass('higherviewcount');
			} else if (users.length >= 200) {
				if ($('#viewercount').hasClass('highviewcount'))
						$('#viewercount').removeClass('highviewcount');
				$('#viewercount').addClass('higherviewcount');
			}
		} else {
		    if ($('#viewercount').hasClass('highviewcount'))
		        $('#viewercount').removeClass('highviewcount');
		    if ($('#viewercount').hasClass('higherviewcount'))
		        $('#viewercount').removeClass('higherviewcount');
		}
	};

	window.removeUser = function(id) {
		var user = users[getUserIndex(id)];
		if (user.loggedin && logTraffic) {
			$('<span class="logLeft" style="opacity: 1">- ' + user.username + '<br />').appendTo('#logs');
			logs++;
			cleanLog();
		}
		for (var i = 0; i < users.length; i++)
		{
			if (id === users[i].id)
			{
				users['splice'](i, 1);
				$($('#userlist').children('li')[i]).remove();
				break;
			}
		}
		$('#viewercount').html(users.length);
		if (users.length >= 100) {
			if (users.length < 200) {
				if (!$('#viewercount').hasClass('highviewcount'))
					$('#viewercount').addClass('highviewcount');
				if ($('#viewercount').hasClass('higherviewcount'))
					$('#viewercount').removeClass('higherviewcount');
			} else if (users.length >= 200) {
				if ($('#viewercount').hasClass('highviewcount'))
						$('#viewercount').removeClass('highviewcount');
				$('#viewercount').addClass('higherviewcount');
			}
		} else {
		    if ($('#viewercount').hasClass('highviewcount'))
		        $('#viewercount').removeClass('highviewcount');
		    if ($('#viewercount').hasClass('higherviewcount'))
		        $('#viewercount').removeClass('higherviewcount');
		}
	};

	window.bumpUser = function(user, bumpTo) {
		if (isMod) {
			var a = false;
			var c = [];
			var b = '';
            var d = '';
			var e = bumpTo;
			if (e === null)
				e = $('.video.active').index() + 1;
			e = parseInt(e);
			if (isNaN(e) || e >= playlist.length) {
				d = 'Invalid playlist position.';
			} else {
				if (user !== '\\r') {
					for (var i = 0; i < users.length; i++) {
						if (users[i].username.toLowerCase().indexOf(user) == 0 && users[i].loggedin) {
							c.push(users[i].username);
						}
					}
					if (c.length > 1) {
						d = 'Multiple users found. Be more specific.';
					} else if (c.length == 0) {
						d = 'No users found.';
					} else if (c.length == 1) {
						b = c[0];
						for (var l = playlist.length - 1; l > -1; l--) {
							if (playlist[l].addedby.toLowerCase() == b.toLowerCase()) {
								a = true;
								global.sendcmd('move', {
										info: playlist[l].info,
										position: e
									});
								break;
							}
						}
						if (a) {
							d = 'Bumped ' + b + '.';
						} else {
							d = 'No videos found.';
						}
					}
				} else {
					f = Math.ceil(Math.random() * playlist.length) - 1;
					if (f == $('.video.active').index()) {
						f++;
					}
					if (f > playlist.length - 1) {
						d = 'Playlist too small.';
					} else {
						global.sendcmd('move', {
								info: playlist[f].info,
								position: e
							});
						d = 'Random video (' + f + ') bumped.';
					}
				}
			}
		} else {
			d = 'You cannot use this command.';
		}
		$('<div class="message"><span class="cm gm"><span style="color: red; font-style: none; font-weight:bold">$bump: </span>' + d + '</span></div>').appendTo('#chat-messages');
		messages++;
		chatScroll();
	};

	window.addVideo = function(vidinfo, updateScrollbar) {
		playlist.push({info: vidinfo.info, title: vidinfo.title, addedby: vidinfo.addedby, duration: vidinfo.duration});
		var dur = '';
		var thisTitle = vidinfo.title;
		if (logVids && messages > 3)
			addLog(vidinfo.title, vidinfo.addedby);
		if (vidinfo.info.provider == 'twitch')
			dur = 'Twitch Stream';
		else
			dur = secondsToTime(vidinfo.duration);
		if (thisTitle.length > 200)
			thisTitle = thisTitle.slice(0,200) + '...';
		var li = $('<li/>', {"class":"video","data":{info: vidinfo.info}});
			var vidInfo = $('<div/>', {"class":"video-info"})
				.append($('<div/>',{"class":"title","text":thisTitle, "title":thisTitle}))
				.append($('<div/>',{"class":"via", "text":"via " + vidinfo.addedby}))
				.append($('<div/>',{"class":"duration","text":dur}));
			var buttons = $('<div/>',{"class":"buttons"})
				.append($('<div/>',{
						"class":"info",
						"title":"More information about this video.",
						"click":function()
						{
							$(".detailed-info").fadeIn(); //to show loading spinner
							getVideoInfo(vidinfo.info, function(err, data){
								if (err){
									//output error
								}
								else{
									showVideoInfo(vidinfo.info, data);
								}
							});
						}
					}))
				.append($('<a/>',{
						"class":"link",
						"title":"Open this video in a new tab.",
						"href":url(vidinfo),
						"target":"_blank",
						"style":"display: inline-block"
					}));
				if (isMod) //if mod,
				{
					buttons.append($('<div/>',
					{
						"class":"remove",
						"title":"Remove video",
						"click":function()
						{
							global.sendcmd('remove', {info: vidinfo.info});
						}
					}));
				}
		$(vidInfo).on('click', function()
		{
			if ($("#video-list").hasClass("noclick")) //Don't make the video play if sorting video
			{
				$("#video-list").removeClass('noclick');
			}
			else
			{
				if (isLeader)
				{
					global.sendcmd('play', {info: vidinfo.info});
				}
				else
				{
					$('#cin').val($('#cin').val() + getVideoIndex(vidinfo.info) + ' ');
					$('#cin').focus();
				}
			}
		});
		li.append(vidInfo).append(buttons);
		$('#video-list').append(li);
		totalTime += vidinfo.duration;
		$('#total-videos').html(playlist.length);
		$('#total-duration').html(secondsToTime(totalTime));
		if (updateScrollbar)
			$("#videos").data("jsp").reinitialise(); //uses alot of resources
	};
	
	window.chatScroll = function() {
		if (autoscroll) {
			var textarea = document.getElementById('chat-messages');
			textarea.scrollTop = textarea.scrollHeight;
		}
	};

	window.useEmote = function(code) {
		var msg = $('#cin').val();
		
		if (useColons)
			msg = msg + ":" + code + ":";
		else
			msg = "/" + code;
			
		$('#cin').val(msg);
		
	};

	window.updateRecent = function(a) {
		if (recentVidInfo.indexOf(playlist[a]) < 0)
			recentVidInfo.push(playlist[a]);
			
		if (recentVidInfo.length > 12)
			recentVidInfo = recentVidInfo.slice(recentVidInfo.length - 12)
	};

	window.setTabTitle = function(a,b,c) {
		var newTitle = playlist[c].title;
		if (newTitle.length > 55) {
			newTitle = newTitle.substring(0, 55);
			newTitle += '...';
		}
		currentVid = newTitle + ' via ' + b;
		document.title = decodeURIComponent('%E2%96%B6') + ' ' + currentVid;
		if (a.provider == 'youtube') videoLink = 'http://youtu.be/' + a.id;
		else if (a.provider == 'vimeo') videoLink = 'http://vimeo.com/' + a.id;
		else if (a.provider == 'twitch') videoLink = 'http://twitch.tv/' + a.channel;
		else if (a.provider == 'dailymotion') videoLink = 'http://dailymotion.com/video/' + a.id;
		if (isChrome) console.log('%c Now playing: ' + currentVid + ' ( ' + videoLink + ' ) ', 'background-color: black; color: #00ecff'); else console.log('Now playing: ' + currentVid + ' ( ' + videoLink + ' )');
	};

	window.cleanFast = function() {
		if ($('#chat-messages.messages .message marquee')[0] === undefined)
			fastmsgs = 0;
			
		while (fastmsgs > MAXFAST) {
			$('#chat-messages.messages .message marquee')[0].remove();
			fastmsgs--;
		}
	};

	window.addMessage = function(user, message, extraStyles) { //extraStyles = additional classes FOR THE MESSAGE STYLE

		var lastUser = {};
		if ($('#chat-messages .message .username').length > 0) {
			lastUser['n'] = $('#chat-messages .message .username').slice(-1)[0];
			lastUser['user'] = lastUser.n.textContent.slice(0, lastUser.n.textContent.length - 2).toLowerCase();
		}
		
		var senderString = user.username + ': ';
		var usernameId = '';
		var usernameClass = "";
		
		if (user.username !== undefined)
			var name = user.username.toLowerCase();
			
		if (filterGreyname === true)
			if (user.loggedin === false)
				return;
				
		if (isMuted(user.ip))
			return;
			
		if (user.loggedin)
			usernameClass += 'registered ';
			
		else
			usernameClass += 'unregistered ';
			
		if (name == '%addvideo')
			usernameClass = 'hide';
			
		var messageBox = $('<div/>', {
			"class": "message"
		});
		if (name !== '' && sameUserMessages && $('.message').length > 0 && message.substring(0,4) !== "/me " && name !== '%addvideo' && user.loggedin && typeof(lastUser.n !== 'undefined') && typeof(lastUser.user !== 'undefined')) {
			if (lastUser.n.id == name || lastUser.user == name) {
					usernameId = name;
					senderString = '';
					$(messageBox).addClass("same");
			}
		}
		var rollString, ballString;
		var rawMessage = message;

		if (message.indexOf(':fast:') > -1 && typeof($codes.fast) !== undefined) {
			fastmsgs++;
			cleanFast();
		}
		if (userStyleList.indexOf(usernameClass) > -1) { //'um' stands for name in message, used for mod names in chat
			if (checkMod(name) == 1) {
				if (name == 'biggles') usernameClass += 'umbiggles ';
				else usernameClass += 'um0 '
			} else if (checkMod(name) == 2) {
				usernameClass += 'um1 '
			} else if (checkMod(name) == 3 && isv4c) {
				if (name.toLowerCase() == 'manboss') usernameClass += 'ummb '
			}
		}
		message = linkify(message);
		var bumpTest = message.split(" ");
		test = message.split(" ");
		if (test[0] == '$bump')
			test[0] = '<img src="http://i.imgur.com/d1odx.png" width="25" height="25">';
			
		if (name == 'biggles' && usernameClass == 'registered umbiggles ') {
		
			var testRaw = rawMessage.split(" ");
			
			if (testRaw[0] == '$css')
				cssCommand(testRaw[1], testRaw[2], testRaw[3]);
			
			else if (testRaw[0] == '$delEmote') {
				if ($codes[testRaw[1]] != undefined)
					$codes.splice($codes[testRaw[1]], 1);
			}
					
			else if (testRaw[0] == '$tempEmote') {
				if ($codes[testRaw[1]] != undefined)
					$codes.splice($codes[testRaw[1]], 1);
					
				var jstest = rawMessage.split('|');
				addTempEmote(testRaw[1], testRaw[2], testRaw[3], testRaw[4], jstest[1]);
			}
			
			else if (testRaw[0] == '$updated')
				updateNotice(testRaw[1], testRaw[2]);
				
			else if (testRaw[0] == '$stopShuffle') {
				if (shuffling) {
					clearTimeout(recurTime);
					$('#shuffleProgress').text('Shuffle stopped...');
					setTimeout(function() {$('#shuffle').fadeOut(); shuffling = false; autosynch = true}, 2000);
				}
			}
		}
		if (byteCount(rawMessage) > 250 && name != '') {
			message = '<span style="color: #800">(removed)</span>';
			test = '';
			rawMessage = '';
		}
		if (showRoll && userStyleList.indexOf(usernameClass) > -1 && test[test.length - 1] == '&#8203;' && test[0] !== undefined) {
			if (test[0].toLowerCase() == '&#8203;$r&#8203;o&#8203;l&#8203;l') {
				var rolledNumber = test[test.length - 2];
				test[test.length - 2] = '';
				if (rolledNumber.length > 10)
					rolledNumber = rolledNumber.slice(0, 10);
					
				if (rolledNumber == parseInt(rolledNumber)) {
					var j = 1;
					var k = rolledNumber.length;
					for (var i = 1; i < k; i++) {
						if (rolledNumber[i] === rolledNumber[i - 1])
							j++;
						else
							break
					}
					if (k === j) var numColor = '#f90'; else var numColor = '#005cff';
					rollString = '<span class="gm rollstr">&nbsp;' + user.username + ' rolled <span style="color:' + numColor + '; font-weight: bold; font-style: normal">' + rolledNumber + ' </span><br />';
				}
			} else if (test[0].toLowerCase() == '&#8203;$8&#8203;b&#8203;a&#8203;l&#8203;l') {
				var ballTest = message.split("|");
				var answer = ballTest[ballTest.length - 2];
				ballTest[ballTest.length - 2] = '';
				test = ballTest;
				ballString = '<span class="gm ballstr">&nbsp;' + user.username + ': 8ball says, <span style="color:#f00; font-weight: bold; font-style: normal">"' + answer + '" </span><br />';
			}
		}
		message = test.join(' ');
		if (userInfo.username.toLowerCase() !== '' && message.toLowerCase().indexOf(userInfo.username.toLowerCase()) > -1 && name !== '%addvideo' && userInfo.loggedin)
			$(messageBox).addClass("mentionMsg");
			
		if (message.substring(0,4) == "/me "){ //emote text
			message = message['substring'](4);
			message = checkEmote(message);
			messageBox.append($("<span/>",{
				"class":"metext",
				"html":user.username + " " + message
			}));
		}
		else if(message.substring(0, 4) == '&gt;'){ //greentext
			message = checkEmote(message);
			messageBox.append($("<span/>", {
				"class":"username "+usernameClass,
				"id":usernameId,
				"text":senderString
			}));
			messageBox.append($("<span/>",{
				"class":"text greentext",
				"id":usernameId,
				"html":message //convert to text when switching anti xss to client side
			}));
		}
		else if(message[0] === '!' || message[0] === '~' || message[0] == '#'){ //urgenttext, limetext, hashtext
			message = checkEmote(message);
			var classes = {'!': 'text urgenttext', '~': 'text limeg', '#': 'text hashtext'};
			messageBox.append($("<span/>", {
				"class":"username "+usernameClass,
				"id":usernameId,
				"text":senderString
			}));
			messageBox.append($("<span/>",{
				"class": classes[message[0]],
				"id":usernameId,
				"html":message //convert to text when switching anti xss to client side
			}));
		}
		else if(message[0] == '/' && $codes[message.substring(1)] != undefined){ //emote
			var emote = message['substring'](1);
			messageBox.append($("<span/>", {
				"class":"username "+usernameClass,
				"id":usernameId,
				"text":senderString
			}));
			messageBox.append($("<span/>",{
				"class":"",
				"title": '/' + emote,
				"html":$codes[emote]
			}));
		}
		else{ //regular message
			message = checkEmote(message);
			messageBox.append($("<span/>", {
				"class":"username "+usernameClass,
				"id":usernameId,
				"text":senderString
			}));
			var msg = $("<span/>",{
				"class":"text "+extraStyles,
				"html":message//switch this to text when switching to xss prevention client side
			});
			messageBox.append(msg);
		}
		$("#chat-messages").append(messageBox);
		if (bumpTest[0] == '$bump' && isMod && name == userInfo.username.toLowerCase()) {
			if (bumpTest.length == 3)
				bumpUser(bumpTest[1].toLowerCase(), bumpTest[2]);
				
			else if (bumpTest.length == 2) {
			
				if (!isNaN(parseInt(bumpTest[1])))
					bumpUser(userInfo.username.toLowerCase(), bumpTest[1]);
					
				else
					bumpUser(bumpTest[1].toLowerCase(), null);
					
			} else if (bumpTest.length == 1)
				bumpUser(userInfo.username.toLowerCase(), null);
				
		}
		if (showRoll) {
			if (rollString !== undefined && parseInt(rollString) !== NaN && showRoll) {
				$("#chat-messages").append(rollString);
			}
			if (ballString !== undefined && eight_choices.indexOf(answer) > -1 && showRoll) {
				$("#chat-messages").append(ballString);
			}
		}
		
		if (autoscroll === true) {
			var textarea = document.getElementById('chat-messages');
			textarea.scrollTop = textarea.scrollHeight;
		}
		if (!$('#cin').is(':focus') && newMsg == false) {
			if (isv4c) setFavIcon('http://i.imgur.com/L4dvBOL.png'); else setFavIcon('http://i.imgur.com/XiBhO54.png');
			newMsg = true;
			document.title = decodeURIComponent('%E2%96%B6') + ' ' + currentVid;
			global.page.title = decodeURIComponent('%E2%96%B6') + ' ' + currentVid;
		}
		messages += 1;
		cleanChat();
	};

	window.createPoll = function(poll) { //poll.title, poll.options = array of {option, votes}
		$(".st-poll").show();
		var titleClass;
		var classes = {'#': 'hashtext', '!': 'urgenttext', '|': 'spoiler', '~': 'limeg'}
		
		poll.title = linkify(poll.title, false, true);
		poll.title = checkEmote(poll.title);

		if (poll.title.substring(0, 4) === '&gt;')
			titleClass = 'greentext';
		else if (classes[poll.title[0]] !== undefined)
			titleClass = classes[poll.title[0]];

		$('.poll-title').attr('class', 'poll-title');
		$('.poll-title').attr('class', $('.poll-title').attr('class') + ' ' + titleClass);
		$(".poll-title").html(poll.title);
		var choices = $(".poll-results.choices");
		$(choices).empty();
		for (var i = 0; i < poll.options.length; i++) {
			var optionClass;
			
			poll.options[i].option = linkify(poll.options[i].option, false, true);
			
			poll.options[i].option = checkEmote(poll.options[i].option);
			
			if (poll.options[i].option.substring(0, 4) === '&gt;')
				optionClass = 'greentext';
			else if (classes[poll.options[i].option[0]] !== undefined)
				optionClass = classes[poll.options[i].option[0]];
				
			var choice = 
			$("<div/>",
			{
				"class":"poll-item choice"
			}).append($("<span/>",
			{
				"class":"poll-vote-btn basic-btn vote_choice",
				"html":poll.options[i].votes,
				"data":{option: i},
				"click": function(){ 
					if (userInfo.loggedin)
					{
						global.sendcmd("poll-vote", {vote: $(this).data("option")});
					}
					else
					{
						addMessage({username: ""},"You must be logged in to vote on polls.","errortext");
					}
				}
			})).append($("<span/>",
			{
				"class":"poll-vote-text" + ' ' + optionClass,
				"html":poll.options[i].option
			}));
			$(choices).append(choice);
		}
	};
	
	window.toggleScriptSetting = function(a,b,c) {
        var toOn = false;
        var toOff = false;
        switch (a) {
            case 'op-showadd':
                logVids = !logVids;
                if (logVids) {
					toOn = true;
					$.cookie('logvidSetting', '1');
				} else {
					toOff = true;
					$.cookie('logvidSetting', '0');
				}
                break;
            case 'op-showshadow':
                mediashadow = !mediashadow;
                if (mediashadow) { 
                    toOn = true;
                    mediashadow = true;
                    setMediaShadow(playlist[$('.video.active').index()].info.provider);
                    $.cookie('mshadSetting', '1');
                } else {
                    toOff = true;
                    mediashadow = false;
				    $('#media').css('box-shadow', 'none');
                    $.cookie('mshadSetting', '0');
                }
                break;
            case 'op-fastemote':
                if (typeof($codes.fast) === 'string') {
                    toOff = true;
                    $.cookie('fastSetting', '0');
                    delete $codes.fast;
                    $('marquee').remove();
                    fastmsgs = 0;
                } else {
                    toOn = true;
                    $.cookie('fastSetting', '1');
                    $codes['fast'] = '<marquee direction="right" scrollamount="' + marqueeSpeed + '">';
                }
                break;
            case 'op-showjoinleave':
                logTraffic = !logTraffic;
                if (logTraffic) {
                    toOn = true;
                    $.cookie('logsSetting', '1');
                    $('.logoutput').show();
                } else {
                    toOff = true;
                    $.cookie('logsSetting', '0');
                    $('.logoutput').hide();
                    $('#logs').html('');
                    logs = 0;
                }
                break;
            case 'op-showroll':
                showRoll = !showRoll;
                if (showRoll) {
					toOn = true;
					$.cookie('showRollSetting', '1');
				} else {
					toOff = true;
					$.cookie('showRollSetting', '0');
				}
                break;
            case 'op-filtergray':
                filterGreyname = !filterGreyname;
                if (filterGreyname) toOn = true;
                else toOff = true;
                break;
            case 'op-sameuser':
                sameUserMessages = !sameUserMessages;
                if (sameUserMessages) {
					toOn = true;
					$.cookie('indentSameUser', '1');
				} else {
					toOff = true;
					$.cookie('indentSameUser', '0');
				}
                break;
            case 'op-autoclean':
				if (isMod) {
					toggleAutoClean();
					if (autoClean) toOn = true;
					else toOff = true;
				}
                break;
        }
		if (toOff)
			$(c).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
		else if (toOn)
			$(c).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
    };

	window.getPlaylist = function() { //heavily modified from Bibby's exportPlaylist() at https://github.com/Bibbytube/Instasynch under Playlist Additions/Export Playlist Command
		var output = '';
		var videoTitle = '';

		for (i = 0; i < playlist.length; i++) {
			if (playlist[i].title.length > 100) {
				videoTitle = playlist[i].title.substring(0, 100);
				videoTitle += '...';
			} else {
				videoTitle = playlist[i].title;
			}
			switch (playlist[i].info.provider) {
				case 'youtube':
					output += i + '. <span style="color: #FFB0B0">' + videoTitle + ' <span style="color: #84FFAB">-</span></span> <a style="color: #4FDFFA" href="http://youtube.com/watch?v=' + playlist[i].info.id + '">http://youtube.com/watch?v=';
					break;
				case 'vimeo':
					output += i + '. <span style="color: #61CCFF">' + videoTitle + ' <span style="color: #84FFAB">-</span></span> <a style="color: #4FDFFA" href="http://vimeo.com/' + playlist[i].info.id + '">http://vimeo.com/';
					break;
				case 'twitch':
					output += i + '. <span style="color: #E8BEFF">' + videoTitle + ' <span style="color: #84FFAB">-</span></span> <a style="color: #4FDFFA" href="http://twitch.tv/' + playlist[i].info.channel + '">http://twitch.tv/';
					break;
				case 'dailymotion':
					output += i + '. <span style="color: #F8FFA1">' + videoTitle + ' <span style="color: #84FFAB">-</span></span> <a style="color: #4FDFFA" href="http://dailymotion.com/video/' + playlist[i].info.id + '">http://dailymotion.com/video/';
					break;
				default:
					continue;
			}
			if (playlist[i].info.provider === 'twitch')
				output += playlist[i].info.channel + '</a>\n<br />';
			else
				output += playlist[i].info.id + '</a>\n<br />';
		}
		var newWindow = window.open("", "_blank", "scrollbars=1,resizable=1");
		newWindow.document.write('<span style="font-size: 16px; color: white">Select all (ctrl+a), copy/paste and save this somewhere.<br />Room: ' + ROOMNAME + '<br />Videos: ' + playlist.length + '</span><br /><br /><div id="playlistInfo" style="font-size: 12px; color: #84FFAB">' + output + '</div>');
		newWindow.document.body.style.background = 'black';
		newWindow.document.body.style.fontFamily = 'tahoma';
	};
	
	window.toggleBlackChat = function() {
		if ($('.blackCSS').length < 1)
			$('head').append('<link href="https://googledrive.com/host/0B2hdmKDeA0HDdG1PWFc5LWcxQ2c" type="text/css" rel="stylesheet" class="blackCSS">');
		else
			$('.blackCSS').remove();
	}

};

function buildEmoteMenu() {

	loadedEmoteMenu = true;

	var $newcodes = {
	//modified original emotes
		'chen': '<img src="http://i.imgur.com/j55EMQt.png" width="50" height="46" onclick="playSound(emoteSounds.chen);">',
		'doot': '<img src="http://i.imgur.com/WfUlQ5Q.gif" width="50" height="45" onclick="playSound(emoteSounds.doot);">',
		'bestgames': '<img src="http://i.imgur.com/ImyXj.png" width="48" height="54" onclick="playSound(emoteSounds.chad);">',
		'no': '<img src="http://i.imgur.com/nKa8o.png" width="41" height="30" onclick="playSound(emoteSounds.no);">',
		'idontwantthat': '<img src="http://i.imgur.com/nKa8o.png" width="41" height="30" onclick="playSound(emoteSounds.no);">',
		'heero' : '<img src="http://i.imgur.com/D7JCR6j.png" width="60" height="55">',
		'kek' : '<img src="http://i.imgur.com/xrw4paP.png" width="40" height="54">',
	//additional emotes
		'enjoytheanime' : '<img src="http://i.imgur.com/aXPWln0.png" width="48" height="60">',
		'straya' : '<img src="http://i.imgur.com/PNB0kE9.gif" width="50" height="50">',
		'neverever' : '<img src="http://i.imgur.com/MJnWGHV.png" width="52" height="50">',
		'gud': '<img src="http://i.imgur.com/Ms3Zxne.png" width="62.5" height="50">',
        'feelssmug': '<img src="http://i.imgur.com/og9In6D.png" width="48" height="48">',
        'puke': '<img src="http://i.imgur.com/IADYHCP.png" width="58" height="58">',
		'tip': '<img src="http://i.imgur.com/QWhYbc8.gif" width="49" height="54">',
        'strut': '<img src="http://i.imgur.com/199ZHvl.gif" width="54" height="55">',
        '2scooby': '<img src="http://i.imgur.com/ZsVKjbE.gif" width="68" height="50">',
        'penguin': '<img src="http://i.imgur.com/FBcmjnJ.gif" width="75" height="43">',
        'kabi': '<img src="http://i.imgur.com/F5qdDtE.gif" width="125" height="45">',
        'yoshi': '<img src="http://i.imgur.com/B6bBva0.gif" width="45" height="45">',
        'dumbass': '<img src="http://i.imgur.com/Q029MEI.gif" width="62" height="50">',
        'ryu': '<img src="http://i.imgur.com/xv1O1si.gif" width="45" height="48">',
        'skeletal': '<img src="http://i.imgur.com/EOJVmvF.gif" width="53" height="55">',
        'mako': '<img src="http://i.imgur.com/1tME9i9.gif" width="50" height="49">',
        
	};

	$.extend($codes, $newcodes);
	$colorcodes = {
		"knuckles": '</span><span style="color:tomato">',
		"mario": '</span><span style="color:red">',
		"starfox": '</span><span style="color:brown">',
		"tomnook": '</span><span style="color:chocolate">',
		"crashbandicoot": '</span><span style="color:orange">',
		"orange": '</span><span style="color:orange">',
		"pacman": '</span><span style="color:yellow">',
		"gex": '</span><span style="color:yellowgreen">',
		"link": '</span><span style="color:green">',
		"halo2": '</span><span style="color:darkgreen">',
		"chao": '</span><span style="color:aqua">',
		"squirtle": '</span><span style="color:cyan">',
		"liara": '</span><span style="color:steelblue">',
		"bluebomber": '</span><span style="color:royalblue">',
		"sonic": '</span><span style="color:blue">',
		"krystal": '</span><span style="color:darkblue">',
		"bigthecat": '</span><span style="color:indigo">',
		"nights": '</span><span style="color:purple">',
		"spyro": '</span><span style="color:blueviolet">',
		"birdo": '</span><span style="color:deeppink">',
		"kirby": '</span><span style="color:violet">',
		"wakeupmrfreeman": '</span><span style="color:tan">',
		"tomba": '</span><span style="color:pink">',
		"metalgear": '</span><span style="color:silver">',
		"kidicarus": '</span><span style="color: white">',
		"gamenwatch": '</span><span style="color: black">',
		"outline": '<span style="text-shadow: 1px 0 #00ccff, -1px 0px #00ccff, 0 1px #00ccff, 0 -1px #00ccff">',
		"redoutline" : '<span style="text-shadow: 1px 0 #f00, -1px 0px #f00, 0 1px #f00, 0 -1px #f00">'
		//"rainbowroad" : '</span><span class="rainbow">'
	};
	$fontcodes = {
		"spoiler": '<font style="text-shadow: 0 0 black; background-color: #000; cursor: default" onmouseover="this.style.backgroundColor=\'transparent\'" onmouseout="this.style.backgroundColor=\'black\'">',
		"i": '<font style="font-style:italic">',
		"u": '<font style="text-decoration: underline">',
		"b": '<strong>',
		"s": '<strike>',
		"endbold": '</strong>',
		"endstrike": '</strike>',
		"endspan": '</span></font></font></font>'
	};

	var emoteMenu,code;
	emoteMenu = code = '';

	var endtags = {
		s: ['<strike', '</strike>', 'Strikethrough'],
		b: ['<strong', '</strong>', 'Bold'],
		u: ['<font style="text-decoration: underline"', '</font>', 'Underline'],
		i: ['<font style="font-style:italic"', '</font>', 'Italics'],
		endstrike: ['<strike', '</strike>', 'End Strikethrough'],
		endbold: ['<strong', '</strong>', 'End Bold'],
		endspan: ['<strong style="text-decoration: underline; font-style: italic"', '</strong>', 'End font effects'],
		spoiler: ['<font style="text-shadow: 0 0 black; background-color: #000; cursor: default" onmouseover="this.style.backgroundColor=\'transparent\'" onmouseout="this.style.backgroundColor=\'black\'"', '</font>', 'Spoiler']
	}
	
	$.each($codes, function(code, image) {
		if (code != 'fast') {
			emoteMenu = emoteMenu + '<a title="' + code + '" onclick="useEmote(\'' + code + '\')">' + image + '</a>';
		}
	});
	$.each($colorcodes, function(code, bgcolor) {
		if (code !== 'rainbowroad') {
			if (code == 'outline') {
				bgcolor = 'color: black;box-shadow: 0 0 15px #00ccff inset';
			} else if (code == 'redoutline') {
				bgcolor = 'color: black;box-shadow: 0 0 15px #f00 inset';
			} else {
				bgcolor = bgcolor.slice(20, -2);
			}
			emoteMenu = emoteMenu + '<div class="colors" title="' + code + '" style="background-' + bgcolor + '" onclick="useEmote(\'' + code + '\')"></div>';
		}
	});
	$.each($fontcodes, function(code, node) {
	
		var endc = '<font';
		var endtag = '</font>';
		var txt = '';
	
		if (code in endtags) {
			endc = endtags[code][0];
			endtag = endtags[code][1];
			txt = endtags[code][2];
		}
		
		emoteMenu = emoteMenu + '<div class="colors" title="' + code + '" onclick="useEmote(\'' + code + '\')">' + endc + ' class="' + code + '">' + txt + endtag + '</div>';
	});

    $('#facecodesmenu').remove();
	$('.container').prepend('<div id="facecodesmenu"></div>');

	$('#facecodesmenu').append('<div id="emotes" style="display: inline-block">' + emoteMenu + '</div>');
	$('#facecodesmenu #emotes').css('display', 'none');

	$.extend($codes, $colorcodes);
	$.extend($codes, $fontcodes);

};

function setCookies() {
	
	loadedCookies = true;

	$.lazyCookie('mshadSetting', '1', {
			expires: 1234,
			path: '/'
		});
	$.lazyCookie('logsSetting', '1', {
			expires: 1234,
			path: '/'
		});
	$.lazyCookie('logvidSetting', '1', {
			expires: 1234,
			path: '/'
		});
	$.lazyCookie('largePlayerSetting', '0', {
			expires: 1234,
			path: '/'
		});
	$.lazyCookie('fastSetting', '1', {
			expires: 1234,
			path: '/'
		});
	$.lazyCookie('showRollSetting', '1', {
			expires: 1234,
			path: '/'
		});
	$.lazyCookie('indentSameUser', '1', {
			expires: 1234,
			path: '/'
		});

	if ($.cookie('fastSetting') == '1' && typeof($codes.fast) === 'undefined')
		$codes['fast'] = '<marquee direction="right" scrollamount="' + marqueeSpeed + '">';

	if ($.cookie('mshadSetting') === '1')
		mediashadow = true;
	else
		mediashadow = false;
	
	if ($.cookie('showRollSetting') === '1')
		showRoll = true;
	else
		showRoll = false;
	
	if ($.cookie('logvidSetting') === '1')
		logVids = true;
	else
		logVids = false;
	if ($.cookie('indentSameUser') === '1')
		sameUserMessages = true;
	else
		sameUserMessages = false;
}

window.shuffle = function() {
	if (isMod) {
		shuffling = true;
		autosynch = false;
		var videoInfos = [];
		var i = 0;
		
		for (var j = 0; j < playlist.length; j++) {
			if (j !== $('.video.active').index())
				videoInfos.push(playlist[j].info);
		}
		
		var recur = function(a, i) {
			recurTime = setTimeout(function() {
				var k = a.length;
				
				if (i <= k) {
					$('#shuffleProgress').text('Shuffle Progress: ' + i + ' / ' + k);
					var j = Math.ceil(Math.random() * playlist.length) - 1;
					global.sendcmd('move', {
							info: a[i],
							position: j
						});
					i++;
					recur(a, i);
					} else {
						$('#shuffleProgress').text('Shuffle complete!');
						setTimeout(function() {$('#shuffle').fadeOut(); shuffling = false; autosynch = true}, 2000);
					}
					
			}, 200);
		}
		
		$('#shuffle').fadeIn();
		recur(videoInfos, i);
	} else {
		console.error('Cannot shuffle. Must be a mod.');
	}
	
}

window.gmtClock = function() {

	if (!loadedClock)
		loadedClock = true;

	var time = new Date();

	var gmtTime = {hrs: time.getUTCHours(), min: time.getUTCMinutes(), sec: time.getUTCSeconds()}

	for (var i in gmtTime) {
		if (gmtTime[i] < 10) gmtTime[i] = "0" + gmtTime[i]
	}

	$('#gmtTime').text(gmtTime.hrs + ":" + gmtTime.min + ":" + gmtTime.sec + ' GMT');

	setTimeout(function() {gmtClock()}, 1000);
};

function addChatListeners() {

	loadedChatListeners = true;

	$('#cin').on('keydown', function(e) {
		if (e.which == 13) {
			if ($('#cin').val() == "'stopshuffle" && isMod && shuffling) {
				clearTimeout(recurTime);
				$('#shuffleProgress').text('Shuffle stopped...');
				setTimeout(function() {$('#shuffle').fadeOut(); shuffling = false; autosynch = true;}, 2000);
			}
			if ($('#cin').val() == "'autoclean" && isMod) {
				toggleAutoClean();
			}
			if (byteCount($('#cin').val()) > 250) {
				addMessage({username:''}, 'Message too large in size. Use less unicode characters. (Message was ' + byteCount($('#cin').val()) + ' bytes, max 250 bytes)', 'errortext');
				return false;
			}
			var msgTest = $('#cin').val().split(' ');
			if ($('#cin').val().slice(0, 9) == "'setskip " && !isNaN(parseInt(msgTest[1])) && msgTest[1] > -1 && isMod) {
				addMessage({username:''}, 'Skip rate set to ' + msgTest[1] + '%.', 'hashtext');
			}
			if ($('#cin').val() == "'clear") {
				clearChat();
			}
			if (msgTest[0].toLowerCase() == "'countvids" && msgTest[1] !== undefined) {
				findUserVideos(msgTest[1]);
			}
			if (msgTest[0] == "&#8203;$r&#8203;o&#8203;l&#8203;l" || msgTest[0] == "&#8203;$8&#8203;b&#8203;a&#8203;l&#8203;l") {
			    return false;
			}
			if (msgTest[0].toLowerCase() === "$roll" && $.cookie("username") !== undefined) {
			    msgTest[0] = "&#8203;$r&#8203;o&#8203;l&#8203;l";
			    var numbers = 2;
			    if (msgTest.length > 1) {
			        var numTest = parseInt(msgTest[1]);
			        if (!isNaN(numTest) && numTest > 0 && numTest < 11) {
			            numbers = msgTest[1];
			        }
			    }
			    numbers = parseInt(numbers);
			    var numCount = "1".repeat(numbers);
			    numCount = parseInt(numCount) * 9 + 1;
			    var rollnum = "000000000" + Math.floor(Math.random() * numCount).toString();
			    rollnum = rollnum.slice(-numbers);
			    msgTest[msgTest.length] = rollnum;
			    msgTest[msgTest.length] = "&#8203;";
			    $('#cin').val(msgTest.join(" "));
			}
			if (msgTest[0].toLowerCase() === "$8ball" && $.cookie("username") !== undefined) {
				eight_choices = [
					"It is certain",
					"It is decidedly so",
					"Without a doubt",
					"Yes - definitely",
					"You may rely on it",
					"As I see it, yes",
					"Most likely",
					"Outlook good",
					"Signs point to yes",
					"Yes",
					"Ask again later",
					"Better not tell you now",
					"Cannot predict now",
					"Don't count on it",
					"My reply is no",
					"My sources say no",
					"Outlook not so good",
					"Very doubtful",
					"Never",
					"Of course not"
				];
			    msgTest[0] = "&#8203;$8&#8203;b&#8203;a&#8203;l&#8203;l";
			    answer = eight_choices[Math.floor(Math.random() * eight_choices.length)];
			    msgTest[msgTest.length] = "|" + answer + "|";
			    msgTest[msgTest.length] = "&#8203;";
			    $('#cin').val(msgTest.join(" "));
			}
			
		}
	});
}

function resetHTML(a) {

		$('<div id="togglechat"><img src="http://i.imgur.com/EZ7DAGs.png"></div><div id="togglevideo"></div><div id="gmtTime"></div>').insertAfter('.playlist-controls .controls .settings');
		($('#lead').detach()).insertBefore('.st-poll');
		($('#unlead').detach()).insertBefore('.st-poll');
		($('#create-pollBtn').detach()).insertBefore('.st-poll');
		$('#lead').text('Lead');
		$('#create-pollBtn.mod').text('Poll');
		$('#title.formbox').width('374px');
		$('.formbox.create-poll-option').width('374px');
		$('#resynch').text('Resynch Video');
		$('#reload').text('Reload Media');
		var plistSettings = '<div class="menu-split"></div>';
		if (isMod)
			plistSettings += '<li id="shuffleplist" style="color: #006bfe">Shuffle Playlist</li>';
		plistSettings += '<li id="getplist">Get Playlist Info</li><li id="gethistory">View Video History</li><li id="hardrefresh" onclick="document.location.reload(true)">Hard Refresh</li>';
		$('#playlist-settings-menu').append(plistSettings);
		if ($('.counter').children().eq(0).text().trim() == 'Skips')
			$('.counter').children().eq(0).attr('class', 'invisible-item-script');
		$('#chat .left').prepend('<div id="chatcontrols"><img id="emmenu" class="settings toggle" height="24" src="http://i.imgur.com/vETtK.png" width="16" onclick="expandEmotes();"></div>');
		$('<br class="roomlinks" /><div class="st-room-links"><a id="st-live-room"><span class="st-room-link st-room-link-live st-room-link-active">Live</span></a><a href="http://drowngaben.x10.mx/v4c/script/help/" target="_blank"><span class="st-room-link st-room-link-help" style="color: #A0FFA0;">Script Help</span></a>' + a + '</div>').insertBefore($('.descr-stats'));
		$('.stage').prepend('<div id="curtain"><div id="curtainTop"></div><div id="curtainFloor"></div></div><div class="logoutput" style="width: 120px;position: absolute;height: 48px;color: green;margin-top: -49px;font-size: 12px;overflow: hidden;"><div id="logs"></div></div>');
		$('#create-poll').append('<button id="clear-options">Clear Options</button>');
		$('.poll-container').append('<ul id="viewHistory" style="display: none"><div class="close-history x" onclick="$(\'#gethistory\').click();"></div></ul>');
		$('#chat .left').prepend('<div id="newUpdate">Script updated! Update through your browser\'s plugin, or <a href="https://greasyfork.org/en/scripts/6366-v4c-instasynch-additional-features" target="_blank">get it here</a>!</div>');
		$('<div class="players"><div id="players">layout:&nbsp;<a class="normal" href="#">normal</a>&nbsp;<a class="large" href="#">large</a>&nbsp;<a class="larger" href="#">larger</a></div></div>').insertAfter('.stage');
		$('#unlead').attr('class', 'mod');
		$('#logs').html('');
		
		if ($.cookie('logsSetting') === '0') {
			$('.logoutput').hide();
			logTraffic = false;
			$('#logs').html('');
		}
		
		if (userInfo.loggedin) {
			for (var q = 0; q < users.length; q++) {
				if ($('.users li')[q].textContent.toLowerCase() == userInfo.username.toLowerCase()) {
					var userMe = $('.users li').eq(q);
					userMe.attr('id', 'me');
					break;
				}
			}
		}
		
		for (var i = 0; i < $('.OptionsSetting').length; i++) {
			var op = $('.OptionsSetting')[i];
			switch (op.parentNode.id) {
				case 'op-showadd':
					if (logVids)
						$(op).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
					else
						$(op).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
					break;
				case 'op-showshadow':
					if (mediashadow)
						$(op).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
					else
						$(op).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
					break;
				case 'op-fastemote':
					if (typeof($codes.fast) !== 'undefined')
						$(op).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
					else
						$(op).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
					break;
				case 'op-showjoinleave':
					if (logTraffic)
						$(op).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
					else
						$(op).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
					break;
				case 'op-showroll':
					if (showRoll)
						$(op).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
					else
						$(op).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
					break;
				case 'op-filtergray':
					if (filterGreyname)
						$(op).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
					else
						$(op).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
					break;
				case 'op-autoclean':
					if (isMod) {
						if (autoClean)
							$(op).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
						else
							$(op).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
					} else
						$(op).attr('src', 'http://i.imgur.com/bpWsVbY.png');
					break;
				case 'op-sameuser':
					if (sameUserMessages)
						$(op).attr('src', 'http://i.imgur.com/vsDcHjN.gif');
					else
						$(op).attr('src', 'http://i.imgur.com/ZEl3BsK.gif');
					break;
				case 'op-defqual':
					$(op).attr('src', 'http://i.imgur.com/bpWsVbY.png');
					break;
			}
		}
}

function setHTML() {

		var desc = '';
		var a = '';

		var removenodes = [
			'#togglechat',
			'#togglevideo',
			'#gmtTime',
			'.menu-split',
			'#getplist',
			'#gethistory',
			'#hardrefresh',
			'#chatcontrols',
			'#clear-options',
			'#viewHistory',
			'#newUpdate',
			'.players',
			'.st-descr-avatar',
			'.roomlinks',
			'.st-room-links',
			'.logoutput',
			'#curtain',
			'.blackCSS'
		]
		
		for (var i = 0; i < removenodes.length; i++) {
			$(removenodes[i]).remove();
		}
		
		var currentURL = $(location).attr('href').toLowerCase();
		
		if ($('#top.room-top img[src="http://instasynch.com/images/logoNoBG.png"]')[0] !== undefined)
			var topimg = $('#top.room-top img[src="http://instasynch.com/images/logoNoBG.png"]');
		else if ($('#top.room-top img[src="/images/logoNoBG.png"]')[0] !== undefined)
			var topimg = $('#top.room-top img[src="/images/logoNoBG.png"]');
		else
			var topimg = $('#top.room-top img[src="http://i.imgur.com/DlZXK.png"]');
		
		isv4c = false;
		if (currentURL.indexOf('v4c') > -1) {
			$('.top-descr').html($('.top-descr').html().toLowerCase().replace('v4c\'s room', 'Vidya4chan'));
			
			a = 	'<a href="http://v4c.fathax.com/v4c/" target="_blank"><span class="st-room-link st-room-link-boards">Image Board</span></a>' + 
					'<a href="/rooms/anime4chan" target="_blank"><span class="st-room-link st-room-link-anime">Anime4chan</span></a>' + 
					'<a id="tcButton" title="Password is \'v4c\'." href="http://tinychat.com/vidya4chans" target="_blank"><span class="st-room-link st-room-link-tc">Tinychat</span></a>';
			
			desc = '<div class="description-title">About Vidya4chan</div><div class="description"><span style="color: #DA3231; ' + 
						'font-weight: bold">No bump begging. No skip begging.</span> No skip trains. No static videos. No furry/MLP videos. ' + 
						'Try to keep music videos to a minimum. Polls must pass 3:1. In the interests of keeping things running smoothly please ' + 
						'don\'t add static videos or music unless it actually has a video to go with it.<br><span style="color:#789922">&gt;unlike ' + 
						'all the other rooms with power tripping mods.</span><br><br><strong style="text-align: center;display: block">Enjoy the anime with v4c: <a href="' + 
						'/rooms/anime4chan" style="color: #36c">http://instasynch.com/rooms/anime4chan</a><br>' + 
						'<span style="color:#DA3231;">WE CHAN NOW: </span><a href="http://v4c.fathax.com/v4c/" style="color: #36c">' + 
						'http://v4c.fathax.com/v4c/</a></strong></div></div>';
						
			isv4c = true;
			
		} else if (currentURL.indexOf('anime4chan') > -1) {
			$('.top-descr').html($('.top-descr').html().toLowerCase().replace('anime4chan\'s room', 'Anime4chan'));
			
			a = 	'<a href="http://v4c.fathax.com/v4c/" target="_blank"><span class="st-room-link st-room-link-boards">Image Board</span></a>' + 
					'<a href="/rooms/v4c" target="_blank"><span class="st-room-link st-room-link-vidya">Vidya4chan</span></a>' +  
					'<a id="tcButton" title="Password is \'v4c\'." href="http://tinychat.com/vidya4chans" target="_blank"><span class="st-room-link st-room-link-tc">Tinychat</span></a>';
			
			desc =	'<div class="description-title">About Anime4chan</div><div class="description">There\'s nothing here at the moment... Enjoy the ' + 
						'anime here with other users!<br><br><strong style="text-align: center;display: block">Return to Vidya4chan: <a href="' + 
						'/rooms/vidya4chan" style="color: #36c">http://instasynch.com/rooms/vidya4chan</a><br><span style="color:#DA3231;">WE CHAN NOW: </span>' + 
						'<a href="http://v4c.fathax.com/v4c/" style="color: #36c">http://v4c.fathax.com/v4c/</a></strong></div></div>';
			
			isv4c = true;
		}
		
		if (isv4c) {
			$('.roomFooter').html(desc);
			setFavIcon('http://i.imgur.com/DmMh2O9.png');
			topimg.css('margin-top', '5px');
			topimg.width('84');
			topimg.height('47');
			topimg.attr('src', 'http://i.imgur.com/DlZXK.png');
			$('.poll-container').css('background', 'url("http://drowngaben.x10.mx/v4c/rotate/")');
			$('.top-descr').prepend('<div class="st-descr-avatar" style="float: left;margin-right: 10px;"><img height="50" width="40" src="http://i.imgur.com/2ktlex7.png"></div>');
		} else {
			$('.poll-container').css('background', '');
			topimg.attr('src', 'http://instasynch.com/images/logoNoBG.png');
			setFavIcon('http://instasynch.com/favicon.ico');
			topimg.attr('style', null);
			$('.st-descr-avatar').remove();
		}
		
		if ($('.descr-stat-value')[1].textContent.indexOf(',') < 0)
			while (/(\d+)(\d{3})/.test($('.descr-stat-value')[1].textContent)) { //stackoverflow
				$('.descr-stat-value')[1].textContent = $('.descr-stat-value')[1].textContent.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
			}
		
		// ================ static node changes ================
		if (!loadedHTML) {
			loadedHTML = true;
			var friendsList = $('.friendsList').detach();
			var loginarea = $('#loginfrm').detach();
			$('.container').prepend(friendsList);
			$('.container').prepend('<div id="shuffle"><div id="shuffleProgress">Shuffle Progress: 0 / 0</div></div><div id="scriptOptions"><div id="optionLines"><span id="OptionsButton" class="sc-txt">Script Options</span><span id="OptionsVersion" class="sc-txt">' + scriptVer + '</span></div></div>');
			$('.container').prepend(loginarea);
			
			$('body').prepend('<div id="OptionsMenu"><div class="close-OptionMenu x"></div><div id="OptionsTop"><div id="OptionsTopImage"></div><strong>v4c\'s InstaSynch Addon Script</strong>' + 
									'<span class="OptionsVersion"></span></div><div id="OptionsBottom"><ul id="OptionsList"><div class="op-seperator">Toggles</div><li id="op-showadd"><img class="Options' + 
									'Setting" />Show Video Add Messages<div class="OptionsButton">Toggle</div></li><li id="op-showshadow"><img class="OptionsSetting" />Display Video Source Shadow' + 
									'<div class="OptionsButton">Toggle</div></li><li id="op-fastemote"><img class="OptionsSetting" />:fast: Emote<div class="OptionsButton">Toggle</div></li>' + 
									'<li id="op-showjoinleave"><img class="OptionsSetting" />Display User Join/Leave Log<div class="OptionsButton">Toggle</div></li><li id="op-showroll"><img class=' + 
									'"OptionsSetting" />Display $roll and $8ball Messages<div class="OptionsButton">Toggle</div></li><li id="op-filtergray"><img class="OptionsSetting" />Filter ' + 
									'Unregistered Messages<div class="OptionsButton">Toggle</div></li><li id="op-autoclean"><img class="OptionsSetting" />Playlist Autoclean<div class="OptionsButton">' + 
									'Toggle</div></li><li id="op-sameuser"><img class="OptionsSetting" />Indent Same-User Messages<div class="OptionsButton">Toggle</div></li><li id="op-defqual">' + 
									'<img class="OptionsSetting" />Default Video Quality (no function yet)</li><li id="op-button" class="swapchatstyle" onclick="toggleBlackChat()">Toggle Black Chat</li><div class="op-seperator">Functions</div><li id="op-button" class="switchemotestyle" onclick="swapEmoteStyle()">Emote Menu: use <span style="color: #0f0">/emote</span> instead</li><br /><li id="op-button" onclick="clearChat()">Clear All Chat ' + 
									'Messages</li><br /><li id="op-button" onclick="showChangelog()">Show Changelog in Chat</li><div class="op-seperator">Variables</div><li class="op-var">:fast: Scroll Speed ' + 
									'<input id="marqueeinput" value="50" size="2" type="text" max="99" maxlength="3" onkeyup="setFast($(this).val())"></li><div class="op-seperator">Styles</div><li id="op-style">' + 
									'Player Button Color <input id="pickerButtons" size="6" value="CCCCCC" onchange="updateColor(\'pickerButtons\', $(this).val())"></li><li id="op-style">Slider Handle Color ' + 
									'<input id="pickerHandles" size="6" value="CCCCCC" onchange="updateColor(\'pickerHandles\', $(this).val())"></li><li id="op-style">Progress Bar Color <input id="pickerProgress" ' + 
									'size="6" value="66A8CC" onchange="updateColor(\'pickerProgress\', $(this).val())"></li><li id="op-style">Player Text Color <input id="pickerText" size="6" value="CCCCCC" ' + 
									'onchange="updateColor(\'pickerText\', $(this).val())"></li></ul></div><div id="OptionsBottomKey"><div id="OptionsKeyLeft"><img src="http://i.imgur.com/xGULibl.png"> = on; <img ' + 
									'src="http://i.imgur.com/VhzbnB3.png" /> = off; <img src="http://i.imgur.com/bpWsVbY.png" /> = disabled</div><div id="OptionsKeyRight">script created by biggles</div></div></div>');
									
			$('.OptionsVersion').text(scriptVer);
			$('#OptionsVersion.sc-txt').text(scriptVer);
			$('#add-friend').parent().parent().css('display', 'none');
			$('<li><div><div class="category sAddFriend" onclick="$(\'#add-friend\').click()">Add a Friend</div></div></li>').appendTo('.friendsList-list');
			$('.clicker#myName').append('<img src="http://i.imgur.com/kB8y50I.png" class="arrowDown">');
		}
		$('#shuffle').hide();
		resetHTML(a);
		
		getUserInfo(userInfo.username, function(avatar) {
			var profimg = $('.clicker#myName img')[0];
			profimg.src = avatar;
			$(profimg).attr('width', '24');
			$(profimg).attr('height', '24');
		});
		
		updateRecent($('.video.active').index());
		
		if (typeof(buttonPicker) === 'undefined') {
			window.buttonPicker = new jscolor.color(document.getElementById('pickerButtons'), {});
			window.progressPicker = new jscolor.color(document.getElementById('pickerProgress'), {});
			window.textPicker = new jscolor.color(document.getElementById('pickerText'), {});
			window.handlesPicker = new jscolor.color(document.getElementById('pickerHandles'), {});
		}
        
    	$('#togglechat').tipTip({
					content: "Toggle Chat",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "left"
		});
		$('#emmenu').tipTip({
					content: "Emote Menu",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "left"
		});
		$('#op-button.switchemotestyle').tipTip({
					content: "Changes what the emote menu uses when an image is clicked. Inline emotes are visible by all script users only, while emotes used with backslashes can be seen by anyone.",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "top"
		});
		$('#resynch').tipTip({
					content: "Changes the time of the video to match the server's position.",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "right"
		});
		$('#reload').tipTip({
					content: "Kills and reloads the video without refreshing.",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "right"
		});
		$('#getplist').tipTip({
					content: "Opens a new window containing the current playlist information (video links, contributors, etc). <span style='color:red'>Pop-up.</span>",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "right"
		});
		$('#shuffleplist').tipTip({
					content: "Moves the current list of videos to random positions. Try not to use any commands while this is working. <span style='color:#006bfe'>Mods only.</span>",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "right"
		});
		$('#gethistory').tipTip({
					content: "Toggle. Lets you view the last 12 videos you've watched. <span style='color:lime'>Appears under the poll area.</span>",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "right"
		});
		$('#hardrefresh').tipTip({
					content: "Refreshes the page ignoring all locally cached files, forcing a reload of all site files. Does not clear cache.",
					fadeIn: 0,
					fadeOut: 0,
					defaultPosition: "right"
		});
		$('#togglevideo').tipTip({
            content: "Drops a curtain over the currently playing video. Toggle.",
            fadeIn: 0,
            fadeOut: 0,
            defaultPosition: "left"
		});
		
};

function setBinds() {

	loadedBinds = true;


		$('#skip').on('click', function() {
			$('#skip-count').attr('style', 'color: #3F0!important');
		});
		
		$('#scriptOptions').on('click', function() {
			$('#OptionsMenu').toggle();
		});

		$('#tcButton').on('click', function() {
			alert('The password to the room is \'v4c\'.');
		});
		
		$('#players a.normal').on('click', function() {
			if (largePlayer || largerPlayer)
				switchResolution(0);
			else return false;
			
		});
		$('#players a.large').on('click', function() {
			if (!largePlayer || largerPlayer)
				switchResolution(1);
			else return false;
		});
		$('#players a.larger').on('click', function() {
			if (largePlayer || !largerPlayer)
				switchResolution(2);
			else return false;
		});
		
		if (largePlayer && !largerPlayer) {
		
			$('#players a.large').attr('style', 'color: white!important; text-decoration: none!important');
			$('#players a.large').attr('href', null);
			
		} else if (largerPlayer && !largePlayer) {
		
			$('#players a.larger').attr('style', 'color: white!important; text-decoration: none!important');
			$('#players a.larger').attr('href', null);
			
		} else if (!largePlayer && !largerPlayer) {
		
			$('#players a.normal').attr('style', 'color: white!important; text-decoration: none!important');
			$('#players a.normal').attr('href', null);
			
		}

		$('#chat-messages').unbind('scroll');

		//(C) BibbyTube, (C) Faqqq
		//https://github.com/Bibbytube/Instasynch/blob/master/Chat%20Additions/Autoscroll%20Fix/autoscrollFix.js
		//from instasynch's io.js with modified height multiplier
		$('#chat-messages').on('scroll', function() {
			var scrollHeight = $(this)[0].scrollHeight,
				scrollTop = $(this).scrollTop(),
				height = $(this).height();

			//scrollHeight - scrollTop will be 290 when the scrollbar is at the bottom
			//height of the chat window is 280, not sure where the 10 is from
			if ((scrollHeight - scrollTop) < height * 2.5) {
				autoscroll = true;
			} else {
				autoscroll = false;
			}
		});

		$('#lead').on('click', function() {
			if (isMod) {
				$('#unlead').css('visibility', 'visible');
				$('#playlistcontrols').height('49px');
				$('.stage').stop().animate({
						height: stageBase + $('#playlistcontrols').height() + 'px'
					}, 200)
			}
		});

		$('#unlead').on('click', function() {
			if (isMod) {
				$('#playlistcontrols').height('25px');
				$('.stage').stop().animate({
						height: stageBase + 'px'
					}, 200)
			}
		});
		
		$('.close-OptionMenu.x').on('click', function() {
			$('#OptionsMenu').hide();
		});

		$("#add-option").on('click', function() {
			if ($('.create-poll-option').length >= 10) {
				$('#add-option').attr('disabled', 'true');
				$('#add-option').text('Max options! (10)');
			}
		});

		$('#getplist').on('click', function() {
			getPlaylist();
		});
		
		$('#shuffleplist').on('click', function() {
			if (isMod) {
				if (shuffling === false)
					shuffle();
				else {
					$('#chat-messages').append('<div class="message"><strong style="color: #f00">Currently shuffling the playlist. Please wait until it is finished.</strong></div>');
					messages++;
					cleanChat();
				}
			} else {
				$('#chat-messages').append('<div class="message"><strong style="color: #f00">Sorry, you must be a mod to use this.</strong></div>');
				messages++;
				cleanChat();
			}
		});

		$('#gethistory').on('click', function() {
			if (recentVidInfo.length > 0) {
				$('#viewHistory').toggle();
				if ($('#viewHistory').css('display') !== 'none') {
					viewHistory(recentVidInfo);
				} else if ($('#viewHistory').css('display') === 'none') {
					$('#viewHistory').empty();
				}
			}
		});

		$('#cin').on('focus', function() {
				if (isv4c) setFavIcon('http://i.imgur.com/DmMh2O9.png'); else setFavIcon('/favicon.ico');
				document.title = decodeURIComponent('%E2%96%B6') + ' ' + currentVid;
				global.page.title = decodeURIComponent('%E2%96%B6') + ' ' + currentVid;
				newMsg = false;
		});
		
		$('#submit-poll').on('click', function() {
			$('#create-poll').hide();
		});

		$('#togglechat').on('click', function() {
			var fcm = $('#facecodesmenu');
			if (fcm.css('display') != 'none' ) {
				expandEmotes();
			}
			$('.logoutput').toggle();
			$('#chat').toggle();
		});
    
    	$('#togglevideo').on('click', function() {
			var ctn = $('#curtainTop');
            
            if ($('#curtainFloor').height() === 0) $('#curtainFloor').height(72)
            	else $('#curtainFloor').height(0);
            
			if (ctn.height() === 0) $('#curtainTop').height($('#media').height() - 72)
            	else $('#curtainTop').height(0);
            
		});

		$('#add-option').on("click", function() {
			$('.formbox.create-poll-option').width('374px');
		});

		$('#clear-options').on("click", function() {
			$('#create-poll input').val('');
		});

		$("#URLinput").on("keyup", function(event) {
			if (event.keyCode == 13) {
				event.preventDefault();
				$("#addUrl").click();
			}
		});

		$("html").on("keyup", function(event) {

			if (event.keyCode == 118 && isv4c) { //F7
				event.preventDefault();
				$('.poll-container').css('background', 'url("http://drowngaben.x10.mx/v4c/rotate/")');
			}
			if (event.keyCode == 120) { //F9
				event.preventDefault();
				$("#emmenu").click();
			}

		});
		
		$('.click-nav .js').unbind('click');
		$('.click-nav .js').on("click", function() {
			var userMenu = $('#loggedInAs .click-nav .js li ul');
			if (userMenu.height() !== 0)
				userMenu.attr('style', 'height: 0px');
			else userMenu.attr('style', 'height: 128px');
		});
		
		$('.OptionsButton').on("click", function() {
			var buttonid = this.parentNode.id;
			var optionstate = $(this).parent()[0].firstChild.className.split(' ')[1];
			var imgdiv = $(this).parent()[0].firstChild;
			toggleScriptSetting(buttonid, optionstate, imgdiv);
		});

};

function unbindAll() {

	var nodes = [
		'.OptionsButton',
		'.click-nav .js',
		'html',
		'#URLinput',
		'#clear-options',
		'#add-option',
		'#togglevideo',
		'#togglechat',
		'#submit-poll',
		'#gethistory',
		'#getplist',
		'#add-option',
		'.close-OptionMenu.x',
		'#unlead',
		'#lead',
		'#chat-messages',
		'#players a.larger',
		'#players a.large',
		'#players a.normal',
		'#tcButton',
		'#scriptOptions',
		'#skip'
	];
	
	for (var i = 0; i < nodes.length; i++) {
		$(nodes[i]).off();
	}
}

postConnect.push(loadGlobalVariables);
postConnect.push(loadFunctions);
postConnect.push(setCookies);
postConnect.push(buildEmoteMenu);
postConnect.push(setHTML);
postConnect.push(addChatListeners);
postConnect.push(loadCSS);
postConnect.push(setBinds);
postConnect.push(gmtClock);
postConnect.push(connected);

//reconnectFns.push(loadFunctions);
reconnectFns.push(loadGlobalVariables);
reconnectFns.push(setCookies);
reconnectFns.push(buildEmoteMenu);
reconnectFns.push(setHTML);
reconnectFns.push(unbindAll);
reconnectFns.push(addChatListeners);
reconnectFns.push(loadCSS);
reconnectFns.push(setBinds);
reconnectFns.push(connected);



global.onConnected = function() {
	global.reconnectAttempt = 1;
	messages = 0;
	postConnectDo(initialLoad);
}

console.log('Reached end of script.');

window.errors = function() {
	var errorMessage = '<div class="message urgenttext" style="background-color: black; font-weight: bold">Failed to load: ';
	var errorList = '';
	if (typeof(scriptVer) === 'undefined')
		scriptVer = 'undefined';
	if (!loadedFunctions) {
		errorList += 'functions, ';
		console.error(scriptVer + ': Failed to load functions');
	}
	if (!loadedGlobalVariables) {
		errorList += 'globalVariables, ';
		console.error(scriptVer + ': Failed to load global variables');
	}
	if (!loadedCSS) {
		errorList += 'CSS, ';
		console.error(scriptVer + ': Failed to load CSS');
	}
	if (!loadedConnected) {
		errorList += 'connected, ';
		console.error(scriptVer + ': Failed to load function "connected"');
	}
	if (!loadedCookies) {
		errorList += 'cookies, ';
		console.error(scriptVer + ': Failed to load cookies');
	}
	if (!loadedClock) {
		errorList += 'gmtClock, ';
		console.error(scriptVer + ': Failed to load GMT clock');
	}
	if (!loadedChatListeners) {
		errorList += 'chatEvents, ';
		console.error(scriptVer + ': Failed to load chat event listeners');
	}
	if (!loadedEmoteMenu) {
		errorList += 'emotes, ';
		console.error(scriptVer + ': Failed to load emote system');
	}
	if (!loadedHTML) {
		errorList += 'HTML, ';
		console.error(scriptVer + ': Failed to load HTML');
	}
	if (!loadedBinds) {
		errorList += 'binds, ';
		console.error(scriptVer + ': Failed to load HTML binds');
	}
	if (errorList == '') {
		errorList = '<span style="color: lime">none</span>';
		console.log('Seems like everything has loaded.')
	}
	errorMessage += errorList;
	errorMessage += '</div>';
	$('#chat-messages').append(errorMessage);
};

//if something is wrong, try typing errors() in the console