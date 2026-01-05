// ==UserScript==
// @name        DC - AntiSpam
// @author		Ladoria
// @namespace   InGame
// @match		http://www.dreadcast.net/Main
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.22
// @grant       none
// @description Kick all Spaming ad.
// @downloadURL https://update.greasyfork.org/scripts/7739/DC%20-%20AntiSpam.user.js
// @updateURL https://update.greasyfork.org/scripts/7739/DC%20-%20AntiSpam.meta.js
// ==/UserScript==

var activate = false;
var hardKick = true; //kick all ad form the same spam
var allUserKick = false; //kick all ad form all spam (same title)
var anonymousKick = false; //kick all ad form all spam (same title)
var count = 0;
var fakeTooltipCount = 0;
var delay = 1; //minutes
delay = delay * 60 * 1000;

var coockie_prefix = "DC_AntiSpam_";
var activate_settings = "#activate";
var allUserKick_settings = "#allUserKick";
var anonymousKick_settings = 'Deck.*';

var userToKick = new Array(); //settings

jQuery.noConflict();

$(document).ready( function() {
	function initialize() {
		if(undefined != getCookie('userToKick'))
			userToKick = getCookie('userToKick').split(',');
		
		if(-1 != $.inArray(activate_settings, userToKick))
			activate = true;
		
		if(-1 != $.inArray(allUserKick_settings, userToKick))
			allUserKick = true;
		
		if(-1 != $.inArray(anonymousKick_settings, userToKick))
			anonymousKick = true;
	}
	
	function initialize_html() {
		$('.petites_annonces .titre').append('<span id="AntiSpam">&nbsp;-&nbsp;LadoSpam&trade;&nbsp;&nbsp;<span id="AntiSpam_activate" class="btnTxt" title="Activer/Désactiver">OFF</span> | <span id="AntiSpam_allUserKick" class="btnTxt" title="Montrer ou non de la pitié envers les spameurs">é_è</span> | <span id="AntiSpam_anonymous" class="btnTxt" title="Annihiler ou non les anonymes">A</span> | <span id="AntiSpam_count" title="0 SPAM(s) détecté(s)">> <span>0</span> <</span>');
		
		if(true == activate)
			$('#AntiSpam_activate').html('ON');
			
		if(true == anonymousKick)
			$('#AntiSpam_anonymous').css({'textDecoration' : 'line-through'});
		
		if(true == allUserKick)
			$('#AntiSpam_allUserKick').html('è_é');
	}

	function KickThoseShittyFuckingBrainlessAnonymousStupidities() {
		//console.log('kicking...');
		
		//console.log(userToKick);
		
		show_all();
		
		if(false == activate)
			return;
		
		//console.log('kick enabled');
		
		count = 0;
		var ads = $('.petites_annonces tr');
		
		//skip if no ads
		if(0 == ads.length)
			return;
		
		var previousAd = ads.eq(0);
		
		for(var i = 0; i < ads.length; i++) {
			var ad = ads.eq(i);
		
			//console.log('scan : ' + i + ' ' + get_date(ad));
			
			//console.log('kick ' + get_name(ad) + '? ' + $.inArray(get_name(ad),userToKick));
			
			if(true == check_user(get_name(ad))) {
				hide_ad(ad);
				//console.log('hide for name : ' + get_name(ad));
			}
			
			//skip if no previous ad
			if(0 == i)
				continue;
			
			if(true == allUserKick || get_name(ad) == get_name(previousAd)) {
				//console.log('same name : ' + get_name(ad));
				
				if(get_title(ad) == get_title(previousAd)) {
					 //console.log('same title : ' + get_title(ad));
					 
					if(true == allUserKick || to_date(get_date(ad)).getTime() >= to_date(get_date(previousAd)).getTime() - delay) {
						//console.log('delay suffisant : ' + (to_date(get_date(ad)).getTime() - to_date(get_date(previousAd)).getTime()) + ' != ' + delay);
						
						hide_ad(ad);
						
						if(true == hardKick)
							hide_ad(previousAd);
					}
					
					//console.log('insuffisant delay : ' + (to_date(get_date(ad)).getTime() - to_date(get_date(previousAd)).getTime()));
				}
			}
			
			previousAd = ad;
		}
		
		$('#AntiSpam_count span').html(count);
		$('#AntiSpam_count').attr('title', count + ' SPAM(s) détecté(s)');
	}
	
	function check_user(user_name) {
		for(var i = 0; i < userToKick.length; i++) {
			if(true == new RegExp('^' + userToKick[i] + '$').test(user_name))
				return true;
		}
		
		return false;
	}
	
	function get_name(ad) {
		return ad.children('td').eq(0).html();
	}
	
	function get_title(ad) {
		return ad.children('td').eq(1).children('span').html();
	}
	
	function get_date(ad) {
		return ad.children('td').eq(2).html();
	}
	
	function to_date(text_date) {
		var day = text_date.substring(0,2);
		var month = text_date.substring(3,5);
		var year = text_date.substring(6,10);
		var hour = text_date.substring(11,13);
		var minute = text_date.substring(14,16);
		
		return new Date(year,month,day,hour,minute,0,0);
	}
	
	function hide_ad(ad) {
		if(ad.is(":visible"))
			count++;
	
		ad.hide();
		ad.addClass('AntiSpam');		
	}
	
	function show_all() {
		$('.petites_annonces tr').each( function() {
			$(this).show();
		});
		
		count = 0;
	}
	
	function toggle_settings(value) {
		if(-1 == $.inArray(value, userToKick))
			userToKick.push(value);
		else {
			userToKick = jQuery.grep(userToKick, function(_value) {
				return _value != value;
			});
		}
		
		//console.log(userToKick);
		
		saveCookie('userToKick',userToKick);
	}
	
	function notify_activation_to_user() {
		var initiale_color = $('#AntiSpam_activate').css('color');
		
		$('#AntiSpam_activate').css({'color' : 'red'});
		setTimeout(function() { $('#AntiSpam_activate').css({'color' : initiale_color}); }, 2000);
	}
	
	function show_tooltip(appendTo) {
		var fakeTooltipId = fakeTooltipCount++;
		
		appendTo.append('<div id="AntiSpam_tooltip' + fakeTooltipId + '" class="AntiSpam fakeToolTip"><div class="deco1"></div><span>Utiliser la fonction d\'annihilation des anonymes pour les decks.</span></div>');
	
		$('#AntiSpam_tooltip' + fakeTooltipId).fadeTo(300, 1,
			function() {
				setTimeout(
					function() { $('#AntiSpam_tooltip' + fakeTooltipId).fadeTo(300, 0,
						function() {$('#AntiSpam_tooltip' + fakeTooltipId).remove()}); }
				,2000)
		});
	};
	
	initialize();
	
	$(document).ajaxComplete( function(a,b,c) {
		if(/ItemAITL\/Annonce\/Find/.test(c.url)) {
			if(0 == $('#AntiSpam').length) {
				initialize_html();
				
				$('#AntiSpam_activate').on('click', function() {
					//console.log('AntiSpam_activate');
					
					activate = !activate;
					
					toggle_settings(activate_settings, userToKick);
					
					if(true == activate)
						$(this).html('ON');
					else
						$(this).html('OFF');
					
					KickThoseShittyFuckingBrainlessAnonymousStupidities();
				});
				
				$('#AntiSpam_allUserKick').on('click', function() {
					//console.log('AntiSpam_allUserKick');
					
					if(false == activate)
						notify_activation_to_user();
				
					allUserKick = !allUserKick;
					
					toggle_settings(allUserKick_settings, userToKick);
					
					if(true == allUserKick)
						$(this).html('è_é');
					else
						$(this).html('é_è');
					
					KickThoseShittyFuckingBrainlessAnonymousStupidities();
				});
				
				$('#AntiSpam_anonymous').click('click', function() {
					//console.log('AntiSpam_anonymous');
				
					if(false == activate)
						notify_activation_to_user();
					
					anonymousKick = !anonymousKick;
					
					toggle_settings(anonymousKick_settings, userToKick);
					
					if(true == anonymousKick)
						$(this).css({'textDecoration' : 'line-through'});
					else
						$(this).css({'textDecoration' : 'none'});
					
					KickThoseShittyFuckingBrainlessAnonymousStupidities();
				});
			}
			
			$('.petites_annonces tr').each(function() {
				//console.log('customize ad');
				
				var name_container = $(this).children('td').eq(0);
			
				name_container.attr('title', 'Cliquer pour atomiser l\'utilisateur.').css({'cursor' : 'pointer'});
			
				name_container.on('click', function() {
					var name = $(this).html();
					
					//console.log('handle : ' + name)
					
					//console.log(anonymousKick_settings + ' > ' + name + ' : ' + new RegExp(anonymousKick_settings).test(name));
					
					//do not save decks for cookie lenght problem
					if(false == new RegExp(anonymousKick_settings).test(name))
						toggle_settings(name, userToKick);
					else
						show_tooltip($(this));
					
					KickThoseShittyFuckingBrainlessAnonymousStupidities();
				});
			});
			
			KickThoseShittyFuckingBrainlessAnonymousStupidities();
		}
	});
	
	$('head').append('<style>#AntiSpam {font-size : 10px;text-transform: none;}.AntiSpam {color: red;}.AntiSpam.fakeToolTip {position: absolute;top: 40px;left: 0px;display: block;width: 300px;height: auto;color: white;}.AntiSpam.fakeToolTip .deco1 {left: 35px;}</style>');
});

// handle coockies
function saveCookie(name,val) {
	name = coockie_prefix + name;
	
	if(!navigator.cookieEnabled) return;
		document.cookie = name + '=' + val + ';expires=Wed, 01 Jan 2020 00:00:00 GMT; path=/';
}
function getCookie(var_name) {
	name = coockie_prefix + var_name;
	
	if(!navigator.cookieEnabled) return undefined;
	
	var start = document.cookie.indexOf(name + '=')
	if(start == -1) return undefined;
	start += name.length + 1;
	
	var end = document.cookie.indexOf(';',start);
	if (end == -1) end = document.cookie.lenght;
	
	return document.cookie.substring(start,end);
};

console.log('DC - AntiSpam started');