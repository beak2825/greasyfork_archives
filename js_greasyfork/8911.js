// ==UserScript==
// @name		v4c/InstaSync Additional Features (ALPHA)
// @namespace		v4c
// @description 	jk not even alpha lol
// @include     	*://*.instasync.com/*
// @include     	*://instasync.com/*
// @match       	*://*.instasync.com/*
// @match       	*://instasync.com/*
// @version		0.003.2a
// @grant		none
// @author		biggles
// @downloadURL https://update.greasyfork.org/scripts/8911/v4cInstaSync%20Additional%20Features%20%28ALPHA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/8911/v4cInstaSync%20Additional%20Features%20%28ALPHA%29.meta.js
// ==/UserScript==

//CSS by IllusoryMinds, Dildoer the Cocknight, and Krogan. All of this belongs to biggles.
//Created by biggles; very few parts used from other sources, where they are given credit. Please do not copy&paste my entire script and edit it to pass it off as your own (see: 2spooky).

/*
    <InstaSync - Watch Videos with friends.>
    Copyright (C) 2015  InstaSync
*/

window.messages = 0;

window.CustomCSSLink = "http://googledrive.com/host/0B5VbuD1Jaw15fnV3bE5XeUNIdUQxc1dUNnZHMjgyb0VFT2c1YWpXU09Pai1sdGUxTEtFWk0/collabbiggles.css";

window.script = new function(){
	var self = this;
	
	//objects, arrays, functions
	self.overwriteFunctions = function(){};
	self.setListeners = function(){};
	self.fns = {};
	self.$newcodes = {};
	self.$colorcodes = {};
	self.$fontcodes = {};
	self.emoteSounds = {};
	self.tasks = [];
	self.pretasks = [];
	
	//booleans
	self.debug = false; //if true, certain things will be logged to the console
	self.loaded = false;
	self.autoClean = true;
	self.newMsg = false;
	
	//variables
	self.version = "2.000-pre"
	self.fastmsgs = 0;
	self.MAXFAST = 6;
	self.bgtimer = 0;
	
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
		if ((room.filterGreyname === true && user.loggedin === false) || room.isMuted(user.ip))
			return;
		usernameClass += user.loggedin ? "registered " : "unregistered ";
		if (user.permissions > 0){
			usernameClass += "mod-message";
		}
		var messageBox = $('<div/>', {
			"class": "chat-message"
		});
		if (script.fns.byteCount(message) > 250 && user.username != '')
			message = '<span style="color: #800">(removed)</span>';
		if (message.indexOf(':fast:') > -1 && typeof($codes.fast) !== undefined) {
			script.fastmsgs++;
			script.fns.cleanFast();
		}
		message = linkify(message);
		
		var splitmsg = message.split(" ");
		if (splitmsg[0] == '$bump') {
			splitmsg[0] = '<img src="http://i.imgur.com/d1odx.png" width="25" height="25">';
			if (room.user.isMod && user.username.toLowerCase() == room.user.userinfo.username.toLowerCase()) {
				if (splitmsg.length == 3)
					script.fns.bumpUser(splitmsg[1].toLowerCase(), splitmsg[2]);
					
				else if (splitmsg.length == 2) {
				
					if (!isNaN(parseInt(splitmsg[1])))
						script.fns.bumpUser(room.user.userinfo.username.toLowerCase(), splitmsg[1]);
						
					else
						script.fns.bumpUser(splitmsg[1].toLowerCase(), null);
						
				} else if (splitmsg.length == 1)
					script.fns.bumpUser(room.user.userinfo.username.toLowerCase(), null);
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
			//updateRecent(indexOfVid); *IMPLEMENT RECENT VIDEOS
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
			if (script.autoClean && room.user.isMod) {
				setTimeout(function() {
					if (indexOfVid == 1)
						room.sendcmd('clean', null);
				}, 1000);
			}
			script.bgtimer = 0;
			if (room.playlist.videos[indexOfVid].info.id == 'IniyZZqlcwA') {
				clearTimeout(script.bgtimer);
				script.bgtimer = setTimeout(function() {
					$('.dim').css('background-image', 'url("http://whereduaneat.org/duane.gif")');
				}, 21000);
			} else {
				clearTimeout(script.bgtimer);
				$('.dim').css('background-image', 'url("http://i.imgur.com/ejIDkbj.png")');
			}
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
	sdbg.log("script.overwriteFunctions finished");
};

window.script.setListeners = function() {
	$('#cin').on('focus', function() {
			if (room.roomName.toLowerCase() = "v4c") script.fns.setFavIcon('http://i.imgur.com/DmMh2O9.png'); else script.fns.setFavIcon('/favicon.ico');
			script.newMsg = false;
	});
}

window.script.fns = {
	
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
	buildEmoteMenu: function() {
		sdbg.log("script.fns.buildEmoteMenu called");
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
			'fast': '<marquee direction="right" scrollamount="50">' //todo: remove this in final
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
		$.extend($codes, script.$newcodes);
		
		/*
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
		$.each(script.$colorcodes, function(code, bgcolor) {
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
		$.each(script.$fontcodes, function(code, node) {

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
		$('.dim').prepend('<div id="facecodesmenu"></div>');

		$('#facecodesmenu').append('<div id="emotes" style="display: inline-block">' + emoteMenu + '</div>');
		$('#facecodesmenu #emotes').css('display', 'none');
*/
		$.extend($codes, script.$colorcodes);
		$.extend($codes, script.$fontcodes);
		
		sdbg.log("script.fns.buildEmoteMenu finished");
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
					if (script.$colorcodes[emote] !== undefined || script.$fontcodes[emote] !== undefined) e += 0.5;
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
	//expandEmoteMenu: function() {
	//	$('#facecodesmenu').fadeToggle();
	//	$('#facecodesmenu #emotes').fadeToggle();
	//},
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
	load: function() {
		if (window.script.loaded == false) {
				for (var i = 0; i < script.pretasks.length; i++) {
					sdbg.log("Pre-connect Task "+i+" executing...");
					script.pretasks[i]();
					sdbg.log("Pre-connect Task "+i+" executed!");
				}
			if ($('#user_list.user-list li').length < 1) {
				setTimeout(function() {
					script.fns.load();
				}, 50);
			} else {
				sdbg.log("script.fns.load called");
				window.script.loaded = true;
				if (room.roomName.toLowerCase() == "v4c") script.fns.setFavIcon('http://i.imgur.com/DmMh2O9.png'); else script.fns.setFavIcon('/favicon.ico');
				for (var i = 0; i < script.tasks.length; i++) {
					sdbg.log("Task "+i+" executing...");
					script.tasks[i]();
					sdbg.log("Task "+i+" executed!");
				}
				console.log("Script loaded.");
				var hello = '<span style="font-weight:bold; color:#23B323">Loaded v2.000a.';
				if (script.debug)
					hello += ' Debug console logging on!';
				hello += ' Only things functional so far: emotes, loading system, bumping(fixed). That\'s it. Don\'t expect more than that for now.</span>';
				room.addMessage({username:""}, hello, 'system');
				if (CustomCSSLink !== "") {
					$('head').append('<link class="scriptCustomCSS" href="' + CustomCSSLink + '" rel="stylesheet" type="text/css">');
					sdbg.log("Custom CSS added to page header");
				} else {
					sdbg.log("No Custom CSS link found...");
				}
				sdbg.log("script.fns.load finished");
				$('head').append("<style>.message.urgenttext {color:#D21B1B} .message.limetext {color:#0CC839}</style>");
			}
		}
	}

};

window.script.pretasks = [script.overwriteFunctions];
window.script.tasks = [script.fns.buildEmoteMenu];

script.fns.load();