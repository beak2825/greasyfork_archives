// ==UserScript==
// @name        Ubuntu-it Mod Helper
// @description Ubuntu-it Mod Helper Script
// @require     http://code.jquery.com/jquery-1.9.1.js
// @include     http://forum.ubuntu-it.org/memberlist.php*
// @include     http://startrekitalia.net/memberlist.php*
// @grant       GM_xmlhttpRequest
// @version     0.20141227.01.01
// @namespace   https://greasyfork.org/users/3779
// @downloadURL https://update.greasyfork.org/scripts/8526/Ubuntu-it%20Mod%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/8526/Ubuntu-it%20Mod%20Helper.meta.js
// ==/UserScript==

var TOR_LIST = 'http://www.dan.me.uk/torlist/';

var console = unsafeWindow.console;

var knownEmailProviders = [
    'alice.it',
    'aruba.it',
//    'email.it',
    'fastwebnet.it',
    'gmail.com',
    'googlemail.com',
    'hotmail.it',
    'hotmail.com',
    'icloud.com',
    'iol.it',
    'inwind.it',
    'libero.it',
    'katamail.com',
    'katamail.it',
    'live.it',
    'live.com',
    'mclink.it',
    'mclink.net',
    'me.com',
    'msn.com',
    'outlook.com',
    'outlook.it',
    'poste.it',
    'studenti.unipd.it',
    'tim.it',
    'ubuntu.com',
    'ubuntu-it.org',
    'unibo.it',
    'teletu.it',
    'tin.it',
    'tiscali.it',
    'tiscalinet.it',
    'virgilio.it',
    'vodafone.it',
    'vogliaditerra.com',
    'yahoo.com',
    'yahoo.it'
];

if( !String.prototype.endsWith ){
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}

function checkIfBanned( user, id, ifBannedCallback, endCallback ){
	var url = './mcp.php?i=ban&mode=user&u=' + id;
	$.get(url,function(res){
		var opt = $('#unban option',$(res)).filter(function() {
			return $(this).text() === user;
		});
		var banned = opt.length > 0;
		if( banned ){
			var matchLength = "ban_length.*"+opt.val()+".*'(.*)'.*";
			var matchReason = "ban_reason.*"+opt.val()+".*= '(.*)';";
			ifBannedCallback( res.match(matchLength)[1], res.match(matchReason)[1].replace('\\','') );
		}
		endCallback();
	});
}

function isTor(address, torAddresses){
	return torAddresses.indexOf(address)>=0;
}

function doWork(torAddresses){
	if( $('#viewprofile').length ){
		var user = $('.details:first dd:first span').text();
		var id = $('.details:first dd:first a:last').attr('href').match('u=([0-9]+)')[1];
		checkIfBanned( user, id, function(l,r){
			if( l === 'Permanente' ){
				var text = 'UTENTE BANNATO per "'+r+'"';
			}else{
				var text = 'UTENTE SOSPESO '+l+' per "'+r+'"';
			}
			var $msg = $('<h4>')
				.css({
					padding: '4px',
					margin: '-15px 5px 5px 5px',
					borderRadius: '3px',
					color: "yellow",
					backgroundColor: 'red'
				})
				.text(text);
			$('#page-body h2:first').after($msg);
		});
	}else{
		$('a[href^="./memberlist.php?mode=viewprofile&u="]').each(function(){
			var $link = $(this);
			var href = $link.attr('href');
			var name = $link.text();
			var $locations = $link.parent().next().next();
			var user = $link.text();
			var id = href.replace('./memberlist.php?mode=viewprofile&u=','');
			checkIfBanned( 
				user, 
				id, 
				function(l,r){
					if( l === 'Permanente' ){
						var text = 'UTENTE BANNATO per "'+r+'"';
					}else{
						var text = 'UTENTE SOSPESO '+l+' per "'+r+'"';
					}
					var $msg = $('<div>')
						.css({
							padding: '4px',
							borderRadius: '3px',
							color: "yellow",
							backgroundColor: 'red'
						})
						.text(text);
					$link.parent().append($msg);
				},
				function(){
					
					$.get('http://forum.ubuntu-it.org/mcp.php?i=notes&mode=user_notes&u='+id,function(data){
						$('form td',$(data)).filter(function(){
							return (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/).test( $(this).text() );
						}).each(function(){
							var ip = $(this).text().trim();
							var ipText = ip;
							if( isTor(ip,torAddresses) ){
								ipText = '<span style="font-weight: bold; color: #a00;">TOR! '+ip+'</span>';
							}
							var linkText = $(this).next().next().text() + ' by '+ $(this).prev().text() + ' ' + $(this).next().text();
							var ipLink = $('<a href="http://www.infobyip.com/ip-'+ip+'.html" target="_blank" title="'+linkText+'">'+ipText+'</a>').css({ margin: 5 });
							$locations.append(ipLink);
						});
					})
					$.get(href,function(data){
						var maillink = $('a[href^="mailto"]',$(data));
						if( maillink ){
							var email = maillink.attr('href').substr(7);
							for( var p in knownEmailProviders ){
								if( email.endsWith( knownEmailProviders[p] ) ){
									$link.after(' ('+email+')');
									return;
								}
							}
							if( $('#email-warning').length === 0 ){
								$('.solo').append('<span id="email-warning" style="margin-left: 20px; font-size: 0.6em; color:#a00; background-color: yellow;">WARNING - ci sono <span style="font-weight: bold; font-size: 1.2em;" class="count">0</span> indirizzi email non riconosciuti in questa pagina</span>');
							}
							var $count = $('#email-warning .count');
							$count.text( parseInt( $count.text() ) + 1);
							$link.after(' (<span style="color: #a00; font-weight: bold;">'+email+'</span>)');
						}
					});
				}
			);
		});
	}
}

function LocalDBGet(key, defaultValue){
	defaultValue = defaultValue || null;
	var val = window.localStorage.getItem(key);
	return val === null ? defaultValue : JSON.parse(val);
}

function LocalDBSet(key, value){
	var val = JSON.stringify(value);
	window.localStorage.setItem(key,val);
}

function isUpdated(time){
	var delta = 1000*60*30;
	time = parseInt(time) + delta;
	return (time > getTime());
}

function getTime(){
	return new Date().getTime();
}

function getTorAddresses(callback){
	var torData = LocalDBGet('torData');
	if( torData && isUpdated(torData.time) ){
		console.log('torData loaded from cache');
		callback(torData.addresses);
	}else{
		GM_xmlhttpRequest({
			method: "GET",
			url: TOR_LIST,
			onload: function(response) {
				console.log('new torData request');
				var torData = {
					time: getTime(),
					addresses: response.responseText.split('\n')
				};
				LocalDBSet('torData',torData);
				callback(torData.addresses);
			},
			onerror: function(){
				callback([]);
			}
		});
	}
}

getTorAddresses( doWork );
