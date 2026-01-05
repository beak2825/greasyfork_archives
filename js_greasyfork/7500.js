// ==UserScript==
// @name         MSPARP_ModUtils
// @namespace    http://www.msparp.com/
// @version      1.6
// @description  A collection of utilities that makes moderation on msparp easier.
// @author       GREEN SUN
// @match        http://*.msparp.com/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7500/MSPARP_ModUtils.user.js
// @updateURL https://update.greasyfork.org/scripts/7500/MSPARP_ModUtils.meta.js
// ==/UserScript==

function updatePerm(){
    printcon("Permissions altered.");
    if($('#online > li.globalmod.self').length > 0){
        updatePermissions(4);
    }else if($('#online > li.mod.self').length > 0){
        updatePermissions(3);
    }else if($('#online > li.mod2.self').length > 0){
        updatePermissions(2);
    }else if($('#online > li.mod3.self').length > 0){
        updatePermissions(1);
    }else{
        updatePermissions(0);
    }   
    checkForChanges();
}

function updatePermissions(node){
    powerLevel = node;
    switch(powerLevel){
        case 4:
            powerLevel = 4;
            printcon("Init GODTIER permset.");
            for(var i = 0; i < 8; i++){
                document.getElementById('enhancedSelect').options[i].disabled = false;   
            }
            document.getElementById('enhancedSelect').options[0].selected = true;
            document.getElementById('enhancedSelect').disabled = false;
            document.getElementById('idInput').disabled = false;
            document.getElementById('chatnameInput').disabled = false;
            document.getElementById('enhancedGo').disabled = false;
            break;
        case 3:
            powerLevel = 3;
            printcon("Init PWB permset.");
            for(var i = 0; i < 8; i++){
                document.getElementById('enhancedSelect').options[i].disabled = false;   
            }
            document.getElementById('enhancedSelect').options[2].disabled = true;
            document.getElementById('enhancedSelect').options[1].selected = true;
            document.getElementById('enhancedSelect').disabled = false;
            document.getElementById('idInput').disabled = false;
            document.getElementById('chatnameInput').disabled = false;
            document.getElementById('enhancedGo').disabled = false;
            break;
        case 2:
            powerLevel = 2;
            printcon("Init BR permset.");
            for(var i = 0; i < 8; i++){
                document.getElementById('enhancedSelect').options[i].disabled = false;   
            }
            document.getElementById('enhancedSelect').options[7].selected = true;
            document.getElementById('enhancedSelect').options[1].disabled = true;
            document.getElementById('enhancedSelect').options[2].disabled = true;
            document.getElementById('enhancedSelect').options[3].disabled = true;
            document.getElementById('enhancedSelect').disabled = false;
            document.getElementById('idInput').disabled = false;
            document.getElementById('chatnameInput').disabled = false;
            document.getElementById('enhancedGo').disabled = false;
            break;
        case 1:
            powerLevel = 1;
            printcon("Init AGS permset.");
            for(var i = 0; i < 8; i++){
                document.getElementById('enhancedSelect').options[i].disabled = false;   
            }
            document.getElementById('enhancedSelect').options[7].selected = true;
            document.getElementById('enhancedSelect').options[1].disabled = true;
            document.getElementById('enhancedSelect').options[2].disabled = true;
            document.getElementById('enhancedSelect').options[3].disabled = true;
            document.getElementById('enhancedSelect').options[4].disabled = true;
            document.getElementById('enhancedSelect').disabled = false;
            document.getElementById('idInput').disabled = false;
            document.getElementById('chatnameInput').disabled = false;
            document.getElementById('enhancedGo').disabled = false;
            break;
        case 0:
            powerLevel = 0;
            printcon("Init USER permset.");
            for(var i = 0; i < 8; i++){
                document.getElementById('enhancedSelect').options[i].disabled = true;   
            }
            document.getElementById('enhancedSelect').options[0].disabled = false;
            document.getElementById('enhancedSelect').options[7].selected = true;
            document.getElementById('enhancedSelect').disabled = false;
            document.getElementById('idInput').disabled = false;
            document.getElementById('chatnameInput').disabled = false;
            document.getElementById('enhancedGo').disabled = false;
            break;
        default:
            break;
    }
}

function checkForChanges()
{
    if ($('#online > li.self').hasClass('globalmod') && powerLevel !== 4)
        updatePerm();
    if ($('#online > li.self').hasClass('mod') && powerLevel !== 3)
        updatePerm();
    if ($('#online > li.self').hasClass('mod2') && powerLevel !== 2)
        updatePerm();
    if ($('#online > li.self').hasClass('mod3') && powerLevel !== 1)
        updatePerm();
    if ($('#online > li.self').hasClass('user') && powerLevel !== 0)
        updatePerm();
    if ($('#online > li.self').hasClass('silent') && powerLevel !== 0)
        updatePerm();
    else
        setTimeout(checkForChanges, 500);
}

function createUtils(){
    returnedData = "";
    profiles = {};
    if($('#metaOptions').length > 0){
        var vanilla_options = $('#metaOptions');
        vanilla_options.after($('<div id="console" style="background-color: #AAAAAA; overflow-y: scroll; margin-left: 5px; margin-right: 5px; border: 5px solid #c6c6c6; height: 90px;"></div>'));
        vanilla_options.after($('<div style="margin-left:5px;">Output Console:</div>'));
        vanilla_options.after($('<div id="msparp_options" style="margin:5px;"></div>'));
        var enhanced_options = $('#msparp_options');
        enhanced_options.append($('<select id="enhancedSelect" style="width:47%;"><option value="get_ip">Lookup</option><option value="ip_ban">IP Ban</option><option value="GT_user">God-Tier</option><option value="PWB_user">PWB</option><option value="br_user">BR</option><option value="ags_user">AGS</option><option value="norm_user">User</option><option value="silence_user">Silence</option></select>'));
        enhanced_options.append($('<input type="text" id="idInput" size="11" name="idInput" placeholder="User ID" autocomplete="off" maxlength="11" style="margin-left:5px;display:inline-block;width:47%;">'));
        enhanced_options.append($('<input type="text" id="chatnameInput" size="20" name="chatnameInput" placeholder="Chat(Default = this)" autocomplete="off" maxlength="255" style="margin-top:5px; display:inline-block;width:79%;">'));
        enhanced_options.append($('<button type="button" id="enhancedGo" style="margin-left:5px;margin-top:5px;display:inline-block;width:15%;">GO</button>'));
        document.getElementById('enhancedGo').addEventListener("click", enhancedGo);
        $('#console').after($('<button type="button" id="enhancedCookie" style="margin-left:5px;margin-right:5px;margin-top:5px;width:95%;">!----Display Cookie----!</button>'));
        document.getElementById('enhancedCookie').addEventListener("click", enhancedCookie);
        var enhanced_console = $('#console');
        enhanced_console.after($('<select id="enhancedCookieSelect" style="width:95%;margin:5px;"></select>'));
        enhanced_console.after($('<input type="text" id="cookieInput" name="cookieInput" placeholder="New cookie..." autocomplete="off" maxlength="36" style="width:67%;margin-left:5px;margin-right:5px;"></input><button type="button" id="addCookie" style="margin-left:5px;margin-top:5px;display:inline-block;width:20%;">ADD</button>'));
        document.getElementById('addCookie').addEventListener("click", addCookie);
        $('#enhancedCookieSelect').change(switchProfile);
        
        refreshProfiles();
        
        printcon("Initializing...");
        
        setTimeout(updatePerm, 2000);
        setTimeout(checkForChanges, 2000);
        
        $('#chatnameInput').keydown(function(e){
            if(e.keyCode==13)
                enhancedGo();
        });
        $('#idInput').keydown(function(e){
            if(e.keyCode==13){
                enhancedGo();
                return;
            }
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) || 
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
            
        });
    }
}

function enhancedGo(){
    var pathArray = window.location.pathname.split( '/' );
    var pathLength = pathArray.length -1;
    var currPath = pathArray[pathLength];
    
    var selection = document.getElementById("enhancedSelect");
    var selectionIndex = selection.selectedIndex;
    var idInput = $('#idInput');
    var chatInput = $('#chatnameInput');
    var chatId = chatInput.val();
    var userId = idInput.val();
    returnedData = "";
    
    if(idInput.val() === '' || idInput.val() == "0") {
        printcon("You did not specify a user ID!");
        return;
    }
    
    if(chatInput.val() === '') {
        chatId = currPath;
    }
    
    switch(selectionIndex) {
        case 0:
            //IP LOOKUP
            var actionData = { 'chat': chatId, 'counter': parseInt(userId) };
            var location = "/chat_ajax/ip_lookup";
            printcon(chatId + ":" + userId + "'s IP: " + doPost(actionData, location));
            
            break;
            
        case 1:
            //IP BAN
            var actionData = { 'chat': chatId, 'user_action': "ip_ban", 'counter': parseInt(userId) };
            var location = "/chat_ajax/post";
            printcon(chatId + ":" + userId + " IP banned: " + doPost(actionData, location));
            
            break;
            
        case 2:
            //Set to God Tier
            var actionData = { 'chat': chatId, 'counter': parseInt(userId), 'set_group': 'globalmod' };
            var location = "/chat_ajax/post";
            printcon(chatId + ":" + userId + " Set to God-Tier: " + doPost(actionData, location));
            
            break;
            
        case 3:
            //Set to PWB
            var actionData = { 'chat': chatId, 'counter': parseInt(userId), 'set_group': 'mod' };
            var location = "/chat_ajax/post";
            printcon(chatId + ":" + userId + " Set to PWB: " + doPost(actionData, location));
            
            break; 
            
        case 4:
            //Set to Bum's Rusher
            var actionData = { 'chat': chatId, 'counter': parseInt(userId), 'set_group': 'mod2' };
            var location = "/chat_ajax/post";
            printcon(chatId + ":" + userId + " Set to BR: " + doPost(actionData, location));
            
            break;
            
        case 5:
            //Set to Gavel Slinger
            var actionData = { 'chat': chatId, 'counter': parseInt(userId), 'set_group': 'mod3' };
            var location = "/chat_ajax/post";
            printcon(chatId + ":" + userId + " Set to AGS: " + doPost(actionData, location));
            
            break;
            
        case 6:
            //Set to normal user.
            var actionData = { 'chat': chatId, 'counter': parseInt(userId), 'set_group': 'user' };
            var location = "/chat_ajax/post";
            printcon(chatId + ":" + userId + " Set to Normal: " + doPost(actionData, location));
            
            break;
            
        case 7:
            //Set to Silence
            var actionData = { 'chat': chatId, 'counter': parseInt(userId), 'set_group': 'silent' };
            var location = "/chat_ajax/post";
            printcon(chatId + ":" + userId + " Silenced: " + doPost(actionData, location));
            
            break;
            
        default:
            printcon("No selection.");
            
    }
    
}

function enhancedCookie(){
    var c = confirm("Cookies are VERY important. Someone can impersonate you if they have it, are you sure you want to display it in the console?");
    if (c)
        printcon("Your cookie: " + getCookie("session"));   
}

function addCookie(){
    var name = prompt("Enter profile name", "");
    var profile_cookie = $("#cookieInput").val();
    if(profile_cookie.length !== 36){
        printcon("Invalid cookie");
        return;
    }
    profiles[name] = profile_cookie;
    localStorage.setItem('profiles', JSON.stringify(profiles));
    refreshProfiles();
}

function refreshProfiles(){
    var profile_ls = localStorage.getItem('profiles');
    $('#enhancedCookieSelect')[0].options.length = 0;
    if(profile_ls === null)
        return;
    var profile_obj = JSON.parse(profile_ls);
    for (var key in profile_obj){
        profiles[key] = profile_obj[key];
    }
    for (var key in profiles){
        if(profiles[key] == getCookie('session')){
            $('#enhancedCookieSelect').append('<option value=' + profiles[key] + ' selected=true>' + key + '</option>');
        }else{
            $('#enhancedCookieSelect').append('<option value=' + profiles[key] + '>' + key + '</option>');
        }
    }
}

function switchProfile(){
    var selected = $('#enhancedCookieSelect').val();
    var pathArray = window.location.pathname.split( '/' );
    var pathLength = pathArray.length -1;
    var currPath = pathArray[pathLength];
    printcon(selected);
    $.ajax("/chat_ajax/quit", {'type': 'POST', data: {'chat': currPath}});
   	unsetCookie('session');
    setCookie('session', selected, 9001);
    location.reload(true);
}

function doPost(actionData, location){
    var returnResult = "";
    $.ajax({
        dataType: "json",
        type: "POST",
        url: location,
        data: actionData,
        async: false,
        complete: function (xhr, status) {
            if (status === 'error' || !xhr.responseText) {
                setReturnedData("Error: " + status);
            }
            else {
                var data = xhr.responseText;
                setReturnedData(data);
            }
        }
    });
    return getReturnedData();
}

function setReturnedData(data) {
    returnedData = data;
}

function getReturnedData() {
    return returnedData;   
}

function getCookie(cname){
    return $.cookie(cname);
}

function setCookie(cname, cvalue, exdays){
    $.removeCookie(cname);
    $.cookie(cname, cvalue, { expires: exdays, path: '/' });
}

function unsetCookie(cname){
    $.removeCookie(cname);
}

function printcon(data){
    var mainconsole = $('#console');
    mainconsole.append($('<div style="color: #FFF; background-color: rgba(0,0,0,.20);">' + data + '</div>'));
    mainconsole.animate({"scrollTop": mainconsole[0].scrollHeight}, "fast");
}

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

createUtils();