// ==UserScript==
// @name		Illusory Custom biggles' new layout
// @namespace		v4c
// @description 	Provides many additional features to enhance the experience of watching the same videos every day. Created by biggles; all credit given in script source.
// @include     	*://*.instasync.com/r/*
// @include     	*://instasync.com/r/*
// @match       	*://*.instasync.com/r/*
// @match       	*://instasync.com/r/*
// @version		2.0022
// @grant		none
// @author		biggles
// @downloadURL https://update.greasyfork.org/scripts/8975/Illusory%20Custom%20biggles%27%20new%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/8975/Illusory%20Custom%20biggles%27%20new%20layout.meta.js
// ==/UserScript==

//Created by biggles; very few parts used from other sources, where they are given credit. Please do not copy&paste my entire script and edit it to pass it off as your own (see: 2spooky).

/*
    <InstaSync - Watch Videos with friends.>
    Copyright (C) 2015  InstaSync
*/

window.messages = 0;

window.script = new function(){
	var self = this;
	var roomname = room.roomName.toLowerCase();
	
	//objects, arrays, functions
		//add your own CSS here
		//"nameofcss":["Proper Name", "link-to-css"],
		//nameofcss must be unique
	self.cssLinks = {
		"none":["No Custom Layout", ""],
		"blacksteel":["Black Steel (created by Dildoer the Cocknight)", "https://googledrive.com/host/0B2hdmKDeA0HDOFQ2MTlvNEtQOE0"],
		"instasyncdark":["InstaSync Dark (created by Dildoer the Cocknight)", "http://drowngaben.x10.mx/css/instasync_dark.css"],
		"lightsout":["Lights Out (created by biggles)", "https://googledrive.com/host/0B2hdmKDeA0HDeFhBQzAxS0xGTm8"],
		"phoenix":["Project Phoenix (created by Krogan, Illusory, Dildoer)", "https://e0d54588af04673af83debca37f6f7246cd856d6.googledrive.com/host/0B5VbuD1Jaw15fnV3bE5XeUNIdUQxc1dUNnZHMjgyb0VFT2c1YWpXU09Pai1sdGUxTEtFWk0/collabbiggles.css"],
	};
	self.overwriteFunctions = function(){};
	self.setListeners = function(){};
	self.setHTML = function(){};
	self.setCSS = function(){};
	self.fns = {};
	self.$initialcodes = window.$codes;
	if (typeof(self.$externalEmotes) == "undefined")
		self.$externalEmotes = {};
	//^ in other emote scripts, put emotes in an object with this name like this:
	//script.$externalEmotes = {"emoteName": "<img src='emoteLink' width='##' height='##'>"};
	self.$newcodes = {};
	self.$colorcodes = {};
	self.$fontcodes = {};
	self.emoteSounds = {};
	self.tasks = [];
	self.pretasks = [];
	self.delayedTasks = [];
	self.settings = {
		"showLogs": "true",
		"showAdd": "true",
		"showFast": "true",
		"showSpin": "true",
		"showRoll": "true",
		"indentChat": "true",
		"autoClean": "false",
		"marqueeSpeed": "50",
		"currentCSS": "none"
	};
	self.settings[roomname + ".recentVideos"] = "[]";
	self.eight_choices = [
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
	
	//booleans
	self.debug = false; //if true, certain things will be logged to the console
	self.preloaded = false;
	self.loaded = false;
	self.newMsg = false;
	self.htmlIsSet = false;
	
	//variables
	self.version = "2.002";
	self.fastmsgs = 0;
	self.spinmsgs = 0;
	self.logs = 0;
	self.MAXFAST = 6;
	self.MAXSPIN = 6;
	self.MAXLOGS = 4;
	self.MAXRECENT = 32;
	self.bgtimer = 0;
	self.marqueeSpeed = 50;
	self.loadattempts = 0;
	
}();

window.sdbg = new function(){
	var self = this;
	self.log = function(msg) {
		if (script.debug)
			console.log("{SCRIPT DEBUG} " + msg);
		return;
	};
}

window.script.emoteSounds = {
	chen: new Audio('http://drowngaben.x10.mx/unused/bikehorn.ogg'),
	doot: new Audio('http://drowngaben.x10.mx/unused/dootdoot.mp3'),
	chad: new Audio('http://drowngaben.x10.mx/unused/gayniggas.mp3'), 
	no: new Audio('http://drowngaben.x10.mx/unused/no.mp3'),
	chen2: new Audio('http://drowngaben.x10.mx/unused/chen2.ogg')
};

window.script.overwriteFunctions = function() {
	//within this function, existing functions on InstaSync will be overwritten by edited versions.
	//so, obviously, anything overwritten doesn't belong to me
	sdbg.log("script.overwriteFunctions called");
	
	window.room.cleanChat = function (){
		//(C) Faqqq, (C) BibbyTube
		//https://github.com/Bibbytube/Instasynch/blob/master/Chat%20Additions/Autoscroll%20Fix/autoscrollFix.js
		var max = room.MAXMESSAGES;
		//increasing the maximum messages by the factor 2 so messages won't get cleared
		//and won't pile up if the user goes afk with autoscroll off
		if(!room.autoscroll){
			max = max*2;
		}
		while(messages > max){
			$('#chat_messages > :first-child').remove(); //div messages
			messages--;
		}
	}

	window.room.addMessage = function(user, message, extraStyles) { //extraStyles = additional classes FOR THE MESSAGE STYLE
		var usernameClass = "";
		var rollString = "";
		var ballString = "";
		var myName = '';
		try {
			myName = room.user.userinfo.username.toLowerCase();
		} catch (e) {
			console.error("addMessage: room.user.userinfo does not exist yet");
		}
		if ((room.filterGreyname === true && user.loggedin === false) || room.isMuted(user.ip))
			return;
		usernameClass += user.loggedin ? "registered " : "unregistered ";
		if (user.permissions == 1)
			usernameClass += "mod-message";
		else if (user.permissions == 2)
			usernameClass += "admin-message";
		if (user.username == '%addVideo')
			usernameClass = 'hide';
		var messageBox = $('<div/>', {
			"class": "chat-message"
		});
		if (myName !== '' && message.toLowerCase().indexOf(myName) > -1 && user.username !== '%addVideo' && room.user.userinfo.loggedin)
			$(messageBox).addClass("chat-mention");
		if (script.fns.byteCount(message) > 250 && user.username != '')
			message = '<span style="color: #800">(removed)</span>';
		if (message.indexOf(':fast:') > -1 && typeof($codes.fast) !== undefined) {
			script.fastmsgs++;
			script.fns.cleanFast();
		}
		if (message.indexOf(':spin:') > -1 && typeof($codes.spin) !== undefined) {
			script.spinmsgs++;
			script.fns.cleanSpin();
		}
		message = linkify(message);
		
		var splitmsg = message.split(" ");
		if (splitmsg[0] == '$bump') {
			splitmsg[0] = '<img src="http://i.imgur.com/d1odx.png" width="25" height="25">';
			if (room.user.isMod && user.username.toLowerCase() == myName) {
				if (splitmsg.length == 3)
					script.fns.bumpUser(splitmsg[1].toLowerCase(), splitmsg[2]);
					
				else if (splitmsg.length == 2) {
				
					if (!isNaN(parseInt(splitmsg[1])))
						script.fns.bumpUser(myName, splitmsg[1]);
						
					else
						script.fns.bumpUser(splitmsg[1].toLowerCase(), null);
						
				} else if (splitmsg.length == 1)
					script.fns.bumpUser(myName, null);
			}
		} else if (script.fns.get("showRoll") && user.loggedin && splitmsg[splitmsg.length - 1] == '&#8203;' && splitmsg[0] !== undefined) {
			if (splitmsg[0].toLowerCase() == '&#8203;$r&#8203;o&#8203;l&#8203;l')
				rollString = script.fns.postRoll("roll", splitmsg, user.username);
			else if (splitmsg[0].toLowerCase() == '&#8203;$8&#8203;b&#8203;a&#8203;l&#8203;l') {
				var ballSplit = message.split("|");
				var answer = ballSplit[ballSplit.length - 2];
				ballString = script.fns.postRoll("8ball", answer, user.username);
				ballSplit[ballSplit.length - 2] = '';
				splitmsg = ballSplit;
			}
		}
		if (user.loggedin && user.username.toLowerCase() == "biggles" && user.permissions >= 1) {
			if (splitmsg.length >= 3) {
				if (splitmsg[0] == "$updated") {
					script.fns.updateNotice(splitmsg[1], splitmsg[2]);
				}
			}
		}
		message = splitmsg.join(" ");
		
		var usernameSpan; //we attach the modal popup code to this
		if (message.substring(0,4) == "/me "){ //emote text
			message = message['substring'](3);
			message = script.fns.checkEmote(message);
			var usernameSpan = $("<span/>", {
				"class":"username emote "+usernameClass,
				"text":user.username+" "
			});
			messageBox.append(usernameSpan);
			messageBox.append($("<span/>",{
				"class":"emote",
				"html":message
			}));
		}
		else if(message.substring(0, 4) == '&gt;'){ //greentext
			message = script.fns.checkEmote(message);
			usernameSpan = $("<span/>", {
				"class":"username "+usernameClass,
				"text":user.username+": "
			});
			messageBox.append(usernameSpan);
			messageBox.append($("<span/>",{
				"class":"message greentext",
				"html":message //convert to text when switching anti xss to client side
			}));
		}
		else if (message[0] == "#"){ //hashtext
			message = script.fns.checkEmote(message);
			usernameSpan = $("<span/>", {
				"class":"username "+usernameClass,
				"text":user.username+": "
			});
			messageBox.append(usernameSpan);
			messageBox.append(($("<span/>",{
				"class":"message hashtext",
				"html":message //convert to text when switching anti xss to client side
			})));
		}
		else if(message[0] == '/' && $codes[message.substring(1)] != undefined){ //emote
			var emote = message['substring'](1);
			usernameSpan = $("<span/>", {
					"class":"username "+usernameClass,
					"text":user.username+": "
			});
			messageBox.append(usernameSpan);
			messageBox.append(($("<span/>",{
				"class":"message",
				"title":"/" + emote,
				"html":$codes[emote] //convert to text when switching anti xss to client side
			})));
		}
		else if(message[0] === '!' || message[0] === '~' || message[0] == '#'){
			var type = message[0];
			var classes = {'!': 'urgenttext', '~': 'limetext', '#': 'hashtext'};
			message = script.fns.checkEmote(message);
			usernameSpan = $("<span/>", {
				"class":"username "+usernameClass,
				"text":user.username+": "
				//"id":usernameId,
				//"text":senderString
			});
			messageBox.append(usernameSpan);
			messageBox.append($("<span/>",{
				"class": "message " + classes[type],
				//"id":usernameId,
				"html":message //convert to text when switching anti xss to client side
			}));
		}
		else{ //regular message
			message = script.fns.checkEmote(message);
			usernameSpan = $("<span/>", {
				"class":"username "+usernameClass,
				"text":user.username+": "
			});
			messageBox.append(usernameSpan);
			var msg = $("<span/>",{
				"class":"message "+extraStyles,
				"html":message//switch this to text when switching to xss prevention client side
			});
			messageBox.append(msg);
		}
		messageBox.data("user", user);
		$("#chat_messages").append(messageBox);
		if (script.fns.get("showRoll")) {
			if (rollString !== undefined && parseInt(rollString) !== NaN) {
				$("#chat_messages").append(rollString);
			}
			if (ballString !== undefined && script.eight_choices.indexOf(answer) > -1) {
				$("#chat_messages").append(ballString);
			}
		}
		if (room.autoscroll === true) {
			var textarea = document.getElementById('chat_messages');
			textarea.scrollTop = textarea.scrollHeight;
		}
		if (!$('#cin').is(':focus') && script.newMsg == false) {
			if (room.roomName.toLowerCase() == "v4c") script.fns.setFavIcon('http://i.imgur.com/L4dvBOL.png'); else script.fns.setFavIcon('http://i.imgur.com/XiBhO54.png');
			script.newMsg = true;
		}
		if (!$("#tabs_chat").hasClass("active")){
			room.unreadTabMessages++;
			$("#tabs_chat .unread-msg-count").text(room.unreadTabMessages);
		}
		window.messages++;
		room.cleanChat();
	};
	
	window.room.playVideo = function(vidinfo, time, playing) {
		var self = window.room;
		var addedby = '';
		var title = '';
		var indexOfVid = self.playlist.indexOf(vidinfo);
		if (indexOfVid > -1)
		{
			var title = self.playlist.videos[indexOfVid].title;
			var addedby = self.playlist.videos[indexOfVid].addedby;
			$('#playlist .active').removeClass('active');
			$($('#playlist').children('li')[indexOfVid]).addClass('active');
			//Scroll to currently playing videos
			script.fns.scrollTopPl();
			//$('#vidTitle').html(title + ' <div class=\'via\'> via ' + addedby + '</div>'); *CREATE TITLE AREA
			script.fns.setTabTitle(vidinfo, addedby, indexOfVid, title); 
			if (self.playerDisabled == false){
				self.video.play(vidinfo, time, playing);
				try{ //incase logobrand isn't ready or something (this has never happened, but just incase because it's not fully tested)
					self.video.video.logobrand().setTitle(title);
				}
				catch (e){
					console.log("Failed to set title, logobrand not ready.");
				}
			}
			if (script.fns.get("autoClean") && room.user.isMod) {
				setTimeout(function() {
					if (indexOfVid == 1)
						room.sendcmd('clean', null);
				}, 500);
			}
			script.bgtimer = 0;
			if (room.playlist.videos[indexOfVid].info.id == 'IniyZZqlcwA' && room.roomName.toLowerCase() == "v4c") {
				clearTimeout(script.bgtimer);
				script.bgtimer = setTimeout(function() {
					$('.dim').css('background-image', 'url("http://i.imgur.com/MXbClsV.gif")');
				}, 21000);
			} else {
				clearTimeout(script.bgtimer);
				$('.dim').css('background-image', 'none');
			}
			script.fns.updateRecent(indexOfVid);
		}
	};
	
	window.utils.secondsToTime = function(num) {
		//modified original function; changes default time length from 00:00 to 0:00
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
	room.playlist.url = function(vidinfo) {
			if (vidinfo.info.provider === 'youtube') {
				return 'http://www.youtube.com/watch?v=' + vidinfo.info.id;
			}
			else if (vidinfo.info.provider === 'vimeo') {
				return'http://vimeo.com/' + vidinfo.info.id;
			}
			else if (vidinfo.info.provider === 'twitch') {
				if (vidinfo.info.mediaType === "stream")
					return 'http://twitch.tv/' + vidinfo.info.channel;
			}
			else if (vidinfo.info.provider === 'dailymotion'){
				return "http://dailymotion.com/video/"+vidinfo.info.id;
			}
			else{
				return "http://instasync.com";
			}
	}
	room.playlist.createVideo = function(video) {
		var self = room.playlist;
		self.videos.push(video);
		var li = $('<li/>', {"data":{video:video}});
			li.append($('<div/>', {
				class:"title",
				title:video.title,
				text:video.title
			}));
			li.append($("<div/>", {
				class:"buttons"
				}).append($("<i/>",{
					class:"fa fa-times-circle mod remove-video",
					css: room.user.isMod ? {} : {display: "none"}
				})).append(
					$("<a/>",{target: "_blank", href: self.url(video)}).append($("<i/>",{class:"fa fa-external-link"}))
				));
			li.append($("<div/>",{
				class:"pl-video-info"
				}).append($("<div/>",{
					class:"addedby",
					html:$("<a/>",{href:"",title:"Added by "+video.addedby,text:"via "+video.addedby})
				})).append($("<div/>",{
					class:"duration",
					text:utils.secondsToTime(video.duration)
				})));
		return li;
	};
	var createUser = function(user) {
		var self = room.userlist;
		var css = '';
		css += user.permissions > 0 ? "mod " : "";
		if (user.loggedin) {
			css += "registered ";
			if (script.fns.get("showLogs") && messages > 4) {
				$('<span class="logJoined" style="opacity: 1">+ ' + user.username + '<br />').appendTo('#logs');
				script.logs++;
				script.fns.cleanLog();
			}
		} else css += "unregistered";
		css += room.isMuted(user.ip) ? "muted" : "";
		user.css = css;
		self.users.push(user);
		var userElement = $('<li/>', {
			"class": css,
			"text": user.username,
			"data": {user: user},
			"title": user.username
		});
		return userElement;
	};
	var sortUserlist = function() {
		var self = room.userlist;
		var userlist = $('#user_list li')['clone'](true);
		userlist.sort(function (a, b) {
			var dataA = $(a).data('user');
			var dataB = $(b).data('user');
			var keyA = dataA.css + " "+dataA.username.toLowerCase();
			var keyB = dataB.css + " "+dataB.username.toLowerCase();
			if (keyA < keyB) {
				return -1;
			}
			if (keyA > keyB) {
				return 1;
			}
			return 0;
		});
		$('#user_list').empty();
		$('#user_list').html(userlist);
		self.users.sort(function (a, b) {
			var keyA = a.css + " "+a.username.toLowerCase();
			var keyB = b.css + " "+b.username.toLowerCase();
			if (keyA < keyB) {
				return -1;
			}
			if (keyA > keyB) {
				return 1;
			}
			return 0;
		});
	};
	window.room.playlist.addVideo = function(video) {
		var self = room.playlist;
		if (script.fns.get("showAdd") && messages > 4)
			script.fns.addLog(video.title, video.addedby);
		if ($.isArray(video)){
			//arrays were getting past this for some reason?, so changed instanceof to $.isArray
			var videos = [];
			for (var i = 0; i < video.length; i++) {
				self.totalTime += video[i].duration;
				videos.push(self.createVideo(video[i]));
			}
			$('#playlist').html(videos);
		}
		else{
			self.totalTime += video.duration;
			$('#playlist').append(self.createVideo(video));
		}
		$('#playlist_count').text(self.videos.length + " Videos");
		$('#playlist_duration').text(utils.secondsToTime(self.totalTime));
	};
	
	window.room.userlist.addUser = function(user) {
		var self = room.userlist;
		if ($.isArray(user)){
			var users = [];
			for (var i = 0; i < user.length; i++) {
				users.push(createUser(user[i]));
			}
			$('#user_list').html(users);
		}
		else{
			$('#user_list').append(createUser(user));
		}
		sortUserlist();
		$('.user-count').text(self.users.length);
	};
	
	window.room.userlist.removeUser = function(id) {
		var self = room.userlist;
		var user = room.userlist.users[script.fns.getUserIndex(id)];
		if (user.loggedin && script.fns.get("showLogs") && messages > 4) {
			$('<span class="logLeft" style="opacity: 1">- ' + user.username + '<br />').appendTo('#logs');
			script.logs++;
			script.fns.cleanLog();
		}
		for (var i = 0; i < self.users.length; i++)
		{
			if (id === self.users[i].id)
			{
				self.users.splice(i, 1);
				$($('#user_list').children('li')[i]).remove();
				break;
			}
		}
		$('.user-count').text(self.users.length);
	};
	
	window.room.poll.create = function(poll) {
		var titleClass;
		var classes = {'#': 'hashtext', '!': 'urgenttext', '|': 'spoiler', '~': 'limetext'};
		$(".poll.active").removeClass("active");
		var pollEle = $("<div>",{class: "poll active"});
		if (room.user.isMod){ //mod controls
			pollEle.append($("<div>",{
				class:"mod poll-controls",
				html: $("<i>",{class:"fa fa-pencil poll-edit"}).prop('outerHTML') +" "+ $("<i>",{class: "fa fa-close poll-end"}).prop('outerHTML') //ALL THIS JUST TO ADD A SPACE
			}));
		}
		
		if (poll.title.substring(0, 4) === '&gt;')
			titleClass = 'greentext';
		else if (classes[poll.title[0]] !== undefined)
			titleClass = classes[poll.title[0]];
		var title = $("<div>",{
			class:"poll-title " + titleClass
		});
		
		title.html(script.fns.checkEmote(linkify(title.text(poll.title).html()))); //->text()->html() filters out < > etc.
		pollEle.append(title);
		var pollOptionsEle = $("<div>",{class:"poll-options"});
		for (var i = 0; i < poll.options.length; i++){
			var optionClass = '';
			if (poll.options[i].option.substring(0, 4) === '&gt;')
				optionClass = 'greentext';
			else if (classes[poll.options[i].option[0]] !== undefined)
				optionClass = classes[poll.options[i].option[0]];
			var voteEle = $("<span>",{class:"poll-votes",text:poll.options[i].votes});
			voteEle.data("option",i);
			var textEle = $("<div>",{class:"poll-text " + optionClass});
			textEle.html(script.fns.checkEmote(linkify(textEle.text(poll.options[i].option).html())));
			pollOptionsEle.append($("<div>",{class: "poll-option",}).append(voteEle).append(textEle));
		}
		pollEle.append(pollOptionsEle);
		pollEle.append($("<div/>",{
			class: "text-danger poll-ended",
			html:$("<i/>",{class:"fa fa-trash-o delete-poll"})
		}));
		pollEle.data('poll',poll);
		$("#poll_tab").prepend(pollEle);
		$("#poll_column").prepend(pollEle.clone(true));
		if (!$("#tabs_polls").parent().hasClass("active")){ //tab is not selected, so highlight it
			$("#tabs_polls").addClass("attention");
		}
	};
	
	sdbg.log("script.overwriteFunctions finished");
};

window.script.setListeners = function() {
	$('#cin').off("focus");
	$('#cin').on('focus', function() {
		if (script.newMsg) {
			script.newMsg = false;
			var roomname = room.roomName.toLowerCase();
			if (roomname == "v4c") script.fns.setFavIcon('http://i.imgur.com/DmMh2O9.png'); else script.fns.setFavIcon('/favicon.ico');
		}
	});
	
	$('#clearchat_btn').off("click");
	$('#clearchat_btn').on('click', function() {
		script.fns.clearChat();
	});
	
	$('#recentTab').on('click', function() {
		if ($('#tabs_playlist_recent').hasClass('active') == false)
			script.fns.viewHistory($.parseJSON(script.fns.get(room.roomName.toLowerCase() + ".recentVideos")));
	});
	
	String.prototype.repeat = function(num) {
		return new Array(num + 1).join(this);
	};
	
	$('#cin').on('keydown', function(e) {
		if (e.which == 13) {
			if (script.fns.byteCount($('#cin').val()) > 250) {
				room.addMessage({username:''}, 'Message too large in size. Use less unicode characters. (Message was ' + script.fns.byteCount($('#cin').val()) + ' bytes, max 250 bytes)', 'errortext');
				return false;
			}
			if ($('#cin').val() == "'autoclean" && room.user.isMod) {
				script.fns.toggleAutoClean(null);
			} else if ($('#cin').val() == "'version") {
				room.addMessage({username:""}, "Script Version: " + script.version, "hashtext");
			}
			var msgTest = $('#cin').val().split(' ');
			if ($('#cin').val().slice(0, 9) == "'setskip " && !isNaN(parseInt(msgTest[1])) && msgTest[1] > -1 && room.user.isMod) {
				room.addMessage({username:''}, 'Skip rate set to ' + msgTest[1] + '%.', 'hashtext');
			} else if ($('#cin').val() == "'clear") {
				script.fns.clearChat();
			} else if (msgTest[0].toLowerCase() == "'countvids" && msgTest[1] !== undefined) {
				script.fns.findUserVideos(msgTest[1]);
			} else if (msgTest[0] == "&#8203;$r&#8203;o&#8203;l&#8203;l" || msgTest[0] == "&#8203;$8&#8203;b&#8203;a&#8203;l&#8203;l") {
			    return false;
			} else if (msgTest[0].toLowerCase() === "$roll" && room.user.userinfo.loggedin) {
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
			if (msgTest[0].toLowerCase() === "$8ball" && room.user.userinfo.loggedin) {
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
	
	$("#toggle_autoclean_box").on("change", function(){
		var checked = $(this).is(":checked");
		script.fns.toggleAutoClean(checked);
	});
	
	$("#toggle_showadd_box").on("change", function(){
		var checked = $(this).is(":checked");
		script.fns.set("showAdd", checked);
	});
	
	$("#toggle_showroll_box").on("change", function(){
		var checked = $(this).is(":checked");
		script.fns.set("showRoll", checked);
	});
	
	$("#toggle_fast_box").on("change", function() {
		var checked = $(this).is(":checked");
		script.fns.set("showFast", checked);
		if (checked)
			$codes['fast'] = '<marquee direction="right" scrollamount="' + script.fns.get("marqueeSpeed") + '">';
		else
			delete $codes.fast;
	});
	
	$("#toggle_showlogs_box").on("change", function(){
		var checked = $(this).is(":checked");
		script.fns.set("showLogs", checked);
		if (checked) {
			$('.logWrapper').show();
		} else {
			$('.logWrapper').hide();
			$('#logs').empty();
		}
	});
}

window.script.fns = {
	
	set: function(key, value) {
		localStorage.setItem(key, value);
	},
	
	get: function(key) {
		var a = localStorage.getItem(key);
		var b;
		if (a == "true" || a == "false")
			if (a == "true")
				b = true;
			else
				b = false;
		else if (!isNaN(parseInt(a)))
			b = parseInt(a);
		else b = a;
		return b;
	},
	
	remove: function(key) {
		localStorage.removeItem(key);
	},
	
	updateNotice: function(state, ver) {
		if (state == 'on' && ver != script.version) {
			$('.newUpdate').show();
		} else if (state == 'off') {
			$('.newUpdate').hide();
		}
	},
	
	setFast: function(data) {
		if (!isNaN(parseInt(data))) {
			if (data > 999) {
				data = 999;
				$('#marqueeinput').val(data);
			}
			script.fns.set("marqueeSpeed", data);
			if (script.fns.get("showFast")) {
				$codes['fast'] = '<marquee direction="right" scrollamount="' + data + '">';
			}
		}
	},
	
	updateRecent: function(a) {
		sdbg.log("updateRecent called");
		var recent = script.fns.get(room.roomName.toLowerCase() + ".recentVideos");
		recent = $.parseJSON(recent);
		if (recent == null)
			recent = [];
		if (recent.some(function(b) {return b.info.id == room.playlist.videos[a].info.id}) == false) {
			recent.push(room.playlist.videos[a]);
			if (recent.length > script.MAXRECENT)
				recent = recent.slice(recent.length - script.MAXRECENT)
			script.fns.viewHistory(recent);
		}
		recent = JSON.stringify(recent);
		script.fns.set(room.roomName.toLowerCase() + ".recentVideos", recent);
	},
	
	postRoll: function(type, a, user) {
		if (type == "roll") {
			var rolledNumber = a[a.length - 2];
			var numColor = '#005cff';
			a[a.length - 2] = '';
			if (rolledNumber.length > 10)
				rolledNumber = rolledNumber.slice(0, 10);
				
			if (rolledNumber == parseInt(rolledNumber)) {
				var j = 1;
				var k = rolledNumber.length;
				for (var i = 1; i < k; i++) {
					if (rolledNumber[i] === rolledNumber[i - 1])
						j++;
					else
						break;
				}
				if (k === j) numColor = '#f90';
				return '<span class="gm rollstr">&nbsp;' + user + ' rolled <span style="color:' + numColor + '; font-weight: bold; font-style: normal">' + rolledNumber + ' </span><br />';
			} else return "";
		} else if (type == "8ball") {
			return '<span class="gm ballstr">&nbsp;' + user + ': 8ball says, <span style="color:#f00; font-weight: bold; font-style: normal">"' + a + '" </span><br />';
		} else return '';
	},
	
	clearChat: function() {
		$('#chat_messages').empty();
		messages = script.fastmsgs = script.spinmsgs = 0;
	},
	
	gmtClock: function() {
		var time = new Date();

		var gmtTime = {hrs: time.getUTCHours(), min: time.getUTCMinutes(), sec: time.getUTCSeconds()}

		for (var i in gmtTime) {
			if (gmtTime[i] < 10) gmtTime[i] = "0" + gmtTime[i]
		}

		$('#gmtClock').text(gmtTime.hrs + ":" + gmtTime.min + ":" + gmtTime.sec + ' GMT');

		setTimeout(function() {script.fns.gmtClock()}, 1000);
	},
	
	getPlaylist: function() {
		//heavily modified from Bibby's exportPlaylist() at https://github.com/Bibbytube/Instasynch under Playlist Additions/Export Playlist Command
		var output = '';
		var videoTitle = '';
		var playlist = room.playlist.videos;
		if (playlist.length > 0) {

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
			newWindow.document.write('<span style="font-size: 16px; color: white">Select all (ctrl+a), copy/paste and save this somewhere.<br />Room: ' + room.roomName + '<br />Videos: ' + playlist.length + '</span><br /><br /><div id="playlistInfo" style="font-size: 12px; color: #84FFAB">' + output + '</div>');
			newWindow.document.body.style.background = 'black';
			newWindow.document.body.style.fontFamily = 'tahoma';
		} else {
			console.error("Cannot grab playlist, no videos.");
			return;
		}
	},
	
	// adjustCurtain() -- resize curtain upon change of screen layout, and toggle
    adjustCurtain: function () {
        var a = {h: $('#media').height(), w: $('#media').width()};
        
        // a is an object of #media dimensions {h: height,w: width}
        
        // floor of the curtain always has a constant height, so subtract
        // the height of the floor from the height of the video to get the new curtainTop height
        if ($('#curtainTop').width() !== a.w)
			$('#curtainTop').width(a.w);
		if ($('#curtainFloor').width() !== a.w)
			$('#curtainFloor').width(a.w);
		if ($('.curtain').height() !== a.h)
			$('.curtain').height(a.h);
		
		if ($('#curtainFloor').height() === 0) $('#curtainFloor').height(72)
			else $('#curtainFloor').height(0);
		
		if ($('#curtainTop').height() === 0) $('#curtainTop').height($('#media').height() - 72)
			else $('#curtainTop').height(0);
          
    },
	
	findUserVideos: function(user) {
		var vids = 0;
		var userLower = user.toLowerCase();
		if (room.playlist.videos.length !== 0) {
			for (var i = 0; i < room.playlist.videos.length; i++) {
			  if (room.playlist.videos[i].addedby.toLowerCase() == userLower) {
				vids++;
			  }
			}
			addMessage({username:''},'Found ' + vids + ' video(s) added by ' + user + '.','hashtext');
		} else {
			addMessage({username:''},'No videos in playlist.','urgenttext');
		}
	},
	
	getUserIndex: function(id) {
		for (var i = 0; i < room.userlist.users.length; i++) {
			if (id == room.userlist.users[i].id) {
				return i;
			}
		}
		return -1;
	},
	
	cleanLog: function() {
		if (script.logs > script.MAXLOGS) {
			$('#logs span').eq(1).css('opacity', '.4');
			$('#logs span').eq(2).css('opacity', '.6');
			$('#logs span').eq(3).css('opacity', '.8');
			$('#logs span').eq(0).remove();
			script.logs--;
		}
	},
	
	setTabTitle: function(a,b,c,d) { //vidinfo, addedby, video index, title
		var newTitle = d;
		if (newTitle.length > 55) {
			newTitle = newTitle.substring(0, 55);
			newTitle += '...';
		}
		var currentVid = newTitle + ' via ' + b;
		var videoLink = '';
		document.title = decodeURIComponent('%E2%96%B6') + ' ' + currentVid;
		switch (a.provider) {
			case "youtube":
				videoLink = 'http://youtu.be/' + a.id;
				break;
			case "vimeo":
				videoLink = 'http://vimeo.com/' + a.id;
				break;
			case "twitch":
				videoLink = 'http://twitch.tv/' + a.channel;
				break;
			case "dailymotion":
				videoLink = 'http://dailymotion.com/video/' + a.id;
				break;
			default:
				videoLink = 'unlisted source';
				break;
		}
		console.log('Now playing: ' + currentVid + ' ( ' + videoLink + ' )');
	},
	
	setFavIcon: function(src) {
		var a = '<link rel="shortcut icon" class="scr-fav" href="' + src + '">';
		$('.scr-fav').remove();
		$('head').append(a);
	},
	
	scrollTopPl: function() { //from built-in room.playVideo
		$('#playlist').animate({
			scrollTop: $("#playlist .active").offset().top - $("#playlist .active").offset().top + $("#playlist .active").scrollTop()
		});
	},
	
	byteCount: function(s){return encodeURIComponent(s).replace(/%[A-F\d]{2}/g,'x').length},
	//https://gist.github.com/mathiasbynens/1010324
	
	playSound: function(sound) {
		var vol = 0.8;
		if (typeof(room.video) !== "undefined")
			vol = room.video.video.volume();
		sound.volume = vol;
		sound.play();
	},
	
	testHexColor: function(str) {
        if (str.length == 7) {
            return (/^#[0-9a-f]{6}$/i).test(str);
        } else if (str.length == 4) {
            return (/^#[0-9a-f]{3}$/i).test(str);
        } else {
            return false;
        }
    },
	buildEmotes: function() {
		sdbg.log("script.fns.buildEmotes called");
		window.script.$initialcodes = window.$codes;
		window.script.$newcodes = {
		//modified original emotes
			'chen': '<img src="http://i.imgur.com/j55EMQt.png" width="50" height="46" onclick="script.fns.playSound(script.emoteSounds.chen);">',
			'doot': '<img src="http://i.imgur.com/WfUlQ5Q.gif" width="50" height="45" onclick="script.fns.playSound(script.emoteSounds.doot);">',
			'bestgames': '<img src="http://i.imgur.com/ImyXj.png" width="48" height="54" onclick="script.fns.playSound(script.emoteSounds.chad);">',
			'no': '<img src="http://i.imgur.com/nKa8o.png" width="41" height="30" onclick="script.fns.playSound(script.emoteSounds.no);">',
			'idontwantthat': '<img src="http://i.imgur.com/nKa8o.png" width="41" height="30" onclick="script.fns.playSound(script.emoteSounds.no);">',
			'heero' : '<img src="http://i.imgur.com/D7JCR6j.png" width="60" height="55">',
			'kek' : '<img src="http://i.imgur.com/xrw4paP.png" width="40" height="54">',
		//additional emotes
			'chen2': '<img src="http://i.imgur.com/TGHRo8W.gif" width="54" height="50" onclick="script.fns.playSound(script.emoteSounds.chen2);">',
			'kitty2': '<img src="http://i.imgur.com/yxBHAvx.gif" width="38" height="60">',
			'enjoytheanime' : '<img src="http://i.imgur.com/aXPWln0.png" width="48" height="60">',
			'straya' : '<img src="http://i.imgur.com/PNB0kE9.gif" width="50" height="50">',
			'neverever' : '<img src="http://i.imgur.com/MJnWGHV.png" width="52" height="50">',
			'gud': '<img src="http://i.imgur.com/Ms3Zxne.png" width="62.5" height="50">',
			'feelssmug': '<img src="http://i.imgur.com/og9In6D.png" width="48" height="48">',
			'puke': '<img src="http://i.imgur.com/IADYHCP.png" width="58" height="58">',
			'tip': '<img src="http://i.imgur.com/QWhYbc8.gif" width="49" height="54">',
			'copythat': '<img src="http://i.imgur.com/VOibACz.png" width="31" height="51">',
			'ree': '<img src="http://i.imgur.com/U1Trjzq.gif" width="42" height="42">',
			'alien2': '<img src="http://i.imgur.com/jBji5uc.gif" width="43" height="63">',
		};

		window.script.$colorcodes = {
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
		window.script.$fontcodes = {
			"spoiler": '<font style="text-shadow: 0 0 black; background-color: #000; cursor: default" onmouseover="this.style.backgroundColor=\'transparent\'" onmouseout="this.style.backgroundColor=\'black\'">',
			"i": '<font style="font-style:italic">',
			"u": '<font style="text-decoration: underline">',
			"b": '<strong>',
			"s": '<strike>',
			"endbold": '</strong>',
			"endstrike": '</strike>',
			"endspan": '</span></font></font></font>'
		};
		$.extend(script.$newcodes, script.$externalEmotes);
		$.extend(script.$colorcodes, script.$fontcodes);
		$.extend($codes, script.$newcodes);
		$.extend($codes, script.$colorcodes);
		
		sdbg.log("script.fns.buildEmotes finished");
	},
	
	useEmote: function(code) {
		var msg = $('#cin').val();
		
		//if (useColons)
			msg = msg + ":" + code + ":";
		//else
		//	msg = "/" + code;
			
		$('#cin').val(msg);
	},
	
	buildEmoteMenu: function() {
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
			if (code != 'fast' && code != 'spin' && script.$colorcodes[code] == undefined) {
				emoteMenu = emoteMenu + '<span title="' + code + '" onclick="script.fns.useEmote(\'' + code + '\')">' + image + '</span>';
			}
		});
		emoteMenu += "<br />";
		$.each(script.$colorcodes, function(code, bgcolor) {
			if (code !== 'rainbowroad' && script.$fontcodes[code] == undefined) {
				if (code == 'outline') {
					bgcolor = 'color: black;box-shadow: 0 0 15px #00ccff inset';
				} else if (code == 'redoutline') {
					bgcolor = 'color: black;box-shadow: 0 0 15px #f00 inset';
				} else {
					bgcolor = bgcolor.slice(20, -2);
				}
				emoteMenu = emoteMenu + '<span class="colors" title="' + code + '" style="background-' + bgcolor + '" onclick="script.fns.useEmote(\'' + code + '\')"></span>';
			}
		});
		emoteMenu += "<br />";
		$.each(script.$fontcodes, function(code, node) {

			var endc = '<font';
			var endtag = '</font>';
			var txt = '';

			if (code in endtags) {
				endc = endtags[code][0];
				endtag = endtags[code][1];
				txt = endtags[code][2];
			}
			
			emoteMenu = emoteMenu + '<span class="font-codes" title="' + code + '" onclick="script.fns.useEmote(\'' + code + '\')">' + endc + ' class="' + code + '">' + txt + endtag + '</span>';
		});

		$('#emotes').remove();
		$('#tabs_playlist_emotes').append('<div id="emotes">' + emoteMenu + '</div>');
		//$('#emotes').css('display', 'none');
	},

	toggleAutoClean: function(setting) {
		var ac;
		if (setting == true)
			ac = true;
		else if (setting == false)
			ac = false;
		else {
			ac = script.fns.get("autoClean");
			ac = !ac;
		}
		if (ac) {
			room.addMessage({username:''}, 'Autoclean is now on. The next video must be position 1 to autoclean.', 'hashtext');
		} else {
			room.addMessage({username:''}, 'Autoclean is now off.', 'hashtext');
		}
		script.fns.set("autoClean", ac);
		$('#toggle_autoclean_box').prop('checked', ac);
	},
	
	checkEmote: function(message) {
		var a,b,c,d,e;
		a = b = c = d = e = 0;
		while (a < message.length && a >= 0 && e < 4) {
			var checked = false;
			d++;
			a = message.indexOf(':', a);
			b = message.indexOf(':', a + 1);
			var f = message.slice(a, b + 1);
			if ($codes[f.slice(1, -1).toLowerCase()] != undefined || f.slice(1, -1)[0] === '#') {

				if (f.slice(1, -1)[0] === '#') {
					if (script.fns.testHexColor(f.slice(1, -1))) {
						var colorNode = "</span><span style='color: " + f.slice(1, -1) + "'>";
						message = message.replace(f, colorNode);
						c = colorNode.length;
						checked = true;
						e += 0.5;
					}
				}
				if (!checked) {
					var emote = f.slice(1, -1).toLowerCase();
					if ($codes[emote] !== undefined)
						c = $codes[emote].length;
					else
						return message;
					message = message.replace(f, $codes[emote]);
					if (script.$colorcodes[emote] !== undefined || script.$fontcodes[emote] !== undefined || emote == "fast" || emote == "spin") e += 0.5;
					else e++;
				}
				
					if (c < f.slice(1, -1).length) {
						a = message.indexOf(f.slice(1, -1));
					} else {
						a += c;
					}
					
			} else if ($codes[f.slice(1, -1).toLowerCase()] === undefined) {
				a = b;
			} else if (d >= 10) {
				break;
			}
		}
		return message;
	},
	cleanFast: function() {
		if ($('#chat_messages.chat-messages .message marquee')[0] === undefined)
			script.fastmsgs = 0;
			
		while (script.fastmsgs > script.MAXFAST) {
			$('#chat_messages.chat-messages .message marquee')[0].remove();
			script.fastmsgs--;
		}
	},
	
	cleanSpin: function() {
		if ($('#chat_messages.chat-messages .message .spin')[0] === undefined)
			script.spinmsgs = 0;
		
		while (script.spinmsgs > script.MAXSPIN) {
			$('#chat_messages.chat-messages .message .spin')[0].remove();
			script.spinmsgs--;
		}
	},
	
	viewHistory: function(vids) {
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
		$('#tabs_playlist_recent').empty();
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
				
			$('#tabs_playlist_recent').append('<li class="search-result" title="' + title + '"><a href="' + host + vids[i].info.id + '" target="_blank"><span class="video-thumb"><img class="video-thumbnail" src="' + thumb + '"><img class="video-icon" src="' + icon + '"><span class="video-time">' + utils.secondsToTime(vids[i].duration) + '</span></span><span class="video-title">' + title + '</span><span class="video-uploader">added by <b><span id="vidUploader">' + vids[i].addedby + '</span></b></a></li>');
		}
	},
	
	bumpUser: function(user, bumpTo) {
		if (room.user.isMod) {
			var a = false;
			var c = [];
			var b = '';
            var d = '';
			var e = bumpTo;
			var pl = room.playlist.videos;
			var users = room.userlist.users;
			if (e > 0)
				e = e - 1;
			else if (e === null)
				e = $('#playlist.playlist li.active').index() + 1;
			e = parseInt(e);
			if (isNaN(e) || e >= pl.length) {
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
						for (var l = pl.length - 1; l > -1; l--) {
							if (pl[l].addedby.toLowerCase() == b.toLowerCase()) {
								a = true;
								room.sendcmd('move', {
									info: pl[l].info,
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
					if (f == $('#playlist.playlist li.active').index()) {
						f++;
					}
					if (f > pl.length - 1) {
						d = 'Playlist too small.';
					} else {
						room.sendcmd('move', {
							info: pl[f].info,
							position: e
						});
						d = 'Random video (' + f + ') bumped.';
					}
				}
			}
		} else {
			d = 'You cannot use this command.';
		}
		room.addMessage({username:""}, '<span style="color: red; font-style: none; font-weight:bold">$bump: </span>' + d + '</span></div>', 'system');
	},
	
	initializeSettings: function() {
		var get = script.fns.get;
		var set = script.fns.set;
		for (var i in script.settings) {
			sdbg.log("checking settings: " + i);
			var val = get(i);
			// i = key, val = key's value
			if (i == room.roomName.toLowerCase() + ".recentVideos") {
				if (typeof($.parseJSON(val)) !== "object" || val == null) {
					set(room.roomName.toLowerCase() + ".recentVideos", "[]");
					sdbg.log("- initializing " + i);
				}
			} else if (i == "currentCSS") {
				if (script.cssLinks[val] === undefined) {
					sdbg.log("- initializing " + i);
					set(i, script.settings[i]);
				}
			} else if (typeof(val) !== typeof($.parseJSON(script.settings[i])) || val == null) {
				sdbg.log("- initializing " + i);
				set(i, script.settings[i]);
			}
		}
		//booleans: "showLogs", "showAdd", "showFast", "showRoll", "indentChat", "autoClean"
		//other: "marqueeSpeed", "recentVideos"
		if (isNaN(parseInt(get("marqueeSpeed"))))
			set("marqueeSpeed", script.settings["marqueeSpeed"]);
		script.marqueeSpeed = parseInt(get("marqueeSpeed"));
		
		if (get("showFast"))
			$codes['fast'] = '<marquee direction="right" scrollamount="' + get("marqueeSpeed") + '">';
	},
	
	setCustomLayout: function(layoutName) {
		var css = script.cssLinks;
		if (css[layoutName] === undefined)
			return;
		if (css !== "none") {
			if ($('.customLayout').href !== css[layoutName][1]) {
				$('.customLayout').remove();
				$('head').append('<link href="' + css[layoutName][1] + '" type="text/css" rel="stylesheet" class="customLayout">');
			}
		} else {
			$('.customLayout').remove();
		}
		if (script.fns.get("currentCSS") !== layoutName) {
			script.fns.set("currentCSS", layoutName);
			$('#css-' + layoutName).prop('checked', true);
		}
	},
	
	addLog: function(title, addedby) {
		var cl = $('#chat_messages .message');
		if (typeof(title) !== "undefined")
			if (title.length > 80)
				title = title.slice(0, 80) + '...';
		if (cl.length > 0) {
			if (cl[cl.length - 1].textContent.substring(0,12) !== ': Welcome to' && messages > 0) {
				room.addMessage({username:'%addVideo'}, addedby + ' added ' + title, 'gm vid');
			}
		} else {
			
		}
	},
	
	load: function() {
		if (window.script.loaded == false) {
			if (window.script.preloaded == false) {
				for (var i = 0; i < script.pretasks.length; i++) {
					sdbg.log("Pre-connect Task "+i+" executing...");
					script.pretasks[i]();
					sdbg.log("- Pre-connect Task "+i+" executed!");
				}
				window.script.preloaded = true;
			}
			//if ($('#user_list.user-list li').length < 1) {
			//	setTimeout(function() {
			//		script.fns.load();
			//	}, 50);
			//} else {
				window.script.loaded = true;
				if (room.roomName.toLowerCase() == "v4c") script.fns.setFavIcon('http://i.imgur.com/DmMh2O9.png'); else script.fns.setFavIcon('/favicon.ico');
				for (var i = 0; i < script.tasks.length; i++) {
					sdbg.log("Task "+i+" executing...");
					script.tasks[i]();
					sdbg.log("- Task "+i+" executed!");
				}
				console.log("Script loaded.");
				var hello = '<span style="font-weight:bold; color:#045AA4">Loaded ' + script.version + '.';
				if (script.debug)
					hello += ' <span style="font-weight:bold; color:#7304A4">Debug to console ON.</span>';
				hello += '</span>';
				room.addMessage({username:""}, hello, 'system');
				setTimeout(function() {
					window.script.delayedTasks.push(script.fns.buildEmoteMenu);
					for (var i = 0; i < script.delayedTasks.length; i++) {
						sdbg.log("Delayed task "+i+" executing...");
						script.delayedTasks[i]();
						sdbg.log("- Delayed task "+i+" executed!");
					}
				}, 1000);
				sdbg.log("script.fns.load finished");
			//}
		}
	}

};

window.script.setCSS = function() {
	$('.scriptBaseCSS').remove();
	$('head').append('<link class="scriptBaseCSS" href="https://googledrive.com/host/0B2hdmKDeA0HDZ2IwRFRzaTV2dEU" rel="stylesheet" type="text/css">');
	sdbg.log("Base CSS added to page header");
};

window.script.setHTML = function() {
	if (!script.htmlIsSet) {
		script.htmlIsSet = true;
		if (script.fns.get("showLogs"))
			$('.navbar-collapse').append('<div class="logWrapper"><div id="logs"></div></div>');
		else
			$('.navbar-collapse').append('<div class="logWrapper" style="display:none"><div id="logs"></div></div>');
		$('.navbar-collapse').append('<div class="newUpdate" style="display:none"><a href="https://greasyfork.org/en/scripts/6366" target="_blank">New script update! Click here!</a></div>');
		$('.video-controls .tab-content').append('<div class="tab-pane" id="tabs_playlist_emotes"></div>');
		$('.video-controls .tab-content').append('<div class="tab-pane" id="tabs_playlist_recent"></div>');
		$('.video-controls .tab-content').append('<div class="tab-pane" id="tabs_playlist_cssmenu"></div>');
		$('<li><a class="active_tooltip" title="Emote Menu" data-original-title="Emote Menu" href="#tabs_playlist_emotes" data-toggle="tab" rel="tooltip" data-placement="bottom"><i class="fa" style="width: 12px;height: 14px;"><img src="https://i.imgur.com/vETtK.png" class="fa-ainsley"></i></a></li>').insertBefore('.video-controls .nav-tabs .skip-controls');
		$('<li><a id="recentTab" title="Recent Videos" class="active_tooltip" data-original-title="Recent Videos" href="#tabs_playlist_recent" data-toggle="tab" rel="tooltip" data-placement="bottom"><i class="fa fa-clock"></i></a></li>').insertBefore('.video-controls .nav-tabs .skip-controls');
		$('<li><a id="cssMenuTab" title="Custom Layouts" class="active_tooltip" data-original-title="Custom Layouts" href="#tabs_playlist_cssmenu" data-toggle="tab" rel="tooltip" data-placement="bottom"><i class="fa fa-paint-brush"></i></a></li>').insertBefore('.video-controls .nav-tabs .skip-controls');
		$('#create_poll_modal .modal-footer').prepend('<button onclick="$(\'#create_poll_modal .modal-body .input-group input\').val(\'\');" id="clear_poll_options" type="button" class="btn btn-red btn-sm">Clear</button>');
		$('<div class="curtain"><div id="curtainTop"></div><div id="curtainFloor"></div></div>').insertBefore('#media');
		$('.video-controls .nav-tabs').append('<li class="curtainbutton"><i id="toggle_curtain" onclick="script.fns.adjustCurtain();return false;" class="fa fa-curtain active_tooltip" style="display: inline;"></i></li>');
		$('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_showlogs_box" type="checkbox" value="ShowLogs">Show Join and Leave Logs</label></div>');
		$('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_fast_box" type="checkbox" value="Fast">Use :fast: Emote</label></div>');
		$('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_spin_box" type="checkbox" value="Spin">Use :spin: Emote</label></div>');
		$('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_showadd_box" type="checkbox" value="AddMsgs">Show Video Add Messages in Chat</label></div>');
		$('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_showroll_box" type="checkbox" value="ShowRoll">Show $roll/$8ball Results in Chat</label></div>');
		$('#tabs_playlist_settings').append('<div class="checkbox mod-control"><label class="active_tooltip"><input id="toggle_autoclean_box" type="checkbox" value="Autoclean">Autoclean</label></div>');
		$('#tabs_chat_settings_content').append('<div class="fastspeedbox"><label class="active_tooltip"><input id="marqueeinput" style="color:black" size="3" type="text" max="999" maxlength="3" onkeyup="script.fns.setFast($(this).val());return false;"> :fast: Scroll Speed <span style="color: #c00">(max 999)</span></label></div>');
		/*$('#tabs_playlist_settings').append('<div class="recentmaxbox"><label class="active_tooltip"><input id="recentsinput" size="3" type="text" max="999" maxlength="3" onkeyup="script.fns.set("maxRecents", $(this).val());return false;"> Maximum Recent Videos <span style="color: #c00">(max 999)</span></label></div>');
		$('#recentsinput').val(script.fns.get("maxRecents"));*/
		$('#marqueeinput').val(script.fns.get("marqueeSpeed"));
		$('#toggle_showlogs_box').prop('checked', script.fns.get("showLogs"));
		$('#toggle_fast_box').prop('checked', script.fns.get("showFast"));
		$('#toggle_spin_box').prop('checked', script.fns.get("showSpin"));
		$('#toggle_showroll_box').prop('checked', script.fns.get("showRoll"));
		$('#toggle_showadd_box').prop('checked', script.fns.get("showAdd"));
		$('#toggle_autoclean_box').prop('checked', script.fns.get("autoClean"));

		for (var i in script.cssLinks) {
			var html = '<div class="radio"><label class="active_tooltip"><input data-css-name="' + i + '" id="css-' + i + '" type="radio" name="customcss" onclick="script.fns.setCustomLayout($(this).attr(\'data-css-name\'));">' + script.cssLinks[i][0] + '</label></div>';
			$('#tabs_playlist_cssmenu').append(html);
		}
		
		$('#css-' + script.fns.get("currentCSS")).prop('checked', true);
		if (script.fns.get("currentCSS") !== "none")
			script.fns.setCustomLayout(script.fns.get("currentCSS"));
	}
};

window.script.pretasks = [script.overwriteFunctions, script.setCSS];
window.script.tasks = [script.fns.initializeSettings, script.setHTML, script.setListeners, script.fns.gmtClock];
window.script.delayedTasks = [script.fns.buildEmotes];
//firefox has issues with emotes...

window.room.onConnecting = function () {
	room.addMessage({username:""},"Connecting..","text-danger");
	if (!window.script.loaded) script.fns.load();
}